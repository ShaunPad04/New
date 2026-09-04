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
        {/* Upper band: the claim on the left, the disciplines on the right. */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div className="max-w-[38ch]">
            <p className="text-[0.9375rem] leading-relaxed text-ink-900 sm:text-base">
              {site.heroLine}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Cta href="#contact">Start a project</Cta>
              <Cta href="/portfolio" variant="ghost">
                See the portfolio
              </Cta>
            </div>
          </div>

          {/* Right-aligned so the list reads as a column against the edge,
              which is what gives the reference its balance. */}
          <ul className="shrink-0 space-y-2 text-left sm:text-right">
            {heroDisciplines.map((d) => (
              <li
                key={d}
                className="text-[0.9375rem] leading-relaxed text-ink-800 sm:text-base"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/*
          Lower band: the logotype.

          Sized by measurement, not by a heading scale. Fifteen uppercase
          Archivo characters at this tracking run ~12.6em wide — an earlier
          estimate of 9.3em put the mark at 91% of the container instead of the
          ~61% the reference uses. Below `lg` it takes the full width, because a
          phone has no room to hold it back; from `lg` it is capped so it
          anchors the corner rather than spanning the page.

          `nowrap` stops a browser hyphenating a single long word.

          The mark is inline after the final letter and raised, NOT a flex
          sibling: as a flex child it sat after the text box, which is wider
          than the word, leaving it floating in space.

          "™", never "®" — BRAND_MARK stays ™ until the name is registered with
          the IPO. ® on an unregistered mark is a criminal offence under the
          Trade Marks Act 1994 s.95.
        */}
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
      </div>
    </HeroSequence>
  );
}
