/* POST /api/flights/offers/<id>/check { fare }
   Fare and availability revalidation: the fare's current price from the supplier, compared with
   the price on the page. Answers ok, up or down (with the new total), sold_out or expired. */
import { z } from 'zod';
import { ok, rateLimit, readJson, route } from '@/server/http';
import { checkFare } from '@/server/flights';
import { FARE_TIERS, type FareId } from '@/lib/travel/flights';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const Body = z.object({ fare: z.enum(FARE_TIERS as [string, ...string[]]).default('light') });

export const POST = route<{ id: string }>(async (ctx, { id }) => {
  await rateLimit(ctx, 'fare-check', 30, 60);
  const { fare } = await readJson(ctx.req, Body);
  return ok(await checkFare(id, fare as FareId));
});
