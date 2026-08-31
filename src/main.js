import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShaderMount,
  liquidMetalFragmentShader,
  LiquidMetalShapes,
  getShaderColorFromString,
  defaultObjectSizing,
  ShaderFitOptions,
} from "@paper-design/shaders";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Preloader: circular progress ---------- */
const preloader = document.getElementById("preloader");
const ring = document.getElementById("progress-ring");
const progressText = document.getElementById("progress-text");
const CIRCUMFERENCE = 276.5;

let progress = 0;
const progressTimer = setInterval(() => {
  progress = Math.min(100, progress + Math.random() * 9 + 3);
  if (ring) ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress / 100));
  if (progressText) progressText.textContent = Math.round(progress) + "%";
  if (progress >= 100) clearInterval(progressTimer);
}, 110);

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader?.classList.add("is-hidden");
    setTimeout(() => {
      preloader?.remove();
      clearInterval(progressTimer);
    }, 500);
  }, 1300);
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById("menu-btn");
const menuClose = document.getElementById("menu-close");
const mobileMenu = document.getElementById("mobile-menu");

function openMenu() {
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuBtn?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuBtn?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
menuBtn?.addEventListener("click", () => {
  mobileMenu.classList.contains("is-open") ? closeMenu() : openMenu();
});
menuClose?.addEventListener("click", closeMenu);
document.querySelectorAll("[data-menu-link]").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* ---------- Hero headline word reveal ---------- */
const heroWords = gsap.utils.toArray("[data-word]");
if (heroWords.length) {
  gsap.set(heroWords, { opacity: 0, y: 24 });
  gsap.to(heroWords, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.045,
    delay: 0.15,
  });
}

/* ---------- Liquid metal hero background ---------- */
const liquidMetalHost = document.getElementById("liquid-metal-bg");
if (liquidMetalHost) {
  // Adapted from @paper-design/shaders-react's "Backdrop" preset (full-bleed,
  // shape: none), retinted dark so it sits behind our existing light headline text.
  const liquidMetalParams = {
    ...defaultObjectSizing,
    fit: "cover",
    scale: 1,
    colorBack: "#0a0a0a",
    colorTint: "#55555c",
    softness: 0.35,
    repetition: 1.5,
    shiftRed: 0,
    shiftBlue: 0,
    distortion: 0.08,
    contour: 0.15,
    shape: "none",
    angle: 90,
    worldWidth: 0,
    worldHeight: 0,
  };
  new ShaderMount(
    liquidMetalHost,
    liquidMetalFragmentShader,
    {
      u_colorBack: getShaderColorFromString(liquidMetalParams.colorBack),
      u_colorTint: getShaderColorFromString(liquidMetalParams.colorTint),
      u_image: undefined,
      u_isImage: false,
      u_contour: liquidMetalParams.contour,
      u_distortion: liquidMetalParams.distortion,
      u_softness: liquidMetalParams.softness,
      u_repetition: liquidMetalParams.repetition,
      u_shiftRed: liquidMetalParams.shiftRed,
      u_shiftBlue: liquidMetalParams.shiftBlue,
      u_angle: liquidMetalParams.angle,
      u_shape: LiquidMetalShapes[liquidMetalParams.shape],
      u_fit: ShaderFitOptions[liquidMetalParams.fit],
      u_scale: liquidMetalParams.scale,
      u_rotation: liquidMetalParams.rotation,
      u_offsetX: liquidMetalParams.offsetX,
      u_offsetY: liquidMetalParams.offsetY,
      u_originX: liquidMetalParams.originX,
      u_originY: liquidMetalParams.originY,
      u_worldWidth: liquidMetalParams.worldWidth,
      u_worldHeight: liquidMetalParams.worldHeight,
    },
    undefined,
    prefersReducedMotion ? 0 : 1,
    0,
  );
}

