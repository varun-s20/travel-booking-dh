# Landfall: build handover
Developer, 2026-11-11 (final pass 10:57 to 12:20). Landfall is the second of the two travel-booking designs (concept C: the full photo hero with the search docked across its lower edge; primary reference Kasa, donor European Sleeper). Working name, wordmark, contacts, legal facts and every fare are placeholders or mock data. For Varun and the Chief Officer. Detail: build/progress.md, build/qa-report.md, build/plan.md.

## Pages built (landfall/site/, Next.js App Router, plain CSS)
| Area | Routes | Built by |
|---|---|---|
| Home | / (hero with three crossfading water cities and the search card, popular destinations, what happens when you book, pre-footer, footer) | foundation session |
| Flights | /flights (searching, still looking, results, filters and sort sheets, show more, no flights, search failed, filters hiding everything, prices expired), /flights/[offer] (timeline, fares, conditions, summary, fare up and down, sold out, expired with Refresh), /flights/[offer]/passengers | group F |
| Booking | /checkout (flights and stays; decline, insufficient funds, expired card, bank check, not confirmed, fare changed before pay), /confirmation/[ref] (flight and stay, tickets issuing), /emails and nine email previews | group F |
| Hotels | /hotels (list and sticky map, chips, sort, map first at 390, Add dates for prices), /hotels/[hotel] (arrival view and gallery, about and amenities, room rail and Room details, Good to know, Location, Other hotels, pinned Your stay, 390 price bar), /hotels/[hotel]/guests | group H, finished in the final pass |
| Account | /login, /register, /forgot-password, /reset-password (and the expired link state), /account, /bookings (Upcoming, Past, next trip card, empty and signed-out states), /bookings/[ref] (itinerary, travelers, documents, manage and cancel, payment) | group H |
| Pages | /about, /contact (form with real status), /terms, /privacy, the 404 and the error page | group H |

Two palettes from one codebase: navy (default) and Harbour gold (alternate), chosen at build time. Everything except the palette is identical.

## Critic scores, every Landfall round
| Round | Scope | Overall | Design | Originality | Craft | Functionality | Tells |
|---|---|---|---|---|---|---|---|
| 1 (Art Director, prototype) | nav and hero, both palettes | 6.25 FAIL | 7 | 6 | 5 | 7 | none |
| 2 (Developer, home) | home, both palettes, 1440 and 390 | 6.45 FAIL (hero re-score 6.45 at 1440, 6.55 at 390) | 7 | 6 | 6 | 7 | none |
| 3 (Developer, group F) | flight flow search to confirmation, 1440 and 390 | 7.4 FAIL | 7.5 | 7 | 7.5 | 8 | none |
| 4 (Developer, final pass, xhigh) | whole site, navy 1440 and 390, Harbour spot checks, group H for the first time | about 6.9 FAIL | 7 | 6.5 | 7 (capped by one overlap, since fixed) | 8 | none |
Fixes after each round were checked in the browser and were not re-scored. Group H's own critic round is unrecorded: Detail.tsx says a round 1 asked for the hotel page to read as Landfall's own, but the restart at 06:19 came before its scores reached progress.md or the log. Round 4 (report: build/critic/final-pass-report.md) is a partial pass by the critic's own account: it focused on group H and did not view about half the pages (listed in the report).

## Final pass: what changed
Before the critic (group H review and open items):
- Hotel detail had no CSS for its rewritten layout (every photo 1248 wide, 480 files at 2.6x, rooms as one column): the arrival view, two columns with the pinned Your stay card, the stay leg and the room rail written in hotels.css. The image script rerun for the 1600 width it already listed.
- The pinned search no longer shows twice at 1440 (the open search replaces the bar); dateless hotel pages read "Hotels in Lisbon", "Add dates"; the footer photo at 390 at 1x; no stand-in photo on the no-results panel for a city outside the set; the stale-manifest workaround removed.

