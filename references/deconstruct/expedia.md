# Deconstruction: Expedia (https://www.expedia.com)
Scope: whole booking journey (homepage, flight results, flight next step, hotel results, hotel detail, room to first guest form, account entry, deals and personalisation, help), as a depth inventory for the round 3 benchmark. Measured: 2026-11-11, at 1440 and 390, logged out.

Capture conditions (read before using any number):
- The site geo-located the session to India. It showed a locale strip offering the India site, set the flight origin to an Indian airport and filled the first deals row with Indian hotels. A US visitor sees the same structure with US-centric content. Treat names and prices as samples. The structure is what matters.
- Cookie banner offered only Close. Closed it (no Accept).
- Searches were opened by results URL, not by typing into the search form. Nothing was typed into any form. No sign-in, no booking. Stopped at "Next: Checkout" on flights and at the first guest form on hotels.
- 390 is desktop Chromium at 390px, not a touch device (lessons 11).
- Many rows are ads or personalised. Row content changes between loads; row anatomy does not.
- Screenshots: `references/deconstruct/expedia/`. Names start with the page type (home, flights, flight-review, hotels, hotel-detail, hotel-checkout, account, deals, help).
- All product, loyalty and partner names are left out on purpose. Quoted labels are generic UI words only.

---

## Layout (site-wide)

- Content container: 1200px at 1440 (120px side margins). Header, search card, banners and footer all align to it.
- Results pages (flights and hotels) use a 3-column grid inside the 1200: filter rail 236 (x 120 to 356), list 756 to 758 (x 378 to 1136), ad rail 160 (x 1160 to 1320). Gutters about 22 to 24px.
- Hotel detail: main column 1016 (x 120 to 1136) plus the same 160 ad rail. Overview splits into about 650 main and 326 right (map and nearby).
- Flight review page: narrower 1152 container (x 144 to 1296), main 616, sticky right rail about 360 (sticky top 24px).
- Checkout: form 588 (x 120 to 708), summary 487 (x 833 to 1320). No ad rail, minimal header.
- Header: 72px, white, static (does not stick), shadow `rgba(12,14,28,0.08) 0 2px 12px`. Above it, a 50px near-black locale strip (geo redirect suggestion).
- Radius scale: 16px for cards, panels, banners and the search card. 4px for badges. Full pill (40000px) for every button and chip. 12 to 16px on help topic tiles.
- Vertical rhythm (from box positions, not computed padding): 48px from banner bottom to next section heading. Other module gaps 48 to 64px.
- Fixed elements: a "Help" chat launcher pill bottom-right on every page (about 90x36). At 390 the hotel detail adds a 66px sticky bottom price bar.

## Type (with licence)

| Role | Family | Size / line / weight | Licence |
|---|---|---|---|
| Hero display, promo banner titles, sale cards, value-prop titles | Reckless XPD (custom cut of a serif) | 36/40 400 (hero, banner), 28/32 400 (promo cards) | Commercial (custom brand cut) |
| Everything else | Centra No2, fallback system sans stack | see below | Commercial |
| Section H2 | Centra No2 | 28/32 500 (20px at 390) | |
| Detail H1 (hotel name) | Centra No2 | 36px 500 | |
| Review page and checkout H1 | Centra No2 | 28px 500 | |
| Hotel result card name | Centra No2 | 20/24 500 | |
| Deal card name | Centra No2 | 16/20 500 | |
| Body | Centra No2 | 16px 400, colour #191E3B | |
| Secondary lines (airports, neighbourhood) | Centra No2 | 14/18 or 12/16 | |
| Badges, notes, scarcity | Centra No2 | 12/16 500 (badges), 12/16 400 (notes) | |
| Buttons | Centra No2 | 16/20 500 | |
| Footer heading / link | Centra No2 | 14/18 500 / 12/16 400 link blue | |

Letter spacing normal everywhere measured. No uppercase labels except airport codes. The serif appears only in marketing moments (hero, promo banners, sale cards, value props, first-visit modal). The serif never appears in product UI. That split is the main type technique.

## Color system (evidence only, not for reuse)

- Text and dark ground: #191E3B navy (body text, promo banner ground, loyalty badge).
- Action and link: #1668E3 blue (primary pills, links, selected tab, footer links). Pressed/hover state layer on the button's ::before is #0E3672.
- Positive and value: #227950 green. Used for review score badges, "$X off" badges, cheapest price, "Nonstop", "Free breakfast", "Fully refundable", the date-strip cheapest price and the price-insight icon. One green does all value signalling.
- Scarcity: #A7183C red, 12px text only, never a block.
- Member badge: #304CA2 (out of scope for the client).
- Tint panel: #EFF3F7 (upsell panel, deal banners, segmented control track). The footer ground looks the same tint (by eye).
- Outline pill border: 0.8px #818494.
- Warm yellow tag chips ("coming soon", "promotion", "N nights free"). Yellow value not measured.
- Photos carry all other colour. UI chrome is white, navy, one blue, one green, one red.

## Motion

- Transitions in readable stylesheets: background-color 0.218s; 150ms ease-in; 0.2s ease-in; 300ms ease-in; 0.25s ease-out; height 0.2s linear; width 0.3s linear. Short, plain, functional.
- No scroll-triggered entrances, parallax or load choreography seen on any page.
- Loading: skeleton tiles for the flight price-by-date strip (7 grey bars in outlined tiles) while the result list was already shown. Hotel results showed a first-visit modal over the loaded list rather than a spinner.
- Side sheets (fare sheet, help article) enter from the right. Modals appear centred over a grey scrim. Easing was not timed.
- Flight result card hover: no visible change in the default/hover pair (`flights-1440-card-default.png`, `flights-1440-card-hover.png`). Cursor changes only.
- Reduced motion: no `prefers-reduced-motion` rule found in readable stylesheets. Cross-origin sheets could not be read, so this is unverified.

## Interactions

- Every dialog writes its state to the URL (`pwaDialog=...`, `pwaOverlay=map`, `pwaOverlay=sui-see-all-reviews-dialog`, `idleDialog=...`, `articleId=...`). Back closes the dialog and the link reopens it. Worth rebuilding.
- Product tabs: icon above label, 96px wide, 110px tall, selected = blue label plus underline bar.
- Popovers anchored to the field: travellers (steppers), trip type, cabin, account, "Shop travel" (375px wide menu: 6 products with line icons, divider, 4 secondary links).
- Side sheet from right: 480px (single fare, help article), 720px (multi-fare grid, two columns of fare cards).
- Centred modal 720px over scrim: flight details, room information, all amenities. Reviews modal is 1200px.
- Full-screen overlay: hotel map at 1440. Filter sheet at 390.
- Bottom half-sheet at 390: each quick-filter pill, and an idle nudge at checkout.
- Carousels: image galleries inside cards (prev/next circles on the photo). Row carousels use a "Next card" circle at the right edge and show 4 cards plus a partial fifth.
- Results open the hotel detail in a new tab. The flight review page also opened in a new tab.

---

## Page 1. Homepage

Screens: `home-stays-1440-hero.png`, `home-stays-1440-full.png` (some lazy photos blank in the full shot, see Not seen), `home-1440-packages-travelstyle.png`, `home-flights-1440-hero.png`, `home-flights-1440-deals.png`, `home-flights-1440-travelers-popover.png`, `home-1440-shoptravel-menu.png`, `home-stays-390-hero.png`, `home-stays-390-full.png`, `home-390-menu.png`, personalised version `home-personalised-1440-full.jpg`.

### Inventory (first visit, Stays selected, top to bottom)

