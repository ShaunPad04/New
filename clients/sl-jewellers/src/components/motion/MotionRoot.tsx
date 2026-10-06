"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-level motion plumbing:
 *  - body.paused while the tab is hidden (marquees stop)
 *  - Lenis smooth scroll on fine-pointer devices without reduced motion,
 *    with anchor links routed through it so the sticky header offset holds
 *  - header hide-on-scroll-down / show-on-scroll-up flags, and `data-scrolled`
 *    (the glass): on a page with a film hero (`[data-hero]`) the bar stays clear
 *    until the hero has scrolled up under it; elsewhere it turns at 8px. Re-read on
 *    every route change, since this component outlives the page it started on.
 */
export default function MotionRoot() {
  const pathname = usePathname();
  const syncHeader = useRef<() => void>(() => {});

  useEffect(() => {
    const onVis = () => document.body.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // Header flags
    const header = document.getElementById("site-header");
    let lastY = scrollY, ticking = false;
    const glass = () => {
      if (!header) return;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      header.dataset.scrolled = String(hero ? hero.getBoundingClientRect().bottom <= header.offsetHeight : scrollY > 8);
    };
    syncHeader.current = glass;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = scrollY;
        if (header) {
          glass();
          const menuOpen = header.querySelector("details[open]");
          header.dataset.hidden = String(y > 120 && y > lastY + 4 && !menuOpen);
        }
        lastY = y;
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    glass();

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: HTMLElement | number, o?: { offset?: number }) => void } | null = null;
    let raf = 0;
    let onClick: ((e: MouseEvent) => void) | null = null;

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
