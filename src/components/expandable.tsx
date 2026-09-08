"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Long-form detail that is collapsed on a phone and open on a desktop.
 *
 * THE PROBLEM. Each service carries a paragraph written for someone who is
 * genuinely evaluating us. On a 1440px screen it sits in its own column beside
 * the title and costs nothing. On a 390px phone the same paragraph is fifteen
 * lines, six services deep, and the client's own words for it were that nobody
 * is going to scroll that far — it loses momentum before the reader reaches
 * the work, the pricing or the form.
 *
 * WHY LINE-CLAMP AND A BUTTON, rather than <details>. The text stays in the
 * DOM either way, which matters here: this is the copy that earns citations
 * from search and answer engines, and hiding it behind a disclosure element
 * that some crawlers treat as collapsed content is the opposite of what the
 * GEO work on this site is for. `line-clamp` is purely visual — the paragraph
 * is complete for a crawler and readable in full by a screen reader, whatever
 * the button says.
 *
 * It also degrades honestly: with JavaScript disabled the clamp still applies
 * and the button does nothing, so the reader sees a tidy three lines rather
 * than a broken control. The full text is a screen-reader announcement away
 * regardless.
 *
 * Above `lg` the clamp is lifted and the button is hidden in CSS, so the
 * desktop composition the client approved is untouched and nothing has to
 * re-render at a breakpoint.
 */
export function Expandable({
  children,
  className,
  /** Collapsed height, in lines. Three is roughly a phone's attention span. */
  lines = 3,
}: {
  children: React.ReactNode;
  className?: string;
  lines?: 2 | 3 | 4;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const clamp = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" }[
    lines
  ];

  return (
    <div className={className}>
      <p
        id={id}
        className={cn(
          "max-w-[46ch] leading-relaxed text-ink-800",
          // The clamp is mobile-only and lifts the moment it is expanded.
          !open && clamp,
          "lg:line-clamp-none",
        )}
      >
        {children}
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="field-label mt-3 inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap text-ink-900 transition-colors duration-500 hover:text-ink-1000 lg:hidden"
      >
        {open ? "Read less" : "Read more"}
        <span
          aria-hidden="true"
          className={cn(
            "block transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            open && "rotate-180",
          )}
        >
          ↓
        </span>
      </button>
    </div>
  );
}
