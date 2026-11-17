/* =====================================================================
   travel-booking (working name Overwing, a placeholder): home destinations
   Mock data (content/copy.md, "Popular destinations" and the mock data
   set): the lowest return fare for one adult from London. The Lisbon
   fare matches the cheapest Lisbon offer ($824.00 for 2 adults).
   Alt texts: copy.md's, except where the sourced photo differs (copy.md
   note 12 asks for that check); those are marked and listed in
   build/progress.md for the Copywriter.
   ===================================================================== */
import { DEFAULT_ORIGIN } from '@/lib/site';

export const REGIONS = ['All', 'Europe', 'Americas', 'Asia and Pacific', 'Africa and Middle East'] as const;
export type Region = (typeof REGIONS)[number];

export type Destination = { city: string; code: string; region: Exclude<Region, 'All'>; from: string; image: string; alt: string };

export const DESTINATIONS: Destination[] = [
  { city: 'Lisbon', code: 'LIS', region: 'Europe', from: '$412', image: 'lisbon-tram-hill', alt: 'A yellow tram climbing a steep cobbled street in late afternoon light' },
  { city: 'Rome', code: 'FCO', region: 'Europe', from: '$389', image: 'rome-scooter-lane', alt: 'A person on a scooter passing ochre buildings on a narrow street' },
  { city: 'New York', code: 'JFK', region: 'Americas', from: '$684', image: 'new-york-crossing', alt: 'A pedestrian crossing a wide avenue as the low sun lines up with the street' },
  /* alt adjusted to the sourced photo (copy.md: "A cyclist under jacaranda trees in bloom on a tree-lined street") */
  { city: 'Mexico City', code: 'MEX', region: 'Americas', from: '$1,046', image: 'mexico-city-cyclist', alt: 'A cyclist passing a tiled colonial building on a city street' },
  /* alt adjusted to the sourced photo (copy.md: "A quiet side street with lanterns and a lone walker at dusk") */
  { city: 'Tokyo', code: 'HND', region: 'Asia and Pacific', from: '$1,212', image: 'tokyo-lantern-lane', alt: 'A narrow lane of lantern-lit food stalls at night' },
  { city: 'Cape Town', code: 'CPT', region: 'Africa and Middle East', from: '$1,138', image: 'cape-town-bo-kaap', alt: 'Brightly painted houses on a hillside street with a figure walking uphill' }
];

/* The whole card is one link to flight results for that city, from the default origin */
export function destinationHref(d: Destination): string {
  return `/flights?from=${DEFAULT_ORIGIN.code}&to=${d.code}`;
}
