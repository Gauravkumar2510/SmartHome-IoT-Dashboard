const $ = s => document.querySelector(s);


/* =========================
   ACTIVITY
========================= */

let activity = [
  ["💡", "Living Room Light", "ON"],
  ["🌀", "Bedroom Fan", "ON"],
  ["❄️", "Smart AC", "24°C"],
  ["🔌", "Smart Plug", "ON"]
];


function render() {

  const a = $("#activity");

  if (!activity.length) {

    a.innerHTML =
      `<p class="empty-log">No activity yet.</p>`;

    return;

  }


  a.innerHTML = activity
    .map(x =>
      `<div class="item">
        <b>${x[0]} ${x[1]}</b>
        <span>${x[2]} · Just now</span>
      </div>`
    )
    .join("");

}


render();


/* =========================
   DEVICE COUNT
========================= */

function update() {

  const n =
    document.querySelectorAll(".switch.on").length;


  $("#count").textContent =
    `${n} / 9`;


  $("#active").textContent =
    `${n} active`;

}


update();


/* =========================
   TOAST
========================= */

function toast(message) {

  const x = $("#toast");

  x.textContent = message;

  x.classList.add("show");

  setTimeout(
    () => x.classList.remove("show"),
    2200
  );

}


/* =========================
   DEVICE SWITCHES
========================= */

document
  .querySelectorAll(".switch")
  .forEach(s => {

    s.onclick = () => {

      s.classList.toggle("on");


      const device =
        s.closest(".device");


      const state =
        s.classList.contains("on")
          ? "ON"
          : "OFF";


      activity.unshift([
        "⚙️",
        device.dataset.name,
        state
      ]);


      activity =
        activity.slice(0, 8);


      render();

      update();


      toast(
        `${device.dataset.name} turned ${state}`
      );

    };

  });


/* =========================
   AUTOMATION SYSTEM
========================= */

const automationRules = {

  temperature: false,
  humidity: false,
  night: false,
  energy: false

};


const automationButtons =
  document.querySelectorAll(
    ".automation-toggle"
  );


function updateAutomationCount() {

  const active =
    Object.values(
      automationRules
    ).filter(Boolean).length;


  $("#automationStatus").textContent =
    `${active} active rule${active === 1 ? "" : "s"}`;

}


updateAutomationCount();


automationButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const rule =
        button.dataset.rule;


      automationRules[rule] =
        !automationRules[rule];


      const enabled =
        automationRules[rule];


      button.textContent =
        enabled
          ? "ON"
          : "OFF";


      button.classList.toggle(
        "active",
        enabled
      );


      updateAutomationCount();


      addAutomationLog(
        enabled
          ? `Automation enabled: ${rule}`
          : `Automation disabled: ${rule}`
      );


      toast(
        enabled
          ? "Automation rule enabled"
          : "Automation rule disabled"
      );

    }
  );

});


/* =========================
   AUTOMATION LOG
========================= */

let automationLog = [];


function addAutomationLog(message) {

  const now =
    new Date().toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );


  automationLog.unshift({
    message,
    time: now
  });


  automationLog =
    automationLog.slice(0, 8);


  renderAutomationLog();

}


function renderAutomationLog() {

  const box =
    $("#automationActivity");


  if (!automationLog.length) {

    box.innerHTML =
      `<p class="empty-log">
        No automation activity yet.
      </p>`;

    return;

  }


  box.innerHTML =
    automationLog
      .map(item =>
        `<div class="item">
          <b>🤖 ${item.message}</b>
          <span>${item.time}</span>
        </div>`
      )
      .join("");

}


renderAutomationLog();


$("#clearAutomation")
  .addEventListener(
    "click",
    () => {

      automationLog = [];

      renderAutomationLog();

      toast(
        "Automation history cleared"
      );

    }
  );


/* =========================
   SMART TEMPERATURE RULE
========================= */

function runTemperatureAutomation(
  temperature
) {

  if (
    automationRules.temperature &&
    temperature > 28
  ) {

    const ac =
      document.querySelector(
        '[data-name="Smart AC"] .switch'
      );


    if (!ac.classList.contains("on")) {

      ac.classList.add("on");

      update();


      addAutomationLog(
        `Temperature ${temperature}°C → Smart AC turned ON`
      );


      toast(
        "Smart AC automatically turned ON"
      );

    }

  }

}


