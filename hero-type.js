(function () {
  "use strict";

  var lines = [
    "Когда внутри тяжело — не обязательно справляться с этим в одиночку",
    "Бережное пространство: без давления, без оценки, в вашем темпе",
    "Первая встреча — спокойное знакомство с форматом работы",
  ];

  var typingSpeed = 75;
  var pauseDuration = 2200;
  var deletingSpeed = 45;
  var initialDelay = 400;
  var loop = true;
  var startOnVisible = true;

  var root = document.querySelector(".hero-type");
  if (!root) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("hero-type--static-only");
    return;
  }

  var fallback = root.querySelector(".hero-type__fallback");
  var liveWrap = root.querySelector(".hero-type__live");
  var textEl = root.querySelector(".hero-type__text");
  if (!liveWrap || !textEl) return;

  var idxLine = 0;
  var idxChar = 0;
  var deleting = false;
  var started = false;
  var timer = null;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function tick() {
    var line = lines[idxLine] || "";

    if (deleting) {
      if (textEl.textContent.length === 0) {
        deleting = false;
        if (!loop && idxLine === lines.length - 1) return;
        idxLine = (idxLine + 1) % lines.length;
        idxChar = 0;
        timer = setTimeout(tick, pauseDuration);
      } else {
        textEl.textContent = textEl.textContent.slice(0, -1);
        timer = setTimeout(tick, deletingSpeed);
      }
      return;
    }

    if (idxChar < line.length) {
      textEl.textContent += line.charAt(idxChar);
      idxChar += 1;
      timer = setTimeout(tick, typingSpeed);
    } else {
      timer = setTimeout(function () {
        deleting = true;
        tick();
      }, pauseDuration);
    }
  }

  function start() {
    if (started) return;
    started = true;
    if (fallback) fallback.setAttribute("hidden", "");
    liveWrap.removeAttribute("hidden");
    root.classList.add("hero-type--animating");
    idxLine = 0;
    idxChar = 0;
    deleting = false;
    textEl.textContent = "";
    timer = setTimeout(tick, initialDelay);
  }

  function onVisible() {
    start();
  }

  if (fallback) fallback.removeAttribute("hidden");
  liveWrap.setAttribute("hidden", "");

  if (startOnVisible && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            io.disconnect();
            onVisible();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(root);
  } else {
    start();
  }

  window.addEventListener("beforeunload", clear);
})();
