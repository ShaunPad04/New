import { BRAND_MARK, heroDisciplines, site } from "@/lib/content";
import { Cta } from "@/components/cta";
import { HeroSequence } from "@/components/hero-sequence";

/**
 * HERO
 *
 * The backdrop is a scroll-driven frame sequence (see `hero-sequence.tsx`):
 * the section pins and scroll position — not a video clock — owns which frame
 * is on screen.
 *
 * The composition follows the reference the client supplied: one line of copy
 * upper-left, the disciplines listed upper-right, and the logotype anchoring
 * the bottom-left at roughly two thirds of the container width rather than
 * filling it. The content block spreads to the full height of the section so
 * those two bands actually separate, instead of stacking at the foot.
 *
 * The <h1> is the LCP element, so this whole block is plain server-rendered
 * markup — deliberately NOT animated and NOT client-gated. It paints on the
 * first frame of HTML regardless of hydration, motion preference, or whether
 * a single image has decoded.
 */
export function Hero() {
  return (
    <HeroSequence>
      {/*
        `justify-end` below `sm`, `justify-between` above it.

        The disciplines list is the first of two children and is hidden on a
        phone, which left `justify-between` with a single child — and a lone
        child in a space-between column sits at the TOP. So the whole
        composition piled into the first third of the frame with 460px of dead
        space under it, inverted from the desktop layout, and the copy landed
        on the brightest part of the footage while the scrim, which is weighted
        to the foot, protected nothing. Introduced when the list was hidden;
        the container was never re-checked with one child instead of two.
      */}
      {/*
        THE FOREGROUND TRAVELS WITH THE PIN.

        Adapted from a reference the client sent: as the page scrolls, the
        headline sinks and fades while the imagery behind it keeps playing,
        so the type hands the frame over rather than cutting away from it.

        It earns its place here rather than being decoration. This hero holds
        the viewport for 320vh while the sequence scrubs, and until now the
        foreground did nothing for that entire distance — the name and the two
        buttons sat perfectly still through three screens of scrolling, which
        reads as a page that has stopped responding rather than one that is
        playing a film.

        Driven by `--hero-progress`, published on the section by the
        sequence's own ScrollTrigger, so there is exactly one scroll
        subscription on this page and no second source of truth about how far
        through the pin we are. The `translate3d` and `opacity` are both
        compositor properties, so this costs no layout and no paint.

        22vh of travel and a fade that completes at ~70% of the pin: the type
        is gone before the sequence ends, leaving the last stretch of scroll
        as pure footage. The fallback of 0 in each `var()` matters — under
        `prefers-reduced-motion` the hero never pins, the property is never
        written, and the block simply sits where it was designed to sit.
      */}
      <div
        style={{
          transform: "translate3d(0, calc(var(--hero-progress, 0) * 22vh), 0)",
          opacity: "calc(1 - var(--hero-progress, 0) * 1.45)",
          willChange: "transform, opacity",
        }}
        className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end gap-16 px-6 pb-14 pt-28 sm:justify-between sm:px-10 lg:px-16 lg:pb-16 lg:pt-32"
      >
        {/*
          Upper band: the disciplines, right-aligned against the edge.

          Hidden below `sm` at the client's request (2026-09-07). On a phone
          the hero frame is portrait and the copy block is already three lines
          longer than on desktop, so this list was competing with the logotype
          and the two calls to action for the only legible part of the frame.
          Nothing is lost — the same six disciplines are the Services section,
          in full, a screen further down. It is `hidden`, not removed, so the
          desktop composition the client signed off is untouched.
        */}
        <ul className="ml-auto hidden space-y-2 text-left sm:block sm:text-right">
          {heroDisciplines.map((d) => (
            <li
              key={d}
              className="text-[0.9375rem] leading-relaxed text-ink-800 sm:text-base"
            >
              {d}
            </li>
          ))}
        </ul>

        {/*
          Lower band: the logotype anchors the left, the claim and the calls to
          action sit bottom-right.

          They were upper-left, over the brightest part of the frame, where
          they were genuinely hard to read. Down here they sit in the heaviest
          part of the scrim, and both buttons are solid — one white on black
          type, one black on white — so neither depends on the footage behind
          it to stay legible. A bordered transparent button cannot make that
          promise across 169 frames.
        */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h1
          id="hero-heading"
          // `w-fit` so the element hugs the letters. As a block it stretched to
          // the container, which made it impossible to size against the
          // reference by eye or by measurement.
          className="display w-fit whitespace-nowrap text-[8.2vw] leading-[0.86] tracking-[-0.045em] text-ink-1000 lg:text-[clamp(3.5rem,6vw,6.5rem)]"
        >
            {site.logotype}
            <span className="align-super text-[0.2em] font-semibold tracking-normal text-ink-700">
              {BRAND_MARK}
            </span>
          </h1>

          <div className="max-w-[36ch] shrink-0 lg:pb-2 lg:text-right">
            <p className="text-[0.9375rem] leading-relaxed text-ink-900 sm:text-base">
              {site.heroLine}
            </p>

            {/*
              On a phone: a one-column grid sized `w-fit`, so the pair is as
              wide as the LONGER label and no wider, and both buttons match.

              Full width was the first attempt and the client was right to
              reject it — a 342px button for a 14px label is a banner, not a
              call to action, and it swamped the logotype above it. Letting
              each hug its own text is the other extreme: the labels differ by
              about 15px, so they stack into a ragged pair. The grid gives the
              compactness of the first and the alignment of the second.

              From `sm` they return to a row and the desktop composition is
              untouched.
            */}
            <div className="mt-7 grid w-fit grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:items-center lg:justify-end">
              <Cta href="#contact">Start a project</Cta>
              <Cta href="/portfolio" variant="invert">
                See the portfolio
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </HeroSequence>
  );
}
