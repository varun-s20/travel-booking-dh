# Build progress: travel-booking

## Session 4 (Overwing polish round, stage O3, 2026-11-11, 05:29 to before 07:45)
- Prompt: fix issue 10 and anything open in build/handover.md that needs no new client facts; production builds of both palettes (navy 3001, cabin 3002); one critic round on the whole site at high effort; fix worst first and check each in the browser; Chief Officer in the foreground with both URLs, the new report and the handover, including its last open point (date of birth selects at 390). Never read landfall/, never install, leave ports 3003 to 3006 alone, subagents in the foreground, stop every server.
- [x] 1. Issue 10: the 1fr rows gave every list item one height but the card inside kept its own. The item now stretches its card and the price row sits on its floor; all five cards 349px at 1440. Other open handover items need the Copywriter, the client or Varun (unchanged).
- [x] 2. build:navy and build:cabin pass with no warnings, types clean; start:navy (3001) and start:cabin (3002).
- [x] 3. Critic, whole site, high effort (foreground): **7.7 FAIL** (design 8, originality 7, craft 8, functionality 8.5), up from 7.4. No design or copy tells. Last pass issues: 8 fixed, 2 partly fixed (map seams, phone Map pill). Booked flight PZMZXT and hotel MHQJNV to confirmation. Report: build/critic/polish/report.md.
- [x] 4. Fixed worst first, each checked in the browser on a fresh production build:
  1. map tile seams: tiles draw 1px past their 256px step (the map box lands on a fractional y); pixel scan at every tile boundary reads like any other row;
  2. phone Map pill: Map now sits beside Sort in the toolbar, floating pill removed (spec 2b change);
  3. hotel cards: one height only from 641, conditions and price grouped at the floor, nightly line balanced; natural height on phones (title 16px under the photo);
  4. date selects 16px in like every field; Day floor 76px on phones ("Day" 28.5 in 34, "September" 82 in 92, "1987" 35 in 42);
  5. Home footer inset 16px and rounded like the hero (x 104 to 1424, matching the band);
  6. summary aligned with the first card on flight details (306/306) and logged-out checkout (251/251);
  7. 900 to 1024 menu logged in ends with Log out after a divider (its own list, so keyboard order matches);
  8. "Back to results" restores the list position (1200 to 1200), used once;
  9. hotel confirmation window shows the hotel's first photo;
  10. adult birth years from 2014, children and infants by band; checkout terms label without the stray space.
  - Not changed: Log in lands on the profile (existing rule); the duplicate title tags on that redirect (Next.js); OSM live tiles (provider decision).
- [x] 5. Chief Officer, call 1 of this stage (foreground): **APPROVED WITH NOTES.**
  - Last open point closed: date of birth at 390, filled and empty, all whole, 16px in.
  - Rulings in Varun's place, all APPROVED: Map beside Sort on phone hotel results (watch: stays on the first screen); Home footer inset at 1440 (watch: Home only); one card height from 641 with the price at the floor (watch: descriptions keep their 2-line clamp).
  - Note 1 (the only one): map pins showed the nightly rate while cards lead with the total. Fixed: pins show the stay total ("$679"), with the accessible name "Ladeira Rooms, $679 total"; checked at 1440 in both palettes and on the 390 full-screen map, no pins overlapping.
- [x] 6. QA after the fixes: 7 pages x 2 palettes x 1440 and 390, no console errors, no 4xx, no horizontal scroll; text scan clean. build/qa-report.md, build/handover.md and review-log.md updated. Every server stopped.

## If resuming (after session 4)
- Nothing from the polish round is open. Remaining items are for the Copywriter, the client and Varun: build/handover.md. Originality (7) is held back by the missing client brand and media, which no polish round can fix.

## Session 3 (Overwing revision for the client's feedback, 2026-11-11)
- Prompt: apply design/revision-2026-11-11.md to every page, palettes navy (3001, default) and cabin (3002), harbour removed; new hero photo to the Chief Officer's condition before the home hero; QA both palettes at 1440 and 390; one critic round on Home plus one booking flow; fixes; final pass at xhigh; Chief Officer at the end. Deadline 07:15.
- Order: (1) palettes, (2) foundation and chrome, (3) inner pages, (4) hero photo then home hero, (5) QA, (6) critic, (7) fix, final pass, handover, Chief Officer.
- [x] 1. Palettes: tokens.css copied from design/, navy and cabin in lib/palette.ts, tools/run.mjs, package.json (dev, build, start run navy), next.config.ts, the navy grade filter from the prototype, navy icons and email wordmark, emails in navy, shadows re-tinted. Harbour files deleted. The old build folder .next-harbour is still on disk (a shell delete was refused; it is gitignored and unused).
- [x] 2. Chrome: rail (Flights, Hotels, Bookings, Help, More), solid top bar with Log in and Sign up, compact search centred in the top bar (shrinks inside it), first-name account pill, More level with its button, tab bar Flights, Hotels, Bookings, Account (below 900) that hides on scroll down and while a search field has focus, phone search inline as one card with the sheet opening on the touched cell, the pill from 900px with an arrow-only Search to 1024. The compact bar on inner pages keeps its one summary pill below 900 (my reading: item 14 is about the hero).
- [x] 3. Inner pages: items 22 to 35 and 38 (prices lead with the total, chips, sort prices, the results window, slider colours, summaries, room cards, pins, checkout lock, dashboard 160px, About banner and scrim, closed windows, emails). New photos, each checked on its photo page: contact-map-pen (Glenn Carstens-Peters), trust-desk-bell (Jonathan Cosens Photography), casa-lanterna-terrace-suite (Gábor Szűts), about-harbour-window (Fiqih Alfarish).
- [x] 4. Hero photo: kiama-harbour-first-light (Martin David, Kiama NSW, Unsplash License, checked 11 Nov): a harbour town on the coast at first light from high up, no industry, land in all four panes at 1440. View offsets picked by eye: -24cqw at 1440, -22cqw at 1024, -12cqw at 390. Home rebuilt from the prototype's .o-homeHero plus the Chief Officer's notes 2 (2px bright-teal lit edge) and 4 (window tops above the tab bar at 390). Destinations, entry cards, trust panel, pre-footer window and footer revised (items 17 to 21).
- [x] 5. QA both palettes at 1440 and 390 (build/qa-report.md, session 3). Fixed: entry photo crop, hotel card sizes, slider ring.
- [x] 6. Critic round (high), run one at a time in the foreground. Two critics first went out in the background by my mistake and shared one browser; I stopped both within a minute, before they opened a page, and re-ran them in the foreground.
  - Home, both palettes, 1440, 1024, 960, 390: 6.8 FAIL (design 7, originality 7, craft 6, functionality 7). No design or copy tells. Hero photo: place, no industry and land in every pane met; warm light thin.
  - Flight flow, navy, 1440 and 390, two bookings to confirmation: 6.55 FAIL (design 7, originality 6, craft 6 capped by a clipped Year select, functionality 8). No tells. Pricing checklist passed.
