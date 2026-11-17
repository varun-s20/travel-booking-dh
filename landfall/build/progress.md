# Landfall build: progress
Read this first if you are starting cold. Plan and page contracts: build/plan.md. QA: build/qa-report.md. Skeleton history: build/plumbing.md.

## 2026-11-11, Developer: app skeleton (done)
- landfall/site/ has the simulated backend, the non-visual logic, the palette runner (navy 3003 default, harbour 3004). Details and the 15 Overwing assumptions: plumbing.md.

## 2026-11-11 (04:13 to about 05:20), Developer: plan, foundation and homepage
- build/plan.md: every page and state, groups F and H, contracts, file ownership.
- Foundation and home built, QA'd at 1440 and 390 in both palettes, one critic round, fixes applied (below).
- Tokens: app/styles/tokens.css is a straight copy of landfall/design/tokens.css. The first copy (04:21) was taken before the "Palette distinctness" heading existed, but the file already held those values (changed at 04:18); it was recopied once the heading appeared (identical), and again after the Chief Officer's two notes (navy #16225A, --c-band). Recopy it whenever tokens.css changes; never edit the copy.
- Palette roles changed mid-build (Palette distinctness, "teal acts, navy speaks"): every button fill and selected state uses --c-action, --c-on-action and --c-action-hover; links and the focus ring on light are navy; the ink halo sits behind focus rings on the photo.

