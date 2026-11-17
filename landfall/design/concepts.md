# travel-booking, Landfall: concept, type and palettes (art direction, phase A)
Art Director, 2026-11-11. For the Chief Officer at checkpoint 2a (Varun asleep, approvals handed over). Open landfall/prototype/audition.html beside this file: it shows the three type options and the two palettes on Landfall's own hero photo, with every contrast ratio.

Sources: brief.md (with "Client feedback, 2026-11-11"), logs/redesign-note.txt, landfall/references/picks.md, references/shortlist.md and cards.md, the deconstructions landfall/references/deconstruct/kasa.md (new, whole site), references/deconstruct/kasa-hotel-detail.md (hotel page, extended by kasa.md) and landfall/references/deconstruct/european-sleeper.md (new, donor sections), the taste files. Overwing's design/design-spec.md and tokens.css were read only to keep Landfall apart from them.

Placeholders, said once and meant everywhere: "Landfall" and its wordmark are working names, not the client's brand. Market defaults (English, USD, no fee or markup beyond the taxes and fees in the fare data) are Varun's placeholders. Headlines are working copy for judging type; the Copywriter writes the real copy in landfall/content/copy.md. Prices and routes come from the shared mock data in content/copy.md (London origin, six cities). Photos are Unsplash License stock, each checked on its photo page.

## What the client asked for, and where each ask lands
| Client ask (brief, 2026-11-11) | Where Landfall answers it |
|---|---|
| Clean, modern, own identity; ease of use of Booking.com, Expedia, Priceline | Kasa's calm booking system rebuilt whole; the three benchmarks used for technique only (search fields with labels inside, total price first, filter drawer and sticky price bar on phones) |
| Deep navy, white and teal | P-N, Landfall navy, the default: white page, navy for every action and the dark bands, teal from the river for focus, links and highlights |
| A clean, readable font | Three free options, all SIL OFL, none of them Calibre or Geist |
| A prominent search section | The search card sits in the first screen at 1440 under the headline (Kasa), is the first thing under the photo on a phone, and follows the visitor on every inner page as Kasa's pinned compact bar |
| Easy navigation | A plain top bar with text links (Flights, Hotels, My bookings, Help) and Sign in; one full-screen menu sheet on phones. No icon rail, no tab bar |
| Clear pricing | Kasa's price rule: the total for the whole trip first and largest, per traveler or per night second, "taxes and fees included" on every price; the hero caption and every destination card carry a real fare from the mock data |
| Strong travel imagery | A full-viewport photo hero that crossfades between three cities (Kasa), and photos in every card slot |
| A polished mobile experience | 390 designed first: the search card docks over the photo's lower edge (European Sleeper at 390), each field opens a full-screen step (Kasa's sheet), and results, hotel and checkout keep the price in a sticky bottom bar |

## The concept: Landfall (working name, placeholder) [developed from concept C]
**The idea: see the place first, the way you see it arriving from the water.** Every photograph on the site follows one rule: the city seen from the water, sky above, the city on the horizon line, water in front. That is the moment of landfall, the first sight of land, and it is the moment people book for. In the first five seconds the visitor should feel pull ("I want to be there") and, right after it, ease: a real city fills the screen, a search sits right under the headline, and a small caption at the bottom says what it costs to get there.

