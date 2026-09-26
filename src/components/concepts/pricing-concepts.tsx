"use client";

import { useState } from "react";
import Link from "next/link";
import { projectTiers, projectTiersShared, site, type Tier } from "@/lib/content";
import { cn } from "@/lib/utils";

/*
 * Two pricing concepts. The CONTENT is the live section's, read from the same
 * data, verbatim: names, audience lines, prices, the "once we have your
 * content" delivery lines, summaries, every include, "Every build includes",
 * "no VAT charged", and the payment / chatbot small print — which is legally
 * load-bearing (CPUTR 2008 / DMCCA 2024) and so appears in both, in full,
 * at body size, never in a tooltip.
 */

const fmt = new Intl.NumberFormat("en-GB");

function split(t: Tier) {
  const [first, ...rest] = t.includes;
  const inherits = first?.startsWith("Everything in ") ? first : null;
  return { inherits, items: inherits ? rest : t.includes };
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] h-3.5 w-3.5 shrink-0" fill="none" aria-hidden="true">
      <path d="M3 8.4 6.2 11.6 13 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SmallPrint() {
  return (
    <>
      <p className="mt-10 max-w-[64ch] text-sm leading-relaxed text-ink-600">
        50% on commissioning, 50% on launch. Where a tier includes AI Text
        Chatbot setup, the chatbot&rsquo;s monthly fee still applies — it is
        listed with the monthly plans on the pricing page.
      </p>
      <Link href="/pricing" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.04em] text-ink-1000 underline-offset-4 hover:underline">
        Monthly plans &amp; AI systems ↗
      </Link>
    </>
  );
}

