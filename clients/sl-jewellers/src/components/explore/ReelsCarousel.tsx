"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Reel } from "@/components/ReelPlayer";

/**
 * Socials A (round 4 of Shaun's walk-through): the Framer "VideoCarousel" Shaun linked
 * (framer.com/m/VideoCarousel-3ACghD.js), rebuilt without the Framer runtime. Portrait
 * cards on a 3D arc: the one in front plays, muted and looping, while the section is on
 * screen; the rest lean away, shrink and blur. Arrows, dots, a counter, swipe, the arrow
 * keys and a click on a side card all move it; a sound button shows on clips that keep
 * their soundtrack, and a pause button stops it. Only the front card mounts a <video>, so
 * the page never downloads more than one clip at a time. Reduced motion: no autoplay, no
 * blur, the cards slide flat.
 */
export default function ReelsCarousel({ reels }: { reels: Reel[] }) {
  const n = reels.length;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const drag = useRef<{ x: number; id: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  useEffect(() => {
    if (reduced) setPaused(true);
  }, [reduced]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play the front card only while the section is on screen and not paused.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = muted;
    if (inView && !paused) v.play().catch(() => setPaused(true));
    else v.pause();
  }, [active, inView, paused, muted]);

  const go = useCallback((i: number) => setActive(((i % n) + n) % n), [n]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(active + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(active - 1); }
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, id: e.pointerId };
  };
  const onUp = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  };

  const cur = reels[active];
  const half = Math.floor(n / 2);

  return (
    <div className="vc" ref={root}>
      <div
        className="vc-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="S&L's reels"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (drag.current = null)}
      >
        {reels.map((r, i) => {
          let rel = i - active;
          if (rel > half) rel -= n;
          if (rel < -half) rel += n;
          const abs = Math.abs(rel);
          const front = rel === 0;
          const style = { "--rel": rel, "--abs": abs } as CSSProperties;
          return (
            <div
              key={r.id}
              className={`vc-card${front ? " is-front" : ""}${abs > 2 ? " is-far" : ""}`}
              style={style}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${r.title}`}
              aria-hidden={!front}
              onClick={front ? undefined : () => go(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.poster.replace(/\.jpg$/, ".webp")} alt="" className="vc-poster" loading="lazy" decoding="async" draggable={false} />
              {front && (
                <video
                  ref={video}
                  key={r.id}
                  src={r.src}
                  poster={r.poster.replace(/\.jpg$/, ".webp")}
                  className="vc-video"
                  muted={muted}
                  playsInline
                  loop
                  preload="metadata"
                  aria-label={r.title}
                />
              )}
              <span className="vc-cap" aria-hidden={!front}>
                <span>{r.title}</span>
                <span className="tnum">{`${Math.floor(r.duration / 60)}:${String(r.duration % 60).padStart(2, "0")}`}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="vc-bar">
        <div className="vc-dots" role="group" aria-label="Choose a reel">
          {reels.map((r, i) => (
            <button key={r.id} type="button" className={`vc-dot${i === active ? " is-on" : ""}`} aria-label={`Reel ${i + 1}: ${r.title}`} aria-current={i === active ? "true" : undefined} onClick={() => go(i)} />
          ))}
        </div>
        <div className="vc-ctrl">
          <span className="vc-count tnum" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          {cur.audio && (
            <button type="button" className="vc-btn" onClick={() => setMuted((m) => !m)} aria-pressed={!muted} aria-label={muted ? "Turn the sound on" : "Turn the sound off"}>
              {muted ? (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" /><path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
              )}
            </button>
          )}
          <button type="button" className="vc-btn" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? "Play the reel" : "Pause the reel"}>
            {paused ? (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" /></svg>
            )}
          </button>
          <button type="button" className="vc-btn" onClick={() => go(active - 1)} aria-label="Previous reel">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="vc-btn" onClick={() => go(active + 1)} aria-label="Next reel">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
