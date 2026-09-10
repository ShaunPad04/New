"use client";

import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/lib/content";
import type { Property } from "@/lib/properties";
import { Button } from "@/components/button";
import { HeroSearch } from "@/components/hero-search";
import { HeroSlideshow } from "@/components/hero-slideshow";

/**
 * Hero — one full viewport of photography. A slow zoom-out slideshow of the
 * agency's most premium listings fills the whole stage; the pill, the
 * centred display headline, the two-line description, the button pair and
 * the search bar sit over it on a soft scrim. A bank of mist rises from the
 * lower edge so the next section appears to surface through cloud as it
 * slides over the pinned hero — the reference's cloud transition.
 *
 * Entrance: opacity 0→1 and 60px rise over 1.1s, staggered 0/200/200/300ms
 * (measured on the reference).
 */
export function Hero({ slides }: { slides: Property[] }) {
  const reduced = useReducedMotion();
  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section className="relative z-0 min-h-[100svh] overflow-hidden bg-ink lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-[680px]" aria-labelledby="hero-heading">
      <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pb-44 pt-[112px] text-center md:pb-40 lg:h-full lg:min-h-0">
        <div className="pointer-events-auto flex w-full flex-col items-center">
          <motion.p {...rise(0)} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm text-white">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white" />
            {hero.eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.2)} id="hero-heading" className="display-hero max-w-[1254px] text-white [text-shadow:0_2px_30px_rgba(8,11,15,0.35)] lg:text-[clamp(2.75rem,6.2vw,88px)]">
            {hero.headline}
          </motion.h1>
          <motion.p {...rise(0.2)} className="lede mt-4 max-w-[600px] text-white/90 [text-shadow:0_1px_18px_rgba(8,11,15,0.45)]">
            {hero.copy}
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-6 flex flex-wrap items-center justify-center gap-[10px]">
            <Button href={hero.primary.href} variant="white">{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline" arrow={false} className="border-white/60 text-white hover:border-white">{hero.secondary.label}</Button>
          </motion.div>
          <motion.div {...rise(0.4)} className="mt-7 w-full max-w-[880px]">
            <HeroSearch />
          </motion.div>
        </div>
      </div>

      <HeroSlideshow properties={slides} overlay className="absolute inset-0 z-0 aspect-auto h-full" />
    </section>
  );
}
