"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion, subscribe, type TickerFrame } from "@/lib/scroll-ticker";

/**
 * Run `onFrame` every animation frame, but ONLY while `ref` is within
 * `margin` of the viewport and the reader has not asked for reduced motion.
 *
 * The IntersectionObserver is what keeps an off-screen component from
 * costing a frame budget; the reduced-motion check is what keeps every kit
 * component safe by default — a component built on this hook cannot animate
 * for someone who asked it not to, even if its author forgets.
 */
export function useInViewTicker(
  ref: RefObject<HTMLElement | null>,
  onFrame: (el: HTMLElement, frame: TickerFrame) => void,
  margin = "25%",
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let unsubscribe: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !unsubscribe) {
          unsubscribe = subscribe((frame) => onFrame(el, frame));
        } else if (!entry.isIntersecting && unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      },
      { rootMargin: `${margin} 0px ${margin} 0px` },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      unsubscribe?.();
    };
    // `onFrame` is deliberately excluded: callers pass a stable closure over
    // refs, and re-subscribing on every render would restart the loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, margin]);
}

/**
 * Write the element's progress through the viewport to `--p` on it:
 * 0 as its top enters the bottom edge, 1 as its bottom leaves the top edge.
 *
 * Written as a CSS variable, never React state, so a scroll frame costs one
 * style write and zero re-renders — the same contract `--hero-progress`
 * already runs on. Rounded to four places and skipped when unchanged, so a
 * stationary page writes nothing at all.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  useInViewTicker(ref, (el, { vh }) => {
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
    const next = p.toFixed(4);
    if (el.style.getPropertyValue("--p") !== next) el.style.setProperty("--p", next);
  });
}
