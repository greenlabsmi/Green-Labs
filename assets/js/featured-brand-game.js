(() => {
  "use strict";

  const CONFIG = {
    brand: "Batch",

    hostSelector: ".ff-batch-showcase",
    stageSelector: ".ff-batch-showcase__gallery",
    logoSelector: ".ff-batch-showcase__logo",
    offerSelector: ".ff-batch-showcase__offer",

    helicopterImage:
      "../assets/img/first-friday/Batch/BATCH_2G_Helicopter_IGStory.jpg",

    total: 4,

    rewardText:
      "Show Green Labs staff to claim this month’s Easter-egg reward.",

    acceptedAnswers: ["firstfriday"],
    secondAcceptedAnswers: ["friday"],

    clues: [
      {
        key: "logo",
        host: "logo",
        className: "fb-clue--logo",
        label: "Catch the suspicious eyes behind the Batch logo",
        html: ""
      },
      {
        key: "helicopter",
        host: "stage",
        className: "fb-clue--helicopter",
        label: "Catch the helicopter flying over the bridge",
        html: "🚁"
      },
      {
        key: "honey",
        host: "stage",
        className: "fb-clue--honey",
        label: "Press the glowing gold window on the disposable",
        html: ""
      },
      {
        key: "sparkle",
        host: "offer",
        className: "fb-clue--sparkle",
        label: "Catch the wandering sparkle",
        html: "✦"
      }
    ],

    messages: {
      logo: "The logo was absolutely hiding something.",
      helicopter: "Air support secured. Nobody ask what it cost.",
      honey: "Forbidden honey button pressed.",
      sparkle: "You caught the wandering sparkle."
    }
  };

  const host = document.querySelector(CONFIG.hostSelector);
  const stage = document.querySelector(CONFIG.stageSelector);
  const logo = document.querySelector(CONFIG.logoSelector);
  const offer = document.querySelector(CONFIG.offerSelector);

  if (!host || !stage || !logo || !offer) {
    console.warn(
      "Featured Brand Game did not start because one or more required elements were not found."
    );

    return;
  }

  host.classList.add("fb-game-host");

  const logoWrap = document.createElement("span");

  logoWrap.className = "fb-logo-wrap is-alive";

  logo.parentNode.insertBefore(
    logoWrap,
    logo
  );

  logoWrap.appendChild(logo);

  const found = new Set();
  const clueElements = new Map();

  let gameFinished = false;

  const counter = document.createElement("div");

  counter.className = "fb-game-counter";

  counter.setAttribute(
    "aria-live",
    "polite"
  );

  counter.innerHTML = `
    <span>Hidden ${CONFIG.brand}</span>
    <strong>0G / ${CONFIG.total}G FOUND</strong>
  `;

  host.appendChild(counter);

  const toast = document.createElement("div");

  toast.className = "fb-toast";

  toast.setAttribute(
    "aria-live",
    "polite"
  );

  document.body.appendChild(toast);

  const hosts = {
    host,
    stage,
    logo: logoWrap,
    offer
  };

  CONFIG.clues.forEach((clue) => {
    const clueHost = hosts[clue.host];

    if (!clueHost) {
      return;
    }

    const button = document.createElement("button");

    button.type = "button";

    button.className =
      `fb-clue ${clue.className}`;

    button.setAttribute(
      "aria-label",
      clue.label
    );

    button.dataset.clue = clue.key;

    button.innerHTML = clue.html;

    clueHost.appendChild(button);

    button.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        collect(
          clue.key,
          button
        );
      }
    );

    clueElements.set(
      clue.key,
      button
    );
  });

  function collect(key, source) {
    if (
      gameFinished ||
      found.has(key)
    ) {
      return;
    }

    found.add(key);

    source.classList.add(
      "is-found"
    );

    counter.classList.add(
      "is-visible"
    );

    counter
      .querySelector("strong")
      .textContent =
        `${found.size}G / ${CONFIG.total}G FOUND`;

    showToast(
      `${found.size}G FOUND — ${CONFIG.messages[key]}`
    );

    burst(
      source,
      18
    );

    if (
      found.size === CONFIG.total
    ) {
      setTimeout(
        openChallenge,
        1600
      );
    }
  }

  function showToast(text) {
    toast.textContent = text;

    toast.classList.remove(
      "is-showing"
    );

    void toast.offsetWidth;

    toast.classList.add(
      "is-showing"
    );
  }

  function burst(source, count) {
    const rect =
      source.getBoundingClientRect();

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const bit =
        document.createElement("span");

      bit.className =
        "fb-confetti";

      bit.textContent =
        ["✦", "●", "◆", "★"][
          index % 4
        ];

      bit.style.left =
        `${rect.left + rect.width / 2}px`;

      bit.style.top =
        `${rect.top + rect.height / 2}px`;

      bit.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * 210}px`
      );

      bit.style.setProperty(
        "--y",
        `${-60 - Math.random() * 150}px`
      );

      bit.style.setProperty(
        "--r",
        `${Math.random() * 600 - 300}deg`
      );

      document.body.appendChild(bit);

      setTimeout(
        () => bit.remove(),
        1600
      );
    }
  }

  function normalize(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z]/g,
        ""
      );
  }

   function openChallenge() {
    if (
      gameFinished ||
      document.querySelector(
        ".fb-game-modal"
      )
    ) {
      return;
    }

    const modal =
      document.createElement("div");

    modal.className =
      "fb-game-modal";

    modal.innerHTML = `
      <div class="fb-game-backdrop"></div>

      <section
        class="fb-game-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fbGameTitle"
      >
        <button
          class="fb-game-close"
          type="button"
          aria-label="Close"
        >
          ×
        </button>

        <div class="fb-game-art">
          <img
            src="${CONFIG.helicopterImage}"
            alt="Batch helicopter campaign artwork"
          >
        </div>

        <div class="fb-game-copy">

          <div class="fb-game-kicker">
            You found the full ${CONFIG.brand}
          </div>

          <h2 id="fbGameTitle">
            The last gram has become emotionally unavailable.
          </h2>

          <p>
            Answer correctly and it may agree to become a prize pass.
          </p>

          <div class="fb-game-question">

            <p>
              Once a month, Green Labs fills up with brands,
              artists, games, giveaways, and at least one person
              treating cornhole like the Olympics.
              What event is it?
            </p>

            <form class="fb-game-form">

              <input
                autocomplete="off"
                placeholder="Your answer"
                aria-label="Your answer"
                required
              >

              <button type="submit">
                Lock it in
              </button>

            </form>

            <div
              class="fb-game-feedback"
              aria-live="polite"
            ></div>

          </div>

        </div>
      </section>
    `;

    document.body.appendChild(modal);

    document.body.style.overflow =
      "hidden";

    requestAnimationFrame(() => {
      modal.classList.add(
        "is-open"
      );
    });

    const input =
      modal.querySelector("input");

    setTimeout(
      () => input.focus(),
      450
    );

    modal
      .querySelector(
        ".fb-game-close"
      )
      .addEventListener(
        "click",
        () => closeModal(modal)
      );

    modal
      .querySelector(
        ".fb-game-backdrop"
      )
      .addEventListener(
        "click",
        () => closeModal(modal)
      );

    let attempts = 0;

    modal
      .querySelector("form")
      .addEventListener(
        "submit",
        (event) => {
          event.preventDefault();

          const answer =
            normalize(input.value);

          const valid =
            attempts === 0
              ? CONFIG
                  .acceptedAnswers
                  .includes(answer)
              : CONFIG
                  .secondAcceptedAnswers
                  .includes(answer) ||
                CONFIG
                  .acceptedAnswers
                  .includes(answer);

          if (valid) {
            win(modal);
            return;
          }

          attempts += 1;

          if (attempts === 1) {
            firstWrongAnswer(
              modal,
              input
            );
          } else {
            failSpectacularly(
              modal
            );
          }
        }
      );
  }

  function firstWrongAnswer(
    modal,
    input
  ) {
    modal
      .querySelector(
        ".fb-game-feedback"
      )
      .textContent =
        "Absolutely not. That answer had the structural integrity of a gas-station pre-roll.";

    modal
      .querySelector(
        ".fb-game-question > p"
      )
      .innerHTML = `
        One more try.
        Complete the event name:
        <br>
        <strong>
          FIRST ________
        </strong>
      `;

    input.value = "";

    input.placeholder =
      "Air support is losing patience";

    const card =
      modal.querySelector(
        ".fb-game-card"
      );

    card.classList.remove(
      "is-wrong"
    );

    void card.offsetWidth;

    card.classList.add(
      "is-wrong"
    );

    setTimeout(
      () => {
        card.classList.remove(
          "is-wrong"
        );
      },
      1200
    );
  }

  function win(modal) {
    gameFinished = true;

    const code =
      `${CONFIG.brand.toUpperCase()}-` +
      Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase();

    const stamp =
      new Date().toLocaleString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        }
      );

    modal
      .querySelector(
        ".fb-game-copy"
      )
      .innerHTML = `
        <div class="fb-game-kicker">
          FULL ${CONFIG.brand.toUpperCase()} UNLOCKED
        </div>

        <h2>
          You found all four hidden grams.
        </h2>

        <p>
          And answered a question that was,
          respectfully, not that difficult.
        </p>

        <div class="fb-game-pass">

          <strong>
            SCREENSHOT THIS PASS
          </strong>

          <span>
            ${CONFIG.rewardText}
          </span>

          <b>
            ${code}
          </b>

          <small>
            ${stamp}
          </small>

        </div>

        <p>
          One reward per person.
          Staff may ask where the helicopter was hiding.
        </p>
      `;

    counter.classList.remove(
      "is-visible"
    );

    for (
      let round = 0;
      round < 8;
      round += 1
    ) {
      setTimeout(
        () => {
          burst(
            modal.querySelector(
              ".fb-game-card"
            ),
            20
          );
        },
        round * 260
      );
    }
  }

   function failSpectacularly(
    modal
  ) {
    gameFinished = true;

    modal
      .querySelector(
        ".fb-game-feedback"
      )
      .innerHTML = `
        <strong>DANGER.</strong>
        <br>
        Air support has interpreted that answer as a cry for help.
      `;

    modal
      .querySelector(
        ".fb-game-card"
      )
      .classList.add(
        "is-doomed"
      );

    const emergency =
      document.createElement("div");

    emergency.className =
      "fb-emergency";

    document.body.appendChild(
      emergency
    );

    const sequence = [
      {
        delay: 1200,
        text: "DANGER. DANGER."
      },
      {
        delay: 3600,
        text:
          "EMERGENCY HOTBOX DEPLOYMENT IN 3"
      },
      {
        delay: 6200,
        text: "2"
      },
      {
        delay: 8500,
        text: "",
        className: "is-blackout"
      },
      {
        delay: 10600,
        text: "what is happening?",
        className:
          "is-blackout is-confused"
      },
      {
        delay: 13200,
        text: "",
        className: "is-fire"
      }
    ];

    sequence.forEach((step) => {
      setTimeout(
        () => {
          emergency.className =
            `fb-emergency ${step.className || ""}`.trim();

          emergency.textContent =
            step.text;
        },
        step.delay
      );
    });

    setTimeout(
      () => {
        startSmokeFinale(
          modal,
          emergency
        );
      },
      15100
    );
  }

  function startSmokeFinale(
    modal,
    emergency
  ) {
    const smoke =
      document.createElement("div");

    smoke.className =
      "fb-game-smoke";

    smoke.innerHTML = `
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    `;

    const positions = [
      {
        left: "-15%",
        top: "5%"
      },
      {
        left: "15%",
        top: "35%"
      },
      {
        left: "45%",
        top: "-10%"
      },
      {
        left: "70%",
        top: "25%"
      },
      {
        left: "5%",
        top: "65%"
      },
      {
        left: "55%",
        top: "55%"
      }
    ];

    [...smoke.children]
      .forEach(
        (cloud, index) => {
          cloud.style.left =
            positions[index].left;

          cloud.style.top =
            positions[index].top;

          cloud.style.animationDelay =
            `${index * 160}ms`;
        }
      );

    document.body.appendChild(
      smoke
    );

    requestAnimationFrame(() => {
      smoke.classList.add(
        "is-active"
      );
    });

    setTimeout(
      () => {
        modal.remove();
        emergency.remove();

        smoke.classList.add(
          "is-clearing"
        );

        counter.classList.remove(
          "is-visible"
        );

        document.body.style.overflow =
          "";

        setTimeout(
          () => smoke.remove(),
          3100
        );
      },
      3600
    );
  }

  function closeModal(modal) {
    modal.classList.remove(
      "is-open"
    );

    document.body.style.overflow =
      "";

    setTimeout(
      () => modal.remove(),
      500
    );
  }
})();
