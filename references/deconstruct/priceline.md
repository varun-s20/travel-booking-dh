# Deconstruction: Priceline (https://www.priceline.com)
Scope: whole site as a depth and inventory benchmark (client-named competitor, round 3). Measured: 2026-11-11, at 1440x900 and 390x844 in desktop Chromium (so 390 is a narrow window, not a phone: hover rules and mouse scripts still run, no touch emulation).

Screens are in `projects/travel-booking/references/deconstruct/priceline/`. Values are evidence for how the system is built, not for reuse. No code, images, text or font files were saved. Marketing and hotel copy is described, not transcribed; only functional UI labels (tabs, field labels, filter names, button verbs) are quoted, because they are the inventory. Hotel and chain names seen in results are not repeated except where a label is generic.

## Access log and what could not be seen

Read this before using the file.

1. 09:31 Homepage loaded at 1440. An email-capture modal opened on load; I closed it with its X (nothing accepted, nothing typed). Measured the Hotels state and the Flights state top to bottom, footer included.
2. 09:33 I opened flight results by URL (London to Lisbon, return 25 Nov to 2 Dec 2026, 1 adult, economy). Priceline answered HTTP 403 with a "press and hold to confirm you are human" bot check. Screenshot: `priceline-1440-flights-blocked.png`. For the next few minutes every Priceline URL in the session returned the same block, including the help host (`help.priceline.com` redirects to the Penny AI assistant page on www, which was blocked).
3. I did not press the check, clear cookies or change browser identity. After a pause the tab I was on returned to the homepage by itself, and the homepage loaded normally.
4. 09:38 to 10:12 Homepage at 390 and its menu; hotel search for Lisbon (typed "Lisbon" in the destination field, picked the city suggestion, pressed the search button, then set the dates in the results URL); hotel results at 1440 and 390 (filters, sort, map); one hotel detail page at 1440 and 390; the step after choosing a room (the checkout page, the first form; nothing typed).
5. 10:14 Going back to the homepage to open Sign In, a second "press and hold" bot check appeared as a modal over the homepage (`priceline-1440-captcha-modal.png`). I stopped browsing Priceline there. Behind the modal the page had already loaded a returning-visitor homepage with "recently viewed" content; I recorded that from the loaded page without touching the check.

Interpretation note: the round 3 rules say never submit a form. I treated the destination search as the way to reach the results the Art Director asked for, and submitted nothing else. No sign-in, no personal details, no booking. Flag this if the studio reads the rule more strictly.

Geolocation note: the session was priced in Indian rupees (₹) because Priceline geolocated the browser; the header currency picker offers 19 currencies. Price values below are evidence of structure only. The studio builds stay USD only.

| Page asked for | Seen? |
|---|---|
| 1. Homepage 1440, Hotels and Flights states, footer | Yes |
| 1. Homepage 390 and menu | Yes |
| 1. Homepage, returning visitor | Yes, partly (read behind the second bot check) |
| 2. Flight results | **No.** Bot check on the first request |
| 3. Flight next step | **No** |
| 4. Hotel results, Lisbon, 2 adults, 4 nights (25 to 29 Nov) | Yes, 1440 and 390, plus map view |
| 5. Hotel detail | Yes, 1440 and 390 |
| 6. Room choice to guest form | Yes, 1440 only |
| 7. Sign-in page and account menu | **No.** Second bot check. Only the header entry and the sign-in nudges inside pages were seen |
| 8. Deals and personalisation | Yes, on homepage (first and return visit), results, detail, checkout |
| 9. Help page from the footer | **No.** Help host redirects to the AI assistant; blocked. Footer "Contact Us" not opened |

## Stack facts

- Next.js (`#__next`), styled-components on older parts (`ThemeProvider__Base-sc-...`), Tailwind utility classes on newer parts with a numbered token scale (`text-primary-13`, `border-primary-6`, `text-body1`, `shadow-input-focus`, `ring-primary-8/20`), colors in `oklch()` and `lab()`.
- Search fields are Base UI comboboxes with floating labels: the label sits inside the 48px field at body size and slides up to a 12px label above the value when focused or filled.
- Homepage body is a CMS slot system: `main` holds stacked `data-testid="layout-grid"` blocks (one 1216px column, `gap: 32px`) of numbered slots `box-1` to `box-6`. Every homepage section below the hero is a slot, so promos and personal rows can be inserted or reordered without a release.
- Icons: Material Symbols Rounded icon font (ligature names leak into `innerText`). Product tab icons are separate 32x32 line SVGs.
- Maps: Google Maps (results map, detail location map, filter-rail map thumbnail).
- Bot protection: HUMAN (PerimeterX) "press and hold" check, on flight results first and later as a modal over the homepage.
- AI everywhere: the Penny assistant (launcher on every page, prompt bubble whose text and language changed between loads, once in Hindi), an AI review summary on the detail page, an AI "ask a question" box on the detail page, an AI-written urgency card at checkout. Each is labelled "powered by AI".

## Layout

- Global frame: centered container 1280 with 32px side padding, content column 1216 (x 112 to 1328) on the homepage and detail page. Results page uses the 1280 container without the inner padding: left rail x 96 to 396 (300 wide), list x 444 to 1344 (900 wide), 48px gutter.
- Header: sponsor strip 52px (homepage only, full-bleed primary blue), then a 66px white nav bar with a bottom hairline. On results and detail the sponsor strip is absent and a grey search band (80px) sits under the nav. On scroll the band becomes sticky at the top (results) or is replaced by a fixed 57px section-tab bar with price and CTA (detail).
- Homepage section tops at 1440, first visit (page y): header 0 to 118, hero 118 to 624, email band 656 to 856, seasonal collection 888 to 1581, deals heading 1613, deal cards 1677 to 2047, app plus trips row 2079 to 2291, partner promos 2323 to 2669, trust tiles 2757 to 2841, display ad 2873 to 2963, SEO destination grid 2995 to 3758, footer 3822 to 4687. Return visit inserts about 940px of personal rows after the hero (email band moves to y 1594).
- Card grids: homepage 3-up cards 388 wide (gap about 26, derived), trust tiles 4 x 292 with 16 gaps, app row 791 + 409. Results cards 900x240 stacked with 16px gaps. Detail room cards 3-up at about 378 wide.
- Radii: search card 24, app block 24, homepage cards 16, results cards about 12 with a soft shadow, detail gallery photos about 16, product tabs 12, CTAs and chips fully round, price-score chips about 6.
- 390: 16px gutters (content 358). No horizontal page scroll on homepage or results (scrollWidth 390). Homepage 6783px tall at 390 vs 4687 at 1440.