function Shared() {
  return (
    <div className="flex flex-col gap-4 border-y border-ink-300 py-5 lg:flex-row lg:items-center lg:gap-10">
      <p className="shrink-0 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">Every build includes</p>
      <ul className="flex flex-col gap-2.5 lg:grid lg:flex-1 lg:grid-cols-3 lg:gap-x-8">
        {projectTiersShared.map((i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-ink-900">
            <Tick />
            {i}
          </li>
        ))}
      </ul>
      <p className="shrink-0 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600 lg:ml-auto">
        {site.currencySymbol} GBP — no VAT charged
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A — THE RATE SHEET. A tailor's price list: one tier per ruled row,  */
/* price set large, the row opens to show what is in it.               */
/* ------------------------------------------------------------------ */
export function PricingA() {
  const [open, setOpen] = useState<string | null>(projectTiers.find((t) => t.featured)?.id ?? null);
  return (
    <div>
      <Shared />
      <ul className="mt-4">
        {projectTiers.map((t, i) => {
          const isOpen = open === t.id;
          const { inherits, items } = split(t);
          return (
            <li key={t.id} className="border-b border-ink-300">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : t.id)}
                className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-8 text-left lg:grid-cols-[3rem_1.1fr_1fr_auto_3rem] lg:gap-8 lg:py-10"
              >
                <span className="font-mono text-xs tabular-nums text-ink-600">0{i + 1}</span>
                <span>
                  <span className="flex items-center gap-3">
                    <span className="display text-[clamp(1.75rem,3vw,2.75rem)] leading-none text-ink-1000">{t.name}</span>
                    {t.featured ? (
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ink-1000" />
                    ) : null}
                  </span>
                  <span className="mt-2 block text-[0.8125rem] uppercase tracking-[0.04em] text-ink-600">{t.meta}</span>
                </span>
                <span className="hidden text-sm leading-relaxed text-ink-700 lg:block">{t.delivery}</span>
                <span className="text-right">
                  <span className="text-xs text-ink-600">from </span>
                  <span className="display text-[clamp(1.75rem,3.4vw,3.25rem)] leading-none tabular-nums text-ink-1000">
                    {site.currencySymbol}
                    {fmt.format(t.price)}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-11 w-11 items-center justify-center justify-self-end rounded-full border border-ink-400 text-ink-1000 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:flex",
                    isOpen && "rotate-45 bg-ink-1000 text-ink-0",
                  )}
                >
                  +
                </span>
              </button>
              <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="grid gap-8 pb-10 pl-[3.5rem] lg:grid-cols-[1.1fr_1.9fr] lg:pl-[5rem]">
                    <div>
                      <p className="text-sm leading-relaxed text-ink-800 lg:hidden">{t.delivery}</p>
                      <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-800 lg:mt-0">{t.summary}</p>
                      <Link href="/#contact" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink-1000 px-6 text-sm font-medium text-ink-0">
                        Enquire<span className="sr-only"> about {t.name}</span>
                      </Link>
                    </div>
                    <div>
                      {inherits ? (
                        <p className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">{inherits}, plus</p>
                      ) : null}
                      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {items.map((it) => (
                          <li key={it} className="flex items-start gap-2.5 text-sm text-ink-900">
                            <Tick />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <SmallPrint />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* B — THE SELECTOR. Tier names as a segmented switch; one large panel */
/* shows the chosen tier in full. The 21st.dev "pricing tabs" pattern, */
/* in monochrome, with a silver edge on the featured tier.             */
/* ------------------------------------------------------------------ */
export function PricingB() {
  const [id, setId] = useState(projectTiers.find((t) => t.featured)?.id ?? projectTiers[0].id);
  const t = projectTiers.find((x) => x.id === id)!;
  const { inherits, items } = split(t);
  return (
    <div>
      <Shared />
      <div role="tablist" aria-label="Build tiers" className="mt-10 inline-flex flex-wrap gap-1 rounded-full bg-ink-100 p-1.5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]">
        {projectTiers.map((x) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={x.id === id}
            onClick={() => setId(x.id)}
            className={cn(
              "min-h-11 rounded-full px-5 text-sm font-semibold uppercase tracking-[0.04em] transition-colors duration-300",
              x.id === id ? "bg-ink-1000 text-ink-0" : "text-ink-700 hover:text-ink-1000",
            )}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div role="tabpanel" aria-label={t.name} className="relative mt-6 overflow-hidden rounded-[2rem] bg-ink-100 p-8 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] lg:p-14">
        {t.featured ? (
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)]" />
        ) : null}
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_70%)]" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-ink-600">{t.meta}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-sm text-ink-600">from</span>
              <span className="display text-[clamp(3.5rem,8vw,7rem)] leading-[0.85] tabular-nums text-ink-1000">
                {site.currencySymbol}
                {fmt.format(t.price)}
              </span>
            </p>
            <p className="mt-5 text-sm text-ink-700">{t.delivery}</p>
            <p className="mt-8 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-800">{t.summary}</p>
            <Link href="/#contact" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink-1000 px-7 text-sm font-medium text-ink-0">
              Enquire about {t.name}
            </Link>
          </div>
          <div className="lg:border-l lg:border-ink-300 lg:pl-12">
            {inherits ? (
              <p className="mb-5 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">{inherits}, plus</p>
            ) : (
              <p className="mb-5 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">What you get</p>
            )}
            <ul className="grid gap-3.5">
              {items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-[0.9375rem] text-ink-900">
                  <Tick />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SmallPrint />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* C and D keep the CURRENT layout — four cards side by side, rows     */
/* aligned across the deck with subgrid — and change only the look     */
/* (Brad: "I like the current layout, I don't like how it looks").     */
/* ------------------------------------------------------------------ */
const ROWS = "lg:row-span-5";

function CardBody({ t, dark }: { t: Tier; dark: boolean }) {
  const { inherits, items } = split(t);
  const muted = dark ? "text-ink-0/70" : "text-ink-600";
  return (
    <>
      <div>
        <p className={cn("text-[0.75rem] font-semibold uppercase tracking-[0.12em]", muted)}>{t.meta}</p>
        <h3 className="display mt-3 text-[1.75rem] leading-none">{t.name}</h3>
      </div>
      <div className="mt-8">
        <p className="flex items-baseline gap-1.5">
          <span className={cn("text-sm", muted)}>from</span>
          <span className="display text-[2.75rem] leading-none tabular-nums">
            {site.currencySymbol}
            {fmt.format(t.price)}
          </span>
        </p>
        <p className={cn("mt-3 text-[0.8125rem] leading-relaxed", muted)}>{t.delivery}</p>
      </div>
      <p className={cn("mt-6 text-sm leading-relaxed", dark ? "text-ink-0/80" : "text-ink-700")}>{t.summary}</p>
      <div className="mt-8">
        <Link
          href="/#contact"
          className={cn(
            "inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-medium transition-colors",
            dark ? "bg-ink-0 text-ink-1000" : "bg-ink-1000 text-ink-0",
          )}
        >
          Enquire<span className="sr-only"> about {t.name}</span>
        </Link>
      </div>
      <div className="mt-8">
        {inherits ? <p className={cn("mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em]", muted)}>{inherits}, plus</p> : null}
        <ul className="grid gap-3">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-sm">
              <span aria-hidden="true" className={cn("mt-[0.6em] h-px w-3 shrink-0", dark ? "bg-ink-0/50" : "bg-ink-600")} />
              {it}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* C — SILVER EDGE. Flat black cards with a hairline silver border that
   brightens on hover; the featured tier is solid silver foil — the
   business card's own finish — with black type. */
export function PricingC() {
  return (
    <div>
      <Shared />
      <div className="mt-10 grid gap-4 lg:grid-cols-4 lg:grid-rows-[repeat(5,auto)] lg:gap-y-0">
        {projectTiers.map((t) => {
          const featured = Boolean(t.featured);
          return (
            <div
              key={t.id}
              className={cn(
                "group rounded-[1.5rem] p-px transition-[background] duration-500 lg:grid lg:grid-rows-subgrid",
                ROWS,
                featured
                  ? "bg-[linear-gradient(135deg,#fff,#b8b8b8_22%,#fff_44%,#d4d4d4_62%,#f2f2f2_82%,#a8a8a8)]"
                  : "bg-[linear-gradient(160deg,rgba(255,255,255,0.28),rgba(255,255,255,0.04)_45%,rgba(255,255,255,0.14))] hover:bg-[linear-gradient(160deg,rgba(255,255,255,0.6),rgba(255,255,255,0.08)_45%,rgba(255,255,255,0.3))]",
              )}
            >
              <article
                aria-label={t.name}
                className={cn(
                  "flex h-full flex-col rounded-[calc(1.5rem-1px)] p-8 lg:grid lg:grid-rows-subgrid lg:gap-0",
                  ROWS,
                  featured ? "bg-transparent text-ink-0" : "bg-ink-50 text-ink-1000",
                )}
              >
                <CardBody t={t} dark={featured} />
              </article>
            </div>
          );
        })}
      </div>
      <SmallPrint />
    </div>
  );
}

/* D — THE LEDGER. No boxes at all: one black plate split into four
   columns by vertical hairlines, like a printed price list. The featured
   column is marked by a silver bar across its head, not by colour. */
export function PricingD() {
  return (
    <div>
      <Shared />
      <div className="mt-10 grid overflow-hidden rounded-[1.75rem] bg-ink-50 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] lg:grid-cols-4 lg:grid-rows-[repeat(5,auto)]">
        {projectTiers.map((t, i) => (
          <article
            key={t.id}
            aria-label={t.name}
            className={cn(
              "relative flex flex-col p-8 text-ink-1000 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:p-9",
              ROWS,
              i > 0 && "border-t border-ink-300 lg:border-l lg:border-t-0",
              t.featured && "bg-[radial-gradient(120%_60%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]",
            )}
          >
            {t.featured ? (
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#a8a8a8,#fff,#b8b8b8,#f2f2f2)]" />
            ) : null}
            <CardBody t={t} dark={false} />
          </article>
        ))}
      </div>
      <SmallPrint />
    </div>
  );
}
