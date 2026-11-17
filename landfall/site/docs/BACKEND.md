# Landfall backend

How the booking platform works behind the Landfall pages: what runs where, how a booking moves from search to confirmation, how it is secured, and how to operate it. Setup steps (accounts, keys) are in [SETUP.md](SETUP.md).

## Stack

| Concern | Choice | Where |
|---|---|---|
| App and API | Next.js 16 (App Router). Route handlers are the API; server-only modules hold the logic | `app/api/**`, `server/**` |
| Database | Supabase Postgres, schema in SQL migrations, Row Level Security on every table | `supabase/migrations/` |
| Accounts | Supabase Auth (email and password), sessions in cookies through `@supabase/ssr` | `server/accounts.ts`, `proxy.ts` |
| Flights and hotels | Duffel API v2 (flights, Stays). The simulated catalogue runs when no token is set | `server/supply/` |
| Payments | Stripe Payment Element; PaymentIntents with manual capture | `server/payments/stripe.ts` |
| Email | Any SMTP provider (nodemailer). Supabase sends the account emails | `server/email/` |
| Validation | zod on every input | `server/bookings/schemas.ts`, `server/validation.ts` |
| Scheduled job | `GET /api/cron/reconcile`, run every 5 minutes (Vercel Cron) | `server/bookings/reconcile.ts` |

## Folders

```
server/                 server-only code (each file imports 'server-only')
  env.ts                every environment variable, validated with zod; feature flags
  http.ts               route() wrapper: envelope, errors, request ids, CSRF check, body limits, rate limiting
  auth.ts               the verified session user (getClaims) and their role
  accounts.ts           sign up/in/out, password reset, profile, saved travelers
  db/                   Supabase clients (adminDb: secret key; userDb: the visitor's session) and table types
  duffel/               Duffel HTTP client (timeouts, safe retries) and API types
  supply/               supplier interface + Duffel and simulated implementations
  flights.ts, stays.ts  search, cached offers and rates, revalidation, refresh after expiry
  cache.ts              flight_searches / stay_rates tables
  bookings/             checkout, fulfilment state machine, views, access, reconcile job
  payments/stripe.ts    authorise, capture, release, webhooks
  email/                send + log, booking emails
  webhooks.ts           Stripe and Duffel event handlers
lib/travel/             the view models every page renders (isomorphic: no server imports)
lib/api.ts, lib/session.ts, lib/store.ts   browser helpers: API calls, session, checkout drafts
supabase/               migrations, auth email templates, config.toml
proxy.ts                session refresh and sign-in redirect for account pages
```

## How a booking happens

```
results page ──GET /api/flights/search──▶ supplier search ─▶ stored in flight_searches (same visitor reuses it 5 min)
fare page ─────POST /offers/<id>/check──▶ supplier: current price of that fare (revalidation)
traveler form ─(draft in sessionStorage)
checkout ──────POST /api/checkout──────▶ revalidate price ─▶ booking row (pending_payment)
                                         passenger documents sealed (AES-256-GCM)
                                         Stripe PaymentIntent, manual capture, server's amount
browser ───────stripe.confirmPayment───▶ card authorised (3-D Secure in a modal when needed)
browser ───────POST /checkout/<id>/complete ─▶ fulfil():
                  claim (one worker only) ─▶ Duffel order / Stays booking (paid from Duffel balance)
                  ├─ booked   ─▶ save booking + e-tickets ─▶ capture payment ─▶ confirmation email
                  ├─ refused  ─▶ release card hold (nothing charged) ─▶ booking failed
                  └─ unclear  ─▶ keep the hold; the job asks Duffel later whether it booked
confirmation page ─GET /api/bookings/<ref>?key=<guest key>
```

The same `fulfil()` also runs from Stripe's webhook, if the customer closed the tab after paying, and from the scheduled job. A Postgres function (`claim_booking_for_fulfilment`) makes sure only one of them books.

