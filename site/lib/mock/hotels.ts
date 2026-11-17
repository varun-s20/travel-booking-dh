/* =====================================================================
   travel-booking (working name Overwing, a placeholder): mock hotels
   The simulated Duffel Stays side: content/copy.md's eight fictional
   hotels with their areas, stars, prices, descriptions and amenities,
   Casa Lanterna's full detail (rooms, policies), positions for the map
   pins, and the search and pricing rules. Prices are for a night with
   taxes and fees included, as copy.md gives them. Photos are Unsplash
   stand-ins for Duffel's (never graded, public/images/credits.md).
   Rooms and policies for the seven other hotels are not in copy.md; they
   follow Casa Lanterna's pattern with plain room names (build/progress.md).
   ===================================================================== */
import { CITIES } from '@/lib/data/places';
import catalogue from '@/lib/data/catalogue.json';
import { HOTEL_PHOTO_POOL } from '@/lib/data/hotel-photos';
import { hash, rng } from '@/lib/mock/geo';
import { addIsoDays, fromIso, isoNights } from '@/lib/format';

export type PhotoCat = 'Rooms' | 'Inside' | 'Outside';
export type HotelPhoto = { name: string; cat: PhotoCat; caption: string };
/* Rate plans (catalogue section 3, "Rate plans"): the plan name is the label on the rate row */
export type RatePlanId = 'nr' | 'fc' | 'fcb' | 'nrb';
export type RatePlan = { id: RatePlanId; name: string; nightly: number; refundable: boolean; breakfast: boolean };
export const PLAN_NAMES: Record<RatePlanId, string> = { nr: 'Non-refundable', fc: 'Free cancellation', fcb: 'Free cancellation, breakfast included', nrb: 'Non-refundable, breakfast included' };
/* `nightly`, `refundable` and `breakfast` are the room's default plan (its first in `plans`), so older callers keep working */
type BaseRoom = { id: string; name: string; spec: string; beds: string; sleeps: number; view?: string; nightly: number; refundable: boolean; breakfast: boolean; photos: string[] };
export type Room = BaseRoom & { size?: string; amenities: string[]; plans: RatePlan[]; roomsLeft: number; hotel?: string };
export type PropertyType = 'Hotel' | 'Boutique hotel' | 'Guesthouse' | 'Apartment' | 'Aparthotel' | 'Resort';
export const PROPERTY_TYPES: PropertyType[] = ['Hotel', 'Boutique hotel', 'Guesthouse', 'Apartment', 'Aparthotel', 'Resort'];
export type Review = { name: string; country: string; trip: string; month: string; score: number; title: string; text: string };
export type Nearby = { name: string; minutes: number | null; mode: string };
type BaseHotel = {
  id: string; name: string; city: string; area: string; country: string; stars: number;
  lat: number; lon: number; card: string; about: string;
  cardAmenities: string[]; amenities: string[]; photos: HotelPhoto[]; rooms: BaseRoom[];
  checkIn: string; checkOut: string; address: string;
  policies: { title: string; body: string }[];
};
/* Every catalogue field (content/mock-catalogue.md, section 3). Demo data: invented hotels, scores and reviews. */
export type Hotel = Omit<BaseHotel, 'rooms'> & {
  rooms: Room[]; type: PropertyType; showcase: boolean; score: number; scoreWord: string; reviewCount: number;
  distanceKm: number; fromNightly: number; band: string; highlights: string[]; aboutParas: string[];
  categoryScores: { label: string; score: number }[] | null; reviews: Review[]; nearby: Nearby[];
  houseRules: { title: string; body: string }[]; centerPoint: string;
};

/* Amenity names to sprite icons (components/chrome/Sprite.tsx) */
export const AMENITY_ICON: Record<string, string> = {
  'Free wifi': 'wifi', Breakfast: 'cup', 'Breakfast available': 'cup', 'Roof terrace': 'sun', Gym: 'dumbbell', Bar: 'glass',
  Garden: 'leaf', 'Shared kitchen': 'pot', Kitchen: 'pot', 'Luggage storage': 'bag', 'Washing machine': 'wash',
  'Air conditioning': 'snow', 'Public bath': 'bath', Laundry: 'wash', 'Rooftop bar': 'glass', Elevator: 'lift',
  '24-hour front desk': 'clock', 'Non-smoking rooms': 'nosmoke', Courtyard: 'leaf', 'Daily housekeeping': 'bed',
  Hairdryer: 'dryer', 'Safe in room': 'lock'
};

const policiesFor = (refundable: boolean, extraBed: string) => [
  { title: 'Cancellation', body: refundable ? 'Free cancellation until 23:59 hotel time three days before check-in. After that, the booking can’t be refunded.' : 'This rate is non-refundable from the moment you book.' },
  { title: 'Payment', body: 'You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.' },
  { title: 'Children and extra beds', body: `Children of all ages are welcome. A cot is available on request, free of charge.${extraBed}` },
  { title: 'Pets', body: 'Pets aren’t allowed.' }
];

const p = (name: string, cat: PhotoCat, caption: string): HotelPhoto => ({ name, cat, caption });

