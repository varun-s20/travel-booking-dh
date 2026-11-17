/* =====================================================================
   travel-booking (working name Overwing, a placeholder): home page data
   Round 3, Part A (Developer A). Built on the server from whatever the
   simulated backend exports (lib/mock/catalogue.ts, flights.ts,
   hotels.ts), so the bigger catalogue shows up here on its own:
   - city cards for all 24 cities, with the airlines on each route;
   - hotel cards (light records the browser can rank for "Recommended
     for you" without loading the whole catalogue);
   - fare deals: the lowest return for real dates at least 12% under the
     route's typical return (catalogue section 5);
   - stay deals: the catalogue's lower rates (weekend, weeknight,
     long-stay, next month), priced from the hotel's cheapest plan;
   - trending: the saving against the typical price, largest first
     (spec 0.5); popularity: the catalogue's city order;
   - month lows for the cheapest-months chart (same price function as
     the results page).
   All of it is demo data.
   ===================================================================== */
import manifest from '@/lib/images.manifest.json';
import catalogue from '@/lib/data/catalogue.json';
import { CATALOGUE_CITIES, ROUTE_OPTIONS, REGIONS6, type Region6 } from '@/lib/mock/catalogue';
import { AIRLINES, generateOffers, lowestTotal, offerTotals } from '@/lib/mock/flights';
import { HOTELS, PROPERTY_TYPES, fromNightlyOf, type Hotel, type PropertyType } from '@/lib/mock/hotels';
import { DESTINATIONS } from '@/lib/data/destinations';
import { addIsoDays } from '@/lib/format';

export { REGIONS6 };
export type { Region6, PropertyType };

