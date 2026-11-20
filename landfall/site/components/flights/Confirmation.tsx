/* =====================================================================
   Landfall (working name, a placeholder), group F: confirmation
   Spec 2b, Confirmation: a 760 column. The destination's water photo at
   21:9 (radius 16), then the arrival: the success chip and the H1 ("You're
   going to Lisbon") with the landfall line running out under it, the
   booking reference in a foam panel with Copy, the lead line, the
   itinerary timeline (or the stay card), the paid total with the landfall
   line above it, travel documents (e-ticket numbers, or the "issuing"
   line while the airline issues them), what happens next, and the two
   pills. Flights and stays both land here.
   The booking comes from the server (GET /api/bookings/<ref>): its owner
   signed in, or the guest key from checkout or the confirmation email
   (?key=, or kept in this tab's sessionStorage by checkout). While the
   airline or hotel is still confirming (pending), the page says so and
   checks again every few seconds. Test bookings carry a small note.
   Copy: landfall/content/copy.md, Confirmation (Flights and Hotels).
   ===================================================================== */
'use client';
import { useEffect, useState } from 'react';
import { airlineName, cityOf, registerDict, searchQuery, type Pax } from '@/lib/travel/flights';
import { cityById, nightsOf } from '@/lib/travel/hotels';
import FlightPath from '@/components/ui/FlightPath';
import type { Booking, FlightBooking, StayBooking } from '@/lib/travel/bookings';
import { addIsoDays, dayRange, dayShort, dollars, money, plural } from '@/lib/format';
import { paxLine, routeTitle } from '@/lib/text';
import { destinationPhoto } from '@/lib/data/destinations';
import { toast } from '@/lib/client';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';
import { SITE } from '@/lib/site';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/chrome/Sprite';
import Photo from '@/components/ui/Photo';
import Notice from '@/components/ui/Notice';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Breakdown, Timeline, flightBreakdown, type BreakdownRows } from './parts';
import { perTraveler } from './trip';
import { CalendarButton, PrintButton } from '@/components/booking/tools';
import { FlightFares, StayRail } from '@/components/booking/Extras';

/* the destination's water photo, or for a stay without one the hotel's own lead photo */
function Strip({ city, photo }: { city: string; photo?: string | null }) {
  const d = destinationPhoto(city);
  if (!d && photo) return <Photo name={photo} alt="" className="f-cf__photo" priority grade={false} sizes="(min-width: 841px) 760px, calc(100vw - 32px)" />;
  const ph = d ?? { image: 'promo/ferry-deck-puget-sound', alt: 'A ferry deck at sunset, its lights on along the rail above calm water' };
  return <Photo name={ph.image} alt={ph.alt} className="f-cf__photo" priority sizes="(min-width: 841px) 760px, calc(100vw - 32px)" />;
}

function Reference({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(code); } catch { /* the toast still confirms; the reference stays selectable */ }
    setCopied(true);
    toast('Copied');
    window.setTimeout(() => setCopied(false), 2400);
  }
  return (
    <div className="f-ref">
      <p className="f-ref__label t-small t-muted">Booking reference</p>
      <p className="f-ref__code t-ref">{code}</p>
      <Button variant="ghost" onClick={copy} icon={copied ? 'tick' : 'copy'} aria-label={copied ? 'Copied' : `Copy booking reference ${code}`}>{copied ? 'Copied' : 'Copy'}</Button>
    </div>
  );
}

function TestNote({ on }: { on?: boolean }) {
  return on ? <p className="t-small t-muted f-cf__test"><Icon name="info" size="sm" />Test booking: nothing real was booked or charged.</p> : null;
}

/* the header: confirmed, still confirming with the supplier, or not booked */
function Head({ b, h1, who }: { b: Booking; h1: string; who: 'airline' | 'hotel' }) {
  const pending = b.status === 'pending';
  const failed = b.status === 'failed';
  return (
    <>
      <header className="f-cf__head">
        {b.kind === 'flight' && b.status === 'confirmed' && <FlightPath mode="once" from={b.from} to={b.to} className="f-cf__route" />}
        <p className="f-cf__ok">{failed ? 'Not booked' : pending ? 'Payment held, confirming' : b.status === 'canceled' ? 'Canceled' : 'Booking confirmed'}</p>
        <h1 className="t-display t-h1 f-cf__h1">{failed ? 'This booking didn’t go through' : h1}</h1>
      </header>
      {pending && (
        <div aria-live="polite">
          <Notice tone="info" title={`We’re confirming your booking with the ${who}`}>
            <p>Your payment is held, not taken, until the {who} confirms. This page updates by itself, and we’ll email you as soon as it’s confirmed.</p>
          </Notice>
        </div>
      )}
      {failed && (
        <Notice tone="error" title="Your card has not been charged" actions={<ButtonLink href="/">Search again</ButtonLink>}>
          <p>The {who} couldn’t confirm this booking, so the payment was released. Search again to see what’s available now.</p>
        </Notice>
      )}
    </>
  );
}

