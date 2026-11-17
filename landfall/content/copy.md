# Copy: travel-booking, Landfall (working name, a placeholder)
Copywriter, 2026-11-11. Written from logs/redesign-note.txt, brief.md (with "Client feedback, 2026-11-11"), landfall/design/design-spec.md, handover.md and choices.md, the prototype's working copy (landfall/prototype/index.html and global.js), build/handover.md's Copywriter items, and the shared deck content/copy.md. Organized by page, then by section, using Landfall's spec names. This deck wins over any working copy in the spec or the prototype.

## Read this first
- **This deck sits on top of content/copy.md.** "As content/copy.md, X" means: take section X of content/copy.md as written, apply the global swaps below, and change only the lines listed under it. Anything Landfall's spec has that content/copy.md doesn't is written out in full here.
- **Global swaps.** Apply these to every line borrowed from content/copy.md, including lib/mock, lib/text.ts and lib/emails.ts strings:
  1. "Overwing" becomes "Landfall" everywhere: meta titles ("| Landfall"), the copyright strip, email sender name, subjects and bodies.
  2. "Log in" becomes "Sign in", "Log out" becomes "Sign out", "Sign up" becomes "Create an account", and the same in lower case ("log in to save this booking" becomes "sign in to save this booking"; the toast "You've logged out" becomes "You've signed out"). Landfall's header, menu and profile say Sign in and Sign out (spec, Chrome and Account).
  3. "Bookings" as the name of a place becomes "My bookings" ("View in Bookings" becomes "View in My bookings"; "check Bookings or your email first" becomes "check My bookings or your email first"; "Go to Bookings" becomes "Go to My bookings").
  4. Date ranges in the search card, the compact bar and the calendar hints keep both months: "Nov 20 to Nov 27", never "Nov 20 to 27" (choices.md 2a, so Dates never truncates). Longer forms ("Fri, Nov 20 to Fri, Nov 27") are unchanged.
  5. The price rule (spec, Price block): the total comes first, the unit price second, and "taxes and fees included" is always there. Any content/copy.md line that leads with the nightly price ("$186 a night, $744 total") turns round: "$744 total", then "$186 per night", then "taxes and fees included".
  6. The expiry line names a clock time: "Price valid until 10:42". The spec's working word "held" stays "valid": Duffel offers aren't held, they expire (content/copy.md, note 5).
- **Placeholders.** Landfall is a working name; the wordmark, the phone +1 (555) 010-0199, the email hello@example.com, the market (English, USD, US spelling, 24-hour times), the London origin and every fare, flight, hotel and booking are placeholders or mock data, exactly as in content/copy.md. Company details for the footer's trust row are not invented: the row says they will appear before real bookings (see Footer).
- **Landfall's own language.** None of the other design's imagery carries over. Landfall's one idea in words is arriving: the city where it meets the water. It shows in two headlines (hero, pre-footer). Everything a visitor taps or reads to book stays plain.
- **Style rules held.** Sentence case headlines, no full stops, no italics, no eyebrows. No em dashes or en dashes. Ranges use "to". None of: elevate, seamless, unlock, unleash, nestled, testament, journey, effortless, hassle-free, curated, discover, embark, hidden gems, vibrant, bustling, breathtaking, stunning, peace of mind, at your fingertips. No "best price", "lowest price" or "no booking fee" claims (the last was ruled out by the Chief Officer on 2026-11-11).

---

# Shared chrome (every page)

## Header
- Wordmark: visible "landfall" (lowercase, the placeholder wordmark). Accessible name: "Landfall, home".
- Main nav (accessible name "Main"): Flights, Hotels, Destinations, Help.
  - Flights and Hotels open the home search on that tab. Destinations goes to Popular destinations on the home page. Help goes to Contact.
- Right side: My bookings; pill "Sign in".
- Signed in, the pill reads "Your account" (accessible name "Your account, Maya Okafor"). Its menu: My bookings, Profile, Sign out.
- 390: account icon, accessible name "Sign in or create an account" (signed in: "Your account"); menu icon, accessible name "Menu".

## Menu sheet (below 1025)
- Accessible name: "Menu". Close button: "Close menu".
- Group "Book": Flights, Hotels, Destinations.
- Group "Your trips": My bookings, then two full-width pills "Sign in" and "Create an account". Signed in, the pills become rows: Profile, Sign out.
- Group "Help": Help and contact, About us, Terms and conditions, Privacy policy.

## Skip link
- Skip to content

## Pinned compact search (inner pages, and home after the hero)
- Region name: "Your search".
- Flights segments: route "London to Lisbon"; dates "Nov 20 to Nov 27" (one way: "Nov 20, one way"); party "2 adults, Economy".
- Hotels segments: route "Hotels in Lisbon"; dates "Nov 20 to Nov 24"; party "2 adults, 1 room".
- Empty segments (before any search): route "Where to?" (hotels: "Which city?"); dates "Add dates"; party "1 adult, Economy" (hotels: "2 adults, 1 room"). These replace the prototype's "Anywhere to anywhere", "Hotels anywhere" and "Any dates".
- Segment accessible names: "Change route, London to Lisbon"; "Change dates, Friday, November 20 to Friday, November 27"; "Change travelers, 2 adults, Economy".
- Icon button: accessible name "Change search". On the home page, where it scrolls back to the hero card: "Go to the search".
- 390 pill: line 1 (bold) "London to Lisbon"; line 2 "Nov 20 to Nov 27, 2 adults". Hotels: "Hotels in Lisbon" / "Nov 20 to Nov 24, 2 adults". Accessible name: "Change search: flights, London to Lisbon, Friday, November 20 to Friday, November 27, 2 adults, Economy".

## Toasts and system messages
As content/copy.md, Toasts and system messages, with the Sign in swap:
- You've signed out
- Your session has ended. Sign in again to carry on where you left off.
- New: Booking canceled (used on Booking detail)

