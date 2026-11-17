/* =====================================================================
   Landfall server: customer price from supplier price
   The only place a markup is applied, so the price on every page, the
   amount Stripe takes and the amount stored all agree. Configured in
   .env.local (PRICE_MARKUP_PERCENT, PRICE_MARKUP_FIXED_CENTS); both 0
   until the client decides on a fee. Duffel is always paid its own
   price (supplier_amount on the booking).
   ===================================================================== */
import 'server-only';
import { env } from '@/server/env';

export function withMarkup(supplierMinor: number): number {
  const e = env();
  const pct = Math.round((supplierMinor * e.PRICE_MARKUP_PERCENT) / 100);
  return supplierMinor + pct + e.PRICE_MARKUP_FIXED_CENTS;
}
export const appCurrency = () => env().APP_CURRENCY;