function Paid({ total, card, rows }: { total: number; card: { brand: string; last4: string } | null; rows: BreakdownRows }) {
  const [bd, setBd] = useState(false);
  return (
    <section className="f-cf__sec -paid" aria-labelledby="cf-paid">
      <div className="m-total f-paid">
        <h2 className="f-paid__total t-num" id="cf-paid">Paid {money(total)}</h2>
        <p className="t-small t-muted t-num">{rows.unit}</p>
        <p className="t-small t-muted">taxes and fees included</p>
        {card && <p className="t-small t-muted">with {card.brand} ending {card.last4}</p>}
        <button type="button" className="a-link f-sum__bd" onClick={() => setBd(true)}>See price breakdown</button>
      </div>
      <Breakdown open={bd} onClose={() => setBd(false)} data={rows} />
    </section>
  );
}

function Next({ rows }: { rows: [IconName, string][] }) {
  return (
    <section className="f-cf__sec" aria-labelledby="cf-next">
      <h2 className="t-display t-h2 f-cf__h2" id="cf-next">What happens next</h2>
      <ul className="f-next">
        {rows.map(([icon, r], i) => <li key={i}><span className="f-next__icon" aria-hidden="true"><Icon name={icon} /></span><p className="t-body">{r}</p></li>)}
      </ul>
    </section>
  );
}

function FlightConfirmation({ b, signedIn }: { b: FlightBooking; signedIn: boolean }) {
  registerDict(b.dict);
  const city = cityOf(b.to);
  const airline = airlineName(b.airline);
  const pax: Pax = b.pax;
  const done = b.status !== 'failed' && b.status !== 'pending';
  useEffect(() => {
    const set = () => { document.title = `You’re going to ${city} | ${SITE.name}`; };
    set();
    const late = window.setTimeout(set, 400);
    return () => window.clearTimeout(late);
  }, [city]);
  const unit = `${money(perTraveler(b.amounts.total, pax))} per traveler`;
  const slug = city.toLowerCase().replace(/\s+/g, '-');
  const hotelsHref = `/hotels?${new URLSearchParams({ place: slug, checkin: b.depart, checkout: b.ret || addIsoDays(b.depart, 4), adults: String(pax.adults), children: String(pax.children), rooms: '1' })}`;
  const hasHotels = done && !!cityById(slug);
  const ticketed = b.travelers.filter((t) => t.ticket);
  const docs = ticketed.length ? ticketed.map((t) => ({ who: t.name, id: t.ticket! })) : b.documents.filter((d) => d.type === 'electronic_ticket').map((d) => ({ who: d.passenger ?? '', id: d.id }));
  const pnr = b.supplierReference;
  return (
    <>
      <Strip city={b.to} />
      <Head b={b} h1={`You’re going to ${city}`} who="airline" />
      <Reference code={b.ref} />
      <TestNote on={b.testMode} />
      <p className="t-lead f-cf__lead t-num">{routeTitle(b.from, b.to)}, {dayRange(b.depart, b.ret)}, {paxLine(pax)}.</p>

      <section className="f-cf__sec" aria-labelledby="cf-flights">
        <h2 className="t-display t-h2 f-cf__h2" id="cf-flights">Your flights</h2>
        <Timeline slices={b.slices} cabin={b.cabin} />
      </section>

      {b.status !== 'failed' && <Paid total={b.amounts.total} card={b.card} rows={flightBreakdown(b.amounts, pax, unit)} />}

      {done && (
        <section className="f-cf__sec" aria-labelledby="cf-docs">
          <h2 className="t-display t-h2 f-cf__h2" id="cf-docs">Travel documents</h2>
          <div aria-live="polite">
            {b.ticketsPending || !docs.length ? (
              <p className="f-issuing t-body"><span className="a-skel f-issuing__dot" aria-hidden="true" />The airline is issuing your e-tickets. They’ll appear here and in your email once they’re ready.</p>
            ) : (
              <>
                <p className="t-body t-muted">Your e-ticket numbers. The airline may ask for them at check-in.</p>
                <ul className="f-tickets">
                  {docs.map((t) => <li key={t.who + t.id}><span>{t.who}</span><span className="t-num">e-ticket {t.id}</span></li>)}
                </ul>
              </>
            )}
            {pnr && <p className="t-body t-num">Airline reference {pnr}</p>}
          </div>
        </section>
      )}

      {b.status !== 'failed' && (
        <Next rows={[
          ['mail', `Your confirmation is on its way to ${b.email}, with your booking reference and itinerary.`],
          ['ticket', signedIn ? 'Your e-ticket numbers stay in My bookings, with everything on this page.' : 'Your e-ticket numbers stay on this page; the link in your confirmation email brings you back to it.'],
          ['plane', `Check in with ${airline} online before you go, using ${pnr ? `airline reference ${pnr}` : `booking reference ${b.ref}`}, and bring the passport or ID you entered for each traveler.`],
          ['phone', 'Need to change something? Contact us with your booking reference.']
        ]} />
      )}

      {done && (
        <div className="f-cf__actions">
          {signedIn && <ButtonLink href={`/bookings/${b.ref}`} arrow>View booking</ButtonLink>}
          <CalendarButton b={b} />
          <PrintButton />
        </div>
      )}

      {hasHotels && <StayRail cityId={slug} cityName={city} checkin={b.depart} checkout={b.ret} pax={pax} />}
      {hasHotels && <p className="bk-after__more"><a className="a-link" href={hotelsHref}>Search all hotels in {city}</a></p>}
    </>
  );
}

