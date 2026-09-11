"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Landing on a #hash from another page.
 *
 * THE BUG THIS FIXES. Clicking "Enquire" on /pricing sends you to /#contact.
 * The browser navigates, jumps to where #contact is at that moment, and stops.
 * Then the hero mounts, ScrollTrigger pins it and inserts a pin-spacer worth
 * 320vh, and every section below moves down by that much. You are left
 * thousands of pixels above the form you asked for — measured at 2,976px short
 * on a 1440x900 viewport — which reads as "the button does nothing".
 *
 * It is the same root cause as the ResizeObserver in `smooth-scroll.tsx`: this
 * page's height is not final until well after first paint, so anything that
 * measures it early is measuring the wrong document.
 *
 * THE FIX. For a short window after arriving with a hash, re-align the target
 * whenever the document changes height. Instant, not smooth — a correction
 * that animates reads as the page drifting on its own.
 *
 * Keyed on `usePathname()`, not on mount alone. The first attempt at this used
 * an empty dependency array and did nothing at all: the layout does not
 * remount on client-side navigation, so an effect that runs once on mount
 * never fires for the very case it was written for. The pathname changing from
 * /pricing to / is the signal that we have just landed somewhere new.
 *
 * `hashchange` covers the rest — a same-page anchor click, or the back button
 * returning to a hash. Those generally work already, since layout has settled
 * by then, and the alignment is harmless when it is already aligned.
 *
 * `scrollIntoView` rather than a computed offset, because the sections carry
 * `scroll-mt-24` for the sticky header and this honours it. One place to
 * change the header offset, not two.
 */

/** How long to keep correcting. The pin-spacer lands well inside this. */
const SETTLE_MS = 2500;

export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const run = () => {
      cleanup?.();
      cleanup = start();
    };

    run();
    window.addEventListener("hashchange", run);
    return () => {
      window.removeEventListener("hashchange", run);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

/**
 * Begins one alignment window. Returns the function that ends it, so a second
 * navigation cannot leave the first window's observer and listeners running.
 */
function start(): (() => void) | undefined {
  {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;

    let id: string;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      // A malformed hash is not worth throwing over.
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    let done = false;

    const align = () => {
      if (done) return;
      target.scrollIntoView({ block: "start", behavior: "auto" });
    };

    /**
     * The moment the reader takes over, stop. Correcting the scroll position
     * under someone who has started reading is worse than the original bug —
     * they have not lost their place by accident, they chose it.
     */
    const release = () => {
      if (done) return;
      done = true;
      observer.disconnect();
      clearTimeout(timer);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };

    window.addEventListener("wheel", release, { passive: true, once: true });
    window.addEventListener("touchstart", release, { passive: true, once: true });
    window.addEventListener("keydown", release, { once: true });

    align();

    // A height change is the signal that the earlier alignment is now stale.
    // The pin-spacer does not fire a window resize event, which is exactly why
    // this watches the body rather than the window.
    const observer = new ResizeObserver(align);
    observer.observe(document.body);

    const timer = setTimeout(release, SETTLE_MS);

    return release;
  }
}
