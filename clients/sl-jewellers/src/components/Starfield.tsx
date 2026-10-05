"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's starfield, redrawn for a section: the same rules as the points
 * in sl-mark.js (mostly small with a few larger, a gold-warm bias on some,
 * every star twinkling at its own rate with the faintest winking out), on a
 * 2D canvas with additive blending, so no second WebGL context. Runs only
 * while the section is on screen and the tab is visible; reduced motion
 * paints one still frame.
 */
const COOL = [223, 230, 242];
const WARM = [242, 215, 154];
const DENSITY = 420 / (1440 * 900); // the hero's count on a laptop screen

type Star = { x: number; y: number; size: number; warm: number; phase: number; rate: number };

function sprite(rgb: number[]) {
  const c = document.createElement("canvas");
  const S = 48;
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  // soft core, squared falloff, like the shader's smoothstep²
  grd.addColorStop(0, `rgba(${rgb.join(",")},1)`);
  grd.addColorStop(0.25, `rgba(${rgb.join(",")},0.55)`);
  grd.addColorStop(0.55, `rgba(${rgb.join(",")},0.12)`);
  grd.addColorStop(1, `rgba(${rgb.join(",")},0)`);
  g.fillStyle = grd;
  g.fillRect(0, 0, S, S);
  return c;
}

export default function Starfield({ opacity = 0.8, className = "" }: { opacity?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cool = sprite(COOL);
    const warm = sprite(WARM);
    let stars: Star[] = [];
    let w = 0, h = 0, dpr = 1;
    let raf = 0, visible = false;
    const t0 = performance.now();

    const fit = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = Math.round(r.width);
      h = Math.round(r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const n = Math.min(900, Math.round(w * h * DENSITY));
      stars = Array.from({ length: n }, () => {
        const phase = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: 1 + Math.pow(Math.random(), 3) * 2.2,
          warm: Math.pow(Math.random(), 1.6),
          phase,
          rate: 0.65 + phase * 0.16,
        };
      });
      draw(performance.now());
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const s of stars) {
        const tw = reduce ? 0.7 : 0.46 + 0.34 * Math.sin(t * s.rate + s.phase) + 0.2 * Math.sin(t * s.rate * 2.7 + s.phase * 1.7);
        if (tw <= 0) continue;
        const d = s.size * 3.2; // sprite diameter in CSS px; the visible core is about a third of it
        ctx.globalAlpha = Math.min(1, tw) * opacity;
        // two sprites blended by the star's warmth
        if (s.warm < 0.5) {
          ctx.drawImage(cool, s.x - d / 2, s.y - d / 2, d, d);
          if (s.warm > 0.15) {
            ctx.globalAlpha *= s.warm * 1.2;
            ctx.drawImage(warm, s.x - d / 2, s.y - d / 2, d, d);
          }
        } else {
          ctx.drawImage(warm, s.x - d / 2, s.y - d / 2, d, d);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || reduce) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && visible && !document.hidden && !reduce) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    }, { rootMargin: "80px 0px" });
    io.observe(canvas);
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);
    const onVis = () => kick();
    document.addEventListener("visibilitychange", onVis);
    fit();

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [opacity]);

  return <canvas ref={ref} className={`starfield ${className}`} aria-hidden="true" />;
}
