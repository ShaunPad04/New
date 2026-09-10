"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/lib/content";
import { Button } from "@/components/button";
import { Sky } from "@/components/clouds";

/**
 * Hero — the reference composition, still: a sky-gradient plate, a pill,
 * the centred display headline, a two-line description and the button
 * pair, then one photograph in a clean 20px-radius plate the width of the
 * container. On desktop the hero is pinned and the next section slides up
 * over it. No slideshow, no scroll-linked motion, no search bar and no
 * cloud, at Brad's request.
 *
 * `image` is `public/images/hero/hero.jpg` when Brad's supplied photograph
 * is present (see page.tsx), otherwise the highest-value listing photo.
 *
 * Entrance: opacity 0→1 and 60px rise over 1.1s, staggered 0/200/200/300ms
 * (measured on the reference).
 */
export function Hero({ image }: { image: { src: string; alt: string } }) {
  const reduced = useReducedMotion();
  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section className="relative z-0 lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-[760px]" aria-labelledby="hero-heading">
      <Sky className="h-full" innerClassName="flex min-h-[100svh] flex-col lg:h-full lg:min-h-0">
        <div className="container relative z-20 flex shrink-0 flex-col items-center pt-[116px] text-center md:pt-[128px]">
          <motion.p {...rise(0)} className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 text-sm text-slate">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink" />
            {hero.eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.2)} id="hero-heading" className="display-hero max-w-[1254px] text-ink lg:text-[clamp(2.75rem,6vw,84px)]">
            {hero.headline}
          </motion.h1>
          <motion.p {...rise(0.2)} className="lede mt-3 max-w-[600px]">
            {hero.copy}
          </motion.p>
          <motion.div {...rise(0.3)} className="mt-5 flex flex-wrap items-center justify-center gap-[10px]">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} variant="outline" arrow={false}>{hero.secondary.label}</Button>
          </motion.div>
        </div>

        {/* Photograph plate: in flow on phones, filling the space below the copy on desktop. */}
        <motion.div {...rise(0.4)} className="container relative z-10 mt-8 pb-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[47%] lg:mt-0 lg:pb-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-ink shadow-[0_30px_80px_-30px_rgba(8,11,15,0.45)] md:aspect-[16/9] lg:h-full lg:aspect-auto">
            <Image src={image.src} alt={image.alt} fill priority quality={85} sizes="(max-width: 1320px) 100vw, 1256px" className="object-cover object-[50%_60%]" />
          </div>
        </motion.div>
      </Sky>
    </section>
  );
}
