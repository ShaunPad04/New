"use client";

import { useEffect, useState } from "react";
import { BUSINESS } from "@/lib/business";
import { openState, type OpenState } from "@/lib/hours";

/**
 * "Open now · until 17:30" from the real hours in content/business.json,
 * computed in the shop's time zone on the client so a static page is never
 * wrong. Renders a neutral placeholder until mounted (no hydration mismatch).
 */
export default function OpenNowChip({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const tick = () => setState(openState(BUSINESS.hours.week, BUSINESS.hours.timezone));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const unconfirmed = !BUSINESS.hours.confirmed;
  return (
    <span
      className={`chip ${state?.isOpen ? "is-open" : ""} ${className}`}
      title={unconfirmed ? "TODO: opening hours not yet confirmed by the shop" : undefined}
      aria-live="polite"
    >
      <span className="dot" aria-hidden="true" />
      <span className="tnum">{state ? (compact ? state.short : state.label) : "Opening hours"}</span>
      {unconfirmed && <span className="sr-only">(hours to be confirmed)</span>}
    </span>
  );
}
