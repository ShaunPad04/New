"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { isSoftwareGL } from "@/lib/gl-support";
import { prefersReducedMotion } from "@/lib/scroll-ticker";
import { FRAME } from "./ai-mobius-frame";
import type { MobiusHandle } from "./ai-mobius-scene";

/* The canvas covers the still plus the scene's margin on every side. */
const { w, h, pad } = FRAME;
const CANVAS_BOX: CSSProperties = {
  left: `${(-pad / w) * 100}%`,
  top: `${(-pad / h) * 100}%`,
  width: `${((w + pad * 2) / w) * 100}%`,
  height: `${((h + pad * 2) / h) * 100}%`,
};

/**
 * The chrome Möbius on the /ai "0" card, turning (Brad, 2026-10-06: "make
 * this spin in motion rather than being static").
 *
 * The still is the server render and the fallback: no JS, reduced motion,
 * data saver, software GL or a failed download all keep it, standing still.
 * Elsewhere the live scene (`ai-mobius-scene.ts`, the hero core's three.js
 * chunk) is fetched on idle as the card comes near, draws the still's own
 * frame, fades in OVER the still and only then lets it go, so nothing swaps
 * visibly; the strip then eases into its turn. It renders only while the
 * card is on screen and the tab is visible.
 */
export function MobiusSpin({ sizes }: { sizes: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = box.current;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (!el || saveData || prefersReducedMotion()) return;
    let cancelled = false;
    let requested = false;
    let onScreen = false;
    let handle: MobiusHandle | null = null;
    const sync = () => handle?.setActive(onScreen && document.visibilityState === "visible");

    const load = () => {
      if (cancelled || isSoftwareGL()) return;
      import("./ai-mobius-scene").then(
        (mod) => {
          if (cancelled || !canvas.current) return;
          const lite = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
          handle = mod.mountMobius(canvas.current, { lite, onFirstFrame: () => setLive(true) });
          sync();
        },
        () => {},
      );
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !requested) {
          requested = true;
          if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(load, { timeout: 1500 });
          else setTimeout(load, 300);
        }
        sync();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      cancelled = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      handle?.dispose();
      handle = null;
    };
  }, []);

  return (
    <div ref={box} className="relative">
      <Image
        src="/images/ai/mobius.2026-10-06.webp"
        alt=""
        width={1100}
        height={640}
        quality={90}
        sizes={sizes}
        className={`h-auto w-full transition-opacity duration-200 ${live ? "opacity-0 delay-700" : "opacity-100"}`}
      />
      <canvas
        ref={canvas}
        style={CANVAS_BOX}
        className={`absolute transition-opacity duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${live ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
