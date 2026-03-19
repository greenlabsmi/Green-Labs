/* ===========================
   script.js (FULL REPLACEMENT)
   Green Labs — project-page safe + launch-ready
   Fixes:
   - GitHub Pages project pathing (/Green-Labs/)
   - highlights + deals render from deals.json
   - safe image paths (no leading slash)
=========================== */

document.addEventListener('DOMContentLoaded', () => {

   // ===== AGE GATE & SMART PROMO LOGIC =====
    const ageGate = document.getElementById('ageGate');
    const promoModal = document.getElementById('promoModal');
    const btnPass = document.getElementById('btnAgePass');
    const btnFail = document.getElementById('btnAgeFail');

    // 1. Show Age Gate if not verified
    if (ageGate && !localStorage.getItem('gl_age_verified')) {
        ageGate.removeAttribute('hidden');
        document.body.style.overflow = 'hidden'; 
    }

    // 2. "Yes, I am 21" Logic
    if (btnPass) {
        btnPass.addEventListener('click', () => {
            localStorage.setItem('gl_age_verified', 'true');
            ageGate.setAttribute('hidden', 'true');
            document.body.style.overflow = ''; 

            // Only show the gift popup if they haven't dismissed it before
            if (!localStorage.getItem('gl_gift_claimed')) {
                setTimeout(() => {
                    showGiftPopup();
                }, 10000); // 10 Second Delay
            }
        });
    }

    // 3. "No, I am not" Logic
    if (btnFail) {
        btnFail.addEventListener('click', () => {
            window.location.href = "https://www.google.com";
        });
    }

    // 4. Promo Popup Function
    function showGiftPopup() {
        if (!promoModal) return;
        promoModal.removeAttribute('hidden');
        
        const closeBtn = document.getElementById('btnClosePromo');
        const okBtn = document.getElementById('btnPromoOk');
        
        [closeBtn, okBtn].forEach(b => b?.addEventListener('click', () => {
            promoModal.setAttribute('hidden', 'true');
            localStorage.setItem('gl_gift_claimed', 'true');
        }));
    }

    // 5. Drawer "Safety Net" Button Logic
    document.querySelector('[data-open-promo]')?.addEventListener('click', (e) => {
        e.preventDefault();
        showGiftPopup();
        // Close the drawer so they can see the popup
        document.getElementById('navDrawer')?.classList.remove('is-active');
        document.getElementById('menuOverlay')?.classList.remove('is-active');
    });
   
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

function smoothTo(el) {
    if (!el) return;
    
    // Always assume 70px because the status strip hides on scroll!
    const stickyH = 70; 
    
    // Dropped the offset down to 20 so sections fit perfectly snug under the header!
    const yPos = el.getBoundingClientRect().top + window.pageYOffset - (stickyH + 20);
    
    window.scrollTo({
        top: Math.max(0, yPos),
        behavior: prefersReduce ? 'auto' : 'smooth'
    });
}

// ===== MASTER SCROLL INTERCEPTOR =====
// Catches ALL native links and buttons to completely stop browser "jumping"
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  const scrollBtn = e.target.closest('[data-scroll]');
  
  let targetSelector = null;
  if (scrollBtn) {
    targetSelector = scrollBtn.getAttribute('data-scroll');
  } else if (link) {
    targetSelector = link.getAttribute('href');
  }

  if (targetSelector && targetSelector !== '#') {
    const targetEl = document.querySelector(targetSelector);
    if (targetEl) {
      e.preventDefault(); // Kills the native broken browser jump
      smoothTo(targetEl);
    }
  }
});

// ===== SMART STICKY HEADER TRIGGER =====
  // Hides the status strip when scrolling down
  const handleSmartScroll = () => {
      if (window.scrollY > 50) {
          document.body.classList.add('is-scrolled');
      } else {
          document.body.classList.remove('is-scrolled');
      }
  };
  window.addEventListener('scroll', handleSmartScroll, { passive: true });

// ===== SCROLL REVEAL ANIMATIONS =====
  // Watches for elements with the .reveal class and fades them in
  const revealOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 // Triggers when 15% of the element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              observer.unobserve(entry.target); // Stops watching once it fades in
          }
      });
  }, revealOptions);

  // Find all .reveal elements and start observing them
  document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
  });

