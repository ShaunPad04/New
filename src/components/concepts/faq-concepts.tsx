"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/lib/content";
import { cn } from "@/lib/utils";

/*
 * Two FAQ concepts. Same five questions, same order (the order is
 * load-bearing — CLAUDE.md: `compact` takes the first five), answers
 * verbatim from `faqs`, and the same "full FAQ" route out.
 */
const items = faqs.slice(0, 5);

function More() {
  return (
    <p className="mt-10 text-sm text-ink-600">
      Five more answers — hosting, the AI systems and our process — on the{" "}
      <Link href="/faq" className="text-ink-1000 underline underline-offset-4">
        full FAQ
      </Link>
      .
    </p>
  );
}

/* A — THE INDEX. Lurais's own FAQ: bare ruled rows, question in caps, a
   quiet dot that fills when open; the answer drops in beneath at reading
   size. No cards, no boxes — type and hairlines only. */
export function FaqA() {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
      <div>
        <h3 className="display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.88] text-ink-1000">
          Before you ask.
        </h3>
        <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-700">
          The things people ask before they commit. If yours is not here, ask
          us directly — you will get a straight answer.
        </p>
      </div>
      <div>
        <ul className="border-t border-ink-300">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-ink-300">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex min-h-11 w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[0.9375rem] font-semibold uppercase tracking-[0.01em] text-ink-1000">
                    {f.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-3 w-3 shrink-0 rounded-full border border-ink-600 transition-colors duration-300",
                      isOpen && "border-ink-1000 bg-ink-1000",
                    )}
                  />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-7 text-[0.9375rem] leading-relaxed text-ink-800">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <More />
      </div>
    </div>
  );
}

/* B — THE READER. Questions as a numbered list on the left; the chosen
   answer set large on the right, like a pull-quote. The 21st.dev
   "split FAQ" pattern. On a phone it folds back into an accordion. */
export function FaqB() {
  const [i, setI] = useState(0);
  return (
    <div>
      <h3 className="display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.88] text-ink-1000">
        Before you ask.
      </h3>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
        <ul className="border-t border-ink-300">
          {items.map((f, k) => (
            <li key={f.q} className="border-b border-ink-300">
              <button
                type="button"
                aria-expanded={i === k}
                onClick={() => setI(k)}
                className={cn(
                  "group flex min-h-11 w-full items-baseline gap-5 py-5 text-left transition-colors duration-300",
                  i === k ? "text-ink-1000" : "text-ink-600 hover:text-ink-900",
                )}
              >
                <span className="font-mono text-xs tabular-nums">0{k + 1}</span>
                <span className="text-lg font-medium leading-snug tracking-[-0.02em]">{f.q}</span>
                <span
                  aria-hidden="true"
                  className={cn("ml-auto transition-transform duration-500", i === k ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")}
                >
                  →
                </span>
              </button>
              {/* Phone: the answer opens in place. */}
              <div className={cn("grid transition-[grid-template-rows] duration-500 lg:hidden", i === k ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <p className="pb-6 text-[0.9375rem] leading-relaxed text-ink-800">{f.a}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div aria-live="polite" className="relative hidden overflow-hidden rounded-[2rem] bg-ink-100 p-10 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] lg:block lg:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-600">
            {items[i].meta} — 0{i + 1}
          </p>
          <p className="mt-6 text-2xl font-medium leading-snug tracking-[-0.03em] text-ink-1000">{items[i].q}</p>
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-800">{items[i].a}</p>
        </div>
      </div>
      <More />
    </div>
  );
}
