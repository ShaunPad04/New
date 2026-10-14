"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The only JavaScript behind every scroll reveal on the site.
 *
 * One IntersectionObserver per navigation, each element unobserved the
 * moment it fires. Under `prefers-reduced-motion`, or where
 * IntersectionObserver is missing, everything is revealed at once rather
 * than withheld — the transition is optional, the content never is.
 *
 * `window.__revealReady` tells the inline failsafe in the document that
 * this ran; see layout.tsx.
 */
declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

export function RevealEngine() {
  const pathname = usePathname();

  useEffect(() => {
    window.__revealReady = true;

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
    );
    if (nodes.length === 0) return;

    const revealAll = () => nodes.forEach((n) => n.setAttribute("data-revealed", ""));

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
