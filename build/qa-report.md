# QA report: travel-booking, Home

## Session 4: polish round (2026-11-11), production builds, both palettes
Checked with the Playwright browser tool after the last fixes; desktop Chromium, DPR 1, no touch emulation.
- Builds: build:navy and build:cabin compile with no warnings; type check clean (four rebuilds this session, the last after the Chief Officer note).
- Text scan of site/app, components and lib: no em or en dashes, no AI attribution, no lorem or TODO (the images manifest carries the convention's generated-file banner).
- Console and network: Home, hotel results, hotel detail, flight results, both confirmations and Bookings, in navy and Cabin dawn, at 1440 and 390. No console errors or warnings, no 4xx or 5xx responses, no horizontal scroll. Requests listed as failed were all aborted by the next navigation (prefetches and map tiles of the page being left).
- Map seams: pixel scan at every tile boundary of the results map and the Location map at 1440; the share of lighter columns at a boundary (0.02 to 0.27) matches ordinary rows (0.11 to 0.20). A seam would read near 0.9.
- Measured fixes: hotel cards 353px with every total at one height (1440), natural heights at 390 with the title 16px under the photo; date selects 16px in, "Day" 28.5px in 34, "September" 82 in 92, "1987" 35 in 42 at 390; footer x 104 to 1424 matching the band; summary tops 306/306 (flight details) and 251/251 (checkout, logged out); Back to results y 1200 to 1200; map pins show the stay totals, no two overlapping, in both palettes and on the phone map.
- Not re-run this round: the full 14-page page-checks.js batch, reduced motion, contrast sampling (no colours changed), keyboard tab-through (focus order checked only for the new Log out list and the Map button returning focus after the map closes).

## Session 3: Overwing revision (2026-11-11), production builds, both palettes
Runner: site/tools/qa/site-checks.js (page-checks.js over a list of pages; batches in build/qa-shots/qa-*.js). Navy (3001): 14 pages at 1440 and 390. Cabin dawn (3002): home, flight results, hotel detail, checkout, About, 404 at 1440 and 390.
- Builds: build:navy and build:cabin compile with no warnings; type check clean.
- Text scan (app, components, lib, tools, credits, README): no em or en dashes, no AI attribution, no lorem, TODO or bracketed template text.
- Network and console: no failed requests and no console errors on any page, except the 404 page's own 404.
- Media: no image drawn above its file's width after two fixes (entry photos re-cropped to 3:2 for the taller 3:2 cards; hotel card photos get a 624px sizes hint for the 220px card). No missing alt. Every image fills its slot.
- Keyboard: skip link first on every page and lands on main; every stop shows a ring, with three script blind spots checked by eye: the destination cards draw their ring on the window inside the link, the range sliders (ring restored to the standard outline after this run), and the airline "Only" buttons that show on hover or focus.
- Contrast (text against the first solid ground): lowest real pair 5.04:1 in Cabin dawn (an inactive filter tab) and 5.45:1 in navy (the cancellation chip). Flags that are not real: "Flights" on the hero toggle measured against the track instead of the white thumb under it (ink on white 17.4:1); white text on the About banner and on the hotel grid's "+" chip, both over a scrim the script cannot see (checked by eye); the phone Map pill measured while it was fading out over the footer (white on navy 14.3:1).
- Empty space: no stretch over half a viewport without text or media.
- Layout by eye: home at 1440 (windows 256 x 345, panel ends at 898 on a 900 screen), 1024 (the pill with the arrow-only Search), 390 (both window tops 70px above the tab bar, Search ends at 584); flight results 1440 and 390; hotel results; room cards; About, Contact and 404; Cabin dawn home.
- Behaviour: a tap on a phone cell opens the sheet on that cell with its picker ready; Escape closes the picker, then the sheet, and focus returns to the cell; a failed phone search opens the sheet on the failing cell with the message in view. Rail Flights and Hotels mark the product in use.
- Not checked: real phones, Safari, Firefox, screen readers; the hero contrast sampler (prototype/tools/sample_contrast.py) was not re-run on the new photo, because every text box on the hero sits on the navy wall or the white pill, not on the photo.
Developer, 2026-11-10. Production builds (`npm run build:harbour`, `build:cabin`, then `start:*`), Harbour gold on :3001 and Cabin dawn on :3002, desktop Chromium through the Playwright browser tool. Browser checks run from site/tools/qa/page-checks.js; text checks with a Python scan over every shipped file in site/app, components, lib, tools and public.

## Results before critic round 1
| Check | 1440 Harbour | 390 Harbour | 1440 Cabin | 390 Cabin | Notes |
|---|---|---|---|---|---|
| Copy tells: em or en dashes, AI attribution | pass | pass | pass | pass | 43 files scanned, 0 hits. Next's generated AGENTS.md was removed and turned off (`agentRules: false`) |
| Placeholders: lorem, TODO, bracketed text, visible "placeholder" | pass | pass | pass | pass | The one demo notice in the footer names the placeholders (approved at 2b) |
| Media never shown above its own resolution | pass | pass | pass | pass | Real pixel width of the chosen file against the drawn width (cover included). Fixed on the way: destination, trust and footer `sizes` were under the drawn width |
| Responsive sizes | pass | pass | pass | pass | Every image is a `<picture>` with WebP widths from lib/images.manifest.json and a JPEG fallback |
| Network: no 404s on load | pass | pass | pass | pass | Fixed on the way: production prefetch of links to pages not built yet logged 9 404s; components/AppLink.tsx now prefetches built routes only |
| Console: no errors, no unused preloads | pass | pass | pass | pass | Calibre Bold and the hero view are preloaded and used; 3.5s wait for the unused-preload warning |
| Visible focus on every stop | 24 of 24 | 27 of 27 | 24 of 24 | 27 of 27 | Search cells ring the whole cell (accent), dark grounds use the soft accent |
| Skip link first and working | pass | pass | pass | pass | Focus lands on main |
| Alt text on meaningful images | pass | pass | pass | pass | Decorative: windows 2 to 4, footer photo (alt="") |
| Body text 4.5:1 | pass, lowest 5.17 | pass, lowest 5.99 | pass | pass, lowest 5.67 | Lowest everywhere is the inactive toggle label or the muted note under the grid. 71 and 62 text elements measured against the first solid ground |
| Text over media | none | none | none | none | Only the footer sits over a photo, at 12% under ink |
| Reduced motion | pass | not run | not run | not run | Emulated at 1440 Harbour: blinds at rest from the first frame, no drift, every transition 0s, 0 running animations |
| Layout at the screen stops | pass | pass | pass | pass | Captures in .playwright-mcp/ (home-1440-*-studio-dev.png, home-390-*-studio-dev.png). No horizontal scroll. Fixed: fact chips ran to three rows at 390 (self-hosted Geist 1.6px wider than the prototype's) |
| Header collisions | pass | pass | pass | pass | Fixed: the desktop account cluster sat on the region pills and cards while scrolling; it now tucks away on the way down and returns on the way up |
| Empty stretches over half a viewport | none | none | none | none | |
| Reveals visible after scrolling down and back | pass | pass | pass | pass | The blinds are the only entrance motion; no other reveals |
| Copy matches content/copy.md | pass | pass | pass | pass | Every home string present. Three alts adjusted to the photos actually sourced (copy.md note 12), listed in progress.md |
| Composition: images fill their slot, none under half its width | pass | pass | pass | pass | |

## Functional checks (1440 and 390, Harbour)
- Empty submit: "Choose the city or airport you are flying from." with focus in From and no popover over the message.
- "lon" ranks London Heathrow and London Gatwick above Barcelona; Enter picks; focus moves to To. "Lisbon" then Tab is accepted (code LIS on the label row) and Dates opens.
- Range calendar: hover band, the band stops at Saturday with a round end, hint "Nov 20 to 27, 7 nights"; one way shows "Fri, Nov 20" and "Departing Friday, Nov 20"; switching back restores the return date.
- Travelers: 2 adults and 2 infants give "4 travelers, Premium" and the lap-infant line; Escape closes the popover.
- Submit routes to /flights?from=LHR&to=LIS&depart=2026-11-20&return=2026-11-27&adults=2&children=0&infants=2&cabin=premium_economy (the results page is the next build; for now it lands on the 404 page).
- Phone: trigger opens the full-screen sheet (page inert, focus on Close), pickers open inline, the trigger summarises "Flights, Nov 20 to 25 / To Tokyo", Escape closes and focus returns. Entry card "Find a hotel" opens the sheet on Hotels. More opens the bottom sheet and returns focus.

## Final pass, after critic rounds 1 and 2 (production builds, same tools)
| Check | 1440 Harbour | 390 Harbour | 1440 Cabin | 390 Cabin |
|---|---|---|---|---|
| Failed requests, console errors or warnings | none | none | none | none |
| Images above their own resolution | none | none (the last two rail cards load when swiped into view, at 400w) | none | none |
| Missing alt | 0 | 0 | 0 | 0 |
| Keyboard stops with a visible ring | 42 of 42 | 35 of 35 | 42 of 42 | 35 of 35 |
| Lowest text contrast | 5.17 (inactive "Hotels") | 5.99 (fares note) | 5.04 (inactive "Hotels") | 5.67 (fares note) |
| Horizontal scroll | none | none | none | none |
| Page height | 4,219px | 4,134px (was 7,176) | 4,219px | 4,134px |
- Search reached from the 404's "Start a search": From focused with its ring at 1440; the sheet opens at 390.
- Footer over the band: a 32px rounded overlap, no seam at 390.
- Account cluster: tucked past 160px of scroll at 1440, shown at the top and whenever it holds keyboard focus.
- The 404 document itself returns HTTP 404 by design; that status is the only "error" the browser logs on it.

## Not checked
- Real phones and touch, Safari and Firefox, screen-reader output (roles and names inspected only).
- Reduced motion was emulated on Harbour 1440 only; the CSS is shared, so the other three behave the same, but they were not run.
- Motion smoothness frame by frame: headless Chromium holds transitions until a frame is painted.


# Session 2: remaining pages (Developer, 2026-11-10 to 11)
Production builds (`npm run build:harbour`, `build:cabin`, then `start:*`) unless noted; desktop Chromium through the Playwright browser tool. Browser checks from site/tools/qa/page-checks.js, run in batches; text checks with a Python scan over every shipped file in site/app, components, lib, tools and public.

## Results
| Check | Harbour gold | Cabin dawn | Notes |
|---|---|---|---|
| Builds and types | pass | pass | `tsc --noEmit` clean; both production builds with no warnings |
| Copy tells: em or en dashes, AI attribution | pass | pass | 118 files, 0 hits |
| Placeholders: lorem, TODO, bracketed text | pass | pass | only JSX double braces matched |
| Failed requests and console errors | pass | pass | none on results, details, travelers, hotels, hotel detail, confirmation, About, Contact, log in; the 404 page returns 404 by design. Simulated failures answer 200 with an errors body so declines leave no red console line |
| Media above its own resolution, missing alt | pass | pass | 0 upscaled, 0 missing alt at 1440 and 390 (DPR 1) |
| Horizontal scroll | pass | pass | none at 1440 or 390 |
| Lowest text contrast | 5.17:1 | 5.04:1 | inactive toggle labels and the fare rows' muted notes |
| Keyboard focus | pass | pass | skip link first and working on every page; rings on every stop. Checker flags it can't see: the fare radios ring their row, the stay cards ring the card (both by :has) |
| Text over media | pass | pass | About banner under the ink scrim (critic sampled: subline 6.65:1, headline 4.44:1 at its worst pixel, large text); the +N photos chip deepened to ink 66% |
| Reduced motion | pass | not run | the searching window and shimmer stop, the spinner slows, accordion and toasts appear without motion |
| Empty stretches | none | none | |
| Flows end to end | pass | pass | flights and hotels from search to confirmation with 4242; the 0002 decline and retry; log in, dashboard tabs, booking detail and cancel; contact demo result |

## Fixed on the way
- Dev server reload loop: Turbopack watched its own cache in .next-harbour; dev now builds into .next/dev-<palette>.
- 390 results ran 424px wide (the implicit grid track grew to the chip row); the desktop sort pill showed on phones.
- Footer and More-menu Log out rendered as bare browser buttons.
- The desktop compact bar floated with cards sliding past it; it sits in a ground band now.

## Not checked
Real phones and touch, Safari and Firefox, screen-reader output, tablets and landscape phones (layout rules only), retina sharpness (DPR 1 only), reduced motion in Cabin dawn (the CSS is shared).

## Round 3, Developer A (homepage Part A and footer), 2026-11-11, before the critic (about 16:00)
Shared dev server http://localhost:3001 (navy). Cabin dawn (3002) not running this round: not checked.
- Copy tells: no em or en dashes in my files (grep of components/home/r3, FooterCols, Footer, lib/mock/home.ts, lib/recommend.ts, lib/history.ts, r3 CSS). No AI attribution. No lorem, TODO or bracketed template text.
- Console and network: no console errors or warnings on / in either mode at 1440; no 4xx or 5xx responses after a full scroll in hotel mode; no broken images.
- Layout: no horizontal page scroll at 390 or 1024 in either mode (scrollWidth 390 and 1024). Full-page captures at 1440, 1024 and 390 in both modes looked at section by section; class clashes found and fixed (m-card with account.css, o-banner with pages.css, a-mark with results.css).
- Switch: hero Hotels tab pushes /?mode=hotels, swaps every slot (headings checked), sets "Overwing | Book hotels" and the status "Showing hotel deals and stays", hotel entry card first; Back returns to flights content and tab (title fixed after Back). Blinds run (data-phase closing then opening).
- Footer: 42 links, every href 200 and every search URL renders results (no empty state); every hash target exists in the right mode (/?mode=flights#when, #deals, #faq, #city-*; /?mode=hotels#weekend, #deals, #faq; /terms#payments, #changes; /privacy#cookies), checked by real clicks from /about and on the home page itself.
- Photos: 24 new Unsplash License photos, each photo page read "Free to use under the Unsplash License", none in the other design's credits; derivatives never exceed the source (1600px wide sources, widths up to 1200).
- Not yet checked: tab order through every new section by keyboard, reduced motion emulation, contrast of the new Cabin dawn values on screen.

## Round 3, Developer B (inner pages Part B), 2026-11-11, 15:55 to 16:25
Shared dev server http://localhost:3001 (navy). Cabin dawn (3002) not running: not checked. Shots in build/qa-shots/r3b/.
- Copy tells: no em dashes in components/flights, hotels, booking, account, lib/mock, lib/data or my CSS (grep). No AI attribution. No lorem, TODO or placeholder text. "Journey" (banned word) removed after the critic.
- Console and network: no console errors on flight results, details, travelers, checkout, confirmation, hotel results, hotel detail (showcase and short), guests, bookings, account and login at 1440, 1024 and 390. One 404 seen was a mistyped test URL of mine (/hotels/riad-zitoun), not a link on the site.
- Horizontal scroll: none at 390, 1024 and 1440 on the pages above, after two fixes (the fare rail radios and the bags table labels escaped their scrollers and widened flight details to 1056px at 390).
- Flows: stay 88K3TE (Hotel Sal e Vela, Garden Double, Non-refundable, $936.00 at every step) and flight 39UFZP (London to New York, Gannet Air, 1 adult and 1 child, $1,368.00 at every step) booked to confirmation.
- Photos: 26 new hotel photos, each photo page read "Free to use under the Unsplash License", none in the other design's credits; 2400px sources, derivatives never above the source.
- Not checked: reduced motion on the new parts, every hover pair, keyboard tab order through the new filters and the availability table end to end, real phones (390 was a desktop Chromium window).

## Round 3, Developer B, round 2 (16:41 to 16:50)
- No-disclosure ruling: Part B pages carry no demo, preview or "not from real guests" wording (hotel results Lisbon and Sydney, Hotel Sal e Vela, fares, travelers, log in, at 390 and 1440). The footer notice remains (Developer A's file).
- Maps: Lisbon dialog at 1440, all 8 pins on land, none overlapping, each in its card's district.
- Layout: no horizontal scroll at 390 on the pages above; hotel page at 390 shows header, section nav and Reserve bar only.
- Console: no errors.
- Not checked: checkout and guests flow end to end after the summary change (the same lines component; travelers checked), 1024, hover pairs, reduced motion.
