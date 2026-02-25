/* ===========================
   script.js (FULL REPLACEMENT)
   Green Labs — clean + launch-ready
=========================== */

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const prefersReduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));

  function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent || ''); }
  function isAndroid() { return /Android/.test(navigator.userAgent || ''); }

  function smartMapHref(address) {
    const q = encodeURIComponent(address);
    if (isIOS()) return `maps://?q=${q}`;
    if (isAndroid()) return `geo:0,0?q=${q}`;
    return `https://www.google.com/maps?q=${q}`;
  }

  // Smooth scroll with sticky height offset
  function smoothTo(el) {
    if (!el) return;
    const stickyH = $('.sticky')?.getBoundingClientRect().height || 64;
    const y = el.getBoundingClientRect().top + window.pageYOffset - (stickyH + 10);
    window.scrollTo({ top: Math.max(0, y), behavior: prefersReduce ? 'auto' : 'smooth' });
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
  (function reveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    if (prefersReduce) {
      items.forEach(el => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('is-in');
          io.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(el => io.observe(el));
  })();

  // ===== Deals open helper =====
  const dealsDrop = $('#dealsDrop');
  function openDeals(scrollAlso) {
    const dealsSection = $('#deals');
    if (scrollAlso && dealsSection) smoothTo(dealsSection);
    setTimeout(() => {
      if (dealsDrop) dealsDrop.open = true;
    }, 220);
  }

  $$('[data-open-deals]').forEach(el =>
    el.addEventListener('click', (e) => { e.preventDefault(); openDeals(true); })
  );

  // ===== Shop reveal + category state (Leafly-ready) =====
  const menuWrap = $('#menuWrap');
  const menuPill = $('#menuCategoryPill');
  const menuPillStrong = $('#menuCategoryPill strong');
  const menuPlaceholderSub = $('#menuPlaceholderSub');

  function setMenuCategory(cat) {
    if (!cat) return;

    if (menuPill && menuPillStrong) {
      menuPill.hidden = false;
      menuPillStrong.textContent = cat;
    }
    if (menuPlaceholderSub) {
      menuPlaceholderSub.textContent =
        `Selected category: ${cat}. When Leafly is live, this will route into the right section automatically.`;
    }

    try { localStorage.setItem('gl_selected_category', cat); } catch {}
  }

  function openShop(scrollAlso) {
    if (menuWrap) menuWrap.hidden = false;
    const shop = $('#shop');
    if (scrollAlso && shop) smoothTo(shop);
  }

  $$('[data-open-shop]').forEach(el =>
    el.addEventListener('click', (e) => { e.preventDefault(); openShop(true); })
  );

  $$('[data-shop-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = btn.getAttribute('data-shop-category');
      if (cat) setMenuCategory(cat);
      openShop(true);
    });
  });

  (function restoreCategory() {
    try {
      const cat = localStorage.getItem('gl_selected_category');
      if (cat) setMenuCategory(cat);
    } catch {}
  })();

  // ===== Drawer =====
  (function drawer() {
    const openBtns = $$('[data-open-menu]');
    const closeBtn = $('[data-close-menu]');
    const drawer = $('#navDrawer');
    const ovl = $('#menuOverlay');
    const links = drawer ? $$('.drawer__link', drawer) : [];

    if (!openBtns.length || !drawer || !ovl) return;

    drawer.hidden = false;
    ovl.hidden = false;
    openBtns.forEach(btn => btn.setAttribute('aria-expanded', 'false'));

    const open = () => {
      drawer.classList.add('is-active');
      ovl.classList.add('is-active');
      document.body.style.overflow = 'hidden';

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

    if (closeBtn) closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });

    ovl.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    drawer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.classList.contains('icon--close')) return;

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

  // ===== Deals render (dropdown + tiles) =====
  (function loadDeals() {
    const dealList = $('#dealList');
    const tilesWrap = $('#dealTiles');

    if (!dealList) {
      console.warn('Missing #dealList in HTML. Deals dropdown cannot render.');
      return;
    }

    const url = `deals.json?v=${Date.now()}`; // cache bust for GH Pages

    fetch(url, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) {
          const text = await r.text().catch(() => '');
          throw new Error(`Failed to load deals.json (${r.status}) ${text.slice(0, 120)}`);
        }
        return r.json();
      })
      .then((data) => {
        renderDealsDropdown(data);
        renderDealTiles(data);
      })
      .catch((err) => {
        console.error(err);
        dealList.innerHTML = `
          <div class="cat">
            <div class="catTitle">Deals unavailable right now.</div>
            <div style="font-weight:800;opacity:.75;margin-top:8px;">
              Check that <code>deals.json</code> exists at site root and is valid JSON.
            </div>
          </div>
        `;
        if (tilesWrap) tilesWrap.innerHTML = '';
      });

    function renderDealsDropdown(data) {
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

      dealList.innerHTML =
        html + `<div style="margin-top:10px;font-weight:800;opacity:.70;">All prices include tax.</div>`;
    }

    function emojiForCategory(name) {
      const s = (name || '').toLowerCase();
      if (s.includes('flower')) return '🌿';
      if (s.includes('vape')) return '💨';
      if (s.includes('pre-roll')) return '🪄';
      if (s.includes('infused')) return '💥';
      if (s.includes('edible') || s.includes('gummi') || s.includes('gummy')) return '🍬';
      if (s.includes('concentrate')) return '🍯';
      if (s.includes('tincture')) return '🧪';
      if (s.includes('topical')) return '🧴';
      if (s.includes('beverage')) return '🥤';
      return '✦';
    }

    function cleanCategoryLabel(name) {
      return String(name || '').replace(/^[^\w]+/, '').trim(); // strips leading emoji
    }

    function pickBestLineFromCategory(cat) {
      const scoreLine = (s) => {
        let score = 0;
        if (/\$/.test(s)) score += 3;
        if (/(buy|for|\/|ounce|oz|eighth|half|quarter|2\/|3\/|5\/|10\/|15\/)/i.test(s)) score += 2;
        if (/(limited|new|deli|live resin|rosin|hash)/i.test(s)) score += 1;
        return score;
      };

      const pickBest = (arr) => {
        const items = (arr || []).filter(Boolean).map(String);
        if (!items.length) return '';
        return items
          .map(s => ({ s, sc: scoreLine(s) }))
          .sort((a, b) => b.sc - a.sc)[0].s;
      };

      if (Array.isArray(cat.groups) && cat.groups.length) {
        const ounces = cat.groups.find(g => /ounce|oz/i.test(g.title || ''));
        const fromOunces = ounces ? pickBest(ounces.items) : '';
        if (fromOunces) return fromOunces;

        for (const g of cat.groups) {
          const line = pickBest(g.items);
          if (line) return line;
        }
      }

      return pickBest(cat.items);
    }

    function renderDealTiles(data) {
      if (!tilesWrap) return;

      const cats = (data || [])
        .map(cat => ({ cat, line: pickBestLineFromCategory(cat) }))
        .filter(x => x.line && x.line.trim().length > 0)
        .slice(0, 6);

      tilesWrap.innerHTML = cats.map(x => {
        const label = cleanCategoryLabel(x.cat.category);
        const icon = emojiForCategory(label);

        return `
          <a class="dealTile" href="#deals" data-open-deals>
            <div>
              <div class="dealTile__top">
                <div class="dealTile__icon" aria-hidden="true">${esc(icon)}</div>
                <div class="dealTile__cat">${esc(label)}</div>
                <div class="dealTile__badge">DEAL</div>
              </div>
              <p class="dealTile__title">${esc(x.line)}</p>
              <p class="dealTile__hint">Tap to view full list</p>
            </div>
            <div class="dealTile__arrow" aria-hidden="true">→</div>
          </a>
        `;
      }).join('');
    }
  })();

  // ===== Status strip dot + label =====
  (function status() {
    const strip = $('#statusStrip');
    const statusText = $('#statusText');
    const statusDot = $('#statusDot');
    const statusAddr = $('#statusAddr');

    if (statusAddr) statusAddr.textContent = '10701 Madison St, Luna Pier';

    const HOURS = [
      { d: 'Sunday', open: 9, close: 21 },
      { d: 'Monday', open: 9, close: 21 },
      { d: 'Tuesday', open: 9, close: 21 },
      { d: 'Wednesday', open: 9, close: 21 },
      { d: 'Thursday', open: 9, close: 21 },
      { d: 'Friday', open: 9, close: 21 },
      { d: 'Saturday', open: 9, close: 21 },
    ];

    function statusNow() {
      const now = new Date();
      const idx = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;
      const { open, close } = HOURS[idx];
      const openSoon = hour >= open - 0.5 && hour < open;
      const closingSoon = hour >= close - 0.5 && hour < close;
      const isOpen = hour >= open && hour < close;
      return { open, close, isOpen, openSoon, closingSoon };
    }

    function paint() {
      const s = statusNow();
      let dot = 'open';
      if (s.isOpen && s.closingSoon) dot = 'soon';
      else if (!s.isOpen && s.openSoon) dot = 'soon';
      else if (!s.isOpen) dot = 'closed';

      if (statusText) statusText.textContent = 'Open daily 9am–9pm';

      if (statusDot) {
        statusDot.style.background =
          dot === 'open' ? '#16a34a' : (dot === 'soon' ? '#f59e0b' : '#ef4444');

        statusDot.style.boxShadow =
          dot === 'open'
            ? '0 0 0 3px rgba(22,163,74,.18)'
            : (dot === 'soon'
              ? '0 0 0 3px rgba(245,158,11,.20)'
              : '0 0 0 3px rgba(239,68,68,.18)');
      }
    }

    paint();
    setInterval(paint, 60 * 1000);

    if (strip) {
      strip.addEventListener('click', () => {
        const href = smartMapHref(ADDRESS);
        window.open(href, /^https?:/i.test(href) ? '_blank' : '_self');
      });
    }
  })();
});
