"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { BRAND_MARK } from "@/lib/content";

/**
 * SCROLL-CRAFT HERO
 *
 * The backdrop is scaled and drifted against the scroll position while the
 * headline rises and the whole plate dims into the section below it.
 *
 * Two important constraints shaped this:
 *
 * 1. The LCP element is the headline, not the backdrop. Text paints
 *    immediately and is never gated behind an animation — under reduced
 *    motion, and before hydration, it is simply visible.
 *
 * 2. `heroSrc` is resolved at build time by the server component. When no
 *    photographic asset is present the CSS plate below stands in on its own;
 *    it is a designed fallback, not a broken-image state.
 */
export function Hero({ heroSrc }: { heroSrc: string | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Backdrop drifts up slower than the page and scales in — classic parallax
  // depth. Kept subtle; anything more reads as a gimmick at this size.
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const plateOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-38%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const motionPlate = reduced ? {} : { y: plateY, scale: plateScale, opacity: plateOpacity };
  const motionCopy = reduced ? {} : { y: copyY, opacity: copyOpacity };

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* ---------- Backdrop plate ---------- */}
      <motion.div
        style={motionPlate}
        className="absolute inset-0 -z-10 will-change-transform"
        aria-hidden="true"
      >
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          /* ── GENERATED HERO PLATE ──
             No photograph has been supplied, so this is the hero rather than
             a stopgap: a raked key light sweeping across a black surface,
             a soft counter-bounce, the "black line" motif as hairline
             geometry, and a vignette to seat it. Pure CSS, so it costs
             nothing over the wire and never shifts layout. */
          <div className="absolute inset-0 bg-ink-0">
            {/* Key light, upper right. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(75% 55% at 76% 12%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.09) 30%, rgba(255,255,255,0.02) 55%, transparent 72%)",
              }}
            />
            {/* Cool counter-bounce, lower left. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 6% 92%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 34%, transparent 62%)",
              }}
            />
            {/* Specular sweep — the highlight rolling off a gloss surface. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(102deg, transparent 34%, rgba(255,255,255,0.10) 48%, rgba(255,255,255,0.16) 51%, rgba(255,255,255,0.05) 55%, transparent 68%)",
              }}
            />
            {/* The blackline motif: hairlines that thin out toward the copy. */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.55) 1px, transparent 1px)",
                backgroundSize: "min(14vw, 190px) 100%",
                maskImage:
                  "linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.28) 45%, transparent 78%)",
                WebkitMaskImage:
                  "linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.28) 45%, transparent 78%)",
                opacity: 0.42,
              }}
            />
            {/* One heavier rule, echoing the mark. */}
            <div
              className="absolute inset-y-0 right-[18%] w-px"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.42) 38%, rgba(255,255,255,0.14) 72%, transparent 100%)",
              }}
            />
            {/* Vignette. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 85% at 50% 45%, transparent 42%, rgba(0,0,0,0.55) 88%, rgba(0,0,0,0.85) 100%)",
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Legibility scrim + blend into the next section. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-0 via-ink-0/55 to-ink-0/25"
      />

      {/* ---------- Copy ---------- */}
      <motion.div
        style={motionCopy}
        className="relative mx-auto w-full max-w-[1600px] px-6 pb-20 sm:px-10 lg:px-16 lg:pb-28"
      >
        <p className="eyebrow mb-8">Founder-led studio — London</p>

        <h1
          id="hero-heading"
          className="display-xl text-display-xl max-w-[13ch] text-ink-1000"
        >
          Design that trades on presence
          <span className="brand-mark text-ink-700">{BRAND_MARK}</span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 border-t border-ink-400/60 pt-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="lede max-w-[52ch]">
            We build websites that look expensive because they are engineered
            like it — then run the search, email and SMS that keep them
            earning.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-ink-1000 px-7 py-4 text-sm font-medium tracking-tight text-ink-0 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.03]"
            >
              Start a project
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="#work"
              className="inline-flex items-center gap-3 rounded-full border border-ink-500 px-7 py-4 text-sm font-medium tracking-tight text-ink-900 transition-colors duration-300 hover:border-ink-800 hover:text-ink-1000"
            >
              See the work
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
