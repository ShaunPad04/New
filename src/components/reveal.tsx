"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds, for sequencing siblings. */
  delay?: number;
  /** Travel distance in pixels. */
  y?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Scroll-triggered entrance.
 *
 * `once: true` — re-animating on every scroll-back is the single most
 * common way a premium site starts feeling cheap.
 *
 * Under reduced motion the element renders in its final state immediately.
 * The content is never withheld, only the transition is.
 *
 * That is what `useReducedMotion()` below is for, and it is NOT enough on its
 * own. Measured on the built site with `prefers-reduced-motion: reduce`: 24
 * blocks — the whole services list, both work cards, the results figures —
 * were left at the `initial` styles (`opacity:0`) as inline attributes, so
 * they never became visible. The hook is a client hook, the markup is
 * rendered before it resolves, and if the entrance never runs afterwards the
 * element is stranded invisible. An IntersectionObserver that does not fire
 * strands it the same way.
 *
 * So the guarantee is made in CSS instead, where it cannot depend on
 * hydration timing or on an observer: `[data-reveal]` is forced to its final
 * state under reduced motion in globals.css. Keep both — the hook avoids
 * mounting the animation at all, the CSS makes the promise unconditional.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      // Marks this element for the reduced-motion safety net in globals.css.
      // See the note on that rule: the hook alone is not sufficient.
      data-reveal=""
      // Heavy fade-up with a blur resolve, per the house motion standard —
      // elements arrive with mass rather than simply appearing.
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Headline text must never depend on IntersectionObserver or hydration to be
 * readable. The previous word-by-word `whileInView` treatment translated
 * every word below an overflow-hidden wrapper in the initial render. On the
 * deployed site that could leave the section headings permanently clipped.
 *
 * Keep primary headings in the DOM at their final position at all times. The
 * surrounding page still carries the motion language through Reveal blocks,
 * hover states and the hero parallax, without making critical content fragile.
 */
export function RevealWords({
  text,
  className,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return <span className={className}>{text}</span>;
}
