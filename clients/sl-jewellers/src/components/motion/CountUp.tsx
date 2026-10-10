"use client";

import { useEffect, useRef, useState } from "react";

/** Counts from 0 to `value` once in view. Reduced motion shows the value at once. */
export default function CountUp({ value, decimals = 0, suffix = "", duration = 700, className = "" }: { value: number; decimals?: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(value * eased);
        if (p < 1) requestAnimationFrame(tick);
        else setShown(value);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
