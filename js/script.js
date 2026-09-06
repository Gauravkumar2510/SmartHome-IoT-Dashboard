const $ = s => document.querySelector(s);

let activity = [
  ["💡", "Living Room Light", "ON"],
  ["🌀", "Bedroom Fan", "ON"],
  ["❄️", "Smart AC", "24°C"],
  ["🔌", "Smart Plug", "ON"]
];


function render() {

  const a = $("#activity");

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


function update() {

  const n =
    document.querySelectorAll(".switch.on").length;

  $("#count").textContent = `${n} / 9`;

  $("#active").textContent = `${n} active`;

}


update();


/* DEVICE SWITCHES */

document.querySelectorAll(".switch").forEach(s => {

  s.onclick = () => {

    s.classList.toggle("on");

    const d =
      s.closest(".device");

    const st =
      s.classList.contains("on")
        ? "ON"
        : "OFF";

    activity.unshift([
      "⚙️",
      d.dataset.name,
      st
    ]);

    activity =
      activity.slice(0, 6);

    render();

    update();

    toast(
      `${d.dataset.name} turned ${st}`
    );

  };

});


/* AUTOMATION SCENES */

document
  .querySelectorAll(".scenes button")
  .forEach(b => {

    b.onclick = () => {

      const n =
        b.dataset.scene;

      const switches =
        document.querySelectorAll(".switch");


      if (n === "Good Morning") {

        /*
          Morning mode:
          Everything ON except Smart TV
        */

        switches.forEach((x, i) => {

          if (i !== 1) {
            x.classList.add("on");
          }

        });

      }


      else if (n === "Movie Time") {

        /*
          Movie mode:
          Only Smart TV ON
        */

        switches.forEach(x =>
          x.classList.remove("on")
        );

        switches[1].classList.add("on");

      }


      else {

        /*
          Away Mode / Good Night:
          Everything OFF
        */

        switches.forEach(x =>
          x.classList.remove("on")
        );

      }


      update();


      activity.unshift([
        "⚙️",
        n,
        "Scene activated"
      ]);


      activity =
        activity.slice(0, 6);

      render();


      toast(
        n + " scene activated"
      );

    };

  });


/* CLEAR ACTIVITY */

$("#clear").onclick = () => {

  activity = [];

  render();

  toast(
    "Activity history cleared"
  );

};


/* TOAST */

function toast(t) {

  const x = $("#toast");

  x.textContent = t;

  x.classList.add("show");

  setTimeout(
    () => x.classList.remove("show"),
    2000
  );

}


/* DARK / LIGHT MODE */

$("#theme").onclick = () => {

  document.body.classList.toggle("light");

  $("#theme").textContent =
    document.body.classList.contains("light")
      ? "🌙"
      : "☀️";

  localStorage.theme =
    document.body.classList.contains("light")
      ? "light"
      : "dark";

};


if (localStorage.theme === "light") {

  $("body").classList.add("light");

  $("#theme").textContent = "🌙";

}


/* CLOCK */

function clock() {

  const n = new Date();

  $("#time").textContent =
    n.toLocaleTimeString("en-IN");

  $("#date").textContent =
    n.toLocaleDateString(
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


/* SIMULATED SENSOR DATA */

setInterval(() => {

  const t =
    26 +
    Math.floor(
      Math.random() * 4
    );

  const h =
    58 +
    Math.floor(
      Math.random() * 8
    );


  $("#temp").textContent =
    t + "°C";

  $("#ct").textContent =
    t + "°";

  $("#hum").textContent =
    h + "%";

}, 5000);


/* ROOM FILTER */

const roomButtons =
  document.querySelectorAll(".room-card");

const deviceCards =
  document.querySelectorAll(".device");


roomButtons.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      const room =
        btn.dataset.room;


      roomButtons.forEach(x =>
        x.classList.remove("active")
      );


      btn.classList.add("active");


      deviceCards.forEach(card => {

        const small =
          card.querySelector("small");

        const cardRoom =
          small.textContent
            .split(" · ")[0];


        card.style.display =
          (
            room === "All" ||
            cardRoom === room
          )
            ? "block"
            : "none";

      });


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
