/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): travelers form
   Group F. Resolves the offer from the stored search (server/flights.ts,
   getItinerary); an unknown or purged offer goes back to the home search.
   components/flights/Passengers.tsx draws the form.
   Copy: landfall/content/copy.md, Passenger form.
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isFare, registerDict } from '@/lib/travel/flights';
import { getItinerary } from '@/server/flights';
import Passengers from '@/components/flights/Passengers';

type Props = { params: Promise<{ offer: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Traveler details', robots: { index: false, follow: false } };

export default async function PassengersPage({ params, searchParams }: Props) {
  const found = await getItinerary((await params).offer);
  if (!found) redirect('/#search');
  registerDict(found.offer.dict);
  const f = (await searchParams).fare;
  return (
    <div className="t-page t-passengers">
      <Passengers offer={found.offer} search={found.search} fare={isFare(f) ? f : 'light'} />
    </div>
  );
}
