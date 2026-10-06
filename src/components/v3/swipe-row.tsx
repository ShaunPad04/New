"use client";

import { useEffect, useRef, type ReactNode, type Ref } from "react";

/**
 * A set of cards that SWIPES sideways on phones (the `SWIPE` classes in
 * ai-automation.tsx) and is a plain grid from 640px.
 *
 * A region that scrolls has to be reachable by keyboard (axe
 * `scrollable-region-focusable`): /pricing's decks get that for free because
 * every card holds a link, but these cards hold none. So the row itself takes
 * focus, and the arrow keys scroll it, ONLY while it actually overflows: on
 * desktop it is the grid (or `display: contents`) and adds no tab stop.
 */
export function SwipeRow({
  as: Tag = "div",
  label,
  className,
  children,
}: {
  as?: "ul" | "ol" | "div";
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      const scrolls = getComputedStyle(el).overflowX === "auto" && el.scrollWidth > el.clientWidth + 1;
      if (scrolls) {
        el.tabIndex = 0;
        el.setAttribute("aria-label", label);
        if (Tag === "div") el.setAttribute("role", "group");
      } else {
        el.removeAttribute("tabindex");
        el.removeAttribute("aria-label");
        if (Tag === "div") el.removeAttribute("role");
      }
    };
    sync();
    // A `display: contents` row has no box to observe, so the breakpoint is watched too.
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    const mq = window.matchMedia("(max-width: 639px)");
    mq.addEventListener("change", sync);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, [Tag, label]);

  return (
    <Tag ref={ref as Ref<never>} role={Tag === "ul" ? "list" : undefined} className={className}>
      {children}
    </Tag>
  );
}
