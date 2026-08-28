(() => {
  "use strict";

  const scrapbook = document.getElementById("first-friday-scrapbook");
  if (!scrapbook || document.getElementById("ff-recap-video")) return;

  const dtgCard = document.querySelector(".ff-lemon-wookie");
  if (dtgCard) {
    const eyebrow = dtgCard.querySelector(".ff-feature-card__eyebrow");
    const heading = dtgCard.querySelector("h3");
    const line = dtgCard.querySelector(".ff-lemon-wookie__line");
    const awards = dtgCard.querySelector(".ff-lemon-wookie__awards");
    const available = dtgCard.querySelector(".ff-lemon-wookie__available");
    const image = dtgCard.querySelector(".ff-lemon-wookie__visual img");

    if (eyebrow) eyebrow.textContent = "FEATURED BRAND · JOINING US";
    if (heading) heading.textContent = "Dutch Touch Genetics";
    if (line) line.textContent = "Born and bred in-house at Green Labs. Meet the team behind Dutch Touch Genetics at First Friday — and the award-winning flower they grow right here.";
    if (awards && !dtgCard.querySelector(".ff-dtg-spotlight-strain")) {
      const spotlight = document.createElement("div");
      spotlight.className = "ff-lemon-wookie__available ff-dtg-spotlight-strain";
      spotlight.innerHTML = "<span>SPOTLIGHT STRAIN</span><strong>Lemon Wookie</strong>";
      awards.parentNode.insertBefore(spotlight, awards);
      awards.setAttribute("aria-label", "2026 Best in Grass awards for Lemon Wookie");
    }
    if (available) {
      available.innerHTML = "<span>NOW AT GREEN LABS</span><strong>Deli Flower • Pre-Rolls</strong>";
    }
    if (image) image.alt = "Award-winning Lemon Wookie flower grown by Dutch Touch Genetics";
  }

  const style = document.createElement("style");
  style.textContent = `
    .ff-recap-video {
      margin: 0 0 clamp(1.4rem, 4vw, 2.6rem);
      padding: clamp(1rem, 4vw, 1.6rem);
      border: 1px solid rgba(23,61,50,.12);
      border-radius: 24px;
      background: linear-gradient(145deg,#173d32 0%,#0a271f 100%);
      color: #fff;
      box-shadow: 0 18px 48px rgba(15,39,30,.13);
      overflow: hidden;
    }
    .ff-recap-video__copy {
      margin: 0 auto 1rem;
      max-width: 34rem;
      text-align: center;
    }
    .ff-recap-video__kicker {
      display: inline-block;
      margin-bottom: .45rem;
      color: #b8efd5;
      font-size: .68rem;
      font-weight: 900;
      letter-spacing: .14em;
      text-transform: uppercase;
    }
    .ff-recap-video__copy h3 {
      margin: 0;
      font-family: "Playfair Display", serif;
      font-size: clamp(1.65rem, 6vw, 2.5rem);
      line-height: 1.05;
    }
    .ff-recap-video__copy p {
      margin: .65rem auto 0;
      max-width: 31rem;
      color: rgba(255,255,255,.74);
      font-size: .9rem;
      line-height: 1.55;
    }
    .ff-recap-video__frame {
      position: relative;
      width: min(100%, 390px);
      margin: 0 auto;
      padding: 6px;
      border-radius: 22px;
      background: rgba(255,255,255,.11);
      box-shadow: 0 16px 36px rgba(0,0,0,.24);
      overflow: hidden;
    }
    .ff-recap-video video {
      display: block;
      width: 100%;
      max-height: 72vh;
      aspect-ratio: 9 / 16;
      object-fit: cover;
      border-radius: 17px;
      background: #050806;
    }
    .ff-recap-video__sound {
      position: absolute;
      right: 16px;
      bottom: 18px;
      z-index: 3;
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid rgba(255,255,255,.38);
      border-radius: 999px;
      background: rgba(3,19,15,.76);
      color: #fff;
      font: 900 .72rem/1 "Inter", sans-serif;
      letter-spacing: .08em;
      text-transform: uppercase;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 8px 22px rgba(0,0,0,.22);
      cursor: pointer;
    }
    .ff-recap-video__sound:focus-visible {
      outline: 3px solid #b8efd5;
      outline-offset: 3px;
    }
    .ff-recap-video__more {
      margin: 1rem 0 0;
      color: rgba(255,255,255,.62);
      font-size: .72rem;
      font-weight: 800;
      letter-spacing: .08em;
      text-align: center;
      text-transform: uppercase;
    }
    .ff-dtg-spotlight-strain {
      margin-bottom: 1rem;
    }
    @media (min-width: 760px) {
      .ff-recap-video {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
        align-items: center;
        gap: clamp(2rem, 5vw, 4rem);
        padding: clamp(1.6rem, 4vw, 3rem);
      }
      .ff-recap-video__copy { text-align: left; margin: 0; }
      .ff-recap-video__more { text-align: left; }
    }
  `;
  document.head.appendChild(style);

  const block = document.createElement("div");
  block.className = "ff-recap-video ff-reveal";
  block.id = "ff-recap-video";
  block.innerHTML = `
    <div class="ff-recap-video__copy">
      <span class="ff-recap-video__kicker">August 2026 · The recap</span>
      <h3>A little glimpse of First Friday.</h3>
      <p>Games, makers, regulars, new faces, and a parking lot that got a lot less boring.</p>
      <div class="ff-recap-video__more">Then swipe through the scrapbook ↓</div>
    </div>
    <div class="ff-recap-video__frame">
      <video
        id="ff-recap-player"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        aria-label="August 2026 First Friday recap video"
      >
        <source src="../assets/video/first-friday/first-friday-august-2026.mp4" type="video/mp4">
        Your browser does not support embedded video.
      </video>
      <button class="ff-recap-video__sound" id="ff-recap-sound" type="button" aria-pressed="false">🔊 Tap for sound</button>
    </div>
  `;

  const inner = scrapbook.querySelector(".ff-scrapbook__inner");
  const book = scrapbook.querySelector(".ff-scrapbook__book");
  if (!inner || !book) return;

  inner.insertBefore(block, book);

  const video = block.querySelector("#ff-recap-player");
  const soundButton = block.querySelector("#ff-recap-sound");

  if (video && soundButton) {
    video.muted = true;
    video.defaultMuted = true;

    soundButton.addEventListener("click", () => {
      const turningSoundOn = video.muted;
      video.muted = !turningSoundOn;
      soundButton.setAttribute("aria-pressed", turningSoundOn ? "true" : "false");
      soundButton.textContent = turningSoundOn ? "🔇 Mute" : "🔊 Tap for sound";
      if (turningSoundOn) video.play().catch(() => {});
    });

    if ("IntersectionObserver" in window) {
      const playbackObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: .35 });
      playbackObserver.observe(video);
    } else {
      video.play().catch(() => {});
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  observer.observe(block);
})();