function StayConfirmation({ b, signedIn }: { b: StayBooking; signedIn: boolean }) {
  const h = b.stay;
  const city = h.cityName || cityById(b.search.place)?.name || '';
  const nights = nightsOf(b.search);
  const done = b.status !== 'failed' && b.status !== 'pending';
  useEffect(() => {
    const set = () => { document.title = `You’re staying at ${h.name} | ${SITE.name}`; };
    set();
    const late = window.setTimeout(set, 400);
    return () => window.clearTimeout(late);
  }, [h.name]);
  const lead = b.guests[0] || '';
  const code = destinationPhoto(city)?.code;
  const flightsHref = code ? `/flights?${searchQuery({ from: 'LHR', to: code, depart: b.search.checkin, ret: b.search.checkout, adults: b.search.adults, children: b.search.children, infants: 0, cabin: 'economy' })}` : null;
  const perNight = Math.round(b.amounts.total / Math.max(1, nights));
  const rows: BreakdownRows = { rows: [[`Room, ${dollars(perNight)} per night x ${plural(nights, 'night', 'nights')}`, b.amounts.total]], total: b.amounts.total, unit: `${dollars(perNight)} per night, ${plural(nights, 'night', 'nights')}`, line: `of which taxes and fees ${money(b.amounts.tax)}` };
  const where = [h.name, city].filter(Boolean).join(', ');
  return (
    <>
      <Strip city={city} photo={h.photo} />
      <Head b={b} h1={`You’re staying at ${h.name}`} who="hotel" />
      <Reference code={b.ref} />
      <TestNote on={b.testMode} />
      <p className="t-lead f-cf__lead t-num">{where}, {dayRange(b.search.checkin, b.search.checkout)}, {plural(nights, 'night', 'nights')}, {plural(b.search.adults, 'adult', 'adults')}.</p>

      <section className="f-cf__sec" aria-labelledby="cf-stay">
        <h2 className="t-display t-h2 f-cf__h2" id="cf-stay">Your stay</h2>
        <dl className="m-card -pad f-stay">
          <div><dt>Room</dt><dd>{b.roomName}{b.board ? `, ${b.board.toLowerCase()}` : ''}</dd></div>
          {b.planName && <div><dt>Rate</dt><dd>{b.planName}</dd></div>}
          <div><dt>Dates</dt><dd className="t-num">{dayRange(b.search.checkin, b.search.checkout)}, {plural(nights, 'night', 'nights')}</dd></div>
          {h.checkIn && <div><dt>Check-in</dt><dd className="t-num">From {h.checkIn}</dd></div>}
          {h.checkOut && <div><dt>Check-out</dt><dd className="t-num">Until {h.checkOut}</dd></div>}
          {h.address && <div><dt>Address</dt><dd>{h.address}</dd></div>}
          {b.supplierReference && <div><dt>Hotel confirmation</dt><dd className="t-num">{b.supplierReference}</dd></div>}
          {h.phone && <div><dt>Hotel phone</dt><dd className="t-num">{h.phone}</dd></div>}
          {h.keyCollection && <div><dt>Key collection</dt><dd>{h.keyCollection}</dd></div>}
        </dl>
        {!!b.conditions?.length && (
          <dl className="f-stay__rules t-small">
            {b.conditions.map((c) => <div key={c.title + c.body.slice(0, 20)}><dt>{c.title}</dt><dd>{c.body}</dd></div>)}
          </dl>
        )}
      </section>

      {b.status !== 'failed' && <Paid total={b.amounts.total} card={b.card} rows={rows} />}

      {b.status !== 'failed' && (
        <Next rows={[
          ['mail', `Your confirmation is on its way to ${b.email}.`],
          ['door', `${h.checkIn ? `Check in from ${h.checkIn} on ${dayShort(b.search.checkin)}` : `Check in on ${dayShort(b.search.checkin)}`}. The booking is under ${lead}.`],
          ['user', 'Bring ID that matches the lead guest’s name.'],
          ...(b.payAtHotel ? [['info', `Local taxes of ${b.payAtHotel.currency} ${(b.payAtHotel.amount / 100).toFixed(2)} are paid at the hotel.`] as [IconName, string]] : []),
          ['refund', b.freeCancelUntil ? `Free cancellation until 23:59 hotel time on ${dayShort(b.freeCancelUntil)}. After that, this booking can’t be refunded.` : 'This rate is non-refundable from the moment you book.']
        ]} />
      )}

      {done && (
        <div className="f-cf__actions">
          {signedIn && <ButtonLink href={`/bookings/${b.ref}`} arrow>View booking</ButtonLink>}
          <CalendarButton b={b} />
          <PrintButton />
        </div>
      )}

      {done && flightsHref && <FlightFares cityName={city} checkin={b.search.checkin} checkout={b.search.checkout} adults={b.search.adults} children={b.search.children} />}
    </>
  );
}

