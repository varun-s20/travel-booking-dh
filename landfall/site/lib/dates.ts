/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): date helpers
   Local calendar days only (no times), as the search and calendar need.
   Formats follow content/copy.md: "Nov 20 to 27" in cells, "Fri, Nov 20"
   for one way, "Friday, November 20, 2026" for screen readers.
   ===================================================================== */
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* Duffel offers run about 11 months ahead */
export const BOOK_AHEAD_DAYS = 330;

export function today(): Date { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
export function addDays(d: Date, n: number): Date { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
export function sameDay(a: Date | null, b: Date | null): boolean { return !!(a && b) && a.getTime() === b.getTime(); }
export function iso(d: Date | null): string { return d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : ''; }
export function nights(a: Date, b: Date): number { return Math.round((b.getTime() - a.getTime()) / 864e5); }

/* "Nov 20" */
export function short(d: Date): string { return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`; }
/* "Fri, Nov 20" */
export function shortDay(d: Date): string { return `${DAYS[d.getDay()].slice(0, 3)}, ${short(d)}`; }
/* "Nov 20 to 27", or "Nov 28 to Dec 3" across months */
export function range(a: Date, b: Date): string {
  return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear() ? `${short(a)} to ${b.getDate()}` : `${short(a)} to ${short(b)}`;
}
/* "Friday, November 20, 2026" */
export function longLabel(d: Date): string { return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; }
/* "Friday, November 20" */
export function longDay(d: Date): string { return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`; }
