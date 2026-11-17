# Build plan: travel-booking, Landfall (working name, a placeholder)
Developer, 2026-11-11. From logs/redesign-note.txt (overrides earlier notes), logs/dev-stack-note.txt (stack; palettes and paths as in the redesign note), landfall/build/plumbing.md, landfall/design/design-spec.md, tokens.css, handover.md, choices.md, landfall/prototype/, landfall/references/deconstruct/ (kasa.md, european-sleeper.md), content/copy.md (shared chrome and mock data until landfall/content/copy.md is complete), taste/signature.md, anti-slop.md, critic-rulings.md and evals/lessons.md. Nothing visual is read from or reused from Overwing (site/, design/, prototype/).

This session builds the plan, the foundation and the homepage. Two Developers then build group F and group H in parallel (section 4). The scope is the same as projects/travel-booking/build/plan.md, in Landfall's design.

## 1. Stack and rules
- Next.js 16.4.6 App Router, React 19.3.1, TypeScript, plain CSS, in landfall/site/. No packages added (npm install and npx are unavailable). Tokens and global CSS first, then shared components, then one route per page (conventions.md, adapted to Next as the dev-stack note says).
- Palettes: navy (default, `npm run dev:navy` / `build:navy` / `start:navy`, port 3003) and harbour (`...:harbour`, port 3004). `NEXT_PUBLIC_PALETTE` sets `<html data-palette>` at build time; components use role tokens only, never a palette value.
- Tokens: app/styles/tokens.css is a straight copy of landfall/design/tokens.css (never edited in the app; recopied when the Art Director changes it). Fonts: next/font/local, Newsreader and Albert Sans (SIL OFL, latin subsets from landfall/prototype/assets/fonts), mapped into --f-display and --f-ui; `font-synthesis: none`.
- Photos: Landfall's own Unsplash License photos only (credits in public/images/credits.md, each checked on its photo page). Derivatives by tools/images.py (Pillow), never upscaled; real sizes in lib/images.manifest.json, read by components/ui/Photo.tsx. Hotel and room photos are Duffel's in the live app; in the demo they are Landfall stock photos listed in credits.md (group H sources them).
- Copy: landfall/content/copy.md word for word once it ends with "Copy complete."; content/copy.md (shared) for chrome and mock data until then. Never invent copy: a missing line is flagged in progress.md and the element left out.
- Writing: no em dashes, no AI attribution, no lorem, no visible placeholder labels, sentence case headings without full stops, no eyebrows, no uppercase.

