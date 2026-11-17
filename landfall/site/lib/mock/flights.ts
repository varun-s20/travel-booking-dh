/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): mock flights
   The simulated Duffel side of the flight flow, shared by the route
   handlers (app/api/flights) and the server pages:
   - the five fictional airlines and three fares from content/copy.md;
   - search normalising (destination cards send only from and to);
   - offers: London Heathrow to Lisbon is copy.md's six offers padded to
     86, every other route is generated from distance, both seeded, so a
     search returns the same offers every time;
   - offer ids that carry the search and its time, so any offer page can
     be rebuilt and expires 30 minutes after the search (Duffel's
     expires_at); price checks and orders with the demo states.
   Every airline, fare and price is fiction (copy.md, mock data set).
   ===================================================================== */
import { AIRPORTS } from '@/lib/data/places';
import { CABINS, isCabin, type Cabin } from '@/lib/cabins';
import { GEO, airport, blockMinutes, distanceKm, hash, pick, rng, tz } from '@/lib/mock/geo';
import { addIsoDays, fromIso } from '@/lib/format';
import { CAT, type CatFamily } from '@/lib/mock/catalogue';

/* ===== Airlines (fictional; codes for the demo only, never production) ===== */
export type Airline = { code: string; name: string; aircraft: string; longAircraft: string; ticketPrefix: string; online: boolean };
export const AIRLINES: Record<string, Airline> = {
  KT: { code: 'KT', name: 'Kittiwake Air', aircraft: 'Airbus A320neo', longAircraft: 'Airbus A330-900', ticketPrefix: '910', online: true },
  TQ: { code: 'TQ', name: 'Tern Atlantic', aircraft: 'Airbus A321', longAircraft: 'Boeing 787-9', ticketPrefix: '924', online: false },
  LP: { code: 'LP', name: 'Larkspur Airways', aircraft: 'Boeing 737-800', longAircraft: 'Boeing 777-300ER', ticketPrefix: '931', online: false },
  PQ: { code: 'PQ', name: 'Petrel Air', aircraft: 'Embraer 195', longAircraft: 'Airbus A350-900', ticketPrefix: '947', online: true },
  WE: { code: 'WE', name: 'Wren Air', aircraft: 'Airbus A319', longAircraft: 'Airbus A330-300', ticketPrefix: '958', online: false }
};
/* round 3: the catalogue's seven new airlines (content/mock-catalogue.md, The twelve) */
for (const a of CAT.airlines) {
  if (!AIRLINES[a.code]) AIRLINES[a.code] = { code: a.code, name: a.name, aircraft: a.short[0], longAircraft: a.long[0], ticketPrefix: a.ticketPrefix, online: a.cancelOnline };
}
const CODES = Object.keys(AIRLINES);
const codeByName = (name: string) => CODES.find((c) => AIRLINES[c].name === name);

/* Who flies a route to or from London (catalogue, Who flies each route from London) */
function catalogueRoute(from: string, to: string): { nonstop: string[]; oneStop: { airline: string; via: string }[] } | null {
  const london = (c: string) => airport(c)?.city === 'London';
  const other = london(from) ? to : london(to) ? from : null;
  if (!other) return null;
  const city = airport(other)?.city;
  const r = city ? CAT.routes[city] : undefined;
  if (!r) return null;
  return {
    nonstop: r.nonstop.map(codeByName).filter(Boolean) as string[],
    oneStop: r.oneStop.map((x) => ({ airline: codeByName(x.airline) ?? '', via: x.via })).filter((x) => x.airline && GEO[x.via])
  };
}

/* Terminals as copy.md gives them for London and Lisbon; elsewhere a plain Terminal 1 */
function terminal(code: string, airline: string): string {
  if (code === 'LHR') return airline === 'KT' || airline === 'TQ' ? 'Terminal 2' : 'Terminal 3';
  if (code === 'LGW') return 'North Terminal';
  return 'Terminal 1';
}

