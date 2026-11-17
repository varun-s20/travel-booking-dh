'use client';
/* =====================================================================
   Hotel results, round 3 (spec B6; Hipcamp's list plus map, with
   Booking.com, Expedia and Priceline's depth):
   - the header line ("Lisbon: 8 stays, Nov 20 to 27, 2 adults") and
     the price rule, quick filter chips, a Filters button opening every
     group with live counts (price per night with a histogram, guest
     score, stars, property type, free cancellation, meals,
     neighborhood, distance, amenities, bed type), active chips with
     "Clear all", five sorts;
   - cards: photo carousel, "4-star boutique hotel", name, area and
     distance with Show on map, the score window, the room the price is
     for, the rate's terms, rooms left only when the data says 3 or
     fewer, the stay total, nights and guests, the nightly line;
   - the map beside the list (pins carry the totals), full screen on
     phones. Panels: search failed, no rooms, filters hide everything.
   Copy: content/copy.md and content/mock-catalogue.md (demo data).
   ===================================================================== */
import { Save } from '@/components/ui/Save';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Dialog } from '@/components/ui/Dialog';
import { Notice } from '@/components/ui/Notice';
import { Searching } from '@/components/booking/Searching';
import { PhotoCarousel } from '@/components/hotels/PhotoCarousel';
import { StayMap, type Pin } from '@/components/hotels/StayMap';
import { HotelScore, typeLine } from '@/components/hotels/HotelScore';
import { CITY_CENTRE, HOTELS, landBearing, PROPERTY_TYPES, freeCancelUntil, nightsOf, type Hotel, type PropertyType, type StaySearch } from '@/lib/mock/hotels';
import { requestSearch, rangeFill } from '@/lib/client';
import { dayMonth, dollars, plural } from '@/lib/format';

type Result = {
  id: string; room: string; nightly: number; total: number; freeCancel: boolean; breakfast: boolean; distance: number; saving?: number; lower?: string;
  plan: string; planName: string; roomName: string; beds: string; roomsLeft: number; hasFreeCancel: boolean; hasBreakfast: boolean;
};
type Sort = 'recommended' | 'price' | 'priceHigh' | 'score' | 'value' | 'reviews' | 'centre' | 'stars';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'recommended', label: 'Recommended' }, { id: 'price', label: 'Price, lowest total first' }, { id: 'priceHigh', label: 'Price, highest total first' },
  { id: 'score', label: 'Guest score' }, { id: 'value', label: 'Guest score and price' }, { id: 'reviews', label: 'Most reviewed' },
  { id: 'centre', label: 'Distance from the center' }, { id: 'stars', label: 'Stars, high to low' }
];
const SCORES: { min: number; label: string }[] = [{ min: 9, label: 'Exceptional, 9 or more' }, { min: 8.5, label: 'Excellent, 8.5 or more' }, { min: 8, label: 'Very good, 8 or more' }, { min: 7, label: 'Good, 7 or more' }];
const DISTANCES = [1, 3, 5];
/* the spec's amenity filters, each matched against the catalogue's amenity names */
const AMENITY_FILTERS: { id: string; label: string; any: string[] }[] = [
  { id: 'wifi', label: 'Free wifi', any: ['Free wifi'] }, { id: 'breakfast', label: 'Breakfast', any: ['Breakfast available'] },
  { id: 'pool', label: 'Pool', any: ['Outdoor pool', 'Indoor pool', 'Plunge pool'] }, { id: 'parking', label: 'Parking', any: ['Parking on site (paid)', 'Free parking'] },
  { id: 'gym', label: 'Gym', any: ['Gym'] }, { id: 'ac', label: 'Air conditioning', any: ['Air conditioning'] }, { id: 'spa', label: 'Spa', any: ['Spa'] },
  { id: 'pets', label: 'Pets allowed', any: ['Pets allowed'] }, { id: 'kitchen', label: 'Kitchen', any: ['Kitchen', 'Shared kitchen'] },
  { id: 'shuttle', label: 'Airport shuttle', any: ['Airport shuttle (paid)'] }, { id: 'lift', label: 'Elevator', any: ['Elevator'] },
  { id: 'access', label: 'Accessible rooms', any: ['Accessible rooms'] }
];
const BEDS: { id: string; label: string; test: (b: string) => boolean }[] = [
  { id: 'double', label: 'Double or king bed', test: (b) => /double bed|king bed/i.test(b) },
  { id: 'twin', label: 'Twin beds', test: (b) => /single beds|twin/i.test(b) }
];

