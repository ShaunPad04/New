"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The menu's hover photo (Shaun, 6 Oct 2026: bigger, and beside the word, "on the right",
 * never underneath it). While the pointer is on a link marked data-menu-img="<i>", that
 * item's photo sits just right of the word, tilted a little, and glides to the next word as
 * the pointer moves down the list: it eases toward its target, leans with the speed of the
 * move and settles at a slight angle, and each new photo wipes up over the last. Mouse and
 * trackpad only (no hover on touch), and off under reduced motion. Decorative.
 */
export default function MenuHoverImage({ images }: { images: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setEnabled(fine.matches && !calm.matches);
    set();
    fine.addEventListener("change", set);
    calm.addEventListener("change", set);
    return () => {
      fine.removeEventListener("change", set);
      calm.removeEventListener("change", set);
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    const panel = el?.closest<HTMLElement>("[data-menu-panel]");
    if (!el || !panel || !enabled) return;
    let x = 0, y = 0, r = -3, tx = 0, ty = 0, raf = 0, placed = false, lastY = 0;
    const tick = () => {
      const vy = ty - y;
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      // lean into the move, then settle back to a slight tilt
      r += (Math.max(-9, Math.min(9, -3 + vy * 0.06)) - r) * 0.12;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${r.toFixed(2)}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(r + 3 - vy * 0.06) > 0.25 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const a = (e.target as Element).closest?.<HTMLElement>("[data-menu-img]");
      if (!a) {
        setOn(null);
        return;
      }
      const p = panel.getBoundingClientRect();
      const w = a.getBoundingClientRect();
      // beside the word on the right, its middle following the pointer a little
      tx = w.right - p.left + 28;
      ty = w.top + w.height / 2 - p.top + panel.scrollTop - el.offsetHeight / 2 + (e.clientY - (w.top + w.height / 2)) * 0.35;
      if (!placed || lastY === 0) { x = tx; y = ty + 24; placed = true; }
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
      setOn(Number(a.dataset.menuImg));
    };
    const onLeave = () => { setOn(null); lastY = 0; };
    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return <div ref={box} hidden />;
  return (
    <div ref={box} className={`mc-float${on !== null ? " is-on" : ""}`} aria-hidden="true">
      {images.map((src, i) => (
        <Image key={src + i} src={src} alt="" fill sizes="260px" className={`mc-float-img${on === i ? " is-on" : ""}`} />
      ))}
    </div>
  );
}
