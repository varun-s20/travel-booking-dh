/* =====================================================================
   Landfall: the booking view model
   What My bookings, the booking page, the confirmation page and the
   emails read. The server builds it from the bookings table (its stored
   summary, payment and documents), so the pages need no catalogue: a
   stay carries its hotel's name and address, a flight its itinerary and
   the names of every airport and airline it mentions (dict).
   Isomorphic.
   ===================================================================== */
import type { Cabin } from '@/lib/cabins';
import type { Amounts, FareId, Pax, Slice } from '@/lib/travel/flights';
import type { StaySearch } from '@/lib/travel/hotels';
import type { Dict } from '@/lib/travel/registry';

/* pending: payment taken, the airline or hotel is still confirming; completed: the trip is over */
export type Status = 'confirmed' | 'pending' | 'changed' | 'canceled' | 'completed' | 'failed';
export type Traveler = { name: string; type: 'adult' | 'child' | 'infant'; lead?: boolean; ticket?: string };
export type Card = { brand: string; last4: string };
export type TravelDocument = { type: string; id: string; passenger?: string };

type Common = {
  ref: string; status: Status; bookedAt: string; email: string; phone?: string | null;
  card: Card | null; currency: string;
  supplierReference?: string | null;   /* airline PNR or the hotel's confirmation number */
  canceledAt?: string;
  testMode?: boolean;                   /* booked against a supplier sandbox: no real ticket or room */
};

export type FlightBooking = Common & {
  kind: 'flight';
  from: string; to: string; depart: string; ret: string | null; slices: Slice[];
  airline: string; fare: FareId; fareName: string; cabin: Cabin; pax: Pax;
  travelers: Traveler[]; amounts: Amounts;
  ticketsPending: boolean;              /* paid and booked, e-tickets not issued yet */
  documents: TravelDocument[];
  /* refund in minor units when the fare allows cancelling online, otherwise null */
  refund: number | null;
  conditions?: { change: string; refund: string };
  dict: Dict;
};

export type StayBooking = Common & {
  kind: 'stay';
  hotel: string;                        /* the hotel's id */
  stay: {
    name: string; city: string; cityName: string; area: string; address: string; country: string;
    photo: string | null; checkIn: string; checkOut: string;
    phone?: string | null; email?: string | null; keyCollection?: string | null;
  };
  room: string; roomName: string; planName: string; board?: string;
  search: StaySearch; guests: string[]; requests?: string;
  amounts: { room: number; tax: number; total: number };
  payAtHotel?: { amount: number; currency: string } | null;
  freeCancelUntil: string | null;
  conditions?: { title: string; body: string }[];
};

export type Booking = FlightBooking | StayBooking;
