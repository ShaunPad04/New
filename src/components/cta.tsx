import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * CTA — "button-in-button" architecture.
 *
 * Per the house high-end-visual-design standard: the trailing arrow never
 * sits naked next to the label. It lives in its own circular wrapper flush
 * with the button's right inner padding, and on hover it translates
 * diagonally and scales, creating internal kinetic tension while the button
 * itself presses down.
 *
 * Rendered as a real link so it stays keyboard-operable and announced as a
 * link. An href pointing at a route uses <Link> for client-side navigation;
 * an in-page anchor stays a plain <a> so the browser handles the jump.
 * Minimum height clears the 44px touch target.
 */
export function Cta({
  href,
  children,
  variant = "solid",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "invert";
  className?: string;
}) {
  const solid = variant === "solid";
  const invert = variant === "invert";

  const isRoute = href.startsWith("/");
  const Tag = isRoute ? Link : "a";

  return (
    <Tag
      href={href}
      className={cn(
        "group inline-flex min-h-[3.25rem] items-center gap-3 rounded-full py-2 pl-7 pr-2 text-sm font-medium tracking-tight",
        "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
        solid && "bg-ink-1000 text-ink-0",
        // Solid black with white type. The hairline is not decoration: over
        // footage this button often lands on something already near-black —
        // the dark jacket in the hero, for one — and without an edge the pill
        // simply disappears and reads as loose text.
        invert && "border border-white/25 bg-ink-0 text-ink-1000",
        !solid &&
          !invert &&
          "border border-white/15 bg-white/[0.03] text-ink-1000 hover:border-white/30",
        className
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base",
          "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105",
          solid && "bg-ink-0/10",
          invert && "bg-ink-1000/15",
          !solid && !invert && "bg-white/10"
        )}
      >
        ↗
      </span>
    </Tag>
  );
}