/* ---- photos: this design's own city photos (public/images/credits.md) ---- */
const CITY_PHOTOS: Record<string, { photo: string; alt: string }> = {
  barcelona: { photo: 'barcelona-gothic-walker', alt: 'A woman walking down a narrow street of tall stone houses with balconies' },
  athens: { photo: 'athens-acropolis-hill', alt: 'Athens spread below a steep wooded hill under a pale sky' },
  paris: { photo: 'paris-street-walkers', alt: 'People on a Paris street in low sun, the Eiffel Tower at the end' },
  amsterdam: { photo: 'amsterdam-bridge-bikes', alt: 'Bicycles leaning on a canal bridge under tall trees' },
  copenhagen: { photo: 'copenhagen-canal-houses', alt: 'Painted houses along the Nyhavn canal with boats moored in front' },
  reykjavik: { photo: 'reykjavik-rainbow-street', alt: 'People walking up a street painted in rainbow stripes' },
  toronto: { photo: 'toronto-flatiron-crossing', alt: 'People crossing a street in front of the red brick Flatiron building' },
  'los-angeles': { photo: 'los-angeles-palm-skater', alt: 'A skater stopping on a road lined with tall palm trees' },
  miami: { photo: 'miami-lifeguard-tower', alt: 'A pink and orange lifeguard tower on a white beach' },
  cancun: { photo: 'cancun-palm-beach', alt: 'Palm trees over a white beach and a turquoise sea' },
  'rio-de-janeiro': { photo: 'rio-beach-mountain', alt: 'A long beach below a twin-peaked green mountain' },
  'buenos-aires': { photo: 'buenos-aires-obelisk-avenue', alt: 'A wide avenue running straight to a white obelisk' },
  singapore: { photo: 'singapore-shophouses', alt: 'A row of brightly painted shophouses on a quiet street' },
  sydney: { photo: 'sydney-harbour-ferry', alt: 'A green and yellow ferry at the wharf below the Harbour Bridge' },
  bangkok: { photo: 'bangkok-flag-lane', alt: 'A narrow lane strung with paper flags and overhead wires' },
  marrakech: { photo: 'marrakech-medina-alley', alt: 'A figure walking through a stone arch into a quiet medina lane' },
  dubai: { photo: 'dubai-creek-abra', alt: 'A wooden boat moored on the creek below old wind towers' },
  nairobi: { photo: 'nairobi-skyline', alt: 'Office towers of central Nairobi in daylight' }
};
/* a second photo per city (critic, round 3 Part A, issue 1): no section shows the same file as the one before it */
const CITY_PHOTOS_2: Record<string, { photo: string; alt: string }> = {
  'lisbon': { photo: 'lisbon-rooftops-river', alt: 'Orange rooftops running down to the river under a pale sky' },
  'rome': { photo: 'rome-colosseum-street', alt: 'A street of cars and cafe umbrellas leading to the Colosseum' },
  'new-york': { photo: 'new-york-manhattan-bridge', alt: 'The Manhattan Bridge framed by brick buildings at the end of a cobbled street' },
  'mexico-city': { photo: 'mexico-city-bellas-artes', alt: 'The domed Palacio de Bellas Artes above a busy square' },
  'tokyo': { photo: 'tokyo-street-cyclist', alt: 'A cyclist on a quiet side street under overhead wires' },
  'cape-town': { photo: 'cape-town-table-mountain', alt: 'Cloud rolling over the flat top of Table Mountain at dusk' },
  'barcelona': { photo: 'barcelona-sagrada-familia', alt: 'The carved towers of the Sagrada Família against a blue sky' },
  'athens': { photo: 'athens-street-walkers', alt: 'A quiet street of pastel houses and orange trees' },
  'paris': { photo: 'paris-bridge-walkers', alt: 'Lamps and a gilded statue on the Pont Alexandre III' },
  'amsterdam': { photo: 'amsterdam-canal-gables', alt: 'Narrow gabled canal houses reflected in the water' },
  'copenhagen': { photo: 'copenhagen-arch-cyclist', alt: 'A cyclist passing through a brick archway onto a painted street' },
  'reykjavik': { photo: 'reykjavik-harbour-boat', alt: 'A red and white boat moored in the harbour below snowy hills' },
  'toronto': { photo: 'toronto-buildings-view', alt: 'The skyline and its tower seen across the lake at dusk' },
  'los-angeles': { photo: 'los-angeles-boat-sea', alt: 'A wide beach and a palm-lined shore on the Pacific coast' },
  'miami': { photo: 'miami-lifeguard-house', alt: 'A lilac lifeguard house on the beach' },
  'cancun': { photo: 'cancun-palm-shore', alt: 'Palms along a sandy beach beside a turquoise sea' },
  'rio-de-janeiro': { photo: 'rio-street-walkers', alt: 'People climbing the tiled Selarón steps' },
  'buenos-aires': { photo: 'buenos-aires-la-boca', alt: 'A brightly painted corner building in La Boca under a blue sky' },
  'singapore': { photo: 'singapore-supertrees', alt: 'The Supertrees of Gardens by the Bay with a walkway between them' },
  'sydney': { photo: 'sydney-opera-house', alt: 'The Opera House reflected in the harbour' },
  'bangkok': { photo: 'bangkok-temple-water', alt: 'The spire of Wat Arun lit by the setting sun over the river' },
  'marrakech': { photo: 'marrakech-shop-front', alt: 'A woman in a hat outside a stall hung with rugs in the souk' },
  'dubai': { photo: 'dubai-burj-al-arab', alt: 'The sail-shaped Burj Al Arab on the coast, seen from above' },
  'nairobi': { photo: 'nairobi-park-lioness', alt: 'Young lions resting in long grass in the national park' }
};
const TYPE_PHOTOS: Record<PropertyType, { photo: string; label: string; alt: string }> = {
  Hotel: { photo: 'type-hotel-balconies', label: 'Hotels', alt: 'A white hotel facade with rows of iron balconies' },
  'Boutique hotel': { photo: 'type-boutique-lounge', label: 'Boutique hotels', alt: 'A quiet lounge with tall windows and dark chairs' },
  Guesthouse: { photo: 'type-guesthouse-door', label: 'Guesthouses', alt: 'A cream terraced house with a red front door' },
  Apartment: { photo: 'type-apartment-living', label: 'Apartments', alt: 'A living room with a sofa, a window and a round pendant lamp' },
  Aparthotel: { photo: 'type-aparthotel-kitchen', label: 'Aparthotels', alt: 'A compact kitchen with a small fridge, a microwave and a sink' },
  Resort: { photo: 'type-resort-pool', label: 'Resorts', alt: 'Lounge chairs beside a pool under tall palm trees' }
};
const hasPhoto = (name: string | undefined) => !!name && !!(manifest as Record<string, unknown>)[name];

function cityPhoto(slug: string, iata: string): { photo: string; alt: string } | null {
  const own = DESTINATIONS.find((d) => d.code === iata);
  if (own && hasPhoto(own.image)) return { photo: own.image, alt: own.alt };
  const p = CITY_PHOTOS[slug];
  return p && hasPhoto(p.photo) ? p : null;
}

