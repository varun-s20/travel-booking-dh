/* =====================================================================
   Landfall (working name, a placeholder), group H: My bookings and
   booking detail
   Spec 2b, Account: My bookings with Upcoming and Past text tabs, the
   next trip as a wide card with the destination's water photo, the rest
   as rows; booking detail with the reference panel, the itinerary drawn
   with the landfall line (flight legs, or the stay from check-in to
   check-out), travelers, the paid total under the landfall line with its
   breakdown, travel documents and "Manage this booking".
   Bookings come from the server: GET /api/bookings (the signed-in
   customer's) and GET /api/bookings/<ref>. Each booking carries what the
   page shows (the stay's hotel, the flight's names in its dict), so no
   catalogue is needed. Cancelling is done by our team in Phase 1: the
   page shows the refund terms and a "Contact us to cancel" link.
   Copy: landfall/content/copy.md, My bookings and Booking detail.
   ===================================================================== */
'use client';
import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useSession } from '@/lib/session';
import { RECENT_EVENT, isFlightKind, readRecent, type Recent } from '@/lib/recent';
import { CalendarButton, PrintButton } from '@/components/booking/tools';
import type { Booking, FlightBooking, StayBooking } from '@/lib/travel/bookings';
import { airlineName, cityOf, registerDict } from '@/lib/travel/flights';
import { cityById } from '@/lib/travel/hotels';
import { AIRPORTS } from '@/lib/data/places';
import { clock, dateLine, dayMonth, dayRange, isoNights, money, plural } from '@/lib/format';
import { STATUS_LABEL, STATUS_TONE, airportFull, bookingLine, bookingStart, bookingTitle, countdown, guestsLine, legHeading, legNote, paxLine } from '@/lib/text';
import { destinationPhoto, placePhoto } from '@/lib/data/destinations';
import FlightPath from '@/components/ui/FlightPath';
import { DEFAULT_ORIGIN } from '@/lib/site';
import { perTraveler } from '@/components/flights/trip';
import { SITE } from '@/lib/site';
import { toast } from '@/lib/client';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import Dialog from '@/components/ui/Dialog';
import Notice from '@/components/ui/Notice';
import { Button, ButtonLink } from '@/components/ui/Button';
import { useSavedTravelers } from './Profile';

const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const isUpcoming = (b: Booking, t: string) => b.status !== 'canceled' && b.status !== 'completed' && b.status !== 'failed' && bookingStart(b) >= t;
const cancelHref = (b: Booking) => `/contact?ref=${b.ref}&topic=cancel`;
/* the name the itinerary is sold under: the airline, or the hotel */
const sellerOf = (b: Booking) => (b.kind === 'flight' ? airlineName(b.airline) : b.stay.name);
/* every name a list of bookings mentions, registered before anything renders them */
const register = (list: Booking[]) => { for (const b of list) if (b.kind === 'flight') registerDict(b.dict); };

/* the trip's own photo: the destination's water photo for flights, the hotel's own photo for stays */
function TripPhoto({ b, sizes, className }: { b: Booking; sizes: string; className?: string }) {
  if (b.kind === 'stay' && b.stay.photo) return <Photo name={b.stay.photo} alt="" grade={false} sizes={sizes} className={className} />;
  const d = b.kind === 'flight' ? destinationPhoto(b.to) ?? destinationPhoto(cityOf(b.to)) : destinationPhoto(b.stay.cityName);
  return <Photo name={d?.image ?? 'pages/quay-colunas'} alt="" sizes={sizes} className={className} />;
}
const Chip = ({ b }: { b: Booking }) => <span className={`a-status -${STATUS_TONE[b.status]}`}>{STATUS_LABEL[b.status]}</span>;
/* bookings made with a supplier's test account: no real ticket or room behind them */
const TestNote = ({ b }: { b: Booking }) => (b.testMode ? <p className="t-small t-muted">Test booking: made in test mode, so no real ticket or room was booked.</p> : null);

type Tab = 'upcoming' | 'past' | 'canceled';
const TAB_LABEL: Record<Tab, string> = { upcoming: 'Upcoming', past: 'Past', canceled: 'Canceled' };
const TABS: Tab[] = ['upcoming', 'past', 'canceled'];

type Load = { state: 'loading' } | { state: 'signed-out' } | { state: 'failed' } | { state: 'ok'; bookings: Booking[] };