/* =========================
   SMART HUMIDITY RULE
========================= */

function runHumidityAutomation(
  humidity
) {

  if (
    automationRules.humidity &&
    humidity > 70
  ) {

    const fan =
      document.querySelector(
        '[data-name="Bathroom Exhaust Fan"] .switch'
      );


    if (!fan.classList.contains("on")) {

      fan.classList.add("on");

      update();


      addAutomationLog(
        `Humidity ${humidity}% → Bathroom Exhaust Fan ON`
      );


      toast(
        "Bathroom Exhaust Fan automatically turned ON"
      );

    }

  }

}


/* =========================
   DEVICE SCENES
========================= */

document
  .querySelectorAll(".scenes button")
  .forEach(button => {

    button.onclick = () => {

      const scene =
        button.dataset.scene;


      const switches =
        document.querySelectorAll(
          ".switch"
        );


      if (scene === "Good Morning") {

        switches.forEach(
          (x, index) => {

            if (index !== 1) {

              x.classList.add("on");

            }

          }
        );

      }


      else if (scene === "Movie Time") {

        switches.forEach(
          x =>
            x.classList.remove("on")
        );


        switches[1]
          .classList.add("on");

      }


      else {

        switches.forEach(
          x =>
            x.classList.remove("on")
        );

      }


      update();


      activity.unshift([
        "⚙️",
        scene,
        "Scene activated"
      ]);


      activity =
        activity.slice(0, 8);


      render();


      toast(
        scene +
        " scene activated"
      );

    };

  });


/* =========================
   ROOM FILTER
========================= */

const roomButtons =
  document.querySelectorAll(
    ".room-card"
  );


const deviceCards =
  document.querySelectorAll(
    ".device"
  );


roomButtons.forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const room =
        button.dataset.room;


      roomButtons.forEach(
        x =>
          x.classList.remove(
            "active"
          )
      );


      button.classList.add(
        "active"
      );


      deviceCards.forEach(
        card => {

          const location =
            card.querySelector(
              "small"
            ).textContent
             .split(" · ")[0];


          card.style.display =
            (
              room === "All" ||
              location === room
            )
              ? "block"
              : "none";

        }
      );


      $("#roomHint").textContent =
        room === "All"
          ? "Showing devices from all rooms"
          : `Showing ${room} devices`;


      toast(
        room === "All"
          ? "Showing all rooms"
          : `${room} selected`
      );

    }
  );

});


/* =========================
   CLEAR ACTIVITY
========================= */

$("#clear").onclick = () => {

  activity = [];

  render();

  toast(
    "Activity history cleared"
  );

};


/* =========================
   DARK / LIGHT MODE
========================= */

$("#theme").onclick = () => {

  document.body.classList.toggle(
    "light"
  );


  $("#theme").textContent =
    document.body.classList.contains(
      "light"
    )
      ? "🌙"
      : "☀️";


  localStorage.theme =
    document.body.classList.contains(
      "light"
    )
      ? "light"
      : "dark";

};


if (
  localStorage.theme === "light"
) {

  $("body")
    .classList.add("light");


  $("#theme").textContent =
    "🌙";

}


/* =========================
   CLOCK
========================= */

function clock() {

  const now =
    new Date();


  $("#time").textContent =
    now.toLocaleTimeString(
      "en-IN"
    );


  $("#date").textContent =
    now.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

}


clock();

setInterval(
  clock,
  1000
);


/* =========================
   SIMULATED LIVE SENSORS
========================= */

setInterval(() => {

  const temperature =
    26 +
    Math.random() * 4;


  const humidity =
    58 +
    Math.random() * 15;


  const roundedTemp =
    temperature.toFixed(1);


  const roundedHumidity =
    Math.round(humidity);


  $("#temp").textContent =
    `${roundedTemp}°C`;


  $("#ct").textContent =
    `${roundedTemp}°`;


  $("#hum").textContent =
    `${roundedHumidity}%`;


  $("#tempBarValue").textContent =
    `${roundedTemp}°C`;


  $("#humBarValue").textContent =
    `${roundedHumidity}%`;


  $("#tempBar").style.width =
    `${Math.min(100, temperature * 2.5)}%`;


  $("#humBar").style.width =
    `${roundedHumidity}%`;


  runTemperatureAutomation(
    temperature
  );


  runHumidityAutomation(
    roundedHumidity
  );

}, 5000);
