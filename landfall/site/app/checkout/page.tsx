/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): checkout
   Group F. Serves flights (?kind=flight&offer=<id>&fare=<fare>, from the
   travelers form) and stays (?kind=stay&hotel=<id>&room=<id>&plan=<rate
   id>& plus stayQuery(), from group H's guest form). The offer or rate is
   resolved on the server from the stored search (server/flights.ts,
   server/stays.ts): the browser only ever sends ids. A flight offer that
   is no longer stored shows the expired state with a way back to search;
   an unknown or expired rate goes back to the hotel page to choose again.
   components/flights/Checkout.tsx does the rest.
   Copy: landfall/content/copy.md, Checkout.
   ===================================================================== */
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getItinerary } from '@/server/flights';
import { getRate } from '@/server/stays';
import { appCurrency } from '@/server/pricing';
import { isFare, registerDict } from '@/lib/travel/flights';
import { parseStaySearch, stayQuery } from '@/lib/travel/hotels';
import Checkout from '@/components/flights/Checkout';
import Notice from '@/components/ui/Notice';
import { ButtonLink } from '@/components/ui/Button';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = { title: 'Review and pay', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

export default async function CheckoutPage({ searchParams }: Props) {
  const sp = await searchParams;
  if (one(sp.kind) === 'stay') {
    const hotelId = one(sp.hotel);
    const rate = one(sp.plan) ? await getRate(one(sp.plan)) : null;
    if (!rate || (hotelId && rate.hotel.id !== hotelId)) {
      const parsed = parseStaySearch(sp);
      redirect(hotelId ? `/hotels/${encodeURIComponent(hotelId)}${parsed?.complete ? `?${stayQuery(parsed.search)}` : ''}` : '/hotels');
    }
    return <div className="t-page t-checkout"><Checkout kind="stay" currency={appCurrency()} hotel={rate.hotel} room={rate.room} plan={rate.plan} search={rate.search} /></div>;
  }
  const found = one(sp.offer) ? await getItinerary(one(sp.offer)) : null;
  if (!found || Date.now() > found.offer.expiresAt) {
    const back = found ? `/flights?${new URLSearchParams({ from: found.search.from, to: found.search.to, depart: found.search.depart, ...(found.search.ret ? { return: found.search.ret } : {}), adults: String(found.search.adults), children: String(found.search.children), infants: String(found.search.infants), cabin: found.search.cabin })}` : '/#search';
    return (
      <div className="t-page t-checkout">
        <div className="l-container f-co">
          <h1 className="t-display t-h1">Review and pay</h1>
          <Notice tone="warn" title="This price has expired" actions={<ButtonLink href={back}>Search again</ButtonLink>}>
            <p>Airline prices are only held for a short time after a search. Nothing has been charged. Search again to see the current prices.</p>
          </Notice>
        </div>
      </div>
    );
  }
  registerDict(found.offer.dict);
  const f = one(sp.fare);
  return <div className="t-page t-checkout"><Checkout kind="flight" currency={appCurrency()} offer={found.offer} search={found.search} fare={isFare(f) ? f : 'light'} /></div>;
}
