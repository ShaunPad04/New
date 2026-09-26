"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/scroll-ticker";
import { useInViewTicker } from "@/components/kit/use-kit";
import type { MonogramHandle } from "./chrome-monogram-scene";

/**
 * CHROME MONOGRAM (Brad, 2026-09-25: "our logo as a 3D logo … in the middle
 * as a scroll-driven 3D model, it should look kind of chrome").
 *
 * The BL mark, extruded and in mirror chrome, making ONE full 360° turn
 * with the scroll while the stage is pinned, then releasing face-on
 * (Brad, 2026-09-26).
 *
 * - Any screen at least 560px tall, phones included: the section is 320vh
 *   and the stage is `position: sticky`, so the mark holds centre screen
 *   for the whole turn and the page moves on once it is done. Native
 *   sticky, never a ScrollTrigger pin (CLAUDE.md: a stored pin start goes
 *   stale and slams). Shorter screens: no pin; it turns as it passes.
 * - three.js loads by dynamic import when the section is within a screen,
 *   so it is absent from the first load everywhere.
 * - The server render, no-JS, no-WebGL and reduced motion all get the FLAT
 *   foil mark (the favicon geometry) — the same logo, standing still.
 */
export function ChromeMonogram() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<MonogramHandle | null>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const { mountMonogram } = await import("./chrome-monogram-scene");
        if (cancelled || !canvas.current) return;
        handle.current = mountMonogram(canvas.current);
        if (handle.current) setLive(true);
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  useInViewTicker(root, (el, { vh }) => {
    const r = el.getBoundingClientRect();
    // Pinned: 0 as the stage pins, 1 as it frees. Unpinned (phones): 0 as
    // the section's top enters, 1 as its bottom leaves.
    const pinned = r.height > vh * 1.5;
    const p = pinned
      ? (-r.top) / (r.height - vh)
      : (vh - r.top) / (vh + r.height);
    handle.current?.setProgress(Math.min(1, Math.max(0, p)));
  });

  return (
    <section
      ref={root}
      aria-labelledby="mark-heading"
      className="relative border-t border-ink-300 [@media(min-height:560px)]:h-[320vh] motion-reduce:h-auto!"
    >
      <div className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden py-16 [@media(min-height:560px)]:sticky [@media(min-height:560px)]:top-0 [@media(min-height:560px)]:h-svh motion-reduce:static!">
        {/* Soft floor light, so the chrome has something to sit in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 42% at 50% 52%, rgb(255 255 255 / 0.07), transparent 70%)",
          }}
        />

        {/* No visible heading or caption (Brad, 2026-09-26: "remove the
            random text") — the mark stands alone. The heading stays for
            screen readers so the section is still named. */}
        <h2 id="mark-heading" className="sr-only">
          The Black Line Agency monogram
        </h2>

        {/* The stage. Canvas and flat mark share one box; the flat mark
            fades out only once the 3D one has drawn. (A click-to-spell
            "BlackLine" state was tried 2026-09-26 and removed on Brad's
            word — the mark stands alone.) */}
        <div aria-hidden="true" className="relative h-[min(66svh,82vw)] w-full">
          <canvas
            ref={canvas}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 [transform:translateZ(0)] ${live ? "opacity-100" : "opacity-0"}`}
          />
          <svg
            viewBox="0 0 1000 1000"
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
          >
            <defs>
              <linearGradient id="mark-foil" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.22" stopColor="#b8b8b8" />
                <stop offset="0.44" stopColor="#ffffff" />
                <stop offset="0.62" stopColor="#d4d4d4" />
                <stop offset="0.82" stopColor="#f2f2f2" />
                <stop offset="1" stopColor="#a8a8a8" />
              </linearGradient>
            </defs>
            <g
              transform="translate(-273.09 -236.99) scale(1.20325)"
              fill="none"
              stroke="url(#mark-foil)"
              strokeWidth="56"
            >
              <path d="M447 875V328H612A106 106 0 0 1 612 540H700A132 132 0 0 1 700 804H590" />
              <path d="M528 395V897H860" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
