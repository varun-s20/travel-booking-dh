'use client';
/* =====================================================================
   Landfall: calling the site's own API from the browser
   Every route answers { data } or { errors: [{ code, status, ... }] }
   (server/http.ts). api() returns { data } or { error }, never throws,
   and turns a network failure into { error: { code: 'network' } }, so
   each caller handles every outcome with plain branches.
   ===================================================================== */

export type ApiError = { code: string; status: number; [key: string]: unknown };
export type ApiResult<T> = { data: T; error?: undefined } | { data?: undefined; error: ApiError };

export async function api<T>(path: string, init: { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown; signal?: AbortSignal } = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      method: init.method ?? 'GET',
      headers: init.body !== undefined ? { 'content-type': 'application/json' } : undefined,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      credentials: 'same-origin',
      cache: 'no-store',
      signal: init.signal
    });
    const json = (await res.json().catch(() => null)) as { data?: T; errors?: ApiError[] } | null;
    if (json?.errors?.length) return { error: { ...json.errors[0], status: json.errors[0].status ?? res.status } };
    if (!res.ok || !json || json.data === undefined) return { error: { code: res.status === 429 ? 'too_many_requests' : 'internal_error', status: res.status } };
    return { data: json.data };
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return { error: { code: 'aborted', status: 0 } };
    return { error: { code: 'network', status: 0 } };
  }
}

/* a random id for one checkout attempt: the server makes at most one booking per key */
export function newCheckoutKey(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
