/* =====================================================================
   Landfall (working name, a placeholder): flight results
   Round 3 (round3-spec.md B1). The title row, the date and price strip
   (7 days, arrows move a week, each cell reruns the search; each cell is
   the lowest total for the whole party, named in the line under it), the three
   sort summary tabs (Best, Cheapest, Fastest, the landfall line under the
   chosen one) with More sorts, the 280px filter column (Stops, Bags,
   Fare options, Airlines, Departure and Arrival time tiles, Flight
   duration and Price with histograms, Layover duration, Layover
   airports; every option with its count and lowest price), the Applied
   chips, the count line and the result cards. Every filter and sort
   lives in the URL (history.replaceState), so Back and a shared link
   keep them. Below 1025: chips Filters (n), Sort, Stops, Bags open
   sheets with a "Show 23 flights" footer.
   A flight's price is its owner's cheapest family that meets the bag and
   fare filters, so "Checked bag included" shows the fare that has one.
   States: searching, results, filters hiding everything, no flights on
   the dates, search failed, prices expired after 30 minutes.
   Backend (2026-11-15): the search is GET /api/flights/search (Duffel, or
   the simulated catalogue without a Duffel token); each offer carries its
   own fares (offer.fares) and the names of its airports and airlines
   (dict, registered before rendering). The date strip shows dates only
   (pricing seven dates would mean seven supplier searches per visit).
   ===================================================================== */
'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { airlineName, cityOf, offerTotals, registerDict, searchQuery, travelers, type Dict, type Fare, type FareId, type FlightSearch, type Layover, type Offer, type Slice } from '@/lib/travel/flights';
import { api } from '@/lib/api';
import { addIsoDays, clock, dayShort, dollars, duration, money } from '@/lib/format';
import { cardSpoken, flightMeta, routeTitle, stopsLower, travelersWord } from '@/lib/text';
import { MQ_DESKTOP, requestSearch, useMedia } from '@/lib/client';
import { destinationPhoto } from '@/lib/data/destinations';
import { SITE } from '@/lib/site';
import Icon from '@/components/ui/Icon';
import SupplyNote from '@/components/ui/SupplyNote';
import Price from '@/components/ui/Price';
import Photo from '@/components/ui/Photo';
import Dialog from '@/components/ui/Dialog';
import LandfallLine from '@/components/ui/LandfallLine';
import { Button, ButtonLink } from '@/components/ui/Button';
import type { IconName } from '@/components/chrome/Sprite';
import { AirlineTile, Breakdown, Timeline, cellKind, fareHas, flightBreakdown, type Need } from './parts';
import { detailsUrl, perTraveler } from './trip';

/* ---------- sorts ---------- */
type Sort = 'best' | 'cheapest' | 'fastest' | 'dep-early' | 'dep-late' | 'arr-early' | 'lay-short';
const TABS: { id: Sort; label: string }[] = [{ id: 'best', label: 'Best' }, { id: 'cheapest', label: 'Cheapest' }, { id: 'fastest', label: 'Fastest' }];
const MORE: { id: Sort; label: string }[] = [
  { id: 'dep-early', label: 'Earliest departure' }, { id: 'dep-late', label: 'Latest departure' },
  { id: 'arr-early', label: 'Earliest arrival' }, { id: 'lay-short', label: 'Shortest layover' }
];
const SORT_LABEL = (s: Sort) => [...TABS, ...MORE].find((x) => x.id === s)!.label;
const isSort = (v: unknown): v is Sort => typeof v === 'string' && [...TABS, ...MORE].some((x) => x.id === v);

/* ---------- filter options ---------- */
type Slot = 'early' | 'morning' | 'afternoon' | 'evening';
const SLOTS: { id: Slot; label: string; range: string; from: number; to: number; icon: IconName }[] = [
  { id: 'early', label: 'Early morning', range: '00:00 to 04:59', from: 0, to: 299, icon: 'moon' },
  { id: 'morning', label: 'Morning', range: '05:00 to 11:59', from: 300, to: 719, icon: 'sunrise' },
  { id: 'afternoon', label: 'Afternoon', range: '12:00 to 17:59', from: 720, to: 1079, icon: 'sun' },
  { id: 'evening', label: 'Evening', range: '18:00 to 23:59', from: 1080, to: 1439, icon: 'sunset' }
];
const STOPS: { id: number; label: string; chip: string }[] = [
  { id: 9, label: 'Any', chip: '' }, { id: 0, label: 'Nonstop only', chip: 'Nonstop only' },
  { id: 1, label: '1 stop or fewer', chip: '1 stop or fewer' }, { id: 2, label: '2 stops or fewer', chip: '2 stops or fewer' }
];
const BAGS: { id: Need; label: string }[] = [{ id: 'cabin', label: 'Cabin bag included' }, { id: 'checked', label: 'Checked bag included' }];
const OPTS: { id: Need; label: string }[] = [{ id: 'change', label: 'Changeable' }, { id: 'refund', label: 'Refundable' }, { id: 'seat', label: 'Seat choice included' }];
const NEED_LABEL = (n: Need) => [...BAGS, ...OPTS].find((x) => x.id === n)!.label;
const PAGE = 20;

type TimeKey = 'dOut' | 'aOut' | 'dRet' | 'aRet';
type Filters = { stops: number; needs: Need[]; air: string[] | null; dOut: Slot[]; aOut: Slot[]; dRet: Slot[]; aRet: Slot[]; dur: number | null; lay: number | null; lap: string[]; price: number | null };
type Group = keyof Filters;
const NO_FILTERS: Filters = { stops: 9, needs: [], air: null, dOut: [], aOut: [], dRet: [], aRet: [], dur: null, lay: null, lap: [], price: null };

