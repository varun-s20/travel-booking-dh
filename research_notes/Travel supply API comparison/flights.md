# Flight supply APIs for a small US B2C OTA (Next.js, USD, English): comparison

Research date: 12 Nov 2026. "Retrieved 2026-11-12" means the source was read today and the page itself shows no date. Most counts are vendors' own marketing claims, and none are independently audited. Third-party integrator blogs (adivaha, phptravels, provab, oneclickitsolution, ignav, airlabs, supergood.ai) sell competing or adjacent services, so they are flagged wherever they are used.

Candidate status at a glance (details and sources in the sections below):
- Duffel: open self-serve signup, published pay-as-you-go pricing, books through its own IATA accreditations. The only candidate here with transparent public pricing.
- Amadeus Self-Service: retired (registrations paused Feb 2026, shut down 17 Jul 2026). Only Amadeus Enterprise remains, by request and contract.
- Kiwi.com Tequila: invitation-only for new partners since May 2024.
- Sabre, Travelport: GDS contracts, PCC-bound credentials, certification, and in practice ARC/IATA or a host agency or consolidator.
- Mystifly, Travelfusion, Verteil: B2B aggregators with sales-led onboarding, quote-based pricing and no public price list.
- Expedia (EPS Rapid), Priceline Partner Solutions: no confirmed self-serve flights booking API (EPS Rapid is lodging-first); partner-gated.
- Skyscanner: metasearch only (redirect model), partner-gated application, reportedly a traffic threshold.

## 1. Inventory coverage: how many airlines and which types (GDS, NDC, LCC)?

### Takeaway
No single provider covers every airline. Duffel claims 300+ airlines (GDS plus 30+ direct/NDC connects plus some LCCs). Travelfusion is the LCC specialist (about 400 LCCs claimed). Mystifly claims 500+ airlines including 200+ LCCs. Verteil is NDC-only (50 to 75+ airlines). "Widest possible inventory" realistically means Duffel plus an LCC aggregator such as Travelfusion or Mystifly, or a full GDS contract plus aggregators.