/* ---- types the browser receives ---- */
export type RouteAirline = { code: string; name: string; via: string | null };
export type CityCard = {
  slug: string; name: string; country: string; region: Region6; iata: string; blurb: string;
  flightTime: string; minutes: number; nonstop: boolean;
  returnFrom: number; typicalReturn: number; hasHotels: boolean;
  photo: string; alt: string; photo2: string; alt2: string; airlines: RouteAirline[];
  hotelCount: number; fromNightly: number | null; rank: number;
};
export type HotelCard = {
  id: string; name: string; city: string; cityName: string; type: PropertyType; stars: number; area: string; distanceKm: number;
  score: number; scoreWord: string; reviewCount: number; nightly: number; band: string; showcase: boolean;
  photo: string; alt: string; photos: { photo: string; alt: string }[]; beach: boolean; kitchen: boolean; fcbNightly: number | null;
};
export type FareDeal = {
  slug: string; depart: string; ret: string; price: number; usual: number; saving: number;
  airline: string; nonstop: boolean;
};
export type StayDealKind = 'weekend' | 'weeknight' | 'long' | 'nextmonth';
export type StayDeal = {
  kind: StayDealKind; hotelId: string; price: number; usual: number; saving: number;
  checkin: string; checkout: string; endDate?: string; month?: string;
};
export type MonthLow = { month: string; depart: string; total: number; avg: number };
export type TypeTile = { type: PropertyType; label: string; photo: string; alt: string; count: number; fromNightly: number };
export type HomeData = {
  today: string; weekend: { checkin: string; checkout: string };
  cities: CityCard[]; hotels: HotelCard[];
  fareDeals: FareDeal[]; stayDeals: StayDeal[];
  months: Record<string, MonthLow[]>; types: TypeTile[];
};

/* ---- helpers ---- */
function minutesOf(t: string): number {
  const m = t.match(/(\d+)h\s*(\d+)?m?/);
  return m ? Number(m[1]) * 60 + Number(m[2] || 0) : 0;
}
const dow = (iso: string) => new Date(`${iso}T12:00:00`).getDay();
function nextDow(from: string, day: number, minAhead = 0): string {
  let d = addIsoDays(from, minAhead);
  while (dow(d) !== day) d = addIsoDays(d, 1);
  return d;
}
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* the catalogue's hotels with lower rates (section 5); catalogue.json carries them once the parser does */
const LOWER_RATES: { hotel: string; kind: StayDealKind; pct: number }[] = [
  { hotel: 'hotel-sal-e-vela', kind: 'weekend', pct: 15 }, { hotel: 'sete-janelas-apartments', kind: 'long', pct: 12 },
  { hotel: 'palazzo-lucerna', kind: 'weeknight', pct: 18 }, { hotel: 'villa-merula', kind: 'nextmonth', pct: 10 },
  { hotel: 'maison-verriere', kind: 'weekend', pct: 14 }, { hotel: 'hotel-bleu-ardoise', kind: 'weeknight', pct: 12 },
  { hotel: 'mar-blava-resort', kind: 'long', pct: 20 }, { hotel: 'hotel-llum-del-born', kind: 'weekend', pct: 12 },
  { hotel: 'hotel-spiegelbeeld', kind: 'weeknight', pct: 16 }, { hotel: 'the-ninefold', kind: 'weekend', pct: 18 },
  { hotel: 'the-wendover-residences', kind: 'long', pct: 15 }, { hotel: 'hotel-ahuehuete', kind: 'weekend', pct: 20 },
  { hotel: 'hotel-kasumi-otemachi', kind: 'weekend', pct: 12 }, { hotel: 'shiokaze-resort-odaiba', kind: 'weeknight', pct: 15 },
  { hotel: 'hotel-laut-biru', kind: 'nextmonth', pct: 10 }, { hotel: 'the-quayline', kind: 'weeknight', pct: 12 },
  { hotel: 'the-kelpwater', kind: 'long', pct: 15 }, { hotel: 'resort-bustan-nakhla', kind: 'nextmonth', pct: 18 }
];
function lowerRates(): { hotel: string; kind: StayDealKind; pct: number }[] {
  const raw = (catalogue as unknown as { deals?: { hotel?: string; rate?: string; pct?: number }[] }).deals;
  const map: Record<string, StayDealKind> = { 'Weekend rate': 'weekend', 'Weeknight rate': 'weeknight', 'Long-stay rate': 'long', 'Next-month rate': 'nextmonth' };
  const parsed = (raw || []).filter((r) => r.hotel && r.rate && map[r.rate] && r.pct).map((r) => ({ hotel: r.hotel!, kind: map[r.rate!], pct: r.pct! }));
  return parsed.length ? parsed : LOWER_RATES;
}

