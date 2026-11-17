/* =====================================================================
   Landfall server: the scheduled job (GET /api/cron/reconcile)
   Runs every few minutes (Vercel Cron, or any scheduler with the
   CRON_SECRET). Every step takes the oldest rows first, skips bookings
   parked for a person (needs_review) so they can't clog a batch, and the
   run stops starting new work near a time budget, so it always finishes
   inside a serverless limit; anything left is picked up next run.
   1. Checkouts paid but never completed (tab closed, webhook missed) are
      completed; checkouts abandoned for an hour end, and only then is the
      card hold released (compare-and-set first, so a customer finishing
      3-D Secure at that moment can't be released mid-booking).
   2. Bookings stuck in processing after an unclear supplier answer are
      tried again once their claim is stale (fulfil asks the supplier first
      whether it booked). After 5 attempts, or a hotel still "pending"
      after a day, they are parked for a person.
   3. Held payments whose booking has finished are settled: captured when
      confirmed (an alert when that is late), released when it failed.
   4. Flights confirmed without e-tickets: the order is fetched again; the
      tickets are saved and the customer gets the "e-tickets ready" email.
   5. Emails that failed are sent again (5 attempts at most).
   6. Expired search caches and old rate-limit rows are deleted.
   ===================================================================== */
import 'server-only';
import { adminDb } from '@/server/db/supabase';
import { log } from '@/server/log';
import { flightSupplier } from '@/server/supply';
import { retrieveIntent } from '@/server/payments/stripe';
import { addEvent, bookingById, documentsFor, paymentFor, saveDocuments, updateBooking } from '@/server/bookings/store';
import { capture, fulfil, needsReview, release, transition } from '@/server/bookings/fulfil';
import { sendBookingConfirmation, sendTicketsIssued } from '@/server/email/bookings';
import { deliver } from '@/server/email/send';

const BATCH = 20;
/* a fulfil call can take about 4 minutes against a slow supplier: only start one early in the run */
const SUPPLIER_WORK_UNTIL_MS = 50 * 1000;
const STOP_AT_MS = 240 * 1000;
const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();

export type ReconcileReport = Record<string, number>;

