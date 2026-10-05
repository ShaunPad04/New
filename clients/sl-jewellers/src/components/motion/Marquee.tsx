"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A CSS-driven marquee. Children are rendered once for assistive technology
 * and once more aria-hidden so the track can translate a clean -50% and loop.
 * Pauses when off screen (IntersectionObserver), on hover/focus (CSS), on a
 * hidden tab (body.paused, set by MotionRoot) and via the optional button.
 * Under reduced motion the CSS wraps it into a static grid.
 */
export default function Marquee({
  children,
  duration = 60,
  direction = "left",
  gap = 32,
  className = "",
  label,
  controls = false,
}: {
  children: ReactNode;
  duration?: number;
  direction?: "left" | "right";
  gap?: number;
  className?: string;
  label?: string;
  controls?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting), { rootMargin: "0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`marquee-wrap ${className}`}>
      <div ref={ref} className={`marquee ${paused ? "is-paused" : ""}`} role={label ? "region" : undefined} aria-label={label}>
        <div className="marquee-track" data-dir={direction} style={{ ["--dur" as string]: `${duration}s`, ["--gap" as string]: `${gap}px` }}>
          {children}
          <span aria-hidden="true" className="contents">
            {children}
          </span>
        </div>
      </div>
      {controls && (
        <div className="wrap mt-5">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
            {paused ? "Play" : "Pause"} the wall
          </button>
        </div>
      )}
    </div>
  );
}
