(() => {
  "use strict";

  const TIME_ZONE = "America/Detroit";
  const MANUAL_CAMPAIGN = null;

  const BRAND_HERO = {
    image: "assets/img/promotions/chalkboard-hero.jpg",
    position: "center",
    size: "cover",
    href: "#deli",
    ariaLabel: "Explore the Green Labs Deli"
  };

  const PROMOTIONS = {
    default: {
      enabled: true,
      banner: {
        headline: "GREEN LABS DELI",
        products: "FRESH FLOWER · CURATED MICHIGAN BRANDS",
        offer: "MICHIGAN STARTS HERE"
      },
      popup: { enabled: false }
    },
    keepItDutchTuesday: {
      enabled: true,
      banner: {
        headline: "🌿 KEEP IT DUTCH TUESDAY",
        products: "10% OFF CORE & PREMIUM TIER FLOWER",
        offer: "TODAY ONLY"
      },
      popup: { enabled: false }
    },
    batchWednesday: {
      enabled: true,
      banner: {
        headline: "🟣 BATCH WEDNESDAY",
        products: "25% OFF BATCH PRODUCTS",
        offer: "TODAY ONLY"
      },
      popup: {
        id: "batch-wednesday",
        enabled: true,
        frequency: "daily",
        delay: 10000,
        type: "image",
        image: "assets/img/promotions/batch-wednesday-popup.jpg",
        video: "",
        poster: "assets/img/promotions/batch-wednesday-popup.jpg",
        alt: "Batch Wednesday promotion",
        href: "#deals",
        ariaLabel: "View Batch Wednesday deals"
      }
    },
    thirstyThursday: {
      enabled: true,
      banner: {
        headline: "🥤 THIRSTY THURSDAY",
        products: "20% OFF INFUSED BEVERAGES & SYRUPS",
        offer: "TODAY ONLY"
      },
      popup: {
        id: "thirsty-thursday",
        enabled: true,
        frequency: "daily",
        delay: 10000,
        type: "image",
        image: "assets/img/promotions/thirsty-thursday-popup.jpg",
        video: "",
        poster: "",
        alt: "Thirsty Thursday: 20% off infused beverages and syrups",
        href: "#deals",
        ariaLabel: "View Thirsty Thursday beverage and syrup deals"
      }
    }
  };

  const WEEKLY_SCHEDULE = {
    2: "keepItDutchTuesday",
    3: "batchWednesday",
    4: "thirstyThursday"
  };

  const dateParts = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    return Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  };

  const weekday = () => ({
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  })[dateParts().weekday];

  const activeName = () => {
    if (MANUAL_CAMPAIGN && PROMOTIONS[MANUAL_CAMPAIGN]?.enabled) return MANUAL_CAMPAIGN;
    const scheduled = WEEKLY_SCHEDULE[weekday()];
    return PROMOTIONS[scheduled]?.enabled ? scheduled : "default";
  };

  const getStored = key => {
    try { return localStorage.getItem(key); } catch { return null; }
  };

  const setStored = (key, value) => {
    try { localStorage.setItem(key, value); } catch {}
  };

  function updateBanner(banner) {
    if (!banner) return;
    ["headline", "products", "offer"].forEach(part => {
      document.querySelectorAll(`[data-promo-banner-part="${part}"]`).forEach(el => {
        el.textContent = banner[part] || "";
      });
    });
  }

  function updateBrandHeroCopy() {
    const badge = document.querySelector(".hero__badge-text");
    if (badge) badge.textContent = "CRAFT CANNABIS & CURATED BRANDS";

    const title = document.querySelector(".hero__title");
    if (title) title.textContent = "MICHIGAN STARTS HERE.";

    const award = document.querySelector(".hero__copy .badge--award");
    if (award) award.style.display = "none";

    const sub = document.querySelector(".hero__sub");
    if (sub) {
      sub.textContent = "Independent. Award-winning. Different by design. Green Labs brings together exceptional cannabis, Michigan’s most sought-after brands, and a team that actually knows the products we sell.";
    }

    const buttons = document.querySelectorAll(".hero__cta .hero__btn");
    if (buttons[0]) {
      buttons[0].textContent = "Shop Online";
      buttons[0].setAttribute("data-open-shop", "rec");
      buttons[0].removeAttribute("data-scroll");
      buttons[0].onclick = null;
    }
    if (buttons[1]) {
      buttons[1].textContent = "Explore Deli";
      buttons[1].removeAttribute("data-open-shop");
      buttons[1].setAttribute("data-scroll", "#deli");
      buttons[1].onclick = () => document.querySelector("#deli")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (buttons[2]) buttons[2].textContent = "Today's Deals";

    document.querySelectorAll(".deli-card__label").forEach(label => {
      const name = label.querySelector("h3");
      if (name?.textContent.trim().toLowerCase() === "lemon wookie") {
        const genetics = label.querySelector(".deli-card__genetics");
        if (genetics) genetics.textContent = "Hybrid • 25.19% THC • Award Winner";
      }
    });
  }

  function updateHero(hero) {
    const link = document.getElementById("promoHeroLink");
    const image = document.getElementById("promoHeroImage");
    if (link) {
      link.href = hero.href || "#deli";
      link.setAttribute("aria-label", hero.ariaLabel || "Explore the Green Labs Deli");
      link.removeAttribute("data-open-deals");
      link.removeAttribute("data-open-shop");
      link.querySelector(".promo-hero-shop-cta")?.remove();
    }
    if (image) {
      image.style.backgroundImage = `url("${hero.image}")`;
      image.style.backgroundPosition = hero.position || "center";
      image.style.backgroundSize = hero.size || "cover";
      image.style.backgroundRepeat = "no-repeat";
      image.setAttribute("aria-label", hero.ariaLabel || "Green Labs Deli hero");
    }
  }

  function updatePopup(popup) {
    const wrap = document.getElementById("weeklyPromoPopup");
    if (!popup || popup.enabled === false) {
      if (wrap) wrap.hidden = true;
      return;
    }

    const link = document.getElementById("weeklyPromoLink");
    const image = document.getElementById("weeklyPromoImage");
    const video = document.getElementById("weeklyPromoVideo");
    const label = document.getElementById("weeklyPromoTabLabel");
    if (!link || !image || !video) return;

    if (label) label.textContent = popup.tabText || "SEE TODAY'S SPECIAL";
    const destination = popup.href || "#deals";
    link.href = destination;
    link.setAttribute("aria-label", popup.ariaLabel || "View Green Labs promotion");
    destination === "#deals" ? link.setAttribute("data-open-deals", "") : link.removeAttribute("data-open-deals");

    if (popup.type === "video" && popup.video) {
      image.hidden = true;
      video.hidden = false;
      video.src = popup.video;
      video.poster = popup.poster || "";
      video.load();
      video.play().catch(() => {});
    } else {
      video.pause();
      video.hidden = true;
      video.removeAttribute("src");
      video.load();
      image.hidden = false;
      image.src = popup.image || "";
      image.alt = popup.alt || "";
    }
  }

  const dateKey = () => {
    const p = dateParts();
    return `${p.year}-${p.month}-${p.day}`;
  };

  const storageKey = (popup, name) => `greenLabsWeeklyPromo_${popup.id || name}_${popup.frequency === "daily" ? dateKey() : "campaign"}`;

  function closePopup() {
    const wrap = document.getElementById("weeklyPromoPopup");
    const video = document.getElementById("weeklyPromoVideo");
    if (!wrap) return;
    wrap.classList.remove("is-open");
    wrap.classList.add("is-collapsed");
    wrap.querySelector(".weekly-promo__tab")?.setAttribute("aria-expanded", "false");
    if (video && !video.hidden) video.pause();
  }

  function expandPopup() {
    const wrap = document.getElementById("weeklyPromoPopup");
    if (!wrap) return;
    wrap.hidden = false;
    wrap.classList.add("is-open");
    wrap.classList.remove("is-collapsed");
    wrap.querySelector(".weekly-promo__tab")?.setAttribute("aria-expanded", "true");
  }

  function initPopupControls() {
    const wrap = document.getElementById("weeklyPromoPopup");
    const link = document.getElementById("weeklyPromoLink");
    if (!wrap) return;
    wrap.querySelector(".weekly-promo__tab")?.addEventListener("click", () => wrap.classList.contains("is-open") ? closePopup() : expandPopup());
    wrap.querySelectorAll("[data-close-weekly-promo]").forEach(el => el.addEventListener("click", closePopup));
    link?.addEventListener("click", closePopup);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !wrap.hidden) closePopup();
    });
  }

  function showPopup(popup, name) {
    if (!popup || popup.enabled === false) return;
    const wrap = document.getElementById("weeklyPromoPopup");
    if (!wrap) return;
    const key = storageKey(popup, name);
    if (getStored(key)) {
      wrap.hidden = false;
      wrap.classList.add("is-collapsed");
      return;
    }
    setTimeout(() => {
      expandPopup();
      setStored(key, String(Date.now()));
    }, Number.isFinite(popup.delay) && popup.delay >= 0 ? popup.delay : 10000);
  }

  function init() {
    const name = activeName();
    const campaign = PROMOTIONS[name] || PROMOTIONS.default;
    window.GreenLabsPromotion = { name, campaign, promotions: PROMOTIONS };
    updateBrandHeroCopy();
    updateBanner(campaign.banner);
    updateHero(BRAND_HERO);
    updatePopup(campaign.popup);
    initPopupControls();
    showPopup(campaign.popup, name);
    console.info(`[Green Labs Promotions] Active campaign: ${name}`);
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init, { once: true })
    : init();
})();