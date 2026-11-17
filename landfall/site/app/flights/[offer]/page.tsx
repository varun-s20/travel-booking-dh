/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): flight details
   Group F. The offer id resolves on the server against the stored search
   (server/flights.ts, getItinerary), with no new supplier search. An id
   that is unknown or whose search was purged (the id alone doesn't say
   which route it was) goes back to the home search.
   components/flights/Details.tsx does the rest.
   Copy: landfall/content/copy.md, Flight details and fares.
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cityOf, isFare, registerDict } from '@/lib/travel/flights';
import { getItinerary } from '@/server/flights';
import CompactSearch from '@/components/search/CompactSearch';
import Details from '@/components/flights/Details';

type Props = { params: Promise<{ offer: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await getItinerary((await params).offer);
  if (!found) return { title: 'This price has expired', robots: { index: false, follow: false } };
  registerDict(found.offer.dict);
  return { title: `${cityOf(found.search.from)} to ${cityOf(found.search.to)} flight details`, robots: { index: false, follow: false } };
}

export default async function OfferPage({ params, searchParams }: Props) {
  const found = await getItinerary((await params).offer);
  if (!found) redirect('/#search');
  registerDict(found.offer.dict);
  const f = (await searchParams).fare;
  const fare = isFare(f) ? f : 'light';
  return (
    <div className="t-page -search t-offer">
      <CompactSearch flights={found.search} />
      <Details offer={found.offer} search={found.search} fare={fare} />
    </div>
  );
}
