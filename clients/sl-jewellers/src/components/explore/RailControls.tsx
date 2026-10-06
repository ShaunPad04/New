"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A horizontal scroll-snap rail with previous/next buttons and a progress line (shared by
 * the round 2 rail options). Native scrolling does the work: swipe on touch, Shift+wheel or
 * the buttons on desktop; the buttons scroll by one card. data-lenis-prevent stops the
 * smooth scroll from swallowing horizontal wheel moves.
 */
export default function RailControls({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ p: 0, start: true, end: false });
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const sync = () => {
      const max = el.scrollWidth - el.clientWidth;
      setState({ p: max > 0 ? el.scrollLeft / max : 1, start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      removeEventListener("resize", sync);
    };
  }, []);
  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-rail-item]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 16), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <div className={`xrail ${className}`}>
      <div className="xrail-nav">
        <button type="button" className="xrail-btn" onClick={() => go(-1)} disabled={state.start} aria-label={`Previous: ${label}`}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="xrail-btn" onClick={() => go(1)} disabled={state.end} aria-label={`Next: ${label}`}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div ref={track} className="xrail-track" data-lenis-prevent tabIndex={0} role="region" aria-label={label}>
        {children}
      </div>
      <div className="xrail-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(0.08, state.p)})` }} />
      </div>
    </div>
  );
}
