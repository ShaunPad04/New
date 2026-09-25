import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Shared pieces of the Lurais-direction preview (2026-09-25), expressed in
 * design system v2: Archivo caps for display, Geist for text, the ink
 * palette, the kit for motion. Layout ideas from the Framer template Lurais
 * (Stacy More) — studied, not copied: no assets, code or copy taken.
 */

/** "01 ———————————— /INTRODUCTION": the numbered hairline that opens a section. */
export function SectionRule({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">
      <span className="tabular-nums">{index}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-ink-300" />
      <span className="text-ink-1000">/{label}</span>
    </div>
  );
}

/**
 * The giant sideways section word in the left gutter ("/ABOUT US").
 * Decorative — the section has its own real heading — so aria-hidden.
 * It carries no information the heading does not.
 */
export function GutterWord({ children }: { children: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none hidden select-none lg:block">
      {/* vertical-rl + a half turn reads bottom-to-top, as in the template.
          The word is drawn by CSS `content`, not as a text node: it is pure
          ornament at deliberately low contrast, and a real text node would
          (rightly) be held to the 3:1 minimum by any contrast audit. Out of
          the text layer it is what it is — decoration, like a rule. */}
      <span
        data-word={`/${children}`}
        style={{ writingMode: "vertical-rl" }}
        className="display sticky top-28 block rotate-180 whitespace-nowrap text-[7.5rem] leading-none text-ink-300 before:content-[attr(data-word)]"
      />
    </div>
  );
}

/** Corner-bracket button: four hairline corners, no box. */
export function BracketLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const c = "absolute h-2.5 w-2.5 border-ink-1000 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex min-h-14 items-center justify-center px-12 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-1000",
        className,
      )}
    >
      <span aria-hidden="true" className={cn(c, "left-0 top-0 border-l border-t group-hover:-left-1 group-hover:-top-1")} />
      <span aria-hidden="true" className={cn(c, "right-0 top-0 border-r border-t group-hover:-right-1 group-hover:-top-1")} />
      <span aria-hidden="true" className={cn(c, "bottom-0 left-0 border-b border-l group-hover:-bottom-1 group-hover:-left-1")} />
      <span aria-hidden="true" className={cn(c, "bottom-0 right-0 border-b border-r group-hover:-bottom-1 group-hover:-right-1")} />
      {children}
    </Link>
  );
}

/** The two-dot prefix Lurais sets before its big section titles. */
export function Dots() {
  return (
    <span aria-hidden="true" className="mr-[0.15em] inline-flex translate-y-[-0.08em] gap-[0.06em] align-baseline">
      <span className="inline-block h-[0.14em] w-[0.14em] rounded-full bg-ink-1000" />
      <span className="inline-block h-[0.14em] w-[0.14em] rounded-full bg-ink-600" />
    </span>
  );
}
