"use client";

import { useEffect, useRef, useState } from "react";
import type { SlMarkHandle } from "@/lib/sl-mark";
import { hasFastWebGL } from "@/lib/webgl";

/**
 * The hero: the S&L mark in 3D, full screen (Brad, 9 Oct 2026: "instead of the current hero,
 * can we get the 3D logo model for the hero ... make it fit for mobile too"). The same model
 * as /about and the desktop footer (lib/sl-mark.js): it turns slowly on its own, follows a
 * drag, and a tap takes it apart. No stars; a faint reflection on wide screens only.
 *
 * The poster (the mark rendered at POSTER_ROTATION) is in the first HTML and is the page's
 * largest paint. three.js loads at the first idle moment after the page has loaded, and only
 * where it will run well: hardware WebGL (lib/webgl.ts), no reduced motion, no Save-Data or
 * 2G. Everyone else keeps the poster, which is the same picture standing still.
 *
 * Fitted for phones: the mark is about 58% of the screen's height on a computer and about 74%
 * of the width on a phone. Below an aspect of 0.554 the camera fits it by width (`fitAspect`),
 * so it fills the same share of every phone's width; above that, by height. The poster's CSS
 * (`.hmark-poster`, min(72cqh, 130cqw)) is the same rule, so the hand-over from poster to
 * model does not jump. On touch screens a vertical swipe over it scrolls the page.
 *
 * It leaves with the page (it used to stay pinned while the statement slid over it, which read
 * as the logo falling down the screen; Brad, 9 Oct 2026). Three directions, after the
 * vividsites heroes Brad sent, chosen on the preview with ?v=hero:a|b|c (`data-x-hero` on
 * <html>; production has no switch and shows A):
 *   A  Gallery light: an overhead spot on black (`.hero-spot`) and a gold glint that travels
 *      across the mark every six seconds; scrolling away, it turns a quarter and steps back.
 *   B  Assembly: on a faint drifting haze; scrolling away takes it apart, piece by piece, and
 *      scrolling back sets it together again.
 *   C  Statement: "Gold worth wearing." set huge behind it (`.hero-word`); scrolling away,
 *      the mark turns and the words rise faster than it does.
 * It pauses off screen and in a hidden tab, and has a pause button: anything that moves on
 * its own for more than five seconds needs one (WCAG 2.2.2).
 */
type Direction = "a" | "b" | "c";
const direction = (): Direction => {
  const v = document.documentElement.getAttribute("data-x-hero");
  return v === "b" || v === "c" ? v : "a";
};
const LOOK: Record<Direction, Record<string, unknown>> = {
  a: { sweep: 2.2, sweepEvery: 6, sweepTime: 2.2, scrollYaw: 0.9, scrollScale: 0.12, fog: 0 },
  b: { scrollBurst: 1, scrollYaw: 0.35, fog: 0.16, burstRadius: 0.34, burstRadiusPortrait: 0.24 },
  c: { sweep: 1.2, sweepEvery: 8, sweepTime: 2.4, scrollYaw: 1.6, scrollScale: 0, fog: 0 },
};
export default function HeroMark() {
  const stage = useRef<HTMLDivElement>(null);
  const inst = useRef<SlMarkHandle | null>(null);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  // runs the model unless the visitor has paused it
  const sync = useRef(() => {
    const i = inst.current;
    if (!i) return;
    if (pausedRef.current) i.stop();
    else i.start();
  });

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;
    const mobile = matchMedia("(max-width: 767px)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const wide = innerWidth / innerHeight >= 0.9;
    const section = el.closest("section");
    let cancelled = false;
    let idle = 0;
    let timer = 0;
    let raf = 0;

    // how far the hero has scrolled away, 0 to 1: the model's scroll reaction, and --hx for the
    // CSS layers (the spot dimming, the words rising)
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!section) return;
        const r = section.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
        section.style.setProperty("--hx", p.toFixed(4));
        inst.current?.setScrollProgress(p);
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const load = async () => {
      if (cancelled || !hasFastWebGL()) return;
      try {
        const mod = await import("@/lib/sl-mark");
        if (cancelled) return;
        const dir = direction();
        inst.current = mod.mount(el, {
          initialRotation: mod.POSTER_ROTATION,
          idleSpin: true,
          idleYaw: Infinity,
          idleSpeed: mobile ? 0.3 : 0.22,
          maxPixelRatio: 2,
          mobilePixelRatio: 2,
          curveSegments: mobile ? 8 : 20,
          bevelSegments: mobile ? 2 : 5,
          idleFps: mobile ? 30 : 0,
          touchAction: coarse ? "pan-y" : "none",
          sideDarken: 0.55,
          sideRough: 0.1,
          stars: 0,
          reflection: wide ? 0.22 : 0,
          reflectionFade: 0.35,
          horizon: 0,
          fog: 0,
          // keep in step with .hmark-poster in globals.css
          cameraZ: 3.25,
          fitAspect: 0.554,
          offsetY: -0.02,
          offsetYPortrait: 0,
          // a tap still takes it apart; nothing comes apart on its own
          burst: true,
          burstAuto: 0,
          burstInterval: 0,
          // pieces stay clear of the header above and the corner type below
          burstRadius: 0.2,
          burstRadiusPortrait: 0.15,
          ...LOOK[dir],
          onFirstFrame: () => {
            el.classList.add("is-live");
            setLive(true);
          },
        });
        onScroll();
        sync.current();
      } catch {
        /* the poster stays */
      }
    };
    // after the page has loaded and gone quiet, so the model never competes with the first paint
    const whenIdle = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(load, { timeout: 2500 });
      else timer = window.setTimeout(load, 400);
    };
    if (document.readyState === "complete") whenIdle();
    else addEventListener("load", whenIdle, { once: true });

    return () => {
      cancelled = true;
      removeEventListener("load", whenIdle);
      const cic = (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (idle && cic) cic(idle);
      clearTimeout(timer);
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      inst.current?.destroy();
      inst.current = null;
    };
  }, []);

  const toggle = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    sync.current();
  };

  return (
    <>
      <div ref={stage} className="hmark-stage">
        <picture>
          <source type="image/avif" srcSet="/images/sl-mark-poster-480.avif 480w, /images/sl-mark-poster-720.avif 720w, /images/sl-mark-poster-1000.avif 1000w, /images/sl-mark-poster-1400.avif 1400w" sizes="(max-aspect-ratio: 554/1000) 130vw, 72vh" />
          <source type="image/webp" srcSet="/images/sl-mark-poster-480.webp 480w, /images/sl-mark-poster-720.webp 720w, /images/sl-mark-poster-1000.webp 1000w, /images/sl-mark-poster-1400.webp 1400w" sizes="(max-aspect-ratio: 554/1000) 130vw, 72vh" />
          <img className="hmark-poster" src="/images/sl-mark-poster-1000.webp" alt="" width={1000} height={1000} fetchPriority="high" decoding="async" />
        </picture>
      </div>
      {live && (
        <button type="button" className="hero-toggle" onClick={toggle} aria-label={paused ? "Turn the logo again" : "Stop the logo turning"}>
          {paused ? (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
              <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
              <rect x="6.5" y="5" width="4" height="14" rx="1" />
              <rect x="13.5" y="5" width="4" height="14" rx="1" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
