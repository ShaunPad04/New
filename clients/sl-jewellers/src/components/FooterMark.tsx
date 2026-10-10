"use client";

import { useEffect, useRef } from "react";
import type { SlMarkHandle } from "@/lib/sl-mark";
import { hasFastWebGL } from "@/lib/webgl";

/**
 * The S&L mark in 3D, filling the footer's left-hand column on a computer (Shaun, 8 Oct 2026:
 * "instead of the static logo, add the 3D model so it fits in the left"). The same model as
 * the About page (AboutMark.tsx, lib/sl-mark.js): it turns slowly, follows a drag, and a click
 * takes it apart and sets it back. three.js loads only on a wide screen with a fine pointer,
 * only once the footer comes near, and only if the device draws WebGL in hardware; until its
 * first frame, and under reduced motion, the still poster of the same mark is the picture. Phones and
 * tablets keep the flat logo (Footer.tsx).
 */
export default function FooterMark() {
  const stage = useRef<HTMLDivElement>(null);
  const inst = useRef<SlMarkHandle | null>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    let cancelled = false;
    const load = async () => {
      if (!hasFastWebGL()) return;
      try {
        const mod = await import("@/lib/sl-mark");
        if (cancelled) return;
        inst.current = mod.mount(el, {
          initialRotation: mod.POSTER_ROTATION,
          idleSpin: true,
          idleYaw: Infinity,
          idleSpeed: 0.2,
          idleFps: 30,
          maxPixelRatio: 2,
          curveSegments: 14,
          bevelSegments: 4,
          touchAction: "none",
          sideDarken: 0.55,
          sideRough: 0.1,
          stars: 0,
          reflection: 0,
          horizon: 0,
          fog: 0,
          cameraZ: 2.9,
          offsetY: 0,
          burst: true,
          burstAuto: 0,
          burstInterval: 0,
          burstRadius: 0.32,
          onFirstFrame: () => el.classList.add("is-live"),
        });
        inst.current.start();
      } catch {
        /* the poster stays */
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      inst.current?.destroy();
      inst.current = null;
    };
  }, []);

  return (
    <div ref={stage} className="fmark" aria-hidden="true">
      <picture>
        <source type="image/avif" srcSet="/images/sl-mark-poster-480.avif 480w, /images/sl-mark-poster-720.avif 720w" sizes="300px" />
        <source type="image/webp" srcSet="/images/sl-mark-poster-480.webp 480w, /images/sl-mark-poster-720.webp 720w" sizes="300px" />
        <img className="fmark-poster" src="/images/sl-mark-poster-480.webp" alt="" width={480} height={480} loading="lazy" decoding="async" />
      </picture>
    </div>
  );
}
