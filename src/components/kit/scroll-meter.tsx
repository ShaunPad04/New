"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, subscribe } from "@/lib/scroll-ticker";

/**
 * SCROLL METER — a hairline across the top of the viewport that fills as
 * the page is read. Quiet, precise, and it tells a long page's reader where
 * they are without a scrollbar.
 *
 * Driven by `transform: scaleX()` only, so it never triggers layout. Hidden
 * entirely under reduced motion rather than frozen at zero, because a
 * progress bar that does not move is a broken-looking element.
 */
export function ScrollMeter() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return subscribe(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    });
  }, []);
  return <div ref={ref} className="kit-meter" aria-hidden="true" />;
}
