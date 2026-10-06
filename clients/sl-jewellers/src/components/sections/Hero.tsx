import Link from "next/link";
import { BUSINESS, HOURS_ON, REVIEWS } from "@/lib/content";
import HeroVideo from "@/components/HeroVideo";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";
import MagneticButton from "@/components/motion/MagneticButton";

/**
 * One-screen film hero. It sits under the transparent header (pulled up by the header's
 * height), and the header turns to glass once this section has scrolled past
 * (`data-hero`, read by MotionRoot).
 *
 * The poster is the film's own first frame, painted by the server, so the page is whole
 * before any script runs; HeroVideo then lays the film over it. Portrait screens get the
 * 9:16 crop. Under reduced motion there is no film: the still is the clip's last frame,
 * the close-up of the rings.
 *
 * The 3D mark that used to live here (HeroMark.tsx, lib/sl-mark.js) is kept in the repo,
 * unused, until this hero is signed off.
 */
const P = "/images/hero/rings";
const land = (f: "first" | "last", ext: string) => [1280, 1920, 2560].map((w) => `${P}-${f}-land-${w}.${ext} ${w}w`).join(", ");
const LEDE =
  "Chains, watches and gold, bought and sold over the counter at 49 Cambridge Street. Bring your gold in and it gets weighed and priced right in front of you.";
const port = (f: "first" | "last", ext: string) => [720, 1080].map((w) => `${P}-${f}-port-${w}.${ext} ${w}w`).join(", ");

export default function Hero() {
  const g = REVIEWS.google;
  return (
    <>
      <section className="hero-video on-black" aria-labelledby="hero-title" data-hero>
        <div className="hero-media">
          <picture>
            <source media="(prefers-reduced-motion: reduce) and (orientation: portrait)" type="image/avif" srcSet={port("last", "avif")} sizes="100vw" />
            <source media="(prefers-reduced-motion: reduce) and (orientation: portrait)" type="image/webp" srcSet={port("last", "webp")} sizes="100vw" />
            <source media="(prefers-reduced-motion: reduce)" type="image/avif" srcSet={land("last", "avif")} sizes="100vw" />
            <source media="(prefers-reduced-motion: reduce)" type="image/webp" srcSet={land("last", "webp")} sizes="100vw" />
            <source media="(orientation: portrait)" type="image/avif" srcSet={port("first", "avif")} sizes="100vw" />
            <source media="(orientation: portrait)" type="image/webp" srcSet={port("first", "webp")} sizes="100vw" />
            <source type="image/avif" srcSet={land("first", "avif")} sizes="100vw" />
            <img
              className="hero-still"
              src={`${P}-first-land-1920.webp`}
              srcSet={land("first", "webp")}
              sizes="100vw"
              alt=""
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <HeroVideo />
        </div>
        <div className="hero-shade" aria-hidden="true" />

        <div className="hero-copy wrap">
          <div>
            <p className="eyebrow mb-4">Gold, watches, no nonsense</p>
            <SplitHeading as="h1" id="hero-title" load text={"Gold worth\n*wearing.*"} className="display-xl" />
          </div>
          <div className="hero-copy-side">
            {/* Phones read this just under the film (below), so the copy over it stays clear of the rings */}
            <p className="hidden max-w-[46ch] text-xl text-paper/85 md:block">{LEDE}</p>
            <div className="flex flex-wrap items-center gap-3 md:mt-6">
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
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3 md:mt-5">
              <a href={g.url} target="_blank" rel="noopener" className="inline-flex items-center gap-2 py-2.5 text-sm font-semibold no-underline">
                <span className="stars" aria-hidden="true">★★★★★</span>
                <span className="tnum">
                  {g.rating.toFixed(1)} · {g.reviewCount} Google reviews
                </span>
                <span className="sr-only">, rated {g.rating} out of 5. Read them on Google.</span>
              </a>
              {HOURS_ON && (
                <span className="hidden md:inline-flex">
                  <OpenNowChip />
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="hero-standfirst on-black wrap md:hidden">
        <p className="text-lg text-paper/85">{LEDE}</p>
        {HOURS_ON && <OpenNowChip className="mt-4" />}
      </div>
    </>
  );
}
