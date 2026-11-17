/* =====================================================================
   Landfall server: Duffel as the supplier (flights and stays)
   Turns Duffel API v2 data into the site's view models and back.
   Flights
   - A search is one offer request (return_offers). Duffel sends one offer
     per fare; offers flying the same flights are grouped into one
     itinerary whose fares (cheapest first, at most four) become the
     light/classic/flex/top tiers the pages already use.
   - Offers priced in another currency than APP_CURRENCY are left out
     (one currency only in Phase 1; set the Duffel balance to USD).
   - Orders are instant and paid from the Duffel balance; the customer's
     card was authorised by Stripe before this is called.
   Stays
   - Search by coordinates (Duffel has no text search); rates come from
     fetch_all_rates; only pay-now rates payable from the balance are
     offered; a quote re-checks the price before booking.
   Every amount is in minor units; customer prices carry the markup.
   ===================================================================== */
import 'server-only';
import { duffel, DuffelApiError } from '@/server/duffel/client';
import type {
  DuffelAccommodation, DuffelCarrier, DuffelCondition, DuffelOffer, DuffelOfferRequest, DuffelOrder,
  DuffelPlace, DuffelQuote, DuffelRate, DuffelReview, DuffelSegment, DuffelSlice, DuffelStayBooking, DuffelStaySearchResult
} from '@/server/duffel/types';
import { SupplyError } from '@/server/errors';
import { log } from '@/server/log';
import { appCurrency, withMarkup } from '@/server/pricing';
import { supplierBookingTimeoutMs } from '@/server/env';
import { fromMinor, toMinor } from '@/lib/travel/money';
import { cabinLabel } from '@/lib/cabins';
import { countryName } from '@/lib/data/countries';
import { isGeoPlace } from '@/lib/data/places';
import { money, plural } from '@/lib/format';
import { FARE_TIERS, itineraryWarnings, type Fare, type FlightSearch, type Layover, type Offer, type Segment, type Slice } from '@/lib/travel/flights';
import { childAges, cityById, guestsPerRoom, nightsOf, scoreWord, type Hotel, type HotelPhoto, type RatePlan, type Room, type StayCard, type StaySearch } from '@/lib/travel/hotels';
import type { AirlineInfo, Dict, PlaceInfo } from '@/lib/travel/registry';
import type {
  FlightOrderInput, FlightOrderResult, FlightSearchResult, FlightSupplier, HotelLoad, OfferQuote, RateSnapshot,
  StayBookingInput, StayBookingResult, StayQuote, StaySupplier, SupplierPassenger
} from './types';

/* ===================================================================== */
/* ============================== time ================================= */
const localDate = (iso: string) => iso.slice(0, 10);
const localMin = (iso: string) => +iso.slice(11, 13) * 60 + +iso.slice(14, 16);
function dayDiff(a: string, b: string): number {
  const u = (s: string) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10));
  return Math.round((u(b) - u(a)) / 864e5);
}
/* ISO 8601 duration ("PT2H45M", "P1DT2H") to minutes */
export function isoMinutes(d: string | null | undefined): number | null {
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/.exec(d || '');
  if (!m || !d) return null;
  return (+(m[1] || 0)) * 1440 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
}

/* ============================== names ================================ */
class Names {
  places: Record<string, PlaceInfo> = {};
  airlines: Record<string, AirlineInfo> = {};
  place(p: DuffelPlace | null | undefined): string {
    const code = p?.iata_code || p?.id || '';
    if (p && code && !this.places[code]) {
      const city = p.city_name || p.city?.name || p.name;
      this.places[code] = { code, name: p.name, city, country: p.iata_country_code ? countryName(p.iata_country_code) : undefined };
    }
    return code;
  }
  airline(c: DuffelCarrier | null | undefined): string {
    if (!c) return '';
    const code = c.iata_code || `X${c.id.slice(-5).toUpperCase()}`;
    if (!this.airlines[code]) this.airlines[code] = { code, name: c.name, logo: c.logo_symbol_url ?? null };
    return code;
  }
  dict(): Dict { return { places: this.places, airlines: this.airlines }; }
}

