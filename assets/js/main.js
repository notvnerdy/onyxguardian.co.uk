(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach(function (item, index) {
      if (item.hasAttribute("data-stagger")) {
        item.style.transitionDelay = String(index * 60) + "ms";
      }
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("in-view");
    });
  }

  var counters = document.querySelectorAll(".count-up");
  if (counters.length) {
    var prefersReducedMotion =
      "matchMedia" in window && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var renderCounter = function (el, value) {
      el.textContent = String(value);
    };

    var runCounter = function (el) {
      var target = Number(el.getAttribute("data-target"));
      if (!Number.isFinite(target)) {
        return;
      }

      if (prefersReducedMotion) {
        renderCounter(el, target);
        return;
      }

      var startTime = null;
      var duration = Math.min(1900, Math.max(900, target * 12));

      var tick = function (timestamp) {
        if (!startTime) {
          startTime = timestamp;
        }
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        renderCounter(el, Math.round(target * eased));

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };

      window.requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              runCounter(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    } else {
      counters.forEach(function (counter) {
        runCounter(counter);
      });
    }
  }

  document.querySelectorAll(".js-inline-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var success = form.parentElement.querySelector(".success-msg");
      if (success) {
        success.classList.add("show");
      }
      form.reset();
    });
  });
})();
