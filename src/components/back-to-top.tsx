"use client";

/**
 * Back to top, for the curtain footer.
 *
 * A real `<button>` with a real accessible name — the reference shipped an
 * arrow glyph in a div with no label at all, which is a control a screen
 * reader announces as nothing and a voice user cannot address.
 *
 * `window.scrollTo` rather than an `#main` anchor: the anchor would push a
 * history entry and leave the URL carrying a fragment the reader did not ask
 * for. `behavior: "smooth"` is honoured by Lenis, and the reduced-motion rule
 * in `globals.css` forces `scroll-behavior: auto` for anyone who has asked for
 * less movement.
 */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="footer-pill group flex h-11 w-11 items-center justify-center rounded-full text-ink-700 transition-colors duration-500 hover:text-ink-1000"
    >
      <span className="sr-only">Back to top</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1"
      >
        <path d="M5 10l7-7 7 7M12 3v18" />
      </svg>
    </button>
  );
}
