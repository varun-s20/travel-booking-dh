# Deconstruction: Booking.com (https://www.booking.com)
Scope: competitor depth inventory for travel-booking round 3 (homepage Stays and Flights, flight results, flight next step, hotel results, hotel detail, room to guest form, account entry, deals and personalisation, help page, footer). Measured: 2026-11-11, at 1440x900 (desktop Chromium) and 390x844 (two ways, see below).

Conditions that shape what was seen:
- Geo: the site placed the session in India (flag in the header, "travellers from India" rows, nearest airport prefilled as an Indian airport). Destination rows reflect that. Currency was forced to USD by URL; it held on Stays and flight results but fell back to INR on the Flights index, the hotel detail page and the guest form.
- 390 was seen two ways. "390" = a 390px desktop Chromium window (no touch, desktop user agent). "390m" = a fresh phone-emulated context (iPhone user agent, touch, 2x scale, so those PNGs are 780px wide for 390 CSS px). Booking serves a **different mobile site by user agent**: the desktop hotel results page at a 390 window does not reflow (scrollWidth 1004, sideways scroll). Only the 390m captures show what a phone sees. Flights at 390 were only seen in the desktop window.
- Popups: a loyalty sign-in modal (624x344) on the first homepage load, dismissed with its close button. On 390m an app-download sheet and a Google one-tap sign-in prompt, both closed. No cookie banner appeared. A silent JS challenge ran once on first load (URL gained a challenge token) and passed by itself; no captcha was shown.
- Values are evidence of how the system is built, not for reuse. No code, images, copy or font files were saved. Hotel, airline and campaign names below are only to identify what was measured; none go into the builds. Booking features that round 3 rules out of scope (loyalty programme, member prices, app prompts, mobile-only prices, currency and language switchers) are marked **[out of scope]** so the studio does not copy them.

Screens are in `projects/travel-booking/references/deconstruct/booking-com/`:
home-1440-first-signin-popup, home-1440-stays-full, home-1440-card-default / -card-hover, home-1440-footer, home-1440-flights-full, flights-1440-loading, flights-1440-results-first / -results-full, flights-1440-price-popover, flights-1440-fare-options-open, flights-1440-fare-families-tap, flights-1440-sort-open, flights-1440-summary-open, flights-1440-dates-open, flights-1440-details-panel, flights-1440-unavailable-state, flights-390-results-first, flights-390-filters-sheet (inline filter card), flights-390-sort-sheet, hotels-1440-loading, hotels-1440-results-first, hotels-1440-sort-open, hotels-1440-map-open, hotels-1440-map-card-hover, hotel-detail-1440-first / -full, hotel-detail-1440-rooms-selected, hotel-guest-form-1440-first / -full, signin-1440, help-1440-full, home-390-first / -full, home-390-recent-and-still-interested, home-390-menu-open, hotels-390-results-first and hotels-390-sort-sheet (desktop page overflowing at 390, kept as evidence), hotels-390m-results-first, hotels-390m-filter-sheet, hotels-390m-sort-sheet, hotel-detail-390m-first.

## Layout

- One centred content column, 1108px wide at 1440 (x 166 to 1274). Search bar, section headings, carousels and footer directory all align to it. Footer columns sit inside it with 16px inner padding (x 182 to 1258).
- Header: full-bleed navy band, 124px tall: row 1 (logo left; currency code, country flag for language, help icon, "List your property", Register and Sign in buttons right), row 2 the product pills. Not sticky on the homepage or results.
- Homepage hero: full-bleed photo 1440x520 (y 124 to 644). The search bar overlaps the bottom edge of the photo (top at y 518), so it reads as sitting on the seam between hero and page.
- Sections stack with about 32px between a section's last row and the next H2 (for example Why-us ends y 902, Offers H2 at y 933). No coloured bands between sections on Stays; the only band is the grey footer (and one grey value-prop band on the Flights index).
- Carousels show 4 property cards of 265px with 16px gaps (4 x 265 + 3 x 16 = 1108) or 6 destination tiles of 171px. Prev / next are 36px white circles with a soft shadow that overhang the column edge by about 16px.
- Hotel results: left column 263px (x 173 to 436) for map preview and filters, right column 815px (x 452 to 1267) for results, 16px gutter.
- Flight results: left column 320px (x 182 to 502), right column 732px (x 526 to 1258), 24px gutter.
- Hotel detail: one 1110px column (x 170 to 1280); gallery block plus a 266px right rail; rooms table spans the full width.
- Page heights at 1440: Stays home 5892, Flights home 3360, flight results 3762 (15 results per page), hotel results 7338 on load growing to 36666 after infinite scroll (120 cards), hotel detail 11138, guest form 2615, help 1853.

## Type (with the licence of each family)

- **Body and UI**: the system stack `BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, ...` (free; system fonts, nothing downloaded). Rendered as Segoe UI on this Windows machine. Base 14/400/20px, text rgb(26,26,26).
- **Headings**: `"Avenir Next", BlinkMacSystemFont, ...`. Avenir Next is **commercial** (Linotype / Monotype) and is not served as a web font here, so it only shows on Apple devices that have it installed; everywhere else headings fall back to the system font. Evidence that the brand accepts per-platform heading rendering.
- **Blue Sans**: Booking's own proprietary typeface (**commercial, not licensable**). Declared on every page; actually used for flight card prices (20/700/28), hotel result card titles (20/700/28) and the "Filter by" heading (20/700/28).
- Scale at 1440 (size/weight/line height): hero H1 48/700/62 white; section H2 24/700/32; section subline 16/400/24 muted rgb(89,89,89); card titles 16/700/24; offer card titles 20/700/28; meta lines 12/500/18 muted; review label 12/400/18; prices on home cards 16/700/24; hotel result price 20/500/28; flight times 16/700/24; airport code and date 12/400/18 muted; product pills 14/500/20; buttons 14/500 (primary hero CTA 16/600/24, search button 20/500/28); footer headings 14/700/20, footer links 14/400/20. No letter-spacing anywhere, no uppercase transforms.

