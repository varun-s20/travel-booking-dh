/* GET /api/admin/bookings/<reference>  (admin role only)
   One booking for support: the customer view, its payments, e-tickets, emails and the full audit
   trail (booking_events). Passenger documents are never stored, so never shown. */
import { ok, route } from '@/server/http';
import { requireAdmin } from '@/server/auth';
import { adminDb } from '@/server/db/supabase';
import { notFound } from '@/server/errors';
import { viewable } from '@/server/bookings/view';

export const dynamic = 'force-dynamic';

export const GET = route<{ ref: string }>(async (_ctx, { ref }) => {
  const admin = await requireAdmin();
  const found = await viewable(ref.toUpperCase(), admin, null);
  if (!found) throw notFound();
  const db = adminDb();
  const id = found.row.id;
  const [payments, events, emails] = await Promise.all([
    db.from('payments').select('intent_id, status, amount, currency, amount_refunded, card_brand, card_last4, failure_code, decline_code, authorized_at, captured_at, cancelled_at, created_at').eq('booking_id', id),
    db.from('booking_events').select('type, detail, created_at').eq('booking_id', id).order('created_at'),
    db.from('email_log').select('template, status, attempts, last_error, created_at, sent_at').eq('booking_id', id).order('created_at')
  ]);
  const { sensitive_enc: _s, guest_token_hash: _g, checkout_key: _c, ...row } = found.row;
  return ok({ booking: found.view, record: row, payments: payments.data ?? [], events: events.data ?? [], emails: emails.data ?? [] });
});
