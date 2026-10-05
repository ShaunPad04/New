"use client";

import { useEffect, useRef } from "react";
import type { SlMarkHandle } from "@/lib/sl-mark";

/**
 * The S&L mark in 3D, scrubbed by scroll through the pinned hero:
 *   open      stars and the still mark
 *   0 → 1     two full turns under the wheel; comes apart at ~0.18, holds,
 *             seats itself again by ~0.68, then keeps turning
 *   settle    the copy lands, the stage un-pins and scrolls off
 * Drag still spins it, a tap still takes it apart. three.js (~150 KB gz) is
 * loaded on the first interaction (scroll counts), or on phones at the first
 * idle moment after load, so the poster is the LCP either way.
 * Progress is also written to --p on the section so the caption bands are
 * pure CSS.
 */
export default function HeroMark() {
  const stageRef = useRef<HTMLDivElement>(null);
  const instRef = useRef<SlMarkHandle | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const section = stage.closest("section") as HTMLElement | null;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones run the same scroll journey, tuned: lighter geometry, the scrub applied 1:1 to
    // the scroll position (no easing trail, no frame cap while the thumb is moving) and
    // vertical swipes handed to the page, so the full-screen stage never catches a scroll.
    const mobile = matchMedia("(max-width: 767px)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const still = reduce;

    let lastP = -1;
    let lastPhase = "";
    const writeProgress = () => {
      if (!section) return;
      const r = section.getBoundingClientRect();
      const range = Math.max(1, r.height - innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / range));
      if (Math.abs(p - lastP) >= 0.002) {
        lastP = p;
        section.style.setProperty("--p", p.toFixed(3));
        instRef.current?.setScrub(p);
      }
      const phase = p >= 0.7 ? "settle" : p >= 0.16 ? "journey" : "open";
      if (phase !== lastPhase) {
        lastPhase = phase;
        section.dataset.phase = phase;
        section.classList.toggle("in", phase === "settle");
      }
    };

    if (still && section) {
      section.dataset.phase = "settle";
      section.classList.add("in");
      section.style.setProperty("--p", "1");
    }
    if (reduce) return;

    // Straight from the scroll event, not deferred to the next frame: scroll events are
    // already delivered once per frame, before that frame's animation callbacks run, so
    // the renderer draws this frame's position, not the last one's.
    const onScroll = () => writeProgress();
    if (!still) {
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
      writeProgress();
    }

    let cancelled = false;
    let loaded = false;
    const hasWebGL = () => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    };
    const portrait = () => innerHeight > innerWidth || innerWidth < 720;
    // Short phones (an iPhone SE is 667px tall) have no room for the seated mark above the
    // settle copy, so the mark lifts and shrinks more as the copy lands: 0 at 780px and
    // taller, full squeeze by 660px.
    const squeeze = Math.min(1, Math.max(0, (780 - innerHeight) / 120));

    async function load() {
      if (loaded || cancelled) return;
      loaded = true;
      if (!hasWebGL()) return;
      try {
        const mod = await import("@/lib/sl-mark");
        if (cancelled || !stage) return;
        const inst = mod.mount(stage, {
          ignore: ".hero-band a, .hero-band button",
          initialRotation: mod.POSTER_ROTATION,
          idleSpin: true,
          // Phones: a slow, continuous turn (one revolution every ~18 s). Desktop sways ±0.55 rad.
          idleYaw: mobile ? Infinity : 0.55,
          idleSpeed: mobile ? 0.35 : 0.28,
          maxPixelRatio: 1.75,
          // Phones: coarser extrusion (invisible at 280px wide), fewer stars, and 30 fps while the
          // mark is only idling (any scroll, drag or burst lifts the cap). Together they cut the
          // load-time geometry build and the per-frame cost by well over half.
          curveSegments: mobile ? 8 : 20,
          bevelSegments: mobile ? 2 : 5,
          idleFps: mobile ? 30 : 0,
          // Touch: a vertical swipe on the stage scrolls the page; sideways still spins the mark.
          touchAction: coarse ? "pan-y" : "none",
          sideDarken: 0.55,
          sideRough: 0.1,
          stars: mobile ? 160 : 420,
          starOpacity: 0.8,
          reflection: portrait() ? 0 : 0.26,
          horizon: 0,
          reflectionFade: 0.3,
          fog: 0,
          offsetY: 0.05,
          cameraZ: 3.35,
          cameraZPortrait: 6.8,
          offsetYPortrait: 0.24,
          scrollYaw: 0,
          scrollScale: 0,
          offsetX: 0,
          burst: true,
          burstAuto: 0,
          burstInterval: 0,
          burstOut: 0.9,
          burstHold: 0.5,
          burstIn: 1.1,
          burstRadius: 0.5,
          burstRadiusPortrait: 0.3,
          burstSpin: 2.1,
          scrub: !still,
          // Desktop scrolls through Lenis, already smoothed, and a short trail reads as weight.
          // Phones scroll natively, so the turn tracks the thumb exactly: any trail there is lag.
          scrubEase: mobile ? 0 : 7.5,
          scrubTurns: 2,
          scrubShiftX: 0.16,
          scrubShiftYPortrait: 0.08 + 0.03 * squeeze,
          scrubShrinkPortrait: 0.16 + 0.34 * squeeze,
          onFirstFrame: () => stage.classList.add("is-live"),
        });
        instRef.current = inst;
        if (!still) inst.setScrub(Math.max(0, lastP));
        inst.start();
      } catch {
        /* the poster is the whole picture */
      }
    }

    const kick = () => {
      load();
      remove();
    };
    const events: (keyof WindowEventMap)[] = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"];
    const remove = () => events.forEach((e) => removeEventListener(e, kick));
    events.forEach((e) => addEventListener(e, kick, { passive: true, once: true }));
    // Phones: the mark should be turning before anyone touches the page, so it loads shortly
    // after the window has loaded (the poster is already painted by then).
    // It waits for an idle moment (or 2.5 s) so it never competes with the first paint.
    let autoTimer = 0;
    let idleId = 0;
    // Typed loosely: Safari only gained requestIdleCallback recently, so it is optional here.
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const autoStart = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(kick, { timeout: 2500 });
      else autoTimer = window.setTimeout(kick, 1200);
    };
    if (mobile) {
      if (document.readyState === "complete") autoStart();
      else addEventListener("load", autoStart, { once: true });
    }

    return () => {
      cancelled = true;
      remove();
      clearTimeout(autoTimer);
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      removeEventListener("load", autoStart);
      if (!still) {
        removeEventListener("scroll", onScroll);
        removeEventListener("resize", onScroll);
      }
      instRef.current?.destroy();
      instRef.current = null;
    };
  }, []);

  return (
    <>
      <link
        rel="preload"
        as="image"
        imageSrcSet="/images/sl-mark-poster-480.avif 480w, /images/sl-mark-poster-720.avif 720w, /images/sl-mark-poster-1000.avif 1000w"
        imageSizes="(max-width: 720px) 78vw, 640px"
        fetchPriority="high"
      />
      <div ref={stageRef} className="hero-stage" aria-hidden="true">
        <picture>
          <source
            type="image/avif"
            srcSet="/images/sl-mark-poster-480.avif 480w, /images/sl-mark-poster-720.avif 720w, /images/sl-mark-poster-1000.avif 1000w, /images/sl-mark-poster-1400.avif 1400w"
            sizes="(max-width: 720px) 78vw, 640px"
          />
          <source
            type="image/webp"
            srcSet="/images/sl-mark-poster-480.webp 480w, /images/sl-mark-poster-720.webp 720w, /images/sl-mark-poster-1000.webp 1000w, /images/sl-mark-poster-1400.webp 1400w"
            sizes="(max-width: 720px) 78vw, 640px"
          />
          <img className="hero-poster" src="/images/sl-mark-poster-1000.webp" alt="" width={1000} height={1000} fetchPriority="high" decoding="async" />
        </picture>
      </div>
    </>
  );
}