/* ============================ flights ================================ */
function mapSlice(ds: DuffelSlice, n: Names): Slice {
  const date = localDate(ds.segments[0].departing_at);
  const segments: Segment[] = ds.segments.map((g: DuffelSegment) => {
    const depDay = dayDiff(date, localDate(g.departing_at)), arrDay = dayDiff(date, localDate(g.arriving_at));
    const dep = depDay * 1440 + localMin(g.departing_at);
    const arr = arrDay * 1440 + localMin(g.arriving_at);
    const marketing = n.airline(g.marketing_carrier), operating = n.airline(g.operating_carrier);
    return {
      flight: `${g.marketing_carrier.iata_code ?? marketing} ${g.marketing_carrier_flight_number}`,
      airline: marketing,
      operatedBy: operating && operating !== marketing ? operating : undefined,
      aircraft: g.aircraft?.name ?? '',
      from: n.place(g.origin), to: n.place(g.destination),
      fromTerminal: g.origin_terminal ? `Terminal ${g.origin_terminal}` : '',
      toTerminal: g.destination_terminal ? `Terminal ${g.destination_terminal}` : '',
      dep, arr, dur: isoMinutes(g.duration) ?? Math.max(0, arr - dep)
    };
  });
  const layovers: Layover[] = [];
  for (let i = 0; i < segments.length - 1; i++) {
    const a = segments[i], b = segments[i + 1];
    layovers.push({ at: a.to, dur: b.dep - a.arr, overnight: Math.floor(a.arr / 1440) < Math.floor(b.dep / 1440), leaveFrom: a.to !== b.from ? b.from : undefined });
  }
  const technical = ds.segments.reduce((k, g) => k + (g.stops?.length ?? 0), 0);
  const first = segments[0], last = segments[segments.length - 1];
  return {
    from: first.from, to: last.to, date, segments, layovers,
    dep: first.dep, arr: last.arr,
    dur: isoMinutes(ds.duration) ?? segments.reduce((t, s) => t + s.dur, 0) + layovers.reduce((t, l) => t + l.dur, 0),
    stops: segments.length - 1 + technical
  };
}

const itineraryKey = (o: DuffelOffer) =>
  o.slices.map((s) => s.segments.map((g) => `${g.marketing_carrier.iata_code ?? g.marketing_carrier.id}${g.marketing_carrier_flight_number}@${g.departing_at}`).join('+')).join('|');

function penalty(c: DuffelCondition): string {
  if (!c?.penalty_amount || !c.penalty_currency) return '';
  const minor = toMinor(c.penalty_amount, c.penalty_currency);
  return c.penalty_currency === appCurrency() ? money(minor) : `${c.penalty_amount} ${c.penalty_currency}`;
}
const zero = (c: DuffelCondition) => !c?.penalty_amount || Number(c.penalty_amount) === 0;

function mapFare(o: DuffelOffer, cabinName: string): Omit<Fare, 'id'> {
  const firstSeg = o.slices[0]?.segments[0];
  const pax = firstSeg?.passengers.find((p) => o.passengers.find((x) => x.id === p.passenger_id)?.type !== 'infant_without_seat') ?? firstSeg?.passengers[0];
  const bag = (t: 'carry_on' | 'checked') => pax?.baggages.find((b) => b.type === t)?.quantity ?? 0;
  const carry = bag('carry_on'), checked = bag('checked');
  const change = o.conditions?.change_before_departure ?? null, refund = o.conditions?.refund_before_departure ?? null;
  const seatInfo = o.slices.map((s) => s.conditions?.advance_seat_selection);
  const seat = seatInfo.every((x) => x === true) ? true : seatInfo.some((x) => x === false) ? false : null;

  const included: string[] = [], fee: string[] = [], notIncluded: string[] = [];
  if (carry) included.push(plural(carry, 'cabin bag', 'cabin bags')); else notIncluded.push('No cabin bag');
  if (checked) included.push(plural(checked, 'checked bag', 'checked bags')); else notIncluded.push('No checked bag');
  if (seat === true) included.push('Choose your seat before check-in');
  else if (seat === false) notIncluded.push('Seat assigned at check-in');
  if (change?.allowed) (zero(change) ? included : fee).push(zero(change) ? 'Changes before departure, you pay only any fare difference' : `Changes before departure, ${penalty(change)} plus any fare difference`);
  else if (change) notIncluded.push('Changes not allowed');
  if (refund?.allowed) (zero(refund) ? included : fee).push(zero(refund) ? 'Refund before departure' : `Refund before departure, minus ${penalty(refund)}`);
  else if (refund) notIncluded.push('Not refundable');

  const supplierTotal = toMinor(o.total_amount, o.total_currency);
  const total = withMarkup(supplierTotal);
  const tax = o.tax_amount ? toMinor(o.tax_amount, o.tax_currency || o.total_currency) : 0;
  const brand = o.slices[0]?.fare_brand_name;
  return {
    offerId: o.id,
    name: brand ? brand.replace(/\b\w/g, (c) => c.toUpperCase()) : (pax?.cabin_class_marketing_name || cabinName),
    included, fee, notIncluded,
    rows: {
      personal: '',
      cabin: carry ? plural(carry, 'cabin bag', 'cabin bags') : 'Not included',
      checked: checked ? plural(checked, 'checked bag', 'checked bags') : 'Not included',
      seat: seat === true ? 'Choose before check-in' : seat === false ? 'Assigned at check-in' : '',
      changes: !change ? '' : !change.allowed ? 'Not allowed' : zero(change) ? 'Free, you pay any fare difference' : `For a fee: ${penalty(change)} plus any fare difference`,
      refunds: !refund ? '' : !refund.allowed ? 'Not refundable' : zero(refund) ? 'Refundable' : `Refundable, minus ${penalty(refund)}`
    },
    has: { cabin: carry > 0, checked: checked > 0, change: !!change?.allowed, refund: !!refund?.allowed, seat: seat === true },
    base: total - tax, tax, total
  };
}

