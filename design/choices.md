# travel-booking: Varun's choices (checkpoint 2a, 2026-11-10)

## Concept
A, Overwing (working name and wordmark are placeholders).

## Palette
P3, Harbour gold. It was sampled from concept C's coast photo, so in phase B keep its colours and roles but re-measure every contrast pair on Overwing's own hero (the wing-over-clouds view in the cabin windows), and adjust shades only where a pair fails.

## Type
T1, the reference's own approach: Calibre plus Geist, as on Hipcamp.
- Calibre files are in projects/travel-booking/fonts/calibre/ (supplied by Varun, checked clean): Thin 200, Regular 400 and Bold 700, each as .woff2 and .ttf. Self-host the .woff2.
- There is no Calibre 500 or 600. Hipcamp uses 400, 500, 600 and 700, so map its 500 and 600 roles onto 400 or 700 (or Geist where Hipcamp's component layer uses Geist), and never let the browser fake a weight (font-synthesis: none).
- Calibre Regular is a reduced character set: it lacks Latin Extended-A (for example Š, ł, ő, İ, ž) and the no-break space. Bold and Thin have them. Keep destination names in the mock data to characters Regular covers, or set them in Bold.
- No weight has arrow glyphs (→ ←) or the rupee sign. Draw button arrows as inline SVG.
- Licence: these files are for design and client review. Before any public preview deploy or the live site, Calibre needs a Klim web licence, or the type switches to T2's Rethink Sans. Flag this in design/handover.md.

## Rulings on the conflicts in concepts.md
- 3, headline system: sentence case, as on Hipcamp. No capitals system (it was only offered with T3 and concept C).
- 6, search labels: The Hoxton's small caps labels on both the Flights and Hotels tabs.
- 7, motion: Hipcamp's fast state changes for the tool, plus Overwing's one load moment (the blinds rising) and the slow sideways drift on scroll. All of it off under reduced motion.
- 9, placeholders: stock photos fill every image slot, no visible placeholder labels, and one quiet "demo build" notice in the footer naming what is placeholder. Draft the wording in phase B for Varun to approve at 2b.
- 10, Geist: kept, as part of T1 (Hipcamp's own UI face).
- All other conflicts: as the Art Director resolved them in concepts.md.

## Two palette versions (Varun, 2026-11-10, after checkpoint 2a)
- Build two complete versions of the site from one Next.js codebase: Harbour gold (P3) and Cabin dawn (P1, from design/concepts.md and prototype/audition.html). The palette is a swappable token set; everything else (layout, copy, imagery, motion) is identical. Each version runs and builds with its own command.
- Cabin dawn was sampled from Overwing's own wing-over-clouds photo, so it fits the hero as it is. Measure its contrast pairs on the real pages too.
- Stock photography across the whole site, not only the hero: destinations, hotels, rooms, about, and any section that would otherwise be an empty box or a diagram. Varun wants a complete-looking website, not a wireframe.

## Checkpoint 2b (2026-11-10, Varun away; Studio Lead's provisional answers, for Varun to review)
Varun told the Studio Lead to run straight through, so these are provisional defaults, each easy to change later.
1. Demo notice wording (spec section 7) and placeholder contacts +1 (555) 010-0199 and hello@example.com: accepted as written.
2. Public preview and Calibre licence: no deploy is planned now. Revisit before any preview link goes to the client.
3. Harbour gold tint and hairlines: keep the Art Director's sand (#EEE4D5, #E4DACB).
4. Hotel results map: no new packages. A static map image per city with price pins placed over it (OpenStreetMap-based with attribution, or a drawn map if fetching tiles is not possible). The real map provider is a later decision.
5. Headline: keep "Fly there, stay there", and the Copywriter also writes a flights-only alternative in case Duffel Stays is not approved.
Hero prototype: last critic score 7.65 FAIL (originality 7, held back by no client brand). Approved to proceed by Varun's run-through instruction.

## Client feedback and the redesign (2026-11-11)
The client asked for deep navy, white and teal with a clean, readable font, a prominent search, easy navigation, clear pricing, strong travel imagery and a polished mobile experience (brief.md, "Client feedback, 2026-11-11"). Varun's rulings:
- This design (Overwing, the cabin windows) and a second design (Landfall, in landfall/) are two completely different designs and share no design resources. The two-palette version of Overwing built on 2026-11-10 was a misread of his request.
- Overwing's palettes: a new navy, white and teal (Overwing's own take, the default) plus Cabin dawn as the alternate. Harbour gold leaves Overwing and goes with Landfall.
- Type stays T1 (Calibre plus Geist). The licence flag stands.
- Run straight through; the Chief Officer agent approves in Varun's place.

## Art direction revision checkpoint (2026-11-11, Chief Officer for Varun; provisional, for Varun to review)
Reviewed:
- prototype/index.html (Night navy, and ?palette=cabin);
- design/revision-2026-11-11.md;
- design/tokens.css;
- the critic's report (6.9 FAIL: design 7, originality 7, craft 6, functionality 8, no tells);
- brief.md and logs/redesign-note.txt.

Decision: APPROVED WITH NOTES, first call (no send-back).
- Palettes: Night navy is the default and Cabin dawn the alternate. Harbour gold is out of Overwing.
- Navigation:
  - rail Flights, Hotels, Bookings, Help, More;
  - a solid top bar with Log in and Sign up;
  - tab bar Flights, Hotels, Bookings, Account;
  - search fields inline on phones.
- Condition (a): replace the coast photo before the home hero is built, and before any client review. "Ship now, swap later" is refused. The new photo is a sunrise coast with a place in it, no industry, with land in at least three of the four panes at 1440. The Developer does foundation, chrome and inner pages first.
- Ruling (b): distinct from Booking.com at desktop (the windows take half the hero), but not yet on phones, where the first screen has no photo. Hence note 3. Distinct from Landfall as built. At Landfall's checkpoint, check that it has no navy wall panel, centred white pill or fact-chip row, and no aerial-coast hero.
- Ruling (c): drop "No booking fee" (a client fact we don't have). Done in the revision doc.
- Notes, ranked:
  1. The new photo.
  2. Teal must read at arm's length: a 2px full #6FD6CE lit edge on the bezels.
  3. At 390, both window tops show above the tab bar.
  4. The fee line.
  5. Screenshot the 900 to 1024 search at 960 and 1024.
  6. Check the 1px seam above the sticky bar.

  All are written into the top of the revision doc.

## No demo disclosures (Varun, 2026-11-11, 16:28)
Varun: remove the demo build notice and anything like it from the site; the client must not be told it is a demo build. Nothing on the site says demo, working name, placeholder, sample, mock, simulated, test data, or that no booking is real or no card is charged. Replaces the footer demo notice from the 2a ruling 9.

## Alternate palette revision (Varun, 2026-11-11, 17:18)
Cabin dawn is replaced by Daybreak (port 3002; the key stays "cabin"): royal blue #1D4ED8 calls to action (white 6.7:1), sky wall #E2EDFF, ground #F7FAFF, ink #0B1B3A, sunrise orange #EA580C for rings and glyphs only (3.6:1), sunrise mist #FFF1E6 for extras and savings (save ink #C2410C, 4.7:1), the navy photo grade. From the ui-ux-pro-max skill's airline palette, every pair measured. Night navy (3001) unchanged.
