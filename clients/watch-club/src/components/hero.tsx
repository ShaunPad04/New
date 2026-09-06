"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { hero } from "@/lib/content";

/**
 * Hero.
 *
 * Composition follows the reference: full-bleed near-black, the watch lit
 * from one raking key against a soft dark ground, the serif headline in the
 * negative space bottom-left, and a short paragraph plus a pill CTA
 * bottom-right.
 *
 * The motion is the part worth stealing — the watch softly comes apart into
 * its components and draws back together. That is rendered footage, not DOM
 * animation: layered parts tweened in CSS read as flat at this scale. It is
 * decorative, so it is aria-hidden and the <h1> carries the meaning.
 *
 * PERFORMANCE CONTRACT, because a hero video is the easiest way to lose a
 * Performance score:
 *
 *   - The LCP element is the <h1>, not the media. The heading is server
 *     rendered with the font preloaded and never waits on the video.
 *   - `poster` paints immediately, so there is no black hole while the video
 *     buffers, and the poster alone is a complete hero.
 *   - Under prefers-reduced-motion NO <video> element is mounted at all —
 *     not merely paused. Nothing is hidden behind the animation.
 *   - If the encode cannot come in under budget, delete the <video> block and
 *     the still hero stands on its own with no other change.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // A fractional drift only — the media settles back as the section hands off
  // to the content below. Transform and opacity exclusively: no layout.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-obsidian"
    >
      {/* ---------------------------------------------------------- media */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={reduced ? undefined : { y: mediaY, scale: mediaScale }}
      >
        <Image
          src="/images/hero-poster.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />

        {/* The explode-and-reassemble film is not rendered yet. The still
            plate below is the hero on its own — it is a real frame from the
            client's own footage, composited onto a 1920x1080 black canvas
            with the watch right of centre so the headline has the left half
            to itself.

            TO ADD THE FILM: drop hero-assembly.mp4 into /public/video and
            restore the <video> here with poster="/images/hero-poster.jpg".
            Nothing else needs to change — the poster is already the frame it
            would open on. Keep it muted, looping, playsInline and mounted
            only when `reduced` is false, and re-measure Lighthouse before
            committing it. */}
      </motion.div>

      {/* Vignette and a floor gradient. The copy sits on the lower third, so
          that band needs to be reliably dark whatever the frame is doing
          behind it — this is what keeps the headline above 4.5:1. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_35%,transparent_20%,rgba(11,11,12,0.55)_70%,rgba(11,11,12,0.9)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent"
      />

      {/* ----------------------------------------------------------- copy */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-16 sm:px-8 sm:pb-20 lg:pb-24"
        style={reduced ? undefined : { opacity: copyOpacity }}
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <motion.p
              className="eyebrow mb-6"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            >
              {hero.eyebrow}
            </motion.p>

            <h1 className="display-xl text-bone">
              {hero.headline.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={reduced ? false : { y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1,
                      delay: reduced ? 0 : 0.15 + i * 0.09,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.div
            className="max-w-sm shrink-0"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            <p className="text-sm leading-relaxed text-bone-dim">{hero.body}</p>

            <a
              href={hero.cta.href}
              className="group mt-7 inline-flex items-center gap-3 rounded-full bg-bone py-2 pl-6 pr-2 text-sm font-medium text-obsidian transition-colors duration-300 hover:bg-white"
            >
              {hero.cta.label}
              {/* Button-in-button: the arrow lives in its own circular
                  wrapper flush with the right inner padding, and translates
                  diagonally on hover. House standard. */}
              <span className="grid size-9 place-items-center rounded-full bg-obsidian text-bone transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 11L11 3M11 3H4.5M11 3v6.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
