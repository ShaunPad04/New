"use client";

import { useEffect } from "react";

/**
 * Drives `--shine` (0 when a heading enters at the bottom of the viewport,
 * 1 when it leaves at the top) on every split heading that has gold words,
 * so the metallic sheen sweeps across them as the page scrolls, the hero's
 * included.
 * Nothing runs under reduced motion (the CSS holds a static sheen).
 */
export default function Shine() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const all = [...document.querySelectorAll<HTMLElement>(".split")].filter((el) => el.querySelector(".w.gold"));
    if (!all.length) return;

    const live = new Set<HTMLElement>();
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = innerHeight;
      live.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = 1 - (r.top + r.height) / (vh + r.height);
        el.style.setProperty("--shine", Math.min(1, Math.max(0, p)).toFixed(3));
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) live.add(el);
          else live.delete(el);
        });
        schedule();
      },
      { rootMargin: "10% 0px" },
    );
    all.forEach((el) => io.observe(el));
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    schedule();
    return () => {
      io.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
