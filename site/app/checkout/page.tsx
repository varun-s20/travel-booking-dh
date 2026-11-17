/* =====================================================================
   travel-booking (working name Overwing, a placeholder): checkout
   "Review and pay" for a flight (?offer=&fare=) or a stay
   (?hotel=&room= plus the stay search). The offer or room is rebuilt
   on the server; the travelers or guests come from the form before
   (lib/store.ts drafts). Form, payment and order: components/booking/
   Checkout.tsx. Copy: content/copy.md, Booking and payment.
   ===================================================================== */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Checkout } from '@/components/booking/Checkout';
import { Steps, FLIGHT_STEPS, STAY_STEPS } from '@/components/booking/Steps';
import { findOffer, isFareOf, searchQuery } from '@/lib/mock/flights';
import { cityById, freeCancelUntil, hotelById, nightsOf, parseStaySearch, planById, roomById, stayQuery, stayTotals } from '@/lib/mock/hotels';

export const metadata: Metadata = { title: 'Review and pay' };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

export default async function CheckoutPage({ searchParams }: Props) {
  const sp = await searchParams;
  let body: React.ReactNode = null;
  let steps: React.ReactNode = null;
  if (one(sp.offer)) {
    const found = findOffer(one(sp.offer));
    if (!found) notFound();
    const fare = isFareOf(found.offer, sp.fare) ? sp.fare : 'light';
    steps = <Steps steps={FLIGHT_STEPS} current={2} hrefs={[`/flights/${found.offer.id}?fare=${fare}`, `/flights/${found.offer.id}/passengers?fare=${fare}`]} />;
    body = <Checkout kind="flight" offer={found.offer} search={found.search} fare={fare} resultsHref={`/flights?${searchQuery(found.search)}`} />;
  } else if (one(sp.hotel)) {
    const h = hotelById(one(sp.hotel));
    const r = h && roomById(h, one(sp.room));
    const parsed = h && parseStaySearch(sp, h.city);
    if (!h || !r || !parsed) notFound();
    const s = parsed.search;
    const q = stayQuery(s);
    const p = planById(r, one(sp.plan));
    steps = <Steps steps={STAY_STEPS} current={2} hrefs={[`/hotels/${h.id}?${q}#rooms`, `/hotels/${h.id}/guests?room=${r.id}&plan=${p.id}&${q}`]} />;
    body = (
      <Checkout kind="stay" hotel={h.id} room={r.id} stay={s} nights={nightsOf(s)} amounts={stayTotals(r, s, p)}
        names={{ hotel: h.name, area: h.area, city: cityById(h.city)?.name ?? '', room: r.name }}
        plan={{ id: p.id, name: p.name, refundable: p.refundable, breakfast: p.breakfast, nightly: p.nightly }} freeCancel={p.refundable ? freeCancelUntil(s) : null} checkIn={h.checkIn} checkOut={h.checkOut}
        hotelHref={`/hotels/${h.id}?${q}#rooms`} guestsHref={`/hotels/${h.id}/guests?room=${r.id}&plan=${p.id}&${q}`} resultsHref={`/hotels?${q}`} />
    );
  } else notFound();

  return (
    <div className="t-checkout b-wrap">
      {steps}
      <div className="o-pageHead">
        <h1 className="a-h1">Review and pay</h1>
      </div>
      {body}
    </div>
  );
}
