/* =====================================================================
   Landfall (working name, a placeholder), group F: checkout (flights and stays)
   Spec 2b, Booking and payment: the steps as a plain text line (current
   step in 600 with the landfall line under it), the contact recap with
   Edit, the payment card (Stripe's Payment Element: card number, expiry,
   CVC and billing country in Stripe's own fields), the terms row, the
   Pay pill. Trust lines under it. The summary is sticky at 1025 and up
   with the landfall line above the total; below 1025 a bar shows the
   total only and opens the summary.
   Pay runs three steps, each said on the button and in a live region:
   1. check: POST /api/checkout. The server asks the airline or hotel for
      the current price, records the booking and creates the payment for
      its own price. A changed price comes back before anything is made
      (the fare banner); sold out, expired and traveler problems too.
   2. pay: Stripe confirms the card in the browser (3-D Secure opens in
      Stripe's own window). The card is only authorised, not charged.
   3. confirm: POST /api/checkout/<id>/complete books with the airline or
      hotel, then takes the payment, or releases it if they refuse. While
      the supplier hasn't answered, the page polls the booking.
   A decline or a booking the airline or hotel can't confirm shows the
   panel at the top of the payment card, which takes focus; an expired
   offer opens the Refresh dialog (a new search for the same flights).
   One checkout attempt has one key (sessionStorage), so a double click,
   a retry or "Try another card" reuses the same booking and payment.
   Flights come from the travelers form (draft flight:<offer>), stays from
   group H's guest form (draft stayDraftKey()).
   Copy: landfall/content/copy.md, Checkout and Payment failed.
   ===================================================================== */
'use client';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import type { StripeError } from '@stripe/stripe-js';
import { airlineName, fareFor, offerTotals, registerDict, travelers, type FareId, type FlightSearch, type Offer } from '@/lib/travel/flights';
import { cityById, freeCancelUntil, nightsOf, stayDraftKey, stayQuery, stayTotals, type Hotel, type RatePlan, type Room, type StaySearch } from '@/lib/travel/hotels';
import { countryCode, isCountryCode } from '@/lib/data/countries';
import Steps from '@/components/booking/Steps';
import PriceTable, { flightRows, stayLabel, type PriceRow } from '@/components/booking/PriceTable';
import { PaymentFields, PaymentProvider } from '@/components/booking/PaymentElement';
import { dayRange, dollars, money, plural } from '@/lib/format';
import { guestsLine, paxLine, routeTitle, stopsSummary, travelersWord } from '@/lib/text';
import { MQ_DESKTOP, useMedia } from '@/lib/client';
import { api, newCheckoutKey, type ApiError } from '@/lib/api';
import { useSession } from '@/lib/session';
import { stripeConfigured } from '@/lib/stripe-client';
import { clearDraft, getDraft, setDraft, useStore, type Draft, type PassengerDraft } from '@/lib/store';
import Icon from '@/components/ui/Icon';
import FlightPath from '@/components/ui/FlightPath';
import Notice from '@/components/ui/Notice';
import Dialog from '@/components/ui/Dialog';
import PriceBar from '@/components/ui/PriceBar';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Field';
import { Breakdown, ExpiredDialog, ExpiryLine, FareChange, TripSummary, flightBreakdown, type BreakdownRows } from './parts';
import { detailsUrl, flightDraftKey, moveDraft, passengersUrl, perTraveler, resultsUrl, checkoutUrl } from './trip';

/* currency: the site's currency (APP_CURRENCY), the one the server prices and Stripe charges in */
export type CheckoutProps = { currency: string } & (
  | { kind: 'flight'; offer: Offer; search: FlightSearch; fare: FareId }
  | { kind: 'stay'; hotel: Hotel; room: Room; plan: RatePlan; search: StaySearch });

