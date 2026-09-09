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
      opacity: 0.18 + (i / count) * 0.72,
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
      /* The source's own window, and it is the right one again. It frames the
         drawing for a full-width hero, which is exactly what this is now that
         the field sits behind the whole band instead of inside a portrait box.
         (While it was boxed this had to be re-framed to `0 -60 420 470`, or
         the top 40% of the plate came out empty black.) */
      viewBox="0 0 696 316"
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
              ? { pathLength: 1, opacity: [0.45, 0.8, 0.45] }
              : { pathLength: 1, opacity: 0.62 }
          }
          /*
           * `pathOffset: [0, 1, 0]` IS DELIBERATELY GONE, and this is the one
           * change to the supplied animation that alters how it looks.
           *
           * Motion draws `pathLength` as a dash: at pathLength 1 the dash
           * array is "1 1", one unit drawn followed by one unit of gap. Sweep
           * `pathOffset` to 1 and the drawn unit slides off the end and the
           * GAP slides in — so every line disappears completely once per
           * cycle. The source never notices because nothing else is on the
           * page; here it is the background of a band whose entire reason for
           * existing is that the client twice said this section looked empty.
           *
           * It is worse than one line blinking. All 56 start at t=0 with the
           * same offset, so the whole field vanishes and returns in unison —
           * caught on three screenshots of the same build that ranged from a
           * full sweep of lines to nothing at all.
           *
           * So the lines draw in once and stay drawn, and the motion is
           * carried by the opacity breath, which starts and ends on the same
           * value and therefore loops without a seam. Behind body copy a slow
           * breath is the better register than a travelling wipe anyway.
           */
          transition={
            animated
              ? {
                  pathLength: { duration: 1.4, ease: [0.32, 0.72, 0, 1] },
                  opacity: {
                    duration: path.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  );
}

/**
 * Fills its positioned parent.
 *
 * `count` is per direction, so the default draws 56 lines rather than the
 * source's 72. It was 18 while this was boxed in a 395px column, where any
 * more were sub-pixel neighbours of lines already drawn; across the full
 * width of the band that same 18 reads as a thin, sparse ribbon. Density has
 * to follow the width it is drawn at, and each line is another infinite
 * animation, so this is a real cost rather than a free knob.
 */
export function BackgroundPaths({ count = 28 }: { count?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const animated = !reduced && inView;

  /*
   * THE MASK IS WHAT KEEPS THIS OFF THE READING.
   *
   * A full-bleed field of lines behind a paragraph is the obvious way to make
   * body copy hard to read, and `text-ink-700` on black has no contrast to
   * spare. So the field is weighted to the RIGHT — strongest past where the
   * copy column ends, dissolving to nothing across the text and again at the
   * section's own edges, so the band never reads as a rectangle laid over the
   * page.
   *
   * Worth being precise about what this does and does not do: axe measures
   * contrast against the computed background colour and would not flag strokes
   * drawn over it either way. This is not a test passing. It is the reason the
   * test result still means something.
   *
   * A mask, not the black scrim the photograph used. The scrim worked by
   * painting 55% black over the edges; doing that to strokes already at
   * 0.18-0.90 opacity erases them instead of fading them.
   *
   * Desktop only: below `lg` the copy is a single full-width column, so every
   * line of it would sit directly on these strokes, and an infinite animation
   * is a poor thing to hand a phone battery for decoration nobody can read.
   */
  const mask = "radial-gradient(72% 110% at 96% 50%, #000 26%, transparent 54%)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden lg:block"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <FloatingPaths position={1} count={count} animated={animated} />
      <FloatingPaths position={-1} count={count} animated={animated} />
    </div>
  );
}