0. Locale strip, 50px, near-black: one sentence suggesting the visitor's country site plus a link. Out of scope (one locale).
1. Header, 72px: logo; "Shop travel" dropdown (6 products plus deals, groups, magazine, loyalty card); right cluster: currency with flag, list your property, support, trips, inbox icon, sign in. Currency and loyalty items are out of scope.
2. Hero: full-bleed landscape photo band 345px tall (y 122 to 467). Serif slogan centred, 36px white, one line. Search card 1200x268, white, radius 16, starts at y 261 so it overlaps the photo by about 206px.
   - 6 product tabs (stays, flights, cars, packages, things to do, cruises), each a colour illustration icon over a label.
   - Stays form: one pill-shaped bar with 3 segments (destination 523 wide with pin icon; dates with calendar icon, default tomorrow to day after; travellers with person icon, default "2 travelers, 1 room") and a blue Search pill (81x48) inside the bar's right end.
   - Below the bar: checkbox to add a flight (bundle).
3. Promo banner: navy, 1200x112, radius 16. Coupon illustration left, serif 36px percent-off headline, 16px subline, white pill CTA (107x48) right.
4. Weekend deals row: heading 28/500 plus a one-line promise (minimum percent off), outline "See all deals" pill (124x36) right. 5 hotel cards (4 visible plus a next-card circle), card 288 wide, 16 gap. Each card carries 11 data points: 3-photo gallery with arrows; save heart; name; city; green score badge; score word; review count; deal badge ("$X off" green, or member-price badge); nightly price; total price with strikethrough "was" (button opens a standard-rate explainer); green check plus "Total with taxes and fees". The link carries preset dates (next weekend, 2 nights), 2 adults, rating 4+ and 3 to 5 stars.
5. Ad module: 1200 wide, photo left half, partner logo, title, 2-line text right, small "Ad" chip.
6. Two sale cards side by side (588 each, outlined, radius 16): yellow tag chip, serif 28px title, one line, small outline pill CTA.
7. Value-prop trio in one tinted panel (radius 16): colour illustration, serif 28px title, two-line text, small outline pill each (bundle savings, one-stop shop, loyalty programme). The loyalty tile is out of scope.
8. Rental types row: heading plus 5 photo tiles (about 228x240), white bold label bottom-left on each (private homes, apartments, cabins, cottages, villas).
9. Packages row: heading, 2 destination tabs (underline tabs), 10 package cards (270 wide, 12 gap, 4.3 visible). Each card: photo; "Hotel + Flight" title (2 lines, ellipsis); area; building icon plus "N stars - score/10 word (count)"; plane icon plus "origin (IATA) - destination (IATA)"; yellow badge with icon "N nights free"; large price, info icon and strikethrough; "per traveler"; date range with night count; freshness line "Found N hours ago". Under the row: filled blue pill left (explore packages), text link right (about package savings).
10. Travel-style row: heading plus a subline saying prices are monthly averages. 5 tabs (beach, culture, ski, family, wellness). Cards 288 wide, 4 visible, 25 links across tabs. Each card: photo with dark vibe chip top-left (2 words), destination, region and country, "$X avg per night".
11. Loyalty credit-card banner: full-width outlined card, centred title and small text, chevron right. Out of scope.
12. Sponsored destination module (tourism board ad): logo, title, line.
13. Footnote: asterisk line qualifying the bundle savings claim.
14. Link hub: H2 28px, 15 horizontal tabs (hotels domestic, hotels international, flight deals domestic, international flights, packages, flight plus hotel, domestic destinations, international destinations, airport car rental, international car rental, rental destinations, cruise ports, last-minute hotels, tips, weekend getaways). Each panel: 20 links in 4 columns of 5. 286 links in the DOM.
15. Footer (below).
16. Fixed "Help" chat pill bottom-right.

### Switching Stays to Flights (measured)

- URL stays `/`. Page height 5077 to 4976. No navigation.
- What changes:
  1. Search card body. Trip-type dropdown (roundtrip, one-way, multi-city) and cabin dropdown (economy, premium economy, business, first) sit above the bar. Bar: leaving from (prefilled with the geo-located airport), circular swap button, going to, dates (default 2 weeks out, 1-week trip), travellers. The travellers popover (375 wide) has 4 steppers (adults; children 2 to 17; infants on lap; infants in seat) and a Done pill. The checkbox becomes "add a stay".
  2. The first content row only. The hotel weekend-deals carousel is replaced by "Flight deals from [origin city]": a 1200x300 static map, a dark origin pin and a centred dark pill CTA (explore all flight deals).
- What does not change: promo banner, ad, sale cards, value props, rentals, packages, travel style, loyalty banner, link hub, footer.
- Separately, `/Flights` is a full product landing page (`flights-landing-1440-datepicker.png`): H1, trip-type tabs, inline search, popular airline logo tiles, "flights under $200 / $300" tabs, popular destinations, flight deals near you, 3 inspiration cards (domestic, international, business class), a 14-question FAQ accordion and the link hub. Expedia keeps product depth on separate landing pages. The homepage tab swaps only the search and one row. Round 3 asks our designs to change the homepage content in place. Expedia does the minimum here, so this is an easy place to beat them.

### Footer (full)

- Ground: light blue-grey tint, full width, 530px tall at 1440. Parent-group wordmark top-left.
- 4 columns at x 120 / 430 / 740 / 1050 (310 pitch), headings 14/18 500, links 12/16 blue:
  - Company, 9 links: about, jobs, list your property, partnerships, newsroom, investor relations, advertising, affiliate marketing, feedback.
  - Explore, 9 links: country travel guide, hotels in country, rentals in country, packages in country, domestic flights, car rentals in country, all accommodation types, loyalty rewards, loyalty credit cards.
  - Policies, 8 links: privacy, cookies, terms of use, loyalty terms, sister-brand terms, accessibility, privacy choices, content guidelines and reporting.
  - Help, 7 links: support, cancel hotel or rental, cancel flight, refund basics, use a coupon, international travel documents, flight passenger rights.
- 33 links total. A hairline rule, then one centred legal line: copyright, trademark notice and seller-of-travel registration number.
- Not present: newsletter, social icons, payment or trust badges, app badges, contact details. Our footers can beat this by adding them.
- At 390: 4 groups stacked and fully expanded (no accordions), about 338px per group, footer about 1400px tall.

### Layout and key measures

- Search card 1200x268, radius 16, overlapping the hero photo by about 206px. Search pill bar inside it, Search button 48 tall.
- Promo banner 1200x112. Deal cards 288 wide. Package cards 270 wide. Travel-style cards 288 wide.
- Section heading pattern: H2 28/500 left, optional 14 to 16px subline, outline pill (36 tall) right-aligned to the heading baseline.

### At 390

- Locale strip wraps to 2 lines. Header shrinks to logo plus account icon (the icon opens one combined menu, see Page 7).
- No hero photo, no slogan. Product tabs become a sideways-scrolling icon row; a partial 4th tab shows as a scroll cue.
- Search stacks into 3 full-width outlined fields (destination; dates with small label above value; travellers), then the checkbox, then a full-width 48px Search pill.
- Promo banner keeps navy. Serif title wraps to 2 lines at 28px. CTA becomes an inline underlined link.
- Deal cards 278 wide (1.3 visible). "See all deals" moves under the row. Package cards 258 wide.
- Sale cards and value props stack one per row. Rental tiles shrink to 131x175 (2.7 visible).
- Link hub shows 1 tab at a time in a sideways tab strip and a single column of links.
- Page height 7206 at 390 (5077 at 1440).

### What makes it precise

- Every price sentence on every card has the same 4 parts: discount badge, nightly price, total with strikethrough, and a check line saying taxes and fees are included.
- Every number has a qualifier: per traveller, avg per night, N nights, found N hours ago, (N reviews).
- Rows are pre-filtered deals (dates, guests, rating floor and star range are baked into the links). The click lands on a usable result.
- The serif is used only for marketing moments. Product UI uses the sans only.

---

## Page 2. Flight results (London to Lisbon, roundtrip, 25 Nov to 2 Dec 2026, 1 adult, economy)

