/* =====================================================================
   travel-booking (working name Overwing, a placeholder): emails
   The booking and account emails (spec 2b, Email; copy word for word
   from content/copy.md, Email), as email-safe HTML: a 600px table, the
   ground outside, a white card inside, the wordmark PNG, a 22px H1, the
   reference in a cream box, the itinerary as a table, one bulletproof
   deep button, and the footer with the support contact and the
   reason line. Inline styles and Helvetica or Arial, as email clients need;
   colours are the palette's token values, written out (email has no
   custom properties). Served for review by app/emails/.
   ===================================================================== */
import type { Palette } from '@/lib/palette';
import { SITE } from '@/lib/site';

const COLOURS: Record<Palette, { ground: string; cream: string; deep: string; ink: string; muted: string; line: string }> = {
  /* revision 2026-11-11, item 35: Night navy (deep buttons, ink text, the cool cream reference box) */
  navy: { ground: '#F0F5F7', cream: '#F0F5F7', deep: '#0D2B4C', ink: '#0B1B2E', muted: '#4A5E70', line: '#DAE4E9' },
  cabin: { ground: '#F7FAFF', cream: '#E9F1FF', deep: '#1D4ED8', ink: '#0B1B3A', muted: '#4A5A78', line: '#DCE6F5' }
};

type Block = { h1: string; ref?: string; rows?: [string, string][]; paras?: string[]; button: { label: string; href: string } };
type Email = { subject: string; preview: string; build: (origin: string) => Block };

