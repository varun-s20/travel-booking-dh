/* =====================================================================
   Landfall server: booking emails
   The confirmation email for a flight or a stay, built from the booking
   itself in landfall/content/copy.md's patterns and drawn by the site's
   email renderer (components/flights/email.ts), plus a plain-text part.
   The link opens My bookings for an account, or the confirmation page
   with the booking's guest key for a booking made signed out.
   ===================================================================== */
import 'server-only';
import { appOrigin } from '@/server/env';
import { guestKeyFor } from '@/server/crypto';
import { bookingById, documentsFor, paymentFor } from '@/server/bookings/store';
import { toView } from '@/server/bookings/view';
import { sendEmail } from '@/server/email/send';
import { renderEmail } from '@/components/flights/email';
import { EMAIL_FOOTER, type EmailBlock, type EmailContent } from '@/lib/emails';
import { PALETTE } from '@/lib/palette';
import { clock, dayLong, dayShort, money, plural, isoNights } from '@/lib/format';
import { airlineName, cityOf, placeName, registerDict } from '@/lib/travel/registry';
import type { FlightBooking, StayBooking } from '@/lib/travel/bookings';
import type { Slice } from '@/lib/travel/flights';

const stopsText = (n: number) => (n === 0 ? 'nonstop' : n === 1 ? '1 stop' : `${n} stops`);
function legLine(s: Slice): string {
  const flights = s.segments.map((g) => g.flight).join(', ');
  const carriers = [...new Set(s.segments.map((g) => airlineName(g.airline)))].join(' and ');
  const op = [...new Set(s.segments.filter((g) => g.operatedBy).map((g) => airlineName(g.operatedBy!)))];
  const next = Math.floor(s.arr / 1440) > 0 ? ' (next day)' : '';
  return `${dayLong(s.date)}, ${clock(s.dep)} ${placeName(s.from)} to ${clock(s.arr)} ${placeName(s.to)}${next}, ${carriers} ${flights}, ${stopsText(s.stops)}.${op.length ? ` Operated by ${op.join(' and ')}.` : ''}`;
}
const paidLine = (total: number, card: { brand: string; last4: string } | null) =>
  `Total paid ${money(total)}, taxes and fees included${card ? `, with ${card.brand} ending ${card.last4}` : ''}`;
const testNote = 'Test booking: this was made in test mode, so no real ticket or room was booked and no real money was taken.';

function flightContent(b: FlightBooking, link: string): EmailContent {
  const city = cityOf(b.to);
  const lead = b.travelers.find((t) => t.lead) ?? b.travelers[0];
  const first = lead?.name.split(' ')[0] ?? '';
  const travelers = b.travelers.map((t) => `${t.name}${t.ticket ? `, e-ticket ${t.ticket}` : ''}`).join('; ');
  const block: EmailBlock = {
    h1: `You’re going to ${city}${first ? `, ${first}` : ''}`, ref: b.ref,
    intro: b.testMode ? [testNote] : undefined,
    rows: [
      ...b.slices.map((s, i): [string, string] => [i === 0 ? 'Outbound' : 'Return', legLine(s)]),
      ['Travelers', travelers + (b.ticketsPending ? '. The airline is issuing your e-tickets; we’ll email you when they’re ready.' : '')],
      ['Fare', `${b.fareName}.${b.conditions?.change ? ` Changes: ${b.conditions.change}.` : ''}${b.conditions?.refund ? ` Refunds: ${b.conditions.refund}.` : ''}`],
      ...(b.supplierReference ? [['Airline reference', b.supplierReference] as [string, string]] : []),
      ['Paid', paidLine(b.amounts.total, b.card)]
    ],
    paras: [`Before you fly: check in with ${airlineName(b.airline)} online before you go${b.supplierReference ? `, using airline reference ${b.supplierReference}` : ''}. Bring the passport or ID you entered for each traveler.`],
    button: { label: 'View your booking', href: link }
  };
  return {
    id: 'flight-confirmed', subject: `You’re going to ${city} on ${dayShort(b.depart)}`,
    preview: `Booking reference ${b.ref}. Your flights, travelers and e-ticket numbers are inside.`,
    group: 'Bookings', block, support: EMAIL_FOOTER.support, reason: EMAIL_FOOTER.reason
  };
}