function Missing({ refCode, signedIn }: { refCode: string; signedIn: boolean }) {
  useEffect(() => { document.title = `Booking not found | ${SITE.name}`; }, []);
  return (
    <>
      <header className="f-cf__head">
        <h1 className="t-display t-h1 f-cf__h1">We couldn’t find this booking</h1>
      </header>
      <Notice tone="info" title={`Booking ${refCode}`} actions={signedIn
        ? <ButtonLink href="/bookings">My bookings</ButtonLink>
        : <ButtonLink href={`/login?next=${encodeURIComponent(`/bookings/${refCode}`)}`}>Sign in</ButtonLink>}>
        <p>{signedIn
          ? 'It isn’t in your account. Check the reference, or open the link in your confirmation email.'
          : 'Sign in to the account you booked with, or open the link in your confirmation email.'}</p>
      </Notice>
    </>
  );
}

type View = { status: 'loading' } | { status: 'ok'; booking: Booking } | { status: 'missing' };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Confirmation({ refCode, accessKey }: { refCode: string; accessKey?: string }) {
  const session = useSession();
  const [view, setView] = useState<View>({ status: 'loading' });

  useEffect(() => {
    if (session.status === 'loading') return;
    let live = true;
    let key = accessKey;
    if (!key) { try { key = window.sessionStorage.getItem(`landfall:guest:${refCode}`) ?? undefined; } catch { /* storage blocked */ } }
    const url = `/api/bookings/${encodeURIComponent(refCode)}${key ? `?key=${encodeURIComponent(key)}` : ''}`;
    (async () => {
      for (let i = 0; i < 25 && live; i++) {
        const r = await api<{ booking: Booking }>(url);
        if (!live) return;
        if (r.error) {
          if (r.error.status === 404 || r.error.status === 401) { setView({ status: 'missing' }); return; }
          if (i === 0) setView((v) => (v.status === 'ok' ? v : { status: 'missing' }));
        } else {
          setView({ status: 'ok', booking: r.data.booking });
          if (r.data.booking.status !== 'pending') return;
        }
        await sleep(5000);
      }
    })();
    return () => { live = false; };
  }, [refCode, accessKey, session.status]);

  if (view.status === 'loading') {
    return <div className="f-cf" aria-hidden="true"><span className="a-skel f-cf__photo f-cf__wait" /></div>;
  }
  const signedIn = !!session.user;
  if (view.status === 'missing') return <div className="f-cf"><Missing refCode={refCode} signedIn={signedIn} /></div>;
  const b = view.booking;
  return <div className="f-cf">{b.kind === 'flight' ? <FlightConfirmation b={b} signedIn={signedIn} /> : <StayConfirmation b={b} signedIn={signedIn} />}</div>;
}
