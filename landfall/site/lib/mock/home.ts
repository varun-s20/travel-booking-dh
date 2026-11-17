/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): home data
   Round 3, Developer A (round3-spec.md, Part A). Computes everything the
   homepage shows below the hero from the shared simulated backend: deal
   banners and cards, the first-visit "Recommended for you" list, trending
   routes and stays, browse, popular searches and the footer's popular
   links, for both modes (Flights and Hotels). Pure and server-safe; the
   page computes it once per request and hands it to the client parts.
   Sources, read defensively so the bigger catalogue flows in by itself
   once Developer B wires it into lib/mock/ and lib/data/:
   - HOTELS (lib/mock/hotels.ts): every hotel there is used. Score, review
     count, property type and a usual rate are read from the hotel when it
     has them (score | rating, reviews | reviewCount, type | propertyType,
     usual | usualNightly | typicalNightly); until then the eight existing
     hotels take their figures from content/mock-catalogue.md (HOTEL_FACTS).
   - DESTINATIONS (lib/data/destinations.ts): "Return from" per city wins
     where it lists the city; the catalogue's 24 cities fill the rest.
   - GEO (lib/mock/geo.ts): a flight link is made only to airports the mock
     search knows, so every link returns results.
   City figures (region, flight time, return from, typical return, who
   flies) are content/mock-catalogue.md section 1, word for word. "Usual"
   is always the catalogue's typical price for the same route or hotel
   over the last 30 days; nothing here invents one for a flight.
   Deals: content/mock-catalogue.md section 5, word for word. Fares count
   as a deal only at 12% or more below the route's typical return; hotels
   only through the 18 lower rates in LOWER_RATES (weekend, weeknight,
   long stay, next month), each priced on the same room and plan for the
   same nights, so a deal never compares against a price nobody could
   book. The eight original hotels carry no lower rate. Developer B's data
   has no lower-rate field, so the rates are applied here. Demo data.
   ===================================================================== */
import manifest from '@/lib/images.manifest.json';
import { HOTELS, LOWER_RATES, type RateKind } from '@/lib/mock/hotels';
import { GEO } from '@/lib/mock/geo';
import { CITIES } from '@/lib/data/places';
import * as destinationData from '@/lib/data/destinations';
import * as hotelPhotoPool from '@/lib/mock/hotel-photos';
import { AIRLINES } from '@/lib/mock/flights';

export type Mode = 'flights' | 'hotels';
export type Region4 = 'Europe' | 'Americas' | 'Asia and Pacific' | 'Africa and Middle East';
export const REGIONS4: Region4[] = ['Europe', 'Americas', 'Asia and Pacific', 'Africa and Middle East'];

const M = manifest as unknown as Record<string, { fallback: unknown } | undefined>;
const has = (name?: string) => !!name && !!M[name]?.fallback;

