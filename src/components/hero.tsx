import { BRAND_MARK, site } from "@/lib/content";
import { Cta } from "@/components/cta";
import { HeroSequence } from "@/components/hero-sequence";

/**
 * HERO
 *
 * The backdrop is a scroll-driven frame sequence (see `hero-sequence.tsx`):
 * the section pins and scroll position — not a video clock — owns which frame
 * is on screen.
 *
 * The foreground is now just the name and the two calls to action. The eyebrow
 * and the descriptive paragraph were removed at the client's request: the
 * footage carries the register on its own, and the copy was competing with it.
 *
 * The name is the page's <h1> and is visible rather than screen-reader-only.
 * That is strictly better than the hidden heading it replaces — the document
 * outline, the search result and what a visitor actually sees are now the same
 * string instead of three different ones.
 *
 * It is a plain server-rendered block, deliberately NOT animated and NOT
 * client-gated: the <h1> is the LCP element, so it must paint on the first
 * frame of HTML regardless of hydration, motion preference, or whether a
 * single image has decoded yet.
 */
export function Hero() {
  return (
    <HeroSequence>
      <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-14 sm:px-10 lg:px-16 lg:pb-20">
        {/*
          Stacked, not side by side. The logotype set solid runs the full
          width of the container at this scale, so there is no room beside it —
          the calls to action sit above it and the name anchors the base.
        */}
        <div className="flex flex-col items-start gap-10 lg:gap-12">
          <div className="order-2 flex shrink-0 flex-wrap items-center gap-4 lg:order-1">
            <Cta href="#contact">Start a project</Cta>
            <Cta href="/portfolio" variant="ghost">
              See the portfolio
            </Cta>
          </div>

          {/*
            Set in the display face at the scale of the reference the client
            supplied: heavy, uppercase, tight negative tracking, near-solid
            leading. `items-start` on the wrapper is what lifts the mark to the
            cap line rather than letting it sit on the baseline.
          */}
          {/*
            The mark is inline after the final letter and raised, not a
            separate flex child. As a flex child it sat after the text BOX,
            which is wider than the last line, leaving it floating in space
            several centimetres from the word. Inline, it rides the last
            letter — which is what the reference does.

            "™", never "®". BRAND_MARK stays ™ until the mark is actually
            registered with the IPO; ® on an unregistered mark is a criminal
            offence under the Trade Marks Act 1994 s.95. See lib/content.ts.
          */}
          {/*
            One unbroken line: the mark is a single word, so `nowrap` stops a
            browser hyphenating it and the size is tuned to the character count
            rather than to a generic heading scale. Fifteen uppercase Archivo
            characters run about 9.3em wide, so ~8.4vw fills the container at
            every width without overflowing it.
          */}
          <h1
            id="hero-heading"
            className="display order-1 whitespace-nowrap text-[clamp(1.5rem,8.4vw,8rem)] leading-[0.86] tracking-[-0.045em] text-ink-1000 lg:order-2"
          >
            {site.logotype}
            <span className="align-super text-[0.2em] font-semibold tracking-normal text-ink-700">
              {BRAND_MARK}
            </span>
          </h1>
        </div>
      </div>
    </HeroSequence>
  );
}
