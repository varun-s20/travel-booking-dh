'use client';
/* =====================================================================
   Your bookings (spec 2b, dashboard): The Hoxton's pills as the tab row
   (Upcoming, Past, Canceled), then booking cards: a 120px square photo
   (the destination's for flights, the hotel's first for stays), the
   route or hotel, dates, reference, status chip and one View pill.
   Empty tabs show the window with its blind down. Logged out, the
   log in panel. Copy: content/copy.md, Dashboard.
   ===================================================================== */
import { useRef, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { StatusChip } from '@/components/ui/Notice';
import { LoggedOut } from '@/components/account/LoggedOut';
import { DESTINATIONS } from '@/lib/data/destinations';
import { cityById, hotelById, nightsOf } from '@/lib/mock/hotels';
import type { Booking } from '@/lib/mock/bookings';
import { bookingsFor, currentUser, useStore } from '@/lib/store';
import { dayRange, money, plural } from '@/lib/format';
import { Glyph } from '@/components/booking/Glyphs';
import { Score } from '@/components/ui/Score';
import { useHistory } from '@/lib/history';
import { paxLine, routeTitle } from '@/lib/text';
import { ROUTES } from '@/lib/site';

type Tab = 'upcoming' | 'past' | 'canceled';
const TABS: { id: Tab; label: string }[] = [{ id: 'upcoming', label: 'Upcoming' }, { id: 'past', label: 'Past' }, { id: 'canceled', label: 'Canceled' }];

/* whole days from today to the trip's first day, in the visitor's own calendar */
function daysUntil(iso: string): number {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - today) / 86400000);
}
const countdown = (n: number) => (n <= 0 ? 'Today' : n === 1 ? 'Tomorrow' : `In ${n} days`);
const whoLine = (b: Booking) => (b.kind === 'flight' ? paxLine(b.pax) : `${plural(b.search.adults + b.search.children, 'guest', 'guests')}, ${plural(b.search.rooms, 'room', 'rooms')}`);

const endOf = (b: Booking) => (b.kind === 'flight' ? b.ret || b.depart : b.search.checkout);
function tabOf(b: Booking, today: string): Tab {
  if (b.status === 'canceled') return 'canceled';
  return b.status === 'completed' || endOf(b) < today ? 'past' : 'upcoming';
}

function Card({ b, past }: { b: Booking; past: boolean }) {
  const flight = b.kind === 'flight';
  const h = !flight ? hotelById(b.hotel) : null;
  const photo = flight ? DESTINATIONS.find((d) => d.code === b.to)?.image || 'about-wing-cloud' : h!.photos[0].name;
  const title = flight ? routeTitle(b.from, b.to) : `${h!.name}, ${cityById(h!.city)?.name}`;
  const dates = flight ? `${dayRange(b.depart, b.ret, past)}${past ? '' : `, ${paxLine(b.pax)}`}` : `${dayRange(b.search.checkin, b.search.checkout, past)}${past ? '' : `, ${plural(nightsOf(b.search), 'night', 'nights')}`}`;
  return (
    <li>
      <Link className="m-trip" href={`${ROUTES.bookings}/${b.ref}`} aria-label={`${title}, ${dates}, reference ${b.ref}. View`}>
        <span className="m-trip__media"><Photo name={photo} alt="" sizes="(min-width: 641px) 160px, 96px" graded={flight} className="m-trip__img" /></span>
        <span className="m-trip__text">
          <span className="m-trip__kind"><Icon name={flight ? 'plane' : 'bed'} size="s" />{flight ? 'Flight' : 'Stay'}</span>
          <span className="m-trip__title">{title}</span>
          <span className="m-trip__dates">{dates}</span>
          {past && <span className="m-trip__dates">{whoLine(b)}</span>}
          <span className="m-trip__ref">Ref {b.ref}</span>
          {b.status === 'pending' && <span className="m-trip__note">The airline is confirming this booking. We’ll email you when it’s done.</span>}
        </span>
        <span className="m-trip__side">
          <StatusChip status={b.status} />
          <span className="m-trip__total"><strong>{money(b.amounts.total)}</strong> <span>{b.status === 'canceled' ? 'total, canceled' : 'total'}</span></span>
          <span className="a-button -outline -small -steady" aria-hidden="true"><span className="a-button__label">View</span></span>
        </span>
      </Link>
    </li>
  );
}

