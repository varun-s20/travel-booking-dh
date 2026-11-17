/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): the catalogue
   Typed access to content/mock-catalogue.md, parsed into catalogue.json
   by parse.mjs (rerun it when the catalogue changes). All demo data:
   every airline, hotel, room, price, deal and review is fiction.
   ===================================================================== */
import RAW from './catalogue.json';

export type CatCity = { name: string; slug: string; region: string; country: string; code: string; line: string; flightTime: string; returnFrom: number; typicalReturn: number; hotels: boolean };
export type CatAirline = { name: string; code: string; country: string; hub: string; short: string[]; long: string[]; ticketPrefix: string; cancelOnline: boolean };
export type CatFamily = { name: string; step: number; personal: string; cabin: string; checked: string; seat: string; changes: string; refunds: string };
export type CatRoom = { name: string; beds: string; size: string; sleeps: number; view: string; amenities: string[]; plans: { plan: string; nightly: number }[] };
export type CatReview = { name: string; country: string; trip: string; month: string; score: number; title: string; text: string };
export type CatHotel = {
  id: string; name: string; city: string; type: string; stars: number; area: string; fromCentre: number;
  score: number; scoreWord: string; reviews: number; nightly: number; band: string; checkIn: string; checkOut: string; showcase: boolean;
  blurb: string; highlights: string[]; amenities: string[];
  about?: string[]; rooms?: CatRoom[]; breakfastPrice?: number; categories?: Record<string, number>; reviewList?: CatReview[];
  nearby?: { place: string; minutes: number; mode: string }[]; rules?: { title: string; body: string }[]; faqs?: string[];
};
type Raw = {
  complete: boolean; cities: CatCity[]; regions: { name: string; cities: string[] }[];
  airports: { code: string; name: string; city: string; country: string }[];
  routes: Record<string, { nonstop: string[]; oneStop: { airline: string; via: string }[] }>;
  airlines: CatAirline[]; families: Record<string, CatFamily[]>; fareNote: string;
  propertyTypes: string[]; scoreWords: { min: number; word: string }[]; demoReviewsLine: string;
  bands: { name: string; range: string }[]; centers: Record<string, string>;
  ratePlans: { name: string; cancellation: string; breakfast: string }[];
  roomRules: { type: string; rooms: string[] }[]; breakfast: Record<string, number>;
  amenityGroups: { group: string; items: string[] }[]; defaultRules: { title: string; body: string }[];
  hotelCities: { slug: string; name: string; center: string }[]; hotels: CatHotel[];
  sections: Record<string, (string | { table: Record<string, string>[] })[]>;
};
export const CAT = RAW as unknown as Raw;

export const CAT_CITIES = CAT.cities;
export const catCity = (slugOrCodeOrName: string) => CAT.cities.find((c) => c.slug === slugOrCodeOrName || c.code === slugOrCodeOrName || c.name === slugOrCodeOrName);

/* The two-region merge the catalogue gives for designs with four region pills */
export function broadRegion(region: string): 'Europe' | 'Americas' | 'Asia and Pacific' | 'Africa and Middle East' {
  if (/Europe/.test(region)) return 'Europe';
  if (/America/.test(region)) return 'Americas';
  if (/Asia/.test(region)) return 'Asia and Pacific';
  return 'Africa and Middle East';
}

/* "9.1" to "Exceptional" (catalogue, Review score words) */
export function scoreWord(score: number): string {
  const w = [...CAT.scoreWords].sort((a, b) => b.min - a.min).find((x) => score >= x.min);
  return w ? w.word : 'Fair';
}
/* "Rated 9.1 out of 10, exceptional, from 1,286 reviews" */
export function scoreName(score: number, count: number): string {
  return `Rated ${score.toFixed(1)} out of 10, ${scoreWord(score).toLowerCase()}, from ${count.toLocaleString('en-US')} reviews`;
}
export const DEMO_REVIEWS_LINE = CAT.demoReviewsLine;
export const PROPERTY_TYPES = CAT.propertyTypes;
export const AMENITY_GROUPS = CAT.amenityGroups;
export const FARE_NOTE = CAT.fareNote;
