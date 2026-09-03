(() => {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  };

  onReady(() => {
    const textEls = [...document.querySelectorAll("h1,h2,h3,h4,h5,p,strong,span,a")];
    const exact = (text) => textEls.find((el) => el.textContent.trim() === text);

    // Remove only the standalone arcade bridge that gets appended to the cornhole/Jenga block.
    document.getElementById("ff-arcade-bridge")?.remove();

    // Remove the old small Weekend Offers card so the dedicated deals artwork is the single deal presentation.
    const weekendHeading = exact("Weekend Offers");
    if (weekendHeading) {
      let node = weekendHeading;
      let candidate = null;
      for (let i = 0; i < 6 && node.parentElement; i += 1) {
        node = node.parentElement;
        const txt = node.textContent.replace(/\s+/g, " ").trim();
        if (txt.includes("Weekend Offers") && txt.includes("Rove is 30% off") && txt.length < 500) candidate = node;
      }
      candidate?.remove();
    }

    const cardGrid = document.querySelector("#event-details .ff-card-grid");
    const wookieCard = document.querySelector("#event-details .ff-lemon-wookie");
    const trueNorthCard = document.querySelector("#event-details .ff-feature-card--vendor");
    const musicCard = document.querySelector("#event-details .ff-feature-card--music");

    // Keep True North, but remove the stale placeholder deal box.
    if (trueNorthCard) {
      const soon = [...trueNorthCard.querySelectorAll("*")].find((el) => el.textContent.trim() === "Deal announced soon");
      if (soon) {
        let node = soon;
        let placeholder = soon;
        for (let i = 0; i < 4 && node.parentElement && node.parentElement !== trueNorthCard; i += 1) {
          node = node.parentElement;
          const txt = node.textContent.replace(/\s+/g, " ").trim();
          if (txt.includes("FIRST FRIDAY DEAL") && txt.includes("Deal announced soon") && txt.length < 220) placeholder = node;
        }
        placeholder.remove();
      }
    }

    // Give Decent Folk + City Soda the same visual language as the email without rebuilding the section.
    if (musicCard && !musicCard.querySelector(".ff-music-feature__art")) {
      const existingChildren = [...musicCard.children];
      const art = document.createElement("div");
      art.className = "ff-music-feature__art";
      art.innerHTML = `
        <img
          src="../assets/img/first-friday/decentfolk-citysoda.jpg"
          alt="First Friday featuring Decent Folk live and City Soda"
          loading="eager"
          decoding="async"
        >
      `;

      const copy = document.createElement("div");
      copy.className = "ff-music-feature__copy";
      existingChildren.forEach((child) => copy.appendChild(child));
      musicCard.append(art, copy);

      const eyebrow = copy.querySelector(".ff-feature-card__eyebrow");
      if (eyebrow) eyebrow.textContent = "LIVE MUSIC + LOCAL FLAVOR";
      const lead = copy.querySelector(".ff-feature-card__lead");
      if (lead) lead.textContent = "Catch Decent Folk live outside Green Labs from 4–8 PM, with City Soda joining us for First Friday.";
    }

    // Dedicated deals artwork: full-width in the existing grid, before Lemon Wookie, no duplicate HTML deal list.
    if (cardGrid && wookieCard && !document.getElementById("ff-first-friday-deal-hub")) {
      const hub = document.createElement("section");
      hub.id = "ff-first-friday-deal-hub";
      hub.className = "ff-first-friday-deal-hub";
      hub.setAttribute("aria-labelledby", "ff-deals-title");
      hub.innerHTML = `
        <div class="ff-deal-hub__head">
          <span>FRIDAY · SEPTEMBER 4</span>
          <h3 id="ff-deals-title">FIRST FRIDAY DEALS</h3>
          <p>The full First Friday lineup, all in one place.</p>
        </div>
        <div class="ff-deal-hub__art">
          <img
            id="ff-deals-art"
            src="/assets/img/promotions/first-friday-deals-sept-2026.png"
            alt="First Friday deal lineup at Green Labs"
            loading="eager"
            decoding="async"
          >
        </div>
        <a class="ff-deal-hub__cta" href="https://greenlabsmi.com/#shop-rec">SHOP GREEN LABS</a>
      `;
      cardGrid.insertBefore(hub, wookieCard);
    }

    const style = document.createElement("style");
    style.id = "ff-targeted-cleanup-styles";
    style.textContent = `
      /* Targeted First Friday cleanup only */
      .ff-first-friday-deal-hub{
        grid-column:1/-1;
        margin:1.1rem 0 .35rem;
        padding:clamp(1rem,2vw,1.35rem);
        border:1px solid rgba(15,77,58,.16);
        border-radius:22px;
        background:#f7f3e9;
        box-shadow:0 18px 42px rgba(15,39,30,.08);
        overflow:hidden;
        text-align:center;
      }
      .ff-deal-hub__head{max-width:720px;margin:0 auto 1rem;text-align:left}
      .ff-deal-hub__head>span{display:block;color:#b47817;font:900 .68rem/1.25 Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase}
      .ff-deal-hub__head h3{margin:.3rem 0 .35rem!important;color:#0d513e!important;font:900 clamp(1.55rem,5vw,2.25rem)/.98 Inter,sans-serif;letter-spacing:-.035em}
      .ff-deal-hub__head p{margin:0!important;color:#5f6964!important;font-size:.82rem!important;line-height:1.5!important}
      .ff-deal-hub__art{width:100%;margin:0 auto 1rem;display:flex;justify-content:center}
      .ff-deal-hub__art img{display:block;width:min(100%,760px);height:auto;border-radius:16px;box-shadow:0 12px 28px rgba(16,42,32,.12)}
      .ff-deal-hub__cta{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.7rem 1.1rem;border-radius:999px;background:#0b5b43;color:#fff!important;font:900 .7rem/1 Inter,sans-serif;letter-spacing:.08em;text-decoration:none!important}
      .ff-deal-hub__cta:hover{background:#084b38}

      .ff-feature-card--music.ff-card{grid-column:span 2;padding:0!important;overflow:hidden}
      .ff-music-feature__art{background:#111}
      .ff-music-feature__art img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}
      .ff-music-feature__copy{padding:24px 28px 28px}

      /* Keep the DTG spotlight, but make the desktop version shorter and stop cropping the flower. */
      @media(min-width:760px){
        .ff-dtg-comeback__hero{min-height:390px!important;padding:1.55rem 1.75rem!important}
        .ff-dtg-comeback__lion{width:76px!important;height:76px!important}
        .ff-dtg-comeback__copy{max-width:52%!important}
        .ff-dtg-comeback h3{font-size:clamp(2.8rem,6vw,4rem)!important;line-height:.8!important}
        .ff-dtg-comeback__copy p{font-size:.84rem!important;line-height:1.45!important;margin:.6rem 0 .8rem!important}
        .ff-dtg-price{padding:.65rem .85rem!important}
        .ff-dtg-price strong{font-size:1.9rem!important}
        .ff-dtg-comeback__bud{right:1%!important;bottom:0!important;width:48%!important;height:92%!important;mask-image:linear-gradient(to left,#000 74%,transparent)!important;-webkit-mask-image:linear-gradient(to left,#000 74%,transparent)!important}
        .ff-dtg-comeback__bud img{object-fit:contain!important;object-position:center bottom!important;background:transparent!important}
        .ff-dtg-comeback__awards{padding:.8rem 1rem!important;gap:.45rem!important}
        .ff-dtg-award{padding:.55rem .65rem!important}
        .ff-dtg-medal{font-size:1.35rem!important}
      }

      @media(max-width:860px){
        .ff-feature-card--music.ff-card{grid-column:1/-1}
      }
      @media(max-width:520px){
        .ff-first-friday-deal-hub{padding:.8rem;border-radius:16px}
        .ff-deal-hub__head{text-align:left}
        .ff-deal-hub__art img{width:100%;border-radius:12px}
        .ff-deal-hub__cta{width:100%}
        .ff-music-feature__copy{padding:22px 24px 24px}
      }
    `;
    document.getElementById(style.id)?.remove();
    document.head.appendChild(style);
  });
})();
