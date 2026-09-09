/**
 * BACKGROUND PATHS
 *
 * Adapted from a component the client supplied. It is the background of the
 * capability band: a field of hairlines behind the copy.
 *
 * THIS COMPONENT RUNS NO JAVASCRIPT, and that is the fix for the glitch the
 * client reported when scrolling up and down past this band.
 *
 * The previous version drove 56 infinite animations through Motion and gated
 * them on `useInView` WITHOUT `once`. So the flag flipped every single time
 * the boundary crossed the viewport, and each flip restarted or stopped all 56
 * at once — scrolling back and forth over the band retriggered the whole field
 * on every pass. On top of that, `pathLength` and `pathOffset` are not
 * compositor properties: every frame of those animations re-rasterised the SVG
 * on the same main thread Lenis is using to smooth the scroll.
 *
 * Both problems have the same root, which is that this was JavaScript at all.
 * Nothing here needs to react to anything. It is now plain server-rendered SVG
 * driven entirely by CSS, so nothing watches the scroll and nothing can be
 * restarted by it.
 *
 * NOTHING ANIMATES HERE, and that is measured rather than assumed. Two
 * animated versions shipped and both made the page lag. Median frame time on
 * the built site while the band is on screen: 16.7ms with the field hidden,
 * 16.6ms static, 36.1ms with the two layers drifting, and 401ms with the 72
 * per-path opacity animation that actually went live. See the BACKGROUND PATHS
 * note in globals.css for the full table and why the compositor reasoning that
 * produced it was wrong.
 *
 * OTHER CHANGES FROM THE SUPPLIED SOURCE
 *
 * - `framer-motion` was never installed. It is the former name of `motion`,
 *   already a dependency; two copies of one animation runtime in a bundle is
 *   not a thing to ship. It is now moot, since no runtime is used here at all.
 * - The shadcn `Button`, `@radix-ui/react-slot` and `class-variance-authority`
 *   are not used. The source wraps its paths in a hero with its own headline
 *   and CTA; this band already has both in the site's own `Cta`.
 * - The per-path `color` is deleted. It was computed for every path and never
 *   read: each path renders `stroke="currentColor"`.
 * - `<title>Background Paths</title>` is deleted and the SVG is `aria-hidden`.
 *   A `<title>` names an SVG to assistive tech, so screen readers announced
 *   "Background Paths" in the middle of the capability copy.
 * - `Math.random()` in the render body is gone. It is recomputed on every
 *   render, and a value that differs between server and client is a hydration
 *   bug. Here it would also have been fatal: a server component cannot ship a
 *   random number to the client and have it agree.
 * - `pathOffset: [0, 1, 0]` is gone. Motion draws `pathLength` as a dash, so
 *   sweeping the offset to 1 slides the drawn part off the end and the GAP in,
 *   and every line disappears completely once per cycle. All of them started
 *   together, so the whole field vanished and returned in unison.
 * - `text-slate-950 dark:text-white` -> `text-ink-1000`. Monochrome palette,
 *   one theme.
 */

/**
 * The source hard-codes 36 paths and derives each one's offset from its raw
 * index, so changing the count would also change the size of the drawn field.
 * `s` normalises that, leaving `count` as a pure density knob. At the default
 * this is the source's geometry exactly.
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
      // The source's `0.1 + i * 0.03` was written for near-black strokes on
      // white and tops out past 1. White on black needs its own curve: the
      // faintest line has to clear the point where a hairline stops being on
      // the screen at all.
      opacity: 0.12 + (i / count) * 0.78,
    };
  });
}

function FloatingPaths({ position, count }: { position: number; count: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full text-ink-1000"
      viewBox="0 0 696 316"
      /* `slice`, so the drawing covers the band the way `object-cover` covers
         a box. The default `meet` letterboxes it whenever the band's aspect
         does not match the viewBox's, which it never exactly does. */
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {buildPaths(position, count).map((path) => (
        <path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
        />
      ))}
    </svg>
  );
}

/**
 * Fills its positioned parent. `count` is per direction, so the default draws
 * the source's full 72 lines.
 *
 * Density has to follow the width it is drawn at. This was 18 per direction
 * while the field was boxed in a 395px column, where more were sub-pixel
 * neighbours of lines already there; across the full width of the band that
 * same 18 read as a thin ribbon of four or five strokes, which is what the
 * client saw and rejected.
 */
export function BackgroundPaths({ count = 36 }: { count?: number }) {
  return (
    <div
      aria-hidden="true"
      data-bg-paths=""
      /* Desktop only. Below `lg` the copy is a single full-width column, so
         every line of it would sit directly on these strokes. */
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <FloatingPaths position={1} count={count} />
      <FloatingPaths position={-1} count={count} />
    </div>
  );
}