### Cited Findings
- **Duffel:** "a single integration" gives access to "300+ airlines including 30+ Direct Connects" (undated Duffel blog post, retrieved 2026-11-12) — [Duffel blog, BA NDC](https://duffel.com/blog/best-flight-booking-experience-british-airways-ndc)
- **Duffel:** says it works directly with airlines "to supply you with low cost carrier, NDC and GDS content" (retrieved 2026-11-12) — [Duffel, already selling flights](https://duffel.com/already-selling-flights)
- **Duffel:** older Duffel material cited NDC from "more than 18" airlines, and a 2021 event listing said "25+". Both are superseded by the 300+/30+ claim — [Duffel help, What is NDC](https://help.duffel.com/hc/en-gb/articles/360019684379-What-is-NDC); [World Aviation Festival 2021 listing](https://app.swapcard.com/event/world-aviation-festival-2021/product/UHJvZHVjdF81ODIwMTU=)
- **Duffel:** has a blog post titled "Duffel now offers more choice in airlines, covering nearly 80% of target markets" (undated, retrieved 2026-11-12) — [Duffel blog](https://duffel.com/blog/duffel-offers-more-choice-in-airlines)
- **Duffel:** has a content deal with Travelport (headline: "Duffel strikes Travelport deal to bring more choice to its travel merchants"), meaning some of its GDS content is sourced through Travelport. The article date was not captured — [Travolution](https://travolution.com/news/travel-sectors/air/duffel-strikes-travelport-deal-to-bring-more-choice-to-its-travel-merchants)
- **Duffel pricing page:** mentions access to Duffel's "5 IATAs worldwide" through Managed Content (retrieved 2026-11-12) — [Duffel pricing](https://duffel.com/pricing)
- **Industry context:** across NDC aggregators, AltexSoft counted 95 NDC airlines: 71 (about 75%) full-service, 17 (about 18%) LCC, 7 hybrid/charter. It also notes that integrating a given aggregator "doesn't guarantee access to all carriers" — [AltexSoft, NDC aggregators](https://www.altexsoft.com/blog/ndc-aggregators/)
- **Travelfusion:** homepage claims "400+ Low Cost Carriers Worldwide". The tfFlight product page says "370+ LCCs & 42+ NDC airlines", and the XML API page says "412+ low cost and scheduled airlines". A trade article cites 400+ LCCs and 70+ NDC airlines. All are self-reported, and the pages conflict (retrieved 2026-11-12) — [Travelfusion corporate](https://corporate.travelfusion.com); [tfFlight API](https://corporate.travelfusion.com/products-services/tf-flight-api); [XML API](https://corporate.travelfusion.com/resources/xml-api)
- **Mystifly:** claims "500+ airlines" through Mystifly Marketplace, including NDC connections and "200+ low-cost carriers". Some third-party sources say 700+. Self-reported — [Mystifly](https://mystifly.com/?p=2071); [phptravels Mystifly guide (third party)](https://phptravels.com/blog/mystifly-api)
- **Verteil:** NDC-only aggregator. Its counts rise over time across pages: "35+", "over 40", "50+" on the homepage, and "more than 75 airlines" and "10,000+ agencies" in a later partner release. It is an IATA NDC Level 4 certified aggregator and was named launch NDC aggregator for Riyadh Air at ATM 2025 — [Verteil homepage](https://www.verteil.com); [Travel Terminus x Verteil](https://www.verteil.com/blog/travel-terminus-partners-with-verteil-to-deliver-rich-ndc-airline-content-to-travel-sellers-worldwide); [Verteil Level 4](https://www.verteil.com/blog/verteil-technologies-certifies-as-an-iata-level-4-ndc-aggregator); [Riyadh Air launch](https://www.verteil.com/blog/verteil-announced-as-launch-ndc-aggregator-partner-for-riyadh-air-at-atm-2025)
- **Kiwi.com Tequila:** at its 2018 launch it offered virtual interlining ("combine flights from more than 650 airlines"). That is a historical count, not current — [Travolution (eSky on Tequila)](https://travolution.com/articles/112042/polish-ota-esky-joins-kiwicoms-tequila-platform)
- **Priceline Partner Solutions:** a Travelpayouts page claims "flights from more than 200 airlines". Not confirmed from a primary source — [Travelpayouts, Priceline affiliate](https://travelpayouts.com/blog/the-priceline-affiliate-program/)
- **Travelport:** its JSON API can return "both or either GDS or NDC content" in one air search — [Travelport developer, Flights](https://developer.travelport.com/apis/flights)

### Inferences
- Duffel's 300+ figure most likely relies on GDS-sourced content (the Travelport deal) for most carriers, with about 30 direct/NDC connections. LCC depth on Duffel is probably narrower than Travelfusion's 400 LCC claim. Check Duffel's live airline list for the LCCs that matter to US travellers (Spirit, Frontier, Allegiant, Southwest, Ryanair, Wizz, IndiGo, AirAsia and others) before assuming coverage.
- "Every airline worldwide" is not achievable through any one API listed here. The most realistic widest-coverage stack for a startup is Duffel (GDS + NDC) plus Travelfusion or Mystifly for LCCs. The second also requires a commercial contract and dedupe logic.

### Gaps
- No primary, dated list of Duffel's current LCC carriers was retrieved. Whether Southwest, Spirit, Frontier and Ryanair are bookable on Duffel as of Nov 2026 is unverified.
- No published airline counts were found for Sabre or Travelport overall (they are full GDSs, so they cover most IATA network carriers, but that rests on general knowledge, not a source retrieved here).
- AERTiCKET, Travelgenix and Trip.com/Ctrip flight-API or affiliate coverage: searched, no usable results.

## 2. Booking model, merchant of record, ticketing, and IATA/ARC accreditation

### Takeaway
Duffel is the only candidate here confirmed to let a non-accredited startup sell and ticket flights under the provider's IATA accreditations ("Managed Content"). The GDSs (Sabre, Travelport, Amadeus Enterprise) generally require your own ARC/IATA accreditation, or a host agency or consolidator. Skyscanner is redirect/affiliate only, so you never take the booking.

### Cited Findings
- **Duffel:** under its services agreement, "Duffel can ticket, service and settle Orders on your behalf". Ticketing runs under Duffel's own or a partner's accreditation (retrieved 2026-11-12) — [Duffel services agreement](https://duffel.com/services-agreement)
- **Duffel Managed Content:** lets sellers without IATA or ARC accreditation start selling by using Duffel's accreditations and ticketing authority — [Duffel help, Do I need to be ARC/IATA](https://help.duffel.com/hc/en-gb/articles/360019644700-Do-I-need-to-be-an-ARC-IATA-travel-agent); [Duffel blog, accredited agency network](https://duffel.com/blog/benefits-of-using-duffel-content-services-duffels-accredited-agency-network)
- **Duffel Enterprise:** offers "the option to use your own IATA accreditation" with bespoke pricing (retrieved 2026-11-12) — [Duffel pricing](https://duffel.com/pricing)
- **Duffel, merchant of record:** Duffel's help center defines the merchant of record as "the company that collects payment from the customer" and whose name appears on the cardholder statement — [Duffel help, Duffel Payments](https://help.duffel.com/hc/en-gb/sections/4408837946898-Duffel-Payments)
- **Duffel Payments:** "currently only works with Managed Content", and card payments need approval from help@duffel.com before integration — [Duffel docs, collecting customer card payments](https://duffel.com/docs/guides/collecting-customer-card-payments)
- **General US rule:** issuing tickets directly requires IATA (global) or ARC (US) accreditation. Non-accredited agencies can work under a host agency or air consolidator that holds ticketing authority and financial responsibility. ARC VTC and IATA TIDS are non-ticketing identifiers (AltexSoft) — [AltexSoft, Sabre API integration](https://www.altexsoft.com/blog/sabre-api-integration)
- **Sabre:** API access is bound to a Pseudo City Code. The iPCC is "typically issued to OTAs for API-only use", and without the correct PCC in the token "you won't have access to your agency's specific subset of Sabre APIs" — [Sabre Dev Studio FAQ](https://developer.sabre.com/guides/travel-agency/faqs); [Sabre getting started](https://developer.sabre.com/resources/getting_started_in_travel/)
- **ARC and Sabre:** have partnered on agency NDC transition (ARC article) — [ARC](https://www2.arccorp.com/articles-trends/the-latest/arc-and-sabre-partnering-to-streamline-the-agency-ndc-transition)
- **Kiwi.com Tequila:** historically offered white-label booking where Kiwi.com fulfils (2018 launch) — [Travolution 2018](https://travolution.com/articles/109495/phocuswright-2018-kiwi-com-offers-partners-a-shot-of-tequila-with-new-white-label-offering)
- **Skyscanner Travel API:** partner-only flights search (Flights Live Prices, Indicative Prices), so it is metasearch with redirect to the booking partner. Skyscanner's help center has a page on whether the API can be used for direct bookings and whether sessions can be cached, but its answer was not captured — [Skyscanner Partner Support](https://skyscannerpartnersupport.zendesk.com/hc/en-us/articles/4687312848797-Which-services-can-I-access-and-what-are-the-rate-limits)
- **Mystifly:** a single API covers search, pricing, booking, ticketing, ancillaries and post-booking actions (void, reissue, refund). Ticketing is done by Mystifly as consolidator (third-party description) — [phptravels Mystifly integration guide](https://phptravels.com/blog/mystifly-api-integration-guide)

### Inferences
- Under Duffel Managed Content with Duffel Payments, Duffel (or a Duffel entity) is likely the merchant of record for the fare, with the startup's markup collected through the same flow. Who is MoR for the markup portion should be confirmed in the contract, because it affects chargeback liability and US seller-of-travel registration.
- Consolidators like Mystifly and Travelfusion typically ticket under their own accreditation, so a startup may not need ARC. This is unconfirmed for each provider and must be asked in sales calls.

### Gaps
- Duffel's exact MoR wording for Managed Content plus Duffel Payments: the key help article (help.duffel.com "What is Managed Content") returned HTTP 403 to automated fetch.
- Whether Travelfusion requires the agency to hold IATA/ARC or to pay airlines with its own cards was not found.
- State seller-of-travel registration (California, Florida, Washington, Hawaii) is out of scope here but relevant to a US B2C OTA.

## 3. Pricing: per-booking, percentage, search fees, minimums, setup, look-to-book, markups, payment and ancillary fees

### Takeaway
Duffel publishes the only transparent price list: $3.00 per order, plus a Managed Content fee (1% of order value on the pricing page, though an older help article says 0.5%), $2.00 per paid ancillary, 1500:1 search-to-book with $0.005 per excess search, 2% FX, no upfront or monthly fees. Every other candidate is quote-based or negotiated.

### Cited Findings
- **Duffel pay-as-you-go (pricing page, retrieved 2026-11-12):**
  - $3.00 per confirmed order, charged monthly
  - Managed Content: 1% of total order value per confirmed order
  - $2.00 per paid ancillary
  - Search-to-book 1500:1, with excess searches at $0.005 each
  - FX: 2% on the exchange rate when conversion is needed
  - "No upfront fees"; Enterprise is bespoke, with volume discounts

  — [Duffel pricing](https://duffel.com/pricing)
- **Duffel help center:** says "the 0.5% Content fee won't apply where you are using your own agreements". This **conflicts** with the 1% on the current pricing page. The help text may be outdated, or the fee may have risen; flag it and confirm with Duffel — [Duffel help](https://help.duffel.com/hc/en-gb/articles/4409054162962)
- **Duffel Payments card fee:** "determined based on the card country… domestic or international, an example would be 2.9%". A separate margin guide mentions a "2% interchange fee" and recommends a 2% FX markup. The two figures are not reconciled in the sources — [Duffel docs, card payments](https://duffel.com/docs/guides/collecting-customer-card-payments); [Duffel docs, margin and markups](https://duffel.com/docs/guides/margin-and-markups)
- **Duffel markups:** sellers set their own margin or markup, with a dedicated guide — [Duffel docs, margin and markups](https://duffel.com/docs/guides/margin-and-markups)
- **Mystifly:** no public price list. Terms are "quote-based and tied to volume" (third-party guide), and the site offers "Request a Quote" — [phptravels Mystifly guide](https://phptravels.com/blog/mystifly-api)
- **Travelport:** pricing is negotiated. One third-party source reports "recurring annual API access fees ($5,000)" including standard support and certification for the first product. Unverified and undated — [supergood.ai Travelport API report card (third party)](https://supergood.ai/api-report-card/travelport)
- **Sabre:** the Bargain Finder Max shopping API "requires customers to sign a special amendment". No public pricing was found — [Sabre Dev Studio FAQ](https://developer.sabre.com/guides/travel-agency/faqs)
- **Skyscanner (affiliate/metasearch):** third parties say there is no per-call fee for approved API partners. Affiliate commission figures conflict across sources ("up to 20%", "20 to 50%" of Skyscanner's revenue share, CPC/CPS), and the program runs on Impact with a 30-day cookie — [Geekflare (third party)](https://geekflare.com/guides/flight-booking-api/); [Travelpayouts on Skyscanner](https://www.travelpayouts.com/blog/skyscanner-flight-affiliate-program/amp/); [affilimate](https://affilimate.com/programs/skyscanner-affiliate-program/)
- **Priceline:** affiliate flight commissions reported at about 3% (CPS). Secondhand — [Travelpayouts, Priceline affiliate](https://travelpayouts.com/blog/the-priceline-affiliate-program/)

### Inferences
- Worked Duffel example at the 1% rate: a $400 USD Managed Content ticket costs $3 + $4 = $7, plus $2 per paid bag or seat, plus card processing (around 2.9% on Duffel Payments, so about $11.60), which totals roughly $18.60 before markup. At 0.5% it would be about $16.60. Rough estimate from the published rates above, not a quote.
- The 1500:1 search-to-book limit is generous for a startup with a low conversion rate, but metasearch-driven traffic (many searches, few bookings) can exceed it. 100,000 excess searches would cost $500.

### Gaps
- No published pricing for Amadeus Enterprise, Sabre, Travelport, Travelfusion, Verteil, Mystifly, Kiwi, Expedia or Priceline flights.
- No information found on deposits, bank guarantees or credit lines for consolidators (typical for Mystifly/Travelfusion-type relationships, but unsourced here).

## 4. Access: self-serve vs sales contract, approval criteria, traffic thresholds, deposits, test environments

### Takeaway
As of Nov 2026, Duffel is the only self-serve option on the list. Amadeus closed its self-service portal on 17 Jul 2026, Kiwi Tequila has been invitation-only since May 2024, and everyone else needs a sales contract, certification or partner approval.

### Cited Findings
- **Amadeus Self-Service:**
  - Amadeus confirmed in **Feb 2026** that it is decommissioning the self-service part of Amadeus for Developers, and new registrations were paused — [PhocusWire](https://www.phocuswire.com/amadeus-shut-down-self-service-apis-portal-developers)
  - The portal **shut down 17 Jul 2026**, and self-service keys stopped working. This date comes from a competing vendor's migration guide and matches the "July" shutdown reported by Skift — [Ignav migration guide (competitor)](https://ignav.com/docs/amadeus-self-service-shutdown); [Skift, 3 Sep 2026](https://skift.com/2026/09/03/amadeus-brings-travel-tech-into-claude/)
  - Amadeus's statement says "its Enterprise Portal and Enterprise APIs remain fully available". It references a 9 Feb 2026 media article and does not itself state a shutdown date — [Amadeus statement](https://amadeus.com/en/industry-messaging/statement-regarding-amadeus-for-developers-portal)
  - Skift (3 Sep 2026): Amadeus shifted to "request-based Enterprise APIs" and has not clarified access terms, pricing or whether enterprise contracts are required. Amadeus also announced work with Anthropic on AI-enabled developer access — [Skift](https://skift.com/2026/09/03/amadeus-brings-travel-tech-into-claude/); [PhocusWire](https://www.phocuswire.com/news/technology/amadeus-anthropic-claude-developers-travel-sellers)
- **Kiwi.com Tequila:** in May 2024 Kiwi.com said it continues with selected existing partners and "any new partnerships on the Tequila platform will be on an invitation only basis" — [Kiwi.com media](https://media.kiwi.com/articles-and-interviews/better-for-business-kiwi-com-takes-a-new-approach-to-partnerships/)
- **Duffel:** "no upfront fees", pay as you go. Card payments need approval from support before integration. Duffel offers a test mode (with "Duffel Airways" as the test airline); that detail comes from general knowledge of Duffel's docs and was not confirmed by a page retrieved today — [Duffel pricing](https://duffel.com/pricing); [Duffel docs](https://duffel.com/docs/guides/collecting-customer-card-payments)
- **Sabre:** the Dev Studio quickstart checklist and FAQ show credential provisioning tied to a PCC/iPCC, and some APIs need contract amendments — [Sabre quickstart checklist](https://developer.sabre.com/guides/travel-agency/quickstart/quick-start-checklist); [Sabre FAQ](https://developer.sabre.com/guides/travel-agency/faqs)
- **Travelport:** production requires provisioning, mandatory certification and "15 business days' notice", with credentials locked to a PCC Access Group (third-party summary) — [supergood.ai Travelport (third party)](https://supergood.ai/api-report-card/travelport)
- **Mystifly:** onboarding includes commercial approval, business and operational vetting, account setup, test credentials, then production credentials. Docs and sandbox come after onboarding (third-party guides) — [phptravels Mystifly guide](https://phptravels.com/blog/mystifly-api-integration-guide)
- **Verteil:** access through a certified-vendor or technology-partner program (onboarding at b2b.verteil.com/onboarding, unconfirmed) — [Verteil technology partner program](https://www.verteil.com/technology-partner-program)
- **Skyscanner:** application through the partner site. Geekflare says access is not given to sites with under 100K monthly active users (unverified, not on an official page). Rate limits: Live Prices create 100/min, poll 500/min; Indicative 500/min — [Skyscanner Partner Support](https://skyscannerpartnersupport.zendesk.com/hc/en-us/articles/4687312848797-Which-services-can-I-access-and-what-are-the-rate-limits); [Geekflare](https://geekflare.com/guides/flight-booking-api/)
- **Expedia (EPS Rapid):** public Rapid docs are lodging-first. Third parties say car and flight APIs are "still rolling out" and that access requires application, approval and certification with no self-serve signup — [supergood.ai Expedia (third party)](https://supergood.ai/api-report-card/expedia); [Ignav Expedia flights (competitor)](https://ignav.com/docs/expedia-flights-api); [Expedia Rapid changelog](https://developers.expediagroup.com/rapid/setup/changelog)
- **Priceline Partner Solutions:** partner-gated REST/JSON APIs covering hotels, flights, cars and packages. Approved companies receive a contract, docs and credentials — [Vervotech Priceline guide (third party)](https://www.vervotech.com/hub/guides/priceline-api-integration-guide/)

### Inferences
- Amadeus Self-Service is not a viable fallback for this project. Amadeus Enterprise is unlikely to onboard a pre-revenue startup without accreditation, though that is not confirmed.
- Travelfusion and Mystifly are the most plausible phase-2 LCC add-ons, but expect a sales cycle, contract and possibly a deposit or credit arrangement.

### Gaps
- No primary statement of Skyscanner's traffic threshold.
- No data on Travelfusion onboarding criteria or test environment (xmldocs.travelfusion.com exists but was not read).
- Whether Expedia or Priceline offer a bookable flights API (as opposed to affiliate links) to small US OTAs in 2026 is unverified.

## 5. Features: ancillaries, changes, cancellations, refunds, documents

### Takeaway
Duffel's API documents seats, bags at booking and after booking, order changes (request, offers, confirm), cancellations with refund quotes, and refunds to airline credits. Mystifly reportedly covers void, reissue and refund through its API. GDS and NDC aggregators support these, but depth varies by airline.

### Cited Findings
- **Duffel:** the reference covers offer requests, offers, orders, seat maps, order changes, order cancellations, payments and webhooks. Seat maps return cabin layout and priced seat services — [Duffel docs](https://docs.duffel.com)
- **Duffel order changes:** you create an order change request, review the change offers, create a pending change, then confirm it. Changes can be blocked, for example by `order_not_changeable_yet` — [Duffel Order Changes](https://duffel.com/docs/api/order-changes); [Order Change Requests](https://duffel.com/docs/api/order-change-requests); [Duffel errors](https://duffel.com/docs/api/overview/errors)
- **Duffel cancellations:** you get a refund quote, then confirm. Refunds to airline credits are supported (changelog) — [Duffel, cancelling an order](https://www.duffel.com/docs/guides/cancelling-an-order); [Duffel changelog, refunds to airline credits](https://changelog.duffel.com/announcements/refunds-to-airline-credits)
- **Duffel bags:** extra bags can be added at booking and after booking. Adding services after booking is not supported on hold orders — [Duffel Orders API](https://duffel.com:443/docs/api/orders)
- **Duffel blog:** "manage flight changes in minutes with new order management features" — [Duffel blog](https://duffel.com/blog/manage-flight-changes-in-minutes-with-new-order-management-features)
- **Mystifly:** search, pricing, booking, ticketing, ancillaries and post-booking void, reissue and refund through one connection (third party) — [phptravels Mystifly guide](https://phptravels.com/blog/mystifly-api-integration-guide)
- **Verteil/Mystifly NDC:** NDC content adds ancillaries, seat maps and branded fares — [phptravels Mystifly](https://phptravels.com/blog/mystifly-api)

### Inferences
- Availability of change, cancel and ancillary features on Duffel depends on the airline and content source (NDC versus GDS-sourced), so the UI must handle "not available, contact support" states.

### Gaps
- E-ticket or itinerary document delivery for Duffel (who emails the customer, and whether ticket numbers come back in the order) was not confirmed in sources read today.
- No feature detail was found for Travelfusion LCC post-booking servicing.

## 6. Integration effort, docs and SDKs, fit for a small startup

### Takeaway
Duffel is the lowest-effort fit for a Next.js startup: a modern REST API with public docs, official SDKs, a changelog, published pricing and no accreditation needed. GDSs carry heavy certification and contracts. Aggregators carry sales-gated docs and SOAP/XML-style APIs.

### Cited Findings
- **Duffel:** public docs at docs.duffel.com, a public changelog (changelog.duffel.com), and an official Ruby gem (`duffel_api`). Duffel also publishes a JS/Node SDK and UI components, but that rests on general knowledge, not a page retrieved today — [Duffel docs](https://docs.duffel.com); [Duffel changelog](https://changelog.duffel.com/announcements/ann_8CEIcSSKj6jJm); [rubydoc duffel_api](https://www.rubydoc.info/gems/duffel_api/0.4.0/DuffelAPI/Services/OrderCancellationsService)
- **Travelfusion:** a "Direct Connect XML API" with public XML docs (xmldocs.travelfusion.com), so XML rather than JSON — [Travelfusion XML docs](https://xmldocs.travelfusion.com); [Travelfusion XML API](https://corporate.travelfusion.com/resources/xml-api)
- **Travelport:** JSON "TripServices" Flights APIs with combined GDS and NDC search are documented on the developer portal — [Travelport developer, Flights](https://developer.travelport.com/apis/flights); [Air Availability](https://developer.travelport.com/apis/flights/searches/createairavailability)
- **Skyscanner:** the Live Prices API uses a /create then /poll flow and returns an "incomplete cached subset" first for speed — [Skyscanner Partner Support, Live Prices](https://skyscannerpartnersupport.zendesk.com/hc/en-us/sections/4524647783069-Travel-APIs-Flights-Live-Pricing-Service)
- **Mystifly:** the booking engine on your side must still handle payments, markups, vouchers, invoices and reports (third party) — [phptravels Mystifly guide](https://phptravels.com/blog/mystifly-api-integration-guide)

### Inferences
Fit ranking for this project as of Nov 2026, based on the findings above:
1. **Duffel (phase 1):** the right choice; it is the only self-serve candidate that can book and ticket without accreditation.
2. **Travelfusion or Mystifly:** phase-2 add-on to widen LCC coverage, once there is booking volume to justify a sales contract.
3. **Verteil:** only if specific NDC airlines are missing from Duffel.
4. **Skyscanner, Priceline, Expedia affiliate:** a non-booking fallback, or a traffic source to list the OTA on (Skyscanner metasearch), not a supply source.
5. **Sabre, Travelport, Amadeus Enterprise:** only after ARC accreditation and meaningful volume.

### Gaps
- No developer-community reports (Reddit, Hacker News) were gathered on practical Duffel, Mystifly or Travelfusion integration experience, because of the research budget.
- Trip.com/Ctrip affiliate flights, AERTiCKET and Travelgenix were not researched in depth (searches returned nothing usable).
- Changes in the last 90 days at Duffel (pricing or content) beyond the live pricing page were not checked against the changelog.
