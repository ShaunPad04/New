"use client";

import { useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useScrollProgress } from "./use-kit";

/**
 * TEXT RING — words set on the wall of a 3D cylinder that turns with the
 * scroll. The section's one "object" moment, built entirely from CSS
 * transforms: no WebGL, no canvas, no library.
 *
 * Each word is rotated `i × 360/n` degrees around the Y axis and pushed out
 * to the radius; the ring itself rotates by `--p` (scroll progress through
 * the section) plus a fixed forward tilt, so it reads as an object in space
 * rather than a flat carousel. Words on the far side are dimmed rather than
 * hidden, so the depth reads.
 *
 * The words are decorative repetition of copy that exists elsewhere on the
 * page, so the ring is `aria-hidden` and the accessible text is a plain
 * sentence rendered off-screen beside it.
 *
 * Reduced motion: `--p` is never written and the ring rests at its
 * default angle — a still, legible arrangement.
 */
export function TextRing({
  words,
  className,
  turns = 1,
}: {
  words: string[];
  className?: string;
  /** Full rotations across the section's scroll. */
  turns?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref);
  const n = words.length;

  return (
    <div ref={ref} className={cn("kit-ring", className)} style={{ "--n": n, "--turns": turns } as CSSProperties}>
      <span className="sr-only">{words.join(", ")}</span>
      <div className="kit-ring-stage" aria-hidden="true">
        <div className="kit-ring-spin">
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="kit-ring-word" style={{ "--i": i } as CSSProperties}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
