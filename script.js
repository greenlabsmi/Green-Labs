// ------------------------------------------------------------
// Green Labs – main client script (Dutch Republic structure)
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  console.log('[greenlabs] script booted');

  // ===== AGE GATE ======================================================
  (function () {
    const KEY = 'gl_age_until';
    const gate = document.getElementById('ageGate');
    if (!gate) return;

    const sp = new URL(location.href).searchParams;
    if (sp.get('agegate') === 'clear') localStorage.removeItem(KEY);
    const forceShow = sp.get('agegate') === 'show';

    const okUntil = Number(localStorage.getItem(KEY) || 0);
    const sessionOK = sessionStorage.getItem(KEY) === '1';
    const isOK = (okUntil > Date.now()) || sessionOK;

    function show() {
      gate.setAttribute('aria-hidden', 'false');
      gate.style.display = 'flex';
      document.body.classList.add('agegate--lock');
    }
    function hide() {
      gate.setAttribute('aria-hidden', 'true');
      gate.style.display = 'none';
      document.body.classList.remove('agegate--lock');
    }

    const yes = document.getElementById('ageYes');
    const no = document.getElementById('ageNo');
    const remember = document.getElementById('ageRemember');

    if (yes) {
      yes.addEventListener('click', () => {
        if (remember && remember.checked) {
          const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
          localStorage.setItem(KEY, String(Date.now() + THIRTY_DAYS));
        } else {
          sessionStorage.setItem(KEY, '1');
        }
        hide();
      });
    }
    if (no) {
      no.addEventListener('click', () => {
        location.href = 'https://www.google.com';
      });
    }

    if (forceShow) show();
    else if (isOK) hide();
    else show();
  })();

  // ===== ALIGN FLOATING POPOVERS ======================================
  function alignFloating(trigger, panel, opts = {}) {
    if (!trigger || !panel) return;
    const r = trigger.getBoundingClientRect();
    const gap = opts.gap ?? 8;
    const align = opts.align ?? 'end';

    panel.style.position = 'fixed';
    panel.style.right = '';

    let left;
    if (align === 'start') left = r.left;
    if (align === 'center') left = r.left + r.width / 2 - panel.offsetWidth / 2;
    if (align === 'end') left = r.left + r.width - panel.offsetWidth;

    const pad = 8;
    left = Math.max(pad, Math.min(left, window.innerWidth - panel.offsetWidth - pad));
    panel.style.left = Math.round(left) + 'px';
    panel.style.top = Math.round(r.bottom + gap) + 'px';
  }

  // ===== STICKY HEADER SWAP ===========================================
  (function stickyHeader() {
    const hdr = document.querySelector('.site-header');
    if (!hdr) return;
    const onScroll = () => hdr.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    document.addEventListener('scroll', onScroll, { passive: true });
  })();

  (function stickySwap() {
    const banner = document.querySelector('.brand-banner');
    if (!banner) return;
    const activate = (on) => document.body.classList.toggle('show-sticky', on);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => activate(!entries[0].isIntersecting),
        { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
      );
      io.observe(banner);
    } else {
      const check = () => activate(window.scrollY > banner.offsetHeight - 1);
      check();
      window.addEventListener('scroll', check, { passive: true });
      window.addEventListener('resize', check);
    }
  })();

  // ===== FOOTER YEAR ==================================================
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ===== EXTERNAL LINKS ===============================================
  document.querySelectorAll('[data-ext]').forEach(a => {
    a.setAttribute('rel', 'noopener');
    a.setAttribute('target', '_blank');
  });

  // ===== MOBILE MENU POPOVER ==========================================
  (function menuPopover() {
    const openBtn = document.querySelector('[data-open-menu]');
    const pop = document.getElementById('navDrawer');
    const ovl = document.getElementById('menuOverlay');
    if (!openBtn || !pop || !ovl) return;

    const open = () => {
      pop.hidden = false;
      ovl.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      alignFloating(openBtn, pop, { align: 'end', gap: 8 });
    };
    const close = () => {
      pop.hidden = true;
      ovl.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
    };

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      (pop.hidden ? open() : close());
    });
    ovl.addEventListener('click', close);
    pop.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    const keepAligned = () => { if (!pop.hidden) alignFloating(openBtn, pop, { align: 'end', gap: 8 }); };
    window.addEventListener('resize', keepAligned, { passive: true });
    window.addEventListener('scroll', keepAligned, { passive: true });
    window.addEventListener('scroll', close, { passive: true });
  })();

  // ===== DEALS LOADER =================================================
  (function deals() {
    const body = document.getElementById('dealBody');
    const list = document.getElementById('dealList');
    const card = document.querySelector('.deal-card');
    if (!body || !list || !card) return;

    fetch('deals.json', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => renderDeals(list, data))
      .catch(() => { list.innerHTML = '<li>Deals unavailable right now.</li>'; });

    function esc(s) {
      return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
    }

    function renderDeals(target, data) {
      const html = data.map(cat => {
        if (cat.groups && Array.isArray(cat.groups)) {
          const groups = cat.groups.map(g => `
            <div class="deal-subgroup">
              <div class="deal-subtitle">${esc(g.title)}</div>
              <ul class="deal-items">
                ${(g.items || []).map(it => `<li>${esc(it)}</li>`).join('')}
              </ul>
            </div>`).join('');
          return `<li class="deal-cat"><div class="deal-cat-title">${esc(cat.category)}</div>${groups}</li>`;
        } else {
          return `<li class="deal-cat">
            <div class="deal-cat-title">${esc(cat.category)}</div>
            <ul class="deal-items">
              ${(cat.items || []).map(it => `<li>${esc(it)}</li>`).join('')}
            </ul>
          </li>`;
        }
      }).join('');
      target.innerHTML = html + `<div class="deal-note">All prices include tax.</div>`;
    }

    const expand = () => { card.setAttribute('aria-expanded', 'true'); body.classList.remove('collapsed'); };
    const collapse = () => { card.setAttribute('aria-expanded', 'false'); body.classList.add('collapsed'); };
    const toggle = () => (card.getAttribute('aria-expanded') === 'true') ? collapse() : expand();

    card.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, label, select, textarea')) return;
      toggle();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    const closeBtn = document.getElementById('closeDeals');
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); collapse(); });
  })();

  // ===== SMART MAPS HELPER ============================================
  function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent || ''); }
  function isAndroid() { return /Android/.test(navigator.userAgent || ''); }
  function smartMapHref(address) {
    const q = encodeURIComponent(address);
    if (isIOS()) return `maps://?q=${q}`;
    if (isAndroid()) return `geo:0,0?q=${q}`;
    return `https://www.google.com/maps?q=${q}`;
  }

  // ===== HOURS POPOVER ================================================
  (function hours() {
    const btn = document.getElementById('hoursBtn');
    const pop = document.getElementById('hoursPopover');
    const ovl = document.getElementById('hoursOverlay');
    const list = document.getElementById('hoursList');
    const note = document.getElementById('hoursNote');
    const statusDot = document.getElementById('hoursStatusDot');
    if (!btn || !pop || !ovl || !list || !note) return;

    const HOURS = [
      { d: 'Sunday', open: 9, close: 21 },
      { d: 'Monday', open: 9, close: 21 },
      { d: 'Tuesday', open: 9, close: 21 },
      { d: 'Wednesday', open: 9, close: 21 },
      { d: 'Thursday', open: 9, close: 21 },
      { d: 'Friday', open: 9, close: 21 },
      { d: 'Saturday', open: 9, close: 21 },
    ];

    const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';

    function fmt(h) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hr = ((h + 11) % 12) + 1;
      return `${hr}${ampm}`;
    }

    function statusNow() {
      const now = new Date();
      const idx = now.getDay();
      const hour = now.getHours() + now.getMinutes() / 60;
      const { open, close } = HOURS[idx];
      const openSoon = hour >= open - 0.5 && hour < open;
      const closingSoon = hour >= close - 0.5 && hour < close;
      const isOpen = hour >= open && hour < close;
      return { isOpen, openSoon, closingSoon, open, close, idx };
    }

    function paintPill() {
      const s = statusNow();
      btn.classList.remove('state-open', 'state-soon', 'state-closed');
      let tip = '';

      if (s.isOpen && s.closingSoon) {
        btn.textContent = 'CLOSING SOON';
        btn.classList.add('state-soon');
        tip = `Closes at ${fmt(s.close)} today`;
      } else if (!s.isOpen && s.openSoon) {
        btn.textContent = 'OPENING SOON';
        btn.classList.add('state-soon');
        tip = `Opens at ${fmt(s.open)} today`;
      } else if (s.isOpen) {
        btn.textContent = 'OPEN';
        btn.classList.add('state-open');
        tip = `Open until ${fmt(s.close)} today`;
      } else {
        btn.textContent = 'CLOSED';
        btn.classList.add('state-closed');
        tip = `Opens tomorrow at ${fmt(HOURS[(s.idx + 1) % 7].open)}`;
      }
      btn.dataset.tip = tip;

      if (statusDot) {
        statusDot.className = 'status-dot ' + (s.isOpen ? 'is-open' : (s.openSoon || s.closingSoon ? 'is-soon' : 'is-closed'));
      }
    }

    function renderHours() {
      const today = new Date().getDay();
      list.innerHTML = HOURS.map((h, i) => `
        <li class="${i === today ? 'is-today' : ''}">
          <span>${h.d}</span>
          <span>${fmt(h.open)} – ${fmt(h.close)}</span>
        </li>`).join('');

      const href = smartMapHref(ADDRESS);
      note.innerHTML = `<a class="note-address" href="${href}">${ADDRESS}</a>`;
      const a = note.querySelector('.note-address');
      if (a && /^https?:/i.test(a.href)) { a.target = '_blank'; a.rel = 'noopener'; }
    }

    function alignHoursPopover() {
      const strip = document.getElementById('statusStrip');
      const stripVisible = strip && getComputedStyle(strip).display !== 'none';
      const anchor = (stripVisible && strip) || document.querySelector('.sticky-nav') || document.querySelector('.site-header');
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const top = rect.bottom;
      pop.style.top = `${top}px`;
      pop.style.right = '16px';
    }

    function openPop() { pop.hidden = false; ovl.hidden = false; btn.setAttribute('aria-expanded', 'true'); alignHoursPopover(); }
    function closePop() { pop.hidden = true; ovl.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

    paintPill();
    renderHours();
    btn.addEventListener('click', () => (pop.hidden ? openPop() : closePop()));
    ovl.addEventListener('click', closePop);
    window.addEventListener('scroll', closePop, { passive: true });
    window.addEventListener('scroll', () => { if (!pop.hidden) alignHoursPopover(); }, { passive: true });
    window.addEventListener('resize', () => { if (!pop.hidden) alignHoursPopover(); });
    setInterval(paintPill, 60000);
  })();

  // ===== MAPS BUTTON ===================================================
  (function maps() {
    const btn = document.getElementById('openMapsSmart');
    if (!btn) return;
    const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';
    btn.addEventListener('click', () => {
      const href = smartMapHref(ADDRESS);
      if (/^https?:/i.test(href)) window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    });

    const mapLink = document.querySelector('.map-link');
    if (mapLink) {
      mapLink.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'iframe') return;
        const webUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(ADDRESS);
        window.open(webUrl, '_blank', 'noopener');
      });
    }
  })();

  // ===== STATUS STRIP SYNC ============================================
  (function statusStripSync() {
    const strip = document.getElementById('statusStrip');
    const dot = strip ? strip.querySelector('.status-dot') : null;
    const textEl = document.getElementById('statusText');
    const pillBtn = document.getElementById('hoursBtn');
    const addrEl = document.getElementById('statusAddr');

    if (!strip || !pillBtn || !dot || !textEl) return;
    if (addrEl) addrEl.addEventListener('click', (e) => e.stopPropagation());

    const ADDRESS = '10701 Madison St, Luna Pier, MI 48157';
    if (addrEl) addrEl.textContent = ADDRESS;

    const setText = (label, klass) => {
      textEl.className = 'status-text';
      if (klass) textEl.classList.add(klass);
      textEl.textContent = label;
    };

    const syncState = () => {
      dot.classList.remove('is-open', 'is-soon', 'is-closed');
      if (pillBtn.classList.contains('state-open')) {
        dot.classList.add('is-open'); setText('Open', 'open');
      } else if (pillBtn.classList.contains('state-soon')) {
        dot.classList.add('is-soon'); setText('Closing Soon', 'soon');
      } else if (pillBtn.classList.contains('state-closed')) {
        dot.classList.add('is-closed'); setText('Closed', 'closed');
      } else {
        setText('Store status', '');
      }
    };

    strip.addEventListener('click', () => pillBtn.click());
    setTimeout(syncState, 0);
    new MutationObserver(syncState).observe(pillBtn, { attributes: true, attributeFilter: ['class'] });
    setInterval(syncState, 30000);
  })();

  // ===== SMOOTH SCROLL ================================================
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';

    if (
      a.hasAttribute('data-ext') ||
      a.target === '_blank' ||
      /^https?:\/\//i.test(href) ||
      a.closest('#navDrawer') ||
      a.closest('.menu-popover') ||
      a.closest('#leafly-embed-wrapper')
    ) return;

    if (href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  // ===== HERO CAROUSEL ===============================================
  (function () {
    const root = document.getElementById('hero-slides');
    if (!root) return;
    const slides = [...root.querySelectorAll('.slide')].filter(s => {
      const img = s.querySelector('img');
      return img && img.getAttribute('src');
    });
    const N = slides.length;
    if (!N) return;

    let i = slides.findIndex(s => s.classList.contains('is-active'));
    if (i < 0) i = 0;
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));

    let dotsBar = root.querySelector('.dots');
    if (!dotsBar) { dotsBar = document.createElement('div'); dotsBar.className = 'dots'; root.appendChild(dotsBar); }
    dotsBar.innerHTML = '';
    const dots = slides.map((_, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${k + 1}`);
      if (k === i) b.setAttribute('aria-current', 'true');
      b.addEventListener('click', () => go(k, true));
      dotsBar.appendChild(b);
      return b;
    });

    let prevEdge = root.querySelector('.edge--prev');
    let nextEdge = root.querySelector('.edge--next');
    if (!prevEdge) {
      prevEdge = document.createElement('button');
      prevEdge.className = 'edge edge--prev';
      prevEdge.type = 'button';
      prevEdge.setAttribute('aria-label', 'Previous');
      root.appendChild(prevEdge);
    }
    if (!nextEdge) {
      nextEdge = document.createElement('button');
      nextEdge.className = 'edge edge--next';
      nextEdge.type = 'button';
      nextEdge.setAttribute('aria-label', 'Next');
      root.appendChild(nextEdge);
    }
    prevEdge.addEventListener('click', () => go(i - 1, true));
    nextEdge.addEventListener('click', () => go(i + 1, true));

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, true); }
    });

    let startX = null;
    root.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    root.addEventListener('touchend', e => {
      if (startX == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1, true);
      startX = null; start();
    }, { passive: true });

    const delay = parseInt(root.dataset.autoplay || '7000', 10);
    const prefersReduced = root.hasAttribute('data-ignore-reduced-motion')
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let timer = null;
    function start() { if (!prefersReduced) { stop(); timer = setInterval(() => go(i + 1, false), delay); } }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    go(i, false);
    start();

    function go(n, user = false) {
      const prev = i;
      i = ((n % N) + N) % N;
      if (i === prev) return;
      slides[prev].classList.remove('is-active');
      slides[i].classList.add('is-active');
      if (dots[prev]) dots[prev].removeAttribute('aria-current');
      if (dots[i]) dots[i].setAttribute('aria-current', 'true');
      if (user) { stop(); start(); }
    }
  })();
});
