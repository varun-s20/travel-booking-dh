'use client';
/* =====================================================================
   Checkout (spec 2b, Booking and payment): a 640 form column beside the
   392 sticky summary; on phones the summary folds into a disclosure at
   the top and the Pay pill sticks to the bottom of the screen.
   Order of events on Pay, each said on the button and in a live region
   (copy.md, Progress): check the price (or the room) again, take the
   payment (authorised only), confirm the booking with the airline or
   hotel, then the page replaces itself with the confirmation.
   Failures: a panel above the card form takes focus and the form stays
   filled (payment declined and its kinds), or the airline or hotel
   could not confirm (the card is not charged). Copy: content/copy.md.
   ===================================================================== */
import { setProduct } from '@/lib/client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { CheckField, TextField } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Notice';
import { Summary, useExpiry } from '@/components/booking/Summary';
import { CardElement, checkCard, type CardErrors, type CardValue } from '@/components/booking/CardElement';
import { flightSummaryLines } from '@/components/flights/FlightDetails';
import { AIRLINES, fareFor, fareStep, offerTotals, type FareId, type FlightSearch, type Offer } from '@/lib/mock/flights';
import { stayDraftKey, type RatePlanId, type StaySearch } from '@/lib/mock/hotels';
import { Dialog } from '@/components/ui/Dialog';
import { Glyph } from '@/components/booking/Glyphs';
import type { Booking, Traveler } from '@/lib/mock/bookings';
import { addBooking, clearDraft, currentUser, getDraft, setDraft, useStore } from '@/lib/store';
import { dayRange, dayShort, money, plural } from '@/lib/format';
import { stopsSummary } from '@/lib/text';
import { ROUTES } from '@/lib/site';

type FlightProps = { kind: 'flight'; offer: Offer; search: FlightSearch; fare: FareId; resultsHref: string };
type StayProps = {
  kind: 'stay'; hotel: string; room: string; stay: StaySearch; nights: number;
  names: { hotel: string; area: string; city: string; room: string };
  amounts: { room: number; tax: number; total: number }; hotelHref: string; guestsHref: string; resultsHref: string;
  /* round 3: the rate plan chosen on the hotel page, its terms, and the hotel's times */
  plan: { id: RatePlanId; name: string; refundable: boolean; breakfast: boolean; nightly: number }; freeCancel: string | null; checkIn: string; checkOut: string;
};
type Props = FlightProps | StayProps;

type Fail = { title: string; body: string; action: 'card' | 'retry' | 'search' };
const DECLINES: Record<string, Fail> = {
  generic_decline: { title: 'Your card was declined', body: 'Nothing has been charged. Check the card details or try another card.', action: 'card' },
  insufficient_funds: { title: 'The payment didn’t go through', body: 'Your bank declined it for insufficient funds. Nothing has been charged.', action: 'card' },
  expired_card: { title: 'This card has expired', body: 'Nothing has been charged. Use a card with a later expiry date.', action: 'card' },
  payment_intent_authentication_failure: { title: 'Your bank couldn’t confirm the payment', body: 'The security check with your bank didn’t finish. Nothing has been charged. Try again, or use another card.', action: 'retry' },
  other: { title: 'The payment didn’t go through', body: 'Nothing has been charged. Try again in a moment, or use another card.', action: 'retry' }
};

const EXPIRED: Fail = { title: 'These prices have expired', body: 'Airline prices are only valid for a short time after a search. Search again to see current fares.', action: 'search' };

async function post<T>(url: string, body: unknown): Promise<{ ok: boolean; status: number; data?: T; code?: string; decline?: string }> {
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok && !j.errors, status: j.errors?.[0]?.status ?? r.status, data: j.data, code: j.errors?.[0]?.code, decline: j.errors?.[0]?.decline_code };
}

