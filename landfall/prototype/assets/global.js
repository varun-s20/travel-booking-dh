/* =====================================================================
   travel-booking, Landfall (working name, a placeholder): global.js
   The one script for every page, loaded with defer after global.css.
   Plain ES5, no libraries. Motion is CSS transitions driven by classes,
   plus the Web Animations API-free height ease on panels. Every motion
   block checks reduced motion first. Places and fares are the shared
   mock data (content/copy.md); the app replaces them with the API.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- config, flags, helpers ---- */
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP = window.matchMedia('(min-width: 1025px)');
  var SLIDE_MS = 6500;   /* --d-slide */
  var ZOOM_MAX = 1.125;  /* --zoom-scroll, Varun V5 */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  var root = document.documentElement;

  /* Mock places: the six cities in the shared mock data, plus London and Paris (origins). */
  var PLACES = [
    { city: 'London', country: 'United Kingdom', code: 'LHR', airport: 'Heathrow' },
    { city: 'London', country: 'United Kingdom', code: 'LGW', airport: 'Gatwick' },
    { city: 'Lisbon', country: 'Portugal', code: 'LIS', airport: 'Humberto Delgado' },
    { city: 'Rome', country: 'Italy', code: 'FCO', airport: 'Fiumicino' },
    { city: 'New York', country: 'United States', code: 'JFK', airport: 'John F. Kennedy' },
    { city: 'Mexico City', country: 'Mexico', code: 'MEX', airport: 'Benito Juarez' },
    { city: 'Tokyo', country: 'Japan', code: 'HND', airport: 'Haneda' },
    { city: 'Cape Town', country: 'South Africa', code: 'CPT', airport: 'Cape Town International' },
    { city: 'Paris', country: 'France', code: 'CDG', airport: 'Charles de Gaulle' }
  ];
  var CITIES = ['Lisbon', 'Rome', 'New York', 'Mexico City', 'Tokyo', 'Cape Town', 'London', 'Paris'];
  var COUNTRY = {}; PLACES.forEach(function (p) { COUNTRY[p.city] = p.country; });
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* ---- split headings into words for Kasa's word reveal ---- */
  $$('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w, i) { return '<span class="w" aria-hidden="true" style="--i:' + i + '">' + w + '</span>'; }).join(' ');
  });
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('is-loaded'); }); });

  /* ---- in view: add is-inview once ---- */
  (function () {
    var els = $$('[data-inview]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || REDUCED) { els.forEach(function (e) { e.classList.add('is-inview'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-inview'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    els.forEach(function (e) { io.observe(e); });
  })();

  /* ---- state of the search, shared by the card, the compact bar and the captions ---- */
  var S = {
    tab: 'flights',
    from: PLACES[0], to: null, dest: null,
    start: null, end: null,
    adults: 1, children: 0, infants: 0, cabin: 'Economy',
    rooms: 1, guests: 2, kids: 0
  };
  function fmt(d) { return MONTHS[d.getMonth()] + ' ' + d.getDate(); }
  function datesText() { if (!S.start) return ''; return S.end ? fmt(S.start) + ' to ' + fmt(S.end) : fmt(S.start) + ', add return'; }
  function partyText() {
    var n = S.adults + S.children + S.infants;
    var who = (S.children || S.infants) ? n + ' travelers' : S.adults + (S.adults === 1 ? ' adult' : ' adults');
    return who + ', ' + S.cabin;
  }
  function roomsText() { var g = S.guests + S.kids; return S.rooms + (S.rooms === 1 ? ' room, ' : ' rooms, ') + g + (g === 1 ? ' guest' : (S.kids ? ' guests' : ' adults')); }

  /* ===== Header: frosted over the hero, solid after it, hides on scroll down (Kasa) ===== */
  var header = $('[data-header]');
  var hero = $('[data-hero]');
  var compact = $('[data-compact]');
  var card = $('[data-card]');
  var lastY = window.scrollY;
  var headerHidden = false;
  var photo = $('.o-hero__photo');
  var covers = $$('.o-hero__caption, .o-hero__pause, .o-hero__tabs');
  var NAV = 66, COMPACT = 52;
  function onScroll() {
    var y = window.scrollY;
    var photoBottom = photo ? photo.getBoundingClientRect().bottom : 0;
    if (header) {
      var down = y > lastY;
      if (Math.abs(y - lastY) > 4) {
        headerHidden = down && y > 120 && !document.body.classList.contains('is-locked');
        header.classList.toggle('is-hidden', headerHidden);
      }
      if (y < 60) { headerHidden = false; header.classList.remove('is-hidden'); }
    }
    var past = false, docked = false;
    if (compact && card) {
      /* Kasa: the compact bar takes over once the card and the photo have scrolled away */
      past = card.getBoundingClientRect().bottom < 0 && photoBottom < NAV + COMPACT + 40;
      docked = past && !headerHidden;
      compact.classList.toggle('is-shown', past);
      compact.classList.toggle('is-docked', docked);
      compact.setAttribute('aria-hidden', past ? 'false' : 'true');
      $$('button', compact).forEach(function (b) { b.tabIndex = past ? 0 : -1; });
      if (past) closePanel();
    }
    if (header) {
      /* solid as soon as the header stops sitting on the photo (at 390 the card sits inside the hero) */
      header.classList.toggle('is-solid', photoBottom < NAV + 4 || docked);
      header.classList.toggle('has-strip', docked);
    }
    /* the caption and pause fade before the header or the docked bar can cover them */
    var cover = headerHidden ? 0 : (docked ? NAV + COMPACT + 16 : NAV);
    covers.forEach(function (el) { el.classList.toggle('is-covered', el.getBoundingClientRect().top < cover + 8); });
    heroZoom(y);
    lastY = y;
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; onScroll(); });
  }, { passive: true });

  /* ===== Hero: crossfade, settle zoom, scroll zoom (Kasa carousel, Varun V5) ===== */
  var slides = $$('[data-slide]');
  var zoomEl = $('[data-hero-zoom]');
  var pauseBtn = $('[data-hero-pause]');
  var caption = $('[data-caption]');
  var idx = 0, timer = null, paused = REDUCED;
  var fly = $('[data-flyhere]');
  function heroZoom(y) {
    if (!zoomEl || REDUCED || paused || !hero) return;
    var p = clamp(y / hero.offsetHeight, 0, 1);
    zoomEl.style.transform = 'scale(' + (1 + (ZOOM_MAX - 1) * p).toFixed(4) + ')';
  }
  function showSlide(n) {
    if (!slides.length) return;
    var prev = slides[idx];
    idx = (n + slides.length) % slides.length;
    var cur = slides[idx];
    var img = $('img', cur);
    if (img && img.loading === 'lazy') img.loading = 'eager';
    slides.forEach(function (s) { s.classList.toggle('is-current', s === cur); });
    if (!REDUCED) {
      cur.classList.remove('is-settling'); void cur.offsetWidth; cur.classList.add('is-settling');
      if (prev !== cur) setTimeout(function () { prev.classList.remove('is-settling'); }, 1000);
    }
    if (caption) {
      caption.classList.add('is-swapping');
      setTimeout(function () {
        $('[data-caption-place]', caption).textContent = cur.getAttribute('data-place');
        $('[data-caption-fare]', caption).textContent = cur.getAttribute('data-fare');
        caption.setAttribute('data-code', cur.getAttribute('data-code'));
        if (fly) fly.setAttribute('aria-label', 'Fly here: ' + cur.getAttribute('data-fare').split(',')[0]);
        caption.classList.remove('is-swapping');
      }, REDUCED ? 0 : 300);
    }
  }
  function play() { stop(); if (paused || REDUCED || slides.length < 2) return; timer = setTimeout(function () { showSlide(idx + 1); play(); }, SLIDE_MS); }
  function stop() { if (timer) { clearTimeout(timer); timer = null; } }
  if (slides.length) {
    if (!REDUCED) slides[0].classList.add('is-settling');
    /* warm the next photos after the first has loaded */
    window.addEventListener('load', function () { slides.forEach(function (s) { var i = $('img', s); if (i) i.loading = 'eager'; }); });
    play();
    if (pauseBtn) {
      if (REDUCED) { hero.classList.add('is-paused'); pauseBtn.setAttribute('aria-pressed', 'true'); pauseBtn.setAttribute('aria-label', 'Play the photos'); }
      pauseBtn.addEventListener('click', function () {
        paused = !paused;
        hero.classList.toggle('is-paused', paused);
        pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        pauseBtn.setAttribute('aria-label', paused ? 'Play the photos' : 'Pause the photos');
        if (paused) { stop(); } else { if (REDUCED) return; play(); heroZoom(window.scrollY); }
      });
    }
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else play(); });
  }

  /* ===== Menu sheet (phones and tablets) ===== */
  (function () {
    var menu = $('[data-menu]'), opener = $('[data-menu-open]');
    if (!menu || !opener) return;
    var main = $('#main');
    function open() {
      menu.hidden = false; void menu.offsetWidth; menu.classList.add('is-open');
      opener.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked');
      if (main) main.inert = true; if (header) header.inert = true;
      $('[data-menu-close]', menu).focus();
    }
    function close(noFocus) {
      menu.classList.remove('is-open'); opener.setAttribute('aria-expanded', 'false'); document.body.classList.remove('is-locked');
      if (main) main.inert = false; if (header) header.inert = false;
      setTimeout(function () { menu.hidden = true; }, REDUCED ? 0 : 220);
      if (!noFocus) opener.focus();
    }
    opener.addEventListener('click', open);
    $$('[data-menu-close]', menu).forEach(function (b) { b.addEventListener('click', function () { close(b.tagName === 'A'); }); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        var f = $$('a, button', menu); var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  /* ===== Search card: fields, panels that grow out of the card, sheets on phones ===== */
  var openField = null, openPanel = null;
  var status = $('[data-status]');
  function fieldsFor(name) { return $$('[data-field="' + name + '"]'); }
  function activeField(name) { return $('[data-form="' + S.tab + '"] [data-field="' + name + '"]'); }
  function setStatus(msg, isError) { if (!status) return; status.textContent = msg; status.classList.toggle('is-error', !!isError); }

  function openPanelFor(field) {
    var name = field.getAttribute('data-field');
    var panel = $('[data-panel="' + name + '"]');
    if (!panel) return;
    if (openField === field) { closePanel(); return; }
    closePanel(true);
    openField = field; openPanel = panel;
    field.setAttribute('aria-expanded', 'true');
    if (name === 'dates') renderCal();
    var find = $('[data-find]', panel);
    if (find) { find.value = ''; renderPlaces(name, ''); }
    panel.classList.add('is-open');
    if (hero) hero.classList.add('is-searching');
    if (DESKTOP.matches) {
      card.classList.add('is-open');
      panel.style.height = '0px';
      var h = panel.scrollHeight;
      requestAnimationFrame(function () { panel.style.height = h + 'px'; });
    } else {
      document.body.classList.add('is-locked', 'is-sheet');
    }
    var focusTarget = find || (name === 'dates' ? ($('.m-cal__day.is-picked', panel) || $('.m-cal__day:not(:disabled)', panel)) : $('.m-step__btn:not(:disabled), .m-opt input:checked', panel));
    setTimeout(function () { if (focusTarget) focusTarget.focus({ preventScroll: true }); }, DESKTOP.matches ? 60 : 120);
  }
  function closePanel(keepFocus) {
    if (!openPanel) return;
    var f = openField, p = openPanel;
    openField = null; openPanel = null;
    f.setAttribute('aria-expanded', 'false');
    p.classList.remove('is-open');
    if (hero) hero.classList.remove('is-searching');
    card.classList.remove('is-open');
    p.style.height = '';
    document.body.classList.remove('is-locked', 'is-sheet');
    if (!keepFocus && p.contains(document.activeElement)) f.focus({ preventScroll: true });
  }
  function resizePanel() { if (openPanel && DESKTOP.matches) openPanel.style.height = $('.m-panel__in', openPanel).scrollHeight + 'px'; }

  $$('[data-field]').forEach(function (f) { f.addEventListener('click', function () { openPanelFor(f); }); });
  $$('[data-panel-close]').forEach(function (b) { b.addEventListener('click', function () { closePanel(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && openPanel) { e.preventDefault(); closePanel(); } });
  document.addEventListener('click', function (e) {
    if (!openPanel || !DESKTOP.matches) return;
    /* a re-rendered calendar or list detaches the clicked node: that click was inside */
    if (!document.documentElement.contains(e.target) || card.contains(e.target)) return;
    closePanel(true);
  });
  DESKTOP.addEventListener && DESKTOP.addEventListener('change', function () { closePanel(true); });

  /* ---- tabs: Flights / Hotels (arrow keys move between them) ---- */
  var tabs = $$('[data-tab]');
  function selectTab(name, focus) {
    S.tab = name;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    $$('[data-form]').forEach(function (f) { f.hidden = f.getAttribute('data-form') !== name; });
    closePanel(true); setStatus('');
    $$('[data-tab-link]').forEach(function (a) { if (a.classList.contains('o-header__link')) { if (a.getAttribute('data-tab-link') === name) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); } });
    sync();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t.getAttribute('data-tab')); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; selectTab(n.getAttribute('data-tab'), true); }
    });
  });
  $$('[data-tab-link]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!hero) return; e.preventDefault();
      selectTab(a.getAttribute('data-tab-link'));
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });
  if (location.hash === '#hotels') selectTab('hotels');

  /* ---- places list (combobox inside the panel) ---- */
  function renderPlaces(name, q) {
    var list = $('[data-list="' + name + '"]');
    if (!list) return;
    q = (q || '').trim().toLowerCase();
    var items;
    if (name === 'dest') {
      items = CITIES.filter(function (c) { return !q || c.toLowerCase().indexOf(q) === 0 || c.toLowerCase().indexOf(' ' + q) > -1; }).map(function (c) { return { city: c, country: COUNTRY[c] }; });
    } else {
      items = PLACES.filter(function (p) {
        if (!q) return true;
        return p.city.toLowerCase().indexOf(q) === 0 || p.code.toLowerCase() === q || p.airport.toLowerCase().indexOf(q) === 0 || p.country.toLowerCase().indexOf(q) === 0;
      });
    }
    var chosen = S[name];
    list.innerHTML = items.length ? items.map(function (p, i) {
      var sel = chosen && chosen.city === p.city && (!p.code || chosen.code === p.code);
      return '<li><button class="m-place" type="button" role="option" id="opt-' + name + '-' + i + '" aria-selected="' + (sel ? 'true' : 'false') + '" data-pick="' + i + '">' +
        '<span class="m-place__tile" aria-hidden="true"><svg class="a-svg"><use href="#' + (p.code ? 'i-plane' : 'i-pin') + '"/></svg></span>' +
        '<span><span class="m-place__name">' + p.city + (p.airport ? ', ' + p.airport : '') + '</span><span class="m-place__meta">' + p.country + '</span></span>' +
        (p.code ? '<span class="m-place__code">' + p.code + '</span>' : '') + '</button></li>';
    }).join('') : '<li class="m-places__none">No places match "' + q.replace(/[<>&"]/g, '') + '". Check the spelling or type a three-letter airport code.</li>';
    $$('[data-pick]', list).forEach(function (b) {
      b.addEventListener('click', function () { pickPlace(name, items[+b.getAttribute('data-pick')]); });
    });
    resizePanel();
  }
  function pickPlace(name, p) {
    S[name] = p;
    if (name === 'from' && S.to && S.to.city === p.city) S.to = null;
    if (name === 'to' && S.from && S.from.city === p.city) S.from = null;
    sync(); setStatus('');
    var next = name === 'from' ? (S.to ? 'dates' : 'to') : (name === 'to' || name === 'dest') ? 'dates' : null;
    closePanel(true);
    var nf = next && activeField(next);
    if (nf && !(next === 'dates' && S.start && S.end)) { nf.focus({ preventScroll: true }); setTimeout(function () { openPanelFor(nf); }, DESKTOP.matches ? 40 : 260); }
    else { var f = activeField(name); if (f) f.focus({ preventScroll: true }); }
  }
  $$('[data-find]').forEach(function (inp) {
    var name = inp.getAttribute('data-find');
    inp.addEventListener('input', function () { renderPlaces(name, inp.value); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); var first = $('[data-list="' + name + '"] .m-place'); if (first) first.focus(); }
      if (e.key === 'Enter') { e.preventDefault(); var b = $('[data-list="' + name + '"] .m-place'); if (b) b.click(); }
    });
  });
  $$('.m-places').forEach(function (list) {
    list.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      var bs = $$('.m-place', list); var i = bs.indexOf(document.activeElement); if (i < 0) return;
      e.preventDefault(); var n = bs[i + (e.key === 'ArrowDown' ? 1 : -1)];
      if (n) n.focus(); else if (e.key === 'ArrowUp') { var inp = list.parentNode.querySelector('[data-find]'); if (inp) inp.focus(); }
    });
  });
  var swap = $('[data-swap]');
  if (swap) swap.addEventListener('click', function () {
    var t = S.from; S.from = S.to; S.to = t; sync();
    if (!REDUCED) swap.classList.toggle('is-turned');
  });

  /* ---- calendar: two months, range, past days off (Kasa's range calendar) ---- */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var calEl = $('[data-cal]'), hint = $('[data-cal-hint]');
  function sameDay(a, b) { return a && b && a.getTime() === b.getTime(); }
  function monthHtml(m, idxM) {
    var y = m.getFullYear(), mo = m.getMonth();
    var first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
    var h = '<div class="m-cal__month"><p class="m-cal__cap" id="cap-' + idxM + '">' + MONTHS_LONG[mo] + ' ' + y + '</p>';
    if (idxM === 0) h += '<button class="m-cal__nav -prev" type="button" data-cal-nav="-1" aria-label="Previous month"' + (m <= new Date(today.getFullYear(), today.getMonth(), 1) ? ' disabled' : '') + '><svg class="a-svg" aria-hidden="true"><use href="#i-chev-l"/></svg></button>';
    h += '<button class="m-cal__nav -next" type="button" data-cal-nav="1" aria-label="Next month"' + (idxM === 0 ? ' data-only-phone' : '') + '><svg class="a-svg" aria-hidden="true"><use href="#i-chev-r"/></svg></button>';
    h += '<div class="m-cal__grid" role="grid" aria-labelledby="cap-' + idxM + '">';
    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(function (d) { h += '<span class="m-cal__dow" aria-hidden="true">' + d + '</span>'; });
    for (var b = 0; b < first; b++) h += '<span class="m-cal__cell" aria-hidden="true"></span>';
    for (var d = 1; d <= days; d++) {
      var dt = new Date(y, mo, d), past = dt < today;
      var cls = 'm-cal__cell';
      if (S.start && S.end && dt > S.start && dt < S.end) cls += ' is-between';
      if (sameDay(dt, S.start) && S.end) cls += ' is-start';
      if (sameDay(dt, S.end)) cls += ' is-end';
      var picked = sameDay(dt, S.start) || sameDay(dt, S.end);
      h += '<span class="' + cls + '"><button class="m-cal__day' + (picked ? ' is-picked' : '') + (sameDay(dt, today) ? ' is-today' : '') + '" type="button" data-day="' + dt.getTime() + '"' + (past ? ' disabled' : '') + ' aria-pressed="' + (picked ? 'true' : 'false') + '" aria-label="' + MONTHS_LONG[mo] + ' ' + d + ', ' + y + '">' + d + '</button></span>';
    }
    return h + '</div></div>';
  }
  function renderCal() {
    if (!calEl) return;
    var second = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    calEl.innerHTML = monthHtml(view, 0) + monthHtml(second, 1);
    /* on two-month layouts only the second month carries the next arrow */
    if (window.matchMedia('(min-width: 641px)').matches) $$('[data-only-phone]', calEl).forEach(function (b) { b.remove(); });
    else $$('.m-cal__month', calEl)[1].querySelector('.-next').remove();
    $$('[data-cal-nav]', calEl).forEach(function (b) { b.addEventListener('click', function () { view = new Date(view.getFullYear(), view.getMonth() + (+b.getAttribute('data-cal-nav')), 1); renderCal(); }); });
    var days = $$('[data-day]:not(:disabled)', calEl);
    var stop = $('.m-cal__day.is-picked', calEl) || days[0];
    days.forEach(function (b) { b.tabIndex = b === stop ? 0 : -1; b.addEventListener('click', function () { pickDay(new Date(+b.getAttribute('data-day'))); }); });
    if (hint) hint.textContent = !S.start ? (S.tab === 'flights' ? 'Choose your outbound date' : 'Choose your check-in date') : (!S.end ? (S.tab === 'flights' ? 'Now choose your return date, or Done for one way' : 'Now choose your check-out date') : datesText() + (S.tab === 'hotels' ? ', ' + nights() + (nights() === 1 ? ' night' : ' nights') : ''));
    resizePanel();
  }
  if (calEl) calEl.addEventListener('keydown', function (e) {
    var map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(e.key in map) || !e.target.hasAttribute('data-day')) return;
    e.preventDefault();
    var d = new Date(+e.target.getAttribute('data-day')); d.setDate(d.getDate() + map[e.key]);
    if (d < today) return;
    var b = $('[data-day="' + d.getTime() + '"]', calEl);
    if (!b) { view = new Date(view.getFullYear(), view.getMonth() + (map[e.key] > 0 ? 1 : -1), 1); renderCal(); b = $('[data-day="' + d.getTime() + '"]', calEl); }
    if (b) { $$('[data-day]', calEl).forEach(function (x) { x.tabIndex = -1; }); b.tabIndex = 0; b.focus(); }
  });
  function nights() { return S.start && S.end ? Math.round((S.end - S.start) / 864e5) : 0; }
  function pickDay(d) {
    if (!S.start || (S.start && S.end) || d < S.start) { S.start = d; S.end = null; }
    else if (sameDay(d, S.start)) { S.end = null; }
    else { S.end = d; }
    sync(); renderCal();
    var again = $('[data-day="' + d.getTime() + '"]', calEl); if (again) again.focus({ preventScroll: true });
  }
  var calClear = $('[data-cal-clear]');
  if (calClear) calClear.addEventListener('click', function () { S.start = null; S.end = null; sync(); renderCal(); });

  /* ---- steppers with Duffel's limits (9 travelers, one infant per adult) ---- */
  function limits(k, v) {
    if (k === 'adults') return v >= 1 && v + S.children + S.infants <= 9 && v >= S.infants;
    if (k === 'children') return v >= 0 && S.adults + v + S.infants <= 9;
    if (k === 'infants') return v >= 0 && v <= S.adults && S.adults + S.children + v <= 9;
    if (k === 'rooms') return v >= 1 && v <= 8 && v <= S.guests;
    if (k === 'guests') return v >= S.rooms && v + S.kids <= 16;
    if (k === 'kids') return v >= 0 && S.guests + v <= 16;
    return false;
  }
  function syncSteps() {
    $$('[data-step]').forEach(function (b) { var k = b.getAttribute('data-step'); b.disabled = !limits(k, S[k] + (+b.getAttribute('data-by'))); });
    $$('[data-count]').forEach(function (n) { n.textContent = S[n.getAttribute('data-count')]; });
  }
  $$('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () { var k = b.getAttribute('data-step'), v = S[k] + (+b.getAttribute('data-by')); if (limits(k, v)) { S[k] = v; sync(); } });
  });
  $$('input[name="cabin"]').forEach(function (r) { r.addEventListener('change', function () { S.cabin = r.value; sync(); }); });

  /* ---- write the state into the card and the compact bar ---- */
  function setVal(name, text, empty) {
    $$('[data-value="' + name + '"]').forEach(function (v) { v.textContent = text || empty; v.classList.toggle('is-empty', !text); });
  }
  function sync() {
    setVal('from', S.from ? S.from.city + ' (' + S.from.code + ')' : '', 'City or airport');
    setVal('to', S.to ? S.to.city + ' (' + S.to.code + ')' : '', 'City or airport');
    setVal('dest', S.dest ? S.dest.city : '', 'City or area');
    setVal('dates', datesText(), 'Add dates');
    setVal('party', partyText(), '');
    setVal('rooms', roomsText(), '');
    $$('[data-field]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
    syncSteps();
    var route = S.tab === 'flights' ? ((S.from ? S.from.city : 'Anywhere') + ' to ' + (S.to ? S.to.city : 'anywhere')) : (S.dest ? 'Hotels in ' + S.dest.city : 'Hotels anywhere');
    var dates = datesText() || 'Any dates';
    var party = S.tab === 'flights' ? partyText() : roomsText();
    $$('[data-sum="route"]').forEach(function (e) { e.textContent = route; });
    $$('[data-sum="dates"]').forEach(function (e) { e.textContent = dates; });
    $$('[data-sum="party"]').forEach(function (e) { e.textContent = party; });
    $$('[data-sum="line"]').forEach(function (e) { e.textContent = dates + ', ' + party.split(',')[0]; });
  }

  /* ---- submit: the prototype stops at the message the results page will show ---- */
  $$('[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); closePanel(true);
      var miss = null;
      if (S.tab === 'flights') {
        if (!S.from) miss = ['from', 'Choose the city or airport you are flying from.'];
        else if (!S.to) miss = ['to', 'Choose where you are flying to.'];
        else if (!S.start) miss = ['dates', 'Choose your travel dates.'];
      } else {
        if (!S.dest) miss = ['dest', 'Choose the city you want to stay in.'];
        else if (!S.start || !S.end) miss = ['dates', 'Choose your check-in and check-out dates.'];
      }
      if (miss) {
        var f = activeField(miss[0]);
        setStatus(miss[1], true);
        if (f) { f.setAttribute('aria-invalid', 'true'); f.focus(); if (!DESKTOP.matches) openPanelFor(f); }
        return;
      }
      var when = S.end ? fmt(S.start) + ' to ' + fmt(S.end) : fmt(S.start);
      setStatus(S.tab === 'flights' ? 'Searching ' + (S.end ? 'return' : 'one-way') + ' flights from ' + S.from.city + ' to ' + S.to.city + ', ' + when : 'Searching hotels in ' + S.dest.city + ', ' + when);
    });
  });

  /* ---- "Fly here" on the caption, and the destination cards: fill To, then Dates ---- */
  function flyTo(code) {
    var p = PLACES.filter(function (x) { return x.code === code; })[0]; if (!p) return;
    if (S.tab !== 'flights') selectTab('flights');
    S.to = p; if (S.from && S.from.city === p.city) S.from = null; sync(); setStatus('');
    var f = activeField(S.from ? 'dates' : 'from');
    if (window.scrollY > 10) {
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
      setTimeout(function () { if (f) openPanelFor(f); }, REDUCED ? 0 : 600);
    } else if (f) openPanelFor(f);
  }
  if (fly) fly.addEventListener('click', function () { flyTo(caption.getAttribute('data-code') || 'LIS'); });
  $$('[data-dest]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); flyTo(a.getAttribute('data-dest')); }); });

  /* ---- compact bar: back to the card and open the chosen field ---- */
  $$('[data-compact-open]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-compact-open');
      var name = k === 'route' ? (S.tab === 'flights' ? 'to' : 'dest') : k === 'party' ? (S.tab === 'flights' ? 'party' : 'rooms') : k === 'go' ? null : k;
      var f = name ? activeField(name) : $('[data-form="' + S.tab + '"] .m-search__go');
      if (f) f.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
      if (f && name) setTimeout(function () { openPanelFor(f); }, REDUCED ? 0 : 600);
    });
  });

  sync();
  onScroll();
})();
