# Landfall (working name, a placeholder): travel booking site

The Phase 1 booking platform:
- Next.js 16 (App Router).
- Flights and hotels from **Duffel**.
- Accounts and data in **Supabase**.
- Payments through **Stripe**.

"Landfall", the contacts and the legal text are placeholders until the client supplies their own. This is the live design. Overwing (`../../site/`) is a separate design study and isn't connected to this backend.

- **Setup** (accounts, keys, `.env.local`): [docs/SETUP.md](docs/SETUP.md)
- **How the backend works** (architecture, booking flow, security, API, operations): [docs/BACKEND.md](docs/BACKEND.md)

## Quick start
```
npm ci                  # install
npm run db:push         # apply supabase/migrations to your Supabase project (needs SUPABASE_DB_URL)
npm run dev             # http://localhost:3003 (navy palette)
```
Then open http://localhost:3003/api/health to see which services are connected.

Without a Duffel token the site uses the simulated catalogue. Stripe and Supabase keys are required for checkout and accounts.

## Scripts
| Script | Does |
|---|---|
| `npm run dev` / `dev:navy` / `dev:harbour` | Dev server, navy on 3003 or Harbour gold on 3004 |
| `npm run build:navy` / `build:harbour` | Production build into `.next-navy` / `.next-harbour` |
| `npm run start:navy` / `start:harbour` | Serve a production build |
| `npm run typecheck` | TypeScript, strict, whole project |
| `npm run db:push` | Apply new migrations to Supabase |
| `npm run db:status` | Show which migrations the database has |

`NEXT_PUBLIC_PALETTE` fixes the palette at build time; `tools/run.mjs` sets it. Ports 3001 and 3002 belong to Overwing.

## Folders
```
app/            pages; app/api/ is the backend API; app/auth/confirm handles Supabase email links
server/         server-only logic: suppliers (Duffel, simulated), checkout and fulfilment, Stripe, email, auth, webhooks, scheduled job
lib/travel/     the flight, hotel and booking view models every page renders
lib/            browser helpers (api, session, drafts), formatting, copy helpers, demo data (lib/mock: simulated supplier only)
components/     the UI
supabase/       migrations (the database schema), auth email templates, config.toml
docs/           SETUP.md, BACKEND.md
proxy.ts        keeps the Supabase session fresh; sends signed-out visitors from account pages to sign in
```

## To change X, edit Y
| To change | Edit |
|---|---|
| Business name, phone, email | `lib/site.ts` |
| Markup or service fee | `.env.local` (`PRICE_MARKUP_PERCENT`, `PRICE_MARKUP_FIXED_CENTS`); applied in `server/pricing.ts` |
| Database tables or security rules | A new file in `supabase/migrations/`, plus `server/db/types.ts` |
| Booking and account emails | `server/email/bookings.ts` (content), `components/flights/email.ts` (design), `supabase/templates/` (sign-up and password emails) |
| Cities offered for hotels | `lib/data/places.ts` (`CITIES`, with coordinates) |
| Rate limits | The `rateLimit(...)` call in each `app/api/**/route.ts` |
| Demo catalogue (simulated mode) | `lib/mock/` |

## Before launch
- The client's name, logo, domain, contacts and legal text.
- Remove the `noindex` robots setting in `app/layout.tsx`.
- Live keys for Duffel and Stripe, a funded Duffel balance, and SMTP for both email paths (the site's and Supabase Auth's).
- Webhook endpoints and Vercel Cron (docs/BACKEND.md, Operations).
- Homepage deals and recommendations still show demo prices. Replace them or drop the prices.
