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

   function slugifyDealCategory(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function emojiForDealCategory(label = '') {
  const k = String(label).toLowerCase();
  if (k.includes('flower')) return '🌿';
  if (k.includes('vape')) return '💨';
  if (k.includes('edible')) return '🍬';
  if (k.includes('concentrate')) return '🧊';
  if (k.includes('pre-roll') || k.includes('preroll')) return '🥇';
  if (k.includes('accessor')) return '🧰';
  if (k.includes('dtg') || k.includes('dutch')) return '🏆';
  if (k.includes('topical')) return '🧴';
  if (k.includes('tincture')) return '💧';
  return '•';
}

function highlightDealMatch(text, query) {
  if (!query) return esc(text);
  const safe = esc(text);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try {
    return safe.replace(new RegExp(`(${escapedQuery})`, 'ig'), '<mark>$1</mark>');
  } catch {
    return safe;
  }
}

function normalizeDealsData(data) {
  if (!Array.isArray(data)) return [];

  return data.map((cat) => {
    const category = cat.category || 'Deals';
    const id = slugifyDealCategory(category);

    let groups = [];

    if (Array.isArray(cat.groups) && cat.groups.length) {
      groups = cat.groups.map((g) => ({
        title: g.title || '',
        lines: Array.isArray(g.items) ? g.items.filter(Boolean) : []
      }));
    } else if (Array.isArray(cat.items) && cat.items.length) {
      groups = [{
        title: '',
        lines: cat.items.filter(Boolean)
      }];
    }

    return { category, id, groups };
  }).filter(cat => cat.groups.some(g => g.lines.length));
}

function bindDealJumpChips() {
  const wrap = document.getElementById('dealJumpWrap');
  if (!wrap) return;

  wrap.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSel = btn.getAttribute('data-jump');
      const target = document.querySelector(targetSel);
      if (!target) return;

      wrap.querySelectorAll('.drJumpChip').forEach(chip => chip.classList.remove('is-active'));
      btn.classList.add('is-active');

      target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function bindDealSearch() {
  const input = document.getElementById('dealSearch');
  const meta = document.getElementById('dealSearchMeta');
  const cats = document.querySelectorAll('[data-category-block]');
  const lines = document.querySelectorAll('[data-line]');
  if (!input || !cats.length) return;

  const run = () => {
    const q = input.value.trim().toLowerCase();

    let visibleCategories = 0;
    let visibleLines = 0;

    lines.forEach(line => {
      const hay = line.getAttribute('data-search') || '';
      const textEl = line.querySelector('[data-line-text]');
      const originalText = textEl ? textEl.textContent : '';

      const match = !q || hay.includes(q);
      line.classList.toggle('is-hidden', !match);

      if (textEl) {
        textEl.innerHTML = match ? highlightDealMatch(originalText, q) : esc(originalText);
      }

      if (match) visibleLines++;
    });

    cats.forEach(cat => {
      const catLines = cat.querySelectorAll('[data-line]');
      const visibleCatLines = [...catLines].filter(line => !line.classList.contains('is-hidden'));

      const groups = cat.querySelectorAll('[data-group]');
      groups.forEach(group => {
        const groupLines = group.querySelectorAll('[data-line]');
        const hasVisible = [...groupLines].some(line => !line.classList.contains('is-hidden'));
        group.style.display = hasVisible ? '' : 'none';
      });

      const hasVisibleCategory = visibleCatLines.length > 0;
      cat.classList.toggle('is-hidden', !hasVisibleCategory);

      if (hasVisibleCategory) visibleCategories++;
    });

    if (meta) {
      if (q) {
        meta.hidden = false;
        meta.textContent = visibleLines
          ? `Showing ${visibleLines} matching deal${visibleLines === 1 ? '' : 's'} across ${visibleCategories} categor${visibleCategories === 1 ? 'y' : 'ies'}.`
          : `No deals matched “${input.value.trim()}”. Try another keyword like flower, ounce, deli, carts, or edible.`;
      } else {
        meta.hidden = true;
        meta.textContent = '';
      }
    }
  };

  input.addEventListener('input', run);
}

function bindDealBackTop() {
  const details = document.getElementById('dealsDrop');
  const backTop = document.getElementById('drBackTop');
  if (!details || !backTop) return;

  const toggleVisibility = () => {
    backTop.hidden = !details.open;
  };

  details.addEventListener('toggle', toggleVisibility);

  backTop.addEventListener('click', () => {
    const summary = details.querySelector('summary');
    if (summary) {
      summary.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
    } else {
      details.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
    }
  });

  toggleVisibility();
}

function slugifyDealCategory(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function emojiForDealCategory(label = '') {
  const k = String(label).toLowerCase();
  if (k.includes('flower')) return '🌿';
  if (k.includes('vape')) return '💨';
  if (k.includes('edible')) return '🍬';
  if (k.includes('concentrate')) return '🧊';
  if (k.includes('pre-roll') || k.includes('preroll')) return '🥇';
  if (k.includes('accessor')) return '🧰';
  if (k.includes('dtg') || k.includes('dutch')) return '🏆';
  if (k.includes('topical')) return '🧴';
  if (k.includes('tincture')) return '💧';
  return '•';
}

function highlightDealMatch(text, query) {
  if (!query) return esc(text);
  const safe = esc(text);
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try {
    return safe.replace(new RegExp(`(${escapedQuery})`, 'ig'), '<mark>$1</mark>');
  } catch {
    return safe;
  }
}

function normalizeDealsData(data) {
  if (!Array.isArray(data)) return [];

  return data.map((cat) => {
    const category = cat.category || 'Deals';
    const id = slugifyDealCategory(category);

    let groups = [];

    if (Array.isArray(cat.groups) && cat.groups.length) {
      groups = cat.groups.map((g) => ({
        title: g.title || '',
        lines: Array.isArray(g.items) ? g.items.filter(Boolean) : []
      }));
    } else if (Array.isArray(cat.items) && cat.items.length) {
      groups = [{
        title: '',
        lines: cat.items.filter(Boolean)
      }];
    }

    return { category, id, groups };
  }).filter(cat => cat.groups.some(g => g.lines.length));
}

function bindDealJumpChips() {
  const wrap = document.getElementById('dealJumpWrap');
  if (!wrap) return;

  wrap.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSel = btn.getAttribute('data-jump');
      const target = document.querySelector(targetSel);
      if (!target) return;

      wrap.querySelectorAll('.drJumpChip').forEach(chip => chip.classList.remove('is-active'));
      btn.classList.add('is-active');

      target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function bindDealSearch() {
  const input = document.getElementById('dealSearch');
  const meta = document.getElementById('dealSearchMeta');
  const cats = document.querySelectorAll('[data-category-block]');
  const lines = document.querySelectorAll('[data-line]');
  if (!input || !cats.length) return;

  const run = () => {
    const q = input.value.trim().toLowerCase();

    let visibleCategories = 0;
    let visibleLines = 0;

    lines.forEach(line => {
      const hay = line.getAttribute('data-search') || '';
      const textEl = line.querySelector('[data-line-text]');
      const originalText = textEl ? textEl.textContent : '';

      const match = !q || hay.includes(q);
      line.classList.toggle('is-hidden', !match);

      if (textEl) {
        textEl.innerHTML = match ? highlightDealMatch(originalText, q) : esc(originalText);
      }

      if (match) visibleLines++;
    });

    cats.forEach(cat => {
      const catLines = cat.querySelectorAll('[data-line]');
      const visibleCatLines = [...catLines].filter(line => !line.classList.contains('is-hidden'));

      const groups = cat.querySelectorAll('[data-group]');
      groups.forEach(group => {
        const groupLines = group.querySelectorAll('[data-line]');
        const hasVisible = [...groupLines].some(line => !line.classList.contains('is-hidden'));
        group.style.display = hasVisible ? '' : 'none';
      });

      const hasVisibleCategory = visibleCatLines.length > 0;
      cat.classList.toggle('is-hidden', !hasVisibleCategory);

      if (hasVisibleCategory) visibleCategories++;
    });

    if (meta) {
      if (q) {
        meta.hidden = false;
        meta.textContent = visibleLines
          ? `Showing ${visibleLines} matching deal${visibleLines === 1 ? '' : 's'} across ${visibleCategories} categor${visibleCategories === 1 ? 'y' : 'ies'}.`
          : `No deals matched “${input.value.trim()}”. Try another keyword like flower, ounce, deli, carts, or edible.`;
      } else {
        meta.hidden = true;
        meta.textContent = '';
      }
    }
  };

  input.addEventListener('input', run);
}

function bindDealBackTop() {
  const details = document.getElementById('dealsDrop');
  const backTop = document.getElementById('drBackTop');
  if (!details || !backTop) return;

  const toggleVisibility = () => {
    backTop.hidden = !details.open;
  };

  details.addEventListener('toggle', toggleVisibility);

  backTop.addEventListener('click', () => {
    const summary = details.querySelector('summary');
    if (summary) {
      summary.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
    } else {
      details.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth', block: 'start' });
    }
  });

  toggleVisibility();
}

function renderDealsDropdown(data) {
  const jumpWrap = document.getElementById('dealJumpWrap');
  const searchMeta = document.getElementById('dealSearchMeta');

  const cats = normalizeDealsData(data);

  if (!cats.length) {
    dealList.innerHTML = '<div class="drEmpty">No deals available right now.</div>';
    if (jumpWrap) jumpWrap.innerHTML = '';
    if (searchMeta) {
      searchMeta.hidden = true;
      searchMeta.textContent = '';
    }
    return;
  }

  dealList.innerHTML = cats.map(cat => {
    const lineCount = cat.groups.reduce((sum, g) => sum + g.lines.length, 0);

    const groupsHtml = cat.groups.map(group => {
      const linesHtml = group.lines.map(line => `
        <div class="drLine" data-line data-search="${esc(
          `${cat.category} ${group.title || ''} ${line}`.toLowerCase()
        )}">
          <div class="drLine__dot" aria-hidden="true">•</div>
          <div class="drLine__text" data-line-text>${esc(line)}</div>
        </div>
      `).join('');

      return `
        <div class="drGroup" data-group>
          ${group.title ? `<div class="drGroup__title">${esc(group.title)}</div>` : ''}
          <div class="drLines">
            ${linesHtml}
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="drCat" id="deal-cat-${cat.id}" data-category-block data-category-name="${esc(cat.category.toLowerCase())}">
        <div class="drCat__head">
          <div class="drCat__titleWrap">
            <div class="drCat__icon" aria-hidden="true">${emojiForDealCategory(cat.category)}</div>
            <h3 class="drCat__title">${esc(cat.category)}</h3>
          </div>
          <div class="drCat__count">${lineCount} deal${lineCount === 1 ? '' : 's'}</div>
        </div>
        ${groupsHtml}
      </section>
    `;
  }).join('') + `<div style="margin-top:10px;font-weight:800;opacity:.70;">All prices include tax.</div>`;

  if (jumpWrap) {
    jumpWrap.innerHTML = cats.map(cat => `
      <button class="drJumpChip" type="button" data-jump="#deal-cat-${cat.id}">
        ${esc(cat.category.replace(/^[^\w]+/, '').trim())}
      </button>
    `).join('');
  }

  if (searchMeta) {
    searchMeta.hidden = true;
    searchMeta.textContent = '';
  }

  bindDealJumpChips();
  bindDealSearch();
  bindDealBackTop();
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

/* =========================================================
   GREEN LABS — BUY GUIDE
========================================================= */
(function () {
  const cards = document.querySelectorAll('[data-guide-card]');

  cards.forEach((card) => {
    const btn = card.querySelector('.guideCard__toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');

      cards.forEach((otherCard) => {
        otherCard.classList.remove('is-open');
        const otherBtn = otherCard.querySelector('.guideCard__toggle');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        card.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const vibeData = {
    relaxed: {
      title: 'You may want something calm, body-friendly, and terpene-forward.',
      text: 'Look for flower or products that lean mellow, grounding, and less racey. This is a great lane for people trying to unwind, settle in, or slow the day down.',
      chips: ['Myrcene', 'Caryophyllene', 'Evening vibe', 'Relaxing flower'],
      note: 'Ask the team about relaxing Dutch Deli flower or softer, balanced options if you want a smoother ride.'
    },
    creative: {
      title: 'You may want something bright, clear, and idea-friendly.',
      text: 'Look for profiles that feel uplifting, flavorful, and mentally active without being too sharp or overwhelming.',
      chips: ['Limonene', 'Pinene', 'Daytime vibe', 'Uplifting'],
      note: 'A terpene-forward Dutch Touch Genetics recommendation could be a great place to start here.'
    },
    social: {
      title: 'You may want something upbeat, happy, and conversation-friendly.',
      text: 'This lane is great for feeling open, present, and engaged without going too sleepy or too heavy.',
      chips: ['Hybrid', 'Mood-forward', 'Limonene', 'Balanced energy'],
      note: 'Tell your budtender you want something fun and smooth, not too sleepy and not too intense.'
    },
    sleepy: {
      title: 'You may want something heavier, softer, and more end-of-day.',
      text: 'For nighttime, many people prefer body-forward products that help them settle down and quiet the pace a little.',
      chips: ['Myrcene', 'Linalool', 'Night use', 'Heavy hybrid'],
      note: 'Ask about evening flower, mellow edibles, or relaxing Dutch Deli options — and always start low.'
    },
    balanced: {
      title: 'You may want a smooth middle lane that stays comfortable and functional.',
      text: 'Balanced shoppers usually want something steady, enjoyable, and versatile without going too far in any one direction.',
      chips: ['Hybrid', 'Moderate THC', 'Functional', 'Steady vibe'],
      note: 'This is a strong choice for newer shoppers or anyone wanting something flexible and easygoing.'
    }
  };

  const vibeButtons = document.querySelectorAll('.vibeBtn');
  const vibeResult = document.getElementById('vibeResult');
  const vibeResultTitle = document.getElementById('vibeResultTitle');
  const vibeResultText = document.getElementById('vibeResultText');
  const vibeResultChips = document.getElementById('vibeResultChips');
  const vibeResultNote = document.getElementById('vibeResultNote');

  vibeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.vibe;
      const data = vibeData[key];
      if (!data) return;

      vibeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      vibeResultTitle.textContent = data.title;
      vibeResultText.textContent = data.text;
      vibeResultNote.textContent = data.note;
      vibeResultChips.innerHTML = data.chips
        .map((chip) => `<span class="vibeResult__chip">${chip}</span>`)
        .join('');

      vibeResult.hidden = false;
    });
  });
})();

   // ===== Today's Highlights Render Function =====
  function renderHighlightsFromConfig(data, mount) {
    if (!data || !data.items || !data.layout) return;
    const { items, layout } = data;

    const hero = items[layout.hero];
    const midL = layout.mid ? items[layout.mid[0]] : null;
    const midR = layout.mid ? items[layout.mid[1]] : null;
    const scrollIds = layout.scroll || [];

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    const cardHTML = (it, type) => {
      if (!it) return '';
      let sizeClass = type === 'hero' ? 'thHero thReveal' : type === 'mid' ? 'thMid thReveal' : 'thMini';
      const pillClass = it.tag ? `thPill--${it.tag.toLowerCase().replace(/[^a-z]/g, '')}` : '';
      
      // Fix image paths for GitHub Pages
      let img = it.image || '';
      if (img && img.startsWith('/assets/')) img = `.${img}`;

      if (type === 'mini') {
        return `
          <a href="#deals" class="thCard ${sizeClass}" data-open-deals>
            <div class="thMedia" style="background-image:url('${esc(img)}')"></div>
            <div class="thOverlay"></div>
            <div class="thContent thContent--mini" style="position:absolute; bottom:0; width:100%;">
              ${it.tag ? `<div class="thPill ${pillClass}">${esc(it.tag)}</div>` : ''}
              <div class="thMiniTitle" style="color:#fff;">${esc(it.title)}</div>
            </div>
          </a>
        `;
      }

      return `
        <a href="#deals" class="thCard ${sizeClass}" data-open-deals>
          <div class="thMedia" style="background-image:url('${esc(img)}')"></div>
          <div class="thOverlay"></div>
          <div class="thContent">
            ${it.tag ? `<div class="thPill ${pillClass}">${esc(it.tag)}</div>` : ''}
            <h3 class="thH3">${esc(it.title)}</h3>
            ${it.price ? `<div class="thPrice">${esc(it.price)}</div>` : ''}
            ${it.details ? `<div class="thDetails">${esc(it.details)}</div>` : ''}
            <div class="thCta">Shop Deal →</div>
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
