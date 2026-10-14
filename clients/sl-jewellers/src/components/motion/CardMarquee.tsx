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
 * then the drift picks up again from wherever it was left. A drag is never a click.
 *
 * The drift is a CSS animation, so the browser runs it on the compositor and it costs no script
 * at all. Script runs only while the row is in hand: on a pull it reads where the animation had
 * got to, stops it and moves the row itself; when the glide settles it hands back to the CSS
 * animation, started at exactly that point (a negative delay). An earlier version drove the
 * drift from a frame loop that measured the row every frame, two rails at once on the home
 * page, which cost a throttled phone 1.4 s of main thread (14 Oct 2026).
 */
export default function CardMarquee({ children, count, label, secondsPerCard = 7 }: { children: ReactNode; count: number; label: string; secondsPerCard?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const dur = count * secondsPerCard;

  useEffect(() => {
    const el = ref.current;
    const tr = track.current;
    if (!el || !tr) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting));
    io.observe(el);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect(); // CSS: still, scrolls by hand

    // the distance the animation travels: one set plus the gap, which is also where the loop wraps
    let w = 0;
    const measure = () => {
      const first = tr.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(tr).gap) || 16;
      w = first ? first.offsetWidth + gap : 0;
    };
    const wrap = (v: number) => (w ? ((v % w) - w) % w : v); // into (-w, 0]

    let held = false; // the script owns the transform (a drag, then its glide)
    let dragging = false;
    let moved = false;
    let pointerId = -1;
    let x = 0, x0 = 0, y0 = 0, xAtDown = 0, lastX = 0, lastT = 0, vel = 0, glide = 0;
    let raf = 0;
    let prev = 0;

    const take = () => {
      if (held) return;
      measure();
      const m = new DOMMatrixReadOnly(getComputedStyle(tr).transform);
      x = wrap(Number.isFinite(m.m41) ? m.m41 : 0);
      tr.style.animation = "none";
      tr.style.transform = `translate3d(${x}px, 0, 0)`;
      held = true;
    };
    const release = () => {
      held = false;
      const p = w ? -wrap(x) / w : 0; // how far through one loop the row is, 0 to 1
      tr.style.transform = "";
      tr.style.animation = "none";
      void tr.offsetWidth; // restart, so the delay counts from now
      tr.style.animation = "";
      tr.style.animationDelay = `${(-p * dur).toFixed(3)}s`;
    };
    const glideFrame = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      x = wrap(x + glide * dt);
      glide *= Math.pow(0.08, dt); // settles in about a second
      tr.style.transform = `translate3d(${x}px, 0, 0)`;
      if (Math.abs(glide) > 8) raf = requestAnimationFrame(glideFrame);
      else { raf = 0; release(); }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button")) return;
      pointerId = e.pointerId;
      moved = false;
      x0 = lastX = e.clientX; y0 = e.clientY; lastT = e.timeStamp; vel = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - x0;
      if (!moved) {
        // a sideways pull is a drag; a vertical one is the page scrolling (touch-action: pan-y)
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - y0)) return;
        moved = true;
        dragging = true;
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        take();
        xAtDown = x - dx;
        el.classList.add("is-drag");
        el.setPointerCapture?.(e.pointerId);
      }
      x = wrap(xAtDown + dx);
      tr.style.transform = `translate3d(${x}px, 0, 0)`;
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
      // pressing on a card focused its link, and the row pauses while it holds focus: a drag is
      // not a keyboard visit, so let go of it and the drift resumes
      const active = document.activeElement as HTMLElement | null;
      if (active && el.contains(active)) active.blur();
      glide = Math.max(-2400, Math.min(2400, vel));
      if (Math.abs(glide) > 8) { prev = performance.now(); raf = requestAnimationFrame(glideFrame); }
      else release();
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

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, [dur]);

  return (
    <div className="cm-wrap">
      <div ref={ref} className={`cm${paused ? " is-paused" : ""}`} role="region" aria-label={label}>
        <div ref={track} className="cm-track" style={{ ["--dur" as string]: `${dur}s` }}>
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
