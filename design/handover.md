# travel-booking: art direction handover (Overwing)
Revision for the client's feedback, 2026-11-11. Art Director, art-direct skill phase B. For Varun (on waking) and the Developer. The 2026-11-10 handover is replaced by this one; its decisions are recorded in design/choices.md.

Open:
- design/revision-2026-11-11.md: the numbered change list for site/, page by page, with the Chief Officer's conditions at the top;
- design/tokens.css: Night navy as the default, Cabin dawn under `[data-palette="cabin"]`;
- prototype/index.html: add ?palette=cabin for Cabin dawn.

Preview: `python -m http.server` from prototype/.

## What changed
- **Palette.**
  - Night navy is Overwing's own navy, white and teal, the default: navy wall #0B2341, call-to-action navy #0D2B4C, ink #0B1B2E, teal #086F76 (text-safe), bright teal #6FD6CE on dark, white page.
  - Cabin dawn is kept as the alternate.
  - Harbour gold has left Overwing.
- **Hero.**
  - The hero is now the cabin wall at night: a rounded navy panel holding a bigger search (a 1040 x 80 pill, Flights and Hotels as tabs with icons) and bigger windows (256 x 345 at 1440, were 229 x 309).
  - The windows are edged in teal and show a coast at first light with the wing.
  - In Cabin dawn the wall maps back to blush.
- **Navigation.**
  - Rail: Flights, Hotels, Bookings, Help, More. More now sits with the rest instead of 800px down.
  - A solid top bar keeps Log in and Sign up at every scroll position.
  - Phone tab bar: Flights, Hotels, Bookings, Account. It steps aside on scroll down and while a search field has focus.
- **Mobile.**
  - The single "Where to?" trigger is gone; the fields show inline as one white card.
  - Touching a cell opens the full-screen sheet on that cell. Its head and Search button stay on screen.
  - A failed search opens the sheet on the failing cell.
- **Pricing.**
  - The fact chip "Taxes and fees included".
  - Every result card leads with the total.
  - Price notes use --c-price-note.

## Critic (one round, before the fixes below)
| Criterion | Score |
|---|---|
| Design (35%) | 7 |
| Originality (35%) | 7 |
| Craft (20%) | 6, capped: suggestions pushed the chips under the tab bar at 390 |
| Functionality (10%) | 8 |
| Weighted total | 6.9, FAIL |

- No design tells and no copy tells.
- The critic found the search the most prominent thing at every width, and said navigation would mostly not trip a Booking.com, Expedia or Priceline user.
- It found the imagery weak and teal nearly absent.

## Fixed after the critic
These were checked in the browser and are not re-scored:
- **Rail:** it shows the current product.
- **More:** it opens level with its button.
- **Phone sheet:** its head and Search button are sticky, and the toggle icons have their gap.
- **Phone errors:** a failed search opens the sheet, and the tab bar hides while a field has focus.
- **Pricing chip:** it no longer hides on desktop errors.
- **Cabin dawn:** the pill has an edge on the blush wall.
- **Overflow:** the panel fits 1440 x 900 with no scroll.
- **Teal:** it edges the windows and outlines the chips.
- **Grade:** lightened from 0.42 to 0.20 strength.

## Measured
Contrast was measured with prototype/tools/sample_contrast.py: 104 text boxes against the pixels behind them, 5 captures (navy at 1440, 1024 and 390; Cabin dawn at 1440 and 390).
- Every box passes.
- The lowest is 6.7:1 in navy and 5.2:1 in Cabin dawn.
- The token pairs are listed in tokens.css and in item 4 of the revision doc.

## Chief Officer checkpoint
Approved with notes on the first call, recorded in design/choices.md.
- **Condition:** a new sunrise-coast photo with a place in it before the home hero is built or shown to the client.
- **Other notes:**
  - teal must read on the first screen (a 2px full #6FD6CE lit edge);
  - at 390, both window tops show above the tab bar;
  - drop "No booking fee" (done);
  - screenshot the 900 to 1024 search;
  - check a possible 1px seam above the sticky bar.

## What is left
- **The hero photo.** The coast frame is the best licensed one already in the studio (pages/about-coast-wing, Bailey Alexander), but it shows storage tanks and flat sea. Sourcing a new one did not fit this stage's time.
- **Not done in the prototype:**
  - Chief Officer notes 2 and 3 (the 2px teal lit edge; the 390 window tops above the tab bar). Both are written into the revision doc for the Developer.
  - The 900 to 1024 horizontal search (revision item 11).
  - Every inner-page change. Those exist only as the revision doc.
- **Not checked:**
  - real phones (touch was emulated in Chromium);
  - Safari and Firefox;
  - screen readers;
  - the 1px seam the critic half-saw at 1024 and 390 scroll positions;
  - Cabin dawn interactions at 390.
- **Originality** stays capped by the missing client brand and media, as before.
- **Calibre licence:** still review-only. A Klim web licence, or Rethink Sans, is needed before any public preview.
- **Stray screenshot:** the critic saved one screenshot by mistake at the studio root, hero-1440-night-studio.png. Move it or delete it; I did not touch it.

## Decisions for Varun
1. **The hero photo.** Confirm the Chief Officer's brief: a sunrise coast with a town, harbour or beach town, no industry, land in at least three of the four windows. Or supply one.
2. **The phone tab bar** stays (Hipcamp's shell, per the redesign note) but hides on scroll. Keep it, or switch to a plain header with a menu like the big booking sites?
3. **Proposed new copy, for the Copywriter to confirm:**
   - the fact chip "Taxes and fees included";
   - the menu row "Help and contact";
   - the price lines in revision items 22, 24 and 26.
4. **The trust panel and Contact photos:** confirm the new subjects (revision items 19 and 33).
5. **Calibre for any client preview:** buy the Klim licence, or switch to Rethink Sans.

## Bash use, stated plainly
- **Servers:** a production build and start of site/ on port 3001, to see the real pages; it was stopped by its PID. A python http.server for the prototype on 5173, stopped at the end.
- **Python image and colour scripts:**
  - the hero WebP derivatives;
  - contrast.py;
  - grade_filter.py;
  - sync_tokens.py;
  - sample_contrast.py.
- **Edits through the shell:**
  - two small Python edits that pasted the generated filters and swapped the hero photo paths in index.html;
  - two sed edits (the view offset in global.css and a chip label in index.html).
- **Read-only:** grep, ls, netstat, taskkill.
- **No git commands.**
