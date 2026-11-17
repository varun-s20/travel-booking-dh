/* =====================================================================
   Landfall server: search caches (Supabase tables, server only)
   - flight_searches + flight_search_offers: every offer a search returned,
     so /flights/<offer>, the traveler form and checkout resolve an offer
     id on the server without searching again; and the same visitor's
     repeated search within a few minutes reuses the stored one (Duffel
     bills searches beyond a look-to-book ratio and rate-limits them).
     Reuse is per visitor, never shared: Duffel allows one order per
     offer request, so two customers must never book from one search.
   - stay_rates: each rate a hotel page showed, so the guest form and
     checkout resolve ?plan=<rate id> to the room, board and terms.
   Expired rows are purged by the scheduled job (purge_expired).
   ===================================================================== */
import 'server-only';
import { adminDb } from '@/server/db/supabase';
import { log } from '@/server/log';
import { searchKey, type FlightSearch, type Offer } from '@/lib/travel/flights';
import type { Dict } from '@/lib/travel/registry';
import type { FlightSearchResult, RateSnapshot, SupplierName, SupplierPassenger } from '@/server/supply/types';

/* a stored search is reused for this long, and only while its offers stay valid for 10 more minutes */
const REUSE_MS = 5 * 60 * 1000;
const MIN_LEFT_MS = 10 * 60 * 1000;

export type StoredSearch = {
  id: string; supplier: SupplierName; search: FlightSearch; passengers: SupplierPassenger[];
  offers: Offer[]; dict: Dict; createdAt: number; expiresAt: number;
};
type Payload = { offers: Offer[]; dict: Dict };

const toStored = (row: { id: string; supplier: SupplierName; params: unknown; passengers: unknown; payload: unknown; created_at: string; expires_at: string }): StoredSearch => {
  const p = row.payload as Payload;
  return { id: row.id, supplier: row.supplier, search: row.params as FlightSearch, passengers: row.passengers as SupplierPassenger[], offers: p.offers, dict: p.dict, createdAt: Date.parse(row.created_at), expiresAt: Date.parse(row.expires_at) };
};

/* the cache key: the search, and who searched (a keyed hash of the visitor) */
const paramsKey = (s: FlightSearch, visitor: string) => `${searchKey(s)}|${visitor}`;

export async function findReusableSearch(s: FlightSearch, supplier: SupplierName, visitor: string): Promise<StoredSearch | null> {
  const { data, error } = await adminDb().from('flight_searches').select('*')
    .eq('params_key', paramsKey(s, visitor)).eq('supplier', supplier)
    .gt('created_at', new Date(Date.now() - REUSE_MS).toISOString())
    .gt('expires_at', new Date(Date.now() + MIN_LEFT_MS).toISOString())
    .order('created_at', { ascending: false }).limit(1).maybeSingle();
  if (error) { log.warn('cache.search_read', { error: error.message }); return null; }
  return data ? toStored(data) : null;
}

export async function saveSearch(s: FlightSearch, supplier: SupplierName, r: FlightSearchResult, visitor: string): Promise<void> {
  const db = adminDb();
  const { error } = await db.from('flight_searches').insert({
    id: r.searchId, supplier, params_key: paramsKey(s, visitor), params: s as never, passengers: r.passengers as never,
    payload: { offers: r.offers, dict: r.dict } as never, expires_at: new Date(r.expiresAt).toISOString()
  });
  if (error) throw new Error(`cache.save_search: ${error.message}`);
  const rows = r.offers.flatMap((o, i) => o.fares.map((f, j) => ({ offer_id: f.offerId, search_id: r.searchId, itinerary_index: i, fare_index: j })));
  for (let i = 0; i < rows.length; i += 500) {
    const { error: e2 } = await db.from('flight_search_offers').upsert(rows.slice(i, i + 500), { onConflict: 'offer_id' });
    if (e2) throw new Error(`cache.save_offers: ${e2.message}`);
  }
}

/* any fare's offer id (or an itinerary id) -> its itinerary, the fare's index and the search */
export async function loadOffer(offerId: string): Promise<{ stored: StoredSearch; offer: Offer; fareIndex: number } | null> {
  if (!/^[A-Za-z0-9_.\-~=]{4,200}$/.test(offerId)) return null;
  const db = adminDb();
  const { data: link } = await db.from('flight_search_offers').select('*').eq('offer_id', offerId).maybeSingle();
  if (!link) return null;
  const { data: row } = await db.from('flight_searches').select('*').eq('id', link.search_id).maybeSingle();
  if (!row) return null;
  const stored = toStored(row);
  const offer = stored.offers[link.itinerary_index];
  return offer ? { stored, offer, fareIndex: link.fare_index } : null;
}

/* ---------- stay rates ---------- */
export async function saveRates(snapshots: RateSnapshot[], supplier: SupplierName, ttlMs: number): Promise<void> {
  if (!snapshots.length) return;
  const expires = new Date(Date.now() + ttlMs).toISOString();
  const rows = snapshots.map((x) => ({
    rate_id: x.plan.id, supplier, accommodation_id: x.hotel.id, search_result_id: x.searchResultId ?? null,
    params: x.search as never, payload: { hotel: x.hotel, room: x.room, plan: x.plan } as never, expires_at: expires
  }));
  const { error } = await adminDb().from('stay_rates').upsert(rows, { onConflict: 'rate_id' });
  if (error) throw new Error(`cache.save_rates: ${error.message}`);
}

export async function loadRate(rateId: string): Promise<(RateSnapshot & { supplier: SupplierName; expiresAt: number }) | null> {
  if (!/^[A-Za-z0-9_:.\-]{4,200}$/.test(rateId)) return null;
  const { data } = await adminDb().from('stay_rates').select('*').eq('rate_id', rateId).maybeSingle();
  if (!data) return null;
  const p = data.payload as unknown as Omit<RateSnapshot, 'search'>;
  return { ...p, search: data.params as unknown as RateSnapshot['search'], searchResultId: data.search_result_id, supplier: data.supplier, expiresAt: Date.parse(data.expires_at) };
}
