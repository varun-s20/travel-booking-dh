# Critic: final whole-site pass, session 3 (2026-11-11, xhigh)
Saved by the Developer from the critic's report, unchanged in substance. The fixes made after it are listed at the end (not re-scored).

## 1. Summary
**Weighted total: 7.4. FAIL.** Design 7.5, originality 7, craft 7.5 (no cap triggered), functionality 8.

It fails on two counts: the total is under 8.0, and originality is under 8. No design tells and no copy tells survived the scan.

Verdict: this is the strongest round so far, and the booking flows hold up end to end. It would not yet pass as Varun's work. The hero photo reads dim. The destinations grid floats off its section's axis. The sepia map clashes with the navy palette. Results lose their filters and sort when you come back from a flight, and a Booking.com or Expedia user would notice that first.

**What the critic ran.** Navy at 1440 and 390, plus 960 and 1024 for the search. Cabin dawn spot checks: Home at 1440 and 390, flight results, hotel results, and the guest form with its error state at 1440.

**Bookings submitted (navy, 1440, test card 4242, both paid and confirmed):**
- Flight HW28XH: London to Lisbon, Classic fare, $1,056.40.
- Hotel G6P9MW: Casa Lanterna Courtyard Double, $1,302.00.

**Console:** nothing from this run except the expected 404 on /no-such-page.

**Chief Officer's photo condition: met.** Kiama is a harbour town at first light, with no industry. Land shows in all four panes at 1440 (pane 4 is half beach and half sea). The warm light is thin; see issue 2.

## 2. Row scores
| Row | Design | Reason | Craft | Reason |
|---|---|---|---|---|
| Navigation (rail, top bar, tab bar, menus) | 8 | Flights, Hotels, Bookings, Help read at a glance. Rail items switch the hero quietly. The tab bar steps aside on scroll. | 7 | Logged in, the 900 to 1024 menu lists Bookings twice and has both Profile and Account. Menu rows at 390 are 56px in one group and 48px in the other. |
| Hero | 7.5 | The navy wall, the 1040px pill and four lit windows make one clear idea. Search is prominent at every width. | 8 | Clean at 1440, 1024, 960 and 390. Window tops show above the tab bar at 390. The photo is underexposed (issue 2). |
| Entry cards | 7 | Good photos and a clear split, but a familiar pattern. | 8 | 48px under the hero holds. Clean at 390. |
| Destinations | 7.5 | Window-shaped city photos fill the cards and carry the concept well. | 6 | At 1440 the grid sits centred under a wider heading row (issue 3). |
| Trust panel | 7 | The Reception sign over the sea is calm and on message. The layout is still a generic split panel. | 8 | No defects at either width. |
| Pre-footer band | 7.5 | The ghost window behind the headline is a good concept beat. | 7.5 | The window is faint. At 390 the rising footer covers its base. |
| Footer | 7 | Contacts first, the coast photo, teal column heads. The white demo-notice slab is the loudest thing in it. | 8 | Two columns at 390. |
| Flight results | 8 | Totals lead each card, Cheapest and Fastest chips appear, sort options show prices, and the H1 has its window. | 7 | Filters and sort lost on return (issue 1). The price note wraps in the narrow column at 1440. |
| Flight details and fares | 7 | Clear breakdown and a sticky summary. The phone bar shows the total. | 8 | "Not refundable" sits under Included with no icon (Copywriter). |
| Passenger and guest forms | 7 | Error summary with links, field errors, saved travelers when logged in. | 7 | Title, Day, Month and Year are blank boxes with no prompt (issue 9). |
| Hotel results | 7.5 | Total first, price pins, filter chips. | 6.5 | Sepia map tiles (issue 4). Card heights vary between 288 and 320px. |
| Hotel detail | 7.5 | Kasa-style gallery, room cards lead with the total, the sold-out room is handled well. | 6.5 | Tile seams in the Location map (issue 5). The phone bar leads with the nightly price (issue 6). |
| Checkout and confirmation | 7.5 | Stripe line with the lock, sticky Pay at 390, Thin reference number, clear next steps. | 8 | Both payments went through. |
| Account, dashboard, booking detail | 7 | Plain but clear. 160px photos on the booking cards. | 8 | Logging in while logged in redirects to /account and leaves two sets of title tags in the head. |
| About, Contact, Terms, Privacy, 404 | 7 | The closed-window 404 is a good touch. Legal pages are placeholders (known). | 8 | The About harbour photo's lower third is a dark silhouette mass. |
| Typography | 8 | Calibre Bold sentence case with Geist for the interface. | 8 | The scale holds. |
| Color | 7.5 | Navy, white and teal as briefed. | 7 | The map's sepia filter is the one off-palette surface in navy. |
| Motion and interactions | 7.5 | Blinds rise once, the view drifts slowly, state changes are fast. | 8.5 | Reduced motion opens the blinds at once and stops the drift. |
| Mobile | 8 | Fields inline on Home, sticky totals, the sheet opens on the tapped cell. | 7 | The Map pill sits over price lines (issue 8). The hotel phone bar shows the nightly price. |

## 3. Copy tells
None found. Note for the Copywriter, not a tell: "taxes and fees included" appears 8 times on the homepage.

## 4. Design tells
None.

## 5. Issues, worst first
1. Filters and sort reset when you return from a flight (flight results, all widths).
2. The hero photo reads dim; the first light is a thin strip under the blinds (home, 1440 and 390, both palettes).
3. The destinations grid is off its section's axis (home, 1440).
4. The map tiles are sepia in Night navy (hotel results and Location maps).
5. Hairline seams between map tiles (hotel detail Location map, 1440).
6. The hotel detail phone bar leads with the nightly price (390).
7. The 900 to 1024 menu duplicates items when logged in.
8. The Map pill covers card text while scrolling (hotel results, 390).
9. Blank selects with no prompt (passenger form).
10. Inconsistent hotel result card heights (hotel results, 1440).

Session 3 round 1 fixes that held: tab bar items, the menu at 900 to 1024, the 480px menu card, the gap under the hero, the pre-footer window and inset, sunrise in all four panes (thin), the Reception trust photo, the tinted sheet cell, the Year select, the phone details summary, Fastest chip and sort agreeing, the inline lock, the filter column scrollbar, no seam above the top bar.

Not checked by the critic: typing a search on Home; sign up, password reset, profile edits, cancelling, declined cards, the contact form, fare-changed and expired states, /emails; Cabin dawn beyond spot checks; numeric contrast sampling; real phones, Safari, Firefox, screen readers.

## After the report (Developer, checked in the browser, not re-scored)
- Fixed: 1 (results keep list, filters and sort for the life of the offers), 2 (view lowered to -17cqw with a light lift; the sunrise sky sits a third into every pane), 3 (one centred axis), 4 (map tiles go grey, then through the palette's grade), 5 (tiles on whole pixels), 6 (bar reads "From $1,302 total, $186 a night"), 7 (account group keeps only Log out there), 8 (the pill steps aside with the tab bar).
- Not fixed: 9 needs the Copywriter's words; 10 left for the Art Director (build/handover.md).