/* the conditions that make two fares on the same flights different */
const fareSignature = (f: Omit<Fare, 'id'>) => `${f.has.cabin}${f.has.checked}${f.has.change}${f.has.refund}${f.has.seat}`;

function groupOffers(offers: DuffelOffer[], s: FlightSearch, searchId: string, searchedAt: number, n: Names): Offer[] {
  const groups = new Map<string, DuffelOffer[]>();
  for (const o of offers) {
    const k = itineraryKey(o);
    const g = groups.get(k);
    if (g) g.push(o); else groups.set(k, [o]);
  }
  const out: Offer[] = [];
  for (const [key, list] of groups) {
    list.sort((a, b) => toMinor(a.total_amount, a.total_currency) - toMinor(b.total_amount, b.total_currency));
    const fares: Omit<Fare, 'id'>[] = [];
    const seen = new Set<string>();
    for (const o of list) {
      const f = mapFare(o, cabinLabel(s.cabin));
      const sig = fareSignature(f) + f.name.toLowerCase();
      if (seen.has(sig)) continue;
      seen.add(sig);
      /* same brand name, different conditions: say what differs */
      if (fares.some((x) => x.name === f.name)) f.name = `${f.name}, ${f.has.refund ? 'refundable' : f.has.checked ? 'with checked bag' : f.has.change ? 'changeable' : 'option'}`;
      fares.push(f);
      if (fares.length === FARE_TIERS.length) break;
    }
    const lead = list[0];
    const slices = lead.slices.map((sl) => mapSlice(sl, n));
    out.push({
      id: lead.id, key, supplier: 'duffel', owner: n.airline(lead.owner), slices,
      passengers: { adults: s.adults, children: s.children, infants: s.infants }, cabin: s.cabin,
      searchId, searchedAt,
      expiresAt: Math.min(...list.map((o) => Date.parse(o.expires_at))),
      passport: list.some((o) => o.passenger_identity_documents_required),
      warnings: itineraryWarnings(slices, (c) => n.places[c]?.city ?? c),
      fares: fares.map((f, i) => ({ ...f, id: FARE_TIERS[i] })),
      currency: appCurrency(),
      dict: {}
    });
  }
  return out.sort((a, b) => a.fares[0].total - b.fares[0].total).slice(0, 200);
}

/* the dict for one offer: just the codes it uses */
function offerDict(o: Offer, all: Dict): Dict {
  const places: Dict['places'] = {}, airlines: Dict['airlines'] = {};
  for (const sl of o.slices) for (const g of sl.segments) {
    for (const c of [g.from, g.to]) if (all.places?.[c]) places[c] = all.places[c];
    for (const c of [g.airline, g.operatedBy]) if (c && all.airlines?.[c]) airlines[c] = all.airlines[c];
  }
  if (all.airlines?.[o.owner]) airlines[o.owner] = all.airlines[o.owner];
  return { places, airlines };
}

const PAX_TYPE = { adult: 'adult', child: 'child', infant_without_seat: 'infant' } as const;

function orderResult(o: DuffelOrder): FlightOrderResult {
  const names = new Map(o.passengers.map((p) => [p.id, `${p.given_name} ${p.family_name}`]));
  return {
    orderId: o.id, pnr: o.booking_reference, liveMode: o.live_mode,
    documents: (o.documents ?? []).map((d) => ({ type: d.type, id: d.unique_identifier, passenger: d.passenger_ids?.map((id) => names.get(id)).filter(Boolean).join(', ') || undefined }))
  };
}

