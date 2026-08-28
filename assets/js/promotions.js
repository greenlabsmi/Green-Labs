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
  "firstFriday"

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

  "interval"
  Auto-expands again after repeatDelay milliseconds.
  The small promotion tab remains available between expansions.

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
        headline: "🌿 FRESH DELI DROP", 
        products: "AWARD-WINNING LEMON WOOKIE AVAILABLE NOW", 
        offer: "NEW SPACE HIPPY BUBBLE HASH INFUSED BUDS"
      },

      hero: {
        image: "assets/img/deli-drop-aug-hero.jpg",
        position: "center",
        href: "#deli",
        ariaLabel: "Shop the latest Green Labs deli flower drop"
      },

      popup: {
        id: "hyman-stylus-july-2026",
        enabled: false,
        frequency: "campaign",
        delay: 10000,

        type: "image",
        image: "assets/img/highlights/hyman-stylus-hl.jpg",

        video: "",
        poster: "assets/img/highlights/hyman-stylus-hl.jpg",

        alt: "Hyman live resin stylus promotion",
        href: "#deli",
        ariaLabel: "View the Hyman live resin stylus promotion"
      }
    },

    weekendHighlights: {
      enabled: true,
      banner: {
        headline: "✨ WEEKEND HIGHLIGHTS",
        products: "$15 SHAKE OZ · $20 GRIP OZ · 9/$20 DOPE ROPES + MIDWEST",
        offer: "SEE ALL WEEKEND DEALS"
      },
      hero: {
        image: "assets/img/deli-drop-aug-hero.jpg",
        position: "center",
        href: "#deli",
        ariaLabel: "Shop Green Labs deli flower"
      },
      popup: {
        id: "weekend-highlights-2026-08",
        enabled: true,
        frequency: "daily",
        delay: 5000,
        type: "image",
        image: "assets/img/promotions/weekend-highlights.svg",
        video: "",
        poster: "",
        alt: "Green Labs weekend highlight deals",
        href: "#deals",
        ariaLabel: "View all Green Labs weekend deals",
        tabText: "WEEKEND DEALS"
      }
    },

    firstFriday: {
      enabled: true,
      banner: {
        headline: "🎪 FIRST FRIDAY · SEPTEMBER 4",
        products: "4–8 PM · ART · MUSIC · GAMES",
        offer: "DEALS · DRINKS · VENDORS"
      },
      hero: {
        image: "assets/img/first-friday/first-friday-september-homepage-hero.jpg",
        position: "center",
        href: "/firstfriday/",
        ariaLabel: "First Friday at Green Labs, September 4 from 4 to 8 PM"
      },
      popup: {
        id: "first-friday-2026-09-04",
        enabled: true,
        frequency: "interval",
        repeatDelay: 3 * 24 * 60 * 60 * 1000,
        delay: 7000,
        type: "image",
        image: "assets/img/first-friday/first-friday-september-sidecard.jpg",
        video: "",
        poster: "assets/img/first-friday/first-friday-september-sidecard.jpg",
        alt: "Green Labs First Friday, September 4 from 4 to 8 PM, featuring art, music, games, deals, drinks, vendors, Decent Folk and City Soda",
        href: "/firstfriday/",
        ariaLabel: "View Green Labs First Friday event details",
        tabText: "FIRST FRIDAY · SEP 4"
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
        image: "assets/img/promotions/keep-it-dutch-tuesday-hero.jpg",
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
        image: "assets/img/promotions/keep-it-dutch-tuesday-popup.jpg",

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
        image: "assets/img/promotions/batch-wednesday-hero.jpg",
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

      hero: {
        image: "assets/img/promotions/thirsty-thursday-hero.jpg",
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
  image: "assets/img/promotions/thirsty-thursday-popup.jpg",

  video: "",
  poster: "",

  alt: "Thirsty Thursday: 20% off infused beverages and syrups",
  href: "#deals",
  ariaLabel: "View Thirsty Thursday beverage and syrup deals"
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

  const CAMPAIGN_WINDOWS = {
    firstFriday: {
      start: "2026-09-04",
      end: "2026-09-04"
    }
  };

  const WEEKLY_SCHEDULE = {
    2: "keepItDutchTuesday",
    3: "batchWednesday",
    4: "thirstyThursday",
    5: "weekendHighlights",
    6: "weekendHighlights",
    0: "weekendHighlights"
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

    const today = getDetroitDateKey();
    const campaignWindowName = Object.keys(CAMPAIGN_WINDOWS)
      .find((campaignName) => {
        const window = CAMPAIGN_WINDOWS[campaignName];
        const campaign = PROMOTIONS[campaignName];

        return (
          campaign &&
          campaign.enabled &&
          today >= window.start &&
          today <= window.end
        );
      });

    if (campaignWindowName) {
      return campaignWindowName;
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
    const tabLabel = document.getElementById("weeklyPromoTabLabel");

    if (!link || !image || !video) return;

    if (tabLabel) {
      tabLabel.textContent = popup.tabText || "SEE TODAY'S SPECIAL";
    }

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

  function shouldAutoExpandPopup(popup, storageKey) {
    const storedValue = Number(getStoredValue(storageKey) || 0);

    if (!storedValue) return true;

    if (popup.frequency === "interval") {
      const repeatDelay = Number.isFinite(popup.repeatDelay)
        ? popup.repeatDelay
        : 3 * 24 * 60 * 60 * 1000;

      return Date.now() - storedValue >= repeatDelay;
    }

    return false;
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

    wrapper.classList.remove("is-open");
    wrapper.classList.add("is-collapsed");
    wrapper.querySelector(".weekly-promo__tab")
      ?.setAttribute("aria-expanded", "false");

    if (video && !video.hidden) {
      video.pause();
    }

  }

  function expandPromotionPopup() {
    const wrapper = document.getElementById("weeklyPromoPopup");

    if (!wrapper) return;

    wrapper.hidden = false;
    wrapper.classList.add("is-open");
    wrapper.classList.remove("is-collapsed");
    wrapper.querySelector(".weekly-promo__tab")
      ?.setAttribute("aria-expanded", "true");
  }

  function initializePopupControls() {
    const wrapper = document.getElementById("weeklyPromoPopup");
    const link = document.getElementById("weeklyPromoLink");
    const tab = wrapper?.querySelector(".weekly-promo__tab");

    if (!wrapper) return;

    if (tab) {
      tab.addEventListener("click", () => {
        if (wrapper.classList.contains("is-open")) {
          closePromotionPopup();
        } else {
          expandPromotionPopup();
        }
      });
    }

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

    wrapper.hidden = false;
    wrapper.classList.add("is-collapsed");

    if (!shouldAutoExpandPopup(popup, storageKey)) return;

    function actuallyOpenPopup() {
      expandPromotionPopup();

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
