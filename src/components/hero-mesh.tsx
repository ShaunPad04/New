/**
 * A faint geometric field over the hero footage.
 *
 * Adapted from a reference the client sent, where a fine mesh drifts across
 * the image and gives an otherwise photographic frame the feeling of something
 * being measured.
 *
 * WHY IT IS CSS AND NOT AN IMAGE. Two repeating linear gradients crossed at
 * ±30° draw the whole field in about a dozen bytes, scale to any viewport
 * without a single request, and stay perfectly crisp on any density of screen.
 * A supplied PNG would be another asset on the most bandwidth-sensitive part
 * of the page, and this hero already carries a frame sequence.
 *
 * THE MASK IS THE DESIGN. Unmasked, a grid over a photograph reads as a
 * texture laid on top of it. Faded away from a soft centre-right, it reads as
 * something the frame is being seen THROUGH — and, usefully, it thins out over
 * the bottom-left, which is exactly where the logotype and the two calls to
 * action sit. It never competes with the copy because it is not there.
 *
 * It drifts on a 60s cycle, transform-only, so the compositor owns it and the
 * global reduced-motion rule stops it without this file knowing anything about
 * that.
 */
export function HeroMesh() {
  return (
    <div
      aria-hidden="true"
      className="hero-mesh pointer-events-none absolute inset-0 -z-10"
    />
  );
}
