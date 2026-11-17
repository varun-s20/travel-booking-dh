# Deconstruction: European Sleeper (https://www.europeansleeper.eu)
Scope: section donor for Landfall. Four named items only: (1) price-led destination cards, (2) how bands meet, (3) hero lower edge and docked search bar, (4) trust footer. Measured: 2026-11-11, at 1440 and 390, homepage only.
Method: computed styles and bounding boxes read from the live DOM in desktop Chromium. Nothing of the site's code, images, text blocks or font files was saved. The cookie banner was dismissed with DECLINE and the 390 newsletter popup with its close button only. No form was submitted, no ticket shop opened.
Warning: the 390 pass is desktop Chromium resized to 390 wide. It is not a phone. Hover media queries still match (`(hover:hover)` was true) and mouse-only scripts still run. No touch behaviour was tested.
Screenshots: `european-sleeper/european-sleeper-<viewport>-<section>.png` next to this file. Two caveats: `...-1440-hero.png` was taken with the cookie banner still showing (the first-load state); `...-1440-destinations-hover-150ms.png` is a stray early capture at a different scroll offset, ignore it. Use `...-1440-destinations-default.png` and `...-1440-destinations-hover.png` as the pair.

## Layout
- Page is short: 4865px tall at 1440, 7164px at 390. Nine stacked full-width `<section>` bands inside `<main>`, then a footer. The `main` ground is lavender (rgb 205,196,225).
- Container: `max-width 1152px` (72rem), centred, 0 side padding, so content sits x144 to x1296 at 1440. At 390 the container is full width minus 16px each side (358 wide). The footer uses a wider 1408px wrapper (16px side padding at 1440).
- Section vertical padding: 48px top and bottom at 1440, 32px at 390. A few bands set top padding to 0 so the previous band's content leads in.
- Corner radius scale: bands 64px at 1440, 32px at 390. Cards and search bar 24px. Buttons 16px. Header nav pill fully round.
- Header: fixed, 116px tall and transparent over the hero at the top, turns solid dark aubergine and 84px tall once scrolled (1440). At 390 it is a fixed solid 80px bar with a white rounded-square menu button.

## Type (with the licence of each family)
- Body and UI family: "GT Ultra" (Grilli Type). Licence: commercial. Fallback is a system sans stack.
- Display and card-title family: "Ambit". Licence: commercial (I believe Blaze Type; foundry not confirmed from the page). Fallback is a serif stack, so a failed load would swap to Georgia style type.
- Section heading ("Popular destinations"): GT Ultra 36px / 48px line, weight 400, normal tracking, sentence case, dark aubergine (rgb 64,0,44). 28px / 30px at 390.
- Card title: Ambit 24px / 24px line, weight 600, white, sentence case, single line with ellipsis.
- Card price line: GT Ultra 16px / 24px line, weight 300, colour rgb 230,230,230 on the dark card. It is one text run: the word "From" (capitalised), then a euro sign directly before the figure with no space, then the figure with a comma decimal. Same size, weight and colour throughout: no size jump, no bold figure, ordinary proportional figures (font-variant-numeric normal). The price is a quiet caption under the title, not a headline. Two price levels appear across the five cards.
- Search bar labels: 14px / 24px, weight 400, muted lavender-grey rgb 170,156,194. Values: 16px / 24px, weight 400, dark aubergine. The "view routes" helper link is 14px weight 600, underlined, same muted colour. Empty values ("(none)") use the muted colour.
- Search button: GT Ultra 16px, weight 300, white on shock orange (rgb 255,54,0), sentence case, normal tracking. Other CTAs on the page are uppercase.
- Footer big heading: Ambit 42px / 48px (shown as 96px tall, two lines), weight 600, white on lavender (low contrast).
- Footer column headings: GT Ultra 24px / 32px, weight 400, dark aubergine. Footer links and legal line: 16px, weight 300 (legal line muted light-aubergine rgb 134,98,134, "Legal notices" link dark).
- USP strip under the search bar: about 16px GT Ultra, dark aubergine, with a small outline icon before each phrase.

## Color system
Evidence only, not for reuse.
- Grounds: lavender rgb 205,196,225 (page and most bands), light blue rgb 166,193,221 (the strip carrying the search bar, and the newsletter card), light aubergine rgb 134,98,134 (experience band), dark aubergine rgb 64,0,44 (cards, scrolled header, mission and newsletter bands, text on light bands).
- Text: dark aubergine on lavender and blue; white on dark aubergine and on the hero; muted lavender-grey rgb 170,156,194 for form labels.
- Accent: one hot orange-red, rgb 255,54,0, used for every call to action, the card arrow, the active nav tick and the social icons. Nothing else is saturated apart from photographs.
- Pattern: cool pastel grounds with a deep plum as the "ink and card" colour, and a single hot accent for action. The dark plum cards pop on the pastel lavender.

