"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

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
          /* Designed CSS fallback: layered radial light against pure black,
             reading as raked studio lighting on a dark surface. */
          <div className="absolute inset-0 bg-ink-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 78% 18%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 28%, transparent 62%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 70% at 12% 96%, rgba(255,255,255,0.10) 0%, transparent 55%)",
              }}
            />
            {/* Hairline geometry — the "blackline" motif. */}
            <div
              className="absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "min(18vw, 220px) 100%",
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
        <p className="eyebrow mb-8">
          Est. 2026 — Founder-led studio
        </p>

        <h1
          id="hero-heading"
          className="display text-display-xl max-w-[15ch] text-ink-1000"
        >
          Design that trades on{" "}
          <span className="display-serif italic text-ink-900">presence</span>.
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
