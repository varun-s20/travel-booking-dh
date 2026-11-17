# Overwing inner pages, round 3 Part B, second critic round (critic subagent, high effort, foreground, 16:37 to 16:41)
Saved by Developer B: the critic has no Write tool. Its screenshots are in this folder.

## Scores
- Benchmark rubric: 8.0, FAIL (target 9.2). Depth 8.0, ease 8.3, visual 7.8, craft 7.8, pricing 8.2, mobile 8.0.
  Weighted: 0.25 x 8.0 + 0.20 x 8.3 + 0.20 x 7.8 + 0.15 x 7.8 + 0.10 x 8.2 + 0.10 x 8.0 = 8.01.
- Studio rubric: 7.6, FAIL (design 7.5, originality 7.5, craft 7.5, functionality 8.5).
- Previous round: benchmark 7.9 (craft capped at 7), studio 7.5.

## Caps
- Craft cap from round 1 no longer applies: no overlapping pins in the Lisbon map dialog at 1440; date-strip caps whole.
- No new overlap, clipping or header collision. No design tells.
- Varun's 16:28 no-disclosure ruling broken (blocks the target): the footer demo notice on every page, and "Demo reviews, written for this preview" on hotel results (filter column and results note) and twice on the hotel page.

## What stands between the pages and 9.2, worst first
1. Footer `p.o-footer__notice` demo notice on every inner page (footer owned by Developer A).
2. Demo reviews notice on hotel results (Guest score filter group, `.o-results__note`) and the hotel page (twice).
3. Lisbon map dialog, 1440: the $642 pin sits in the Tagus (collision pass pushed it south).
4. Same dialog: Hotel Sal e Vela's $889 pin in Monsanto park, its card says Belém.
5. Hotel results: only 8 stays per city; Booking.com's city results are far denser. Largest depth gap.
6. Fare page: two identical countdowns ("Price valid for" beside "Choose your fare" and "Fare held for" in the summary).
7. Fare grid Changes row: "$60 per traveler plus any fare difference, for a fee" repeats the fee.
8. Fare grid: no Priority boarding or Meal rows (Expedia and Priceline list them; needs catalogue data).
9. Hotel page, 390: header, pinned search, section nav and Reserve bar take about 255 of 844px.
10. Travelers, 1440: "Your trip" card has no flight times or numbers (Booking.com and Expedia keep them).

## Not checked by the critic (out of time)
Checkout and the guest form at both widths (/checkout needs booking state), login hint, 390 views of fares, travelers, hotel results and the map dialog, 1024, hover and focus pairs, reduced motion. Competitor deconstructions not re-read this round; comparisons rest on round 1's.