function stayContent(b: StayBooking, link: string): EmailContent {
  const nights = isoNights(b.search.checkin, b.search.checkout);
  const first = b.guests[0]?.split(' ')[0] ?? '';
  const where = [b.stay.name, b.stay.area, b.stay.cityName, b.stay.country].filter(Boolean).join(', ');
  const block: EmailBlock = {
    h1: `You’re staying at ${b.stay.name}${first ? `, ${first}` : ''}`, ref: b.ref,
    intro: b.testMode ? [testNote] : undefined,
    rows: [
      ['Stay', `${where}. ${b.roomName}${b.board ? `, ${b.board.toLowerCase()}` : ''}, ${plural(b.search.adults, 'adult', 'adults')}${b.search.children ? `, ${plural(b.search.children, 'child', 'children')}` : ''}.`],
      ['Check in', `${dayLong(b.search.checkin)}${b.stay.checkIn ? `, from ${b.stay.checkIn}` : ''}.`],
      ['Check out', `${dayLong(b.search.checkout)}${b.stay.checkOut ? `, until ${b.stay.checkOut}` : ''}. ${plural(nights, 'night', 'nights')}.`],
      ...(b.supplierReference ? [['Hotel confirmation', b.supplierReference] as [string, string]] : []),
      ['Paid', paidLine(b.amounts.total, b.card)],
      ['Cancellation', b.freeCancelUntil ? `Free cancellation until ${dayLong(b.freeCancelUntil)}. After that, this booking can’t be refunded.` : 'This rate is non-refundable.']
    ],
    paras: [
      ...(b.payAtHotel ? [`To pay at the hotel: ${b.payAtHotel.currency} ${(b.payAtHotel.amount / 100).toFixed(2)} in local taxes or fees.`] : []),
      ...(b.stay.keyCollection ? [`Key collection: ${b.stay.keyCollection}`] : [])
    ],
    button: { label: 'View your booking', href: link }
  };
  return {
    id: 'hotel-confirmed', subject: `You’re staying at ${b.stay.name}, ${b.stay.cityName}, from ${dayShort(b.search.checkin)}`,
    preview: `Booking reference ${b.ref}.${b.stay.checkIn ? ` Check-in from ${b.stay.checkIn} on ${dayLong(b.search.checkin)}.` : ''}`,
    group: 'Bookings', block, support: EMAIL_FOOTER.support, reason: EMAIL_FOOTER.reason
  };
}

export function emailText(e: EmailContent): string {
  const b = e.block;
  return [
    b.h1, b.ref ? `Booking reference: ${b.ref}` : '', ...(b.intro ?? []),
    ...(b.rows ?? []).map(([k, v]) => `${k}: ${v}`), ...(b.paras ?? []),
    `${b.button.label}: ${b.button.href}`, '', e.support, e.reason
  ].filter((x) => x !== undefined).join('\n\n');
}

export async function sendBookingConfirmation(bookingId: string): Promise<void> {
  const b = await bookingById(bookingId);
  if (!b || b.status !== 'confirmed') return;
  const [pay, docs] = await Promise.all([paymentFor(b.id), documentsFor(b.id)]);
  const view = toView(b, pay, docs);
  if (view.kind === 'flight') registerDict(view.dict);
  const origin = appOrigin();
  const link = b.user_id ? `${origin}/bookings/${b.reference}` : `${origin}/confirmation/${b.reference}?key=${guestKeyFor(b.id)}`;
  const content = view.kind === 'flight' ? flightContent(view, link) : stayContent(view, link);
  await sendEmail({
    template: 'booking_confirmed', to: b.contact_email, subject: content.subject,
    html: renderEmail(content, PALETTE), text: emailText(content), bookingId: b.id, dedupeKey: `booking_confirmed:${b.id}`
  });
}

