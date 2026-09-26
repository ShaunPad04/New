"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/scroll-ticker";
import { useInViewTicker } from "@/components/kit/use-kit";
import type { MonogramHandle, WordLayout, WordMetrics } from "./chrome-monogram-scene";

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
  const [word, setWord] = useState(false);
  const lack = useRef<HTMLSpanElement>(null);
  const ine = useRef<HTMLSpanElement>(null);
  /** Baseline distance from the top of a 1px line box, measured once. */
  const baseline = useRef(0.8);

  /* Measure the HTML half of the word in the font it will render in, so the
     scene can lay the 3D letters out around it. Canvas measureText gives
     the width and the cap height of the real loaded face. */
  function measure(): WordMetrics {
    const el = lack.current;
    const ctx = document.createElement("canvas").getContext("2d");
    if (!el || !ctx) return { lack: 1.9, ine: 1.2, cap: 0.7 };
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
    const m = ctx.measureText("lack");
    const cap = ctx.measureText("H").actualBoundingBoxAscent / 100 || 0.7;
    const asc = m.fontBoundingBoxAscent / 100 || 0.95;
    const desc = m.fontBoundingBoxDescent / 100 || 0.25;
    baseline.current = (1 - (asc + desc)) / 2 + asc;
    return { lack: m.width / 100, ine: ctx.measureText("ine").width / 100, cap };
  }

  function place(w: WordLayout) {
    const o = Math.max(0, (w.split - 0.6) / 0.4);
    for (const [el, x] of [
      [lack.current, w.lackX],
      [ine.current, w.ineX],
    ] as const) {
      if (!el) continue;
      el.style.fontSize = `${w.fontPx}px`;
      el.style.transform = `translate3d(${x}px, ${w.baseY - baseline.current * w.fontPx}px, 0)`;
      el.style.opacity = String(o);
    }
  }

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
        await document.fonts?.ready;
        if (cancelled || !canvas.current) return;
        handle.current = mountMonogram(canvas.current, measure(), place);
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

  function toggle() {
    const next = !word;
    setWord(next);
    handle.current?.setSplit(next);
  }

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

  const fallbackWord = word && !live;
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

        {/* The stage is a BUTTON: click the mark and it spells BlackLine,
            click again and it closes back into the monogram. Wide, so the
            word has room; the mark itself stays the same size. */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={word}
          aria-label={word ? "Show the BL monogram" : "Spell out BlackLine"}
          className="relative block h-[min(66svh,82vw)] w-full cursor-pointer outline-offset-[-8px] [-webkit-tap-highlight-color:transparent]"
        >
          <canvas
            ref={canvas}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 [transform:translateZ(0)] ${live ? "opacity-100" : "opacity-0"}`}
          />
          {/* The HTML half of the word, placed by the scene every frame. */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <span ref={lack} className="foil absolute left-0 top-0 whitespace-nowrap font-sans font-medium leading-none tracking-normal opacity-0 will-change-transform">
              lack
            </span>
            <span ref={ine} className="foil absolute left-0 top-0 whitespace-nowrap font-sans font-medium leading-none tracking-normal opacity-0 will-change-transform">
              ine
            </span>
          </span>
          <svg
            viewBox="0 0 1000 1000"
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live || fallbackWord ? "opacity-0" : "opacity-100"}`}
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
          {/* No WebGL / reduced motion: the click still works, as a
              crossfade to the name set in the same foil. */}
          <span
            aria-hidden="true"
            className={`foil absolute inset-0 flex items-center justify-center font-sans text-[clamp(3rem,12vw,10rem)] font-medium leading-none tracking-[-0.02em] transition-opacity duration-700 ${fallbackWord ? "opacity-100" : "opacity-0"}`}
          >
            BlackLine
          </span>
        </button>
      </div>
    </section>
  );
}