/* ---------- the URL (every filter and sort, so Back and a shared link keep them) ---------- */
/* keys: sort, stops, need, air, dout, aout, dret, aret, dur, lay, lap, price (app/flights/page.tsx reads the same list) */
export type ResultsInit = Record<string, string | undefined>;
const list = (v?: string) => (v ? v.split(',').filter(Boolean) : []);
const num = (v?: string) => (v && /^\d+$/.test(v) ? +v : null);
const slotList = (v?: string) => list(v).filter((x): x is Slot => SLOTS.some((s) => s.id === x));
function fromUrl(p: ResultsInit): { f: Filters; sort: Sort } {
  const stops = num(p.stops);
  return {
    sort: isSort(p.sort) ? p.sort : 'best',
    f: {
      stops: stops !== null && [0, 1, 2].includes(stops) ? stops : 9,
      needs: list(p.need).filter((x): x is Need => [...BAGS, ...OPTS].some((o) => o.id === x)),
      air: p.air ? list(p.air).map((x) => x.toUpperCase()) : null,
      dOut: slotList(p.dout), aOut: slotList(p.aout), dRet: slotList(p.dret), aRet: slotList(p.aret),
      dur: num(p.dur), lay: num(p.lay), lap: list(p.lap).map((x) => x.toUpperCase()), price: num(p.price) !== null ? num(p.price)! * 100 : null
    }
  };
}
function toUrl(f: Filters, sort: Sort): string {
  const u = new URLSearchParams();
  if (sort !== 'best') u.set('sort', sort);
  if (f.stops !== 9) u.set('stops', String(f.stops));
  if (f.needs.length) u.set('need', f.needs.join(','));
  if (f.air) u.set('air', f.air.join(','));
  if (f.dOut.length) u.set('dout', f.dOut.join(','));
  if (f.aOut.length) u.set('aout', f.aOut.join(','));
  if (f.dRet.length) u.set('dret', f.dRet.join(','));
  if (f.aRet.length) u.set('aret', f.aRet.join(','));
  if (f.dur !== null) u.set('dur', String(f.dur));
  if (f.lay !== null) u.set('lay', String(f.lay));
  if (f.lap.length) u.set('lap', f.lap.join(','));
  if (f.price !== null) u.set('price', String(Math.round(f.price / 100)));
  return u.toString().replace(/%2C/g, ',');
}

/* ---------- rows ---------- */
type Base = { offer: Offer; fares: Fare[]; maxStops: number; longest: number; travel: number; lays: Layover[]; layMax: number };
type Row = Base & { fare: FareId; fareName: string; fareObj: Fare; total: number };

function priceRow(b: Base, needs: Need[]): Row | null {
  for (const fa of b.fares) {
    if (needs.every((n) => fareHas(fa, n))) return { ...b, fare: fa.id, fareName: fa.name, fareObj: fa, total: offerTotals(b.offer, fa.id).total };
  }
  return null;
}
const minOfDay = (m: number) => ((m % 1440) + 1440) % 1440;
const inSlots = (min: number, slots: Slot[]) => !slots.length || slots.some((id) => { const s = SLOTS.find((x) => x.id === id)!; const m = minOfDay(min); return m >= s.from && m <= s.to; });

function passes(r: Row, f: Filters, skip?: Group): boolean {
  const out = r.offer.slices[0], back = r.offer.slices[1];
  return (skip === 'stops' || r.maxStops <= f.stops) &&
    (skip === 'air' || !f.air || f.air.includes(r.offer.owner)) &&
    (skip === 'dOut' || inSlots(out.dep, f.dOut)) &&
    (skip === 'aOut' || inSlots(out.arr, f.aOut)) &&
    (skip === 'dRet' || !back || inSlots(back.dep, f.dRet)) &&
    (skip === 'aRet' || !back || inSlots(back.arr, f.aRet)) &&
    (skip === 'dur' || f.dur === null || r.longest <= f.dur) &&
    (skip === 'lay' || f.lay === null || r.layMax <= f.lay) &&
    (skip === 'lap' || !f.lap.length || r.lays.every((l) => f.lap.includes(l.at))) &&
    (skip === 'price' || f.price === null || r.total <= f.price);
}
function run(bases: Base[], f: Filters, skip?: Group): Row[] {
  const needs = skip === 'needs' ? [] : f.needs;
  const out: Row[] = [];
  for (const b of bases) { const r = priceRow(b, needs); if (r && passes(r, f, skip)) out.push(r); }
  return out;
}
function activeCount(f: Filters): number {
  return [f.stops !== 9, f.needs.length > 0, !!f.air, f.dOut.length + f.aOut.length + f.dRet.length + f.aRet.length > 0, f.dur !== null, f.lay !== null, f.lap.length > 0, f.price !== null].filter(Boolean).length;
}
function bestScore(list: Row[]) {
  const minT = Math.min(...list.map((r) => r.total)), minD = Math.min(...list.map((r) => r.travel));
  return (r: Row) => r.total / minT + 0.6 * (r.travel / minD) + 0.12 * r.maxStops;
}
function sortRows(rows: Row[], sort: Sort): Row[] {
  const l = [...rows];
  if (!l.length) return l;
  if (sort === 'cheapest') return l.sort((a, b) => a.total - b.total || a.travel - b.travel);
  if (sort === 'fastest') return l.sort((a, b) => a.travel - b.travel || a.total - b.total);
  if (sort === 'dep-early') return l.sort((a, b) => a.offer.slices[0].dep - b.offer.slices[0].dep || a.total - b.total);
  if (sort === 'dep-late') return l.sort((a, b) => b.offer.slices[0].dep - a.offer.slices[0].dep || a.total - b.total);
  if (sort === 'arr-early') return l.sort((a, b) => a.offer.slices[0].arr - b.offer.slices[0].arr || a.total - b.total);
  if (sort === 'lay-short') return l.sort((a, b) => a.lays.reduce((s, x) => s + x.dur, 0) - b.lays.reduce((s, x) => s + x.dur, 0) || a.total - b.total);
  const score = bestScore(l);
  return l.sort((a, b) => score(a) - score(b));
}
const lowest = (l: Row[]) => (l.length ? Math.min(...l.map((r) => r.total)) : null);

type State = { status: 'loading' } | { status: 'failed' } | { status: 'ok'; offers: Offer[]; searchedAt: number; expiresAt: number };
type SearchData = { searchId: string; searchedAt: number; expiresAt: number; supplier: string; offers: Offer[]; dict: Dict };
export type DateCell = { date: string; lowest: number | null };

