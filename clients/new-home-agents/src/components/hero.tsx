"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { hero, site } from "@/lib/content";
import type { Property } from "@/lib/properties";
import { Button } from "@/components/button";
import { Sky } from "@/components/clouds";
import { HeroSearch } from "@/components/hero-search";

/**
 * Hero — reference composition: a sky plate with drifting cloud layers,
 * a small pill above a centred 100px display headline, a two-line 18px
 * description in a 600px column, a black + outline button pair, then a
 * full-bleed photograph (1440×931) whose top edge sits under the copy and
 * whose lower edge the clouds overlap. The whole hero is sticky so the next
 * section slides over it.
 *
 * Entrance: opacity 0→1 and 60px rise over 1.1s, staggered 0/200/200/300ms
 * (measured on the reference).
 */
export function Hero({ image }: { image: Property | undefined }) {
  const reduced = useReducedMotion();
  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const } };
  const photo = image?.images[0];

  return (
    <section className="sticky top-0 z-0" aria-labelledby="hero-heading">
      <Sky className="pb-0">
        <div className="container relative z-10 flex flex-col items-center pt-[150px] text-center md:pt-[180px]">
          <motion.p {...rise(0)} className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-sm text-slate backdrop-blur-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink" />
            {hero.eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.2)} id="hero-heading" className="display-hero max-w-[1254px] text-ink">
            {hero.headline}
          </motion.h1>
          <motion.p {...rise(0.2)} className="lede mt-3 max-w-[600px]">
            {hero.copy}
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-5 flex flex-wrap items-center justify-center gap-[10px]">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline" arrow={false}>{hero.secondary.label}</Button>
          </motion.div>
          <motion.div {...rise(0.4)} className="mt-8 w-full max-w-[880px]">
            <HeroSearch />
          </motion.div>
        </div>

        <div className="relative mt-10 md:mt-14">
          <div className="relative aspect-[1440/931] w-full">
            {photo ? (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-ink/10" />
            )}
            {/* Clouds overlapping the photograph's lower edge, as on the reference. */}
            <div aria-hidden="true" className="cloud cloud-a !top-auto !bottom-[-38%] !left-[-15%] !h-[55%] !w-[60%] !opacity-50" />
            <div aria-hidden="true" className="cloud cloud-b !top-auto !bottom-[-42%] !right-[-20%] !h-[60%] !w-[60%] !opacity-40" />
          </div>
          {image ? (
            <p className="absolute bottom-4 right-4 z-10 rounded-full bg-white/80 px-3 py-1 text-xs text-slate backdrop-blur-sm">
              Pictured: {image.title} · listed by {site.name}
            </p>
          ) : null}
        </div>
      </Sky>
    </section>
  );
}
