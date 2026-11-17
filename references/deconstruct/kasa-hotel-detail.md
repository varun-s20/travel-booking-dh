# Deconstruction: Kasa hotel detail page (https://kasa.com/properties/kasa-magnificent-mile-chicago)
Scope: the property (hotel) detail page only. Measured: 2026-11-10, at 1440 (page height 9074) and 390 (page height 13005).

Path: kasa.com homepage, clicked the "Kasa Magnificent Mile Chicago" property card link (no search form used). The 390 pass loaded the same property URL directly. No popup, cookie banner or sheet blocked measurement, so none was dismissed. No dates picked, no filter or search submitted, no sign-in. The only clicks were the gallery opening (closed with Escape) and the policy accordion rows.
The 390 view is desktop Chromium resized to 390 wide, not a phone: hover rules still run and touch was not emulated.
Values are evidence for how the system is built, not for reuse. No code, images, text blocks or font files were saved. Screens are in `kasa/` next to this file.

Stack facts: Next.js 16.3.8 with SCSS CSS modules (class names like `RoomTypeCard-module-scss-module__...`). Swiper powers the image carousel inside each room card. The card rails and review rail use a custom native-scroll "Slider" (no library). The accordion is a Radix-style collapsible (`data-state="open|closed"`). Date picker is react-day-picker, toasts are sonner, the map is Google Maps. No GSAP, Lenis or Framer globals found.

## Layout
- Page ground rgb(247,246,242). Nav and cards sit on a lighter surface, rgb(253,252,251).
- Container 1248px wide at 1440 (x 96 to 1344). Headings and body text sit inside it with an extra 8px inset (text starts at x 104). At 390 the container is 326 wide (x 32 to 358) and text starts at x 40.
- Sections are stacked blocks separated by a 1px hairline across the container (top border), with large top and bottom padding (about 56 to 72px). No overlaps, no full-bleed color changes until the navy footer.
- Fixed layers: navbar 66px tall (z 10), the search bar layer (z 11, 80px tall at 1440 below the nav, 72 at 390), dialogs (backdrop navy 40%, z 50).
- Title block at 1440: H1 at y 192, meta row below, photo grid at y 305. Two-column row below the grid: Description (x 104, 560 wide) and Amenities (x 776, 560 wide), 112px gap.
- Policy section is two columns: two check-in/check-out cards (600 wide, x 96) and the accordion (584 wide, x 752), 56px gap. Everything else is full container width.

## Type (with the licence of each family)
Confirmed from the page's own `@font-face` declarations (names and file names only; nothing saved). Both families are self-hosted woff2 with an Arial local fallback.
- **Tiempos Headline** (Klim Type Foundry): **commercial**. One weight only (Regular 400), no italic. Used for: H1 property name; every section H2 ("Apartments (13)", "Highlights", "Important information", "Services", "Parking", "See what guests loved about their stay", "Location", "You may also like", the FAQ heading); the review score line ("10/10 Exceptional"); "Have a question?" in the footer; the "Gallery" dialog title.
- **TT Norms Pro** (TypeType): **commercial**. Regular 400, Medium 500 (Bold 700 is declared but was not loaded on this page). Used for everything else: nav, search fields, "Description" and "Amenities" headings, body, amenity labels, filter chips, room titles and spec lines, buttons, accordion titles, tags, review author and body.
- Roboto (free, Apache 2.0) and Google Sans / Google Sans Text (Google, proprietary, not for reuse) load only inside the Google Map.
- Letter spacing is `normal` everywhere. No uppercase, no tracking tricks. The hierarchy comes from the serif/sans pairing, not from case.

Measured at 1440 (390 in brackets), size / line height / weight, color rgb(6,19,50) unless noted:
- H1: Tiempos 40/50/400 (32/40).
- Section H2: Tiempos 32/40/400 (24/30). Footer H2 40/50 in off-white.
- "Description" and "Amenities" H2: TT Norms 20/30/500 (same at 390).
- Rating meta: "9.4 Excellent" 14/21/500 in green rgb(14,133,75); "5700 reviews" 14/21/400 at navy 80%; address 16/24/400.
- Description body: 16/24/400, clamped to 4 lines, then a "Read more" button (a tertiary button, see below) that opens a dialog.
- Amenity labels: 16/24/400 (they are H3 elements) beside a 20px line icon in navy 80%.
- Room card title 18/27/500; spec line 14/21/400 at navy 80%.
- Accordion title 18/27/500; panel text 16/24/400.
- Check-in card: H3 18/27/500, time 16/24/400, "Planning to arrive early?" 16/24/500, sub text 14/21/400 at navy 80%.
- Tags and review meta: 14/21/500. Review body 16/24/400. Review "Read more" 18/27/500 underlined.
- Buttons: 16/24/500. Primary button text rgb(253,252,251) on navy.

