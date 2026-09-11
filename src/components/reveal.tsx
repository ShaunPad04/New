"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * WHY THERE IS MORE THAN ONE OF THESE.
 *
 * Every block on the page used to arrive the same way — 28px up, a 6px blur
 * resolving, 0.9s — and the client's note was that scrolling the page felt
 * like one effect repeating rather than a composition. He is right, and it is
 * a real failure rather than a taste question: when a heading, a photograph
 * and a row of small print all move identically, the motion stops carrying
 * any information about what kind of thing is arriving.
 *
 * So the variants are assigned by ROLE, not sprinkled for variety:
 *
 *  - `rise`    the default, and still what most blocks use. Fade up with a
 *              blur resolve. Anything without a strong reason keeps it, or
 *              the page tips the other way and becomes noisy.
 *  - `settle`  things with an edge and a surface — work covers, bezelled
 *              plates. They scale up a touch from 0.965 as they land, which
 *              reads as an object coming to rest rather than a block sliding
 *              in. No blur: a card's own border going soft looks like a
 *              rendering fault, where soft text just looks out of focus.
 *  - `slide`   rows in a list. They enter from the leading edge, quickly and
 *              with no vertical travel, so a stack of them reads as a list
 *              being dealt rather than as ten separate arrivals.
 *  - `unblur`  long-form paragraphs. No travel at all — the text resolves out
 *              of a 10px blur where it already sits. Moving a paragraph the
 *              reader is about to start reading is the one place travel is
 *              actively unhelpful.
 *
 * All four share the house easing and the `once: true` viewport, so they read
 * as one system at four weights rather than as four different animations.
 */
export type RevealVariant = "rise" | "settle" | "slide" | "unblur";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds, for sequencing siblings. */
  delay?: number;
  /** Travel distance in pixels. Honoured by `rise` only. */
  y?: number;
  /** How this block arrives. See the note above — assign by role. */
  variant?: RevealVariant;
  as?: "div" | "section" | "li" | "span";
};

/**
 * The four entrances, as `initial` / `animate` pairs plus a duration.
 *
 * Written out in full rather than derived from each other: every property
 * that any variant animates must appear in BOTH states of that variant, or
 * Motion has nothing to interpolate from and the property snaps. Sharing a
 * base object and spreading overrides is how that gets broken later.
 */
const VARIANTS: Record<
  RevealVariant,
  { from: Record<string, number | string>; to: Record<string, number | string>; duration: number }
> = {
  rise: {
    from: { opacity: 0, y: 28, filter: "blur(6px)" },
    to: { opacity: 1, y: 0, filter: "blur(0px)" },
    duration: 0.9,
  },
  settle: {
    from: { opacity: 0, y: 22, scale: 0.965 },
    to: { opacity: 1, y: 0, scale: 1 },
    duration: 1.05,
  },
  slide: {
    // Leading-edge, so this is left-to-right and would need reversing for an
    // RTL locale. The site is `en-GB` only; revisit if that ever changes.
    from: { opacity: 0, x: -24, filter: "blur(4px)" },
    to: { opacity: 1, x: 0, filter: "blur(0px)" },
    duration: 0.7,
  },
  unblur: {
    from: { opacity: 0, filter: "blur(10px)" },
    to: { opacity: 1, filter: "blur(0px)" },
    duration: 1.1,
  },
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
  y,
  variant = "rise",
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const { from, to, duration } = VARIANTS[variant];

  // `y` predates the variants and a few call sites still tune it. It only
  // means anything for `rise`, which is the only entrance with vertical
  // travel as its subject; applying it to the others would quietly turn a
  // `slide` into a diagonal.
  const initial = variant === "rise" && y !== undefined ? { ...from, y } : from;

  return (
    <MotionTag
      className={className}
      // Marks this element for the reduced-motion safety net in globals.css.
      // See the note on that rule: the hook alone is not sufficient.
      data-reveal=""
      initial={initial}
      whileInView={to}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{
        duration,
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
