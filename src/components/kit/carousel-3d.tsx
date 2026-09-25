"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/scroll-ticker";
import { useInViewTicker } from "./use-kit";

/**
 * CAROUSEL 3D — a coverflow that MOVES ITSELF.
 *
 * The first version only moved when you clicked, and Brad was right that a
 * 3D carousel you have to operate by hand wastes the effect (2026-09-25).
 * It now has two behaviours, chosen by the same gate the process ride uses:
 *
 *   SCRUB (desktop and tablet: >= 768px wide, >= 620px tall, motion
 *   allowed). The section pins with native `position: sticky` and scrolling
 *   the page carries you through the slides, one per ~70vh of scroll, then
 *   releases you. Scroll back up and it runs in reverse. Sticky, not a
 *   ScrollTrigger pin, for the reason CLAUDE.md records at length: a pin
 *   stores an absolute start that goes stale when the hero's pin inserts
 *   height above it, and the section slams. Sticky stores nothing.
 *
 *   AUTO (phones). This site does not scroll-jack on a phone — "a pin dies
 *   on mobile" — so here the track advances on its own every few seconds,
 *   and the reader can still swipe it. It stops the moment they touch it,
 *   while it is off screen, while the tab is hidden, and when they press
 *   pause. The pause control is not optional: moving content that runs
 *   longer than five seconds must be pausable (WCAG 2.2.2).
 *
 *   Neither, under reduced motion: a plain swipe carousel. The server
 *   render IS that plain carousel, so no-JS and pre-hydration readers get
 *   every slide.
 *
 * The 3D is identical in both: each frame every slide's distance from the
 * centre, in slide-widths, is written to `--d` / `--ad` and CSS turns it
 * into rotation, depth and fade.
 *
 * SEMANTICS: slides are `<div role="group">`, not `<ul>/<li>` — axe flags
 * the list version (CLAUDE.md carousel rule).
 */
type Mode = "static" | "scrub" | "auto";

/**
 * Off-centre slides are INERT while the coverflow is running. They are
 * faded and turned away, so their small captions fall below text contrast;
 * an inactive component is exempt from 1.4.3, and making them inert is what
 * makes them genuinely inactive rather than merely dim — no tab stop, no
 * click, out of the accessibility tree — until they rotate to the front.
 * The prev/next buttons (and the scroll, in scrub mode) bring each one
 * there. Static mode never calls this, so no-JS and reduced-motion readers
 * get every slide live.
 */
function setInactive(el: HTMLElement, inactive: boolean) {
  if (el.inert !== inactive) el.inert = inactive;
}

const AUTO_MS = 4200;

export function Carousel3D({
  slides,
  label,
  className,
}: {
  slides: { key: string; node: ReactNode; label: string }[];
  label: string;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const index = useRef(0); // eased fractional index, scrub mode
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [paused, setPaused] = useState(false);
  const n = slides.length;

  /* Pick the behaviour once on mount, and again if the viewport crosses the
     gate (rotating a tablet, resizing a window). */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 620px)");
    const pick = () => setMode(mq.matches ? "scrub" : "auto");
    pick();
    mq.addEventListener("change", pick);
    return () => mq.removeEventListener("change", pick);
  }, []);

  /* One frame loop for both modes. */
  useInViewTicker(root, (el, { vh }) => {
    const t = track.current;
    if (!t) return;
    const slidesEls = Array.from(t.children) as HTMLElement[];

    if (el.dataset.mode === "scrub") {
      // Progress through the pinned run: 0 when the pane pins, 1 as it frees.
      const r = el.getBoundingClientRect();
      const run = r.height - vh;
      const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      const target = p * (n - 1);
      // A light ease on top of Lenis, so slides glide rather than step.
      index.current += (target - index.current) * 0.2;
      const w = slidesEls[0]?.offsetWidth ?? 1;
      t.style.transform = `translate3d(${(-index.current * w).toFixed(2)}px,0,0)`;
      slidesEls.forEach((s, i) => {
        const d = Math.max(-3, Math.min(3, i - index.current));
        s.style.setProperty("--d", d.toFixed(3));
        s.style.setProperty("--ad", Math.abs(d).toFixed(3));
        setInactive(s, Math.abs(d) > 0.5);
      });
      return;
    }

    // Native track (auto and static): distance from the scrolled centre.
    const mid = t.scrollLeft + t.clientWidth / 2;
    slidesEls.forEach((s) => {
      const w = s.offsetWidth || 1;
      const d = Math.max(-3, Math.min(3, (s.offsetLeft + w / 2 - mid) / w));
      s.style.setProperty("--d", d.toFixed(3));
      s.style.setProperty("--ad", Math.abs(d).toFixed(3));
      // Auto only: static (reduced motion) shows every slide unfaded.
      setInactive(s, el.dataset.mode === "auto" && Math.abs(d) > 0.5);
    });
  });

  /* AUTO: advance on a timer, looping back to the start. */
  useEffect(() => {
    if (mode !== "auto" || paused) return;
    const t = track.current;
    const el = root.current;
    if (!t || !el) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const id = window.setInterval(() => {
      if (!visible || document.hidden || drag.current) return;
      const w = (t.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
      const atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
      t.scrollTo({ left: atEnd ? 0 : t.scrollLeft + w, behavior: "smooth" });
    }, AUTO_MS);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [mode, paused]);

  /* Buttons. In scrub mode the page owns the position, so they move the
     PAGE by one slide's worth of scroll — through Lenis when it is running,
     because a bare window.scrollTo gets eased back by it. */
  const step = useCallback(
    (dir: 1 | -1) => {
      const el = root.current;
      const t = track.current;
      if (!el || !t) return;
      if (mode === "scrub") {
        const run = el.offsetHeight - window.innerHeight;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const cur = Math.round(index.current);
        const next = Math.max(0, Math.min(n - 1, cur + dir));
        const y = top + (n > 1 ? (next / (n - 1)) * run : 0);
        const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
        if (lenis) lenis.scrollTo(y);
        else window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }
      setPaused(true); // pressing a control is a request to take over
      const w = (t.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
      t.scrollBy({ left: dir * w, behavior: "smooth" });
    },
    [mode, n],
  );

  /* Mouse drag on the native track. Touch already scrolls it natively. */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (mode === "scrub") return;
    if (e.pointerType !== "mouse") {
      setPaused(true); // a finger on it means the reader has taken over
      return;
    }
    if (!track.current) return;
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
      ref={root}
      data-mode={mode}
      className={cn("kit-carousel", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      /* The scrub run: one viewport to pin in, then ~70vh per slide. */
      style={mode === "scrub" ? { height: `calc(100vh + ${(n - 1) * 70}vh)` } : undefined}
    >
      <div className="kit-carousel-pane">
        <div
          ref={track}
          className="kit-carousel-track"
          tabIndex={mode === "scrub" ? -1 : 0}
          data-lenis-prevent-wheel={mode === "scrub" ? undefined : true}
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
              aria-label={`${i + 1} of ${n}: ${s.label}`}
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
          {mode === "auto" ? (
            <button
              type="button"
              className="kit-carousel-btn"
              onClick={() => setPaused((v) => !v)}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={paused}
            >
              {paused ? (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
              )}
            </button>
          ) : null}
          <button type="button" className="kit-carousel-btn" onClick={() => step(1)} aria-label="Next slide">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
