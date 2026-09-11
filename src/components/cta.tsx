import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ActionCta } from "@/components/action-cta";

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
  if (solid) {
    return (
      <ActionCta href={href} className={className}>
        {children}
      </ActionCta>
    );
  }

  const isRoute = href.startsWith("/");
  const Tag = isRoute ? Link : "a";

  return (
    <Tag
      href={href}
      className={cn(
        // `justify-between` so the trailing arrow sits flush with the right
        // inner padding at ANY width. The button is inline-flex and shrinks to
        // its content in most places, where this changes nothing — but the
        // hero stretches both CTAs to full width on a phone, and without it
        // the arrow stayed glued to the label and floated in the middle of the
        // button. The house standard puts that arrow on the right edge.
        "group inline-flex min-h-[3.25rem] items-center justify-between gap-3 rounded-full py-2 pl-7 pr-2 text-sm font-medium tracking-tight",
        "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
        // The transparent border is load-bearing, not cosmetic: the invert
        // variant carries a hairline, and without a matching border here the
        // two buttons differ by 2px in height whenever they sit side by side.
        // Measured at 52px against 54px before this was added.
        solid && "border border-transparent bg-ink-1000 text-ink-0",
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