- [x] 7a. Fixed after the round (checked in the browser, not re-scored): tab bar no longer stuck hidden after the sheet (only text inputs hide it, and any scroll up clears it); Flights, Hotels, Bookings and Account lead the menu from 900 to 1024; the menu is a 480px card on tablets; 48px between the hero and the entry cards; pre-footer window at 30% so the line holds over it, 400px tall, band inset 16px; destinations as two rows of three; hero view -20cqw with a light lift, so the sunrise crosses all four panes; trust photo replaced (a Reception sign over the sea, Dmitry Limonov; the bell showed the photographer reflected in it); open sheet cell tinted; Year 104px; the 1px seams at fractional scroll covered (bar covers 2px upward, band overlaps 1px); a price breakdown on the phone details page; Fastest ties break by price (chip, sort and option agree); the lock inline with its text; filter column without its own scrollbar; price note on one line where it fits; slider ring clear of its value; distinct names for the Change links.
  - Not changed, and why: the top bar is empty in the middle on flight details, passengers and checkout, because those pages never had the compact search (spec 2b puts it on results and hotel pages); for the Art Director. The "Not refundable" line sits in Included as copy.md has it; for the Copywriter.
- [x] 7b. Final whole-site pass (xhigh, navy plus Cabin dawn spot checks, flight and hotel bookings to confirmation): 7.4 FAIL (design 7.5, originality 7, craft 7.5, functionality 8). No tells. Fixed after it, checked in the browser, not re-scored: results keep list, filters and sort on return (sessionStorage, life of the offers); destinations on one centred axis; map tone through the palette's grade; map tiles on whole pixels; hotel phone bar leads with the total; no duplicate menu rows at 900 to 1024 logged in; phone Map pill steps aside with the tab bar; hero view -17cqw with a light lift. Left for the Art Director and Copywriter: build/handover.md.
- [x] build/handover.md rewritten for session 3 (scores, QA, How to preview for navy and cabin). README scripts updated.
- [x] Chief Officer, call 1 (foreground; URLs 3001 and 3002, build/critic/final/report.md, build/handover.md): **APPROVED WITH NOTES.** All five art direction conditions verified in the browser (hero photo, teal lit edge, 390 window tops and Search above the fold, no fee claim, the 900 to 1024 search; no seam at fractional scroll). It booked flight NLK4P5 end to end.
  - Rulings in Varun's place: no compact search on flight details, passengers or checkout (the funnel stays focused); destinations as two rows of three approved; select prompts "Select", "Day", "Month", "Year" (interface wording, the Copywriter can change it).
  - Notes, ranked: (1) blank selects on the passenger form; (2) cut "taxes and fees included" from each destination card; (3) the hotel phone bar on two deliberate lines; (4) a cabin window beside the confirmation title, time allowing; (5) hotel result cards at a 320px minimum, lowest priority. No more work on the hero exposure.
- [x] Fixed all five notes: select prompts "Select", "Day", "Month", "Year" (empty values; passenger form and profile traveler editor); destination cards read the city, "Return from $412", "1 adult" ("Return" dropped from the suggested "Return, 1 adult" because the price line starts with it); hotel phone bar "From $1,302 total" over "$186 a night"; the destination's cabin window beside "You're booked"; hotel cards 320px minimum from 641.
- [x] Chief Officer, call 2 (the last allowed): **APPROVED WITH NOTES, final.** Four notes and both rulings held in the browser; note 1 exposed clipping in the date of birth selects at 390 ("D", "Septem"). Fixed after the call: the date selects' chevron sits 6px in, the text gets the room, and on phones Day and Year keep a floor (68px, 80px) with Month taking the rest; measured "Day", "28", "September" and "1987" whole at 390, 768 and 1440. Not re-checked by the Chief Officer (no calls left).
- Done. Every server stopped. Good commit point.

