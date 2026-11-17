# Stays (accommodation) supply APIs for a small B2C OTA: comparison

Research date: 2026-11-12. "Accessed 2026-11-12" means the page carried no effective date and was read on that day. Most commercial terms in this sector (commission, margin, deposits) are not published and are negotiated per contract. Where only third-party or vendor-blog figures exist, they are labelled as such. Research budget: about 17 tool calls, so several candidates (TravelgateX, Hostelworld, Holidu, Plum Guide, Expedia TAAP) are covered only thinly or appear in Gaps.

## Inventory: property counts, property types, regions, content quality

### Takeaway
Published counts are marketing figures that disagree from source to source. ETG/RateHawk (2.5M–2.9M claimed) and TBO (1M+) claim the largest net-rate wholesale pools. Duffel Stays claims "1M+" or "millions". Vacation-rental depth sits mainly with Expedia (Vrbo on Rapid, limited rollout) and with channel-manager-style aggregators (Rentals United, NextPax), not with the bedbanks.

### Cited Findings
- **Duffel Stays:** the homepage claims commission "on over 1 million properties globally" (accessed 2026-11-12) — [Duffel](https://duffel.com/). A travel-industry write-up cites "2M+" hotel properties, which conflicts with Duffel's own figure — [Duffel search summary / travelbookingpanel](https://travelbookingpanel.com/duffel-api-integration-how-travel-businesses-sell-flights-the-modern-way). The getting-started guide says only "millions of properties worldwide" and does not break them down by type (hotel, apartment and so on) (accessed 2026-11-12) — [Duffel Stays guide](https://duffel.com/docs/guides/getting-started-with-stays). The pricing page names no Stays supply sources (accessed 2026-11-12) — [Duffel pricing](https://duffel.com/pricing).
- **Duffel Stays content:** the guide notes that some properties have no front desk, so confirmation pages may need to include key-collection instructions. That points to some apartment or self-check-in supply — [Duffel Stays guide](https://duffel.com/docs/guides/getting-started-with-stays). An Accommodation API reference exists (photos, amenities and so on are documented there; not read in detail) — [Duffel Accommodation API](https://duffel.com/docs/api/v2/accommodation).
- **Duffel negotiated rates:** a June 2026 changelog says a negotiated rate can now be scoped to a whole hotel chain using `chain_id` — [Duffel changelog](https://changelog.duffel.com/announcements/you-can-now-use-negotiated-rates-with-a-chain-via-the-stays-api); [Negotiated rates guide](https://duffel.com/docs/guides/negotiated-rates).
- **Expedia Rapid:** "more than 800,000 properties, per Expedia's December 2025 figure", reported by StayAPI (a competing data vendor) in an article dated 2026-08-15 — [StayAPI](https://stayapi.com/blog/expedia-rapid-api). This looks low against Expedia Group's usual multi-million lodging claims. It is unverified and may count only a subset (for example, hotels only).
- **Expedia Rapid inventory opportunities:** the portal shows partners "the total number of properties relevant to travelers that you don't currently have on offer", with a "Vacation Rental Category" column, and the list is updated monthly (accessed 2026-11-12) — [Expedia Developer Hub: inventory opportunities](https://developers.expediagroup.com/rapid/lodging/shopping/inventory-opportunities?locale=en_US).
- **Vrbo on Rapid:** "a new product that is currently only available to a limited number of partners" (accessed 2026-11-12) — [Vrbo on Rapid integration guide](https://developers.expediagroup.com/rapid/lodging/vacation-rentals/vrbo-integration-guide); [About the Vacation Rentals API](https://developers.expediagroup.com/rapid/lodging/vacation-rentals/about-vacation-rentals-api). Expedia recommends refreshing Vrbo content at least weekly — [Vrbo integration guide](https://developers.expediagroup.com/rapid/lodging/vacation-rentals/vrbo-integration-guide). Trade press covered the integration of Vrbo into the API — [The Host Report](https://www.thehostreport.com/news/expedia-integrates-vrbo-properties-into-its-api); [Rental Scale-Up](https://www.rentalscaleup.com/airbnb-regulations-lisbon-vrbo-api/).
- **RateHawk / ETG:** "2.5M+ properties with net rates" per an API Evangelist profile — [GitHub api-evangelist/ratehawk](https://github.com/api-evangelist/ratehawk). "2.9M+" per a vendor guide — [ZentrumHub](https://www.zentrumhub.com/blog/ratehawk-hotel-api-guide/). The two sources conflict.
- **TBO Holidays:** claims "1M+ properties in real time" on its own site — [TBO](https://prep.tboholidays.com/hotels.aspx). Its partner page claims sales presence in 113 countries and "147,000 travel agent partners" (accessed 2026-11-12) — [TBO partner with us](https://tbosignindev.tboholidays.com/pages/partner-with-us). TBO is also listed via Vervotech at 1,000,000+ hotels — [Vervotech](https://www.vervotech.com/hub/integrations/tbo-hotel-api/).
- **WebBeds:** "500,000+ hotels" and "over 50,000 online and offline travel buyers across 50+ countries", per a third-party Channex listing, not a WebBeds figure — [Channex](https://channex.io/integrations/webbeds).
- **Hotelbeds (HBX Group):** the developer portal lists capacity of "100,000 searches/day" and bookings/day. That is a rate limit, not an inventory figure, and no property count was found in this session — [HBX Group developer portal](https://developer.hotelbeds.com/).
- **Booking.com Demand API:** no property count was found in official docs during this session — [StayAPI Booking guide, 2026-07-22](https://stayapi.com/blog/booking-com-api).
- **Vacation-rental aggregators:** Rentals United claims "90+ curated vacation rental channels" and a "4 weeks average go-live" for its white-label OTA-connections API (vendor claim) — [Rentals United white-label API](https://info.rentalsunited.com/whitelabel-channel-manager-api). It was named a Preferred Partner of Airbnb, Vrbo and Booking.com in April 2026 — [Rentals United blog](https://rentalsunited.com/blog/rentals-united-named-preferred-partners-of-airbnb-and-vrbo/). NextPax released new Supply API endpoints in May 2026 — [NextPax](https://nextpax.com/resources/nextpax-supply-api-release-highlights).

### Inferences
- For "widest possible inventory" no single source wins on published data. The bedbanks (ETG, TBO, Hotelbeds, WebBeds) heavily overlap the same hotels, so their counts are not additive. Vacation rentals are the real differentiator, and only Expedia (Vrbo, restricted) and Booking.com (apartments and homes are in its catalogue, but its Demand API is gated) offer them at scale through a booking API.
- Rentals United and NextPax are primarily supply-side channel managers, connecting property managers *to* OTAs. Using them as a demand-side source would mean the startup becomes a "channel" that property managers opt into. That is a supply-acquisition business, not a plug-in API.
- Duffel Stays aggregates other sources, so its "1M+" likely overlaps with the bedbank counts above (unconfirmed).

### Gaps
- Duffel Stays' upstream suppliers and its split by property type (hotels vs apartments vs vacation rentals) are not published. Ask Duffel.
- Agoda, Trip.com, Hostelworld, PPN, Hotelbeds and Booking.com property counts were not verified from primary sources in this session.
- Content quality (photo count, review availability, description languages) per provider was not verified, except Expedia's Vrbo content refresh guidance.
- No reliable 2026 figure was found for Holidu or Plum Guide partner APIs. Plum Guide in particular could not be assessed.

## Booking model: merchant vs agency/pay-at-property vs affiliate redirect; merchant of record; customer service

### Takeaway
Three tiers exist:
- **Net-rate merchant APIs**, where the OTA charges the guest and pays the supplier: ETG/RateHawk B2B, Hotelbeds, WebBeds, TBO, and Duffel via a prepaid balance or approved cards.
- **Commission APIs**, where the OTA books but the supplier is merchant, or the commission comes later: Booking.com Demand, Expedia Rapid commission models, and Duffel's "profit share on completed stays".
- **Affiliate redirects**, where the OTA never transacts: the Booking.com, Agoda, Trip.com, Priceline and Hostelworld affiliate programmes.

### Cited Findings
- **Duffel Stays, payment:** bookings can be paid from the Duffel Balance, a pre-funded wallet topped up by bank transfer. "Only Duffel Stays rates paid at time of checkout can be booked using Duffel Balance", and rates that need a card only as a guarantee are not bookable this way — [Duffel: collecting and making payments](https://duffel.com/docs/guides/collecting-and-making-payments); [What is the Duffel Balance](https://help.duffel.com/hc/en-gb/articles/360019693239-What-is-the-Duffel-Balance). Card payments for Stays need approval: "Contact the Duffel support team ... to request approval before starting your integration" — [Duffel: collecting customer card payments](https://duffel.com/docs/guides/collecting-customer-card-payments). Deposit rates take a prepayment at booking, with the remainder paid at the property. `instant_payment: true` filters to rates paid at booking — [Duffel booking payment instructions](https://duffel.com/docs/api/v2/booking-payment-instructions).
- **Duffel Stays, earnings:** "The accommodation provider pays the commission on completed bookings. Duffel passes a share to you." A booking is "completed once the guest checks out" (accessed 2026-11-12) — [Duffel pricing](https://duffel.com/pricing). The bookings API carries an estimated commission amount, which may be null — [Duffel bookings API](https://duffel.com/docs/api/v2/bookings/get-booking).
- **Expedia Rapid:** the inventory-opportunities filter names three models: "flex, direct agency, and merchant business models" (accessed 2026-11-12) — [Expedia Developer Hub](https://developers.expediagroup.com/rapid/lodging/shopping/inventory-opportunities?locale=en_US). A third-party 2026 roundup says Rapid partners can use a commission or a merchant model — [OneClick IT Solution](https://www.oneclickitsolution.com/blog/top-hotel-booking-apis).
- **Vrbo on Rapid:** cannot be packaged. Expedia's recommended offering limits Vrbo bookings to single-payment properties paid by partner virtual card. Partners need a card that accepts multiple charges for pre-authorisation. Vrbo bookings are not compatible with Property Message Center, so the partner must pass the traveller's email. Displaying the rental agreement at checkout is a launch requirement — [Vrbo on Rapid integration guide](https://developers.expediagroup.com/rapid/lodging/vacation-rentals/vrbo-integration-guide).
- **Booking.com Demand API:** partners "search live inventory, display it, send bookings back, and earn commission on completed stays" (third party, 2026-07-22) — [StayAPI](https://stayapi.com/blog/booking-com-api). Booking.com's official prerequisites page does not describe the payment model or merchant of record — [Booking.com prerequisites](https://developers.booking.com/demand/docs/getting-started/prerequisites).
- **ETG/RateHawk B2B:** "B2B uses net prices and you calculate your own markup." A site that collects from the guest typically funds a prepaid deposit with RateHawk, with terms set by contract (vendor/third-party summaries) — [ETG integration guide](https://docs.emergingtravel.com/docs/integration-guide/); [PHPTravels](https://phptravels.com/blog/ratehawk-api-integration).
- **Affiliate programmes:** Agoda offers deep links, search and price-comparison widgets, and an API for partners who render live availability (aggregator) — [Track360, 2026](https://track360.io/blog/agoda-affiliate-program-operator-teardown-2026).

### Inferences
- Duffel's model is a hybrid. The OTA pays Duffel (by balance or approved card) and earns its income as a profit share after checkout, so cash flow lags revenue until check-out. That suits a lean startup but delays earnings.
- Under net-rate bedbank models the startup is effectively merchant of record and owns first-line customer service, chargebacks and the payment flow. Under affiliate redirect, the OTA (Booking.com, Agoda and so on) handles payment and service.
- Vrbo's virtual-card and rental-agreement rules add checkout complexity on top of standard Rapid hotel booking.

### Gaps
- Who handles traveller customer service under each model is not explicitly documented in the sources read. For Duffel, Expedia Rapid and Booking.com Demand this needs confirming from the contracts.
- Expedia TAAP (the travel-agent booking portal) and its model were not researched. It is a portal for agents, not a booking API for a website, so it is likely irrelevant for API integration (unverified).
- Whether Booking.com Demand API bookings are Booking.com-merchant (pay now via Booking) or pay-at-property was not confirmed from primary docs.

## Pricing and earnings: net rates, markup, commission %, fees, minimums, parity/display rules

### Takeaway
Duffel publishes no Stays commission percentage, only a volume-tiered profit share. Bedbanks give net rates with free markup, though rate-parity rules are contract-specific. Affiliate programmes pay roughly 3–8% of booking value according to third-party aggregators, and none of their official terms were verified.

### Cited Findings
- **Duffel Stays:** "Profit share on every completed stay". No percentage is published; larger volume earns a larger share; contact Sales (accessed 2026-11-12) — [Duffel pricing](https://duffel.com/pricing). The pricing page states no Stays-specific payment, markup or content fees — [Duffel pricing](https://duffel.com/pricing). Flights for context: $3.00 per order, 1% Managed Content, $2.00 per ancillary, $0.005 per search beyond a 1500:1 look-to-book ratio, and 2% FX on currency conversion — [Duffel pricing](https://duffel.com/pricing). Whether the 2% FX fee applies to Stays is not stated (see Gaps).
- **Expedia Rapid:** no published commission schedule was found. A third-party roundup mentions "minimum performance commitments" (not an Expedia source) — [OneClick IT Solution](https://www.oneclickitsolution.com/blog/top-hotel-booking-apis). Official eligibility for the inventory-opportunities feature: existing partners need ">$100,000 net revenue in the last 12 months", and new partners need ">$50,000 net revenue in the last 3 months" (accessed 2026-11-12) — [Expedia Developer Hub](https://developers.expediagroup.com/rapid/lodging/shopping/inventory-opportunities?locale=en_US).
- **Booking.com affiliate:** third-party figures conflict:
  - 25–40% of Booking.com's own commission, roughly 4% of booking value — [AffiliatePicker 2026](https://affiliatepicker.com/programs/booking-com/).
  - 4% on CJ/Awin and 7.4% via Skimlinks; one guide says the direct programme has moved to CJ — [AffiliateJob 2026](https://affiliatejob.org/programs/booking).
  - 4.8% via the Ecomobi network — [Ecomobi](https://ecomobi.com/join-booking-com-affiliate-on-ecomobi-passio/).

  No partner API pricing is published — [Monocrawl 2026](https://www.monocrawl.com/compare/booking-data-apis).
- **Agoda affiliate:** about 4–7%, with a flat 4.8% via one network, around 5% per Agoda materials, and a reported 1-day cookie (aggregators) — [Travelpayouts](https://www.travelpayouts.com/blog/best-hotel-affiliate-program/); [Track360 2026](https://track360.io/blog/agoda-affiliate-program-operator-teardown-2026).
- **Trip.com affiliate:** hotels at roughly 4–5%, or up to 5.92%, with a 30-day cookie (aggregators) — [Travelpayouts](https://www.travelpayouts.com/blog/best-hotel-affiliate-program/); [Ecomobi comparison](https://ecomobi.com/comparison-agoda-affiliate-vs-booking-com-trip-com-traveloka/).
- **Priceline:** affiliate at about 3% per order, or 3–7% on hotels per other sources. One vendor blog claims PPN hotel commission of "4 to 8 percent" with volume tiers. These may describe the affiliate programme rather than the PPN API — [Travelpayouts Priceline](https://travelpayouts.com/blog/the-priceline-affiliate-program/); [UpPromote](https://uppromote.com/affiliate-directory/priceline/); [ZentrumHub Priceline guide](https://www.zentrumhub.com/blog/priceline-hotel-api-guide/).
- **ETG/RateHawk:** net rates with your own markup. One guide cites a 2022 RateHawk statement that API access is free of charge (unverified for 2026) — [PHPTravels](https://phptravels.com/blog/ratehawk-api-integration); [ZentrumHub](https://www.zentrumhub.com/blog/ratehawk-hotel-api-guide/).
- **Hotelbeds:** no published API pricing; access depends on commercial agreements and volume (integrator blog) — [PHPTravels Hotelbeds](https://phptravels.com/hotelbeds-api-xml-integration).
- **Hostelworld:** no reliable commission figure was found — [Travelpayouts](https://www.travelpayouts.com/blog/best-hotel-affiliate-program/).

### Inferences
- At an average stay of, say, $300, affiliate earnings of 4–5% come to about $12–15 per booking with no payment risk. Net-rate bedbanks allow a typical OTA markup of 10–20% (an industry norm, not sourced here) but carry payment, fraud and service costs.
- Duffel's opaque profit share makes unit economics impossible to model before talking to Sales. That is a key risk for a Phase 1 spec.

### Gaps
- Duffel Stays' actual share percentage, whether the 2% FX fee applies to Stays, and any Stays search-ratio fees are not published.
- Rate-parity and display rules (for example, a ban on publicly showing net rates below the hotel's direct price) were not found for any provider in this session.
- There are no official 2026 commission tables for Agoda, Trip.com, Hostelworld or Booking.com. All figures are from aggregators.

## Access: self-serve vs approval, thresholds, registration, credit/deposit, certification, sandbox

### Takeaway
Only Duffel (sandbox self-serve, then request Stays access) and the affiliate programmes are realistically open to a pre-launch startup. Expedia Rapid and Booking.com Demand API are contract-gated, revenue-judged partnerships. Bedbanks need signed agreements and often prepaid deposits, but are generally open to registered travel businesses.

### Cited Findings
- **Duffel:** pay-as-you-go signup with "zero up-front costs" — [Duffel pricing](https://duffel.com/pricing). For Stays: create an account, then "Request access to Duffel Stays" through the contact form. A test token is available in the Dashboard for the sandbox (accessed 2026-11-12) — [Duffel Stays guide](https://duffel.com/docs/guides/getting-started-with-stays). Card payment for Stays needs prior approval — [Duffel card payments](https://duffel.com/docs/guides/collecting-customer-card-payments).
- **Expedia Rapid:** "a revenue partnership with an API attached". There is no self-serve key. The application covers "your business model, and your projected booking volume" (StayAPI, 2026-08-15) — [StayAPI](https://stayapi.com/blog/expedia-rapid-api). A third party estimates a 3–6 month certification timeline (unverified) — [OneClick IT Solution](https://www.oneclickitsolution.com/blog/top-hotel-booking-apis). Launch requirements are documented officially — [Expedia launch requirements](https://developers.expediagroup.com/rapid/setup/launch-requirements/launch-requirements). Vrbo is limited to a small number of partners — [Vrbo guide](https://developers.expediagroup.com/rapid/lodging/vacation-rentals/vrbo-integration-guide).
- **Booking.com Demand API:** you must be a "Managed Affiliate Partner", with Partner Centre access "provided by your Booking.com Account Manager after signing the agreed contract". A sandbox exists (accessed 2026-11-12) — [Booking.com prerequisites](https://developers.booking.com/demand/docs/getting-started/prerequisites); [Demand API sandbox](https://developers.booking.com/demand/docs/development-guide/sandbox). Third parties say it targets "businesses with real distribution", and that "pre-launch startups rarely clear the bar" — [StayAPI 2026-07-22](https://stayapi.com/blog/booking-com-api); [Vorplabs](https://vorplabs.com/agent-tools/booking-demand-api).
- **ETG/RateHawk:** "Before starting to use the API, the respective agreement should be signed." Certification "may" be required after integration. Sandbox and production hosts exist — [ETG integration guide](https://docs.emergingtravel.com/docs/integration-guide/); [ETG sandbox](https://docs.emergingtravel.com/docs/fundamentals/sandbox/index.md). IATA is reportedly not required (vendor blog, unverified) — [PHPTravels](https://phptravels.com/blog/ratehawk-for-travel-agents).
- **Hotelbeds:** online registration issues an ID and API keys for an evaluation environment ("Open access to API Suite") — [HBX developer portal](https://developer.hotelbeds.com/). Live access depends on a commercial agreement (integrator) — [PHPTravels](https://phptravels.com/hotelbeds-api-xml-integration).
- **WebBeds:** "API access is granted following commercial agreement and technical approval" (accessed 2026-11-12) — [WebBeds buyer support](https://www.webbeds.com/buyers/support/).
- **PPN:** applicants are evaluated, and approved ones receive an agreement, documentation and credentials (third party) — [Vervotech PPN guide](https://www.vervotech.com/hub/guides/priceline-api-integration-guide/).
- **Affiliate programmes:** Priceline's affiliate programme reportedly publishes no traffic or audience minimums — [UpPromote](https://uppromote.com/affiliate-directory/priceline/).

### Inferences
- A realistic path for a small USD/English startup:
  1. Duffel Stays now.
  2. Add one direct bedbank (ETG/RateHawk or Hotelbeds) once the company is registered and can fund a deposit.
  3. Apply to Expedia Rapid and Booking.com Demand after building booking history. Expedia's own $50k-in-3-months language for new partners hints at the scale it expects.
- Affiliate deep links (Booking.com, Agoda, Trip.com) can fill gaps (hostels, rentals) without approval hurdles, at the cost of sending users off-site.

### Gaps
- Whether bedbanks need a credit line or deposit, and how large, is unpublished. TBO's requirements for a US startup were not found.
- TravelgateX was not researched in this session. It is known to be a B2B connectivity marketplace that requires separate contracts with each supplier (unverified here).

## Features via API: search, availability, booking, cancellation, reviews/content

### Takeaway
All transactional APIs cover the standard search → rates → pre-book/quote → book → cancel flow. Duffel's four-step flow is documented clearly. Reviews and rich content availability differs and was mostly not verified.

### Cited Findings
- **Duffel:** `stays.search` (by location or accommodation IDs) → `searchResults.fetchAllRates` → `quotes.create` (re-checks availability) → `bookings.create`. Rates are tagged non-refundable or refundable, and there is a separate cancellation-timeline guide — [Duffel Stays guide](https://duffel.com/docs/guides/getting-started-with-stays). Negotiated rates are supported, including at chain level from June 2026 — [Duffel changelog](https://changelog.duffel.com/announcements/you-can-now-use-negotiated-rates-with-a-chain-via-the-stays-api).
- **ETG:** Hotel Search, Hotelpage, Prebook and booking endpoints under `api.worldota.net/api/b2b/v3` — [ETG docs](https://docs.emergingtravel.com/docs/integration-guide/); [api-evangelist](https://github.com/api-evangelist/ratehawk).
- **Expedia Rapid:** there is a full shopping/booking/content suite, with a changelog of ongoing updates and Property Collect payments documented — [Rapid changelog](https://developers.expediagroup.com/docs/products/rapid/setup/changelog); [Inventory opportunities](https://developers.expediagroup.com/rapid/lodging/shopping/inventory-opportunities?locale=en_US).
- **Booking.com Demand API:** covers Accommodation and Attractions collections — [Booking.com sandbox](https://developers.booking.com/demand/docs/development-guide/sandbox). One guide says the Demand API is in maintenance mode and new integrations should use the latest stable version (third party) — [Booking.com Demand API search summary / Monocrawl](https://www.monocrawl.com/compare/booking-data-apis). Booking's Guest Review API covers only your own listings (Connectivity side) — [StayAPI](https://stayapi.com/blog/booking-com-api).

### Inferences
- Duffel's quote step (`quotes.create`) is equivalent to the bedbanks' prebook. A Next.js integration can reuse the same UX state machine across suppliers if a second source is added later.

### Gaps
- Whether guest reviews are available via Duffel Stays, Rapid, ETG or Hotelbeds was not verified in this session.
- Hotelbeds' Content API and TBO feature details were not read.

## Integration effort and documentation quality

### Takeaway
Duffel has modern REST/JSON docs with SDKs and is rated highly by third parties. Bedbanks are mid-effort (2–6 weeks plus certification). Expedia Rapid is the heaviest (launch requirements, months of certification). Affiliate links are trivial.

### Cited Findings
- **Duffel:** given an "API: Grade A" by a third-party API report card — [Supergood](https://supergood.ai/api-report-card/duffel). The SDK-style method names in the guide (`stays.search`) indicate client libraries — [Duffel Stays guide](https://duffel.com/docs/guides/getting-started-with-stays).
- **Hotelbeds:** setup time of 2–6 weeks per an integration directory — [Hotelbeds search summary / PHPTravels](https://phptravels.com/hotelbeds-api-xml-integration). There is a detailed knowledge base — [HBX knowledge base](https://developer.hotelbeds.com/documentation/hotels/knowledge-base/). AltexSoft wrote an integration explainer — [AltexSoft](https://www.altexsoft.com/blog/hotelbeds-api-integration/).
- **Expedia Rapid:** 3–6 months to go live per a third party — [OneClick IT Solution](https://www.oneclickitsolution.com/blog/top-hotel-booking-apis). Vrbo adds separate launch requirements (rental agreement display, weekly content refresh, virtual card) — [Vrbo guide](https://developers.expediagroup.com/rapid/lodging/vacation-rentals/vrbo-integration-guide).
- **Rentals United:** a 4-week average go-live is claimed (vendor) — [Rentals United](https://info.rentalsunited.com/whitelabel-channel-manager-api).
- **PPN:** REST/JSON with API-key auth (vendor guide) — [Vervotech](https://www.vervotech.com/hub/guides/priceline-api-integration-guide/).

### Inferences
- Adding several bedbanks later means hotel mapping and deduplication (vendors like Vervotech exist for this). That is a significant hidden cost when going multi-supplier.
- **Fit summary for a small startup** (inference, not sourced ranking):
  - Duffel Stays: best Phase 1 fit (self-serve sandbox, clean docs, no upfront fee) but has opaque earnings.
  - ETG/RateHawk: best second source for net-rate margin and breadth.
  - Hotelbeds: open sandbox, contract for live access.
  - Affiliate links (Agoda for Asia, Booking.com for apartments/homes, Hostelworld for hostels): gap-fillers.
  - Expedia Rapid with Vrbo and Booking.com Demand: Phase 2+, once volume exists.

### Gaps
- Documentation quality for TBO, WebBeds, PPN and TravelgateX was not assessed first-hand.
- Hostelworld, Holidu and Plum Guide API or affiliate programme details for 2026 were not found and need direct checks.
