"use client";

import { useEffect } from "react";

/**
 * The black glass buttons light up where the cursor is: writes --mx / --my, the cursor's spot
 * on the button under it, which the rim and surface gradients in globals.css follow (Shaun's
 * pick of button style, "black glass with oyster steel", 7 Oct 2026). Fine pointers only; the
 * buttons look right without it.
 */
const SEL = ".enq-b, .cm-toggle, .enq-pill, .plan-cta, .btn-metal, .btn-ghost, .bkt-add.is-in";

export default function ButtonFX() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const frame = () => {
      raf = 0;
      const el = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>(SEL);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${x - r.left}px`);
      el.style.setProperty("--my", `${y - r.top}px`);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