type Filters = { max: number | null; score: number | null; stars: number[]; types: PropertyType[]; cancel: boolean; breakfast: boolean; areas: string[]; dist: number | null; amen: string[]; beds: string[] };
type Group = keyof Filters;
const NONE: Filters = { max: null, score: null, stars: [], types: [], cancel: false, breakfast: false, areas: [], dist: null, amen: [], beds: [] };

const stays = (n: number) => plural(n, 'stay', 'stays');
const hotelOf = (id: string) => HOTELS.find((x) => x.id === id)!;
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function passes(r: Result, h: Hotel, f: Filters, skip?: Group): boolean {
  if (skip !== 'max' && f.max !== null && r.nightly > f.max) return false;
  if (skip !== 'score' && f.score !== null && h.score < f.score) return false;
  if (skip !== 'stars' && f.stars.length && !f.stars.includes(h.stars)) return false;
  if (skip !== 'types' && f.types.length && !f.types.includes(h.type)) return false;
  if (skip !== 'cancel' && f.cancel && !r.hasFreeCancel) return false;
  if (skip !== 'breakfast' && f.breakfast && !r.hasBreakfast) return false;
  if (skip !== 'areas' && f.areas.length && !f.areas.includes(h.area)) return false;
  if (skip !== 'dist' && f.dist !== null && r.distance > f.dist) return false;
  if (skip !== 'amen' && f.amen.length && !f.amen.every((id) => AMENITY_FILTERS.find((a) => a.id === id)!.any.some((n) => h.amenities.includes(n)))) return false;
  if (skip !== 'beds' && f.beds.length && !f.beds.some((id) => h.rooms.some((room) => BEDS.find((b) => b.id === id)!.test(room.beds)))) return false;
  return true;
}