// ===== SMART NATIVE MAPS ROUTER =====
document.addEventListener('DOMContentLoaded', () => {
  // 1. Rock-solid Apple device detection (catches iPhones, iPads, and touch Macs)
  const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                  (navigator.userAgent.includes("Mac") && "ontouchend" in document);

  // 2. Grab every map link on the page
  const mapLinks = document.querySelectorAll('a[href*="google.com/maps"]');

  mapLinks.forEach(link => {
    if (isApple) {
      // 3. Rewrite the HTML link permanently to Apple Maps directions
      const address = "10701 Madison St, Luna Pier, MI 48157";
      link.href = `https://maps.apple.com/?daddr=${encodeURIComponent(address)}`;
      
      // 4. Remove target="_blank" so it launches the app natively without opening a dead Safari tab
      link.removeAttribute('target');
    }
  });
});

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

 function openShop(scrollAlso, shopType = 'rec') {
    if (menuWrap) menuWrap.hidden = false;
    
    // Silently saves their choice (rec or med) to browser memory for Leafly to use later!
    try {
        localStorage.setItem('gl_shopping_mode', shopType);
    } catch {}

    const shop = $('#shop');
    if (scrollAlso && shop) smoothTo(shop);
}

$$('[data-open-shop]').forEach(el => 
    el.addEventListener('click', (e) => {
        e.preventDefault();
        // Grabs 'rec' or 'med' from the specific button they clicked
        const type = el.getAttribute('data-open-shop') || 'rec';
        openShop(true, type);
    })
);

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
      
      // Let the JSON file do all the work
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
    const drop = document.getElementById('dealsDrop');
    const backTop = document.getElementById('drBackTop');
    
    if (!drop || !backTop) return;

    // A simple, bulletproof click to jump to the top!
    backTop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); 
        
        const dealsDropTarget = document.getElementById('dealsDrop');
        smoothTo(dealsDropTarget); 
    });
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
          <div class="drLine" data-line data-search="${esc(`${cat.category} ${group.title || ''} ${line}`.toLowerCase())}">
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
              <h3 class="drCat__title">${esc(cat.category)}</h3>
            </div>
            <div class="drCat__count">${lineCount} deal${lineCount === 1 ? '' : 's'}</div>
          </div>
          ${groupsHtml}
        </section>
      `;
    }).join('') + `
<div class="drTaxBanner">
        <strong>Pricing Update:</strong> All prices are shown <strong>Pre-Tax</strong>. Recreational orders include a 16% state tax.
      </div>`;
   
    if (jumpWrap) {
      // Prepend an "All Deals" button that jumps to the top of the deals container
      jumpWrap.innerHTML = `
        <button class="drJumpChip" type="button" data-jump="#dealsDrop">
          All Deals
        </button>
      ` + cats.map(cat => `
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
})();
   
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

            // Close all other cards first
            cards.forEach((otherCard) => {
                otherCard.classList.remove('is-open');
                const otherBtn = otherCard.querySelector('.guideCard__toggle');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            // If it wasn't open, open it and scroll to it smoothly!
            if (!isOpen) {
                card.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');

                // Wait just a split second for the CSS animation to start expanding
                setTimeout(() => {
                    // Hardcoded to 70 to match the final shrunk header height
                    const stickyH = 70;

                    // Match the 20px offset here!
                    const yPos = card.getBoundingClientRect().top + window.pageYOffset - (stickyH + 20);
                    window.scrollTo({
                        top: Math.max(0, yPos),
                        behavior: 'smooth'
                    });
                }, 350);
            }
        });
    });
})(); // <--- THIS perfectly closes the Buy Guide!

// ===== Today's Highlights Render Function =====
function renderHighlightsFromConfig(data, mount) {
    if (!data || !data.items || !data.layout) return;

    const { items, layout } = data;
    const hero = items[layout.hero];
    const midL = layout.mid ? items[layout.mid[0]] : null;
    const midR = layout.mid ? items[layout.mid[1]] : null;
    const scrollIds = layout.scroll || [];

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

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
                ${it.price ? `<div class="thPrice">${esc(it.price)} <span class="thTaxTag">+ TAX</span></div>` : ''}
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
});

