/* =====================================================================
   Landfall server: hotel search, hotel pages, rates
   - searchStays: results for a city and dates (cheapest rate per hotel).
   - getHotel: the hotel's content; with dates, every bookable rate priced
     for the search. Each rate is stored (stay_rates) so the guest form and
     checkout can resolve ?plan=<rate id> on the server.
   - getRate: one stored rate, for the guest form and checkout.
   ===================================================================== */
import 'server-only';
import { loadRate, saveRates } from '@/server/cache';
import { staySupplier } from '@/server/supply';
import { supplyMode } from '@/server/env';
import { log } from '@/server/log';
import type { Hotel, StayCard, StaySearch } from '@/lib/travel/hotels';
import type { RateSnapshot } from '@/server/supply/types';

/* Duffel rates and search results last about 30 minutes; keep the snapshot as long */
const RATE_TTL_MS = 30 * 60 * 1000;

export async function searchStays(s: StaySearch): Promise<StayCard[]> {
  const cards = await staySupplier().search(s);
  log.info('stays.searched', { supplier: supplyMode(), place: s.place, results: cards.length });
  return cards;
}

/* what a rate snapshot keeps of the hotel: enough for the guest form, checkout and emails */
function slim(h: Hotel): Hotel {
  return { ...h, rooms: [], photos: h.photos.slice(0, 3), reviewList: undefined, aboutMore: undefined, categories: undefined, highlights: undefined, nearby: undefined };
}

export async function getHotel(id: string, s: StaySearch | null, searchResultId?: string | null): Promise<{ hotel: Hotel; similar: Hotel[] } | null> {
  if (!/^[A-Za-z0-9_\-]{2,80}$/.test(id)) return null;
  const name = supplyMode();
  const load = await staySupplier(name).hotel(id, s, searchResultId);
  if (!load) return null;
  if (s) {
    const shell = slim(load.hotel);
    const snaps: RateSnapshot[] = load.hotel.rooms.flatMap((room) => (room.plans ?? []).map((plan) => ({ hotel: shell, room: { ...room, plans: [plan] }, plan, search: s, searchResultId: load.hotel.searchResultId ?? null })));
    try { await saveRates(snaps, name, RATE_TTL_MS); } catch (e) { log.error('stays.save_rates', { error: e }); }
  }
  return { hotel: load.hotel, similar: load.similar ?? [] };
}

export async function getRate(rateId: string) {
  const r = await loadRate(rateId);
  if (!r || r.expiresAt < Date.now()) return null;
  return r;
}