export function Checkout(props: Props) {
  const router = useRouter();
  const store = useStore();
  const user = currentUser(store);
  const flight = props.kind === 'flight';
  const draftKey = flight ? props.offer.id : stayDraftKey(props.hotel, props.room, props.stay);
  /* the rail and the tab bar mark the product being booked (revision 2026-11-11, item 7) */
  useEffect(() => { setProduct(flight ? 'flights' : 'hotels'); return () => setProduct(null); }, [flight]);

  const [adjust, setAdjust] = useState(0);
  const [travelers, setTravelers] = useState<Traveler[] | null>(null);
  const [requests, setRequests] = useState<string | undefined>(undefined);
  const [arrival, setArrival] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  /* the card's country starts from where the trip starts (critic round 1: United States on a London search) */
  const [card, setCard] = useState<CardValue>({ number: '', exp: '', cvc: '', country: props.kind === 'flight' && props.offer.slices[0].from.startsWith('L') && ['LHR', 'LGW'].includes(props.offer.slices[0].from) ? 'United Kingdom' : 'United States' });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [step, setStep] = useState<'' | 'check' | 'pay' | 'confirm'>('');
  const [fail, setFail] = useState<Fail | null>(null);
  const [showSum, setShowSum] = useState(false);
  const failRef = useRef<HTMLDivElement>(null);
  /* round 3 (spec B4): the price or rate is checked again as the page opens, so the visitor knows before typing a card */
  const [check, setCheck] = useState<'' | 'checking' | 'ok' | 'changed'>('');
  const [changed, setChanged] = useState<{ before: number; after: number; adjust: number; up: boolean } | null>(null);
  const checked = useRef(false);
  const cardRef = useRef<HTMLInputElement>(null);
  const filled = useRef(false);

  /* the travelers come from the form before; without them, back to it */
  useEffect(() => {
    const d = getDraft(draftKey);
    setAdjust(d.adjust || 0);
    if (flight) {
      if (!d.passengers?.length) { router.replace(`/flights/${props.offer.id}/passengers?fare=${props.fare}`); return; }
      setTravelers(d.passengers.map((p, i) => ({ name: `${p.given.trim()} ${p.family.trim()}`, type: i < props.offer.passengers.adults ? 'adult' : i < props.offer.passengers.adults + props.offer.passengers.children ? 'child' : 'infant', lead: i === 0 })));
    } else {
      if (!d.guests?.length) { router.replace(props.guestsHref); return; }
      setTravelers(d.guests.map((g, i) => ({ name: `${g.given.trim()} ${g.family.trim()}`, type: 'adult', lead: i === 0 })));
      setRequests(d.requests);
      setArrival(d.arrival);
    }
    if (d.email) setEmail(d.email);
    if (d.phone) setPhone(d.phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);
  /* logged in, contact details fill in from the account once */
  useEffect(() => {
    if (!user || filled.current) return;
    filled.current = true;
    setEmail((e) => e || user.email);
    setPhone((p) => p || user.phone);
  }, [user]);

  const notConfirmed: Fail = flight
    ? { title: 'The airline couldn’t confirm these seats', body: 'Your card has not been charged. Fares can sell out between search and payment. Search again to see what’s available now.', action: 'search' }
    : { title: 'The hotel couldn’t confirm this room', body: 'Your card has not been charged. Rooms can sell out between search and payment. Search again to see what’s available now.', action: 'search' };

  useEffect(() => {
    if (!travelers || checked.current) return;
    checked.current = true;
    let live = true;
    const t0 = Date.now();
    const settle = () => new Promise((r) => window.setTimeout(r, Math.max(0, 1500 - (Date.now() - t0))));
    setCheck('checking');
    (async () => {
      try {
        if (props.kind === 'flight') {
          const before = offerTotals(props.offer, props.fare, adjust).total;
          const c = await post<{ status: string; total?: number; adjust?: number }>(`/api/flights/offers/${props.offer.id}/check`, { fare: props.fare });
          await settle();
          if (!live) return;
          if (c.data?.status === 'sold_out') { setCheck(''); return showFail(notConfirmed); }
          if (c.data?.status === 'expired') { setCheck(''); return; }
          if ((c.data?.status === 'up' || c.data?.status === 'down') && (c.data.adjust ?? 0) !== adjust && typeof c.data.total === 'number') {
            setChanged({ before, after: c.data.total, adjust: c.data.adjust ?? 0, up: c.data.status === 'up' });
            setCheck('changed');
            return;
          }
        } else {
          const c = await post(`/api/hotels/bookings`, { hotel: props.hotel, room: props.room, plan: props.plan.id, search: stayParams(props.stay), check: true });
          await settle();
          if (!live) return;
          if (!c.ok) { setCheck(''); return showFail(notConfirmed); }
        }
        setCheck('ok');
      } catch { if (live) setCheck(''); }
    })();
    /* a remount (React's dev double run) starts the check again rather than leaving it spinning */
    return () => { live = false; checked.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelers]);

  function acceptChange() {
    if (!changed) return;
    setAdjust(changed.adjust);
    setDraft(draftKey, { adjust: changed.adjust });
    setChanged(null);
    setCheck('ok');
  }

  const fa = props.kind === 'flight' ? offerTotals(props.offer, props.fare, adjust) : null;
  const totalCents = fa ? fa.total : (props as StayProps).amounts.total;
  const total = money(totalCents);
  /* "Log in" brings the visitor back here (read after hydration, so server and client markup match) */
  const [here, setHere] = useState('');
  useEffect(() => { setHere(window.location.pathname + window.location.search); }, []);
  const busy = step !== '';
  const { expired } = useExpiry(props.kind === 'flight' ? props.offer.expiresAt : undefined);
  const stepText = step === 'check' ? (flight ? 'Checking the price with the airline' : 'Checking the room with the hotel')
    : step === 'pay' ? 'Taking payment' : step === 'confirm' ? (flight ? 'Confirming your booking with the airline' : 'Confirming your booking with the hotel') : '';

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) e['co-email'] = 'Enter an email address like name@example.com.';
    if (!/^\+\d[\d\s()-]{6,}$/.test(phone.trim())) e['co-phone'] = 'Enter a phone number with its country code.';
    if (!terms) e['co-terms'] = 'Tick the box to agree to the terms before you pay.';
    const ce = checkCard(card);
    setErrors(e);
    setCardErrors(ce);
    const first = Object.keys(e).find((k) => k !== 'co-terms') || (ce.number ? 'card-number' : ce.exp ? 'card-exp' : ce.cvc ? 'card-cvc' : e['co-terms'] ? 'co-terms' : '');
    if (first) { document.getElementById(first)?.focus(); return false; }
    return true;
  }

  function showFail(f: Fail) {
    setFail(f);
    setStep('');
    requestAnimationFrame(() => { failRef.current?.scrollIntoView({ block: 'center' }); failRef.current?.focus({ preventScroll: true }); });
  }

  async function pay(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy || !travelers) return;
    setFail(null);
    if (!validate()) return;
    setDraft(draftKey, { email: email.trim(), phone: phone.trim() });
    const owner = user?.id ?? null;
    try {
      /* 1. the price or the room, once more */
      setStep('check');
      if (flight) {
        const c = await post<{ status: string }>(`/api/flights/offers/${props.offer.id}/check`, { fare: props.fare });
        if (c.data?.status === 'expired') return showFail(EXPIRED);
        if (c.data?.status === 'sold_out') return showFail(notConfirmed);
      } else {
        const c = await post(`/api/hotels/bookings`, { hotel: props.hotel, room: props.room, plan: props.plan.id, search: stayParams(props.stay), check: true });
        if (!c.ok) return showFail(notConfirmed);
      }
      /* 2. the payment, authorised now and charged once the booking is confirmed (copy.md note 7) */
      setStep('pay');
      const intent = await post<{ id: string }>('/api/payments/intents', { amount: totalCents, currency: 'usd' });
      if (!intent.ok || !intent.data) return showFail(DECLINES.other);
      const conf = await post<{ card: { brand: string; last4: string } }>(`/api/payments/intents/${intent.data.id}/confirm`, { number: card.number });
      if (!conf.ok) {
        if (conf.code === 'incorrect_number') { setStep(''); setCardErrors({ number: 'Your card number is invalid.' }); cardRef.current?.focus(); return; }
        return showFail(DECLINES[conf.decline || conf.code || 'other'] || DECLINES.other);
      }
      /* 3. the booking */
      setStep('confirm');
      const body = { paymentIntent: intent.data.id, card: conf.data!.card, email: email.trim(), owner };
      const order = flight
        ? await post<{ booking: Booking }>('/api/flights/orders', { ...body, offerId: props.offer.id, fare: props.fare, adjust, travelers })
        : await post<{ booking: Booking }>('/api/hotels/bookings', { ...body, hotel: props.hotel, room: props.room, plan: props.plan.id, search: stayParams(props.stay), guests: travelers.map((t) => t.name), requests, arrival });
      if (!order.ok || !order.data) return showFail(notConfirmed);
      addBooking(order.data.booking);
      clearDraft(draftKey);
      router.replace(`${ROUTES.confirmation}/${order.data.booking.ref}`);
    } catch {
      showFail(DECLINES.other);
    }
  }

  function onFailAction() {
    if (!fail) return;
    if (fail.action === 'search') { router.push(props.resultsHref); return; }
    setFail(null);
    if (fail.action === 'card') { setCard((c) => ({ ...c, number: '', cvc: '' })); requestAnimationFrame(() => cardRef.current?.focus()); }
    else void pay();
  }

  const summary = flight ? (
    <Summary title="Your trip" change={`/flights/${props.offer.id}?fare=${props.fare}`}
      lines={(() => { const l = flightSummaryLines(props.offer, props.search, props.fare); return [l[0], l[1], `${AIRLINES[props.offer.owner].name}, ${stopsSummary(props.offer.slices)}`, l[2]]; })()}
      rows={paxRows(props.offer, props.fare, adjust)} total={total} expiresAt={props.offer.expiresAt}
      note={`Fare ${money(fa!.base)}, taxes and fees ${money(fa!.tax)}.`}>
      <Travelers names={travelers} href={`/flights/${props.offer.id}/passengers?fare=${props.fare}`} />
    </Summary>
  ) : (
    <Summary title="Your stay" change={props.hotelHref}
      lines={[`${props.names.hotel}, ${props.names.area}, ${props.names.city}`, `${props.names.room}, ${props.plan.name}`, `${dayRange(props.stay.checkin, props.stay.checkout)}, ${plural(props.nights, 'night', 'nights')}`, `${plural(props.stay.adults, 'adult', 'adults')}${props.stay.children ? `, ${plural(props.stay.children, 'child', 'children')}` : ''}, ${plural(props.stay.rooms, 'room', 'rooms')}`]}
      rows={[
        { label: `${plural(props.stay.rooms, 'Room', 'Rooms')}, ${plural(props.nights, 'night', 'nights')}`, value: money(props.amounts.room) },
        { label: 'Taxes and fees', value: money(props.amounts.tax) }
      ]} total={total}
      note={`${money(props.plan.nightly * props.stay.rooms)} a night. Tourist tax, if the city charges one, is paid at the hotel.`}>
      <Travelers names={travelers} href={props.guestsHref} title={props.stay.rooms > 1 ? 'Guests' : 'Lead guest'} />
    </Summary>
  );

  return (
    <div className="o-detail t-checkout__body">
      <div className="o-detail__main">
        {/* phones: the summary folds into a disclosure at the top */}
        <div className="o-checkout__phoneSum">
          <button className="o-checkout__sumToggle" type="button" aria-expanded={showSum} aria-controls="phone-summary" onClick={() => setShowSum((s) => !s)}>
            <span>{showSum ? 'Hide details' : <>Total <strong>{total}</strong>, show details</>}</span><Icon name="chev-down" size="s" />
          </button>
          <div id="phone-summary" hidden={!showSum}>{summary}</div>
        </div>

        {expired && !busy && (
          <Notice title={EXPIRED.title} actions={<Link className="a-button" href={props.resultsHref}><span className="a-button__label">Search again</span><Icon name="arrow" className="a-button__icon" /></Link>}>
            <p>{EXPIRED.body}</p>
          </Notice>
        )}

        {!user && (
          <p className="o-checkout__login">Have an account? <Link className="a-link" href={here ? `${ROUTES.login}?next=${encodeURIComponent(here)}` : ROUTES.login}>Log in</Link> to save this booking to it.</p>
        )}

        {check && check !== 'changed' && (
          <p className={`o-checkout__check${check === 'ok' ? ' is-ok' : ''}`} role="status">
            {check === 'checking' ? <span className="o-checkout__spinner -ink" aria-hidden="true" /> : <span className="a-disc" aria-hidden="true"><Icon name="tick" /></span>}
            <span>{check === 'checking' ? (flight ? 'Checking the price with the airline' : 'Checking the room with the hotel') : flight ? `Price confirmed: ${total} for ${plural(props.offer.passengers.adults + props.offer.passengers.children + props.offer.passengers.infants, 'traveler', 'travelers')}` : `Rate confirmed: ${total} for ${plural(props.nights, 'night', 'nights')}`}</span>
          </p>
        )}

        <form className="o-form o-checkout" noValidate onSubmit={pay} aria-busy={busy || undefined}>
          <section className="o-checkout__section" aria-labelledby="co-contact">
            <h2 className="a-h3" id="co-contact">Contact details</h2>
            <p className="o-checkout__intro">We’ll send the confirmation and any changes to this booking here.</p>
            <TextField id="co-email" label="Email" type="email" autoComplete="email" inputMode="email" value={email} error={errors['co-email']} onChange={(e) => setEmail(e.target.value)} />
            <TextField id="co-phone" label="Phone" type="tel" autoComplete="tel" help="Include the country code, for example +1." value={phone} error={errors['co-phone']} onChange={(e) => setPhone(e.target.value)} />
          </section>

          <Terms {...props} />

          <section className="o-checkout__section" aria-labelledby="co-payment">
            <h2 className="a-h3" id="co-payment">Payment</h2>
            {fail && (
              <Notice ref={failRef} tone="error" icon="alert" title={fail.title} headingLevel={3}
                actions={<button className="a-button" type="button" onClick={onFailAction}><span className="a-button__label">{fail.action === 'card' ? 'Try another card' : fail.action === 'retry' ? 'Try again' : 'Search again'}</span></button>}>
                <p>{fail.body}</p>
              </Notice>
            )}
            <CardElement ref={cardRef} value={card} errors={cardErrors} disabled={busy} onChange={(v) => { setCard(v); if (Object.keys(cardErrors).length) setCardErrors({}); }} />
            <CheckField id="co-terms" checked={terms} error={errors['co-terms']} onChange={(e) => setTerms(e.target.checked)}
              label={<>I agree to the <a href={ROUTES.terms} target="_blank" rel="noopener">Terms and conditions<span className="sr-only"> (opens in a new tab)</span></a> and {/* polish round, 11 Nov: the new-tab note rides on aria-label here, because the sr-only span (absolutely placed) made
                 the checkbox's name read "(opens in a new tab) , and to" with a stray space before the comma */}
              <a href={ROUTES.privacy} target="_blank" rel="noopener" aria-label="Privacy policy (opens in a new tab)">Privacy policy</a>, and to {flight ? 'the airline’s fare rules shown for this booking' : 'the hotel’s cancellation policy shown for this room'}.</>} />
          </section>

          <div className="o-checkout__pay">
            <button className="a-button -block o-checkout__payBtn" type="submit" aria-disabled={busy || undefined}>
              {busy ? <span className="o-checkout__spinner" aria-hidden="true" /> : <Icon name="lock" className="a-button__lock" />}
              <span className="a-button__label">{busy ? stepText : `Pay ${total}`}</span>
            </button>
            <p className="o-checkout__trust" aria-live="polite">{!busy && <Glyph name="shield" size="s" className="o-checkout__trustIcon" />}<span>{busy ? 'This can take a few seconds. Please keep this page open.' : 'Card payments are handled by Stripe. Your card number goes to Stripe, not to us.'}</span></p>
          </div>
          <p className="sr-only" role="status">{stepText}</p>
        </form>
      </div>
      <aside className="o-detail__side">{summary}</aside>
      {flight && (
        <Dialog open={!!changed} onClose={() => (changed?.up ? router.push(props.resultsHref) : acceptChange())} id="price-changed" size="confirm" hideClose
          title={changed ? <>{changed.up ? 'The price has gone up by ' : 'The price has dropped by '}<span className="m-notice__delta">{money(Math.abs(changed.after - changed.before))}</span></> : ''}
          foot={changed ? (
            <>
              <button className="a-button" type="button" onClick={acceptChange}><span className="a-button__label">{changed.up ? `Continue at ${money(changed.after)}` : 'Continue'}</span></button>
              {changed.up && <Link className="a-button -soft" href={props.resultsHref}><span className="a-button__label">Back to results</span></Link>}
            </>
          ) : null}>
          {changed && (
            <>
              <p>{changed.up ? 'The airline changed the fare after you searched.' : 'The airline lowered the fare after you searched.'} The new total for {plural(props.offer.passengers.adults + props.offer.passengers.children + props.offer.passengers.infants, 'traveler', 'travelers')} is {money(changed.after)}.</p>
              <dl className="o-checkout__delta">
                <div><dt>Before</dt><dd>{money(changed.before)}</dd></div>
                <div><dt>Now</dt><dd><strong>{money(changed.after)}</strong></dd></div>
              </dl>
            </>
          )}
        </Dialog>
      )}
      {/* the sticky Pay pill is this page's fixed action, so the floating tab bar hides (spec 2b, Chrome; critic round 1) */}
      <span data-bottom-bar hidden />
    </div>
  );
}

