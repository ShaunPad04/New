"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The menu's hover photo: while the pointer is over a link marked data-menu-img="<i>", that
 * item's photo floats beside the pointer and follows it with a little lag, cross-fading as
 * the pointer moves from word to word. Mouse and trackpad only (no hover on touch), and off
 * under reduced motion. Decorative: the links carry the words.
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
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, placed = false;
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = panel.getBoundingClientRect();
      tx = e.clientX - r.left + 28;
      ty = e.clientY - r.top + panel.scrollTop - el.offsetHeight / 2;
      if (!placed) { x = tx; y = ty; placed = true; }
      if (!raf) raf = requestAnimationFrame(tick);
      const a = (e.target as Element).closest?.<HTMLElement>("[data-menu-img]");
      setOn(a ? Number(a.dataset.menuImg) : null);
    };
    const onLeave = () => setOn(null);
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
        <Image key={src} src={src} alt="" fill sizes="280px" className={`mc-float-img${on === i ? " is-on" : ""}`} />
      ))}
    </div>
  );
}
