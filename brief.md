# Brief: travel-booking (the client's name is not in the material)
Client material read: prd/Travel_Booking_Platform_Final_Scope.pdf (4 pages: Phase 1 scope, features not included, pricing, payment and communication policy). Varun says this PDF is the only client material. There is no assets/ folder.
Project type: custom [stated: "Custom responsive website design and UI/UX"]. This is a web application with accounts, payments and a backend, not a brochure site [inferred]. We build custom first either way.

How to read the marks: [stated] means it is written in the PDF, or in Varun's note for this run. The PDF is a scope and pricing proposal written by the seller ("we") to the client. It is not in the client's own words [inferred: "we have outlined everything included in Phase 1", "Looking forward to your confirmation"]. It tells us the agreed functions. It says almost nothing about the client's brand, market, audience or taste.

## 1. The client in one paragraph
The client wants "a functional B2C travel booking MVP" where customers search flights and hotels, choose an option, book it and pay through Stripe [stated]. Flights come from the Duffel API and hotels from Duffel Stays [stated], so the client resells supplier inventory and owns none of it [inferred]. This is Phase 1, "a Core Travel Booking MVP, not a complete Booking.com-level platform", to be "expanded through future development phases" [stated]. The client measures the idea against Booking.com: the PDF spends a whole page on what Phase 1 leaves out compared with it [stated], which suggests the client raised Booking.com in the talks [inferred]. The client negotiated the price from $3,500 down to $3,000, and the PDF offers a reduced scope at $2,800 in case "your budget is limited" [stated], so they watch costs [inferred]. The PDF does not say whether the client accepted; it ends by asking for confirmation [stated]. The PDF does not give the client's name, brand, country, target market, or whether they already run a travel business [stated: none of these appear in it].