## Type (with the licence of each family)

- **Montserrat** (Google Fonts): **free, SIL Open Font License**. The only text family. Loaded weights 500 and 700; requests for 600 and 900 are synthesized.
- **Material Symbols Rounded** (Google): **free, Apache 2.0**. Icons.
- Fallback `Montserrat, "Arial Regular", sans-serif`.

Scale at 1440 (size/weight/line-height, tracking, color):
- Homepage H1: 32/700/40, deep navy oklch(0.3195 0.118 257.95). Homepage section heading: 32/700/40, brighter navy oklch(0.3753 0.1415 258.42). Collection title on photo: 32/700/40 white. Email band heading: 26/700/32 white.
- Detail H1 (hotel name): 26/700/32 black. Detail section headings ("Room Options", "What Guests Loved", "Compare similar hotels"): 26/700/32 black. "About the hotel": 24/700/33.6. Three-column intro headings: 20/700/28 rgb(0,24,51). Policy and sub headings: 16/700/20.
- Results card name: 20/700/24 black. Room card name: 16/700/20 dark navy.
- Prices: results nightly price 32/700/40 (navy, or green lab(60.6 -58.5 59.7) when discounted); detail header price about 32/700; room rate price about 26/700. Total and "includes taxes and fees" lines: 12/500/16 slate lab(42.2 -4.8 -20.4). Strike-through original: 12/700.
- Card meta (reviews count, star class, badges, refundable line): 12/500/16. Location link: 14/500/20 blue. Score chip numeral: 14/700 white on orange.
- Labels above field values: 12/500/16, tracking +0.096px, slate oklch(0.5029 0.0597 249.09). Field values: 16/500/24, tracking -0.064px, navy oklch(0.208 0.0622 252).
- Buttons: homepage primary 16/700/24 white on blue; results "Choose your room" 14/700/20 white on green; detail rate "Book" 16/500 white on green.
- Nav links 14/500/16, tracking +0.5px. Header pills 12/500/16 blue. Filter group headings 16/700/20 black; filter options 14/500/20; counts 12/500 slate in brackets, right aligned.
- Footer links 14/500/19.6 rgb(0,24,50); disclosures 12px slate, centered.
- Pattern: one family, two real weights, precision carried by a small tracking system (+0.5, +0.096, -0.064, -0.048 px) and three navies plus slate.

## Color system

Evidence only.
- Grounds: white; grey search band and light grey footer rgb(247,247,247); dark navy footer base rgb(0,24,50).
- Two action colors with distinct jobs: **blue** oklch(0.5538 0.2189 259.4) (about rgb 0,104,239) for search, links, chips and navigation; **green** oklch(0.6394 0.2175 142.5) for anything that books (Choose your room, See Availability, Book, Book & Pay). Green also marks savings: discounted prices, "Off" amounts, "You pay today", the bundle strip tint, amenity chips in room cards.
- Orange for review scores (chip fill) and "Top Booked" (orange text on pale orange pill). Red for scarcity ("few rooms left" red text on pale red, radius 3) and "Sold out".
- Grey pills for theme badges (Spa and Wellness, Luxury, Business Friendly, Apartment, Comfort, Family Friendly). Dark navy ribbon for "Great for groups".
- Text: three navies for values, H1 and section headings; card titles in pure black; slate for labels, totals and counts.

## Motion

- Product tab switch swaps the search card body and H1 in place (URL gains `?tab=flights`, no reload).
- Search card footnote rotates between short claims with a fade.
- Floating labels slide from placeholder size to label size on focus (`transition duration-200`).
- Results card photos: carousel with arrows, counter and a play button that auto-advances a slideshow (a pause control appears while playing).
- Map route shows a centered ring spinner and a "Searching..." placeholder in the destination field while loading.
- Results list renders cards only near the viewport (off-screen cards are empty boxes until scrolled to).
- Detail page: the section-tab bar becomes a fixed top bar on scroll and the active tab underline follows the scroll position.
- Durations, easings and reduced-motion handling were not measured (time went to inventory).

## Interactions

- Destination suggest: 9 rows, each with a type icon (city, airport, neighbourhood pin, hotel, landmark) over a name line and a region line; first row highlighted.
- Hotel search and hotel cards open their next page in a **new tab** (results from the homepage, detail from results).
- Sort is a custom dropdown (desktop) and a bottom sheet (390). Filters are a left rail (desktop) and a near-full-height bottom sheet (390).
- Header currency picker (19 currencies) and language picker (3 options) live in the flag and currency pills.
- 390 menu: full-screen sheet, close X top left, 6 product rows with a 40px grey circle icon each (56px rows), then 9 utility links (Home, Find My Trip, Language with flag, Help or travel support, app download, careers, terms, privacy, corporate contact) at 42px rows with hairline dividers.

## Section anatomy

### Page 1. Homepage

#### Inventory (first visit, top to bottom, 1440)

