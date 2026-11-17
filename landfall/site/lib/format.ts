/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): formatting
   Money and time as content/copy.md writes them: USD with cents where a
   price is final ($1,284.60), whole dollars in "from" prices ($412);
   24-hour times (07:05); durations "2h 45m" on screen and "2 hours 45
   minutes" for screen readers. Amounts are integer cents throughout.
   ===================================================================== */
import { DAYS, MONTHS } from '@/lib/dates';

export function money(cents: number): string {
  const neg = cents < 0;
  const v = Math.abs(cents) / 100;
  const s = v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${neg ? '-' : ''}$${s}`;
}

export function dollars(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString('en-US')}`;
}

/* minutes from local midnight (may pass 1440 for the next day) to "07:05" */
export function clock(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function duration(min: number): string {
  const h = Math.floor(min / 60), m = min % 60;
  return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

export function durationLong(min: number): string {
  const h = Math.floor(min / 60), m = min % 60;
  const hs = h ? `${h} ${h === 1 ? 'hour' : 'hours'}` : '';
  const ms = m ? `${m} ${m === 1 ? 'minute' : 'minutes'}` : '';
  return [hs, ms].filter(Boolean).join(' ') || '0 minutes';
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/* ISO day "2026-11-20" to a local Date, and back */
export function fromIso(s: string | undefined | null): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getMonth() === m - 1 ? date : null;
}

/* "Fri, Nov 20" */
export function dayShort(s: string): string {
  const d = fromIso(s)!;
  return `${DAYS[d.getDay()].slice(0, 3)}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}
/* "Friday, Nov 20" for card names; "Friday, November 20, 2026" for emails and long labels */
export function dayMedium(s: string): string {
  const d = fromIso(s)!;
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}
export function dayLong(s: string): string {
  const d = fromIso(s)!;
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
/* "Nov 3, 2026" */
export function dateLine(s: string): string {
  const d = fromIso(s.slice(0, 10))!;
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}
/* "Nov 17" */
export function dayMonth(s: string): string {
  const d = fromIso(s)!;
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
}
/* "Fri, Nov 20 to Fri, Nov 27", with the year when it is not the current one ("Sat, Sep 12 to Wed, Sep 16, 2026" on past trips) */
export function dayRange(a: string, b: string | null, withYear = false): string {
  const y = withYear ? `, ${a.slice(0, 4)}` : '';
  return b ? `${dayShort(a)} to ${dayShort(b)}${y}` : `${dayShort(a)}${y}`;
}

export function addIsoDays(s: string, n: number): string {
  const d = fromIso(s)!;
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  return `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, '0')}-${String(r.getDate()).padStart(2, '0')}`;
}

export function isoNights(a: string, b: string): number {
  return Math.round((fromIso(b)!.getTime() - fromIso(a)!.getTime()) / 864e5);
}