### Critic round 1 (home, both palettes, 1440 and 390), about 05:00
- **6.45 FAIL**: design 7, originality 6, craft 6 (overlap cap), functionality 7. No design tells, no copy tells.
- Hero re-score (handover note 3): 1440 **6.45**, 390 **6.55** (Art Director's round 1 was 6.25). Fixes 1, 2, 5, 7, 9, 10 held; 3 failed and 6 was partial (both now fixed, below); 4 and 8 not re-scored.
- Fixed after the round (checked in the browser, not re-scored by the critic):
  1. Compact bar over the hero caption at 1440: the bar now appears only once the photo's bottom has passed the bar's bottom; caption, pause and tabs fade 160px earlier. Also fixed the cause of the caption reappearing: React rewrote its class on every crossfade, wiping is-covered (swap class moved to the children). Checked from 560 to 1000 in 20px steps: no bar over the photo, no visible caption under 160px.
  2. Floating bar with no backing: a ground strip runs from the top of the screen to 12px under the bar while it floats (the header's strip does it when docked).
  3. Dates never took focus: the calendar's focus request was cancelled by its own re-render; it now stays until it lands. The card is inert behind an open sheet at 390.
  4. Promo photos: the oversaturated cafe photo is replaced by a dusk canal terrace in Utrecht (credits.md), so the three rows share one dusk family; all three carry --fx-grade.
  5. Stale status chip: guidance lines clear when their panel closes; "Lisbon added." alone when dates are already set (and Dates does not reopen).
  6. Header at 390 after scrolling back up: turns solid once the tabs have faded.
  7. "Fly here" over Lisbon at 4.3:1: the corner fade widened about 40px.
  8. One month in the 390 Dates sheet: two months, stacked below 641px.
  9. theme-color now #1B2A6E (the revised --c-theme).
  10. Lisbon card edge against white: a 1px ink hairline at 12% inside every destination photo.
- Not acted on: the critic's originality 6 ("familiar travel layout") and "a lighthouse illustrating Stripe says nothing". The concept carries through inner pages (the landfall line on legs, totals and confirmation): that is groups F and H's job.

### Chief Officer checkpoint (standing in for Varun, two calls, foreground)
- **Call 1: APPROVED WITH NOTES.** The foundation and homepage answer the client's asks (search first, strong water-city photos, total-first fares, deep navy, white and teal, a tidy 390 with Search in the first screen) and are plainly a different design from Overwing. No taste or copy tells. The critic's originality 6 is to be answered on the inner pages, not this page.
  - Ruling (a): the ink pre-footer and footer in the navy palette: **approved** (#121839 still reads deep navy; keeps "no navy wall" true; Harbour unchanged).
  - Ruling (b): the Utrecht canal terrace photo: **approved** (city meets the water, the three rows read as one family, alt matches).
  - Note 1, fixed: --c-navy #1B2A6E read royal, not the client's "deep navy". Changed to the Art Director's measured candidate **#16225A** (same hue 229; white 14.9:1, shallows 9.4:1, on-dark muted 9.1:1, navy ring against teal 4.6:1) in landfall/design/tokens.css, with --c-theme and the layout's theme-color; recopied into the app. A one-token swap made by the Developer (the Art Director's palette pass was finished); the comment in tokens.css says why.
  - Note 2, fixed: --c-band moved from global.css into landfall/design/tokens.css, both palette blocks (ink in navy, sea in Harbour). Group pages read their dark surfaces from it.
- **Call 2: APPROVED.** Both notes closed (checked in the browser at 1440 and 390; Harbour unchanged). It asked for three stale contrast comments in tokens.css to be updated to the new navy (focus 14.9 and 4.6, on-dark muted 9.1, shallows 9.4): done and recopied (comments only, no rebuild needed).
- Its watch items for groups F and H (also in "Open items" below): originality must rise on the inner pages (the landfall line on flight legs, the itinerary timeline, above every booking total and on the confirmation, nowhere else); teal fills every button and selection with an ink label, navy never fills a button, no glow, gradient or hover shadow; the price rule on every price; a real water-rule photo in every slot (404, sign-in pages, confirmation, hotel pages), Landfall's own, each in credits.md; placeholders stay marked; **group F's first critic round also re-checks the ten home fixes** (compact bar from 560 to 1000px at 1440, the header after scrolling up at 390, Dates focus, two months in the 390 Dates sheet); shared files take small logged additions only.
- It saw 404 prefetch errors in the console for /contact, /about, /login, /bookings, /account, /terms and /privacy while it moved the pointer over chrome links: Next still prefetches on hover for links to routes that don't exist yet. They stop once group H builds those routes. On load there are none.

Good commit point: plan, foundation and homepage, with the Chief Officer's approval.

## What exists (landfall/site/)
```
app/layout.tsx          fonts, tokens and stylesheets, sprite, data-app wrapper (skip link, Header, main, Footer), Toaster
app/fonts.ts            next/font/local: Newsreader and Albert Sans (app/fonts/, OFL files beside them)
app/page.tsx            Home: Hero, CompactSearch mode="home", Destinations, HowTo
app/styles/tokens.css   copy of landfall/design/tokens.css (never edit here)
app/styles/global.css   everything shared (see its banner for the order)
app/styles/home.css     home sections below the hero
app/styles/flights.css  group F (empty, imported)
app/styles/hotels.css   group H (empty, imported)
components/chrome/      Sprite (icons), Header (header, menu sheet, account menu, the scroll job), Footer (pre-footer band and footer), Toaster
components/search/      store.ts (shared search state and text), SearchCard, Calendar, CompactSearch
components/ui/          Icon, Photo, Button and ButtonLink, Field (TextField, PasswordField, SelectField, TextArea, Checkbox, ErrorSummary), Dialog, Notice, Price, PriceBar, Accordion, SplitText
components/home/        Hero, Destinations, HowTo
components/flights/     group F (empty)
components/hotels/      group H (empty)
lib/                    as plumbing.md, plus: client.ts SearchSeg and requestSearch(mode, seg, message); data/destinations.ts image and alt per city, destinationPhoto()
lib/images.manifest.json written by tools/images.py; never edit by hand
public/images/          hero/, destinations/, promo/ and credits.md
tools/images.py         crops and cuts photos (Pillow), writes the manifest
assets-src/promo/       downloaded originals (not published)
```
Scripts: `npm run build:navy`, `build:harbour`, `start:navy` (3003), `start:harbour` (3004), `dev:navy`, `dev:harbour`. No packages were installed.

## Shared components: how to use them
- **Page shell.** Inner pages wrap content in `<div className="t-page -search t-<page>">` when they show the pinned search, or `t-page` without it. Put `<CompactSearch flights={search} />` or `<CompactSearch stays={search} />` (from parseFlightSearch / parseStaySearch) at the top of the page: it seeds the shared search state, shows the pinned bar docked under the header, and opens the search in place (card dropping from the bar at 1025 and up, a full-screen sheet below). `requestSearch('flights', 'dates')` from lib/client.ts opens it on a field ("Change dates" buttons). Layouts: `.l-container` (1248), `.l-narrow` (680 reading column), `.l-split` with `.l-split__aside` (760 main plus a 392 sticky summary at 1025 and up).
- **Type classes.** `t-display t-h1` (page titles, Newsreader), `t-display t-h2` (section headings), `t-h3`, `t-title`, `t-lead`, `t-body`, `t-read` (legal), `t-small`, `t-label`, `t-muted`, `t-num` (tabular figures for prices, times, references), `t-ref` (booking reference), `t-code` (airport codes). Newsreader only on H1, H2 and city names.
- **Buttons.** `<Button>` and `<ButtonLink href>`: variant 'primary' (the action fill: teal with an ink label in navy, sea in Harbour), 'bright' (on dark bands), 'ghost' (secondary); `inner` inside search surfaces (12px radius), `block` full width, `arrow`, `icon`. Never fill a button with --c-navy or --c-accent: use the action roles (Palette distinctness). Text buttons: `.a-textbtn`; inline links: `.a-link` (navy).
- **Fields.** `TextField`, `PasswordField`, `SelectField`, `TextArea`, `Checkbox` take `label`, `error`, `hint`, `optional` and any input props; errors are tied by aria-describedby. `ErrorSummary({ title, errors: [{ id, message }], version })` takes focus each time `version` changes. Rows: `.m-field__row -two` or `-three`.
- **Dialogs and sheets.** `<Dialog open onClose title footer sheet wide initialFocus>`: portalled to body, app inert, focus trapped, Escape and backdrop close, focus returns. `sheet` makes it full-screen below 1025 (filters, sort, price breakdown).
- **Toasts.** `toast('Copied')` from lib/client.ts; the Toaster in the layout shows it. Messages: landfall/content/copy.md, Toasts.
- **Photo.** `<Photo name="destinations/lisbon-tagus-golden" sizes="..." alt="..." fx fy className />`; `box={false}` for a bare picture; `grade={false}` for Duffel photos and airline logos (the grade is for stock photos only). Add photos: originals in assets-src/<topic>/, a CROPS line in tools/images.py, run `python -I tools/images.py`, add a credits.md row after checking the photo page. `destinationPhoto('LIS')` gives a city's photo and alt.
- **Icons.** `<Icon name="arrow" size="sm|lg" />`; names in components/chrome/Sprite.tsx `ICONS` (search, plane, land, bed, pin, calendar, users, baby, seat, bag, ticket, card, refund, change, clock, doc, door, arrows and chevrons, check, tick, alert, info, error, filter, sort, copy, download, eye, eye-off, lock, mail, phone, signout, edit, trash, grid, expand, globe, map, star, and amenities wifi, coffee, gym, pool, spa, glass, parking, snow, paw, access).
- **Price.** `<Price total={cents} unit="$549.30 per traveler" onBreakdown={open} size="sm|md|lg" was={cents} left="Only 2 left" />`: total first and underlined, unit second, "taxes and fees included" always (the price rule; struck-through and scarcity only from API data). `.m-total` puts the landfall line above a booking total.
- **Price bar.** `<PriceBar total="$1,098.60" sub="for 2 travelers" onTotal={open} action={<Button>Continue</Button>} />`: fixed at the bottom below 1025, pads the page and lifts toasts.
- **Notices.** `<Notice tone="warn|error|success|info" title actions focusOnMount>`: fare changed (warn; success when it went down), payment declined (error, focusOnMount).
- **Others.** `<Accordion items={[{ id, title, icon, content }]} />` (fare conditions, Good to know); `.a-chip` (42px filter chips, aria-pressed); `.a-status -success|-warn|-error|-muted` (28px status chips); `.a-skel` (shimmer skeletons, still under reduced motion); `.a-texttabs` and `.a-texttab` (text tabs with the landfall line on the selected one); `.m-card -pad -link` (row cards); `.m-summary` (booking summary); `.a-landfall` (the brand line: plain, `-dark`, or `-leg` with `.a-landfall__label` on it for flight legs); `<SplitText as="h2">` (Kasa word reveal on headings).
- **Pre-footer band.** Shown on every page except the paths in Footer.tsx `NO_BAND` and `NO_BAND_PARTS` (checkout, confirmation, emails, auth pages, passengers, guests).

## File ownership (groups F and H build in parallel)
- **Group F** owns app/styles/flights.css, components/flights/, and the routes /flights, /flights/[offer], /flights/[offer]/passengers, /checkout, /confirmation/[ref], /emails.
- **Group H** owns app/styles/hotels.css, components/hotels/ (and components/account/ if wanted), and the routes /hotels, /hotels/[hotel], /hotels/[hotel]/guests, /login, /register, /forgot-password, /reset-password, /account, /bookings, /bookings/[ref], /about, /contact, /terms, /privacy, app/not-found.tsx, app/error.tsx.
- **Hand-over between groups:** H's guest form sends the visitor to `/checkout?kind=stay&hotel=<id>&room=<id>&` plus `stayQuery()`; F's checkout books through /api/hotels/bookings. Flight checkout is `/checkout?kind=flight&offer=<id>&fare=<fare>`. Confirmations at `/confirmation/[ref]` (F). Checkout writes bookings with `addBooking()`; H's dashboard reads them.
- **Shared files** (app/layout.tsx, tokens.css, global.css, home.css, components/chrome/, search/, ui/, lib/, tools/images.py, public/images/credits.md): small additions only, never a restyle for one page (page rules hang off the page wrapper class). Each group lists its additions here, under its own heading, with the reason:

### Group F: shared-file additions
- lib/mock/flights.ts: `renewOfferId(id)` (the same offer from a fresh search, for Refresh the price on an expired offer). No wording changes were needed there: its strings already match the deck.
- lib/emails.ts: reworded to landfall/content/copy.md, Email (subjects and H1s "You're going to Lisbon" and "You're staying at Casa Lanterna", "Total paid ..., taxes and fees included", the new e-tickets issued and booking not completed emails, the account footer without the booking-reference sentence, the Landfall demo notice). Each email now has a group and a footer kind; emailContent() returns support, demo and reason lines. Rendered by components/flights/email.ts.
- components/ui/PriceBar.tsx: optional `totalLabel` (the total button's accessible name, e.g. checkout's "Show the booking summary") and `note` (a second muted line, for the price rule).
- components/search/SearchCard.tsx: Tab stays inside an open phone sheet (critic round 1, home fix 3 was partial).
- app/api/flights/search/route.ts: the failing demo search (Toronto to Cape Town, first try) answers at about 9s so "Still looking" is seen before the failure.

### Group H: shared-file additions
- lib/text.ts: `STATUS_LABEL`, `STATUS_TONE`, `bookingTitle`, `bookingLine`, `bookingStart`, `countdown` (My bookings and booking detail wording in one place, with the swaps: My bookings, Sign in, "Tickets issued", US "Canceled", the year on other years' trips). Imports `cityById` and `hotelById` from lib/mock/hotels.ts and the `Booking` type. Nothing existing changed. (For about two minutes at 05:43 a wrong import here broke every page, F's included; fixed at once.)
- lib/mock/hotels.ts: the 25 photo lists filled with Landfall's own keys (8 hotels, 17 rooms); banner and one comment reworded (no more Overwing references). No logic changed.
- lib/mock/bookings.ts: banner comment only (points at text.ts for the labels and swaps).
- tools/images.py: one CROPS block for group H (hotels/ 3:2, pages/ 21:9 and 3:2). Rerun `python -I tools/images.py` rewrites the manifest for everyone; it only adds entries.
- lib/images.manifest.json: regenerated by the script (49 entries).
- public/images/credits.md: a "Group H" block of 37 rows (each photo page checked).
- No shared component, global.css or layout change.

## Open items and notes for the groups
- Search submit and every chrome link to an inner page lands on Next's default not-found until F and H build their routes. Chrome links use `prefetch={false}` (no 404 prefetches); keep it.
- `.a-link` is navy and teal is never text on light grounds (3.3:1); the landfall line and glyphs may use --c-accent.
- The dark band role `--c-band` (ink in navy, sea in Harbour) is in tokens.css: use it for any dark surface on an inner page, never --c-navy as a wall.
- Watch items from the Chief Officer (checkpoint above) apply to every group page.
- plumbing.md items still open for the groups: 9 (hotel photo lists are empty: H sources Landfall stay photos, never Overwing's), 10 (demo states), 11 (passenger date fields), 12 (results redirect to `/#search` when incomplete; the home card answers that hash by focusing From), 13 (email renderer, F), 14 (global swaps in lib/text.ts, lib/emails.ts and lib/mock/: Sign in for Log in, My bookings for Bookings, both months in ranges, total-first prices; not done in this session).
- Destinations H2 says "from London"; copy.md's "last origin" variant waits for the live app.
- Not checked: touch devices, Safari, Firefox, DPR 2 and 3, screen readers, 641 to 1024 beyond the prototype's rules, validation and submit by the critic.

## Group H (2026-11-11, about 05:16 to 07:30), Developer: hotels, account and content pages
Built in landfall/site/ on the shared dev server (3003, navy). No other server started, no production build, no packages. Group F's files not opened for editing (its checkout was only visited, to test the hand-over).

### What exists (group H files)
```
app/hotels/page.tsx                 results: no city goes to /#search; no dates shows "Add dates for prices"; dates without the party get the full URL
app/hotels/[hotel]/page.tsx         hotel detail (notFound for an unknown id)
app/hotels/[hotel]/guests/page.tsx  guest form (needs room and dates, else back to the hotel)
app/login, register, forgot-password, reset-password (?expired=1 shows the expired link state)
app/account, app/bookings, app/bookings/[ref]
app/about, contact, terms, privacy, app/not-found.tsx, app/error.tsx
components/hotels/parts.tsx         PhotoSwap (one photo, Previous and Next, dots), StayMap (OSM tiles toned to the palette, price pills), HotelCard, CardPrice (price rule in whole dollars), StayBreakdown, Section, amenity icons, Getting around lines
components/hotels/Results.tsx       list and sticky map, chips (Free cancellation, Breakfast included, 4 stars and up, Price per night range), Sort; 390 map first with Expand map, Filters and Sort sheets
components/hotels/Detail.tsx        title, 5-up grid button and gallery, about and amenities dialogs, room rail and Room details dialog, Good to know, Location, Other hotels, 390 price bar
components/hotels/Guests.tsx        lead guest, special requests, summary, hand-over to /checkout
components/account/Auth.tsx         AuthShell (split page), SignIn, Register, Forgot, Reset, useSignedIn
components/account/Profile.tsx      details, saved travelers, password, delete, Sign out
components/account/Bookings.tsx     MyBookings (tabs, next trip card, rows, empty and signed-out states), BookingDetail (reference, itinerary, travelers, documents, manage and cancel, payment)
components/account/Pages.tsx        ContactForm, Lost (404 and error body), PagePhoto
app/styles/hotels.css               all group H styles (h- hotels, t-auth, p- profile, b- bookings, x- pages)
public/images/hotels/, pages/       37 Unsplash License photos (credits.md, Group H block)
```

### Decisions (provisional, for Varun)
- **Concept on the inner pages (the Chief Officer's originality note).** The landfall line appears only where the plan allows: on flight legs in booking detail, on the "itinerary" of a stay (check-in to check-out, labelled "4 nights") on the hotel page's Good to know, booking detail and the next trip card, and above every booking total (guest summary, Room details dialog, booking Payment). Nowhere else.
- **Hotel page, apart from Overwing's.** Built only from Landfall's spec and Kasa's deconstruction; Overwing's hotel page was never opened. It differs by Landfall's own type (Newsreader titles), palette (teal actions, navy text), pinned compact search, whole-dollar price block with the total first, the stay drawn as a landfall leg, and water-rule lead photos.
- **Teal acts, navy speaks.** Every button and selection is teal with an ink label (Select, View rooms, chips pressed, the picked room's border, map pins on hover and focus). Map pins are white pills, never navy fills (the spec's navy pins would break the watch item). Secondary and destructive actions are ghost pills.
- **Prices.** Cards and rooms show copy.md's whole dollars ("$744 total", "$186 per night", "taxes and fees included") through `CardPrice`; booking pages show cents ("Paid $1,284.60 ..."). No struck-through or scarcity lines (the mock data sends none).
- **Photos.** Hotel and room photos are stand-ins for Duffel's (no grade, 3:2). Sign-in pages reuse the hero set (spec 7): Lisbon for Sign in, Cape Town for Create an account, New York for the password pages. My bookings uses the destination set for flights and the hotel's lead photo for stays. Contact gets a decorative harbour photo (the prompt listed a Contact photo; copy.md gives no alt, so it is alt="").
- **Copy left out or chosen.** The optional sign-in demo hint is left out (Varun's call, copy.md). Getting around lines exist for Casa Lanterna and Cais Verde (copy.md) and, from their own descriptions, Ribeira Lofts and Albergo Tre Finestre; the others have none (copy.md rule). Saved traveler editing uses the passenger form's Title, Given names and Family name only.
- **Booking detail** opens for any booking this browser knows, signed in or not (the confirmation page links to it). Profile sends a signed-out visitor to Sign in and back.

### Open items for the final pass
- **Stale manifest in the shared dev server's server graph.** After tools/images.py added group H photos, server components on 3003 still saw the old manifest (client components saw the new one), so About and Contact render their photos through `PagePhoto` (a client re-export in components/account/Pages.tsx). A server restart or production build reads the real file; nothing else depends on it.
- **Footer photo at 390** (shared, not group H): the 960 file is drawn about 4x at 390 under the 12% footer veil. Worth a sizes fix in Footer.tsx.
- **CompactSearch on dateless pages** (/hotels?place=lisbon, hotel detail without dates) shows the visitor's live search state, not "Hotels in Lisbon" with "Add dates"; the shared component takes a full StaySearch only.
- OpenStreetMap tiles load from tile.openstreetmap.org (no key, credited on every map). Production should use a tile provider the client has an account with.
- Not checked: Harbour palette (final pass), touch devices, Safari and Firefox, screen readers.

## Group F (2026-11-11, about 05:16 to 06:10, Developer, group F)
Flight results, flight details and fares, the travelers form, checkout for flights and stays, confirmation, and the email previews, built in Landfall's components only, in the navy palette on the shared 3003 dev server (no other server started, no production build; Harbour is for the final pass). Copy: landfall/content/copy.md, and content/copy.md where it says "as content/copy.md". No packages installed. No new photos: every slot uses Landfall's destination set (the destination's own water photo) or the ferry-deck promo photo, all already in credits.md.

### What was built
| Route | File(s) | What it does |
|---|---|---|
| /flights | app/flights/page.tsx, components/flights/Results.tsx | Redirects an incomplete search to its full URL (no route: /#search). Title row (H1, meta line, count, Sort select), 280px filter column (Stops with "from" totals, Airlines with Only and Select all, Departure time with Leaving London and Leaving Lisbon text tabs, Duration and Price ranges, Clear all); Filters and Sort chips opening sheets below 1025 ("Show 41 flights", "No flights match"). Row card: airline tile, one landfall line per leg (label "2h 45m, nonstop" on the line, the arrival heavier, a landing dot), warnings, then after a hairline the price block (total underlined and opening the breakdown, per traveler, taxes and fees included) and Select. 20 at a time with "Show 20 more flights" / "Show the last 6 flights", "That's all 86 flights.". States: searching (4 skeletons, status line, "Still looking" after 5s), no flights on the dates (photo panel, Change dates, Search nearby dates), search failed (Try again), filters hiding everything (Clear filters), prices expired after 30 minutes (dialog, Search again). |
| /flights/[offer] | app/flights/[offer]/page.tsx, components/flights/Details.tsx | Itinerary as a vertical landfall line per segment (hollow node at departure, the rail landing in the accent with a filled node at arrival), layover foam bands; Choose your fare as radio rows (teal ring and foam fill on the chosen one, "+$186.00 total" and the per-traveler amount under it); fare conditions accordion for the chosen fare; sticky Your trip summary (the destination's water photo, lines, the landfall line with its landing dot above the total, See price breakdown, Price valid until, Continue to passengers). Continue checks the price: fare up or down banner (warn or success), sold out notice, expired dialog with Refresh the price ("Price confirmed. Valid until 11:12."). Below 1025: the price bar (total, per traveler, taxes and fees included, the landfall line on its top edge, Continue), which steps aside while the summary card is on screen. |
| /flights/[offer]/passengers | .../passengers/page.tsx, components/flights/Passengers.tsx | Who's flying?: one card per traveler (Adult 1, lead traveler; Adult 2; Child 1; Infant 1, on Adult 1's lap), Title, Given names, Family name, Date of birth (Day, Month, Year), Gender on passport (two choice tiles), email and phone on the lead card, the passport block when the airline asks (searchable issuing country), Save this traveler (signed in), saved traveler chips (signed in, toast "Daniel Okafor's details added"). Every error from the deck; the error summary takes focus and names the traveler on each line. Kept as a draft for checkout and Edit. |
| /checkout | app/checkout/page.tsx, components/flights/Checkout.tsx | Flights (?kind=flight&offer&fare) and stays (?kind=stay&hotel&room& plus stayQuery()). Steps line with the current step on the landfall line; signed-out Sign in line; contact recap with Edit; Payment card: demo payment note, the simulated Stripe element (Stripe's own labels and messages), terms row; Pay $X with progress on the button and in a live region (checking the price or room, taking payment, confirming); trust lines. Panels at the top of the payment card that take focus: declined, insufficient funds, expired card, bank check failed, other, airline or hotel couldn't confirm; fare changed before pay; sold out; expired offer dialog. Sticky summary at 1025 and up; below, a total-only bar that opens the summary sheet. Writes the booking with addBooking() and clears the draft. |
| /confirmation/[ref] | app/confirmation/[ref]/page.tsx, components/flights/Confirmation.tsx | 760 column: the destination's water photo at 21:9, Booking confirmed, the H1 ("You're going to Lisbon" / "You're staying at Casa Lanterna") with the landfall line running out under it, the reference in a foam panel with Copy (toast "Copied"), the lead line, the itinerary timeline or the stay card, Paid with the landfall line, per traveler (per night), taxes and fees included and the card, Travel documents (the "issuing" line for 8s, then e-ticket numbers), What happens next (icon rows), View booking, Search hotels in Lisbon (or Search flights to Lisbon), Print. Title set on the server for the demo bookings and by the page for new ones. |
| /emails, /emails/[id] | app/emails/, components/flights/email.ts, EmailFrame.tsx | A review list (Bookings, Account) and each email rendered email-safe (tables, inline styles, 600px, the text wordmark with an image-free landfall rule, Georgia H1, reference box, rows with the landfall rule above Paid, the pill in the action fill, the footer lines), in a frame that grows to the email. Nine emails: flight and hotel confirmed, e-tickets issued, booking not completed (flight and hotel), booking canceled, flight times changed, reset password, password changed. |
Also: components/flights/parts.tsx (AirlineTile, LegLine, Timeline, Breakdown, ExpiryLine, ExpiredDialog, TripSummary, FareChange), trip.ts (draft keys, URLs, the expiry clock, useInView), app/styles/flights.css (every f- block; teal selections with an ink mark, Harbour's sand mark written as a data URI because a URI can't read a token).

### Critic round 1 (flight flow search to confirmation, 1440 and 390, plus the home re-check), about 05:45 to 06:00
- **7.4 FAIL**: design 7.5, originality 7, craft 7.5, functionality 8. No design tells, no copy tells. Watch items: landfall line holds (gap: the 390 bar), teal holds, price rule partial, water photos mostly hold, placeholders hold.
- **Home's ten fixes**: 1, 2, 4, 5, 6, 7, 8, 9, 10 hold; 3 partial (at 390 focus could leave the Dates sheet). Fixed (below).
- Fixed after the round (checked in the browser at 1440 and 390, not re-scored):
  1. Home Dates sheet at 390: Tab now stays inside the open phone sheet (40 Tab presses, all inside).
  2. Price rule: the 390 bar shows the total, per traveler and "taxes and fees included", with the landfall line on its top edge; Paid on the confirmation shows the per-traveler (per night) line; fare rows show the per-traveler amount under "+$186.00 total"; the fare-down banner ends ", taxes and fees included".
  3. Details and travelers at 390: the bar steps aside while the summary card is on screen (no double total or double Continue); page and toast padding follow the taller bar.
  4. Error summary lines name the traveler ("Adult 2: Choose a title.").
  5. "Still looking" now shows for about 4s before the demo failure (the failing search answers at about 9s).
  6. Travelers form: names stacked, two-column hints share one height (Email and Phone inputs both at y 1017).
  7. No-results and search-failed panels: one centred 760 column, the photo at 21:9.
  8. Filters: "Only" sits after the airline name and shows on touch screens; every price ends at the same x (376).
  9. Details meta line balanced at 390; Sort sheet rows spaced.
  10. Originality: the destination's own water photo now heads the Your trip summary on details, travelers and checkout (the concept: see the place first). A change to spec 2b, made for the Chief Officer's originality watch item.
- Not acted on, for the final pass: (8 in the critic's list) opening a field from the results compact bar at 1440 shows the search twice (the shared CompactSearch drops the full card under the bar); the no-results photo for a city outside the destination set is the ferry deck (water, no city); two emails share the deck's subject "Your booking to Lisbon wasn't completed" (flight and hotel).
- Also seen by the critic: group H's work broke lib/text.ts for about 2 minutes (results returned 500), then recovered.

### Copy decisions and flags (for the Copywriter or Varun)
- Price rule over three deck lines: the 390 bar's "for 2 travelers" becomes the per-traveler line plus "taxes and fees included" ("for 2 travelers" stays in the bar's accessible name); fare rows add "$93.00 per traveler"; Paid adds the per-traveler line; the fare-down body adds ", taxes and fees included".
- Results expiry uses content/copy.md's results version ("These prices have expired", "Search again"); Landfall's dialog ("This price has expired", Refresh the price) is about one flight and is used on details, travelers and checkout.
- Search nearby dates: departure one day earlier (a day later if that is past) and return one day later.
- The error summary prefixes each line with the traveler ("Adult 1: ").
- Title select starts empty (the deck has no prompt option).
- /emails is titled "Email previews": a review route label, not visitor copy.
- Card field labels and messages are Stripe's own ("Card number", "Expiration date", "Security code", "Country"; "Your card number is incomplete." and the like).
- New bookings render "Booking confirmed | Landfall" on the server, then the page sets "You're going to Lisbon | Landfall" (the booking lives in the browser).
- Airline logos: Duffel sends them live; the demo airlines are fiction, so a tile shows the code.

### Notes for group H (hand-over)
- Stay checkout reads the draft under stayDraftKey(hotel, room, search) with { guests: [{ given, family }], email, phone, requests }. Without guests it sends the visitor to /hotels/<id>/guests?room=<room>&<stayQuery()>, which is also the Edit link. "Change" links to /hotels/<id>?<stayQuery()>.
- Confirmations link to /bookings/<ref> (View booking) and /hotels?place&checkin&checkout&adults&children&rooms (Search hotels in Lisbon).
- The flight draft key is flight:<offer id>; bookings are written with addBooking() as the order routes return them.

### Open items (group F)
- The three not acted on above. Harbour not checked (final pass). Not checked: touch devices, Safari, Firefox, screen readers, 641 to 1024, the 30-minute results expiry by waiting (same Dialog as the details one, which was seen), the under-5-minutes expiry line by waiting.

Good commit point: group F's pages (flight results to confirmation, checkout for stays, email previews), with critic round 1's fixes.

## Final pass (2026-11-11, 10:57 to 12:20, Developer, main session): group H review, open items, both palettes, final critic, handover
Resume note: if this section has no "Final critic" line yet, the critic had not reported; production servers were on 3003 (navy) and 3004 (harbour).

### Group H review (dev server, navy, 1440 and 390)
- **Hotel detail had no CSS for its new layout.** Detail.tsx was rewritten at 06:13 (arrival view, two columns with the pinned Your stay card, stay leg, room rail) and the restart came before its rules were written: every photo rendered 1248 wide, 480 files at 2.6x. Written in hotels.css ("the arrival view", "two columns at 1025", "the stay as a landfall leg", "rooms: one rail"); checked on screen at 1440 and 390.
- The image script already listed a 1600 width for hotel photos but had not been rerun: rerun, manifest regenerated (only the 1600 entries were added).
- Everything else in group H passed the sweep (console, requests, h1, alt, ids, overflow, upscaling, copy tells) at both widths.

### Open items from groups F and H, settled
- Compact search showing twice at 1440: the open search replaces the bar in place (`.m-compact.is-open`, global.css; CompactSearch sets it). Shared-file addition.
- Dateless hotel pages: CompactSearch takes `dateless` and shows "Hotels in Lisbon", "Add dates" (/hotels and /hotels/[hotel] pass it). Shared-file addition.
- Footer photo at 390: below 1025 the photo keeps to the footer's lower 640px, so the 960 file shows at 1x (global.css, `.o-end__photo`). Shared-file addition.
- No-results photo with no city: the panel goes without a photo when the city has none of its own (components/flights/Results.tsx `Panel`, `.f-panel.-nophoto`). The ferry deck stays as the confirmation's fallback (every demo city has its own photo, so it is not reached in the demo).
- Two emails, one subject: not changed (copy.md gives one subject); flagged for the Copywriter.
- Stale manifest: the `PagePhoto` client re-export is removed; About and Contact use `Photo` as server components again.

### Production builds and QA
- `build:navy` and `build:harbour` clean; `start:navy` on 3003 and `start:harbour` on 3004. QA of 29 URLs per palette at 1440 and 390: clean (qa-report.md, "Final pass").
- The critic was launched in the background by mistake (the foreground flag was left out of the call). I did not use the browser while it ran; see "Final critic" below.

### Final critic (critic agent, xhigh, 11:17 to 11:24): about 6.9 FAIL
Design 7, originality 6.5, craft 7 (capped by one overlap), functionality 8; no design or copy tells. Partial by its own account (group H first; about half the pages not viewed). Full report: build/critic/final-pass-report.md. Group H's own critic round 1 (mentioned in Detail.tsx) has no recorded scores: the restart came before they were written down.
Fixed, worst first, each checked in the browser on fresh production builds of both palettes (not re-scored):
1. Open pinned search floated over the results: the page dims edge to edge behind it (`.m-compact.is-open::after`, global.css), a click on the dim closes it (CompactSearch onDown). Shared-file addition.
2. Originality on hotel detail: the stay drawn across the arrival photo (`.h-arrive`: check-in date, the landfall line with the nights, the landing dot, check-out date, ink chip like the home caption).
3. Lead photo: `leadIndex()` in components/hotels/parts.tsx picks the first outside photo that shows the water; used by the hotel page, result cards (`hotelPhotos` order), guest summary and My bookings. Casa Lanterna now leads with cl-rooftops (houses stepping down to the river).
5. Booking Payment card: unit line ("$186.00 per night", "$642.30 per traveler"), checked on S4T9LW and K7MQ2D.
6. 390 hotel price bar: "From $744 total" / "$186 per night, 4 nights" / "taxes and fees included".
8. Amenities in three columns at 1025 and up; description held to 68ch. 9. Rail no longer clips card shadows. 10. Results subtitle balanced. 11. Thin dialog scrollbar (global.css, shared). 13. Header Sign in slot hidden until the session is read (Header.tsx and global.css, shared): no "Sign in" flash.
Not fixed: 4 (photos to source), 7 (argued as a decision, then overruled by the Chief Officer, below), 12 (low confidence).
QA after the fixes: all four sweeps (navy and Harbour, 1440 and 390, 29 URLs) clean again.

### Chief Officer checkpoint (chief-officer agent, foreground; Landfall 3003 and 3004, Overwing 3001 and 3002 side by side)
- **Call 1 (11:36 to 11:42): APPROVED WITH NOTES**, notes 1 and 2 blocking. Landfall is plainly its own design on home, flight results and confirmation; answers the client's five asks; originality 6.5 is fair for results and hotels (the client named Booking.com, Expedia and Priceline) and not a reason to send back.
  - Side by side, shared with Overwing: (a) hotel detail at 390 ran the same skeleton (title, lead photo with a strip of four and "+5 photos", About, bottom bar); (b) **the icon sprite is a lightly edited copy of Overwing's** (same class a-sprite, same symbol ids, paths shifted by half a pixel; the plane differs): a shared resource, found at this checkpoint, from the foundation session; (c) Harbour's petrol fill against Cabin dawn's petrol-slate. Accepted as benchmark or Kasa technique: the 1440 hotel section order and accordion, the flight results layout, the stacked mobile search card, Varun's signature footer. Not shared: type, headings, hero, home sections, photos, wordmarks, button shapes, motion.
  - Rulings: decision 7 (Harbour keeps navy-style fills) **overruled**; decision 5 (no stand-in photo) approved, the panel must read as a finished type-led state; decision 6 (arrival view) approved at 1440, not at 390 as built; decisions 1, 2, 4, 8 confirmed; decision 3 keep Newsreader, list a sans-only option in the client questions.
  - Note 1 (blocking), Harbour actions in its own gold with an ink label: **fixed** in landfall/design/tokens.css Harbour block (--c-action gold #E6B56A, --c-on-action ink, hover gold lightened; ink on gold 9.5:1), recopied into the app; Harbour's checkbox mark now ink (flights.css data URI). A one-line token change by the Developer under the Chief Officer's ruling, as the earlier navy change. Checked: Search flights rgb(230, 181, 106), ink label, at 1440.
  - Note 2 (blocking), hotel detail at 390: **fixed**: the arrival photo edge to edge at 4:5, title and meta over it on a scrim, the stay leg docked at its foot, no strip, a "10 photos" chip (`.h-arrival`, `.h-view__count`, Detail.tsx and hotels.css). Lead loads the 800 file at 0.91x. Checked in both palettes, dated and dateless.
  - Notes not done today (for Varun): 3 redraw the icon sprite in Landfall's own style before the client sees both designs; 4 home hero caption may change before its photo shows (one frame, low confidence); 5 the confirmation's pale-green "Booking confirmed" pill matches Overwing's component; 6 replace the Terrace Suite, River View Double and 404 photos; 7 delete the critic's stray h-results-1440-studio.png at the studio root.
- **Call 2 (about 11:47 to 11:50): APPROVED WITH NOTES, the approval holds.** Notes 1 and 2 confirmed in the browser; nothing else before 12:20. Note 3 (icon sprite) holds up sending both designs to the client; Varun decides. Not re-checked by it: Harbour hotel detail below the first screen at 1440, hover and focus on the gold buttons, the dateless hotel page at 390, the gallery from the photo (I checked the last: the "10 photos" chip opens "Photos of Casa Lanterna"; after Escape, focus landed on an a-roundx button, not confirmed to be the gallery button).
- Also checked after call 2: the no-results panel without a photo (/flights?from=LHR&to=LGW...) reads as a finished type-led card. Its demo route reads "London to London" (LGW is London): group F's demo state, worth a different demo pair later.

### State at the end of the final pass
- Every page built; QA clean in both palettes at 1440 and 390 on production builds; final critic about 6.9 FAIL (fixes after it not re-scored); Chief Officer APPROVED WITH NOTES (holds).
- After call 2, also done: Chief Officer note 5, the confirmation's pale-green pill replaced by Landfall's own mark (the landing dot ringed in foam beside "Booking confirmed", navy text, no pill; `.f-cf__ok`, Confirmation.tsx and flights.css, group F's files), checked in both palettes at 1440 and 390, then all four sweeps re-run clean on the final build. Not seen by the Chief Officer.
- Next session, in order: redraw the icon sprite in Landfall's own style (Chief Officer note 3); replace the Terrace Suite, River View Double and 404 photos; the hero caption timing (note 4); then a fresh critic round to re-score.
- Servers 3003 and 3004 stopped at the end of this pass. Overwing's 3001 and 3002 untouched.

Good commit point: the final pass (group H finished, open items settled, critic and Chief Officer fixes), with build/handover.md.

## Icons, photos and check (2026-11-11, 11:56 to 12:40, Developer, main session, build-site skill)
Three last fixes the Chief Officer required before the client sees both designs. Overwing's site/, design/ and prototype/ were not opened.

### Fix 1, icons (Chief Officer note 3): done
- components/chrome/Sprite.tsx redrawn from scratch: all 63 symbols new, same ids and ICONS list, so no component changed. The old paths were never opened (only the id list was read).
- The language, two lines at the top of the file: a 20px grid with a 2px safe edge, one fine 1.25 line (1.25px at 20px, 1px at 16px), square caps, mitre joins, no fills; straight runs, true circles and 45 or 60 degree turns, corners square or cut at 45 degrees, never rounded. Landfall's own marks inside it: two-line menu, side-view plane, square filter knobs, graded sort lines, octagon error, pram for children, lotus for spa, chamfered doc and coffee cup, stacked arrows for change.
- global.css `.a-svg`: stroke 1.25, square caps, mitre joins. Tried `vector-effect: non-scaling-stroke` on the sprite children; it does not reach `<use>` instances in Chromium, so it was removed and the line scales with the icon (noted in the file).
- The swap button turns its arrows upright below 641px, where From and To stack (global.css, under `.m-search__swap .a-svg`).
- Checkbox marks in flights.css (both palettes): square caps and mitre joins, 1.6 on a 16 grid, to match.
- Checked: a sheet of all 63 at 14, 16, 20 and 40px; in use at 1440 (search card labels and swap, amenities, policy accordion with pram, paw and access) and 390 (header account and menu, stacked search card with the upright swap, /login errors with the octagon), navy on the dev server, then both palettes on production builds by the Chief Officer. Not opened by me: toasts, travelers stepper, filter and sort sheets at 390, Room details dialog.

### Fix 2, photos (Chief Officer note 6): done
Each checked on its photo page at about 12:05 ("Free to use under the Unsplash License"), downloaded at 2400 wide, cut by tools/images.py (never upscaled), rows replaced in public/images/credits.md, old sources and derivatives deleted.
- River View Double: hotels/cl-window-river (an open window over trees to the Tagus, Lisbon; Olga Müller, Wy_RmHAMYTk), 3:2 at focal 50/52. lib/mock/hotels.ts photos and room.
- Terrace Suite: hotels/cl-suite-bridge-view (French windows open over red roofs to the river and the 25 de Abril bridge, Lisbon; rsthomson, I_0VZ3u_Nxg), 3:2 at 50/44. lib/mock/hotels.ts.
- 404 (and the empty-state fallback in Bookings.tsx and hotels Results.tsx): pages/quay-colunas (a gull on a stone pillar at the Lisbon quay, the river behind; Jimmy Hu, U1ww2HnSyp8), 3:2 at 50/42, and `.x-lost__hero img` object-position 44% 16% (hotels.css) so the gull sits whole below the header in the wide 1440 band. The three component references renamed from pages/quay-dusk.

### Fix 3, check: done
- `build:navy` and `build:harbour` clean (four times; last at 12:20). `start:navy` on 3003 and `start:harbour` on 3004; Overwing's 3001 and 3002 left running.
- Spot QA, both palettes at 1440 and 390 (home, hotel detail, hotels list, flights results, bookings, login, 404): no console errors or failed requests apart from the 404's own status, no horizontal scroll. Flags already there before this pass (not fixed, for the next session): the home hero slide renders its 1600 file at 1638 while its scale motion runs, and the "Other hotels" cards on the hotel page ask for a 251px image in a 404px slot (sizes attribute too small; the 480 file is still larger than the slot, so nothing shows upscaled).
- **Chief Officer call 3 (12:14 to 12:17, foreground): CONFIRMED WITH NOTES.** Icons: the two sets read plainly different at a glance (line, caps, joins, and new drawings for menu, plane, filter, sort, error, bag, lock, ticket, card, copy, bed, calendar); common symbols such as search, pin, close and plus share an outline by nature and need no rework; no Landfall icon reads badly. Photos: both rooms read as Lisbon by the water and fit their slots; none of the three Unsplash ids is in Overwing's images. Confirmation mark: Landfall's own.
  - Note 1 (404 crop: gull cut at 1440 and under the header at 390): **fixed** (recrop plus object-position, above), checked in both palettes at 1440 and 390 on fresh builds. At 1440 the river itself sits behind the search card; the pillar, gull and sky carry the page.
  - Note 2 (optional): a slightly larger landing dot on the confirmation so its foam ring shows. Not done (time).
  - Not checked by it: filter and sort icons at 390, travelers stepper, toasts and notices, Room details dialog, the room rail at 390 on screen, the hotel page and 404 on Harbour at 1440 (I checked the 404 there after the fix).
- Servers on 3003 and 3004 stopped at the end of this pass.

### Next session
The confirmation dot size (optional); the hero caption timing (note 4); the "Other hotels" card sizes; the stray h-results-1440-studio.png at the studio root (Varun's call); a fresh critic round to re-score.

Good commit point: Landfall's own icon set and the three photos.

## Round 3, Developer B (inner pages, Part B), 2026-11-11, 15:23 to 16:45
Done for this round (hard stop 17:05). Spec: landfall/design/round3-spec.md Part B, built under Varun's 15:03 instruction (round3-note ruling 4 superseded), so the Chief Officer's note 1 hold did not apply. Owner of lib/mock/ and lib/data/ (except lib/mock/home.ts, Developer A's) and of the inner page components and CSS (flights, hotels, booking, account). Built by me (data layer, QA, records) and six foreground builder subagents (three build, three fix) with fixed file lists. The first three builders were started in the background by mistake at about 15:35, stopped within a minute (no files changed) and relaunched in the foreground.

### Data layer (done 16:05; catalogue complete re-parse 15:57)
- content/mock-catalogue.md is parsed by `node lib/mock/catalogue/parse.mjs` (run in landfall/site) into lib/mock/catalogue/catalogue.json; rerun whenever the catalogue changes. Typed access and helpers in lib/mock/catalogue/index.ts (CAT, CAT_CITIES, catCity, broadRegion, scoreWord, scoreName, DEMO_REVIEWS_LINE (no longer shown: Varun's 16:28 ruling), PROPERTY_TYPES, AMENITY_GROUPS, FARE_NOTE). Parsed: 24 cities, 12 airlines, 12 fare family sets, 96 hotels (24 showcase), sections 4 to 8 kept raw in `CAT.sections`.
- lib/mock/hotels.ts: HOTELS (same export) holds all 96 hotels; the original eight keep ids, photos, rooms, prices and policies and gain the catalogue fields. New optional Hotel fields: type, score, scoreWord, reviews, fromCentre, band, showcase, highlights, aboutMore, categories, reviewList, nearby, rules, lead, breakfastPrice. Rooms gain size, amenities and plans (RatePlan ids nr, fc, fcb, nrb). Non-showcase hotels get the catalogue's generated rooms by property type, the section 4 review pool (6 snippets, seeded, Fits tags honoured) and the rule-based guest scores. New: planOf(room, id), isPlan, stayTotals(room, search, plan?), leadsFor(list), hotelFaqs(h) (answers only from the hotel's own data: the catalogue has no FAQ lists), hotelAirports(h). searchStays and parseStaySearch accept no place when `type` is given (every city). Centre points moved to Tokyo Station and Times Square (catalogue note 5); new pins rounded to 3 decimals; addresses "Neighborhood, City, Country".
- lib/mock/hotel-photos.ts: the photo pool for the 88 new hotels, Landfall's own photos only (no new downloads this round, none from site/public/images). Each city's leads are distinct (city water photos first, then interiors), and leadsFor() keeps neighbouring cards from repeating a photo in any sort.
- lib/mock/flights.ts: the 12 airlines; each airline's own fare families (faresFor(owner), fareFor(offer, tier), FARE_TIERS; FareId gains 'top'; Kittiwake keeps copy.md's Light, Classic, Flex and its steps); London routes use the catalogue's owners and via hubs (the first nonstop airline owns the cheapest offer); ANCHORS from the catalogue's Return from; HUBS gain LIS and MEX; typicalReturn(from, to); weekdayFactor (Friday 1.00, so the demo date keeps its figures); lowestByDate(search, dates).
- lib/data/places.ts and lib/mock/geo.ts: the nine new airports; Singapore and Marrakech hotel cities; CITY_CENTRE gains both.
- app/api/hotels/bookings/route.ts: prices the chosen rate plan (`plan` in the body or the search); Checkout sends it.
- Every existing id and route still works: offer ids, fare ids light, classic, flex (plus top), hotel and room ids, the four demo bookings.

### Pages built (P1 unless noted)
- B1 /flights: date strip (7 cells, lowest total for the party, "Lowest" mark, week arrows, a muted line saying what the price is), Best, Cheapest and Fastest tabs with total and duration, More sorts, 10 filter groups with counts and lowest prices (zero-count options muted and disabled; bags and fare options counted by the cheapest family), applied chips, all in the URL; new result card (legs, landfall line with stop dots and layover, +1, inclusions row, tags, SaveLine against the usual fare, breakdown, Flight details disclosure); 390 sheets with "Show N flights". New sprite glyphs: moon, sunrise, sun, sunset, suitcase.
- B2 /flights/[offer]: fare family comparison table (3 or 4 families of the owning airline, aligned headers, check-in seats shown as not included), timeline with layover band and baggage note, breakdown dialog per traveler type, conditions accordion for the chosen family, step line (Choose your fare, Travelers, Pay), 390 swipe cards with the family in the price bar; writes a flight-view entry to lf.recent through Developer A's lib/recent.ts.
- B6 /hotels: every filter and sort in the URL (budget with histogram and stay total, guest score, stars, property type, meals, cancellation, neighbourhood, distance, 10 amenities), applied chips, five sorts, new card (ScoreBadge, filled stars, type, water view chip, distance, View on map, room line, inclusions, total first), every-city list for `type` with no place, map fitted to the stays with collision nudging and count pins (tiles never upscaled), 390 chips and sheets.
- B7 /hotels/[hotel]: sticky section nav with scroll-spy (Overview, Rooms, Reviews, Location, House rules, FAQs), gallery chips, overview with highlights, top 10 amenities plus grouped dialog, availability table at 1025 and up (room cell spanning its plans, sleeps, choices, price, quantity, one Reserve that sums), 390 room cards with radio plans, reviews (category bars, trip chips, sort, snippets), location with nearby and airports, house rules table, FAQs accordion, similar stays rail and recently viewed; writes a hotel-view entry to lf.recent.
- B5 confirmation: Add to calendar (.ics), Print or save as PDF, "Your stay in <city>" rail for flights, "Your flight to <city>" fares for stays.
- B9: /bookings tabs with counts, rows, next trip countdown, Recent searches (or "Popular searches from London" when empty), Saved travelers; booking detail actions (calendar, print, receipt, cancel), fare or rate conditions; /account section list (chips scroller below 1025), booking-email toggles, delete account; login and register already had Show password and the rules line.
- B3 travelers: age hints, passport disclosure, same-as-lead contact, passport-name hint, bags line from the fare, step line. B4 checkout: line-item table, conditions in two lines with Full conditions, "Pay $<total>", step line. B8 guests: card per room, booking for someone else, arrival time, requests hint, plan name and cancellation line, breakdown with the same nightly price as the hotel page.
- Not done (P2 or no data): nearby airports line, seat preference note, fare rules dialog, half board and bed type filters, scarcity lines and hotel SaveLines (the catalogue's "Hotels with lower rates" table is not wired yet), price per night or total toggle, "Read all reviews" (6 per hotel), bed preference on guests.

### Critic round (critic agent, high effort, foreground, 16:08 to 16:13)
- **Benchmark (benchmark-rubric.md) 7.6**: depth 7 (capped: the empty half-row on /bookings; 7.5 before the cap), ease 8, visual 8, craft 7 (capped: overlapping map pins), pricing 8, mobile 8. Compared with Booking.com flight and hotel results and hotel detail, Expedia hotel detail and checkout. No design tells, no copy tells.
- **Studio rubric (taste/rubric.md) 7.9 FAIL** (design 8, originality 8, craft 7 capped, functionality 9).
- Not checked by the critic: /checkout itself (needs a form submit), dialogs, /hotels?type=Resort, the small hotel, 390 for confirmation, bookings and account, 1024 for most pages, hover pairs, touch.

### Fixes after the critic (16:14 to 16:40, worst first; not re-scored)
1. Map pins: fit to the stays with padding, collision nudge, count pins that zoom in, "Show all stays"; tiles from the next zoom level so they are never upscaled. Removes the craft cap.
2. /bookings: "Popular searches from London" default and top-up cards, so the row is always full. Removes the depth cap.
3. Hotel detail: FAQs section and tab; Airports list under Location.
4. Scroll-spy lag fixed (line below the sticky stack).
5. Date strip shows totals for the party, with a line saying so.
6. Guests and checkout show the same nightly price as the hotel page; taxes as "of which" under the total.
7. Fare table headers aligned; seats assigned at check-in shown as not included.
8. 10.0 badge padding (scoped in hotels.css; ScoreBadge untouched); 390 sticky nav gap; filled stars; zero-count filters disabled; bags and fare options counts narrow; booking step line on fares, travelers, checkout and guests (44px targets below 1025); /account section chips at 390; "Only rate for this room" line.
9. Varun's 16:28 ruling (no demo disclosures): removed from my pages the demo-reviews lines (hotel detail, results, confirmation rail), the receipt's demo line, checkout's demo payment hint, the email footer's demo paragraph, and "demo" in the .ics ids. Left for the cleanup run: the footer notice and "Email previews (demo)" link (Developer A's Footer), lib/emails.ts `demo` strings (no longer rendered), ScoreBadge's DEMO_REVIEWS_LINE export (Developer A's).

10. After the records (16:37 to 16:41): the travelers page bags line reads "checked bag for a fee" instead of the raw catalogue cell "For a fee: Checked bag"; a keyboard pass (90 tabs each on /flights, /hotels and hotel detail at 1440) found a visible ring on every stop (hotel cards ring the whole card through :has).
- Not done on purpose: hotel savings lines. They lower prices on results, detail, guests, checkout and the booking route at once; wiring that in the last minutes risked prices that disagree between pages, so it waits for the next session.

### QA (landfall/build/qa-report.md, "Round 3, Part B")
Clean at 1440, 1024 and 390 on 13 inner pages after the fixes: no console errors, no failed requests, no horizontal page scroll, no em or en dashes, no placeholder text, no upscaled images of mine.

### Notes for Developer A
- At 1024 the footer's hero photo (lisbon-alfama-river) renders 1024 wide from the 960 file on every page (sizes attribute in Footer.tsx); ask for the 1600 file from 961 up.
- Data fields for home.ts: cities in CAT.cities (name, slug, region (the 6 catalogue regions), country, code, line, flightTime, returnFrom, typicalReturn in cents, hotels), broadRegion() for the four-pill merge, typicalReturn(from, to) in lib/mock/flights.ts, hotel fields as above, CAT.sections for deals and recommendations (raw tables).

### Open items (next session)
- Re-score Part B with the critic (fixes not re-scored).
- Hotel SaveLines from the catalogue's "Hotels with lower rates" (rate windows), the 7th review category (no catalogue data), "Room only" plans where the catalogue gives one plan (left as the catalogue says).
- New hotel photos per city (Paris, Barcelona, Amsterdam, Singapore, Sydney, Marrakech lead with interiors from the pool); the catalogue asks for about 10 per showcase hotel.
- .ics flight times are floating local times (wrong across time zones).
- Harbour palette (3004) not checked this round.

Good commit point: Part B inner pages at competitor depth, the catalogue in the simulated backend, and the critic fixes. Suggested message: "Landfall round 3 Part B: catalogue in the backend (96 hotels, 12 airlines, fare families, rate plans), inner pages rebuilt at competitor depth, critic fixes, demo wording removed"

### Shared-file additions (Developer B)
- app/layout.tsx: imports app/styles/booking.css (new, Developer B's) after hotels.css.
- components/chrome/Sprite.tsx: moon, sunrise, sun, sunset, suitcase appended.
- app/api/hotels/bookings/route.ts: accepts `plan`.

## Round 3, Developer A (homepage and footer, Part A), 2026-11-11, 15:23 to about 16:30
Spec: landfall/design/round3-spec.md Part A. Owner of components/home/, app/page.tsx, app/styles/home.css, components/chrome/Footer.tsx, lib/mock/home.ts, lib/recent.ts and the round 3 shared components below. Built on the shared dev server (3003, navy); no other server, no production build, no packages.

### What was built
- **Mode switch (A0).** `/` is Flights, `/?mode=hotels` is Hotels, rendered on the server from searchParams (no flash on a shared link). components/home/Mode.tsx: `HomeMode` (the mode is the search store's tab; pushState on change, popstate switches back without a reload and holds the scroll through Next's own popstate handling; polite live region "Showing hotels"), `ModeSwap` (both modes rendered, inactive one `hidden`; in view: out 160ms, in 360ms with a 12px rise, cards staggered 40ms up to 6, height eased over --d-panel; out of view or reduced motion: instant). Hero tabs and the header's Flights and Hotels links switch in place; the hero's tab line slides between tabs (--ease-settle); the headline re-runs its word reveal.
- **Hero and destinations (A1, A2), text and links only.** Hotels copy ("Wake up somewhere new" and its subline), the caption becomes "Hotels in <city> from $X a night, Stay here" (fills Destination and opens Dates), the caption changes at the crossfade midpoint (450ms), hero sizes ask for the 2400 file from 1440 up. Destinations: Hotels heading, note and per-night lines, links to /hotels?place=, scroll-margin under the compact bar, no hairline.
- **Deal banners (A3), deal cards (A4), Recommended (A5), trending board (A6), browse (A7), how booking works and trust (A8), popular searches (A9), FAQs (A10), pre-footer fix (A11), footer at depth (A12, about 55 links: 12 popular flights, up to 12 hotel cities, 5 columns, trust row, price disclosure, extended demo notice).** Section ids: deals, recommended, trending, browse (and browse-types), how-booking-works, popular, faqs, faq-<slug>.
- **Data (lib/mock/home.ts).** Computes everything from HOTELS, DESTINATIONS, GEO and the catalogue's 24-city table, both modes, once per request; dates from today (the first Tuesday 10 or more days out, 7 nights or 4 nights). It picked up Developer B's 96 hotels, scores, types and the 9 new airports with no change. Hotel usual rates come from the hotel when it has them; until catalogue section 5 (Deals) lands, the 8 original hotels use stand-ins in HOTEL_FACTS (logged for the Copywriter). Popular-search flight rows link with `stops` and `air` filters (Part B's results URL keys).
- **Photos.** 19 new Unsplash License photos in public/images/home/ (a water photo for every one of the 24 cities, plus the Lisbon fares banner), each checked on its photo page, credits.md block "Round 3, Developer A". Hotel cards on the homepage lead with the hotel's own photo for the 8 original hotels and with their city's water photo for the catalogue's others (critic note 1). Nairobi has no waterfront: its photo is the national park with the skyline.

### Critic (critic agent, high effort, foreground, one round, 15:58 to 16:15)
- **Benchmark rubric 7.7** (depth 8, ease 8, visual 7, craft 7, pricing 8, mobile 8; against Booking.com Stays home, Expedia home and Priceline's destinations grid). **Studio rubric 7.3 FAIL** (design 7.5, originality 7, craft 7, functionality 8.5). No design or copy tells. The mode switch was judged better than all three competitors.
- Fixed after the round, worst first (checked in the browser, not re-scored): (1) hotel cards no longer lead with stand-in room photos (city water photos, see above); (2) the Flights Lisbon banner has a new photo, the Tagus at Cais do Sodre with the bridge; (3) a deeper lower-left scrim on every banner, and "per traveler" after the banner fares; (4) rails show 3 cards and their arrows from 1024; (5) property types show all 6 across from 1024, drawn from six cities; (6) popular-search flight rows filter by stops and airline and the cheapest airline's row shows its fare; (7) "Weekend trips" became "Short flights" (the chip filters flights under 4 hours); (8) thumbnails fill their squares; (9) the first hotel deal no longer repeats the Tokyo banner photo; (10) tighter gaps above browse and FAQs, picked chips foam with a teal ring and unpicked white with a hairline, focus moves to the first new city after "Show all", the Hotels board keeps a compact score at 390, banner photos sit lower at 390.
- Open after the fixes: per-airline prices in popular searches (the catalogue gives one fare per route); rails hold 8 cards (Booking runs 10 to 15); no themed explorer; struck prices stay out (ruling); Athens' only photo is the marina aerial, used on several surfaces.

### Shared components for both parts (done 15:40; for Developer B to reuse)
- `components/ui/ScoreBadge.tsx`: `<ScoreBadge score={9.1} count={1286} />`, `compact` (badge alone, word and count in its name), `size="lg"` (56px, hotel Reviews), `onDark`. Also exports `scoreWord`, `scoreName`, `DEMO_REVIEWS_LINE` (put it once on every surface that shows scores, class `.m-demo-reviews`).
- `components/ui/LandfallLine.tsx`: `<LandfallLine from="LHR" to="LIS" label="2h 45m, nonstop" stops={[{ code: 'MAD', label: 'Madrid, 1h 50m' }]} size="card|fluid" grow={0..1} dark name="accessible name" />` (decorative without `name`).
- `components/ui/SaveLine.tsx`: `<SaveLine saving={74} kind="route|rate" onPhoto />` gives "$74 below this route's usual fare" / "$96 below its usual rate"; renders nothing for 0. `saveText()` for strings.
- `components/ui/Rail.tsx`: `<Rail head={<h2 .../>} label="..." tools={...}>{cards}</Rail>` (4 visible at 1280 and up, 3 at 1025, 2.3 at 641, 1.15 at 390; arrows from 1025) and `<RailCard href photo alt label ratio="4/3|4/5" sizes>` with body classes `m-railcard__title`, `__meta`, `__small`, `__rule`, `__price`, `__total`, `__unit`, `__save`, `__free`.
- Styles: `app/styles/parts.css` (new), imported in app/layout.tsx after global.css. Tokens: the spec's new tokens added to landfall/design/tokens.css and recopied into app/styles/tokens.css.
- `lib/recent.ts`: the browser store "lf.recent" (`addRecent({ kind, params, label, price? })`, `readRecent()`, `clearRecent()`, `RECENT_EVENT`). Kinds and params are in its banner. Part B writes `hotel-view` (params: hotel, place, checkin, checkout when known) and `flight-view` (the flight search params plus offer) with it.

### Shared-file additions (Developer A)
- app/layout.tsx: one import line, app/styles/parts.css.
- components/search/store.ts: `ServerTab` context and `primeTab()`, so the home page paints `/?mode=hotels` on the first frame (useSearch reads the hint for the server snapshot). Nothing else changed.
- components/search/SearchCard.tsx: submit writes a `flight-search` or `hotel-search` entry with addRecent() before it navigates.
- components/chrome/Header.tsx: Hotels links go to `/?mode=hotels`; on home, Flights and Hotels switch the page in place (no scroll to top).
- tools/images.py: CROPS for `home/` (18 city water photos at 4:3 and the Lisbon banner at 3:2); manifest regenerated (adds only). public/images/credits.md: a "Round 3, Developer A" block of 19 rows.
- app/terms/page.tsx and app/privacy/page.tsx: one anchored section each for the footer's links (`#prices` with the spec's price disclosure, `#cookies` stating what lib/recent.ts does, marked CLIENT COPY REQUIRED for the full policy).

### Notes for Developer B and the Studio Lead
- lib/mock/hotel-photos.ts CITY has photos for 6 cities; public/images/home/ now has a water photo for all 24 (names in lib/mock/home.ts CITY_PHOTOS). Adding them to CITY would let the results and detail pages lead with the place too (Part B's call).
- Not checked: the Harbour palette (3004 not running), touch devices, Safari and Firefox, screen readers, 641 to 1023 beyond 1024 itself.
- Good commit point: round 3 Part A (homepage below the first two sections, mode switch, footer, shared components, 19 photos). Suggested message: "Landfall round 3: homepage mode switch, deals, recommendations, trending, browse, FAQs and full footer".

## Developer A, round 2 (homepage and footer, Part A), 2026-11-11, 16:23 to 16:37
Shared dev server 3003 only (no other server, no production build, no installs). Developer B's lib/mock/ and lib/data/ files untouched; every change is in Developer A's files (lib/mock/home.ts, components/home/Deals.tsx, app/styles/home.css).

### Step 1: catalogue deals in place of the stand-ins (content/mock-catalogue.md section 5)
- HOTEL_FACTS loses its stand-in usual rates. The eight original hotels carry no lower rate, as the catalogue says.
- LOWER_RATES in home.ts holds the catalogue's 18 hotels with lower rates (kind and percent). Developer B's data has no lower-rate field, so home.ts applies them: deal price = the hotel's cheapest nightly x (1 - percent), rounded to whole dollars; "usual" = the same room and plan for the same nights.
- Windows from today (dealDates): weekend = the coming Friday and Saturday nights (Nov 13 to 15 today); weeknight = the coming Sunday for 4 nights, "until" the last Sunday to Thursday night within 30 days (Dec 10 today, as in the catalogue's example); long stay = the default 4 nights (Nov 24 to 28); next month = the 1st for 4 nights (December).
- Fares count as deals only at 12% or more below the route's typical return (FARE_RULE). That gives exactly the catalogue's 10 routes; the other cards (Recommended) no longer show a saving line.
- Lines word for word: banners use lines 2 and 10 (Flights: Lisbon, Cape Town) and 1 and 6 (Hotels: Lisbon weekend from $265, $47 below the usual rate, matching the catalogue's own example; Tokyo breakfast included at 6 hotels from $161). Hotel deal cards: tag, "$X a night, usually $Y", reason line. Flight deal cards: "{dates}, {airline}", "Return from $X per traveler", "$X below the typical fare for this route". Section heading, line and demo note from "Section copy around deals". Rails hold up to 10 deals.

### Critic (critic agent, high effort, foreground, one round, 16:28 to 16:33)
- **Benchmark rubric 7.8** (depth 8, ease 8.5, visual 7, craft 7.5, pricing 8.5, mobile 7.5; against Booking.com's homepage offers, trending and property types, Expedia's homepage cards, Priceline's deals and Booking.com mobile). **Studio rubric 7.8 FAIL** (design 8, originality 7.5, craft 7.5, functionality 9). No design or copy tells, no overlaps, clipping, header collisions or console errors at 1440, 1024 or 390. It confirmed the catalogue deal rules hold and the numbers match between banner and cards.
- Note: under its time limit the critic did not read signature.md, references/benchmark.md or the three deconstructions, and did not open the competitor sites; its comparisons rest on the spec and its own knowledge of those homepages.
- Report: the critic's hand-back (summarised here); screenshots in landfall/build/critic/r3a2/.

### Fixed after the round, worst first (each checked in the browser, not re-scored)
1. Deal banners at 390 showed only sky: below 641 the photo now keeps its own 3:2 above the text on the dark band (Lisbon's quay and bridge, Table Mountain and the harbour now show).
2. Tokyo hotel-window photo (curtain, no water) left the Hotels banner and the Recommended Tokyo card: the banner uses the Tokyo river bridge, and HND's city photos drop the window. The narrow banners show the lower part of their photos from 641 up (object-position 50% 78%).
3. Property-type cards showed city views: they now show the type (Albergo Tre Finestre's front, Casa Lanterna's courtyard, the Marrakech riad, a studio kitchen and a loft at Ribeira Lofts; the beach stays for Resorts).
4. Flight deal tag repeated the saving line (ruling R0 A16): dropped on flight cards.
5. Every flight deal had the same dates: each takes its own Tuesday week (Nov 24, Dec 1, Dec 8, Dec 22 in turn), so the weekday price holds.
6. Saving lines wrapped to an orphan word: text-wrap pretty on the reason line.
7. Uneven Recommended card bodies: the rule above the price takes margin-top auto on the homepage, so prices line up.
8. Athens browse tile hole: tile bodies centre their lines.
9. "Free cancellation" deal chip filtered nothing (every deal hotel has it): replaced by "Weekend rate".

### Open, for the next round or Varun
- Pricing across pages: the homepage applies the catalogue's lower rates, but Developer B's results and detail pages do not yet, so a weekend deal at $265 opens at the usual $312. Developer B (or the Studio Lead) should apply LOWER_RATES in lib/mock/hotels.ts; home.ts would then read it from the hotel.
- Copy conflicts for the Copywriter: (a) the footer and /terms#prices disclosure says savings compare against "the usual price ... over the last 30 days", but the catalogue defines the hotel usual as the same room and plan for the same nights and the flight comparison as the route's typical return; (b) the critic asked for one word ("usual") in place of "typical" for fares, and for mode-specific deal headings; I kept the catalogue's lines word for word (one heading for both modes, "typical" for fares).
- Photos repeat across sections (Paris, Athens, Barcelona, Rome, Mexico City and the Marrakech riad in 3 to 4 sections each); a second water photo per city would fix it. The Tokyo banner photo is a night shot and stays dark under the scrim; a daylight Sumida or Odaiba waterfront would be better.
- Hotels-mode popular searches cover the 12 hotel cities (the catalogue has hotels in 12 cities only).
- Not checked this round: Harbour palette, header-link mode switch and popstate (unchanged since round 1), hover and focus pairs, reduced motion, 641 to 1023 except 1024.
- Good commit point: "Landfall round 3: catalogue deals on the homepage, 390 banners, property type photos and critic fixes".

## Developer A, round 3 (homepage photography pass, Part A), 2026-11-11, 16:37 to 16:40, STOPPED, nothing changed
Shared dev server 3003 only (no other server, no build, no installs). No file changed: home.ts, the home components, home.css, public/images/ and credits.md are as Developer A round 2 left them. Developer B's files untouched; nothing from Overwing read or used.

### Why it stopped
- Unsplash now answers every automated request with a bot check ("Checking your browser before accessing unsplash.com", HTTP 401): curl on the search, and Playwright on the search as well. The rule is not to get around a bot check, so no new photo could be found or checked on its photo page. Without that, no second photo per city and no daylight Tokyo shot can go in under the Unsplash License rule.
- Repeats cannot be fixed with the photos we hold. Measured on http://localhost:3003/ (both modes' content is in the DOM): each of the 24 cities has one water photo (Lisbon, New York and Cape Town have two or three), but Flights mode alone has about 60 photo slots (destinations 6, banners 2, deals 10, recommended 8, trending 12, browse tiles). Tokyo's night bridge shows in 5 sections; Rome, Lisbon (tagus golden), Paris, Amsterdam and New York harbour in 4. Taking photos out of sections would leave empty photo slots, which the spec does not allow.

### What the next run needs
1. Varun (or the Studio Lead) gets Unsplash photos past the block by hand, or gives the go-ahead for another licensed source: about 24 city photos (one more per city; two more for Tokyo, Rome, Paris, Amsterdam, Mexico City and Athens), plus a daylight Tokyo waterfront for the Hotels banner (Sumida river by Azuma bridge, Odaiba, or the Tokyo Bay waterfront). Originals at 1600 wide or more. Each photo's page checked for "Free to use under the Unsplash License", checked against Overwing's credits list, and added to public/images/credits.md.
2. Then in home.ts: a photo claim order down the page (hero, destinations, banners, deals, recommended, trending, browse, types) where each section takes an unclaimed photo of its city, so nothing repeats; Tokyo banner to the daylight shot (Deals.tsx line 73); crops checked at 1440, 1024 and 390 in both modes.

## Cleanup round (Developer, 2026-11-11, 16:41 to 17:20): no demo disclosures, one deal price, critic on inner pages

### Job 1, demo disclosures removed (Varun's ruling 16:28)
- Footer: the demo notice and the "company details will be shown here before the site takes real bookings" line removed; "Email previews (demo)" link dropped (the /emails route stays).
- Home: the "Demo prices from the simulated backend" and demo reviews lines removed from Deals, Explore (trending) and Recommended (both spots); DEMO_REVIEWS_LINE export removed from ScoreBadge.
- Contact form: now shows a success notice, "Your message is sent. We'll reply to <email>." The API answers { received: true }.
- Emails: the demo paragraph removed from the footer of every email (lib/emails.ts; the renderer had already dropped it). The reset link token reads K7MQ2D9X, not "demo".
- Terms and Privacy: the "before the site takes real bookings / this demo takes no bookings" sentences are now one neutral line saying the full text comes from Landfall. Headings and anchors (#prices, #cookies) are unchanged.
- Calendar file: UIDs read @landfall and PRODID is -//Landfall//Bookings//EN.
- Already clean before this run: sign-in, checkout, the hotel pages, Extras and Bookings.
- Kept on purpose: "Nothing has been charged" on a declined card or a failed hotel or airline confirmation. Real booking sites show this too, and it does not imply a demo.

### Job 1b, one price at every step
- lib/mock/hotels.ts now owns LOWER_RATES, plus stayPct, lowerNightly, ratedPlan, plansFor, and planOf(r, id, search). stayTotals charges the lower rate whenever the whole stay falls inside the rate's window:
  - weekend: every night is a Friday or Saturday
  - weeknight: every night is Sunday to Thursday, within 30 days
  - long: 4 nights or more, checking in within 60 days
  - month: every night is in next month
- lib/mock/home.ts reads the same table.
- Wired into the hotel page (room table, picked room, similar stays), the guest form, checkout and the bookings API.
- Checked end to end at 16:46: Hotel Sal e Vela, Nov 13 to 15, is $265 a night and $530 total on the homepage deal, hotel results, the hotel page, the guest form and checkout ("Pay $530.00").

### Critic, inner pages (high effort, 16:47 to 16:52, benchmark-rubric.md vs Booking.com, Expedia and Priceline; studio rubric for reference)
| Page | Benchmark (target 9.2) | Studio |
|---|---|---|
| Flight results | 8.0 | 6.2 |
| Fares / details | 8.2 | 6.4 |
| Travelers form | 7.9 | 6.3 |
| Checkout (stay) | 7.3 | 6.0 |
| Hotel results | 7.3 | 6.2 |
| Hotel page | 7.6 | 6.3 |
| Guests form | 7.8 | 6.2 |
| My bookings | 7.7 | 6.5 |
- The critic found no demo lines and no empty gaps.
- Lowest category on every page: visual design, 6 to 7.
- Studio rubric about 6.3: FAIL on originality (5.5).
- Screenshots: build/critic-cleanup/.

### Fixed after the critic (16:53 to 16:55, not re-scored)
1. Results cards showed "Free cancellation" and "Breakfast included" from any rate, beside the price of a non-refundable, room-only rate. They now show only the priced rate's own terms.
2. "Free cancellation until Nov 10" had already passed for a Nov 13 check-in. freeCancelUntil now gives 3 days before check-in, or the day before check-in for a stay that starts sooner, and never a day already past.
3. Flight filters showed a price on options with 0 flights; the price now shows only when the count is above 0.
4. The guest summary said "Non-refundable" twice; the second line is dropped when the plan name already says it.
5. The tourist tax line showed 3 times at checkout; the trust list now just says the total includes taxes and fees.
6. The guest summary now shows the room photo, not the city panorama.
7. Hotel results chips at 390: one line each, in a sideways-scrolling row.
8. The footer photo rendered 1024 wide from its 960 file at 1024; sizes is now "(max-width: 960px) 960px, 100vw".

### Open, for Varun or the next round
- Footer contact "+1 (555) 010-0199" and "hello@example.com" (lib/site.ts) read as placeholders under the 16:28 ruling. We have no real contact details for the client and must not invent any. Varun to supply them, or rule that the lines come out.
- Bigger items from the critic:
  - The hotel page has no 1 large + 4 small gallery with a photo count.
  - The River Balcony Double room photo is a dark loft, not a balcony.
  - Catalogue hotels lead with the city photo, so the hotel itself is never shown.
  - Card is the only way to pay; there is no wallet option.
  - The hotel page's section tabs sit above the title.
  - My bookings cards don't match each other, and the flight card's "from $412" disagrees with the results page.
  - The $530 map pin is clipped at the map edge at 390.
- Copy: the fares button says "Continue to passengers" while the stepper says "Travelers". Left as is, because copy is used word for word; this is for the Copywriter.
- /sign-in is a 404; the route is /login. Not a bug, noted for testers.

### Job 2, production check (16:55 to 16:58)
- Type-check is clean, and build:navy and build:harbour both pass.
- Ran a production server on 3006 for each palette in turn, then stopped it.
- Text scan: home in both modes, sign-in (/login), checkout, the Hotel Sal e Vela page, Contact, Terms, Privacy, About and an email show no banned lines.
- Screenshots at 1440 and 390: the footer (navy and harbour), sign-in, checkout and payment, the hotel page's reviews, Contact after sending, and Terms. All tidy, with no gaps and no sideways scroll. Screenshots are in build/critic-cleanup/prod-*.png.
- Seen during the check but not fixed:
  - Checkout still says the tourist tax line twice: once under Price details and once in the "Your stay" summary.
  - At 390, the hotel page's section tabs sit tight under the pinned compact search.
- Good commit point: "Landfall: remove demo disclosures, one deal price at every step, inner page fixes".
