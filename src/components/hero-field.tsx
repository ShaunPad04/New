"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HERO FIELD — a living constellation over the footage.
 *
 * Adapted from the "aether flow" component the client sent. The idea is
 * exactly right for this hero and the implementation needed real work before
 * it could go on this page.
 *
 * WHAT WAS CHANGED, and why each one mattered:
 *
 *  1. COLOUR. The original is purple particles with purple links. This palette
 *     is monochrome by a locked decision, so both are white at low alpha.
 *
 *  2. IT NO LONGER PAINTS THE BACKGROUND. The original fills the whole canvas
 *     with black on every frame, which is correct when the canvas IS the hero
 *     and fatal here: it would paint over the frame sequence this hero exists
 *     to show. This clears to transparent instead, so the field sits ON the
 *     footage rather than replacing it.
 *
 *  3. PARTICLE COUNT IS CAPPED. The original derives the count from the canvas
 *     area — on a 1440x900 screen that is 144 particles, and `connect()` is
 *     O(n²), so roughly 10,000 distance checks every frame. On THIS page that
 *     is not academic: the hero is pinned for 320vh and the frame-timing work
 *     earlier tonight established it is already where this page's scroll
 *     budget goes. Capped at 80, which is ~3,200 pairs, and the link test uses
 *     squared distance so there is no square root in the inner loop.
 *
 *  4. IT STOPS WHEN NOBODY IS LOOKING. The original animates forever. This
 *     hero is the top of a 20,000px page, so an IntersectionObserver pauses
 *     the loop the moment the section leaves the viewport, and the tab's own
 *     visibility does the same. There is no reason to spend a frame budget on
 *     a canvas nobody can see.
 *
 *  5. THE CANVAS IS SIZED TO THE ELEMENT, not `window.innerWidth`, and to the
 *     device pixel ratio capped at 2 — the same reasoning already recorded for
 *     the frame-sequence canvas.
 *
 *  6. NO MOUSE WORK ON TOUCH. The repulsion is the nicest part of the original
 *     and it is meaningless without a pointer, so it is gated on a hover-
 *     capable device rather than shipped as dead weight to a phone.
 *
 *  7. DESKTOP ONLY, and this is the honest trade rather than a shortcut. Below
 *     768px this hero is already decoding a frame sequence on a phone, and the
 *     static CSS mesh gives the same impression there for nothing.
 *
 * Under `prefers-reduced-motion` the field never starts and the CSS mesh is
 * what renders — a still version of the same idea.
 */

/** Hard cap. See note 3: the link pass is O(n²). */
const MAX_PARTICLES = 80;
/** One particle per this many CSS pixels of area, up to the cap. */
const AREA_PER_PARTICLE = 16000;
/** Particles nearer than this are joined. Squared, to keep sqrt out of the loop. */
const LINK_DISTANCE = 132;
/** How far the pointer pushes the field around it. */
const POINTER_RADIUS = 190;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");

    const decide = () => setEnabled(!reduced.matches && wide.matches);
    decide();
    reduced.addEventListener("change", decide);
    wide.addEventListener("change", decide);

    return () => {
      reduced.removeEventListener("change", decide);
      wide.removeEventListener("change", decide);
      void hover;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;
    const pointer = { x: -9999, y: -9999, live: false };

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        MAX_PARTICLES,
        Math.round((width * height) / AREA_PER_PARTICLE),
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: Math.random() * 1.4 + 0.7,
      }));
    };

    const frame = () => {
      if (!running) return;
      raf = requestAnimationFrame(frame);

      // Transparent, not black — the footage is behind this.
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        if (pointer.live) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < POINTER_RADIUS && d > 0.01) {
            const push = (POINTER_RADIUS - d) / POINTER_RADIUS;
            p.x -= (dx / d) * push * 3.4;
            p.y -= (dy / d) * push * 3.4;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();
      }

      // Links. Squared distance, so no square root in the inner loop.
      const limit = LINK_DISTANCE * LINK_DISTANCE;
      ctx.lineWidth = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const d2 = dx * dx + dy * dy;
          if (d2 > limit) continue;
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d2 / limit) * 0.3})`;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    };

    const start = () => {
      if (running && raf) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.live = true;
    };
    const onPointerLeave = () => {
      pointer.live = false;
    };

    size();
    start();

    window.addEventListener("resize", size, { passive: true });
    if (hover) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    // Nothing to draw for a canvas nobody can see.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () =>
      document.visibilityState === "visible" ? start() : stop();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      /* Masked like the CSS mesh it sits with: strongest off-centre right,
         gone by the bottom-left, which is where the logotype and the calls to
         action live. The field never competes with the copy. */
      className="hero-field pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
