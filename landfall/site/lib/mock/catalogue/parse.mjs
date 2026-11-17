/* =====================================================================
   travel-booking (Landfall, working name, a placeholder): catalogue parser
   Reads content/mock-catalogue.md (the shared mock catalogue, all demo
   data) and writes lib/mock/catalogue/catalogue.json for the simulated
   backend. Run from landfall/site: node lib/mock/catalogue/parse.mjs
   Rerun whenever the catalogue changes; never edit the JSON by hand.
   ===================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, '../../../../../content/mock-catalogue.md');
const md = readFileSync(src, 'utf8').replace(/\r/g, '');
const lines = md.split('\n');

/* ---- blocks: one per heading, holding tables, labelled lists and lines ---- */
const blocks = [];
let cur = { level: 0, title: '', h1: '', h2: '', items: [] };
let h1 = '', h2 = '';
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const m = /^(#{1,3}) (.*)$/.exec(l);
  if (m) {
    const level = m[1].length, title = m[2].trim();
    if (level === 1) { h1 = title; h2 = ''; }
    if (level === 2) h2 = title;
    cur = { level, title, h1, h2: level >= 2 ? h2 : '', items: [] };
    blocks.push(cur);
    continue;
  }
  if (l.startsWith('|')) {
    const rows = [];
    while (i < lines.length && lines[i].startsWith('|')) { rows.push(lines[i]); i++; }
    i--;
    const cells = (r) => r.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells).map((c) => Object.fromEntries(head.map((h, k) => [h, c[k] ?? ''])));
    cur.items.push({ t: 'table', head, rows: body });
    continue;
  }
  if (l.startsWith('- ') || l.startsWith('  - ')) { cur.items.push({ t: 'li', text: l.replace(/^\s*- /, '').trim(), indent: l.startsWith('  ') }); continue; }
  if (l.trim()) cur.items.push({ t: 'p', text: l.trim() });
}

const cents = (s) => { const m = /\$([\d,]+(?:\.\d+)?)/.exec(s || ''); return m ? Math.round(parseFloat(m[1].replace(/,/g, '')) * 100) : 0; };
const num = (s) => parseFloat(String(s).replace(/,/g, '')) || 0;
const tables = (b) => b.items.filter((x) => x.t === 'table');
const find = (pred) => blocks.find(pred);
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* labelled lists inside a block: "Amenities", "About", "Nearby", "House rules", ... */
function labelled(b) {
  const out = {}; let label = '';
  for (const it of b.items) {
    if (it.t === 'p') {
      const g = /^Guest scores:\s*(.*)$/.exec(it.text);
      if (g) { out['Guest scores'] = g[1]; label = ''; continue; }
      label = it.text.replace(/:$/, ''); out[label] = out[label] || []; continue;
    }
    if (it.t === 'li' && label) out[label].push(it.text);
    if (it.t === 'table' && label) { out[label + ' table'] = it.rows; }
  }
  return out;
}

const cat = { source: 'content/mock-catalogue.md', complete: /Catalogue complete\.\s*$/.test(md.trim()), generatedAt: new Date().toISOString() };

/* ===== 1. Destinations ===== */
const citiesB = find((b) => b.title === 'Cities');
cat.cities = citiesB ? tables(citiesB)[0].rows.map((r) => ({
  name: r['City'], slug: slug(r['City']), region: r['Region'], country: r['Country'], code: r['Airport'], line: r['One line'],
  flightTime: r['Flight time from London'], returnFrom: cents(r['Return from']), typicalReturn: cents(r['Typical return']),
  hotels: /^Yes/.test(r['Hotels'])
})) : [];
const regB = find((b) => b.title === 'Regions');
cat.regions = regB ? tables(regB)[0].rows.map((r) => ({ name: r['Region'], cities: r['Cities'].split(',').map((s) => s.trim()) })) : [];
const apB = find((b) => b.title === 'New airports for the place list');
cat.airports = apB ? tables(apB)[0].rows.map((r) => ({ code: r['Code'], name: r['Name'], city: r['City'], country: r['Country'] })) : [];
const whoB = find((b) => b.title === 'Who flies each route from London');
cat.routes = {};
if (whoB) for (const r of tables(whoB)[0].rows) {
  const non = r['Nonstop'] === 'None' ? [] : r['Nonstop'].split(',').map((s) => s.trim());
  const one = r['With one stop'] === 'None' ? [] : r['With one stop'].replace(/\(.*?\)/g, '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
    const m = /^(.*) via ([A-Z]{3})$/.exec(s); return m ? { airline: m[1].trim(), via: m[2] } : { airline: s, via: '' };
  });
  cat.routes[r['City']] = { nonstop: non, oneStop: one };
}

