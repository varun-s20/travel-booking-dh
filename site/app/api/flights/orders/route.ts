/* Simulated Duffel order: books the offer once the card is authorised.
   Petrel Air's 06:10 Lisbon offer (and a few generated ones) can't be
   confirmed by the airline, so the "couldn't confirm" panel can be seen.
   Returns the whole booking; the browser keeps it (lib/store.ts). */
import { AIRLINES, findOffer, isFareOf, offerTotals } from '@/lib/mock/flights';
import { TICKETS_DELAY, newRef, newTicket, refundFor, type FlightBooking, type Traveler } from '@/lib/mock/bookings';
import { between, body, fail, ok, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

type In = { offerId: string; fare: string; adjust?: number; travelers: Traveler[]; email: string; card: { brand: string; last4: string }; owner: string | null; paymentIntent: string };

export async function POST(req: Request) {
  const b = await body<In>(req);
  if (!b?.offerId || !b.paymentIntent || !Array.isArray(b.travelers)) return fail('invalid_request', 422);
  const found = findOffer(b.offerId);
  if (!found) return fail('offer_not_found', 404);
  const { offer, search } = found;
  await wait(between(1100, 1600));
  if (Date.now() > offer.expiresAt + 10 * 60 * 1000) return fail('offer_expired', 410);
  if (offer.scenario === 'not_confirmed') return fail('airline_not_confirmed', 409);
  const fare = isFareOf(offer, b.fare) ? b.fare : 'light';
  const amounts = offerTotals(offer, fare, Number(b.adjust) || 0);
  const booking: FlightBooking = {
    kind: 'flight', ref: newRef(), status: 'confirmed', bookedAt: new Date().toISOString().slice(0, 10), owner: b.owner ?? null,
    from: search.from, to: search.to, depart: search.depart, ret: search.ret, slices: offer.slices, airline: offer.owner,
    fare, cabin: search.cabin, pax: offer.passengers,
    travelers: b.travelers.map((t) => ({ ...t, ticket: newTicket(offer.owner) })),
    amounts, card: b.card, email: b.email, ticketsAt: Date.now() + TICKETS_DELAY,
    refund: refundFor(offer.owner, fare, amounts.total, offer.passengers)
  };
  return ok({ booking, airline: AIRLINES[offer.owner].name }, 201);
}
