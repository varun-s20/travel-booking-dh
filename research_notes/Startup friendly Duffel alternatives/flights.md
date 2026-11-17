# Startup-friendly alternatives to Duffel for selling and booking flights (new, non-accredited, global B2C startup)

Research date: 12 Nov 2026. "Retrieved 2026-11-12" means the page was read today and shows no date of its own. This file builds on `research_notes/Travel supply API comparison/flights.md`, which already covers Duffel, Amadeus Self-Service, Kiwi Tequila, Sabre, Travelport, Travelfusion, Mystifly, Verteil and Skyscanner. It only revisits those to challenge the earlier findings.

Source-quality warning: very little primary documentation is public for B2B flight consolidators. Many search results come from integrator or reseller sites (phptravels, adivaha, provab, travelopro, technoheaven, up17), which sell connectors to these suppliers and have a commercial interest. They are flagged "(third party, integrator)" wherever they are used. Vendor claims about airline counts are self-reported and unaudited. The web-search tool returned summarised snippets, so a fact cited from a search result without a full page fetch is marked "(search snippet)".

Shortlist status at a glance (details and sources below):

| Option | What it is | Can a brand-new non-accredited startup get in? | Bookable via API for a B2C site? |
|---|---|---|---|
| Travelfusion | LCC + NDC aggregator, XML API | Sales questionnaire, then a signed licence agreement. A TFPay deposit account option starts at EUR/GBP 5,000 | Yes (XML) |
| Mystifly | Consolidator, 500+ airlines claimed | KYC sign-up per third-party sources; commercial approval | Yes |
| PKFARE | Asia-based B2B air marketplace, 600+ airlines claimed | "Buyer Sign Up" link; criteria not public | Yes (API + B2B portal) |
| TBO (TBO Air) | India-based B2B wholesaler | Registration with KYC; IATA or non-IATA status asked; certification | Yes |
| AERTiCKET (Cockpit API) | German consolidator | Marketing says IATA and non-IATA agencies; contract needed | Yes (no public docs) |
| AirGateway | NDC/LCC aggregator, published pricing | Signup form asks for an IATA number; likely needs your own accreditation | Yes, but probably not for a non-IATA seller |
| Hahnair Distriply One | NDC booking tool for non-accredited sellers | Yes, online registration, "no upfront investment" | No evidence of an API; agent-facing tool |
| Hahn Air HR-169 | Ticketing on Hahn Air's document via a GDS | Via a GDS seat, which itself needs a contract | Indirect only |
| Hopper HTS | White-label travel tech for big brands | Signed commercial partnerships only | Partner-gated |
| Trip.com | OTA with affiliate and partner programs | Affiliate yes; API partner application-gated | Affiliate redirect; API unverified |
| Travelpayouts White Label | Flight metasearch white label | Self-serve, free, no pre-moderation | No, redirects to booking partners |
| Mondee | US consolidator / platform | Went bankrupt Jan 2025; assets sold to lenders and renamed Tabhi | Unclear, avoid until verified |
| Travelopro, Trawex, FlightsLogic | Booking-engine software vendors | You buy software; they plug in other suppliers | They need a supplier underneath |

## 1. Which options can a brand-new startup actually use, and does the earlier view of Mystifly and Travelfusion hold?

### Takeaway
No new self-serve, fully transparent "Duffel clone" turned up. The realistic non-Duffel routes for a non-accredited startup are B2B consolidators that ticket under their own accreditation: Mystifly, PKFARE, TBO, AERTiCKET and Travelfusion. All are sales-led with KYC or a contract, and none publishes prices. Travelfusion's own pages confirm a questionnaire, a signed licence agreement and fees, but say nothing about accreditation or startup eligibility. The claim that Mystifly onboards via self-sign-up plus KYC comes only from third-party integrator sites. Whether either will onboard a pre-revenue startup is unverified and has to be asked in a sales call.

