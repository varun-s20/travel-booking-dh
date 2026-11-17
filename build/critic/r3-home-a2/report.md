# Critic, round 3 Part A, second round (homepage both modes, footer), 2026-11-11, about 16:24 to 16:28
Critic subagent, high effort, foreground, on the shared dev server http://localhost:3001 (navy). Saved by Developer A from the critic's returned report (the critic is read-only). Screenshots in this folder (r3a2-*.png; fix-*.png are Developer A's checks after the fixes).

## Verdict: benchmark 7.8 (target 9.2), FAIL. Studio about 8.0, FAIL.
| Criterion | Score | Compared with |
|---|---|---|
| Depth (25%) | 7, capped by filler (8.5 without the cap) | Booking.com stays home. Banner repeated deal cards 1 and 2; hotel "Stays for this weekend" repeated two Recommended hotels. |
| Ease (20%) | 8.8 | Booking.com. Switch keeps scroll, URL, title, every h2 swaps. The 390 chart scrolled sideways with no hint. |
| Visual (20%) | 8 | Booking.com (never reuses a photo). Photos still repeated; two hotels shared a room photo; pre-footer window murky. |
| Craft (15%) | 7, capped (clipped at 390) | Expedia home 390. Trending rail at 390 rested flush at x=0. |
| Pricing (10%) | 8.8 | Priceline deal cards. Chart named a Nov cheapest date but Nov was not marked. |
| Mobile (10%) | 8 | Booking.com 390 |
Weighted 7.84. Studio: design 8, originality 8, craft 7 (capped), functionality 9. No copy tells, no design tells (near tell: the four-stop booking steps).

## Issues, worst first (B blocks 9.2)
1. B. 390 Trending rail flush at x=0 (no scroll padding). 2. B. Repeated facts: banner = deal cards 1 and 2; weekend row = Recommended hotels. 3. B. Same room photo on two different hotels. 4. B. City photos repeated across sections (Tokyo, Cape Town, Lisbon, Barcelona). 5. B. Pre-footer window dimmed, headline across its frame, murky footer top. 6. Section-level demo notes ("Demo prices from the simulated backend", "Demo reviews..." three times). 7. Stay deal eyebrows wrap, prices on different baselines, orphan dates. 8. 390 chart cut off at May. 9. Trending list ends 250px above the grid. 10. Footer: 12-link column beside 4-link ones; placeholder phone at display size. Minor: orphan "a night".

## Between this page and 9.2 (critic's priority order)
1. Craft: scroll padding on the 390 Trending rail; re-check every rail. 2. Depth: de-duplicate banner and weekend row; remove section demo notes; mark the cheapest date's month. 3. Visual: a photo per hotel, no large city photo twice, a clear pre-footer window and clean footer edge. 4. Mobile: all 12 months at 390; check the 390 tab bar switch. 5. Pricing: Lisbon eyebrow; align stay deal prices; cheapest month on the chart. 6. Ease: a visible Flights / Hotels state in section headings below the hero; arrow keys on the chart bars.

## Not checked by the critic
Cabin dawn, hotels mode at 390 and 1024, most of flights at 1024, Back/Forward, hero tabs and 390 tab bar switch, hover and focus pairs, reduced motion, 2x sharpness, recent-search cards, city-row expansion, FAQ opening, old /#hotels links, live competitor sites.
