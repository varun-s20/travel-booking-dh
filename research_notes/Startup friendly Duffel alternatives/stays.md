# Startup-friendly alternatives to Duffel Stays (hotels, apartments, villas, vacation rentals)

Research date: 2026-11-12. "Accessed 2026-11-12" means the page carried no effective date and was read that day. This file builds on `research_notes/Travel supply API comparison/stays.md` and does not repeat it. Earlier providers (Expedia Rapid, Booking.com Demand, Priceline, Agoda/Trip.com affiliates, Hotelbeds, WebBeds, RateHawk/ETG, TBO) appear here only to check whether they take brand-new startups. Budget was about 20 tool calls, so several candidates (Bonotel, Hotelston, HotelPlanner, Rentals United demand side, Vrbo affiliate, Stay22) are covered thinly or only in Gaps. **Vendor-only claims are marked (vendor).** No independent user reviews were found for any of the new providers.

## Which providers will actually onboard a brand-new startup, and on what terms?

### Takeaway
Only LiteAPI (Nuitée) is truly self-serve for a pre-revenue startup with a booking API. You get a free account, a sandbox key at once, and production unlocked by adding a credit card, with no published deposit or minimum. Everything else either needs sales contact and contracts (ZentrumHub, Travelgate, Stuba, RateHawk, Hotelbeds), is affiliate-only (Hostelworld, Holidu, Expedia Travel Creator), or is closed or dead (Hotellook/Travelpayouts hotels, Airbnb, likely Impala).

