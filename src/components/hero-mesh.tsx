"use client";

import { useEffect, useRef } from "react";

/**
 * A faint geometric field over the hero footage — and it now follows you.
 *
 * The particle constellation that briefly replaced this was removed at the
 * client's request; this is the original mesh, kept, with the one thing it was
 * missing: it moves with the pointer.
 *
 * WHY IT IS CSS AND NOT AN IMAGE. Two repeating linear gradients crossed at
 * ±30° draw the whole field in about a dozen bytes, scale to any viewport
 * without a single request, and stay crisp on any density of screen. A
 * supplied PNG would be another asset on the most bandwidth-sensitive part of
 * the page, and this hero already carries a frame sequence.
 *
 * THE MASK IS THE DESIGN. Unmasked, a grid over a photograph reads as a
 * texture laid on top of it. Faded away from a soft centre-right, it reads as
 * something the frame is being seen THROUGH — and it thins out over the
 * bottom-left, which is exactly where the logotype and the two calls to action
 * sit. It never competes with the copy because it is not there.
 *
 * TWO ELEMENTS, ONE EFFECT, and the split is load-bearing. The drift is a
 * keyframe animation on `transform`; the pointer offset is also a transform.
 * One element cannot carry both — the animation would win and the pointer
 * would do nothing. So the outer element takes the pointer, the inner keeps
 * the drift, and they compose.
 *
 * The pointer is read on `pointermove` and written once per animation frame to
 * a custom property, so there is no React state and no re-render: this fires
 * continuously and a `setState` here would re-render the hero's subtree sixty
 * times a second to move a background. Hover-capable devices only — there is
 * nothing to follow on a phone — and it never starts under
 * `prefers-reduced-motion`, where the mesh sits still.
 */

/** How far the field slides across the full width of the viewport. */
const TRAVEL_PX = 26;

export function HeroMesh() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!media.matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      raf = 0;
      wrap.style.setProperty("--mesh-x", `${x.toFixed(2)}px`);
      wrap.style.setProperty("--mesh-y", `${y.toFixed(2)}px`);
    };

    const onMove = (e: PointerEvent) => {
      // -1 … 1 across the viewport, so the field leans toward the pointer
      // rather than tracking it exactly. Tracking reads as a sticker; leaning
      // reads as parallax.
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      x = -nx * TRAVEL_PX;
      y = -ny * TRAVEL_PX;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="hero-mesh-wrap pointer-events-none absolute inset-0 -z-10"
    >
      <div className="hero-mesh absolute inset-0" />
    </div>
  );
}
