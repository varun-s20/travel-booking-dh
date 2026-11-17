/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): flight results
   Group F. The search comes from the query; a search with no route goes
   back to the home search, and one that had dates or travelers filled in
   is rewritten to its full URL (plumbing.md item 12). The pinned compact
   search sits at the top; components/flights/Results.tsx runs the search
   (GET /api/flights/search).
   The 7-day strip is dates only: pricing each date would cost a supplier
   search per date on every visit, so every cell's lowest is null.
   Copy: landfall/content/copy.md, Flights, Results.
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cityOf, parseFlightSearch, searchQuery, todayIso } from '@/lib/travel/flights';
import { addIsoDays } from '@/lib/format';
import CompactSearch from '@/components/search/CompactSearch';
import Results, { type ResultsInit } from '@/components/flights/Results';

/* the filter and sort keys Results keeps in the URL (components/flights/Results.tsx, toUrl) */
const RESULT_URL_KEYS = ['sort', 'stops', 'need', 'air', 'dout', 'aout', 'dret', 'aret', 'dur', 'lay', 'lap', 'price'];

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const parsed = parseFlightSearch(await searchParams);
  if (!parsed) return {};
  const from = cityOf(parsed.search.from), to = cityOf(parsed.search.to);
  return {
    title: `Flights from ${from} to ${to}`,
    description: `Compare flights from ${from} to ${to} by price, stops and travel time, with taxes and fees in every total.`
  };
}

export default async function FlightsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const parsed = parseFlightSearch(sp);
  if (!parsed) redirect('/#search');
  if (!parsed.complete) redirect(`/flights?${searchQuery(parsed.search)}`);
  /* round 3: filters and sort from the URL, and the 7-day strip (the depart date, 3 days either side) */
  const init: ResultsInit = {};
  for (const k of RESULT_URL_KEYS) { const v = sp[k]; if (typeof v === 'string') init[k] = v; }
  const s = parsed.search;
  const dates = [-3, -2, -1, 0, 1, 2, 3].map((d) => ({ date: addIsoDays(s.depart, d), lowest: null }));
  return (
    <div className="t-page -search t-flights">
      <CompactSearch flights={s} />
      <Results key={searchQuery(s)} search={s} init={init} dates={dates} today={todayIso()} />
    </div>
  );
}