## Color system

Values are evidence of the structure, not a palette to reuse.
- Grounds: white page; header navy rgb(0,59,149); footer and search band grey rgb(245,245,245).
- Search frame: saturated yellow rgb(255,183,0) as a 4px frame (padding) around white fields, radius 8 outside, 4 inside. The yellow is used for nothing else except star icons. It makes the search the loudest object on every page.
- Action blue rgb(0,108,228): search button, primary buttons, links, hotel titles, active tab outline and text. Outline buttons are white with 1px blue border and blue text.
- Score badge: navy rgb(0,59,149) square, white number, three rounded corners and one square corner (bottom left on cards). 24x24 on cards, larger on detail.
- Green rgb(0,130,52): deal badges (white text on green), "Direct" stop pill on flights, "Cheapest" and "Fastest" labels, "Free cancellation" and "No prepayment" lines with check icons, "Included" baggage, discount lines in price breakdowns.
- Red rgb(212,17,30): struck-through original price, scarcity line ("only N left at this price").
- Muted text rgb(89,89,89). Card border 0.8px rgb(231,231,231). Card shadow `0 2px 8px rgba(26,26,26,.16)` (also on the search frame and carousel arrows).
- Radii: 4 (buttons, fields, pills inside cards), 8 (cards, images, search frame, popovers), 9999 (product pills, sort pill, tab chips), 50% (wishlist and arrow buttons).

## Motion

- Very little. Card links transition `transform 0.12s cubic-bezier(0.2,0,0.4,0.8)`; the hover on homepage property cards showed no visible change in the capture (home-1440-card-default vs -card-hover), only the pointer cursor.
- Map: hovering a result card enlarges that hotel's price pin and gives it a white outline (hotels-1440-map-card-hover).
- Loading is the main "motion": illustrated loading overlay on flights, skeleton bars in cards and modals, "Finding fares" text state.
- Not measured: reduced-motion handling, carousel scroll easing, modal open timings.

## Interactions

- Product switch (header pills): every pill is a link to a separate product page. Stays is the homepage; Flights loads `/flights/index` (a new page, new hero, new search form, completely different sections, shorter footer). Nothing is swapped in place.
- Search fields open popovers (two-month calendar with a range band; occupancy steppers). Search frame stays visible and editable on every results and detail page.
- Carousels scroll horizontally with arrow buttons; offers carousel also has dot pagination.
- Tabs inside sections (trip planner themes, "Popular with travellers" link directory, "Popular flights near you" International/Domestic, help FAQ product tabs) swap panel content in place without navigation.
- Modals and popovers: flight price breakdown popover, flight details modal, AI search summary modal, hotel sort popover, full-screen hotel map overlay (adds `#map_opened` to the URL), 390m full-screen filter and sort sheets.
- Wishlist hearts on every property card (36px white circle).

## Section anatomy

### 1. Homepage (Stays), 1440

**Inventory, top to bottom (first visit, signed out):**
1. Header: logo, currency, language flag, help, list-your-property link, Register, Sign in; product pills x6 (Stays, Flights, Flight + Hotel, Car rental, Activities, Airport transfers), active pill has a 0.8px white outline.
2. Campaign hero: photo, kicker line (sale name), H1 sale headline (2 lines), subline with end date, one CTA button. This is a campaign slot; the hero changes with promotions.
3. Search bar on the hero seam: destination (icon + floating label), dates (check-in / check-out), occupancy (adults, children, rooms), Search. Under it two checkboxes: travelling for work; add flights to my search.
4. Why us: 4 cards, each an illustration (64px), bold title, one line (pay at property / free cancellation, review count, property count, 24/7 service).
5. Offers: carousel of 4 offer cards, 2 visible, dot pagination. Data per card: kicker (deal name or "Explore deals in X"), title, one-line conditions with dates, CTA. First card is white with a square image; the rest are full-bleed photos with white text.
6. Trending destinations: 5 photo tiles in a 2-over-3 grid. Data: city name + country flag over the photo. Subline says "for travellers from [your country]".
7. Homes guests love: carousel, 10 cards, 4 visible, "Discover homes" link top right. Data: photo 265x212, wishlist heart, name, area + country + city line, score badge, score word, review count, "Starting from" + price.
8. Explore [your country]: carousel, 10 tiles, 6 visible. Data: photo 171x137, city, property count.
9. Unique properties: carousel, 15 cards. Data: photo, property type + star icons, name, location, score badge, score word, review count. No price.
10. Deals for this weekend: carousel, 12 cards; subline gives the coming Fri to Sun dates. Data: photo, heart, loyalty logo **[out of scope]**, name, location, score, word, reviews, green deal badge (named deal), "2 nights", red struck original price, bold current price.
11. Property types unique to [city]: carousel of photo tiles with a label overlay (4 on first visit, 9 after a search).
12. Trip planner: 7 theme chips (tabs) and a carousel of 10 destination cards per theme. Data: photo, city, distance from the visitor ("415 km away").
13. Beach trip: carousel of 7 region cards. Data: photo, region, "A, B, C and more" line.
14. Loyalty sign-in banner **[out of scope]**.
15. Popular with travellers from [country]: 6 tabs (Domestic cities 60 links with 25 visible plus "Show more", International cities 20, Regions 20, Countries 20, Places to stay 20, Things to do 25) = 165 SEO links in 5 columns.
16. Footer (see Footer below).

