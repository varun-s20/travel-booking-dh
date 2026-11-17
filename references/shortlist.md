# travel-booking: shortlist

Scout, 2026-11-10. Details for every site are in cards.md; the full search and screening record is in longlist.md. Pick one primary and any section donors in moodboard.html, then press "Copy my picks".

## Primary candidates (pick one)
1. **Hipcamp** (https://www.hipcamp.com/en-GB). A live booking product whose whole system maps onto the brief: tabbed search as the hero, list-plus-map results with chip filters, a priced result card with one action, and an app shell (Trips, Saves, Inbox) that becomes a bottom tab bar on mobile. Light and calm. Not visited: listing detail and checkout.
2. **Kasa** (https://kasa.com). The best hotel detail page in the set: photo grid, room cards with their own filters, policy accordion, reviews, map. A four-field search hero with a compact search pinned on inner pages. Weaker for flights; a dark video hero; an eyebrow above every homepage section.
3. **European Sleeper** (https://www.europeansleeper.eu). A small transport operator selling its own tickets: a search bar docked on the hero's rounded edge, rounded bands rising over each other (close to Varun's layout move 7), a route map, price-led destination cards and a trust footer naming the company. Saturated plum and orange, so the mood depends on our palette. Checkout not visited.

## Section donors (up to 5)
| Donor | Section to take | Why |
|---|---|---|
| Ferryhopper (https://www.ferryhopper.com/en/) | Flight search card and illustrated hero | One way / Return / Multi-destination tabs, From and To with a swap, stacked dates, passenger row, with a custom illustration under it. The closest model for flight search. |
| Mercury (https://mercury.com) | Account dashboard (My bookings) and price figures | Product dashboard with totals, a list of accounts and summary cards; superscript cents; a plain trust line at the foot of the hero. |
| Monocle City Guides (https://monocle.com/travel-guides/) | Popular destinations | Illustrated city cards in a series system (label, rule, name). The brief's answer to missing media, already working. Our own illustrations only. |
| Sidetracked (https://www.sidetracked.com) | About, Terms and Privacy pages | An 864px serif reading column with byline block, standfirst and rules. |
| Faye (https://www.withfaye.com) | What a fare or room includes | Soft checklist cards and a "starting at" price line. Take this card only; the rest of the site has tells. |

Reserve: The Hoxton (https://thehoxton.com) for labelled hotel search fields that stack on mobile, and region filter pills.

A combination that covers every screen in the scope: Hipcamp as the primary, Kasa's property page for hotel details, Ferryhopper's search card for flights, Mercury for the dashboard, Sidetracked for text pages. The flight results list, fare-change states and checkout have no direct model yet; Hipcamp's list half and Mercury's figures are the closest.

## Why Hipcamp is number 1
Hipcamp is the only candidate that is a working booking product from search to trips, and it is built the way this brief needs: a tool as the hero, comparable results with filters, a priced card with one clear action, and an account area that lives in the navigation rather than in a separate site. Its tabbed search turns into Flights / Hotels without changing shape. Its white ground carries stock photos today and Duffel hotel photos later without looking unfinished. Its navigation becomes a bottom tab bar on phones, where most travel searches start. Its two tells (a full-stop headline and one three-up illustrated row) sit on the surface and come out in the rebuild. Kasa's are built into the homepage rhythm (an eyebrow on every section). Kasa has the stronger detail page, so if Varun picks Hipcamp, Kasa's property page is the natural donor for hotel details. European Sleeper is the most original of the three and the closest to Varun's own layout moves, but it is a homepage and a ticket widget, not a full product, and its checkout was not seen.

## What I could not check
- Checkout, account and confirmation pages on every site. They need a search, dates or a sign-in, and the source rules forbid forms. Hipcamp's listing page, Kasa's results list and Ferryhopper's results were not visited.
- Ferryhopper's real mobile layout: desktop Chromium at 390 got the 992px desktop page.
- Phones: all 390 checks ran in desktop Chromium, not on a touch device.
- Font licences for Ambit (European Sleeper) and Arcadia (Mercury) are unknown.
- Gallery channel: Awwwards gave 11 candidates and none passed. SiteInspire and Godly block Anthropic's crawlers in robots.txt. Land-book's terms page returned 403 and One Page Love has no terms page, so all four were skipped.
- Screening rule slip: on Spain Collection (killed) the screener clicked Accept on a cookie banner with no reject button. Later batches were told not to click Accept.
- The first Playwright attempt found the browser locked by another process. Discovery went on through search and a fetch agent until the browser came free; nothing was skipped because of it.
