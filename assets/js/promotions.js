(() => {
  "use strict";

  /*
  ============================================================
  GREEN LABS PROMOTION ENGINE

  Controls:
  1. Top scrolling announcement banner
  2. Homepage hero
  3. Reusable promotional popup

  Automatic scheduling uses America/Detroit time.
  ============================================================
  */

  const PROMOTION_TIME_ZONE = "America/Detroit";

  /*
  ============================================================
  MANUAL TESTING

  Keep this set to null for normal automatic scheduling.

  To preview a campaign, temporarily replace null with:
  "default"
  "keepItDutchTuesday"
  "batchWednesday"
  "thirstyThursday"

  Example:
  const MANUAL_CAMPAIGN = "batchWednesday";
  ============================================================
  */

  const MANUAL_CAMPAIGN = null;

  /*
  ============================================================
  CAMPAIGNS

  frequency options:

  "campaign"
  Shows once for that specific popup ID.
  Best for rotating product launches and limited campaigns.

  "daily"
  Shows once per calendar day in Detroit time.
  Best for recurring Tuesday, Wednesday, and Thursday promotions.

  Popup type options:

  type: "image"
  Uses the image property.

  type: "video"
  Uses the video and poster properties.
  ============================================================
  */

  const PROMOTIONS = {
    default: {
      enabled: true,

      banner: {
        headline: "🏆 AWARD WINNING GENETICS",
        products: "MR. CLEAN & SPACE HIPPY AVAILABLE NOW",
        offer: "LILAC DIESEL & LEMON WOOKIE COMING SOON"
      },

      hero: {
        image: "assets/img/lp-weekend-hero.jpg",
        position: "center",
        href: "#deals",
        ariaLabel: "Shop Green Labs Summer Vibes promotions"
      },

      popup: {
        id: "hyman-stylus-july-2026",
        enabled: true,
        frequency: "campaign",
        delay: 10000,

        type: "image",
        image: "assets/img/highlights/hyman-stylus-hl.jpg",

        video: "",
        poster: "assets/img/highlights/hyman-stylus-hl.jpg",

        alt: "Hyman live resin stylus promotion",
        href: "#deals",
        ariaLabel: "View the Hyman live resin stylus promotion"
      }
    },

    keepItDutchTuesday: {
      enabled: true,

      banner: {
        headline: "🌿 KEEP IT DUTCH TUESDAY",
        products: "10% OFF CORE & PREMIUM TIER FLOWER",
        offer: "TODAY ONLY"
      },

      hero: {
        image: "assets/img/promotions/keep-it-dutch-tuesday.jpg",
        position: "center",
        href: "#deli",
        ariaLabel: "Shop Keep It Dutch Tuesday"
      },

      popup: {
        id: "keep-it-dutch-tuesday",
        enabled: true,
        frequency: "daily",
        delay: 10000,

        type: "image",
        image: "assets/img/promotions/keep-it-dutch-tuesday.jpg",

        video: "",
        poster: "assets/img/promotions/keep-it-dutch-tuesday.jpg",

        alt: "Keep It Dutch Tuesday promotion",
        href: "#deli",
        ariaLabel: "Shop Dutch Deli flower"
      }
    },

    batchWednesday: {
      enabled: true,

      banner: {
        headline: "🟣 BATCH WEDNESDAY",
        products: "25% OFF BATCH PRODUCTS",
        offer: "TODAY ONLY"
      },

      hero: {
        image: "assets/img/promotions/batch-wednesday.jpg",
        position: "center",
        href: "#deals",
        ariaLabel: "Shop Batch Wednesday"
      },

      popup: {
        id: "batch-wednesday",
        enabled: true,
        frequency: "daily",
        delay: 10000,

        type: "image",
        image: "assets/img/promotions/batch-wednesday.jpg",

        video: "",
        poster: "assets/img/promotions/batch-wednesday.jpg",

        alt: "Batch Wednesday promotion",
        href: "#deals",
        ariaLabel: "View Batch Wednesday deals"
      }
    },

    thirstyThursday: {
      enabled: true,

      banner: {
        headline: "🥤 THIRSTY THURSDAY",
        products: "SAVE ON PARTICIPATING THC DRINKS",
        offer: "TODAY ONLY"
      },

      hero: {
        image: "assets/img/promotions/thirsty-thursday.jpg",
        position: "center",
        href: "#deals",
        ariaLabel: "Shop Thirsty Thursday"
      },

      popup: {
        id: "thirsty-thursday",
        enabled: true,
        frequency: "daily",
        delay: 10000,

        type: "image",
        image: "assets/img/promotions/thirsty-thursday.jpg",

        video: "",
        poster: "assets/img/promotions/thirsty-thursday.jpg",

        alt: "Thirsty Thursday THC drink promotion",
        href: "#deals",
        ariaLabel: "View Thirsty Thursday deals"
      }
    }
  };

  /*
  ============================================================
  WEEKLY SCHEDULE

  JavaScript weekday numbers:

  Sunday = 0
  Monday = 1
  Tuesday = 2
  Wednesday = 3
  Thursday = 4
  Friday = 5
  Saturday = 6

  Days not listed here automatically use the default campaign.
  ============================================================
  */

  const WEEKLY_SCHEDULE = {
    2: "keepItDutchTuesday",
    3: "batchWednesday",
    4: "thirstyThursday"
  };

  /*
  ============================================================
  DATE AND SCHEDULE HELPERS
  ============================================================
  */

  function getDetroitWeekday() {
    const weekdayName = new Intl.DateTimeFormat("en-US", {
      timeZone: PROMOTION_TIME_ZONE,
      weekday: "long"
    }).format(new Date());

    const weekdayNumbers = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };

    return weekdayNumbers[weekdayName];
  }

  function getDetroitDateKey() {
    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: PROMOTION_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());

    const dateValues = {};

    dateParts.forEach((part) => {
      if (part.type !== "literal") {
        dateValues[part.type] = part.value;
      }
    });

    return `${dateValues.year}-${dateValues.month}-${dateValues.day}`;
  }

  function getActiveCampaignName() {
    if (
      MANUAL_CAMPAIGN &&
      PROMOTIONS[MANUAL_CAMPAIGN] &&
      PROMOTIONS[MANUAL_CAMPAIGN].enabled
    ) {
      return MANUAL_CAMPAIGN;
    }

    const weekday = getDetroitWeekday();
    const scheduledCampaignName = WEEKLY_SCHEDULE[weekday];
    const scheduledCampaign = PROMOTIONS[scheduledCampaignName];

    if (scheduledCampaign && scheduledCampaign.enabled) {
      return scheduledCampaignName;
    }

    return "default";
  }

  /*
  ============================================================
  LOCAL STORAGE HELPERS

  These prevent a localStorage browser error from breaking
  the rest of the promotion engine.
  ============================================================
  */

  function getStoredValue(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn(
        "[Green Labs Promotions] Could not read popup storage.",
        error
      );

      return null;
    }
  }

  function setStoredValue(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn(
        "[Green Labs Promotions] Could not save popup storage.",
        error
      );
    }
  }

  /*
  ============================================================
  ANNOUNCEMENT BANNER
  ============================================================
  */

  function updateBanner(banner) {
    if (!banner) return;

    document
      .querySelectorAll('[data-promo-banner-part="headline"]')
      .forEach((element) => {
        element.textContent = banner.headline || "";
      });

    document
      .querySelectorAll('[data-promo-banner-part="products"]')
      .forEach((element) => {
        element.textContent = banner.products || "";
      });

    document
      .querySelectorAll('[data-promo-banner-part="offer"]')
      .forEach((element) => {
        element.textContent = banner.offer || "";
      });
  }

  /*
  ============================================================
  HERO
  ============================================================
  */

  function updateHero(hero) {
    if (!hero) return;

    const heroLink = document.getElementById("promoHeroLink");
    const heroImage = document.getElementById("promoHeroImage");

    if (heroLink) {
      heroLink.setAttribute("href", hero.href || "#deals");
      heroLink.setAttribute(
        "aria-label",
        hero.ariaLabel || "View Green Labs promotion"
      );

      /*
      Your existing site uses data-open-deals to open the
      deals area. Preserve it only when linking to #deals.
      */

      if (hero.href === "#deals") {
        heroLink.setAttribute("data-open-deals", "");
      } else {
        heroLink.removeAttribute("data-open-deals");
      }
    }

    if (heroImage) {
      heroImage.style.backgroundImage = `url("${hero.image}")`;
      heroImage.style.backgroundPosition =
        hero.position || "center";

      heroImage.setAttribute(
        "aria-label",
        hero.ariaLabel || "Green Labs featured promotion"
      );
    }
  }

  /*
  ============================================================
  POPUP CONTENT
  ============================================================
  */

  function updatePopup(popup) {
    if (!popup) return;

    const link = document.getElementById("weeklyPromoLink");
    const image = document.getElementById("weeklyPromoImage");
    const video = document.getElementById("weeklyPromoVideo");

    if (!link || !image || !video) return;

    const destination = popup.href || "#deals";

    link.setAttribute("href", destination);
    link.setAttribute(
      "aria-label",
      popup.ariaLabel || "View Green Labs promotion"
    );

    /*
    Match the site's existing deal-link behavior.
    */

    if (destination === "#deals") {
      link.setAttribute("data-open-deals", "");
    } else {
      link.removeAttribute("data-open-deals");
    }

    if (popup.type === "video" && popup.video) {
      image.hidden = true;

      video.hidden = false;
      video.src = popup.video;
      video.poster = popup.poster || "";
      video.load();

      /*
      Some browsers block autoplay even when muted.
      The empty catch prevents that from causing an error.
      */

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

  /*
  ============================================================
  POPUP STORAGE KEY

  Default product campaigns:
  greenLabsWeeklyPromo_hyman-stylus-july-2026_campaign

  Recurring daily promotions:
  greenLabsWeeklyPromo_batch-wednesday_2026-07-22
  ============================================================
  */

  function getPopupStorageKey(popup, campaignName) {
    const popupId = popup.id || campaignName;

    const frequencyKey =
      popup.frequency === "daily"
        ? getDetroitDateKey()
        : "campaign";

    return `greenLabsWeeklyPromo_${popupId}_${frequencyKey}`;
  }

  /*
  ============================================================
  POPUP OPENING AND CLOSING
  ============================================================
  */

  function closePromotionPopup() {
    const wrapper = document.getElementById("weeklyPromoPopup");
    const video = document.getElementById("weeklyPromoVideo");

    if (!wrapper) return;

    wrapper.hidden = true;

    if (video && !video.hidden) {
      video.pause();
    }

    if (document.body.dataset.popupOpen === "weekly") {
      delete document.body.dataset.popupOpen;
    }

    document.body.style.overflow = "";
  }

  function initializePopupControls() {
    const wrapper = document.getElementById("weeklyPromoPopup");
    const link = document.getElementById("weeklyPromoLink");

    if (!wrapper) return;

    wrapper
      .querySelectorAll("[data-close-weekly-promo]")
      .forEach((element) => {
        element.addEventListener(
          "click",
          closePromotionPopup
        );
      });

    /*
    Close the overlay when the customer clicks the promotion.
    The link or deals-opening behavior will still continue.
    */

    if (link) {
      link.addEventListener("click", closePromotionPopup);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !wrapper.hidden) {
        closePromotionPopup();
      }
    });
  }

  function showPromotionPopup(popup, campaignName) {
    if (!popup || popup.enabled === false) return;

    const wrapper = document.getElementById("weeklyPromoPopup");

    if (!wrapper) return;

    const storageKey = getPopupStorageKey(
      popup,
      campaignName
    );

    /*
    Do not show this popup again if it has already appeared
    during its configured frequency period.
    */

    if (getStoredValue(storageKey)) {
      return;
    }

    function actuallyOpenPopup() {
      /*
      Wait while the First Friday popup, gift popup, or
      another coordinated popup is open.
      */

      if (document.body.dataset.popupOpen) {
        window.setTimeout(actuallyOpenPopup, 3000);
        return;
      }

      wrapper.hidden = false;
      document.body.dataset.popupOpen = "weekly";
      document.body.style.overflow = "hidden";

      /*
      Save when the popup actually appears—not when its timer
      begins—so blocked or queued popups are not counted early.
      */

      setStoredValue(storageKey, String(Date.now()));

      const video =
        document.getElementById("weeklyPromoVideo");

      if (video && !video.hidden) {
        video.play().catch(() => {});
      }
    }

    const popupDelay =
      Number.isFinite(popup.delay) && popup.delay >= 0
        ? popup.delay
        : 10000;

    window.setTimeout(actuallyOpenPopup, popupDelay);
  }

  /*
  ============================================================
  INITIALIZE ENGINE
  ============================================================
  */

  function initializePromotionEngine() {
    const campaignName = getActiveCampaignName();

    const campaign =
      PROMOTIONS[campaignName] || PROMOTIONS.default;

    /*
    Make the active campaign visible in the browser console
    and available for future site features.
    */

    window.GreenLabsPromotion = {
      name: campaignName,
      campaign,
      promotions: PROMOTIONS
    };

    updateBanner(campaign.banner);
    updateHero(campaign.hero);
    updatePopup(campaign.popup);
    initializePopupControls();
    showPromotionPopup(campaign.popup, campaignName);

    console.info(
      `[Green Labs Promotions] Active campaign: ${campaignName}`
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializePromotionEngine,
      { once: true }
    );
  } else {
    initializePromotionEngine();
  }
})();
