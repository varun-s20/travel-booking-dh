/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): mock hotels
   The simulated Duffel Stays side: content/copy.md's eight fictional
   hotels with their areas, stars, prices, descriptions and amenities,
   Casa Lanterna's full detail (rooms, policies), positions for the map
   pins, and the search and pricing rules. Prices are for a night with
   taxes and fees included, as copy.md gives them. Photos: Landfall's own
   Unsplash stand-ins for Duffel's (public/images/hotels/, credits.md),
   keys into lib/images.manifest.json; captions finish the alt pattern
   "Casa Lanterna, roof terrace" (copy.md).
   Rooms and policies for the seven other hotels are not in copy.md; they
   follow Casa Lanterna's pattern with plain room names (Overwing's build/progress.md).
   ===================================================================== */
import { CITIES } from '@/lib/data/places';
import { addIsoDays, fromIso, isoNights } from '@/lib/format';
import { CAT, scoreWord, type CatHotel, type CatReview } from '@/lib/mock/catalogue';
import { CITY as CITY_PHOTOS, ROOMS as POOL_ROOMS, SHARED as POOL_SHARED, leadsFor } from '@/lib/mock/hotel-photos';
import { hash } from '@/lib/mock/geo';
export { leadsFor };

export type PhotoCat = 'Rooms' | 'Inside' | 'Outside';
export type HotelPhoto = { name: string; cat: PhotoCat; caption: string };
/* Rate plans (catalogue, Rate plans): nr Non-refundable, fc Free cancellation,
   fcb Free cancellation breakfast included, nrb Non-refundable breakfast included.
   A room's own nightly, refundable and breakfast are its default plan (the
   cheapest, or for the eight original hotels the rate they always had). */
export type PlanId = 'nr' | 'fc' | 'fcb' | 'nrb';
export type RatePlan = { id: PlanId; name: string; nightly: number; refundable: boolean; breakfast: boolean };
export type Room = { id: string; name: string; spec: string; beds: string; sleeps: number; view?: string; nightly: number; refundable: boolean; breakfast: boolean; photos: string[];
  size?: string; amenities?: string[]; plans?: RatePlan[] };
export type Hotel = {
  id: string; name: string; city: string; area: string; country: string; stars: number;
  lat: number; lon: number; card: string; about: string;
  cardAmenities: string[]; amenities: string[]; photos: HotelPhoto[]; rooms: Room[];
  checkIn: string; checkOut: string; address: string;
  policies: { title: string; body: string }[];
  /* round 3, from content/mock-catalogue.md (all demo data) */
  type?: string; score?: number; scoreWord?: string; reviews?: number; fromCentre?: number; band?: string;
  showcase?: boolean; highlights?: string[]; aboutMore?: string[]; categories?: Record<string, number>;
  reviewList?: CatReview[]; nearby?: { place: string; minutes: number; mode: string }[];
  rules?: { title: string; body: string }[]; lead?: number; breakfastPrice?: number;
};

const policiesFor = (refundable: boolean, extraBed: string) => [
  { title: 'Cancellation', body: refundable ? 'Free cancellation until 23:59 hotel time three days before check-in. After that, the booking can’t be refunded.' : 'This rate is non-refundable from the moment you book.' },
  { title: 'Payment', body: 'You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.' },
  { title: 'Children and extra beds', body: `Children of all ages are welcome. A cot is available on request, free of charge.${extraBed}` },
  { title: 'Pets', body: 'Pets aren’t allowed.' }
];

