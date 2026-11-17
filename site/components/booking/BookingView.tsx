'use client';
/* =====================================================================
   One view for a booking, in two modes (spec 2b):
   - confirmation: one centred 720 column, the success chip, "You're
     booked", the reference in Calibre Thin with a Copy pill, the
     itinerary or stay card, travel documents, payment, what to do next,
     where the email went, View in Bookings and Print;
   - detail (booking detail): the same parts under the trip's name with
     its status, travelers, payment lines, and the change or cancel
     actions the airline or hotel allows (copy.md, Booking detail).
   The booking comes from the browser (lib/store.ts) or the demo account.
   ===================================================================== */
import { useEffect, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Itinerary } from '@/components/flights/Itinerary';
import { Photo } from '@/components/Photo';
import { DESTINATIONS } from '@/lib/data/destinations';
import { Dialog } from '@/components/ui/Dialog';
import { Notice, StatusChip } from '@/components/ui/Notice';
import { AIRLINES, fareFor } from '@/lib/mock/flights';
import { HOTELS, cityById, hotelById, nightsOf, planById, stayQuery, stayTotals, type Hotel, type StaySearch } from '@/lib/mock/hotels';
import { Glyph } from '@/components/booking/Glyphs';
import { Score } from '@/components/ui/Score';
import { CATALOGUE_CITIES, catalogueCity } from '@/lib/mock/catalogue';
import type { Booking, FlightBooking, StayBooking } from '@/lib/mock/bookings';
import { cancelBooking } from '@/lib/store';
import { setProduct, toast } from '@/lib/client';
import { dateLine, dayRange, dayShort, dollars, money, plural } from '@/lib/format';
import { paxLine, routeTitle } from '@/lib/text';
import { ROUTES, SITE } from '@/lib/site';

function Reference({ value, big }: { value: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const t = window.setTimeout(() => setCopied(false), 2000); return () => window.clearTimeout(t); }, [copied]);
  async function copy() {
    try { await navigator.clipboard.writeText(value); } catch { /* the reference stays on screen to copy by hand */ }
    setCopied(true);
    toast('Copied');
  }
  return (
    <div className={`m-ref${big ? ' -big' : ''}`}>
      <p className="m-ref__label">Booking reference</p>
      <div className="m-ref__row">
        <p className="m-ref__value">{value}</p>
        <span className="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
        <button className="a-button -soft -small -steady" type="button" onClick={copy} aria-label={copied ? 'Copied' : `Copy booking reference ${value}`}>
          <Icon name={copied ? 'tick' : 'copy'} size="s" className="a-button__icon" /><span className="a-button__label">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}

function useNow(until: number) {
  const [now, setNow] = useState(() => 0);
  useEffect(() => {
    setNow(Date.now());
    if (until <= Date.now()) return;
    const t = window.setTimeout(() => setNow(Date.now()), until - Date.now() + 50);
    return () => window.clearTimeout(t);
  }, [until]);
  return now;
}

function Documents({ b }: { b: FlightBooking }) {
  const now = useNow(b.ticketsAt);
  const issuing = now === 0 || now < b.ticketsAt;
  return (
    <section className="o-booking__section" aria-labelledby="docs-title">
      <h2 className="a-h3" id="docs-title">Travel documents</h2>
      {issuing && b.ticketsAt > 0 ? (
        <p className="o-booking__text" aria-live="polite">The airline is issuing your e-tickets. They’ll appear here and in your email once they’re ready.</p>
      ) : (
        <>
          <p className="o-booking__text">Your e-ticket numbers. The airline may ask for them at check-in.</p>
          <ul className="o-booking__rows">
            {b.travelers.map((t, i) => <li key={`${i}-${t.name}`} className="o-booking__row"><Icon name="ticket" size="s" />{t.name}, e-ticket <span className="o-booking__mono">{t.ticket}</span></li>)}
          </ul>
          <div className="o-booking__docActions">
            <button className="a-button -soft -small" type="button" onClick={() => window.print()}><Glyph name="download" size="s" /><span className="a-button__label">Save as PDF</span></button>
          </div>
        </>
      )}
    </section>
  );
}

