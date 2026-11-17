/* POST /api/auth/sign-out: ends this browser's session. */
import { ok, route } from '@/server/http';
import { signOut } from '@/server/accounts';

export const dynamic = 'force-dynamic';

export const POST = route(async () => {
  await signOut();
  return ok({ signedOut: true });
});