Screens: `flights-1440-loading.png`, `flights-1440-results-top.png`, `flights-1440-results-full.png`, `flights-1440-card-default.png`, `flights-1440-card-hover.png`, `flights-1440-fare-sheet.png`, `flights-1440-flight-details.png`, `flights-1440-fare-families.png`, `flights-390-results.png`, `flights-390-filter-sheet.png`, `flights-390-stops-pill.png`.

### Inventory

Top band:
- Trip-type tabs (roundtrip, one-way, multi-city) with underline.
- Search row: leaving from, swap circle, going to, dates, "travelers, cabin class" combined field, blue Search pill 48 tall. The leaving-from field rendered empty although results were for London (URL quirk, not a design choice).

Left rail (236 wide):
1. Price-alert card: bell in a tinted circle, title, 2-line text, toggle switch.
2. "Filter by" heading, then 9 groups. Every checkbox option shows a result count and a "From" price in a right-hand column with a "From" header:
   1. Stops: nonstop (18), 1 stop (85). On the return leg also 2+ stops (4).
   2. Airlines: 17 airlines with count and from-price, "Show less / Show more" toggle.
   3. Preferred class: basic economy (99, with sub-note that it may exclude seats or bags), economy (74), business (63).
   4. Travel and baggage: 4 icon tiles in a 2x2 grid (seat choice included, carry-on included, refundable fare, changes included). Each tile has a from-price.
   5. Total travel time: single-handle slider, value label "Under 25h".
   6. Departure time in [origin city]: 3 icon tiles (morning 5:00 to 11:59, afternoon 12:00 to 5:59, evening 6:00 to 11:59) with sun and moon icons.
   7. Arrival time in [destination city]: same 3 tiles.
   8. Departure airports: 5 London airports, each with count and from-price. The return leg shows arrival airports.
   9. Layover airport: 16 hubs with count and from-price, show less toggle.

Main column (758 wide):
1. Flexible-dates strip: 7 outlined tiles (3 days either side of the chosen date), each with weekday, date and lowest roundtrip price. The selected tile has a 2px navy outline and tinted ground. The cheapest price is green. While loading, each tile shows a grey skeleton bar.
2. Heading "Departing flights" 28px (the page H1 is a longer "select your departure to [city]" sentence). Under it: info link explaining sort order and personalised savings, and a 12px note that final prices and fees are confirmed before payment.
3. Sort select (outlined, label above value), 9 options: recommended, price low to high, price high to low, shortest duration, longest duration, earliest departure, latest departure, earliest arrival, latest arrival.
4. Result cards: 25 cards then an outline "Show More" pill. Card 758 wide, about 80 tall, white, radius 16, hairline border:
   - airline logo (about 32px) left;
   - departure time, a horizontal line (with a dot per stop), arrival time, 16/500;
   - "Origin (IATA) - Destination (IATA)" 12px grey;
   - airline name, plus "operated by" when codeshared;
   - middle: duration plus stops ("Nonstop" in green), layover line under it ("2h 40m in BCN");
   - right: price 20/500 (green when it is the cheapest), "Roundtrip per traveler" 12px; on some cards a red "N left at $X" line above the price.
   - The accessible label leads with a tag such as "Cheapest".
5. After the 3rd card: bundle interstitial card (luggage illustration with $ coin, bold title, savings sentence with info icon, small filled pill to shop flight plus stay).
6. Under the list: feedback prompt with outline pill, app promo (out of scope), footer.

Right rail: 160-wide display ads stacked.

Price display:
- List price = roundtrip price for one traveller, rounded to whole dollars, taxes included (stated in the note under the heading).
- Exact cents appear in the fare sheet ("$115.31 roundtrip for 1 traveler").
- On the return leg, prices become deltas against the chosen outbound (see Page 3).

Fare families (side sheet opened by clicking a card):
- Low-cost carrier, one fare: sheet 480 wide. Header: close circle, "Review fare to [city]", time range with duration and stops (20px), airline with a CO2 tag (green "below average"), "Flight details" link. One fare card: price 28/500, exact total line, fare name, cabin, then 5 attribute rows with icon semantics:
  - $ in a black circle = available for a fee, with fee range right-aligned (carry-on $14 to $68, 1st checked bag $12 to $68, seat choice);
  - green check = included (personal item);
  - plain X = not available (non-refundable);
  - change fee applies ($).
  - Then a price-drop protection add-on (shield icon, one line, checkbox with its price) and a full-width blue Select pill.
- Full-service carrier, 6 fares: sheet 720 wide, fare cards in a 2-column grid, a floating down-arrow circle to scroll. The 6 fares climb from basic economy (bag for a fee, change fee) through economy with 1 bag (50 lb) and economy with seat, bag, refund minus fee and free changes, to business with 2 bags (70 lb each), and fully refundable flexible versions of economy and business. Prices ran from 1x to 5.8x the basic fare. Header adds wifi and power icons and a grey "above average CO2" tag.
- Each fare card repeats the same 5 rows in the same order, so the cards compare by scanning across.

Flight details modal (from the "Flight details" link): 720 centred over scrim. Airline plus flight number; vertical blue timeline with origin city, airport name and code on the left and time, timezone and date on the right at each end; travel time between; then cabin and emissions rows (CO2 pill with info icon).

Baggage information appears in 3 places: the filter (carry-on included tile), every fare card (carry-on, checked bag fee or weight allowance) and the review page fare summary.

Price calendar: no month calendar with prices was seen. The flexible-dates tool is the 7-day strip on results. The date picker on `/Flights` shows a plain 2-month calendar (range fill light blue, ends as filled blue circles about 46px, today as a small filled dot) with no prices while the destination is empty. With a destination filled it was not tested, because that needs typing.

Loading state: list appeared fast. The 7-day strip showed skeleton bars inside outlined tiles (`flights-1440-loading.png`).

### Layout and key measures

- Rail 236, list 758, ad rail 160, gutters 22 to 24.
- Card 80 tall. Price 20/500. Times 16/500. Meta 12.
- Date tiles about 100x56 each, 7 across the 758 list width.

### At 390

- Header: logo, outline "Open app" pill, account icon.
- Search collapses into a summary card ("to [city]", date range, travellers) with a pencil edit button.
- Price-alert card full width. Date strip scrolls sideways, centred on the selected date.
- Pill row (scrolls sideways, with prev/next arrows): filter icon pill (opens full sheet), "Sort by Recommended" pill, then quick-filter pills: stops, airlines, preferred class, travel and baggage.
- Card restack: times row with line, airports, airline, then duration plus stops on its own row. Price stays top-right.
- Full filter sheet: full screen. Header: close circle, "Filters", "Clear" link right. Sort select first, then all 9 groups. Sticky footer with a blue Done pill.
- Quick-filter pill: bottom half-sheet (about 240 tall) over scrim, with title, Clear, the group's options and Done.

### What makes it precise

- Every filter option says how many results it leaves and the cheapest price it leads to, so filtering is a price decision.
- Fare families use 3 fixed icons for included, fee and not available, with fees right-aligned. Fares compare at a glance.
- Price wording is consistent: "Roundtrip per traveler" on every card, the exact cents total in the fare sheet, and a note under the heading saying final prices are confirmed before you pay.

---

## Page 3. The step after choosing a flight

Screens: `flights-1440-return-step.png`, `flight-review-1440-full.png` (car photos and app image blank, lazy).

### Inventory

Step A, return selection (same results template, same URL family):
- Breadcrumb row: chosen outbound as "[airline] · LON → LIS" with a "Change flight" link under it, chevron, bold "Choose returning flight", chevron, "Review your trip".
- Insurance banner: outlined card, shield-check icon, one bold sentence.
- "Returning flights" heading, sort select, filter rail rebuilt for the return leg (adds 2+ stops and arrival airports, with time filters for the return cities).
- Return cards show price as a delta: "+$0" or "+$19" large, with the resulting roundtrip total ($253) small under it and "Roundtrip per traveler".
- Return fare sheet: each fare shows its delta (+$0, +$32, +$182, +$330), the new total, and a note that all flights update to match the chosen fare.