function hotelCard(h: Hotel, cityName: string): HotelCard | null {
  const photo = h.photos.find((p) => hasPhoto(p.name));
  if (!photo) return null;
  const plans = h.rooms.flatMap((r) => r.plans);
  const fcb = plans.filter((p) => p.refundable && p.breakfast).map((p) => p.nightly);
  const all = [...h.amenities, ...h.cardAmenities].join(' | ').toLowerCase();
  return {
    id: h.id, name: h.name, city: h.city, cityName, type: h.type, stars: h.stars, area: h.area,
    distanceKm: h.distanceKm, score: h.score, scoreWord: h.scoreWord, reviewCount: h.reviewCount,
    nightly: fromNightlyOf(h), band: h.band, showcase: h.showcase,
    photo: photo.name, alt: `${h.name}, ${photo.caption}`,
    photos: h.photos.filter((p) => hasPhoto(p.name)).slice(0, 6).map((p) => ({ photo: p.name, alt: `${h.name}, ${p.caption}` })),
    beach: all.includes('beach'), kitchen: all.includes('kitchen') || h.type === 'Apartment' || h.type === 'Aparthotel',
    fcbNightly: fcb.length ? Math.min(...fcb) : null
  };
}

/* ---- the whole home page's data, once per day per server ---- */
let cached: { key: string; data: HomeData } | null = null;