/* the names just entered, so a typo is caught before paying (critic round 1) */
function Travelers({ names, href, title = 'Travelers' }: { names: Traveler[] | null; href: string; title?: string }) {
  if (!names?.length) return null;
  return (
    <div className="m-summary__who">
      <div className="m-summary__whoHead"><h3 className="m-summary__whoTitle">{title}</h3><Link className="a-link" href={href} aria-label={`Change ${title.toLowerCase()}`}>Change</Link></div>
      <ul className="m-summary__whoList">{names.map((t, i) => <li key={`${t.name}-${i}`}>{t.name}</li>)}</ul>
    </div>
  );
}

export function stayParams(s: StaySearch): Record<string, string> {
  return { place: s.place, checkin: s.checkin, checkout: s.checkout, adults: String(s.adults), children: String(s.children), rooms: String(s.rooms) };
}

/* every line item for a flight: each traveler type with its count and price (spec B2.5) */
function paxRows(o: Offer, fare: FareId, adjust: number): { label: string; value: string }[] {
  const seat = o.perSeat + fareStep(o, fare) + adjust;
  const infant = Math.round(((o.perSeat - o.taxPerSeat) * 0.1) / 10) * 10;
  const p = o.passengers;
  const rows = [{ label: `${plural(p.adults, 'adult', 'adults')}${p.adults > 1 ? `, ${money(seat)} each` : ''}`, value: money(seat * p.adults) }];
  if (p.children) rows.push({ label: `${plural(p.children, 'child', 'children')}${p.children > 1 ? `, ${money(seat)} each` : ''}`, value: money(seat * p.children) });
  if (p.infants) rows.push({ label: `${plural(p.infants, 'infant on a lap', 'infants on a lap')}`, value: money(infant * p.infants) });
  return rows;
}