/* ---------- the catalogue's 24 cities (section 1) ---------- */
type Row = [name: string, code: string, slug: string, country: string, region6: string, minutes: number, stops: number, fare: number, usual: number, nonstop: string, oneStop: string];
const R: Row[] = [
  ['Lisbon', 'LIS', 'lisbon', 'Portugal', 'Southern Europe', 165, 0, 412, 486, 'Kittiwake Air, Tern Atlantic, Larkspur Airways', 'Petrel Air via MAD, Wren Air via BCN'],
  ['Barcelona', 'BCN', 'barcelona', 'Spain', 'Southern Europe', 135, 0, 296, 318, 'Wren Air, Kittiwake Air, Larkspur Airways', 'Petrel Air via MAD'],
  ['Rome', 'FCO', 'rome', 'Italy', 'Southern Europe', 155, 0, 389, 458, 'Tern Atlantic, Kittiwake Air, Larkspur Airways', 'Wren Air via BCN, Avocet Airways via AMS'],
  ['Athens', 'ATH', 'athens', 'Greece', 'Southern Europe', 220, 0, 338, 418, 'Larkspur Airways, Kittiwake Air', 'Wren Air via BCN, Avocet Airways via AMS'],
  ['Paris', 'CDG', 'paris', 'France', 'Northern and Western Europe', 80, 0, 218, 276, 'Kittiwake Air, Larkspur Airways', ''],
  ['Amsterdam', 'AMS', 'amsterdam', 'Netherlands', 'Northern and Western Europe', 75, 0, 204, 221, 'Avocet Airways, Kittiwake Air, Larkspur Airways', ''],
  ['Copenhagen', 'CPH', 'copenhagen', 'Denmark', 'Northern and Western Europe', 115, 0, 236, 252, 'Larkspur Airways, Kittiwake Air', 'Avocet Airways via AMS'],
  ['Reykjavik', 'KEF', 'reykjavik', 'Iceland', 'Northern and Western Europe', 185, 0, 312, 338, 'Larkspur Airways, Kittiwake Air', ''],
  ['New York', 'JFK', 'new-york', 'United States', 'North America', 490, 0, 684, 812, 'Gannet Air, Kittiwake Air', 'Tern Atlantic via LIS, Avocet Airways via AMS'],
  ['Toronto', 'YYZ', 'toronto', 'Canada', 'North America', 480, 0, 702, 748, 'Kittiwake Air', 'Gannet Air via JFK, Avocet Airways via AMS'],
  ['Los Angeles', 'LAX', 'los-angeles', 'United States', 'North America', 670, 0, 798, 862, 'Kittiwake Air', 'Gannet Air via JFK, Avocet Airways via AMS'],
  ['Miami', 'MIA', 'miami', 'United States', 'North America', 595, 0, 756, 812, 'Kittiwake Air', 'Gannet Air via JFK, Petrel Air via MAD'],
  ['Mexico City', 'MEX', 'mexico-city', 'Mexico', 'Latin America', 710, 0, 1046, 1124, 'Vireo Air, Kittiwake Air', 'Petrel Air via MAD, Gannet Air via JFK'],
  ['Cancún', 'CUN', 'cancun', 'Mexico', 'Latin America', 630, 0, 924, 986, 'Vireo Air', 'Petrel Air via MAD, Gannet Air via JFK, Tern Atlantic via LIS'],
  ['Rio de Janeiro', 'GIG', 'rio-de-janeiro', 'Brazil', 'Latin America', 705, 1, 1094, 1168, '', 'Tern Atlantic via LIS, Petrel Air via MAD, Vireo Air via MEX'],
  ['Buenos Aires', 'EZE', 'buenos-aires', 'Argentina', 'Latin America', 830, 1, 1186, 1262, '', 'Petrel Air via MAD, Tern Atlantic via LIS, Vireo Air via MEX'],
  ['Tokyo', 'HND', 'tokyo', 'Japan', 'Asia and Pacific', 845, 0, 1212, 1428, 'Kittiwake Air', 'Houbara Air via DXB, Tailorbird Air via SIN, Avocet Airways via AMS'],
  ['Singapore', 'SIN', 'singapore', 'Singapore', 'Asia and Pacific', 790, 0, 984, 1164, 'Tailorbird Air, Kittiwake Air, Currawong Air', 'Houbara Air via DXB'],
  ['Sydney', 'SYD', 'sydney', 'Australia', 'Asia and Pacific', 1350, 1, 1486, 1598, '', 'Currawong Air via SIN, Tailorbird Air via SIN, Houbara Air via DXB'],
  ['Bangkok', 'BKK', 'bangkok', 'Thailand', 'Asia and Pacific', 700, 0, 868, 1032, 'Kittiwake Air', 'Houbara Air via DXB, Tailorbird Air via SIN, Avocet Airways via AMS'],
  ['Cape Town', 'CPT', 'cape-town', 'South Africa', 'Africa and Middle East', 705, 0, 1138, 1326, 'Lourie Air, Kittiwake Air', 'Houbara Air via DXB, Avocet Airways via AMS'],
  ['Marrakech', 'RAK', 'marrakech', 'Morocco', 'Africa and Middle East', 220, 0, 274, 346, 'Larkspur Airways, Kittiwake Air', 'Wren Air via BCN, Petrel Air via MAD'],
  ['Dubai', 'DXB', 'dubai', 'United Arab Emirates', 'Africa and Middle East', 415, 0, 612, 664, 'Houbara Air, Kittiwake Air', ''],
  ['Nairobi', 'NBO', 'nairobi', 'Kenya', 'Africa and Middle East', 515, 0, 842, 918, 'Kittiwake Air', 'Houbara Air via DXB, Avocet Airways via AMS']
];
const REGION4: Record<string, Region4> = {
  'Southern Europe': 'Europe', 'Northern and Western Europe': 'Europe', 'North America': 'Americas', 'Latin America': 'Americas',
  'Asia and Pacific': 'Asia and Pacific', 'Africa and Middle East': 'Africa and Middle East'
};

/* Landfall's own water photos per city (public/images/credits.md), the first one that exists is the lead.
   Cities with no photo yet stay off the photo surfaces (banners, rails, tiles) and appear in the text lists. */