Step B, "Review your trip" (opens in a new tab):
- 2-step indicator top-left ("Your flights" bold, chevron, "Checkout").
- H1 28px.
- Price insight banner: tinted, green down-arrow icon, bold "price is better than expected" with info icon, line "at least N% lower than the typical fare".
- Itinerary card: 2 legs. Each leg: "Origin to Destination" heading 20px, time range with duration and stops, airline and date, CO2 chip, "Flight details" link left, "Change flight" link right. Divider between legs.
- Fare card: "Your fare: [fare]" with the same 5 icon rows (checked bag fee now shown for the whole trip, $230).
  - Nested upsell panel in tint #EFF3F7: "Get more with [higher fare]", 3 green-check benefits (2 bags, priority check-in, lounge), "See all fares" link, outline "Upgrade now" pill left, "+$330 Roundtrip per traveler" right.
- Price-drop protection card: illustration, title, line, "How it works" link, outline "Add to flight" pill, "+$10" right.
- Seats and bags card: one line saying seats and bags are arranged with the airline after booking.
- Cross-sell: flight plus car bundle, 2 car cards (category, model "or similar", bundle total, "flight + car" label, outline "Add car" pill), "Explore car rentals" arrow link.
- Right rail (sticky): Price details card (traveller 1 adult $253.00, Trip total $253.00 bold, currency note, full-width blue "Next: Checkout" pill, note that the total includes taxes, fees and agency charges). Under it, a free-cancellation card (clock illustration, "free to cancel within 24 hours").
- Feedback prompt, app promo, footer.
- Stopped here. The first form is behind "Next: Checkout" and was not opened.

### Layout and key measures

Container 1152. Main 616. Rail about 360, sticky top 24. Cards radius 16 with hairline borders. Upsell panel bleeds to the card edges inside the fare card.

### At 390

Not captured for steps A and B (see Not seen). Step A shares the results template, so its 390 behaviour is the Page 2 behaviour.

### What makes it precise

- Return prices and fare upgrades are shown as deltas against what is already chosen. Every option answers "how much more than now".
- Every leg on the review page has its own change link.
- The fare summary repeats the same icon rows used in the fare sheet, so nothing is re-learned.
- The price rail stays visible with the total and the next step.

---

## Page 4. Hotel results (Lisbon, 2 adults, 25 to 29 Nov 2026, 4 nights)

Screens: `hotels-1440-loading.png` (first-visit modal), `hotels-1440-results-top.png`, `hotels-1440-results-mid.png`, `hotels-1440-map.png`, `hotels-390-results.png`, `hotels-390-filter-sheet.png`.

### Inventory

First-visit modal: 480 wide, centred, scrim. Illustration in a tinted circle, small sans line, serif 28px statement that prices include taxes and fees, full-width blue "Got it" pill, underlined "Learn more" link, close circle. It appears once and teaches the price display before the visitor reads a card.

Search band: 3 outlined fields (where, dates, travellers) about 310 each, plus a round 48px blue search icon button.

Left rail (236 wide):
1. Map preview card: static map 236x100 plus a "View in a map" link.
2. Compare card: one-line title, 2-line explainer (side by side, up to 5), toggle.
3. Search by property name: H2 plus input with search icon.
4. "Filter by", then 20 groups. Counts are on every option. "See more" expands long groups.
   1. Nightly price: Min and Max outlined fields ($20 and $250+), a histogram of about 30 navy bars, and a dual-handle range slider under it.
   2. Popular filters (5): breakfast included, hotel, wifi included, reserve now pay later, pool.
   3. Property amenities (5 + see more): wifi, pool, air conditioned, gym, spa.
   4. Property type (3 + see more): hotel, aparthotel, hostel.
   5. Property brand (3 + see more).
   6. Guest rating (radio with from-price): any, 9+, 8+, 7+.
   7. Property class (checkbox with from-price): 5, 4, 3 + see more.
   8. Room amenities (5 + see more): private bathroom, air conditioning, balcony or patio, kitchen or kitchenette, wifi.
   9. Neighbourhood (3 + see more), selecting one refreshes the page (stated in accessible text).
   10. Traveller experience (4 + see more): family friendly, luxury, LGBTQ welcoming, romantic.
   11. Availability: only show available properties.
   12. Room views (3 + see more): ocean, river, city.
   13. Nearby activities (3 + see more): museums, golf, climbing.
   14. Payment type: pay over time (third-party financing), reserve now pay later.
   15. Property cancellation options: fully refundable.
   16. Meal plans: breakfast, all inclusive, dinner, lunch.
   17. Accessibility (3 + see more): elevator, stair-free path, accessible bathroom.
   18. Number of bedrooms: studio, 1, 2 + see more.
   19. Loyalty benefits and discounts: discounted properties, member prices, loyalty-tier properties (out of scope).
   20. Beach access: near the beach (with a sub-line defining 15-minute walk), on the beach (with a sub-line).

Main column (756 wide):
1. Segmented control on a tint track: all stays, hotels, homes (icon plus label each).
2. Meta row: "300+ properties" left; "How our sort order works" with info icon; sort pill dropdown right with 6 options: recommended for you, price low to high, price high to low, distance from downtown, guest rating plus our picks, property class.
3. Personal deal banner: tint ground, radius 16, coupon illustration, bold "up to an extra $X off, just for you", one line, underlined "View terms" link right.
4. Property card, 756x216, radius 16, hairline border:
   - Photo 252x216 left, gallery arrows, heart save top-right in a white circle, badge top-left (navy loyalty tier), "Ad" chip bottom-left on sponsored cards.
   - Name 20/24 500. Neighbourhood 14.
   - 3 amenity icons with labels in one row (bar, restaurant, shuttle, AC, housekeeping and similar).
   - Sponsored only: bold promo title and 2 to 3 lines of description.
   - Green "Fully refundable" line on some cards. "Reserve now, pay later" on some.
   - Review: green score badge (24px, radius 4), score word 16/500, "N reviews" 12.
   - Price stack, right-aligned bottom: green "$X off" badge; "$Y nightly" 16/400; strikethrough was-total plus "$Z total" 16/500; "Total with taxes and fees" 12; red "We have N left at this price" 12. Some cards add a blue "sign in for extra savings" pill (out of scope).
   - No star rating on list cards. Property class exists only as a filter and on the detail page.
5. Interleaved modules: bundle stay-plus-car card after the 3rd card ("great deal" title, savings line, small blue pill); a "the right stay for every trip" homes promo around card 24; brand ad cards around card 100; empty ad slots between.
6. About 100 property cards render, then a "Show more" pill. Count shown as 300+.
7. Feedback prompt, app promo, footer. Ad rail right.

Map ("View in a map"): full-screen overlay at 1440, URL `pwaOverlay=map`.
- Top bar: close circle plus destination name.
- Pill row floating over the map: Filters (with icon), Price, Popular, Property amenities, Property type, Sort. All are dropdown pills.
- Price pins: blue pills with white total price. Selected pin turns navy. Cluster pin reads "N properties".
- Neighbourhood label chips with a building icon. POI icons colour-coded by type (park green, museum purple, food orange, shop yellow).
- Zoom +/- and a street-view figure right.
- Clicking a pin docks the property card at the bottom centre (720 wide), same anatomy as the list card, with a close X.
- No split list-plus-map view at 1440. The map replaces the list.

Deal and discount labels on this page: personal deal banner; "$X off" green badges; strikethrough totals; scarcity red; loyalty-tier badge; "Ad" chips; bundle interstitial.

Recommended and recently viewed rows: none on the results page itself. They appear on the homepage after browsing (Page 8).

