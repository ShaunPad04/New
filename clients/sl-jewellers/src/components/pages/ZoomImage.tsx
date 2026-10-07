"use client";

import { useRef, type PointerEvent } from "react";
import Image from "next/image";

/** A product photo that magnifies under the pointer (twice the size, following it), like a
 *  jeweller's loupe. Touch and reduced motion: the plain photo. */
export default function ZoomImage({ src, alt, sizes, priority = false }: { src: string; alt: string; sizes: string; priority?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--zy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    el.classList.add("is-zoom");
  };
  return (
    <div ref={box} className="pd-zoom" onPointerMove={move} onPointerLeave={() => box.current?.classList.remove("is-zoom")}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="pd-zoom-img" />
      <span className="pd-zoom-hint" aria-hidden="true">Hover to look closer</span>
    </div>
  );
}
