import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * ACTION CTA — recreated from a Framer component the client sent (2026-09-11).
 *
 * Rebuilt against this stack from the published spec, NOT imported. Nothing
 * from framer.com or framerusercontent.com is fetched at build or at runtime,
 * and no Framer runtime is added: a remote module would be a third-party
 * request on every page, and this site's privacy policy states that it makes
 * none — a claim `tests/a11y.spec.ts` asserts on every build.
 *
 * MATCHED FROM THE SOURCE SPEC
 *   52px tall, 33px radius, white pill
 *   6px padding top/right/bottom, 12px left, 16px between label and arrow
 *   black arrow container 39x40, white 14px arrow
 *   soft layered grey shadow, removed on hover
 *   hover: label slides left out of the clip, the container expands across
 *          the inner width, the arrow grows to 18px and rotates -45deg
 *   reverses on mouse leave
 *
 * THREE THINGS IN THE SPEC WERE NOT COPIED, all deliberately.
 *
 * 1. CLASH GROTESK. The spec qualifies it "if available and appropriately
 *    licensed" and it is neither: not in this project, and the type here is a
 *    locked decision — Archivo for display, Geist for body and UI, with
 *    Inter/Roboto/Arial/Open Sans/Helvetica banned by the house standard.
 *    A fifth face for one button would also cost a font request on the hero,
 *    which holds the LCP element. The label is Geist 600.
 *
 * 2. THE 151px HOVER WIDTH. The source animates to a hard-coded width because
 *    it has one hard-coded label. This takes any label, so the arrow expands
 *    to the inner box instead: it is pinned `right: 6px` and its `left` runs
 *    from `calc(100% - 45px)` to `6px`, which derives the width rather than
 *    stating it. Hard-coding 151px would clip "See the portfolio" and leave
 *    "Go" swimming.
 *
 * 3. THE SPRING IS CSS, NOT MOTION. `motion` is installed and was used first,
 *    but a spring cannot animate `left` between a calc() and a pixel value —
 *    the first build pinned the width instead and the container slid across
 *    the button rather than stretching, which is the wrong effect. The easing
 *    below is a cubic-bezier with a small overshoot, which reads as the
 *    spec's 0.6s / 0.2-bounce spring and costs the hero no JavaScript at all.
 *
 * The reference's hard-coded `tel:` destination is not copied: href is a prop.
 *
 * No "use client": there are no hooks and no state here, so with an `href`
 * this renders entirely on the server and ships no JavaScript at all. The
 * `onClick` form still works — a function prop simply requires the PARENT to
 * be a client component, which is a constraint on the caller, not on this
 * file.
 */

/** ~0.6s with a light overshoot, standing in for spring(duration 0.6, bounce 0.2). */
const SPRING = "600ms cubic-bezier(0.34, 1.28, 0.64, 1)";

type ActionCtaProps = {
  children: ReactNode;
  /** Navigation target. Ignored when `onClick` is given. */
  href?: string;
  /** Action handler. Renders a <button> rather than an anchor. */
  onClick?: () => void;
  className?: string;
};

export function ActionCta({ children, href, onClick, className }: ActionCtaProps) {
  /*
    `overflow-hidden` is what clips the label as it leaves — the effect depends
    on it. The pill is `inline-flex`, so a long label lengthens the button
    rather than being cut off at rest; only the hover travel is clipped.

    `pr-[61px]` is the 6px right padding plus the 39px arrow plus the 16px gap,
    reserved so the label never runs under the arrow at rest.

    Hover AND focus-visible drive the same state, so the animation is reachable
    from a keyboard instead of being mouse-only — and neither is required to
    activate it, which is what makes it work on touch.
  */
  const shell = cn(
    "group relative inline-flex h-[52px] select-none items-center overflow-hidden rounded-[33px] bg-ink-1000 pl-3 pr-[61px]",
    "shadow-[0_1px_2px_rgb(0_0_0/0.12),0_8px_20px_-6px_rgb(0_0_0/0.28)]",
    "transition-shadow duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-none focus-visible:shadow-none",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-1000",
    className,
  );

  const content = (
    <>
      {/*
        The label is MOVED, never hidden. `display:none`, `visibility:hidden`
        or `aria-hidden` on the slide-out would strip the control's accessible
        name at exactly the moment a sighted user can still see it, and would
        break voice control — "click Start a project" has to keep working while
        the pointer is on the button.
      */}
      <span
        className={cn(
          "relative z-10 whitespace-nowrap text-[0.9375rem] font-semibold leading-none tracking-tight text-ink-0",
          "transition-[transform,opacity] group-hover:-translate-x-8 group-hover:opacity-0",
          "group-focus-visible:-translate-x-8 group-focus-visible:opacity-0",
          "motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none",
        )}
        style={{ transitionDuration: "600ms", transitionTimingFunction: "cubic-bezier(0.34, 1.28, 0.64, 1)" }}
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-1.5 right-1.5 top-1.5 z-20 flex items-center justify-center rounded-[27px] bg-ink-0",
          "left-[calc(100%-45px)] group-hover:left-1.5 group-focus-visible:left-1.5",
          "motion-reduce:!left-[calc(100%-45px)] motion-reduce:transition-none",
        )}
        style={{ transition: `left ${SPRING}` }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-3.5 w-3.5 text-ink-1000",
            "group-hover:h-[18px] group-hover:w-[18px] group-hover:-rotate-45",
            "group-focus-visible:h-[18px] group-focus-visible:w-[18px] group-focus-visible:-rotate-45",
            "motion-reduce:!h-3.5 motion-reduce:!w-3.5 motion-reduce:!rotate-0 motion-reduce:transition-none",
          )}
          style={{ transition: `width ${SPRING}, height ${SPRING}, rotate ${SPRING}` }}
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={shell}>
        {content}
      </button>
    );
  }

  const target = href ?? "#";
  if (target.startsWith("/")) {
    return (
      <Link href={target} className={shell}>
        {content}
      </Link>
    );
  }
  return (
    <a href={target} className={shell}>
      {content}
    </a>
  );
}
