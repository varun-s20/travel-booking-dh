/* GET /api/checkout/<booking id>?key=<guest key>
   Where a checkout stands, for the page waiting on the airline or hotel:
   { status: confirmed | processing | awaiting_payment | failed, reference, code? }. */
import { ok, rateLimit, route } from '@/server/http';
import { checkoutFor } from '@/server/bookings/access';
import { outcomeOf } from '@/server/bookings/fulfil';

export const dynamic = 'force-dynamic';

export const GET = route<{ id: string }>(async (ctx, { id }) => {
  await rateLimit(ctx, 'checkout-status', 120, 600);
  const b = await checkoutFor(id, new URL(ctx.req.url).searchParams.get('key'));
  return ok(outcomeOf(b));
});
