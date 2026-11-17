/* GET /api/flights/search?from&to&depart&return&adults&children&infants&cabin
   Flight results for the results page. The same visitor's repeated search within a few minutes
   reuses the stored one (server/flights.ts). Rate limited: each search costs a supplier request. */
import { ok, rateLimit, route, visitorKey } from '@/server/http';
import { searchFlights } from '@/server/flights';
import { unprocessable } from '@/server/errors';
import { parseFlightSearch } from '@/lib/travel/flights';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const GET = route(async (ctx) => {
  const q = Object.fromEntries(new URL(ctx.req.url).searchParams.entries());
  const parsed = parseFlightSearch(q);
  if (!parsed || !parsed.complete) throw unprocessable('invalid_search');
  await rateLimit(ctx, 'flight-search', 20, 60);
  return ok(await searchFlights(parsed.search, visitorKey(ctx)));
});
