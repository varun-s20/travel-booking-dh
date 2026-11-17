'use client';
/* =====================================================================
   Flight results (spec 2b, Flights; round 3 spec B1 at competitor depth):
   - the date-price strip under the compact search: 7 window-topped cells
     with the lowest total for each date pair, the cheapest on the save
     tint, arrows that move the window by a week (URL change, Back works);
   - summary tabs Best, Cheapest, Fastest with their totals and times,
     which set the sort; more sorts in a select (desktop) or the sheet;
   - filters in collapsible groups with a count beside every option and
     the lowest total where it helps: Stops, Price (with a histogram),
     Airlines, Departure and Arrival times (tiles), Total travel time,
     Layover and connecting airports, Bags, Fare flexibility. Bag and
     flexibility filters price each flight at its cheapest fare that
     meets them, and the card names that fare. Active filters show as
     removable chips; 1024 opens them in a drawer, phones in a sheet;
   - cards with a leg row per slice, the included items of the shown
     fare (words on hover, and in the open card), a boarding-stub price
     column, and "Flight details" opening the itinerary in place;
   - phones: a scrolling row of Filters, Stops, Airlines, Times and Sort
     chips; the summary tabs as a 3-cell strip;
   - states: searching (window plus 5 skeleton cards), no flights, filters
     hide everything (chips that say how many flights each would bring
     back), prices expired after 30 minutes.
   Strings: content/copy.md, Flights, and the spec's labels.
   ===================================================================== */
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AppLink as Link } from '@/components/AppLink';
import { Icon } from '@/components/Icon';
import { Glyph } from '@/components/booking/Glyphs';
import { Save } from '@/components/ui/Save';
import { recordSearch } from '@/lib/history';
import { Dialog } from '@/components/ui/Dialog';
import { Notice } from '@/components/ui/Notice';
import { Searching } from '@/components/booking/Searching';
import { Itinerary } from '@/components/flights/Itinerary';
import { AIRLINES, TYPICAL, cityOf, faresFor, offerTotals, searchQuery, stopsLabel, travelers, type Fare, type FlightSearch, type Offer, type Slice } from '@/lib/mock/flights';
import { airport } from '@/lib/mock/geo';
import { requestSearch, rangeFill } from '@/lib/client';
import { addIsoDays, clock, dayShort, duration, money, plural } from '@/lib/format';
import { cardSpoken, travelersWord } from '@/lib/text';

type Bucket = 'early' | 'morning' | 'afternoon' | 'evening';
type Sort = 'best' | 'cheapest' | 'fastest' | 'earliest' | 'latest' | 'arrival' | 'layover';
type Bag = 'cabin' | 'checked';
type FlexOpt = 'changes' | 'refund';
type Filters = {
  stops: number[]; airlines: string[]; dep: [Bucket[], Bucket[]]; arr: [Bucket[], Bucket[]];
  maxDur: number | null; maxLay: number | null; noVia: string[]; bags: Bag[]; flex: FlexOpt[]; maxPrice: number | null;
};
type Group = 'stops' | 'price' | 'airlines' | 'dep' | 'arr' | 'dur' | 'lay' | 'via' | 'bags' | 'flex';
type Day = { depart: string; ret: string | null; total: number | null };
const NONE: Filters = { stops: [], airlines: [], dep: [[], []], arr: [[], []], maxDur: null, maxLay: null, noVia: [], bags: [], flex: [], maxPrice: null };

const BUCKETS: { id: Bucket; label: string; range: string; icon: string; test: (m: number) => boolean }[] = [
  { id: 'early', label: 'Early morning', range: '00:00 to 05:59', icon: 'moon', test: (m) => m < 360 },
  { id: 'morning', label: 'Morning', range: '06:00 to 11:59', icon: 'sun', test: (m) => m >= 360 && m < 720 },
  { id: 'afternoon', label: 'Afternoon', range: '12:00 to 17:59', icon: 'sun', test: (m) => m >= 720 && m < 1080 },
  { id: 'evening', label: 'Evening', range: '18:00 to 23:59', icon: 'moon', test: (m) => m >= 1080 }
];
const STOPS: { id: number; label: string }[] = [{ id: 0, label: 'Nonstop' }, { id: 1, label: '1 stop' }, { id: 2, label: '2+ stops' }];
const SORTS: { id: Sort; label: string; help: string }[] = [
  { id: 'best', label: 'Best', help: 'balances price, travel time and stops' },
  { id: 'cheapest', label: 'Cheapest', help: 'lowest total first' },
  { id: 'fastest', label: 'Fastest', help: 'shortest travel time first' },
  { id: 'earliest', label: 'Earliest departure', help: 'first outbound flight of the day first' },
  { id: 'latest', label: 'Latest departure', help: 'last outbound flight of the day first' },
  { id: 'arrival', label: 'Earliest arrival', help: 'first to land at your destination' },
  { id: 'layover', label: 'Shortest layover', help: 'least time waiting between flights' }
];
const BAGS: { id: Bag; label: string }[] = [{ id: 'cabin', label: 'Cabin bag included' }, { id: 'checked', label: 'Checked bag included' }];
const FLEX: { id: FlexOpt; label: string }[] = [{ id: 'changes', label: 'Changes allowed' }, { id: 'refund', label: 'Refundable' }];

/* ---- what a fare includes, read from the airline's fare table (catalogue section 2) ---- */
const feeCell = (s?: string) => !s || /^For a fee/i.test(s);
export const fareHas = {
  cabin: (f: Fare) => !!f.rows && !feeCell(f.rows.cabinBag),
  checked: (f: Fare) => !!f.rows && !feeCell(f.rows.checkedBag),
  seat: (f: Fare) => !!f.rows && !/^Seat assigned/i.test(f.rows.seatChoice),
  changes: (f: Fare) => !!f.rows && !/^Not allowed/i.test(f.rows.changes),
  freeChanges: (f: Fare) => !!f.rows && !/^Not allowed/i.test(f.rows.changes) && !feeCell(f.rows.changes),
  refund: (f: Fare) => !!f.rows && !/^Not refundable/i.test(f.rows.refunds)
};
const bagCount = (s?: string) => { const m = /^(\d+) checked bag/i.exec(s || ''); return m ? +m[1] : 0; };
/* the cheapest of the flight's fares that meets the bag and flexibility filters */
function fareFit(o: Offer, f: Filters): Fare | null {
  return faresFor(o.owner).find((x) => f.bags.every((b) => fareHas[b](x)) && f.flex.every((k) => k === 'changes' ? fareHas.changes(x) : fareHas.refund(x))) ?? null;
}
const priceAt = (o: Offer, fare: Fare | null) => (fare ? offerTotals(o, fare.id).total : Infinity);
const tripDur = (o: Offer) => o.slices.reduce((a, s) => a + s.dur, 0);
const longest = (o: Offer) => Math.max(...o.slices.map((s) => s.dur));
const stopsOf = (o: Offer) => Math.min(2, Math.max(...o.slices.map((s) => s.stops)));
const layOf = (o: Offer) => Math.max(0, ...o.slices.flatMap((s) => s.layovers.map((l) => l.dur)));
const layTotal = (o: Offer) => o.slices.reduce((a, s) => a + s.layovers.reduce((b, l) => b + l.dur, 0), 0);
const viasOf = (o: Offer) => [...new Set(o.slices.flatMap((s) => s.layovers.map((l) => l.at)))];
const inB = (b: Bucket[], m: number) => !b.length || b.some((id) => BUCKETS.find((x) => x.id === id)!.test(((m % 1440) + 1440) % 1440));

