# Mock catalogue: travel-booking (shared simulated backend)
Copywriter, 2026-11-11. Written for Varun's round 3 rulings (logs/round3-note.txt, logs/redesign-note.txt, brief.md "Varun's rulings, round 3"): more flight and hotel options, rich hotel pages, reviews, deals and "Recommended for you" rows, at the depth of Booking.com, Expedia and Priceline. Both designs (Overwing in site/, Landfall in landfall/site/) read this one catalogue through the shared simulated backend (lib/mock/, lib/data/).

## Read this first
- **All of it is demo data.** Every airline, hotel, room, price, deal and review below is invented for the demo. None of it is a client fact, and none of it is about a real airline, hotel or guest. Cities, airports, neighborhoods, landmarks and aircraft types are real places and things, used only as the setting.
- **Kept exactly as they were.** The five airlines (Kittiwake Air, Tern Atlantic, Larkspur Airways, Petrel Air, Wren Air), their codes, flight numbers and aircraft; the six London to Lisbon offers; the Light, Classic and Flex fares on the demo flight; the six destination fares; the eight hotels with their names, areas, stars, nightly prices, card descriptions and amenities; Casa Lanterna's rooms and policies; the demo account (Maya Okafor) and its four bookings. This file adds fields to them and builds around them. Where content/copy.md and this file overlap, they say the same thing.
- **Names checked.** The seven new airline names were web-searched on 2026-11-11 and no airline uses them (two first choices were taken and replaced: Oriole and Shearwater Air). The 88 new hotel names were not searched one by one. They were built to be unlikely, but they are not trademark-checked. Two-letter airline codes and ticket prefixes are for the demo only; most two-letter codes belong to some real airline somewhere, so none of this may reach production fixtures, which will use Duffel's real data.
- **Prices.** USD, taxes and fees included, as everywhere else in the demo. Hotel prices are per room per night for the stay, whatever the number of guests the room sleeps (as the backend already works). Flight fares are per traveler unless a line says total.
- **Market conventions (placeholders, as in copy.md).** US English (center, neighborhood, traveler, canceled), 24-hour times, distances in km, room sizes in m², dates as "Fri, Nov 20".
- **Characters.** Names stay inside Latin-1 (é, ã, ç, à, ó, ô and the like) because Calibre Regular lacks Latin Extended-A (lib/data/places.ts). No macrons: Ginza, Senso-ji, Omotesando.
- **Style rules held.** No em dashes or en dashes anywhere, ranges use "to". Headings and row titles in sentence case with no full stops. None of the banned words (elevate, seamless, unlock, unleash, nestled, testament, journey, effortless, hassle-free, curated, discover, embark, hidden gems, vibrant, bustling, breathtaking, stunning, peace of mind, at your fingertips), in reviews too.
- **Templates.** Deal and recommendation lines carry tokens in braces, such as {price}. The backend fills every token before a line is shown. A line with an empty token is never shown.

## Contents
1. Destinations
2. Airlines and fare families
3. Hotels: shared lists and rules, then 12 cities with 8 hotels each, 2 showcase hotels per city in full
4. Review pool for the other hotels
5. Deals
6. Recommended for you
7. Notes for the Developer
8. What I left out, and why

---

# 1. Destinations
24 cities in 6 regions. "From London" figures are for one adult in Economy, return, taxes and fees included.
- **Return from** is the lowest return fare the mock search returns from London Heathrow. The destination cards show it ("Return from $412"). The six existing cities keep their figures.
- **Typical return** is the usual fare on the route. Deals compare against it (section 5). It is never shown as a crossed-out price on its own; it only appears inside a deal line that names it.
- **Flight time** is the nonstop time from London Heathrow, outbound. Sydney has no nonstop, so it shows the shortest time with one stop.
- **Hotels**: the 12 cities with hotels in section 3. The other 12 have flights only; a hotel search there shows the existing "No rooms" state, so those cities are left out of the hotel destination list.

## Regions
| Region | Cities |
|---|---|
| Southern Europe | Lisbon, Barcelona, Rome, Athens |
| Northern and Western Europe | Paris, Amsterdam, Copenhagen, Reykjavik |
| North America | New York, Toronto, Los Angeles, Miami |
| Latin America | Mexico City, Cancún, Rio de Janeiro, Buenos Aires |
| Asia and Pacific | Tokyo, Singapore, Sydney, Bangkok |
| Africa and Middle East | Cape Town, Marrakech, Dubai, Nairobi |
- A design that keeps the current four region pills merges the two Europe regions into "Europe" and North and Latin America into "Americas".

## Cities
| City | Region | Country | Airport | One line | Flight time from London | Return from | Typical return | Hotels |
|---|---|---|---|---|---|---|---|---|
| Lisbon | Southern Europe | Portugal | LIS | Steep tram lines, tiled facades and river views, with Atlantic beaches a short train ride west | 2h 45m | $412 | $486 | Yes, 8 |
| Barcelona | Southern Europe | Spain | BCN | Gaudí's buildings, a city beach and late dinners in the narrow streets of the Gothic Quarter | 2h 15m | $296 | $318 | Yes, 8 |
| Rome | Southern Europe | Italy | FCO | Ancient ruins on the walk to dinner, and a coffee standing at the bar in every piazza | 2h 35m | $389 | $458 | Yes, 8 |
| Athens | Southern Europe | Greece | ATH | The Acropolis above the rooftops, and ferries to the islands from the port at Piraeus | 3h 40m | $338 | $418 | No |
| Paris | Northern and Western Europe | France | CDG | Museums, bakeries and long walks along the Seine, an hour and twenty minutes from London | 1h 20m | $218 | $276 | Yes, 8 |
| Amsterdam | Northern and Western Europe | Netherlands | AMS | Canal houses, bikes everywhere and the Rijksmuseum, in a city you can cross on foot | 1h 15m | $204 | $221 | Yes, 8 |
| Copenhagen | Northern and Western Europe | Denmark | CPH | Harbor swimming, design shops and new Nordic cooking in a flat city made for cycling | 1h 55m | $236 | $252 | No |
| Reykjavik | Northern and Western Europe | Iceland | KEF | A small, colorful capital and a base for hot springs, glaciers and the northern lights | 3h 05m | $312 | $338 | No |
| New York | North America | United States | JFK | Museums, Broadway and food from everywhere, with the skyline best seen from the Brooklyn waterfront | 8h 10m | $684 | $812 | Yes, 8 |
| Toronto | North America | Canada | YYZ | A lakeside city of distinct neighborhoods, with Niagara Falls about ninety minutes away by car | 8h 00m | $702 | $748 | No |
| Los Angeles | North America | United States | LAX | Beaches, film studios and taco trucks, spread across a city best seen by car | 11h 10m | $798 | $862 | No |
| Miami | North America | United States | MIA | Art deco hotels on South Beach, Cuban coffee in Little Havana and warm water all year | 9h 55m | $756 | $812 | No |
| Mexico City | Latin America | Mexico | MEX | Tree-lined avenues, the anthropology museum and tacos on every corner, 2,240 meters up | 11h 50m | $1,046 | $1,124 | Yes, 8 |
| Cancún | Latin America | Mexico | CUN | White sand on the Caribbean, with Mayan ruins and freshwater swimming holes inland | 10h 30m | $924 | $986 | No |
| Rio de Janeiro | Latin America | Brazil | GIG | Copacabana and Ipanema below green mountains, with Sugarloaf and Christ the Redeemer above | 11h 45m | $1,094 | $1,168 | No |
| Buenos Aires | Latin America | Argentina | EZE | Wide avenues, steak houses and tango halls, in a city where dinner starts at ten | 13h 50m | $1,186 | $1,262 | No |
| Tokyo | Asia and Pacific | Japan | HND | Quiet temples beside neon streets, trains that run to the minute, and small counters serving one dish well | 14h 05m | $1,212 | $1,428 | Yes, 8 |
| Singapore | Asia and Pacific | Singapore | SIN | Hawker centers, garden walks and a skyline on the bay, in a city that is easy to get around | 13h 10m | $984 | $1,164 | Yes, 8 |
| Sydney | Asia and Pacific | Australia | SYD | Harbor ferries, the Opera House and ocean beaches a bus ride from the center | 22h 30m, 1 stop | $1,486 | $1,598 | Yes, 8 |
| Bangkok | Asia and Pacific | Thailand | BKK | Golden temples, river boats and night markets, with the islands a short flight south | 11h 40m | $868 | $1,032 | No |
| Cape Town | Africa and Middle East | South Africa | CPT | Table Mountain over the city, penguins on the beach and vineyards an hour's drive away | 11h 45m | $1,138 | $1,326 | Yes, 8 |
| Marrakech | Africa and Middle East | Morocco | RAK | Riads behind plain doors, the souks of the medina and the Atlas Mountains on the horizon | 3h 40m | $274 | $346 | Yes, 8 |
| Dubai | Africa and Middle East | United Arab Emirates | DXB | Desert drives, beach clubs and the world's tallest tower, with warm, dry winters | 6h 55m | $612 | $664 | No |
| Nairobi | Africa and Middle East | Kenya | NBO | A national park at the edge of the city, and the starting point for safaris across Kenya | 8h 35m | $842 | $918 | No |

## New airports for the place list
lib/data/places.ts already has LHR, LGW, CDG, LIS, MAD, BCN, FCO, AMS, JFK, LAX, MIA, YYZ, MEX, DXB, SIN, HND, SYD and CPT. Add:
| Code | Name | City | Country |
|---|---|---|---|
| ATH | Athens International | Athens | Greece |
| CPH | Copenhagen Kastrup | Copenhagen | Denmark |
| KEF | Reykjavik Keflavik | Reykjavik | Iceland |
| CUN | Cancún International | Cancún | Mexico |
| GIG | Rio de Janeiro Galeão | Rio de Janeiro | Brazil |
| EZE | Buenos Aires Ezeiza | Buenos Aires | Argentina |
| BKK | Bangkok Suvarnabhumi | Bangkok | Thailand |
| RAK | Marrakech Menara | Marrakech | Morocco |
| NBO | Nairobi Jomo Kenyatta | Nairobi | Kenya |
- New cities with hotels for the hotel destination list: Singapore (Singapore), Marrakech (Morocco). Paris, Barcelona, Amsterdam, Mexico City, Cape Town and Sydney are already in the list and now have hotels.

## Who flies each route from London
The first airline named in a row owns the cheapest offer on the route, so the "Return from" figure has a name behind it. The one exception is Lisbon, where the cheapest of the existing six offers is Petrel Air via Madrid ($824.00 for 2 adults). "Via" names the connecting airport. Every airline here is fictional (section 2).
| City | Nonstop | With one stop |
|---|---|---|
| Lisbon | Kittiwake Air, Tern Atlantic, Larkspur Airways | Petrel Air via MAD, Wren Air via BCN (the existing six offers) |
| Barcelona | Wren Air, Kittiwake Air, Larkspur Airways | Petrel Air via MAD |
| Rome | Tern Atlantic, Kittiwake Air, Larkspur Airways | Wren Air via BCN, Avocet Airways via AMS |
| Athens | Larkspur Airways, Kittiwake Air | Wren Air via BCN, Avocet Airways via AMS |
| Paris | Kittiwake Air, Larkspur Airways | None |
| Amsterdam | Avocet Airways, Kittiwake Air, Larkspur Airways | None |
| Copenhagen | Larkspur Airways, Kittiwake Air | Avocet Airways via AMS |
| Reykjavik | Larkspur Airways, Kittiwake Air | None |
| New York | Gannet Air, Kittiwake Air | Tern Atlantic via LIS, Avocet Airways via AMS |
| Toronto | Kittiwake Air | Gannet Air via JFK, Avocet Airways via AMS |
| Los Angeles | Kittiwake Air | Gannet Air via JFK, Avocet Airways via AMS |
| Miami | Kittiwake Air | Gannet Air via JFK, Petrel Air via MAD |
| Mexico City | Vireo Air, Kittiwake Air | Petrel Air via MAD, Gannet Air via JFK |
| Cancún | Vireo Air | Petrel Air via MAD, Gannet Air via JFK, Tern Atlantic via LIS |
| Rio de Janeiro | None | Tern Atlantic via LIS, Petrel Air via MAD, Vireo Air via MEX |
| Buenos Aires | None | Petrel Air via MAD, Tern Atlantic via LIS, Vireo Air via MEX |
| Tokyo | Kittiwake Air | Houbara Air via DXB, Tailorbird Air via SIN, Avocet Airways via AMS |
| Singapore | Tailorbird Air, Kittiwake Air, Currawong Air | Houbara Air via DXB |
| Sydney | None | Currawong Air via SIN, Tailorbird Air via SIN, Houbara Air via DXB |
| Bangkok | Kittiwake Air | Houbara Air via DXB, Tailorbird Air via SIN, Avocet Airways via AMS |
| Cape Town | Lourie Air, Kittiwake Air | Houbara Air via DXB, Avocet Airways via AMS |
| Marrakech | Larkspur Airways, Kittiwake Air | Wren Air via BCN, Petrel Air via MAD |
| Dubai | Houbara Air, Kittiwake Air | None |
| Nairobi | Kittiwake Air | Houbara Air via DXB, Avocet Airways via AMS |
- Connecting airports the backend's hub list (HUBS in lib/mock/flights.ts) does not have yet: LIS and MEX.

---

# 2. Airlines and fare families
Twelve fictional airlines: the existing five, unchanged, plus seven new. "Cancel online" says whether the demo lets a traveler cancel that airline's booking on the site (the existing flag in lib/mock/flights.ts; the copy for both cases is in copy.md, Booking detail). The ticket prefix starts each e-ticket number ("910 2604 118352").

## The twelve
| Airline | Code | Base country | Hub | Short and medium haul | Long haul | Ticket prefix | Cancel online |
|---|---|---|---|---|---|---|---|
| Kittiwake Air | KT | United Kingdom | London Heathrow, Terminal 2 | Airbus A320neo, Airbus A321neo | Airbus A330-900, Boeing 787-9 | 910 | Yes |
| Tern Atlantic | TQ | Portugal | Lisbon, Terminal 1 (London Heathrow Terminal 2) | Airbus A321 | Boeing 787-9 | 924 | No |
| Larkspur Airways | LP | United Kingdom | London Heathrow Terminal 3 and London Gatwick North Terminal | Boeing 737-800, Boeing 737-8 | Boeing 777-300ER | 931 | No |
| Petrel Air | PQ | Spain | Madrid Barajas | Embraer 195, Airbus A320neo | Airbus A350-900 | 947 | Yes |
| Wren Air | WE | Spain | Barcelona El Prat | Airbus A319, Airbus A320 | Airbus A330-300 | 958 | No |
| Avocet Airways | AQ | Netherlands | Amsterdam Schiphol | Embraer 195-E2, Boeing 737-800 | Boeing 787-10, Boeing 777-200ER | 962 | Yes |
| Gannet Air | GN | United States | New York JFK | Airbus A220-300, Airbus A321neo | Boeing 787-9, Airbus A321LR | 966 | Yes |
| Vireo Air | VQ | Mexico | Mexico City International | Airbus A320neo, Airbus A321neo | Boeing 787-8 | 971 | No |
| Tailorbird Air | TY | Singapore | Singapore Changi | Airbus A321neo | Airbus A350-900, Boeing 787-10 | 975 | Yes |
| Houbara Air | HQ | United Arab Emirates | Dubai International | Boeing 737-8 | Boeing 777-300ER, Airbus A350-1000 | 979 | No |
| Currawong Air | CQ | Australia | Sydney Kingsford Smith | Airbus A321XLR | Boeing 787-9, Airbus A350-1000 | 983 | Yes |
| Lourie Air | LQ | South Africa | Cape Town International | Airbus A320neo | Airbus A330-900 | 987 | No |
- The first aircraft in each column is the one the backend uses today (`aircraft` and `longAircraft`); the second may be used for variety. Long haul means over 4,500 km, as in the code.
- Kittiwake keeps flight numbers KT 412, KT 413, KT 418, KT 419; Tern Atlantic TQ 1360, TQ 1361; Larkspur LP 207, LP 208; Petrel PQ 30, PQ 31, PQ 744, PQ 745; Wren WE 512, WE 513, WE 90, WE 91. New flights take numbers from the generator.
- The codeshare stays as it is: some Kittiwake flights are operated by Tern Atlantic ("Operated by Tern Atlantic").

## How fare families work
- Each airline sells its own 3 or 4 families, in Economy. The backend picks the families of the airline that owns the offer.
- **Step** is the extra price per seated traveler over the airline's lowest family, as a share of the lowest family's price, rounded to whole dollars. Kittiwake's steps are the code's existing ones (Classic 0.17, Flex 0.377), which give the demo flight's +$93 and +$207 per traveler.
- Cells read the same way for every airline, so the page can sort each line into its existing lists:
  - A cell starting "For a fee" goes under "For a fee".
  - "Not allowed" and "Not refundable" go under "Not included".
  - Everything else goes under "Included".
- Premium economy, Business and First: the same family names, priced with the cabin rate already in the backend. In those cabins every family adds 1 more checked bag of 23 kg and lets the traveler choose any seat in the cabin. (A simple rule for the demo; real airlines vary.)
- Kittiwake's strings are copy.md's, word for word. The other airlines use the same sentence patterns so the fare cards read alike.

## Kittiwake Air (KT), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Light | Lowest | 1 small bag under the seat | For a fee: Cabin bag in the overhead locker | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $75 per traveler plus any fare difference | Not refundable |
| Classic | 0.17 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 23 kg | Choose a standard seat | For a fee: Changes before departure, $75 per traveler plus any fare difference | Not refundable |
| Flex | 0.377 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 23 kg | Choose any standard seat | Changes before departure, you pay only any fare difference | Refund before departure, minus $50 per traveler |

## Tern Atlantic (TQ), 4 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Saver | Lowest | 1 small bag under the seat | 1 cabin bag, 8 kg | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | Not allowed | Not refundable |
| Standard | 0.14 | 1 small bag under the seat | 1 cabin bag, 8 kg | 1 checked bag, 23 kg | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $90 per traveler plus any fare difference | Not refundable |
| Plus | 0.29 | 1 small bag under the seat | 1 cabin bag, 8 kg | 1 checked bag, 23 kg | Choose a standard seat | For a fee: Changes before departure, $50 per traveler plus any fare difference | Refund before departure, minus $120 per traveler |
| Open | 0.52 | 1 small bag under the seat | 1 cabin bag, 8 kg | 2 checked bags, 23 kg each | Choose any seat, extra legroom included | Changes before departure, you pay only any fare difference | Full refund before departure |

## Larkspur Airways (LP), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Basic | Lowest | 1 small bag under the seat | For a fee: Cabin bag in the overhead locker | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $60 per traveler plus any fare difference | Not refundable |
| Value | 0.22 | 1 small bag under the seat | 1 cabin bag, 10 kg | For a fee: Checked bag | Choose a standard seat | For a fee: Changes before departure, $60 per traveler plus any fare difference | Not refundable |
| Plus | 0.45 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 20 kg | Choose any seat, extra legroom included | Changes before departure, you pay only any fare difference | Refund before departure, minus $80 per traveler |

## Petrel Air (PQ), 4 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Promo | Lowest | 1 small bag under the seat | 1 cabin bag, 10 kg | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | Not allowed | Not refundable |
| Smart | 0.12 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 23 kg | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $70 per traveler plus any fare difference | Not refundable |
| Comfort | 0.26 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 23 kg | Choose a standard seat | For a fee: Changes before departure, $40 per traveler plus any fare difference | Refund before departure, minus $100 per traveler |
| Flexible | 0.48 | 1 small bag under the seat | 1 cabin bag, 10 kg | 2 checked bags, 23 kg each | Choose any seat, extra legroom included | Changes before departure, you pay only any fare difference | Full refund before departure |

## Wren Air (WE), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Basic | Lowest | 1 small bag under the seat | For a fee: Cabin bag in the overhead locker | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | Not allowed | Not refundable |
| Essential | 0.19 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 23 kg | Choose a standard seat | For a fee: Changes before departure, $65 per traveler plus any fare difference | Not refundable |
| Flexible | 0.41 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 23 kg | Choose any standard seat | Changes before departure, you pay only any fare difference | Refund before departure, minus $40 per traveler |

## Avocet Airways (AQ), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Carry-on | Lowest | 1 small bag under the seat | 1 cabin bag, 12 kg | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $85 per traveler plus any fare difference | Not refundable |
| Standard | 0.16 | 1 small bag under the seat | 1 cabin bag, 12 kg | 1 checked bag, 23 kg | Choose a standard seat | For a fee: Changes before departure, $85 per traveler plus any fare difference | Not refundable |
| Flexible | 0.40 | 1 small bag under the seat | 1 cabin bag, 12 kg | 1 checked bag, 23 kg | Choose any standard seat | Changes before departure, you pay only any fare difference | Full refund before departure |

## Gannet Air (GN), 4 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Basic | Lowest | 1 small bag under the seat | 1 cabin bag that fits the overhead bin | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | Not allowed | Not refundable |
| Main | 0.18 | 1 small bag under the seat | 1 cabin bag that fits the overhead bin | 1 checked bag, 23 kg | Choose a standard seat | Changes before departure, you pay only any fare difference | Not refundable |
| Main Plus | 0.36 | 1 small bag under the seat | 1 cabin bag that fits the overhead bin | 1 checked bag, 23 kg | Choose any seat, extra legroom included | Changes before departure, you pay only any fare difference | Not refundable |
| Refundable | 0.72 | 1 small bag under the seat | 1 cabin bag that fits the overhead bin | 2 checked bags, 23 kg each | Choose any seat, extra legroom included | Changes before departure, you pay only any fare difference | Full refund before departure |

## Vireo Air (VQ), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Cabin Only | Lowest | 1 small bag under the seat | 1 cabin bag, 10 kg | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $100 per traveler plus any fare difference | Not refundable |
| One Bag | 0.15 | 1 small bag under the seat | 1 cabin bag, 10 kg | 1 checked bag, 25 kg | Choose a standard seat | For a fee: Changes before departure, $100 per traveler plus any fare difference | Not refundable |
| Flex | 0.38 | 1 small bag under the seat | 1 cabin bag, 10 kg | 2 checked bags, 25 kg each | Choose any standard seat | Changes before departure, you pay only any fare difference | Refund before departure, minus $75 per traveler |

## Tailorbird Air (TY), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Saver | Lowest | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 20 kg | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $120 per traveler plus any fare difference | Not refundable |
| Value | 0.20 | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 30 kg | Choose a standard seat | For a fee: Changes before departure, $60 per traveler plus any fare difference | Refund before departure, minus $150 per traveler |
| Flexi | 0.44 | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 35 kg | Choose any standard seat | Changes before departure, you pay only any fare difference | Refund before departure, minus $30 per traveler |

## Houbara Air (HQ), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Essential | Lowest | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 25 kg | Seat assigned at check-in; For a fee: Choose your seat | Not allowed | Not refundable |
| Comfort | 0.18 | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 35 kg | Choose a standard seat | For a fee: Changes before departure, $75 per traveler plus any fare difference | Refund before departure, minus $200 per traveler |
| Freedom | 0.46 | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 40 kg | Choose any seat, extra legroom included | Changes before departure, you pay only any fare difference | Full refund before departure |

## Currawong Air (CQ), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Base | Lowest | 1 small bag under the seat | 1 cabin bag, 7 kg | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $95 per traveler plus any fare difference | Not refundable |
| Bundle | 0.24 | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 23 kg | Choose a standard seat | For a fee: Changes before departure, $95 per traveler plus any fare difference | Not refundable |
| Anytime | 0.51 | 1 small bag under the seat | 1 cabin bag, 7 kg | 1 checked bag, 30 kg | Choose any standard seat | Changes before departure, you pay only any fare difference | Refund before departure, minus $60 per traveler |

## Lourie Air (LQ), 3 families
| Fare | Step | Personal item | Cabin bag | Checked bag | Seat choice | Changes | Refunds |
|---|---|---|---|---|---|---|---|
| Simple | Lowest | 1 small bag under the seat | 1 cabin bag, 8 kg | For a fee: Checked bag | Seat assigned at check-in; For a fee: Choose your seat | For a fee: Changes before departure, $55 per traveler plus any fare difference | Not refundable |
| Everyday | 0.16 | 1 small bag under the seat | 1 cabin bag, 8 kg | 1 checked bag, 23 kg | Choose a standard seat | For a fee: Changes before departure, $55 per traveler plus any fare difference | Not refundable |
| Flexible | 0.35 | 1 small bag under the seat | 1 cabin bag, 8 kg | 2 checked bags, 23 kg each | Choose any standard seat | Changes before departure, you pay only any fare difference | Refund before departure, minus $45 per traveler |

## Fare card note (all airlines)
- Under the fare cards, as now: The airline sets these rules. We show them exactly as the airline sends them.

---

# 3. Hotels
12 cities, 8 places to stay in each, 96 in all. 24 are showcase hotels with full detail pages; the other 72 have everything a results card and a short detail page need.

## Shared lists and rules

### Property types
Hotel, Boutique hotel, Guesthouse, Apartment, Aparthotel, Resort. A filter group "Property type" uses these six labels. The card's meta row reads "4-star boutique hotel" (stars, then the type in lower case).