## Motion
- Card hover (captured pair): the photo scales to 1.1 (`transform: scale(1.1)`) with `transition: transform 0.5s` and the default `ease` timing function. The photo sits in a wrapper with `overflow:hidden` and radius 24px, so the zoom is clipped by the rounded top corners. Nothing else changes: card background, shadow, card position, title and arrow all stay as they were (arrow has transition 0s and no transform). The card is a whole-card link (an anchor with `position:absolute; inset:0`), cursor pointer. No lift, no shadow.
- Button hover: a 150ms ease-in background change to a darker orange (class names `duration-150 ease-in hover:bg-darker-shock-orange`).
- Hero: a full-bleed background `<video>` (muted, autoplaying) 1440 wide and 810 tall inside a 500px hero, positioned about 155px above the hero top. That oversize suggests a parallax or scroll-linked shift; I did not measure the scroll behaviour.
- Header changes from transparent 116px to solid 84px on scroll.
- Newsletter popup appears on first load at 390 (class `popup show`) and is closed with a lavender square close button top right. Entrance animation not measured.
- Libraries: looks like a React app with Tailwind style utility classes; no animation library identified. Reduced-motion handling: not checked.

## Interactions
- Destination cards: whole card is the link. No rail, no scroller, no pagination (the orange arrow inside each card is a link affordance only).
- Search widget (an embedded booking widget, `es-widget`): departure and arrival station pickers, a swap arrow between them, outward date, optional return date, and a "Travel group" popover with plus and minus steppers (adults, children, pets, bikes). I did not open or use them.
- Blog band: a horizontal carousel of photo tiles with round white prev and next buttons overlaid at the left and right edges. Seen in a screenshot only.
- Cookie banner: bottom bar with More info, DECLINE (lavender), ACCEPT (orange). Declined.
- A chat launcher pill (bottom right) is present on load; hidden for per-section shots.

## Section anatomy

### 1. Price-led destination cards (band 2, "Popular destinations")
- 1440: heading, then one flex row of 5 equal cards. Row 1152 wide, gap 16px, each card 218 wide by 215 tall (`flex: 1 1 0`), so card width is what remains after the gaps, not a fixed number. Not scrollable (`overflow-x: visible`, no scroll snap). Section padding 48px top and bottom, heading to row gap 32px.
- Card: dark plum background, radius 24px, `overflow:hidden`, no shadow, no border, column layout.
- Photo: top of card, full card width, 218 by 136px (about 1.6:1; source files are 640 by 401, so about 8:5). Its own wrapper also has radius 24px, so the top corners follow the card and the bottom edge is a straight cut into the plum. `object-fit` is the default (fill) but the box matches the source ratio, so there is no distortion; `object-position` 50% 50%. Photos are landmark-forward, bright, warm light, centred subject, tight crops (a clock tower, a bridge, a cathedral).
- Text block under the photo: 16px padding all round, 80px tall. Title on top, price line under it, zero margin between (line heights 24 and 24).
- Arrow: a 25px outline arrow in orange at bottom right, in a span with 12px side padding, pulled up 42px (`margin-top: -2.625rem`) with 16px bottom padding so it lines up with the price row. Arrow only, no button shell.
- 390: the five cards stack in one column, 16px gap, each 358 wide by 80 tall, laid out as a row (`flex-direction: row`). The photo becomes a 100 by 80 thumbnail with radius 24px and a minimum height of 80px, the text block takes the middle with vertical centring (title 24px, price 16px, unchanged), the arrow sits vertically centred at the right edge. Section padding drops to 32px and heading to 28px. There is no horizontal rail at any width.
- Hover pair: see Motion. Captured in `...-1440-destinations-default.png` and `...-1440-destinations-hover.png` (second card hovered).

