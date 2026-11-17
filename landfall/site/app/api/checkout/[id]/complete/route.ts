/* POST /api/checkout/<booking id>/complete { guestKey? }
   Called right after Stripe confirms the card in the browser. Books with the airline or hotel,
   then captures the payment (or releases it if the supplier refuses). Answers
   { status: confirmed | processing | awaiting_payment | failed, reference, code? }.
   processing means the supplier hasn't answered yet: poll GET /api/checkout/<id>. */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { checkoutFor } from '@/server/bookings/access';
import { fulfil } from '@/server/bookings/fulfil';

export const dynamic = 'force-dynamic';
/* Duffel can take up to 120 seconds to create an order */
export const maxDuration = 300;

const Body = z.object({ guestKey: z.string().max(100).optional() });

export const POST = route<{ id: string }>(async (ctx, { id }) => {
  await rateLimit(ctx, 'checkout-complete', 30, 600);
  const { guestKey } = await readJson(ctx.req, Body);
  const b = await checkoutFor(id, guestKey);
  return ok(await fulfil(b.id, 'client'));
});
