"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * BEFORE / AFTER SCORE BAR
 *
 * Two stacked tracks: the score a site arrives with, and the score it leaves
 * with. Both fills grow on scroll-in via `scaleX`, which is composited on the
 * GPU — animating `width` here would relayout the row on every frame.
 *
 * `transform-origin: left` matters: without it the bar grows from its centre
 * outward, which reads as a pulse rather than a measurement.
 *
 * The bars duplicate the figures beside them, so they are hidden from
 * assistive technology and a single visually-hidden sentence carries the
 * meaning instead.
 */
function Fill({
  value,
  delay,
  className,
}: {
  value: number;
  delay: number;
  className: string;
}) {
  const reduced = useReducedMotion();
  const scaleX = value / 100;

  if (reduced) {
    return (
      <div
        className={className}
        style={{ transformOrigin: "left", transform: `scaleX(${scaleX})` }}
      />
    );
  }

  return (
    <motion.div
      className={className}
      style={{ transformOrigin: "left" }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 1.2, delay, ease: [0.32, 0.72, 0, 1] }}
    />
  );
}

export function ScoreBar({
  before,
  after,
  label,
}: {
  before: number;
  after: number;
  label: string;
}) {
  return (
    <div className="max-w-[20rem]">
      <p className="sr-only">
        {label}: {before} out of 100 on arrival, {after} out of 100 at handover.
      </p>

      <div aria-hidden="true">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-600">
            Inherited
          </span>
          <span className="font-mono text-xs tabular-nums text-ink-700">
            {before}
          </span>
        </div>
        <div className="mt-2 h-px w-full bg-ink-400">
          <Fill value={before} delay={0} className="h-full bg-ink-600" />
        </div>

        <div className="mt-6 flex items-baseline justify-between">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-800">
            At handover
          </span>
          <span className="font-mono text-xs tabular-nums text-ink-1000">
            {after}
          </span>
        </div>
        <div className="mt-2 h-0.5 w-full bg-ink-400">
          <Fill value={after} delay={0.15} className="h-full bg-ink-1000" />
        </div>
      </div>
    </div>
  );
}
