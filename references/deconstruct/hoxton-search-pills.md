# Deconstruction: The Hoxton (https://thehoxton.com)
Scope: two sections only. (a) hotel search bar docked on the hero's lower edge, (b) region filter pills (Europe, UK & Ireland, USA, All). Measured: 2026-11-10, at 1440 and 390 (plus 768 for the pills). Desktop Chromium, so the 390 run is a narrow desktop window, not a touch phone (hover media queries still run).
Screenshots: `hoxton/` next to this file. Popups: on load at 1440 a cookie banner and a newsletter popup covered the hero and blocked the clean captures. I closed both with their X buttons (no Accept, no sign-up) before every 1440 capture. `hoxton-1440-first.png` is the first screen as loaded, with both showing. At 390 neither appeared.
Method notes: scrollbar hidden, mouse parked in a corner, nothing submitted, no dates picked, no booking started.

## Layout

**Search bar, 1440**
- One white strip, 1280 x 72, x 80 to 1360, centered, square corners (radius 0), no shadow, no outer border. Five equal cells of 256 x 72: Location, Check in / Check out, Guests, Got a code?, then the button. No gaps, so it reads as one bar. Cells are 256 wide, so with the code field the bar is 5 cells.
- How it docks: the hero video sits at x 20 to 1405, y 150 to 800 (an inset video block, 20px left, 35px right, no radius). The bar top is at y 770, so it overlaps the hero by 30px and hangs 42px below it onto the cream page ground. The wrapper has `margin-top: -50px` and 0 48px padding; the visible overlap is 30px because the hero block ends 20px above the wrapper's natural start. The bar is inset 60px from the video's left edge, not aligned to it.
- Dividers: the three field cells have a 0.8px right border in warm beige rgb(219,201,178). The code cell has none, and the button needs none. No other border on the bar.
- Cell anatomy (72px tall): label absolute at top 18px, left 15px, 11px line. Value block padding 34px top, 15px sides, 14px bottom, line 24px. The whole cell is the click target.
- Guests cell has an "EDIT" text control at the right (41 x 39 hit area, label style, 15px right inset).
- Button: 256 x 72, fill rgb(255,146,114) (salmon), radius 0, padding 8px 16px, label centered.
- "Got a code?" (ignore, size only): a 256 x 72 cell identical to the other fields; 68px tall at 390.
- A second compact search strip ("Select Location" + FIND A ROOM) lives in the sticky header. Out of scope, not measured.

**Search bar, 390 (stack breakpoint is about 900px; at 768 it is already stacked)**
- Wrapper padding 0 32px, margin-top -50px. The stack is 326 wide at x 32, starting at y 345 inside a hero that ends at y 395 (hero 100 to 395), so it overlaps the hero by 50px and the rest hangs on the cream ground (stack ends y 705).
- Four separate white blocks, no divider lines, **4px vertical gap**: Location 72 high, Check in / out 72, Guests 72, Got a code? 68. The button follows after the same 4px, full width (326 x 60), padding 20px 32px, same salmon fill, radius 0.
- Label placement is the same as desktop (top-left, 15px in), "EDIT" stays at the right of the Guests block.

**Region pills**
- Section sits below a "Trending destinations" carousel. A flex row (`space-between`, gap 28): heading "Explore all our Hotel locations" (GT America Extended Regular 40/48, dark) on the left at x 60, pill group on the right, x 789 to 1380 (591 wide), vertically at the heading's top. Pills are not centered and have no label.
- Four pills, 8px apart, 40 high: Europe 144.3, UK & Ireland 194.7, USA 112.5, All 109.3 wide. Widths come from text plus 40px side padding. The group's right edge is 60px from the viewport edge.
- 390: **the whole section is `display: none` below 768px** (class `hide-on-mobile`, shown from `min-width: 768px`). There is no scroll row, wrap or select at 390; the filter simply does not exist on mobile. The regions appear only as text links in the hamburger menu (`sub-nav-btn`, not measured further).
- 768: the section shows but the pills overflow past the right edge (the filter group collapses to 0 width and the pills run off to x 1308 in a 768 window). Looks like an unfixed bug, so do not copy the breakpoint behavior.

## Type (with the licence of each family)

All search and pill text is **GT America** (Grilli Type), **commercial**. Loaded faces on the page: Thin, Light, Regular, Medium, Extended, Extended Regular, each a separate family name (no variable file). Tiempos Fine (Klim, **commercial**) is declared but was never loaded on the home page, and nothing in these two sections uses it.

