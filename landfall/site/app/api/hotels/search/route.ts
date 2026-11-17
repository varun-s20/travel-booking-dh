/* GET /api/hotels/search?place&checkin&checkout&adults&children&rooms
   Hotel results: each hotel with its cheapest rate for the stay, all rooms, taxes included. */
import { ok, rateLimit, route } from '@/server/http';
import { searchStays } from '@/server/stays';
import { unprocessable } from '@/server/errors';
import { parseStaySearch } from '@/lib/travel/hotels';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const GET = route(async (ctx) => {
  const q = Object.fromEntries(new URL(ctx.req.url).searchParams.entries());
  const parsed = parseStaySearch(q);
  if (!parsed || !parsed.complete || !parsed.search.place) throw unprocessable('invalid_search');
  await rateLimit(ctx, 'stay-search', 20, 60);
  return ok({ results: await searchStays(parsed.search) });
});
