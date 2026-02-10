// =========================================================
// Green Labs — New Vision Script
// - Age gate
// - Sticky status (Open / Soon / Closed)
// - Hours popover + status strip sync
// - Drawer menu
// - Deals loader (deals.json)
// - Shop Now opens in-page menu section
// - Simple hero carousel
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';

  // Footer year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Age Gate ======================================================
  (function ageGate(){
    const KEY = 'gl_age_until';
    const gate = document.getElementById('ageGate');
    if (!gate) return;

    const sp = new URL(location.href).searchParams;
    if (sp.get('agegate') === 'clear') localStorage.removeItem(KEY);
    const forceShow = sp.get('agegate') === 'show';

    const okUntil = Number(localStorage.getItem(KEY) || 0);
    const sessionOK = sessionStorage.getItem(KEY) === '1';
    const isOK = (okUntil > Date.now()) || sessionOK;

    function show(){ gate.setAttribute('aria-hidden','false'); gate.style.display='flex'; document.body.classList.add('agegate--lock'); }
    function hide(){ gate.setAttribute('aria-hidden','true'); gate.style.display='none'; document.body.classList.remove('agegate--lock'); }

    const yes = document.getElementById('ageYes');
    const no  = document.getElementById('ageNo');
    const remember = document.getElementById('ageRemember');

    if (yes) yes.addEventListener('click', () => {
      if (remember && remember.checked) {
        const THIRTY = 30*24*60*60*1000;
        localStorage.setItem(KEY, String(Date.now()+THIRTY));
      } else {
        sessionStorage.setItem(KEY, '1');
      }
      hide();
    });
    if (no) no.addEventListener('click', () => { location.href = 'https://www.google.com'; });

    if (forceShow) show();
    else if (isOK) hide();
    else show();
  })();

  // ===== Helpers =======================================================
  function isIOS(){ return /iPad|iPhone|iPod/.test(navigator.userAgent||''); }
  function isAndroid(){ return /Android/.test(navigator.userAgent||''); }
  function smartMapHref(address){
    const q = encodeURIComponent(address);
    if (isIOS()) return `maps://?q=${q}`;
    if (isAndroid()) return `geo:0,0?q=${q}`;
    return `https://www.google.com/maps?q=${q}`;
  }

  function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

  // ===== Shop Now opens menu ==========================================
  const menuSection = document.getElementById('menu');
  function openMenu(){
    if (!menuSection) return;
    menuSection.hidden = false;

    // close drawer if open
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('menuOverlay');
    if (drawer && !drawer.hidden) drawer.hidden = true;
    if (overlay && !overlay.hidden) overlay.hidden = true;

    const top = menuSection.getBoundingClientRect().top + window.pageYOffset - 84;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  [
    'shopNowTop','shopNowNav','shopNowHero','shopNowMid','shopNowDeals','shopNowDTG','shopNowVisit','shopNowDrawer','quickShop'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', (e) => { e.preventDefault(); openMenu(); });
  });

  // ===== Drawer menu ===================================================
  (function drawer(){
    const openBtn = document.querySelector('[data-open-menu]');
    const pop = document.getElementById('navDrawer');
    const ovl = document.getElementById('menuOverlay');
    const closeBtn = document.getElementById('closeDrawer');
    if (!openBtn || !pop || !ovl) return;

    const open = () => { pop.hidden = false; ovl.hidden = false; openBtn.setAttribute('aria-expanded','true'); };
    const close = () => { pop.hidden = true; ovl.hidden = true; openBtn.setAttribute('aria-expanded','false'); };

    openBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); (pop.hidden ? open() : close()); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    ovl.addEventListener('click', close);
    pop.addEventListener('click', (e)=>{ if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });
  })();

  // ===== Deals loader ==================================================
  (function deals(){
    const body = document.getElementById('dealBody');
    const list = document.getElementById('dealList');
    const card = document.querySelector('.deal-card');
    if (!body || !list || !card) return;

    fetch('deals.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => renderDeals(list, data))
      .catch(() => { list.innerHTML = '<li>Deals unavailable right now.</li>'; });

    const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

    function renderDeals(target, data){
      const html = data.map(cat=>{
        if (Array.isArray(cat.groups)) {
          const groups = cat.groups.map(g=>`
            <div class="deal-subgroup">
              <div class="deal-subtitle">${esc(g.title)}</div>
              <ul class="deal-items">${(g.items||[]).map(it=>`<li>${esc(it)}</li>`).join('')}</ul>
            </div>`).join('');
          return `<li class="deal-cat"><div class="deal-cat-title">${esc(cat.category)}</div>${groups}</li>`;
        }
        return `<li class="deal-cat">
          <div class="deal-cat-title">${esc(cat.category)}</div>
          <ul class="deal-items">${(cat.items||[]).map(it=>`<li>${esc(it)}</li>`).join('')}</ul>
        </li>`;
      }).join('');
      target.innerHTML = html + `<div class="deal-note">All prices include tax.</div>`;
    }

    const expand = () => { card.setAttribute('aria-expanded','true'); body.classList.remove('collapsed'); };
    const collapse = () => { card.setAttribute('aria-expanded','false'); body.classList.add('collapsed'); };
    const toggle = () => (card.getAttribute('aria-expanded') === 'true') ? collapse() : expand();

    card.addEventListener('click', (e)=>{ if (e.target.closest('button,a,input,label,select,textarea')) return; toggle(); });
    card.addEventListener('keydown', (e)=>{ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });

    const closeBtn = document.getElementById('closeDeals');
    if (closeBtn) closeBtn.addEventListener('click', (e)=>{ e.stopPropagation(); collapse(); });
  })();

  // ===== Hours + Status ===============================================
  (function hours(){
    const btn = document.getElementById('hoursBtn');
    const pop = document.getElementById('hoursPopover');
    const ovl = document.getElementById('hoursOverlay');
    const list = document.getElementById('hoursList');
    const note = document.getElementById('hoursNote');
    const closeBtn = document.getElementById('closeHours');
    const deskPill = document.getElementById('deskStatusPill');

    if (!btn || !pop || !ovl || !list || !note) return;

    // 9–9 every day
    const HOURS = [
      { d:'Sunday', open:9, close:21 },
      { d:'Monday', open:9, close:21 },
      { d:'Tuesday', open:9, close:21 },
      { d:'Wednesday', open:9, close:21 },
      { d:'Thursday', open:9, close:21 },
      { d:'Friday', open:9, close:21 },
      { d:'Saturday', open:9, close:21 },
    ];

    const fmt = h => `${((h+11)%12)+1}${h>=12?'PM':'AM'}`;

    function statusNow(){
      const now = new Date();
      const idx = now.getDay();
      const hour = now.getHours() + now.getMinutes()/60;
      const {open, close} = HOURS[idx];
      const openSoon = hour >= open-0.5 && hour < open;
      const closingSoon = hour >= close-0.5 && hour < close;
      const isOpen = hour >= open && hour < close;
      return {idx, open, close, isOpen, openSoon, closingSoon};
    }

    function paint(){
      const s = statusNow();
      btn.classList.remove('state-open','state-soon','state-closed');
      let label = 'CLOSED';
      let deskClass = 'status-pill--closed';

      if (s.isOpen && s.closingSoon){
        label = 'CLOSING SOON';
        btn.classList.add('state-soon');
        deskClass = 'status-pill--soon';
      } else if (!s.isOpen && s.openSoon){
        label = 'OPENING SOON';
        btn.classList.add('state-soon');
        deskClass = 'status-pill--soon';
      } else if (s.isOpen){
        label = 'OPEN';
        btn.classList.add('state-open');
        deskClass = 'status-pill--open';
      } else {
        btn.classList.add('state-closed');
      }

      btn.textContent = label;

      if (deskPill){
        deskPill.className = `status-pill ${deskClass}`;
        deskPill.textContent = (label === 'OPEN') ? 'Open' : (label.includes('SOON') ? 'Soon' : 'Closed');
      }
    }

    function renderHours(){
      const today = new Date().getDay();
      list.innerHTML = HOURS.map((h,i)=>`
        <li class="${i===today?'is-today':''}">
          <span>${h.d}</span>
          <span>${fmt(h.open)} – ${fmt(h.close)}</span>
        </li>
      `).join('');

      const href = smartMapHref(ADDRESS);
      const safe = /^https?:/i.test(href);
      note.innerHTML = `<a class="note-address" href="${href}" ${safe ? 'target="_blank" rel="noopener"' : ''}>${ADDRESS}</a>`;
    }

    function alignPopover(){
      const strip = document.getElementById('statusStrip');
      const stripVisible = strip && getComputedStyle(strip).display !== 'none';
      const anchor = (stripVisible && strip) || document.querySelector('.site-header');
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      pop.style.top = `${Math.round(rect.bottom)}px`;
      pop.style.right = '16px';
    }

    function openPop(){ pop.hidden=false; ovl.hidden=false; btn.setAttribute('aria-expanded','true'); alignPopover(); }
    function closePop(){ pop.hidden=true; ovl.hidden=true; btn.setAttribute('aria-expanded','false'); }

    paint();
    renderHours();

    btn.addEventListener('click', ()=> (pop.hidden ? openPop() : closePop()));
    ovl.addEventListener('click', closePop);
    if (closeBtn) closeBtn.addEventListener('click', closePop);

    window.addEventListener('resize', ()=>{ if (!pop.hidden) alignPopover(); });
    window.addEventListener('scroll', ()=>{ if (!pop.hidden) alignPopover(); }, {passive:true});
    setInterval(paint, 60*1000);

    // Mobile status strip sync
    const strip = document.getElementById('statusStrip');
    const dot = strip ? strip.querySelector('.status-dot') : null;
    const textEl = document.getElementById('statusText');
    const addrEl = document.getElementById('statusAddr');
    if (strip && dot && textEl){
      if (addrEl) addrEl.textContent = ADDRESS;

      const sync = ()=>{
        dot.classList.remove('is-open','is-soon','is-closed');
        if (btn.classList.contains('state-open')){ dot.classList.add('is-open'); textEl.textContent = 'Open'; }
        else if (btn.classList.contains('state-soon')){ dot.classList.add('is-soon'); textEl.textContent = 'Soon'; }
        else { dot.classList.add('is-closed'); textEl.textContent = 'Closed'; }
      };

      strip.addEventListener('click', ()=> btn.click());
      sync();
      new MutationObserver(sync).observe(btn, {attributes:true, attributeFilter:['class']});
      setInterval(sync, 30*1000);
    }
  })();

  // ===== Open in Maps ==================================================
  (function maps(){
    const btn = document.getElementById('openMapsSmart');
    if (!btn) return;
    btn.addEventListener('click', ()=>{
      const href = smartMapHref(ADDRESS);
      if (/^https?:/i.test(href)) window.open(href,'_blank','noopener');
      else location.href = href;
    });
  })();

  // ===== Smooth scroll for internal anchors ============================
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (a.target === '_blank' || /^https?:\/\//i.test(href)) return;
    if (!href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });

  // ===== Simple carousel ===============================================
  (function carousel(){
    const root = document.getElementById('hero-slides');
    if (!root) return;

    const slides = [...root.querySelectorAll('.slide')].filter(s=>{
      const img = s.querySelector('img');
      return img && img.getAttribute('src');
    });
    const N = slides.length;
    if (!N) return;

    let i = slides.findIndex(s=>s.classList.contains('is-active'));
    if (i < 0) i = 0;

    const dotsBar = root.querySelector('.dots');
    dotsBar.innerHTML = '';
    const dots = slides.map((_,k)=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${k+1}`);
      if (k === i) b.setAttribute('aria-current','true');
      b.addEventListener('click', ()=>go(k,true));
      dotsBar.appendChild(b);
      return b;
    });

    const prev = root.querySelector('.edge--prev');
    const next = root.querySelector('.edge--next');
    if (prev) prev.addEventListener('click', ()=>go(i-1,true));
    if (next) next.addEventListener('click', ()=>go(i+1,true));

    const delay = parseInt(root.dataset.autoplay || '6500', 10);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = null;

    function start(){ if (!prefersReduced){ stop(); timer = setInterval(()=>go(i+1,false), delay); } }
    function stop(){ if (timer){ clearInterval(timer); timer = null; } }

    function go(n, user){
      const prevIdx = i;
      i = ((n % N) + N) % N;
      if (i === prevIdx) return;

      slides[prevIdx].classList.remove('is-active');
      slides[i].classList.add('is-active');

      if (dots[prevIdx]) dots[prevIdx].removeAttribute('aria-current');
      if (dots[i]) dots[i].setAttribute('aria-current','true');

      if (user){ stop(); start(); }
    }

    // Touch swipe
    let startX = null;
    root.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; stop(); }, {passive:true});
    root.addEventListener('touchend', e=>{
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? i+1 : i-1, true);
      startX = null; start();
    }, {passive:true});

    // Pause on hover
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    // Initialize
    slides.forEach((s,idx)=>s.classList.toggle('is-active', idx===i));
    start();
  })();
});
