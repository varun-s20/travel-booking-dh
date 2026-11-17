# Critic, round 3 Part A (homepage below the fold, footer, mode switch), 2026-11-11, about 16:00 to 16:20
Critic subagent, high effort, foreground. Checked at http://localhost:3001 (navy). Cabin dawn (3002) not seen. Saved by Developer A from the critic's returned report (the critic is read-only). Screenshots in this folder (r3a-*.png).

## Verdict: benchmark 7.6 (target 9.2), FAIL. Studio 7.9, FAIL.
| Criterion | Score | Reason |
|---|---|---|
| Depth and detail (25%) | 7 (capped: filler) | Section count matches Booking.com's stays homepage; city grid and fare chart richer than Priceline's. Cap: the trust panel says the Stripe fact twice; the fare chart shows $412 in 8 of 12 months; each deal card states its saving three times. |
| Ease of use (20%) | 8 | Switch works in place (URL, title, status, Back). The rail's Hotels jumps to the top and loses your place; rail arrows show with nothing to scroll. Below Booking.com. |
| Visual design and imagery (20%) | 7.5 | Strongest identity of the four. 62 photos use 26 files: Lisbon 5 times; Tokyo, Cape Town, Rome, Athens 4 times. Booking.com never repeats a photo. |
| Craft (15%) | 7 (capped: clipped text) | "Explore by region" blurbs end mid-word at 1440; saving chips wrap awkwardly. No console errors. |
| Pricing clarity (10%) | 8.5 | Taxes and fees, per adult and per night stated everywhere; typical price shown. "1 traveler" vs "1 adult"; Lisbon deal card format differs. Below Priceline's deal cards. |
| Mobile (10%) | 8 | No overflow at 390; footer accordions work; banner chip breaks into three lines. Below Booking.com 390. |
Weighted 7.55. Studio: design 8, originality 8, craft 7 (capped), functionality 9 = 7.9. No copy tells, no design tells.

## Issues, worst first (1 to 5 block 9.2)
1. Photo repetition across banner, deal cards, Trending and Explore by region. Fix: 2 to 3 photos per city, never the same file twice on one screen or in consecutive sections.
2. Clipped blurbs in Explore by region (1440). Fix: let them wrap.
3. Repeated facts: trust panel chip row repeats the ticks; deal cards repeat the saving (chip, line, typical) and "Nonstop" twice. Fix: middle line carries airline, stops, time.
4. Cheapest months chart: 8 of 12 bars $412, all marked. Fix: vary, mark only the cheapest, name the cheapest date.
5. Rail Hotels / Flights jumps to the top (spec A1 said scroll to the search). Fix: switch in place, keep the scroll.
6. Hotel-first entry card is CSS order only; DOM order disagrees. Fix: reorder the elements.
7. Recommended after a search: 3 cards plus arrows that do nothing; recent search card has no price; empty space under one recent card. Fix: hide arrows when cards fit; add a fare.
8. Deal banner chips wrap (2 lines at 1440, 3 at 390).
9. Footer: two duplicate destinations (/bookings twice, /contact twice); placeholder phone and email set large (client facts needed).
10. Pre-footer: murky window, tonal edge into the footer, about 100px dead space.
Minor: lone "night" on second lines; tracked caps pills feel heavy.
Deviations judged: "for the dates shown" accepted; catalogue row titles as pills accepted; 12% rule no visible effect.

## Already at or above the competitors
The switch (every heading changes; beats Expedia and Priceline), Browse by property type, the by-city directory, price language, the window identity, no console errors.

## Not checked by the critic
Blind mid-frame, Forward, hover pairs, visible focus, 2x sharpness, most of 390 and 1024, reduced motion, city-row expansion, live competitor sites.