/* ===== Search ===== */
export type Pax = { adults: number; children: number; infants: number };
export type FlightSearch = Pax & { from: string; to: string; depart: string; ret: string | null; cabin: Cabin };

const DEMO_DEPART = '2026-11-20';

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function int(v: string | undefined, min: number, max: number, dflt: number): number {
  const n = parseInt(v ?? '', 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : dflt;
}

type Params = Record<string, string | string[] | undefined>;
const one = (p: Params, k: string) => { const v = p[k]; return Array.isArray(v) ? v[0] : v; };

/* Returns the full search, or null when there is no route to search.
   `complete` is false when dates or travelers had to be filled in, so the
   page can rewrite its URL (destination cards send only from and to). */
export function parseFlightSearch(p: Params): { search: FlightSearch; complete: boolean } | null {
  const from = (one(p, 'from') || '').toUpperCase(), to = (one(p, 'to') || '').toUpperCase();
  if (!GEO[from] || !GEO[to]) return null;
  let depart = one(p, 'depart') || '', ret: string | null = one(p, 'return') || null;
  let complete = true;
  const t = todayIso();
  if (!fromIso(depart) || depart < t) {
    /* the demo dates while they are at least a week away, otherwise ten days out */
    depart = addIsoDays(t, 7) <= DEMO_DEPART ? DEMO_DEPART : addIsoDays(t, 10);
    ret = addIsoDays(depart, 7);
    complete = false;
  }
  if (ret && (!fromIso(ret) || ret < depart)) { ret = addIsoDays(depart, 7); complete = false; }
  const adults = int(one(p, 'adults'), 1, 9, 1);
  const children = int(one(p, 'children'), 0, 9 - adults, 0);
  const infants = int(one(p, 'infants'), 0, adults, 0);
  const cabinRaw = one(p, 'cabin');
  const cabin: Cabin = isCabin(cabinRaw) ? cabinRaw : 'economy';
  if (one(p, 'adults') === undefined || !isCabin(cabinRaw)) complete = false;
  return { search: { from, to, depart, ret, adults, children, infants, cabin }, complete };
}

export function searchQuery(s: FlightSearch): string {
  const q = new URLSearchParams({ from: s.from, to: s.to, depart: s.depart });
  if (s.ret) q.set('return', s.ret);
  q.set('adults', String(s.adults)); q.set('children', String(s.children)); q.set('infants', String(s.infants)); q.set('cabin', s.cabin);
  return q.toString();
}

function searchKey(s: FlightSearch): string {
  return [s.from, s.to, s.depart, s.ret || '-', s.adults, s.children, s.infants, s.cabin].join('.');
}
function keyToSearch(k: string): FlightSearch | null {
  const [from, to, depart, ret, a, c, i, cabin] = k.split('.');
  if (!GEO[from] || !GEO[to] || !fromIso(depart) || !isCabin(cabin)) return null;
  return { from, to, depart, ret: ret === '-' ? null : ret, adults: +a || 1, children: +c || 0, infants: +i || 0, cabin };
}

export const seats = (p: Pax) => p.adults + p.children;
export const travelers = (p: Pax) => p.adults + p.children + p.infants;
const sameCity = (a: string, b: string) => airport(a)?.city === airport(b)?.city;

/* "London Heathrow" where a city has more than one airport in the list, otherwise the city ("Lisbon") */
export function placeName(code: string): string {
  const a = airport(code);
  if (!a) return code;
  return AIRPORTS.filter((x) => x.city === a.city).length > 1 ? a.name : a.city;
}
export const cityOf = (code: string) => airport(code)?.city ?? code;

/* ===== Offers ===== */
export type Segment = {
  flight: string; airline: string; operatedBy?: string; aircraft: string;
  from: string; to: string; fromTerminal: string; toTerminal: string;
  /* minutes from local midnight of the slice's departure day; arr is local at the segment's destination */
  dep: number; dur: number; arr: number;
};
export type Layover = { at: string; dur: number; overnight: boolean; leaveFrom?: string };
export type Slice = { from: string; to: string; date: string; segments: Segment[]; layovers: Layover[]; dep: number; arr: number; dur: number; stops: number };
export type Scenario = 'ok' | 'up' | 'down' | 'sold_out' | 'not_confirmed';
export type Offer = {
  id: string; index: number; owner: string; slices: Slice[];
  perSeat: number; taxPerSeat: number; /* cents, Light fare, for one seated traveler, taxes included */
  passengers: Pax; cabin: Cabin; searchedAt: number; expiresAt: number;
  passport: boolean; scenario: Scenario; warnings: string[];
};

function makeSeg(airline: string, flight: string, from: string, to: string, dep: number, dur?: number, operatedBy?: string): Segment {
  const d = dur ?? blockMinutes(from, to);
  const long = distanceKm(from, to) > 4500;
  return {
    flight, airline, operatedBy, aircraft: long ? AIRLINES[airline].longAircraft : AIRLINES[airline].aircraft,
    from, to, fromTerminal: terminal(from, airline), toTerminal: terminal(to, airline),
    dep, dur: d, arr: dep + d + (tz(to) - tz(from)) * 60
  };
}

function makeSlice(date: string, segments: Segment[]): Slice {
  const first = segments[0], last = segments[segments.length - 1];
  const layovers: Layover[] = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const a = segments[i], b = segments[i + 1];
    layovers.push({
      at: a.to, dur: b.dep - a.arr,
      overnight: Math.floor(a.arr / 1440) < Math.floor(b.dep / 1440),
      leaveFrom: a.to !== b.from ? b.from : undefined
    });
  }
  return {
    from: first.from, to: last.to, date, segments, layovers,
    dep: first.dep, arr: last.arr,
    dur: (last.arr - tz(last.to) * 60) - (first.dep - tz(first.from) * 60),
    stops: segments.length - 1
  };
}

