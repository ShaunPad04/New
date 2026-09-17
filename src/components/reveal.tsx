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
 * All four share the house easing and the once-only viewport trigger, so they
 * read as one system at four weights rather than as four different animations.
 *
 * NO ANIMATION LIBRARY, AND NO CLIENT BOUNDARY (2026-09-16). These entrances
 * were Motion components, which put 43 KB of gzipped JavaScript into the
 * first load of every page for four CSS transitions. Worse, a client wrapper
 * turns everything inside it into a client subtree: the children are
 * serialised into the RSC payload as well as rendered to HTML, and React
 * hydrates all of it. Twenty-six wrapped sections was a large share of a
 * 450 KB homepage document and of the hydration time a phone pays before
 * it can respond.
 *
 * So this is now plain markup — `data-reveal` carries the variant and the CSS
 * in globals.css carries the choreography — and ONE client component,
 * `RevealObserver` in layout.tsx, sets `data-in` on any such element as it
 * enters the viewport. Same four entrances, same easing, same durations,
 * same `y` and `delay` knobs. It can still be imported from a client
 * component; it simply has no state of its own.
 *
 * The hidden starting state lives under `@media (scripting: enabled)`, so a
 * reader with JavaScript off, or a browser that does not know that media
 * feature, gets the content at rest instead of a page with its middle
 * missing. Under `prefers-reduced-motion` the same CSS forces the final state
 * and zeroes the transition, so nothing here depends on hydration.
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

export function Reveal({
  children,
  className,
  delay = 0,
  y,
  variant = "rise",
  as: Tag = "div",
}: RevealProps) {

  // `y` predates the variants and a few call sites still tune it. It only
  // means anything for `rise`, which is the only entrance with vertical
  // travel as its subject; the CSS reads it for that variant alone.
  const style: React.CSSProperties & { "--reveal-y"?: string } = {};
  if (delay) style.transitionDelay = `${delay}s`;
  if (variant === "rise" && y !== undefined) style["--reveal-y"] = `${y}px`;

  return (
    <Tag className={className} data-reveal={variant} style={style}>
      {children}
    </Tag>
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
