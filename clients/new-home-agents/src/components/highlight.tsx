"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/section-heading";

/**
 * "A closer look" — the reference pins a 100vh stage for 2500px of scroll.
 * A 400×276 media tile (20px radius) sits centred and scales from 1× to
 * ~5× with scroll until it fills the viewport, while a row of 56px slate
 * words behind it drifts sideways. The tile plays Brad's film
 * (public/video/highlight.mp4, muted, looping, poster frame first). The
 * film is not one of the agency's listings, so the tile is a brand moment
 * that links to the full property search rather than to a listing — the
 * `property` prop is kept for the reduced-motion fallback's caption.
 */
export function Highlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // The zoom completes by half of a 220vh runway and holds for the rest, so
  // the film and link stay on screen for ~100vh without the section dragging.
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 4.6]);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const radius = useTransform(scrollYProgress, [0.35, 0.52], [20, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);
  const words = ["Nationwide new homes", "Part exchange", "Assisted move", "Sell with us"];

  if (reduced) {
    return (
      <section className="relative z-10 bg-white" aria-labelledby="highlight-heading">
        <div className="container section">
          <SectionHeading eyebrow="A closer look" title="Homes worth slowing down for" description="Explore every home listed with us." />
          <Link href="/properties" aria-label="Explore all properties" className="relative mt-16 block aspect-[16/9] overflow-hidden rounded-[20px] bg-mist">
            <Image src="/video/highlight-poster.jpg" alt="" fill quality={85} sizes="100vw" className="object-cover" />
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
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <motion.div aria-hidden="true" style={{ x }} className="absolute left-0 flex w-max items-center gap-8 whitespace-nowrap text-[40px] font-semibold text-slate md:text-[56px]">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="flex items-center gap-8">{w}<span className="h-2 w-2 rounded-full bg-slate" /></span>
            ))}
          </motion.div>
          <motion.div style={{ scale, borderRadius: radius }} className="relative z-10 h-[276px] w-[400px] max-w-[85vw] overflow-hidden bg-mist will-change-transform">
            <Link href="/properties" aria-label="Explore all properties" className="block h-full w-full">
              <video
                className="h-full w-full object-cover"
                src="/video/highlight.mp4"
                poster="/video/highlight-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
          <motion.div style={{ opacity: captionOpacity }} className="absolute inset-x-0 bottom-8 z-20 flex justify-center px-5">
            <Link href="/properties" className="flex flex-col items-center gap-1 rounded-[15px] bg-ink-deep/55 px-8 py-5 text-center text-white backdrop-blur-sm transition-opacity hover:opacity-90">
              <span className="text-sm text-cloud">Nationwide new homes, part exchange and assisted move</span>
              <span className="h-sub">Find your next home</span>
              <span className="mt-1 text-sm underline underline-offset-4">Explore all properties</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
