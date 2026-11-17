/* =====================================================================
   Landfall server: the simulated supplier
   The demo catalogue (lib/mock) behind the same interface as Duffel, so
   the whole site (search, accounts, Stripe, emails, My bookings) runs
   with no Duffel token. Its demo states stay: some offers change price,
   sell out or can't be confirmed (lib/mock/flights.ts, scenarios), and
   Casa Lanterna's Terrace Suite is unavailable over five nights.
   Ids: a fare is "<mock offer id>.<tier>", a rate "sim:<hotel>:<room>:<plan>".
   Nothing here is real; bookings are marked supplier 'simulated'.
   ===================================================================== */
import 'server-only';
import { randomInt } from 'node:crypto';
import * as MF from '@/lib/mock/flights';
import * as MH from '@/lib/mock/hotels';
import { GEO } from '@/lib/mock/geo';
import { newTicket } from '@/lib/mock/bookings';
import { SupplyError } from '@/server/errors';
import { newReference } from '@/server/crypto';
import { withMarkup, appCurrency } from '@/server/pricing';
import { dictFor, registerDict } from '@/lib/travel/registry';
import { FARE_TIERS, type Fare, type FlightSearch, type Offer } from '@/lib/travel/flights';
import { nightsOf, type Hotel, type RatePlan, type Room, type StayCard, type StaySearch } from '@/lib/travel/hotels';
import type {
  FlightOrderInput, FlightOrderResult, FlightSearchResult, FlightSupplier, HotelLoad, OfferQuote, RateSnapshot,
  StayBookingInput, StayBookingResult, StayQuote, StaySupplier, SupplierPassenger
} from './types';

/* the demo airlines' names, so pages can name them */
registerDict({ airlines: Object.fromEntries(Object.values(MF.AIRLINES).map((a) => [a.code, { code: a.code, name: a.name, logo: null }])) });

const rand = (n = 10) => Array.from({ length: n }, () => 'abcdefghijkmnpqrstuvwxyz23456789'[randomInt(32)]).join('');

/* ---------- flights ---------- */
function hasOf(f: MF.Fare): Fare['has'] {
  const inc = f.included.join(' ').toLowerCase(), no = f.notIncluded.join(' ').toLowerCase();
  const r = f.rows;
  const kind = (cell?: string) => { const c = (cell ?? '').trim(); if (!c) return 'no'; if (/^For a fee/i.test(c)) return 'fee'; if (/^(Not allowed|Not refundable|Not included|No |Seat assigned at check-in)/i.test(c)) return 'no'; return 'yes'; };
  if (!r) return { cabin: inc.includes('cabin bag'), checked: inc.includes('checked bag'), seat: inc.includes('seat') && !inc.includes('assign'), change: !no.includes('change'), refund: !no.includes('refund') };
  return { cabin: kind(r.cabin) === 'yes', checked: kind(r.checked) === 'yes', seat: /^Choose/i.test(r.seat.trim()), change: kind(r.changes) !== 'no', refund: kind(r.refunds) !== 'no' };
}

function toOffer(o: MF.Offer, s: FlightSearch, searchId: string): Offer {
  const seatsN = MF.seats(o.passengers);
  const fares: Fare[] = MF.faresFor(o.owner).slice(0, FARE_TIERS.length).map((f, i) => {
    const tier = FARE_TIERS[i];
    const a = MF.offerTotals(o, tier);
    const total = withMarkup(a.total);
    const seatBase = o.perSeat + MF.fareStep(o, tier) - o.taxPerSeat;
    const infantEach = Math.round(((o.perSeat - o.taxPerSeat) * 0.1) / 10) * 10;
    return {
      id: tier, offerId: `${o.id}.${tier}`, name: f.name, included: f.included, fee: f.fee, notIncluded: f.notIncluded, rows: f.rows,
      has: hasOf(f), base: total - a.tax, tax: a.tax, total, step: f.step,
      perType: seatsN ? { adult: seatBase, child: seatBase, infant: infantEach } : undefined
    };
  });
  const codes = new Set<string>(), airlines = new Set<string>([o.owner]);
  for (const sl of o.slices) for (const g of sl.segments) { codes.add(g.from); codes.add(g.to); airlines.add(g.airline); if (g.operatedBy) airlines.add(g.operatedBy); }
  return {
    id: fares[0].offerId, key: o.id, supplier: 'simulated', owner: o.owner, slices: o.slices,
    passengers: o.passengers, cabin: o.cabin, searchId, searchedAt: o.searchedAt, expiresAt: o.expiresAt,
    passport: o.passport, warnings: o.warnings, fares, currency: appCurrency(), dict: dictFor(codes, airlines)
  };
}

/* "off_xxx.classic" -> the mock offer and the tier */
function parseFareId(id: string): { found: ReturnType<typeof MF.findOffer>; tier: MF.FareId } {
  const dot = id.lastIndexOf('.');
  const tier = id.slice(dot + 1);
  return { found: dot > 0 ? MF.findOffer(id.slice(0, dot)) : null, tier: MF.isFare(tier) ? tier : 'light' };
}

