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
  more,
  /** Collapsed height, in lines. Three is roughly a phone's attention span. */
  lines = 3,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * A second block that is CLOSED on a phone and open from `lg`, revealed by
   * the same button as the paragraph. On the service cards this is the
   * deliverables list — six bullets per card, six cards, all of it on screen
   * by default, which the client's word for was that it is far too much to
   * scroll past (2026-09-14).
   */
  more?: React.ReactNode;
  lines?: 2 | 3 | 4;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const moreId = useId();

  const clamp = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" }[
    lines
  ];

  return (
    /*
      From `lg` this becomes the two columns it replaced. The card's own grid
      is twelve columns with a 3rem gap and this cell now spans the last
      seven of them, so a nested seven-column grid with the SAME gap puts the
      paragraph back on columns 6-9 and the list back on 10-12, to the pixel.
      Nesting was necessary because one button has to govern both blocks, and
      the state that button owns lives in here.
    */
    <div className={cn(className, "lg:grid lg:grid-cols-7 lg:gap-12")}>
      <p
        id={id}
        data-expandable=""
        className={cn(
          "max-w-[46ch] leading-relaxed text-ink-800 lg:col-span-4",
          // The clamp is mobile-only and lifts the moment it is expanded.
          !open && clamp,
          "lg:line-clamp-none",
        )}
      >
        {children}
      </p>

      {/*
        A pill, at the client's request, and it borrows the ghost CTA's
        treatment rather than inventing a fourth button style: hairline at
        white/15, the same near-transparent fill, and the same border
        brightening on interaction. Smaller than a real CTA — this reveals a
        paragraph, it does not start a project, and sizing it like the hero
        buttons would give it a weight it has not earned.

        The 44px tap target is kept by padding rather than by `min-h`, so the
        pill stays visually small while remaining thumb-sized.
      */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={more ? `${id} ${moreId}` : id}
        className={cn(
          "eyebrow group mt-5 inline-flex items-center gap-2 whitespace-nowrap",
          "border-white/15 bg-white/[0.03] text-ink-900",
          "transition-colors duration-500 hover:border-white/30 hover:text-ink-1000",
          // 44px tall via min-height, not padding: the pill keeps its small
          // proportions while the tap target stays thumb-sized. Measured at
          // 29px with padding alone, which is legal under WCAG 2.5.8 but not
          // comfortable on a phone.
          // `hidden!`, not `hidden`. `.eyebrow` is a plain rule in globals.css
          // declared AFTER `@import "tailwindcss"`, so it is UNLAYERED, and
          // unlayered CSS beats anything in a cascade layer whatever the
          // specificity. Its `display: inline-flex` therefore silently won
          // against `lg:hidden` and the pill rendered on desktop, where there
          // is nothing to expand — the same source-order trap as `normal-case!`
          // on the figures in `results.tsx`.
          "min-h-[2.75rem] py-2.5 pl-4 pr-3.5 lg:hidden!",
        )}
      >
        {open ? "Read less" : "Read more"}
        <span
          aria-hidden="true"
          className={cn(
            "block text-[0.9em] leading-none transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            open ? "rotate-180" : "group-hover:translate-y-0.5",
          )}
        >
          ↓
        </span>
      </button>

      {/*
        AFTER the button, not before it, so the control does not move when it
        is pressed — opening grows the card downwards and "Read less" stays
        exactly where the thumb just was.

        `grid-rows-[0fr]` -> `[1fr]` rather than `hidden`, for the reason the
        paragraph is clamped rather than put in a <details>: the copy has to
        stay in the DOM and in the accessibility tree for the answer engines
        this section is written to be cited by. It is collapsed visually and
        nothing more. It also animates, which `height: auto` cannot.
      */}
      {more ? (
        <div
          id={moreId}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            open ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            "lg:col-span-3 lg:mt-0 lg:grid-rows-[1fr] lg:opacity-100",
          )}
        >
          <div className="overflow-hidden">{more}</div>
        </div>
      ) : null}
    </div>
  );
}
