"use client";

import { useId, useState } from "react";
import { faqs } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Brackets, StripeLabel } from "@/components/nocta-ui";

/**
 * FAQ — Nocta's tabbed FAQ (Brad chose FAQ C for /faq, 2026-09-26).
 * Projects / Working together tabs over a framed accordion with a +/−
 * that turns. Every answer verbatim from `faqs`; closed panels stay in
 * the DOM (crawlers, find-in-page) but are inert and aria-hidden. The
 * FAQPage JSON-LD on /faq still lists every question.
 */
/* ================================================================== */
/* FAQ C — tabs + framed accordion                                     */
/* ================================================================== */
/* Every `meta` belongs to exactly one tab. Anything NOT listed under
   Projects falls into Working together, so a new question can never go
   missing from the page — it just lands in the second tab until placed. */
const PROJECT_METAS = [
  "Pricing", "Timeline", "Steps", "Packages", "Development", "Brand",
  "Ownership", "Edits", "Guarantee", "Creative", "Process",
];
const TABS = ["Projects", "Working together"] as const;

export function FaqTabs({
  headingId = "faq-heading",
  items: only,
  heading = "FAQs",
  lede = "Answers to what people ask before they commit — how we work, what it costs and how long it takes.",
  more,
}: {
  headingId?: string;
  /** A fixed subset (e.g. the money questions on /pricing). When given,
      the tabs are dropped and the framed list shows just these. */
  items?: readonly (typeof faqs)[number][];
  heading?: string;
  lede?: string;
  more?: { text: string; href: string; label: string };
}) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(0);
  const base = useId();
  const items = only ?? faqs.filter((f) => (PROJECT_METAS.includes(f.meta) ? 0 : 1) === tab);

  return (
    <section id="faq" aria-labelledby={headingId} className="scroll-mt-24 bg-ink-0">
    <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 py-24 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:py-32">
      <div className="self-start lg:sticky lg:top-28">
        <StripeLabel>FAQs</StripeLabel>
        <h2 id={headingId} className="display mt-5 text-[clamp(2.75rem,6vw,5rem)] leading-[0.88] text-ink-1000">{heading}</h2>
        <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-700">{lede}</p>
      </div>
      <div>
        {only ? null : (
        <div role="tablist" aria-label="Question groups" className="grid grid-cols-2 gap-2">
          {TABS.map((t, i) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => {
                setTab(i);
                setOpen(0);
              }}
              className={cn(
                "relative min-h-11 border text-[0.8125rem] font-semibold uppercase tracking-[0.04em] transition-colors",
                tab === i ? "border-ink-1000 bg-ink-1000 text-ink-0" : "border-ink-300 text-ink-900 hover:border-ink-600",
              )}
            >
              {tab !== i ? <Brackets /> : null}
              {t}
            </button>
          ))}
        </div>
        )}
        {/* The panel role goes on a wrapper: on the <ul> itself it replaced
            the list role and orphaned every <li> (axe, 2026-09-26). */}
        <div
          {...(only ? {} : { role: "tabpanel", "aria-label": TABS[tab] })}
          className={cn("relative border border-ink-300", only ? "" : "mt-2")}
        >
          <Brackets />
          <ul>
          {items.map((f, i) => {
            const isOpen = open === i;
            const panel = `${base}-${tab}-${i}`;
            return (
              <li key={f.q} className={cn(i > 0 && "border-t border-ink-300")}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex min-h-11 w-full items-center justify-between gap-6 px-6 py-6 text-left"
                  >
                    <span className="text-[1rem] font-medium uppercase tracking-[-0.01em] text-ink-1000">{f.q}</span>
                    <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink-1000" />
                      <span className={cn("absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-ink-1000 transition-transform duration-300", isOpen && "scale-y-0")} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panel}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-7 text-[0.9375rem] leading-relaxed text-ink-700">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
          </ul>
        </div>
        {more ? (
          <p className="mt-8 text-sm text-ink-600">
            {more.text}{" "}
            <a href={more.href} className="text-ink-1000 underline underline-offset-4">
              {more.label}
            </a>
            .
          </p>
        ) : null}
      </div>
    </div>
    </section>
  );
}