### 2. How bands meet (the whole stack)
Band order at 1440 with measured tops: hero 0 (h500, video); light blue USP strip with search bar 436 (h168); lavender destinations 604; lavender routes 995; light aubergine experience 1379; lavender reviews 2103; lavender blog 2819 (z-index 20); dark aubergine mission 3247 (margin-top -48, z-index 10); dark aubergine newsletter 3791 (z-index 10); lavender footer 4323.
- Every band after the hero except the reviews band sets a bottom radius (`radius-bottom`): 64px at 1440, 32px at 390. Band tops are flat.
- Corner fill technique (the key finding): each band has a `::before` pseudo-element that is `position:absolute; top:-128px; height:128px; width:100%; border-radius: 0 0 64px 64px; background: transparent`, with a box-shadow `0 64px 0 0` in the band's OWN background colour. The pseudo sits across the lower 128px of the band above. Because the pseudo is transparent and rounded, the shadow paints only outside the rounded shape: it fills the two corner wedges (and a 64px strip under them) with the incoming band's colour. The band above therefore looks as if it has rounded bottom corners resting on the band below, with no cut-out gap and no need for the two grounds to match. At 390 the same recipe is halved (top -64px, height 64px, radius 32px, shadow `0 32px 0 0`). The pseudo exists on the blue strip, destinations-to-routes join, experience, blog, mission and newsletter bands.
- Real overlap at 1440 (390 value in brackets): hero to blue strip 64px (32px; the hero is 500 tall and the strip starts at 436, at 390 the hero is 300 tall from y80 and the strip starts at 348). Blog band (z-index 20) over mission band (z-index 10): true 48px overlap (32px) via `margin-top:-48px` on the mission band, which has 0 top padding. Every other join is edge to edge (0px) with the radius wedge coloured by the pseudo.
- Colour as evidence of the joins: hero photo corners filled blue rgb 166,193,221; blue strip corners show lavender; lavender band corners filled light aubergine rgb 134,98,134; light aubergine corners show lavender; lavender blog corners show dark aubergine rgb 64,0,44; the two dark bands' corners show lavender into the footer.
- Section padding: 48px top and bottom at 1440, 32px at 390 (the blue strip and a few top edges set 0).
- Screenshots: `...-1440-hero-edge-searchbar.png`, `...-1440-bands-routes-experience.png`, `...-1440-bands-blog-mission.png`, and at 390 `...-390-bands-routes.png`, `...-390-bands-blog-mission.png`.

### 3. Hero lower edge and docked search bar
- Hero: 500px tall at 1440 (300px at 390, below an 80px fixed header). Centred white headline (rounded display face, roughly 56px by eye, not measured) and one subline over a full-bleed video, headline with a text shadow. No scrim box.
- Lower edge: the hero's bottom corners are rounded at 64px (32px at 390) by the pseudo recipe above, with the blue strip colour filling the wedges. The hero's visible bottom edge is y436, which is where the blue strip begins.
- Search bar at 1440: x144 to x1296 (1152 wide), top y404, height 120. It straddles the hero edge: 32px over the hero photo, 88px over the blue strip. Its edges line up with the content container, not the hero corners. Centred.
- Shape: white, radius 24px, no box-shadow, no border. It has no shadow because contrast does the lifting: half on dark photo, half on mid blue. An outer wrapper has 12px padding, inside is a second white section with 16px padding and the same 24px radius.
- Fields at 1440 (one row, CSS grid, 6 tracks, 8px gap, widths about 175 / 20 / 175 / 159 / 143 / 143): Departure station, a 20px swap arrow, Arrival station, Outward journey (date), Return trip, Travel group. Each field is a stacked label (14px muted) over a value (16px dark), 48px tall, no field boxes and no dividers on desktop. A small info icon follows the Departure label and a "view routes" underlined link sits below it. The row reads as open text, not as inputs.
- Button: at the right end, 224 wide by 56 tall, orange rgb 255,54,0, radius 16px, ticket outline icon plus label, white 16px light.
- USP strip beneath, inside the blue band: four short phrases with outline icons in a centred row, 16px, dark aubergine, starting about 40px below the bar (centre y565).
- 390: the bar becomes a tall stacked card 358 wide (x16), top y316 (32px over the 348 hero edge), about 538 tall, radius 24px, same 12px outer and 16px inner padding. Fields stack as full-width rows with thin grey hairline dividers between them, the swap arrow has its own row with a hairline, and the button is full width (302 by 56, radius 16px) at the bottom. The USP phrases stack into a centred single column (about 176px tall).
- Newsletter popup at 390: a fixed modal (320 wide, 385 tall, x35, anchored low in the viewport) covered the search bar on load. I closed it with its `Close` button (lavender square, top right) only. It did not return during the session.
- Screenshots: `...-1440-hero-edge-searchbar.png`, `...-390-hero.png`, `...-390-searchbar.png`.

