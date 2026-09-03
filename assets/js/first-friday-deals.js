(() => {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  };

  onReady(() => {
    if (document.getElementById("ff-first-friday-deal-hub")) return;

    const textEls = [...document.querySelectorAll("h1,h2,h3,h4,h5,p,strong,span,a")];
    const exact = (text) => textEls.find((el) => el.textContent.trim() === text);

    const weekendHeading = exact("Weekend Offers");
    if (weekendHeading) {
      let node = weekendHeading;
      let candidate = null;
      for (let i = 0; i < 6 && node.parentElement; i++) {
        node = node.parentElement;
        const txt = node.textContent.replace(/\s+/g, " ").trim();
        if (txt.includes("Weekend Offers") && txt.includes("Rove is 30% off") && txt.length < 500) candidate = node;
      }
      if (candidate) candidate.remove();
    }

    const trueNorthHeading = exact("True North");
    if (!trueNorthHeading) return;

    let trueNorthCard = trueNorthHeading;
    let bestCard = null;
    for (let i = 0; i < 7 && trueNorthCard.parentElement; i++) {
      trueNorthCard = trueNorthCard.parentElement;
      const txt = trueNorthCard.textContent.replace(/\s+/g, " ").trim();
      if (txt.includes("True North") && txt.includes("Visit True North") && txt.length < 1800) bestCard = trueNorthCard;
    }
    trueNorthCard = bestCard || trueNorthHeading.parentElement;

    const soon = [...trueNorthCard.querySelectorAll("*")].find((el) => el.textContent.trim() === "Deal announced soon");
    if (soon) {
      let node = soon;
      let placeholder = soon;
      for (let i = 0; i < 4 && node.parentElement && node.parentElement !== trueNorthCard; i++) {
        node = node.parentElement;
        const txt = node.textContent.replace(/\s+/g, " ").trim();
        if (txt.includes("FIRST FRIDAY DEAL") && txt.includes("Deal announced soon") && txt.length < 220) placeholder = node;
      }
      placeholder.remove();
    }

    const hub = document.createElement("section");
    hub.id = "ff-first-friday-deal-hub";
    hub.className = "ff-first-friday-deal-hub";
    hub.setAttribute("aria-labelledby", "ff-deals-title");
    hub.innerHTML = `
      <div class="ff-deal-hub__head">
        <span>FRIDAY · SEPTEMBER 4</span>
        <h3 id="ff-deals-title">FIRST FRIDAY DEALS</h3>
        <p>Big offers, live music, in-store vendors and a reason to make the trip to Luna Pier.</p>
      </div>

      <div class="ff-deal-hub__art">
        <img
          id="ff-deals-art"
          src="/assets/img/promotions/first-friday-deals-sept-2026.png"
          alt="First Friday deal lineup at Green Labs."
          loading="eager"
          decoding="async"
        >
      </div>

      <div class="ff-deal-hub__copy">
        <span class="ff-deal-hub__eyebrow">THIS FRIDAY · 4–8 PM</span>
        <h4>Come for the deals. Stay for First Friday.</h4>
        <p>Deals run Friday unless otherwise noted. Meet True North + Batch in store from 4–7 PM, Pearls from 4–6 PM, and ROVE continues through Sept. 7.</p>

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

        <a class="ff-deal-hub__cta" href="https://greenlabsmi.com/#shop-rec">SHOP GREEN LABS</a>
      </div>
    `;

    const buttonRow = [...trueNorthCard.querySelectorAll("a")].find((a) => a.textContent.trim() === "Instagram")?.parentElement;
    if (buttonRow && buttonRow.parentElement === trueNorthCard) trueNorthCard.insertBefore(hub, buttonRow);
    else trueNorthCard.appendChild(hub);

    const art = hub.querySelector("#ff-deals-art");
    const artWrap = hub.querySelector(".ff-deal-hub__art");
    const rawFallback = "https://raw.githubusercontent.com/greenlabsmi/Green-Labs/main/assets/img/promotions/first-friday-deals-sept-2026.png";
    if (art) {
      let triedFallback = false;
      art.addEventListener("error", () => {
        if (!triedFallback) {
          triedFallback = true;
          art.src = rawFallback;
          return;
        }
        if (artWrap) artWrap.remove();
      });
    }

    const style = document.createElement("style");
    style.textContent = `
      .ff-first-friday-deal-hub{margin:1.35rem 0 1.1rem;padding:clamp(1rem,2.2vw,1.45rem);border:1px solid rgba(15,77,58,.16);border-radius:22px;background:#f7f3e9;box-shadow:0 18px 42px rgba(15,39,30,.08);overflow:hidden}
      .ff-deal-hub__head{margin:0 0 1rem}.ff-deal-hub__head>span{display:block;color:#b47817;font:900 .68rem/1.25 Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase}.ff-deal-hub__head h3{margin:.3rem 0 .35rem!important;color:#0d513e!important;font:900 clamp(1.55rem,5vw,2.25rem)/.98 Inter,sans-serif;letter-spacing:-.035em}.ff-deal-hub__head p{max-width:720px;margin:0!important;color:#5f6964!important;font-size:.82rem!important;line-height:1.5!important}
      .ff-deal-hub__art{margin:0 auto 1.15rem;min-width:0;max-width:820px}.ff-deal-hub__art img{display:block;width:100%;height:auto;max-height:560px;object-fit:contain;border-radius:16px;box-shadow:0 12px 28px rgba(16,42,32,.12)}
      .ff-deal-hub__copy{padding:.1rem 0}.ff-deal-hub__eyebrow{display:block;color:#b47817;font:900 .68rem/1.2 Inter,sans-serif;letter-spacing:.11em}.ff-deal-hub__copy h4{margin:.45rem 0 .55rem!important;color:#123f32!important;font:900 clamp(1.3rem,3vw,1.85rem)/1.05 Inter,sans-serif;letter-spacing:-.025em}.ff-deal-hub__copy>p{margin:0 0 .95rem!important;color:#59645f!important;font-size:.78rem!important;line-height:1.55!important}
      .ff-deal-hub__all-deals{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.55rem;margin:.9rem 0 1.05rem}.ff-deal-hub__all-deals>div{padding:.72rem .78rem;border-top:3px solid #d29a2e;background:rgba(255,255,255,.68);border-radius:10px}.ff-deal-hub__all-deals strong,.ff-deal-hub__all-deals span,.ff-deal-hub__all-deals small{display:block}.ff-deal-hub__all-deals strong{color:#0b5b43;font:900 .96rem/1.05 Inter,sans-serif}.ff-deal-hub__all-deals span{margin-top:.18rem;color:#606b66;font:750 .68rem/1.25 Inter,sans-serif}.ff-deal-hub__all-deals small{margin-top:.12rem;color:#9b6b18;font:800 .58rem/1.2 Inter,sans-serif}
      .ff-deal-hub__cta{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.7rem 1.1rem;border-radius:999px;background:#0b5b43;color:#fff!important;font:900 .7rem/1 Inter,sans-serif;letter-spacing:.08em;text-decoration:none!important}.ff-deal-hub__cta:hover{background:#084b38}
      @media(min-width:900px){.ff-first-friday-deal-hub{max-width:1040px;margin-left:auto;margin-right:auto}.ff-deal-hub__art{max-width:760px}.ff-deal-hub__all-deals{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:520px){.ff-first-friday-deal-hub{padding:.8rem;border-radius:16px}.ff-deal-hub__art{max-width:none}.ff-deal-hub__art img{border-radius:12px;max-height:none}.ff-deal-hub__all-deals{grid-template-columns:1fr}.ff-deal-hub__all-deals>div{padding:.66rem .7rem}.ff-deal-hub__cta{width:100%}}
    `;
    document.head.appendChild(style);
  });
})();