**Layout and key measures:** hero 1440x520; H1 600px wide at x 170; search frame 1108x58 (fields 50px tall: destination 378, dates 297, occupancy 297, button 116); why-us cards 265 wide, title 16/700, line 14/400; offer cards about 544x154; property card 265x382, image 265x212, body padding 8px; tiles 171x137.

**At 390 (desktop window, second visit):** page 6927px tall, no horizontal scroll. Header becomes logo + account icon + Menu; product pills scroll sideways (374px content in 358). Search stacks vertically. Sections keep their order as single-row horizontal carousels with the next card peeking. After my searches two rows were inserted right after the hero (see Deals and personalisation).

**What makes it precise:** every card carries 5 to 7 data points in a fixed order (image, name, location, score badge + word + count, deal badge, price with "from" or nights); every row says why it is shown ("for travellers from India", "for 13 to 15 November"); counts are real numbers, not rounded.

### 1b. Homepage switched to Flights (and what changes)

Clicking Flights is a **full navigation to a separate page** (`/flights/index`). The header stays, the active pill moves, and everything else is different:
1. Hero: navy band, no photo, 300px tall: H1 + subline.
2. Search card (white with yellow frame): trip type radios (Round trip, One way, Multi-city), cabin class select (Economy, Premium economy, Business, First class), direct flights only checkbox; fields Leaving from (prefilled with the nearest airport), swap button, Going to, Travel dates (prefilled with a one-week range about a month out), Travellers; button.
3. Explore Anywhere: wide map banner with an "Open Map" pill.
4. Explore by country: carousel of country photo tiles with flags, plus an "Anywhere" tile (navy, icon, "Explore all destinations").
5. Popular flights near you: tabs International / Domestic; 5 route cards per tab. Data: photo 257x193, "Origin to Destination", dates + "Round trip". **No price on these cards.**
6. Account banner (sign in to manage trips).
7. Value props on a grey band: 3 items (icon, title, line), plus a footnote about flexible tickets.
8. Top flights from [country]: 5 tabs (Popular routes, Cities, Countries, Regions, Airports); 9 rows "Origin to Destination" with a 40px thumbnail.
9. FAQ: 6 questions in 2 accordion columns.
10. Footer: same 5 columns (29 links; one legal link fewer) without the directory strip above.

