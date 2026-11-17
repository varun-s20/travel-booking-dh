/* POST /api/checkout
   Starts a checkout: revalidates the fare or rate with the supplier, records the booking and
   creates the Stripe payment for the server's price. Answers the client secret for the Payment
   Element (and a guest key when signed out), or 409 price_changed { before, after } /
   sold_out / offer_expired / rate_expired, or 422 travelers_invalid { problems }.
   Body: see server/bookings/schemas.ts (checkoutInput). */
import { ok, rateLimit, readJson, route } from '@/server/http';
import { getUser } from '@/server/auth';
import { checkoutInput } from '@/server/bookings/schemas';
import { startCheckout } from '@/server/bookings/checkout';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const POST = route(async (ctx) => {
  await rateLimit(ctx, 'checkout', 20, 600);
  const input = await readJson(ctx.req, checkoutInput);
  const user = await getUser();
  return ok(await startCheckout(input, user, ctx), 201);
});
