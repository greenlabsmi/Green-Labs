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

    // Remove the old standalone Weekend Offers card so the promos live with the vendor area.
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

    // Remove the old placeholder deal announcement inside the True North card.
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
        <p>Big offers, live music, local vendors and a reason to make the trip to Luna Pier.</p>
      </div>

      <div class="ff-deal-hub__layout">
        <div class="ff-deal-hub__art">
          <img
            src="assets/img/promotions/first-friday-deals-sept-2026.png"
            alt="First Friday deal calendar featuring Franklin Fields BOGO, True North and Pearls buy 2 get 1 free, Gelato and KSHN Doghouse 50% off, and ROVE and Batch 30% off."
            loading="lazy"
            decoding="async"
          >
        </div>

        <div class="ff-deal-hub__copy">
          <span class="ff-deal-hub__eyebrow">THIS FRIDAY · 4–8 PM</span>
          <h4>Come for the deals. Stay for First Friday.</h4>
          <p>Deals run Friday unless otherwise noted. ROVE continues through Sept. 7 and Pearls joins us from 4–6 PM.</p>
          <div class="ff-deal-hub__highlights" aria-label="Featured First Friday offers">
            <div><strong>50% OFF</strong><span>Gelato + KSHN / Doghouse</span></div>
            <div><strong>BOGO</strong><span>Franklin Fields</span></div>
            <div><strong>30% OFF</strong><span>ROVE + Batch</span></div>
          </div>
          <a class="ff-deal-hub__cta" href="/shop/">SHOP GREEN LABS</a>
          <a class="ff-deal-hub__details" href="/firstfriday/">See full First Friday details →</a>
        </div>
      </div>
    `;

    const buttonRow = [...trueNorthCard.querySelectorAll("a")].find((a) => a.textContent.trim() === "Instagram")?.parentElement;
    if (buttonRow && buttonRow.parentElement === trueNorthCard) trueNorthCard.insertBefore(hub, buttonRow);
    else trueNorthCard.appendChild(hub);

    const style = document.createElement("style");
    style.textContent = `
      .ff-first-friday-deal-hub{margin:1.35rem 0 1.1rem;padding:clamp(1rem,2.2vw,1.45rem);border:1px solid rgba(15,77,58,.16);border-radius:22px;background:#f7f3e9;box-shadow:0 18px 42px rgba(15,39,30,.08);overflow:hidden}
      .ff-deal-hub__head{margin:0 0 1rem}.ff-deal-hub__head>span{display:block;color:#b47817;font:900 .68rem/1.25 Inter,sans-serif;letter-spacing:.13em;text-transform:uppercase}.ff-deal-hub__head h3{margin:.3rem 0 .35rem!important;color:#0d513e!important;font:900 clamp(1.55rem,5vw,2.25rem)/.98 Inter,sans-serif;letter-spacing:-.035em}.ff-deal-hub__head p{max-width:720px;margin:0!important;color:#5f6964!important;font-size:.82rem!important;line-height:1.5!important}
      .ff-deal-hub__layout{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(250px,.85fr);gap:clamp(1rem,2.4vw,1.6rem);align-items:center}.ff-deal-hub__art{min-width:0}.ff-deal-hub__art img{display:block;width:100%;height:auto;border-radius:16px;box-shadow:0 12px 28px rgba(16,42,32,.12)}
      .ff-deal-hub__copy{padding:.25rem .1rem}.ff-deal-hub__eyebrow{display:block;color:#b47817;font:900 .68rem/1.2 Inter,sans-serif;letter-spacing:.11em}.ff-deal-hub__copy h4{margin:.45rem 0 .55rem!important;color:#123f32!important;font:900 clamp(1.3rem,3vw,1.85rem)/1.05 Inter,sans-serif;letter-spacing:-.025em}.ff-deal-hub__copy>p{margin:0 0 .95rem!important;color:#59645f!important;font-size:.78rem!important;line-height:1.55!important}
      .ff-deal-hub__highlights{display:grid;gap:.52rem;margin:.85rem 0 1rem}.ff-deal-hub__highlights div{padding:.7rem .78rem;border-left:4px solid #d29a2e;background:rgba(255,255,255,.62);border-radius:0 10px 10px 0}.ff-deal-hub__highlights strong,.ff-deal-hub__highlights span{display:block}.ff-deal-hub__highlights strong{color:#0b5b43;font:900 1rem/1.05 Inter,sans-serif}.ff-deal-hub__highlights span{margin-top:.16rem;color:#606b66;font:700 .66rem/1.25 Inter,sans-serif}
      .ff-deal-hub__cta{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:.68rem 1rem;border-radius:999px;background:#0b5b43;color:#fff!important;font:900 .7rem/1 Inter,sans-serif;letter-spacing:.08em;text-decoration:none!important}.ff-deal-hub__cta:hover{background:#084b38}.ff-deal-hub__details{display:block;width:max-content;margin-top:.72rem;color:#8f620e!important;font:800 .68rem/1.3 Inter,sans-serif;text-decoration:none!important}.ff-deal-hub__details:hover{text-decoration:underline!important}
      @media(max-width:760px){.ff-deal-hub__layout{grid-template-columns:1fr}.ff-deal-hub__copy{padding:.1rem 0 0}.ff-deal-hub__highlights{grid-template-columns:repeat(3,1fr);gap:.4rem}.ff-deal-hub__highlights div{padding:.58rem .55rem;border-left:0;border-top:3px solid #d29a2e;border-radius:8px}.ff-deal-hub__highlights strong{font-size:.86rem}.ff-deal-hub__highlights span{font-size:.58rem}}
      @media(max-width:460px){.ff-first-friday-deal-hub{padding:.8rem;border-radius:16px}.ff-deal-hub__art img{border-radius:12px}.ff-deal-hub__highlights{grid-template-columns:1fr}.ff-deal-hub__highlights div{display:flex;align-items:baseline;gap:.45rem}.ff-deal-hub__highlights span{margin-top:0}.ff-deal-hub__cta{width:100%}.ff-deal-hub__details{margin-left:auto;margin-right:auto}}
    `;
    document.head.appendChild(style);
  });
})();
