/* =====================================================================
   Landfall (working name, a placeholder), group H: hotel detail
   Round 3 (round3-spec.md B7), at the depth of the category leaders, in
   Landfall's own system:
   - the arrival view (kept): the water-side photo at 21:9 with a strip
     of four; the gallery dialog grouped by Outside, Rooms and Shared
     spaces chips with counts;
   - a sticky section nav under the compact bar (scroll-spy, the landfall
     line under the current tab; at 390 it scrolls sideways);
   - Overview (score, stars, type, description, highlights), Amenities
     (top 10, then every amenity in groups);
   - Availability: a search strip, then the rate table at 1025 and up
     (room cell spanning its rate plans, one Reserve for the choice); at
     390 one card per room with its plans as radio rows and the price bar
     showing the choice;
   - Reviews, Location with "What's nearby", House rules as a definition
     table, Similar stays as a rail;
   - "Your stay" stays pinned at right; the view is written to lf.recent.
   Backend (2026-11-15): the hotel comes from Duffel Stays or the
   simulated catalogue (app/hotels/[hotel]/page.tsx). With dates, every
   rate plan arrives priced for the whole search (all rooms, all nights,
   taxes in): totals, the free cancellation deadline, the board, the
   rate's own terms and anything due at the hotel are read from the plan,
   never computed. The number of rooms is the search's (a rate is priced
   for it), so a rate is chosen, not a quantity. Similar stays come from
   the page (the catalogue's other hotels; Duffel gives none). Sections
   show only when the hotel has their data; a supplier hotel may lack
   photos, a star rating, reviews or check-in times.
   ===================================================================== */
'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { freeCancelUntil, hotelAirports, hotelFaqs, leadsFor, nightsOf, planOf, plansFor, roomAvailable, stayQuery, type Hotel, type PhotoCat, type RatePlan, type Room, type StaySearch } from '@/lib/travel/hotels';
import { fromMinor } from '@/lib/travel/money';
import { addRecent } from '@/lib/recent';
import { dayMonth, dayRange, plural } from '@/lib/format';
import { guestsLine } from '@/lib/text';
import { MQ_DESKTOP, requestSearch, useMedia } from '@/lib/client';
import Icon from '@/components/ui/Icon';
import Photo from '@/components/ui/Photo';
import Dialog from '@/components/ui/Dialog';
import PriceBar from '@/components/ui/PriceBar';
import ScoreBadge from '@/components/ui/ScoreBadge';
import LandfallLine from '@/components/ui/LandfallLine';
import { Rail, RailCard } from '@/components/ui/Rail';
import { Button, ButtonLink } from '@/components/ui/Button';
import type { IconName } from '@/components/chrome/Sprite';
import Faqs from './Faqs';
import { PhotoSwap, Section, StayMap, amenityGroups, amenityIcon, cityName, dollars0, gettingAround, leadIndex, nightsWord, roomPhotos } from './parts';

const CAT_LABEL: Record<PhotoCat, string> = { Outside: 'Outside', Rooms: 'Rooms', Inside: 'Shared spaces' };
const CATS: PhotoCat[] = ['Outside', 'Rooms', 'Inside'];
const TRIP_ORDER = ['Couple', 'Family', 'Solo', 'Friends', 'Business'];
type Pick = { room: string; plan: string };

/* a glyph for a highlight line, from its words (the sprite's own glyphs) */
function highlightIcon(s: string): IconName {
  if (/breakfast|coffee|bakery/i.test(s)) return 'coffee';
  if (/pool/i.test(s)) return 'pool';
  if (/spa|sauna|bath|onsen/i.test(s)) return 'spa';
  if (/terrace|bar|roof|wine/i.test(s)) return 'glass';
  if (/tram|metro|walk|min|station|ferry|bus/i.test(s)) return 'pin';
  if (/desk|24|hour|late/i.test(s)) return 'clock';
  if (/wifi|work/i.test(s)) return 'wifi';
  if (/pet|dog/i.test(s)) return 'paw';
  if (/view|river|sea|canal|harbou?r|beach|water|lake/i.test(s)) return 'eye';
  return amenityIcon(s) === 'check' ? 'star' : amenityIcon(s);
}

const planMeal = (p: RatePlan) => p.board ?? (p.breakfast ? 'Breakfast included' : 'Room only');
/* a local tax or fee the hotel collects itself, in its own currency */
const atHotelLine = (p: RatePlan) => (p.payAtHotel ? `Plus ${fromMinor(p.payAtHotel.amount, p.payAtHotel.currency)} ${p.payAtHotel.currency} paid at the hotel` : null);
/* the plans a room can still be booked on */
const openPlans = (r: Room) => plansFor(r).filter((p) => p.available !== false);

