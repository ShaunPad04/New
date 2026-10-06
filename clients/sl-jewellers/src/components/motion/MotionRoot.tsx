"use client";

import { useEffect, useRef } from "react";
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
 */
export default function MotionRoot() {
  const pathname = usePathname();
  const syncHeader = useRef<() => void>(() => {});

  useEffect(() => {
    const onVis = () => document.body.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // Header flags. Every header variant carries data-site-header (only one shows at a time
    // during the walk-through); each compares the hero's bottom with its own bottom edge.
    let ticking = false;
    const glass = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
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
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: HTMLElement | number, o?: { offset?: number }) => void } | null = null;
    let raf = 0;
    let onClick: ((e: MouseEvent) => void) | null = null;
    let onStop: (() => void) | null = null;
    let onStart: (() => void) | null = null;

    if (!reduce && fine) {
      import("lenis").then(async ({ default: Lenis }) => {
        lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
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
        onStop = () => (lenis as unknown as { stop: () => void } | null)?.stop();
        onStart = () => (lenis as unknown as { start: () => void } | null)?.start();
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
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => syncHeader.current());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