export function Dashboard() {
  const store = useStore();
  const history = useHistory();
  const [tab, setTab] = useState<Tab>('upcoming');
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  if (!store) return <p className="o-account__loading" role="status">Loading your bookings</p>;
  if (!currentUser(store)) return <LoggedOut />;
  const today = new Date().toISOString().slice(0, 10);
  const all = bookingsFor(store);
  const user = currentUser(store)!;
  const counts = Object.fromEntries(TABS.map((t) => [t.id, all.filter((b) => tabOf(b, today) === t.id).length])) as Record<Tab, number>;
  const nextTrip = all.filter((b) => tabOf(b, today) === 'upcoming').sort((a, b) => (startOf(a) < startOf(b) ? -1 : 1))[0];
  const list = all.filter((b) => tabOf(b, today) === tab).sort((a, b) => (tab === 'upcoming' ? (startOf(a) < startOf(b) ? -1 : 1) : startOf(a) < startOf(b) ? 1 : -1));
  const empty = {
    upcoming: { t: 'No trips coming up', l: 'Book a flight or a hotel and it will wait for you here.' },
    past: { t: 'No past trips yet', l: 'Trips move here once they’re over.' },
    canceled: { t: 'No canceled bookings', l: 'If you cancel a booking, you’ll see it here.' }
  }[tab];

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length].id;
    setTab(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="o-account -wide">
      <p className="o-account__hello">Hi, {user.firstName}</p>
      <h1 className="a-h1 o-account__title">Your bookings</h1>
      {nextTrip && <NextTrip b={nextTrip} />}
      <div className="o-account__tabs" role="tablist" aria-label="Your bookings">
        {TABS.map((t, i) => (
          <button key={t.id} ref={(el) => { tabs.current[t.id] = el; }} className="a-choice" type="button" role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls="trips-panel"
            tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}>{t.label}<span className="o-account__count">{counts[t.id]}</span></button>
        ))}
      </div>
      <div id="trips-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {list.length ? (
          <ul className="o-account__trips">{list.map((b) => <Card b={b} key={b.ref} past={tab !== 'upcoming'} />)}</ul>
        ) : (
          <div className="m-empty">
            <span className="m-empty__window" aria-hidden="true" />
            <h2 className="m-empty__title a-h3">{empty.t}</h2>
            <p className="m-empty__line">{empty.l}</p>
            {tab === 'upcoming' && <div className="m-empty__actions"><Link className="a-button" href="/#search"><span className="a-button__label">Start a search</span><Icon name="arrow" className="a-button__icon" /></Link></div>}
          </div>
        )}
      </div>
      <RecentlyViewed ids={(history?.views ?? []).filter((v) => v.kind === 'hotel').map((v) => v.id)} />
    </div>
  );
}

const startOf = (b: Booking) => (b.kind === 'flight' ? b.depart : b.search.checkin);

/* the next trip, first (spec B9): photo, countdown, route or hotel, dates, reference and one action */
function NextTrip({ b }: { b: Booking }) {
  const flight = b.kind === 'flight';
  const h = !flight ? hotelById(b.hotel) : null;
  const photo = flight ? DESTINATIONS.find((d) => d.code === b.to)?.image || 'about-wing-cloud' : h!.photos[0].name;
  const title = flight ? routeTitle(b.from, b.to) : `${h!.name}, ${cityById(h!.city)?.name}`;
  const start = startOf(b);
  const n = daysUntil(start);
  const dates = flight ? dayRange(b.depart, b.ret) : `${dayRange(b.search.checkin, b.search.checkout)}, ${plural(nightsOf(b.search), 'night', 'nights')}`;
  return (
    <section className="m-nextTrip is-dark" aria-labelledby="next-trip-title">
      <span className="m-nextTrip__media"><Photo name={photo} alt="" sizes="160px" graded={flight} className="m-nextTrip__img" /></span>
      <div className="m-nextTrip__text">
        <p className="m-nextTrip__kicker"><Glyph name={flight ? 'plane-up' : 'key'} size="s" />Next trip, <strong>{countdown(n)}</strong></p>
        <h2 className="m-nextTrip__title" id="next-trip-title">{title}</h2>
        <p className="m-nextTrip__line">{dates}, {whoLine(b)}</p>
        <p className="m-nextTrip__ref">Ref {b.ref}</p>
      </div>
      <Link className="a-button -light m-nextTrip__action" href={`${ROUTES.bookings}/${b.ref}`} aria-label={`View booking ${b.ref}, ${title}`}><span className="a-button__label">View booking</span><Icon name="arrow" className="a-button__icon" /></Link>
    </section>
  );
}

/* Recently viewed (spec B9, P2): the stays this browser looked at, newest first (lib/history.ts) */
function RecentlyViewed({ ids }: { ids: string[] }) {
  const list = [...new Set(ids)].map((id) => hotelById(id)).filter((h): h is NonNullable<typeof h> => !!h).slice(0, 4);
  if (!list.length) return null;
  return (
    <section className="o-account__viewed m-cross" aria-labelledby="viewed-title">
      <div className="m-cross__head"><h2 className="a-h3" id="viewed-title">Recently viewed</h2></div>
      <ul className="m-cross__list">
        {list.map((h) => (
          <li key={h.id}>
            <Link className="m-crossCard" href={`/hotels/${h.id}`}>
              <span className="m-crossCard__media"><Photo name={h.photos[0].name} alt="" graded={false} sizes="(min-width: 1025px) 220px, (min-width: 641px) 40vw, 72vw" className="m-crossCard__img" /></span>
              <span className="m-crossCard__kicker">{h.stars}-star {h.type.toLowerCase()}</span>
              <span className="m-crossCard__name">{h.name}</span>
              <span className="m-crossCard__meta">{h.area}, {cityById(h.city)?.name}</span>
              <Score score={h.score} word={h.scoreWord} count={h.reviewCount} size="s" className="m-crossCard__score" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