/* ===== 2. Airlines and fare families ===== */
const alB = find((b) => b.title === 'The twelve');
cat.airlines = alB ? tables(alB)[0].rows.map((r) => ({
  name: r['Airline'], code: r['Code'], country: r['Base country'], hub: r['Hub'],
  short: r['Short and medium haul'].split(',').map((s) => s.trim()), long: r['Long haul'].split(',').map((s) => s.trim()),
  ticketPrefix: r['Ticket prefix'], cancelOnline: /^Yes/.test(r['Cancel online'])
})) : [];
cat.families = {};
for (const b of blocks) {
  const m = /^(.*) \(([A-Z]{2})\), (\d) families$/.exec(b.title);
  if (!m) continue;
  cat.families[m[2]] = tables(b)[0].rows.map((r) => ({
    name: r['Fare'], step: r['Step'] === 'Lowest' ? 0 : num(r['Step']),
    personal: r['Personal item'], cabin: r['Cabin bag'], checked: r['Checked bag'], seat: r['Seat choice'], changes: r['Changes'], refunds: r['Refunds']
  }));
}
const fcB = find((b) => b.title === 'Fare card note (all airlines)');
cat.fareNote = fcB ? (fcB.items.find((x) => x.t === 'li')?.text || '').replace(/^Under the fare cards, as now:\s*/, '') : '';

/* ===== 3. Hotels: shared lists ===== */
const ptB = find((b) => b.title === 'Property types');
cat.propertyTypes = ptB ? ptB.items.find((x) => x.t === 'p').text.split('.')[0].split(',').map((s) => s.trim()) : [];
const swB = find((b) => b.title === 'Review score words');
cat.scoreWords = swB ? tables(swB)[0].rows.map((r) => ({ min: num(r['Score'].split(' ')[0]), word: r['Word'] })) : [];
cat.demoReviewsLine = 'Demo reviews, written for this preview. They are not from real guests.';
const bandB = find((b) => b.title === 'Price bands');
cat.bands = bandB ? tables(bandB)[0].rows.map((r) => ({ name: r['Band'], range: r['From a night'] })) : [];
const ctrB = find((b) => b.title === 'Distance from the center');
cat.centers = ctrB ? Object.fromEntries(tables(ctrB)[0].rows.map((r) => [slug(r['City']), r['Center point']])) : {};
const rpB = find((b) => b.title === 'Rate plans');
cat.ratePlans = rpB ? tables(rpB)[0].rows.map((r) => ({ name: r['Plan'], cancellation: r['Cancellation'], breakfast: r['Breakfast'] })) : [];
cat.roomRules = rpB && tables(rpB)[1] ? tables(rpB)[1].rows.map((r) => ({ type: r['Type'], rooms: [r['Room 1, at the From price'], r['Room 2'], r['Room 3']].filter((x) => x && x !== 'None') })) : [];
cat.breakfast = rpB && tables(rpB)[2] ? Object.fromEntries(tables(rpB)[2].rows.map((r) => [slug(r['City']), cents(r['Breakfast for the room, a night'])])) : {};
const amB = find((b) => b.title === 'Master amenity list');
cat.amenityGroups = amB ? tables(amB)[0].rows.map((r) => ({ group: r['Group'], items: r['Amenities'].split(';').map((s) => s.trim()) })) : [];
const hrB = find((b) => b.title === 'Default house rules (the other hotels)');
cat.defaultRules = hrB ? hrB.items.filter((x) => x.t === 'li').map((x) => { const i = x.text.indexOf(':'); return { title: x.text.slice(0, i), body: x.text.slice(i + 1).trim() }; }) : [];

