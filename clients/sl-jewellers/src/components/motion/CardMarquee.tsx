"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A row of cards drifting steadily across the screen, looping without a seam: the set is
 * drawn twice and the track moves by exactly one set. The second set is `inert`, so it is
 * never focused or read out twice. It pauses on hover and keyboard focus, off screen, in a
 * hidden tab (body.paused, from MotionRoot) and with its pause button (WCAG 2.2.2: it runs
 * longer than five seconds). Under reduced motion it stands still and scrolls sideways.
 */
export default function CardMarquee({ children, count, label, secondsPerCard = 7 }: { children: ReactNode; count: number; label: string; secondsPerCard?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="cm-wrap">
      <div ref={ref} className={`cm${paused ? " is-paused" : ""}`} role="region" aria-label={label}>
        <div className="cm-track" style={{ ["--dur" as string]: `${count * secondsPerCard}s` }}>
          <div className="cm-set">{children}</div>
          <div className="cm-set" inert aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
      <button type="button" className="cm-toggle" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          {paused ? <path d="M5 3.5v9l7-4.5-7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
        </svg>
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
