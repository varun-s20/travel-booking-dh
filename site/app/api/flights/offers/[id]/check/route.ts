/* Simulated single-offer request before the traveler form: the price can
   go up or down, the seats can sell out, and offers expire 30 minutes
   after their search (lib/mock/flights.ts, priceCheck). */
import { findOffer, isFare, priceCheck } from '@/lib/mock/flights';
import { between, body, fail, ok, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const b = await body<{ fare?: string }>(req);
  const found = findOffer(id);
  if (!found) return fail('offer_not_found', 404);
  const fare = isFare(b?.fare) ? b!.fare : 'light';
  await wait(between(700, 1100));
  return ok(priceCheck(found.offer, fare));
}
