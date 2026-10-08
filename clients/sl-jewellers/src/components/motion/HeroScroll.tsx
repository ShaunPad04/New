"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The hand-off from the hero film to the statement under it, "Sheet" (Shaun's pick B of
 * three, 8 Oct 2026, over A Into the frame and C Loupe): the film stays put while the
 * statement slides up over it like a sheet with rounded top corners, the film sinking back
 * and darkening underneath. Writes --hp, 0 when the statement's top is at the foot of the
 * screen and 1 when it reaches the top; the CSS is the block "Hero hand-off" in globals.css.
 * Under reduced motion none of this runs and the hero is the still, scrolling away as before.
 * The header turns to glass when the statement's top reaches it ([data-hero-edge], read by
 * MotionRoot).
 */
export default function HeroScroll({ hero, next }: { hero: ReactNode; next: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const after = el.querySelector<HTMLElement>(".hs-next");
    if (!after) return;
    let raf = 0;
    const frame = () => {
      raf = 0;
      const p = 1 - after.getBoundingClientRect().top / innerHeight;
      el.style.setProperty("--hp", Math.min(1, Math.max(0, p)).toFixed(4));
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
      {hero}
      <div data-hero-edge aria-hidden="true" />
      <div className="hs-next">{next}</div>
    </div>
  );
}
