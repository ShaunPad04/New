"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/**
 * BACKGROUND PATHS
 *
 * Adapted from a component the client supplied (2026-09-09), not pasted. It
 * replaces the silk photograph in the capability band: the same slot, now a
 * field of slow-drifting hairlines rather than a still image.
 *
 * WHAT CHANGED FROM THE SOURCE, and why each one had to.
 *
 * 1. `framer-motion` -> `motion/react`. Framer Motion was renamed; `motion` is
 *    the same library under its current name and is ALREADY a dependency here.
 *    Installing `framer-motion` alongside it would ship two copies of the same
 *    animation runtime in one bundle.
 *
 * 2. The shadcn `Button` is gone, and with it `@radix-ui/react-slot` and
 *    `class-variance-authority`. The source wraps its paths in a full-screen
 *    hero with its own headline and CTA; this band already has both, in the
 *    site's own `Cta`. Only the paths were wanted, so only the paths are here
 *    and nothing was installed.
 *
 * 3. `color: rgba(15,23,42,...)` is DELETED. It was computed for every path
 *    and never read — each path renders `stroke="currentColor"`, so the value
 *    that actually reaches the screen came from the SVG's text colour. Left in,
 *    it reads like a working knob that silently does nothing.
 *
 * 4. `<title>Background Paths</title>` is DELETED and the SVG is `aria-hidden`.
 *    A `<title>` gives an SVG an accessible name, so a screen reader announced
 *    the words "Background Paths" in the middle of the capability copy. This is
 *    wallpaper; it should be silent.
 *
 * 5. `Math.random()` in the render body is GONE, replaced by a deterministic
 *    function of the index. Random durations are recalculated on every render,
 *    so any re-render of a parent restarts all of these animations at new
 *    speeds — and a value that differs between the server and the client is the
 *    hydration bug this project has already paid for once.
 *
 * 6. `text-slate-950 dark:text-white` -> `text-ink-1000`. The palette is
 *    monochrome by conviction and there is no dark-mode class strategy; the
 *    site is one theme.
 *
 * 7. THE ANIMATION ONLY RUNS WHILE THE BAND IS ON SCREEN. This is the change
 *    that matters most. `pathLength` and `pathOffset` are not compositor
 *    properties — every frame re-rasterises the SVG on the main thread — and
 *    the source repeats them infinitely. Left as written, this page would never
 *    reach an idle main thread again, on a homepage that is 19,500px tall and
 *    whose Lighthouse performance is already bimodal on the audit container.
 *    Gated on `useInView`, it costs nothing for the ~95% of the page where this
 *    band is nowhere near the viewport.
 *
 * `ease: "linear"` is kept, and it is a deliberate exception to the house ban
 * on linear easing. That ban is about entrances, where linear reads as
 * mechanical. This is an ambient loop whose keyframes return to their starting
 * values; easing it would put a visible pulse at the seam of every repeat.
 */

/**
 * The original hard-codes 36 paths and derives each one's offset from its raw
 * index, so changing the count also changes the size of the drawn field. `s`
 * normalises that: the composition is identical at any count, and the count is
 * purely a density knob. At `count = 36` this is the source's geometry exactly.
 */
function buildPaths(position: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const s = i * (36 / count);
    const x = 5 * s * position;
    const y = 6 * s;

    return {
      id: i,
      d: `M-${380 - x} -${189 + y}C-${380 - x} -${189 + y} -${312 - x} ${216 - y} ${152 - x} ${343 - y}C${616 - x} ${470 - y} ${684 - x} ${875 - y} ${684 - x} ${875 - y}`,
      width: 0.5 + (i / count) * 1.1,
      // On black, a 0.1 hairline is not on the screen at all. The source's
      // range was written for near-black strokes on white.
      opacity: 0.14 + (i / count) * 0.66,
      // Was `20 + Math.random() * 10`. Same 20-30s band, deterministic, and
      // co-prime enough that neighbouring lines never lock into step.
      duration: 20 + ((i * 7) % 11),
    };
  });
}

function FloatingPaths({
  position,
  count,
  animated,
}: {
  position: number;
  count: number;
  animated: boolean;
}) {
  const paths = buildPaths(position, count);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full text-ink-1000"
      /* NOT the source's `0 0 696 316`. That viewBox frames the drawing for a
         full-width hero; this slot is portrait (~395x442), and cropping the
         landscape window to fit left the top 40% of the plate empty black —
         the exact fault the client raised about this band in the first place.
         Rendered and compared eight windows against the real box: this one
         puts lines edge to edge with the caustic where the curves bunch in the
         lower left, and its 420:470 aspect all but matches the slot, so almost
         nothing is cropped. `slice` guarantees the fill if the row height ever
         changes. */
      viewBox="0 -60 420 470"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
          /* `initial` is identical in both states, so the server and the client
             render the same attributes and only the JS-driven `animate`
             differs. Branching the MARKUP on a client-only hook is what broke
             hydration when `TextReveal` went in. */
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={
            animated
              ? {
                  pathLength: 1,
                  opacity: [0.3, 0.6, 0.3],
                  pathOffset: [0, 1, 0],
                }
              : { pathLength: 1, opacity: 0.45, pathOffset: 0 }
          }
          transition={
            animated
              ? {
                  duration: path.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  );
}

/**
 * Fills its positioned parent. `count` is per direction, so the default draws
 * 36 lines in total rather than the source's 72 — in a ~430px slot the extra
 * 36 are sub-pixel neighbours of lines already there, and each one is another
 * infinite main-thread animation.
 */
export function BackgroundPaths({ count = 18 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const animated = !reduced && inView;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      /* A mask rather than the black scrim the photograph needed. The scrim
         worked by painting 55% black over the image edges; doing that to
         hairlines that are already at 0.1-0.6 opacity simply erases them.
         Masking fades the same edges without touching the strokes' brightness
         where they are meant to read. */
      style={{
        maskImage:
          "radial-gradient(135% 105% at 52% 48%, #000 58%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(135% 105% at 52% 48%, #000 58%, transparent 100%)",
      }}
    >
      <FloatingPaths position={1} count={count} animated={animated} />
      <FloatingPaths position={-1} count={count} animated={animated} />
    </div>
  );
}