### Review score words
| Score | Word |
|---|---|
| 9.0 to 10 | Exceptional |
| 8.5 to 8.9 | Excellent |
| 8.0 to 8.4 | Very good |
| 7.0 to 7.9 | Good |
| 6.0 to 6.9 | Fair |
- Shown as "9.1 Exceptional, 1,286 reviews". Accessible name: "Rated 9.1 out of 10, exceptional, from 1,286 reviews".
- Every place that shows reviews or scores carries this line (12px to 14px, muted): Demo reviews, written for this preview. They are not from real guests.
- Sort option to add: "Guest score". Filter group to add: "Guest score" with "9 or more", "8 or more", "7 or more".

### Price bands
Set by each hotel's "From a night" price.
| Band | From a night |
|---|---|
| Budget | Under $120 |
| Mid-range | $120 to $199 |
| Upscale | $200 to $299 |
| Luxury | $300 and up |

### Distance from the center
Each city names the point "From center" is measured from. The results sort "Closest to the center" uses it. Card text: "0.8 km from the center".
| City | Center point |
|---|---|
| Lisbon | Rossio |
| Barcelona | Plaça de Catalunya |
| Rome | Piazza Venezia |
| Paris | Notre-Dame |
| Amsterdam | Dam Square |
| New York | Times Square |
| Mexico City | The Zócalo |
| Tokyo | Tokyo Station |
| Singapore | City Hall |
| Sydney | Sydney Town Hall |
| Cape Town | Greenmarket Square |
| Marrakech | Jemaa el-Fna |

### Rate plans
Every room is sold on one or more of these plans. The plan name is the label on the rate row.
| Plan | Cancellation | Breakfast |
|---|---|---|
| Non-refundable | Can't be refunded from the moment you book | Not included |
| Free cancellation | Free until 23:59 hotel time 3 days before check-in | Not included |
| Free cancellation, breakfast included | Free until 23:59 hotel time 3 days before check-in | Included for everyone in the room |
| Non-refundable, breakfast included | Can't be refunded from the moment you book | Included for everyone in the room |
- The last plan is only for hotels that include breakfast in every rate (Casa Lanterna, Pátio Quinze, Albergo Tre Finestre, and others marked "Breakfast in every rate").
- The deadline is the existing rule (Nov 17 for a Nov 20 check-in) and matches the card chip "Free cancellation until Nov 17".
- **The eight existing hotels keep their prices.** Each one's existing nightly price stays the cheapest plan on its cheapest room, so its card, the demo booking ($744.00 at Casa Lanterna) and the demo account all hold. Plans added to their rooms only cost more.
- **Showcase hotels** list every room and plan with its nightly price.
- **The other hotels** get two or three rooms from the backend by property type:
| Type | Room 1, at the From price | Room 2 | Room 3 |
|---|---|---|---|
| Hotel | Double Room | Twin Room, +6% | Family Room, sleeps 4, +38% |
| Boutique hotel | Classic Double | Deluxe Double, +20% | None |
| Guesthouse | Double Room | Triple Room, sleeps 3, +22% | None |
| Apartment | One-bedroom Apartment, sleeps 3 | Two-bedroom Apartment, sleeps 5, +45% | None |
| Aparthotel | Studio | One-bedroom Suite, sleeps 4, +30% | None |
| Resort | Garden Double | Pool View Double, +18% | Family Suite, sleeps 4, +52% |
  - Room 1's Non-refundable plan is the From price. Free cancellation adds 10%. Free cancellation, breakfast included adds the city's breakfast price below, per room per night. Round to whole dollars.
  - Apartments and aparthotels with no breakfast amenity sell Non-refundable and Free cancellation only.
| City | Breakfast for the room, a night |
|---|---|
| Lisbon | $22 |
| Barcelona | $26 |
| Rome | $24 |
| Paris | $34 |
| Amsterdam | $36 |
| New York | $44 |
| Mexico City | $24 |
| Tokyo | $38 |
| Singapore | $42 |
| Sydney | $40 |
| Cape Town | $22 |
| Marrakech | $18 |

### Master amenity list
One list for hotels and rooms, 62 items, grouped as the amenities dialog shows them. Every amenity in this file is spelled exactly as here. The existing names are kept, and the card label "Breakfast" stays the short form of "Breakfast available".
| Group | Amenities |
|---|---|
| Internet and work | Free wifi; Work desk; Coworking space; Meeting rooms |
| Food and drink | Breakfast available; Restaurant; Bar; Rooftop bar; Room service; Shared kitchen; Kitchen; Coffee machine; Kettle; Minibar |
| Wellness | Gym; Spa; Sauna; Hot tub; Public bath; Indoor pool; Outdoor pool; Plunge pool; Massage treatments |
| Outdoors | Roof terrace; Terrace; Garden; Courtyard; Balcony; Beach access |
| In the room | Air conditioning; Heating; Hairdryer; Safe in room; Flat-screen TV; Blackout curtains; Soundproofed rooms; Bathtub; Rain shower; Bathrobes and slippers; Iron and ironing board; Washing machine |
| Services | 24-hour front desk; Concierge; Luggage storage; Daily housekeeping; Laundry; Self check-in; Express check-in and check-out; Tour desk; Bicycle rental; Airport shuttle (paid) |
| Building and access | Elevator; Step-free entrance; Accessible rooms; Non-smoking rooms |
| Family and pets | Cots available; Family rooms; Kids' club; Pets allowed |
| Parking | Parking on site (paid); Free parking; Electric vehicle charging |
- Each hotel's list starts with its three card amenities, in card order. The count in brackets after each hotel is the full list length, for the "All 15 amenities" pill.
- "Pets allowed" appears only where the house rules allow pets.

### Default house rules (the other hotels)
- Children: Children of all ages are welcome. A cot is available on request, free of charge. (Apartments: Children of all ages are welcome. Ask the host for a cot before you arrive.)
- Pets: Pets aren't allowed. (Where the list has "Pets allowed": Pets are welcome on request, and the hotel may charge a cleaning fee.)
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 08:00.
- Accessibility: Ask the hotel about step-free access before you book. (Where the list has "Step-free entrance" and "Accessible rooms": Step-free entrance and accessible rooms. Ask the hotel which room suits you best.)

---

## Lisbon
Center point: Rossio. Five existing hotels (unchanged) plus three new.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| casa-lanterna | Casa Lanterna | Boutique hotel | 4 | Alfama | 0.8 km | 9.1 Exceptional | 1,286 | $186 | Mid-range | 15:00 | 11:00 | Yes |
| cais-verde-hotel | Cais Verde Hotel | Hotel | 4 | Cais do Sodré | 1.0 km | 8.4 Very good | 2,412 | $214 | Upscale | 15:00 | 12:00 | No |
| patio-quinze | Pátio Quinze | Boutique hotel | 3 | Príncipe Real | 0.9 km | 8.9 Excellent | 734 | $158 | Mid-range | 14:00 | 11:00 | No |
| ladeira-rooms | Ladeira Rooms | Guesthouse | 2 | Graça | 0.8 km | 8.2 Very good | 958 | $97 | Budget | 15:00 | 11:00 | No |
| ribeira-lofts | Ribeira Lofts | Aparthotel | 3 | Santos | 1.5 km | 8.6 Excellent | 1,107 | $171 | Mid-range | 16:00 | 11:00 | No |
| hotel-sal-e-vela | Hotel Sal e Vela | Hotel | 5 | Belém | 5.9 km | 9.0 Exceptional | 1,642 | $312 | Luxury | 15:00 | 12:00 | Yes |
| sete-janelas-apartments | Sete Janelas Apartments | Apartment | 4 | Chiado | 0.5 km | 8.8 Excellent | 486 | $204 | Upscale | 16:00 | 10:00 | No |
| pensao-cortica | Pensão Cortiça | Guesthouse | 2 | Mouraria | 0.5 km | 7.8 Good | 612 | $84 | Budget | 14:00 | 10:30 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| casa-lanterna | A restored townhouse on a stepped lane below the castle, with a tiled courtyard and a roof terrace over the river. | Roof terrace over the river; Breakfast in the tiled courtyard until 11:00; The 28 tram stops at the end of the street |
| cais-verde-hotel | A modern hotel on the riverfront, two minutes' walk from the ferries and the train to the coast. | Two minutes' walk to the ferries; Trains to the coast from the station next door; Gym and bar on site |
| patio-quinze | Twelve rooms around a planted courtyard on a quiet street near the Príncipe Real garden. | Twelve rooms around a planted courtyard; Breakfast in every rate; A quiet street by the Príncipe Real garden |
| ladeira-rooms | Simple, bright rooms at the top of the hill, with a shared lounge and kitchen for guests. | Shared lounge and kitchen for guests; A short walk to the Graça viewpoint; Free cancellation on every room |
| ribeira-lofts | Apartment-style rooms with a small kitchen in each, a short walk from the river and the tram. | A small kitchen in every room; A washing machine in each loft; A short walk to the river and the tram |
| hotel-sal-e-vela | A riverside hotel on the Belém docks, with an outdoor pool, a spa and rooms facing the 25 de Abril Bridge. | Outdoor pool facing the river; Spa with a sauna and hot tub; Ten minutes' walk to the Jerónimos Monastery |
| sete-janelas-apartments | One- and two-bedroom apartments above the shops of Chiado, each with a full kitchen, a washing machine and tall windows on the street. | Full kitchen and washing machine; Two-bedroom apartments sleep 5; Self check-in with a door code |
| pensao-cortica | A family-run guesthouse on a lane in Mouraria, with simple rooms, a breakfast room lined in cork and Rossio five minutes downhill. | Family-run, with 11 rooms; Breakfast room open from 08:00; Five minutes' walk to Rossio |

Amenities
- casa-lanterna (12, unchanged): Free wifi, Breakfast available, Roof terrace, Air conditioning, Elevator, 24-hour front desk, Luggage storage, Non-smoking rooms, Courtyard, Daily housekeeping, Hairdryer, Safe in room
- cais-verde-hotel (19): Free wifi, Gym, Bar, Air conditioning, Elevator, 24-hour front desk, Restaurant, Room service, Luggage storage, Non-smoking rooms, Daily housekeeping, Hairdryer, Safe in room, Flat-screen TV, Soundproofed rooms, Accessible rooms, Step-free entrance, Express check-in and check-out, Laundry
- patio-quinze (13): Free wifi, Breakfast available, Garden, Non-smoking rooms, Luggage storage, Courtyard, Air conditioning, Heating, Daily housekeeping, Hairdryer, Kettle, Blackout curtains, Bicycle rental
- ladeira-rooms (12): Free wifi, Shared kitchen, Luggage storage, Non-smoking rooms, Heating, Self check-in, Hairdryer, Kettle, Laundry, Terrace, Cots available, Bicycle rental
- ribeira-lofts (15): Free wifi, Kitchen, Washing machine, Air conditioning, Heating, Coffee machine, Kettle, Flat-screen TV, Iron and ironing board, Self check-in, Elevator, Luggage storage, Cots available, Family rooms, Non-smoking rooms
- hotel-sal-e-vela (25): Free wifi, Outdoor pool, Spa, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Room service, Breakfast available, Garden, Terrace, Air conditioning, Minibar, Bathrobes and slippers, 24-hour front desk, Concierge, Elevator, Accessible rooms, Step-free entrance, Family rooms, Cots available, Pets allowed, Parking on site (paid)
- sete-janelas-apartments (15): Free wifi, Kitchen, Washing machine, Air conditioning, Heating, Coffee machine, Kettle, Flat-screen TV, Iron and ironing board, Hairdryer, Self check-in, Elevator, Family rooms, Cots available, Non-smoking rooms
- pensao-cortica (12): Free wifi, Breakfast available, Luggage storage, Air conditioning, Heating, Hairdryer, Non-smoking rooms, Daily housekeeping, Kettle, Tour desk, Cots available, Blackout curtains
- Rooms for the four existing non-showcase hotels stay as they are in lib/mock/hotels.ts.

### Showcase: Casa Lanterna
About
- A restored townhouse on a stepped lane below the castle, with 18 rooms over four floors. The upper rooms look across the rooftops of Alfama to the river. Breakfast is served in the tiled courtyard until 11:00, and guests can use the roof terrace until late. The Baixa and the riverfront are about ten minutes' walk downhill, and the 28 tram stops at the end of the street.
- Rooms are simple and quiet, with tiled floors, linen bedding and wooden shutters that keep out the morning light. The courtyard has a lemon tree and a long breakfast table. The front desk is open around the clock, holds bags after check-out and can book a taxi to the airport, about 25 minutes away by road.
- (The first paragraph is the existing description, unchanged.)

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Courtyard Double | 1 double bed | 18 m² | 2 | Courtyard | Air conditioning, Heating, Rain shower, Hairdryer, Safe in room, Kettle | Free cancellation, breakfast included $186 |
| River View Double | 1 king bed | 22 m² | 2 | River | Air conditioning, Heating, Rain shower, Hairdryer, Safe in room, Coffee machine, Work desk | Non-refundable, breakfast included $214; Free cancellation, breakfast included $238 |
| Terrace Suite | 1 king bed and a sofa bed | 34 m² plus a 12 m² terrace | 3 | Private terrace | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Hairdryer | Non-refundable, breakfast included $342; Free cancellation, breakfast included $376 |
| Family Room | 1 double bed and 2 single beds | 28 m² | 4 | The lane | Air conditioning, Heating, Rain shower, Hairdryer, Safe in room, Kettle, Blackout curtains | Non-refundable, breakfast included $272; Free cancellation, breakfast included $298 |
- The first three rooms and their existing rates are unchanged; the Courtyard Double keeps its single rate, the demo booking's. The Terrace Suite is still held back for stays over five nights (the demo's sold-out card).

Guest scores: Cleanliness 9.3; Comfort 9.0; Location 9.2; Staff 9.5; Value 8.7; Wifi 8.4

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Hannah | United Kingdom | Couple | Oct 2026 | 10 | Breakfast under the lemon tree | We ate in the courtyard every morning and never wanted to leave the table. The River View Double was worth the extra. |
| Marco | Italy | Friends | Sep 2026 | 9 | Steep lane, worth the climb | The lane has steps, so pack light if you can. Once you're inside, the rooms are calm and the terrace at sunset is lovely. |
| Aiko | Japan | Solo | Sep 2026 | 9 | Quiet and very clean | My room faced the courtyard and I heard nothing at night. The front desk drew me a map of the area on the first day. |
| David | United States | Couple | Aug 2026 | 8 | Great location, small bathroom | The 28 tram at the end of the street made getting around easy. The bathroom in the Courtyard Double is tight for two. |
| Sofia | Spain | Family | Jul 2026 | 9 | Easy with children | A cot was ready in the Family Room when we arrived. Breakfast had plenty our two would actually eat. |
| Lukas | Germany | Couple | Jun 2026 | 8 | Lovely terrace, patchy wifi upstairs | The roof terrace is the place to be in the evening. Wifi dropped now and then on the top floor. |

Nearby
- Castelo de São Jorge, 8 min walk
- Miradouro de Santa Luzia, 4 min walk
- Lisbon Cathedral, 6 min walk
- National Pantheon, 10 min walk
- Praça do Comércio, 12 min walk
- Lisbon airport, 25 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Terrace Suite has a sofa bed for a third guest, and the Family Room sleeps four.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 08:00. The roof terrace stays open until midnight.
- Accessibility: An elevator serves all floors. The lane outside has steps, so ask the hotel about step-free arrival before you book.
- (Children, Pets, Payment and Accessibility are the existing policies; the Family Room sentence and quiet hours are new.)

### Showcase: Hotel Sal e Vela
About
- A riverside hotel on the Belém docks, built around a long outdoor pool that faces the Tagus and the 25 de Abril Bridge. Its 64 rooms are spread over five floors, and most have a view of the water or the palm garden.
- The spa has a sauna, a hot tub and four treatment rooms, and the restaurant serves grilled fish and Portuguese wines on a terrace by the marina. The Jerónimos Monastery is a ten-minute walk away, and the 15 tram reaches Praça do Comércio in about 25 minutes.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Garden Double | 1 king bed or 2 single beds | 26 m² | 2 | Palm garden | Air conditioning, Rain shower, Coffee machine, Minibar, Safe in room, Bathrobes and slippers, Flat-screen TV | Non-refundable $312; Free cancellation $343; Free cancellation, breakfast included $381 |
| River Balcony Double | 1 king bed | 30 m² | 2 | River, with a balcony | Air conditioning, Balcony, Bathtub, Rain shower, Coffee machine, Minibar, Safe in room, Bathrobes and slippers, Flat-screen TV | Non-refundable $358; Free cancellation $394; Free cancellation, breakfast included $432 |
| Family Suite | 1 king bed and a sofa bed for two | 46 m² | 4 | Garden and pool | Air conditioning, Bathtub, Rain shower, Coffee machine, Minibar, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $446; Free cancellation $491; Free cancellation, breakfast included $529 |
| Bridge Suite | 1 king bed | 58 m² plus a 15 m² terrace | 2 | River and the bridge | Air conditioning, Bathtub, Rain shower, Coffee machine, Minibar, Safe in room, Bathrobes and slippers, Work desk, Flat-screen TV | Non-refundable $612; Free cancellation $673; Free cancellation, breakfast included $711 |
- Breakfast here costs $38 for the room, more than the city default.

Guest scores: Cleanliness 9.4; Comfort 9.2; Location 8.3; Staff 9.3; Value 8.4; Wifi 9.0

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Claire | France | Couple | Oct 2026 | 10 | The pool at sunset | We swam every evening with the bridge lit up in front of us. Breakfast on the terrace was worth adding. |
| Rahul | India | Family | Aug 2026 | 9 | Room for all four of us | The Family Suite gave the children space to spread out, and the sofa bed was comfortable. The tram into town is slow, so we took taxis at night. |
| Emma | Australia | Solo | Sep 2026 | 9 | A spa day well spent | I booked a massage and stayed in the sauna afterwards. Staff were warm without hovering. |
| Tom | United Kingdom | Business | Oct 2026 | 8 | Calm, but far from the center | Wifi was fast and the desk in the suite was a good size. Allow 20 minutes by car to meetings in the Baixa. |
| Mei | Singapore | Couple | Jul 2026 | 9 | Ask for a river room | The balcony room was worth the difference. The pool gets busy at midday in summer. |
| Jonas | Sweden | Friends | Jun 2026 | 8 | Excellent breakfast, pricey drinks | The breakfast spread was the best we had in Lisbon. Cocktails at the bar cost more than in town. |

Nearby
- Padrão dos Descobrimentos, 6 min walk
- MAAT museum, 9 min walk
- Jerónimos Monastery, 10 min walk
- Belém Tower, 12 min walk
- LX Factory, 8 min drive
- Lisbon airport, 25 min drive

House rules
- Children: Children of all ages are welcome. Cots are free on request, and the Family Suite has a sofa bed for two children.
- Pets: Dogs up to 10 kg are welcome for $25 a night, paid at the hotel.
- Payment: You pay the full price now, by card. The hotel asks for a card at check-in for extras. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 07:00. The pool is open 08:00 to 21:00.

---

## Rome
Center point: Piazza Venezia. One existing hotel (unchanged) plus seven new.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| albergo-tre-finestre | Albergo Tre Finestre | Hotel | 3 | Monti | 0.9 km | 8.7 Excellent | 1,034 | $164 | Mid-range | 14:00 | 11:00 | Yes |
| palazzo-lucerna | Palazzo Lucerna | Boutique hotel | 5 | Centro Storico | 0.7 km | 9.2 Exceptional | 868 | $398 | Luxury | 15:00 | 12:00 | Yes |
| casa-glicine | Casa Glicine | Guesthouse | 3 | Trastevere | 1.6 km | 8.9 Excellent | 642 | $132 | Mid-range | 14:00 | 10:30 | No |
| villa-merula | Villa Merula | Hotel | 4 | Aventino | 1.8 km | 8.7 Excellent | 1,218 | $226 | Upscale | 15:00 | 11:00 | No |
| appartamenti-fontanella | Appartamenti Fontanella | Apartment | 3 | Esquilino | 1.9 km | 8.1 Very good | 395 | $118 | Budget | 15:00 | 10:00 | No |
| corte-prati-suites | Corte Prati Suites | Aparthotel | 4 | Prati | 2.2 km | 8.6 Excellent | 727 | $189 | Mid-range | 15:00 | 11:00 | No |
| hotel-binario-nove | Hotel Binario Nove | Hotel | 3 | Termini | 2.0 km | 7.6 Good | 2,986 | $109 | Budget | 14:00 | 11:00 | No |
| le-querce-rosse-resort | Le Querce Rosse Resort | Resort | 4 | Appia Antica | 6.8 km | 8.8 Excellent | 954 | $264 | Upscale | 15:00 | 11:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| albergo-tre-finestre | A family-run hotel on a cobbled street in Monti, a ten-minute walk from the Colosseum. | Ten minutes' walk to the Colosseum; Breakfast in every rate; Family-run, with 16 rooms |
| palazzo-lucerna | An old palazzo two streets from Piazza Navona, with 24 rooms, a courtyard restaurant and a roof terrace over the domes. | Roof terrace over the domes; Dinner in the arcaded courtyard; Two streets from Piazza Navona |
| casa-glicine | Seven rooms in a wisteria-covered house on a quiet lane in Trastevere, run by a couple who live upstairs. | Seven rooms, hosts upstairs; Homemade breakfast; A quiet lane in Trastevere |
| villa-merula | A garden hotel on the Aventine Hill, with an outdoor pool, orange trees and the Circus Maximus at the foot of the hill. | Outdoor pool in the garden; A quiet hill above the Circus Maximus; Parking on site |
| appartamenti-fontanella | Simple apartments with kitchens near Santa Maria Maggiore, a short walk from Termini station and the metro. | A kitchen in every apartment; Five minutes' walk to Termini; Self check-in |
| corte-prati-suites | Studios and suites with kitchens on a tree-lined street in Prati, ten minutes' walk from the Vatican Museums. | A kitchen in every suite; Ten minutes' walk to the Vatican Museums; Gym and laundry on site |
| hotel-binario-nove | A practical hotel two minutes from Termini station, with soundproofed rooms and an early breakfast for morning trains. | Two minutes from Termini; Breakfast from 06:00; Soundproofed rooms |
| le-querce-rosse-resort | A country resort among umbrella pines on the old Appian Way, with a spa, two pools and bikes for the park. | Spa, indoor and outdoor pools; Bikes for the Appian Way park; Free parking |

Amenities
- albergo-tre-finestre (14): Free wifi, Breakfast available, Air conditioning, Luggage storage, Daily housekeeping, Heating, Hairdryer, Safe in room, Flat-screen TV, Elevator, Self check-in, Non-smoking rooms, Cots available, Family rooms
- palazzo-lucerna (25): Free wifi, Roof terrace, Restaurant, Bar, Breakfast available, Room service, Courtyard, Spa, Sauna, Massage treatments, Gym, Air conditioning, Heating, Minibar, Coffee machine, Bathrobes and slippers, Soundproofed rooms, 24-hour front desk, Concierge, Elevator, Luggage storage, Daily housekeeping, Accessible rooms, Non-smoking rooms, Cots available
- casa-glicine (12): Free wifi, Breakfast available, Garden, Air conditioning, Heating, Hairdryer, Kettle, Luggage storage, Non-smoking rooms, Daily housekeeping, Tour desk, Cots available
- villa-merula (18): Free wifi, Outdoor pool, Garden, Breakfast available, Bar, Restaurant, Air conditioning, Heating, Elevator, 24-hour front desk, Parking on site (paid), Electric vehicle charging, Family rooms, Cots available, Accessible rooms, Safe in room, Minibar, Non-smoking rooms
- appartamenti-fontanella (12): Free wifi, Kitchen, Air conditioning, Heating, Washing machine, Kettle, Coffee machine, Flat-screen TV, Self check-in, Hairdryer, Iron and ironing board, Non-smoking rooms
- corte-prati-suites (16): Free wifi, Kitchen, Gym, Air conditioning, Heating, Coffee machine, Kettle, Flat-screen TV, Work desk, Elevator, Laundry, 24-hour front desk, Luggage storage, Family rooms, Cots available, Non-smoking rooms
- hotel-binario-nove (13): Free wifi, Breakfast available, Soundproofed rooms, 24-hour front desk, Air conditioning, Heating, Elevator, Luggage storage, Hairdryer, Flat-screen TV, Non-smoking rooms, Express check-in and check-out, Bar
- le-querce-rosse-resort (24): Free wifi, Spa, Outdoor pool, Indoor pool, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Breakfast available, Garden, Terrace, Free parking, Electric vehicle charging, Bicycle rental, Airport shuttle (paid), Family rooms, Kids' club, Cots available, Air conditioning, Accessible rooms, 24-hour front desk, Pets allowed

