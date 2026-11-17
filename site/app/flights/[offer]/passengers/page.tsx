/* =====================================================================
   travel-booking (working name Overwing, a placeholder): traveler details
   "Who's flying?": the passenger form beside the trip summary
   (components/flights/PassengerForm.tsx). Copy: content/copy.md.
   ===================================================================== */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { PassengerForm } from '@/components/flights/PassengerForm';
import { Steps, FLIGHT_STEPS } from '@/components/booking/Steps';
import { findOffer, isFareOf } from '@/lib/mock/flights';

export const metadata: Metadata = { title: 'Traveler details' };

type Props = { params: Promise<{ offer: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PassengersPage({ params, searchParams }: Props) {
  const id = (await params).offer;
  const found = findOffer(id);
  if (!found) notFound();
  const sp = await searchParams;
  const fare = found && isFareOf(found.offer, sp.fare) ? sp.fare : 'light';
  return (
    <div className="t-flight b-wrap">
      <div className="o-pageHead -detail">
        <Link className="a-back" href={`/flights/${id}?fare=${fare}`}><Icon name="chev-left" size="s" />Back to fares</Link>
        <Steps steps={FLIGHT_STEPS} current={1} hrefs={[`/flights/${id}?fare=${fare}`]} />
        <h1 className="a-h1">Who’s flying?</h1>
        <p className="o-pageHead__intro">Enter each name exactly as it appears on the passport or ID that person will travel with. The airline checks them at the airport.</p>
      </div>
      <PassengerForm offer={found.offer} search={found.search} fare={fare} />
    </div>
  );
}
