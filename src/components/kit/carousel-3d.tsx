"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInViewTicker } from "./use-kit";

/**
 * CAROUSEL 3D — a coverflow built on a NATIVE scroll-snap track.
 *
 * The movement is the browser's own horizontal scroll, which is why touch,
 * trackpad, keyboard and momentum all behave exactly as a reader expects —
 * nothing is simulated. The 3D is layered on top: every frame each slide's
 * distance from the centre (in slide-widths) is written to `--d` and `--ad`,
 * and CSS turns that into rotation, depth and fade. The centred slide faces
 * you flat; its neighbours swing away on the Y axis and recede.
 *
 * `--ad` (absolute distance) is computed here rather than with CSS `abs()`,
 * which is still too new to rely on across the browsers this site supports.
 *
 * SEMANTICS: slides are `<div role="group">`, NOT `<ul>/<li>` — axe flags
 * the list version inside a scroll container (CLAUDE.md, carousel rule).
 * The track is focusable, so arrow keys scroll it natively, and the two
 * buttons move exactly one slide.
 *
 * Under reduced motion the ticker never runs, `--d` is never written, every
 * transform resolves to none, and it is a plain snap carousel.
 */
export function Carousel3D({
  slides,
  label,
  className,
}: {
  slides: { key: string; node: ReactNode; label: string }[];
  /** Accessible name for the carousel region. */
  label: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  useInViewTicker(track, (el) => {
    const mid = el.scrollLeft + el.clientWidth / 2;
    for (const child of Array.from(el.children) as HTMLElement[]) {
      const w = child.offsetWidth || 1;
      const d = (child.offsetLeft + w / 2 - mid) / w;
      const clamped = Math.max(-3, Math.min(3, d));
      child.style.setProperty("--d", clamped.toFixed(3));
      child.style.setProperty("--ad", Math.abs(clamped).toFixed(3));
    }
  });

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    el.scrollBy({ left: dir * first.offsetWidth, behavior: "smooth" });
  }, []);

  /* Mouse drag for desktop. Touch and trackpads already scroll the track
     natively, so this only engages for a real mouse. Snap is suspended while
     dragging so the track follows the hand, then restored so it settles. */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft };
    track.current.style.scrollSnapType = "none";
    track.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !track.current) return;
    track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    if (!drag.current || !track.current) return;
    drag.current = null;
    track.current.style.scrollSnapType = "";
  };

  return (
    <div
      className={cn("kit-carousel", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={track}
        className="kit-carousel-track"
        tabIndex={0}
        data-lenis-prevent-wheel
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {slides.map((s, i) => (
          <div
            key={s.key}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.label}`}
            className="kit-carousel-slide"
          >
            <div className="kit-carousel-face">{s.node}</div>
          </div>
        ))}
      </div>
      <div className="kit-carousel-controls">
        <button type="button" className="kit-carousel-btn" onClick={() => step(-1)} aria-label="Previous slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" className="kit-carousel-btn" onClick={() => step(1)} aria-label="Next slide">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
