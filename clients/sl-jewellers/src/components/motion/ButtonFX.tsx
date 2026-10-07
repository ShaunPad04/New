"use client";

import { useEffect } from "react";

/**
 * Pointer effects for the button styles on the walk-through's switch (?v=btn:b|c, round two,
 * 7 Oct 2026). B black glass: writes --mx / --my, the cursor's spot on the button, so its rim
 * and surface light up there. C magnetic: when the cursor comes within reach, writes --tx / --ty
 * so the button drifts toward it, then lets it spring back. Fine pointers only; C stands still
 * under reduced motion. Nothing happens under style A.
 */
const SEL = ".enq-b, .cm-toggle, .enq-pill, .plan-cta, .bkt-add, .ef-send, .btn-metal, .btn-ghost";
const REACH = 36; // px around a button where the pull starts
const PULL = 0.28; // share of the distance it travels
const MAX = 9; // px

export default function ButtonFX() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    let held: HTMLElement[] = [];
    let raf = 0;
    let x = 0;
    let y = 0;
    const release = (el: HTMLElement) => {
      el.style.setProperty("--tx", "0px");
      el.style.setProperty("--ty", "0px");
      delete el.dataset.magnetOn;
    };
    const frame = () => {
      raf = 0;
      const mode = root.getAttribute("data-x-btn");
      if (mode === "b") {
        const el = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>(SEL);
        if (el) {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${x - r.left}px`);
          el.style.setProperty("--my", `${y - r.top}px`);
        }
      } else if (mode === "c" && !reduced) {
        const near: HTMLElement[] = [];
        document.querySelectorAll<HTMLElement>(SEL).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (!r.width || x < r.left - REACH || x > r.right + REACH || y < r.top - REACH || y > r.bottom + REACH) return;
          const dx = Math.max(-MAX, Math.min(MAX, (x - (r.left + r.width / 2)) * PULL));
          const dy = Math.max(-MAX, Math.min(MAX, (y - (r.top + r.height / 2)) * PULL));
          el.style.setProperty("--tx", `${dx.toFixed(2)}px`);
          el.style.setProperty("--ty", `${dy.toFixed(2)}px`);
          el.dataset.magnetOn = "";
          near.push(el);
        });
        held.forEach((el) => !near.includes(el) && release(el));
        held = near;
      }
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const leave = () => {
      held.forEach(release);
      held = [];
    };
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      leave();
    };
  }, []);
  return null;
}
