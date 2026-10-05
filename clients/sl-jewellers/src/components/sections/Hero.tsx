import Link from "next/link";
import { BUSINESS, HOURS_ON, REVIEWS } from "@/lib/content";
import HeroMark from "@/components/HeroMark";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";
import MagneticButton from "@/components/motion/MagneticButton";

/**
 * Pinned, scroll-scrubbed hero. The section is 3.8 viewports tall; the stage
 * is sticky inside it. Progress (--p, 0..1) is written by HeroMark and drives
 * the mark (turn, come apart, seat, keep turning) and three caption bands in
 * pure CSS: open, journey, settle. Reduced motion collapses it to one screen
 * showing the settle state.
 */
export default function Hero() {
  const g = REVIEWS.google;
  return (
    <section className="hero-pin on-black" aria-labelledby="hero-title" data-phase="open" style={{ ["--p" as string]: 0 }}>
      <div className="hero-sticky">
        <HeroMark />
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-band band-open wrap">
          <p className="eyebrow">Cleethorpes · Independent · Straight talking</p>
          {/* Fades with the band it sits in, so it is gone as soon as scrolling starts. */}
          <span className="scroll-cue" aria-hidden="true">
            <span className="scroll-cue-dot" />
          </span>
        </div>

        <div className="hero-band band-settle wrap">
          <div className="max-w-[640px]">
            <p className="eyebrow mb-4">Gold, watches, no nonsense</p>
            <SplitHeading as="h1" id="hero-title" text={"Gold worth\n*wearing.*"} className="display-xl" />
            <p className="mt-6 max-w-[46ch] text-lg text-paper/85 md:text-xl">
              Chains, watches and gold, bought and sold over the counter at 49 Cambridge Street. Bring your gold in and it gets weighed and priced right in front of you.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <MagneticButton>
                <Link href="/enquiry" className="btn btn-metal">
                  Make an enquiry
                </Link>
              </MagneticButton>
              <MagneticButton>
                <a href={BUSINESS.social.google.directionsUrl} target="_blank" rel="noopener" className="btn btn-metal">
                  Pull up to the shop
                </a>
              </MagneticButton>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href={g.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 py-2.5 text-sm font-semibold no-underline">
                <span className="stars" aria-hidden="true">★★★★★</span>
                <span className="tnum">
                  {g.rating.toFixed(1)} · {g.reviewCount} Google reviews
                </span>
                <span className="sr-only">, rated {g.rating} out of 5. Read them on Google.</span>
              </a>
              {HOURS_ON && <OpenNowChip />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