const BASE: Hotel[] = [
  {
    id: 'casa-lanterna', name: 'Casa Lanterna', city: 'lisbon', area: 'Alfama', country: 'Portugal', stars: 4, lat: 38.7118, lon: -9.1302,
    card: 'A restored townhouse on a stepped lane below the castle, with a tiled courtyard and a roof terrace over the river.',
    about: 'A restored townhouse on a stepped lane below the castle, with 18 rooms over four floors. The upper rooms look across the rooftops of Alfama to the river. Breakfast is served in the tiled courtyard until 11:00, and guests can use the roof terrace until late. The Baixa and the riverfront are about ten minutes’ walk downhill, and the 28 tram stops at the end of the street.',
    cardAmenities: ['Free wifi', 'Breakfast', 'Roof terrace'],
    amenities: ['Free wifi', 'Breakfast available', 'Roof terrace', 'Air conditioning', 'Elevator', '24-hour front desk', 'Luggage storage', 'Non-smoking rooms', 'Courtyard', 'Daily housekeeping', 'Hairdryer', 'Safe in room'],
    photos: [{ name: 'hotels/cl-roof-terrace', cat: 'Outside', caption: 'roof terrace' }, { name: 'hotels/cl-courtyard', cat: 'Outside', caption: 'courtyard' }, { name: 'hotels/cl-courtyard-double', cat: 'Rooms', caption: 'Courtyard Double' }, { name: 'hotels/cl-window-river', cat: 'Rooms', caption: 'River View Double' }, { name: 'hotels/cl-suite-bridge-view', cat: 'Rooms', caption: 'Terrace Suite' }, { name: 'hotels/cl-lounge', cat: 'Inside', caption: 'lounge' }, { name: 'hotels/cl-courtyard-night', cat: 'Outside', caption: 'courtyard at night' }, { name: 'hotels/cl-bathroom', cat: 'Rooms', caption: 'bathroom' }, { name: 'hotels/cl-lane', cat: 'Outside', caption: 'the lane outside' }, { name: 'hotels/cl-rooftops', cat: 'Outside', caption: 'view across the rooftops to the river' }],
    rooms: [
      { id: 'courtyard-double', name: 'Courtyard Double', spec: '1 double bed, sleeps 2, courtyard view', beds: '1 double bed', sleeps: 2, view: 'courtyard view', nightly: 18600, refundable: true, breakfast: true, photos: ['hotels/cl-courtyard-double', 'hotels/cl-bathroom', 'hotels/cl-courtyard'] },
      { id: 'river-view-double', name: 'River View Double', spec: '1 king bed, sleeps 2, river view', beds: '1 king bed', sleeps: 2, view: 'river view', nightly: 23800, refundable: true, breakfast: true, photos: ['hotels/cl-window-river', 'hotels/cl-bathroom', 'hotels/cl-rooftops'] },
      { id: 'terrace-suite', name: 'Terrace Suite', spec: '1 king bed and a sofa bed, sleeps 3, private terrace', beds: '1 king bed and a sofa bed', sleeps: 3, view: 'private terrace', nightly: 34200, refundable: false, breakfast: true, photos: ['hotels/cl-suite-bridge-view', 'hotels/cl-bathroom', 'hotels/cl-roof-terrace'] }
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
    photos: [{ name: 'hotels/cv-riverfront', cat: 'Outside', caption: 'on the riverfront' }, { name: 'hotels/cv-lobby', cat: 'Inside', caption: 'lobby' }, { name: 'hotels/cv-double', cat: 'Rooms', caption: 'Double Room' }, { name: 'hotels/cv-twin', cat: 'Rooms', caption: 'Twin Room' }],
    rooms: [
      { id: 'double-room', name: 'Double Room', spec: '1 double bed, sleeps 2, river view', beds: '1 double bed', sleeps: 2, view: 'river view', nightly: 21400, refundable: true, breakfast: false, photos: ['hotels/cv-double', 'hotels/cv-lobby'] },
      { id: 'twin-room', name: 'Twin Room', spec: '2 single beds, sleeps 2', beds: '2 single beds', sleeps: 2, nightly: 22600, refundable: true, breakfast: false, photos: ['hotels/cv-twin', 'hotels/cv-lobby'] }
    ],
    checkIn: '15:00', checkOut: '12:00', address: 'Cais do Sodré, 1200 Lisbon, Portugal', policies: policiesFor(true, '')
  },
  {
    id: 'patio-quinze', name: 'Pátio Quinze', city: 'lisbon', area: 'Príncipe Real', country: 'Portugal', stars: 3, lat: 38.7166, lon: -9.1488,
    card: 'Twelve rooms around a planted courtyard on a quiet street near the Príncipe Real garden.',
    about: 'Twelve rooms around a planted courtyard on a quiet street near the Príncipe Real garden.',
    cardAmenities: ['Free wifi', 'Breakfast', 'Garden'], amenities: ['Free wifi', 'Breakfast available', 'Garden', 'Non-smoking rooms', 'Luggage storage'],
    photos: [{ name: 'hotels/pq-courtyard', cat: 'Outside', caption: 'courtyard' }, { name: 'hotels/pq-garden-double', cat: 'Rooms', caption: 'Garden Double' }, { name: 'hotels/pq-twin', cat: 'Rooms', caption: 'Twin Room' }],
    rooms: [
      { id: 'garden-double', name: 'Garden Double', spec: '1 double bed, sleeps 2, courtyard view', beds: '1 double bed', sleeps: 2, view: 'courtyard view', nightly: 15800, refundable: false, breakfast: true, photos: ['hotels/pq-garden-double', 'hotels/pq-courtyard'] },
      { id: 'twin-room', name: 'Twin Room', spec: '2 single beds, sleeps 2', beds: '2 single beds', sleeps: 2, nightly: 16900, refundable: false, breakfast: true, photos: ['hotels/pq-twin', 'hotels/pq-courtyard'] }
    ],
    checkIn: '14:00', checkOut: '11:00', address: 'Príncipe Real, 1250 Lisbon, Portugal', policies: policiesFor(false, '')
  },
  {
    id: 'ladeira-rooms', name: 'Ladeira Rooms', city: 'lisbon', area: 'Graça', country: 'Portugal', stars: 2, lat: 38.7172, lon: -9.1307,
    card: 'Simple, bright rooms at the top of the hill, with a shared lounge and kitchen for guests.',
    about: 'Simple, bright rooms at the top of the hill, with a shared lounge and kitchen for guests.',
    cardAmenities: ['Free wifi', 'Shared kitchen', 'Luggage storage'], amenities: ['Free wifi', 'Shared kitchen', 'Luggage storage', 'Non-smoking rooms'],
    photos: [{ name: 'hotels/lr-hilltop', cat: 'Outside', caption: 'view from the top of the hill' }, { name: 'hotels/lr-double', cat: 'Rooms', caption: 'Double Room' }, { name: 'hotels/lr-triple', cat: 'Rooms', caption: 'Triple Room' }],
    rooms: [
      { id: 'double-room', name: 'Double Room', spec: '1 double bed, sleeps 2', beds: '1 double bed', sleeps: 2, nightly: 9700, refundable: true, breakfast: false, photos: ['hotels/lr-double', 'hotels/lr-hilltop'] },
      { id: 'triple-room', name: 'Triple Room', spec: '1 double bed and 1 single bed, sleeps 3', beds: '1 double bed and 1 single bed', sleeps: 3, nightly: 12400, refundable: true, breakfast: false, photos: ['hotels/lr-triple', 'hotels/lr-hilltop'] }
    ],
    checkIn: '15:00', checkOut: '11:00', address: 'Graça, 1170 Lisbon, Portugal', policies: policiesFor(true, '')
  },
  {
    id: 'ribeira-lofts', name: 'Ribeira Lofts', city: 'lisbon', area: 'Santos', country: 'Portugal', stars: 3, lat: 38.7077, lon: -9.1548,
    card: 'Apartment-style rooms with a small kitchen in each, a short walk from the river and the tram.',
    about: 'Apartment-style rooms with a small kitchen in each, a short walk from the river and the tram.',
    cardAmenities: ['Free wifi', 'Kitchen', 'Washing machine'], amenities: ['Free wifi', 'Kitchen', 'Washing machine', 'Air conditioning'],
    photos: [{ name: 'hotels/rl-street', cat: 'Outside', caption: 'the street' }, { name: 'hotels/rl-loft', cat: 'Inside', caption: 'loft' }, { name: 'hotels/rl-kitchen', cat: 'Rooms', caption: 'Studio' }, { name: 'hotels/rl-stair', cat: 'Rooms', caption: 'One-bedroom Loft' }],
    rooms: [
      { id: 'studio', name: 'Studio', spec: '1 double bed and a kitchen, sleeps 2', beds: '1 double bed', sleeps: 2, nightly: 17100, refundable: false, breakfast: false, photos: ['hotels/rl-kitchen', 'hotels/rl-loft'] },
      { id: 'one-bedroom-loft', name: 'One-bedroom Loft', spec: '1 king bed, a sofa bed and a kitchen, sleeps 4', beds: '1 king bed and a sofa bed', sleeps: 4, nightly: 21900, refundable: false, breakfast: false, photos: ['hotels/rl-stair', 'hotels/rl-loft'] }
    ],
    checkIn: '16:00', checkOut: '11:00', address: 'Santos, 1200 Lisbon, Portugal', policies: policiesFor(false, ' The One-bedroom Loft has a sofa bed for two more guests.')
  },
  {
    id: 'albergo-tre-finestre', name: 'Albergo Tre Finestre', city: 'rome', area: 'Monti', country: 'Italy', stars: 3, lat: 41.8957, lon: 12.4929,
    card: 'A family-run hotel on a cobbled street in Monti, a ten-minute walk from the Colosseum.',
    about: 'A family-run hotel on a cobbled street in Monti, a ten-minute walk from the Colosseum.',
    cardAmenities: ['Free wifi', 'Breakfast', 'Air conditioning'], amenities: ['Free wifi', 'Breakfast available', 'Air conditioning', 'Luggage storage', 'Daily housekeeping'],
    photos: [{ name: 'hotels/at-facade', cat: 'Outside', caption: 'front' }, { name: 'hotels/at-double', cat: 'Rooms', caption: 'Classic Double' }, { name: 'hotels/at-twin', cat: 'Rooms', caption: 'Twin Room' }],
    rooms: [
      { id: 'classic-double', name: 'Classic Double', spec: '1 double bed, sleeps 2, street view', beds: '1 double bed', sleeps: 2, view: 'street view', nightly: 16400, refundable: true, breakfast: true, photos: ['hotels/at-double', 'hotels/at-facade'] },
      { id: 'twin-room', name: 'Twin Room', spec: '2 single beds, sleeps 2', beds: '2 single beds', sleeps: 2, nightly: 17200, refundable: true, breakfast: true, photos: ['hotels/at-twin', 'hotels/at-facade'] }
    ],
    checkIn: '14:00', checkOut: '11:00', address: 'Monti, 00184 Rome, Italy', policies: policiesFor(true, '')
  },
  {
    id: 'hotel-kumo-asakusa', name: 'Hotel Kumo Asakusa', city: 'tokyo', area: 'Asakusa', country: 'Japan', stars: 4, lat: 35.7106, lon: 139.7987,
    card: 'A compact, quiet hotel by the Sumida River, with a public bath on the top floor.',
    about: 'A compact, quiet hotel by the Sumida River, with a public bath on the top floor.',
    cardAmenities: ['Free wifi', 'Public bath', 'Laundry'], amenities: ['Free wifi', 'Public bath', 'Laundry', 'Air conditioning', 'Elevator', '24-hour front desk'],
    photos: [{ name: 'hotels/hk-skytree-window', cat: 'Inside', caption: 'view from an upper floor' }, { name: 'hotels/hk-double', cat: 'Rooms', caption: 'Compact Double' }, { name: 'hotels/hk-river-twin', cat: 'Rooms', caption: 'River Twin' }],
    rooms: [
      { id: 'compact-double', name: 'Compact Double', spec: '1 double bed, sleeps 2', beds: '1 double bed', sleeps: 2, nightly: 20300, refundable: true, breakfast: false, photos: ['hotels/hk-double', 'hotels/hk-skytree-window'] },
      { id: 'river-twin', name: 'River Twin', spec: '2 single beds, sleeps 2, river view', beds: '2 single beds', sleeps: 2, view: 'river view', nightly: 24100, refundable: true, breakfast: false, photos: ['hotels/hk-river-twin', 'hotels/hk-skytree-window'] }
    ],
    checkIn: '15:00', checkOut: '10:00', address: 'Asakusa, Taito City, Tokyo 111-0032, Japan', policies: policiesFor(true, '')
  },
  {
    id: 'the-halyard-hotel', name: 'The Halyard Hotel', city: 'new-york', area: 'Dumbo, Brooklyn', country: 'United States', stars: 4, lat: 40.7035, lon: -73.9887,
    card: 'A converted warehouse by the East River, with tall windows and a rooftop bar facing Manhattan.',
    about: 'A converted warehouse by the East River, with tall windows and a rooftop bar facing Manhattan.',
    cardAmenities: ['Free wifi', 'Gym', 'Rooftop bar'], amenities: ['Free wifi', 'Gym', 'Rooftop bar', 'Air conditioning', 'Elevator', '24-hour front desk'],
    photos: [{ name: 'hotels/hh-rooftop-view', cat: 'Outside', caption: 'view from the roof' }, { name: 'hotels/hh-facade', cat: 'Outside', caption: 'front' }, { name: 'hotels/hh-loft-king', cat: 'Rooms', caption: 'Loft King' }, { name: 'hotels/hh-loft-double', cat: 'Rooms', caption: 'Loft Double' }],
    rooms: [
      { id: 'loft-king', name: 'Loft King', spec: '1 king bed, sleeps 2, city view', beds: '1 king bed', sleeps: 2, view: 'city view', nightly: 28900, refundable: false, breakfast: false, photos: ['hotels/hh-loft-king', 'hotels/hh-rooftop-view'] },
      { id: 'loft-double', name: 'Loft Double', spec: '2 double beds, sleeps 4', beds: '2 double beds', sleeps: 4, nightly: 33400, refundable: false, breakfast: false, photos: ['hotels/hh-loft-double', 'hotels/hh-rooftop-view'] }
    ],
    checkIn: '16:00', checkOut: '11:00', address: 'Dumbo, Brooklyn, NY 11201, United States', policies: policiesFor(false, '')
  }
];
/* ===== Round 3: the catalogue's 96 hotels (content/mock-catalogue.md, all demo data) =====
   The eight original hotels keep their ids, photos, rooms, prices and policies, and gain the
   catalogue's fields. The other 88 are built from the catalogue rows. Rooms for hotels without
   a showcase table follow the catalogue's rule by property type (Rate plans). Room sizes for
   those rooms are a demo rule by room kind (below), not catalogue facts. Map positions for the
   new hotels are the centre point moved by the catalogue's distance on a seeded bearing. */
const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const PLAN_ID: Record<string, PlanId> = {
  'Non-refundable': 'nr', 'Free cancellation': 'fc', 'Free cancellation, breakfast included': 'fcb', 'Non-refundable, breakfast included': 'nrb'
};
const planNamed = (name: string, nightly: number): RatePlan => {
  const id = PLAN_ID[name] ?? 'nr';
  return { id, name, nightly, refundable: id === 'fc' || id === 'fcb', breakfast: id === 'fcb' || id === 'nrb' };
};
const ROOM_KIND: Record<string, { beds: string; size: string }> = {
  'Double Room': { beds: '1 double bed', size: '18 m²' }, 'Twin Room': { beds: '2 single beds', size: '19 m²' },
  'Family Room': { beds: '1 double bed and 2 single beds', size: '30 m²' }, 'Classic Double': { beds: '1 double bed', size: '18 m²' },
  'Deluxe Double': { beds: '1 king bed', size: '24 m²' }, 'Triple Room': { beds: '1 double bed and 1 single bed', size: '24 m²' },
  'One-bedroom Apartment': { beds: '1 double bed and a sofa bed', size: '45 m²' }, 'Two-bedroom Apartment': { beds: '1 double bed, 2 single beds and a sofa bed', size: '70 m²' },
  'Studio': { beds: '1 double bed', size: '26 m²' }, 'One-bedroom Suite': { beds: '1 king bed and a sofa bed', size: '42 m²' },
  'Garden Double': { beds: '1 king bed', size: '28 m²' }, 'Pool View Double': { beds: '1 king bed', size: '30 m²' }, 'Family Suite': { beds: '1 king bed and a sofa bed for two', size: '48 m²' }
};
const KITCHEN_TYPES = ['Apartment', 'Aparthotel'];
const wholeCents = (d: number) => Math.round(d) * 100;

function rulesRooms(c: CatHotel, poolStart: number): Room[] {
  const rule = CAT.roomRules.find((r) => r.type === c.type);
  const breakfastOk = !KITCHEN_TYPES.includes(c.type) || c.amenities.includes('Breakfast available');
  const bfast = CAT.breakfast[c.city] ?? 2400;
  return (rule?.rooms ?? ['Double Room']).map((spec, i) => {
    const [name, ...rest] = spec.split(',').map((x) => x.trim());
    const sleeps = +(rest.find((x) => x.startsWith('sleeps'))?.replace('sleeps ', '') ?? 2);
    const pct = +(rest.find((x) => x.endsWith('%'))?.replace(/[+%]/g, '') ?? 0);
    const base = Math.round(c.nightly / 100 * (1 + pct / 100));
    const plans = [planNamed('Non-refundable', wholeCents(base)), planNamed('Free cancellation', wholeCents(base * 1.1))];
    if (breakfastOk) plans.push(planNamed('Free cancellation, breakfast included', wholeCents(base * 1.1) + bfast));
    const kind = ROOM_KIND[name] ?? { beds: '1 double bed', size: '20 m²' };
    const p1 = POOL_ROOMS[(poolStart + i * 3) % POOL_ROOMS.length].name, p2 = POOL_SHARED[(poolStart + i) % POOL_SHARED.length].name;
    return {
      id: slugify(name), name, beds: kind.beds, sleeps, size: kind.size, spec: `${kind.beds}, sleeps ${sleeps}`,
      nightly: plans[0].nightly, refundable: false, breakfast: false, photos: [p1, p2], plans
    };
  });
}

function catRooms(c: CatHotel, poolStart: number): Room[] {
  return (c.rooms ?? []).map((r, i) => {
    const plans = r.plans.map((p) => planNamed(p.plan, p.nightly)).sort((a, b) => a.nightly - b.nightly);
    const v = r.view ? r.view.charAt(0).toLowerCase() + r.view.slice(1) : '';
    const view = v ? (/view/.test(v) ? v : `${v} view`) : undefined;
    return {
      id: slugify(r.name), name: r.name, beds: r.beds, sleeps: r.sleeps, size: r.size, view, amenities: r.amenities,
      spec: `${r.beds}, sleeps ${r.sleeps}${view ? `, ${view}` : ''}`,
      nightly: plans[0].nightly, refundable: plans[0].refundable, breakfast: plans[0].breakfast,
      photos: [POOL_ROOMS[(poolStart + i * 3) % POOL_ROOMS.length].name, POOL_SHARED[(poolStart + i) % POOL_SHARED.length].name], plans
    };
  });
}

function defaultPolicies(c: CatHotel): { title: string; body: string }[] {
  const apt = KITCHEN_TYPES.includes(c.type);
  const pets = c.amenities.includes('Pets allowed');
  const access = c.amenities.includes('Step-free entrance') && c.amenities.includes('Accessible rooms');
  const rule = (t: string) => CAT.defaultRules.find((r) => r.title === t)?.body ?? '';
  /* "Main sentence. (Apartments: other sentence.)" picks the main or the bracketed variant */
  const variant = (body: string, alt: boolean) => {
    const m = /^(.*?)\s*\((?:Apartments|Where the list has[^:]*):\s*(.*)\)\s*$/.exec(body);
    return m ? (alt ? m[2] : m[1]) : body;
  };
  return [
    { title: 'Cancellation', body: 'Free cancellation until 23:59 hotel time three days before check-in on rates that say so. Non-refundable rates can’t be refunded from the moment you book.' },
    { title: 'Payment', body: rule('Payment') },
    { title: 'Children and extra beds', body: variant(rule('Children'), apt) },
    { title: 'Pets', body: variant(rule('Pets'), pets) },
    { title: 'Quiet hours', body: rule('Quiet hours') },
    { title: 'Accessibility', body: variant(rule('Accessibility'), access) }
  ].filter((p) => p.body);
}

function positionFor(id: string, city: string, km: number): [number, number] {
  const c = CITY_CENTRE[city] ?? [0, 0];
  const b = (hash(id) % 360) * Math.PI / 180;
  const r3 = (n: number) => Math.round(n * 1000) / 1000;
  return [r3(c[0] + (km * Math.cos(b)) / 111), r3(c[1] + (km * Math.sin(b)) / (111 * Math.cos(c[0] * Math.PI / 180)))];
}

/* ===== Review pool for the non-showcase hotels (catalogue section 4) =====
   6 snippets: 4 from the hotel's band, 1 from the band above and 1 below (Fair: 5 plus 1 Good),
   only where the snippet's Fits tag is true, seeded by the hotel id, months Oct 2026 back to May 2026.
   Category scores follow the catalogue's rule from the overall score. */
const BANDS = ['Exceptional', 'Excellent', 'Very good', 'Good', 'Fair'];
type PoolRow = Record<string, string>;
function poolFor(band: string): PoolRow[] {
  const key = Object.keys(CAT.sections).find((k) => k.startsWith('4.') && k.includes('/ ' + band + ' ('));
  const t = key ? CAT.sections[key].find((x) => typeof x === 'object') as { table: PoolRow[] } | undefined : undefined;
  return t ? t.table : [];
}
function fits(tag: string, c: CatHotel): boolean {
  const a = c.amenities;
  switch (tag.trim()) {
    case 'breakfast': return a.includes('Breakfast available');
    case 'kitchen': return a.includes('Kitchen');
    case 'pool': return a.some((x) => /pool/i.test(x));
    case 'family': return a.includes('Family rooms');
    case 'beach': return a.includes('Beach access');
    case 'bar': return a.includes('Bar') || a.includes('Rooftop bar');
    case 'self check-in': return a.includes('Self check-in');
    case 'central': return c.fromCentre < 1.5;
    case 'far': return c.fromCentre >= 3;
    case 'budget': return c.band === 'Budget';
    case 'luxury': return c.band === 'Luxury';
    default: return true;
  }
}
const MONTHS6 = ['Oct 2026', 'Sep 2026', 'Aug 2026', 'Jul 2026', 'Jun 2026', 'May 2026'];
function pooledReviews(c: CatHotel): CatReview[] {
  const word = c.scoreWord || scoreWord(c.score);
  const i = Math.max(0, BANDS.indexOf(word));
  const plan: [string, number][] = word === 'Fair' ? [['Fair', 5], ['Good', 1]]
    : [[BANDS[i], 4], ...(BANDS[i - 1] ? [[BANDS[i - 1], 1] as [string, number]] : []), ...(BANDS[i + 1] ? [[BANDS[i + 1], 1] as [string, number]] : [])];
  const need = 6;
  const out: PoolRow[] = [];
  for (const [band, n] of plan) {
    const rows = poolFor(band).filter((r) => (r['Fits'] || 'any').split(',').every((t) => fits(t, c)));
    const start = hash(c.id + band) % Math.max(1, rows.length);
    for (let k = 0; k < rows.length && out.filter((x) => x.__band === band).length < n; k++) {
      const r = rows[(start + k) % rows.length];
      if (!out.includes(r)) out.push(Object.assign(r, { __band: band }));
    }
  }
  /* top up from the hotel's own band if a Fits tag left a gap */
  for (const r of poolFor(BANDS[i])) { if (out.length >= need) break; if (!out.includes(r)) out.push(r); }
  return out.slice(0, need).map((r, k) => ({ name: r['Name'], country: r['Country'], trip: r['Trip'], month: MONTHS6[k], score: +r['Score'], title: r['Title'], text: r['Snippet'] }));
}
function pooledCategories(c: CatHotel): Record<string, number> {
  const cap = (n: number) => Math.min(10, Math.round(n * 10) / 10);
  const loc = c.fromCentre < 1.5 ? 0.4 : c.fromCentre >= 3 ? -0.4 : 0;
  const val = c.band === 'Budget' ? 0.3 : c.band === 'Luxury' ? -0.5 : 0;
  return { Cleanliness: cap(c.score + 0.2), Comfort: cap(c.score - 0.1), Location: cap(c.score + loc), Staff: cap(c.score + 0.2), Value: cap(c.score + val), Wifi: cap(c.score) };
}

function mergeRules(base: { title: string; body: string }[], rules: { title: string; body: string }[]) {
  const map: Record<string, string> = { Children: 'Children and extra beds' };
  const out = base.map((p) => ({ ...p }));
  for (const r of rules) {
    const title = map[r.title] ?? r.title;
    const i = out.findIndex((p) => p.title === title);
    if (i >= 0) out[i] = { title, body: r.body }; else out.push({ title, body: r.body });
  }
  return out;
}

/* the first outside photo of the water, else the first outside one (as parts.tsx leadIndex) */
function leadIndexOf(photos: HotelPhoto[]): number {
  const view = photos.findIndex((p) => p.cat === 'Outside' && /river|water|view|harbou?r|canal|sea|bay/i.test(p.caption));
  return view >= 0 ? view : Math.max(0, photos.findIndex((p) => p.cat === 'Outside'));
}

function buildHotels(): Hotel[] {
  const out: Hotel[] = [];
  let pool = 0;
  for (const city of CAT.hotelCities) {
    const rows = CAT.hotels.filter((c) => c.city === city.slug);
    const usedLeads = new Set<string>();
    const cityPhotos = CITY_PHOTOS[city.slug] ?? [];
    let cityPhoto = 0;
    for (const c of rows) {
      const base = BASE.find((b) => b.id === c.id);
      const common = {
        type: c.type, score: c.score, scoreWord: c.scoreWord || scoreWord(c.score), reviews: c.reviews, fromCentre: c.fromCentre, band: c.band,
        showcase: c.showcase, highlights: c.highlights, nearby: c.nearby, breakfastPrice: c.breakfastPrice,
        categories: c.categories ?? pooledCategories(c), reviewList: c.reviewList?.length ? c.reviewList : pooledReviews(c)
      };
      if (base) {
        /* original hotel: keep everything, add the catalogue's fields, rate plans and new rooms */
        const rooms: Room[] = base.rooms.map((r) => {
          const cr = c.rooms?.find((x) => x.name === r.name);
          const own = planNamed(r.refundable ? (r.breakfast ? 'Free cancellation, breakfast included' : 'Free cancellation') : (r.breakfast ? 'Non-refundable, breakfast included' : 'Non-refundable'), r.nightly);
          const plans = cr ? cr.plans.map((p) => planNamed(p.plan, p.nightly)).sort((a, b) => a.nightly - b.nightly) : [own];
          if (!cr && !r.refundable) plans.push(planNamed(r.breakfast ? 'Free cancellation, breakfast included' : 'Free cancellation', wholeCents(r.nightly / 100 * 1.1)));
          return { ...r, size: cr?.size, amenities: cr?.amenities, plans };
        });
        const extra = c.rooms ? catRooms({ ...c, rooms: c.rooms.filter((x) => !base.rooms.some((r) => r.name === x.name)) }, pool) : [];
        extra.forEach((r) => { r.photos = [...base.rooms[base.rooms.length - 1].photos]; });
        const lead = leadIndexOf(base.photos);
        usedLeads.add(base.photos[lead].name);
        out.push({
          ...base, ...common, rooms: [...rooms, ...extra], lead,
          amenities: c.amenities.length ? c.amenities : base.amenities,
          aboutMore: c.about?.slice(1),
          policies: c.rules?.length ? mergeRules(base.policies, c.rules) : base.policies
        });
        continue;
      }
      /* new hotel: photos from the pool, the lead unused by any other hotel in this city */
      let leadPhoto = cityPhotos[cityPhoto] && !usedLeads.has(cityPhotos[cityPhoto].name) ? cityPhotos[cityPhoto++] : null;
      while (!leadPhoto || usedLeads.has(leadPhoto.name)) leadPhoto = POOL_ROOMS[pool++ % POOL_ROOMS.length];
      const lp = leadPhoto;
      usedLeads.add(lp.name);
      const rooms = c.rooms?.length ? catRooms(c, pool) : rulesRooms(c, pool);
      pool += 1;
      const shared = POOL_SHARED[pool % POOL_SHARED.length];
      const isCityPhoto = !lp.name.startsWith('hotels/');
      const photos: HotelPhoto[] = [
        { name: lp.name, cat: (isCityPhoto ? 'Outside' : 'Rooms') as PhotoCat, caption: lp.caption },
        ...rooms.map((r) => ({ name: r.photos[0], cat: 'Rooms' as PhotoCat, caption: r.name })),
        { name: shared.name, cat: 'Inside' as PhotoCat, caption: shared.caption },
        ...(cityPhotos.length && !isCityPhoto ? [{ name: cityPhotos[0].name, cat: 'Outside' as PhotoCat, caption: cityPhotos[0].caption }] : [])
      ].filter((p, i, a) => a.findIndex((x) => x.name === p.name) === i);
      const [lat, lon] = positionFor(c.id, c.city, c.fromCentre);
      const cityRow = CAT.cities.find((x) => x.slug === c.city);
      out.push({
        id: c.id, name: c.name, city: c.city, area: c.area, country: cityRow?.country ?? '', stars: c.stars, lat, lon,
        card: c.blurb, about: c.about?.[0] ?? c.blurb, aboutMore: c.about?.slice(1),
        cardAmenities: c.amenities.slice(0, 3).map((a) => (a === 'Breakfast available' ? 'Breakfast' : a)), amenities: c.amenities,
        photos, rooms, checkIn: c.checkIn, checkOut: c.checkOut, address: `${c.area}, ${cityRow?.name ?? ''}, ${cityRow?.country ?? ''}`,
        policies: c.rules?.length ? mergeRules(defaultPolicies(c).filter((p) => p.title === 'Cancellation'), c.rules) : defaultPolicies(c),
        ...common, lead: 0
      });
    }
  }
  /* any original hotel the catalogue has not reached yet stays as it was */
  for (const b of BASE) if (!out.some((h) => h.id === b.id)) out.push({ ...b, lead: leadIndexOf(b.photos) });
  return out;
}


/* The city centre each search measures "Closest to the center" from, and where the map centres */
export const CITY_CENTRE: Record<string, [number, number]> = {
  lisbon: [38.7107, -9.1365], rome: [41.8986, 12.4769], /* catalogue note 5: Tokyo Station and Times Square */ tokyo: [35.6812, 139.7671], 'new-york': [40.758, -73.9855],
  paris: [48.8566, 2.3522], barcelona: [41.3874, 2.1686], amsterdam: [52.3676, 4.9041], 'mexico-city': [19.4326, -99.1332],
  'cape-town': [-33.9249, 18.4241], sydney: [-33.8688, 151.2093],
  /* round 3: the catalogue's centre points (Singapore City Hall, Marrakech Jemaa el-Fna) */
  singapore: [1.2931, 103.852], marrakech: [31.6258, -7.9891]
};

/* every hotel in the catalogue (96 once it is complete), the original eight first in their cities */
export const HOTELS: Hotel[] = buildHotels();

export const hotelById = (id: string) => HOTELS.find((h) => h.id === id);
export const cityById = (id: string) => CITIES.find((c) => c.id === id);
export const roomById = (h: Hotel, id: string) => h.rooms.find((r) => r.id === id);

/* ===== Search ===== */
export type StaySearch = { place: string; checkin: string; checkout: string; adults: number; children: number; rooms: number };
type Params = Record<string, string | string[] | undefined>;
const one = (q: Params, k: string) => { const v = q[k]; return Array.isArray(v) ? v[0] : v; };
const int = (v: string | undefined, min: number, max: number, d: number) => { const n = parseInt(v ?? '', 10); return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : d; };

const DEMO_CHECKIN = '2026-11-20';
function todayIso(): string { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

export function parseStaySearch(q: Params, placeOverride?: string): { search: StaySearch; complete: boolean } | null {
  const place = placeOverride || one(q, 'place') || '';
  /* round 3: a property type link may come with no place (Browse by property type) */
  const anyPlace = !place && !!one(q, 'type');
  if (!anyPlace && !cityById(place)) return null;
  let checkin = one(q, 'checkin') || '', checkout = one(q, 'checkout') || '';
  let complete = true;
  const t = todayIso();
  if (!fromIso(checkin) || checkin < t) { checkin = addIsoDays(t, 7) <= DEMO_CHECKIN ? DEMO_CHECKIN : addIsoDays(t, 10); checkout = addIsoDays(checkin, 4); complete = false; }
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
/* three days before check-in; for a stay that starts sooner, the day before check-in (never a day already past) */
export function freeCancelUntil(s: StaySearch, now = new Date()): string {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const three = addIsoDays(s.checkin, -3), one = addIsoDays(s.checkin, -1);
  return three >= today ? three : one >= today ? one : today;
}

/* Terrace Suite is held back for stays over five nights: the demo's sold-out room (Landfall shows it as "No longer available for your dates") */
export function roomAvailable(h: Hotel, r: Room, s: StaySearch): boolean {
  if (r.sleeps < perRoom(s)) return false;
  return !(h.id === 'casa-lanterna' && r.id === 'terrace-suite' && nightsOf(s) > 5);
}
export const roomFits = (r: Room, s: StaySearch) => r.sleeps >= perRoom(s);

export type StayAmounts = { room: number; tax: number; total: number; nightly: number };
/* totals include taxes and fees; the split is copy.md's demo ($744.00 = $640.00 + $104.00) */
/* Lower rates (content/mock-catalogue.md section 5): 18 hotels take a lower rate on every room and plan
   when the whole stay falls inside the rate's window. The homepage deals (lib/mock/home.ts) read the same
   table, so a deal's price is the price on results, the hotel page, the guest form and checkout.
   - weekend: every night is a Friday or Saturday night
   - weeknight: every night is Sunday to Thursday, within the next 30 days
   - long: 4 nights or more, checking in within the next 60 days
   - month: every night is in next calendar month */
export type RateKind = 'weekend' | 'weeknight' | 'long' | 'month';
export const LOWER_RATES: Record<string, { kind: RateKind; pct: number }> = {
  'hotel-sal-e-vela': { kind: 'weekend', pct: 15 }, 'sete-janelas-apartments': { kind: 'long', pct: 12 },
  'palazzo-lucerna': { kind: 'weeknight', pct: 18 }, 'villa-merula': { kind: 'month', pct: 10 },
  'maison-verriere': { kind: 'weekend', pct: 14 }, 'hotel-bleu-ardoise': { kind: 'weeknight', pct: 12 },
  'mar-blava-resort': { kind: 'long', pct: 20 }, 'hotel-llum-del-born': { kind: 'weekend', pct: 12 },
  'hotel-spiegelbeeld': { kind: 'weeknight', pct: 16 }, 'the-ninefold': { kind: 'weekend', pct: 18 },
  'the-wendover-residences': { kind: 'long', pct: 15 }, 'hotel-ahuehuete': { kind: 'weekend', pct: 20 },
  'hotel-kasumi-otemachi': { kind: 'weekend', pct: 12 }, 'shiokaze-resort-odaiba': { kind: 'weeknight', pct: 15 },
  'hotel-laut-biru': { kind: 'month', pct: 10 }, 'the-quayline': { kind: 'weeknight', pct: 12 },
  'the-kelpwater': { kind: 'long', pct: 15 }, 'resort-bustan-nakhla': { kind: 'month', pct: 18 }
};
const dayOf = (iso: string) => { const d = fromIso(iso); return d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null; };
/* the lower-rate share (0 to 100) a stay at this hotel gets on these dates */
export function stayPct(hotelId: string, s: { checkin: string; checkout: string }, now = new Date()): number {
  const rate = LOWER_RATES[hotelId];
  const a = dayOf(s.checkin), b = dayOf(s.checkout);
  if (!rate || !a || !b || b <= a) return 0;
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nights: Date[] = [];
  for (let d = a; d < b; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) nights.push(d);
  const within = (n: number) => nights.every((d) => d.getTime() - base.getTime() <= n * 864e5);
  const ok = rate.kind === 'weekend' ? nights.every((d) => d.getDay() === 5 || d.getDay() === 6)
    : rate.kind === 'weeknight' ? nights.every((d) => d.getDay() <= 4) && within(30)
    : rate.kind === 'long' ? nights.length >= 4 && a.getTime() - base.getTime() <= 60 * 864e5
    : nights.every((d) => d.getFullYear() * 12 + d.getMonth() === base.getFullYear() * 12 + base.getMonth() + 1);
  return ok ? rate.pct : 0;
}
/* a nightly in cents at the lower rate, in whole dollars (the homepage rounds the same way) */
export const lowerNightly = (cents: number, pct: number) => (pct ? Math.round(cents / 100 * (1 - pct / 100)) * 100 : cents);
const hotelOfRoom = (r: Room) => HOTELS.find((h) => h.rooms.includes(r) || h.rooms.some((x) => x.id === r.id && x.nightly === r.nightly && x.name === r.name));
/* a room's rate plan by id, or its default plan; with a search, at the price for those dates */
export function planOf(r: Room, id?: string | null, s?: { checkin: string; checkout: string } | null): RatePlan {
  const own: RatePlan = { id: r.refundable ? (r.breakfast ? 'fcb' : 'fc') : (r.breakfast ? 'nrb' : 'nr'), name: '', nightly: r.nightly, refundable: r.refundable, breakfast: r.breakfast };
  const p = (id && r.plans?.find((p) => p.id === id)) || r.plans?.find((p) => p.nightly === r.nightly && p.refundable === r.refundable) || r.plans?.[0] || own;
  return s ? ratedPlan(r, p, s) : p;
}
/* one plan at the price for the search's dates */
export function ratedPlan(r: Room, p: RatePlan, s?: { checkin: string; checkout: string } | null): RatePlan {
  const h = s ? hotelOfRoom(r) : undefined;
  const pct = h && s ? stayPct(h.id, s) : 0;
  return pct ? { ...p, nightly: lowerNightly(p.nightly, pct) } : p;
}
/* every plan of a room at the price for the search's dates */
export const plansFor = (r: Room, s?: { checkin: string; checkout: string } | null): RatePlan[] => (r.plans?.length ? r.plans : [planOf(r)]).map((p) => ratedPlan(r, p, s));
export const isPlan = (v: unknown): v is PlanId => v === 'nr' || v === 'fc' || v === 'fcb' || v === 'nrb';

export function stayTotals(r: Room, s: StaySearch, plan?: string | null): StayAmounts {
  const nightly = (plan ? planOf(r, plan, s) : ratedPlan(r, { ...planOf(r), nightly: r.nightly }, s)).nightly * s.rooms;
  const total = nightly * nightsOf(s);
  const tax = Math.round(total * 104 / 744);
  return { room: total - tax, tax, total, nightly };
}

export type StayResult = { hotel: Hotel; room: Room; amounts: StayAmounts; freeCancel: boolean; breakfast: boolean; distance: number };

function km(a: [number, number], b: [number, number]): number {
  const r = Math.PI / 180;
  const h = Math.sin(((b[0] - a[0]) * r) / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(((b[1] - a[1]) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/* place '' searches every city (a property type link with no place) */
export function searchStays(s: StaySearch): StayResult[] {
  return HOTELS.filter((h) => !s.place || h.city === s.place).flatMap((h) => {
    const rooms = h.rooms.filter((r) => roomAvailable(h, r, s)).sort((a, b) => a.nightly - b.nightly);
    if (!rooms.length) return [];
    const room = rooms[0];
    return [{ hotel: h, room, amounts: stayTotals(room, s), freeCancel: room.refundable, breakfast: room.breakfast, distance: h.fromCentre ?? km(CITY_CENTRE[h.city], [h.lat, h.lon]) }];
  });
}

/* the browser keeps the guest form under this key between the form and checkout (lib/store.ts drafts) */
export function stayDraftKey(hotel: string, room: string, s: StaySearch): string {
  return `stay:${hotel}:${room}:${s.checkin}:${s.checkout}:${s.adults}:${s.children}:${s.rooms}`;
}

/* ===== Round 3: hotel FAQs and airports, answered only from the hotel's own catalogue data =====
   The catalogue has no FAQ lists, so each answer is built from facts it does give: check-in and
   check-out times, the amenity list, the rate plans and the house rules. No new facts. */
export type HotelFaq = { id: string; q: string; a: string };
export function hotelFaqs(h: Hotel): HotelFaq[] {
  const has = (a: string) => h.amenities.includes(a);
  const plans = h.rooms.flatMap((r) => r.plans ?? []);
  const rule = (t: string) => h.policies.find((p) => p.title === t)?.body;
  const out: HotelFaq[] = [
    { id: 'check-in', q: 'What time are check-in and check-out?', a: `Check-in is from ${h.checkIn} and check-out is until ${h.checkOut}.` }
  ];
  const bfastPlans = plans.some((p) => p.breakfast), roomOnly = plans.some((p) => !p.breakfast);
  if (has('Breakfast available') || bfastPlans) out.push({ id: 'breakfast', q: 'Is breakfast included?', a: !roomOnly ? 'Yes, every rate at this hotel includes breakfast.' : 'On rates that say "breakfast included". Each room lists what its rate includes.' });
  else out.push({ id: 'breakfast', q: 'Is breakfast included?', a: has('Kitchen') ? 'No. Rooms here have a kitchen instead.' : 'No rate here includes breakfast.' });
  const free = plans.some((p) => p.refundable), nonref = plans.some((p) => !p.refundable);
  out.push({ id: 'cancel', q: 'Can I cancel for free?', a: free && nonref ? 'On rates marked "Free cancellation", until 23:59 hotel time three days before check-in. Non-refundable rates cost less but can’t be refunded.' : free ? 'Yes. Every rate here has free cancellation until 23:59 hotel time three days before check-in.' : 'No. Every rate here is non-refundable from the moment you book.' });
  const wifi = has('Free wifi');
  out.push({ id: 'wifi', q: 'Is there wifi?', a: wifi ? 'Yes, wifi is free throughout the hotel.' : 'The hotel doesn’t list wifi. Ask the hotel before you book.' });
  const park = has('Free parking') ? 'Yes, parking is free on site.' : has('Parking on site (paid)') ? 'Yes, there is paid parking on site.' : 'The hotel has no parking of its own.';
  out.push({ id: 'parking', q: 'Is there parking?', a: park + (has('Electric vehicle charging') ? ' Electric cars can charge there.' : '') });
  const pets = rule('Pets');
  if (pets) out.push({ id: 'pets', q: 'Are pets allowed?', a: pets });
  const pool = h.amenities.filter((a) => /pool/i.test(a));
  if (pool.length) out.push({ id: 'pool', q: 'Does the hotel have a pool?', a: `Yes: ${pool.map((x) => x.toLowerCase()).join(' and ')}.`.replace(/^Yes: (.)/, (m, c) => 'Yes: ' + c) });
  return out.slice(0, 6);
}
/* "Lisbon airport, 25 min drive" entries from the hotel's nearby list */
export function hotelAirports(h: Hotel): { place: string; minutes: number; mode: string }[] {
  return (h.nearby ?? []).filter((n) => /airport/i.test(n.place));
}