/* copy.md's six London Heathrow to Lisbon offers, times as given (totals for 2 adults / 2) */
function lisbonFixed(s: FlightSearch): { slices: [Segment[], Segment[] | null]; perSeat: number; tax?: number; scenario: Scenario; airline: string }[] {
  const r = !!s.ret;
  return [
    { airline: 'KT', perSeat: 54930, tax: 10830, scenario: 'ok', slices: [[makeSeg('KT', 'KT 412', 'LHR', 'LIS', 425, 165)], r ? [makeSeg('KT', 'KT 413', 'LIS', 'LHR', 640, 155)] : null] },
    { airline: 'TQ', perSeat: 46800, scenario: 'down', slices: [[makeSeg('TQ', 'TQ 1360', 'LHR', 'LIS', 740, 165)], r ? [makeSeg('TQ', 'TQ 1361', 'LIS', 'LHR', 960, 155)] : null] },
    { airline: 'LP', perSeat: 45120, scenario: 'ok', slices: [[makeSeg('LP', 'LP 207', 'LHR', 'LIS', 1125, 165)], r ? [makeSeg('LP', 'LP 208', 'LIS', 'LHR', 415, 155)] : null] },
    { airline: 'PQ', perSeat: 41200, scenario: 'not_confirmed', slices: [
      [makeSeg('PQ', 'PQ 30', 'LHR', 'MAD', 370, 140), makeSeg('PQ', 'PQ 744', 'MAD', 'LIS', 660, 80)],
      r ? [makeSeg('PQ', 'PQ 745', 'LIS', 'MAD', 785, 80), makeSeg('PQ', 'PQ 31', 'MAD', 'LHR', 1030, 145)] : null] },
    { airline: 'WE', perSeat: 43560, scenario: 'sold_out', slices: [
      [makeSeg('WE', 'WE 512', 'LHR', 'BCN', 555, 135), makeSeg('WE', 'WE 90', 'BCN', 'LIS', 875, 115)],
      r ? [makeSeg('WE', 'WE 91', 'LIS', 'BCN', 450, 110), makeSeg('WE', 'WE 513', 'BCN', 'LHR', 730, 135)] : null] },
    { airline: 'KT', perSeat: 52130, scenario: 'up', slices: [[makeSeg('KT', 'KT 418', 'LHR', 'LIS', 1170, 165)], r ? [makeSeg('KT', 'KT 419', 'LIS', 'LHR', 845, 155)] : null] }
  ];
}

