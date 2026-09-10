"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/properties";
import { SectionHeading } from "@/components/section-heading";

/**
 * "Highlighted home" — the reference pins a 100vh stage for 2500px of
 * scroll. A 400×276 media tile (20px radius) sits centred and scales from
 * 1× to ~5× linearly with scroll until it fills the viewport, while a row of
 * 56px slate words behind it drifts sideways (≈20px per 400px of scroll).
 * Here the tile is the highlighted listing's photograph, linking to it.
 */
export function Highlight({ property }: { property: Property }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // The zoom completes by 55% of the runway and holds for the rest, so the
  // caption and link stay on screen for ~140vh of scroll instead of flashing.
  const scale = useTransform(scrollYProgress, [0, 0.55], [1, 4.6]);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const radius = useTransform(scrollYProgress, [0.4, 0.58], [20, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const img = property.images[0];
  const price = formatPrice(property);
  const words = ["Nationwide new homes", "Part exchange", "Assisted move", "Sell with us"];

  if (reduced) {
    return (
      <section className="relative z-10 bg-white" aria-labelledby="highlight-heading">
        <div className="container section">
          <SectionHeading eyebrow="Highlighted home" title="One to see this week" description={`${property.title} — ${price.qualifier ? `${price.qualifier} ` : ""}${price.amount}.`} />
          <Link href={`/properties/${property.slug}`} className="relative mt-16 block aspect-[16/9] overflow-hidden rounded-[20px]">
            {img ? <Image src={img.src} alt={img.alt} fill quality={85} sizes="100vw" className="object-cover" /> : null}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 bg-white" aria-labelledby="highlight-heading">
      <div className="container pt-20">
        <SectionHeading eyebrow="Highlighted home" title="One to see this week" description={`${property.title} — ${price.qualifier ? `${price.qualifier} ` : ""}${price.amount}. Scroll to take a closer look.`} />
      </div>
      <div ref={ref} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <motion.div aria-hidden="true" style={{ x }} className="absolute left-0 flex w-max items-center gap-8 whitespace-nowrap text-[40px] font-semibold text-slate md:text-[56px]">
            {[...words, ...words].map((w, i) => (
              <span key={i} className="flex items-center gap-8">{w}<span className="h-2 w-2 rounded-full bg-slate" /></span>
            ))}
          </motion.div>
          <motion.div style={{ scale, borderRadius: radius }} className="relative z-10 h-[276px] w-[400px] max-w-[85vw] overflow-hidden bg-mist will-change-transform">
            <Link href={`/properties/${property.slug}`} aria-label={`${property.title} — view this property`} className="block h-full w-full">
              {img ? <Image src={img.src} alt={img.alt} fill quality={85} sizes="100vw" className="object-cover" /> : null}
            </Link>
          </motion.div>
          <motion.div style={{ opacity: captionOpacity }} className="absolute inset-x-0 bottom-8 z-20 flex justify-center px-5">
            <Link href={`/properties/${property.slug}`} className="flex flex-col items-center gap-1 rounded-[15px] bg-ink-deep/55 px-8 py-5 text-center text-white backdrop-blur-sm transition-opacity hover:opacity-90">
              <span className="text-sm text-cloud">{price.qualifier ? `${price.qualifier} ` : ""}{price.amount}</span>
              <span className="h-sub">{property.title}</span>
              <span className="mt-1 text-sm underline underline-offset-4">View this property</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
