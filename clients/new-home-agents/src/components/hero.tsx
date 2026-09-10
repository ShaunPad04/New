"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionStyle } from "motion/react";
import { hero } from "@/lib/content";
import type { Property } from "@/lib/properties";
import { Button } from "@/components/button";
import { Sky } from "@/components/clouds";
import { HeroSearch } from "@/components/hero-search";
import { HeroSlideshow } from "@/components/hero-slideshow";

/**
 * Hero — the reference's scroll-craft composition. At rest: a sky plate with
 * drifting cloud, a pill, the centred display headline, a two-line
 * description, the button pair and the search bar, with the photograph
 * (here a slow zoom-out slideshow of the agency's most premium listings)
 * sitting in the lower half, its top edge dissolved into the sky. As the
 * page scrolls, the photograph rises and scales up over the headline, and
 * a bank of mist along its lower edge meets the white page sliding in over
 * the pinned hero.
 *
 * Entrance: opacity 0→1 and 60px rise over 1.1s, staggered 0/200/200/300ms
 * (measured on the reference). Scroll motion is transform-only and is off
 * under prefers-reduced-motion.
 */
export function Hero({ slides }: { slides: Property[] }) {
  const reduced = useReducedMotion();
  const vh = useViewportHeight();
  const desktop = useIsDesktop();
  const { scrollY } = useScroll();
  // Choreography over the hero's scroll runway (page.tsx gives the pinned
  // hero 150svh of runway before the white page slides in over it):
  //   0 → 0.45vh  the photograph rises and scales over the copy
  //   0.2 → 0.6vh the mist climbs the photograph
  //   0.5vh →     the white page arrives, cloud bank first
  const stageY = useTransform(scrollY, [0, vh * 0.45], [0, -vh * 0.56]);
  const stageScale = useTransform(scrollY, [0, vh * 0.45], [1, 1.5]);
  const copyY = useTransform(scrollY, [0, vh * 0.45], [0, -90]);
  const copyOpacity = useTransform(scrollY, [0, vh * 0.38], [1, 0]);
  const chromeOpacity = useTransform(scrollY, [0, vh * 0.15], [1, 0]);
  const mistY = useTransform(scrollY, [vh * 0.2, vh * 0.6], ["34%", "-26%"]);
  const mistOpacity = useTransform(scrollY, [vh * 0.15, vh * 0.5], [0.12, 1]);
  const animate = desktop && !reduced;
  const scroll = animate ? { y: stageY, scale: stageScale } : {};
  const copyScroll = animate ? { y: copyY, opacity: copyOpacity } : {};
  const mistScroll = animate ? { y: mistY, opacity: mistOpacity } : {};
  const chromeScroll: MotionStyle = animate ? { opacity: chromeOpacity } : {};

  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section className="relative z-0 lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-[720px]" aria-labelledby="hero-heading">
      <Sky className="h-full" innerClassName="flex min-h-[100svh] flex-col lg:h-full lg:min-h-0">
        <motion.div style={copyScroll} className="container relative z-10 flex shrink-0 flex-col items-center pt-[120px] text-center md:pt-[132px]">
          <motion.p {...rise(0)} className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-sm text-slate">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink" />
            {hero.eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.2)} id="hero-heading" className="display-hero max-w-[1254px] text-ink lg:text-[clamp(2.75rem,6.2vw,88px)]">
            {hero.headline}
          </motion.h1>
          <motion.p {...rise(0.2)} className="lede mt-3 max-w-[600px]">
            {hero.copy}
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-5 flex flex-wrap items-center justify-center gap-[10px]">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline" arrow={false}>{hero.secondary.label}</Button>
          </motion.div>
          <motion.div {...rise(0.4)} className="mt-6 w-full max-w-[880px]">
            <HeroSearch />
          </motion.div>
        </motion.div>

        {/* Photograph stage: in flow on phones, pinned to the lower half on desktop, rising and scaling on scroll. */}
        <motion.div
          style={scroll}
          className="pointer-events-none relative z-20 mt-8 aspect-[4/5] w-full origin-top will-change-transform sm:aspect-[4/3] md:aspect-[1440/931] lg:absolute lg:inset-x-0 lg:-bottom-[20%] lg:top-[52%] lg:mt-0 lg:aspect-auto"
        >
          <div className="absolute inset-0 hero-stage-mask">
            <HeroSlideshow properties={slides} chromeStyle={chromeScroll} className="absolute inset-0 aspect-auto h-full" />
          </div>
          <motion.div aria-hidden="true" style={mistScroll} className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] will-change-transform">
            <div className={"cloud mist-a" + (reduced ? "" : " cloud-drift-slow")} />
            <div className={"cloud mist-b" + (reduced ? "" : " cloud-drift")} />
            <div className={"cloud mist-c" + (reduced ? "" : " cloud-drift-slow")} />
            <div className="cloud mist-d" />
          </motion.div>
        </motion.div>
      </Sky>
    </section>
  );
}

const subscribe = (cb: () => void) => { window.addEventListener("resize", cb); return () => window.removeEventListener("resize", cb); };
function useViewportHeight() {
  return useSyncExternalStore(subscribe, () => window.innerHeight, () => 900);
}
function useIsDesktop() {
  return useSyncExternalStore(subscribe, () => window.matchMedia("(min-width: 1024px)").matches, () => false);
}
