// Green Labs — New Build
// - Mobile condensed: fewer elements before Deals
// - Deals button: scroll to Deals + auto-open
// - Shop Now: reveals menu placeholder + scroll
// - Hours pill: popover + status strip sync
// - Carousel: simple autoplay

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';
  const PHONE = '+17348000024';

  // --- Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function isIOS(){ return /iPad|iPhone|iPod/.test(navigator.userAgent || ''); }
  function isAndroid(){ return /Android/.test(navigator.userAgent || ''); }
  function smartMapHref(address){
    const q = encodeURIComponent(address);
    if (isIOS()) return `maps://?q=${q}`;
    if (isAndroid()) return `geo:0,0?q=${q}`;
    return `https://www.google.com/maps?q=${q}`;
  }

  function smoothTo(el){
    if (!el) return;
    const topbarH = $('.topbar')?.getBoundingClientRect().height || 56;
    const stickyH = $('.sticky')?.getBoundingClientRect().height || 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (topbarH + stickyH + 8);
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  // --- Drawer
  (function drawer(){
    const openBtn = $('[data-open-menu]');
    const closeBtn = $('[data-close-menu]');
    const drawer = $('#navDrawer');
    const ovl = $('#menuOverlay');
    if (!openBtn || !drawer || !ovl) return;

    const open = () => {
      drawer.hidden = false;
      ovl.hidden = false;
      openBtn.setAttribute('aria-expanded','true');
    };
    const close = () => {
      drawer.hidden = true;
      ovl.hidden = true;
      openBtn.setAttribute('aria-expanded','false');
    };

    openBtn.addEventListener('click', (e) => { e.preventDefault(); drawer.hidden ? open() : close(); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    ovl.addEventListener('click', close);
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });

    // drawer buttons
    drawer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      if (btn.hasAttribute('data-open-deals')) { close(); openDeals(true); return; }
      if (btn.hasAttribute('data-open-shop')) { close(); openShop(true); return; }

      const hash = btn.getAttribute('data-scroll');
      if (hash) {
        close();
        const el = $(hash);
        if (el) smoothTo(el);
      }
    });
  })();

  // --- Deals (load + expand/collapse)
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
    // open after scroll starts so it "arrives open"
    setTimeout(expandDeals, 200);
  }

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
    fetch('deals.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => renderDeals(data))
      .catch(() => { dealList.innerHTML = '<li>Deals unavailable right now.</li>'; });

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));

    function renderDeals(data){
      // supports your existing DR-style deals.json structure
      const html = data.map(cat => {
        if (Array.isArray(cat.groups)) {
          const groups = cat.groups.map(g => `
            <div style="margin:10px 0 14px;">
              <div style="font-weight:900;margin:6px 0 4px;">${esc(g.title)}</div>
              <ul style="margin:0;padding-left:18px;">
                ${(g.items||[]).map(it => `<li>${esc(it)}</li>`).join('')}
              </ul>
            </div>
          `).join('');
          return `<li style="margin:12px 0;">
            <div style="font-weight:900;letter-spacing:.06em;">${esc(cat.category)}</div>
            ${groups}
          </li>`;
        }
        return `<li style="margin:12px 0;">
          <div style="font-weight:900;letter-spacing:.06em;">${esc(cat.category)}</div>
          <ul style="margin:8px 0 0;padding-left:18px;">
            ${(cat.items||[]).map(it => `<li>${esc(it)}</li>`).join('')}
          </ul>
        </li>`;
      }).join('');
      dealList.innerHTML = html + `<div style="margin-top:10px;font-weight:900;opacity:.72;">All prices include tax.</div>`;
    }
  })();

  // --- Shop (Leafly placeholder reveal)
  const menuWrap = $('#menuWrap');
  function openShop(scrollAlso){
    if (menuWrap) menuWrap.hidden = false;
    const shop = $('#shop');
    if (scrollAlso && shop) smoothTo(shop);
  }

  // wire triggers
  $$('[data-open-deals]').forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); openDeals(true); }));
  $$('[data-open-shop]').forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); openShop(true); }));

  // optional generic scroll
  $$('[data-scroll]').forEach(el => {
    el.addEventListener('click', (e)=> {
      const href = el.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const t = $(href);
        if (t) smoothTo(t);
      }
    });
  });

  // --- Hours pill + popover
  (function hours(){
    const btn = $('#hoursBtn');
    const pop = $('#hoursPopover');
    const ovl = $('#hoursOverlay');
    const list = $('#hoursList');
    const mapsLink = $('#mapsLink');
    const strip = $('#statusStrip');
    const statusText = $('#statusText');
    const statusDot = $('#statusDot');
    const statusAddr = $('#statusAddr');

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
      return { idx, open, close, isOpen, openSoon, closingSoon };
    }

    function paint(){
      if (!btn) return;
      const s = statusNow();
      btn.classList.remove('state-open','state-soon','state-closed');

      let label = 'OPEN';
      let dot = 'open';
      if (s.isOpen && s.closingSoon){
        label = 'CLOSING SOON'; dot = 'soon'; btn.classList.add('state-soon');
      } else if (!s.isOpen && s.openSoon){
        label = 'OPENING SOON'; dot = 'soon'; btn.classList.add('state-soon');
      } else if (s.isOpen){
        label = 'OPEN'; dot = 'open'; btn.classList.add('state-open');
      } else {
        label = 'CLOSED'; dot = 'closed'; btn.classList.add('state-closed');
      }
      btn.textContent = label;

      if (statusText) statusText.textContent = 'Open daily 9am–9pm';
      if (statusDot){
        statusDot.style.background = dot === 'open' ? '#16a34a' : (dot === 'soon' ? '#f59e0b' : '#ef4444');
        statusDot.style.boxShadow = dot === 'open'
          ? '0 0 0 3px rgba(22,163,74,.18)'
          : (dot === 'soon' ? '0 0 0 3px rgba(245,158,11,.20)' : '0 0 0 3px rgba(239,68,68,.18)');
      }
    }

    function renderHours(){
      if (!list) return;
      const today = new Date().getDay();
      list.innerHTML = HOURS.map((h,i)=>`
        <li class="${i===today?'is-today':''}">
          <span>${h.d}</span>
          <span>${fmt(h.open)} – ${fmt(h.close)}</span>
        </li>
      `).join('');
    }

    function openPop(){
      if (!pop || !ovl || !btn) return;
      pop.hidden = false;
      ovl.hidden = false;
      btn.setAttribute('aria-expanded','true');
    }
    function closePop(){
      if (!pop || !ovl || !btn) return;
      pop.hidden = true;
      ovl.hidden = true;
      btn.setAttribute('aria-expanded','false');
    }

    paint(); renderHours();
    setInterval(paint, 60*1000);

    if (btn){
      btn.addEventListener('click', () => (pop?.hidden ? openPop() : closePop()));
    }
    if (ovl) ovl.addEventListener('click', closePop);
    if (strip && btn) strip.addEventListener('click', () => btn.click());
  })();

  // --- Carousel
  (function carousel(){
    const root = $('[data-carousel]');
    if (!root) return;
    const slides = $$('.slide', root);
    if (!slides.length) return;

    let i = slides.findIndex(s => s.classList.contains('is-active'));
    if (i < 0) i = 0;

    let dotsBar = $('.dots', root);
    if (!dotsBar){
      dotsBar = document.createElement('div');
      dotsBar.className = 'dots';
      root.appendChild(dotsBar);
    }

    const dots = slides.map((_,k)=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${k+1}`);
      if (k === i) b.setAttribute('aria-current','true');
      b.addEventListener('click', () => go(k, true));
      dotsBar.appendChild(b);
      return b;
    });

    const delay = parseInt(root.dataset.autoplay || '6500', 10);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t = null;

    function go(n, user){
      const prev = i;
      i = ((n % slides.length) + slides.length) % slides.length;
      if (prev === i) return;
      slides[prev].classList.remove('is-active');
      slides[i].classList.add('is-active');
      dots[prev]?.removeAttribute('aria-current');
      dots[i]?.setAttribute('aria-current','true');
      if (user) restart();
    }
    function start(){
      if (reduced) return;
      stop();
      t = setInterval(()=>go(i+1, false), delay);
    }
    function stop(){
      if (t) { clearInterval(t); t = null; }
    }
    function restart(){ stop(); start(); }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    start();
  })();
});
