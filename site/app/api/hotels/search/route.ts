/* Simulated Duffel Stays search: the cheapest available room per hotel, with its default rate plan.
   Tokyo answers in about 5s ("Still looking"); Sydney fails the first
   time and works on "Try again" (handover.md demo states). */
import { LOWER_RATE_NAME, parseStaySearch, searchStays } from '@/lib/mock/hotels';
import { between, fail, ok, query, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const q = query(req);
  const parsed = parseStaySearch(q);
  if (!parsed) return fail('invalid_search', 422);
  const s = parsed.search;
  await wait(s.place === 'tokyo' ? between(4800, 5400) : between(1200, 2500));
  if (s.place === 'sydney' && q.retry !== '1') return fail('supplier_timeout', 503);
  const results = searchStays(s).map((r) => ({
    id: r.hotel.id, room: r.room.id, nightly: r.amounts.nightly, total: r.amounts.total,
    freeCancel: r.freeCancel, breakfast: r.breakfast, distance: r.distance,
    plan: r.plan.id, planName: r.plan.name, roomName: r.room.name, beds: r.room.beds, roomsLeft: r.roomsLeft,
    hasFreeCancel: r.hasFreeCancel, hasBreakfast: r.hasBreakfast,
    /* a lower rate (catalogue section 5) on these dates: the saving against the usual price, and the rate's name */
    saving: r.amounts.saving ?? 0, lower: r.amounts.lower ? LOWER_RATE_NAME[r.amounts.lower] : ''
  }));
  return ok({ results });
}