Amenities (1440): a wrapping flex row, 24px gap, icon + label per item with 12px gap between them, three items on the first line and wrapping after. Eight items are shown, then a "View amenity details" button (42px tall) opens a dialog with the full list. No columns, no divider lines. At 390 the same row wraps to two items per line.

## Color system
- Ground rgb(247,246,242); surface rgb(253,252,251); text and primary action navy rgb(6,19,50). Navy at alpha is the whole secondary system: 0.8 for secondary text and icons, 0.6 for inactive tabs and the disabled-looking previous arrow, 0.2 for the search-card border, 0.1 for card borders and hairlines, 0.05 for chip, tag and secondary button fills.
- One accent: green rgb(14,133,75), used only for the review score. Call to action is the solid navy button ("Check availability", "Search"). No orange or other accent.
- Overlay chip on photos: navy at 0.4 with a 6px backdrop blur.
- Cards: surface fill, 0.8px navy-10% border (room cards) or no border (check-in cards, review cards), and a very soft long shadow: `0 14px 16px -2px rgba(0,0,0,0.03)`.

## Motion
Computed values and observed Web Animations. Durations in ms.
- Navbar hide/show: transform translateY(-100%) to 0, 400ms, `cubic-bezier(0.34, 1.2, 0.64, 1)` (a slight overshoot). Background and shadow 250ms.
- Search bar layer: transform 400ms same overshoot curve; height, padding, width, margin and opacity 200ms `ease`.
- Search fields: height 200ms, background 150ms ease-in-out, border-color 50ms; Search button width, height and colors 200ms.
- Heading word reveal (all section H2s): each word starts at `opacity 0, filter blur(8px), translateY(8px)` and animates to rest over 600ms `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). Words are `inline-block` spans, staggered. Driven by script (inline styles plus Web Animations), triggered as the heading enters the viewport.
- Body-copy reveal (promo blocks lower on the page, "RichTextReveal"): word mode, 600ms same expo-out curve, blur 8px, per-word stagger about 38 to 50ms; block mode: rise of 16px.
- Room-card image arrows: opacity 0 to 1, `transition 0.05s ease-out` (computed). Card border-color 150ms ease-out.
- Accordion open/close: panel height 200ms `ease-out`, both directions (one Web Animation recorded, 200ms, ease-out). The row's bottom padding also drops from 24 to 12 when open, so the row shortens from 75 to 63px before the panel grows. Plus swaps to minus. Opening one row closes the other (single open, tested at 390).
- Slider rails: `scroll-behavior: smooth` (only under `prefers-reduced-motion: no-preference`), no scroll-snap, hidden scrollbar. Edge fade via CSS custom properties `--scroll-fade-start/end` transitioning 200ms.
- Swiper dots in room cards: dynamic bullets, 5px active dot, 3px and 2px neighbours, transform and left 200ms; the dot strip opacity 300ms.
- Photo grid: no hover effect at all (no zoom, dim or lift). Transition is `all` but nothing changes.
- Gallery dialog tiles show a "View image" label with a chevron at the bottom-left on hover.
- Map pins pop in with a scale/opacity keyframe (`PropertyPin-pop`). Skeleton loaders use a shimmer keyframe.
- Reduced motion: handled in many places. Text reveal collapses to opacity 1 with no animation; the search bar compact duration variable is set to 0s; skeleton shimmer, map pin pop, link-card image/arrow transitions are removed; smooth scrolling in rails only applies when no reduced-motion preference.

## Interactions
- **Pinned search bar.** `position: fixed`, always present on the property page. At the top (scrollY below about 60) it is the expanded bar under the navbar. Scrolling down hides the navbar and flips the bar to compact between scrollY 60 and 120. Any scroll up brings the navbar back and expands the bar again (verified with real wheel events, not only jumps). See Section anatomy for sizes.
- **Photo grid** is one big button ("Open gallery"): any photo opens a full-screen gallery dialog with a Tiempos "Gallery" title, a round close button, and photos grouped by headed categories (Featured, Important Information, and more), three tiles per row (408x272, 3:2, 12px gaps, rounded about 16). Escape closes it.
- **Room cards**: image arrows appear on hover; dots below the image; swipe enabled; "Check availability" opens the availability flow (not triggered).
- **Rails** (rooms, highlights, reviews, similar properties): native horizontal scroll, previous and next round buttons under the rail at the right edge of the container.
- **Accordion**: whole row is the click target (role button, tabindex 0).
- Read more (description, reviews, getting around) and View amenity details open dialogs rather than expanding in place.

## Section anatomy
**Section order at 1440** (y positions; same order at 390):
1. Navbar (66px) plus pinned search bar. y 0.
2. Title block: H1, then a meta line (rating, review count, map-pin address link). y 192.
3. Photo grid. y 305 to 717.
4. Description (left) and Amenities (right). y 741.
5. "Apartments (13)": filter chips, then room cards rail. y 1037.
6. "Highlights": photo rail (400x267 images, radius 16, 16px gaps). y 1699.
7. Tabbed promo (Groups & Events, Extended Stay, Business Travel): text left, photo right. y 2172.
8. "Important information": check-in and check-out cards left, six-row accordion right (Self check-in, Arrival & access, On-site and 24/7 virtual support, Luggage storage, Damage coverage, Accessibility). y 2628.
9. "Services": small cards (Animal companion, Early check-in, Late check-out). y 3250.
10. "Parking": one statement card, "No Kasa parking at this property". y 3616.
11. "See what guests loved about their stay": rating line and the review rail. y 3930.
12. "Location": Google map 1248x624, then "Getting around" and "Location highlights" columns. y 4636.
13. "You may also like": three similar-property cards. y 5799.
14. FAQ: heading left, seven accordion rows right. y 6545.
15. Navy footer ("Have a question?" and link columns). y 7316.

**1. Photo grid (1440):** one CSS grid, columns 616px 308px 308px, rows 202px 202px, gap 8px, total 1248x412. One large photo (616x412, spans both rows) at left and a 2x2 of 308x202 at right. The container has `border-radius: 16px; overflow: hidden`, and the four outer corners are rounded; inner photo corners are square (the 8px gaps carry the page ground). Five photos only on the page (the gallery holds 180). "View all" control: a "+180 photos" chip with a small image icon, bottom-right of the last tile, 16px inset from the right and bottom, 121x39, navy at 40% with 6px backdrop blur, radius 8, padding 8 12, 14/21/400 off-white text. It is part of the clickable grid, not a separate button.
**At 390:** the grid becomes 4 columns of 75.6px and two rows (217.6px and 75.6px), gap 8: one wide photo (326x218) on top and four square thumbnails (76x76) in a row beneath. Same 16px outer radius. The chip shrinks to icon plus "+180" (66x31), sitting on the last thumbnail.

**2. Title block:** H1 on its own line, 0 margin, then a flex meta row with 12px column gap and 4px row gap: green score plus bullet plus review count (links to the reviews section), then the map-pin icon and street address (links out to Google Maps). At 390 the address wraps onto its own line.

**3. Description and Amenities:** two columns each with a 20px/500 H2, body below, and a 42px secondary button ("Read more", "View amenity details": navy 5% fill, radius 8, padding 8 16, 16/500). Amenities are icon plus label inline, wrapping.

**4. Room cards:** filter row first: five chips, each 42px tall, radius 8, navy 5% fill, padding 8 16, 16/500, 12px gap, leading line icon (Dates; 1 guest; Lowest rate; Filters; Any number of apartments). 16px below the H2. At 390 the row scrolls sideways and the last chip is cut off by the fade. Cards sit in a native-scroll rail (track gap 16px, left padding aligned to the container, cards bleed off the right edge). 13 cards, each 360 wide by 396 tall (326 by 399 at 390, one card and a peek of the next). Card anatomy, top to bottom:
- outer: radius 16, 0.8px navy-10% border, surface fill, soft shadow, 8px padding, overflow hidden.
- image slider: 342x228 at 3:2, Swiper, up to 10 photos per room, lazy loaded (only the first two slides have an image in the DOM). Dots at the bottom centre, 5px active.
- arrows: 32x32 round (radius 16), surface fill, shadow `0 6px 8px rgba(0,0,0,0.05)`, 8px inset from the left and right edges, vertically centred. Visible on hover only (see the default/hover pair). On the desktop-Chromium 390 run they stayed at opacity 0; on a real touch device the carousel is swipe-driven.
- header: 16px side padding, title (18/500) then spec line (14/400, navy 80%) with two 16px line icons: guests and bathroom, 4px between lines.
- divider: 1px hairline inset 4px.
- button: "Check availability", full width (326x42), navy fill, radius 8, 16/500 off-white. Same button on every card.
- no price on the card without dates (see Not measured). The card carries no badge or rating.
Rail controls: previous and next, 40x40 round (radius 24), navy 10% and 5% fills, 24px under the cards, right-aligned to the container edge. Previous is at 0.4 opacity at the start.
Default and hover pair: `kasa/kasa-1440-rooms-default.png` and `kasa/kasa-1440-rooms-hover.png`. The only change is the two arrows appearing; the card does not lift, scale or change shadow.

**5. Pinned compact search bar:**
- Expanded (1440, scrollY near 0): bar layer 80px tall at y 63 under the navbar; the card is 916x60, centred (x 262 to 1178), padding 5, radius 16, 0.8px navy-20% border, soft shadow. Fields 48px tall: location input 196 wide (map-pin icon, text, input padding 8 12 8 35), Dates 196, "Rooms & guests" 204, "Lowest rate" 196, then a navy Search button 108x48 with a magnifier and label. Fields are separated by hairline dividers, 16/400 text, icons 20px.
- Compact (after scrolling down): the navbar slides away and the card becomes 852x52 at x 294 to 1146, y 24, radius 12, shadow `0 6px 4px rgba(0,0,0,0.03)`, same four field slots, and the Search button collapses to a bare magnifier icon at the right end. The bar floats over the page content with no full-width background strip.
- Opening any field opens its popover (dates, rooms and guests with steppers for bedrooms, adults, children, infants, special rate). Not opened.
- At 390: a single pill, 342x52 (x 24), radius 12, showing only "Chicago, IL" with a magnifier on the right. It is a trigger button for a search popup, so the other fields live behind it. Expanded state is that pill below a 66px navbar (bar layer 72px); once scrolled it floats at y 24 and the navbar is hidden. See `kasa/kasa-390-pinbar-compact.png`, `kasa/kasa-390-pinbar-scrollup.png`.
- Timing and threshold: see Motion and Interactions.

**6. Policy accordion:** six rows in a 584px column. Each row: 0.8px navy-10% bottom hairline only (no card, no side borders), trigger padding 24px 8px, flex space-between with 16px gap, so the closed row is 75px plus the 1px line. Left: 20px topic line icon, 16px gap, title 18/500/27. Right: a 16px plus icon (minus when open). Panel text sits under the title, indented to the title edge (about 44px), 16/24, paragraphs 12px apart, 24px bottom padding. Check-in and check-out sit beside it as two 600x98 cards (surface fill, radius 16, shadow `0 12px 20px -2px rgba(0,0,0,0.03)`, padding 16): a left block with title and time, a vertical hairline, and a right block with the "early arrival" question and a 14px explanation. At 390 the cards stack in full width (326x203 each), the card interior becomes a column (title, time, hairline, question, text), and the accordion follows at 310 wide with the same 75px rows. The same accordion component powers the FAQ near the bottom (heading left, 7 rows right at 1440). See `kasa/kasa-1440-policy-default.png`, `kasa/kasa-1440-policy-open.png`, `kasa/kasa-390-policy.png`.

**7. Review cards with a source badge:** cards sit in a rail, 360x360 at 1440 (300x345 at 390), 16px gaps, radius 16, surface fill, no border, soft shadow, padding 24 32, 24px gap between blocks. Anatomy: header row with author and date on the left ("Name • Mon D, YYYY", 14/500 at navy 80%) and a source badge on the right; below it a score line with a filled star (24px) and "10/10 Exceptional" in Tiempos 24/30; then the review text clamped to six lines, 16/24; then an underlined "Read more" (18/500) that opens a dialog. The badge is a pill: 14/21/500, navy 5% fill, 0.8px navy-10% border, radius 16, padding 4 8, text only, no logo ("Airbnb", "Google Business" seen). Above the rail: "9.4 Excellent • 5700 reviews" with a green score. Below it: a "View all 5700 reviews" secondary button at the left and previous/next arrows at the right. Flaw worth noting: when an author name wraps to two lines the whole card body shifts down about 11px, so the score lines across cards do not align. See `kasa/kasa-1440-reviews.png`, `kasa/kasa-390-reviews.png`.

## Signature techniques (3 to 5, rebuildable from scratch)
1. **The scroll-aware search bar.** One fixed layer holds the navbar and a search card. Track scroll direction. Down past about 60 to 120px: translate the navbar up by its height and shrink the card (916x60 radius 16 to 852x52 radius 12, Search button to an icon) and move it to top 24px. Up: reverse. Container transform runs 400ms with `cubic-bezier(0.34, 1.2, 0.64, 1)` so it settles with a small overshoot; the size changes run 200ms ease; a CSS variable for the compact duration is set to 0s under reduced motion. At 390 swap the four-field card for a one-field pill that opens a popup. This keeps booking one gesture away at every depth of a long page.
2. **The 5-up photo grid as one button.** A fixed-track CSS grid (616 / 308 / 308 columns, 202 rows, 8px gaps) in a container with 16px radius and `overflow: hidden`, so only the outer corners round. The whole grid opens a full-screen gallery dialog grouped by category. A dark blurred "+N photos" chip is the only control. At 390 re-template to a wide image over four square thumbs. No hover effect, which keeps it calm.
3. **Room cards that behave like listings.** A native-scroll rail (gap 16, container-aligned left padding, cards bleeding off the right, hidden scrollbar, smooth scroll, edge fade via custom properties) of bordered, softly shadowed cards. Each has its own 3:2 Swiper with lazy slides, tiny dynamic dots, and 32px round arrows that fade in on hover only. Below sits a two-line header, a hairline and one full-width navy button. Filters above are quiet 42px chips. Price waits for dates, so the card stays uniform.
4. **Serif and sans as the only hierarchy.** Tiempos Regular for H1, H2s and the review score; TT Norms 400 and 500 for all else; no tracking, no uppercase, no eyebrows on this page. Navy at five alpha levels is the entire secondary palette, with one green for the score. The calm comes from restraint and the 16px radius used everywhere.
5. **Word-level blur reveal on headings.** Split each H2 into inline-block word spans, start them at opacity 0, blur 8px, translateY 8px, and release them on viewport entry over 600ms `cubic-bezier(0.16, 1, 0.3, 1)` with a short stagger. Disable under `prefers-reduced-motion`. Combined with the hairline-separated sections, the page reads as paced rather than animated.
(Also worth lifting: the hairline-only accordion with a 200ms ease-out height animation, single-open, topic icon at left, plus/minus at right.)

## Not measured
- Room price, rate display and the "Check availability" result: needs dates. I did not pick dates or open the date picker. The similar-properties cards show "Add dates for prices" without dates, so price styling is unseen.
- The Dates, guests, special-rate and Filters popovers and dialogs (contents, sizes, motion); the amenity-details dialog; the Read more dialogs; the single-image view inside the gallery.
- Whether the arrow reveal uses a parent hover class: the computed opacity read 0 right after hovering, though the screenshot clearly shows the arrows. Transition read as 0.05s ease-out.
- True touch behavior at 390 (swipe, tap target, bar popup); the 390 nav menu.
- Image radius inside the room card cover (the cover wrapper reads 0 and the slider clips it; the screenshot shows rounded corners, size not read). Gallery tile radius also read from the screenshot only.
- Scroll trigger offset for the word reveal (initial hidden state and the 600ms animation were read; exact threshold not measured) and whether it replays on scroll up.
- Highlights rail and the tabbed promo (tab switching motion), Services card details, Parking card, Location map controls and the map-pin interaction, FAQ copy, and the footer.
- Other property types: this page is an apartment-hotel with unit types; a conventional hotel with room types and bed types may differ.
- Cookie and consent UI: none appeared.

## Differences from Hipcamp's listing detail
(Hipcamp values taken from hipcamp.md, not re-measured.)
- Page structure: Hipcamp pins a 392px sticky booking card on the right and runs a sticky tab bar; Kasa has no booking card and one full-width column. Booking is carried by the fixed search bar and per-room buttons.
- Gallery: Hipcamp 1232x508 with 24 outer / 16 inner radii and a story-style progress bar; Kasa 1248x412, 16px outer only, square inner, no overlays except one chip.
- Type: Hipcamp's listing H1 is Calibre 48/700; Kasa's is a Tiempos serif at 40/400 with TT Norms for the rest. Kasa has no heavy weights (400 and 500 only).
- Accordion: Kasa's rows are bare with a hairline, a topic icon and plus/minus, single-open, 200ms ease-out height.
- Reviews: Kasa shows a rail of six-line-clamp cards with source badges and a "10/10" score in the serif; Hipcamp shows proportion bars, themes chips, search, an AI summary and avatar cards.
- Motion: Kasa uses a spring-overshoot navbar and search bar, word-blur heading reveals, no hover effect on the photo grid and a 0.05s arrow reveal on room cards. Hipcamp had no animation library, and its gallery has a progress bar that Kasa lacks.
