(() => {
  "use strict";

  const scrapbook = document.getElementById("first-friday-scrapbook");
  if (!scrapbook || document.getElementById("ff-recap-video")) return;

  const dtgCard = document.querySelector(".ff-lemon-wookie");
  if (dtgCard) {
    dtgCard.classList.add("ff-dtg-feature");
    dtgCard.innerHTML = `
      <div class="ff-dtg-feature__brand">
        <div class="ff-dtg-feature__eyebrow">GREEN LABS HOUSE BRAND · JOINING US</div>
        <div class="ff-dtg-feature__mark" aria-hidden="true">DTG</div>
        <h3>Dutch Touch<br>Genetics</h3>
        <p>Dutch Touch Genetics is the house brand behind some of Green Labs’ most recognizable strains. Come talk genetics, flower, and all things Dutch Touch with Dane at First Friday.</p>
        <div class="ff-dtg-feature__meet"><span>FIRST FRIDAY · SEPT 4</span><strong>Meet Dane · Keep It Dutch</strong></div>
      </div>
      <div class="ff-dtg-feature__strain">
        <div class="ff-dtg-feature__bud"><img src="../assets/img/strains/lemon-wookie-bud.jpg" alt="Lemon Wookie flower from Dutch Touch Genetics" loading="lazy" decoding="async"></div>
        <div class="ff-dtg-feature__strain-copy">
          <span class="ff-dtg-feature__label">SPOTLIGHT STRAIN</span>
          <h4>Lemon Wookie</h4>
          <div class="ff-dtg-feature__trophy-title">BEST IN GRASS · AWARD WINNER</div>
          <div class="ff-dtg-feature__awards" aria-label="Best in Grass awards for Lemon Wookie">
            <div class="ff-dtg-award ff-dtg-award--silver"><span class="ff-dtg-award__medal">🥈</span><div><strong>2nd Place</strong><small>Pre-Roll · Best in Grass</small></div></div>
            <div class="ff-dtg-award ff-dtg-award--bronze"><span class="ff-dtg-award__medal">🥉</span><div><strong>3rd Place</strong><small>Solventless Infused Pre-Roll · Best in Grass</small></div></div>
          </div>
          <div class="ff-dtg-feature__available"><span>FIND LEMON WOOKIE AT GREEN LABS</span><strong>Deli Flower · Pre-Rolls</strong></div>
        </div>
      </div>
    `;
  }

  const challenge = document.querySelector(".ff-challenge");
  if (challenge && !document.getElementById("ff-arcade-bridge")) {
    const arcade = document.createElement("section");
    arcade.id = "ff-arcade-bridge";
    arcade.className = "ff-arcade-bridge ff-reveal";
    arcade.innerHTML = `
      <div class="ff-arcade-bridge__screen">
        <span class="ff-arcade-bridge__kicker">CAN’T WAIT UNTIL FIRST FRIDAY?</span>
        <h2>Wanna play now?</h2>
        <p>The parking lot games start September 4. The Green Labs Arcade is already open.</p>
        <button class="ff-coin-start" id="ff-coin-start" type="button" aria-label="Insert coin and play the Green Labs Arcade">
          <span class="ff-coin-start__coin" aria-hidden="true">25¢</span>
          <span class="ff-coin-start__text"><small>PLAY THE ARCADE</small><strong>INSERT COIN</strong></span>
          <span class="ff-coin-start__slot" aria-hidden="true"><i></i></span>
        </button>
      </div>
    `;
    challenge.insertAdjacentElement("afterend", arcade);
  }

  const style = document.createElement("style");
  style.textContent = `
    .ff-dtg-feature{display:block!important;padding:0!important;overflow:hidden;background:linear-gradient(145deg,#071d16,#12392c 58%,#06140f)!important;color:#fff;border:1px solid #d9b86755!important;box-shadow:0 24px 65px rgba(7,29,22,.18)!important}
    .ff-dtg-feature__brand{position:relative;padding:clamp(1.5rem,6vw,2.5rem);overflow:hidden}
    .ff-dtg-feature__brand:after{content:"";position:absolute;width:220px;height:220px;right:-80px;top:-65px;border:1px solid #d9b86744;border-radius:50%;box-shadow:0 0 0 24px #d9b8670b,0 0 0 48px #d9b86708;pointer-events:none}
    .ff-dtg-feature__eyebrow,.ff-dtg-feature__label,.ff-dtg-feature__available span,.ff-dtg-feature__meet span{font-size:.68rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#d9c17c}
    .ff-dtg-feature__mark{display:inline-grid;place-items:center;width:56px;height:56px;margin:.85rem 0;border:1px solid #d9c17c88;border-radius:50%;font:900 .72rem/1 Inter,sans-serif;letter-spacing:.08em;color:#f2d98e;box-shadow:inset 0 0 20px #d9b86718}
    .ff-dtg-feature h3{position:relative;z-index:1;margin:0;font-family:"Playfair Display",serif;font-size:clamp(2.65rem,11vw,4.6rem);line-height:.84;letter-spacing:-.04em;color:#fff}
    .ff-dtg-feature__brand p{position:relative;z-index:1;max-width:36rem;margin:1.1rem 0 0;color:#dce8e2;font-size:clamp(.95rem,3.7vw,1.08rem);line-height:1.6}
    .ff-dtg-feature__meet{margin-top:1.3rem;padding:1rem;border:1px solid #d9b86744;border-radius:14px;background:#0003}
    .ff-dtg-feature__meet span,.ff-dtg-feature__meet strong{display:block}.ff-dtg-feature__meet strong{margin-top:.25rem;font-size:1rem;color:#fff}
    .ff-dtg-feature__strain{display:grid;grid-template-columns:105px minmax(0,1fr);gap:1rem;align-items:start;padding:1.2rem;background:#f6f2e8;color:#17231d}
    .ff-dtg-feature__bud{height:145px;border-radius:16px;overflow:hidden;background:#000;box-shadow:0 10px 24px #0002}.ff-dtg-feature__bud img{width:100%;height:100%;object-fit:cover}
    .ff-dtg-feature__strain-copy h4{margin:.2rem 0 .65rem;font-family:"Playfair Display",serif;font-size:1.75rem;line-height:1;color:#14251e}
    .ff-dtg-feature__label,.ff-dtg-feature__available span{color:#167055}
    .ff-dtg-feature__trophy-title{margin:.75rem 0 .5rem;font-size:.65rem;font-weight:900;letter-spacing:.1em;color:#6c5a27}
    .ff-dtg-feature__awards{display:grid;gap:.5rem}.ff-dtg-award{display:flex;align-items:center;gap:.65rem;padding:.65rem .75rem;border-radius:12px;border:1px solid #00000012;background:#fff}.ff-dtg-award__medal{font-size:1.55rem}.ff-dtg-award strong,.ff-dtg-award small{display:block}.ff-dtg-award strong{font-size:.86rem}.ff-dtg-award small{margin-top:.1rem;font-size:.7rem;line-height:1.25;color:#69716d}.ff-dtg-award--silver{box-shadow:inset 4px 0 #aeb8c1}.ff-dtg-award--bronze{box-shadow:inset 4px 0 #b8793e}
    .ff-dtg-feature__available{grid-column:1/-1;margin-top:.85rem;padding-top:.8rem;border-top:1px solid #173d3220}.ff-dtg-feature__available span,.ff-dtg-feature__available strong{display:block}.ff-dtg-feature__available strong{margin-top:.2rem;font-size:.92rem}
    .ff-arcade-bridge{position:relative;margin:clamp(2rem,6vw,4rem) auto;padding:0 1rem;max-width:1180px}.ff-arcade-bridge__screen{position:relative;overflow:hidden;padding:clamp(1.5rem,6vw,3rem);border:4px solid #151b18;border-radius:20px;background:radial-gradient(circle at 50% 10%,#32125d,#06140f 55%,#010503);color:#fff;text-align:center;box-shadow:0 0 0 4px #000,0 18px 45px #0005,inset 0 0 60px #000}.ff-arcade-bridge__screen:before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(to bottom,#fff0 0,#fff0 3px,#ffffff0c 4px);mix-blend-mode:screen}.ff-arcade-bridge__kicker{position:relative;color:#27f3a2;font:800 .68rem/1.3 Inter,sans-serif;letter-spacing:.13em}.ff-arcade-bridge h2{position:relative;margin:.6rem 0;font-family:Impact,"Arial Black",sans-serif;font-size:clamp(2.7rem,13vw,5.8rem);line-height:.88;text-transform:uppercase;text-shadow:4px 4px #7e49ff,-2px -2px #27e9ff}.ff-arcade-bridge p{position:relative;max-width:34rem;margin:.8rem auto 1.5rem;color:#c5d0ca;line-height:1.5}
    .ff-coin-start{position:relative;display:grid;grid-template-columns:54px 1fr 42px;align-items:center;gap:.7rem;width:min(100%,390px);min-height:76px;margin:auto;padding:.55rem .7rem;border:3px solid #d8a83e;border-radius:12px;background:linear-gradient(#efc45f,#a96e13);color:#160d02;box-shadow:0 5px 0 #5c3905,0 0 28px #e6b43c66;cursor:pointer;overflow:visible}.ff-coin-start__coin{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:3px ridge #ddd;background:radial-gradient(circle at 35% 30%,#fff,#bbb 45%,#777);font:900 .68rem/1 Inter,sans-serif;color:#444;box-shadow:0 3px 0 #555;animation:ffCoinBob 1.1s ease-in-out infinite}.ff-coin-start__text small,.ff-coin-start__text strong{display:block}.ff-coin-start__text small{font:900 .62rem/1.2 Inter,sans-serif;letter-spacing:.1em}.ff-coin-start__text strong{margin-top:.2rem;font:900 1.25rem/1 Impact,"Arial Black",sans-serif;letter-spacing:.08em}.ff-coin-start__slot{display:grid;place-items:center;height:55px;border-radius:7px;background:#171717;border:2px solid #555;box-shadow:inset 0 0 10px #000}.ff-coin-start__slot i{display:block;width:7px;height:31px;border-radius:4px;background:#020202;box-shadow:0 0 8px #ff3b30}.ff-coin-start.is-inserting .ff-coin-start__coin{animation:ffInsertCoin .48s cubic-bezier(.5,0,.7,1) forwards}.ff-coin-start.is-inserting .ff-coin-start__slot{animation:ffSlotFlash .5s steps(2,end) forwards}@keyframes ffCoinBob{50%{transform:translateY(-5px) rotate(-6deg)}}@keyframes ffInsertCoin{0%{transform:translate(0,0) scale(1)}65%{transform:translate(calc(100% + 235px),0) scale(.82)}100%{transform:translate(calc(100% + 245px),8px) scale(.15);opacity:0}}@keyframes ffSlotFlash{50%,100%{border-color:#00ed8c;box-shadow:0 0 22px #00ed8c}}
    .ff-arcade-takeover{position:fixed;z-index:99999;inset:0;display:grid;place-items:center;background:#000;color:#fff;opacity:0;pointer-events:none}.ff-arcade-takeover.is-on{opacity:1;pointer-events:all;animation:ffStatic .18s steps(2,end) 2}.ff-arcade-takeover:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,#fff0 0 3px,#fff2 4px),repeating-linear-gradient(90deg,#00ff8833 0 3px,#8d5cff33 4px 7px,#28e7ff22 8px 11px);mix-blend-mode:screen;opacity:.28}.ff-arcade-takeover__copy{position:relative;text-align:center;font-family:Impact,"Arial Black",sans-serif;text-transform:uppercase}.ff-arcade-takeover__copy span{display:block;color:#00e58b;font:900 clamp(.7rem,3vw,1rem)/1 Inter,sans-serif;letter-spacing:.25em}.ff-arcade-takeover__copy strong{display:block;margin:.65rem 0;font-size:clamp(3.2rem,18vw,8rem);line-height:.78;text-shadow:6px 6px #8d5cff,-4px -4px #28e7ff}.ff-arcade-takeover__copy small{font:900 clamp(.7rem,3vw,1rem)/1 Inter,sans-serif;letter-spacing:.18em;color:#e5b64a;animation:ffBlink .5s steps(2,end) infinite}@keyframes ffStatic{25%{filter:contrast(2) hue-rotate(40deg);transform:translateX(4px)}50%{filter:invert(.12);transform:translateX(-5px)}75%{transform:skewX(2deg)}}@keyframes ffBlink{50%{opacity:.15}}
    .ff-recap-video{margin:0 0 clamp(1.4rem,4vw,2.6rem);padding:clamp(1rem,4vw,1.6rem);border:1px solid rgba(23,61,50,.12);border-radius:24px;background:linear-gradient(145deg,#173d32 0%,#0a271f 100%);color:#fff;box-shadow:0 18px 48px rgba(15,39,30,.13);overflow:hidden}.ff-recap-video__copy{margin:0 auto 1rem;max-width:34rem;text-align:center}.ff-recap-video__kicker{display:inline-block;margin-bottom:.45rem;color:#b8efd5;font-size:.68rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.ff-recap-video__copy h3{margin:0;font-family:"Playfair Display",serif;font-size:clamp(1.65rem,6vw,2.5rem);line-height:1.05}.ff-recap-video__copy p{margin:.65rem auto 0;max-width:31rem;color:rgba(255,255,255,.74);font-size:.9rem;line-height:1.55}.ff-recap-video__frame{position:relative;width:min(100%,390px);margin:0 auto;padding:6px;border-radius:22px;background:rgba(255,255,255,.11);box-shadow:0 16px 36px rgba(0,0,0,.24);overflow:hidden}.ff-recap-video video{display:block;width:100%;max-height:72vh;aspect-ratio:9/16;object-fit:cover;border-radius:17px;background:#050806}.ff-recap-video__sound{position:absolute;right:16px;bottom:18px;z-index:3;min-height:42px;padding:0 14px;border:1px solid rgba(255,255,255,.38);border-radius:999px;background:rgba(3,19,15,.76);color:#fff;font:900 .72rem/1 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 8px 22px rgba(0,0,0,.22);cursor:pointer}.ff-recap-video__more{margin:1rem 0 0;color:rgba(255,255,255,.62);font-size:.72rem;font-weight:800;letter-spacing:.08em;text-align:center;text-transform:uppercase}
    @media(min-width:760px){.ff-dtg-feature__strain{grid-template-columns:220px 1fr;padding:1.7rem;gap:1.7rem}.ff-dtg-feature__bud{height:250px}.ff-dtg-feature__awards{grid-template-columns:1fr 1fr}.ff-recap-video{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,390px);align-items:center;gap:clamp(2rem,5vw,4rem);padding:clamp(1.6rem,4vw,3rem)}.ff-recap-video__copy{text-align:left;margin:0}.ff-recap-video__more{text-align:left}}
    @media(prefers-reduced-motion:reduce){.ff-coin-start__coin,.ff-arcade-takeover__copy small{animation:none!important}}
  `;
  document.head.appendChild(style);

  const coinButton = document.getElementById("ff-coin-start");
  if (coinButton) {
    coinButton.addEventListener("click", () => {
      if (coinButton.disabled) return;
      coinButton.disabled = true;
      coinButton.classList.add("is-inserting");
      if (navigator.vibrate) navigator.vibrate(35);
      const takeover = document.createElement("div");
      takeover.className = "ff-arcade-takeover";
      takeover.innerHTML = `<div class="ff-arcade-takeover__copy"><span>GREEN LABS ARCADE</span><strong>READY<br>PLAYER 1</strong><small>GAME ON</small></div>`;
      document.body.appendChild(takeover);
      setTimeout(() => takeover.classList.add("is-on"), 430);
      try { sessionStorage.setItem("greenLabsArcadeEntry", "coin"); } catch (_) {}
      setTimeout(() => { window.location.href = "../arcade/?entry=coin"; }, 1550);
    });
  }

  const block = document.createElement("div");
  block.className = "ff-recap-video ff-reveal";
  block.id = "ff-recap-video";
  block.innerHTML = `<div class="ff-recap-video__copy"><span class="ff-recap-video__kicker">August 2026 · The recap</span><h3>A little glimpse of First Friday.</h3><p>Games, makers, regulars, new faces, and a parking lot that got a lot less boring.</p><div class="ff-recap-video__more">Then swipe through the scrapbook ↓</div></div><div class="ff-recap-video__frame"><video id="ff-recap-player" autoplay muted loop playsinline preload="metadata" aria-label="August 2026 First Friday recap video"><source src="../assets/video/first-friday/first-friday-august-2026.mp4" type="video/mp4">Your browser does not support embedded video.</video><button class="ff-recap-video__sound" id="ff-recap-sound" type="button" aria-pressed="false">🔊 Tap for sound</button></div>`;
  const inner = scrapbook.querySelector(".ff-scrapbook__inner");
  const book = scrapbook.querySelector(".ff-scrapbook__book");
  if (!inner || !book) return;
  inner.insertBefore(block, book);
  const video = block.querySelector("#ff-recap-player");
  const soundButton = block.querySelector("#ff-recap-sound");
  if (video && soundButton) {
    video.muted = true; video.defaultMuted = true;
    soundButton.addEventListener("click",()=>{const on=video.muted;video.muted=!on;soundButton.setAttribute("aria-pressed",on?"true":"false");soundButton.textContent=on?"🔇 Mute":"🔊 Tap for sound";if(on)video.play().catch(()=>{});});
    if("IntersectionObserver" in window){const po=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)video.play().catch(()=>{});else video.pause();}),{threshold:.35});po.observe(video);}else video.play().catch(()=>{});
  }
  const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");observer.unobserve(e.target);}}),{threshold:.12});observer.observe(block);const arcadeBlock=document.getElementById("ff-arcade-bridge");if(arcadeBlock)observer.observe(arcadeBlock);
})();
