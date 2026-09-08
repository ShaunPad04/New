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
 */

/** Beyond this many screens, animating the return stops being a courtesy. */
const SMOOTH_LIMIT_SCREENS = 5;

export function scrollToTop(): void {
  const far = window.scrollY > window.innerHeight * SMOOTH_LIMIT_SCREENS;
  window.scrollTo({ top: 0, behavior: far ? "auto" : "smooth" });
}
