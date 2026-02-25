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
    const y = el.getBoundingClientRect().top + window.pageYOffset - (stickyH + 10);
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

  // ===== Reveal on scroll (subtle, premium) =====
  (function reveal(){
    const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = $$('.reveal');
    if (!items.length) return;

    if (prefersReduce){
      items.forEach(el => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting){
          ent.target.classList.add('is-in');
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(el => io.observe(el));
  })();

  // ===== Drawer =====
  (function drawer(){
    const openBtns = $$('[data-open-menu]');
    const closeBtn = $('[data-close-menu]');
    const drawer = $('#navDrawer');
    const ovl = $('#menuOverlay');
    const links = $$('.drawer__link', drawer);

    if (!openBtns.length || !drawer || !ovl) return;

    // Initialize: we control visibility via classes now
    drawer.hidden = false;
    ovl.hidden = false;
    openBtns.forEach(btn => btn.setAttribute('aria-expanded','false'));

    const open = () => {
      drawer.classList.add('is-active');
      ovl.classList.add('is-active');
      document.body.style.overflow = 'hidden';

      // stagger links
      links.forEach((link, index) => {
        setTimeout(() => link.classList.add('revealed'), 140 * (index + 1));
      });
    };

    const close = () => {
      drawer.classList.remove('is-active');
      ovl.classList.remove('is-active');
      links.forEach(link => link.classList.remove('revealed'));
      document.body.style.overflow = '';
    };

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

  // ===== Deals =====
  const dealsDrop = $('#dealsDrop');
  const dealList = $('#dealList');

  function openDeals(scrollAlso){
    const dealsSection = $('#deals');
    if (scrollAlso && dealsSection) smoothTo(dealsSection);
    setTimeout(() => {
      if (dealsDrop) dealsDrop.open = true;
    }, 220);
  }

  $$('[data-open-deals]').forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); openDeals(true); }));

  // deals.json render into DR-style markup
  function esc(s){
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  function flattenDealsForTiles(data, limit = 6){
    // Normalize to a list of {cat, text}
    const out = [];
    (data || []).forEach(cat => {
      const catName = cat.category || 'Deals';
      if (Array.isArray(cat.groups)){
        cat.groups.forEach(g => {
          (g.items || []).forEach(it => out.push({ cat: catName, text: String(it) }));
        });
      } else {
        (cat.items || []).forEach(it => out.push({ cat: catName, text: String(it) }));
      }
    });

    // Use first N (simple + stable)
    return out.slice(0, limit);
  }

  function renderDealsList(data){
    if (!dealList) return;
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

  // Deal Tiles
  function renderDealTiles(data){
    const grid = document.getElementById('dealTiles');
    if (!grid) return;

    const tiles = flattenDealsForTiles(data, 6);
    if (!tiles.length){
      grid.innerHTML = `
        <div class="dealTile" role="button" tabindex="0">
          <div class="dealTile__k">
            <span>Highlights</span>
            <span class="dealTile__tag">Today</span>
          </div>
          <div class="dealTile__t">Deals loading…</div>
          <div class="dealTile__s">If this persists, check deals.json.</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = tiles.map(t => `
      <div class="dealTile" role="button" tabindex="0" data-open-deals>
        <div class="dealTile__k">
          <span>${esc(t.cat)}</span>
          <span class="dealTile__tag">Deal</span>
        </div>
        <div class="dealTile__t">${esc(t.text)}</div>
        <div class="dealTile__s">Tap to view full list</div>
      </div>
    `).join('');

    // Make tile clickable (delegated)
    grid.addEventListener('click', (e) => {
      const tile = e.target.closest('[data-open-deals]');
      if (tile) openDeals(true);
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const tile = e.target.closest('[data-open-deals]');
      if (tile) {
        e.preventDefault();
        openDeals(true);
      }
    });
  }

  (function loadDeals(){
    fetch('deals.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        renderDealsList(data);
        renderDealTiles(data);
      })
      .catch(() => {
        if (dealList) dealList.innerHTML = '<div class="cat"><div class="catTitle">Deals unavailable right now.</div></div>';
        renderDealTiles([]);
      });
  })();

  // ===== Shop reveal + category state (Leafly-ready) =====
  const menuWrap = $('#menuWrap');
  const menuPill = $('#menuCategoryPill');
  const menuPillStrong = $('#menuCategoryPill strong');
  const menuPlaceholderSub = $('#menuPlaceholderSub');

  function setMenuCategory(cat){
    if (!cat) return;
    if (menuPill && menuPillStrong){
      menuPill.hidden = false;
      menuPillStrong.textContent = cat;
    }
    if (menuPlaceholderSub){
      menuPlaceholderSub.textContent = `Selected category: ${cat}. When Leafly is live, this will route into the right section automatically.`;
    }
    // Save for later Leafly wiring
    try { localStorage.setItem('gl_selected_category', cat); } catch {}
  }

  function openShop(scrollAlso){
    if (menuWrap) menuWrap.hidden = false;
    const shop = $('#shop');
    if (scrollAlso && shop) smoothTo(shop);
  }

  // Default open shop
  $$('[data-open-shop]').forEach(el => el.addEventListener('click', (e)=>{ e.preventDefault(); openShop(true); }));

  // Category buttons: open shop + set category
  $$('[data-shop-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // This button also has data-open-shop, so prevent double behavior.
      e.preventDefault();
      const cat = btn.getAttribute('data-shop-category');
      if (cat) setMenuCategory(cat);
      openShop(true);
    });
  });

  // Restore last selected category (nice polish)
  (function restoreCategory(){
    try {
      const cat = localStorage.getItem('gl_selected_category');
      if (cat) setMenuCategory(cat);
    } catch {}
  })();

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

    // Tap strip opens maps
    if (strip) {
      strip.addEventListener('click', () => {
        const href = smartMapHref(ADDRESS);
        window.open(href, /^https?:/i.test(href) ? '_blank' : '_self');
      });
    }
  })();
});