### Layout and key measures

Rail 236, list 756, card 216 tall with a 252 photo (photo about 1/3 of the card). Price stack right-aligned 12px from the card edge. Badges 24 tall, radius 4.

### At 390

- Header: logo, "Open app" pill, account icon.
- Search summary card (destination, dates, travellers) with pencil.
- Segmented control full width.
- Pill row scrolling sideways: all-filters icon pill (accessible label states the number of filters applied), price, popular, amenities, type, sort.
- Count and sort-order link centred. Deal banner full width.
- Card stays horizontal: photo about 128 wide on the left at full card height (about 280), content stacked on the right, price stack bottom-right.
- Floating blue "Map" pill with map icon, bottom centre.
- Filter sheet: full screen. Header: close, "Sort & Filter", "Clear". Then compare toggle, sort select, search by name, type-of-place segmented control (any, hotels, homes), price fields plus histogram, then the groups. Sticky footer: live count "300+ available properties" left, blue Done pill right.

### What makes it precise

- The price histogram shows where prices cluster before the visitor drags the slider.
- Every filter option has a count.
- The card always gives nightly price, total for the stay, the discount and the tax statement together.
- A one-time modal teaches the price model at the moment of first contact.
- The mobile sheet footer shows a live result count before the visitor commits.

---

## Page 5. Hotel detail (a 4-star central Lisbon hotel, 4 nights)

Screens: `hotel-detail-1440-top.png`, `hotel-detail-1440-rooms.png`, `hotel-detail-1440-room-price.png`, `hotel-detail-1440-price-breakdown.png` (standard-rate explainer), `hotel-detail-1440-room-info.png`, `hotel-detail-1440-reviews.png`, `hotel-detail-1440-all-reviews.png`, `hotel-detail-1440-full.jpg`, `hotel-detail-390-top.png`, `hotel-detail-390-rooms.png`.

### Inventory (in order; page 9627 tall at 1440)

1. Search band (where, dates, travellers, Search pill).
2. Utility row: blue back-arrow link to all properties left; outline Share and Save pills right.
3. Gallery 1016x286, radius 16: one large photo (508 wide) left, 2x2 grid right, photo-count chip ("72+" with gallery icon) bottom-right.
4. Sticky section nav: Overview, About, Rooms, Policies, Accessibility (underline on active, scroll-spy). Right: Save pill (appears once scrolled), blue "Select a room" pill, outline "Ask" pill with search icon (AI questions).
5. Overview, 2 columns:
   - Left: navy loyalty-tier badge; H1 36px name; 4 star icons plus info button (class explained); green score badge plus word 20px; "See all N reviews" link with chevron.
   - Highlights for your N-night trip: 4 items, each an icon in a tinted circle plus bold title plus one line (couples, rooftop bar, garage parking, location). The heading uses the visitor's trip length.
   - About this property: 6 amenities in 2 columns with line icons, "See all" link. This opens a 720 modal with 15 amenity groups: internet, parking, shuttle, food and drink, restaurants, pets, things to do, family friendly, conveniences, guest services, business services, outdoors, accessibility, more, activities nearby.
   - Right: "Explore the area": static map 326x140 with the property pin and POIs, address, "View in a map" link; 4 nearby places, each with pin icon, name, type and walk or drive time right-aligned (3 min walk ... 12 min drive to the airport); "See all about this area" link.
6. Loyalty box (out of scope).
7. AI Q&A block: H2 28px, line explaining AI answers from property data, "Ask anything" input and 4 suggested-question chips (check-in time, breakfast, airport distance, restaurants).
8. Choose your room (H2 28):
   - Change-search row: start date, end date, travellers fields.
   - Price insight card: green check in a tinted circle, bold "price is typical", line comparing similar properties, "More details" link.
   - Room filter chips: all rooms (selected, navy outline), 1 bed, 2 beds, 3+ beds. "Showing 7 of 7 rooms" right.
   - Room cards, 3 per row, 331 wide, about 689 tall, radius 16, hairline border:
     - optional blue header ribbon (frequently booked, upgrade your stay);
     - photo 331x150, carousel arrows, photo-count chip;
     - room name 16/500; room score badge, word and review count;
     - attribute list with icons: free breakfast (green), area in sq ft, bedrooms, sleeps N, bed configuration, free wifi, plus room-specific extras (sitting area, workspace, top floor, rollaway, shower and tub);
     - one highlighted extra as a grey tile (crib);
     - "More details" link;
     - Cancellation policy, "per stay", "More details on all policy options" with info: radio group "Non-refundable +$0" / "Fully refundable before [date] +$58" with a "Reserve now, pay later" sub-line;
     - on some rooms an "Extras, per night" radio group (no extras +$0 / breakfast +$22);
     - price stack: green "$X off" badge, nightly, strikethrough plus total, "Total with taxes and fees", small red "We have 1 left" bottom-left;
     - full-width blue Reserve pill; "You will not be charged yet" under it.
   - Sold-out room variant: same top half, then "We are sold out" in red, with no policy and no price.
   - 7 room types: 3 rows of 3, then 1.
   - Room information modal (720): photo carousel; name; 6 highlight icons in a grey grid panel; attribute list; room reviews (score plus "guests like it for" 8 tags with counts); room amenities grouped (accessibility, bathroom, bedroom, entertainment, family, food and drink, internet, more, safety); then the same policy radios, price stack and Reserve inside the modal.
9. You may also like: sponsored carousel, 10 cards (photo, name, area, 4 amenity lines, score, nightly, was and total).
10. Things to do nearby: "N popular things to do nearby", carousel of 6 activities (photo, title, rating, from-price).
11. Similar properties: carousel, 10 cards, same anatomy as item 9.
12. Policies (H2 28): an AI "Ask anything" input with 5 suggested question chips (pets, fees, deposit, payment methods, check-in instructions). Then sub-sections H3 20px:
    - check-in (window, late check-in, minimum age) and check-out side by side;
    - special check-in instructions;
    - renovations and closures (dates, affected areas);
    - access methods;
    - pets;
    - children and extra beds;
    - property payment types (card logos).
13. Important information: fees, optional extras, you need to know, we should mention, property class explanation.
14. Accessibility: common areas and rooms in 2 columns.
15. Reviews (H2 28):
    - Left: score "9.0/10" large (score green, "/10" navy), word, "N verified reviews" with info; 3 category scores in a row with vertical dividers (cleanliness, amenities, service).
    - Right: review cards carousel (2.3 visible). Each card: "score/10 word", text with "See more", name, date, "Verified review".
    - Outline "See all N reviews" pill opens the 1200-wide reviews modal:
      - Left column: summary score; AI "what guests liked" box with 3 bullets and mention counts; AI disclosure line and Report link; 4 category scores in a 2x2 grid (cleanliness, staff and service, amenities, property conditions and facilities).
      - Right column: search icon button, filter pills (guest rating, traveller type, reviews with photos), "Showing N reviews", Sort by (most recent, most relevant, highest rating, lowest rating).
      - Each review: score and word heading 20px, reviewer name, traveller type, date, smiley icon with liked categories, text, "Stayed N nights in [month]", "Verified review" with info, then an indented property response block with date.
16. Feedback prompt, banner ad, app promo, footer. Ad rail runs down the right until the reviews.

Questions and answers: Expedia has no human Q&A list. It uses AI "Ask" in 3 places (sticky nav button, the Q&A block, the policies block), each with suggested questions.

Price breakdown: not on the detail page. The strikethrough opens a short standard-rate explainer modal (480, Close link). The full breakdown appears at checkout (Page 6).

### Layout and key measures

Main 1016, gallery 286 tall, overview left about 650 and right 326, room cards 331 wide at 16 gap. Section H2 28/500. Sub-section H3 20. Sticky nav about 44 tall with a hairline under it.

### At 390

