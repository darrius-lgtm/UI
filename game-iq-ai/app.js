/* Game IQ AI — shared prototype behavior */
(function () {
  "use strict";

  /* ---------- Theme ---------- */

  var saved = localStorage.getItem("giq-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  function bindThemeToggle() {
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    toggles.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("giq-theme", next);
      });
    });
  }

  /* ---------- Segmented controls / tab panels ---------- */

  function bindSegments() {
    document.querySelectorAll("[data-segment]").forEach(function (seg) {
      var group = seg.getAttribute("data-segment");
      seg.querySelectorAll("button").forEach(function (btn) {
        btn.addEventListener("click", function () {
          seg
            .querySelectorAll("button")
            .forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          var target = btn.getAttribute("data-panel");
          document
            .querySelectorAll('[data-panel-group="' + group + '"]')
            .forEach(function (panel) {
              panel.classList.toggle("is-active", panel.id === target);
            });
        });
      });
    });
  }

  /* ---------- Animated rating bars ---------- */

  function animateRatings() {
    var fills = document.querySelectorAll(".rating-fill[data-score]");
    if (!fills.length) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var score = parseFloat(el.getAttribute("data-score"));
          var max = parseFloat(el.getAttribute("data-max") || "10");
          el.style.width = (score / max) * 100 + "%";
          observer.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    fills.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Score rings ---------- */

  function animateRings() {
    document.querySelectorAll(".score-ring[data-score]").forEach(function (ring) {
      var meter = ring.querySelector(".meter");
      if (!meter) return;
      var score = parseFloat(ring.getAttribute("data-score"));
      var max = parseFloat(ring.getAttribute("data-max") || "100");
      var r = parseFloat(meter.getAttribute("r"));
      var circumference = 2 * Math.PI * r;
      meter.style.strokeDasharray = circumference;
      meter.style.strokeDashoffset = circumference;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          meter.style.strokeDashoffset =
            circumference * (1 - score / max);
        });
      });
    });
  }

  /* ---------- Choice chips (onboarding) ---------- */

  function bindChoices() {
    document.querySelectorAll("[data-choice-group]").forEach(function (group) {
      var multi = group.hasAttribute("data-multi");
      group.querySelectorAll(".choice").forEach(function (chip) {
        chip.addEventListener("click", function () {
          if (!multi) {
            group
              .querySelectorAll(".choice")
              .forEach(function (c) { c.classList.remove("is-selected"); });
            chip.classList.add("is-selected");
          } else {
            chip.classList.toggle("is-selected");
          }
        });
      });
    });
  }

  /* ---------- Onboarding step flow ---------- */

  function bindSteps() {
    var steps = document.querySelectorAll("[data-step]");
    if (!steps.length) return;

    function show(n) {
      steps.forEach(function (s) {
        s.classList.toggle("hidden", s.getAttribute("data-step") !== String(n));
      });
      document.querySelectorAll(".stepper span").forEach(function (bar, i) {
        bar.classList.toggle("is-done", i < n);
      });
      window.scrollTo({ top: 0 });
    }

    document.querySelectorAll("[data-next-step]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        show(parseInt(btn.getAttribute("data-next-step"), 10));
      });
    });

    show(1);
  }

  /* ---------- Upload simulation ---------- */

  function bindUpload() {
    var startBtns = document.querySelectorAll("[data-start-analysis]");
    if (!startBtns.length) return;

    var inputCard = document.getElementById("upload-input");
    var runCard = document.getElementById("upload-running");
    var fill = document.getElementById("upload-progress");
    var pct = document.getElementById("upload-pct");
    var stepEls = runCard
      ? Array.prototype.slice.call(runCard.querySelectorAll(".analyze-steps li"))
      : [];

    var dropzone = document.getElementById("dropzone");
    var fileInput = document.getElementById("file-input");
    var dropLabel = document.getElementById("drop-label");
    if (dropzone && fileInput) {
      dropzone.addEventListener("click", function (e) {
        if (e.target !== fileInput) fileInput.click();
      });
      fileInput.addEventListener("change", function () {
        if (fileInput.files.length) {
          dropzone.classList.add("is-armed");
          dropLabel.textContent = fileInput.files[0].name;
        }
      });
    }

    startBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (inputCard) inputCard.classList.add("hidden");
        if (runCard) runCard.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
        run();
      });
    });

    function run() {
      var stages = [
        { at: 14, step: 0 },
        { at: 36, step: 1 },
        { at: 58, step: 2 },
        { at: 80, step: 3 },
        { at: 100, step: 4 }
      ];
      var progress = 0;
      var timer = setInterval(function () {
        progress = Math.min(100, progress + 2 + Math.random() * 3);
        if (fill) fill.style.width = progress + "%";
        if (pct) pct.textContent = Math.floor(progress) + "%";
        stages.forEach(function (s, i) {
          if (progress >= s.at && stepEls[i]) {
            stepEls[i].classList.add("is-done");
            stepEls[i].classList.remove("is-active");
            if (stepEls[i + 1]) stepEls[i + 1].classList.add("is-active");
          }
        });
        if (progress >= 100) {
          clearInterval(timer);
          setTimeout(function () {
            window.location.href = "analysis.html";
          }, 700);
        }
      }, 180);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindThemeToggle();
    bindSegments();
    bindChoices();
    bindSteps();
    bindUpload();
    animateRatings();
    animateRings();
  });
})();