### Cited Findings
**LiteAPI / Nuitée Connect (self-serve):**
- Signup steps: "create a free account at connect.nuitee.com, copy your sandbox API key from Developer tools, and add a valid credit card under Payment Methods to unlock your production key". No KYC, deposit or minimum is mentioned in the FAQ (accessed 2026-11-12) — [Nuitée docs FAQ](https://docs.nuitee.com/docs/faq).
- The marketing page pitches "Startups: A self-serve API and sandbox to move fast from day one" and "testing with sandbox environments immediately". No deposits or minimums are stated (accessed 2026-11-12) — [nuitee.com/connect](https://nuitee.com/connect).
- The old liteapi.travel domain now 301-redirects to nuitee.com, so the product has been rebranded under Nuitée — [liteapi.travel/pricing redirect](https://www.liteapi.travel/pricing).

**ZentrumHub (aggregator SaaS, sales-led):**
- Claims "No minimum sales requirements" and "No annual volume commitments" (vendor; accessed 2026-11-12) — [ZentrumHub FAQ](https://www.zentrumhub.com/faq).
- Under its BYOL (bring your own license) model you contract directly with each supplier. It lists "Supplier deposits ($5,000-$10,000 per supplier)" as an extra cost (vendor) — [ZentrumHub FAQ](https://www.zentrumhub.com/faq).
- No self-serve signup was found. Contact is via sales and a "free 15-min consultation" — [G2 pricing listing](https://www.g2.com/products/zentrumhub-hotel-api-aggregation-tool/pricing); [Zentrum Booking Engine PDF, Feb 2026](https://www.zentrumhub.com/wp-content/uploads/2026/02/Zentrum-Booking-Engine.pdf).

**Travelgate (TravelgateX), B2B marketplace, sales-led:**
- The startup and SME pages say "Connect for free". The process is "Sign Up, Build, Certify, Buy" and starts by contacting Sales to "understand our success fee model". No amounts are published (accessed 2026-11-12) — [Travelgate startup](https://www.travelgate.com/solutions/startup); [Travelgate SME](https://travelgate.com/solutions/sme-business).
- Buyers "Use the credentials supplied by your Sellers to connect", meaning you need a commercial relationship with each supplier — [Travelgate SME](https://travelgate.com/solutions/sme-business).
- An older Travelgate FAQ says buyers pay "a set-up fee for each supplier connected (except Premium Partners)" and must "have a commercial agreement with them" before connecting. It is undated and may be outdated — [Travelgate blog FAQ](https://blog.travelgate.com/the-top-10-questions-businesses-ask-themselves-before-joining-travelgatex).

**Stuba (B2B bedbank):**
- Developer resources are available "as soon as your registration has been completed". Auth uses an agency AuthApiKey plus a whitelisted IP. There is a test endpoint (testapijson.stuba.com), and the "Live URL will be provided once the certification process has been successfully completed". Credit and deposit terms are not stated (accessed 2026-11-12) — [Stuba developer getting started](https://developer.stuba.com/hapi/getting-started).

**Bonotel and Hotelston:**
- No official registration terms were found. The only sources were reseller (PHPTRAVELS) pages describing Hotelston as a B2B hotel supplier with API rates and availability, and Bonotel as US luxury inventory with test environments — [PHPTRAVELS Hotelston](https://phptravels.com/pl/integrations/hotelston-api-integration); [PHPTRAVELS Bonotel](https://phptravels.com/pl/bonotel-travel-agent).

**Re-check of earlier providers on startup terms:**
- **RateHawk/ETG:** no published deposit or registration requirements were found. Third-party integrators say you contract first, then get sandbox credentials, then production after certification. Net rates are "negotiated based on partner type and volume" and new entrants face "higher scrutiny" (integrator, unverified) — [PHPTRAVELS RateHawk (KO)](https://phptravels.com/ko/integrations/ratehawk-api-integration); [PHPTRAVELS RateHawk](https://phptravels.com/integrations/ratehawk-api-integration). RateHawk reported API partners reaching "1,800 companies globally" in H1 2026, and a 78% jump in API bookings (Aug 2026 trade press) — [eGlobal Travel Media 2026-08-28](https://eglobaltravelmedia.com.au/2026/08/28/ratehawk-plugs-into-growth-as-api-bookings-rise/); [TravelPulse](https://www.travelpulse.ca/news/agents/ratehawk-reports-78-jump-in-api-bookings).
- **Hotelbeds:** no published deposit, credit limit or minimum volume. Integrators say the contract covers "source market, currency, payment terms, and any deposit or credit", and that certification is needed before live access — [PHPTRAVELS Hotelbeds](https://phptravels.com/hotelbeds-api-xml-integration); [AltexSoft](https://www.altexsoft.com/blog/hotelbeds-api-integration/). A competitor claims "boutique agencies are systematically disadvantaged" (competitor marketing, low reliability) — [dmcquote](https://dmcquote.com/compare/hotelbeds-alternative).
- **Bedbank deposits in general:** the only figure found is ZentrumHub's estimate of $5,000–$10,000 per supplier (vendor estimate, not a supplier's own term) — [ZentrumHub FAQ](https://www.zentrumhub.com/faq).

**Affiliate-only or closed:**
- **Hostelworld:** "free to join, with no set-up fees". Commission is CPA, last-click, with a 30-day window. API access is "on a case by case basis" (official partner site, accessed 2026-11-12) — [Hostelworld partners FAQ](https://partners.hostelworld.com/faqs); [Hostelworld solutions](https://partners.hostelworld.com/solutions).
- **Holidu:** has an Affiliate API to "search for offers, retrieve detailed property information, check availabilities", plus an affiliate page offering commission on traffic — [Holidu developer intro](https://developer.holidu.com/reference/intro-1); [Holidu affiliate](https://www.holidu.com/affiliate).
- **Expedia Travel Creator Program / affiliate:** access is by approval. Commission details are visible only after approval — [Expedia Group affiliate program](https://partner.expediagroup.com/en-us/solutions/explore-our-affiliate-program).
- **Travelpayouts / Hotellook:** shut down. From 2025-10-20 the hotel tab disappeared from White Label Web, and "Widgets, landing pages, and the Hotellook API will stop working". Travelpayouts recommends other brands' hotel widgets from its catalogue — [Travelpayouts FAQ on Hotellook closure](https://support.travelpayouts.com/hc/en-us/articles/29534131568530-FAQ-on-the-closure-of-Hotellook).
- **Airbnb:** API access is limited to approved software partners (PMS and channel managers, i.e. supply side). One help site, last reviewed October 2026, reports Airbnb's partner page saying it "is not accepting new access requests for our API". The affiliate programme ended in December 2015 — [bnbcalc](https://www.bnbcalc.com/help/articles/does-airbnb-have-an-api); [Airbnb preferred partners](https://www.airbnb.com/software-partners/preferred-partners); [Track360 Airbnb teardown 2026](https://track360.io/blog/airbnb-vacation-rental-affiliate-referral-programs-operator-teardown-2026).
- **Impala:** no official shutdown notice was found. A third-party health checker lists the Impala Hotel Bookings API as "dead", last verified 2026-04-01 — [API Bouncer](https://www.apibouncer.com/apis/1038/impala-hotel-bookings). The latest substantive press found is from Jan 2022 ($1.75M raise, plans for a distribution API) — [Hotel Tech Report](https://hoteltechreport.com/news/impala-hotel-api). A Jentic listing references a v2 API (undated) — [Jentic](https://jentic.com/apis/impala.travel/impala-hotel-booking-api.md).

### Inferences
- For a brand-new startup that wants an on-site booking API, LiteAPI is the only true like-for-like alternative to Duffel Stays found. It has a lower barrier than Duffel, which needs a contact-form request for Stays access.
- ZentrumHub and Travelgate are not supply. They are connectivity layers that still require the startup to win contracts, and often deposits, with each bedbank. That makes them a Phase 2+ multi-supplier tool, not a launch option.
- Since Travelpayouts lost Hotellook, the Travelpayouts route for hotels is just a wrapper around other brands' affiliate widgets (redirect only).

### Gaps
- No primary-source deposit, credit or minimum-volume figure was found for RateHawk, Hotelbeds, WebBeds, TBO, Stuba, Bonotel or Hotelston. Ask each directly.
- Whether LiteAPI runs KYC or business verification before payouts is not documented in the pages read.
- Impala's actual status: no official statement found. Treat it as defunct unless proven otherwise.
- HotelPlanner: no 2026 partner or API programme terms were found. One undated affiliated page describes a fully white-labelled booking engine for groups and meetings — [HotelPlanner affiliate page (groups.hotels.com)](https://groups.hotels.com/Affiliate.htm). A 2023 deal shows HotelPlanner buying connectivity *from* ZentrumHub — [PYMNTS 2023](https://www.pymnts.com/api/2023/hotelplanner-taps-zentrumhub-for-travel-api-platform/). Whether it offers a bookable API to small partners is unknown.
- Rentals United as a demand-side channel was not researched beyond the earlier file.

## Inventory: size, property types, regions

### Takeaway
LiteAPI claims 2.6M–2.9M properties (vendor, figures conflict), which is comparable to the largest bedbank claims. ZentrumHub claims 500k+ hotels across 100+ suppliers, Travelgate 1,000+ partners, Hostelworld about 36k hostels. Vacation rentals at scale through an open channel come only from Holidu (affiliate API). Airbnb and Vrbo are not open to new demand partners.

### Cited Findings
- **LiteAPI:** "2.9M properties worldwide", with content, rates and availability across "over 150 source markets". The platform also offers flights ("600+ airlines") and experiences ("200K bookable activities") (vendor, accessed 2026-11-12) — [nuitee.com/connect](https://nuitee.com/connect). The FAQ, per a search summary, claims "2.6M+ properties" and says clients can add their own contracted supply. This conflicts with the 2.9M figure — [Nuitée FAQ (search summary)](https://docs.nuitee.com/docs/faq). No split by property type (hotel, apartment, villa) was published.
- **ZentrumHub:** "100+ global suppliers" and "500,000+ hotel properties worldwide" (vendor) — [ZentrumHub FAQ](https://www.zentrumhub.com/faq).
- **Travelgate:** "instant access to more than 1,000 partners worldwide" through one API. That is a count of partners, not properties (vendor) — [Travelgate SME](https://travelgate.com/solutions/sme-business).
- **Hostelworld:** "over 36,000 properties in 170 countries" (as cited on a Rentals United listing page) — [Rentals United: Hostelworld](https://rentalsunited.com/vacation-rental-services/hostelworld).
- **Holidu:** a vacation-rental search engine with its own homeowner inventory, accessible through a channel API ("a simple API for partners to access our homeowners' inventory") — [Holidu Channel API docs](https://holidu.atlassian.net/wiki/spaces/BCAD/overview); [Vervotech Holidu](https://www.vervotech.com/hub/integrations/holidu-api/). No inventory count was found.
- **Stuba, Bonotel, Hotelston:** no primary inventory figures were found. Bonotel is described as US luxury hotel inventory (reseller page) — [PHPTRAVELS Bonotel](https://phptravels.com/pl/bonotel-travel-agent).

### Inferences
- LiteAPI's 2.6M–2.9M almost certainly aggregates the same bedbanks as everyone else (likely including ETG, Hotelbeds and others; not confirmed), so it is not additive with Duffel's pool.
- For villas and vacation rentals specifically, a startup's realistic options are Holidu's Affiliate API (redirect/commission) or whatever apartment supply LiteAPI and Duffel carry. Direct Vrbo (Rapid, limited partners) and Airbnb are closed.

### Gaps
- LiteAPI's upstream sources and its share of apartments, villas and vacation rentals are not published.
- Holidu inventory size and regional coverage were not found from primary sources.

## Booking model and merchant of record

### Takeaway
LiteAPI offers both models. Nuitée can be merchant of record through its payment SDK or white label, with your margin baked into the price. Or you can be merchant of record on net rates. ZentrumHub and Travelgate leave payment and settlement entirely to you and each supplier. Hostelworld, Holidu and Expedia Travel Creator are commission-on-redirect affiliates where the brand takes payment.

### Cited Findings
- **LiteAPI payment methods:** "User Payment (Nuitee SDK), Account Credit Card, Credit Line, and (when enabled) direct `CREDIT_CARD`" — [Nuitée FAQ](https://docs.nuitee.com/docs/faq).
- **LiteAPI merchant of record:** "Nuitee as merchant of record" applies when using the payment SDK or white label. Nuitée processes payments, and your margin sets the guest price. Alternatively you act as merchant of record on net rates (`margin: 0`) and earn through your own service fee or bundling (accessed 2026-11-12) — [Nuitée revenue management and commission](https://docs.nuitee.com/docs/revenue-management-and-commission).
- **LiteAPI credit line:** the nuitee.com dashboard mock-up shows "Credit line available of €70,000 limit". This is a UI illustration, not a published term — [nuitee.com/connect](https://nuitee.com/connect).
- **ZentrumHub:** payment to suppliers is "based on your direct agreements with suppliers", by prepaid wallet or credit line. ZentrumHub "does not handle financial settlement between you and suppliers" (vendor) — [ZentrumHub FAQ](https://www.zentrumhub.com/faq).
- **Hostelworld:** CPA affiliate with last-click attribution. Bookings happen on Hostelworld — [Hostelworld partners FAQ](https://partners.hostelworld.com/faqs).
- **Expedia EAN (Expedia Partner Solutions):** described as "the API and white-label rail", allowing deep links, widgets or a white-label booking flow. TAAP is a portal for agents, not an API (Track360, 2026-06-09) — [Track360 Expedia teardown](https://track360.io/blog/expedia-affiliate-program-ean-taap-operator-teardown-2026).

### Inferences
- LiteAPI with Nuitée as merchant of record is the closest to a "startup does not need its own travel payments stack" setup. Nuitée carries payment processing (and likely chargebacks; not confirmed), and the startup keeps the margin. This compares favourably with Duffel, where the startup pays Duffel up front from its balance or an approved card.
- Customer-service responsibility (who handles guest calls, amendments and no-shows) is not documented for LiteAPI in the pages read. Confirm before launch.

### Gaps
- Whether LiteAPI's merchant-of-record mode means Nuitée's name appears on the guest's card statement, and who owns chargebacks, was not documented in the pages read.
- How Holidu's Affiliate API booking flow works (redirect vs on-site booking) was not confirmed.

## Pricing and earnings

### Takeaway
LiteAPI lets the startup set its own margin, pays out weekly after guest checkout, says there are "no hidden platform fees" on commission, and keeps core booking endpoints free. That is the most transparent earnings model found, and more transparent than Duffel's unpublished profit share. ZentrumHub is a SaaS cost (from about $650/month plus setup and deposits). Affiliate options pay roughly 4–6% (third-party figures).

### Cited Findings
- **LiteAPI margin:** sellers set a percentage `margin` per request. "0" returns net rates, and "You set the margin; there are no hidden platform fees on that commission" — [Nuitée revenue doc](https://docs.nuitee.com/docs/revenue-management-and-commission). A search snippet described margin 5 as "$5 on a room sold at $105". The fetched page describes margin as a percentage. Both readings agree when net is $100. The exact semantics are unconfirmed.
- **LiteAPI payouts:** "Payouts for confirmed bookings go out weekly". "A booking is confirmed when a guest completes their stay and checks out of the hotel" — [Nuitée revenue doc](https://docs.nuitee.com/docs/revenue-management-and-commission).
- **LiteAPI selling-price rules:** SSP is "the recommended minimum selling price" and "the floor for public selling". Selling below SSP must not be public (only in an app, to logged-in users, or as a package) — [Nuitée revenue doc](https://docs.nuitee.com/docs/revenue-management-and-commission).
- **LiteAPI fees:** "Core booking and management endpoints are free". "Some premium features and endpoints are billed separately". Amounts are on a separate pricing page, not read — [Nuitée FAQ](https://docs.nuitee.com/docs/faq).
- **ZentrumHub:**
  - Subscription plans "start around USD $650/month for a minimal setup (2 suppliers)", plus a one-time setup fee. There are no per-booking fees.
  - Extra costs: supplier deposits ($5k–$10k each), hotel mapping (for example Vervotech), and a payment gateway at about 2–3% (vendor) — [ZentrumHub FAQ](https://www.zentrumhub.com/faq).
  - A third-party listing says "Usage Based (Free Trial)", which conflicts with the FAQ's subscription model — [GetApp AU](https://www.getapp.com.au/software/2071847/zentrum-booking-engine).
- **Travelgate:** a "success fee model" with no rates published — [Travelgate SME](https://travelgate.com/solutions/sme-business).
- **Hostelworld commission:** the official site says only CPA. Third-party figures conflict: 18–22% (Partnerize listings), "up to 40% of the deposit" (Travelpayouts), and a flat $50 elsewhere. All are unverified — [Hostelworld on Travelpayouts](https://travelpayouts.com/en/offers/hostelworld-affiliate-program); [way2earning 2026-06](https://www.way2earning.com/2026/06/hostelworld-affiliate-program/).
- **Holidu commission:** "5%" on one Awin programme, and a 30-day cookie on FlexOffers (France). Both are third-party listings — [Awin Holidu](https://ui.awin.com/merchant-profile/31469); [FlexOffers Holidu FR](https://www.flexoffers.com/affiliate-programs/holidu-fr-affiliate-program).
- **Expedia/Hotels.com affiliate:** "up to 4%" from day one via Travel Creator, and about 6–6.4% per third-party directories (Referly) — [Referly Hotels.com](https://www.referly.so/affiliate-programs/hotelscom). Track360 publishes no numbers, only that hotels pay the highest of any product — [Track360](https://track360.io/blog/expedia-affiliate-program-ean-taap-operator-teardown-2026).

### Inferences
- On a $300 stay, a 10–15% LiteAPI margin is $30–45 per booking. That compares with about $12–18 from a 4–6% affiliate commission. Net of payment risk, LiteAPI with Nuitée as merchant of record looks like the best economics available to a zero-history startup. This assumes the margin still converts against Booking.com prices, which was not tested.
- ZentrumHub's minimum outlay is about $650/month plus setup plus $10k–$20k in deposits for two suppliers. That is not startup-friendly before revenue.

### Gaps
- LiteAPI premium endpoint prices, and whether any FX or card processing fee comes out of the margin in merchant-of-record mode, were not found.
- Travelgate success-fee rates are not published.
- There are no official Hostelworld, Holidu or Expedia Travel Creator commission tables.

## Integration effort, sandbox, docs and reputation

### Takeaway
LiteAPI has the lightest integration: an OpenAPI/REST API key, a sandbox that mirrors production for hotels, a Postman collection, SDKs, and claims of going live "in hours" (vendor). ZentrumHub claims 30–45 days. Stuba and Travelgate need certification. No independent user reviews or forum reports were found for LiteAPI, ZentrumHub, Travelgate or Stuba in this session.

### Cited Findings
- **LiteAPI developer tooling:**
  - The hotel sandbox "mirrors the production booking flow". The flights sandbox does not mirror production. The rate limit is 5 requests per second. Support is through Intercom and a Discord community — [Nuitée FAQ](https://docs.nuitee.com/docs/faq).
  - OpenAPI-based docs, a Postman collection and API-key header auth. Marketing claims "zero to live search and booking in hours" (vendor, from search summary) — [Nuitée FAQ (search summary)](https://docs.nuitee.com/docs/faq).
  - A third-party PHP SDK exists — [Packagist](https://packagist.org/packages/konfig/nuitee-lite-php-sdk).
  - A reviews endpoint is available — [LiteAPI reviews endpoint](https://developers.liteapi.travel/api-reference/hotels/get-the-reviews-of-a-hotel).
- **ZentrumHub:** "Typically 30-45 days" for standard implementations, "as little as 15 days" for a white-label engine, and integration itself takes 2–4 weeks (vendor) — [ZentrumHub FAQ](https://www.zentrumhub.com/faq).
- **Travelgate:** buyers must "Build, Certify" before buying — [Travelgate startup](https://www.travelgate.com/solutions/startup).
- **Stuba:** JSON test API, then certification before the live URL is issued — [Stuba developer](https://developer.stuba.com/hapi/getting-started).
- **Holidu:** a documented Affiliate API on a developer hub — [Holidu developer](https://developer.holidu.com/reference/intro-1).
- **Reputation:** a search for 2026 LiteAPI reviews returned only vendor material and API directories, with no G2/Capterra-style ratings or independent benchmarks — [apis.io Nuitée listing](https://apis.io/apis/nuitee/nuitee-hotel-data-api/). G2 lists ZentrumHub but publishes no pricing, and no review content was read — [G2 ZentrumHub](https://www.g2.com/products/zentrumhub-hotel-api-aggregation-tool/pricing).

### Inferences
- A Duffel-style Next.js integration could be ported to LiteAPI fairly directly. Both use a search → rates → prebook → book flow (LiteAPI prebook is inferred from FAQ wording: "search rates, prebook, and book").
- With no independent reputation data, a small paid pilot (sandbox, then a few real bookings) is the only way to judge LiteAPI's rate competitiveness, confirmation reliability and support quality.

### Gaps
- No developer-forum or Reddit reports were found for LiteAPI, ZentrumHub or Travelgate in this session. Reputation remains unverified.
- No documentation quality assessment was made for Bonotel, Hotelston or HotelPlanner.
- Stay22, which appeared in search as a 2026 affiliate aggregator, was not researched — [Stay22 2026 list](https://stay22.com/best-commission-travel-affiliate-programs-2026).
