/* Simulated Duffel offer request: every offer for a search, after a wait
   (long-haul about 5s, so "Still looking" shows). Toronto to Cape Town
   fails the first time and works on "Try again" (handover.md demo states). */
import { dayLows, generateOffers, parseFlightSearch } from '@/lib/mock/flights';
import { distanceKm } from '@/lib/mock/geo';
import { between, fail, ok, query, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const q = query(req);
  const parsed = parseFlightSearch(q);
  if (!parsed) return fail('invalid_search', 422);
  const s = parsed.search;
  await wait(distanceKm(s.from, s.to) > 9000 ? between(4800, 5400) : between(1200, 2500));
  if (s.from === 'YYZ' && s.to === 'CPT' && q.retry !== '1') return fail('airline_timeout', 503);
  const searchedAt = Date.now();
  /* the date strip (spec B1.1): the lowest total on each of 7 date pairs around the search, from the same offers */
  return ok({ searchedAt, offers: generateOffers(s, searchedAt), days: dayLows(s) });
}
