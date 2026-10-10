"use client";

import { useEffect, useRef, useState } from "react";
import type { SlMarkHandle } from "@/lib/sl-mark";
import { hasFastWebGL } from "@/lib/webgl";

/**
 * The S&L mark in 3D on /about (Shaun, 6 Oct 2026: "that specific 3D logo ... somewhere
 * premium", without the old hero's background). The same model as the first hero
 * (lib/sl-mark.js): it turns slowly on its own, follows a drag, and a tap takes it apart
 * into the paths it is drawn from and sets it back. No stars, a faint reflection on
 * wide screens. three.js loads only when the stage comes near the screen and only if the
 * device draws WebGL in hardware (lib/webgl.ts); until its first frame, and under reduced
 * motion, the still poster of the same mark is the picture.
 */
export default function AboutMark() {
  const stage = useRef<HTMLDivElement>(null);
  const inst = useRef<SlMarkHandle | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mobile = matchMedia("(max-width: 767px)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
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
          idleSpeed: mobile ? 0.3 : 0.22,
          // sharp on retina: the device's own ratio up to 2 on phones too (the engine's
          // default drops phones to 1.5)
          maxPixelRatio: 2,
          mobilePixelRatio: 2,
          curveSegments: mobile ? 8 : 20,
          bevelSegments: mobile ? 2 : 5,
          idleFps: mobile ? 30 : 0,
          touchAction: coarse ? "pan-y" : "none",
          sideDarken: 0.55,
          sideRough: 0.1,
          stars: 0,
          reflection: mobile ? 0 : 0.22,
          reflectionFade: 0.35,
          horizon: 0,
          fog: 0,
          cameraZ: 3.6,
          cameraZPortrait: 4.5,
          offsetY: 0.04,
          burst: true,
          burstAuto: 1500,
          burstInterval: 0,
          burstRadius: 0.45,
          burstRadiusPortrait: 0.28,
          onFirstFrame: () => el.classList.add("is-live"),
          onInteract: () => setTouched(true),
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
      { rootMargin: "200px" },
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
    <div ref={stage} className="amark-stage">
      <picture>
        <source type="image/avif" srcSet="/images/sl-mark-poster-480.avif 480w, /images/sl-mark-poster-720.avif 720w, /images/sl-mark-poster-1000.avif 1000w" sizes="(max-width: 767px) 70vw, 520px" />
        <source type="image/webp" srcSet="/images/sl-mark-poster-480.webp 480w, /images/sl-mark-poster-720.webp 720w, /images/sl-mark-poster-1000.webp 1000w" sizes="(max-width: 767px) 70vw, 520px" />
        <img className="amark-poster" src="/images/sl-mark-poster-720.webp" alt="" width={720} height={720} decoding="async" />
      </picture>
      <p className={`amark-hint${touched ? " is-gone" : ""}`} aria-hidden="true">
        Drag to turn it · Tap to take it apart
      </p>
    </div>
  );
}