How `fulfil()` stays safe:
- **Stale claims.** A claim only counts as stale after 10 minutes. One attempt takes about 4 minutes at worst, so a slow worker is never overtaken.
- **Compare-and-set.** Every state change applies only if the booking is still in the state that worker claimed. A worker that lost its claim never releases a captured payment, and never captures a released one.
- **Retries.** On a retry, the worker first asks the supplier whether the earlier attempt booked. It matches only orders carrying this booking's id. It also double-checks a refusal before releasing the hold.
- **Pending hotels.** A hotel request that answered "pending" (Duffel Stays 202) is never sent again. The worker only checks on it, and the `stays.booking.created` webhook completes it.
- **Live/test parity.** The payment's mode must match the supplier's mode: live Stripe with a live Duffel token, test Stripe with a test token or the simulated catalogue. Checkout refuses a mismatch, and fulfilment checks again before booking.
- **Parking.** A booking the system can't settle on its own is marked `needs_review` with an alert, and the job leaves it alone. Examples: still unclear after 5 attempts, a hotel still pending after a day, a hold released while booking, a hotel confirming after the hold was released.

### Booking states

| Status | Meaning | Card |
|---|---|---|
| `pending_payment` | Checkout started, waiting for the card | Not yet authorised |
| any, with `needs_review` | Parked for a person: the job stops touching it | As recorded on the payment |
| `processing` | Card authorised, booking with the supplier | Held |
| `confirmed` | Supplier confirmed | Captured |
| `failed` | Supplier refused, or the payment was cancelled | Released (never charged) |
| `expired` | Checkout abandoned for an hour | Released |
| `cancelled` | Cancelled after confirmation (Duffel webhook) | Refund handled outside Phase 1 |

### Prices
- All amounts are integers in minor units (cents). Duffel's decimal strings are converted exactly (`lib/travel/money.ts`).
- The customer price is the supplier price plus the markup in `server/pricing.ts`, which is the only place a markup is applied. Both markup values are 0 for now.
- The price is always set on the server. The browser sends what it showed (`expectedTotal`). If the supplier's current price differs, the API answers `409 price_changed { before, after }` and nothing is created.
- Phase 1 has one currency (`APP_CURRENCY`, USD). Supplier offers in another currency are left out, so set the Duffel balance currency to USD.

## Security model

- **Secrets.** Every secret is server-only. The browser receives two keys that are designed to be public: Supabase's publishable key and Stripe's publishable key. Missing or malformed variables fail clearly (`server/env.ts`).
- **Card data.** Card data never reaches this app. The Payment Element sends it straight from the browser to Stripe.
- **Passenger documents.** Passport numbers and dates of birth are encrypted with AES-256-GCM, with the booking id as associated data, between checkout and booking. They are erased once the booking ends either way. Logs redact them.
- **Database access.**
  - Row Level Security is on for every table.
  - Customers can read their own profile, travelers, bookings, payments and documents, and nothing else.
  - Customers can't read encrypted columns, can't write bookings, and can't change their role.
  - Server-only tables have no browser access at all.
  - Verified on 2026-11-16 by loading the migrations into PGlite (Postgres in memory) with 28 checks:
    - the sign-up trigger
    - the booking claim and the 10-minute stale window
    - parked bookings never being claimed
    - one order per search
    - rate limits
    - guest-booking claims (guest key revoked; detached bookings never pass to a new owner of the email)
    - every customer, anonymous and admin boundary
- **Roles.**
  - `profiles.role` is `customer` or `admin`. It is never read from user-editable metadata.
  - Admin-only routes are under `/api/admin`.
  - To make someone an admin, run the SQL in SETUP.md.
- **Sessions.** Sessions use Supabase cookies. Every request verifies them with `getClaims()`, which checks the JWT signature. `proxy.ts` refreshes them.
- **CSRF.** Every write must come from this site, checked through `Origin` and `Sec-Fetch-Site`. Webhooks and the cron route opt out and authenticate with signatures or a bearer secret instead.
- **Rate limits.** Limits are fixed windows in Postgres, shared by all instances, per IP hash and per email or user:
  - search: 20 per minute
  - checkout: 20 per 10 minutes
  - sign-in: 30 per IP and 8 per email per 15 minutes
  - forgot password: 3 per email per hour
  - contact: 5 per hour
