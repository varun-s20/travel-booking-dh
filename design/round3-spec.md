# Overwing round 3 spec: homepage depth, product switch, footer, inner pages
Art Director, art-direct skill phase B, 2026-11-11. For two Developers building in parallel from about 15:45.
Part A (homepage and footer) is Developer A's. Part B (inner pages) is Developer B's. Section 0 binds both.

**Chief Officer, 2026-11-11, about 15:22: APPROVED WITH NOTES** (first call, no send-back). All six notes are applied below:
1. Part B timing (see the next paragraph).
2. Hotel detail depth matched to the catalogue (0.5, B7).
3. No support time claim (A10b, A14).
4. Anchors and the link count (A9, A14).
5. One name per data field, with computed trending and popularity (0.5, A4, A6, A7).
6. Prove `a-score` and one blind row first, check contrast, name the label face (0.3, 0.4, A1).

**Part B timing, for Varun.** Ruling 4 in logs/round3-note.txt says to stop for your own review of both homepages before the inner pages are rebuilt. Your instruction for this stage says two Developers build in parallel from about 15:45. The Chief Officer cannot waive your review.
- Default, unless you say otherwise: Developer B starts at 15:45 on the shared work only: data wiring (0.5) and the shared components (0.4, with Developer A).
- B1 to B11 wait for your homepage review.
- If you meant Part B to build in full now, one word from you starts it; the spec is approved as written.

Binding notes: logs/round3-note.txt, logs/redesign-note.txt, benchmark-rubric.md (target 9.2, side by side with Booking.com, Expedia and Priceline), brief.md round 3 rulings.
Overwing stays Overwing: the cabin window, Hipcamp's app shell (rail, top bar, pill tab bar), Calibre plus Geist, Night navy (3001) and Cabin dawn (3002). Every value below is a role token from design/tokens.css or a new token in section 0.3. Nothing here comes from the other design, and nothing should be looked up there.

Sources used for this spec:
- The current site at 3001, 1440 and 390 (home, full page), read on 11 Nov at 15:20. Home is 4406px tall at 1440 with 5 sections and a 12-link footer.
- references/deconstruct/priceline.md (homepage only; Priceline blocked everything else).
- The Booking.com and Expedia screenshots in references/deconstruct/booking-com/ and expedia/ (homepage Flights and Stays states, results, fare families, 390 sheets). Their written deconstructions did not exist when I wrote this, so page depth beyond the screenshots is from my own knowledge of those sites, technique only.

---

## 0. Shared by both parts

### 0.1 What Overwing does with the competitors (technique in, look out)
| Competitor technique | Overwing's version |
|---|---|
| Booking.com: the product tab rebuilds the homepage below the search | The blinds: the switch closes and reopens the windows of every product section (0.5) |
| Booking.com and Expedia: square score badge in brand blue | Score in a small cabin window shape (0.4, `a-score`) |
| Priceline: two-level field labels, filled defaults, savings tint reserved for savings | Already in our pill. Lower fares get one reserved tint, `--c-save` (0.3), used nowhere else |
| Priceline: 25-city accordion grid with priced routes and hotels | "Flights and stays by city" grid (A12) |
| Booking.com: tabbed link directory before the footer | Folded into A12 and the footer's route and city columns (A14) |
| Expedia: fare family cards side by side; date strip above results | Fare cards as bezel-edged columns (B2); the date strip as a row of window-topped cells (B1) |

Look we never take: their blues, their yellow search border, flags on photos, photo text overlays with country flags, heart save buttons (saves are out of scope), "Genius", VIP or member pricing, promo codes, app download blocks, ad slots, chat launchers.

### 0.2 Identity rules every new section follows
- Grounds alternate: white page ground, then an inset navy wall panel (`--c-hero`, radius `--r-xl`, inset 16px from the rail and the screen edge, like the hero). Never two navy panels in a row. Light sections sit in `.b-wrap` (1216px column at 1440).
- Section headings: Calibre Bold `--t-h2`, sentence case, no full stop, no eyebrow. A 15px Geist muted subline only where it adds a fact (the origin, the dates, the count).
- Photos: Unsplash License only, graded with `fx-grade-navy` (or `fx-grade-cabin`), credited in site/public/images/credits.md and checked on the photo page. Never a photo already used by the other design. Hotel photos from the mock catalogue stay ungraded (they stand in for Duffel).
- The window shape (`--r-window`) is for: destination photos, the score badge, the date strip cell tops, the empty states. Not for hotel photos (Kasa grid stays square-cornered `--r-md`).
- Icons: the existing sprite (components/chrome/Sprite.tsx). New icons in section 0.3 are drawn to the same grid, stroke and caps as `i-bag` and `i-wifi`. No icon fonts, no emoji, no flags.
- Prices: totals lead, in Calibre Bold tabular (`font-variant-numeric: tabular-nums`). The line under a price says what it covers. USD only, "$" with no space, cents only on totals of a booking.
- Every card and link has hover and focus states as in 0.4. Every rail scrolls by keyboard and has prev and next buttons at 1024 and up.

### 0.3 New tokens (add to design/tokens.css and site/app/styles/tokens.css, both palettes)
| Token | Night navy | Cabin dawn | Use |
|---|---|---|---|
| `--c-save` | #DDF1EF (= extra) | #E3EEE8 | Ground of the lower-fare chip and deal tag only |
| `--c-save-ink` | #065E64 (6.4:1 on --c-save) | #1F3B41 | Text and glyph on --c-save |
| `--c-score` | var(--c-hero) | #1F3B41 | Score badge fill |
| `--c-score-ink` | #FFFFFF | #FFFFFF | Score number |
| `--c-warn` | #8A4B00 on #FFF3E0 | same | "2 rooms left at this rate", price-changed notes |
| `--c-row` | #F0F5F7 (= cream) | var(--c-cream) | Zebra rows in tables and the accordion grid |
| `--t-score` | 1.8rem | | Score number, Calibre Bold |
| `--t-kicker` | 1.2rem | | Geist 12px 600 caps, .08em tracking: the meta row above a card title |
| `--w-rail-card` | 28.6rem | | Rail card width at 1440 (4 visible plus a peek at 1024) |
| `--dur-blind-close` | 220ms | | The switch, close |
| `--dur-blind-open` | 420ms | | The switch, open |
| `--stagger` | 50ms | | Between cards in the switch |
Check `--c-save-ink` on `--c-save` and `--c-warn` pairs with prototype/tools/contrast.py before shipping; I computed them by eye from the existing extra and accent values and did not measure them. Also measure the new Cabin dawn values and the price tags under the A5 windows in Cabin dawn, where the wall is light (there the tags take `--c-ground` with a 1px `--c-line`).

