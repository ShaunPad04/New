"use client";

import { cn } from "@/lib/utils";
import { useMotionValue, animate, motion } from "motion/react";
import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";

/**
 * Marquee that loops seamlessly by rendering its children twice and
 * translating by exactly half the measured content width.
 *
 * Adapted from the supplied component. Three changes, all deliberate:
 *
 *   1. Imports from `motion/react`, not `framer-motion`. They are the same
 *      library under its old and current names — installing both would ship
 *      two copies of it.
 *   2. The effect returns a plain cleanup function. The original returned
 *      `controls?.stop`, which is `(() => void) | undefined` and is rejected
 *      by TypeScript under `strict` as a destructor type.
 *   3. `controls` is typed rather than implicitly `any`.
 */
type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const controls = isTransitioning
      ? animate(translation, [translation.get(), to], {
          ease: "linear",
          duration:
            currentDuration * Math.abs((translation.get() - to) / contentSize),
          onComplete: () => {
            setIsTransitioning(false);
            setKey((prevKey) => prevKey + 1);
          },
        })
      : animate(translation, [from, to], {
          ease: "linear",
          duration: currentDuration,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
          onRepeat: () => {
            translation.set(from);
          },
        });

    return () => {
      controls.stop();
    };
  }, [
    key,
    translation,
    currentDuration,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentDuration(durationOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentDuration(duration);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
