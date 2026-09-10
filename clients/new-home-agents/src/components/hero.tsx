"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion } from "motion/react";
import { hero } from "@/lib/content";
import { Button } from "@/components/button";
import { Sky } from "@/components/clouds";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Hero — GSAP scroll-scrubbed film (Brad's ask). At rest: the sky-gradient
 * plate, a pill, the centred display headline, a two-line description and
 * the button pair, with the film's first frame in a 20px-radius plate the
 * width of the container. ScrollTrigger pins the stage for 220vh of scroll
 * and scrubs everything to the scrollbar: the copy lifts away, the plate
 * grows until it fills the viewport, and the film's playhead follows the
 * scroll (public/video/hero-scrub.mp4 is encoded with every frame a
 * keyframe so seeking is instant). Under prefers-reduced-motion the poster
 * sits still in the plate and nothing is pinned.
 *
 * Entrance: opacity 0→1 and 60px rise over 1.1s, staggered 0/200/200/300ms
 * (measured on the reference).
 */
export function Hero() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const v = video.current;
      const pl = plate.current;
      const st = stage.current;
      if (reduced || !v || !pl || !st) return;
      // How far the plate must scale (about its centre) and shift to cover the pinned stage.
      const fit = () => {
        const rs = st.getBoundingClientRect();
        const r = pl.getBoundingClientRect();
        return { scale: Math.max(rs.width / r.width, rs.height / r.height) * 1.002, y: rs.top + rs.height / 2 - (r.top + r.height / 2) };
      };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: "+=220%",
          pin: st,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => { if (v.duration) v.currentTime = self.progress * v.duration; },
        },
      });
      tl.to(copy.current, { y: -90, opacity: 0, ease: "none", duration: 0.32 }, 0)
        .to(pl, { scale: () => fit().scale, y: () => fit().y, borderRadius: 0, ease: "none", duration: 0.7 }, 0);
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
      <div ref={stage} data-hero-stage className="relative min-h-[100svh] lg:h-[100svh] lg:min-h-[760px]">
        <Sky className="h-full" innerClassName="flex min-h-[100svh] flex-col lg:h-full lg:min-h-0">
          <div ref={copy} data-hero-copy className="container relative z-20 flex shrink-0 flex-col items-center pt-[116px] text-center md:pt-[128px]">
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

          {/* Film plate: in flow on phones, filling the space below the copy on desktop; GSAP scales it to the stage on scroll. */}
          <motion.div {...rise(0.4)} className="container relative z-10 mt-8 pb-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[47%] lg:mt-0 lg:pb-0">
            <div ref={plate} data-hero-plate className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-ink will-change-transform md:aspect-[16/9] lg:h-full lg:aspect-auto">
              {reduced ? (
                <Image src="/video/hero-poster.jpg" alt="" fill priority quality={85} sizes="(max-width: 1320px) 100vw, 1256px" className="object-cover" />
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
            </div>
          </motion.div>
        </Sky>
      </div>
    </section>
  );
}
