/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): email content
   The booking and account emails as data: subject, preview line, the
   blocks each one shows and which footer it ends with. Copy is word for
   word from landfall/content/copy.md, Email (on top of content/copy.md,
   Email, with the global swaps), with the working name from lib/site.ts.
   No markup and no colours here: components/flights/email.ts renders
   these blocks for the preview routes (app/emails/).
   Group F reworded this file for Landfall's deck (landfall/build/progress.md).
   ===================================================================== */
import { SITE } from '@/lib/site';

export type EmailBlock = {
  h1: string; ref?: string;
  intro?: string[];                 /* paragraphs between the reference and the rows */
  rows?: [string, string][];        /* label and value; the itinerary rows carry the landfall line */
  paras?: string[];                 /* paragraphs after the rows */
  button: { label: string; href: string };
};
export type EmailFooterKind = 'booking' | 'account';
export type Email = { subject: string; preview: string; group: 'Bookings' | 'Account'; footer: EmailFooterKind; build: (origin: string) => EmailBlock };

const DEMO_FLIGHTS = '/flights?from=LHR&to=LIS&depart=2026-11-20&return=2026-11-27&adults=2&children=0&infants=0&cabin=economy';
const DEMO_STAYS = '/hotels?place=lisbon&checkin=2026-11-20&checkout=2026-11-24&adults=2&children=0&rooms=1';

