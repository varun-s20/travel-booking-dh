# Car rental and cruise supply APIs for a small US B2C OTA (phase 2)

Research date: 12 Nov 2026. All sources accessed 12 Nov 2026 unless noted. "Dated" means the date the source itself carries; "undated" means the page shows no date. Many affiliate figures come from aggregator sites, not the provider, and are flagged as such. Official Discover Cars terms page (discovercars.com/affiliate-conditions) returned HTTP 522 on fetch; its content is known only from search-index snippets.

## Inventory (suppliers, countries, cruise lines/ships)

### Takeaway
Car rental inventory is concentrated in a few aggregators of similar scale (Booking.com Cars ~200 suppliers/150 countries; Expedia Rapid Car 110+ brands/190 countries; CarTrawler 550+ suppliers), and CarTrawler is being absorbed into Expedia Group in 2026. Cruise inventory is handled by specialist aggregators (Traveltek 30+ bookable lines, Widgety 72 lines content, Odysseus a growing set of bookable lines) rather than by any car-style mega-aggregator.

### Cited Findings
Car rental
- Booking.com Cars (Demand API): 45,000 locations, 200+ suppliers, 150 countries (undated docs page) — [Booking.com Developers, Cars overview](https://developers.booking.com/demand/docs/cars/overview)
- Rentalcars.com click-out URLs now redirect to Booking.com (cars.booking.com) rather than Rentalcars.com; the legacy Rentalcars XML API is being migrated to the Demand API (undated migration guide) — [Booking.com cars migration guide](https://developers.booking.com/demand/docs/cars/cars-migration-guide)
- Expedia Rapid Car API: 110+ car rental brands, 45K pick-up locations, 190 countries (footnoted "Expedia Group internal data, 2025"); FAQ also says 25,000 airport and non-airport locations; "35 suppliers not available on other OTA competitor sites in 56 countries" (inventory as of March 2025) — [Expedia Group Rapid Car API landing page](https://partner.expediagroup.com/en-us/landing-pages/rapid-car-api-for-scalable-car-rental-bookings). Note internal inconsistency on location counts (45K pick-up locations vs 25K locations).
- EPS agent booking tools cover "more than 175 car rental companies" (undated, older EPS page) — [EPS our supply](https://expediapartnersolutions.com/about/our-supply)
- CarTrawler: 550+ car rental suppliers and 500 mobility providers, serving 300+ travel brands including 70+ airlines (easyJet, Air France-KLM, Uber, American Express named) (dated 20 May 2026) — [Skift](https://skift.com/2026/05/20/expedia-to-acquire-cartrawler-in-second-b2b-deal-of-2026/); [Irish Times](https://www.irishtimes.com/business/2026/05/20/cartrawler-acquired-by-us-travel-group-expedia/)
- Holiday Autos is CarTrawler's main B2C brand (per Awin merchant profile, undated) — [Awin merchant 13402](https://ui.awin.com/merchant-profile/13402)
- Priceline cars: rental data covering 180+ countries "when paired with Rentalcars content" (secondary source, AltexSoft, undated) — [AltexSoft car rental APIs](https://www.altexsoft.com/blog/engineering/car-rental-apis-integrations-with-gdss-otas-and-tech-providers/)
- Sabre car API: "40+ major car rental brands including Hertz, Avis, Enterprise" (vendor marketing, not Sabre itself) — [Travelopro Sabre GDS API](https://www.travelopro.com/sabre-gds-api.php)

Cruise
- Traveltek: "30,000+ itineraries" and "live end-to-end booking journeys for 30+ cruise lines" (dated 2021 article; may be outdated); third-party listing claims 35+ major lines; added Scenic/Emerald and Mein Schiff to the booking API (undated blog posts) — [Traveltek cruise API](https://www.traveltek.com/travel-api-provider/cruise-api); [Traveltek, Scenic & Emerald](https://www.traveltek.com/scenic-emerald-cruises-now-on-travelteks-cruise-booking-api); [Traveltek, Mein Schiff](https://www.traveltek.com/blog/mein-schiff-now-available-on-the-traveltek-api); [TravelMole 2021](https://travelmole.com/presszone/travelteks-powerful-cruise-api-leads-to-efficiency-wins-uk)
- Widgety: "72 Cruise Lines | 20 Tour Operators | 1,400+ Travel Agents" (undated homepage); content-focused (itineraries, ship data, pricing/availability) — [Widgety](https://widgety.org); [Widgety about](https://widgety.org/about)
- Odysseus Solutions (Miami): bookable lines added include Crystal and Uniworld via direct API, Windstar (Apr 2025) — [Cruise Weekly](https://cruiseweekly.com.au/news/uniworld-crystal-on-odysseus/51293); [10minhotel, Oct 2024](https://en.10minhotel.com/2024/10/09/odysseus-booking-platform-expands-with)
- Sabre and Amadeus both market cruise APIs/content; only vendor pages describe this, and one Travelport-focused vendor page says cruise is not bookable via API for OTAs on that GDS — [AltexSoft Amadeus](https://altexsoft.com/blog/amadeus-api-integration); [Sabre Cruises API slides](https://www.slideshare.net/slideshow/sabre-cruises-api/251182191)
- CruiseDirect, Cruise.com/Cruises.com: affiliate retailers; no inventory figures found.

### Inferences
- For a US startup, Booking.com Cars and Expedia Rapid Car cover the same global supplier base; differentiation will be access and economics, not inventory.
- CarTrawler content will likely end up inside Expedia Group's B2B stack; picking Expedia Rapid Car may converge with CarTrawler supply over time (speculative).

### Gaps
- No ship-count figures for any cruise aggregator. No current (2026) line list for Traveltek or Odysseus.
- No official Sabre/Amadeus car or cruise content counts (no developer docs surfaced).

## Model: affiliate vs booking API; merchant of record; payment; customer service

### Takeaway
Cars: affiliate/redirect options exist with low barriers (Discover Cars, Holiday Autos, Booking.com redirect), while true book-in-place APIs (Booking.com "search, look and book", Expedia Rapid Car) are gated and, for Expedia, make the partner merchant of record. Cruise: the realistic startup models are affiliate links (CruiseDirect, Cruise.com) or a booking engine (Traveltek/Odysseus) that books through the agency's own cruise-line agency accounts, which requires agency accreditation.

### Cited Findings
- Booking.com Demand API Cars offers four flows: "search, look and redirect" (v3.1+; traveller completes booking on cars.booking.com), "search, look and book" (v3.2/v3.3), reporting/reconciliation via /orders/details, and post-booking management (Manage My Booking, vouchers) (v3.2/v3.3). Docs describe these as "stable, production-ready" (undated) — [Booking.com Cars overview](https://developers.booking.com/demand/docs/cars/overview)
- Conflict: other Booking.com doc pages say the Cars API version is an "early access pilot" / 3.2 Beta "offered to a limited set of pilot affiliate partners", and some pages cite a GA target of Q2 2025 that has passed — [Booking.com Cars getting started](https://developers.booking.com/demand/docs/cars/getting-started); [3.2-beta reference](https://developers.booking.com/demand/docs/open-api/3.2-beta/demand-api/cars). Current status should be confirmed with an account manager.
- Booking.com overview page does not state merchant of record or customer-service responsibility — [Booking.com Cars overview](https://developers.booking.com/demand/docs/cars/overview)
- Expedia Rapid Car API: "Partners act as Merchant of Record and can offer prepaid, agency, and merchant rates"; in beta with selected partners, waitlist open, full launch "early 2027"; page does not specify traveller customer service — [Expedia Rapid Car API](https://partner.expediagroup.com/en-us/landing-pages/rapid-car-api-for-scalable-car-rental-bookings)
- Older EPS guidance said EPS Rapid was hotels-only and recommended the affiliate programme for cars; superseded by the Rapid Car beta — [AltexSoft EPS](https://www.altexsoft.com/blog/travel/expedia-partner-solutions/)
- CarTrawler: fully B2B; works through partner onboarding ("Become a partner"); docs/credentials tied to commercial approval. Expedia Group agreed to acquire it 20 May 2026, expected to close H2 2026; CarTrawler's site reportedly shows a news item "CarTrawler is now part of Expedia Group B2B" dated 1 Sep 2026 (seen only in search snippet; not fetched, unverified) — [Skift](https://skift.com/2026/05/20/expedia-to-acquire-cartrawler-in-second-b2b-deal-of-2026/); [CarTrawler](https://cartrawler.com); [CarTrawler proposition](https://corporate.cartrawler.com/en-gb/our-proposition/)
- Deal price: one aggregator reports $350M (€300M); Irish Times/Skift say terms not disclosed — treat as unconfirmed — [pulse.bot](https://www.pulse.bot/private-equity/news/expedia-to-acquire-cartrawler-for-350-million-boosting-b2b-travel-services-3e6e2161-659a-4ee3-bd8c-2c9d2499da91/)
- Discover Cars: affiliate (links/widgets); Discover Cars is the seller and earns the margin; commission is paid from Discover Cars' profit on completed bookings net of cancellations (search snippet of official terms) — [Discover Cars affiliate conditions](https://www.discovercars.com/de/affiliate-conditions)
- Priceline Partner Network: offers XML API, banners, affiliate links, widgets, private label; API access through application/contract (secondary sources) — [AltexSoft](https://www.altexsoft.com/blog/engineering/car-rental-apis-integrations-with-gdss-otas-and-tech-providers/); [Travelpayouts on Priceline](https://travelpayouts.com/blog/the-priceline-affiliate-program/)
- Traveltek cruise API can be used "as a standalone, non-bookable solution" (content/pricing only) or bookable; target customers include "travel agencies, OTAs... cruise startups" — [Traveltek cruise API](https://www.traveltek.com/travel-api-provider/cruise-api)
- Widgety: says it "does not sell holidays or build websites"; offers REST API with multi-currency content incl. itineraries, pricing and availability; embedded by partners such as TProfile and Vibe; "API V3 out now in Beta" (undated) — [Widgety about](https://widgety.org/about); [TravelDailyNews on TProfile](https://www.traveldailynews.com/regional-news/tprofile-extends-its-partnership-with-widgety-to-deliver-advanced-api-for-travel-businesses/); [Widgety Vibe](https://widgety.org/vibe/)
- Odysseus: B2B/B2C/B2B2C cruise booking engine; "Odysseus XML" lets clients build their own interface on its supplier connections; "Cruise Data Cache" provides pricing/availability files — [SoftwareOne Odysseus vendor](https://platform.softwareone.com/vendor/odysseus-solutions/VND-0825-2169); [Cruise Data Cache](https://platform.softwareone.com/product/cruise-data-cache/PCP-5702-8387)
- CruiseDirect and Cruise.com/Cruises.com: classic affiliate (CJ for CruiseDirect; FlexOffers/Rakuten for Cruises.com); retailer handles booking, payment, service — [CruiseDirect affiliates](https://www.cruisedirect.com/affiliate-program); [FlexOffers Cruises.com](https://www.flexoffers.com/affiliate-programs/cruises-com-affiliate-program)
- Expedia Cruises is a franchise (retail storefront/home-based) model, not an API: 2025 FDD initial fee $49,000; total investment estimates $113,800–$199,245 (2025 FDD per aggregator), others $150k–$259k; 9% royalty on commissionable revenue — [SharpSheets](https://sharpsheets.io/blog/expedia-cruises-franchise-fdd-profits-costs); [Franchise Direct 2026](https://www.franchisedirect.com/expedia-cruises-franchise-2026)

### Inferences
- Lowest-risk phase-2 path: affiliate/redirect for cars (Discover Cars or Booking.com redirect) and affiliate for cruises; merchant of record, payments, and customer service stay with the partner. This avoids payment/chargeback and seller-of-travel exposure.
- Book-in-place cars via Expedia Rapid Car makes the startup MoR, which brings payment handling, refunds/chargebacks and traveller support onto the startup.
- Expedia Cruises does not fit a web-only Next.js OTA (it is a franchise purchase).

### Gaps
- Merchant of record and customer-service split for Booking.com "search, look and book" not found.
- Whether CarTrawler still onboards small partners post-acquisition not found.

## Commission/pricing, contracts, minimums

### Takeaway
Only affiliate programmes publish rates; all B2B APIs (CarTrawler, Booking.com Cars API, Expedia Rapid Car, Traveltek, Widgety, Odysseus, Sabre/Amadeus) require a quote. Discover Cars' profit-share model is the most generous visible car offer; cruise affiliates pay low single-digit percentages.

### Cited Findings
- Discover Cars: official affiliate agreement (snippet) states 70% of Discover Cars' profit on car rentals and 30% on Full Coverage; the same document also shows a 58% / 25% schedule with unclear trigger; Travelpayouts lists 56% / 24% via its network; directory listings report 365-day cookie, monthly PayPal/wire payout, minimum $100 (another says $200); a review estimates ~$20/booking (estimate) — [Discover Cars affiliate conditions](https://www.discovercars.com/de/affiliate-conditions); [Travelpayouts Discover Cars](https://www.travelpayouts.com/en/offers/discovercarhire-affiliate-program); [Affilimate](https://affilimate.com/programs/discover-cars-affiliate-program/); [born2invest 2026 review](https://born2invest.com/articles/2026-discover-cars-affiliate-program-review). Conflicting figures; verify on signup.
- Holiday Autos (CarTrawler): Awin profile shows 30-day attribution; aggregators list 5% per sale (one lists CJ instead of Awin) — [Awin 13402](https://ui.awin.com/merchant-profile/13402); [LinkClicky](https://linkclicky.com/affiliate-program/holiday-autos/)
- Priceline affiliate: 3–5% commission (Travelpayouts, third-party) — [Travelpayouts](https://travelpayouts.com/blog/the-priceline-affiliate-program/)
- Expedia Rapid Car: no commission terms published; earnings tied to rate types (package rates, Members Only, Mobile Only); "20% increased commissions" figure on page is from a lodging case study, not cars — [Expedia Rapid Car API](https://partner.expediagroup.com/en-us/landing-pages/rapid-car-api-for-scalable-car-rental-bookings)
- CarTrawler: no published fees/minimums — [CarTrawler](https://cartrawler.com)
- CruiseDirect: 3% commission (on sailed bookings per one listing), 45-day cookie, CJ Affiliate, monthly payment; CruiseDirect FAQ: free to join, "no minimum sales requirement"; Cuelinks lists a dynamic CPC model instead (conflict) — [CruiseDirect affiliate FAQ](https://www.cruisedirect.com/faq/affiliates); [affiliateprograms.com](https://affiliateprograms.com/p/cruise-direct/); [Cuelinks](https://www.cuelinks.com/campaigns/cruisedirect-affiliate-program)
- Cruises.com: FlexOffers lists 1.6% of consumed orders, 30-day cookie; another aggregator claims "50%–100% per sale" (implausible, likely error) — [FlexOffers Cruises.com](https://www.flexoffers.com/affiliate-programs/cruises-com-affiliate-program); [AmaLinksPro](https://amalinkspro.com/?p=28988)
- Traveltek, Widgety, Odysseus: no pricing published; access via contact/demo form — [Traveltek cruise API](https://www.traveltek.com/travel-api-provider/cruise-api); [Widgety](https://widgety.org)

### Inferences
- A cruise affiliate at 1.6–3% on a $2,000 booking yields ~$32–60; agency-of-record commissions from lines are typically much higher, but require accreditation and a booking engine (commission levels not sourced here).
- Budget assumption for Traveltek/Odysseus: setup plus licence fees under contract (unquoted).

### Gaps
- No published setup/licence fees, minimum volumes or contract lengths for any B2B cars or cruise API.
- Cruise-line base agency commission rates not researched/sourced.

## Access: approval criteria, accreditations (IATA, CLIA, ARC), traffic thresholds

### Takeaway
Car affiliates are open to any website; car booking APIs need a business case and account manager (Booking.com) or a waitlist (Expedia, until early 2027). Direct cruise-line agency accounts need an ARC/IATA/TRUE appointment or CLIA certificate (NCL explicit), or a host-agency affiliation; this is the gating item for any bookable cruise product.

### Cited Findings
- Booking.com Cars API: available to Demand API Affiliate Partners via Account Manager; "search, look and book" requires approval, "a valid business case", and an appropriate partner agreement; API key generated in Affiliate Partner Centre, X-Affiliate-Id header — [Booking.com Cars getting started](https://developers.booking.com/demand/docs/cars/getting-started); [Cars overview](https://developers.booking.com/demand/docs/cars/overview)
- Expedia Rapid Car: no formal criteria listed; interest form asks business type, annual travel turnover ($0 to $10m+) and API experience; businesses not suited to a direct connection may be referred to downstream API partners — [Expedia Rapid Car API](https://partner.expediagroup.com/en-us/landing-pages/rapid-car-api-for-scalable-car-rental-bookings)
- Priceline Partner Network: application, company review, then contract/docs/credentials; described as selective and favouring volume (low-quality secondary sources) — [PHPTravels Priceline](https://phptravels.com/pt/providers/priceline-hotel-api-provider); [adivaha](https://www.adivaha.com/priceline-partner-network-drupal-plugin.html)
- CruiseDirect affiliate: free, no minimum sales — [CruiseDirect FAQ](https://www.cruisedirect.com/faq/affiliates)
- NCL (Norwegian Central) new-agency registration requires an ARC/IATA/TRUE appointment letter or CLIA certificate; completed by agency owner/officer; contact newagency@ncl.com; host-based agents use their own address/phone (secondhand) — [Norwegian Central registration](https://norwegiancentral.ncl.com/account); [blog repost, Mar 2024](https://thedecorativetree.blogspot.com/2024/03/norwegian-cruise-line-launches-exclusive-trade-portal-norwegian-central.html)
- Carnival GoCCL: agents register on GoCCL.com; host/consortia verification letters accepted for listed hosts (Flex Pay form, date unclear) — [Carnival Flex Pay form](https://upgrade.jotform.com/242756070681964); [Carnival GoCCL redesign](https://www.carnivalcorp.com/news-releases/news-release-details/carnival-cruise-line-redesigns-gocclcom-travel-agent-website)
- Royal Caribbean Cruising Power: trade booking site; registration requirements not found; bookings referenced by IATA or branch phone; older TMR guide says all lines accept CLIA, many agents use ARC/IATAN/ASTA — [Travel Market Report](https://travelmarketreport.com/Training/articles/Royal-Caribbean-Travel-Agent-Resources); [TravelEdge partner listing](https://partners.traveledge.com/partner-listing/royal-caribbean)
- CLIA: agencies register via CLIA form subject to CLIA approval; individual agents only if their agency is registered — [CLIA terms](https://cruising.org/node/24291)

### Inferences
- Startup path for bookable cruise: obtain CLIA agency membership (or TRUE/IATAN), or join a host agency, then plug Traveltek/Odysseus into those line accounts. Seller-of-travel registration (e.g. CA, FL, WA, HI) likely applies once the startup takes payment; not researched here.
- Expedia's turnover question suggests a $0-turnover startup may be routed to a downstream partner rather than direct.

### Gaps
- No public traffic thresholds for any programme.
- Royal Caribbean Cruising Power and Carnival current (2026) accreditation rules not confirmed from official pages.
- Whether Traveltek/Widgety/Odysseus themselves require CLIA/IATA from customers not found.

## Integration effort and documentation

### Takeaway
Public developer docs exist only for Booking.com Demand API Cars (versioned, OpenAPI). Expedia Rapid Car docs are behind beta access. Cruise aggregators and CarTrawler document behind onboarding. Affiliate options need hours (links/widgets); booking APIs need weeks to months plus payments and post-booking flows.

### Cited Findings
- Booking.com: public OpenAPI reference for v3.1/3.2 (search, details, depots, depot scores, suppliers, constants), car rental quick guide and tutorial, v3.2 migration guide; v3.1 supports search/details/depots/suppliers only; booking needs v3.2/v3.3; bearer token + affiliate ID — [Booking.com Demand API 3.2 cars](https://developers.booking.com/demand/docs/open-api/3.2/demand-api/cars); [quick guide](https://developers.booking.com/demand/docs/cars/3.2/cars-quick-guide.md); [migration guide](https://developers.booking.com/demand/docs/cars/cars-migration-guide)
- Expedia Rapid Car: account management, onboarding and launch support promised; docs not public — [Expedia Rapid Car API](https://partner.expediagroup.com/en-us/landing-pages/rapid-car-api-for-scalable-car-rental-bookings)
- CarTrawler: documentation and credentials tied to commercial approval; third-party integrators (Travelopro, Trawex, PHPTravels) advertise CarTrawler connections (vendor claims) — [PHPTravels CarTrawler](https://phptravels.com/cartrawler-api-integration); [Travelopro](https://www.travelopro.com/cartrawler.php)
- Widgety: REST API with search filters, multi-currency; V3 in beta (undated); also offers an embeddable widget product — [Widgety widget](https://widgety.org/product/widget/); [Widgety](https://widgety.org)
- Traveltek: API plus white-label products (CruiseTek); access via contact form/demo — [Traveltek CruiseTek](https://www.traveltek.com/products/cruisetek/)
- Odysseus: booking engine (hosted) or XML for custom front-ends — [SoftwareOne Odysseus](https://platform.softwareone.com/vendor/odysseus-solutions/VND-0825-2169)
- Sabre/Amadeus: no official developer documentation surfaced; GDS onboarding typically via agreements and often third-party integrators (vendor pages only) — [Gurutechnolabs Sabre](https://www.gurutechnolabs.com/how-to-integrate-sabre-api/)

### Inferences
- Next.js fit: Booking.com redirect flow and Discover Cars/CruiseDirect links are server-side fetch plus deep links; quickest. Widgety content API could power cruise browse pages SEO-wise with affiliate or enquiry CTA.
- Fit ranking for a small startup (judgement): Cars — 1) Discover Cars affiliate or Booking.com redirect, 2) Expedia Rapid Car after early-2027 GA, 3) CarTrawler/Priceline/GDS (enterprise). Cruise — 1) CruiseDirect/Cruises.com affiliate, 2) Widgety content + enquiry/host-agency booking, 3) Traveltek/Odysseus bookable once CLIA/host agency in place, 4) Sabre/Amadeus cruise, Expedia Cruises franchise (poor fit).

### Gaps
- No integration-time estimates from providers.
- Other car affiliates (e.g. EconomyBookings, QEEQ, Localrent on Travelpayouts) not verified in this pass.