/* Lowest return fare for one adult in economy, from copy.md's destination cards (whole dollars) */
const ANCHORS: Record<string, number> = { 'LHR-LIS': 41200, 'LHR-FCO': 38900, 'LHR-JFK': 68400, 'LHR-MEX': 104600, 'LHR-HND': 121200, 'LHR-CPT': 113800 };
/* round 3: every catalogue city's "Return from" (the six above are the same figures) */
for (const c of CAT.cities) if (!ANCHORS['LHR-' + c.code]) ANCHORS['LHR-' + c.code] = c.returnFrom;
/* usual return fare over the last 30 days (catalogue "Typical return"), for savings lines */
export function typicalReturn(from: string, to: string): number | null {
  const london = (c: string) => airport(c)?.city === 'London';
  const other = london(from) ? to : london(to) ? from : null;
  const c = other ? CAT.cities.find((x) => x.code === other) : undefined;
  return c ? c.typicalReturn : null;
}
/* Fares by date (seeded rule for the date strip): the anchor times a weekday factor for the
   departure day. Friday is 1.00, so the demo dates (Fri, Nov 20) keep copy.md's figures. */
const WEEKDAY = [1.07, 0.96, 0.91, 0.93, 0.97, 1, 1.05]; /* Sun to Sat */
export function weekdayFactor(iso: string): number { const d = fromIso(iso); return d ? WEEKDAY[d.getDay()] : 1; }
const CABIN_RATE: Record<Cabin, number> = { economy: 1, premium_economy: 1.75, business: 3.6, first: 6.2 };

function anchor(s: FlightSearch): number {
  const key = `${s.from}-${s.to}`, back = `${s.to}-${s.from}`;
  let a = ANCHORS[key] ?? ANCHORS[back] ?? Math.round((120 + distanceKm(s.from, s.to) * 0.1) * 100);
  if (!s.ret) a = a * 0.62;
  return Math.round(a * CABIN_RATE[s.cabin] * weekdayFactor(s.depart) / 100) * 100;
}

const HUBS = ['MAD', 'BCN', 'AMS', 'CDG', 'LHR', 'DXB', 'JFK', 'MIA', 'YYZ', 'SIN', 'LIS', 'MEX']; /* LIS and MEX: catalogue note 3 */
function viaHubs(from: string, to: string, n: number, r: () => number): string[] {
  const d = distanceKm(from, to);
  const limit = d < 2500 ? 1.75 : 1.32;
  const ok = HUBS.filter((h) => !sameCity(h, from) && !sameCity(h, to) && (distanceKm(from, h) + distanceKm(h, to)) / d < limit);
  const list = ok.length ? ok : [...HUBS].filter((h) => !sameCity(h, from) && !sameCity(h, to))
    .sort((a, b) => (distanceKm(from, a) + distanceKm(a, to)) - (distanceKm(from, b) + distanceKm(b, to))).slice(0, 2);
  const chosen: string[] = [];
  while (chosen.length < n && chosen.length < list.length) {
    const h = pick(r, list);
    if (!chosen.includes(h)) chosen.push(h);
  }
  return chosen.sort((a, b) => distanceKm(from, a) - distanceKm(from, b));
}

