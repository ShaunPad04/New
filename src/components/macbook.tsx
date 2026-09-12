"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * MACBOOK PLATE
 *
 * The client's reference photographs a laptop on stone. No such photograph
 * exists here, and a stock render would drag a megabyte over the wire and
 * still look like stock, so the machine is drawn in CSS: aluminium shell,
 * bezel, notch, screen, hinge and base, all in the ink scale.
 *
 * The lid tips from slightly-closed toward flat as the block scrolls through
 * the viewport, which is what sells it as an object rather than a rectangle.
 * `rotateX` on a single transformed element — no per-frame layout, no paint.
 *
 * The screen holds an abstraction of a Black Line build rather than a
 * screenshot of any particular client's site. It is decorative and marked
 * `aria-hidden`; the surrounding section carries the actual information.
 */
export function Macbook() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [26, 6]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="select-none"
      style={{ perspective: "1400px" }}
    >
      {/* ---------- Lid ---------- */}
      <motion.div
        style={
          reduced
            ? { transformStyle: "preserve-3d" }
            : { rotateX, y, transformStyle: "preserve-3d" }
        }
        className="relative mx-auto w-full origin-bottom will-change-transform"
      >
        {/* Aluminium shell. The double border is the shell and the bezel —
            concentric radii, per the house double-bezel rule. */}
        <div className="rounded-t-[0.9rem] border border-white/12 bg-gradient-to-b from-ink-400 to-ink-200 p-[0.4rem] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.95)]">
          <div className="relative overflow-hidden rounded-[0.5rem] border border-white/[0.07] bg-ink-0">
            {/* Notch. */}
            <div className="absolute left-1/2 top-0 z-10 h-[1.1%] w-[14%] -translate-x-1/2 rounded-b-md bg-ink-300" />

            {/* ---------- Screen content ---------- */}
            <div className="aspect-[16/10] w-full bg-gradient-to-b from-ink-100 to-ink-0 p-[4%]">
              {/* Site nav pill. */}
              <div className="mx-auto flex w-[76%] items-center justify-between rounded-full border border-white/10 bg-white/[0.04] px-[2.5%] py-[1%]">
                <span className="block h-[6px] w-[18%] rounded-full bg-ink-800" />
                <span className="flex gap-[6px]">
                  <span className="block h-[4px] w-[16px] rounded-full bg-ink-500" />
                  <span className="block h-[4px] w-[16px] rounded-full bg-ink-500" />
                  <span className="block h-[4px] w-[16px] rounded-full bg-ink-500" />
                </span>
                <span className="block h-[10px] w-[14%] rounded-full bg-ink-900" />
              </div>

              {/* Headline block. */}
              <div className="mt-[7%] space-y-[1.6%]">
                <span className="block h-[7%] w-[62%] rounded-sm bg-ink-900" />
                <span className="block h-[7%] w-[46%] rounded-sm bg-ink-600" />
              </div>

              {/* Media row. */}
              <div className="mt-[6%] flex gap-[2.5%]">
                <span className="block aspect-[4/3] w-[38%] rounded-md border border-white/[0.07] bg-gradient-to-br from-ink-300 to-ink-100" />
                <span className="block aspect-[4/3] w-[38%] rounded-md border border-white/[0.07] bg-gradient-to-tr from-ink-200 to-ink-50" />
                <span className="block aspect-[4/3] w-[19%] rounded-md border border-white/[0.07] bg-ink-200" />
              </div>

              {/* CTA + trust row. */}
              <div className="mt-[5%] flex items-center gap-[3%]">
                <span className="block h-[7%] w-[22%] rounded-full bg-ink-1000" />
                <span className="block h-[3%] w-[34%] rounded-full bg-ink-400" />
              </div>
            </div>

            {/* Screen glass — a raking reflection so the panel is not flat. */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(107deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 26%, transparent 46%)",
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* ---------- Base ----------
          Sits outside the rotated lid so the hinge stays put while the lid
          tips, which is what a hinge does. */}
      <div className="relative mx-auto">
        <div className="h-[0.55rem] rounded-b-[0.35rem] bg-gradient-to-b from-ink-500 to-ink-300 shadow-[0_18px_30px_-18px_rgb(0_0_0/0.9)]" />
        {/* Thumb notch. */}
        <div className="mx-auto h-[0.3rem] w-[16%] rounded-b-full bg-ink-200" />
      </div>
    </div>
  );
}
