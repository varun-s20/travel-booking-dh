/* =====================================================================
   Landfall server: Supabase clients
   - adminDb(): the secret key. Bypasses RLS, so it is used only after the
     route has validated input and checked who may act. Never imported by
     anything a browser bundle can reach (server-only).
   - userDb(): the visitor's own session (cookies), so RLS applies. Used to
     read a signed-in customer's rows and for every auth call.
   ===================================================================== */
import 'server-only';
import { cookies } from 'next/headers';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { need } from '@/server/env';
import type { Database } from '@/server/db/types';

export type Db = SupabaseClient<Database>;

let admin: Db | null = null;
export function adminDb(): Db {
  if (admin) return admin;
  admin = createClient<Database>(need('NEXT_PUBLIC_SUPABASE_URL', 'database'), need('SUPABASE_SECRET_KEY', 'database'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { 'x-client-info': 'landfall-server' } }
  });
  return admin;
}

/* A client bound to the request's auth cookies. In a Server Component the
   cookie store is read-only; the session refresh then happens in proxy.ts. */
export async function userDb(): Promise<Db> {
  const store = await cookies();
  return createServerClient<Database>(need('NEXT_PUBLIC_SUPABASE_URL', 'auth'), need('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'auth'), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          /* called from a Server Component: proxy.ts keeps the session fresh instead */
        }
      }
    }
  });
}