function genSlice(from: string, to: string, date: string, stops: number, airline: string, r: () => number, num: () => number, via?: string): Segment[] {
  const long = distanceKm(from, to) > 4500;
  const hubs = via && stops === 1 ? [via] : stops ? viaHubs(from, to, stops, r) : [];
  const points = [from, ...hubs, to];
  const short = distanceKm(from, to) < 3000;
  for (let attempt = 0; attempt < 8; attempt++) {
    /* short trips with a stop leave by mid afternoon, so they don't sit overnight in a hub */
    const lo = long ? 480 : 330, hi = short && stops ? 900 : 1320;
    let t = lo + Math.floor(r() * ((hi - lo) / 5)) * 5;
    const segs: Segment[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const seg = makeSeg(airline, `${airline} ${num()}`, points[i], points[i + 1], t);
      segs.push(seg);
      if (i < points.length - 2) {
        /* most connections 55m to 3h50m; now and then a long or overnight one */
        const roll = r();
        const wait = !short && roll < 0.05 ? 600 + Math.floor(r() * 36) * 5 : roll < 0.08 ? 300 + Math.floor(r() * 18) * 5 : 55 + Math.floor(r() * 30) * 5;
        t = seg.arr + wait;
      }
    }
    const last = segs[segs.length - 1];
    /* keep arrivals on the same or the next local day */
    if (last.arr >= 0 && last.arr < 2880) return segs;
  }
  return points.slice(0, -1).map((p, i) => makeSeg(airline, `${airline} ${num()}`, p, points[i + 1], 480 + i * 400));
}

function scenarioFor(key: string, i: number): Scenario {
  const h = hash(`${key}:${i}`) % 41;
  return h === 3 ? 'up' : h === 7 ? 'down' : h === 11 ? 'sold_out' : h === 19 ? 'not_confirmed' : 'ok';
}

const roundTen = (c: number) => Math.round(c / 10) * 10;