function supplyErrorFromDuffel(e: DuffelApiError): SupplyError {
  const c = e.code;
  if (c === 'offer_no_longer_available' || c === 'not_found' || c === 'rate_unavailable' || c === 'result_no_longer_available') return new SupplyError('sold_out');
  if (c === 'offer_expired') return new SupplyError('expired');
  if (c === 'price_changed') return new SupplyError('price_changed');
  if (c === 'insufficient_balance') return new SupplyError('insufficient_balance');
  if (c === 'offer_request_already_booked' || c === 'order_creation_already_attempted' || c === 'booking_already_attempted' || c === 'booking_already_confirmed') return new SupplyError('already_booked', e.message, true);
  if (/^invalid_|duplicate_passenger_names|order_passengers_incompatible_with_offer|validation_required/.test(c)) return new SupplyError('invalid_passengers', e.message, false, { codes: e.errors.map((x) => x.code), fields: e.errors.map((x) => x.source?.pointer).filter(Boolean) });
  if (e.ambiguous || e.status === 0) return new SupplyError('timeout', e.message, e.ambiguous || e.status === 0);
  if (e.status === 429 || e.status === 503) return new SupplyError('unavailable', e.message);
  /* the account can't use this API: a revoked token, or a product Duffel hasn't enabled (Stays needs
     Duffel to switch it on). Nothing was booked; the operator has to act, so log it loudly. */
  if (e.status === 401 || e.status === 403) {
    log.error('duffel.access_denied', { status: e.status, code: c, message: e.message });
    return new SupplyError('unavailable', e.message);
  }
  return new SupplyError('not_confirmed', e.message);
}

export const duffelFlights: FlightSupplier = {
  name: 'duffel',

  async search(s: FlightSearch): Promise<FlightSearchResult> {
    const passengers = [
      ...Array.from({ length: s.adults }, () => ({ type: 'adult' })),
      ...Array.from({ length: s.children }, () => ({ type: 'child' })),
      ...Array.from({ length: s.infants }, () => ({ type: 'infant_without_seat' }))
    ];
    const slices = [{ origin: s.from, destination: s.to, departure_date: s.depart }];
    if (s.ret) slices.push({ origin: s.to, destination: s.from, departure_date: s.ret });
    let res;
    try {
      res = await duffel<DuffelOfferRequest>('POST', '/air/offer_requests', {
        query: { return_offers: true, supplier_timeout: 20000 },
        body: { slices, passengers, cabin_class: s.cabin, max_connections: 1 },
        timeoutMs: 45000, retry: true
      });
    } catch (e) {
      if (e instanceof DuffelApiError) {
        if (e.status === 422) throw new SupplyError('invalid_passengers', e.message, false, { codes: e.errors.map((x) => x.code) });
        throw new SupplyError('unavailable', e.message);
      }
      throw e;
    }
    const orq = res.data;
    const searchedAt = Date.now();
    const currency = appCurrency();
    const usable = orq.offers.filter((o) => o.total_currency === currency);
    if (usable.length < orq.offers.length) log.warn('duffel.offers_other_currency', { searchId: orq.id, dropped: orq.offers.length - usable.length, currency: orq.offers.find((o) => o.total_currency !== currency)?.total_currency });
    const n = new Names();
    const offers = groupOffers(usable, s, orq.id, searchedAt, n);
    const dict = n.dict();
    for (const o of offers) o.dict = offerDict(o, dict);
    /* Duffel's passenger ids in the order they were requested: adults, children, infants */
    const typed: SupplierPassenger[] = orq.passengers.map((p) => ({ id: p.id, type: PAX_TYPE[(p.type ?? 'adult') as keyof typeof PAX_TYPE] ?? 'adult' }));
    const order = { adult: 0, child: 1, infant: 2 } as const;
    typed.sort((a, b) => order[a.type] - order[b.type]);
    return {
      searchId: orq.id, offers, passengers: typed, dict, liveMode: orq.live_mode,
      expiresAt: offers.length ? Math.min(...offers.map((o) => o.expiresAt)) : searchedAt + 30 * 60 * 1000
    };
  },

  async quoteOffer(offerId: string): Promise<OfferQuote> {
    try {
      const { data: o } = await duffel<DuffelOffer>('GET', `/air/offers/${encodeURIComponent(offerId)}`, { query: { return_available_services: false }, timeoutMs: 30000, retry: true });
      if (Date.parse(o.expires_at) <= Date.now()) return { status: 'expired' };
      const supplierTotal = toMinor(o.total_amount, o.total_currency);
      const total = withMarkup(supplierTotal);
      const tax = o.tax_amount ? toMinor(o.tax_amount, o.tax_currency || o.total_currency) : 0;
      return { status: 'ok', supplierTotal, supplierCurrency: o.total_currency, total, tax };
    } catch (e) {
      if (e instanceof DuffelApiError) {
        const se = supplyErrorFromDuffel(e);
        if (se.code === 'sold_out') return { status: 'sold_out' };
        if (se.code === 'expired') return { status: 'expired' };
        throw se;
      }
      throw e;
    }
  },

  async createOrder(input: FlightOrderInput): Promise<FlightOrderResult> {
    const adults = input.passengers.filter((p) => p.type === 'adult');
    const infants = input.passengers.filter((p) => p.type === 'infant');
    const passengers = input.passengers.map((p, i) => {
      const t = input.travelers[i];
      const doc = t.passport ? [{ type: 'passport' as const, unique_identifier: t.passport.number, issuing_country_code: t.passport.country, expires_on: t.passport.expiresOn }] : undefined;
      /* each infant travels on an adult's lap: infant n with adult n */
      const infantIdx = p.type === 'adult' ? adults.indexOf(p) : -1;
      return {
        id: p.id, title: t.title, given_name: t.given, family_name: t.family, gender: t.gender, born_on: t.bornOn,
        email: input.email, phone_number: input.phone,
        ...(doc ? { identity_documents: doc } : {}),
        ...(infantIdx > -1 && infants[infantIdx] ? { infant_passenger_id: infants[infantIdx].id } : {})
      };
    });
    try {
      const { data } = await duffel<DuffelOrder>('POST', '/air/orders', {
        body: {
          type: 'instant',
          selected_offers: [input.offerId],
          payments: [{ type: 'balance', amount: fromMinor(input.supplierAmount, input.supplierCurrency), currency: input.supplierCurrency }],
          passengers,
          metadata: { booking_id: input.bookingId, reference: input.reference }
        },
        timeoutMs: supplierBookingTimeoutMs(), retry: false, device: input.device
      });
      return orderResult(data);
    } catch (e) {
      if (e instanceof DuffelApiError) throw supplyErrorFromDuffel(e);
      throw e;
    }
  },

  /* Only an order stamped with this booking's id counts (createOrder always sets it); never "some
     order on this offer". A matching order that was cancelled or voided means not booked. */
  async findOrder(offerId: string, bookingId: string): Promise<FlightOrderResult | null> {
    const { data } = await duffel<DuffelOrder[]>('GET', '/air/orders', { query: { offer_id: offerId, limit: 50 }, timeoutMs: 20000, retry: true });
    const match = data.find((o) => o.metadata?.booking_id === bookingId);
    return match && !match.cancelled_at ? orderResult(match) : null;
  },

  async getDocuments(orderId: string) {
    const { data } = await duffel<DuffelOrder>('GET', `/air/orders/${encodeURIComponent(orderId)}`, { retry: true });
    return orderResult(data).documents;
  }
};