export function HotelResults({ query, search, cityName, initialType = null }: { query: string; search: StaySearch; cityName: string; initialType?: PropertyType | null }) {
  const nights = nightsOf(search);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [slow, setSlow] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [sort, setSort] = useState<Sort>('recommended');
  const [f, setF] = useState<Filters>(initialType ? { ...NONE, types: [initialType] } : NONE);
  const [active, setActive] = useState<string | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [announce, setAnnounce] = useState('');
  const errRef = useRef<HTMLDivElement>(null);
  const until = dayMonth(freeCancelUntil(search));
  const guests = [plural(search.adults, 'adult', 'adults'), search.children ? plural(search.children, 'child', 'children') : '', search.rooms > 1 ? plural(search.rooms, 'room', 'rooms') : ''].filter(Boolean).join(', ');

  useEffect(() => {
    const ctl = new AbortController();
    setStatus('loading'); setSlow(false); setAnnounce('');
    document.title = 'Searching hotels | Overwing';
    const t = window.setTimeout(() => setSlow(true), 4000);
    fetch(`/api/hotels/search?${query}${attempt ? '&retry=1' : ''}`, { signal: ctl.signal })
      .then((r) => r.json())
      .then((j: { data?: { results: Result[] }; errors?: unknown[] }) => {
        if (!j.data || j.errors) throw new Error('search failed');
        setResults(j.data.results);
        setStatus('done');
        setAnnounce(`${stays(j.data.results.length)} found`);
      })
      .catch(() => { if (!ctl.signal.aborted) { setStatus('error'); requestAnimationFrame(() => errRef.current?.focus()); } })
      .finally(() => { window.clearTimeout(t); if (!ctl.signal.aborted) document.title = `Hotels in ${cityName} | Overwing`; });
    return () => { ctl.abort(); window.clearTimeout(t); };
  }, [query, attempt, cityName]);

  const rows = useMemo(() => results.map((r) => ({ r, h: hotelOf(r.id) })), [results]);
  /* the slider runs to the next $50 above the dearest place */
  const maxNightly = useMemo(() => Math.ceil(Math.max(0, ...results.map((r) => r.nightly)) / 5000) * 5000, [results]);
  const minNightly = useMemo(() => Math.floor(Math.min(...results.map((r) => r.nightly), maxNightly) / 1000) * 1000, [results, maxNightly]);
  const shown = useMemo(() => {
    const list = rows.filter(({ r, h }) => passes(r, h, f));
    const rec = (x: { r: Result; h: Hotel }) => x.h.score * 10 - x.r.nightly / 4000 + (x.h.showcase ? 4 : 0);
    return [...list].sort((a, b) =>
      sort === 'price' ? a.r.total - b.r.total
        : sort === 'priceHigh' ? b.r.total - a.r.total
        /* score and price: guest score per $100 a night, so a 9.0 at $150 ranks above a 9.2 at $400 */
        : sort === 'value' ? b.h.score / (b.r.nightly / 10000) - a.h.score / (a.r.nightly / 10000)
        : sort === 'reviews' ? b.h.reviewCount - a.h.reviewCount
        : sort === 'score' ? b.h.score - a.h.score || a.r.total - b.r.total
          : sort === 'centre' ? a.r.distance - b.r.distance
            : sort === 'stars' ? b.h.stars - a.h.stars || a.r.total - b.r.total
              : rec(b) - rec(a));
  }, [rows, f, sort]);
  /* facet counts: the stays that would show with this option in place of the group's current choice, every other group as set */
  const count = (_group: Group, patch: Partial<Filters>) => rows.filter(({ r, h }) => passes(r, h, { ...f, ...patch })).length;
  const activeCount = (f.max !== null ? 1 : 0) + (f.score !== null ? 1 : 0) + f.stars.length + f.types.length + (f.cancel ? 1 : 0) + (f.breakfast ? 1 : 0) + f.areas.length + (f.dist !== null ? 1 : 0) + f.amen.length + f.beds.length;
  const filtered = activeCount > 0;
  useEffect(() => { if (status === 'done' && filtered) setAnnounce(`Showing ${shown.length} of ${stays(results.length)}`); }, [shown.length, filtered, status, results.length]);

  /* the histogram behind the price slider: 24 bars of nightly prices */
  const bins = useMemo(() => {
    const n = 24, span = Math.max(1, maxNightly - minNightly);
    const b = Array.from({ length: n }, () => 0);
    for (const r of results) b[Math.min(n - 1, Math.floor(((r.nightly - minNightly) / span) * n))]++;
    const top = Math.max(1, ...b);
    return b.map((v, i) => ({ h: v / top, from: minNightly + (span * i) / n }));
  }, [results, minNightly, maxNightly]);
  const areas = useMemo(() => [...new Set(rows.map(({ h }) => h.area))].sort(), [rows]);

  const spots = shown.map(({ h }) => h);
  const centre: [number, number] = spots.length ? [(Math.min(...spots.map((h) => h.lat)) + Math.max(...spots.map((h) => h.lat))) / 2, (Math.min(...spots.map((h) => h.lon)) + Math.max(...spots.map((h) => h.lon))) / 2] : CITY_CENTRE[search.place];
  const pins: Pin[] = shown.map(({ r, h }) => ({ id: r.id, lat: h.lat, lon: h.lon, label: dollars(r.total), name: h.name, href: `/hotels/${h.id}?${query}`,
    card: { kicker: typeLine(h), score: `${h.score.toFixed(1)} ${h.scoreWord}, ${h.reviewCount.toLocaleString('en-US')} reviews`, line: `${dollars(r.total)} total, ${dollars(r.nightly)} a night` } }));
  const spread = spots.length ? Math.max(Math.max(...spots.map((h) => h.lat)) - Math.min(...spots.map((h) => h.lat)), Math.max(...spots.map((h) => h.lon)) - Math.min(...spots.map((h) => h.lon))) : 0;
  const zoom = spread > 0.09 ? 12 : spread > 0.045 ? 13 : spread > 0.02 ? 14 : 15;
  const sortLabel = SORTS.find((s) => s.id === sort)!.label;
  const clear = () => setF(NONE);

  /* removable chips for every active filter */
  const chips: { key: string; label: string; off: () => void }[] = [
    ...(f.max !== null ? [{ key: 'max', label: `Up to ${dollars(f.max)} a night`, off: () => setF({ ...f, max: null }) }] : []),
    ...(f.score !== null ? [{ key: 'score', label: `Guest score ${f.score}+`, off: () => setF({ ...f, score: null }) }] : []),
    ...f.stars.map((s) => ({ key: `s${s}`, label: plural(s, 'star', 'stars'), off: () => setF({ ...f, stars: f.stars.filter((x) => x !== s) }) })),
    ...f.types.map((t) => ({ key: t, label: t, off: () => setF({ ...f, types: f.types.filter((x) => x !== t) }) })),
    ...(f.cancel ? [{ key: 'cancel', label: 'Free cancellation', off: () => setF({ ...f, cancel: false }) }] : []),
    ...(f.breakfast ? [{ key: 'breakfast', label: 'Breakfast included', off: () => setF({ ...f, breakfast: false }) }] : []),
    ...f.areas.map((a) => ({ key: a, label: a, off: () => setF({ ...f, areas: f.areas.filter((x) => x !== a) }) })),
    ...(f.dist !== null ? [{ key: 'dist', label: `Under ${f.dist} km from the center`, off: () => setF({ ...f, dist: null }) }] : []),
    ...f.amen.map((a) => ({ key: a, label: AMENITY_FILTERS.find((x) => x.id === a)!.label, off: () => setF({ ...f, amen: f.amen.filter((x) => x !== a) }) })),
    ...f.beds.map((b) => ({ key: b, label: BEDS.find((x) => x.id === b)!.label, off: () => setF({ ...f, beds: f.beds.filter((x) => x !== b) }) }))
  ];

  if (status === 'error') {
    return (
      <div className="o-results -single">
        <Notice ref={errRef} title="We couldn’t reach the hotels just now"
          actions={<button className="a-button" type="button" onClick={() => setAttempt((a) => a + 1)}><span className="a-button__label">Try again</span></button>}>
          <p>Your search didn’t finish. Try again in a moment.</p>
        </Notice>
      </div>
    );
  }
  if (status === 'loading') {
    return (
      <div className="o-stays">
        <div className="o-stays__list" aria-busy="true">
          <Searching line="Checking rooms and prices with hotels" slow={slow ? 'Still looking. Some hotels take a few seconds to answer.' : ''} />
          <ul className="o-stays__cards -skeleton" aria-hidden="true">{[0, 1, 2].map((i) => <li key={i}><div className="m-stay -skeleton"><span className="m-skeleton -photo" /><span className="m-stay__text"><span className="m-skeleton -line" /><span className="m-skeleton -line -short" /><span className="m-skeleton -line" /></span></div></li>)}</ul>
        </div>
        <div className="o-stays__map" aria-hidden="true"><div className="m-skeleton -map" /></div>
        <p className="sr-only" role="status">{announce}</p>
      </div>
    );
  }
  if (!results.length) {
    return (
      <div className="o-results -single">
        <Notice title={`No rooms in ${cityName} for these dates`}
          actions={<button className="a-button" type="button" onClick={() => requestSearch('hotels', 'dates')}><span className="a-button__label">Change dates</span></button>}>
          <p>Every place we checked is full or doesn’t fit {plural(search.adults, 'adult', 'adults')} in {plural(search.rooms, 'room', 'rooms')}. Try other dates or another room setup.</p>
        </Notice>
        <p className="sr-only" role="status">{announce}</p>
      </div>
    );
  }

  const showOnMap = (id: string) => {
    setActive(id);
    /* the side map shows only from 1025 to 1279px; elsewhere Show on map opens the map dialog */
    if (!window.matchMedia('(min-width: 1025px) and (max-width: 1279px)').matches) setMapOpen(true);
  };

  const cards = shown.map(({ r, h }) => (
    <li key={h.id}>
      <article className={`m-stay${active === h.id ? ' is-active' : ''}`} onMouseEnter={() => setActive(h.id)} onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(h.id)} onBlur={() => setActive(null)} aria-labelledby={`stay-${h.id}`}>
        <PhotoCarousel photos={h.photos.slice(0, 5).map((p) => p.name)} name={h.name} sizes="(min-width: 641px) 220px, calc(100vw - 32px)" className="m-stay__media" />
        <div className="m-stay__text">
          <p className="m-stay__kicker">{typeLine(h)}</p>
          <h2 className="m-stay__title" id={`stay-${h.id}`}><Link className="m-stay__link" href={`/hotels/${h.id}?${query}`}>{h.name}</Link></h2>
          <p className="m-stay__meta">{h.area}, {r.distance.toFixed(1)} km from the center <button className="m-stay__mapLink" type="button" onClick={() => showOnMap(h.id)}>Show on map</button></p>
          <HotelScore score={h.score} word={h.scoreWord} reviews={h.reviewCount} size="s" className="m-stay__score" />
          <p className="m-stay__room"><strong>{r.roomName}</strong>, {r.beds}</p>
          <ul className="m-stay__terms">
            {r.freeCancel && <li><Icon name="tick" size="s" />Free cancellation until {until}</li>}
            {r.breakfast && <li><Icon name="tick" size="s" />Breakfast included</li>}
            {!r.freeCancel && <li className="-muted">Non-refundable</li>}
            {r.roomsLeft <= 3 && <li className="-warn">{plural(r.roomsLeft, 'room', 'rooms')} left at this rate</li>}
          </ul>
          <div className="m-stay__foot">
            {r.saving ? <Save className="m-stay__save">{r.lower}, {dollars(r.saving)} under the usual price</Save> : null}
            <p className="m-stay__price"><strong>{dollars(r.total)}</strong><span>{plural(nights, 'night', 'nights')}, {guests}</span><span>{dollars(r.nightly)} a night, taxes and fees included</span></p>
            <span className="a-button -small -steady" aria-hidden="true"><span className="a-button__label">See rooms</span></span>
          </div>
        </div>
      </article>
    </li>
  ));

  /* every filter group: in the always-visible column from 1280px, and in the Filters panel below that.
     `idp` keeps ids and radio names apart between the two copies */
  const renderGroups = (idp: string) => (
    <div className="o-hfilters">
      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Price per night</legend>
        <p className="o-hfilters__value" id={`${idp}price-range-v`}>Up to {dollars(f.max ?? maxNightly)} a night</p>
        <div className="o-hfilters__hist" aria-hidden="true">
          {bins.map((b, i) => <span key={i} className={b.from <= (f.max ?? maxNightly) ? 'is-in' : ''} style={{ height: `${Math.max(4, b.h * 100)}%` }} />)}
        </div>
        <input className="a-range" style={rangeFill(f.max ?? maxNightly, minNightly, maxNightly)} id={`${idp}price-range`} type="range" min={minNightly} max={maxNightly} step={1000} value={f.max ?? maxNightly} aria-describedby={`${idp}price-range-v`} aria-label="Price per night"
          aria-valuetext={`Up to ${dollars(f.max ?? maxNightly)} a night`} onChange={(e) => { const v = +e.target.value; setF({ ...f, max: v >= maxNightly ? null : v }); }} />
        <p className="o-hfilters__ends" aria-hidden="true"><span>{dollars(minNightly)}</span><span>{dollars(maxNightly)}</span></p>
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Guest score</legend>
        {SCORES.map((s) => { const n = count('score', { score: s.min }); return (
          <label className="m-filterRow" key={s.min}>
            <input className="m-filterRow__input" type="radio" name={`${idp}h-score`} checked={f.score === s.min} onChange={() => setF({ ...f, score: s.min })} disabled={!n && f.score !== s.min} />
            <span className="m-filterRow__label">{s.label}</span><span className="m-filterRow__price">{n}</span>
          </label>
        ); })}
        {f.score !== null && <button className="o-hfilters__clear" type="button" onClick={() => setF({ ...f, score: null })}>Any score</button>}
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Stars</legend>
        <div className="o-hfilters__tiles">
          {[1, 2, 3, 4, 5].map((s) => { const n = count('stars', { stars: [s] }); return (
            <button key={s} type="button" className="o-hfilters__tile" aria-pressed={f.stars.includes(s)} disabled={!n && !f.stars.includes(s)} onClick={() => setF({ ...f, stars: toggle(f.stars, s) })}>
              <span className="o-hfilters__tileMain">{s}<Icon name="star" size="s" /></span><span className="o-hfilters__tileCount">{n}</span>
              <span className="sr-only">{plural(s, 'star', 'stars')}, {stays(n)}</span>
            </button>
          ); })}
        </div>
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Property type</legend>
        {PROPERTY_TYPES.map((t) => { const n = count('types', { types: [t] }); return (
          <label className="m-filterRow" key={t}>
            <input className="m-filterRow__input" type="checkbox" checked={f.types.includes(t)} disabled={!n && !f.types.includes(t)} onChange={() => setF({ ...f, types: toggle(f.types, t) })} />
            <span className="m-filterRow__label">{t}</span><span className="m-filterRow__price">{n}</span>
          </label>
        ); })}
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Cancellation and meals</legend>
        <label className="m-filterRow">
          <input className="m-filterRow__input" type="checkbox" checked={f.cancel} onChange={() => setF({ ...f, cancel: !f.cancel })} />
          <span className="m-filterRow__label">Free cancellation</span><span className="m-filterRow__price">{count('cancel', { cancel: true })}</span>
        </label>
        <label className="m-filterRow">
          <input className="m-filterRow__input" type="checkbox" checked={f.breakfast} onChange={() => setF({ ...f, breakfast: !f.breakfast })} />
          <span className="m-filterRow__label">Breakfast included</span><span className="m-filterRow__price">{count('breakfast', { breakfast: true })}</span>
        </label>
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Neighborhood</legend>
        {areas.map((a) => { const n = count('areas', { areas: [a] }); return (
          <label className="m-filterRow" key={a}>
            <input className="m-filterRow__input" type="checkbox" checked={f.areas.includes(a)} disabled={!n && !f.areas.includes(a)} onChange={() => setF({ ...f, areas: toggle(f.areas, a) })} />
            <span className="m-filterRow__label">{a}</span><span className="m-filterRow__price">{n}</span>
          </label>
        ); })}
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Distance from the center</legend>
        {DISTANCES.map((d) => { const n = count('dist', { dist: d }); return (
          <label className="m-filterRow" key={d}>
            <input className="m-filterRow__input" type="radio" name={`${idp}h-dist`} checked={f.dist === d} disabled={!n && f.dist !== d} onChange={() => setF({ ...f, dist: d })} />
            <span className="m-filterRow__label">Under {d} km</span><span className="m-filterRow__price">{n}</span>
          </label>
        ); })}
        {f.dist !== null && <button className="o-hfilters__clear" type="button" onClick={() => setF({ ...f, dist: null })}>Any distance</button>}
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Amenities</legend>
        {AMENITY_FILTERS.map((a) => { const n = count('amen', { amen: [...f.amen.filter((x) => x !== a.id), a.id] }); return (
          <label className="m-filterRow" key={a.id}>
            <input className="m-filterRow__input" type="checkbox" checked={f.amen.includes(a.id)} disabled={!n && !f.amen.includes(a.id)} onChange={() => setF({ ...f, amen: toggle(f.amen, a.id) })} />
            <span className="m-filterRow__label">{a.label}</span><span className="m-filterRow__price">{n}</span>
          </label>
        ); })}
      </fieldset>

      <fieldset className="o-hfilters__group">
        <legend className="o-hfilters__title">Bed type</legend>
        {BEDS.map((b) => { const n = count('beds', { beds: [b.id] }); return (
          <label className="m-filterRow" key={b.id}>
            <input className="m-filterRow__input" type="checkbox" checked={f.beds.includes(b.id)} disabled={!n && !f.beds.includes(b.id)} onChange={() => setF({ ...f, beds: toggle(f.beds, b.id) })} />
            <span className="m-filterRow__label">{b.label}</span><span className="m-filterRow__price">{n}</span>
          </label>
        ); })}
      </fieldset>
    </div>
  );

  return (
    <div className="o-stays">
      <aside className="o-stays__aside" aria-label="Map and filters">
        <div className="o-stays__miniMap">
          <StayMap center={centre} zoom={Math.max(11, zoom - 1)} pins={pins.map((p) => ({ id: p.id, lat: p.lat, lon: p.lon, label: '', name: p.name }))} toward={landBearing(search.place)} label={`Map of hotels in ${cityName}`} className="-mini" />
          <button className="a-button -small o-stays__miniBtn" type="button" aria-haspopup="dialog" onClick={() => setMapOpen(true)}><Icon name="map" size="s" /><span className="a-button__label">Show on map</span></button>
        </div>
        <div className="o-stays__asideHead">
          <h2 className="o-stays__asideTitle">Filter by</h2>
          {filtered && <button className="o-hchips__clear" type="button" onClick={clear}>Clear all</button>}
        </div>
        {renderGroups('a-')}
      </aside>
      <div className="o-stays__list">
        <div className="o-results__bar">
          <div>
            <p className="o-results__count">{filtered ? `${shown.length} of ${stays(results.length)}` : stays(results.length)}</p>
            <p className="o-results__note -tight">Prices are totals for your dates, taxes and fees included.</p>
          </div>
          <div className="o-results__tools">
            <button className="a-choice o-results__phoneOnly" type="button" aria-haspopup="dialog" onClick={() => setSortOpen(true)}><Icon name="sort" size="s" />Sort</button>
            <button className="a-choice o-results__phoneOnly" type="button" aria-haspopup="dialog" onClick={() => setMapOpen(true)}><Icon name="map" size="s" />Map</button>
            <label className="m-sortPill o-results__deskOnly">
              <span className="sr-only">Sort</span>
              <span className="m-sortPill__text" aria-hidden="true"><Icon name="sort" size="s" />Sort: {sortLabel}<Icon name="chev-down" size="s" /></span>
              <select className="m-sortPill__select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>
        <div className="o-results__chips" role="group" aria-label="Filters">
          <button className="a-choice o-hfilters__open" type="button" aria-haspopup="dialog" aria-pressed={filtered} onClick={() => setFiltersOpen(true)}><Icon name="filter" size="s" />Filters{activeCount ? ` (${activeCount})` : ''}</button>
          <button className="a-choice" type="button" aria-pressed={f.cancel} onClick={() => setF({ ...f, cancel: !f.cancel })}>Free cancellation</button>
          <button className="a-choice" type="button" aria-pressed={f.breakfast} onClick={() => setF({ ...f, breakfast: !f.breakfast })}>Breakfast included</button>
          <button className="a-choice" type="button" aria-pressed={f.score === 8.5} onClick={() => setF({ ...f, score: f.score === 8.5 ? null : 8.5 })}>Guest score 8.5+</button>
          <button className="a-choice" type="button" aria-pressed={f.stars.length === 2 && f.stars.includes(4) && f.stars.includes(5)} onClick={() => setF({ ...f, stars: f.stars.length === 2 && f.stars.includes(4) && f.stars.includes(5) ? [] : [4, 5] })}>4 stars and up</button>
        </div>
        {chips.length > 0 && (
          <div className="o-hchips" aria-label="Active filters" role="group">
            {chips.map((c) => <button key={c.key} type="button" className="o-hchips__chip" onClick={c.off} aria-label={`Remove filter: ${c.label}`}>{c.label}<Icon name="close" size="s" /></button>)}
            <button type="button" className="o-hchips__clear" onClick={clear}>Clear all</button>
          </div>
        )}
        {shown.length ? <ul className="o-stays__cards">{cards}</ul> : (
          <Notice title="No hotels match your filters" actions={<button className="a-button" type="button" onClick={clear}><span className="a-button__label">Clear filters</span></button>}>
            <p>{stays(results.length)} match your search without them.</p>
            <div className="o-hchips -inNotice">{chips.map((c) => { const back = rows.filter(({ r, h }) => passes(r, h, { ...f, ...chipReset(c.key, f) })).length; return <button key={c.key} type="button" className="o-hchips__chip" onClick={c.off}>Remove {c.label.toLowerCase()}<span className="o-hchips__n">+{back}</span></button>; })}</div>
          </Notice>
        )}
        <p className="o-results__note">A local tourist tax, where there is one, is paid at the hotel.</p>
      </div>

      <div className="o-stays__map">
        <StayMap center={centre} zoom={zoom} pins={pins} active={active} onActive={setActive} toward={landBearing(search.place)} label={`Map of hotels in ${cityName}`} className="-results" />
      </div>
      <p className="sr-only" role="status">{announce}</p>

      <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)} id="stay-filters" title="Filters" size="full" className="-filters"
        foot={<>
          <button className="a-link" type="button" onClick={clear} disabled={!filtered}>Clear all</button>
          <button className="a-button" type="button" onClick={() => setFiltersOpen(false)}><span className="a-button__label">Show {stays(shown.length)}</span></button>
        </>}>
        {renderGroups('d-')}
      </Dialog>
      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} id="map-sheet" title={`Hotels in ${cityName}`} size="full" className="-map">
        <div className="o-stays__phoneMap">
          <StayMap center={centre} zoom={zoom} pins={pins} active={active} onActive={setActive} toward={landBearing(search.place)} label={`Map of hotels in ${cityName}`} className="-phone" />
          <ul className="o-stays__strip">
            {shown.map(({ r, h }) => (
              <li key={h.id}><Link className="m-stayMini" href={`/hotels/${h.id}?${query}`}><strong>{h.name}</strong><span>{h.score.toFixed(1)} {h.scoreWord}, {h.area}</span><span>{dollars(r.total)} total, {dollars(r.nightly)} a night</span></Link></li>
            ))}
          </ul>
          <button className="a-button o-stays__listPill" type="button" onClick={() => setMapOpen(false)}><Icon name="list" size="s" /><span className="a-button__label">List</span></button>
        </div>
      </Dialog>
      <Dialog open={sortOpen} onClose={() => setSortOpen(false)} id="stay-sort" title="Sort by" size="sheet">
        <fieldset className="m-sortSheet">
          <legend className="sr-only">Sort by</legend>
          {SORTS.map((s) => (
            <label className="m-sortSheet__row" key={s.id}>
              <input className="m-filterRow__input" type="radio" name="stay-sort" checked={sort === s.id} onChange={() => { setSort(s.id); setSortOpen(false); }} />
              <span className="m-sortSheet__label">{s.label}</span>
            </label>
          ))}
        </fieldset>
      </Dialog>
    </div>
  );
}

/* what a chip's removal sets, so the empty state can say how many stays each one brings back */
function chipReset(key: string, f: Filters): Partial<Filters> {
  if (key === 'max') return { max: null };
  if (key === 'score') return { score: null };
  if (key === 'cancel') return { cancel: false };
  if (key === 'breakfast') return { breakfast: false };
  if (key === 'dist') return { dist: null };
  if (/^s\d$/.test(key)) return { stars: f.stars.filter((x) => `s${x}` !== key) };
  if ((PROPERTY_TYPES as string[]).includes(key)) return { types: f.types.filter((x) => x !== key) };
  if (AMENITY_FILTERS.some((a) => a.id === key)) return { amen: f.amen.filter((x) => x !== key) };
  if (BEDS.some((b) => b.id === key)) return { beds: f.beds.filter((x) => x !== key) };
  return { areas: f.areas.filter((x) => x !== key) };
}
