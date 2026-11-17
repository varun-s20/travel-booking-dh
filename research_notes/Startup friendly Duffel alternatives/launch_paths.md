# Launch paths for a new global B2C OTA: startup-friendly alternatives and complements to Duffel

Research date: 2026-11-12. "Accessed 2026-11-12" means no publish date was visible and the page was read or found in search on that date. **[Vendor claim]** marks statements that come only from the provider's own marketing. **[Unverified]** marks anything from anonymous reviews, integrator blogs or a single secondary source. This file does not repeat what is already in `../Travel supply API comparison/all_in_one_and_legal.md`. That file covers Duffel's scope, Expedia Rapid/TAAP, Booking Demand API, PPN, Hotelbeds, Trip.com affiliate rates on Awin, TBO basics, GDS access, MoR theory, and US/UK licensing. Read the two files together.

Research was capped at about 18 tool calls. Most supplier commercial terms are not public, and the evidence for many questions below is thin. The Gaps sections say so.

## Q1. Which routes let a startup take real bookings on its own site from day one?

### Takeaway
Few routes let a brand-new, unaccredited company take a real, paid booking on its own site within days.
- **Air:** essentially only Duffel-style self-serve APIs. Amadeus Self-Service, the other common self-serve route, was shut down on 2026-07-17.
- **Hotels:** a small set of self-serve hotel APIs, chiefly LiteAPI/Nuitée.

Every other route is one of three things:
- **Redirect, not booking:** Travelpayouts White Label, most affiliate programmes.
- **Gated by sales or volume:** Expedia White Label Template and Rapid, Booking Demand, Kiwi Tequila, HTS (Hopper), Mystifly.
- **Software that still needs supplier contracts:** Travelopro, Trawex, Travelomatix and similar. Those vendors can broker the contracts, but the startup then depends on the vendor.

### Cited findings