export const EMAILS: Record<string, Email> = {
  'flight-confirmed': {
    subject: 'You’re going to Lisbon on Fri, Nov 20',
    preview: 'Booking reference K7MQ2D. Your flights, travelers and e-ticket numbers are inside.',
    group: 'Bookings', footer: 'booking',
    build: (o) => ({
      h1: 'You’re going to Lisbon, Maya', ref: 'K7MQ2D',
      rows: [
        ['Outbound', 'Friday, November 20, 2026, 07:05 London Heathrow to 09:50 Lisbon, Kittiwake Air KT 412, nonstop.'],
        ['Return', 'Friday, November 27, 2026, 10:40 Lisbon to 13:15 London Heathrow, Kittiwake Air KT 413, nonstop.'],
        ['Travelers', 'Maya Okafor, e-ticket 910 2604 118352; Daniel Okafor, e-ticket 910 2604 118353'],
        ['Fare', 'Classic. Includes a small bag, a cabin bag and 1 checked bag of 23 kg per traveler.'],
        ['Paid', 'Total paid $1,284.60, taxes and fees included, with Visa ending 4242']
      ],
      paras: ['Before you fly: Check in with Kittiwake Air online before you go, using booking reference K7MQ2D. Bring the passport or ID you entered for each traveler.'],
      button: { label: 'View your booking', href: `${o}/bookings/K7MQ2D` }
    })
  },
  'hotel-confirmed': {
    subject: 'You’re staying at Casa Lanterna, Lisbon, from Fri, Nov 20',
    preview: 'Booking reference S4T9LW. Check-in from 15:00 on Friday, November 20.',
    group: 'Bookings', footer: 'booking',
    build: (o) => ({
      h1: 'You’re staying at Casa Lanterna, Maya', ref: 'S4T9LW',
      rows: [
        ['Stay', 'Casa Lanterna, Alfama, Lisbon, Portugal. Courtyard Double, 2 adults.'],
        ['Check in', 'Friday, November 20, 2026, from 15:00.'],
        ['Check out', 'Tuesday, November 24, 2026, until 11:00. 4 nights.'],
        ['Paid', 'Total paid $744.00, taxes and fees included, with Visa ending 4242'],
        ['Cancellation', 'Free cancellation until 23:59 hotel time on Tuesday, November 17, 2026. After that, this booking can’t be refunded.']
      ],
      button: { label: 'View your booking', href: `${o}/bookings/S4T9LW` }
    })
  },
  'tickets-issued': {
    subject: 'Your e-tickets for Lisbon are ready: K7MQ2D',
    preview: 'Kittiwake Air has issued an e-ticket number for each traveler.',
    group: 'Bookings', footer: 'booking',
    build: (o) => ({
      h1: 'Your e-tickets are ready', ref: 'K7MQ2D',
      intro: ['Kittiwake Air has issued your e-tickets for London to Lisbon on Friday, November 20, 2026. Keep these numbers with your booking reference K7MQ2D. The airline may ask for them at check-in.'],
      rows: [
        ['Maya Okafor', 'e-ticket 910 2604 118352'],
        ['Daniel Okafor', 'e-ticket 910 2604 118353']
      ],
      button: { label: 'View your booking', href: `${o}/bookings/K7MQ2D` }
    })
  },
  'flight-not-completed': {
    subject: 'Your booking to Lisbon wasn’t completed',
    preview: 'Your card has not been charged.',
    group: 'Bookings', footer: 'booking',
    build: (o) => ({
      h1: 'Your booking wasn’t completed',
      intro: ['We couldn’t complete your booking for London to Lisbon on Friday, November 20, 2026, because the airline couldn’t confirm the seats. Your card has not been charged. Fares can sell out between search and payment, so search again to see what’s available now.'],
      button: { label: 'Search again', href: `${o}${DEMO_FLIGHTS}` }
    })
  },
  'stay-not-completed': {
    subject: 'Your booking to Lisbon wasn’t completed',
    preview: 'Your card has not been charged.',
    group: 'Bookings', footer: 'booking',
    build: (o) => ({
      h1: 'Your booking wasn’t completed',
      intro: ['We couldn’t complete your booking at Casa Lanterna from Friday, November 20, 2026, because the hotel couldn’t confirm the room. Your card has not been charged. Rooms can sell out between search and payment, so search again to see what’s available now.'],
      button: { label: 'Search again', href: `${o}${DEMO_STAYS}` }
    })
  },
  'booking-canceled': {
    subject: 'Your booking K7MQ2D is canceled',
    preview: 'Your flights from London to Lisbon on Fri, Nov 20 are canceled.',
    group: 'Bookings', footer: 'booking',
    build: (o) => ({
      h1: 'Your booking is canceled', ref: 'K7MQ2D',
      intro: ['Your flights from London to Lisbon on Friday, November 20, 2026 are canceled. The airline is refunding $612.00 to your Visa ending 4242. Your bank may take several business days to show it.'],
      button: { label: 'View your booking', href: `${o}/bookings/K7MQ2D` }
    })
  },
  'flight-times-changed': {
    subject: 'Kittiwake Air changed your flight times: K7MQ2D',
    preview: 'Your outbound flight on Fri, Nov 20 now leaves at 07:40.',
    group: 'Bookings', footer: 'booking',
    build: (o) => ({
      h1: 'Your flight times have changed', ref: 'K7MQ2D',
      intro: ['Kittiwake Air has changed your outbound flight on Friday, November 20, 2026. It now leaves London Heathrow at 07:40 and lands in Lisbon at 10:25. If the new times don’t work for you, contact us with your booking reference.'],
      button: { label: 'See your booking', href: `${o}/bookings/K7MQ2D` }
    })
  },
  'reset-password': {
    subject: `Reset your ${SITE.name} password`,
    preview: 'The link works once and expires soon.',
    group: 'Account', footer: 'account',
    build: (o) => ({
      h1: 'Reset your password',
      intro: ['We got a request to reset the password for this email address. Use the button to choose a new one. The link works once and expires after a short time. If you didn’t ask for this, ignore this email and your password stays the same.'],
      button: { label: 'Choose a new password', href: `${o}/reset-password?token=K7MQ2D9X` }
    })
  },
  'password-changed': {
    subject: `Your ${SITE.name} password was changed`,
    preview: 'If this wasn’t you, reset it now.',
    group: 'Account', footer: 'account',
    build: (o) => ({
      h1: 'Your password was changed',
      intro: [`The password for your ${SITE.name} account was changed on Tuesday, November 10, 2026. If this wasn’t you, reset your password now and contact us.`],
      button: { label: 'Reset password', href: `${o}/forgot-password` }
    })
  }
};

/* The lines under every email (landfall/content/copy.md, Email, Footers): the support
   contact (booking emails ask for the reference, account emails don't), the demo notice
   and why the email came */
export const EMAIL_FOOTER = {
  support: `Questions? Call ${SITE.phone} or email ${SITE.email}. Include your booking reference.`,
  supportAccount: `Questions? Call ${SITE.phone} or email ${SITE.email}.`,
  reason: `You’re getting this email because of a booking or account on ${SITE.name}.`
} as const;

/* Escapes text for HTML; any renderer that writes these strings into markup uses it */
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export type EmailContent = { id: string; subject: string; preview: string; group: Email['group']; block: EmailBlock; support: string; reason: string };

/* One email's content for a given site origin (links are absolute), or null for an unknown id */
export function emailContent(id: string, origin: string): EmailContent | null {
  const e = EMAILS[id];
  if (!e) return null;
  return {
    id, subject: e.subject, preview: e.preview, group: e.group, block: e.build(origin),
    support: e.footer === 'account' ? EMAIL_FOOTER.supportAccount : EMAIL_FOOTER.support,
    reason: EMAIL_FOOTER.reason
  };
}
