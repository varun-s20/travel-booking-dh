/* =====================================================================
   Landfall server: route handler toolkit
   Every API route is wrapped in route(), which gives it:
   - the response envelope the pages read: { data } or { errors: [{ code }] },
     with real HTTP statuses and no caching;
   - a request id in the x-request-id header and in every log line;
   - errors mapped to public codes (AppError), everything else logged and
     answered as internal_error with no detail;
   - CSRF protection for writes: the Origin (or Sec-Fetch-Site) must be
     this site, so another site can't post with the visitor's cookies.
   Plus JSON body parsing with a size cap and zod validation, client IP,
   and a Postgres fixed-window rate limiter.
   ===================================================================== */
import 'server-only';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { AppError, SupplyError, tooMany } from '@/server/errors';
import { ConfigError, appOrigin } from '@/server/env';
import { adminDb } from '@/server/db/supabase';
import { log } from '@/server/log';
import { ipHash } from '@/server/crypto';

export type Ctx = { req: Request; requestId: string; ip: string };
type Handler<P> = (ctx: Ctx, params: P) => Promise<Response>;

const NO_STORE = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' };

export function ok(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return Response.json({ data }, { status, headers: { ...NO_STORE, ...headers } });
}
export function fail(code: string, status: number, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}): Response {
  return Response.json({ errors: [{ code, status, ...extra }] }, { status, headers: { ...NO_STORE, ...headers } });
}

export function clientIp(req: Request): string {
  const h = req.headers;
  return (h.get('x-real-ip') || h.get('x-forwarded-for')?.split(',')[0] || '').trim() || '0.0.0.0';
}

/* Writes must come from this site. Browsers always send Origin on POST/PATCH/DELETE;
   Sec-Fetch-Site is a second signal. Server-to-server callers (webhooks, cron) opt out. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return false;
  if (!origin) return site === 'same-origin';
  const allowed = new Set([appOrigin(), new URL(req.url).origin]);
  return allowed.has(origin);
}

type Options = { csrf?: boolean };

export function route<P = Record<string, never>>(handler: Handler<P>, opts: Options = {}) {
  return async (req: Request, segment?: { params: Promise<P> }): Promise<Response> => {
    const requestId = req.headers.get('x-request-id') || randomUUID();
    const started = Date.now();
    const ctx: Ctx = { req, requestId, ip: clientIp(req) };
    const write = !['GET', 'HEAD', 'OPTIONS'].includes(req.method);
    let res: Response;
    try {
      if (write && opts.csrf !== false && !sameOrigin(req)) {
        res = fail('forbidden_origin', 403);
      } else {
        const params = segment ? await segment.params : ({} as P);
        res = await handler(ctx, params);
      }
    } catch (e) {
      res = toResponse(e, requestId);
    }
    res.headers.set('x-request-id', requestId);
    const ms = Date.now() - started;
    const path = new URL(req.url).pathname;
    if (res.status >= 500) log.error('http', { requestId, method: req.method, path, status: res.status, ms });
    else log.info('http', { requestId, method: req.method, path, status: res.status, ms });
    return res;
  };
}

function toResponse(e: unknown, requestId: string): Response {
  if (e instanceof AppError) return fail(e.code, e.status, e.extra, e.status === 429 && e.extra.retry_after ? { 'retry-after': String(e.extra.retry_after) } : {});
  if (e instanceof SupplyError) {
    const [code, status] = SUPPLY_HTTP[e.code];
    if (e.code === 'insufficient_balance') log.error('ALERT duffel_balance_empty', { requestId });
    else log.warn('supply_error', { requestId, code: e.code, message: e.message });
    return fail(code, status, e.code === 'invalid_passengers' ? { detail: e.detail } : {});
  }
  if (e instanceof ConfigError) {
    log.error('config_missing', { requestId, error: e });
    return fail('service_unavailable', 503);
  }
  log.error('unhandled', { requestId, error: e });
  return fail('internal_error', 500);
}

/* supplier refusals as the browser sees them */
const SUPPLY_HTTP: Record<SupplyError['code'], [string, number]> = {
  sold_out: ['sold_out', 409], expired: ['offer_expired', 409], price_changed: ['price_changed', 409],
  not_confirmed: ['not_confirmed', 409], already_booked: ['already_booked', 409], invalid_passengers: ['travelers_invalid', 422],
  timeout: ['supplier_unavailable', 503], unavailable: ['supplier_unavailable', 503], insufficient_balance: ['supplier_unavailable', 503]
};

/* ---- who is searching ----
   proxy.ts gives every browser an anonymous random id (cookie lf_vid, httpOnly). Search caches are
   keyed by a keyed hash of it, so customers sharing an office or mobile network never share a
   search (Duffel books one order per search); without the cookie, the IP is used instead. */
export const VISITOR_COOKIE = 'lf_vid';
export function visitorKey(ctx: Ctx): string {
  const m = /(?:^|;\s*)lf_vid=([0-9a-f-]{36})(?:;|$)/i.exec(ctx.req.headers.get('cookie') ?? '');
  return m ? ipHash(`vid:${m[1].toLowerCase()}`) : ipHash(ctx.ip);
}

/* ---- request bodies ---- */
const MAX_BODY = 64 * 1024;

export async function readJson<S extends z.ZodType>(req: Request, schema: S): Promise<z.infer<S>> {
  const len = Number(req.headers.get('content-length') || 0);
  if (len > MAX_BODY) throw new AppError('payload_too_large', 413);
  const type = req.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw new AppError('unsupported_media_type', 415);
  const text = await req.text();
  if (text.length > MAX_BODY) throw new AppError('payload_too_large', 413);
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new AppError('invalid_json', 400); }
  return parse(schema, raw);
}

export function readQuery<S extends z.ZodType>(req: Request, schema: S): z.infer<S> {
  return parse(schema, Object.fromEntries(new URL(req.url).searchParams.entries()));
}

export function parse<S extends z.ZodType>(schema: S, raw: unknown): z.infer<S> {
  const r = schema.safeParse(raw);
  if (!r.success) {
    const fields = r.error.issues.slice(0, 20).map((i) => ({ path: i.path.join('.'), message: i.message }));
    throw new AppError('validation_failed', 422, undefined, { fields });
  }
  return r.data;
}

/* ---- rate limiting ----
   Fixed window in Postgres (rate_limit_hit), shared by every server instance.
   If the database can't answer, the request goes through and the failure is
   logged: a limiter outage must not take bookings down with it. */
export async function rateLimit(ctx: Ctx, bucket: string, max: number, windowSeconds: number, subject?: string): Promise<void> {
  const key = `${bucket}:${subject ?? ipHash(ctx.ip)}`;
  try {
    const { data, error } = await adminDb().rpc('rate_limit_hit', { p_key: key, p_window_seconds: windowSeconds, p_max: max });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    if (row && !row.allowed) {
      const retry = Math.max(1, Math.ceil((Date.parse(row.reset_at) - Date.now()) / 1000));
      throw tooMany(retry);
    }
  } catch (e) {
    if (e instanceof AppError) throw e;
    log.warn('rate_limit.unavailable', { requestId: ctx.requestId, bucket, error: e });
  }
}
