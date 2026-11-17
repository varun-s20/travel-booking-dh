/* =====================================================================
   Landfall (working name, a placeholder): booking tools
   Round 3, Developer B (round3-spec.md B5 and B9). "Add to calendar"
   builds an .ics file in the browser from the booking (one event per
   flight leg in the airports' local times, or the stay as all-day dates
   from check-in to check-out) and downloads it; nothing goes to a server.
   "Print" opens the browser's print dialog; the print stylesheet in
   booking.css and flights.css hides the header, footer and buttons.
   ===================================================================== */
'use client';
import type { Booking } from '@/lib/travel/bookings';
import { airlineName, cityOf } from '@/lib/travel/flights';
import { toast } from '@/lib/client';
import { Button } from '@/components/ui/Button';

const pad = (n: number) => String(n).padStart(2, '0');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/* a floating local time: the date plus minutes after midnight (minutes may run past 24h) */
function stamp(iso: string, minutes: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d, 0, minutes));
  return `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}T${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}00`;
}
const dayStamp = (iso: string) => iso.replace(/-/g, '');

export function icsFor(b: Booking): string {
  const now = new Date();
  const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  const events: string[] = [];
  if (b.kind === 'flight') {
    const air = airlineName(b.airline);
    b.slices.forEach((s, i) => {
      const flights = s.segments.map((g) => g.flight).join(', ');
      events.push([
        'BEGIN:VEVENT', `UID:${b.ref}-${i}@landfall`, `DTSTAMP:${dtstamp}`,
        `DTSTART:${stamp(s.date, s.dep)}`, `DTEND:${stamp(s.date, s.arr)}`,
        `SUMMARY:${esc(`Flight ${cityOf(s.from)} to ${cityOf(s.to)}, ${flights}`)}`,
        `LOCATION:${esc(`${s.from} airport`)}`,
        `DESCRIPTION:${esc(`${air}. Booking reference ${b.ref}. Times are local to each airport.`)}`,
        'END:VEVENT'
      ].join('\r\n'));
    });
  } else {
    events.push([
      'BEGIN:VEVENT', `UID:${b.ref}@landfall`, `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${dayStamp(b.search.checkin)}`, `DTEND;VALUE=DATE:${dayStamp(b.search.checkout)}`,
      `SUMMARY:${esc(`Stay at ${b.stay.name}, ${b.stay.cityName}`)}`,
      `LOCATION:${esc(b.stay.address)}`,
      `DESCRIPTION:${esc(`${b.roomName}.${b.stay.checkIn ? ` Check-in from ${b.stay.checkIn}.` : ''}${b.stay.checkOut ? ` Check-out until ${b.stay.checkOut}.` : ''} Booking reference ${b.ref}.`)}`,
      'END:VEVENT'
    ].join('\r\n'));
  }
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Landfall//Bookings//EN', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR', ''].join('\r\n');
}

export function downloadIcs(b: Booking) {
  try {
    const blob = new Blob([icsFor(b)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landfall-${b.ref}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Calendar file downloaded');
  } catch { toast('Couldn’t make the calendar file. Try again.'); }
}

export function CalendarButton({ b }: { b: Booking }) {
  return <Button variant="ghost" icon="calendar" onClick={() => downloadIcs(b)}>Add to calendar</Button>;
}

export function PrintButton({ label = 'Print or save as PDF', receipt = false }: { label?: string; receipt?: boolean }) {
  function go() {
    if (receipt) document.body.classList.add('-receipt');
    const done = () => { document.body.classList.remove('-receipt'); window.removeEventListener('afterprint', done); };
    if (receipt) window.addEventListener('afterprint', done);
    window.print();
    if (receipt) window.setTimeout(done, 1500);
  }
  return <Button variant="ghost" icon={receipt ? 'doc' : 'download'} onClick={go}>{label}</Button>;
}