export function homeData(): HomeData {
  const today = localToday();
  const key = `${today}:${HOTELS.length}:${CATALOGUE_CITIES.length}`;
  if (cached?.key === key) return cached.data;

  const friday = nextDow(today, 5, 2);
  const weekend = { checkin: friday, checkout: addIsoDays(friday, 2) };

  const cities: CityCard[] = CATALOGUE_CITIES.flatMap((c, i) => {
    const p = cityPhoto(c.slug, c.iata);
    if (!p) return [];
    const opts = ROUTE_OPTIONS[c.iata] || [];
    const stays = HOTELS.filter((h) => h.city === c.slug);
    return [{
      slug: c.slug, name: c.name, country: c.country, region: c.region, iata: c.iata, blurb: c.blurb,
      flightTime: c.flightTime.replace(/,.*$/, ''), minutes: minutesOf(c.flightTime), nonstop: opts.some((o) => !o.via),
      returnFrom: c.returnFrom, typicalReturn: c.typicalReturn, hasHotels: c.hasHotels && stays.length > 0,
      photo: p.photo, alt: p.alt,
      photo2: hasPhoto(CITY_PHOTOS_2[c.slug]?.photo) ? CITY_PHOTOS_2[c.slug].photo : p.photo, alt2: hasPhoto(CITY_PHOTOS_2[c.slug]?.photo) ? CITY_PHOTOS_2[c.slug].alt : p.alt,
      airlines: opts.map((o) => ({ code: o.code, name: AIRLINES[o.code]?.name ?? o.code, via: o.via })),
      hotelCount: stays.length, fromNightly: stays.length ? Math.min(...stays.map(fromNightlyOf)) : null, rank: i
    }];
  });
  const cityName = (slug: string) => cities.find((c) => c.slug === slug)?.name ?? slug;

  const hotels = HOTELS.map((h) => hotelCard(h, cityName(h.city))).filter((h): h is HotelCard => !!h);

  /* fare deals: the first Tuesday from two weeks out whose lowest return clears the 12% rule */
  const fareDeals: FareDeal[] = [];
  for (const c of cities) {
    for (let w = 0; w < 5; w++) {
      const depart = nextDow(today, 2, 14 + w * 7), ret = addIsoDays(depart, 7);
      /* the cheapest offer itself, so the airline and the stops on the card are the ones the results page lists first */
      const offers = generateOffers({ from: 'LHR', to: c.iata, depart, ret, adults: 1, children: 0, infants: 0, cabin: 'economy' }, 0);
      if (!offers.length) continue;
      const best = offers.reduce((a, b) => (offerTotals(b, 'light').total < offerTotals(a, 'light').total ? b : a));
      const price = offerTotals(best, 'light').total;
      if (price <= c.typicalReturn * 0.88) {
        fareDeals.push({ slug: c.slug, depart, ret, price, usual: c.typicalReturn, saving: c.typicalReturn - price, airline: AIRLINES[best.owner]?.name ?? '', nonstop: best.slices.every((x) => x.stops === 0) });
        break;
      }
    }
  }
  fareDeals.sort((a, b) => b.saving - a.saving);

  /* stay deals: the lower rate on the hotel's cheapest plan, for nights inside the rate's window */
  const [ty, tm] = today.split('-').map(Number);
  const nm = tm === 12 ? 1 : tm + 1, ny = tm === 12 ? ty + 1 : ty;
  const nextMonthStart = `${ny}-${String(nm).padStart(2, '0')}-05`;
  const lastThu = (() => { let d = addIsoDays(today, 30); while (dow(d) !== 4) d = addIsoDays(d, -1); return d; })();
  const stayDeals: StayDeal[] = lowerRates().flatMap((r) => {
    const h = hotels.find((x) => x.id === r.hotel);
    if (!h) return [];
    const usual = h.nightly, price = Math.round((usual * (100 - r.pct)) / 100 / 100) * 100;
    let checkin = weekend.checkin, checkout = weekend.checkout, endDate: string | undefined, month: string | undefined;
    if (r.kind === 'weeknight') { checkin = nextDow(today, 0, 2); checkout = addIsoDays(checkin, 4); endDate = lastThu; }
    if (r.kind === 'long') { checkin = nextDow(today, 1, 14); checkout = addIsoDays(checkin, 4); }
    if (r.kind === 'nextmonth') { checkin = nextMonthStart; checkout = addIsoDays(checkin, 3); month = MONTHS[nm - 1]; }
    return [{ kind: r.kind, hotelId: h.id, price, usual, saving: usual - price, checkin, checkout, endDate, month }];
  }).sort((a, b) => b.saving - a.saving);

  /* month lows for the chart: Lisbon (the first-visit route) and the trending routes */
  const months: Record<string, MonthLow[]> = {};
  const chartRoutes = [...new Set(['LIS', ...[...cities].sort((a, b) => (b.typicalReturn - b.returnFrom) - (a.typicalReturn - a.returnFrom)).slice(0, 10).map((c) => c.iata)])];
  /* from two days out, so the cheapest date is one a visitor can still book */
  for (const iata of chartRoutes) months[iata] = monthStats(iata, addIsoDays(today, 2));

  const types: TypeTile[] = PROPERTY_TYPES.map((t) => {
    const list = hotels.filter((h) => h.type === t);
    return { type: t, ...TYPE_PHOTOS[t], count: list.length, fromNightly: list.length ? Math.min(...list.map((h) => h.nightly)) : 0 };
  }).filter((t) => t.count > 0 && hasPhoto(t.photo));

  const data: HomeData = { today, weekend, cities, hotels, fareDeals, stayDeals, months, types };
  cached = { key, data };
  return data;
}

/* the cheapest-months chart (spec A9). The lowest fare in a month is the same in most months (a Tuesday outside the
   peaks always meets "Return from"), so the bars show each month's average lowest return over the days sampled, and the
   lowest date is kept for the link and the caption. Same price function as the results page (lowestTotal). */
function monthStats(iata: string, start: string): MonthLow[] {
  const out: MonthLow[] = [];
  const [y, m] = start.split('-').map(Number);
  for (let i = 0; i < 12; i++) {
    const yy = y + Math.floor((m - 1 + i) / 12), mm = ((m - 1 + i) % 12) + 1;
    const ym = `${yy}-${String(mm).padStart(2, '0')}`;
    let best = { depart: '', total: Infinity }, sum = 0, n = 0;
    for (let d = 1; d <= 28; d += 2) {
      const depart = `${ym}-${String(d).padStart(2, '0')}`;
      if (depart < start) continue;
      const t = lowestTotal({ from: 'LHR', to: iata, depart, ret: addIsoDays(depart, 7), adults: 1, children: 0, infants: 0, cabin: 'economy' });
      if (t === null) continue;
      sum += t; n++;
      if (t < best.total) best = { depart, total: t };
    }
    if (n) out.push({ month: ym, depart: best.depart, total: best.total, avg: Math.round(sum / n / 100) * 100 });
  }
  return out;
}
