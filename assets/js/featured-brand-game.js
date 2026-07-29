(() => {
  "use strict";

  const CONFIG = {
    hostSelector: ".ff-batch-showcase",
    stageSelector: ".ff-batch-showcase__gallery",
    logoSelector: ".ff-batch-showcase__logo",
    paths: {
      bridge: "../assets/img/first-friday/Batch/airlift/batch-airlift-bridge.jpg",
      disposable: "../assets/img/first-friday/Batch/airlift/batch-airlift-disposable.png",
      helicopter: "../assets/img/first-friday/Batch/airlift/batch-airlift-helicopter.png"
    },
    rewardText: "Show Green Labs staff to claim this month’s First Friday Easter-egg reward.",
    acceptedAnswers: ["firstfriday", "friday"],
    objectiveCount: 4
  };

  const host = document.querySelector(CONFIG.hostSelector);
  const stage = document.querySelector(CONFIG.stageSelector);
  const logo = document.querySelector(CONFIG.logoSelector);

  if (!host || !stage || host.dataset.operationBigAf === "ready") {
    return;
  }

  host.dataset.operationBigAf = "ready";
  host.classList.add("fb-game-host");

  if (logo) {
    logo.classList.add("is-alive");
  }

  const state = {
    completed: new Set(),
    airliftStarted: false,
    airliftComplete: false,
    challengeOpened: false,
    gameFinished: false,
    smokeCleared: false,
    drawingSmoke: false
  };

  stage.innerHTML = `
    <figure class="ff-batch-airlift" data-batch-airlift aria-label="Interactive Batch airlift mission over the Mackinac Bridge">
      <img
        class="ff-batch-airlift__bridge"
        src="${CONFIG.paths.bridge}"
        alt="Batch 4G advertisement featuring the Mackinac Bridge and a tiny car"
      >

      <div class="ff-batch-airlift__flight-layer" data-flight-layer>
        <img
          class="ff-batch-airlift__disposable"
          src="${CONFIG.paths.disposable}"
          alt="Batch 4G disposable waiting for air support"
        >
      </div>

      <button
        class="ff-batch-airlift__car-trigger"
        type="button"
        aria-label="Inspect the tiny car crossing the bridge"
        data-airlift-trigger
      ></button>

      <button
        class="fb-eyes"
        type="button"
        aria-label="Catch the eyes peeking from the side of the advertisement"
        data-objective="eyes"
      >👀</button>

      <button
        class="fb-spark"
        type="button"
        aria-label="Catch the Batch power spark"
        data-objective="spark"
      >✦</button>

      <div class="fb-lungs-zone" data-lungs-zone>
        <button
          class="fb-lungs-button"
          type="button"
          aria-label="Secure the lungs after clearing the smoke"
          data-objective="lungs"
          disabled
        >🫁</button>
        <canvas
          class="fb-lungs-smoke"
          aria-label="Scratch or wipe away the smoke to reveal the lungs"
          data-lungs-smoke
        ></canvas>
      </div>

      <div class="fb-mission-hud" aria-live="polite">
        <div class="fb-mission-title">OPERATION BIG AF · FIND THE TINY CAR</div>
        <div class="fb-airlift-message" data-airlift-message></div>
      </div>

      <div class="fb-mission-counter" aria-live="polite">
        <span>Mission systems</span>
        <strong data-mission-count>0 / ${CONFIG.objectiveCount} SECURED</strong>
      </div>
    </figure>
  `;

  const airlift = stage.querySelector("[data-batch-airlift]");
  const flightLayer = stage.querySelector("[data-flight-layer]");
  const trigger = stage.querySelector("[data-airlift-trigger]");
  const message = stage.querySelector("[data-airlift-message]");
  const count = stage.querySelector("[data-mission-count]");
  const eyes = stage.querySelector('[data-objective="eyes"]');
  const spark = stage.querySelector('[data-objective="spark"]');
  const lungsZone = stage.querySelector("[data-lungs-zone]");
  const lungsButton = stage.querySelector('[data-objective="lungs"]');
  const smokeCanvas = stage.querySelector("[data-lungs-smoke]");

  const toast = document.createElement("div");
  toast.className = "fb-toast";
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  trigger.addEventListener("click", startAirlift, { once: true });

  eyes.addEventListener("click", () => {
    eyes.classList.add("is-found");
    completeObjective("eyes", "👀 I SEE IT. IT’S BIG AF!");
  });

  spark.addEventListener("click", () => {
    spark.classList.add("is-found");
    completeObjective("spark", "⚡ GET THAT SPARK, BATCH! POWER SUPPLY SECURED.");
  });

  lungsButton.addEventListener("click", () => {
    lungsZone.classList.add("is-found");
    completeObjective("lungs", "🫁 BIG BOY LUNGS SECURED. INHALE SYSTEMS ONLINE.");
  });

  setupScratchSmoke();

  function startAirlift() {
    if (state.airliftStarted || state.gameFinished) {
      return;
    }

    state.airliftStarted = true;
    trigger.disabled = true;

    showMessage("SIGNAL DETECTED.", 0);
    showMessage("ATTEMPTING CONTACT…", 1800);

    const helicopters = createAirliftCrew();

    helicopters.forEach((helicopter, index) => {
      const arrivalDelay = 3900 + index * 2200;

      window.setTimeout(() => {
        helicopter.classList.add("is-arriving");

        showMessage(`AIR SUPPORT ${index + 1} OF 4`, 0);

        window.setTimeout(() => {
          helicopter.classList.add("is-hovering");
        }, 2850);
      }, arrivalDelay);
    });

    showMessage("AIRLIFT COMPANY SECURED.", 12700);
    showMessage("SECURING THE BIG AF PAYLOAD…", 15000);

    window.setTimeout(() => {
      airlift.classList.add("is-rigged");
      flightLayer.querySelectorAll(".fb-lift-cable").forEach((cable) => {
        cable.classList.add("is-taut");
      });
    }, 16400);

    showMessage("BATCH SECURED.", 18400);
    showMessage("LET’S GET HIGH.", 20700);

    window.setTimeout(() => {
      airlift.classList.remove("is-rigged");
      airlift.classList.add("is-lifting");
    }, 22100);

    window.setTimeout(() => {
      state.airliftComplete = true;
      completeObjective("airlift", "🚁 AIRLIFT COMPLETE. BRIDGE REOPENED.");
      showMessage("AIRLIFT COMPLETE. BRIDGE REOPENED.", 0);
    }, 30600);
  }

  function createAirliftCrew() {
    const helicopters = [];

    for (let index = 1; index <= 4; index += 1) {
      const helicopter = document.createElement("img");
      helicopter.className = `fb-helicopter fb-helicopter--${index}`;
      helicopter.src = CONFIG.paths.helicopter;
      helicopter.alt = "";
      helicopter.setAttribute("aria-hidden", "true");
      helicopter.style.setProperty("--hover-time", `${3.2 + index * 0.35}s`);

      const cable = document.createElement("span");
      cable.className = `fb-lift-cable fb-lift-cable--${index}`;
      cable.setAttribute("aria-hidden", "true");

      flightLayer.append(helicopter, cable);
      helicopters.push(helicopter);
    }

    return helicopters;
  }

  function showMessage(text, delay) {
    window.setTimeout(() => {
      message.classList.remove("is-visible");

      window.setTimeout(() => {
        message.textContent = text;
        message.classList.add("is-visible");
      }, 220);
    }, delay);
  }

  function completeObjective(key, text) {
    if (state.completed.has(key) || state.gameFinished) {
      return;
    }

    state.completed.add(key);
    count.textContent = `${state.completed.size} / ${CONFIG.objectiveCount} SECURED`;
    showToast(text);

    if (state.completed.size === CONFIG.objectiveCount) {
      window.setTimeout(openChallenge, 2000);
    }
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.remove("is-showing");
    void toast.offsetWidth;
    toast.classList.add("is-showing");
  }

  function setupScratchSmoke() {
    const context = smokeCanvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      lungsZone.classList.add("is-cleared");
      lungsButton.disabled = false;
      smokeCanvas.hidden = true;
      return;
    }

    const resize = () => {
      const rect = lungsZone.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      smokeCanvas.width = Math.max(1, Math.round(rect.width * ratio));
      smokeCanvas.height = Math.max(1, Math.round(rect.height * ratio));
      smokeCanvas.style.width = `${rect.width}px`;
      smokeCanvas.style.height = `${rect.height}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawSmoke(context, rect.width, rect.height);
    };

    const erase = (event) => {
      if (state.smokeCleared) {
        return;
      }

      const rect = smokeCanvas.getBoundingClientRect();
      const point = event.touches ? event.touches[0] : event;
      const x = point.clientX - rect.left;
      const y = point.clientY - rect.top;

      context.save();
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(x, y, Math.max(18, rect.width * 0.13), 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    smokeCanvas.addEventListener("pointerdown", (event) => {
      state.drawingSmoke = true;
      smokeCanvas.setPointerCapture?.(event.pointerId);
      erase(event);
    });

    smokeCanvas.addEventListener("pointermove", (event) => {
      if (state.drawingSmoke) {
        erase(event);
      }
    });

    const stop = () => {
      if (!state.drawingSmoke) {
        return;
      }

      state.drawingSmoke = false;
      evaluateSmoke(context);
    };

    smokeCanvas.addEventListener("pointerup", stop);
    smokeCanvas.addEventListener("pointercancel", stop);
    smokeCanvas.addEventListener("pointerleave", stop);

    window.addEventListener("resize", debounce(resize, 180));
    requestAnimationFrame(resize);
  }

  function drawSmoke(context, width, height) {
    context.clearRect(0, 0, width, height);

    const gradient = context.createRadialGradient(
      width * 0.5,
      height * 0.52,
      width * 0.05,
      width * 0.5,
      height * 0.52,
      width * 0.75
    );

    gradient.addColorStop(0, "rgba(244, 248, 251, .98)");
    gradient.addColorStop(0.48, "rgba(190, 205, 215, .96)");
    gradient.addColorStop(1, "rgba(77, 96, 109, .94)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    for (let index = 0; index < 18; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = width * (0.1 + Math.random() * 0.18);

      context.beginPath();
      context.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.22})`;
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  function evaluateSmoke(context) {
    if (state.smokeCleared) {
      return;
    }

    const { width, height } = smokeCanvas;
    const pixels = context.getImageData(0, 0, width, height).data;
    let visible = 0;
    let samples = 0;

    for (let index = 3; index < pixels.length; index += 64) {
      samples += 1;
      if (pixels[index] > 24) {
        visible += 1;
      }
    }

    const clearedRatio = 1 - visible / Math.max(samples, 1);

    if (clearedRatio >= 0.48) {
      state.smokeCleared = true;
      lungsZone.classList.add("is-cleared");
      lungsButton.disabled = false;
      smokeCanvas.style.pointerEvents = "none";
      smokeCanvas.style.opacity = "0";
      showToast("SMOKE CLEARED. LUNGS ARE READY.");
    }
  }

  function openChallenge() {
    if (state.challengeOpened || state.gameFinished) {
      return;
    }

    state.challengeOpened = true;

    const modal = document.createElement("div");
    modal.className = "fb-game-modal";
    modal.innerHTML = `
      <div class="fb-game-backdrop"></div>
      <section class="fb-game-card" role="dialog" aria-modal="true" aria-labelledby="fbGameTitle">
        <button class="fb-game-close" type="button" aria-label="Close">×</button>
        <div class="fb-game-art">
          <img src="${CONFIG.paths.bridge}" alt="Mackinac Bridge after the Batch airlift">
        </div>
        <div class="fb-game-copy">
          <div class="fb-game-kicker">OPERATION BIG AF COMPLETE</div>
          <h2 id="fbGameTitle">Payload secured. Bridge reopened.</h2>
          <p>You called the crew, powered the Batch, spotted the target, and cleared the smoke. One final question unlocks the mission pass.</p>
          <div class="fb-game-question">
            <p>Once a month, Green Labs fills up with brands, artists, games, giveaways, and people treating cornhole like the Olympics. What event is it?</p>
            <form class="fb-game-form">
              <input autocomplete="off" placeholder="Your answer" aria-label="Your answer" required>
              <button type="submit">Lock it in</button>
            </form>
            <div class="fb-game-feedback" aria-live="polite"></div>
          </div>
        </div>
      </section>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => modal.classList.add("is-open"));

    const input = modal.querySelector("input");
    const closeButton = modal.querySelector(".fb-game-close");
    let attempts = 0;

    window.setTimeout(() => input.focus(), 450);

    closeButton.addEventListener("click", () => closeModal(modal));
    modal.querySelector(".fb-game-backdrop").addEventListener("click", () => closeModal(modal));

    modal.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();

      const answer = normalize(input.value);

      if (CONFIG.acceptedAnswers.includes(answer)) {
        win(modal);
        return;
      }

      attempts += 1;

      if (attempts === 1) {
        firstWrongAnswer(modal, input);
      } else {
        failSpectacularly(modal);
      }
    });
  }

  function firstWrongAnswer(modal, input) {
    modal.querySelector(".fb-game-feedback").textContent =
      "Absolutely not. That answer had the structural integrity of a gas-station pre-roll.";

    modal.querySelector(".fb-game-question > p").innerHTML =
      "One more try. Complete the event name:<br><strong>FIRST ________</strong>";

    input.value = "";
    input.placeholder = "Air support is losing patience";

    const card = modal.querySelector(".fb-game-card");
    card.classList.remove("is-wrong");
    void card.offsetWidth;
    card.classList.add("is-wrong");
    window.setTimeout(() => card.classList.remove("is-wrong"), 1200);
  }

  function win(modal) {
    state.gameFinished = true;

    const code = `BATCH-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const stamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });

    modal.querySelector(".fb-game-copy").innerHTML = `
      <div class="fb-game-kicker">MISSION PASS UNLOCKED</div>
      <h2>Batch secured. You officially got high.</h2>
      <p>High above the Mackinac Bridge. Obviously.</p>
      <div class="fb-game-pass">
        <strong>SCREENSHOT THIS PASS</strong>
        <span>${CONFIG.rewardText}</span>
        <b>${code}</b>
        <small>${stamp}</small>
      </div>
      <p>One reward per person. Staff may ask what was driving across the bridge.</p>
    `;
  }

  function failSpectacularly(modal) {
    state.gameFinished = true;
    modal.querySelector(".fb-game-feedback").innerHTML =
      "<strong>DANGER.</strong><br>Air support has interpreted that answer as a cry for help.";
    modal.querySelector(".fb-game-card").classList.add("is-doomed");

    const emergency = document.createElement("div");
    emergency.className = "fb-emergency";
    document.body.appendChild(emergency);

    [
      { delay: 1200, text: "DANGER. DANGER." },
      { delay: 3900, text: "EMERGENCY HOTBOX DEPLOYMENT IN 3" },
      { delay: 7000, text: "2" },
      { delay: 9700, text: "", className: "is-blackout" },
      { delay: 12100, text: "what is happening?", className: "is-blackout is-confused" },
      { delay: 15100, text: "", className: "is-fire" }
    ].forEach((step) => {
      window.setTimeout(() => {
        emergency.className = `fb-emergency ${step.className || ""}`.trim();
        emergency.textContent = step.text;
      }, step.delay);
    });

    window.setTimeout(() => startSmokeFinale(modal, emergency), 17500);
  }

  function startSmokeFinale(modal, emergency) {
    const smoke = document.createElement("div");
    smoke.className = "fb-game-smoke";
    smoke.innerHTML = "<i></i><i></i><i></i><i></i><i></i><i></i>";

    const positions = [
      ["-15%", "5%"], ["15%", "35%"], ["45%", "-10%"],
      ["70%", "25%"], ["5%", "65%"], ["55%", "55%"]
    ];

    [...smoke.children].forEach((cloud, index) => {
      cloud.style.left = positions[index][0];
      cloud.style.top = positions[index][1];
      cloud.style.animationDelay = `${index * 160}ms`;
    });

    document.body.appendChild(smoke);
    requestAnimationFrame(() => smoke.classList.add("is-active"));

    window.setTimeout(() => {
      modal.remove();
      emergency.remove();
      smoke.classList.add("is-clearing");
      document.body.style.overflow = "";
      window.setTimeout(() => smoke.remove(), 3100);
    }, 3900);
  }

  function closeModal(modal) {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    state.challengeOpened = false;
    window.setTimeout(() => modal.remove(), 500);
  }

  function normalize(value) {
    return value.trim().toLowerCase().replace(/[^a-z]/g, "");
  }

  function debounce(callback, wait) {
    let timer;

    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), wait);
    };
  }
})();


