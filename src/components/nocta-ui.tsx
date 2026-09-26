import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * Shared pieces of the Nocta direction (Brad, 2026-09-26): hairline corner
 * brackets, the striped section label, the ⊕ tick and the bracketed button.
 * Layout ideas studied from nocta.framer.website; no asset or code taken.
 */

/**
 * Four hairline corner marks around a box — Nocta's signature frame.
 * `hover`: inside a `group`, the corners open outwards and brighten on
 * hover / keyboard focus (used by BracketButton only, so every other
 * bracketed frame on the site stays still).
 */
export function Brackets({ className, hover = false }: { className?: string; hover?: boolean }) {
  const c = cn(
    "pointer-events-none absolute h-2 w-2 border-ink-600",
    hover &&
      "transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-ink-1000 group-focus-visible:border-ink-1000 motion-reduce:transition-none",
  );
  const o = hover
    ? [
        "group-hover:-translate-x-1 group-hover:-translate-y-1 group-focus-visible:-translate-x-1 group-focus-visible:-translate-y-1",
        "group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1",
        "group-hover:-translate-x-1 group-hover:translate-y-1 group-focus-visible:-translate-x-1 group-focus-visible:translate-y-1",
        "group-hover:translate-x-1 group-hover:translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:translate-y-1",
      ]
    : ["", "", "", ""];
  // `contents`: the wrapper must not take a grid cell of its own (it did,
  // and pushed the fourth plan onto a second row).
  return (
    <span aria-hidden="true" className={cn("contents", className)}>
      <span className={cn(c, o[0], "-left-px -top-px border-l border-t")} />
      <span className={cn(c, o[1], "-right-px -top-px border-r border-t")} />
      <span className={cn(c, o[2], "-bottom-px -left-px border-b border-l")} />
      <span className={cn(c, o[3], "-bottom-px -right-px border-b border-r")} />
    </span>
  );
}

/** The striped label: "||||||| PRICING". */
export function StripeLabel({ children }: { children: ReactNode }) {
  return (
    <p className="relative inline-flex items-center gap-3 border border-ink-300 bg-ink-50 px-3.5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-1000">
      <Brackets />
      <span aria-hidden="true" className="flex gap-[2px]">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={cn("h-3 w-[2px]", i < 6 ? "bg-ink-1000" : "bg-ink-500")} />
        ))}
      </span>
      {children}
    </p>
  );
}

export function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("h-[18px] w-[18px] shrink-0", className)} fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 6.5v7M6.5 10h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The bracketed card button. Hover / keyboard focus (Brad, 2026-09-26: "upon
 * hover can we have some motion"): a white fill rises from the foot — the
 * same move as the footer social tiles — the label rolls up and a black
 * copy rolls in over the fill, the corners open outwards and the arrow
 * turns. Transform-only; reduced motion keeps the colour change, no travel.
 */
export function BracketButton({ href, children, strong }: { href: string; children: ReactNode; strong?: boolean }) {
  const ease = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";
  const label = (
    <span className="inline-flex items-center gap-2.5">
      {children}
      <span aria-hidden="true" className={cn("inline-block transition-transform group-hover:rotate-45 group-focus-visible:rotate-45", ease)}>
        ↗
      </span>
    </span>
  );
  return (
    <Link
      href={href}
      className={cn(
        "btn-grain group relative isolate flex min-h-12 items-center justify-center border border-ink-300 text-[0.9375rem] text-ink-1000 transition-colors duration-300 hover:border-ink-1000 focus-visible:border-ink-1000",
        strong ? "bg-ink-200" : "bg-transparent",
      )}
    >
      <Brackets hover />
      {/* The fill, clipped to the button so the corners can sit outside it. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className={cn("absolute inset-0 translate-y-full bg-ink-1000 transition-transform group-hover:translate-y-0 group-focus-visible:translate-y-0", ease)} />
      </span>
      {/* The label roll: the real label (accessible name) rolls up and out;
          an aria-hidden black copy rolls in from below. */}
      <span className="relative block overflow-hidden py-1">
        <span className={cn("block transition-transform group-hover:-translate-y-[130%] group-focus-visible:-translate-y-[130%]", ease)}>
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn("absolute inset-0 flex translate-y-[130%] items-center justify-center text-ink-0 transition-transform group-hover:translate-y-0 group-focus-visible:translate-y-0", ease)}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}
