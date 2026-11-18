/* =====================================================================
   Landfall (working name, a placeholder), group H: hotel results
   Round 3 (round3-spec.md B6), at the depth of the category leaders, in
   Landfall's own system:
   - the search, the sort and every filter live in the URL
     (router.replace, so Back and shared links keep them);
   - 1025 and up: a left column with the map preview above the filters
     (counts on every option), the list at right with the applied chips,
     the result count and the sort; below 1025 the map first (the
     existing "Expand map"), then Filters, Sort and Price chips opening
     sheets whose footer says "Show 18 stays";
   - the card: lead photo (no two neighbours repeat), score badge, stars,
     type, area and distance from the center, "View on map", the room
     line, inclusion lines in --c-save, the price rule (total first),
     "See availability".
   Backend (2026-11-15): the results come from /api/hotels/search (Duffel
   Stays, or the simulated catalogue without a Duffel token) as cards that
   carry the whole hotel; nothing is looked up in the browser. Filters are
   built from the results themselves. Duffel only says whether a hotel
   has free cancellation or breakfast once its rates are fetched (on the
   hotel page), so those two filters show only when the results know.
   A supplier is searched only for real dates and a city: without dates
   (or with a property type link and no city) the page asks for them
   instead of searching invented dates.
   States: searching, results, add dates, choose a city, filters hiding
   everything, no rooms, search failed (Try again).
   ===================================================================== */
'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cityById, freeCancelUntil, leadsFor, nightsOf, roomFits, stayQuery, type StayCard, type StaySearch } from '@/lib/travel/hotels';
import { api } from '@/lib/api';
import { dayMonth, plural } from '@/lib/format';
import { stayMeta, guestsLine } from '@/lib/text';
import { MQ_DESKTOP, requestSearch, useMedia } from '@/lib/client';
import { destinationPhoto } from '@/lib/data/destinations';
import Icon from '@/components/ui/Icon';
import SupplyNote from '@/components/ui/SupplyNote';
import Photo from '@/components/ui/Photo';
import Dialog from '@/components/ui/Dialog';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { PhotoSwap, StayMap, cityName, dollars0, type Pin } from './parts';

type Row = StayCard;
type Sort = 'rec' | 'price' | 'score' | 'centre' | 'stars';
const SORTS: { id: Sort; label: string }[] = [
  { id: 'rec', label: 'Recommended' }, { id: 'price', label: 'Lowest price' }, { id: 'score', label: 'Guest score' },
  { id: 'centre', label: 'Distance from center' }, { id: 'stars', label: 'Stars (high to low)' }
];
type F = { min: number | null; max: number | null; score: number | null; stars: number[]; types: string[]; breakfast: boolean; free: boolean; areas: string[]; dist: number | null; amen: string[] };
const NONE: F = { min: null, max: null, score: null, stars: [], types: [], breakfast: false, free: false, areas: [], dist: null, amen: [] };
/* matched against each hotel's own amenity lines (catalogue names and supplier wording alike) */
const AMEN: { id: string; label: string; re: RegExp }[] = [
  { id: 'wifi', label: 'Wifi', re: /wi-?fi|internet/i }, { id: 'ac', label: 'Air conditioning', re: /air con/i }, { id: 'pool', label: 'Pool', re: /pool/i },
  { id: 'gym', label: 'Gym', re: /gym|fitness/i }, { id: 'parking', label: 'Parking', re: /parking/i }, { id: 'kitchen', label: 'Kitchen', re: /kitchen/i },
  { id: 'pets', label: 'Pets allowed', re: /pets? allowed|pet[- ]friendly/i }, { id: 'spa', label: 'Spa', re: /\bspa\b/i }, { id: 'shuttle', label: 'Airport shuttle', re: /airport shuttle|airport transfer/i },
  { id: 'access', label: 'Accessible rooms', re: /accessib|mobility|wheelchair/i }
];
const SCORES = [9, 8, 7];
/* the place-first chip: a room whose view looks over the water */
const WATER = /river|sea|canal|harbou?r|bay|lake|ocean|water|marina|beach/i;
const DISTS = [1, 3, 5];
const STARS = [2, 3, 4, 5];
const BUCKETS = 14;
const typeOf = (r: Row) => r.hotel.type ?? 'Hotel';

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);
const num = (v: string | null) => { const n = v === null ? NaN : parseFloat(v); return Number.isFinite(n) ? n : null; };
function readF(q: URLSearchParams): F {
  const [lo, hi] = (q.get('price') || '').split('-');
  return {
    min: num(lo ?? null), max: num(hi ?? null), score: num(q.get('score')), stars: list(q.get('stars')).map(Number).filter((n) => STARS.includes(n)),
    types: list(q.get('type')).filter((t) => t !== 'any' && t.length <= 40), breakfast: q.get('meals') === 'breakfast', free: q.get('free') === '1',
    areas: list(q.get('area')), dist: num(q.get('dist')), amen: list(q.get('amen')).filter((a) => AMEN.some((x) => x.id === a))
  };
}
function writeF(q: URLSearchParams, f: F) {
  const set = (k: string, v: string | null) => (v ? q.set(k, v) : q.delete(k));
  set('price', f.min !== null || f.max !== null ? `${f.min ?? ''}-${f.max ?? ''}` : null);
  set('score', f.score !== null ? String(f.score) : null);
  set('stars', f.stars.length ? f.stars.join(',') : null);
  set('type', f.types.length ? f.types.join(',') : null);
  set('meals', f.breakfast ? 'breakfast' : null);
  set('free', f.free ? '1' : null);
  set('area', f.areas.length ? f.areas.join(',') : null);
  set('dist', f.dist !== null ? String(f.dist) : null);
  set('amen', f.amen.length ? f.amen.join(',') : null);
}

