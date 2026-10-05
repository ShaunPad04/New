"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Slow vertical parallax on an image frame. The inner layer is scaled 1.12
 * in CSS so the edges never show; it translates by up to ±`strength` px as the
 * frame crosses the viewport. One rAF per scroll event, only while on screen,
 * transform only, off under reduced motion (CSS pins it).
 */
export default function Parallax({ children, strength = 36, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const f = frame.current, el = inner.current;
    if (!f || !el) return;
    // Off under reduced motion, and on phones: a transform written on every scroll event
    // for every image frame is exactly the kind of work that makes a phone's scroll feel
    // heavy, and the drift is too small to read on a 6-inch screen anyway. The hero's own
    // scroll journey is separate and does run on phones.
    if (matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches) return;
    let on = false, queued = false;
    const update = () => {
      queued = false;
      const r = f.getBoundingClientRect();
      const vh = innerHeight || 1;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5 across the viewport
      const y = Math.max(-1, Math.min(1, p * 2)) * -strength;
      el.style.transform = `scale(1.12) translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!on || queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on) update();
    }, { rootMargin: "10% 0px" });
    io.observe(f);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [strength]);

  return (
    <div ref={frame} className={`parallax ${className}`}>
      <div ref={inner} className="parallax-inner">
        {children}
      </div>
    </div>
  );
}
