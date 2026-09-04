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

        {/*
          The display headline was removed so the scroll sequence carries the
          hero on its own. The page still needs exactly one <h1>: it anchors
          the document outline, it is what search engines read as the page
          title, and `aria-labelledby` on the hero section points at it. So it
          stays in the DOM, visually hidden but fully available to assistive
          technology and crawlers.
        */}
        <h1 id="hero-heading" className="sr-only">
          Black Line Agency{BRAND_MARK} — web design and online marketing,
          founder-led, London
        </h1>

        <div className="flex flex-col gap-10 border-t border-ink-400/60 pt-8 lg:flex-row lg:items-end lg:justify-between">
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
