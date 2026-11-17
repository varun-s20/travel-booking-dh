/* =====================================================================
   travel-booking (working name Overwing, a placeholder): global.js
   The one script every page loads, deferred, after global.css.
   Plain ES5 in one IIFE, no libraries. Each feature block checks for
   its markup first, so one file serves every page.
   The mock data below stands in for the app's simulated Duffel API.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- config, flags, helpers ---- */
  var doc = document;
  var root = doc.documentElement;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DESKTOP = window.matchMedia('(min-width: 1025px)');
  var css = getComputedStyle(root);
  var DRIFT = parseFloat(css.getPropertyValue('--drift')) || 6;            /* most the view travels, % of its width */
  var DRIFT_RATE = parseFloat(css.getPropertyValue('--drift-rate')) || .12; /* px sideways per px scrolled */

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
  function raf(fn) { return window.requestAnimationFrame(fn); }
  function onMedia(mq, fn) { if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn); }
  function within(el, target) { return !!(el && target && (el === target || el.contains(target))); }

  /* ---- mock data (prototype only; the app reads these from its mock Duffel API) ----
     Real airports and cities, written in characters every Calibre and Geist weight covers. */
  var AIRPORTS = [
    ['LHR', 'London Heathrow', 'London', 'United Kingdom'],
    ['LGW', 'London Gatwick', 'London', 'United Kingdom'],
    ['CDG', 'Paris Charles de Gaulle', 'Paris', 'France'],
    ['LIS', 'Lisbon Humberto Delgado', 'Lisbon', 'Portugal'],
    ['MAD', 'Madrid Barajas', 'Madrid', 'Spain'],
    ['BCN', 'Barcelona El Prat', 'Barcelona', 'Spain'],
    ['FCO', 'Rome Fiumicino', 'Rome', 'Italy'],
    ['AMS', 'Amsterdam Schiphol', 'Amsterdam', 'Netherlands'],
    ['JFK', 'New York John F. Kennedy', 'New York', 'United States'],
    ['LAX', 'Los Angeles International', 'Los Angeles', 'United States'],
    ['MIA', 'Miami International', 'Miami', 'United States'],
    ['YYZ', 'Toronto Pearson', 'Toronto', 'Canada'],
    ['MEX', 'Mexico City International', 'Mexico City', 'Mexico'],
    ['DXB', 'Dubai International', 'Dubai', 'United Arab Emirates'],
    ['SIN', 'Singapore Changi', 'Singapore', 'Singapore'],
    ['HND', 'Tokyo Haneda', 'Tokyo', 'Japan'],
    ['SYD', 'Sydney Kingsford Smith', 'Sydney', 'Australia'],
    ['CPT', 'Cape Town International', 'Cape Town', 'South Africa']
  ];
  var CITIES = [
    ['lisbon', 'Lisbon', 'Portugal'], ['paris', 'Paris', 'France'], ['barcelona', 'Barcelona', 'Spain'],
    ['rome', 'Rome', 'Italy'], ['amsterdam', 'Amsterdam', 'Netherlands'], ['new-york', 'New York', 'United States'],
    ['mexico-city', 'Mexico City', 'Mexico'], ['tokyo', 'Tokyo', 'Japan'], ['cape-town', 'Cape Town', 'South Africa'],
    ['sydney', 'Sydney', 'Australia']
  ];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var BOOK_AHEAD_DAYS = 330; /* Duffel offers run about 11 months ahead */

  /* =====================================================================
     Input modality: the search cells show their accent ring only for
     keyboard focus (inputs match :focus-visible on click too).
     ===================================================================== */
  doc.addEventListener('keydown', function (e) { if (e.key === 'Tab') root.classList.add('is-kbd'); }, true);
  doc.addEventListener('pointerdown', function () { root.classList.remove('is-kbd'); }, true);

  /* =====================================================================
     Current page: mark nav links from the path, never per page.
     ===================================================================== */
  (function () {
    var links = $$('[data-nav]');
    if (!links.length) return;
    var here = location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (a) {
      /* Flights and Hotels on the home page follow the search's active tab instead (initSearch) */
      if (a.hasAttribute('data-mode-link') && $('[data-search]')) return;
      if ((a.getAttribute('href') || '').split(/[?#]/)[0] === here) a.setAttribute('aria-current', 'page');
    });
  })();

  /* =====================================================================
     Header: gathers into a floating cluster (desktop) or gains a hairline
     (phone) once the page scrolls.
     ===================================================================== */
  var header = $('[data-header]');
  var scrollJobs = [];
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    raf(function () {
      ticking = false;
      var y = window.pageYOffset;
      for (var i = 0; i < scrollJobs.length; i++) scrollJobs[i](y);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (header) {
    scrollJobs.push(function (y) { header.classList.toggle('is-scrolled', y > 8); });
    /* phones and tablets (revision 2026-11-11): the tab bar steps aside while the visitor scrolls down,
       and returns on any scroll up, near the top, at the end of the page, or when it takes focus */
    var tabs = $('.o-header__tabs', header), lastY = window.pageYOffset;
    if (tabs) {
      scrollJobs.push(function (y) {
        if (DESKTOP.matches) { header.classList.remove('is-barHidden'); return; }
        var end = y + window.innerHeight >= doc.documentElement.scrollHeight - 8;
        if (y < 120 || end || y < lastY - 6) header.classList.remove('is-barHidden');
        else if (y > lastY + 6) header.classList.add('is-barHidden');
        if (Math.abs(y - lastY) > 6) lastY = y;
      });
      tabs.addEventListener('focusin', function () { header.classList.remove('is-barHidden'); });
      /* while a search field has focus the bar stays out of the way of the cells and their pickers */
      var sp = $('[data-search-panel]');
      if (sp) {
        sp.addEventListener('focusin', function () { if (!DESKTOP.matches) header.classList.add('is-barHidden'); });
        sp.addEventListener('focusout', function (e) { if (!within(sp, e.relatedTarget)) header.classList.remove('is-barHidden'); });
      }
    }
  }

  /* =====================================================================
     Dialogs: move to body, page inert, focus inside, Tab trapped,
     Escape closes, focus returns to the opener.
     ===================================================================== */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var openDialog = null;
  function visibleFocusables(el) {
    return $$(FOCUSABLE, el).filter(function (n) { return n.offsetWidth || n.offsetHeight || n.getClientRects().length; });
  }
  function dialogOpen(el, opener, opts) {
    opts = opts || {};
    if (openDialog) dialogClose(openDialog, true);
    var mark = doc.createComment('dialog-home');
    el.parentNode.insertBefore(mark, el);
    el._home = mark;
    el._opener = opener;
    el._onclose = opts.onclose;
    doc.body.appendChild(el);
    $$('body > *').forEach(function (n) {
      if (n !== el && n.tagName !== 'SCRIPT') { n.setAttribute('inert', ''); n._inerted = true; }
    });
    if (opener) opener.setAttribute('aria-expanded', 'true');
    openDialog = el;
    var first = opts.focus || visibleFocusables(el)[0];
    if (first) first.focus();
  }
  function dialogClose(el, silent) {
    if (!el || openDialog !== el) return;
    $$('body > *').forEach(function (n) { if (n._inerted) { n.removeAttribute('inert'); n._inerted = false; } });
    if (el._onclose) el._onclose();
    if (el._home && el._home.parentNode) { el._home.parentNode.insertBefore(el, el._home); el._home.parentNode.removeChild(el._home); }
    openDialog = null;
    if (el._opener) {
      el._opener.setAttribute('aria-expanded', 'false');
      if (!silent) el._opener.focus();
    }
  }
  doc.addEventListener('keydown', function (e) {
    if (!openDialog) return;
    if (e.key === 'Tab') {
      var f = visibleFocusables(openDialog);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* =====================================================================
     More menu: popover beside the rail (desktop), bottom sheet (phone).
     ===================================================================== */
  (function () {
    var menu = $('[data-more]');
    if (!menu) return;
    $$('[data-more-open]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (openDialog === menu) { dialogClose(menu); return; }
        /* desktop: the panel opens level with the button that opened it */
        if (DESKTOP.matches) menu.style.setProperty('--more-top', Math.max(16, Math.min(btn.getBoundingClientRect().top, window.innerHeight - 360)) + 'px');
        menu.hidden = false;
        dialogOpen(menu, btn, { onclose: function () { menu.hidden = true; } });
      });
    });
    $$('[data-more-close]', menu).forEach(function (el) {
      el.addEventListener('click', function () { dialogClose(menu); });
    });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); dialogClose(menu); }
    });
  })();

  /* =====================================================================
     Segmented toggles: the white thumb slides under the pressed option
     (Hipcamp's 220ms spring). The search modes and the trip type use it.
     ===================================================================== */
  function placeThumb(t) {
    var on = $('[aria-pressed="true"]', t), thumb = $('.a-toggle__thumb', t);
    if (!on || !thumb || !on.offsetWidth) return;
    thumb.style.left = on.offsetLeft + 'px';
    thumb.style.width = on.offsetWidth + 'px';
    thumb.style.height = on.offsetHeight + 'px';
  }
  function setPressed(t, btn) {
    $$('.a-toggle__btn', t).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    placeThumb(t);
  }
  var toggles = $$('[data-toggle]');
  toggles.forEach(function (t) { t.classList.add('is-ready'); placeThumb(t); });
  function placeAllThumbs() { toggles.forEach(placeThumb); }
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(placeAllThumbs).catch(function () {});

  /* =====================================================================
     Dates: helpers shared by the calendar and the field values.
     ===================================================================== */
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function sameDay(a, b) { return !!(a && b) && a.getTime() === b.getTime(); }
  function iso(d) { return d ? d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2) : ''; }
  function short(d) { return MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate(); }
  function range(a, b) { return a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear() ? short(a) + ' to ' + b.getDate() : short(a) + ' to ' + short(b); }
  function longLabel(d) { return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }

  /* =====================================================================
     Search: one component per form. Hipcamp's pill with a white thumb
     that lifts under the open field; popovers 12px below; on the phone
     the same markup becomes a full-screen sheet of stacked cells.
     ===================================================================== */
  var search = $('[data-search]');
  if (search) initSearch(search);

  function initSearch(search) {
    var panel = $('[data-search-panel]', search);
    var trigger = $('[data-search-open]', search);
    var status = $('[data-status]', search);
    var modes = $('[data-toggle]', $('.m-search__modes', search));
    var forms = {};
    $$('[data-form]', search).forEach(function (f) { forms[f.getAttribute('data-form')] = makeForm(f); });
    var current = forms.flights;

    function say(msg, kind) {
      status.textContent = msg || '';
      status.classList.toggle('is-error', kind === 'error');
      status.classList.toggle('is-done', kind === 'done');
    }

    /* ---- Flights / Hotels ---- */
    var modeLinks = $$('[data-mode-link]');
    function setMode(mode) {
      var b = modes && $('[data-mode="' + mode + '"]', modes);
      if (!b || !forms[mode]) return;
      if (b.getAttribute('aria-pressed') !== 'true') {
        current.closeSeg();
        setPressed(modes, b);
        Object.keys(forms).forEach(function (k) { forms[k].el.hidden = k !== mode; });
        current = forms[mode];
        say('');
        updateTrigger();
      }
      /* the rail and the tab bar show the product in use as the current item */
      modeLinks.forEach(function (a) {
        if (a.getAttribute('data-mode-link') === mode) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    if (modes) {
      modes.addEventListener('click', function (e) {
        var b = e.target.closest('[data-mode]');
        if (!b || b.getAttribute('aria-pressed') === 'true') return;
        setMode(b.getAttribute('data-mode'));
      });
      setMode(location.hash === '#hotels' ? 'hotels' : 'flights');
    }
    /* revision 2026-11-11: Flights and Hotels in the rail and the tab bar switch the search on this page,
       bring it into view and put focus on its first field without opening a picker */
    modeLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var mode = a.getAttribute('data-mode-link');
        if (!forms[mode]) return;
        e.preventDefault();
        setMode(mode);
        if (history.replaceState) history.replaceState(null, '', '#' + mode);
        search.scrollIntoView({ block: 'center', behavior: REDUCE.matches ? 'auto' : 'smooth' });
        var first = $('input[role="combobox"]', current.el);
        if (first && DESKTOP.matches) current.focusQuiet(first);
      });
    });

    /* ---- phone trigger: summarises what was entered (round 2, critic:
       it looked as if the input was lost) ---- */
    function updateTrigger() {
      if (!trigger) return;
      var f = current.el, kind = f.getAttribute('data-form');
      var label = $('.a-label', trigger), value = $('.m-search__triggerValue', trigger);
      var d = $('[data-seg="dates"] [data-value]', f);
      var dText = d && d.classList.contains('is-set') ? d.textContent : '';
      var name = kind === 'hotels' ? 'Hotels' : 'Flights';
      var v = '';
      if (kind === 'flights') {
        var a = $('[name="from"]', f).value ? $('[name="from_label"]', f).value : '';
        var b = $('[name="to"]', f).value ? $('[name="to_label"]', f).value : '';
        v = a && b ? a + ' to ' + b : a ? 'From ' + a : b ? 'To ' + b : '';
      } else {
        v = $('[name="place"]', f).value ? $('[name="place_label"]', f).value : '';
      }
      label.textContent = v || dText ? name + (dText ? ', ' + dText : '') : (kind === 'hotels' ? 'Hotels' : 'Flights and hotels');
      value.textContent = v || 'Where to?';
      value.classList.toggle('is-set', !!v);
    }
    var tq = false;
    function queueTrigger() { if (tq) return; tq = true; raf(function () { tq = false; updateTrigger(); }); }
    ['input', 'change', 'click'].forEach(function (t) { panel.addEventListener(t, queueTrigger); });

    /* ---- phone sheet: opened by touching a cell on the hero card (revision 2026-11-11) ---- */
    function sheetOpen(opener) {
      panel.classList.add('is-sheet');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      dialogOpen(panel, opener || trigger, {
        focus: opener || $('[data-search-close]', panel),
        onclose: function () {
          current.closeSeg();
          panel.classList.remove('is-sheet');
          panel.removeAttribute('role');
          panel.removeAttribute('aria-modal');
        }
      });
      placeAllThumbs();
    }
    if (trigger) trigger.addEventListener('click', function () { sheetOpen(); });
    /* phones and tablets: a pointer on a cell opens the full-screen sheet on that cell, with the keyboard
       or picker ready (the cells on the hero stay as a summary of what was chosen). Keyboard users tab
       through the cells in place, and their pickers open inline under the cell. */
    function phoneCell(e) {
      if (DESKTOP.matches || openDialog === panel) return null;
      var field = e.target.closest('[data-field]');
      return field && within(panel, field) ? field : null;
    }
    panel.addEventListener('mousedown', function (e) {
      if (phoneCell(e)) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    panel.addEventListener('click', function (e) {
      var field = phoneCell(e);
      if (!field) return;
      var ctl = $('input[role="combobox"]', field) || field;
      sheetOpen(ctl);
    }, true);
    var closeBtn = $('[data-search-close]', panel);
    if (closeBtn) closeBtn.addEventListener('click', function () { dialogClose(panel); });
    panel.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openDialog === panel && !current.openSeg) { e.preventDefault(); dialogClose(panel); }
    });
    onMedia(DESKTOP, function () {
      if (DESKTOP.matches && openDialog === panel) dialogClose(panel, true);
      Object.keys(forms).forEach(function (k) { forms[k].closeSeg(); });
      raf(placeAllThumbs);
    });

    /* ---- one form ---- */
    function makeForm(form) {
      var kind = form.getAttribute('data-form');
      var pill = $('[data-pill]', form);
      var thumb = $('[data-thumb]', form);
      var segs = $$('[data-seg]', form);
      var api = { el: form, openSeg: null };

      function moveThumb(seg) {
        if (!thumb || !DESKTOP.matches) return;
        thumb.style.left = seg.offsetLeft + 'px';
        thumb.style.width = seg.offsetWidth + 'px';
      }
      function placePop(seg, pop) {
        pop.style.left = '';
        if (!DESKTOP.matches) return;
        var segL = seg.offsetLeft, w = pop.offsetWidth, pw = pill.clientWidth;
        var x = seg.getAttribute('data-seg') === 'who' ? segL + seg.offsetWidth - w : segL;
        if (seg.getAttribute('data-seg') === 'dates') x = segL + seg.offsetWidth / 2 - w / 2;
        x = clamp(x, 0, Math.max(0, pw - w));
        pop.style.left = (x - segL) + 'px';
      }
      function control(seg) { return $('input[role="combobox"]', seg) || $('button[data-field]', seg); }

      function open(seg) {
        if (api.openSeg === seg) return;
        close();
        var pop = $('[data-pop]', seg), ctl = control(seg);
        api.openSeg = seg;
        seg.classList.add('is-open');
        seg.classList.remove('is-invalid');
        if (pill) pill.classList.add('is-active');
        moveThumb(seg);
        if (pop) {
          pop.hidden = false;
          placePop(seg, pop);
          if (seg._onopen) seg._onopen();
        }
        if (ctl) ctl.setAttribute('aria-expanded', 'true');
      }
      function close() {
        var seg = api.openSeg;
        if (!seg) return;
        var pop = $('[data-pop]', seg), ctl = control(seg);
        if (pop) pop.hidden = true;
        if (ctl) ctl.setAttribute('aria-expanded', 'false');
        if (ctl && ctl.hasAttribute('aria-activedescendant')) ctl.removeAttribute('aria-activedescendant');
        seg.classList.remove('is-open');
        if (pill) pill.classList.remove('is-active');
        api.openSeg = null;
      }
      api.closeSeg = close;
      api.open = open;
      api.focusQuiet = function (c) { api.quiet = true; c.focus(); api.quiet = false; };

      segs.forEach(function (seg) {
        var field = $('[data-field]', seg);
        var input = $('input[role="combobox"]', seg);
        var pop = $('[data-pop]', seg);
        if (input) {
          field.addEventListener('mousedown', function (e) {
            if (e.target !== input) { e.preventDefault(); input.focus(); }
          });
          input.addEventListener('focus', function () { if (!api.quiet) open(seg); });
        } else if (field) {
          field.addEventListener('click', function () {
            if (api.openSeg === seg) close(); else open(seg);
          });
        }
        seg.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && api.openSeg === seg) {
            e.preventDefault();
            e.stopPropagation();
            close();
            var c = control(seg);
            if (c && doc.activeElement !== c) c.focus();
          }
        });
        /* leaving the cell by keyboard closes its popover; pointer clicks
           outside are handled by the document pointerdown below, and a
           calendar re-render (focus lost to nothing) leaves it open */
        seg.addEventListener('focusout', function (e) {
          if (!root.classList.contains('is-kbd')) return;
          if (api.openSeg === seg && e.relatedTarget && !within(seg, e.relatedTarget)) close();
        });
        $$('[data-pop-done]', seg).forEach(function (b) {
          b.addEventListener('click', function () { close(); var c = control(seg); if (c) c.focus(); });
        });
        if (pop) pop.addEventListener('mousedown', function (e) {
          /* clicks inside the popover never move focus out of the cell
             (main carries tabindex -1 for the skip link, so a click on
             plain text would otherwise focus main and close the popover);
             clicks still fire, so labels and buttons work as normal */
          if (!e.target.closest('input[type="text"]')) e.preventDefault();
        });
      });

      /* outside clicks close on click, not on press: in the phone sheet the
         pickers sit inline, so closing on press would move the button
         under the finger before the click lands */
      doc.addEventListener('click', function (e) {
        /* a month change re-renders the calendar, so its arrow is gone from the page by now */
        if (!doc.documentElement.contains(e.target)) return;
        if (api.openSeg && !within(api.openSeg, e.target)) close();
      });
      window.addEventListener('resize', function () { if (api.openSeg) { moveThumb(api.openSeg); var p = $('[data-pop]', api.openSeg); if (p) placePop(api.openSeg, p); } });

      $$('input[role="combobox"]', form).forEach(function (input) { makeCombo(input, api); });
      $$('[data-cal]', form).forEach(function (cal) { makeCalendar(cal, api, kind); });
      makePeople(form, kind);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        close();
        var err = validate(form, kind);
        if (err) {
          say(err.msg, 'error');
          err.seg.classList.add('is-invalid');
          var c = control(err.seg);
          if (c) {
            c.setAttribute('aria-invalid', 'true');
            c.setAttribute('aria-describedby', status.id || setId(status));
            /* phones and tablets: a failed search opens the sheet on the failing cell (critic, 11 Nov) */
            if (!DESKTOP.matches && openDialog !== panel) { sheetOpen(c); return; }
            /* focus the field without opening its popover, so nothing covers the message */
            api.quiet = true;
            c.focus();
            api.quiet = false;
          }
          return;
        }
        var go = $('[data-go]', form), label = $('.a-button__label', go);
        go.setAttribute('aria-disabled', 'true');
        label.textContent = 'Searching';
        say('');
        setTimeout(function () {
          go.removeAttribute('aria-disabled');
          label.textContent = 'Search';
          say(summary(form, kind), 'done');
        }, REDUCE.matches ? 0 : 900);
      });
      $$('input[role="combobox"], button[data-field]', form).forEach(function (c) {
        c.addEventListener('input', function () { clearInvalid(c); });
        c.addEventListener('change', function () { clearInvalid(c); });
      });
      function clearInvalid(c) {
        if (c.getAttribute('aria-invalid') !== 'true') return;
        c.removeAttribute('aria-invalid');
        c.removeAttribute('aria-describedby');
        var s = c.closest('[data-seg]');
        if (s) s.classList.remove('is-invalid');
        if (status.classList.contains('is-error')) say('');
      }
      api.clearInvalid = clearInvalid;
      return api;
    }

    var idn = 0;
    function setId(el) { el.id = 'search-status-' + (++idn); return el.id; }

    /* ---- validation and the prototype's end point ---- */
    function validate(form, kind) {
      function seg(name) { return $('[data-seg="' + name + '"]', form); }
      function code(name) {
        var s = seg(name), c = $('input[role="combobox"]', s);
        if (c && c._resolve) c._resolve();
        return $('[data-code]', s).value;
      }
      function typed(name) { var c = $('input[role="combobox"]', seg(name)); return c ? c.value.trim() : ''; }
      function pickMsg(name, fallback) { var t = typed(name); return t ? 'Choose “' + t + '” from the list, or type a city or airport code.' : fallback; }
      function date(which) { return $('[data-date="' + which + '"]', form).value; }
      if (kind === 'flights') {
        if (!code('from')) return { seg: seg('from'), msg: pickMsg('from', 'Choose the city or airport you are flying from.') };
        if (!code('to')) return { seg: seg('to'), msg: pickMsg('to', 'Choose where you are flying to.') };
        if (code('from') === code('to')) return { seg: seg('to'), msg: 'Choose a destination different from where you start.' };
        if (!date('start')) return { seg: seg('dates'), msg: 'Choose your departure date.' };
        var trip = $('[data-trip] [aria-pressed="true"]', form);
        if (trip && trip.getAttribute('data-trip-type') === 'return' && !date('end')) return { seg: seg('dates'), msg: 'Choose your return date, or switch to one way.' };
      } else {
        if (!code('place')) return { seg: seg('place'), msg: pickMsg('place', 'Choose the city you want to stay in.') };
        if (!date('start') || !date('end')) return { seg: seg('dates'), msg: 'Choose your check-in and check-out dates.' };
      }
      return null;
    }
    function summary(form, kind) {
      var dates = $('[data-seg="dates"] [data-value]', form).textContent;
      var who = $('[data-seg="who"] [data-value]', form).textContent;
      if (kind === 'flights') {
        return 'Prototype ends here. In the build this opens flight results for ' + $('[name="from"]', form).value + ' to ' + $('[name="to"]', form).value + ', ' + dates + ', ' + who + '.';
      }
      return 'Prototype ends here. In the build this opens hotel results for ' + $('[name="place_label"]', form).value + ', ' + dates + ', ' + who + '.';
    }

    /* ---- combobox: airports and cities ---- */
    function makeCombo(input, api) {
      var seg = input.closest('[data-seg]');
      var list = doc.getElementById(input.getAttribute('aria-controls'));
      var codeInput = $('[data-code]', seg);
      var codeLabel = $('[data-code-label]', seg);
      var kind = input.getAttribute('data-combo');
      var items = [];
      var active = -1;

      /* rank: airport code first, then a word that starts with the query,
         then anything containing it ("lon" puts London above Barcelona) */
      function score(r, q) {
        if (!q) return 0;
        var isAir = kind === 'airports';
        if (isAir && r[0].toLowerCase() === q) return 0;
        if (isAir && r[0].toLowerCase().indexOf(q) === 0) return 1;
        var text = (isAir ? r.slice(1) : r.slice(1)).join(' ').toLowerCase();
        var words = text.split(/[\s,.()]+/);
        for (var i = 0; i < words.length; i++) if (words[i].indexOf(q) === 0) return 2;
        return text.indexOf(q) > -1 ? 3 : -1;
      }
      /* the other end of the trip: To never offers the airport chosen as From
         (and the reverse), and same-city airports drop to the end (round 3, critic) */
      function otherEnd() {
        var other = $$('input[role="combobox"]', input.form).filter(function (c) { return c !== input; })[0];
        if (!other) return null;
        var s = other.closest('[data-seg]'), code = $('[data-code]', s).value;
        return code ? AIRPORTS.filter(function (r) { return r[0] === code; })[0] : null;
      }
      function rows(q) {
        q = (q || '').trim().toLowerCase();
        var src = kind === 'airports' ? AIRPORTS : CITIES;
        if (codeInput.value && input.value === input._chosen) q = '';
        var away = kind === 'airports' ? otherEnd() : null;
        return src.map(function (r, i) {
          var s = score(r, q);
          if (away && s > -1) { if (r[0] === away[0]) s = -1; else if (r[2] === away[2]) s += 10; }
          return { r: r, s: s, i: i };
        })
          .filter(function (x) { return x.s > -1; })
          .sort(function (a, b) { return a.s - b.s || a.i - b.i; })
          .map(function (x) { return x.r; });
      }
      /* typed text that names one place is accepted without picking from the
         list: an exact code, city or airport name, or a single match
         (round 3, critic: "Paris" then Tab was refused) */
      function resolve() {
        if (codeInput.value) return true;
        var q = input.value.trim().toLowerCase();
        if (!q) return false;
        var found = rows(q);
        var exact = found.filter(function (r) {
          return r[0].toLowerCase() === q || r[1].toLowerCase() === q || r[2].toLowerCase() === q;
        });
        var pick = found.length === 1 ? found[0] : exact.length ? exact[0] : null;
        if (!pick) return false;
        items = [pick];
        choose(0, true);
        return true;
      }
      input._resolve = resolve;
      input.addEventListener('blur', function () { if (!codeInput.value) resolve(); });
      function render() {
        items = rows(input.value);
        active = -1;
        list.innerHTML = '';
        if (!items.length) {
          var li = doc.createElement('li');
          li.className = 'm-pop__empty';
          li.setAttribute('role', 'presentation');
          li.textContent = 'No match in this list. Try a city name or a three-letter airport code.';
          list.appendChild(li);
          input.removeAttribute('aria-activedescendant');
          return;
        }
        items.forEach(function (r, i) {
          var li = doc.createElement('li');
          li.className = 'm-option';
          li.id = list.id + '-' + i;
          li.setAttribute('role', 'option');
          li.setAttribute('aria-selected', 'false');
          var isAir = kind === 'airports';
          li.innerHTML = '<span class="m-option__disc" aria-hidden="true"><svg class="a-icon -s"><use href="#' + (isAir ? 'i-plane' : 'i-city') + '"/></svg></span>' +
            '<span class="m-option__text"><span class="m-option__title"></span><span class="m-option__sub"></span></span>' +
            (isAir ? '<span class="m-option__code"></span>' : '');
          $('.m-option__title', li).textContent = isAir ? r[1] : r[1];
          $('.m-option__sub', li).textContent = isAir ? r[2] + ', ' + r[3] : r[2];
          if (isAir) $('.m-option__code', li).textContent = r[0];
          li.addEventListener('mousedown', function (e) { e.preventDefault(); });
          li.addEventListener('click', function () { choose(i); });
          list.appendChild(li);
        });
      }
      function highlight(i) {
        var opts = $$('[role="option"]', list);
        if (!opts.length) return;
        active = (i + opts.length) % opts.length;
        opts.forEach(function (o, n) { o.setAttribute('aria-selected', n === active ? 'true' : 'false'); });
        input.setAttribute('aria-activedescendant', opts[active].id);
        var o = opts[active], top = o.offsetTop, bottom = top + o.offsetHeight;
        if (top < list.scrollTop) list.scrollTop = top;
        else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
      }
      function choose(i, stay) {
        var r = items[i];
        if (!r) return;
        /* the cell shows the city; the airport code sits on the label row,
           so long names never clip (round 2, critic) */
        var label = kind === 'airports' ? r[2] : r[1] + ', ' + r[2];
        input.value = label;
        input._chosen = label;
        codeInput.value = r[0];
        if (codeLabel) codeLabel.textContent = r[0];
        api.clearInvalid(input);
        if (stay) return; /* resolved from typing: leave focus and popovers alone */
        api.closeSeg();
        /* move on to the next field, as the pill reads left to right */
        var next = seg.nextElementSibling;
        while (next && !next.hasAttribute('data-seg')) next = next.nextElementSibling;
        if (next) {
          var c = $('input[role="combobox"]', next);
          if (c) c.focus(); else { var b = $('button[data-field]', next); if (b) { b.focus(); api.open(next); } }
        }
      }
      seg._onopen = function () { render(); list.scrollTop = 0; };
      input.addEventListener('input', function () {
        codeInput.value = '';
        if (codeLabel) codeLabel.textContent = '';
        input._chosen = null;
        if (api.openSeg !== seg) api.open(seg); else render();
        if (input.value.trim()) highlight(0);
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (api.openSeg !== seg) api.open(seg);
          highlight(active + (e.key === 'ArrowDown' ? 1 : -1));
        } else if (e.key === 'Enter') {
          if (api.openSeg === seg && active > -1) { e.preventDefault(); choose(active); }
        } else if (e.key === 'Tab') {
          api.closeSeg();
        }
      });
    }

    /* ---- range calendar ---- */
    function makeCalendar(cal, api, kind) {
      var seg = cal.closest('[data-seg]');
      var form = cal.closest('form');
      var body = $('[data-cal-body]', cal);
      var hint = $('[data-cal-hint]', cal);
      var clearBtn = $('[data-cal-clear]', cal);
      var valueEl = $('[data-value]', seg);
      var startIn = $('[data-date="start"]', form), endIn = $('[data-date="end"]', form);
      var trip = $('[data-trip]', cal);
      var t0 = today();
      var last = addDays(t0, BOOK_AHEAD_DAYS);
      var view = new Date(t0.getFullYear(), t0.getMonth(), 1);
      var start = null, end = null, hover = null, focusDay = null, parked = null;
      var single = false;
      var minNights = kind === 'hotels' ? 1 : 0;

      function monthCount() { return 2; }
      function render(keepFocus) {
        body.innerHTML = '';
        var prev = doc.createElement('button');
        prev.type = 'button';
        prev.className = 'a-round m-cal__nav -prev';
        prev.setAttribute('aria-label', 'Previous month');
        prev.innerHTML = '<svg class="a-icon" aria-hidden="true"><use href="#i-chev-left"/></svg>';
        prev.disabled = view.getFullYear() === t0.getFullYear() && view.getMonth() === t0.getMonth();
        prev.addEventListener('click', function () { shift(-1); });
        var next = doc.createElement('button');
        next.type = 'button';
        next.className = 'a-round m-cal__nav -next';
        next.setAttribute('aria-label', 'Next month');
        next.innerHTML = '<svg class="a-icon" aria-hidden="true"><use href="#i-chev-right"/></svg>';
        next.disabled = new Date(view.getFullYear(), view.getMonth() + monthCount(), 1) > last;
        next.addEventListener('click', function () { shift(1); });
        body.appendChild(prev);
        body.appendChild(next);
        var months = doc.createElement('div');
        months.className = 'm-cal__months';
        for (var m = 0; m < monthCount(); m++) months.appendChild(month(new Date(view.getFullYear(), view.getMonth() + m, 1)));
        body.appendChild(months);
        paint();
        if (keepFocus && focusDay) {
          var b = $('[data-day="' + iso(focusDay) + '"]', body);
          if (b) b.focus();
        }
      }
      function month(first) {
        var wrap = doc.createElement('div');
        var title = doc.createElement('h3');
        title.className = 'm-cal__title';
        title.id = seg.id || (cal.getAttribute('data-cal') + '-' + iso(first));
        title.textContent = MONTHS[first.getMonth()] + ' ' + first.getFullYear();
        wrap.appendChild(title);
        var grid = doc.createElement('div');
        grid.className = 'm-cal__grid';
        grid.setAttribute('role', 'group');
        grid.setAttribute('aria-labelledby', title.id);
        ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (d, i) {
          var c = doc.createElement('span');
          c.className = 'm-cal__dow';
          c.setAttribute('aria-hidden', 'true');
          c.title = DAYS[i];
          c.textContent = d;
          grid.appendChild(c);
        });
        for (var i = 0; i < first.getDay(); i++) {
          var blank = doc.createElement('span');
          blank.className = 'm-cal__cell';
          grid.appendChild(blank);
        }
        var n = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
        for (var d = 1; d <= n; d++) {
          var day = new Date(first.getFullYear(), first.getMonth(), d);
          var cell = doc.createElement('span');
          cell.className = 'm-cal__cell';
          var b = doc.createElement('button');
          b.type = 'button';
          b.className = 'm-cal__day' + (sameDay(day, t0) ? ' is-today' : '');
          b.textContent = d;
          b.setAttribute('data-day', iso(day));
          b._date = day;
          b.disabled = day < t0 || day > last;
          b.tabIndex = -1;
          cell.appendChild(b);
          grid.appendChild(cell);
        }
        wrap.appendChild(grid);
        return wrap;
      }
      function rangeEnd() { return end || (start && hover && hover > start ? hover : null); }
      function paint() {
        var e2 = single ? null : rangeEnd();
        var buttons = $$('.m-cal__day', body);
        var tabbable = null;
        buttons.forEach(function (b) {
          var d = b._date, cell = b.parentNode;
          var isStart = sameDay(d, start), isEnd = !single && sameDay(d, end);
          var inBand = !single && start && e2 && d >= start && d <= e2;
          /* the band never pokes past a circle at a row's edge: no half-band out of a
             Saturday start or into a Sunday end (round 3, critic: a 2px nub) */
          if (inBand && ((isStart && d.getDay() === 6) || (sameDay(d, e2) && d.getDay() === 0))) inBand = false;
          cell.classList.toggle('is-band', !!inBand && !sameDay(start, e2));
          cell.classList.toggle('is-rowStart', d.getDay() === 0 || d.getDate() === 1);
          cell.classList.toggle('is-rowEnd', d.getDay() === 6 || d.getDate() === new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
          cell.classList.toggle('is-start', isStart);
          cell.classList.toggle('is-end', !!e2 && sameDay(d, e2));
          b.setAttribute('aria-pressed', isStart || isEnd ? 'true' : 'false');
          var label = longLabel(d);
          if (isStart) label += kind === 'hotels' ? ', check-in' : ', departure';
          if (isEnd) label += kind === 'hotels' ? ', check-out' : ', return';
          if (sameDay(d, t0)) label += ', today';
          b.setAttribute('aria-label', label);
          if (!b.disabled && (sameDay(d, focusDay) || (!tabbable && !focusDay))) tabbable = b;
        });
        if (!tabbable) tabbable = buttons.filter(function (b) { return !b.disabled; })[0];
        buttons.forEach(function (b) { b.tabIndex = b === tabbable ? 0 : -1; });
      }
      function shift(n) {
        view = new Date(view.getFullYear(), view.getMonth() + n, 1);
        if (focusDay) {
          var lastShown = new Date(view.getFullYear(), view.getMonth() + monthCount(), 0);
          if (focusDay < view || focusDay > lastShown) focusDay = null;
        }
        render(false);
      }
      function update() {
        startIn.value = iso(start);
        endIn.value = single ? '' : iso(end);
        /* compact in the cell ("Nov 20 to 27"), full in the hint (round 2, critic) */
        var text;
        if (!start) text = 'Add dates';
        else if (single) text = short(start) + ', one way';
        else if (!end) text = 'From ' + short(start);
        else text = range(start, end);
        valueEl.textContent = text;
        valueEl.classList.toggle('is-set', !!start);
        clearBtn.disabled = !start;
        var n = start && end ? nights() : 0;
        var stay = n === 0 ? 'same day' : n + (n === 1 ? ' night' : ' nights');
        if (kind === 'hotels') hint.textContent = !start ? 'Choose your check-in date' : !end ? 'Now choose your check-out date' : short(start) + ' to ' + short(end) + ', ' + stay;
        else hint.textContent = !start ? 'Choose your departure date' : single ? 'Departing ' + DAYS[start.getDay()] + ', ' + short(start) : !end ? 'Now choose your return date' : short(start) + ' to ' + short(end) + ', ' + stay;
        var field = $('button[data-field]', seg);
        if (field && start && (single || end)) api.clearInvalid(field);
      }
      function nights() { return Math.round((end - start) / 864e5); }
      function pick(d) {
        if (single) { start = d; end = null; }
        else if (!start || end || d < start || (minNights && sameDay(d, start))) {
          if (start && !end && minNights && sameDay(d, start)) return;
          start = d; end = null;
        } else { end = d; }
        hover = null;
        focusDay = d;
        paint();
        update();
      }
      body.addEventListener('click', function (e) {
        var b = e.target.closest('.m-cal__day');
        if (!b || b.disabled) return;
        /* no focus() here: a pointer pick leaves focus on the cell, so no
           keyboard ring appears on the day; the arrows still start from it */
        pick(b._date);
      });
      body.addEventListener('mouseover', function (e) {
        var b = e.target.closest('.m-cal__day');
        if (!start || end || single) return;
        hover = b && !b.disabled ? b._date : null;
        paint();
      });
      body.addEventListener('mouseleave', function () { if (hover) { hover = null; paint(); } });
      body.addEventListener('keydown', function (e) {
        var b = e.target.closest('.m-cal__day');
        if (!b) return;
        var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
        if (!step) return;
        e.preventDefault();
        var d = addDays(b._date, step);
        if (d < t0 || d > last) return;
        focusDay = d;
        var lastShown = new Date(view.getFullYear(), view.getMonth() + monthCount(), 0);
        if (d < view) view = new Date(d.getFullYear(), d.getMonth(), 1);
        else if (d > lastShown) view = new Date(d.getFullYear(), d.getMonth() - monthCount() + 1, 1);
        else { paint(); var nb = $('[data-day="' + iso(d) + '"]', body); if (nb) nb.focus(); return; }
        render(true);
      });
      clearBtn.addEventListener('click', function () { start = end = hover = parked = null; focusDay = null; paint(); update(); });
      if (trip) {
        trip.addEventListener('click', function (e) {
          var b = e.target.closest('[data-trip-type]');
          if (!b) return;
          setPressed(trip, b);
          var wasSingle = single;
          single = b.getAttribute('data-trip-type') === 'oneway';
          /* one way parks the return date; switching back restores it (round 3, critic) */
          if (single && !wasSingle) { parked = end; end = null; }
          else if (!single && wasSingle && parked && start && parked >= start) { end = parked; parked = null; }
          paint();
          update();
        });
      }
      var prevOpen = seg._onopen;
      seg._onopen = function () {
        if (prevOpen) prevOpen();
        if (start) view = new Date(start.getFullYear(), start.getMonth(), 1);
        render(false);
        if (trip) placeThumb(trip);
      };
      render(false);
    }

    /* ---- travelers, guests, rooms and cabin ---- */
    function makePeople(form, kind) {
      var seg = $('[data-seg="who"]', form);
      if (!seg) return;
      var valueEl = $('[data-value]', seg);
      var steppers = $$('[data-stepper]', seg);
      var state = {};
      steppers.forEach(function (s) { state[s.getAttribute('data-stepper')] = parseInt($('input', s).value, 10) || 0; });

      function limits(name) {
        var s = $('[data-stepper="' + name + '"]', seg);
        var min = parseInt(s.getAttribute('data-min'), 10), max = parseInt(s.getAttribute('data-max'), 10);
        if (kind === 'flights') {
          /* Duffel rules: at most 9 seated passengers, one lap infant per adult */
          if (name === 'adults') { min = Math.max(min, state.infants); max = Math.min(max, 9 - state.children); }
          if (name === 'children') max = Math.min(max, 9 - state.adults);
          if (name === 'infants') max = Math.min(max, state.adults);
        } else {
          if (name === 'adults') min = Math.max(min, state.rooms);
          if (name === 'rooms') max = Math.min(max, state.adults);
        }
        return { min: min, max: max };
      }
      function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
      function paint() {
        steppers.forEach(function (s) {
          var name = s.getAttribute('data-stepper'), l = limits(name);
          $('[data-count]', s).textContent = state[name];
          $('input', s).value = state[name];
          $('[data-step="-1"]', s).disabled = state[name] <= l.min;
          $('[data-step="1"]', s).disabled = state[name] >= l.max;
        });
        var parts;
        if (kind === 'flights') {
          /* short enough for the cell: "2 adults" alone, "3 travelers" once children or infants join */
          var all = state.adults + state.children + state.infants;
          parts = [state.children || state.infants ? plural(all, 'traveler', 'travelers') : plural(state.adults, 'adult', 'adults')];
          var cab = $('input[name="cabin"]:checked', seg);
          parts.push(cab ? (cab.parentNode.getAttribute('data-short') || cab.parentNode.textContent.trim()) : 'Economy');
        } else {
          parts = [plural(state.adults, 'adult', 'adults')];
          if (state.children) parts.push(plural(state.children, 'child', 'children'));
          parts.push(plural(state.rooms, 'room', 'rooms'));
        }
        valueEl.textContent = parts.join(', ');
      }
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('[data-step]');
        if (!b || b.disabled) return;
        var s = b.closest('[data-stepper]'), name = s.getAttribute('data-stepper');
        var l = limits(name);
        state[name] = clamp(state[name] + parseInt(b.getAttribute('data-step'), 10), l.min, l.max);
        paint();
        if (b.disabled) { var other = $('[data-step="' + (-parseInt(b.getAttribute('data-step'), 10)) + '"]', s); if (other) other.focus(); }
      });
      seg.addEventListener('change', function (e) { if (e.target.name === 'cabin') paint(); });
      paint();
    }

    raf(placeAllThumbs);
  }

  /* =====================================================================
     The cabin wall: the blinds rise once on load (the one load moment),
     then the view drifts sideways a little slower than the page, like
     the ground passing. Both off under reduced motion.
     ===================================================================== */
  (function () {
    var cabin = $('[data-cabin-wall]');
    if (!cabin) return;
    var views = $$('[data-view]', cabin);
    function show() { cabin.classList.add('is-shown'); }
    if (REDUCE.matches) show();
    else {
      /* wait for the first paint with the blinds down, then release them */
      var first = views[0];
      var go = function () { raf(function () { raf(show); }); };
      if (first && !first.complete) {
        first.addEventListener('load', go, { once: true });
        first.addEventListener('error', go, { once: true });
        setTimeout(go, 1200); /* never hold the view behind the blinds for long */
      } else go();
    }

    var hero = cabin.closest('section') || cabin;
    var inView = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; }).observe(hero);
    }
    function drift(y) {
      if (REDUCE.matches || !inView) return;
      var w = views[0] ? views[0].offsetWidth : 0;
      var x = Math.min(Math.max(y, 0) * DRIFT_RATE, DRIFT / 100 * w);
      cabin.style.setProperty('--drift-x', (-x).toFixed(1) + 'px');
    }
    scrollJobs.push(drift);
    drift(window.pageYOffset);
    onMedia(REDUCE, function () { if (REDUCE.matches) { show(); cabin.style.removeProperty('--drift-x'); } });
  })();

  /* ---- resize: debounced, ignores height-only changes (phone URL bar) ---- */
  var lastW = window.innerWidth, rt;
  window.addEventListener('resize', function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(rt);
    rt = setTimeout(placeAllThumbs, 120);
  });
})();