1. **Sponsor strip** (0 to 52): bold "Sponsor" label, one line from a pay-later partner, underlined link. 1 item.
2. **Header** (52 to 118): logo; 6 product links (Hotels, Cars, Flights, Packages, Cruises, Experiences); 5 pills right (AI assistant with avatar, locale flag, Help, Find My Trip, Sign In over "Join VIP" with a VIP badge). On results and detail a currency pill is added (6 pills).
3. **Hero** (118 to 624): H1 left, search card 804x354 under it (radius 24, 0.8px hairline, soft shadow); campaign photo of a spokesperson on large blue circle blobs bleeding off the right edge. Search card, Hotels state:
   - 5 product tabs (Hotels, Flights, Packages, Cars, Cruises), 48px tall, 32px line icon plus label, active tab with a blue underline bar. Widths 109, 112, 132, 95, 115.
   - Radio pair Single Hotel (default) / Multi Hotel.
   - Destination field, full width (770), 48px, search icon, floating label "Where to?".
   - Dates (half width): label "Check-in - Check-out" over a value with weekday, month, day for both ends and the night count, e.g. "(1 night)". Default today to tomorrow.
   - Travelers (half width): "2 Adults, 1 Room" default.
   - "Bundle + Save" strip (half width, pale green, savings icon) with Add a flight and Add a car checkboxes.
   - Primary button (half width, 379x48, radius 16).
   - Hairline and a centered footnote: hotel prices are shown with fees included.
   - Flights state: radio trio Round-trip (default) / One-way / Multi-destination; origin and destination half-width fields; three third-width fields: dates, Travelers ("1 Adult"), Cabin Class dropdown ("Economy", seat icon); bundle strip with Add a hotel and Add a car; button "Find Your Flight"; rotating footnote (opaque-deal savings claim; airline-trust line with an airline logo strip).
4. **Email offer band** (656 to 856, 1216 wide, deep navy, large radius): 26px offer heading, 2 lines of body, underlined Learn More; email field with mail icon on a translucent ground; white "Send me deals" button. 1 item.
5. **Seasonal collection** (888 to 1581): a 1216x521 frame (radius 16, hairline) with a wide lifestyle photo, title bottom left (32/700 white), subline and "Learn more" arrow link. A row of **10 destination tiles** rides up over the photo's bottom edge by about 50px: 184x184 square photo, place name 14/700, region 14/500. 6.5 visible at 1440; a round white chevron button scrolls the row. Data per item: name and region only.
6. **Deals this week** (1613 to 2047): heading and **3 cards** 388x370 (radius 16, no shadow): 388x218 image, kicker 12/500, title 20/700 (up to 2 lines), 2 to 3 lines of body, text link. One carries an "Ad" label top right. No prices.
7. **App and trips row** (2079 to 2291): app block 791x212 (radius 24) with title, body, phone field with country-code mask, "Send Link", QR code and caption. Right: 2 link cards 409x84 (radius 16): My Trips (find bookings, redeem flight credits) and Help Center (24/7), each icon, title, one line, arrow.
8. **Partner promos** (2323 to 2669): **3 cards** 388x346, same anatomy minus kicker: a resort discount, a co-branded card offer, a military and veterans discount.
9. **Trust tiles** (2757 to 2841): **4 tiles** 292x84 (radius 16, 16 gaps): icon in a pale circle, 14/700 title, body truncated at 2 lines with ellipsis; 2 of 4 end in an arrow. Topics: free cancellation on most hotels and cars, hotel plus car bundles, member best price, 24/7 help.
10. **Display ad** (2873 to 2963): a 728x90 airline leaderboard centered in the column.
11. **Popular destinations SEO grid** (2995 to 3758): **25 collapsed accordion cards** in 3 columns (9, 8, 8, filled column first), 379x73, radius 12, shadow `0 1px 3px rgba(23,29,46,0.12)`. Each: city name 13/600, inline links Flights, Cars, Hotels, and a caret. Hidden content per city: up to **5 flight routes** from 5 fixed origins with a "from" price, and **5 hotels** with a nightly "from" price. 329 links and 25 toggles in total.
12. **Footer** (below).
13. **Overlays**: email-capture modal on first load (640x560, two panels: offer graphic left; logo, heading, one-paragraph pitch, email field, Sign Up, "No Thanks" text link, close X right; page dimmed rgba(0,0,0,0.44)). Assistant launcher (60x60) and its dismissible prompt bubble bottom right.

#### Return visit (after viewing one Lisbon hotel and searching)

Three personal sections are inserted directly after the hero, and the search card is pre-filled with the last destination and dates:
- **"Pick up where you left off"** (H2 at y 656) with a "View all recent activity" pill link beside the heading. One wide card (1216x about 125): photo left, hotel name 20/700, area with pin, score chip, review count and star class; a grey panel with Check-in and Check-out dates; price for the stay with "4 nights, 1 room" under it; a green "Book Now" button. A small disclaimer under the card that availability and pricing can change.
- **"Or continue browsing"** (y 884): recent searches as compact cards, each with product, destination, date range and an arrow (2 items: the last two hotel searches), with a chevron to scroll.
- **"You may also like"** (y 1064): subtitle "similar hotels to" the viewed hotel; cards with name, area, score, review count, star class and a price (2 visible plus a chevron).
- Then the first-visit sections continue unchanged (email band, collection, deals, and so on).

#### Switching Flights and Hotels: what changes

Measured by diffing `main` text and hero media before and after the tab click:
- Changes: the H1, the search card body (radios, fields, defaults, bundle options, button label), the card footnote, and the URL (`?tab=flights`, no reload).
- Does not change: hero photo, email band, seasonal collection, deals, app row, partner promos, trust tiles, ad, SEO grid, footer. Same content, same order; page height differs by 3px.
- So Priceline switches **the search only**. It is not a model for product-specific lower sections. Its personal rows (return visit) are also hotel-led regardless of tab (not tested in the Flights tab).

#### Footer

