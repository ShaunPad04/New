"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const PlexusCursor = dynamic(() => import("./plexus-cursor").then((m) => m.PlexusCursor), { ssr: false });

const FINE = "(hover: hover) and (pointer: fine)";
const subscribe = (onChange: () => void) => {
  const m = matchMedia(FINE);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
};

/**
 * The hero's cursor web only exists for a mouse (Brad, 2026-09-29: none on
 * phones), so only a mouse device downloads its code (2026-10-02: it shipped
 * to phones and sat idle there).
 */
export function PlexusCursorLoader() {
  const fine = useSyncExternalStore(subscribe, () => matchMedia(FINE).matches, () => false);
  return fine ? <PlexusCursor /> : null;
}