### 4. Trust footer
- Lavender ground, dark aubergine text, 48px top and bottom padding. 542px tall at 1440, about 1776px at 390. Flat top: the dark band above carries the rounded corners, so the footer looks tucked behind it.
- 1440 layout: four equal columns (each 352 wide inside a 1408 wrapper), flex row.
  - Column 1: white outline logo (about 230 by 48) over one list of 12 text links (company, partner, press, careers style pages).
  - Column 2: heading plus a list of 12 travel-info links.
  - Column 3: "Destinations" heading plus a list of 19 cities set in two sub-columns.
  - Column 4: a large display heading (the brand tagline), then the contact block, then 7 round orange social icons (30px, 16px gap), right aligned.
- Facts listed (structure only, text not recorded), in this order in column 4: legal entity name (a B.V. company), street address line, postcode and city line, contact email, company registry number prefixed by the registry's abbreviation (a Chamber of Commerce style number), then social icons. One blank line of space between the address group, the email and the registry number.
- Bottom bar, one flex row 30px tall, under the columns: copyright year with the legal entity name (muted light aubergine), a "Legal notices" link (dark), a "Secure Payment" label followed by 7 payment method logos (30 by 30px each, 8px gaps: iDEAL, Bancontact, PayPal, Mastercard, Amex, Visa, EPS), then a "Traveller reviews" label followed by a Google badge (30px round) and a Trustpilot widget (about 180 by 30).
- Not in the footer: no VAT number, no licence or regulator line, no terms row (those sit behind the "Legal notices" link, which I did not open).
- 390: columns stack to one column (each 358 wide, 16px gutters), the Destinations list stays two columns, the tagline heading is smaller (size not measured), contact lines left aligned, social icons in one row, bottom bar stacks vertically: copyright line, Legal notices link, "Secure Payment" label over the 7 icons in one row, "Traveller reviews" label over the badges.
- Screenshots: `...-1440-footer.png`, `...-390-footer-top.png`, `...-390-footer-bottom.png`.

## Signature techniques (3 to 5, rebuildable from scratch)
1. Carried-colour corner pseudo-element. Give every band a rounded bottom (`border-radius: 0 0 64px 64px`, 32px on small screens). Give every band a transparent `::before`, absolutely positioned across the last 128px of the band above (`top:-128px; height:128px; width:100%`), with the same bottom radius and `box-shadow: 0 64px 0 0 <this band's own colour>`. The shadow paints only outside the rounded shape, so it fills the corner wedges of the band above with the next band's colour. Any ground (even a video or photo) can be the band above, and the two colours need not be related. Where a real overlap is wanted (blog over mission), use a negative top margin on the lower band (-48px) and a higher z-index on the upper band.
2. Search bar docked half over the hero edge. A 1152px white card, radius 24px, 120px tall, no shadow, placed so its top is 32px above the hero's visible bottom edge and the rest sits on the coloured strip below. The strip colour (pale blue) gives the second half of the contrast. Inside: one row of borderless label-over-value fields on a 6-track grid with 8px gaps, one 224px orange button at the end. At narrow widths it turns into a stacked card with hairline dividers and a full-width button, still overlapping the hero edge by about 32px.
3. Quiet price-led cards. A plum card (radius 24px, no shadow) with a bright landmark photo at about 8:5 clipped by the card's radius, a 24px semibold display title, and a 16px light caption "From" + euro sign + figure with no size or weight contrast. The only motion is the photo scaling to 1.1 over 0.5s with default ease, clipped by the rounded wrapper. One orange arrow is the only accent. At narrow widths the card turns into a horizontal row with a 100 by 80 thumbnail on the left.

## Not measured
- Menu open state (1440 dropdowns and the 390 menu), the date picker, station pickers and travel group popover.
- Hero video details: whether the 155px offset is scroll-linked parallax, video length, poster, and reduced-motion handling.
- The hero headline's exact size, line height and family (estimated by eye).
- Scroll-triggered reveals or entrance animations on bands (none seen, but not instrumented).
- The blog carousel, reviews and experience bands beyond screenshots.
- Footer facts beyond what is shown: the Legal notices page, any VAT or other numbers behind it, and whether the address block changes by language.
- Footer social icon and link hover states.
- Touch behaviour on anything (the 390 pass is desktop Chromium, not a phone).
- Entrance easing and duration of the newsletter popup.
- Font licences were inferred from the family names (GT Ultra, Ambit), not checked against any licence text.
- The 390 footer tagline heading size.
- Other pages (the route and destination pages the cards link to).