How the hero expresses it (rebuilt from Kasa's homepage hero):
- Full-viewport, full-bleed photo with no inset or frame (Kasa: 100vh, no radius). Three cities crossfade, one every 6 seconds (Kasa's crossfade carousel, rebuilt with stills and a slow settle-in zoom instead of video): Lisbon from Alfama over the Tagus, Cape Town's waterfront under Table Mountain, Lower Manhattan from the harbour. All three are from the mock data's six cities. A round pause button sits bottom right, as on Kasa, and reduced motion stops on the first photo (Kasa does not; we fix that).
- Kasa's light, layered scrim (a flat navy wash, a deep top gradient behind the nav and headline, a faint bottom haze), measured on every photo until the text passes.
- A centred serif or sans headline (type option below), one subline, then the search card under it in the sky (Kasa's placement in the upper third, so the city in the lower half stays clear).
- The arrival caption: Kasa's property credit line at bottom left becomes the place name plus a fare from the mock data ("Lisbon", "Return from $412 from London"), with one small "Fly here" link that fills the To field. The caption changes with the photo. It is the hero's proof of clear pricing, and the only thing on the photo below the card.
- On scroll the photo zooms slowly (Varun's V5) and the first white band rises over it with rounded top corners (Varun's V7, supported by European Sleeper's band joins).

What carries the idea past the hero, each a small, fixed set of uses:
1. The image rule: every destination photo is seen from the water or across it (harbours, rivers, bays, ferry views). Hotel and room photos are interiors, as the API sends them.
2. The landfall line: the wordmark is lowercase "landfall" with a hairline horizon running under and past it, ending in a short teal segment where land would be. The same line is the route line on every flight leg (departure dot, hairline, teal arrival segment), the underline of the active Flights or Hotels tab, and the rule above the price total in the booking summary. Four uses, never as decoration.
3. Arrival-first information: flight rows and the booking summary lead with when and where you land (arrival time and city set heavier than departure), because that is what the visitor plans around.
Risk: the full-photo hero is the most familiar layout in the category (the original concept C said so). The difference has to come from the image rule, the caption with its price, the type, Kasa's quiet card that grows its own panels, and the line. The crossfade must stay slow and the scrim light, or it turns into a generic slider.

Alternatives I weighed and set aside: (a) docking the search on the hero's lower edge at 1440 as the original concept C did (that came from The Hoxton, which is Overwing's donor, and Kasa places it high; I kept the dock only at 390, where European Sleeper supports it); (b) one hero photo instead of three (simpler, but loses Kasa's signature and the chance to show three real fares).

## The rebuild, section by section
Which source wins where, following the art-direct order. Phase B turns this into the spec.
| Section | Source | How it is rebuilt |
|---|---|---|
| Header | Kasa | 66px frosted strip over the hero (surface at 10%, 6px blur), solid white with a hairline shadow after the hero. Text links, not icons. Hides on scroll down, returns on any scroll up, 400ms with Kasa's small overshoot. At 390: wordmark, My bookings, account and menu buttons; the menu is Kasa's full-screen sheet of grouped links |
| Hero media and scrim | Kasa, plus Varun V5 | Full-viewport crossfade of three stills (6s, 650ms fade), four-layer scrim, pause button; slow zoom on scroll and bottom haze from V5 |
| Hero search card | Kasa; Expedia and Booking.com for field labels (technique only) | One white card, radius 16, 5px padding, hairline border; fields 56px with a small label inside over the value (Kasa shows only placeholder text; labels are needed for From and To); hairline dividers; navy Search button. Flights: From, swap, To, Dates, Travelers and class. Hotels: Destination, Dates, Rooms and guests. Flights / Hotels tabs sit above the card on the photo, the active one underlined with the landfall line |
| Field panels | Kasa | Panels grow out of the card as one surface (same width and radius, 200ms height ease), not floating menus: place list with 42px icon tiles, two-month range calendar, stepper rows, each with a hairline and an underlined Clear |
| 390 search | European Sleeper (390), Kasa (sheet) | The card is the first thing under the photo: stacked fields with hairlines and a full-width Search button, overlapping the photo's rounded lower edge by 32px. Each field opens Kasa's full-screen sheet with a fixed Clear all / Search footer |
| Pinned compact search | Kasa | On results, hotel and flight pages: expanded under the nav at the top, compact bar (radius 12, icon-only button) floating at top 24 after scrolling down, expanded again on scroll up. At 390 a one-line pill showing the current search |
| Popular destinations | European Sleeper (donor) | Price-led cards on the navy ground: radius 24, photo with its own radius, city name 24px, "Return from $412" on its own line, photo zoom 1.1 over 500ms on hover. At 390 each card becomes an 80px row with a 100px thumbnail |
| Band joins | European Sleeper (donor), Varun V7 | Rounded band bottoms (48px at 1440, 32 at 390) with the corner filled by the next band's colour, so navy and white bands rise over each other |
| Flight results | Kasa results, benchmarks for filters | Kasa's row card (radius 16, hairline border, soft shadow) on a single list column, no map; a filter column at 1440 and a filter sheet at 390 (Booking.com and Expedia technique); sort as a select; total price first on every row |
| Hotel results | Kasa results | Kasa's split: 680 list and a sticky map at 1440, map first and short at 390; row cards with photo carousel and the price block |
| Hotel detail | Kasa (kasa-hotel-detail.md) | Kasa's page order and parts, set in Landfall's type, palette and the price rule. Must look plainly different from Overwing's Kasa page (see the note below) |
| Flight details, passenger form, checkout, confirmation, account, dashboard | No reference reached | Built from Kasa's system: cards, hairlines, dialogs, the price block, the landfall line on legs. Booking summary sticky at 1440, sticky bottom price bar at 390 (Priceline and Expedia technique) |
| About, Contact, legal, 404 | Kasa's text styles | One reading column; About and Contact carry photos that follow the image rule |
| Trust footer | Varun V10, European Sleeper (donor) | Navy footer led by phone and email (V10), then link columns, then European Sleeper's trust row: legal entity, address and registration as marked placeholders, "Payments by Stripe", payment marks |

Keeping the two hotel pages apart: Overwing's hotel page uses Hipcamp's type and shell with Kasa's grid. Landfall's uses Kasa's whole page, so it differs from Overwing by type (serif or Landfall's sans against Calibre), palette, the pinned search card, a crossfade-free gallery with a "+N photos" chip, room cards with the price block, and no rail or tab bar. The Critic checks this in the build.

## Conflicts for the Chief Officer
Resolved by the art-direct order unless marked as a call.
1. No logo, so no palette from the logo (V6). As in phase A of Overwing, both palettes are sampled from the hero photo (Lisbon), keeping Varun's role structure and writing every ratio down. Rebuilt from the real logo when it arrives.
2. Headline capitals (call). Varun's capitals with light and bold words are "V+R, unsplit": allowed only where the reference supports them. Kasa sets sentence case, one regular weight, no tracking. So Landfall's headlines are sentence case. The old concept C's capitals are dropped.
3. Search placement. The original concept C docked the search on the photo's lower edge, a technique from The Hoxton (Overwing's donor). Kasa, the primary, sets it high under the headline. Primary wins on layout at 1440; European Sleeper supports the dock at 390 only, where it puts the search in the first screen.
4. Hero call to action. Varun's V5 hero has one trust badge as the call to action and "Scroll to discover". Here the search is the call to action (brief section 4), so there is no badge and no scroll cue; the arrival caption sits where Kasa's credit line sits.
5. Buttons (V9 against Kasa). Kasa's buttons are 8px-radius rectangles. Varun's buttons move wins: pills, sentence case, 15px/600, small arrow, quiet hover. Inside the search card the Search button keeps the card's 12px inner radius, because a pill inside a 16px card reads as a separate object; I flag it as the one exception.
6. Eyebrows. Kasa puts an eyebrow over every homepage section: the anti-slop tell. None are carried over.
7. Motion. Kasa's word-blur heading reveal (600ms expo-out) is the reference's own motion, so it is allowed on section headings and the hero headline; Varun's slow zoom (V5) runs on the hero photo. Kasa's carousel ignores reduced motion; Landfall stops it.
8. Arrival caption content. It shows a fare from the shared mock data. That is a demo fact, not a client fact; it must change with live data. The copy says "from London" because the mock origin is London.

## Type options (all SIL OFL, licence files saved beside the fonts in landfall/prototype/assets/fonts/)
Kasa's own approach is Tiempos Headline (Klim, commercial) for H1 and H2 only, plus TT Norms Pro (TypeType, commercial) for everything else, both at 400 and 500, no tracking, no capitals. Neither can ship. All three options below are free:
- **T1, Kasa's approach in free faces: Newsreader for headings plus Albert Sans for everything else.** Newsreader (Production Type, variable optical size and weight) stands in for Tiempos Headline at 400; Albert Sans (variable 300 to 700) stands in for TT Norms Pro. Closest to the reference. Risk: a serif headline reads "editorial" more than "clean, modern"; it is upright and regular, never an italic accent.
- **T2, one clean family: Albert Sans for everything.** Headings at 500 with -0.02em tracking, UI at 400 and 500. The most literal answer to "a clean, readable font", and the furthest from Overwing (which pairs two sans faces). Risk: less character in the headline than T1.
- **T3, readability first: Atkinson Hyperlegible Next for everything.** Braille Institute's 2025 family, drawn so similar letters cannot be confused (Il1, 0O, rn and m), which matters in booking references, flight codes and prices. Risk: its quirks show at display sizes; it looks more civic than travel.
My recommendation: **T1**, because type should come from the reference and Kasa's calm comes from exactly this serif and sans split, and every interface word is still in a clean sans. If the Chief Officer reads the client's "a clean, readable font" literally, T2 is the safe choice and costs nothing to switch.

## Palettes (sampled from Landfall's hero photo: Lisbon from Alfama, Unsplash, Lisha Riabinina)
Measured with landfall/prototype/tools/palette.py (WCAG 2.x). Samples: sky top #4A7B9C to #5E83A1, river #4B6A76, Cape Town water #3A5C65, sunlit roofs #914E33 to #934E31, lit facade #D0C8B5.
**P-N, Landfall navy (default)**: the client's deep navy, white and teal.
- Navy #0F2747 (the sky hue, deepened): every call to action on light grounds, the dark bands and footer, selected calendar ends. White on it 15.0:1.
- Ink #0B1830: headlines and body. 17.7:1 on white, 15.6:1 on mist.
- Muted #4A5A70: secondary text. 7.0:1 on white, 6.2:1 on mist.
- Teal #0A7C78 (the river, saturated): focus ring, links, selected glyphs, the landfall line on white. 5.0:1 on white (text allowed), 4.4:1 on mist (rings and glyphs only).
- Bright teal #4FD1C1: highlights on navy and on the photo (active tab line, prices on navy cards, focus ring on dark). 8.0:1 on navy; navy text on it 8.0:1 (calls to action on dark grounds, V6).
- Mist #EAF2F4: the one interactive tint (field hover, steppers, chips, calendar range). White #FFFFFF is the page ground; #F4F7F9 the alternate band.
- How it differs from Overwing: Overwing's teal sits at #278B9B and its deep at #1D3A4E or #1F3B41 with sand or blush grounds; Landfall is bluer and darker in the navy, greener in the teal, on pure white, and uses teal as a line and a highlight rather than as a tint. Overwing's new navy palette was not written when I checked its tokens; its Art Director should keep clear of the values above.
**P-H, Harbour gold, re-measured on Landfall's photo (alternate)**
- Sea #173B4F (the river, deepened): calls to action, dark bands. Sand text on it 11.0:1, white 11.8:1.
- Ink #1A1712: 16.6:1 on sand. Muted #5E5548: 6.8:1 on sand, 6.1:1 on shell.
- Terracotta #A34A26 (the sunlit roofs): focus ring, links, the landfall line. 5.5:1 on sand, 5.9:1 on white.
- Gold #E6B56A (lit facades warmed): highlights on sea. 6.3:1 on sea; ink on it 9.5:1.
- Shell #F3E9DC: the interactive tint. Sand #FBF6EF: page ground.
Text on the photo (headline, subline, tabs, caption) is the same off-white in both palettes; the scrim is measured per photo in phase B and recorded in the spec.

## What I could not check, or guessed
- Kasa: the hero's load entrance, the 390 homepage below the hero, the results filters dialog and sort, map hover, and true touch behaviour were not measured (kasa.md, Not measured). The deconstructor pressed "Update" in Kasa's hotel-page dates dialog to see prices; it is a confirm control, not the search form, and nothing was booked.
- Booking.com, Expedia and Priceline were not visited or measured. The techniques named above (labels inside fields, total first, filter sheet, sticky price bar) are general knowledge of how those sites work, used as technique only.
- European Sleeper: menus, pickers and reduced motion were not measured; one of its screenshots is a stray capture (named in its file).
- Photos: Unsplash License confirmed on each photo page ("Free to use under the Unsplash License"). Model and property releases are not provided by Unsplash. The New York original is 2880x1411, so at 1440x900 it is served at about 1.5x, not 2x.
- Fonts: licence files fetched from the google/fonts repository and saved; the woff2 files are the latin subset from Google Fonts, so the build needs latin-ext added if the client's market needs it.
- Names: "Landfall" is not checked for trademarks or domains. Placeholder only.
- Whether Duffel Stays sends enough photos per room for Kasa's room carousel is not checked.

## Choices for the Chief Officer (checkpoint 2a)
1. The concept: Landfall as developed above, or a change to it.
2. A type option: T1, T2 or T3.
3. Confirm the two palettes (P-N default, P-H alternate) or ask for a change.
4. Rulings on conflicts 2 (sentence case), 3 (search high at 1440, docked at 390) and 5 (the Search button's inner radius).
5. Donor: European Sleeper for destination cards, band joins, the 390 search card and the trust row.