/* the chosen fare's or rate's terms in plain words, before the card (spec B4) */
function Terms(props: Props) {
  if (props.kind === 'flight') {
    const f = fareFor(props.offer.owner, props.fare);
    const rows = f.rows;
    const airline = AIRLINES[props.offer.owner]?.name ?? '';
    const items: { icon: string; label: string; text: string }[] = rows ? [
      { icon: 'change', label: 'Changes', text: /^Not allowed/i.test(rows.changes) ? 'Changes aren’t allowed on this fare.' : rows.changes.replace(/^For a fee:\s*/i, '') },
      { icon: 'refund', label: 'Cancellation', text: /^Not refundable/i.test(rows.refunds) ? 'This fare can’t be refunded if you cancel.' : rows.refunds },
      { icon: 'bag-checked', label: 'Bags', text: [rows.cabinBag, rows.checkedBag].map((x) => x.replace(/^For a fee:\s*/i, '') + (/^For a fee/i.test(x) ? ' for a fee' : '')).join('. ') }
    ] : [];
    return (
      <section className="o-checkout__section o-checkout__terms" aria-labelledby="co-terms-title">
        <h2 className="a-h3" id="co-terms-title">{f.name} fare with {airline}</h2>
        <ul className="o-checkout__termList">
          {items.map((i) => <li key={i.label}><Glyph name={i.icon} size="s" /><span><strong>{i.label}</strong> {i.text}</span></li>)}
        </ul>
        <p className="o-checkout__termNote">The airline sets these rules. We show them exactly as the airline sends them.</p>
      </section>
    );
  }
  const p = props.plan;
  return (
    <section className="o-checkout__section o-checkout__terms" aria-labelledby="co-terms-title">
      <h2 className="a-h3" id="co-terms-title">{p.name}</h2>
      <ul className="o-checkout__termList">
        <li><Glyph name="refund" size="s" /><span><strong>Cancellation</strong> {p.refundable && props.freeCancel ? `Free cancellation until 23:59 hotel time on ${dayShort(props.freeCancel)}. After that, the booking can’t be refunded.` : 'This rate is non-refundable from the moment you book.'}</span></li>
        <li><Glyph name="meal" size="s" /><span><strong>Meals</strong> {p.breakfast ? 'Breakfast included for everyone in the room.' : 'Room only. Breakfast isn’t included.'}</span></li>
        <li><Glyph name="key" size="s" /><span><strong>Check-in</strong> From {props.checkIn} on {dayShort(props.stay.checkin)}. Check-out until {props.checkOut} on {dayShort(props.stay.checkout)}.</span></li>
        <li><Glyph name="card" size="s" /><span><strong>Payment</strong> You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.</span></li>
      </ul>
    </section>
  );
}