| Role | Family | Size / line | Weight | Case, tracking | Color |
|---|---|---|---|---|---|
| Search field label | GT America Medium (not Extended) | 9px, normal line (11.2px box) | 400 in the CSS (the Medium face carries the weight) | uppercase, 1.5px | rgb(62,58,55) |
| Search value and placeholder | GT America **Extended** Regular | 16 / 24px | 400 | sentence case, normal | rgb(153,153,153) for both placeholder and the default "1 room, 2 Guests" |
| "Edit" control | GT America Medium | 9px, 1.5px, uppercase | 400 | | rgb(62,58,55) |
| Search button label | GT America Extended | 16px | 700 requested; the loaded face is registered at normal, so this may be a synthetic bold. Not confirmed. | sentence case, normal | rgb(127,32,6) (deep rust) |
| Location list rows | GT America Light | 16px | 300 | sentence case | rgb(62,58,55); header row rgb(153,153,153) |
| Calendar | GT America Light | month title 16, weekdays 10, day numbers 16 | 300 | | text rgb(62,58,55); weekdays black; past days gray |
| Pills | GT America Light | 13.33px / 16px | 300 | uppercase, 2px | rgb(62,58,55) default, rgb(254,242,227) filled |

Answer to the Extended question: **the labels do not use the Extended width** (they are GT America Medium at 9px with wide tracking). The Extended width is used for the field values, the button label and the section heading. So the labelled-field look is: tiny tracked Medium caps over a wide, light-gray Extended value.

## Color system
Evidence only.
- Ground: warm cream rgb(254,242,227) for the page, the guests drawer and the pill row. Fields are pure white rgb(255,255,255), so white cells pop off the cream and the dark hero.
- Text: warm dark brown-black rgb(62,58,55). Placeholder gray rgb(153,153,153). Dividers and list/calendar borders warm beige rgb(219,201,178); stepper borders gray rgb(196,196,196).
- Call to action: salmon rgb(255,146,114) fill with rust rgb(127,32,6) text. Hover swaps them (rust fill, salmon text). Inside the guests drawer the CTA is the dark brown (62,58,55) with white text, one step quieter.
- Pills: dark brown fill with cream text when active or hovered; cream fill with dark text and a faint dark outline otherwise.
- Drawer scrim rgba(0,0,0,0.8).

## Motion
- Bar load: no entrance animation. The bar carries a `reveal-item` class but never animated or changed opacity in an 8-sample check over 2 seconds.
- Search button hover: fill and text swap, `transition: all 0.5s ease`.
- Field hover: none. White cell stays white, no tint, no shadow.
- Location list and calendar open: instant (`0s`), no fade or slide, no shadow, no radius.
- Guests drawer: slides in from the right, panel `0.5s ease`, scrim `transform/opacity/background 0.6s ease`. Not interrupted or reversed in my test (closed with its X, hidden by 1s).
- Location list row hover: instant fill dark rgb(62,58,55), white text, cursor pointer.
- Calendar day hover: instant 1px dark outline box (about 46px square, 3px radius), no fill.
- Pills: hover and selected state change is **instant (0s)**. The declared `transition: all` has a 0s duration, and a sample 60ms after hover already showed the full dark fill. Dark fill is the whole effect; there is no slide, wipe or scale.
- Libraries: Swiper and jQuery on the page; hls.js for the hero video. Nothing in these two sections needs a library.
- Reduced motion: only WordPress core rules exist (parallax, lightbox, navigation menu, social links). No `prefers-reduced-motion` rule touches the booking drawer, the button hover or the pills.

## Interactions

