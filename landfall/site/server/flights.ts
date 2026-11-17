/* =====================================================================
   Landfall server: flight search and fare checks
   - searchFlights: reuses a fresh stored search for the same query, or
     asks the supplier and stores the result (server/cache.ts).
   - getItinerary: an offer id from a URL -> the stored itinerary.
   - checkFare: "Fare and availability revalidation before booking": asks
     the supplier for the fare's current price and availability.
   - refreshItinerary: after the 30-minute expiry, searches again and finds
     the same flights, so "Refresh the price" keeps the customer's choice.
   ===================================================================== */
import 'server-only';
import { findReusableSearch, loadOffer, saveSearch, type StoredSearch } from '@/server/cache';
import { flightSupplier } from '@/server/supply';
import { supplyMode } from '@/server/env';
import { log } from '@/server/log';
import { fareFor, type FareId, type FlightSearch, type Offer, type PriceCheck } from '@/lib/travel/flights';
import type { Dict } from '@/lib/travel/registry';

export type SearchResponse = { searchId: string; searchedAt: number; expiresAt: number; supplier: string; offers: Offer[]; dict: Dict };

/* visitor: a keyed hash of who searched (the cache is never shared between customers) */
export async function searchFlights(s: FlightSearch, visitor: string, opts: { fresh?: boolean } = {}): Promise<SearchResponse> {
  const name = supplyMode();
  if (!opts.fresh) {
    const hit = await findReusableSearch(s, name, visitor);
    if (hit) return toResponse(hit);
  }
  const r = await flightSupplier(name).search(s);
  await saveSearch(s, name, r, visitor);
  log.info('flights.searched', { supplier: name, searchId: r.searchId, offers: r.offers.length, route: `${s.from}-${s.to}` });
  return { searchId: r.searchId, searchedAt: Date.now(), expiresAt: r.expiresAt, supplier: name, offers: r.offers, dict: r.dict };
}

const toResponse = (x: StoredSearch): SearchResponse => ({ searchId: x.id, searchedAt: x.createdAt, expiresAt: x.expiresAt, supplier: x.supplier, offers: x.offers, dict: x.dict });

export async function getItinerary(offerId: string): Promise<{ offer: Offer; search: FlightSearch; stored: StoredSearch; fareIndex: number } | null> {
  const hit = await loadOffer(offerId);
  return hit ? { offer: hit.offer, search: hit.stored.search, stored: hit.stored, fareIndex: hit.fareIndex } : null;
}

export async function checkFare(offerId: string, fare: FareId): Promise<PriceCheck & { offerId?: string }> {
  const it = await getItinerary(offerId);
  if (!it) return { status: 'expired' };
  if (Date.now() > it.offer.expiresAt) return { status: 'expired' };
  const f = fareFor(it.offer, fare);
  const q = await flightSupplier(it.stored.supplier).quoteOffer(f.offerId);
  if (q.status !== 'ok') return q;
  if (q.total === f.total) return { status: 'ok', total: q.total, offerId: f.offerId };
  return { status: q.total > f.total ? 'up' : 'down', total: q.total, delta: q.total - f.total, offerId: f.offerId };
}

/* the same flights from a new search, or null when they're gone */
export async function refreshItinerary(offerId: string, visitor: string): Promise<Offer | null> {
  const it = await getItinerary(offerId);
  if (!it) return null;
  const next = await searchFlights(it.search, visitor, { fresh: true });
  return next.offers.find((o) => o.key === it.offer.key) ?? null;
}
