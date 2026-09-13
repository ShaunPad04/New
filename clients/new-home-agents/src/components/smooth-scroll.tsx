"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Type-only: erased at build, so the library still arrives by dynamic import.
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll (Lenis), the house standard for this kind of site. It eases
 * the wheel rather than jumping a fixed number of pixels per notch, which is
 * what makes a scroll-scrubbed film read as a camera move instead of a
 * flick-book.
 *
 * Three things matter here:
 *
 * - It is loaded after paint and only on a pointer device that has not asked
 *   for reduced motion. Under `prefers-reduced-motion` the browser's own
 *   scrolling is left alone, and on touch Lenis is left off so the platform's
 *   native momentum (which people know by feel) is not second-guessed.
 * - ScrollTrigger is updated from Lenis's own scroll event and Lenis is
 *   driven from the GSAP ticker, so there is exactly one rAF loop and the
 *   hero's scrub cannot drift a frame behind the page.
 * - Everything is torn down on unmount, ticker callback included.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    let cancelled = false;

    import("lenis").then(({ default: LenisClass }) => {
      if (cancelled) return;
      const instance = new LenisClass({ lerp: 0.09, wheelMultiplier: 0.9 });
      lenis = instance;
      instance.on("scroll", ScrollTrigger.update);
      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
    };
  }, []);

  return null;
}
