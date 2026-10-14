"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The wrapped button follows a fine pointer by up to `pull` px and springs
 * back on leave. Hover-only devices; touch and reduced motion get nothing.
 */
export default function MagneticButton({ children, pull = 6, className = "" }: { children: ReactNode; pull?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.classList.add("is-near");
      target.style.transform = `translate3d(${(dx * pull).toFixed(1)}px, ${(dy * pull).toFixed(1)}px, 0)`;
    };
    const leave = () => {
      el.classList.remove("is-near");
      target.style.transform = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [pull]);

  return (
    <span ref={ref} className={`magnet ${className}`}>
      {children}
    </span>
  );
}
