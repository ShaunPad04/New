"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The hand-off from the hero film to the statement under it, scroll-linked, three ways while
 * Shaun picks (?v=hero:a|b|c, 8 Oct 2026: "should the hero be scroll craft? ... a different
 * transition to the next section"). One hero and one film in all three: the switch only
 * changes the CSS (html[data-x-hero], block "Hero hand-off" in globals.css), so the film is
 * never loaded twice.
 *   A  Into the frame: the film holds while you scroll and closes into a framed picture on
 *      black, the corner type fading, then the page carries on.
 *   B  Sheet: the film stays put and the statement slides up over it like a sheet, the film
 *      sinking back and darkening underneath.
 *   C  Loupe: the film narrows to a round lens over the rings, as under a jeweller's loupe,
 *      zooming in as it closes, then the page carries on.
 * Writes --hp (0 to 1) and, for C, --hr (the lens radius in px). Under reduced motion none of
 * this runs and the hero is the still, as before. The header turns to glass when the
 * statement's top reaches it ([data-hero-edge], read by MotionRoot).
 */
export default function HeroScroll({ hero, next }: { hero: ReactNode; next: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = el.querySelector<HTMLElement>(".hs-track");
    const after = el.querySelector<HTMLElement>(".hs-next");
    if (!track || !after) return;
    let raf = 0;
    const frame = () => {
      raf = 0;
      const mode = document.documentElement.getAttribute("data-x-hero") || "a";
      const vh = innerHeight;
      let p: number;
      if (mode === "b") p = 1 - after.getBoundingClientRect().top / vh;
      else {
        const r = track.getBoundingClientRect();
        p = -r.top / Math.max(1, r.height - vh);
      }
      p = Math.min(1, Math.max(0, p));
      el.style.setProperty("--hp", p.toFixed(4));
      if (mode === "c") {
        // circle() radius in px: from past the corners down to a lens about a third of the height
        const w = innerWidth;
        const far = Math.hypot(w, vh) * 0.56;
        const lens = Math.min(w * 0.36, vh * 0.27);
        const e = 1 - (1 - p) * (1 - p);
        el.style.setProperty("--hr", `${(far + (lens - far) * e).toFixed(1)}px`);
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="hs">
      <div className="hs-track">
        {hero}
        <span className="hs-ring" aria-hidden="true" />
      </div>
      <div data-hero-edge aria-hidden="true" />
      <div className="hs-next">{next}</div>
    </div>
  );
}