### Showcase: Albergo Tre Finestre
About
- A family-run hotel on a cobbled street in Monti, a ten-minute walk from the Colosseum. Its 16 rooms fill the second and third floors of an old ochre building, and the three tall windows over the street give the hotel its name.
- Breakfast is laid out every morning in a small room off the reception: pastries from the bakery downstairs, fruit, eggs to order and proper coffee. Cavour metro station is three minutes away, and the owners keep a short list of the trattorias they eat at themselves.
- (The first sentence is the existing description, unchanged.)

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Classic Double | 1 double bed | 16 m² | 2 | Street | Air conditioning, Heating, Hairdryer, Safe in room, Flat-screen TV | Free cancellation, breakfast included $164 |
| Twin Room | 2 single beds | 17 m² | 2 | Inner courtyard | Air conditioning, Heating, Hairdryer, Safe in room, Flat-screen TV | Free cancellation, breakfast included $172 |
| Triple Room | 1 double bed and 1 single bed | 22 m² | 3 | Street | Air conditioning, Heating, Hairdryer, Safe in room, Flat-screen TV, Kettle | Non-refundable, breakfast included $194; Free cancellation, breakfast included $212 |
| Junior Suite | 1 king bed and a sofa bed | 28 m² | 3 | Street, behind the three windows | Air conditioning, Heating, Bathtub, Rain shower, Hairdryer, Safe in room, Coffee machine, Minibar | Non-refundable, breakfast included $226; Free cancellation, breakfast included $249 |
- The Classic Double and Twin Room keep their existing rates. Breakfast in every rate.

Guest scores: Cleanliness 8.9; Comfort 8.4; Location 9.4; Staff 9.2; Value 8.7; Wifi 7.9

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Olivia | Canada | Couple | Oct 2026 | 9 | The owners made the trip | They booked us a table at a trattoria we would never have found. The Classic Double is small but spotless. |
| Kenji | Japan | Solo | Sep 2026 | 8 | Close to everything | I walked to the Forum before breakfast and back for a rest after lunch. The street was noisy until midnight on Friday. |
| Fatima | Morocco | Family | Aug 2026 | 9 | Room for three | The Triple Room fit the three of us with space for our bags. The pastries at breakfast were fresh every day. |
| James | United Kingdom | Friends | Sep 2026 | 8 | Good value for Monti | We paid less than friends staying by the Pantheon and had a better street for dinner. Wifi was slow in the evenings. |
| Ana | Brazil | Couple | Jul 2026 | 10 | Book the Junior Suite | Waking up behind those three tall windows was the best part of our week in Rome. The bathtub was a bonus after long days on foot. |
| Pieter | Netherlands | Business | Jun 2026 | 8 | Easy for the metro | Cavour station is a few minutes away, so getting to meetings was simple. There's no desk in the Classic Double, so I worked from the breakfast room. |

Nearby
- Cavour metro station, 3 min walk
- Santa Maria Maggiore, 8 min walk
- Roman Forum, 9 min walk
- Colosseum, 10 min walk
- Trevi Fountain, 18 min walk
- Rome Fiumicino airport, 45 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Triple Room and the Junior Suite take a third guest.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 23:00 to 07:30. The front desk is open 07:00 to 23:00, and late arrivals get a door code by email.

### Showcase: Palazzo Lucerna
About
- An old palazzo two streets from Piazza Navona, restored into 24 rooms around an arcaded courtyard. Ceilings are high and beamed, the floors are old terracotta, and the bathrooms are new marble with walk-in rain showers.
- Dinner is served in the courtyard from April to October and in the vaulted cellar in winter. The roof terrace looks across the domes of the old town to St Peter's and opens for drinks at 17:00. The small spa has a sauna and two treatment rooms.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Deluxe Double | 1 king bed or 2 single beds | 24 m² | 2 | Courtyard | Air conditioning, Heating, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV | Non-refundable $398; Free cancellation $438; Free cancellation, breakfast included $482 |
| Superior Double | 1 king bed | 30 m² | 2 | Street, toward the piazza | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk | Non-refundable $456; Free cancellation $502; Free cancellation, breakfast included $546 |
| Courtyard Junior Suite | 1 king bed and a sofa bed | 38 m² | 3 | Courtyard, with a small balcony | Air conditioning, Heating, Balcony, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room | Non-refundable $548; Free cancellation $603; Free cancellation, breakfast included $647 |
| Rooftop Suite | 1 king bed | 52 m² plus a 20 m² terrace | 2 | The domes of the old town | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk | Non-refundable $842; Free cancellation $926; Free cancellation, breakfast included $970 |
- Breakfast here costs $44 for the room.

Guest scores: Cleanliness 9.5; Comfort 9.3; Location 9.6; Staff 9.2; Value 8.4; Wifi 9.0

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Charlotte | United Kingdom | Couple | Oct 2026 | 10 | Drinks on the roof at sunset | We went up every evening at 17:00 and watched the domes turn pink. The Superior Double was quiet even with the windows open. |
| Daniel | Israel | Couple | Sep 2026 | 9 | Beautiful rooms, pricey dinner | The beamed ceilings and the marble bathroom were exactly what we hoped for. Dinner in the courtyard was good but expensive for what it was. |
| Priya | India | Family | Aug 2026 | 9 | Calm in the middle of Rome | The Junior Suite fit us and our daughter, and the sofa bed was made up each night. You hear nothing from the street once you're inside. |
| Mateo | Argentina | Solo | Oct 2026 | 9 | Walk everywhere | Navona is two minutes away and the Pantheon about five. The concierge got me an early entry slot at the Vatican Museums. |
| Grace | United States | Couple | Jul 2026 | 10 | Worth saving for | Staff remembered our names from the first evening. The massage at the spa was the best I've had. |
| Henrik | Denmark | Business | Jun 2026 | 8 | Great base, slow elevator | Wifi was fast and the desk was big enough for a laptop and papers. The elevator is small and slow at breakfast time. |

Nearby
- Piazza Navona, 3 min walk
- Pantheon, 6 min walk
- Campo de' Fiori, 7 min walk
- Trevi Fountain, 14 min walk
- St Peter's Basilica, 22 min walk
- Rome Fiumicino airport, 45 min drive

House rules
- Children: Children of all ages are welcome. Cots are free, and the Courtyard Junior Suite has a sofa bed for a child.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. The hotel asks for a card at check-in for extras. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 23:00 to 07:00. The roof terrace closes at 23:00.

---

## Paris
Center point: Notre-Dame. Eight new hotels.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| hotel-des-trois-horloges | Hôtel des Trois Horloges | Boutique hotel | 4 | Le Marais | 1.2 km | 9.2 Exceptional | 1,148 | $274 | Upscale | 15:00 | 11:00 | Yes |
| les-ateliers-faubourg | Les Ateliers Faubourg | Aparthotel | 3 | Canal Saint-Martin | 2.6 km | 8.7 Excellent | 836 | $198 | Mid-range | 16:00 | 11:00 | Yes |
| hotel-pigeonnier | Hôtel Pigeonnier | Hotel | 3 | Montmartre | 4.3 km | 8.2 Very good | 1,976 | $162 | Mid-range | 15:00 | 11:00 | No |
| maison-verriere | Maison Verrière | Hotel | 5 | Saint-Germain-des-Prés | 1.4 km | 9.3 Exceptional | 712 | $486 | Luxury | 15:00 | 12:00 | No |
| les-volets-bleus | Les Volets Bleus | Guesthouse | 2 | Belleville | 3.9 km | 8.0 Very good | 547 | $104 | Budget | 15:00 | 10:30 | No |
| les-toits-du-quartier-latin | Les Toits du Quartier Latin | Apartment | 3 | Latin Quarter | 1.0 km | 8.6 Excellent | 398 | $219 | Upscale | 16:00 | 10:00 | No |
| hotel-quai-nord | Hôtel Quai Nord | Hotel | 3 | Gare du Nord | 3.3 km | 7.4 Good | 3,214 | $139 | Mid-range | 14:00 | 11:00 | No |
| hotel-bleu-ardoise | Hôtel Bleu Ardoise | Boutique hotel | 4 | Batignolles | 4.4 km | 8.8 Excellent | 903 | $231 | Upscale | 15:00 | 11:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| hotel-des-trois-horloges | A 17-room hotel in a former clockmaker's workshop in the Marais, with a glass-roofed lounge and a quiet inner courtyard. | Glass-roofed lounge; Quiet inner courtyard; Five minutes' walk to the Place des Vosges |
| les-ateliers-faubourg | Studios and apartments with kitchens in old print workshops by the Canal Saint-Martin. | A full kitchen in every apartment; The canal a minute from the door; A washing machine in each apartment |
| hotel-pigeonnier | A simple hotel on a steep street below Sacré-Coeur, with small rooms, an attic breakfast room and views over the roofs. | Roof views from the top floors; Five minutes to Sacré-Coeur; Breakfast in the attic |
| maison-verriere | A grand hotel under a glass roof in Saint-Germain, with an indoor pool, a spa and a restaurant in the old winter garden. | Indoor pool and spa; Restaurant in the winter garden; The Louvre 15 minutes away on foot |
| les-volets-bleus | Five rooms behind blue shutters in Belleville, with a shared kitchen, a small garden and the Buttes-Chaumont park close by. | Five rooms, hosts on site; Shared kitchen and garden; Near the Buttes-Chaumont park |
| les-toits-du-quartier-latin | Top-floor apartments with sloped ceilings and roof views, five minutes' walk from the Panthéon and the Luxembourg Gardens. | Views over the rooftops; Five minutes to the Panthéon; A full kitchen |
| hotel-quai-nord | A large, practical hotel opposite the Gare du Nord, handy for the train from London, with soundproofed rooms and a bar open all night. | Opposite the Gare du Nord; Breakfast from 05:30; Soundproofed rooms |
| hotel-bleu-ardoise | A boutique hotel on a small square in Batignolles, with slate-blue rooms, a terrace bar and a neighborhood feel. | Terrace bar on the square; A quiet, local neighborhood; Metro to the center in 15 minutes |

Amenities
- hotel-des-trois-horloges (20): Free wifi, Courtyard, Bar, Breakfast available, Air conditioning, Heating, Elevator, 24-hour front desk, Concierge, Luggage storage, Daily housekeeping, Coffee machine, Minibar, Rain shower, Bathrobes and slippers, Soundproofed rooms, Safe in room, Hairdryer, Non-smoking rooms, Cots available
- les-ateliers-faubourg (18): Free wifi, Kitchen, Washing machine, Breakfast available, Heating, Air conditioning, Coffee machine, Kettle, Flat-screen TV, Work desk, Elevator, Self check-in, Luggage storage, Iron and ironing board, Family rooms, Cots available, Non-smoking rooms, Bicycle rental
- hotel-pigeonnier (13): Free wifi, Breakfast available, Elevator, Heating, 24-hour front desk, Luggage storage, Hairdryer, Flat-screen TV, Non-smoking rooms, Daily housekeeping, Safe in room, Tour desk, Cots available
- maison-verriere (25): Free wifi, Indoor pool, Spa, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Room service, Breakfast available, Garden, Air conditioning, Heating, Minibar, Bathrobes and slippers, Bathtub, 24-hour front desk, Concierge, Elevator, Accessible rooms, Step-free entrance, Cots available, Pets allowed, Parking on site (paid)
- les-volets-bleus (12): Free wifi, Shared kitchen, Garden, Breakfast available, Heating, Hairdryer, Kettle, Luggage storage, Self check-in, Non-smoking rooms, Cots available, Laundry
- les-toits-du-quartier-latin (13): Free wifi, Kitchen, Washing machine, Heating, Coffee machine, Kettle, Flat-screen TV, Hairdryer, Iron and ironing board, Self check-in, Blackout curtains, Non-smoking rooms, Cots available
- hotel-quai-nord (15): Free wifi, Bar, 24-hour front desk, Breakfast available, Soundproofed rooms, Air conditioning, Heating, Elevator, Luggage storage, Express check-in and check-out, Flat-screen TV, Hairdryer, Accessible rooms, Non-smoking rooms, Family rooms
- hotel-bleu-ardoise (16): Free wifi, Terrace, Bar, Breakfast available, Air conditioning, Heating, Elevator, 24-hour front desk, Luggage storage, Coffee machine, Rain shower, Safe in room, Hairdryer, Non-smoking rooms, Cots available, Bicycle rental
- Les Toits du Quartier Latin has no elevator: its house rules carry the accessibility line "The apartments are on the fifth and sixth floors, up stairs, with no elevator."

### Showcase: Hôtel des Trois Horloges
About
- A 17-room hotel in a former clockmaker's workshop in the Marais. Three old clock faces still hang over the courtyard door, and the workshop's glass roof now covers a lounge where breakfast is served until 11:00.
- Rooms are small to mid-sized, in pale wood and linen, and the quietest face the inner courtyard. The Place des Vosges and the Picasso Museum are five minutes away on foot, and Saint-Paul metro station is around the corner.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Courtyard Double | 1 queen bed | 15 m² | 2 | Courtyard | Air conditioning, Heating, Rain shower, Coffee machine, Safe in room, Hairdryer | Non-refundable $274; Free cancellation $301; Free cancellation, breakfast included $335 |
| Superior Double | 1 king bed or 2 single beds | 19 m² | 2 | Street | Air conditioning, Heating, Rain shower, Coffee machine, Minibar, Bathrobes and slippers, Safe in room, Hairdryer | Non-refundable $318; Free cancellation $350; Free cancellation, breakfast included $384 |
| Clock Suite | 1 king bed and a sofa bed | 30 m² | 3 | The clock faces and the courtyard | Air conditioning, Heating, Bathtub, Rain shower, Coffee machine, Minibar, Bathrobes and slippers, Work desk, Safe in room | Non-refundable $446; Free cancellation $491; Free cancellation, breakfast included $525 |

Guest scores: Cleanliness 9.4; Comfort 9.0; Location 9.6; Staff 9.3; Value 8.6; Wifi 9.1

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Sarah | United States | Couple | Oct 2026 | 10 | Breakfast under the glass roof | The lounge is bright even on a grey morning, and the croissants were excellent. We walked everywhere from here. |
| Yusuf | Turkey | Solo | Sep 2026 | 9 | Small room, big comfort | The Courtyard Double is compact but very well thought out. It was silent at night. |
| Chloé | Belgium | Friends | Oct 2026 | 9 | The Marais on the doorstep | Shops, bakeries and bars are all a few minutes away. Staff gave us good tips for dinner. |
| Ben | Australia | Couple | Aug 2026 | 9 | Ask for the Clock Suite | Looking out at the old clock faces from bed was a treat. Worth the extra for the space. |
| Ingrid | Norway | Business | Sep 2026 | 8 | Fast wifi, no desk | Wifi held up for video calls all week. The Superior Double has nowhere proper to work. |
| Luis | Mexico | Couple | Jul 2026 | 9 | A warm welcome | We arrived early and they stored our bags and had the room ready by 13:00. Pricey, but this is the Marais. |

Nearby
- Saint-Paul metro station, 3 min walk
- Place des Vosges, 5 min walk
- Picasso Museum, 5 min walk
- Centre Pompidou, 12 min walk
- Notre-Dame, 15 min walk
- Paris Charles de Gaulle airport, 50 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Clock Suite has a sofa bed for a third guest.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 08:00.

### Showcase: Les Ateliers Faubourg
About
- Studios and apartments in three old print workshops around a cobbled yard, a minute from the Canal Saint-Martin. Each has a full kitchen, a washing machine and tall factory windows.
- There's no restaurant, but a breakfast basket of bread, fruit, jam and coffee can be left at your door at 08:00. The canal's cafés and République metro station are a short walk away, and the Gare du Nord is 15 minutes on foot. Reception is staffed 08:00 to 20:00; after that you let yourself in with a door code.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Studio | 1 queen bed | 24 m² | 2 | The yard | Kitchen, Washing machine, Coffee machine, Kettle, Flat-screen TV, Heating, Air conditioning | Non-refundable $198; Free cancellation $218; Free cancellation, breakfast included $252 |
| One-bedroom Apartment | 1 king bed and a sofa bed | 38 m² | 4 | The canal | Kitchen, Washing machine, Coffee machine, Kettle, Flat-screen TV, Heating, Air conditioning, Work desk, Iron and ironing board | Non-refundable $264; Free cancellation $290; Free cancellation, breakfast included $324 |
| Two-bedroom Apartment | 1 king bed and 2 single beds | 56 m² | 4 | The canal | Kitchen, Washing machine, Coffee machine, Kettle, Flat-screen TV, Heating, Air conditioning, Bathtub, Work desk, Iron and ironing board | Non-refundable $356; Free cancellation $392; Free cancellation, breakfast included $426 |

Guest scores: Cleanliness 8.9; Comfort 8.7; Location 8.6; Staff 8.5; Value 9.0; Wifi 8.6

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Laura | Italy | Family | Aug 2026 | 9 | Like living in Paris | We shopped at the market and cooked most nights. The washing machine saved us on a two-week trip. |
| Kwame | Ghana | Business | Oct 2026 | 9 | Good for a long stay | The desk and the wifi worked well for a week of remote work. It was quiet at night despite the canal bars. |
| Elena | Spain | Couple | Sep 2026 | 8 | Great flat, no reception at night | The apartment was spotless and the windows are huge. Reception closes at 20:00, so plan around a late arrival. |
| Noah | Canada | Friends | Sep 2026 | 9 | The canal on the doorstep | We spent the evenings by the water with a bottle from the shop downstairs. Two bedrooms meant nobody had the sofa. |
| Hiro | Japan | Couple | Jul 2026 | 8 | The breakfast basket is worth it | Fresh bread at the door each morning. The studio kitchen is small but has everything. |
| Megan | Ireland | Solo | Jun 2026 | 9 | Easy to get around | The walk back from the metro at night felt fine. République got me anywhere in 20 minutes. |

Nearby
- Canal Saint-Martin, 1 min walk
- République metro station, 6 min walk
- Place de la République, 7 min walk
- Gare du Nord, 15 min walk
- Le Marais, 15 min walk
- Paris Charles de Gaulle airport, 45 min drive

House rules
- Children: Children of all ages are welcome. Cots and high chairs are free on request.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the property.
- Quiet hours: 22:00 to 08:00. Arrivals after 20:00 use the door code sent by email on the day.

---

## Barcelona
Center point: Plaça de Catalunya. Eight new hotels.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| casa-rajola | Casa Rajola | Boutique hotel | 4 | Eixample | 0.9 km | 9.0 Exceptional | 1,322 | $236 | Upscale | 15:00 | 11:00 | Yes |
| mar-blava-resort | Mar Blava Resort | Resort | 4 | Poblenou | 4.2 km | 8.6 Excellent | 2,084 | $258 | Upscale | 15:00 | 11:00 | Yes |
| pensio-taronja | Pensió Taronja | Guesthouse | 2 | Gothic Quarter | 0.7 km | 7.9 Good | 1,476 | $96 | Budget | 14:00 | 11:00 | No |
| gracia-terrat-apartments | Gràcia Terrat Apartments | Apartment | 3 | Gràcia | 2.1 km | 8.7 Excellent | 512 | $171 | Mid-range | 16:00 | 10:00 | No |
| aparthotel-vermut | Aparthotel Vermut | Aparthotel | 3 | Sant Antoni | 1.5 km | 8.3 Very good | 1,094 | $149 | Mid-range | 15:00 | 11:00 | No |
| hotel-passeig-daurat | Hotel Passeig Daurat | Hotel | 5 | Passeig de Gràcia | 0.6 km | 9.1 Exceptional | 1,837 | $412 | Luxury | 15:00 | 12:00 | No |
| hotel-sants-andana | Hotel Sants Andana | Hotel | 3 | Sants | 3.1 km | 7.6 Good | 2,651 | $118 | Budget | 14:00 | 11:00 | No |
| hotel-llum-del-born | Hotel Llum del Born | Boutique hotel | 4 | El Born | 1.1 km | 8.9 Excellent | 978 | $221 | Upscale | 15:00 | 11:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| casa-rajola | A modernista apartment building in the Eixample turned into 30 rooms, with its original patterned floor tiles and a plunge pool on the roof. | Original tiled floors; Plunge pool on the roof; Five minutes' walk to Passeig de Gràcia |
| mar-blava-resort | A beach resort across the road from Bogatell beach, with two pools, a kids' club and balconies over the sea. | The beach across the road; Two pools and a kids' club; Sea-view balconies |
| pensio-taronja | Simple rooms on two floors of an old building in the Gothic Quarter, with the cathedral a few minutes' walk away. | In the Gothic Quarter; Five minutes to the cathedral; Small balconies on the second floor |
| gracia-terrat-apartments | Apartments around a shared roof terrace in Gràcia, a neighborhood of small squares, a short walk from Park Güell. | Shared roof terrace; A kitchen in every apartment; A short walk to Park Güell |
| aparthotel-vermut | Studios and suites with kitchens above a market street in Sant Antoni, with a gym and a laundry room. | A kitchen in every studio; Gym and laundry room; Sant Antoni market on the street |
| hotel-passeig-daurat | A grand hotel on Passeig de Gràcia, across from Gaudí's Casa Batlló, with a rooftop pool, a spa and a terrace bar. | Rooftop pool and bar; Spa with a sauna; Across from Casa Batlló |
| hotel-sants-andana | A practical hotel beside Sants station, with direct trains to the airport and soundproofed rooms. | Beside Sants station; Direct trains to the airport; Breakfast from 06:00 |
| hotel-llum-del-born | A boutique hotel on a narrow street in El Born, with a courtyard bar and rooms full of light from tall balcony doors. | Courtyard bar; Balcony doors in every room; Five minutes to the Picasso Museum |

Amenities
- casa-rajola (21): Free wifi, Plunge pool, Roof terrace, Breakfast available, Bar, Balcony, Air conditioning, Heating, Elevator, 24-hour front desk, Concierge, Luggage storage, Daily housekeeping, Coffee machine, Minibar, Rain shower, Safe in room, Hairdryer, Soundproofed rooms, Non-smoking rooms, Cots available
- mar-blava-resort (25): Free wifi, Beach access, Outdoor pool, Kids' club, Spa, Gym, Hot tub, Restaurant, Bar, Breakfast available, Room service, Terrace, Balcony, Air conditioning, Minibar, Safe in room, 24-hour front desk, Elevator, Family rooms, Cots available, Accessible rooms, Step-free entrance, Bicycle rental, Parking on site (paid), Electric vehicle charging
- pensio-taronja (12): Free wifi, Air conditioning, Luggage storage, Heating, Hairdryer, Non-smoking rooms, Daily housekeeping, Balcony, Kettle, Self check-in, Tour desk, Flat-screen TV
- gracia-terrat-apartments (14): Free wifi, Roof terrace, Kitchen, Washing machine, Air conditioning, Heating, Coffee machine, Kettle, Flat-screen TV, Iron and ironing board, Self check-in, Family rooms, Cots available, Non-smoking rooms
- aparthotel-vermut (16): Free wifi, Kitchen, Gym, Laundry, Air conditioning, Heating, Coffee machine, Kettle, Flat-screen TV, Work desk, Elevator, 24-hour front desk, Luggage storage, Family rooms, Cots available, Non-smoking rooms
- hotel-passeig-daurat (25): Free wifi, Outdoor pool, Spa, Rooftop bar, Sauna, Massage treatments, Gym, Restaurant, Room service, Breakfast available, Air conditioning, Heating, Minibar, Bathtub, Bathrobes and slippers, Soundproofed rooms, 24-hour front desk, Concierge, Elevator, Accessible rooms, Step-free entrance, Cots available, Family rooms, Pets allowed, Parking on site (paid)
- hotel-sants-andana (14): Free wifi, Breakfast available, Soundproofed rooms, 24-hour front desk, Air conditioning, Heating, Elevator, Luggage storage, Express check-in and check-out, Bar, Flat-screen TV, Accessible rooms, Non-smoking rooms, Family rooms
- hotel-llum-del-born (17): Free wifi, Courtyard, Bar, Breakfast available, Balcony, Air conditioning, Heating, Elevator, 24-hour front desk, Luggage storage, Daily housekeeping, Coffee machine, Rain shower, Safe in room, Hairdryer, Non-smoking rooms, Cots available

### Showcase: Casa Rajola
About
- A modernista apartment building from the early 1900s in the Eixample, turned into 30 rooms. The original patterned floor tiles, the carved doors and the wrought-iron elevator are all still in use.
- Breakfast is served in the old dining room until 11:00. The roof has a small plunge pool, sun loungers and a view to the towers of the Sagrada Família. Passeig de Gràcia is five minutes away on foot, and the airport bus stops at Plaça de Catalunya, 12 minutes' walk.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Classic Double | 1 queen bed | 18 m² | 2 | Inner patio | Air conditioning, Heating, Rain shower, Coffee machine, Safe in room, Hairdryer | Non-refundable $236; Free cancellation $260; Free cancellation, breakfast included $286 |
| Balcony Double | 1 king bed or 2 single beds | 22 m² | 2 | Street, with a balcony | Air conditioning, Heating, Balcony, Rain shower, Coffee machine, Minibar, Safe in room, Hairdryer | Non-refundable $274; Free cancellation $301; Free cancellation, breakfast included $327 |
| Gallery Suite | 1 king bed and a sofa bed | 34 m² | 3 | The tiled gallery over the street | Air conditioning, Heating, Bathtub, Rain shower, Coffee machine, Minibar, Bathrobes and slippers, Safe in room | Non-refundable $372; Free cancellation $409; Free cancellation, breakfast included $435 |

