"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SPOTLIGHT CURSOR — a soft light that follows the pointer.
 *
 * Adapted from the component the client sent. The idea suits a black site: it
 * makes the ground feel like a surface being lit rather than a flat colour.
 * Four changes were needed before it belonged on this page.
 *
 *  1. IT NO LONGER RUNS FOREVER. The original schedules a frame every frame
 *     for the life of the page, clearing and refilling a full-viewport canvas
 *     whether the pointer moved or not. Here the loop starts on movement and
 *     stops itself after the pointer has been still for a moment, so an idle
 *     reader costs nothing. On a page that already drives a pinned frame
 *     sequence, a permanent full-screen rAF is not a rounding error.
 *
 *  2. TOUCH DEVICES DO NOT GET IT. There is no pointer to follow, so the
 *     original ships a canvas and a listener to every phone for an effect
 *     nobody there can see. Gated on `(hover: hover)`.
 *
 *  3. z-INDEX. The original sits at `z-[9999]`, above everything — including,
 *     here, the header and the menu overlay, which would put a wash over the
 *     one part of the page that must stay crisp. It sits under the UI instead.
 *
 *  4. THE CANVAS IS SIZED TO THE DEVICE PIXEL RATIO, capped at 2. The original
 *     sizes to CSS pixels, which on any modern display draws a soft gradient
 *     at half resolution and then scales it up — the one thing that makes this
 *     effect look cheap.
 *
 * Colour needed no adapting: the component's default is already white, which
 * is the only choice this palette allows.
 */

/** Radius of the light, in CSS pixels. */
const RADIUS = 260;
/** Peak alpha at the centre. Higher reads as a torch, not a room light. */
const BRIGHTNESS = 0.07;
/** Stop drawing once the pointer has been still this long. */
const IDLE_MS = 400;

export function SpotlightCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const decide = () => setEnabled(media.matches);
    decide();
    media.addEventListener("change", decide);
    return () => media.removeEventListener("change", decide);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let x = -9999;
    let y = -9999;
    let width = 0;
    let height = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, width, height);
      if (x < -1000) return;

      const g = ctx.createRadialGradient(x, y, 0, x, y, RADIUS);
      g.addColorStop(0, `rgba(255,255,255,${BRIGHTNESS})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    };

    /** One frame per pointer move, coalesced — never a standing loop. */
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      schedule();
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        // Nothing to do when the pointer has stopped: the last frame already
        // shows the light where it belongs.
      }, IDLE_MS);
    };

    const onLeave = () => {
      x = -9999;
      y = -9999;
      schedule();
    };

    size();
    window.addEventListener("resize", size, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
