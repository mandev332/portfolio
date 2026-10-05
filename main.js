/* ============================================================
   PORTFOLIO — main.js
   ============================================================ */

// ── CUSTOM CURSOR ──────────────────────────────────────────
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");

let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

if (dot && ring && window.matchMedia("(hover: hover)").matches) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  // Ring smooth follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effekt
  document
    .querySelectorAll("a, button, .project-card, .skill-card, .stat-item")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
}

// ── NAV SCROLL EFFECT ──────────────────────────────────────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 30);
});

// ── MOBILE MENU ────────────────────────────────────────────
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
  document.body.style.overflow = mobileMenu.classList.contains("open")
    ? "hidden"
    : "";
});

function closeMobile() {
  hamburger?.classList.remove("open");
  mobileMenu?.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("click", (e) => {
  if (
    mobileMenu?.classList.contains("open") &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobile();
  }
});

// ── SCROLL REVEAL ──────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add("revealed"), delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => observer.observe(el));
}

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCount(el, target, duration = 1600) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const val = parseInt(el.dataset.count);
        animateCount(el, val);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
}

// ── SKILL BARS ─────────────────────────────────────────────
function initSkillBars() {
  const bars = document.querySelectorAll(".sd-fill");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  bars.forEach((bar) => observer.observe(bar));
}

// ── PROJECT FILTER ─────────────────────────────────────────
function initFilter() {
  const btns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Active state
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter cards
      cards.forEach((card) => {
        const cat = card.dataset.cat;
        const show = filter === "all" || cat === filter;

        if (show) {
          card.style.display = "";
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.transition = "opacity 0.2s ease";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
}

// ── CONTACT FORM ───────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById("contactForm");
  const success = document.getElementById("cfSuccess");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = "Yuborilmoqda...";
    btn.disabled = true;
    const data = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("email").value.trim(),
      source: document.getElementById("message").value.trim(),
    };
    console.log(data);
    // Demo: 1.5s keyin success ko'rsat
    sendToSheet(data, function () {
      btn.classList.remove("loading");
      btn.textContent = "Yuborish";
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
      document.getElementById("formSuccess").style.display = "block";
      setTimeout(() => {
        document.getElementById("formSuccess").style.display = "none";
      }, 4000);
    });
    setTimeout(() => {
      btn.textContent = "Xabar yuborish";
      btn.disabled = false;
      form.reset();
      if (success) {
        success.style.display = "block";
        setTimeout(() => {
          success.style.display = "none";
        }, 4000);
      }
    }, 1500);
  });
}

function sendToSheet(data, callback) {
  // ── GOOGLE SHEETS ── (URL keyinroq qo'shiladi)

  fetch(
    `https://script.google.com/macros/s/AKfycbwZhzs0c4zjza8snKAtUkQioJcu7p2zZHZTzG_NUQeQ3xUUNIJQUroJUR1BbzIih6A/exec`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  )
    .then(() => callback())
    .catch(() => callback()); // <-- Google Apps Script URL shu yerga
  // <-- Google Apps Script URL shu yerga
}
// ── HERO PAGE-LOAD SEQUENCE ────────────────────────────────
function initHeroSequence() {
  const tag = document.querySelector(".hero-tag");
  const title = document.querySelector(".hero-title");
  const desc = document.querySelector(".hero-desc");
  const actions = document.querySelector(".hero-actions");
  const visual = document.querySelector(".hero-visual");

  if (!title) return;

  // Barchasi boshlang'ichda yashirin
  [tag, title, desc, actions].forEach((el) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  });
  if (visual) {
    visual.style.opacity = "0";
    visual.style.transform = "translateX(40px)";
    visual.style.transition =
      "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s";
  }

  // Ketma-ket chiqarish
  setTimeout(() => {
    [tag, title, desc, actions].forEach((el, i) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "none";
      }, i * 120);
    });
    if (visual) {
      visual.style.opacity = "1";
      visual.style.transform = "none";
    }
  }, 200);
}

// ── SMOOTH SCROLL ──────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMobile();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

// ── NAV ACTIVE on SCROLL ───────────────────────────────────
function initNavActive() {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a");
  if (!sections.length || !links.length) return;

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach((a) => {
      const href = a.getAttribute("href");
      a.style.color = href === `#${current}` ? "var(--light)" : "";
    });
  });
}

// ── TYPING EFFECT (hero title accent) ─────────────────────
function initTyping() {
  const el = document.querySelector(".hero-title-accent");
  if (!el) return;

  const words = ["tajriba", "qiymat", "natija"];
  let wi = 0,
    ci = 0,
    deleting = false;

  function type() {
    const word = words[wi];
    const current = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    el.textContent = current;

    if (!deleting && ci > word.length) {
      deleting = true;
      setTimeout(type, 1800);
    } else if (deleting && ci < 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      setTimeout(type, 300);
    } else {
      setTimeout(type, deleting ? 60 : 100);
    }
  }

  setTimeout(type, 1800);
}

// ── TILT EFFECT (project cards) ───────────────────────────
function initTilt() {
  document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
      card.style.transition = "transform 0.1s ease";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition = "transform 0.4s ease";
    });
  });
}

// ── INIT ALL ───────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initCounters();
  initSkillBars();
  initFilter();
  initContactForm();
  initHeroSequence();
  initSmoothScroll();
  initNavActive();
  initTyping();

  // Tilt faqat desktop da
  if (window.matchMedia("(hover: hover)").matches) {
    initTilt();
  }
});
