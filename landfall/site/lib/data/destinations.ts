/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): home destinations
   Mock data (content/copy.md, "Popular destinations" and the mock data
   set): the lowest return fare for one adult from London. The Lisbon
   fare matches the cheapest Lisbon offer ($824.00 for 2 adults).
   image: Landfall's own photo keys (public/images/destinations/, credits
   in public/images/credits.md). alt: landfall/content/copy.md, Popular
   destinations, for where the photo appears on its own (confirmation,
   My bookings, no-results panel); inside the home card link it is
   decorative. REGIONS stays for the data only: Landfall shows no region
   pills (copy.md, What I left out).
   ===================================================================== */
import { DEFAULT_ORIGIN } from '@/lib/site';
import { AIRPORTS } from '@/lib/data/places';

export const REGIONS = ['All', 'Europe', 'Americas', 'Asia and Pacific', 'Africa and Middle East'] as const;
export type Region = (typeof REGIONS)[number];

export type Destination = { city: string; code: string; region: Exclude<Region, 'All'>; from: string; image: string; alt: string };

export const DESTINATIONS: Destination[] = [
  { city: 'Lisbon', code: 'LIS', region: 'Europe', from: '$412', image: 'destinations/lisbon-tagus-golden', alt: "Lisbon's hillside of pale houses and red roofs falling to the wide Tagus in late golden light" },
  { city: 'Rome', code: 'FCO', region: 'Europe', from: '$389', image: 'destinations/rome-tiber-bridge', alt: 'A lit stone bridge with statues over the Tiber at dusk, its lamps reflected in the water' },
  { city: 'New York', code: 'JFK', region: 'Americas', from: '$684', image: 'destinations/new-york-brooklyn-night', alt: 'Brooklyn Bridge and the lit towers of Lower Manhattan across the East River at night' },
  { city: 'Mexico City', code: 'MEX', region: 'Americas', from: '$1,046', image: 'destinations/mexico-city-xochimilco', alt: 'A painted trajinera boat moored on a Xochimilco canal, trees reflected in the still water' },
  { city: 'Tokyo', code: 'HND', region: 'Asia and Pacific', from: '$1,212', image: 'destinations/tokyo-bridge-night', alt: 'A lit arched bridge over a Tokyo river at night, office towers behind it' },
  { city: 'Cape Town', code: 'CPT', region: 'Africa and Middle East', from: '$1,138', image: 'destinations/cape-town-camps-bay', alt: "Camps Bay's white beach and houses under the Twelve Apostles at sunset" }
];

/* The destination's own photo by airport code or city name (confirmation strip, My bookings, no results) */
export function destinationPhoto(codeOrCity: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.code === codeOrCity || d.city === codeOrCity);
}

/* Without JS the whole card is a link to flight results for that city, from the default origin */
export function destinationHref(d: Destination): string {
  return `/flights?from=${DEFAULT_ORIGIN.code}&to=${d.code}`;
}

/* Landfall's own water photos per city (public/images/credits.md), the first one that exists is the lead.
   Cities with no photo yet stay off the photo surfaces (banners, rails, tiles) and appear in the text lists. */
export const CITY_PHOTOS: Record<string, { name: string; alt: string }[]> = {
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
  CUN: [{ name: 'home/cancun-sea', alt: 'Turquoise Caribbean water over pale sand off Cancún, seen from above' }],
  GIG: [{ name: 'home/rio-sugarloaf', alt: 'Rio de Janeiro and Sugarloaf Mountain above the bay, seen from Corcovado' }],
  EZE: [{ name: 'home/buenos-aires-madero', alt: 'Towers at Puerto Madero in Buenos Aires mirrored in the dock at dusk' }],
  CPH: [{ name: 'home/copenhagen-nyhavn', alt: 'Old boats moored along the Nyhavn canal in Copenhagen, painted houses behind' }],
  KEF: [{ name: 'home/reykjavik-harpa', alt: 'Boats in Reykjavik harbour in front of the glass Harpa concert hall' }],
  DXB: [{ name: 'home/dubai-marina', alt: 'Towers of Dubai Marina over the water, boats moored below' }],
  RAK: [{ name: 'home/marrakech-riad-pool', alt: 'A long pool in the courtyard of a riad in Marrakech' }],
  NBO: [{ name: 'home/nairobi-park', alt: 'A giraffe on the grass of Nairobi National Park, the city towers on the horizon' }]
};

/* A photo for any destination card (My bookings' recent and popular searches): the city's own water
   photo, by airport code or, for a hotel search, by city name through the airport list. Cities with no
   photo yet get a neutral harbour photo, so every card keeps the same shape (own: false says so, and
   its alt stays empty: it shows no particular place). */
const NEUTRAL_PHOTO = { name: 'pages/harbour-first-light', alt: '' };
export function placePhoto(code?: string | null, city?: string | null): { name: string; alt: string; own: boolean } {
  const byCode = code ? CITY_PHOTOS[code]?.[0] ?? (destinationPhoto(code) && { name: destinationPhoto(code)!.image, alt: destinationPhoto(code)!.alt }) : undefined;
  const cityCode = !byCode && city ? AIRPORTS.find((a) => a.city === city)?.code : undefined;
  const byCity = cityCode ? CITY_PHOTOS[cityCode]?.[0] : undefined;
  const hit = byCode || byCity;
  return hit ? { ...hit, own: true } : { ...NEUTRAL_PHOTO, own: false };
}
