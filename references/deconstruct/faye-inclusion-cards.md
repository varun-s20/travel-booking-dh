# Deconstruction: Faye, "What's covered" checklist cards (https://www.withfaye.com)
Scope: only the "What's covered" checklist cards, plus the "Starting at $X/day" line on the trip-type cards as a secondary note. Measured: 2026-11-10, at 1440 and 390 (390 is desktop Chromium resized, not a phone; hover and mouse scripts still run). No popup blocked measurement, none dismissed. The sticky "Check pricing" button is visible in the 1440 checklist shots (the hide rule did not hold there); it is hidden in the 390 shots.

Corrections to the Scout card (verify before building on it):
- The Scout's default/hover screens (faye-1440-card-default/hover.png) show the trip-type card (International), not a checklist card. The checklist cards ("What's covered") have NO hover state at all. Measured: background, transform, shadow, colors all unchanged on hover; cursor is default; the heading button has pointer-events none at 1440.
- The "lifts about 8px" is not a hover. No hovered card moved (top edge identical before and after). The only lift-like motion is a scroll-scrubbed tilt on the trip-type cards, described under Motion.
- Tint deepens and link turns purple are real, but only on the trip-type cards.
- There is no split price (prefix, figure, unit, qualifier). The whole line is one plain text run in one style.

## Layout
- Section: ground #FEFEFA (rgb 254,254,250), 48px top and bottom, inner wrapper 64px side padding, max 1404, 48px gap between header, card row and footer link. Header is centered: H2 then a one-line subhead.
- Checklist row at 1440: CSS grid, 4 equal columns of 304px, 20px column and row gap, total 1276px wide. Cards are equal height (stretch), 316px tall here (the tallest list sets it; shorter lists leave empty space at the bottom).
- Link "This way to all our coverage" centered under the row, 48px below it.
- At 390: grid becomes 1 column, 342px wide, 24px side margin, 2px gap, so the four cards read as one segmented panel (16px radius per card, a hairline of ground color between). It becomes an accordion, see Interactions.
- Trip-type cards (secondary): 3 equal columns, 409px wide, 24px gap, flex row. At 390 they become a horizontal scroller: 335px cards, 16px gap, scroll-snap x mandatory, snap align start, the next card peeks off the edge.

## Type (with the licence of each family)
- Faye Display (headings, card titles): proprietary brand font, commercial, not licensable. Self-hosted woff2 with woff fallback on the site's own asset host, font-display swap, 6 weights declared (400 to 900). Fallback in their stack: system-ui, sans-serif.
- Faye Text (list rows, links, price line): same status, same host, 6 weights. Fallback: system-ui, sans-serif.
- Roobert is also declared (300 to 700) but unloaded on these sections. Commercial.
- Stand-ins for the client (my suggestion, not a measurement): one open-licence humanist or soft grotesque pair with a slightly quirky display cut; check the licence before choosing. Do not ship Faye's files.
- Checklist card title (H3): Faye Display 500, 24px / 32.4px line (1.35), tracking -0.12px (-0.005em), sentence case, plum rgb(52,14,63). At 390: 22px / 29.7px.
- Checklist row text: Faye Text 400, 16px / 24px (1.5), tracking normal, plum. Wraps under the text edge; the check hangs left of the text block (text indents 26px).
- Section H2: Faye Display 500, 48px / 57.6px, tracking -0.96px (-0.02em); 32px / 38.4px at 390. Subhead: Faye Display 500, 16px / 22.4px, purple rgb(86,29,207).
- Footer link: Faye Text 500, 18px, tracking about -0.09px, underline, offset 4px, plum.
- Trip-type card title: Faye Display 500, 24px / 32.4px, -0.12px.
- Price line "Starting at $5.76/day for 14 days": one run, Faye Text 400, 16px / 24px at 1440 (14px / 16.8px at 390), plum at 0.65 opacity (about 5.1:1 on the tint, my arithmetic). Prefix, figure, unit and qualifier share size, weight and color. The figure varies by card ($4.36, $5.76, $4.36) with no bold or tabular treatment.
- Trip-type link "Get covered": Faye Text 500, 18px / 19.8px, tracking -0.09px, underline, offset 4px.

## Color system
- Grounds: page cream rgb(254,254,250). Checklist cards are flat soft tints, no border, no shadow: peach rgb(255,242,228) for the three coverage cards, lavender rgb(238,232,250) for "Available add-ons", so the optional group reads as different by tint alone.
- Text and glyphs: deep plum rgb(52,14,63) for titles, rows, check discs, links. Purple rgb(86,29,207) is the interactive and accent color (link hover, focus ring, subhead, sticky button).
- Check glyph: plum filled disc 14px with a cream (254,254,250) 12px tick, stroke 2px, round caps. Add-on rows use the same disc with a plus (same size and colors). The disc sits 4px down from the row top so it centers on the first text line.
- Trip-type cards: tint rgb(246,243,250), icon tile rgb(204,187,241), hover tint rgb(238,232,250). Values as evidence, not for reuse.