- Page 13142 tall.
- Header: logo, Open app, account icon.
- Gallery becomes a full-bleed single-photo carousel (about 220 tall) with overlaid back arrow, Share pill, heart, next arrow and photo-count chip.
- Section tabs scroll sideways under the gallery.
- Single column. Highlights list keeps its icons.
- Room cards one per row, 366 wide, about 709 tall, same anatomy.
- Sticky bottom bar, 66 tall: total price large and nightly small on the left; blue "Select a room" pill and outline "Ask" pill on the right.

### What makes it precise

- Highlights are written for this trip ("for your 4-night trip").
- Every room shows area, occupancy, bed configuration, its own review score and its own photo count.
- Cancellation and extras are radio choices with explicit price deltas, so the price stack updates in place.
- Reviews have 4 category scores, an AI summary with mention counts, traveller type, stay length and owner replies.
- Every distance is a time with a travel mode.

---

## Page 6. Choosing a room, up to the first guest form

Screens: `hotel-checkout-1440-first-form.png`, `hotel-checkout-390-first-form.png`.

### Inventory

- Clicking Reserve went straight to a checkout session page (same tab). There is no separate room-confirmation step and no sign-in gate.
- Header reduced to logo plus an outline Share pill. No navigation, no footer links in the header.
- Right summary column (487):
  - Booking card: photo carousel with "1/5" counter and loyalty badge; hotel name 20; room name; beds, sleeps and area on one line with bullets; guests ("2 adults"); dates with night count; cancellation status as an underlined link ("Non-refundable"); stay highlights row with chevron; underlined "Any special or accessibility requests?" link.
  - Price details card:
    - "4 nights" $576.00, with "$144.00 per night including $310.48 off" under it;
    - taxes and fees (underlined, opens detail) $34.55;
    - local tax, due at property, $35.74;
    - Total (USD) $646.29 bold;
    - Pay today $610.55;
    - Due at property $35.74 with the local-currency amount (EUR 32.00);
    - scarcity line;
    - "Use a coupon" (out of scope).
- Left form column (588). This is the first form; nothing was typed or touched.
  - "Who's checking in?" with a required-field note. Outlined card: first name, last name, email, country-code select plus phone.
  - "Payment details": radio cards for card (with 7 network logos), pay over time, PayPal, Apple Pay. Card fields: name on card, card number with lock icon, expiry, CVV with info, billing ZIP.
  - "Protect your stay": required radio choice between an insurance plan (price per person, covered reasons) and no protection (with the amount at risk stated).
- Guest details and payment are on one page. There is no separate guest step.

### Layout and key measures

Form 588 left, summary 487 right, 125 gap. Fields 48 tall, outlined, radius about 8, floating labels. Price rows 14px with values right-aligned, total 16/500.

### At 390

- Summary card first, then price details, then the form.
- After a short idle, a bottom sheet nudge appeared: close circle, bold "this booking is almost yours", 2-line encouragement, full-width blue "Continue booking" pill. It is recorded in the URL as `idleDialog`.

### What makes it precise

- The price breakdown separates what is paid now from what is due at the property, and shows the local currency for the at-property part.
- The cancellation status of the chosen rate stays visible next to the form.

---

## Page 7. Account entry and account menu

Screens: `account-1440-signin-menu.png`, `home-390-menu.png`, `account-1440-signin-page.png`, `account-390-signin-page.png`.

### Inventory

- Signed-out account popover at 1440 (from header "Sign in"): 375 wide, anchored right under the header. Bold 2-line headline about member savings, full-width blue Sign in pill, blue link to learn about the loyalty programme, divider, Feedback link. On first load the accessibility tree showed this popover as already expanded. It was not visible in the hero screenshot, so the auto-open is not confirmed.
- 390 account menu (from the account icon): one combined panel about 366 wide. Contents in order: sign-in block (headline, blue Sign in pill, loyalty link); Inbox; divider; Shop travel (search icon); Support (help icon); a language, currency and country row with flag; divider; list your property; Trips; Feedback. At 390 it replaces the whole desktop header cluster.
- Sign-in page `/login`:
  - Standalone page with no site header: back arrow top-left, logo centred.
  - Column 448 wide centred. H1 about 28px ("sign in or create an account") with a one-line sub naming the sister brands one account covers.
  - Email field, blue full-width Continue pill 48 tall, "or" divider.
  - 3 outline pills with brand marks (Google, Apple, Facebook).
  - Consent line with 3 underlined links (terms, privacy, rewards terms).
  - Row of sister-brand logos.
  - Identifier-first flow: one page for both sign-in and sign-up, email first.
- Not visited: Trips, Inbox, any signed-in state (rules).

### At 390

Same column, full width minus 24px gutters. H1 wraps to 2 lines.

### What makes it precise

There is one entry for both sign-in and sign-up, it asks for only the email first, and the account menu at 390 holds every header utility in one place.

---

## Page 8. Deals and personalisation (anywhere on the site)

Screens: `deals-1440-recent-activity-recommended.png`, `home-personalised-1440-full.jpg`, `deals-1440-hub-full.jpg`, plus the deal elements in Pages 1 to 6.

### Inventory

Deal presentation, by element:
- Promo banner (homepage): navy, serif headline with a percent off, CTA pill.
- Sale teaser cards: yellow tag chip ("coming soon" or "promotion"), serif title, date of the sale, outline CTA.
- Deal badges: green "$X off" (24px, radius 4); navy-blue member badge (out of scope); yellow "N nights free" with icon on packages.
- Strikethrough "was" price beside the current total, as a button that opens a standard-rate explainer.
- Inclusion check line: "Total with taxes and fees" in green with a check (homepage cards) or plain (results).
- Personal discount banner on hotel results ("extra $X off, just for you" plus terms link).
- Price insights: "price is better than expected / N% lower than typical" (flight review), "price is typical" (room section). Each has an icon, a one-line reason and a details link.
- Cheapest marks: green price on the cheapest flight, green price on the cheapest day in the 7-day strip.
- Scarcity: red 12px "N left at this price" on flights, hotel cards and room cards.
- Bundle interstitials in results ("save up to $X with flight + stay", "stay + car").
- Price tracking: price-alert toggle card on flight results. Price-drop protection add-on in fare sheets and on the review page.
- Freshness: "found N hours ago" on package deals.
- Footnote qualifying savings claims (asterisk line).

Personalisation (same browser session, logged out, after one flight search, one hotel search and one hotel view):
- Homepage search card prefilled with the last hotel search (destination, dates, guests). The deals hub search was also prefilled.
- New row directly under the promo banner: recent activity, 4 tiles in a row (about 96x80 thumb plus 3 lines). The viewed hotel tile uses its photo; the stays search uses a building illustration; the 2 flight searches use a plane illustration. Lines: title, sub (city or "from [city]" or guests and rooms), dates.
- New row: "Recommended stays for you" with the sub-line "based on your recently viewed property" and an outline "See all properties" pill. 4+ hotel cards with the same anatomy as deal cards, all in the viewed hotel's city and price band.
- The rental-types row was retitled to the last searched city ("stay like a local in [city]").
- A sponsored hotel-group row for that city appeared (10 cards, with a travel-dates line under the row).
- Weekend deals moved down. Page height grew from 5077 to 6224.
- Recently viewed or recommended rows were not seen on results or detail pages beyond "you may also like" and "similar properties" (Page 5).

Deals hub (`/deals`):
- Yellow sale hero with a white text card left and a 3D product illustration right.
- Full search widget (6 product tabs, prefilled).
- Navy member banner (out of scope).
- "Luxury" row of 4 cards with the deal dates in the sub-line.
- "This weekend" row of 4 cards with dates.
- 2 promo tiles (cars, activities).
- Loyalty card ad (out of scope).
- FAQ: 10 questions in 2 columns, all open.
- Numbered terms list (6 items).
- App promo and footer.

### What makes it precise

