# Deconstruction: Monocle City Guides card grid (https://monocle.com/travel-guides/)
Scope: only the City Guides card grid (illustrated destination cards), plus the 390 large serif text menu as a secondary note. Measured: 2026-11-10, at 1440 and 390, plus 1024 and 768 for reflow. Desktop Chromium throughout (the 390 view is a narrow desktop window, not a phone). No cookie banner or overlay appeared, so nothing was dismissed. Values below are computed styles, rounded.
Screenshots: references/deconstruct/monocle/ (monocle-1440-grid-default, monocle-1440-card-default / -hover / -focus, monocle-1440-grid-rows3-4, -rows5-6, monocle-1024-grid, monocle-768-grid, monocle-390-grid, monocle-390-menu-open, plus -first shots at 1440 and 390).

## Layout
- Page container: 1296px max, centred (72px margins at 1440). Below that it fills the viewport with 20px side gutters (20px at 1280, 1024, 768, 390).
- Grid: CSS grid, equal columns, 32px column gap and 32px row gap at every width.
  - 1440: 4 columns of 300px (4x300 + 3x32 = 1296). Cards are 300 x 360.
  - 1280: 4 columns of 286px. 1024: 4 columns of 222px (cards 222 x 300).
  - 768 to 1023: 2 columns (348px at 768, 414px at 900).
  - Under 768: 1 column, full width (350px at 390, 560px at 600).
  - Breakpoints are 768 (2 columns) and 1024 (4 columns). There is no 3-column step.
- 33 cities in 9 rows, alphabetical, no featured or oversize card, no filter. The grid sits below a black title bar, an intro paragraph with an illustrator credit, and a sponsor panel beside the intro.
- Card height is set by content: the square image is the card width minus 32px, so the card gets taller as the column grows (360 tall at 1440, 410 at 390).
- At 1024 the label "MONOCLE CITY GUIDES" wraps to two lines inside the 222px card and the cards grow about 20px taller than a one-line label would give. A shorter label would avoid it.

## Type (with the licence of each family)
Same values at every width (nothing scales between 390 and 1440):
| Element | Family | Size / line height | Weight | Case, tracking | Colour |
|---|---|---|---|---|---|
| Series label ("Monocle City Guides") | Plantin | 16px / 18px | 400 | uppercase, no tracking | black |
| City name (h3 with a link) | Helvetica Neue | 20px / 25px | 700 | as typed, no tracking | black |
| 390 menu links | Plantin | 32px / 36px | 400 | as typed, -1.08px tracking | black |
- Licences: Plantin is Monotype, commercial. Helvetica Neue is Monotype/Linotype, commercial. Confirmed which elements use which: serif for the label and the menu, sans only for the city name (and small UI such as buttons). Open Sans, which the Scout noted, was not among the fonts loaded on this page.
- Fallback stacks: label Plantin then Book Antiqua, Georgia, serif; name Helvetica Neue, Helvetica, Arial.