document.addEventListener('DOMContentLoaded', () => {
  // ===== DUTCH DELI INTERACTIVITY =====
  
  // 1. Haptic Feedback function for flips and snaps
  window.triggerHaptic = function() {
    if (navigator.vibrate) {
      navigator.vibrate(30); // A short, premium-feeling physical tap on mobile
    }
  };

  // 2. Sticky Quick Filters Logic
  const filterBtns = document.querySelectorAll('.deli-filter');
  const deliCards = document.querySelectorAll('.deli-card-wrapper');
  const deliCarousel = document.getElementById('deliCarousel');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Trigger haptic on filter tap
      triggerHaptic();

      // Update active state on buttons
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filterVal = btn.getAttribute('data-filter');

      // Filter the cards
      deliCards.forEach(card => {
        // Handle multiple categories separated by spaces
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.classList.remove('is-hidden');
          // Add a tiny animation reset for a clean reveal
          card.style.opacity = '0';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.classList.add('is-hidden');
        }
      });

     // Smooth scroll the carousel back to the start when filtered
      if (deliCarousel) {
        deliCarousel.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });
  }); // <--- THIS closes the filter buttons loop!

  // 3. Carousel Scroll Arrows
  const deliLeft = document.getElementById('deliArrowLeft');
  const deliRight = document.getElementById('deliArrowRight');

  if (deliCarousel && deliLeft && deliRight) {
    deliLeft.addEventListener('click', (e) => {
      e.preventDefault();
      // Scrolls backward by roughly the width of one card
      deliCarousel.scrollBy({ left: -260, behavior: 'smooth' });
    });
    
    deliRight.addEventListener('click', (e) => {
      e.preventDefault();
      // Scrolls forward by roughly the width of one card
      deliCarousel.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
   
  // ===== DEALS DROPDOWN LOGIC =====
    const dealsDrop = document.getElementById('dealsDrop');
    const dealsSummary = document.querySelector('.drDrop__summary');
    const dealsBody = document.querySelector('.drDrop__body');

    if (dealsDrop && dealsSummary && dealsBody) {
        // 1. Force the HTML to stay "open" so our CSS animation can run smoothly
        dealsDrop.setAttribute('open', 'true');

        // 2. Summary Click (The Header)
        dealsSummary.addEventListener('click', (e) => {
            e.preventDefault(); // Stops the browser's clunky default snap
            dealsDrop.classList.toggle('is-fully-open');
        });

        // 3. Body Click (The Peeking Deals)
        dealsBody.addEventListener('click', (e) => {
            // If it's closed and they click a deal (but NOT the search bar), open it!
            if (!dealsDrop.classList.contains('is-fully-open') && !e.target.closest('.drSearch')) {
                dealsDrop.classList.add('is-fully-open');
            }
        });
    }
     
     // Scroll Category Arrows
    const dealJumpWrap = document.getElementById('dealJumpWrap');
    const leftArrow = document.getElementById('jumpArrowLeft');
    const rightArrow = document.getElementById('jumpArrowRight');

    if (dealJumpWrap && leftArrow && rightArrow) {
      leftArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stops dropdown from misbehaving
        dealJumpWrap.scrollBy({ left: -250, behavior: 'smooth' });
      });
      
      rightArrow.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dealJumpWrap.scrollBy({ left: 250, behavior: 'smooth' });
      });
  }
});

