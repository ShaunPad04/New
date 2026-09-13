import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CTA — "button-in-button" architecture.
 *
 * The trailing arrow never sits naked next to the label. It lives in its
 * own circular wrapper flush with the button's right inner padding, and on
 * hover it translates diagonally and scales while the button itself
 * presses down. Rendered as a real link so it stays keyboard-operable.
 * Minimum height clears the 44px touch target.
 */
export function Cta({
  href,
  children,
  variant = "solid",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "light";
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "group inline-flex min-h-[3.25rem] items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-medium tracking-tight",
    "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98]",
    variant === "solid" && "bg-plum text-cream",
    variant === "ghost" &&
      "border border-espresso/15 bg-cream/60 text-espresso hover:border-espresso/35",
    variant === "light" && "bg-cream text-espresso",
    className
  );

  const arrow = (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base",
        "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "group-hover:-translate-y-[1px] group-hover:translate-x-1 group-hover:scale-105",
        variant === "solid" ? "bg-cream/12" : "bg-espresso/6"
      )}
    >
      ↗
    </span>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {arrow}
    </Link>
  );
}
