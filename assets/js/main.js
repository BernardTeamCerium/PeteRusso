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
    const endpoint = form.getAttribute("action") || "";
    const isConfigured = endpoint && !/YOUR_FORM_ID/.test(endpoint);

    const setStatus = (msg, kind) => {
      status.className = "form__status" + (kind ? " is-" + kind : "");
      status.textContent = msg;
    };

    // Fallback path when no form service is wired up yet: open the email client.
    const mailtoFallback = (name, email) => {
      const interest = form.interest.value.replace(/-/g, " ");
      const body = encodeURIComponent(
        (form.message.value.trim() || "Hi Pete,") +
          "\n\n— " + name + " (" + email + ")\nInterested in: " + interest
      );
      const subject = encodeURIComponent("Inquiry: " + interest);
      window.location.href =
        "mailto:prusso@retireaef.com?subject=" + subject + "&body=" + body;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk) {
        setStatus("Please add your name and a valid email.", "error");
        return;
      }

      if (!isConfigured) {
        setStatus("Thanks, " + name.split(" ")[0] + "! Opening your email client…", "success");
        mailtoFallback(name, email);
        form.reset();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      setStatus("Sending…", "");

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });

        if (res.ok) {
          setStatus("Thanks, " + name.split(" ")[0] + "! Your message is on its way.", "success");
          form.reset();
        } else {
          throw new Error("Bad response");
        }
      } catch (err) {
        // Network/service failure — don't lose the lead, fall back to email.
        setStatus("Couldn't reach the server — opening your email client instead…", "error");
        mailtoFallback(name, email);
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      }
    });
  }
})();

/* =====================================================
   Pete Russo — interactive enhancements
   ===================================================== */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const raf = window.requestAnimationFrame.bind(window);

  /* ---------- Cursor spotlight ---------- */
  (function cursorGlow() {
    const glow = document.getElementById("cursorGlow");
    if (!glow || reduce || !finePointer) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, active = false, ticking = false;

    const render = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      glow.style.setProperty("--cgx", cx + "px");
      glow.style.setProperty("--cgy", cy + "px");
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) raf(render);
      else ticking = false;
    };
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.classList.add("is-active"); }
      if (!ticking) { ticking = true; raf(render); }
    }, { passive: true });
    document.addEventListener("pointerleave", () => {
      glow.classList.remove("is-active"); active = false;
    });
  })();

  /* ---------- Magnetic buttons ---------- */
  if (!reduce && finePointer) {
    document.querySelectorAll(".btn--primary, .nav__cta").forEach((el) => {
      const strength = 0.3;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + mx * strength + "px, " + my * strength + "px)";
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (!reduce && finePointer) {
    document.querySelectorAll("[data-tilt]").forEach((el) => {
      const max = parseFloat(el.dataset.tiltMax || "8");
      let rafId = null;
      el.addEventListener("pointerenter", () => el.classList.add("is-tilting"));
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = raf(() => {
          el.style.transform =
            "perspective(900px) rotateY(" + px * max + "deg) rotateX(" +
            (-py * max) + "deg) translateY(-4px)";
        });
      });
      el.addEventListener("pointerleave", () => {
        el.classList.remove("is-tilting");
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = "";
      });
    });
  }

  /* ---------- Hero mouse parallax ---------- */
  if (!reduce && finePointer) {
    const hero = document.getElementById("hero");
    const g1 = document.querySelector(".hero__glow--1");
    const g2 = document.querySelector(".hero__glow--2");
    if (hero && g1 && g2) {
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        g1.style.transform = "translate(" + x * 40 + "px, " + y * 40 + "px)";
        g2.style.transform = "translate(" + x * -30 + "px, " + y * -30 + "px)";
      });
      hero.addEventListener("pointerleave", () => {
        g1.style.transform = ""; g2.style.transform = "";
      });
    }
  }

  /* ---------- Scrollspy nav highlight ---------- */
  (function scrollspy() {
    const links = Array.from(document.querySelectorAll('.nav__links a[href^="#"]'));
    const map = new Map();
    links.forEach((a) => {
      const sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) map.set(sec, a);
    });
    if (!map.size || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          const a = map.get(entry.target);
          if (a) a.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    map.forEach((_, sec) => io.observe(sec));
  })();

  /* ---------- Back to top ---------- */
  (function backToTop() {
    const btn = document.getElementById("toTop");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("is-visible", window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  })();

  /* ---------- Testimonials carousel ---------- */
  (function carousel() {
    const root = document.querySelector("[data-carousel]");
    const track = document.getElementById("voicesTrack");
    const dotsWrap = document.getElementById("voicesDots");
    if (!root || !track) return;
    const slides = Array.from(track.children);
    if (slides.length < 2) return;

    const prev = root.querySelector(".voices__nav--prev");
    const next = root.querySelector(".voices__nav--next");
    let index = 0;
    let timer = null;
    const AUTO = 6000;

    const dots = dotsWrap
      ? slides.map((_, i) => {
          const d = document.createElement("button");
          d.className = "voices__dot";
          d.type = "button";
          d.setAttribute("role", "tab");
          d.setAttribute("aria-label", "Show testimonial " + (i + 1));
          d.addEventListener("click", () => { go(i); restart(); });
          dotsWrap.appendChild(d);
          return d;
        })
      : [];

    const update = () => {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach((d, i) => {
        const on = i === index;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-selected", on ? "true" : "false");
      });
      slides.forEach((sl, i) => sl.setAttribute("aria-hidden", i === index ? "false" : "true"));
    };
    const go = (i) => { index = (i + slides.length) % slides.length; update(); };
    const nextS = () => go(index + 1);
    const prevS = () => go(index - 1);

    const start = () => { if (!reduce && !timer) timer = setInterval(nextS, AUTO); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const restart = () => { stop(); start(); };

    if (next) next.addEventListener("click", () => { nextS(); restart(); });
    if (prev) prev.addEventListener("click", () => { prevS(); restart(); });

    root.addEventListener("pointerenter", stop);
    root.addEventListener("pointerleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { nextS(); restart(); }
      else if (e.key === "ArrowLeft") { prevS(); restart(); }
    });

    // swipe / drag
    let down = false, startX = 0, dx = 0;
    track.addEventListener("pointerdown", (e) => { down = true; startX = e.clientX; dx = 0; stop(); });
    window.addEventListener("pointermove", (e) => { if (down) dx = e.clientX - startX; });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (Math.abs(dx) > 50) { dx < 0 ? nextS() : prevS(); }
      start();
    });

    // pause when scrolled out of view
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((ents) => {
        ents.forEach((en) => (en.isIntersecting ? start() : stop()));
      }, { threshold: 0.2 }).observe(root);
    }

    update();
    start();
  })();
})();
