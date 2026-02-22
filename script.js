document.addEventListener('DOMContentLoaded', () => {
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

  // Smooth scroll with sticky height offset
  function smoothTo(el){
    if (!el) return;
    const stickyH = $('.sticky')?.getBoundingClientRect().height || 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (stickyH + 8);
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  // data-scroll buttons/links
  $$('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-scroll');
      const el = target ? $(target) : null;
      if (el) smoothTo(el);
    });
  });

 // ===== Drawer =====
(function drawer(){
  // FIX: Using $$ to select BOTH mobile and desktop hamburger menus
  const openBtns = $$('[data-open-menu]'); 
  const closeBtn = $('[data-close-menu]');
  const drawer = $('#navDrawer');
  const ovl = $('#menuOverlay');
  const links = $$('.drawer__link', drawer);

  if (!openBtns.length || !drawer || !ovl) return;

  // Initialize
  drawer.hidden = false; // We use CSS transform instead of display:none now
  ovl.hidden = false;
  openBtns.forEach(btn => btn.setAttribute('aria-expanded','false'));

  /* Force Open Function */
  const open = () => {
    // 1. Add active classes to trigger CSS transform/opacity
    drawer.classList.add('is-active');
    ovl.classList.add('is-active');
    
    // 2. Lock background scrolling
    document.body.style.overflow = 'hidden';

    // 3. Stagger the links sliding in (The Dutch Touch effect)
    links.forEach((link, index) => {
      setTimeout(() => {
        link.classList.add('revealed');
      }, 150 * (index + 1)); // Increased to 150ms for a slightly slower, smoother rollout
    });

  /* Force Close Function */
  const close = () => {
    // 1. Remove active classes
    drawer.classList.remove('is-active');
    ovl.classList.remove('is-active');
    
    // 2. Hide links immediately so they are reset for next open
    links.forEach(link => link.classList.remove('revealed'));
    
    // 3. Unlock scrolling
    document.body.style.overflow = '';
  };

  // Add listener to ALL hamburger buttons
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.contains('is-active') ? close() : open();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    close();
  });

  ovl.addEventListener('click', close);

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') close();
  });

  drawer.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.classList.contains('icon--close')) return;

    if (btn.hasAttribute('data-open-deals')) {
      close();
      openDeals(true);
      return;
    }
    if (btn.hasAttribute('data-open-shop')) {
      close();
      openShop(true);
      return;
    }
    const hash = btn.getAttribute('data-scroll');
    if (hash) {
      close();
      const el = $(hash);
      if (el) smoothTo(el);
    }
  });
})();

  // ===== Deals (DR-style details dropdown) =====
  const dealsDrop = $('#dealsDrop');
  const dealList = $('#dealList');

  function openDeals(scrollAlso){
    const dealsSection = $('#deals');
    if (scrollAlso && dealsSection) smoothTo(dealsSection);
    // open after scroll starts so it feels intentional
    setTimeout(() => {
      if (dealsDrop) dealsDrop.open = true;
    }, 220);
  }

  $$('[data-open-deals]').forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); openDeals(true); }));

  // deals.json render into DR-style markup
  (function loadDeals(){
    if (!dealList) return;

    fetch('deals.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => renderDeals(data))
      .catch(() => { dealList.innerHTML = '<div class="cat"><div class="catTitle">Deals unavailable right now.</div></div>'; });

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));

    function renderDeals(data){
      const html = (data || []).map(cat => {
        const catTitle = `<div class="catTitle">${esc(cat.category || '')}</div>`;

        if (Array.isArray(cat.groups)) {
          const groups = cat.groups.map(g => {
            const items = (g.items || []).map(it => `<li>${esc(it)}</li>`).join('');
            return `
              <div class="group">
                <div class="groupTitle">${esc(g.title || '')}</div>
                <ul>${items}</ul>
              </div>
            `;
          }).join('');
          return `<div class="cat">${catTitle}${groups}</div>`;
        }

        const items = (cat.items || []).map(it => `<li>${esc(it)}</li>`).join('');
        return `<div class="cat">${catTitle}<ul>${items}</ul></div>`;
      }).join('');

      dealList.innerHTML = html + `<div style="margin-top:10px;font-weight:800;opacity:.70;">All prices include tax.</div>`;
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

  // ===== Status strip dot + label =====
  (function status(){
    const strip = $('#statusStrip');
    const statusText = $('#statusText');
    const statusDot = $('#statusDot');
    const statusAddr = $('#statusAddr');

    if (statusAddr) statusAddr.textContent = '10701 Madison St, Luna Pier';

    const HOURS = [
      { d:'Sunday', open:9, close:21 },
      { d:'Monday', open:9, close:21 },
      { d:'Tuesday', open:9, close:21 },
      { d:'Wednesday', open:9, close:21 },
      { d:'Thursday', open:9, close:21 },
      { d:'Friday', open:9, close:21 },
      { d:'Saturday', open:9, close:21 },
    ];

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
      const s = statusNow();
      let dot = 'open';
      if (s.isOpen && s.closingSoon) dot = 'soon';
      else if (!s.isOpen && s.openSoon) dot = 'soon';
      else if (!s.isOpen) dot = 'closed';

      if (statusText) statusText.textContent = 'Open daily 9am–9pm';

      if (statusDot){
        statusDot.style.background = dot === 'open' ? '#16a34a' : (dot === 'soon' ? '#f59e0b' : '#ef4444');
        statusDot.style.boxShadow = dot === 'open'
          ? '0 0 0 3px rgba(22,163,74,.18)'
          : (dot === 'soon' ? '0 0 0 3px rgba(245,158,11,.20)' : '0 0 0 3px rgba(239,68,68,.18)');
      }
    }

    paint();
    setInterval(paint, 60*1000);

    // Optional: tap strip opens maps
    if (strip) {
      strip.addEventListener('click', () => {
        const href = smartMapHref(ADDRESS);
        window.open(href, /^https?:/i.test(href) ? '_blank' : '_self');
      });
    }
  })();

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