## Motion
- Checklist cards: no load animation, no scroll reveal, no hover. Sampled opacity and transform at load and across scroll: always 1 and none. The only motion is the accordion at 390.
- Accordion at 390: body animates max-height (to 800px) and padding-top, 0.5s cubic-bezier(0.4,0,0.2,1); the 20px chevron rotates 180deg, 0.5s same curve. Several cards can be open together (aria-expanded true on two at once). The first card is open on load.
- Trip-type cards, hover: background 0.2s cubic-bezier(0.4,0,0.2,1) from rgb(246,243,250) to rgb(238,232,250); link color 0.2s same curve from plum to purple rgb(86,29,207), underline follows. No transform, no shadow, no icon change. Default/hover pair captured.
- Trip-type cards, scroll (the likely source of the "lift"): the wrapper around each card is scroll-scrubbed, not time-based. Left card rotates +15deg, middle 0, right -15deg, all translateY 80px; transform-origin is the top corner nearest the middle (409px 0 on the left card). It eases linearly to flat as the card top moves from about 58% to about 35% of viewport height (8.9deg / 47px at card top 438px of 900; 2.5deg / 13px at 350px; flat at 254px). A fan of cards straightening as they arrive.
- Reduced motion: with prefers-reduced-motion reduce the scroll tilt is off (identity transform at the same scroll). The site has 8 reduced-motion rules (some animations and transitions set to none). The hover tint and link color transitions stay on (no override found on those).
- Libraries: not identified for the scroll scrub (transform is set live, likely JS). Not investigated.

## Interactions
- The checklist card is not interactive at 1440. At 390 the title row is a button (aria-expanded, aria-controls) with a chevron at right; tap toggles.
- Keyboard focus, trip-type "Get covered" link: 1.6px solid purple rgb(86,29,207) outline, 1.6px offset, 8px radius, on :focus-visible only. Checklist cards have no focusable element at 1440. Focus on the footer link and the accordion buttons at 390 was not captured.
- Footer link "This way to all our coverage": plum to purple on hover (measured; duration not read).

## Section anatomy
- What's covered, 1440: centered H2 and one-line subhead, four equal tinted cards (title, then 3 to 6 check rows), a centered underlined link. Cards share height; list lengths differ.
- Card inner: 32px padding all sides, title row 32px tall, list starts 16px below the title, disc-to-text gap 12px, row gap 12px (a 1-line row is 24px, a 2-line row 48px).
- What's covered, 390: same content as a stacked accordion, 16px card padding, 2px gap, title 22px, row gap 6px; reads as one rounded block.
- Pick your adventure, 1440 (secondary): three tinted cards, 36px padding, 12px gap in the column: 60px icon tile (12px radius, 24px glyph), title, price line, underlined link. At 390 the tile is 32px with a 4px radius and sits left of the title; price is 14px.

## Signature techniques (rebuildable from scratch)
1. Soft tint cards with no border or shadow. 16px radius, flat pastel fill on a cream page, 32px inner padding, one tint swap (lavender) for the optional group. Rebuild: grid of 4 x 304px at gap 20px, each card a flex column, a background token per group, nothing else. The restraint is the quality. For the client: tint for "included", a second tint for "paid extra".
2. Filled-disc check list. A 14px plum disc with a cream 12px stroke tick (2px stroke, round caps), pushed 4px down so it aligns with the first line of a 16px/24px row; wrapped text hangs under the text edge, not the disc. A plus-in-disc variant marks extras. Rebuild with an inline svg in a no-shrink span, 12px gap, 12px row gap. For fares: tick for included, plus for paid add-on (bags, changes, refunds), same disc.
3. One-style price line with subdued opacity. "Starting at $X/day for N days" is a single 16px / 400 run at 0.65 opacity under a 24px title, followed by an underlined link; card tint and link color both transition 0.2s on hover. Reads calm because nothing in the line is bold. For a "from $X" fare line, keep one style and let the card carry the emphasis.
4. (Secondary, not the checklist card) Scroll-scrubbed fan on the trip-type cards: rotate +15 / 0 / -15deg and translateY 80px, scrubbed linearly to flat between about 58% and 35% of viewport height, off under reduced motion. Optional for the client.

## Not measured
- Hover on the trip-type icon tile or title (no change seen in the pair).
- Accordion focus ring and keyboard behavior at 390 (Escape, arrow keys).
- Real touch behavior at 390 (desktop Chromium, not emulated touch).
- Exact scroll-scrub clamp points and the library used; footer link hover duration.
- The plus glyph path (same disc size measured, path not read).
- Widths between 390 and 1440; the breakpoint where the grid collapses to the accordion was not found.
- Dark mode (none seen).
- Screens in faye/: faye-covered-1440-default.png, faye-covered-1440-hover.png (identical to default, evidence of no hover), faye-covered-390-default.png, faye-covered-390-open.png, faye-triptype-1440-default.png, faye-triptype-1440-hover.png, faye-triptype-1440-focus.png, faye-triptype-390.png. All viewport captures; no full-page capture for this scope.
