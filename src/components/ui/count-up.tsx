"use client";

import { useEffect, useRef } from "react";

/**
 * COUNT-UP (redesign, 2026-09-11)
 *
 * A stat figure that counts from zero to its value the first time it scrolls
 * into view. Runs once, on the compositor-friendly path (it only writes
 * textContent inside rAF — no layout reads in the loop), and never under
 * `prefers-reduced-motion`, where the final value simply renders.
 *
 * The value is a display STRING ("99", "0.8s", "100") — the numeric part is
 * parsed out and animated with its decimal places preserved; any prefix and
 * suffix render untouched. Server-rendering the final value means no-JS and
 * reduced-motion readers always see the real figure; the animation resets to
 * zero only at the moment it starts.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const m = value.match(/^([^0-9]*)([\d.]+)(.*)$/);
    if (!m) return;
    const [, prefix, num, suffix] = m;
    const target = parseFloat(num);
    const decimals = (num.split(".")[1] ?? "").length;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          // expo.out — the house entrance curve.
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