function apply(rows: Row[], f: F, rooms: number): Row[] {
  return rows.filter((r) => {
    const h = r.hotel;
    const night = r.nightly / rooms / 100;
    if (f.min !== null && night < f.min) return false;
    if (f.max !== null && night > f.max) return false;
    if (f.score !== null && (h.score ?? 0) < f.score) return false;
    if (f.stars.length && !f.stars.includes(h.stars)) return false;
    if (f.types.length && !f.types.includes(typeOf(r))) return false;
    /* unknown (null) never counts as included */
    if (f.breakfast && r.breakfast !== true) return false;
    if (f.free && r.freeCancel !== true) return false;
    if (f.areas.length && !f.areas.includes(h.area)) return false;
    if (f.dist !== null && r.distance >= f.dist) return false;
    if (f.amen.length && !f.amen.every((id) => { const re = AMEN.find((x) => x.id === id)!.re; return h.amenities.some((a) => re.test(a)); })) return false;
    return true;
  });
}
const nFilters = (f: F) => (f.min !== null || f.max !== null ? 1 : 0) + (f.score !== null ? 1 : 0) + f.stars.length + f.types.length + (f.breakfast ? 1 : 0) + (f.free ? 1 : 0) + f.areas.length + (f.dist !== null ? 1 : 0) + f.amen.length;
const stays = (n: number) => plural(n, 'stay', 'stays');
const toggle = <T,>(xs: T[], x: T) => (xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x]);

