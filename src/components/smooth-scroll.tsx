"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling.
 *
 * Deliberately loaded dynamically and started after first paint: Lenis is
 * ~10kB and contributes nothing to LCP, so it has no business in the
 * critical path of a hero whose whole job is to render fast.
 *
 * Fully disabled under `prefers-reduced-motion` — smooth scroll hijacking is
 * a genuine vestibular trigger, and native scrolling is the correct fallback.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const instance = new Lenis({
        duration: 1.1,
        // Gentle expo-out. Heavier easing reads as lag rather than luxury.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.6,
      });
      lenis = instance;

      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
