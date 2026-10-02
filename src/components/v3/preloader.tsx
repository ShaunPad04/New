"use client";

import { useEffect, useState } from "react";
import { heroFonts } from "./hero-fonts";

declare global {
  interface Window {
    __blPreloaded?: boolean;
  }
}

/**
 * PRELOADER — after Neiden's load screen (Brad, 2026-09-28: "when you reload
 * the page I want a load screen kind of thing, like how Neiden is"). Black,
 * the line writing itself in script with a glowing pen tip (no logo: Brad
 * removed the BL mark, 2026-09-28); then the screen lifts away and the hero's own entrance plays
 * (its delays are keyed off `.bl-preloader` in globals.css).
 *
 * ~2.5s, not Neiden's ~5s: it is pure CSS in the server HTML, so it covers
 * the page from the first paint with no JavaScript in the way, and it never
 * blocks input (pointer-events: none). Full loads only: after the first
 * mount a window flag stops it replaying on client-side navigation back to
 * `/`. Not shown under reduced motion or without scripting (CSS), nor on
 * phones under 768px (Brad, 2026-10-02: it held the hero back ~2.5s there).
 */
/** `line` is the hero line, lowercased, passed in by the page (no content.ts in the browser). */
export function Preloader({ line }: { line: string }) {
  // Hydration renders it (the flag is unset until the effect below), so the
  // server HTML matches; a later client navigation to `/` skips it.
  const [show] = useState(() => typeof window === "undefined" || !window.__blPreloaded);
  // Reloads opening on the hero is `RELOAD_TO_TOP` in app/layout.tsx: it has
  // to act before the first layout, and once per document, not per mount.
  useEffect(() => {
    window.__blPreloaded = true;
  }, []);
  if (!show) return null;

  return (
    <div aria-hidden="true" className={`bl-preloader ${heroFonts}`}>
      <p className="bl-preloader-line">
        <span className="bl-preloader-ink">{line}</span>
        <span className="bl-preloader-tip" />
      </p>
    </div>
  );
}