## If resuming
- Nothing in the revision doc is left for this build. Open items are for the Art Director, Copywriter and client: build/handover.md.
Developer, 2026-11-10. Homepage-only run (Varun's prompt: build-site on projects/travel-booking, homepage only; logs/dev-stack-note.txt overrides the static parts of conventions.md).

## Session 2 (remaining pages, 2026-11-10 to 11): finished
- Varun's prompt: build every page in plan.md with the simulated backend end to end, both palettes, then the final whole-site pass and build/handover.md. Homepage decisions below stay as they are for now.
- Order: simulated backend (lib/mock/, lib/store.ts, app/api/), compact search bar, flights (results, details, passengers), checkout and confirmation, hotels (results, detail, guests), account and dashboard, About, Contact, legal, error, emails. Plan addendum at the end of plan.md.
- Each page group gets QA and up to 2 critic rounds; scores land in the table further down as they come in.

### Session 2 log
- Built: simulated backend (lib/mock/, lib/store.ts, app/api/), compact search bar, flights (results, details, travelers), checkout, confirmation, hotels (results with OSM map, detail, guests), account (log in, sign up, forgot, reset, profile), dashboard, booking detail, About, Contact, Terms, Privacy, error page, emails at /emails.
- Dev server: `npm run dev:harbour` now builds into .next/dev-harbour (Turbopack watched its own cache in .next-harbour and reloaded the page every few seconds). Builds and starts still use .next-<palette>.
- Flights critic round 1 (high): 6.6 FAIL (design 7, originality 6, craft 6, functionality 8). No copy or design tells. All 10 issues fixed (tab bar over Pay at 390, ground band behind the pinned search, 20 cards at a time, error summary names the traveler, title follows gender, travelers in the checkout summary, sold-out panel focus, inclusion cards align, terminal numbers, Stops prices in the sheet, card country, disc ticks).
- Hotels critic round 1 (high): 6.8 FAIL (design 7, originality 6.5, craft 6.5 capped, functionality 7.5). No tells. Fixed: Map pill steps aside over the footer, photo grid outer corners only, card arrows on hover, confirmation ticks, map centred on the pins, one card height, rail arrows only when the rail moves, two Casa Lanterna room photos replaced (Aquilion Property, Huy Nguyen), phone summary and one Continue on the forms, labelled location pin, Non-refundable row first, Lead guest heading, $250 slider, no photo on confirmations (spec 2b), single back links.
- Account and content critic round 1 (high): 6.8 FAIL (design 7, originality 6.5, craft 6.5, functionality 7.5). No tells. Fixed: selected tab hover, stay card column, focus after every profile action and after a cancel, traveler type from date of birth and gender required, toasts bottom left on desktop, banner and legal on the prose axis, Contact photo after the form on phones, log in gate keeps the deep link, rail current on forgot and reset, expired-link title, Delete my account in the error colour.
- Production builds of both palettes pass; Cabin dawn QA clean (lowest text 5.04:1).
- Final whole-site pass (xhigh, both palettes): 7.2 FAIL (design 7.5, originality 6.5, craft 7 capped by the List pill touching the map attribution, functionality 8.5). No tells; earlier fixes confirmed. Fixed after it and checked in the browser, not re-scored: filter column scrollbar, white cluster pill over the About banner, attribution clear of the List pill, bordered error panels, room cards fill the column, destructive cancel in the error colour, equal-height inclusion cards, Copy announced.
- Done: build/handover.md (pages, scores, QA, demo script, decisions, client and Copywriter items). Every server stopped. Good commit point.
- If resuming: nothing in plan.md is left; the redesign stages in status.md (O1, O2) are separate work.

## Where things stood after session 1
- Done: foundation (tokens, fonts, palettes, sprite and grade filters, header, More menu, footer, skip link, focus, reduced motion, 404) and the Home page, in both palette versions.
- Next: page 2 in build/plan.md, flight results (searching state, results, no results, fare changed, offer expired) with the first route handlers under app/api/. When a route lands, add it to `BUILT_ROUTES` in site/lib/site.ts so its links prefetch again.
- Read before resuming: build/plan.md, build/qa-report.md, this file, site/README.md.

## How to run it
- `cd projects/travel-booking/site`, then `npm run build:harbour && npm run start:harbour` (http://localhost:3001) and the same with `cabin` (http://localhost:3002). Dev: `npm run dev:harbour` / `dev:cabin`.
- Background shells started by the agent outlive their task ID on Windows: stop servers by the PID on the port (`netstat -ano | grep :3001`, then `taskkill //PID <pid> //T //F`).
- QA: site/tools/qa/page-checks.js through the Playwright run-code tool (it needs the file path; set QA_URL and QA_WIDTH at the top).

## Critic scores, Home
| Round | Design | Originality | Craft | Functionality | Total | Verdict |
|---|---|---|---|---|---|---|
| 1 (high) | 7.5 | 7 | 7 | 8 | 7.3 | FAIL (total and originality under 8; no design or copy tells) |
| 2 (high) | 7.5 | 7 | 7 (capped: account cluster over the region pills on scroll-up) | 8.5 | 7.3 | FAIL (originality 7; uncapped craft 8.5 would make it 7.6) |
The skill allows two critic rounds per page. The round 2 fixes below were checked in the browser and by QA but not re-scored.

## What changed after each round
After round 1 (all confirmed by the round 2 critic):
- Focus moved into the search by the entry cards or band now shows the cell ring (is-kbd set by script).
- 404 keeps its 16px side gutter at 390.
- Destination cards: square slot (spec 2b) with the window inside, white bezels in both palettes, 3 columns at 1440 so six cards fill two rows, short rows centred when filtered.
- Hero preload removed (it lingered in the head after client navigation and warned on the 404); the first window image is eager with fetchpriority high.
- Rail and tab bar items rest muted and turn ink when current or hovered (the tint square alone was 1.5:1, 1.1:1 in Cabin dawn).
- Pre-footer band runs the full width beside the rail (it left cream notches on the full-bleed footer).
- Trust photo: phone and coffee (generic) replaced by hands holding a phone at a window seat.
After round 2 (checked in the browser, not re-scored):
- Account cluster shows only in the first 160px of scroll on desktop (it collided on the way back up). Pending Varun, see decisions.
- Destinations at 390: a sideways rail with the next card peeking (six stacked cards ran to about 2,700px); the page is 4,134px tall at 390, was 7,176.
- The footer rises 32px over the home band with a rounded top (Varun V7), which removes the 390 hairline seam and gives the two darks a step.
- Cabin dawn mat: --c-mat #A9D3DA (sky teal) changed to #EED7D5 (its cream value) in design/tokens.css; the teal mats were the loudest surface in both rounds and the teal focus ring was lost on them.
- 404 "Start a search" lands on /#search and now focuses From (desktop) or opens the sheet (phone).
- The fares note centres under the grid.
- Hotels entry card: the soft white-bed shot replaced by a sharp room with tall sheer-curtained windows (the alt's window is now in frame).

## Open, for Varun
Decisions (spec deviations I made, each easy to undo):
1. Desktop account cluster: the spec keeps it fixed with a white pill after 8px (Hipcamp). Fixed, it sits over headings, pills and photos while scrolling, a confirmed critic issue. Now it shows only near the top; Log in stays one click away through the rail's Account item; Sign up only at the top. Keep this, or go back to the spec and accept the overlap?
2. Destination window on the mat: square slot with a tall window inside (spec), rather than the full-width window I first built.
3. Trust panel photo: a phone at a cabin window. Critic round 2 called it on-concept but off-message (a camera viewfinder, not a booking) and counted it as a sixth window. Passport and boarding pass shots were considered and rejected (national emblems imply a market). Keep, or brief another subject?
4. Cabin dawn mat token changed to its cream (above).
5. Pre-footer glyph 440px tall at 1440, not the spec's 520 (the band is about 490px tall, so 520 would clip the window's ends).
6. Calibre is served from public/fonts with its own Bold preload instead of next/font: next/font preloads every weight in a family, and Thin is unused on most pages, which would log an unused-preload warning (a confirmed critic issue). Geist is next/font/local.
7. Trust panel photo slot: spec 2c says 4:5 at 1440, but the right half of a 1232 x 480 panel is about 5:4; the 3:2 photo covers it. Tablet uses 2:1 so the stacked photo stays under 500px tall.
For the Copywriter:
- Alts adjusted to the photos actually sourced (copy.md note 12): Mexico City "A cyclist passing a tiled colonial building on a city street"; Tokyo "A narrow lane of lantern-lit food stalls at night"; trust panel "Hands holding a phone up to a cabin window in low sunlight". Please confirm or rewrite.
- The combobox no-match line mentions "a three-letter airport code" on the Hotels destination list too; a hotels variant may read better.
- Facts repeat: the hero chips, entry card 2, trust rows 1 and 3 and the destinations note restate Stripe, email confirmation and "total before you pay" (critic rounds 1 and 2).
- Region filter: no live announcement of the new count, because copy.md has no "N cities" string. A short line would let screen readers hear the result.
- Travelers cell: copy.md's example "2 adults, 1 child, Business" shows as "3 travelers, Business", the prototype's round 2 rule that keeps the cell from clipping.
- "Same day" in the calendar hint for a same-day return (from the approved prototype; copy.md does not cover it).
Not done or not checked:
- Destination prices from the visitor's last origin ("from New York"): the mock data only has fares from London, so the note always says London.
- Hero grade: critic round 2 saw a slight cool cast in panes 1 and 2 (Art Director's grade, unchanged).
- Real phones, Safari, Firefox, screen readers; tablet widths and landscape phones only by layout rules, not captured.
- Computed outline widths read 1.6px in this headless browser although the CSS says 2px and DPR is 1; screenshots show the 2px ring.

## Assets
- 11 Unsplash License photos, each checked on its photo page: site/public/images/credits.md. Sources in site/assets-src/ (not published).
- Geist 1.5.1 variable woff2 and licence from the geist npm package on jsDelivr (SIL OFL), no package installed.
- No package was installed. sharp (already in node_modules as Next's dependency) builds the images.

## Commit point
Home and the foundation are a good commit point for Varun (see the final message for a suggested commit message).

## Round 3, Developer A (Part A: homepage below the first two sections, the product switch, footer), 2026-11-11 from 15:24
Interface for Developer B (agree or tell me):
- lib/mock/home.ts (mine): reads HOTELS from lib/mock/hotels and DESTINATIONS from lib/data/destinations at runtime and computes deals, recommendations, trending, month lows. Until the catalogue lands it carries the catalogue's 24-city table (section 1) as its own fallback.
- lib/history.ts (mine, new): recordSearch(entry), recordView({kind, id}), readHistory(), clearHistory(). Stored in localStorage `overwing:v1`, key `history` (spec 0.6). Developer B: please call recordSearch on flight results load and recordView({kind:'hotel', id}) on hotel detail load.
- components/ui/Score.tsx (`a-score`) and components/ui/Save.tsx (`a-save`), styles in app/styles/r3-ui.css (mine, new): shared, import them.
- City photos: I source the 18 new destination photos into public/images/destinations/ and 6 property type photos into public/images/home/.
Shared files, small additions only:
- app/layout.tsx: import of app/styles/r3-ui.css and r3-home.css.
- app/styles/tokens.css: the spec 0.3 tokens block.
- components/chrome/Header.tsx: Flights and Hotels hrefs become /?mode=flights and /?mode=hotels.
- components/search/Search.tsx: listens for the mode event (overwing:mode) and records the search in history on submit.
- tools/images.config.json, lib/images.manifest.json, public/images/credits.md: appended entries.

## Round 3, Developer B (Part B: inner pages and the catalogue wiring), 2026-11-11 from 15:24
Owns: lib/mock/ (except lib/mock/home.ts), lib/data/, components/flights, hotels, booking, account, app/styles/results.css, hotels.css, booking.css, account.css, and their routes under app/flights, app/hotels, app/checkout, app/confirmation, app/bookings, app/account.
- [x] Catalogue wiring (15:24 to 15:45): tools/catalogue.mjs parses content/mock-catalogue.md into lib/data/catalogue.json (rerun it when the catalogue changes). lib/mock/catalogue.ts types the 24 cities, 6 regions, route airlines and 12 airlines with fare families. lib/mock/hotels.ts builds HOTELS from the catalogue and keeps the eight original hotels' ids, photos, rooms and prices; every hotel gains type, score, reviews, highlights, house rules, nearby, rooms with rate plans and rooms left. lib/mock/flights.ts: 12 airlines, the catalogue's airlines per London route (first one owns the cheapest offer), fare families per airline (ids by position: light, classic, flex, plus), fares that move by date (never under "Return from"; demo dates and past dates unchanged), lowestTotal, dayLows, monthLows. Export names unchanged (HOTELS, DESTINATIONS, AIRLINES, FARES).
- [x] Spec A14 date defaults (asked by Developer A): a missing or past date fills in as today + 21 (+7 return, +3 nights for hotels).
- Hotel photo pool: lib/data/hotel-photos.ts (this design's 31 hotel photos). Each city's hotels lead with different photos, so no two neighbouring results repeat a lead photo.
Shared files, small additions only: lib/data/places.ts (9 airports, 2 hotel cities), lib/mock/geo.ts (9 airport positions).
- [x] Catalogue finished at 15:51 (ends "Catalogue complete."): parser rerun, 96 hotels (24 showcase). The 72 short hotels get 6 reviews from the section 4 pool (band rule, fit tags, seeded, months Oct to May) and guest scores from the section 4 formula, so every hotel has reviews and category bars. Deals (section 5) and recommendation rows (section 6) are parsed into catalogue.json as raw rows for Developer A's lib/mock/home.ts; the lower hotel rates in section 5 are not applied to hotel prices yet (open).
- [x] Hotel photo pool: 26 new Unsplash License photos (rooms, bathrooms, pools, balconies, facades, apartments, lobbies, breakfast), each checked on its photo page, credited in public/images/credits.md (round 3 hotel pool), built by tools/images.mjs; pool now 57. The original eight hotels' photos stay with their own city (no Lisbon tiles in Rome, no Tokyo river in Paris); each city's hotels lead with different photos.
- [x] Pages built (P1, plus some P2) by three forks of this session on separate files, then checked in the browser by me:
  - B1 flight results: 7-day date strip (URL change, Back works), Best / Cheapest / Fastest tabs, 7 sorts, 10 filter groups with counts and from-prices, 24-bar price histogram, active chips, drawer at 641 to 1024, phone chip row and sheet, cards with our airline mark (window disc), included-item icons, boarding-stub price column, save chip against the typical fare, details in place, 15 per page, expired banner. recordSearch on load.
  - B2 flight details: each airline's 3 or 4 fare families side by side with aligned rows (Personal item, Cabin bag, Checked bags, Seat choice, Changes, Refund), bags table, changes and refunds, per-traveler-type price split, timer. Priority boarding and Meal rows left out: the catalogue has no data for them.
  - B3 travelers: age band heads, passport fields for any border crossing (rule changed in lib/mock/flights.ts), contact card with country code.
  - B4 checkout: price recheck step, per-type lines, terms card, "Pay $X", Stripe line with shield, 390 total bar, rate plan carried through. B5 confirmation: timeline, Add to calendar (.ics), cross-sell row of 4 stays (or flights for stays). B9 to B11: next trip card with countdown, tab counts, recently viewed, receipt, documents, Contact support with the reference, home airport, recent searches with Clear history.
  - B6 hotel results: filter column from 1280 (drawer below), 8 sorts, card anatomy with score, type and stars, distance, best room, plan ticks, rooms left, total and nightly; mini map plus full map dialog; the type param pre-selects property type (type=boutique and Developer A's type=boutique-hotel both work).
  - B7 hotel detail: gallery and lightbox by category, sticky section nav, overview with Read more, highlights row, amenities dialog by catalogue group, availability with one row per rate plan and a Reserve card, reviews with category bars, traveler-type chips and sort, location with What's nearby, house rules table, 5 questions from the hotel's own data, similar stays. recordView on load.
  - B8 guests: someone-else toggle, arrival time, requests, summary with plan terms.
  - Step bar (components/booking/Steps.tsx) on flight details, travelers, guests and checkout: three stops on a line, no numbers.
- [x] QA at 1440, 1024 and 390 (build/qa-report.md, Round 3 Developer B). Two bookings to confirmation before the critic: stay 88K3TE ($936.00), flight 39UFZP ($1,368.00).
- [x] Critic, one round, high effort, foreground, 16:01 to 16:13. **Benchmark rubric 7.9 FAIL** (depth 8.0, ease 8.3, visual 7.8, craft 7.0 capped, pricing 8.0, mobile 8.0). **Studio rubric 7.5 FAIL** (design 7.5, originality 7.5, craft 7, functionality 8.5). Cap: craft at 7 for overlapping map pins and clipped date-strip caps. Copy tell: "Journey duration" (banned word). No design tells. The critic booked D6DYTF and 67NA42 end to end.
- [x] Fixed after the critic, worst first (checked in the browser at 1440, 1280, 1024 and 390, not re-scored; one round allowed):
  1. bag and flexibility filters count and price from the cheapest fare that meets them;
  2. passport, nationality and expiry on every international trip (London to Lisbon included);
  3. map pins pushed apart when they collide, the hovered or selected pin on top;
  4. hotel results: filter column always visible from 1280, 3 more sorts (highest total, guest score and price, most reviewed), one header line;
  5. step bar on details, travelers, guests and checkout;
  6. Terrace Suite: compact unavailable row with "Available for stays of five nights or fewer." (catalogue rule);
  7. checkout, travelers and guests forms run the full column, no dead gap before the summary;
  8. hotel rate cards at 390: price under the plan text;
  9. "Journey duration" renamed "Total travel time"; "From $1,302 total"; "+$132.00" with the comparison in the accessible name;
  10. login states the demo account rule; duplicate React keys fixed; cross-sell prices in whole dollars with equal card heights;
  11. date-strip caps whole at 390; the fare rail and bags table no longer widen the page at 390 (hidden labels escaped their scrollers).
  - Not taken: the critic's "runner-up in the other tabs" for repeated summary tabs. Tried, but the Best tab then named a different flight from the card tagged Best; reverted so a tab, its sort and its card tag always agree.
- [x] After the fixes, 16:20 to 16:35 (checked in the browser, not re-scored):
  - Lower hotel rates (catalogue section 5) now priced in the backend with the same rules and rounding as Developer A's homepage deals (weekend: Friday and Saturday nights; weeknight: Sunday to Thursday within 30 days; long stay: 4 nights or more starting within 60 days; next month). A deal's price is the price on hotel results, the rate rows, guests, checkout and the booking (Hotel Sal e Vela this weekend: $265 a night, $530.00 for 2 nights at every step). Results cards and rate rows show the shared a-save chip: "Weekend rate, $94 under the usual price". The eight original hotels carry no lower rates, so every demo price holds ($1,302 and $744.00 unchanged).
  - New hotels' map positions keep to the land side of coastal cities (Lisbon, Barcelona, Amsterdam, New York, Tokyo, Singapore, Sydney, Cape Town); Hotel Sal e Vela no longer sits in the Tagus.
  - Summary tabs: each shows the top flight of its own sort again, so a tab, its sort and the tagged card agree.
  - Logged-in /bookings, /bookings/K7MQ2D, /bookings/S4T9LW and /account checked (the critic could not log in): all render, no console errors. Recently viewed widened /bookings at 390 (grid item without min-width); fixed.
  - Regression sweep, 12 pages at 390, 1024 and 1440: 200, no console errors, no horizontal scroll.
  - Hotel map dialog from 641px: a large panel inset 32px (up to 1280 wide) instead of the 560px reading dialog; pins and the hotel strip have room.
- Open (next round): the map's collision pass can push a pin onto water in a dense cluster (one Lisbon pin at the zoomed-out dialog view); Priority boarding and Meal rows need catalogue data; room quantity select; next free dates for unavailable rooms; Cabin dawn (3002) not checked this round (server not running); hover pairs and reduced motion not re-checked on the new parts.



## Developer B, round 2 (round 3 Part B, second critic round on the inner pages), 2026-11-11, 16:35 to 16:50
- [x] Critic, one round, high effort, foreground, 16:37 to 16:41, at 1440 and 390 on 3001: **benchmark 8.0 FAIL** (depth 8.0, ease 8.3, visual 7.8, craft 7.8, pricing 8.2, mobile 8.0; was 7.9), **studio 7.6 FAIL** (was 7.5). The round 1 craft cap no longer applies. No design or copy tells. The 16:28 no-disclosure ruling was broken in Part B (demo reviews notice) and in the footer (Developer A's). Report: build/critic/r3-inner-b2/report.md.
- [x] Fixed, worst first, each checked in the browser (not re-scored; one round allowed):
  1. No-disclosure ruling, Part B: the "Demo reviews" notice removed from hotel results (filter column and results note, which keeps the tourist tax line), the hotel page (twice), account and booking cross-sell rows; "Demo payment" card hint removed from checkout; "Demo account" hint removed from log in. Checked: no demo wording from Part B on hotel results, hotel page, fares, travelers or log in at 390 and 1440. The footer notice is still there (Developer A owns the footer; not touched).
  2. Pin on water: hotels now sit at their own neighborhood's centre (lib/mock/hotels.ts DISTRICT, all 96 neighborhoods in the 12 cities, on land, nudged up to about 50m), and the map's collision pass tries moves toward the city's land side first (StayMap `toward`, from landBearing). Lisbon map dialog at 1440: every pin on land, $642 in Alcântara, Hotel Sal e Vela's $889 in Belém, no overlaps (build/qa-shots/r3b2-mapdialog-1440-navy-studio.png). The original eight hotels keep their own coordinates.
  3. Fares page: one countdown (the summary's "Fare held for"); the pill beside "Choose your fare" removed.
  4. Fare grid: a fee cell that already names a price no longer adds ", for a fee" ("Changes before departure, $60 per traveler plus any fare difference").
  5. Hotel page at 390: the pinned compact search steps aside, so the section nav sits under the header; reading room up from about 590 to 668px (build/qa-shots/r3b2-hotel-detail-390-navy-studio.png). Dates and guests still change in Availability.
  6. Travelers and checkout summary: one line per flight with times and flight numbers ("LHR 18:45 to LIS 21:30, LP 207"; "+1" for next-day arrivals) (build/qa-shots/r3b2-travelers-summary-1440-navy-studio.png).
  - Sweep at 390: hotel results (Lisbon, Sydney), Hotel Sal e Vela, fares, log in: no horizontal scroll, no console errors.
- Open (next round): 8 stays per city against Booking.com's dense lists (needs more catalogue hotels; the largest depth gap); Priority boarding and Meal rows (catalogue data); the footer demo notice (Developer A); checkout and guests not seen by the critic this round; 1024, hover pairs, reduced motion not re-checked on today's changes; other coastal maps (Sydney, Cape Town, Singapore) checked for overflow only, not pin by pin.
- Good commit point: "Overwing round 3 Part B round 2: no demo disclosures on inner pages, pins in their own districts and pushed inland, one fare countdown, flight times in the trip summary, hotel page chrome at 390".

### What Developer A built (Part A), 15:24 to 16:15
- [x] Shared pieces (spec 0.4): components/ui/Score.tsx (`a-score`, the score in a window), components/ui/Save.tsx (`a-save`), app/styles/r3-ui.css (a-score, a-save, a-alMark airline monogram, a-blind, m-tabs, m-rail, m-hcard, m-acc). Spec 0.3 tokens appended to app/styles/tokens.css (both palettes; contrast measured: save-ink on save 6.4:1 navy, 10.0:1 cabin).
- [x] Data: lib/mock/home.ts (server; reads CATALOGUE_CITIES, ROUTE_OPTIONS, AIRLINES, generateOffers, lowestTotal, HOTELS, PROPERTY_TYPES from Developer B's modules, so the 12 hotel cities and 96 hotels came through on their own); lib/recommend.ts (browser, pure: catalogue section 6 rows, trending); lib/history.ts (spec 0.6, `overwing:v1`.history; lib/store.ts now keeps the stored history when it saves).
- [x] A1 switch: components/home/r3/HomeModes.tsx. Hero tabs, rail and tab bar set the mode; ?mode= in the URL (pushState), Back and Forward (popstate), title, polite status, blinds on sections near the viewport, reduced motion swaps at once, server renders the mode from searchParams. Old /#hotels links are read as the mode.
- [x] A0: hero lead swaps (HeroLead.tsx); hotel entry card first in hotel mode (DOM order, critic fix); 390 hero 24px more bottom padding.
- [x] A3 Pick up where you left off, A4 Recommended for you (catalogue rows as pills, rail), A5 deal banner, A6 deal cards (#deals), A7 trending, A8 explore by region / property types, A9 cheapest months (#when) / this weekend (#weekend), A10a booking steps, A11 questions (#faq), A12 by city (#city-grid, #city-<region>), A13 band label. Components in components/home/r3/ (Cards.tsx, Sections.tsx), styles in app/styles/r3-home.css.
- [x] A14 footer: components/chrome/FooterCols.tsx (six columns, 42 links, all unique, dates after hydration, accordions at 390 with Support open), facts row, photo under the top third. Anchors #payments, #changes on /terms and #cookies on /privacy (LegalNotice `anchors`, text unchanged). QA: every href 200 with results, every hash target present in the right mode.
- [x] Photos: 48 new Unsplash License photos (two per city for the 24 cities, six property types), all credited in public/images/credits.md, none from the other design.
- Shared files touched (small additions): app/layout.tsx (two CSS imports), app/styles/tokens.css, app/styles/chrome.css (footer block), components/chrome/Header.tsx (?mode= hrefs; quiet switch below the hero), components/chrome/Sprite.tsx (4 icons), components/search/Search.tsx (mode event, recordSearch), lib/client.ts (MODE_EVENT), lib/store.ts (keeps history), components/pages/LegalNotice.tsx and app/terms, app/privacy (anchors), tools/images.config.json, lib/images.manifest.json.

### Deviations from the spec, and why
- Deal banner line: "for the dates shown" instead of "for travel before December 15" (our deal dates run past it). Critic accepted.
- Deals use the catalogue's 12% rule (section 5), not the spec's 10%.
- Recommended: the catalogue's row titles as pills under one "Recommended for you" heading. Critic accepted.
- Trust panel: the spec's three facts under the ticks were left out after the critic found each repeats a tick (filler cap).
- Rail and tab bar below the hero switch in place without scrolling to the search (critic: the spec's scroll lost the visitor's place).
- Footer: "Your booking documents" and "Contact us" duplicated /bookings and /contact; replaced by "Flights by city" and "Hotels by city" (42 unique).
- Cheapest months: bars show each month's average lowest return (the monthly minimum is the same in most months in the mock), with the cheapest date in the caption.
- Proposed microcopy for the Copywriter (not in copy.md, the spec or the catalogue): "Pick up where you left off" card price lines, deal card "for 1 adult in Economy, taxes and fees included" and "Typical fare $X", the by-city sublines, the chart caption, "Help and contact" beside the FAQ heading.

### Critic, one round (high, foreground, about 16:00 to 16:06): benchmark 7.6 (FAIL, target 9.2), studio 7.9 (FAIL). Report: build/critic/r3-home-a/report.md
Fixes, worst first (16:06 to 16:15), each checked in the browser:
1. Photo repetition: a second photo per city (24 new); recommended, deal cards, region windows and hotel trending use it; no file now shows in two neighbouring sections (62 images, 38 files, 4 files used 3 times, none adjacent).
2. Clipped blurbs in Explore by region: no clamp, they wrap.
3. Repeated facts: deal cards now say the saving once (chip), the middle line carries airline, stops and time; the trust chip row removed.
4. Cheapest months: monthly averages, three marked, cheapest date named (from two days out).
5. Rail Hotels / Flights below the hero switch in place (scroll stayed at 2700 in the test).
6. Entry card order in the DOM.
7. Rail arrows hidden when the cards fit; recent search cards show the fare or nightly rate; "1 adult" wording everywhere.
8. Banner saving as a line with the icon, not a chip that wrapped into three lines.
9. Footer duplicates replaced (42 unique).
10. Pre-footer: dead space under the band cut by 56px.
Open: placeholder phone and email in the footer (client facts needed); Cabin dawn not checked this round (3002 not running); pill caps weight (spec choice, kept).
After the critic fixes (16:15 to 16:22):
11. Hotel photos from the shared pool repeated inside rows (two cards with the same room photo): each row now takes each hotel's first photo not already used in that row (lib/recommend.ts photoPicker). No photo repeats within a row or in neighbouring sections in either mode (checked by script).
12. Chart: the bars are the focusable links (labels read month, average, lowest); the screen-reader table is plain text and wrapped so it no longer widened the page at 390 (it caused a 438px scroll width).
13. Cabin dawn previewed by setting data-palette="cabin" in the browser (3002 is not running and no other server may start): the banner line was white on blush from pages.css's `.o-banner__line`; all banner classes renamed to `o-dealBand__*`. Banner line now 6.1:1 on blush (navy 9.3:1). Other panels read correctly.
14. Old links: /#search-hotels lost the mode (the hero search strips the hash in its own effect first); the hash is now read during the first render. After /#hotels the title stayed "Book flights" (Next.js re-applies the stored title after history changes it did not make); a guarded observer keeps the mode's title on the home page only. Checked: /#hotels and /#search-hotels land on /?mode=hotels with the hotel content and title; Back, Forward and a client navigation to /about keep the right titles.
QA after fixes: no console errors; no horizontal scroll at 390 and 1024; reduced motion swaps at once with no blinds and keeps the scroll; focus rings seen on cards, pills and buttons (screenshots); footer 42 unique links all 200.
Link sweep (16:23): all 247 distinct links on the homepage in both modes return 200; sampled searches render results whose lowest totals match the cards (London to Tokyo $1,212.00, London to Lisbon $412.00).
Hard stop status: Part A done; no second critic round (one allowed), so the 7.6 benchmark score predates the 14 fixes and is not re-measured.
Good commit point for Varun (Part A): "Overwing round 3 Part A: homepage swaps with Flights / Hotels in place (?mode=), deals, recommendations, trending, browse, timing, steps, FAQs, by-city directory, 42-link footer, 48 new city and property photos".

## Developer A, round 2 (round 3 Part A, second critic round on the homepage and footer), 2026-11-11, 16:22 to 16:40
Critic, high effort, foreground, on 3001 (navy), both modes, 1440 / 1024 / 390: **benchmark 7.8 FAIL** (was 7.6; depth 7 capped by filler, ease 8.8, visual 8, craft 7 capped, pricing 8.8, mobile 8), **studio about 8.0 FAIL**. No copy tells, no design tells. Report: build/critic/r3-home-a2/report.md. The new score predates the fixes below and is not re-measured.
Fixes, worst first, each checked in the browser (scripts plus screenshots fix-*.png in build/critic/r3-home-a2/):
1. 390 Trending rail rested flush at x=0 (the craft cap): `scroll-padding-inline` on `.o-trend__wins` and `.o-recent__list`; first card now at x=16.
2. Repeated facts: the deal banner now takes the two biggest savings outside the 8 deal cards, the trending windows and the first-visit Recommended row (flights: Rome, Paris; hotels: stay deals 9 and 10). "Stays for this weekend" leaves out hotels in the Recommended rows and the first 8 stay deals (lib/recommend.ts weekendStays); the first-visit hotel rows leave out the 8 stay deal hotels. Hotels mode: 26 hotel cards, no hotel twice.
3. Hotel photos: a page-wide map (lib/recommend.ts hotelPhotoMap) gives each hotel its own pool photo in page order (Recommended, stay deals, weekend). One repeat left: a twin room in Recommended and the weekend row (far apart; that hotel has no free photo left in Developer B's pool).
4. City photos: lib/recommend.ts cityPhotoPlan assigns each city's two photos across Recommended, banner, deal cards and region windows; the six trending windows are now the biggest savings among cities the first-visit Recommended row does not show (was a fixed six); the region tab opens on the region with the fewest cities already shown. Flights mode: no photo file twice at card or window size.
5. Pre-footer: from 1025 the line and button sit left and the window stands beside them at full strength (no text over the frame); the footer's photo layer is off, so the band ends on a flat ink edge.
6. Section demo notes removed (deal footnote now "Typical fare: the usual price for the same trip." / "Typical rate: ..."; stay rows say what the totals include). The footer's demo notice now names guest reviews too, so the one disclosure covers them.
7. Stay deal eyebrows shortened ("Weeknight, 5-star boutique hotel", one line in every card); deal card notes keep two lines' room, so prices share a baseline in each row; dates and "a night" never split.
8. 390 cheapest months: all 12 bars in two rows of six, no sideways scroll; a dot marks the month holding the cheapest date (Nov), explained in the caption and the bar's accessible name.
9. Trending list: 12 rows, now 812px beside the 871px window grid (was about 250px short).
10. Footer: five columns of near-equal height (Flights 8, Hotels 8, Regions 8, Deals and dates plus Your trips, Support plus Company), 372px each at 1440; still 42 unique links and 7 accordions at 390 with Support open. Placeholder phone set at 18px like the email.
Also: Lisbon deal eyebrow "Below the typical fare" is now "1 stop". Arrow keys, Home and End move focus between the month bars (checked: Right twice to March, End to the last, Left back one). Footer top padding 96 to 72px at 1025 and up (with the photo layer off it read as an empty band). Cabin dawn previewed with data-palette="cabin" on 3001: banner, deal cards and tabs read correctly (fix-cabin-banner-1440.png). Flights / Hotels state below the hero (critic's ease item): from 1025 a small switch docks in the empty centre of the top bar once the hero search is out of view (components/home/r3/HomeModes.tsx ModeDock, styles in r3-home.css); it sends the same event as the rail, so the swap keeps the scroll (checked at 2700), sets ?mode=, the title and every heading; hidden and out of the tab order while the hero shows; no transition under reduced motion (fix-modedock-1440.png).
QA after fixes: no console errors or warnings; no horizontal page scroll at 1440, 1024 and 390 (both modes checked at 390); no em dashes in changed files.
Deviations from the spec, and why: banner shows deals outside the first row (spec: the two biggest; critic: repeated cards); trending windows computed, not the fixed six; footer five columns with stacked groups (spec: six; critic: ragged columns); footer photo layer off (spec A14 kept it; critic: murky top); A6 footnote reworded without "demo".
Not done (time): photos matched to property type (houseboat, riad) need new photos in Developer B's pool; hover pairs and reduced motion not re-checked on the changed parts; no re-score.
Good commit point for Varun: "Overwing round 3 Part A, second critic round: no repeated cards or photos across homepage sections, docked Flights / Hotels switch, clear pre-footer window, 12-month chart at 390, even footer columns".

## Cleanup round (16:46 to 16:53, Developer, Varun's 16:28 ruling: no demo disclosures)
JOB 1, done 16:49. Removed: footer demo notice (and its CSS); legal pages now keep H1 and anchors (#cookies, #payments, #changes) with one neutral line that the full text comes from Overwing and is available on request (no legal terms written), the "in the meantime" wording dropped and the cream notice box removed; contact result now shows copy.md's live success line ("Thanks, your message is on its way. We'll reply to <email>."); email footer demo paragraph; reset link token=demo; unused REVIEWS_NOTE constant and imports. Developer B had already removed the sign-in hint, checkout payment note and the review and deal notes. The calendar file (UID @overwing.example, PRODID Overwing) carries no demo word; the footer never linked the email previews; /emails stays. The rendered pages and the emails on 3001 were scanned: no hits.
JOB 1c critic (high, dev server 3001, navy, 16:49 to 16:51): benchmark 8.2 (depth 8.3, ease 8.7, visual 8.0, craft 8.0, pricing 8.3, mobile 8.0), studio about 7.9. Developer A's footer, docked switch, deal eyebrows and 390 scroll fixes landed; Developer B's 390 hotel nav and demo notice removal landed. No orphan gaps where the lines were removed.
Fixed after: stay cards lead with room, building or view photos, falling back to bath or food shots last (lib/recommend.ts hotelPhotoMap); the hotel section nav fades at its right edge on phones (hotels.css). Not re-scored.
Open: (1) the footer phone +1 (555) 010-0199 and hello@example.com read as demo values; these are the approved 2b contacts and need Varun's or the client's real details, not changed; (2) footer top band at 1440 is sparse (critic suggests a wordmark and less top padding); (3) stay deal cards lead with the nightly rate, results lead with the total; (4) home at 390 is 13,328px tall. The date strip "arcs" the critic flagged are the cabin window caps, by design.
JOB 2 not run: npx tsc was refused permission twice (about 16:51 and 16:52), so no type-check, no production builds, no 3005 check. Developer B's Sections.tsx type error is unverified.
