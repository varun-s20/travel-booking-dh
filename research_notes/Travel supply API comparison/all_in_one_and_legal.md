# All-in-one travel supply and the business/legal side for a small US B2C OTA

Research date: 2026-11-12. "Accessed 2026-11-12" means the page was found in a search on that date and no publish date was visible. Publish dates are given where the source showed one. Most supplier terms are not public, and many results came from vendor or reseller blogs (AltexSoft, PHPTRAVELS, Zentrumhub, Tripgic, TravelBoost), which sell integration services. Treat those as indicative only, not official.

## Q1. Which single providers can supply most or all products through one contract and API, and how complete is each?

### Takeaway
No single supplier a new small agency can get covers all seven products (flights, stays, cars, activities, transfers, cruises, packages) with real-time API booking under one contract. Duffel comes closest for a startup's first phase: flights, stays and, since April 2026, cars, all in one self-serve API. Expedia (Rapid) and Hotelbeds are the strongest one-contract options for non-air products. Activities and transfers are still beta or "coming soon" at several big brands. Cruises are thinly covered everywhere, so they will almost certainly need a separate cruise supplier or a cruise-line or consolidator agreement.

### Cited findings

**Duffel (flights, stays, cars)**
- Duffel Cars launched in late April 2026. It offers car rentals from 40 global providers (including Avis, Sixt, Enterprise, Hertz and Europcar) at 40,000+ locations in 200 countries, through the same API as Flights and Stays. — [Duffel blog: Introducing Duffel Cars](https://duffel.com/blog/introducing-duffel-cars); launch reported 2026-04-23 by [Business Travel News](https://www.businesstravelnews.com/Distribution/Duffel-Adds-Car-Rental-Booking-Capabilities)
- Duffel Flights connects to 500+ airlines. Duffel Stays offers about 1.6 million properties and grew 10,000% in the 12 months before the Cars launch (Duffel's own claim, April 2026). — [Duffel blog](https://duffel.com/blog/introducing-duffel-cars)
- Duffel said it was on track for $900m total transaction value in 2026, with 85% of volume from the US (April 2026). — [BusinessCloud](https://businesscloud.co.uk/news/duffel-hits-900m-run-rate-and-launches-cars-vertical/)
- Robinhood chose Duffel to power flights, hotels and car rentals in Robinhood Travel. The date is unclear: search results show conflicting dates, and it was reported some time after April 2026. — [Finextra](https://www.finextra.com/pressarticle/111185/robinhood-taps-duffel-to-power-travel-platform)
- Duffel is also behind holiday search and booking in Meta's "Muse" AI agent (date not verified). — [Duffel blog](https://duffel.com/blog/millions-of-users-can-now-use-duffel-to-search-book-and-manage-holidays-on-muse-the-new-personal-ai-agent-from-meta)
- No Duffel activities, transfers, cruises or packages product was found as of 2026-11-12. — [Duffel blog news tag](https://duffel.com/blog?tag=news) (absence of evidence only)

**Expedia Group / Expedia Partner Solutions (EPS)**
- Rapid API access requires becoming an Expedia partner first. After approval, partners get an API key and shared secret, and every request is signed with an SHA-512 hash (accessed 2026-11-12). — [Expedia Developer Hub: Get started](https://developers.expediagroup.com/rapid/setup)
- Rapid lodging launch requirements cover price display: show the total price, show taxes and fees if a breakdown is given, and keep any partner service charge clearly separate from Expedia's charges (accessed 2026-11-12). — [Expedia Lodging launch requirements](https://developers.expediagroup.com/rapid/setup/launch-requirements/lodging-launch-reqs?locale=en_US)
- The Rapid Activities API is in beta with select partners. A wider release is planned for 2027, and interested partners can join a waitlist (accessed 2026-11-12). — [Expedia Group partner page: Rapid Activities API](https://partner.expediagroup.com/en-us/landing-pages/make-every-trip-more-memorable-with-rapid-activities-api)
- Expedia runs a Certified Technology Partners programme, so tech vendors can connect agencies to Rapid. — [Expedia Certified Technology Partners](https://partner.expediagroup.com/en-us/solutions/build-your-travel-experience/rapid-api/certified-technology-partners-program)
- White Label Template / White Label Travel Platform: Expedia hosts the template site. What the partner supplies is mainly site setup and branding (a domain, plus an optional "powered by Expedia/Hotels.com" message) (accessed 2026-11-12). — [Expedia Developer Hub: White label requirements](https://developers.expediagroup.com/white-label-travel-platform/getting-started/requirements)
- Under the EPS API route, Expedia is described as merchant of record and holder of the traveller relationship. This is a secondary claim and should be confirmed in the EPS contract. — [AltexSoft: Expedia TAAP & Rapid](https://www.altexsoft.com/blog/expedia-taap-rapid-api-partner-solutions/)
- TAAP (Travel Agent Affiliate Program) accepts only agencies with IATA, ARC, CLIA or TRUE credentials, charges no fee and has no minimum sales. It is an agent booking tool, and AltexSoft calls it a poor option for OTAs because it lacks automation. — [AltexSoft](https://www.altexsoft.com/blog/expedia-taap-rapid-api-partner-solutions/); [MainStreet Travel Agency 2026 guide](https://mainstreetagencytravel.com/news/expedia-taap-the-smart-complete-guide-for-travel-agents-in-2026)
- I found no 2026 official documentation for Rapid flights or Rapid cars APIs. Treat their availability to new small partners as unverified. — search result summary for [Expedia Developer Hub](https://developers.expediagroup.com/rapid/setup)
- A third party says Expedia charges no published fee for Rapid access and is deliberately selective about partners. — [Zentrumhub: Expedia API integration (2026)](https://www.zentrumhub.com/blog/expedia-rapid-hotel-api-integration/)

**Booking.com Demand API / affiliate**
- The Demand API landing page lists Stays and Car rentals, with Flights\*, Attractions\* and Airport taxis\* marked with an asterisk as "coming soon" (accessed 2026-11-12). — [Booking.com Demand API](https://developers.booking.com/demand)
- v3.1 is the stable version. v3.2 is in beta and offered to a limited number of pilot affiliate partners, and it includes cars and attractions endpoints. Attraction details return no pricing (accessed 2026-11-12). — [Demand API 3.2 docs](https://developers.booking.com/demand/docs/open-api/3.2/demand-api); [3.2-beta cars](https://developers.booking.com/demand/docs/open-api/3.2-beta/demand-api/cars)
- Demand API credentials reportedly require approved "Managed Affiliate Partner" status, and the hard rate limit is reportedly 50 requests/minute. This comes from a third party (Supergood, last verified July 2026) and is not on Booking's pages. — [Supergood API report card](https://supergood.ai/api-report-card/booking-com)
- Booking introduced a merchant model alongside agency in 2015. Booking's merchant gross bookings reportedly grew 24.8% to $130.0bn in 2025 (secondary). — [OTA Playbook](https://otaplaybook.com/merchant-model-vs-agency-model-ota/)

**Priceline Partner Network (PPN)**
- Priceline's partner-gated REST/JSON APIs reportedly cover hotels, flights, cars and packages. Approval is reportedly gated on partner type, expected volume and use case. These are secondary, low-quality sources, and no official PPN page was found. — [Supergood: Priceline](https://supergood.ai/api-report-card/priceline); [AltexSoft techtalk](https://www.altexsoft.com/techtalks/how-to-integrate-priceline-api/)
- Priceline also runs an affiliate programme offering links, banners, API and private-label tools. — [Travelpayouts blog](https://travelpayouts.com/blog/the-priceline-affiliate-program/)

**Hotelbeds (HBX Group)**
- The Hotelbeds developer portal offers booking, content and cache APIs for hotels, activities, transfers and car rental (accessed 2026-11-12). — [Hotelbeds Developer](https://developer.hotelbeds.com/)
- Onboarding reportedly works like this: a free evaluation API key and sandbox, then certification, then go-live at commercial rates. Startups should expect deposit, credit or prepaid terms (2026 secondary guide). — [PHPTRAVELS: Travel API suppliers for startups](https://phptravels.com/blog/travel-api-suppliers)
- Hotelbeds trades as part of HBX Group. — [Wikipedia: HBX Group](https://en.wikipedia.org/wiki/HBX_Group)
- No flights. No published minimum volume found.

**Trip.com**
- The affiliate programme runs in-house and through Travelpayouts, Awin, Admitad and Involve Asia. — [Trip.com Ask page](https://sg.trip.com/ask/questions/trip.com-affiliate-program.html)
- Awin's default commissions (accessed 2026-11-12) are hotels 5.5%, flights 1%, car rental 5%, airport transfers 5%, flight+hotel packages 2.5%, tickets 2.5% and other activities 4%. The North America programme has a 30-day cookie. — [Awin merchant profile](https://ui.awin.com/merchant-profile/22405)
- A deeper B2B "Trip.com Partner Solutions" API is reportedly available to qualified high-volume partners at pages.trip.com/intl/en/partner. That page was not opened, and its eligibility is unverified. — [parse.bot listing](https://parse.bot/marketplace/3029f012-6ddd-4457-b0d2-418adcfcccf1/hk-trip-com-api)

**TBO (TBO Holidays / TBO Tek)**
- TBO's APIs give agents and enterprises access to global inventory with real-time pricing and availability, plus a dedicated API support team (accessed 2026-11-12). — [TBO APIs](https://www.tbo.com/tbo-api)
- Third parties list TBO API coverage as flights, hotels, transfers, activities and dynamic packaging. Onboarding reportedly needs business licence, GST/VAT and ID documents. — [Sriggle](https://www.sriggle.com/travelboutiqueonline-api/); [Travorahub](https://travorahub.com/blog/tbo-for-travel-agents-guide)
- The hotel API is XML. — [TBO Holidays XML API](https://www.tboholidays.com/xml_api.aspx)
- I could not verify whether TBO onboards US-domiciled agencies, or on what terms.

**Travelport and Sabre (multi-product GDSs)**
- Travelport's current platform is "TripServices". The legacy Universal API is reportedly closed to new customers. Old JSON auth endpoints were reportedly deprecated on 2026-01-30. There is also a reported annual API access fee of about $5,000, which AltexSoft reports and Travelport has not confirmed. — [Tripgic: Travelport API guide](https://www.tripgic.com/playbook/travelport-api/)
- Sabre access reportedly follows this path: register on Sabre Dev Studio, business verification, commercial agreement, technical certification. No published price. — [Traveltekpro](https://traveltekpro.com/how-to-obtain-sabre-gds-api-for-your-travel-business/); [Tripgic GDS comparison](https://www.tripgic.com/playbook/amadeus-vs-sabre-vs-travelport/)
- A direct GDS integration reportedly takes 6–12 months, versus days for a modern API. A common startup path is to start with Duffel or Amadeus and add Sabre or Travelport later. — [Tripgic: Best travel API 2026](https://www.tripgic.com/playbook/best-travel-api/)
- GDSs carry air, hotel, car and some rail or cruise content, but ticketing needs ARC/IATA accreditation or someone else's ticketing authority (see Q3). — [Tripgic](https://www.tripgic.com/playbook/amadeus-vs-sabre-vs-travelport/)

**White-label OTA platforms that bundle supply**
- Travelomatix's own site says a travel portal costs between US$5,000 and US$150,000, depending on features, GDS connectivity, source code and support (accessed 2026-11-12). — [Travelomatix](https://www.travelomatix.com/)
- Travelopro Premium costs about ₹35K–₹60K per month (about US$400–700/month at roughly 85 INR/USD; my conversion). Provab is custom-quote, about ₹2L–₹10L (about US$2.4k–12k). These figures come from an India-focused 2026 guide and are not vendor-confirmed. — [Codingclave](https://codingclave.com/guides/best-tour-operator-software-india-2026)
- Trawex and Travelopro are quote-based custom builds that take weeks to months. Supplier, GDS and channel integration fees can exceed the platform cost, and pricing is typically setup fee + monthly subscription + per-transaction fee. — [Faretour comparison (2026)](https://www.faretoursoftware.com/blog/best-white-label-travel-booking-software-compared)
- Zentrumhub is hotel-API-led, reportedly with 100+ hotel suppliers (Expedia, Agoda, RateHawk, Dida, Yalago, WebBeds). No pricing found. — [Innovate Solution](https://www.innovatesolution.com/top-travel-api-providers); [Zentrumhub Expedia](https://www.zentrumhub.com/expedia-hotel-api/)
- Juniper: no pricing or current product data found in this pass.

### Inferences
- Rough completeness ranking for a new small US agency (my judgement from the findings above):
  1. **Duffel**: flights, stays and cars, self-serve, live today.
  2. **Hotelbeds**: hotels, activities, transfers and cars, no air.
  3. **Expedia Rapid**: lodging live; activities in beta until 2027; flights and cars unverified for new partners.
  4. **Booking Demand API**: stays and cars; flights, attractions and taxis coming soon or in pilot; gated.
  5. **Priceline PPN**: hotels, flights, cars and packages on paper, but volume-gated.
  6. **GDSs**: broadest air, but slow, costly and accreditation-dependent.
- No provider found covers cruises via a public API for a startup. Plan cruises as a separate later integration or an affiliate link-out.
- White-label platforms do not include supply. They are booking-engine software that connects to the supplier contracts above, which the agency still has to win.
- A realistic phase-1 stack is Duffel (air + stays + cars). Add Hotelbeds when activities and transfers launch, and optionally Expedia Rapid for deeper hotel inventory once some traffic exists.

### Gaps
- Official PPN partner terms, Trip.com Partner Solutions eligibility, TBO US eligibility, Juniper pricing, and current Rapid flights/cars availability were not verified.
- Duffel pricing (per-booking fees, FX/payment fees) was not fetched this pass. Check duffel.com/pricing.
- Duffel's announced roadmap beyond cars (activities, transfers) was not found.

## Q2. Merchant of record vs agency model: payments, refunds and chargebacks

### Takeaway
Under the merchant model, the OTA charges the card. It earns markup or margin, but owns refunds, chargebacks, fraud and often tax exposure. Under the agency model, the supplier (hotel or airline) charges the card and carries most chargeback risk, and the OTA earns commission. Many APIs let a reseller be merchant without owning a card-processing risk stack. Examples are Duffel, where the startup pays Duffel for the booking, and Expedia Rapid, where Expedia acts as MoR (to be confirmed in contract).

### Cited findings
- In the agency model, the OTA acts as agent and the hotel is merchant of record. In the merchant model, the OTA collects at booking and remits to the hotel net of commission after the stay. — [OTA Playbook](https://otaplaybook.com/merchant-model-vs-agency-model-ota/)
- In the agency model, the hotel handles refunds; the OTA can mediate but cannot refund on its own, and chargebacks land on the hotel. In the merchant model, the OTA processes refunds and may charge the hotel back under the partner agreement. — [OTA Playbook](https://otaplaybook.com/merchant-model-vs-agency-model-ota/)
- The agency model shifts most chargeback risk to the supplier. The merchant model puts chargebacks, refunds and tax exposure on the platform. — [AltexSoft: Merchant of Record in Travel](https://www.altexsoft.com/blog/merchant-of-record-in-travel/); [AltexSoft: Agency model](https://www.altexsoft.com/blog/agency-model/)
- Travel chargebacks can arrive months after the sale, because the dispute window usually runs from the travel date, not the purchase date. — [Payment Nerds](https://paymentnerds.com/blog/why-travel-chargebacks-can-show-up-months-after-the-sale/)
- US airfare refund rule (DOT): the responsible airline or ticket agent must issue a refund within 7 business days for credit-card purchases. Who is responsible depends on who is merchant of record. — cited via [OTA Playbook](https://otaplaybook.com/merchant-model-vs-agency-model-ota/). The underlying rule is DOT's 2024 automatic-refund rule, but the primary DOT page was not fetched this pass.
- Whether Expedia properties run merchant ("Expedia Collect") or agency ("Hotel Collect") is set per property contract. — [OTA Playbook](https://otaplaybook.com/merchant-model-vs-agency-model-ota/)
- Travel is a high-risk category for card acquirers. Processors may demand reserves or rolling holdbacks, because money is taken long before the service is delivered (secondary). — [PayKings](https://paykings.com/blog/travel-agency-merchant-accounts/)

### Inferences
- If the client takes payment through its own Stripe/Adyen account for net-rate inventory, it becomes MoR. Expect a rolling reserve or holdback, chargeback exposure until after travel, and the DOT 7-business-day refund duty on air.
- The lowest-risk start is to let suppliers be MoR, using affiliate links or a supplier-collect model, or to use an API whose payment layer absorbs card risk. The trade-off is lower margin and less control over the customer.

### Gaps
- DOT's 2024 refund rule and its 2026 status were not fetched from transportation.gov.
- Stripe and Adyen's current stance on travel merchants (reserve percentages) was not checked.

## Q3. US seller-of-travel, IATA/ARC, bonding, PCI DSS, approval hurdles and costs

### Takeaway
A US online agency selling to consumers in California, Florida, Washington or Hawaii generally must register in each of those states, whatever state it is based in. Annual costs run about $100–$400 each plus bonds, and Florida's bond is $25,000. ARC accreditation is needed only to issue air tickets yourself: about $2,000–$3,000 application plus a $20,000 bond, roughly 90 days. A startup using Duffel or a consolidator does not need ARC. US agencies cannot get IATA TIDS; IATAN is the US non-ticketing ID. For card data, use hosted fields or an iframe to stay in SAQ A, and under v4.0.1 also protect the payment page against script attacks.

### Cited findings

**Seller-of-travel registration (fees vary by source; confirm with each state)**
- Four states have active seller-of-travel registration (CA, FL, HI, WA). One 2026 guide says Maryland registration is rolling out as of October 2026. This is unverified; check the Maryland AG or Secretary of State. — [Fora Travel: State rules for 2026](https://www.foratravel.com/join/resources/do-you-need-a-travel-agent-license); [Host Agency Reviews](https://hostagencyreviews.com/blog/travel-agent-license-seller-of-travel-license)
- **California** (Attorney General Seller of Travel Program): an annual fee, plus participation in the Travel Consumer Restitution Fund or a bond or trust account in its place. Sources give $100 per location per year for the CST number and $330 to join the restitution fund. These are secondary figures. — [Host Agency Reviews](https://hostagencyreviews.com/blog/travel-agent-license-seller-of-travel-license); [Atlas Coast Travel](https://www.atlascoasttravel.com/blog/seller-of-travel-laws-by-state)
- **Florida** (FDACS): about $300/year. Bond of $25,000, or $50,000 for sellers of vacation certificates. Businesses with a clean record and 5+ years in Florida can get a waiver or a reduced bond of $10k–$20k. — [Fora Travel](https://www.foratravel.com/join/resources/do-you-need-a-travel-agent-license); [A1 Surety Bonds](https://a1suretybonds.com/surety-bonds/seller-of-travel)
- **Hawaii** (DCCA): $215 in even-numbered years and $146 in odd-numbered years (secondary). — [Atlas Coast Travel](https://www.atlascoasttravel.com/blog/seller-of-travel-laws-by-state)
- **Washington** (Department of Licensing): sources conflict on the annual fee ($222 vs $234, plus $25 per additional location). Some sources say the bond is tied to the previous year's sales, and there is a trust-account requirement for client funds. — [Junglebee](https://junglebee.com/blog/seller-of-travel-laws-tour-operator-registration); [Luxrally 2026 guide](https://luxrallytravel.com/travel-agent-licensing-by-state)
- Seller-of-travel laws generally apply to sellers serving residents of the state, not only to businesses based there. — [Host Agency Reviews](https://hostagencyreviews.com/blog/travel-agent-license-seller-of-travel-license)

**ARC**
- New applicants must provide a bond, letter of credit or cash deposit of at least $20,000. The minimum is $150,000 if the parent entity is domiciled outside the US (accessed 2026-11-12). — [ARC: Information on agency accreditation](https://www2.arccorp.com/support-training/airlines/information-on-agency-accreditation-for-airlines/)
- ARC's 2020 datasheet lists a $2,300 new-agency application fee. 2026 guides cite $2,000, $2,300 or $3,000, so confirm on arccorp.com. — [ARC Accreditation datasheet (2020)](https://www2.arccorp.com/globalassets/products--participation/travel-agencies/become-an-arc-agent/Accreditation-Datasheet_2020.pdf); [TravelBoost 2026](https://travelboost.app/blog/arc-accreditation-travel-agency)
- The bond can drop to $10,000 after two years. ARC runs background checks and may inspect the premises on site. Processing takes about 90 days. — [SuretyBonds.com](https://www.suretybonds.com/guide/federal/arc-accreditation); [Integrity Surety](https://integritysurety.com/arc-bonds-everything-you-need-to-know/)
- ARC's Verified Travel Consultant (VTC) option costs $195 with no bond, but does not allow ticketing. — [AltexSoft: ARC accreditation](https://www.altexsoft.com/blog/arc-accreditation/)

**IATA / IATAN**
- IATA TIDS is free elsewhere but is not available to US businesses. In the US, IATAN offers the non-ticketing ID, and ticketing needs ARC. — [AltexSoft: Travel agency accreditation](https://www.altexsoft.com/blog/travel-agency-accreditation/); [PHPTRAVELS 2026](https://phptravels.com/blog/how-to-certify-as-an-iata-travel-agency)
- IATAN fees: a recent source gives about $280 application + $120 annual for an agency. An older source gives $247 + $103. Confirm with IATAN. — [Fora Travel: IATA number](https://www.foratravel.com/join/resources/how-to-get-iata-number); [AltexSoft](https://www.altexsoft.com/blog/iata-accreditation/)
- Searching fares needs no accreditation. Issuing tickets needs ARC (US) or IATA, or someone else's ticketing authority (a host agency, consolidator or API provider). — [Tripgic](https://www.tripgic.com/playbook/amadeus-vs-sabre-vs-travelport/)
- TAAP and some other supplier programmes require IATA, ARC, CLIA or TRUE credentials. — [AltexSoft](https://www.altexsoft.com/blog/expedia-taap-rapid-api-partner-solutions/)

**PCI DSS (v4.0.1, all future-dated requirements mandatory since 2025-03-31)**
- In the January 2025 SAQ A revision, requirements 6.4.3 (payment-page script inventory and authorisation) and 11.6.1 (change and tamper detection) were removed from the questionnaire body. They were replaced by an eligibility criterion: the merchant must confirm its site is not susceptible to script-based attacks. The merchant meets it either by applying 6.4.3/11.6.1-style techniques or by getting written confirmation from a PCI-compliant third-party service provider. — [Hyperproof](https://hyperproof.io/resource/pci-dss-4-0-update-new-saq-a-eligibility-criteria/); [Report URI FAQ](https://blog.report-uri.com/pci-dss-4-0-1-saq-a-and-client-side-security-a-plain-english-faq/)
- PCI SSC published an Information Supplement on 6.4.3 and 11.6.1 in March 2025. — [Hyperproof](https://hyperproof.io/resource/pci-dss-4-0-update-new-saq-a-eligibility-criteria/)
- Experts disagree on scope. TrustedSec says protecting only the page that hosts the iframe is enough; Akamai argues the scope now extends to the whole site. — [TrustedSec](https://trustedsec.com/blog/the-hidden-trap-in-the-pci-dss-saq-a-changes); [Akamai](https://www.akamai.com/blog/security/pci-dss-v4-0-1-changes-qualify-saq-a)

**Approval hurdles for new, no-traffic agencies**
- Expedia is selective about partners. — [Zentrumhub](https://www.zentrumhub.com/blog/expedia-rapid-hotel-api-integration/)
- Booking Demand API needs Managed Affiliate status. — [Supergood](https://supergood.ai/api-report-card/booking-com)
- PPN gates on expected volume. — [Supergood](https://supergood.ai/api-report-card/priceline)
- Hotelbeds may require deposits or prepayment from startups. — [PHPTRAVELS](https://phptravels.com/blog/travel-api-suppliers)
- GDSs need a commercial agreement plus certification, with a reported fee of about $5k/year for Travelport. — [Tripgic](https://www.tripgic.com/playbook/travelport-api/)
- Startups without accreditation can operate through host agencies, consolidators or certified technology partners until they qualify. — [Tripgic](https://www.tripgic.com/playbook/amadeus-vs-sabre-vs-travelport/)

**EU/UK differences (brief)**
- UK: the old ATOL "Flight-Plus" category has been abolished. Flight-inclusive bookings are now packages, defined by the Package Travel Regulations as two or more travel services for the same trip, or linked travel arrangements (LTAs). Package sellers need their own ATOL, ATOL agent status under an ATOL holder, or an exemption. Hotel-only and non-flight packages are protected under the PTRs by bond, insurance or trust instead. LTAs sit outside ATOL with split protection, and the seller must say up front whether a sale is a package or an LTA. — [Travelgenix: ATOL explained](https://www.travelgenix.io/guides/atol-explained); [Travel Weekly UK](https://travelweekly.co.uk/in-depth/special-report-atol-consultations-your-questions-answered)
- A small-business ATOL reportedly costs £1,538 from 2026-04-01. This is a single source; check with the CAA. — [Travelgenix](https://www.travelgenix.io/guides/atol-explained)
- EU: the Package Travel Directive (2015/2302) works the same way: packages make the organiser liable and require insolvency protection, and LTAs carry lighter duties. — implied by [Travelgenix](https://www.travelgenix.io/guides/atol-explained); the EU primary text was not fetched.

### Inferences
- Budget for a US launch, excluding legal fees (my estimate from the figures above):
  - State registrations (CA, FL, HI, WA): about $1,000–$1,500/year.
  - Florida bond premium: typically 1–3% of $25k, so about $250–$750/year. This is a general surety-pricing norm, not sourced here.
  - IATAN (optional): about $400 in year one.
  - ARC (only if self-ticketing): about $2–3k plus the $20k bond.
  - PCI: SAQ A self-assessment with hosted payment fields, plus a script-monitoring tool.
- Selling flight + hotel together may make the agency a package organiser in the UK or EU, with liability and insolvency protection. In the US this is mostly handled by seller-of-travel trust or bond rules.

### Gaps
- Official CA, FL, WA and HI fee pages were not fetched. The figures are from secondary 2025–2026 guides and conflict for WA.
- The Maryland 2026 rollout is unverified.
- The current ARC fee, the IATAN fee schedule and the official PCI SSC SAQ A text were not fetched.
- Status of the EU revision of the Package Travel Directive (2023 Commission proposal) as of November 2026 is unknown. It needs checking.

## Q4. Typical path for a small startup OTA to reach full global inventory

### Takeaway
The common sequence is:
1. Start with affiliate links or a self-serve aggregator API, with no accreditation and the supplier or API carrying ticketing and MoR.
2. Add a bedbank for hotels, activities and transfers once you have traffic and deposits.
3. Seek Expedia, Booking or Priceline partner status with traffic data in hand.
4. Only at scale, get ARC/IATAN and a direct GDS or NDC connection.

### Cited findings
- Several guides suggest starting with Duffel or Amadeus self-service for speed, then layering in Sabre or Travelport as volume and content needs grow. — [Tripgic: Best travel API 2026](https://www.tripgic.com/playbook/best-travel-api/); [Teenvaai 2026 flight API guide](https://teenvaai.com/blogs/best-flight-apis-for-travel-startups-2026)
- Unaccredited agencies use host agencies, consolidators or certified tech partners for indirect ticketing until they qualify. — [Tripgic](https://www.tripgic.com/playbook/amadeus-vs-sabre-vs-travelport/)
- A direct GDS integration takes 6–12 months, versus days for a modern API. — [Tripgic](https://www.tripgic.com/playbook/best-travel-api/)
- Affiliate networks (Awin, Travelpayouts) give instant access to Trip.com, Priceline and others at commission rates of 1–7%. — [Awin](https://ui.awin.com/merchant-profile/22405); [Travelpayouts](https://travelpayouts.com/en/offers/trip-com-affiliate-program)

### Inferences
Suggested path for this client:
- **Phase 1 (launch):**
  - Duffel for flights, stays and cars.
  - The client registers as seller of travel in CA, FL, HI and WA if selling to their residents.
  - PCI SAQ A with hosted fields.
- **Phase 2:** Hotelbeds for activities and transfers, plus extra hotels.
- **Phase 3:** Apply to Expedia Rapid or Booking Demand once traffic exists. Use cruise affiliate or consolidator links.
- **Phase 4:** ARC and IATAN, plus GDS or NDC, if air margin justifies it.

This is my synthesis, not one documented case.

### Gaps
- I found no published case study of a small OTA's actual supplier sequence with dates.
- Cruise API options for startups were not researched.
