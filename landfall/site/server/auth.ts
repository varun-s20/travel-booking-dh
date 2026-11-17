/* =====================================================================
   Landfall server: who is asking
   The session comes from Supabase Auth cookies. getClaims() verifies the
   JWT's signature (against the project's signing keys), so a forged or
   expired cookie is never trusted. The role is read from public.profiles
   with the secret key: it is never taken from the token's user metadata,
   which the user can edit.
   ===================================================================== */
import 'server-only';
import { cache } from 'react';
import { adminDb, userDb } from '@/server/db/supabase';
import { supabaseConfigured } from '@/server/env';
import { forbidden, unauthorized } from '@/server/errors';
import { log } from '@/server/log';
import type { AppRole, ProfileRow } from '@/server/db/types';

export type SessionUser = {
  id: string;
  email: string;
  role: AppRole;
  firstName: string;
  lastName: string;
  phone: string;
};

/* once per request (React cache): the verified user and their profile, or null */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  if (!supabaseConfigured()) return null;
  try {
    const sb = await userDb();
    const { data, error } = await sb.auth.getClaims();
    if (error || !data?.claims?.sub) return null;
    const id = data.claims.sub as string;
    const email = (data.claims.email as string | undefined) ?? '';
    const { data: p } = await adminDb().from('profiles').select('*').eq('id', id).maybeSingle<ProfileRow>();
    return { id, email, role: p?.role ?? 'customer', firstName: p?.first_name ?? '', lastName: p?.last_name ?? '', phone: p?.phone ?? '' };
  } catch (e) {
    log.warn('auth.session_unreadable', { error: e });
    return null;
  }
});

export async function requireUser(): Promise<SessionUser> {
  const u = await getUser();
  if (!u) throw unauthorized();
  return u;
}

export async function requireAdmin(): Promise<SessionUser> {
  const u = await requireUser();
  if (u.role !== 'admin') throw forbidden();
  return u;
}
