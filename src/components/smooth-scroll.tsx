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
    let lenis: {
      raf: (t: number) => void;
      resize: () => void;
      destroy: () => void;
    } | null = null;
    let cancelled = false;
    let observer: ResizeObserver | undefined;

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

      /**
       * Re-measure whenever the document changes height.
       *
       * This is not defensive tidiness — without it the page could not be
       * scrolled to the bottom. Lenis caches the scroll limit when it starts.
       * ScrollTrigger then pins the hero and inserts a pin-spacer worth 320vh,
       * which makes the document taller AFTER that measurement was taken.
       * Lenis went on clamping to the old limit, so scrolling died partway
       * down the page — measured at exactly 2880px short on a 900px viewport,
       * which is precisely 320vh.
       *
       * A ResizeObserver on the body catches the pin-spacer being inserted,
       * every later ScrollTrigger refresh, and any lazy content that changes
       * the page height — none of which fire a resize event on window.
       */
      observer = new ResizeObserver(() => instance.resize());
      observer.observe(document.body);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      lenis?.destroy();
    };
  }, []);

  return null;
}