export default function Results({ search, init, dates, today }: { search: FlightSearch; init: ResultsInit; dates: DateCell[]; today: string }) {
  const router = useRouter();
  const desktop = useMedia(MQ_DESKTOP, true);
  const q = searchQuery(search);
  const first = useMemo(() => fromUrl(init), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [state, setState] = useState<State>({ status: 'loading' });
  const [still, setStill] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [sort, setSortState] = useState<Sort>(first.sort);
  const [f, setF] = useState<Filters>(first.f);
  const [shown, setShown] = useState(PAGE);
  const [more, setMore] = useState('');
  const [sheet, setSheet] = useState<null | 'filters' | 'sort' | 'stops' | 'bags'>(null);
  const [bd, setBd] = useState<Row | null>(null);
  const [expired, setExpired] = useState(false);
  const [found, setFound] = useState('');
  const lastQ = useRef(q);
  const from = cityOf(search.from), to = cityOf(search.to);
  const n = travelers(search);

  /* the search itself; a new route or date clears the filters */
  useEffect(() => {
    let live = true;
    setState({ status: 'loading' }); setStill(false); setFound(''); setExpired(false); setShown(PAGE); setMore('');
    if (lastQ.current !== q) { lastQ.current = q; setF(NO_FILTERS); setSortState('best'); }
    document.title = `Searching flights | ${SITE.name}`;
    const slow = window.setTimeout(() => live && setStill(true), 5000);
    const ctl = new AbortController();
    api<SearchData>(`/api/flights/search?${q}`, { signal: ctl.signal }).then((r) => {
      window.clearTimeout(slow);
      if (!live) return;
      /* supplier unavailable, rate limited or offline: the same "couldn't reach the airlines" state */
      if (!r.data) { setState({ status: 'failed' }); setFound('We couldn’t reach the airlines just now'); document.title = `Flights from ${from} to ${to} | ${SITE.name}`; return; }
      registerDict(r.data.dict);
      setState({ status: 'ok', offers: r.data.offers, searchedAt: r.data.searchedAt, expiresAt: r.data.expiresAt });
      setFound(r.data.offers.length ? `${r.data.offers.length} flights found` : 'No flights on these dates');
      document.title = `Flights from ${cityOf(search.from)} to ${cityOf(search.to)} | ${SITE.name}`;
    });
    return () => { live = false; ctl.abort(); window.clearTimeout(slow); };
  }, [q, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  /* on Back, Next can hand over the props of the bare search: the address bar is the truth */
  useEffect(() => {
    const u = fromUrl(Object.fromEntries(new URLSearchParams(window.location.search)));
    if (toUrl(u.f, u.sort) !== toUrl(f, sort)) { setF(u.f); setSortState(u.sort); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* filters and sort into the URL */
  useEffect(() => {
    const extra = toUrl(f, sort);
    const next = `/flights?${q}${extra ? `&${extra}` : ''}`;
    if (window.location.pathname + window.location.search !== next) window.history.replaceState(null, '', next);
  }, [f, sort, q]);

  /* prices expire 30 minutes after the search */
  useEffect(() => {
    if (state.status !== 'ok' || !state.offers.length) return;
    const left = state.expiresAt - Date.now();
    const t = window.setTimeout(() => setExpired(true), Math.max(0, left));
    return () => window.clearTimeout(t);
  }, [state]);

  const bases: Base[] = useMemo(() => state.status !== 'ok' ? [] : state.offers.map((o) => {
    const lays = o.slices.flatMap((s) => s.layovers);
    return {
      offer: o, fares: o.fares, maxStops: Math.max(...o.slices.map((s) => s.stops)),
      longest: Math.max(...o.slices.map((s) => s.dur)), travel: o.slices.reduce((a, s) => a + s.dur, 0),
      lays, layMax: lays.length ? Math.max(...lays.map((l) => l.dur)) : 0
    };
  }), [state]);

  const filtered = useMemo(() => sortRows(run(bases, f), sort), [bases, f, sort]);
  const visible = filtered.slice(0, shown);
  const active = activeCount(f);
  const total = bases.length;
  const tops = useMemo(() => ({ best: sortRows(filtered, 'best')[0], cheapest: sortRows(filtered, 'cheapest')[0], fastest: sortRows(filtered, 'fastest')[0] }), [filtered]);

  const setFilter = useCallback((patch: Partial<Filters>) => { setF((x) => ({ ...x, ...patch })); setShown(PAGE); setMore(''); }, []);
  const setSort = (s: Sort) => { setSortState(s); setShown(PAGE); };
  const clearAll = () => { setF(NO_FILTERS); setShown(PAGE); setMore(''); };

  function showMore() {
    const next = Math.min(filtered.length, shown + PAGE);
    const firstNew = shown;
    setShown(next);
    setMore(`Showing ${next} of ${filtered.length} flights`);
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-row="${firstNew}"] .f-card__select`)?.focus());
  }

  function nearby() {
    const d = addIsoDays(search.depart, -1);
    const depart = d > today ? d : addIsoDays(search.depart, 1);
    const ret = search.ret ? addIsoDays(search.ret, 1) : null;
    router.push(`/flights?${searchQuery({ ...search, depart, ret })}`);
  }

  const meta = flightMeta(search.depart, search.ret, search, search.cabin);
  const showLabel = filtered.length ? `Show ${filtered.length} flights` : 'No flights match';
  const photo = destinationPhoto(search.to);
  const ok = state.status === 'ok' && total > 0;
  const groups = (only?: Group[]) => ok && (
    <FilterGroups bases={bases} f={f} setFilter={setFilter} search={search} idBase={sheet ? `sheet-${sheet}` : 'col'} only={only} />
  );
  const chips = appliedChips(f, search, setFilter);
  const tags = new Map<string, string[]>();
  if (filtered.length > 1) {
    const add = (r: Row | undefined, t: string) => { if (r) tags.set(r.offer.id, [...(tags.get(r.offer.id) ?? []), t]); };
    add(tops.best, 'Best'); add(tops.cheapest, 'Cheapest'); add(tops.fastest, 'Fastest');
  }

  return (
    <div className="f-results l-container">
      <header className="f-results__head -r3">
        <div className="f-results__title">
          <h1 className="t-display t-h1">{routeTitle(search.from, search.to)}</h1>
          <p className="t-body t-muted t-num">{meta}</p>
          <SupplyNote kind="flights" />
        </div>
      </header>

      <DateStrip search={search} dates={dates} today={today} />

      <p className="sr-only" aria-live="polite">{state.status === 'loading' ? '' : found}</p>

      {state.status === 'loading' && (
        <div className="f-results__body -loading">
          <div className="f-status" role="status">
            <p className="t-body">Searching flights from {from} to {to}</p>
            {still && <p className="t-small t-muted">Still looking. Some airlines take a few seconds to answer.</p>}
          </div>
          <div className="f-list" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div className="m-card f-row -skel" key={i}>
                <span className="a-skel f-skel -tile" />
                <span className="f-skel__legs"><span className="a-skel f-skel -leg" /><span className="a-skel f-skel -leg" /></span>
                <span className="f-skel__price"><span className="a-skel f-skel -total" /><span className="a-skel f-skel -unit" /><span className="a-skel f-skel -btn" /></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.status === 'failed' && (
        <Panel photo={photo} title="We couldn’t reach the airlines just now" body="Your search didn’t finish. Nothing has been booked. Try again in a moment."
          actions={<Button onClick={() => setAttempt((a) => a + 1)}>Try again</Button>} />
      )}

      {state.status === 'ok' && total === 0 && (
        <Panel photo={photo} title="No flights on these dates" body={`We couldn’t find flights from ${from} to ${to} on ${dayShort(search.depart)}. Try a day or two either side.`}
          actions={<><Button onClick={() => requestSearch('flights', 'dates')}>Change dates</Button><Button variant="ghost" onClick={nearby}>Search nearby dates</Button></>} />
      )}

      {ok && (
        <div className="f-results__body -r3">
          {desktop && (
            <aside className="f-filters" aria-label="Filters">
              <div className="f-filters__head"><h2 className="t-title">Filter by</h2>{active > 0 && <button type="button" className="a-textbtn" onClick={clearAll}>Clear all</button>}</div>
              {groups()}
            </aside>
          )}
          <div className="f-results__main">
            <div className="f-sorts">
              <div className="f-sorttabs" role="group" aria-label="Sort by">
                {TABS.map((t) => {
                  const r = tops[t.id as 'best' | 'cheapest' | 'fastest'];
                  return (
                    <button key={t.id} type="button" className={`f-sorttab${sort === t.id ? ' is-on' : ''}`} aria-pressed={sort === t.id} onClick={() => setSort(t.id)}>
                      <span className="f-sorttab__name">{t.label}</span>
                      <span className="f-sorttab__sub t-num">{r ? <>{dollars(r.total)} total<span className="f-sorttab__sep">, </span><span className="f-sorttab__dur">{duration(r.longest)}</span></> : 'No flights'}</span>
                    </button>
                  );
                })}
              </div>
              {desktop && (
                <div className="f-sort f-moresort">
                  <label htmlFor="f-moresort" className="sr-only">More sorts</label>
                  <span className="f-sort__ctl">
                    <select id="f-moresort" value={MORE.some((m) => m.id === sort) ? sort : ''} onChange={(e) => e.target.value && setSort(e.target.value as Sort)}>
                      <option value="" disabled>More sorts</option>
                      {MORE.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                    <Icon name="chev-d" size="sm" />
                  </span>
                </div>
              )}
            </div>

            {!desktop && (
              <div className="f-chips -r3" role="group" aria-label="Filter and sort">
                <button type="button" className="a-chip" aria-haspopup="dialog" onClick={() => setSheet('filters')}><Icon name="filter" />{active ? `Filters (${active})` : 'Filters'}</button>
                <button type="button" className="a-chip" aria-haspopup="dialog" onClick={() => setSheet('sort')}><Icon name="sort" />Sort</button>
                <button type="button" className="a-chip" aria-haspopup="dialog" aria-pressed={f.stops !== 9} onClick={() => setSheet('stops')}>Stops</button>
                <button type="button" className="a-chip" aria-haspopup="dialog" aria-pressed={f.needs.some((x) => x === 'cabin' || x === 'checked')} onClick={() => setSheet('bags')}>Bags</button>
              </div>
            )}

            {chips.length > 0 && (
              <div className="f-applied">
                <span className="f-applied__title t-small">Applied</span>
                <ul className="f-applied__list">
                  {chips.map((c) => (
                    <li key={c.key}><button type="button" className="f-applied__chip" onClick={c.remove} aria-label={`Remove ${c.label}`}>{c.label}<Icon name="close" size="sm" /></button></li>
                  ))}
                </ul>
                <button type="button" className="a-textbtn f-applied__clear" onClick={clearAll}>Clear all</button>
              </div>
            )}

            <div className="f-countline">
              <p className="f-results__count t-num" aria-live="polite">{active ? `${filtered.length} of ${total} flights` : `${total} flights`}, sorted by {SORT_LABEL(sort)}</p>
              {sort === 'best' && (
                <span className="f-tip">
                  <button type="button" className="f-tip__btn" aria-describedby="f-tip-best" aria-label="What Best means"><Icon name="info" size="sm" /></button>
                  <span className="f-tip__text t-small" role="tooltip" id="f-tip-best">Best is a mix of price, duration and stops</span>
                </span>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="m-card -pad f-empty" role="status">
                <h2 className="t-h3">No flights match your filters</h2>
                <p className="t-body t-muted">{total} flights match your search without them. Try removing one.</p>
                <Button onClick={clearAll}>Clear filters</Button>
              </div>
            ) : (
              <ol className="f-list">
                {visible.map((r, i) => <li key={r.offer.id} data-row={i}><FlightCard row={r} n={n} tags={tags.get(r.offer.id) ?? []} onBreakdown={() => setBd(r)} /></li>)}
              </ol>
            )}
            {filtered.length > shown && (
              <div className="f-more">
                <Button variant="ghost" onClick={showMore}>{filtered.length - shown < PAGE ? `Show the last ${filtered.length - shown} flights` : 'Show 20 more flights'}</Button>
              </div>
            )}
            {filtered.length > 0 && filtered.length <= shown && shown > PAGE && <p className="f-more__end t-small t-muted">That’s all {filtered.length} flights.</p>}
            <p className="sr-only" aria-live="polite">{more}</p>
          </div>
        </div>
      )}

      {!desktop && ok && (
        <>
          <Dialog open={sheet === 'filters'} onClose={() => setSheet(null)} title="Filters" sheet closeLabel="Close filters"
            footer={<><Button variant="ghost" onClick={clearAll}>Clear all</Button><Button onClick={() => setSheet(null)} disabled={!filtered.length}>{showLabel}</Button></>}>
            {groups()}
          </Dialog>
          <Dialog open={sheet === 'stops'} onClose={() => setSheet(null)} title="Stops" sheet closeLabel="Close stops"
            footer={<Button onClick={() => setSheet(null)} disabled={!filtered.length}>{showLabel}</Button>}>
            {groups(['stops'])}
          </Dialog>
          <Dialog open={sheet === 'bags'} onClose={() => setSheet(null)} title="Bags" sheet closeLabel="Close bags"
            footer={<Button onClick={() => setSheet(null)} disabled={!filtered.length}>{showLabel}</Button>}>
            {groups(['needs'])}
          </Dialog>
          <Dialog open={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort by" sheet closeLabel="Close sort"
            footer={<Button onClick={() => setSheet(null)} disabled={!filtered.length}>{showLabel}</Button>}>
            <fieldset className="f-group -flush">
              <legend className="sr-only">Sort by</legend>
              {[...TABS, ...MORE].map((s) => (
                <label className="f-opt -radio" key={s.id}>
                  <input type="radio" name="f-sort-sheet" checked={sort === s.id} onChange={() => setSort(s.id)} />
                  <span><b>{s.label}</b></span>
                </label>
              ))}
            </fieldset>
          </Dialog>
        </>
      )}

      {bd && <Breakdown open={!!bd} onClose={() => setBd(null)} data={flightBreakdown(offerTotals(bd.offer, bd.fare), search, `${money(perTraveler(bd.total, search))} per traveler, ${bd.fareName} fare`)} />}

      <Dialog open={expired} onClose={() => {}} dismissable={false} title="These prices have expired"
        footer={<Button onClick={() => setAttempt((a) => a + 1)}>Search again</Button>}>
        <p className="t-body">Airline prices are only valid for a short time after a search. Search again to see current fares.</p>
      </Dialog>
    </div>
  );
}

/* ---------- the date and price strip ---------- */
function DateStrip({ search, dates, today }: { search: FlightSearch; dates: DateCell[]; today: string }) {
  /* prices per date only when known; without them each cell is a plain date link */
  if (!dates.some((d) => d.lowest !== null)) return <DateLinks search={search} dates={dates} today={today} />;
  const prices =dates.filter((d) => d.date >= today).map((d) => d.lowest).filter((x): x is number => x !== null && x > 0);
  const low = prices.length ? Math.min(...prices) : null;
  const href = (offset: number) => `/flights?${searchQuery({ ...search, depart: addIsoDays(search.depart, offset), ret: search.ret ? addIsoDays(search.ret, offset) : null })}`;
  const prevOk = addIsoDays(search.depart, -7) >= today;
  /* each cell is the lowest total for the whole party (page.tsx, lowestTotalsByDate), so it matches the sort tabs */
  const party = travelers(search);
  const note = party === 1 ? `Lowest ${search.ret ? 'return' : 'one way'} fare` : `Lowest total for ${travelersWord(party)}`;
  const spoken = party === 1 ? '' : ` total for ${travelersWord(party)}`;
  return (
    <>
    <nav className="f-dates -r3total" aria-label={`${note} by departure date`} aria-describedby="f-dates-note">
      {prevOk
        ? <Link className="f-dates__arrow" href={href(-7)} aria-label="One week earlier" scroll={false}><Icon name="chev-l" /></Link>
        : <span className="f-dates__arrow is-off" aria-hidden="true"><Icon name="chev-l" /></span>}
      <ol className="f-dates__list">
        {dates.map((d, i) => {
          const offset = i - Math.floor(dates.length / 2);
          const cur = d.date === search.depart;
          const past = d.date < today;
          const isLow = !past && low !== null && d.lowest === low;
          const body = (
            <>
              <span className="f-dates__day t-num">{dayShort(d.date)}</span>
              <span className="f-dates__price t-num">{d.lowest ? dollars(d.lowest) : 'No flights'}</span>
              {isLow && <span className="f-dates__low">Lowest</span>}
            </>
          );
          return (
            <li key={d.date}>
              {past || !d.lowest
                ? <span className="f-dates__cell is-off">{body}</span>
                : <Link className={`f-dates__cell${cur ? ' is-on' : ''}`} href={href(offset)} scroll={false} aria-current={cur ? 'date' : undefined}
                  aria-label={`${dayShort(d.date)}, from ${dollars(d.lowest)}${spoken}${isLow ? ', lowest' : ''}${cur ? ', your date' : ''}`}>{body}</Link>}
            </li>
          );
        })}
      </ol>
      <Link className="f-dates__arrow" href={href(7)} aria-label="One week later" scroll={false}><Icon name="chev-r" /></Link>
    </nav>
    <p className="f-dates__note t-muted" id="f-dates-note">{note}, taxes and fees included</p>
    </>
  );
}

/* the strip without prices: the same cells and arrows; each date runs the search again */
function DateLinks({ search, dates, today }: { search: FlightSearch; dates: DateCell[]; today: string }) {
  const href = (offset: number) => `/flights?${searchQuery({ ...search, depart: addIsoDays(search.depart, offset), ret: search.ret ? addIsoDays(search.ret, offset) : null })}`;
  const prevOk = addIsoDays(search.depart, -7) >= today;
  return (
    <>
    <nav className="f-dates -r3total" aria-label="Departure dates" aria-describedby="f-dates-note">
      {prevOk
        ? <Link className="f-dates__arrow" href={href(-7)} aria-label="One week earlier" scroll={false}><Icon name="chev-l" /></Link>
        : <span className="f-dates__arrow is-off" aria-hidden="true"><Icon name="chev-l" /></span>}
      <ol className="f-dates__list">
        {dates.map((d, i) => {
          const offset = i - Math.floor(dates.length / 2);
          const cur = d.date === search.depart;
          const body = <span className="f-dates__day t-num">{dayShort(d.date)}</span>;
          return (
            <li key={d.date}>
              {d.date < today
                ? <span className="f-dates__cell is-off">{body}</span>
                : <Link className={`f-dates__cell${cur ? ' is-on' : ''}`} href={href(offset)} scroll={false} aria-current={cur ? 'date' : undefined}
                  aria-label={`${dayShort(d.date)}${cur ? ', your date' : ''}`}>{body}</Link>}
            </li>
          );
        })}
      </ol>
      <Link className="f-dates__arrow" href={href(7)} aria-label="One week later" scroll={false}><Icon name="chev-r" /></Link>
    </nav>
    <p className="f-dates__note t-muted" id="f-dates-note">Choose another day to search again{search.ret ? ', with the same trip length' : ''}</p>
    </>
  );
}

/* ---------- applied chips ---------- */
function appliedChips(f: Filters, search: FlightSearch, set: (p: Partial<Filters>) => void): { key: string; label: string; remove: () => void }[] {
  const out: { key: string; label: string; remove: () => void }[] = [];
  if (f.stops !== 9) out.push({ key: 'stops', label: STOPS.find((s) => s.id === f.stops)!.chip, remove: () => set({ stops: 9 }) });
  f.needs.forEach((nd) => out.push({ key: `n-${nd}`, label: NEED_LABEL(nd), remove: () => set({ needs: f.needs.filter((x) => x !== nd) }) }));
  if (f.air) f.air.forEach((c) => out.push({ key: `a-${c}`, label: airlineName(c), remove: () => { const next = f.air!.filter((x) => x !== c); set({ air: next.length ? next : null }); } }));
  const times: [TimeKey, string][] = [['dOut', `Leaving ${cityOf(search.from)}`], ['aOut', `Arriving ${cityOf(search.to)}`], ['dRet', `Leaving ${cityOf(search.to)}`], ['aRet', `Arriving ${cityOf(search.from)}`]];
  times.forEach(([k, word]) => f[k].forEach((s) => out.push({ key: `${k}-${s}`, label: `${word}, ${SLOTS.find((x) => x.id === s)!.label.toLowerCase()}`, remove: () => set({ [k]: f[k].filter((x) => x !== s) } as Partial<Filters>) })));
  if (f.dur !== null) out.push({ key: 'dur', label: `Flight up to ${duration(f.dur)}`, remove: () => set({ dur: null }) });
  if (f.lay !== null) out.push({ key: 'lay', label: `Layover up to ${duration(f.lay)}`, remove: () => set({ lay: null }) });
  f.lap.forEach((c) => out.push({ key: `l-${c}`, label: `Via ${cityOf(c)}`, remove: () => set({ lap: f.lap.filter((x) => x !== c) }) }));
  if (f.price !== null) out.push({ key: 'price', label: `Up to ${dollars(f.price)}`, remove: () => set({ price: null }) });
  return out;
}

/* ---------- one result ---------- */
function legLabel(s: Slice): string {
  if (!s.stops) return `${duration(s.dur)}, nonstop`;
  if (s.layovers.length === 1) return `${duration(s.dur)}, 1 stop, ${duration(s.layovers[0].dur)} in ${s.layovers[0].at}`;
  return `${duration(s.dur)}, ${stopsLower(s.stops)}, ${s.layovers.map((l) => l.at).join(' and ')}`;
}
function LegRow({ slice, owner }: { slice: Slice; owner: string }) {
  const plus = Math.floor(slice.arr / 1440);
  return (
    <div className="f-cleg">
      <AirlineTile code={owner} />
      <p className="f-cleg__end">
        <span className="f-cleg__time t-num">{clock(slice.dep)}</span>
        <span className="f-cleg__code t-code">{slice.from}</span>
      </p>
      <LandfallLine className="f-cleg__line" label={legLabel(slice)} stops={slice.layovers.map((l) => ({ code: l.at, label: `${duration(l.dur)} in ${cityOf(l.at)}` }))} />
      <p className="f-cleg__end -arr">
        <span className="f-cleg__time t-num">{clock(slice.arr)}{plus > 0 && <sup className="f-cleg__plus t-num">+{plus}<span className="sr-only"> arrives the next day</span></sup>}</span>
        <span className="f-cleg__code t-code">{slice.to}</span>
      </p>
    </div>
  );
}

function FlightCard({ row, n, tags, onBreakdown }: { row: Row; n: number; tags: string[]; onBreakdown: () => void }) {
  const [open, setOpen] = useState(false);
  const o = row.offer;
  const air = airlineName(o.owner);
  const perC = perTraveler(row.total, o.passengers);
  const per = money(perC);
  const spoken = `${cardSpoken(o.owner, o.slices, money(row.total), n).replace(/\.$/, '')}, ${per} per traveler, taxes and fees included.`;
  const operated = o.slices.flatMap((s) => s.segments).find((s) => s.operatedBy)?.operatedBy;
  const r = row.fareObj.rows;
  const changes = cellKind(r?.changes);
  const inc: { icon: IconName; word: string; on: boolean }[] = [
    { icon: 'bag', word: 'Cabin bag', on: fareHas(row.fareObj, 'cabin') },
    { icon: 'suitcase', word: 'Checked bag', on: fareHas(row.fareObj, 'checked') },
    { icon: 'change', word: changes === 'fee' ? 'Changes for a fee' : 'Changes', on: changes !== 'no' }
  ];
  const id = `f-more-${o.id}`;
  return (
    <article className="m-card f-card" aria-label={spoken}>
      <div className="f-card__main">
        <div className="f-card__top">
          <p className="f-card__air">{air}{operated && <span className="t-muted">, operated by {airlineName(operated)}</span>}</p>
          {tags.length > 0 && <p className="f-card__tags">{tags.map((t) => <span key={t} className={`f-tag -${t.toLowerCase()}`}>{t}</span>)}</p>}
        </div>
        <div className="f-card__legs">{o.slices.map((s, i) => <LegRow slice={s} owner={o.owner} key={i} />)}</div>
        <ul className="f-card__inc" aria-label="In this fare">
          {inc.map((x) => (
            <li key={x.word} className={x.on ? '' : '-no'}><Icon name={x.icon} size="sm" />{x.on ? x.word : <s>{x.word}</s>}{!x.on && <span className="sr-only"> not included</span>}</li>
          ))}
        </ul>
        {o.warnings.length > 0 && (
          <ul className="f-row__warn">
            {o.warnings.map((w) => <li key={w} className="t-small"><Icon name="info" size="sm" />{w}</li>)}
          </ul>
        )}
      </div>
      <div className="f-card__price">
        <Price total={row.total} unit={`${per} per traveler`} onBreakdown={onBreakdown} breakdownLabel={`${money(row.total)} total for ${travelersWord(n)}. See price breakdown`} />
        <p className="f-card__fare t-muted">From {row.fareName} fare</p>
        <ButtonLink href={detailsUrl(o.id, row.fare)} className="f-card__select" aria-label={`View fares, ${air}, ${money(row.total)} total`}>View fares</ButtonLink>
      </div>
      <div className="f-card__more">
        <button type="button" className="f-card__toggle a-textbtn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
          Flight details<Icon name={open ? 'chev-u' : 'chev-d'} size="sm" />
        </button>
        <div id={id} hidden={!open} className="f-card__detail">{open && <Timeline slices={o.slices} cabin={o.cabin} />}</div>
      </div>
    </article>
  );
}

/* ---------- empty and failed panels ---------- */
function Panel({ photo, title, body, actions }: { photo?: { image: string; alt: string }; title: string; body: string; actions: React.ReactNode }) {
  return (
    <section className={`m-card f-panel${photo ? '' : ' -nophoto'}`} aria-labelledby="f-panel-title">
      {photo && <Photo name={photo.image} alt={photo.alt} className="f-panel__photo" sizes="(min-width: 1025px) 760px, calc(100vw - 32px)" />}
      <div className="f-panel__text">
        <h2 className="t-display t-h2" id="f-panel-title">{title}</h2>
        <p className="t-body t-muted">{body}</p>
        <div className="f-panel__actions">{actions}</div>
      </div>
    </section>
  );
}

/* ---------- filter groups (column at 1025 and up, sheets below) ---------- */
function Histogram({ values, min, max, upTo }: { values: number[]; min: number; max: number; upTo: number }) {
  const bins = 18;
  const w = Math.max(1, max - min) / bins;
  const counts = Array.from({ length: bins }, (_, i) => values.filter((v) => v >= min + i * w && (i === bins - 1 ? v <= max : v < min + (i + 1) * w)).length);
  const top = Math.max(1, ...counts);
  return (
    <span className="f-hist" aria-hidden="true">
      {counts.map((c, i) => <span key={i} className={`f-hist__bar${min + i * w <= upTo ? ' is-in' : ''}`} style={{ height: `${c ? Math.max(8, (c / top) * 100) : 0}%` }} />)}
    </span>
  );
}

function Group({ id, title, changed, onReset, children, idBase }: { id: string; title: string; changed: boolean; onReset: () => void; children: React.ReactNode; idBase: string }) {
  const [open, setOpen] = useState(true);
  const pid = `${idBase}-${id}-panel`;
  return (
    <section className="f-group -r3">
      <div className="f-group__bar">
        <h3 className="f-group__title"><button type="button" className="f-group__toggle" aria-expanded={open} aria-controls={pid} onClick={() => setOpen((v) => !v)}>{title}<Icon name={open ? 'chev-u' : 'chev-d'} size="sm" /></button></h3>
        {changed && <button type="button" className="a-textbtn f-group__reset" onClick={onReset} aria-label={`Reset ${title}`}>Reset</button>}
      </div>
      <div id={pid} hidden={!open} className="f-group__body">{children}</div>
    </section>
  );
}

/* an option with nothing behind it in the current results is muted, unchecked and disabled
   (still listed); one the traveler picked stays live so it can be undone.
   `available` overrides the count when the option can still be met another way (a fare option
   a higher family includes). */
function Opt({ type, name, checked, onChange, label, count, low, disabled, extra, available }: { type: 'radio' | 'checkbox'; name?: string; checked: boolean; onChange: () => void; label: string; count: number; low: number | null; disabled?: boolean; extra?: React.ReactNode; available?: boolean }) {
  const off = disabled || (!checked && !(available ?? count > 0));
  return (
    <div className={`f-opt -${type === 'radio' ? 'radio' : 'check'} -r3${off ? ' is-off' : ''}`}>
      <label>
        <input type={type} name={name} checked={checked} disabled={off} onChange={onChange} />
        <span>{label}<span className="f-opt__count t-num"> ({count})</span>{off && <span className="sr-only">, none in these results</span>}</span>
      </label>
      {extra}
      <span className="f-opt__from t-num">{low !== null && count > 0 ? dollars(low) : ''}</span>
    </div>
  );
}

function FilterGroups({ bases, f, setFilter, search, idBase, only }: { bases: Base[]; f: Filters; setFilter: (p: Partial<Filters>) => void; search: FlightSearch; idBase: string; only?: Group[] }) {
  const show = (g: Group) => !only || only.includes(g);
  const all = useMemo(() => run(bases, NO_FILTERS), [bases]);
  const codes = Array.from(new Set(bases.map((r) => r.offer.owner))).sort((a, b) => airlineName(a).localeCompare(airlineName(b)));
  const layAirports = Array.from(new Set(bases.flatMap((b) => b.lays.map((l) => l.at)))).sort((a, b) => cityOf(a).localeCompare(cityOf(b)));
  const durs = all.map((r) => r.longest), prices = all.map((r) => r.total), lays = bases.filter((b) => b.lays.length).map((b) => b.layMax);
  const dMin = Math.floor(Math.min(...durs) / 15) * 15, dMax = Math.ceil(Math.max(...durs) / 15) * 15;
  const pMin = Math.floor(Math.min(...prices) / 1000) * 1000, pMax = Math.ceil(Math.max(...prices) / 1000) * 1000;
  const lMin = lays.length ? Math.floor(Math.min(...lays) / 15) * 15 : 0, lMax = lays.length ? Math.ceil(Math.max(...lays) / 15) * 15 : 0;
  const dur = f.dur ?? dMax, price = f.price ?? pMax, lay = f.lay ?? lMax;
  const on = f.air ?? codes;
  const stat = (l: Row[]) => ({ count: l.length, low: lowest(l) });

  const skipAir = run(bases, f, 'air');
  const skipStops = run(bases, f, 'stops');
  const skipLap = run(bases, f, 'lap');
  const toggleAir = (c: string) => {
    const next = on.includes(c) ? on.filter((x) => x !== c) : [...on, c];
    setFilter({ air: next.length === codes.length || !next.length ? null : next });
  };
  const toggleNeed = (nd: Need) => setFilter({ needs: f.needs.includes(nd) ? f.needs.filter((x) => x !== nd) : [...f.needs, nd] });
  /* Bags and Fare options: the count is the flights whose cheapest family (Light tier) already
     includes it, so it differs by airline; the price is the lowest total at which it is included
     (each flight at its cheapest family that has it, the same pricing the list uses once it's on) */
  const skipNeeds = run(bases, f, 'needs');
  const needOpt = (b: { id: Need; label: string }) => {
    const count = skipNeeds.filter((r) => fareHas(r.fares[0], b.id)).length;
    const priced = run(bases, { ...f, needs: Array.from(new Set([...f.needs, b.id])) });
    return <Opt key={b.id} type="checkbox" checked={f.needs.includes(b.id)} onChange={() => toggleNeed(b.id)} label={b.label} count={count} low={lowest(priced)} available={priced.length > 0} />;
  };
  const toggleSlot = (k: TimeKey, id: Slot) => setFilter({ [k]: f[k].includes(id) ? f[k].filter((x) => x !== id) : [...f[k], id] } as Partial<Filters>);
  const toggleLap = (c: string) => setFilter({ lap: f.lap.includes(c) ? f.lap.filter((x) => x !== c) : [...f.lap, c] });

  const tiles = (k: TimeKey, which: 'dep' | 'arr', leg: 0 | 1, title: string) => {
    const base = run(bases, f, k);
    return (
      <fieldset className="f-tiles">
        <legend className="f-tiles__title t-small">{title}</legend>
        <div className="f-tiles__grid">
          {SLOTS.map((s) => {
            const l = base.filter((r) => r.offer.slices[leg] && inSlots(r.offer.slices[leg][which], [s.id]));
            const st = stat(l);
            const pressed = f[k].includes(s.id);
            return (
              <button key={s.id} type="button" className="f-tile3" aria-pressed={pressed} disabled={!pressed && !st.count} onClick={() => toggleSlot(k, s.id)}
                aria-label={`${s.label}, ${s.range}, ${st.count} flights${st.low !== null ? `, from ${dollars(st.low)}` : ''}`}>
                <Icon name={s.icon} />
                <span className="f-tile3__name">{s.label}</span>
                <span className="f-tile3__range t-num">{s.range}</span>
                <span className="f-tile3__meta t-num">{st.count ? `${st.count} from ${dollars(st.low!)}` : 'No flights'}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  };
  const outWord = `Leaving ${cityOf(search.from)}`, inWord = `Arriving in ${cityOf(search.to)}`;
  const retOut = `Leaving ${cityOf(search.to)}`, retIn = `Arriving in ${cityOf(search.from)}`;

  return (
    <div className="f-groups -r3">
      {show('stops') && (
        <Group id="stops" title="Stops" idBase={idBase} changed={f.stops !== 9} onReset={() => setFilter({ stops: 9 })}>
          {STOPS.map((s) => {
            const st = stat(skipStops.filter((r) => r.maxStops <= s.id));
            return <Opt key={s.id} type="radio" name={`${idBase}-stops`} checked={f.stops === s.id} onChange={() => setFilter({ stops: s.id })} label={s.label} count={st.count} low={st.low} />;
          })}
        </Group>
      )}
      {show('needs') && (
        <Group id="bags" title="Bags" idBase={idBase} changed={f.needs.some((x) => x === 'cabin' || x === 'checked')} onReset={() => setFilter({ needs: f.needs.filter((x) => x !== 'cabin' && x !== 'checked') })}>
          {BAGS.map((b) => needOpt(b))}
        </Group>
      )}
      {show('needs') && !only && (
        <Group id="fare" title="Fare options" idBase={idBase} changed={f.needs.some((x) => x !== 'cabin' && x !== 'checked')} onReset={() => setFilter({ needs: f.needs.filter((x) => x === 'cabin' || x === 'checked') })}>
          {OPTS.map((b) => needOpt(b))}
        </Group>
      )}
      {show('air') && (
        <Group id="air" title="Airlines" idBase={idBase} changed={!!f.air} onReset={() => setFilter({ air: null })}>
          {codes.map((c) => {
            const st = stat(skipAir.filter((r) => r.offer.owner === c));
            const picked = !!f.air && f.air.includes(c);
            return <Opt key={c} type="checkbox" checked={st.count ? on.includes(c) : picked} onChange={() => toggleAir(c)} label={airlineName(c)} count={st.count} low={st.low}
              extra={st.count ? <button type="button" className="f-opt__only" onClick={() => setFilter({ air: [c] })} aria-label={`Show only ${airlineName(c)}`}>Only</button> : undefined} />;
          })}
          {f.air && <button type="button" className="a-textbtn f-group__all" onClick={() => setFilter({ air: null })}>Select all</button>}
        </Group>
      )}
      {show('dOut') && (
        <Group id="dep" title="Departure time" idBase={idBase} changed={f.dOut.length + f.dRet.length > 0} onReset={() => setFilter({ dOut: [], dRet: [] })}>
          {tiles('dOut', 'dep', 0, outWord)}
          {search.ret && tiles('dRet', 'dep', 1, retOut)}
        </Group>
      )}
      {show('aOut') && (
        <Group id="arr" title="Arrival time" idBase={idBase} changed={f.aOut.length + f.aRet.length > 0} onReset={() => setFilter({ aOut: [], aRet: [] })}>
          {tiles('aOut', 'arr', 0, inWord)}
          {search.ret && tiles('aRet', 'arr', 1, retIn)}
        </Group>
      )}
      {show('dur') && (
        <Group id="dur" title="Flight duration" idBase={idBase} changed={f.dur !== null} onReset={() => setFilter({ dur: null })}>
          <p className="f-range__line t-small"><span>Longest leg</span><b className="t-num">Up to {duration(dur)}</b></p>
          <Histogram values={run(bases, f, 'dur').map((r) => r.longest)} min={dMin} max={dMax} upTo={dur} />
          <input aria-label="Flight duration, up to" className="f-range" type="range" min={dMin} max={dMax} step={15} value={dur} aria-valuetext={`Up to ${duration(dur)}`}
            onChange={(e) => { const v = +e.target.value; setFilter({ dur: v >= dMax ? null : v }); }} />
          <p className="f-range__ends t-small t-muted t-num"><span>{duration(dMin)}</span><span>{duration(dMax)}</span></p>
        </Group>
      )}
      {show('lay') && lays.length > 0 && (
        <Group id="lay" title="Layover duration" idBase={idBase} changed={f.lay !== null} onReset={() => setFilter({ lay: null })}>
          <p className="f-range__line t-small"><span>Longest layover</span><b className="t-num">Up to {duration(lay)}</b></p>
          <input aria-label="Layover duration, up to" className="f-range" type="range" min={lMin} max={lMax} step={15} value={lay} aria-valuetext={`Up to ${duration(lay)}`}
            onChange={(e) => { const v = +e.target.value; setFilter({ lay: v >= lMax ? null : v }); }} />
          <p className="f-range__ends t-small t-muted t-num"><span>{duration(lMin)}</span><span>{duration(lMax)}</span></p>
        </Group>
      )}
      {show('lap') && layAirports.length > 0 && (
        <Group id="lap" title="Layover airports" idBase={idBase} changed={f.lap.length > 0} onReset={() => setFilter({ lap: [] })}>
          {layAirports.map((c) => {
            const st = stat(skipLap.filter((r) => r.lays.some((l) => l.at === c)));
            return <Opt key={c} type="checkbox" checked={f.lap.includes(c)} onChange={() => toggleLap(c)} label={`${cityOf(c)} (${c})`} count={st.count} low={st.low} />;
          })}
        </Group>
      )}
      {show('price') && (
        <Group id="price" title="Price" idBase={idBase} changed={f.price !== null} onReset={() => setFilter({ price: null })}>
          <p className="f-range__line t-small"><span>Total for {travelersWord(travelers(search))}</span><b className="t-num">Up to {dollars(price)}</b></p>
          <Histogram values={run(bases, f, 'price').map((r) => r.total)} min={pMin} max={pMax} upTo={price} />
          <input aria-label="Total price, up to" className="f-range" type="range" min={pMin} max={pMax} step={1000} value={price} aria-valuetext={`Up to ${dollars(price)}`}
            onChange={(e) => { const v = +e.target.value; setFilter({ price: v >= pMax ? null : v }); }} />
          <p className="f-range__ends t-small t-muted t-num"><span>{dollars(pMin)}</span><span>{dollars(pMax)}</span></p>
        </Group>
      )}
    </div>
  );
}
