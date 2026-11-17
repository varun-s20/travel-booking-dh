/* =====================================================================
   travel-booking (working name Overwing, a placeholder): flight details
   The offer is rebuilt from its id (lib/mock/flights.ts), so the page
   works from a shared link until the offer expires. H1, meta line and
   back link, then the itinerary, fares and summary
   (components/flights/FlightDetails.tsx). Copy: content/copy.md.
   ===================================================================== */
import { Steps, FLIGHT_STEPS } from '@/components/booking/Steps';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { FlightDetails } from '@/components/flights/FlightDetails';
import { cityOf, findOffer, isFareOf, searchQuery } from '@/lib/mock/flights';
import { flightMetaTrip, routeTitle } from '@/lib/text';

type Props = { params: Promise<{ offer: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = findOffer((await params).offer);
  if (!found) return { title: 'Page not found' };
  return { title: `${cityOf(found.search.from)} to ${cityOf(found.search.to)} flight details` };
}

export default async function FlightDetailsPage({ params, searchParams }: Props) {
  const found = findOffer((await params).offer);
  if (!found) notFound();
  const { offer, search } = found;
  const sp = await searchParams;
  const fare = isFareOf(offer, sp.fare) ? sp.fare : 'light';
  const resultsHref = `/flights?${searchQuery(search)}`;
  return (
    <div className="t-flight b-wrap">
      <div className="o-pageHead -detail">
        <Link className="a-back" href={resultsHref}><Icon name="chev-left" size="s" />Back to results</Link>
        <Steps steps={FLIGHT_STEPS} current={0} />
        <h1 className="a-h1">{routeTitle(search.from, search.to)}</h1>
        <p className="o-pageHead__meta">{flightMetaTrip(search.depart, search.ret, search, search.cabin)}</p>
      </div>
      <FlightDetails offer={offer} search={search} resultsHref={resultsHref} initialFare={fare} />
    </div>
  );
}
