"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInViewTicker } from "./use-kit";

/**
 * STACK CARDS — cards that pin one after another and bury the one beneath
 * in depth: as the next card slides over, the covered card tips back on the
 * X axis, shrinks, and falls into shadow.
 *
 * Pinning is native `position: sticky` — the lesson the process ride paid
 * for (CLAUDE.md): a ScrollTrigger pin stores an absolute start that goes
 * stale when the hero's pin inserts height above it, and the section
 * slammed. Sticky stores nothing and is right whatever loads above.
 *
 * For each card the only number needed is how far the NEXT card has
 * covered it, read live from `getBoundingClientRect()` each frame and
 * written to `--c` (0 = fully visible, 1 = fully covered). CSS does the rest.
 *
 * Reduced motion: `--c` is never written, so the cards still stack by
 * sticky — which is layout, not animation — but nothing tips or dims.
 */
export function StackCards({
  cards,
  className,
}: {
  cards: { key: string; node: ReactNode }[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useInViewTicker(ref, (el) => {
    const items = Array.from(el.children) as HTMLElement[];
    for (let i = 0; i < items.length; i++) {
      const cur = items[i];
      const next = items[i + 1];
      if (!next) {
        cur.style.setProperty("--c", "0");
        continue;
      }
      const a = cur.getBoundingClientRect();
      const b = next.getBoundingClientRect();
      const covered = Math.min(1, Math.max(0, 1 - (b.top - a.top) / a.height));
      cur.style.setProperty("--c", covered.toFixed(3));
    }
  }, "0%");

  return (
    <div ref={ref} className={cn("kit-stack", className)}>
      {cards.map((c, i) => (
        <div key={c.key} className="kit-stack-card" style={{ "--i": i } as CSSProperties}>
          {c.node}
        </div>
      ))}
    </div>
  );
}
