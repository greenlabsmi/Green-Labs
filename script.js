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
    const yPos = el.getBoundingClientRect().top + window.pageYOffset - (stickyH + 10);
    window.scrollTo({ top: Math.max(0, yPos), behavior: prefersReduce ? 'auto' : 'smooth' });
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

  // ===== Reveal on scroll (global) =====
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

  // ===== Today’s Highlights behavior (fade-in + hero parallax) =====
  function initTodaysHighlightsFX() {
    const root = document.getElementById('todays-highlights');
    if (!root) return;

    const revealEls = Array.from(root.querySelectorAll('.thReveal'));

    // Fade-in on scroll (stagger)
    if (!prefersReduce && revealEls.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          const idx = revealEls.indexOf(el);
          el.style.transitionDelay = (idx >= 0 ? Math.min(idx * 80, 320) : 0) + 'ms';

          el.classList.add('is-in');
          io.unobserve(el);
        });
      }, { threshold: 0.12 });

      revealEls.forEach(el => io.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('is-in'));
    }

    // Parallax on hero background (subtle, performance-safe)
    if (prefersReduce) return;

    const heroParallax = root.querySelector('.thHero .thParallax');
    if (!heroParallax) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const vh = window.innerHeight || 800;

        const inRange = rect.top < vh * 1.2 && rect.bottom > -vh * 0.2;
        if (inRange) {
          const progress = (vh - rect.top) / (vh + rect.height);
          const offset = (progress - 0.5) * 18;
          heroParallax.style.transform = `translateY(${offset.toFixed(2)}px)`;
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  // ===== Deals open helper =====
  const dealsDrop = $('#dealsDrop');
  function openDeals(scrollAlso) {
    const dealsSection = $('#deals');
    if (scrollAlso && dealsSection) smoothTo(dealsSection);
    setTimeout(() => {
      if (dealsDrop) dealsDrop.open = true;
    }, 220);
  }

  // Delegated click handler (covers dynamically injected highlights too)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-open-deals]');
    if (!a) return;
    e.preventDefault();
    openDeals(true);
  });

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

  // ===== Deals + Highlights render (from merged deals.json) =====
  (function loadDeals() {
    const dealList = $('#dealList');
    const tilesWrap = $('#dealTiles');       // existing "feature + quick" area (optional)
    const highlightsMount = $('#highlightsMount'); // new highlights mount

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
        const dealsData = Array.isArray(data) ? data : (data.deals || []);
        renderDealsDropdown(dealsData);
        renderDealTiles(dealsData);

        // NEW: highlights from merged deals.json
        if (highlightsMount && data && data.highlights) {
          renderHighlightsFromConfig(data.highlights, highlightsMount);
          // FX needs to run AFTER we inject the tiles
          initTodaysHighlightsFX();
        } else {
          // still init header FX if section exists
          initTodaysHighlightsFX();
        }
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

        if (highlightsMount) {
          highlightsMount.innerHTML = `
            <div style="padding:14px;font-weight:800;opacity:.7;color:#121614;">
              Highlights unavailable.
            </div>
          `;
        }

        initTodaysHighlightsFX();
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

    function renderDealTiles(data) {
      if (!tilesWrap) return;

      // Flatten deal lines with category context
      const lines = [];
      (data || []).forEach(cat => {
        const catNameRaw = String(cat.category || 'Deals');
        const catName = catNameRaw.replace(/^[^\w]+/, '').trim();

        const pushItems = (arr) => (arr || []).forEach(it => {
          const text = String(it || '').trim();
          if (text) lines.push({ cat: catName, rawCat: catNameRaw, text });
        });

        if (Array.isArray(cat.groups)) {
          cat.groups.forEach(g => pushItems(g.items));
        } else {
          pushItems(cat.items);
        }
      });

      const score = (s) => {
        let sc = 0;
        if (/\$/.test(s)) sc += 4;
        if (/(ounce|oz|eighth|half|quarter|g\b|gram|2\/|3\/|5\/|10\/|15\/|buy|for)/i.test(s)) sc += 3;
        if (/(deli|live resin|rosin|hash|limited|new|active)/i.test(s)) sc += 2;
        if (/\b\d{1,3}\b/.test(s)) sc += 1;
        return sc;
      };

      const best = [...lines].sort((a, b) => score(b.text) - score(a.text))[0];

      // Quick hits: prefer different categories
      const pickedCats = new Set();
      const quick = [];
      for (const item of [...lines].sort((a, b) => score(b.text) - score(a.text))) {
        if (!item) continue;
        if (quick.length >= 4) break;
        if (!pickedCats.has(item.cat)) {
          quick.push(item);
          pickedCats.add(item.cat);
        }
      }
      // fallback
      if (quick.length < 4) {
        for (const item of [...lines].sort((a, b) => score(b.text) - score(a.text))) {
          if (quick.length >= 4) break;
          if (!quick.includes(item)) quick.push(item);
        }
      }

      const emojiFor = (name) => {
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
      };

      const extractBigPrice = (text) => {
        const m = String(text || '').match(/\$\s*\d+/);
        return m ? m[0].replace(/\s+/g, '') : 'DEAL';
      };

      tilesWrap.innerHTML = `
        <a class="dealFeature" href="#deals" data-open-deals>
          <div class="dealFeature__row">
            <div class="dealFeature__k">
              <div class="dealFeature__icon" aria-hidden="true">${esc(emojiFor(best?.cat || 'Deals'))}</div>
              <div class="dealFeature__label">${esc(best?.cat || 'Today’s Featured Deal')}</div>
            </div>
            <div class="dealPill">FEATURED</div>
          </div>

          <div class="dealFeature__hook">${esc(best?.text || 'Deals loading…')}</div>

          <div class="dealFeature__sub">
            <span>Tap for full deal sheet</span>
            <span class="dealFeature__cta">View all deals →</span>
          </div>
        </a>

        <div class="dealQuickGrid">
          ${quick.map(q => `
            <a class="dealQuick" href="#deals" data-open-deals>
              <div class="dealQuick__left">
                <div class="dealQuick__price">${esc(extractBigPrice(q.text))}</div>
                <div class="dealQuick__text">${esc(q.cat)} — ${esc(q.text)}</div>
              </div>
              <div class="dealQuick__arrow" aria-hidden="true">→</div>
            </a>
          `).join('')}
        </div>
      `;
    }

    function renderHighlightsFromConfig(cfg, mount) {
      const slots = cfg?.slots || {};
      const items = cfg?.items || {};

      const hero = items[slots.hero];
      const midL = items[slots.mid_left];
      const midR = items[slots.mid_right];
      const scrollIds = Array.isArray(slots.scroll) ? slots.scroll : [];

      const cardHTML = (item, kind) => {
        const pill = item.pill || '';
        const pillClass = item.pillClass || 'thPill--vapes';
        const title = item.title || '';
        const price = item.price || '';
        const details = item.details || '';
        const cta = item.cta || (kind === 'mini' ? '' : 'View deal');
        const href = item.href || '#deals';
        const img = item.image || '';

        const isMini = kind === 'mini';
        const cardClass =
          kind === 'hero' ? 'thCard thHero thReveal' :
          isMini ? 'thCard thMini thReveal' :
          'thCard thMid thReveal';

        const overlayClass = kind === 'hero' ? 'thOverlay' : 'thOverlay thOverlay--light';
        const contentClass = isMini ? 'thContent thContent--mini' : 'thContent';

        return `
          <a class="${cardClass}" href="${esc(href)}" data-open-deals>
            <div class="thMedia ${kind === 'hero' ? 'thParallax' : ''}" style="background-image:url('${esc(img)}');"></div>
            <div class="${overlayClass}"></div>
            <div class="${contentClass}">
              ${pill ? `<span class="thPill ${esc(pillClass)}">${esc(pill)}</span>` : ''}
              ${isMini ? `<div class="thMiniTitle">${esc(title)}</div>` : `<h3 class="thH3">${esc(title)}</h3>`}
              ${!isMini && price ? `<div class="thPrice">${esc(price)}</div>` : ''}
              ${!isMini && details ? `<div class="thDetails">${esc(details)}</div>` : ''}
              ${!isMini && cta ? `<div class="thCta">${esc(cta)} <span aria-hidden="true">→</span></div>` : ''}
            </div>
          </a>
        `;
      };

      mount.innerHTML = `
        ${hero ? cardHTML(hero, 'hero') : ''}

        <div class="thGrid2">
          ${midL ? cardHTML(midL, 'mid') : ''}
          ${midR ? cardHTML(midR, 'mid') : ''}
        </div>

        <div class="thRowWrap thReveal">
          <div class="thRowTitle">More deals</div>
          <div class="thRow" role="list" aria-label="More deals">
            ${scrollIds.map(id => items[id]).filter(Boolean).map(it => cardHTML(it, 'mini')).join('')}
          </div>
        </div>
      `;
    }
  })();
});