/* the filter column, also the sheet's body below 1025: only the groups the results can answer */
function Filters({ rows, f, set, rooms, nights, budgetOnly }: { rows: Row[]; f: F; set: (f: F) => void; rooms: number; nights: number; budgetOnly?: boolean }) {
  const c = (patch: Partial<F>) => apply(rows, { ...f, ...patch }, rooms).length;
  const nightlies = rows.map((r) => r.nightly / rooms / 100);
  const top = Math.max(100, Math.ceil(Math.max(0, ...nightlies) / 50) * 50);
  const step = top / BUCKETS;
  const others = apply(rows, { ...f, min: null, max: null }, rooms).map((r) => r.nightly / rooms / 100);
  const hist = Array.from({ length: BUCKETS }, (_, i) => others.filter((n) => n >= i * step && (i === BUCKETS - 1 ? n <= top : n < (i + 1) * step)).length);
  const peak = Math.max(1, ...hist);
  const lo = f.min ?? 0, hi = f.max ?? top;
  const areas = [...new Set(rows.map((r) => r.hotel.area).filter(Boolean))].sort();
  const types = [...new Set(rows.map(typeOf))].sort();
  const scored = rows.some((r) => r.hotel.score);
  const starred = rows.some((r) => r.hotel.stars > 0);
  const mealsKnown = rows.some((r) => r.breakfast !== null);
  const cancelKnown = rows.some((r) => r.freeCancel !== null);
  const amen = AMEN.filter((a) => f.amen.includes(a.id) || rows.some((r) => r.hotel.amenities.some((x) => a.re.test(x))));
  const Opt = ({ checked, onChange, label, n }: { checked: boolean; onChange: () => void; label: string; n: number }) => (
    <label className={['h-fopt', n === 0 && !checked ? 'is-none' : ''].join(' ')}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="h-fopt__label">{label}</span>
      <span className="h-fopt__n t-num">{n}</span>
    </label>
  );
  return (
    <div className="h-fcol">
      <fieldset className="h-fgroup">
        <legend>Your budget, per night</legend>
        <div className="h-hist" aria-hidden="true">{hist.map((n, i) => <span key={i} className={i * step >= lo && (i + 1) * step <= hi + 0.01 ? 'is-in' : ''} style={{ height: `${Math.max(6, (n / peak) * 100)}%` }} />)}</div>
        <div className="h-budget">
          <label><span className="t-small t-muted">Min</span><input type="range" min={0} max={top} step={10} value={lo} aria-valuetext={`$${lo} per night`} onChange={(e) => { const v = Math.min(+e.target.value, hi - 10); set({ ...f, min: v > 0 ? v : null }); }} /></label>
          <label><span className="t-small t-muted">Max</span><input type="range" min={0} max={top} step={10} value={hi} aria-valuetext={`$${hi} per night`} onChange={(e) => { const v = Math.max(+e.target.value, lo + 10); set({ ...f, max: v < top ? v : null }); }} /></label>
        </div>
        <p className="h-budget__line t-num"><b>${lo} to ${hi}{f.max === null ? '+' : ''}</b> per night</p>
        <p className="h-budget__total t-num t-muted">${(lo * nights * rooms).toLocaleString('en-US')} to ${(hi * nights * rooms).toLocaleString('en-US')} total for {plural(nights, 'night', 'nights')}</p>
      </fieldset>
      {!budgetOnly && <>
      {scored && (
        <fieldset className="h-fgroup">
          <legend>Guest score</legend>
          {SCORES.map((s) => <Opt key={s} checked={f.score === s} onChange={() => set({ ...f, score: f.score === s ? null : s })} label={`${s} or more`} n={c({ score: s })} />)}
        </fieldset>
      )}
      {starred && (
        <fieldset className="h-fgroup">
          <legend>Star rating</legend>
          <div className="h-tiles">
            {STARS.map((s) => (
              <button key={s} type="button" className="h-tile" aria-pressed={f.stars.includes(s)} onClick={() => set({ ...f, stars: toggle(f.stars, s) })} aria-label={`${s} stars, ${c({ stars: [s] })} stays`}>
                <span className="t-num">{s}</span><Icon name="star" /><span className="h-tile__n t-num">{c({ stars: [s] })}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {types.length > 1 && (
        <fieldset className="h-fgroup">
          <legend>Property type</legend>
          {types.map((t) => <Opt key={t} checked={f.types.includes(t)} onChange={() => set({ ...f, types: toggle(f.types, t) })} label={t} n={c({ types: [t] })} />)}
        </fieldset>
      )}
      {mealsKnown && (
        <fieldset className="h-fgroup">
          <legend>Meals</legend>
          <Opt checked={f.breakfast} onChange={() => set({ ...f, breakfast: !f.breakfast })} label="Breakfast included" n={c({ breakfast: true })} />
        </fieldset>
      )}
      {cancelKnown && (
        <fieldset className="h-fgroup">
          <legend>Cancellation</legend>
          <Opt checked={f.free} onChange={() => set({ ...f, free: !f.free })} label="Free cancellation" n={c({ free: true })} />
        </fieldset>
      )}
      {areas.length > 1 && areas.length <= 16 && (
        <fieldset className="h-fgroup">
          <legend>Neighbourhood</legend>
          {areas.map((a) => <Opt key={a} checked={f.areas.includes(a)} onChange={() => set({ ...f, areas: toggle(f.areas, a) })} label={a} n={c({ areas: [a] })} />)}
        </fieldset>
      )}
      <fieldset className="h-fgroup">
        <legend>Distance from center</legend>
        {DISTS.map((d) => <Opt key={d} checked={f.dist === d} onChange={() => set({ ...f, dist: f.dist === d ? null : d })} label={`Under ${d} km`} n={c({ dist: d })} />)}
      </fieldset>
      {amen.length > 0 && (
        <fieldset className="h-fgroup">
          <legend>Amenities</legend>
          {amen.map((a) => <Opt key={a.id} checked={f.amen.includes(a.id)} onChange={() => set({ ...f, amen: toggle(f.amen, a.id) })} label={a.label} n={c({ amen: [...f.amen.filter((x) => x !== a.id), a.id] })} />)}
        </fieldset>
      )}
      </>}
    </div>
  );
}

/* applied chips: each one removes itself */
function applied(f: F): { key: string; label: string; off: (f: F) => F }[] {
  const out: { key: string; label: string; off: (f: F) => F }[] = [];
  if (f.min !== null || f.max !== null) out.push({ key: 'price', label: `$${f.min ?? 0} to $${f.max ?? 'any'} per night`, off: (x) => ({ ...x, min: null, max: null }) });
  if (f.score !== null) out.push({ key: 'score', label: `Guest score ${f.score} or more`, off: (x) => ({ ...x, score: null }) });
  f.stars.forEach((s) => out.push({ key: `s${s}`, label: `${s} stars`, off: (x) => ({ ...x, stars: x.stars.filter((y) => y !== s) }) }));
  f.types.forEach((t) => out.push({ key: `t${t}`, label: t, off: (x) => ({ ...x, types: x.types.filter((y) => y !== t) }) }));
  if (f.breakfast) out.push({ key: 'b', label: 'Breakfast included', off: (x) => ({ ...x, breakfast: false }) });
  if (f.free) out.push({ key: 'f', label: 'Free cancellation', off: (x) => ({ ...x, free: false }) });
  f.areas.forEach((a) => out.push({ key: `a${a}`, label: a, off: (x) => ({ ...x, areas: x.areas.filter((y) => y !== a) }) }));
  if (f.dist !== null) out.push({ key: 'd', label: `Under ${f.dist} km from the center`, off: (x) => ({ ...x, dist: null }) });
  f.amen.forEach((id) => out.push({ key: `m${id}`, label: AMEN.find((a) => a.id === id)!.label, off: (x) => ({ ...x, amen: x.amen.filter((y) => y !== id) }) }));
  return out;
}

/* the hotel page link: the stay, and Duffel's search result id so the page fetches every rate without searching again */
const hotelLink = (h: Row['hotel'], query: string) => {
  const q = new URLSearchParams(query);
  if (query && h.searchResultId) q.set('srr', h.searchResultId);
  const s = q.toString();
  return `/hotels/${encodeURIComponent(h.id)}${s ? `?${s}` : ''}`;
};

type State = 'idle' | 'searching' | 'done' | 'failed';

export default function Results({ search, dated, typeOnly }: { search: StaySearch; dated: boolean; typeOnly?: string }) {
  const desktop = useMedia(MQ_DESKTOP, true);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const anyCity = !search.place;
  const city = anyCity ? '' : cityName(search.place);
  const query = dated ? stayQuery(search) : '';
  const nights = nightsOf(search);
  /* a supplier is searched only for real dates in a city */
  const canSearch = dated && !anyCity;
  const [state, setState] = useState<State>(canSearch ? 'searching' : 'idle');
  const [slow, setSlow] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const f = useMemo(() => readF(new URLSearchParams(params.toString())), [params]);
  const sortQ = params.get('sort') as Sort | null;
  const sort: Sort = SORTS.some((s) => s.id === sortQ) ? sortQ! : 'rec';
  const [draft, setDraft] = useState<F>(NONE);
  const [sheet, setSheet] = useState<'filters' | 'sort' | 'price' | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [mapBig, setMapBig] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const push = useCallback((nf: F, ns: Sort = sort) => {
    const q = new URLSearchParams(params.toString());
    writeF(q, nf);
    if (ns === 'rec') q.delete('sort'); else q.set('sort', ns);
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  }, [params, pathname, router, sort]);
  const setSort = (s: Sort) => push(f, s);

  /* filters and sort change the URL, so the page re-renders with a new search object: key the fetch by the stay itself */
  const stayKey = stayQuery(search);
  const run = useCallback(async (signal: AbortSignal) => {
    setState('searching'); setSlow(false);
    const t = window.setTimeout(() => setSlow(true), 5000);
    const r = await api<{ results: Row[] }>(`/api/hotels/search?${stayKey}`, { signal });
    window.clearTimeout(t);
    if (r.error?.code === 'aborted') return;
    if (r.error) { setState('failed'); return; }
    setRows(r.data.results);
    setState('done');
  }, [stayKey]);
  useEffect(() => {
    if (!canSearch) { setState('idle'); setRows([]); return; }
    const ctl = new AbortController();
    void run(ctl.signal);
    return () => ctl.abort();
  }, [run, attempt, canSearch]);

  const shown = useMemo(() => {
    const l = apply(rows, f, search.rooms);
    const rec = (r: Row) => (r.hotel.score ?? 7.5) * 10 - r.distance * 1.5 + (r.hotel.showcase ? 4 : 0);
    return [...l].sort((a, b) => sort === 'price' ? a.total - b.total : sort === 'score' ? (b.hotel.score ?? 0) - (a.hotel.score ?? 0) || a.total - b.total
      : sort === 'centre' ? a.distance - b.distance : sort === 'stars' ? b.hotel.stars - a.hotel.stars || a.total - b.total : rec(b) - rec(a));
  }, [rows, f, sort, search.rooms]);
  const leads = useMemo(() => leadsFor(shown.map((r) => r.hotel)), [shown]);
  const chips = applied(f);
  const draftCount = apply(rows, draft, search.rooms).length;
  const sortLabel = SORTS.find((s) => s.id === sort)!.label;
  const title = anyCity ? (typeOnly ? `${typeOnly} stays` : 'Stays') : `Stays in ${city}`;
  const place = cityById(search.place);
  const mapped = shown.filter((r) => r.hotel.lat || r.hotel.lon);
  const centre: [number, number] = place ? [place.lat, place.lng] : mapped[0] ? [mapped[0].hotel.lat, mapped[0].hotel.lon] : [38.71, -9.14];
  const showMap = !anyCity;
  const hasRows = state === 'done' && rows.length > 0;

  const pins: Pin[] = mapped.map((r) => ({
    id: r.hotel.id, lat: r.hotel.lat, lon: r.hotel.lon,
    label: dollars0(r.total),
    name: `${r.hotel.name}, ${dollars0(r.total)} total for ${plural(nights, 'night', 'nights')}`,
    href: hotelLink(r.hotel, query)
  }));
  const photo = destinationPhoto(city || 'Lisbon');
  const viewOnMap = (id: string) => {
    setActive(id);
    if (desktop) document.querySelector('.h-results__fmap')?.scrollIntoView({ block: 'start', behavior: 'auto' });
    else { setMapBig(true); window.scrollTo({ top: 0 }); }
  };

  const panel = (t: string, body: string, actions: React.ReactNode) => (
    <div className="m-card h-empty">
      <Photo name={photo?.image ?? 'pages/quay-colunas'} alt="" sizes="(min-width: 1025px) 680px, 100vw" className="h-empty__photo" fx={50} fy={55} />
      <div className="h-empty__text">
        <h2 className="t-display t-h2">{t}</h2>
        <p className="t-lead">{body}</p>
        <div className="h-empty__actions">{actions}</div>
      </div>
    </div>
  );

  return (
    <div className={['h-results -r3', mapBig ? 'is-mapbig' : '', desktop ? '-desk' : ''].join(' ')}>
      {desktop && (
        <aside className="h-results__fside" aria-label={hasRows ? 'Map and filters' : 'Map'}>
          {showMap && (
            <div className="h-results__fmap">
              <StayMap pins={state === 'done' ? pins : []} centre={centre} active={active} onActive={setActive} alt={`Map of ${city} with the stays marked`} className="h-results__minimap" />
            </div>
          )}
          {hasRows && <>
            <div className="h-fhead"><h2 className="t-title">Filter by</h2>{chips.length > 0 && <button type="button" className="a-textbtn" onClick={() => push(NONE)}>Clear all</button>}</div>
            <Filters rows={rows} f={f} set={(x) => push(x)} rooms={search.rooms} nights={nights} />
          </>}
        </aside>
      )}
      <div className="h-results__list">
        <header className="h-results__head">
          <h1 className="t-display t-h1">{title}</h1>
          <p className="h-results__meta">{dated ? stayMeta(search) : guestsLine(search)}</p>
          <SupplyNote kind="hotels" />
        </header>

        {!desktop && showMap && (
          <div className="h-results__mapwrap">
            <StayMap pins={state === 'done' ? pins : []} centre={centre} active={active} onActive={setActive} alt={`Map of ${city} with the stays marked`} className="h-results__map -phone" padBottom={48} />
            <button type="button" className="a-chip h-results__mapchip" aria-pressed={mapBig} onClick={() => setMapBig((b) => !b)}><Icon name={mapBig ? 'grid' : 'expand'} />{mapBig ? 'Show list' : 'Expand map'}</button>
          </div>
        )}

        {!desktop && hasRows && (
          <div className="h-results__tools">
            <div className="h-results__chips">
              <button type="button" className="a-chip" aria-haspopup="dialog" onClick={() => { setDraft(f); setSheet('filters'); }}><Icon name="filter" />{nFilters(f) ? `Filters, ${nFilters(f)}` : 'Filters'}</button>
              <button type="button" className="a-chip" aria-haspopup="dialog" onClick={() => setSheet('sort')}><Icon name="sort" />Sort: {sortLabel}</button>
              <button type="button" className="a-chip" aria-haspopup="dialog" aria-pressed={f.min !== null || f.max !== null} onClick={() => { setDraft(f); setSheet('price'); }}>Price<Icon name="chev-d" /></button>
            </div>
          </div>
        )}

        {chips.length > 0 && hasRows && (
          <div className="h-applied" role="group" aria-label="Applied filters">
            {chips.map((x) => <button key={x.key} type="button" className="a-chip -on" onClick={() => push(x.off(f))} aria-label={`Remove ${x.label}`}>{x.label}<Icon name="close" /></button>)}
            <button type="button" className="a-textbtn" onClick={() => push(NONE)}>Clear all</button>
          </div>
        )}

        <p className="sr-only" role="status" aria-live="polite">
          {state === 'searching' ? (slow ? 'Still looking. Some hotels take a few seconds to answer.' : 'Checking rooms and prices with hotels') : state === 'done' ? `${stays(shown.length)} found` : ''}
        </p>

        {state === 'idle' && (anyCity
          ? panel('Choose a destination', `Hotels answer with rooms and prices for one city and exact dates. Pick where you’re going to see ${typeOnly ? `${typeOnly.toLowerCase()} stays` : 'stays'} and their prices.`,
            <Button onClick={() => requestSearch('hotels', 'dest')} arrow>Choose a destination</Button>)
          : panel(`Add dates to see stays in ${city}`, 'Hotels answer with rooms and prices for exact dates. Add yours to see every stay with its total.',
            <Button onClick={() => requestSearch('hotels', 'dates')} arrow>Add dates for prices</Button>))}

        {state === 'searching' && (
          <div className="h-results__cards" aria-hidden="true">
            <p className="h-results__status">{slow ? 'Still looking. Some hotels take a few seconds to answer.' : 'Checking rooms and prices with hotels'}</p>
            {[0, 1, 2].map((k) => <div key={k} className="m-card h-skel"><span className="a-skel h-skel__photo" /><span className="h-skel__lines"><span className="a-skel" /><span className="a-skel" /><span className="a-skel" /></span></div>)}
          </div>
        )}

        {state === 'failed' && panel('We couldn’t reach the hotels just now', 'Your search didn’t finish. Try again in a moment.',
          <Button onClick={() => setAttempt((a) => a + 1)} arrow>Try again</Button>)}

        {state === 'done' && rows.length === 0 && panel(`No rooms ${city ? `in ${city} ` : ''}for these dates`, `Every place we checked is full or doesn’t fit ${guestsLine(search).replace(/, (\d+ rooms?)$/, ' in $1')}. Try other dates or another room setup.`,
          <Button onClick={() => requestSearch('hotels', 'dates')}>Change dates</Button>)}

        {hasRows && (
          <>
            <div className="h-results__countrow">
              <p className="h-results__count t-num">{stays(shown.length)}{shown.length !== rows.length ? ` of ${rows.length}` : ''}</p>
              {desktop && (
                <label className="h-sort"><span>Sort</span>
                  <span className="h-sort__box"><select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>{SORTS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select><Icon name="chev-d" /></span>
                </label>
              )}
            </div>
            <p className="h-results__note t-small t-muted">A local tourist tax, where there is one, is paid at the hotel.</p>
            {shown.length === 0 ? (
              <div className="m-card h-empty -plain">
                <div className="h-empty__text">
                  <h2 className="t-display t-h2">No stays match</h2>
                  <p className="t-lead">{stays(rows.length)} {rows.length === 1 ? 'matches' : 'match'} your search without these filters.</p>
                  <div className="h-empty__actions">
                    <Button onClick={() => push(NONE)}>Clear all filters</Button>
                    {chips.length > 1 && <Button variant="ghost" onClick={() => push(chips[chips.length - 1].off(f))}>Remove {chips[chips.length - 1].label}</Button>}
                  </div>
                </div>
              </div>
            ) : (
              <ul className="h-results__cards">
                {shown.map((r, i) => <li key={r.hotel.id}><ResultCard r={r} lead={leads[i]} search={search} query={query} active={active === r.hotel.id} onHover={setActive} onMap={showMap && (r.hotel.lat || r.hotel.lon) ? viewOnMap : undefined} /></li>)}
              </ul>
            )}
          </>
        )}
      </div>

      <Dialog open={sheet === 'price'} onClose={() => setSheet(null)} title="Price" sheet
        footer={<><button type="button" className="a-textbtn" onClick={() => setDraft((d) => ({ ...d, min: null, max: null }))}>Clear</button><Button onClick={() => { push(draft); setSheet(null); }} disabled={draftCount === 0}>{draftCount ? `Show ${stays(draftCount)}` : 'No stays match'}</Button></>}>
        <Filters rows={rows} f={draft} set={setDraft} rooms={search.rooms} nights={nights} budgetOnly />
      </Dialog>

      <Dialog open={sheet === 'filters'} onClose={() => setSheet(null)} title="Filters" sheet
        footer={<><button type="button" className="a-textbtn" onClick={() => setDraft(NONE)}>Clear all</button><Button onClick={() => { push(draft); setSheet(null); }} disabled={draftCount === 0}>{draftCount ? `Show ${stays(draftCount)}` : 'No stays match'}</Button></>}>
        <Filters rows={rows} f={draft} set={setDraft} rooms={search.rooms} nights={nights} />
      </Dialog>

      <Dialog open={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort by" sheet>
        <div className="m-opts h-sortopts" role="radiogroup" aria-label="Sort by">
          {SORTS.map((s) => (
            <label key={s.id} className="m-opt"><input type="radio" name="hotel-sort" checked={sort === s.id} onChange={() => { setSort(s.id); setSheet(null); }} />{s.label}</label>
          ))}
        </div>
      </Dialog>
    </div>
  );
}

function ResultCard({ r, lead, search, query, active, onHover, onMap }: {
  r: Row; lead: number; search: StaySearch; query: string; active: boolean;
  onHover: (id: string | null) => void; onMap?: (id: string) => void;
}) {
  const h = r.hotel;
  const href = hotelLink(h, query);
  /* the cheapest room that fits, when the results carry rooms (Duffel's results don't until the hotel page) */
  const room = h.rooms.filter((x) => roomFits(x, search)).sort((a, b) => a.nightly - b.nightly)[0];
  const order = h.photos.length ? [lead, ...h.photos.map((_, k) => k).filter((k) => k !== lead)] : [];
  const photos = order.map((k, i) => ({ name: h.photos[k].name, alt: `${h.name}, photo ${i + 1} of ${h.photos.length}` }));
  const n = nightsOf(search);
  return (
    <article className={['m-card h-rcard', active ? 'is-active' : ''].join(' ')} onMouseEnter={() => onHover(h.id)} onMouseLeave={() => onHover(null)}>
      <PhotoSwap photos={photos} label={`Photos of ${h.name}`} sizes="(min-width: 1025px) 240px, (min-width: 641px) 40vw, 100vw" className="h-rcard__photo" />
      <div className="h-rcard__body">
        <div className="h-rcard__top">
          <div>
            <h2 className="h-rcard__name"><Link prefetch={false} href={href} className="h-card__link">{h.name}</Link></h2>
            <p className="h-rcard__kind">
              {h.stars > 0 && <span className="h-stars" role="img" aria-label={`${h.stars}-star`}>{Array.from({ length: h.stars }, (_, i) => <Icon key={i} name="star" />)}</span>}
              <span>{h.type ?? 'Hotel'}</span>
              {h.rooms.some((x) => x.view && WATER.test(x.view)) && <span className="h-rcard__water">Water view</span>}
            </p>
          </div>
          {h.score ? <ScoreBadge score={h.score} count={h.reviews} className="h-rcard__score" /> : null}
        </div>
        <p className="h-rcard__where t-small">
          {h.area && <span>{h.area}</span>}
          {(h.lat || h.lon) ? <span className="t-num">{r.distance.toFixed(1)} km from the center</span> : null}
          {onMap && <button type="button" className="a-textbtn" onClick={() => onMap(h.id)}>View on map</button>}
        </p>
        <div className="h-rcard__row">
          <div className="h-rcard__room">
            {room && <p className="h-rcard__roomline"><b>{room.name}</b><span className="t-muted">{room.beds}</span></p>}
            {r.freeCancel === true && <p className="h-rcard__incl"><Icon name="tick" />Free cancellation until {dayMonth(freeCancelUntil(search))}</p>}
            {r.breakfast === true && <p className="h-rcard__incl"><Icon name="tick" />Breakfast included</p>}
          </div>
          <div className="h-rcard__price">
            <span className="h-rcard__total t-num">{dollars0(r.total)} total</span>
            <span className="t-small t-muted t-num">{dollars0(r.nightly)} per night, {plural(n, 'night', 'nights')}, {plural(search.adults, 'adult', 'adults')}</span>
            <span className="t-small t-muted">taxes and fees included</span>
            <ButtonLink href={href} className="h-rcard__go" aria-label={`See availability at ${h.name}`}>See availability</ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