**Takeaway for the studio:** Booking changes the whole page, not the search. Our builds must change the content below the search in place (Varun's ruling), and Booking's Flights page gives the depth target for the flights state: map entry, country tiles, routes with dates, value props, route directory with tabs, FAQ.

### Footer (Stays homepage)

- Grey band rgb(245,245,245), 553px tall, full bleed.
- Row 1, directory strip: 21 inline links in 2 lines (Countries, Regions, Cities, Districts, Airports, Hotels, Places of interest, Holiday homes, Apartments, Resorts, Villas, Hostels, B&Bs, Guest houses, Unique places to stay, All destinations, All flight destinations, All car hire locations, All holiday destinations, Guides, monthly stays).
- Row 2, five columns with 14/700 headings at x 182, 404, 655, 882, 1062: Support 3 links (manage trips, contact customer service, safety resource centre); Discover 9 (loyalty, seasonal and holiday deals, travel articles, business travel, review awards, car hire, flight finder, restaurant reservations, travel agents); Terms and settings 6 (privacy, terms, accessibility statement, grievance officer, modern slavery statement, human rights statement); Partners 4 (extranet login, partner help, list your property, become an affiliate); About 8 (about, how we work, sustainability, press, careers, investor relations, corporate contact, content guidelines and reporting). 30 links.
- Row 3: language (flag) and currency buttons, 48px.
- Row 4, trust and legal: one line naming the parent company, a copyright line, then a row of 5 sister-brand logos (16px tall).
- Totals: 52 links. On Flights, help and results pages the same columns appear; Flights drops the directory strip.

### 2. Flight results (London to Lisbon, 25 Nov to 2 Dec 2026, 1 adult, economy, round trip)

**Inventory:**
- Loading state: a centred modal (864x720) with an illustration and a rotating tip line ("look out for flexible tickets") plus a "Change search" link, over a grey skeleton of the filter column and 3 skeleton cards. Lasts about 2 to 6 s.
- Editable search band at the top (grey), same controls as the Flights index; dates show weekday + date.
- Left column:
  - Search summary card: title, one line, "View summary" outline button. Opens an "Automated search summary" modal (624x284) with 3 short paragraphs comparing direct vs one-stop options and prices.
  - Filters header with "Showing 1597 results".
  - Stops: 3 radios (Any, Direct only, 1 stop max), each with "From $price" under it and a result count on the right.
  - Airlines: 20 checkboxes, 5 shown then "Show all"; each has a count and a hover "only this" button.
  - Flight times: tabs Departing / Returning; "Departs [city]" 4 buckets (00:00 to 05:59, 06:00 to 11:59, 12:00 to 17:59, 18:00 to 23:59) and "Arrives to [airport]" 4 buckets, each with a count; zero-count buckets are disabled grey.
  - Duration: "Maximum travel time" slider with the current value (29 hours).
- Right column: "We found 1597 flight options", sort pill.
  - Sort (popover 360x194): Best (with a two-line explanation: price, time, stops, baggage), Cheapest, Fastest.
  - Result card (732 wide, 199 to 230 tall, white, 8px radius, two zones split by a vertical rule):
    - Labels row: "Best" (navy text on pale blue), "Cheapest", "Cheapest direct", "Fastest" (green text on pale green), "Flexible ticket upgrade available" (green chip).
    - Two legs, each: carrier logo 32px, departure time 16/700, airport code + date 12 muted, a line with end dots and a green "Direct" pill (or stops) with duration under it, arrival time + code + date. Carrier name under both legs.
    - Right zone: fare name (Light, Basic, Discount, or none), baggage icon with a green check (aria: personal item included), price 20/700 rounded to whole dollars, "?" price breakdown button, "Fare options" toggle, "View details" outline button 144x36.
  - Price breakdown popover (360x254): "Price details"; Flight: Adult (1) with amount and an expand chevron; Discounts: a platform-funded discount line in green as a negative; Total (large, to the cent); "Includes taxes and charges". So the card price is the total for all travellers, taxes included, rounded; the cents and the discount only show in the popover.
  - Fare options (expands inside the card): first "Finding fares" while loading, then either "No other fares" or a row of fare tiles (seen: 2 tiles, Light at the base price and Inclusive at about 2.2x). Tile: name, a row of 2 to 5 feature icons (personal item, cabin bag, checked bag, change, seat), price, "View details". Prev / next arrows when there are more tiles.
  - Pagination: 15 results per page, numbered pager 1 to 8, ellipsis, 106, 107.
  - Feedback widget under the list: "results match what I'm looking for", 1 to 5 scale.
- Details modal (828 wide, opens on "View details"): title "Your flight to [city]", "Share this flight" link; per leg: heading, "Direct · 3h", a vertical timeline (circle, date · time, airport code · full airport name, circle, arrival), carrier logo, flight number · cabin, flight time; "Included baggage" block: personal item (size note, "Included" in green), cabin bag (dimensions in inches, max weight in lbs, "Included"), extra rows still loading as skeletons; footer: total price to the cent, "?" popover, Continue.
- Price calendar or flexible dates: **none seen.** The date field opens a plain two-month calendar (range band, today highlighted, past days grey) with no prices per day and no plus/minus days option.

**Layout and key measures:** filter column 320, results 732, gutter 24; filter headings 16/500/24; radio rows 48px with a 2-line label; airline rows 28px; card padding about 16px; label chips 12/400 with 4px radius.

**At 390 (desktop window):** search fields stack (each about 52px tall) with the swap button beside the first two; Search full width. The search summary card and filters become **inline collapsible cards above the results** (Filters with a chevron), not a bottom sheet. Sort stays a popover (230x212) anchored to the pill. Result card stacks: legs on top, then fare name, bag icon, price and "?", then Fare options + View details side by side. A real phone user agent was not tested on flights.

**What makes it precise:** every filter option shows a live count and, for stops, the "from" price; the card shows both legs with codes, dates and durations; the price is explained in a popover down to discounts; fares and bags are visible before choosing.

### 3. Flight next step (after choosing a flight)

**Not reached.** Three different flights (two low-cost carriers and one flag carrier) each opened the details modal, then 2 to 5 s later replaced it with a "This flight's not available / the last seats at this price were taken / Search again" modal (flights-1440-unavailable-state). The fare-selection or trip-details page after Continue could not be seen. I did not retry further or try to get round it. Evidence kept: the details modal with baggage (flights-1440-details-panel) and the sold-out state itself, which is worth rebuilding as an error state.

### 4. Hotel results (Lisbon, 25 to 29 Nov 2026, 2 adults, 1 room)

**Inventory:**
- Loading: the page arrives server-rendered; no overlay seen.
- Search frame (yellow) under the header, prefilled; breadcrumb (Home, Portugal, Lisbon, Search results).
- Left column: static map preview 263x150 with a "Show on map" button, then "Filter by" with 23 groups:
  1. Your budget (per night): price histogram with a two-handle slider, range label (US$10 to US$300+).
  2. Popular filters (8): 4 stars, city centre, free cancellation, hotels, Superb 9+, less than 1 km, apartments, swimming pool. Each with a count; some with a helper line ("Based on guest reviews", "Distance from address").
  3. Property type (15): hotels, apartments, villas, holiday homes, B&Bs, aparthotels, chalets, guest houses, hostels, lodges, homestays, boats, capsule hotels, campsites, entire homes.
  4. Bedrooms and bathrooms: 2 steppers.
  5. Review score (4): 9+, 8+, 7+, 6+.
  6. Meals (4): breakfast included, all-inclusive, breakfast and dinner, self catering.
  7. Facilities (5 shown, "Show all 14").
  8. Room facilities (5 shown, "Show all 25").
  9. Property rating (5): 1 to 5 stars, with a helper line.
  10. Neighbourhood (10 shown, "Show all 25"), including "Guests' favourite area".
  11. Distance from centre (3): under 1, 3, 5 km.
  12. Bed preference (2): twin, double.
  13. Reservation policy (2): free cancellation, book without credit card.
  14. Travel group (3): pets allowed, adults only, LGBTQ+ friendly.
  15. Fun things to do (5).
  16. Brands (10 shown, "Show all 20").
  17. Landmarks (3).
  18. Highly rated features (1), "based on guest reviews".
  19. Online payment (1).
  20. Certifications (1): sustainability.
  21. Property accessibility (7).
  22. Room accessibility (11).
  23. (A 32-input hidden group, not labelled.)
  Every option has a live count on the right.
- Right column: H1 "Lisbon: 3,423 properties found", List / Grid toggle (segmented pill), sort pill "Sort by: Our top picks".
- Sort (popover 230x448), 10 options: top picks, homes and apartments first, price low to high, price high to low, best reviewed and lowest price, property rating high to low, low to high, property rating and price, distance from city centre, top reviewed.
- Result card (815x274, white, 0.8px border, radius 8, 16px padding):
  - Photo 240x240 radius 8, wishlist heart 36px top right of the photo.
  - Title 20/700 in action blue (opens in a new tab), star icons, preferred-partner badge.
  - Optional "Ad" or "Featured" label, each with a one-line disclosure of why it is placed there.
  - Area link (underlined), "Show on map" link, distance from centre, "Metro access".
  - Optional sustainability badge.
  - Review block top right: score word, review count, navy score badge.
  - Green deal badge (named deal or "Limited-time Deal").
  - Recommended unit block with a left rule: room name (bold), beds line, "Breakfast included", green check "Free cancellation", green check "No prepayment needed, pay at the property", red scarcity "We have 5 left at this price".
  - Price block right-aligned: "4 nights, 2 adults" (12 muted), red struck original + current price (20/500), info icon, "+US$36 taxes and charges" (12 muted), "See availability" blue button 142x36 with a chevron.
  - So the card price is the **total for the stay, before taxes**, with taxes added as a separate line. No per-night price on the card (per night only in the budget filter).
- Rows between cards: "Things to do in Lisbon" row (after about 20 cards; attraction cards with rating out of 5, review count, "Tickets from" price, free-cancellation line, "See all") and a promotional banner card (entire homes, with CTA).
- List growth: infinite scroll loads to 120 cards, then a "Load more results" button.
- Recommended or recently viewed rows on results: none seen.
- Map (full-screen overlay): three panes, filters 262px (adds an "Availability: only show available properties" toggle), compact list 365px (photo, name, stars, score, adds a "Location" sub-score, deal badge, price block, cancellation lines), map with navy price chips per hotel, dot pins for others, points of interest icons; collapse arrow; "Close map" top right; zoom buttons. Hovering a list card enlarges and outlines its price chip; the hovered card gets a pale blue ground.

**Layout and key measures:** filter column 263, results 815; group headings 14/700 with 16px padding; option rows 30px; card 274 tall; title 20/700/28; price 20/500/28; button 142x36 radius 4.

**At 390m (phone site):** header logo + account icon (with red notification dot) + menu; product pills scroll; search becomes a yellow panel with a destination field, two date boxes side by side, three selects (adults, children, rooms) and a full-width Search button. A 3-button bar: Sort, Filter, Map. Then a horizontally scrolling row of quick filter chips with counts. Card becomes horizontal: photo about 128px wide on the left, title, stars, "Featured" label, score + word + count, location + distance, sustainability, green "Mobile-only price" badge **[out of scope]**, "Price for 4 nights" with struck and current price. Filter opens a **full-screen sheet** (title, Clear at top right, the same groups, sticky "Show 3,423 results" button). Sort opens a **full-screen sheet** with 8 options. At a 390 desktop window, by contrast, the desktop page overflows sideways (evidence only).

**What makes it precise:** 23 filter groups with live counts, a histogram on the budget filter, a "why this card is here" disclosure on ads, the stay total with taxes as a separate line, cancellation and payment terms on the card itself, a named room, and a map where list and pins are linked by hover.

### 5. Hotel detail (a 3-star chain hotel in Lisbon)

**Inventory, in order:**
1. Header + search frame + breadcrumb (6 levels: Home, Hotels, country, city, district, property).
2. Section tab bar: Overview, Info & prices, Facilities, Policies, Important & legal info, Guest reviews (count). Underline on the active tab.
3. Title block: stars, partner badge, LGBTQ+ friendly badge, sustainability badge; H1; full address + "Great location, show map" + transport line; right side heart, share, Reserve button, "We Price Match" link.
4. Gallery: one large photo (about 547x360), two stacked (274x175), a row of 5 thumbs, the last with "+63 photos" over it.
5. Right rail (266 wide): review score card (word, count, badge), a guest-quote carousel (quote, name, country flag), one category score (Staff), static map with "Show on map".
6. Description (long text, a "couples rated location 8.6" line) with a right panel "Property highlights": "Perfect for a 4-night stay" (location score), breakfast info, parking.
7. Most popular facilities: 10 icon + label items.
8. Availability: "We Price Match" link, "Prices converted to [currency]" with info icon, inline change bar (dates, occupancy, "Change search"), a Rooms / Suites filter, then the rooms table:
   - Columns: Room type (391px), Price for 4 nights (173), Your choices (263), Select rooms (61), plus a summary column on the right (about 222) that holds the reserve box.
   - Room type cell: room name (link), "Sleeps 2 adults" icon line, bed choice radios with bed icons, size m², feature chips with icons (room, size, air conditioning, ensuite, TV, WiFi), scarcity "We have 3 left".
   - Price cell: price for the stay, "+ taxes and charges".
   - Choices cell: breakfast included (with "?" tip), free cancellation before a date, no prepayment.
   - Select cell: a select of 0 to 6 rooms, each option showing the running total.
   - 8 room types, 22 rate rows (about 3 rates per room, differing in cancellation date and breakfast).
   - Summary column after selecting 1 room: "1 room for", total, taxes line, "I'll reserve" button, "You'll be taken to the next step", "You won't be charged yet", "Your package" list.
9. Sustainability: certification count, certificate name.
10. Guest reviews: overall score, word, count, "Read all reviews"; 7 category bars with scores (staff, facilities, cleanliness, comfort, value for money, location, free WiFi); photos from guests; "See what guests loved the most" quote carousel (name, country, quote, read more).
11. Travellers are asking: 10 question chips (breakfast, restaurant, parking, shuttle, check-in times, nearby, private bathroom, pool, spa, balcony), "Ask a question" box with "instant answer" promise, "See other questions (20)".
12. Hotel surroundings, 7 lists with distances: what's nearby (10), restaurants and cafes (3), top attractions (9), natural beauty (1), beaches (2), public transport (5, each typed as metro, train or bus), closest airports (2); a note on how distances are estimated.
13. Restaurants on site: name, meals served, ambiance.
14. Facilities: grouped lists (most popular, food and drink, internet, parking, services, reception services, safety and security, general, wellness, languages spoken).
15. "How are we doing?" feedback box.
16. Policies: special requests note; check-in from, check-out until; ID and card requirement; cancellation and prepayment; children and beds (child policy, cot and extra bed table by age band with prices); age restriction; pets; groups; accepted payment methods.
17. The fine print (need-to-know text).
18. FAQs: 6 accordion questions in 2 columns.
19. Other properties by the same brand: 3 cards (type, stars, name, score, distance, "Starting from" price).
20. "The best of [city]" links, directory, footer.
Every major section has a blue "See availability" button at its right edge that jumps back to the rooms table.

**Layout and key measures:** column 1110 (x 170 to 1280); tab bar 6 equal tabs about 185 wide; gallery block about 830 wide plus 266 rail; rooms table 888 wide plus summary column; table header row navy-blue fill rgb(76,118,178) region with white 14/700 headings, the price column header darker with a down-pointer.

**At 390m (phone site):** back arrow + logo + account + menu; a compact yellow search summary (destination, dates, guests); badges, heart and share; H1 large; address + "Great location" + "Show on map"; score badge + word + count; full-width swipe gallery with arrows and a "1/45" counter; a horizontal row of highlight cards (breakfast, WiFi). Rooms are **stacked cards per room type** (H2 per room) instead of a table. Section order on the phone: check-in/out, facilities, reviews, rooms (8), sustainability, food and drink, wellness, property questions and answers, surroundings, description, policies, important info, contacting the property, partner programme, best of city, similar properties. With the dates I passed, the phone page showed a yellow "Change your dates to find available rooms" panel, so the phone rooms list and its prices were not seen (likely the phone page did not take the dates; not verified).

**What makes it precise:** a rooms table where every rate shows its cancellation date, breakfast and payment terms, a select that shows the running total per count, a summary column that confirms "you won't be charged yet", 7 review categories, 7 typed nearby lists with distances, a cot and extra bed table by age, and a "See availability" shortcut in every section.

### 6. Choosing a room, up to the guest-details form

- After choosing 1 room and "I'll reserve", a new secure page "Your details" (stopped here, nothing typed).
- Progress bar: 3 steps (Your selection with a check, Your details, Finish booking).
- Left column: property card (photo, stars, name, address, location score, review score, 3 facility icons); Your booking details (check-in date and from-time, check-out date and until-time, "4 nights, 1 room for 2 adults", "1 x Standard Room", "Change your selection"); Your price summary (price, taxes line, the same price in the property's currency); Price information (included VAT line, excluded city tax line, conversion and card-fee notes, hide details); How much will it cost to cancel (free before date, fee after date).
- Main column: sign-in nudge; "Enter your details" with an info bar ("required info"); first name, last name, email (with "confirmation goes here"), country (select), phone with country code select (with "to verify your booking" helper), paperless confirmation checkbox **[app-related, out of scope]**, "Who are you booking for?" (main guest / someone else), "Travelling for work?" (yes/no); Good to know (free cancellation date, no payment now); the room card (breakfast, room score, free cancellation, guests, "spotless rooms" score, no smoking, bed choice); Add to your stay (flight, car hire, airport taxi checkboxes); Special requests textarea; Your arrival time (room ready from 15:00, 24-hour desk, arrival hour select with 25 options).

### 7. Account entry and account menu (not signed in)

- Sign in is a separate, minimal page on an account subdomain: logo, language, help icon; H1 "Sign in or create an account", one line; email field and "Continue with email"; "or use one of these options" with 3 single sign-on buttons (Google, Apple, Facebook); account recovery link; terms and privacy line; copyright. One page serves both sign in and register.
- Account menu: at 1440 signed out there is no menu, only Register and Sign in buttons. At 390 the header has an account icon (to sign in) and a Menu button that opens a full-screen "More" sheet: currency, language, loyalty programme **[out of scope]**, list your property, Help and support (contact customer service, grievance officer), Inspiration (seasonal and holiday deals, travel articles), Settings and legal (about, careers, affiliate, press, privacy, terms, legal, content guidelines). The signed-in account menu was not seen (sign-in forbidden).

### 8. Deals and personalisation, everywhere

- Homepage campaign hero (sale headline, end date, CTA).
- Offers carousel (4 cards: one seasonal deal, two country deals, one upcoming sale teaser) with dates in the conditions line.
- Deals for this weekend: 12 cards, each with a named green deal badge, nights count, red struck price and current price.
- Results: green named deal badges on cards, red struck original price, scarcity lines in red, "Ad" and "Featured" labels with disclosures, a promotional banner card between results; on the phone a "Mobile-only price" badge **[out of scope]**.
- Flights: "Best / Cheapest / Cheapest direct / Fastest" labels on cards, "Flexible ticket upgrade available" chip, and a platform-funded discount line inside the price breakdown.
- Detail page: "We Price Match" link, "Perfect for a 4-night stay" (stay-length based), "couples rated the location 8.6" (group based), scarcity per room.
- Recommendations and recently viewed (seen on the homepage after one hotel search, one flight search and one hotel view):
  - "Your recent searches" inserted right after the hero: horizontal cards mixing stays and flights, each with a photo, a small product icon badge (bed or plane) in the corner, destination, dates, people count.
  - "Still interested?" right after it: the recently viewed property as a full property card (type, name, location, score, word, reviews, heart).
  - Destination rows re-targeted to the last search: "Explore Portugal" (10 cities with property counts) replaced the home-country row, and "Property types unique to Lisbon" (9 tiles) replaced the home city's.
  - First-visit defaults are geo based: trending destinations and link directory "for travellers from [country]", trip-planner distances from the visitor.
- Sign-in prompts used as deal hooks: first-load modal, homepage banner, guest-form nudge **[loyalty, out of scope]**.

### 9. Help page (footer, Contact Customer Service)

- Help Centre header strip, a safety notice banner (never asks for payment details by phone or chat), H1, one line (24/7).
- Two contact cards: send a message; call us (24/7, local or international number). "Sign in" and "Continue without an account" buttons.
- FAQ: 7 product tabs (stays, flights, car rentals, attractions, airport taxis, insurance, other); for Stays a list of 10 topics (cancellations, payment, booking details, communications, room types, pricing, credit cards, property policies, extra facilities, security and awareness). Directory strip and footer under it.

## Signature techniques (rebuildable from scratch)

1. **The framed search.** A saturated accent used only as a 4px frame around white fields (outer radius 8, inner 4), sitting on the seam between the hero and the page, kept on every results and detail page with the current query filled in. Build: a flex row with the accent as background and 4px padding and gap, so the accent shows as the frame and the dividers between fields.
2. **Counts and reasons everywhere.** Every filter option has a live count; every stops option has a "from" price; every row says who it is for or which dates it covers; every ad says why it is placed. Build: drive filter counts from the mock dataset after the other active filters are applied; generate row sublines from the visitor context (dates, origin, last search).
3. **The terms on the card.** Results cards carry the room name, beds, cancellation date, payment terms and scarcity before the click, with the stay total and taxes on separate lines; flight cards carry both legs, stops and baggage, with a "?" popover that breaks the price into traveller lines, discounts and total. Build: a fixed two-zone card (facts left, price right) and a price popover component shared by flights and hotels.
4. **The rooms table with a running summary.** Rows per rate (not per room), a quantity select showing running totals, and a summary column that updates and reassures ("you won't be charged yet"). Build: a CSS grid table with a sticky summary cell spanning all rows.
5. **Memory on the homepage.** After any search or view, the homepage inserts "recent searches" (mixed products with a product badge) and "still interested" rows directly under the hero, and re-targets destination rows to the last searched place. Build: store searches and views in localStorage; render the two rows only when data exists; first visit falls back to default destinations.

## Depth checklist (benchmark, per page type)

### Homepage
- [ ] At least 10 content sections below the search, each with a heading and a subline that says why it is shown (dates, origin or last search).
- [ ] At least 4 carousels with arrow buttons; property carousels hold 10 to 15 cards, 4 visible at 1440.
- [ ] Property card shows: photo, save heart, name, location line, score badge, score word, review count, and either "from" price or nights + struck price + current price.
- [ ] A "deals for these dates" row with named deal badges and struck prices (demo data).
- [ ] An offers carousel of 3 or more promos with conditions and a CTA each.
- [ ] A themed explorer (6 or more theme tabs) with distance or travel time per destination.
- [ ] A tabbed link directory (5 or more tabs, 20 or more links each) above the footer.
- [ ] Switching Flights / Hotels changes every section below the search in place (studio rule; Booking does it with a separate page): flights state has a map entry, country tiles, route cards with dates, value props, a tabbed route directory and an FAQ of 6 or more questions.

### Flight results
- [ ] Loading state with an illustration or skeleton list and a "change search" escape.
- [ ] Filters: stops (with count and from-price per option), airlines (count, show all, "only this"), departure and arrival time buckets per leg with counts and disabled empty buckets, max duration slider, results count at the top.
- [ ] Sort: best (with an explanation), cheapest, fastest.
- [ ] Card: label chips (best, cheapest, fastest, cheapest direct), both legs with times, codes, dates, stops pill, duration, carrier; fare name; baggage icon; total price; "?" breakdown popover (per traveller, discounts, total, taxes included); fare options toggle; details button.
- [ ] Fare options: 2 or more fare tiles with feature icons and prices, with a loading and an "no other fares" state.
- [ ] A plain-language search summary (direct vs one stop, cheapest).
- [ ] Pagination or load more, and a results feedback widget.
- [ ] A sold-out / price-changed state with a "search again" action.
- [ ] Optional to beat Booking: a price calendar or flexible dates (Booking has none).

### Flight next step
- [ ] Details modal: per-leg timeline (times, airport codes and names, flight number, cabin, flight time), included baggage with sizes and weights and "Included" status, total with breakdown, Continue.
- [ ] Booking's step after Continue was not seen; the studio defines its own fare-selection step with fare tiles and a running total, stopping before traveller details.

### Hotel results
- [ ] 15 or more filter groups with live counts, a budget histogram slider, "show all" on long groups, helper lines on scored filters.
- [ ] 8 or more sort options.
- [ ] List / grid toggle and a map entry (static map preview with a button).
- [ ] Card: photo, heart, name, stars, area link, show on map, distance, transport, score block, deal badge, room name, beds, breakfast, free cancellation, payment terms, scarcity, nights + guests line, struck and current total, taxes line, CTA.
- [ ] Ads or featured cards labelled with a reason (or omit paid placement entirely).
- [ ] At least 2 interstitial rows in the list (things to do, a promo banner).
- [ ] Full-screen map with filters, compact list and price pins; hovering a card highlights its pin.
- [ ] Infinite scroll or a load-more button with a visible total.

### Hotel detail
- [ ] Section tab bar (6 tabs) and a "See availability" shortcut in each section.
- [ ] Gallery: 1 large + 2 stacked + 5 thumbs with a "+N photos" count; phone: swipe with a counter.
- [ ] Right rail: score card, guest quote carousel, a category score, static map.
- [ ] Highlights panel tied to the search ("perfect for an N-night stay"), popular facilities (10 icons).
- [ ] Rooms table: room column (sleeps, bed choice, size, feature chips), price for N nights + taxes, choices (breakfast, cancellation date, payment), quantity select with running totals, summary column with reserve and reassurance; 2 or more rates per room.
- [ ] Reviews: overall, 7 categories with bars, guest photos, quote carousel.
- [ ] Q&A: 10 question chips, ask box, more-questions link.
- [ ] Surroundings: 5 or more typed lists with distances (nearby, food, attractions, transport, airports).
- [ ] Policies: check-in and out times, cancellation, children and beds table by age, age limit, pets, groups, payment methods; fine print; FAQ (6).
- [ ] Similar or same-brand properties (3 cards with from-prices).

### Room to guest form
- [ ] 3-step progress bar.
- [ ] Summary column: property card, dates with times, stay length and party, selected room with change link, price summary, tax breakdown (included vs excluded), cancellation cost timeline.
- [ ] Form: first and last name, email with helper, country, phone with code, who is it for, purpose of trip; good-to-know box; room recap with bed choice; add-ons; special requests; arrival time select. (Studio stops here too; demo data only.)

### Account entry
- [ ] One minimal page for sign in and register: email field, continue, 2 or 3 single sign-on buttons, recovery link, terms line.
- [ ] Signed-out header: Register and Sign in at 1440; account icon + menu sheet at 390 with help, deals, settings and legal groups.

### Footer
- [ ] Directory strip of 15 or more destination and type links.
- [ ] 5 columns (support, discover, terms and settings, partners, about) with 3 to 9 links each, 30 or more in all.
- [ ] Settings row (currency and language are out of scope for us; use the slot for a region or help line instead).
- [ ] Legal row: company line, copyright; a trust row of logos or badges.

### Deals and personalisation
- [ ] Named deal badges and struck prices from the mock fares and rates, on home rows, results cards and detail rates.
- [ ] "Recent searches" row (mixed flights and stays, product badge on each card) and "Still interested" row inserted under the hero after any search or view; destination rows re-targeted to the last search; a sensible first-visit default.
- [ ] Labels on flight cards (best, cheapest, fastest) computed from the data.
- [ ] Scarcity and stay-length messages driven by the mock data, never invented as facts about real places.

### Mobile (390, phone)
- [ ] Search becomes a stacked panel with the main fields and a full-width button.
- [ ] Sort, Filter, Map as a 3-button bar under the search; quick filter chips with counts in a scrolling row.
- [ ] Filter and sort as full-screen sheets with Clear and a sticky "Show N results" button.
- [ ] Horizontal results card (photo left) keeping score, location, deal and total price.
- [ ] Detail: swipe gallery with counter, highlight cards row, rooms as stacked cards, same section depth as desktop.
- [ ] Menu as a full-screen sheet; product switch as a scrolling pill row.
- [ ] No horizontal scroll at 390 (Booking's desktop page fails this at a narrow window; it relies on a separate phone site).

## Not measured

- Flight fare-selection or trip-details page after Continue: blocked by repeated "flight not available" responses on three flights. Not retried further.
- Flights on a real phone user agent (only the 390 desktop window was seen), so the phone filter and sort sheets for flights are not verified.
- Phone hotel detail rooms list and prices: the phone page showed "Change your dates to find available rooms" for the dates passed; not resolved.
- Hotel grid view, budget slider dragging, "Show all" expansions, and the review list page were not opened.
- The signed-in account menu and any signed-in personalisation (sign-in not allowed).
- Hover states beyond the homepage card and the map card; focus styles; reduced-motion handling; carousel easing.
- The 1440 hotel results full-page screenshot failed (page grew to 36666px under infinite scroll); hotels-1440-results-first and the measured values cover it. Full-page captures of the hotel detail and guest form were checked only at thumbnail scale.
- Currency: USD did not persist on the Flights index, hotel detail and guest form (INR shown); prices quoted from those pages are in INR in the screenshots.
- Fonts in rendered form on Apple devices (Avenir Next headings) were not seen; this machine renders the system fallback.
