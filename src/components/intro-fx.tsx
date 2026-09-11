"use client";

import { useEffect, useRef } from "react";

/**
 * INTRO PARALLAX DRIVER (redesign, 2026-09-11)
 *
 * Writes `--intro-p` (0→1 as the intro band scrolls off the top) onto the
 * nearest <section>, so the backdrop can fall behind the scroll at a slower
 * rate — the depth cue that separates a motion page from a picture with
 * text on it. rAF-throttled passive scroll listener, one property write per
 * frame, no React state. Under `prefers-reduced-motion` it never attaches
 * and the CSS fallback of 0 leaves the image still.
 *
 * The entrance choreography itself (zoom settle, word cascade) is pure CSS
 * in globals.css (`.intro-*`) and needs no JavaScript at all — this
 * component only owns the scroll-linked half.
 */
export function IntroFx() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = section.offsetHeight || 1;
        const p = Math.min(1, Math.max(0, window.scrollY / h));
        section.style.setProperty("--intro-p", p.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <span ref={ref} hidden />;
}
