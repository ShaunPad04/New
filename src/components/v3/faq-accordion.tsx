"use client";

import { useId, useState } from "react";

export type QA = { q: string; a: string };

/**
 * The FAQ in the inner pages' system (2026-10-02): numbered hairline rows,
 * the open one's number in red, a "+" that turns a quarter into an "x" (never
 * a chevron). Closed answers stay in the DOM for search and find-in-page but
 * are `inert`. The questions arrive as props, so no copy file in the browser.
 */
export function FaqAccordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <ul className="border-t border-ink-1000">
      {items.map((f, i) => {
        const isOpen = open === i;
        const panel = `${base}-${i}`;
        return (
          <li key={f.q} className="border-b border-ink-300">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex min-h-11 w-full items-baseline gap-5 py-6 text-left lg:gap-8"
              >
                <span className={`w-8 shrink-0 font-[family-name:var(--font-cal-ui)] text-[1.125rem] tabular-nums transition-colors duration-300 ${isOpen ? "text-accent" : "text-ink-600"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-ink-1000 lg:text-[1.25rem]">{f.q}</span>
                <span aria-hidden="true" className={`relative size-4 shrink-0 self-center transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? "rotate-45" : ""}`}>
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink-1000" />
                  <span className="absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-ink-1000" />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pb-7 pl-13 text-[0.9375rem] leading-relaxed text-ink-700 lg:pl-16">{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
