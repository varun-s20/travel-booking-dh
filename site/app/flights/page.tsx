/* =====================================================================
   travel-booking (working name Overwing, a placeholder): flight results
   The pinned compact search, the route as H1 with its meta line, then
   the results (components/flights/FlightResults.tsx), which run the
   search and show the searching state first. A search without dates or
   travelers (destination cards) is filled in and the URL rewritten; no
   route at all opens the home search. Copy: content/copy.md, Flights.
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Search } from '@/components/search/Search';
import { FlightResults } from '@/components/flights/FlightResults';
import { parseFlightSearch, searchQuery } from '@/lib/mock/flights';
import { flightMeta, routeTitle } from '@/lib/text';
import { cityOf } from '@/lib/mock/flights';
import { Photo } from '@/components/Photo';
import { DESTINATIONS } from '@/lib/data/destinations';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const parsed = parseFlightSearch(await searchParams);
  if (!parsed) return { title: 'Flights' };
  const a = cityOf(parsed.search.from), b = cityOf(parsed.search.to);
  return {
    title: `Flights from ${a} to ${b}`,
    description: `Compare flights from ${a} to ${b} by price, stops and travel time, with taxes and fees in every total.`
  };
}

export default async function FlightsPage({ searchParams }: Props) {
  const parsed = parseFlightSearch(await searchParams);
  if (!parsed) redirect('/#search');
  const { search, complete } = parsed;
  const query = searchQuery(search);
  if (!complete) redirect(`/flights?${query}`);
  const dest = DESTINATIONS.find((d) => d.code === search.to);

  return (
    <div className="t-results">
      <div className="o-pinned">
        <Search key={query} variant="compact" initial={{ mode: 'flights', flights: search }} />
      </div>
      <div className="b-wrap">
        {/* revision 2026-11-11, item 22: the destination in a 72 x 96 cabin window beside the title, when it has a photo */}
        <div className={`o-pageHead${dest ? ' -window' : ''}`}>
          {dest && (
            <span className="a-porthole" aria-hidden="true">
              <Photo name={dest.image} alt="" sizes="72px" className="a-porthole__img" />
            </span>
          )}
          <div className="o-pageHead__text">
            <h1 className="a-h1">{routeTitle(search.from, search.to)}</h1>
            <p className="o-pageHead__meta">{flightMeta(search.depart, search.ret, search, search.cabin)}</p>
          </div>
        </div>
        <FlightResults key={query} query={query} search={search} />
      </div>
    </div>
  );
}
