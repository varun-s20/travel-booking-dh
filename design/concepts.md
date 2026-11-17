# travel-booking: concepts (art direction, phase A)
Art Director, 2026-11-10. For Varun at checkpoint 2a. Open prototype/audition.html beside this file: it shows the three type pairings, the three palettes on their hero photos, and a sketch of each concept's hero at 1440.

Sources: brief.md (with Varun's answers of 2026-11-10), references/picks.md, references/cards.md, the five deconstructions in references/deconstruct/ (hipcamp.md, kasa-hotel-detail.md, monocle-destination-cards.md, faye-inclusion-cards.md, hoxton-search-pills.md), and the taste files.

Placeholders, said once and meant everywhere: every working name and wordmark below is a placeholder, not the client's brand. Market defaults (English, USD, no fee or markup beyond the taxes and fees in the fare data) are Varun's placeholders, not client facts. Headlines are working copy for judging type; the Copywriter writes the real copy. Photos are Unsplash stock, approved by Varun as stand-ins.

## What every concept keeps
All three rebuild Hipcamp as the primary reference, so they share its layout system and differ in idea:
- The tool is the hero. The search sits in the first screen as the call to action, under a Flights / Hotels toggle with Hipcamp's sliding thumb. If Duffel Stays is not approved, the toggle goes and the search is flights only; nothing else in the hero depends on hotels.
- Hipcamp's quiet app shell. An 88px icon rail on desktop (Search, Bookings, Account, Help) with one tinted square for the current page; Log in and Sign up as two small pills top right. At 390 the rail becomes a floating pill tab bar, which steps aside for a fixed booking bar on detail pages. The nav never competes with the headline.
- One warm tint as the only interactive surface (toggle track, hover, steppers, calendar range, current-page square), one deep colour for every call to action, one accent for highlights only.
- Motion is mostly state change, short and calm, as on Hipcamp: segment hover 260ms, the toggle and the active-field thumb on a slight spring (220ms), popovers rise 6px and fade in 160ms. Each concept adds one load moment of its own (see conflict 7).

## Concept A: Overwing (working name, placeholder) [my recommendation]
The idea is the calm of the window seat: every view on the site is seen through an aircraft cabin window, so the client's one brand shape is the window itself, a tall rounded rectangle with its blind half down. In the first five seconds the visitor should feel the hush just after take-off, when the cabin goes quiet and the clouds are below: light, unhurried, in good hands. The hero keeps Hipcamp's centered white layout (headline, toggle, labelled search pill, a trust line saying card payments are handled by Stripe) and runs a row of four cabin windows across the column underneath, showing one continuous wing-over-clouds panorama, as if you were looking along the cabin wall. On load the four blinds rise one after another (1.6s ease-out, 120ms apart); on scroll the view drifts sideways a little slower than the page, like the ground passing. Both stop under reduced motion.
- Carries through: the window frames the popular-destination cards (Monocle's mat tile, with the window instead of a square), the searching state (clouds drifting past a window while the live search runs, which can take seconds), the wordmark's o, the chip glyph and the app tile. It stays out of the hotel pages, which keep Kasa's photo grid.
- Wordmark direction (placeholder): lowercase "overwing" in the display face, the first o drawn as a cabin window with its blind half down.
- Media: one wide sky or wing photo now; later any client view fits the windows. Palette P1, Cabin dawn.
- Why I lead with it: it is the most original of the three and belongs to this business (you only see this view on a flight). It matches the brief's mood words (calm, clear, light, quietly confident). It keeps Hipcamp's layout whole and needs only one photo. Risk: the window can turn cute if it appears everywhere, so it is limited to the five uses above.

## Concept B: Docket (working name, placeholder)
The idea is that everything is written down: the site behaves like a good paper ticket, so a new name earns trust by showing its working at every step. In the first five seconds the visitor should feel certainty and order: nothing hidden, every figure in its box. The hero is a ticket. Under the headline and toggle sits one wide white ticket on a paper ground: a photo panel at the left, four labelled cells (From, To, Dates, Travelers) in The Hoxton's small caps labels, then a perforation with two notches cut from the edge, and a stub holding the Search button and the Stripe line. The same ticket then carries the whole booking. Results are tickets with the price on the stub. The booking summary that follows you through checkout fills in line by line. The confirmation is the finished ticket with the booking reference in tabular figures, and the dashboard is your stack of tickets.
- Wordmark direction (placeholder): lowercase "docket" on a small ticket with one perforation and two notches; the notched stub alone is the glyph.
- Media: light. One photo per destination on the ticket panel (in the simulated build it can change with the To field); the rest is type. Palette P2, Ochre and ink.
- Strengths: the strongest answer to the brief's main hurdle (trust in a small, new booking site) and the cheapest to build, because results, checkout and confirmation reuse one component. Risks: skeuomorphism. I would allow one perforation and two notches, and no barcodes, stamps or torn edges. P2 also lands close to Hipcamp's own olive and warm grey (see the palette note in the audition).

## Concept C: Landfall (working name, placeholder)
The idea is to arrive first: the homepage opens on the place, not the plane, in the moment you land somewhere new and the light is low and gold. In the first five seconds the visitor should feel warmth and pull, the sense of "I want to be there". The hero is your own hero move adapted to a tool. A full photograph fills the content area inside Hipcamp's frame (inset 8px, 24px corners), with a centered capitals headline over the sky, a radial scrim measured until every pixel passes, and a haze along the bottom edge. The labelled search pill docks across the photo's lower edge, half on the photo and half on the white app world below, the way The Hoxton docks its search. The photo zooms slowly as you scroll, and the white band rises over it with rounded top corners.
- Wordmark direction (placeholder): "LANDFALL" in wide capitals with one horizon rule under it that runs past the word and turns gold where the land would be; the rule returns as the route line on itineraries.
- Media: the heaviest. It needs one strong place photo now and a set of destination photos later, and the hero photo drives the scrim every time it changes. Palette P3, Harbour gold. Type T3 suits it.
- Strengths: closest to your own hero (full media, centered capitals, scrim, slow zoom, haze, rising band). Risk: it is the most familiar layout in the category, since booking sites often lead with a destination photo and a search bar. The difference has to come from the grade, the type and the motion.

## The rebuild, section by section
Which source wins where, following the art-direct order. Phase B turns this into the spec.
| Section | Source | How it is rebuilt |
|---|---|---|
| App shell, header | Hipcamp | Rail at 1440, two account pills, floating tab bar at 390, sheets for menus. One button system (Hipcamp has two). |
| Hero search | Hipcamp, with Hoxton labels | Hipcamp's 72px pill: segments, divider fade on hover, sliding white thumb under the active field, popovers 12px below. Hoxton's small caps label above each value (11px/600, .08em tracking, raised from Hoxton's 9px for legibility). At 390: one pill that opens a full-screen step-by-step search, as on Hipcamp. |
| Passengers, guests and rooms | Hipcamp | Stepper rows: title, helper line, two round tinted buttons around the count. |
| Dates | Hipcamp | Two-month range calendar, dark selected ends, tint band between. |
| Hotel search fields | The Hoxton (Varun's donor) | The labelled cells. Hoxton's flat, shadowless, upward-opening panels are not taken; popovers follow Hipcamp. |
| Region pills | The Hoxton (Varun's donor) | 40px capsules with a faint outline that fills dark when selected. Two fixes: hover must differ from selected (Hoxton shows them the same), and at 390 the row scrolls sideways (Hoxton hides it). |
| Flight results | Hipcamp | The list half only, no map. Rows with airline logo (from Duffel), times, duration, stops, total price, one action. Filter chips and a sort sheet. Hipcamp has no desktop sort; the scope needs one. |
| Hotel results | Hipcamp | List plus sticky map, linked hover (card tints, its price pin turns dark). Needs a map provider decision. Map optional at 390 behind a floating Map pill. |
| Flight details and fares | Hipcamp, then Faye | Hipcamp's "Select a unit" pattern becomes fare options: bordered option rows, one outline button each. What each fare includes uses Faye's disc checklist (tick for included, plus for paid extra). |
| Hotel detail | Kasa (Varun's donor) | Kasa's page order: 5-up photo grid as one button with a "+N photos" chip, description and amenities, room cards in a rail (3:2 carousel, arrows on hover), a hairline policy accordion (200ms ease-out, one open at a time), then location. Kasa's scroll-aware compact search bar on inner pages. Kasa has no sticky booking card; booking runs through the room cards. |
| Room and fare inclusions | Faye (Varun's donor) | Flat tinted cards, 16px radius, 32px padding, a 14px filled disc with a tick. A second tint marks paid extras. No hover, because they are information, not links. This differs from the Scout's card (see below). |
| Popular destinations | Monocle (Varun's donor) | The mat tile: one colour token, 16px padding, 8px radius, a label with its own 1px rule, then a bold name, then the image; 4, 2 and 1 columns with 32px gaps. The label carries a fact from the mock data (a "from" fare), never a restated heading. Hover: image scales 1.05 over 250ms, name underlines. Four to six destinations, not 33. |
| Checkout, account, dashboard, confirmation | No reference measured | Built from Hipcamp's system: booking card, option rows, tint, steppers. Checkout and account pages were not reached on any reference (they need dates or a sign-in). |
| About, contact, legal pages | No donor picked | Hipcamp's text styles. Sidetracked was shortlisted for this but not picked. |
| Footer | Varun's V move 10 | Your footer order (phone and email first, then link columns), but every contact detail is a marked placeholder until the client supplies one. |

## Conflicts for Varun to rule on
Resolved by the art-direct order unless marked as your call.
1. No logo, so no palette from the logo. Your colour move builds the palette from the logo's own pixels, and there is no logo. I sampled each palette from its concept's hero photo instead, kept your role structure (accent for highlights, deep for every call to action, near-black, white, warm cream) and wrote every ratio down. Each palette is rebuilt from the real logo when it arrives.
2. Hero media. Your hero move is full-screen looping video of the client's own work. There is none, and stock stills are approved. C is closest to your move; A and B keep Hipcamp's white tool-first hero with the photo set into it.
3. Headline system (your call). Hipcamp sets sentence case bold. Your capitals with light and bold words are a "V+R, unsplit" move, allowed only where the reference supports it, and Hipcamp does not. They appear only in T3 and concept C, as an option.
4. Call-to-action colour. Hipcamp uses orange for search and olive for Reserve, as two coexisting systems. Your move wins on calls to action: deep on light grounds, with the accent kept for highlights. So the Search button is the deep colour, not an accent.
5. Buttons. Hipcamp's Reserve and booking buttons use an 8px radius. Your buttons move wins: pills only, sentence case 14 to 15px/600 with a small arrow and your quiet hover. Hipcamp's round search button becomes a labelled pill.
6. Search labels (your call). The Hoxton is your donor for hotel search fields only, and donors win only inside the section you named. Flights and hotels share one search component, and flight fields need labels even more (From and To are ambiguous without them). I recommend Hoxton's labels on both tabs.
7. Motion. Hipcamp has no entrance or scroll motion at all, only short state changes. Your motion move (slow reveals, masked lines) is "V+R, unsplit", and the art-direct finish pass asks for a load sequence and masked line reveals. Proposal: keep Hipcamp's fast state changes for the tool, and allow one load moment per concept (A the blinds, B the ticket fields printing in, C the slow zoom and the masked headline rise). It would never touch the search's responsiveness, and reduced motion would turn all of it off.
8. Navigation. Your floating three-piece nav (menu pill, centered logo, contact pill) is "V+R, unsplit" and Hipcamp does not support it. The primary wins on layout, so it is Hipcamp's rail and pills. Your "quiet navigation" rule is kept: no nav item is taller than 44px at 1440, and the rail is an unfilled column beside the page, not a bar across it.
9. Placeholder marking (your call). Your answer 5 asks for clearly marked placeholders for every client fact. Anti-slop bans visible placeholder labels. My proposal for phase B: no placeholder labels on media (stock fills every image slot), invented-looking facts never shown, and one quiet "demo build" notice in the footer naming what is placeholder. I need your yes on the wording and where it sits.
10. Geist. It is Hipcamp's own free UI face, so it is allowed, but it is also the create-next-app default and may read as stock in a Next.js build. T3 avoids it. T2 keeps it, as Hipcamp does.
11. The Scout's Faye card was wrong in three places (deconstructor finding). The checklist cards have no hover and no 8px lift; the tint change and purple link belong to Faye's trip-type cards; the price line is one plain style. I follow the measured file.

## Auditions (prototype/audition.html)
- Type: T1, the reference's own approach (Calibre, commercial, cannot ship, plus Geist, free), shown from the deconstruction capture. T2, the closest free substitute (Rethink Sans plus Geist, both SIL OFL). I chose Rethink Sans by setting 13 free grotesques beside the Calibre capture. T3, the alternative (Archivo at two widths, SIL OFL): your capitals system in the wide cut, one family for everything.
- Palettes, each sampled from its hero photo and shown on it: P1 Cabin dawn (sky teal, wing slate, blush), P2 Ochre and ink (dress ochre, cobble shadow, paper), P3 Harbour gold (terracotta, sea deep, sand). Every body-text pair is 5:1 or better, and every accent focus ring is 3.8:1 or better on its light grounds. White on the P1 accent is only 4.0:1, so that pair is for large text only. P3 is the only one with text on a photo. I measured it pixel by pixel behind the text: headline worst pixel 3.6:1, subline worst 4.9:1. The first scrim failed and is recorded on the page.

## What I could not check, or guessed
- Checkout, payment and account screens: not reached on any reference, so those flows have no measured model.
- Calibre against Rethink Sans: compared by eye against a capture, not glyph by glyph. Calibre was not loaded.
- Touch behaviour: every 390 measurement was desktop Chromium at 390 wide, with no touch emulation.
- Photos: licence checked on each Unsplash photo page (Unsplash License, not Unsplash+). Model and property releases were not checked; Unsplash does not provide them. The coast photo is a real, recognisable beach with its painted name on the sea wall; it implies a destination the client may not sell. The airline wing in the P1 photo shows no livery that I could see.
- Names: Overwing, Docket and Landfall were not checked for trademarks or domains. They are placeholders and must never ship as the brand.
- Font licences: taken from the Google Fonts listings (all SIL OFL). To confirm on the files themselves when they are self-hosted in phase B.
- Text-on-photo contrast was measured for one crop at 1440 only. The build must recheck at 390 and on tall screens.
- Duffel data shapes (airline logo fields, hotel review data) are taken from the brief, not checked. Hotel reviews may not exist in Duffel Stays, which would drop Kasa's review rail.
- The audition sketches are static pictures at 1440, not the phase B prototype: no 390 layouts, no working popovers, no header states.

## Your choices (checkpoint 2a)
Please choose, or write your own:
1. A concept: A Overwing, B Docket or C Landfall. Mixing is fine, for example A's idea with B's ticket for checkout and confirmation only.
2. A type pairing: T2 or T3 (T1 cannot ship).
3. A palette: P1, P2 or P3.
4. Rulings on conflicts 3 (capitals), 6 (labels on both tabs), 7 (one load moment per concept) and 9 (placeholder notice).
I record your answers in design/choices.md before phase B. If you describe an idea in your own words, I also add it to taste/ideas.md with the date and project.
