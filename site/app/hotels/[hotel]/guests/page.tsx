/* =====================================================================
   travel-booking (working name Overwing, a placeholder): guest details
   "Who's checking in?": the guest form beside the stay summary
   (components/hotels/GuestForm.tsx), priced on the rate plan chosen on
   the hotel page (?plan=, spec B7 and B8). Copy: content/copy.md.
   ===================================================================== */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { GuestForm } from '@/components/hotels/GuestForm';
import { Steps, STAY_STEPS } from '@/components/booking/Steps';
import { cityById, freeCancelUntil, hotelById, nightsOf, parseStaySearch, planById, roomAvailable, roomById, stayQuery, stayTotals } from '@/lib/mock/hotels';

export const metadata: Metadata = { title: 'Guest details' };

type Props = { params: Promise<{ hotel: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function GuestsPage({ params, searchParams }: Props) {
  const h = hotelById((await params).hotel);
  const sp = await searchParams;
  const r = h && roomById(h, String(sp.room || ''));
  if (!h || !r) notFound();
  const s = parseStaySearch(sp, h.city)!.search;
  if (!roomAvailable(h, r, s)) notFound();
  const q = stayQuery(s);
  const p = planById(r, typeof sp.plan === 'string' ? sp.plan : undefined);
  return (
    <div className="t-hotel b-wrap">
      <div className="o-pageHead -detail">
        <Link className="a-back" href={`/hotels/${h.id}?${q}#rooms`}><Icon name="chev-left" size="s" />Back to rooms</Link>
        <Steps steps={STAY_STEPS} current={1} hrefs={[`/hotels/${h.id}?${q}#rooms`]} />
        <h1 className="a-h1">Who’s checking in?</h1>
        <p className="o-pageHead__intro">Add the guest who will check in. The hotel may ask to see ID with this name on it.</p>
      </div>
      <GuestForm hotel={h.id} room={r.id} search={s} nights={nightsOf(s)} query={q}
        names={{ hotel: h.name, area: h.area, city: cityById(h.city)?.name ?? '', room: r.name }} amounts={stayTotals(r, s, p)}
        plan={{ id: p.id, name: p.name, refundable: p.refundable, breakfast: p.breakfast }} cancelUntil={freeCancelUntil(s)} checkIn={h.checkIn} checkOut={h.checkOut} />
    </div>
  );
}
