"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { useMobile } from "@/lib/use-mobile";

/** HEVC first for Safari, iPhone and Mac — same score at ~75% of the bytes; others fall to H.264. */
const HEVC = 'video/mp4; codecs="hvc1.1.6.L120.B0"';

/**
 * "A closer look" — the reference pins a 100vh stage for 2500px of scroll.
 * A 400×276 media tile (20px radius) sits centred and scales from 1× to
 * ~5× with scroll until it fills the viewport, while a row of 56px slate
 * words behind it drifts sideways. The tile plays Brad's film
 * (public/video/highlight.mp4, muted, looping, poster frame first). The
 * film is not one of the agency's listings, so the tile is a brand moment
 * that links to the full property search rather than to a listing — the
 * tile itself is the link. No caption is overlaid on the film — Brad asked
 * for the tile to be clean.
 */
export function Highlight() {
  const ref = useRef<HTMLDivElement>(null);
  const tile = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const mobile = useMobile();
  useEffect(() => { if (mobile !== null) video.current?.load(); }, [mobile]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // The zoom completes by half of the runway and holds for the rest, so the
  // film and link stay on screen for ~100vh without the section dragging.
  // The end scale is measured, not fixed: whatever it takes for the tile to
  // cover the viewport edge to edge, on any screen (a 1920 screen needs 4.8×
  // where 1440 needs 3.6×), with a little overshoot so no hairline shows.
  const cover = useMotionValue(4.6);
  useEffect(() => {
    const measure = () => {
      const el = tile.current;
      if (!el) return;
      cover.set(Math.max(window.innerWidth / el.offsetWidth, window.innerHeight / el.offsetHeight) * 1.03);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [cover]);
  const scale = useTransform(() => 1 + (cover.get() - 1) * Math.min(1, scrollYProgress.get() / 0.5));
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const radius = useTransform(scrollYProgress, [0.35, 0.52], [20, 0]);
  const words = ["Nationwide new homes", "Part exchange", "Assisted move", "Sell with us"];

  if (reduced) {
    return (
      <section className="relative z-10 bg-white" aria-labelledby="highlight-heading">
        <div className="container section">
          <SectionHeading eyebrow="A closer look" title="Homes worth slowing down for" description="Explore every home listed with us." />
          <Link href="/properties" aria-label="Explore all properties" className="relative mt-16 block aspect-[16/9] overflow-hidden rounded-[20px] bg-mist">
            <Image src="/video/highlight-poster.webp" alt="" fill quality={85} sizes="100vw" className="object-cover" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 bg-white" aria-labelledby="highlight-heading">
      <div className="container pt-20">
        <SectionHeading eyebrow="A closer look" title="Homes worth slowing down for" description="Scroll to take a closer look, then explore every home listed with us." />
      </div>
      <div ref={ref} className="relative h-[160vh] md:h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <motion.div aria-hidden="true" style={{ x }} className="absolute left-0 flex w-max items-center gap-8 whitespace-nowrap text-[40px] font-semibold text-slate md:text-[56px]">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="flex items-center gap-8">{w}<span className="h-2 w-2 rounded-full bg-slate" /></span>
            ))}
          </motion.div>
          <motion.div ref={tile} style={{ scale, borderRadius: radius }} className="relative z-10 h-[276px] w-[400px] max-w-[85vw] overflow-hidden bg-mist will-change-transform">
            <Link href="/properties" aria-label="Explore all properties" className="block h-full w-full">
              <video
                ref={video}
                className="h-full w-full object-cover"
                poster="/video/highlight-poster.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                {/* Phones get H.264 only: at 540p the HEVC came out larger than the H.264. */}
                {mobile === null ? null : mobile ? (
                  <source src="/video/highlight-m.mp4" type="video/mp4" />
                ) : (
                  <>
                    <source src="/video/highlight-hevc.mp4" type={HEVC} />
                    <source src="/video/highlight.mp4" type="video/mp4" />
                  </>
                )}
              </video>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
