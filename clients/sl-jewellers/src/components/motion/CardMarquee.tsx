"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A row of cards drifting steadily across the screen, looping without a seam: the set is
 * drawn twice and the track moves by exactly one set. The second set is `inert`, so it is
 * never focused or read out twice. It pauses on hover and keyboard focus, off screen, in a
 * hidden tab (body.paused, from MotionRoot) and with its pause button (WCAG 2.2.2: it runs
 * longer than five seconds). Under reduced motion it stands still and scrolls sideways.
 *
 * It can also be dragged (Shaun, 13 Oct 2026: "you should be able to also drag it if you like
 * rather than it being a carousel that you cannot slide yourself, obviously keep it moving as a
 * carousel too"): a mouse or a finger pulls the row along, it glides on a little when let go,
 * then the drift picks up again from wherever it was left. The first paint is the CSS
 * animation; once this has mounted it reads the row's position off that and drives the
 * transform itself, so the hand-over does not jump. A drag is never a click.
 */
export default function CardMarquee({ children, count, label, secondsPerCard = 7 }: { children: ReactNode; count: number; label: string; secondsPerCard?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const el = ref.current;
    const tr = track.current;
    if (!el || !tr) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // CSS: still, scrolls by hand

    let off = false; // out of the viewport
    let hover = false;
    let focus = false;
    const io = new IntersectionObserver(([e]) => { off = !e.isIntersecting; el.classList.toggle("is-off", off); });
    io.observe(el);

    // the width of one set, plus the gap to the next: what the loop wraps by
    const setWidth = () => {
      const first = tr.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(tr).gap) || 16;
      return first ? first.offsetWidth + gap : 0;
    };
    // pick the drift up where the CSS animation has got to, then take over
    let x = 0;
    {
      const m = new DOMMatrixReadOnly(getComputedStyle(tr).transform);
      x = Number.isFinite(m.m41) ? m.m41 : 0;
    }
    tr.style.animation = "none";
    const speed = () => setWidth() / Math.max(1, count * secondsPerCard); // px per second

    let dragging = false;
    let moved = false;
    let pointerId = -1;
    let x0 = 0, y0 = 0, xAtDown = 0, lastX = 0, lastT = 0, vel = 0, glide = 0;

    let raf = 0;
    let prev = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      const w = setWidth();
      if (!w) return;
      if (!dragging) {
        if (Math.abs(glide) > 2) {
          x += glide * dt;
          glide *= Math.pow(0.08, dt); // settles in about a second
        } else {
          glide = 0;
          const drift = !pausedRef.current && !off && !hover && !focus && !document.body.classList.contains("paused");
          if (drift) x -= speed() * dt;
        }
      }
      // wrap within one set, so the loop has no seam either way
      if (x <= -w) x += w;
      else if (x > 0) x -= w;
      tr.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    raf = requestAnimationFrame(frame);

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button")) return;
      pointerId = e.pointerId;
      moved = false;
      x0 = lastX = e.clientX; y0 = e.clientY; xAtDown = x; lastT = e.timeStamp; vel = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - x0;
      if (!moved) {
        // a sideways pull is a drag; a vertical one is the page scrolling (touch-action: pan-y)
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - y0)) return;
        moved = true;
        dragging = true;
        glide = 0;
        el.classList.add("is-drag");
        el.setPointerCapture?.(e.pointerId);
      }
      x = xAtDown + dx;
      const dt = Math.max(1, e.timeStamp - lastT);
      vel = ((e.clientX - lastX) / dt) * 1000; // px per second
      lastX = e.clientX; lastT = e.timeStamp;
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = -1;
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-drag");
      glide = Math.max(-2400, Math.min(2400, vel));
    };
    // the click that ends a drag must not open the card under the pointer
    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };
    // a card is a link, and a browser would otherwise start dragging the link itself
    const onDragStart = (e: Event) => e.preventDefault();
    const onEnter = () => { hover = matchMedia("(hover: hover)").matches; };
    const onLeave = () => { hover = false; };
    const onFocusIn = () => { focus = true; };
    const onFocusOut = () => { focus = el.contains(document.activeElement); };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [count, secondsPerCard]);

  return (
    <div className="cm-wrap">
      <div ref={ref} className={`cm${paused ? " is-paused" : ""}`} role="region" aria-label={label}>
        <div ref={track} className="cm-track" style={{ ["--dur" as string]: `${count * secondsPerCard}s` }}>
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
