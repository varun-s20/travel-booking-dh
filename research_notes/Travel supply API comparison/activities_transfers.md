# Tours, activities, attractions and airport transfer supply APIs for a small B2C OTA (research as of 12 Nov 2026)

Scope: Viator, GetYourGuide, Klook, TUI Musement, Tiqets, Hotelbeds (HBX Group) Activities and Transfers, Expedia activities (Rapid/EPS), Holibob, Bókun, and transfer specialists Mozio, Hoppa, Welcome Pickups, Jayride, Suntransfers and Booking.com Taxi. The buyer is a startup B2C OTA (Next.js, USD, English) that will add activities and transfers in a later phase.

Dating convention: "(page dated X)" means the date shown on the source. "(seen Nov 2026)" means the page carried no date and I read it during this research on 12 Nov 2026. Third-party aggregator figures are labelled as such. Several official pages (GetYourGuide partner portal, GetYourGuide help centre, Business Wire) refused automated fetches (HTTP 403 or empty page). Facts from those pages come from search-result snippets only and are flagged.

---

## 1. Inventory size (experiences, destinations, transfer coverage)

### Takeaway
On published figures, the largest experience catalogues are Klook (about 490k+ activities, 2022 figure), Viator (300k+ experiences, 2,500 destinations) and GetYourGuide (200k+ experiences, 18k cities, 2026). TUI Musement (88k experiences plus 125k transfer routes) and Expedia's activities API (about 180k–200k, status unclear) come next. Tiqets is the narrower specialist for attractions and museums (1,000+ cities). For transfers, Mozio (3,500+ airports and cities, 180+ countries) and Jayride (3,000+ providers) are the broadest aggregators. Welcome Pickups (350+ cities) is a curated meet-and-greet network. Hotelbeds publishes no hard transfer counts.