## Color system
- Page ground white. Every card sits on one flat cyan-blue (#64d5ff) with black text and a black hairline. One colour for all 33 cards; no per-city tint. It is a design token ("surface-travel"), so the section has its own brand colour apart from the site's yellow and black.
- The illustrations carry all the other colour, so the grid reads as a coloured tile wall against white. The saturated blue behind warm, muted illustrations is the contrast that holds it together.
- Evidence only: card bg #64d5ff, text and rule #000000.

## Motion
- Hover (card): the image scales to 1.05 inside its clipped frame. Transition is transform only, 250ms, ease-in-out; sampled at about 1.005, 1.023, 1.042, 1.05 across 60ms steps, so it settles at about 230 to 250ms. Transform origin is the default centre.
- Hover (name): underline appears at once, no transition. Plain underline, 1px, colour stays black. Nothing else changes: card colour, shadow, label, rule and lift are all static.
- The whole card is the click target (the link's pseudo-element covers the card), so hovering anywhere triggers both effects.
- Keyboard focus: tabbing to a card shows the name underlined plus a 2px solid black outline, 4px outside the card edge, square corners (the outline does not follow the card's 8px radius). The image does not zoom on focus, only on pointer hover.
- Load and scroll: none seen. Cards are fully opaque on arrival, no reveal, no stagger, no parallax, no active animations after scrolling, no animation library found. Images are 600x600 and lazy-load as you scroll (all loaded after a scroll pass).
- Reduced motion: a global rule cuts every animation and transition to 1ms. Checked on the card: with reduce on, the 1.05 zoom still happens but lands instantly. Not checked on the menu.

## Interactions
- Card is one link to the city page. No filter, tabs, slider or load-more; all 33 are on the page.
- 390 menu (secondary): a hamburger toggles a full-screen white overlay under the yellow bar. Contents: search field, then ten links in a single column at 32px Plantin with tight tracking (-1.08px), 36px line height, 16px gap (52px pitch). The current section is underlined. A black hairline closes the list, then small sans accordions (Topics, Discover, Monocle). Open and close are both a 300ms opacity fade; no slide and no stagger. It reads as an editorial index, not an app drawer.

## Section anatomy
- Card (all widths): padding 16px all round, 8px radius, flex column, no border or shadow. Top to bottom:
  1. Series label, 16/18px caps Plantin, with 4px padding below it.
  2. Hairline: the label's bottom border, 1px black, runs the full inner width (268px at 1440). 4px of space above it (the padding) and 4px below it before the name.
  3. City name, 20/25px bold sans, left aligned, 4px below the rule.
  4. Image frame, 8px below the name: a square (1:1), full inner width, 0 radius, no border, `object-fit: cover`, centred, overflow clipped by the frame. Background behind it is the card blue; the 16px of blue around it reads as a mat.
- Vertical total at 1440: 16 + 18 + 4 + 1 + 4 + 25 + 8 + 268 + 16 = about 360.
- Alignment is all left; the label, rule and image share one left edge.
- At 390: the same card at 350px wide, one per row, 32px apart, image 318px square; type sizes unchanged.
- At 768 and 1024: same card, 2 and 4 columns.

## Signature techniques (3 to 5, rebuildable from scratch)
1. The tile is a coloured mat. One flat saturated card (8px radius, 16px padding) holds a hairline-ruled header and a full-width square illustration with square corners. The illustration is the only thing that varies, so 33 cards look like one family. Rebuild: one card colour token, padding 16, radius 8, image square 1:1 with `object-fit: cover`, no shadow.
2. Label, hairline, name as a three-step editorial header. A small caps serif label, a 1px full-width rule that is the label's bottom border, then a bold sans name. The serif/sans contrast and the rule do the work a heading style normally does. Rebuild: label with 4px bottom padding and a 1px border-bottom, name in a bold grotesque 4px below it. In our version the label should carry a fact (such as a "from" price), not a restated heading.
3. Quiet hover, two effects only. Image scales 1.05 over 250ms ease-in-out inside an `overflow: hidden` frame while the name underlines instantly; the whole card is the link area (an absolutely positioned pseudo-element on the link). Nothing lifts, glows or recolours. Keyboard focus is a separate 2px outline offset 4px.
4. A plain grid with fixed 32px gaps and three states: 1 column under 768, 2 from 768, 4 from 1024, inside a 1296 container. No scroll effects at all; the page relies on the pictures.
5. Illustrations as one commissioned set (see below). The set, not the layout, makes the section feel expensive.

## Illustration set (words only, for briefing our own work)
Seen in 24 of 33 cards (rows 1 to 6 at 1440). All by one illustrator (credited once, "Illustrations by David Doran", in an italic line above the grid, not on each card). Never copy or trace them.
- Style: flat vector shapes with soft gradient skies and a fine grain, no outlines. Shapes are simplified with crisp edges.
- Palette: a shared family across cities. Teal and deep navy shadows, terracotta and burnt orange, mustard yellow, dusty pink and sand, olive green, off-white. Each picture uses roughly 4 to 6 of these. Skies run peach to cool blue; the warm and cool balance shifts by city (warm pink-orange Bangkok, cool blue Helsinki).
- Light: low, warm, late-day light with cool shadows in most cards; a dark foreground band (navy or near black) anchors the bottom of many.
- Subject: a recognisable landmark or street, plus small people doing something ordinary (cycling, fishing, drinking coffee, riding a tram or scooter). Figures are small and stylised, often faceless or turned away, so the place leads. Almost every picture has a human moment.
- Framing: a square crop, the landmark off-centre and cut by the edge, layered foreground, midground and background for depth. The viewpoint is not strictly the same (some at street level, some a wide skyline), but the layered, close-cropped composition and the human scale are constant. The unity comes from palette, light, texture and figure style more than from a fixed camera.
- For our brief: set a palette of 5 to 6 colours drawn from the client palette, one light direction, one figure style, one grain, and a landmark-plus-person rule. Four to six cards, not 33.

## Not measured
- Real touch behaviour (no hover on touch; the 390 window was desktop Chromium, so hover and mouse scripts still ran).
- The menu under reduced motion, and focus styles inside the menu.
- Hover and focus on cards other than the first (all cards share the same class, so assumed the same).
- Other browsers (Safari, Firefox) for the outline and zoom.
- The illustrations beyond row 6 (cities 25 to 33 were not viewed).
- Whether the menu locks page scroll (body overflow computed as visible; not tested by scrolling).
- The sticky header overlapping cards while scrolling (it covers the top 110px of the viewport at 1440).
- Licence terms and fees for Plantin and Helvetica Neue; the commercial label comes from the vendor names.
- Image file weights and compression (600x600 source seen).
