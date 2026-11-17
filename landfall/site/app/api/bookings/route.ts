/* GET /api/bookings
   My bookings: the signed-in customer's bookings, newest first (read with their own session, so
   Row Level Security applies too). */
import { ok, route } from '@/server/http';
import { requireUser } from '@/server/auth';
import { listMine } from '@/server/bookings/view';

export const dynamic = 'force-dynamic';

export const GET = route(async () => {
  const user = await requireUser();
  return ok({ bookings: await listMine(user) });
});
