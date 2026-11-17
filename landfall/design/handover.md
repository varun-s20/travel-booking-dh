# travel-booking, Landfall: art direction handover
Art Director, 2026-11-11. For the Developer (Landfall build) and for Varun to review.

## Palette distinctness (2026-11-11): supersedes the palette "Watch" notes below
Landfall's navy palette was revised so it shares neither shades nor roles with Overwing: teal fills every call to action and selection (ink label), and navy is indigo #1B2A6E for type, links, focus and the destination cards. Chief Officer: APPROVED WITH NOTES. Values, measurements and notes are in choices.md under "Palette distinctness". Harbour is unchanged.

## Checkpoint 2b: APPROVED WITH NOTES (Chief Officer, first call; details in choices.md)
- Note 1 (docked compact bar hidden under the header's white strip at 1440): fixed after the call; the bar sits at 74px and takes clicks at 1440 and 1024.
- Note 2 (390 Search button ending 7px below the 844 fold): fixed after the call; it ends at 821px in both palettes.
- Note 3 for the build: carry the landfall line and the price-first arrival idea visibly through result rows, the itinerary timeline, booking totals and confirmation, and have the Developer's first Critic check re-score the home hero at 1440 and 390 (the post-critic fixes were never re-scored).
- Watch: Landfall's navy and teal sit close to Overwing's new navy palette (#0F2747 and #0D2B4C, #0A7C78 and #086F76, #4FD1C1 and #6FD6CE). The Chief Officer accepted this; the two designs must never share components.

## What is ready
- landfall/design/concepts.md: the concept, the section-by-section rebuild, type options and palettes (phase A).
- landfall/design/choices.md: the Chief Officer's choices at 2a (and 2b), for Varun to review.
- landfall/design/design-spec.md: every page and state in the scope, mobile first-class, conflicts and decisions.
- landfall/design/tokens.css: P-N Landfall navy (default) and P-H Harbour gold (alternate) as swappable role sets, type, space, radii, shadows, easings, durations.
- landfall/prototype/: index.html (header, menu sheet, hero with the working search card and panels, pinned compact search, destinations band), assets/global.css (tokens pasted in), assets/global.js, assets/fonts (Newsreader and Albert Sans, SIL OFL, licence files beside them), assets/images (9 Unsplash License photos, credits.md), tools/ (images.py, palette.py). ?palette=harbour switches palette.
- landfall/prototype/audition.html: the phase A type and palette auditions.
- landfall/references/deconstruct/kasa.md and european-sleeper.md (new), plus references/deconstruct/kasa-hotel-detail.md (extended in kasa.md).

## Critic (one round, as briefed: one strong round over several)
Round 1, nav and hero at 1440 and 390 (plus 768, 1024, 1100), both palettes: **6.25 FAIL**. Design 7, originality 6, craft 5 (overlaps), functionality 7. No design tells, no copy tells. Text over every photo passed its own measurement. Originality 6 because the layout is the familiar travel hero; the fare caption and the landfall line were the only parts it found specific to this concept.

All ten issues were fixed after the round and checked by me in the browser at 1440, 1024, 768 and 390 (not re-scored by the critic):
1. Search card covering the 390 menu sheet: the card takes the sheet layer only while one of its own sheets is open. Fixed, checked.
2. Header invisible over the white card on phones: the header turns solid the moment it leaves the photo; caption, pause and tabs fade before they reach it. Fixed, checked.
3. Header and docked bar colliding with the caption, pause and the destinations H2 at 1440: the compact bar now appears only after the photo has gone, docks under the header with a white strip behind it, and the caption and pause fade before anything covers them. Fixed, checked.
4. Validation message unreadable on the photo and off-screen at 390: a white chip with a red dot under the card at 1440; at 390 the missing field's sheet opens. Fixed, checked.
5. Half-empty Travelers and Rooms panels, "Premium economy" wrapping: Travelers in two columns (steppers, cabin class), Rooms as one row of three, cabin options one per row at 390. Fixed, checked.
6. Keyboard order and focus: caption and pause moved after the card in DOM order, Swap moved between From and To, focus goes into each opened panel (the dates panel focuses the picked or first open day), the calendar has one tab stop with arrow keys, the compact bar moves focus before it hides, place search resets on reopen. Fixed, checked with the keyboard at 1440.
7. UI covering the photo at 390: the caption is one line (route and fare, arrow button) beside the pause button. Improved; the tabs pill and caption still sit on the lower photo by design.
8. Stretched phone layout on tablets: a two-column card from 641 to 1024. Fixed, checked at 768.
9. Copy slips: caption reads "London to Lisbon, return from $412"; the status says "one-way" instead of leaking the hint; a mid-swap click fills the city the caption shows. Fixed.
10. Smaller slips: hero sizes now fetch a wide enough file for tall viewports; the New York focal point keeps the spire off the subline; Sign in no longer pushes My bookings on hover; Search hover tints toward teal instead of grey; inactive tab opacity .92; Swap has a 44px hit area. Fixed.

Text over photos (my measurement after the fixes, 2nd percentile behind each block, all three photos, 390, 1024, 1440): headline 7.3 or more, subline 5.7 or more, tabs 4.9 or more, caption 5.1 or more. Darkest single pixels: New York subline 3.9 at 1440 (the spire), Lisbon caption place name 4.4 at 1440.

## What is left
- Originality: the critic's 6 was about the familiar layout. The answer in the spec is to carry the image rule, the price-first caption, the landfall line and Kasa's price block through every page; the build has to prove it page by page.
- Not re-scored: the fixes were checked by me, not by a second critic round.
- Not checked: real touch devices, DPR 2 and 3 sharpness, Safari and Firefox, screen reader output, the 390 compact pill in normal use (the prototype page is short; the critic saw it work with a spacer).
- The home page below the destinations band (promo rows, pre-footer, footer) is specified, not built.
- Photos still to source for the build are listed in spec section 7.
- Overwing's new navy palette did not exist when Landfall's was set in phase A; it now sits close to Landfall's in value (see 2b above). Accepted by the Chief Officer; distinctness rests on concept, layout, type, photos and components.

## Decisions for Varun (up to 5)
1. Serif headings (T1, the Chief Officer's choice) or Albert Sans only (T2), if the client reads "a clean, readable font" literally.
2. The hero caption's fare is from London (the mock origin): follow the visitor's last origin in the app, or drop it if the client sells from many origins.
3. Keep the New York hero (1.5x source at 1440) or replace it.
4. Three crossfading cities (Kasa's signature) or one calmer photo.
5. Show struck-through "was" prices and scarcity lines when Duffel sends them, or never.