Guest scores: Cleanliness 9.2; Comfort 8.9; Location 9.4; Staff 9.1; Value 8.5; Wifi 8.8

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Marta | Poland | Couple | Oct 2026 | 10 | Those floors | Every room has different tiles and ours was beautiful. The roof pool is small but perfect after a hot day. |
| Oliver | United Kingdom | Friends | Sep 2026 | 9 | An easy base | We walked to the Gothic Quarter and took the metro to the beach. We were back on the roof by sunset every night. |
| Amara | Nigeria | Solo | Aug 2026 | 9 | Calm in the Eixample | My patio room was very quiet. Breakfast had good local cheese and tomato bread. |
| Lucas | France | Couple | Sep 2026 | 8 | The balcony room is the one | The balcony over the street was lovely in the morning. There was some traffic noise until late. |
| Ji-woo | South Korea | Family | Jul 2026 | 9 | The Gallery Suite fit us all | Our son slept on the sofa bed and still had room to play. Staff booked us Sagrada Família tickets for the next morning. |
| Robert | United States | Business | Jun 2026 | 8 | Lovely hotel, small desk | Wifi was solid for calls. The Classic Double only has a small table to work at. |

Nearby
- Passeig de Gràcia, 5 min walk
- Casa Batlló, 7 min walk
- Plaça de Catalunya, 12 min walk
- La Boqueria market, 16 min walk
- Sagrada Família, 25 min walk
- Barcelona airport, 25 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Gallery Suite has a sofa bed for a third guest.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 23:00 to 08:00. The roof pool is open 09:00 to 21:00.

### Showcase: Mar Blava Resort
About
- A beach resort across the road from Bogatell beach, with 180 rooms in two low buildings around a garden. There's a family pool with a shallow end, a quieter adults' pool by the spa, and a kids' club for ages 4 to 12 every day from June to September.
- Most rooms have a balcony, and the higher floors look straight out to sea. The beach restaurant serves paella and grilled fish at lunch, and the cycle path along the seafront reaches Barceloneta in about 15 minutes by bike. Poblenou metro station is a ten-minute walk.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Garden Double | 1 king bed or 2 single beds | 24 m² | 2 | Garden | Air conditioning, Balcony, Minibar, Safe in room, Coffee machine, Flat-screen TV | Non-refundable $258; Free cancellation $284; Free cancellation, breakfast included $316 |
| Sea View Double | 1 king bed | 26 m² | 2 | The sea | Air conditioning, Balcony, Rain shower, Minibar, Safe in room, Coffee machine, Flat-screen TV | Non-refundable $312; Free cancellation $343; Free cancellation, breakfast included $375 |
| Family Room | 1 king bed and 2 single beds | 36 m² | 4 | The pools | Air conditioning, Balcony, Minibar, Safe in room, Coffee machine, Flat-screen TV, Blackout curtains | Non-refundable $384; Free cancellation $422; Free cancellation, breakfast included $468 |
| Sea View Suite | 1 king bed and a sofa bed | 48 m² plus a 14 m² terrace | 3 | The sea | Air conditioning, Bathtub, Rain shower, Bathrobes and slippers, Minibar, Safe in room, Coffee machine, Flat-screen TV | Non-refundable $496; Free cancellation $546; Free cancellation, breakfast included $578 |
- Breakfast here costs $32 for the room, $46 for the Family Room.

Guest scores: Cleanliness 8.7; Comfort 8.6; Location 8.5; Staff 8.8; Value 8.2; Wifi 8.6

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Isabel | Portugal | Family | Aug 2026 | 9 | The kids' club made our week | Our two went every morning and came back happy. The shallow end of the family pool was perfect for the little one. |
| Tariq | United Arab Emirates | Couple | Sep 2026 | 9 | Beach and city in one | We spent the mornings on the sand and the evenings in the old town. Ask for a high floor for the sea view. |
| Greta | Germany | Friends | Jul 2026 | 8 | Great pools, busy breakfast | The adults' pool by the spa was calm all day. Breakfast was crowded at 09:00, so go early. |
| Carlos | Chile | Couple | Oct 2026 | 9 | Go in October | The sea was still warm and the beach was quiet. The suite terrace was the best part. |
| Nina | Switzerland | Solo | Jun 2026 | 8 | Good, but a walk from the metro | Ten minutes each way to the metro adds up over a week. The spa was very good. |
| Michael | United States | Family | Jul 2026 | 7 | Fine, but book the sea view | Our garden room looked into the trees and got little sun. The staff were helpful and the food was good. |

Nearby
- Bogatell beach, 2 min walk
- Rambla del Poblenou, 9 min walk
- Poblenou metro station, 10 min walk
- Torre Glòries, 18 min walk
- Barceloneta, 12 min drive
- Barcelona airport, 25 min drive

House rules
- Children: Children of all ages are welcome. Cots are free, the kids' club takes ages 4 to 12, and the Family Room sleeps four.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. The resort asks for a card at check-in for extras. A local tourist tax, if the city charges one, is paid at the resort.
- Quiet hours: 23:00 to 08:00. The pools are open 09:00 to 20:00.

---

## Amsterdam
Center point: Dam Square. Eight new hotels.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| hotel-grachtenlicht | Hotel Grachtenlicht | Boutique hotel | 4 | Jordaan | 1.1 km | 9.1 Exceptional | 1,206 | $268 | Upscale | 15:00 | 11:00 | Yes |
| woonboot-zilverreiger | Woonboot Zilverreiger | Apartment | 4 | Western Islands | 1.6 km | 9.3 Exceptional | 214 | $244 | Upscale | 16:00 | 10:00 | Yes |
| hotel-kade-oost | Hotel Kade Oost | Hotel | 3 | Eastern Docklands | 2.9 km | 8.0 Very good | 1,588 | $138 | Mid-range | 15:00 | 11:00 | No |
| gastenhuis-de-ooievaar | Gastenhuis De Ooievaar | Guesthouse | 2 | De Pijp | 2.6 km | 8.4 Very good | 633 | $112 | Budget | 14:00 | 10:30 | No |
| aparthotel-het-atelier | Aparthotel Het Atelier | Aparthotel | 4 | Oud-West | 2.3 km | 8.6 Excellent | 902 | $189 | Mid-range | 15:00 | 11:00 | No |
| hotel-spiegelbeeld | Hotel Spiegelbeeld | Hotel | 5 | Canal Ring | 0.9 km | 9.2 Exceptional | 1,074 | $454 | Luxury | 15:00 | 12:00 | No |
| hotel-pont-noord | Hotel Pont Noord | Boutique hotel | 4 | Amsterdam-Noord | 2.4 km | 8.5 Excellent | 1,311 | $176 | Mid-range | 15:00 | 11:00 | No |
| hotel-sloep | Hotel Sloep | Hotel | 2 | Centrum | 0.8 km | 7.3 Good | 2,742 | $119 | Budget | 14:00 | 10:30 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| hotel-grachtenlicht | Three canal houses joined into one hotel on a Jordaan canal, with 22 rooms, steep old stairs and an elevator added at the back. | Canal views from most rooms; Breakfast in the garden room; Six minutes' walk to the Anne Frank House |
| woonboot-zilverreiger | Three converted houseboats on a quiet canal in the Western Islands, each with a kitchen, a deck on the water and up to two bedrooms. | A private deck on the canal; Up to two bedrooms and a kitchen; Bikes for rent from the host |
| hotel-kade-oost | A modern hotel on the old docks east of Centraal Station, with big windows over the water and the tram at the door. | Views over the water; The tram at the door; Bar on the roof |
| gastenhuis-de-ooievaar | Four rooms above a café in De Pijp, a short walk from the Albert Cuyp market and the Sarphatipark. | Four rooms, hosts downstairs; Albert Cuyp market nearby; Breakfast in the café |
| aparthotel-het-atelier | Studios and suites with kitchens in a former art school in Oud-West, a few minutes from the Vondelpark. | A kitchen in every suite; Near the Vondelpark; Gym on site |
| hotel-spiegelbeeld | A grand hotel in two merchants' houses on the Canal Ring, with a spa, an indoor pool and a garden behind. | Indoor pool and spa; A garden behind the houses; On the Canal Ring |
| hotel-pont-noord | A boutique hotel in an old shipyard in Amsterdam-Noord, three minutes from the free ferry to Centraal Station. | The free ferry to Centraal Station; Rooms in an old shipyard; Restaurant terrace on the river |
| hotel-sloep | Small, simple rooms five minutes from Centraal Station, with a 24-hour front desk and a bar in the lobby. | Five minutes from Centraal Station; 24-hour front desk; Lobby bar |

Amenities
- hotel-grachtenlicht (18): Free wifi, Breakfast available, Garden, Bar, Heating, Elevator, 24-hour front desk, Concierge, Luggage storage, Daily housekeeping, Coffee machine, Minibar, Rain shower, Safe in room, Hairdryer, Bicycle rental, Non-smoking rooms, Cots available
- woonboot-zilverreiger (15): Free wifi, Kitchen, Terrace, Breakfast available, Heating, Washing machine, Coffee machine, Kettle, Flat-screen TV, Hairdryer, Self check-in, Bicycle rental, Family rooms, Cots available, Non-smoking rooms
- hotel-kade-oost (16): Free wifi, Rooftop bar, Restaurant, Breakfast available, Heating, Air conditioning, Elevator, 24-hour front desk, Luggage storage, Flat-screen TV, Soundproofed rooms, Accessible rooms, Step-free entrance, Non-smoking rooms, Family rooms, Bicycle rental
- gastenhuis-de-ooievaar (12): Free wifi, Breakfast available, Heating, Hairdryer, Kettle, Luggage storage, Non-smoking rooms, Daily housekeeping, Blackout curtains, Bicycle rental, Tour desk, Cots available
- aparthotel-het-atelier (16): Free wifi, Kitchen, Gym, Heating, Air conditioning, Coffee machine, Kettle, Flat-screen TV, Work desk, Elevator, Laundry, Self check-in, Luggage storage, Family rooms, Cots available, Non-smoking rooms
- hotel-spiegelbeeld (25): Free wifi, Indoor pool, Spa, Sauna, Hot tub, Massage treatments, Gym, Garden, Restaurant, Bar, Room service, Breakfast available, Heating, Air conditioning, Minibar, Bathtub, Bathrobes and slippers, 24-hour front desk, Concierge, Elevator, Accessible rooms, Cots available, Pets allowed, Bicycle rental, Parking on site (paid)
- hotel-pont-noord (16): Free wifi, Restaurant, Bar, Breakfast available, Terrace, Heating, Air conditioning, Elevator, 24-hour front desk, Luggage storage, Rain shower, Coffee machine, Bicycle rental, Accessible rooms, Non-smoking rooms, Electric vehicle charging
- hotel-sloep (12): Free wifi, 24-hour front desk, Bar, Breakfast available, Heating, Luggage storage, Flat-screen TV, Hairdryer, Non-smoking rooms, Express check-in and check-out, Elevator, Safe in room

### Showcase: Hotel Grachtenlicht
About
- Three old canal houses on a Jordaan canal, joined into one hotel of 22 rooms. The front rooms look onto the water and the houseboats; the back rooms face a small garden and are the quietest.
- The old stairs are steep, as in every canal house, but an elevator added at the back reaches every floor. Breakfast is served in the garden room until 10:30, bikes can be rented at the desk, and the Anne Frank House is a six-minute walk.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Garden Double | 1 queen bed | 16 m² | 2 | Garden | Heating, Rain shower, Coffee machine, Safe in room, Hairdryer | Non-refundable $268; Free cancellation $295; Free cancellation, breakfast included $331 |
| Canal View Double | 1 king bed | 20 m² | 2 | The canal | Heating, Rain shower, Coffee machine, Minibar, Safe in room, Hairdryer | Non-refundable $318; Free cancellation $350; Free cancellation, breakfast included $386 |
| Canal Loft | 1 king bed and a sofa bed | 32 m² | 3 | The canal, under the gable | Heating, Bathtub, Rain shower, Coffee machine, Minibar, Work desk, Safe in room, Hairdryer | Non-refundable $412; Free cancellation $453; Free cancellation, breakfast included $489 |

Guest scores: Cleanliness 9.3; Comfort 8.8; Location 9.6; Staff 9.3; Value 8.5; Wifi 9.0

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Sophie | United Kingdom | Couple | Oct 2026 | 10 | The canal view room is worth it | We watched the boats go by from bed with our coffee. Everything in the Jordaan is a short walk. |
| Andrés | Colombia | Solo | Sep 2026 | 9 | A quiet garden room | I slept well every night at the back. Staff sorted out a bike for me in five minutes. |
| Thomas | Germany | Couple | Aug 2026 | 8 | Lovely, but small rooms | The Garden Double is snug, as you'd expect in an old canal house. Breakfast was excellent. |
| Aisha | Kenya | Friends | Sep 2026 | 9 | Great location and staff | We were close to everything and the desk had good dinner tips. The elevator was a relief with our cases. |
| Jack | Australia | Couple | Jul 2026 | 9 | Book the Canal Loft | The beams and the gable window made it feel special. The bathtub was a bonus. |
| Elif | Turkey | Business | Jun 2026 | 9 | Fast wifi, calm rooms | I worked from the Canal Loft's desk for two days with no problems. It was quiet at night, even facing the canal. |

Nearby
- Noordermarkt, 4 min walk
- Westerkerk, 5 min walk
- Anne Frank House, 6 min walk
- Dam Square, 14 min walk
- Amsterdam Centraal Station, 15 min walk
- Amsterdam Schiphol airport, 25 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Canal Loft has a sofa bed for a third guest.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 08:00.

### Showcase: Woonboot Zilverreiger
About
- Three converted cargo houseboats moored side by side on a quiet canal in the Western Islands, a pocket of old warehouses ten minutes' walk from the Jordaan. Each has a living room with big windows at water level, a full kitchen and a bathroom with a rain shower.
- The decks at the front have a table and get the evening sun. The host lives nearby, meets you on arrival, rents out bikes and can leave a breakfast basket in your kitchen. There are steep steps down into each boat, so they don't suit anyone who can't manage stairs.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Studio Boat | 1 queen bed | 28 m² | 2 | The canal at water level | Kitchen, Heating, Rain shower, Coffee machine, Kettle, Flat-screen TV | Non-refundable $244; Free cancellation $268; Free cancellation, breakfast included $304 |
| One-bedroom Boat | 1 king bed and a sofa bed | 42 m² | 4 | The canal, with a front deck | Kitchen, Heating, Washing machine, Rain shower, Coffee machine, Kettle, Flat-screen TV | Non-refundable $312; Free cancellation $343; Free cancellation, breakfast included $379 |
| Two-bedroom Boat | 1 king bed and 2 single beds | 58 m² | 4 | The canal, with a front deck | Kitchen, Heating, Washing machine, Bathtub, Rain shower, Coffee machine, Kettle, Flat-screen TV | Non-refundable $398; Free cancellation $438; Free cancellation, breakfast included $474 |

Guest scores: Cleanliness 9.4; Comfort 9.1; Location 9.0; Staff 9.6; Value 9.2; Wifi 9.3

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Emily | United States | Family | Aug 2026 | 10 | Our children still talk about it | Sleeping on the water was the best part of our trip. The kitchen had everything we needed. |
| Ravi | India | Couple | Sep 2026 | 9 | Evenings on the deck | We ate outside watching the ducks and the bikes go past. The steps inside are steep, so pack light. |
| Margot | France | Friends | Oct 2026 | 9 | A great host | He met us at the canal and showed us how everything worked. It was very quiet at night. |
| Sven | Sweden | Couple | Jul 2026 | 9 | Better than a hotel | We had more space than any room we could have afforded in the center. The breakfast basket was generous. |
| Leah | Israel | Solo | Jun 2026 | 9 | Calm and cozy | The heating kept the boat warm on a cold night. Wifi was fast enough for video calls. |
| Wei | China | Family | Oct 2026 | 9 | Ten minutes to the Jordaan | We walked everywhere close by and rented bikes for the rest. The beds were very comfortable. |

Nearby
- Western Islands canals, 1 min walk
- Westerpark, 9 min walk
- Noordermarkt, 10 min walk
- Anne Frank House, 15 min walk
- Amsterdam Centraal Station, 15 min walk
- Amsterdam Schiphol airport, 25 min drive

House rules
- Children: Children are welcome. There is open water around the boats and steep steps inside, so children under 12 need an adult with them at all times. Ask the host for a cot before you arrive.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid to the host.
- Quiet hours: 22:00 to 08:00. Sound carries on the water.

---

## New York
Center point: Times Square. One existing hotel (unchanged) plus seven new.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| the-halyard-hotel | The Halyard Hotel | Boutique hotel | 4 | Dumbo, Brooklyn | 6.1 km | 8.9 Excellent | 2,318 | $289 | Upscale | 16:00 | 11:00 | Yes |
| the-ninefold | The Ninefold | Hotel | 5 | Midtown | 0.6 km | 9.1 Exceptional | 3,046 | $512 | Luxury | 16:00 | 12:00 | Yes |
| the-bramble-house | The Bramble House | Boutique hotel | 4 | West Village | 3.6 km | 8.9 Excellent | 1,127 | $338 | Luxury | 15:00 | 11:00 | No |
| the-wendover-residences | The Wendover Residences | Aparthotel | 4 | Chelsea | 2.0 km | 8.5 Excellent | 846 | $296 | Upscale | 16:00 | 11:00 | No |
| hotel-courtline | Hotel Courtline | Hotel | 3 | Long Island City, Queens | 3.9 km | 7.9 Good | 2,764 | $176 | Mid-range | 15:00 | 11:00 | No |
| park-slope-brownstone-apartments | Park Slope Brownstone Apartments | Apartment | 3 | Park Slope, Brooklyn | 10.1 km | 8.6 Excellent | 302 | $214 | Upscale | 16:00 | 10:00 | No |
| the-juniper-stoop | The Juniper Stoop | Guesthouse | 3 | Harlem | 8.8 km | 9.0 Exceptional | 418 | $168 | Mid-range | 15:00 | 11:00 | No |
| the-pierline | The Pierline | Hotel | 4 | Financial District | 6.0 km | 8.3 Very good | 1,904 | $248 | Upscale | 16:00 | 11:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| the-halyard-hotel | A converted warehouse by the East River, with tall windows and a rooftop bar facing Manhattan. | Rooftop bar facing Manhattan; Brooklyn Bridge Park across the street; Four minutes to the subway |
| the-ninefold | A 1920s limestone tower two blocks from Times Square, with an indoor pool, a spa and terraces on its upper setbacks. | Indoor pool and spa; Terrace rooms over Midtown; Grand Central eight minutes' walk |
| the-bramble-house | A boutique hotel in two red-brick townhouses on a tree-lined West Village street, with a fireplace lounge and a garden out back. | Garden out back; Fireplace lounge; A quiet, tree-lined street |
| the-wendover-residences | Studios and one-bedroom suites with full kitchens in Chelsea, a block from the High Line, with a gym and a laundry room. | A full kitchen in every suite; A block from the High Line; Gym and laundry room |
| hotel-courtline | A practical hotel one subway stop from Manhattan in Long Island City, with skyline views from the upper floors. | One stop from Manhattan; Skyline views from the upper floors; Breakfast from 06:00 |
| park-slope-brownstone-apartments | Floors of a restored brownstone on a leafy street, each a full apartment with a kitchen, two blocks from Prospect Park. | A full apartment on each floor; Two blocks from Prospect Park; Washing machine in every apartment |
| the-juniper-stoop | Five rooms in a Harlem brownstone kept by its owner, with breakfast in the parlor and a garden behind. | Five rooms, owner on site; Breakfast in the parlor; Near the express subway to Midtown |
| the-pierline | A modern hotel near the South Street Seaport, with harbor views, a rooftop bar and the Staten Island Ferry ten minutes' walk away. | Rooftop bar over the harbor; Near the South Street Seaport; Gym open around the clock |

Amenities
- the-halyard-hotel (22): Free wifi, Gym, Rooftop bar, Air conditioning, Elevator, 24-hour front desk, Restaurant, Breakfast available, Heating, Room service, Luggage storage, Concierge, Daily housekeeping, Coffee machine, Minibar, Safe in room, Work desk, Accessible rooms, Step-free entrance, Bicycle rental, Pets allowed, Non-smoking rooms
- the-ninefold (25): Free wifi, Indoor pool, Spa, Gym, Sauna, Massage treatments, Restaurant, Bar, Room service, Breakfast available, Terrace, Air conditioning, Heating, Minibar, Bathrobes and slippers, Work desk, Soundproofed rooms, 24-hour front desk, Concierge, Elevator, Accessible rooms, Step-free entrance, Cots available, Family rooms, Pets allowed
- the-bramble-house (16): Free wifi, Garden, Bar, Breakfast available, Air conditioning, Heating, 24-hour front desk, Concierge, Luggage storage, Daily housekeeping, Coffee machine, Minibar, Rain shower, Bathrobes and slippers, Non-smoking rooms, Cots available
- the-wendover-residences (17): Free wifi, Kitchen, Gym, Laundry, Air conditioning, Heating, Coffee machine, Flat-screen TV, Work desk, Elevator, 24-hour front desk, Luggage storage, Family rooms, Cots available, Accessible rooms, Non-smoking rooms, Iron and ironing board
- hotel-courtline (13): Free wifi, Breakfast available, Bar, 24-hour front desk, Air conditioning, Heating, Elevator, Luggage storage, Flat-screen TV, Gym, Accessible rooms, Non-smoking rooms, Express check-in and check-out
- park-slope-brownstone-apartments (13): Free wifi, Kitchen, Washing machine, Air conditioning, Heating, Coffee machine, Kettle, Flat-screen TV, Iron and ironing board, Self check-in, Family rooms, Cots available, Non-smoking rooms
- the-juniper-stoop (12): Free wifi, Breakfast available, Garden, Air conditioning, Heating, Hairdryer, Kettle, Luggage storage, Non-smoking rooms, Daily housekeeping, Blackout curtains, Cots available
- the-pierline (16): Free wifi, Rooftop bar, Gym, Restaurant, Breakfast available, Air conditioning, Heating, Elevator, 24-hour front desk, Luggage storage, Soundproofed rooms, Work desk, Accessible rooms, Step-free entrance, Non-smoking rooms, Family rooms

### Showcase: The Halyard Hotel
About
- A converted warehouse by the East River, with tall windows and a rooftop bar facing Manhattan. The 74 rooms keep the old brick walls, timber beams and steel-framed windows, and the corner rooms look along both bridges.
- The rooftop bar opens at 16:00 and fills up at sunset, so come early for a seat by the rail. Brooklyn Bridge Park is across the street, York Street subway station is four minutes away, and the walk over the Brooklyn Bridge into Manhattan takes about 30 minutes.
- (The first sentence is the existing description, unchanged.)

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Loft King | 1 king bed | 28 m² | 2 | City | Air conditioning, Heating, Rain shower, Coffee machine, Minibar, Safe in room, Flat-screen TV, Work desk | Non-refundable $289; Free cancellation $318; Free cancellation, breakfast included $362 |
| Loft Double | 2 double beds | 34 m² | 4 | The street | Air conditioning, Heating, Rain shower, Coffee machine, Minibar, Safe in room, Flat-screen TV | Non-refundable $334; Free cancellation $367; Free cancellation, breakfast included $411 |
| Corner Loft Suite | 1 king bed and a sofa bed | 52 m² | 3 | The Manhattan skyline and both bridges | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk | Non-refundable $462; Free cancellation $508; Free cancellation, breakfast included $552 |
- The Loft King and Loft Double keep their existing non-refundable rates as the cheapest plans.

Guest scores: Cleanliness 9.0; Comfort 8.9; Location 8.7; Staff 8.9; Value 8.3; Wifi 9.3

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Chris | United Kingdom | Couple | Oct 2026 | 9 | That view at sunset | The rooftop bar is the best seat in Brooklyn. Get there before 18:00 or you'll be standing. |
| Valentina | Italy | Friends | Sep 2026 | 9 | Worth staying in Brooklyn | We walked over the bridge one day and took the subway the rest. Dumbo was full of good places to eat. |
| Akira | Japan | Business | Oct 2026 | 9 | Big desk, fast wifi | The Loft King had a proper desk and the wifi never dropped. It was quiet at night despite the bar upstairs. |
| Maria | Spain | Family | Aug 2026 | 8 | Room for four, small bathroom | The Loft Double fit all of us well. One bathroom for four was tight in the mornings. |
| Jamal | United States | Couple | Jul 2026 | 9 | The Corner Loft Suite | Bridges out of two windows and a deep bathtub. Expensive, but we were celebrating. |
| Freya | Denmark | Solo | Jun 2026 | 8 | Lovely, but a ride from Midtown | It's about 25 minutes on the subway to Times Square. The staff were kind and the room was spotless. |

Nearby
- Brooklyn Bridge Park, 2 min walk
- York Street subway station, 4 min walk
- Jane's Carousel, 5 min walk
- Brooklyn Bridge walkway, 8 min walk
- Financial District, 12 min drive
- JFK airport, 40 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Loft Double sleeps four.
- Pets: Dogs up to 20 kg are welcome for $50 a stay, paid at the hotel.
- Payment: You pay the full price now, by card. At check-in the hotel holds $100 a night on your card for extras and releases it after you leave.
- Quiet hours: 22:00 to 07:00. The rooftop bar closes at midnight.

