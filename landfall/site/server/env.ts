/* =====================================================================
   Landfall server: configuration
   Every environment variable the server reads, validated once with zod.
   Read lazily (env()), so `next build` works without secrets and a
   missing key fails the request that needs it with a clear message,
   not the whole app. Feature flags say which integrations are live.
   ===================================================================== */
import 'server-only';
import { z } from 'zod';

const empty = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v);
const opt = <T extends z.ZodType>(s: T) => z.preprocess(empty, s.optional());

const Schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.preprocess(empty, z.url().default('http://localhost:3003')),
  /* two-decimal currencies only: their minor units mean the same thing to Duffel and Stripe */
  APP_CURRENCY: z.preprocess(empty, z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'NZD', 'CHF', 'SGD', 'AED', 'INR', 'ZAR', 'MXN', 'SEK', 'NOK', 'DKK']).default('USD')),

  NEXT_PUBLIC_SUPABASE_URL: opt(z.url()),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: opt(z.string().min(20)),
  SUPABASE_SECRET_KEY: opt(z.string().min(20)),

  DUFFEL_ACCESS_TOKEN: opt(z.string().regex(/^duffel_(test|live)_/, 'must start with duffel_test_ or duffel_live_')),
  DUFFEL_WEBHOOK_SECRET: opt(z.string().min(8)),
  SUPPLY_MODE: opt(z.enum(['duffel', 'simulated'])),

  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: opt(z.string().regex(/^pk_(test|live)_/)),
  STRIPE_SECRET_KEY: opt(z.string().regex(/^(sk|rk)_(test|live)_/)),
  STRIPE_WEBHOOK_SECRET: opt(z.string().regex(/^whsec_/)),

  SMTP_HOST: opt(z.string()),
  SMTP_PORT: z.preprocess(empty, z.coerce.number().int().positive().default(587)),
  SMTP_USER: opt(z.string()),
  SMTP_PASSWORD: opt(z.string()),
  EMAIL_FROM: z.preprocess(empty, z.string().default('Landfall <bookings@example.com>')),
  SUPPORT_EMAIL: opt(z.email()),

  DATA_ENCRYPTION_KEY: opt(z.string().refine((v) => Buffer.from(v, 'base64').length === 32, 'must be 32 bytes, base64')),
  CRON_SECRET: opt(z.string().min(16)),

  PRICE_MARKUP_PERCENT: z.preprocess(empty, z.coerce.number().min(0).max(50).default(0)),
  PRICE_MARKUP_FIXED_CENTS: z.preprocess(empty, z.coerce.number().int().min(0).max(100000).default(0)),
  /* how long the host lets one request run: Netlify 60 (fixed), Vercel up to 300 */
  FUNCTION_TIME_LIMIT_SECONDS: z.preprocess(empty, z.coerce.number().int().min(20).max(900).default(60))
});
export type Env = z.infer<typeof Schema>;

let cached: Env | null = null;
export function env(): Env {
  if (cached) return cached;
  const parsed = Schema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${lines}`);
  }
  cached = parsed.data;
  return cached;
}

/* A required setting for one feature, with a message that says how to fix it */
export function need<K extends keyof Env>(key: K, feature: string): NonNullable<Env[K]> {
  const v = env()[key];
  if (v === undefined || v === null || v === '') throw new ConfigError(`${String(key)} is not set (${feature}). Add it to .env.local; see .env.example.`);
  return v as NonNullable<Env[K]>;
}

export class ConfigError extends Error {
  constructor(message: string) { super(message); this.name = 'ConfigError'; }
}

/* ---- feature flags ---- */
export const supabaseConfigured = () => !!(env().NEXT_PUBLIC_SUPABASE_URL && env().NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && env().SUPABASE_SECRET_KEY);
export const stripeConfigured = () => !!(env().STRIPE_SECRET_KEY && env().NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
export const smtpConfigured = () => !!env().SMTP_HOST;

/* duffel when a token is set (unless SUPPLY_MODE forces the simulated catalogue). Asking for
   duffel without a token is an error, never a quiet switch to the simulated catalogue; so is
   the simulated catalogue alongside live Stripe keys in production. */
export function supplyMode(): 'duffel' | 'simulated' {
  const e = env();
  if (e.SUPPLY_MODE === 'duffel' && !e.DUFFEL_ACCESS_TOKEN) throw new ConfigError('SUPPLY_MODE is duffel but DUFFEL_ACCESS_TOKEN is not set.');
  const mode = e.SUPPLY_MODE ?? (e.DUFFEL_ACCESS_TOKEN ? 'duffel' : 'simulated');
  if (mode === 'simulated' && e.NODE_ENV === 'production' && stripeLive()) throw new ConfigError('The simulated catalogue cannot run with live Stripe keys.');
  return mode;
}
export const duffelLive = () => !!env().DUFFEL_ACCESS_TOKEN?.startsWith('duffel_live_');
export const stripeLive = () => /^(sk|rk)_live_/.test(env().STRIPE_SECRET_KEY ?? '');
/* real money only pays for real bookings, and real bookings only for real money */
export const supplierLive = (supplier: 'duffel' | 'simulated') => supplier === 'duffel' && duffelLive();
export const appOrigin = () => new URL(env().APP_URL).origin;

/* ---- time budgets, from the host's request limit ----
   A request the host kills mid-way gives the customer a raw error page. So the slow supplier calls
   (Duffel order creation can take 130 s) stop waiting in time to answer "processing" themselves;
   an unanswered booking is never lost: fulfilment treats the timeout as an unclear answer, and the
   reconcile job or the supplier's webhook finds the order by its booking id later. */
export const functionLimitMs = () => env().FUNCTION_TIME_LIMIT_SECONDS * 1000;
/* the rest of a checkout (payment check, capture, email) needs about 20 s of the limit; 40 s on Netlify */
export const supplierBookingTimeoutMs = () => Math.min(130_000, functionLimitMs() - 20_000);
