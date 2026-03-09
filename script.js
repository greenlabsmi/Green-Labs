/* ===========================
   script.js (FULL REPLACEMENT)
   Green Labs — project-page safe + launch-ready
   Fixes:
   - GitHub Pages project pathing (/Green-Labs/)
   - highlights + deals render from deals.json
   - safe image paths (no leading slash)
=========================== */

document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

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

  // Convert "/assets/..." to "./assets/..." so it works on project pages
  function fixAssetPath(p) {
    const s = String(p || '').trim();
    if (!s) return '';
    if (s.startsWith('/assets/')) return `.${s}`;   // "/assets/x" -> "./assets/x"
    if (s.startsWith('assets/')) return `./${s}`;  // "assets/x"  -> "./assets/x"
    return s; // keep full URLs or relative custom paths
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

  // ===== Today’s Highlights FX =====
  function initTodaysHighlightsFX() {
    const root = document.getElementById('todays-highlights');
    if (!root) return;

    const revealEls = Array.from(root.querySelectorAll('.thReveal'));

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

  // Delegated click handler for any element with [data-open-deals]
  document.addEventListener('click', (e) => {
    const hit = e.target.closest('[data-open-deals]');
    if (!hit) return;
    e.preventDefault();
    openDeals(true);
  });

  // ===== Shop reveal + category state =====
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

  // ===== Deals + Highlights render (from deals.json) =====
  (function loadDeals() {
    const dealList = $('#dealList');
    const tilesWrap = $('#dealTiles');
    const highlightsMount = $('#highlightsMount');

    if (!dealList) {
      console.warn('Missing #dealList in HTML. Deals dropdown cannot render.');
      return;
    }

    // IMPORTANT: project-page safe path
    const url = `./deals.json?v=${Date.now()}`;
    console.log('[GreenLabs] Fetching:', url, 'from', location.href);

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
// renderDealTiles(dealsData); // disabled — using Today's Highlights cards only

        if (highlightsMount && data && data.highlights) {
          renderHighlightsFromConfig(data.highlights, highlightsMount);
        } else if (highlightsMount) {
          highlightsMount.innerHTML = '';
        }

        initTodaysHighlightsFX();
      })
      .catch((err) => {
        console.error(err);

        dealList.innerHTML = `
          <div class="cat">
            <div class="catTitle">Deals unavailable right now.</div>
            <div style="font-weight:800;opacity:.75;margin-top:8px;">
              Check that <code>deals.json</code> exists at the published site path and is valid JSON.
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

  // Flatten deals.json into simple "lines"
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

  // Scoring: prefer deal-y lines
  const score = (s) => {
    let sc = 0;
    if (/\$/.test(s)) sc += 4;
    if (/(ounce|oz|eighth|half|quarter|g\b|gram|2\/|3\/|5\/|10\/|15\/|buy|for)/i.test(s)) sc += 3;
    if (/(deli|live resin|rosin|hash|limited|new|active)/i.test(s)) sc += 2;
    if (/\b\d{1,3}\b/.test(s)) sc += 1;
    return sc;
  };

  const sorted = [...lines].sort((a, b) => score(b.text) - score(a.text));

  // Pick featured + some variety
  const pickedCats = new Set();
  const picks = [];

  for (const item of sorted) {
    if (picks.length >= 7) break; // 1 lg + 2 md + 4 sm
    // first: always take best
    if (picks.length === 0) { picks.push(item); pickedCats.add(item.cat); continue; }
    // then prefer different categories
    if (!pickedCats.has(item.cat) || picks.length < 3) {
      picks.push(item);
      pickedCats.add(item.cat);
    }
  }
  while (picks.length < 7 && sorted[picks.length]) picks.push(sorted[picks.length]);

  // Optional: default image per category (so you can start uploading NOW)
  // Put images in: /assets/img/deals/...
  const defaultImgByCat = {
    flower: "./assets/img/deals/flower.jpg",
    vapes: "./assets/img/deals/vapes.jpg",
    edibles: "./assets/img/deals/edibles.jpg",
    prerolls: "./assets/img/deals/prerolls.jpg",
    concentrates: "./assets/img/deals/concentrates.jpg",
    beverages: "./assets/img/deals/beverages.jpg",
    tinctures: "./assets/img/deals/tinctures.jpg",
    topicals: "./assets/img/deals/topicals.jpg",
    deli: "./assets/img/deals/deli.jpg",
  };

  const normCatKey = (catName) => {
    const s = String(catName || '').toLowerCase();
    if (s.includes('pre-roll')) return 'prerolls';
    if (s.includes('pre roll')) return 'prerolls';
    if (s.includes('vape')) return 'vapes';
    if (s.includes('edible') || s.includes('gummi') || s.includes('gummy')) return 'edibles';
    if (s.includes('concentrate')) return 'concentrates';
    if (s.includes('beverage')) return 'beverages';
    if (s.includes('tincture')) return 'tinctures';
    if (s.includes('topical')) return 'topicals';
    if (s.includes('deli')) return 'deli';
    if (s.includes('flower')) return 'flower';
    return '';
  };

  const extractBigPrice = (text) => {
    const m = String(text || '').match(/\$\s*\d+/);
    return m ? m[0].replace(/\s+/g, '') : 'DEAL';
  };

  const tileHTML = (item, i) => {
    const sizeClass = (i === 0) ? "dealTile--lg" : (i < 3 ? "dealTile--md" : "dealTile--sm");

    const cat = item?.cat || "Deals";
    const line = item?.text || "Deals loading…";
    const price = extractBigPrice(line);

    const key = normCatKey(cat);
    const img = fixAssetPath(defaultImgByCat[key] || "");

    return `
      <a class="dealTile ${sizeClass}" href="#deals" data-open-deals>
        <div class="dealTile__inner">
          <div class="dealTile__media">
            ${img ? `<img src="${esc(img)}" alt="">` : ``}
          </div>

          <div class="dealTile__content">
            <div class="dealTile__k">
              <span class="dealTile__tag">${esc(cat)}</span>
              <span style="font-weight:950;opacity:.85;">${esc(price)}</span>
            </div>

            <div class="dealTile__t">${esc(line)}</div>
            <div class="dealTile__s">Tap to view full deal sheet</div>

            <div class="miniCtaRow">
              <span class="dealTile__cta">View deal →</span>
            </div>
          </div>
        </div>
      </a>
    `;
  };

  // Build layout:
  // - Feature grid: 1 LG + 2 MD
  // - Small grid: 4 SM in 2 columns
  const feature = picks.slice(0, 3);
  const small = picks.slice(3, 7);

  tilesWrap.innerHTML = `
    <div class="dealTileGrid dealTileGrid--feature">
      ${feature.map((it, idx) => tileHTML(it, idx)).join('')}
    </div>

    <div style="height:12px;"></div>

    <div class="dealTileGrid dealTileGrid--2">
      ${small.map((it, idx) => tileHTML(it, idx + 3)).join('')}
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
        const img = fixAssetPath(item.image || '');

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
              ${!isMini && cta ? `<div class="thCta">${esc(cta)}</div>` : ''}
            </div>
          </a>
        `;
      };

       <script>
  // Main education card open/close
  document.querySelectorAll('.eduCard').forEach(card => {
    const btn = card.querySelector('.eduCard__toggle');

    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');

      document.querySelectorAll('.eduCard').forEach(other => {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.eduCard__toggle');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        card.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Feel quiz data
  const feelMap = {
    relaxed: {
      title: 'Go for calm, body-friendly, stress-down options.',
      copy: 'You may want terpene-forward flower or products that lean grounding and mellow rather than racey or sharp.',
      chips: ['Myrcene', 'Caryophyllene', 'Linalool', 'Evening vibe'],
      note: 'Ask the Green Labs team for relaxing flower, smooth indicas/hybrids, or low-dose edibles for a softer landing.'
    },
    creative: {
      title: 'Look for bright, clear, idea-friendly profiles.',
      copy: 'You may enjoy products that feel mentally active, upbeat, and less couch-heavy.',
      chips: ['Limonene', 'Pinene', 'Balanced hybrid', 'Daytime vibe'],
      note: 'Ask for something uplifting without feeling too jittery. A flavorful deli flower rec is perfect here.'
    },
    social: {
      title: 'Aim for upbeat, happy, conversation-friendly picks.',
      copy: 'The goal here is feeling present, open, and easygoing without getting too stuck or too heavy.',
      chips: ['Limonene', 'Caryophyllene', 'Hybrid', 'Mood-forward'],
      note: 'Ask your budtender for a strain that feels fun and smooth, not too sleepy and not too intense.'
    },
    sleep: {
      title: 'Go heavier, softer, and more end-of-day.',
      copy: 'For nighttime, many people prefer relaxing, body-heavy products that help them settle down.',
      chips: ['Myrcene', 'Linalool', 'Heavy hybrid', 'Night use'],
      note: 'Ask the Green Labs team for sleepy-time options and start low, especially with edibles.'
    },
    balanced: {
      title: 'A smooth middle lane is probably your best move.',
      copy: 'Balanced shoppers usually want a comfortable experience that stays functional and doesn’t overdo any one direction.',
      chips: ['Hybrid', 'Moderate THC', 'Functional', 'Steady vibe'],
      note: 'This is a great lane for newer shoppers or anyone wanting something versatile.'
    }
  };

  const feelButtons = document.querySelectorAll('.feelBtn');
  const feelResult = document.getElementById('feelResult');
  const feelTitle = document.getElementById('feelTitle');
  const feelCopy = document.getElementById('feelCopy');
  const feelChips = document.getElementById('feelChips');
  const feelNote = document.getElementById('feelNote');

  feelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.feel;
      const data = feelMap[key];
      if (!data) return;

      feelTitle.textContent = data.title;
      feelCopy.textContent = data.copy;
      feelNote.textContent = data.note;

      feelChips.innerHTML = data.chips
        .map(chip => `<span class="feelChip">${chip}</span>`)
        .join('');

      feelResult.hidden = false;

      feelButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
</script>

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
