"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * TILT — a surface that turns in 3D to follow the pointer, with a specular
 * glare that tracks it like light across glass.
 *
 * Pointer position is written as CSS variables (`--rx`, `--ry`, `--gx`,
 * `--gy`); CSS does the perspective transform. No state, no re-render, one
 * rAF-coalesced style write per pointer move.
 *
 * FINE POINTERS ONLY. On touch there is no hover and a finger would be
 * covering the very surface being tilted, so the handler bails and the card
 * stays flat. Reduced motion is honoured in CSS, which forces the transform
 * to none whatever the variables say.
 */
export function Tilt({
  children,
  className,
  max = 8,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the card's edge. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const px = (clientX - r.left) / r.width; // 0..1
      const py = (clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      el.dataset.tilting = "true";
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    delete el.dataset.tilting;
  };

  return (
    <div ref={ref} className={cn("kit-tilt", className)} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="kit-tilt-surface">
        {children}
        <span className="kit-tilt-glare" aria-hidden="true" />
      </div>
    </div>
  );
}
