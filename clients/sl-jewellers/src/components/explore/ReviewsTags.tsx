"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Review } from "@/lib/content";
import { Source, num, size } from "./reviews-shared";

const STEP = 6500;
// A slightly different lean for every tag, so the pile looks handled, not stacked by a machine.
const LEAN = [-2.4, 1.8, -1.2, 2.6, -2.9, 1.1, -0.6, 2.2, -1.8, 0.8, -2.2, 1.5, -1, 2.8];

/**
 * Reviews B, "Swing tags" (6 Oct 2026): every review printed on an ivory jeweller's swing
 * tag, eyelet and gold thread, the S&L mark at its foot. The tags lie in a loose pile; drag
 * or flick the top one away (or tap it) and it goes to the back of the pile. The arrow keys
 * do the same when the pile has focus. It turns over by itself every 6.5 s while on screen,
 * pausing on hover and focus. Reduced motion: no throw and no auto-turn; tags swap in place.
 */
export default function ReviewsTags({ reviews }: { reviews: Review[] }) {
  const n = reviews.length;
  const [top, setTop] = useState(0);
  const [thrown, setThrown] = useState<{ id: string; dir: number } | null>(null);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; id: number; dx: number; dy: number; t: number; moved: boolean } | null>(null);

  useEffect(() => setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Throw the top tag (dir 1 = right, -1 = left); it lands at the back once it has left.
  const throwTop = useCallback(
    (dir: number) => {
      if (thrown) return;
      if (reduce) return setTop((t) => (t + 1) % n);
      setThrown({ id: reviews[top].id, dir });
      setTimeout(() => {
        setTop((t) => (t + 1) % n);
        setThrown(null);
      }, 420);
    },
    [thrown, reduce, n, reviews, top],
  );
  const back = useCallback(() => !thrown && setTop((t) => (t - 1 + n) % n), [thrown, n]);

  const running = inView && !hold && !reduce && !dragging;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => throwTop(1), STEP);
    return () => clearTimeout(t);
  }, [top, running, throwTop]);

  const setDrag = (dx: number, dy: number) => {
    front.current?.style.setProperty("--dx", String(Math.round(dx)));
    front.current?.style.setProperty("--dy", String(Math.round(dy)));
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, dx: 0, dy: 0, t: performance.now(), moved: false };
  };
  const onMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dx = e.clientX - d.x;
    d.dy = e.clientY - d.y;
    if (!d.moved && Math.abs(d.dx) > 6 && Math.abs(d.dx) > Math.abs(d.dy)) {
      d.moved = true;
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    if (d.moved) setDrag(d.dx, d.dy * 0.35);
  };
  const onUp = (e: PointerEvent, cancelled = false) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) {
      if (!cancelled) throwTop(1); // a tap turns the tag over
      return;
    }
    setDragging(false);
    const fast = Math.abs(d.dx) / Math.max(1, performance.now() - d.t) > 0.5;
    if (!cancelled && (Math.abs(d.dx) > 90 || (fast && Math.abs(d.dx) > 30))) {
      throwTop(d.dx > 0 ? 1 : -1);
      // the throw carries on from where the finger let go
      requestAnimationFrame(() => setDrag(0, 0));
    } else setDrag(0, 0);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); throwTop(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); back(); }
  };

  return (
    <div
      ref={root}
      className="rt"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
      onPointerLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !root.current?.contains(e.relatedTarget as Node) && setHold(false)}
    >
      <div
        className={`rt-pile${dragging ? " is-drag" : ""}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Reviews on S&L's swing tags. Tap or swipe the top tag, or use the arrow keys"
        tabIndex={0}
        onKeyDown={onKey}
      >
        {reviews.map((r, i) => {
          const k = (i - top + n) % n; // 0 = the top of the pile
          const isThrown = thrown?.id === r.id;
          const isTop = k === 0;
          return (
            <div
              key={r.id}
              ref={isTop ? front : undefined}
              className={`rt-tag${isTop ? " is-top" : ""}${k > 3 ? " is-deep" : ""}${isThrown ? " is-thrown" : ""}`}
              style={{ "--k": Math.min(k, 4), "--z": n - k, "--lean": `${LEAN[i % LEAN.length]}deg`, "--dir": thrown?.dir ?? 1 } as CSSProperties}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={!isTop}
              onPointerDown={isTop ? onDown : undefined}
              onPointerMove={isTop ? onMove : undefined}
              onPointerUp={isTop ? (e) => onUp(e) : undefined}
              onPointerCancel={isTop ? (e) => onUp(e, true) : undefined}
            >
              <svg className="rt-cord" viewBox="0 0 60 90" aria-hidden="true">
                <path d="M30 88 C 12 70, 10 42, 24 20 C 27 15, 33 15, 36 20 C 50 42, 48 70, 30 88" fill="none" stroke="url(#rt-thread)" strokeWidth="1.6" />
                <path d="M30 17 L 23 5 M30 17 L 36 4" fill="none" stroke="url(#rt-thread)" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="30" cy="17" r="2.6" fill="#c9ad74" />
              </svg>
              <figure className="rt-paper">
                <span className="rt-eyelet" aria-hidden="true" />
                <p className="rt-top">
                  <span className="tnum" aria-hidden="true">No. {num(i)}</span>
                  <Source r={r} className="rt-src" />
                </p>
                <blockquote className="rt-quote" data-size={size(r.text)}>{r.text}</blockquote>
                <figcaption className="rt-foot">
                  <span className="rt-name">{r.name}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo-mark.svg" alt="" width="22" height="22" className="rt-mark" />
                </figcaption>
              </figure>
            </div>
          );
        })}
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="rt-thread" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f1dfae" />
              <stop offset="0.5" stopColor="#c9ad74" />
              <stop offset="1" stopColor="#8a6d38" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <p className="rt-hint" aria-live="polite">
        <span className="tnum">{num(top)} / {num(n - 1)}</span>
        <span aria-hidden="true">Swipe the tag</span>
      </p>
    </div>
  );
}
