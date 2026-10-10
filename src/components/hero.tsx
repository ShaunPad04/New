"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { BRAND_MARK, site } from "@/lib/content";
import { Cta } from "@/components/cta";

/**
 * EDITORIAL STAGE HERO
 *
 * Built to the composition the client referenced: a full-bleed dark stage
 * under a triangulated wire mesh, information anchored into the corners
 * rather than centred, rotated microtype down the right margin, and an
 * oversized three-line statement pinned flush to the bottom edge with the
 * first line carried in the accent finish.
 *
 * Two deliberate departures from that reference, both locked in CLAUDE.md:
 *
 *   - The reference sets its first headline line in red. The palette here is
 *     monochrome by decision, so the accent role is carried by `.foil`, the
 *     brushed-silver gradient taken off the printed business card.
 *   - The reference's navigation is an edge-to-edge bar glued to the top.
 *     The house standard bans that; the floating island pill stays.
 *
 * Three implementation constraints:
 *
 * 1. The LCP element is the <h1>. It paints immediately and is never gated
 *    behind an entrance animation, hydration or an image decode. Everything
 *    that animates in is secondary.
 *
 * 2. `heroSrc` is resolved at build time by the server component. With no
 *    photograph supplied the CSS stage below IS the hero, not a broken-image
 *    state — and it costs nothing over the wire.
 *
 * 3. Only transform, opacity and filter are animated, and every animation is
 *    dropped under `prefers-reduced-motion`.
 */

/** Mid-stage scope column — the reference's stacked discipline list. */
const SCOPE = ["Design", "Build", "SEO", "AEO", "GEO"] as const;

export function Hero({ heroSrc }: { heroSrc: string | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The stage drifts and swells slower than the page — parallax depth, kept
  // subtle. Anything more reads as a gimmick at this scale.
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const plateOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  const motionPlate = reduced
    ? {}
    : { y: plateY, scale: plateScale, opacity: plateOpacity };
  const motionCopy = reduced ? {} : { y: copyY, opacity: copyOpacity };

  // Secondary content settles in after paint. The heading is excluded on
  // purpose — see constraint 1 above.
  const settle = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: {
            duration: 1,
            delay,
            ease: [0.32, 0.72, 0, 1] as const,
          },
        };

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* ---------- Stage ---------- */}
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
          /* ── DESIGNED HERO STAGE ──
             No photograph has been supplied, so this is the hero rather than
             a stopgap: a triangulated wire mesh over a raked key light, a
             specular roll-off across a gloss surface, and a vignette to seat
             it. Pure CSS — no bytes, no decode, no layout shift. */
          <div className="absolute inset-0 bg-ink-0">
            {/* Key light, high and off-centre. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(68% 54% at 68% 2%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.09) 30%, rgba(255,255,255,0.02) 55%, transparent 74%)",
              }}
            />
            {/* Triangulated wire mesh — the reference's overlay, redrawn as the
                studio's own black-line motif. Three sets of hairlines at 90°,
                60° and −60°, masked so the mesh concentrates around the light
                and has cleared out entirely by the time it reaches the
                statement. */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: [
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 74px)",
                  "repeating-linear-gradient(60deg, rgba(255,255,255,0.36) 0 1px, transparent 1px 74px)",
                  "repeating-linear-gradient(-60deg, rgba(255,255,255,0.36) 0 1px, transparent 1px 74px)",
                ].join(","),
                maskImage:
                  "radial-gradient(58% 62% at 66% 20%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, transparent 82%)",
                WebkitMaskImage:
                  "radial-gradient(58% 62% at 66% 20%, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, transparent 82%)",
                opacity: 0.5,
              }}
            />
            {/* One heavier rule at architectural scale — the mark itself. */}
            <div
              className="absolute inset-y-0 left-[62%] w-px sm:left-[68%]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 46%, transparent 84%)",
              }}
            />
            {/* Cool counter-bounce, lower left. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(66% 58% at 4% 94%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 34%, transparent 62%)",
              }}
            />
            {/* Specular sweep — the highlight rolling off a gloss surface. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(102deg, transparent 32%, rgba(255,255,255,0.08) 47%, rgba(255,255,255,0.14) 51%, rgba(255,255,255,0.04) 56%, transparent 70%)",
              }}
            />
            {/* Vignette. */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(122% 86% at 50% 40%, transparent 38%, rgba(0,0,0,0.6) 84%, rgba(0,0,0,0.92) 100%)",
              }}
            />
          </div>
        )}
      </motion.div>

      {/* Legibility scrim, blending the stage into the section below. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-0 via-ink-0/55 to-ink-0/15"
      />

      {/* ---------- Right-margin microtype ----------
          The reference runs a rotated rights line and a barcode down the right
          edge. Hidden below lg, where there is no margin to give it. */}
      <motion.div
        {...settle(0.5)}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-4 z-10 hidden select-none flex-col items-center justify-center gap-6 lg:flex"
      >
        <span className="edge-type">
          {site.name} — All work, all rights
        </span>
        <span className="rule-stack block h-16 w-6 opacity-70" />
      </motion.div>

      {/* ---------- Copy ---------- */}
      <motion.div
        style={motionCopy}
        className="relative flex flex-1 flex-col justify-between gap-16 px-6 pb-10 pt-32 sm:px-10 lg:px-16 lg:pb-14 lg:pt-36"
      >
        {/* ── Top clusters ── */}
        <div className="mx-auto grid w-full max-w-[1600px] gap-12 lg:grid-cols-12">
          {/* Identity block, top left. */}
          <div className="lg:col-span-6">
            <motion.p {...settle(0.05)} className="eyebrow">
              <span aria-hidden="true" className="live-dot" />
              Web design &amp; visibility studio
            </motion.p>

            <motion.p
              {...settle(0.1)}
              className="display-soft mt-7 text-display-sm text-ink-950"
            >
              Web Design Agency
            </motion.p>

            {/* Verified contact facts, set as the reference sets its address
                block: small, uppercase, stacked, quiet. */}
            <motion.ul
              {...settle(0.16)}
              className="mt-7 space-y-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-700"
            >
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors duration-500 hover:text-ink-1000"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.phoneHref}
                  className="transition-colors duration-500 hover:text-ink-1000"
                >
                  {site.phone}
                </a>
              </li>
              <li>United Kingdom</li>
            </motion.ul>

            <motion.div
              {...settle(0.24)}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Cta href="#contact">Start a project</Cta>
              <Cta href="#visibility" variant="ghost">
                See how we score it
              </Cta>
            </motion.div>
          </div>

          {/* Scope column, mid-right — the reference's stacked discipline
              list. Suppressed on small screens, where it would push the
              statement off the stage. */}
          <motion.div
            {...settle(0.3)}
            className="hidden lg:col-span-3 lg:col-start-8 lg:block"
          >
            <p className="field-label">Scope</p>
            <ul className="mt-4 space-y-1">
              {SCOPE.map((item) => (
                <li
                  key={item}
                  className="text-xl tracking-tight text-ink-900 sm:text-2xl"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Bottom statement ──
            Flush to the bottom edge, as in the reference. Static: this is the
            LCP element and is never withheld behind an animation. */}
        <div className="mx-auto w-full max-w-[1600px]">
          <h1
            id="hero-heading"
            className="hero-statement text-ink-1000"
          >
            <span className="foil">Search finds it</span>
            <span className="brand-mark text-ink-600">{BRAND_MARK}</span>
            <br />
            AI recommends it
            <br />
            <span className="text-ink-700">Buyers choose it</span>
          </h1>
        </div>
      </motion.div>
    </section>
  );
}
