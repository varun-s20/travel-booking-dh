/* =====================================================================
   Landfall server: supplier interfaces
   What the booking code needs from a supplier, in the site's own view
   models (lib/travel). Two implementations: Duffel (duffel.ts) and the
   simulated catalogue (simulated.ts), chosen by supplyMode() in index.ts.
   Failures a customer can act on throw SupplyError (server/errors.ts);
   SupplyError.ambiguous means "may have booked": never refund on those
   until the supplier has been checked.
   ===================================================================== */
import 'server-only';
import type { Dict } from '@/lib/travel/registry';
import type { FlightSearch, Offer } from '@/lib/travel/flights';
import type { Hotel, StayCard, StaySearch, RatePlan, Room } from '@/lib/travel/hotels';

export type SupplierName = 'duffel' | 'simulated';
/* the supplier's passenger ids, in traveler order: adults, then children, then infants */
export type SupplierPassenger = { id: string; type: 'adult' | 'child' | 'infant' };

export type FlightSearchResult = {
  searchId: string;
  offers: Offer[];
  passengers: SupplierPassenger[];
  expiresAt: number;
  dict: Dict;
  liveMode: boolean;
};

/* the customer's travelers as the order needs them (validated in the checkout) */
export type OrderTraveler = {
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
  given: string; family: string; bornOn: string; gender: 'm' | 'f';
  type: 'adult' | 'child' | 'infant';
  passport?: { number: string; country: string; expiresOn: string } | null;
};

export type FlightOrderInput = {
  bookingId: string; reference: string;
  offerId: string;                /* the fare's supplier offer id */
  supplierAmount: number; supplierCurrency: string;
  passengers: SupplierPassenger[];
  travelers: OrderTraveler[];
  email: string; phone: string;
  device?: { ip?: string; userAgent?: string };
};
export type FlightOrderResult = {
  orderId: string; pnr: string; liveMode: boolean;
  /* e-tickets: may be empty right after booking; fetched again later */
  documents: { type: string; id: string; passenger?: string }[];
};

/* the current price of one fare, straight from the supplier */
export type OfferQuote =
  | { status: 'ok'; supplierTotal: number; supplierCurrency: string; total: number; tax: number }
  | { status: 'sold_out' }
  | { status: 'expired' };

export interface FlightSupplier {
  name: SupplierName;
  search(s: FlightSearch): Promise<FlightSearchResult>;
  quoteOffer(offerId: string): Promise<OfferQuote>;
  createOrder(input: FlightOrderInput): Promise<FlightOrderResult>;
  /* after an ambiguous failure: did an order get made for this offer after all? */
  findOrder(offerId: string, bookingId: string): Promise<FlightOrderResult | null>;
  getDocuments(orderId: string): Promise<FlightOrderResult['documents']>;
}

/* ---------- stays ---------- */
export type HotelLoad = { hotel: Hotel; similar?: Hotel[] };
export type StayQuote = {
  quoteId: string;
  supplierTotal: number; supplierCurrency: string;
  total: number; tax: number;
  payAtHotel: { amount: number; currency: string } | null;
};
export type StayBookingInput = {
  bookingId: string; reference: string; quoteId: string;
  guests: { given: string; family: string }[];
  email: string; phone: string; requests?: string;
  device?: { ip?: string; userAgent?: string };
};
export type StayBookingResult = {
  bookingId: string; confirmation: string | null; liveMode: boolean;
  /* 'pending' when the supplier accepted the request but hasn't confirmed yet */
  status: 'confirmed' | 'pending';
  keyCollection?: string | null;
  hotelPhone?: string | null; hotelEmail?: string | null;
};
/* one rate as the guest form and checkout need it (also cached in stay_rates) */
export type RateSnapshot = { hotel: Hotel; room: Room; plan: RatePlan; search: StaySearch; searchResultId?: string | null };

export interface StaySupplier {
  name: SupplierName;
  search(s: StaySearch): Promise<StayCard[]>;
  /* the hotel's content; with dates, its rooms and every bookable rate priced for the search */
  hotel(id: string, s: StaySearch | null, searchResultId?: string | null): Promise<HotelLoad | null>;
  quote(rate: RateSnapshot): Promise<StayQuote>;
  book(input: StayBookingInput): Promise<StayBookingResult>;
  findBooking(bookingId: string): Promise<StayBookingResult | null>;
}
