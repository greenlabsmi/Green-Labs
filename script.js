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
    if (ageGate && !sessionStorage.getItem('gl_age_verified')) {
        ageGate.removeAttribute('hidden');
        document.body.style.overflow = 'hidden'; 
    }

    // 2. "Yes, I am 21" Logic
    if (btnPass) {
        btnPass.addEventListener('click', () => {
           sessionStorage.setItem('gl_age_verified', 'true');
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
  const stripOffset = window.pageYOffset < 50 ? 34 : 0;
  const yPos = el.getBoundingClientRect().top + window.pageYOffset - (stickyH + 20) - stripOffset;
  
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

// ===== Shop reveal & Leafly Injection =====
const shopSection = document.getElementById('shop');
const leaflyWrapper = document.getElementById('leafly-embed-wrapper');
let currentLeaflyType = null; 

function injectLeafly(shopType) {
    if (!leaflyWrapper) return;
    if (currentLeaflyType === shopType) return;
    
    if (currentLeaflyType !== null) {
        window.location.hash = 'shop-' + shopType;
        window.location.reload();
        return;
    }

    const s = document.createElement('script');
    s.id = 'leafly-embed-script'; 
    s.src = 'https://web-embedded-menu.leafly.com/loader.js';
    s.dataset.origin = 'https://web-embedded-menu.leafly.com';
    s.dataset.slug = 'green-labs-provisions'; 
    s.dataset.environment = shopType === 'med' ? 'medical' : 'recreational';
    s.dataset.primary = '#0B7D5A';   
    s.dataset.secondary = '#D6A34A'; 
    s.dataset.deals = '#2ef8bb';     
    
    leaflyWrapper.appendChild(s);
    currentLeaflyType = shopType;
}

function openShop(scrollAlso, shopType = 'rec') {
    if (typeof menuWrap !== 'undefined' && menuWrap) menuWrap.hidden = false;
    if (shopSection) shopSection.hidden = false;
    
    const giantBtn = document.querySelector('.drShopBtn');
    if (giantBtn) giantBtn.style.display = 'none';

    injectLeafly(shopType);

    if (scrollAlso && shopSection) {
        setTimeout(() => {
            shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
}

// Auto-open menu if the page just refreshed to swap Rec/Med
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash === '#shop-med') {
        openShop(true, 'med');
        history.replaceState(null, null, ' '); 
    } else if (window.location.hash === '#shop-rec') {
        openShop(true, 'rec');
        history.replaceState(null, null, ' '); 
    }
});

// INTERCEPT CLICKS ON ANY SHOP BUTTON (New Popup Logic)
document.querySelectorAll('[data-open-shop]').forEach(el => 
    el.addEventListener('click', (e) => {
        e.preventDefault();
        
        const btnText = el.textContent.toLowerCase();
        const tagValue = el.getAttribute('data-open-shop');
        
        // If it's the Med button, scroll to the shop AND open the Popup!
        if (tagValue === 'med' || btnText.includes('med')) {
            // Unhide the shop section so we can scroll to it
            if (shopSection) shopSection.hidden = false;
            
            // Scroll down in the background
            setTimeout(() => {
                if (shopSection) shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
            
            // Open the modal
            const modal = document.getElementById('med-promo-modal');
            if (modal) modal.hidden = false;
        } else {
            // Otherwise, open the shop normally (Rec)
            openShop(true, 'rec');
        }
    })
);

// POPUP BUTTON LOGIC
document.getElementById('close-med-modal')?.addEventListener('click', () => {
    document.getElementById('med-promo-modal').hidden = true;
});

document.getElementById('proceed-to-shop')?.addEventListener('click', () => {
    // Hide the popup and load the Leafly menu right in front of them!
    document.getElementById('med-promo-modal').hidden = true;
    openShop(true, 'rec'); 
});

// POPUP BUTTON LOGIC
document.getElementById('close-med-modal')?.addEventListener('click', () => {
    document.getElementById('med-promo-modal').hidden = true;
});

document.getElementById('proceed-to-shop')?.addEventListener('click', () => {
    // Hide the popup and smoothly scroll them to the Leafly menu!
    document.getElementById('med-promo-modal').hidden = true;
    openShop(true, 'rec'); 
});

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

      smoothTo(target); 
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
      let img = it.image || '';
      if (img && img.startsWith('/assets/')) img = `.${img}`;

      const shopClick = `event.preventDefault(); const nav = document.querySelector('[data-open-shop=\\'rec\\']') || document.querySelector('[data-open-shop]'); if(nav) nav.click();`;

      // NEW CLEAN LAYOUT: Small scroller tiles with auto-colored prices
      if (type === 'mini') {
        // Magically finds prices (like "$50" or "5 for $18") and makes them Green, larger, and on a new line
        const smartTitle = esc(it.title).replace(/(\d+\s+for\s+\$\d+|\$\d+)/gi, '<span style="color: #2ef8bb; display: block; font-size: 19px; margin-top: 4px; font-weight: 950; text-shadow: 0 2px 10px rgba(0,0,0,1);">$1</span>');

        return `
          <a href="#shop" class="thCard ${sizeClass}" onclick="${shopClick}">
            <div class="thMedia" style="background-image:url('${esc(img)}')"></div>
            <div class="thOverlay" style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.9) 100%);"></div>
            <div class="thContent thContent--mini" style="position:absolute; bottom:0; width:100%; padding: 16px; box-sizing: border-box;">
              <div class="thMiniTitle" style="color:#fff; font-weight: 800; font-size: 15px; line-height: 1.2; text-shadow: 0 2px 8px rgba(0,0,0,0.9);">${smartTitle}</div>
            </div>
          </a>
        `;
      }
      // ORIGINAL PREMIUM LAYOUT: Hero and Mid cards keep their tags, prices, and buttons
      return `
        <a href="#shop" class="thCard ${sizeClass}" onclick="${shopClick}">
          <div class="thMedia" style="background-image:url('${esc(img)}')"></div>
          <div class="thOverlay"></div>
          <div class="thContent">
            ${it.tag ? `<div class="thPill ${pillClass}">${esc(it.tag)}</div>` : ''}
            <h3 class="thH3">${esc(it.title)}</h3>
            ${it.price ? `<div class="thPrice">${esc(it.price)} <span class="thTaxTag">+ TAX</span></div>` : ''}
            ${it.details ? `<div class="thDetails">${esc(it.details)}</div>` : ''}
            <div class="thCta">Shop Deal &rarr;</div>
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
        const response = await fetch('https://dutchtouchgenetics.com/strains.json');
        strains = await response.json();

        // --- THE DAVE DICTIONARY --- 
        // Instantly overrides the JSON file with Dave's exact words!
        const davesOverrides = {
            "Illudium": { lineage: "Hawaiian Indica x Pre98 Bubba", type: "Hybrid", description: "Effects include feeling relaxed, happy, and sleepy. Patients often choose Illudium when dealing with symptoms associated with insomnia, pain, and stress. Illudium features flavors like chocolate, caramel, and coffee. The aromatic profile balances bright citrus and herbal woodland with a peppery, fuel-tinged base. Primary notes often include lemon zest, sweet orange rind, and crushed juniper, wrapped in whispers of diesel and black pepper." },
            "Dead Prez": { lineage: "Death Star x Dread Bread", type: "Hybrid", description: "Primary Aromas: Sour spite smell. Skunky, sweet jet fuel, and diesel. Undertones: Earthy, pungent, with hints of citrus and spice (pepper)." },
            "Cobra Lips": { lineage: "Chem 3 x Appalachia", type: "Hybrid", description: "Aroma & Taste: The strain is known for a complex, pungent terpene profile featuring notes of pine, wet soil, funk, fuel, and a tart, green apple finish. Effects: Long-lasting, and energetic buzz that balances euphoria with a relaxed physical state. It is often described as a functional yet potent high." },
            "Vortex": { lineage: "Space Queen x Apollo 13", type: "Sativa", description: "Aroma/Taste: The flavor profile is described as a mix of sweet and sour lemon, with strong notes of tropical mango and, at times, a 'funky' or 'rotting fruit' undertone." },
            "Strawberry Daiquiri": { lineage: "Strawberry Cough x Jack the Ripper", type: "Sativa", description: "Aroma combines notes of strawberry, cherry and chocolate on an acidic background, while its energetic, positive effect can prove highly effective for users battling against anxiety and depression." },
            "Sticky Trap": { lineage: "Gorilla Glue 4 x Vortex", type: "Hybrid", description: "Aroma: GG4 has a pungent, earthy, and piney aroma with hints of diesel and chocolate. Vortex leans toward a sweet, tropical, and fruity profile. Together, the combo creates a balanced blend of pungent earthiness from GG4 with sweet, tropical, and citrusy notes from Vortex, making a complex and aromatic flavor experience." },
            "Mr. Clean": { lineage: "Lime Skunk x The Cube", type: "Sativa", description: "Strong citrus (lime), sour, earthy, and skunky, described as tasting like lemon-pine cleaners. Known for high, energetic, and creative effects." },
            "Ripped Bubba": { lineage: "Bubba Kush Pre-98 X Jacks Cleaner X Space Queen", type: "Hybrid", description: "Creative and Motivational in the mind and calming in the body and soul. Taste: Cherry, Kush, Hash, Black Berry, Skittles Candy, some variations have a heavier Lemon smell." },
            "Falcon 9": { lineage: "Sunset Sherb X Tina", type: "Indica", description: "Noted for a smooth, gassy ice cream flavor profile that comes from dark purple buds accented by vibrant orange pistils. Meant for indica lovers, Falcon 9 is known to start as a strong head high before settling into the body. Patients report that it can help with chronic pain, depression, and PTSD." },
            "13 Layer Cake": { lineage: "Apollo 13 x Wonka Bars", type: "Sativa", description: "Aroma and taste are unique and very pungent with hints of GMO. Its scent has been described as peppery/garlic and earthy. Taste takes on the herbal notes of tea with a skunky aftertaste." },
            "Agent Orange": { description: "Agent Orange is a well-balanced hybrid marijuana strain with uplifting and motivating effects. Agent Orange has an aroma of fresh-cut citrus and is an excellent mood enhancer if you are feeling lethargic or depressed." },
            "AJ's Cream Cake": { description: "Cream is a hybrid weed strain made from a genetic cross between Wedding Cake and Gelato #33. Leafly customers tell us Cream effects include feeling focused, aroused, and tingly." },
            "Angelica": { description: "A strain with 2.42% total terpenes - Highest in β-Myrcene, D-Limonene, and β-Caryophyllene. Buds grow large and dense in a Kush fashion, offering a thick smoke. Expect flavor notes of lemon, hash, incense, and menthol to flood your senses with a euphoric high that will blanket your mind and body." },
            "Apollo 13": { description: "The high is clear and cerebral, without a hint of paranoia. Her citrus flavor and happy high make Apollo 13 very popular at parties! Exquisite terpene profile with 2.45% total terpenes." },
            "Bonkers": { description: "The result is a fruity strain with a creamy lemon flavor profile that erupts from beautiful lime green buds. The experience makes for a smooth buzz that is toned down in intensity." },
            "Caesar": { description: "Consumers can expect the insane trichome production associated with Original Glue alongside a potent gassy nose that will catch attention after cracking the seal. Prepare to be baked in physical bliss and relaxation." },
            "Clusterfunk": { description: "Deep notes of oil and fuelly funk paired with skunky, sour hues. ClusterFunk is suitable for evening usage and for whenever you want to go nuclear." },
            "Crunchberries": { description: "The resulting flowers are long, bushy and practically white-colored with trichome density. The CrunchBerry’s high delivers a uplifting and peaceful effect. The strain reportedly delivers a vanilla-and-pine aroma." },
            "Death Star": { description: "This strain is named for its skunky sweet jet fuel aromas that are pungent and fill up your nostrils. It has a powerful buzz that can make you feel sleepy, relaxed, and euphoric." },
            "Death By Funk": { description: "Deep notes of oil and fuelly funk paired with skunky, sour hues and sweet jet fuel aromas that are pungent and fill up your nostrils. It has a powerful buzz that can make you feel sleepy, relaxed, and euphoric. Medical marijuana patients often choose this when dealing with symptoms associated with stress, pain, and anxiety. Features flavors like diesel, pungent, and tea." },
            "Double Dutch Cookies": { description: "Super frosty appearance and sweet kush flavor notes with hints of mango cookies." },
            "Field Trip": { description: "Field Trip is a hybrid weed strain made from a genetic cross between GSC and Sunshine Daydream." },
            "Forbidden Jelly": { description: "This strain produces uplifting and cerebral effects that will make you feel happy and perhaps tingly. The heavy amount of Caryohphyllene gives off a nice relaxing body high without being sedated to the couch." },
            "Goji OG": { description: "The flavor of Goji OG is as unique as the berry it's named after, offering a dynamic aroma including red berry, black cherry, strawberry, hawaiian punch, and licorice." },
            "Grease Monkey": { description: "Grease Monkey is a sweet hybrid marijuana strain with earthy and skunky overtones. This strain saddles the consumer with a lazy, munchie-fueled body buzz that may soften the blow of chronic pain, nausea, and stress." },
            "Hawaiian Bread": { description: "Hawaiian is a sativa marijuana strain known to provide happy and creative thoughts. This strain features an aroma that will remind you of tropical fruits." },
            "Jesus OG": { description: "Consumers enjoy the lemony kush aroma of this indica-dominant cross, along with heavy effects that relax the body while leaving the mind functional and clear." },
            "Lilac Diesel": { description: "Big buds have a complex terpene profile, including notes of citrus, sweet berries, earthy pine, and chem. Lilac Diesel is a great afternoon strain for a lackadaisical adventure." },
            "Mango Hashplant": { description: "Her tight, resin-drenched flower clusters develop a brittle surface when dried and give off a deep, rich Afghani aroma that’s undercut with a hint of hashish." },
            "Milk & Cookies": { description: "The odor is gassy, but sweet, with creamy hints of vanilla and orange citrus. Smoking or vaping Milk and Cookies turns the creamy flavor sour, leaving a peppery bite upon the exhale." },
            "Orange Kush Cake": { description: "Consumers can expect a rich, complicated terpene profile including notes of sharp orange, citrus, gas, sour candy, dried grapes, and even earthy sandalwood." },
            "Querkle": { description: "Querkle carries a strong grape and berry aroma. Heavily euphoric and cerebral, Querkle may be used during the day but is ideal for evening use as it relaxes muscles and guides the mind into sleep." },
            "Sky Lotus": { description: "The aroma is a mixture of Pine-Sol, lemon, and sweet berries, while the flavor is more piney and floral. This plant develops an abundance of trichomes which leads to a potent, punchy buzz." },
            "Space Monkey": { description: "The aroma is pungent, funky, sour, and dank with a little sweet lavender for good measure. Enthusiasts love its relaxing body high, low-key head high." },
            "Super Silver Hash Plant": { description: "Flavors and aromas include notes of fuel, hazy, and dank. The high will leave you uplifted and motivated in the mind while feeling relaxed in the body." },
            "Guicy G": { description: "The taste of Guicy G will leave you begging for more, with a bouquet of fresh fruity berries, sugary citrus and touches of light spice." },
            "Solo Walker": { description: "Musky/Melon/Guava/ sweet and sour notes of funk." },
            "Hash D": { description: "Users generally report a calming, relaxing, and heavy hitting 'body stone' effect. The strain carries a strong, pungent odor that combines the chemical/fuel notes of Chem D with earthy, hashish undertones." },
            "Spirit Hashplant": { description: "Reports indicate a strong Ghost OG scent, often described as gassy, earthy, and piney." },
            "Gorilla 88": { description: "Known to provide a powerful, relaxing, and euphoric experience, often suitable for evening use due to potential couchlock. Inherits the sticky, pungent nature of GG4 with added notes of cinnamon and earth." },
            "Banana Split": { description: "The familiar tangerine burst of the Tangie is backed with the bold fruity notes from the Banana Sherbet." },
            "Double Bubble": { description: "Reports suggest a range of aromas including tropical fruit, juicy fruit bubblegum, hash, musk, and sandalwood." },
            "Death Z": { description: "Hops/Floral/hints of gas and citrus coming from parents death star and z skittlez." },
            "Pina Rita": { description: "The strain is famous for a unique combination of pineapple and cherry candy notes. Provides a very tasty, functional, and uplifting high, making it great for daytime use." },
            "Chocolate Marshmallows": { description: "Flavors of sweet chocolate and creamy vanilla galore. The aroma is just as mouthwatering, with a sweet white chocolate smell that's accented by a punch of skunky pungency." }
        };

        // --- MASTER AWARD INJECTION LIST ---
        const awardsMap = {
            "Mr. Clean": "🏆 1st Place Sativa (High Times Cannabis Cup).",
            "Lilac Diesel": "🏆 3rd Place Sativa (High Times Cannabis Cup).",
            "Forbidden Jelly": "🏆 3rd Place Nug Run Sugar Solvent (Best in Grass).",
            "Lemon Wookie #4": "🏆 2nd Place (Best in Grass).",
            "Death By Funk": "🏆 3rd Place Indica Flower (Best in Grass)."
        };

        // Inject Dave's overrides and Awards perfectly into the live data!
        strains.forEach(s => {
            // Apply Dave's Text First
            const overrideKey = Object.keys(davesOverrides).find(key => s.name.toLowerCase().includes(key.toLowerCase()));
            if (overrideKey) {
                if (davesOverrides[overrideKey].lineage) s.lineage = davesOverrides[overrideKey].lineage;
                if (davesOverrides[overrideKey].type) s.type = davesOverrides[overrideKey].type;
                if (davesOverrides[overrideKey].description) s.description = davesOverrides[overrideKey].description;
            }

            // Pin the specific badges
            if (s.name.includes("Death By Funk")) s.award = true;
            let awardText = awardsMap[s.name];
            if (!awardText && s.name.includes("Lemon Wookie")) awardText = "🏆 2nd Place (Best in Grass).";

            // If an award exists, pin the badge and inject the trophy text on top of Dave's description!
            if (awardText) {
                s.award = true;
                s.description = awardText + " " + (s.description || "");
            }
        });

        // 1. Angelica RSO
        let angelica = strains.find(s => s.name.includes("Angelica"));
        if (angelica) {
            angelica.award = true;
            angelica.name = "Angelica RSO";
            angelica.type = "RSO";
            angelica.description = "🏆 1st Place RSO (High Times Cannabis Cup). " + (angelica.description || "");
        } else {
            strains.push({ name: "Angelica RSO", slug: "angelica-rso", award: true, type: "RSO", lineage: "Angelica Extract", breeder: "Dutch Touch Genetics", description: "🏆 1st Place RSO (High Times Cannabis Cup)." });
        }

        // 2. Space Hippy
        let spaceHippy = strains.find(s => s.name.includes("Space Hippy"));
        if (spaceHippy) {
            spaceHippy.award = true;
            spaceHippy.description = "🏆 2nd Place Nug Run Sugar Solvent & 3rd Place Disposable (High Times Cannabis Cup). " + (spaceHippy.description || "");
        } else {
            strains.push({ name: "Space Hippy", slug: "space-hippy", award: true, type: "HYBRID", lineage: "DTG Exclusive", breeder: "Dutch Touch Genetics", description: "🏆 2nd Place Nug Run Sugar Solvent & 3rd Place Disposable (High Times Cannabis Cup)." });
        }

        // 3. White Wampa 
        let whiteWampa = strains.find(s => s.name.includes("White Wampa"));
        if (!whiteWampa) {
            strains.push({ name: "White Wampa", slug: "white-wampa", award: true, type: "INFUSED PRE-ROLL", lineage: "DTG Exclusive", breeder: "Dutch Touch Genetics", description: "🏆 3rd Place Infused Pre-Roll (High Times Cannabis Cup)." });
        }

        renderFeaturedGenetics(strains);

    } catch (error) {
        console.error('Failed to load strains:', error);
    }

    function renderFeaturedGenetics(data) {
        const mount = document.getElementById('current-strains');
        if (!mount) return;

        mount.innerHTML = '';
        let featured = data.filter(s => s.award === true);

        // FORCE CUSTOM ORDER (VIP List)
        const customOrder = ["Mr. Clean", "Lemon Wookie", "Lemon Wookie #4"];
        featured.sort((a, b) => {
            const indexA = customOrder.indexOf(a.name);
            const indexB = customOrder.indexOf(b.name);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.name.localeCompare(b.name);
        });

        // Render the champions
        mount.innerHTML = featured.map(s => {
            let img = s.image ? 'https://dutchtouchgenetics.com/' + s.image : 'https://dutchtouchgenetics.com/assets/img/logo/dtg-logo-orange.png';
            
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
                    
                    <p class="strain-notes">${s.description}</p>
                    
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
                    <div class="strain-modal-cta" style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                        <a href="https://dutchtouchgenetics.com/strains.html" class="btn btn--gold" style="width: 100%;">
                            Explore DTG Vault &rarr;
                        </a>
                        <button id="glModalShopBtn" class="btn btn--ghost" onclick="document.getElementById('glCloseModal').click(); const nav = document.querySelector('[data-open-shop]'); if(nav) nav.click();" style="width: auto; padding: 6px 20px; font-size: 13px; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px;">
                            Shop Strain &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    if (!document.getElementById('glStrainModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

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

            // --- OUT OF STOCK BLOCKER ---
            const outOfStockList = ["Lemon Wookie #4", "Angelica RSO","Forbidden Jelly","Space Hippy",]; 
            
            const shopBtn = document.getElementById('glModalShopBtn');
            
            if (outOfStockList.includes(s.name)) {
                // What happens if it IS out of stock (Darker, invisible gray)
                shopBtn.innerHTML = "Out of Stock";
                shopBtn.style.background = "transparent"; 
                shopBtn.style.color = "#555";
                shopBtn.style.borderColor = "#333";
                shopBtn.style.cursor = "not-allowed";
                shopBtn.onclick = (e) => { e.preventDefault(); }; 
            } else {
                // What happens if it is IN stock (Classy, muted translucent white)
                shopBtn.innerHTML = "Shop Strain &rarr;";
                shopBtn.style.background = "rgba(255,255,255,0.05)"; 
                shopBtn.style.color = "rgba(255,255,255,0.7)";
                shopBtn.style.borderColor = "rgba(255,255,255,0.15)";
                shopBtn.style.cursor = "pointer";
                shopBtn.onclick = (e) => { 
                    e.preventDefault();
                    document.getElementById('glCloseModal').click(); 
                    const mainNavShop = document.querySelector('[data-open-shop="rec"]') || document.querySelector('[data-open-shop]');
                    if(mainNavShop) mainNavShop.click(); 
                };
            }
            // ------------------------------

            let img = s.image ? 'https://dutchtouchgenetics.com/' + s.image : 'https://dutchtouchgenetics.com/assets/img/logo/dtg-logo-orange.png';
            if (document.getElementById('glModalImage')) {
                document.getElementById('glModalImage').src = img;
            }
            
            modal.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        }
    });

    // Close Modal Logic
    const closeDialog = () => {
        if (modal) modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDialog);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeDialog();
        });
    }
});

/* --- ARTWORK TOGGLE "WIND" EFFECT --- */
document.addEventListener('DOMContentLoaded', () => {
  const artToggleBtn = document.getElementById('art-mode-toggle');
  const deliCards = document.querySelectorAll('.deli-card'); 

  if (!artToggleBtn || deliCards.length === 0) return;

  artToggleBtn.addEventListener('click', () => {
    artToggleBtn.classList.toggle('active');
    const isArtMode = artToggleBtn.classList.contains('active');

    deliCards.forEach(card => {
      // Find where this specific card is on the screen
      const rect = card.getBoundingClientRect();
      const delay = Math.max(0, rect.left) * 0.6; 
      
      // THE FIX: Target the front and back panels directly!
      const frontFace = card.querySelector('.deli-card__front');
      const backFace = card.querySelector('.deli-card__back');

      // Apply the staggered delay to the faces
      if (frontFace) frontFace.style.transitionDelay = `${delay}ms`;
      if (backFace) backFace.style.transitionDelay = `${delay}ms`;

      // Trigger the flip
      if (isArtMode) {
        card.classList.add('is-flipped');
      } else {
        card.classList.remove('is-flipped');
      }
      
      // Clean up the delay after the wave finishes so normal clicking is instant
      setTimeout(() => {
        if (frontFace) frontFace.style.transitionDelay = '0ms';
        if (backFace) backFace.style.transitionDelay = '0ms';
      }, delay + 800); 
    });
  });
});

// ===== SMART MAP LINK (Aggressive Catch-All for ALL map links) =====
// This searches for the smart-map class, plus EVERY known variation of a Google Maps link
const mapSelectors = '.smart-map, a[href*="google.com/maps"], a[href*="maps.google"], a[href*="maps.app.goo.gl"], a[href*="goo.gl/maps"]';

document.querySelectorAll(mapSelectors).forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Stops the default link from firing
        
        // The exact address destination
        const destination = "Green Labs Provisions, 10701 Madison St, Luna Pier, MI 48157"; 
        
        // Detect if the user is on an Apple device (iPhone, iPad, Mac)
        const isApple = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent) && !window.MSStream;
        
        if (isApple) {
            // Forces Apple Maps to open on iOS devices
            window.open(`https://maps.apple.com/?daddr=${encodeURIComponent(destination)}`, '_blank');
        } else {
            // Forces Google Maps app to open on Android, or web on PC
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`, '_blank');
        }
    });
});

// ===== Auto-Inject Sleek "Shop" Buttons into Deli Cards =====
setTimeout(() => {
    document.querySelectorAll('.deli-card__label').forEach(label => {
        // Prevent duplicates
        if (label.querySelector('.deli-shop-btn')) return; 

        // Find the price span
        const priceSpan = label.querySelector('.deli-card__price');
        if (!priceSpan) return;

        // 1. Create a tight column wrapper for the right side of the card
        const rightWrap = document.createElement('div');
        rightWrap.style.cssText = 'display: flex; flex-direction: column; align-items: stretch; gap: 6px;';

        // 2. Move the price tag into our new wrapper
        priceSpan.parentNode.insertBefore(rightWrap, priceSpan);
        rightWrap.appendChild(priceSpan);

        // 3. Create the sleek mini button
        const shopBtn = document.createElement('button');
        shopBtn.className = 'btn btn--ghost deli-shop-btn';
        
        // Includes the clean little shopping bag icon
        shopBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> SHOP`;
        
        // THE FIX: Translucent, muted, premium style! (No more neon green)
        shopBtn.style.cssText = 'padding: 4px 0; font-size: 11px; font-weight: 800; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.15); color: rgba(255, 255, 255, 0.7); background: rgba(255, 255, 255, 0.05); z-index: 10; position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 100%; transition: all 0.2s ease;';
        
        // The Foolproof Click Mechanism
        shopBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stops the card from flipping
            const mainNavShop = document.querySelector('[data-open-shop="rec"]') || document.querySelector('[data-open-shop]');
            if(mainNavShop) mainNavShop.click();
        };
        
        rightWrap.appendChild(shopBtn);
    });
}, 500);

