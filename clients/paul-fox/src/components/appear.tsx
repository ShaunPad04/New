"use client";

import { motion, type HTMLMotionProps } from "motion/react";

export const APPEAR_EASE = [0.12, 0.23, 0.5, 1] as const;
export const APPEAR_DURATION = 0.4;

type AppearProps = HTMLMotionProps<"div"> & {
  /** Stagger delay in seconds. */
  delay?: number;
  /** Fire on mount instead of on scroll into view. */
  onMount?: boolean;
};

/**
 * The one entrance used everywhere: opacity 0→1, y 20→0, 0.4s, staggered
 * in 0.1s steps. Hero fires on mount; everything else once when in view.
 */
export function Appear({ delay = 0, onMount = false, children, ...rest }: AppearProps) {
  const hidden = { opacity: 0, y: 20 };
  const shown = { opacity: 1, y: 0 };
  const transition = { duration: APPEAR_DURATION, ease: APPEAR_EASE, delay };
  return (
    <motion.div
      initial={hidden}
      {...(onMount
        ? { animate: shown }
        : { whileInView: shown, viewport: { once: true, amount: 0 } })}
      transition={transition}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