### Showcase: The Ninefold
About
- A limestone office tower from the 1920s, two blocks from Times Square, with nine stepped setbacks that give the hotel its name. Its 240 rooms start on the 7th floor; the setback rooms have their own terraces, and the rooms above the 20th floor look across the Midtown skyline.
- The indoor pool and spa are on the 6th floor, and the restaurant serves breakfast until 11:00 and dinner until late. The concierge can book theater seats for the same night. Bryant Park and Grand Central are a short walk away, and four subway lines stop within two blocks.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Classic King | 1 king bed | 30 m² | 2 | The city | Air conditioning, Heating, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV, Work desk | Non-refundable $512; Free cancellation $563; Free cancellation, breakfast included $617 |
| Two Queens | 2 queen beds | 36 m² | 4 | The city | Air conditioning, Heating, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $574; Free cancellation $631; Free cancellation, breakfast included $685 |
| Setback Terrace King | 1 king bed | 40 m² plus a 16 m² terrace | 2 | The Midtown skyline | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk | Non-refundable $798; Free cancellation $878; Free cancellation, breakfast included $932 |
| Tower Suite | 1 king bed and a sofa bed | 72 m² | 3 | Midtown and the Hudson River | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk, Flat-screen TV | Non-refundable $1,240; Free cancellation $1,364; Free cancellation, breakfast included $1,418 |
- Breakfast here costs $54 for the room.

Guest scores: Cleanliness 9.3; Comfort 9.3; Location 9.5; Staff 9.0; Value 8.2; Wifi 9.2

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Rebecca | Canada | Couple | Oct 2026 | 10 | The terrace room | We had drinks on our own terrace with the lights of Midtown all around. Worth it for one special night. |
| Omar | Egypt | Family | Aug 2026 | 9 | The pool saved our evenings | After long days in the city, the indoor pool was where our two wanted to be. The Two Queens room fit us comfortably. |
| Lena | Austria | Business | Sep 2026 | 9 | Everything close | Grand Central was a short walk and the desk had plenty of space. Breakfast was expensive. |
| Diego | Peru | Friends | Oct 2026 | 9 | The concierge found us a show | We asked at 16:00 and had good seats the same evening. The rooms were quiet despite the location. |
| Hana | South Korea | Solo | Jul 2026 | 9 | Calm above the crowds | You step out of the Times Square noise into a very quiet lobby. The pool and spa were never busy in the morning. |
| George | United Kingdom | Couple | Jun 2026 | 8 | Great hotel, slow elevators | The room and the service were excellent. The elevators were slow at checkout time. |

Nearby
- Times Square, 4 min walk
- Bryant Park, 5 min walk
- Grand Central Terminal, 8 min walk
- Rockefeller Center, 9 min walk
- Central Park, 16 min walk
- JFK airport, 50 min drive

House rules
- Children: Children of all ages are welcome. Cots are free, the Two Queens room sleeps four, and the Tower Suite has a sofa bed.
- Pets: Dogs up to 15 kg are welcome, free of charge.
- Payment: You pay the full price now, by card. At check-in the hotel holds $150 a night on your card for extras and releases it after you leave.
- Quiet hours: 22:00 to 07:00. The pool is open 06:00 to 22:00.

---

## Mexico City
Center point: the Zócalo. Eight new hotels.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| casa-azotea | Casa Azotea | Boutique hotel | 4 | Roma Norte | 4.1 km | 9.2 Exceptional | 1,064 | $168 | Mid-range | 15:00 | 12:00 | Yes |
| hotel-ahuehuete | Hotel Ahuehuete | Hotel | 5 | Polanco | 8.2 km | 9.0 Exceptional | 1,588 | $356 | Luxury | 15:00 | 12:00 | Yes |
| posada-tres-nopales | Posada Tres Nopales | Guesthouse | 3 | Coyoacán | 9.6 km | 9.1 Exceptional | 574 | $92 | Budget | 14:00 | 11:00 | No |
| condesa-balcones-apartments | Condesa Balcones Apartments | Apartment | 3 | Condesa | 4.9 km | 8.5 Excellent | 433 | $124 | Mid-range | 15:00 | 11:00 | No |
| suites-reforma-ceiba | Suites Reforma Ceiba | Aparthotel | 4 | Juárez | 3.0 km | 8.4 Very good | 912 | $142 | Mid-range | 15:00 | 12:00 | No |
| hotel-mosaico-centro | Hotel Mosaico Centro | Hotel | 3 | Centro Histórico | 0.4 km | 7.7 Good | 2,206 | $76 | Budget | 14:00 | 12:00 | No |
| hotel-papel-picado | Hotel Papel Picado | Boutique hotel | 3 | San Rafael | 3.4 km | 8.3 Very good | 688 | $108 | Budget | 15:00 | 12:00 | No |
| hotel-cedro-blanco | Hotel Cedro Blanco | Hotel | 4 | Santa Fe | 16.4 km | 8.1 Very good | 1,342 | $134 | Mid-range | 15:00 | 12:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| casa-azotea | A 1920s house on a tree-lined street in Roma Norte, with 14 rooms around a tiled patio and a bar on the roof. | Roof terrace bar; Breakfast cooked to order; Cafés and galleries all around |
| hotel-ahuehuete | A modern hotel in Polanco built around an old ahuehuete tree, with a spa, an indoor pool and a garden restaurant. | Spa with an indoor pool; Breakfast under the old tree; A walk to the anthropology museum |
| posada-tres-nopales | Six rooms around a garden in an old house in Coyoacán, two streets from the Frida Kahlo Museum, with breakfast by the owner. | A garden with fruit trees; Breakfast by the owner; Two streets from the Frida Kahlo Museum |
| condesa-balcones-apartments | Apartments with balconies over a tree-lined avenue in Condesa, each with a kitchen, five minutes from Parque España. | A balcony on every apartment; A kitchen in each; Five minutes from Parque España |
| suites-reforma-ceiba | Studios and suites with kitchens a block from Paseo de la Reforma, with a rooftop gym and a 24-hour front desk. | A kitchen in every suite; A block from Paseo de la Reforma; Rooftop gym |
| hotel-mosaico-centro | A simple hotel in an old building a block from the Zócalo, with a tiled lobby, small rooms and a terrace over the rooftops. | A block from the Zócalo; Roof terrace; Good value in the old town |
| hotel-papel-picado | A small, colorful hotel in a 1930s building in San Rafael, with a courtyard café and bright rooms. | Courtyard café; Colorful rooms; Ten minutes' walk to Paseo de la Reforma |
| hotel-cedro-blanco | A business hotel in Santa Fe, with an indoor pool, a gym and meeting rooms, close to the offices and far from the old town. | Indoor pool and gym; Meeting rooms; Free parking |

Amenities
- casa-azotea (18): Free wifi, Roof terrace, Breakfast available, Bar, Courtyard, Balcony, Concierge, Luggage storage, Daily housekeeping, 24-hour front desk, Coffee machine, Rain shower, Safe in room, Hairdryer, Flat-screen TV, Minibar, Non-smoking rooms, Tour desk
- hotel-ahuehuete (25): Free wifi, Indoor pool, Spa, Sauna, Hot tub, Massage treatments, Gym, Garden, Restaurant, Bar, Room service, Breakfast available, Air conditioning, Minibar, Bathrobes and slippers, Bathtub, Work desk, 24-hour front desk, Concierge, Elevator, Accessible rooms, Cots available, Family rooms, Pets allowed, Parking on site (paid)
- posada-tres-nopales (12): Free wifi, Garden, Breakfast available, Heating, Hairdryer, Kettle, Luggage storage, Non-smoking rooms, Daily housekeeping, Blackout curtains, Tour desk, Cots available
- condesa-balcones-apartments (13): Free wifi, Balcony, Kitchen, Washing machine, Coffee machine, Kettle, Flat-screen TV, Iron and ironing board, Self check-in, Elevator, Family rooms, Cots available, Non-smoking rooms
- suites-reforma-ceiba (15): Free wifi, Kitchen, Gym, Air conditioning, Coffee machine, Flat-screen TV, Work desk, Elevator, 24-hour front desk, Laundry, Luggage storage, Family rooms, Cots available, Non-smoking rooms, Parking on site (paid)
- hotel-mosaico-centro (12): Free wifi, Terrace, Breakfast available, 24-hour front desk, Luggage storage, Elevator, Hairdryer, Flat-screen TV, Non-smoking rooms, Tour desk, Safe in room, Express check-in and check-out
- hotel-papel-picado (12): Free wifi, Courtyard, Breakfast available, Luggage storage, Hairdryer, Flat-screen TV, Non-smoking rooms, Daily housekeeping, 24-hour front desk, Coffee machine, Safe in room, Cots available
- hotel-cedro-blanco (17): Free wifi, Indoor pool, Gym, Meeting rooms, Restaurant, Bar, Breakfast available, Air conditioning, Work desk, 24-hour front desk, Elevator, Free parking, Electric vehicle charging, Accessible rooms, Step-free entrance, Non-smoking rooms, Room service

### Showcase: Casa Azotea
About
- A 1920s house on a tree-lined street in Roma Norte, turned into 14 rooms around a tiled patio. The roof terrace has a small bar, pots of bougainvillea and, on clear mornings, a view to the volcanoes.
- Breakfast is cooked to order: chilaquiles, eggs, fruit and coffee from Veracruz. The cafés and galleries of Roma are all around, the Condesa parks are a ten-minute walk, and a taxi to the Zócalo takes about 20 minutes.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Patio Double | 1 queen bed | 20 m² | 2 | The patio | Rain shower, Coffee machine, Safe in room, Hairdryer, Flat-screen TV | Non-refundable $168; Free cancellation $185; Free cancellation, breakfast included $209 |
| Balcony King | 1 king bed | 24 m² | 2 | The street, with a balcony | Balcony, Rain shower, Coffee machine, Minibar, Safe in room, Hairdryer, Flat-screen TV | Non-refundable $204; Free cancellation $224; Free cancellation, breakfast included $248 |
| Rooftop Suite | 1 king bed and a sofa bed | 38 m² plus a private terrace | 3 | The treetops and the volcanoes | Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV | Non-refundable $296; Free cancellation $326; Free cancellation, breakfast included $350 |

Guest scores: Cleanliness 9.4; Comfort 9.1; Location 9.3; Staff 9.5; Value 9.0; Wifi 8.7

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Camila | Colombia | Couple | Oct 2026 | 10 | Breakfast was the best part | The chilaquiles alone were worth the stay. We ate on the patio every morning. |
| Ethan | United States | Solo | Sep 2026 | 9 | Roma on the doorstep | Coffee shops, taco stands and galleries within two blocks. Staff wrote me a list of places to eat and I worked through it all week. |
| Anna | Germany | Couple | Aug 2026 | 9 | The roof at sunset | The roof bar is small and friendly. It rained most late afternoons in summer, so plan around it. |
| Kofi | Ghana | Business | Oct 2026 | 8 | Lovely, but patchy wifi | A beautiful room and kind staff. Wifi was slow in the patio rooms. |
| Lucía | Argentina | Friends | Jul 2026 | 9 | Like staying in a home | With 14 rooms, the staff knew our names by the second day. Taxis were easy to get at the door. |
| Paul | France | Couple | Jun 2026 | 9 | Book the suite | The terrace on the Rooftop Suite was worth it. On one clear morning we could see the volcanoes. |

Nearby
- Plaza Río de Janeiro, 4 min walk
- Mercado Roma, 8 min walk
- Parque México, 12 min walk
- Bosque de Chapultepec, 15 min drive
- The Zócalo, 20 min drive
- Mexico City airport, 30 min drive

House rules
- Children: Children aged 6 and over are welcome. The Rooftop Suite has a sofa bed for a third guest.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 08:00. The roof bar closes at 22:30.

### Showcase: Hotel Ahuehuete
About
- A modern hotel on a quiet street in Polanco, built around an ahuehuete, the old cypress that is Mexico's national tree, in its central garden. The 120 rooms are in pale stone and dark wood, and most look over the garden or toward the trees of Chapultepec.
- The spa has an indoor pool, a sauna and a hot tub, and the restaurant serves modern Mexican food with a long mezcal list. The Museo Nacional de Antropología is a 15-minute walk, and the shops and restaurants of Avenida Presidente Masaryk are around the corner.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Garden King | 1 king bed | 34 m² | 2 | The garden | Air conditioning, Rain shower, Bathtub, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV, Work desk | Non-refundable $356; Free cancellation $392; Free cancellation, breakfast included $428 |
| Park View King | 1 king bed | 38 m² | 2 | Toward Chapultepec, with a balcony | Air conditioning, Balcony, Rain shower, Bathtub, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk | Non-refundable $412; Free cancellation $453; Free cancellation, breakfast included $489 |
| Family Room | 2 double beds | 42 m² | 4 | The garden | Air conditioning, Rain shower, Bathtub, Coffee machine, Minibar, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $448; Free cancellation $493; Free cancellation, breakfast included $541 |
| Ahuehuete Suite | 1 king bed and a sofa bed | 76 m² | 3 | The garden and the old tree | Air conditioning, Balcony, Rain shower, Bathtub, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk, Flat-screen TV | Non-refundable $728; Free cancellation $801; Free cancellation, breakfast included $837 |
- Breakfast here costs $36 for the room, $48 for the Family Room.

Guest scores: Cleanliness 9.3; Comfort 9.2; Location 8.8; Staff 9.1; Value 8.5; Wifi 9.1

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Sebastián | Spain | Couple | Oct 2026 | 10 | The tree is real and it's huge | Breakfast under its branches every morning was a treat. The spa pool was warm and never crowded. |
| Olga | Estonia | Business | Sep 2026 | 9 | Ideal for work | Fast wifi, a big desk and a quiet room. The airport was 30 minutes away early in the morning. |
| Tanvir | Bangladesh | Family | Aug 2026 | 9 | Room for the four of us | The Family Room was big and the cot was in the room before we came back from dinner. It's a lovely walk to the museum. |
| Julia | United States | Friends | Sep 2026 | 9 | Mezcal and tacos | The restaurant gave us one of the best meals of our trip. Polanco was easy and pleasant to walk around. |
| Matteo | Italy | Couple | Jul 2026 | 8 | Beautiful, but far from the old town | It's 30 minutes by car to the Zócalo in traffic. Polanco itself has plenty to do. |
| Aroha | New Zealand | Solo | Jun 2026 | 9 | A spa day after the flight | I arrived early and they let me use the spa before my room was ready. A great massage. |

Nearby
- Avenida Presidente Masaryk, 3 min walk
- Parque Lincoln, 6 min walk
- Bosque de Chapultepec, 10 min walk
- Museo Nacional de Antropología, 15 min walk
- Museo Soumaya, 10 min drive
- Mexico City airport, 35 min drive

House rules
- Children: Children of all ages are welcome. Cots are free, and the Family Room sleeps four.
- Pets: Dogs up to 10 kg are welcome, free of charge.
- Payment: You pay the full price now, by card. The hotel asks for a card at check-in for extras. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 07:00. The pool is open 07:00 to 22:00.

---

## Tokyo
Center point: Tokyo Station. One existing hotel (unchanged) plus seven new.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| hotel-kumo-asakusa | Hotel Kumo Asakusa | Hotel | 4 | Asakusa | 4.3 km | 8.8 Excellent | 1,862 | $203 | Upscale | 15:00 | 10:00 | Yes |
| yanaka-hinoki-guesthouse | Yanaka Hinoki Guesthouse | Guesthouse | 3 | Yanaka | 4.6 km | 9.3 Exceptional | 486 | $142 | Mid-range | 15:00 | 10:00 | Yes |
| hotel-kasumi-otemachi | Hotel Kasumi Otemachi | Hotel | 5 | Otemachi | 0.6 km | 9.4 Exceptional | 1,214 | $468 | Luxury | 15:00 | 12:00 | No |
| hotel-ame-shibuya | Hotel Ame Shibuya | Boutique hotel | 4 | Shibuya | 6.6 km | 8.7 Excellent | 2,086 | $228 | Upscale | 15:00 | 11:00 | No |
| kurumi-residences-shinjuku | Kurumi Residences Shinjuku | Aparthotel | 3 | Shinjuku | 6.4 km | 8.3 Very good | 1,447 | $164 | Mid-range | 15:00 | 10:00 | No |
| kawabe-apartments-nakameguro | Kawabe Apartments Nakameguro | Apartment | 3 | Nakameguro | 8.2 km | 8.5 Excellent | 329 | $176 | Mid-range | 16:00 | 10:00 | No |
| hotel-komorebi-ueno | Hotel Komorebi Ueno | Hotel | 3 | Ueno | 3.6 km | 7.7 Good | 3,118 | $112 | Budget | 15:00 | 10:00 | No |
| shiokaze-resort-odaiba | Shiokaze Resort Odaiba | Resort | 4 | Odaiba | 6.9 km | 8.4 Very good | 1,736 | $259 | Upscale | 15:00 | 11:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| hotel-kumo-asakusa | A compact, quiet hotel by the Sumida River, with a public bath on the top floor. | Top-floor bath facing the Skytree; Five minutes' walk to Senso-ji; Direct trains to both airports |
| yanaka-hinoki-guesthouse | Eight tatami rooms in an old wooden house in Yanaka, with a cypress bath, a small garden and a Japanese breakfast. | Cypress bath; Japanese breakfast in the garden room; Eight minutes to Nippori station |
| hotel-kasumi-otemachi | A hotel on the top floors of an Otemachi tower beside the Imperial Palace gardens, with an indoor pool, a spa and views to Mount Fuji on clear days. | Indoor pool high above the city; Spa with a public bath; Two minutes from Otemachi station |
| hotel-ame-shibuya | A boutique hotel on a side street above Shibuya, with a record bar in the lobby, a rooftop terrace and rooms in dark wood. | Record bar in the lobby; Rooftop terrace; Five minutes' walk to Shibuya Crossing |
| kurumi-residences-shinjuku | Studios with kitchenettes and washing machines on a quiet street west of Shinjuku station, made for longer stays. | A washing machine in every studio; A kitchenette; Ten minutes' walk to Shinjuku station |
| kawabe-apartments-nakameguro | Apartments on the Meguro River under the cherry trees, each with a kitchen and a small balcony over the water. | Balconies over the river; Cherry trees along the water; Cafés and shops on the street |
| hotel-komorebi-ueno | A simple, busy hotel opposite Ueno station, with small rooms, a large public bath and direct trains to Narita airport. | Opposite Ueno station; Large public bath; Ueno Park two minutes away |
| shiokaze-resort-odaiba | A bay resort on the Odaiba waterfront, with indoor and outdoor pools, a hot spring bath and views back across the water to the city. | Pools and a hot spring bath; Bay views to the Rainbow Bridge; Kids' club |

Amenities
- hotel-kumo-asakusa (19): Free wifi, Public bath, Laundry, Air conditioning, Elevator, 24-hour front desk, Breakfast available, Heating, Luggage storage, Non-smoking rooms, Hairdryer, Kettle, Flat-screen TV, Safe in room, Daily housekeeping, Bicycle rental, Blackout curtains, Family rooms, Cots available
- yanaka-hinoki-guesthouse (13): Free wifi, Breakfast available, Garden, Public bath, Air conditioning, Heating, Kettle, Hairdryer, Luggage storage, Non-smoking rooms, Bicycle rental, Tour desk, Family rooms
- hotel-kasumi-otemachi (25): Free wifi, Indoor pool, Spa, Public bath, Sauna, Massage treatments, Gym, Restaurant, Bar, Room service, Breakfast available, Air conditioning, Heating, Minibar, Bathtub, Bathrobes and slippers, Work desk, Soundproofed rooms, 24-hour front desk, Concierge, Elevator, Accessible rooms, Step-free entrance, Cots available, Family rooms
- hotel-ame-shibuya (17): Free wifi, Bar, Roof terrace, Restaurant, Breakfast available, Air conditioning, Heating, Elevator, 24-hour front desk, Luggage storage, Coffee machine, Rain shower, Soundproofed rooms, Blackout curtains, Hairdryer, Non-smoking rooms, Safe in room
- kurumi-residences-shinjuku (14): Free wifi, Kitchen, Washing machine, Air conditioning, Heating, Kettle, Flat-screen TV, Work desk, Elevator, 24-hour front desk, Luggage storage, Self check-in, Non-smoking rooms, Iron and ironing board
- kawabe-apartments-nakameguro (13): Free wifi, Balcony, Kitchen, Washing machine, Air conditioning, Heating, Coffee machine, Kettle, Flat-screen TV, Self check-in, Family rooms, Cots available, Non-smoking rooms
- hotel-komorebi-ueno (13): Free wifi, Public bath, Breakfast available, 24-hour front desk, Air conditioning, Heating, Elevator, Laundry, Luggage storage, Kettle, Flat-screen TV, Non-smoking rooms, Express check-in and check-out
- shiokaze-resort-odaiba (24): Free wifi, Outdoor pool, Indoor pool, Public bath, Spa, Sauna, Massage treatments, Gym, Kids' club, Restaurant, Bar, Breakfast available, Room service, Beach access, Air conditioning, Heating, Minibar, 24-hour front desk, Elevator, Family rooms, Cots available, Accessible rooms, Parking on site (paid), Electric vehicle charging

### Showcase: Hotel Kumo Asakusa
About
- A compact, quiet hotel by the Sumida River, with a public bath on the top floor. Its 62 rooms are small, as rooms in Tokyo often are, but carefully planned, with blackout blinds and firm beds. The bath looks across the river to the Tokyo Skytree.
- Breakfast is a Japanese set or a Western plate, served from 07:00. Senso-ji Temple is a five-minute walk, the river boats leave from the pier at the end of the street, and Asakusa station has direct trains to Haneda and Narita airports.
- (The first sentence is the existing description, unchanged.)

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Compact Double | 1 double bed | 14 m² | 2 | The street | Air conditioning, Heating, Kettle, Hairdryer, Safe in room, Flat-screen TV | Free cancellation $203; Free cancellation, breakfast included $241 |
| River Twin | 2 single beds | 18 m² | 2 | The Sumida River | Air conditioning, Heating, Kettle, Hairdryer, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $219; Free cancellation $241; Free cancellation, breakfast included $279 |
| Tatami Family Room | Futons for 4 on tatami | 28 m² | 4 | The river and the Skytree | Air conditioning, Heating, Kettle, Hairdryer, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $276; Free cancellation $304; Free cancellation, breakfast included $358 |
- The Compact Double and River Twin keep their existing free cancellation rates. Breakfast is $38 for two, $54 for the Tatami Family Room.

Guest scores: Cleanliness 9.4; Comfort 8.5; Location 8.9; Staff 9.0; Value 8.6; Wifi 8.6

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Isla | United Kingdom | Couple | Oct 2026 | 9 | The bath at night | Soaking on the top floor with the Skytree lit up was the best end to each day. The Compact Double really is compact. |
| Mohammed | Saudi Arabia | Family | Aug 2026 | 9 | The tatami room was a hit | The children loved sleeping on futons. Staff showed us how everything worked when we arrived. |
| Chen | Taiwan | Solo | Sep 2026 | 9 | Spotless and quiet | Very clean and silent at night. Senso-ji early in the morning, before the crowds, was a highlight. |
| Peter | Australia | Couple | Oct 2026 | 8 | Ask for the river side | The view from the River Twin was worth the extra. The beds are firm, which we liked. |
| Natalia | Argentina | Friends | Jul 2026 | 8 | Great base, small rooms | Two of us with big suitcases was a squeeze. Everything else was excellent. |
| Joon | South Korea | Business | Jun 2026 | 9 | Easy from the airport | The direct train from Haneda made arriving simple. Wifi was reliable for work. |

Nearby
- Sumida River pier, 2 min walk
- Sumida Park, 4 min walk
- Senso-ji Temple, 5 min walk
- Kaminarimon Gate, 6 min walk
- Tokyo Skytree, 20 min walk
- Haneda airport, 35 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Tatami Family Room sleeps four.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 07:00. The bath is open 15:00 to 01:00 and 06:00 to 09:00. Guests with tattoos can book the bath privately at the front desk.

### Showcase: Yanaka Hinoki Guesthouse
About
- An old wooden house in Yanaka, a neighborhood of temples, small shops and narrow lanes, with eight tatami rooms around a small garden. Each room has futons, a low table and sliding paper screens.
- The shared bath is a deep cypress tub, the hinoki that gives the house its name. Breakfast is rice, miso soup, grilled fish and pickles, served in the garden room. Nippori station, with fast trains to Narita airport, is an eight-minute walk.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Garden Tatami Room | Futons for 2 on tatami | 13 m² | 2 | The garden | Air conditioning, Heating, Kettle, Hairdryer | Non-refundable $142; Free cancellation $156; Free cancellation, breakfast included $184 |
| Lane Tatami Room | Futons for 3 on tatami | 16 m² | 3 | The lane | Air conditioning, Heating, Kettle, Hairdryer | Non-refundable $168; Free cancellation $185; Free cancellation, breakfast included $213 |
| Family Tatami Room | Futons for 4 on tatami, with a private bathroom | 22 m² | 4 | The garden | Air conditioning, Heating, Kettle, Hairdryer, Rain shower | Non-refundable $214; Free cancellation $235; Free cancellation, breakfast included $263 |
- The Garden and Lane rooms share two bathrooms and the cypress bath. Breakfast here costs $28 for the room.

