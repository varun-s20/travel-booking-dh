# Handover: travel-booking (working name Overwing, a placeholder)
Developer, session 3, 2026-11-11, build-site skill: the Overwing revision for the client's feedback (design/revision-2026-11-11.md), applied to the whole site in site/. Next.js 16 app, simulated backend, front end only. Nothing is deployed. The session 1 and 2 handover is replaced by this one; its history is in build/progress.md.
Updated by the polish round (session 4, 2026-11-11, 05:29 to 07:45): see "Polish round" below; the rest of this file still holds.

## Polish round (session 4)
- **Critic, whole site, high effort:** 7.7 FAIL (design 8, originality 7, craft 8, functionality 8.5), up from 7.4. No design or copy tells. Report: build/critic/polish/report.md.
- **The last pass's ten issues, re-scored:** 1, 2, 3, 4, 6, 7, 9 and 10 fixed; 5 (map seams) and 8 (phone Map pill) partly fixed. The date of birth selects at 390 show whole.
- **Fixed after the round, worst first, each checked in the browser on the production build:**
  1. Map tile seams: a horizontal 2px line remained, because the map box itself lands on a fractional y. Each tile now draws 1px larger than its 256px step and overlaps the next. A pixel scan at every tile boundary, sea rows included, now reads like any other row.
  2. Phone Map pill: at rest it always lay over a card's text. Map now sits beside Sort in the phone toolbar ("5 places to stay" above, then Sort and Map). The floating pill is gone (a spec 2b change; see Decisions 8).
  3. Hotel cards: one height only from 641px, where they sit beside the map. The icons and chips now sit with the price at the card's floor, and the nightly line balances its two rows. On phones each card takes its own height, with the title 16px under the photo.
  4. Date of birth selects: text 16px in, like every other field (was 8px). On phones Day gets a 76px floor ("Day" 28.5px in 34, "September" 82 in 92, "1987" 35 in 42 at 390).
  5. Home footer: inset 16px like the hero and the pre-footer band, closing the page as a card (its corners stuck out past the band).
  6. Summary cards: on flight details and on checkout when logged out, the summary's top now lines up with the first card (306 and 306; 251 and 251).
  7. The 900 to 1024 menu, logged in: Flights, Hotels, Bookings, Account, the pages, then Log out after a divider.
  8. "Back to results" returns to the same place in the list (1200 to 1200), like the browser's Back.
  9. A hotel confirmation's window shows the hotel's first photo (Casa Lanterna's courtyard), not the city.
  10. Adults' birth years start at 2014 (12 or older), children's and infants' lists at their own bands. The checkout terms box no longer reads a stray space before its comma.
- **Chief Officer: APPROVED WITH NOTES** (details under "Chief Officer" below). Its one note is fixed: the hotel map pins show the stay total ("$679"), the same number that leads each card, in both palettes and on the phone map.
- **Not changed:** logging in while logged in lands on the profile, not Bookings (the existing rule: Log in goes to the account unless a next page is given); the double title tag on that redirect (a Next.js routing quirk, harmless to visitors); OSM live tiles (fine for the demo, not for production: a provider decision).

## What changed
- **Palettes.** Night navy is the default (port 3001) and Cabin dawn the alternate (port 3002). The gold palette is gone from the app, its scripts, tokens, icons, email colours and grade filter (it moved to the second design). tokens.css is design/tokens.css, copied unchanged.
- **Navigation.**
  - Rail: Flights, Hotels, Bookings, Help, More, in one list. Flights and Hotels set the home search, or mark the product on results, detail, checkout and confirmation pages.
  - A solid top bar beside the rail keeps Log in and Sign up at every scroll position. Logged in, they become one pill with the visitor's first name.
  - On results and hotel pages the compact search sits centred in the top bar and shrinks inside it on scroll.
  - Phone tab bar: Flights, Hotels, Bookings, Account. It steps aside on scroll down and while text is typed in the search, and comes back on any scroll up.
  - More opens level with its button. From 900 to 1024 (no rail, no tab bar) the menu leads with Flights, Hotels, Bookings and Account.
- **Search.** The pill shows from 900px (Search as its arrow only up to 1024). On phones the fields show inline as one white card; a tap opens the full-screen sheet on that cell, and a failed search opens it on the failing cell.
- **Home.**
  - The hero is the cabin wall at night: a navy panel, a 1040 x 80 pill with Flights and Hotels tabs with icons, and four 256 x 345 windows with a 2px bright-teal lit edge.
  - The new view is a harbour town on the coast at first light (Kiama, NSW; Martin David), with land in all four panes. It is also in the searching window, the pre-footer window and the footer.
  - The fact chips now include "Taxes and fees included".
  - Below the hero: entry cards at 3:2, destination photos filling a cabin-window shape with the price under it, the trust panel in the wall's navy with a new photo, and a real window behind the pre-footer line.
- **Clear pricing.**
  - Every result card leads with the total.
  - Under it: what the total covers (flights) or the nightly rate (hotels), then the per-person amount.
  - Cheapest and Fastest chips. The sort options show their first price.
  - Summaries list Fare, Taxes and fees, Total and "Includes taxes and fees.". No "no booking fee" claim.
  - The hotel phone bar leads with the stay total.
- **Inner pages.**
  - The destination window beside the flight results title.
  - Teal slider fill on a tint track, deep pins and the teal hover pin, the teal lock under Pay.
  - 160px dashboard photos.
  - The About banner on the wing photo under the navy scrim, plus a new 21:9 photo.
  - New Contact and Terrace Suite photos, white closed windows on the 404 and empty states, navy emails.
- **Results remember.** Coming back from a flight (Back to results or the browser's Back) keeps the list, filters and sort for the life of the offers (30 minutes).

## Critic scores
| Round | Scope | Effort | Design | Originality | Craft | Functionality | Total | Verdict |
|---|---|---|---|---|---|---|---|---|
| Session 3, round 1 | Home, both palettes, 1440, 1024, 960, 390 | high | 7 | 7 | 6 | 7 | 6.8 | FAIL |
| Session 3, round 1 | Flight flow to confirmation, navy, 1440 and 390 | high | 7 | 6 | 6 (capped: clipped Year) | 8 | 6.55 | FAIL |
| Session 3, final pass | Whole site, navy, Cabin dawn spot checks | xhigh | 7.5 | 7 | 7.5 | 8 | 7.4 | FAIL |
| Session 4, polish round | Whole site, navy at 1440 and 390, Cabin dawn spot checks; re-scores the final pass fixes | high | 8 | 7 | 8 | 8.5 | 7.7 | FAIL |
| Earlier: session 2 final pass | Whole site, both palettes (before the revision) | xhigh | 7.5 | 6.5 | 7 (capped) | 8.5 | 7.2 | FAIL |
- No round found a design tell or a copy tell.
- The polish round (7.7) is the best score so far. It fails on the total (under 8) and on originality (7). Originality has been held back in every round by the missing client brand and media. The cabin window is the one owned idea. Its fixes are listed under "Polish round" at the top; the session 3 notes below are history.
- The session 3 final pass fails on the same two counts.
- The final pass confirmed the round 1 fixes held, apart from the warm light in the hero (thin) and the destinations axis.
- Fixed after the final pass, checked in the browser, not re-scored:
  - results keep their list, filters and sort on return;
  - destinations on one centred axis;
  - the map tone now follows the palette's own grade (the sepia came from the gold palette);
  - map tiles on whole pixels (no hairlines);
  - the hotel phone bar leads with the total;
  - no duplicate rows in the 900 to 1024 menu when logged in;
  - the phone Map pill steps aside with the tab bar;
  - the hero view lowered to -17cqw with a light lift, so the sunrise sky sits a third into every pane.

## QA (build/qa-report.md, session 3; polish round re-check)
- Polish round: after the last fixes, Home, hotel results, hotel detail, flight results, both confirmations and Bookings in both palettes at 1440 and 390: no console errors, no 4xx responses, no horizontal scroll. Text scan clean.
- Both production builds compile with no warnings; type check clean.
- Text scan of shipped files: no em or en dashes, no AI attribution, no lorem, TODO or bracketed placeholders.
- Browser QA on the production builds, 14 pages in navy and 6 in Cabin dawn, at 1440 and 390:
  - no failed requests or console errors (the 404 page's own status aside);
  - no image drawn above its file's width; no missing alt; no empty stretches;
  - a ring on every keyboard stop; the skip link works.
- Lowest real text contrast: 5.04:1 in Cabin dawn, 5.45:1 in navy. The flags the script raises are listed in the QA report and were each checked by eye.
- Not checked: real phones, Safari, Firefox, screen readers. The hero contrast sampler was not re-run, because every hero text box sits on the navy wall or the white pill, not on the photo.

## How to preview
In projects/travel-booking/site/:
- **Night navy (the default):** `npm run build:navy && npm run start:navy`, then http://localhost:3001
- **Cabin dawn:** `npm run build:cabin && npm run start:cabin`, then http://localhost:3002
- **Dev servers:** `npm run dev:navy` and `npm run dev:cabin`. `npm run dev`, `build` and `start` with no suffix run navy.
- **Both at once:** each palette builds into its own folder (.next-navy, .next-cabin), so both can build and run side by side.
- **Rebuild after a change:** stop that palette's server first (below), then build and start it again. Both builds were last made and checked on 11 Nov (polish round).
- **Ports:** this design uses only 3001 and 3002. 3003 and 3004 are the second design's (Landfall), and 3005 and 3006 belong to other stages.
- **Stopping servers on Windows:** a background shell can outlive its task. Stop a server by the PID on its port (`netstat -ano | grep :3001`, then `taskkill //PID <pid> //T //F`).
- **Emails:** /emails on either server.
- **Visitor state** lives in the browser (localStorage key overwing:v1; results in sessionStorage). Clearing them logs out and removes bookings made there.
- **Demo script** (unchanged from session 2):
  - London Heathrow to Lisbon, Nov 20 to 27, 2 adults: Kittiwake Air 07:05 books cleanly.
  - Test card 4242 4242 4242 4242.
  - maya.okafor@example.com with any password of 8 or more characters opens the demo account.
  - Lisbon has five hotels; Casa Lanterna's Terrace Suite is unavailable over 5 nights.
  - Quick links: hotel results http://localhost:3001/hotels?place=lisbon&checkin=2026-11-20&checkout=2026-11-27&adults=2&children=0&rooms=1 ; flight results http://localhost:3001/flights?from=LHR&to=LIS&depart=2026-11-20&return=2026-11-27&adults=2&children=0&infants=0&cabin=economy

## Photos
All are Unsplash License, each checked on its photo page on 11 Nov and listed in site/public/images/credits.md.
- **New:**
  - kiama-harbour-first-light (Martin David): the hero, searching, pre-footer and footer views;
  - trust-reception-sign (Dmitry Limonov);
  - contact-map-pen (Glenn Carstens-Peters);
  - about-harbour-window (Fiqih Alfarish);
  - casa-lanterna-terrace-suite (Gábor Szűts).
- **Retired** (files removed from public/, sources kept in assets-src/): wing-over-clouds, window-seat-phone-sunset, about-coast-wing, contact-map-cafe, and the earlier Terrace Suite photo.
- **Upscaling:** none; every source is 2600 to 3200px wide.

## Decisions I made (each easy to undo)
1. On inner pages the compact bar keeps its one summary pill on phones; item 14's inline cells are for the home hero.
2. Destinations show as two rows of three 286px cards on one centred axis, not the spec's four columns. With six cities, four columns left a row of two. Eight cities would mean inventing two destinations.
3. The pre-footer window shows at 30%, so the white line over it holds contrast. It is 400px tall at 1440 (the spec says 440) so the footer's rise never cuts it. The band is inset 16px like the hero.
4. The hero view gets a light lift (brightness 1.22, saturate 1.1) after the navy grade, on the hero windows only, because the dawn photo is dim at source. View offsets: -17cqw at 1440, -16cqw on tablets, -12cqw on phones.
5. The map tiles go grey and then through the palette's grade filter. There is no hand-tuned tone per palette.
6. The trust photo is a Reception sign over the sea. The first pick, a brass bell, showed the photographer reflected in it.
7. The phone tab bar hides only while text is typed in the search, not while a cell button has focus. Any scroll up brings it back.
8. (Polish round) On phones, hotel results put Map beside Sort in the toolbar instead of spec 2b's floating pill. Two critic rounds found the pill over card text at rest; a floating button over a scrolling list always covers something. The full-screen map and its List pill are unchanged.
9. (Polish round) On Home at 1440 the footer is inset 16px and rounded on all four corners, like the hero panel, so it meets the inset pre-footer band edge to edge. Inner pages keep the full-width footer.
10. (Polish round) Hotel result cards keep one height only from 641px, with the conditions and price grouped at the card's floor. On phones each card takes its own height.

## For the Art Director
- Item 8 and the funnel: the Chief Officer ruled that flight details, passengers and checkout stay without the compact search. Confirm, or overrule for Varun.

## For the Copywriter
- **Proposed lines in the build:**
  - the chip "Taxes and fees included";
  - the result-card lines "total for 2 travelers, taxes and fees included" and "$451.20 a person";
  - "$106 a night, 7 nights, taxes and fees included";
  - "Includes taxes and fees.";
  - the menu row "Help and contact";
  - "From $1,302 total" over "$186 a night" in the hotel phone bar.
- **Alts written to the sourced photos:**
  - hero: "A harbour town on the coast at first light, seen from high above";
  - trust: "A Reception sign on a whitewashed wall above the sea";
  - Contact: "A hand tracing a route with a pen on a paper map, an open notebook below";
  - About: "A harbour with moored boats, seen through a dark room's window".
- **Passenger form:** the selects now open on "Select", "Day", "Month", "Year" (the Chief Officer's interface wording, yours to change).
- **Destination cards** now read "Return from $412" and "1 adult"; the note under the grid keeps "taxes and fees included".
- **Carried over from session 2:**
  - "Not refundable" listed under Included;
  - the "Show more flights" label;
  - the refund line;
  - the title and passport errors.

## For the client and Varun
- Brand, contacts, legal text and market are placeholders named in the demo notice.
- Calibre is licensed for design review only: a Klim web licence, or a switch to Rethink Sans, before any public preview.
- The Stripe card fields are simulated. The real Payment Element, and the Stripe Appearance values in item 29, need the client's keys.
- An unused build folder from the gold palette, site/.next-harbour, is still on disk. My shell delete was refused; it is gitignored and safe to delete.

## Chief Officer (Varun's stand-in)
- **Call 1: APPROVED WITH NOTES.** All five art direction conditions verified in the browser: the photo, the teal lit edge, the 390 window tops with Search above the fold, no fee claim, and the 900 to 1024 search, with no seam at fractional scroll.
- **Rulings in Varun's place:**
  - no compact search on flight details, passengers or checkout (the funnel stays focused);
  - destinations as two rows of three, approved;
  - select prompts "Select", "Day", "Month", "Year".
- **Its five notes, all fixed:**
  - select prompts;
  - "taxes and fees included" off each destination card;
  - the hotel phone bar on two lines;
  - the destination's window beside "You're booked";
  - hotel cards at a 320px minimum.
- **Call 2 (session 3's last): APPROVED WITH NOTES, final.** The one open point was the date of birth selects clipping at 390. I fixed it after the call and measured it at 390, 768 and 1440.
- **Polish round call: APPROVED WITH NOTES.**
  - The date of birth point is closed: filled and empty, every value shows whole at 390, 16px in like every field.
  - Rulings in Varun's place, all approved: Map beside Sort on phone hotel results; the inset Home footer at 1440 (Home only); one card height from 641 with the price at the floor.
  - Its one note, fixed and checked in both palettes at 1440 and 390: map pins now show the stay total, the same number that leads each card.
  - It did not itself re-check the summary alignment, the 900 to 1024 menu, Back to results, the hotel confirmation photo or the birth-year range; I checked each in the browser.

## Commit point
The revision is a good commit point. Suggested message:
`travel-booking: Overwing revision for client feedback (navy and cabin, nav, mobile search, pricing, new photos)`
