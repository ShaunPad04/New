"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Scroll-linked statement — the reference's "About" band: a #f6f6f6 section
 * with a faint pattern, 1060px tall, whose 48px text is sticky (top 310px)
 * while each word resolves from blur(10px) and transparent to sharp ink as
 * the section scrolls. Measured: words un-blur progressively across ~900px
 * of scroll. Reduced motion renders the text in place.
 */
export function Statement({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const words = text.split(" ");

  return (
    <section ref={ref} className="relative z-10 bg-mist" aria-label="About New Home Agents">
      <div className="container relative">
        <div className="flex min-h-[140vh] items-start py-24 md:py-32">
          <p className="sticky top-[200px] mx-auto max-w-[980px] text-center text-[28px] font-semibold leading-[1.35] text-ink md:top-[310px] md:text-[48px] md:leading-[1.4]">
            {reduced
              ? text
              : words.map((w, i) => <Word key={`${w}-${i}`} word={w} index={i} total={words.length} progress={scrollYProgress} />)}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = Math.min(1, start + 0.12);
  const opacity = useTransform(progress, [start, end], [0.48, 1]);
  const blur = useTransform(progress, [start, end], [10, 0]);
  const filter = useTransform(blur, (b) => `blur(${b.toFixed(2)}px)`);
  return (
    <motion.span style={{ opacity, filter }} className="inline-block will-change-[filter,opacity]">
      {word}&nbsp;
    </motion.span>
  );
}
