import type { CSSProperties } from "react";
import Link from "next/link";

/**
 * The "Start a project +" bar, as Neiden's (Brad, 2026-09-29: "when hovering
 * over start a project it should go red like neiden", "exactly like neiden"):
 * a solid black bar, the label centred in 12px bold caps, a "+" at the right.
 * On hover the bar fades to the accent red, the "+" turns half a turn and the
 * letters roll up one after another. Pure CSS (`.hero-cta*` in globals.css);
 * reduced motion keeps the colour change only. The homepage hero's, shared
 * with the inner pages (2026-10-02) so every page ends on the same button.
 */
export function HeroCta({ label = "Start a project", href = "/#contact", light = false, sr, className = "" }: { label?: string; href?: string; light?: boolean; /** Read after the label only, e.g. the tier: "Start a project — Essential". */ sr?: string; className?: string }) {
  return (
    <Link href={href} className={`hero-cta ${light ? "hero-cta-light" : ""} ${className}`}>
      <span className="sr-only">
        {label}
        {sr ? ` — ${sr}` : ""}
      </span>
      <span aria-hidden="true" className="hero-cta-label">
        {[...label].map((ch, i) => (
          <span key={i} className="hero-cta-ch" style={{ "--i": i } as CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
      <svg aria-hidden="true" viewBox="0 0 20 20" className="hero-cta-plus">
        <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </Link>
  );
}
