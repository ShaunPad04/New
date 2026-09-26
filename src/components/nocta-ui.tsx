import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/*
 * Shared pieces of the Nocta direction (Brad, 2026-09-26): hairline corner
 * brackets, the striped section label, the ⊕ tick and the bracketed button.
 * Layout ideas studied from nocta.framer.website; no asset or code taken.
 */

/** Four hairline corner marks around a box — Nocta's signature frame. */
export function Brackets({ className }: { className?: string }) {
  const c = "pointer-events-none absolute h-2 w-2 border-ink-600";
  // `contents`: the wrapper must not take a grid cell of its own (it did,
  // and pushed the fourth plan onto a second row).
  return (
    <span aria-hidden="true" className={cn("contents", className)}>
      <span className={cn(c, "-left-px -top-px border-l border-t")} />
      <span className={cn(c, "-right-px -top-px border-r border-t")} />
      <span className={cn(c, "-bottom-px -left-px border-b border-l")} />
      <span className={cn(c, "-bottom-px -right-px border-b border-r")} />
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

export function BracketButton({ href, children, strong }: { href: string; children: ReactNode; strong?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex min-h-12 items-center justify-center border border-ink-300 text-[0.9375rem] text-ink-1000 transition-colors duration-300 hover:bg-ink-200",
        strong ? "bg-ink-200" : "bg-transparent",
      )}
    >
      <Brackets />
      {children}
    </Link>
  );
}