const CITY_PHOTOS: Record<string, { name: string; alt: string }[]> = {
  LIS: [{ name: 'destinations/lisbon-tagus-golden', alt: "Lisbon's hillside of pale houses and red roofs falling to the wide Tagus in late golden light" }, { name: 'home/lisbon-cais-sodre', alt: 'The Tagus at Cais do Sodre at dusk, the 25 de Abril bridge far off and people on the quay' }],
  FCO: [{ name: 'destinations/rome-tiber-bridge', alt: 'A lit stone bridge with statues over the Tiber at dusk, its lamps reflected in the water' }],
  JFK: [{ name: 'destinations/new-york-brooklyn-night', alt: 'Brooklyn Bridge and the lit towers of Lower Manhattan across the East River at night' }, { name: 'hero/new-york-harbour', alt: "Lower Manhattan's skyline seen from the harbour on a clear day" }],
  MEX: [{ name: 'destinations/mexico-city-xochimilco', alt: 'A painted trajinera boat moored on a Xochimilco canal, trees reflected in the still water' }],
  HND: [{ name: 'destinations/tokyo-bridge-night', alt: 'A lit arched bridge over a Tokyo river at night, office towers behind it' }],
  CPT: [{ name: 'destinations/cape-town-camps-bay', alt: "Camps Bay's white beach and houses under the Twelve Apostles at sunset" }, { name: 'hero/cape-town-waterfront', alt: "Table Mountain above Cape Town's waterfront, seen across the harbour" }],
  BCN: [{ name: 'home/barcelona-sea', alt: 'The beach and promenade at Barceloneta, the city and two towers along the sea behind' }],
  CDG: [{ name: 'home/paris-pont-neuf', alt: 'The Pont Neuf over the Seine in Paris, stone houses lit by late sun behind it' }],
  AMS: [{ name: 'home/amsterdam-canal', alt: 'A row of tall canal houses in Amsterdam, a red boat moored on the canal below' }],
  SIN: [{ name: 'home/singapore-bay', alt: 'The Singapore skyline across Marina Bay at dusk, towers mirrored in the still water' }],
  SYD: [{ name: 'home/sydney-harbour', alt: 'The Opera House and the Harbour Bridge across Sydney Harbour on a clear day' }],
  ATH: [{ name: 'home/athens-mikrolimano', alt: 'White yachts moored in the Mikrolimano marina at Piraeus, seen from above' }],
  MIA: [{ name: 'home/miami-beach', alt: 'The Miami skyline across choppy water under a dark sky' }],
  BKK: [{ name: 'home/bangkok-river', alt: 'River boats on the Chao Phraya in Bangkok, the city towers behind' }],
  YYZ: [{ name: 'home/toronto-lake', alt: 'Toronto towers and autumn trees on the shore of Lake Ontario at sunrise' }],
  LAX: [{ name: 'home/los-angeles-pier', alt: 'The Santa Monica pier and its Ferris wheel over the beach at sunset, Los Angeles' }],
  CUN: [{ name: 'home/cancun-sea', alt: 'Turquoise Caribbean water over pale sand off CancÃºn, seen from above' }],
  GIG: [{ name: 'home/rio-sugarloaf', alt: 'Rio de Janeiro and Sugarloaf Mountain above the bay, seen from Corcovado' }],
  EZE: [{ name: 'home/buenos-aires-madero', alt: 'Towers at Puerto Madero in Buenos Aires mirrored in the dock at dusk' }],
  CPH: [{ name: 'home/copenhagen-nyhavn', alt: 'Old boats moored along the Nyhavn canal in Copenhagen, painted houses behind' }],
  KEF: [{ name: 'home/reykjavik-harpa', alt: 'Boats in Reykjavik harbour in front of the glass Harpa concert hall' }],
  DXB: [{ name: 'home/dubai-marina', alt: 'Towers of Dubai Marina over the water, boats moored below' }],
  RAK: [{ name: 'home/marrakech-riad-pool', alt: 'A long pool in the courtyard of a riad in Marrakech' }],
  NBO: [{ name: 'home/nairobi-park', alt: 'A giraffe on the grass of Nairobi National Park, the city towers on the horizon' }]
};

export type Photo = { name: string; alt: string };
export type HomeCity = {
  name: string; code: string; slug: string; country: string; region: Region4; minutes: number; stops: number;
  fare: number; usual: number; saving: number; airlines: string[]; nonstop: string[]; oneStop: string[];
  owner: string; photos: Photo[]; hotels: boolean; rate: number | null; hotelCount: number; flies: boolean;
};

