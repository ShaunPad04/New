import HeroVideo from "@/components/HeroVideo";
import HeroCorners from "./HeroCorners";

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
 * The film carries no headline (Shaun, 6 Oct 2026: the heading, sentence, buttons and rating
 * came out of the hero); small corner type (HeroCorners) says what the shop does, where it is
 * and whether it is open. The page keeps its h1 for screen readers and search, visually hidden.
 *
 * The 3D mark that used to live here (HeroMark.tsx, lib/sl-mark.js) is kept in the repo,
 * unused, until this hero is signed off.
 */
const P = "/images/hero/rings";
const land = (f: "first" | "last", ext: string) => [1280, 1920, 2560].map((w) => `${P}-${f}-land-${w}.${ext} ${w}w`).join(", ");
const port = (f: "first" | "last", ext: string) => [720, 1080].map((w) => `${P}-${f}-port-${w}.${ext} ${w}w`).join(", ");

export default function Hero() {
  return (
    <section className="hero-video on-black" aria-labelledby="hero-title" data-hero>
      <h1 id="hero-title" className="sr-only">
        S&amp;L Jewellers, Cleethorpes: gold worth wearing
      </h1>
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
      <HeroCorners />
    </section>
  );
}
