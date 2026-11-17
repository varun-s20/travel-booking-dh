/* =====================================================================
   Landfall server: errors with a public code
   AppError carries the code the browser receives ({ errors: [{ code }] })
   and the HTTP status. Anything else that escapes a route is logged and
   answered as `internal_error`, never with its message or stack.
   ===================================================================== */
import 'server-only';

export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message?: string,
    public extra: Record<string, unknown> = {}
  ) {
    super(message ?? code);
    this.name = 'AppError';
  }
}

export const badRequest = (code = 'invalid_request', extra?: Record<string, unknown>) => new AppError(code, 400, undefined, extra);
export const unprocessable = (code: string, extra?: Record<string, unknown>) => new AppError(code, 422, undefined, extra);
export const unauthorized = () => new AppError('unauthorized', 401);
export const forbidden = () => new AppError('forbidden', 403);
export const notFound = (code = 'not_found') => new AppError(code, 404);
export const conflict = (code: string, extra?: Record<string, unknown>) => new AppError(code, 409, undefined, extra);
export const tooMany = (retryAfter: number) => new AppError('too_many_requests', 429, undefined, { retry_after: retryAfter });
export const unavailable = (code = 'service_unavailable') => new AppError(code, 503);

/* A supplier refusal the UI has words for (sold out, price changed...) */
export class SupplyError extends Error {
  constructor(
    public code: 'sold_out' | 'expired' | 'price_changed' | 'not_confirmed' | 'invalid_passengers' | 'timeout' | 'unavailable' | 'insufficient_balance' | 'already_booked',
    message?: string,
    /* true when the supplier may or may not have booked: never release the payment on these */
    public ambiguous = false,
    public detail: Record<string, unknown> = {}
  ) {
    super(message ?? code);
    this.name = 'SupplyError';
  }
}
