"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

/**
 * A card whose gold reacts to the cursor. Pointer position is written to
 * --rx/--ry (a small tilt toward it); --mx/--my are kept for any later
 * pointer-positioned effect. Everything visual lives in globals.css
 * under `.glint`; this only tracks the pointer, rAF-throttled, on fine
 * pointers. Touch and reduced motion get the plain card.
 */
export default function Glint({ href, className = "", children }: { href: string; className?: string; children: ReactNode }) {
  const el = useRef<HTMLAnchorElement>(null);
  const raf = useRef(0);
  const last = useRef<{ x: number; y: number } | null>(null);

  const apply = () => {
    raf.current = 0;
    const a = el.current;
    const p = last.current;
    if (!a || !p) return;
    const r = a.getBoundingClientRect();
    const px = (p.x - r.left) / r.width;
    const py = (p.y - r.top) / r.height;
    a.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    a.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    a.style.setProperty("--ry", `${((px - 0.5) * 7).toFixed(2)}deg`);
    a.style.setProperty("--rx", `${((0.5 - py) * 7).toFixed(2)}deg`);
  };

  return (
    <Link
      ref={el}
      href={href}
      className={`glint ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        last.current = { x: e.clientX, y: e.clientY };
        if (!raf.current) raf.current = requestAnimationFrame(apply);
      }}
      onPointerLeave={() => {
        const a = el.current;
        if (!a) return;
        a.style.setProperty("--rx", "0deg");
        a.style.setProperty("--ry", "0deg");
      }}
    >
      {children}
    </Link>
  );
}