### Cited Findings
**Activities and attractions**
- Viator: over 300,000 experiences across 2,500 destinations (Viator partner site, seen Nov 2026; figure reported in a search summary of the official page). — [Viator Partner Resource Center](https://partnerresources.viator.com/)
- GetYourGuide: "200,000 experiences" from 50,000 supply partners (press release, March 2026). A June 2026 company release says "more than 200,000 experiences in 18,000 cities". — [Marketing Dive press release, 26 Mar 2026](https://www.marketingdive.com/press-release/20260326-getyourguides-global-brand-push-reframes-how-travelers-think-about-plannin); [Macau Business, summer 2026 trends release](https://macaubusiness.com/getyourguide-unveils-summer-2026s-three-defining-travel-trends/)
- GetYourGuide booked 33 million experiences in 2025 (press release). A LinkedIn post claims 18 million in H1 2026, which is a weak, unverified source. — [Yahoo Finance / GetYourGuide release](https://finance.yahoo.com/news/getyourguide-unveils-2026-hidden-trends-120000845.html); [LinkedIn](https://ch.linkedin.com/in/paulnta)
- Klook: "over 490,000 activities in over 1000 destinations" available to KAYAK users (Klook newsroom, 2022; old figure). An affiliate-network listing says 500,000+ activities across 2,300+ destinations (undated, third-party). — [Klook newsroom 2022](https://www.klook.com/newsroom/partnership-kayak-2022/); [Referly](https://marketplace.referly.so/affiliate-programs/klook)
- TUI Musement: its B2B API and white-label platforms give access to 88,000+ experiences, 1,000+ multi-day tour itineraries and 125,000+ transfer routes in 100+ countries. B2B is about half of the business's revenue (TUI Musement partner site, seen Nov 2026). — [TUI Musement partner news](https://partner.tuimusement.com/growth-in-tours-activities-with-new-commercial-team-focused-on-strategic-b2b-partners/)
- TUI Musement added 750 multi-day tours across 30 countries to the TravelExchange platform (Sept 2025). — [TUI Group newsroom](https://www.tuigroup.com/en/newsroom/news/tui-musement-strengthens-its-tours-activities-distribution-with-the-integration-of-750-multi-day-tours-across-30-countries-into-the-travelexchange-platform)
- Tiqets: available in 60+ countries, 1,000+ cities and 17 languages (Expedia acquisition announcement, 10 Dec 2025). — [Expedia Group IR](https://ir.expediagroup.com/news-and-events/news/news-details/2025/Expedia-Group-Announces-Agreement-to-Acquire-Tiqets-to-Expand-Global-Activities-and-Experiences/default.aspx)
- Expedia activities: older EPS materials list about 200,000 activities. A later Expedia-linked item describes a "Rapid Activities API" with 180,000+ activities across 212 markets. The sources conflict on whether the API is live or "coming soon", and the search summary did not say which page carried which figure. — [EPS supply page](https://expediapartnersolutions.com/about/our-supply); [Expedia partner blog: next-gen B2B tech](https://partner.expediagroup.com/en-gb/resources/blog/building-next-generation-of-b2b-travel-technology)
- Holibob: says it aggregates supply from 45+ API partners into one normalised catalogue (Holibob site, seen Nov 2026). It publishes no product count. — [holibob.tech](https://holibob.tech)
- Bókun (sourcing side): 2,600+ resellers, including 70+ global OTAs, on its marketplace (seen Nov 2026). Bókun is a supplier booking system and marketplace, not a ready consumer catalogue. — [Bókun APIs](https://www.bokun.io/es/grow/apis)
- Hotelbeds / HBX Group: describes "global transfer routes – including private and airport transfers" and directly contracted transfers. Emerging Travel Group got access to HBX's transfer inventory in June 2026. No experience or transfer counts were found. — [HBX Group IR, 2026](https://investors.hbxgroup.com/English/news/news-details/2026/HBX-Group-expands-its-transfers-offering-through-enhanced-collaboration-with-Emerging-Travel-Group-2026-ZKSVAt3iDW/default.aspx); [HBX B2B marketplace](https://www.hbxgroup.com/b2b-global-travel-marketplace)
- HBX extended transfers distribution into Latin America through Nemo (Sept 2025). Its experiences brand is Isango. HBX agreed to buy Bridgify, an aggregator of experiences (Skift, 2026). — [HBX/Nemo release](https://www.hbxgroup.com/news-room/press-release/hbx-group-partners-nemo-distribute-transfers-portfolio-latam); [Skift](https://skift.com/?p=817965)

**Transfers**
- Mozio: 3,500+ airports and cities, 3,000+ vetted providers, 180+ countries (Mozio site, seen Nov 2026). — [Mozio](https://www.mozio.com/); [Mozio business partners](https://www.mozio.com/business-partners)
- Welcome Pickups: drivers in 350+ cities and 4,500+ partners (partner API page, © 2011–2026). — [Welcome Pickups Travel API](https://partner.welcomepickups.com/travel-api/)
- Jayride: a marketplace of 3,000+ transfer providers. It acquired AirportShuttles.com in Feb 2023 (third-party summary). — [RideScouts comparison 2026](https://www.ridescouts.com/airport-transfer-services-comparison-6-marketplaces/)
- Booking.com: the Demand API developer site lists airport taxis as "coming soon" (seen Nov 2026). — [Booking.com Demand API](https://developers.booking.com/demand)

### Inferences
- For a US/English B2C site, Viator and GetYourGuide give the widest global coverage. Klook is strongest in Asia-Pacific. Tiqets is best for museum and attraction tickets with instant mobile delivery.
- For transfers, the realistic first choices are Mozio, for breadth and an API built for resellers, or Welcome Pickups, for a premium meet-and-greet product. TUI Musement and Hotelbeds bundle transfers with activities but require B2B contracts.

### Gaps
- No official 2026 inventory counts for Klook, Hotelbeds Activities, Hotelbeds Transfers (airports/routes), Hoppa, Suntransfers or Holibob.
- The Viator 300k/2,500 figure comes from a search summary of the official page. I could not confirm a 2026 date for it.
- Whether Tiqets inventory is being merged into Expedia's Activities API was not confirmed.

---

## 2. Model: affiliate commission vs full booking API (merchant of record, payments, customer service)

### Takeaway
Most providers offer two tracks. The affiliate track (deep links or widgets, or content-only API) pays commission while the supplier processes payment and handles customer service. The booking track lets the OTA take payment and own the checkout. Only Viator publishes a clear middle tier, "Full + Booking", where the customer books on your site but Viator stays merchant of record and handles customer service. That makes it the lowest-risk way for a startup to run checkout on its own site. Full merchant models (Viator Merchant, GetYourGuide Masterbill, TUI Musement, Hotelbeds, Mozio net-rate) put payment, refunds and customer service on the OTA.

### Cited Findings
**Viator** (most clearly documented)
- Viator has three affiliate levels. Basic is the default and self-service; customers book on viator.com. Full requires approval and certification; customers still book on viator.com. Full + Booking requires approval and certification; customers book on the partner site, and "Viator is the merchant of record and handles customer service." A separate Merchant API solution exists (article published 27 Sept 2021; footer © 1997–2025). — [Viator: Levels of access](https://partnerresources.viator.com/travel-commerce/levels-of-access/)
- Affiliates on Full + Booking must use the /cart endpoints (seen Nov 2026). — [Viator Partner API technical guide](https://docs.viator.com/partner-api/technical/)
- Merchant partners take full responsibility for financial records and transactions, customer support, cancellations and refunds, and set their own cancellation terms. Pricing is either markup (the partner sets retail and is invoiced partnerNetPrice + bookingFee) or commission (the partner sells at recommendedRetailPrice and earns a percentage). "All applicants will be evaluated and qualified by Viator" (seen Nov 2026). — [Viator merchant pricing](https://partnerresources.viator.com/travel-commerce/merchant/pricing/); [Viator merchant hub](https://partnerresources.viator.com/travel-commerce/merchant/); [Viator direct partner support for merchants](https://partnerresources.viator.com/travel-commerce/merchant/direct-partner-support/)
- Unverified: a third-party article (2026) says an August 2026 supplier agreement lets Viator and its channel partners set the final retail price, with operator payout tied to net rate. I could not confirm this in Viator documents. — [deeparrival.com](https://deeparrival.com/news/viator-tour-prices-different-booking-sites-2026/)

**GetYourGuide**
- The Partner API has a read-only tier (content, images, ratings, prices) and a separate booking tier, "Masterbill", where the partner is merchant of record with monthly billing. Partners must have a technical team. GetYourGuide "cannot guarantee full technical onboarding support" (help-centre text via search snippet; direct fetch returned 403; seen Nov 2026). — [GetYourGuide Partner help: API integration and requirements](https://partner.getyourguide.support/hc/en-us/articles/13981133907613-API-integration-and-requirements); [Partner API spec (GitHub)](https://code.getyourguide.com/partner-api-spec/spec/api.yaml)
- Standard affiliate (links and widgets): GetYourGuide processes payment and serves the customer on its own site (implied by the affiliate model; third-party reviews 2026). — [Petra on the Way review 2026](https://petraontheway.com/en/review-getyourguide-affiliate-program)

**Klook**
- Klook runs an in-house affiliate portal (affiliate.klook.com). Third-party sources mention a Partner API for "established platforms", but I found no official tier definitions. — [UpPromote Klook listing](https://uppromote.com/affiliate-directory/klook/); [Adivaha (vendor) Klook Partner API](https://www.adivaha.com/klook-partner-api.html)

**TUI Musement**
- The Partner API reference (v3.5.0) is aimed at "merchant or affiliate partners" and provides mock, sandbox and production servers. Payment options "depend on agreements made with the strategic partnerships team". The payments object includes an affiliate code field (seen Nov 2026). — [Musement Partner API reference](https://partner-api.musement.com/reference/openapi); [Payments](https://partner-api.musement.com/reference/openapi/payments)

**Tiqets** (now Expedia Group)
- Expedia agreed to acquire Tiqets on 10 Dec 2025, with closing expected in Q1 2026. Q1 2026 reporting indicates it closed: Expedia spent $279M on acquisitions in Q1, "driven by" Tiqets. A Skift source put the price at $250–300M. — [Expedia Group IR, 10 Dec 2025](https://ir.expediagroup.com/news-and-events/news/news-details/2025/Expedia-Group-Announces-Agreement-to-Acquire-Tiqets-to-Expand-Global-Activities-and-Experiences/default.aspx); [Skift, 10 Dec 2025](https://skift.com/2025/12/10/expedia-agrees-to-buy-experiences-platform-tiqets-to-bolster-its-b2b-offering/); [Yahoo Finance / Scoop, 2026](https://finance.yahoo.com/markets/stocks/articles/expedia-spent-279-million-acquisitions-192926831.html)
- Tiqets runs both an affiliate programme and a Distributor API. Named API partners include Klook, Fever, Hellotickets and Ctrip (seen Nov 2026). — [Tiqets API program](https://www.tiqets.com/partner-program/api-program)

**Hotelbeds (HBX Group)**
- This is a B2B wholesale model. Registration gives free test API keys for the Hotel, Activities and Transfers suites. Production access to activities and transfers depends on a Hotelbeds commercial contract and certification (Hotelbeds developer portal plus integrator pages, seen Nov 2026). — [Hotelbeds developer portal](https://developer.hotelbeds.com/); [Hotelbeds Transfers docs](https://developer.hotelbeds.com/documentation/transfers); [Hotelbeds Activities docs](https://developer.hotelbeds.com/documentation/activities)

**Expedia activities (Rapid/EPS)**
- Rapid Car API is in beta with selected partners, with full launch "early 2027". Expedia's technology-partner page lists car rentals and activities as "coming soon in 2027". A separate Expedia-linked item describes a Rapid Activities API (180k+ activities, 212 markets). The sources conflict. — [Rapid Car API BETA](https://partner.expediagroup.com/en-us/landing-pages/rapid-car-api-for-scalable-car-rental-bookings); [Rapid API certified technology partners](https://partner.expediagroup.com/en-us/solutions/build-your-travel-experience/rapid-api/certified-technology-partners-program)
- Expedia's Tiqets announcement says Tiqets will help build "the most comprehensive, global travel solution powered by expanded APIs, across activities, air, car and insurance" (10 Dec 2025). — [Expedia Group IR](https://ir.expediagroup.com/news-and-events/news/news-details/2025/Expedia-Group-Announces-Agreement-to-Acquire-Tiqets-to-Expand-Global-Activities-and-Experiences/default.aspx)
- A Business Wire release dated 19 May 2026 appeared in search results but could not be fetched (403). Its content is unverified. — [Business Wire, 19 May 2026](https://www.businesswire.com/news/home/20260519530379/en/)

**Holibob**
- Holibob offers a GraphQL API for products, availability, booking creation and confirmation, plus sandbox, admin tools and white-label storefronts. A free SDK for embedding bookable experiences launched after its June 2026 AI booking platform (third-party report, 2026). It acquired TourismSolved (date not confirmed). — [Holibob Docs: storefront](https://docs.holibob.tech/docs/platform-guide/storefront); [holibob.tech](https://holibob.tech); [Holibob blog: TourismSolved](https://holibob.tech/blog/holibob-acquires-digital-marketing-platform-tourismsolved)

**Bókun**
- Bókun is the supplier-side booking system and marketplace (owned by Tripadvisor; ownership not re-verified here). It connects suppliers to resellers through an OCTO-based API. A reseller (OTA) can contract directly with suppliers on the marketplace. OTAs such as Tiqets vet each proposal (seen Nov 2026). — [Bókun APIs](https://www.bokun.io/es/grow/apis); [Bókun docs: connect to Tiqets](https://docs.bokun.io/docs/otas-online-travel-agencies/how-to-connect-to-otas-through-the-marketplace/how-to-connect-to-tiqets)

**Transfers**
- Mozio offers an API, white label and an embeddable widget. Travel agents can set their own markup (percentage or flat fee), on revenue-share models. There are no sign-up fees and terms are negotiated (Mozio site, seen Nov 2026). — [Mozio travel agents](https://www.mozio.com/travel-agents); [Mozio GDS/tech platforms](https://www.mozio.com/gds-platforms)
- Welcome Pickups offers an API, where you integrate into your own booking engine with branding and control of the flow, or an affiliate booking widget. Both earn "commissions on every successful booking". The page does not say who processes payment or who handles customer service for API bookings (© 2011–2026). — [Welcome Pickups Travel API](https://partner.welcomepickups.com/travel-api/)
- Jayride offers an API route ("full API connectivity, quoting and booking API", negotiated % commission on travelled bookings) or an affiliate route with tracking links (agent deck, March 2024). — [Jayride Agent Partnerships 2024 (PDF)](https://www.jayride.com/wp-content/uploads/2024/03/Jayride-Agent-Partnerships-2024.pdf)
- Hoppa and Suntransfers: affiliate programmes found (Awin/FlexOffers for Hoppa; CJ for Suntransfers). I found no public reseller API for either. — [Awin Hoppa profile](https://ui.awin.com/merchant-profile/5511); [Suntransfers affiliate program](https://www.suntransfers.com/affiliate-program)
- Booking.com: taxis appear in the Demand API as "coming soon". Demand API access requires the Affiliate Partner Programme. Per a third-party guide, the full Demand API is for Managed Affiliate Partners under a signed contract (seen Nov 2026). — [Booking.com Demand API](https://developers.booking.com/demand); [Elfsight guide 2026](https://elfsight.com/blog/how-to-get-and-use-booking-com-api-partnership-and-integration/)

### Inferences
Provider snapshot (my synthesis of the cited findings above):

| Provider | Affiliate (supplier is merchant) | Book on own site, supplier is merchant | OTA is merchant (net/markup) | Startup fit |
|---|---|---|---|---|
| Viator | Yes, Basic (self-serve) and Full | Yes, Full + Booking | Yes, Merchant API (qualified) | High |
| GetYourGuide | Yes, links, widgets, read-only API | Not documented | Yes, Masterbill | High for affiliate, medium for API |
| Klook | Yes, in-house portal | Unclear | Partner API (terms unclear) | Medium (APAC-strong) |
| Tiqets (Expedia) | Yes | Unclear | Distributor API (about 200 orders/month minimum) | Medium, later phase |
| TUI Musement | Affiliate code exists | Unclear | Yes, by agreement | Low–medium (contract-led) |
| Hotelbeds Act. + Transfers | No | No | Yes (B2B contract) | Low early, higher once hotels contracted |
| Expedia activities | n/a | n/a | Rapid (status unclear, maybe 2027) | Watch |
| Holibob | n/a | White label | API (commercials not public) | Medium |
| Bókun | n/a | n/a | Direct supplier contracts (OCTO) | Later, local supply |
| Mozio | Widget/white label | White label | API with own markup | High for transfers |
| Welcome Pickups | Widget | API | API commission | High (premium) |
| Jayride | Links | — | API, negotiated commission | Medium |
| Hoppa / Suntransfers | Yes (Awin/CJ) | No | No public API | Affiliate-only |
| Booking.com Taxi | Affiliate programme | — | "Coming soon" in Demand API | Watch |

- Suggested phase path: start with Viator Full + Booking. Customers check out on your Next.js site while Viator remains merchant of record and handles customer service, which avoids chargeback and refund operations. Add GetYourGuide by affiliate links. Use Mozio or Welcome Pickups for transfers. Move to merchant or net models only once volume justifies running customer service and payments yourself.

### Gaps
- Holibob's commercial model (commission vs SaaS fee vs net rates) is not public.
- Klook API tiers and merchant terms are not officially published. Who processes payment for Klook API bookings is unknown.
- Who handles payment and customer service on Welcome Pickups API bookings is not stated.
- Whether Tiqets' distributor and affiliate programmes changed after the Expedia takeover in 2026 is unknown.
- The content of the 19 May 2026 Expedia Business Wire release could not be read.

---

## 3. Commission rates and pricing, minimum traffic, approval criteria

### Takeaway
The headline affiliate rate for experiences is about 8%: Viator 8% (official, 30-day window), GetYourGuide about 8% (third-party; official page not readable) and Tiqets 7–8% (third-party). Klook pays category-based rates of 2–20%, with tours at about 6.5% and attractions at about 5% (affiliate network, Q2 2026). Transfer affiliates pay about 4–8% (Hoppa). Mozio, Jayride and Welcome Pickups API commissions are negotiated and unpublished. Viator Basic has no traffic minimum. Tiqets' Distributor API asks for about 200 orders a month. Hotelbeds and TUI Musement are contract-led with no published thresholds.

### Cited Findings
- Viator: affiliates earn 8% on experiences booked within 30 days. Joining is free with no traffic or follower minimum, using a Tripadvisor account (official partner page per search summary, seen Nov 2026). Higher API levels are free but need approval and certification. One Travelpayouts table lists 10%, which conflicts with Viator's own page. — [Viator Partner Resource Center](https://partnerresources.viator.com/); [Viator levels of access](https://partnerresources.viator.com/travel-commerce/levels-of-access/); conflicting: [Travelpayouts](https://www.travelpayouts.com/blog/best-affiliate-programs-for-travel-sites/amp/)
- Viator merchant: either markup on the net rate or commission off the recommended retail price. Viator publishes no percentage. — [Viator merchant pricing](https://partnerresources.viator.com/travel-commerce/merchant/pricing/)
- GetYourGuide affiliate: 8% base per third-party directories and reviews (2026), with a 30–31 day cookie. Another source says 7% for Content Partnerships. The travel-agent network is said to pay up to 16% for the first 60 days, then 8%, earned after the activity takes place (supplier blog, 2026). The official partner page could not be read. — [UpPromote GYG](https://uppromote.com/affiliate-directory/getyourguide/); [Lasso: GYG Content Partnerships](https://getlasso.co/affiliate/getyourguide-content-partnerships/); [Samba HQ](https://www.sambahq.com/blog/getyourguide-commission)
- GetYourGuide API: a default rate limit of 130 calls/min with a 5-minute block on breach. Scraping and caching API output is disallowed (seen Nov 2026). — [GYG Partner API spec / wiki](https://github-wiki-see.page/m/getyourguide/partner-api-spec/wiki/Getting-started)
- Klook: 2%–20% by category, with tours and hotels 6.5%, attractions 5% and eSIM 20% (Involve Asia, Apr–Jun 2026). Another network says base up to 5% plus volume bonuses (Ecomobi, 2026). — [Involve Asia 2026](https://involve.asia/blog/klook-affiliate-program/); [Ecomobi 2026](https://ecomobi.com/klook-affiliate-program-review/)
- Tiqets affiliate: 8% with a 30-day cookie (Travelpayouts) vs 7% flat (Involve Asia), both third-party. — [Travelpayouts](https://www.travelpayouts.com/blog/best-concert-event-ticket-affiliate-program/)
- Tiqets Distributor API: free of charge, but "we consider around 200 orders a month the minimum" (seen Nov 2026). — [Tiqets API program](https://www.tiqets.com/partner-program/api-program)
- Hotelbeds: test keys are free. Production is gated by a commercial contract and certification. There is no published commission, since it is a net-rate wholesale model. — [Hotelbeds developer portal](https://developer.hotelbeds.com/); [Hotelbeds docs](https://developer.hotelbeds.com/documentation)
- TUI Musement: payment and commercial terms are set by agreement with the strategic partnerships team. No published commission. — [Musement Partner API](https://partner-api.musement.com/reference/openapi)
- Mozio: revenue share or partner-set markup (percentage or flat fee), no sign-up fees, terms negotiated. A third-party guide cites 5–10% per booking, probably old. — [Mozio travel agents](https://www.mozio.com/travel-agents); [AltexSoft](https://www.altexsoft.com/blog/how-to-integrate-airport-transfer-and-shuttle-functionality-into-hotel-and-flight-booking-systems/)
- Hoppa (Awin): 5% on transfers and 5% on trains (German listing), or 6% on transfers and 5% on trains (Dutch listing and terms). The cookie is 30 days with a two-month validation window. FlexOffers lists 4–8% for Spain. — [Awin Hoppa](https://ui.awin.com/merchant-profile/5511); [Awin Hoppa terms](https://ui.awin.com/merchant-profile-terms/5511); [FlexOffers Hoppa ES](https://www.flexoffers.com/affiliate-programs/hoppa-es-affiliate-program/)
- Suntransfers: on CJ (programme ID 4727627). The rate is shown only in the affiliate dashboard after approval; contact affiliates@suntransfers.com (seen Nov 2026). — [Suntransfers affiliate program](https://www.suntransfers.com/affiliate-program)
- Jayride: the affiliate programme is free, with attribution up to 30 days and no rate published. API partners get a negotiated percentage on travelled bookings (2024 deck). — [Jayride affiliate payout help](https://jayride.helpscoutdocs.com/article/152-what-is-the-payout); [Jayride Agent Partnerships 2024](https://www.jayride.com/wp-content/uploads/2024/03/Jayride-Agent-Partnerships-2024.pdf)
- Welcome Pickups: "commissions on every successful booking", with no rate or criteria published. Application is by form (© 2011–2026). — [Welcome Pickups Travel API](https://partner.welcomepickups.com/travel-api/)
- Booking.com: Demand API access goes through the Affiliate Partner Programme. A third-party source says full Demand API access requires managed-affiliate status under a contract. — [Booking.com Demand API](https://developers.booking.com/demand); [Elfsight 2026](https://elfsight.com/blog/how-to-get-and-use-booking-com-api-partnership-and-integration/)

### Inferences
- At about 8% commission on an average US$60–100 activity basket (an illustrative assumption, not sourced), affiliate revenue per booking is small, roughly US$5–8. Merchant or markup models only pay off with volume and in-house customer service.
- A pre-launch startup will most likely qualify straight away for Viator Basic, the GetYourGuide, Klook and Tiqets affiliate programmes, Hoppa and Suntransfers (via networks) and the Jayride affiliate programme. Viator Full + Booking, GetYourGuide Masterbill, the Tiqets Distributor API (200 orders/month), Hotelbeds and TUI Musement will probably need traction or a contract first.

### Gaps
- No official GetYourGuide commission, cookie or approval criteria could be read directly (partner portal returned an empty page; help centre returned 403).
- No published commission for Viator Full + Booking beyond "standard commission rate". Third-party tier ranges (8–12%, 7–10%, 5–8%) were unverifiable and are excluded.
- No published minimum-traffic criteria for GetYourGuide's API, the Klook API, Mozio, Welcome Pickups, Holibob or Booking.com Taxi.
- Payout thresholds conflict for GetYourGuide (PayPal no minimum vs €50 or $50) and are not officially verified.

---

## 4. API features (availability, booking, cancellation, content) and integration effort

### Takeaway
Viator's Partner API v2 is the most self-serve and best documented: tiered endpoints, a cart flow for Full + Booking, a certification guide, and supplier-cancellation automation for merchants. GetYourGuide (REST/JSON, public OpenAPI spec on GitHub), TUI Musement (OpenAPI v3.5.0 with mock and sandbox) and Hotelbeds (separate Activities and Transfers suites with a test environment) are solid but need approval or contracts. Holibob (GraphQL plus SDK and white label) and Mozio (API, white label, widget) offer the fastest routes to bookable inventory. Bókun and Tiqets use the OCTO standard on the supply side. Integration effort for a Next.js startup ranges from hours (affiliate links or widgets) to weeks (certified booking API).

### Cited Findings
- Viator Basic endpoints: single product, product search summaries, single-product availability and pricing, review ratings and counts, and health. Full adds bulk product and availability ingestion, real-time availability, reviews and photos, and onboarding specialists. Full + Booking adds payment tools, refunds and cancellations (published 27 Sept 2021). — [Viator levels of access](https://partnerresources.viator.com/travel-commerce/levels-of-access/)
- Viator: Partner API 2.0 technical docs. Full + Booking uses the /cart endpoints. Certification is required before go-live. An implementation guide is published. — [Viator Partner API 2.0](https://docs.viator.com/partner-api/technical); [Viator certification](https://partnerresources.viator.com/travel-commerce/certification/); [Viator implementation](https://partnerresources.viator.com/travel-commerce/implementation/)
- Viator merchant: automated supplier-cancellation handling is documented. — [Viator: automating supplier cancellations](https://partnerresources.viator.com/travel-commerce/merchant/automating-supplier-cancellations/)
- GetYourGuide: REST/JSON with an X-ACCESS-TOKEN header and a public OpenAPI spec on GitHub. 130 calls/min. No caching or scraping. API support at support-api@getyourguide.com. Partners need their own technical team. — [GYG Partner API spec](https://code.getyourguide.com/partner-api-spec/spec/api.yaml); [GYG Partner API wiki](https://github-wiki-see.page/m/getyourguide/partner-api-spec/wiki/Getting-started)
- TUI Musement: OpenAPI reference v3.5.0 with mock, sandbox and production servers. Includes customer-info, payments and authentication sections and release notes. — [Musement API](https://partner-api.musement.com/reference/openapi); [Authentication](https://partner-api.musement.com/reference/openapi/section/authentication); [Release notes](https://partner-api.musement.com/reference/openapi/section/release-notes)
- Hotelbeds: one API key per suite (Hotel, Activities, Transfers). Auth uses an API key plus X-Signature. Test environment at api.test.hotelbeds.com. Activities booking API includes availability search. The Transfers booking API is documented. Technical support for activities and transfers at integrations.btb@hotelbeds.com. — [Hotelbeds Activities availability](https://developer.hotelbeds.com/documentation/activities/booking-api/availability/search); [Hotelbeds Transfers booking API](https://developer.hotelbeds.com/documentation/transfers/booking-api/); [Hotelbeds support](https://developer.hotelbeds.com/documentation/support/)
- Tiqets: a free Distributor API, with sandbox testing before go-live (third-party integration guide). Suppliers connect to it through OCTO-based systems such as Ventrata. Ventrata notes that Tiqets "runs on Expedia" (2026). — [Tiqets API program](https://www.tiqets.com/partner-program/api-program); [Ventrata: Tiqets reseller connection](https://support.ventrata.com/en/articles/9527509-tiqets-reseller-connection)
- Holibob: GraphQL API (products, availability, create and confirm booking), sandbox, admin, white-label storefront, and a free embed SDK (2026). — [Holibob Docs](https://docs.holibob.tech/docs/platform-guide/storefront); [IBM community blog, Apr 2026](https://community.ibm.com/community/user/blogs/jacobo-weizenblut/2026/04/20/best-things-to-do-apis-partner-platforms-2026-for)
- Bókun: OCTO Core API with standard schemas, endpoints and capabilities for suppliers, resellers and OTAs. Price-over-API sync is available on some channels. — [Bókun APIs](https://www.bokun.io/es/grow/apis); [Bókun docs: Tiqets](https://docs.bokun.io/docs/otas-online-travel-agencies/how-to-connect-to-otas-through-the-marketplace/how-to-connect-to-tiqets)
- Mozio: API with live availability and pricing, plus white label and widget. — [Mozio GDS/platforms](https://www.mozio.com/gds-platforms)
- Welcome Pickups: API with real-time data sync, branding control and booking-flow control, or a hosted affiliate widget. Advertises 24/7 support. — [Welcome Pickups Travel API](https://partner.welcomepickups.com/travel-api/)
- Jayride: quoting and booking API (2024). — [Jayride Agent Partnerships 2024](https://www.jayride.com/wp-content/uploads/2024/03/Jayride-Agent-Partnerships-2024.pdf)
- Booking.com taxi API: integrations documented by dispatch vendors (Tiskel, GoodJourney, EasyTaxiOffice) are supplier-side (taxi firms receiving Booking.com rides), not a distribution API for OTAs. — [GoodJourney case study](https://www.goodjourney.io/en/blog/booking-com-taxi-supplier-api); [Tiskel](https://tiskel.com/post/bookingcom-taxi-dispatch)

### Inferences
- Lowest effort, phase 1 (days): Viator Basic API for content and search inside Next.js, with deep links out. GetYourGuide and Klook widgets or links. Mozio or Welcome Pickups widget for transfers.
- Medium effort, phase 2 (weeks plus certification): Viator Full + Booking with /cart. The Next.js server routes handle availability and checkout while Viator stays merchant of record. Mozio API with own markup.
- High effort (contracts, customer-service operations, PCI and payments): GetYourGuide Masterbill, Viator Merchant, TUI Musement, Hotelbeds Activities and Transfers, the Tiqets Distributor API, and direct Bókun supplier contracts. Hotelbeds makes most sense if the OTA already contracts Hotelbeds for hotels, because the keys and auth pattern are shared across suites.
- Holibob is a single-integration alternative that aggregates 45+ sources if the OTA wants one API instead of several. Commercials need confirming.
- Booking.com Taxi is not available to OTAs today; it is "coming soon" in the Demand API. Revisit in 2027.

### Gaps
- No public API docs found for the Klook Partner API, the Mozio API, the Welcome Pickups API, Hoppa or Suntransfers (affiliate only).
- Expedia Rapid Activities API availability and access criteria are unclear; Expedia sources conflict and the May 2026 release could not be read.
- Typical certification timelines (Viator, GetYourGuide, Hotelbeds) are not published.
- The Viator levels-of-access article dates from 2021. Endpoint lists may have changed, so check the current technical guide before building.