// ===== THE LEAFLY BODYGUARD (ANTI-CRASH FIX) =====
document.addEventListener('click', (e) => {
    // 1. Stop Leafly from mistaking our scroll links for menu filters
    const anchor = e.target.closest('a');
    if (anchor) {
        const href = anchor.getAttribute('href');
        // If the user clicks an internal scroll link (like #deli)...
        if (href && href.startsWith('#') && href.length > 1) {
            const section = document.querySelector(href);
            if (section) {
                e.preventDefault(); // STOP the address bar from changing!
                history.replaceState(null, null, window.location.pathname); // Wipe it completely clean
                section.scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly anyway
            }
        }
    }
});

// 2. Failsafe to guarantee the Shop Strain buttons always work
document.addEventListener('click', (e) => {
    if (e.target.closest('.deli-shop-btn') || e.target.closest('#glModalShopBtn')) {
        // If the Leafly iframe is currently on the screen and throwing an error, 
        // this forces a micro-refresh that automatically slides back down to a perfect menu!
        const leaflyIframe = document.querySelector('iframe[src*="leafly"]');
        if (leaflyIframe) {
            e.preventDefault();
            e.stopPropagation();
            window.location.hash = '#shop-rec';
            window.location.reload();
        }
    }
});

// ============================================================
// MASTER EDUCATION TILE LOGIC (GLITCH-FREE)
// ============================================================
document.querySelectorAll('[data-guide-card]').forEach(card => {
    const btn = card.querySelector('.guideCard__toggle');
    const btnText = card.querySelector('.guideCard__toggleText');
    const btnIcon = card.querySelector('.guideCard__toggleIcon');

    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = card.classList.contains('is-open');

        // 1. Close all other cards first (Accordion Style)
        document.querySelectorAll('[data-guide-card]').forEach(otherCard => {
            otherCard.classList.remove('is-open');
            const otherBtn = otherCard.querySelector('.guideCard__toggleText');
            const otherIcon = otherCard.querySelector('.guideCard__toggleIcon');
            if (otherBtn) otherBtn.innerText = "Read the full answer";
            if (otherIcon) otherIcon.innerText = "+";
        });

        // 2. If the clicked card was closed, open it
        if (!isOpen) {
            card.classList.add('is-open');
            btnText.innerText = "Close full answer";
            btnIcon.innerText = "−";
            
            // Smoothly scroll to the card
            setTimeout(() => {
                const yPos = card.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({ top: Math.max(0, yPos), behavior: 'smooth' });
            }, 300);
        } else {
            // If it was already open, Brain 1 already closed it above, 
            // so we just scroll back to the top of the section.
            const section = document.getElementById('learn-before-you-buy');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}); // <-- THIS BRACKET WAS MISSING! It closes the education cards.

// --- BEST IN GRASS PROMO POP-UP ---
setTimeout(() => {
    // Only show if they haven't closed it this session
    if (!sessionStorage.getItem('gl_big_popup_shown')) {
        const bigPopup = document.createElement('div');
        bigPopup.id = 'big-promo-popup';
        bigPopup.style = "position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px);";
        
        bigPopup.innerHTML = `
            <div style="position:relative; width:90%; max-width:500px; background:radial-gradient(circle at top right, rgba(11,125,90,0.15), transparent), linear-gradient(135deg, #0b0d0c, #050505); border:1px solid rgba(46, 248, 187, 0.3); border-radius:24px; padding:40px 30px; text-align:center; box-shadow: 0 40px 100px rgba(0,0,0,0.8);">
                <button id="close-big" style="position:absolute; top:15px; right:20px; background:none; border:none; color:#999; font-size:28px; cursor:pointer; transition:0.2s;">&times;</button>
                
                <div style="display:inline-block; font-size:11px; font-weight:900; letter-spacing:0.15em; color:#2ef8bb; background:rgba(46,248,187,0.1); border:1px solid rgba(46,248,187,0.2); padding:6px 14px; border-radius:999px; margin-bottom:20px;">MAY 9TH EXCLUSIVE</div>
                
                <h2 style="font-family:'Cinzel', serif; font-size:32px; font-weight:900; color:#fff; margin:0 0 15px; line-height:1.1;">Best In Grass<br>Judge Kits Drop</h2>
                
                <p style="color:rgba(255,255,255,0.7); font-size:16px; font-weight:600; line-height:1.5; margin:0 0 30px;">Be the first to grab your official judge bags and unlock exclusive deals on participating brands!</p>
                
                <button id="btn-big-shop" class="btn btn--primary" style="width:100%; font-size:16px; padding:12px 0;">Shop the Drop</button>
            </div>
        `;
        document.body.appendChild(bigPopup);
        
        // Hover effect for close button
        const closeBtn = document.getElementById('close-big');
        closeBtn.onmouseover = () => closeBtn.style.color = '#fff';
        closeBtn.onmouseout = () => closeBtn.style.color = '#999';
        
        // Click handlers
        const closePopup = () => {
            bigPopup.remove();
            sessionStorage.setItem('gl_big_popup_shown', 'true');
        };
        closeBtn.onclick = closePopup;
        
        // Clicking "Shop the Drop" automatically closes the popup and opens the Leafly menu
        document.getElementById('btn-big-shop').onclick = () => {
            closePopup();
            const shopNav = document.querySelector('[data-open-shop="rec"]') || document.querySelector('[data-open-shop]');
            if(shopNav) shopNav.click();
        };
    }
}, 2000); // Trigger set to 2 seconds for instant testing!