type Phase = 'idle' | 'check' | 'pay' | 'confirm';
type Fail = { title: string; body: string; action: 'card' | 'again' | 'search' | 'edit' | 'hotel' };
type Started = { bookingId: string; reference: string; clientSecret: string; total: number; currency: string; guestKey?: string; status: string };
type Outcome = { status: 'confirmed' | 'processing' | 'awaiting_payment' | 'failed'; reference: string; code?: string };

/* "For a fee: Changes before departure, ..." reads "Changes before departure, ..., for a fee" */
function condLine(label: string, raw: string): string {
  const fee = /^For a fee: /i.test(raw);
  const text = raw.replace(/^(For a fee|Included|Not included): /i, '');
  const body = /^(Changes|Change|Refund|Not refundable|No refund|No changes)/i.test(text) ? text : `${label}: ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  return `${body}${fee ? ', for a fee' : ''}`;
}

/* Stripe's decline and error codes in the site's words; nothing is ever charged at this point (the card is only authorised later) */
function failFor(code?: string, decline?: string): Fail {
  if (code === 'card_declined' && decline === 'insufficient_funds') return { title: 'The payment didn’t go through', body: 'Your bank declined it for insufficient funds. Nothing has been charged.', action: 'card' };
  if (code === 'card_declined') return { title: 'Your card was declined', body: 'Nothing has been charged. Check the card details or try another card.', action: 'card' };
  if (code === 'expired_card') return { title: 'This card has expired', body: 'Nothing has been charged. Use a card with a later expiry date.', action: 'card' };
  if (code === 'incorrect_cvc') return { title: 'The security code is incorrect', body: 'Nothing has been charged. Check the 3 or 4 digits on your card and try again.', action: 'card' };
  if (code === 'payment_intent_authentication_failure') return { title: 'Your bank couldn’t confirm the payment', body: 'The security check with your bank didn’t finish. Nothing has been charged. Try again, or use another card.', action: 'again' };
  return { title: 'The payment didn’t go through', body: 'Nothing has been charged. Try again in a moment, or use another card.', action: 'again' };
}

const PROBLEM: Record<string, string> = {
  passport_required: 'a passport is needed for every traveler on this trip',
  passport_expires_before_trip: 'the passport expires before the trip ends',
  infant_too_old: 'infants must be under 2 for the whole trip',
  child_age: 'children must be 2 to 11 on the day of departure',
  adult_too_young: 'adults must be 12 or older on the day of departure',
  date_of_birth_in_future: 'the date of birth is in the future',
  date_of_birth_invalid: 'the date of birth isn’t a real date'
};

const pad2 = (s: string | undefined) => String(s ?? '').padStart(2, '0');
const isoOf = (y?: string, m?: string, d?: string) => (y && m && d ? `${y}-${pad2(m)}-${pad2(d)}` : '');
const toCountry = (v?: string) => { const c = (v ?? '').trim(); return isCountryCode(c.toUpperCase()) ? c.toUpperCase() : countryCode(c) ?? c; };

/* FNV-1a: tells whether what the customer is paying for changed since the attempt's key was made */
function fingerprint(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
const attemptStore = (draftKey: string) => `landfall:checkout:${draftKey}`;
function attemptKey(draftKey: string, body: unknown, fresh = false): string {
  const fp = fingerprint(JSON.stringify(body));
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(attemptStore(draftKey)) || 'null') as { key: string; fp: string } | null;
    if (!fresh && saved && saved.fp === fp) return saved.key;
    const key = newCheckoutKey();
    window.sessionStorage.setItem(attemptStore(draftKey), JSON.stringify({ key, fp }));
    return key;
  } catch { return newCheckoutKey(); }
}
const dropAttempt = (draftKey: string) => { try { window.sessionStorage.removeItem(attemptStore(draftKey)); } catch { /* storage blocked */ } };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Checkout(props: CheckoutProps) {
  const total = props.kind === 'flight' ? fareFor(props.offer, props.fare).total : stayTotals(props.room, props.search, props.plan.id).total;
  return <PaymentProvider amount={total} currency={props.currency}><CheckoutBody {...props} /></PaymentProvider>;
}

function CheckoutBody(props: CheckoutProps) {
  if (props.kind === 'flight') registerDict(props.offer.dict);
  const router = useRouter();
  const store = useStore();
  const { user } = useSession();
  const stripe = useStripe();
  const elements = useElements();
  const desktop = useMedia(MQ_DESKTOP, true);
  const flight = props.kind === 'flight';
  const [offer, setOffer] = useState<Offer | null>(props.kind === 'flight' ? props.offer : null);
  const offerId = offer?.id ?? '';
  const expiresAt = offer?.expiresAt ?? 0;
  const key = props.kind === 'flight' ? flightDraftKey(offerId) : stayDraftKey(props.hotel.id, props.room.id, props.search);
  const [draft, setDraftState] = useState<Draft | null>(null);
  const [accepted, setAccepted] = useState<number | null>(null);
  const [terms, setTerms] = useState(false);
  const [termsErr, setTermsErr] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [fail, setFail] = useState<Fail | null>(null);
  const [failKey, setFailKey] = useState(0);
  const [change, setChange] = useState<{ before: number; after: number } | null>(null);
  const [soldOut, setSoldOut] = useState(false);
  const [expired, setExpired] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bd, setBd] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [ready, setReady] = useState(false);
  const live = useRef(true);
  useEffect(() => () => { live.current = false; }, []);
  const onExpire = useCallback(() => { if (phase === 'idle') setExpired(true); }, [phase]);

  /* the draft from the travelers form or H's guest form; without it, back to that form */
  const editHref = props.kind === 'flight' ? passengersUrl(offerId, props.fare) : `/hotels/${props.hotel.id}/guests?room=${props.room.id}&plan=${encodeURIComponent(props.plan.id)}&${stayQuery(props.search)}`;
  useEffect(() => {
    if (!store || draft) return;
    const d = getDraft(key);
    const ok = flight ? !!d.passengers?.length : !!d.guests?.length;
    if (!ok) { router.replace(editHref); return; }
    setDraftState(d);
    if (d.acceptedTotal) setAccepted(d.acceptedTotal);
  }, [store, draft, key, flight, editHref, router]);

  /* ---- amounts and lines ---- */
  let total = 0, unit = '', lines: string[] = [], breakdown: BreakdownRows, title = 'Your trip', who = '', changeHref = '', note: string | null = null;
  let priceRows: PriceRow[] = [], terms2: [string, string] = ['', ''], stayTax: number | undefined;
  if (props.kind === 'flight' && offer) {
    const base = fareFor(offer, props.fare);
    const adjust = accepted !== null ? accepted - base.total : 0;
    const a = offerTotals(offer, props.fare, adjust);
    const s = props.search;
    total = a.total;
    unit = `${money(perTraveler(a.total, s))} per traveler`;
    priceRows = flightRows(offer, props.fare, adjust).rows;
    terms2 = base.rows && (base.rows.changes || base.rows.refunds)
      ? [base.rows.changes ? condLine('Changes', base.rows.changes) : 'Changes: ask the airline', base.rows.refunds ? condLine('Cancellation', base.rows.refunds) : 'Cancellation: ask the airline']
      : [`Changes: ${base.fee.find((x) => /change/i.test(x)) ?? base.included.find((x) => /change/i.test(x)) ?? 'Not allowed'}`, `Cancellation: ${base.included.find((x) => /refund/i.test(x)) ?? base.notIncluded.find((x) => /refund/i.test(x)) ?? 'Not refundable'}`];
    lines = [`${routeTitle(s.from, s.to)}, ${s.ret ? 'return' : 'one way'}`, dayRange(s.depart, s.ret), `${airlineName(offer.owner)}, ${stopsSummary(offer.slices)}`, `${paxLine(s)}, ${base.name} fare`];
    breakdown = flightBreakdown(a, s, unit);
    who = `for ${travelersWord(travelers(s))}`;
    changeHref = detailsUrl(offerId, props.fare);
  } else if (props.kind === 'stay') {
    const t = stayTotals(props.room, props.search, props.plan.id);
    const nights = nightsOf(props.search);
    const rp = props.plan;
    total = accepted ?? t.total;
    /* nightly: all rooms; perRoom: what the "2 rooms x $X per night" label multiplies */
    const nightly = Math.round(total / Math.max(1, nights));
    const perRoom = Math.round(total / Math.max(1, nights) / Math.max(1, props.search.rooms));
    priceRows = [{ label: stayLabel(nights, perRoom, props.search.rooms, props.room.name), amount: total }];
    terms2 = [
      rp.refundable ? `Cancellation: free until 23:59 hotel time on ${dayRange(freeCancelUntil(props.search, rp), null)}, then no refund` : 'Cancellation: non-refundable from the moment you book',
      'Changes: date changes depend on the hotel. Contact us with your booking reference'
    ];
    unit = `${dollars(nightly)} per night, ${plural(nights, 'night', 'nights')}`;
    lines = [`${props.hotel.name}, ${props.hotel.area}, ${cityById(props.hotel.city)?.name ?? ''}`.replace(/, , |, $/g, ''), rp.name ? `${props.room.name}, ${rp.name}` : props.room.name, `${dayRange(props.search.checkin, props.search.checkout)}, ${plural(nights, 'night', 'nights')}`, guestsLine(props.search)];
    breakdown = { rows: [[stayLabel(nights, perRoom, props.search.rooms, props.room.name), total]], total, unit, line: `of which taxes and fees ${money(t.tax)}.${rp.payAtHotel ? ` Plus ${rp.payAtHotel.currency} ${(rp.payAtHotel.amount / 100).toFixed(2)} paid at the hotel.` : ' Tourist tax, if the city charges one, is paid at the hotel.'}` };
    stayTax = t.tax;
    title = 'Your stay';
    who = `for ${plural(nights, 'night', 'nights')}`;
    changeHref = `/hotels/${props.hotel.id}?${stayQuery(props.search)}`;
    note = rp.payAtHotel ? `Plus ${rp.payAtHotel.currency} ${(rp.payAtHotel.amount / 100).toFixed(2)} in local taxes, paid at the hotel.` : 'Tourist tax, if the city charges one, is paid at the hotel.';
  } else {
    breakdown = { rows: [], total: 0, unit: '' };
  }
  const searchAgain = props.kind === 'flight' ? resultsUrl(props.search) : `/hotels?${stayQuery(props.search)}`;
  const busy = phase !== 'idle';
  const progress = phase === 'check' ? (flight ? 'Checking the price with the airline' : 'Checking the room with the hotel')
    : phase === 'pay' ? 'Taking payment' : phase === 'confirm' ? (flight ? 'Confirming your booking with the airline' : 'Confirming your booking with the hotel') : '';
  const payReady = stripeConfigured() && !!stripe && !!elements;

  function showFail(f: Fail) { setFail(f); setFailKey((k) => k + 1); setPhase('idle'); }
  const notConfirmed = (): Fail => flight
    ? { title: 'The airline couldn’t confirm these seats', body: 'Your card has not been charged. Fares can sell out between search and payment. Search again to see what’s available now.', action: 'search' }
    : { title: 'The hotel couldn’t confirm this room', body: 'Your card has not been charged. Rooms can sell out between search and payment. Search again to see what’s available now.', action: 'search' };

  /* ---- the request body: what is being bought, by whom ---- */
  function bodyOf(d: Draft) {
    const contact = { email: (d.email ?? '').trim(), phone: (d.phone ?? '').trim() };
    if (props.kind === 'flight') {
      const s = props.search;
      const kinds = [...Array(s.adults).fill('adult'), ...Array(s.children).fill('child'), ...Array(s.infants).fill('infant')] as ('adult' | 'child' | 'infant')[];
      return {
        kind: 'flight' as const, offerId, fare: props.fare, expectedTotal: total, contact,
        travelers: (d.passengers ?? []).map((p: PassengerDraft, i) => ({
          title: p.title.toLowerCase(), given: p.given.trim(), family: p.family.trim(),
          bornOn: isoOf(p.year, p.month, p.day), gender: p.gender === 'f' ? 'f' as const : 'm' as const, type: p.type ?? kinds[i] ?? 'adult',
          passport: offer?.passport && p.passport ? { number: p.passport.replace(/\s+/g, ''), country: toCountry(p.country), expiresOn: isoOf(p.expYear, p.expMonth, p.expDay) } : null
        }))
      };
    }
    return {
      kind: 'stay' as const, hotelId: props.hotel.id, rateId: props.plan.id, expectedTotal: total, contact,
      guests: (d.guests ?? []).map((g) => ({ given: g.given.trim(), family: g.family.trim() })),
      ...(d.requests ? { requests: d.requests } : {})
    };
  }

  /* ---- the server's refusals, in the page's words ---- */
  function startFailed(e: ApiError) {
    if (e.code === 'price_changed' && typeof e.after === 'number') { setPhase('idle'); setChange({ before: total, after: e.after }); return; }
    if (e.code === 'sold_out') { setPhase('idle'); if (flight) setSoldOut(true); else showFail(notConfirmed()); return; }
    if (e.code === 'offer_expired') { setPhase('idle'); setExpired(true); return; }
    if (e.code === 'rate_expired') { showFail({ title: 'This room’s price has expired', body: 'Hotel prices are only held for a short time. Nothing has been charged. Go back to the hotel to see the current price.', action: 'hotel' }); return; }
    if (e.code === 'travelers_invalid' || e.code === 'travelers_mismatch' || e.code === 'validation_failed') {
      const problems = Array.isArray(e.problems) ? (e.problems as { index: number; code: string }[]) : [];
      const names = draft?.passengers ?? [];
      const said = problems.map((p) => `${names[p.index] ? `${names[p.index].given} ${names[p.index].family}` : `Traveler ${p.index + 1}`}: ${PROBLEM[p.code] ?? 'check the details'}`);
      showFail({ title: flight ? 'Some traveler details need a fix' : 'Some guest details need a fix', body: said.length ? `${said.join('. ')}.` : 'Check the names, dates, passport details, email and phone number (with its country code), then try again.', action: 'edit' });
      return;
    }
    if (e.code === 'payments_unavailable') { showFail({ title: 'Payments aren’t available right now', body: 'Nothing has been charged. Please try again in a few minutes.', action: 'again' }); return; }
    showFail(failFor('processing_error'));
  }

  /* ---- after the card: book with the supplier, wait for it if it is slow ---- */
  async function complete(s: Started) {
    setPhase('confirm');
    let r = await api<Outcome>(`/api/checkout/${s.bookingId}/complete`, { method: 'POST', body: { guestKey: s.guestKey } });
    const status = (o?: Outcome) => o?.status;
    for (let i = 0; i < 40 && live.current && (r.error || status(r.data) === 'processing' || status(r.data) === 'awaiting_payment'); i++) {
      await sleep(3000);
      r = await api<Outcome>(`/api/checkout/${s.bookingId}${s.guestKey ? `?key=${encodeURIComponent(s.guestKey)}` : ''}`);
    }
    if (!live.current) return;
    const o = r.data;
    if (!o || o.status === 'processing' || o.status === 'awaiting_payment') { finish(s.reference, s.guestKey); return; }
    if (o.status === 'confirmed') { finish(o.reference, s.guestKey); return; }
    dropAttempt(key);
    showFail(o.code === 'payment_canceled' || o.code === 'payment_mismatch' ? failFor('processing_error') : notConfirmed());
  }

  function finish(reference: string, guestKey?: string) {
    clearDraft(key);
    dropAttempt(key);
    if (guestKey) { try { window.sessionStorage.setItem(`landfall:guest:${reference}`, guestKey); } catch { /* the URL carries it too */ } }
    router.push(`/confirmation/${reference}${guestKey ? `?key=${encodeURIComponent(guestKey)}` : ''}`);
  }

  async function pay(e?: FormEvent, retried = false) {
    e?.preventDefault();
    if (busy || !draft || !stripe || !elements) return;
    setFail(null);
    if (!terms) { setTermsErr('Tick the box to agree to the terms before you pay.'); document.getElementById('pay-terms')?.focus(); return; }
    setTermsErr('');
    if (flight && Date.now() > expiresAt) { setExpired(true); return; }

    /* 1. the card fields, then the price and the booking on the server */
    setPhase('check');
    const { error: fieldsErr } = await elements.submit();
    if (fieldsErr) { setPhase('idle'); return; } /* Stripe shows the message under the field */
    const body = bodyOf(draft);
    const r = await api<Started>('/api/checkout', { method: 'POST', body: { ...body, checkoutKey: attemptKey(key, body, retried) } });
    if (r.error) {
      if (r.error.code === 'checkout_key_in_use' && !retried) { setPhase('idle'); return pay(undefined, true); }
      startFailed(r.error);
      return;
    }
    const s = r.data;
    if (s.status === 'confirmed') { finish(s.reference, s.guestKey); return; }
    if (s.status === 'processing') { await complete(s); return; }
    if (s.status !== 'pending_payment') {
      /* this attempt already ended (failed or expired): start a new one once */
      dropAttempt(key);
      setPhase('idle');
      if (!retried) return pay(undefined, true);
      showFail(notConfirmed());
      return;
    }

    /* 2. the payment: authorised by Stripe in the browser (3-D Secure in Stripe's window) */
    setPhase('pay');
    if (s.total !== total) { elements.update({ amount: s.total }); const again = await elements.submit(); if (again.error) { setPhase('idle'); return; } }
    const returnUrl = `${window.location.origin}/checkout/return?booking=${s.bookingId}${s.guestKey ? `&key=${encodeURIComponent(s.guestKey)}` : ''}`;
    const res = await stripe.confirmPayment({ elements, clientSecret: s.clientSecret, confirmParams: { return_url: returnUrl }, redirect: 'if_required' });
    if (res.error) {
      const err: StripeError = res.error;
      /* paid already in an earlier try (the page reloaded before booking): go on to book */
      const pi = err.payment_intent;
      if (err.code === 'payment_intent_unexpected_state' && pi && (pi.status === 'requires_capture' || pi.status === 'succeeded')) { await complete(s); return; }
      if (err.type === 'validation_error') { setPhase('idle'); return; }
      showFail(failFor(err.code, err.decline_code));
      return;
    }

    /* 3. the booking with the airline or hotel */
    await complete(s);
  }

  function acceptChange() {
    if (!change) return;
    setAccepted(change.after);
    setDraft(key, { acceptedTotal: change.after });
    elements?.update({ amount: change.after });
    setChange(null);
    requestAnimationFrame(() => document.getElementById('pay-go')?.focus());
  }

  /* an expired offer: search again for the same flights and carry on with the new offer */
  async function onRefresh() {
    if (props.kind !== 'flight' || !offer) return;
    setRefreshing(true);
    const r = await api<{ offer: Offer }>(`/api/flights/offers/${encodeURIComponent(offerId)}/refresh`, { method: 'POST' });
    setRefreshing(false);
    setExpired(false);
    if (!r.data) { setSoldOut(true); return; }
    const next = r.data.offer;
    registerDict(next.dict);
    const nextKey = flightDraftKey(next.id);
    moveDraft(key, nextKey);
    setDraft(nextKey, { acceptedTotal: undefined });
    dropAttempt(key);
    setAccepted(null);
    setOffer(next);
    setDraftState(getDraft(nextKey));
    elements?.update({ amount: fareFor(next, props.fare).total });
    window.history.replaceState(null, '', checkoutUrl(next.id, props.fare));
  }

  const summary = (
    <TripSummary title={title} place={props.kind === 'flight' ? props.search.to : cityById(props.hotel.city)?.name} lines={lines} total={total} unit={unit} onBreakdown={() => setBd(true)}
      expiry={flight ? <ExpiryLine expiresAt={expiresAt} onExpire={onExpire} /> : undefined}
      after={<>{note && <p className="f-sum__note">{note}</p>}<a className="a-link f-sum__change" href={changeHref}>Change</a></>} />
  );

  if (!draft) {
    return <div className="l-container f-co"><div className="f-co__wait" aria-hidden="true"><span className="a-skel f-skel -total" /><span className="a-skel f-skel -leg" /><span className="a-skel f-skel -leg" /></div></div>;
  }
  const lead = flight ? draft.passengers?.[0] : draft.guests?.[0];
  const failAction = !fail ? null
    : fail.action === 'search' ? <ButtonLink href={searchAgain}>Search again</ButtonLink>
    : fail.action === 'hotel' ? <ButtonLink href={changeHref}>Back to the hotel</ButtonLink>
    : fail.action === 'edit' ? <ButtonLink href={editHref}>{flight ? 'Edit travelers' : 'Edit guests'}</ButtonLink>
    : fail.action === 'card' ? <Button onClick={() => { setFail(null); requestAnimationFrame(() => elements?.getElement('payment')?.focus()); }}>Try another card</Button>
    : <Button onClick={() => pay()}>Try again</Button>;

  return (
    <div className="l-container f-co">
      <Steps current={2} steps={flight
        ? [{ label: 'Choose your fare', href: changeHref }, { label: 'Travelers', href: editHref }, { label: 'Pay' }]
        : [{ label: 'Choose your room', href: `${changeHref}#rooms` }, { label: 'Guests', href: editHref }, { label: 'Pay' }]} />
      <div className="l-split">
        <div className="f-co__main">
          <h1 className="t-display t-h1">Review and pay</h1>
          {!user && <p className="t-body t-muted f-co__signin">Have an account? <a className="a-link" href={`/login?next=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/checkout')}`}>Sign in</a> to save this booking to it.</p>}

          <section className="m-card -pad f-co__card" aria-labelledby="co-contact">
            <div className="f-co__cardhead">
              <h2 className="t-h3" id="co-contact">Contact details</h2>
              <a className="a-link" href={editHref} aria-label="Edit contact details">Edit</a>
            </div>
            {lead && 'given' in lead && <p className="t-body f-co__who">{lead.given} {lead.family}</p>}
            <p className="t-body t-num">{draft.email}</p>
            {draft.phone && <p className="t-body t-num">{draft.phone}</p>}
            <p className="t-small t-muted">We’ll send the confirmation and any changes to this booking here.</p>
          </section>

          <section className="m-card -pad f-co__card bk-price" aria-label="Price details">
            <PriceTable rows={priceRows} total={total} note={note ?? undefined} taxes={stayTax} />
            <div className="bk-terms">
              <h2 className="t-h3">{flight ? 'Changes and cancellation' : 'Cancellation and changes'}</h2>
              <p className="t-small">{terms2[0]}</p>
              <p className="t-small">{terms2[1]}</p>
              {props.kind === 'stay' && props.plan.conditions?.map((c) => <p className="t-small" key={c.title + c.body.slice(0, 20)}><b>{c.title}</b> {c.body}</p>)}
              <a className="a-link t-small" href={flight ? changeHref : `${changeHref}#rules`}>Full conditions</a>
            </div>
          </section>

          <form className="m-card -pad f-co__card f-pay" aria-labelledby="co-pay" noValidate onSubmit={(e) => pay(e)}>
            <h2 className="t-h3" id="co-pay">Payment</h2>
            {fail && (
              <Notice key={failKey} tone="error" focusOnMount title={fail.title} actions={failAction}>
                <p>{fail.body}</p>
              </Notice>
            )}
            {change && props.kind === 'flight' && <FareChange before={change.before} after={change.after} pax={props.search} onContinue={acceptChange} backHref={resultsUrl(props.search)} />}
            {change && props.kind === 'stay' && (
              <Notice tone={change.after > change.before ? 'warn' : 'success'} focusOnMount className="f-change"
                title={change.after > change.before ? `The price went up by ${money(change.after - change.before)}` : `The price went down by ${money(change.before - change.after)}`}
                actions={<><Button onClick={acceptChange}>Continue at {money(change.after)}</Button><ButtonLink variant="ghost" href={changeHref}>Back to the hotel</ButtonLink></>}>
                <p>The hotel changed the rate after you searched. Your new total is {money(change.after)}, taxes and fees included.</p>
              </Notice>
            )}
            {soldOut && <Notice tone="warn" focusOnMount title="This flight is no longer available" actions={<ButtonLink href={searchAgain}>Back to results</ButtonLink>}><p>The seats at this fare sold out after you searched. Other flights on your dates may still have space.</p></Notice>}
            <div className="f-pay__element">
              <PaymentFields disabled={busy} onReady={() => setReady(true)} />
            </div>
            <Checkbox id="pay-terms" checked={terms} onChange={(e) => { setTerms(e.target.checked); if (e.target.checked) setTermsErr(''); }} error={termsErr} disabled={busy}>
              I agree to the <a className="a-link" href="/terms">Terms and conditions</a> and <a className="a-link" href="/privacy">Privacy policy</a>, {flight ? 'and to the airline’s fare rules shown for this booking.' : 'and to the hotel’s cancellation policy shown for this room.'}
            </Checkbox>
            <div className="f-pay__go">
              <Button id="pay-go" type="submit" block large disabled={busy || soldOut || !!change || !payReady || !ready} aria-busy={busy || undefined}>
                {busy ? progress : `Pay ${money(total)}`}
              </Button>
              {busy && props.kind === 'flight' && <FlightPath from={props.search.from} to={props.search.to} className="f-pay__route" />}
              {busy && <p className="t-small t-muted f-pay__wait">This can take a few seconds. Please keep this page open.</p>}
              <p className="sr-only" aria-live="polite">{progress}</p>
              <ul className="f-pay__trust t-small t-muted">
                <li><Icon name="lock" size="sm" />Card payments by Stripe. Your card number goes to Stripe, not to us.</li>
                <li><Icon name="tick" size="sm" />Your card is only charged once the {flight ? 'airline' : 'hotel'} confirms your booking.</li>
                <li><Icon name="tick" size="sm" />Your total includes taxes and fees.</li>
              </ul>
            </div>
          </form>
        </div>
        <aside className="l-split__aside f-co__aside">{desktop && summary}</aside>
      </div>
      {!desktop && (
        <>
          <PriceBar total={`${money(total)} total`} sub={unit} note="taxes and fees included" onTotal={() => setSheet(true)} action={null}
            totalLabel={`${money(total)} total ${who}. Show the booking summary`} />
          <Dialog open={sheet} onClose={() => setSheet(false)} title={title} sheet closeLabel="Close the booking summary">{summary}</Dialog>
        </>
      )}
      <Breakdown open={bd} onClose={() => setBd(false)} data={breakdown} />
      {props.kind === 'flight' && <ExpiredDialog open={expired} onRefresh={onRefresh} busy={refreshing} backHref={resultsUrl(props.search)} />}
    </div>
  );
}