const LEGACY: BaseHotel[] = [
  {
    id: 'casa-lanterna', name: 'Casa Lanterna', city: 'lisbon', area: 'Alfama', country: 'Portugal', stars: 4, lat: 38.7118, lon: -9.1302,
    card: 'A restored townhouse on a stepped lane below the castle, with a tiled courtyard and a roof terrace over the river.',
    about: 'A restored townhouse on a stepped lane below the castle, with 18 rooms over four floors. The upper rooms look across the rooftops of Alfama to the river. Breakfast is served in the tiled courtyard until 11:00, and guests can use the roof terrace until late. The Baixa and the riverfront are about ten minutes’ walk downhill, and the 28 tram stops at the end of the street.',
    cardAmenities: ['Free wifi', 'Breakfast', 'Roof terrace'],
    amenities: ['Free wifi', 'Breakfast available', 'Roof terrace', 'Air conditioning', 'Elevator', '24-hour front desk', 'Luggage storage', 'Non-smoking rooms', 'Courtyard', 'Daily housekeeping', 'Hairdryer', 'Safe in room'],
    photos: [
      p('casa-lanterna-courtyard', 'Inside', 'tiled courtyard'), p('casa-lanterna-courtyard-double', 'Rooms', 'Courtyard Double'),
      p('casa-lanterna-terrace', 'Outside', 'roof terrace'), p('casa-lanterna-lounge', 'Inside', 'lounge'),
      p('casa-lanterna-river-double', 'Rooms', 'River View Double'), p('casa-lanterna-lane', 'Outside', 'the lane outside'),
      p('casa-lanterna-terrace-suite', 'Rooms', 'Terrace Suite'), p('casa-lanterna-breakfast', 'Inside', 'breakfast'),
      p('casa-lanterna-stairs', 'Inside', 'stairs and hallway'), p('casa-lanterna-bathroom', 'Rooms', 'bathroom')
    ],
    rooms: [
      { id: 'courtyard-double', name: 'Courtyard Double', spec: '1 double bed, sleeps 2, courtyard view', beds: '1 double bed', sleeps: 2, view: 'courtyard view', nightly: 18600, refundable: true, breakfast: true, photos: ['casa-lanterna-courtyard-double', 'casa-lanterna-bathroom'] },
      { id: 'river-view-double', name: 'River View Double', spec: '1 king bed, sleeps 2, river view', beds: '1 king bed', sleeps: 2, view: 'river view', nightly: 23800, refundable: true, breakfast: true, photos: ['casa-lanterna-river-double', 'casa-lanterna-bathroom'] },
      { id: 'terrace-suite', name: 'Terrace Suite', spec: '1 king bed and a sofa bed, sleeps 3, private terrace', beds: '1 king bed and a sofa bed', sleeps: 3, view: 'private terrace', nightly: 34200, refundable: false, breakfast: true, photos: ['casa-lanterna-terrace-suite', 'casa-lanterna-terrace'] }
    ],
    checkIn: '15:00', checkOut: '11:00', address: 'Alfama, 1100 Lisbon, Portugal',
    policies: [
      { title: 'Cancellation', body: 'Free cancellation until 23:59 hotel time on Tue, Nov 17. After that, the booking can’t be refunded. The Terrace Suite rate is non-refundable from the moment you book.' },
      { title: 'Payment', body: 'You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.' },
      { title: 'Children and extra beds', body: 'Children of all ages are welcome. A cot is available on request, free of charge. The Terrace Suite has a sofa bed for a third guest.' },
      { title: 'Pets', body: 'Pets aren’t allowed.' },
      { title: 'Accessibility', body: 'An elevator serves all floors. The lane outside has steps, so ask the hotel about step-free arrival before you book.' }
    ]
  },
  {
    id: 'cais-verde-hotel', name: 'Cais Verde Hotel', city: 'lisbon', area: 'Cais do Sodré', country: 'Portugal', stars: 4, lat: 38.7062, lon: -9.1446,
    card: 'A modern hotel on the riverfront, two minutes’ walk from the ferries and the train to the coast.',
    about: 'A modern hotel on the riverfront, two minutes’ walk from the ferries and the train to the coast.',
    cardAmenities: ['Free wifi', 'Gym', 'Bar'], amenities: ['Free wifi', 'Gym', 'Bar', 'Air conditioning', 'Elevator', '24-hour front desk'],
    photos: [p('cais-verde-exterior', 'Outside', 'outside'), p('cais-verde-room', 'Rooms', 'Double Room'), p('cais-verde-bar', 'Inside', 'bar')],
    rooms: [
      { id: 'double-room', name: 'Double Room', spec: '1 double bed, sleeps 2, river view', beds: '1 double bed', sleeps: 2, view: 'river view', nightly: 21400, refundable: true, breakfast: false, photos: ['cais-verde-room', 'cais-verde-exterior'] },
      { id: 'twin-room', name: 'Twin Room', spec: '2 single beds, sleeps 2', beds: '2 single beds', sleeps: 2, nightly: 22600, refundable: true, breakfast: false, photos: ['cais-verde-bar', 'cais-verde-room'] }
    ],
    checkIn: '15:00', checkOut: '12:00', address: 'Cais do Sodré, 1200 Lisbon, Portugal', policies: policiesFor(true, '')
  },
  {
    id: 'patio-quinze', name: 'Pátio Quinze', city: 'lisbon', area: 'Príncipe Real', country: 'Portugal', stars: 3, lat: 38.7166, lon: -9.1488,
    card: 'Twelve rooms around a planted courtyard on a quiet street near the Príncipe Real garden.',
    about: 'Twelve rooms around a planted courtyard on a quiet street near the Príncipe Real garden.',
    cardAmenities: ['Free wifi', 'Breakfast', 'Garden'], amenities: ['Free wifi', 'Breakfast available', 'Garden', 'Non-smoking rooms', 'Luggage storage'],
    photos: [p('patio-quinze-courtyard', 'Outside', 'courtyard garden'), p('patio-quinze-room', 'Rooms', 'Garden Double'), p('patio-quinze-detail', 'Inside', 'reading corner')],
    rooms: [
      { id: 'garden-double', name: 'Garden Double', spec: '1 double bed, sleeps 2, courtyard view', beds: '1 double bed', sleeps: 2, view: 'courtyard view', nightly: 15800, refundable: false, breakfast: true, photos: ['patio-quinze-room', 'patio-quinze-courtyard'] },
      { id: 'twin-room', name: 'Twin Room', spec: '2 single beds, sleeps 2', beds: '2 single beds', sleeps: 2, nightly: 16900, refundable: false, breakfast: true, photos: ['patio-quinze-detail', 'patio-quinze-room'] }
    ],
    checkIn: '14:00', checkOut: '11:00', address: 'Príncipe Real, 1250 Lisbon, Portugal', policies: policiesFor(false, '')
  },
  {
    id: 'ladeira-rooms', name: 'Ladeira Rooms', city: 'lisbon', area: 'Graça', country: 'Portugal', stars: 2, lat: 38.7172, lon: -9.1307,
    card: 'Simple, bright rooms at the top of the hill, with a shared lounge and kitchen for guests.',
    about: 'Simple, bright rooms at the top of the hill, with a shared lounge and kitchen for guests.',
    cardAmenities: ['Free wifi', 'Shared kitchen', 'Luggage storage'], amenities: ['Free wifi', 'Shared kitchen', 'Luggage storage', 'Non-smoking rooms'],
    photos: [p('ladeira-room', 'Rooms', 'Double Room'), p('ladeira-lounge', 'Inside', 'shared lounge'), p('ladeira-kitchen', 'Inside', 'shared kitchen')],
    rooms: [
      { id: 'double-room', name: 'Double Room', spec: '1 double bed, sleeps 2', beds: '1 double bed', sleeps: 2, nightly: 9700, refundable: true, breakfast: false, photos: ['ladeira-room', 'ladeira-lounge'] },
      { id: 'triple-room', name: 'Triple Room', spec: '1 double bed and 1 single bed, sleeps 3', beds: '1 double bed and 1 single bed', sleeps: 3, nightly: 12400, refundable: true, breakfast: false, photos: ['ladeira-lounge', 'ladeira-kitchen'] }
    ],
    checkIn: '15:00', checkOut: '11:00', address: 'Graça, 1170 Lisbon, Portugal', policies: policiesFor(true, '')
  },
  {
    id: 'ribeira-lofts', name: 'Ribeira Lofts', city: 'lisbon', area: 'Santos', country: 'Portugal', stars: 3, lat: 38.7077, lon: -9.1548,
    card: 'Apartment-style rooms with a small kitchen in each, a short walk from the river and the tram.',
    about: 'Apartment-style rooms with a small kitchen in each, a short walk from the river and the tram.',
    cardAmenities: ['Free wifi', 'Kitchen', 'Washing machine'], amenities: ['Free wifi', 'Kitchen', 'Washing machine', 'Air conditioning'],
    photos: [p('ribeira-loft', 'Rooms', 'Studio'), p('ribeira-living', 'Inside', 'living area'), p('ribeira-kitchen', 'Rooms', 'kitchen')],
    rooms: [
      { id: 'studio', name: 'Studio', spec: '1 double bed and a kitchen, sleeps 2', beds: '1 double bed', sleeps: 2, nightly: 17100, refundable: false, breakfast: false, photos: ['ribeira-loft', 'ribeira-kitchen'] },
      { id: 'one-bedroom-loft', name: 'One-bedroom Loft', spec: '1 king bed, a sofa bed and a kitchen, sleeps 4', beds: '1 king bed and a sofa bed', sleeps: 4, nightly: 21900, refundable: false, breakfast: false, photos: ['ribeira-living', 'ribeira-loft'] }
    ],
    checkIn: '16:00', checkOut: '11:00', address: 'Santos, 1200 Lisbon, Portugal', policies: policiesFor(false, ' The One-bedroom Loft has a sofa bed for two more guests.')
  },
  {
    id: 'albergo-tre-finestre', name: 'Albergo Tre Finestre', city: 'rome', area: 'Monti', country: 'Italy', stars: 3, lat: 41.8957, lon: 12.4929,
    card: 'A family-run hotel on a cobbled street in Monti, a ten-minute walk from the Colosseum.',
    about: 'A family-run hotel on a cobbled street in Monti, a ten-minute walk from the Colosseum.',
    cardAmenities: ['Free wifi', 'Breakfast', 'Air conditioning'], amenities: ['Free wifi', 'Breakfast available', 'Air conditioning', 'Luggage storage', 'Daily housekeeping'],
    photos: [p('albergo-street', 'Outside', 'the street outside'), p('albergo-room', 'Rooms', 'Classic Double'), p('albergo-breakfast', 'Inside', 'breakfast')],
    rooms: [
      { id: 'classic-double', name: 'Classic Double', spec: '1 double bed, sleeps 2, street view', beds: '1 double bed', sleeps: 2, view: 'street view', nightly: 16400, refundable: true, breakfast: true, photos: ['albergo-room', 'albergo-breakfast'] },
      { id: 'twin-room', name: 'Twin Room', spec: '2 single beds, sleeps 2', beds: '2 single beds', sleeps: 2, nightly: 17200, refundable: true, breakfast: true, photos: ['albergo-street', 'albergo-room'] }
    ],
    checkIn: '14:00', checkOut: '11:00', address: 'Monti, 00184 Rome, Italy', policies: policiesFor(true, '')
  },
  {
    id: 'hotel-kumo-asakusa', name: 'Hotel Kumo Asakusa', city: 'tokyo', area: 'Asakusa', country: 'Japan', stars: 4, lat: 35.7106, lon: 139.7987,
    card: 'A compact, quiet hotel by the Sumida River, with a public bath on the top floor.',
    about: 'A compact, quiet hotel by the Sumida River, with a public bath on the top floor.',
    cardAmenities: ['Free wifi', 'Public bath', 'Laundry'], amenities: ['Free wifi', 'Public bath', 'Laundry', 'Air conditioning', 'Elevator', '24-hour front desk'],
    photos: [p('kumo-room', 'Rooms', 'Compact Double'), p('kumo-bath', 'Inside', 'public bath'), p('kumo-river', 'Outside', 'the Sumida River nearby')],
    rooms: [
      { id: 'compact-double', name: 'Compact Double', spec: '1 double bed, sleeps 2', beds: '1 double bed', sleeps: 2, nightly: 20300, refundable: true, breakfast: false, photos: ['kumo-room', 'kumo-bath'] },
      { id: 'river-twin', name: 'River Twin', spec: '2 single beds, sleeps 2, river view', beds: '2 single beds', sleeps: 2, view: 'river view', nightly: 24100, refundable: true, breakfast: false, photos: ['kumo-river', 'kumo-room'] }
    ],
    checkIn: '15:00', checkOut: '10:00', address: 'Asakusa, Taito City, Tokyo 111-0032, Japan', policies: policiesFor(true, '')
  },
  {
    id: 'the-halyard-hotel', name: 'The Halyard Hotel', city: 'new-york', area: 'Dumbo, Brooklyn', country: 'United States', stars: 4, lat: 40.7035, lon: -73.9887,
    card: 'A converted warehouse by the East River, with tall windows and a rooftop bar facing Manhattan.',
    about: 'A converted warehouse by the East River, with tall windows and a rooftop bar facing Manhattan.',
    cardAmenities: ['Free wifi', 'Gym', 'Rooftop bar'], amenities: ['Free wifi', 'Gym', 'Rooftop bar', 'Air conditioning', 'Elevator', '24-hour front desk'],
    photos: [p('halyard-room', 'Rooms', 'Loft King'), p('halyard-rooftop', 'Outside', 'rooftop bar'), p('halyard-lobby', 'Inside', 'lobby')],
    rooms: [
      { id: 'loft-king', name: 'Loft King', spec: '1 king bed, sleeps 2, city view', beds: '1 king bed', sleeps: 2, view: 'city view', nightly: 28900, refundable: false, breakfast: false, photos: ['halyard-room', 'halyard-lobby'] },
      { id: 'loft-double', name: 'Loft Double', spec: '2 double beds, sleeps 4', beds: '2 double beds', sleeps: 4, nightly: 33400, refundable: false, breakfast: false, photos: ['halyard-lobby', 'halyard-room'] }
    ],
    checkIn: '16:00', checkOut: '11:00', address: 'Dumbo, Brooklyn, NY 11201, United States', policies: policiesFor(false, '')
  }
];