/* ============================= places ================================ */
export type PlaceSuggestion = { code: string; name: string; city: string; country: string; type: 'airport' | 'city'; lat: number | null; lng: number | null };
export async function duffelPlaces(query: string): Promise<PlaceSuggestion[]> {
  const { data } = await duffel<DuffelPlace[]>('GET', '/places/suggestions', { query: { query }, timeoutMs: 8000, retry: true });
  return data.filter((p) => p.iata_code).slice(0, 12).map((p) => {
    const [lat, lng] = centreOf(p);
    return {
      code: p.iata_code!, name: p.name, city: p.city_name || p.city?.name || p.name,
      country: p.iata_country_code ? countryName(p.iata_country_code) : '', type: p.type, lat, lng
    };
  });
}
/* a place's own coordinates; a city without them gets the midpoint of its airports */
function centreOf(p: DuffelPlace): [number | null, number | null] {
  if (p.latitude != null && p.longitude != null) return [p.latitude, p.longitude];
  const pts = (p.airports ?? []).filter((a) => a.latitude != null && a.longitude != null);
  if (!pts.length) return [null, null];
  return [pts.reduce((t, a) => t + a.latitude!, 0) / pts.length, pts.reduce((t, a) => t + a.longitude!, 0) / pts.length];
}

/* ============================== stays ================================ */
const BOARD: Record<NonNullable<DuffelRate['board_type']>, string> = {
  room_only: 'Room only', breakfast: 'Breakfast included', half_board: 'Half board', full_board: 'Full board', all_inclusive: 'All inclusive'
};
const stripHtml = (s: string | null | undefined) => (s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&apos;/g, '’').replace(/&quot;/g, '"').replace(/\n{3,}/g, '\n\n').trim();
const firstSentences = (s: string, max = 180) => { const t = s.replace(/\s+/g, ' '); if (t.length <= max) return t; const cut = t.slice(0, max); const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! ')); return end > 60 ? cut.slice(0, end + 1) : `${cut.replace(/\s\S*$/, '')}…`; };
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'room';

function km(a: [number, number], b: [number, number]): number {
  const r = Math.PI / 180;
  const h = Math.sin(((b[0] - a[0]) * r) / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(((b[1] - a[1]) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/* a rate the site can sell: paid now, from the Duffel balance, in the app currency */
const bookable = (r: DuffelRate) => r.payment_type === 'pay_now' && r.available_payment_methods?.includes('balance') && r.total_currency === appCurrency();

function mapRate(r: DuffelRate, s: StaySearch): RatePlan {
  const supplierTotal = toMinor(r.total_amount, r.total_currency);
  const total = withMarkup(supplierTotal);
  const tax = (r.tax_amount ? toMinor(r.tax_amount, r.total_currency) : 0) + (r.fee_amount ? toMinor(r.fee_amount, r.total_currency) : 0);
  const now = Date.now();
  /* free cancellation: a timeline entry, still ahead, that refunds the whole amount */
  const full = (r.cancellation_timeline ?? []).filter((c) => Date.parse(c.before) > now && toMinor(c.refund_amount, c.currency) >= supplierTotal)
    .sort((a, b) => Date.parse(b.before) - Date.parse(a.before))[0];
  const refundable = !!full;
  const board = r.board_type ? BOARD[r.board_type] : 'Room only';
  const breakfast = !!r.board_type && r.board_type !== 'room_only';
  const nights = Math.max(1, nightsOf(s));
  return {
    id: r.id,
    name: r.name?.trim() || `${board}, ${refundable ? 'free cancellation' : 'non-refundable'}`,
    nightly: Math.round(total / nights), total, tax,
    refundable, breakfast, board,
    freeCancelUntil: full ? full.before.slice(0, 10) : null,
    payAtHotel: r.due_at_accommodation_amount && Number(r.due_at_accommodation_amount) > 0 && r.due_at_accommodation_currency
      ? { amount: toMinor(r.due_at_accommodation_amount, r.due_at_accommodation_currency), currency: r.due_at_accommodation_currency } : null,
    conditions: (r.conditions ?? []).map((c) => ({ title: stripHtml(c.title), body: stripHtml(c.description) })).filter((c) => c.body),
    available: r.quantity_available !== 0
  };
}

function bedsText(beds: { type: string; count: number }[] | null): string {
  if (!beds?.length) return '';
  const word: Record<string, string> = { single: 'single bed', double: 'double bed', queen: 'queen bed', king: 'king bed', sofabed: 'sofa bed', bunk: 'bunk bed' };
  return beds.map((b) => plural(b.count, word[b.type] ?? `${b.type} bed`, `${word[b.type] ?? `${b.type} bed`}s`)).join(' and ');
}

function mapAccommodation(a: DuffelAccommodation, place: string, center: [number, number] | null, s: StaySearch | null, searchResultId?: string): Hotel {
  const addr = a.location?.address;
  const coords = a.location?.geographic_coordinates;
  const about = stripHtml(a.description);
  const photos: HotelPhoto[] = (a.photos ?? []).slice(0, 30).map((p, i) => ({ name: p.url, cat: i === 0 ? 'Outside' : 'Inside', caption: `photo ${i + 1}` }));
  const amenities = (a.amenities ?? []).map((x) => x.description).filter(Boolean);
  const rooms: Room[] = s ? (a.rooms ?? []).map((room, i) => {
    const plans = (room.rates ?? []).filter(bookable).map((r) => mapRate(r, s)).sort((x, y) => x.total! - y.total!);
    const cheapest = plans[0];
    const beds = bedsText(room.beds);
    const roomPhotos = (room.photos ?? []).map((p) => p.url);
    for (const url of roomPhotos) if (!photos.some((p) => p.name === url)) photos.push({ name: url, cat: 'Rooms', caption: room.name });
    return {
      id: `${slug(room.name)}-${i + 1}`, name: room.name, beds, spec: beds || room.name,
      sleeps: guestsPerRoom(s), nightly: cheapest?.nightly ?? 0, refundable: cheapest?.refundable ?? false, breakfast: cheapest?.breakfast ?? false,
      photos: roomPhotos, plans
    };
  }).filter((r) => r.plans!.length) : [];
  const info = a.check_in_information;
  const country = addr?.country_code ? countryName(addr.country_code) : '';
  const policies: { title: string; body: string }[] = [
    { title: 'Payment', body: 'You pay the full price now, by card. Any local tax the hotel collects is paid at the hotel.' }
  ];
  if (a.key_collection?.instructions) policies.push({ title: 'Key collection', body: stripHtml(a.key_collection.instructions) });
  return {
    id: a.id, name: a.name, city: place, area: addr?.city_name || addr?.region || '', country,
    stars: a.rating ?? 0, lat: coords?.latitude ?? 0, lon: coords?.longitude ?? 0,
    card: firstSentences(about), about, cardAmenities: amenities.slice(0, 3), amenities, photos, rooms,
    checkIn: info?.check_in_after_time?.slice(0, 5) ?? '', checkOut: info?.check_out_before_time?.slice(0, 5) ?? '',
    address: [addr?.line_one, addr?.city_name, addr?.postal_code, country].filter(Boolean).join(', '),
    policies, supplier: 'duffel', searchResultId, keyCollection: a.key_collection?.instructions ?? null,
    type: a.type ? a.type.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : undefined,
    score: a.review_score ?? undefined, scoreWord: a.review_score ? scoreWord(a.review_score) : undefined,
    reviews: a.review_count ?? undefined,
    fromCentre: center && coords ? Math.round(km(center, [coords.latitude, coords.longitude]) * 10) / 10 : undefined,
    lead: 0
  };
}

function guestsOf(s: StaySearch) {
  /* Duffel prices children by age: the ages the search card asked for */
  return [...Array.from({ length: s.adults }, () => ({ type: 'adult' })), ...childAges(s).map((age) => ({ type: 'child', age }))];
}
/* km around the centre: a curated city's centre is hand-placed; a suggested destination's centre may be
   its airports' midpoint, so it searches wider */
const radiusFor = (place: string) => (isGeoPlace(place) ? 20 : 10);
function centerOf(place: string): [number, number] | null {
  const c = cityById(place);
  return c ? [c.lat, c.lng] : null;
}

function stayError(e: unknown): never {
  if (e instanceof DuffelApiError) throw supplyErrorFromDuffel(e);
  throw e;
}

export const duffelStays: StaySupplier = {
  name: 'duffel',

  async search(s: StaySearch): Promise<StayCard[]> {
    const center = centerOf(s.place);
    if (!center) return [];
    let data: { results: DuffelStaySearchResult[] };
    try {
      ({ data } = await duffel<{ results: DuffelStaySearchResult[] }>('POST', '/stays/search', {
        body: {
          location: { radius: radiusFor(s.place), geographic_coordinates: { latitude: center[0], longitude: center[1] } },
          check_in_date: s.checkin, check_out_date: s.checkout, rooms: s.rooms, guests: guestsOf(s)
        },
        timeoutMs: 45000, retry: true
      }));
    } catch (e) { stayError(e); }
    const nights = Math.max(1, nightsOf(s));
    return data.results.filter((r) => r.cheapest_rate_currency === appCurrency()).map((r) => {
      const hotel = mapAccommodation(r.accommodation, s.place, center, null, r.id);
      const total = withMarkup(toMinor(r.cheapest_rate_total_amount, r.cheapest_rate_currency));
      return { hotel, nightly: Math.round(total / nights), total, freeCancel: null, breakfast: null, distance: hotel.fromCentre ?? 0 };
    });
  },

  async hotel(id: string, s: StaySearch | null, searchResultId?: string | null): Promise<HotelLoad | null> {
    const place = s?.place ?? '';
    const center = centerOf(place);
    try {
      let acc: DuffelAccommodation | null = null;
      let srr: string | undefined;
      if (s) {
        let result: DuffelStaySearchResult | null = null;
        if (searchResultId) {
          try {
            ({ data: result } = await duffel<DuffelStaySearchResult>('POST', `/stays/search_results/${encodeURIComponent(searchResultId)}/actions/fetch_all_rates`, { timeoutMs: 45000, retry: true }));
            if (result.accommodation.id !== id || result.check_in_date !== s.checkin || result.check_out_date !== s.checkout || result.rooms !== s.rooms) result = null;
          } catch (e) {
            if (!(e instanceof DuffelApiError) || e.status >= 500) throw e;
            result = null; /* expired search result: search this hotel again below */
          }
        }
        if (!result) {
          const { data } = await duffel<{ results: DuffelStaySearchResult[] }>('POST', '/stays/search', {
            body: { accommodation: { ids: [id], fetch_rates: true }, check_in_date: s.checkin, check_out_date: s.checkout, rooms: s.rooms, guests: guestsOf(s) },
            timeoutMs: 45000, retry: true
          });
          result = data.results[0] ?? null;
          if (result && !result.accommodation.rooms?.length) {
            ({ data: result } = await duffel<DuffelStaySearchResult>('POST', `/stays/search_results/${encodeURIComponent(result.id)}/actions/fetch_all_rates`, { timeoutMs: 45000, retry: true }));
          }
        }
        acc = result?.accommodation ?? null;
        srr = result?.id;
      }
      if (!acc) {
        try {
          ({ data: acc } = await duffel<DuffelAccommodation>('GET', `/stays/accommodation/${encodeURIComponent(id)}`, { retry: true }));
        } catch (e) {
          if (e instanceof DuffelApiError && e.status === 404) return null;
          throw e;
        }
        if (s) acc = { ...acc, rooms: [] }; /* dated, but no rates for these dates: content only */
      }
      const hotel = mapAccommodation(acc, place, center, s, srr);
      /* reviews: nice to have, never blocks the page */
      try {
        const { data } = await duffel<{ reviews: DuffelReview[] }>('GET', `/stays/accommodation/${encodeURIComponent(id)}/reviews`, { query: { limit: 6 }, timeoutMs: 6000 });
        hotel.reviewList = (data.reviews ?? []).map((r) => ({
          name: r.reviewer_name || 'Guest', country: '', trip: '',
          month: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          score: r.score, title: '', text: stripHtml(r.text)
        }));
      } catch { /* no reviews */ }
      return { hotel };
    } catch (e) { stayError(e); }
  },

  async quote(rate: RateSnapshot): Promise<StayQuote> {
    try {
      const { data: q } = await duffel<DuffelQuote>('POST', '/stays/quotes', { body: { rate_id: rate.plan.id }, timeoutMs: 45000 });
      const supplierTotal = toMinor(q.total_amount, q.total_currency);
      const tax = (q.tax_amount ? toMinor(q.tax_amount, q.total_currency) : 0) + (q.fee_amount ? toMinor(q.fee_amount, q.total_currency) : 0);
      return {
        quoteId: q.id, supplierTotal, supplierCurrency: q.total_currency, total: withMarkup(supplierTotal), tax,
        payAtHotel: q.due_at_accommodation_amount && Number(q.due_at_accommodation_amount) > 0 && q.due_at_accommodation_currency
          ? { amount: toMinor(q.due_at_accommodation_amount, q.due_at_accommodation_currency), currency: q.due_at_accommodation_currency } : null
      };
    } catch (e) { stayError(e); }
  },

  async book(input: StayBookingInput): Promise<StayBookingResult> {
    try {
      const res = await duffel<DuffelStayBooking>('POST', '/stays/bookings', {
        body: {
          quote_id: input.quoteId, email: input.email, phone_number: input.phone,
          guests: input.guests.map((g) => ({ given_name: g.given, family_name: g.family })),
          ...(input.requests ? { accommodation_special_requests: input.requests.slice(0, 1000) } : {}),
          metadata: { booking_id: input.bookingId, reference: input.reference }
        },
        timeoutMs: supplierBookingTimeoutMs(), retry: false, device: input.device
      });
      const b = res.data;
      /* 202: accepted, confirmation follows (webhook stays.booking.created) */
      if (!b?.id) return { bookingId: '', confirmation: null, liveMode: false, status: 'pending' };
      return stayResult(b);
    } catch (e) { stayError(e); }
  },

  async findBooking(bookingId: string): Promise<StayBookingResult | null> {
    /* Stays bookings can't be filtered by metadata: scan the most recent ones */
    let after: string | undefined;
    for (let page = 0; page < 3; page++) {
      const res = await duffel<DuffelStayBooking[]>('GET', '/stays/bookings', { query: { limit: 100, after }, retry: true });
      const hit = res.data.find((b) => b.metadata?.booking_id === bookingId);
      if (hit) return stayResult(hit);
      after = res.meta?.after ?? undefined;
      if (!after) break;
    }
    return null;
  }
};

function stayResult(b: DuffelStayBooking): StayBookingResult {
  return {
    bookingId: b.id, confirmation: b.reference, liveMode: !!b.live_mode,
    status: b.status === 'confirmed' ? 'confirmed' : 'pending',
    keyCollection: b.accommodation?.key_collection?.instructions ?? null,
    hotelPhone: b.accommodation?.phone_number ?? null, hotelEmail: b.accommodation?.email ?? null
  };
}


/* ============================ webhooks ============================== */
/* our booking id stamped on a Duffel order (metadata), for events that arrive before we saved the order id */
export async function duffelOrderBookingId(orderId: string): Promise<string | null> {
  try {
    const { data } = await duffel<DuffelOrder>('GET', `/air/orders/${encodeURIComponent(orderId)}`, { retry: true });
    return data.metadata?.booking_id ?? null;
  } catch (e) {
    if (e instanceof DuffelApiError && e.status === 404) return null;
    throw e;
  }
}
/* one Stays booking with our booking id, for stays.booking.created / cancelled */
export async function duffelStayBooking(id: string): Promise<{ result: StayBookingResult; bookingId: string | null } | null> {
  try {
    const { data } = await duffel<DuffelStayBooking>('GET', `/stays/bookings/${encodeURIComponent(id)}`, { retry: true });
    return { result: stayResult(data), bookingId: data.metadata?.booking_id ?? null };
  } catch (e) {
    if (e instanceof DuffelApiError && e.status === 404) return null;
    throw e;
  }
}
