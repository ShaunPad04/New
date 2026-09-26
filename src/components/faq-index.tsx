"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string; meta?: string };

/**
 * FAQ — "the index" (Brad chose concept A for the /faq page, 2026-09-25).
 *
 * Lurais's FAQ in the v2 system: bare ruled rows, the question in caps, a
 * quiet dot that fills when open, the answer at reading size beneath. No
 * cards, no boxes — type and hairlines only.
 *
 * Every answer stays in the DOM (collapsed with grid rows, as the old
 * accordion did) so crawlers and find-in-page still reach it; a closed
 * panel is `inert` and aria-hidden, so assistive tech and the keyboard
 * skip what is not shown. Answers are verbatim from `faqs`.
 */
export function FaqIndex({
  items,
  heading,
  lede,
  headingId,
  more,
}: {
  items: readonly Item[];
  heading: string;
  lede: string;
  headingId: string;
  /** Optional route out, e.g. to the full FAQ from a short list. */
  more?: { text: string; href: string; label: string };
}) {
  const [open, setOpen] = useState(0);
  const base = useId();

  return (
    <section id="faq" aria-labelledby={headingId} className="scroll-mt-24 bg-ink-0">
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 py-24 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:py-32">
        <div className="self-start lg:sticky lg:top-28">
          <h2 id={headingId} className="display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.88] text-ink-1000">
            {heading}
          </h2>
          <p className="mt-6 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-700">{lede}</p>
        </div>
        <div>
          <ul className="border-t border-ink-300">
            {items.map((f, i) => {
              const isOpen = open === i;
              const panel = `${base}-a${i}`;
              return (
                <li key={f.q} className="border-b border-ink-300">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panel}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex min-h-11 w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-[0.9375rem] font-semibold uppercase tracking-[0.01em] text-ink-1000">
                        {f.q}
                      </span>
                      <span className="flex shrink-0 items-center gap-4">
                        {f.meta ? (
                          <span className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-600 sm:inline">
                            {f.meta}
                          </span>
                        ) : null}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-3 w-3 rounded-full border border-ink-600 transition-colors duration-300",
                            isOpen && "border-ink-1000 bg-ink-1000",
                          )}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panel}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[62ch] pb-7 text-[0.9375rem] leading-relaxed text-ink-800">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {more ? (
            <p className="mt-10 text-sm text-ink-600">
              {more.text}{" "}
              <Link href={more.href} className="text-ink-1000 underline underline-offset-4">
                {more.label}
              </Link>
              .
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