/* The city centre each search measures "Closest to the center" from, and where the map centres */
export const CITY_CENTRE: Record<string, [number, number]> = {
  lisbon: [38.7107, -9.1365], rome: [41.8986, 12.4769], tokyo: [35.7148, 139.7967], 'new-york': [40.7128, -74.006],
  paris: [48.8566, 2.3522], barcelona: [41.3874, 2.1686], amsterdam: [52.3676, 4.9041], 'mexico-city': [19.4326, -99.1332],
  'cape-town': [-33.9249, 18.4241], sydney: [-33.8688, 151.2093], singapore: [1.2931, 103.852], marrakech: [31.6258, -7.9891]
};

/* ===== The catalogue's 96 hotels, merged with the eight originals (ids, photos, rooms and prices kept) ===== */
type CatRoom = { name: string; beds: string; size: string; sleeps: number; view: string; amenities: string[]; plans: { name: string; nightly: number }[] };
type CatHotel = {
  id: string; name: string; city: string; type: string; stars: number; neighborhood: string; distanceKm: number; score: number; scoreWord: string;
  reviewCount: number; fromNightly: number; band: string; checkIn: string; checkOut: string; showcase: boolean; blurb: string; highlights: string[];
  amenities: string[]; about: string[]; rooms: CatRoom[]; categoryScores: Record<string, number> | null; reviews: Review[]; nearby: Nearby[];
  houseRules: { title: string; body: string }[];
};
type PoolReview = { band: string; score: number; name: string; country: string; trip: string; title: string; text: string; fits: string[] };
const CAT = catalogue as unknown as { hotels: CatHotel[]; breakfast: Record<string, number>; centers: Record<string, string>; reviewPool: PoolReview[] };