function StayCard({ b }: { b: StayBooking }) {
  const h = hotelById(b.hotel)!, r = h.rooms.find((x) => x.id === b.room)!;
  const n = nightsOf(b.search);
  const p = planById(r, b.plan);
  return (
    <div className="m-stayCard">
      <div className="m-stayCard__text">
        <h3 className="m-stayCard__title">{h.name}</h3>
        <ul className="m-stayCard__rows">
          <li>{r.name}, {plural(b.search.adults, 'adult', 'adults')}{b.search.children ? `, ${plural(b.search.children, 'child', 'children')}` : ''}, {plural(b.search.rooms, 'room', 'rooms')}</li>
          <li>{p.name}</li>
          <li>{dayRange(b.search.checkin, b.search.checkout)}, {plural(n, 'night', 'nights')}</li>
          <li>Check-in from {h.checkIn}, check-out until {h.checkOut}</li>
          <li>{h.address}</li>
        </ul>
      </div>
    </div>
  );
}

export function BookingView({ booking, mode }: { booking: Booking; mode: 'confirmation' | 'detail' }) {
  const [dialog, setDialog] = useState(false);
  const [justCanceled, setJustCanceled] = useState(false);
  const flight = booking.kind === 'flight';
  /* the confirmation marks the product just booked in the rail (revision item 7); the booking page leaves Bookings current */
  useEffect(() => {
    if (mode !== 'confirmation') return;
    setProduct(flight ? 'flights' : 'hotels');
    return () => setProduct(null);
  }, [mode, flight]);
  const fb = flight ? (booking as FlightBooking) : null;
  const sb = !flight ? (booking as StayBooking) : null;
  const h = sb ? hotelById(sb.hotel)! : null;
  const city = h ? cityById(h.city)?.name ?? '' : '';
  const dest = fb ? DESTINATIONS.find((d) => d.code === fb.to) : DESTINATIONS.find((d) => d.city === city);
  /* polish round, 11 Nov (critic): a stay's window shows the hotel's own first photo, as its card in Bookings does;
     a flight's shows the destination city */
  const windowPhoto = fb ? dest?.image : h?.photos[0]?.name;
  const paid = `Paid ${money(booking.amounts.total)} with ${booking.card.brand} ending ${booking.card.last4}`;
  const lead = fb
    ? `${routeTitle(fb.from, fb.to)}, ${dayRange(fb.depart, fb.ret)}, ${paxLine(fb.pax)}.`
    : `${h!.name}, ${city}, ${dayRange(sb!.search.checkin, sb!.search.checkout)}, ${plural(nightsOf(sb!.search), 'night', 'nights')}, ${plural(sb!.search.adults, 'adult', 'adults')}.`;
  const past = booking.status === 'completed' || booking.status === 'canceled';
  const airline = fb ? AIRLINES[fb.airline]?.name : '';
  const fare = fb ? fareFor(fb.airline, fb.fare) : null;
  const room = sb && h ? h.rooms.find((x) => x.id === sb.room) : undefined;
  const plan = room ? planById(room, sb!.plan) : null;

  function doCancel() {
    cancelBooking(booking.ref);
    setDialog(false);
    setJustCanceled(true);
    toast('Booking canceled');
    /* focus lands on the result, not the page (critic round 1) */
    window.setTimeout(() => document.getElementById('chg-line')?.focus(), 60);
  }

  const next = fb ? [
    `Check in with ${airline} online before you go, using booking reference ${booking.ref}.`,
    'Bring the passport or ID you entered for each traveler.',
    'Need to change something? Contact us with your booking reference.'
  ] : [
    `Check in from ${h!.checkIn} on ${dayShort(sb!.search.checkin)}. The booking is under ${sb!.guests[0]}.`,
    'Bring ID that matches the lead guest’s name.',
    ...(sb!.freeCancelUntil ? [`Free cancellation until 23:59 hotel time on ${dayShort(sb!.freeCancelUntil)}. After that, this booking can’t be refunded.`] : [])
  ];

  /* ---- changes and cancellations (detail only) ---- */
  let changes: React.ReactNode = null;
  if (mode === 'detail' && !past) {
    const today = new Date().toISOString().slice(0, 10);
    if (fb) {
      changes = fb.refund !== null ? (
        <>
          <p className="o-booking__text">{airline} lets you cancel this booking online. If you cancel now, the airline refunds {money(fb.refund)} to your {fb.card.brand} ending {fb.card.last4}.</p>
          <button className="a-button -outline" type="button" onClick={() => setDialog(true)}><span className="a-button__label">Cancel booking</span></button>
        </>
      ) : (
        <p className="o-booking__text">To change or cancel this booking, call <a className="a-link" href={SITE.phoneHref}>{SITE.phone}</a> or email <a className="a-link" href={`mailto:${SITE.email}`}>{SITE.email}</a> with your booking reference. What’s possible depends on the airline’s fare rules.</p>
      );
    } else if (sb) {
      changes = sb.freeCancelUntil && today <= sb.freeCancelUntil ? (
        <>
          <p className="o-booking__text">Free cancellation until 23:59 hotel time on {dayShort(sb.freeCancelUntil)}. Cancel before then and you’ll get the full {money(sb.amounts.total)} back.</p>
          <button className="a-button -outline" type="button" onClick={() => setDialog(true)}><span className="a-button__label">Cancel booking</span></button>
        </>
      ) : (
        <p className="o-booking__text">This booking can no longer be refunded. If your plans have changed, <Link className="a-link" href={ROUTES.contact}>contact us</Link> and we’ll ask the hotel what’s possible.</p>
      );
    }
  }

  return (
    <div className={`o-booking -${mode}`}>
      {mode === 'confirmation' ? (
        <div className="o-booking__head">
          <span className="a-status -success"><Icon name="tick" size="s" />Booking confirmed</span>
          {/* Chief Officer, 11 Nov (note 4): the one funnel page without imagery gets the destination's cabin window beside
              its title, as on flight results (it replaces the session 2 rule of no photo on confirmations) */}
          <div className={`o-booking__titleRow${windowPhoto ? ' -window' : ''}`}>
            {windowPhoto && (
              <span className="a-porthole" aria-hidden="true">
                <Photo name={windowPhoto} alt="" sizes="72px" className="a-porthole__img" />
              </span>
            )}
            <h1 className="a-h1 o-booking__title">You’re booked</h1>
          </div>
          <Reference value={booking.ref} big />
          <p className="o-booking__lead">{lead}</p>
        </div>
      ) : (
        <div className="o-booking__head">
          <Link className="a-back" href={ROUTES.bookings}><Icon name="chev-left" size="s" />Bookings</Link>
          <h1 className="a-h1 o-booking__title">{fb ? routeTitle(fb.from, fb.to) : h!.name}</h1>
          <div className="o-booking__status"><StatusChip status={booking.status} /></div>
          <Reference value={booking.ref} />
        </div>
      )}

      {mode === 'detail' && booking.status === 'changed' && fb && (
        <Notice tone="warn" icon="alert" title={`${airline} has changed your flight times`}
          actions={<Link className="a-button" href={ROUTES.contact}><span className="a-button__label">Contact us</span></Link>}>
          <p>Your outbound flight now leaves at 07:40 and lands at 10:25. If the new times don’t work for you, contact us with your booking reference.</p>
        </Notice>
      )}

      <section className="o-booking__section" aria-labelledby="trip-title">
        <h2 className={mode === 'confirmation' ? 'sr-only' : 'a-h3'} id="trip-title">{fb ? 'Your flights' : 'Your stay'}</h2>
        {fb ? <Itinerary slices={fb.slices} cabin={fb.cabin} origin={fb.from} /> : <StayCard b={sb!} />}
      </section>

      {mode === 'detail' && (
        <section className="o-booking__section" aria-labelledby="who-title">
          <h2 className="a-h3" id="who-title">{fb ? 'Travelers' : 'Guests'}</h2>
          <ul className="o-booking__rows">
            {fb ? fb.travelers.map((t, i) => <li className="o-booking__row" key={`${i}-${t.name}`}><Icon name="user" size="s" />{t.name}, {t.type}{t.lead ? ', lead traveler' : ''}</li>)
              : sb!.guests.map((g, i) => <li className="o-booking__row" key={`${i}-${g}`}><Icon name="user" size="s" />{g}{i === 0 ? ', lead guest' : ''}</li>)}
            {sb?.arrival && <li className="o-booking__row"><Icon name="clock" size="s" />Estimated arrival {sb.arrival}</li>}
            {sb?.requests && <li className="o-booking__row"><Icon name="mail" size="s" />Your request to the hotel: {sb.requests}</li>}
          </ul>
        </section>
      )}

      {fb && booking.status !== 'canceled' && <Documents b={fb} />}

      <section className="o-booking__section" aria-labelledby="pay-title">
        <h2 className={mode === 'confirmation' ? 'sr-only' : 'a-h3'} id="pay-title">Payment</h2>
        {mode === 'detail' ? (
          <dl className="o-booking__lines">
            <div><dt>{fb ? 'Flights' : `Room, ${plural(nightsOf(sb!.search), 'night', 'nights')}`}</dt><dd>{money(fb ? fb.amounts.base : sb!.amounts.room)}</dd></div>
            <div><dt>Taxes and fees</dt><dd>{money(booking.amounts.tax)}</dd></div>
            <div className="-paid"><dt>{paid} on {dateLine(booking.bookedAt)}</dt><dd /></div>
          </dl>
        ) : (
          <p className="o-booking__row -pay"><Icon name="card" size="s" />{paid}</p>
        )}
        {mode === 'detail' && (
          <div className="m-receipt">
            <p className="m-receipt__title"><Icon name="card" size="s" />Payment receipt</p>
            <dl className="m-receipt__rows">
              <div><dt>Card</dt><dd>{booking.card.brand} ending {booking.card.last4}</dd></div>
              <div><dt>Paid on</dt><dd>{dateLine(booking.bookedAt)}</dd></div>
              <div><dt>Amount</dt><dd>{money(booking.amounts.total)}</dd></div>
              <div><dt>{fb ? 'Fare' : 'Rate'}</dt><dd>{fb ? `${fare!.name}, ${airline}` : plan?.name}</dd></div>
            </dl>
          </div>
        )}
      </section>

      {mode === 'detail' && (fare?.rows || plan) && (
        <section className="o-booking__section" aria-labelledby="rules-title">
          <h2 className="a-h3" id="rules-title">{fb ? `${fare!.name} fare rules` : 'Rate terms'}</h2>
          <ul className="o-booking__rows">
            {fb && fare?.rows ? (
              <>
                <li className="o-booking__row"><Glyph name="change" size="s" />{/^Not allowed/i.test(fare.rows.changes) ? 'Changes aren’t allowed on this fare.' : fare.rows.changes.replace(/^For a fee:\s*/i, '')}</li>
                <li className="o-booking__row"><Glyph name="refund" size="s" />{/^Not refundable/i.test(fare.rows.refunds) ? 'This fare can’t be refunded if you cancel.' : fare.rows.refunds}</li>
                <li className="o-booking__row"><Glyph name="bag-cabin" size="s" />{fare.rows.cabinBag.replace(/^For a fee:\s*/i, '')}{/^For a fee/i.test(fare.rows.cabinBag) ? ', for a fee' : ''}</li>
                <li className="o-booking__row"><Glyph name="bag-checked" size="s" />{fare.rows.checkedBag.replace(/^For a fee:\s*/i, '')}{/^For a fee/i.test(fare.rows.checkedBag) ? ', for a fee' : ''}</li>
              </>
            ) : plan && sb ? (
              <>
                <li className="o-booking__row"><Glyph name="refund" size="s" />{plan.refundable && sb.freeCancelUntil ? `Free cancellation until 23:59 hotel time on ${dayShort(sb.freeCancelUntil)}. After that, the booking can’t be refunded.` : 'This rate is non-refundable from the moment you book.'}</li>
                <li className="o-booking__row"><Glyph name="meal" size="s" />{plan.breakfast ? 'Breakfast included for everyone in the room.' : 'Room only. Breakfast isn’t included.'}</li>
                <li className="o-booking__row"><Glyph name="key" size="s" />Check-in from {h!.checkIn}, check-out until {h!.checkOut}.</li>
              </>
            ) : null}
          </ul>
          {fb && <p className="o-booking__note">The airline sets these rules. We show them exactly as the airline sends them.</p>}
        </section>
      )}

      {sb && mode === 'detail' && booking.status !== 'canceled' && (
        <section className="o-booking__section" aria-labelledby="voucher-title">
          <h2 className="a-h3" id="voucher-title">Hotel voucher</h2>
          <p className="o-booking__text">Show this page or your booking reference at reception. The booking is under {sb.guests[0]}.</p>
          <div className="o-booking__docActions">
            <button className="a-button -soft -small" type="button" onClick={() => window.print()}><Glyph name="download" size="s" /><span className="a-button__label">Save as PDF</span></button>
          </div>
        </section>
      )}

      {mode === 'detail' && (
        <section className="o-booking__section" aria-labelledby="help-title">
          <h2 className="a-h3" id="help-title">Need help with this booking?</h2>
          <div className="o-booking__docActions">
            <Link className="a-button -outline -small" href={`${ROUTES.contact}?ref=${booking.ref}`}><Icon name="mail" size="s" /><span className="a-button__label">Contact support</span></Link>
            {!past && <CalendarButton booking={booking} title={fb ? routeTitle(fb.from, fb.to) : `${h!.name}, ${city}`} />}
          </div>
        </section>
      )}

      {mode === 'confirmation' && (
        <section className="o-booking__section" aria-labelledby="happens-title">
          <h2 className="a-h3" id="happens-title">What happens next</h2>
          <ol className="m-steps">
            <li className="m-steps__item"><span className="m-steps__icon" aria-hidden="true"><Icon name="mail" /></span><span className="m-steps__text"><strong>Now</strong> We’ve sent this to {booking.email}.</span></li>
            <li className="m-steps__item"><span className="m-steps__icon" aria-hidden="true"><Icon name="ticket" /></span><span className="m-steps__text"><strong>{fb ? 'In a few minutes' : 'Any time'}</strong> {fb ? 'Your e-tickets appear in your account under Bookings, with this reference.' : 'Your booking is in your account under Bookings, with this reference.'}</span></li>
            <li className="m-steps__item"><span className="m-steps__icon" aria-hidden="true">{fb ? <Glyph name="plane-up" /> : <Glyph name="key" />}</span><span className="m-steps__text"><strong>{fb ? `${dayShort(fb.depart)}, 24 hours before` : dayShort(sb!.search.checkin)}</strong> {fb ? `${next[0]} Online check-in opens 24 hours before departure.` : `${next[0]} Check-out is until ${h!.checkOut} on ${dayShort(sb!.search.checkout)}.`}</span></li>
          </ol>
        </section>
      )}

      {mode === 'confirmation' && (
        <section className="o-booking__section" aria-labelledby="next-title">
          <h2 className="a-h3" id="next-title">{fb ? 'Before you fly' : 'Before you go'}</h2>
          <ul className="o-booking__rows -ticks">
            {next.slice(1).map((r) => <li className="o-booking__row" key={r}><span className="a-disc" aria-hidden="true"><Icon name="tick" /></span>{r}</li>)}
          </ul>
        </section>
      )}

      {mode === 'detail' && (changes || justCanceled) && (
        <section className="o-booking__section" aria-labelledby="chg-title">
          <h2 className="a-h3" id="chg-title">Changes and cancellations</h2>
          {justCanceled ? <p className="o-booking__text o-booking__changed" id="chg-line" tabIndex={-1} role="status">We’ve emailed you the details. Your bank may take several business days to show the refund.</p> : changes}
        </section>
      )}

      {mode === 'confirmation' && (
        <div className="o-booking__foot">
          <div className="o-booking__actions">
            <Link className="a-button" href={`${ROUTES.bookings}/${booking.ref}`}><span className="a-button__label">View in Bookings</span><Icon name="arrow" className="a-button__icon" /></Link>
            <button className="a-button -soft" type="button" onClick={() => window.print()}><Icon name="print" size="s" /><span className="a-button__label">Print</span></button>
            <CalendarButton booking={booking} title={fb ? routeTitle(fb.from, fb.to) : `${h!.name}, ${city}`} />
          </div>
        </div>
      )}

      {mode === 'confirmation' && fb && <HotelCrossSell booking={fb} />}
      {mode === 'confirmation' && sb && (
        <section className="o-booking__section m-cross" aria-labelledby="cross-title">
          <h2 className="a-h3" id="cross-title">Need a flight to {city}?</h2>
          <p className="o-booking__text">Return flights from London for {dayRange(sb.search.checkin, sb.search.checkout)}, the dates of your stay.</p>
          <div className="o-booking__docActions">
            <Link className="a-button -outline" href={`/flights?from=LHR&to=${encodeURIComponent(cityAirport(h!.city))}&depart=${sb.search.checkin}&return=${sb.search.checkout}&adults=${sb.search.adults}&children=${sb.search.children}&infants=0&cabin=economy`}><Icon name="plane" size="s" /><span className="a-button__label">Search flights to {city}</span></Link>
          </div>
        </section>
      )}

      <Dialog open={dialog} onClose={() => setDialog(false)} id="cancel" size="confirm" hideClose
        title={fb ? `Cancel your flights to ${routeTitle(fb.from, fb.to).split(' to ')[1]}?` : `Cancel your stay at ${h!.name}?`}
        foot={<>
          <button className="a-button -danger" type="button" onClick={doCancel}><span className="a-button__label">Yes, cancel booking</span></button>
          <button className="a-button -soft" type="button" data-dialog-close onClick={() => setDialog(false)}><span className="a-button__label">Keep my booking</span></button>
        </>}>
        <p>{fb ? `The airline will refund ${money(fb.refund ?? 0)} to your ${fb.card.brand} ending ${fb.card.last4}. This can’t be undone.` : `You’ll get ${money(booking.amounts.total)} back to your ${booking.card.brand} ending ${booking.card.last4}. This can’t be undone.`}</p>
      </Dialog>
    </div>
  );
}

