import { BRAND_MARK } from "@/lib/content";
import { Cta } from "@/components/cta";
import { HeroSequence } from "@/components/hero-sequence";

/**
 * HERO
 *
 * The backdrop is a scroll-driven frame sequence (see `hero-sequence.tsx`):
 * the section pins and scroll position — not a video clock — owns which frame
 * is on screen. Scrolling back reverses it; stopping freezes on that frame.
 *
 * The copy is a plain server-rendered block sitting above the canvas. It is
 * deliberately NOT animated and NOT client-gated: the <h1> is the LCP element,
 * so it must paint on the first frame of HTML regardless of hydration, motion
 * preference, or whether a single image has decoded yet.
 */
export function Hero() {
  return (
    <HeroSequence>
      <div className="relative mx-auto w-full max-w-[1600px] px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28">
        <p className="eyebrow mb-8">Founder-led studio — London</p>

        <h1
          id="hero-heading"
          className="display-xl text-display-xl max-w-[13ch] text-ink-1000"
        >
          Design that trades on presence
          <span className="brand-mark text-ink-700">{BRAND_MARK}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 border-t border-ink-400/60 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="lede max-w-[52ch]">
            We build websites that look expensive because they are engineered
            like it — then run the search, email and SMS that keep them
            earning.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Cta href="#contact">Start a project</Cta>
            <Cta href="#work" variant="ghost">
              See the work
            </Cta>
          </div>
        </div>
      </div>
    </HeroSequence>
  );
}
