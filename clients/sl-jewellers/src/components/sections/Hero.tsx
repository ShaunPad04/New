import HeroMark from "@/components/HeroMark";
import HeroCorners from "./HeroCorners";

/**
 * One-screen hero: the S&L mark in 3D (HeroMark; Brad, 9 Oct 2026, in place of the film of the
 * hand and the rings). It sits under the transparent header (pulled up by the header's
 * height), and the header turns to glass once this section has scrolled past (`data-hero`,
 * read by MotionRoot). It scrolls away with the page; the mark answers the scroll itself.
 * The spot (direction A) and the words (direction C) are layers under the mark, shown by the
 * preview's ?v=hero switch (see HeroMark.tsx and "Hero directions" in globals.css).
 *
 * The poster of the mark is painted by the server, so the page is whole before any script
 * runs; the model takes over from it in place. No headline (Shaun, 6 Oct 2026: the heading,
 * sentence, buttons and rating came out of the hero); small corner type (HeroCorners) says
 * what the shop does. The page keeps its h1 for screen readers and search, visually hidden.
 *
 * The same mark opens the About page (AboutMark.tsx) and, on a computer, sits in the footer
 * (FooterMark.tsx).
 */
export default function Hero() {
  return (
    <section className="hero-3d on-black" aria-labelledby="hero-title" data-hero>
      <h1 id="hero-title" className="sr-only">
        S&amp;L Jewellers, Cleethorpes: gold worth wearing
      </h1>
      <div className="hero-media">
        <div className="hero-spot" aria-hidden="true" />
        <p className="hero-word" aria-hidden="true">
          <span>Gold</span>
          <span>worth</span>
          <span>wearing.</span>
        </p>
        <HeroMark />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <HeroCorners />
    </section>
  );
}
