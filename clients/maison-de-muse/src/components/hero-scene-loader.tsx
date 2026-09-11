"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Loads the three.js scene after first paint, only on capable devices.
 *
 * The scene is ~150 kB of JavaScript that contributes nothing to the LCP
 * (the headline), so it is never in the critical path: the plate renders
 * immediately as designed CSS, and the drink fades in over it once WebGL
 * has produced its first frame. If WebGL is unavailable the plate simply
 * stays — there is no broken state to show.
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

  useEffect(() => {
    if (!supportsWebGL()) return;
    // Yield to the first paint and hydration before pulling in the scene.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idle = hasIdle
      ? window.requestIdleCallback(() => setMount(true), { timeout: 1200 })
      : window.setTimeout(() => setMount(true), 300);
    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
        ready ? "opacity-100" : "opacity-0"
      )}
    >
      {mount ? <HeroScene onReady={onReady} /> : null}
    </div>
  );
}