export function MyBookings() {
  const session = useSession();
  const user = session.user;
  const { list: travelerList } = useSavedTravelers(!!user);
  const travelers = travelerList ?? [];
  const [tab, setTab] = useState<Tab>('upcoming');
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const t = todayIso();

  const fetchBookings = useCallback(async () => {
    setLoad({ state: 'loading' });
    const r = await api<{ bookings: Booking[] }>('/api/bookings');
    if (r.error) { setLoad(r.error.status === 401 ? { state: 'signed-out' } : { state: 'failed' }); return; }
    register(r.data.bookings);
    setLoad({ state: 'ok', bookings: r.data.bookings });
  }, []);
  useEffect(() => {
    if (session.status !== 'ready') return;
    if (!user) { setLoad({ state: 'signed-out' }); return; }
    void fetchBookings();
  }, [session.status, user, fetchBookings]);

  const all = load.state === 'ok' ? load.bookings : [];
  const upcoming = all.filter((b) => isUpcoming(b, t)).sort((a, b) => bookingStart(a).localeCompare(bookingStart(b)));
  const past = all.filter((b) => !isUpcoming(b, t) && b.status !== 'canceled').sort((a, b) => bookingStart(b).localeCompare(bookingStart(a)));
  const canceled = all.filter((b) => b.status === 'canceled').sort((a, b) => bookingStart(b).localeCompare(bookingStart(a)));
  const lists: Record<Tab, Booking[]> = { upcoming, past, canceled };

  if (load.state === 'loading') return <div className="l-container b-dash"><h1 className="t-display t-h1">My bookings</h1><p className="t-muted b-loading" role="status">Loading your bookings</p></div>;
  if (load.state === 'signed-out') return (
    <div className="l-container b-dash">
      <h1 className="t-display t-h1">My bookings</h1>
      <div className="m-card b-empty">
        <Photo name="destinations/lisbon-tagus-golden" alt="" sizes="(min-width: 1025px) 520px, 100vw" className="b-empty__photo" />
        <div className="b-empty__text">
          <h2 className="t-display t-h2">Sign in to see your bookings</h2>
          <p className="t-lead">Your upcoming and past bookings, references and e-ticket numbers are kept in your account.</p>
          <div className="b-actions"><ButtonLink href="/login?next=/bookings" arrow>Sign in</ButtonLink><ButtonLink variant="ghost" href="/register?next=/bookings">Create an account</ButtonLink></div>
        </div>
      </div>
      <div className="bk-dash__more"><RecentSearches /></div>
    </div>
  );
  if (load.state === 'failed') return (
    <div className="l-container b-dash">
      <h1 className="t-display t-h1">My bookings</h1>
      <Notice tone="error" focusOnMount title="We couldn’t load your bookings" actions={<Button onClick={() => void fetchBookings()}>Try again</Button>}>
        <p>Your bookings are safe. Try again in a moment, or find them in your confirmation emails.</p>
      </Notice>
    </div>
  );

  const list = lists[tab];
  const [next, ...rest] = tab === 'upcoming' ? list : [null, ...list];
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = TABS[(TABS.indexOf(tab) + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setTab(n); document.getElementById(`tab-${n}`)?.focus();
  };

  return (
    <div className="l-container b-dash">
      <h1 className="t-display t-h1">My bookings</h1>
      <div className="a-texttabs b-tabs" role="tablist" aria-label="My bookings" onKeyDown={onKey}>
        {TABS.map((k) => (
          <button key={k} id={`tab-${k}`} type="button" role="tab" className="a-texttab" aria-selected={tab === k} aria-controls="b-panel" tabIndex={tab === k ? 0 : -1} onClick={() => setTab(k)}>
            {TAB_LABEL[k]}<span className="b-tabs__n t-num">{lists[k].length}</span>
          </button>
        ))}
      </div>
      <div id="b-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="b-panel">
        {list.length === 0 ? (
          <div className="m-card b-empty">
            <Photo name={tab === 'upcoming' ? 'promo/ferry-deck-puget-sound' : 'pages/harbour-dawn-boats'} alt="" sizes="(min-width: 1025px) 520px, 100vw" className="b-empty__photo" />
            <div className="b-empty__text">
              {tab === 'upcoming' && <FlightPath mode="once" className="b-empty__route" />}
              <h2 className="t-display t-h2">{tab === 'upcoming' ? 'No trips yet' : tab === 'past' ? 'No past trips yet' : 'No canceled bookings'}</h2>
              <p className="t-lead">{tab === 'upcoming' ? 'Book a flight or a hotel and it will wait for you here.' : tab === 'past' ? 'Trips move here once they’re over.' : 'Bookings that are canceled stay here, with their refund details.'}</p>
              {tab === 'upcoming' && <div className="b-actions"><ButtonLink href="/#search" arrow>Start a search</ButtonLink></div>}
            </div>
          </div>
        ) : (
          <>
            {next && (
              <article className="m-card b-next">
                <TripPhoto b={next} sizes="(min-width: 1025px) 600px, (min-width: 641px) 100vw, 160vw" className="b-next__photo" />
                <div className="b-next__body">
                  <div className="b-next__top"><Chip b={next} />{countdown(next, t) && <span className="b-next__count t-num">{countdown(next, t)}</span>}</div>
                  <h2 className="t-display b-next__title">{bookingTitle(next)}</h2>
                  {next.kind === 'flight' && <span className="a-landfall -leg b-next__leg" aria-hidden="true"><span className="a-landfall__label">{airlineName(next.airline)}</span></span>}
                  <p className="b-next__line t-num">{bookingLine(next)}</p>
                  <p className="t-small t-muted t-num">Ref {next.ref}, paid {money(next.amounts.total)}</p>
                  {next.status === 'pending' && <p className="t-small">{pendingLine(next)}</p>}
                  <div className="b-actions"><ButtonLink href={`/bookings/${next.ref}`} arrow aria-label={`View booking ${next.ref}, ${bookingTitle(next)}`}>View booking</ButtonLink></div>
                </div>
              </article>
            )}
            {rest.length > 0 && (
              <ul className="b-rows bk-rows">
                {rest.map((b) => b && (
                  <li key={b.ref} className="m-card b-row bk-row">
                    <TripPhoto b={b} sizes="64px" className="b-row__photo bk-row__photo" />
                    <div className="b-row__text">
                      <h2 className="b-row__title">{bookingTitle(b)}</h2>
                      <p className="t-small t-muted t-num">{bookingLine(b)}</p>
                      <p className="t-small t-muted t-num">Ref {b.ref}</p>
                      {b.status === 'pending' && <p className="t-small">{pendingLine(b)}</p>}
                    </div>
                    <div className="b-row__end bk-row__end">
                      <Chip b={b} />
                      <span className="bk-row__total t-num">{money(b.amounts.total)}</span>
                      <ButtonLink variant="ghost" href={`/bookings/${b.ref}`} aria-label={`View booking ${b.ref}, ${bookingTitle(b)}`}>View booking</ButtonLink>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <div className="bk-dash__more">
        <RecentSearches />
        <section className="m-card -pad bk-saved" aria-labelledby="bk-saved-h">
          <div className="bk-saved__head">
            <h2 id="bk-saved-h" className="bk-h3">Saved travelers</h2>
            <Link prefetch={false} className="a-link" href="/account#travelers" aria-label="Manage saved travelers">Manage</Link>
          </div>
          {travelers.length === 0 ? (
            <p className="t-small t-muted">Save the people you travel with and their details fill in at checkout.</p>
          ) : (
            <ul className="bk-saved__list">
              {travelers.map((p) => (
                <li key={p.id}><span className="bk-saved__init" aria-hidden="true">{(p.given[0] || '') + (p.family[0] || '')}</span><span>{p.given} {p.family}<span className="t-small t-muted">, {p.type}</span></span></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

const pendingLine = (b: Booking) => `The ${b.kind === 'flight' ? 'airline' : 'hotel'} is confirming this booking. We’ll email you when it’s done.`;

function recentHref(r: Recent): string {
  const p = r.params;
  if (r.kind === 'hotel-view' && p.hotel) {
    const q = new URLSearchParams(Object.entries(p).filter(([k]) => k !== 'hotel'));
    return `/hotels/${p.hotel}${q.toString() ? `?${q}` : ''}`;
  }
  return `${isFlightKind(r.kind) ? '/flights' : '/hotels'}?${new URLSearchParams(Object.entries(p).filter(([k]) => k !== 'offer'))}`;
}
function recentLine(r: Recent): string {
  const p = r.params;
  const a = p.depart || p.checkin, b = p.return || p.checkout || null;
  const dates = a ? dayRange(a, b) : '';
  const who = isFlightKind(r.kind)
    ? plural(Number(p.adults || 1) + Number(p.children || 0) + Number(p.infants || 0), 'traveler', 'travelers')
    : p.adults ? plural(Number(p.adults) + Number(p.children || 0), 'guest', 'guests') : '';
  return [dates, who].filter(Boolean).join(', ');
}

/* every card leads with a photo: the destination's water photo (by airport, or by the stay's city),
   or a neutral harbour photo for a city that has none yet, so all cards keep one shape */
function recentPhoto(r: Recent): string {
  const p = r.params;
  return (isFlightKind(r.kind) ? placePhoto(p.to, null) : placePhoto(null, cityById(p.place || '')?.name)).name;
}
const recentCode = (r: Recent) => (isFlightKind(r.kind) ? r.params.to : destinationPhoto(cityById(r.params.place || '')?.name || '')?.code) || '';

function RecentSearches() {
  const [items, setItems] = useState<Recent[] | null>(null);
  useEffect(() => {
    const read = () => setItems(readRecent().filter((r) => r.kind === 'flight-search' || r.kind === 'hotel-search').slice(0, 3));
    read();
    window.addEventListener(RECENT_EVENT, read);
    return () => window.removeEventListener(RECENT_EVENT, read);
  }, []);
  if (!items) return null;
  if (items.length === 0) return <PopularSearches />;
  /* fewer than three: the row is topped up with popular routes, each saying so */
  const shown = new Set(items.map(recentCode));
  const fill = POPULAR.filter((c) => !shown.has(c)).slice(0, 3 - items.length);
  return (
    <section className="bk-recent" aria-labelledby="bk-recent-h">
      <h2 id="bk-recent-h" className="bk-h3">Recent searches</h2>
      <ul className="bk-recent__list">
        {items.map((r) => {
          const ph = recentPhoto(r);
          return (
            <li key={`${r.kind}-${r.at}`} className="m-card bk-recent__card">
              <Photo name={ph} alt="" sizes="(min-width: 1025px) 260px, (min-width: 641px) 33vw, 100vw" className="bk-recent__photo" />
              <span className="bk-recent__text">
                <span className="bk-recent__label">{r.label}</span>
                <span className="t-small t-muted t-num">{recentLine(r)}</span>
              </span>
              <Link prefetch={false} className="a-link bk-recent__go" href={recentHref(r)} aria-label={`Search again: ${r.label}`}>Search again</Link>
            </li>
          );
        })}
        {fill.map((code) => <PopularCard key={code} code={code} note />)}
      </ul>
    </section>
  );
}

/* With no recent searches the row stays full: three popular routes from the
   default origin, each with the city's water photo. No fare is shown: prices
   come from a live search, not from a list. */
const POPULAR = ['LIS', 'FCO', 'JFK'];
function PopularCard({ code, note }: { code: string; note?: boolean }) {
  const city = destinationPhoto(code)?.city ?? AIRPORTS.find((a) => a.code === code)?.city;
  if (!city) return null;
  const ph = placePhoto(code, city);
  return (
    <li className="m-card bk-recent__card">
      <Photo name={ph.name} alt="" sizes="(min-width: 1025px) 260px, (min-width: 641px) 33vw, 100vw" className="bk-recent__photo" />
      <span className="bk-recent__text">
        <span className="bk-recent__label">{DEFAULT_ORIGIN.city} to {city}</span>
        <span className="t-small t-muted t-num">{note ? `Popular from ${DEFAULT_ORIGIN.city}` : 'See the fares for your dates'}</span>
      </span>
      <Link prefetch={false} className="a-link bk-recent__go" href={`/flights?from=${DEFAULT_ORIGIN.code}&to=${code}`} aria-label={`Search flights from ${DEFAULT_ORIGIN.city} to ${city}`}>Search</Link>
    </li>
  );
}
function PopularSearches() {
  return (
    <section className="bk-recent" aria-labelledby="bk-recent-h">
      <h2 id="bk-recent-h" className="bk-h3">Popular searches from {DEFAULT_ORIGIN.city}</h2>
      <ul className="bk-recent__list">{POPULAR.map((code) => <PopularCard key={code} code={code} />)}</ul>
    </section>
  );
}

/* ===== booking detail ===== */
type One = { state: 'loading' } | { state: 'missing' } | { state: 'failed' } | { state: 'ok'; b: Booking };

export function BookingDetail({ bookingRef: reference }: { bookingRef: string }) {
  const [one, setOne] = useState<One>({ state: 'loading' });
  const [breakdown, setBreakdown] = useState(false);
  const fetchOne = useCallback(async () => {
    setOne({ state: 'loading' });
    const r = await api<{ booking: Booking }>(`/api/bookings/${encodeURIComponent(reference)}`);
    if (r.error) { setOne(r.error.status === 404 || r.error.status === 401 ? { state: 'missing' } : { state: 'failed' }); return; }
    register([r.data.booking]);
    setOne({ state: 'ok', b: r.data.booking });
  }, [reference]);
  useEffect(() => { void fetchOne(); }, [fetchOne]);

  if (one.state === 'loading') return <div className="l-container"><p className="t-muted b-loading" role="status">Loading your booking</p></div>;
  if (one.state === 'failed') return (
    <div className="l-narrow b-missing">
      <Notice tone="error" focusOnMount title="We couldn’t load this booking" actions={<Button onClick={() => void fetchOne()}>Try again</Button>}>
        <p>Your booking is safe. Try again in a moment, or find it in your confirmation email.</p>
      </Notice>
    </div>
  );
  if (one.state === 'missing') return (
    <div className="l-narrow b-missing">
      <h1 className="t-display t-h1">We couldn’t find that page</h1>
      <p className="t-lead">The link may be broken, or the page may have moved. Start a new search or go back to the home page.</p>
      <div className="b-actions"><ButtonLink href="/bookings" arrow>Go to My bookings</ButtonLink></div>
    </div>
  );
  const b = one.b;
  const canceled = b.status === 'canceled';
  const copy = async () => { try { await navigator.clipboard.writeText(b.ref); } catch { /* the toast still confirms the action */ } toast('Copied'); };

  return (
    <div className="l-container b-detail">
      <Link prefetch={false} className="a-textbtn h-detail__back" href="/bookings"><Icon name="arrow-l" />My bookings</Link>
      <header className="b-detail__head">
        <Chip b={b} />
        <h1 className="t-display t-h1">{b.kind === 'flight' ? bookingTitle(b) : b.stay.name}</h1>
        <TestNote b={b} />
      </header>
      {canceled && <CanceledBanner b={b} />}
      {b.status === 'pending' && <Notice tone="info" title="Almost there">{pendingLine(b)}</Notice>}
      {b.status === 'changed' && b.kind === 'flight' && (
        <Notice tone="warn" title={`${airlineName(b.airline)} has changed your flight times`} actions={<ButtonLink href={`/contact?ref=${b.ref}&topic=change`} variant="ghost">Contact us</ButtonLink>}>
          The airline changed the schedule of this booking. Check the times below. If they don’t work for you, contact us with your booking reference.
        </Notice>
      )}

      <div className="bk-actions bk-noprint" role="group" aria-label="Booking actions">
        {!canceled && <CalendarButton b={b} />}
        <PrintButton label="Print" />
        <PrintButton label="Download receipt" receipt />
        {canCancel(b) && <ButtonLink variant="ghost" icon="mail" href={cancelHref(b)}>Contact us to cancel</ButtonLink>}
      </div>

      <div className="b-detail__grid">
        <div className="b-detail__main">
          <Receipt b={b} />
          <div className="b-ref">
            <p className="t-small t-muted">Booking reference</p>
            <p className="t-ref b-ref__code">{b.ref}</p>
            <Button variant="ghost" icon="copy" onClick={copy} aria-label={`Copy booking reference ${b.ref}`}>Copy</Button>
            {b.supplierReference && <p className="t-small t-muted t-num">{b.kind === 'flight' ? 'Airline reference' : 'Hotel confirmation'} {b.supplierReference}</p>}
          </div>
          {b.kind === 'flight' ? <FlightItinerary b={b} /> : <StayItinerary b={b} />}

          {b.kind === 'flight' && (
            <section className="b-sec" aria-labelledby="trv-h">
              <h2 id="trv-h" className="t-display t-h2">Travelers</h2>
              <ul className="b-list">{b.travelers.map((p, i) => <li key={`${p.name}-${i}`}>{p.name}, {p.type}{p.lead || i === 0 ? ', lead traveler' : ''}</li>)}</ul>
            </section>
          )}

          {b.kind === 'flight' && <Documents b={b} />}

          <Conditions b={b} />

          <section className="b-sec" aria-labelledby="man-h">
            <h2 id="man-h" className="t-display t-h2">Manage this booking</h2>
            <Manage b={b} />
          </section>
        </div>

        <aside className="b-detail__aside">
          <section className="m-summary b-paid" aria-labelledby="pay-h">
            <h2 id="pay-h" className="m-summary__title">Payment</h2>
            <div className="m-total">
              <p className="b-paid__total t-num">Paid {money(b.amounts.total)}{b.card ? ` with ${b.card.brand} ending ${b.card.last4}` : ''} on {dateLine(b.bookedAt)}</p>
              {/* final pass: the price rule's unit line, as on the confirmation */}
              <p className="t-small t-num">{b.kind === 'stay' ? `${money(Math.round(b.amounts.total / Math.max(1, isoNights(b.search.checkin, b.search.checkout))))} per night` : `${money(perTraveler(b.amounts.total, b.pax))} per traveler`}</p>
              <p className="t-small t-muted">taxes and fees included</p>
              {b.kind === 'stay' && b.payAtHotel && <p className="t-small t-muted t-num">Plus {b.payAtHotel.currency} {(b.payAtHotel.amount / 100).toFixed(2)} paid at the hotel</p>}
              <button type="button" className="a-textbtn b-paid__bd" onClick={() => setBreakdown(true)}>See price breakdown</button>
            </div>
            {canceled && refundOf(b) !== null && (
              <p className="b-paid__refund t-small t-num"><Icon name="refund" />Refund of {money(refundOf(b)!)}{b.card ? ` to ${b.card.brand} ending ${b.card.last4}` : ''}, canceled {dateLine(b.canceledAt || todayIso())}</p>
            )}
          </section>
        </aside>
      </div>

      <Dialog open={breakdown} onClose={() => setBreakdown(false)} title="Price breakdown" sheet>
        <dl className="h-breakdown">
          {b.kind === 'flight'
            ? <div><dt>Flights, {paxLine(b.pax)}</dt><dd className="t-num">{money(b.amounts.base)}</dd></div>
            : <div><dt>Room, {plural(isoNights(b.search.checkin, b.search.checkout), 'night', 'nights')}</dt><dd className="t-num">{money(b.amounts.room)}</dd></div>}
          <div><dt>Taxes and fees</dt><dd className="t-num">{money(b.amounts.tax)}</dd></div>
          <div className="-total"><dt>Total</dt><dd className="t-num">{money(b.amounts.total)}</dd></div>
        </dl>
      </Dialog>
    </div>
  );
}

/* a trip still ahead can be canceled by asking us (Phase 1 has no self-serve cancellation) */
function canCancel(b: Booking): boolean {
  return b.status === 'confirmed' || b.status === 'changed' || b.status === 'pending';
}

/* e-tickets per traveler: the ticket stored on the traveler, else the matching document */
function Documents({ b }: { b: FlightBooking }) {
  const tickets = b.documents.filter((d) => d.type === 'electronic_ticket');
  const rows = b.travelers.map((p) => ({ name: p.name, ticket: p.ticket ?? tickets.find((d) => d.passenger?.toLowerCase().includes(p.name.toLowerCase()))?.id }));
  const matched = rows.filter((r) => r.ticket);
  /* documents whose passenger name didn't match a traveler are still listed */
  const loose = tickets.filter((d) => !matched.some((r) => r.ticket === d.id));
  return (
    <section className="b-sec" aria-labelledby="doc-h">
      <h2 id="doc-h" className="t-display t-h2">Travel documents</h2>
      {b.ticketsPending || (!matched.length && !loose.length) ? (
        <p>The airline is issuing your e-tickets. They’ll appear here and in your email once they’re ready.</p>
      ) : (
        <>
          <p>Your e-ticket numbers. The airline may ask for them at check-in.</p>
          <ul className="b-list">
            {matched.map((r) => <li key={r.ticket}><Icon name="ticket" />{r.name}, e-ticket <span className="t-num">{r.ticket}</span></li>)}
            {loose.map((d) => <li key={d.id}><Icon name="ticket" />{d.passenger ?? 'Traveler'}, e-ticket <span className="t-num">{d.id}</span></li>)}
          </ul>
        </>
      )}
    </section>
  );
}

/* the fare or rate conditions, as booked */
function Conditions({ b }: { b: Booking }) {
  if (b.kind === 'flight') {
    const rows: [string, string][] = ([['Changes', b.conditions?.change ?? ''], ['Refunds', b.conditions?.refund ?? '']] as [string, string][]).filter(([, v]) => v);
    return (
      <section className="b-sec" aria-labelledby="cond-h">
        <h2 id="cond-h" className="t-display t-h2">Fare conditions</h2>
        <p className="t-muted">{airlineName(b.airline)}{b.fareName ? `, ${b.fareName}` : ''}. The airline’s fare rules apply.</p>
        {rows.length > 0 && <dl className="bk-cond">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
      </section>
    );
  }
  const s = b.stay;
  return (
    <section className="b-sec" aria-labelledby="cond-h">
      <h2 id="cond-h" className="t-display t-h2">Rate conditions</h2>
      {b.planName && <p className="t-muted">{b.planName}</p>}
      <dl className="bk-cond">
        <div><dt>Cancellation</dt><dd className="t-num">{b.freeCancelUntil ? `Free cancellation until ${dateLine(b.freeCancelUntil)}, hotel time. After that, no refund.` : 'Non-refundable from the moment you book.'}</dd></div>
        <div><dt>Changes</dt><dd>Date changes depend on the hotel. Contact us with your booking reference.</dd></div>
        {b.board && <div><dt>Meals</dt><dd>{b.board}</dd></div>}
        {(s.checkIn || s.checkOut) && <div><dt>Check-in and check-out</dt><dd className="t-num">{[s.checkIn && `Check-in from ${s.checkIn}`, s.checkOut && `check-out until ${s.checkOut}`].filter(Boolean).join(', ')}</dd></div>}
        <div><dt>Payment</dt><dd>Paid in full when you booked{b.payAtHotel ? `, except ${b.payAtHotel.currency} ${(b.payAtHotel.amount / 100).toFixed(2)} in local taxes or fees paid at the hotel` : ''}</dd></div>
        {s.keyCollection && <div><dt>Key collection</dt><dd>{s.keyCollection}</dd></div>}
        {(b.conditions ?? []).map((c, i) => <div key={`${c.title}-${i}`}><dt>{c.title || 'Condition'}</dt><dd>{c.body}</dd></div>)}
      </dl>
    </section>
  );
}

/* shown only when printing "Download receipt" (booking.css, print) */
function Receipt({ b }: { b: Booking }) {
  const item = b.kind === 'flight'
    ? `${bookingTitle(b)}, ${airlineName(b.airline)}${b.fareName ? `, ${b.fareName}` : ''}, ${paxLine(b.pax)}`
    : `${b.stay.name}, ${b.roomName || 'Room'}, ${plural(isoNights(b.search.checkin, b.search.checkout), 'night', 'nights')}`;
  return (
    <section className="bk-receipt" aria-hidden="true">
      <h2 className="t-display t-h2">Receipt</h2>
      <dl className="bk-cond">
        <div><dt>Booking reference</dt><dd className="t-num">{b.ref}</dd></div>
        <div><dt>Booked on</dt><dd className="t-num">{dateLine(b.bookedAt)}</dd></div>
        <div><dt>Booking</dt><dd className="t-num">{item}</dd></div>
        <div><dt>Trip</dt><dd className="t-num">{bookingLine(b)}</dd></div>
        <div><dt>{b.kind === 'flight' ? 'Fare' : 'Room'}</dt><dd className="t-num">{money(b.kind === 'flight' ? b.amounts.base : b.amounts.room)}</dd></div>
        <div><dt>Taxes and fees</dt><dd className="t-num">{money(b.amounts.tax)}</dd></div>
        <div><dt>Total paid</dt><dd className="t-num"><b>{money(b.amounts.total)}</b></dd></div>
        {b.card && <div><dt>Paid with</dt><dd className="t-num">{b.card.brand} ending {b.card.last4}</dd></div>}
      </dl>
    </section>
  );
}

/* a refund we know of: a stay canceled within its free-cancellation window. A flight's refund
   depends on the airline's answer at cancellation, so the banner speaks of it in general terms. */
const refundOf = (b: Booking): number | null =>
  b.kind === 'stay' && b.freeCancelUntil && b.canceledAt && b.canceledAt <= b.freeCancelUntil ? b.amounts.total : null;

function CanceledBanner({ b }: { b: Booking }) {
  const r = refundOf(b);
  const card = b.card ? `your ${b.card.brand} ending ${b.card.last4}` : 'the card you paid with';
  return (
    <Notice tone="info" title="Your booking is canceled" className="b-banner">
      {r !== null
        ? `${sellerOf(b)} is refunding ${money(r)} to ${card}. Your bank may take several business days to show it. We’ve emailed you the details.`
        : `Any refund due goes back to ${card}; banks usually show it within 5 to 10 business days. We’ve emailed you the details.`}
    </Notice>
  );
}

function Manage({ b }: { b: Booking }) {
  const contact = <ButtonLink variant="ghost" href={cancelHref(b)}>Contact us to cancel</ButtonLink>;
  if (b.status === 'canceled') return <p>This booking is canceled. If you have a question about it, <Link prefetch={false} className="a-link" href={`/contact?ref=${b.ref}`}>contact us</Link> with your booking reference.</p>;
  if (b.status === 'completed' || b.status === 'failed') return <p>For a question about this booking, call {SITE.phone} or email {SITE.email} with your booking reference.</p>;
  if (b.kind === 'flight') {
    const refund = b.conditions?.refund;
    return (
      <div className="b-manage">
        <p>To change or cancel this booking, contact us with your booking reference. What’s possible depends on the airline’s fare rules{refund ? `: refunds, ${refund.charAt(0).toLowerCase()}${refund.slice(1)}` : ''}.</p>
        <div>{contact}</div>
      </div>
    );
  }
  const t = todayIso();
  if (b.freeCancelUntil && t <= b.freeCancelUntil) return (
    <div className="b-manage"><p>Free cancellation until {dayRange(b.freeCancelUntil, null)}, hotel time. Contact us before then to cancel and you’ll get the full {money(b.amounts.total)} back.</p><div>{contact}</div></div>
  );
  return <p>This booking can no longer be refunded. If your plans have changed, <Link prefetch={false} className="a-link" href={cancelHref(b)}>contact us</Link> and we’ll ask the hotel what’s possible.</p>;
}

function FlightItinerary({ b }: { b: FlightBooking }) {
  return (
    <section className="b-sec" aria-labelledby="fl-h">
      <h2 id="fl-h" className="t-display t-h2">Your flights</h2>
      <p className="t-muted">{airlineName(b.airline)}{b.fareName ? `, ${b.fareName}` : ''}, {paxLine(b.pax)}</p>
      {b.slices.map((s, i) => (
        <div key={i} className="b-leg">
          <h3 className="b-leg__head"><span>{legHeading(i, s)}</span><span className="t-small t-muted">{legNote(s)}</span></h3>
          <div className="b-leg__row">
            <p className="b-leg__end"><b className="t-num">{clock(s.dep)}</b><span>{airportFull(s.from)}</span></p>
            <span className="a-landfall -leg b-leg__line" aria-hidden="true"><span className="a-landfall__label">{s.segments.map((g) => g.flight).join(', ')}</span></span>
            <p className="b-leg__end -arr"><b className="t-num">{clock(s.arr)}</b><span>{airportFull(s.to)}</span></p>
          </div>
        </div>
      ))}
    </section>
  );
}

function StayItinerary({ b }: { b: StayBooking }) {
  const s = b.stay;
  const nights = plural(isoNights(b.search.checkin, b.search.checkout), 'night', 'nights');
  return (
    <section className="b-sec" aria-labelledby="st-h">
      <h2 id="st-h" className="t-display t-h2">Your stay</h2>
      <p className="t-muted">{[s.name, s.area, s.cityName].filter(Boolean).join(', ')}</p>
      {s.address && <p className="t-muted">{s.address}</p>}
      {b.roomName && <p className="t-muted">{b.roomName}{b.board ? `, ${b.board.toLowerCase()}` : ''}</p>}
      <div className="b-leg">
        <div className="b-leg__row">
          <p className="b-leg__end"><b className="t-num">{dayMonth(b.search.checkin)}</b><span>{s.checkIn ? `Check-in, from ${s.checkIn}` : 'Check-in'}</span></p>
          <span className="a-landfall -leg b-leg__line" aria-hidden="true"><span className="a-landfall__label">{nights}</span></span>
          <p className="b-leg__end -arr"><b className="t-num">{dayMonth(b.search.checkout)}</b><span>{s.checkOut ? `Check-out, until ${s.checkOut}` : 'Check-out'}</span></p>
        </div>
      </div>
      <p className="t-small t-muted">{guestsLine(b.search)}</p>
      {(s.phone || s.email) && <p className="t-small t-muted">Hotel contact: {[s.phone, s.email].filter(Boolean).join(', ')}</p>}
    </section>
  );
}
