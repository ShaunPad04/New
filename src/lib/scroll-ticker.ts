/**
 * ONE animation loop for every scroll-driven component on the page.
 *
 * Each kit component used to be a candidate for its own `scroll` listener
 * plus its own requestAnimationFrame. Six of those on one page is six loops
 * reading layout in six different frames — the classic source of scroll
 * jank. Instead every component subscribes here, and all of them read and
 * write inside the same frame.
 *
 * WHY A FRAME LOOP AND NOT A `scroll` LISTENER. Lenis eases the scroll
 * position over several frames after the wheel stops, and the process ride
 * already proved the lesson: read `getBoundingClientRect()` every frame and
 * the numbers are always true, whatever is smoothing or pinning above. A
 * listener would miss the tail of every Lenis ease.
 *
 * The loop only runs while something is subscribed, and components only
 * subscribe while they are near the viewport (see `useInViewTicker`), so an
 * idle page with nothing moving costs nothing.
 *
 * It also publishes a smoothed scroll VELOCITY, which the marquee uses to
 * speed up and skew as the reader scrolls — the one piece of state that
 * genuinely has to be shared, because it is a property of the page, not of
 * any one element.
 */
type Subscriber = (frame: TickerFrame) => void;

export type TickerFrame = {
  /** Viewport height, read once per frame. */
  vh: number;
  /** Smoothed scroll velocity in px per frame. Signed: + is scrolling down. */
  velocity: number;
};

const subscribers = new Set<Subscriber>();
let raf = 0;
let lastY = 0;
let velocity = 0;

function loop() {
  const y = window.scrollY;
  // Exponential smoothing: a raw per-frame delta is spiky (Lenis and trackpads
  // both deliver uneven steps), and a spiky velocity makes the marquee judder.
  velocity += (y - lastY - velocity) * 0.18;
  lastY = y;
  const frame: TickerFrame = { vh: window.innerHeight, velocity };
  subscribers.forEach((fn) => fn(frame));
  raf = subscribers.size ? requestAnimationFrame(loop) : 0;
}

export function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  if (!raf) {
    lastY = window.scrollY;
    raf = requestAnimationFrame(loop);
  }
  return () => {
    subscribers.delete(fn);
  };
}

/** True when the user has asked the OS for less motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
