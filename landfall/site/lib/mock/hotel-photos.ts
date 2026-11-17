/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): hotel photo pool
   Landfall's own Unsplash License stand-ins (public/images/, credits.md)
   for the 88 catalogue hotels that have no photos of their own. Keys go
   into lib/images.manifest.json. The eight original hotels keep theirs.
   - ROOMS and SHARED are interiors that read as any city.
   - CITY holds each city's own outside and water photos (the place first);
     a city with none leads with an interior.
   - leadsFor() picks each card's lead in display order so no two
     neighbouring results ever show the same photo, whatever the sort.
   Add photos here when tools/images.py cuts new ones.
   ===================================================================== */
export type PoolPhoto = { name: string; caption: string };

export const ROOMS: PoolPhoto[] = [
  { name: 'hotels/cv-double', caption: 'double room' },
  { name: 'hotels/pq-garden-double', caption: 'double room' },
  { name: 'hotels/at-double', caption: 'double room' },
  { name: 'hotels/hh-loft-king', caption: 'king room' },
  { name: 'hotels/lr-double', caption: 'double room' },
  { name: 'hotels/cv-twin', caption: 'twin room' },
  { name: 'hotels/hk-double', caption: 'double room' },
  { name: 'hotels/cl-courtyard-double', caption: 'double room' },
  { name: 'hotels/rl-stair', caption: 'loft room' },
  { name: 'hotels/at-twin', caption: 'twin room' },
  { name: 'hotels/hh-loft-double', caption: 'room with two double beds' },
  { name: 'hotels/pq-twin', caption: 'twin room' },
  { name: 'hotels/lr-triple', caption: 'triple room' },
  { name: 'hotels/rl-kitchen', caption: 'kitchen' }
];
export const SHARED: PoolPhoto[] = [
  { name: 'hotels/cl-lounge', caption: 'lounge' },
  { name: 'hotels/cv-lobby', caption: 'lobby' },
  { name: 'hotels/rl-loft', caption: 'living space' },
  { name: 'hotels/cl-bathroom', caption: 'bathroom' }
];
/* outside and water photos by city slug (the city where it meets the water) */
export const CITY: Record<string, PoolPhoto[]> = {
  lisbon: [{ name: 'destinations/lisbon-tagus-golden', caption: 'Lisbon and the Tagus nearby' }, { name: 'hero/lisbon-alfama-river', caption: 'Alfama and the river nearby' }],
  rome: [{ name: 'destinations/rome-tiber-bridge', caption: 'the Tiber nearby' }],
  'new-york': [{ name: 'destinations/new-york-brooklyn-night', caption: 'the East River nearby' }, { name: 'hero/new-york-harbour', caption: 'the harbor nearby' }],
  'mexico-city': [{ name: 'destinations/mexico-city-xochimilco', caption: 'the canals at Xochimilco' }],
  tokyo: [{ name: 'destinations/tokyo-bridge-night', caption: 'the river nearby' }],
  'cape-town': [{ name: 'destinations/cape-town-camps-bay', caption: 'Camps Bay nearby' }, { name: 'hero/cape-town-waterfront', caption: 'the waterfront nearby' }]
};

/* The lead photo for each card in the order shown: a hotel's own lead unless the card
   before it (or the one before that) shows the same photo, then its next photo. */
export function leadsFor<T extends { photos: { name: string }[]; lead?: number }>(list: T[]): number[] {
  const out: number[] = [];
  list.forEach((h, i) => {
    const order = [h.lead ?? 0, ...h.photos.map((_, k) => k).filter((k) => k !== (h.lead ?? 0))];
    const near = [out[i - 1], out[i - 2]].map((k, j) => (k === undefined ? '' : list[i - 1 - j].photos[k]?.name));
    out.push(order.find((k) => !near.includes(h.photos[k]?.name)) ?? order[0]);
  });
  return out;
}
