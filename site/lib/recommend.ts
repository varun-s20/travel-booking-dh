/* =====================================================================
   travel-booking (working name Overwing, a placeholder): recommendations
   Round 3 spec A4 and 0.5, catalogue section 6. Pure functions over the
   light records lib/mock/home.ts sends to the browser and the visitor's
   history (lib/history.ts), so they run in the browser and can be tested
   on their own. Row titles and reason lines are the catalogue's, word
   for word; a row whose tokens can't be filled, or with fewer than 3
   cards, is dropped and the next first-visit row takes its place.
   ===================================================================== */
import type { CityCard, HotelCard, FareDeal, HomeData } from '@/lib/mock/home';
import type { History, SearchEntry } from '@/lib/history';

export type Mode = 'flights' | 'hotels';
export type RouteItem = { city: CityCard; depart: string; ret: string; price: number; deal: FareDeal | null };
export type StayItem = { hotel: HotelCard; checkin: string; checkout: string; adults: number; nightly: number };
export type Row = { id: string; title: string; reason: string; routes?: RouteItem[]; stays?: StayItem[] };

const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const d = (iso: string) => new Date(`${iso}T12:00:00`);
export function addDays(iso: string, n: number): string {
  const x = d(iso); x.setDate(x.getDate() + n);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
export const nightsBetween = (a: string, b: string) => Math.round((d(b).getTime() - d(a).getTime()) / 864e5);
/* "Nov 20 to 27", "Nov 28 to Dec 5" (the catalogue's {dates}) */
export function shortRange(a: string, b: string): string {
  const x = d(a), y = d(b);
  return x.getMonth() === y.getMonth() ? `${M[x.getMonth()]} ${x.getDate()} to ${y.getDate()}` : `${M[x.getMonth()]} ${x.getDate()} to ${M[y.getMonth()]} ${y.getDate()}`;
}
/* "Tue, Dec 2 to Tue, Dec 9" */
export function dayRangeLong(a: string, b: string): string {
  const f = (s: string) => { const x = d(s); return `${DAYS[x.getDay()]}, ${M[x.getMonth()]} ${x.getDate()}`; };
  return `${f(a)} to ${f(b)}`;
}
export const usd = (cents: number) => `$${Math.round(cents / 100).toLocaleString('en-US')}`;

/* links: every card is a real search or a real detail page */
export const flightHref = (iata: string, depart: string, ret: string | null, adults = 1, cabin = 'economy', airline?: string) =>
  `/flights?from=LHR&to=${iata}&depart=${depart}${ret ? `&return=${ret}` : ''}&adults=${adults}&children=0&infants=0&cabin=${cabin}${airline ? `&airline=${airline}` : ''}`;
export const staysHref = (place: string, checkin: string, checkout: string, adults = 2, rooms = 1, type?: string) =>
  `/hotels?place=${place}&checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=0&rooms=${rooms}${type ? `&type=${type}` : ''}`;
export const hotelHref = (id: string, checkin: string, checkout: string, adults = 2, rooms = 1) =>
  `/hotels/${id}?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=0&rooms=${rooms}`;

/* dates a card uses when the visitor gave none: a Tuesday three weeks out for a week (B's fares equal "Return from"
   on Tuesdays outside peaks); the coming weekend for stays */
export function defaultTrip(today: string): { depart: string; ret: string } {
  let dep = addDays(today, 21);
  while (d(dep).getDay() !== 2) dep = addDays(dep, 1);
  return { depart: dep, ret: addDays(dep, 7) };
}

export function routeItem(data: HomeData, city: CityCard, depart?: string, ret?: string): RouteItem {
  const deal = data.fareDeals.find((f) => f.slug === city.slug) ?? null;
  if (deal && !depart) return { city, depart: deal.depart, ret: deal.ret, price: deal.price, deal };
  const t = depart && ret ? { depart, ret } : defaultTrip(data.today);
  return { city, depart: t.depart, ret: t.ret, price: city.returnFrom, deal: null };
}
export const stayItem = (hotel: HotelCard, checkin: string, checkout: string, adults = 2, nightly = hotel.nightly): StayItem => ({ hotel, checkin, checkout, adults, nightly });

/* ---- the rows ---- */
const lastOf = (h: History | null, mode: Mode): SearchEntry | undefined => h?.searches.find((s) => s.mode === mode);

function firstVisit(data: HomeData): Record<string, Row> {
  const { cities, hotels, weekend } = data;
  const nonstopCities = new Set(cities.filter((c) => c.nonstop).map((c) => c.slug));
  const short = cities.filter((c) => c.nonstop && c.minutes > 0 && c.minutes < 180).sort((a, b) => a.returnFrom - b.returnFrom);
  const longHaul = data.fareDeals.filter((f) => (cities.find((c) => c.slug === f.slug)?.minutes ?? 0) > 360)
    .map((f) => routeItem(data, cities.find((c) => c.slug === f.slug)!));
  /* one or two per city, best first */
  const perCity: Record<string, number> = {};
  /* hotels the 8 stay deal cards already show are left out of these rows (critic: the same cards twice) */
  const dealIds = new Set(data.stayDeals.slice(0, 8).map((s) => s.hotelId));
  const rated = [...hotels].filter((h) => h.score >= 9 && nonstopCities.has(h.city) && !dealIds.has(h.id)).sort((a, b) => b.score - a.score || Number(b.showcase) - Number(a.showcase))
    .filter((h) => (perCity[h.city] = (perCity[h.city] || 0) + 1) <= 2).slice(0, 10);
  const fcb = hotels.filter((h) => h.fcbNightly !== null && !dealIds.has(h.id)).sort((a, b) => (a.fcbNightly! - b.fcbNightly!)).slice(0, 10);
  const beach = hotels.filter((h) => h.beach && !dealIds.has(h.id)).sort((a, b) => b.score - a.score).slice(0, 10);
  return {
    weekend: { id: 'weekend', title: 'Weekend trips from London', reason: 'Nonstop flights under 3 hours, lowest return fare first', routes: short.map((c) => routeItem(data, c)) },
    rated: { id: 'rated', title: 'Stays guests rate highly', reason: 'Scored 9 or more, in cities with nonstop flights from London', stays: rated.map((h) => stayItem(h, weekend.checkin, weekend.checkout)) },
    fcb: { id: 'fcb', title: 'Free cancellation, breakfast included', reason: 'Cancel for free until 3 days before you arrive, with breakfast in the price', stays: fcb.map((h) => stayItem(h, weekend.checkin, weekend.checkout, 2, h.fcbNightly!)) },
    longhaul: { id: 'longhaul', title: 'Long-haul for less', reason: 'Return fares at least 12% below the typical price for the route', routes: longHaul },
    beach: { id: 'beach', title: 'By the beach', reason: 'Resorts and apartments with the beach a short walk away', stays: beach.map((h) => stayItem(h, weekend.checkin, weekend.checkout)) }
  };
}

export function recommendRows(data: HomeData, history: History | null, mode: Mode): Row[] {
  const fv = firstVisit(data);
  const rows: Row[] = [];
  const { cities, hotels } = data;
  if (mode === 'flights') {
    const s = lastOf(history, 'flights');
    const to = s && cities.find((c) => c.iata === s.to);
    if (s && to) {
      const others = cities.filter((c) => c.region === to.region && c.slug !== to.slug).sort((a, b) => a.returnFrom - b.returnFrom);
      rows.push({ id: 'region', title: `Other cities in ${to.region}`, reason: 'A similar flight time from London, lowest return fare first', routes: others.map((c) => routeItem(data, c)) });
      if (s.depart && s.return && to.hasHotels) {
        const stays = hotels.filter((h) => h.city === to.slug).sort((a, b) => b.score - a.score).slice(0, 10).map((h) => stayItem(h, s.depart!, s.return!, Math.max(1, s.adults)));
        rows.push({ id: 'stay-for-flight', title: `Stay in ${to.name} for your flight dates`, reason: `You searched flights to ${to.name} for ${shortRange(s.depart, s.return)}. These have rooms for those nights.`, stays });
      }
    }
    rows.push(fv.weekend, fv.longhaul, fv.rated);
  } else {
    const s = lastOf(history, 'hotels');
    const city = s && cities.find((c) => c.slug === s.place);
    if (s && city && s.checkin && s.checkout) {
      const stays = hotels.filter((h) => h.city === city.slug).sort((a, b) => b.score - a.score).slice(0, 10).map((h) => stayItem(h, s.checkin!, s.checkout!, Math.max(1, s.adults)));
      rows.push({ id: 'searched', title: `Because you searched ${city.name}`, reason: `More stays in ${city.name} for ${shortRange(s.checkin, s.checkout)}, highest guest score first`, stays });
    }
    const viewed = history?.views.find((v) => v.kind === 'hotel');
    const vh = viewed && hotels.find((h) => h.id === viewed.id);
    if (vh) {
      const floor = Math.floor(vh.score * 2) / 2;
      const similar = hotels.filter((h) => h.id !== vh.id && h.city === vh.city && h.band === vh.band && h.score >= floor).sort((a, b) => b.score - a.score);
      rows.push({ id: 'similar', title: `Similar to ${vh.name}`, reason: `Same city and price band, rated ${floor.toFixed(1)} or more`, stays: similar.map((h) => stayItem(h, data.weekend.checkin, data.weekend.checkout)) });
    }
    rows.push(fv.rated, fv.fcb, fv.beach);
  }
  return rows.filter((r) => (r.routes?.length ?? r.stays?.length ?? 0) >= 3).slice(0, 3);
}

/* trending (spec 0.5): the saving against the typical price, largest first */
export function trendingRoutes(data: HomeData): CityCard[] {
  return [...data.cities].sort((a, b) => (b.typicalReturn - b.returnFrom) / b.typicalReturn - (a.typicalReturn - a.returnFrom) / a.typicalReturn || a.rank - b.rank);
}
/* hotel cities: the largest lower-rate saving in the city first, then the catalogue's order */
export function trendingStayCities(data: HomeData): CityCard[] {
  const best = (slug: string) => Math.max(0, ...data.stayDeals.filter((s) => data.hotels.find((h) => h.id === s.hotelId)?.city === slug).map((s) => s.saving / s.usual));
  return data.cities.filter((c) => c.hasHotels).sort((a, b) => best(b.slug) - best(a.slug) || a.rank - b.rank);
}

/* the hotel photo pool repeats files across hotels. Page-wide map (critic, round 3, second pass: two different hotels
   showed the same room): hotels in homepage order (stay deals, then the first-visit rows, then the rest) each claim
   the first of their own photos no other hotel has claimed. Within one row each card still takes a photo no earlier
   card in the row has used. */
const OFF_LEAD = /bath|shower|breakfast|restaurant|dining|table|bar|caf[eé]|food|meal/i;
const photoMaps = new WeakMap<HomeData, Map<string, { photo: string; alt: string }>>();
export function hotelPhotoMap(data: HomeData) {
  const hit = photoMaps.get(data);
  if (hit) return hit;
  const fv = firstVisit(data);
  const order: HotelCard[] = [];
  const seen = new Set<string>();
  const add = (h?: HotelCard) => { if (h && !seen.has(h.id)) { seen.add(h.id); order.push(h); } };
  /* what the page shows first claims first: the Recommended row, the 8 stay deals, the weekend row, then the rest */
  fv.rated.stays?.slice(0, 8).forEach((it) => add(it.hotel));
  data.stayDeals.slice(0, 8).forEach((s) => add(data.hotels.find((h) => h.id === s.hotelId)));
  weekendStays(data, null).forEach(add);
  [fv.fcb, fv.beach].forEach((r) => r.stays?.slice(0, 8).forEach((it) => add(it.hotel)));
  data.stayDeals.forEach((s) => add(data.hotels.find((h) => h.id === s.hotelId)));
  [...data.hotels].sort((a, b) => Number(b.showcase) - Number(a.showcase) || b.score - a.score).forEach(add);
  const claimed = new Set<string>();
  const map = new Map<string, { photo: string; alt: string }>();
  for (const h of order) {
    const all = h.photos.length ? h.photos : [{ photo: h.photo, alt: h.alt }];
    /* cleanup round critic: a card leads with the room, the building or the view; bathroom and food shots only when nothing else is free */
    const own = [...all.filter((x) => !OFF_LEAD.test(x.alt)), ...all.filter((x) => OFF_LEAD.test(x.alt))];
    const p = own.find((x) => !claimed.has(x.photo)) ?? own[0];
    claimed.add(p.photo);
    map.set(h.id, p);
  }
  photoMaps.set(data, map);
  return map;
}
export function photoPicker(data?: HomeData) {
  const used = new Set<string>();
  const map = data ? hotelPhotoMap(data) : null;
  return (h: HotelCard): { photo: string; alt: string } => {
    const mine = map?.get(h.id);
    const p = (mine && !used.has(mine.photo) ? mine : null) ?? h.photos.find((x) => !used.has(x.photo)) ?? { photo: h.photo, alt: h.alt };
    used.add(p.photo);
    return p;
  };
}

/* hotel ids the Recommended rows show, so "Stays for this weekend" can leave them out */
export function recommendedHotelIds(data: HomeData, history: History | null): Set<string> {
  return new Set(recommendRows(data, history, 'hotels').flatMap((r) => r.stays?.map((s) => s.hotel.id) ?? []));
}

/* city photos, flight mode (critic, round 3, second pass: the same city photo came round in two sections). Each city
   has two photos. Sections claim them in a fixed order: the trending windows keep the first photo (the owned window
   look), then the first-visit Recommended row, the banner, the 8 deal cards and the region windows each take the
   city's photo that is still free. */
type Ph = { photo: string; alt: string };
export type CityPhotoPlan = { rec: Map<string, Ph>; banner: Map<string, Ph>; deal: Map<string, Ph>; region: Map<string, Ph>; regionCost: (slugs: string[]) => number };
const plans = new WeakMap<HomeData, CityPhotoPlan>();
export function cityPhotoPlan(data: HomeData, six: string[], bannerSlugs: string[]): CityPhotoPlan {
  const hit = plans.get(data);
  if (hit) return hit;
  const used = new Set<string>();
  const one = (c: CityCard): Ph => ({ photo: c.photo, alt: c.alt });
  const two = (c: CityCard): Ph => ({ photo: c.photo2, alt: c.alt2 });
  const take = (c: CityCard, prefer: 1 | 2): Ph => {
    const a = prefer === 1 ? one(c) : two(c), b = prefer === 1 ? two(c) : one(c);
    const p = !used.has(a.photo) ? a : !used.has(b.photo) ? b : a;
    used.add(p.photo);
    return p;
  };
  const city = (slug: string) => data.cities.find((c) => c.slug === slug);
  six.forEach((slug) => { const c = city(slug); if (c) used.add(c.photo); });
  const rec = new Map<string, Ph>(), banner = new Map<string, Ph>(), deal = new Map<string, Ph>(), region = new Map<string, Ph>();
  (firstVisit(data).weekend.routes ?? []).slice(0, 8).forEach((r) => rec.set(r.city.slug, take(r.city, 2)));
  bannerSlugs.forEach((slug) => { const c = city(slug); if (c) banner.set(slug, take(c, 1)); });
  data.fareDeals.slice(0, 8).forEach((f) => { const c = city(f.slug); if (c) deal.set(f.slug, take(c, 2)); });
  const frozen = new Set(used);
  const regionCost = (slugs: string[]) => slugs.filter((slug) => { const c = city(slug); return !!c && frozen.has(c.photo) && frozen.has(c.photo2); }).length;
  data.cities.forEach((c) => { const p = !frozen.has(c.photo2) ? two(c) : !frozen.has(c.photo) ? one(c) : two(c); region.set(c.slug, p); });
  const plan = { rec, banner, deal, region, regionCost };
  plans.set(data, plan);
  return plan;
}

/* the cities the first-visit Recommended row shows (8) */
export const firstVisitRouteSlugs = (data: HomeData): string[] => (firstVisit(data).weekend.routes ?? []).slice(0, 8).map((r) => r.city.slug);

/* "Stays for this weekend": leaves out hotels the Recommended rows and the first 8 stay deals already show */
export function weekendStays(data: HomeData, history: History | null): HotelCard[] {
  const shown = recommendedHotelIds(data, history);
  data.stayDeals.slice(0, 8).forEach((s) => shown.add(s.hotelId));
  return [...data.hotels].filter((h) => !shown.has(h.id)).sort((a, b) => Number(b.showcase) - Number(a.showcase) || (b.score / Math.sqrt(b.nightly)) - (a.score / Math.sqrt(a.nightly))).slice(0, 8);
}
