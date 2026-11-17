/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): hotel results
   Group H. The search comes from the query: no city goes back to the
   home search; a city with no dates asks for dates ("Add dates for
   prices", Kasa); dates without the party are rewritten to the full URL
   (plumbing.md item 12). A property type link with no city asks for a
   destination (a supplier searches one city at a time).
   components/hotels/Results.tsx runs the search (/api/hotels/search).
   Copy: landfall/content/copy.md, Hotels, Results.
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cityById, parseStaySearch, stayQuery } from '@/lib/travel/hotels';
import CompactSearch from '@/components/search/CompactSearch';
import Results from '@/components/hotels/Results';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const parsed = parseStaySearch(await searchParams);
  const city = parsed ? cityById(parsed.search.place)?.name : null;
  if (!city) return { title: 'Stays' };
  return {
    title: `Hotels in ${city}`,
    description: `Compare hotels in ${city} by price per night, area and cancellation terms, with taxes and fees in every total.`
  };
}

export default async function HotelsPage({ searchParams }: Props) {
  const q = await searchParams;
  /* with no place, any filter in the query keeps the page (a removed type chip must not bounce home) */
  const parsed = parseStaySearch(q) ?? (!q.place && Object.keys(q).length ? parseStaySearch({ ...q, type: 'any' }) : null);
  if (!parsed) redirect('/#search');
  const dated = !!q.checkin;
  /* a property type link may come with no place; the filters ride along in the same query */
  const type = typeof q.type === 'string' ? q.type : undefined;
  const typeOnly = !parsed.search.place ? (type && type !== 'any' && !type.includes(',') ? type : '') : undefined;
  if (dated && !parsed.complete) {
    const keep = new URLSearchParams(stayQuery(parsed.search));
    for (const [k, v] of Object.entries(q)) if (typeof v === 'string' && !keep.has(k)) keep.set(k, v);
    redirect(`/hotels?${keep.toString()}`);
  }
  return (
    <div className="t-page -search t-hotels">
      {parsed.search.place ? <CompactSearch stays={parsed.search} dateless={!dated} /> : <CompactSearch />}
      <Results search={parsed.search} dated={dated} typeOnly={typeOnly} />
    </div>
  );
}