/* Catalogue section 4: six pool snippets for each hotel without its own reviews. 4 from its band, 1 from the band
   above and 1 below where they exist (Fair: 5 Fair and 1 Good), only where the snippet's tags fit the hotel, seeded
   by the hotel id, never one twice on a page; months Oct 2026 back to May 2026, newest first. */
const BANDS = ['Fair', 'Good', 'Very good', 'Excellent', 'Exceptional'];
const MONTHS = ['Oct 2026', 'Sep 2026', 'Aug 2026', 'Jul 2026', 'Jun 2026', 'May 2026'];
function fits(tag: string, c: CatHotel): boolean {
  const a = c.amenities;
  switch (tag) {
    case 'any': return true;
    case 'breakfast': return a.includes('Breakfast available');
    case 'kitchen': return a.includes('Kitchen');
    case 'pool': return a.some((x) => x === 'Outdoor pool' || x === 'Indoor pool' || x === 'Plunge pool');
    case 'family': return a.includes('Family rooms');
    case 'beach': return a.includes('Beach access');
    case 'bar': return a.includes('Bar') || a.includes('Rooftop bar');
    case 'self check-in': return a.includes('Self check-in');
    case 'central': return c.distanceKm < 1.5;
    case 'far': return c.distanceKm >= 3;
    case 'budget': return c.band === 'Budget';
    case 'luxury': return c.band === 'Luxury';
    default: return false;
  }
}
function poolReviews(c: CatHotel): Review[] {
  const band = c.score >= 9 ? 'Exceptional' : c.score >= 8.5 ? 'Excellent' : c.score >= 8 ? 'Very good' : c.score >= 7 ? 'Good' : 'Fair';
  const i = BANDS.indexOf(band);
  const plan: string[] = band === 'Fair' ? ['Fair', 'Fair', 'Fair', 'Fair', 'Fair', 'Good'] : [band, band, band, band, BANDS[i + 1] ?? band, BANDS[i - 1] ?? band];
  const r = rng(`${c.id}:reviews`);
  const used = new Set<PoolReview>();
  const out: PoolReview[] = [];
  for (const b of plan) {
    let list = (CAT.reviewPool ?? []).filter((x) => x.band === b && !used.has(x) && x.fits.every((t) => fits(t, c)));
    if (!list.length) list = (CAT.reviewPool ?? []).filter((x) => x.band === band && !used.has(x) && x.fits.every((t) => fits(t, c)));
    if (!list.length) continue;
    const pickOne = list[Math.floor(r() * list.length)];
    used.add(pickOne); out.push(pickOne);
  }
  return out.map((x, k) => ({ name: x.name, country: x.country, trip: x.trip, month: MONTHS[k] ?? MONTHS[5], score: x.score, title: x.title, text: x.text }));
}
/* Guest scores for hotels without their own, from the overall score (catalogue section 4) */
function derivedScores(c: CatHotel): Record<string, number> {
  const cap = (n: number) => Math.min(10, Math.round(n * 10) / 10);
  const loc = c.distanceKm < 1.5 ? 0.4 : c.distanceKm >= 3 ? -0.4 : 0;
  const val = c.band === 'Budget' ? 0.3 : c.band === 'Luxury' ? -0.5 : 0;
  return { Cleanliness: cap(c.score + 0.2), Comfort: cap(c.score - 0.1), Location: cap(c.score + loc), Staff: cap(c.score + 0.2), Value: cap(c.score + val), Wifi: cap(c.score) };
}

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const planId = (name: string): RatePlanId => (Object.entries(PLAN_NAMES).find(([, n]) => n === name)?.[0] as RatePlanId) ?? 'nr';
const plan = (id: RatePlanId, dollars: number): RatePlan => ({ id, name: PLAN_NAMES[id], nightly: Math.round(dollars) * 100, refundable: id === 'fc' || id === 'fcb', breakfast: id === 'fcb' || id === 'nrb' });
const CARD_SHORT: Record<string, string> = { 'Breakfast available': 'Breakfast' };
const cardAmenity = (a: string) => CARD_SHORT[a] ?? a;

/* The other hotels' rooms by property type (catalogue, "Rate plans"): [name, beds, sleeps, markup] */
const ROOM_TEMPLATES: Record<PropertyType, [string, string, number, number][]> = {
  Hotel: [['Double Room', '1 double bed', 2, 0], ['Twin Room', '2 single beds', 2, 0.06], ['Family Room', '1 double bed and 2 single beds', 4, 0.38]],
  'Boutique hotel': [['Classic Double', '1 double bed', 2, 0], ['Deluxe Double', '1 king bed', 2, 0.2]],
  Guesthouse: [['Double Room', '1 double bed', 2, 0], ['Triple Room', '1 double bed and 1 single bed', 3, 0.22]],
  Apartment: [['One-bedroom Apartment', '1 double bed and a sofa bed', 3, 0], ['Two-bedroom Apartment', '1 double bed, 2 single beds and a sofa bed', 5, 0.45]],
  Aparthotel: [['Studio', '1 double bed', 2, 0], ['One-bedroom Suite', '1 king bed and a sofa bed', 4, 0.3]],
  Resort: [['Garden Double', '1 king bed', 2, 0], ['Pool View Double', '1 king bed', 2, 0.18], ['Family Suite', '1 king bed and a sofa bed for two', 4, 0.52]]
};
const ROOM_AMENITIES = ['Air conditioning', 'Heating', 'Hairdryer', 'Safe in room', 'Flat-screen TV', 'Kettle', 'Coffee machine', 'Rain shower', 'Blackout curtains', 'Work desk', 'Minibar'];

/* rooms left at a rate: from the data only, seeded so a page shows the same figure on every load */
const roomsLeftFor = (hotel: string, room: string) => { const h = hash(`${hotel}:${room}`) % 11; return h < 3 ? h + 1 : 4 + h; };

function plansFor(c: CatHotel, base: number, breakfastPrice: number): RatePlan[] {
  const hasBreakfast = c.amenities.includes('Breakfast available');
  const everyRate = c.highlights.some((x) => /Breakfast in every rate/i.test(x));
  if (everyRate) return [plan('nrb', base), plan('fcb', base * 1.1)];
  const list = [plan('nr', base), plan('fc', base * 1.1)];
  if (hasBreakfast) list.push(plan('fcb', base * 1.1 + breakfastPrice));
  return list;
}

