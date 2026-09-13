/**
 * X/Twitter reuses the Open Graph card.
 *
 * Declared explicitly rather than left to fall back: `twitter.card` is
 * `summary_large_image`, and several crawlers only read `twitter:image` when
 * that card type is set. Re-exporting keeps one design and one source.
 */
export { default, alt, size, contentType } from "./opengraph-image";