- **No account enumeration.** Sign-up and forgot-password answer the same whether or not an account exists.
- **Password reset.** A reset only works in the session opened by a recovery email, within 15 minutes, proven by a signed httpOnly cookie. Any other session changes its password with the current password.
- **Redirects.** `?next=` after sign-in is resolved as a URL and must stay on this site. `/auth/confirm` only redirects to paths on this site.
- **Guest bookings.**
  - A guest booking opens with a key derived by HMAC from the booking id. Only its hash is stored, and clearing the hash revokes the key.
  - Signed-out bookings join an account only when the account's email is confirmed, and their guest key stops working at that point.
  - Bookings detached by an account deletion never pass to a new owner of the address.
- **Webhooks.**
  - Stripe events are verified by the SDK.
  - Duffel events are verified with HMAC-SHA256 of `t.body` and a constant-time compare.
  - Each event is stored and processed once.
- **Headers.**
  - CSP allows this site plus Stripe only.
  - `frame-ancestors 'none'`, nosniff, a strict referrer policy and Permissions-Policy are set.
  - HSTS is sent in production (`next.config.ts`).
- **Errors.** Browsers get public codes only. Every response carries an `x-request-id` header for support.

## API

All routes answer `{ data }` or `{ errors: [{ code, status, ... }] }` and are never cached.

| Route | Who | What |
|---|---|---|
| `GET /api/flights/search` | anyone | Itineraries with fares (`lib/travel/flights.ts` Offer), names dictionary |
| `POST /api/flights/offers/:id/check` | anyone | Current price of a fare: ok / up / down / sold_out / expired |
| `POST /api/flights/offers/:id/refresh` | anyone | The same flights from a new search, after the offer expires |
| `GET /api/hotels/search` | anyone | Hotels with their cheapest rate (StayCard) |
| `GET /api/places?q=` | anyone | Airport and city suggestions |
| `POST /api/checkout` | anyone | Start checkout: revalidate, create the booking and PaymentIntent |
| `POST /api/checkout/:id/complete` | owner or guest key | Book with the supplier, then capture or release |
| `GET /api/checkout/:id` | owner or guest key | Status while the supplier confirms |
| `GET /api/bookings` | signed in | My bookings |
| `GET /api/bookings/:ref` | owner, admin, guest key | One booking |
| `POST /api/auth/sign-in`, `sign-up`, `sign-out`, `forgot`, `reset`; `GET /api/auth/session` | anyone | Accounts |
| `GET /auth/confirm` | anyone | Supabase email links (confirm address, reset password, change email) |
| `GET/PATCH/DELETE /api/account`, `POST /api/account/password` | signed in | Profile, password, delete account |
| `GET/POST /api/account/travelers`, `PATCH/DELETE /api/account/travelers/:id` | signed in | Saved travelers |
| `POST /api/contact` | anyone | Contact form: stored and emailed to `SUPPORT_EMAIL` |
| `GET /api/admin/bookings`, `GET /api/admin/bookings/:ref` | admin | Bookings, with payments, emails and audit trail |
| `POST /api/webhooks/stripe`, `POST /api/webhooks/duffel` | providers (signed) | Events |
| `GET /api/cron/reconcile` | `Bearer CRON_SECRET` | The scheduled job |
| `GET /api/health` | dev: anyone; prod: `Bearer CRON_SECRET` | Which services are connected (never keys) |

## Database

| Table | Holds | Browser access |
|---|---|---|
| `profiles` | Names, phone, role (one per auth user, made by a trigger) | Own row; can edit names and phone |
| `saved_travelers` | Travelers saved to the account | Own rows |
| `bookings` | Every booking: status, supplier ids, money, display snapshot, sealed documents | Own rows, without secret columns |
| `payments` | Stripe PaymentIntents and their status | With own booking |
| `travel_documents` | E-tickets | With own booking |
| `booking_events` | Audit trail of every step | Admins |
| `flight_searches`, `flight_search_offers`, `stay_rates` | Search caches | None |
| `webhook_events`, `email_log`, `contact_messages`, `rate_limits` | Operations | None |

