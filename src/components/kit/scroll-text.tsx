"use client";

import { useRef, type CSSProperties } from "react";
import { useScrollProgress } from "./use-kit";

/**
 * SCROLL TEXT — a paragraph that lights up word by word AS YOU SCROLL, and
 * dims again on the way back up.
 *
 * This is the difference from the existing `TextReveal`, which plays once on
 * entry against a clock. Here scroll position owns every frame: the reader
 * controls the pace, stops mid-sentence and the sentence stops with them.
 * That is what makes it read as engineered rather than decorative.
 *
 * All the per-word maths is CSS `calc()` off one variable, `--p`, which
 * `useScrollProgress` writes once per frame on the wrapper. Each word only
 * knows its own index `--i` and the count `--n`. No JavaScript touches a
 * word, so a 60-word paragraph costs the same as a 6-word one.
 *
 * CONTENT IS NEVER GATED. Every rule falls back to `var(--p, 1)` — fully lit
 * — so with JavaScript off, before hydration, and under reduced motion (the
 * hook never subscribes, `--p` is never written) the text simply reads.
 *
 * The visible words are the accessible text: spans keep their spaces, so
 * find-in-page and screen readers get one contiguous sentence, read once.
 */
export function ScrollText({
  text,
  as: Tag = "p",
  className,
  dim = 0.14,
}: {
  text: string;
  as?: "p" | "h2" | "h3" | "blockquote";
  className?: string;
  /** Opacity of an unlit word. Low enough to read as "not yet", high
      enough that the whole shape of the sentence is visible from the start. */
  dim?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref);
  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className="kit-scrolltext"
      style={{ "--n": words.length, "--dim": dim } as CSSProperties}
    >
      <Tag className={className}>
        {words.map((word, i) => (
          <span key={i}>
            {i > 0 ? " " : null}
            <span className="kit-scrolltext-word" style={{ "--i": i } as CSSProperties}>
              {word}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
