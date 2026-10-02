"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/scroll-ticker";

/**
 * The hero's "black line" with its glitch (the `.hero-wm` styles), for the
 * footer's bookend (Brad, 2026-10-02: "the footer should also have the
 * glitch"). One burst soon after it comes into view, then every 5-9s while it
 * stays there, as the hero's; hover bursts are the same pure CSS. Nothing
 * under reduced motion.
 */
export function GlitchWordmark() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let timer = 0;
    const burst = (delay: number) => {
      timer = window.setTimeout(() => {
        if (!document.hidden) {
          el.setAttribute("data-glitch", "");
          window.setTimeout(() => el.removeAttribute("data-glitch"), 340);
        }
        burst(5000 + Math.random() * 4000);
      }, delay);
    };
    const io = new IntersectionObserver(([e]) => {
      window.clearTimeout(timer);
      if (e.isIntersecting) burst(600);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const name = (
    <>
      <span>black</span>
      <span className="ml-[0.22em]">line</span>
    </>
  );
  return (
    <p ref={ref} aria-hidden="true" className="hero-wm">
      <span className="hero-wm-base">{name}</span>
      <span className="hero-wm-layer hero-wm-layer-a">{name}</span>
      <span className="hero-wm-layer hero-wm-layer-b">{name}</span>
    </p>
  );
}
