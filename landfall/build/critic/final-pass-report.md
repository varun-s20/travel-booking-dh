# Landfall final whole-site critique (critic agent, xhigh, 2026-11-11, 11:17 to 11:24)
Production builds: navy http://localhost:3003, Harbour http://localhost:3004. Recorded by the Developer from the critic's hand-back, wording kept. Screenshots: .playwright-mcp/ at the studio root (h-results-*, h-detail-*, h-gallery2-1440, h-roomdialog-1440, h-filters-390, x-*-1440, harbour-*, footer-390, f-pinned-search-1440, all ending -studio.png).

## Summary
- Weighted total about 6.9, FAIL. Design 7, Originality 6.5, Craft 7 (capped: overlap on flight results), Functionality 8.
- Clean and consistent, and the landfall line is used with discipline. Group H is still the familiar hotel-booking layout (list with a map, a strip of thumbnails, a room carousel, a pinned stay card), so originality stays below the bar.
- Group H: design 7, craft 7.5. Tidy at 1440 and 390, no horizontal scroll; the stay leg is the best idea on the page. The opening photo and some gallery photos weaken it.
- Group F: only the pinned-search fix re-checked; it holds but causes a new overlap (issue 1).
- Home: Harbour home at 1440 only; the Lisbon hero is strong, the headline reads well, the nav stays quiet.
- Harbour: identical layout, only the palette changes; text and buttons read everywhere checked; the action fill is a deep petrol navy, not gold (issue 7).
- Design tells: none on the pages seen. Copy tells: none seen (no site-wide search run by the critic).

## Issues, worst first (B blocks a PASS)
1. B. Flight results, 1440, navy: the expanded pinned search floats with nothing behind it; results show above it and teal Select slivers at its right edge. Fix: keep the white pinned strip behind the card, or dim the results while open.
2. B. Originality, whole site: results and detail follow the standard travel layout; the landfall line is the only thing that belongs to this client. Fix: let the concept shape a layout on hotel detail, for example the stay leg across the lead photo.
3. Hotel detail, all widths: the lead photo (cl-roof-terrace) is mostly an out-of-focus table and chair, no water; also the guest-form summary photo. Fix: crop toward the rooftops and river, or lead with the river-window photo.
4. Photos off the Lisbon water-and-city story: Terrace Suite (palms, pink wall, split air conditioner), River View Double (modern tower blocks), 404 (industrial port with chimneys). Fix: replace with photos that read as Lisbon.
5. /bookings/S4T9LW, 1440: Payment shows the total and "taxes and fees included" with no per-night line (price rule).
6. Hotel detail, 390: the price bar reads "From $744" with no "total" and runs "for 4 nights, $186 per night, taxes and fees included" together.
7. Harbour, 1440 home and 390 detail: Search flights and Choose a room are filled deep petrol navy with white labels; gold only as underlines. Breaks "navy never fills a button" if the watch item covers Harbour.
8. Hotel detail, 1440: the Amenities two-column grid is about 340px wide; two labels wrap and the rows go ragged.
9. Hotel detail, 1440: the room carousel clips its cards' shadows (hard grey band at its bottom edge).
10. Hotel results, 390: the subtitle leaves "room" alone on its second line.
11. Gallery dialog, 1440: the browser's default scrollbar inside the dialog.
12. Low confidence: first clicks on Filters (390) and Room details (1440) sometimes did nothing (possibly before hydration); the Filters sheet at 390 has about 400px of empty space.
13. Low confidence: the header showed "Sign in" on the first page loaded and "Your account" after; a flash of the signed-out state for signed-in visitors.

## Watch items
- Landfall line only in its places: holds (flight legs, Your stay card, Good to know, S4T9LW, above totals in the Your stay card, Room details, guest summary, booking Payment).
- Teal fills, navy never fills a button: holds in navy (no glow or gradient seen; hover shadows not tested); fails in Harbour (issue 7).
- Price rule: holds on result cards, room cards, room dialog, guest summary; gaps in issues 5 and 6.
- Water-and-city photo in every slot: partial (issues 3 and 4).
- Placeholders marked: holds.

## Fixes from this pass, re-checked
Pinned search shows once: holds (but issue 1). Dateless compact bar: holds at 1440, 390 not checked. Footer photo at 390: holds. No-results panel without a stand-in: not checked.

## Not checked by the critic
No forms submitted (critic rules): sign-in, guest form to checkout and the stay confirmation, decline panels, contact errors. Not viewed: /login, /register, /forgot-password, /reset-password (and expired), the /bookings tabs, K7MQ2D, H2LNC7, /about, /contact, /terms, /privacy, the navy home, flight details, travelers, checkout, /confirmation/K7MQ2D, /emails; 390 for most pages other than hotel results and detail; the Harbour account page; hover and focus, skip link, reduced motion, the no-results panel, a site-wide copy-tell search; the rubric's per-row table. One screenshot landed at the studio root by mistake: h-results-1440-studio.png.
