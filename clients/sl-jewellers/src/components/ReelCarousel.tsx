"use client";

import { useEffect, useRef, useState } from "react";

export type Reel = { id: string; src: string; poster: string; title: string; duration: number };

/**
 * The shop's reels in a scroll-snap rail. Videos ship with preload="none" and
 * only load when the visitor presses play (or, on a mouse, hovers), so the
 * page never downloads five MP4s for nothing. One plays at a time, muted,
 * looping, and stops when it leaves the screen. Reduced motion: still
 * tap-to-play, no hover autoplay.
 */
export default function ReelCarousel({ reels }: { reels: Reel[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const videos = useRef<Map<string, HTMLVideoElement>>(new Map());
  const [playing, setPlaying] = useState<string | null>(null);
  // On a mouse, hovering previews a reel; a click "pins" it so it keeps
  // playing after the pointer leaves. On touch, tapping toggles.
  const pinned = useRef<string | null>(null);

  const stopAll = () => {
    videos.current.forEach((v) => v.pause());
    pinned.current = null;
    setPlaying(null);
  };

  const start = (id: string) => {
    const v = videos.current.get(id);
    if (!v) return;
    videos.current.forEach((other, k) => k !== id && other.pause());
    v.play()
      .then(() => setPlaying(id))
      .catch(() => setPlaying(null));
  };
  const stop = (id: string) => {
    videos.current.get(id)?.pause();
    setPlaying((p) => (p === id ? null : p));
  };
  const toggle = (id: string) => {
    if (pinned.current === id) {
      pinned.current = null;
      stop(id);
      return;
    }
    pinned.current = id;
    start(id);
  };
  const hoverIn = (id: string) => {
    if (pinned.current) return;
    start(id);
  };
  const hoverOut = (id: string) => {
    if (pinned.current === id) return;
    stop(id);
  };

  // Pause whatever is playing once it scrolls out of view.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) stopAll();
    });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".reel");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 250) + 14), behavior: "smooth" });
  };

  const hoverAutoplay = typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="-mx-[var(--gutter)]">
      <div ref={rail} className="reels" role="region" aria-label="Reels from the shop" tabIndex={0}>
        {reels.map((r) => {
          const on = playing === r.id;
          return (
            <div
              key={r.id}
              className={`reel ${on ? "is-playing" : ""}`}
              onPointerEnter={hoverAutoplay ? () => hoverIn(r.id) : undefined}
              onPointerLeave={hoverAutoplay ? () => hoverOut(r.id) : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.poster} alt="" width={540} height={960} loading="lazy" decoding="async" />
              <video
                ref={(v) => {
                  if (v) videos.current.set(r.id, v);
                  else videos.current.delete(r.id);
                }}
                src={r.src}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
              />
              <button type="button" className="reel-btn" onClick={() => toggle(r.id)} aria-pressed={on} aria-label={`${on ? "Pause" : "Play"} reel: ${r.title}`}>
                <span className="reel-title">{r.title}</span>
                <span className="reel-play" aria-hidden="true">
                  {on ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="2" width="3.5" height="10" /><rect x="8.5" y="2" width="3.5" height="10" /></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5z" /></svg>
                  )}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="reel-nav mt-3 px-[var(--gutter)]">
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Previous reel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="Next reel">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  );
}