export function encodeOfferId(key: string, index: number, t: number): string {
  const raw = `${key}~${index}~${Math.floor(t / 1000)}`;
  return 'off_' + btoa(raw).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeOfferId(id: string): { key: string; index: number; t: number } | null {
  if (!id.startsWith('off_')) return null;
  try {
    const b = id.slice(4).replace(/-/g, '+').replace(/_/g, '/');
    const [key, index, t] = atob(b + '==='.slice((b.length + 3) % 4)).split('~');
    if (!key || !Number.isFinite(+index) || !Number.isFinite(+t)) return null;
    return { key, index: +index, t: +t * 1000 };
  } catch { return null; }
}

export const OFFER_LIFETIME = 30 * 60 * 1000;

/* The whole result set for a search, in a stable order. Empty for routes with no flights. */
export function generateOffers(s: FlightSearch, searchedAt: number): Offer[] {
  if (s.from === s.to || sameCity(s.from, s.to)) return [];
  const key = searchKey(s);
  const r = rng(`${s.from}-${s.to}-${s.depart}-${s.ret}`);
  let flightNo = 100 + (hash(key) % 700);
  const num = () => (flightNo += 1 + Math.floor(r() * 9));
  const dist = distanceKm(s.from, s.to);
  const base = anchor(s);
  const passport = dist > 3500;
  const out: Omit<Offer, 'id' | 'index' | 'warnings'>[] = [];
  const pax: Pax = { adults: s.adults, children: s.children, infants: s.infants };
  const common = { passengers: pax, cabin: s.cabin, searchedAt, expiresAt: searchedAt + OFFER_LIFETIME, passport };
  const rate = base / 41200; /* scale copy.md's Lisbon prices for one way and other cabins */

  const isLisbon = s.from === 'LHR' && s.to === 'LIS';
  if (isLisbon) {
    for (const f of lisbonFixed(s)) {
      const perSeat = f.airline === 'PQ' ? base : roundTen(f.perSeat * rate);
      out.push({ ...common, owner: f.airline, perSeat, taxPerSeat: f.tax && rate === 1 ? f.tax : roundTen(perSeat * 0.197), scenario: f.scenario,
        slices: [makeSlice(s.depart, f.slices[0]), ...(f.slices[1] && s.ret ? [makeSlice(s.ret, f.slices[1])] : [])] });
    }
  }
  const total = isLisbon ? 86 : 34 + (hash(key) % 30);
  const cheapest = isLisbon ? -1 : hash(key) % total;
  const nonstopOk = dist < 9800;
  const owners = catalogueRoute(s.from, s.to);
  for (let i = out.length; i < total; i++) {
    let airline = pick(r, CODES);
    const roll = r();
    let stops = dist < 900 ? 0 : !nonstopOk ? (roll < 0.82 ? 1 : 2) : roll < 0.48 ? 0 : roll < 0.93 ? 1 : 2;
    let via: string | undefined;
    if (owners && (owners.nonstop.length || owners.oneStop.length)) {
      /* the catalogue's airlines for London routes; the first nonstop airline owns the cheapest offer */
      if (!owners.nonstop.length && stops === 0) stops = 1;
      if (!owners.oneStop.length && stops > 0) stops = 0;
      if (stops === 0) airline = i === cheapest ? owners.nonstop[0] : pick(r, owners.nonstop);
      else if (stops === 1) { const o = pick(r, owners.oneStop); airline = o.airline; via = o.via; }
      else airline = pick(r, owners.oneStop).airline;
    }
    const outSegs = genSlice(s.from, s.to, s.depart, stops, airline, r, num, via);
    const backSegs = s.ret ? genSlice(s.to, s.from, s.ret, via ? 1 : stops === 2 && r() < 0.5 ? 1 : stops, airline, r, num, via) : null;
    /* now and then a Kittiwake flight sold by Kittiwake but flown by Tern Atlantic (copy.md's codeshare line) */
    if (airline === 'KT' && r() < 0.25) outSegs[0].operatedBy = 'TQ';
    /* a few London returns land at Gatwick (copy.md: "Change of airport in London") */
    if (backSegs && s.from === 'LHR' && r() < 0.03) {
      const lastSeg = backSegs[backSegs.length - 1];
      backSegs[backSegs.length - 1] = makeSeg(lastSeg.airline, lastSeg.flight, lastSeg.from, 'LGW', lastSeg.dep, lastSeg.dur);
    }
    const lift = i === cheapest ? 0 : 0.03 + r() * 0.78 + (stops === 0 ? 0.12 : 0) - (stops === 2 ? 0.04 : 0);
    const perSeat = roundTen(base * (1 + lift));
    out.push({ ...common, owner: airline, perSeat, taxPerSeat: roundTen(perSeat * 0.197), scenario: scenarioFor(key, i),
      slices: [makeSlice(s.depart, outSegs), ...(backSegs && s.ret ? [makeSlice(s.ret, backSegs)] : [])] });
  }

  return out.map((o, index) => {
    const warnings: string[] = [];
    const city = cityOf(s.from);
    if (o.slices[1] && o.slices[1].to !== o.slices[0].from) warnings.push(`Change of airport in ${city}`);
    const lays = o.slices.flatMap((sl) => sl.layovers);
    if (lays.some((l) => l.overnight)) warnings.push('Overnight layover');
    else if (lays.some((l) => l.dur >= 300)) warnings.push('Long layover');
    return { ...o, index, id: encodeOfferId(key, index, searchedAt), warnings };
  });
}

/* Rebuilds one offer from its id, or null when the id does not decode */
export function findOffer(id: string): { offer: Offer; search: FlightSearch } | null {
  const d = decodeOfferId(id);
  if (!d) return null;
  const search = keyToSearch(d.key);
  if (!search) return null;
  const offer = generateOffers(search, d.t)[d.index];
  return offer ? { offer, search } : null;
}

/* Group F (Landfall build): the same offer from a fresh search, for "Refresh the price"
   on an expired offer. The index and search stay; the search time is now, so it is valid
   for another 30 minutes and its price check runs again (same scenario, same figures). */
export function renewOfferId(id: string, t = Date.now()): string | null {
  const d = decodeOfferId(id);
  return d ? encodeOfferId(d.key, d.index, t) : null;
}

/* ===== Fares (copy.md: fares on the demo flight; the same three on every offer) ===== */
/* Fare ids are tiers in each airline's own families (catalogue, How fare families work):
   light is the lowest, then classic, flex and top (only airlines with four families sell top).
   Kittiwake's three are copy.md's Light, Classic and Flex, so existing links keep working. */
export type FareId = 'light' | 'classic' | 'flex' | 'top';
export const FARE_TIERS: FareId[] = ['light', 'classic', 'flex', 'top'];
export type FareRows = { personal: string; cabin: string; checked: string; seat: string; changes: string; refunds: string };
export type Fare = { id: FareId; name: string; included: string[]; fee: string[]; notIncluded: string[]; step?: number; rows?: FareRows };
export const FARES: Fare[] = [
  { id: 'light', name: 'Light', included: ['1 small bag under the seat', 'Seat assigned at check-in'],
    fee: ['Cabin bag in the overhead locker', 'Checked bag', 'Choose your seat', 'Changes before departure, $75 per traveler plus any fare difference'], notIncluded: ['Not refundable'] },
  { id: 'classic', name: 'Classic', included: ['1 small bag under the seat', '1 cabin bag, 10 kg', '1 checked bag, 23 kg', 'Choose a standard seat'],
    fee: ['Changes before departure, $75 per traveler plus any fare difference'], notIncluded: ['Not refundable'] },
  { id: 'flex', name: 'Flex', included: ['1 small bag under the seat', '1 cabin bag, 10 kg', '1 checked bag, 23 kg', 'Choose any standard seat', 'Changes before departure, you pay only any fare difference', 'Refund before departure, minus $50 per traveler'],
    fee: [], notIncluded: [] }
];
export const isFare = (v: unknown): v is FareId => v === 'light' || v === 'classic' || v === 'flex' || v === 'top';
export const fareById = (id: FareId) => FARES.find((f) => f.id === id) ?? FARES[FARES.length - 1];

/* An airline's own families as Fare objects; cells sort into the three lists by the catalogue's rule */
function toFare(f: CatFamily, i: number): Fare {
  const included: string[] = [], fee: string[] = [], notIncluded: string[] = [];
  const put = (cell: string, kind: 'changes' | 'other') => {
    for (const part of cell.split(';').map((x) => x.trim()).filter(Boolean)) {
      if (part.startsWith('For a fee:')) fee.push(part.replace(/^For a fee:\s*/, ''));
      else if (part === 'Not allowed') notIncluded.push(kind === 'changes' ? 'Changes not allowed' : part);
      else if (part === 'Not refundable') notIncluded.push(part);
      else included.push(part);
    }
  };
  put(f.personal, 'other'); put(f.cabin, 'other'); put(f.checked, 'other'); put(f.seat, 'other'); put(f.changes, 'changes'); put(f.refunds, 'other');
  return { id: FARE_TIERS[i], name: f.name, included, fee, notIncluded, step: f.step,
    rows: { personal: f.personal, cabin: f.cabin, checked: f.checked, seat: f.seat, changes: f.changes, refunds: f.refunds } };
}
const FAMILY_CACHE: Record<string, Fare[]> = {};
export function faresFor(owner: string): Fare[] {
  if (!FAMILY_CACHE[owner]) {
    const fam = CAT.families[owner];
    const list = fam?.length ? fam.map(toFare) : FARES;
    /* Kittiwake keeps copy.md's lists word for word */
    FAMILY_CACHE[owner] = owner === 'KT' ? FARES.map((f, i) => ({ ...f, step: fam?.[i]?.step, rows: list[i]?.rows })) : list;
  }
  return FAMILY_CACHE[owner];
}
/* the fare for an offer: its owner's family at that tier, clamped to the families it sells */
export function fareFor(o: Offer | string, id: FareId): Fare {
  const list = faresFor(typeof o === 'string' ? o : o.owner);
  return list[Math.min(Math.max(0, FARE_TIERS.indexOf(id)), list.length - 1)];
}

/* per seated traveler, whole dollars: Classic about 17% and Flex about 38% over Light ($93 and $207 on the demo flight) */
export function fareStep(o: Offer, fare: FareId): number {
  const d = o.perSeat / 100;
  if (o.owner === 'KT' || !CAT.families[o.owner]) return fare === 'classic' ? Math.round(d * 0.17) * 100 : fare === 'flex' || fare === 'top' ? Math.round(d * 0.377) * 100 : 0;
  return Math.round(d * (fareFor(o, fare).step ?? 0)) * 100;
}

export type Amounts = { base: number; tax: number; total: number };
/* `adjust` is a price change per seat after a check (fare up or down) */
export function offerTotals(o: Offer, fare: FareId, adjust = 0): Amounts {
  const n = seats(o.passengers);
  const seat = o.perSeat + fareStep(o, fare) + adjust;
  const infant = roundTen((o.perSeat - o.taxPerSeat) * 0.1);
  const total = seat * n + infant * o.passengers.infants;
  const tax = o.taxPerSeat * n;
  return { base: total - tax, tax, total };
}
export function fareDifference(o: Offer, fare: FareId): number {
  return fareStep(o, fare) * seats(o.passengers);
}

/* ===== Price check before the traveler form (Duffel's single-offer request) ===== */
export type PriceCheck =
  | { status: 'ok'; total: number }
  | { status: 'up' | 'down'; total: number; delta: number; adjust: number }
  | { status: 'sold_out' }
  | { status: 'expired' };

export function priceCheck(o: Offer, fare: FareId, now = Date.now()): PriceCheck {
  if (now > o.expiresAt) return { status: 'expired' };
  const before = offerTotals(o, fare).total;
  if (o.scenario === 'sold_out') return { status: 'sold_out' };
  if (o.scenario === 'up' || o.scenario === 'down') {
    /* the demo flight's figures: +$9.20 and -$6.00 per seat ($18.40 and $12.00 for two) */
    const per = o.scenario === 'up' ? (o.perSeat === 52130 ? 920 : roundTen(o.perSeat * 0.0168)) : -(o.perSeat === 46800 ? 600 : roundTen(o.perSeat * 0.0128));
    const after = offerTotals(o, fare, per).total;
    return { status: o.scenario, total: after, delta: after - before, adjust: per };
  }
  return { status: 'ok', total: before };
}

/* ===== Labels shared by cards, details and bookings ===== */
export function stopsLabel(n: number): string { return n === 0 ? 'Nonstop' : n === 1 ? '1 stop' : `${n} stops`; }
export function cabinShort(c: Cabin): string { return CABINS.find((x) => x.value === c)?.label ?? 'Economy'; }

/* ===== Round 3: the date strip (the lowest fare per traveler for each departure date) ===== */
export function lowestByDate(s: FlightSearch, dates: string[]): { date: string; lowest: number | null }[] {
  const nights = s.ret ? Math.round((+fromIso(s.ret)! - +fromIso(s.depart)!) / 86400000) : 0;
  return dates.map((date) => {
    const q: FlightSearch = { ...s, depart: date, ret: s.ret ? addIsoDays(date, nights) : null };
    const list = generateOffers(q, Date.now());
    return { date, lowest: list.length ? Math.min(...list.map((o) => o.perSeat)) : null };
  });
}
