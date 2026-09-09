/**
 * BACKGROUND PATHS
 *
 * Adapted from a component the client supplied. It is the background of the
 * capability band: a field of hairlines behind the copy, drifting slowly.
 *
 * IT IS TWO DIVS WITH A BACKGROUND IMAGE, NOT SEVENTY-TWO SVG PATHS, and that
 * is the whole design of this file. The geometry is still the source's — it is
 * generated into `public/images/texture/paths-{a,b}.svg` from the same formula
 * — but it reaches the page as an image rather than as live DOM.
 *
 * WHY, measured rather than assumed. Median frame time on the built site at
 * 1440x2 while the band is on screen, six-second samples:
 *
 *   field hidden (control)                     16.7ms   60fps
 *   72 inline paths, per-path opacity anim    401.2ms   ~2.5fps
 *   72 inline paths, 2 layers transformed      36.1ms   27fps
 *   72 inline paths, static                    16.6ms   60fps
 *   two background images, transformed         see globals.css
 *
 * The second row shipped, and the client reported it as things "deleting" and
 * "lagging" — seventeen frames in six seconds is not a slow animation, it is a
 * page that has stopped responding. The reasoning behind it was wrong in a
 * specific way worth keeping: opacity IS a compositor property on an ordinary
 * element, but children of an SVG are not independently promoted to layers, so
 * animating 72 of them repaints the entire SVG every frame. Promoting the two
 * SVG layers and animating `transform` was the obvious next move and STILL
 * halved the frame rate, because a live vector subtree is re-rasterised as it
 * moves.
 *
 * A background image is not. It is rasterised into the layer once and then the
 * compositor just moves the texture — which is why this can be animated when
 * the inline version could not. Keeping it as SVG rather than a bitmap means
 * it stays crisp at any width and costs about 4.8KB.
 *
 * It also takes 72 elements out of the document, which the axe pass cares
 * about: with them in, the homepage scan ran past its 30s budget at two of the
 * three viewports.
 *
 * OTHER CHANGES FROM THE SUPPLIED SOURCE
 *
 * - `framer-motion` was never installed. It is the former name of `motion`,
 *   already a dependency; two copies of one animation runtime in a bundle is
 *   not a thing to ship. Moot now — no runtime is used here at all.
 * - The shadcn `Button`, `@radix-ui/react-slot` and `class-variance-authority`
 *   are unused. The source wraps its paths in a hero with its own headline and
 *   CTA; this band already has both in the site's own `Cta`.
 * - The per-path `color` was dead code: every path rendered with
 *   `stroke="currentColor"`, so the computed rgba never reached the screen.
 * - `<title>Background Paths</title>` is gone and the layers are `aria-hidden`.
 *   A `<title>` names an SVG to assistive tech, so screen readers announced
 *   "Background Paths" in the middle of the capability copy.
 * - `Math.random()` in the render body is gone. It is recomputed on every
 *   render, and a value that differs between server and client is a hydration
 *   bug. The geometry is now generated once, at build time, into a file.
 * - `pathOffset: [0, 1, 0]` is gone. Motion draws `pathLength` as a dash, so
 *   sweeping the offset to 1 slides the drawn part off the end and the GAP in:
 *   every line vanished completely once per cycle, all of them together.
 * - `text-slate-950 dark:text-white` -> plain white on the ink scale.
 *   Monochrome palette, one theme.
 */

/**
 * Each layer is oversized well past the band and drifts a little way inside
 * it, so the travel can never pull an empty edge into view. `cover` matches
 * the `slice` behaviour the inline SVG used.
 *
 * Desktop only: below `lg` the copy is a single full-width column, so every
 * line of it would sit directly on these strokes.
 */
export function BackgroundPaths() {
  return (
    <div
      aria-hidden="true"
      data-bg-paths=""
      className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block"
    >
      <div
        data-bg-paths-layer="a"
        className="absolute -inset-[8%] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/texture/paths-a.svg)" }}
      />
      <div
        data-bg-paths-layer="b"
        className="absolute -inset-[8%] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/texture/paths-b.svg)" }}
      />
    </div>
  );
}
