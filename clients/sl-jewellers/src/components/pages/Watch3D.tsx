"use client";

import { useEffect, useRef, useState } from "react";
import type { WatchViewer } from "@/lib/watch-viewer";

/**
 * The watch in 3D on the product stage (Shaun, 7 Oct 2026: "make the watches into a 3D model
 * in 4K that they can spin, only on the product page"). Sits over the photo, which stays the
 * page's first paint and the fallback: the model loads once the stage is on screen and the
 * browser is idle, then fades in over the photo. Data savers and slow connections get a tap to
 * load instead. Photo / 360° switches between the two; drag, flick or the arrow keys turn it.
 * three.js arrives with the model, never on a page without one (lib/watch-viewer.ts).
 */
type State = "idle" | "waiting" | "loading" | "ready" | "error";

const webgl = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export default function Watch3D({ src, label }: { src: string; label: string }) {
  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const viewer = useRef<WatchViewer | null>(null);
  const [state, setState] = useState<State>("idle");
  const [mode, setMode] = useState<"3d" | "photo">("3d");
  const [pct, setPct] = useState(0);
  const [touched, setTouched] = useState(false);
  const go = useRef<() => void>(() => {});

  useEffect(() => {
    if (!webgl()) return setState("error");
    let dead = false;
    const start = async () => {
      if (viewer.current || !view.current) return;
      setState("loading");
      try {
        const { mountWatch } = await import("@/lib/watch-viewer");
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const v = await mountWatch(view.current, src, { onProgress: setPct, reduced });
        if (dead) return v.destroy();
        viewer.current = v;
        view.current.querySelector("canvas")?.setAttribute("aria-label", `${label} in 3D. Drag, or use the arrow keys, to turn it.`);
        setState("ready");
      } catch {
        if (!dead) setState("error");
      }
    };
    go.current = start;

    // data savers and slow connections load it on a tap; everyone else once the stage is on
    // screen and the page has finished its own work
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const frugal = !!conn?.saveData || /2g/.test(conn?.effectiveType || "");
    let idle = 0;
    let io: IntersectionObserver | null = null;
    if (frugal) setState("waiting");
    else {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io?.disconnect();
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        idle = ric ? ric(start, { timeout: 2500 }) : window.setTimeout(start, 900);
      });
      if (root.current) io.observe(root.current);
    }
    return () => {
      dead = true;
      io?.disconnect();
      const cic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
      if (cic) cic(idle);
      clearTimeout(idle);
      viewer.current?.destroy();
      viewer.current = null;
    };
  }, [src, label]);

  // the stage hides its photo while the model is showing
  const show3d = state === "ready" && mode === "3d";
  useEffect(() => {
    const stage = root.current?.closest<HTMLElement>(".pdb-stage");
    if (!stage) return;
    stage.dataset.view = show3d ? "3d" : "photo";
    return () => { delete stage.dataset.view; };
  }, [show3d]);
  // and the model stops drawing while the photo is showing
  useEffect(() => { viewer.current?.setActive(show3d); }, [show3d]);

  if (state === "error") return null;

  const pick3d = () => {
    setMode("3d");
    if (state === "waiting" || state === "idle") go.current();
    else viewer.current?.reset();
  };

  return (
    <div ref={root} className="w3d" data-state={state} data-mode={mode}>
      <div ref={view} className="w3d-view" aria-hidden={!show3d} onPointerDown={() => setTouched(true)} />
      <div className="w3d-ctrl" role="group" aria-label="View">
        <button type="button" className="w3d-btn" aria-pressed={!show3d} onClick={() => setMode("photo")}>
          Photo
        </button>
        <button type="button" className="w3d-btn" aria-pressed={show3d} onClick={pick3d} aria-busy={state === "loading"}>
          <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
            <ellipse cx="10" cy="10" rx="7.5" ry="3.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M14.6 5.6l2.3 1.2-1.1 2.3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          360°
          {state === "loading" && (
            <span className="w3d-load" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(0.06, pct)})` }} />
            </span>
          )}
        </button>
      </div>
      {show3d && !touched && <p className="w3d-hint" aria-hidden="true">Drag to turn</p>}
    </div>
  );
}