**Search fields at 1440 (clicked, never submitted)**
- Location: `Find Location` opens a plain list that opens **upward** from the field. 257 wide x 500 tall (max-height 500, scrolls), x 80, bottom edge flush at the bar top (y 254 to 754, 16px above the bar's top edge at 770 is not used; it ends 16px above). White, 0.8px beige border, radius 0, no shadow. Rows 28px tall (padding 4px 8px), GT America Light 16. First row "Find Location" is a muted header; then 17+ hotel names (cities, with neighborhood after a comma). Hover fills the row dark with white text. Escape closes it. Capture: `hoxton-1440-location-open.png`, `hoxton-1440-location-item-hover.png`.
- Dates: opens a **single-column vertical scrolling calendar** upward from the field, x 336, 360 x 470, padding 10px, white, 0.8px beige border, radius 0, no shadow. Months stack vertically (about 338px wide each, month title 16 centered, weekday row 10px, day grid rows of about 53px). Past days gray, not clickable. Hover on a day gives a thin dark outline box. Not tested: selecting a range, the check-out step, any footer or confirm. Capture: `hoxton-1440-dates-open.png`, `hoxton-1440-dates-day-hover.png`.
- Guests: clicking the cell (or Edit) opens a **right-hand drawer**, not a popover: 376 wide, full viewport height, x 1064 to 1440, cream ground, over an 80% black scrim. Top: "MAKE A BOOKING" kicker and a close X; a tab row (Bedrooms, Meeting Rooms, Restaurants, out of scope); then the same fields restacked as bordered white boxes 344 x 56 each with label over value (label 9px, value 16, padding 24px 14px 8px) and a chevron at the right: Location, Check in / Check out, Rooms (a select), then "ROOM 1" with Adults and Children rows. Steppers are **square** 30 x 30 buttons with a 0.8px gray border and "-" / "+" glyphs; the minus is faded at 0. Then the code field and a dark full-width Find a Room button (344 x 56, radius 0) pinned to the drawer bottom. Capture: `hoxton-1440-guests-open.png`.
- 390: Dates opens an inline panel (326 x 470, absolute, white, same border) directly under the Dates block. Guests opens a full-screen sheet below the header with the same stacked layout as the drawer, and the header's FIND A ROOM button turns into "Close". Location: I clicked it at 390 and no list showed in the capture (`hoxton-390-location-open.png` shows the page unchanged), so that behavior is unknown.

**Focus**
- Fields, Edit control and button: browser-style outline, solid 2.4px green rgb(64,87,35), offset -0.8px (inside the box) on fields and 0 on the button. The Add Dates field showed `outline: none` on the first programmatic focus, so its ring is unconfirmed. Capture: `hoxton-1440-search-crop-focus.png`.
- Pills: same 2.4px green ring, following the pill's rounded shape, shown on keyboard focus (`hoxton-1440-pills-focus.png`). Focus ring color is unrelated to the palette.

**Pills**
- Single-select. Europe is pre-selected on load. Clicking USA moved the filled state to USA and cleared Europe (it filters the destination carousel below; I did not inspect the carousel). Hovering any other pill fills it dark at the same moment; hovering the selected pill changes nothing. Result: hovering and selecting look identical, so a hovered pill is indistinguishable from the active one at a glance. Mouse hover state is not tied to `aria-pressed` (no ARIA state attribute was present; only a class).

## Section anatomy
- Search bar, 1440: one 1280 x 72 white strip, four labelled cells then a salmon button, laid over the hero's bottom edge (30px in, 42px out). Fields are read-only selectors that open lists, a calendar or a drawer.
- Search bar, 390: the same four cells become four separate white blocks (4px gaps) and a full-width 60px button, starting 50px up inside the hero and hanging out below it.
- Region pills, 1440: heading left, four 40px outlined capsules right, same row, one filled.
- Region pills, 390: absent (hidden below 768).

Hipcamp comparison (what Hoxton adds): Hipcamp's pill is one 72px rounded capsule, 848 wide, single-line values, no labels, an orange round button, and rich popovers (24px radius, shadows, 12px below the pill, icon discs). Hoxton's bar is a flat, square, edge-to-edge strip of **separate labelled cells**; each cell shows label and value stacked in 72px; the popups are flat (no shadow, no radius, no motion) and open **upward**; the button is a full-height cell, not a floating disc; guests become a drawer, not a popover. The labelled cell is the part to borrow; the flat panels are not.

## Signature techniques
1. **Labelled-cell search strip docked on the hero edge.** One row of equal-width white cells (256 x 72), no gaps, 0.8px beige hairline between them, square corners. Inside each cell: a 9px uppercase label (Medium weight, 1.5px tracking) absolutely placed 18px from the top and 15px from the left, and a 16/24 value block padded 34px top / 15px sides so the value sits under the label. The whole strip is pulled up with a negative top margin so it straddles the bottom edge of the hero: about 30px over the image, 42px over the ground color. The white against both the dark image and the cream ground is the effect. The button is a same-size cell at the end, filled with the accent, swapping fill and text color on hover over 0.5s.
2. **Stack on mobile into separate blocks with a 4px gap.** Below about 900px the same cells become full-width white blocks 72px tall, 4px apart, ending in a full-width 60px accent button. The stack starts 50px inside the hero and keeps the same label placement, so the pattern survives with no redesign.
3. **Instant-fill capsule pills with a pseudo-element outline.** Capsule 40px tall, padding 10px 40px, radius 24, 13px uppercase light type with 2px tracking. The outline is not a border: it is an absolutely positioned `::before` with a 0.8px solid line in the text color at 25% opacity, which goes to 100% (cream, vanishing into the fill) on hover and selection while the background flips to dark and the text to cream. No transition at all. Row is right-aligned opposite a left heading, 8px gaps.
(Not a signature but useful: the guests drawer, a 376px full-height cream panel over an 80% scrim with a 0.5s slide, restacks the same labelled fields as bordered boxes with square steppers.)

## Not measured
- Selected values inside the cells (what a chosen location or date range looks like), the check-out step, range highlight, and the calendar's navigation or footer.
- The Location list at 390 (did not open in my click).
- Whether the button's 700 weight is a true bold or faux bold.
- Hover state of the Guests cell and Edit control (no change seen on the field itself; Edit not hover-tested).
- Easing/timings of the pill filter result animation (the carousel below).
- Real touch behavior at 390 (desktop Chromium; no touch emulation).
- Pills at 768: only measured, no clean capture. `hoxton-768-pills.png` was scrolled to the wrong place and does not show them; `hoxton-390-pills-default.png` does not show pills because the section is hidden at 390.
- Reduced motion was checked by reading the stylesheets, not by emulating the setting.
- The header's compact search strip and the promo code logic (out of scope).

## Correction (added by the Art Director from the deconstructor's hand-back, 2026-11-10)
- The Location list sits 16px above the bar's top edge (list y 254 to 754, bar top at 770). It is not flush with the bar, whatever the Interactions line says.
- hoxton-768-pills.png was scrolled to the wrong place, and hoxton-390-pills-default.png shows no pills because the section is hidden below 768. The clean pill pair is hoxton-1440-pills-default.png and hoxton-1440-pills-hover-uk.png.