export const EMAILS: Record<string, Email> = {
  'flight-confirmed': {
    subject: 'You’re booked: London to Lisbon on Fri, Nov 20',
    preview: 'Booking reference K7MQ2D. Your flights, travelers and e-ticket numbers are inside.',
    build: (o) => ({
      h1: 'You’re booked, Maya', ref: 'K7MQ2D',
      rows: [
        ['Outbound', 'Friday, November 20, 2026, 07:05 London Heathrow to 09:50 Lisbon, Kittiwake Air KT 412, nonstop.'],
        ['Return', 'Friday, November 27, 2026, 10:40 Lisbon to 13:15 London Heathrow, Kittiwake Air KT 413, nonstop.'],
        ['Travelers', 'Maya Okafor, e-ticket 910 2604 118352; Daniel Okafor, e-ticket 910 2604 118353'],
        ['Fare', 'Classic. Includes a small bag, a cabin bag and 1 checked bag of 23 kg per traveler.'],
        ['Paid', '$1,284.60 with Visa ending 4242']
      ],
      paras: ['Before you fly: Check in with Kittiwake Air online before you go, using booking reference K7MQ2D. Bring the passport or ID you entered for each traveler.'],
      button: { label: 'View your booking', href: `${o}/bookings/K7MQ2D` }
    })
  },
  'hotel-confirmed': {
    subject: 'You’re booked: Casa Lanterna, Lisbon, from Fri, Nov 20',
    preview: 'Booking reference S4T9LW. Check-in from 15:00 on Friday, November 20.',
    build: (o) => ({
      h1: 'You’re booked, Maya', ref: 'S4T9LW',
      rows: [
        ['Stay', 'Casa Lanterna, Alfama, Lisbon, Portugal. Courtyard Double, 2 adults.'],
        ['Check in', 'Friday, November 20, 2026, from 15:00.'],
        ['Check out', 'Tuesday, November 24, 2026, until 11:00. 4 nights.'],
        ['Paid', '$744.00 with Visa ending 4242'],
        ['Cancellation', 'Free cancellation until 23:59 hotel time on Tuesday, November 17, 2026. After that, this booking can’t be refunded.']
      ],
      button: { label: 'View your booking', href: `${o}/bookings/S4T9LW` }
    })
  },
  'booking-canceled': {
    subject: 'Your booking K7MQ2D is canceled',
    preview: 'Your flights from London to Lisbon on Fri, Nov 20 are canceled.',
    build: (o) => ({
      h1: 'Your booking is canceled', ref: 'K7MQ2D',
      paras: ['Your flights from London to Lisbon on Friday, November 20, 2026 are canceled. The airline is refunding $612.00 to your Visa ending 4242. Your bank may take several business days to show it.'],
      button: { label: 'View your booking', href: `${o}/bookings/K7MQ2D` }
    })
  },
  'flight-times-changed': {
    subject: 'Kittiwake Air changed your flight times: K7MQ2D',
    preview: 'Your outbound flight on Fri, Nov 20 now leaves at 07:40.',
    build: (o) => ({
      h1: 'Your flight times have changed', ref: 'K7MQ2D',
      paras: ['Kittiwake Air has changed your outbound flight on Friday, November 20, 2026. It now leaves London Heathrow at 07:40 and lands in Lisbon at 10:25. If the new times don’t work for you, contact us with your booking reference.'],
      button: { label: 'See your booking', href: `${o}/bookings/K7MQ2D` }
    })
  },
  'reset-password': {
    subject: 'Reset your Overwing password',
    preview: 'The link works once and expires soon.',
    build: (o) => ({
      h1: 'Reset your password',
      paras: ['We got a request to reset the password for this email address. Use the button to choose a new one. The link works once and expires after a short time. If you didn’t ask for this, ignore this email and your password stays the same.'],
      button: { label: 'Choose a new password', href: `${o}/reset-password?token=r7Kp2QmX9w` }
    })
  },
  'password-changed': {
    subject: 'Your Overwing password was changed',
    preview: 'If this wasn’t you, reset it now.',
    build: (o) => ({
      h1: 'Your password was changed',
      paras: ['The password for your Overwing account was changed on Tuesday, November 10, 2026. If this wasn’t you, reset your password now and contact us.'],
      button: { label: 'Reset password', href: `${o}/forgot-password` }
    })
  }
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = 'Helvetica, Arial, sans-serif';

export function renderEmail(id: string, palette: Palette, origin: string): string | null {
  const e = EMAILS[id];
  if (!e) return null;
  const c = COLOURS[palette];
  const b = e.build(origin);
  const p = (t: string, extra = '') => `<p style="margin:0 0 16px;font:16px/1.5 ${FONT};color:${c.ink};${extra}">${esc(t)}</p>`;
  const rows = (b.rows || []).map(([k, v]) => `<tr><td valign="top" style="padding:12px 16px 12px 0;border-top:1px solid ${c.line};font:bold 14px/1.45 ${FONT};color:${c.ink};width:120px;">${esc(k)}</td><td valign="top" style="padding:12px 0;border-top:1px solid ${c.line};font:15px/1.45 ${FONT};color:${c.ink};">${esc(v)}</td></tr>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${esc(e.subject)}</title></head>
<body style="margin:0;padding:0;background:${c.ground};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(e.preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.ground};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
<tr><td style="padding:0 8px 20px;"><img src="${origin}/images/email/wordmark-${palette}.png" width="150" height="40" alt="Overwing" style="display:block;border:0;"></td></tr>
<tr><td style="background:#FFFFFF;border-radius:16px;padding:32px;">
<h1 style="margin:0 0 20px;font:bold 22px/1.25 ${FONT};color:${c.ink};">${esc(b.h1)}</h1>
${b.ref ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td style="background:${c.cream};border-radius:12px;padding:16px 20px;font:14px/1.4 ${FONT};color:${c.ink};">Booking reference <strong style="font-size:22px;letter-spacing:2px;">${esc(b.ref)}</strong></td></tr></table>` : ''}
${rows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">${rows}</table>` : ''}
${(b.paras || []).map((t) => p(t)).join('')}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 0;"><tr><td style="border-radius:999px;background:${c.deep};"><a href="${b.button.href}" style="display:inline-block;padding:14px 28px;font:bold 15px/1 ${FONT};color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(b.button.label)}</a></td></tr></table>
</td></tr>
<tr><td style="padding:24px 8px 0;">
${p(`Questions? Call ${SITE.phone} or email ${SITE.email}. Include your booking reference.`, `font-size:14px;color:${c.ink};`)}
${p('You’re getting this email because of a booking or account on Overwing.', `font-size:13px;color:${c.muted};`)}
</td></tr>
</table></td></tr></table>
</body></html>`;
}
