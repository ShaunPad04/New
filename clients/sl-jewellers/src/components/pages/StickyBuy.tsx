"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The product page's buy bar, fixed to the foot of the screen only once the page's own Add to
 * basket has scrolled up out of sight (Shaun, 8 Oct 2026, of the always-on bar on a phone:
 * "this is so squished"). Until then the buttons beside the piece do the job and the stage has
 * the whole screen. Hidden, it is inert, so it is never tabbed to or read out twice.
 */
export default function StickyBuy({ children }: { children: ReactNode }) {
  const bar = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const target = bar.current?.closest(".pdv-root")?.querySelector("[data-buy]");
    if (!target) return;
    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={bar} className="pdv-sticky" data-on={on} aria-hidden={!on} inert={!on}>
      {children}
    </div>
  );
}
