/* =====================================================================
   travel-booking (working name Overwing, a placeholder): hotel results
   The pinned compact search on its Hotels tab, "Hotels in Lisbon" with
   its meta line, then the list and map (components/hotels/
   HotelResults.tsx). A search without dates is filled in and the URL
   rewritten; no city opens the home search on Hotels.
   Copy: content/copy.md, Hotels.
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Search } from '@/components/search/Search';
import { HotelResults } from '@/components/hotels/HotelResults';
import { cityById, parseStaySearch, stayQuery, typeFromParam } from '@/lib/mock/hotels';
import { stayMeta } from '@/lib/text';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const parsed = parseStaySearch(await searchParams);
  const city = parsed && cityById(parsed.search.place)?.name;
  if (!city) return { title: 'Hotels' };
  return { title: `Hotels in ${city}`, description: `Compare hotels in ${city} by price per night, area and cancellation terms, with taxes and fees in every total.` };
}

export default async function HotelsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const parsed = parseStaySearch(sp);
  if (!parsed) redirect('/#search-hotels');
  const { search, complete } = parsed;
  const query = stayQuery(search);
  /* a property type from the homepage tiles (spec A8: type=boutique) pre-selects the filter and survives the date fill-in */
  const typeParam = typeof sp.type === 'string' ? sp.type : undefined;
  const type = typeFromParam(typeParam);
  if (!complete) redirect(`/hotels?${query}${type && typeParam ? `&type=${encodeURIComponent(typeParam)}` : ''}`);
  const city = cityById(search.place)!.name;
  return (
    <div className="t-results">
      <div className="o-pinned">
        <Search key={query} variant="compact" initial={{ mode: 'hotels', hotels: search }} />
      </div>
      <div className="b-wrap">
        <div className="o-pageHead">
          <h1 className="a-h1">Hotels in {city}</h1>
          <p className="o-pageHead__meta">{stayMeta(search)}</p>
        </div>
        <HotelResults key={`${query}:${type ?? ''}`} query={query} search={search} cityName={city} initialType={type} />
      </div>
    </div>
  );
}
