(() => {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  };

  onReady(() => {
    const textEls = [...document.querySelectorAll("h1,h2,h3,h4,h5,p,strong,span,a")];
    const exact = (text) => textEls.find((el) => el.textContent.trim() === text);

    // Remove only the standalone arcade bridge appended to the cornhole/Jenga block.
    document.getElementById("ff-arcade-bridge")?.remove();

    // Remove the old small Weekend Offers card so the dedicated deals section is the single deal presentation.
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

    // Turn the original True North card into a compact City Soda companion card.
    if (trueNorthCard) {
      trueNorthCard.classList.add("ff-feature-card--city-soda");
      trueNorthCard.innerHTML = `
        <div class="ff-feature-card__eyebrow">LOCAL FLAVOR</div>
        <h3>City Soda</h3>
        <p class="ff-feature-card__lead">City Soda is joining us for First Friday with drinks alongside the live music.</p>
        <div class="ff-feature-card__links">
          <a href="https://www.instagram.com/drinkcitysoda?igsi=MTNkN3dscG0xYjN1Zg==" target="_blank" rel="noopener">Instagram</a>
        </div>
      `;
    }

    // Keep the combined Decent Folk + City Soda artwork, with a compact Decent Folk info card below it.
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
    }
    if (musicCard) {
      const eyebrow = musicCard.querySelector(".ff-feature-card__eyebrow");
      if (eyebrow) eyebrow.textContent = "LIVE MUSIC";
      const lead = musicCard.querySelector(".ff-feature-card__lead");
      if (lead) lead.textContent = "Catch Decent Folk live outside Green Labs from 4–8 PM.";
    }

    // Dedicated deals artwork before Lemon Wookie, followed by the complete written deal list.
    if (cardGrid && wookieCard && !document.getElementById("ff-first-friday-deal-hub")) {
      const hub = document.createElement("section");
      hub.id = "ff-first-friday-deal-hub";
      hub.className = "ff-first-friday-deal-hub";
      hub.setAttribute("aria-labelledby", "ff-deals-title");
      hub.innerHTML = `
        <div class="ff-deal-hub__head">
          <span>FRIDAY · SEPTEMBER 4</span>
          <h3 id="ff-deals-title">FIRST FRIDAY DEALS</h3>
          <p>Deals run Friday unless otherwise noted. ROVE continues through Sept. 7.</p>
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
        <div class="ff-deal-hub__copy">
          <span class="ff-deal-hub__eyebrow">THIS FRIDAY · 4–8 PM</span>
          <h4>Come for the deals. Stay for First Friday.</h4>
          <div class="ff-deal-hub__all-deals" aria-label="All First Friday offers">
            <div><strong>BOGO</strong><span>Franklin Fields</span></div>
            <div><strong>BUY 2 GET 1 FREE</strong><span>True North <small>Vendor 4–7 PM</small></span></div>
            <div><strong>BUY 2 GET 1 FREE</strong><span>Pearls <small>Vendor 4–6 PM</small></span></div>
            <div><strong>50% OFF</strong><span>Gelato</span></div>
            <div><strong>50% OFF</strong><span>KSHN / Doghouse</span></div>
            <div><strong>50% OFF</strong><span>DTG Space Hippy Infused Flower</span></div>
            <div><strong>50% OFF</strong><span>DTG RSO Bomb Pop Gummies</span></div>
            <div><strong>BOGO</strong><span>GRIP Live Resin Disposables</span></div>
            <div><strong>30% OFF</strong><span>ROVE <small>Sept. 4–7</small></span></div>
            <div><strong>30% OFF</strong><span>Batch <small>Vendor 4–7 PM</small></span></div>
            <div><strong>FREE PRIZES</strong><span>Challenge the staff in games</span></div>
          </div>
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
      }
      .ff-deal-hub__head{max-width:760px;margin:0 auto 1rem;text-align:left}
      .ff-deal-hub__head>span,.ff-deal-hub__eyebrow{display:block;color:#b47817;font:900 .68rem/1.25 Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase}
      .ff-deal-hub__head h3{margin:.3rem 0 .35rem!important;color:#0d513e!important;font:900 clamp(1.55rem,5vw,2.25rem)/.98 Inter,sans-serif;letter-spacing:-.035em}
      .ff-deal-hub__head p{margin:0!important;color:#5f6964!important;font-size:.82rem!important;line-height:1.5!important}
      .ff-deal-hub__art{width:100%;margin:0 auto 1rem;display:flex;justify-content:center}
      .ff-deal-hub__art img{display:block;width:min(100%,760px);height:auto;border-radius:16px;box-shadow:0 12px 28px rgba(16,42,32,.12)}
      .ff-deal-hub__copy{max-width:760px;margin:0 auto}
      .ff-deal-hub__copy h4{margin:.45rem 0 .8rem!important;color:#123f32!important;font:900 clamp(1.3rem,3vw,1.85rem)/1.05 Inter,sans-serif;letter-spacing:-.025em}
      .ff-deal-hub__all-deals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin:.9rem 0 1.05rem}
      .ff-deal-hub__all-deals>div{padding:.72rem .78rem;border-top:3px solid #d29a2e;background:rgba(255,255,255,.72);border-radius:10px}
      .ff-deal-hub__all-deals strong,.ff-deal-hub__all-deals span,.ff-deal-hub__all-deals small{display:block}
      .ff-deal-hub__all-deals strong{color:#0b5b43;font:900 .96rem/1.05 Inter,sans-serif}
      .ff-deal-hub__all-deals span{margin-top:.18rem;color:#606b66;font:750 .7rem/1.25 Inter,sans-serif}
      .ff-deal-hub__all-deals small{margin-top:.13rem;color:#9b6b18;font:800 .6rem/1.2 Inter,sans-serif}
      .ff-deal-hub__cta{display:flex;width:min(100%,760px);margin:0 auto;align-items:center;justify-content:center;min-height:44px;padding:.7rem 1.1rem;border-radius:999px;background:#0b5b43;color:#fff!important;font:900 .7rem/1 Inter,sans-serif;letter-spacing:.08em;text-decoration:none!important}
      .ff-deal-hub__cta:hover{background:#084b38}

      /* Shared art + two compact info cards below it. */
      .ff-feature-card--music.ff-card{grid-column:1/-1;padding:0!important;overflow:hidden;display:grid;grid-template-columns:1fr 1fr}
      .ff-music-feature__art{grid-column:1/-1;background:#111}
      .ff-music-feature__art img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}
      .ff-music-feature__copy{padding:20px 22px 22px;border-right:1px solid var(--ff-border)}
      .ff-feature-card--city-soda{grid-column:auto!important;margin-top:0!important;padding:20px 22px 22px!important}
      .ff-feature-card--music h3,.ff-feature-card--city-soda h3{font-size:1.05rem!important}
      .ff-feature-card--music .ff-feature-card__lead,.ff-feature-card--city-soda .ff-feature-card__lead{font-size:.82rem!important;line-height:1.45!important}
      .ff-feature-card--music .ff-feature-card__links,.ff-feature-card--city-soda .ff-feature-card__links{gap:6px;margin-top:14px}
      .ff-feature-card--music .ff-feature-card__links a,.ff-feature-card--city-soda .ff-feature-card__links a{min-height:34px;padding:0 10px;font-size:.68rem}

      /* Put City Soda visually beside the Decent Folk copy by pulling it into the same row. */
      .ff-card-grid{position:relative}
      .ff-feature-card--music + .ff-feature-card--city-soda{margin-top:0}

      /* Keep the DTG spotlight, but make desktop shorter and stop cropping the flower. */
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
        .ff-card-grid{grid-template-columns:1fr 1fr!important}
        .ff-feature-card--music.ff-card{grid-column:1/-1}
        .ff-feature-card--city-soda{grid-column:2!important}
        .ff-feature-card--music{grid-column:1/-1!important}
      }
      @media(max-width:520px){
        .ff-first-friday-deal-hub{padding:.8rem;border-radius:16px}
        .ff-deal-hub__art img{width:100%;border-radius:12px}
        .ff-deal-hub__all-deals{grid-template-columns:1fr}
        .ff-deal-hub__all-deals>div{padding:.66rem .7rem}
        .ff-feature-card--music.ff-card{grid-template-columns:1fr 1fr}
        .ff-music-feature__copy,.ff-feature-card--city-soda{padding:16px 14px 18px!important}
        .ff-feature-card--music .ff-feature-card__links a,.ff-feature-card--city-soda .ff-feature-card__links a{padding:0 8px;font-size:.62rem}
        .ff-feature-card--music .ff-feature-card__lead,.ff-feature-card--city-soda .ff-feature-card__lead{font-size:.76rem!important}
      }
    `;
    document.getElementById(style.id)?.remove();
    document.head.appendChild(style);

    // On all viewports, visually place City Soda beside the Decent Folk copy inside the same combined feature.
    if (musicCard && trueNorthCard) {
      const copy = musicCard.querySelector(".ff-music-feature__copy");
      if (copy && trueNorthCard.parentElement === cardGrid) {
        trueNorthCard.remove();
        musicCard.appendChild(trueNorthCard);
      }
    }
  });
})();