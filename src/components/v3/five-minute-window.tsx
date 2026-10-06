"use client";

import { useEffect, useRef } from "react";

const R = 34;
const C = 2 * Math.PI * R;
const RUN = 6000; // five minutes, told in six seconds

/**
 * The five-minute window, counting down (Brad, 2026-10-06: "animated text
 * reveal and count downs"). Beside the 100× figure on /ai: a clock runs
 * 5:00 to 0:00 as the ring drains, then turns red. Decoration, aria-hidden;
 * the figure and its sentence carry the meaning.
 *
 * The server renders 5:00 with a full ring, which is what no-JS and reduced
 * motion keep. It runs once, when the tile is well into view. The clock is
 * a clock, so it steps at an even rate rather than easing.
 */
export function FiveMinuteWindow() {
  const root = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const arc = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / RUN);
          const left = Math.ceil(300 * (1 - p));
          if (time.current) time.current.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
          if (arc.current) arc.current.style.strokeDashoffset = String(C * p);
          if (p < 1) raf = requestAnimationFrame(tick);
          else el.dataset.done = "";
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.8 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="group/win relative grid size-[5.5rem] shrink-0 place-items-center">
      <svg viewBox="0 0 80 80" className="absolute inset-0 size-full -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <circle
          ref={arc}
          cx="40"
          cy="40"
          r={R}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={0}
          className="stroke-white transition-[stroke] duration-500 group-data-[done]/win:stroke-accent"
        />
      </svg>
      <span ref={time} className="font-[family-name:var(--font-display)] text-[1.125rem] tabular-nums tracking-[-0.02em] text-ink-1000 transition-colors duration-500 group-data-[done]/win:text-accent">
        5:00
      </span>
    </div>
  );
}