function passes(o: Offer, f: Filters, skip?: Group): boolean {
  if (skip !== 'stops' && f.stops.length && !f.stops.includes(stopsOf(o))) return false;
  if (skip !== 'airlines' && f.airlines.length && !f.airlines.includes(o.owner)) return false;
  if (skip !== 'dep' && (!inB(f.dep[0], o.slices[0].dep) || (o.slices[1] && !inB(f.dep[1], o.slices[1].dep)))) return false;
  if (skip !== 'arr' && (!inB(f.arr[0], o.slices[0].arr) || (o.slices[1] && !inB(f.arr[1], o.slices[1].arr)))) return false;
  if (skip !== 'dur' && f.maxDur !== null && longest(o) > f.maxDur) return false;
  if (skip !== 'lay' && f.maxLay !== null && layOf(o) > f.maxLay) return false;
  if (skip !== 'via' && f.noVia.length && viasOf(o).some((v) => f.noVia.includes(v))) return false;
  const fit = skip === 'bags' ? fareFit(o, { ...f, bags: [] }) : skip === 'flex' ? fareFit(o, { ...f, flex: [] }) : fareFit(o, f);
  if (!fit) return false;
  if (skip !== 'price' && f.maxPrice !== null && priceAt(o, fit) > f.maxPrice) return false;
  return true;
}
function active(f: Filters): Group[] {
  const g: Group[] = [];
  if (f.stops.length) g.push('stops');
  if (f.maxPrice !== null) g.push('price');
  if (f.airlines.length) g.push('airlines');
  if (f.dep[0].length || f.dep[1].length) g.push('dep');
  if (f.arr[0].length || f.arr[1].length) g.push('arr');
  if (f.maxDur !== null) g.push('dur');
  if (f.maxLay !== null) g.push('lay');
  if (f.noVia.length) g.push('via');
  if (f.bags.length) g.push('bags');
  if (f.flex.length) g.push('flex');
  return g;
}
const CLEAR: Record<Group, Partial<Filters>> = {
  stops: { stops: [] }, price: { maxPrice: null }, airlines: { airlines: [] }, dep: { dep: [[], []] }, arr: { arr: [[], []] },
  dur: { maxDur: null }, lay: { maxLay: null }, via: { noVia: [] }, bags: { bags: [] }, flex: { flex: [] }
};
const GROUP_NAME: Record<Group, string> = {
  stops: 'Stops', price: 'Price', airlines: 'Airlines', dep: 'Departure times', arr: 'Arrival times', dur: 'Total travel time', lay: 'Layover', via: 'Connecting airports', bags: 'Bags', flex: 'Fare flexibility'
};
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/* the usual return fare for one adult on the route (catalogue "Typical return"), for the saving chip */
function saving(o: Offer, s: FlightSearch): number {
  if (!s.ret || s.cabin !== 'economy') return 0;
  const typical = TYPICAL[`LHR-${s.to}`] ?? TYPICAL[`LHR-${s.from}`];
  if (!typical || (s.from !== 'LHR' && s.to !== 'LHR')) return 0;
  const diff = typical - o.perSeat;
  return diff >= typical * 0.1 ? Math.round(diff / 100) * 100 : 0;
}

/* ---- the airline's own drawn monogram in a small window (spec B1.5; no real logos) ---- */
export function AirlineMark({ code, small }: { code: string; small?: boolean }) {
  return <span className={`a-mark${small ? ' -small' : ''}`} aria-hidden="true">{code}</span>;
}

/* ---- one leg on a card: airline, time and airport, the route line with stop dots, time and airport ---- */
function Leg({ s }: { s: Slice }) {
  const next = Math.floor(s.arr / 1440);
  const carrier = s.segments[0].airline;
  return (
    <span className="m-leg">
      <span className="m-leg__carrier"><AirlineMark code={carrier} small /><span className="m-leg__airline">{AIRLINES[carrier]?.name}</span></span>
      <span className="m-leg__end">
        <span className="m-leg__time">{clock(s.dep)}</span>
        <span className="m-leg__code">{s.from}</span>
      </span>
      <span className="m-leg__mid">
        <span className="m-leg__dur">{duration(s.dur)}</span>
        <span className="m-leg__line">{s.layovers.map((l) => <span className="m-leg__dot" key={l.at} />)}</span>
        <span className="m-leg__stops">{s.stops ? `${stopsLabel(s.stops)}, ${s.layovers.map((l) => `${l.at} ${duration(l.dur)}`).join(', ')}` : 'Nonstop'}</span>
      </span>
      <span className="m-leg__end -to">
        <span className="m-leg__time">{clock(s.arr)}{next > 0 && <sup className="m-leg__next"><span aria-hidden="true">+{next}</span><span className="sr-only">, arrives the next day</span></sup>}</span>
        <span className="m-leg__code">{s.to}</span>
      </span>
    </span>
  );
}

/* ---- the included items of the shown fare, ticked or for a fee, each with its words in a tooltip ---- */
function Included({ fare }: { fare: Fare }) {
  const bags = bagCount(fare.rows?.checkedBag);
  const items = [
    { icon: 'bag-cabin', on: fareHas.cabin(fare), text: fareHas.cabin(fare) ? fare.rows!.cabinBag : 'Cabin bag for a fee' },
    { icon: 'bag-checked', on: bags > 0, text: bags > 0 ? fare.rows!.checkedBag : 'Checked bag for a fee', count: bags > 1 ? bags : 0 },
    { icon: 'seat', on: fareHas.seat(fare), text: fareHas.seat(fare) ? fare.rows!.seatChoice : 'Seat assigned at check-in, choose one for a fee' },
    { icon: 'change', on: fareHas.changes(fare), text: fareHas.changes(fare) ? fare.rows!.changes.replace(/^For a fee:\s*/i, 'For a fee: ') : 'Changes not allowed' }
  ];
  return (
    <ul className="m-fcard__incl" aria-label={`In the ${fare.name} fare`}>
      {items.map((it) => (
        <li className={`m-fcard__inc${it.on ? ' is-on' : ''}`} key={it.icon} data-tip={it.text}>
          <Glyph name={it.icon} size="s" /><span className="sr-only">{it.text}</span>
          {it.count ? <span className="m-fcard__incCount" aria-hidden="true">{it.count}</span> : null}
          <span className="m-fcard__incMark" aria-hidden="true">{it.on ? <Icon name="tick" /> : <Icon name="plus" />}</span>
        </li>
      ))}
    </ul>
  );
}

