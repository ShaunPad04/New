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
 * The poster is in the first HTML and is the page's largest paint. It is the model's own first
 * frame, rendered by the same engine with these options (scripts/hero-poster.mjs), so when the
 * model takes over nothing visibly changes: the mark just starts to turn and the haze rises
 * (`fogIn`). The old poster was a render from the previous site with other lights, and the swap
 * read as a slow load (Brad, 9 Oct 2026: "why does it take so long for it to load?").
 *
 * three.js starts as soon as this component has mounted, not after the page's load event: that
 * waited for every image on the page (the menu's photos among them) and cost a second or more.
 * Only where it will run well: hardware WebGL (lib/webgl.ts), no reduced motion, no Save-Data or
 * 2G. Everyone else, PageSpeed and Lighthouse included, keeps the poster and never downloads it.
 *
 * Fitted for phones: the mark is about 58% of the screen's height on a computer and about 74%
 * of the width on a phone. Below an aspect of 0.554 the camera fits it by width (`fitAspect`),
 * so it fills the same share of every phone's width; above that, by height. The poster's CSS
 * (`.hmark-poster`, min(72cqh, 130cqw)) is the same rule, so the hand-over from poster to
 * model does not jump. On touch screens a vertical swipe over it scrolls the page.
 *
 * "Assembly" (Brad's pick of three, 9 Oct 2026, after the vividsites heroes he sent: Vitrum's
 * glass orchid that builds itself): on a faint drifting haze, the mark leaves with the page and
 * comes apart piece by piece as it goes, then sets itself together again on the way back up
 * (`scrollBurst`). It used to stay pinned while the statement slid over it, which read as the
 * logo falling down the screen. The other two directions, A "Gallery light" (a spot and a
 * travelling glint, the engine's `sweep`) and C "Statement" (words behind the mark), are in git
 * history at 4e70861.
 *
 * It pauses off screen and in a hidden tab, and has a pause button: anything that moves on its
 * own for more than five seconds needs one (WCAG 2.2.2).
 */
// the poster set (scripts/hero-poster.mjs): the model's first frame at these widths
const POSTER = "/images/hero-mark.2026-10-09";
const WIDE = [480, 720, 960, 1320, 1800];
const TALL = [480, 720, 1000, 1400];
const set = (cut: string, widths: number[], ext: string) => widths.map((w) => `${POSTER}-${cut}-${w}.${ext} ${w}w`).join(", ");

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
    let raf = 0;

    // how far the hero has scrolled away, 0 to 1: what takes the mark apart
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!section) return;
        const r = section.getBoundingClientRect();
        inst.current?.setScrollProgress(Math.min(1, Math.max(0, -r.top / Math.max(1, r.height))));
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const load = async () => {
      if (!hasFastWebGL()) return;
      try {
        const mod = await import("@/lib/sl-mark");
        // one frame, so the build does not land in the same task as the page's own start-up
        await new Promise((r) => requestAnimationFrame(r));
        if (cancelled) return;
        inst.current = mod.mount(el, {
          initialRotation: mod.POSTER_ROTATION,
          idleSpin: true,
          idleYaw: Infinity,
          idleSpeed: mobile ? 0.3 : 0.22,
          maxPixelRatio: 2,
          mobilePixelRatio: 2,
          // 12 and 3 on a computer look the same as 20 and 5 at this size (compared pixel by pixel)
          // and take 40% less time to build
          curveSegments: mobile ? 8 : 12,
          bevelSegments: mobile ? 2 : 3,
          idleFps: mobile ? 30 : 0,
          touchAction: coarse ? "pan-y" : "none",
          sideDarken: 0.55,
          sideRough: 0.1,
          stars: 0,
          reflection: wide ? 0.22 : 0,
          reflectionFade: 0.35,
          horizon: 0,
          // a faint haze drifting along the floor, rising once the model is up (the poster has none)
          fog: 0.16,
          fogIn: 1.8,
          // keep in step with .hmark-poster in globals.css
          cameraZ: 3.25,
          fitAspect: 0.554,
          offsetY: -0.02,
          offsetYPortrait: 0,
          // a tap still takes it apart; nothing comes apart on its own
          burst: true,
          burstAuto: 0,
          burstInterval: 0,
          burstRadius: 0.34,
          burstRadiusPortrait: 0.24,
          // scrolling away takes it apart (all the way by about 70% of the hero), with a slight turn
          scrollBurst: 1,
          scrollYaw: 0.35,
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
    // now: the poster is in the HTML at high priority, so it is well on its way before this starts
    load();

    return () => {
      cancelled = true;
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
        {/* wide frames (9:10 and wider) have the reflection, so a taller cut; see .hmark-poster */}
        <picture>
          <source media="(min-aspect-ratio: 9/10)" type="image/avif" srcSet={set("wide", WIDE, "avif")} sizes="72vh" width={1200} height={1400} />
          <source media="(min-aspect-ratio: 9/10)" type="image/webp" srcSet={set("wide", WIDE, "webp")} sizes="72vh" width={1200} height={1400} />
          <source type="image/avif" srcSet={set("tall", TALL, "avif")} sizes="(max-aspect-ratio: 554/1000) 130vw, 72vh" />
          <source type="image/webp" srcSet={set("tall", TALL, "webp")} sizes="(max-aspect-ratio: 554/1000) 130vw, 72vh" />
          <img className="hmark-poster" src={`${POSTER}-tall-1000.webp`} alt="" width={1000} height={1000} fetchPriority="high" decoding="async" />
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
