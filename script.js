document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';

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

  // ===== Generic scroll buttons =====
  $$('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-scroll');
      const el = target ? $(target) : null;
      if (el) smoothTo(el);
    });
  });

  // ===== Drawer (FORCED CLOSED on load; fixes stuck open) =====
  (function drawer(){
    const openBtn = $('[data-open-menu]');
    const closeBtn = $('[data-close-menu]');
    const drawer = $('#navDrawer');
    const ovl = $('#menuOverlay');
    if (!openBtn || !drawer || !ovl) return;

    // Force closed on load
    drawer.hidden = true;
    ovl.hidden = true;
    openBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';

    const open = () => {
      drawer.hidden = false;
      ovl.hidden = false;
      openBtn.setAttribute('aria-expanded','true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      drawer.hidden = true;
      ovl.hidden = true;
      openBtn.setAttribute('aria-expanded','false');
      document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.hidden ? open() : close();
    });

    if (closeBtn) closeBtn.addEventListener('click', (e)=>{ e.preventDefault(); close(); });
    ovl.addEventListener('click', close);
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });

    // Let drawer buttons trigger actions then close
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

  // ===== Deals (scroll + auto-open) =====
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
    // Delay so scroll starts first, then the accordion opens
    setTimeout(expandDeals, 220);
  }

  // Bind all triggers
  $$('[data-open-deals]').forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); openDeals(true); }));

  // Card interactions
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

  // ===== Shop reveal =====
  const menuWrap = $('#menuWrap');

  function openShop(scrollAlso){
    if (menuWrap) menuWrap.hidden = false;
    const shop = $('#shop');
    if (scrollAlso && shop) smoothTo(shop);
  }

  $$('[data-open-shop]').forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); openShop(true); }));

  // ===== Hours pill =====
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
      return { open, close, isOpen, openSoon, closingSoon };
    }

    function paint(){
      if (!btn) return;
      const s = statusNow();
      let label = 'OPEN';
      let dot = 'open';

      if (s.isOpen && s.closingSoon){ label = 'CLOSING SOON'; dot = 'soon'; }
      else if (!s.isOpen && s.openSoon){ label = 'OPENING SOON'; dot = 'soon'; }
      else if (s.isOpen){ label = 'OPEN'; dot = 'open'; }
      else { label = 'CLOSED'; dot = 'closed'; }

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

    paint();
    renderHours();
    setInterval(paint, 60*1000);

    if (btn) btn.addEventListener('click', () => (pop?.hidden ? openPop() : closePop()));
    if (ovl) ovl.addEventListener('click', closePop);

    // Tapping status strip opens hours
    if (strip && btn) strip.addEventListener('click', () => btn.click());
  })();

  // ===== Carousel (simple) =====
  (function carousel(){
    const root = document.querySelector('[data-carousel]');
    if (!root) return;
    const slides = [...root.querySelectorAll('.slide')];
    const dots = root.querySelector('.dots');
    const delay = parseInt(root.getAttribute('data-autoplay') || '6500', 10);

    if (!slides.length || !dots) return;

    let i = slides.findIndex(s => s.classList.contains('is-active'));
    if (i < 0) i = 0;

    dots.innerHTML = slides.map((_, idx) => `<button class="dotbtn ${idx===i?'is-active':''}" type="button" aria-label="Go to slide ${idx+1}"></button>`).join('');
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
