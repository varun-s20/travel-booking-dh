# Design spec: travel-booking, Landfall (working name, a placeholder)
Primary reference: Kasa (landfall/references/deconstruct/kasa.md, plus references/deconstruct/kasa-hotel-detail.md for the hotel page). Section donor: European Sleeper (landfall/references/deconstruct/european-sleeper.md: destination cards, band joins, the 390 search card, the trust row). Ease-of-use benchmarks named by the client (Booking.com, Expedia, Priceline): technique only, not measured.
Art Director, 2026-11-11. Choices by the Chief Officer for Varun (landfall/design/choices.md, 2a). Tokens: landfall/design/tokens.css. Prototype: landfall/prototype/ (nav, hero, destinations band). Placeholders: the name, the wordmark, the market (English, USD), contacts and legal facts. Prices and routes are the shared mock data (content/copy.md); Landfall's own copy deck (landfall/content/copy.md) is written next and wins over any working copy here.
Shares nothing with Overwing: no rail, no tab bar, no pill search, no cabin window, no Calibre or Geist, no Hipcamp layout, no Monocle mats, no Faye cards, no Hoxton labels, no photos from site/public/images.

Pages in scope (the same list as build/plan.md): Home; Flight results (searching, no results, fare changed, offer expired, search failed); Flight details and fares; Passenger form; Checkout; Payment failed; Confirmation; Hotel results; Hotel detail; Guest form; Register, Log in, Forgot password, Reset password; Profile; My bookings (dashboard) and Booking detail; About, Contact, Terms, Privacy; 404 and error page; Emails (booking confirmation and booking events).

