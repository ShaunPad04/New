"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling.
 *
 * Deliberately loaded dynamically and started after first paint: Lenis is
 * ~10kB and contributes nothing to LCP, so it has no business in the
 * critical path of a hero whose whole job is to render fast.
 *
 * Fully disabled under `prefers-reduced-motion` — smooth scroll hijacking is
 * a genuine vestibular trigger, and native scrolling is the correct fallback.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let raf = 0;
    let lenis: {
      raf: (t: number) => void;
      resize: () => void;
      destroy: () => void;
    } | null = null;
    let cancelled = false;
    let observer: ResizeObserver | undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      const instance = new Lenis({
        duration: 1.1,
        // Gentle expo-out. Heavier easing reads as lag rather than luxury.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.6,
      });
      lenis = instance;

      /*
       * Published for `scrollToTop`, and for nothing else.
       *
       * Lenis owns the scroll position, so anything that wants to move the
       * page has to ask it rather than call `window.scrollTo` and hope: a
       * direct call is eased straight back toward the target Lenis still
       * believes in. The alternative to one global is threading a ref through
       * every component that might ever move the page, which is worse.
       */
      (window as unknown as { __lenis?: unknown }).__lenis = instance;

      const loop = (time: number) => {
        instance.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      /**
       * Re-measure whenever the document changes height.
       *
       * This is not defensive tidiness — without it the page could not be
       * scrolled to the bottom. Lenis caches the scroll limit when it starts.
       * ScrollTrigger then pins the hero and inserts a pin-spacer worth 320vh,
       * which makes the document taller AFTER that measurement was taken.
       * Lenis went on clamping to the old limit, so scrolling died partway
       * down the page — measured at exactly 2880px short on a 900px viewport,
       * which is precisely 320vh.
       *
       * A ResizeObserver on the body catches the pin-spacer being inserted,
       * every later ScrollTrigger refresh, and any lazy content that changes
       * the page height — none of which fire a resize event on window.
       */
      observer = new ResizeObserver(() => instance.resize());
      observer.observe(document.body);
    });

    /*
     * In-page anchors go THROUGH Lenis (Brad, 2026-09-26: "clicking 'start a
     * project' on the pricing should actually take you to the 'get in touch'
     * section"). A same-page hash link made the browser jump natively while
     * Lenis still held its own target, so if the page was mid-glide Lenis
     * eased it straight back. Capture phase, so this runs before Next's Link
     * handler; links to another page are left alone (Next scrolls on
     * arrival, and Lenis starts fresh there).
     */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      const l = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
      if (!el || !l) return;
      e.preventDefault();
      // Lenis already honours the target's scroll-margin-top (measured: an
      // explicit offset landed it 96px short), so no offset here.
      l.scrollTo(el);
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      lenis?.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, []);

  return null;
}
