/**
 * Return to the top of the page.
 *
 * Shared by the header wordmark and the footer's back-to-top control, so the
 * two cannot drift apart.
 *
 * WHY THE DISTANCE MATTERS. This homepage is around 20,000px tall. A browser's
 * smooth scroll duration grows with the distance, so `behavior: "smooth"` from
 * the footer is not a graceful glide — it is six seconds or more of the page
 * flying past, during which the control appears to have done nothing and the
 * reader is likely to grab the scrollbar anyway. It was caught as a test
 * timeout at 768, which is exactly what a reader would experience.
 *
 * So: smooth for a short trip, instant beyond it. The threshold is in viewport
 * heights rather than pixels because what makes a scroll feel long is how many
 * screens it covers, not how many pixels.
 *
 * AND IT HAS TO GO THROUGH LENIS. This was the part I got wrong first time:
 * `window.scrollTo({ behavior: "auto" })` sets the scroll position, and Lenis —
 * which owns it — eases straight back toward the target it still believes in,
 * so the instant branch simply did not arrive. The smooth branch worked only
 * because the browser's own animation happens to converge on the same place.
 *
 * Lenis is loaded dynamically after first paint, so it publishes itself on
 * `window` for this one purpose. A global is a smell; the alternative is
 * threading a ref through the header, the footer and everything else that ever
 * wants to move the page, which is worse.
 */

/** Beyond this many screens, animating the return stops being a courtesy. */
const SMOOTH_LIMIT_SCREENS = 5;

type LenisLike = {
  scrollTo: (target: number, options?: { immediate?: boolean }) => void;
};

declare global {
  interface Window {
    __lenis?: LenisLike;
  }
}

export function scrollToTop(): void {
  const far = window.scrollY > window.innerHeight * SMOOTH_LIMIT_SCREENS;
  const lenis = window.__lenis;

  if (lenis) {
    lenis.scrollTo(0, { immediate: far });
    return;
  }

  // No Lenis: reduced motion, or before it has finished loading.
  window.scrollTo({ top: 0, behavior: far ? "auto" : "smooth" });
}
