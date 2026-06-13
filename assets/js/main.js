/* =====================================================
   Pete Russo — interactions
   ===================================================== */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scroll state ---------- */
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle("is-scrolled", y > 40);

    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (y / h) * 100 : 0;
      progress.style.width = pct + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", closeMenu)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll("[data-reveal]");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger siblings for a polished cascade
            const el = entry.target;
            const siblings = Array.from(el.parentElement.querySelectorAll("[data-reveal]"));
            const idx = siblings.indexOf(el);
            el.style.setProperty("--reveal-delay", Math.min(idx, 5) * 80 + "ms");
            el.classList.add("is-visible");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        el.textContent = (el.dataset.prefix || "") + el.dataset.count + (el.dataset.suffix || "");
      });
    } else {
      const cio = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((el) => cio.observe(el));
    }
  }

  /* ---------- Contact form (front-end only) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      status.className = "form__status";

      if (!name || !emailOk) {
        status.textContent = "Please add your name and a valid email.";
        status.classList.add("is-error");
        return;
      }

      // No backend wired yet — surface success + open a mailto fallback.
      status.textContent = "Thanks, " + name.split(" ")[0] + "! Opening your email client…";
      status.classList.add("is-success");

      const interest = form.interest.value.replace(/-/g, " ");
      const body = encodeURIComponent(
        (form.message.value.trim() || "Hi Pete,") +
          "\n\n— " + name + " (" + email + ")\nInterested in: " + interest
      );
      const subject = encodeURIComponent("Inquiry: " + interest);
      window.location.href =
        "mailto:prusso@retireaef.com?subject=" + subject + "&body=" + body;

      form.reset();
    });
  }
})();
