/* GET /api/admin/bookings?status=&kind=&q=&review=1&limit=  (admin role only)
   The basic operations view (Phase 1 "basic role-based access"): bookings newest first, filtered
   by status, kind, a reference / email search, or review=1 for bookings parked for a person
   (an unclear supplier outcome the scheduled job stopped retrying). Secret columns are never selected. */
import { z } from 'zod';
import { ok, readQuery, route } from '@/server/http';
import { requireAdmin } from '@/server/auth';
import { adminDb } from '@/server/db/supabase';

export const dynamic = 'force-dynamic';

const Query = z.object({
  status: z.enum(['pending_payment', 'processing', 'confirmed', 'failed', 'cancelled', 'expired']).optional(),
  kind: z.enum(['flight', 'stay']).optional(),
  q: z.string().trim().max(254).optional(),
  review: z.enum(['1']).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50)
});

const COLUMNS = 'id, reference, kind, status, supplier, live_mode, supplier_reference, supplier_order_id, contact_email, currency, total_amount, failure_code, needs_review, supplier_pending, fulfilment_attempts, created_at, confirmed_at, cancelled_at, user_id';

export const GET = route(async (ctx) => {
  await requireAdmin();
  const q = readQuery(ctx.req, Query);
  let query = adminDb().from('bookings').select(COLUMNS).order('created_at', { ascending: false }).limit(q.limit);
  if (q.status) query = query.eq('status', q.status);
  if (q.kind) query = query.eq('kind', q.kind);
  if (q.review) query = query.eq('needs_review', true);
  if (q.q) {
    const term = q.q.toUpperCase();
    query = /^[A-Z2-9]{6}$/.test(term) ? query.eq('reference', term) : query.ilike('contact_email', `%${q.q.replace(/[%_]/g, '')}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(`admin.bookings: ${error.message}`);
  return ok({ bookings: data });
});