- Band 1, light grey rgb(247,247,247), 706px: 4 left-aligned columns, bold titles (not heading elements):
  - Our products: 10 links (opaque hotel deals, Hotels, Cars, Flights, Packages, Cruises, Experiences, co-branded card, military discounts, veterans discounts).
  - About Priceline: 9 links (Contact Us, About, Careers, Press Center, Investor Relations, Privacy Policy, Terms and Conditions, Corporate Contact Information, Sustainability).
  - Partner with Priceline: 3 links (add your hotel, partner solutions, advertise).
  - Connect with Priceline: 5 text links (iOS app, Android app, Instagram, TikTok, YouTube). No icons.
  - 27 links total.
- Legal row: hairline, then 3 centered 12px disclosures (how opaque-deal savings percentages are calculated, how package savings are calculated, how strike-through prices are calculated), then copyright.
- Band 2, dark navy, 158px: one centered line naming the parent group, and a row of 5 sister-brand logos.
- Not present: newsletter (it is the email band in the body instead), language or currency (header), payment logos, trust seals, sitemap, accessibility link. A "Do Not Sell or Share" privacy control exists in the DOM.
- The same footer appears on results and detail pages. The checkout page has no site footer navigation (minimal header too).

#### At 390

- Sponsor strip gone. Header 56px: hamburger, logo, assistant icon pill, Sign In over Join VIP pill.
- H1 32px on 3 lines. Search card full width: 5 tabs as icon-over-label (61 to 84 wide, 68 tall), fields stacked one per row (destination, dates, travelers), bundle label on its own line with the 2 checkboxes below, full-width button, footnote. The campaign photo moves under the card.
- Email band stacks (heading, body, link, field, button). Collection photo then the tile row (2.5 tiles visible). Deal cards become a sideways row of 330-wide cards with the next card peeking at x 358. App block stacks; My Trips and Help shrink to icon cards. Partner promos become a peeking row. Trust tiles become a 2-row sideways row. The 728 ad is clipped. SEO grid is one column of 25 cards. Footer columns become 4 accordions with chevrons.
- Fixed: assistant launcher bottom right (314, 780) and its bubble.
- Menu: see Interactions. `priceline-390-menu-open.png`.

#### What makes it precise

- Every field has two text levels (12px slate label over 16px navy value), and values carry derived data: night count in the date field, rooms in the travelers field.
- Defaults are filled, never empty.
- Fees-included promise sits under the button; the footer explains every savings claim.
- One card text stack (kicker, title, body, link) at fixed sizes across all 3-up rows, so rows align with any copy length.
- The bottom of the page carries real priced data (25 cities x up to 10 priced rows), not filler.
- A return visit re-orders the page around the visitor: resume card with dates and total, recent searches, similar hotels.

### Page 2. Flight results (not seen)

Blocked by the bot check on the first request (`priceline-1440-flights-blocked.png`). No filters, sort, cards, fares, baggage, calendar, loading state or 390 sheets were seen. Use the Booking.com and Expedia files for this page type.

### Page 3. Flight next step (not seen)

Not reachable after the block.

### Page 4. Hotel results (Lisbon, 25 to 29 Nov, 1 room, 2 adults)

URL pattern: a listings route with destination ID, check-in, check-out, rooms and adults as query parameters. Title states city and dates.

#### Inventory

- **Search band** (grey, 80px, sticky on scroll): destination (floating label, value "Lisbon, Portugal"), dates as numeric "11/25/2026 - 11/29/2026 (4 nights)", "Rooms & Guests" dropdown ("1 Room, 2 Adults"), "Update Search" button (greyed until something changes).
- **Results heading**: count plus place, "1860 hotels in Lisbon, Portugal".
- **Quick-filter chips** (one scrolling row above the list): Deals For You, an "express deals" chip in the opaque-deal brand style, Fully Refundable, Free Breakfast, Airport Shuttle, Luxury, Pay Later, Price (dropdown), and the two biggest neighbourhoods (Lisbon; the airport area). At 390 an "All Filters" chip closes the row.
- **Left rail** (300 wide), in order:
  1. Map thumbnail (300x150) with a dark "View Map" pill.
  2. Sort By dropdown: **Recommended** (explained at 390 as price plus popularity), **Lowest Price**, **Guest Rating + Number of Reviews**, **Savings**. 4 options; no distance or star sort.
  3. Your Budget (per night): dual-handle slider with live range label (0 to the maximum, with a plus).
  4. Hotel Star Level: 5 checkboxes (1 to 5 stars) with counts.
  5. Neighborhoods: 13 shown plus "Show 10 more" (23), counts.
  6. Amenities: 17 shown with icons plus "Show 12 more" (29), counts. Seen: airport shuttle, free breakfast, free parking, fitness center, swimming pool, waterfront, pets allowed, restaurant, free internet, spa, accessible rooms, all inclusive, hot tub, no smoking, adults only, business center, casino.
  7. Property Types: 15 plus "Show 10 more" (25): apartments, hotels, guesthouses, hostels, holiday homes, homestays, aparthotels, villas, inns, farm stays, lodges, resorts, campsites, boats, holiday parks.
  8. Guest Rating: segmented single choice 5+, 6+, 7+, 8+, 9+.
  9. Number of Beds: 1 bed, 2 beds, 3+ beds, counts.
  10. Rate Options: Fully Refundable, Pay Later, counts.
  11. Brands: 34 plus "Show 30 more" (64), counts.
  12. Property Themes: Family Friendly, Luxury, Comfort, Business Friendly, Spa and Wellness.
  13. Deals: one option ("Standard").
  14. Property Name: text search with an example placeholder and a round blue search button.
  15. Two cross-sell promo cards (rental-car opaque deals; experiences), then a second map thumbnail.
  - Each group shows a small "No filters selected" state line. Counts sit right aligned in brackets.
