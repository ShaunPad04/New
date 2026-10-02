"use client";

import { useRef, type ReactNode } from "react";
import { useInViewTicker } from "@/components/kit/use-kit";

/**
 * Writes how far the studio section's centre is from the viewport's centre
 * to `--d` (px, + once it has scrolled past), so its pictures can move at
 * their own SPEEDS in CSS (`.nd-drift-*`): Neiden's measured 1.1x and 1.3x
 * the scroll, the same at every width. Reduced motion: the ticker never
 * runs, `--d` stays unset and the pictures sit still.
 */
export function StudioDrift({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useInViewTicker(ref, (el, { vh }) => {
    const r = el.getBoundingClientRect();
    const d = `${Math.round(vh / 2 - (r.top + r.height / 2))}px`;
    if (el.style.getPropertyValue("--d") !== d) el.style.setProperty("--d", d);
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