Each deal states a reason for the saving (vs standard rate, % below typical, N nights free, bundle saving) and its conditions (terms link, footnote, dates). Personalisation reuses the visitor's own dates, city and viewed property and needs no sign-in.

---

## Page 9. Help (reached from the footer)

Screens: `help-1440-full.png`, `help-1440-article-sheet.png`.

### Inventory

- Help Center (footer Help > Support): standard header.
  - H1 36px; greeting H2 28px ("Hi, [traveler]").
  - Search field (about 1000 wide, search icon, placeholder question) plus blue Search pill.
  - Centred sign-in card: lock illustration, line about personalised help, blue Sign in pill, "Not right now" link.
  - "Explore help articles": 12 topic tiles in a 3x4 grid. Each tile is about 380x60, outlined, with a line icon, bold 20px label and chevron: flights, refunds and charges, packages, stays, cars, cruises, things to do, account, privacy, security, travel alerts, loyalty and rewards.
  - App promo, footer, fixed Help chat pill.
- Article (footer Help > Refund basics): opens as a 480 side sheet over the Help Center, URL `?articleId=`. Contents: close circle, small breadcrumb label, hairline, H2 28px title, body paragraphs 14/20 with inline links, "Related topics" with 6 inline links, hairline, "Was this topic helpful?" with thumbs up and down circle buttons.

### What makes it precise

Topics map one-to-one to the product tabs plus money, account and safety. Articles open over the hub, so the visitor never loses their place, and each article ends with related links and a one-tap rating.

---

## Section anatomy (one line each)

- Header: logo, product menu, utilities right. Static. At 390: logo plus account icon that opens one combined menu.
- Hero: photo band with a white search card overlapping it by about 200px. At 390: no photo, stacked fields.
- Promo banner: navy 1200x112 strip, serif title, pill CTA. At 390: title wraps, CTA becomes a link.
- Deal row: heading, sub-line and outline pill, then a 4.3-card carousel. At 390: 1.3 cards, pill moves under the row.
- Results page: search band, 236 filter rail, 756 list, 160 ad rail. At 390: summary card, pill row, sheets.
- Hotel detail: gallery, sticky section nav with a CTA, 2-column overview, room grid of 3, then policy and review blocks. At 390: carousel gallery and a sticky bottom price bar.
- Checkout: minimal header, form left, summary and price right. At 390: summary first.
- Footer: tint ground, 4 link columns, legal line. At 390: stacked, all open.

## Signature techniques (rebuildable from scratch)

1. **The 4-part price stack.** Every product card ends with the same right-aligned stack: a small solid green discount badge (radius 4, 24 tall), the unit price (nightly or per traveller) at 16/400, a strikethrough reference price followed by the stay total at 16/500, and a 12px line saying taxes and fees are included. A 12px red scarcity line sits under it when stock is low. Rebuild it as one component, used everywhere, with the qualifier text (per night, total, per traveller, N nights) always shown.
2. **Filters that carry counts and from-prices.** Each filter option renders `label (count)` on the left and the cheapest price that option leads to in a right column under a "From" header. Pair this with a price histogram (about 30 bars from the price distribution) above a dual-handle slider with min and max fields. Generate counts and from-prices from the mock fares and rates.
3. **Fare and rate options as fixed icon rows with price deltas.** Every fare card lists the same 5 attributes in the same order, marked with 3 icons (included = green check, fee = $ in a dark circle with the fee right-aligned, not available = X). Return flights, fare upgrades, cancellation policies and extras show "+$N" against the current choice, with the new total under it. Build it as a radio group whose selection updates the total in place.
4. **Dialogs and sheets as URL state.** Fare sheet (480 or 720 from the right), detail modals (720), reviews (1200), map (full screen) and help articles (480 sheet) each add a query parameter. Back closes them and a shared link reopens them. The list stays underneath. Rebuild with the History API and a single sheet component in 2 widths.
5. **Session personalisation without sign-in.** Store recent searches and views in the browser. On the next homepage visit, prefill the search, insert a recent-activity row (4 tiles: viewed property with photo, searches with a product illustration), insert "recommended for you" with a reason line naming what it is based on, and retitle one inspiration row with the last city. This matches round 3 ruling 2 exactly.

## Not seen or not measured (plainly)