- **Result card, standard** (900x240, image 240x240 left, content middle, price column right):
  - Photo carousel: arrows, "1 / 5" counter with gallery icon, play button (slideshow), heart (save) top left.
  - Badge row: theme pill (grey) and/or "Top Booked" (orange).
  - Name 20/700 (wraps to 2 lines), optional inline "Promoted" label in small grey bold.
  - Location: pin icon and neighbourhood as a blue link.
  - Amenity line: check icon and a comma list truncated with ellipsis, then an "Amenities" link.
  - Rate line: check icon, "Fully Refundable Rates", optionally ", Pay Later Available".
  - Optional signals: "Preferred" label; scarcity line on red tint ("only a few rooms left at" a price); "Great for groups" dark ribbon top right.
  - Bottom row: score chip (orange, e.g. 8.3), review count, a vertical hairline, star class ("4-Star Hotel" or "3-Star Property").
  - Price column: nightly price 32/700 (per night), "Total:" for the whole stay, "Includes taxes & fees", green "Choose your room" pill.
- **Card variants**:
  - Discount: an "X Off" amount in green, the original nightly price struck through above, the new price in green.
  - Member nudge: VIP badge, "Sign in for a VIP-only discount" in green bold and a "Get deal" link above the price (on 6 of 30 cards).
  - Opaque deal: photo labelled "Actual room may vary"; title is a description ("A 3-Star Hotel in the" area); info line saying the hotel is revealed after booking; 3 candidate brand logos plus "+N more great brands"; rounded rating ("8+") and rounded review count ("2,500+ Reviews"); brand-styled deal logo, "Off" amount, strike-through and green price. 3 of 30 cards (positions 13, 14 and 25).
- **Interstitials**: a VIP banner after card 2 ("you've earned access to member deals", "View Benefits"); at 390 a sign-in banner after card 4.
- **Paging**: 30 cards, then a full-width "Tap to see 30 more hotels" button. Back-to-top round button fixed bottom right.
- **Recommended or recently viewed rows on results**: none seen on this page.

#### Map

- Separate route (map URL mirrors the list URL). Full-bleed Google map under the search band; "Classic View" back link at left of the band.
- Chip row over the map: All Filters (solid blue), Show Neighborhoods (toggle; draws neighbourhood outlines), Fully Refundable, Pay Later, Price.
- 22 price pins (blue pills with the nightly price) plus small dots for other hotels. Selecting a pin opens a popover card (about 315 wide): photo carousel with counter and heart, name and Promoted label, refundable line, score chip, reviews, star class, nightly price, total, taxes line, close X.
- Layers control and zoom buttons. No list beside the map at 1440: the map and the list are two modes, linked by the route and the shared filters.
- Loading: ring spinner centered, "Searching..." in the destination field (`priceline-1440-hotels-map.png` shows the loaded state; the loading state was seen on screen and in the first capture of that route).

#### Layout and key measures

Container 1280 (x 80 to 1360). Rail 300, gutter 48, list 900. Search band 80px grey. Heading at y 163, chips at y 205 (pills about 36 tall). First card at y 251; cards 240 tall (taller when a badge row or VIP line wraps: 258, 328), 16px apart. Card image 240x240. Price column right aligned at x 1328.

#### At 390

- Search band becomes a blue summary bar (destination and dates on 2 lines, truncated) with a "Filters" icon button on the right.
- Chips row scrolls sideways. Count line plus a "Sort" pill on the right.
- Cards: image column about 112 wide at full card height (photo, heart, play button), content right: badges, name, Promoted, location, refundable lines, 2 amenity icons, score row, price block. No "Choose your room" button; the whole card is the link.
- Floating dark "Map" pill bottom center and a round back-to-top button bottom right.
- Filter sheet: near-full-height bottom sheet (24px from the top, rounded top corners, close X), same groups as the rail, Neighborhoods show 3 before "Show 10 more", Amenities turn into chips with counts. Sticky footer with "Reset" and a blue "Show 1860 Results" button that carries the live count.
- Sort sheet: 4 options, the first with the "Price + Popularity" explanation, check on the active one.
- Card order differs from 1440 (a different promoted hotel in slot 2).

#### What makes it precise

- Every filter option carries its live count; the 390 sheet button carries the live result count.
- Every price shows three facts: per night, total for the stay, taxes included.
- Each card states cancellation and payment terms in words, not only icons.
- Badges are typed by color: grey for theme, orange for popularity, red for scarcity, green for savings, navy ribbon for group fit.
- The opaque-deal card is honest about what is hidden (photo label, reveal line, candidate brands, rounded ratings).

### Page 5. Hotel detail

#### Inventory (1440, in order)

1. Search band with a "Back to Listings" link and the hotel name in the destination field.
2. **Gallery strip**: 3 large photos and a fourth peeking (each about 440x312, radius about 16), photo counter "1/77", fullscreen icon, "See All 77 Photos" pill, next arrow. Photos 2 and 3 carry fact captions overlaid bottom left (a "FREE" breakfast tag; a cleanliness score chip with its word).
3. **Section tab bar** (54px): Overview, Photos, Rooms, Amenities, About, Reviews, Map, active underline. On scroll it becomes a fixed 57px top bar with the nightly price and a green "See Availability" button at right.
4. **Title block**: name (26/700); star class, chain name and "Learn more"; full address and "View map"; badges (Top Booked, Family Friendly, opened year, renovated year); Share and Save pills. Right: nightly price, "price per night", green "See Availability".
5. **Three columns**:
   - Top Reasons to Book: 4 icon rows with an uppercase label and one line each (pay later available; fully refundable rates; guests love it with the score; top rated staff with the staff score).
   - Reviews card: review count heading, overall score chip and word, **3 category scores** (cleanliness, staff, location), AI review summary with "See more", "Show 106 Reviews".
   - About this property: 2 labelled photo tiles (restaurant bar, fitness), 4 amenity icon rows (free breakfast, free wifi, bar, airport shuttle), "Show All Amenities".
