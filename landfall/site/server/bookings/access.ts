/* =====================================================================
   Landfall server: may this visitor act on this checkout?
   The booking's owner (signed in), an admin, or whoever holds the guest
   key handed out when it was started signed out. Anything else is "not
   found", so booking ids can't be probed.
   ===================================================================== */
import 'server-only';
import { getUser } from '@/server/auth';
import { bookingById } from '@/server/bookings/store';
import { safeEqual, sha256 } from '@/server/crypto';
import { notFound } from '@/server/errors';
import type { BookingRow } from '@/server/db/types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function checkoutFor(bookingId: string, guestKey: string | null | undefined): Promise<BookingRow> {
  if (!UUID.test(bookingId)) throw notFound();
  const b = await bookingById(bookingId);
  if (!b) throw notFound();
  const user = await getUser();
  const owner = !!user && (b.user_id === user.id || user.role === 'admin');
  const guest = !!guestKey && !!b.guest_token_hash && safeEqual(sha256(guestKey), b.guest_token_hash);
  if (!owner && !guest) throw notFound();
  return b;
}
