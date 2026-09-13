"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";

/**
 * SCROLL-LIT STATEMENT
 *
 * The sentence starts dim and each word lights to full white as the block
 * travels through the viewport, so reading the line and scrolling it are the
 * same gesture.
 *
 * ── Why opacity, and why it floors at 0.52 ──
 *
 * The obvious implementation animates `color` from grey to white. That
 * repaints every word on every frame, and the house motion standard restricts
 * scroll-linked animation to transform, opacity and filter. So each word is a
 * single text node whose opacity is driven instead.
 *
 * The floor matters: pure white at 0.52 over #000 composites to ≈ #858585,
 * which measures 5.5:1 and clears WCAG AA for body text. A dimmer, more
 * dramatic floor — the reference sits nearer 0.45 — drops under 4.5:1, so an
 * unlit word would be a contrast failure for the entire time it is on screen.
 * The effect is worth having; it is not worth failing the accessibility gate
 * that the rest of this site is held to.
 *
 * Under `prefers-reduced-motion` the sentence renders lit, as plain text.
 */

const DIM = 0.52;

function Word({
  progress,
  start,
  end,
  children,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  children: string;
}) {
  const opacity = useTransform(progress, [start, end], [DIM, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

export function ScrollStatement({
  label,
  text,
  className,
}: {
  /** Small parenthesised marker set in the left margin. */
  label: string;
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // The sentence is fully lit by the time it reaches the middle of the
  // viewport — waiting until it exits would mean it is never read lit.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });

  const words = text.split(" ");

  return (
    <div
      ref={ref}
      className="mx-auto grid w-full max-w-[1600px] gap-6 px-6 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-16"
    >
      <p className="field-label lg:col-span-2 lg:pt-4">({label})</p>

      <p
        className={
          className ??
          "display-soft text-display-sm text-ink-1000 lg:col-span-9 lg:col-start-4"
        }
      >
        {reduced
          ? text
          : words.map((word, i) => (
              <span key={`${word}-${i}`}>
                <Word
                  progress={scrollYProgress}
                  // Each word lights over its own slice of the scroll, with the
                  // slices overlapping slightly so the sweep reads as one
                  // continuous wipe rather than a row of individual switches.
                  start={i / words.length}
                  end={Math.min(1, (i + 1.6) / words.length)}
                >
                  {word}
                </Word>{" "}
              </span>
            ))}
      </p>
    </div>
  );
}