Change the schema only with a new file in `supabase/migrations/`, then update `server/db/types.ts`. Apply migrations with `npm run db:push`.

## Suppliers

| Mode | When | Behaviour |
|---|---|---|
| Simulated | No `DUFFEL_ACCESS_TOKEN` | The demo catalogue. Some offers change price, sell out or can't be confirmed, on purpose. Bookings are marked as test bookings |
| Duffel test | `duffel_test_` token | Duffel Airways (ZZ) on any route, with special routes for failures (SETUP.md), and the "Duffel test hotels" destination. Unlimited test balance |
| Duffel live | `duffel_live_` token | Real tickets and rooms, paid from the Duffel balance. Needs Duffel's go-live approval and a funded balance |

Duffel facts the code depends on:
- Offers expire after about 30 minutes.
- Order creation can take up to 120 seconds, so the client timeout is 130 seconds.
- There is no idempotency key, so a retry first looks the order up by offer id.
- Live search is limited to about 10 per minute by default; Duffel can raise the limit.
- A visitor's identical search is reused for 5 minutes, but never across visitors. Duffel allows one order per offer request, so two customers must never book from the same search.
- "Visitor" means an anonymous random id in an httpOnly cookie (`lf_vid`) that `proxy.ts` sets, so customers sharing an office or mobile network stay separate. The IP is only used as a fallback.
- Stays only offers rates that are pay-now and payable from the balance.

## Operations

- **Scheduled job (every 5 minutes):**
  - releases abandoned checkouts
  - retries bookings stuck in `processing`, and after 5 attempts writes a `needs_review` event and an error log line
  - retries failed captures
  - fetches e-tickets that arrive late and emails the customer
  - resends failed emails
  - purges caches

  Vercel's Hobby plan only allows daily cron jobs. Use Pro, or call the route from any scheduler with the bearer secret.
- **Alerts to watch in logs** (every alert line starts with `ALERT`):
  - `ALERT duffel_balance_empty`: top up the Duffel balance. Customers see a generic "couldn't confirm" and are not charged.
  - `ALERT payment.capture_failed`: the booking is confirmed but not yet paid. The job retries.
  - `ALERT payment_uncaptured`: still not captured 2 hours after confirming. Act before Stripe's 7-day authorisation runs out.
  - `ALERT booking_needs_review: <why>`: a person should check this booking in Duffel's and Stripe's dashboards. List them with `GET /api/admin/bookings?review=1`.
  - `ALERT payment_mode_mismatch`: live and test keys are mixed. Fix the environment variables.
- **Support lookups:**
  - `GET /api/admin/bookings?q=<reference or email>` lists matching bookings.
  - `/api/admin/bookings/<ref>` shows the payments, emails and every step.
  - Each response's `x-request-id` header matches the server log line.
- **Webhooks after deploy:**
  - Stripe: add an endpoint at `/api/webhooks/stripe` with the events `payment_intent.amount_capturable_updated`, `payment_intent.payment_failed`, `payment_intent.canceled` and `charge.refunded`.
  - Duffel: `POST /air/webhooks` with url `/api/webhooks/duffel` and the order, order-cancellation and stays events. Store the secret it returns once.

## Phase 1 limits and open decisions

- **Cancellation and refunds** are not self-serve. Customers are sent to Contact us. Duffel cancellations confirmed elsewhere (the dashboard, the airline) update the booking through the webhook. Self-serve cancellation is a follow-up if the client wants it.
- **Children's ages:** the hotel search counts children as age 8, because the search form doesn't ask for ages. Flights use the adult, child and infant types.
- **Markup or service fee:** 0 until the client decides (`PRICE_MARKUP_*`).
- **Homepage deals and "Recommended for you"** still show the demo catalogue's prices. Replace them with curated content, or drop the prices, before launch.
- **Destinations for hotels:** the curated city list, plus Duffel's test-hotel location in test mode. `/api/places` can back an open destination search later.
- **Duffel Stays** depends on Duffel enabling it on the account.