/* ===== 3. Hotels: cities ===== */
const cityNames = new Set(cat.cities.map((c) => c.name));
cat.hotels = [];
cat.hotelCities = [];
for (const b of blocks) {
  if (b.level !== 2 || !b.h1.startsWith('3.') || !cityNames.has(b.title)) continue;
  const city = slug(b.title);
  const ts = tables(b);
  if (!ts.length) continue;
  const centre = b.items.find((x) => x.t === 'p' && x.text.startsWith('Center point:'));
  cat.hotelCities.push({ slug: city, name: b.title, center: centre ? centre.text.replace(/^Center point:\s*/, '').split('.')[0] : '' });
  const blurbs = Object.fromEntries((ts[1]?.rows || []).map((r) => [r['ID'], r]));
  const lab = labelled(b);
  const amen = Object.fromEntries((lab['Amenities'] || []).filter((s) => /^[a-z0-9-]+ \(/.test(s)).map((s) => {
    const m = /^([a-z0-9-]+) \(([^)]*)\):\s*(.*)$/.exec(s); return m ? [m[1], m[3].split(',').map((x) => x.trim())] : [s, []];
  }));
  for (const r of ts[0].rows) {
    const sc = /^([\d.]+)\s+(.*)$/.exec(r['Score']) || [];
    const bl = blurbs[r['ID']] || {};
    cat.hotels.push({
      id: r['ID'], name: r['Hotel'], city, type: r['Type'], stars: num(r['Stars']), area: r['Neighborhood'], fromCentre: num(r['From center']),
      score: num(sc[1]), scoreWord: sc[2] || '', reviews: num(r['Reviews']), nightly: cents(r['From a night']), band: r['Band'],
      checkIn: r['Check-in'], checkOut: r['Check-out'], showcase: /^Yes/.test(r['Showcase']),
      blurb: bl['Card blurb'] || '', highlights: (bl['Highlights'] || '').split(';').map((s) => s.trim()).filter(Boolean),
      amenities: amen[r['ID']] || []
    });
  }
}

/* ===== 3. Hotels: showcases ===== */
for (const b of blocks) {
  const m = /^Showcase: (.*)$/.exec(b.title);
  if (!m) continue;
  const h = cat.hotels.find((x) => x.name === m[1].trim());
  if (!h) continue;
  const lab = labelled(b);
  h.about = (lab['About'] || []).filter((s) => !s.startsWith('('));
  h.rooms = (lab['Rooms table'] || []).map((r) => ({
    name: r['Room'], beds: r['Beds'], size: r['Size'], sleeps: num(r['Sleeps']), view: r['View'],
    amenities: r['Room amenities'].split(',').map((s) => s.trim()).filter(Boolean),
    plans: r['Rate plans, a night'].split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
      const p = /^(.*?)\s+\$([\d,]+)$/.exec(s); return p ? { plan: p[1].trim(), nightly: cents('$' + p[2]) } : { plan: s, nightly: 0 };
    })
  }));
  h.roomNotes = (lab['Rooms'] || []);
  const bm = /Breakfast here costs \$(\d+)/.exec((lab['Rooms'] || []).join(' '));
  if (bm) h.breakfastPrice = +bm[1] * 100;
  if (lab['Guest scores']) h.categories = Object.fromEntries(lab['Guest scores'].split(';').map((s) => { const p = /^(.*?)\s+([\d.]+)$/.exec(s.trim()); return p ? [p[1], +p[2]] : [s, 0]; }));
  h.reviewList = (lab['Reviews table'] || []).map((r) => ({ name: r['Name'], country: r['Country'], trip: r['Trip'], month: r['Month'], score: num(r['Score']), title: r['Title'], text: r['Review'] }));
  h.nearby = (lab['Nearby'] || []).map((s) => { const p = /^(.*),\s*(\d+) min (walk|drive)$/.exec(s); return p ? { place: p[1], minutes: +p[2], mode: p[3] } : { place: s, minutes: 0, mode: '' }; });
  h.rules = (lab['House rules'] || []).filter((s) => !s.startsWith('(')).map((s) => { const i = s.indexOf(':'); return { title: s.slice(0, i), body: s.slice(i + 1).trim() }; });
  h.faqs = (lab['FAQs'] || lab['Questions'] || []).map((s) => s);
}

/* ===== 4 to 8: kept raw until their shape settles (deals, recommendations, review pool, notes) ===== */
cat.sections = {};
for (const b of blocks) {
  if (!/^[4-8]\./.test(b.h1)) continue;
  const key = b.level === 1 ? b.title : `${b.h1} / ${b.title}`;
  cat.sections[key] = b.items.map((x) => x.t === 'table' ? { table: x.rows } : x.text);
}

writeFileSync(join(here, 'catalogue.json'), JSON.stringify(cat, null, 1));
console.log(`cities ${cat.cities.length}, airlines ${cat.airlines.length}, families ${Object.keys(cat.families).length}, hotels ${cat.hotels.length} (showcase ${cat.hotels.filter((h) => h.showcase && h.rooms).length}), complete ${cat.complete}, sections ${Object.keys(cat.sections).length}`);