export const simulatedFlights: FlightSupplier = {
  name: 'simulated',

  async search(s: FlightSearch): Promise<FlightSearchResult> {
    const searchedAt = Date.now();
    const searchId = `sim_${rand(16)}`;
    /* the catalogue knows a fixed list of airports; anything else has no flights */
    const list = GEO[s.from] && GEO[s.to] ? MF.generateOffers(s, searchedAt) : [];
    const offers = list.map((o) => toOffer(o, s, searchId));
    const passengers: SupplierPassenger[] = [
      ...Array.from({ length: s.adults }, (_, i) => ({ id: `sim_pas_a${i}`, type: 'adult' as const })),
      ...Array.from({ length: s.children }, (_, i) => ({ id: `sim_pas_c${i}`, type: 'child' as const })),
      ...Array.from({ length: s.infants }, (_, i) => ({ id: `sim_pas_i${i}`, type: 'infant' as const }))
    ];
    return { searchId, offers, passengers, expiresAt: searchedAt + MF.OFFER_LIFETIME, dict: {}, liveMode: false };
  },

  async quoteOffer(offerId: string): Promise<OfferQuote> {
    const { found, tier } = parseFareId(offerId);
    if (!found) return { status: 'sold_out' };
    const check = MF.priceCheck(found.offer, tier);
    if (check.status === 'expired' || check.status === 'sold_out') return { status: check.status };
    const tax = MF.offerTotals(found.offer, tier).tax;
    return { status: 'ok', supplierTotal: check.total, supplierCurrency: appCurrency(), total: withMarkup(check.total), tax };
  },

  async createOrder(input: FlightOrderInput): Promise<FlightOrderResult> {
    const { found } = parseFareId(input.offerId);
    if (!found) throw new SupplyError('sold_out');
    if (Date.now() > found.offer.expiresAt) throw new SupplyError('expired');
    if (found.offer.scenario === 'not_confirmed') throw new SupplyError('not_confirmed');
    if (found.offer.scenario === 'sold_out') throw new SupplyError('sold_out');
    return {
      orderId: `sim_ord_${rand(16)}`, pnr: newReference(), liveMode: false,
      documents: input.travelers.filter((t) => t.type !== 'infant').map((t) => ({ type: 'electronic_ticket', id: newTicket(found.offer.owner), passenger: `${t.given} ${t.family}` }))
    };
  },

  async findOrder() { return null; },
  async getDocuments() { return []; }
};

/* ---------- stays ---------- */
const rateId = (h: string, r: string, p: string) => `sim:${h}:${r}:${p}`;

function toHotel(h: MH.Hotel, s: StaySearch | null): Hotel {
  const nights = s ? Math.max(1, nightsOf(s)) : 1;
  const rooms: Room[] = h.rooms.map((r) => {
    const plans: RatePlan[] = MH.plansFor(r, s).map((p) => {
      const base: RatePlan = { id: rateId(h.id, r.id, p.id), name: p.name, nightly: p.nightly, refundable: p.refundable, breakfast: p.breakfast, board: p.breakfast ? 'Breakfast included' : 'Room only' };
      if (!s) return base;
      const t = MH.stayTotals(r, s, p.id);
      const total = withMarkup(t.total);
      return { ...base, nightly: Math.round(total / nights), total, tax: t.tax, freeCancelUntil: p.refundable ? MH.freeCancelUntil(s) : null, available: MH.roomAvailable(h, r, s) };
    });
    return { ...r, plans };
  });
  return { ...h, rooms, supplier: 'simulated' } as Hotel;
}

function parseRate(id: string) {
  const [tag, hotel, room, plan] = id.split(':');
  if (tag !== 'sim') return null;
  const h = MH.hotelById(hotel), r = h && MH.roomById(h, room);
  return h && r ? { h, r, plan } : null;
}

export const simulatedStays: StaySupplier = {
  name: 'simulated',

  async search(s: StaySearch): Promise<StayCard[]> {
    const nights = Math.max(1, nightsOf(s));
    return MH.searchStays(s).map((r) => {
      const total = withMarkup(r.amounts.total);
      return { hotel: toHotel(r.hotel, null), nightly: Math.round(total / nights), total, freeCancel: r.freeCancel, breakfast: r.breakfast, distance: r.distance };
    });
  },

  async hotel(id: string, s: StaySearch | null): Promise<HotelLoad | null> {
    const h = MH.hotelById(id);
    if (!h) return null;
    const similar = MH.HOTELS.filter((x) => x.city === h.city && x.id !== h.id).slice(0, 12).map((x) => toHotel(x, s));
    return { hotel: toHotel(h, s), similar };
  },

  async quote(rate: RateSnapshot): Promise<StayQuote> {
    const p = parseRate(rate.plan.id);
    if (!p || !MH.roomAvailable(p.h, p.r, rate.search)) throw new SupplyError('sold_out');
    const t = MH.stayTotals(p.r, rate.search, p.plan);
    return { quoteId: `simq_${rand(16)}`, supplierTotal: t.total, supplierCurrency: appCurrency(), total: withMarkup(t.total), tax: t.tax, payAtHotel: null };
  },

  async book(_input: StayBookingInput): Promise<StayBookingResult> {
    return { bookingId: `sim_bok_${rand(16)}`, confirmation: String(10000000 + randomInt(89999999)), liveMode: false, status: 'confirmed' };
  },

  async findBooking() { return null; }
};
