"use client";

import { useEffect, useState } from "react";
import { heroScrubLine } from "@/lib/content";
import { heroFonts } from "./hero-fonts";

declare global {
  interface Window {
    __blPreloaded?: boolean;
  }
}

/**
 * PRELOADER — after Neiden's load screen (Brad, 2026-09-28: "when you reload
 * the page I want a load screen kind of thing, like how Neiden is"). Black,
 * the line writing itself in script with a glowing pen tip (no logo: Brad
 * removed the BL mark, 2026-09-28); then the screen lifts away and the hero's own entrance plays
 * (its delays are keyed off `.bl-preloader` in globals.css).
 *
 * ~2.5s, not Neiden's ~5s: it is pure CSS in the server HTML, so it covers
 * the page from the first paint with no JavaScript in the way, and it never
 * blocks input (pointer-events: none). Full loads only: after the first
 * mount a window flag stops it replaying on client-side navigation back to
 * `/`. Not shown under reduced motion or without scripting (CSS).
 */
export function Preloader() {
  // Hydration renders it (the flag is unset until the effect below), so the
  // server HTML matches; a later client navigation to `/` skips it.
  const [show] = useState(() => typeof window === "undefined" || !window.__blPreloaded);
  useEffect(() => {
    window.__blPreloaded = true;
    /*
     * A RELOAD opens on the hero (Brad, 2026-09-28: reloading opened on the
     * contact form). The URL still carried #contact from an earlier "Get in
     * touch" click, and the browser also restores the old scroll position on
     * reload. So on a reload only: drop the hash, stop the browser restoring,
     * and go to the top — under the load screen, where the jump is unseen.
     * A real link to /#contact (a navigation, not a reload) still lands on
     * the form, via HashScroll.
     */
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type !== "reload") return;
    history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
    const top = () => {
      window.scrollTo(0, 0);
      window.__lenis?.scrollTo(0, { immediate: true });
    };
    top();
    window.addEventListener("load", top, { once: true });
    return () => window.removeEventListener("load", top);
  }, []);
  if (!show) return null;

  return (
    <div aria-hidden="true" className={`bl-preloader ${heroFonts}`}>
      <p className="bl-preloader-line">
        <span className="bl-preloader-ink">{heroScrubLine.toLowerCase()}</span>
        <span className="bl-preloader-tip" />
      </p>
    </div>
  );
}