/* check-in to check-out, drawn as a leg: the stay's itinerary */
function StayLeg({ h, nights, dated, className }: { h: Hotel; nights: string; dated: boolean; className?: string }) {
  const inT = h.checkIn ? `From ${h.checkIn}` : 'Ask the hotel', outT = h.checkOut ? `Until ${h.checkOut}` : 'Ask the hotel';
  return (
    <div className={['h-stay', className || ''].join(' ')} role="group" aria-label={`Check-in ${inT.toLowerCase()}, check-out ${outT.toLowerCase()}${dated ? `, ${nights}` : ''}`}>
      <p className="h-stay__end"><span className="t-small t-muted">Check-in</span><b className="t-num">{inT}</b></p>
      <span className="a-landfall -leg h-stay__leg" aria-hidden="true">{dated && <span className="a-landfall__label">{nights}</span>}</span>
      <p className="h-stay__end -out"><span className="t-small t-muted">Check-out</span><b className="t-num">{outT}</b></p>
    </div>
  );
}

/* the sticky section nav: text tabs, the landfall line under the current one */
function SectionNav({ tabs }: { tabs: { id: string; label: string }[] }) {
  const [cur, setCur] = useState(tabs[0]?.id);
  const ids = tabs.map((t) => t.id).join(',');
  useEffect(() => {
    const list = ids.split(',');
    let raf = 0;
    const spy = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        /* measured from the bottom of the sticky stack (header, compact bar, this nav), read from their real
           sizes: a section is current once its top passes a third of the way down the space left below it */
        const nav = document.querySelector<HTMLElement>('.h-secnav');
        const stack = nav ? (parseFloat(getComputedStyle(nav).top) || 0) + nav.offsetHeight : 130;
        const line = stack + Math.max(24, (window.innerHeight - stack) / 3);
        let c = list[0];
        for (const id of list) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) c = id;
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) c = list[list.length - 1];
        setCur(c);
      });
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
    return () => { window.removeEventListener('scroll', spy); cancelAnimationFrame(raf); };
  }, [ids]);
  /* follow the header: when it slides away the compact bar rises, and the nav rises with it */
  const [high, setHigh] = useState(false);
  useEffect(() => {
    const head = document.querySelector('.o-header');
    if (!head) return;
    const read = () => setHigh(head.classList.contains('is-hidden'));
    read();
    const mo = new MutationObserver(read);
    mo.observe(head, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  useEffect(() => {
    const a = document.querySelector<HTMLElement>(`.h-secnav [data-tab="${cur}"]`);
    const ul = a?.closest('ul');
    if (a && ul && ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: a.offsetLeft - 16, behavior: 'auto' });
  }, [cur]);
  return (
    <nav className={['h-secnav', high ? '-high' : ''].join(' ')} aria-label="Sections of this page">
      <ul className="h-secnav__list">
        {tabs.map((t) => (
          <li key={t.id}>
            <a className="h-secnav__tab" href={`#${t.id}`} data-tab={t.id} aria-current={cur === t.id ? 'location' : undefined}>
              {t.label}
              {cur === t.id && <LandfallLine className="h-secnav__line" />}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Stars({ n }: { n: number }) {
  if (!n) return null;
  return <span className="h-stars" role="img" aria-label={`${n}-star hotel`}>{Array.from({ length: n }, (_, i) => <Icon key={i} name="star" />)}</span>;
}

export default function Detail({ hotel: h, search, dated, similar: others = [] }: { hotel: Hotel; search: StaySearch; dated: boolean; similar?: Hotel[] }) {
  const desktop = useMedia(MQ_DESKTOP, true);
  const query = dated ? stayQuery(search) : '';
  const city = cityName(h.city);
  const nN = nightsOf(search);
  const [dialog, setDialog] = useState<'gallery' | 'amenities' | null>(null);
  const [galleryCat, setGalleryCat] = useState<PhotoCat | 'all'>('all');
  const [roomDialog, setRoomDialog] = useState<Room | null>(null);
  const [terms, setTerms] = useState<{ room: Room; plan: RatePlan } | null>(null);
  const [moreAbout, setMoreAbout] = useState(false);
  const [pick, setPick] = useState<Pick | null>(null);
  const [reserveNote, setReserveNote] = useState(false);
  const [trip, setTrip] = useState('All');
  const [revSort, setRevSort] = useState<'recent' | 'high' | 'low'>('recent');
  const [openRev, setOpenRev] = useState<Record<number, boolean>>({});

  const range = dayRange(search.checkin, search.checkout);
  const nights = nightsWord(search);
  const rooms = Math.max(1, search.rooms);
  const roomsWord = plural(rooms, 'room', 'rooms');
  const nPhotos = h.photos.length;
  const alt = (k: number) => `${h.name}, ${h.photos[k].caption}`;
  const lead = leadIndex(h);
  const strip = h.photos.map((_, k) => k).filter((k) => k !== lead).slice(0, 4);
  /* the plan's price for the whole stay: every room, every night, taxes in */
  const planTotal = (p: RatePlan) => p.total ?? p.nightly * nN;
  const available = h.rooms.filter((r) => roomAvailable(h, r, search));
  const cheapest = available.flatMap(openPlans).sort((a, b) => planTotal(a) - planTotal(b))[0];

  const pickedRoom = pick ? h.rooms.find((r) => r.id === pick.room) ?? null : null;
  const pickedPlan = pickedRoom && pick ? planOf(pickedRoom, pick.plan) : null;
  const pickedTotal = pickedPlan ? planTotal(pickedPlan) : 0;
  const guestsHref = (r: Room, plan: string) => `/hotels/${encodeURIComponent(h.id)}/guests?room=${encodeURIComponent(r.id)}&plan=${encodeURIComponent(plan)}&${stayQuery(search)}`;
  const pickedHref = pickedRoom && pick ? guestsHref(pickedRoom, pick.plan) : null;
  const pickedLine = pick ? `${roomsWord} for ${dollars0(pickedTotal)}` : '';

  /* write the view to lf.recent (lib/recent.ts, Developer A's helper) */
  useEffect(() => {
    const params: Record<string, string> = Object.fromEntries(new URLSearchParams(stayQuery(search)));
    if (!dated) { delete params.checkin; delete params.checkout; }
    params.hotel = h.id;
    addRecent({ kind: 'hotel-view', params, label: h.name, price: dated && cheapest ? planTotal(cheapest) : undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h.id, query]);

  const faqs = hotelFaqs(h);
  const airports = hotelAirports(h);
  const nearby = (h.nearby ?? []).filter((n) => !airports.includes(n));
  const reviews = h.reviewList ?? [];
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'rooms', label: 'Rooms' },
    ...(h.score || reviews.length ? [{ id: 'reviews', label: 'Reviews' }] : []),
    { id: 'location', label: 'Location' },
    { id: 'rules', label: 'House rules' },
    ...(faqs.length ? [{ id: 'faqs', label: 'FAQs' }] : [])
  ];

  /* amenities in groups; the rest under "More" */
  const groups = useMemo(() => amenityGroups(h.amenities), [h.amenities]);

  /* reviews: traveler type chips present in the data, three sorts */
  const trips = TRIP_ORDER.filter((t) => reviews.some((r) => r.trip === t));
  const monthKey = (m: string) => { const d = new Date(`1 ${m}`); return Number.isNaN(+d) ? 0 : +d; };
  const shownReviews = reviews.map((r, i) => ({ r, i })).filter(({ r }) => trip === 'All' || r.trip === trip)
    .sort((a, b) => revSort === 'high' ? b.r.score - a.r.score : revSort === 'low' ? a.r.score - b.r.score : monthKey(b.r.month) - monthKey(a.r.month));

  /* similar stays (from the page): nearest in score and price */
  const similar = useMemo(() => {
    const from = (x: Hotel) => { const ps = x.rooms.flatMap(openPlans); return ps.length ? Math.min(...ps.map((p) => p.total ?? p.nightly)) : 0; };
    const base = from(h);
    const list = others.filter((x) => x.id !== h.id && x.photos.length)
      .map((x) => ({ x, d: Math.abs((x.score ?? 8) - (h.score ?? 8)) * 2 + (base ? Math.abs(from(x) - base) / base : 0) }))
      .sort((a, b) => a.d - b.d).slice(0, 4).map((e) => e.x);
    const leads = leadsFor(list);
    return list.map((x, i) => ({ x, photo: x.photos[leads[i]] }));
  }, [h, others]);

  const galleryList = (c: PhotoCat) => h.photos.map((p, k) => ({ p, k })).filter(({ p }) => p.cat === c);
  const choose = (room: string, plan: string, on: boolean) => { setReserveNote(false); setPick(on ? { room, plan } : null); };
  const reserve = () => { if (!pickedHref) setReserveNote(true); };
  const toRooms = () => { const el = document.getElementById('rooms'); el?.scrollIntoView({ block: 'start' }); el?.querySelector<HTMLElement>('h2')?.focus(); };
  const cancelLine = (p: RatePlan) => (p.refundable ? (dated ? `Free cancellation until ${dayMonth(freeCancelUntil(search, p))}` : 'Free cancellation') : 'Non-refundable');
  const roomThumb = (r: Room) => r.photos[0] ?? h.photos[lead]?.name;

  const roomFacts = (r: Room) => (
    <>
      {r.beds && <p className="h-avail__beds"><Icon name="bed" />{r.beds}</p>}
      {(r.size || r.view) && <p className="h-avail__facts t-num">{[r.size, r.view].filter(Boolean).join(', ')}</p>}
      {r.amenities?.length ? <p className="h-avail__amen">{r.amenities.slice(0, 4).join(', ')}</p> : null}
      <button type="button" className="a-textbtn h-avail__details" onClick={() => setRoomDialog(r)}>Room details</button>
    </>
  );
  const termsButton = (r: Room, p: RatePlan) => (p.conditions?.length
    ? <button type="button" className="a-textbtn h-plan__terms" onClick={() => setTerms({ room: r, plan: p })} aria-label={`Rate terms for ${r.name}, ${p.name || planMeal(p)}`}>Rate terms</button>
    : null);

  return (
    <div className="h-detail -r3">
      <SectionNav tabs={tabs} />
      <div className="l-container">
        {dated && <Link prefetch={false} className="a-textbtn h-detail__back" href={`/hotels?${query}`}><Icon name="arrow-l" />Back to results</Link>}
        <div className={`h-arrival${dated ? ' -dated' : ''}`} id="overview">
          <header className="h-detail__head">
            <h1 className="t-display t-h1">{h.name}</h1>
            <p className="h-detail__meta">
              <Stars n={h.stars} />
              {h.type && <span>{h.type}</span>}
              {(h.area || city) && <a className="a-link" href="#location">{[h.area, city].filter(Boolean).join(', ')}</a>}
              {h.score ? <a className="h-detail__score" href="#reviews"><ScoreBadge score={h.score} count={h.reviews} /></a> : null}
            </p>
          </header>

          {nPhotos > 0 && (
            <button type="button" className="h-view" onClick={() => { setGalleryCat('all'); setDialog('gallery'); }} aria-label={`Open the photo gallery, ${nPhotos} photos`}>
              <span className="h-view__leadwrap">
                <Photo name={h.photos[lead].name} alt={alt(lead)} grade={false} priority className="h-view__lead" sizes="(max-width: 640px) 190vw, (min-width: 1312px) 1248px, 100vw" />
                <span className="h-view__count" aria-hidden="true"><Icon name="grid" />{nPhotos} photos</span>
                {dated && (
                  <span className="h-arrive" aria-hidden="true">
                    <b className="t-num">{dayMonth(search.checkin)}</b>
                    <span className="h-arrive__leg"><span>{nights}</span></span>
                    <b className="t-num">{dayMonth(search.checkout)}</b>
                  </span>
                )}
              </span>
              <span className="h-view__strip">
                {strip.map((k, i) => (
                  <span key={h.photos[k].name} className="h-view__cell">
                    <Photo name={h.photos[k].name} alt={alt(k)} grade={false} className="h-view__thumb" sizes="(min-width: 1025px) 312px, 25vw" />
                    {i === strip.length - 1 && nPhotos > 5 && <span className="h-view__more"><Icon name="grid" />+{nPhotos - 5} photos</span>}
                  </span>
                ))}
              </span>
            </button>
          )}
        </div>

        <div className="h-detail__cols">
          <div className="h-detail__main">
            {h.highlights?.length ? (
              <ul className="h-highlights" aria-label="Highlights">
                {h.highlights.slice(0, 6).map((x) => <li key={x}><Icon name={highlightIcon(x)} /><span>{x}</span></li>)}
              </ul>
            ) : null}

            <div className="h-detail__intro">
              {h.about && (
                <div className="h-detail__about">
                  <h2 className="t-display t-h2 h-detail__h2">About {h.name}</h2>
                  {h.about.split(/\n{2,}/).map((p, i) => <p key={i} className="h-detail__desc -open">{p}</p>)}
                  {moreAbout && h.aboutMore?.map((p) => <p key={p.slice(0, 24)} className="h-detail__desc -open">{p}</p>)}
                  {h.aboutMore?.length ? <button type="button" className="a-textbtn" aria-expanded={moreAbout} onClick={() => setMoreAbout((v) => !v)}>{moreAbout ? 'Show less' : 'Read more'}</button> : null}
                </div>
              )}
              {h.amenities.length > 0 && (
                <div className="h-detail__amen">
                  <h3 className="t-h3">Amenities</h3>
                  <ul className="h-amen -ten">{h.amenities.slice(0, 10).map((a) => <li key={a}><Icon name={amenityIcon(a)} />{a}</li>)}</ul>
                  {h.amenities.length > 10 && <button type="button" className="a-textbtn" onClick={() => setDialog('amenities')}>All {h.amenities.length} amenities</button>}
                </div>
              )}
            </div>

          </div>

          {/* pinned "Your stay" card (1025 and up) */}
          <aside className="h-detail__aside" aria-label="Your stay">
            <div className="m-summary h-pin-card">
              <p className="m-summary__title">Your stay</p>
              <p className="t-small t-muted t-num">{dated ? `${range}, ${guestsLine(search)}` : guestsLine(search)}</p>
              <StayLeg h={h} nights={nights} dated={dated} className="-card" />
              {!dated ? (
                <Button block onClick={() => requestSearch('hotels', 'dates')} aria-label={`Add dates to see prices for ${h.name}`}>Add dates for prices</Button>
              ) : !cheapest ? (
                <p className="h-room__out">No rooms left for these dates</p>
              ) : pickedHref && pickedPlan ? (
                <>
                  <div className="m-total">
                    <p className="t-small">{pickedRoom!.name}, {pickedPlan.name || planMeal(pickedPlan)}</p>
                    <div className="m-price -sm -lg">
                      <div className="m-price__line"><span className="m-price__total t-num">{dollars0(pickedTotal)} total</span></div>
                      <span className="m-price__unit t-num">{roomsWord}, {nights}</span>
                      <span className="m-price__note">taxes and fees included</span>
                    </div>
                    {atHotelLine(pickedPlan) && <p className="t-small t-muted">{atHotelLine(pickedPlan)}</p>}
                  </div>
                  <ButtonLink block href={pickedHref} arrow>Reserve</ButtonLink>
                </>
              ) : (
                <>
                  <div className="m-total">
                    <div className="m-price -sm -lg">
                      <div className="m-price__line"><span className="m-price__total t-num">From {dollars0(planTotal(cheapest))} total</span></div>
                      <span className="m-price__unit t-num">{dollars0(cheapest.nightly)} per night</span>
                      <span className="m-price__note">taxes and fees included</span>
                    </div>
                  </div>
                  <Button block onClick={toRooms}>Choose a room</Button>
                </>
              )}
            </div>
          </aside>
        </div>

        <div className="h-detail__wide">
            <section className="h-section h-rooms -r3" id="rooms" aria-labelledby="rooms-h">
              <h2 id="rooms-h" className="t-display t-h2" tabIndex={-1}>Availability</h2>
              <div className="h-strip" role="group" aria-label="Your search">
                <button type="button" className="h-strip__seg" onClick={() => requestSearch('hotels', 'dates')}><Icon name="calendar" /><span><small>Dates</small><b className="t-num">{dated ? range : 'Add dates'}</b></span></button>
                <button type="button" className="h-strip__seg" onClick={() => requestSearch('hotels', 'rooms')}><Icon name="users" /><span><small>Guests and rooms</small><b className="t-num">{guestsLine(search)}</b></span></button>
                <Button onClick={() => requestSearch('hotels', 'dates')}>Change search</Button>
              </div>

              {!dated && h.rooms.length === 0 ? (
                <div className="m-card -pad h-rooms__none">
                  <h3 className="t-h3">Add dates to see rooms</h3>
                  <p>{h.name} shows its rooms and prices for exact dates. Add yours to see what’s free and the total for your stay.</p>
                  <div className="h-empty__actions">
                    <Button onClick={() => requestSearch('hotels', 'dates')}>Add dates</Button>
                  </div>
                </div>
              ) : dated && available.length === 0 ? (
                <div className="m-card -pad h-rooms__none">
                  <h3 className="t-h3">No rooms left for these dates</h3>
                  <p>{h.name} is full from {dayMonth(search.checkin)} to {dayMonth(search.checkout)}. Try other dates or look at other hotels{city ? ` in ${city}` : ''}.</p>
                  <div className="h-empty__actions">
                    <Button onClick={() => requestSearch('hotels', 'dates')}>Change dates</Button>
                    <ButtonLink variant="ghost" href={`/hotels?${query}`}>Back to results</ButtonLink>
                  </div>
                </div>
              ) : desktop ? (
                <div className="h-avail">
                  <table className="h-avail__table">
                    <thead>
                      <tr>
                        <th scope="col">Room type</th>
                        <th scope="col">Sleeps</th>
                        <th scope="col">Your choices</th>
                        <th scope="col">Price for {nights}</th>
                        <th scope="col">Select rooms</th>
                        <th scope="col"><span className="sr-only">Reserve</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {h.rooms.flatMap((r, ri) => {
                        const ok = roomAvailable(h, r, search);
                        const plans = ok ? openPlans(r) : [];
                        const thumb = roomThumb(r);
                        const roomCell = (
                          <th scope="rowgroup" rowSpan={Math.max(1, plans.length)} className="h-avail__room">
                            {thumb && <span className="h-avail__photo"><Photo name={thumb} alt={`${r.name} at ${h.name}`} grade={false} sizes="120px" /></span>}
                            <span className="h-avail__roombody">
                              <b className="h-avail__name">{r.name}</b>
                              {roomFacts(r)}
                            </span>
                          </th>
                        );
                        const reserveCell = ri === 0 ? (
                          <td rowSpan={999} className="h-avail__reserve">
                            <div className="h-avail__sum">
                              {pick && pickedPlan ? <p className="h-avail__sumline t-num"><b>{pickedLine}</b><span>{pickedRoom!.name}, {pickedPlan.name || planMeal(pickedPlan)}</span><span className="t-muted">taxes and fees included</span></p>
                                : <p className="t-small t-muted">{dated ? 'Choose a room and rate' : 'Add dates to see prices'}</p>}
                              {!dated ? <Button block onClick={() => requestSearch('hotels', 'dates')}>Add dates</Button>
                                : pickedHref ? <ButtonLink block href={pickedHref}>Reserve</ButtonLink>
                                  : <Button block onClick={reserve}>Reserve</Button>}
                              {reserveNote && <p className="h-avail__note" role="alert">Select a room first</p>}
                              <p className="h-avail__points t-small t-muted"><Icon name="tick" />Taxes and fees in every total</p>
                            </div>
                          </td>
                        ) : null;
                        if (!ok || !plans.length) return [
                          <tr key={r.id} className="h-avail__row -out -first">{roomCell}<td colSpan={4} className="h-avail__out">No longer available for your dates</td>{reserveCell}</tr>
                        ];
                        return plans.map((p, pi) => {
                          const total = planTotal(p);
                          const sel = pick && pick.room === r.id && pick.plan === p.id ? rooms : 0;
                          const extra = atHotelLine(p);
                          return (
                            <tr key={`${r.id}-${p.id}`} className={['h-avail__row', pi === 0 ? '-first' : '', sel ? 'is-picked' : ''].join(' ')}>
                              {pi === 0 && roomCell}
                              <td className="h-avail__sleeps"><span role="img" aria-label={`Sleeps ${r.sleeps}`}>{Array.from({ length: Math.min(r.sleeps, 6) }, (_, i) => <Icon key={i} name="user" />)}</span></td>
                              <td className="h-avail__choice">
                                <p className="h-avail__meal"><Icon name={p.breakfast ? 'coffee' : 'bed'} />{planMeal(p)}</p>
                                <p className={p.refundable ? 'h-avail__free' : 'h-avail__nr'}><Icon name={p.refundable ? 'tick' : 'info'} />{cancelLine(p)}</p>
                                <p className="h-avail__pay t-muted">Pay now</p>
                                {plans.length === 1 && <p className="h-avail__only t-small t-muted"><Icon name="info" />Only rate for this room</p>}
                                {termsButton(r, p)}
                              </td>
                              <td className="h-avail__price">
                                {dated ? <><b className="h-avail__total t-num">{dollars0(total)}</b><span className="t-num t-muted">{dollars0(p.nightly)} per night</span><span className="t-muted">taxes and fees included</span>{extra && <span className="t-small t-muted">{extra}</span>}</>
                                  : <button type="button" className="a-textbtn" onClick={() => requestSearch('hotels', 'dates')}>Add dates for prices</button>}
                              </td>
                              <td className="h-avail__select">
                                <span className="h-sort__box h-qty">
                                  <select aria-label={`Rooms of ${r.name}, ${p.name || planMeal(p)}`} value={sel} disabled={!dated}
                                    onChange={(e) => choose(r.id, p.id, +e.target.value > 0)}>
                                    <option value={0}>0</option>
                                    <option value={rooms}>{`${rooms}  (${dollars0(total)})`}</option>
                                  </select>
                                  <Icon name="chev-d" />
                                </span>
                              </td>
                              {pi === 0 && reserveCell}
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <ul className="h-avail__cards">
                  {h.rooms.map((r) => {
                    const plans = roomAvailable(h, r, search) ? openPlans(r) : [];
                    const ok = plans.length > 0;
                    return (
                      <li key={r.id} className={['m-card h-acard', ok ? '' : 'is-out'].join(' ')}>
                        <PhotoSwap photos={roomPhotos(h, r)} label={`Photos of ${r.name}`} sizes="100vw" className="h-acard__photo" />
                        <div className="h-acard__body">
                          <h3 className="h-avail__name">{r.name}</h3>
                          <p className="h-avail__beds"><Icon name="users" />Sleeps {r.sleeps}</p>
                          {roomFacts(r)}
                          {!ok ? <p className="h-room__out">No longer available for your dates</p> : (
                            <fieldset className="h-acard__plans">
                              <legend className="sr-only">Rate plans for {r.name}</legend>
                              {plans.map((p) => {
                                const extra = atHotelLine(p);
                                return (
                                  <div key={p.id}>
                                    <label className={['h-plan', pick?.room === r.id && pick.plan === p.id ? 'is-picked' : ''].join(' ')}>
                                      <input type="radio" name="h-plan" checked={pick?.room === r.id && pick.plan === p.id} disabled={!dated} onChange={() => choose(r.id, p.id, true)} />
                                      <span className="h-plan__text">
                                        <b>{planMeal(p)}</b>
                                        <span className={p.refundable ? 'h-avail__free' : 'h-avail__nr'}>{cancelLine(p)}</span>
                                        <span className="t-muted">Pay now</span>
                                        {plans.length === 1 && <span className="h-avail__only t-small t-muted">Only rate for this room</span>}
                                      </span>
                                      {dated && <span className="h-plan__price t-num"><b>{dollars0(planTotal(p))}</b><span className="t-muted">{dollars0(p.nightly)} per night</span>{extra && <span className="t-muted">{extra}</span>}</span>}
                                    </label>
                                    {termsButton(r, p)}
                                  </div>
                                );
                              })}
                            </fieldset>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {h.score || reviews.length ? (
              <section className="h-section h-reviews" id="reviews" aria-labelledby="reviews-h">
                <h2 id="reviews-h" className="t-display t-h2">Guest reviews</h2>
                {h.score ? (
                  <div className="h-reviews__top">
                    <ScoreBadge score={h.score} count={h.reviews} size="lg" />
                    {h.categories && (
                      <ul className="h-bars">
                        {Object.entries(h.categories).map(([k, v]) => (
                          <li key={k} className="h-bar">
                            <span className="h-bar__label">{k}</span>
                            <span className="h-bar__score t-num">{v.toFixed(1)}</span>
                            <span className="h-bar__track" aria-hidden="true"><span style={{ width: `${v * 10}%` }} /></span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
                {reviews.length > 0 && (
                  <>
                    <div className="h-reviews__tools">
                      {trips.length > 0 && (
                        <div className="h-reviews__chips" role="group" aria-label="Traveler type">
                          {['All', ...trips].map((t) => <button key={t} type="button" className="a-chip" aria-pressed={trip === t} onClick={() => setTrip(t)}>{t}<span className="t-num t-muted">{t === 'All' ? reviews.length : reviews.filter((r) => r.trip === t).length}</span></button>)}
                        </div>
                      )}
                      <label className="h-sort"><span>Sort</span>
                        <span className="h-sort__box"><select value={revSort} onChange={(e) => setRevSort(e.target.value as typeof revSort)}>
                          <option value="recent">Most recent</option><option value="high">Highest scores</option><option value="low">Lowest scores</option>
                        </select><Icon name="chev-d" /></span>
                      </label>
                    </div>
                    <ul className="h-revlist">
                      {shownReviews.map(({ r, i }) => (
                        <li key={i} className="h-rev">
                          <div className="h-rev__who">
                            <span className="h-rev__disc" aria-hidden="true">{r.name.charAt(0)}</span>
                            <p><b>{r.name}</b>{r.country && <span className="t-muted">{r.country}</span>}</p>
                          </div>
                          <p className="h-rev__meta t-small t-muted">{r.trip && <span>{r.trip}</span>}{r.month && <span className="t-num">Stayed {r.month}</span>}</p>
                          <div className="h-rev__head"><ScoreBadge score={r.score} compact />{r.title && <h3 className="h-rev__title">{r.title}</h3>}</div>
                          <p className={['h-rev__text', openRev[i] ? 'is-open' : ''].join(' ')}>{r.text}</p>
                          {r.text.length > 200 && <button type="button" className="a-textbtn" aria-expanded={!!openRev[i]} onClick={() => setOpenRev((o) => ({ ...o, [i]: !o[i] }))}>{openRev[i] ? 'Show less' : 'Read more'}</button>}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            ) : null}

            <Section id="location" title="Location">
              {h.address && <p className="h-loc__line">{h.address.replace(/^([^,]+), \d[\d-]* /, '$1, ')}</p>}
              {(h.lat || h.lon) ? <StayMap pins={[{ id: h.id, lat: h.lat, lon: h.lon, label: h.name, name: h.name }]} centre={[h.lat, h.lon]} zoom={15} alt={`Map of ${[h.area, city].filter(Boolean).join(', ')}, with ${h.name} marked`} className="h-loc__map" /> : null}
              <div className="h-loc__cols">
                {nearby.length || airports.length ? (
                  <div className="h-loc__text">
                    {nearby.length > 0 && <>
                      <h3 className="t-h3">What&apos;s nearby</h3>
                      <ul className="h-nearby">
                        {nearby.map((n) => <li key={n.place}><span><Icon name="pin" />{n.place}</span><span className="t-num t-muted">{n.minutes} min {n.mode === 'drive' ? 'drive' : 'walk'}</span></li>)}
                      </ul>
                    </>}
                    {airports.length > 0 && <>
                      <h3 className="t-h3 h-loc__sub">Airports</h3>
                      <ul className="h-nearby">
                        {airports.map((n) => <li key={n.place}><span><Icon name="plane" />{n.place}</span><span className="t-num t-muted">{n.minutes} min {n.mode === 'walk' ? 'walk' : 'drive'}</span></li>)}
                      </ul>
                    </>}
                  </div>
                ) : null}
                {(gettingAround(h.id) || (h.fromCentre !== undefined && city)) && (
                  <div className="h-loc__text">
                    <h3 className="t-h3">Getting around</h3>
                    {h.fromCentre !== undefined && city && <p className="t-num">{h.fromCentre.toFixed(1)} km from the center of {city}</p>}
                    {gettingAround(h.id) && <p>{gettingAround(h.id)}</p>}
                  </div>
                )}
              </div>
            </Section>

            <Section id="rules" title="House rules">
              <dl className="h-rules">
                {h.checkIn && <div><dt><Icon name="clock" />Check-in</dt><dd className="t-num">From {h.checkIn}</dd></div>}
                {h.checkOut && <div><dt><Icon name="clock" />Check-out</dt><dd className="t-num">Until {h.checkOut}</dd></div>}
                {h.policies.map((p) => <div key={p.title}><dt><Icon name="info" />{p.title}</dt><dd>{p.body}</dd></div>)}
              </dl>
            </Section>

            {faqs.length > 0 && (
              <Section id="faqs" title="FAQs">
                <Faqs items={faqs} />
              </Section>
            )}
                  </div>

        {similar.length > 0 && (
          <section className="h-section h-similar" aria-labelledby="similar-h">
            <Rail label={`Similar stays${city ? ` in ${city}` : ''}`} head={<h2 id="similar-h" className="t-display t-h2">Similar stays{city ? ` in ${city}` : ''}</h2>}>
              {similar.map(({ x, photo }) => {
                const plans = x.rooms.flatMap(openPlans);
                const from = plans.length ? Math.min(...plans.map((p) => (dated && p.total !== undefined ? p.total : p.nightly))) : 0;
                const priced = dated && plans.some((p) => p.total !== undefined);
                return (
                  <RailCard key={x.id} href={`/hotels/${encodeURIComponent(x.id)}${query ? `?${query}` : ''}`} photo={photo?.name} alt={photo ? `${x.name}, ${photo.caption}` : ''}>
                    <b className="h-simcard__name">{x.name}</b>
                    <span className="t-small t-muted">{[x.area, x.stars ? `${x.stars}-star ${x.type ? x.type.toLowerCase() : 'hotel'}` : x.type].filter(Boolean).join(', ')}</span>
                    {x.score ? <ScoreBadge score={x.score} count={x.reviews} /> : null}
                    {from ? <span className="h-simcard__price t-num">{priced ? `${dollars0(from)} total` : `From ${dollars0(from)} per night`}</span> : null}
                  </RailCard>
                );
              })}
            </Rail>
          </section>
        )}
      </div>

      {!desktop && dated && cheapest && (pickedHref && pick ? (
        <PriceBar total={`${dollars0(pickedTotal)} total`} sub={`${roomsWord}, ${nights}`} note="taxes and fees included" action={<ButtonLink href={pickedHref} arrow>Reserve</ButtonLink>} />
      ) : (
        <PriceBar total={`From ${dollars0(planTotal(cheapest))} total`} sub={`${dollars0(cheapest.nightly)} per night, ${nights}`} note="taxes and fees included" action={<Button onClick={toRooms}>Choose a room</Button>} />
      ))}

      <Dialog open={dialog === 'gallery'} onClose={() => setDialog(null)} title={`Photos of ${h.name}`} wide sheet closeLabel="Close gallery">
        <div className="h-gallery__chips" role="group" aria-label="Photo groups">
          <button type="button" className="a-chip" aria-pressed={galleryCat === 'all'} onClick={() => setGalleryCat('all')}>All photos<span className="t-num t-muted">{nPhotos}</span></button>
          {CATS.filter((c) => galleryList(c).length).map((c) => (
            <button key={c} type="button" className="a-chip" aria-pressed={galleryCat === c} onClick={() => setGalleryCat(c)}>{CAT_LABEL[c]}<span className="t-num t-muted">{galleryList(c).length}</span></button>
          ))}
        </div>
        {CATS.filter((c) => galleryCat === 'all' || galleryCat === c).map((c) => {
          const list = galleryList(c);
          if (!list.length) return null;
          return (
            <section key={c} className="h-gallery">
              <h3 className="t-h3">{CAT_LABEL[c]}</h3>
              <div className="h-gallery__grid">{list.map(({ p, k }) => <Photo key={p.name} name={p.name} alt={alt(k)} grade={false} sizes="(min-width: 1025px) 440px, 100vw" className="h-gallery__photo" />)}</div>
            </section>
          );
        })}
      </Dialog>
      <Dialog open={dialog === 'amenities'} onClose={() => setDialog(null)} title={`All ${h.amenities.length} amenities`}>
        <div className="h-amengroups">
          {groups.map((g) => (
            <section key={g.group} className="h-amengroup">
              <h3 className="t-title">{g.group}</h3>
              <ul className="h-amen -all">{g.items.map((a) => <li key={a}><Icon name={amenityIcon(a)} />{a}</li>)}</ul>
            </section>
          ))}
        </div>
      </Dialog>
      <Dialog open={!!roomDialog} onClose={() => setRoomDialog(null)} title={roomDialog?.name ?? ''} sheet
        footer={roomDialog && <Button block onClick={() => { setRoomDialog(null); toRooms(); }}>Choose a rate</Button>}>
        {roomDialog && (
          <div className="h-roomdlg">
            <PhotoSwap photos={roomPhotos(h, roomDialog)} label={`Photos of ${roomDialog.name}`} sizes="(min-width: 1025px) 512px, 100vw" className="h-roomdlg__photo" />
            <p className="t-num">{[roomDialog.beds, roomDialog.size, roomDialog.view, `sleeps ${roomDialog.sleeps}`].filter(Boolean).join(', ')}</p>
            {roomDialog.amenities?.length ? <ul className="h-amen -all">{roomDialog.amenities.map((a) => <li key={a}><Icon name={amenityIcon(a)} />{a}</li>)}</ul> : null}
            <ul className="h-incl">
              {openPlans(roomDialog).map((p) => (
                <li key={p.id}><Icon name={p.refundable ? 'tick' : 'info'} /><span>{planMeal(p)}, {p.refundable ? `free${cancelLine(p).slice(4)}` : 'non-refundable'}{dated ? <b className="t-num">{` ${dollars0(planTotal(p))} for ${nights}`}</b> : null}</span></li>
              ))}
            </ul>
          </div>
        )}
      </Dialog>
      <Dialog open={!!terms} onClose={() => setTerms(null)} title="Rate terms" sheet closeLabel="Close">
        {terms && (
          <div className="h-roomdlg">
            <p className="t-small t-muted">{terms.room.name}, {terms.plan.name || planMeal(terms.plan)}</p>
            <dl className="h-rules">
              {(terms.plan.conditions ?? []).map((c, i) => <div key={`${c.title}-${i}`}><dt><Icon name="info" />{c.title || 'Terms'}</dt><dd>{c.body}</dd></div>)}
              {atHotelLine(terms.plan) && <div><dt><Icon name="info" />At the hotel</dt><dd>{atHotelLine(terms.plan)}</dd></div>}
            </dl>
          </div>
        )}
      </Dialog>
    </div>
  );
}