/* ---------- hotels: figures from the hotel, else the catalogue's (section 3) ---------- */
const HOTEL_FACTS: Record<string, { score: number; reviews: number; type: string }> = {
  'casa-lanterna': { score: 9.1, reviews: 1286, type: 'Boutique hotel' },
  'cais-verde-hotel': { score: 8.4, reviews: 2412, type: 'Hotel' },
  'patio-quinze': { score: 8.9, reviews: 734, type: 'Boutique hotel' },
  'ladeira-rooms': { score: 8.2, reviews: 958, type: 'Guesthouse' },
  'ribeira-lofts': { score: 8.6, reviews: 1107, type: 'Aparthotel' },
  'albergo-tre-finestre': { score: 8.7, reviews: 1034, type: 'Hotel' },
  'the-halyard-hotel': { score: 8.9, reviews: 2318, type: 'Boutique hotel' },
  'hotel-kumo-asakusa': { score: 8.8, reviews: 1862, type: 'Hotel' }
};
/* Hotels with lower rates (catalogue section 5); the rate applies to every room and plan inside its window */
export type { RateKind } from '@/lib/mock/hotels';
const FARE_RULE = 0.12;   /* a fare is a deal at 12% or more below the route's typical return */
export const PROPERTY_TYPES = ['Hotel', 'Boutique hotel', 'Guesthouse', 'Apartment', 'Aparthotel', 'Resort'] as const;
export const TYPE_PLURAL: Record<string, string> = { Hotel: 'Hotels', 'Boutique hotel': 'Boutique hotels', Guesthouse: 'Guesthouses', Apartment: 'Apartments', Aparthotel: 'Aparthotels', Resort: 'Resorts' };

export type HomeHotel = {
  id: string; name: string; city: string; cityName: string; area: string; stars: number; type: string;
  score: number | null; reviews: number | null; nightly: number; usual: number | null; free: boolean; breakfast: boolean; photo: Photo | null;
  freeFrom: number | null; breakfastFrom: number | null; breakfastFree: number | null;
};
type AnyHotel = (typeof HOTELS)[number] & Record<string, unknown>;
const num = (...v: unknown[]) => { for (const x of v) if (typeof x === 'number' && Number.isFinite(x)) return x; return null; };
const str = (...v: unknown[]) => { for (const x of v) if (typeof x === 'string' && x) return x; return null; };

function homeHotel(h: AnyHotel): HomeHotel | null {
  const rooms = Array.isArray(h.rooms) ? h.rooms : [];
  const cents = rooms.length ? Math.min(...rooms.map((r) => r.nightly)) : num(h.nightly, h.from);
  if (!cents) return null;
  const nightly = Math.round(cents > 2000 ? cents / 100 : cents);
  const f = HOTEL_FACTS[h.id];
  /* every plan of every room, in whole dollars: the cheapest overall, with free cancellation, with breakfast */
  const plans = rooms.flatMap((r) => (r.plans && r.plans.length ? r.plans : [{ nightly: r.nightly, refundable: r.refundable, breakfast: r.breakfast }]))
    .map((p) => ({ ...p, usd: Math.round(p.nightly > 2000 ? p.nightly / 100 : p.nightly) }));
  const low = (list: typeof plans) => (list.length ? Math.min(...list.map((p) => p.usd)) : null);
  /* The place first (critic, round 3): the eight original hotels lead with their own photos; the catalogue's
     other hotels lead with their city's water photos (Part A's and Part B's city pool), not stand-in rooms */
  const city = CITIES.find((c) => c.id === h.city);
  const own = f ? (Array.isArray(h.photos) ? h.photos : []).find((p) => has(p.name)) : undefined;
  const code = R.find((r) => r[2] === h.city)?.[1] ?? '';
  const pool = (hotelPhotoPool as { CITY?: Record<string, { name: string; caption: string }[]> }).CITY?.[h.city] ?? [];
  const cityPics = [...(CITY_PHOTOS[code] || []).filter((p) => p.alt), ...pool.map((p) => ({ name: p.name, alt: `${city?.name ?? ''}, ${p.caption}` }))]
    .filter((p, i, a) => has(p.name) && a.findIndex((q) => q.name === p.name) === i);
  const hashId = [...h.id].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const pick = cityPics.length ? cityPics[hashId % cityPics.length] : null;
  const ph = own ? { name: own.name, caption: own.caption } : null;
  return {
    id: h.id, name: h.name, city: h.city, cityName: city?.name ?? h.city, area: h.area, stars: h.stars,
    type: str(h.type, h.propertyType, f?.type) ?? 'Hotel',
    score: num(h.score, h.rating, h.reviewScore, f?.score), reviews: num(h.reviews, h.reviewCount, f?.reviews),
    nightly, usual: null,
    free: plans.some((p) => p.refundable), breakfast: plans.some((p) => p.breakfast),
    freeFrom: low(plans.filter((p) => p.refundable)), breakfastFrom: low(plans.filter((p) => p.breakfast)), breakfastFree: low(plans.filter((p) => p.breakfast && p.refundable)),
    photo: ph ? { name: ph.name, alt: `${h.name}, ${ph.caption}` } : pick
  };
}
export const HOME_HOTELS: HomeHotel[] = (HOTELS as AnyHotel[]).map(homeHotel).filter((h): h is HomeHotel => !!h);

