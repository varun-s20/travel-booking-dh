# Overwing (working name): travel booking site

Next.js 16 (App Router) front end with a simulated backend. "Overwing", the wordmark, contacts, flights, hotels and prices are placeholders, named in the footer's demo notice. Calibre is licensed for design and client review only: buy a Klim web licence, or switch to Rethink Sans, before any public deploy.

## Quick start
```
npm run dev:navy        # Night navy (the default) on http://localhost:3001
npm run dev:cabin       # Cabin dawn on http://localhost:3002
npm run build:navy      # production build into .next-navy
npm run build:cabin     # production build into .next-cabin
npm run start:navy      # serve the Night navy build on 3001
npm run start:cabin     # serve the Cabin dawn build on 3002
npm run images          # rebuild image derivatives and lib/images.manifest.json
```
Palettes since the 2026-11-11 revision: Night navy (the default) and Cabin dawn; the gold palette moved to the second design. The palette is fixed at build time by `NEXT_PUBLIC_PALETTE`; tools/run.mjs sets it (no cross-env needed on Windows) and gives each palette its own build folder (`.next-navy`, `.next-cabin`), so both versions run side by side. Dev servers build into `.next/dev-<palette>`: Turbopack watched its own cache in `.next-<palette>` and reloaded the page every few seconds. Optional: `SITE_URL` adds canonical and Open Graph URLs once the client has a domain.

## Folders
```
app/            layout.tsx (chrome, fonts, palette, metadata), page.tsx (home), not-found.tsx, error.tsx, one folder per route:
                flights/ ([offer]/, [offer]/passengers/), hotels/ ([hotel]/, [hotel]/guests/), checkout/, confirmation/[ref]/,
                bookings/ ([ref]/), account/, login/, register/, forgot-password/, reset-password/, about/, contact/, terms/, privacy/
app/api/        the simulated backend: flights/search, flights/offers/[id]/check, flights/orders, hotels/search, hotels/bookings,
                payments/intents, payments/intents/[id]/confirm, contact
app/emails/     email previews for review (/emails, /emails/<template>), not linked from the site
app/styles/     tokens.css (copy of design/tokens.css), base.css, ui.css, chrome.css, search.css, home.css, results.css,
                hotels.css, booking.css, account.css, pages.css, motion.css
app/fonts/      Geist variable (SIL OFL, licence beside it)
components/     chrome/, search/, home/, flights/, hotels/, booking/, account/, pages/, ui/ (fields, dialog, notices),
                Photo.tsx, Icon.tsx, AppLink.tsx, NotFoundBody.tsx
lib/            site.ts (placeholders, routes), palette.ts, dates.ts, format.ts (money, times), text.ts (sentences built from data),
                cabins.ts, client.ts (hooks, dialogs, scroll, toasts), store.ts (visitor state in localStorage), emails.ts,
                data/ (places, destinations), mock/ (geo, flights, hotels, bookings, server helpers), images.manifest.json
public/         fonts/calibre/, images/<topic>/ (generated derivatives), images/email/ (wordmark PNGs), images/credits.md, icons/
assets-src/     downloaded photo sources (never published)
tools/          run.mjs (palette runner), images.mjs and images.config.json (image builder), qa/page-checks.js (browser QA)
```

## Simulated backend
- Route handlers in app/api/ are stateless and answer in Duffel's `{ data }` and `{ errors }` shapes; simulated failures answer 200 with an errors body (a real 4xx would put a red line in the console). Searches wait 1.2 to 2.5s (long-haul and Tokyo about 5s).
- Offers come from lib/mock/flights.ts: copy.md's six London to Lisbon offers padded to 86, other routes generated from distance, all seeded. Offer ids carry the search and its time; offers expire 30 minutes after their search.
- Visitor state (session, accounts registered here, saved travelers, bookings made here, cancellations, form drafts) lives in localStorage under `overwing:v1` (lib/store.ts), merged with the demo account's bookings from lib/mock/bookings.ts.
- Demo states (which offer goes up, down, sells out, can't be confirmed; test cards; demo log in): build/handover.md, "Demo script".
- Form field names for a live endpoint: contact form `name`, `email`, `reference`, `message`.

## Class scheme (one scheme throughout)
`a-` atom (button, chip, toggle, glyph), `m-` module (search, card, window, menu), `o-` section (header, footer, home sections), `t-` page template wrapper, `b-` layout block (app, main, wrap). Block in camelCase, element after `__`, variant as a single-dash class: `o-homeDest__grid`, `a-button -light`. Runtime states are `is-` classes (`is-open`, `is-shown`, `is-tucked`); where ARIA holds the state, the CSS reads it (`[aria-pressed="true"]`, `[aria-current="page"]`). `<html>` carries `js` (set by the one-line head script, it gates hidden start states) and `is-kbd` (keyboard modality, for the search cells' ring). CSS layers load once from app/layout.tsx in cascade order; page rules hang off their block.

## To change X, edit Y
| To change | Edit |
|---|---|
| Any colour, size, space, radius, easing or duration | design/tokens.css, then copy it to app/styles/tokens.css |
| The palette version | the npm script you run (navy or cabin); `dev`, `build` and `start` with no suffix run navy |
| The business name, phone, email | lib/site.ts (and the demo notice in components/chrome/Footer.tsx) |
| Routes and which pages exist | lib/site.ts (`ROUTES`, `BUILT_ROUTES`) |
| Home copy | the home components in components/home/ and app/page.tsx (source: content/copy.md) |
| Destination cards, fares and photos | lib/data/destinations.ts |
| Airlines, fares, offer generation, price checks | lib/mock/flights.ts |
| Hotels, rooms, policies, map positions | lib/mock/hotels.ts |
| The demo account and its bookings | lib/mock/bookings.ts |
| Sentences built from data (meta lines, card names) | lib/text.ts |
| Email copy and layout | lib/emails.ts |
| Airports and cities in the search | lib/data/places.ts |
| A photo | add the source to assets-src/, an entry to tools/images.config.json, run `npm run images`, credit it in public/images/credits.md |
| The colour grade on photos | the two filters in components/chrome/Sprite.tsx (written by prototype/tools/grade_filter.py) |

## Checks
- Text: no em or en dashes, no AI attribution, no lorem or TODO in shipped files.
- Browser: paste tools/qa/page-checks.js into the browser tool's run-code step (set the URL and width at the top); it reports failed requests, console errors, upscaled images, missing alt, focus rings, the skip link, contrast and empty stretches.
- Types: `node node_modules/typescript/bin/tsc --noEmit -p .` (no npx needed).
- Results live in ../build/qa-report.md.

## Before launch
- Client name, logo, domain, contacts, legal text and market (content/copy.md, "Questions for the client").
- Calibre web licence, or switch to Rethink Sans.
- Replace stock photos with the client's own or licensed media (public/images/credits.md lists every one).
- Remove the demo notice and the `noindex` robots setting in app/layout.tsx.
- Replace the simulated backend: Duffel offers, orders and Stays from a server, Stripe's Payment Element in place of components/booking/CardElement.tsx, real accounts and email delivery; remove the test-card note on checkout.
- A map provider in place of the static OpenStreetMap tiles (components/hotels/StayMap.tsx).