// =========================================================
// DTG DYNAMIC GENETICS & MODAL (Shared with Brand Site)
// =========================================================
document.addEventListener('DOMContentLoaded', async () => {
    let strains = [];
    try {
        const response = await fetch('https://greenlabsmi.github.io/Dutch_Touch_Brand/strains.json');
        strains = await response.json();
        renderFeaturedGenetics(strains);
    } catch (error) {
        console.error('Failed to load strains:', error);
    }

    function renderFeaturedGenetics(data) {
        const mount = document.getElementById('current-strains');
        if (!mount) return;

        // 1. CLEAR the mount point first to ensure old cards are gone
        mount.innerHTML = '';

        // 2. Filter for ONLY Award Winners
        const featured = data.filter(s => s.award === true);

        // 3. Render the champions
        mount.innerHTML = featured.map(s => {
            const img = 'https://greenlabsmi.github.io/Dutch_Touch_Brand/' + (s.image || 'assets/img/logo/dtg-logo-orange.png');
            
            return `
            <article class="strain-card award-card" id="strain-${s.slug}">
                <div class="award-badge-corner">AWARD WINNER</div>
                <div class="strain-card-inner">
                    <div class="strain-image" style="background-image: url('${img}');"></div>
                    <div class="strain-top">
                        <h3 class="strain-name">${s.name}</h3>
                        <span class="strain-badge">${s.type.toUpperCase()}</span>
                    </div>
                    <p class="strain-meta">${s.lineage}</p>
                    <p class="strain-notes">Genetics by ${s.breeder}. ${s.description}</p>
                </div>
            </article>
            `;
        }).join('');
    }

    // The FULL Modal HTML setup
    const modalHTML = `
        <div class="strain-modal" id="glStrainModal">
            <div class="strain-modal-dialog">
                <button class="strain-modal-close" id="glCloseModal">&times;</button>
                <div class="strain-modal-layout">
                    <div class="strain-modal-media"><img id="glModalImage" src="" alt="" class="strain-modal-image"></div>
                    <div class="strain-modal-body">
                        <div class="strain-modal-badge" id="glModalBreeder"></div>
                        <h3 class="strain-modal-title" id="glModalName"></h3>
                        <div class="strain-modal-info">
                            <p><span>TYPE</span> <strong id="glModalType" style="color:#fff;"></strong></p>
                            <p><span>LINEAGE</span> <strong id="glModalLineage" style="color:#fff;"></strong></p>
                            <p><span>THC</span> <strong id="glModalThc" style="color:#fff;"></strong></p>
                        </div>
                        <p class="strain-modal-desc" id="glModalDesc"></p>
                        <div class="strain-modal-cta">
                            <a href="https://greenlabsmi.github.io/Dutch_Touch_Brand/strains.html" class="btn btn--gold" style="width: 100%;"> Explore DTG Vault &rarr; </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('glStrainModal');
    const closeBtn = document.getElementById('glCloseModal');

    // Click handler for dynamic cards
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.strain-card');
        if (!card) return;

        const name = card.querySelector('.strain-name').innerText;
        const s = strains.find(item => item.name === name);
        if (s) {
            document.getElementById('glModalName').innerText = s.name;
            document.getElementById('glModalBreeder').innerText = "Genetics by " + s.breeder;
            document.getElementById('glModalType').innerText = s.type.toUpperCase();
            document.getElementById('glModalLineage').innerText = s.lineage;
            document.getElementById('glModalThc').innerText = s.thc || "N/A";
            document.getElementById('glModalDesc').innerText = s.description;
            
            const imgEl = document.getElementById('glModalImage');
            imgEl.src = 'https://greenlabsmi.github.io/Dutch_Touch_Brand/' + (s.image || 'assets/img/logo/dtg-logo-orange.png');
            
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });

    const closeDialog = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
    if (closeBtn) closeBtn.addEventListener('click', closeDialog);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeDialog(); });
});

/* --- ARTWORK TOGGLE "WIND" EFFECT --- */
document.addEventListener('DOMContentLoaded', () => {
  const artToggleBtn = document.getElementById('art-mode-toggle');
  
  // Note: Targeting your exact .deli-card class!
  const deliCards = document.querySelectorAll('.deli-card'); 

  if (!artToggleBtn || deliCards.length === 0) return;

  artToggleBtn.addEventListener('click', () => {
    // 1. Visually flip the toggle switch to gold
    artToggleBtn.classList.toggle('active');
    const isArtMode = artToggleBtn.classList.contains('active');

    // 2. Create the Left-to-Right wind effect
    deliCards.forEach(card => {
      // Find where this specific card is on the user's screen right now
      const rect = card.getBoundingClientRect();
      
      // Calculate delay based on distance from the left edge of the screen.
      // Math.max(0, ...) ensures off-screen left tiles flip instantly.
      // Multiply by 0.6 to control wind speed (lower = faster wind).
      const delay = Math.max(0, rect.left) * 0.6; 
      
      // Apply the delay, then flip!
      card.style.transitionDelay = `${delay}ms`;

      if (isArtMode) {
        card.classList.add('is-flipped');
      } else {
        card.classList.remove('is-flipped');
      }
      
      // Optional cleanup: remove the delay after the animation finishes 
      // so normal clicking feels instant again.
      setTimeout(() => {
        card.style.transitionDelay = '0ms';
      }, delay + 800); 
    });
  });
});
