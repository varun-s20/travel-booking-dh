/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): guest form
   Group H. The chosen rate comes from ?plan=<rate id>, resolved on the
   server from the rates the hotel page stored (server/stays.ts getRate):
   the hotel, the room, the one rate and the search it was priced for.
   An unknown or expired rate (rates last about 30 minutes) goes back to
   the hotel page with the stay, to choose again. ?room= is kept in URLs
   for older links, but the rate is what counts.
   Copy: landfall/content/copy.md, Guest form. noindex (layout).
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getRate } from '@/server/stays';
import { cityById, isPlan, parseStaySearch, stayQuery } from '@/lib/travel/hotels';
import Guests from '@/components/hotels/Guests';

type Props = { params: Promise<{ hotel: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: 'Guest details', robots: { index: false, follow: false } };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

export default async function GuestsPage({ params, searchParams }: Props) {
  const id = (await params).hotel;
  const q = await searchParams;
  const planId = one(q.plan);
  const rate = isPlan(planId) ? await getRate(planId) : null;
  if (!rate || rate.hotel.id !== id) {
    /* back to the hotel with the stay the visitor had, to pick a room again */
    const place = cityById(one(q.place)) ? one(q.place) : '';
    const parsed = place && one(q.checkin) ? parseStaySearch(q, place) : null;
    redirect(`/hotels/${encodeURIComponent(id)}${parsed?.complete ? `?${stayQuery(parsed.search)}` : ''}`);
  }
  return (
    <div className="t-page t-guests">
      <Guests hotel={rate.hotel} room={{ ...rate.room, plans: [rate.plan] }} search={rate.search} plan={rate.plan.id} />
    </div>
  );
}
