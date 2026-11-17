/* Simulated Duffel Stays quote and booking in one step, once the card is
   authorised. A room that is no longer available can't be confirmed. */
import { freeCancelUntil, hotelById, parseStaySearch, planById, roomAvailable, roomById, stayTotals } from '@/lib/mock/hotels';
import { newRef, type StayBooking } from '@/lib/mock/bookings';
import { between, body, fail, ok, wait } from '@/lib/mock/server';

export const dynamic = 'force-dynamic';

type In = { hotel: string; room: string; search: Record<string, string>; guests: string[]; requests?: string; plan?: string; arrival?: string; email: string; card: { brand: string; last4: string }; owner: string | null; paymentIntent: string; check?: boolean };

export async function POST(req: Request) {
  const b = await body<In>(req);
  const h = b && hotelById(b.hotel);
  const r = h && roomById(h, b!.room);
  const parsed = b && parseStaySearch(b.search || {});
  if (!b || !h || !r || !parsed) return fail('invalid_request', 422);
  const s = parsed.search;
  await wait(between(900, 1400));
  if (!roomAvailable(h, r, s)) return fail('rate_unavailable', 409);
  const p = planById(r, b.plan);
  const t = stayTotals(r, s, p);
  /* "Checking the room with the hotel": the quote only */
  if (b.check) return ok({ status: 'ok', total: t.total });
  if (!b.paymentIntent) return fail('invalid_request', 422);
  const booking: StayBooking = {
    kind: 'stay', ref: newRef(), status: 'confirmed', bookedAt: new Date().toISOString().slice(0, 10), owner: b.owner ?? null,
    hotel: h.id, room: r.id, search: s, guests: b.guests, requests: b.requests?.slice(0, 500) || undefined, plan: p.id, arrival: b.arrival?.slice(0, 40) || undefined,
    amounts: { room: t.room, tax: t.tax, total: t.total }, card: b.card, email: b.email,
    freeCancelUntil: p.refundable ? freeCancelUntil(s) : null
  };
  return ok({ booking }, 201);
}