## Pre-footer band
- Headline (H2): Where will you land next?
- Button: Start a search (scrolls to the hero search and puts focus in From)
- No supporting line. The band's one job is to send people back to the search, and every fact it could repeat is already on the page above it (build/handover.md, "home facts repeated").

## Footer
Row 1
- Phone: +1 (555) 010-0199 (link accessible name "Call +1 (555) 010-0199")
- Email: hello@example.com
- Back to top

Row 2, link columns
- Book: Flights, Hotels, Destinations. Flights-only: Flights, Destinations.
- Your trips: My bookings, Profile, Sign in (signed in: Sign out).
- Help: Contact us, Change or cancel a booking (links to My bookings; signed out, it asks you to sign in first).
- Company: About us, Terms and conditions, Privacy policy.

Row 3, trust row
- Company line: Company name, registered address and registration number will be shown here before the site takes real bookings.
  - In code, three CLIENT COPY REQUIRED comments mark the legal entity, address and registration number slots. Nothing is shown in their place until the client sends them; no invented entity, address or number, and no visible placeholder label.
- Payments: Card payments by Stripe
- Card marks (images, alt text is the brand name): Visa, Mastercard. Both are cards Stripe takes by default; the client's accepted brands are a new question (Questions, 16).

Row 4
- Demo notice: This is a demo build. Landfall is a working name, and the logo, photos, contact details, company details, flights, hotels and prices are placeholders. No booking is real and no card is charged.
- Flights-only demo notice: This is a demo build. Landfall is a working name, and the logo, photos, contact details, company details, flights and prices are placeholders. No booking is real and no card is charged.
- Copyright: © 2026 Landfall
- Credit: Created with love by Digital Heroes
- Footer photo (the hero photo at 12%): decorative, alt="".

---

# Home
Meta title: Landfall | Flights and hotels, priced in full
Meta description: Search flights and hotels, compare every option by its full total with taxes and fees included, and pay by card through Stripe.

## Hero
- Headline (H1): Land somewhere new
- Subline: Flights and hotels, with taxes and fees in every price
  - Kept word for word from the prototype: the scrim was measured on this exact text box on all three photos. A longer line would need re-measuring.
- Flights-only subline: Flights with taxes and fees in every price
- Tabs (tablist name "What to search"): Flights, Hotels. Flights-only: no tabs.
- Pause button: "Pause the photos"; when paused, "Play the photos". With reduced motion it starts paused and reads "Play the photos".

