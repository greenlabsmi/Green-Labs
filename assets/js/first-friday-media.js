(() => {
  "use strict";

  const scrapbook = document.getElementById("first-friday-scrapbook");
  if (!scrapbook || document.getElementById("ff-recap-video")) return;

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
      width: min(100%, 390px);
      margin: 0 auto;
      padding: 6px;
      border-radius: 22px;
      background: rgba(255,255,255,.11);
      box-shadow: 0 16px 36px rgba(0,0,0,.24);
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
    .ff-recap-video__more {
      margin: 1rem 0 0;
      color: rgba(255,255,255,.62);
      font-size: .72rem;
      font-weight: 800;
      letter-spacing: .08em;
      text-align: center;
      text-transform: uppercase;
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
        controls
        playsinline
        preload="metadata"
        aria-label="August 2026 First Friday recap video"
      >
        <source src="../assets/video/first-friday/first-friday-august-2026.mp4" type="video/mp4">
        Your browser does not support embedded video.
      </video>
    </div>
  `;

  const inner = scrapbook.querySelector(".ff-scrapbook__inner");
  const book = scrapbook.querySelector(".ff-scrapbook__book");
  if (!inner || !book) return;

  inner.insertBefore(block, book);

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
