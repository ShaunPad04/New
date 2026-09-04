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
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between gap-16 px-6 pb-14 pt-28 sm:px-10 lg:px-16 lg:pb-16 lg:pt-32">
        {/* Upper band: the disciplines, right-aligned against the edge. */}
        <ul className="ml-auto space-y-2 text-left sm:text-right">
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

            <div className="mt-7 flex flex-wrap items-center gap-3 lg:justify-end">
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
