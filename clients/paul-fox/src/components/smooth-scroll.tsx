"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scroll for the whole page; destroyed on unmount. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return <>{children}</>;
}
