# Critic: polish round, whole site (2026-11-11, high effort)
Saved by the Developer from the critic's report, unchanged in substance. Fixes made after it are listed at the end.

## 1. Summary
**Weighted total: 7.7. FAIL.** Design 8, originality 7, craft 8, functionality 8.5.

It fails on two counts: the total is under 8.0, and originality is under 8. No design tells and no copy tells.

Verdict: a real step up from 7.4. The hero now reads as dawn, the destinations sit on the page's axis, the map is grey in navy, and results remember filters and sort. Close in craft. It still would not pass as Varun's, because nothing in it belongs to a real client: no brand, no logo, no own media. The cabin window is the one idea it owns. What's left in craft is small: a map seam that went from two directions to one, the Map pill at rest, and a few spacing and alignment slips.

**Bookings submitted (navy, 1440, card 4242, both paid and confirmed):**
- Flight PZMZXT: Kittiwake Air 07:05, London Heathrow to Lisbon, Nov 20 to 27, 2 adults, Classic fare, $1,284.60.
- Hotel MHQJNV: Casa Lanterna Courtyard Double, 7 nights, $1,302.00.
After logging in as maya.okafor, both bookings appear in Bookings with the demo bookings.

**Console:** no errors or warnings from the site (the 404 page's own entry is expected).

**Screenshots:** build/critic/polish/, scrollbar hidden, page scrolled through first, mouse parked.

## 2. The last report's issues, re-checked
1. Results keep list, filters and sort: **fixed.** Nonstop only, Wren Air unticked and Cheapest all came back after the browser's Back, with the 20 cards and the scroll position. "Back to results" keeps them too but lands at the top (new issue 8). At 390: "Showing 32 of 86 flights", "Filters, 2".
2. Dim hero photo: **fixed.** Gold sunrise sky in the top third of all four panes; the town and shore read; pane 4 has beach and sea. Same in Cabin dawn at 1440 and 390.
3. Destinations off axis: **fixed.** Heading row and the 3 x 286 grid share x 287 to 1240, centred on the 148 to 1380 column.
4. Sepia map in navy: **fixed.** Neutral grey tiles, navy pins, teal hovered pin; Cabin dawn a warm grey.
5. Map tile seams: **partly fixed.** Vertical seams gone. A horizontal 2px line, 3 to 5 levels lighter, remains where tile rows land on fractional y (hotel detail Location map y 377; hotel results map y 738; also Cabin dawn).
6. Hotel phone bar leads with the total: **fixed** ("From $1,302 total" over "$186 a night").
7. 900 to 1024 menu duplicates when logged in: **fixed.** Log out now leads the list (new issue 7).
8. Map pill covering card text at 390: **partly fixed.** It steps aside on scroll down and returns on scroll up, but at rest (y 696 to 740) it sits over card text: "Graça, 2-star hotel" on load, the "Cais Verde Hotel" title after a scroll up.
9. Selects with no prompt: **fixed** (the Chief Officer's ruling).
10. Hotel cards one height at 1440: **fixed.** All five cards 349px, "$X total" 218px from every card top. Side effects in new issue 3.

Date of birth at 390: **fixed.** "Day", "Month", "Year", then "28", "September", "1987" show whole. The fix uses an 8px left inset against 16px elsewhere (new issue 4).

## 3. Row scores
| Row | Design | Reason | Craft | Reason |
|---|---|---|---|---|
| Navigation | 8 | Clear rail; top bar keeps account actions; tab bar steps aside. | 8 | No duplicates. Log out leads the 900 to 1024 menu. |
| Hero | 8.5 | Navy wall, 1040 pill, four lit windows on a warm dawn town. Strongest screen. | 8.5 | Clean at 1440 and 390, both palettes. |
| Entry cards | 7 | Good photos, familiar split. | 8 | Clean. |
| Destinations | 7.5 | Window-shaped city photos carry the concept. | 8 | On axis. Narrower than its neighbours (ruling stands). |
| Trust panel | 7 | Calm Reception photo; generic split panel. | 8 | No defects. |
| Pre-footer band | 7.5 | The ghost window is a good beat. | 7.5 | At 1440 the full-width footer rises over a band inset 16px (new issue 5). |
| Footer | 7 | Contacts first, coast photo, teal heads. | 8 | Two columns at 390. |
| Flight results | 8 | Totals lead, chips, priced sort, window beside the H1. | 8 | State persists. Price note wraps at 1440. |
| Flight details and fares | 7 | Clear breakdown and summary. | 7.5 | Summary top off the first card's top (new issue 6). |
| Passenger and guest forms | 7 | Error summary with links, saved travelers. | 7.5 | Date of birth inset 8px against 16px. |
| Hotel results | 7.5 | Total first, grey map, teal hover pin. | 7 | Tile seam; empty card middles; Map pill at rest at 390. |
| Hotel detail | 7.5 | Kasa grid, room totals first, sold-out room handled. | 7.5 | Location map seam at 1440. |
| Checkout and confirmation | 7.5 | Stripe line, lock, Thin reference. | 8 | Both paid. Hotel confirmation shows the Lisbon tram, not the hotel. |
| Account and Bookings | 7 | Plain but clear; 160px photos. | 8 | Login lands on the profile, not Bookings. |
| Typography | 8 | Calibre Bold with Geist. | 8 | Holds. |
| Color | 8 | Navy, white and teal, no off-palette surface. | 8 | Map fixed. |
| Motion and interactions | 7.5 | Blinds, drift, fast state changes. | 8.5 | Reduced motion not re-tested. |
| Mobile | 8 | Inline search, sticky totals, hotel bar fixed. | 7.5 | Map pill at rest; one-height cards at 390. |

## 4. Copy tells
None (text, accessible names and alts of Home, About, Contact, Terms, Privacy, Log in, Sign up, 404 and hotel detail).

## 5. Design tells
None.

## 6. New issues, worst first
1. Horizontal map tile seam (hotel results and hotel detail Location, 1440, both palettes): a 2px light line at each tile row boundary (fractional y).
2. Map pill at rest covers card text (hotel results, 390).
3. One-height hotel cards leave holes: about 100px of empty middle in cards without a chip at 1440; every card forced to 542px at 390 with the extra space above the title; "included" alone on the nightly line's second row.
4. Date of birth selects inset 8px against 16px elsewhere (passenger form, 1440 and 390); the Day, Month, Year sub-labels repeat the prompts.
5. Mismatched section edges (home, 1440): hero and pre-footer inset 16px, the rising footer runs flush right, so its rounded corners stick out past the band.
6. Summary cards misaligned with the form (checkout: "Your trip" y 181 vs Contact card 251; flight details: 255 vs 306).
7. Log out leads the 900 to 1024 menu when logged in.
8. "Back to results" lands at the top (the browser's Back restores scroll).
9. Hotel confirmation window shows the city, not the hotel.
10. Small form details: the adult Year list offers 2026 (adults are 12 or older); the terms checkbox's accessible name has a stray space before a comma.

## 7. Not checked
Text over the hero photo not sampled (every hero text box sits on the wall or the pill). Reduced motion, the 1024 and 960 search layouts (only the 960 menu), About, Contact, Terms and 404 visually, Cabin dawn flight results, declined cards, sign up and reset, profile edits, cancelling, /emails, the Contact form. 390 was desktop Chromium without touch emulation. Map tiles come live from tile.openstreetmap.org with attribution: fine for a demo, not for production (a provider decision for later).

## After the report (Developer, checked in the browser on the production build, not re-scored)
- Fixed, in order: 1 map seams (tiles overlap 1px; pixel scan clean at every tile boundary), 2 Map beside Sort in the phone toolbar (floating pill removed), 3 cards one height only from 641 with conditions and price grouped at the floor, nightly line balanced, natural height on phones, 4 date selects 16px in (Day floor 76px on phones), 5 Home footer inset 16px like the band, 6 summary aligned with the first card on flight details and logged-out checkout, 7 Log out last in the 900 to 1024 menu, 8 Back to results restores the scroll position, 9 hotel confirmation window shows the hotel, 10 adult birth years from 2014 and the terms label space.
- Not changed: Log in lands on the profile (existing rule), the title tags on that redirect (Next.js), OSM tiles (provider decision for later).
