/* =========================================================
   Green Labs — script.js (FULL REPLACEMENT)
   Version: v103
   Keeps all existing behavior + fixes:
   - Drawer no longer "stuck open" on load (forces closed state)
   - Deals buttons: scroll to Deals section AND auto-open accordion
   - Shop buttons: scroll to Shop section AND reveal menuWrap
   - data-scroll links: smooth scroll with sticky offset
   - Status strip click toggles hours popover (desktop) and works even if hoursBtn hidden on mobile
   - Maps smart link (iOS/Android)
   - Deals.json render (supports category.items OR category.groups format)
   - Carousel dots + autoplay pause on hover
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // ===== Helpers =====
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  // Footer year
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';

  function isIOS(){ return /iPad|iPhone|iPod/.test(navigator.userAgent || ''); }
  function isAndroid(){ return /Android/.test(navigator.userAgent || ''); }

  function smartMapHref(address){
    const q = encodeURIComponent(address);
    if (isIOS()) return `maps://?q=${q}`;
    if (isAndroid()) return `geo:0,0?q=${q}`;
    return `https://www.google.com/maps?q=${q}`;
  }

  // Smooth scroll with sticky height offset
  function smoothTo(el){
    if (!el) return;
    const stickyH = $('.sticky')?.getBoundingClientRect().height || 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (stickyH + 8);
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  // data-scroll supports: data-scroll="#id" OR data-scroll (with href="#id")
  $$('[data-scroll]').forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault();
      const target = node.getAttribute('data-scroll') || node.getAttribute('href');
      const sel = (target && target.startsWith('#')) ? target : null;
      const el = sel ? $(sel) : null;
      if (el) smoothTo(el);
      // also close drawer if click came from inside
      if (node.closest('#navDrawer')) closeDrawer();
    });
  });

  // ===== Drawer =====
  const openMenuBtn = $('[data-open-menu]');
  const closeMenuBtn = $('[data-close-menu]');
  const navDrawer = $('#navDrawer');
  const menuOverlay = $('#menuOverlay');

  function forceDrawerClosed(){
    if (navDrawer) navDrawer.hidden = true;
    if (menuOverlay) menuOverlay.hidden = true;
    if (openMenuBtn) openMenuBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  function openDrawer(){
    if (!navDrawer || !menuOverlay || !openMenuBtn) return;
    navDrawer.hidden = false;
    menuOverlay.hidden = false;
    openMenuBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(){
    if (!navDrawer || !menuOverlay || !openMenuBtn) return;
    navDrawer.hidden = true;
    menuOverlay.hidden = true;
    openMenuBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }

  // Hard reset on load (prevents "stuck open" from prior states)
  forceDrawerClosed();

  if (openMenuBtn && navDrawer && menuOverlay){
    openMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navDrawer.hidden ? openDrawer() : closeDrawer();
    });
  }
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeDrawer(); });
  if (menuOverlay) menuOverlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') { closeDrawer(); closeHours(); } });

  // Drawer click routing (buttons inside drawer)
  if (navDrawer){
    navDrawer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.hasAttribute('data-open-deals')) { closeDrawer(); openDeals(true); return; }
      if (btn.hasAttribute('data-open-shop')) { closeDrawer(); openShop(true); return; }

      const hash = btn.getAttribute('data-scroll');
      if (hash && hash.startsWith('#')) {
        closeDrawer();
        const el = $(hash);
        if (el) smoothTo(el);
      }
    });
  }

  // ===== Deals =====
  const dealCard = $('#dealCard');
  const dealBody = $('#dealBody');
  const dealList = $('#dealList');
  const closeDealsBtn = $('#closeDeals');

  function expandDeals(){
    if (!dealCard || !dealBody) return;
    dealCard.setAttribute('aria-expanded','true');
    dealBody.classList.remove('collapsed');
  }

  function collapseDeals(){
    if (!dealCard || !dealBody) return;
    dealCard.setAttribute('aria-expanded','false');
    dealBody.classList.add('collapsed');
  }

  function toggleDeals(){
    const isOpen = dealCard?.getAttribute('aria-expanded') === 'true';
    isOpen ? collapseDeals() : expandDeals();
  }

  function openDeals(scrollAlso){
    const dealsSection = $('#deals');
    if (scrollAlso && dealsSection) smoothTo(dealsSection);
    // wait a beat so scroll starts, then open
    window.setTimeout(expandDeals, scrollAlso ? 220 : 0);
  }

  // Any element with data-open-deals => scroll + open
  $$('[data-open-deals]').forEach(el => {
    el.addEventListener('click', (e)=>{ e.preventDefault(); openDeals(true); });
  });

  if (dealCard && dealBody){
    dealCard.addEventListener('click', (e)=> {
      if (e.target.closest('button,a,input,textarea,select,label')) return;
      toggleDeals();
    });
    dealCard.addEventListener('keydown', (e)=> {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDeals(); }
    });
  }
  if (closeDealsBtn) closeDealsBtn.addEventListener('click', (e)=> { e.stopPropagation(); collapseDeals(); });

  // deals.json render
  (function loadDeals(){
    if (!dealList) return;

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));

    function renderDeals(data){
      if (!Array.isArray(data)) {
        dealList.innerHTML = '<li>Deals unavailable right now.</li>';
        return;
      }

      const html = data.map(cat => {
        const catName = esc(cat.category ?? 'Deals');

        // Format A: { category, groups: [{title, items:[]}] }
        if (Array.isArray(cat.groups)) {
          const groups = cat.groups.map(g => `
            <div style="margin:10px 0 14px;">
              <div style="font-weight:900;margin:6px 0 4px;">${esc(g.title ?? '')}</div>
              <ul style="margin:0;padding-left:18px;">
                ${(g.items||[]).map(it => `<li>${esc(it)}</li>`).join('')}
              </ul>
            </div>
          `).join('');

          return `<li style="margin:12px 0;">
            <div style="font-weight:900;letter-spacing:.06em;">${catName}</div>
            ${groups}
          </li>`;
        }

        // Format B: { category, items:[] }
        return `<li style="margin:12px 0;">
          <div style="font-weight:900;letter-spacing:.06em;">${catName}</div>
          <ul style="margin:8px 0 0;padding-left:18px;">
            ${(cat.items||[]).map(it => `<li>${esc(it)}</li>`).join('')}
          </ul>
        </li>`;
      }).join('');

      dealList.innerHTML = html + `<div style="margin-top:10px;font-weight:900;opacity:.72;">All prices include tax.</div>`;
    }

    fetch('deals.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(renderDeals)
      .catch(() => { dealList.innerHTML = '<li>Deals unavailable right now.</li>'; });
  })();

  // ===== Shop reveal =====
  const menuWrap = $('#menuWrap');

  function openShop(scrollAlso){
    if (menuWrap) menuWrap.hidden = false;
    const shop = $('#shop');
    if (scrollAlso && shop) smoothTo(shop);
  }

  // Any element with data-open-shop => reveal + scroll
  $$('[data-open-shop]').forEach(el => {
    el.addEventListener('click', (e)=>{ e.preventDefault(); openShop(true); });
  });

  // ===== Hours (popover + status strip) =====
  const hoursBtn = $('#hoursBtn');
  const hoursPopover = $('#hoursPopover');
  const hoursOverlay = $('#hoursOverlay');
  const hoursList = $('#hoursList');
  const mapsLink = $('#mapsLink');

  const statusStrip = $('#statusStrip');
  const statusText = $('#statusText');
  const statusDot = $('#statusDot');
  const statusAddr = $('#statusAddr');

  // Set address text + maps link
  if (statusAddr) statusAddr.textContent = '10701 Madison St, Luna Pier';
  if (mapsLink) {
    const href = smartMapHref(ADDRESS);
    mapsLink.href = href;
    if (/^https?:/i.test(href)) { mapsLink.target = '_blank'; mapsLink.rel = 'noopener'; }
  }

  const HOURS = [
    { d:'Sunday', open:9, close:21 },
    { d:'Monday', open:9, close:21 },
    { d:'Tuesday', open:9, close:21 },
    { d:'Wednesday', open:9, close:21 },
    { d:'Thursday', open:9, close:21 },
    { d:'Friday', open:9, close:21 },
    { d:'Saturday', open:9, close:21 },
  ];

  const fmt = (h) => `${((h+11)%12)+1}${h>=12?'PM':'AM'}`;

  function statusNow(){
    const now = new Date();
    const idx = now.getDay();
    const hour = now.getHours() + now.getMinutes()/60;
    const { open, close } = HOURS[idx];
    const openSoon = hour >= open - 0.5 && hour < open;
    const closingSoon = hour >= close - 0.5 && hour < close;
    const isOpen = hour >= open && hour < close;
    return { open, close, isOpen, openSoon, closingSoon };
  }

  function paintStatus(){
    const s = statusNow();
    let label = 'OPEN';
    let dot = 'open';

    if (s.isOpen && s.closingSoon){ label = 'CLOSING SOON'; dot = 'soon'; }
    else if (!s.isOpen && s.openSoon){ label = 'OPENING SOON'; dot = 'soon'; }
    else if (s.isOpen){ label = 'OPEN'; dot = 'open'; }
    else { label = 'CLOSED'; dot = 'closed'; }

    if (hoursBtn) hoursBtn.textContent = label;
    if (statusText) statusText.textContent = 'Open daily 9am–9pm';

    if (statusDot){
      statusDot.style.background = dot === 'open' ? '#16a34a' : (dot === 'soon' ? '#f59e0b' : '#ef4444');
      statusDot.style.boxShadow = dot === 'open'
        ? '0 0 0 3px rgba(22,163,74,.18)'
        : (dot === 'soon' ? '0 0 0 3px rgba(245,158,11,.20)' : '0 0 0 3px rgba(239,68,68,.18)');
    }
  }

  function renderHours(){
    if (!hoursList) return;
    const today = new Date().getDay();
    hoursList.innerHTML = HOURS.map((h,i)=>`
      <li class="${i===today?'is-today':''}">
        <span>${h.d}</span>
        <span>${fmt(h.open)} – ${fmt(h.close)}</span>
      </li>
    `).join('');
  }

  function openHours(){
    if (!hoursPopover || !hoursOverlay) return;
    hoursPopover.hidden = false;
    hoursOverlay.hidden = false;
    if (hoursBtn) hoursBtn.setAttribute('aria-expanded','true');
  }

  function closeHours(){
    if (!hoursPopover || !hoursOverlay) return;
    hoursPopover.hidden = true;
    hoursOverlay.hidden = true;
    if (hoursBtn) hoursBtn.setAttribute('aria-expanded','false');
  }

  function toggleHours(){
    if (!hoursPopover) return;
    hoursPopover.hidden ? openHours() : closeHours();
  }

  // Initialize hours system
  paintStatus();
  renderHours();
  window.setInterval(paintStatus, 60*1000);

  // Hours button (desktop/tablet)
  if (hoursBtn) hoursBtn.addEventListener('click', toggleHours);
  if (hoursOverlay) hoursOverlay.addEventListener('click', closeHours);

  // Status strip should open hours even when hoursBtn is hidden on mobile
  if (statusStrip) statusStrip.addEventListener('click', toggleHours);

  // ===== Carousel =====
  (function carousel(){
    const root = document.querySelector('[data-carousel]');
    if (!root) return;

    const slides = [...root.querySelectorAll('.slide')];
    const dots = root.querySelector('.dots');
    const delay = parseInt(root.getAttribute('data-autoplay') || '6500', 10);

    if (!slides.length || !dots) return;

    let i = slides.findIndex(s => s.classList.contains('is-active'));
    if (i < 0) i = 0;

    dots.innerHTML = slides.map((_, idx) =>
      `<button class="dotbtn ${idx===i?'is-active':''}" type="button" aria-label="Go to slide ${idx+1}"></button>`
    ).join('');

    const dotBtns = [...dots.querySelectorAll('.dotbtn')];

    function go(n){
      slides[i].classList.remove('is-active');
      dotBtns[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      dotBtns[i].classList.add('is-active');
    }

    dotBtns.forEach((b, idx) => b.addEventListener('click', () => go(idx)));

    let t = setInterval(() => go(i+1), delay);
    root.addEventListener('mouseenter', () => clearInterval(t));
    root.addEventListener('mouseleave', () => { clearInterval(t); t = setInterval(() => go(i+1), delay); });
  })();
});