const LEGACY_BY_ID = new Map(LEGACY.map((h) => [h.id, h]));
const usedLeads = new Map<string, Set<string>>();
const usedInCity = new Map<string, Map<string, number>>();
const poolUse = new Map<string, number>();
/* the originals' own lead photos count as taken in their city */
for (const h of LEGACY) { const s = usedLeads.get(h.city) ?? new Set<string>(); s.add(h.photos[0].name); usedLeads.set(h.city, s); const m = usedInCity.get(h.city) ?? new Map<string, number>(); for (const p of h.photos) m.set(p.name, (m.get(p.name) ?? 0) + 1); usedInCity.set(h.city, m); }

function photosFor(c: CatHotel, n: number): HotelPhoto[] {
  const leads = usedLeads.get(c.city) ?? new Set<string>(); usedLeads.set(c.city, leads);
  const inCity = usedInCity.get(c.city) ?? new Map<string, number>(); usedInCity.set(c.city, inCity);
  const r = rng(c.id);
  const pool = HOTEL_PHOTO_POOL.filter((p) => !p.city || p.city === c.city);
  const score = (name: string) => (inCity.get(name) ?? 0) * 10 + (poolUse.get(name) ?? 0) + r() * 0.5;
  const ranked = (pool: typeof HOTEL_PHOTO_POOL) => [...pool].sort((a, b) => score(a.name) - score(b.name));
  /* lead: a room or outside photo nobody else in this city leads with */
  const leadPool = pool.filter((p) => !leads.has(p.name) && p.cat !== 'Inside');
  const lead = ranked(leadPool.length ? leadPool : pool.filter((p) => !leads.has(p.name)))[0] ?? pool[0];
  const chosen = [lead];
  const want: PhotoCat[] = ['Rooms', 'Inside', 'Outside', 'Rooms', 'Inside', 'Rooms', 'Outside', 'Inside', 'Rooms'];
  for (const cat of want) {
    if (chosen.length >= n) break;
    const next = ranked(pool.filter((p) => p.cat === cat && !chosen.includes(p)))[0];
    if (next) chosen.push(next);
  }
  leads.add(lead.name);
  for (const p of chosen) { inCity.set(p.name, (inCity.get(p.name) ?? 0) + 1); poolUse.set(p.name, (poolUse.get(p.name) ?? 0) + 1); }
  return chosen.map((p) => ({ name: p.name, cat: p.cat, caption: p.caption }));
}

/* compass bearings (degrees) on the land side of each coastal city's center point, so a pin never lands in a river,
   a harbour or the sea; inland cities use the whole circle. Manhattan runs north and south of Times Square. */
const LAND_SECTORS: Record<string, [number, number][]> = {
  lisbon: [[262, 420]], barcelona: [[205, 440]], amsterdam: [[105, 255]], 'new-york': [[12, 32], [192, 212]],
  tokyo: [[205, 425]], singapore: [[215, 395]], sydney: [[105, 255]], 'cape-town': [[115, 245]]
};
/* each catalogue neighborhood's own centre (on land), so a pin sits in the district its card names; a seeded nudge of
   up to about 50m keeps two hotels in one district apart before the map's collision pass. */
const DISTRICT: Record<string, [number, number]> = {
  'lisbon|Alfama': [38.7118, -9.1302], 'lisbon|Cais do Sodré': [38.7068, -9.1445], 'lisbon|Príncipe Real': [38.7166, -9.1488], 'lisbon|Graça': [38.7172, -9.1307],
  'lisbon|Santos': [38.7079, -9.1548], 'lisbon|Belém': [38.6979, -9.2068], 'lisbon|Chiado': [38.7106, -9.1420], 'lisbon|Mouraria': [38.7150, -9.1350],
  'rome|Monti': [41.8957, 12.4929], 'rome|Centro Storico': [41.8986, 12.4769], 'rome|Trastevere': [41.8894, 12.4700], 'rome|Aventino': [41.8829, 12.4800],
  'rome|Esquilino': [41.8960, 12.5030], 'rome|Prati': [41.9073, 12.4625], 'rome|Termini': [41.9010, 12.5010], 'rome|Appia Antica': [41.8580, 12.5160],
  'paris|Le Marais': [48.8590, 2.3620], 'paris|Canal Saint-Martin': [48.8710, 2.3650], 'paris|Montmartre': [48.8867, 2.3431], 'paris|Saint-Germain-des-Prés': [48.8540, 2.3330],
  'paris|Belleville': [48.8720, 2.3840], 'paris|Latin Quarter': [48.8490, 2.3470], 'paris|Gare du Nord': [48.8800, 2.3550], 'paris|Batignolles': [48.8870, 2.3170],
  'barcelona|Eixample': [41.3910, 2.1620], 'barcelona|Poblenou': [41.4010, 2.1990], 'barcelona|Gothic Quarter': [41.3830, 2.1770], 'barcelona|Gràcia': [41.4030, 2.1560],
  'barcelona|Sant Antoni': [41.3780, 2.1610], 'barcelona|Passeig de Gràcia': [41.3930, 2.1640], 'barcelona|Sants': [41.3750, 2.1370], 'barcelona|El Born': [41.3850, 2.1830],
  'amsterdam|Jordaan': [52.3750, 4.8820], 'amsterdam|Western Islands': [52.3870, 4.8880], 'amsterdam|Eastern Docklands': [52.3720, 4.9370], 'amsterdam|De Pijp': [52.3540, 4.8930],
  'amsterdam|Oud-West': [52.3640, 4.8680], 'amsterdam|Canal Ring': [52.3670, 4.8900], 'amsterdam|Amsterdam-Noord': [52.3930, 4.9200], 'amsterdam|Centrum': [52.3730, 4.8950],
  'new-york|Dumbo, Brooklyn': [40.7033, -73.9881], 'new-york|Midtown': [40.7549, -73.9840], 'new-york|West Village': [40.7350, -74.0030], 'new-york|Chelsea': [40.7465, -74.0010],
  'new-york|Long Island City, Queens': [40.7447, -73.9485], 'new-york|Park Slope, Brooklyn': [40.6710, -73.9810], 'new-york|Harlem': [40.8116, -73.9465], 'new-york|Financial District': [40.7075, -74.0090],
  'mexico-city|Roma Norte': [19.4180, -99.1620], 'mexico-city|Polanco': [19.4330, -99.1940], 'mexico-city|Coyoacán': [19.3500, -99.1620], 'mexico-city|Condesa': [19.4120, -99.1720],
  'mexico-city|Juárez': [19.4270, -99.1590], 'mexico-city|Centro Histórico': [19.4330, -99.1330], 'mexico-city|San Rafael': [19.4380, -99.1620], 'mexico-city|Santa Fe': [19.3600, -99.2600],
  'tokyo|Asakusa': [35.7106, 139.7987], 'tokyo|Yanaka': [35.7260, 139.7670], 'tokyo|Otemachi': [35.6860, 139.7650], 'tokyo|Shibuya': [35.6590, 139.7010],
  'tokyo|Shinjuku': [35.6900, 139.7000], 'tokyo|Nakameguro': [35.6440, 139.6990], 'tokyo|Ueno': [35.7140, 139.7770], 'tokyo|Odaiba': [35.6270, 139.7770],
  'singapore|Kampong Glam': [1.3020, 103.8590], 'singapore|Marina Bay': [1.2834, 103.8600], 'singapore|Sentosa': [1.2494, 103.8303], 'singapore|Tiong Bahru': [1.2860, 103.8270],
  'singapore|Little India': [1.3070, 103.8520], 'singapore|Chinatown': [1.2830, 103.8440], 'singapore|Jalan Besar': [1.3100, 103.8590], 'singapore|Orchard': [1.3040, 103.8320],
  'sydney|The Rocks': [-33.8599, 151.2085], 'sydney|Bondi Beach': [-33.8905, 151.2735], 'sydney|Manly': [-33.7980, 151.2850], 'sydney|Surry Hills': [-33.8860, 151.2110],
  'sydney|Newtown': [-33.8970, 151.1790], 'sydney|Pyrmont': [-33.8700, 151.1940], 'sydney|Haymarket': [-33.8790, 151.2040], 'sydney|Circular Quay': [-33.8630, 151.2110],
  'cape-town|Bo-Kaap': [-33.9210, 18.4150], 'cape-town|V&A Waterfront': [-33.9040, 18.4200], 'cape-town|Camps Bay': [-33.9510, 18.3790], 'cape-town|Sea Point': [-33.9180, 18.3880],
  'cape-town|De Waterkant': [-33.9160, 18.4170], 'cape-town|Gardens': [-33.9330, 18.4110], 'cape-town|City Bowl': [-33.9250, 18.4200], 'cape-town|Woodstock': [-33.9270, 18.4450],
  'marrakech|Mouassine': [31.6310, -7.9900], 'marrakech|Medina': [31.6295, -7.9850], 'marrakech|Palmeraie': [31.6650, -7.9650], 'marrakech|Gueliz': [31.6370, -8.0100],
  'marrakech|Hivernage': [31.6230, -8.0130], 'marrakech|Kasbah': [31.6170, -7.9890], 'marrakech|Medina, Bab Doukkala': [31.6340, -7.9990], 'marrakech|Mellah': [31.6230, -7.9820]
};
/* the land side of each city as one bearing (degrees, 0 is north), for the map's collision pass; undefined inland */
export function landBearing(city: string): number | undefined {
  const s = LAND_SECTORS[city]; if (!s) return undefined;
  const [a, b] = s[0]; return ((a + b) / 2) % 360;
}
function place(c: CatHotel): [number, number] {
  const d0 = DISTRICT[`${c.city}|${(c as { neighborhood?: string }).neighborhood ?? ''}`];
  if (d0) { const h = hash(c.id); return [+(d0[0] + ((h % 11) - 5) * 0.0001).toFixed(4), +(d0[1] + ((Math.floor(h / 11) % 11) - 5) * 0.0001).toFixed(4)]; }
  const centre = CITY_CENTRE[c.city] ?? [0, 0];
  const h0 = hash(c.id), sectors = LAND_SECTORS[c.city];
  const sector = sectors ? sectors[h0 % sectors.length] : [0, 360];
  const bearing = sector[0] + (Math.floor(h0 / 7) % Math.max(1, sector[1] - sector[0]));
  const a = (bearing % 360) * Math.PI / 180, d = c.distanceKm || 0.6;
  return [+(centre[0] + (d / 111) * Math.cos(a)).toFixed(4), +(centre[1] + (d / (111 * Math.cos(centre[0] * Math.PI / 180))) * Math.sin(a)).toFixed(4)];
}

