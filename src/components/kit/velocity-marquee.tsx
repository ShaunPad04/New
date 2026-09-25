"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInViewTicker } from "./use-kit";

/**
 * VELOCITY MARQUEE — a ribbon that drifts on its own and answers the scroll.
 *
 * Idle, it drifts slowly. Scroll, and it accelerates in proportion to how
 * fast you are scrolling, leans into the motion with a skew, and reverses
 * when you scroll back up. That coupling is what separates it from the stock
 * CSS keyframe loop the site already has: the ribbon feels physically
 * connected to the page instead of running on a timer beside it.
 *
 * Position is integrated in JavaScript (one `translate3d` write per frame)
 * because a CSS animation cannot change speed mid-flight without jumping.
 * The track holds the content twice and wraps at exactly half its width, so
 * the loop is seamless at any speed.
 *
 * Under reduced motion the ticker never subscribes: the ribbon sits still,
 * fully readable, first copy in view. The second copy is `aria-hidden` so a
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
  const x = useRef(0);
  const dir = useRef(reverse ? 1 : -1);

  useInViewTicker(wrap, (_el, { velocity }) => {
    const t = track.current;
    if (!t) return;
    // Scrolling back up turns the ribbon round; the base direction is
    // restored as soon as the reader scrolls down again.
    if (Math.abs(velocity) > 0.4) dir.current = (velocity > 0 ? -1 : 1) * (reverse ? -1 : 1);
    const boost = Math.min(Math.abs(velocity) * 0.35, 24);
    x.current += dir.current * (speed + boost);
    const half = t.scrollWidth / 2;
    if (half > 0) {
      if (x.current <= -half) x.current += half;
      if (x.current > 0) x.current -= half;
    }
    // Lean into the motion, capped so fast flicks stay legible.
    const skew = Math.max(-8, Math.min(8, velocity * -0.25));
    t.style.transform = `translate3d(${x.current.toFixed(2)}px,0,0) skewX(${skew.toFixed(2)}deg)`;
  }, "10%");

  return (
    <div ref={wrap} className={cn("kit-marquee", className)}>
      <div ref={track} className="kit-marquee-track">
        <div className="kit-marquee-group">{children}</div>
        <div className="kit-marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