/* ---------- cities, merged ---------- */
const destList: { code: string; from: string }[] = Array.isArray((destinationData as Record<string, unknown>).DESTINATIONS) ? (destinationData.DESTINATIONS as { code: string; from: string }[]) : [];
const dollarsOf = (s: string) => Number(String(s).replace(/[^0-9.]/g, '')) || 0;

export const HOME_CITIES: HomeCity[] = R.map(([name, code, slug, country, region6, minutes, stops, fare, usual, nonstop, oneStop]) => {
  const d = destList.find((x) => x.code === code);
  const f = d ? dollarsOf(d.from) || fare : fare;
  const ns = nonstop ? nonstop.split(', ') : [];
  const os = oneStop ? oneStop.split(', ') : [];
  const inCity = HOME_HOTELS.filter((h) => h.city === slug);
  const owner = code === 'LIS' ? 'Petrel Air' : (ns[0] || os[0]?.split(' via ')[0] || '');
  return {
    name, code, slug, country, region: REGION4[region6], minutes, stops, fare: f, usual, saving: Math.max(0, usual - f),
    airlines: [...ns, ...os.map((s) => s.split(' via ')[0])], nonstop: ns, oneStop: os, owner,
    photos: (CITY_PHOTOS[code] || []).filter((p) => has(p.name) && p.alt),
    hotels: inCity.length > 0 && CITIES.some((c) => c.id === slug), rate: inCity.length ? Math.min(...inCity.map((h) => h.nightly)) : null,
    hotelCount: inCity.length, flies: !!GEO[code]
  };
});
export const cityByCode = (code: string) => HOME_CITIES.find((c) => c.code === code);
export const cityBySlug = (slug: string) => HOME_CITIES.find((c) => c.slug === slug);

