/* =====================================================================
   travel-booking (working name Overwing, a placeholder): the sentences
   the flight and stay pages build from data, in content/copy.md's
   patterns: meta lines, summary lines, leg lines, card names, layover
   rows. One place, so results, details, checkout, confirmation and the
   emails always say the same thing the same way.
   ===================================================================== */
import { AIRLINES, cityOf, placeName, stopsLabel, type Pax, type Slice } from '@/lib/mock/flights';
import { airport } from '@/lib/mock/geo';
import { cabinLabel, type Cabin } from '@/lib/cabins';
import { clock, dayMedium, dayRange, dayShort, duration, durationLong, isoNights, plural } from '@/lib/format';

/* "2 adults", "2 adults, 1 child", "1 adult, 1 infant" */
export function paxLine(p: Pax): string {
  const parts = [plural(p.adults, 'adult', 'adults')];
  if (p.children) parts.push(plural(p.children, 'child', 'children'));
  if (p.infants) parts.push(plural(p.infants, 'infant', 'infants'));
  return parts.join(', ');
}
export const travelersWord = (n: number) => plural(n, 'traveler', 'travelers');

export const routeTitle = (from: string, to: string) => `${cityOf(from)} to ${cityOf(to)}`;

/* "Fri, Nov 20 to Fri, Nov 27, 2 adults, Economy" */
export function flightMeta(depart: string, ret: string | null, p: Pax, cabin: Cabin): string {
  return `${dayRange(depart, ret)}, ${paxLine(p)}, ${cabinLabel(cabin)}`;
}
/* details page: "Return, Fri, Nov 20 to Fri, Nov 27, 2 adults, Economy" */
export function flightMetaTrip(depart: string, ret: string | null, p: Pax, cabin: Cabin): string {
  return `${ret ? 'Return' : 'One way'}, ${flightMeta(depart, ret, p, cabin)}`;
}

/* "nonstop", "1 stop" for side notes; "Nonstop" on cards */
export const stopsLower = (n: number) => stopsLabel(n).toLowerCase();

/* "nonstop both ways", or the outbound and return said apart */
export function stopsSummary(slices: Slice[]): string {
  if (slices.length === 2 && slices[0].stops === slices[1].stops) return `${stopsLower(slices[0].stops)} both ways`;
  return slices.map((s) => stopsLower(s.stops)).join(' out, ') + (slices.length === 2 ? ' back' : '');
}

export const nextDay = (s: Slice) => Math.floor(s.arr / 1440);

/* the airport as the timeline names it: "London Heathrow (LHR)" */
export const airportFull = (code: string) => `${airport(code)?.name ?? code} (${code})`;
/* "Gatwick (LGW)": the airport without its city, for the airport-change row */
export function airportShort(code: string): string {
  const a = airport(code);
  if (!a) return code;
  return `${a.name.startsWith(`${a.city} `) ? a.name.slice(a.city.length + 1) : a.name} (${code})`;
}

/* copy.md's card name: "Kittiwake Air. Outbound Friday, Nov 20, 07:05 from London Heathrow, arrives 09:50 Lisbon, nonstop, 2 hours 45 minutes. ..." */
export function sliceSpoken(label: string, s: Slice): string {
  const stops = s.stops ? `${stopsLower(s.stops)}, ${s.layovers.map((l) => cityOf(l.at)).join(' and ')}` : 'nonstop';
  const next = nextDay(s) > 0 ? ', arrives the next day' : '';
  return `${label} ${dayMedium(s.date)}, ${clock(s.dep)} from ${placeName(s.from)}, arrives ${clock(s.arr)} ${placeName(s.to)}${next}, ${stops}, ${durationLong(s.dur)}.`;
}
export function cardSpoken(airline: string, slices: Slice[], total: string, travelers: number): string {
  const legs = slices.map((s, i) => sliceSpoken(i === 0 ? 'Outbound' : 'Return', s)).join(' ');
  return `${AIRLINES[airline]?.name ?? airline}. ${legs} ${total} total for ${travelersWord(travelers)}.`;
}

/* timeline rows (copy.md, itinerary) */
export function layoverRow(l: { at: string; dur: number; overnight: boolean; leaveFrom?: string }): string {
  if (l.leaveFrom) return `You arrive at ${airportShort(l.at)} and leave from ${airportShort(l.leaveFrom)}. Allow time to travel between them.`;
  if (l.overnight) return `Overnight layover in ${cityOf(l.at)}. Hotel not included.`;
  return `${duration(l.dur)} in ${cityOf(l.at)} (${l.at}). Change planes.`;
}
/* "Outbound, Fri, Nov 20" and its side note "2h 45m, nonstop" */
export const legHeading = (i: number, s: Slice) => `${i === 0 ? 'Outbound' : 'Return'}, ${dayShort(s.date)}`;
export const legNote = (s: Slice) => `${duration(s.dur)}, ${stopsLower(s.stops)}`;

/* ---- stays ---- */
type Stay = { checkin: string; checkout: string; adults: number; children: number; rooms: number };
/* "2 adults, 1 room", with children when there are any */
export function guestsLine(s: Stay): string {
  return [plural(s.adults, 'adult', 'adults'), s.children ? plural(s.children, 'child', 'children') : '', plural(s.rooms, 'room', 'rooms')].filter(Boolean).join(', ');
}
/* "Fri, Nov 20 to Tue, Nov 24, 4 nights, 2 adults, 1 room" */
export function stayMeta(s: Stay): string {
  return `${dayRange(s.checkin, s.checkout)}, ${plural(isoNights(s.checkin, s.checkout), 'night', 'nights')}, ${guestsLine(s)}`;
}
