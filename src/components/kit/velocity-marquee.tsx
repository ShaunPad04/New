"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInViewTicker } from "./use-kit";

/**
 * VELOCITY MARQUEE — a ribbon that drifts on its own and answers the scroll.
 *
 * Idle, it drifts. Scroll, and it accelerates with scroll speed, leans into
 * the motion with a skew, and reverses when you scroll back up.
 *
 * TWO BUGS FIXED 2026-09-25, both from Brad's screenshots:
 *
 * 1. THE RIBBON RAN OUT. It used to render its content exactly twice and
 *    wrap at half the width. That only works if ONE copy is wider than the
 *    screen. The four-item mono ribbon is ~900px on a 1900px monitor, so the
 *    right half of the screen showed the loop's empty tail. It now measures
 *    one copy against the viewport and renders as many as the screen needs,
 *    plus one, and wraps at exactly one copy's width. Seamless on any
 *    content length at any screen width, re-measured on resize.
 *
 * 2. DESCENDERS WERE CHOPPED ("g", "p", "y"). Display type is set tighter
 *    than its own glyphs, so descenders hang outside the line box, and the
 *    ribbon clipped on BOTH axes. The clip is now horizontal only
 *    (`overflow-x: clip`, which — unlike `hidden` — leaves the other axis
 *    alone), and the ribbon carries vertical padding so the feathering mask,
 *    which is painted to the element's box, covers the whole glyph too.
 *
 * Position is integrated in JavaScript (one `translate3d` per frame)
 * because a CSS animation cannot change speed mid-flight without jumping.
 * Under reduced motion the ticker never subscribes and the first copy sits
 * still and readable. Every copy after the first is `aria-hidden`, so a
 * screen reader hears the items once.
 */
export function VelocityMarquee({
  children,
  speed = 0.6,
  reverse = false,
  className,
}: {
  children: ReactNode;
  /** Idle drift in px per frame. */
  speed?: number;
  /** Start by drifting right instead of left — pair two ribbons in opposition. */
  reverse?: boolean;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const dir = useRef(reverse ? 1 : -1);
  const [copies, setCopies] = useState(2);

  /* How many copies fill the screen? One copy's width against the ribbon's
     own width, plus one spare so the wrap never exposes an edge. */
  useEffect(() => {
    const measure = () => {
      const unit = first.current?.offsetWidth ?? 0;
      const view = wrap.current?.offsetWidth ?? 0;
      // Capped as a backstop. The CSS `min-width: 0` is the real fix for
      // the measure → grow → measure loop; the cap means a future layout
      // mistake degrades to a short gap rather than a frozen tab.
      if (unit > 0 && view > 0) setCopies(Math.min(12, Math.max(2, Math.ceil(view / unit) + 1)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    if (first.current) ro.observe(first.current);
    return () => ro.disconnect();
  }, []);

  useInViewTicker(wrap, (_el, { velocity }) => {
    const t = track.current;
    const unit = first.current?.offsetWidth ?? 0;
    if (!t || unit <= 0) return;
    if (Math.abs(velocity) > 0.4) dir.current = (velocity > 0 ? -1 : 1) * (reverse ? -1 : 1);
    const boost = Math.min(Math.abs(velocity) * 0.35, 24);
    x.current += dir.current * (speed + boost);
    // Wrap at exactly one copy: copy N+1 sits where copy N was, so the jump
    // is invisible at any speed.
    x.current = ((x.current % unit) - unit) % unit;
    const skew = Math.max(-8, Math.min(8, velocity * -0.25));
    t.style.transform = `translate3d(${x.current.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
  }, "10%");

  return (
    <div ref={wrap} className={cn("kit-marquee", className)}>
      <div ref={track} className="kit-marquee-track">
        <div ref={first} className="kit-marquee-group">
          {children}
        </div>
        {Array.from({ length: copies - 1 }, (_, i) => (
          <div key={i} className="kit-marquee-group" aria-hidden="true">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