## 1. Concept
See the place first, the way you see it arriving from the water. Every destination photo shows the city where it meets the water (the Chief Officer's wording of the image rule), and the hero opens on one, full-bleed, with Kasa's calm booking system laid over it: a centred serif headline, a white search card that grows its own panels, and a small arrival caption that names a real fare ("London to Lisbon, return from $412"). From there the site is Kasa's: hairline-quiet pages on white, one navy for every action, the search pinned as a compact bar on every inner page, and Kasa's price rule (the whole-trip total first, per traveler or per night second, taxes and fees included). One brand device ties it together: the landfall line, a hairline that ends in a short teal segment where land would be. It appears in the wordmark, under the active tab and current nav link, on every flight leg, and above every booking total. Nowhere else.

## 2. Source map
| Section | Structure from | Technique taken | What changes for this client | Assets |
|---|---|---|---|---|
| Header | Kasa | 66px frosted strip over the hero, solid white after it; hides on scroll down, returns on scroll up (400ms small overshoot) | Text links Flights, Hotels, Destinations, Help; My bookings and a Sign in pill; at 390 account and menu icon buttons | Wordmark (placeholder) |
| Menu (below 1025) | Kasa | Full-screen sheet of grouped links | Groups Book, Your trips, Help; Sign in and Create an account as pills | None |
| Home hero | Kasa hero; Varun V5 | Full-viewport photo, crossfade, pause button, four-layer scrim, centred headline and subline, slow zoom on scroll | Stills, three cities at the water; the credit line becomes the arrival caption with a fare and "Fly here" | 3 hero photos |
| Search card (all pages) | Kasa; Expedia for labels inside fields | One white card, hairline dividers, navy Search button inside the card's radius | Flights / Hotels tabs above it; labels in the fields; swap between From and To | Icons |
| Field panels | Kasa | Panels extend the card as one surface (height 200ms); sheets on phones | Place list with codes, two-month range calendar with arrow keys, steppers with Duffel's limits, cabin class | None |
| Pinned compact search | Kasa | Compact bar after the card and the photo scroll away; docks under the returning header | A white strip behind the docked bar so nothing shows in the gap | None |
| Popular destinations | European Sleeper | Price-led dark cards, radius 24, photo with its own radius, 1.1 zoom over 500ms; 80px rows at 390 | Six mock cities, "Return from $412" in bright teal on navy | 6 photos |
| Band joins | European Sleeper; Varun V7 | Rounded band bottoms with the next band's colour filling the corners | Hero bottom corners 48/32px over white; navy bands rising over white | None |
| How booking works, trust | Kasa's promo rows (text and media) | Alternating media and text rows, hairline sections | Three facts from the scope only (taxes in every total, Stripe payments, documents in My bookings) | 3 photos |
| Pre-footer and footer | Varun V10; European Sleeper trust row | Centred band with one button; navy footer led by phone and email; trust row of entity, address, registration, payment marks | Every client fact a marked placeholder | Hero photo at 12% under the footer |
| Flight results | Kasa results (list half), benchmarks for filters | Row cards radius 16, hairline border, soft shadow; filter column; sort select | No map for flights; total first on every row; landfall line on legs | Airline logos from Duffel |
| Hotel results | Kasa results | 680 list plus sticky map; map first at 390 | Price block per Kasa once dates exist | Duffel hotel photos |
| Hotel detail | Kasa hotel page | 5-up grid as one button, room cards rail, policy accordion, reviews rail, location | Landfall type, palette, price block, the pinned card | Duffel photos |
| Flight details, forms, checkout, confirmation, account, dashboard | No reference reached | Kasa's cards, hairlines, dialogs, the price block | Booking summary sticky at 1440, sticky price bar at 390 (benchmark technique) | Mock data |
| About, Contact, legal, 404 | Kasa text styles | One reading column | Photos follow the image rule | 2 photos |
| Emails | No reference | Tokens in email-safe HTML | One column, wordmark, summary with the landfall line | Wordmark PNG |

## 2b. Section compositions
Grid: container 1248 (Kasa) centred, gutters 16 / 32 / 96 at 390 / 641 / 1440. Page ground white (navy palette) or sand (Harbour). Sections separated by space and a 1px hairline across the container (Kasa), not by colour, except the navy destination band and the footer. Every composition below is from the deconstructions unless marked [invented].

### Chrome (every page)
- Header: fixed, 66px. Wordmark at left (24px from the edge at 390, 32 at 1440); links 15/500 in 44px boxes with 8px radius hover tint; the current link carries the landfall line under its text. Right: My bookings link, Sign in pill (40px, outline over the photo, navy fill when solid). Over a hero photo: frosted (surface 10%, 6px blur), white text; anywhere else: white, ink text, 1px soft shadow. It turns solid the moment it stops sitting on a photo (at 390 the card sits inside the hero). Hides on scroll down past 120px, returns on any scroll up.
- 390: wordmark, account icon (44), menu icon (44). Menu sheet: full screen, white, top row with wordmark and a 44px round close; groups with 14px muted labels; 48px link rows with chevrons; Sign in and Create an account as full-width pills. Focus trapped, page inert, Escape closes and returns focus.
- Pinned compact search (inner pages and home after the hero): 860 x 52 at 1440, radius 12, three segments (route, dates, party) plus a 44px navy icon button, floating at top 24 with the header hidden, docked at 74 under the header with a white strip behind it. 390: a single 52px pill with the route in bold and "dates, party" on a second line, plus the icon button. Clicking a segment opens that field (in place on inner pages; on home it scrolls back to the hero card).
- Skip link first; one 2px teal focus ring (bright teal on navy and on photos).
- Footer (V10): navy, the hero photo at 12% under it. Row 1: phone (26/700, underlined, 44px tall) and email (18/700), Back to top at right. Row 2: four link columns (Book, Your trips, Help, Company), two columns at 390, never a long centred list. Row 3, the trust row (European Sleeper): legal entity, address, registration number (each a marked placeholder), "Card payments by Stripe" with card marks in their own colours. Row 4: the demo notice naming what is placeholder, copyright, "Created with love by Digital Heroes". No giant wordmark.
- Pre-footer band (V10): navy band rising over white with rounded top corners (band join), centred H2 (Newsreader), one bright-teal pill "Start a search" that scrolls to the search and focuses From.

### Home
1. Hero (prototype, built): full-viewport photo (min 640px), lower corners 48px (32 at 390) over white. Headline at y 130 (Newsreader 60/1.12, centred, max 18ch, word reveal), subline 20/500 under it (max 46ch), tabs 40px at y 262, search card 1000 x 66 at y 315 (Kasa y 300), the city clear below. Caption bottom-left 48px in, pause bottom-right. 641 to 1024: card 720 wide in two columns, tabs and caption on small frosted ink panels. 390: headline at y 98 in two lines (40px), subline, then the caption chip (one line: route, fare, arrow) with the pause button beside it, then the tabs pill, then the stacked card docked 32px over the photo's lower edge (European Sleeper at 390) with a full-width Search button inside the first screen.
2. Popular destinations: H2 centred "Cities worth the crossing" (working copy), a 14px note under it (the fare basis from copy.md), then six cards: 3 columns at 1440 (gap 24), 2 at 641, rows at 390. Card: navy, radius 24, photo 8:5 flush at the top with its own radius 24, city in Newsreader 26, "Return from $412" 16/500 in bright teal, arrow bottom right. The whole card is one link that fills To and opens Dates. No region pills (those are Overwing's).
3. How Landfall books [Kasa promo rows]: three alternating rows, photo one side (4:3, radius 16), H3 and two lines the other side; facts only from the scope: every total includes taxes and fees; card payments run through Stripe; tickets and itineraries live in My bookings. 390: photo over text. Not three icon cards.
4. Pre-footer band and footer (chrome above).
Spacing: band padding 56 to 96 (--s-band); 40px from H2 to grid.

### Flights
- Results (/flights): compact search pinned at the top (expanded under the header at load). Title row: H1 Newsreader 42 "London to Lisbon", a 16px line "Fri, Nov 20 to Fri, Nov 27, 2 adults, Economy", the result count right-aligned with a Sort select (Best, Cheapest, Fastest, Earliest departure). Below at 1440: a 280px filter column (Stops, Airlines, Departure time, Duration, Price: each a hairline-topped group with checkboxes or a range) and the list (min 0, gap 12). Result row [Kasa row card, invented content]: radius 16, hairline border, soft shadow, padding 20 24; left: airline logo 32px (Duffel) and name 14/500; middle: one line per leg, departure time and code, the landfall line with duration and stops on it, arrival time 20/600 and city (arrival set heavier, the concept); right, after a vertical hairline: total 22/600 underlined ("$1,098.60 total"), "per traveler $549.30" 14 muted, "taxes and fees included" 14 muted, a navy "Select" button (radius 12, inside the card). Whole card hover: border to field colour, 150ms; no lift. 390: filters become a "Filters" chip and a "Sort" chip under the title opening full-screen sheets with a fixed "Show 86 flights" footer (Booking.com and Expedia technique); rows stack legs over the price block; a sticky bottom bar is not used on results.
- Searching state: the compact bar shows the search; the list area shows 4 skeleton rows (Kasa's shimmer keyframe, mist tint) and a line "Searching flights from London to Lisbon" in a polite live region; after 5s "Still looking, long routes take a little longer". Reduced motion: no shimmer.
- No results: a white panel radius 16 with H2 "No flights for these dates", one line from copy.md, buttons "Change dates" (navy pill) and "Search nearby dates" (ghost pill). No illustration placeholder; a cropped hero photo of the destination (16:9, radius 16) sits above the text.
- Search failed: the same panel with "We couldn't reach the airlines" and "Try again".
- Fare changed (on details or checkout): an inline warn-tint banner above the summary, "The fare went up by $24.10 per traveler since your search", old price struck through at 60%, new total underlined, buttons "Continue at $1,146.80" and "Back to results". Fare down uses success tint.
- Offer expired: a dialog (Kasa dialog: centred, radius 16, navy 40% backdrop with blur), "This fare has expired", "Refresh the price" navy and "Back to results". Duffel offers expire in about 30 minutes; the summary shows "Price held until 10:42" and turns warn under 5 minutes.
- Flight details (/flights/[offer]): two columns at 1440 (main 760, summary 392 sticky at top 140). Main: itinerary as a vertical timeline per leg [invented]: departure time and airport, a vertical landfall line with the flight number, aircraft and duration beside it, arrival time and airport in 600 weight; layovers as a mist band "1h 50m in Madrid". Then "Choose your fare": fare rows (radius 16, hairline, padding 20): fare name 18/500, three to five inclusion lines with a tick or plus glyph (14px, teal), price difference right, a radio-styled selection (selected row: navy 1.5px border and mist fill). Fare conditions in Kasa's hairline accordion (Changes, Refunds, Baggage, Seats). Summary card: route, dates, travelers, the landfall line, total 28/600 with the breakdown (fare, taxes and fees) behind an underlined "See price breakdown" dialog, "Continue to passengers" navy pill full width. 390: summary becomes a sticky bottom price bar (72px: total and "for 2 travelers" left, "Continue" pill right); tapping the total opens the breakdown sheet.
- Passenger form (/flights/[offer]/passengers): one 680 column plus the sticky summary. One card per traveler (radius 16, hairline): title "Adult 1", fields at 56px with real labels above (Title, Given names, Family name, Date of birth, Gender as Duffel requires, Email and phone for the lead traveler). Inline errors under the field in error red with an icon; error summary at the top that takes focus on submit. Saved travelers (signed in) as chips above the first card. 390: the sticky price bar continues.

### Booking and payment [invented: no reference reached checkout]
- Checkout (/checkout): steps shown as a plain text line, not a stepper graphic ("Passengers, Payment, Done", current one in 600 with the landfall line under it). Main column: contact details recap (editable link), payment card: Stripe Payment Element themed from the tokens (font Albert Sans, radius 8, navy focus colour teal), a terms checkbox row linking Terms and Privacy, and the Pay pill "Pay $1,098.60" (full width at 390). Trust lines under the button: "Card payments by Stripe", "Your total includes all taxes and fees". Summary sticky at 1440 with the "Price held until" line; sticky bar at 390 shows the total only (the Pay button stays in the form).
- Payment failed: an error-tint panel at the top of the payment card, "Your card was declined. No money was taken.", the field re-enabled, focus moved to the panel. Not a separate page.
- Confirmation (/confirmation/[ref]): a 760 column. Hero strip [invented]: the destination's water photo at 21:9, radius 16, then H1 "You're going to Lisbon" (Newsreader), the booking reference in a mist panel (36/600, tracked .06em, tabular) with a "Copy" ghost pill, then the itinerary with the landfall line, the paid total with the breakdown, "What happens next" (e-ticket email, documents in My bookings), and two pills: "View booking" and "Search hotels in Lisbon". 390: same order, single column.

### Hotels
- Results (/hotels): Kasa's split at 1440: list 680 (left, 48px in) and map 664 sticky (top 0, full height under the header stack). Map: OpenStreetMap tiles toned to the palette, navy round price pins (white text, radius pill) that turn bright teal with navy text on card hover. Card (Kasa row card): photo carousel 252 wide left (Duffel photos, arrows on hover, dots), title 18/500, area and star line, three amenity chips (14, muted), review score if Duffel sends one (else omitted, never invented), a hairline, then the price block: total for the stay underlined 18/500 "$812 total", "$203 per night" 14 muted right, "taxes and fees included" 14 muted, a navy "View rooms" button. Without dates: Kasa's "Add dates for prices" navy button in place of the price. 390: map first, 220 tall, with an "Expand map" chip; cards full width with the photo on top; filters and sort as chips opening sheets.
- Hotel detail (/hotels/[hotel]): Kasa's page in order: compact search pinned; H1 Newsreader 42 and the meta row (area link, stars); the 5-up grid (616 / 308 / 308 x 202 / 202, gap 8, outer radius 16, one button opening the gallery dialog, the "+N photos" chip navy 40% with blur); description (4 lines, "Read more" dialog) beside amenities (icon and label, wrapping, "View all amenities"); "Rooms" with a chip row (dates, guests, rate filters) and the room-card rail (360 wide, 3:2 carousel with arrows on hover, title, beds and guests line, then once dates exist Kasa's price block: total underlined first, per night right, a struck-through rate only if Duffel sends one, "Only 2 left" in warn colour if Duffel's quantity says so, footer "Room details" link and "Select" navy button); "Good to know": check-in and check-out cards and the hairline policy accordion (cancellation from Duffel first, then payment, children and beds, pets, accessibility), single open, 200ms ease-out; reviews rail only if Duffel provides reviews; location map with "Getting around" text; "Other hotels in Lisbon" (three cards). 390: grid becomes one wide photo over four square thumbs; rails show one card and a peek; the selected room shows the sticky bottom price bar ("$812 total, 4 nights", "Continue"). Must look plainly different from Overwing's hotel page: Landfall's type, palette, pinned card, price block and photo rule decide that.
- Guest form (/hotels/[hotel]/guests): one column plus the sticky summary (hotel thumb, room, dates, nights, total with breakdown, cancellation line); lead guest fields, special requests textarea; sticky price bar at 390.

### Account [invented]
- Register, Log in, Forgot password, Reset password: a split page at 1440 [invented]: left half a water photo of the current slide's city (full height, radius 0 0 0 0, the image rule), right half a 440 form column centred: H1 Newsreader 36, fields 56px with labels, a show-password toggle, the primary pill full width, secondary links underneath. Errors inline. 390: photo becomes a 160px strip with rounded lower corners above the form.
- Profile (/account): one 680 column: personal details card, saved travelers list (rows with Edit), password change, sign out. Hairline sections, no sidebar.
- My bookings (/bookings): H1 "My bookings", tabs Upcoming and Past (text tabs with the landfall line). Next trip at the top as a wide card: the destination's water photo left (1:1 at 390 on top), route with the landfall line, dates, reference, status chip (Confirmed in success tint, Ticketed, Cancelled in muted), "View booking". Then the rest as rows. Empty state: "No trips yet" with a water photo and "Start a search". 
- Booking detail (/bookings/[ref]): reference panel, itinerary timeline, travelers, paid total with breakdown, documents list (e-tickets as download rows with file size), "Manage this booking" limited to what Duffel supports (cancel if allowed, with the refund amount shown before confirming).

### Pages
- About and Contact: Kasa text styles in a 680 column; About opens with a 21:9 water photo (radius 16) and H1; body 18/1.6 (Albert Sans); every client fact a placeholder until supplied (CLIENT COPY REQUIRED comments, nothing invented). Contact: phone and email large (V10 sizes), support hours placeholder, a contact form (name, email, booking reference optional, message) with a real status message and no fake success.
- Terms and Privacy: 680 column, H1, a "Last updated" line, H2 per section, body 17/1.65, a sticky contents list at 1440 (left, 240) that becomes a "Contents" disclosure at 390. Legal text from the client or their lawyer only.
- 404 and error: the hero treatment at 60vh with a water photo, H1 "This page has sailed", one line, the search card under it [invented].

### Email [invented]
600px single column, white, wordmark at the top with its landfall line drawn as a 2px image-free border, H1 in Georgia (Newsreader fallback), reference block, itinerary rows, total, a navy button. Events: booking confirmed, ticket issued, payment failed, booking cancelled, schedule changed (if Duffel sends it).

## 2c. Image direction
- The rule: every destination photo shows the city where it meets the water (harbour, river, bay, canal, ferry view), with sky in the top third where text sits. Views from the water where stock allows. Hotel and room photos are Duffel's, shown as supplied (no grade, no crop beyond the slot).
- Crops by focal point (set per photo: Lisbon 46/58, Cape Town 40/62, New York 62/55, keeping the New York spire clear of the subline). One aspect ratio per section: hero full-bleed, destinations 8:5, promo rows 4:3, account and confirmation 21:9.
- One grade on studio and stock photos only (--fx-grade: navy palette calms the skies to one blue; Harbour warms them). Never on Duffel photos or airline logos.
- Never shown above native size: hero photos ship 960/1600/2400 WebP; sizes use the photo's aspect so tall viewports fetch a wide enough file ("(min-aspect-ratio: 3/2) 100vw, 150vh"; the New York panorama "(min-aspect-ratio: 2/1) 100vw, 205vh"). The New York original is 2880x1411: about 1.5x at 1440x900, 1x at 1x DPR. Replace it if the client wants a sharper 2x.
- Text over photos, measured on all three hero photos with the text hidden, at 390, 1024 and 1440 (2nd percentile of the pixels behind each block, WCAG 2.x against #FDFDFB): headline 7.3 to 9.1; subline 5.7 to 9.2; tabs 4.9 to 16.1; caption place 5.1 to 14.0 and fare 9.3 to 14.4. Single darkest-pixel minimums: New York subline 3.9 at 1440 (the tower's spire), Lisbon caption place name 4.4 at 1440. Scrim at 1440: flat ink 16%, top fade 66% to 30% at 38% to 0 at 62%, bottom haze 30% over 26%, a corner fade 70% under the caption. Below 1025: top fade 72% to 46% at 44% to 0 at 70%, ink 14%, and the tabs and caption sit on frosted ink panels (64%, 8px blur), because the lower photo is bright city. Any new hero photo must be re-measured the same way (tools in landfall/prototype/tools/).

## 3. Tokens
All values in landfall/design/tokens.css, pasted into the prototype's global.css.
- Palettes: P-N Landfall navy (default) and P-H Harbour gold (alternate) as swappable role sets; ratios beside every token. Roles: navy for every call to action on light grounds and the dark bands; bright accent for highlights on navy and photos and for calls to action on navy (navy text on it); accent for focus, links and the landfall line on light; one tint for every interactive surface; state colours shared.
- Type: Newsreader (SIL OFL) for H1, H2 and destination city names only, weight 400, optical size 72, upright; Albert Sans (SIL OFL) for everything else, 400/500/600, tabular figures for prices, times and references. T2 fallback (Albert Sans only) is a one-line token swap: set --f-display to --f-ui and headings to 500 with -0.025em. Scale: hero 40 to 60, H1 32 to 42, H2 26 to 36, city 22 to 26, lead 16 to 20, body 16, small 14, label 12, button 15. No uppercase anywhere; sentence case; no full stops in headings.
- Space 4px base; band padding 56 to 96; container 1248.
- Radii: 8 fields and chips, 12 buttons inside search surfaces and the compact bar, 16 cards and the search card, 24 destination cards, 32 to 48 band joins, pill for every other button.
- Motion: --ease-settle (Kasa overshoot) for header and compact bar 400ms; --ease-reveal for word reveals (600ms, 45ms stagger) and panels (200ms); crossfade 900ms every 6.5s; settle zoom 1.06 to 1 over 7s; scroll zoom to 1.125 over the hero.
- Next.js: import tokens.css once in the root layout; next/font/local for the two woff2 files with variable names --font-newsreader and --font-albert, mapped in --f-display and --f-ui; data-palette on <html> from NEXT_PUBLIC_PALETTE (navy on 3003, harbour on 3004, per the redesign note).

## 4. Components
- Wordmark (placeholder): lowercase "landfall" in Newsreader 500 at 26px with the landfall line running 16px past the word; the line's land segment is bright teal on photos, teal on white.
- Buttons (Varun V9): pills, sentence case 15/600, small arrow, quiet hover (label breathes 8px wider over 1s, arrow nudges 4px, faint top sheen), press .97. Fill follows the ground: navy on white, bright teal with navy text on navy, ghost outline on photos. Ruling (2a, conflict 5): buttons inside a search surface (hero card, 390 stacked card, sheet footers, compact bar) use that surface's inner radius (12px in the card, 8px in the compact bar); every other button is a pill. The header Sign in pill does not breathe (it would push My bookings).
- Search card (Kasa): fields 56px with a 12px label (icon plus word) over a 16/500 value; placeholder values in muted 400; hover mist; open field mist plus a 1px navy inset; invalid field label in error red; dividers hairline 40px tall at 1440, full-width rows at 390, bordered cells at 641 to 1024. Swap is a 36px round button with a 44px hit area between From and To. Validation: at 1440 a white chip under the card with a red dot and the message; at 390 the missing field's sheet opens.
- Panels and sheets (Kasa): one surface with the card at 1025 and up; full-screen sheets below with a title (Newsreader 24), a 44px close and a fixed footer (Clear and Done). Place list rows 60px with a 42px tile, name, country and code. Calendar: two months, 40px day circles, navy ends, mist range, past days off, today ringed, one tab stop with arrow keys. Steppers: 44px round mist buttons, live counts, Duffel limits (9 travelers, one infant per adult).
- Tabs: text tabs with an icon; the selected one gets the landfall line; roving tabindex and arrow keys.
- Cards: radius 16, hairline border, Kasa's soft long shadow (0 14 16 -2 ink 4%); hover changes the border only. Destination cards are the one exception (navy, radius 24, European Sleeper).
- Price block (Kasa price rule, everywhere a price shows): total first, 18 to 22/600 underlined (the underline opens the breakdown), the unit price second in 14 muted, "taxes and fees included" always present; a struck-through price only if the API sends one; scarcity only from API quantities, in warn colour.
- Chips: 42px, radius 8, mist fill (Kasa), for filters and room options. Status chips 28px, radius pill, tinted by state.
- Accordion (Kasa): hairline rows 75px, topic icon, plus and minus, single open, 200ms ease-out.
- Dialogs (Kasa): centred, radius 16, ink 40% backdrop with blur, Newsreader title, 44px round close, focus trapped.
- Footer: see Chrome. Eyebrows: none.

## 5. Motion
- Load: headline words rise out of an 8px blur (Kasa word reveal, 600ms, 45ms stagger, from 120ms); subline 380ms, tabs 480ms, card 560ms, caption and pause 900ms, each fading up 12px over 700 to 900ms. Nothing blocks the search.
- Hero: crossfade 900ms every 6.5s; each photo settles from 1.06 to 1 over 7s; the whole photo zooms to 1.125 as the hero scrolls away (V5). The pause button stops all three. Paused while the tab is hidden.
- Header and compact bar: 400ms with Kasa's small overshoot; caption, pause and tabs fade out before the header or the docked bar can cover them.
- Panels 200ms height ease-out at 1440; sheets rise 24px and fade over 200 to 400ms on phones; the swap icon turns 180 degrees.
- Section headings: Kasa word reveal once in view.
- Destination cards: photo 1.1 over 500ms, arrow nudges 4px.
- Reduced motion: no crossfade (first photo, paused, with a Play button), no settle or scroll zoom, no word reveals, transitions at 1ms, everything visible at once. Kasa's own carousel ignores reduced motion; Landfall does not.

## 6. Mobile (390)
Designed first. Header 66px with icons; menu as a sheet. Home hero: headline two lines, the caption chip and pause above the tabs pill, the stacked search card docked 32px over the photo with Search inside the first 844px screen; every field opens a full-screen sheet. Destinations as 80px rows. Inner pages: the compact search pill pinned; results with Filters and Sort chips opening sheets with a fixed result-count button; detail, passenger, guest and hotel pages with a sticky bottom price bar (total plus one action) that never covers form errors (it sits above the keyboard's safe area and the page gets matching bottom padding); checkout keeps Pay inside the form; tables become stacked rows; footer link columns in two columns. Tap targets 44px minimum. Tested in desktop Chromium at 390 only; touch not emulated.

## 7. Asset plan
- Hero (built): lisbon-alfama-river, cape-town-waterfront, new-york-harbour (credits in landfall/prototype/assets/images/credits.md).
- Destinations (built): lisbon-tagus-golden, rome-tiber-bridge, new-york-brooklyn-night, mexico-city-xochimilco, tokyo-bridge-night, cape-town-camps-bay.
- Still needed by the Developer, same rule and licence check: three promo-row photos (a ferry deck, a quay at dusk, a harbour cafe), About (a harbour at first light), account split pages (reuse the hero set), 404 (a quay), confirmation and booking cards (the destination's own photo: reuse the destination set). Never Overwing's photos.
- Hotel and room photos: Duffel Stays. Airline logos: Duffel. No illustration placeholders, no empty boxes, no labels.
- Fonts: assets/fonts (latin subsets; add latin-ext if the market needs it) with their OFL licence files.

## 8. Anti-slop check
- Breadcrumbs: none on home; only on hotel detail if the build needs them (deep page), as plain text links.
- Heading left, body right: not used; the hotel FAQ (Kasa's split) becomes a single column.
- Italic or serif accent words in headlines: none; Newsreader sets whole headings upright at 400.
- Generic typography: type is the reference's approach (Kasa's serif and sans) in free faces; no Inter, Roboto, system fonts or Instrument Serif.
- Purple gradients, three icon cards: none; the promo rows are photo rows.
- AI attribution: none in code, comments or meta.
- AI eyebrow: none; Kasa's eyebrows are dropped.
- Full-stop headlines: none.
- Em dashes: none in copy, code or comments.
- Generic AI phrases: none (copy deck to check).
- Dot-separated keywords, numbered labels: none; the caption uses commas.
- Off-brand glowing call to action: none; no glows.
- Invented logo when the client has one: the client has none; the wordmark is a declared placeholder.
- Giant outlined footer wordmark: none.
- Robot chat icon: none (no chat in Phase 1).
- Visible placeholder labels: none; stock photos fill every slot; client facts are marked in the footer demo notice only.

## 9. Conflicts resolved
1. No logo: palettes sampled from the Lisbon hero photo with Varun's role structure (V6), ratios written down.
2. Headline capitals (V+R, unsplit): dropped; Kasa sets sentence case (2a ruling).
3. Search placement: high under the headline at 1440 (Kasa wins on layout); docked over the photo's lower edge at 390 (European Sleeper supports it) (2a ruling).
4. Hero call to action (V5's trust badge and "Scroll to discover"): the search is the call to action; the arrival caption sits where Kasa's credit line sits.
5. Buttons: pills (V9) except inside search surfaces, which keep the surface's inner radius (2a ruling).
6. Eyebrows: Kasa's are dropped (anti-slop wins).
7. Motion: Kasa's word reveal and overshoot kept; V5's slow zoom added on the hero; Kasa's reduced-motion gap fixed.
8. Header over the photo on phones: Kasa's frosted strip would turn invisible over the white card; Landfall's turns solid as soon as it leaves the photo (critic round 1).
9. Text over bright city at 390: frosted ink panels for the tabs and caption instead of a heavier scrim, so the photo stays bright (finish pass, measured).
10. Price display: Kasa hides price until dates exist; the client asked for clear pricing, so every pre-search surface shows a real "from" fare from the mock data with its basis stated, and results show the total first.
11. Tablets: Kasa's phone stack stretched badly at 768 to 1024 (critic); a two-column card is used there.
12. Hotel page: both designs draw on Kasa (Varun's pick). Landfall keeps Kasa's whole page; Overwing grafts Kasa's grid into Hipcamp's shell. Different type, palette, search, price block and photo rule keep them apart.

## 10. Decisions for Varun (at most 5)
1. The serif: T1 (Newsreader headings) was chosen by the Chief Officer; switch to T2 (Albert Sans only) if the client reads "a clean, readable font" literally.
2. The arrival caption shows a fare from London (the mock origin); in the live app it should follow the visitor's last origin, or be dropped if the client sells from many origins.
3. The New York hero is a 1.5x source at 1440; keep it, or replace it with a sharper harbour view.
4. Three crossfading cities or one: the crossfade is Kasa's signature; one photo is calmer and cheaper to keep measured.
5. Whether to show a struck-through "was" price and scarcity lines at all: they appear only when Duffel sends the data, but they can read as sales pressure.