After the critic, worst first (each checked in the browser on fresh production builds of both palettes):
1. (blocking, craft cap) The open search floated over the results with the header gone: the page now dims edge to edge behind it, and a click on the dimmed page closes it.
2. (blocking, originality) The concept now shapes the hotel page: the stay is drawn across the arrival photo (check-in date, the landfall line with "4 nights" on it, the landing dot, check-out date) in an ink chip like the home hero's arrival caption.
3. The lead photo: every hotel now leads with its first outside photo that shows the water (Casa Lanterna: the white houses stepping down to the river, not the blurred terrace table), on the hotel page, the result cards, the guest summary and My bookings.
5. Booking Payment cards show the unit line ("$186.00 per night", "$642.30 per traveler") before "taxes and fees included".
6. The 390 hotel price bar reads "From $744 total", then "$186 per night, 4 nights", then "taxes and fees included".
8. Amenities in three even columns at 1440 (no ragged wraps); the description held to 68 characters.
9. The room rail no longer clips its cards' shadows.
10. The results subtitle at 390 wraps evenly.
11. A quiet scrollbar inside dialogs (the gallery).
13. The header's Sign in slot waits, unseen, until the session is read, so a signed-in visitor never sees "Sign in" flash.
Also: square strip thumbnails at 390 (spec 2b; later replaced at 390 by the Chief Officer's arrival, below).

After the Chief Officer (call 1), both checked on fresh builds of both palettes:
- Harbour's actions fill with its own gold and an ink label (tokens.css Harbour block; checkbox mark ink).
- Hotel detail at 390: the arrival photo edge to edge (4:5, 800 file at 0.91x), title and meta on a scrim over it, the stay leg at its foot, no strip, a "10 photos" chip that opens the gallery.
- After call 2 (note 5): the confirmation's pale-green "Booking confirmed" pill, which matched Overwing's component, is now Landfall's own mark (the landing dot ringed in foam, navy text, no pill). Checked in both palettes; not seen by the Chief Officer.
Not fixed then: 4 (gallery and 404 photos that do not read as Lisbon; done in the icons and photos pass, below), 7 (Harbour's petrol action fill: by design, see Decisions), 12 (first clicks before hydration and the Filters sheet's empty space: low confidence, not reproduced).

## QA status
Clean on production builds of both palettes at 1440 and 390, 29 URLs each (every route, signed in and out): no console errors, no failed requests (the 404 page's own status aside), no image shown above its resolution, no horizontal scroll, one h1 per page, alt on every image, no dashes or placeholder words in rendered text, no AI attribution in the source. Both builds compile cleanly with the type-check. Full table: build/qa-report.md, "Final pass".
Not checked: real touch devices, Safari and Firefox, DPR 2 and 3, screen readers, 641 to 1024 beyond spot checks.

## How to preview both palettes
From projects/travel-booking/landfall/site/ (no install needed; packages are already in node_modules):
- Navy (default): `npm run build:navy` then `npm run start:navy`, open http://localhost:3003
- Harbour gold: `npm run build:harbour` then `npm run start:harbour`, open http://localhost:3004
- While editing: `npm run dev:navy` (3003) or `npm run dev:harbour` (3004).
Each palette builds into its own folder (.next-navy, .next-harbour), so both can run side by side. Overwing uses 3001 and 3002.

## Demo script (about 6 minutes, navy at 1440, then the same on a phone width)
1. **Home.** Let the hero cross from Lisbon to Cape Town to New York; point at the arrival caption with a real fare ("London to Lisbon, return from $412") and the pause button. In the card: To, pick Lisbon (Dates opens itself), Nov 20 to Nov 27, Search flights.
2. **Flight results.** The landfall line on every leg ("2h 45m, nonstop", landing dot), the total first with per traveler and "taxes and fees included". Filter to Nonstop only, open Sort. Click the dates in the pinned bar: the search opens in place of the bar.
3. **Flight details.** The itinerary as a vertical landfall line, choose a fare, see price breakdown, Continue to passengers.
4. **Travelers and checkout.** Submit empty to show the error summary ("Adult 1: Choose a title."), fill it, pay with 4242 4242 4242 4242. To show a decline, use one of the deck's decline cards first.
5. **Confirmation.** "You're going to Lisbon" with the landfall line under it, the reference with Copy, e-tickets issuing then numbers.
6. **Hotels.** From the confirmation, Search hotels in Lisbon. The list and sticky map with price pills; open Casa Lanterna: the arrival view, Your stay drawn as a leg from check-in to check-out with "4 nights" on it, the room rail, Select a room, the guest form, checkout, the stay confirmation.
7. **Account.** Sign in with any email and an 8-character password (signs in as Maya): My bookings with the next trip card, a flight booking, a stay, the canceled Rome stay; Profile.
8. **Pages.** About, Contact (send the form empty to show the errors), a wrong URL for the 404.
9. **Harbour.** Repeat step 1 and step 6 on http://localhost:3004: same layout, Harbour gold palette.
10. **Emails.** /emails lists the nine email previews.

## Decisions for Varun (provisional, taken under the run-straight-through instruction)
1. **Teal fills every button (Palette distinctness).** Your V6 and Kasa put navy on calls to action; Landfall uses teal with an ink label so it shares no roles with Overwing. Provisional (choices.md).
2. **Navy darkened to #16225A** after the Chief Officer found #1B2A6E read royal; the ink pre-footer and footer approved by the Chief Officer.
3. **Serif headings (Newsreader) or Albert Sans only**, if the client reads "a clean, readable font" literally: a token swap.
4. **The concept on inner pages:** the landfall line only on flight legs, the stay itinerary, above every booking total and on the confirmation; the destination's own water photo heads the trip summary (a spec 2b change by group F).
5. **No stand-in photo** when a searched city has no water photo of its own (final pass): the no-results panel goes without a photo rather than show water from somewhere else.
6. **Hotel page arrival view:** at 1440 one wide lead photo with the stay drawn across it and a strip of four under it, "Your stay" pinned at right (in place of the spec's 5-up grid); at 390 the photo runs edge to edge with the title, the stay and a photo-count chip on it, no strip (Chief Officer's note 2, to break a skeleton Overwing's phone hotel page shares). Approved by the Chief Officer.
7. **Harbour's actions are now gold with an ink label.** I had argued Harbour should keep its approved sea-navy fills; the Chief Officer overruled it, because those fills collided with both of Overwing's palettes. Changed in landfall/design/tokens.css (Harbour block: --c-action gold #E6B56A, --c-on-action ink, ink on gold 9.5:1). If you prefer the old sea fills, revert those three lines, but they then sit close to Overwing.
8. **Hotel lead photo by the image rule:** the first outside photo whose caption shows the water leads everywhere (final pass); cards and the gallery strip follow.

## Open items for the client
- Everything in landfall/content/copy.md "Questions for the client" (content/copy.md's 15, plus 16 card brands, 17 struck-through and scarcity lines, 18 the three hero cities and the departure city behind the caption fare).
- Name, wordmark, contacts, legal entity, address and registration: placeholders, marked.
- Duffel Stays approval (hotel and room photos are Landfall stock stand-ins until Duffel sends real ones; airline logos come from Duffel live, the demo shows codes).
- Map tiles: the demo loads OpenStreetMap's public tiles; production needs a tile provider account in the client's name.
- Photo licences: every photo is Unsplash License, listed with its page in public/images/credits.md; nothing upscaled. New York's hero file is a 1.5x source at 1440 (Art Director's note); replace it if the client wants it sharper.

## Open items for the studio
- **Icons: done (12:00 to 12:20).** Landfall's sprite is redrawn from scratch in its own language (20px grid, fine 1.25 line, square caps, mitre joins; two lines at the top of components/chrome/Sprite.tsx). The Chief Officer confirmed the two sets read plainly different (call 3).
- The home hero caption may change a moment before its photo shows (Chief Officer note 4, one frame at 390, low confidence).
- Copy: "Booking not completed" has one subject for the flight and hotel emails (copy.md gives only one); the Copywriter should add a hotel subject.
- Photos: done. The River View Double (a window over trees to the Tagus), the Terrace Suite (French windows over red roofs to the river and the 25 de Abril bridge) and the 404 (a gull on a pillar at the Lisbon quay) are new Unsplash License photos, in credits.md and the mock data; confirmed by the Chief Officer. At 1440 the 404's river sits behind the search card; the pillar and gull carry it.
- Confirmation mark: confirmed as Landfall's own (call 3). Optional: a slightly larger landing dot so its foam ring shows.
- Image sizes (seen in this pass, older than it): the "Other hotels" cards on the hotel page ask for 251px in a 404px slot (sizes attribute); the home hero renders its 1600 file at 1638 during its scale motion.
- Icons not seen in use by anyone yet: toasts, the travelers stepper, filter and sort sheets at 390, the Room details dialog.
- Group H's own critic round 1 scores were lost in the restart; the final pass stands in for them.
- Not checked by anyone in this pass: forms submitted by the critic (its rules), keyboard tabbing through group H, reduced motion on group H, touch devices, Safari and Firefox, 641 to 1024.
- A critic screenshot landed at the studio root by mistake: h-results-1440-studio.png (the critic is read-only and could not delete it; delete it if you like).

## Chief Officer checkpoint (final build, three calls, foreground)
- **Call 1: APPROVED WITH NOTES**, notes 1 and 2 blocking. Landfall is plainly its own design on home, flight results and confirmation, and answers the client's five asks. Side by side with Overwing (3001, 3002) it found three shared things: the 390 hotel page skeleton (fixed), Harbour's petrol fill against Cabin dawn's (fixed), and the icon sprite (open, above). The 1440 hotel section order, flight results layout, stacked mobile search card and the signature footer were accepted as Kasa or benchmark technique, or Varun's own footer. Rulings: decision 5 approved, 6 approved (at 390 after note 2), 7 overruled, 1, 2, 4 and 8 confirmed, 3 keep Newsreader.
- Note 1 (Harbour gold actions) and note 2 (390 hotel arrival): fixed and checked in the browser on fresh builds of both palettes.
- **Call 2: APPROVED WITH NOTES, the approval holds.** Both blocking notes confirmed in the browser (Harbour gold actions with ink labels at 390 and 1440; the 390 hotel arrival now plainly different from Overwing's). Nothing else had to change before 12:20. Still open for Varun: note 3 (icon sprite redraw; it holds up sending both designs to the client), note 4 (caption timing), note 6 (three photos), note 7 (the stray screenshot). Note 5 was done after the call. No deploy, install or git action approved; those stay with Varun.
- **Call 3 (12:14 to 12:17, icons, photos and the confirmation mark): CONFIRMED WITH NOTES.** Notes 3, 5 and 6 confirmed in the browser beside Overwing (3001, 3002). Its note 1 (the 404 crop cut the gull) was fixed and checked in both palettes at 1440 and 390; its note 2 (a larger confirmation dot) is optional and open. Sending both designs to the client is no longer held up by the icons; Varun decides.
