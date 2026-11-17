/* =====================================================================
   travel-booking (working name Overwing, a placeholder): the inline sprite
   Icons (i-<name>, used through components/Icon.tsx) and the two colour
   grade filters, one per palette (navy, cabin; revision 2026-11-11). tokens.css
   picks one with --fx-grade.
   The filters are written by prototype/tools/grade_filter.py; paste a
   regenerated pair here unchanged. Symbols and filters are the approved
   prototype's, plus i-tick for the disc ticks and, from session 2, the
   amenity, filter, map, copy, print and state icons the inner pages use.
   ===================================================================== */
const SPRITE = `
  <defs>
    
    <filter id="fx-grade-navy" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix in="SourceGraphic" type="saturate" values="0.96" result="base"/><feColorMatrix in="SourceGraphic" type="saturate" values="0" result="grey"/><feComponentTransfer in="grey" result="map"><feFuncR type="table" tableValues="0.024 0.028 0.033 0.038 0.043 0.048 0.067 0.108 0.149 0.190 0.231 0.310 0.414 0.519 0.624 0.728 0.796 0.855 0.914 0.957 1.000"/><feFuncG type="table" tableValues="0.078 0.095 0.111 0.127 0.143 0.159 0.196 0.265 0.333 0.402 0.471 0.544 0.620 0.696 0.772 0.848 0.890 0.923 0.957 0.978 1.000"/><feFuncB type="table" tableValues="0.165 0.189 0.212 0.236 0.260 0.284 0.318 0.367 0.416 0.465 0.514 0.576 0.647 0.718 0.789 0.860 0.899 0.930 0.961 0.980 1.000"/></feComponentTransfer><feComposite in="base" in2="map" operator="arithmetic" k1="0" k2="0.80" k3="0.20" k4="0"/></filter>
    <filter id="fx-grade-cabin" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix in="SourceGraphic" type="saturate" values="0.96" result="base"/><feColorMatrix in="SourceGraphic" type="saturate" values="0" result="grey"/><feComponentTransfer in="grey" result="map"><feFuncR type="table" tableValues="0.071 0.079 0.088 0.096 0.105 0.113 0.122 0.184 0.245 0.307 0.369 0.431 0.531 0.631 0.731 0.831 0.880 0.917 0.953 0.976 1.000"/><feFuncG type="table" tableValues="0.114 0.133 0.153 0.173 0.192 0.212 0.231 0.296 0.362 0.427 0.492 0.557 0.606 0.656 0.705 0.755 0.802 0.848 0.894 0.939 0.984"/><feFuncB type="table" tableValues="0.125 0.147 0.169 0.190 0.212 0.233 0.255 0.319 0.384 0.448 0.512 0.576 0.620 0.664 0.708 0.752 0.797 0.841 0.886 0.933 0.980"/></feComponentTransfer><feComposite in="base" in2="map" operator="arithmetic" k1="0" k2="0.82" k3="0.18" k4="0"/></filter>
  </defs>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></symbol>
  <symbol id="i-ticket" viewBox="0 0 24 24"><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z"/><path d="M14.5 6.5v11" stroke-dasharray="1.6 2"/></symbol>
  <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.3 3.8-5 7-5s5.8 1.7 7 5"/></symbol>
  <symbol id="i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9.8 9.6a2.3 2.3 0 0 1 4.4.8c0 1.6-2.2 1.9-2.2 3.4"/><path d="M12 16.6v.2"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h14"/></symbol>
  <symbol id="i-depart" viewBox="0 0 24 24"><path d="M3 19h18"/><path d="M5.5 14.5l12.8-4.6a1.6 1.6 0 0 0-1-3l-4 1.4-5-3.3-1.7.6 3 3.9-3.2 1.1-2-1.4-1.3.5 1.7 3.4z"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 20s6-5.4 6-10a6 6 0 0 0-12 0c0 4.6 6 10 6 10z"/><circle cx="12" cy="10" r="2.2"/></symbol>
  <symbol id="i-cal" viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/></symbol>
  <symbol id="i-people" viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><path d="M3.5 18.5c.9-2.7 2.9-4.2 5.5-4.2s4.6 1.5 5.5 4.2"/><path d="M15.5 6.4a3 3 0 0 1 0 5.4M17.5 14.6c1.3.7 2.3 2 2.8 3.9"/></symbol>
  <symbol id="i-bed" viewBox="0 0 24 24"><path d="M3.5 18.5v-11M3.5 14h17v4.5M20.5 14v-2.5a3 3 0 0 0-3-3H11V14"/><circle cx="7.3" cy="11" r="1.8"/></symbol>
  <symbol id="i-plane" viewBox="0 0 24 24"><path d="M10.6 4.6a1.4 1.4 0 0 1 2.8 0v4.9l6.6 3.9v1.9l-6.6-2v3.9l2 1.5v1.6L12 19.4l-3.4.9v-1.6l2-1.5v-3.9L4 15.3v-1.9l6.6-3.9z"/></symbol>
  <symbol id="i-city" viewBox="0 0 24 24"><path d="M3.5 20h17M5.5 20V10l5-2.5V20M10.5 20V5l8 3v12"/><path d="M13.5 10.5h2M13.5 13.5h2M13.5 16.5h2M7.5 13h1M7.5 16h1"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/></symbol>
  <symbol id="i-chev-left" viewBox="0 0 24 24"><path d="M14.5 6l-6 6 6 6"/></symbol>
  <symbol id="i-chev-right" viewBox="0 0 24 24"><path d="M9.5 6l6 6-6 6"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></symbol>
  <symbol id="i-minus" viewBox="0 0 24 24"><path d="M6 12h12"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2.5"/><path d="M4.8 7.2l7.2 5.6 7.2-5.6"/></symbol>
  <symbol id="i-tick" viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 11v5M12 8v.2"/></symbol>
  <symbol id="i-wifi" viewBox="0 0 24 24"><path d="M4 9.5a12 12 0 0 1 16 0M7 12.8a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0"/><circle cx="12" cy="18.6" r=".6"/></symbol>
  <symbol id="i-cup" viewBox="0 0 24 24"><path d="M5 9h11v4.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 13.5z"/><path d="M16 10.5h1.5a2.25 2.25 0 0 1 0 4.5H16M8 4.5v2M11 4.5v2"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.8"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6L18 18M6 18l1.4-1.4M16.6 7.4L18 6"/></symbol>
  <symbol id="i-dumbbell" viewBox="0 0 24 24"><path d="M7 8v8M17 8v8M4.5 10v4M19.5 10v4M7 12h10"/></symbol>
  <symbol id="i-glass" viewBox="0 0 24 24"><path d="M6 5h12l-6 7z"/><path d="M12 12v6.5M8.5 19h7"/></symbol>
  <symbol id="i-leaf" viewBox="0 0 24 24"><path d="M5.5 18.5C5 11 9 5.5 19 5c.2 8-4.5 13.5-13.5 13.5z"/><path d="M5.5 18.5L13 11"/></symbol>
  <symbol id="i-pot" viewBox="0 0 24 24"><path d="M5 10h14v5.5a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 5 15.5z"/><path d="M3 10h18M9.5 7h5"/></symbol>
  <symbol id="i-bag" viewBox="0 0 24 24"><rect x="5.5" y="8" width="13" height="11" rx="2"/><path d="M9.5 8V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 6v2M9 19v1.5M15 19v1.5"/></symbol>
  <symbol id="i-wash" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2.5"/><circle cx="12" cy="13" r="3.8"/><path d="M8 7h.2M10.5 7h.2"/></symbol>
  <symbol id="i-snow" viewBox="0 0 24 24"><path d="M12 4v16M5.1 8l13.8 8M5.1 16l13.8-8M9.5 5.5L12 7l2.5-1.5M9.5 18.5L12 17l2.5 1.5"/></symbol>
  <symbol id="i-bath" viewBox="0 0 24 24"><path d="M4 12h16v2.5a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 14.5z"/><path d="M6.5 12V6.5a2 2 0 0 1 3.7-1M7 19l-1 1.5M17 19l1 1.5"/></symbol>
  <symbol id="i-lift" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9.5 10.5L12 8l2.5 2.5M9.5 13.5L12 16l2.5-2.5"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 4.5l2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 16.3l-4.6 2.4.9-5.1-3.8-3.6 5.2-.8z"/></symbol>
  <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></symbol>
  <symbol id="i-sort" viewBox="0 0 24 24"><path d="M8 5v14M8 19l-3-3M8 19l3-3M16 19V5M16 5l-3 3M16 5l3 3"/></symbol>
  <symbol id="i-map" viewBox="0 0 24 24"><path d="M4 6.5l5-2 6 2 5-2v13l-5 2-6-2-5 2z"/><path d="M9 4.5v13M15 6.5v13"/></symbol>
  <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 7h11M9 12h11M9 17h11M4.5 7h.2M4.5 12h.2M4.5 17h.2"/></symbol>
  <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6.5A1.5 1.5 0 0 0 14.5 5h-8A1.5 1.5 0 0 0 5 6.5v8A1.5 1.5 0 0 0 6.5 16H8"/></symbol>
  <symbol id="i-print" viewBox="0 0 24 24"><path d="M7 9V4.5h10V9M7 16.5H5.5A1.5 1.5 0 0 1 4 15v-4.5A1.5 1.5 0 0 1 5.5 9h13a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H17"/><path d="M7 13.5h10V20H7z"/></symbol>
  <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 4.5l8.5 15h-17z"/><path d="M12 10v4.2M12 16.8v.2"/></symbol>
  <symbol id="i-card" viewBox="0 0 24 24"><rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M3.5 10h17M7 14.5h3"/></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M18.5 14.5A7 7 0 0 1 9.5 5.5a7 7 0 1 0 9 9z"/></symbol>
  <symbol id="i-swap" viewBox="0 0 24 24"><path d="M5 9h13M15 6l3 3-3 3M19 15H6M9 12l-3 3 3 3"/></symbol>
  <symbol id="i-edit" viewBox="0 0 24 24"><path d="M5 19l1-4 9.5-9.5a2.1 2.1 0 0 1 3 3L9 18z"/><path d="M14 7l3 3"/></symbol>
  <symbol id="i-nosmoke" viewBox="0 0 24 24"><path d="M3.5 13.5h11v3h-11zM17.5 13.5v3M20 13.5v3M17 5.5c0 2 2.5 2.5 2.5 5"/><path d="M4.5 4.5l15 15"/></symbol>
  <symbol id="i-dryer" viewBox="0 0 24 24"><circle cx="9.5" cy="9.5" r="5"/><circle cx="9.5" cy="9.5" r="1.6"/><path d="M14.5 8h5v3h-5M10.5 14.5l1.5 6h3"/></symbol>
  <symbol id="i-chev-down" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/></symbol>
  <!-- round 3, Developer A (spec 0.3): same 24 grid and stroke -->
  <symbol id="i-trend-down" viewBox="0 0 24 24"><path d="M4 7.5l6 6 3.5-3.5 6.5 6.5M14.5 16.5H20V11"/></symbol>
  <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3.8l6.5 2.4v5.1c0 4.2-2.7 7.4-6.5 8.9-3.8-1.5-6.5-4.7-6.5-8.9V6.2z"/><path d="M9.2 12l2 2 3.8-4"/></symbol>
  <symbol id="i-history" viewBox="0 0 24 24"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.8V9h4.2M12 8v4.2l2.8 1.8"/></symbol>
  <symbol id="i-route" viewBox="0 0 24 24"><circle cx="5.5" cy="17" r="2"/><circle cx="18.5" cy="17" r="2"/><path d="M7 15.5C9 9 15 9 17 15.5"/></symbol>
`;

export function Sprite() {
  return <svg className="a-sprite" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: SPRITE }} />;
}
