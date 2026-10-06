"use client";

import { useEffect, useRef, useState } from "react";
import type { Review } from "@/lib/content";

/** One review as a card for the marquee rows. */
const Card = ({ r }: { r: Review }) => (
  <figure className="rq-card">
    <blockquote>{r.text}</blockquote>
    <figcaption>
      <span>{r.name}</span>
      <span className="rq-src">
        {r.rating ? <span className="stars" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>{"★".repeat(r.rating)}</span> : <span>Recommends on</span>}{" "}
        {r.rating ? <span aria-hidden="true">{r.platform}</span> : r.platform}
      </span>
    </figcaption>
  </figure>
);

/**
 * Reviews C, "Two-row marquee" (round 3; 21st "Testimonials Marquee"): the reviews split over
 * two rows drifting in opposite directions, like the watch shop. One pause button stops both;
 * hover, focus, off screen and a hidden tab pause them too; reduced motion stands them still.
 */
export default function ReviewsMarqueeRows({ reviews }: { reviews: Review[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half)];
  return (
    <div className="cm-wrap">
      <div ref={ref} className={`rq${paused ? " is-paused" : ""}`} role="region" aria-label="Reviews">
        {rows.map((row, k) => (
          <div key={k} className="cm">
            <div className="cm-track" data-dir={k ? "right" : "left"} style={{ ["--dur" as string]: `${row.length * 9}s` }}>
              <div className="cm-set">
                {row.map((r) => (
                  <Card key={r.id} r={r} />
                ))}
              </div>
              <div className="cm-set" inert aria-hidden="true">
                {row.map((r) => (
                  <Card key={r.id} r={r} />
                ))}
              </div>
            </div>
          </div>
        ))}
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