- **Geo:** the session was treated as India. Origin airport, first deals row, ads and some prices reflect that. A US first visit was not seen.
- **Flight checkout form:** not opened. I stopped at "Next: Checkout" on the review page, per instructions.
- **Flight steps at 390:** the return-selection step and the review page were not captured at 390.
- **Price calendar with a destination:** not tested, because it needs typing into the search form. The empty-destination date picker showed no prices.
- **Hover states:** only the flight card pair was captured (no visible change). Hovers on deal cards, pills, tabs and footer links were not captured.
- **Motion:** durations come from readable stylesheets only. Sheet and modal easing was not timed. Reduced-motion handling is unverified because cross-origin stylesheets could not be read.
- **Blank lazy photos in full-page shots:** packages and travel-style photos in `home-stays-1440-full.png`, car photos and app image in `flight-review-1440-full.png`, weekend and promo tiles in `deals-1440-hub-full.jpg`, and weekend deal photos in `home-personalised-1440-full.jpg`. The viewport shots `home-1440-packages-travelstyle.png` and `deals-1440-recent-activity-recommended.png` show those sections loaded.
- **Hotel map at 390:** not opened. The hotel detail at 390 has top and rooms shots only, no full-page shot.
- **Sort pill and sheet on flights at 390:** not opened separately. Sort is also inside the full filter sheet, which was captured.
- **AI "Ask" features:** not used, because they need typing.
- **Signed-in states:** Trips, Inbox and the signed-in account menu were not visited.
- **Yellow tag colour and footer ground:** not measured (by eye only).
- **Section padding:** inferred from box positions, not computed padding.
- **Saved files:** the browser tool auto-saved accessibility snapshots and console logs (they contain site text) in `c:\Users\varun\digital-heroes-automation\.playwright-mcp\`. That folder is git-ignored but should be cleared.

---

## Depth checklist (studio benchmark)

Items marked (out of scope) are Expedia features the client ruled out: loyalty, points and member prices, promo codes, more than one currency or language, the app. Do not build them; they are listed so the Critic does not count them as missing.

### Homepage
- [ ] Search card overlaps the hero photo by about 200px at 1440. The product tabs have an icon above a label, and the selected tab has a coloured label and an underline.
- [ ] Hotels form: destination, date range, guests and rooms popover, Search, add-a-flight bundle checkbox.
- [ ] Flights form: trip type (3 options), cabin (4), from and to with a swap button, dates, travellers popover with 4 passenger types and Done, add-a-hotel checkbox.
- [ ] Switching Flights and Hotels changes the page in place, with no navigation. At minimum the search form and the first deals row change. To beat Expedia, the recommendations and inspiration rows change too.
- [ ] A promo banner with headline, sub-line and CTA, right under the search.
- [ ] Deals carousel with at least 5 cards. Each card has a photo gallery, save heart, name, city, score badge, score word, review count, discount badge, unit price, total with strikethrough, and a taxes-included line.
- [ ] Every section heading follows one pattern: H2, a one-line sub, and a "see all" pill aligned right.
- [ ] Two sale teaser cards with tag chips and dates.
- [ ] A value-proposition trio (bundle saving, one place, free cancellation or similar). No loyalty tile (out of scope).
- [ ] A property-type or trip-type tile row (5 photo tiles with overlaid labels).
- [ ] A bundle or package carousel with destination tabs, about 10 cards, each with stars and score, route codes, a free-nights or saving badge, a per-traveller price, dates with night count and a freshness line.
- [ ] A travel-style row with 5 tabs, cards with a vibe chip and an average nightly price, and a sub-line explaining the average.
- [ ] A footnote qualifying every savings claim.
- [ ] A link hub with at least 10 tabs of 20 links (destinations, routes, deals).
- [ ] A fixed help launcher.
- [ ] Container 1200, card radius 16, badge radius 4, pill buttons.

### Footer
- [ ] At least 4 columns with 7 to 9 links each (at least 33 links): company, explore, policies, help.
- [ ] Column headings 14/500, links 12 to 14px.
- [ ] A legal line with a seller-of-travel style registration (mock, marked demo).
- [ ] At 390: groups stacked and readable (accordion allowed, but every link reachable).
- [ ] To beat Expedia: newsletter, payment and trust badges, social links and contact details, none of which Expedia has.

### Flight results
- [ ] A flexible-dates strip of 7 days with prices, the selected day outlined, the cheapest in the value colour, and skeleton tiles while loading.
- [ ] A sort control with 9 options (recommended, price both ways, duration both ways, departure early and late, arrival early and late).
- [ ] At least 9 filter groups: stops, airlines, class, travel and baggage (4 icon tiles), total travel time slider, departure time (3 tiles), arrival time (3 tiles), departure airports, layover airports.
- [ ] Every checkbox option shows a count and a from-price.
- [ ] Result card: carrier mark, times joined by a line with stop dots, airport codes, carrier and "operated by", duration, stops, layover city and duration, price, the qualifier "roundtrip per traveller", and a scarcity line when low.
- [ ] A "cheapest" tag on the cheapest card.
- [ ] A bundle interstitial after card 3.
- [ ] "Show more" after about 25 results.
- [ ] A price-alert toggle card.
- [ ] A note under the heading on what the price includes and when it is confirmed.
- [ ] Fare sheet: header with times, carrier, amenities and CO2 tag. At least 3 fare families in a grid, each with exact total, cabin and the same 5 attribute rows (seat, carry-on, checked bag, refund, change) using 3 icons, plus an optional add-on and a Select.
- [ ] A flight details modal with a segment timeline (city, airport, time, timezone, date) and cabin.

### Flight next step
- [ ] Return selection shows the chosen outbound with a change link and a 3-step breadcrumb.
- [ ] Return prices and fare upgrades are shown as "+$N" deltas with the new total.
- [ ] A review page with: price insight banner; both legs, each with details and change links; fare summary rows; an upgrade panel with 3 benefits and a delta; an optional add-on card; a seats and bags note; a cross-sell; a sticky price rail with traveller lines, trip total, currency note and the next-step CTA; a free-cancellation-window card.
- [ ] Stop before the passenger form.

### Hotel results
- [ ] A one-time notice that prices include taxes and fees.
- [ ] A segmented control: all stays, hotels, homes.
- [ ] A results count and a sort-order explainer link.
- [ ] Sort with 6 options (recommended, price both ways, distance from centre, rating, class).
- [ ] A personal deal banner with a terms link.
- [ ] At least 15 filter groups including: price histogram with dual slider and min and max fields; popular; amenities; property type; guest rating (radio with from-price); class; room amenities; neighbourhood; traveller experience; availability; views; meal plans; cancellation; payment type; accessibility; bedrooms; beach access. All with counts and "see more".
- [ ] Map preview in the rail, a full map view with price pins, selected-pin state, cluster pins, neighbourhood labels, POIs, filter pills over the map, and a docked card on pin click.
- [ ] Card: photo gallery, save, badge, name, neighbourhood, 3 amenity icons, refundability line, score badge, word and count, then the 4-part price stack with scarcity.
- [ ] A compare toggle and a property-name search.
- [ ] Bundle and inspiration modules interleaved in the list. "Show more".

### Hotel detail
- [ ] Back to results, share and save.
- [ ] Gallery of 1 large and 4 small photos with a photo count.
- [ ] Sticky section nav (overview, about, rooms, policies, accessibility) with a "select a room" CTA.
- [ ] Name, class stars, score and word, review link.
- [ ] Trip-aware highlights (4, with icons).
- [ ] A 6-amenity summary with "see all" (at least 12 groups).
- [ ] Area map, address, and 4 nearby places with time and mode.
- [ ] Q&A: suggested questions (mock answers, no AI required).
- [ ] Rooms: a change-search row, a price insight, bed-count filter chips and "showing N of N".
- [ ] Room cards: ribbon, photo count, room score, area, bedrooms, sleeps, beds, wifi, extras, details modal, cancellation radios with deltas, extras radios, price stack, scarcity, Reserve, and a "not charged yet" line.
- [ ] A sold-out room variant.
- [ ] Similar properties carousel and things to do nearby.
- [ ] Policies: check-in and out, instructions, closures, access, pets, children and extra beds, payment types.
- [ ] Important information: fees, optional extras, need to know.
- [ ] Accessibility section.
- [ ] Reviews: overall score, 3 to 4 category scores, review carousel, an all-reviews view with a summary of what guests liked, rating and traveller-type filters, 4 sort options, traveller type, stay length, verified mark and owner replies.

### Room to guest form
- [ ] Reserve goes to one checkout page with a reduced header.
- [ ] Summary card: photo, property, room, beds, sleeps, area, guests, dates and nights, cancellation status, special requests link.
- [ ] Price details: nights times rate with the discount explained, taxes and fees, local tax due at the property, total, pay now vs pay at property, local-currency note (mock).
- [ ] Guest form fields (first, last, email, country code, phone) as the first form.
- [ ] At 390 the summary comes first. An idle nudge sheet is optional.
- [ ] No coupon field (out of scope).

### Account entry
- [ ] Header account popover: headline, Sign in, divider, secondary links.
- [ ] Sign-in page without the site header: back, logo, one column of about 448, one combined sign-in and create heading, email first, Continue, "or" divider, 3 social options, consent line with 3 links.
- [ ] At 390 one account menu holds sign-in, inbox, support, trips and feedback (no currency or language rows, out of scope).

### Deals and personalisation
- [ ] Every discount states its reason: vs reference price, % below typical, free nights, or bundle saving.
- [ ] Every discount links its conditions: a terms link or footnote.
- [ ] A cheapest marker in flight results and the date strip.
- [ ] Scarcity lines from mock inventory.
- [ ] Price insight on the review page and the room section.
- [ ] A price alert toggle and a price-drop add-on (mock).
- [ ] After a search or view, the homepage prefills the last search and shows a recent-activity row (4 tiles) above the fold of the deals.
- [ ] "Recommended for you" with a "based on ..." reason line, and one inspiration row retitled to the last city.
- [ ] A sensible default for a first visit (deals plus popular destinations).
- [ ] A deals hub page: hero, search, 2 or more themed deal rows with dates, FAQ, numbered terms.

### Help
- [ ] A help hub with search, at least 12 topic tiles with icons, and a contact entry.
- [ ] Articles open over the hub (sheet) with breadcrumb, title, body, related topics and helpful yes/no.
- [ ] Footer help links (cancel, refund, documents, passenger rights) land on matching articles.

### Mobile (390)
- [ ] Header collapses to logo plus one account or menu icon.
- [ ] Product tabs scroll sideways with a visible partial tab.
- [ ] Search stacks into full-width fields with a 48px full-width Search.
- [ ] On results, the search collapses to a summary card with an edit button.
- [ ] Results have a sideways pill row: all-filters pill, sort pill and 4 or more quick-filter pills.
- [ ] Each quick-filter pill opens a bottom half-sheet with Clear and Done.
- [ ] The all-filters sheet is full screen with a Clear link, sort first, a sticky footer with a live result count and Done.
- [ ] Hotel cards stay horizontal (photo about 1/3 width). A floating Map pill.
- [ ] Hotel detail: full-bleed photo carousel with overlaid back, share and save; scrolling section tabs; a sticky bottom bar with total, nightly price and the select-room CTA.
- [ ] Room cards one per row, full width.
- [ ] Checkout puts the summary above the form.
- [ ] Footer groups stacked.
