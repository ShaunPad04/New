"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { isSoftwareGL } from "@/lib/gl-support";
import { prefersReducedMotion } from "@/lib/scroll-ticker";
import { FRAME } from "./ai-mobius-frame";
import type { MobiusHandle } from "./ai-mobius-scene";

/* The canvas covers the square the strip can reach at any angle
   (`FRAME.view`), placed over the still (`FRAME` x, y, w, h). */
const { x, y, w, h, view } = FRAME;
const CANVAS_BOX: CSSProperties = {
  left: `${((view.x - x) / w) * 100}%`,
  top: `${((view.y - y) / h) * 100}%`,
  width: `${(view.w / w) * 100}%`,
  height: `${(view.h / h) * 100}%`,
};

/**
 * The chrome Möbius on the /ai "0" card, turning (Brad, 2026-10-06: "make
 * this spin in motion rather than being static"), and turned by hand ("you
 * should be able to spin it if you click your mouse on it ... move it
 * freely").
 *
 * The still is the server render and the fallback: no JS, reduced motion,
 * data saver, software GL or a failed download all keep it, standing still
 * and not draggable. Elsewhere the live scene (`ai-mobius-scene.ts`, the hero
 * core's three.js chunk) is fetched on idle as the card comes near, draws the
 * still's own frame, fades in OVER the still and only then lets it go, so
 * nothing swaps visibly; the strip then eases into its turn. It renders only
 * while the card is on screen and the tab is visible.
 *
 * Dragging: the still's box takes the pointer once the scene is live (grab
 * cursor). A mouse turns it freely; a finger turns it sideways only
 * (`touch-action: pan-y`), so a vertical swipe still scrolls the page. A
 * small "Drag to spin" hint shows until the first drag. Decoration, so it
 * stays aria-hidden with no keyboard control.
 */
export function MobiusSpin({ sizes }: { sizes: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<MobiusHandle | null>(null);
  const grip = useRef<{ id: number; x: number; y: number } | null>(null);
  const [live, setLive] = useState(false);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    const el = box.current;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (!el || saveData || prefersReducedMotion()) return;
    let cancelled = false;
    let requested = false;
    let onScreen = false;
    const sync = () => handle.current?.setActive(onScreen && document.visibilityState === "visible");

    const load = () => {
      if (cancelled || isSoftwareGL()) return;
      import("./ai-mobius-scene").then(
        (mod) => {
          if (cancelled || !canvas.current) return;
          const lite = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
          handle.current = mod.mountMobius(canvas.current, { lite, onFirstFrame: () => setLive(true) });
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
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!handle.current || (e.pointerType === "mouse" && e.button !== 0)) return;
    if (e.pointerType === "mouse") e.preventDefault(); // no text selection or image drag
    e.currentTarget.setPointerCapture(e.pointerId);
    grip.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
  };
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = grip.current;
    if (!g || g.id !== e.pointerId || !handle.current) return;
    handle.current.drag(e.clientX - g.x, e.clientY - g.y, e.pointerType !== "touch");
    g.x = e.clientX;
    g.y = e.clientY;
    if (!used) setUsed(true);
  };
  const up = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (grip.current?.id !== e.pointerId) return;
    grip.current = null;
    handle.current?.release();
  };

  return (
    <div
      ref={box}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      className={`relative select-none ${live ? "pointer-events-auto cursor-grab touch-pan-y active:cursor-grabbing" : ""}`}
    >
      <Image
        src="/images/ai/mobius.2026-10-06.webp"
        alt=""
        width={1100}
        height={640}
        quality={90}
        sizes={sizes}
        draggable={false}
        className={`h-auto w-full transition-opacity duration-200 ${live ? "opacity-0 delay-700" : "opacity-100"}`}
      />
      <canvas
        ref={canvas}
        style={CANVAS_BOX}
        className={`pointer-events-none absolute transition-opacity duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${live ? "opacity-100" : "opacity-0"}`}
      />
      {live && !used ? (
        <span className="ai-hint pointer-events-none absolute -bottom-3 right-14 inline-flex sm:right-6 items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[-0.02em] text-ink-600">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
            <path d="M12.5 1.5v3h-3" />
          </svg>
          Drag to spin
        </span>
      ) : null}
    </div>
  );
}
