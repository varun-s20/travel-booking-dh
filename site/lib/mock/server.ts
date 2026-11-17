/* =====================================================================
   travel-booking (working name Overwing, a placeholder): route handler
   helpers for the simulated backend. Latency so the searching and
   progress states are seen (spec 3b: 1.2 to 2.5s on searches), JSON
   replies in Duffel's { data } and { errors } shapes, and no caching.
   ===================================================================== */
export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const between = (a: number, b: number) => a + Math.random() * (b - a);

export function ok(data: unknown, status = 200): Response {
  return Response.json({ data }, { status, headers: { 'cache-control': 'no-store' } });
}
/* Simulated failures answer 200 with { errors } and the status they stand for. The browser logs every 4xx and
   5xx as a console error, and in production these come back from our own backend as a result to show (as
   Stripe.js resolves a decline with { error } rather than failing the request), not as a broken request. */
export function fail(code: string, status: number, extra: Record<string, unknown> = {}): Response {
  return Response.json({ errors: [{ code, status, ...extra }] }, { status: 200, headers: { 'cache-control': 'no-store' } });
}
export async function body<T>(req: Request): Promise<T | null> {
  try { return (await req.json()) as T; } catch { return null; }
}
export function query(req: Request): Record<string, string> {
  return Object.fromEntries(new URL(req.url).searchParams.entries());
}
