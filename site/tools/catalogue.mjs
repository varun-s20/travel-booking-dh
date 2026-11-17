/* =====================================================================
   travel-booking: content/mock-catalogue.md to lib/data/catalogue.json
   Reads the Copywriter's catalogue (demo data) and writes it as JSON for
   the simulated backend (lib/mock/catalogue.ts). Rerun after the
   catalogue changes: node tools/catalogue.mjs
   ===================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '..', '..', 'content', 'mock-catalogue.md');
const out = join(here, '..', 'lib', 'data', 'catalogue.json');
const lines = readFileSync(src, 'utf8').split(/\r?\n/);

const cells = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
function tableAt(i) {
  const head = cells(lines[i]);
  const rows = [];
  let j = i + 2;
  while (j < lines.length && lines[j].trim().startsWith('|')) { rows.push(cells(lines[j])); j++; }
  return { head, rows: rows.map((r) => Object.fromEntries(head.map((h, k) => [h, r[k] ?? '']))), end: j };
}
const money = (s) => { const m = /\$([\d,]+)/.exec(s || ''); return m ? +m[1].replace(/,/g, '') : null; };
const num = (s) => { const m = /([\d.,]+)/.exec(s || ''); return m ? +m[1].replace(/,/g, '') : null; };
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const data = { cities: [], airports: [], routeAirlines: {}, airlines: [], fareFamilies: {}, breakfast: {}, centers: {}, hotels: [], reviewPool: [], deals: [], recommend: [], sections: [] };

let h1 = '', h2 = '', h3 = '';
let city = null, hotel = null, block = '';
const hotelById = {};

for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (/^# /.test(l)) { h1 = l.slice(2).trim(); h2 = h3 = ''; block = ''; data.sections.push(h1); city = null; hotel = null; continue; }
  if (/^## /.test(l)) { h2 = l.slice(3).trim(); h3 = ''; block = ''; hotel = null; if (h1.startsWith('3.') && !/Shared lists/.test(h2)) { city = { name: h2, slug: slug(h2), center: '' }; } else city = null; continue; }
  if (/^### /.test(l)) { h3 = l.slice(4).trim(); block = ''; const m = /^Showcase: (.+)$/.exec(h3); hotel = m ? Object.values(hotelById).find((x) => x.name === m[1].trim()) || null : null; continue; }

  if (l.trim().startsWith('|') && i + 1 < lines.length && /^\|\s*-/.test(lines[i + 1].trim())) {
    const t = tableAt(i);
    const hd = t.head.join('|');
    if (h1.startsWith('1.') && h2 === 'Cities') {
      data.cities = t.rows.map((r) => ({ name: r.City, slug: slug(r.City), region: r.Region, country: r.Country, iata: r.Airport, blurb: r['One line'], flightTime: r['Flight time from London'], returnFrom: money(r['Return from']), typicalReturn: money(r['Typical return']), hasHotels: /^Yes/.test(r.Hotels) }));
    } else if (h1.startsWith('1.') && /airports/i.test(h2)) {
      data.airports = t.rows.map((r) => ({ code: r.Code, name: r.Name, city: r.City, country: r.Country }));
    } else if (h1.startsWith('1.') && /Who flies/.test(h2)) {
      for (const r of t.rows) {
        const nonstop = r.Nonstop === 'None' ? [] : r.Nonstop.split(',').map((s) => s.trim()).filter(Boolean);
        const stops = r['With one stop'] === 'None' ? [] : r['With one stop'].replace(/\(.*?\)/g, '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => { const m = /^(.+?) via ([A-Z]{3})$/.exec(s); return m ? { airline: m[1], via: m[2] } : { airline: s, via: '' }; });
        data.routeAirlines[slug(r.City)] = { nonstop, stops };
      }
    } else if (h1.startsWith('2.') && h2 === 'The twelve') {
      data.airlines = t.rows.map((r) => {
        const [shortA] = r['Short and medium haul'].split(',').map((s) => s.trim());
        const [longA] = r['Long haul'].split(',').map((s) => s.trim());
        return { name: r.Airline, code: r.Code, country: r['Base country'], hub: r.Hub, aircraft: shortA, longAircraft: longA, aircraftAll: [...r['Short and medium haul'].split(','), ...r['Long haul'].split(',')].map((s) => s.trim()), ticketPrefix: r['Ticket prefix'], online: /^Yes/.test(r['Cancel online']) };
      });
    } else if (h1.startsWith('2.') && /\(([A-Z]{2})\)/.test(h2) && hd.startsWith('Fare|')) {
      const code = /\(([A-Z]{2})\)/.exec(h2)[1];
      data.fareFamilies[code] = t.rows.map((r) => ({ name: r.Fare, step: /Lowest/i.test(r.Step) ? 0 : +r.Step, personalItem: r['Personal item'], cabinBag: r['Cabin bag'], checkedBag: r['Checked bag'], seatChoice: r['Seat choice'], changes: r.Changes, refunds: r.Refunds }));
    } else if (h1.startsWith('3.') && /Breakfast for the room/.test(hd)) {
      for (const r of t.rows) data.breakfast[slug(r.City)] = money(r[t.head[1]]);
    } else if (h1.startsWith('3.') && hd === 'City|Center point') {
      for (const r of t.rows) data.centers[slug(r.City)] = r['Center point'];
    } else if (city && hd.startsWith('ID|Hotel|')) {
      for (const r of t.rows) {
        const [score, word] = [num(r.Score), (r.Score.split(' ').slice(1).join(' ') || '').trim()];
        const ho = { id: r.ID, name: r.Hotel, city: city.slug, type: r.Type, stars: +r.Stars, neighborhood: r.Neighborhood, distanceKm: num(r['From center']), score, scoreWord: word, reviewCount: num(r.Reviews), fromNightly: money(r['From a night']), band: r.Band, checkIn: r['Check-in'], checkOut: r['Check-out'], showcase: /^Yes/.test(r.Showcase), blurb: '', highlights: [], amenities: [], about: [], rooms: [], categoryScores: null, reviews: [], nearby: [], houseRules: [], notes: [] };
        hotelById[ho.id] = ho; data.hotels.push(ho);
      }
    } else if (city && hd.startsWith('ID|Card blurb')) {
      for (const r of t.rows) { const ho = hotelById[r.ID]; if (ho) { ho.blurb = r['Card blurb']; ho.highlights = r.Highlights.split(';').map((s) => s.trim()).filter(Boolean); } }
    } else if (hotel && hd.startsWith('Room|Beds')) {
      hotel.rooms = t.rows.map((r) => ({ name: r.Room, beds: r.Beds, size: r.Size, sleeps: +r.Sleeps, view: r.View, amenities: r['Room amenities'].split(',').map((s) => s.trim()).filter(Boolean), plans: r['Rate plans, a night'].split(';').map((s) => s.trim()).filter(Boolean).map((p) => { const m = /^(.+?)\s+\$([\d,]+)$/.exec(p); return m ? { name: m[1].trim(), nightly: +m[2].replace(/,/g, '') } : null; }).filter(Boolean) }));
    } else if (hotel && hd.startsWith('Name|Country')) {
      hotel.reviews = t.rows.map((r) => ({ name: r.Name, country: r.Country, trip: r.Trip, month: r.Month, score: +r.Score, title: r.Title, text: r.Review, room: r.Room || '' }));
    } else if (h1.startsWith('4.') && hd.startsWith('#|Score')) {
      const band = h2.replace(/\s*\(.*$/, '').trim();
      data.reviewPool.push(...t.rows.map((r) => ({ band, score: +r.Score, name: r.Name, country: r.Country, trip: r.Trip, title: r.Title, text: r.Snippet, fits: r.Fits.split(/[,;]/).map((x) => x.trim().toLowerCase()).filter(Boolean) })));
    } else if (h1.startsWith('5.')) {
      data.deals.push(...t.rows.map((r) => ({ ...r, _h2: h2, _h3: h3 })));
    } else if (h1.startsWith('6.')) {
      data.recommend.push(...t.rows.map((r) => ({ ...r, _h2: h2, _h3: h3 })));
    }
    i = t.end - 1; continue;
  }

  if (city && /^Center point:/.test(l)) { city.center = l.replace(/^Center point:\s*/, '').split('.')[0].trim(); continue; }
  if (city && !hotel && /^Amenities\s*$/.test(l.trim())) { block = 'amenities'; continue; }
  if (hotel) {
    const t = l.trim();
    if (/^(About|Rooms|Reviews|Nearby|House rules)\s*$/.test(t)) { block = t; continue; }
    if (/^Guest scores:/.test(t)) { hotel.categoryScores = Object.fromEntries(t.replace(/^Guest scores:\s*/, '').split(';').map((s) => s.trim()).filter(Boolean).map((s) => { const m = /^(.+?)\s+([\d.]+)$/.exec(s); return m ? [m[1], +m[2]] : [s, null]; })); continue; }
    if (t.startsWith('- ')) {
      const v = t.slice(2).trim();
      if (/^\(/.test(v)) continue; /* editor's notes in brackets */
      if (block === 'About') hotel.about.push(v);
      else if (block === 'Nearby') { const m = /^(.+?),\s*(\d+)\s*min\s*(walk|drive|by [a-z]+|ride)?/.exec(v); hotel.nearby.push(m ? { name: m[1], minutes: +m[2], mode: (m[3] || 'walk').trim() } : { name: v, minutes: null, mode: '' }); }
      else if (block === 'House rules') { const m = /^([^:]+):\s*(.+)$/.exec(v); if (m) hotel.houseRules.push({ title: m[1].trim(), body: m[2].trim() }); }
      else if (block === 'Rooms') hotel.notes.push(v);
    }
    continue;
  }
  if (city && block === 'amenities' && l.trim().startsWith('- ')) {
    const m = /^- ([a-z0-9-]+) \(([^)]*)\):\s*(.+)$/.exec(l.trim());
    if (m && hotelById[m[1]]) hotelById[m[1]].amenities = m[3].split(',').map((s) => s.trim()).filter(Boolean);
  }
}

data.complete = /Catalogue complete\./.test(lines.slice(-12).join('\n'));
writeFileSync(out, JSON.stringify(data, null, 1));
console.log(`cities ${data.cities.length}, airports ${data.airports.length}, airlines ${data.airlines.length}, fare families ${Object.keys(data.fareFamilies).length}, hotels ${data.hotels.length} (showcase ${data.hotels.filter((h) => h.showcase).length}, with rooms ${data.hotels.filter((h) => h.rooms.length).length}, with reviews ${data.hotels.filter((h) => h.reviews.length).length}), review pool ${data.reviewPool.length}, deals ${data.deals.length}, recommend ${data.recommend.length}, complete ${data.complete}`);