const defaultRules = (c: CatHotel) => {
  const apt = c.type === 'Apartment';
  const pets = c.amenities.includes('Pets allowed');
  const access = c.amenities.includes('Step-free entrance') && c.amenities.includes('Accessible rooms');
  return [
    { title: 'Children', body: apt ? 'Children of all ages are welcome. Ask the host for a cot before you arrive.' : 'Children of all ages are welcome. A cot is available on request, free of charge.' },
    { title: 'Pets', body: pets ? 'Pets are welcome on request, and the hotel may charge a cleaning fee.' : 'Pets aren’t allowed.' },
    { title: 'Payment', body: 'You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.' },
    { title: 'Quiet hours', body: '22:00 to 08:00.' },
    { title: 'Accessibility', body: access ? 'Step-free entrance and accessible rooms. Ask the hotel which room suits you best.' : 'Ask the hotel about step-free access before you book.' }
  ];
};
const curly = (s: string) => s.replace(/'/g, '’');

function buildHotel(c: CatHotel): Hotel {
  const legacy = LEGACY_BY_ID.get(c.id);
  const type = (PROPERTY_TYPES.includes(c.type as PropertyType) ? c.type : 'Hotel') as PropertyType;
  const city = CITIES.find((x) => x.id === c.city);
  const breakfast = CAT.breakfast[c.city] ?? 24;
  const photos = legacy ? legacy.photos : photosFor(c, c.showcase ? 9 : 5);
  const roomPhotos = photos.filter((p) => p.cat === 'Rooms').map((p) => p.name);
  const otherPhotos = photos.filter((p) => p.cat !== 'Rooms').map((p) => p.name);
  const photoPair = (i: number) => [roomPhotos[i % Math.max(1, roomPhotos.length)] ?? photos[0].name, otherPhotos[i % Math.max(1, otherPhotos.length)] ?? photos[0].name];
  const r = rng(`${c.id}:rooms`);
  const roomAmen = (i: number) => { const list = ROOM_AMENITIES.filter(() => r() < 0.5).slice(0, 5); return list.length >= 3 ? list : ROOM_AMENITIES.slice(i, i + 4); };
  let rooms: Room[];
  if (c.rooms.length) {
    rooms = c.rooms.map((cr, i) => {
      const id = slugify(cr.name);
      const old = legacy?.rooms.find((x) => x.id === id);
      const plans = cr.plans.map((p) => plan(planId(p.name), p.nightly));
      /* an original room keeps its own rate as the default plan, so the demo bookings hold */
      const def = (old ? plans.find((p) => p.nightly === old.nightly) : undefined) ?? [...plans].sort((a, b) => a.nightly - b.nightly)[0];
      const ordered = [def, ...plans.filter((p) => p !== def)];
      const view = cr.view ? `${cr.view.charAt(0).toLowerCase()}${cr.view.slice(1)} view` : undefined;
      return {
        id, name: cr.name, spec: old?.spec ?? `${cr.beds}, sleeps ${cr.sleeps}${cr.view ? `, ${cr.view.toLowerCase()}` : ''}`, beds: cr.beds, sleeps: cr.sleeps, view: old?.view ?? view,
        nightly: def.nightly, refundable: def.refundable, breakfast: def.breakfast, photos: old?.photos ?? photoPair(i),
        size: cr.size, amenities: cr.amenities, plans: ordered, roomsLeft: roomsLeftFor(c.id, id), hotel: c.id
      };
    });
  } else if (legacy) {
    rooms = legacy.rooms.map((lr, i) => {
      const id: RatePlanId = lr.refundable ? (lr.breakfast ? 'fcb' : 'fc') : (lr.breakfast ? 'nrb' : 'nr');
      const def: RatePlan = { id, name: PLAN_NAMES[id], nightly: lr.nightly, refundable: lr.refundable, breakfast: lr.breakfast };
      const extra: RatePlan[] = [];
      const d = lr.nightly / 100;
      if (!lr.refundable) extra.push(plan(lr.breakfast ? 'fcb' : 'fc', d * 1.1));
      if (!lr.breakfast && c.amenities.includes('Breakfast available')) extra.push(plan('fcb', (lr.refundable ? d : d * 1.1) + breakfast));
      return { ...lr, amenities: roomAmen(i), plans: [def, ...extra.filter((x) => x.id !== def.id)], roomsLeft: roomsLeftFor(c.id, lr.id), hotel: c.id };
    });
  } else {
    rooms = ROOM_TEMPLATES[type].map(([name, beds, sleeps, markup], i) => {
      const base = c.fromNightly * (1 + markup);
      const plans = (type === 'Apartment' || type === 'Aparthotel') && !c.amenities.includes('Breakfast available') ? [plan('nr', base), plan('fc', base * 1.1)] : plansFor(c, base, breakfast);
      const id = slugify(name);
      return { id, name, spec: `${beds}, sleeps ${sleeps}`, beds, sleeps, nightly: plans[0].nightly, refundable: plans[0].refundable, breakfast: plans[0].breakfast, photos: photoPair(i), amenities: roomAmen(i), plans, roomsLeft: roomsLeftFor(c.id, id), hotel: c.id };
    });
  }
  const [lat, lon] = legacy ? [legacy.lat, legacy.lon] : place(c);
  const about = c.about.length ? c.about.map(curly) : [curly(c.blurb)];
  const card = curly(c.blurb || legacy?.card || '');
  const rules = c.houseRules.length ? c.houseRules.map((x) => ({ title: x.title, body: curly(x.body) })) : defaultRules(c);
  return {
    id: c.id, name: c.name, city: c.city, area: c.neighborhood, country: city?.country ?? legacy?.country ?? '', stars: c.stars, lat, lon,
    card, about: legacy?.about ?? about[0], cardAmenities: c.amenities.slice(0, 3).map(cardAmenity), amenities: c.amenities, photos, rooms,
    checkIn: c.checkIn, checkOut: c.checkOut, address: legacy?.address ?? `${c.neighborhood}, ${city?.name ?? ''}, ${city?.country ?? ''}`,
    policies: legacy?.policies ?? rules.filter((x) => x.title !== 'Quiet hours'),
    type, showcase: c.showcase, score: c.score, scoreWord: c.scoreWord, reviewCount: c.reviewCount, distanceKm: c.distanceKm, fromNightly: c.fromNightly * 100,
    band: c.band, highlights: c.highlights.map(curly), aboutParas: about,
    categoryScores: Object.entries(c.categoryScores ?? derivedScores(c)).filter(([, v]) => typeof v === 'number').map(([label, score]) => ({ label, score })),
    reviews: (c.reviews.length ? c.reviews : poolReviews(c)).map((x) => ({ ...x, title: curly(x.title), text: curly(x.text) })), nearby: c.nearby.map((x) => ({ ...x, name: curly(x.name) })),
    houseRules: rules, centerPoint: CAT.centers[c.city] ?? ''
  };
}

/* An original hotel the catalogue has not reached yet keeps its own record (while the catalogue is being written) */
function legacyOnly(h: BaseHotel): Hotel {
  return buildHotel({ id: h.id, name: h.name, city: h.city, type: 'Hotel', stars: h.stars, neighborhood: h.area, distanceKm: 1, score: 8.4, scoreWord: 'Very good', reviewCount: 500,
    fromNightly: Math.min(...h.rooms.map((r) => r.nightly)) / 100, band: '', checkIn: h.checkIn, checkOut: h.checkOut, showcase: false, blurb: h.card, highlights: [],
    amenities: h.amenities, about: [h.about], rooms: [], categoryScores: null, reviews: [], nearby: [], houseRules: [] });
}

export const HOTELS: Hotel[] = [
  ...CAT.hotels.map(buildHotel),
  ...LEGACY.filter((h) => !CAT.hotels.some((c) => c.id === h.id)).map(legacyOnly)
];
/* the cities that have hotels, in the catalogue's order */
export const HOTEL_CITIES = [...new Set(HOTELS.map((h) => h.city))];
export const scoreWord = (s: number) => s >= 9 ? 'Exceptional' : s >= 8.5 ? 'Excellent' : s >= 8 ? 'Very good' : s >= 7 ? 'Good' : 'Fair';
export const planById = (r: Room, id: string | null | undefined) => r.plans.find((p) => p.id === id) ?? r.plans[0];
/* the cheapest plan on the cheapest available room, as a nightly price in cents: the "from" price */
export const fromNightlyOf = (h: Hotel) => Math.min(...h.rooms.flatMap((r) => r.plans.map((p) => p.nightly)));


export const hotelById = (id: string) => HOTELS.find((h) => h.id === id);
export const cityById = (id: string) => CITIES.find((c) => c.id === id);
export const roomById = (h: Hotel, id: string) => h.rooms.find((r) => r.id === id);

/* ===== Search ===== */
export type StaySearch = { place: string; checkin: string; checkout: string; adults: number; children: number; rooms: number };
type Params = Record<string, string | string[] | undefined>;
const one = (q: Params, k: string) => { const v = q[k]; return Array.isArray(v) ? v[0] : v; };
const int = (v: string | undefined, min: number, max: number, d: number) => { const n = parseInt(v ?? '', 10); return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : d; };

function todayIso(): string { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

export function parseStaySearch(q: Params, placeOverride?: string): { search: StaySearch; complete: boolean } | null {
  const place = placeOverride || one(q, 'place') || '';
  if (!cityById(place)) return null;
  let checkin = one(q, 'checkin') || '', checkout = one(q, 'checkout') || '';
  let complete = true;
  const t = todayIso();
  /* a missing or past date fills in as today plus 21 days, for 3 nights (spec A14) */
  if (!fromIso(checkin) || checkin < t) { checkin = addIsoDays(t, 21); checkout = addIsoDays(checkin, 3); complete = false; }
  if (!fromIso(checkout) || checkout <= checkin) { checkout = addIsoDays(checkin, 4); complete = false; }
  const adults = int(one(q, 'adults'), 1, 8, 2);
  const children = int(one(q, 'children'), 0, 6, 0);
  const rooms = int(one(q, 'rooms'), 1, Math.min(4, adults), 1);
  if (one(q, 'adults') === undefined) complete = false;
  return { search: { place, checkin, checkout, adults, children, rooms }, complete };
}

export function stayQuery(s: StaySearch): string {
  return new URLSearchParams({ place: s.place, checkin: s.checkin, checkout: s.checkout, adults: String(s.adults), children: String(s.children), rooms: String(s.rooms) }).toString();
}

export const nightsOf = (s: StaySearch) => isoNights(s.checkin, s.checkout);
const perRoom = (s: StaySearch) => Math.ceil(s.adults / s.rooms) + Math.ceil(s.children / s.rooms);

/* Free cancellation ends at 23:59 hotel time three days before check-in ("until Nov 17" for Nov 20) */
export function freeCancelUntil(s: StaySearch): string { return addIsoDays(s.checkin, -3); }

/* Terrace Suite is held back for stays over five nights: the demo's sold-out room card (handover.md) */
export function roomAvailable(h: Pick<Hotel, 'id'>, r: Pick<Room, 'id' | 'sleeps'>, s: StaySearch): boolean {
  if (r.sleeps < perRoom(s)) return false;
  return !(h.id === 'casa-lanterna' && r.id === 'terrace-suite' && nightsOf(s) > 5);
}
export const roomFits = (r: Pick<Room, 'sleeps'>, s: StaySearch) => r.sleeps >= perRoom(s);

/* ===== Lower rates (catalogue section 5, "Hotels with lower rates"; the same rules lib/mock/home.ts uses for the
   homepage deals, so a deal's price is the price on the hotel page, the guest form and checkout):
   - Weekend rate: Friday and Saturday nights;
   - Weeknight rate: Sunday to Thursday nights within the next 30 days;
   - Long-stay rate: every night of a stay of 4 nights or more that starts within the next 60 days;
   - Next-month rate: nights in the next calendar month.
   The lower nightly is the plan's nightly less the percentage, in whole dollars. The eight original hotels have none. */
export type LowerKind = 'weekend' | 'weeknight' | 'long' | 'nextmonth';
const KIND_OF: Record<string, LowerKind> = { 'Weekend rate': 'weekend', 'Weeknight rate': 'weeknight', 'Long-stay rate': 'long', 'Next-month rate': 'nextmonth' };
export const LOWER_RATE_NAME: Record<LowerKind, string> = { weekend: 'Weekend rate', weeknight: 'Weeknight rate', long: 'Long-stay rate', nextmonth: 'Next-month rate' };
type DealRow = Record<string, string>;
export const LOWER_RATES: Record<string, { kind: LowerKind; pct: number }> = Object.fromEntries(
  ((catalogue as unknown as { deals: DealRow[] }).deals ?? [])
    .filter((d) => d._h2 === 'Hotels with lower rates' && d.Hotel && KIND_OF[d.Rate])
    .map((d) => [d.Hotel, { kind: KIND_OF[d.Rate], pct: parseInt(d['Lower than usual by'], 10) || 0 }])
);
function todayLocal(): string { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function lowerApplies(kind: LowerKind, night: string, s: StaySearch, today: string): boolean {
  const dow = new Date(`${night}T12:00:00Z`).getUTCDay();
  if (kind === 'weekend') return dow === 5 || dow === 6;
  if (kind === 'weeknight') return dow <= 4 && night < addIsoDays(today, 30);
  if (kind === 'long') return nightsOf(s) >= 4 && s.checkin < addIsoDays(today, 60);
  const [y, m] = today.split('-').map(Number);
  const next = `${m === 12 ? y + 1 : y}-${String(m === 12 ? 1 : m + 1).padStart(2, '0')}`;
  return night.slice(0, 7) === next;
}
export const lowerNightly = (nightly: number, pct: number) => Math.round((nightly * (100 - pct)) / 100 / 100) * 100;

/* totals include taxes and fees; the split is copy.md's demo ($744.00 = $640.00 + $104.00).
   `nightly` is the average a night for the stay (whole cents); `usual` and `saving` are set only when a lower rate applies */
export type StayAmounts = { room: number; tax: number; total: number; nightly: number; usual?: number; saving?: number; lower?: LowerKind };
export function stayTotals(r: Pick<Room, 'nightly'> & { hotel?: string }, s: StaySearch, p?: Pick<RatePlan, 'nightly'>): StayAmounts {
  const base = (p?.nightly ?? r.nightly) * s.rooms;
  const n = nightsOf(s);
  const usual = base * n;
  const rate = r.hotel ? LOWER_RATES[r.hotel] : undefined;
  let total = usual;
  if (rate) {
    const today = todayLocal();
    total = 0;
    for (let i = 0; i < n; i++) {
      const night = addIsoDays(s.checkin, i);
      total += lowerApplies(rate.kind, night, s, today) ? lowerNightly(base, rate.pct) : base;
    }
  }
  const tax = Math.round(total * 104 / 744);
  const nightly = n ? Math.round(total / n) : base;
  return total < usual && rate ? { room: total - tax, tax, total, nightly, usual, saving: usual - total, lower: rate.kind } : { room: total - tax, tax, total, nightly };
}

export type StayResult = { hotel: Hotel; room: Room; plan: RatePlan; amounts: StayAmounts; freeCancel: boolean; breakfast: boolean; distance: number; roomsLeft: number;
  /* whether any available room at the hotel sells a free-cancellation or a breakfast plan, for the filters */
  hasFreeCancel: boolean; hasBreakfast: boolean };

function km(a: [number, number], b: [number, number]): number {
  const r = Math.PI / 180;
  const h = Math.sin(((b[0] - a[0]) * r) / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(((b[1] - a[1]) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function searchStays(s: StaySearch): StayResult[] {
  return HOTELS.filter((h) => h.city === s.place).flatMap((h) => {
    const rooms = h.rooms.filter((r) => roomAvailable(h, r, s)).sort((a, b) => a.nightly - b.nightly);
    if (!rooms.length) return [];
    const room = rooms[0];
    const def = room.plans[0];
    const all = rooms.flatMap((x) => x.plans);
    return [{ hotel: h, room, plan: def, amounts: stayTotals(room, s, def), freeCancel: def.refundable, breakfast: def.breakfast, distance: h.distanceKm ?? km(CITY_CENTRE[h.city], [h.lat, h.lon]), roomsLeft: room.roomsLeft,
      hasFreeCancel: all.some((x) => x.refundable), hasBreakfast: all.some((x) => x.breakfast) }];
  });
}

/* the browser keeps the guest form under this key between the form and checkout (lib/store.ts drafts) */
export function stayDraftKey(hotel: string, room: string, s: StaySearch): string {
  return `stay:${hotel}:${room}:${s.checkin}:${s.checkout}:${s.adults}:${s.children}:${s.rooms}`;
}

/* ===== Hotels fork (Developer B, round 3): the homepage's property type tiles send type=boutique (spec A8) ===== */
const TYPE_SLUG: Record<string, PropertyType> = { hotel: 'Hotel', hotels: 'Hotel', boutique: 'Boutique hotel', 'boutique-hotel': 'Boutique hotel', guesthouse: 'Guesthouse', guesthouses: 'Guesthouse', apartment: 'Apartment', apartments: 'Apartment', aparthotel: 'Aparthotel', aparthotels: 'Aparthotel', resort: 'Resort', resorts: 'Resort' };
export const typeFromParam = (v: string | undefined | null): PropertyType | null => (v ? TYPE_SLUG[v.toLowerCase()] ?? null : null);
