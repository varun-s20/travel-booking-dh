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
