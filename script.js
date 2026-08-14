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
    document.body.dataset.popupOpen = 'gift';

    const closeBtn = document.getElementById('btnClosePromo');
    const okBtn = document.getElementById('btnPromoOk');

    [closeBtn, okBtn].forEach((button) => {
        button?.addEventListener(
            'click',
            () => {
                promoModal.setAttribute('hidden', 'true');
                delete document.body.dataset.popupOpen;
                localStorage.setItem('gl_gift_claimed', 'true');
            },
            { once: true }
        );
    });
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

  // ===== Deals + Highlights render (from ) =====
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
      // We keep dealsData just in case other parts of your script need it
      const dealsData = Array.isArray(data) ? data : (data.deals || []);
      
      // ✅ FIX: Pass the ENTIRE data object so the Deli Board can see it
      renderDealsDropdown(data); 

      // renderDealTiles(dealsData); // disabled — using Today's Highlights cards only
      
      if (highlightsMount && data && data.highlights) {
        renderHighlightsFromConfig(data.highlights, highlightsMount);
      } else if (highlightsMount) {
        highlightsMount.innerHTML = '';
      }
      initTodaysHighlightsFX();
    })

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

function slugifyDealCategory(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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
    const dealList = document.getElementById('dealList');
    const jumpWrap = document.getElementById('dealJumpWrap');
    const searchMeta = document.getElementById('dealSearchMeta');
    const deliBoardMount = document.getElementById('deliBoardMount'); // 👈 New Target!
    
    const regularDeals = data.deals || [];
    const cats = normalizeDealsData(regularDeals);

    if (!cats.length && !data.deli_board) {
      dealList.innerHTML = '<div class="drEmpty">No deals available right now.</div>';
      if (jumpWrap) jumpWrap.innerHTML = '';
      if (searchMeta) { searchMeta.hidden = true; searchMeta.textContent = ''; }
      return;
    }

    // 1. Create the Sleek Static Deli Menu Box
    if (data.deli_board && deliBoardMount) {
      // 🟢 Automatically close on mobile, stay open on desktop!
      const isOpen = window.innerWidth > 860 ? 'open' : ''; 
      
      deliBoardMount.innerHTML = `
        <details class="dpb-drop" ${isOpen}>
          <summary class="dpb-header">
            <div class="dpb-header-text">
              <h3 class="dpb-title">The Dutch Deli</h3>
              <p class="dpb-sub">Weighed fresh to order. Choose your tier below.</p>
            </div>
            <span class="dpb-chev" aria-hidden="true">▾</span>
          </summary>
          <div class="dpb-body">
            <div class="dpb-grid">
              ${data.deli_board.map(tier => `
                <div class="dpb-tier">
                  <div class="dpb-tier-head">
                    <h4 class="dpb-tier-name" style="color: ${tier.color}">${tier.tier} TIER</h4>
                    <div class="dpb-tier-label">${tier.label}</div>
                  </div>
                  <div class="dpb-prices">
                    ${tier.prices.map(([wt, pr]) => `
                      <div class="dpb-price-row">
                        <span class="dpb-wt">${wt}</span>
                        <span class="dpb-dots"></span>
                        <span class="dpb-pr">${pr}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </details>
      `;
    }

    // 2. Render the normal Dropdown Categories
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
            <div class="drLines">${linesHtml}</div>
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
        <strong>Note:</strong> All prices are <strong>Pre-Tax</strong>.
      </div>`;
   
    if (jumpWrap) {
      jumpWrap.innerHTML = `<button class="drJumpChip" type="button" data-jump="#dealsDrop">All Deals</button>` 
      + cats.map(cat => `
        <button class="drJumpChip" type="button" data-jump="#deal-cat-${cat.id}">
          ${esc(cat.category.replace(/^[^\w]+/, '').trim())}
        </button>
      `).join('');
    }

    if (searchMeta) { searchMeta.hidden = true; searchMeta.textContent = ''; }

    bindDealJumpChips();
    bindDealSearch();
    bindDealBackTop();
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
          ${type === 'hero' ? '' : '<div class="thOverlay"></div>'}
          ${type === 'hero' ? '' : `
          <div class="thContent">
            ${it.tag ? `<div class="thPill ${pillClass}">${esc(it.tag)}</div>` : ''}
            <h3 class="thH3">${esc(it.title)}</h3>
            ${it.price ? `<div class="thPrice">${esc(it.price)} <span class="thTaxTag">+ TAX</span></div>` : ''}
            ${it.details ? `<div class="thDetails">${esc(it.details)}</div>` : ''}
            <div class="thCta">Shop Deal →</div>
          </div>
          `}
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
  const filterBtns = document.querySelectorAll('.deli-filter[data-filter]');
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
        
        const shouldShow =
          filterVal === 'all' || categories.includes(filterVal);

        if (shouldShow) {
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

// =========================================================
// DUTCH DELI MODAL DATA, TIERS & PRICING
// =========================================================

const deliTierData = {
  premium: {
    badge: "Premium Tier",
    pricingTitle: "Premium Tier Pricing",
    prices: [
      ["Gram", "$10"],
      ["3.5g", "$25"],
      ["7g", "$40"],
      ["14g", "$70"],
      ["28g", "$110"]
    ]
  },

  core: {
    badge: "Core Tier",
    pricingTitle: "Core Tier Pricing",
    prices: [
      ["Gram", "$8"],
      ["Eighth (3.5g)", "$15"],
      ["Quarter (7g)", "$30"],
      ["Half (14g)", "$50"],
      ["Ounce (28g)", "$90"]
    ]
  },

  value: {
    badge: "Value Tier",
    pricingTitle: "Value Tier Pricing",
    prices: [
      ["Gram", "$6"],
      ["3.5g", "$12"],
      ["7g", "$22"],
      ["14g", "$45"],
      ["28g", "$70"]
    ]
  },

  bubblehash: {
    badge: "Bubblehash",
    pricingTitle: "Bubblehash Pricing",
    prices: [
      ["Gram", "$10"],
      ["3.5g", "$30"],
      ["14g", "$100"]
    ]
  }
};

const deliStrainData = {
  "mr-clean": {
    name: "Mr. Clean",
    tier: "premium",
    seedSource: "Exotic Genetics",
    type: "Sativa • 1st Place Winner",
    thc: "N/A",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/mr-clean-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/mr-clean-art.jpg",
    genetics: "Lime Skunk × The Cube",
    about: "🏆 1st Place Sativa (High Times Cannabis Cup). Strong citrus (limonene), sour, earthy, and skunky, described as tasting like lemon-pine cleaners. Known for high, energetic, and creative effects. Has the ability to 'clean out' bad moods."
  },
   
  "lilac-diesel": {
    name: "Lilac Diesel",
    tier: "premium",
    seedSource: "Ethos Genetics",
    type: "Sativa • 3rd Place Winner",
    thc: "N/A",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/lilac-diesel-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/lilac-diesel-art.jpg",
    genetics: "Silver Lemon Haze × Forbidden Fruit × NYC Cherry Pie × Citral Glue",
    about: "🏆 High Times Cannabis Cup 3rd Place Sativa. Big buds have a complex terpene profile, including notes of citrus, sweet berries, earthy pine, and chem. Lilac Diesel is a great afternoon strain for a lackadaisical adventure."
  },

     "afghani-2": {
    name: "Afghani #3",
    tier: "core",
    seedSource: "Soma Seeds",
    type: "Indica Dominant",
    thc: "25.14% THC",
    budImage: "",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/afghani-3-art.jpg",
    genetics: "Pure Afghan Landrace",
    terpenes: [
      { name: "α-Terpinene", percent: "1.507%", mg: "15.07 mg/g" },
      { name: "Nerolidol", percent: "0.278%", mg: "2.78 mg/g" },
      { name: "β-Pinene", percent: "0.203%", mg: "2.03 mg/g" }
    ],
    about: "One of the most important traditional indica landraces in modern cannabis breeding. Earthy, hash-like, spicy, woody, resinous, herbal, pine-forward, and smoky with a dry herbal finish."
  },

 "space-hippy-bubblehash": {
  name: "Space Hippy Bubble Hash Infused",
  tier: "core",
  seedSource: "Dutch Touch Genetics",
  type: "Bubble Hash Infused Flower • Hybrid",
  thc: "28.72% THC",
  budImage: "",
  artImage: "https://dutchtouchgenetics.com/assets/img/strains/space-hippy-bubblehash-art.jpg",
  genetics: "Apollo 13 × Dread Bread",
  terpenes: [
    { name: "β-Myrcene", percent: "0.526%", mg: "5.26 mg/g" },
    { name: "α-Pinene", percent: "0.186%", mg: "1.86 mg/g" },
    { name: "β-Pinene", percent: "0.131%", mg: "1.31 mg/g" },
    { name: "Limonene", percent: "0.125%", mg: "1.25 mg/g" }
  ],
  about: "Bubble hash infused Dutch Touch Genetics flower with a boosted full-spectrum profile. A potent, terpene-rich Space Hippy release."
},

  "lemon-wookie": {
    name: "Lemon Wookie",
    tier: "premium",
    seedSource: "Dutch Touch Genetics",
    type: "Hybrid • 2nd Place Best in Grass",
    thc: "N/A",
    budImage: "",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/lemon-wookie-art.jpg",
    genetics: "Lemon G × Wookie",
    terpenes: [
      { name: "α-Terpinene", percent: "0.399%", mg: "3.99 mg/g" },
      { name: "Nerolidol", percent: "0.253%", mg: "2.53 mg/g" },
      { name: "α-Bisabolol", percent: "0.214%", mg: "2.14 mg/g" }
    ],
    about: "🏆 2nd Place — Best in Grass 2025. Sharp lemon and diesel funk with energetic daytime vibes."
  },

  "astro-taffy": {
    name: "Astro Taffy",
    tier: "premium",
    seedSource: "Dutch Touch Genetics",
    type: "Sativa Dominant",
    thc: "25.53% THC",
    budImage: "",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/astro-taffy-art.jpg",
    genetics: "Apollo 13 × Lazy Lightning",
    terpenes: [
      { name: "α-Terpinene", percent: "0.537%", mg: "5.37 mg/g" },
      { name: "β-Caryophyllene", percent: "0.377%", mg: "3.77 mg/g" },
      { name: "Nerolidol", percent: "0.166%", mg: "1.66 mg/g" }
    ],
    about: "A euphoric, energizing sativa with sweet candy notes and a clear, uplifting head high. Perfect for creative days and good vibes."
  },

  "white-lightning": {
    name: "White Lightning",
    tier: "premium",
    seedSource: "Dutch Touch Genetics",
    type: "Indica Dominant",
    thc: "25.88% THC",
    budImage: "",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/white-lightning-art.jpg",
    genetics: "The White × '88 G13/HP",
    terpenes: [
      { name: "α-Terpinene", percent: "0.352%", mg: "3.52 mg/g" },
      { name: "β-Caryophyllene", percent: "0.240%", mg: "2.40 mg/g" },
      { name: "β-Myrcene", percent: "0.208%", mg: "2.08 mg/g" }
    ],
    about: "Hash-heavy and deeply earthy, with rich soil, spice and subtle pine. Bold, grounded old-school flavor."
  },

  "palpatine": {
    name: "Palpatine",
    tier: "premium",
    seedSource: "Dutch Touch Genetics",
    type: "Indica Dominant",
    thc: "25.63% THC",
    budImage: "",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/palpatine-art.jpg",
    genetics: "Death Star × Lazy Lightning",
    terpenes: [
      { name: "α-Terpinene", percent: "0.343%", mg: "3.43 mg/g" },
      { name: "β-Caryophyllene", percent: "0.332%", mg: "3.32 mg/g" },
      { name: "β-Myrcene", percent: "0.224%", mg: "2.24 mg/g" }
    ],
    about: "A powerful indica with deep relaxation and heavy nighttime vibes. Rich, smooth, and perfect for unwinding after dark."
  },

  "lazy-lightning": {
    name: "Lazy Lightning",
    tier: "premium",
    seedSource: "Dutch Touch Genetics",
    type: "Indica-Dominant Hybrid • 60% Indica / 40% Sativa",
    thc: "25.95% THC",
    budImage: "",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/lazy-lightning-art.jpg",
    genetics: "Headband Loompa × '88 G13/HP",
    terpenes: [
      { name: "α-Terpinene", percent: "0.644%", mg: "6.44 mg/g" },
      { name: "β-Myrcene", percent: "0.207%", mg: "2.07 mg/g" },
      { name: "β-Pinene", percent: "0.106%", mg: "1.06 mg/g" }
    ],
    about: "Earthy hash and OG Kush flavors layered with bright lemon and pine. Relaxing, soothing and deeply grounded."
  },
   
  "sour-chem-banger": {
    name: "Sour Chem Banger",
    tier: "core",
    seedSource: "Team Death Star",
    type: "50/50 Hybrid",
    thc: "25.6% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/sour-chem-banger-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/sour-chem-banger-art.jpg",
    genetics: "Peanut Butter Breath × Chem 91 2.0 × Headbanger OG",
    about: "Fiercely pungent with an overwhelming stench of sour diesel, fuel, and hints of garlic. Uplifting and intensely cerebral, instantly boosting mood while delivering deep physical relaxation."
  },

  "mule-fuel": {
    name: "Mule Fuel",
    tier: "core",
    seedSource: "Bodhi Seeds",
    type: "Indica",
    thc: "25% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/mule-fuel-art.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/mule-fuel-art.jpg",
    genetics: "Mule Fuel × 88G13HP",
    about: "Pungent, skunky, and savory with notes of garlic, ammonia, and earth. Initial euphoria is followed by heavy, sedative, relaxing body effects."
  },

  "face-off-og": {
    name: "Face Off OG",
    tier: "core",
    seedSource: "Bodhi Seeds",
    type: "Indica",
    thc: "27% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/face-off-og-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/face-off-og-art.jpg",
    genetics: "Face Off OG × 88G13HP",
    about: "A heavy-hitting indica-dominant hybrid crossing Archive Seed Bank Face Off OG with Bodhi’s 88 G13 Hashplant. Known for pungent OG aromas with sweet, mossy, earthy hashish flavors."
  },

  "space-hippy": {
    name: "Space Hippy",
    tier: "core",
    seedSource: "Dutch Touch Genetics",
    type: "Hybrid",
    thc: "24.77% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/space-hippy-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/space-hippy-art.jpg",
    genetics: "Apollo 13 × Dread Bread",
    about: "🏆 2nd Place Nug Run Sugar Solvent & 3rd Place Disposable. A High Times Cannabis Cup double-winner and premium DTG exclusive."
  },

  "chocolate-marsh-bubblehash": {
    name: "Chocolate Marshmallow Bubblehash",
    tier: "bubblehash",
    seedSource: "Exotic Genetix",
    type: "Hash Infused",
    thc: "51.30% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/chocolate-marshmallow-bubblehash-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/chocolate-marshmallows-bubblehash-art.jpg",
    genetics: "GG4 × Mint Chocolate Chip",
    about: "A heavy-hitting dessert strain with rich, creamy nuttiness on the inhale and a deep, dark cocoa finish that anchors the body."
  },

  "banana-split": {
    name: "Banana Split",
    tier: "core",
    seedSource: "DNA Genetics",
    type: "Sativa",
    thc: "21.67% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/banana-split-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/banana-split-art.jpg",
    genetics: "Tangie × Banana Sherbet",
    about: "The familiar tangerine burst of Tangie is backed with the bold fruity notes from Banana Sherbet."
  },

  "illudium": {
    name: "Illudium",
    tier: "core",
    seedSource: "Legendary Ohio Clone-Only",
    type: "Indica",
    thc: "23.70% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/illudium-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/illudium-art.jpg",
    genetics: "Hawaiian Indica × Pre-98 Bubba Kush",
    about: "A legendary, highly sought-after Ohio clone-only strain. Illudium boasts a complex flavor profile of dark coffee and sweet orange rind wrapped in a heavy diesel base."
  },

  "peanut-butter-n-chocolate": {
    name: "Peanut Butter N' Chocolate",
    tier: "core",
    seedSource: "Dutch Touch Genetics",
    type: "Indica",
    thc: "23.16% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/peanut-butter-n-chocolate-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/peanut-butter-n-chocolate-art.jpg",
    genetics: "Dosidos × Mint Chocolate Chip",
    about: "A heavy-hitting dessert strain. Rich, creamy nuttiness on the inhale with a deep, dark cocoa finish that anchors the body."
  },

  "spirit-hashplant": {
    name: "Spirit Hashplant",
    tier: "value",
    seedSource: "Bodhi Seeds",
    type: "Indica",
    thc: "23.17% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/spirit-hashplant-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/spirit-hashplant-art.jpg",
    genetics: "Ghost OG × 88G13HP",
    about: "Strong Ghost OG aromas featuring gassy, earthy, and pine-forward notes with classic Hashplant influence."
  },

  "dead-prez": {
    name: "Dead Prez",
    tier: "core",
    seedSource: "Dutch Touch Genetics",
    type: "Indica",
    thc: "26.32% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/dead-prez-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/dead-prez-art.jpg",
    genetics: "Death Star × Dread Bread",
    about: "A heavy-hitting in-house cross from Dutch Touch Genetics. Dead Prez commands the room with a sour, aggressive diesel aroma backed by hints of citrus and spice."
  },

  "garlic-breath": {
    name: "Garlic Breath",
    tier: "value",
    seedSource: "ThugPug Genetics",
    type: "Hybrid",
    thc: "21.55% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/garlic-breath-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/garlic-breath-art.jpg",
    genetics: "GMO × Mendo Breath",
    about: "A slightly indica-dominant hybrid known for its extremely funky garlic aroma and savory flavor. Delivers deep body relaxation with an uplifted, euphoric daze."
  },

  "hash-d": {
    name: "Hash D",
    tier: "value",
    seedSource: "Bodhi Seeds",
    type: "Indica",
    thc: "28.71% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/hash-d-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/hash-d-2-art.jpg",
    genetics: "Chem D × 88G13HP",
    about: "Pungent fuel aromas blend with earthy hashish undertones, producing a heavy-hitting body stone and classic Chem character."
  },

  "guicy-g": {
    name: "Guicy G",
    tier: "value",
    seedSource: "Exotic Genetix",
    type: "Hybrid",
    thc: "24.12% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/guicy-g-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/guicy-g-art.jpg",
    genetics: "The Juice × Triple OG",
    about: "A bouquet of fresh fruity berries, sugary citrus, and touches of light spice dancing across your tongue."
  },

  "field-trip": {
    name: "Field Trip",
    tier: "core",
    seedSource: "Dutch Touch Genetics",
    type: "Hybrid",
    thc: "25.07% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/field-trip-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/field-trip-art.jpg",
    genetics: "GSC × Sunshine Daydream",
    about: "Uplifting and nostalgic. This balanced hybrid features classic earthy dough notes with a bright, spacey citrus kick."
  },

  "super-silver-hashplant": {
    name: "Super Silver Hashplant",
    tier: "core",
    seedSource: "Bodhi Seeds",
    type: "Hybrid",
    thc: "17.33% THC",
    budImage: "https://dutchtouchgenetics.com/assets/img/strains/super-silver-hashplant-bud.jpg",
    artImage: "https://dutchtouchgenetics.com/assets/img/strains/super-silver-hashplant-art.jpg",
    genetics: "Super Silver Haze × 88 G13 Hash Plant",
    about: "Powered by Terpinolene, Beta-Caryophyllene, and Myrcene, this Bodhi Seeds cross offers a clear, motivated, uplifted mental state anchored by a soothing, relaxed body."
  }
};

// =========================================================
// CURATED BRAND DELI MODAL
// One carousel tile per outside brand. Brand modal can show
// strain artwork when supplied, or a clean strain list when not.
// =========================================================
const curatedBrandData = {
  glacier: {
    name: "Glacier",
    shortName: "Glacier",
    eyebrow: "Curated Partner",
    accent: "#69AEE7",
    accentSoft: "rgba(105,174,231,.18)",
    tileBackground: "radial-gradient(circle at 50% 22%, rgba(255,255,255,.98), rgba(226,241,252,.96) 42%, rgba(160,205,238,.90) 100%), linear-gradient(155deg, #f8fcff 0%, #dceefa 55%, #a4cdeb 100%)",
    logoImage: "./assets/img/brands/glacier/glacier-logo.png",
    intro: "Hand-trimmed premium flower from one of our curated Michigan partners.",
    strains: [
      {
        name: "Blast Chiller",
        thc: "30.7%",
        image: "./assets/img/brands/glacier/blast-chiller-deli.png"
      },
      {
        name: "Green Crack",
        thc: "27%",
        image: "./assets/img/brands/glacier/green-crack-deli.png"
      }
    ]
  },

  redbud: {
    name: "Redbud Roots",
    shortName: "Redbud Roots",
    eyebrow: "Curated Partner",
    accent: "#E56B5D",
    accentSoft: "rgba(229,107,93,.17)",
    tileBackground: "radial-gradient(circle at 50% 28%, rgba(36,76,114,.30), transparent 36%), linear-gradient(155deg, #07101a 0%, #0b1520 50%, #030506 100%)",
    logoImage: "./assets/img/brands/redbud-roots/redbud-roots-logo.png",
    intro: "A rotating selection of Redbud Roots deli flower, curated by Green Labs.",
    strains: [
      { name: "Glitter Bomb", thc: "28.09%" },
      { name: "Macflurry", thc: "26.46%" },
      { name: "Red Nerdz", thc: "24.8%" },
      { name: "Sherb Cream Pie", thc: "21.31%" },
      { name: "Whompz", thc: "28.97%" },
      { name: "Zereals", thc: "20.41%" }
    ]
  },

  sapura: {
    name: "Sapura",
    shortName: "Sapura",
    eyebrow: "Curated Partner",
    accent: "#E94A9D",
    accentSoft: "rgba(233,74,157,.17)",
    tileBackground: "radial-gradient(circle at 48% 30%, rgba(233,74,157,.28), transparent 34%), radial-gradient(circle at 72% 68%, rgba(54,186,166,.16), transparent 30%), linear-gradient(155deg, #160817 0%, #0b0a12 54%, #030405 100%)",
    logoImage: "./assets/img/brands/sapura/sapura-logo.png",
    intro: "Colorful genetics. Big THC. Fresh Sapura flower, hand-picked for the Dutch Deli.",
    strains: [
      { name: "Apple Gas", thc: "32.71%" },
      { name: "Super Boof", thc: "34.82%" },
      { name: "Tongue Splasher", thc: "23.96%" }
    ]
  }
};

let currentCuratedBrandId = null;
let currentCuratedSlide = 0;

function ensureCuratedBrandModal() {
  let modal = document.getElementById("curatedBrandModal");
  if (modal) return modal;

  document.body.insertAdjacentHTML("beforeend", `
    <div
      id="curatedBrandModal"
      aria-hidden="true"
      style="
        position:fixed;
        inset:0;
        z-index:10050;
        display:none;
        align-items:center;
        justify-content:center;
        padding:18px;
        box-sizing:border-box;
      "
    >
      <div
        data-curated-close
        aria-hidden="true"
        style="
          position:absolute;
          inset:0;
          background:rgba(0,0,0,.84);
          backdrop-filter:blur(8px);
        "
      ></div>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="curatedBrandModalName"
        style="
          position:relative;
          width:min(880px, 100%);
          max-height:92vh;
          overflow-y:auto;
          background:#0b0e0d;
          border:1px solid rgba(255,255,255,.14);
          border-radius:18px;
          box-shadow:0 30px 90px rgba(0,0,0,.7);
          color:#fff;
          padding:22px;
          box-sizing:border-box;
        "
      >
        <button
          id="curatedBrandModalClose"
          type="button"
          aria-label="Close curated brand details"
          style="
            position:absolute;
            top:12px;
            right:12px;
            z-index:4;
            width:42px;
            height:42px;
            border-radius:50%;
            border:1px solid rgba(255,255,255,.18);
            background:rgba(0,0,0,.62);
            color:#fff;
            font-size:28px;
            line-height:1;
            cursor:pointer;
          "
        >×</button>

        <div style="text-align:center; padding:8px 42px 18px;">
          <div
            id="curatedBrandModalEyebrow"
            style="
              color:#D6A34A;
              font-size:10px;
              font-weight:900;
              letter-spacing:.16em;
              text-transform:uppercase;
              margin-bottom:8px;
            "
          ></div>

          <img
            id="curatedBrandModalLogo"
            src=""
            alt=""
            style="
              display:none;
              width:min(180px, 55%);
              max-height:120px;
              object-fit:contain;
              margin:0 auto 12px;
            "
          >

          <h2
            id="curatedBrandModalName"
            style="margin:0; font-size:clamp(28px, 7vw, 44px); line-height:1;"
          ></h2>

          <p
            id="curatedBrandModalIntro"
            style="
              margin:12px auto 0;
              max-width:560px;
              color:rgba(255,255,255,.68);
              font-size:14px;
              line-height:1.55;
            "
          ></p>
        </div>

        <div id="curatedBrandGalleryWrap" hidden>
          <div style="position:relative;">
            <button
              id="curatedBrandPrev"
              type="button"
              aria-label="Previous strain"
              style="
                position:absolute;
                left:8px;
                top:50%;
                transform:translateY(-50%);
                z-index:3;
                width:40px;
                height:40px;
                border-radius:50%;
                border:1px solid rgba(255,255,255,.2);
                background:rgba(0,0,0,.68);
                color:#fff;
                font-size:24px;
                cursor:pointer;
              "
            >‹</button>

            <div
              id="curatedBrandGallery"
              style="
                display:flex;
                gap:14px;
                overflow-x:auto;
                scroll-snap-type:x mandatory;
                scroll-behavior:smooth;
                scrollbar-width:none;
                padding:2px 1px 8px;
                width:min(800px, 100%);
                margin:0 auto;
              "
            ></div>

            <button
              id="curatedBrandNext"
              type="button"
              aria-label="Next strain"
              style="
                position:absolute;
                right:8px;
                top:50%;
                transform:translateY(-50%);
                z-index:3;
                width:40px;
                height:40px;
                border-radius:50%;
                border:1px solid rgba(255,255,255,.2);
                background:rgba(0,0,0,.68);
                color:#fff;
                font-size:24px;
                cursor:pointer;
              "
            >›</button>
          </div>

          <div
            id="curatedBrandDots"
            aria-label="Strain gallery position"
            style="display:flex; justify-content:center; gap:7px; padding:8px 0 4px;"
          ></div>
        </div>

        <div
          id="curatedBrandListWrap"
          style="
            margin-top:14px;
            padding:18px;
            border:1px solid rgba(255,255,255,.10);
            border-radius:14px;
            background:rgba(255,255,255,.035);
          "
        >
          <div
            style="
              color:#D6A34A;
              font-size:10px;
              font-weight:900;
              letter-spacing:.16em;
              text-transform:uppercase;
              margin-bottom:12px;
            "
          >Available Deli Strains</div>

          <div
            id="curatedBrandStrainList"
            style="display:flex; flex-wrap:wrap; gap:8px;"
          ></div>
        </div>

        <a
          href="https://greenlabsmi.com/order-online"
          target="_blank"
          rel="noopener"
          style="
            display:block;
            margin-top:18px;
            padding:13px 18px;
            border-radius:10px;
            background:#D6A34A;
            color:#111;
            text-decoration:none;
            text-align:center;
            font-weight:900;
            letter-spacing:.03em;
          "
        >Order for Pickup</a>
      </div>
    </div>
  `);

  modal = document.getElementById("curatedBrandModal");

  document.getElementById("curatedBrandModalClose")?.addEventListener("click", closeCuratedBrandModal);
  modal.querySelector("[data-curated-close]")?.addEventListener("click", closeCuratedBrandModal);
  document.getElementById("curatedBrandPrev")?.addEventListener("click", () => moveCuratedBrandSlide(-1));
  document.getElementById("curatedBrandNext")?.addEventListener("click", () => moveCuratedBrandSlide(1));

  const gallery = document.getElementById("curatedBrandGallery");
  gallery?.addEventListener("scroll", () => {
    const slides = [...gallery.children];
    if (!slides.length) return;

    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.offsetLeft - gallery.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== currentCuratedSlide) {
      currentCuratedSlide = closestIndex;
      updateCuratedBrandDots();
    }
  }, { passive: true });

  return modal;
}

function updateCuratedBrandDots() {
  const dots = document.getElementById("curatedBrandDots");
  if (!dots) return;

  [...dots.children].forEach((dot, index) => {
    dot.style.opacity = index === currentCuratedSlide ? "1" : ".32";
    dot.style.transform = index === currentCuratedSlide ? "scale(1.18)" : "scale(1)";
  });
}

function moveCuratedBrandSlide(direction) {
  const gallery = document.getElementById("curatedBrandGallery");
  if (!gallery) return;

  const slides = [...gallery.children];
  if (!slides.length) return;

  currentCuratedSlide = Math.max(
    0,
    Math.min(slides.length - 1, currentCuratedSlide + direction)
  );

  slides[currentCuratedSlide].scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start"
  });

  updateCuratedBrandDots();
}

function openCuratedBrandModal(brandId) {
  const brand = curatedBrandData[brandId];
  if (!brand) return;

  const modal = ensureCuratedBrandModal();
  modal.style.setProperty("--brand-accent", brand.accent || "#D6A34A");
  modal.dataset.brand = brandId;
  modal.style.setProperty("--brand-accent-soft", brand.accentSoft || "rgba(214,163,74,.16)");
  currentCuratedBrandId = brandId;
  currentCuratedSlide = 0;

  const nameEl = document.getElementById("curatedBrandModalName");
  const eyebrowEl = document.getElementById("curatedBrandModalEyebrow");
  const introEl = document.getElementById("curatedBrandModalIntro");
  const logoEl = document.getElementById("curatedBrandModalLogo");
  const galleryWrap = document.getElementById("curatedBrandGalleryWrap");
  const gallery = document.getElementById("curatedBrandGallery");
  const dots = document.getElementById("curatedBrandDots");
  const list = document.getElementById("curatedBrandStrainList");

  if (nameEl) {
    nameEl.textContent = brand.name;
    nameEl.style.display = brandId === "sapura" ? "none" : "block";
  }
  if (eyebrowEl) eyebrowEl.textContent = brand.eyebrow || "Curated Partner";
  if (introEl) introEl.textContent = brand.intro || "";

  if (logoEl) {
    if (brand.logoImage) {
      logoEl.src = brand.logoImage;
      logoEl.alt = `${brand.name} logo`;
      logoEl.style.display = "block";
      logoEl.style.width = brandId === "sapura" ? "min(440px, 88%)" : "min(180px, 55%)";
      logoEl.style.maxHeight = brandId === "sapura" ? "210px" : "120px";
      logoEl.style.marginBottom = brandId === "sapura" ? "8px" : "12px";
      logoEl.style.background = brandId === "glacier"
        ? "linear-gradient(180deg, rgba(255,255,255,.98), rgba(222,240,252,.96))"
        : "transparent";
      logoEl.style.padding = brandId === "glacier" ? "8px 12px" : "0";
      logoEl.style.borderRadius = brandId === "glacier" ? "12px" : "0";
      logoEl.style.boxSizing = "border-box";
      logoEl.onerror = () => {
        logoEl.style.display = "none";
      };
    } else {
      logoEl.removeAttribute("src");
      logoEl.style.display = "none";
    }
  }

  const artStrains = brand.strains.filter(strain => Boolean(strain.image));

  if (gallery && galleryWrap && dots) {
    if (artStrains.length) {
      galleryWrap.hidden = false;
      gallery.innerHTML = artStrains.map((strain) => `
        <article
          style="
            flex:0 0 100%;
            width:100%;
            max-width:800px;
            aspect-ratio:1/1;
            scroll-snap-align:start;
            border-radius:14px;
            overflow:hidden;
            background:#050606;
            border:1px solid rgba(255,255,255,.10);
            box-sizing:border-box;
          "
        >
          <div style="width:100%; height:100%; aspect-ratio:1/1; background:#050606; display:flex; align-items:center; justify-content:center;">
            <img
              src="${strain.image}"
              alt="${strain.name} by ${brand.name}"
              loading="eager"
              style="width:100%; height:100%; object-fit:cover; display:block;"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            >
            <div
              style="
                display:none;
                width:100%;
                height:100%;
                align-items:center;
                justify-content:center;
                color:rgba(255,255,255,.55);
                font-weight:800;
              "
            >Artwork coming soon</div>
          </div>
        </article>
      `).join("");

      dots.innerHTML = artStrains.map((_, index) => `
        <button
          type="button"
          aria-label="Show strain ${index + 1}"
          data-curated-dot="${index}"
          style="
            width:8px;
            height:8px;
            padding:0;
            border:0;
            border-radius:50%;
            background:#fff;
            opacity:${index === 0 ? "1" : ".32"};
            cursor:pointer;
            transition:.2s ease;
          "
        ></button>
      `).join("");

      dots.querySelectorAll("[data-curated-dot]").forEach(dot => {
        dot.addEventListener("click", () => {
          currentCuratedSlide = Number(dot.dataset.curatedDot) || 0;
          const target = gallery.children[currentCuratedSlide];
          target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
          updateCuratedBrandDots();
        });
      });

      const prev = document.getElementById("curatedBrandPrev");
      const next = document.getElementById("curatedBrandNext");
      const showArrows = artStrains.length > 1;
      if (prev) prev.style.display = showArrows ? "block" : "none";
      if (next) next.style.display = showArrows ? "block" : "none";
    } else {
      galleryWrap.hidden = true;
      gallery.innerHTML = "";
      dots.innerHTML = "";
    }
  }

  if (list) {
    list.style.display = "grid";
    list.style.gap = "0";
    list.innerHTML = brand.strains.map((strain) => {
      return `
        <div
          style="
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:16px;
            width:100%;
            padding:12px 0;
            border-radius:0;
            background:transparent;
            border:0;
            border-bottom:1px solid rgba(255,255,255,.08);
            color:rgba(255,255,255,.88);
            font-size:13px;
            font-weight:800;
          "
        ><span>${strain.name}</span><span style="color:rgba(255,255,255,.62); white-space:nowrap;">${strain.thc ? `${strain.thc} THC` : ""}</span></div>
      `;
    }).join("");
  }

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    if (gallery) gallery.scrollLeft = 0;
    updateCuratedBrandDots();
  });
}

function closeCuratedBrandModal() {
  const modal = document.getElementById("curatedBrandModal");
  if (!modal) return;

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  currentCuratedBrandId = null;
  currentCuratedSlide = 0;
  document.body.style.overflow = "";
}

function initCuratedBrandDeli() {
  // Curated partners belong inside the SAME horizontal Dutch Deli carousel.
  const deliCarousel = document.getElementById("deliCarousel");
  const curatedCards = [...document.querySelectorAll(".curated-brand-card")];

  const syncCuratedCardSize = () => {
    if (!deliCarousel) return;

    const referenceCard = deliCarousel.querySelector(
      ".deli-card-wrapper:not(.curated-brand-card) .deli-card"
    );
    const referenceHeight = referenceCard?.getBoundingClientRect().height || 0;
    if (!referenceHeight) return;

    curatedCards.forEach((card) => {
      const cardShell = card.querySelector(".deli-card");
      const front = card.querySelector(".deli-card__front");

      if (cardShell) {
        cardShell.style.height = `${referenceHeight}px`;
        cardShell.style.minHeight = `${referenceHeight}px`;
      }

      if (front) {
        front.style.height = "100%";
        front.style.minHeight = "100%";
      }
    });
  };

  if (deliCarousel) {
    curatedCards.forEach(card => deliCarousel.appendChild(card));

    // Keep the newest DTG drops at the very front of the deli on every page load.
    const newDropOrder = [
      "lemon-wookie",
      "astro-taffy",
      "white-lightning",
      "palpatine",
      "lazy-lightning",
      "afghani-2",
      "space-hippy-bubblehash"
    ];

    [...newDropOrder].reverse().forEach(strainId => {
      const card = [...deliCarousel.querySelectorAll(".deli-card-wrapper")].find(item => {
        const action = item.getAttribute("onclick") || "";
        return action.includes(`'${strainId}'`) || action.includes(`\"${strainId}\"`);
      });
      if (card) deliCarousel.prepend(card);
    });

    deliCarousel.scrollLeft = 0;
    requestAnimationFrame(syncCuratedCardSize);
    setTimeout(syncCuratedCardSize, 120);
    window.addEventListener("resize", syncCuratedCardSize, { passive: true });
  }

  curatedCards.forEach(card => {
    const brandMarker = card.querySelector("[data-curated-brand]");
    const brandId = brandMarker?.dataset.curatedBrand;
    const brand = curatedBrandData[brandId];

    if (!brand) return;

    card.style.cursor = "pointer";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Explore ${brand.name} deli strains`);

    const openBrand = (event) => {
      event?.preventDefault();
      event?.stopPropagation();
      if (typeof triggerHaptic === "function") triggerHaptic();
      openCuratedBrandModal(brandId);
    };

    card.addEventListener("click", openBrand);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        openBrand(event);
      }
    });

    // Build every curated partner tile from the official logo + a coded brand background.
    // This keeps the main carousel clean and avoids needing a separate tall poster asset.
    const front = card.querySelector(".deli-card__front");
    if (front) {
      front.style.background = brand.tileBackground || "linear-gradient(155deg, #101413, #050606)";
      front.style.position = "relative";
      front.style.display = "flex";
      front.style.alignItems = "center";
      front.style.justifyContent = "center";
      front.style.padding = "18px";
      front.style.boxSizing = "border-box";
      front.style.overflow = "hidden";
      front.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,.12)";

      const temporaryText = front.firstElementChild;
      if (temporaryText) temporaryText.style.display = "none";

      if (brand.logoImage) {
        let logo = front.querySelector(".curated-brand-card__logo");
        if (!logo) {
          logo = document.createElement("img");
          logo.className = "curated-brand-card__logo";
          front.appendChild(logo);
        }

        logo.src = brand.logoImage;
        logo.alt = `${brand.name} logo`;
        logo.loading = "eager";
        logo.style.cssText = `
          display:block;
          width:88%;
          max-width:240px;
          max-height:72%;
          object-fit:contain;
          position:relative;
          z-index:2;
          filter:drop-shadow(0 12px 24px rgba(0,0,0,.55));
        `;

        logo.onerror = () => {
          logo.style.display = "none";
          if (temporaryText) temporaryText.style.display = "block";
        };
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCuratedBrandModal();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCuratedBrandDeli);
} else {
  initCuratedBrandDeli();
}

let currentDeliModalImage = "front";

function renderDeliModalPricing(tierKey) {
  const tier = deliTierData[tierKey] || deliTierData.core;
  const pricingMount = document.getElementById("deliModalPricing");
  const pricingTitle = document.getElementById("deliModalPricingTitle");
  const tierBadge = document.getElementById("deliModalTier");

  if (pricingTitle) {
    pricingTitle.textContent = tier.pricingTitle;
  }

  if (tierBadge) {
    tierBadge.textContent = tier.badge;
    tierBadge.className = `deli-modal__tier deli-modal__tier--${tierKey}`;
  }

  if (pricingMount) {
    pricingMount.innerHTML = tier.prices
      .map(([weight, price]) => `
        <div class="deli-modal__price-row">
          <span class="deli-modal__price-weight">${weight}</span>
          <span class="deli-modal__price-dots" aria-hidden="true"></span>
          <strong class="deli-modal__price-amount">${price}</strong>
        </div>
      `)
      .join("");
  }
}

function ensureDeliTerpeneMount() {
  let mount = document.getElementById("deliModalTerpenes");

  if (mount) return mount;

  const aboutEl = document.getElementById("deliModalAbout");
  const geneticsEl = document.getElementById("deliModalGenetics");

  mount = document.createElement("div");

  mount.id = "deliModalTerpenes";
  mount.className = "deli-modal__terpenes";
  mount.hidden = true;

  mount.style.cssText = `
    margin: 14px 0;
    padding: 12px 14px;
    border: 1px solid rgba(214, 163, 74, 0.35);
    border-radius: 10px;
    background: rgba(214, 163, 74, 0.06);
  `;

  if (aboutEl && aboutEl.parentNode) {
    aboutEl.parentNode.insertBefore(mount, aboutEl);
  } else if (geneticsEl && geneticsEl.parentNode) {
    geneticsEl.parentNode.insertBefore(mount, geneticsEl.nextSibling);
  }

  return mount;
}

function renderDeliModalTerpenes(strain) {
  const section = document.getElementById("deliModalTerpenesSection");
  const mount = document.getElementById("deliModalTerpenes");

  if (!section || !mount) return;

  const terpenes =
    Array.isArray(strain.terpenes)
      ? strain.terpenes
      : [];

  if (!terpenes.length) {
    section.hidden = true;
    mount.innerHTML = "";
    return;
  }

  section.hidden = false;

  mount.innerHTML = `
    <div style="display:grid; gap:8px;">
      ${terpenes.map((terp) => `
        <div
          style="
            display:grid;
            grid-template-columns:minmax(0,1fr) auto;
            gap:14px;
            align-items:center;
            padding:7px 0;
            border-bottom:1px solid rgba(255,255,255,0.08);
          "
        >
          <strong
            style="
              color:#fff;
              font-size:13px;
              font-weight:800;
            "
          >
            ${terp.name}
          </strong>

          <span
            style="
              color:#D6A34A;
              font-size:13px;
              font-weight:800;
              white-space:nowrap;
            "
          >
            ${terp.percent}
          </span>
        </div>
      `).join("")}
    </div>
  `;
}

function setDeliModalImage(strain, preferBud = true) {
  const image = document.getElementById("deliModalImage");
  const hint = document.getElementById("deliModalImageHint");

  if (!image) return;

  const hasBud =
    Boolean(strain.budImage && strain.budImage.trim());

  const hasArt =
    Boolean(strain.artImage && strain.artImage.trim());

  if (preferBud && hasBud) {
    image.src = strain.budImage;
    image.alt = `${strain.name} bud`;

    currentDeliModalImage = "front";
  } else if (hasArt) {
    image.src = strain.artImage;
    image.alt = `${strain.name} label artwork`;

    currentDeliModalImage = "back";
  } else if (hasBud) {
    image.src = strain.budImage;
    image.alt = `${strain.name} bud`;

    currentDeliModalImage = "front";
  } else {
    image.removeAttribute("src");
    image.alt = `${strain.name} image unavailable`;

    currentDeliModalImage = "front";
  }

  if (hint) {
    const canFlip =
      hasBud &&
      hasArt &&
      strain.budImage !== strain.artImage;

    hint.hidden = !canFlip;

    if (canFlip) {
      hint.textContent =
        currentDeliModalImage === "front"
          ? "Tap for Label Art 🔄"
          : "Tap for Bud Photo 🔄";
    } else {
      hint.textContent = "";
    }
  }
}

function openDeliModal(strainId) {
  const strain = deliStrainData[strainId];
  const modal = document.getElementById("deliModal");

  if (!strain || !modal) {
    console.warn(
      "[Dutch Deli] Missing strain or modal:",
      strainId
    );
    return;
  }

  modal.dataset.currentStrain = strainId;

  // Automatically uses art if no bud image exists.
  setDeliModalImage(strain, true);

  const nameEl =
    document.getElementById("deliModalName");

  const typeEl =
    document.getElementById("deliModalType");

  const seedEl =
    document.getElementById("deliModalSeedSource");

  const geneticsEl =
    document.getElementById("deliModalGenetics");

  const aboutEl =
    document.getElementById("deliModalAbout");

  if (nameEl) {
    nameEl.textContent = strain.name;
  }

  if (typeEl) {
    typeEl.textContent =
      `${strain.type} • ${strain.thc}`;
  }

  if (seedEl) {
    seedEl.textContent = strain.seedSource;
  }

  if (geneticsEl) {
    geneticsEl.textContent = strain.genetics;
  }

  if (aboutEl) {
    aboutEl.textContent = strain.about;
  }

  // Only appears when terpenes exist for this strain.
  renderDeliModalTerpenes(strain);

  renderDeliModalPricing(
    strain.tier || "core"
  );

  modal.classList.add("is-open");
  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";
}

function closeDeliModal() {
  const modal =
    document.getElementById("deliModal");

  if (!modal) return;

  modal.classList.remove("is-open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";
}

function flipDeliModalImage() {
  const modal =
    document.getElementById("deliModal");

  const image =
    document.getElementById("deliModalImage");

  if (!modal || !image) return;

  const strain =
    deliStrainData[
      modal.dataset.currentStrain
    ];

  if (!strain) return;

  const hasBud =
    Boolean(
      strain.budImage &&
      strain.budImage.trim()
    );

  const hasArt =
    Boolean(
      strain.artImage &&
      strain.artImage.trim()
    );

  // Prevent art-only strains from flipping to blank.
  if (
    !(hasBud && hasArt) ||
    strain.budImage === strain.artImage
  ) {
    return;
  }

  image.style.opacity = "0.35";

  setTimeout(() => {
    const preferBud =
      currentDeliModalImage !== "front";

    setDeliModalImage(
      strain,
      preferBud
    );

    image.style.opacity = "1";
  }, 140);
}

// Close the deli modal with the Escape key.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDeliModal();
  }
});

// Keyboard support for the modal image toggle.
// Mouse/touch clicking is handled directly in the modal HTML.
const deliModalImageToggle = document.getElementById("deliModalImageToggle");

if (deliModalImageToggle) {
  deliModalImageToggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
      flipDeliModalImage();
    }
  });
}

   
  // ===== DEALS DROPDOWN LOGIC =====
{
  const dealsDropEl = document.getElementById('dealsDrop');
  const dealsSummaryEl = document.querySelector('.drDrop__summary');
  const dealsBodyEl = document.querySelector('.drDrop__body');

  if (dealsDropEl && dealsSummaryEl && dealsBodyEl) {
    // Force the HTML to stay open so the CSS animation can run smoothly.
    dealsDropEl.setAttribute('open', 'true');

    // Summary click.
    dealsSummaryEl.addEventListener('click', (e) => {
      e.preventDefault();
      dealsDropEl.classList.toggle('is-fully-open');
    });

    // Clicking the preview area opens the dropdown.
    dealsBodyEl.addEventListener('click', (e) => {
      if (
        !dealsDropEl.classList.contains('is-fully-open') &&
        !e.target.closest('.drSearch')
      ) {
        dealsDropEl.classList.add('is-fully-open');
      }
    });
  }

  // Scroll category arrows.
  const dealJumpWrapEl = document.getElementById('dealJumpWrap');
  const leftArrowEl = document.getElementById('jumpArrowLeft');
  const rightArrowEl = document.getElementById('jumpArrowRight');

  if (dealJumpWrapEl && leftArrowEl && rightArrowEl) {
    leftArrowEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      dealJumpWrapEl.scrollBy({
        left: -250,
        behavior: 'smooth'
      });
    });

    rightArrowEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      dealJumpWrapEl.scrollBy({
        left: 250,
        behavior: 'smooth'
      });
    });
  }
}

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
// ===== CURATED PARTNER VISUAL UPGRADE =====
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('curatedBrandModalStyles')) {
    document.head.insertAdjacentHTML('beforeend', `
      <style id="curatedBrandModalStyles">
        #curatedBrandModal [role="dialog"]{width:min(920px,100%)!important;padding:20px!important;background:radial-gradient(circle at 50% -10%,var(--brand-accent-soft,rgba(214,163,74,.12)),transparent 34%),linear-gradient(180deg,#101412 0%,#080a09 100%)!important;border:1px solid rgba(255,255,255,.16)!important;box-shadow:0 28px 90px rgba(0,0,0,.82),inset 0 1px 0 rgba(255,255,255,.05)!important;}
        #curatedBrandModalEyebrow{display:none!important;}
        #curatedBrandModalLogo{width:min(150px,34%)!important;max-height:100px!important;margin-bottom:8px!important;filter:drop-shadow(0 10px 24px rgba(0,0,0,.48));} #curatedBrandModal[data-brand="sapura"] #curatedBrandModalLogo{width:min(440px,88%)!important;max-height:210px!important;margin:6px auto 18px!important;}
        #curatedBrandModalName{font-family:'Cinzel',serif!important;font-size:clamp(26px,5vw,38px)!important;letter-spacing:-.025em;}
        #curatedBrandModalIntro{max-width:700px!important;margin:8px auto 4px!important;color:rgba(255,255,255,.74)!important;font-size:16px!important;line-height:1.55!important;} #curatedBrandModal[data-brand="sapura"] #curatedBrandModalIntro{max-width:680px!important;font-size:clamp(18px,2.1vw,22px)!important;line-height:1.5!important;font-weight:800!important;letter-spacing:.01em!important;color:#fff!important;text-align:center!important;}
        #curatedBrandGalleryWrap{width:min(824px,calc(100vw - 48px));box-sizing:border-box;margin:10px auto 0!important;padding:6px!important;border:1px solid rgba(255,255,255,.10);border-radius:16px;background:rgba(255,255,255,.025);overflow:hidden!important;}
        #curatedBrandGallery{width:100%!important;max-width:800px!important;margin:0 auto!important;} #curatedBrandGallery article{position:relative;flex:0 0 100%!important;width:100%!important;max-width:800px!important;aspect-ratio:1/1!important;border-color:rgba(255,255,255,.12)!important;border-radius:16px!important;background:#050606!important;box-shadow:0 18px 48px rgba(0,0,0,.38);}
        #curatedBrandGallery article>div:first-child{position:static!important;width:100%!important;height:100%!important;aspect-ratio:1/1!important;max-width:800px!important;max-height:800px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:#080a09!important;display:block!important;overflow:hidden!important;}
        #curatedBrandGallery img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;margin:0!important;padding:0!important;}
        
        #curatedBrandPrev{left:-18px!important;}#curatedBrandNext{right:-18px!important;}#curatedBrandPrev,#curatedBrandNext{border-color:rgba(255,255,255,.28)!important;background:rgba(0,0,0,.82)!important;box-shadow:0 8px 24px rgba(0,0,0,.35);}
        #curatedBrandDots button{background:var(--brand-accent,#D6A34A)!important;}
        #curatedBrandListWrap{width:min(760px,100%);box-sizing:border-box;margin:18px auto 0!important;padding:18px 20px!important;border-color:rgba(255,255,255,.12)!important;background:rgba(255,255,255,.035)!important;}
        #curatedBrandListWrap>div:first-child{color:var(--brand-accent,#D6A34A)!important;margin-bottom:12px!important;font-size:13px!important;letter-spacing:.14em!important;font-weight:900!important;} #curatedBrandStrainList>div{font-size:16px!important;padding:15px 0!important;} #curatedBrandStrainList>div span:first-child{font-size:17px!important;color:#fff!important;} #curatedBrandStrainList>div span:last-child{font-size:15px!important;font-weight:900!important;color:rgba(255,255,255,.78)!important;} #curatedBrandModal[data-brand="sapura"] #curatedBrandListWrap{background:linear-gradient(180deg,rgba(255,55,150,.08),rgba(255,255,255,.035))!important;border-color:rgba(255,95,175,.22)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04);} #curatedBrandModal[data-brand="sapura"] #curatedBrandListWrap>div:first-child{font-size:14px!important;color:#ff69b7!important;}
        #curatedBrandStrainList button{appearance:none;-webkit-appearance:none;padding:9px 12px!important;border-color:rgba(255,255,255,.14)!important;background:rgba(255,255,255,.07)!important;color:#fff!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.04);transition:transform .16s ease,border-color .16s ease,background .16s ease;}#curatedBrandStrainList button:not(:disabled):hover{transform:translateY(-1px);border-color:var(--brand-accent,#D6A34A)!important;background:rgba(255,255,255,.11)!important;}#curatedBrandStrainList button:disabled{opacity:.72;}
        #curatedBrandModal a[href*="order-online"]{width:min(760px,100%);box-sizing:border-box;margin:14px auto 0!important;background:linear-gradient(135deg,#D6A34A,#efbd55)!important;box-shadow:0 10px 28px rgba(214,163,74,.18);}
        .curated-brand-card .deli-card{border-color:rgba(255,255,255,.12)!important;box-shadow:none!important;}
        .curated-brand-card .deli-card__front{position:relative!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.10)!important;}
        .curated-brand-card__pill{display:none!important;}
        @media(max-width:700px){#curatedBrandModal{padding:10px!important;}#curatedBrandModal [role="dialog"]{padding:14px!important;border-radius:16px!important;}#curatedBrandGalleryWrap{width:100%!important;padding:4px!important;}#curatedBrandPrev{left:4px!important;}#curatedBrandNext{right:4px!important;}#curatedBrandModalLogo{width:min(120px,36%)!important;}#curatedBrandModal[data-brand="sapura"] #curatedBrandModalLogo{width:min(360px,90%)!important;max-height:170px!important;}#curatedBrandModal[data-brand="sapura"] #curatedBrandModalIntro{font-size:18px!important;}#curatedBrandStrainList>div{font-size:15px!important;padding:13px 0!important;}#curatedBrandStrainList>div span:first-child{font-size:16px!important;}}
      </style>
    `);
  }

  document.querySelectorAll('.curated-brand-card').forEach(card => {
    const brandId = card.querySelector('[data-curated-brand]')?.dataset.curatedBrand;
    const brand = curatedBrandData[brandId];
    if (!brand) return;
    const meta = card.querySelector('.deli-card__genetics');
    if (meta) {
      const count = brand.strains.length;
      meta.textContent = `${count} Strain${count === 1 ? '' : 's'}`;
    }
    const front = card.querySelector('.deli-card__front');
    if (front && !front.querySelector('.curated-brand-card__pill')) {
      const pill = document.createElement('span');
      pill.className = 'curated-brand-card__pill';
      pill.textContent = 'CURATED PARTNER';
      pill.style.borderColor = brand.accent || 'rgba(255,255,255,.22)';
      front.appendChild(pill);
    }
  });
});

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
});