/* the main airport of a hotel city (catalogue section 1), for the stay's flight link and the flight's hotel row */
const cityAirport = (city: string) => catalogueCity(city)?.iata ?? 'LIS';
const AIRPORT_CITY: Record<string, string> = Object.fromEntries(CATALOGUE_CITIES.filter((c) => c.hasHotels).map((c) => [c.iata, c.slug]));

/* Add to calendar (spec B5, P2): an .ics file made in the browser, one all-day event per trip */
function CalendarButton({ booking, title }: { booking: Booking; title: string }) {
  function download() {
    const start = booking.kind === 'flight' ? booking.depart : booking.search.checkin;
    const endIso = booking.kind === 'flight' ? (booking.ret || booking.depart) : booking.search.checkout;
    const d = (iso: string) => iso.replace(/-/g, '');
    const after = new Date(`${endIso}T12:00:00Z`); after.setUTCDate(after.getUTCDate() + (booking.kind === 'flight' ? 1 : 0));
    const end = after.toISOString().slice(0, 10);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Overwing//Bookings//EN', 'BEGIN:VEVENT',
      `UID:${booking.ref}@overwing.example`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART;VALUE=DATE:${d(start)}`, `DTEND;VALUE=DATE:${d(end)}`, `SUMMARY:${title}`, `DESCRIPTION:Booking reference ${booking.ref}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = `overwing-${booking.ref}.ics`;
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Added to your downloads');
  }
  return <button className="a-button -soft" type="button" onClick={download}><Glyph name="calendar-plus" size="s" /><span className="a-button__label">Add to calendar</span></button>;
}