/* sent once when e-tickets arrive after the booking was confirmed without them */
export async function sendTicketsIssued(bookingId: string): Promise<void> {
  const b = await bookingById(bookingId);
  if (!b || b.status !== 'confirmed' || b.kind !== 'flight') return;
  const [pay, docs] = await Promise.all([paymentFor(b.id), documentsFor(b.id)]);
  const view = toView(b, pay, docs);
  if (view.kind !== 'flight' || view.ticketsPending) return;
  registerDict(view.dict);
  const origin = appOrigin();
  const link = b.user_id ? `${origin}/bookings/${b.reference}` : `${origin}/confirmation/${b.reference}?key=${guestKeyFor(b.id)}`;
  const content: EmailContent = {
    id: 'tickets-issued', subject: `Your e-tickets for ${cityOf(view.to)} are ready`,
    preview: `Booking reference ${view.ref}. Your e-ticket numbers are inside.`, group: 'Bookings',
    block: {
      h1: 'Your e-tickets are ready', ref: view.ref,
      rows: view.travelers.map((t): [string, string] => [t.name, t.ticket ? `E-ticket ${t.ticket}` : 'E-ticket issued']),
      paras: [`Check in with ${airlineName(view.airline)} online before you go${view.supplierReference ? `, using airline reference ${view.supplierReference}` : ''}.`],
      button: { label: 'View your booking', href: link }
    },
    support: EMAIL_FOOTER.support, reason: EMAIL_FOOTER.reason
  };
  await sendEmail({ template: 'tickets_issued', to: b.contact_email, subject: content.subject, html: renderEmail(content, PALETTE), text: emailText(content), bookingId: b.id, dedupeKey: `tickets_issued:${b.id}` });
}

/* "Basic email notifications for relevant booking events": an airline schedule change, a cancellation */
/* eventKey: the supplier event behind a change, so each change is emailed once */
export async function sendBookingNotice(bookingId: string, kind: 'changed' | 'cancelled', eventKey = ''): Promise<void> {
  const b = await bookingById(bookingId);
  if (!b) return;
  const [pay, docs] = await Promise.all([paymentFor(b.id), documentsFor(b.id)]);
  const view = toView(b, pay, docs);
  if (view.kind === 'flight') registerDict(view.dict);
  const origin = appOrigin();
  const link = b.user_id ? `${origin}/bookings/${b.reference}` : `${origin}/confirmation/${b.reference}?key=${guestKeyFor(b.id)}`;
  const what = view.kind === 'flight' ? `your flight to ${cityOf(view.to)}` : `your stay at ${view.stay.name}`;
  const content: EmailContent = kind === 'changed'
    ? {
      id: 'booking-changed', subject: `The airline changed ${what}`, preview: `Booking reference ${view.ref}. Check the new times.`, group: 'Bookings',
      block: { h1: 'Your flight times changed', ref: view.ref, intro: [`The airline changed the schedule of ${what}. Check the new times on your booking. If they don't work for you, contact us with your booking reference and we'll go through the options the airline offers.`], button: { label: 'View your booking', href: link } },
      support: EMAIL_FOOTER.support, reason: EMAIL_FOOTER.reason
    }
    : {
      id: 'booking-cancelled', subject: `Your booking ${view.ref} is canceled`, preview: `We've canceled ${what}.`, group: 'Bookings',
      block: { h1: 'Your booking is canceled', ref: view.ref, intro: [`We've canceled ${what}. Any refund due goes back to the card you paid with; banks usually show it within 5 to 10 business days.`], button: { label: 'View your booking', href: link } },
      support: EMAIL_FOOTER.support, reason: EMAIL_FOOTER.reason
    };
  await sendEmail({ template: `booking_${kind}`, to: b.contact_email, subject: content.subject, html: renderEmail(content, PALETTE), text: emailText(content), bookingId: b.id, dedupeKey: `booking_${kind}:${b.id}:${eventKey}` });
}
