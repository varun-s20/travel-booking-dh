/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): hotel detail
   Group H. The hotel from the path, the stay from the query (no dates:
   "Add dates for prices"; dates without the party: the full URL).
   Backend (2026-11-15): the hotel comes from server/stays.ts getHotel
   (Duffel Stays, or the simulated catalogue): with dates, every room's
   rates priced for the search, each stored so the guest form and
   checkout can resolve ?plan=<rate id>. `srr` (Duffel's search result
   id, from the results page) fetches those rates without a new search.
   One load per request (React cache), shared by the metadata and page.
   components/hotels/Detail.tsx draws the page.
   Copy: landfall/content/copy.md, Hotel detail.
   ===================================================================== */
import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getHotel } from '@/server/stays';
import { cityById, parseStaySearch, stayQuery, type StaySearch } from '@/lib/travel/hotels';
import CompactSearch from '@/components/search/CompactSearch';
import Detail from '@/components/hotels/Detail';

type Query = Record<string, string | string[] | undefined>;
type Props = { params: Promise<{ hotel: string }>; searchParams: Promise<Query> };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

/* the stay from the query: the place when it is one of the site's cities, otherwise no place */
function stayFrom(q: Query): { search: StaySearch; complete: boolean; dated: boolean } {
  const place = cityById(one(q.place)) ? one(q.place) : '';
  const parsed = (place ? parseStaySearch(q, place) : null) ?? parseStaySearch({ ...q, place: undefined, type: 'any' })!;
  return { ...parsed, dated: !!one(q.checkin) };
}

/* one supplier call per request, however many times the page asks */
const load = cache(async (id: string, key: string, dated: boolean, srr: string) => {
  const { search } = stayFrom(Object.fromEntries(new URLSearchParams(key)));
  return getHotel(id, dated ? search : null, srr || null);
});

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const id = (await params).hotel;
  const q = await searchParams;
  const s = stayFrom(q);
  if (s.dated && !s.complete) return {};
  const found = await load(id, stayQuery(s.search), s.dated, one(q.srr));
  if (!found) return {};
  const h = found.hotel;
  const city = cityById(h.city)?.name ?? '';
  return {
    title: city ? `${h.name}, ${city}` : h.name,
    description: `Rooms, prices and policies for ${h.name}${h.area ? ` in ${h.area}` : ''}${city ? `, ${city}` : ''}. Choose a room and see the total for your dates.`
  };
}

export default async function HotelPage({ params, searchParams }: Props) {
  const id = (await params).hotel;
  const q = await searchParams;
  const s = stayFrom(q);
  const srr = one(q.srr);
  if (s.dated && !s.complete) redirect(`/hotels/${encodeURIComponent(id)}?${stayQuery(s.search)}${srr ? `&srr=${encodeURIComponent(srr)}` : ''}`);
  const found = await load(id, stayQuery(s.search), s.dated, srr);
  if (!found) notFound();
  const { hotel, similar } = found;
  /* a link without a place (recently viewed): the hotel's own city, when it is one of the site's */
  const search = !s.search.place && cityById(hotel.city) ? { ...s.search, place: hotel.city } : s.search;
  return (
    <div className="t-page -search t-hotel">
      <CompactSearch stays={search} dateless={!s.dated} />
      <Detail hotel={hotel} search={search} dated={s.dated} similar={similar} />
    </div>
  );
}
