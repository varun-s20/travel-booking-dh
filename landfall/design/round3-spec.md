# Landfall: round 3 redesign spec (see the place first)
Art Director, 2026-11-11, written 15:11 to 15:42. Builds start about 15:45: Part A (Developer A, homepage and footer) and Part B (Developer B, inner pages) run in parallel. Both work in landfall/site/ only.

## Chief Officer checkpoint: APPROVED WITH NOTES
2026-11-11, about 15:20 to 15:22, chief-officer agent, foreground. All six notes applied below. Rulings: conflict 2 (five footer columns plus a popular-links row under V10's contact row) approved, without padding; conflict 3 (a save line, no strike-throughs unless the catalogue holds a real earlier price for the same offer) approved; conflicts 1, 4, 5 and 6 agreed.
Notes, applied:
1. Part B timing: Varun's ruling 4 holds. Developer B does groundwork only (mock data rules, URL params and filter state, `type` on /hotels, the `lf.recent` view writers, catalogue wiring) until Varun signs off the homepage. Only Varun can change this. **For Varun:** the brief for this round says two Developers build in parallel from 15:45; the Chief Officer reads ruling 4 as holding back Part B's visual work. Say if you want Part B's visual rebuild to start at 15:45 anyway.
2. Footer: row 2 fixed at two groups of 12, each 2 columns of 6; the duplicate links cut; FAQ ids named; the property type link opens its tab.
3. One meaning for savings everywhere: the usual price for the same route or hotel over the last 30 days, and only where the catalogue gives a usual price.
4. "Journey duration" renamed "Flight duration" (banned word).
5. First visit rhythm: the default list leaves out the banner cities and the first 4 deal cards; Recommended sits on --c-shade, deals on white.
6. FAQ client facts marked (card brands; local tax or deposit only if the catalogue says so).
Not checked by the Chief Officer: the browser at either port or 390 (it judged from the 1440 capture), the catalogue's numbers and slugs, the Booking.com and Expedia files (not written), references/benchmark.md.

---

## 0. Ground rules for both Developers
- Binding: logs/round3-note.txt, logs/redesign-note.txt, benchmark-rubric.md (target 9.2, side by side with Booking.com, Expedia and Priceline). This spec adds to landfall/design/design-spec.md and wins where they differ.
- Landfall stays Landfall: Newsreader on H1, H2 and city names only (400, upright, never italic); Albert Sans everywhere else, tabular figures on every price, time and reference. Teal acts (every button fill, picked and checked states, through --c-action), navy speaks (type, links, focus, small navy surfaces, score badges). No navy wall: dark bands use --c-band. Radii 8, 12, 16, 24, band joins, pills. Landfall's own 20px icon sprite (components/chrome/Sprite.tsx): draw any new glyph in the same language (1.25 line, square caps, mitre joins). Motion from tokens.css only.
- The concept carries into every new part: **the landfall line** (a fine horizontal line that ends in the landing dot) marks routes, durations, stay lengths and steps. **The place comes first**: every city surface leads with a water photo of that city; hotel surfaces lead with the hotel's water photo where one exists.
- Never Overwing's: no rail, no pill tab bar, no cabin window, no Hipcamp shell, no Calibre or Geist, nothing from design/, prototype/, site/ or ports 3001 and 3002. Never look at them.
- Competitors give technique and depth only. Never their look, wording, icons, logos or brand names on the page.
- Scope (Varun's ruling 2): deals and "Recommended for you" are in. Out: promo codes, loyalty, points, member prices, any currency but USD, any language but English, the app (no app block, no QR, no "get the app" link).
- Copy: final copy below follows taste/anti-slop.md. No em dashes, no full stops in headings, no eyebrows, no dot-separated strings, none of the banned words. Where the copy deck (landfall/content/copy.md) or the catalogue says it better, theirs wins, as long as it keeps these rules.
- Demo honesty: every fare, rate, deal, score and review is mock data. The existing demo notice in the footer stays and now also names deals, scores and reviews.
- Mock data source: content/mock-catalogue.md (the Copywriter, in progress; done when it ends with "Catalogue complete."). It is shared client material, not design, so Landfall may read it. Each section below names the fields it needs as **Data:**. If a field is missing when you get to it, use the nearest catalogue field and tell the Copywriter through review-log.md; never invent hotel or airline facts in the components.
- Photos: Unsplash License only, each checked on its photo page and added to public/images/credits.md, the water rule (the city where it meets the water). Never a photo from site/public/images. Hotel and room photos: the existing Landfall stock stand-ins, reused across the 96 hotels by city (catalogue says which); never an empty box or a label.
- Breakpoints: 1440 (container 1248, gutters 96), 1024 (gutters 32), 390 (gutters 16). Check 641 to 1024 as well as the three named widths.
- Every interactive thing gets hover and a visible focus ring (navy 2px on light, shallows on dark and photos, with the ink halo on photos).

### New tokens (add to landfall/design/tokens.css and the app's copy of it, in the :root block; Harbour inherits them)
```
--c-save: var(--c-success);       /* savings lines only ("$74 below this route's usual fare"). 6.5:1 on white */
--c-save-tint: var(--c-success-tint);
--c-score: var(--c-navy);         /* review score badge fill, white numerals (14.9:1). Harbour: sea */
--t-score: 1.6rem;                /* score numerals 600 tabular */
--t-rank: 1.3rem;                 /* small meta lines on dense rows (13/500) */
--w-rail-card: 29.6rem;           /* deal and recommendation cards: 4 visible in 1248 with 24 gaps */
--h-datestrip: 6.4rem;            /* the date and price strip on results */
--h-modeline: 2px;                /* the landfall line under the active mode */
--d-mode-out: 160ms;              /* outgoing content on a mode switch */
--d-mode-in: 360ms;               /* incoming content */
--d-mode-stagger: 40ms;           /* per card, at most 6 cards staggered */
--rise-mode: 12px;
```
Easings: --ease-in for the outgoing fade, --ease-reveal for the incoming rise, --ease-settle for the mode line slide. Reduced motion: every mode change is instant, nothing staggers.

### Shared components to build first (Part A owns them; Part B reuses them, so Developer A writes them in components/ui/ by 16:15 and says so in review-log.md)
1. **ScoreBadge**: 32x32 square, radius 8, --c-score fill, white 16/600 tabular numerals ("8.7"); beside it 15/500 ink word ("Excellent") and 13/500 muted count ("412 reviews"). Words and the accessible name exactly as the catalogue's "Review score words" (9.0 Exceptional, 8.5 Excellent, 8.0 Very good, 7.0 Good, 6.0 Fair; "Rated 9.1 out of 10, exceptional, from 1,286 reviews"). Every surface showing a score carries the catalogue's demo-reviews line. Compact variant: the badge alone with the word in its accessible name.
2. **LandfallLine** (exists on result rows; make it one component): props start label, end label, middle label (duration or nights), stops (dots on the line, each with its airport code on hover and in the accessible name). Line 1.25px --c-field, landing dot 8px --c-action ringed --c-ground. Sizes: 120px in cards, fluid in result rows and steps.
3. **SaveLine**: 14/500 --c-save, a small down-arrow glyph, text "$74 below this route's usual fare" or "$96 below its usual rate". "Usual" means one thing everywhere: the usual price for the same route or hotel over the last 30 days. Show it only where the catalogue gives a usual price; never compute one in the components. Never a struck-through price unless the catalogue gives a real earlier price for that same offer.
4. **RailCard** (deal and recommendation cards), width --w-rail-card, radius 16, hairline, --sh-card. Photo 4:3 flush on top, radius 16 16 0 0, zoom 1.06 over --d-zoom on hover. Body padding 16 20 20.
5. **Rail**: horizontal scroll-snap row, 4 cards visible at 1440 (gap 24), 3 at 1024, 1.15 at 390 (gap 12, the next card peeks). Round 44px arrow buttons (surface, hairline, --sh-arrow) at the right of the section heading row at 1024 and up, disabled at the ends; at 390 no arrows, swipe. Keyboard: the rail is a list; Tab moves card to card.

---

## PART A: HOMEPAGE AND FOOTER (Developer A)

### A0. The mode switch (Flights / Hotels changes the homepage in place)
Booking.com's technique (a product switch that rebuilds the lower homepage), carried through Landfall's own motion.

- **URL keeps the mode.** Flights is the default: `/`. Hotels: `/?mode=hotels`. Any other value reads as Flights. The page renders on the server from searchParams, so a shared `/?mode=hotels` link paints Hotels on the first frame with no flash. A tab click calls history.pushState (not replace) with the new URL, so Back returns to the other mode; a popstate listener re-reads the URL and switches without a reload and without moving the scroll. The header's Flights and Hotels links point to `/` and `/?mode=hotels` and show the current one with the landfall line (on the home page they switch in place; elsewhere they navigate).
- **Recent searches follow the mode**: a search from the Hotels card saves a hotel search; the recommendation rows read the mode.
- **What swaps** (same section order in both modes, so the page keeps its shape):

| # | Section | Flights mode | Hotels mode |
|---|---|---|---|
| 1 | Hero | headline, subline, flight card, caption "London to New York, return from $684, Fly here" | headline, subline, hotel card, caption "Hotels in New York from $212 a night, Stay here" |
| 2 | Destinations | "Return fares from London", fares | "Hotels where the city meets the water", per-night rates; links run hotel searches |
| 3 | Deal banners | fare drops | rate drops |
| 4 | Deal cards | "Fares that dropped this week", 8 flight deals | "Stays below their usual rate", 8 hotel deals |
| 5 | Recommended for you | flight rows | hotel rows |
| 6 | Trending | trending routes | trending stays |
| 7 | Browse | by region, by city | by region, by city, by property type |
| 8 | How booking works and trust | flight steps | stay steps; trust row shared |
| 9 | Popular searches grid | routes per city | hotels per city |
| 10 | FAQs | flight questions | hotel questions |
| 11 | Pre-footer band | "Start a search" opens the flight card | opens the hotel card |
| 12 | Footer | shared, unchanged | shared, unchanged |

The hero photo set does not change (the place is the same whichever way you arrive); the caption's line does.
- **How it animates** (Landfall motion, not a slide or a tab carousel):
  1. The landfall line under the active tab slides to the new tab: transform over --d-nav, --ease-settle (the small overshoot).
  2. The hero headline re-runs the word reveal (600ms, 45ms stagger, from an 8px blur); the subline and the card body cross-fade (--d-mode-out out, --d-mode-in in, 8px rise). The card keeps its outer size at 1440 where it can (Hotels: Destination, Dates, Guests and rooms, Search; Flights: From, swap, To, Dates, Travelers, Search), so it does not jump.
  3. Every swapped section that is in the viewport: old content fades out over --d-mode-out (--ease-in, 6px up), new content rises --rise-mode and fades in over --d-mode-in (--ease-reveal), cards staggered by --d-mode-stagger, at most 6. Sections out of view swap with no animation. Each section's height eases between the old and new heights over --d-panel so nothing below jumps.
  4. Focus stays on the tab. A polite live region says "Showing hotels" or "Showing flights".
  5. Reduced motion: everything swaps at once.
- Data: both modes are rendered from the catalogue at build time; the switch is client-side state with no request. Keep the inactive mode out of the accessibility tree (hidden), not just invisible.

### A1. Hero (keep, fixes only)
Keep everything in design-spec.md section 2b Home 1. Fixes:
- Hotels mode copy. Headline "Wake up somewhere new". Subline "Hotels with the price of the whole stay up front, taxes and fees included". Flights keeps "Land somewhere new" and its subline.
- The caption can change a moment before its photo shows (open item): change the caption text at the crossfade's midpoint, driven by the same timer.
- The 1600 hero file renders at 1638 wide during the scroll zoom: let sizes ask for the 2400 file from 1440 up.
- Check at 390 x 844 that the Search button still ends inside the first screen in Hotels mode (the hotel card has one field fewer, so it should).

### A2. Destinations (keep, fixes only)
- The heading must never sit under the pinned compact bar: give the section scroll-margin-top of --h-nav plus --h-compact plus 16.
- Hotels mode: heading "Hotels where the city meets the water"; note "The lowest nightly rate we found for two adults, taxes and fees included. Rates change often."; each card line "Hotels from $148 a night" in shallows; the card links to `/hotels?place=<slug>` and, with JavaScript, fills the hotel card's Destination and opens Dates.
- Remove the hairline rule between this section and the next; the deal banner's band join does the separating.
- Data: catalogue cities: name, code, slug, region, lowest return fare from London, lowest nightly rate, destination photo (the six built ones).

### A3. Deal banners (new)
Booking.com's offer banners and Priceline's offer band, made Landfall: the place is the banner.
- Anatomy at 1440: two banners in one row inside the container, 816 + 408 (gap 24), both 360 tall, radius 24, each a full-bleed water photo of the deal city with the --fx-grade and a lower-left ink scrim (the hero's caption scrim, 70% under the text). On the large one, bottom-left 40px in: H2-size city name in Newsreader (on photo, --c-on-photo), a 16/500 line, a LandfallLine (London to Lisbon, "2h 45m, nonstop"), the price "Return from $338" 22/600 in shallows, the SaveLine in shallows (the green fails on photos: on photos savings use shallows), and a teal pill with the --c-on-action label. The small one: city name 26 Newsreader, one line, price, a ghost pill on the photo.
- 1024: the two banners stack, each full width, 320 tall. 390: one banner per row, 4:5 photo with the text over the lower half, the button full width inside it; 16px gap.
- Behaviour: the whole banner is one link (the button is its visible part) that runs the search below. Hover: photo 1.04 over --d-zoom, arrow nudge.
- Final copy, Flights mode:
  - Large: "Lisbon" / "Late autumn light on the Tagus, and fares lower than last week" / "Return from $338" / "$74 below this route's usual fare" / button "See Lisbon fares". Links to `/flights?from=LHR&to=LIS&depart=2026-11-24&return=2026-12-01&adults=1&children=0&infants=0&cabin=economy`.
  - Small: "Cape Town" / "Summer on the Atlantic side starts in December" / "Return from $1,042" / button "See Cape Town fares".
- Hotels mode:
  - Large: "Lisbon" / "Riverside rooms in Alfama and Baixa, priced below their usual rate" / "4 nights from $612 total" / "$96 below its usual rate" / "See Lisbon stays" to `/hotels?place=lisbon&checkin=2026-11-24&checkout=2026-11-28&adults=2&children=0&rooms=1`.
  - Small: "Tokyo" / "Rooms over the Sumida River" / "From $176 a night" / "See Tokyo stays".
- Use the catalogue's deal lines and numbers where they differ from these; keep the shape.
- Data: catalogue deal lines: city, mode, headline line, dates, price, usual price (to compute the save line), photo (new water photos: Lisbon may reuse lisbon-tagus-golden only if no second Lisbon water photo is found; prefer a new one so it does not repeat section 2).

### A4. Deal cards (new)
- Heading row: H2 "Fares that dropped this week" (Hotels: "Stays below their usual rate"), under it 14 muted "Lowest prices we found in the last 7 days, taxes and fees included", rail arrows at right. A filter row under it (chips, 42px, radius 8, foam fill when picked, roving tabindex): Flights "All", "Europe", "Americas", "Asia and Pacific", "Africa and Middle East", "Weekend trips"; Hotels "All", "Under $150 a night", "Free cancellation", "Breakfast included", "Scored 8.5 or more". A chip filters the rail in place (cards cross-fade, --d-mode-in) and shows "No deals here this week" with a link to clear if empty.
- 8 RailCards. Flight deal card: photo of the destination (4:3); title "London to Lisbon" 18/500; date line "Tue, Nov 24 to Tue, Dec 1" 14 muted; LandfallLine 120px with "2h 45m, nonstop"; airline name 13/500 muted; hairline; price block: "$338" 22/600 underlined plus 14 muted "return, per traveler", the SaveLine. Hotel deal card: hotel photo; hotel name 18/500; area and city 14 muted; ScoreBadge compact with word and count; stay line "4 nights, Nov 24 to 28, 2 adults"; hairline; "$612 total" 22/600 underlined, "$153 per night" 14 muted, "taxes and fees included" 13 muted, SaveLine; a "Free cancellation" line in --c-save when the rate plan has it.
- Each card is one link that runs the real search with its dates and party (flights: results with that offer at the top, hotels: the hotel page with dates).
- 390: rail at 1.15 cards; the chip row scrolls sideways with a fade at its right edge.
- Data: catalogue deals: 8 per mode, each with route or hotel, dates, party, price, usual price, airline, duration, stops, region, plus for hotels nights, nightly, score, review count, cancellation, breakfast.

### A5. Recommended for you (new)
Expedia's "continue your search" and Booking.com's recent searches, run on the browser.
- Store: localStorage key `lf.recent` (try/catch, safe when empty or blocked), at most 12 entries, newest first, each {kind: flight-search, hotel-search, flight-view, hotel-view, at, params, label}. Written by the search cards, results pages and detail pages (Part B writes the view entries on flight details and hotel detail; Part A writes the search entries and the reader). Never sent to the server.
- **Returning visitor** (any entry in the current mode): two rows.
  1. "Pick up where you left off": up to 4 search cards (not RailCards: compact, 296 x 132, radius 16, hairline, no photo, a 56px square city photo at left): route or place 16/600, dates and party 14 muted, LandfallLine small, the lowest price seen 14/500 ("From $412 when you looked"), and "Search again" as the link text. A quiet text button "Clear recent searches" at the heading row's right (it clears the store, the row animates out and the default shows).
  2. "Because you looked at Lisbon" (the most recent viewed or searched city): a Rail of 8 RailCards. Flights mode: fares to the 4 cities nearest in region and price, then 4 to the same city on other dates (date line differs). Hotels mode: 8 hotels in that city ranked by score then price, with the viewed hotel left out.
- **First visit** (empty store): one row, H2 "Recommended for you", 14 muted under it "Picked for November departures from London. Search once and this row follows your trips." Then 8 RailCards from the catalogue's first-visit default list (warm water cities for winter), leaving out the A3 banner cities and the cities of the first 4 A4 cards, so nothing repeats down the first visit.
- Ground: this section sits on --c-shade with band joins (A4 stays on white), so two photo rails never run back to back on one ground.
- Heading for returning visitors: H2 "Recommended for you" stays as the section heading, with the two rows under it as H3 (20/500 Albert Sans).
- 390: the search cards become a horizontal rail too (1.15 visible).
- Data: catalogue recommendation lines (reason lines per city), first-visit default list per mode, region and price per city for the nearest-cities rule.

### A6. Trending (new)
Booking.com and Expedia trending blocks, drawn as Landfall's route board, not as another photo grid.
- Flights mode: H2 "Routes people are booking", no origin chips while the catalogue has one origin (London, "Who flies each route from London"); if the catalogue adds origins, add "From <city>" chips here. A two-column board at 1440 (each column 600 wide, 6 rows per column, 12 routes): each row 72 tall, hairline between rows: a 48px square city photo (radius 8), "London to Lisbon" 16/500, under it 13 muted "Nonstop, 2h 45m, 4 airlines"; in the middle a LandfallLine that grows with the duration (scaled to the longest route on the board, the concept made visible); at right "$412" 18/600 plus 13 muted "return"; the row is a link to the search with the next weekend's dates; hover: foam fill, the landing dot moves 4px.
- Hotels mode: H2 "Stays people are booking", city chips: "All", then the 6 top cities. Same board: hotel photo 48px, hotel name 16/500, "Alfama, Lisbon" 13 muted, ScoreBadge compact, at right "$186 a night" 18/600 and 13 muted "$744 for 4 nights".
- 1024: one column of 12 rows. 390: one column, the LandfallLine hidden (duration stays in the line under the name), rows 64 tall, the first 6 shown and a "Show 6 more" ghost pill.
- Data: catalogue routes (origin, destination, lowest return fare, duration, stops, airline count) and hotels (name, area, city, score, nightly rate).

### A7. Browse (new)
Booking.com's browse by property type and region tabs, Expedia's explore by destination.
- H2 "Find your way in" (Flights) / "Find a place to stay" (Hotels). Text tabs under it with the landfall line on the selected one (the hero tab style, ink on white): Flights "By region", "By city"; Hotels "By region", "By city", "By property type". Roving tabindex, arrow keys, the panel swaps with the mode-in rise.
- By region: region sub-chips (Europe, Americas, Asia and Pacific, Africa and Middle East); a grid of 6 city tiles per region (3 columns at 1440, gap 24): tile 400 x 112, radius 16, hairline; square photo 112 flush left; city 22 Newsreader; two link lines "Flights from $412" (to the flight search) and "Hotels from $148 a night" (to the hotel search), each a real link with its own focus ring.
- By city: all 24 catalogue cities as a dense 4-column list of links at 1440 (6 rows), city 16/500 and the mode's price 14 muted, alphabetical.
- By property type (Hotels only): a Rail of 6 cards, 296 wide: photo 4:5 radius 16 (a property of that type by the water), type name 18/500 (the catalogue's six: Hotel, Boutique hotel, Guesthouse, Apartment, Aparthotel, Resort, shown in the plural), "24 stays, from $96 a night" 14 muted. Each runs `/hotels?type=<type>` with no place, or with the most recent place if the store has one (Part B's results page must accept `type`).
- 1024: tiles 2 columns. 390: tiles 1 column (photo 88), the city list 2 columns, property types a rail at 1.6 visible.
- Data: catalogue cities (region, lowest fare, lowest rate, slug) and hotel property types with counts and lowest rates.

### A8. How booking works, and trust (replaces "What happens when you book")
The three alternating photo rows go. In their place one band on --c-shade with band joins top and bottom, id `how-booking-works`.
- H2 "How booking works" centred, 14 muted "From the search to the ticket in your inbox".
- **The steps as one landfall line** across the container at 1440 (Landfall's own; not icon cards): a 1.25px line with 4 stops (dots 12px, the last one the landing dot in --c-action). Under each stop: a 20px glyph, a title 18/500 and two lines 15/400 muted, max 28ch. The line draws left to right (stroke-dashoffset, 1200ms, --ease-reveal) once in view; the dots fade in on arrival. Reduced motion: drawn.
  - Flights: "Search" / "Pick a route and dates. Every fare shows the total for all travelers." · "Choose your fare" / "Compare what each fare includes: bags, changes, refunds and seats." · "Pay by card" / "Your card goes through Stripe. We check the price with the airline just before you pay." · "Travel" / "Your e-tickets arrive by email and stay in My bookings."
  - Hotels: "Search" / "Pick a city and dates. Every rate shows the price for your whole stay." · "Choose your room" / "Compare rate plans: breakfast, free cancellation, pay now." · "Pay by card" / "Your card goes through Stripe. We confirm the room with the hotel before you pay." · "Check in" / "Your confirmation arrives by email and stays in My bookings."
  (The middle dots in these lines are list separators in this spec only; each step is its own element on the page.)
- **Trust row** under it (shared by both modes), 4 facts in one white panel (radius 16, hairline), divided by vertical hairlines, not four cards: glyph, title 15/600, one line 14 muted, the last two link.
  - "Taxes and fees included" / "The total you see is the total you pay."
  - "Price checked before you pay" / "If it changes, you see it and choose."
  - "Card payments by Stripe" / "We never see or store your card number."
  - "Help with your booking" / "Contact us with your booking reference." links /contact.
- 1024: steps stay in a row (titles wrap); trust facts 2 x 2. 390: the line runs vertically down the left with the steps beside it (the itinerary timeline's language); trust facts stack as rows.
- Data: none beyond the copy.

### A9. Popular searches grid (new)
Priceline's data-backed city grid, so the bottom of the page is deep.
- H2 "Popular searches" (both modes), 14 muted "Flights and hotels in 24 cities, with the lowest prices we found this week".
- 24 accordion cards in 3 columns at 1440 (8 per column, filled column first), each 400 x 64 closed, radius 12, hairline, no shadow: city 16/500, country 13 muted, a plus that turns to minus. Open (one at a time per column, --d-panel): up to 6 priced link rows, each 40 tall with a hairline: Flights mode "London to Lisbon, nonstop, $412 return", "London to Lisbon, 1 stop, $388 return", the cheapest airline's line ("Kittiwake Air, from $412"), ..., "All flights to Lisbon"; Hotels mode "Casa Lanterna, $186 a night", ..., "All hotels in Lisbon". Each row is a real search link.
- 1024: 2 columns. 390: 1 column, first 8 cities, then "Show all 24 cities".
- Data: catalogue cities with country, route fares from each origin, top hotels per city with nightly rate.

### A10. FAQs (new)
Kasa's hairline accordion in one 840 column, centred H2 "Questions before you book", id `faqs`. 8 questions per mode, single open, plus and minus, 200ms. Each answer is 2 to 4 sentences of plain fact from the scope; ids `faq-<slug>` so the footer can link to them; Flights FAQ 3 is `faq-change` and FAQ 7 is `faq-cards`. Copy deck facts win; never invent policies (any line that needs a client fact gets the CLIENT COPY REQUIRED comment and a neutral line).
- Flights:
  1. "Does the price include taxes and fees?" / "Yes. Every fare shows the total for all travelers with taxes and fees included. The price per traveler sits under it."
  2. "What can I take on board?" / "It depends on the fare. Each fare lists its cabin bag and checked bags before you choose it."
  3. "Can I change or cancel my flight?" / "Each fare shows its change and refund rules before you pay. Booked flights can be managed in My bookings where the airline allows it."
  4. "Why did the price change before I paid?" / "Airlines can change a fare at any time. We check it again just before payment and show you the new total, so you can continue or go back."
  5. "When do I get my e-ticket?" / "Usually within a few minutes of paying. It comes by email and is saved in My bookings."
  6. "Do I need an account to book?" / "No. An account keeps your bookings and travelers in one place, but you can book as a guest."
  7. "Which cards can I pay with?" / "Major credit and debit cards, through Stripe." Mark it with the CLIENT COPY REQUIRED comment (card brands are open client question 16).
  8. "How do I contact you about a booking?" / "Use the contact page with your booking reference and we'll reply by email."
- Hotels:
  1. "Is the price for the whole stay?" / "Yes. The total covers every night for your room and guests, with taxes and fees included. The nightly price sits under it."
  2. "What does free cancellation mean?" / "You can cancel without a charge until the date shown on the rate. After that, the hotel's cancellation terms apply."
  3. "Is breakfast included?" / "Only on rates that say so. Each room lists what its rate includes."
  4. "When can I check in?" / "Check-in and check-out times are on each hotel page under House rules."
  5. "Can I book more than one room?" / "Yes. Choose the number of rooms in the search, then the quantity of each room on the hotel page."
  6. "Do I pay now or at the hotel?" / "You pay now by card through Stripe." Add "Some hotels charge a local tax or a deposit at check-in; the hotel page says so when they do." only if the catalogue's house rules include such charges; otherwise mark the answer CLIENT COPY REQUIRED and keep the first sentence.
  7. "Can I change my dates?" / "Cancel and rebook if your rate allows free cancellation, or contact us with your booking reference."
  8. "How do I contact you about a booking?" (as Flights 8)
- 390: full width, rows 64 tall.

### A11. Pre-footer band (keep, fix)
Keep "Where will you land next?" and its pill. Fix: the pill scrolls to the hero and opens the current mode's first empty field (To in Flights, Destination in Hotels), and says "Start a search" in both modes.

### A12. Footer at competitor depth
Varun's V10 stays (phone and email large at the top, never a centred list, no giant wordmark); competitor depth goes in under it. Ink band (--c-band), the hero photo at 12% under it as now.
- **Row 1 (as now)**: phone 26/700 underlined, email 18/700, "Back to top" at right.
- **Row 2, popular links** (new, text links in two labelled groups of 12, each group in 2 columns of 6 at 1440, so 4 columns across; 14/500 on-dark, 32px rows):
  - "Popular flights": London to Lisbon, London to New York, London to Rome, London to Tokyo, London to Cape Town, London to Mexico City, London to Barcelona, London to Athens, London to Paris, plus three more London routes from the catalogue. Each `/flights?from=<code>&to=<code>` (results already accept from and to without dates; check each one returns results).
  - "Hotels in": Lisbon, New York, Rome, Tokyo, Cape Town, Mexico City and six more catalogue cities. Each `/hotels?place=<slug>` (check each slug exists in lib/mock/hotels after the catalogue lands).
- **Row 3, five link columns** at 1440 (titles 14/600 on-dark, links 14/500 on-dark-muted, 36px rows, hover on-dark with underline):
  - Book: Flights (`/`), Hotels (`/?mode=hotels`), Deals this week (`/#deals`), Trending routes (`/#trending`), Browse by property type (`/?mode=hotels#browse-types`; that hash selects the property type tab on load and on hashchange).
  - Your trips: My bookings (`/bookings`), Profile (`/account`), Sign in (`/login`), Create an account (`/register`), Reset your password (`/forgot-password`).
  - Help: Contact us (`/contact`), How booking works (`/#how-booking-works`), Flight questions (`/#faqs`), Hotel questions (`/?mode=hotels#faqs`), Changes and cancellations (`/#faq-change`, Flights FAQ 3), Payments (`/#faq-cards`, Flights FAQ 7).
  - Company: About Landfall (`/about`), Email previews (`/emails`, label "Email previews (demo)").
  - Legal: Terms and conditions (`/terms`), Privacy policy (`/privacy`), Price display (`/terms#prices`, add the anchor), Cookies (`/privacy#cookies`, add the anchor).
  No link to a page that does not exist; no social links (no client accounts); no app links.
- **Row 4, trust row (as now)**: legal entity, address, registration (marked placeholders), "Card payments by Stripe" with card marks in their own colours.
- **Row 5, price disclosure** (Priceline technique, 13/400 on-dark-muted, max 96ch, two short paragraphs): "Prices include taxes and fees and are for all travelers or the whole stay unless a line says per traveler or per night. Savings lines compare a price with the usual price for the same route or hotel over the last 30 days." Then the demo notice, extended: "This is a demo build. Landfall is a working name, and the logo, photos, contact details, company details, flights, hotels, prices, deals, review scores and reviews are placeholders. No booking is real and no card is charged."
- **Row 6**: copyright, "Created with love by Digital Heroes".
- 1024: row 2 in 2 columns of 6; row 3 in 3 columns. 390: row 2 and row 3 groups become disclosures (48px rows, plus and minus, all closed), except Your trips and Help which stay open; trust row stacks; about 70 links total in the footer.
- Ids on the home sections for these anchors: deals, recommended, trending, browse, how-booking-works, faqs.

### A13. Part A order of work
1 the mode switch with sections 1 and 2 and the URL, 2 shared components (A0 list) by 16:15, 3 footer, 4 deals (A3, A4), 5 Recommended, 6 How booking works and trust, 7 FAQs, 8 Trending, 9 Browse, 10 Popular searches. If time runs out, 9 and 10 are the P2 items; everything else is P1. Stop for Varun's review after the homepage (round 3 note, ruling 4).

---

## PART B: INNER PAGES (Developer B)
Varun's ruling 4 (Chief Officer note 1): no visual rebuild of any inner page until Varun signs off the homepage. Until then Developer B does groundwork only: mock data rules in lib/mock from the catalogue, URL params and filter and sort state on /flights and /hotels (including `type`), the `lf.recent` view writers on flight details and hotel detail, and catalogue wiring. After Varun's sign-off, build the visual work below in the order in B11. P1 must, P2 if time. Every new filter and sort works on the mock data and updates the URL (so Back and a shared link keep them).

### B1. Flight results (/flights)
P1
- **Date and price strip** under the title row: 7 cells (the depart date with 3 days either side), each 160 x --h-datestrip at 1440, radius 12, hairline: "Thu, Nov 19" 14/500 and "$398" 16/600 tabular; the cheapest cell has a SaveLine-green "Lowest" word, the current cell foam fill with a navy 1.5px ring. Arrows at both ends move a week. Clicking a cell reruns the search for that date (URL changes). 390: a horizontal scroller of 72 x 64 cells. Data: catalogue fares by date for each route (or a seeded rule in lib/mock/flights.ts: base fare times a weekday factor, stated in a comment).
- **Sort summary tabs** above the list, three equal tabs (Booking.com and Expedia technique): "Best", "Cheapest", "Fastest", each with the price and duration of its top result ("$1,098 total, 7h 10m"); the selected one has the landfall line. A "More sorts" select beside it: Earliest departure, Latest departure, Earliest arrival, Shortest layover.
- **Filters** (280 column at 1440, each group hairline-topped, collapsible, with a "Reset" link when changed; every option shows its count and lowest price):
  1. Stops: Any, Nonstop only, 1 stop or fewer, 2 stops or fewer (radio).
  2. Bags: Cabin bag included, Checked bag included (checkbox).
  3. Fare options: Changeable, Refundable, Seat choice included (checkbox).
  4. Airlines: all 12 catalogue airlines present in the results, checkbox each with its lowest price, plus an "Only" link on hover or focus; "Select all".
  5. Departure time, outbound and return as two sub-groups: Early morning (00:00 to 04:59), Morning (05:00 to 11:59), Afternoon (12:00 to 17:59), Evening (18:00 to 23:59), shown as 4 toggle tiles with a 20px glyph each.
  6. Arrival time: the same four, outbound and return.
  7. Flight duration: a range slider in hours, with the histogram of results under it (bars 4px, --c-line, the in-range bars --c-action).
  8. Layover duration: range.
  9. Layover airports: checkbox list with counts.
  10. Price: range for the total, with a histogram.
  An "Applied" row of removable chips appears above the list when any filter is on, with "Clear all".
- **Result card anatomy** (keep the Landfall row, add): per leg a row with airline logo or code tile, departure time 20/600 and code, the LandfallLine with duration and stop dots (stop codes and layover length in the line's label: "1 stop, 1h 50m in MAD"), arrival time 20/600 and code, a "+1" day marker in warn when the arrival is next day; under the legs a line of included-items glyphs (cabin bag, checked bag, changes) each with a word, struck in muted when not included; a tag row: "Cheapest", "Fastest", "Best" chips on those results only. Right column: total 22/600 underlined (opens the breakdown), "$549.30 per traveler" 14 muted, "taxes and fees included" 13 muted, "From Light fare" 13 muted, "View fares" teal button. A "Flight details" disclosure under the card opens the full timeline in place (aircraft, flight number, operated by, layover airport).
- Count line: "48 flights, sorted by Best" with an explanation tooltip of Best ("a mix of price, duration and stops").
- 390: the strip, then the three sort tabs as a segmented row, then chips "Filters (3)", "Sort", "Stops", "Bags" (each opens its sheet), cards stacked with the legs one above the other and the price at the bottom right; the filter sheet's footer button says "Show 23 flights".
P2
- A "Price alert" is out of scope (no email backend); do not add it.
- A small "Prices for nearby airports" line when the origin has more than one (LHR, LGW, STN) if the catalogue has them.
- Data: catalogue airlines (name, code, fare families), routes (duration, stops, layover airports, aircraft, flight numbers, times).

### B2. Flight details and fares (/flights/[offer])
P1
- **Fare families** as a comparison: at 1440 a table of columns (one per fare family the airline sells, 3 or 4), rows: Price (total and per traveler), Cabin bag, Checked bags, Seat choice, Changes, Cancellation and refund, Priority boarding, Miles: never (out of scope, do not show). Cells use a tick glyph in --c-navy, a plus with the fee ("$75 fee"), or a muted dash word "Not included". Selected column: foam fill, navy 1.5px ring, the "Selected" word; each column's footer has a "Choose Classic" button. Use the catalogue's families for the owning airline (3 or 4 each, Economy; "How fare families work": cells starting "For a fee", "Not allowed", "Not refundable" sort into the three lists; the step prices). The four below are the reading order and the level of detail to reach, not names to hard-code:
  - Light: personal item under the seat only, no checked bag, no seat choice (assigned at check-in), changes not allowed, no refund.
  - Classic: cabin bag 8 kg, 1 checked bag 23 kg, standard seat choice, changes for a $75 fee plus any fare difference, no refund.
  - Flex: cabin bag 8 kg, 2 checked bags 23 kg, seat choice including extra legroom, free changes (fare difference applies), refund to card minus $50.
  - Business: 2 cabin bags, 2 checked bags 32 kg, lie-flat or business seat, free changes, full refund, priority boarding and lounge access where the airline offers it.
- **Itinerary timeline** (keep the vertical landfall line) plus aircraft, operated by, flight number, layover band with "Change planes, 1h 50m in Madrid", and a "Baggage" note per leg.
- **Price breakdown** dialog: per traveler type (Adult x 2: fare, taxes, fees), total, with "Price held until 10:42".
- Fare conditions accordion (keep), now driven by the chosen family.
- 390: fare families as swipe cards (one per family, 1.1 visible) with the same rows as a list; the sticky price bar shows the chosen family name over the total.
P2: a "Seat preference" note (window or aisle request, no seat map); fare rules full text in a dialog.
- Data: catalogue fare families per airline with inclusions and prices by route.

### B3. Travelers (/flights/[offer]/passengers)
P1: Keep the form. Add per traveler: date of birth with age rule hint ("Child: 2 to 11 on the return date"), passport fields as an optional disclosure (number, nationality, expiry) where the route is international (all are, in the catalogue), "Same as lead contact" for email and phone; saved travelers as chips when signed in; a short "Name as it appears on the passport" hint. Bags summary line from the chosen fare. 390: the sticky price bar.
P2: Add checked bags per traveler if the fare allows paid bags (stepper, adds to the total live, total re-animates).

### B4. Checkout (/checkout)
P1: Price summary as a line-item table: fare per traveler type, taxes and fees, bags added, total 28/600; "Price held until 10:42" with the warn state under 5 minutes; cancellation and change summary for the chosen fare or rate in two lines with a "Full conditions" link; the Pay button "Pay $1,098.60". Keep the failure states. 390: total only in the bar; Pay inside the form.
P2: Billing address fields if Stripe needs them for the market (ask before inventing).

### B5. Confirmation (/confirmation/[ref])
P1: Keep. Add "Add to calendar" (an .ics download built on the client), "Print or save as PDF" (window.print with a print stylesheet), a "Your stay in Lisbon" Rail of 4 hotels for the booked dates (recommendations, links with dates), and for stays "Your flight to Lisbon" fares for the stay dates.
P2: A "Getting there" line from the airport to the hotel area (catalogue nearby data).

### B6. Hotel results (/hotels)
P1
- Accept `place`, `checkin`, `checkout`, `adults`, `children`, `rooms`, `type`, `sort` and every filter in the URL.
- **Filters** (left column at 1440 above the map toggle; in a sheet at 1024 and 390), counts on every option:
  1. Your budget, per night: range with histogram, and a total-for-stay line under it.
  2. Guest score (catalogue labels): 9 or more, 8 or more, 7 or more.
  3. Star rating: 2 to 5 as toggle tiles.
  4. Property type: the catalogue's six (Hotel, Boutique hotel, Guesthouse, Apartment, Aparthotel, Resort).
  5. Meals: Breakfast included, Half board.
  6. Cancellation: Free cancellation.
  7. Neighbourhood: the city's areas from the catalogue.
  8. Distance from centre: Under 1 km, Under 3 km, Under 5 km.
  9. Amenities: Free wifi, Air conditioning, Pool, Gym, Parking, Kitchen, Pet friendly, Spa, Airport shuttle, Accessible rooms, River or sea view (the place-first filter).
  10. Bed type: Double, Twin.
- **Sorts**: Recommended, Lowest price, Guest score, Distance from centre, Stars (high to low).
- **Card anatomy** (keep Landfall's row card; add): ScoreBadge with word and count; stars glyphs; area plus "1.2 km from centre" and a "View on map" link; a "Water view" chip when the hotel has one; the room line for the dates ("Superior double, 1 queen bed"); inclusion lines in --c-save ("Free cancellation until Nov 18", "Breakfast included"); scarcity only from the catalogue ("Only 2 rooms left at this price", warn); price block: "$744 total" underlined, "$186 per night, 4 nights, 2 adults", "taxes and fees included"; SaveLine when it is a deal; "See availability" teal button.
- Result count and an applied chips row; "No stays match" with clear actions.
- 390: map first collapsed to a "Map" chip (keep the existing behaviour), Filters, Sort and Price chips; cards photo on top; sheet footer "Show 18 stays".
P2: a price-per-night or total toggle (default total; ruling: total first stays).
- Data: catalogue 96 hotels (city, area, coordinates or distance, stars, type, amenities, score, count, rooms with rates and plans, photos by key).

### B7. Hotel detail (/hotels/[hotel])
Keep the arrival view and "Your stay" leg. Add a sticky section nav under the compact bar at 1440 (text tabs with the landfall line on the current one, scroll-spy): Overview, Rooms, Reviews, Location, House rules, FAQs. Section order:
P1
1. **Gallery** (keep): lead water photo plus strip; the dialog grouped by "Outside", "Rooms", "Shared spaces" chips with counts.
2. **Overview**: H1, stars, area link, ScoreBadge with word and count (links to Reviews), description (keep), and **Highlights**: 4 to 6 facts with glyphs in one row ("River view rooms", "Breakfast 7:00 to 10:30", "12 min walk to Baixa-Chiado metro", "24 hour front desk").
3. **Amenities**: the top 10 with glyphs, then "All 34 amenities" dialog grouped (Bathroom, Bedroom, Internet, Food and drink, Services, Accessibility, Parking).
4. **Availability**: a search strip (dates, guests, rooms) that reruns in place, then the **availability table** at 1440: columns Room type (photo 120 4:3, name 16/600, beds, size m2, view, 4 amenity words, "Room details"), Sleeps (person glyphs), Your choices (per rate plan: "Room only", "Breakfast included", with "Free cancellation until Nov 18" or "Non-refundable" and "Pay now"), Price for 4 nights (total 18/600 underlined, per night 13 muted, SaveLine when it is a deal), Select (a quantity select 0 to the rooms left), and one "Reserve" teal button in the last column that sums the selection ("2 rooms for $1,488"). Each room type has 2 to 3 rate plan rows. Rows divide with hairlines; the room cell spans its rate rows. 390: one card per room with its rate plans as stacked rows (radio choice), the price bar sums the choice.
5. **Reviews**: big ScoreBadge (56px) with word and count, 7 category bars (Cleanliness, Comfort, Location, Staff, Value for money, Facilities, Free wifi): label, a 6px bar in --c-action on --c-line, score 14/600; filter chips by traveler type (All, Couples, Families, Solo, Groups) and sort (Most recent, Highest, Lowest); 6 review snippets (initial disc in foam with navy letter, first name, country, traveler type, month stayed, room, score, a title 16/600, the text 15/400 max 4 lines with "Read more"); "Read all 412 reviews" opens a dialog with 20 more. Under the bars the catalogue's line: "Demo reviews, written for this preview. They are not from real guests."
6. **Location**: the map (keep) with the hotel pin and nearby pins; lists "What's nearby" (6 places with walking minutes), "Getting around" (metro, tram, ferry with minutes), "Airports" (name and km).
7. **House rules**: a definition table: Check-in (from 15:00), Check-out (until 11:00), Cancellation (by rate), Children and beds, Age limit, Pets, Cards accepted (marks), Quiet hours, Smoking.
8. **FAQs**: 6 hotel questions from the catalogue, Kasa accordion.
9. **Similar stays**: a Rail of 4 RailCards (same city, score and price near), plus "Recently viewed" from `lf.recent` if there is more than one hotel view.
P2: a "Good to know" banner about local tax paid at the hotel when the catalogue says so; share link button (copies URL).
- On load write a hotel-view entry to `lf.recent`.
- 390: section nav as a horizontal scroller under the compact pill; the price bar stays.
- Data: catalogue hotel: highlights, amenities by group, rooms (size, beds, view, sleeps, amenities, photos), rate plans (meal, cancellation date, price per night, quantity left), score, category scores, reviews (name, country, type, month, room, score, title, text), nearby, transit, airports, house rules, FAQs.

### B8. Guests (/hotels/[hotel]/guests)
P1: one card per room ("Room 1, Superior double") with guest name; lead guest email and phone; estimated arrival time select (hour slots); bed preference where the room has options; special requests textarea with "Requests depend on availability"; "I'm booking for someone else" toggle. Summary card: hotel thumb, room(s), rate plan, cancellation line, dates and nights, total with breakdown (room x nights, taxes and fees). 390: price bar.

### B9. Account pages and dashboard
P1
- **/bookings as the dashboard**: next trip card (keep) with a countdown "In 9 days"; tabs Upcoming, Past, Cancelled with counts; each row: photo 64, route or hotel, dates, reference, status chip, total, "View booking"; a "Recent searches" block from `lf.recent` (3 cards, "Search again"); a "Saved travelers" summary with "Manage" to /account.
- **Booking detail**: actions row: "Add to calendar", "Print", "Download receipt" (a print view), "Cancel booking" (keep the refund-first dialog); the fare or rate conditions; payment summary with card brand and last four (mock).
- **/account**: sections with a left section list at 1440 (Personal details, Saved travelers, Sign-in and security, Email preferences, Delete account): email preferences are toggles for booking emails only (no marketing promises); delete account asks for confirmation and only clears the mock session.
- Login and register: keep; add "Show password" (check it exists) and the password rules line.
P2: a "Your trips" map is out; do not add.

### B10. 390 rules for every inner page
Sheets for filters and sorts with a fixed footer count button; sticky price bar on details, travelers, hotel detail and guests; tables become stacked cards; section navs scroll sideways; 44px targets; the date strip and rails swipe with the next item peeking; check 390 x 844 that no bar covers an error or the Pay button.

### B11. Part B order of work
Flight results (B1), hotel detail (B7), hotel results (B6), flight details and fares (B2), then B5, B9, B3, B4, B8. All P1 before any P2.

---

## Conflicts resolved (art-direct order)
1. **Kasa promo rows versus competitor depth** (primary reference wins on section structure, order 4): Varun's round 3 note names "What happens when you book" as where the homepage falls off, so his ruling outranks the reference. The rows go; the steps keep Landfall's own form (the landfall line), not three icon cards (anti-slop, order 1).
2. **V10 footer (four columns, contact first) versus competitor depth**: V10 wins on footer content (order 3), so phone and email stay first and there is still no giant wordmark; the extra rows are added under it. Five columns is a change to V10's count: Chief Officer approved, no padded links; **for Varun** to confirm.
3. **Struck-through prices versus honest pricing**: deals show a SaveLine against the usual price over the last 30 days (catalogue value only) instead of a strike-through. Chief Officer approved. For Varun if he wants strike-throughs.
4. **Green for savings on photos** fails contrast, so savings on photos use shallows (accessibility, never traded).
5. **Mode switch versus "keep the first two sections as they are"**: the hero and destinations keep their layout and design; only their text, prices and links change with the mode. The hero photos do not change.
6. **Eyebrows**: none, even though the competitors use kickers on deal cards (anti-slop wins).

## What I could not check or had to guess
- Booking.com and Expedia deconstructions were not written when I finished; their techniques here (homepage switching, offer banners, trending blocks, property types, sort summary tabs, fare comparison tables, availability tables, review categories) come from my own knowledge of those sites, not from measurement. Priceline's file was read (homepage only; its inner pages were blocked).
- The catalogue (content/mock-catalogue.md) did not exist yet; every price, origin city, airline count and property type in the copy above is a stand-in for its numbers. Developers use the catalogue's values and keep the copy's shape.
- I looked at the current homepage at 1440 on port 3003 only, not 3004 or 390 this round (time). Harbour inherits every new token; check it.
- Origins Manchester, Dublin and New York in the trending chips are assumptions; use the catalogue's origins.