New sprite icons (same grid): `i-trend-down` (lower fare), `i-history` (recent search), `i-route` (two dots and an arc), `i-seat`, `i-bag-cabin`, `i-bag-checked`, `i-refund`, `i-change`, `i-power`, `i-meal`, `i-pool`, `i-parking`, `i-ac` (reuse `i-snow` if close), `i-spa`, `i-pet`, `i-shuttle`, `i-kitchen`, `i-key` (check-in), `i-door` (check-out), `i-shield` (secure payment), `i-plane-up`, `i-plane-down`, `i-calendar-plus`, `i-download`.

### 0.4 Shared components (Developer A builds them first in components/ui; Developer B imports them; agree names at 15:45)
- Build order: Developer A builds `a-score` and one blind row (A6) first and runs the Critic on just those at 1440 and 390 in both palettes before rolling them out.
- `a-score`: 40 x 48 window shape (`--r-window`), `--c-score` fill, number in `--t-score` white. Beside it: the word (Exceptional 9.0+, Excellent 8.5+, Very good 8.0+, Good 7.0+, Fair 6.0+, the catalogue's words) in 14px Calibre Bold ink and the count "1,284 reviews" in 13px muted. Small variant 32 x 38 with 15px number. Accessible name "Rated 9.1 out of 10, exceptional, from 1,284 reviews". Every block that shows scores or reviews carries the catalogue's line in 12px muted: "Demo reviews, written for this preview. They are not from real guests."
- `a-save`: chip 24px, radius pill, `--c-save` ground, `--c-save-ink` text 12px Geist 600, `i-trend-down` 14px. Text is always a real difference: "$74 under the typical fare".
- `m-railCard`: card in a horizontal rail. Width `--w-rail-card` at 1440, 30% of the row at 1024, 72vw at 390. Scroll snap start, gap 24 (16 at 390). Prev and next round buttons 40px, white, `--sh-pop`, on the rail's right top above it (not over photos). Rail keyboard: the list is focusable and arrow keys scroll one card.
- `m-tabs` (section filter tabs): pills with Geist 12px 600 caps labels, .08em tracking, 36px, 1px line, selected `--c-deep` fill with white text; in a navy panel selected is white with ink text. They filter in place (no page load) and keep the selection in the URL hash only for A12.
- `m-accordion`: question 17px Calibre Bold, 56px row, 1px line between rows, `i-chev-down` turns 180deg in 240ms `--ease-std`; answer 16px Geist muted, max 64ch; uses `<details>` and `<summary>` so it works without JS.
- Card hover: photo scales 1.04 over 250ms `--ease-out-long`, the title underlines (1px, offset 3px). Focus: 2px `--c-accent` ring offset 3px, following the card radius or the window shape. Press: scale .985.
- Buttons: unchanged pill system (deep on white, white on navy).

### 0.5 Mock data contract
The Copywriter is writing content/mock-catalogue.md (24 cities, 12 airlines with fare families, 96 hotels with rooms, scores and reviews, deal and recommendation lines). It is not finished as I write ("Catalogue complete." not yet present). Wire it into site/lib/mock/ (R4 wiring) with these fields. Item lists in A and B name the fields they read. If a field is missing from the catalogue, ask the Copywriter; never fill it with invented copy in the component.
- `cities[]`: slug, name, country, region (the catalogue's 6 regions), iata (main airport), airports[], photo (graded, ours), hotelCount, fromNightly, neighborhoods[], blurb (one line), flightTimeFromLondon, returnFrom, typicalReturn, hasHotels.
- `routes[]` (computed from flights.ts and the catalogue): from (LHR), to, lowestReturnTotal for 1 adult ("Return from"), typicalReturn (the catalogue's "Typical return", for deals), airlinesOnRoute (catalogue "Who flies each route from London"), fastestMinutes, nonstop (bool), monthLows[12] and dayLows (not in the catalogue: generate them in the backend from the existing price function by date, so they agree with the results page).
- `airlines[]` (12): code, name, mark (our own drawn monogram, no real logos), hub, aircraft, fareFamilies[3 or 4] (name, step, personalItem, cabinBag, checkedBag, seatChoice, changes, refunds), cancelOnline.
- `hotels[]` (96: the catalogue's 12 hotel cities with 8 hotels each; 2 per city, 24 in all, are showcase hotels with every room, rate plan, review and nearby place; the other 72 have a short record): slug, city, name, stars, propertyType (Hotel, Boutique hotel, Guesthouse, Apartment, Aparthotel, Resort: the catalogue's six), neighborhood, distanceKm, lat/lng, photos[8+], score, categoryScores (Staff, Cleanliness, Location, Comfort, Value, Facilities, Wifi), reviewCount, reviews[6+] (name initial, country, month, score, title, liked, disliked, travelerType), amenities[], highlights[3], houseRules (checkIn, checkOut, children, pets, smoking, parties, quietHours), faqs[5], rooms[] (name, beds, sizeM2, maxGuests, view, roomAmenities[], photos[], ratePlans[] with name, mealPlan, cancellation, payment, nightly, total, roomsLeft).
- `deals[]`: kind (fare or stay), refId, headline line, note line, validUntil. Must point at a real route or hotel whose price is in the data (catalogue section 5).
- One name for the usual price everywhere: `typicalReturn` (routes) and `typicalTotal` (hotel stays, computed from the cheapest plan at the hotel's typical nightly; ask the Copywriter for the typical nightly if section 5 does not give it).
- `popularity` and `trending` are not catalogue fields. lib/recommend.ts computes them: popularity = the cities table order (first is most popular); trending = the saving against `typicalReturn`, largest first. So Developer A is never blocked on copy.
- Deal lines and recommendation reason lines come only from catalogue sections 5 and 6. Until they exist, show the computed facts (route, price, typical price) with no headline line. Never write such a line in a component.
- `faqs.flights[8]`, `faqs.hotels[8]`, `recommendLines` (the reason lines for "Recommended for you").

### 0.6 Visitor history (feeds "Recommended for you")
Store in localStorage under the existing `overwing:v1` object, key `history`:
`{ searches: [{mode, from, to, place, depart, return, checkin, checkout, adults, children, infants, rooms, cabin, at}], views: [{kind: 'hotel'|'route'|'city', id, at}] }`, newest first, 8 of each at most, de-duplicated by route or place.
- Written by: the search submit (home and compact search), flight results load, hotel detail load, city card clicks.
- Cleared by: a "Clear history" link in the recent searches row and on the profile page (B11).
- Never sent anywhere; the demo notice already says data stays in the browser.

---

## PART A. Homepage and footer (Developer A)

### A0. Fixes to the two sections that stay (hero, entry cards)
1. Rail links `/#flights` and `/#hotels` become `/?mode=flights` and `/?mode=hotels` (see A1). Old hash links still work: on load, `#hotels` or `#search-hotels` is read as mode=hotels and replaced in the URL with `?mode=hotels` (replaceState).
2. 390: the tab bar sits over the lower half of the windows on the first screen (seen at 390 x 844). That is the approved state (both window tops show, Search above the fold); keep it, but give the hero 24px more bottom padding at 390 so the windows' lower bezels show once the tab bar steps aside.
3. Entry cards: in hotel mode the hotel card moves first (CSS `order`, no remount), so the first card under the hero always matches the mode. Same anatomy.
4. The hero lead swaps with the mode (A1 table). The headline "Fly there, stay there" stays.

### A1. The Flights / Hotels switch changes the homepage in place
**URL.** `/` and `/?mode=flights` are flight mode; `/?mode=hotels` is hotel mode. The hero tabs, the rail's Flights and Hotels items and the tab bar's Flights and Hotels items all set the mode.
- On a click: `history.pushState({mode}, '', '/?mode=hotels')`, then run the swap. Back and Forward fire `popstate`, which runs the swap to the stored mode without a new history entry.
- Server render reads `searchParams.mode` so a shared link and a reload render the right mode first, with no flash. The page stays one route (app/page.tsx); mode is a prop.
- Keep the scroll position. If the switch came from the rail or tab bar while the hero search is out of view, scroll the search into view as now and focus its first field quietly.
- `<title>` changes: "Overwing | Book flights" / "Overwing | Book hotels". The `aria-live="polite"` status under the search says "Showing hotel deals and stays" or "Showing flight deals and routes".

**What swaps** (every section from A3 to A12 has a flight and a hotel version; same slot, same height class, different content):
| Slot | Flight mode | Hotel mode |
|---|---|---|
| Hero lead | Search flights and see the full total before you pay | Search hotels and see the total for your stay before you pay |
| Hero search | Flights tab | Hotels tab |
| A3 Recent searches | Recent flight searches | Recent hotel searches |
| A4 Recommended for you | Routes for you | Stays for you |
| A5 Deal banner | Lower fares this week | Lower rates this week |
| A6 Deal cards | 8 fare deals | 8 stay deals |
| A7 Trending | Trending routes from London | Trending cities to stay in |
| A8 Browse | Explore by region (flights) | Browse by property type |
| A9 When to go / Weekend | Cheapest months to fly | Stays for this weekend |
| A10 How booking works | Booking a flight | Booking a hotel |
| A11 FAQs | Flight questions | Hotel questions |
| A12 By city grid | Flights from London by city | Hotels by city |
| A13 Pre-footer line | Pull up the blind on your next trip (stays) | same line, button "Find a hotel" |
Trust panel (A10b) and the footer do not swap.

**How it animates (the blinds).**
- Close: in every swapping section that is in or near the viewport (IntersectionObserver, rootMargin 200px), each photo and card gets a blind: a `--c-blind` to `--c-blind-end` gradient layer that drops from the top, `clip-path: inset(0 0 100% 0)` to `inset(0 0 0 0)`, in `--dur-blind-close` with `--ease-in`, staggered `--stagger` left to right. Text in the section fades to 0 opacity over the same time.
- Swap the content while closed (React state; keys per mode so lists remount).
- Open: blinds rise (`inset(0 0 0 0)` to `inset(0 0 100% 0)`) in `--dur-blind-open` with `--ease-out-long`, same stagger; text fades back in over 300ms with an 80ms delay.
- Sections out of view swap with no motion.
- Total for one row of 4 cards: 220 + 150 stagger + 420 = about 800ms. Clicks during the animation queue the last mode only.
- The hero windows do not close (the hero stays as it is).
- Reduced motion: no blinds, no fade; content swaps at once.
- Height: each slot keeps a `min-height` from its larger mode at each breakpoint so the page does not jump while the visitor reads.

### A2. Page order and size at 1440
Hero (keep), entry cards (keep), then A3 to A13, then the footer. Target page height about 9,800px at 1440 in hotel mode, close to Booking.com's Stays page (5,892px with a shorter hero), with every band holding real data. Section spacing `--s-section` (104px at 1440, 64px at 390) between light sections; navy panels sit 32px from the light sections around them.

### A3. Recent searches (only when history has searches)
- Light ground. Heading "Pick up where you left off". Right of the heading: text link "Clear history" (13px, muted, underlined on hover).
- Up to 4 chips-cards in one row (rail at 390): 296 x 88, radius `--r-md`, 1px `--c-line`, white. Inside: 56px window-shaped photo of the destination (city photo), then route "London to Lisbon" (16px Calibre Bold), then "Nov 20 to 27, 2 adults, Economy" (13px muted), then on the right `i-chev-right`. Hotel version: "Lisbon", "Nov 20 to 27, 2 adults, 1 room".
- Click: runs the stored search (the results URL). If the stored dates are past, shift them forward by whole weeks to the next same weekday and say so in the subline "Dates moved to Dec 4 to 11".
- 1024: 3 visible plus a peek. 390: rail, cards 260 wide.
- Hidden entirely on a first visit (no empty band).
- Data: history.searches, cities[].photo.

### A4. Recommended for you
- Light ground. Heading "Recommended for you". Subline is the reason, from the visitor's latest search or view: "Because you looked at Lisbon" / first visit: "Popular with travelers flying from London this month" (flights) or "Popular stays this month" (hotels).
- Rail of 8 `m-railCard`s.
  - Flight card: 286 x 380. Window-shaped city photo 286 x 286 is wrong here (too repetitive with A7); use a 286 x 190 photo at `--r-md` with a 32px window-shaped airline mark disc overlapping its lower left. Then route "London to Porto" 18px Calibre Bold, "Return, 1 adult, Economy" 13px muted, "Nonstop, 2h 35m" 13px ink with `i-clock`, then price block: "$214" in `--t-price-card`, "return total, taxes and fees included" 13px `--c-price-note`. If the route is a deal, `a-save` sits above the price.
  - Hotel card: 286 x 420. Photo 286 x 214 `--r-md` (hotel photo, ungraded). Meta row `--t-kicker` small caps: "4-star boutique hotel". Name 18px Calibre Bold (2 lines max, clamp). Neighborhood and distance "Alfama, 1.2 km from the center" 13px muted. `a-score` small. Price "$744" `--t-price-card` with "7 nights, 2 adults, taxes and fees included" 13px price-note. Dates are the visitor's last searched dates, or next Friday plus 2 nights on a first visit, and the line says which.
- Picking logic (lib/recommend.ts, pure function, unit-testable):
  - Flights: same origin as the last search; destinations in the same region as the last destination, then the cheapest routes from that origin; exclude the destination already searched; 8 items.
  - Hotels: the last searched or viewed city first (4 best scored not yet viewed), then 4 from a city in the same region with the closest fromNightly.
  - First visit: origin London (the mock default, a placeholder), the 8 routes with the most searches in the mock (a `popularity` field) / the 8 highest scored hotels across 8 different cities.
- Card click: flights go to the results URL for that route on the shown dates; hotels go to the hotel detail URL with dates and guests.
- 1024: 3 plus a peek. 390: 72vw cards, rail, no buttons (swipe), a "See all" text link under the rail that runs the search.
- Data: history, routes[], hotels[] (showcase hotels first), cities[], recommendLines.

### A5. Deal banner (navy wall panel)
- Navy panel (`--c-hero`, inset, radius `--r-xl`), 1408 x 360 at 1440.
- Left half: heading in `--t-h2` white "Lower fares this week" / "Lower rates this week". One line in hero-muted: "Fares on these routes are under their usual price for travel before December 15. Prices change, and we check them again before you pay." (hotels: "These stays cost less than usual for check-in before December 15. We check the rate again before you pay.") Button white pill "See all fare deals" / "See all stay deals" (goes to A6 anchor `#deals`, scrolls).
- Right half: two cabin windows (the hero's window component, 200 x 270, bezel and teal lit edge), each showing a deal city, with a white price tag under each window: city, "from $214", `a-save`. These are the two biggest deals by saving.
- 1024: windows 160 x 216. 390: panel radius 24, heading and text first, then the two windows side by side at 140 x 190, then the button full width.
- Data: deals[] sorted by (usual minus now), cities[].photo.

### A6. Deal cards (`id="deals"`)
- Light ground. Heading "Fare deals from London" / "Stay deals". Tabs (`m-tabs`): All, then the catalogue's 6 regions (Southern Europe, Northern and Western Europe, North America, Latin America, Asia and Pacific, Africa and Middle East). Hotel mode shows only regions with hotel cities.
- Grid of 8 cards, 4 x 2 at 1440 (cards 286 wide, gap 24). 1024: 3 columns, 6 shown plus "Show 2 more". 390: one column of 4, then "Show more deals" button.
- Flight deal card: photo 286 x 180 `--r-md`; `a-save` on the photo's top left (12px in); route 18px Calibre Bold; dates "Tue, Dec 2 to Tue, Dec 9" 13px; airline and stops line "Petrel Air, nonstop" 13px muted; price row: "$214" `--t-price-card` and "typical $300" 13px muted (never struck through, said in words, as the catalogue rules); "return total for 1 adult" 13px price-note. Whole card is a link to results.
- Hotel deal card: as the A4 hotel card plus `a-save` on the photo and "typical $830" in words.
- Honesty rule: a deal shows only where now < usual by at least 10% in the mock data. Footnote under the grid 13px muted: "Typical price is the usual fare or rate for the same trip in this demo's data."
- Data: deals[], routes[].typicalReturn, hotels[].typicalTotal. Hotel deals link to showcase hotels first.

### A7. Trending
**Flight mode: "Trending routes from London".** Light ground. Subline "From London Heathrow, return, 1 adult, Economy". London is the only origin in the mock (a placeholder market), so there is no origin picker; when the visitor's last search used another origin the mock supports, use it.
- Two parts side by side at 1440:
  - Left 2/3: the existing "Cities worth the flight" window cards, cut to 6 (3 x 2, 286 x 385 windows) with "Return from $412" and "1 adult" under each. This keeps the owned window look.
  - Right 1/3: a ranked route list, 10 rows, each 64px: 40px window photo, "London to Lisbon" 16px Calibre Bold, "Nonstop, 2h 40m, 5 airlines" 13px muted, price right-aligned "$412" 17px Calibre Bold tabular. Rows on `--c-row` zebra. Rank is shown by order only (no numbers).
- 1024: window cards 2 x 3 above, list full width below in 2 columns. 390: window cards as a rail (240 wide, as now), list below as 10 rows.

**Hotel mode: "Trending cities to stay in".** Booking.com's 2 big plus 3 small layout, redrawn as windows: row 1 two windows 592 x 400 (`--r-window` scaled, i.e. wide windows with the same corner proportion), row 2 three windows 389 x 300. Under each (never on the photo): city 20px Calibre Bold, "8 stays, from $96 a night" 14px. 390: one column of 5, 342 x 240.
- Data: routes[], cities[] (photo, hotelCount, fromNightly), trending computed in lib/recommend.ts (0.5).

### A8. Browse
**Flight mode: "Explore by region".** Navy wall panel. `m-tabs` (white selected): the 6 regions. Each region has exactly 4 cities, so under them a 4-column row (3 x 2 at 1024, rail at 390) of tall windows 236 x 318 with the city photo, and under each in white: city 16px Calibre Bold, the catalogue's one line (2 lines, 13px hero-muted), "Return from $412" 14px white, "Nonstop, 2h 45m" 13px hero-muted. 1024: 4 columns at 200 wide. 390: a 2 x 2 grid of 165-wide windows. Right of the tabs: "All 24 cities" link to A12.
**Hotel mode: "Browse by property type".** Navy wall panel. 6 tiles (Hotels, Boutique hotels, Guesthouses, Apartments, Aparthotels, Resorts), each a 176 x 236 window with a type photo (6 new Unsplash photos, graded), label 16px white, the count across the 12 cities ("23 stays") and "from $88 a night" 14px hero-muted, both computed from hotels[]. Click: hotel results in the visitor's last hotel city (or Lisbon on a first visit) with the `type` filter applied: `/hotels?place=lisbon&...&type=boutique`. Below the tiles, a second row "Stay in a city": 12 text pills (the 12 hotel cities, each with "from $96 a night") on `--c-hero-tint`, each a real hotel search.
- Data: cities by region with route prices; hotels grouped by propertyType with counts and lows.

### A9. Timing
**Flight mode: "Cheapest months to fly"** (`id="when"`). Light ground. Route picker: the visitor's last route, or London to Lisbon on a first visit, with a small "Change route" select of 10 trending routes. A 12-column bar row 1216 wide, 200 tall: each bar's height = month low / year high, bar 56 wide, radius 8 top corners, fill `--c-tint`, the cheapest 3 months fill `--c-accent` with white price on top; month label under (Jan to Dec, 13px small caps); price above each bar 13px tabular. Click a bar: flight results for that month's lowest dates. 390: a horizontal scroll of the 12 bars at 44 wide with the cheapest month centred on load. Table alternative (visually hidden) for screen readers: a `<table>` of month and price.
**Hotel mode: "Stays for this weekend"** (`id="weekend"`). Showcase hotels first. Subline "Fri, Nov 14 to Sun, Nov 16, 2 adults" (computed: the next Friday at least 2 days ahead). Rail of 8 hotel cards (A4 anatomy) priced for those 2 nights, sorted by score times value. Booking.com has this; it is the most useful hotel row for a returning visitor.
- Data: routes[].monthLows; hotels rate lookup for any 2-night window.

### A10. How booking works and trust
**A10a "How booking works"** (swaps). Light ground. A horizontal track, not three icon cards: one 1px `--c-line` line across 1216px with 4 stops on it. Each stop: a 48px circle with the sprite icon (`i-search`, `i-plane` or `i-bed`, `i-people`, `i-lock`) in `--c-accent` on `--c-tint`, then a 17px Calibre Bold verb line and two lines of 15px muted text below. No numbers.
- Flights: "Search and compare" / "Every fare shows the total for all travelers, taxes and fees included." "Pick your fare" / "Light, Classic or Flex. Each one lists the bags, seat and changes it includes." "Add travelers" / "Names as they appear on the passport. Save them to your account for next time." "Pay with Stripe" / "We check the fare again before you pay. Your e-ticket and reference arrive by email."
- Hotels: "Search and compare" / "Each stay shows the total for your dates, with the price a night beside it." "Choose a room and rate" / "Rates list the meals, the cancellation terms and how many rooms are left." "Add guest details" / "The lead guest's name goes to the hotel with your check-in time." "Pay with Stripe" / "We check the rate again before you pay. Your reference arrives by email."
- 1024: same, text 14px. 390: the line turns vertical on the left, stops stacked.
**A10b Trust panel** (does not swap). Keep the navy panel and the Reception photo. Add, under the 4 ticks, a row of 3 facts in hero-muted 13px with icons: `i-shield` "Card details go to Stripe, not to us", `i-mail` "Help by email", `i-ticket` "All bookings in your account". No response time: the client has not given one.

### A11. FAQs (`id="faq"`)
Light ground. Heading "Questions before you book". Two columns of `m-accordion` at 1440 and 1024 (4 and 4), one column at 390. All answers stick to the scope; no fee or refund promise the client has not made.
Flights:
1. Is the price I see the price I pay? / Yes. Every fare shows the total for all travelers with taxes and fees included. We check it with the airline again just before you pay, and if it has changed we show you the new total before you confirm.
2. Why did a fare change after I picked it? / Airlines hold a fare for a short time, usually about 30 minutes. If the hold runs out, we fetch the fare again and show you the new price.
3. Which bags are included? / Each fare lists them: a personal item, a cabin bag and checked bags where included. Compare Light, Classic and Flex on the fare step.
4. Can I change or cancel a flight? / It depends on the fare. Flex fares usually allow changes, Light fares usually do not. The fare's own rules are on the fare step and in your booking.
5. Where is my e-ticket? / In the confirmation email and on the booking's page in your account, under Documents.
6. Do I need an account to book? / No. You can book as a guest. With an account, your bookings and saved travelers are in one place.
7. Which cards can I pay with? / Payments run through Stripe, which accepts the major credit and debit cards.
8. How do I enter names? / Exactly as they appear on each traveler's passport, including middle names.
Hotels:
1. Is the price shown the total for my stay? / Yes. The large number is the total for your dates and guests, taxes and fees included. The price a night sits under it.
2. What does free cancellation mean here? / You can cancel without charge until the date shown on the rate. After that date the rate's cancellation terms apply.
3. Is breakfast included? / Only where the rate says so. Each rate lists its meals.
4. When can I check in? / Each hotel lists its check-in and check-out times under House rules.
5. Can I book more than one room? / Yes. Set the rooms and guests in the search, and the rates show the total for all rooms.
6. Will the hotel have my booking? / Yes. The lead guest's name and your reference go to the hotel when you pay.
7. Can I pay at the hotel? / Not on this site. You pay the full total by card through Stripe when you book.
8. Where do I find my booking? / In the confirmation email and on the Bookings page of your account.
The Copywriter should check these against content/copy.md; they are written to the scope, not to client policy.

### A12. Flights and stays by city (the deep directory)
Light ground on `--c-cream` full width band (not a navy panel; A13 follows). Heading "Flights from London by city" / "Hotels by city". `m-tabs`: All regions plus the 6 regions (hash `#city-southern-europe` etc. kept in the URL hash so a link can open a region).
- Flight mode: 24 city cards in 3 columns (8 rows), filled row first. Hotel mode: the 12 hotel cities in 3 columns (4 rows). Each: 392 x 72 white, radius `--r-sm`, `--sh-thumb`. Closed: 40px window photo, city 16px Calibre Bold, country 13px muted, on the right "from $412" 14px tabular, `i-chev-down`. Open (one at a time per column, `<details>`): flight mode lists every airline on the route from London (catalogue "Who flies each route from London"), each row: airline mark and name, "Nonstop" or "1 stop via MAD", lowest return total, linked to results filtered to that airline (`&airline=KT`); hotel mode lists the city's 8 hotels with score and lowest nightly and an "All 8 stays in Lisbon" link. Every row is a real search or detail link.
- 1024: 2 columns. 390: 1 column, first 8 cities, then "Show all 24 cities".
- Data: cities[], the route-airline table, hotels by city.

### A13. Pre-footer band (keep, small changes)
Keep the navy band with the real window. Button label follows the mode: "Search flights" / "Find a hotel". Fix: the band's heading sits on the window; keep its contrast check.

### A14. Footer (`components/chrome/Footer.tsx`, `FooterLinks.tsx`)
Keep the V move order: contact first, then columns, then the notice and the base row. Fill `--c-ink`, the hero photo at 12% under the top third only. Inset 16px and radius on Home at 1440 as now; full width on inner pages.
1. **Contact row** (as now): phone 26px Calibre Bold underlined, email 18px, Back to top on the right.
2. **Six link columns** at 1440 (3 x 2 at 1024, accordions at 390 using `m-accordion` styled for dark, each closed but Support open). Heads 14px Calibre Bold `--c-accent-soft`, links 14px Geist white at 80%, 32px row height, underline on hover, focus ring `--c-hero-focus`.
   - **Flights** (8): Search flights `/?mode=flights`; London to Lisbon; London to Barcelona; London to Paris; London to New York; London to Dubai; London to Tokyo; London to Cape Town. Each route is a real `/flights?from=LHR&to=..&depart=..&return=..&adults=1&children=0&infants=0&cabin=economy` URL with depart = today + 21 days and return = depart + 7, computed on the client after hydration (render the URL without dates on the server). Developer A also adds the matching default to the flight and hotel results pages: a missing date fills in as today + 21 (+7 for the return, +3 nights for hotels). It is a small change in the results pages' param parsing; tell Developer B when it lands.
   - **Hotels** (8): Find a hotel `/?mode=hotels`; Hotels in Lisbon; Rome; Paris; Amsterdam; New York; Tokyo; Marrakech. Each `/hotels?place=<slug>&checkin=..&checkout=..&adults=2&children=0&rooms=1`, dates as above (+21, +3 nights). All 7 are hotel cities in the catalogue.
   - **Destinations** (10): the 6 regions (each `/?mode=flights#city-southern-europe` and so on, which opens A12 on that tab), Cheapest months to fly `/?mode=flights#when`, Stays for this weekend `/?mode=hotels#weekend`, Fare deals `/?mode=flights#deals`, Stay deals `/?mode=hotels#deals`.
   - **Your trips** (5): Bookings `/bookings`; Account `/account`; Log in `/login`; Create an account `/register`; Forgot password `/forgot-password`.
   - **Support** (6): Help and contact `/contact`; Questions about flights `/?mode=flights#faq`; Questions about hotels `/?mode=hotels#faq`; Payments and pricing `/terms#payments`; Changes and cancellations `/terms#changes`; Your booking documents `/bookings`.
   - **Company** (5): About us `/about`; Contact us `/contact`; Terms and conditions `/terms`; Privacy policy `/privacy`; Cookies `/privacy#cookies`.
   42 links in all (Priceline 27, Booking.com about 40 in its columns). Developer A adds the `id`s `payments`, `changes` on /terms and `cookies` on /privacy if they are missing, without changing their text (legal text is placeholder).
3. **Facts row**: three hero-muted 13px items with icons: "Prices in USD", "English", "Payments by Stripe". Not pickers (one currency, one language).
4. **Demo notice** as now.
5. **Base row**: "© 2026 Overwing" left, "Created with love by Digital Heroes" right.
- QA: a script fetches every footer href on the built site and asserts 200 (search URLs must render results, not the empty state), and for every href with a hash, loads it and asserts the element with that id exists in the right mode.
- Hash links: on load the page sets the mode from `?mode=` first, then scrolls to the hash (`#deals`, `#faq`, `#when`, `#weekend`, `#city-*`), after the swap. The old `#hotels` and `#search-hotels` are read as the mode (A0.1).

### A15. Homepage at 390 and 1024, summary
- 390: every rail swipes with scroll snap and shows a peek; every grid becomes one column with a "Show more" after 4; navy panels radius 24 and inset 8; the tab bar steps aside on scroll as now. Section spacing 64. No horizontal page scroll (the rails scroll inside themselves).
- 1024: 3-column grids, rails show 3 plus a peek, navy panels inset 16.
- Check every section in both modes at 1440, 1024 and 390, in both palettes, before the critic.

---

## PART B. Inner pages (Developer B)
P1 must ship this round; P2 if time. Order inside each page is the build order. All pages keep the top bar, rail, compact search and existing flows. Every new state needs a 390 version (listed at the end of each page).

### B1. Flight results (`components/flights/FlightResults.tsx`, results.css)
P1
1. **Date-price strip** above the list, under the compact search: 7 cells (depart date minus 3 to plus 3, return shifted by the same days), each 120 x 72 at 1440: a 6px window-shaped top cap in `--c-tint` (the selected cell's cap is `--c-accent`), weekday and date 13px, lowest return total 16px Calibre Bold tabular; the cheapest of the 7 gets `--c-save` ground. Prev and next arrows shift by 7 days. Click loads that date pair (URL change, back works). 390: a horizontal scroll strip of 88px cells, selected centred. Data: routes[].dayLows (a lookup function over the mock offers).
2. **Summary tabs** (Expedia and Booking.com pattern, our pill style): Best / Cheapest / Fastest as three 1fr cells over the list, each with its total and duration ("Cheapest, $824, 14h 05m"). Selecting a tab sets the sort. Replaces the sort pill at 1024 and up; on phones the sort sheet stays.
3. **Sorts** (full list in the sort sheet and a "More sorts" select at desktop): Best, Cheapest, Fastest, Earliest departure, Latest departure, Earliest arrival, Shortest layover.
4. **Filters**, in this order, each a collapsible group with a count of matching results beside each option and the lowest total beside each option where it helps. A "Clear all" link at the top and one "Clear" per group. Active filters show as removable chips above the list.
   - Stops: Nonstop, 1 stop, 2+ stops (each with lowest total).
   - Price: range slider (existing), with a 24-bar histogram of result totals behind it in `--c-tint`.
   - Airlines: all airlines on the route (up to 12) with their mark, lowest total, and an "Only" link on hover or focus that selects just that one. "Show all" after 6.
   - Departure times, outbound and return (two subgroups): Early morning 00:00 to 05:59, Morning 06:00 to 11:59, Afternoon 12:00 to 17:59, Evening 18:00 to 23:59, as 4 toggle tiles with `i-sun` style glyphs and counts.
   - Arrival times: same 4 windows, outbound and return.
   - Journey duration: max slider (shortest to longest).
   - Layover: max layover slider; Connecting airports checklist (airport code and city).
   - Bags: Cabin bag included; Checked bag included.
   - Fare flexibility: Changes allowed; Refundable.
   1024: the filters move into a left drawer opened by "Filters (3)". 390: full-screen sheet with a sticky "Show 42 flights" button.
5. **Card anatomy** (one card per offer, return trip): left 70%: two leg rows, each: airline mark (32px window disc) and name 13px; depart time 20px Calibre Bold and airport code 13px; a line with stop dots and the duration over it and "Nonstop" or "1 stop, LIS 1h 20m" under it; arrival time with "+1" superscript when next day; then a row of included-item icons (`i-bag-cabin`, `i-bag-checked` with a count, `i-seat`, `i-change`) each crossed or ticked, with a tooltip. Right 30%, divided by a 1px dashed line (the boarding stub): total `--t-price-card`, "total for 2 travelers, taxes and fees included", "$451.20 a person", the fare family name ("Light"), button "Select" deep. Chips at the top left: Cheapest, Fastest, Best (at most two), and `a-save` when the fare is under its usual.
   Card expands in place ("Flight details" toggle) to show per-leg detail: flight number, aircraft, terminal, layover airport and duration, overnight warning in `--c-warn`.
6. **Price display rules**: the total for all travelers leads everywhere; per person under it; the list header says "Prices are totals for 2 travelers, taxes and fees included"; the date strip and summary tabs use the same total.
7. **States**: searching (the window, as now, plus 5 skeleton cards); no results with "Remove filters" chips that each show how many results they would bring back; offer expired banner at 30 minutes with "Refresh prices".
P2
8. "Show more flights" pages by 15.
9. 390: summary tabs become a 3-cell sticky strip under the compact search; filter and sort chips in one scrolling row ("Filters", "Stops", "Airlines", "Times", "Sort").

### B2. Flight details and fares (`FlightDetails.tsx`)
P1
1. **Itinerary** (existing) plus per-leg: flight number, aircraft, terminals, layover with airport change warning, total journey time.
2. **Fare families**: three columns (Light, Classic, Flex, names per airline from airlines[].fareFamilies) at 1440, each a card with a 2px bezel edge in `--c-bezel` on the selected one and the teal lit edge on its top and left (the window's edge, our signature). Rows, aligned across the three: Personal item; Cabin bag (size and weight); Checked bags (count and weight); Seat choice (free, paid, not offered); Changes (allowed with fee shown in the price, allowed free, not allowed); Refund (refundable less a fee, not refundable); Priority boarding; Meal. Each row ticked (`i-tick`, accent), paid (`i-info`, muted "for a fee") or not included (`i-close`, muted). Price per fare as the total for all travelers and "+$96 more than Light". Select button per column. 390: the three become a horizontal snap rail of 300px cards, the selected one first, with a sticky Continue bar.
3. **Baggage section**: a table per traveler type of what the selected fare includes.
4. **Fare rules**: plain list of change and cancel terms from the fare.
5. **Price breakdown** in the summary: per traveler type (Adult x2, Child x1), fare, taxes and fees, total; "Includes taxes and fees."
6. **Offer timer**: "Fare held for 24:13" chip in the summary, counts down from the offer's expiry; at 0 the revalidate dialog.
P2
7. Seat map: out (not in Duffel scope this phase).

### B3. Travelers (`PassengerForm.tsx`)
P1: one card per traveler with type and age band in its head ("Adult 1, lead traveler"); fields title, given names, family name, date of birth, gender as on passport, nationality, passport number and expiry (only when the route is international, from the mock); contact card (email, phone with country code select); "Save these travelers to my account" checkbox when logged in, and a saved-travelers picker at the top of each card when the account has them. Inline errors under each field in `--c-error`. Summary on the right, sticky. 390: the Continue bar with the total (exists).
P2: special assistance request text field.

### B4. Checkout (`components/booking`)
P1: summary with every line item, the cancellation terms of the chosen fare or rate in plain words, the offer timer, the revalidation step ("Checking the price with the airline" for 1.5s mock, then "Price confirmed" or the changed-price dialog showing old and new totals and a Continue or Back choice). Card form (simulated), Pay button with the total in it ("Pay $902.40"), `i-shield` "Card payments are handled by Stripe". Failed payment state with the reason and a retry. 390: summary collapses into a "Total $902.40, show details" bar at the top.

### B5. Confirmation
P1: success chip, reference in Calibre Thin `--t-ref`, copy-reference button, itinerary or stay summary, "What happens next" (email sent to the address, e-ticket in your account, check-in opens 24h before for flights; hotel check-in time for stays), buttons View booking, Print. P2: "Add to calendar" (.ics download generated client side), a "Need a hotel in Lisbon?" row of 4 hotel cards for the same dates (cross-sell, uses A4's hotel card), and the reverse for hotel bookings.

### B6. Hotel results (`HotelResults.tsx`)
P1
1. **Filters**, each group with counts: Price per night (slider with histogram); Review score (Exceptional 9+, Excellent 8.5+, Very good 8+, Good 7+); Stars (1 to 5 as toggle tiles); Property type (the catalogue's 6); Free cancellation; Meals (Breakfast included, Half board); Neighborhood (from cities[].neighborhoods with counts); Distance from the center (under 1 km, under 3 km, under 5 km); Amenities (Free wifi, Breakfast, Pool, Parking, Gym, Air conditioning, Spa, Pets allowed, Kitchen, Airport shuttle, Lift, Accessible rooms); Bed type (Double, Twin). The A8 `type` param pre-selects Property type. Active chips above the list; "Clear all".
2. **Sorts**: Recommended, Price (lowest total first), Review score, Distance from the center, Stars (high to low).
3. **Card anatomy**: photo 220 x 220 with a 5-photo carousel (dots, arrows on hover or focus); meta row "4-star boutique hotel" (the catalogue's form); name 18px Calibre Bold; neighborhood, distance and "Show on map" link; `a-score` with word and count; the best room summary "Double room, 1 double bed"; feature lines in accent with `i-tick`: "Free cancellation until Nov 17", "Breakfast included"; scarcity in `--c-warn` only from the data: "2 rooms left at this rate"; price block at the floor, right: total `--t-price-card`, "7 nights, 2 adults", "$106 a night, taxes and fees included"; `a-save` if under usual; button "See rooms".
4. **Map** (exists): pins with the total; selected pin opens a mini card.
5. **Header line**: "Lisbon: 8 stays, Nov 20 to 27, 2 adults" and "Prices are totals for your dates, taxes and fees included".
P2: "Compare" is out; list and map split view toggle at 1440 (list 60%, map 40% sticky).
390: filter and sort as sheets with a sticky "Show 4 stays"; cards full width with the photo on top 342 x 220.

### B7. Hotel detail (`HotelDetail.tsx`), sections in order, with a sticky section nav (Overview, Rooms, Reviews, Location, House rules, Questions) under the top bar once the gallery scrolls away
P1
1. **Gallery**: Kasa grid as built (1 big plus 4), "See all 24 photos" opens a full-screen lightbox with categories (Rooms, Common areas, Outside) and keyboard arrows. 390: swipe carousel with a 1/24 counter.
2. **Overview**: kicker type and stars, name `--t-h1`, address with "Show on map", `a-score` with word and count and the top category ("Location 9.4"), a 3-line description with "Read more". Every count on this page (photos, amenities, reviews) comes from the data, never a fixed number.
3. **Highlights**: 3 rows with icons ("Breakfast on the terrace", "8 min walk to the river", "Quiet rooms on the courtyard side") from hotels[].highlights. Not cards: one row with dividers.
4. **Popular amenities**: 8 icons with labels, then "All 32 amenities" opens a sheet grouped by General, Room, Bathroom, Food and drink, Services, Accessibility.
5. **Availability** (`id="rooms"`): the search bar for this hotel (dates, guests) inline, then a table. One row group per room: left cell room name, photo 120 x 90, beds, size, view, max guests icons, 4 room amenities; then one row per rate plan (the catalogue's 4 plans: Non-refundable; Free cancellation; Free cancellation, breakfast included; Non-refundable, breakfast included): plan name, meals (`i-meal` "Breakfast included" or "Room only"), cancellation ("Free cancellation until Nov 17" in accent, or "Non-refundable" muted), payment ("Pay now by card"), rooms left in `--c-warn` when 3 or fewer, price cell (total `--t-price-card`, "$106 a night", "taxes and fees included"), rooms select (0 to rooms left), and a sticky right column at 1440 with the chosen total and "Reserve" deep. Unavailable rooms show "Not available for these dates" with the next free dates. 390: each room is a card; its rate plans are stacked option cards with a radio; the sticky bottom bar shows the chosen total and "Reserve".
6. **Reviews** (`id="reviews"`): `a-score` large (48 x 58), word, count; 7 category bars (Staff, Cleanliness, Location, Comfort, Value, Facilities, Wifi) with the score at the end, bar fill `--c-accent` on `--c-tint`; filter chips by traveler type (Couples, Families, Solo, Business) and a sort (Newest, Highest, Lowest); 6 review snippets in 2 columns: initial avatar circle, first name and country, month stayed, room, traveler type, score small, title in Calibre Bold, "Liked" and "Disliked" lines with `i-plus` and `i-minus`; "Show all 128 reviews" opens a sheet with paging.
7. **Location**: the static map (exists) with the pin, then "What's nearby": 3 columns (Restaurants and cafes, Sights, Transport) of 5 places each with distances.
8. **House rules**: a two-column table: Check-in (`i-key`) 15:00 to 23:00, Check-out (`i-door`) until 11:00, Children, Beds for children, Pets, Smoking, Parties, Quiet hours, Payment ("Paid by card when you book").
9. **Questions**: 5 hotel FAQs in `m-accordion`.
10. **Similar stays nearby**: rail of 4 hotel cards (A4 anatomy) in the same city with the same dates.
**Short hotels** (the 72 without a showcase record) show: gallery (their photos only, no "See all" under 6 photos), overview, popular amenities, availability with the rooms and plans they have, the score without category bars or snippets unless the catalogue's review pool (section 4) gives them, the location map without the nearby lists, default house rules, similar stays. Never an empty band, and never a review written in a component. Similar stays, A4, A6, A9 and the B5 cross-sell link to showcase hotels first.
P2: "Fine print" block; review search.

### B8. Guests (`GuestForm.tsx`)
P1: lead guest (given and family name, email, phone), "Booking for someone else" toggle with the guest's name, estimated arrival time select (hour slots), special requests textarea with a note that requests are not guaranteed; summary on the right with the room, rate plan, cancellation terms, nights and total. 390: Continue bar with the total.

### B9. Dashboard and Bookings (`components/account/Dashboard.tsx`)
P1: greeting with the first name; next trip card (photo 160, a countdown "In 9 days", route or hotel, dates, reference, View booking); tabs Upcoming, Past, Cancelled (Hoxton pills) with counts; each booking row: product icon, title, dates, travelers or guests, status chip, total, reference, View. Empty states with the closed window and a search button.
P2: "Recently viewed" row from history.views (A4 hotel and route cards).

### B10. Booking detail
P1: status, reference with copy, itinerary or stay, travelers or guests, price breakdown, payment receipt (card brand and last 4 from the mock, date), Documents (e-ticket or hotel voucher: "Download PDF" which downloads a generated simple PDF or opens a print view), the fare or rate's change and cancel terms, Contact support with the reference prefilled (`/contact?ref=OW7K2Q`).

### B11. Profile and account pages
P1 profile: personal details; contact; home airport (feeds A4 and the default origin); saved travelers list (add, edit, remove); recent searches list with "Clear history" (0.6); change password. Login, register, forgot and reset: unchanged except the password rule hints visible before submit, and errors inline.

### B12. Mock data per page (for the wiring)
B1: offers with legs, aircraft, terminals, baggage per fare, usual price, dayLows. B2: airlines[].fareFamilies with every row in B2.2. B3: route international flag. B6 and B7: every hotels[] field in 0.5, rooms with ratePlans and roomsLeft, nearby places (3 x 5 per hotel, may be per city to save copy). B9 and B10: booking records with payment card last 4 and documents.

---

## Conflicts resolved (art-direct order)
1. Varun's V move "Pills only" vs Booking.com's square tabs and score badges: pills stay for buttons and tabs; the score badge takes the window shape instead of a square (identity over imitation).
2. V move "Footer: phone and email first, short link columns" vs the benchmark's 25 to 40 links: the V order stays (contact first, social pills omitted as the client has none), and the columns grow to 42 links. Varun's ruling (competitor footer depth) outranks "short".
3. Anti-slop "three icon cards in a row" vs every competitor's trust row: A10a is a line with four stops, not cards.
4. Anti-slop "numbered labels" vs step numbering: the steps carry no numbers; order is the line.
5. Hipcamp (primary) rhythm of sparse sections vs the benchmark depth: depth wins this round (Varun's round 3 ruling); Hipcamp keeps the app shell and the type system.
6. Priceline strike-through prices vs clear pricing and no member prices: "typical $300" in words, with the method in a footnote.
7. Booking.com's photo-text overlays vs our readable-text rule: names and prices sit under photos, never on them.

## Not checked, and guesses
- Cabin dawn (3002): I looked at its home hero at 1440 only. Its `--c-hero` is the blush wall (#F4E9E7), so every "navy wall panel" in this spec renders blush with `--c-hero-ink` text in Cabin dawn, which is intended: components use the hero roles, never a hex. The new Cabin token values are unmeasured.
- The Booking.com and Expedia deconstruction files were not written when I finished; I used their screenshots and my own knowledge. Inner page depth for them is from memory.
- content/mock-catalogue.md was not complete; field names in 0.5 are my request to the Copywriter and the wiring, not what the catalogue contains.
- No prototype was built for these sections in this stage (time box). The blind animation and the score badge are specified, not proven.
- Page height target (about 9,800px) is an estimate.