export async function reconcile(): Promise<ReconcileReport> {
  const db = adminDb();
  const started = Date.now();
  const elapsed = () => Date.now() - started;
  const report: ReconcileReport = { completed: 0, expired: 0, retried: 0, review: 0, captured: 0, released: 0, tickets: 0, emails: 0, purged: 0, errors: 0, skipped: 0 };
  const safely = async (what: string, fn: () => Promise<void>) => {
    if (elapsed() > STOP_AT_MS) { report.skipped++; return; }
    try { await fn(); } catch (e) { report.errors++; log.error('reconcile.step', { what, error: e }); }
  };

  /* 1. abandoned or unfinished checkouts */
  const { data: pending } = await db.from('bookings').select('*').eq('status', 'pending_payment').eq('needs_review', false)
    .lt('created_at', minutesAgo(15)).order('created_at').limit(BATCH);
  for (const b of pending ?? []) await safely(`pending ${b.id}`, async () => {
    const pay = await paymentFor(b.id);
    const pi = pay ? await retrieveIntent(pay.intent_id) : null;
    if (pi?.status === 'requires_capture') {
      if (elapsed() > SUPPLIER_WORK_UNTIL_MS) { report.skipped++; return; }
      const r = await fulfil(b.id, 'job');
      if (r.status === 'confirmed') report.completed++;
      return;
    }
    if (b.created_at > minutesAgo(60)) return; /* still paying, perhaps on a 3-D Secure screen */
    if (!(await transition(b, { status: 'pending_payment' }, { status: 'expired', failure_code: 'checkout_abandoned', sensitive_enc: null }))) return;
    await addEvent(b.id, 'checkout_expired');
    if (pi && pi.status !== 'canceled') await release(b, pi);
    report.expired++;
  });

  /* 2. stuck in processing (claims go stale after 10 minutes) */
  const { data: stuck } = await db.from('bookings').select('*').eq('status', 'processing').eq('needs_review', false)
    .lt('fulfilment_started_at', minutesAgo(11)).order('fulfilment_started_at').limit(BATCH);
  for (const b of stuck ?? []) await safely(`processing ${b.id}`, async () => {
    if (b.supplier_pending ? b.created_at < minutesAgo(24 * 60) : b.fulfilment_attempts >= 5) {
      await needsReview(b, b.supplier_pending ? 'hotel_pending_over_a_day' : 'supplier_unclear_after_retries', { attempts: b.fulfilment_attempts });
      report.review++;
      return;
    }
    if (elapsed() > SUPPLIER_WORK_UNTIL_MS) { report.skipped++; return; }
    const r = await fulfil(b.id, 'job');
    report.retried++;
    if (r.status === 'confirmed') report.completed++;
  });

  /* 3. held payments of finished bookings: capture or release */
  const { data: settle } = await db.rpc('payments_to_settle', { p_limit: BATCH });
  for (const p of settle ?? []) await safely(`settle ${p.booking_id}`, async () => {
    const b = await bookingById(p.booking_id);
    if (!b) return;
    const pi = await retrieveIntent(p.intent_id);
    if (p.booking_status === 'confirmed') {
      if (p.confirmed_at && p.confirmed_at < minutesAgo(120)) log.error('ALERT payment_uncaptured', { bookingId: b.id, reference: b.reference, confirmedAt: p.confirmed_at });
      if (await capture(b, pi)) { report.captured++; await sendBookingConfirmation(b.id); }
    } else {
      await release(b, pi);
      report.released++;
    }
  });

  /* 4. e-tickets that arrived after the booking */
  const { data: recent } = await db.from('bookings').select('*').eq('status', 'confirmed').eq('kind', 'flight').eq('supplier', 'duffel')
    .gt('confirmed_at', minutesAgo(3 * 24 * 60)).order('confirmed_at').limit(100);
  for (const b of recent ?? []) {
    if (report.tickets >= BATCH) break;
    await safely(`tickets ${b.id}`, async () => {
      const have = await documentsFor(b.id);
      if (have.some((d) => d.type === 'electronic_ticket') || !b.supplier_order_id) return;
      const docs = await flightSupplier('duffel').getDocuments(b.supplier_order_id);
      if (!docs.some((d) => d.type === 'electronic_ticket')) return;
      await saveDocuments(b.id, docs);
      const travelers = (b.travelers as { name: string; type: string; lead?: boolean; ticket?: string }[]).map((t) => ({ ...t, ticket: t.ticket ?? docs.find((d) => d.type === 'electronic_ticket' && d.passenger?.toLowerCase().includes(t.name.toLowerCase()))?.id }));
      await updateBooking(b.id, { travelers: travelers as never });
      await addEvent(b.id, 'tickets_issued', { count: docs.length });
      await sendTicketsIssued(b.id);
      report.tickets++;
    });
  }

  /* 5. emails to send again */
  const { data: failed } = await db.from('email_log').select('*').eq('status', 'failed').lt('attempts', 5).lt('created_at', minutesAgo(1)).order('created_at').limit(BATCH);
  for (const m of failed ?? []) await safely(`email ${m.id}`, async () => {
    if (m.template === 'booking_confirmed' && m.booking_id) await sendBookingConfirmation(m.booking_id);
    else if (m.template === 'tickets_issued' && m.booking_id) await sendTicketsIssued(m.booking_id);
    else {
      const p = m.payload as { html?: string; text?: string; replyTo?: string };
      if (p?.html && p.text) await deliver(m.id, { template: m.template, to: m.to_email, subject: m.subject, html: p.html, text: p.text, replyTo: p.replyTo });
    }
    report.emails++;
  });

  /* 6. caches */
  await safely('purge', async () => {
    const { data } = await db.rpc('purge_expired');
    report.purged = typeof data === 'number' ? data : 0;
  });

  log.info('reconcile.done', { ...report, ms: elapsed() });
  return report;
}