Guest scores: Cleanliness 9.5; Comfort 8.8; Location 9.0; Staff 9.8; Value 9.4; Wifi 9.1

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Clara | Germany | Couple | Oct 2026 | 10 | The Tokyo we hoped for | Quiet lanes, old temples and a host who walked us to her favorite noodle shop. The cypress bath was wonderful. |
| Sam | United States | Solo | Sep 2026 | 9 | Breakfast every morning | The Japanese breakfast was the best meal of my day. The shared bathrooms were always clean. |
| Rania | Jordan | Family | Aug 2026 | 9 | The children loved the futons | The Family Tatami Room has its own bathroom, which helped. The garden was a calm place to sit in the evening. |
| Louis | France | Friends | Jul 2026 | 9 | Slow down here | Yanaka felt a world away from Shinjuku. Nippori station made getting around easy. |
| Ama | Ghana | Couple | Sep 2026 | 9 | Thin walls, warm welcome | You hear the house at night, as in any wooden house. The host's care more than made up for it. |
| Tim | Netherlands | Solo | Jun 2026 | 8 | Not for everyone | Sleeping on the floor took me two nights to get used to. The location and the breakfast were excellent. |

Nearby
- Yanaka Ginza shopping street, 4 min walk
- Yanaka Cemetery, 5 min walk
- Nippori station, 8 min walk
- Ueno Park, 15 min walk
- Tokyo National Museum, 18 min walk
- Narita airport, 60 min drive

House rules
- Children: Children of all ages are welcome. The Family Tatami Room has its own bathroom.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the guesthouse.
- Quiet hours: 22:00 to 07:00. The front door locks at 23:00 and every guest gets a key. Shoes come off at the door; slippers are provided.

---

## Singapore
Center point: City Hall. Eight new hotels. Singapore restricts short-term rentals of private homes, so there are serviced residences here but no apartments.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| the-pintu-shophouse-hotel | The Pintu Shophouse Hotel | Boutique hotel | 4 | Kampong Glam | 1.4 km | 9.0 Exceptional | 968 | $238 | Upscale | 15:00 | 11:00 | Yes |
| hotel-laut-biru | Hotel Laut Biru | Hotel | 5 | Marina Bay | 1.2 km | 9.3 Exceptional | 2,614 | $486 | Luxury | 15:00 | 12:00 | Yes |
| pasir-putih-resort | Pasir Putih Resort | Resort | 5 | Sentosa | 8.6 km | 8.9 Excellent | 1,872 | $412 | Luxury | 15:00 | 11:00 | No |
| kayu-residences | Kayu Residences | Aparthotel | 4 | Tiong Bahru | 3.1 km | 8.7 Excellent | 744 | $226 | Upscale | 15:00 | 11:00 | No |
| rumah-melati | Rumah Melati | Guesthouse | 2 | Little India | 2.1 km | 8.0 Very good | 1,206 | $98 | Budget | 14:00 | 11:00 | No |
| hotel-bukit-kecil | Hotel Bukit Kecil | Hotel | 3 | Chinatown | 1.6 km | 8.2 Very good | 2,341 | $148 | Mid-range | 15:00 | 11:00 | No |
| hotel-batik-lane | Hotel Batik Lane | Boutique hotel | 3 | Jalan Besar | 2.4 km | 7.8 Good | 1,085 | $132 | Mid-range | 15:00 | 11:00 | No |
| hotel-daun-orchard | Hotel Daun Orchard | Hotel | 4 | Orchard | 2.6 km | 8.5 Excellent | 2,977 | $268 | Upscale | 15:00 | 12:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| the-pintu-shophouse-hotel | Four restored shophouses behind the Sultan Mosque, joined into a 28-room hotel with a small pool on the roof. | Rooftop pool; Local breakfast in the front shop; Five minutes' walk to Bugis station |
| hotel-laut-biru | A glass tower on Marina Bay with an infinity pool on the 40th floor, three restaurants and Gardens by the Bay a short walk away. | Infinity pool on the 40th floor; Ten minutes' walk to Gardens by the Bay; Gym open around the clock |
| pasir-putih-resort | A beach resort on Sentosa island, with three pools, a kids' club and a path straight onto Siloso Beach. | A path straight onto Siloso Beach; Three pools and a kids' club; Spa in the gardens |
| kayu-residences | Serviced studios and suites with kitchens in an Art Deco block in Tiong Bahru, near the market and its hawker center. | A kitchen in every suite; Near the Tiong Bahru market; Pool and gym on site |
| rumah-melati | A simple guesthouse above a flower shop in Little India, with small rooms, a shared kitchen and the metro at the corner. | The metro at the corner; Shared kitchen; Good value near the center |
| hotel-bukit-kecil | A mid-sized hotel on a quiet slope above Chinatown, with a small pool, a breakfast café and the hawker centers a short walk away. | Small outdoor pool; A short walk to Chinatown's hawker centers; Breakfast café |
| hotel-batik-lane | A small hotel in a converted shophouse in Jalan Besar, with bright rooms, batik prints and a café on the ground floor. | Café on the ground floor; Rooms in an old shophouse; Lavender station nearby |
| hotel-daun-orchard | A large hotel just off Orchard Road, with a garden pool deck, four restaurants and the shopping malls on the doorstep. | Garden pool deck; Just off Orchard Road; Four restaurants |

Amenities
- the-pintu-shophouse-hotel (19): Free wifi, Outdoor pool, Breakfast available, Roof terrace, Air conditioning, Elevator, 24-hour front desk, Concierge, Luggage storage, Daily housekeeping, Coffee machine, Minibar, Rain shower, Safe in room, Hairdryer, Flat-screen TV, Non-smoking rooms, Cots available, Tour desk
- hotel-laut-biru (25): Free wifi, Outdoor pool, Spa, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Rooftop bar, Room service, Breakfast available, Air conditioning, Minibar, Bathtub, Bathrobes and slippers, Work desk, 24-hour front desk, Concierge, Elevator, Accessible rooms, Step-free entrance, Cots available, Family rooms, Parking on site (paid)
- pasir-putih-resort (24): Free wifi, Beach access, Outdoor pool, Kids' club, Spa, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Room service, Breakfast available, Garden, Balcony, Air conditioning, Minibar, 24-hour front desk, Family rooms, Cots available, Accessible rooms, Bicycle rental, Parking on site (paid), Electric vehicle charging
- kayu-residences (17): Free wifi, Kitchen, Outdoor pool, Gym, Washing machine, Air conditioning, Coffee machine, Flat-screen TV, Work desk, Elevator, 24-hour front desk, Luggage storage, Laundry, Family rooms, Cots available, Non-smoking rooms, Iron and ironing board
- rumah-melati (12): Free wifi, Shared kitchen, Air conditioning, Luggage storage, Self check-in, Hairdryer, Non-smoking rooms, Daily housekeeping, Laundry, Kettle, Tour desk, Flat-screen TV
- hotel-bukit-kecil (15): Free wifi, Outdoor pool, Breakfast available, Air conditioning, 24-hour front desk, Elevator, Luggage storage, Gym, Flat-screen TV, Hairdryer, Safe in room, Non-smoking rooms, Family rooms, Laundry, Express check-in and check-out
- hotel-batik-lane (12): Free wifi, Breakfast available, Air conditioning, 24-hour front desk, Luggage storage, Hairdryer, Flat-screen TV, Non-smoking rooms, Safe in room, Kettle, Daily housekeeping, Tour desk
- hotel-daun-orchard (20): Free wifi, Outdoor pool, Restaurant, Bar, Gym, Spa, Breakfast available, Room service, Garden, Air conditioning, Minibar, 24-hour front desk, Concierge, Elevator, Accessible rooms, Family rooms, Cots available, Non-smoking rooms, Parking on site (paid), Express check-in and check-out

### Showcase: The Pintu Shophouse Hotel
About
- A row of four restored shophouses on a lane behind the Sultan Mosque, joined into a hotel of 28 rooms. The painted facades, carved timber doors and inner air wells are original; the rooms behind them are calm, in teak and white.
- Breakfast is kaya toast, soft-boiled eggs and local coffee, or a Western plate, served in the front shop until 10:30. The small pool on the roof is open until 22:00. Bugis station is a five-minute walk, and the lanes around are full of cafés and textile shops.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Shophouse Double | 1 queen bed | 18 m² | 2 | The air well | Air conditioning, Rain shower, Coffee machine, Safe in room, Hairdryer, Flat-screen TV | Non-refundable $238; Free cancellation $262; Free cancellation, breakfast included $304 |
| Front Room King | 1 king bed | 24 m² | 2 | The lane, through shuttered windows | Air conditioning, Rain shower, Coffee machine, Minibar, Safe in room, Hairdryer, Flat-screen TV | Non-refundable $286; Free cancellation $315; Free cancellation, breakfast included $357 |
| Loft Suite | 1 king bed upstairs and a sofa bed below | 36 m² | 3 | The rooftops and the mosque dome | Air conditioning, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Work desk, Safe in room | Non-refundable $398; Free cancellation $438; Free cancellation, breakfast included $480 |

Guest scores: Cleanliness 9.3; Comfort 8.9; Location 9.2; Staff 9.1; Value 8.5; Wifi 9.0

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Divya | India | Couple | Oct 2026 | 9 | Kaya toast every morning | The local breakfast was so good we never tried the other one. Our room was small but beautifully done. |
| Liam | Ireland | Solo | Sep 2026 | 9 | A quiet room in a lively area | The lanes outside are busy until late, but my air-well room was silent. The rooftop pool is tiny and lovely. |
| Mariko | Japan | Friends | Aug 2026 | 9 | Great food on the doorstep | We ate somewhere different on Arab Street every night. Staff gave us a good list of hawker centers. |
| Ahmed | Malaysia | Business | Oct 2026 | 8 | Charming, but little room to work | Wifi was quick and the staff were helpful. There isn't much space for a laptop in the Shophouse Double. |
| Zoe | Australia | Couple | Jul 2026 | 9 | Book the Loft Suite | Looking out at the mosque dome from bed was special. The stairs up to the loft are steep. |
| Felix | Germany | Family | Jun 2026 | 9 | Easy with a child | The sofa bed in the Loft Suite worked well for our son. The metro is close and very easy to use. |

Nearby
- Sultan Mosque, 2 min walk
- Haji Lane, 3 min walk
- Bugis station, 5 min walk
- National Gallery Singapore, 18 min walk
- Gardens by the Bay, 12 min drive
- Changi airport, 20 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Loft Suite has a sofa bed for a third guest.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 07:00. The rooftop pool is open 07:00 to 22:00.

### Showcase: Hotel Laut Biru
About
- A glass tower on the edge of Marina Bay with 310 rooms, most with floor-to-ceiling windows over the water or the gardens. The infinity pool on the 40th floor looks straight across the bay to the city skyline.
- There are three restaurants, a rooftop bar, a spa with a sauna and a hot tub, and a gym open around the clock. Gardens by the Bay is a ten-minute walk, the waterfront promenade starts at the door, and Bayfront station is two minutes away.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Bay Garden King | 1 king bed or 2 single beds | 34 m² | 2 | Gardens by the Bay | Air conditioning, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV, Work desk | Non-refundable $486; Free cancellation $535; Free cancellation, breakfast included $589 |
| Marina View King | 1 king bed | 36 m² | 2 | Marina Bay and the skyline | Air conditioning, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV, Work desk | Non-refundable $548; Free cancellation $603; Free cancellation, breakfast included $657 |
| Family Room | 1 king bed and 2 single beds | 46 m² | 4 | The gardens | Air conditioning, Bathtub, Rain shower, Coffee machine, Minibar, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $612; Free cancellation $673; Free cancellation, breakfast included $745 |
| Bay Suite | 1 king bed and a sofa bed | 78 m² | 3 | Marina Bay, from a corner | Air conditioning, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV, Work desk | Non-refundable $1,086; Free cancellation $1,195; Free cancellation, breakfast included $1,249 |
- Breakfast here costs $54 for the room, $72 for the Family Room.

Guest scores: Cleanliness 9.5; Comfort 9.4; Location 9.3; Staff 9.2; Value 8.6; Wifi 9.6

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Anika | Netherlands | Couple | Oct 2026 | 10 | The pool | Swimming 40 floors up with the skyline in front of us was unforgettable. Go at 07:00, before it fills up. |
| Raj | India | Family | Aug 2026 | 9 | Gardens on the doorstep | We walked to Gardens by the Bay every evening for the light show. The Family Room had plenty of space. |
| Imogen | United Kingdom | Business | Sep 2026 | 9 | Fast wifi, great gym | The gym is open around the clock, which helped with jet lag. Breakfast is pricey. |
| Paolo | Philippines | Friends | Oct 2026 | 9 | Worth one big night | We booked one night to see the pool and stayed for two. The staff were polished and friendly. |
| Lin | China | Couple | Jul 2026 | 9 | Ask for the marina side | The skyline view was worth the difference. The bathtub by the window was a treat. |
| Thabo | South Africa | Solo | Jun 2026 | 8 | Busy at peak times | The lobby and the pool get crowded at weekends. The room itself was quiet and perfect. |

Nearby
- The Marina Bay promenade, 1 min walk
- Bayfront station, 2 min walk
- Gardens by the Bay, 10 min walk
- Merlion Park, 15 min walk
- Chinatown, 10 min drive
- Changi airport, 20 min drive

House rules
- Children: Children of all ages are welcome. Cots are free, and the Family Room sleeps four.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. The hotel asks for a card at check-in for extras. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 07:00. The infinity pool is open 06:00 to 23:00.

---

## Sydney
Center point: Sydney Town Hall. Eight new hotels.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| the-sandstone-rooms | The Sandstone Rooms | Boutique hotel | 4 | The Rocks | 1.6 km | 9.1 Exceptional | 1,148 | $284 | Upscale | 15:00 | 10:00 | Yes |
| bondi-saltbush-apartments | Bondi Saltbush Apartments | Apartment | 4 | Bondi Beach | 7.0 km | 8.8 Excellent | 392 | $262 | Upscale | 15:00 | 10:00 | Yes |
| manly-seacliff-resort | Manly Seacliff Resort | Resort | 4 | Manly | 11.6 km | 8.6 Excellent | 1,264 | $318 | Luxury | 15:00 | 11:00 | No |
| the-wattle-terrace | The Wattle Terrace | Hotel | 3 | Surry Hills | 1.6 km | 8.3 Very good | 1,402 | $172 | Mid-range | 15:00 | 10:00 | No |
| the-lorikeet-guesthouse | The Lorikeet Guesthouse | Guesthouse | 3 | Newtown | 4.0 km | 8.5 Excellent | 517 | $128 | Mid-range | 14:00 | 10:00 | No |
| pyrmont-jetty-suites | Pyrmont Jetty Suites | Aparthotel | 4 | Pyrmont | 1.5 km | 8.4 Very good | 963 | $236 | Upscale | 15:00 | 10:00 | No |
| hotel-haymarket-bluegum | Hotel Haymarket Bluegum | Hotel | 3 | Haymarket | 0.9 km | 7.5 Good | 2,838 | $139 | Mid-range | 14:00 | 10:00 | No |
| the-quayline | The Quayline | Hotel | 5 | Circular Quay | 1.5 km | 9.2 Exceptional | 2,106 | $498 | Luxury | 15:00 | 11:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| the-sandstone-rooms | Three old sandstone warehouses on a cobbled lane in The Rocks, with 36 rooms, a cellar bar and views to the Harbour Bridge. | Views to the Harbour Bridge; Cellar bar; A short walk to the Opera House |
| bondi-saltbush-apartments | Apartments with kitchens and balconies on a quiet street behind Bondi Beach, two minutes from the sand. | Two minutes to the beach; A kitchen and a balcony in each; The coastal walk nearby |
| manly-seacliff-resort | A resort on the headland above Manly beach, with a cliff-top pool, a spa and the ferry to Circular Quay ten minutes' walk away. | Cliff-top pool; Spa; Ten minutes' walk to the Manly ferry |
| the-wattle-terrace | A hotel in a row of Victorian terraces in Surry Hills, close to the cafés of Crown Street and a short walk from Central station. | Rooms in Victorian terraces; Cafés on the doorstep; Ten minutes' walk to Central station |
| the-lorikeet-guesthouse | Seven rooms in an old house in Newtown, with a shared kitchen, a garden full of birds and King Street around the corner. | A garden full of lorikeets; Shared kitchen; King Street around the corner |
| pyrmont-jetty-suites | Studios and suites with kitchens on the Pyrmont waterfront, a short walk across the bridge to Darling Harbour. | On the waterfront; A kitchen in every suite; A walk across to Darling Harbour |
| hotel-haymarket-bluegum | A busy, practical hotel by Chinatown and Central station, with small rooms and a 24-hour front desk. | Chinatown on the doorstep; Near Central station; 24-hour front desk |
| the-quayline | A five-star hotel on Circular Quay, with rooms facing the Opera House or the Harbour Bridge, a rooftop pool and a spa. | Views to the Opera House and the bridge; Rooftop pool; The ferries at the door |

Amenities
- the-sandstone-rooms (18): Free wifi, Bar, Breakfast available, Air conditioning, Heating, Elevator, 24-hour front desk, Concierge, Luggage storage, Daily housekeeping, Coffee machine, Minibar, Rain shower, Safe in room, Hairdryer, Flat-screen TV, Non-smoking rooms, Cots available
- bondi-saltbush-apartments (15): Free wifi, Kitchen, Balcony, Washing machine, Breakfast available, Air conditioning, Coffee machine, Kettle, Flat-screen TV, Iron and ironing board, Self check-in, Beach access, Family rooms, Cots available, Non-smoking rooms
- manly-seacliff-resort (22): Free wifi, Outdoor pool, Spa, Beach access, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Breakfast available, Room service, Balcony, Air conditioning, Minibar, 24-hour front desk, Elevator, Family rooms, Cots available, Kids' club, Accessible rooms, Parking on site (paid)
- the-wattle-terrace (13): Free wifi, Breakfast available, Courtyard, Air conditioning, Heating, 24-hour front desk, Luggage storage, Hairdryer, Flat-screen TV, Non-smoking rooms, Daily housekeeping, Kettle, Cots available
- the-lorikeet-guesthouse (12): Free wifi, Garden, Shared kitchen, Breakfast available, Air conditioning, Heating, Hairdryer, Kettle, Luggage storage, Non-smoking rooms, Self check-in, Laundry
- pyrmont-jetty-suites (16): Free wifi, Kitchen, Gym, Outdoor pool, Washing machine, Air conditioning, Coffee machine, Flat-screen TV, Work desk, Elevator, 24-hour front desk, Luggage storage, Family rooms, Cots available, Non-smoking rooms, Parking on site (paid)
- hotel-haymarket-bluegum (12): Free wifi, 24-hour front desk, Breakfast available, Air conditioning, Heating, Elevator, Luggage storage, Flat-screen TV, Hairdryer, Non-smoking rooms, Express check-in and check-out, Laundry
- the-quayline (24): Free wifi, Outdoor pool, Spa, Rooftop bar, Sauna, Massage treatments, Gym, Restaurant, Room service, Breakfast available, Air conditioning, Heating, Minibar, Bathtub, Bathrobes and slippers, Work desk, 24-hour front desk, Concierge, Elevator, Accessible rooms, Step-free entrance, Cots available, Family rooms, Parking on site (paid)

### Showcase: The Sandstone Rooms
About
- Three sandstone warehouses from the 1800s on a cobbled lane in The Rocks, turned into 36 rooms with bare stone walls and timber floors. The upper rooms look over the rooftops to the Harbour Bridge.
- Breakfast is served in the old loading bay until 10:30, and the bar in the cellar opens at 17:00. Circular Quay, the ferries and the Opera House are five to ten minutes away on foot, and the airport train leaves from Circular Quay station.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Stone Double | 1 queen bed | 20 m² | 2 | The lane | Air conditioning, Heating, Rain shower, Coffee machine, Safe in room, Hairdryer, Flat-screen TV | Non-refundable $284; Free cancellation $312; Free cancellation, breakfast included $352 |
| Bridge View King | 1 king bed | 26 m² | 2 | The Harbour Bridge | Air conditioning, Heating, Rain shower, Coffee machine, Minibar, Bathrobes and slippers, Safe in room, Flat-screen TV | Non-refundable $348; Free cancellation $383; Free cancellation, breakfast included $423 |
| Warehouse Loft | 1 king bed and a sofa bed | 40 m² | 3 | The rooftops and the harbor | Air conditioning, Heating, Bathtub, Rain shower, Coffee machine, Minibar, Bathrobes and slippers, Work desk, Safe in room | Non-refundable $462; Free cancellation $508; Free cancellation, breakfast included $548 |

Guest scores: Cleanliness 9.3; Comfort 9.0; Location 9.7; Staff 9.1; Value 8.4; Wifi 9.0

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Molly | New Zealand | Couple | Oct 2026 | 10 | The bridge from bed | We woke to the Harbour Bridge in the window every morning. Breakfast in the loading bay was excellent. |
| Jake | United States | Solo | Sep 2026 | 9 | Walk to everything | The Opera House, the ferries and the Botanic Garden are all a short walk. The lane is quiet at night. |
| Anjali | India | Family | Aug 2026 | 9 | The loft fit us all | Our daughter loved the sofa bed under the beams. Staff found us the best ferry to the zoo. |
| Marcus | Sweden | Business | Oct 2026 | 8 | Stone walls, slow wifi | The rooms have real character. Wifi slowed down in the evenings. |
| Siobhan | Ireland | Friends | Jul 2026 | 9 | The cellar bar | A great place to start the evening. The weekend market in The Rocks was right outside. |
| Hiroshi | Japan | Couple | Jun 2026 | 9 | Pricey but central | Sydney is expensive and so is this hotel. You can't beat the location. |

Nearby
- The Rocks Markets, 2 min walk
- Museum of Contemporary Art Australia, 5 min walk
- Circular Quay, 6 min walk
- Sydney Opera House, 12 min walk
- Royal Botanic Garden, 15 min walk
- Sydney airport, 25 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Warehouse Loft has a sofa bed for a third guest.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 07:00.

### Showcase: Bondi Saltbush Apartments
About
- Apartments in a low 1930s block on a quiet street behind Bondi Beach, two minutes from the sand. Each has a full kitchen, a washing machine and a balcony, and the top floor looks over the bay.
- The coastal walk to Bronte and Coogee starts at the south end of the beach, past the ocean pool. Buses to the city leave from Campbell Parade, about 30 minutes to Town Hall. A café nearby can leave a breakfast box at your door. There's no elevator, and you let yourself in with a door code.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Studio | 1 queen bed | 32 m² | 2 | The garden | Kitchen, Washing machine, Air conditioning, Coffee machine, Kettle, Flat-screen TV, Balcony | Non-refundable $262; Free cancellation $288; Free cancellation, breakfast included $328 |
| One-bedroom Apartment | 1 queen bed and a sofa bed | 52 m² | 4 | The beach, from the side | Kitchen, Washing machine, Air conditioning, Coffee machine, Kettle, Flat-screen TV, Balcony, Iron and ironing board | Non-refundable $338; Free cancellation $372; Free cancellation, breakfast included $412 |
| Two-bedroom Ocean Apartment | 1 king bed and 2 single beds | 78 m² | 4 | Bondi Bay | Kitchen, Washing machine, Air conditioning, Bathtub, Coffee machine, Kettle, Flat-screen TV, Balcony, Work desk | Non-refundable $498; Free cancellation $548; Free cancellation, breakfast included $588 |

Guest scores: Cleanliness 9.0; Comfort 8.8; Location 9.5; Staff 8.6; Value 8.4; Wifi 8.7

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Lily | United Kingdom | Family | Mar 2026 | 9 | Two minutes to the sand | We were in the water before breakfast every day. The kitchen made feeding three children easy. |
| Mateus | Brazil | Couple | Oct 2026 | 9 | The coastal walk | We walked to Coogee one morning and took the bus back. The balcony was perfect for evening drinks. |
| Erin | Canada | Friends | Sep 2026 | 8 | Great flat, lots of stairs | There's no elevator and ours was on the top floor. The view made up for it. |
| Arjun | Singapore | Couple | Aug 2026 | 9 | The breakfast box was a nice touch | Fresh pastries and fruit at the door each morning. The studio was small but well equipped. |
| Ruth | Israel | Solo | Jul 2026 | 9 | Quiet street, busy beach | The street behind the beach was calm at night. The bus to the city takes a while in traffic. |
| Ollie | Australia | Family | Mar 2026 | 8 | Self check-in only | The door code worked fine, but there was no one to ask on arrival. The apartment itself was spotless. |

Nearby
- Bondi Beach, 2 min walk
- Campbell Parade, 3 min walk
- The ocean pool at the south end of the beach, 10 min walk
- Start of the Bondi to Coogee coastal walk, 10 min walk
- Bondi Junction station, 10 min drive
- Sydney airport, 30 min drive

House rules
- Children: Children of all ages are welcome. Ask the host for a cot before you arrive.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid to the host.
- Quiet hours: 22:00 to 07:00.
- Accessibility: There's no elevator. The top-floor apartments are up three flights of stairs.

