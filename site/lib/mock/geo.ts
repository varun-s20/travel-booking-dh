/* =====================================================================
   travel-booking (working name Overwing, a placeholder): mock geography
   For the simulated backend only: airport positions (for flight times
   and prices from distance), November time zones (local times as Duffel
   returns them), and a seeded random source so every search returns the
   same offers each time it is run.
   ===================================================================== */
import { AIRPORTS, type Airport } from '@/lib/data/places';

/* latitude, longitude, UTC offset in hours in late November (Sydney on summer time) */
export const GEO: Record<string, [number, number, number]> = {
  LHR: [51.47, -0.454, 0], LGW: [51.153, -0.182, 0], CDG: [49.01, 2.548, 1], LIS: [38.774, -9.134, 0],
  MAD: [40.498, -3.568, 1], BCN: [41.297, 2.083, 1], FCO: [41.8, 12.239, 1], AMS: [52.31, 4.768, 1],
  JFK: [40.641, -73.778, -5], LAX: [33.942, -118.408, -8], MIA: [25.796, -80.287, -5], YYZ: [43.678, -79.625, -5],
  MEX: [19.436, -99.072, -6], DXB: [25.253, 55.366, 4], SIN: [1.364, 103.992, 8], HND: [35.549, 139.78, 9],
  SYD: [-33.94, 151.175, 11], CPT: [-33.972, 18.602, 2],
  ATH: [37.936, 23.947, 2], CPH: [55.618, 12.656, 1], KEF: [63.985, -22.605, 0], CUN: [21.037, -86.877, -5],
  GIG: [-22.81, -43.25, -3], EZE: [-34.822, -58.536, -3], BKK: [13.69, 100.75, 7], RAK: [31.607, -8.036, 1],
  NBO: [-1.319, 36.928, 3]
};

export function airport(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code);
}

export function tz(code: string): number { return GEO[code]?.[2] ?? 0; }

export function distanceKm(a: string, b: string): number {
  const [la1, lo1] = GEO[a], [la2, lo2] = GEO[b];
  const r = Math.PI / 180;
  const h = Math.sin(((la2 - la1) * r) / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(((lo2 - lo1) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/* block time in minutes, to the nearest 5: about 780 km/h plus taxi and climb */
export function blockMinutes(a: string, b: string): number {
  return Math.round((distanceKm(a, b) / 780 * 60 + 35) / 5) * 5;
}

/* ---- seeded randomness (mulberry32 over a string hash) ---- */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function rng(seed: string): () => number {
  let a = hash(seed);
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(r: () => number, list: T[]): T { return list[Math.floor(r() * list.length)]; }
