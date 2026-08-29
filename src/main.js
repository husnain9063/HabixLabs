import "./style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Mobile menu ---------- */
const menuBtn = document.getElementById("menu-btn");
const menuClose = document.getElementById("menu-close");
const mobileMenu = document.getElementById("mobile-menu");

function openMenu() {
  mobileMenu.style.transform = "translateY(0)";
  mobileMenu.setAttribute("aria-hidden", "false");
  menuBtn?.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  mobileMenu.style.transform = "translateY(-100%)";
  mobileMenu.setAttribute("aria-hidden", "true");
  menuBtn?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
menuBtn?.addEventListener("click", openMenu);
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
