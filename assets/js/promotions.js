(() => {
  "use strict";

  const TIME_ZONE = "America/Detroit";
  const MANUAL_CAMPAIGN = null;

  const PROMOTIONS = {
    default: {
      enabled: true,
      banner: { headline: "🌿 FRESH DELI DROP", products: "AWARD-WINNING LEMON WOOKIE AVAILABLE NOW", offer: "NEW SPACE HIPPY BUBBLE HASH INFUSED BUDS" },
      hero: { image: "assets/img/deli-drop-aug-hero.jpg", position: "center", href: "#deli", ariaLabel: "Shop the latest Green Labs deli flower drop" },
      popup: { id: "hyman-stylus-july-2026", enabled: false, frequency: "campaign", delay: 10000, type: "image", image: "assets/img/highlights/hyman-stylus-hl.jpg", video: "", poster: "assets/img/highlights/hyman-stylus-hl.jpg", alt: "Hyman live resin stylus promotion", href: "#deli", ariaLabel: "View the Hyman live resin stylus promotion" }
    },
    weekendHighlights: {
      enabled: true,
      banner: { headline: "🌿 SMALL BUD WEEKEND DROP", products: "$10 EIGHTHS · $55 OUNCES", offer: "BIG QUALITY · SMALLER PRICE" },
      hero: { image: "assets/img/promotions/small-bud-deli-drop-hero.jpg", position: "center", size: "contain", href: "#shop", shop: "rec", cta: "SHOP SMALL BUD DROP →", ariaLabel: "Shop the Green Labs Small Bud Deli Drop" },
      popup: { id: "labor-day-deals-2026-09-05", enabled: true, frequency: "daily", delay: 5000, type: "image", image: "assets/img/promotions/weekend-highlights.svg", video: "", poster: "", alt: "Green Labs Labor Day deals through Monday at 9 PM", href: "#deals", ariaLabel: "View all Green Labs Labor Day deals", tabText: "LABOR DAY DEALS" }
    },
    firstFriday: {
      enabled: true,
      banner: { headline: "🎪 FIRST FRIDAY · SEPTEMBER 4", products: "4–8 PM · ART · MUSIC · GAMES", offer: "DEALS · DRINKS · VENDORS" },
      hero: { image: "assets/img/promotions/first-friday-hero-sept.jpg", position: "center", href: "/firstfriday/", ariaLabel: "First Friday at Green Labs, September 4 from 4 to 8 PM" },
      popup: { id: "first-friday-deals-2026-09-04", enabled: true, frequency: "interval", repeatDelay: 3 * 24 * 60 * 60 * 1000, delay: 7000, type: "image", image: "assets/img/promotions/first-friday-deals-popup-sept-2026.png", video: "", poster: "assets/img/promotions/first-friday-deals-popup-sept-2026.png", alt: "First Friday deals at Green Labs for September 4", href: "/firstfriday/", ariaLabel: "View Green Labs First Friday deals and event details", tabText: "FIRST FRIDAY DEALS · SEP 4" }
    },
    keepItDutchTuesday: {
      enabled: true,
      banner: { headline: "🌿 KEEP IT DUTCH TUESDAY", products: "10% OFF CORE & PREMIUM TIER FLOWER", offer: "TODAY ONLY" },
      hero: { image: "assets/img/promotions/keep-it-dutch-tuesday-hero.jpg", position: "center", href: "#deli", ariaLabel: "Shop Keep It Dutch Tuesday" },
      popup: { id: "keep-it-dutch-tuesday", enabled: true, frequency: "daily", delay: 10000, type: "image", image: "assets/img/promotions/keep-it-dutch-tuesday-popup.jpg", video: "", poster: "assets/img/promotions/keep-it-dutch-tuesday.jpg", alt: "Keep It Dutch Tuesday promotion", href: "#deli", ariaLabel: "Shop Dutch Deli flower" }
    },
    batchWednesday: {
      enabled: true,
      banner: { headline: "🟣 BATCH WEDNESDAY", products: "25% OFF BATCH PRODUCTS", offer: "TODAY ONLY" },
      hero: { image: "assets/img/promotions/batch-wednesday-hero.jpg", position: "center", href: "#deals", ariaLabel: "Shop Batch Wednesday" },
      popup: { id: "batch-wednesday", enabled: true, frequency: "daily", delay: 10000, type: "image", image: "assets/img/promotions/batch-wednesday-popup.jpg", video: "", poster: "assets/img/promotions/batch-wednesday-popup.jpg", alt: "Batch Wednesday promotion", href: "#deals", ariaLabel: "View Batch Wednesday deals" }
    },
    thirstyThursday: {
      enabled: true,
      banner: { headline: "🥤 THIRSTY THURSDAY", products: "20% OFF INFUSED BEVERAGES & SYRUPS", offer: "TODAY ONLY" },
      hero: { image: "assets/img/promotions/thirsty-thursday-hero.jpg", position: "center", href: "#deals", ariaLabel: "Shop Thirsty Thursday" },
      popup: { id: "thirsty-thursday", enabled: true, frequency: "daily", delay: 10000, type: "image", image: "assets/img/promotions/thirsty-thursday-popup.jpg", video: "", poster: "", alt: "Thirsty Thursday: 20% off infused beverages and syrups", href: "#deals", ariaLabel: "View Thirsty Thursday beverage and syrup deals" }
    }
  };

  const CAMPAIGN_WINDOWS = { firstFriday: { start: "2026-08-31", end: "2026-09-04" } };
  const WEEKLY_SCHEDULE = { 2: "keepItDutchTuesday", 3: "batchWednesday", 4: "thirstyThursday", 5: "weekendHighlights", 6: "weekendHighlights", 0: "weekendHighlights" };

  const dateParts = () => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    return Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  };
  const dateKey = () => { const p = dateParts(); return `${p.year}-${p.month}-${p.day}`; };
  const weekday = () => ({ Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 })[dateParts().weekday];
  const activeName = () => {
    if (MANUAL_CAMPAIGN && PROMOTIONS[MANUAL_CAMPAIGN]?.enabled) return MANUAL_CAMPAIGN;
    const today = dateKey();
    const parts = dateParts();
    const localTime = `${parts.hour || "00"}:${parts.minute || "00"}`;
    if (today >= "2026-09-05" && (today < "2026-09-07" || (today === "2026-09-07" && localTime < "21:00"))) return "weekendHighlights";
    const windowName = Object.keys(CAMPAIGN_WINDOWS).find(name => PROMOTIONS[name]?.enabled && today >= CAMPAIGN_WINDOWS[name].start && today <= CAMPAIGN_WINDOWS[name].end);
    if (windowName) return windowName;
    const scheduled = WEEKLY_SCHEDULE[weekday()];
    return PROMOTIONS[scheduled]?.enabled ? scheduled : "default";
  };

  const getStored = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const setStored = (key, value) => { try { localStorage.setItem(key, value); } catch {} };

  function updateBanner(banner) {
    if (!banner) return;
    ["headline","products","offer"].forEach(part => document.querySelectorAll(`[data-promo-banner-part="${part}"]`).forEach(el => { el.textContent = banner[part] || ""; }));
  }

  function updateHero(hero) {
    if (!hero) return;
    const link = document.getElementById("promoHeroLink");
    const image = document.getElementById("promoHeroImage");
    if (link) {
      link.href = hero.href || "#deals";
      link.setAttribute("aria-label", hero.ariaLabel || "View Green Labs promotion");
      link.removeAttribute("data-open-deals");
      link.removeAttribute("data-open-shop");
      if (hero.href === "#deals") link.setAttribute("data-open-deals", "");
      if (hero.shop) link.setAttribute("data-open-shop", hero.shop);
      let cta = link.querySelector(".promo-hero-shop-cta");
      if (hero.cta) {
        if (!cta) { cta = document.createElement("span"); cta.className = "promo-hero-shop-cta"; link.appendChild(cta); }
        cta.textContent = hero.cta;
        Object.assign(cta.style, { position:"absolute", left:"50%", bottom:"18px", transform:"translateX(-50%)", zIndex:"4", padding:"12px 19px", borderRadius:"999px", background:"#0b7d5a", color:"#fff", fontWeight:"900", fontSize:"clamp(.72rem,2.8vw,.9rem)", letterSpacing:".07em", boxShadow:"0 10px 28px rgba(0,0,0,.35)", whiteSpace:"nowrap", pointerEvents:"none" });
      } else if (cta) cta.remove();
    }
    if (image) {
      image.style.backgroundImage = `url("${hero.image}")`;
      image.style.backgroundPosition = hero.position || "center";
      image.style.backgroundSize = hero.size || "cover";
      image.style.backgroundRepeat = "no-repeat";
      if (hero.size === "contain") image.style.backgroundColor = "#070907";
      image.setAttribute("aria-label", hero.ariaLabel || "Green Labs featured promotion");
    }
  }

  function updatePopup(popup) {
    if (!popup) return;
    const link = document.getElementById("weeklyPromoLink"), image = document.getElementById("weeklyPromoImage"), video = document.getElementById("weeklyPromoVideo"), label = document.getElementById("weeklyPromoTabLabel");
    if (!link || !image || !video) return;
    if (label) label.textContent = popup.tabText || "SEE TODAY'S SPECIAL";
    const destination = popup.href || "#deals";
    link.href = destination;
    link.setAttribute("aria-label", popup.ariaLabel || "View Green Labs promotion");
    destination === "#deals" ? link.setAttribute("data-open-deals", "") : link.removeAttribute("data-open-deals");
    if (popup.type === "video" && popup.video) {
      image.hidden = true; video.hidden = false; video.src = popup.video; video.poster = popup.poster || ""; video.load(); video.play().catch(() => {});
    } else {
      video.pause(); video.hidden = true; video.removeAttribute("src"); video.load(); image.hidden = false; image.src = popup.image || ""; image.alt = popup.alt || "";
    }
  }

  const storageKey = (popup,name) => `greenLabsWeeklyPromo_${popup.id || name}_${popup.frequency === "daily" ? dateKey() : "campaign"}`;
  const shouldExpand = (popup,key) => { const stored = Number(getStored(key) || 0); if (!stored) return true; return popup.frequency === "interval" && Date.now() - stored >= (Number.isFinite(popup.repeatDelay) ? popup.repeatDelay : 259200000); };
  function closePopup() { const w=document.getElementById("weeklyPromoPopup"), v=document.getElementById("weeklyPromoVideo"); if(!w)return; w.classList.remove("is-open"); w.classList.add("is-collapsed"); w.querySelector(".weekly-promo__tab")?.setAttribute("aria-expanded","false"); if(v&&!v.hidden)v.pause(); }
  function expandPopup() { const w=document.getElementById("weeklyPromoPopup"); if(!w)return; w.hidden=false; w.classList.add("is-open"); w.classList.remove("is-collapsed"); w.querySelector(".weekly-promo__tab")?.setAttribute("aria-expanded","true"); }
  function initPopupControls() { const w=document.getElementById("weeklyPromoPopup"), link=document.getElementById("weeklyPromoLink"); if(!w)return; w.querySelector(".weekly-promo__tab")?.addEventListener("click",()=>w.classList.contains("is-open")?closePopup():expandPopup()); w.querySelectorAll("[data-close-weekly-promo]").forEach(el=>el.addEventListener("click",closePopup)); link?.addEventListener("click",closePopup); document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!w.hidden)closePopup();}); }
  function showPopup(popup,name) { if(!popup||popup.enabled===false)return; const w=document.getElementById("weeklyPromoPopup"); if(!w)return; const key=storageKey(popup,name); w.hidden=false; w.classList.add("is-collapsed"); if(!shouldExpand(popup,key))return; setTimeout(()=>{expandPopup(); setStored(key,String(Date.now())); const v=document.getElementById("weeklyPromoVideo"); if(v&&!v.hidden)v.play().catch(()=>{});}, Number.isFinite(popup.delay)&&popup.delay>=0?popup.delay:10000); }

  function init() {
    const name=activeName(), campaign=PROMOTIONS[name]||PROMOTIONS.default;
    window.GreenLabsPromotion={name,campaign,promotions:PROMOTIONS};
    updateBanner(campaign.banner); updateHero(campaign.hero); updatePopup(campaign.popup); initPopupControls(); showPopup(campaign.popup,name);
    console.info(`[Green Labs Promotions] Active campaign: ${name}`);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded",init,{once:true}) : init();
})();