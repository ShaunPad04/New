"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { ICONS } from "@/components/SocialLinks";

export type Reel = { id: string; src: string; poster: string; title: string; duration: number; /** true when the clip keeps its soundtrack: shows the sound button */ audio?: boolean };

/**
 * The shop's reels as a 3D carousel (Shaun's pick, round 4 of the walk-through, 6 Oct 2026;
 * after the Framer "VideoCarousel" he linked, rebuilt without the Framer runtime). Portrait
 * cards on an arc: the front one plays, muted and looping, while the section is on screen;
 * the rest lean away, shrink and blur. The cards follow a finger or the mouse when dragged
 * and settle on release; dots, the arrow keys and a tap on a side card move it too. No
 * arrow buttons (Shaun: "we don't need them"); a swipe moves exactly one card and the cards
 * only lean after the finger, never fly. Pause and, on clips with a soundtrack, sound sit
 * on the front card. Under it, centred: the dots, then a link to the shop's Instagram. Only the front
 * card mounts a <video>, so the page never downloads more than one clip at a time.
 * Reduced motion: no autoplay, no blur, the cards slide flat.
 */
export default function ReelsCarousel({ reels, instagram }: { reels: Reel[]; instagram: { url: string; handle: string } }) {
  const n = reels.length;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const drag = useRef<{ x: number; y: number; id: number; dx: number; moved: boolean; t: number } | null>(null);
  const suppressClick = useRef(false);

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

  // Drag: the cards follow the pointer (--dx), then settle on the nearest card. The stage
  // has touch-action: pan-y, so a vertical swipe still scrolls the page.
  const setDx = (dx: number) => stage.current?.style.setProperty("--dx", `${dx}px`);
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, dx: 0, moved: false, t: performance.now() };
  };
  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dx = e.clientX - d.x;
    if (!d.moved && Math.abs(d.dx) > 6 && Math.abs(d.dx) > Math.abs(e.clientY - d.y)) {
      d.moved = true;
      setDragging(true);
      stage.current?.setPointerCapture?.(e.pointerId);
    }
    // The cards lag the finger and stop short of the next card, so a swipe reads as a nudge, not a throw.
    if (d.moved) {
      const card = stage.current?.querySelector<HTMLElement>(".vc-card.is-front");
      const max = (card?.offsetWidth ?? 280) * 0.42;
      setDx(Math.max(-max, Math.min(max, d.dx * 0.45)));
    }
  };
  const end = (e: PointerEvent, cancelled = false) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    suppressClick.current = true;
    setDragging(false);
    setDx(0);
    if (cancelled) return;
    // One card per swipe, whatever its length or speed.
    const fast = Math.abs(d.dx) / Math.max(1, performance.now() - d.t) > 0.4;
    if (Math.abs(d.dx) > 36 || (fast && Math.abs(d.dx) > 14)) go(active + (d.dx < 0 ? 1 : -1));
  };
  const onClickCapture = (e: MouseEvent) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const cur = reels[active];
  const half = Math.floor(n / 2);

  return (
    <div className="vc" ref={root}>
      <div
        ref={stage}
        className={`vc-stage${dragging ? " is-drag" : ""}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="S&L's reels. Swipe, or use the arrow keys"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={(e) => end(e)}
        onPointerCancel={(e) => end(e, true)}
        onClickCapture={onClickCapture}
      >
        {reels.map((r, i) => {
          let rel = i - active;
          if (rel > half) rel -= n;
          if (rel < -half) rel += n;
          const abs = Math.abs(rel);
          const front = rel === 0;
          const poster = r.poster.replace(/\.jpg$/, ".webp");
          return (
            <div
              key={r.id}
              className={`vc-card${front ? " is-front" : ""}${abs > 2 ? " is-far" : ""}`}
              style={{ "--rel": rel, "--abs": abs } as CSSProperties}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}: ${r.title}`}
              aria-hidden={!front}
              onClick={front ? undefined : () => go(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster} alt="" className="vc-poster" loading="lazy" decoding="async" draggable={false} />
              {front && (
                <>
                  <video ref={video} key={r.id} src={r.src} poster={poster} className="vc-video" muted={muted} playsInline loop preload="metadata" aria-label={r.title} />
                  <div className="vc-tools">
                    {cur.audio && (
                      <button type="button" className="vc-tool" onClick={() => setMuted((m) => !m)} aria-pressed={!muted} aria-label={muted ? "Turn the sound on" : "Turn the sound off"}>
                        {muted ? (
                          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" /><path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        ) : (
                          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
                        )}
                      </button>
                    )}
                    <button type="button" className="vc-tool" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? "Play the reel" : "Pause the reel"}>
                      {paused ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" /></svg>
                      )}
                    </button>
                  </div>
                </>
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
            <button key={r.id} type="button" className={`vc-dot${i === active ? " is-on" : ""}`} aria-label={`Reel ${i + 1} of ${n}: ${r.title}`} aria-current={i === active ? "true" : undefined} onClick={() => go(i)} />
          ))}
        </div>
        <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="vc-ig" aria-label={`S&L Jewellers on Instagram, @${instagram.handle}`}>
          <span className="vc-ig-icon">{ICONS.instagram}</span>
          <span className="vc-ig-word">Instagram</span>
        </a>
      </div>
    </div>
  );
}