**Self-serve, real bookings on own site (days)**
- **LiteAPI (Nuitée), hotels.** The FAQ describes no approval step. To go live you add "a valid credit card under Payment Methods to unlock your production API key." The FAQ says "Core booking and management endpoints are free. Some premium features and endpoints are billed separately." Supported payment flows are "User Payment (Nuitee SDK), Account Credit Card, Credit Line" (accessed 2026-11-12). — [Nuitée docs FAQ](https://docs.nuitee.com/docs/faq)
- LiteAPI says teams can go from "zero to live hotel search and booking in hours, not weeks" **[Vendor claim]** (accessed 2026-11-12). — [Nuitée: liteAPI Build](https://nuitee.com/connect/liteapi-build)
- A third-party FinOps profile says LiteAPI earns through commission or markup rather than per-call billing **[Unverified secondary]** (accessed 2026-11-12). — [apis.io Nuitée FinOps profile](https://apis.io/finops/nuitee/nuitee-finops/)
- Skift covered Nuitée's API distribution model on 2025-09-09. — [Skift](https://skift.com/2025/09/09/nuitee-travel-api-connectivity/)
- **Duffel Managed Content, air (baseline).** Duffel's help centre says Managed Content "allows those without an IATA or ARC accreditation to start selling flights fast by using Duffel's established ticketing authority" (accessed 2026-11-12). — [Duffel Help: What is Managed Content](https://help.duffel.com/hc/en-gb/articles/9066583986706-What-is-Managed-Content)

**Self-serve route that has closed**
- **Amadeus Self-Service APIs.**
  - Amadeus confirmed in February 2026 that it would decommission the self-service portal. API keys were disabled and the portal closed on 2026-07-17. The Enterprise portal is unaffected. — [PhocusWire](https://www.phocuswire.com/amadeus-shut-down-self-service-apis-portal-developers); [Amadeus statement](https://amadeus.com/en/industry-messaging/statement-regarding-amadeus-for-developers-portal); [Ignav migration guide (vendor)](https://ignav.com/docs/amadeus-self-service-shutdown)
  - Skift reported on 2026-09-03 that Amadeus has moved to request-based Enterprise APIs. It had not clarified access terms, pricing, or whether enterprise contracts are required. — [Skift](https://skift.com/2026/09/03/amadeus-brings-travel-tech-into-claude/)
  - Many 2025–2026 "start with Duffel or Amadeus" guides, including Tripgic as cited in the earlier file, are therefore out of date on Amadeus.

**Redirect only (no booking on own site)**
- **Travelpayouts White Label Web.**
  - Travelpayouts' FAQ says "The White Label website acts as a mediator, redirecting users to platforms where the ticket purchase takes place" and "Your White Label website does not issue airline tickets." Users "should contact the partner (agency or airline) the booking was made through" for changes or refunds.
  - Commission is "1 - 7%". The same page also says "Earn 50% of the commission," which is unexplained and conflicting.
  - Price is "Request Price". The owner needs their own domain and hosting. Partner agencies are preselected per market and cannot be chosen manually.
  - Coverage claims are "1,000+ airlines and OTAs in search results" and "250k hotels" **[Vendor claim]** (accessed 2026-11-12). — [Travelpayouts White Label for travel agencies](https://special.travelpayouts.com/wltravelagency); [Travelpayouts White Label promo](https://travelpayouts.com/promo/whitelabel/en)
- **Kiwi.com Tequila.** Closed to public self-service registration in 2024 and now partnership-only with volume requirements **[secondary sources, vendor-of-alternative]** (accessed 2026-11-12). — [Ignav: Kiwi Tequila alternative](https://ignav.com/docs/kiwi-tequila-alternative); [Supergood report card: Kiwi](https://supergood.ai/api-report-card/kiwi)

**Gated by sales, volume or partnership**
- **Expedia White Label Template.**
  - Application is through a sales form: "the team will discuss your business needs and whether White Label Template is right for your business."
  - The showcased partners are airlines, hotel chains and financial brands (Riu, United MileagePlus, SoFi). No small-partner tier was found (accessed 2026-11-12). — [Expedia Group: White Label Template](https://partner.expediagroup.com/en-us/solutions/build-your-travel-experience/white-label-template); [Expedia Developer Hub: WLT getting started](https://developers.expediagroup.com/white-label-template/getting-started)
  - AltexSoft says Expedia does not publish enrollment terms and weighs revenue and growth potential, an existing solution, traffic and average bookings **[secondary]**. — [AltexSoft: Expedia Partner Solutions](https://www.altexsoft.com/blog/travel/expedia-partner-solutions/)
- **HTS (Hopper Technology Solutions).**
  - Its 2026 partners are large brands: Capital One Travel (news 2026-03-17), WestJet, Porter, Wizz Air, Lloyds, Serko (2026-10-27) and PerkSpot.
  - HTS markets "HTS Stays" as a white-label lodging marketplace and seat upgrades "via full white-label or API" **[Vendor claim]**.
  - No startup or self-serve tier was found (accessed 2026-11-12). — [HTS newsroom](https://hts.hopper.com/news); [HTS–Capital One 2026-03-17](https://hts.hopper.com/news/a-new-milestone-in-our-partnership-with-capital-one); [Hotel Dive press release 2026-10-27](https://www.hoteldive.com/press-release/20261027-hts-hopper-technology-solutions-and-serkoai-bring-flexibility-to-corpora/); [HTS summer 2026 update](https://hts.hopper.com/news/summer-2026-platform-update)
- **Mystifly.** No public price list. Terms are quote-based and tied to volume, and sandbox credentials come after onboarding **[integrator source]** (accessed 2026-11-12). — [PHPTRAVELS: Mystifly API](https://phptravels.com/blog/mystifly-api)
- **Mondee (TripPro).** Mondee's developer portal documents REST APIs to "search, book, cancel, re-price, and check status" on international flights, with IP-based access restriction. No published onboarding criteria were found for unaccredited or overseas agencies (accessed 2026-11-12). — [Mondee TripPro developer portal](https://developer.trippro.com)
- Mondee is a US consolidator that has historically served ethnic and home-based agencies (Skift, 2023). — [Skift 2023-08-15](https://skift.com/2023/08/15/mondee-buys-its-fourth-company-this-year)

**Ticketing via someone else's authority (consolidator / host / Hahn Air)**
- **Travelport (via a host or consolidator).** Travelport's onboarding guidance says "Non-IATA/ARC agencies can operate under the umbrella of a host agency or an air consolidator, which will hold the ultimate ticketing authority and financial responsibility. The non-accredited agency must provide full details of its partner during onboarding." It also needs incorporation documents and a tax ID. This was reported in search results as Travelport's guidance; the exact page was not opened (accessed 2026-11-12). — [AltexSoft: Travelport API integration](https://www.altexsoft.com/blog/travelport-api-integration/)
- **Hahn Air HR-169.**
  - HR-169 is Hahn Air's ticket document, letting agents issue tickets for 350+ partner airlines (counts vary by source).
  - Hahn Air's 2017 release says it is available to "IATA and non-IATA agents." Its terms say that where non-IATA sub-agencies are involved "the IATA agency is responsible."
  - Some fares are restricted from HR-169 issuance.
  - So a non-IATA startup reaches HR-169 through an IATA agency or consolidator, or through Hahn Air ticket offices in non-BSP markets, not directly (accessed 2026-11-12). — [Hahn Air: Global sales & ticketing](https://hahnair.com/en/global-sales-ticketing); [Hahn Air ticketing T&Cs](https://www.hahnair.com/terms-and-conditions-ticketing); [Hahn Air 2017 release](https://www.hahnair.com/en/press-release/7935/2017-04-13/hahn-air-makes-hr-169-tickets-available-to-travel-agents-in-cuba)
- Duffel's own blog says host agency and consolidator routes give access to their IATA or ARC accreditation, "however, the solutions aren't ideal for new travel startups" **[competitor's view]** (accessed 2026-11-12). — [Duffel blog: accessing airline booking capabilities](https://duffel.com/blog/how-to-take-flight-accessing-airline-booking-capabilities-to-sell-tickets)

**B2B aggregators / bedbanks with white label**
- **TBO.** TBO says it has "over 2000+ White Label / API partnerships" and that agents can include "all or just some" products in the white label **[Vendor claim]**. No price is published (accessed 2026-11-12). — [TBO Holidays white labels](https://tboholidays.com/whitelabels.htm); [Travel Boutique Online white label](https://www.travelboutiqueonline.com/Whitelabel_solutions.aspx)
- **Tripjack, TravelNext, Zentrumhub white-label pricing.** No public pages or pricing were found in this pass.

### Inferences
- **For a global B2C launch where bookings must happen on the client's own site from day one, the realistic options are:**
  - (a) Duffel alone.
  - (b) Duffel for air plus LiteAPI for a second hotel source.
  - (c) A white-label vendor that bundles a consolidator and bedbank (TBO, Travelopro and similar), at the cost of vendor dependence and diligence risk (see Q6).
- **Redirect products give "live" pages but not real bookings:** Travelpayouts White Label and Trip.com or Booking.com affiliate links. They are a valid zero-risk complement, for example cruises, or markets Duffel covers weakly, but they are not an OTA.
- **Amadeus Self-Service is gone (2026-07-17).** That removes the main self-serve rival to Duffel for air. Duffel's position as the default startup air API is stronger than in older guides.

### Gaps
- No primary page was found for TBO's onboarding criteria, deposit or credit terms for overseas startups, or for Tripjack white label.
- LiteAPI's pricing page was not opened, so the exact commission split and premium-endpoint fees are unknown.
- Whether Mondee onboards non-US, unaccredited online agencies is unknown.
- I found no evidence that Trip.com's B2B "Partner Solutions" API accepts startups (see the earlier file).

## Q2. What does each route cost (setup, monthly, per booking, deposits)?

### Takeaway
Almost nothing is published. Self-serve APIs (Duffel, LiteAPI) monetise through per-booking fees or markup sharing, with no setup fee. Affiliate and redirect routes cost nothing but pay only 1–7% commission. White-label OTA vendors are quote-only. The only figures found are third-party estimates: roughly $400–700/month for Travelopro tiers, and $5k–$150k for Travelomatix builds (both in the earlier file). Consolidator and bedbank routes usually involve deposits or prepaid credit, but no amounts were found.

### Cited findings
- **LiteAPI:** core booking endpoints free; premium endpoints billed separately; a card on file is needed to unlock production. No deposit is mentioned (accessed 2026-11-12). — [Nuitée docs FAQ](https://docs.nuitee.com/docs/faq)
- **Travelpayouts White Label:**
  - Price on request, plus your own domain and hosting.
  - Optional paid setup service.
  - Commission 1–7%, paid monthly (accessed 2026-11-12). — [Travelpayouts WL page](https://special.travelpayouts.com/wltravelagency)
- **Travelopro:**
  - The pricing page lists Basic, Advanced, Premium, Platinum and Enterprise tiers, plus supply bundles: Hotel; Hotel+Flight; Hotel+Flight+Holiday; Hotel+Flight+Holiday+Car.
  - No prices are shown, and the page says to "call ahead to discuss the price." Extra supply is "Optional Modules Integrated up on Request with applicable Pricing."
  - The page offers a "License to use the application," not source code (accessed 2026-11-12). — [Travelopro pricing](https://www.travelopro.com/pricing.php)
- **Trawex:** a complaint site has one reviewer alleging prices rose after paying US$4,000, and different pricing between test and live. Trawex replied that the price is one-time **[Unverified, user-generated]** (accessed 2026-11-12). — [ConsumerComplaints.in: Trawex](https://www.consumercomplaints.in/trawex-b115718)
- **Travelopro:** a Trustpilot reviewer says they spent €9,000 on flights and hotel API integrations and issued a "formal warning." Another says Travelopro demanded AMC (annual maintenance) payment before dashboard credentials were delivered **[Unverified, user-generated; vendor disputes]** (accessed 2026-11-12). — [Trustpilot: Travelopro](https://uk.trustpilot.com/review/travelopro.com)
- **Mystifly:** quote-based, volume-tied (accessed 2026-11-12). — [PHPTRAVELS](https://phptravels.com/blog/mystifly-api)
- **Expedia affiliate / per-click programme:** payout minimum $500 by bank transfer or $100 by PayPal **[third-party blog via search summary]**. — [AltexSoft: Expedia TAAP](https://www.altexsoft.com/blog/expedia-taap-rapid-api-partner-solutions)
- **Self-hosted licensed software (PHPTRAVELS):** sold as one-time license tiers (Startup, Agency, Enterprise) rather than SaaS **[Vendor claim]**. It brings no supply of its own. — [PHPTRAVELS OTA software](https://phptravels.com/online-travel-agency-software)

### Inferences
- **A cost-ordered launch stack:**
  1. **Affiliate/redirect:** $0 up front, but no customer ownership.
  2. **Duffel + LiteAPI:** $0 setup, per-booking or markup economics, plus the client's own build cost.
  3. **White-label vendor:** a setup fee in the thousands of USD, AMC or monthly fees, and supplier deposits. Several reviews describe AMC or "module" fees appearing after the initial payment.
- **Ask any white-label vendor for written totals:** setup, AMC, per-supplier integration fees, and per-booking fees.

### Gaps
- No published figures were found for TBO, Tripjack or Mondee deposits or credit lines, Hahn Air via consolidator costs, or HTS pricing.
- Duffel pricing was not re-checked here (flagged in the earlier file).

## Q3. Who is merchant of record, and who carries refunds and chargebacks?

### Takeaway
- **Redirect and affiliate routes** (Travelpayouts WL, Trip.com, Booking.com affiliate) keep the supplier as MoR and leave refunds and support with the partner. The startup's only exposure is lost commission.
- **Real-booking routes on the startup's own site** (Duffel, LiteAPI with its own card, consolidators, TBO-style wallets) make the startup the seller to the consumer. Even when the API provider holds the ticketing authority, the startup handles customer refunds and card disputes.
- **LiteAPI** has a "User Payment (Nuitee SDK)" option that may shift card processing to Nuitée, but the docs read here do not say who is MoR.

### Cited findings
- Under Travelpayouts White Label, users contact the booking partner for changes and refunds: "you don't have to worry about refunds or support" (accessed 2026-11-12). — [Travelpayouts WL](https://special.travelpayouts.com/wltravelagency)
- Travelport's guidance says a host agency or consolidator holds "ultimate ticketing authority and financial responsibility" for non-accredited agencies (accessed 2026-11-12). — [AltexSoft: Travelport API integration](https://www.altexsoft.com/blog/travelport-api-integration/)
- Hahn Air's terms: with non-IATA sub-agencies, "the IATA agency is responsible" (accessed 2026-11-12). — [Hahn Air ticketing T&Cs](https://www.hahnair.com/terms-and-conditions-ticketing)
- LiteAPI payment options are "User Payment (Nuitee SDK), Account Credit Card, Credit Line." The FAQ does not state who is MoR or who handles chargebacks (accessed 2026-11-12). — [Nuitée docs FAQ](https://docs.nuitee.com/docs/faq)

### Inferences
- A consolidator or host route moves supplier-side financial liability (ADM, ticketing debit memo, and settlement) to the consolidator. It does not move consumer-side chargebacks if the startup charges the card. That split comes from the general MoR rules in the earlier file, not from any consolidator contract.
- If the client wants to avoid card risk entirely at launch, the only documented options are redirect models. A possible middle path is LiteAPI's SDK payment for hotels, but who is MoR there is unverified.

### Gaps
- Not found: LiteAPI's MoR and chargeback terms, TBO or Mondee chargeback terms, or how white-label vendors (Travelopro, Trawex) route payments. Payments may go through the vendor's gateway or the client's.

## Q4. How does inventory compare with Duffel?

### Takeaway
Duffel's published reach (500+ airlines, about 1.6m stays, cars; see earlier file) is broader than any other self-serve option for a startup. The alternatives add to it in specific places:
- **LiteAPI:** a second hotel feed.
- **Hahn Air HR-169:** airlines that are hard to ticket elsewhere, reached through an IATA agency.
- **TBO and Mystifly:** Asian, Middle East and African content plus B2B net fares.
- **Travelpayouts:** price-comparison breadth without booking.

There are no independent, like-for-like inventory audits.

### Cited findings
- Hahn Air HR-169 covers 350+ partner airlines across 190 markets, including non-BSP markets served by ticket offices **[Vendor/secondary; counts vary]** (accessed 2026-11-12). — [Hahn Air global sales](https://hahnair.com/en/global-sales-ticketing); [AFRAA-hosted Hahn Air deck (2026-06)](https://site2.afraa.org/wp-content/uploads/2026/06/Hahnair-Welcome-to-Our-World-of-Airline-Distribution.pdf)
- Travelpayouts WL claims 1,000+ airlines and OTAs in search and 250k hotels, with brands such as Agoda and Trip.com **[Vendor claim]** (accessed 2026-11-12). — [Travelpayouts WL](https://special.travelpayouts.com/wltravelagency)
- TBO claims 2000+ white-label/API partnerships **[Vendor claim]**. — [TBO Holidays](https://tboholidays.com/whitelabels.htm)
- Mondee offers REST APIs for "thousands of International Flights" **[Vendor claim]**. — [Mondee TripPro dev portal](https://developer.trippro.com)

### Inferences
- Duffel stays the core. Complements should be chosen for specific gaps the client sees in Duffel's results, such as particular carriers or regions, or hotel price competitiveness. They should not be bought as general "more inventory."

### Gaps
- No independent comparison of hotel or air content overlap between Duffel and LiteAPI, TBO, Mystifly or Mondee.
- No data on Duffel's coverage of low-cost carriers versus Hahn Air or Mystifly.

## Q5. Lock-in, and ownership of the code and customer data

### Takeaway
- **Direct APIs** (Duffel, LiteAPI): the startup owns its front end, its customer records, and the option to switch.
- **White-label OTA vendors:** usually license the software rather than hand over source code. The site may sit on the vendor's stack, and supplier contracts may be in the vendor's name.
- **Redirect products:** the customer relationship sits with the partner OTA.

### Cited findings
- Travelopro's pricing page offers a "License to use the application," a "licensed customisable and turnkey product." No source code is mentioned (accessed 2026-11-12). — [Travelopro pricing](https://www.travelopro.com/pricing.php)
- Travelomatix prices vary partly with whether source code is included (earlier file, accessed 2026-11-12). — [Travelomatix](https://www.travelomatix.com/)
- On Travelpayouts WL, bookings and payment happen on partner sites, and partner agencies are preselected per market, not chosen by the site owner (accessed 2026-11-12). — [Travelpayouts WL](https://special.travelpayouts.com/wltravelagency)
- Expedia's White Label Template is hosted by Expedia, with the partner mainly supplying branding and a domain (earlier file). — [Expedia Developer Hub](https://developers.expediagroup.com/white-label-travel-platform/getting-started/requirements)
- Amadeus's 2026-07-17 shutdown shows that platform risk is real: API keys were disabled and builders had to migrate. — [PhocusWire](https://www.phocuswire.com/amadeus-shut-down-self-service-apis-portal-developers)

### Inferences
- Since Digital Heroes builds custom sites, the strongest ownership position is the client's own front end calling Duffel, plus a second hotel API, with supplier accounts in the client's name.
- The Amadeus shutdown argues for an adapter layer, so that a supplier can be swapped later.

### Gaps
- No white-label vendor contract terms on data export or exit were found.

## Q6. Real reviews and risks (scams, poor support, outdated content)

### Takeaway
The India-based white-label vendors (Trawex, Travelopro, FlightsLogic and others) have mixed reviews. Some public complaints allege post-payment price increases, AMC demands before delivery, and undelivered integrations. The vendors dispute them, and none of it is independently verified. The big platforms carry a different risk: products being withdrawn or gated (Amadeus Self-Service, Kiwi Tequila).

### Cited findings
- **Trawex:** 10 complaints on ConsumerComplaints.in, 9 marked resolved. The allegations include price rises after a US$4,000 payment and pricing differences between test and live **[Unverified, user-generated]**. — [ConsumerComplaints.in](https://www.consumercomplaints.in/trawex-b115718); [ComplaintsBoard](https://www.complaintsboard.com/trawex-technologies-b120137)
- **Travelopro:** one Trustpilot reviewer reports €9,000 spent and a "formal warning," and another reports an AMC demand before credentials were delivered. Travelopro replied that it could not find matching customer records. Other reviews are positive **[Unverified]**. — [Trustpilot UK: Travelopro](https://uk.trustpilot.com/review/travelopro.com)
- **FlightsLogic:** mostly positive Trustpilot reviews and one "scammers" review. The company says that reviewer was not a customer **[Unverified]**. — [Trustpilot CA: FlightsLogic](https://ca.trustpilot.com/review/flightslogic.com)
- An anonymous Trustpilot reviewer claimed Trawex and Travelopro are "the same company"; another alleged fake reviews across FlightsLogic, Travelopro and others **[Unverified; no corporate-registry check was done]**. — [Trustpilot](https://ca.trustpilot.com/review/travelopro.com)
- **Trawex on Capterra:** reviews exist for "Trawex Cloud Suite" (2026 listing; content not read). — [Capterra](https://www.capterra.com/p/132738/Trawex-Cloud-Suite/reviews/)
- **Amadeus Self-Service:** shut down 2026-07-17 with no reason given. — [PhocusWire](https://www.phocuswire.com/amadeus-shut-down-self-service-apis-portal-developers)
- **Kiwi Tequila:** closed to self-service in 2024. — [Ignav](https://ignav.com/docs/kiwi-tequila-alternative)

### Inferences
- **Diligence before paying any white-label vendor:**
  - Escrow or milestone payments.
  - Written supplier list, with whose contract each one sits under.
  - A demo on live (not test) inventory.
  - AMC and module fees in writing.
  - Source-code or data-export clauses.
  - A company-registry check.
- **Outdated content:** "best travel API" articles written before mid-2026 that recommend Amadeus Self-Service or the open Kiwi Tequila are stale, and many SEO pages in this space are integrator marketing.

### Gaps
- No Reddit or independent forum threads were found that review TBO, Tripjack, Mondee or LiteAPI as a startup supplier.
- No BBB or company-registry checks were done.

## Q7. Documented case studies and founder accounts

### Takeaway
Detailed founder accounts are scarce. No public account was found of a small, unaccredited OTA that names its first flight and hotel suppliers, approval times and blockers. The nearest evidence shows founders launching by selling through other channels first, and thin margins once suppliers and intermediaries take their share.

### Cited findings
- **Sourced Adventures:** took about 4 months to go from launch to taking bookings on its own website. Before that it made about 5,000 sales through third-party OTAs and resellers (Indie Hackers interview; date not verified). — [Indie Hackers search result](https://www.indiehackers.com/interview/ed3190654c) **[Which interview this URL points to was not confirmed by opening it]**
- **Tag Getaways (India):** a solo founder works directly with hotels and local suppliers at near-B2B pricing. First leads came from destination pages. — [Indie Hackers post](https://www.indiehackers.com/post/i-launched-a-travel-startup-in-india-with-zero-developers-and-got-my-first-online-leads-Zoo7sGAIQJewMqSxl9jv)
- **Zilyo (vacation-rental metasearch):** keeps about 7% of revenue after splits among the property, API provider, agency and transaction fees **[founder account via search summary; not opened]**. — [Indie Hackers](https://www.indiehackers.com/interview/b62762126e)
- **Large-partner case studies** (HTS with Capital One, PerkSpot and Lloyds; Expedia WLT with SoFi and United) show who these products are built for, not startup paths. — [HTS newsroom](https://hts.hopper.com/news); [Expedia WLT](https://partner.expediagroup.com/en-us/solutions/build-your-travel-experience/white-label-template)
- **Travelpayouts WL case studies:** one reports a 10% revenue bump **[Vendor-published, self-reported]**. — [Travelpayouts blog](https://www.travelpayouts.com/blog/white-label-web-real-companies-cases/)

### Inferences
- The evidence-backed pattern is:
  1. Launch revenue through a channel with no supplier approval (affiliate or redirect, or a self-serve API).
  2. Prove traffic.
  3. Use that data to unlock gated partners (Expedia, Booking, HTS, consolidator credit).
- This matches the phased path in the earlier file.

### Gaps
- No founder account was found with named suppliers, approval durations and blockers for a flights and hotels OTA.
- PhocusWire and Skift startup profiles, Reddit threads (r/travelagents, r/startups) and Tnooz archives were not searched in depth within the tool budget.
