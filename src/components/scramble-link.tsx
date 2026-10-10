"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * SCRAMBLE LINK
 *
 * On hover or focus the label runs through random characters and resolves
 * left-to-right into the real word — the decode effect from the client's
 * reference.
 *
 * ── Accessibility ──
 * The scrambling text is never the accessible name. Mid-animation the label
 * reads "REA5NUPSQ", and a screen reader announcing that is worse than
 * useless, so the visible span is `aria-hidden` and the real word is carried
 * in a visually-hidden sibling. The link therefore always announces
 * "Read more" no matter what is on screen.
 *
 * ── Layout ──
 * The animation swaps glyph for glyph and never changes length, so the label
 * cannot reflow mid-scramble. It is set in the mono face so the varying
 * glyphs also cannot change its measured width.
 *
 * Under `prefers-reduced-motion` the label simply never scrambles.
 */

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const TICK_MS = 34;
/** Frames spent per character before it locks to its real glyph. */
const FRAMES_PER_CHAR = 1.6;

export function ScrambleLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(label);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setDisplay(label);
  }, [label]);

  // A timer left running after unmount would set state on a dead component.
  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    if (reduced || timer.current) return;

    let frame = 0;
    timer.current = setInterval(() => {
      const settled = frame / FRAMES_PER_CHAR;

      setDisplay(
        label
          .split("")
          .map((char, i) => {
            // Spaces never scramble — losing the word gap makes the label
            // read as one long token and the effect as noise.
            if (char === " ") return char;
            if (i < settled) return char;
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
          .join("")
      );

      frame += 1;
      if (settled > label.length) stop();
    }, TICK_MS);
  }, [label, reduced, stop]);

  return (
    <a
      href={href}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className={cn(
        "group inline-flex items-center justify-between gap-8 border-b border-ink-500 pb-2 transition-colors duration-500 hover:border-ink-1000",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="font-mono text-xs uppercase tracking-[0.16em] text-ink-900"
      >
        {display}
      </span>
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="text-ink-700 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:text-ink-1000"
      >
        →
      </span>
    </a>
  );
}