6. **Deal cross-sell strip**: an opaque-deal hotel in the same city (rating, reviews, stars, price).
7. **Room Options**: heading plus "How do these prices compare?" link; a best-price-guarantee panel for members with "Details"; an in-section dates and guests bar with "Update Search"; "Filter by" chips: All Rooms, Fully Refundable, Pay Later, Number of Beds (dropdown).
   - **Room cards, 3 per row** (10 room types for this hotel): photo carousel with counter; room name; "Sleeps up to N" and room size in sq ft; bed configuration in bold; amenity chips on green tint (breakfast included, free wifi, fridge, microwave); "Room Details and Photos" link.
   - Under each room, **rate rows** (1 or 2 shown, more behind "Show More"): rate name (Non Refundable, or Fully Refundable "until" a date and time), "Book now, pay later" when it applies, nightly price, "Total", "Includes taxes & fees", green "Book" pill. Extras appear as a grey pill under a rate (for example, dinner included).
   - Sold-out room card: red "Sold out" and a high-demand line.
   - It is a card grid, not a table: no columns for occupancy or choices, no room-quantity selector.
   - "Flexible dates? Compare prices and save" accordion row after the grid.
8. **Amenities**: grouped lists in 4 columns: Security, Room Amenities (with a photo count), General, Food and Drinks (with a photo count), Services and Conveniences, Languages spoken, Transportation, Health Services, Media and Technology, Fitness Activities (with a photo count), Accessibility. "Show all amenities".
9. **About the hotel**: left, hotel features paragraph and an about-the-brand paragraph; right, **Guest policies** table with zebra rows: Check-in (after a time, clock icon), Check-out (before a time), Internet, Children and Extra Beds, Parking (with daily cost), Pets, Room Rates (guest count basis); then Important info and License numbers.
10. **Have a question?**: AI assistant box ("answers come from property information and reviews"), a question field with an example placeholder and "Submit". No community questions and answers.
11. **What Guests Loved**: overall score and word, 3 category scores, AI summary, **2 review cards** (score chip, quoted title, month and year, "Pros:" text, traveller type, first name), "Show 106 Reviews".
12. **Location**: name and address with icon, a full-width Google map (1216 wide) with a "search places or add an address" box, the hotel marker, 7 nearby hotel price pins, neighbourhood outline and points of interest; a "Discover the Area" accordion.
13. **Compare similar hotels**: 3-column comparison table ("This hotel" plus 2 similar): photo, name, star class, area, score with ratings count, nightly price and total, then 6 amenity rows with check or cross (free breakfast, free parking, pets allowed, free internet, swimming pool, hot tub), "View" buttons.
14. "Back To All Hotels" button, then the footer.

Price breakdown on the detail page: per night, total and "includes taxes & fees" per rate. The itemised breakdown appears only at checkout (Page 6).

#### Layout and key measures

1216 column. H1 at y 533. Three columns at y 741 (about 389 each). Room Options heading at y 1265, room grid from y 1465 to about 4055. About the hotel at y 4598 (2 columns: 592 policies). What Guests Loved at y 5494. Compare table at y 6519 (column width about 405). Page height 8454.

#### At 390

- Search summary bar with a back arrow and the hotel name and dates.
- No gallery appeared at the top on this load (the page opened at the title block). Not verified whether that is by design or a load quirk.
- Order changes: title block, Top Reasons, reviews, About this property, About this hotel, Location, What Guests Loved, then **Room Options** (rooms move below reviews and location at 390).
- Rooms become one column; filter chips wrap to 2 rows; dates and guests become one summary row with a pencil edit icon.
- **Fixed bottom bar** (374x64, rounded, shadow): nightly price left, green "See Availability" right.

#### What makes it precise

- Facts are put on photos (free breakfast, cleanliness score), so the gallery sells.
- Every rate row shows refund deadline to the minute, pay-later status, per night, total and taxes.
- Room cards state occupancy, size and bed configuration before price.
- The policy table answers check-in, check-out, children, parking cost, pets and rate basis in one glance.
- The comparison table ends the page with a decision aid instead of a plain "similar hotels" row.

### Page 6. Room choice to guest form (1440)

Pressing "Book" on the first rate opened a checkout route in the same tab. It is the first form; nothing was typed.

#### Inventory

- Minimal header: logo, flag pill, Sign In over Join VIP. No product nav. Grey trust strip with 3 icon claims (secure transactions, 24-hour service, trusted payments).
- 3-step stepper: Choose Room (done, check), Guest & Payment Details (active, 2), Booking Confirmation (3).
- Left column (about 664 wide), cards with hairlines and radius:
  1. AI-written urgency card about the destination, collapsible, labelled as powered by AI.
  2. Stay summary: photo, hotel name, area, score chip, word and star class; grey panel with Check-in date, Check-out date, Nights, Room; room name, bed type, inclusions with checks.
  3. Notice: guest age, photo ID and card at check-in.
  4. Guest Name: first name, last name, checkbox "guest name and name on card are the same" (checked by default).
  5. Payment: 5 card logos; name on card, card number, MM/YY, CVV (with a card-back icon).
  6. Billing: street address, country (prefilled from geolocation, green check), city, state or province (optional), postal code, email, country code (prefilled), mobile number.
  7. Trip protection notice (not offered for this billing country).
  8. Important Information: non-refundable rate note with info icon, check-in and check-out times, agreement checkbox linking booking conditions, terms and privacy.
  9. Full-width green "Book & Pay" button.
- Right column (about 282 wide) price summary: price per night, rooms, number of nights, taxes and fees, **"You pay today"** in green, **local tax due at property**, **Total Cost** (decimals set small and raised); then notes: coupons not accepted for this booking, currency and taxes link, pay-at-property reminder.
- Guest checkout: no sign-in wall. Guest, payment and billing are all on one page.