### Arrival caption (one per photo, changes with the photo)
| Photo | Place | Fare line | Button |
|---|---|---|---|
| Lisbon | Lisbon | London to Lisbon, return from $412 | Fly here |
| Cape Town | Cape Town | London to Cape Town, return from $1,138 | Fly here |
| New York | New York | London to New York, return from $684 | Fly here |
- "Fly here" accessible name: "Fly here: London to Lisbon, return from $412 for one adult, taxes and fees included". Visible, the fare basis sits in the note under Popular destinations; the accessible name carries it in full because a screen reader may never reach that note.
- After "Fly here" fills To and opens Dates, the status line says: Lisbon added. Now choose your dates.
- 390 chip (one line): "Lisbon, return from $412" with the arrow. Same accessible name as above.
- The caption is not a live region: it must not announce every crossfade.
- When the visitor has searched before, "London" becomes their last origin ("New York to Lisbon, return from", with that route's fare). Until the live app can price that, show the London fare (spec, decision 2 for Varun).

### Search card, flights
- From: label "From", empty value "City or airport", set value "London (LHR)".
- Swap button: accessible name "Swap From and To".
- To: label "To", empty "City or airport", set "Lisbon (LIS)".
- Dates: label "Dates", empty "Add dates", set "Nov 20 to Nov 27"; one way "Nov 20, one way"; across months "Nov 28 to Dec 3".
- Travelers: label "Travelers", value "1 adult, Economy". Examples: "2 adults, Economy"; "2 adults, 1 child, Business"; "3 travelers, Premium" (the cell shortens Premium economy to "Premium"; the panel, results and summary use the full name).
- Button: Search flights

### Search card, hotels
- Destination: label "Destination", empty "City or area", set "Lisbon".
- Dates: label "Check in and out", empty "Add dates", set "Nov 20 to Nov 24".
- Guests and rooms: label "Guests and rooms", value "2 adults, 1 room" (with children: "2 adults, 1 child, 1 room").
  - This replaces the prototype's "Rooms and guests" and "1 room, 2 adults", so the field reads the same way as every results line, summary and email ("2 adults, 1 room").
- Button: Search hotels

### Field panels and phone sheets
- Close button on every panel and sheet: "Close".
- From panel title: Flying from. To panel title: Flying to. Search box label and placeholder: "City or airport". List heading: Cities and airports. Row: "London Heathrow", second line "London, United Kingdom", code "LHR".
- Destination panel title: Staying in. Search box: "City or area". List heading: Cities. Row: "Lisbon", second line "Portugal".
- No match (both): No places match "Lisbonn". Check the spelling or type a three-letter airport code. (Hotels: No cities match "Lisbonn". Check the spelling.)
- Dates panel title: Dates (hotels: Check in and out).
  - Flights hints: "Choose your outbound date", then "Now choose your return date, or press Done for a one-way trip", then "Nov 20 to Nov 27, return". One way after Done: "Nov 20, one way".
  - Hotels hints: "Choose your check-in date", "Now choose your check-out date", then "Nov 20 to Nov 24, 4 nights".
  - Buttons: Clear, Done. Month arrows: "Previous month", "Next month".
  - Day accessible names: "Friday, November 20, 2026". Picked ends add ", outbound" and ", return" (hotels: ", check-in" and ", check-out"); today adds ", today"; past days are disabled and add ", unavailable".
- Travelers panel title: Travelers.
  - Adults, help "12 and over". Children, help "2 to 11". Infants, help "Under 2, on a lap". (See Notes for the Developer, 2: the prototype's "18 and over" and "2 to 17" change to these.)
  - Stepper buttons: "Fewer adults", "More adults", "Fewer children", "More children", "Fewer infants", "More infants".
  - Note under the steppers, always shown: Up to 9 travelers, and one infant per adult.
  - When a limit stops a stepper, the note becomes: "That's 9 travelers, the most you can book at once." or "Each infant travels on an adult's lap, so add an adult first."
  - Cabin class (legend "Cabin class"): Economy, Premium economy, Business, First.
  - Button: Done
- Guests and rooms panel title: Guests and rooms.
  - Adults, help "18 and over". Children, help "0 to 17". Rooms, help "Up to one per adult".
  - Stepper buttons: "Fewer adults", "More adults", "Fewer children", "More children", "Fewer rooms", "More rooms".
  - Limit note: Up to 8 rooms and 16 guests in one search. (The prototype's limits. Developer to check against Duffel Stays.)
  - Button: Done
- Phone sheet footers: Clear, Done.

### Validation (white chip under the card at 1440; at 390 the missing field's sheet opens with the line at its top)
- Choose the city or airport you are flying from.
- Choose where you are flying to.
- Choose a destination different from where you start.
- Choose "Paris" from the list, or type a city or airport code.
- Choose your travel dates.
- Choose the city you want to stay in.
- Choose your check-in and check-out dates.

### Status line on submit (polite live region)
- Searching return flights from London to Lisbon, Nov 20 to Nov 27
- One way: Searching one-way flights from London to Lisbon, Nov 20
- Hotels: Searching hotels in Lisbon, Nov 20 to Nov 24

### Hero photo alts (only the current photo is exposed; the other two are aria-hidden until they show)
- Lisbon: Lisbon's Alfama roofs running down to the Tagus under a deep blue sky, a cruise ship at the quay
- Cape Town: Table Mountain above Cape Town's waterfront, seen across the harbour
- New York: Lower Manhattan's skyline seen from the harbour on a clear day
(The Art Director's alts, checked against credits.md; they describe the photos as sourced.)

## Popular destinations
- Headline (H2): Return fares from London
  - When the visitor has searched before: "Return fares from New York" (their last origin).
  - Replaces the working "Cities worth the crossing". This one says what the cards are for, which is the client's "clear pricing".
- Note (14px, muted): The lowest return fare we've found for one adult, taxes and fees included. Fares change often.
- Cards (the whole card is one link that fills To and opens Dates):

| City | Fare line | Card accessible name |
|---|---|---|
| Lisbon | Return from $412 | Lisbon, return flights from $412. Search flights to Lisbon. |
| Rome | Return from $389 | Rome, return flights from $389. Search flights to Rome. |
| New York | Return from $684 | New York, return flights from $684. Search flights to New York. |
| Mexico City | Return from $1,046 | Mexico City, return flights from $1,046. Search flights to Mexico City. |
| Tokyo | Return from $1,212 | Tokyo, return flights from $1,212. Search flights to Tokyo. |
| Cape Town | Return from $1,138 | Cape Town, return flights from $1,138. Search flights to Cape Town. |

- Inside the card link the photo is decorative (alt=""): the link's name already says everything. Wherever the same photo appears on its own (confirmation strip, My bookings cards, no-results panel), use these alts, checked against each photo:
  - Lisbon: Lisbon's hillside of pale houses and red roofs falling to the wide Tagus in late golden light
  - Rome: A lit stone bridge with statues over the Tiber at dusk, its lamps reflected in the water
  - New York: Brooklyn Bridge and the lit towers of Lower Manhattan across the East River at night
  - Mexico City: A painted trajinera boat moored on a Xochimilco canal, trees reflected in the still water
  - Tokyo: A lit arched bridge over a Tokyo river at night, office towers behind it
  - Cape Town: Camps Bay's white beach and houses under the Twelve Apostles at sunset
- After a card fills To, the status line says: Lisbon added. Now choose your dates.
- No "See all destinations" link: the mock data holds six cities.

## What happens when you book
Three alternating rows, photo one side, text the other. Facts from the scope only.
- Section headline (H2): What happens when you book

Row 1
- H3: You see the full total first
- Text: Every flight and room shows the total for the whole trip before anything else, with taxes and fees already in it, and the price per traveler or per night under it. Just before you pay, we check that price again with the airline or hotel, so the total you agree to is the one that's really there.
- Flights-only text: Every flight shows the total for the whole trip before anything else, with taxes and fees already in it, and the price per traveler under it. Just before you pay, we check that price again with the airline, so the total you agree to is the one that's really there.
- Photo alt (a ferry deck, still to source): Passengers at the rail of a ferry deck, a harbour city coming closer across the water

Row 2
- H3: Your card details go to Stripe
- Text: Card payments run through Stripe. You enter your card in Stripe's payment form on our checkout page, so your card number goes to Stripe, not to us. If your card is declined, nothing is charged, and you can try again or use another card on the same page.
- Photo alt (a quay at dusk, still to source): A quiet quay at dusk, moored boats and the first lights coming on along the water

Row 3
- H3: Your trip stays in My bookings
- Text: When the booking is confirmed, your booking reference and itinerary come by email. Sign in and My bookings keeps every trip, upcoming and past, with the e-ticket numbers the airline issues, on your phone or your computer. If your plans change, contact us with your booking reference.
- Photo alt (a harbour cafe, still to source): A table at a harbour cafe with the water and moored boats behind it

(The three photos aren't sourced yet. Check each alt against the photo the Developer picks and adjust.)

## Pre-footer band and footer
See Shared chrome.

---

# Flights

## Searching state
As content/copy.md, Searching state, with these changes:
- Status line (polite live region): Searching flights from London to Lisbon
- After 5 seconds (the spec's timing): Still looking. Some airlines take a few seconds to answer.
- Skeleton rows: hidden from screen readers.

## Results
As content/copy.md, Results, with these changes:
- Meta title, H1, meta line, count: as content/copy.md.
- Sort select, label "Sort by". Options: Best; Cheapest; Fastest; Earliest departure. Descriptions: as content/copy.md, plus "Earliest departure: first outbound flight of the day first".
- No quick chips (Nonstop, Under 6 hours, Morning departures): Landfall's spec has none.
- No price note above the list: every row already says "taxes and fees included", so the note would repeat it.
- Filter column groups: Stops, Airlines, Departure time, Duration, Price, as content/copy.md's Filter column (the spec lists all five).
- 390: chips "Filters" ("Filters, 2" when two are set) and "Sort" ("Sort: Best"). Sheet titles "Filters" and "Sort by". Fixed footer: "Clear all" and "Show 86 flights" (filtered: "Show 24 flights"; none left: "No flights match", disabled).

Result row
- Airline: name beside the logo ("Kittiwake Air"). Codeshare line as content/copy.md ("Operated by Tern Atlantic").
- Leg line: departure "07:05 LHR"; on the landfall line "2h 45m, nonstop" (with a stop: "5h 10m, 1 stop in Madrid"); arrival "09:50 Lisbon". Next day: "+1", accessible text "arrives the next day".
- Price block: "$1,098.60 total" (underlined; opens the breakdown), "$549.30 per traveler", "taxes and fees included".
- Button: Select
- Row accessible name: as content/copy.md, ending "$1,098.60 total for 2 travelers, $549.30 per traveler, taxes and fees included."
- Warnings: as content/copy.md (Change of airport in London; Overnight layover; Long layover).

Price breakdown (dialog at 1440, sheet at 390)
- Title: Price breakdown
- Rows: Flights, 2 adults; Taxes and fees; Total. Under the total: "$642.30 per traveler". Values from the offer (demo Classic: $1,068.00, $216.60, $1,284.60).
- Line: This is the price for everyone on the booking. We check it again with the airline before you pay.
- Close: "Close"

Show more flights (build/handover.md item)
- Pill: Show 20 more flights
- When fewer than 20 are left: Show the last 6 flights
- Live region after loading: Showing 40 of 86 flights
- When the list is complete, a line under it: That's all 86 flights.

## No results, search failed, fare changed, offer expired
No flights on the dates
- Heading (H2): No flights on these dates
- Body: as content/copy.md ("We couldn't find flights from London to Lisbon on Fri, Nov 20. Try a day or two either side.")
- Buttons: Change dates; Search nearby dates (searches one day either side of each date)
- Photo above: the destination's photo, alt as Popular destinations.
Filters hide everything: as content/copy.md.
Search failed: as content/copy.md, Searching state, "Search failed" (heading "We couldn't reach the airlines just now", button "Try again"), in Landfall's panel.
Sold out since the search: as content/copy.md.

Fare went up (inline banner above the summary)
- Heading: The price went up by $18.40
- Body: The airline changed the fare after you searched. Your new total for 2 travelers is $1,303.00, taxes and fees included.
- Old total, struck through: $1,284.60. Accessible text: "Was $1,284.60, now $1,303.00".
- Buttons: Continue at $1,303.00; Back to results
- (The spec's working "$24.10 per traveler" and "$1,146.80" are replaced by content/copy.md's mock figures, which the shared backend returns. The banner leads with the total, per the price rule.)

Fare went down: as content/copy.md, with heading "The price went down by $12.00" and the old total struck through.

Offer expired (dialog)
- Title: This price has expired
- Body: Airline prices are only valid for a short time after a search. Refresh to get the current price for this flight.
- Buttons: Refresh the price; Back to results
- After a refresh with the same price, the dialog closes and the summary says: Price confirmed. Valid until 11:12.
- After a refresh with a new price: the fare went up or down banner. If the flight is gone: the sold-out copy.

Expiry line (booking summary)
- Price valid until 10:42
- Under 5 minutes (warn colour): Price valid until 10:42. Less than 5 minutes left.
- Screen reader, announced once at 5 minutes: Your price is valid for 5 more minutes.
- Times are the visitor's local time.

## Flight details and fares
As content/copy.md, Flight details and fares, with these changes:
- Button in the summary: Continue to passengers (390 bar: "Continue").
- Itinerary rows, layover band, airport change and overnight rows: as content/copy.md. Layovers read "1h 30m in Madrid (MAD). Change planes." (the mock data's figure, not the spec's working "1h 50m").

Choose your fare (H2)
- Intro: as content/copy.md.
- Fare rows are radio choices (no "Choose Light" buttons):
  - Light, "Included in the price"
  - Classic, "+$186.00 total"
  - Flex, "+$414.00 total"
- Radio accessible names: "Light fare, included in the price"; "Classic fare, $186.00 more in total"; "Flex fare, $414.00 more in total".
- Inclusion lines per fare: from content/copy.md's fare table (tick for included, plus for a fee, muted "Not refundable").

Fare conditions (accordion under the fares; text follows the chosen fare, Classic shown)
- Changes: Changes before departure cost $75 per traveler, plus any difference in fare. (Light: the same. Flex: you pay only any difference in fare.)
- Refunds: This fare can't be refunded. (Flex: Refund before departure, minus $50 per traveler.)
- Baggage: Each traveler can bring 1 small bag under the seat, 1 cabin bag up to 10 kg and 1 checked bag up to 23 kg. (Light: 1 small bag under the seat; cabin and checked bags cost extra.)
- Seats: Classic includes a standard seat of your choice, chosen with Kittiwake Air after you book. (Light: the airline assigns your seat at check-in. Flex: any standard seat, chosen with the airline.)
- Note under the accordion: as content/copy.md ("The airline sets these rules. We show them exactly as the airline sends them.")

Booking summary (sticky card)
- Title: Your trip
- Lines: London to Lisbon, return; Fri, Nov 20 to Fri, Nov 27; 2 adults, Classic fare
- Total: $1,284.60 (large). Under it: "$642.30 per traveler", "taxes and fees included".
- Link: See price breakdown (opens the Price breakdown dialog above)
- Expiry line: Price valid until 10:42
- Button: Continue to passengers
- 390 bar: "$1,284.60 total" and "for 2 travelers" on the left, "Continue" on the right. The total is a button, accessible name "$1,284.60 total for 2 travelers. See price breakdown".

## Passenger form
As content/copy.md, Passenger form, with these changes:
- Saved travelers, signed in: chips above the first card, label "Saved travelers". Chip: "Daniel Okafor", accessible name "Fill in Daniel Okafor's details". After a tap: toast "Daniel Okafor's details added". This replaces the "Fill in from a saved traveler" select.
- Card titles: "Adult 1, lead traveler"; "Adult 2"; "Child 1"; "Infant 1, on Adult 1's lap".
- Lead traveler only, after the name fields (contact details move here from checkout):
  - Email. Help: We'll send the confirmation and any changes to this booking here.
  - Phone. Help: Include the country code, for example +1.
- Passport block fields: Passport number; Issuing country (a searchable list); Expiry date (Day, Month, Year).
- Button: Continue to payment. 390 bar: "$1,284.60 total", "for 2 travelers", "Continue".

New errors (build/handover.md item), added to content/copy.md's list:
- Choose a title.
- Choose the country that issued the passport.
- No countries match "Portugall". Check the spelling.
- Enter the passport's expiry date.
- Enter an email address like name@example.com.
- Enter a phone number with its country code.
- Error summary: as content/copy.md ("Check 2 details before you continue"), and it takes focus on submit.

---

# Booking and payment

## Checkout
As content/copy.md, Checkout, with these changes:
- Steps line: Passengers, Payment, Done (hotels: Guests, Payment, Done). The current step is visually marked; accessible text "Step 2 of 3, Payment".
- Signed out line: Have an account? Sign in to save this booking to it.
- Contact details (H2), now a recap: "maya.okafor@example.com" and "+1 (555) 010-0142", with the link "Edit" (back to the lead traveler or lead guest). Line under it: We'll send the confirmation and any changes to this booking here. The email and phone fields and their errors move to the passenger and guest forms.
- Pay button: Pay $1,284.60 (hotels: Pay $744.00)
- Two lines under the button:
  - Card payments by Stripe. Your card number goes to Stripe, not to us.
  - Flights: Your total includes taxes and fees.
  - Hotels: Your total includes taxes and fees. A local tourist tax, if the city charges one, is paid at the hotel.
- Booking summary: as content/copy.md, laid out by the price rule: total first, then "$642.30 per traveler" (hotels "$186 per night, 4 nights"), "taxes and fees included", then the rows behind "See price breakdown". Expiry line: Price valid until 10:42.
- 390 sticky bar: total only, "$1,284.60 total", "for 2 travelers" (no button; Pay stays in the form). Tapping it opens the summary sheet, accessible name "$1,284.60 total for 2 travelers. Show the booking summary". Sheet title: Your trip (hotels: Your stay).

## Payment failed
As content/copy.md, Payment failed. The panel sits at the top of the payment card and takes focus. (The spec's working "No money was taken" stays content/copy.md's "Nothing has been charged.")

## Confirmation
Meta title: You're going to Lisbon | Landfall (noindex). Hotels: You're staying at Casa Lanterna | Landfall (noindex).

Flights
- Photo strip: the Lisbon destination photo, alt "Lisbon's hillside of pale houses and red roofs falling to the wide Tagus in late golden light".
- Success chip: Booking confirmed
- H1: You're going to Lisbon
- Reference panel: label "Booking reference", "K7MQ2D", pill "Copy" (after: "Copied")
- Lead line: London to Lisbon, Fri, Nov 20 to Fri, Nov 27, 2 adults.
- Itinerary: as the flight details page.
- Paid (H2): "Paid $1,284.60", "taxes and fees included", "with Visa ending 4242", and the link "See price breakdown".
- Travel documents (H2): as content/copy.md (e-ticket numbers, and the "issuing" line while they come).
- What happens next (H2), four rows:
  - Your confirmation is on its way to maya.okafor@example.com, with your booking reference and itinerary.
  - Your e-ticket numbers stay in My bookings, with everything on this page.
  - Check in with Kittiwake Air online before you go, using booking reference K7MQ2D, and bring the passport or ID you entered for each traveler.
  - Need to change something? Contact us with your booking reference.
- Buttons: View booking; Search hotels in Lisbon. Text link: Print. Flights-only: View booking; Print.

Hotels
- Photo strip: the Lisbon destination photo (same alt).
- Success chip: Booking confirmed
- H1: You're staying at Casa Lanterna
- Reference: S4T9LW (same panel)
- Lead line, stay card, paid line: as content/copy.md, Confirmation, Hotels (paid line in the price-rule order above).
- What happens next (H2): as content/copy.md's "Before you go" rows, plus first: "Your confirmation is on its way to maya.okafor@example.com."
- Buttons: View booking; Search flights to Lisbon. Text link: Print.

---

# Hotels

## Searching state
As content/copy.md, Searching state (hotels). After 5 seconds instead of 4.

## Results
As content/copy.md, Results (hotels), with these changes:
- Card: name; area and star line "Alfama, Lisbon, 4-star hotel"; three amenity chips ("Free wifi", "Breakfast", "Roof terrace"); price block "$744 total" (underlined), "$186 per night", "taxes and fees included"; button "View rooms".
- Review score, only if Duffel sends one (the mock data has none, so the demo shows none): pattern "8.6 out of 10, 412 reviews", figures from Duffel. Never invented.
- Without dates: button "Add dates for prices" in place of the price block, accessible name "Add dates to see prices for Casa Lanterna".
- Price note above the list, shortened: A local tourist tax, where there is one, is paid at the hotel.
- Map pins show the stay total ("$744"). Pin accessible name: "Casa Lanterna, $744 total for 4 nights".
- 390: map first, chip "Expand map" (expanded: "Show list"). Filters and Sort as chips opening sheets, footer "Show 5 places to stay".
- Photo carousel: as content/copy.md ("Previous photo", "Next photo", "Casa Lanterna, photo 1 of 5").

## Hotel detail
As content/copy.md, Hotel detail, with these changes:
- Meta row: "Alfama, Lisbon" (a link that scrolls to Location), "4-star hotel".
- Grid chip and button: counts follow the photos sourced ("+5 photos"; "Open the photo gallery, 10 photos").
- Description: four lines, then "Read more" (dialog "About Casa Lanterna").
- Amenities (H3): first six, then the link "View all 12 amenities" (dialog "Amenities at Casa Lanterna").

Choose a room (H2)
- Chips: "Fri, Nov 20 to Tue, Nov 24"; "2 adults, 1 room"; "Free cancellation"; "Breakfast included".
- Room card: name; beds and guests line ("1 double bed, sleeps 2, courtyard view"); price block "$744 total" (underlined), "$186 per night", "taxes and fees included"; footer link "Room details"; button "Select".
- Scarcity line, only from Duffel's quantity (warn colour): Only 2 left at this price. The mock data sends none, so the demo shows none.
- Struck-through rate: only if Duffel sends one. Accessible text pattern "Was $820, now $744", figures from Duffel.
- Room details dialog: title is the room name; the spec line, the inclusion rows from the mock data, the price block, button "Select this room".
- Without dates: "Add dates for prices".
- Sold out card and "No rooms left" state: as content/copy.md.
- 390 bar, before a room is chosen: "From $744 for 4 nights" and "Choose a room" (scrolls to the rail). After: "$744 total, 4 nights" and "Continue".

Good to know (H2)
- Check-in and check-out cards, and the accordion rows Cancellation, Payment, Children and extra beds, Pets, Accessibility: as content/copy.md, Policies and the mock data. Cancellation is first.

Reviews
- Only if Duffel provides reviews. Heading (H2): What guests say. Not in the demo.

Location (H2)
- Line: Alfama, Lisbon, Portugal
- Getting around (H3): The Baixa and the riverfront are about ten minutes' walk downhill, and the 28 tram stops at the end of the street. The lane outside has steps, so ask the hotel about step-free arrival if you need it.
- Map alt and credit: as content/copy.md.
- Other hotels' "Getting around" lines: build them from each hotel's mock description only (for example Cais Verde Hotel: "Two minutes' walk from the ferries and the train to the coast."). If a description gives no getting-around fact, leave the H3 out.

Other hotels in Lisbon (H2)
- Three cards in the results card pattern: Cais Verde Hotel ($856 total, $214 per night); Pátio Quinze ($632 total, $158 per night); Ribeira Lofts ($684 total, $171 per night).

## Guest form
As content/copy.md, Guest form, with these changes:
- Lead guest fields: Given names; Family name; Email; Phone (help texts and errors as the passenger form's lead traveler).
- Summary: hotel photo (decorative, alt=""), "Casa Lanterna", "Courtyard Double", "Fri, Nov 20 to Tue, Nov 24, 4 nights", total block "$744 total", "$186 per night", "taxes and fees included", "See price breakdown", and the line "Free cancellation until Nov 17".
- 390 bar: "$744 total", "4 nights", "Continue".

---

# Account

## Create an account, Sign in, Forgot password, Reset password
As content/copy.md, Sign up, Log in, Forgot password and Reset password, with the Sign in swap:
- Create an account: meta title "Create an account | Landfall"; under the button "Already have an account? Sign in".
- Sign in: meta title "Sign in | Landfall"; H1 "Sign in"; button "Sign in"; under it "New here? Create an account". Error: "That email and password don't match. Try again or reset your password."
- Password toggle: "Show" / "Hide", accessible names "Show password" / "Hide password".
- Reset done: toast "Password changed", then the sign in page with "Sign in with your new password."
- Split-page photo (the current hero city): decorative, alt="". It sits beside a form and carries no information.
- Optional demo hint, under the Sign in button, only if Varun wants it (build/handover.md item): Demo: any email with a password of 8 or more characters signs you in as Maya Okafor. It is Varun's call.

## Profile
As content/copy.md, Profile, with one addition at the end: a "Sign out" button (the spec lists sign out on this page).

## My bookings
Meta title: My bookings | Landfall (noindex)
- H1: My bookings
- Tabs: Upcoming, Past. Canceled bookings sit under Past with a Canceled chip (the spec has two tabs; content/copy.md's Canceled tab is dropped).
- Next trip card:
  - Photo: the destination's photo, decorative (alt=""), because the card names the trip.
  - Title: London to Lisbon
  - Line: Fri, Nov 20 to Fri, Nov 27, 2 adults
  - Countdown: Leaves in 9 days (hotels: "Check-in in 9 days"; the day before: "Leaves tomorrow")
  - Reference: Ref K7MQ2D
  - Status chip, button: Confirmed; View booking
- Other rows: as content/copy.md, Dashboard cards, with the button "View booking".
- Status chips: Confirmed; Tickets issued; Pending; Changed by airline; Canceled; Completed. ("Tickets issued" replaces the spec's "Ticketed", which is airline jargon; "Canceled" is US spelling, as content/copy.md note 8.)
- Empty, Upcoming: heading "No trips yet", body "Book a flight or a hotel and it will wait for you here.", button "Start a search". Photo: decorative, alt="".
- Empty, Past: as content/copy.md.
- Signed out: heading "Sign in to see your bookings", body as content/copy.md, buttons "Sign in", "Create an account".
- Loading: Loading your bookings

## Booking detail
As content/copy.md, Booking detail, with these changes:
- Sections (H2): Your flights; Travelers; Payment; Travel documents; Manage this booking.
- Payment rows lead with the total: "Paid $1,284.60 with Visa ending 4242 on Nov 3, 2026", "taxes and fees included", then "See price breakdown".
- Travel documents: e-ticket numbers as content/copy.md. Only if Duffel returns a document file for an airline, the row adds a link: "Download e-ticket for Maya Okafor (PDF, 84 KB)". The demo shows numbers only.
- Manage this booking: content/copy.md's "Changes and cancellations" lines, unchanged, under the new heading.

After a cancel (build/handover.md item)
- Toast: Booking canceled
- Status chip: Canceled
- Banner at the top of the page:
  - Heading: Your booking is canceled
  - Body: Kittiwake Air is refunding $612.00 to your Visa ending 4242. Your bank may take several business days to show it. We've emailed you the details.
  - Hotel: Casa Lanterna is refunding $744.00 to your Visa ending 4242. Your bank may take several business days to show it. We've emailed you the details.
  - No refund under the fare rules: This booking is canceled. Under the fare rules, there was no refund.
- New row under Payment: Refund of $612.00 to Visa ending 4242, requested Nov 11, 2026.
- Manage this booking, once canceled: This booking is canceled. If you have a question about it, contact us with your booking reference.

---

# Pages

## About
As content/copy.md, About, with these changes:
- Meta description: Landfall is a place to search, book and keep flights and hotels, with every price shown as a full total and card payments by Stripe.
- H1: About Landfall
- Line and flights-only line: as content/copy.md.
- Banner photo (21:9, a harbour at first light, still to source), alt: A harbour at first light, still water and moored boats under a pale sky. Check it against the photo used.
- No full-width photo between sections: Landfall's spec has one photo on About. content/copy.md's two other About photos and their alts are not used, which also closes build/handover.md's About photo item.
- Body H2s and text ("What you can book", "How booking works", "Your bookings, in one place", "Talk to us"): as content/copy.md, with one change to "Your bookings, in one place": "With an account, My bookings keeps your upcoming and past bookings, their references and the travel documents the airline issues, on your phone or your computer."

## Contact
As content/copy.md, Contact, with these changes:
- Meta description: Call or email Landfall about a booking, a payment or anything else on the site. Have your booking reference ready.
- No photo: Landfall's spec gives Contact none, so content/copy.md's contact photo alt is dropped (this also clears build/handover.md's "recognisable phone" note for Landfall).
- No support hours. The spec asks for a support hours placeholder; a visible placeholder would break the anti-slop rule and the client hasn't given hours (content/copy.md, question 3). Leave a CLIENT COPY REQUIRED comment.

## Terms and Privacy
As content/copy.md, Terms and Privacy. No "Last updated" line and no contents list until the real text arrives: there is nothing to date or list yet. Once the client's text is in, the contents list is titled "Contents" (a disclosure at 390).

## 404 and error
404: as content/copy.md, with these changes:
- The spec's working "This page has sailed" is not used: it reads as "too late", which is the wrong message for a broken link. H1 stays "We couldn't find that page".
- Line: The link may be broken, or the page may have moved. Search again below, or go back to the home page.
- The search card sits under it; the only link is "Go to the home page".
- Photo (a quay, still to source): decorative, alt="".
Error (500): as content/copy.md, with the My bookings swap: "Please try again in a moment. If you were paying, check My bookings or your email first, so you don't book twice." Link: Go to My bookings.

## Cookie notice
As content/copy.md, Cookie notice. Not shown in the demo, which sets no cookies.

---

# Email
As content/copy.md, Email, with these changes.

Footers (build/handover.md item: password emails asked for a booking reference)
- Booking emails: Questions? Call +1 (555) 010-0199 or email hello@example.com. Include your booking reference.
- Account emails (reset password, password changed): Questions? Call +1 (555) 010-0199 or email hello@example.com.
- Both: the demo notice (Landfall version), then "You're getting this email because of a booking or account on Landfall."

## Flight booking confirmed
- Subject: You're going to Lisbon on Fri, Nov 20
- Preview text: as content/copy.md.
- H1: You're going to Lisbon, Maya
- Reference box, itinerary, travelers, fare: as content/copy.md.
- Paid: Total paid $1,284.60, taxes and fees included, with Visa ending 4242
- Before you fly, button: as content/copy.md.

## Hotel booking confirmed
- Subject: You're staying at Casa Lanterna, Lisbon, from Fri, Nov 20
- H1: You're staying at Casa Lanterna, Maya
- Paid: Total paid $744.00, taxes and fees included, with Visa ending 4242
- The rest: as content/copy.md.

## E-tickets issued (new; the spec's "ticket issued" event)
- Subject: Your e-tickets for Lisbon are ready: K7MQ2D
- Preview text: Kittiwake Air has issued an e-ticket number for each traveler.
- H1: Your e-tickets are ready
- Body: Kittiwake Air has issued your e-tickets for London to Lisbon on Friday, November 20, 2026. Keep these numbers with your booking reference K7MQ2D. The airline may ask for them at check-in.
- Rows: Maya Okafor, e-ticket 910 2604 118352; Daniel Okafor, e-ticket 910 2604 118353
- Button: View your booking

## Booking not completed (new; the spec's "payment failed" event)
Sent only when a card was authorized but the airline or hotel couldn't confirm. A plain decline needs no email: the visitor sees it on the page.
- Subject: Your booking to Lisbon wasn't completed
- Preview text: Your card has not been charged.
- H1: Your booking wasn't completed
- Body: We couldn't complete your booking for London to Lisbon on Friday, November 20, 2026, because the airline couldn't confirm the seats. Your card has not been charged. Fares can sell out between search and payment, so search again to see what's available now.
- Hotel body: We couldn't complete your booking at Casa Lanterna from Friday, November 20, 2026, because the hotel couldn't confirm the room. Your card has not been charged. Rooms can sell out between search and payment, so search again to see what's available now.
- Button: Search again
- (Like content/copy.md's failure copy, this assumes the card is charged only after the booking is confirmed: content/copy.md, question 9.)

## Booking canceled, Flight times changed, Reset your password, Password changed
As content/copy.md, with the Landfall name and the account footer on the two password emails.

---

# Flights-only variants (if the Duffel Stays account is not approved)
- Hero: H1 unchanged ("Land somewhere new"); subline "Flights with taxes and fees in every price"; no tabs.
- Header and menu: no Hotels link.
- Popular destinations: unchanged.
- What happens when you book, row 1: the flights-only text above.
- Confirmation: buttons "View booking" and "Print".
- Footer: "Book" column Flights, Destinations; the flights-only demo notice.
- Home meta description: Search flights, compare every option by its full total with taxes and fees included, and pay by card through Stripe.
- Everything else: as content/copy.md, Flights-only variants.

---

# Mock data
As content/copy.md, Mock data set, with these additions:
- Per-traveler figures for the price block: $1,098.60 total is $549.30 per traveler; $1,284.60 is $642.30; $1,303.00 is $651.50.
- Hotel totals for pins and cards: as the content/copy.md hotel table ("Total" column).
- Offer validity example: "Price valid until 10:42"; after a refresh, "11:12".
- Countdown on My bookings: from Wed, Nov 11, 2026, the Lisbon trip "Leaves in 9 days".
- Refund row after the demo cancel: "Refund of $612.00 to Visa ending 4242, requested Nov 11, 2026".
- Hero caption fares: Lisbon $412, Cape Town $1,138, New York $684, from the destination fares.
- Photo files and alts: Home, Hero photo alts and Popular destinations above.

---

# Notes for the Developer
1. **Global swaps.** Sign in for Log in, My bookings for Bookings, Landfall for Overwing, both months in date ranges, total-first price blocks. Plumbing assumption 14 applies: update lib/text.ts, lib/emails.ts and lib/mock/ where they hold these strings.
2. **Passenger ages.** The search panel follows content/copy.md and the shared passenger-form errors: adults 12 and over, children 2 to 11, infants under 2. The prototype's "18 and over" and "2 to 17" change to match. If Duffel's live passenger rules turn out to differ, change the panel help, the form errors and the mock validation together.
3. **Prototype lines that change.** Calendar hint "or Done for one way" becomes "or press Done for a one-way trip"; "Rooms and guests" and "1 room, 2 adults" become "Guests and rooms" and "2 adults, 1 room"; the compact bar's "Anywhere to anywhere", "Hotels anywhere" and "Any dates" become "Where to?", "Which city?" and "Add dates"; the destinations H2 and note change; the status line adds the dates in the "Nov 20 to Nov 27" form.
4. **Contact details move** from checkout to the lead traveler and lead guest cards (the spec puts email and phone on the passenger form). Checkout shows a recap with "Edit".
5. **Fare change figures.** The banner uses the shared backend's figures ($18.40, $1,303.00), not the spec's working $24.10 and $1,146.80.
6. **E-tickets are numbers.** The spec's "download rows with file size" appear only if Duffel returns files (content/copy.md, note 6).
7. **Seats in fare conditions.** The Seats row says seats are chosen with the airline after booking, because seat selection isn't in Phase 1. If the build ever offers it, change the row.
8. **Map pins show the stay total**, by the price rule.
9. **Trust row.** One honest line and three CLIENT COPY REQUIRED comments; no invented entity, address or registration number.
10. **Limits.** "Up to 8 rooms and 16 guests" are the prototype's limits; check them against Duffel Stays before launch.
11. **Spec working copy not used:** "Cities worth the crossing" (says less than the new heading), "This page has sailed" (wrong message), "No money was taken", "Price held", "Ticketed", "Cancelled", "Search nearby dates" kept but defined as one day either side.

---

# Questions for the client
content/copy.md lists the 15 open questions (name and brand, hotels approval, contacts, legal, market, fees, story, cancellations, payment order, accounts, emails, destinations, cookies, suppliers, social). They all still apply; they are not repeated here. Landfall adds three:
16. **Cards.** Which card brands do you accept through Stripe? The footer and checkout show Visa and Mastercard marks as placeholders until you tell us.
17. **Sales lines.** When the supplier sends them, do you want "was" prices struck through and lines like "Only 2 left at this price" shown? They are accurate when shown, but they can read as sales pressure (spec, decision 5).
18. **Hero cities.** Which three cities should open the home page? Lisbon, Cape Town and New York are placeholders, each shown where it meets the water, with a fare from your main departure city (question 5).

---

# What I left out, and why
- **Everything content/copy.md leaves out** stays out: company story, founding year, team, location, support hours, address, WhatsApp, legal text, reviews, ratings, awards, licences, guarantees, price promises, seat choice, packages, deals, loyalty, chat, a welcome email, refund timings.
- **Company details in the trust row:** the client hasn't sent a legal name, address or registration number, so the row says they will appear, and shows nothing invented.
- **Support hours on Contact:** the spec asks for a placeholder; the client gave no hours and a visible placeholder is an anti-slop tell.
- **A "Last updated" date and contents list on the legal pages:** there is no text yet to date or list.
- **A supporting line on the pre-footer band:** every fact it could carry is already on the home page above it.
- **Hotel review scores, scarcity and "was" prices in the demo:** the mock data has none, and they are never invented. The copy patterns are ready if Duffel sends them.
- **Region pills on Popular destinations and quick chips on flight results:** not in Landfall's spec.

Copy complete.