/* "Need a hotel in Lisbon?" (spec B5, P2): 4 stays in the destination for the trip's dates, showcase hotels first */
function HotelCrossSell({ booking }: { booking: FlightBooking }) {
  const citySlug = AIRPORT_CITY[booking.to];
  if (!citySlug || !booking.ret) return null;
  const list: Hotel[] = HOTELS.filter((x) => x.city === citySlug).sort((a, b) => Number(b.showcase) - Number(a.showcase) || b.score - a.score).slice(0, 4);
  if (!list.length) return null;
  const search: StaySearch = { place: citySlug, checkin: booking.depart, checkout: booking.ret, adults: Math.max(1, booking.pax.adults), children: booking.pax.children, rooms: 1 };
  const n = nightsOf(search);
  const name = cityById(citySlug)?.name ?? '';
  return (
    <section className="o-booking__section m-cross" aria-labelledby="cross-title">
      <div className="m-cross__head">
        <h2 className="a-h3" id="cross-title">Need a hotel in {name}?</h2>
        <Link className="a-link" href={`/hotels?${stayQuery(search)}`}>All stays in {name}</Link>
      </div>
      <p className="o-booking__text">{dayRange(search.checkin, search.checkout)}, {plural(n, 'night', 'nights')}, {plural(search.adults, 'adult', 'adults')}. Prices are totals for your dates, taxes and fees included.</p>
      <ul className="m-cross__list">
        {list.map((h) => {
          const room = [...h.rooms].sort((a, b) => a.nightly - b.nightly)[0];
          const t = stayTotals(room, search);
          return (
            <li key={h.id}>
              <Link className="m-crossCard" href={`/hotels/${h.id}?${stayQuery(search)}`}>
                <span className="m-crossCard__media"><Photo name={h.photos[0].name} alt="" graded={false} sizes="(min-width: 1025px) 168px, (min-width: 641px) 30vw, 72vw" className="m-crossCard__img" /></span>
                <span className="m-crossCard__kicker">{h.stars}-star {h.type.toLowerCase()}</span>
                <span className="m-crossCard__name">{h.name}</span>
                <span className="m-crossCard__meta">{h.area}, {h.distanceKm} km from the center</span>
                <Score score={h.score} word={h.scoreWord} count={h.reviewCount} size="s" className="m-crossCard__score" />
                <span className="m-crossCard__price"><strong>{dollars(t.total)}</strong> <span>{plural(n, 'night', 'nights')}, {plural(search.rooms, 'room', 'rooms')}, taxes and fees included</span></span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