function FlightCard({ o, fare, search, tags }: { o: Offer; fare: Fare; search: FlightSearch; tags: string[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const t = priceAt(o, fare);
  const n = travelers(o.passengers);
  const each = money(Math.round(t / Math.max(1, n)));
  const op = o.slices.flatMap((s) => s.segments).find((g) => g.operatedBy)?.operatedBy;
  const save = fare.id === 'light' ? saving(o, search) : 0;
  const href = `/flights/${o.id}${fare.id === 'light' ? '' : `?fare=${fare.id}`}`;
  return (
    <li className={`m-fcard${open ? ' is-open' : ''}`}>
      <div className="m-fcard__top">
        <div className="m-fcard__body">
          {(tags.length > 0 || save > 0) && (
            <span className="m-fcard__tags">
              {tags.map((x) => <span className="m-fcard__tag" key={x}>{x}</span>)}
              {save > 0 && <Save>{money(save).replace('.00', '')} under the typical fare</Save>}
            </span>
          )}
          <span className="m-fcard__legs">{o.slices.map((s, i) => <Leg s={s} key={i} />)}</span>
          <div className="m-fcard__foot">
            <Included fare={fare} />
            {(op || o.warnings.length > 0) && (
              <span className="m-fcard__notes">
                {op && <span className="m-fcard__note">Operated by {AIRLINES[op].name}</span>}
                {o.warnings.map((w) => <span className="m-fcard__note -warn" key={w}><Icon name="info" size="s" />{w}</span>)}
              </span>
            )}
            <button className="m-fcard__toggle" type="button" aria-expanded={open} aria-controls={`${id}-d`} onClick={() => setOpen(!open)}>
              Flight details<Icon name="chev-down" size="s" />
            </button>
          </div>
        </div>
        <div className="m-fcard__stub">
          <span className="m-fcard__total">{money(t)}</span>
          <span className="m-fcard__for">total for {travelersWord(n)}, taxes and fees included</span>
          {n > 1 && <span className="m-fcard__each">{each} a person</span>}
          <span className="m-fcard__fare">{fare.name} fare</span>
          <Link className="a-button -small -steady m-fcard__select" href={href} prefetch={false} aria-label={`Select. ${cardSpoken(o.owner, o.slices, money(t), n)} ${fare.name} fare.`}>
            <span className="a-button__label">Select</span>
          </Link>
        </div>
      </div>
      <div className="m-fcard__details" id={`${id}-d`} hidden={!open}>
        {open && (
          <>
            <Itinerary slices={o.slices} cabin={o.cabin} origin={search.from} headingLevel={4} />
            <div className="m-fcard__fareBox">
              <h4 className="m-fcard__fareTitle">In the {fare.name} fare</h4>
              <ul className="m-fcard__fareList">
                {[...fare.included.map((x) => ({ x, on: true })), ...fare.fee.map((x) => ({ x: `${x}, for a fee`, on: false })), ...fare.notIncluded.map((x) => ({ x, on: false }))].map(({ x, on }) => (
                  <li key={x} className={on ? 'is-on' : ''}><span className="m-fcard__incMark" aria-hidden="true">{on ? <Icon name="tick" /> : <Icon name="plus" />}</span>{x}</li>
                ))}
              </ul>
            </div>
            <dl className="m-fcard__facts">
              <div><dt>Total travel time</dt><dd>{o.slices.map((s, i) => `${i ? 'Return' : 'Outbound'} ${duration(s.dur)}`).join(', ')}</dd></div>
              {layOf(o) > 0 && <div><dt>Longest layover</dt><dd>{duration(layOf(o))}</dd></div>}
              <div><dt>Sold by</dt><dd>{AIRLINES[o.owner]?.name}</dd></div>
            </dl>
          </>
        )}
      </div>
    </li>
  );
}

/* ---- the filter groups, shared by the desktop column, the 1024 drawer and the phone sheet ---- */
function FGroup({ title, onClear, canClear, children, id }: { title: string; onClear: () => void; canClear: boolean; children: React.ReactNode; id?: string }) {
  return (
    <div className="m-fgroup" id={id}>
      <details className="m-fgroup__box" open>
        <summary className="m-fgroup__head"><span className="m-fgroup__title">{title}</span><Icon name="chev-down" size="s" /></summary>
        <div className="m-fgroup__body">{children}</div>
      </details>
      {canClear && <button className="m-fgroup__clear a-link" type="button" onClick={onClear} aria-label={`Clear ${title}`}>Clear</button>}
    </div>
  );
}

function FilterPanel({ offers, f, set, search, idp }: { offers: Offer[]; f: Filters; set: (f: Filters) => void; search: FlightSearch; idp: string }) {
  const [allAirlines, setAllAirlines] = useState(false);
  /* `priceWith`: the filters the option would set, so a bag or flexibility option is priced at the cheapest fare that meets it */
  const facet = (g: Group, test: (o: Offer) => boolean, fx: Filters = f, priceWith?: Filters) => {
    const list = offers.filter((o) => passes(o, fx, g) && test(o));
    return { n: list.length, low: list.length ? Math.min(...list.map((o) => priceAt(o, fareFit(o, priceWith ?? fx)))) : null };
  };
  const clear = (g: Group) => set({ ...f, ...CLEAR[g] });
  /* the slider's range: what the flights cost at the fares the bag and flexibility filters pick (the lowest fares when none fit) */
  const priced = useMemo(() => {
    const p = offers.map((o) => priceAt(o, fareFit(o, { ...f, maxPrice: null }))).filter(Number.isFinite);
    return p.length ? p : offers.map((o) => offerTotals(o, 'light').total);
  }, [offers, f]);
  const pr = useMemo(() => [Math.floor(Math.min(...priced) / 1000) * 1000, Math.ceil(Math.max(...priced) / 1000) * 1000], [priced]);
  const hist = useMemo(() => {
    const bins = Array(24).fill(0) as number[];
    const span = Math.max(1, pr[1] - pr[0]);
    priced.forEach((p) => { bins[Math.min(23, Math.floor(((p - pr[0]) / span) * 24))]++; });
    const top = Math.max(1, ...bins);
    return bins.map((b) => b / top);
  }, [priced, pr]);
  const durR = useMemo(() => { const d = offers.map(longest); return [Math.floor(Math.min(...d) / 15) * 15, Math.ceil(Math.max(...d) / 15) * 15]; }, [offers]);
  const layR = useMemo(() => { const d = offers.map(layOf).filter((x) => x > 0); return d.length ? [Math.floor(Math.min(...d) / 15) * 15, Math.ceil(Math.max(...d) / 15) * 15] : null; }, [offers]);
  const airlines = useMemo(() => [...new Set(offers.map((o) => o.owner))].sort((a, b) => AIRLINES[a].name.localeCompare(AIRLINES[b].name)), [offers]);
  const vias = useMemo(() => [...new Set(offers.flatMap(viasOf))].sort(), [offers]);
  const price = f.maxPrice ?? pr[1];
  const dur = f.maxDur ?? durR[1];
  const lay = f.maxLay ?? layR?.[1] ?? 0;
  const legs: [string, string][] = search.ret ? [[`Leaving ${cityOf(search.from)}`, `Leaving ${cityOf(search.to)}`], [`Arriving in ${cityOf(search.to)}`, `Arriving in ${cityOf(search.from)}`]] : [[`Leaving ${cityOf(search.from)}`, ''], [`Arriving in ${cityOf(search.to)}`, '']];
  const shownAirlines = allAirlines ? airlines : airlines.slice(0, 6);

  const tiles = (kind: 'dep' | 'arr', leg: 0 | 1) => (
    <div className="m-ftiles" role="group" aria-label={legs[kind === 'dep' ? 0 : 1][leg]}>
      {BUCKETS.map((b) => {
        const on = f[kind][leg].includes(b.id);
        const { n } = facet(kind, (o) => !!o.slices[leg] && b.test(((kind === 'dep' ? o.slices[leg].dep : o.slices[leg].arr) % 1440 + 1440) % 1440));
        return (
          <button key={b.id} type="button" className="m-ftile" aria-pressed={on} disabled={!n && !on}
            onClick={() => { const next = [...f[kind]] as [Bucket[], Bucket[]]; next[leg] = toggle(next[leg], b.id); set({ ...f, [kind]: next }); }}>
            <Icon name={b.icon} size="s" />
            <span className="m-ftile__label">{b.label}</span>
            <span className="m-ftile__range">{b.range}</span>
            <span className="m-ftile__count">{n}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="m-filters">
      <FGroup id={`${idp}-g-stops`} title="Stops" canClear={f.stops.length > 0} onClear={() => clear('stops')}>
        {STOPS.map((s) => {
          const { n, low } = facet('stops', (o) => stopsOf(o) === s.id);
          return (
            <label className="m-filterRow" key={s.id}>
              <input className="m-filterRow__input" type="checkbox" checked={f.stops.includes(s.id)} disabled={!n && !f.stops.includes(s.id)} onChange={() => set({ ...f, stops: toggle(f.stops, s.id) })} />
              <span className="m-filterRow__label">{s.label} <span className="m-filterRow__count">{n}</span></span>
              {low !== null && <span className="m-filterRow__price">from {money(low)}</span>}
            </label>
          );
        })}
      </FGroup>

      <FGroup title="Price" canClear={f.maxPrice !== null} onClear={() => clear('price')}>
        <label className="sr-only" htmlFor={`${idp}-price`}>Total price</label>
        <p className="m-filterGroup__value" id={`${idp}-price-v`}>Up to ${Math.round(price / 100).toLocaleString('en-US')}</p>
        <div className="m-hist" aria-hidden="true">
          {hist.map((h, i) => <span key={i} className={`m-hist__bar${pr[0] + ((i + 1) / 24) * (pr[1] - pr[0]) <= price + 1 ? ' is-in' : ''}`} style={{ height: `${Math.max(6, h * 100)}%` }} />)}
        </div>
        <input className="a-range m-hist__range" style={rangeFill(price, pr[0], pr[1])} id={`${idp}-price`} type="range" min={pr[0]} max={pr[1]} step={1000} value={price} aria-describedby={`${idp}-price-v`}
          aria-valuetext={`Up to $${Math.round(price / 100).toLocaleString('en-US')}`} onChange={(e) => { const v = +e.target.value; set({ ...f, maxPrice: v >= pr[1] ? null : v }); }} />
        <p className="m-filterGroup__ends"><span>{money(pr[0]).replace('.00', '')}</span><span>{money(pr[1]).replace('.00', '')}</span></p>
      </FGroup>

      <FGroup id={`${idp}-g-airlines`} title="Airlines" canClear={f.airlines.length > 0} onClear={() => clear('airlines')}>
        {shownAirlines.map((code) => {
          const { n, low } = facet('airlines', (o) => o.owner === code);
          const on = f.airlines.includes(code);
          return (
            <div className="m-filterRow -airline" key={code}>
              <label className="m-filterRow__main">
                <input className="m-filterRow__input" type="checkbox" checked={on} onChange={() => set({ ...f, airlines: toggle(f.airlines, code) })} />
                <AirlineMark code={code} small />
                <span className="m-filterRow__label">{AIRLINES[code].name} <span className="m-filterRow__count">{n}</span></span>
              </label>
              <button className="m-filterRow__only" type="button" aria-label={`Show only ${AIRLINES[code].name}`} onClick={() => set({ ...f, airlines: [code] })}>Only</button>
              {low !== null && <span className="m-filterRow__price">from {money(low)}</span>}
            </div>
          );
        })}
        {airlines.length > 6 && (
          <button className="a-link m-filterGroup__all" type="button" aria-expanded={allAirlines} onClick={() => setAllAirlines(!allAirlines)}>
            {allAirlines ? 'Show fewer' : `Show all ${airlines.length} airlines`}
          </button>
        )}
      </FGroup>

      <FGroup id={`${idp}-g-dep`} title="Departure times" canClear={f.dep[0].length + f.dep[1].length > 0} onClear={() => clear('dep')}>
        <p className="m-fgroup__sub">{legs[0][0]}</p>
        {tiles('dep', 0)}
        {search.ret && <><p className="m-fgroup__sub">{legs[0][1]}</p>{tiles('dep', 1)}</>}
      </FGroup>

      <FGroup title="Arrival times" canClear={f.arr[0].length + f.arr[1].length > 0} onClear={() => clear('arr')}>
        <p className="m-fgroup__sub">{legs[1][0]}</p>
        {tiles('arr', 0)}
        {search.ret && <><p className="m-fgroup__sub">{legs[1][1]}</p>{tiles('arr', 1)}</>}
      </FGroup>

      <FGroup title="Total travel time" canClear={f.maxDur !== null} onClear={() => clear('dur')}>
        <label className="sr-only" htmlFor={`${idp}-dur`}>Total travel time</label>
        <p className="m-filterGroup__value" id={`${idp}-dur-v`}>Up to {duration(dur)}</p>
        <input className="a-range" style={rangeFill(dur, durR[0], durR[1])} id={`${idp}-dur`} type="range" min={durR[0]} max={durR[1]} step={15} value={dur} aria-describedby={`${idp}-dur-v`}
          aria-valuetext={`Up to ${duration(dur)}`} onChange={(e) => { const v = +e.target.value; set({ ...f, maxDur: v >= durR[1] ? null : v }); }} />
        <p className="m-filterGroup__ends"><span>{duration(durR[0])}</span><span>{duration(durR[1])}</span></p>
      </FGroup>

      {layR && (
        <FGroup title="Layover" canClear={f.maxLay !== null || f.noVia.length > 0} onClear={() => set({ ...f, maxLay: null, noVia: [] })}>
          <label className="sr-only" htmlFor={`${idp}-lay`}>Longest layover</label>
          <p className="m-filterGroup__value" id={`${idp}-lay-v`}>Layovers up to {duration(lay)}</p>
          <input className="a-range" style={rangeFill(lay, layR[0], layR[1])} id={`${idp}-lay`} type="range" min={layR[0]} max={layR[1]} step={15} value={lay} aria-describedby={`${idp}-lay-v`}
            aria-valuetext={`Layovers up to ${duration(lay)}`} onChange={(e) => { const v = +e.target.value; set({ ...f, maxLay: v >= layR[1] ? null : v }); }} />
          <p className="m-fgroup__sub">Connecting airports</p>
          {vias.map((v) => {
            const { n } = facet('via', (o) => viasOf(o).includes(v));
            return (
              <label className="m-filterRow" key={v}>
                <input className="m-filterRow__input" type="checkbox" checked={!f.noVia.includes(v)} onChange={() => set({ ...f, noVia: toggle(f.noVia, v) })} />
                <span className="m-filterRow__label"><span className="m-filterRow__code">{v}</span> {airport(v)?.city} <span className="m-filterRow__count">{n}</span></span>
              </label>
            );
          })}
        </FGroup>
      )}

      <FGroup title="Bags" canClear={f.bags.length > 0} onClear={() => clear('bags')}>
        {BAGS.map((b) => {
          const opt: Filters = { ...f, bags: [...f.bags.filter((x) => x !== b.id), b.id] };
          const { n, low } = facet('bags', (o) => !!fareFit(o, opt), f, opt);
          return (
            <label className="m-filterRow" key={b.id}>
              <input className="m-filterRow__input" type="checkbox" checked={f.bags.includes(b.id)} disabled={!n && !f.bags.includes(b.id)} onChange={() => set({ ...f, bags: toggle(f.bags, b.id) })} />
              <Glyph name={b.id === 'cabin' ? 'bag-cabin' : 'bag-checked'} size="s" />
              <span className="m-filterRow__label">{b.label} <span className="m-filterRow__count">{n}</span></span>
              {low !== null && <span className="m-filterRow__price">from {money(low)}</span>}
            </label>
          );
        })}
      </FGroup>

      <FGroup title="Fare flexibility" canClear={f.flex.length > 0} onClear={() => clear('flex')}>
        {FLEX.map((b) => {
          const opt: Filters = { ...f, flex: [...f.flex.filter((x) => x !== b.id), b.id] };
          const { n, low } = facet('flex', (o) => !!fareFit(o, opt), f, opt);
          return (
            <label className="m-filterRow" key={b.id}>
              <input className="m-filterRow__input" type="checkbox" checked={f.flex.includes(b.id)} disabled={!n && !f.flex.includes(b.id)} onChange={() => set({ ...f, flex: toggle(f.flex, b.id) })} />
              <Glyph name={b.id === 'changes' ? 'change' : 'refund'} size="s" />
              <span className="m-filterRow__label">{b.label} <span className="m-filterRow__count">{n}</span></span>
              {low !== null && <span className="m-filterRow__price">from {money(low)}</span>}
            </label>
          );
        })}
      </FGroup>
    </div>
  );
}

/* ---- active filters as removable chips ---- */
function chipList(f: Filters, search: FlightSearch): { key: string; label: string; next: Filters }[] {
  const out: { key: string; label: string; next: Filters }[] = [];
  f.stops.forEach((s) => out.push({ key: `s${s}`, label: STOPS.find((x) => x.id === s)!.label, next: { ...f, stops: f.stops.filter((x) => x !== s) } }));
  if (f.maxPrice !== null) out.push({ key: 'p', label: `Up to ${money(f.maxPrice).replace('.00', '')}`, next: { ...f, maxPrice: null } });
  f.airlines.forEach((a) => out.push({ key: `a${a}`, label: AIRLINES[a].name, next: { ...f, airlines: f.airlines.filter((x) => x !== a) } }));
  (['dep', 'arr'] as const).forEach((k) => [0, 1].forEach((leg) => f[k][leg].forEach((b) => {
    const next = [...f[k]] as [Bucket[], Bucket[]]; next[leg] = next[leg].filter((x) => x !== b);
    const city = k === 'dep' ? cityOf(leg ? search.to : search.from) : cityOf(leg ? search.from : search.to);
    out.push({ key: `${k}${leg}${b}`, label: `${BUCKETS.find((x) => x.id === b)!.label}, ${k === 'dep' ? 'leaving' : 'arriving in'} ${city}`, next: { ...f, [k]: next } });
  })));
  if (f.maxDur !== null) out.push({ key: 'd', label: `Up to ${duration(f.maxDur)}`, next: { ...f, maxDur: null } });
  if (f.maxLay !== null) out.push({ key: 'l', label: `Layovers up to ${duration(f.maxLay)}`, next: { ...f, maxLay: null } });
  f.noVia.forEach((v) => out.push({ key: `v${v}`, label: `Not via ${v}`, next: { ...f, noVia: f.noVia.filter((x) => x !== v) } }));
  f.bags.forEach((b) => out.push({ key: `b${b}`, label: BAGS.find((x) => x.id === b)!.label, next: { ...f, bags: f.bags.filter((x) => x !== b) } }));
  f.flex.forEach((b) => out.push({ key: `x${b}`, label: FLEX.find((x) => x.id === b)!.label, next: { ...f, flex: f.flex.filter((x) => x !== b) } }));
  return out;
}

/* ---- the date-price strip (spec B1.1) ---- */
function DateStrip({ days, search }: { days: Day[]; search: FlightSearch }) {
  const ref = useRef<HTMLOListElement>(null);
  const shown = days.filter((d) => d.total !== null);
  const low = shown.length ? Math.min(...shown.map((d) => d.total!)) : 0;
  const today = useMemo(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }, []);
  const hrefFor = (depart: string, ret: string | null) => `/flights?${searchQuery({ ...search, depart, ret })}`;
  const back = addIsoDays(search.depart, -7);
  const backOk = back >= today;
  const shift = search.ret ? 7 : 0;
  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>('[aria-current="date"]');
    const list = ref.current;
    if (el && list && list.scrollWidth > list.clientWidth) list.scrollLeft = el.offsetLeft - list.clientWidth / 2 + el.offsetWidth / 2;
  }, [days]);
  if (!shown.length) return null;
  return (
    <nav className="m-dates" aria-label="Prices on nearby dates">
      {backOk ? (
        <Link className="m-dates__arrow" href={hrefFor(back, search.ret ? addIsoDays(search.ret, -shift) : null)} prefetch={false} aria-label="Earlier dates"><Icon name="chev-left" /></Link>
      ) : <span className="m-dates__arrow is-off" aria-hidden="true"><Icon name="chev-left" /></span>}
      <ol className="m-dates__list" ref={ref}>
        {shown.map((d) => {
          const on = d.depart === search.depart;
          const cheap = d.total === low;
          return (
            <li key={d.depart}>
              <Link className={`m-dates__cell${on ? ' is-on' : ''}${cheap ? ' is-low' : ''}`} href={hrefFor(d.depart, d.ret)} prefetch={false} aria-current={on ? 'date' : undefined}
                aria-label={`${dayShort(d.depart)}${d.ret ? ` to ${dayShort(d.ret)}` : ''}, from ${money(d.total!)}${cheap ? ', lowest of these dates' : ''}`}>
                <span className="m-dates__cap" aria-hidden="true" />
                <span className="m-dates__day">{dayShort(d.depart)}</span>
                {d.ret && <span className="m-dates__ret">to {dayShort(d.ret).slice(5)}</span>}
                <span className="m-dates__price">{money(d.total!).replace(/\.\d\d$/, '')}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      <Link className="m-dates__arrow" href={hrefFor(addIsoDays(search.depart, 7), search.ret ? addIsoDays(search.ret, shift) : null)} prefetch={false} aria-label="Later dates"><Icon name="chev-right" /></Link>
    </nav>
  );
}

export function FlightResults({ query, search }: { query: string; search: FlightSearch }) {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [slow, setSlow] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [days, setDays] = useState<Day[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [f, setF] = useState<Filters>(NONE);
  const [sort, setSort] = useState<Sort>('best');
  const [sheet, setSheet] = useState<'filters' | 'sort' | null>(null);
  /* phones (spec B1.9): the chip row opens the filter sheet at the group it names */
  const [jump, setJump] = useState<string | null>(null);
  useEffect(() => {
    if (sheet !== 'filters' || !jump) return;
    const t = window.setTimeout(() => { document.getElementById(`fs-g-${jump}`)?.scrollIntoView({ block: 'start' }); setJump(null); }, 60);
    return () => window.clearTimeout(t);
  }, [sheet, jump]);
  const [announce, setAnnounce] = useState('');
  const [limit, setLimit] = useState(15);
  const [expired, setExpired] = useState(false);
  const errRef = useRef<HTMLDivElement>(null);
  const restore = useRef<{ y: number; limit: number } | null>(null);
  const from = cityOf(search.from), to = cityOf(search.to);
  const n = travelers(search);

  /* the offers of this search, with its filters and sort, live in sessionStorage until they expire (30 minutes),
     so coming back from a flight shows the page as it was left (final pass, 11 Nov) */
  const cacheKey = `overwing:flights:${query}`;
  /* visitor history (spec 0.6, lib/history.ts): this search feeds "Pick up where you left off" on the home page */
  useEffect(() => {
    recordSearch({ mode: 'flights', from: search.from, to: search.to, depart: search.depart, return: search.ret, adults: search.adults, children: search.children, infants: search.infants, cabin: search.cabin });
  }, [search.from, search.to, search.depart, search.ret, search.adults, search.children, search.infants, search.cabin]);
  useEffect(() => {
    if (!attempt) {
      try {
        const c = JSON.parse(sessionStorage.getItem(cacheKey) || 'null') as { offers: Offer[]; days?: Day[]; f?: Filters; sort?: Sort; y?: number; limit?: number } | null;
        if (c && c.offers && c.offers.length && c.offers.every((o) => o.expiresAt > Date.now()) && c.f && Array.isArray(c.f.stops)) {
          if (typeof c.y === 'number') restore.current = { y: c.y, limit: c.limit || 15 };
          setOffers(c.offers); setDays(c.days || []); setF(c.f || NONE); setSort(c.sort || 'best'); setSlow(false); setStatus('done'); setExpired(false);
          setAnnounce(`${plural(c.offers.length, 'flight', 'flights')} found`);
          document.title = `Flights from ${from} to ${to} | Overwing`;
          return;
        }
      } catch (e) { void e; }
    }
    const ctl = new AbortController();
    setStatus('loading'); setSlow(false); setF(NONE); setSort('best'); setAnnounce(''); setExpired(false);
    document.title = 'Searching flights | Overwing';
    const t = window.setTimeout(() => setSlow(true), 4000);
    fetch(`/api/flights/search?${query}${attempt ? '&retry=1' : ''}`, { signal: ctl.signal })
      .then((r) => r.json())
      .then((j: { data?: { offers: Offer[]; days?: Day[] }; errors?: unknown[] }) => {
        if (!j.data || j.errors) throw new Error('search failed');
        setOffers(j.data.offers); setDays(j.data.days || []);
        try { sessionStorage.setItem(cacheKey, JSON.stringify({ offers: j.data.offers, days: j.data.days || [], f: NONE, sort: 'best' })); } catch (e) { void e; }
        setStatus('done');
        setAnnounce(`${plural(j.data.offers.length, 'flight', 'flights')} found`);
      })
      .catch((e) => { if (!ctl.signal.aborted) { setStatus('error'); requestAnimationFrame(() => errRef.current?.focus()); void e; } })
      .finally(() => { window.clearTimeout(t); if (!ctl.signal.aborted) document.title = `Flights from ${from} to ${to} | Overwing`; });
    return () => { ctl.abort(); window.clearTimeout(t); };
  }, [query, attempt, from, to, cacheKey]);
  useEffect(() => {
    if (status !== 'done') return;
    try {
      const c = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
      if (c) sessionStorage.setItem(cacheKey, JSON.stringify({ ...c, f, sort }));
    } catch (e) { void e; }
  }, [f, sort, status, cacheKey]);
  /* the offers expire 30 minutes after the search (Duffel's expires_at): the list says so and offers a new search */
  useEffect(() => {
    if (status !== 'done' || !offers.length) return;
    const at = Math.min(...offers.map((o) => o.expiresAt));
    const tick = () => { if (Date.now() >= at) setExpired(true); };
    tick();
    const t = window.setInterval(tick, 15000);
    return () => window.clearInterval(t);
  }, [status, offers]);

  const fits = useMemo(() => new Map(offers.map((o) => [o.id, fareFit(o, f)])), [offers, f]);
  const shown = useMemo(() => offers.filter((o) => passes(o, f)), [offers, f]);
  const price = (o: Offer) => priceAt(o, fits.get(o.id) ?? null);
  const order = useMemo(() => {
    const by: Record<Sort, Offer[]> = {} as Record<Sort, Offer[]>;
    if (!shown.length) { SORTS.forEach((s) => (by[s.id] = [])); return by; }
    const pt = (o: Offer) => priceAt(o, fits.get(o.id) ?? null);
    const minT = Math.min(...shown.map(pt)), minD = Math.min(...shown.map(tripDur));
    const score = (o: Offer) => pt(o) / minT + (tripDur(o) / minD) * 0.7 + o.slices.reduce((a, s) => a + s.stops, 0) * 0.15;
    const arrAbs = (o: Offer) => o.slices[0].arr;
    by.best = [...shown].sort((a, b) => score(a) - score(b));
    by.cheapest = [...shown].sort((a, b) => pt(a) - pt(b) || tripDur(a) - tripDur(b));
    /* ties on time go to the lower total (critic, 11 Nov) */
    by.fastest = [...shown].sort((a, b) => tripDur(a) - tripDur(b) || pt(a) - pt(b));
    by.earliest = [...shown].sort((a, b) => a.slices[0].dep - b.slices[0].dep || pt(a) - pt(b));
    by.latest = [...shown].sort((a, b) => b.slices[0].dep - a.slices[0].dep || pt(a) - pt(b));
    by.arrival = [...shown].sort((a, b) => arrAbs(a) - arrAbs(b) || pt(a) - pt(b));
    by.layover = [...shown].sort((a, b) => layTotal(a) - layTotal(b) || pt(a) - pt(b));
    return by;
  }, [shown, fits]);
  const list = order[sort] ?? [];

  useEffect(() => { setLimit(restore.current?.limit ?? 15); }, [f, sort]);
  useEffect(() => {
    const r = restore.current;
    if (!r || status !== 'done' || limit !== r.limit) return;
    restore.current = null;
    requestAnimationFrame(() => window.scrollTo(0, r.y));
    try {
      const c = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
      if (c) { delete c.y; delete c.limit; sessionStorage.setItem(cacheKey, JSON.stringify(c)); }
    } catch (err) { void err; }
  }, [status, limit, cacheKey]);
  function remember(e: React.MouseEvent) {
    if (!(e.target as HTMLElement).closest('a[href^="/flights/"]')) return;
    try {
      const c = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
      if (c) sessionStorage.setItem(cacheKey, JSON.stringify({ ...c, y: Math.round(window.scrollY), limit }));
    } catch (err) { void err; }
  }

  const groups = active(f);
  const filtered = groups.length > 0;
  const countText = filtered ? `Showing ${shown.length} of ${plural(offers.length, 'flight', 'flights')}` : plural(offers.length, 'flight', 'flights');
  useEffect(() => { if (status === 'done' && filtered) setAnnounce(countText); }, [countText, filtered, status]);
  const chips = chipList(f, search);
  const tags = useMemo(() => {
    const m = new Map<string, string[]>();
    const add = (o: Offer | undefined, t: string) => { if (!o) return; const l = m.get(o.id) ?? []; if (l.length < 2) l.push(t); m.set(o.id, l); };
    add(order.best?.[0], 'Best'); add(order.cheapest?.[0], 'Cheapest'); add(order.fastest?.[0], 'Fastest');
    return m;
  }, [order]);
  /* each tab shows the top flight of its own sort, the same flight its card tag names, so a tab, its sort and the
     tagged card always agree (a runner-up in the Best tab read as a second "Best" flight; Developer B, round 3).
     When one flight wins two tabs both show it. Fastest ties break by price, as the sort does. */
  const tabPick = { best: order.best?.[0], cheapest: order.cheapest?.[0], fastest: order.fastest?.[0] };
  const summary = (['best', 'cheapest', 'fastest'] as const).map((id) => {
    const o = tabPick[id];
    return { id, label: SORTS.find((s) => s.id === id)!.label, total: o ? money(price(o)) : '', time: o ? duration(longest(o)) : '' };
  });
  const sortLabel = SORTS.find((s) => s.id === sort)!.label;

  if (status === 'error') {
    return (
      <div className="o-results -single">
        <Notice ref={errRef} title="We couldn’t reach the airlines just now"
          actions={<button className="a-button" type="button" onClick={() => setAttempt((a) => a + 1)}><span className="a-button__label">Try again</span></button>}>
          <p>Your search didn’t finish. Nothing has been booked. Try again in a moment.</p>
        </Notice>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="o-results">
        <div className="o-results__side" aria-hidden="true"><div className="m-skeleton -tall" /><div className="m-skeleton -tall" /><div className="m-skeleton -tall" /></div>
        <div className="o-results__main" aria-busy="true">
          <div className="m-dates -skeleton" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <span className="m-skeleton m-dates__ghost" key={i} />)}</div>
          <Searching line="Checking fares with the airlines" rows={5} slow={slow ? 'Still looking. Some airlines take a few seconds to answer.' : ''} />
        </div>
        <p className="sr-only" role="status">{announce}</p>
      </div>
    );
  }

  if (!offers.length) {
    return (
      <div className="o-results -single">
        <Notice title="No flights on these dates"
          actions={<button className="a-button" type="button" onClick={() => requestSearch('flights', 'dates')}><span className="a-button__label">Change dates</span></button>}>
          <p>We couldn’t find flights from {from} to {to} on {dayShort(search.depart)}. Try a day or two either side.</p>
        </Notice>
        <p className="sr-only" role="status">{announce}</p>
      </div>
    );
  }

  const filterButton = (cls: string) => (
    <button className={`a-choice ${cls}`} type="button" aria-haspopup="dialog" onClick={() => setSheet('filters')}>
      <Icon name="filter" size="s" />{groups.length ? `Filters, ${chips.length}` : 'Filters'}
    </button>
  );

  return (
    <div className="o-results -flights" onClickCapture={remember}>
      <aside className="o-results__side" aria-label="Filters">
        <div className="o-results__sideHead">
          <h2 className="o-results__sideTitle">Filters</h2>
          <button className="a-link" type="button" disabled={!filtered} onClick={() => setF(NONE)}>Clear all</button>
        </div>
        <FilterPanel offers={offers} f={f} set={setF} search={search} idp="f" />
      </aside>

      <div className="o-results__main">
        <DateStrip days={days} search={search} />

        {expired && (
          <div className="o-results__expired">
            <Notice tone="warn" icon="alert" title="These prices have expired"
              actions={<button className="a-button" type="button" onClick={() => { try { sessionStorage.removeItem(cacheKey); } catch (e) { void e; } setAttempt((a) => a + 1); }}><span className="a-button__label">Search again</span></button>}>
              <p>Airline prices are only valid for a short time after a search. Search again to see current fares.</p>
            </Notice>
          </div>
        )}

        <div className="m-stabs" role="group" aria-label="Sort by">
          {summary.map((s) => (
            <button key={s.id} type="button" className="m-stabs__tab" aria-pressed={sort === s.id} disabled={!s.total} onClick={() => setSort(s.id)}>
              <span className="m-stabs__label">{s.label}</span>
              <span className="m-stabs__price">{s.total}</span>
              <span className="m-stabs__time">{s.time}</span>
            </button>
          ))}
        </div>

        <div className="o-results__bar">
          <p className="o-results__count">{countText}</p>
          <div className="o-results__tools">
            {filterButton('o-results__drawerOnly')}
            <div className="o-results__phoneRow" role="group" aria-label="Filter and sort">
              {filterButton('')}
              {[{ g: 'stops', l: 'Stops' }, { g: 'airlines', l: 'Airlines' }, { g: 'dep', l: 'Times' }].map((c) => (
                <button key={c.g} className="a-choice" type="button" aria-haspopup="dialog" onClick={() => { setJump(c.g); setSheet('filters'); }}>{c.l}<Icon name="chev-down" size="s" /></button>
              ))}
              <button className="a-choice" type="button" aria-haspopup="dialog" onClick={() => setSheet('sort')}><Icon name="sort" size="s" />Sort: {sortLabel}</button>
            </div>
            <button className="a-choice o-results__phoneOnly" type="button" aria-haspopup="dialog" onClick={() => setSheet('sort')}>
              <Icon name="sort" size="s" />Sort: {sortLabel}
            </button>
            <label className="m-sortPill o-results__deskOnly">
              <span className="sr-only">More sorts</span>
              <span className="m-sortPill__text" aria-hidden="true"><Icon name="sort" size="s" />{['best', 'cheapest', 'fastest'].includes(sort) ? 'More sorts' : `Sort: ${sortLabel}`}<Icon name="chev-down" size="s" /></span>
              <select className="m-sortPill__select" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}{order[s.id]?.[0] ? `, from ${money(price(order[s.id][0]))}` : ''}</option>)}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="o-results__active" role="group" aria-label="Active filters">
            {chips.map((c) => (
              <button key={c.key} className="m-activeChip" type="button" onClick={() => setF(c.next)} aria-label={`Remove filter: ${c.label}`}>
                {c.label}<Icon name="close" size="s" />
              </button>
            ))}
            <button className="a-link o-results__clearAll" type="button" onClick={() => setF(NONE)}>Clear all</button>
          </div>
        )}
        <p className="o-results__note">Prices are totals for {travelersWord(n)}, taxes and fees included.</p>

        {list.length ? (
          <>
            <ul className="o-results__list">
              {list.slice(0, limit).map((o) => <FlightCard o={o} fare={fits.get(o.id)!} search={search} key={o.id} tags={tags.get(o.id) ?? []} />)}
            </ul>
            {limit < list.length && (
              <div className="o-results__moreRow">
                <p className="o-results__shown">{`Showing ${Math.min(limit, list.length)} of ${plural(list.length, 'flight', 'flights')}`}</p>
                <button className="a-button -outline" type="button" onClick={() => setLimit((l) => l + 15)}><span className="a-button__label">Show more flights</span></button>
              </div>
            )}
          </>
        ) : (
          <Notice title="No flights match your filters"
            actions={<button className="a-button" type="button" onClick={() => setF(NONE)}><span className="a-button__label">Clear filters</span></button>}>
            <p>{plural(offers.length, 'flight', 'flights')} match your search without them. Try removing one.</p>
            <div className="o-results__bring" role="group" aria-label="Remove a filter">
              {groups.map((g) => {
                const back = offers.filter((o) => passes(o, f, g)).length;
                return back ? (
                  <button key={g} className="m-activeChip" type="button" onClick={() => setF({ ...f, ...CLEAR[g] })}>
                    Remove {GROUP_NAME[g].toLowerCase()} <span className="m-activeChip__n">{plural(back, 'flight', 'flights')}</span><Icon name="close" size="s" />
                  </button>
                ) : null;
              })}
            </div>
          </Notice>
        )}
      </div>
      <p className="sr-only" role="status">{announce}</p>

      <Dialog open={sheet === 'filters'} onClose={() => setSheet(null)} id="filters-sheet" title="Filters" size="full" className="m-fdrawer"
        foot={<>
          <button className="a-link" type="button" disabled={!filtered} onClick={() => setF(NONE)}>Clear all</button>
          <button className="a-button -steady" type="button" onClick={() => setSheet(null)}><span className="a-button__label">Show {plural(shown.length, 'flight', 'flights')}</span></button>
        </>}>
        <FilterPanel offers={offers} f={f} set={setF} search={search} idp="fs" />
      </Dialog>
      <Dialog open={sheet === 'sort'} onClose={() => setSheet(null)} id="sort-sheet" title="Sort by" size="sheet">
        <fieldset className="m-sortSheet">
          <legend className="sr-only">Sort by</legend>
          {SORTS.map((s) => (
            <label className="m-sortSheet__row" key={s.id}>
              <input className="m-filterRow__input" type="radio" name="sort-sheet" checked={sort === s.id} onChange={() => { setSort(s.id); setSheet(null); }} />
              <span><span className="m-sortSheet__label">{s.label}{order[s.id]?.[0] ? `, from ${money(price(order[s.id][0]))}` : ''}</span><span className="m-sortSheet__help">{s.help}</span></span>
            </label>
          ))}
        </fieldset>
      </Dialog>
    </div>
  );
}
