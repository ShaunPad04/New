"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Review } from "@/lib/content";

/**
 * Reviews A, "Spotlight" (round 3; after the Framer testimonial sliders Shaun pointed to, and
 * 21st "Carousel Testimonials" with progress): one review at a time, large, with a gold
 * opening mark, who wrote it and where; a segmented progress line that fills as each one
 * plays; previous / next, a counter and a pause button. Auto-advances every 7 s, pauses on
 * hover and keyboard focus, and never moves on its own under reduced motion.
 */
const STEP = 7000;

export default function ReviewsSpotlight({ reviews }: { reviews: Review[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [reduce, setReduce] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const n = reviews.length;
  const go = useCallback((d: number) => setI((x) => (x + d + n) % n), [n]);

  useEffect(() => setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  useEffect(() => {
    if (paused || hold || reduce) return;
    const t = setTimeout(() => go(1), STEP);
    return () => clearTimeout(t);
  }, [i, paused, hold, reduce, go]);

  const r = reviews[i];
  const running = !paused && !hold && !reduce;
  return (
    <div
      ref={root}
      className="rs"
      onPointerEnter={() => setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && setHold(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Reviews"
    >
      <figure className="rs-quote" key={r.id} aria-live={running ? "off" : "polite"}>
        <svg className="rs-mark" viewBox="0 0 48 36" aria-hidden="true">
          <path d="M0 36V22C0 9 7 2 20 0l2 5c-7 2-10 6-10 12h9v19H0Zm26 0V22C26 9 33 2 46 0l2 5c-7 2-10 6-10 12h9v19H26Z" fill="currentColor" />
        </svg>
        <blockquote>{r.text}</blockquote>
        <figcaption>
          <span className="rs-name">{r.name}</span>
          <span className="rs-src">
            {r.rating ? (
              <span className="stars" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>
                {"★".repeat(r.rating)}
              </span>
            ) : (
              <span>Recommends on</span>
            )}{" "}
            {r.rating ? <span aria-hidden="true">{r.platform}</span> : r.platform}
          </span>
        </figcaption>
      </figure>
      <div className="rs-bar">
        <div className="rs-segs" aria-hidden="true">
          {reviews.map((x, k) => (
            <span key={x.id} className={k < i ? "is-done" : k === i ? (running ? "is-run" : "is-done") : ""} style={k === i ? { animationDuration: `${STEP}ms` } : undefined} />
          ))}
        </div>
        <div className="rs-ctrl">
          <span className="rs-count tnum" aria-live="polite">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <button type="button" className="xbtn" onClick={() => go(-1)} aria-label="Previous review">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="xbtn" onClick={() => go(1)} aria-label="Next review">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {!reduce && (
            <button type="button" className="xbtn" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? "Play the reviews" : "Pause the reviews"}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                {paused ? <path d="M5 3.5v9l7-4.5-7-4.5Z" fill="currentColor" /> : <path d="M5 3.5v9M11 3.5v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
