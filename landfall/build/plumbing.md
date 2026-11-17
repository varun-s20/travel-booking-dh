# Landfall app skeleton: plumbing (Developer, 2026-11-11)

Non-visual setup of `landfall/site/`, from Varun's brief and logs/redesign-note.txt. Nothing visual was copied or made: no components, CSS, fonts, icons, photos, images manifest or palette tokens. `landfall/design/` was not opened or touched. No packages installed (node_modules was already there, same versions as site/).

Result: `npm run build:navy` passes (and `build:harbour`). `start:navy` was run once on 3003 to check the API: Lisbon flights return 86 offers, Lisbon stays return 5 hotels with Casa Lanterna at $744.00 for 4 nights (copy.md's figure), the 0002 test card declines, the contact route answers `delivered: false`. Server stopped, ports 3003 and 3004 closed.

## Copied from site/ with only the header line changed
Every copied file's banner says "Landfall, working name, a placeholder" in place of "working name Overwing, a placeholder".
- lib/mock/geo.ts, lib/mock/flights.ts, lib/mock/bookings.ts
- lib/mock/server.ts (also a comment now names Overwing's design-spec.md 3b as the source of the latency figures)
- lib/dates.ts, lib/format.ts, lib/text.ts (text.ts is all logic: sentence builders, so it came whole)
- app/api/: contact, flights/search, flights/offers/[id]/check, flights/orders, hotels/search, hotels/bookings, payments/intents, payments/intents/[id]/confirm. The two search routes' comments now point at Overwing's design/handover.md for the demo states.

## Copied with changes
| File | Change | Why |
|---|---|---|
| lib/cabins.ts | Copied though not on the list; comment on `short` reworded | text.ts, flights.ts and bookings.ts import it, so the build needs it. It is data (cabin classes) |
| lib/store.ts | localStorage key `overwing:v1` to `landfall:v1` | Each demo keeps its own visitor state if both ever run on one origin |
| lib/client.ts | Events `overwing:search` and `overwing:toast` to `landfall:search` and `landfall:toast` | Namespaced to this app |
| lib/mock/hotels.ts | All 25 photo lists emptied (8 hotels, 17 rooms); `AMENITY_ICON` and the `p()` photo helper removed; banner and two comments updated | The photo names were Overwing's image files and the captions described its photos; the icon map pointed at Overwing's sprite. Types `PhotoCat`, `HotelPhoto`, `Hotel.photos` and `Room.photos` stay, for Landfall's own photo keys |
| lib/data/destinations.ts | `image` and `alt` removed from every destination and made optional in the type; banner updated | Same: Overwing's photo keys, and alts rewritten to match Overwing's sourced photos |
| lib/data/places.ts | Banner no longer says the names are kept to Calibre and Geist's characters | That was Overwing's font limit; see assumption 8 |
| lib/emails.ts | Kept `EMAILS` (subjects, previews, blocks) and the footer wording, now `EMAIL_FOOTER`; added `emailContent(id, origin)`; kept `esc()`. Removed `COLOURS` and `renderEmail()` | The renderer was Overwing's email design (palette colours, radii, the wordmark PNG). "Overwing" in two subjects, one paragraph and the footer now reads `SITE.name` |
| lib/site.ts | `name` is 'Landfall'; `wordmark` dropped; phone, email, `url`, `ROUTES`, `DEFAULT_ORIGIN` unchanged | The wordmark's form is design. 'Landfall' as the working name is provisional: it follows how Overwing's concept name became its working name, and landfall/content/copy.md may change it |

## New files
- lib/palette.ts: `Palette = 'navy' | 'harbour'`, default navy, read from `NEXT_PUBLIC_PALETTE`. No colours and no `THEME_COLOR` (Overwing's has one): those are palette tokens and wait for landfall/design/tokens.css.
- next.config.ts: as Overwing's, with navy as the default and `.next-navy` / `.next-harbour` build folders. The dev badge comment no longer mentions Overwing's phone tab bar.
- tools/run.mjs: as Overwing's, ports navy 3003 and harbour 3004; dev builds in `.next/dev-<palette>` for the same Turbopack reload-loop reason.
- tsconfig.json: as Overwing's, with type includes for the navy and harbour build and dev folders only (Overwing's lists its cabin, harbour and Studio Lead preview folders). Next did not rewrite it on build.
- package.json: scripts replaced with dev, dev:navy, dev:harbour, build:navy, build:harbour, start:navy, start:harbour (`dev` runs navy). The `images` script was removed: tools/images.mjs belongs to Overwing's photo set and was not copied. Dependencies untouched.
- .gitignore (as Overwing's, with navy and harbour folders), README.md.
- app/layout.tsx: `<html lang="en" data-palette>`, a `data-app` wrapper, `<main id="main">`, title from `SITE.name`, `noindex`. No head script, fonts, CSS, icons or theme colour.
- app/page.tsx: an h1 and one line saying it is the skeleton.

## Not copied
- components/, app/styles/, app/fonts/, public/ (fonts, icons, images, credits.md), assets-src/, lib/images.manifest.json, tools/images.mjs and images.config.json: visual layer, per the brief.
- All pages (home, flights, hotels, checkout, confirmation, bookings, account and auth, about, contact, legal, error, not-found): they are design. Their non-visual logic worth reusing is listed in assumption 12.
- app/emails/ (the email preview routes): they render Overwing's email HTML. Landfall's build adds its own on top of `emailContent()`.
- tools/qa/page-checks.js: not on the list. It checks rather than styles, so Landfall's Developer may copy it once the pages exist, after checking it holds no Overwing selectors.

## What the copied logic still assumes about Overwing's design
Each is for Landfall's Developer to keep, adapt or drop once landfall/design/design-spec.md exists. None blocks the build.
1. **Search bus, lib/client.ts.** `requestSearch(mode, seg)` exists because Overwing's entry cards and pre-footer open the hero search on a tab. `SearchMode` is a flights or hotels toggle, and `seg` ('from', 'to', 'dates', 'who', 'place') names the cells of Overwing's search pill. Landfall's docked four-field search (Kasa) will have its own fields and may not need a bus at all.
2. **Toasts, lib/client.ts.** `toast()` only dispatches an event; Overwing's components/chrome/Toaster.tsx shows it. Landfall needs its own listener or toasts go nowhere.
3. **Dialogs, lib/client.ts.** `setAppInert()` looks for `[data-app]`, Overwing's app wrapper. The skeleton layout keeps the attribute; Landfall's layout must keep it on the wrapper around everything except dialogs rendered into `<body>`.
4. **Breakpoint, lib/client.ts.** `MQ_DESKTOP` is `(min-width: 1025px)`, the conventions' step and Overwing's. Check it against Landfall's spec.
5. **Cabin short labels, lib/cabins.ts.** `short` ("Premium") was sized for Overwing's search cell.
6. **Date formats, lib/dates.ts.** "Nov 20 to 27" was chosen for Overwing's search cells (copy.md). Landfall's copy deck may want other forms; the helpers stay valid.
7. **Destinations, lib/data/destinations.ts.** `REGIONS` drives Overwing's region filter pills, a technique from The Hoxton, which is Overwing's donor only; Landfall should not rebuild that look from Overwing. `from` prices are display strings ("$412"), not cents, because Overwing's cards print them as they are. `destinationHref()`'s comment assumes the whole card is one link.
8. **Place names, lib/data/places.ts.** Overwing kept names to characters its fonts cover (no Latin Extended-A). With Landfall's own font, check coverage before adding names with such characters.
9. **Hotel data, lib/mock/hotels.ts.** `lat`, `lon` and `CITY_CENTRE` feed Overwing's stay map and its "Closest to the center" sort. `cardAmenities` is three per hotel because Overwing's result card shows three with icons. The `card` blurbs were written for Overwing's result cards. Photo categories Rooms, Inside and Outside are copy.md's gallery headings (both designs draw on Kasa's gallery, so they may still fit). Photo lists are empty until Landfall's photos are sourced.
10. **Demo states in the API.** Search latency, the 5 s long-haul and Tokyo waits, the one-time failures (Toronto to Cape Town, Sydney), price changes, sold-out and unconfirmed offers, the sold-out Terrace Suite and the 8 s `TICKETS_DELAY` ("The airline is issuing your e-tickets") were set so Overwing's searching, still looking, try again, price change, sold-out and ticketing screens can be seen (Overwing's design/handover.md). Landfall's design needs those states too, or these values should change.
11. **Checkout drafts, lib/store.ts.** `PassengerDraft` keeps date of birth and passport expiry as separate day, month and year fields because Overwing's passenger form has three inputs. A Landfall form with one date input would need to map to and from these fields or change the type.
12. **Page logic left in Overwing's pages.** `parseFlightSearch()` and `parseStaySearch()` return `complete: false` when they filled in dates or travelers; Overwing's app/flights/page.tsx and app/hotels/page.tsx then redirect to the full URL, and to `/#search` (Overwing's home anchor) when there is no route. Landfall's results pages should do the same redirect to their own search anchor. The checkout page's `notFound()` checks on offer, hotel and room ids are the same kind of reusable logic.
13. **Emails, lib/emails.ts.** Overwing's renderer used a per-palette wordmark PNG at `/images/email/wordmark-<palette>.png` and its palette colours. Landfall's renderer needs its own, built from `emailContent()`.
14. **Shared copy.** Hotel descriptions, policies, airline and fare names, the demo account and every email sentence come from content/copy.md, the shared mock data set. If landfall/content/copy.md rewrites any of them, update lib/mock/, lib/text.ts and lib/emails.ts to match.
15. **Placeholders.** Both demos show the same placeholder phone and email (copy.md). Fine while they are placeholders; the client's real contacts replace both.
