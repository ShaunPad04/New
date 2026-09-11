"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/lib/content";
import { Button } from "@/components/button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hero — Brad's film fills the whole stage from the first frame, with the
 * pill, the centred display headline, the description and the button pair
 * over it on a soft scrim. ScrollTrigger pins the stage for 200vh of scroll
 * and scrubs the film's playhead to the scrollbar while the copy lifts away
 * (public/video/hero-scrub.mp4 is encoded with every frame a keyframe, so
 * seeking is instant). Under prefers-reduced-motion the poster sits still
 * and nothing is pinned.
 *
 * Entrance: opacity 0→1 and 60px rise over 1.1s, staggered 0/200/200/300ms
 * (measured on the reference).
 */
export function Hero() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const v = video.current;
      const st = stage.current;
      if (reduced || !v || !st) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "+=200%",
          pin: st,
          scrub: 0.6,
          onUpdate: (self) => { if (v.duration) v.currentTime = self.progress * v.duration; },
        },
      });
      // The copy lifts away over the first third of the runway; the rest is the film alone.
      tl.to(copy.current, { y: -80, opacity: 0, ease: "none", duration: 0.3 }, 0).to({}, { duration: 0.7 }, 0.3);
      const sync = () => { const s = tl.scrollTrigger; if (s && v.duration) v.currentTime = s.progress * v.duration; };
      v.addEventListener("loadedmetadata", sync);
      return () => v.removeEventListener("loadedmetadata", sync);
    },
    { scope: wrap, dependencies: [reduced] }
  );

  const rise = (delay: number) =>
    reduced
      ? {}
      : { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section ref={wrap} className="relative z-0" aria-labelledby="hero-heading">
      <div ref={stage} data-hero-stage className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
        {/* The film, full-bleed. */}
        <div data-hero-plate className="absolute inset-0">
          {reduced ? (
            <Image src="/video/hero-poster.jpg" alt="" fill priority quality={85} sizes="100vw" className="object-cover" />
          ) : (
            <video
              ref={video}
              className="absolute inset-0 h-full w-full object-cover"
              poster="/video/hero-poster.jpg"
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            >
              <source src="/video/hero-scrub.mp4" type="video/mp4" />
              <source src="/video/hero-scrub.webm" type="video/webm" />
            </video>
          )}
          {/* Scrim so the white copy reads over any frame. */}
          <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(8,11,15,0.55),transparent_72%)]" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/50 to-transparent" />
        </div>

        <div ref={copy} data-hero-copy className="container relative z-10 flex h-full flex-col items-center justify-center pb-10 pt-[84px] text-center">
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
        </div>
      </div>
    </section>
  );
}
