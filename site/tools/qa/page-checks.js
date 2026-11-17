/* =====================================================================
   travel-booking (working name Overwing, a placeholder): page checks
   A Playwright snippet for the browser tool's "run code" step (it is
   handed the page). Set QA_URL and QA_WIDTH in the first lines, run it
   once per page, width and palette, and paste the JSON it returns into
   build/qa-report.md.
   Checks (build-site skill, section 5): failed requests and console
   errors, unused preloads, images shown above their own resolution,
   images that do not fill their slot or sit under half its width,
   missing alt, keyboard focus visible on every stop, the skip link,
   text contrast against the first solid ground behind it, and empty
   vertical stretches over half a viewport.
   ===================================================================== */
async (page) => {
  const QA_URL = 'http://localhost:3001/';
  const QA_WIDTH = 1440;
  const QA_HEIGHT = QA_WIDTH > 640 ? 900 : 844;

  const failed = [], consoleErrors = [];
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
  await page.setViewportSize({ width: QA_WIDTH, height: QA_HEIGHT });
  await page.goto(QA_URL, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'html{scrollbar-width:none} ::-webkit-scrollbar{display:none}' });
  await page.mouse.move(QA_WIDTH - 2, QA_HEIGHT - 2);

  /* scroll the whole page so lazy images load, then come back */
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(150); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(3500); /* long enough for an unused-preload warning to surface */

  const media = await page.evaluate(() => Array.from(document.images).map((img) => {
    const r = img.getBoundingClientRect();
    const slot = img.closest('.m-window, .m-dest__window, .m-entry__media, .o-homeTrust__media, .o-footer') || img.parentElement;
    const s = slot.getBoundingClientRect();
    /* object-fit: cover draws the image at the larger of the two scale factors */
    const cs = getComputedStyle(img);
    let drawnW = r.width;
    if (cs.objectFit === 'cover' && img.naturalWidth) drawnW = Math.max(r.width, r.height * img.naturalWidth / img.naturalHeight);
    /* the real pixel width of the file the browser chose (srcset densities make naturalWidth a CSS width) */
    const src = (img.currentSrc || img.src).replace(location.origin, '');
    const m = src.match(/-(\d+)\.webp$/);
    const real = m ? +m[1] : img.naturalWidth;
    return {
      src,
      alt: img.getAttribute('alt'),
      real,
      drawn: Math.round(drawnW * devicePixelRatio),
      upscaled: real > 0 && drawnW * devicePixelRatio > real + 1,
      fillsSlot: Math.round(r.width) >= Math.round(s.width) - 1 || img.classList.contains('m-window__view'),
      underHalfSlot: r.width < s.width / 2
    };
  }));

  /* keyboard: Tab through every stop, record whether a ring or outline is visible */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Tab');
  /* headless Chrome holds transitions until a frame is painted; a screenshot paints one */
  await page.waitForTimeout(300); await page.screenshot({ clip: { x: 0, y: 0, width: 10, height: 10 } }); await page.waitForTimeout(200);
  const skip = await page.evaluate(() => ({ text: document.activeElement.textContent, visible: document.activeElement.getBoundingClientRect().top >= 0 }));
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  const afterSkip = await page.evaluate(() => document.activeElement.id);
  const stops = [];
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    const s = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const cell = el.closest('.m-search__seg');
      const ccs = cell ? getComputedStyle(cell) : null;
      const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (ccs && ccs.outlineStyle !== 'none' && parseFloat(ccs.outlineWidth) > 0);
      const label = (el.getAttribute('aria-label') || el.textContent || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 40);
      return { label, ring, tag: el.tagName };
    });
    if (!s) break;
    if (stops.length && stops[0].label === s.label && stops.length > 5) break;
    stops.push(s);
  }

  /* contrast: text against the first solid ground behind it (element and ancestor opacity blended) */
  const contrast = await page.evaluate(() => {
    function rgb(c) { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; }
    function lum([r, g, b]) { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); }
    function ratio(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
    function ground(el) {
      for (let n = el; n; n = n.parentElement) {
        const c = rgb(getComputedStyle(n).backgroundColor);
        if (c.length === 4 ? c[3] >= .99 : true) { if (getComputedStyle(n).backgroundColor !== 'rgba(0, 0, 0, 0)') return c.slice(0, 3); }
      }
      return [255, 255, 255];
    }
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const t = walker.currentNode;
      const el = t.parentElement;
      if (!t.textContent.trim() || seen.has(el) || !el.getClientRects().length) continue;
      if (el.closest('[hidden], .a-sprite, script, style, .sr-only, .a-skip')) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') continue;
      let op = 1; for (let n = el; n; n = n.parentElement) op *= parseFloat(getComputedStyle(n).opacity);
      const fg = rgb(cs.color), bg = ground(el);
      const a = (fg[3] ?? 1) * op;
      const mixed = fg.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a));
      const r = ratio(mixed, bg);
      const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight, 10) >= 700;
      const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
      out.push({ text: t.textContent.trim().slice(0, 36), ratio: +r.toFixed(2), need, fail: r < need });
    }
    return { checked: out.length, lowest: out.sort((a, b) => a.ratio - b.ratio).slice(0, 5), fails: out.filter((x) => x.fail) };
  });

  /* empty stretches: vertical runs with no text, image, control or brand shape, taller than half the viewport */
  const empty = await page.evaluate((vh) => {
    const els = Array.from(document.querySelectorAll('h1,h2,h3,p,li,a,button,img,input,label,.m-window,.m-dest__window,.o-homeBand__glyph,.t-notFound__window'))
      .filter((e) => e.getClientRects().length && !e.closest('[hidden], .o-header__rail, .o-header__tabs, .o-header__bar'));
    const spans = els.map((e) => { const r = e.getBoundingClientRect(); return [r.top + scrollY, r.bottom + scrollY]; }).sort((a, b) => a[0] - b[0]);
    const gaps = []; let end = 0;
    for (const [t, b] of spans) { if (t - end > vh / 2) gaps.push([Math.round(end), Math.round(t)]); end = Math.max(end, b); }
    return gaps;
  }, QA_HEIGHT);

  return JSON.stringify({
    url: QA_URL, width: QA_WIDTH, palette: await page.evaluate(() => document.documentElement.dataset.palette),
    failed, consoleErrors,
    media: { count: media.length, upscaled: media.filter((m) => m.upscaled), notFilling: media.filter((m) => !m.fillsSlot), underHalf: media.filter((m) => m.underHalfSlot), noAlt: media.filter((m) => m.alt === null) },
    keyboard: { skip, afterSkip, stops: stops.length, withoutRing: stops.filter((s) => !s.ring) },
    contrast, empty
  }, null, 1);
}
