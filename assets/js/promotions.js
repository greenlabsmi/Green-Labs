(() => {
  "use strict";

  /*
  ============================================================
  GREEN LABS PROMOTION ENGINE
  Controls:
  1. Top scrolling banner
  2. Homepage hero
  3. Promotional popup — connected in the next step

  Weekly schedule uses America/Detroit time.
  ============================================================
  */

  const PROMOTION_TIME_ZONE = "America/Detroit";

  /*
  Set this to null for the normal automatic schedule.

  Later, you can temporarily force a campaign by changing it to:
  "default"
  "keepItDutchTuesday"
  "batchWednesday"
  "thirstyThursday"
  */
  const MANUAL_CAMPAIGN = "null";

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
        enabled: true,
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
      /*
      Leave disabled until its artwork is added.
      We will change this to true when the image is ready.
      */
      enabled: false,

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
        enabled: true,
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
      /*
      Leave disabled until its artwork is added.
      */
      enabled: false,

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
        enabled: true,
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
      /*
      Leave disabled until its artwork is added.
      */
      enabled: false,

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
        enabled: true,
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
  JavaScript weekday numbers:
  Sunday = 0
  Monday = 1
  Tuesday = 2
  Wednesday = 3
  Thursday = 4
  Friday = 5
  Saturday = 6
  */
  const WEEKLY_SCHEDULE = {
    2: "keepItDutchTuesday",
    3: "batchWednesday",
    4: "thirstyThursday"
  };

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

    if (scheduledCampaign?.enabled) {
      return scheduledCampaignName;
    }

    return "default";
  }

  function updateBanner(banner) {
    if (!banner) return;

    document
      .querySelectorAll('[data-promo-banner-part="headline"]')
      .forEach((element) => {
        element.textContent = banner.headline;
      });

    document
      .querySelectorAll('[data-promo-banner-part="products"]')
      .forEach((element) => {
        element.textContent = banner.products;
      });

    document
      .querySelectorAll('[data-promo-banner-part="offer"]')
      .forEach((element) => {
        element.textContent = banner.offer;
      });
  }

  function updateHero(hero) {
    if (!hero) return;

    const heroLink = document.getElementById("promoHeroLink");
    const heroImage = document.getElementById("promoHeroImage");

    if (heroLink) {
      heroLink.setAttribute("href", hero.href);
      heroLink.setAttribute("aria-label", hero.ariaLabel);

      /*
      Keep data-open-deals only when the hero points to deals.
      Remove it when linking directly to another page section.
      */
      if (hero.href === "#deals") {
        heroLink.setAttribute("data-open-deals", "");
      } else {
        heroLink.removeAttribute("data-open-deals");
      }
    }

    if (heroImage) {
      heroImage.style.backgroundImage = `url("${hero.image}")`;
      heroImage.style.backgroundPosition = hero.position || "center";
      heroImage.setAttribute("aria-label", hero.ariaLabel);
    }
  }

  function initializePromotionEngine() {
    const campaignName = getActiveCampaignName();
    const campaign = PROMOTIONS[campaignName] || PROMOTIONS.default;

    updateBanner(campaign.banner);
    updateHero(campaign.hero);

    /*
    Helpful while building.
    Open the browser console to see which campaign was selected.
    */
    console.info(
      `[Green Labs Promotions] Active campaign: ${campaignName}`
    );

    /*
    Save the active campaign so the popup system can use it
    in the next step.
    */
    window.GreenLabsPromotion = {
      name: campaignName,
      campaign,
      promotions: PROMOTIONS
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializePromotionEngine
    );
  } else {
    initializePromotionEngine();
  }
})();