## 2. Pages and states, in build order
| # | Page and states | Route | Group | Status |
|---|---|---|---|---|
| 0 | Foundation: tokens for both palettes, fonts, global CSS, sprite, header (frosted over the hero, solid elsewhere, hides on scroll down), menu sheet, pinned compact search, pre-footer band, footer, skip link, focus ring, reduced motion, toasts, dialogs and sheets, shared UI | app/layout.tsx, app/styles/, components/ | this session | |
| 1 | Home: hero with the search card, popular destinations, how Landfall books, pre-footer, footer | / | this session | |
| 2 | Flight results: searching (skeletons, "Still looking" after 5 s), results with filters and sort (sheets at 390), no results, search failed with Try again, offer expired dialog | /flights | F | |
| 3 | Flight details and fares: itinerary timeline, fare rows, fare conditions accordion, summary with price breakdown dialog and "Price held until", fare changed banner (up and down), sold out and not confirmed, offer expired dialog, sticky price bar at 390 | /flights/[offer] | F | |
| 4 | Passenger form (travelers): one card per traveler, saved travelers chips when signed in, inline errors and error summary | /flights/[offer]/passengers | F | |
| 5 | Checkout and payment failed: steps line, contact recap, card element (simulated Stripe), terms row, Pay button, declined panel, fare changed before pay. Serves flights and hotels (H's guest form hands over to it) | /checkout | F | |
| 6 | Confirmation: water photo, "You're going to", reference panel with Copy, itinerary or stay, paid total, what happens next, e-tickets issuing state | /confirmation/[ref] | F | |
| 7 | Email previews: booking confirmed (flight and hotel), ticket issued, payment failed, booking canceled, flight times changed, reset password, password changed | /emails, /emails/[id] | F | |
| 8 | Hotel results: list plus sticky map with price pins, map first at 390, "Add dates for prices", searching, no results, search failed (Sydney fails once) | /hotels | H | |
| 9 | Hotel detail: 5-up grid and gallery dialog, description and amenities, rooms rail with the price block, sold out room, good to know accordion, location, other hotels, sticky price bar at 390 | /hotels/[hotel] | H | |
| 10 | Guest form: lead guest, special requests, summary, hands over to /checkout | /hotels/[hotel]/guests | H | |
| 11 | Log in, sign up, forgot password, reset password (split page with a water photo) | /login, /register, /forgot-password, /reset-password | H | |
| 12 | Profile: details, saved travelers, password change, sign out, delete account | /account | H | |
| 13 | Dashboard (My bookings): Upcoming and Past tabs, next trip card, rows, empty state | /bookings | H | |
| 14 | Booking detail: reference, itinerary, travelers, paid total, documents, manage (cancel with refund shown first) | /bookings/[ref] | H | |
| 15 | About, Contact (form with real status, no fake success), Terms, Privacy (contents list, disclosure at 390) | /about, /contact, /terms, /privacy | H | |
| 16 | 404 ("This page has sailed", water photo at 60vh, the search card) and the error page | app/not-found.tsx, app/error.tsx | H | |

## 3. Contracts
### 0. Foundation (done when)
- Both palettes build and run from their own scripts on 3003 and 3004; every colour, size, radius and curve comes from tokens.css by role name.
- The chrome matches the prototype at 1440, 1024 and 390: header frosted over the hero photo and solid everywhere else, hides on scroll down past 120 and returns on scroll up (400ms settle), current link carries the landfall line; menu sheet with focus trapped, page inert, Escape closes and returns focus; compact search 860 x 52 at 1440 and one 52px pill at 390, floating at 24 with the header hidden and docked at 74 with the white strip behind it.
- Pre-footer band (navy, rounded top corners rising over white, one bright pill) and footer (navy over a hero photo at 12%; phone and email first, Back to top, four columns, two at 390; trust row of placeholders and card marks; demo notice; copyright and credit), as spec 2b.
- Skip link first and working; one 2px focus ring (teal on light, bright teal on navy and photos); every hover has a matching focus-visible; tap targets 44px; reduced motion stops every movement and shows everything at once.
- Shared components exist, documented in progress.md, and are used by the home page where it can: buttons, fields, search card and pickers, dialogs and sheets, toasts with their listener, photo, icons, price display, notices, accordion, status chips, sticky price bar, skeletons, cards.
### 1. Home (done when)
1. Hero (approved prototype): full-viewport photo with three crossfading water cities, the four-layer scrim, centred H1, subline, Flights and Hotels tabs with the landfall line, the white search card with fields and panels growing out of it (sheets below 1025), arrival caption with a real fare and "Fly here", pause button that stops all hero motion. 390: two-line headline, caption chip and pause above the tabs, the stacked card docked 32px over the photo with Search inside the first 844px. Every prototype behaviour holds in React, and Search goes to the results URL with the search in the query.
2. Popular destinations (European Sleeper): centred H2 and note, six navy price-led cards, 3 / 2 columns and 80px rows at 390; the whole card fills To and opens Dates.
3. How Landfall books (Kasa promo rows): three alternating photo and text rows, 4:3 photos radius 16, facts only from the scope; photo over text at 390. Never three icon cards.
4. Pre-footer and footer (foundation).
- Page contract: copy word for word; photos fill their slots by focal point and are never shown above native size; no stretch over half a viewport without text or media; text over photos readable on every slide; both palettes; the hero re-scored by the critic at 1440 and 390 (handover note 3).
### Groups F and H (done when, every page)
- Built from spec 2b for that page, Landfall's components only, copy from landfall/content/copy.md.
- The concept carries through (Chief Officer 2b, note 3): the landfall line on flight legs, the itinerary timeline, above every booking total and on the confirmation; the price rule everywhere (total first, unit price second, "taxes and fees included" always; struck-through and scarcity only from API data).
- Every flow clicks through end to end against app/api/ with the demo states in plumbing.md item 10.
- QA as build-site section 5, at 1440 and 390, both palettes; one or two critic rounds per page; results in progress.md.

## 4. The two groups
- **Group F (flights and booking):** /flights, /flights/[offer], /flights/[offer]/passengers, /checkout (flights and hotels), /confirmation/[ref], /emails.
- **Group H (hotels, account, pages):** /hotels, /hotels/[hotel], /hotels/[hotel]/guests, /login, /register, /forgot-password, /reset-password, /account, /bookings, /bookings/[ref], /about, /contact, /terms, /privacy, app/not-found.tsx, app/error.tsx.
- **Hand-over between groups:** H's guest form sends the visitor to `/checkout?kind=stay&hotel=<id>&room=<id>&` plus `stayQuery()`; F's checkout reads that and books through /api/hotels/bookings. Flight checkout is `/checkout?kind=flight&offer=<id>&fare=<fare>`. Both confirmations live at `/confirmation/[ref]` (F). The dashboard and booking detail (H) read bookings from lib/store.ts, which checkout writes with `addBooking()`.
- **File ownership:** each group adds its own CSS file (app/styles/flights.css for F, app/styles/hotels.css for H, already created and imported by app/layout.tsx) and its own components folder (components/flights/ for F, components/hotels/ for H, components/account/ for H's account pages if wanted). Pages live under their own routes. Shared files (app/layout.tsx, app/styles/tokens.css, global.css, home.css, components/chrome/, components/search/, components/ui/, lib/) change only for small additions, each listed with its reason in progress.md under the group's name. Never restyle a shared component for one page: page rules hang off the page wrapper class (`.t-flights .m-card {}`).
- **Photos:** each group sources its own (same licence check, added to public/images/credits.md and processed with tools/images.py into its own topic folder: public/images/flights/ or public/images/hotels/, stays/, account/, pages/). The destination and hero sets may be reused where the spec says so.