/* ---------- dates: computed from today, so nothing goes stale ---------- */
function isoOf(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function plusDays(d: Date, n: number) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
export function dealDates(now = new Date()) {
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let dep = plusDays(base, 10);
  while (dep.getDay() !== 2) dep = plusDays(dep, 1);           /* the first Tuesday at least 10 days out */
  let fri = plusDays(base, 7);
  while (fri.getDay() !== 5) fri = plusDays(fri, 1);           /* "next weekend": the Friday at least a week out */
  return {
    depart: isoOf(dep), ret: isoOf(plusDays(dep, 7)), checkin: isoOf(dep), checkout: isoOf(plusDays(dep, 4)),
    alt1: isoOf(plusDays(dep, 14)), alt1r: isoOf(plusDays(dep, 21)), alt2: isoOf(plusDays(dep, 28)), alt2r: isoOf(plusDays(dep, 35)),
    wkFri: isoOf(fri), wkSun: isoOf(plusDays(fri, 2)),
    ...rateDates(base)
  };
}
/* Lower-rate windows (catalogue section 5): this weekend (the coming Friday and Saturday nights), weeknights
   (the coming Sunday to Thursday, within 30 days), a long stay (4 nights within 60 days), and next month */
function rateDates(base: Date) {
  let fri = base; while (fri.getDay() !== 5) fri = plusDays(fri, 1);
  let sun = plusDays(base, 1); while (sun.getDay() !== 0) sun = plusDays(sun, 1);
  let end = plusDays(base, 30); while (end.getDay() > 4) end = plusDays(end, -1);
  const m1 = new Date(base.getFullYear(), base.getMonth() + 1, 1);
  return {
    weekendIn: isoOf(fri), weekendOut: isoOf(plusDays(fri, 2)), weekIn: isoOf(sun), weekOut: isoOf(plusDays(sun, 4)), weekEnd: isoOf(end),
    monthIn: isoOf(m1), monthOut: isoOf(plusDays(m1, 4)), monthName: MONTH[m1.getMonth()]
  };
}
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export type DealDates = ReturnType<typeof dealDates>;

export const flightHref = (to: string, depart?: string, ret?: string, from = 'LHR') =>
  depart ? `/flights?from=${from}&to=${to}&depart=${depart}${ret ? `&return=${ret}` : ''}&adults=1&children=0&infants=0&cabin=economy` : `/flights?from=${from}&to=${to}`;
export const hotelsHref = (slug: string, checkin?: string, checkout?: string, extra = '') =>
  checkin ? `/hotels?place=${slug}&checkin=${checkin}&checkout=${checkout}&adults=2&children=0&rooms=1${extra}` : `/hotels?place=${slug}${extra}`;
export const hotelHref = (id: string, checkin: string, checkout: string) => `/hotels/${id}?checkin=${checkin}&checkout=${checkout}&adults=2&children=0&rooms=1`;

/* the results page's airline filter (Part B: ?air=KT) */
const airQ = (name: string) => { const code = Object.keys(AIRLINES).find((k) => AIRLINES[k].name === name); return code ? `&air=${code}` : ''; };

/* ---------- what the homepage shows ---------- */
export type FlightCard = { code: string; city: string; photo: Photo; depart: string; ret: string; fare: number; saving: number; minutes: number; stops: number; owner: string; region: Region4; weekend: boolean; href: string };
export type HotelCard = HomeHotel & { checkin: string; checkout: string; nights: number; total: number; saving: number; href: string;
  /* deal cards only (catalogue section 5, deal card lines) */
  deal?: { kind: RateKind; tag: string; usualNightly: number; reason: string } };

export function homeData(now = new Date()) {
  const dd = dealDates(now);
  const photoCities = HOME_CITIES.filter((c) => c.flies && c.photos.length);
  const flightCard = (c: HomeCity, dep = dd.depart, ret = dd.ret, photoIdx = 0): FlightCard => ({
    code: c.code, city: c.name, photo: c.photos[Math.min(photoIdx, c.photos.length - 1)], depart: dep, ret, fare: c.fare, saving: fareDeal(c) ? c.saving : 0,
    minutes: c.minutes, stops: c.stops, owner: c.owner, region: c.region, weekend: c.minutes <= 240, href: flightHref(c.code, dep, ret)
  });
  const hotelCard = (h: HomeHotel, nights = 4): HotelCard => ({
    ...h, checkin: dd.checkin, checkout: nights === 4 ? dd.checkout : isoOf(plusDays(new Date(dd.checkin + 'T00:00'), nights)), nights,
    total: h.nightly * nights, saving: h.usual ? (h.usual - h.nightly) * nights : 0, href: hotelHref(h.id, dd.checkin, dd.checkout)
  });

  /* Deals, flights: only routes whose lowest return is 12% or more below the typical return, biggest share first */
  /* each deal on its own week (Tuesdays, so the weekday price holds), 7 nights */
  const WEEKS: [string, string][] = [[dd.depart, dd.ret], [isoOf(plusDays(new Date(dd.depart + 'T00:00'), 7)), isoOf(plusDays(new Date(dd.depart + 'T00:00'), 14))], [dd.alt1, dd.alt1r], [dd.alt2, dd.alt2r]];
  const flightDeals = photoCities.filter(fareDeal).sort((a, b) => b.saving / b.usual - a.saving / a.usual).map((c, i) => flightCard(c, WEEKS[i % 4][0], WEEKS[i % 4][1]));
  /* Banners: Lisbon large (the concept's home city) and the biggest long-haul saving small */
  const lis = cityByCode('LIS');
  const flightBanners = {
    large: lis && lis.photos.length ? flightCard(lis, dd.depart, dd.ret, lis.photos.length - 1) : flightDeals[0],
    small: flightDeals.find((d) => d.code !== 'LIS' && d.code === 'CPT') || flightDeals.find((d) => d.code !== 'LIS')!
  };
  const smallCity = cityByCode(flightBanners.small.code);
  if (smallCity && smallCity.photos.length > 1) flightBanners.small = flightCard(smallCity, dd.depart, dd.ret, 1);

  /* Deals, hotels: the catalogue's 18 lower rates, each on its own window; the usual price is the same room
     on the same plan for the same nights. Biggest share first, then no city twice in a row. */
  const withPhoto = HOME_HOTELS.filter((h) => h.photo);
  const RANGE: Record<RateKind, [string, string]> = { weekend: [dd.weekendIn, dd.weekendOut], weeknight: [dd.weekIn, dd.weekOut], long: [dd.checkin, dd.checkout], month: [dd.monthIn, dd.monthOut] };
  const dealCard = (h: HomeHotel): HotelCard | null => {
    const r = LOWER_RATES[h.id];
    if (!r) return null;
    const [checkin, checkout] = RANGE[r.kind];
    const nights = Math.round((dt(checkout).getTime() - dt(checkin).getTime()) / 864e5);
    const price = Math.round(h.nightly * (1 - r.pct / 100));
    const tag = r.kind === 'weekend' ? 'Weekend rate' : r.kind === 'weeknight' ? 'Weeknight rate' : r.kind === 'long' ? 'Long-stay rate' : `${dd.monthName} rate`;
    const reason = r.kind === 'weekend' ? `Lower rate for Friday and Saturday nights, ${shortRange(checkin, checkout)}`
      : r.kind === 'weeknight' ? `Lower rate on Sunday to Thursday nights until ${shortDay(dd.weekEnd)}`
      : r.kind === 'long' ? 'Lower rate when you stay 4 nights or more' : `Lower rate on every night in ${dd.monthName}`;
    return { ...h, nightly: price, checkin, checkout, nights, total: price * nights, saving: (h.nightly - price) * nights,
      href: hotelHref(h.id, checkin, checkout), deal: { kind: r.kind, tag, usualNightly: h.nightly, reason } };
  };
  const ranked = withPhoto.map(dealCard).filter((h): h is HotelCard => !!h).sort((a, b) => b.saving / (b.total + b.saving) - a.saving / (a.total + a.saving));
  const hotelDeals: HotelCard[] = [];
  while (ranked.length) { const i = ranked.findIndex((h) => h.city !== hotelDeals[hotelDeals.length - 1]?.city); hotelDeals.push(ranked.splice(i < 0 ? 0 : i, 1)[0]); }
  /* Banners: Lisbon's weekend rate (banner line 1) and breakfast included in Tokyo (banner line 6) */
  const lisWeekend = hotelDeals.filter((h) => h.city === 'lisbon' && h.deal?.kind === 'weekend').sort((a, b) => a.nightly - b.nightly)[0] || null;
  const tokyoBreakfast = HOME_HOTELS.filter((h) => h.city === 'tokyo' && h.breakfastFrom);
  const hotelBanners = {
    lisbon: lisWeekend && { price: lisWeekend.nightly, saving: (lisWeekend.deal?.usualNightly ?? lisWeekend.nightly) - lisWeekend.nightly, checkin: dd.weekendIn, checkout: dd.weekendOut },
    tokyo: tokyoBreakfast.length ? { count: tokyoBreakfast.length, price: Math.min(...tokyoBreakfast.map((h) => h.breakfastFrom as number)), checkin: dd.checkin, checkout: dd.checkout } : null
  };

  /* Recommended, first visit: warm water cities for a winter trip, leaving out the banner cities and the first 4 deal cards */
  const avoidF = new Set([flightBanners.large.code, flightBanners.small.code, ...flightDeals.slice(0, 4).map((d) => d.code)]);
  const WARM = ['MEX', 'CPT', 'JFK', 'FCO', 'HND', 'LIS', 'SIN', 'SYD', 'BKK', 'MIA', 'CUN', 'RAK', 'BCN', 'ATH'];
  const warm = WARM.map(cityByCode).filter((c): c is HomeCity => !!c && c.flies && c.photos.length > 0);
  const recoFlights = [...warm.filter((c) => !avoidF.has(c.code)), ...warm.filter((c) => avoidF.has(c.code))]
    .map((c, i) => flightCard(c, i % 2 ? dd.alt1 : dd.alt2, i % 2 ? dd.alt1r : dd.alt2r, c.photos.length - 1)).slice(0, 8);
  const avoidH = new Set(hotelDeals.slice(0, 4).map((h) => h.id));
  const recoHotels = [...withPhoto.filter((h) => !avoidH.has(h.id)), ...withPhoto.filter((h) => avoidH.has(h.id))]
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 8).map((h) => hotelCard(h));

  /* Trending: 12 routes (cheapest per minute of flying is not a trend, so the catalogue's busiest first: short haul, then long haul) */
  const TREND = ['LIS', 'BCN', 'FCO', 'CDG', 'AMS', 'ATH', 'JFK', 'MIA', 'CPT', 'HND', 'MEX', 'SIN', 'BKK', 'SYD', 'RAK', 'DXB'];
  const trendRoutes = TREND.map(cityByCode).filter((c): c is HomeCity => !!c && c.flies && c.photos.length > 0).slice(0, 12)
    .map((c) => ({ code: c.code, city: c.name, minutes: c.minutes, stops: c.stops, airlines: c.airlines.length, fare: c.fare, photo: c.photos[0] || null, href: flightHref(c.code, dd.wkFri, dd.wkSun) }));
  const trendStays = [...HOME_HOTELS].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0)).slice(0, 12).map((h) => hotelCard(h));
  const topStayCities = [...new Set(trendStays.map((h) => h.city))].slice(0, 6).map((s) => ({ slug: s, name: cityBySlug(s)?.name ?? s }));

  /* Property types: count and lowest rate per type, the photo of a property of that type */
  const TYPE_PHOTO: Record<string, Photo> = {
    /* the photo shows the type itself (critic, round 3 A2, item 4): a hotel's front, a boutique courtyard, a riad, a kitchen, a loft */
    Hotel: { name: 'hotels/at-facade', alt: 'The front of Albergo Tre Finestre, a hotel in Rome' },
    'Boutique hotel': { name: 'hotels/cl-courtyard', alt: 'The tiled courtyard of Casa Lanterna, a boutique hotel in Lisbon' },
    Guesthouse: { name: 'home/marrakech-riad-pool', alt: 'A riad courtyard pool in Marrakech' },
    Apartment: { name: 'hotels/rl-kitchen', alt: 'A studio with its own kitchen at Ribeira Lofts in Lisbon' },
    Aparthotel: { name: 'hotels/rl-loft', alt: 'The living space of a loft at Ribeira Lofts, an aparthotel in Lisbon' },
    Resort: { name: 'home/barcelona-sea', alt: 'The beach at Barceloneta in Barcelona' }
  };
  const types = PROPERTY_TYPES.map((t) => {
    const list = HOME_HOTELS.filter((h) => h.type === t);
    const own = list.find((h) => h.photo)?.photo;
    const photo = TYPE_PHOTO[t] && has(TYPE_PHOTO[t].name) ? TYPE_PHOTO[t] : own || null;
    return { type: t, plural: TYPE_PLURAL[t], count: list.length, from: list.length ? Math.min(...list.map((h) => h.nightly)) : null, photo };
  }).filter((t) => t.count > 0 && t.photo);

  /* Popular searches and the footer's popular links */
  const popular = HOME_CITIES.filter((c) => c.flies).map((c) => ({
    code: c.code, slug: c.slug, city: c.name, country: c.country, fare: c.fare, hotels: c.hotels, rate: c.rate,
    routes: [
      ...c.nonstop.map((a) => ({ text: `${a}, nonstop${a === c.owner ? `, from ${usd(c.fare)} return` : ''}`, href: `${flightHref(c.code, dd.depart, dd.ret)}&stops=0${airQ(a)}` })),
      ...c.oneStop.map((a) => { const [n, via] = a.split(' via '); return { text: `${n}, 1 stop via ${via}${n === c.owner ? `, from ${usd(c.fare)} return` : ''}`, href: `${flightHref(c.code, dd.depart, dd.ret)}&stops=1${airQ(n)}` }; })
    ].slice(0, 5),
    stays: HOME_HOTELS.filter((h) => h.city === c.slug).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5)
      .map((h) => ({ text: `${h.name}, $${h.nightly} a night`, href: hotelHref(h.id, dd.checkin, dd.checkout) }))
  }));

  const FOOT_ROUTES = ['LIS', 'JFK', 'FCO', 'HND', 'CPT', 'MEX', 'BCN', 'ATH', 'CDG', 'AMS', 'DXB', 'SIN', 'MIA', 'YYZ', 'SYD', 'LAX'];
  const footFlights = FOOT_ROUTES.map(cityByCode).filter((c): c is HomeCity => !!c && c.flies).slice(0, 12).map((c) => ({ text: `London to ${c.name}`, href: flightHref(c.code) }));
  const FOOT_STAYS = ['lisbon', 'new-york', 'rome', 'tokyo', 'cape-town', 'mexico-city', 'paris', 'barcelona', 'amsterdam', 'singapore', 'sydney', 'marrakech'];
  const footHotels = FOOT_STAYS.filter((s) => HOME_HOTELS.some((h) => h.city === s) && CITIES.some((c) => c.id === s)).slice(0, 12).map((s) => ({ text: cityBySlug(s)?.name ?? s, href: hotelsHref(s) }));

  return {
    dates: dd, flightDeals: flightDeals.slice(0, 10), hotelDeals: hotelDeals.slice(0, 10), flightBanners, hotelBanners,
    recoFlights, recoHotels, trendRoutes, trendStays, topStayCities, types, popular, footFlights, footHotels,
    cities: HOME_CITIES, hotels: HOME_HOTELS.map((h) => hotelCard(h))
  };
}
export type HomeData = ReturnType<typeof homeData>;

/* ---------- formats ---------- */
const fareDeal = (c: HomeCity) => c.usual > 0 && c.saving / c.usual >= FARE_RULE;
export const shortDay = (s: string) => { const d = dt(s); return `${MON[d.getMonth()]} ${d.getDate()}`; };
export const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
export function hm(min: number) { const h = Math.floor(min / 60), m = min % 60; return m ? `${h}h ${String(m).padStart(2, '0')}m` : `${h}h`; }
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dt = (s: string) => new Date(s + 'T00:00');
export const dayLabel = (s: string) => { const d = dt(s); return `${DAY[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}`; };
export function shortRange(a: string, b: string) {
  const x = dt(a), y = dt(b);
  return x.getMonth() === y.getMonth() ? `${MON[x.getMonth()]} ${x.getDate()} to ${y.getDate()}` : `${MON[x.getMonth()]} ${x.getDate()} to ${MON[y.getMonth()]} ${y.getDate()}`;
}
export const stopsText = (n: number) => (n === 0 ? 'nonstop' : n === 1 ? '1 stop' : `${n} stops`);