---

## Cape Town
Center point: Greenmarket Square. Eight new hotels.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| huis-kaneel | Huis Kaneel | Guesthouse | 4 | Bo-Kaap | 1.0 km | 9.3 Exceptional | 642 | $118 | Budget | 14:00 | 10:00 | Yes |
| the-kelpwater | The Kelpwater | Hotel | 5 | V&A Waterfront | 2.4 km | 9.1 Exceptional | 2,236 | $342 | Luxury | 14:00 | 11:00 | Yes |
| camps-bay-fynbos-resort | Camps Bay Fynbos Resort | Resort | 4 | Camps Bay | 6.3 km | 8.7 Excellent | 1,184 | $286 | Upscale | 14:00 | 11:00 | No |
| sea-point-tidepool-apartments | Sea Point Tidepool Apartments | Apartment | 3 | Sea Point | 4.2 km | 8.4 Very good | 488 | $102 | Budget | 15:00 | 10:00 | No |
| waterkant-cobble-suites | Waterkant Cobble Suites | Aparthotel | 4 | De Waterkant | 1.6 km | 8.8 Excellent | 726 | $164 | Mid-range | 14:00 | 10:00 | No |
| hotel-silvertree-gardens | Hotel Silvertree Gardens | Boutique hotel | 4 | Gardens | 1.5 km | 8.9 Excellent | 954 | $176 | Mid-range | 14:00 | 11:00 | No |
| hotel-southeaster | Hotel Southeaster | Hotel | 3 | City Bowl | 0.5 km | 7.6 Good | 2,064 | $86 | Budget | 14:00 | 10:00 | No |
| hotel-rooibos | Hotel Rooibos | Hotel | 3 | Woodstock | 2.8 km | 8.1 Very good | 873 | $94 | Budget | 14:00 | 10:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| huis-kaneel | Two painted houses on a cobbled Bo-Kaap street, joined into a nine-room guesthouse with a roof deck facing Table Mountain. | Roof deck facing Table Mountain; Breakfast cooked by the owners; Ten minutes' walk to the city center |
| the-kelpwater | A five-star hotel on the quay at the V&A Waterfront, with a heated pool facing Table Mountain and a spa. | Heated pool facing the mountain; Five minutes' walk to the Robben Island ferry; Spa with a sauna |
| camps-bay-fynbos-resort | A resort on the slopes above Camps Bay beach, with pools set in fynbos gardens and the Twelve Apostles mountains behind. | Pools in the fynbos gardens; Five minutes' walk to the beach; Sea-view balconies |
| sea-point-tidepool-apartments | Simple apartments a block from the Sea Point promenade, each with a kitchen, near the tidal pool and the seafront path. | A block from the promenade; A kitchen in each; Near the tidal pool |
| waterkant-cobble-suites | Suites with kitchens in restored cottages on the cobbled streets of De Waterkant, a short walk from the Waterfront and the city. | Restored cottages; A kitchen in every suite; A walk to the Waterfront |
| hotel-silvertree-gardens | A boutique hotel in a Victorian house in Gardens, under Table Mountain, with a pool in the garden and silver trees along the drive. | Pool in the garden; Views of Table Mountain; A walk to the Company's Garden |
| hotel-southeaster | A no-frills hotel in the City Bowl, named after the summer wind, with small rooms and the city's bars and restaurants all around. | In the city center; 24-hour front desk; Good value |
| hotel-rooibos | A hotel in a converted warehouse in Woodstock, near the galleries and the Saturday food market, with a rooftop bar. | Rooftop bar; Near the Woodstock galleries; Free parking |

Amenities
- huis-kaneel (13): Free wifi, Breakfast available, Roof terrace, Courtyard, Air conditioning, Kettle, Hairdryer, Flat-screen TV, Luggage storage, Non-smoking rooms, Tour desk, Family rooms, Cots available
- the-kelpwater (25): Free wifi, Outdoor pool, Spa, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Room service, Breakfast available, Terrace, Air conditioning, Heating, Minibar, Bathrobes and slippers, Bathtub, 24-hour front desk, Concierge, Elevator, Accessible rooms, Cots available, Family rooms, Airport shuttle (paid), Parking on site (paid)
- camps-bay-fynbos-resort (21): Free wifi, Outdoor pool, Garden, Beach access, Spa, Massage treatments, Gym, Restaurant, Bar, Breakfast available, Room service, Balcony, Air conditioning, Minibar, 24-hour front desk, Family rooms, Cots available, Kids' club, Free parking, Electric vehicle charging, Accessible rooms
- sea-point-tidepool-apartments (12): Free wifi, Kitchen, Washing machine, Coffee machine, Kettle, Flat-screen TV, Self check-in, Balcony, Free parking, Family rooms, Cots available, Non-smoking rooms
- waterkant-cobble-suites (15): Free wifi, Kitchen, Plunge pool, Courtyard, Air conditioning, Coffee machine, Flat-screen TV, Washing machine, Self check-in, Luggage storage, Daily housekeeping, Family rooms, Cots available, Non-smoking rooms, Parking on site (paid)
- hotel-silvertree-gardens (16): Free wifi, Outdoor pool, Garden, Breakfast available, Bar, Air conditioning, Heating, 24-hour front desk, Luggage storage, Daily housekeeping, Coffee machine, Hairdryer, Safe in room, Non-smoking rooms, Cots available, Free parking
- hotel-southeaster (12): Free wifi, 24-hour front desk, Breakfast available, Air conditioning, Elevator, Luggage storage, Flat-screen TV, Hairdryer, Non-smoking rooms, Safe in room, Express check-in and check-out, Tour desk
- hotel-rooibos (14): Free wifi, Rooftop bar, Free parking, Breakfast available, Air conditioning, 24-hour front desk, Elevator, Luggage storage, Flat-screen TV, Hairdryer, Work desk, Non-smoking rooms, Accessible rooms, Express check-in and check-out

### Showcase: Huis Kaneel
About
- Two painted houses on a cobbled street in the Bo-Kaap, joined into a guesthouse of nine rooms. The owners live on site, and the roof deck looks over the colored houses to Table Mountain on one side and the harbor on the other.
- Breakfast is cooked to order and often includes something from the family's own recipes, like spiced pancakes with cinnamon sugar. The city center and the restaurants of Bree Street are a ten-minute walk, and a taxi to the V&A Waterfront takes about ten minutes.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Courtyard Double | 1 queen bed | 16 m² | 2 | The courtyard | Air conditioning, Rain shower, Kettle, Hairdryer, Flat-screen TV | Non-refundable $118; Free cancellation $130; Free cancellation, breakfast included $152 |
| Mountain View King | 1 king bed | 22 m² | 2 | Table Mountain | Air conditioning, Rain shower, Coffee machine, Kettle, Hairdryer, Flat-screen TV | Non-refundable $146; Free cancellation $161; Free cancellation, breakfast included $183 |
| Family Room | 1 queen bed and 2 single beds | 28 m² | 4 | The street | Air conditioning, Rain shower, Kettle, Hairdryer, Flat-screen TV, Blackout curtains | Non-refundable $174; Free cancellation $191; Free cancellation, breakfast included $227 |
- Breakfast is $22 for the room, $36 for the Family Room.

Guest scores: Cleanliness 9.5; Comfort 9.0; Location 9.1; Staff 9.8; Value 9.4; Wifi 8.9

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Hélène | France | Couple | Oct 2026 | 10 | The breakfast and the hosts | The spiced pancakes were wonderful, and our hosts treated us like family. The roof deck at sunset is a must. |
| Owen | United Kingdom | Solo | Sep 2026 | 9 | Table Mountain from the roof | I watched the cloud roll over the mountain every evening. The Bo-Kaap streets are lovely early in the morning. |
| Keiko | Japan | Couple | Oct 2026 | 9 | Small rooms, big welcome | Our courtyard room was compact but spotless. The hosts booked our cable car tickets for us. |
| Femi | Nigeria | Business | Aug 2026 | 9 | Great value | Much cheaper than the waterfront hotels and far more personal. Wifi held up for my calls. |
| Astrid | Norway | Family | Jul 2026 | 9 | Good with children | The Family Room fit the four of us, and the hosts found toys for the children. Taxis were easy to call. |
| Brian | United States | Friends | Sep 2026 | 8 | Plan your evenings | The hosts suggested a taxi back after dark, which was easy to book. The rooms are on the small side. |

Nearby
- Bo-Kaap Museum, 3 min walk
- Bree Street, 8 min walk
- Greenmarket Square, 12 min walk
- V&A Waterfront, 10 min drive
- Table Mountain cable car, 15 min drive
- Cape Town airport, 20 min drive

House rules
- Children: Children of all ages are welcome. A cot is available on request, free of charge. The Family Room sleeps four.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the guesthouse.
- Quiet hours: 22:00 to 07:00.

### Showcase: The Kelpwater
About
- A five-star hotel on the quay at the V&A Waterfront, with 150 rooms looking over the working harbor, the marina or Table Mountain. The heated pool on the terrace faces the mountain.
- The spa has a sauna, a hot tub and six treatment rooms, and the restaurant serves Cape seafood with wines from Stellenbosch and Franschhoek. The Robben Island boats leave from the Nelson Mandela Gateway, a five-minute walk, and the Two Oceans Aquarium is next door.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Marina King | 1 king bed or 2 single beds | 36 m² | 2 | The marina | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV | Non-refundable $342; Free cancellation $376; Free cancellation, breakfast included $412 |
| Mountain View King | 1 king bed | 38 m² | 2 | Table Mountain, with a balcony | Air conditioning, Heating, Balcony, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room | Non-refundable $398; Free cancellation $438; Free cancellation, breakfast included $474 |
| Family Suite | 1 king bed and a sofa bed for two | 58 m² | 4 | The harbor | Air conditioning, Heating, Bathtub, Rain shower, Coffee machine, Minibar, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $512; Free cancellation $563; Free cancellation, breakfast included $617 |
| Harbor Suite | 1 king bed | 80 m² | 2 | The harbor and the mountain, from a corner | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Work desk | Non-refundable $842; Free cancellation $926; Free cancellation, breakfast included $962 |
- Breakfast here costs $36 for the room, $54 for the Family Suite.

Guest scores: Cleanliness 9.4; Comfort 9.3; Location 9.4; Staff 9.0; Value 8.4; Wifi 9.0

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Rosa | Spain | Couple | Oct 2026 | 10 | Table Mountain from the pool | We swam with the mountain in front of us every afternoon. The seafood dinner was excellent. |
| Hamza | Pakistan | Family | Aug 2026 | 9 | Easy with children | The aquarium next door kept our two busy for a whole morning. The Family Suite had plenty of room. |
| Gemma | United Kingdom | Business | Sep 2026 | 9 | Smooth and professional | Fast wifi, a quiet room and a good desk. The airport shuttle was on time. |
| Lars | Denmark | Couple | Jul 2026 | 9 | Ask for the mountain side | The view was worth the difference. Winter evenings were cool, but the heated pool was warm. |
| Valeria | Mexico | Friends | Oct 2026 | 8 | Lovely, but a busy area | The Waterfront is full of tour groups by day. The hotel itself felt calm. |
| Takumi | Japan | Solo | Jun 2026 | 9 | Robben Island on the doorstep | I walked to the ferry in five minutes. The concierge helped me book a day trip to the winelands. |

Nearby
- Two Oceans Aquarium, 3 min walk
- Nelson Mandela Gateway, for the Robben Island ferry, 5 min walk
- Zeitz MOCAA, 8 min walk
- Green Point Park, 15 min walk
- Table Mountain cable car, 20 min drive
- Cape Town airport, 25 min drive

House rules
- Children: Children of all ages are welcome. Cots are free, and the Family Suite sleeps four.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. The hotel asks for a card at check-in for extras. A local tourist tax, if the city charges one, is paid at the hotel.
- Quiet hours: 22:00 to 07:00. The pool is open 07:00 to 21:00.

---

## Marrakech
Center point: Jemaa el-Fna. Eight new hotels. Riads (houses built around a courtyard) are listed as guesthouses.

| ID | Hotel | Type | Stars | Neighborhood | From center | Score | Reviews | From a night | Band | Check-in | Check-out | Showcase |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| riad-saba-abwab | Riad Saba Abwab | Guesthouse | 4 | Mouassine, Medina | 0.6 km | 9.4 Exceptional | 812 | $148 | Mid-range | 14:00 | 12:00 | Yes |
| resort-bustan-nakhla | Resort Bustan Nakhla | Resort | 5 | Palmeraie | 7.8 km | 9.0 Exceptional | 1,376 | $364 | Luxury | 15:00 | 12:00 | Yes |
| hotel-rose-ocre | Hotel Rose Ocre | Hotel | 4 | Gueliz | 2.4 km | 8.4 Very good | 1,692 | $112 | Budget | 14:00 | 12:00 | No |
| hotel-mimosa-hivernage | Hotel Mimosa Hivernage | Hotel | 4 | Hivernage | 1.8 km | 8.6 Excellent | 1,148 | $188 | Mid-range | 15:00 | 12:00 | No |
| residence-cedre-gueliz | Résidence Cèdre Gueliz | Aparthotel | 3 | Gueliz | 2.6 km | 8.0 Very good | 604 | $78 | Budget | 14:00 | 11:00 | No |
| dar-douiria-kasbah | Dar Douiria Kasbah | Apartment | 3 | Kasbah | 1.5 km | 8.7 Excellent | 233 | $96 | Budget | 14:00 | 11:00 | No |
| dar-kmar | Dar Kmar | Guesthouse | 2 | Medina, Bab Doukkala | 1.1 km | 8.2 Very good | 917 | $54 | Budget | 13:00 | 11:00 | No |
| maison-safran | Maison Safran | Boutique hotel | 4 | Mellah | 1.0 km | 8.9 Excellent | 688 | $134 | Mid-range | 14:00 | 12:00 | No |

| ID | Card blurb | Highlights |
|---|---|---|
| riad-saba-abwab | A riad behind a plain wooden door in the Mouassine quarter, with eight rooms around a courtyard of orange trees and a plunge pool. | Breakfast in every rate; Roof terrace facing the Atlas Mountains; Eight minutes' walk to Jemaa el-Fna |
| resort-bustan-nakhla | A resort in the palm groves north of the city, with rooms and villas in large gardens, two pools, a hammam and a kids' club. | Two pools, one heated; Spa with a hammam; Villas with their own plunge pools |
| hotel-rose-ocre | A modern hotel in Gueliz, the new town, with a rooftop pool, a café terrace and Avenue Mohammed V close by. | Rooftop pool; In the new town; Ten minutes by taxi to the medina |
| hotel-mimosa-hivernage | A garden hotel in the Hivernage district, with a large pool, a spa and the medina walls a ten-minute walk away. | Large pool in the gardens; Spa with a hammam; Ten minutes' walk to the medina walls |
| residence-cedre-gueliz | Simple studios with kitchenettes in Gueliz, near the Majorelle Garden, with a small pool on the roof. | A kitchenette in every studio; Near the Majorelle Garden; Small rooftop pool |
| dar-douiria-kasbah | Two apartments in the guest wing of an old riad in the Kasbah, with kitchens, a roof terrace and the Saadian Tombs around the corner. | Roof terrace; A kitchen in each apartment; The Saadian Tombs around the corner |
| dar-kmar | A simple, friendly guesthouse near Bab Doukkala, with six rooms around a courtyard and a roof terrace. | Breakfast in every rate; Roof terrace; A short walk to the souks |
| maison-safran | A boutique hotel in a restored house in the Mellah, with saffron-yellow walls, a courtyard pool and a roof terrace near the Bahia Palace. | Courtyard pool; Roof terrace; Five minutes' walk to the Bahia Palace |

Amenities
- riad-saba-abwab (16): Free wifi, Plunge pool, Roof terrace, Breakfast available, Courtyard, Air conditioning, Heating, Hairdryer, Kettle, Luggage storage, Daily housekeeping, 24-hour front desk, Tour desk, Airport shuttle (paid), Massage treatments, Non-smoking rooms
- resort-bustan-nakhla (25): Free wifi, Outdoor pool, Spa, Kids' club, Sauna, Hot tub, Massage treatments, Gym, Restaurant, Bar, Room service, Breakfast available, Garden, Terrace, Plunge pool, Air conditioning, Heating, Minibar, Bathrobes and slippers, 24-hour front desk, Family rooms, Cots available, Airport shuttle (paid), Free parking, Accessible rooms
- hotel-rose-ocre (15): Free wifi, Outdoor pool, Roof terrace, Breakfast available, Restaurant, Bar, Air conditioning, Heating, Elevator, 24-hour front desk, Luggage storage, Flat-screen TV, Safe in room, Non-smoking rooms, Family rooms
- hotel-mimosa-hivernage (20): Free wifi, Outdoor pool, Spa, Garden, Massage treatments, Gym, Restaurant, Bar, Breakfast available, Room service, Air conditioning, Heating, Balcony, 24-hour front desk, Elevator, Family rooms, Cots available, Free parking, Accessible rooms, Airport shuttle (paid)
- residence-cedre-gueliz (13): Free wifi, Kitchen, Outdoor pool, Air conditioning, Heating, Flat-screen TV, Elevator, 24-hour front desk, Luggage storage, Laundry, Family rooms, Non-smoking rooms, Free parking
- dar-douiria-kasbah (12): Free wifi, Kitchen, Roof terrace, Air conditioning, Heating, Kettle, Coffee machine, Washing machine, Self check-in, Hairdryer, Flat-screen TV, Non-smoking rooms
- dar-kmar (12): Free wifi, Breakfast available, Roof terrace, Courtyard, Air conditioning, Heating, Hairdryer, Luggage storage, Tour desk, Non-smoking rooms, Daily housekeeping, Airport shuttle (paid)
- maison-safran (15): Free wifi, Plunge pool, Roof terrace, Breakfast available, Courtyard, Restaurant, Air conditioning, Heating, Hairdryer, Safe in room, 24-hour front desk, Luggage storage, Massage treatments, Tour desk, Non-smoking rooms
- Dar Kmar sells breakfast in every rate, like Riad Saba Abwab: its generated plans are Non-refundable, breakfast included at the From price and Free cancellation, breakfast included at +10%.

### Showcase: Riad Saba Abwab
About
- A riad behind a plain wooden door in the Mouassine quarter, with eight rooms on two floors around a courtyard of orange trees and a small plunge pool. The name means seven doors, after the carved cedar doors that open onto the courtyard.
- Breakfast of msemen pancakes, eggs, fruit and mint tea is served in the courtyard or on the roof terrace, which looks across the medina to the Atlas Mountains. Jemaa el-Fna is an eight-minute walk through the souks. Cars can't reach the door, so a member of staff meets you at the nearest square and walks you in with your bags.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Orange Tree Room | 1 queen bed | 18 m² | 2 | The courtyard | Air conditioning, Heating, Rain shower, Hairdryer, Kettle | Non-refundable, breakfast included $148; Free cancellation, breakfast included $163 |
| Cedar Door Room | 1 king bed or 2 single beds | 24 m² | 2 | The courtyard, behind a carved door | Air conditioning, Heating, Rain shower, Hairdryer, Kettle, Safe in room | Non-refundable, breakfast included $176; Free cancellation, breakfast included $194 |
| Rooftop Suite | 1 king bed and a sofa bed | 36 m² plus a private terrace | 3 | The medina and the Atlas Mountains | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Hairdryer, Kettle, Safe in room | Non-refundable, breakfast included $248; Free cancellation, breakfast included $273 |
- Breakfast in every rate.

Guest scores: Cleanliness 9.7; Comfort 9.4; Location 9.3; Staff 9.8; Value 9.3; Wifi 8.9

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Giulia | Italy | Couple | Oct 2026 | 10 | Calm after the souks | Stepping through the door from the busy lane into the courtyard felt like another world. Breakfast on the roof was the best start to each day. |
| Ryan | Ireland | Friends | Sep 2026 | 9 | Let them walk you in | The lanes are a maze, so being met with our bags was a big help. The plunge pool was cold and lovely after a hot afternoon. |
| Amina | Senegal | Solo | Oct 2026 | 9 | Warm, attentive staff | They remembered how I take my tea from the first morning. My room was spotless. |
| Jacob | Australia | Couple | Aug 2026 | 9 | Book the Rooftop Suite | We had our own terrace with the mountains in the distance. Summer afternoons are very hot, so plan a rest. |
| Xin | China | Family | Jul 2026 | 8 | Lovely, but sound carries | You hear other guests around the courtyard in the morning. The staff were wonderful with our son. |
| Henri | Belgium | Couple | Sep 2026 | 9 | Ten minutes to the square | Close enough to walk to Jemaa el-Fna for dinner, far enough to sleep well. The hammam they booked for us was excellent. |

Nearby
- Mouassine Fountain, 3 min walk
- The souks, 4 min walk
- Le Jardin Secret, 5 min walk
- Jemaa el-Fna, 8 min walk
- Koutoubia Mosque, 12 min walk
- Marrakech airport, 20 min drive

House rules
- Children: Children aged 8 and over are welcome, because of the open plunge pool and the steep stairs.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. A local tourist tax, if the city charges one, is paid at the riad.
- Quiet hours: 22:00 to 08:00. Sound carries around the courtyard.

### Showcase: Resort Bustan Nakhla
About
- A resort in the palm groves north of the city, with 48 rooms and villas spread across large gardens of olive trees and palms. There are two pools, one of them heated, a spa with a hammam, and a kids' club in the gardens.
- The restaurant serves Moroccan dishes from the garden kitchen, and dinner is often outside under the palms. The resort runs a shuttle to the medina four times a day, about 25 minutes each way, and can arrange camel rides in the palm groves and day trips to the Atlas Mountains.

Rooms
| Room | Beds | Size | Sleeps | View | Room amenities | Rate plans, a night |
|---|---|---|---|---|---|---|
| Garden Double | 1 king bed or 2 single beds | 40 m² | 2 | The gardens, from a terrace | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room | Non-refundable $364; Free cancellation $400; Free cancellation, breakfast included $432 |
| Pool Junior Suite | 1 king bed and a sofa bed | 54 m² | 3 | The main pool | Air conditioning, Heating, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room, Flat-screen TV | Non-refundable $448; Free cancellation $493; Free cancellation, breakfast included $525 |
| Family Villa | 1 king bed and 2 single beds, in two bedrooms | 96 m² plus a private garden | 4 | A private garden | Air conditioning, Heating, Bathtub, Rain shower, Coffee machine, Minibar, Safe in room, Flat-screen TV, Blackout curtains | Non-refundable $684; Free cancellation $752; Free cancellation, breakfast included $800 |
| Palm Villa | 1 king bed | 110 m² with a private plunge pool | 2 | The palm grove | Air conditioning, Heating, Plunge pool, Bathtub, Rain shower, Bathrobes and slippers, Coffee machine, Minibar, Safe in room | Non-refundable $896; Free cancellation $986; Free cancellation, breakfast included $1,018 |
- Breakfast here costs $32 for the room, $48 for the Family Villa.

Guest scores: Cleanliness 9.3; Comfort 9.2; Location 8.2; Staff 9.3; Value 8.8; Wifi 8.9

Reviews
| Name | Country | Trip | Month | Score | Title | Review |
|---|---|---|---|---|---|---|
| Victoria | United Kingdom | Couple | Oct 2026 | 10 | The Palm Villa | Our own pool under the palms, and dinner on the terrace every night. We barely left. |
| Karim | France | Family | Aug 2026 | 9 | Perfect with children | The kids' club and the heated pool kept our two happy all week. The Family Villa had a garden for them to run around in. |
| Nadia | Canada | Friends | Sep 2026 | 9 | The hammam | The best spa treatment of our trip. The staff explained every step. |
| Stefan | Austria | Couple | Oct 2026 | 8 | Beautiful, but plan around the shuttle | It's 25 minutes to the medina, so we planned our days around the shuttle times. The gardens are wonderful at sunset. |
| Leila | Tunisia | Couple | Jul 2026 | 9 | Very hot in July, still lovely | The pools and the shade made the afternoon heat bearable. The food was excellent. |
| Drew | United States | Solo | Jun 2026 | 9 | Quiet after the city | A few days here after the medina was exactly what I needed. Wifi was good in the room and patchy in the gardens. |

Nearby
- Palm grove paths, 1 min walk
- Camel rides in the palm groves, 5 min drive
- Majorelle Garden, 15 min drive
- Jemaa el-Fna, 25 min drive
- Marrakech airport, 30 min drive
- Agafay Desert, 45 min drive

House rules
- Children: Children of all ages are welcome. Cots are free, the kids' club takes ages 4 to 12, and the Family Villa sleeps four.
- Pets: Pets aren't allowed.
- Payment: You pay the full price now, by card. The resort asks for a card at check-in for extras. A local tourist tax, if the city charges one, is paid at the resort.
- Quiet hours: 22:00 to 08:00. The pools are open 08:00 to 20:00.

---

# 4. Review pool for the other hotels
60 short snippets for the 72 non-showcase hotels, grouped by the score band of the hotel they suit. Each one has its own score out of 10.

