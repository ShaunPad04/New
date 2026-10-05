"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Adds `.in` once the element enters the viewport (IntersectionObserver) and
 * `.done` after the entrance so stagger delays retire and hovers stay snappy.
 * Pure opacity/transform in CSS; reduced motion shows the final state.
 */
export default function Reveal({
  as: Tag = "div",
  group = false,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  group?: boolean;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in", "done");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            setTimeout(() => el.classList.add("done"), 1400);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${group ? "reveal-group" : "reveal"} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