### Cited Findings
- **Travelfusion, onboarding:** its customer registration page is a questionnaire: "To help us learn about you and your product requirements, please complete this questionnaire. The form will be sent to our sales staff for immediate review." It does not mention IATA, company documents, volume thresholds or deposits (retrieved 2026-11-12) — [Travelfusion, Become a Customer](https://corporate.travelfusion.com/resources/register-customer-supplier)
- **Travelfusion, contract and fees:** API docs say integration starts after signing the commercial agreement, and that API use "is subject to fees as set out in our license agreement" which "you are required to sign prior to using the XML API". The XML docs pages returned a login screen to automated fetch, so this is a search snippet — [Travelfusion getting started guide](https://xmldocs.travelfusion.com/travelfusion-direct-connect-xml-api/getting-started-guide)
- **Travelfusion, deposit:** for the TFPay deposit account option, Travelfusion requires "an initial deposit of EUR/GBP 5,000.00 to cover the initial batch of bookings". Search snippet only; the page itself is login-gated, so whether this applies to every customer or only TFPay users is unverified — [Travelfusion TFPay deposit](https://xmldocs.travelfusion.com/travelfusion-direct-connect-xml-api/guidelines/tfpay-payment-travel-innovation-settlement/tfpay-deposit)
- **Mystifly, onboarding:** a vendor-affiliated site says agencies can sign up on the Mystifly website, complete KYC verification, and get access to MyFareBox (web portal) or API credentials (third party, integrator, search snippet). An earlier third-party guide describes commercial approval, business vetting, test credentials and then production credentials — [up17 Mystifly page (third party)](https://up17.in/page/mystifly-api); [phptravels Mystifly guide (third party)](https://phptravels.com/blog/mystifly-api-integration-guide)
- **Mystifly, servicing:** launched an API for "guaranteed & automated Voids, Refunds and Cancellation" in Nov 2019 — [Wikipedia, Mystifly](https://en.wikipedia.org/wiki/Mystifly)
- **PKFARE:** describes itself as a B2B marketplace with a "PKFARE API" and "PKFARE B2B Portal", with separate Buyer and Supplier sign-up links but no stated eligibility (retrieved 2026-11-12; copyright 2014–2026) — [PKFARE homepage](https://www.pkfare.com/)
- **PKFARE, access:** an integrator says "PKFARE decides who gets access", that requirements and commercial terms are negotiated directly with PKFARE, and that approved partners receive a partner ID and API key (third party, integrator) — [phptravels PKFARE integration (third party)](https://phptravels.com/pkfare-api-integration)
- **TBO, registration:** a third-party integrator says you register as a TBO API partner via tbo.com, and the application asks for agency registration, IATA or non-IATA status, and basic KYC (third party, search snippet) — [adivaha TBO integration (third party)](https://www.adivaha.com/tbo-integration.html); [TBO API page](https://www.tbo.com/tbo-api)
- **TBO Air, certification:** TBO's own developer docs say test cases are verified by the TBO Air API team in about 4–5 working days, then live access is given after a Production Process form. If your commercial agreement isn't signed yet but you start integrating, notify apisupport@tboair.com (search snippet) — [TBO Air API certification](https://dealint.tboair.com/APIDocument/Certification.aspx); [TBO Air API guide](https://dealint.tboair.com/APIDocument/APIGuide.aspx)
- **AERTiCKET:** a Berlin consolidator whose Cockpit B2B solution is marketed to "all travel agencies, whether IATA or non-IATA". The Cockpit API gives travel portals access to its flight and rail fare content. An integrator says contract, fares and issuance terms are agreed directly with AERTiCKET (search snippets; vendor and third-party claims) — [TourMaG on AERTICKET](https://www.tourmag.com/AERTICKET-simplifie-l-activite-des-professionnels-du-tourisme_a121599.html); [phptravels AERTiCKET integration (third party)](https://phptravels.com/de/integrations/aerticket-api-integration)
- **AirGateway:** the "Get Started / Join now" path is a contact form that asks for an IATA number, and plans are described per "IATA Number" and "IATA/PCC" (retrieved 2026-11-12) — [AirGateway pricing](https://airgateway.com/pricing)
- **Hahnair Distriply One:** an NDC booking tool "designed specifically for the needs of independent and non-accredited travel sellers". The US launch release says it removes the need for "complex system integrations, individual airline contracts, or IATA/ARC accreditation", with "easy onboarding with no upfront investment" and online registration at distriply.com/registration. It launched in the US on 1 Oct 2025 and expanded to further European markets in Feb and Mar 2026 (vendor press releases) — [Hahnair US launch, 1 Oct 2025](https://www.hahnair.com/en/press-release/8418/2025-10-01/hahnairs-new-ndc-booking-platform-distriply-one-is-live-and-ready-for-travel-consultants-in-the-us); [Hahnair, 4 more European markets, 11 Feb 2026](https://www.hahnair.com/en/press-release/8425/2026-02-11/hahnair-launches-distriply-one-in-4-additional-european-markets); [Hahnair, Ireland/Belgium/Luxembourg, 11 Mar 2026](https://www.hahnair.com/ko/press-release/8430/2026-03-11/hahnair-launches-distriply-one-in-irland-belgium-and-luxembourg)
- **Hahn Air HR-169:** described as covering "sales in markets where the airline is not participating in the BSP/ARC". It gives access to agencies that "typically do not have ticketing authority from an airline". The page is aimed at airlines, offers an agent "Register for free" link (agentregistration.hahnair.com) without stated criteria, and does not describe an API (retrieved 2026-11-12) — [Hahnair global sales and ticketing](https://www.hahnair.com/en/global-sales-ticketing)
- **Hahnair, scale:** an IATA member that says it works with 350+ partner airlines and 100,000+ travel agencies (vendor claim, search snippet) — [Hahnair about](https://hahnair.com/en/about-hahn-air)
- **Hopper Technology Solutions (HTS):** Supergood reports no public developer portal or sandbox; integrations are signed commercial partnerships (third party). A Hopper job listing names Air Canada, Uber, CommBank, Nubank and Flair Airlines as HTS partners and says HTS is over 75% of Hopper's business (search snippet) — [supergood.ai Hopper (third party)](https://supergood.ai/api-report-card/hopper); [Built In, Hopper job listing](https://builtin.com/job/senior-product-manager-flight-connectivity/9088467)
- **Trip.com:** one third-party page says Trip.com runs a partner API program for high-volume distributors, "application-gated and not publicly self-serve" (unverified). The Trip.com Group flights partner page fetched today shows no program details (retrieved 2026-11-12) — [API Evangelist, Trip.com (third party)](https://providers.apievangelist.com/providers/tripcom/); [Trip.com Group partners, flights](https://group.trip.com/partners/industries/flights)
- **Travelpayouts White Label:** a Travelpayouts blog says a white label "can be created in 10 minutes for free, without pre-moderation" (search snippet). It is a flight-search white label — [Travelpayouts RU blog, White Label](https://www.travelpayouts.com/ru/blog/white-label-travelpayouts/); [Travelpayouts support, White Label Web](https://support.travelpayouts.com/hc/en-us/articles/203955753)
- **Mondee:** filed Chapter 11 in Jan 2025 with plans to sell its assets. The court approved a $191M sale to Mondee Purchaser, LLC (its lenders) in March 2025, and the business was renamed Tabhi under TCW, Morgan Stanley Investment Management and co-founder Prasad Gundumogula. The debtors then sought a Chapter 7 conversion — [Skift, 15 Jan 2025](https://skift.com/2025/01/15/booking-platform-mondee-files-for-bankruptcy); [PhocusWire, Mondee acquired, renamed Tabhi](https://www.phocuswire.com/mondee-acquired-chapter-11-restructuring-tabhi); [Law360, sale approved](https://law360.com/bankruptcy-authority/articles/2316835); [chapter11cases.com](https://chapter11cases.com/blogs/news/mondee-holdings-seeks-chapter-7-conversion-after-securing-buyer-for-assets)
- **General non-IATA routes:** AltexSoft (22 Oct 2020) lists three routes. (1) Consolidators: "For a fee, consolidators will act as ticketing partners for non-IATA agents"; some large ones offer ticketing APIs, and refunds come only after the airline refunds the consolidator. (2) Host agencies: membership-based, and their air fares are often less attractive. (3) Booking LCCs directly or through an LCC aggregator — [AltexSoft, booking and ticketing for non-IATA agencies](https://altexsoft.com/blog/booking-ticketing-non-iata-travel-agencies)
- **IATA accreditation, by comparison:** AltexSoft says IATA/BSP accreditation can cost "tens of thousands of dollars" — [AltexSoft](https://altexsoft.com/blog/booking-ticketing-non-iata-travel-agencies)

### Inferences
- **Challenge to the earlier note:** the earlier file called Mystifly and Travelfusion "phase-2 add-ons". For Travelfusion, that still looks right. The visible steps (sales questionnaire, signed licence with fees, a EUR/GBP 5,000 deposit if you use TFPay) point to a contract relationship rather than startup-friendly self-serve. Nothing found says Travelfusion refuses startups, though. Mystifly looks somewhat more accessible: KYC sign-up and the MyFareBox portal are designed for small agencies. But that rests on integrator sources only.
- **Hahnair Distriply One** is the only offering found that explicitly targets non-accredited sellers with no upfront cost. It reads as an agent-facing booking tool, not an API for a B2C website, so it could serve a back-office or offline sales desk but not automated checkout. Treat it as non-viable for the website until Hahnair confirms API access.
- **AirGateway** publishes real prices but appears to expect an IATA number, so it is likely not usable by a non-accredited startup unless it ticketed through a partner. That is unconfirmed.
- **Mondee/Tabhi** should be treated as high-risk because of its 2025 bankruptcy and ownership change.

### Gaps
- **Tripjack:** no onboarding information was found.
- **Flyline:** no results were found for a Flyline flight API.
- **Not researched (time budget):** Wego (a metasearch, so likely affiliate-only), Travelgenix, TravelNext, and any 2026 change to Kiwi Tequila's invitation-only status.
- **Trip.com Open API / B2B:** primary terms were not found.
- **Travelfusion:** whether it requires customers to hold IATA/ARC, and whether TFPay is optional or mandatory for non-accredited customers. The docs are behind a login.

## 2. Inventory: airlines, LCC, NDC, regions

### Takeaway
Self-reported counts are large and look similar: PKFARE 600+ (200+ LCC), Mystifly 500+ (200+ LCC, from the earlier note), Travelfusion about 400 LCCs, AirGateway 40+ NDC/LCC airlines. Regional strength differs: PKFARE and TBO are Asia/India-rooted, AERTiCKET is Europe/BSP-rooted, Travelfusion is the European LCC specialist. None is independently audited.

### Cited Findings
- **PKFARE:** claims "600+ airlines contents sourced from 100+ points of sale", described as 400+ full-service carriers and 200+ LCCs. Its supply types include Global GDS, LCC, NDC and "China Contents" (retrieved 2026-11-12, vendor claim) — [PKFARE homepage](https://www.pkfare.com/)
- **PKFARE, partnerships:** has a partnership with Flybondi for LCC access in Latin America — [Travel Professional News](https://travelprofessionalnews.com/pkfare-and-flybondi-partner-to-boost-low-cost-travel-access-across-latin-america/amp/)
- **AirGateway:** the AirGateway API plan includes "40+ NDC and LCC airlines". Content from Ryanair, easyJet, Wizz Air, Volotea, Transavia and Jet2 comes via a third-party provider at an extra €0.85 per booking (retrieved 2026-11-12) — [AirGateway pricing](https://airgateway.com/pricing)
- **AERTiCKET:** says it has EUR 3.5bn in BSP volume a year, 7 million air tickets a year, and access to more than 100 IATA markets (vendor marketing, search snippet) — [TourMaG](https://www.tourmag.com/AERTICKET-simplifie-l-activite-des-professionnels-du-tourisme_a121599.html)
- **Hahnair Distriply One:** coverage is "a growing portfolio of airline partners", with no count or names given — [Hahnair US launch](https://www.hahnair.com/en/press-release/8418/2025-10-01/hahnairs-new-ndc-booking-platform-distriply-one-is-live-and-ready-for-travel-consultants-in-the-us)
- **Travelopro:** claims an international air consolidator marketplace with "airfare consolidation from 800+ airlines". Travelopro is a software vendor, so this is a marketing claim — [Travelopro, international air consolidators](https://www.travelopro.com/international-air-consolidators.php)
- **LCC aggregator (historical):** AltexSoft (2020) cites Pyton as an LCC aggregator with over 100 LCCs — [AltexSoft](https://altexsoft.com/blog/booking-ticketing-non-iata-travel-agencies)

### Inferences
- For a global B2C site, PKFARE (Asia plus China content) combined with one Europe-strong source (Travelfusion or AERTiCKET) would complement Duffel's coverage. Overlap and dedupe would be significant.

### Gaps
- **TBO Air and AERTiCKET:** no airline counts from primary sources.
- **US LCCs:** no source confirms Spirit, Frontier, Allegiant or Southwest coverage for any of these providers.

## 3. Who tickets, who is merchant of record, and how payment flows

### Takeaway
With consolidators (Mystifly, PKFARE, TBO, AERTiCKET), the consolidator issues the ticket under its own BSP/ARC accreditation, and the startup pays it from a prepaid wallet, deposit or credit line. The startup then charges the traveller itself, which makes the startup the merchant of record to the customer. This is the opposite of a Duffel Payments-style flow, so the startup carries card-processing, fraud and chargeback risk and needs its own payment gateway. Primary contract wording confirming this was not found for any single provider.

### Cited Findings
- **Consolidator model:** consolidators act "as ticketing partners for non-IATA agents" for a fee. Refunds typically come only after the consolidator receives the airline's refund — [AltexSoft](https://altexsoft.com/blog/booking-ticketing-non-iata-travel-agencies)
- **PKFARE, payment:** in an integrator's setup, agents book PKFARE fares "with their own markup and wallet balance", which implies prepaid wallet funding (third party, integrator) — [phptravels PKFARE (third party)](https://phptravels.com/pkfare-api-integration)
- **TBO, payment:** TBO's API set includes a wallet-balance check API, which implies prepaid or credit funding (third-party document upload, search snippet) — [Scribd, TBO Authentication/Search/WalletBalanceCheck API](https://www.scribd.com/document/712249084/AuthenticationAPI-SearchAPI-WalletBalanceCheckAPI)
- **Travelfusion, payment:** the TFPay deposit option requires EUR/GBP 5,000 upfront for the initial bookings (search snippet) — [Travelfusion TFPay deposit](https://xmldocs.travelfusion.com/travelfusion-direct-connect-xml-api/guidelines/tfpay-payment-travel-innovation-settlement/tfpay-deposit)
- **Mystifly, scope:** the booking engine must still handle payments, markups, vouchers and invoices on the seller's side (third party) — [phptravels Mystifly guide (third party)](https://phptravels.com/blog/mystifly-api-integration-guide)
- **Hahnair, servicing role:** Hahnair says it "acts solely as an intermediary", so travellers must go to the agency that sold the ticket for changes or refunds (search snippet) — [Hahnair global sales and ticketing](https://www.hahnair.com/en/global-sales-ticketing)
- **Travelpayouts White Label:** an affiliate model with a 30% revenue share. Travelpayouts' example is a $3 payout on a $100 ticket, based on a $10 brand reward (search snippet). The booking and payment happen on the partner brand's site — [Travelpayouts White Label blog](https://www.travelpayouts.com/blog/?p=25568); [phptravels on Travelpayouts White Label (third party)](https://phptravels.com/blog/travelpayouts-white-label-vs-travel-booking-software)

### Inferences
- **Cash and risk:** a consolidator route means the startup needs working capital for the wallet or deposit, plus its own PCI-compliant payment processor (for example Stripe or Adyen) and fraud screening. Airline-ticket merchants are high-risk for card processors, and that cost and approval risk does not exist with Duffel Payments. This is an industry inference and is not sourced here.
- **Licensing:** being merchant of record also triggers seller-of-travel obligations in some jurisdictions. That needs a separate check.

### Gaps
- **No primary MoR wording:** no primary contract wording on merchant of record was found for Mystifly, PKFARE, TBO, AERTiCKET or Travelfusion.
- **Wallet terms:** no minimum wallet or deposit amounts were found for Mystifly, PKFARE, TBO or AERTiCKET.

## 4. Pricing: setup fees, per-booking fees, deposits, markup rules

### Takeaway
AirGateway is the only alternative found with a public price list: €50–€100 a month plus €1 per issued booking, and a possible €2,500 implementation fee (the page contradicts itself on this). Every consolidator is quote-based. Their income usually comes from net fares plus markup or service fees rather than an explicit per-booking API fee, but no consolidator rate card was found.

### Cited Findings
- **AirGateway, monthly plans:**
  - Partner API €50/month (1 IATA number, 1 partner connection)
  - AirGateway API €100/month (direct integration, 40+ NDC/LCC airlines)
  - BookingPad €100–€900/month
- **AirGateway, per-booking and setup fees:**
  - €1 per issued booking, "removed for selected airlines"
  - +€0.85 per booking for Ryanair, easyJet, Wizz, Volotea, Transavia and Jet2 via a third party
  - The header says "No setup or implementation cost", but the API plan lists a "One-time Implementation fee 2500 EUR". **Conflicting on the same page** (retrieved 2026-11-12)

  — [AirGateway pricing](https://airgateway.com/pricing)
- **AirGateway, positioning:** its API page says the model "eliminates GDS surcharges, hidden fees, and long-term contracts" (vendor claim) — [AirGateway API](https://airgateway.com/products/airgateway-api)
- **Travelfusion:** fees are "as set out in our license agreement" and not published. The TFPay deposit is EUR/GBP 5,000 (search snippets) — [Travelfusion getting started](https://xmldocs.travelfusion.com/travelfusion-direct-connect-xml-api/getting-started-guide); [TFPay deposit](https://xmldocs.travelfusion.com/travelfusion-direct-connect-xml-api/guidelines/tfpay-payment-travel-innovation-settlement/tfpay-deposit)
- **PKFARE:** requirements and commercial terms are negotiated directly; no public pricing (third party) — [phptravels PKFARE (third party)](https://phptravels.com/pkfare-api-integration)
- **Consolidators generally:** they charge a fee and mark up fares, with no figures given (2020) — [AltexSoft](https://altexsoft.com/blog/booking-ticketing-non-iata-travel-agencies)
- **Hahnair Distriply One:** "no upfront investment", with no fee amounts stated — [Hahnair US launch](https://www.hahnair.com/en/press-release/8418/2025-10-01/hahnairs-new-ndc-booking-platform-distriply-one-is-live-and-ready-for-travel-consultants-in-the-us)
- **Travelpayouts White Label:** free to set up, 30% revenue share of the brand's reward (search snippets) — [Travelpayouts RU blog](https://www.travelpayouts.com/ru/blog/white-label-travelpayouts/); [Travelpayouts White Label blog](https://www.travelpayouts.com/blog/?p=25568)
- **Trip.com affiliate commissions:** flight commissions are reported at 1–3% by one guide, while Travelpayouts lists Trip.com payouts "up to 5%". **Sources conflict**; cookie windows are 30 days web and 7 days app on Awin (search snippets) — [Travelpayouts Trip.com offer](https://www.travelpayouts.com/en/offers/trip-com-affiliate-program); [Awin Trip.com profile](https://ui.awin.com/merchant-profile/22405)

### Inferences
- **Cheapest entry:** Travelpayouts or Trip.com affiliate costs nothing but earns only a few dollars per ticket and gives no booking control.
- **Cheapest bookable non-Duffel API:** AirGateway's €100/month plus €1 per booking, if it accepts a non-IATA seller (doubtful).
- **Consolidators:** expect a deposit or wallet as the main upfront cost.

### Gaps
- No published rate cards for Mystifly, PKFARE, TBO, AERTiCKET, Hopper HTS or Trip.com B2B.

## 5. Booking model (API vs white label vs affiliate) and integration effort

### Takeaway
There are three tiers.
- **Bookable APIs** (Travelfusion XML, Mystifly, PKFARE, TBO, AERTiCKET Cockpit, AirGateway): the startup owns checkout, payments and servicing. Integration means contract, certification, then build, and is weeks of work.
- **Agent tools** (Hahnair Distriply One, Mystifly MyFareBox, PKFARE B2B portal): usable manually, but no website automation.
- **Redirect or affiliate** (Travelpayouts White Label, Trip.com affiliate, Skyscanner): fast and free, but the startup never takes the booking.

Software vendors such as Travelopro, Trawex and FlightsLogic sell booking engines and still need one of the suppliers above underneath.

### Cited Findings
- **TBO Air:** certification with test cases verified in about 4–5 working days before live access (search snippet) — [TBO Air certification](https://dealint.tboair.com/APIDocument/Certification.aspx)
- **Travelfusion:** a Direct Connect XML API (XML rather than JSON); integration starts after signing the agreement — [Travelfusion getting started](https://xmldocs.travelfusion.com/travelfusion-direct-connect-xml-api/getting-started-guide)
- **AERTiCKET:** no public API docs found. An integrator builds the connector "as a custom integration once you have an agreement with AERTiCKET and API access" (third party) — [phptravels AERTiCKET (third party)](https://phptravels.com/de/integrations/aerticket-api-integration)
- **Hahnair Distriply One:** described as "a modern airline retailing tool"; no API is mentioned — [Hahnair US launch](https://www.hahnair.com/en/press-release/8418/2025-10-01/hahnairs-new-ndc-booking-platform-distriply-one-is-live-and-ready-for-travel-consultants-in-the-us)
- **Travelpayouts White Label:**
  - Needs a CNAME record on your domain pointing to whitelabel.travelpayouts.com
  - "Closed from search engine crawlers (except the main page)"
  - A July 2026 third-party post says the product centres on flight search and advises against treating it as a complete agency platform

  (search snippets) — [Travelpayouts support, White Label Web](https://support.travelpayouts.com/hc/en-us/articles/203955753); [phptravels (third party)](https://phptravels.com/blog/travelpayouts-white-label-vs-travel-booking-software)
- **Trip.com, unofficial access:** scraped Trip.com flight endpoints exist on marketplaces such as Parse.bot. These are unauthorised and carry compliance risk (search snippet) — [Parse.bot hk.trip.com API](https://parse.bot/marketplace/3029f012-6ddd-4457-b0d2-418adcfcccf1/hk-trip-com-api)
- **Travelopro, Trawex, FlightsLogic:**
  - Trawex markets a "flight booking engine with GDS/XML/API integrations"
  - Travelopro says it "can also create an API / XML service for you if you are a Consolidator"

  These are technology vendors; no evidence was found that they hold accreditation or issue tickets themselves — [Trawex flight management software](https://trawex.com/flight-management-software.php); [Travelopro consolidators](https://www.travelopro.com/international-air-consolidators.php)

### Inferences
- **If the site must take bookings itself without Duffel**, the shortest path is probably Mystifly or PKFARE (KYC sign-up, JSON-era APIs per integrators) rather than Travelfusion (XML plus licence) or AERTiCKET (no public docs). That is unconfirmed until sandbox access is granted.
- **Avoid building on scraped Trip.com endpoints.**
- **Travelpayouts White Label's crawler block** means it adds no SEO value to the startup's domain.

### Gaps
- **Formats and SDKs:** API format (REST/JSON vs SOAP/XML) and SDK availability were not confirmed from primary docs for Mystifly, PKFARE or AERTiCKET.

## 6. Reputation and real user reports

### Takeaway
Independent user reports are almost absent. No Reddit or forum threads about Mystifly, PKFARE, TBO or AERTiCKET API onboarding came up, and Mystifly's G2 page shows no reviews. Most "reviews" online are written by integrators who sell connectors. The one hard reputational signal found is Mondee's 2025 bankruptcy.

### Cited Findings
- **Mystifly:** the G2 seller page shows a zero-star rating and no visible reviews (search snippet) — [G2 Mystifly](https://www.g2.com/sellers/mystifly)
- **Mondee:** Chapter 11 in Jan 2025, asset sale approved Mar 2025, renamed Tabhi — [Skift](https://skift.com/2025/01/15/booking-platform-mondee-files-for-bankruptcy); [PhocusWire](https://www.phocuswire.com/mondee-acquired-chapter-11-restructuring-tabhi)
- **AirGateway:** named a PhocusWire Hot 25 startup in 2020, and Trevolution Group integrated its API (vendor news) — [PhocusWire Hot 25 2020](https://www.phocuswire.com/Airgateway-hot-25-startups-2020); [AirGateway, Trevolution](https://airgateway.com/articles/trevolution-group-integrates-airgateway-api-to-increase-its-presence-on-the-market-through-ndc)
- **PKFARE, partnerships:** AirAsia MOVE and Wano (packages) and Flybondi (LCC content) — [TravelMole](https://www.travelmole.com/news/pkfare-partners-wano-airasia-move-packages/); [Travel Professional News](https://travelprofessionalnews.com/pkfare-and-flybondi-partner-to-boost-low-cost-travel-access-across-latin-america/amp/)
- **Hopper HTS:** Travelport renewed a multi-year content agreement with Hopper in 2022, and Sabre calls itself a strategic Hopper technology partner — [Travelport press release](https://www.travelport.com/press-releases/travelport-and-hopper-expand-strategic-relationship-with-travelport-upgrade-and-hopper-cloud-collaboration); [Sabre](https://sabre.com/?p=31073)

### Inferences
- Before signing with any consolidator, ask for references from small agencies and run a trial booking in sandbox. Public signal is too thin to judge support quality or approval speed.

### Gaps
- No developer-community reports (Reddit, Hacker News, Stack Overflow) were found for any of these providers in this pass.
- No financial-health information was gathered for Mystifly, PKFARE, TBO or AERTiCKET (TBO is listed in India, but that was not checked here).
