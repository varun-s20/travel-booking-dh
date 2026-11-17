/* =====================================================================
   Landfall server: Duffel HTTP client
   A small typed wrapper over fetch instead of @duffel/api, because the
   SDK can't set timeouts (orders need at least 130s) or send headers
   (fraud signals, correlation ids). Rules from Duffel's docs:
   - headers: Duffel-Version v2, Accept and Content-Type JSON; bodies are
     wrapped in { data };
   - retries only for calls that are safe to repeat (reads and searches),
     on 429 (after ratelimit-reset), 503, 504 and network failures;
   - never retry order or booking creation: a 500 or 502 there may still
     have booked, and the caller must check the supplier first.
   Logs method, path, status, timing and Duffel's request id; never bodies.
   ===================================================================== */
import 'server-only';
import { need } from '@/server/env';
import { log } from '@/server/log';
import type { DuffelErrorItem } from './types';

const BASE = 'https://api.duffel.com';

export class DuffelApiError extends Error {
  constructor(
    public status: number,
    public errors: DuffelErrorItem[],
    public requestId: string | null,
    /* true when the request may have taken effect (timeouts, 5xx on writes) */
    public ambiguous: boolean
  ) {
    super(errors[0]?.message || `Duffel request failed (${status})`);
    this.name = 'DuffelApiError';
  }
  get code(): string { return this.errors[0]?.code ?? (this.status === 0 ? 'network_error' : `http_${this.status}`); }
  get type(): string { return this.errors[0]?.type ?? ''; }
}

type Options = {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeoutMs?: number;
  /* safe to send again after a transient failure */
  retry?: boolean;
  /* the customer's device, for Duffel's fraud checks on orders and bookings */
  device?: { ip?: string; userAgent?: string };
};

export type DuffelResponse<T> = { data: T; meta?: { after?: string | null; before?: string | null; limit?: number }; requestId: string | null };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function duffel<T>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, opts: Options = {}): Promise<DuffelResponse<T>> {
  const token = need('DUFFEL_ACCESS_TOKEN', 'Duffel');
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined) url.searchParams.set(k, String(v));
  const headers: Record<string, string> = {
    authorization: `Bearer ${token}`,
    'duffel-version': 'v2',
    accept: 'application/json',
    'accept-encoding': 'gzip'
  };
  if (opts.body !== undefined) headers['content-type'] = 'application/json';
  if (opts.device?.ip) headers['x-duffel-device-ip'] = opts.device.ip;
  if (opts.device?.userAgent) headers['x-duffel-device-user-agent'] = opts.device.userAgent.slice(0, 500);
  const body = opts.body !== undefined ? JSON.stringify({ data: opts.body }) : undefined;
  const attempts = opts.retry ? 3 : 1;
  const timeoutMs = opts.timeoutMs ?? 30000;

  for (let attempt = 1; ; attempt++) {
    const started = Date.now();
    let res: Response;
    try {
      res = await fetch(url, { method, headers, body, signal: AbortSignal.timeout(timeoutMs), cache: 'no-store' });
    } catch (e) {
      const timedOut = (e as Error)?.name === 'TimeoutError' || (e as Error)?.name === 'AbortError';
      log.warn('duffel.network', { method, path, attempt, timedOut, ms: Date.now() - started });
      if (attempt < attempts) { await sleep(backoff(attempt)); continue; }
      throw new DuffelApiError(0, [{ type: 'api_error', title: timedOut ? 'Timeout' : 'Network error', message: String((e as Error)?.message ?? e), code: timedOut ? 'timeout' : 'network_error' }], null, method !== 'GET');
    }
    const requestId = res.headers.get('x-request-id');
    const ms = Date.now() - started;
    const remaining = res.headers.get('ratelimit-remaining');
    if (res.ok) {
      log.info('duffel', { method, path, status: res.status, ms, duffelRequestId: requestId, rateRemaining: remaining });
      if (res.status === 204) return { data: undefined as T, requestId };
      const json = (await res.json()) as { data: T; meta?: DuffelResponse<T>['meta'] };
      return { data: json.data, meta: json.meta, requestId };
    }
    let errors: DuffelErrorItem[] = [];
    try { errors = ((await res.json()) as { errors?: DuffelErrorItem[] }).errors ?? []; } catch { /* non-JSON error body */ }
    log.warn('duffel.error', { method, path, status: res.status, ms, duffelRequestId: requestId, codes: errors.map((x) => x.code) });
    const transient = res.status === 429 || res.status === 503 || res.status === 504;
    if (opts.retry && transient && attempt < attempts) {
      await sleep(res.status === 429 ? retryAfterMs(res) : backoff(attempt));
      continue;
    }
    /* a write that failed with 500/502/504 may still have gone through on the airline's side */
    const ambiguous = method !== 'GET' && (res.status === 500 || res.status === 502 || res.status === 504);
    throw new DuffelApiError(res.status, errors, requestId, ambiguous);
  }
}

function backoff(attempt: number): number {
  return Math.min(4000, 400 * 2 ** (attempt - 1)) + Math.floor(Math.random() * 250);
}
function retryAfterMs(res: Response): number {
  const reset = res.headers.get('ratelimit-reset');
  const at = reset ? Date.parse(reset) : NaN;
  return Number.isFinite(at) ? Math.min(Math.max(at - Date.now(), 500), 5000) : 2000;
}
