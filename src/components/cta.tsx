import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Brackets } from "@/components/nocta-ui";

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

  /*
    THE PRIMARY VARIANT IS NOW THE FRAMER-DERIVED BUTTON (client request,
    2026-09-11: "use this on buttons"). Delegating here rather than editing
    nine call sites means every primary CTA on the site changes together and
    none can be missed or drift.

    Only `solid` delegates. `invert` and `ghost` are the secondaries that sit
    beside it, and they have to stay dark: two identical white pills side by
    side have no hierarchy, and in the hero the secondary sits on footage where
    only a dark plate with a hairline stays legible. The pricing tiers matter
    here too — the featured card is white, and it asks for `invert`/`ghost`
    precisely so its button does not vanish into the plate.
  */
  /*
    NOCTA BUTTON (2026-09-26, Brad: "the same style for the other pages").
    Every variant is now the square bracket button from the homepage
    pricing and footer — hairline box, corner brackets, label left, arrow
    right. `solid` is the white plate with black type (the primary);
    `invert` and `ghost` are the dark framed secondaries. The Framer-derived
    pill (ActionCta) is retired from here; it no longer has call sites.
  */
  const isRoute = href.startsWith("/");
  const Tag = isRoute ? Link : "a";

  return (
    <Tag
      href={href}
      className={cn(
        "group relative inline-flex min-h-[3.25rem] items-center justify-between gap-6 border px-6 text-sm font-medium uppercase tracking-[0.04em]",
        "transition-colors duration-300",
        solid && "border-ink-1000 bg-ink-1000 text-ink-0 hover:bg-ink-900",
        invert && "border-ink-400 bg-ink-0 text-ink-1000 hover:bg-ink-100",
        !solid && !invert && "btn-grain border-ink-300 bg-transparent text-ink-1000 hover:bg-ink-100",
        invert && "btn-grain",
        className,
      )}
    >
      {!solid ? <Brackets /> : null}
      {children}
      <span
        aria-hidden="true"
        className="text-base transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-45"
      >
        ↗
      </span>
    </Tag>
  );
}
