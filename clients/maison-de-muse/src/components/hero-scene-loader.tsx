"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Loads the three.js scene late, and only on a device that can show it.
 *
 * The scene is ~124kB over the wire and the largest chunk the site has. It
 * contributes nothing to the largest paint — that is the copy above it — so
 * it is kept strictly out of the way: nothing is requested until the window
 * `load` event has fired AND the browser reports an idle period AND the
 * plate is actually on screen. On a cold mobile connection that puts the
 * download after everything that matters, rather than in contention with
 * hydration.
 *
 * Until then, and on any device without WebGL, the designed plate behind it
 * simply stays. There is no broken state and no layout shift: the plate
 * holds its own aspect ratio and the canvas fades in over it.
 */
const HeroScene = dynamic(() => import("./hero-scene").then((m) => m.HeroScene), {
  ssr: false,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroSceneLoader() {
  const [mount, setMount] = useState(false);
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supportsWebGL()) return;

    let idle: number | undefined;
    let io: IntersectionObserver | undefined;
    let cancelled = false;

    const requestIdle = () => {
      if (cancelled) return;
      const hasIdle = typeof window.requestIdleCallback === "function";
      idle = hasIdle
        ? window.requestIdleCallback(() => setMount(true), { timeout: 2000 })
        : window.setTimeout(() => setMount(true), 200);
    };

    // Only once the plate is on screen — a visitor restored part-way down
    // the page never pays for a scene they cannot see.
    const whenVisible = () => {
      if (cancelled) return;
      if (typeof IntersectionObserver === "undefined") {
        requestIdle();
        return;
      }
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          requestIdle();
        },
        { rootMargin: "200px" }
      );
      io.observe(host);
    };

    // …and only after the page has finished loading.
    if (document.readyState === "complete") {
      whenVisible();
    } else {
      window.addEventListener("load", whenVisible, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", whenVisible);
      io?.disconnect();
      if (idle === undefined) return;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={hostRef}
      className={cn(
        "absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
        ready ? "opacity-100" : "opacity-0"
      )}
    >
      {mount ? <HeroScene onReady={onReady} /> : null}
    </div>
  );
}