#### At 390

Not captured (the second bot check came first).

#### What makes it precise

- The price summary splits pay-now from pay-at-property and shows both totals.
- The stepper tells the visitor there is exactly one step left.
- Prefilled country and phone code with green confirmation checks.

### Page 7. Account entry (not seen)

The sign-in page and account menu were not reached (second bot check). Seen only: the two-line Sign In and Join VIP header pill (with a dropdown control, `aria-controls` on a VIP menu) and sign-in nudges inside pages (VIP-only discount on cards, results banners, checkout header).

### Page 8. Deals and personalisation (everywhere seen)

- Homepage: sponsor strip; email offer band; first-load email modal with a percentage offer; "Deals this week" cards with an "Ad" label; partner promo cards; display ad; savings claims in the search footnote; bundle strip in green.
- Homepage, return visit: "Pick up where you left off" resume card (dates, total, Book Now, view all activity), "Or continue browsing" recent-search cards, "You may also like" similar hotels; search card prefilled.
- Results: "Deals For You" chip; opaque-deal chip and cards; "X Off" with strike-through; VIP-only discount nudges with "Get deal"; VIP banner interstitial; "Promoted" label; "Top Booked" and "Preferred" badges; scarcity lines; "Great for groups" ribbon; cross-sell cards in the filter rail; "Savings" sort option.
- Detail: opaque-deal cross-sell strip; best-price guarantee panel; "Top Reasons to Book"; similar-hotels comparison table.
- Checkout: AI urgency card; coupon note.
- No "recommended for you" row was shown to a first visit; personal rows appeared only after a view and a search.

### Page 9. Help page (not seen)

The help host redirects to the AI assistant page (`/penny` with a prefilled prompt about an existing booking), which was blocked at the time. The footer "Contact Us" target was not opened. Seen help entry points: Help header pill, Find My Trip pill, homepage Help Center card (24/7), trust tile, 390 menu "Help/Travel Support".

## Signature techniques (rebuildable from scratch)

1. **Two-level field labels in a tabbed search card.** 804-wide card, radius 24, 0.8px hairline, soft shadow, 16px padding, 12px gaps, 48px fields with a leading icon, a 12/500 slate label over a 16/500 navy value. Tabs are 48px icon-plus-label buttons with an underline bar. Switching swaps the field set in place and writes `?tab=` to the URL. Values carry derived data (night count, rooms).
2. **Price column with three facts and a typed badge system.** Right-aligned column: nightly price large, "Total" for the stay and "includes taxes and fees" small in slate, a green action pill. Badges by color: grey theme, orange popularity, red scarcity, green savings, navy ribbon for fit. Discounts add an "Off" amount and a struck original above a green price.
3. **Counted filters with a live-count sheet.** Every filter option has a right-aligned count in brackets; long groups show a fixed number then "Show N more"; the mobile sheet footer button reads "Show N Results" and updates as filters change.
4. **Room cards with stacked rate rows.** Each room card states occupancy, size and beds, then lists rate rows (refund deadline to the minute, pay-later line, per night, total, taxes, Book). Extras appear as a pill under the rate. A comparison table of 3 hotels with check and cross rows closes the page.
5. **Return-visit homepage.** Insert resume, recent-search and similar-item rows right after the hero, prefill the search, and keep the rest of the page unchanged. For the studio this can run on browser storage with mock data, as round 3 ruling 2 asks.

## Not measured

- Flight results, flight next step, sign-in page, account menu, help page: blocked (see Access log).
- 390 checkout, 390 return-visit homepage, the hotel gallery at 390, the full reviews list behind "Show 106 Reviews", "Room Details and Photos" modal, the "Show More" rates, the expanded SEO accordion, the results loading state at 1440 (the page was already loaded at 1.2s), hover pairs, motion timings, reduced motion.
- The `priceline-1440-hotel-suggest.png` capture shows the page shifted left by the field's focus scroll with the scrollbar visible; it is evidence of the suggest list only, not of layout.

## Depth checklist (benchmark for the studio)

Legend: **[P]** observed on Priceline in this session. **[AD]** not observed on Priceline (blocked); taken from the Art Director's own list for that page type, to be confirmed against the Booking.com and Expedia files. Never cite [AD] items as Priceline facts.

