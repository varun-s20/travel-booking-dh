# travel-booking, Landfall: choices
These are the Chief Officer's choices, made while Varun was asleep under his hand-over (status.md, 2026-11-11). They are for Varun to review later; he can overrule any of them. Recorded by the Art Director.

## Checkpoint 2a (2026-11-11, about 03:19, chief-officer agent, foreground)
Read: logs/redesign-note.txt, brief.md (client feedback), landfall/design/concepts.md, the taste files and rejection images, kasa.md; viewed landfall/prototype/audition.html at 1440.

1. **Concept: Landfall as developed, with one change to the image rule.** The Lisbon hero looks across rooftops to the river, not from the water, so the rule becomes "the city where it meets the water, with water in every destination frame"; views from the water where stock allows (Cape Town, Manhattan). Name and landfall line unchanged.
   Watch: the pause button stops all hero motion (crossfade and zoom); keep the scrim light but make the arrival caption readable over the red roofs at bottom left; check each hero still for softness at 1440 (New York is a 1.5x source, replace it if soft).
2. **Type: T1, Newsreader headings plus Albert Sans.** Type comes from the reference (Kasa's serif and sans split), and it is the clearest break from Overwing's Calibre plus Geist. Albert Sans carries every word a visitor reads or taps.
   Watch: Newsreader only on H1, H2 and destination city names, weight 400, upright, never italic or an accent word; prices, fields, buttons, flight legs and component titles in Albert Sans with tabular figures; note in the spec that T2 (Albert Sans only) is a token swap if the client pushes back on the serif.
3. **Palettes confirmed: P-N Landfall navy is the default, P-H Harbour gold the alternate.**
   Watch: teal #0A7C78 on mist only for rings and glyphs; the bright teal button on navy has no glow or gradient; once Overwing's new navy palette exists, the Critic compares values and roles and Landfall keeps its own.
4. **Rulings.**
   - Conflict 2, sentence case headlines: upheld. No full stops; every component title follows the same case and weight.
   - Conflict 3, search card high under the headline at 1440, docked over the photo's lower edge at 390: upheld. At 1440 the card and the caption sit inside the first 900px with the city clear below; use the short date format ("Nov 20 to Nov 27") so Dates never truncates; at 390 the docked card never collides with the fixed header.
   - Conflict 5, the Search button keeps the card's inner radius: upheld, as one written rule. Buttons inside a search surface (hero card, 390 stacked card, sheet footer, pinned compact bar) follow that surface's inner radius; every other button is a pill (Varun V9) with the quiet hover.
5. **Donor: European Sleeper confirmed** for destination cards, band joins, the 390 search card and the trust row.
   Watch: trust row facts (entity, address, registration, contacts) stay marked placeholders, payment marks only in their own colours; destination cards always carry a real photo and a mock fare; no eyebrows over the destination band.
- Small note: give the caption's "Fly here" link its own spacing.
- The Chief Officer could not check: motion, the 390 layout in place, reduced motion, Overwing's files, photo licences.

## Checkpoint 2b (2026-11-11, about 04:15, chief-officer agent, foreground, first call)
**APPROVED WITH NOTES.** Read: the prototype at 1440 and 390 in both palettes, the draft handover (critic round 1: 6.25 FAIL, design 7, originality 6, craft 5, functionality 7, no tells; ten issues fixed after the round, not re-scored), the spec, tokens, the client feedback and the redesign note.
Why it goes forward: it answers each of the client's five asks; it is a different design from Overwing (Kasa full-bleed photo hero, Newsreader plus Albert Sans, its own photos, wordmark, cards, band joins and motion), not a palette swap; no taste tells; the panels, validation, Hotels tab, menu and sheets work with no console errors. The critic's originality 6 is a real risk, not a reason to send back: the answer is carrying the concept through the inner pages.
Notes:
1. Home, pinned compact search, 1440, docked state: the header's white strip painted over the docked bar (blank band, bar unclickable). **Fixed by the Art Director right after the call** (compact bar layer raised to 110, above the header); checked docked at 74px and clickable at 1440 and 1024.
2. Home hero, 390 x 844: the Search button ended at 851px, below the fold. **Fixed right after the call** (hero text block tightened); the button now ends at 821px in both palettes.
3. All pages, originality: the landfall line and the price-first arrival idea must show visibly on flight result rows, the itinerary timeline, booking totals and confirmation; the Developer's first Critic check re-scores the home hero at 1440 and 390, because the ten fixes were never re-scored. (Build stage.)
Watch:
- Palettes: Landfall's navy and teal sit very close to Overwing's new navy palette (#0F2747 against #0D2B4C, #0A7C78 against #086F76, #4FD1C1 against #6FD6CE). Acceptable, because both follow the client's colour ask and the designs differ in concept, layout, type and photos. No time on re-tuning, but the two never share components. (Overwing's palette did not exist when Landfall's was set in phase A.)
- Serif headings: keep T1 for now; T2 stays Varun's call if the client reads "a clean, readable font" literally.
- Placeholders: name, wordmark, the London origin and all fares stay marked as placeholders and mock data.
The Chief Officer could not check: touch devices, Safari and Firefox, 2x and 3x screens, reduced motion, screen readers, 641 to 1024, Harbour at 390, the 390 compact pill, the full keyboard order, a second critic round.

## Palette distinctness
2026-11-11, palette-only revision by the Art Director. Chief Officer (chief-officer agent, foreground, first call): **APPROVED WITH NOTES**.
Why: Varun overruled the 2b "Watch" note. The two designs must use different shades and different roles of navy, white and teal. Landfall's old set had the same roles as Overwing (navy on every call to action) and nearly the same values.

**The rule: teal acts, navy speaks.** On Overwing, navy fills every call to action and a dark navy wall, and teal is a thin accent. On Landfall, teal fills every call to action and every selection, with an ink label. Navy carries words and small surfaces: type, links, the focus ring on light grounds, the destination cards and the open-field ring. Navy never fills a button, and Landfall has no navy wall.

| Role | Landfall old | Landfall new | Overwing (given) |
|---|---|---|---|
| Navy | #0F2747, every call to action | #1B2A6E, indigo (hue 229), never a button | #0D2B4C deep, #0B2341 wall (hue 211 to 213), calls to action |
| Ink | #0B1830 | #121839 | #0B1B2E |
| Muted | #4A5A70 | #4D5478 | |
| Teal | #0A7C78, focus and links | #14A08B lagoon (hue 171, luminance .27), every call to action, picked dates, checked options | #086F76 (hue 184, luminance .13), thin accent |
| Bright teal | #4FD1C1 | #5FE3C2 shallows: on navy and on the photo only | #6FD6CE |
| Tint | #EAF2F4 mist | #EDF9F6 foam | #E6F0F2 |
| Shade, line, field | #F4F7F9, #E1E7EC, #7C8A9C | #F5F6FB, #E3E5F0, #8085A6 | |
| On-dark muted | #B9C6D6 | #C3C8EA | |
| Scrim | 11, 24, 48 | 18, 24, 57 (ink) | |
| Focus on light | teal | navy | |

For the Developer: copy the P-N :root block, the three action roles (--c-action, --c-on-action, --c-action-hover) and the Harbour block from landfall/design/tokens.css as written. Every button fill and every selected state uses the action roles, never --c-navy or --c-accent directly. The Harbour block sets those roles back to navy fills and terracotta focus, so Harbour renders as before. Also copy the photo focus halo from prototype/assets/global.css: an ink box-shadow of 7px at .9 behind focus rings on the tabs, Fly here, pause, and the header over the photo. Shadows keep the old ink rgba (11, 24, 48) on purpose, so Harbour does not change.

Measured (WCAG 2.x, my script, values in the tokens.css comments):
- Text pairs, all 4.5:1 or better. Ink on white 17.3, on foam 16.0. Muted 7.4 on white, 6.8 on foam and shade. White on navy 13.1. Ink label on teal 5.3, and on the hover teal 6.6. Shallows on navy 8.3. On-dark muted on navy 8.0. Teal is never text on light grounds (3.3 on white).
- Non-text, all 3:1 or better. Teal button edge 3.3 on white, 3.0 on foam and shade. Field border 3.6. The navy focus ring is 13.1 on white and 4.0 against a teal button.
- Text on the hero photo: 2nd percentile behind each block, all three photos, at 1440 and 390, with the text made transparent. Headline 7.1 or more, subline 5.4 or more, tabs 4.9 or more, caption 5.0 or more, header links 7.4 or more. The darkest single pixels are the Lisbon place name at 1440 (4.0) and the New York subline at 390 (4.4). My method may differ from the earlier one, so small differences from the handover's numbers are not a palette effect. The scrim's luminance moved only from .009 to .011.
- Focus ring on the photo: the bright ring fell to 1.1:1 on Lisbon's white facades at 390. The old palette had the same fault. The ink halo fixes it: the ring now sits on ink at about 8:1, and I checked it in the browser at 390.
- Harbour: the Search button still computes #173B4F at 1440 and 390. Screens are in design/screens/palette-distinctness/.

Conflict for Varun, **provisional**: Varun's V6 and Kasa both put navy on calls to action on light grounds. Varun's current instruction (different roles from Overwing) outranks V moves in the art-direct order, so teal fills the calls to action. The pairing is V6's own dark-ground pair (accent fill, ink label), used everywhere. No glow, no gradient, no shadow on hover (V9).

Chief Officer's notes:
1. On the destination cards at 1440, the navy #1B2A6E reads royal or indigo rather than deep navy. Keep the hue and darken it. **Not applied, so the approved values stand and the Developer copies tokens.css as written.** A measured candidate for Varun is #16225A (same hue, 229). On it: white 14.9, shallows 9.4, on-dark muted 9.1, and the navy ring against teal 4.6. It is a one-token swap if Varun wants it.
2. A small stray mark near x 905, y 130 under the pinned compact search, and the destinations heading may be hidden under the pinned bar at 1440. These are layout, not palette, and they were there before this revision. Left for the Developer to check.
3. Keep the V6 conflict marked provisional (above), and keep teal buttons free of shadow or glow on hover in the build.
Not checked: Overwing's real screens side by side (values given only), hover states on screen, touch devices, Safari and Firefox, 641 to 1024, reduced motion. landfall/prototype/tools/palette.py still lists the old pairs.

## Build checkpoint (2026-11-11, about 05:15, recorded by the Developer)
Chief Officer (two calls, foreground): APPROVED WITH NOTES, then APPROVED. Note 1 above is now applied: --c-navy and --c-theme are #16225A (the measured candidate) because the Chief Officer found #1B2A6E read royal on the destination cards. New role --c-band (ink in navy, sea in Harbour) for the pre-footer, footer and dark surfaces, since Landfall has no navy wall. Both changed in tokens.css by the Developer as one-line token edits, comments updated with the new ratios. Details: landfall/build/progress.md.

## No demo disclosures (Varun, 2026-11-11, 16:28)
Varun: remove the demo build notice and anything like it from the site; the client must not be told it is a demo build. Nothing on the site says demo, working name, placeholder, sample, mock, simulated, test data, or that no booking is real or no card is charged. Replaces the footer demo notice from the 2a ruling 9.

## Palette revision (Varun, 2026-11-11, 17:18)
Varun: the navy is good, the teal and the other colours are not; the Harbour gold alternate looks dead and not vibrant. Chosen by the Studio Lead with the ui-ux-pro-max skill (its travel and airline palettes), every pair measured:
- Navy palette (3003): navy #16225A and ink #121839 kept. Teal #14A08B (green, dull) becomes lagoon teal #0BA3AD (ink label 5.6:1, navy ring against it 4.9:1); shallows #5FE3C2 becomes aqua #6FE3EA (9.8:1 on navy); foam tint #EDF9F6 becomes aqua mist #E6F6F8.
- Alternate (3004): Harbour gold is replaced by Riviera: deep ocean #0A4D68 (links, bands, score; white 9.2:1), ocean ink #0A2A3C, muted #46606F, sun coral #FF6F59 on every call to action with an ink label (5.4:1), deep coral #C2410C focus ring (5.2:1), sky mist #EAF6FB, clean white ground. The palette key stays "harbour" so the scripts and port do not change.
- A logo (mark plus wordmark) replaces the plain text name (Developer, logs/landfall-logo.log).