## How the backend uses them
- Each non-showcase hotel shows 6 snippets: 4 from its own band, 1 from the band above and 1 from the band below (where those bands exist). For Fair hotels, take 5 from Fair and 1 from Good.
- A snippet is only used where its "Fits" tag is true for the hotel. Pick with a seed from the hotel ID, so the same hotel always shows the same reviews, and never use one snippet twice on the same page.
- Months: give the six snippets the six most recent months, newest first (Oct 2026 back to May 2026).
- The hotel's overall score and review count come from its city table, never from the snippets.
- Guest scores for non-showcase hotels, from the overall score: Cleanliness +0.2; Comfort -0.1; Location +0.4 if under 1.5 km from the center, -0.4 if 3 km or more, otherwise 0; Staff +0.2; Value +0.3 for Budget, -0.5 for Luxury, otherwise 0; Wifi 0. Round to one decimal and cap at 10.

| Tag | True when |
|---|---|
| any | Always |
| breakfast | The list has Breakfast available |
| kitchen | The list has Kitchen |
| pool | The list has Outdoor pool, Indoor pool or Plunge pool |
| family | The list has Family rooms |
| beach | The list has Beach access |
| bar | The list has Bar or Rooftop bar |
| self check-in | The list has Self check-in |
| central | Under 1.5 km from the center |
| far | 3 km or more from the center |
| budget | Budget band |
| luxury | Luxury band |

## Exceptional (hotels scoring 9.0 to 10)
| # | Score | Name | Country | Trip | Title | Snippet | Fits |
|---|---|---|---|---|---|---|---|
| 1 | 10 | Sakura | Japan | Couple | Better than the photos | The room was bigger and brighter than we expected, and spotless. We'd stay again tomorrow. | any |
| 2 | 10 | Tomás | Portugal | Solo | Staff who remember you | By the second day they knew my name and how I take my coffee. Small things, done well. | any |
| 3 | 9 | Rachel | United States | Family | Easy with children | A cot was ready in the room and the staff had tips for places the children would like. | family |
| 4 | 9 | Youssef | Morocco | Business | Wifi that just works | I had video calls every day without a single drop. Quiet room, good desk. | any |
| 5 | 10 | Maja | Croatia | Couple | A perfect breakfast | Fresh, local and cooked to order. We lingered every morning. | breakfast |
| 6 | 9 | Ivan | Bulgaria | Friends | A location you can't beat | We walked almost everywhere and took the metro once. Great bars nearby. | central |
| 7 | 9 | Precious | Zimbabwe | Solo | Looked after from the first minute | They carried my bags up, explained everything and checked in on me the next day. | any |
| 8 | 10 | Noor | Qatar | Couple | The pool was the highlight | Clean, warm and never crowded in the mornings. We spent every afternoon there. | pool |
| 9 | 9 | Hugo | Belgium | Family | Room to spread out | The kitchen meant we could cook for the children, and the beds were very comfortable. | kitchen |
| 10 | 9 | Charlie | United Kingdom | Couple | Quiet at night | We slept with the windows open and heard nothing. Exactly what we needed. | any |
| 11 | 10 | Leilani | United States | Couple | Worth every cent | A beautiful room, excellent service and a view we'll remember. | luxury |
| 12 | 9 | Arash | Canada | Solo | Great value for the area | Clean, simple and well run, for much less than the hotels around it. | budget |
| 13 | 9 | Beatriz | Brazil | Friends | The beach in two minutes | We were on the sand before breakfast every day. The staff lent us towels and umbrellas. | beach |
| 14 | 9 | Matthias | Germany | Business | Smooth from start to finish | Fast check-in, a proper desk and breakfast early enough for my first meeting. | breakfast |

## Excellent (hotels scoring 8.5 to 8.9)
| # | Score | Name | Country | Trip | Title | Snippet | Fits |
|---|---|---|---|---|---|---|---|
| 15 | 9 | Aiyana | Canada | Couple | Lovely stay, small bathroom | Everything was clean and comfortable. The bathroom was a squeeze for two. | any |
| 16 | 8 | Kenta | Japan | Solo | A good base | Close to the metro, with plenty of places to eat nearby. The rooms are on the small side. | central |
| 17 | 9 | Sara | Sweden | Family | The children loved it | A good breakfast, friendly staff and space for the four of us. | family |
| 18 | 8 | Rohan | India | Business | Reliable and comfortable | Wifi was fast and the bed was comfortable. The air conditioning was a little loud. | any |
| 19 | 9 | Chiara | Italy | Couple | We'd come back | Friendly staff and a lovely room. Breakfast could have had more choice. | breakfast |
| 20 | 8 | Gabriel | France | Friends | Great kitchen, thin walls | Having a kitchen saved us money on meals. We could hear the neighbors in the evening. | kitchen |
| 21 | 9 | Paula | Chile | Solo | Clean and calm | Very clean, quiet and well placed. Check-in took two minutes. | any |
| 22 | 8 | Nikos | Greece | Couple | Nice pool, busy at weekends | The pool was lovely on weekdays. On Saturday it was hard to find a lounger. | pool |
| 23 | 9 | Hiba | Lebanon | Family | Helpful staff | They found us a cot and a high chair within minutes. The room was spotless. | family |
| 24 | 8 | Jan | Czech Republic | Business | Good value, a bit far out | A comfortable room and a good breakfast for the price. It's a ride to the center. | far |
| 25 | 9 | Mia | New Zealand | Couple | A lovely neighborhood | Cafés and small shops on every corner. The room was comfortable and quiet. | any |
| 26 | 8 | Samuel | Kenya | Solo | Good stay, slow mornings | Clean room and friendly staff. Everything got busy at breakfast time. | breakfast |
| 27 | 9 | Ewa | Poland | Friends | Felt like home | The apartment had everything we needed and the host replied within minutes. | kitchen |
| 28 | 8 | Connor | Ireland | Couple | Great beds | The best night's sleep of our trip. The shower pressure was weak. | any |

## Very good (hotels scoring 8.0 to 8.4)
| # | Score | Name | Country | Trip | Title | Snippet | Fits |
|---|---|---|---|---|---|---|---|
| 29 | 8 | Fatou | Senegal | Solo | Good, simple and clean | Everything worked and the staff were kind. Nothing fancy, and that was fine. | budget |
| 30 | 8 | Marek | Slovakia | Couple | Good location, basic room | We were close to everything. The room was plain and a little dated. | central |
| 31 | 7 | Inês | Portugal | Family | Fine for a few nights | Clean and practical. The family room was tight for four with suitcases. | family |
| 32 | 8 | Kaito | Japan | Business | Does the job | A quiet room, good wifi and a short walk to the station. Breakfast was average. | breakfast |
| 33 | 8 | Tunde | Nigeria | Friends | Friendly front desk | They helped us with taxis and tips every day. The rooms are small. | any |
| 34 | 7 | Helga | Iceland | Couple | Nice, but a noisy street | The room was clean and comfortable. Street noise kept us up until midnight. | central |
| 35 | 8 | Pablo | Spain | Solo | Good value | A fair price for a clean room in a decent area. The shower took a while to heat up. | budget |
| 36 | 8 | Yuki | Japan | Couple | The kitchen was handy | We cooked twice and saved a lot. The sofa wasn't very comfortable. | kitchen |
| 37 | 7 | Dylan | Australia | Friends | Fine, but far out | The place itself was fine. Getting to the center took longer than we expected. | far |
| 38 | 8 | Salma | Egypt | Family | The children liked the pool | The pool kept the kids happy. Breakfast got crowded after 09:00. | pool |
| 39 | 8 | Martin | Austria | Business | Comfortable and quiet | A good bed, a quiet room and decent wifi. The desk was small. | any |
| 40 | 7 | Chloe | United Kingdom | Couple | Mixed, but fair | Lovely staff and a good bed. The bathroom needs updating. | any |
| 41 | 8 | Andrei | Romania | Solo | Easy arrival | The self check-in worked perfectly and the room was ready early. | self check-in |
| 42 | 8 | Ming | Singapore | Couple | Breakfast was good | Plenty of choice and good coffee. The room was smaller than in the photos. | breakfast |

## Good (hotels scoring 7.0 to 7.9)
| # | Score | Name | Country | Trip | Title | Snippet | Fits |
|---|---|---|---|---|---|---|---|
| 43 | 7 | Theo | Netherlands | Friends | Fine for the price | A basic room, but clean and well placed. Don't expect much more. | budget |
| 44 | 6 | Holly | United States | Couple | Good spot, tired room | A great base for sightseeing. The carpet and furniture have seen better days. | central |
| 45 | 7 | Vikram | India | Family | Okay for one night | Handy before an early start. The room was cramped for three. | any |
| 46 | 8 | Selin | Turkey | Solo | Better than I expected | For the price, the room was clean and the staff were helpful. | budget |
| 47 | 6 | Bruno | Italy | Couple | Noisy at night | The walls are thin and the street is loud. Earplugs help. | any |
| 48 | 7 | Aditi | India | Business | Fine for work | Wifi was reliable. Breakfast was the same every day. | breakfast |
| 49 | 7 | Kevin | Canada | Friends | Small rooms | It's a place to sleep, not to spend time. The staff were friendly. | budget |
| 50 | 8 | Esther | Kenya | Solo | Handy for the trains | Close to the station, which was all I needed. Clean and simple. | central |
| 51 | 6 | Ole | Norway | Couple | Needs a refresh | The bathroom was dated and the towels were thin. The location was good. | any |
| 52 | 7 | Lina | Germany | Family | Fine, but busy | The breakfast room was crowded every morning. Our room was quiet. | breakfast |
| 53 | 7 | Juan | Colombia | Solo | Fair value | You get what you pay for: clean sheets and a hot shower. | budget |
| 54 | 8 | Akosua | Ghana | Couple | Friendly and simple | The staff made up for the plain room. Good tips for dinner. | any |

## Fair (hotels scoring 6.0 to 6.9)
| # | Score | Name | Country | Trip | Title | Snippet | Fits |
|---|---|---|---|---|---|---|---|
| 55 | 6 | Ross | United Kingdom | Couple | Not quite as pictured | The room was smaller and darker than the photos suggested. The staff were polite. | any |
| 56 | 5 | Mara | Romania | Solo | A disappointing breakfast | Breakfast was cold by 09:00 and nothing was refilled. The bed was fine. | breakfast |
| 57 | 6 | Hassan | Jordan | Family | Hard to find | The entrance is easy to miss and our taxi went round twice. The room was okay. | any |
| 58 | 7 | Quinn | United States | Friends | Okay for a night | Fine for a short stay. The air conditioning was noisy. | any |
| 59 | 6 | Ida | Finland | Couple | Noise from the bar | Music from the bar carried until late. The room itself was clean. | bar |
| 60 | 5 | Tobias | Switzerland | Business | Slow wifi | I couldn't hold a video call from the room. The location was handy. | any |
- No hotel in this catalogue scores below 7.3 today. The Fair snippets are there for the "band below" draw and for any hotel the Developer adds later.

---

# 5. Deals
Deals come only from the mock fares and rates. Each line says what makes it a deal: a price lower than the usual one for those dates, free cancellation, or breakfast included. There are no promo codes, points, member prices, "only 1 left" counters or countdowns.

## What counts as a deal
| Kind | The backend shows it when | Saving or reason |
|---|---|---|
| Fare below typical | The lowest return fare for the dates is at least 12% below the route's "Typical return" (section 1) | {saving} = typical minus lowest, whole dollars |
| Weekend rate | The hotel has a weekend rate (table below) and the stay includes the coming Friday and Saturday nights | {saving} = usual nightly minus the weekend nightly |
| Weeknight rate | The hotel has a weeknight rate and every night of the stay is Sunday to Thursday, within the next 30 days | as above |
| Long-stay rate | The hotel has a long-stay rate and the stay is 4 nights or more, within the next 60 days | as above |
| Next-month rate | The hotel has a next-month rate and every night falls in the next calendar month | as above |
| Free cancellation | The hotel's cheapest Free cancellation plan for the dates | The cancellation deadline |
| Breakfast included | The hotel's cheapest plan with breakfast for the dates | Breakfast in the price |
- "Usual" is the same room on the same plan for the same nights without the lower rate, so a deal never compares against a price nobody could book.
- With today's data, these routes qualify as fares below typical: Lisbon, Rome, Athens, Paris, New York, Tokyo, Singapore, Bangkok, Cape Town, Marrakech.
- The eight existing hotels carry no lower rates, so the demo search, the $744.00 booking and every existing price stay exactly as they are.

## Hotels with lower rates
| Hotel | City | Rate | Lower than usual by |
|---|---|---|---|
| hotel-sal-e-vela | Lisbon | Weekend rate | 15% |
| sete-janelas-apartments | Lisbon | Long-stay rate | 12% |
| palazzo-lucerna | Rome | Weeknight rate | 18% |
| villa-merula | Rome | Next-month rate | 10% |
| maison-verriere | Paris | Weekend rate | 14% |
| hotel-bleu-ardoise | Paris | Weeknight rate | 12% |
| mar-blava-resort | Barcelona | Long-stay rate | 20% |
| hotel-llum-del-born | Barcelona | Weekend rate | 12% |
| hotel-spiegelbeeld | Amsterdam | Weeknight rate | 16% |
| the-ninefold | New York | Weekend rate | 18% |
| the-wendover-residences | New York | Long-stay rate | 15% |
| hotel-ahuehuete | Mexico City | Weekend rate | 20% |
| hotel-kasumi-otemachi | Tokyo | Weekend rate | 12% |
| shiokaze-resort-odaiba | Tokyo | Weeknight rate | 15% |
| hotel-laut-biru | Singapore | Next-month rate | 10% |
| the-quayline | Sydney | Weeknight rate | 12% |
| the-kelpwater | Cape Town | Long-stay rate | 15% |
| resort-bustan-nakhla | Marrakech | Next-month rate | 18% |
- The lower rate applies to every room and plan at that hotel for the nights inside its window. Round to whole dollars.

## Tokens
| Token | Filled with | Example |
|---|---|---|
| {city} | Destination city | Lisbon |
| {origin} | The visitor's last origin, or London | London |
| {price} | The deal price, whole dollars | $265 |
| {usual} | The usual price for the same dates | $312 |
| {saving} | {usual} minus {price} | $47 |
| {hotel} | Hotel name | Hotel Sal e Vela |
| {neighborhood} | Hotel neighborhood | Belém |
| {dates} | Short date range | Nov 20 to 22 |
| {month} | Next month's name | December |
| {count} | Number of hotels that qualify | 4 |
| {cancelBy} | Free cancellation deadline | Nov 17 |
| {duration} | Nonstop flight time | 2h 45m |
| {airline} | Airline on the cheapest offer | Petrel Air |
| {endDate} | Last night of a weeknight window | Dec 10 |

## Deal banner lines (10)
| # | Kind | Line | Button |
|---|---|---|---|
| 1 | Weekend rate | {city} stays from {price} a night this weekend, {saving} below the usual rate | See stays |
| 2 | Fare below typical | Return flights to {city} from {price}, {saving} below the typical fare from {origin} | See flights |
| 3 | Weeknight rate | Weeknights at {hotel} from {price}, down from {usual}, Sunday to Thursday | See rooms |
| 4 | Long-stay rate | Stay 4 nights or more at {hotel} and pay {price} a night instead of {usual} | See rooms |
| 5 | Free cancellation | {count} stays in {city} with free cancellation, from {price} a night for {dates} | See stays |
| 6 | Breakfast included | Breakfast included at {count} {city} hotels, from {price} a night for {dates} | See stays |
| 7 | Fare below typical, nonstop | Nonstop to {city} from {price} return, {saving} below the typical fare | See flights |
| 8 | Next-month rate | {month} at {hotel}: rooms from {price} a night, {saving} below the usual rate | See rooms |
| 9 | Weekend rate | {count} stays in {city} cost less than usual this weekend, from {price} a night | See stays |
| 10 | Fare below typical, long haul | {city} from {price} return, {saving} below the typical fare for a flight of {duration} | See flights |
- Line 7 needs the lowest nonstop fare to clear the 12% rule on its own. Line 10 is for routes over 6 hours.
- Accessible name of a banner: the line, then the button ("Lisbon stays from $265 a night this weekend, $47 below the usual rate. See stays.").

## Deal card lines (8)
Each card has a tag, a title, a meta line, a price line, a reason line and a button.
| # | Kind | Tag | Title | Meta | Price line | Reason line | Button |
|---|---|---|---|---|---|---|---|
| 1 | Weekend rate | Weekend rate | {hotel} | {neighborhood}, {city} | {price} a night, usually {usual} | Lower rate for Friday and Saturday nights, {dates} | See rooms |
| 2 | Weeknight rate | Weeknight rate | {hotel} | {neighborhood}, {city} | {price} a night, usually {usual} | Lower rate on Sunday to Thursday nights until {endDate} | See rooms |
| 3 | Long-stay rate | Long-stay rate | {hotel} | {neighborhood}, {city} | {price} a night, usually {usual} | Lower rate when you stay 4 nights or more | See rooms |
| 4 | Next-month rate | {month} rate | {hotel} | {neighborhood}, {city} | {price} a night, usually {usual} | Lower rate on every night in {month} | See rooms |
| 5 | Fare below typical | Below the typical fare | {origin} to {city} | {dates}, {airline} | Return from {price} | {saving} below the typical fare for this route | See flights |
| 6 | Fare below typical, nonstop | Nonstop | {origin} to {city} | {duration} each way | Return from {price} | Nonstop, and {saving} below the typical fare | See flights |
| 7 | Free cancellation | Free cancellation | {hotel} | {neighborhood}, {city} | {price} a night | Cancel for free until {cancelBy} | See rooms |
| 8 | Breakfast included | Breakfast included | {hotel} | {neighborhood}, {city} | {price} a night with breakfast | Breakfast in the price, free cancellation until {cancelBy} | See rooms |
- Flight prices on deal cards are per traveler, for one adult in Economy, as on the destination cards. Hotel prices are per night for the room, taxes and fees included.
- Card accessible name, hotel: "{hotel}, {neighborhood}, {city}. {price} a night, usually {usual}. {reason line}."

## Section copy around deals
- Heading (H2): Lower prices for your dates
- Line under it: Rates and fares below the usual price for the same dates, plus stays you can cancel for free. Prices are checked again before you pay.
- Demo note (muted, 12px to 14px): Demo prices from the simulated backend.
- Empty (no deal qualifies): hide the row. Never show an empty deal row or a deal without its reason.

---

# 6. Recommended for you
Rows come from what this browser remembers (recent searches and viewed hotels and flights, in lib/store.ts), never from an account or a server. With no history, the first-visit rows show. Each row has a title (H2 or H3), a one-line reason under it, and up to 10 cards.

## First visit
| # | Row title | Reason line | What it shows |
|---|---|---|---|
| 1 | Weekend trips from London | Nonstop flights under 3 hours, lowest return fare first | Paris, Amsterdam, Copenhagen, Barcelona, Rome, Lisbon |
| 2 | Stays guests rate highly | Scored 9 or more, in cities with nonstop flights from London | Hotels at 9.0 or more, one or two per city |
| 3 | Free cancellation, breakfast included | Cancel for free until 3 days before you arrive, with breakfast in the price | The cheapest such plan per hotel |
| 4 | Long-haul for less | Return fares at least 12% below the typical price for the route | Routes over 6 hours that pass the fare rule |
| 5 | By the beach | Resorts and apartments with the beach a short walk away | Hotels with Beach access |
| 6 | Room to cook | Apartments and aparthotels with a kitchen, for longer stays | Apartments and aparthotels |
- On a first visit the home page shows rows 1, 2 and 4 on Flights, and rows 2, 3 and 5 on Hotels.

## Returning visitor
| # | Row title | Reason line | Shown when |
|---|---|---|---|
| 1 | Because you searched {city} | More stays in {city} for {dates}, highest guest score first | After a hotel search |
| 2 | Stay in {city} for your flight dates | You searched flights to {city} for {dates}. These have rooms for those nights. | After a flight search to a city with hotels |
| 3 | Recently viewed | Prices for your dates as of now | After viewing a hotel or a flight |
| 4 | Similar to {hotel} | Same city and price band, rated {score} or more | After viewing a hotel |
| 5 | Near {neighborhood} | Within 2 km of {hotel} | After viewing a hotel |
| 6 | Pick up your search | {origin} to {city}, {dates}, {travelers} | After any search; cards re-run it with today's prices |
| 7 | Other cities in {region} | A similar flight time from {origin}, lowest return fare first | After a flight search |
| 8 | Flights to {city} below the typical fare | Return fares for {dates} at least 12% below the usual price | After a flight search, when the fare rule passes |
- Order on the home page: row 6 first, then the row for the most recent search, then row 3. If a row has fewer than 3 cards, drop it and use the next first-visit row.
- Tokens are filled from the stored search ({score} is the viewed hotel's score, rounded down to the half point, for example 8.5). A row with a token that can't be filled isn't shown.
- Under the rows (muted): Based on your recent searches on this device. Link: Clear recent searches. After clearing, toast "Recent searches cleared" and the first-visit rows return.

---

# 7. Notes for the Developer
1. **Nothing existing moves.** The eight existing hotels keep their names, IDs, areas, stars, prices, card descriptions, the first amenities in their lists and their rooms; their lists only grow. Kittiwake keeps Light, Classic and Flex; the demo booking stays on Classic. The demo account and its four bookings are unchanged.
2. **Fares per airline.** FARES becomes a map by airline code, and FareId and isFare become per-airline. The fare step replaces the fixed 0.17 and 0.377 for every airline except Kittiwake, which keeps them.
3. **Route anchors.** Add the 18 new "Return from" figures to ANCHORS in lib/mock/flights.ts, and a TYPICAL map from the "Typical return" column for deals. Add LIS and MEX to HUBS, and the nine new airports to lib/data/places.ts.
4. **Owners.** "Who flies each route" says which airlines own offers on each route. Today the generator picks owners at random from all airlines; restrict it to the route's list.
5. **Center points.** lib/mock/hotels.ts centers Tokyo near Asakusa and New York at City Hall. For the distances in this file, move Tokyo to Tokyo Station (35.6812, 139.7671) and New York to Times Square (40.7580, -73.9855), and add Singapore, City Hall (1.2931, 103.8520) and Marrakech, Jemaa el-Fna (31.6258, -7.9891). Add Singapore and Marrakech to CITIES.
6. **Pins and addresses.** The 88 new hotels have no coordinates or street addresses. Place each pin inside its named neighborhood at the "From center" distance, rounded to 3 decimals, and write the address line as "{Neighborhood}, {City}, {Country}" with no street or number, so no fictional hotel points at a real door (copy.md's rule).
7. **Breakfast in every rate.** casa-lanterna, patio-quinze, albergo-tre-finestre, riad-saba-abwab and dar-kmar sell only plans with breakfast.
8. **Generated rooms.** The table in "Rate plans" builds rooms for the 64 new non-showcase hotels. The four existing non-showcase Lisbon hotels keep their coded rooms.
9. **Amenity icons.** Overwing's AMENITY_ICON maps 22 names. The master list has 62, so each design needs 40 more icons from its own set (Landfall has its own sprite). That is design work, not copy.
10. **Photos.** Every new hotel needs photos, from each design's own sources (the no-shared-resources rule): about 10 for each showcase hotel, 3 for each of the others. Alt text pattern as copy.md: "{Hotel}, {caption}", for example "Hotel Sal e Vela, outdoor pool".
11. **Demo labels.** The review line ("Demo reviews, written for this preview. They are not from real guests.") and the deals line ("Demo prices from the simulated backend.") must show wherever reviews, scores or deals appear, in both designs.
12. **Filters and sorts to add.** Property type; Guest score; Price band (Budget, Mid-range, Upscale, Luxury); amenity filters drawn from the master list (suggested first: Free cancellation, Breakfast included, Pool, Kitchen, Family rooms, Pets allowed, Beach access, Parking). Sort: Guest score.
13. **Landfall and Overwing copy decks.** Labels in this file follow copy.md's wording; landfall/content/copy.md's global swaps (Sign in, both months in date ranges, total-first prices) still apply on top in Landfall.
14. **Room price per night is per room.** As the backend works today, whatever the number of guests. The "Sleeps" column limits who can book it.

---

# 8. What I left out, and why
- **Real places' rules and costs:** no tourist tax amounts, visa rules, weather promises or airport transfer prices. They change, and they're real-world facts the demo doesn't need. The copy keeps "A local tourist tax, if the city charges one, is paid at the hotel."
- **Pressure tactics:** no "Only 1 room left", "Booked 12 times today" or countdown timers on deals. The competitors use them; ours would be invented signals, and the client asked for clear pricing.
- **Fee amounts for bags and seats:** fares say "For a fee" without a price, as copy.md's Light fare does, because Phase 1 has no flow for buying extras.
- **Rooms for the 64 new non-showcase hotels:** built by rule, not written one by one.
- **Timetables for the new routes:** I named the airlines on each route; flight times and numbers still come from the generator.
- **Hotel photos, coordinates and street addresses:** design and build work (notes 6 and 10).
- **Name checks:** the seven new airline names were searched; the 88 new hotel names were not, so check the ones that reach the client before the client sees them.
- **Time:** the brief gave 60 minutes. The catalogue took about 95, mostly on the 24 showcase hotels.

Catalogue complete.
