# Build plan: travel-booking (working name Overwing, a placeholder)
Developer, 2026-11-10. From brief.md, design/design-spec.md (2b, 2c, 3b, 5, 6, 7), design/tokens.css, design/choices.md (2a and the provisional 2b answers), the approved prototype (prototype/index.html and assets/), content/copy.md, logs/dev-stack-note.txt, taste/signature.md, taste/anti-slop.md, taste/critic-rulings.md and evals/lessons.md.

## Stack (dev-stack note overrides the static parts of conventions.md)
- Next.js 16.4.6 App Router, React 19.3.1, TypeScript, plain CSS (no Tailwind), in projects/travel-booking/site/. No new packages.
- Order kept from conventions.md: tokens and global CSS first (app/styles/, imported once by the root layout), then shared components and client scripts (components/), then one route per page (app/<route>/page.tsx).
- Two versions from one codebase: Harbour gold (default) and Cabin dawn. `NEXT_PUBLIC_PALETTE` sets `data-palette` on `<html>` at build time; tools/run.mjs sets it on Windows without cross-env and gives each palette its own `distDir` (`.next-harbour`, `.next-cabin`), so both can run and build side by side. Scripts: dev:harbour (3001), dev:cabin (3002), build:harbour, build:cabin, start:harbour, start:cabin.
- Fonts: next/font/local. Calibre 200 / 400 / 700 from fonts/calibre (preload Bold), Geist variable woff2 (SIL OFL, self-hosted from the geist npm tarball on jsDelivr, licence file kept beside it). font-synthesis: none.
- Images: tools/images.mjs (sharp, already in node_modules as Next's own dependency) crops by focal point, writes WebP width derivatives and one JPEG fallback per image into public/images/<topic>/, never upscaling, plus lib/images.manifest.json. components/Photo.tsx reads the manifest for width, height, srcset and sizes. No hand-typed dimensions.
- Simulated backend: local modules in lib/data/ for the home page (places, destinations); route handlers under app/api/ arrive with the results pages.

## Pages, in build order
| # | Page | Route | Status |
|---|---|---|---|
| 0 | Foundation: tokens, fonts, palettes, sprite and grade filters, header (rail, account cluster, phone bar, tab bar, More menu), footer, skip link, focus ring, reduced motion, 404 | app/layout.tsx, app/not-found.tsx | built, session 1 |
| 1 | Home | / | built, session 1 |
| 2 | Flight results with the searching state, no results, fare changed, offer expired | /flights | built, session 2 |
| 3 | Flight details and fares, passenger form | /flights/[offer], /flights/[offer]/passengers | built, session 2 |
| 4 | Checkout, payment failed, confirmation | /checkout, /confirmation/[ref] | built, session 2 |
| 5 | Hotel results (static map with price pins), hotel detail, guest form | /hotels, /hotels/[hotel], /hotels/[hotel]/guests | built, session 2 |
| 6 | Account: sign up, log in, forgot and reset password, profile | /register, /login, /forgot-password, /reset-password, /account | built, session 2 |
| 7 | Dashboard and booking detail | /bookings, /bookings/[ref] | built, session 2 |
| 8 | About, Contact, Terms, Privacy, error page, emails | /about, /contact, /terms, /privacy | built, session 2 |

## 0. Foundation contract
- Done when: both palettes build and run from their own scripts; every token comes from design/tokens.css unchanged; Calibre and Geist load from the app's own origin with no faked weights; the chrome matches the prototype at 1440, 1024 and 390 (rail with tinted current square, account cluster that gathers into a white pill after 8px, phone bar, floating tab bar, More popover and sheet); skip link first and working; one accent focus ring; no hover without a matching focus-visible; reduced motion stops every movement; the footer and pre-footer follow spec 2b; the 404 shows the window with its blind down.
- Anti-slop held: no eyebrows, no full-stop headlines, no em dashes, no AI attribution in code, comments or meta, no visible placeholder labels (the one demo notice in the footer names the placeholders).

## 1. Home: sections in order and contract
1. Hero (prototype, approved): centred H1 "Fly there, stay there", subline, Flights / Hotels toggle, 920 x 72 labelled pill (From, To, Dates, Travelers; Destination, Check in and out, Guests and rooms), three fact chips, the cabin wall (4 / 3 / 2 windows) with the blinds rising once and the sideways drift. Phone: 64px trigger pill opening the full-screen sheet.
   Done when: every prototype behaviour holds in React (thumbs, popovers, combobox ranking and resolution, calendar range and keyboard, steppers with Duffel limits, validation messages in the status line, phone summary), submitting routes to the results URL with the search in the query, and nothing in the first screen moves except the blinds.
2. Entry cards (Hipcamp promo cards): two 604 x 302 photo cards, radius 24, deep text band on the bottom third with a 24px title and one white pill that opens the hero search on that tab. Phone: image 358 x 179 over the band.
   Done when: photos fill 2:1 slots by focal point with the subject clear of the band; the pill switches the tab and brings the search into view (opens the sheet on the phone).
3. Popular destinations (Monocle mats): H2 "Cities worth the flight" with the region pills on the same row (a sideways row at 390), six mat cards (label with its own rule, city name, square photo in the cabin-window mask), 4 / 2 / 1 columns, note under the grid. Whole card is one link to flight results for that city.
   Done when: pills filter with aria-pressed, focus follows the 8px radius, zoom 1.05 over 250ms on hover only.
4. Trust panel (Hipcamp host banner): deep panel 1232 wide, radius 24, H2 and four facts with Faye's disc ticks in the soft accent, photo on the right half flush to the panel edge; phone photo on top.
5. Pre-footer band (Varun V10): deep, radius 32 top, H2 "Pull up the blind on your next trip", white pill "Start a search" that brings the search back and focuses From, the window glyph at 7% behind.
6. Footer (Varun V10): ink over the hero photo at 12%, phone and email first, Back to top, four link columns (two at 390), the demo notice in a cream panel, copyright and "Created with love by Digital Heroes".
- Page contract: copy word for word from content/copy.md; stock photos in every slot, graded with the palette filter, never shown above their own resolution; no section taller than half a viewport without text or media; text over media none (the footer photo sits at 12% under ink).
- Rubric aims: one identity (the window carried into the destination mask, the pre-footer glyph and the 404, the five places the spec allows); craft clean at 1440 and 390 and between; functionality: every control keyboard reachable with a visible ring.

## Later pages: short contracts
- Flights results: searching state with the one looping window (6s drift, stops on results), filters as Hipcamp's bordered rows plus the Price group the Copywriter added, sort pill, cards on a 12px rhythm, live region with the count; no results, fare changed and expired panels in cream; all from route handlers with 1.2 to 2.5s latency.
- Flight details: itinerary timeline, fare rows with Faye inclusion cards on selection, sticky 392 summary with the expiry line (warn under 5 minutes); passenger form with 56px fields, inline errors.
- Checkout: contact, simulated Stripe card element themed from tokens, terms row, Pay pill; failed payment panel; confirmation with the reference in Calibre Thin and a Copy pill.
- Hotels: list plus a static map image per city with price pins and OpenStreetMap attribution (2b answer 4); Kasa detail with the 5-up grid and gallery dialog, room rail, policy accordion; guest form.
- Account and dashboard: one narrow column forms; booking cards with 1:1 photos; empty state with the window blind down.
- About, Contact, Terms, Privacy: About and Contact with stock photos and the interim About body; legal pages as notices (CLIENT COPY REQUIRED comments).

## Addendum, session 2 (Developer, 2026-11-10): how the remaining pages are built
- Simulated backend. lib/mock/ holds deterministic generators and fixtures: places with coordinates and time zones, airlines, flight offers (the six LHR to LIS offers from copy.md, padded to 86; other routes generated from distance), fares, hotels, rooms, policies and the demo account's bookings. app/api/ route handlers serve searches (1.2 to 2.5s latency, about 5s for long-haul so "Still looking" shows), price checks, Stripe-like payment intents (Stripe's test cards) and order creation. Handlers are stateless, so the build also works on a serverless preview.
- Visitor state (session, locally registered accounts, saved travelers, bookings made in this browser, cancellations, checkout drafts) lives in localStorage through lib/store.ts, seeded with the demo account (Maya Okafor) from copy.md.
- Offer ids encode the search and its time, so every offer page can be rebuilt and expires 30 minutes after its search (Duffel's expires_at).
- Demo states are tied to specific offers and searches (listed in handover.md): fare up, fare down, sold out, airline could not confirm, no flights, search failed then recovered, offer expired.
- Compact search bar on results and hotel detail: the home search component with a compact variant, filled from the URL.
- Maps: OpenStreetMap standard tiles loaded live (no download, attribution shown), toned to the palette with a CSS filter, price pins placed by Web Mercator maths (choices.md 2b answer 4: no packages).
- Emails: email-safe HTML served by route handlers at /emails/<template> for review; not linked from the site.
- No cookie notice: copy.md says only if the market needs one and the demo sets no cookies.