/* ---------- Floating logo: travels down + rotates with scroll ---------- */
const scrollLogo = document.getElementById("scroll-logo");
if (scrollLogo && !prefersReducedMotion) {
  gsap.to(scrollLogo, {
    y: () => window.innerHeight - 180,
    rotation: 1080,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
}

/* ---------- Aurora hero: 3D tilt on scroll ---------- */
const auroraCard = document.getElementById("aurora-card");
if (auroraCard && !prefersReducedMotion) {
  gsap.set(auroraCard, { transformPerspective: 1600, transformOrigin: "50% 0%" });
  gsap.to(auroraCard, {
    rotationX: -10,
    scale: 0.94,
    y: 40,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero-perspective",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/* ---------- Generic scroll reveals ---------- */
gsap.utils.toArray("[data-reveal]").forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 88%",
      once: true,
    },
  });
});

gsap.utils.toArray(".reveal-child").forEach((group) => {
  const items = group.children;
  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.08,
    scrollTrigger: {
      trigger: group,
      start: "top 85%",
      once: true,
    },
  });
});

/* ---------- KPI counters ---------- */
gsap.utils.toArray("[data-count-to]").forEach((el) => {
  const target = Number(el.dataset.countTo);
  const counter = { val: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: "top 88%",
    once: true,
    onEnter: () => {
      gsap.to(counter, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(counter.val).toString();
        },
      });
    },
  });
});

/* ---------- Process: pinned horizontal scroll on desktop ---------- */
function initProcessPan() {
  const pan = document.getElementById("process-pan");
  const track = document.getElementById("process-track");
  if (!pan || !track) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    const distance = () => track.scrollWidth - pan.clientWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: pan,
        start: "top top",
        end: () => `+=${distance()}`,
        scrub: 0.6,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
    return () => tween.scrollTrigger?.kill();
  });
}
initProcessPan();

if (prefersReducedMotion) {
  gsap.set("[data-reveal], .reveal-child > *, [data-word]", { opacity: 1, y: 0 });
}

/* ---------- Contact modal ---------- */
// Sign up at https://web3forms.com with team@habixlabs.site to get a free
// Access Key, then paste it here. Submissions land straight in that inbox.
const WEB3FORMS_ACCESS_KEY = "f15ccde9-e449-42b1-9a4f-bf9fe7f982b6";

const modal = document.getElementById("contact-modal");
const modalPanel = document.getElementById("contact-panel");
const modalClose = document.getElementById("contact-close");
const modalOverlay = document.getElementById("contact-overlay");
const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("cf-submit");
const submitLabel = document.getElementById("cf-submit-label");
const statusEl = document.getElementById("cf-status");

let lastFocused = null;

function openModal(trigger) {
  lastFocused = trigger || document.activeElement;
  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100");
  modalPanel.classList.remove("scale-95");
  modalPanel.classList.add("scale-100");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => document.getElementById("cf-name")?.focus(), 150);
}

function closeModal() {
  modal.classList.add("opacity-0", "pointer-events-none");
  modal.classList.remove("opacity-100");
  modalPanel.classList.add("scale-95");
  modalPanel.classList.remove("scale-100");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocused?.focus();
}

document.querySelectorAll("[data-open-modal]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    openModal(el);
  });
});
modalClose?.addEventListener("click", closeModal);
modalOverlay?.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (contactForm.botcheck.value) return; // honeypot tripped, silently drop

  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
    statusEl.textContent = "Form isn't wired up yet — email team@habixlabs.site directly for now.";
    statusEl.style.color = "#f0a86b";
    return;
  }

  submitBtn.disabled = true;
  submitLabel.textContent = "Sending…";
  statusEl.textContent = "";

  const payload = Object.fromEntries(new FormData(contactForm).entries());
  payload.access_key = WEB3FORMS_ACCESS_KEY;

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      statusEl.textContent = "Thanks — we'll be in touch within one business day.";
      statusEl.style.color = "var(--color-accent)";
      contactForm.reset();
      window.setTimeout(closeModal, 1800);
    } else {
      throw new Error(data.message || "Submission failed");
    }
  } catch (err) {
    statusEl.textContent = "Something went wrong — email team@habixlabs.site directly.";
    statusEl.style.color = "#f0a86b";
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = "Send Message";
  }
});