### Homepage
- [P] Search card with at least 5 product tabs, each a 48px icon-plus-label button with an active underline.
- [P] Hotel search shows: destination, date range with night count in the value, travelers with rooms in the value, a bundle option, one primary button, and a fees-included line under it.
- [P] Flight search shows: Round-trip, One-way, Multi-destination; origin and destination; dates; travelers; cabin class; bundle option.
- [P] Defaults filled (dates, travelers, cabin); no empty fields on first load.
- [P] Destination suggest with typed rows (city, airport, neighbourhood, hotel, landmark), icon plus name plus region, at least 8 rows.
- [P] A seasonal or themed collection with at least 10 destination tiles (name plus region), scrolling sideways.
- [P] A deals row of 3 cards with kicker, title, body and link; one sponsored card labelled as such.
- [P] Trip management and help entry cards (find my trip, help 24/7).
- [P] A trust row of 4 tiles (free cancellation, bundles, best price, 24/7 help).
- [P] A popular-destinations grid of at least 24 cities, each with product links and expandable priced rows (routes and hotels).
- [P] Return visit: resume card (item, dates, total, book), recent searches, similar items, search prefilled.
- [Studio target, beyond Priceline] Product switch changes the lower sections too (Varun's ruling; Priceline changes the search only).

### Flight results
- [AD] Every filter group with options and counts (stops, airlines, times, duration, price, airports, baggage).
- [AD] At least 3 sort options.
- [AD] Result card: carrier, times, duration, stops, airports, price per person and total, taxes stated.
- [AD] Fare families with what each includes; baggage allowance per fare.
- [AD] Price calendar or flexible-date tool.
- [AD] A designed loading state.
- [AD] 390 filter and sort sheets with a live result count.

### Flight next step
- [AD] Fare selection or trip details summary with price breakdown, up to the first form.

### Hotel results
- [P] Count line with place ("N hotels in City").
- [P] Quick-filter chips above the list (at least 7, including deals, refundable, breakfast, pay later, price).
- [P] At least 12 filter groups: budget slider, star level, neighbourhoods, amenities (with icons), property types, guest rating (5+ to 9+), number of beds, rate options, brands, themes, deals, property-name search.
- [P] Counts on every filter option; "Show N more" on long groups.
- [P] 4 sort options including rating-with-volume and savings; the default explained.
- [P] Card: photo carousel with counter and save, theme and popularity badges, name, location link, amenity line, cancellation and payment terms in words, score chip plus review count plus star class, nightly price, total for the stay, taxes line, action button.
- [P] Card variants: discount (Off amount, strike-through), member nudge, scarcity line, group-fit ribbon, sponsored label, opaque deal.
- [P] An interstitial banner in the list; paging by 30 with a "show 30 more" button; back-to-top.
- [P] Map mode with price pins, a popover card, neighbourhood outlines, filter chips and a way back to the list.
- [P] 390: summary bar with Filters, chips row, Sort pill, full-card links, floating Map pill, filter sheet with Reset and live-count button, sort sheet.

### Hotel detail
- [P] Gallery with total photo count, "see all", and facts captioned on photos.
- [P] Section tab bar (at least 7 tabs) that becomes a fixed bar with price and action on scroll.
- [P] Title block: name, star class, chain, address, map link, at least 4 badges, share, save, price per night, action.
- [P] Top reasons to book (4 rows with data).
- [P] Review summary: overall score and word, at least 3 category scores, summary text, link to all reviews.
- [P] Room options: in-section date and guest edit, room filters (refundable, pay later, beds), room cards with occupancy, size, beds, inclusions, details link, and per-rate rows (refund deadline, pay later, per night, total, taxes, book).
- [P] Sold-out state and a flexible-dates prompt.
- [P] Amenities in at least 10 named groups.
- [P] Policies table: check-in, check-out, internet, children, parking with cost, pets, rate basis; important info.
- [P] Question box (Priceline answers with AI; the studio can use mock answers).
- [P] At least 2 review cards with score, title, date, pros, traveller type, name.
- [P] Location map with nearby priced pins and a place search.
- [P] Comparison table of 3 hotels with price and 6 amenity rows.
- [P] 390: fixed bottom bar with price and action.

### Room to guest form
- [P] 3-step stepper with the current step marked.
- [P] Stay summary card (dates, nights, rooms, room, bed, inclusions).
- [P] Price summary: per night, rooms, nights, taxes and fees, pay today, due at property, total.
- [P] Guest name, payment and billing sections; trust strip; terms checkbox; one full-width action.
- [P] Guest checkout without sign-in. (The studio stops before payment fields; mock only.)

### Account entry
- [P] Header sign-in entry with a membership line under it.
- [AD] Sign-in page anatomy and account menu contents (not seen).

### Footer
- [P] 4 titled columns, 27 links (products 10, company 9, partners 3, connect 5).
- [P] Legal row with 3 savings disclosures and copyright.
- [P] A parent-group band with sister-brand logos.
- [P] 390: columns become accordions.

### Deals and personalisation
- [P] Deal labels typed by color and placed on cards, in chips, in sort, in banners.
- [P] Sponsored items labelled ("Ad", "Promoted").
- [P] No personal rows on a first visit; resume, recent searches and similar items after one view and one search.
- [P] Cross-sell of a deal on the detail page.

### Mobile (390)
- [P] No horizontal scroll; 16px gutters.
- [P] Full-screen menu with product rows (icon in circle) and utility links.
- [P] 3-up homepage rows become sideways rows with the next card peeking.
- [P] Results: filter and sort as bottom sheets; floating Map pill.
- [P] Detail: fixed price and action bar; rooms moved lower in the order.
- [AD] Flight results sheets at 390.

## Screens

`priceline-1440-home-popup.png`, `priceline-1440-home-hotels-full.png`, `priceline-1440-home-flights-first.png`, `priceline-1440-home-flights-full.png`, `priceline-1440-flights-blocked.png`, `priceline-390-home-first.png`, `priceline-390-home-full.png`, `priceline-390-menu-open.png`, `priceline-1440-hotel-suggest.png`, `priceline-1440-hotel-after-pick.png`, `priceline-1440-hotels-loading.png` (already loaded when captured), `priceline-1440-hotels-first.png`, `priceline-1440-hotels-discount-card.png`, `priceline-1440-hotels-express-deal-card.png`, `priceline-1440-hotels-sort-open.png`, `priceline-1440-hotels-map-loading.png` (not reviewed), `priceline-1440-hotels-map.png`, `priceline-390-hotels-first.png`, `priceline-390-hotels-scrolled.png`, `priceline-390-hotels-filters-sheet.png`, `priceline-390-hotels-sort-sheet.png`, `priceline-1440-hotel-detail-first.png`, `priceline-1440-hotel-detail-full.png` (the location map paints blank in the full-page shot; see `priceline-1440-hotel-reviews.png` for it in view), `priceline-1440-hotel-rooms.png`, `priceline-1440-hotel-reviews.png`, `priceline-1440-hotel-policies.png`, `priceline-390-hotel-detail-first.png`, `priceline-390-hotel-rooms.png`, `priceline-1440-checkout-first.png`, `priceline-1440-checkout-full.png`, `priceline-1440-captcha-modal.png`.
