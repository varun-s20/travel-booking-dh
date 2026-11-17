/* GET /api/auth/session
   The signed-in customer (names, email, phone, role) or { user: null }. The header, My bookings
   and checkout read it. */
import { ok, route } from '@/server/http';
import { getUser } from '@/server/auth';
import { accountView } from '@/server/accounts';

export const dynamic = 'force-dynamic';

export const GET = route(async () => {
  const u = await getUser();
  return ok({ user: u ? accountView(u) : null });
});
