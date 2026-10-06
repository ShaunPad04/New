"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/scroll-ticker";
import { HeroCta } from "./hero-cta";
import { LABEL } from "./page-grid";
import type { CoreHandle } from "./ai-core-scene";

/**
 * /ai HERO — cinematic, after utomic.framer.website (Brad, 2026-10-06: "a
 * landing page like this one … with a cool design", black + Black Line red,
 * "try live 3d in code that reacts to the mouse" first; a rendered 3D figure
 * image may follow).
 *
 * The live core (`ai-core-scene.ts`) loads by dynamic import once the hero
 * is on screen, so three.js is never in the first load. Server render,
 * no-JS, reduced motion, no WebGL and software GL all keep the static orb —
 * the same composition, standing still. The headline never waits on any of it.
 *
 * The orb is the FALLBACK, never a placeholder (Brad, 2026-10-06: "why does
 * it show like this for a split second"). It used to show on every visit
 * until the core had loaded, then cross-fade, so everyone saw a still sphere
 * swap for the live one. Now the stage waits empty (the red bloom only) and
 * the core fades in; the orb appears only when the core will not run: no JS
 * or reduced motion (CSS, `.ai-orb` in globals.css), or no WebGL, software
 * GL or a failed download (`phase` = "static"). three.js starts downloading
 * on mount rather than after the observer's first callback.
 */
export function AiHero({ systems }: { systems: string[] }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<CoreHandle | null>(null);
  const [phase, setPhase] = useState<"wait" | "live" | "static">("wait");

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    let tried = false;
    let onScreen = true;
    const sync = () => handle.current?.setActive(onScreen && document.visibilityState === "visible");
    // The hero opens the page, so fetch three.js now, not after the first callback.
    const scene = import("./ai-core-scene").catch(() => null);

    const io = new IntersectionObserver(async ([entry]) => {
      onScreen = entry.isIntersecting;
      if (!tried && onScreen) {
        tried = true;
        const lite = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
        const mod = await scene;
        if (cancelled || !canvas.current) return;
        handle.current = mod ? mod.mountCore(canvas.current, { lite }) : null;
        // No WebGL, a software rasteriser or a failed download: show the orb.
        setPhase(handle.current ? "live" : "static");
      }
      sync();
    });
    io.observe(el);

    // Mouse only: on touch the core idles on its own rather than jumping to taps.
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      handle.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    };
    el.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelled = true;
      io.disconnect();
      el.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", sync);
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  /* The conveyor (Brad, 2026-10-06: "the marquee was glitching/cutting out").
     `marquee-x` slides the track by exactly half its width, so the track is
     TWO identical groups and each item carries its own trailing space (a
     flex gap leaves one gap fewer than items, so half the width missed the
     second group's start and every loop jumped). One group is the systems
     three times over, ~4,800px, so its end never comes into view on a wide
     screen (one run of seven is ~1,600px and left an empty strip). Duration
     scales with the group, so the speed stays what it was (46s a run). */
  const REPEAT = 3;
  const group = Array.from({ length: REPEAT }, () => systems).flat();

  return (
    <section ref={root} aria-labelledby="ai-hero-heading" className="relative isolate overflow-hidden bg-ink-0 text-ink-1000">
      {/* Atmosphere: a red bloom under the core, a fine dot grid, a fade to black. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(42%_38%_at_50%_58%,rgba(240,43,66,0.28),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(60%_55%_at_50%_50%,#000,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-0" />
      </div>

      {/* The giant word behind everything, outlined. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[46%] -z-10 -translate-y-1/2 select-none text-center font-[family-name:var(--font-display)] text-[clamp(5rem,21vw,22rem)] leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)]"
      >
        AUTOMATE
      </p>

      <div className="relative mx-auto flex min-h-[min(calc(100svh-2.75rem),64rem)] max-w-[90rem] flex-col items-center px-6 pb-10 pt-16 text-center sm:px-10 lg:pt-20">
        <p className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-ink-800 backdrop-blur ${LABEL}`}>
          <span aria-hidden="true" className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          AI automation for UK businesses
        </p>

        <h1 id="ai-hero-heading" className="display mt-6 max-w-[16ch] text-[clamp(2.75rem,6.6vw,6rem)] leading-[0.88] text-ink-1000">
          Your business, <span className="block text-accent">on autopilot.</span>
        </h1>
        <p className="mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">
          Systems that answer, follow up and book while you get on with the work. Built around your business, connected to the tools you already use.
        </p>

        {/* The stage: the live core fades in once it has drawn; the static orb shows only if it cannot run. */}
        <div aria-hidden="true" className="relative -mb-4 -mt-2 h-[min(50svh,92vw)] w-full max-w-[56rem] sm:-mb-8 sm:-mt-6">
          <div data-state={phase} className="ai-orb absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-square h-[62%]">
              <div className="absolute inset-[-28%] rounded-full border border-accent/25" />
              <div className="absolute inset-[-12%] rounded-full border border-white/[0.07]" />
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,#ffffff_0,#c9c9c9_7%,#4a4a4a_26%,#0d0d0d_58%,#1a0408_100%)] shadow-[0_0_90px_10px_rgba(240,43,66,0.35),inset_-18px_-22px_50px_rgba(240,43,66,0.45)]" />
            </div>
          </div>
          <canvas
            ref={canvas}
            className={`absolute inset-0 h-full w-full transition-opacity duration-1000 [transform:translateZ(0)] ${phase === "live" ? "opacity-100" : "opacity-0"}`}
          />
        </div>

        <div className="relative z-10 flex w-full max-w-[34rem] flex-col gap-3 sm:flex-row">
          <HeroCta label="Book a free audit" href="#contact" light className="sm:flex-1" />
          <HeroCta label="Hear it answer" href="#demo" className="border border-white/15 sm:flex-1" />
        </div>
        <p className="mt-4 text-[0.8125rem] text-ink-600">Free audit call. No obligation, no jargon.</p>
      </div>

      {/* What it does, on a slow conveyor (static under reduced motion). */}
      <div className="relative border-y border-white/10 bg-white/[0.02] py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="sr-only">
          {systems.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <div aria-hidden="true" className="marquee-track flex w-max" style={{ "--marquee-duration": `${46 * REPEAT}s` } as CSSProperties}>
          {[0, 1].map((g) => (
            <div key={g} className="flex shrink-0">
              {group.map((s, i) => (
                <span key={i} className={`flex items-center gap-10 whitespace-nowrap pr-10 text-ink-700 ${LABEL}`}>
                  {s}
                  <span className="size-1 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
