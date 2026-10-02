"use client";

import { useEffect, useRef } from "react";

/** Our words, not Ovra's: what the studio does, one verb at a time. */
const WORDS = ["Design", "Build", "Launch", "Rank", "Convert", "Refine"];

/**
 * PLEXUS — after ovra.framer.website's hero (Brad, 2026-09-28); studied,
 * nothing taken.
 *
 * A web of thin lines tiled into triangles is ALREADY on the hero, faint,
 * across the whole frame, behind the type. Hovering reveals it: the part
 * under the pointer brightens and its points swell, fading back into the
 * faint web around it, so there is never a separate cluster following the
 * mouse (Brad rejected both a disc carried by the cursor — "a bubble" — and a
 * patch that appeared only on movement). The pointer is a ring with a dot and
 * a verb beside it. Monochrome (Ovra's red is white here).
 *
 * Fine pointers (desktop) only: touch screens get neither. The faint web is
 * drawn once; the hover reveal and the custom cursor are off under reduced
 * motion, and the canvas only redraws while the reveal is easing.
 */
export function PlexusCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ring = ringRef.current;
    const word = wordRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ring || !word || !host || !ctx) return;
    // Touch screens get neither the web nor the cursor (Brad, 2026-09-29:
    // "get rid of this on mobile ... but keep it on desktop").
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const interactive = !matchMedia("(prefers-reduced-motion: reduce)").matches;

    const REACH = 190; // reveal radius
    const HOT = 70;
    const LINK = 72;
    const BASE_LINE = 0.07;
    const BASE_DOT = 0.22;
    // Points are placed ONCE, in 0-1 units, and only rescaled on resize: a
    // fresh random set per resize made the whole web jump.
    let seed: { u: number; v: number }[] = [];
    let pts: { x: number; y: number }[] = [];
    let edges: [number, number][] = [];

    let dpr = 1;
    let w = 0;
    let h = 0;
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // About one point per 44x44px, joined to its nearest neighbours.
      if (!seed.length) seed = Array.from({ length: Math.round((w * h) / 1900) }, () => ({ u: Math.random(), v: Math.random() }));
      pts = seed.map(({ u, v }) => ({ x: u * w, y: v * h }));
      const cells = new Map<string, number[]>();
      const key = (cx: number, cy: number) => `${cx},${cy}`;
      pts.forEach((p, i) => {
        const k = key(Math.floor(p.x / LINK), Math.floor(p.y / LINK));
        (cells.get(k) ?? cells.set(k, []).get(k)!).push(i);
      });
      const seen = new Set<string>();
      edges = [];
      pts.forEach((p, i) => {
        const cx = Math.floor(p.x / LINK);
        const cy = Math.floor(p.y / LINK);
        const cand: { j: number; d: number }[] = [];
        for (let dx = -1; dx <= 1; dx++)
          for (let dy = -1; dy <= 1; dy++)
            for (const j of cells.get(key(cx + dx, cy + dy)) ?? []) {
              if (j === i) continue;
              const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y);
              if (d < LINK) cand.push({ j, d });
            }
        cand.sort((m, n) => m.d - n.d);
        for (const { j } of cand.slice(0, 4)) {
          const e = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(e)) {
            seen.add(e);
            edges.push([i, j]);
          }
        }
      });
    };

    let tx = -9999;
    let ty = -9999;
    let x = tx;
    let y = ty;
    let strength = 0; // hover reveal, 0 → 1
    let inside = false;
    let raf = 0;
    let wordIndex = 0;
    let travelled = 0;

    // 0 outside the reveal, 1 at the pointer, a smooth shoulder between.
    const lit = (px: number, py: number) => {
      const r = Math.hypot(px - x, py - y) / REACH;
      return r >= 1 ? 0 : (1 - r * r) * (1 - r * r) * strength;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const glow = pts.map((p) => lit(p.x, p.y));
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "#fff";
      for (const [i, j] of edges) {
        const g = Math.min(glow[i], glow[j]);
        ctx.globalAlpha = BASE_LINE + g * 0.6;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
      ctx.fillStyle = "#fff";
      pts.forEach((p, i) => {
        const g = glow[i];
        const hot = g > 0 && Math.hypot(p.x - x, p.y - y) < HOT;
        ctx.globalAlpha = BASE_DOT + g * 0.78;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.9 + g * (hot ? 1.6 : 0.8), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      x += (tx - x) * 0.3;
      y += (ty - y) * 0.3;
      strength += ((inside ? 1 : 0) - strength) * 0.14;
      draw();
      // The ring is the pointer, so it sits exactly on it; only the glow eases.
      ring.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      const settled = Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs((inside ? 1 : 0) - strength) < 0.005;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      if (!inside) {
        x = nx;
        y = ny;
      }
      travelled += Math.hypot(nx - tx, ny - ty);
      if (travelled > 260) {
        travelled = 0;
        wordIndex = (wordIndex + 1) % WORDS.length;
        word.textContent = WORDS[wordIndex];
      }
      tx = nx;
      ty = ny;
      inside = true;
      ring.dataset.on = "";
      if ((e.target as Element | null)?.closest("a, button")) ring.dataset.link = "";
      else delete ring.dataset.link;
      kick();
    };
    const onLeave = () => {
      inside = false;
      delete ring.dataset.on;
      kick();
    };
    const onResize = () => {
      size();
      draw();
    };

    size();
    draw();
    canvas.style.opacity = "1";
    window.addEventListener("resize", onResize);
    if (interactive) {
      host.classList.add("plexus-host");
      word.textContent = WORDS[0];
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      host.classList.remove("plexus-host");
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* Behind the type (-z-10, after the film in the DOM), so the web sits
          under the words; only the ring rides on top. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-0 transition-opacity duration-1000"
      />
      <div ref={ringRef} aria-hidden="true" className="plexus-ring pointer-events-none absolute left-0 top-0 z-20 mix-blend-difference">
        <span className="plexus-ring-circle" />
        <span className="plexus-ring-dot" />
        <span ref={wordRef} className="plexus-ring-word" />
      </div>
    </>
  );
}
