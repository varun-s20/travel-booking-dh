# travel-booking: status

Mode: live
Started: 2026-11-10

## Stages
- [x] 0. Set up and client material in prd/ and assets/ (PRD only, no client assets or site text)
- [x] 1. Intake (analyst), checkpoint 1a (answers in brief.md)
- [x] 2. Clippings (skipped by Varun)
- [x] 3. References (scout), checkpoint 1b (picks in references/picks.md)
- [x] 4. Art direction phase A (art-director), checkpoint 2a (choices in design/choices.md)
- [x] 5. Art direction phase B (art-director), checkpoint 2b (critic 7.65 FAIL on originality; run through on Varun's instruction, provisional answers in design/choices.md)
- [x] 6. Copy (copywriter), client questions (15 questions in content/copy.md, not sent; Varun away, placeholders used)
- [x] 7. Build homepage (developer), checkpoint 2c (critic 7.3 FAIL twice, originality 7; run through on Varun's instruction; Developer's 7 decisions in build/progress.md kept provisionally)
- [x] 8. Build remaining pages (developer), first Overwing build in two palettes (final pass xhigh 7.2 FAIL, originality 6.5; no tells; build/handover.md)

### Redesign for the client's feedback (2026-11-11): two different designs
Varun is asleep and handed his approvals to the Chief Officer agent (.claude/agents/chief-officer.md). Deadline: both sites ready by 09:30. Shared brief for every stage: logs/redesign-note.txt.
Overwing (cabin windows; design/, prototype/, build/, site/):
- [x] O1. Art direction revision (art-director): Night navy (default) plus Cabin dawn; client priorities; critic 6.9 FAIL (no tells); Chief Officer APPROVED WITH NOTES (condition: new hero photo before the home hero; design/choices.md)
- [x] O2. Build revision (developer), every page, navy and cabin, new Kiama harbour hero photo; critic home 6.8, flight flow 6.55, final pass xhigh 7.4 FAIL (no tells; 8 of 10 fixed after, not re-scored); Chief Officer APPROVED WITH NOTES twice
- [x] O3. Polish round (developer): critic high 7.7 FAIL (design 8, originality 7, craft 8, functionality 8.5; no tells); 10 fixes after; Chief Officer APPROVED WITH NOTES (note fixed: totals on map pins). Overwing done 06:07
Landfall (full photo hero, Kasa primary; landfall/):
- [x] L0. App setup (developer): copied simulated backend only, no design (builds in both palettes; 15 Overwing assumptions listed in landfall/build/plumbing.md)
- [x] L1. Art direction phases A and B (art-director): Kasa and European Sleeper deconstructions, concept "see the place first", Newsreader plus Albert Sans, navy plus Harbour gold; critic 6.25 FAIL (no tells); Chief Officer CHOSEN at 2a, APPROVED WITH NOTES at 2b (landfall/design/choices.md)
- [x] L1b. Palette distinctness (art-director): "teal acts, navy speaks" (teal #14A08B fills actions, indigo navy #1B2A6E for type); Chief Officer APPROVED WITH NOTES (note 1: darken navy to #16225A, for L4)
- [x] L2. Copy deck (copywriter): landfall/content/copy.md (630 lines; 3 new client questions; 5 calls for Varun in the log)
- [x] L3. Build plan, foundation and homepage (developer): critic 6.45 FAIL (no tells, 10 fixes not re-scored); Chief Officer APPROVED (second call); navy darkened to #16225A
- [x] L4. Build remaining pages (developers, in parallel page groups): group F done 06:07 (critic 7.4 FAIL, no tells; fixes not re-scored); group H pages built (37 photos) but its QA and critic round were cut by the restart
- [x] L5. Landfall final whole-site pass (developer): hotel detail finished, open items settled, both palettes QA clean (29 pages each); critic xhigh about 6.9 FAIL (partial pass, no tells); Chief Officer APPROVED WITH NOTES, side by side with Overwing (Harbour buttons now gold, 390 hotel page rebuilt)
- [x] L6. Last fixes (developer): icon set redrawn from scratch (20px grid, 1.25 line, square caps, mitre joins), three Lisbon photos replaced, 404 crop fixed; Chief Officer CONFIRMED WITH NOTES. Done 12:22
- [x] 9. Checkpoint 3: previews of both designs in both palettes (Overwing navy 3001, cabin 3002; Landfall navy 3003, harbour 3004), Chief Officer side-by-side review done in L5 and L6, report for Varun 12:25. No deploy (Calibre licence open; deploy needs Varun's yes)
- [x] 11. Close of round 2 (2026-11-11 12:25). No retro (live mode).

### Round 3: benchmark against Booking.com, Expedia and Priceline (2026-11-11), target 9.2
Notes for every stage: logs/round3-note.txt. Scoring: benchmark-rubric.md.
- [x] R1. Deconstruct the three competitors (deconstructor x3, opus, in parallel): booking-com.md (complete but the flight next step), priceline.md (flights blocked by bot checks, not bypassed), expedia.md
- [-] R2. Benchmark inventory: skipped for time (Varun's 2.5 hour limit); the Critic and Developers read the three deconstructions directly
- [x] R3. Art direction revisions (art-director x2, in parallel): design/round3-spec.md and landfall/design/round3-spec.md, both Chief Officer APPROVED WITH NOTES (15:22)
- [x] R4. Mock data expansion: catalogue content done 15:35 (content/mock-catalogue.md, 2,007 lines); wired into both apps by each Developer B
- [-] R5. Copy for the new sections: final copy written into each round 3 spec by the Art Directors (time)
- [x] R6+R8. Rebuild homepages and inner pages together (4 Developers plus second rounds). Benchmark before the last fixes: Overwing home 7.6 then 7.8, inner 7.9 then 8.0; Landfall home 7.7 then 7.8, inner 7.6. Landfall photo pass blocked by an Unsplash bot check
- [x] R8b. Cleanup per app: every demo disclosure removed (Varun 16:28; checked on 10 pages in all four previews), Landfall deal prices one figure at every step, re-scores (Overwing 8.2; Landfall inner pages 7.3 to 8.2), all four production builds pass (Studio Lead fixed one Overwing type error)
- [-] R7. Homepage checkpoint superseded by Varun's 2.5 hour limit (15:03); he gets the homepage links when viewable
- [x] R9. Chief Officer final review (both APPROVED WITH NOTES: Overwing about 8.2, Landfall about 8.0; inner pages converging), production previews on 3001 to 3004, report 17:02. Target 9.2 not reached

## Current
Round 3 done 17:02. Palette revision and Landfall logo done 17:37. Previews (production builds, Studio Lead's background servers): Overwing http://localhost:3001 (navy) and :3002 (cabin); Landfall http://localhost:3003 (navy) and :3004 (harbour). Open for Varun: real contact details, a photo source past the Unsplash bot check, the card brand marks, and whether to run a round 4 toward 9.2.

## Notes
- Build stack: Next.js, not the static-HTML conventions. Front end only, simulated backend. Before the build stage, get Varun's yes to install packages (npm), and use the Next.js dev server for previews instead of python http.server.
- Placeholders: brand name, wordmark, market (English, USD), contact and legal facts are all placeholders. Stock photography approved for now.
- Fonts: Calibre Thin, Regular, Bold (woff2 and ttf) in fonts/calibre/, from Varun's three zips, checked clean. Design and client review only; needs a Klim web licence (or a switch to Rethink Sans) before any public deploy.
- 2026-11-10, Varun: run straight through checkpoints 2b, copy and 2c without stopping (his instruction is the approval). Client questions get marked placeholders. Stop only if a stage fails. Show all Critic scores at the end.
- 2026-11-10, Varun: npm install approved for the Next.js app in site/. Two versions (Harbour gold, Cabin dawn) from one codebase with two themes. Stock images across the whole site.
- 2026-11-11, client feedback (brief.md): deep navy, white and teal, a clean readable font, prominent search, easy navigation, clear pricing, strong travel imagery, polished mobile; ease of use like Booking.com, Expedia, Priceline with its own identity.
- 2026-11-11, Varun: the two versions must be completely different designs sharing no design resources (Overwing and Landfall). Both in navy/white/teal, each with its own shades; Overwing keeps Cabin dawn and Landfall keeps Harbour gold as extra options. Landfall's primary reference: Kasa. Run straight through.
- 2026-11-11, Varun (going to sleep): design up and ready within 7 hours; run any agents needed, new concepts allowed beyond the moodboard; one agent takes his role as chief officer and approves; "approve the tasks and everything and get this built". Under that instruction the Studio Lead installed Landfall's packages (npm ci in landfall/site, the same package set and versions as site/, no new packages). No deploys.
- Parallel stages each get their own browser: logs/mcp-isolated.json (Playwright --isolated) with --strict-mcp-config.
