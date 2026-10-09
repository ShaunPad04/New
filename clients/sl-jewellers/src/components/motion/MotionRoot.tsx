"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-level motion plumbing:
 *  - body.paused while the tab is hidden (marquees stop)
 *  - Lenis smooth scroll on fine-pointer devices without reduced motion,
 *    with anchor links routed through it so the sticky header offset holds
 *  - the header's `data-scrolled` (the glass): on a page with a film hero
 *    (`[data-hero]`) the bar stays clear until the hero has scrolled up under it;
 *    elsewhere it turns at 8px. Re-read on every route change, since this component
 *    outlives the page it started on. The bar itself never moves: it used to slide
 *    away on scroll-down and back on scroll-up, and under Lenis's easing that flag
 *    flipped back and forth and the bar jittered (Shaun, 6 Oct 2026).
 *  - Lenis reset on every route change. Lenis keeps easing toward the scroll it was heading
 *    for, so a product clicked while the grid was still gliding opened at that old depth,
 *    which on the shorter product page is the footer (Shaun, 7 Oct 2026).
 */
type LenisLike = { raf: (t: number) => void; destroy: () => void; stop: () => void; start: () => void; isStopped: boolean; scrollTo: (t: HTMLElement | number, o?: { offset?: number }) => void };
// stop() then start() is Lenis's public way to drop a glide in progress (each resets the target to
// the real scroll); skipped while the menu has Lenis paused.
const settle = (l: LenisLike | null) => {
  if (!l || l.isStopped) return;
  l.stop();
  l.start();
};

export default function MotionRoot() {
  const pathname = usePathname();
  const syncHeader = useRef<() => void>(() => {});
  const lenisRef = useRef<LenisLike | null>(null);

  useEffect(() => {
    const onVis = () => document.body.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // Header flags. Every header variant carries data-site-header (only one shows at a time
    // during the walk-through); each compares the hero's bottom with its own bottom edge.
    let ticking = false;
    const glass = () => {
      // a page's own hand-off edge if it marks one ([data-hero-edge]), else the hero's bottom
      const hero = document.querySelector<HTMLElement>("[data-hero-edge]") ?? document.querySelector<HTMLElement>("[data-hero]");
      const heroBottom = hero?.getBoundingClientRect().bottom;
      document.querySelectorAll<HTMLElement>("[data-site-header]").forEach((header) => {
        const bottom = header.getBoundingClientRect().bottom;
        header.dataset.scrolled = String(heroBottom !== undefined ? heroBottom <= Math.max(bottom, 64) : scrollY > 8);
      });
    };
    syncHeader.current = glass;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        glass();
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    glass();

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let lenis: LenisLike | null = null;
    let raf = 0;
    let onClick: ((e: MouseEvent) => void) | null = null;
    let onStop: (() => void) | null = null;
    let onStart: (() => void) | null = null;

    if (!reduce && fine) {
      import("lenis").then(async ({ default: Lenis }) => {
        lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
        lenisRef.current = lenis;
        // Keep GSAP ScrollTrigger (the stock showcase pin) in step with Lenis.
        try {
          const { ScrollTrigger } = await import("gsap/ScrollTrigger");
          const { default: gsap } = await import("gsap");
          gsap.registerPlugin(ScrollTrigger);
          (lenis as unknown as { on: (e: string, cb: () => void) => void }).on("scroll", ScrollTrigger.update);
        } catch {
          /* gsap not loaded on this page */
        }
        // the menu pauses smooth scroll while it is open (menu/MenuController.tsx)
        onStop = () => lenis?.stop();
        onStart = () => lenis?.start();
        addEventListener("lenis:stop", onStop);
        addEventListener("lenis:start", onStart);
        const loop = (t: number) => {
          lenis?.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        onClick = (e: MouseEvent) => {
          const a = (e.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
          if (!a) return;
          const href = a.getAttribute("href") || "";
          const hash = href.startsWith("#") ? href : href.startsWith("/#") && location.pathname === "/" ? href.slice(1) : "";
          if (!hash || hash === "#") return;
          const target = document.querySelector(hash) as HTMLElement | null;
          if (!target) return;
          e.preventDefault();
          history.pushState(null, "", hash);
          lenis?.scrollTo(target, { offset: -80 });
        };
        document.addEventListener("click", onClick);
      });
    }

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      removeEventListener("scroll", onScroll);
      if (onClick) document.removeEventListener("click", onClick);
      if (onStop) removeEventListener("lenis:stop", onStop);
      if (onStart) removeEventListener("lenis:start", onStart);
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // In the same commit as Next's scroll to the top of the new page: stop any glide left over
  // from the last page so Lenis can't pull the window back down, then once the new position
  // has settled take it as Lenis's own.
  useLayoutEffect(() => {
    settle(lenisRef.current);
    const id = requestAnimationFrame(() => settle(lenisRef.current));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const id = requestAnimationFrame(() => syncHeader.current());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
