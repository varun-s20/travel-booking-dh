# Copy: travel-booking (working name Overwing, a placeholder)
Copywriter, 2026-11-10. Written from prd/Travel_Booking_Platform_Final_Scope.pdf, brief.md (with Varun's checkpoint 1a answers), design/design-spec.md, design/choices.md (checkpoint 2b) and the prototype's working copy. Organized by page, then by section, using the spec's section names.

## Read this first
- **Placeholders.** The client has sent no name, contact details, story, legal text or market. Every "Overwing" is the placeholder name: replace it everywhere at once when the client names the business. The phone +1 (555) 010-0199 and the email hello@example.com are the approved placeholder contacts (checkpoint 2b). They are named in the demo notice and nowhere claim to be real.
- **Simulated data.** Every fare, flight, hotel, room, booking reference, traveler and date in this file is mock data for the simulated backend. The mock data set is at the end of this file. Prices and labels in the copy below use those same values, so the demo hangs together from home page to email.
- **No invented client facts.** Nothing here claims a founding year, team size, award, review, licence, guarantee, support hours or address. Where the client material is silent the copy says less, and the gap is listed under "Questions for the client" and "What I left out".
- **Market conventions (placeholders, Varun's answer 2).** US English spelling (traveler, canceled, center), USD with cents everywhere a price is final ($1,284.60), whole dollars only in "from" prices ($412). Dates as "Fri, Nov 20" in the interface and "Friday, November 20, 2026" in emails. Times on the 24-hour clock (07:05), because flight data reads cleaner that way; this is a market question too. Durations as "2h 45m" on screen, "2 hours 45 minutes" for screen readers. Ranges use "to", never a dash.
- **Voice.** Plain, direct and calm, the way a good booking tool talks. Short labels. Prices and rules said plainly. The window-seat idea shows only in a few headlines (the pre-footer band, the searching state); transactional copy stays plain.
- **Style rules held.** Sentence case headlines with no full stops and no italics. No em dashes or en dashes. None of: elevate, seamless, unlock, unleash, nestled, testament, journey, effortless, hassle-free, curated, discover, embark, hidden gems, vibrant, bustling, breathtaking, stunning, peace of mind, at your fingertips.

---

# Shared chrome (every page)

## Rail (1025 and up)
- Brand tile: accessible name "Overwing, home". Visible label: overwing (lowercase, as the placeholder wordmark).
- Items: Search, Bookings, Account, Help, More.
- Logged in, Account opens the profile; logged out, it opens Log in.

## Account cluster (1025 and up)
- Logged out: Log in, Sign up.
- Logged in: a round button with the person's initials ("MO"). Accessible name: "Account menu for Maya Okafor". Menu items: Bookings, Profile, Log out.

## Phone bar (up to 1024)
- Wordmark: accessible name "Overwing, home".
- Log in pill: Log in. Logged in, the pill becomes the initials button above.
- More button: accessible name "More".

## Tab bar (up to 1024)
- Items: Search, Bookings, Account, Help. Accessible name of the nav: "App".

## More menu
- Title: More
- Close button: accessible name "Close".
- Logged out: Log in, Sign up (full width).
- Logged in: Bookings, Profile, Log out (full width rows instead of the two pills).
- Rows: About us, Contact us, Terms and conditions, Privacy policy.

## Skip link
- Skip to content

## Compact search bar (inner pages)
- Cells and labels: as the hero search below (From, To, Dates, Travelers; or Destination, Check in and out, Guests and rooms).
- Search pill: Search. Shrunk to its arrow, accessible name "Search".
- Phone trigger, empty: label "Flights and hotels", value "Where to?". Filled: label "FLIGHTS, NOV 20 TO 27", value "London to Lisbon". Hotels filled: label "HOTELS, NOV 20 TO 24", value "Lisbon, 2 adults".
- Accessible name of the trigger: "Change search: flights, London to Lisbon, Friday, November 20 to Friday, November 27, 2 adults, Economy".

## Toasts and system messages (used across pages)
- Copied
- Saved
- Traveler added
- Traveler removed
- Password changed
- You've logged out
- You're offline. Check your connection and try again.
- Your session has ended. Log in again to carry on where you left off.

---

# Home
Meta title: Overwing | Book flights and hotels
Meta description: Search flights and hotels, compare them by price, time and stops, and see the full total, taxes and fees included, before you pay with Stripe.

## Hero
- Headline (H1): Fly there, stay there
- Subline: Search flights and hotels and see the full total before you pay
- Flights-only headline (if the Duffel Stays account is not approved): Fly there and back
- Flights-only subline: Search flights and see the full total before you pay
- Backup flights-only headline, if Varun wants a question instead: Where are you flying next?
- Why "Fly there and back": it keeps the rhythm and plainness of the approved line, it is true of every return search, and it makes no promise the flights-only site can't keep. It does not mention seats or windows, because seat choice is not in the Phase 1 scope.
- Fact chips (list accessible name "Booking with us"):
  - Payments by Stripe
  - Documents in your account
  - Confirmation by email
- Hero image alt (first window only; the other three are decorative and hidden): A wing over a sea of clouds, seen from a window seat

## Search (hero pill, phone sheet and compact bar)
Toggle (group name "What to search"): Flights, Hotels. Flights-only: no toggle.

Phone trigger, empty: label "Flights and hotels", value "Where to?". Flights-only: label "Flights".
Phone sheet title: Search. Close button: "Close search".

### Flights
- From: label "From", placeholder "City or airport". Once chosen, the code shows on the label row ("FROM  LHR") and the city in the cell ("London").
- To: label "To", placeholder "Where to?"
- List heading: Cities and airports
- List row: "London Heathrow" with the code "LHR" and a second line "London, United Kingdom".
- No match: No places match "Lisbonn". Check the spelling or type a three-letter airport code.
- Dates: label "Dates", empty value "Add dates", set value "Nov 20 to 27" (or "Nov 28 to Dec 3" across months; one way: "Fri, Nov 20").
- Trip type toggle (group name "Trip type"): Return, One way
- Calendar hints: "Choose your departure date", then "Now choose your return date", then "Nov 20 to 27, 7 nights". One way: "Departing Friday, Nov 20".
- Calendar buttons: Clear dates, Done. Month arrows: "Previous month", "Next month".
- Travelers: label "Travelers", value "1 adult, Economy" (examples: "2 adults, Economy"; "2 adults, 1 child, Business"; "3 travelers, Premium").
- Steppers: Adults, help "Ages 12 or above". Children, help "Ages 2 to 11". Infants, help "Under 2, on a lap". Button names: "Add an adult", "Remove an adult", and so on.
- Limits, shown under the steppers when reached: "You can book for up to 9 travelers at a time." and "Each infant travels on an adult's lap, so add an adult first."
- Cabin (legend "Cabin"): Economy, Premium economy (shows as "Premium" in the cell), Business, First
- Popover button: Done
- Search button: Search

### Hotels
- Destination: label "Destination", placeholder "City or area". List heading "Cities". Row: "Lisbon" with "Portugal" as the second line.
- Dates: label "Check in and out", empty "Add dates", set "Nov 20 to 24".
- Calendar hints: "Choose your check-in date", "Now choose your check-out date", then "Nov 20 to 24, 4 nights".
- Guests and rooms: label "Guests and rooms", value "2 adults, 1 room".
- Steppers: Adults, help "Ages 18 or above". Children, help "Ages 0 to 17". Rooms, help "Up to one per adult".
- Search button: Search

### Status line under the pill (validation and progress)
- Choose the city or airport you are flying from.
- Choose where you are flying to.
- Choose "Paris" from the list, or type a city or airport code.
- Choose a destination different from where you start.
- Choose your departure date.
- Choose your return date, or switch to one way.
- Choose the city you want to stay in.
- Choose your check-in and check-out dates.
- On submit: Searching flights from London to Lisbon
- On submit (hotels): Searching hotels in Lisbon

## Entry cards
Card 1, flights
- Title: Compare flights by price, time and stops
- Button: Search flights
- Alt: A traveler with a backpack walking through a bright departure hall, seen from behind
Card 2, hotels
- Title: Pick the room, then see the total for your stay
- Button: Find a hotel
- Alt: A made bed beside a tall window in a quiet hotel room, morning light
Flights-only card 2 (replaces the hotel card)
- Title: Every booking and e-ticket number in your account
- Button: See your bookings (logged out: Create an account)
- Alt: A passport and a phone on a café table by a window
(Alt texts describe the shots the spec asks for in section 7. Check each one against the photo actually sourced and adjust.)

## Popular destinations
- Headline (H2): Cities worth the flight
- Region pills (filter the grid; All is selected first): All, Europe, Americas, Asia and Pacific, Africa and Middle East
- Note under the grid (14px, muted): Lowest return fare we've found for one adult from London, taxes and fees included. Fares change often and are confirmed before you pay.
- When the visitor has searched before, "from London" becomes their last origin ("from New York").
- No "See all destinations" link: the mock data holds only these six.

Cards (label, city, alt; the whole card is one link to flight results for that city)
| City | Region | Label | Image alt |
|---|---|---|---|
| Lisbon | Europe | Return from $412 | A yellow tram climbing a steep cobbled street in late afternoon light |
| Rome | Europe | Return from $389 | A person on a scooter passing ochre buildings on a narrow street |
| New York | Americas | Return from $684 | A pedestrian crossing a wide avenue as the low sun lines up with the street |
| Mexico City | Americas | Return from $1,046 | A cyclist under jacaranda trees in bloom on a tree-lined street |
| Tokyo | Asia and Pacific | Return from $1,212 | A quiet side street with lanterns and a lone walker at dusk |
| Cape Town | Africa and Middle East | Return from $1,138 | Brightly painted houses on a hillside street with a figure walking uphill |

- Card accessible name: "Lisbon, return flights from $412. Search flights to Lisbon."
- Empty region (if a pill filters to nothing in future data): No cities here yet. Try another region.

## Trust panel
- Headline (H2): Booked, paid and in your inbox
- Four facts (tick rows):
  - Stripe handles every card payment, so your card number goes to Stripe, not to us.
  - Just before you pay, we check the price again with the airline or hotel and show the total with taxes and fees.
  - Your booking reference and itinerary arrive by email and stay in your account.
  - If something needs to change, call or email us with your booking reference.
- Flights-only, fact 2: Just before you pay, we check the price again with the airline and show the total with taxes and fees.
- Photo alt: Hands holding a phone with a booking on screen, a coffee cup beside it

## Pre-footer band
- Headline (H2): Pull up the blind on your next trip
- Button: Start a search
(The band carries the faint window glyph, so the line names the gesture the hero's blinds make.)

## Footer
- Phone: +1 (555) 010-0199 (link accessible name "Call +1 (555) 010-0199")
- Email: hello@example.com
- Back to top
- Column "Book": Flights, Hotels. Flights-only: Flights.
- Column "Your trips": Bookings, Account, Log in (logged in: Log out)
- Column "Company": About us, Contact us
- Column "Legal": Terms and conditions, Privacy policy
- Demo notice (approved at checkpoint 2b, verbatim): This is a demo build. Overwing is a working name, and the logo, photos, contact details, flights, hotels and prices are placeholders. No booking is real and no card is charged.
- Flights-only demo notice: This is a demo build. Overwing is a working name, and the logo, photos, contact details, flights and prices are placeholders. No booking is real and no card is charged.
- Copyright strip: © 2026 Overwing
- Credit: Created with love by Digital Heroes
- Footer photo: decorative, alt="".
- No fact line ("Since ...") and no social pills: the client has given neither.

---

# Flights

## Searching state
Meta title (results page while loading): Searching flights | Overwing
- H1: London to Lisbon
- Meta line: Fri, Nov 20 to Fri, Nov 27, 2 adults, Economy
- Status line: Checking fares with the airlines
- After 4 seconds: Still looking. Some airlines take a few seconds to answer.
- Live region when results land: 86 flights found
- Window: decorative, alt="".
- Search failed (panel, cream): heading "We couldn't reach the airlines just now", body "Your search didn't finish. Nothing has been booked. Try again in a moment.", button "Try again".

## Results
Meta title: Flights from London to Lisbon | Overwing
Meta description: Compare flights from London to Lisbon by price, stops and travel time, with taxes and fees in every total.
- H1: London to Lisbon
- Meta line: Fri, Nov 20 to Fri, Nov 27, 2 adults, Economy
- Count: 86 flights. Filtered: Showing 24 of 86 flights
- Sort pill: "Sort: Best". Options:
  - Best: balances price, travel time and stops
  - Cheapest: lowest total first
  - Fastest: shortest travel time first
- Quick chips: Nonstop, Under 6 hours, Morning departures
- Phone: chip "Filters" (with a count when set: "Filters, 2"), sort opens a sheet titled "Sort by".
- Price note above the list (14px): Prices are totals for 2 travelers, taxes and fees included.

Filter column
- Stops: Any number of stops; Nonstop only; 1 stop or fewer; 2 stops or fewer. Each with its lowest total ("from $902.40").
- Airlines: one checkbox per airline with its lowest total; an "Only" link on hover or focus ("Show only Kittiwake Air"); "Select all".
- Departure time, with two tabs "Leaving London" and "Leaving Lisbon": Early morning, before 06:00; Morning, 06:00 to 11:59; Afternoon, 12:00 to 17:59; Evening, after 18:00.
- Duration: label "Total travel time", value "Up to 8h 30m".
- Price: label "Total price", value "Up to $1,400". (The PRD lists a price filter; the spec's filter list leaves it out. See Notes for the Developer.)
- Clear all
- Phone sheet title: Filters. Buttons: "Clear all", "Show 24 flights".

Result card (data from the mock set)
- Airline name and tile (code in the tile: "KT").
- Leg line: 07:05 LHR, 2h 45m, Nonstop, 09:50 LIS
- With a stop: 06:10 LHR, 5h 10m, 1 stop, MAD, 11:20 LIS
- Next day marker: "+1", accessible text "arrives the next day".
- Codeshare line (14px muted): Operated by Tern Atlantic
- Price: $1,098.60, with "total for 2 travelers" (1 traveler: "total for 1 traveler").
- Button: Select
- Card accessible name: "Kittiwake Air. Outbound Friday, Nov 20, 07:05 from London Heathrow, arrives 09:50 Lisbon, nonstop, 2 hours 45 minutes. Return Friday, Nov 27, 10:40 from Lisbon, arrives 13:15 London Heathrow, nonstop, 2 hours 35 minutes. $1,098.60 total for 2 travelers."
- Warnings (14px with an info icon, only when the data says so): Change of airport in London; Overnight layover; Long layover.

## No results, fare changed, offer expired
No flights on the dates
- Heading: No flights on these dates
- Body: We couldn't find flights from London to Lisbon on Fri, Nov 20. Try a day or two either side.
- Button: Change dates
Filters hide everything
- Heading: No flights match your filters
- Body: 86 flights match your search without them. Try removing one.
- Button: Clear filters
Fare went up (warn colors on the delta)
- Heading: The price has gone up by $18.40
- Body: The airline changed the fare after you searched. The new total for 2 travelers is $1,303.00.
- Buttons: Continue at $1,303.00, Back to results
Fare went down
- Heading: The price has dropped by $12.00
- Body: The airline lowered the fare after you searched. The new total for 2 travelers is $1,272.60.
- Button: Continue
Sold out since the search
- Heading: This flight is no longer available
- Body: The seats at this fare sold out after you searched. Other flights on your dates may still have space.
- Button: Back to results
Offer expired
- Heading: These prices have expired
- Body: Airline prices are only valid for a short time after a search. Search again to see current fares.
- Button: Search again
Expiry line in the booking summary
- Price valid for 28 more minutes
- Under 5 minutes (warn color): Price valid for 4 more minutes
- Under 1 minute: Price valid for less than a minute
- Screen reader, announced once at 5 minutes: Your price is valid for 5 more minutes.
(The spec's working line said "Price held". Duffel offers are not held; the price is valid until the offer expires, so the copy says "valid".)

## Flight details and fares
Meta title: London to Lisbon flight details | Overwing (noindex)
- H1: London to Lisbon
- Meta line: Return, Fri, Nov 20 to Fri, Nov 27, 2 adults, Economy
- Back link: Back to results

Itinerary (H2: Your flights)
- Leg heading: Outbound, Fri, Nov 20. Side note: 2h 45m, nonstop
- Rows:
  - 07:05 London Heathrow (LHR), Terminal 2
  - Kittiwake Air KT 412, Airbus A320neo, Economy
  - 09:50 Lisbon Humberto Delgado (LIS), Terminal 1
- Leg heading: Return, Fri, Nov 27. Side note: 2h 35m, nonstop
- Layover row (when there is one): 1h 30m in Madrid (MAD). Change planes.
- Airport change row: You arrive at Gatwick (LGW) and leave from Heathrow (LHR). Allow time to travel between them.
- Overnight row: Overnight layover in Madrid. Hotel not included.

Fares (H2: Choose your fare)
- Intro: Every fare is on the same flights. They differ in bags, seats and what happens if your plans change.
- Fare rows (name, difference, button):
  - Light, Included in the price, button "Choose Light"
  - Classic, +$186.00 total, button "Choose Classic"
  - Flex, +$414.00 total, button "Choose Flex"
  - Chosen row: button reads "Selected".
- Inclusion cards under the chosen fare: "Included" (tick rows) and "For a fee" (plus rows). The rows per fare are in the mock data set.
- Not-included rows (no icon, muted): Not refundable
- Note under the cards: The airline sets these rules. We show them exactly as the airline sends them.

Booking summary (sticky card)
- Title: Your trip
- Lines: London to Lisbon, return; Fri, Nov 20 to Fri, Nov 27; 2 adults, Classic fare
- Flights: $1,068.00
- Taxes and fees: $216.60
- Total: $1,284.60
- Expiry line: Price valid for 28 more minutes
- Button: Continue
- Phone bottom bar: "$1,284.60 total" and "Continue".

## Passenger form
Meta title: Traveler details | Overwing (noindex)
- H1: Who's flying?
- Intro: Enter each name exactly as it appears on the passport or ID that person will travel with. The airline checks them at the airport.
- Logged in, above the first fieldset: select "Fill in from a saved traveler", first option "Choose a traveler".
- Fieldset legends: Adult 1, lead traveler; Adult 2; Child 1; Infant 1, on Adult 1's lap
- Fields:
  - Title: Mr, Ms, Mrs, Miss, Dr
  - Given names. Help: First and middle names, as on the passport.
  - Family name
  - Date of birth: Day, Month, Year
  - Gender on passport: Female, Male. Help: As shown on the passport. Airlines currently accept these two options only.
- Passport block (only when the airline asks for it): intro "This airline asks for passport details when you book." Fields: Passport number; Issuing country; Expiry date.
- Logged in, under each fieldset: checkbox "Save this traveler to my account"
- Button: Continue to payment
- Back link: Back to fares
- Errors (inline, under the field):
  - Enter given names as they appear on the passport.
  - Enter a family name.
  - Enter a full date of birth.
  - Enter a real date, for example 14 3 1988.
  - Adults must be 12 or older on the day of the return flight.
  - Children must be 2 to 11 on the day of the return flight.
  - Infants must be under 2 on the day of the return flight.
  - Choose the gender shown on the passport.
  - Enter the passport number.
  - This passport expires before you travel. Check the date or use another passport.
- Error summary at the top when the form is sent with errors: "Check 2 details before you continue", with a link to each field.

---

# Hotels

## Searching state (hotels)
- H1: Hotels in Lisbon
- Meta line: Fri, Nov 20 to Tue, Nov 24, 4 nights, 2 adults, 1 room
- Status line: Checking rooms and prices with hotels
- After 4 seconds: Still looking. Some hotels take a few seconds to answer.
- Live region: 5 places to stay found
- Search failed: heading "We couldn't reach the hotels just now", body "Your search didn't finish. Try again in a moment.", button "Try again".

## Results
Meta title: Hotels in Lisbon | Overwing
Meta description: Compare hotels in Lisbon by price per night, area and cancellation terms, with taxes and fees in every total.
- H1: Hotels in Lisbon
- Meta line: Fri, Nov 20 to Tue, Nov 24, 4 nights, 2 adults, 1 room
- Count: 5 places to stay
- Sort pill: "Sort: Lowest price". Options: Lowest price; Highest star rating; Closest to the center.
- Filter chips: Free cancellation, Breakfast included, 4 stars and up, Price per night (opens a range: "Up to $250 a night")
- Price note: Prices include taxes and fees. A local tourist tax, where there is one, is paid at the hotel.
- Card: name, area, two-line description, three amenity icons with text for screen readers, price "$186 a night, $744 total", button "See rooms".
- Card chips (when true): Free cancellation until Nov 17; Breakfast included
- Star rating: shown as "4-star hotel" (text, not stars alone).
- Photo carousel buttons: "Previous photo", "Next photo"; alt pattern "Casa Lanterna, photo 1 of 5".
- Map pins: the nightly price ("$186"). Pin accessible name: "Casa Lanterna, $186 a night".
- Phone: floating pill "Map"; on the map, pill "List".
- Map credit: Map data © OpenStreetMap contributors
- No results: heading "No rooms in Lisbon for these dates", body "Every place we checked is full or doesn't fit 2 adults in 1 room. Try other dates or another room setup.", button "Change dates".
- Filters hide everything: heading "No hotels match your filters", body "5 places match your search without them.", button "Clear filters".

## Hotel detail
Meta title: Casa Lanterna, Lisbon | Overwing (pattern: hotel name, city)
Meta description: Rooms, prices and policies for Casa Lanterna in Alfama, Lisbon. Choose a room and see the total for your dates.

Title block
- H1: Casa Lanterna
- Meta row: Alfama, Lisbon; 4-star hotel
- Back link: Back to results

Photo grid
- Grid button accessible name: "Open the photo gallery, 17 photos"
- Chip: +12 photos
- Gallery dialog title: Photos of Casa Lanterna. Category headings: Rooms, Inside, Outside. Close: "Close gallery".
- Alt pattern: "Casa Lanterna, roof terrace", "Casa Lanterna, Courtyard Double". (In production Duffel's photos carry no captions, so the alt falls back to "Casa Lanterna, photo 3 of 17".)

Description (H3: About this hotel)
- Text and "Read more": from the mock data (Casa Lanterna's description below).
- Dialog title: About Casa Lanterna

Amenities (H3: Amenities)
- First six rows from the mock data, then the pill "All 12 amenities".
- Dialog title: Amenities at Casa Lanterna

Rooms (H2: Choose a room)
- Chips: Fri, Nov 20 to Tue, Nov 24; 2 adults, 1 room; Change
- Room card: name, spec line, three inclusion rows, price "$186 a night", total "$744 total for 4 nights", button "Choose room".
- Rail buttons: "Previous rooms", "Next rooms".
- Sold out card: "No longer available for your dates" in place of the price; button hidden.
- None left: heading "No rooms left for these dates", body "Casa Lanterna is full from Nov 20 to 24. Try other dates or look at other hotels in Lisbon.", buttons "Change dates", "Back to results".
- Phone bottom bar: "From $186 a night" and "See rooms".

Policies (H2: Policies)
- Check-in card: Check-in, From 15:00
- Check-out card: Check-out, Until 11:00
- Accordion rows (text from the mock data): Cancellation; Payment; Children and extra beds; Pets; Accessibility

Location (H2: Location)
- Line: Alfama, Lisbon, Portugal
- Map credit: Map data © OpenStreetMap contributors
- Map alt: Map of Alfama, Lisbon, with Casa Lanterna marked

## Guest form
Meta title: Guest details | Overwing (noindex)
- H1: Who's checking in?
- Intro: Add the guest who will check in. The hotel may ask to see ID with this name on it.
- Fieldset legend: Lead guest (2 rooms or more: "Guest for room 1", "Guest for room 2")
- Fields: Given names; Family name
- Special requests (optional). Help: We pass these to the hotel. They depend on what's available on the day and aren't guaranteed. Placeholder text: For example, a quiet room or a late arrival
- Button: Continue to payment
- Back link: Back to rooms
- Errors: Enter the guest's given names. Enter the guest's family name. Keep special requests under 500 characters.

---

# Booking and payment

## Checkout
Meta title: Review and pay | Overwing (noindex)
- H1: Review and pay
- Logged out, a quiet line above the form: Have an account? Log in to save this booking to it. (Link: Log in)

Contact details (H2)
- Intro: We'll send the confirmation and any changes to this booking here.
- Fields: Email; Phone. Phone help: Include the country code, for example +1.
- Errors: Enter an email address like name@example.com. Enter a phone number with its country code.

Payment (H2)
- The Stripe Payment Element supplies its own field labels (card number, expiry date, security code, country). We don't rewrite them.
- Terms checkbox, flights: I agree to the Terms and conditions and Privacy policy, and to the airline's fare rules shown for this booking.
- Terms checkbox, hotels: I agree to the Terms and conditions and Privacy policy, and to the hotel's cancellation policy shown for this room.
- Error if unticked: Tick the box to agree to the terms before you pay.
- Pay button: Pay $1,284.60 (hotel example: Pay $744.00)
- Trust line under the button: Card payments are handled by Stripe. Your card number goes to Stripe, not to us.
- Demo only, a cream note above the Payment Element: Demo payment. Use card 4242 4242 4242 4242 with any future date and any security code. Card 4000 0000 0000 0002 shows a declined payment.

Progress (on the Pay button and in a live region)
- Checking the price with the airline (hotels: Checking the room with the hotel)
- Taking payment
- Confirming your booking with the airline (hotels: Confirming your booking with the hotel)
- Under the button while it runs: This can take a few seconds. Please keep this page open.

Booking summary
- Title: Your trip (hotels: Your stay)
- Flights lines: London to Lisbon, return; Fri, Nov 20 to Fri, Nov 27; Kittiwake Air, nonstop both ways; 2 adults, Classic fare
- Flights: $1,068.00; Taxes and fees: $216.60; Total: $1,284.60
- Stay lines: Casa Lanterna, Alfama, Lisbon; Courtyard Double; Fri, Nov 20 to Tue, Nov 24, 4 nights; 2 adults, 1 room
- Room, 4 nights: $640.00; Taxes and fees: $104.00; Total: $744.00
- Stay note: Tourist tax, if the city charges one, is paid at the hotel.
- Expiry line (flights): Price valid for 28 more minutes
- Link: Change
- Phone disclosure: "Show summary, $1,284.60" and "Hide summary".

## Payment failed
Panel above the Payment Element; focus moves to it; the form stays filled.
- Card declined: heading "Your card was declined", body "Nothing has been charged. Check the card details or try another card.", button "Try another card".
- Not enough funds: heading "The payment didn't go through", body "Your bank declined it for insufficient funds. Nothing has been charged.", button "Try another card".
- Card expired: heading "This card has expired", body "Nothing has been charged. Use a card with a later expiry date.", button "Try another card".
- Bank check failed: heading "Your bank couldn't confirm the payment", body "The security check with your bank didn't finish. Nothing has been charged. Try again, or use another card.", button "Try again".
- Anything else: heading "The payment didn't go through", body "Nothing has been charged. Try again in a moment, or use another card.", button "Try again".
- Booking not confirmed after payment authorization: heading "The airline couldn't confirm these seats", body "Your card has not been charged. Fares can sell out between search and payment. Search again to see what's available now.", button "Search again". Hotel version: "The hotel couldn't confirm this room" / "Your card has not been charged. Rooms can sell out between search and payment. Search again to see what's available now." (This copy assumes the card is authorized first and charged only once the booking is confirmed. See Questions for the client.)

## Confirmation
Meta title: You're booked | Overwing (noindex)

Flights
- Success chip: Booking confirmed
- H1: You're booked
- Reference label: Booking reference
- Reference: K7MQ2D, with a pill "Copy" (after: "Copied")
- Lead: London to Lisbon, Fri, Nov 20 to Fri, Nov 27, 2 adults.
- Itinerary card: as on the flight details page.
- Travel documents (H2): Your e-ticket numbers. The airline may ask for them at check-in.
  - Maya Okafor, e-ticket 910 2604 118352
  - Daniel Okafor, e-ticket 910 2604 118353
  - While the airline is still issuing them: The airline is issuing your e-tickets. They'll appear here and in your email once they're ready.
- Payment line: Paid $1,284.60 with Visa ending 4242
- Before you fly (H2), three rows:
  - Check in with Kittiwake Air online before you go, using booking reference K7MQ2D.
  - Bring the passport or ID you entered for each traveler.
  - Need to change something? Contact us with your booking reference.
- Sent line: We've sent this to maya.okafor@example.com.
- Buttons: View in Bookings, Print

Hotels
- Success chip: Booking confirmed
- H1: You're booked
- Reference: S4T9LW
- Lead: Casa Lanterna, Lisbon, Fri, Nov 20 to Tue, Nov 24, 4 nights, 2 adults.
- Stay card: room, dates, check-in from 15:00, check-out until 11:00, address line.
- Payment line: Paid $744.00 with Visa ending 4242
- Before you go (H2), three rows:
  - Check in from 15:00 on Fri, Nov 20. The booking is under Maya Okafor.
  - Bring ID that matches the lead guest's name.
  - Free cancellation until 23:59 hotel time on Tue, Nov 17. After that, this booking can't be refunded.
- Sent line and buttons: as for flights.

---

# Account

## Sign up
Meta title: Create an account | Overwing (noindex)
- H1: Create an account
- Intro: Keep your bookings, booking references and e-ticket numbers in one place.
- Fields: First name; Last name; Email; Password. Password help: At least 8 characters.
- Checkbox: I agree to the Terms and conditions and Privacy policy.
- Button: Create account
- Under it: Already have an account? Log in
- Errors: Enter your first name. Enter your last name. Enter an email address like name@example.com. Use at least 8 characters. Tick the box to agree to the terms. An account with this email already exists. Log in or reset your password.

## Log in
Meta title: Log in | Overwing (noindex)
- H1: Log in
- Fields: Email; Password (with a "Show" toggle; after: "Hide")
- Link: Forgot your password?
- Button: Log in
- Under it: New here? Create an account
- Errors: Enter your email address. Enter your password. That email and password don't match. Try again or reset your password.
- After too many tries: Too many attempts. Wait a few minutes, then try again or reset your password.

## Forgot password
Meta title: Reset your password | Overwing (noindex)
- H1: Reset your password
- Intro: Enter the email you signed up with and we'll send you a link to choose a new password.
- Field: Email
- Button: Send reset link
- Under it: Back to log in
- Sent state, H1: Check your email
- Sent state, body: If there's an account for maya.okafor@example.com, a reset link is on its way. It works once and expires after a short time.
- Sent state, link: Didn't get it? Send another link

## Reset password
Meta title: Choose a new password | Overwing (noindex)
- H1: Choose a new password
- Fields: New password (help: At least 8 characters); Confirm new password
- Button: Save password
- Error: These passwords don't match.
- Link expired, H1: This link has expired
- Link expired, body: Reset links work once and only for a short time. Ask for a new one.
- Link expired, button: Send a new link
- Done: toast "Password changed", then the log in page with the line "Log in with your new password."

## Profile
Meta title: Your profile | Overwing (noindex)
- H1: Your profile
Personal details (card)
- Rows: Name, Maya Okafor; Email, maya.okafor@example.com; Phone, +1 (555) 010-0142
- Button: Edit. Edit fields: First name; Last name; Email; Phone. Buttons: Save changes, Cancel.
- Email change note: We'll send booking emails to the new address from now on.
Saved travelers (card)
- Intro: Save the people you travel with, so their details fill in for you when you book.
- Row: Daniel Okafor, adult. Buttons: Edit, Remove.
- Button: Add a traveler
- Remove dialog: heading "Remove Daniel Okafor?", body "This won't change any booking already made.", buttons "Remove", "Keep".
- Empty: No saved travelers yet.
Password (card)
- Line: Last changed Nov 3, 2026
- Button: Change password. Fields: Current password; New password; Confirm new password. Button: Save password.
- Error: Your current password isn't right.
Delete account (card)
- Body: Deleting your account removes your profile and saved travelers and logs you out. Bookings you've already made stay valid with the airline or hotel.
- Button: Delete account
- Dialog: heading "Delete your account?", body "This can't be undone. Your bookings stay valid, but you won't see them here any more.", buttons "Delete my account", "Keep my account".

## Dashboard
Meta title: Your bookings | Overwing (noindex)
- H1: Your bookings
- Tabs: Upcoming, Past, Canceled
- Card: route or hotel name, dates, reference, status chip, button "View".
  - London to Lisbon; Fri, Nov 20 to Fri, Nov 27, 2 adults; Ref K7MQ2D; Confirmed
  - Casa Lanterna, Lisbon; Fri, Nov 20 to Tue, Nov 24, 4 nights; Ref S4T9LW; Confirmed
  - Past: London to Rome; Sat, Sep 12 to Wed, Sep 16, 2026; Ref R8DWQ4; Completed
  - Canceled: Albergo Tre Finestre, Rome; Sat, Sep 12 to Wed, Sep 16, 2026; Ref H2LNC7; Canceled
- Status chips: Confirmed; Pending; Changed by airline; Canceled; Completed
- Pending note on the card: The airline is confirming this booking. We'll email you when it's done.
- Thumbnails: decorative, alt="" (the card names the trip).
- Empty, Upcoming: heading "No trips coming up", body "Book a flight or a hotel and it will wait for you here.", button "Start a search".
- Empty, Past: heading "No past trips yet", body "Trips move here once they're over."
- Empty, Canceled: heading "No canceled bookings", body "If you cancel a booking, you'll see it here."
- Logged out: heading "Log in to see your bookings", body "Your upcoming and past bookings, references and e-ticket numbers are kept in your account.", buttons "Log in", "Create an account".
- Loading: Loading your bookings

## Booking detail
Meta title: Booking K7MQ2D | Overwing (noindex)
- H1: London to Lisbon
- Status chip and reference: Confirmed; Booking reference K7MQ2D (Copy)
- Sections (H2): Your flights; Travelers; Payment; Travel documents; Changes and cancellations
- Travelers rows: Maya Okafor, adult, lead traveler; Daniel Okafor, adult
- Payment rows: Flights $1,068.00; Taxes and fees $216.60; Paid $1,284.60 with Visa ending 4242 on Nov 3, 2026
- Changed by airline, banner: heading "Kittiwake Air has changed your flight times", body "Your outbound flight now leaves at 07:40 and lands at 10:25. If the new times don't work for you, contact us with your booking reference.", button "Contact us".

Changes and cancellations
- When the airline allows cancelling online: body "Kittiwake Air lets you cancel this booking online. If you cancel now, the airline refunds $612.00 to your Visa ending 4242.", button "Cancel booking".
- Dialog: heading "Cancel your flights to Lisbon?", body "The airline will refund $612.00 to your Visa ending 4242. This can't be undone.", buttons "Yes, cancel booking", "Keep my booking".
- After: toast "Booking canceled", and the line "We've emailed you the details. Your bank may take several business days to show the refund."
- When it can't be done online: body "To change or cancel this booking, call +1 (555) 010-0199 or email hello@example.com with your booking reference. What's possible depends on the airline's fare rules."
- Hotel, before the free cancellation deadline: body "Free cancellation until 23:59 hotel time on Tue, Nov 17. Cancel before then and you'll get the full $744.00 back.", button "Cancel booking". Dialog: "Cancel your stay at Casa Lanterna?" / "You'll get $744.00 back to your Visa ending 4242. This can't be undone." / "Yes, cancel booking", "Keep my booking".
- Hotel, after the deadline: body "This booking can no longer be refunded. If your plans have changed, contact us and we'll ask the hotel what's possible."

---

# Pages

## About
Meta title: About us | Overwing
Meta description: Overwing is a place to search, book and keep flights and hotels, with card payments by Stripe and every booking in your account.

Banner
- H1: About Overwing
- Line: A place to search, book and keep your flights and hotels.
- Flights-only line: A place to search, book and keep your flights.
- Banner alt: A window seat view of a coastline at sunrise, the wing just in frame

Body (interim, scope facts only; replace with the client's own story when it arrives)
- H2: What you can book
- Text: Flights and hotel rooms. Search flights by where you're leaving from, where you're going, your dates, how many people are traveling and the cabin you want. Search hotels by city, dates, guests and rooms. Results show the total price, and you can filter and sort them until the right one is at the top.
- Flights-only text: Flights. Search by where you're leaving from, where you're going, your dates, how many people are traveling and the cabin you want. Results show the total price, and you can filter them by airline, stops, travel time and price.
- H2: How booking works
- Text: Choose a flight and fare, or a hotel and room, and add the travelers' details. Just before you pay, we check the price and availability again with the airline or hotel, so you book what's really there. You pay by card through Stripe. Your confirmation, booking reference and itinerary come to you by email.
- Full-width photo alt: Late light across a wing and a bank of cloud
- H2: Your bookings, in one place
- Text: With an account you can see your upcoming and past bookings, their references and the travel documents the airline issues, on your phone or your computer.
- H2: Talk to us
- Text: Call +1 (555) 010-0199 or email hello@example.com. If it's about a trip, have your booking reference ready.

## Contact
Meta title: Contact us | Overwing
Meta description: Call or email Overwing about a booking, a payment or anything else on the site. Have your booking reference ready.
- H1: Contact us
- Intro: Call or email us about a booking, a payment or anything else on the site. If it's about a trip, have your booking reference ready. It's in your confirmation email.
- Details: label "Phone", +1 (555) 010-0199; label "Email", hello@example.com
- No support hours and no address: the client hasn't given them (see Questions).
- Photo alt: A phone and a folded paper map on a café table by a window
Form (H2: Send us a message)
- Fields: Name; Email; Booking reference (optional), help "Six letters and numbers, for example K7MQ2D"; Message
- Button: Send message
- Errors: Enter your name. Enter an email address like name@example.com. Write a message. A booking reference has 6 letters and numbers.
- Demo result (the simulated build must say this, never a fake success): This is a demo, so your message wasn't sent anywhere. On the live site it will reach our support inbox.
- Live success, for later: Thanks, your message is on its way. We'll reply to maya.okafor@example.com.
- Live failure, for later: Your message didn't send. Try again, or email hello@example.com.

## Terms and Privacy
Terms
- Meta title: Terms and conditions | Overwing
- Meta description: The terms for booking flights and hotels on Overwing.
- H1: Terms and conditions
- Notice: The terms for booking flights and hotels on Overwing will be published here before the site takes real bookings. This demo takes no bookings and charges no cards.
- Line: Questions in the meantime? Email hello@example.com.
Privacy
- Meta title: Privacy policy | Overwing
- Meta description: How Overwing collects, uses and protects your details.
- H1: Privacy policy
- Notice: How Overwing collects, uses and protects your details will be set out here before the site takes real bookings. This demo takes no bookings and charges no cards.
- Line: Questions in the meantime? Email hello@example.com.
No last-updated date: there is no real document to date yet. The legal text itself must come from the client or their lawyer.

## 404 and error
404
- Meta title: Page not found | Overwing
- H1: We couldn't find that page
- Line: The link may be broken, or the page may have moved. Start a new search or go back to the home page.
- Buttons: Start a search; Go to the home page (link)
- Window: decorative, alt="".
Error (500)
- Meta title: Something went wrong | Overwing
- H1: Something went wrong on our side
- Line: Please try again in a moment. If you were paying, check Bookings or your email first, so you don't book twice.
- Buttons: Try again; Go to Bookings (link)

## Cookie notice
Only if the client's market needs one, and only if the site sets cookies beyond the essentials (see Questions).
- Text: We use essential cookies to keep you logged in and remember your search. With your OK, we'd also use cookies to see how the site is used.
- Buttons: Accept; Reject
- Link: Cookie settings
- Settings panel: heading "Cookie settings"; rows "Essential, always on: keep you logged in and your booking in progress"; "Analytics: help us see which pages people use"; button "Save settings".
- If the site sets essential cookies only, drop the buttons and show nothing, or one line: "We use essential cookies to keep you logged in and remember your search."

---

# Email
Sender name: Overwing. Every email ends with the same footer:
- Questions? Call +1 (555) 010-0199 or email hello@example.com. Include your booking reference.
- The demo notice (as in the site footer) while placeholders remain.
- You're getting this email because of a booking or account on Overwing.

## Flight booking confirmed
- Subject: You're booked: London to Lisbon on Fri, Nov 20
- Preview text: Booking reference K7MQ2D. Your flights, travelers and e-ticket numbers are inside.
- H1: You're booked, Maya
- Reference box: Booking reference K7MQ2D
- Itinerary table: Outbound, Friday, November 20, 2026, 07:05 London Heathrow to 09:50 Lisbon, Kittiwake Air KT 412, nonstop. Return, Friday, November 27, 2026, 10:40 Lisbon to 13:15 London Heathrow, Kittiwake Air KT 413, nonstop.
- Travelers: Maya Okafor, e-ticket 910 2604 118352; Daniel Okafor, e-ticket 910 2604 118353
- Fare: Classic. Includes a small bag, a cabin bag and 1 checked bag of 23 kg per traveler.
- Paid: $1,284.60 with Visa ending 4242
- Before you fly: Check in with Kittiwake Air online before you go, using booking reference K7MQ2D. Bring the passport or ID you entered for each traveler.
- Button: View your booking

## Hotel booking confirmed
- Subject: You're booked: Casa Lanterna, Lisbon, from Fri, Nov 20
- Preview text: Booking reference S4T9LW. Check-in from 15:00 on Friday, November 20.
- H1: You're booked, Maya
- Reference box: Booking reference S4T9LW
- Stay table: Casa Lanterna, Alfama, Lisbon, Portugal. Courtyard Double, 2 adults. Check in Friday, November 20, 2026, from 15:00. Check out Tuesday, November 24, 2026, until 11:00. 4 nights.
- Paid: $744.00 with Visa ending 4242
- Cancellation: Free cancellation until 23:59 hotel time on Tuesday, November 17, 2026. After that, this booking can't be refunded.
- Button: View your booking

## Booking canceled
- Subject: Your booking K7MQ2D is canceled
- Preview text: Your flights from London to Lisbon on Fri, Nov 20 are canceled.
- H1: Your booking is canceled
- Body: Your flights from London to Lisbon on Friday, November 20, 2026 are canceled. The airline is refunding $612.00 to your Visa ending 4242. Your bank may take several business days to show it.
- No-refund version: Your flights from London to Lisbon on Friday, November 20, 2026 are canceled. Under the fare rules, this booking had no refund.
- Button: View your booking

## Flight times changed (only if the build receives airline changes from Duffel)
- Subject: Kittiwake Air changed your flight times: K7MQ2D
- Preview text: Your outbound flight on Fri, Nov 20 now leaves at 07:40.
- H1: Your flight times have changed
- Body: Kittiwake Air has changed your outbound flight on Friday, November 20, 2026. It now leaves London Heathrow at 07:40 and lands in Lisbon at 10:25. If the new times don't work for you, contact us with your booking reference.
- Button: See your booking

## Reset your password
- Subject: Reset your Overwing password
- Preview text: The link works once and expires soon.
- H1: Reset your password
- Body: We got a request to reset the password for this email address. Use the button to choose a new one. The link works once and expires after a short time. If you didn't ask for this, ignore this email and your password stays the same.
- Button: Choose a new password

## Password changed
- Subject: Your Overwing password was changed
- Preview text: If this wasn't you, reset it now.
- H1: Your password was changed
- Body: The password for your Overwing account was changed on Tuesday, November 10, 2026. If this wasn't you, reset your password now and contact us.
- Button: Reset password

---

# Flights-only variants (if the Duffel Stays account is not approved)
One place to find every swap.
- Hero headline: Fly there and back (backup: Where are you flying next?)
- Hero subline: Search flights and see the full total before you pay
- Search: no Flights / Hotels toggle; phone trigger label "Flights".
- Entry card 2: "Every booking and e-ticket number in your account", button "See your bookings".
- Trust panel fact 2: Just before you pay, we check the price again with the airline and show the total with taxes and fees.
- Footer "Book" column: Flights only. Demo notice: the flights-only version above.
- Home meta description: Search flights, compare them by price, time and stops, and see the full total, taxes and fees included, before you pay with Stripe.
- About: banner line and "What you can book" text, flights-only versions above.
- Searching state "Still looking" lines, results, checkout, account and email copy already work for flights alone. Drop the hotel pages, the hotel emails, and the word "hotel" from shared lines ("Checking the price with the airline").

---

# Mock data set (simulated backend)
All of it is fiction for the demo. Airline and hotel names are invented on purpose: real airlines and hotels must never appear with made-up prices or rules. A quick search found no airline or hotel using these names, but they are not trademark-checked. The airline codes in the tiles are for the demo only; some two-letter codes belong to real airlines, so they must never reach production fixtures, which will use Duffel's real data.

## Defaults
- Default origin for destination prices: London (LHR). A placeholder: the client's market sets the real one.
- Demo flight search: London Heathrow to Lisbon, return, Fri, Nov 20 to Fri, Nov 27, 2026, 2 adults, Economy.
- Demo hotel search: Lisbon, Fri, Nov 20 to Tue, Nov 24, 2026, 4 nights, 2 adults, 1 room.
- Demo account: Maya Okafor, maya.okafor@example.com, +1 (555) 010-0142. Saved traveler: Daniel Okafor, adult.
- Card: Visa ending 4242 (Stripe's test card).

## Airlines
| Name | Tile code | Flight numbers used |
|---|---|---|
| Kittiwake Air | KT | KT 412, KT 413, KT 418, KT 419 |
| Tern Atlantic | TQ | TQ 1360, TQ 1361 |
| Larkspur Airways | LP | LP 207, LP 208 |
| Petrel Air | PQ | PQ 30, PQ 31, PQ 744, PQ 745 |
| Wren Air | WE | WE 512, WE 513, WE 90, WE 91 |

## Flight offers, London Heathrow to Lisbon (totals for 2 adults, Light fare unless noted)
Times are local; London and Lisbon share a time zone in November, Madrid and Barcelona are one hour ahead.
| Airline | Outbound, Fri, Nov 20 | Return, Fri, Nov 27 | Total |
|---|---|---|---|
| Kittiwake Air | 07:05 LHR to 09:50 LIS, 2h 45m, nonstop | 10:40 LIS to 13:15 LHR, 2h 35m, nonstop | $1,098.60 |
| Tern Atlantic | 12:20 LHR to 15:05 LIS, 2h 45m, nonstop | 16:00 LIS to 18:35 LHR, 2h 35m, nonstop | $936.00 |
| Larkspur Airways | 18:45 LHR to 21:30 LIS, 2h 45m, nonstop | 06:55 LIS to 09:30 LHR, 2h 35m, nonstop | $902.40 |
| Petrel Air | 06:10 LHR to 11:20 LIS, 5h 10m, 1 stop, MAD (1h 30m) | 13:05 LIS to 18:35 LHR, 5h 30m, 1 stop, MAD (1h 45m) | $824.00 |
| Wren Air | 09:15 LHR to 15:30 LIS, 6h 15m, 1 stop, BCN (2h 05m) | 07:30 LIS to 13:25 LHR, 5h 55m, 1 stop, BCN (1h 50m) | $871.20 |
| Kittiwake Air | 19:30 LHR to 22:15 LIS, 2h 45m, nonstop | 14:05 LIS to 16:40 LHR, 2h 35m, nonstop | $1,042.60 |
- Aircraft: Airbus A320neo (Kittiwake Air), Airbus A321 (Tern Atlantic), Boeing 737-800 (Larkspur Airways), Embraer 195 (Petrel Air), Airbus A319 (Wren Air).
- Terminals: Heathrow Terminal 2 for Kittiwake Air and Tern Atlantic, Terminal 3 for the rest; Lisbon Terminal 1.
- Pad the list to 86 offers with variations of these; the cheapest stays $824.00 so the Lisbon card's "Return from $412" holds.

## Fares on the demo flight (Kittiwake Air, nonstop, 2 adults)
| Fare | Total | Included | For a fee | Not included |
|---|---|---|---|---|
| Light | $1,098.60 | 1 small bag under the seat; Seat assigned at check-in | Cabin bag in the overhead locker; Checked bag; Choose your seat; Changes before departure, $75 per traveler plus any fare difference | Not refundable |
| Classic | $1,284.60 (+$186.00) | 1 small bag under the seat; 1 cabin bag, 10 kg; 1 checked bag, 23 kg; Choose a standard seat | Changes before departure, $75 per traveler plus any fare difference | Not refundable |
| Flex | $1,512.60 (+$414.00) | 1 small bag under the seat; 1 cabin bag, 10 kg; 1 checked bag, 23 kg; Choose any standard seat; Changes before departure, you pay only any fare difference; Refund before departure, minus $50 per traveler | | |
- Demo booking: Classic, $1,284.60 = flights $1,068.00 + taxes and fees $216.60.
- Online cancellation quote on the demo booking: refund $612.00.

## Destination cards (return fare for one adult from London)
Lisbon $412; Rome $389; New York $684; Mexico City $1,046; Tokyo $1,212; Cape Town $1,138.

## Hotels
All prices for Fri, Nov 20 to Tue, Nov 24, 4 nights, 2 adults, taxes and fees included.
| Hotel | Area | Stars | From a night | Total | Card description (two lines) | Card amenities |
|---|---|---|---|---|---|---|
| Casa Lanterna | Alfama, Lisbon | 4 | $186 | $744 | A restored townhouse on a stepped lane below the castle, with a tiled courtyard and a roof terrace over the river. | Free wifi, Breakfast, Roof terrace |
| Cais Verde Hotel | Cais do Sodré, Lisbon | 4 | $214 | $856 | A modern hotel on the riverfront, two minutes' walk from the ferries and the train to the coast. | Free wifi, Gym, Bar |
| Pátio Quinze | Príncipe Real, Lisbon | 3 | $158 | $632 | Twelve rooms around a planted courtyard on a quiet street near the Príncipe Real garden. | Free wifi, Breakfast, Garden |
| Ladeira Rooms | Graça, Lisbon | 2 | $97 | $388 | Simple, bright rooms at the top of the hill, with a shared lounge and kitchen for guests. | Free wifi, Shared kitchen, Luggage storage |
| Ribeira Lofts | Santos, Lisbon | 3 | $171 | $684 | Apartment-style rooms with a small kitchen in each, a short walk from the river and the tram. | Free wifi, Kitchen, Washing machine |
| Albergo Tre Finestre | Monti, Rome | 3 | $164 | $656 | A family-run hotel on a cobbled street in Monti, a ten-minute walk from the Colosseum. | Free wifi, Breakfast, Air conditioning |
| Hotel Kumo Asakusa | Asakusa, Tokyo | 4 | $203 | $812 | A compact, quiet hotel by the Sumida River, with a public bath on the top floor. | Free wifi, Public bath, Laundry |
| The Halyard Hotel | Dumbo, Brooklyn, New York | 4 | $289 | $1,156 | A converted warehouse by the East River, with tall windows and a rooftop bar facing Manhattan. | Free wifi, Gym, Rooftop bar |
- Other cities in the search list (Paris, Barcelona, Amsterdam, Mexico City, Cape Town, Sydney) have no hotels in this set. Either reuse these patterns or let those searches show the "No rooms" state. Your call; a full demo looks better with at least one hotel per city.

## Casa Lanterna, full detail (the demo hotel)
Description (shown in two lines on the page, in full under "Read more")
A restored townhouse on a stepped lane below the castle, with 18 rooms over four floors. The upper rooms look across the rooftops of Alfama to the river. Breakfast is served in the tiled courtyard until 11:00, and guests can use the roof terrace until late. The Baixa and the riverfront are about ten minutes' walk downhill, and the 28 tram stops at the end of the street.

Amenities (first six shown; all 12 in the dialog)
Free wifi; Breakfast available; Roof terrace; Air conditioning; Elevator; 24-hour front desk; Luggage storage; Non-smoking rooms; Courtyard; Daily housekeeping; Hairdryer; Safe in room.

Rooms
| Room | Spec line | Inclusion rows | A night | Total |
|---|---|---|---|---|
| Courtyard Double | 1 double bed, sleeps 2, courtyard view | Free cancellation until Nov 17; Breakfast included; Pay now by card | $186 | $744 |
| River View Double | 1 king bed, sleeps 2, river view | Free cancellation until Nov 17; Breakfast included; Pay now by card | $238 | $952 |
| Terrace Suite | 1 king bed and a sofa bed, sleeps 3, private terrace | Non-refundable; Breakfast included; Pay now by card | $342 | $1,368 |
- Demo booking: Courtyard Double, $744.00 = room $640.00 + taxes and fees $104.00.
- Room photo alts: "Courtyard Double at Casa Lanterna", "River View Double at Casa Lanterna", "Terrace Suite at Casa Lanterna".

Policies
- Check-in: From 15:00. Check-out: Until 11:00.
- Cancellation: Free cancellation until 23:59 hotel time on Tue, Nov 17. After that, the booking can't be refunded. The Terrace Suite rate is non-refundable from the moment you book.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Children and extra beds: Children of all ages are welcome. A cot is available on request, free of charge. The Terrace Suite has a sofa bed for a third guest.
- Pets: Pets aren't allowed.
- Accessibility: An elevator serves all floors. The lane outside has steps, so ask the hotel about step-free arrival before you book.
- Address line: Alfama, 1100 Lisbon, Portugal (no street number: a made-up address could point at someone's real door).

## Bookings in the demo account
| Booking | Dates | Reference | Status | Booked |
|---|---|---|---|---|
| London to Lisbon, Kittiwake Air, 2 adults, Classic | Fri, Nov 20 to Fri, Nov 27, 2026 | K7MQ2D | Confirmed | Nov 3, 2026 |
| Casa Lanterna, Lisbon, Courtyard Double | Fri, Nov 20 to Tue, Nov 24, 2026 | S4T9LW | Confirmed | Nov 3, 2026 |
| London to Rome, Tern Atlantic, 2 adults | Sat, Sep 12 to Wed, Sep 16, 2026 | R8DWQ4 | Completed | Aug 2, 2026 |
| Albergo Tre Finestre, Rome | Sat, Sep 12 to Wed, Sep 16, 2026 | H2LNC7 | Canceled | Aug 2, 2026 |
- E-ticket numbers on K7MQ2D: 910 2604 118352 (Maya Okafor), 910 2604 118353 (Daniel Okafor).

---

# Notes for the Developer
1. **Price filter.** The PRD lists airline, duration, stops and price filters. The spec's filter column has Stops, Airlines, Departure time and Duration only. Copy for a Price group is above; please add it.
2. **Contact address.** The spec mentions "the placeholder address" on Contact, but no placeholder address was approved. I left the address and support hours out rather than invent them.
3. **About body.** The spec says the About body stays empty (a CLIENT COPY REQUIRED comment) until the client writes it. Varun wants complete-looking pages, so I wrote an interim body from scope facts only. Keep the CLIENT COPY REQUIRED comment above it for the company story.
4. **Trust panel, fact 4.** The spec's working line "Help from a real person" makes a claim about staffing that the client hasn't made. The copy says "call or email us" instead.
5. **"Price held" became "Price valid".** Duffel offers aren't held; they're valid until they expire.
6. **E-tickets are numbers.** Duffel returns e-ticket numbers as travel documents, not PDF files, so the confirmation lists numbers, with no download link. If Duffel returns document files for an airline, add "Download" next to the number.
7. **Payment order.** The failure copy assumes the card is authorized first and charged only after the airline or hotel confirms. If the build charges first and refunds on failure, the "couldn't confirm" copy must change. Tell me and I'll rewrite it.
8. **US English.** The spec's dashboard tab "Cancelled" is "Canceled" here, to match the USD and "Travelers" placeholders. Change everything at once if the market turns out British.
9. **Gender field.** Duffel accepts female or male only for passengers. The help text says so plainly rather than hiding it.
10. **Meta.** Every booking, account and confirmation page is noindex. While the demo notice stands, the whole demo should be noindex.
11. **Stripe's field labels** come from the Payment Element and are not in this file.
12. **Alt texts** for stock slots describe the shots the spec asks for. Check each one against the photo actually used.

---

# Questions for the client
Most important first. None of these were asked: Varun is away and asked the studio to run straight through.
1. **Name and brand.** What is the business called, and does it have a logo and a domain? "Overwing" is a working name and must not ship.
2. **Hotels.** Is the Duffel Stays account approved? If not, the site uses the flights-only copy ("Fly there and back").
3. **Contact and support.** Which phone number and email should customers use? What are the support hours, and is there a postal address to show? Do you want WhatsApp shown?
4. **Legal.** Which company sells the bookings (legal name, registration number, country)? Do you hold any licence or protection scheme you must display where you sell travel? Please send the Terms and conditions and Privacy policy from your lawyer; we won't write them.
5. **Market.** Which country and customers is this for, in which language and currency? Should spelling be US or British, and times 12-hour or 24-hour? Which city should destination prices start from?
6. **Fees.** Do you add a service fee or markup on top of the airline or hotel price? If yes, how should it show at checkout?
7. **Your story.** Who runs the business, from where, and why did you start it? Even a few lines lets us replace the interim About text, and a true fact (for example the year you started) can go in the footer.
8. **Changes and cancellations.** Where Duffel lets a booking be canceled online, should customers do it themselves on the site, or always contact you? Do you charge your own fee for changes or cancellations?
9. **Payments.** Should the card be charged before or after the airline or hotel confirms the booking? This changes what we tell people when a booking fails.
10. **Accounts.** Can people book without creating an account, or must they log in first? When someone deletes their account, what booking data do you keep, and for how long?
11. **Emails.** Besides the booking confirmation, which events should send an email: cancellations, airline schedule changes, payment receipts? Which address do they come from?
12. **Destinations.** Which cities do you want on the home page? Lisbon, Rome, New York, Mexico City, Tokyo and Cape Town are our placeholders.
13. **Cookies.** Will the site use analytics or any cookies beyond logging in? This decides whether a cookie notice is needed and what it says.
14. **Suppliers.** Is it fine to name Stripe on the site (we do, as a trust point)? We don't name Duffel anywhere. Tell us if you want it named.
15. **Social profiles.** Any accounts to link in the footer?

---

# What I left out, and why
- **Company story, founding year, team, location:** the client gave none. The About page carries scope facts only.
- **Support hours, address, WhatsApp:** no client facts. Phone and email use the approved placeholders.
- **Terms, privacy and cookie text:** legal text must come from the client or their lawyer. The pages carry a notice only.
- **Reviews, ratings, awards, customer counts, "trusted by", licences, guarantees:** none exist in the material, so the site claims none. Hotel star ratings are mock Duffel data, not reviews.
- **Price promises:** no "lowest price", "best price" or "no hidden fees" claims. The client's fee model is unknown, so the copy promises only that the total, with taxes and fees, is shown before payment, which the build does.
- **Seat choice, packages, deals, promo codes, loyalty, recommendations, chat:** out of the Phase 1 scope, so no copy invites them.
- **A welcome email:** not a booking event in the PRD. Easy to add if the client wants one.
- **Refund timings:** the cancellation copy says only that banks "may take several business days", with no number of days.
