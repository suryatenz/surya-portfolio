import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export const reduced =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export let lenis = null;

export function startSmoothScroll() {
  if (reduced || lenis) return;
  lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
}

// Pause page scrolling while a dialog is open.
export function lockScroll(on) {
  if (lenis) (on ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = on ? "hidden" : "";
}

// Shared easing tokens so every transition has the same rhythm.
export const ease = { out: [0.22, 1, 0.36, 1], in: [0.4, 0, 1, 1] };
export const spring = { type: "spring", stiffness: 380, damping: 34 };

export { gsap, ScrollTrigger };