## 2. What they sell, most important first
1. Flight bookings through Duffel [stated]. Search by "origin, destination, dates, passengers, and travel class"; filters for airline, duration, stops and price; flight details and fare information; booking; confirmation and "available travel documents" [stated]. Flights come first because the PDF lists them first, in the most detail, with no conditions attached [inferred]. Duffel returns e-tickets as the travel documents [inferred, from Duffel's changelog].
2. Hotel stays through Duffel Stays [stated]. Search by "destination, check-in/check-out dates, guests, and rooms"; hotel details, room options, room selection, pricing and availability, booking [stated]. Conditional: hotels "will depend on the approved Duffel Stays account" [stated].
3. A customer account that keeps every booking: profile, dashboard, upcoming and previous bookings [stated].
- Not mentioned, so not products in Phase 1: flight and hotel packages, car hire, insurance, activities [inferred].
- How the client makes money (service fee, markup or commission) is not stated [stated: not in the PDF]. It decides how prices and fees show at checkout [inferred].

## 3. Who buys, and how they decide
- Consumers, "B2C" [stated]: individual travellers and families booking for themselves, not companies [inferred].
- On desktop, tablet and mobile [stated].
- Which country, which routes, which kind of traveller: not stated [stated: not in the PDF].
- How they decide [inferred, from industry reading]:
  - Flights: total price first, then journey time, stops and airline. Hotels: photos, location, price per night, cancellation terms.
  - Trust is the main hurdle for a new, small booking site. One UX study found travellers "distrust 3rd-party travel sites" and book flights with airlines instead ([source](https://medium.com/@hope_magracia/redesigning-travelocitys-responsive-website-a-ux-case-study-5ca4e5476d1f)). What helps: secure-payment markers and a clear cancellation policy on the booking page ([source](https://profitroom.com/articles/the-new-trust-economy-what-it-means-for-hotel-bookings)), shown where people hesitate, before payment, and kept on mobile checkout ([source](https://resources.rework.com/libraries/travel-tour-growth/trust-building-for-travel-businesses)); a real address and contact details, and no stock photos ([source](https://www.travellinglark.com/blog/how-to-identify-trusted-tour-agents-online-red-flags-and-tips)).
  - Many compare prices across several sites before buying, so the price shown first should be the price they pay [inferred].
  - They decide against a clock: a Duffel flight offer usually expires within about 30 minutes, and Duffel recommends fetching the offer again just before booking ([source](https://help.duffel.com/hc/en-gb/articles/360021052820-What-happens-when-an-offer-expires), [source](https://duffel.com/docs/api/overview/test-your-integration)) [inferred].

## 4. What the site must make people do: primary action, then secondary
- Primary: search for a flight and book it, paying by card through Stripe [stated: the flows; inferred: flights rank above hotels].
- Secondary:
  - Search for a hotel and book a room [stated].
  - Create an account or log in, and come back to see bookings, itineraries and documents [stated].
  - Contact the company [stated: Contact Us page].
- The homepage exists to start a search: "Homepage with flight and hotel search functionality" [stated]. So the search form is the hero's call to action [inferred].

## 5. Pages and sections: requested [stated] and needed [inferred]
Requested [stated]:
- Public pages
  - Homepage with flight and hotel search
  - About Us, Contact Us, Terms & Conditions, Privacy Policy
- Flights
  - Flight search: origin, destination, dates, passengers, travel class
  - Flight results with filters (airline, duration, stops, price) and sorting
  - Flight details and fare information
  - Passenger information form
- Hotels
  - Hotel search: destination, check-in and check-out, guests, rooms
  - Hotel results with basic filters and sorting
  - Hotel details with room options, room selection, pricing and availability
  - Guest information form
- Booking and payment
  - Checkout with Stripe
  - Successful and failed payment handling
  - Booking confirmation page with booking reference and itinerary
- Account
  - Register, log in, log out, forgot password, password reset
  - Profile management
  - Dashboard with upcoming and previous bookings and booking details
- Email
  - Booking confirmation email, and basic emails for "relevant booking events"

Needed [inferred]:
- States the scope implies: searching (live API searches take seconds), no results, fare changed, fare expired. The scope asks for "Fare and availability revalidation before booking", and Duffel offers expire.
- Search controls: airport and city autocomplete, date range picker, passengers and class picker, guests and rooms picker, each with a mobile version (full-screen pickers, a filter drawer).
- A booking summary that stays with the user through checkout (sticky on desktop, collapsible on mobile).
- E-ticket and travel documents on the dashboard's booking page.
- 404 and general error pages.
- A cookie notice, if the client's market requires one.
- Email templates that match the site.
- Homepage sections beyond search are not defined. Candidates: why book with us (trust), how booking works, popular routes or destinations, support contact. Each needs real client content; none can be invented.
- Admin: "Basic role-based access" is in scope, an "Advanced admin dashboard" is not [stated]. Whether any admin screens are expected is unclear.

## 6. Assets: what the client has, what is missing
- The client sent nothing: no logo, no photos, no video, no fonts, no brand colors, no existing site text [stated, Varun's note].
- At run time the APIs bring some media [inferred, from Duffel docs]:
  - Hotel and room photos from Duffel Stays, on results and hotel pages only. Quality varies by property; Duffel has been improving image quality ([source](https://changelog.duffel.com/announcements/ann_ZL8lz5QIGf7Dw)).
  - Airline names and logos with flight offers (confirm the logo fields in Duffel's docs).
  - None of this can fill the homepage, About page or footer.
- Missing:
  - Business name, logo, colors and type. This blocks art direction.
  - Any photo or video for the homepage and About page. Anti-slop rule: no placeholder labels; when real media is missing, use custom illustration.
  - About Us content: who runs the business, where, since when.
  - Contact details: email, phone, address, support hours, WhatsApp if they want it shown. Varun's footer leads with phone and email.
  - Terms & Conditions and Privacy Policy text. Legal text must come from the client or their lawyer; we should not write it.
  - Trust proof: reviews, company registration, any licence to sell travel in their market.

## 7. The client's preferences: likes, dislikes, sites they mentioned, their own words
- Likes: none stated.
- Dislikes: none stated.
- Sites mentioned: Booking.com, as the benchmark for features [stated: "compared to a fully developed platform like Booking.com"]. Nothing says the client wants to look like it [inferred].
- The client's own words: none. Every quote in this brief is from the seller's proposal, so it describes the agreed scope, not the client's taste [inferred].
- The PDF's teal headings and check marks are the proposal's formatting, not the client's brand [inferred].

## 8. Voice: how the client talks
- No client-written text exists [stated, Varun's note].
- The PDF's voice ("complete transparency", "best and final price") is the seller's. Do not use it as the client's voice [inferred].
- Until we hear the client: plain, direct and reassuring, as a booking tool should be. Short labels, prices and rules said plainly, no travel-brochure hype [inferred].
- The Copywriter needs a sample of how the client talks; their WhatsApp messages would do [inferred].

## 9. Constraints: deadline, budget signals, platform, integrations, accessibility, licences
- Budget: $3,000 USD for Phase 1, down from $3,500, called the "best and final price"; a reduced scope at $2,800 is offered [stated]. That is tight for two supplier APIs, payments and accounts [inferred], so the design system must be reusable across many app screens rather than one-off sections per page [inferred].
- Payment through Fiverr only; WhatsApp for day-to-day communication [stated].
- Deadline: not stated.
- Platform: custom design [stated]; "Backend API development", "Database architecture and setup", customer and booking data, "Basic role-based access", input validation and error handling [stated]. The stack is not stated. Our convention (global CSS, global JS, one HTML file per page) fits the public pages. Results, checkout and dashboard render live data, so the Developer needs an app-stack decision [inferred].
- Integrations: Duffel flights, Duffel Stays, Stripe, email sending [stated]. The email provider is not stated.
- Hotels might not launch: they "will depend on the approved Duffel Stays account" [stated]. Design so the site still works with flights only [inferred].
- Duffel facts that shape the interface [inferred, from Duffel docs]:
  - Offers expire, usually within 30 minutes; fetch the offer again before booking.
  - Some airlines allow holding a booking to pay later ([source](https://duffel.com/docs/guides/holding-orders-and-paying-later)); hold orders are not in the Phase 1 list.
  - Hotel rates carry total and tax amounts and a cancellation policy ([source](https://duffel.com/docs/api/overview/stays-key-concepts)). Duffel marks the Stays schema as still subject to change ([source](https://duffel.com/docs/api/v2/accommodation)).
- Stripe: hosted Checkout would carry Stripe's look; an embedded payment form can be themed to the brand. A Developer decision [inferred].
- Out of scope [stated], and the design elements that removes [inferred]:
  - "Automated customer support, chatbot, or AI assistant": no chat launcher (unlike the Acrylic Pros mascot).
  - "Promotional campaigns, coupons": no promo code field, no deal banners.
  - Loyalty, rewards, membership: no points, no member prices.
  - "Multi-currency and multi-language functionality unless specifically agreed": one currency and one language, not yet named.
  - Recommendations and personalisation: no "recommended for you" rows.
  - Cancellation, refund and changes only "within the supported API functionality": the dashboard shows status and documents, with no self-serve change flow beyond what Duffel supports.
  - No Android or iOS apps.
- Accessibility: not stated. Forms and checkout must work by keyboard and with screen readers, with visible focus and clear error messages; WCAG 2.2 AA as our default [inferred].
- Licences: fonts must be licensed for web use; airline logos and hotel photos only as Duffel supplies them [inferred].
- Legal: selling flights and hotels may need registration or a licence, depending on the country. The terms must cover booking, payment and cancellation. That content is the client's responsibility [inferred].

## 10. Competitors (never used as a primary reference)
- Booking.com [stated, as the feature benchmark].
- Likely others, depending on the market [inferred]: Expedia, Hotels.com, Kayak, Skyscanner, Google Flights, Trip.com, Agoda, Kiwi.com, Hopper, Priceline, eDreams, Opodo, Momondo. Add regional booking sites once the market is known.

## 11. Open questions (at most 5)
Varun was not in this session, so these have not been asked. Most important first.
1. Brand: what is the business called, and does it have a logo, colors and a domain? If not, is a name and logo part of our job? It is not in the Phase 1 scope, and art direction cannot start without it.
2. Market: which country and customers is it for, in which single language and currency, and does the client already run a travel business (an agency, a route or community they serve)? This sets copy, imagery, popular routes and the legal pages. Does the client add a service fee or markup that checkout must show?
3. Media: with no photos or video, may we use licensed photography, or should the look be illustration-led and type-led (the anti-slop rule asks for custom illustration when real media is missing)? Duffel's hotel photos only cover results and hotel pages.
4. Deal and build: did the client accept the $3,000 full scope or the $2,800 reduced one, and what is the deadline? Who builds the backend (Duffel, Stripe, accounts), on which stack? Is the Duffel Stays account approved yet? Are any admin screens expected?
5. Content and taste: who supplies the About story, the contact details and the legal text? Has the client named any sites they like or dislike, beyond Booking.com as the feature benchmark?

## 12. Reference search plan
- Structure fit [inferred]: the primary reference must show
  - a homepage where a working tool (a search or booking form) is the hero's call to action, not a decorative button;
  - dense, comparable lists presented with care: results or listings with filters and sorting;
  - a detail page with a gallery and selectable options, like rooms or product variants;
  - a multi-step form or checkout with a summary that follows the user;
  - plain text pages: about, contact, legal.
  - Account and dashboard screens can come from a section donor.
- Media fit [inferred]: product-led and type-led. The search tool is the hero. There is no client photo or video, so the reference must look complete without full-screen footage, and must be able to carry custom illustration, or a little licensed photography if Varun approves. Results pages will show API hotel photos of mixed quality.
- Mood words [inferred; the client gave none]: calm, clear, trustworthy, light, quietly confident.
- In-niche keywords [inferred]: flight booking website, hotel booking website, travel booking engine, online travel agency design, flight search UI, travel startup site, itinerary design, boarding pass design, airline booking site.
- Synonyms for the niche [inferred]: online travel agency (OTA), travel booking platform, flight and hotel booking site, trip booking site, booking engine.
- Adjacent businesses (same world, different business) [inferred]: airlines' own booking sites, boutique hotel groups, rail ticketing, car rental, travel insurance, airport lounge and fast-track booking.
- Cross-niche analogies (world, and why) [inferred]:
  1. Airport wayfinding and departure boards: times, gates and changes readable at a glance under time pressure, which is the job of a results list.
  2. Neobanks and fintech: they earn trust from people handing money to a new name, with honest totals, calm numbers and a confident payment step.
  3. Rail timetables and ticketing: long structured itineraries (legs, connections, times) turned into clean typographic layouts.
  4. Luggage and travel-goods brands: they sell the feeling of travel without destination photos, through object, material and type.
  5. Editorial travel guides and magazines: a sense of place built from type and illustration instead of stock photos.
- Technique words [inferred]: search as hero, tabbed search (flights, hotels), date range picker, airport autocomplete, filter drawer, sticky booking summary, stepper checkout, boarding-pass card, ticket stub with perforation, route arc, itinerary timeline, skeleton loading, tabular numerals, split-flap type.
- Exclusions:
  - The client's own domains: not known yet; add them once the client is named [stated: no name or domain in the PDF].
  - The competitors in section 10 [stated: Booking.com; inferred: the rest].
  - Duffel's own site and demo apps: Duffel is the supplier, and its interface would read as a template [inferred].
  - Off-the-shelf travel booking themes and scripts [inferred].
  - Every project in evals/sealed.md [stated, studio rule].

## Varun's answers (checkpoint 1a, 2026-11-10)
1. Brand: the client has provided nothing. No name, logo, colors or domain. The studio uses a placeholder working name and a simple placeholder wordmark, both marked as placeholders, so the site can be designed and built now. They will be replaced when the client supplies a brand.
2. Market: the client has provided nothing. Until the client says otherwise, the studio uses placeholder defaults: English, one currency (USD), no service fee or markup shown beyond the taxes and fees in the fare data. Mark these as placeholders, not client facts.
3. Media: use stock photography for now. It will be swapped for client or licensed media later.
4. Deal and build: the client accepted the full $3,000 scope. This is a custom project, not WordPress, so no standalone HTML pages for the final build. Build it in Next.js (or another fit framework the studio picks). This pass is front end only, for the design: the backend is simulated (mock Duffel flight and hotel data, mock Stripe payment, mock accounts), so the client can click through every flow. Every page and screen in the scope gets built.
5. Content and taste: the client has provided nothing. No About story, contact details, legal text, or liked or disliked sites. Copy uses clearly marked placeholders for every client fact (name, contact details, address, legal entity, policies) and never presents an invented fact as real.

## Client feedback (relayed by Varun, 2026-11-11)
The client's words, verbatim:
> we are a clean, modern travel platform inspired by the ease of use of Booking.com, Expedia, and Priceline, with our own distinct identity.
>
> A direction we can explore is deep navy, white, and teal, paired with a clean, readable font. Please prioritize a prominent search section, easy navigation, clear pricing, strong travel imagery, and a polished mobile experience.

Varun's instruction with it: the two versions must be two completely different designs, not one design in two palettes. One is the cabin windows design (concept A, Overwing), the other the full photo hero (concept C, Landfall, shown in Harbour gold in prototype/audition.html). Different methods followed entirely, sharing no design resources.

## Varun's rulings, round 3 (2026-11-11)
- The client named Booking.com, Expedia and Priceline as the main reference websites and direct competitors.
- Both built designs rate about 6 out of 10 with Varun; the target is 9.2 on projects/travel-booking/benchmark-rubric.md (scored side by side against the three).
- Add "Recommended for you" rows and deal banners, running on the simulated backend, without flagging them as outside the scope. The rest of the out-of-scope list stands (no promo codes, loyalty or member prices, one currency and language, no app).
- Full notes: logs/round3-note.txt.
