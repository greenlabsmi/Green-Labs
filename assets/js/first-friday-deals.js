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

    const hub = document.createElement("div");
    hub.id = "ff-first-friday-deal-hub";
    hub.className = "ff-first-friday-deal-hub";
    hub.innerHTML = `
      <div class="ff-deal-hub__head">
        <span>FIRST FRIDAY DEALS · SEPTEMBER 4</span>
        <strong>Big deals. One night.</strong>
      </div>
      <div class="ff-deal-hub__grid">
        <div class="ff-deal-chip ff-deal-chip--feature"><span>TRUE NORTH</span><strong>BUY 2, GET 1 FREE</strong></div>
        <div class="ff-deal-chip"><span>GELATO</span><strong>50% OFF</strong></div>
        <div class="ff-deal-chip"><span>KSHN / DOGHOUSE</span><strong>50% OFF</strong></div>
        <div class="ff-deal-chip"><span>BATCH</span><strong>30% OFF</strong></div>
        <div class="ff-deal-chip"><span>ROVE</span><strong>30% OFF</strong><small>Sept. 4–7</small></div>
        <div class="ff-deal-chip"><span>FRANKLIN FIELDS</span><strong>BOGO</strong></div>
        <div class="ff-deal-chip"><span>PEARLS</span><strong>BUY 2, GET 1 FREE</strong><small>Vendor 4–6 PM</small></div>
        <div class="ff-deal-chip ff-deal-chip--dtg"><span>DUTCH TOUCH GENETICS</span><strong>LEMON WOOKIE · $110/OZ</strong></div>
      </div>
      <p class="ff-deal-hub__note">More First Friday offers may be added as vendor promos are finalized.</p>`;

    const buttonRow = [...trueNorthCard.querySelectorAll("a")].find((a) => a.textContent.trim() === "Instagram")?.parentElement;
    if (buttonRow && buttonRow.parentElement === trueNorthCard) trueNorthCard.insertBefore(hub, buttonRow);
    else trueNorthCard.appendChild(hub);

    const style = document.createElement("style");
    style.textContent = `
      .ff-first-friday-deal-hub{margin:1.1rem 0 1rem;padding:1rem;border:1px solid rgba(220,149,30,.42);border-radius:18px;background:linear-gradient(145deg,#fffaf0,#f4fbf7);box-shadow:0 12px 30px rgba(15,39,30,.07)}
      .ff-deal-hub__head{margin-bottom:.8rem}.ff-deal-hub__head span{display:block;color:#9b650d;font:900 .68rem/1.25 Inter,sans-serif;letter-spacing:.11em;text-transform:uppercase}.ff-deal-hub__head strong{display:block;margin-top:.28rem;color:#202522;font:900 clamp(1.25rem,5vw,1.65rem)/1.05 Inter,sans-serif}
      .ff-deal-hub__grid{display:grid;grid-template-columns:1fr 1fr;gap:.55rem}.ff-deal-chip{min-height:78px;padding:.72rem;border:1px solid rgba(11,125,90,.14);border-radius:13px;background:#fff}.ff-deal-chip span,.ff-deal-chip strong,.ff-deal-chip small{display:block}.ff-deal-chip span{color:#64716b;font:900 .58rem/1.2 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase}.ff-deal-chip strong{margin-top:.25rem;color:#075b43;font:900 .94rem/1.1 Inter,sans-serif}.ff-deal-chip small{margin-top:.25rem;color:#78817c;font:700 .62rem/1.2 Inter,sans-serif}.ff-deal-chip--feature{border-color:#dc951e;background:#fff7e8}.ff-deal-chip--feature strong{color:#9a5f00}.ff-deal-chip--dtg{grid-column:1/-1;border-color:#d78a21;background:#0a0907}.ff-deal-chip--dtg span{color:#dca143}.ff-deal-chip--dtg strong{color:#fff0d0}.ff-deal-hub__note{margin:.8rem 0 0!important;color:#78817c!important;font-size:.68rem!important;line-height:1.4!important}
      @media(max-width:520px){.ff-deal-hub__grid{grid-template-columns:1fr 1fr}.ff-deal-chip{min-height:72px;padding:.65rem}.ff-deal-chip strong{font-size:.86rem}}
    `;
    document.head.appendChild(style);
  });
})();
