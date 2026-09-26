"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { projectTiers, projectTiersShared, retainerTiers, site, type Tier } from "@/lib/content";
import { cn } from "@/lib/utils";
import { BracketButton, Brackets, Plus, StripeLabel } from "@/components/nocta-ui";

/**
 * PRICING — Nocta's "flexible plans" (Brad chose pricing E, 2026-09-26).
 *
 * Four build tiers in one hairline-framed panel, each: name + Recommended
 * tag (Signature, `featured`), audience line, price, delivery window WITH
 * its content caveat, summary, an add-on switch, what's included, Start a
 * project. Every string is the one the site already carried, read from
 * content.ts; the payment / chatbot-fee small print is legally
 * load-bearing (CPUTR 2008 / DMCCA 2024) and stays at body size, in full.
 *
 * NB the "Most chosen" badge was removed on 2026-09-13; "Recommended" is
 * back on Brad's own choice of this design (2026-09-26). It recommends —
 * it does not claim what most clients buy.
 */

const fmt = new Intl.NumberFormat("en-GB");

/*
 * THE ADD-ON SWITCH, made honest. Nocta's "Add development" changes what
 * the plan is. Ours adds the Care plan — a real monthly plan with its own
 * price in `retainerTiers` — and shows it as a SEPARATE "+ £200/month"
 * line under the build price, never summed into it. A build is one-off; a
 * plan is monthly; adding them into one figure would misstate both.
 */
const care = retainerTiers.find((r) => r.id === "care") ?? retainerTiers[0];

function PlanCard({ t }: { t: Tier }) {
  const [on, setOn] = useState(false);
  const id = useId();
  const [first, ...rest] = t.includes;
  const inherits = first?.startsWith("Everything in ") ? first : null;
  const items = inherits ? rest : t.includes;
  const featured = Boolean(t.featured);

  return (
    <article
      aria-label={t.name}
      className={cn(
        "relative flex flex-col p-7 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:p-8",
        "lg:row-span-6",
        featured && "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))]",
      )}
    >
      {/* 1 — name, audience, (badge) */}
      <header>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.375rem] font-medium uppercase tracking-[-0.02em] text-ink-1000">{t.name}</h3>
          {featured ? (
            <span className="relative shrink-0 border border-ink-400 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink-1000">
              <Brackets />
              Recommended
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-ink-600">{t.meta}</p>
      </header>

      {/* 2 — price + delivery (+ the add-on line when switched on) */}
      <div className="mt-8">
        <p className="flex items-baseline gap-1.5 text-ink-1000">
          <span className="text-sm text-ink-600">from</span>
          <span className="text-[2.75rem] font-medium leading-none tracking-[-0.05em] tabular-nums">
            {site.currencySymbol}
            {fmt.format(t.price)}
          </span>
          <span className="text-sm text-ink-700">/per project</span>
        </p>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">{t.delivery}</p>
        <p
          aria-live="polite"
          className={cn(
            "overflow-hidden text-[0.8125rem] text-ink-900 transition-all duration-500",
            on ? "mt-3 max-h-16 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          {on ? (
            <>
              + {site.currencySymbol}
              {fmt.format(care.price)}/month · {care.name} plan — {care.summary.toLowerCase()}
            </>
          ) : null}
        </p>
      </div>

      {/* 3 — summary */}
      <p className="mt-6 text-sm leading-relaxed text-ink-700">{t.summary}</p>

      {/* 4 — the switch */}
      <div className="relative mt-7 flex min-h-12 items-center justify-between border border-ink-300 px-4">
        <Brackets />
        <label htmlFor={id} className="text-[0.9375rem] text-ink-900">
          Add a monthly {care.name} plan
        </label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn((v) => !v)}
          className="relative flex h-11 w-11 items-center justify-center"
        >
          <span className="relative flex h-6 w-6 items-center justify-center border border-ink-500">
            <span className={cn("h-3.5 w-3.5 transition-colors", on ? "bg-ink-1000" : "bg-ink-300")} />
          </span>
        </button>
      </div>

      {/* 5 — what's included */}
      <div className="mt-8">
        <p className="text-[0.9375rem] font-medium uppercase tracking-[-0.01em] text-ink-1000">
          {inherits ? `${inherits}, plus` : "What's included"}
        </p>
        <ul className="mt-4 grid gap-3">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-900">
              <Plus className="mt-px text-ink-700" />
              {it}
            </li>
          ))}
        </ul>
      </div>

      {/* 6 — action */}
      <div className="mt-8 lg:self-end">
        <BracketButton href="/#contact" strong={featured}>
          Start a project<span className="sr-only"> — {t.name}</span>
        </BracketButton>
      </div>
    </article>
  );
}

export function PricingPlans() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="scroll-mt-24 bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-8 lg:py-32">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StripeLabel>Pricing</StripeLabel>
          <h2 id="pricing-heading" className="display mt-5 text-[clamp(2.75rem,6vw,5rem)] leading-[0.88] text-ink-1000">Priced openly.</h2>
        </div>
        <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-700">
          Fixed-price builds, agreed in writing before anything starts.
          Monthly plans and AI systems are on the pricing page.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-y border-ink-300 py-5 lg:flex-row lg:items-center lg:gap-10">
        <p className="shrink-0 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-600">Every build includes</p>
        <ul className="flex flex-col gap-2.5 lg:grid lg:flex-1 lg:grid-cols-3 lg:gap-x-8">
          {projectTiersShared.map((i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-900">
              <Plus className="text-ink-700" />
              {i}
            </li>
          ))}
        </ul>
        <p className="shrink-0 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-600 lg:ml-auto">
          {site.currencySymbol} GBP — no VAT charged
        </p>
      </div>

      <div className="relative mt-10 grid border border-ink-300 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(6,auto)] [&>article+article]:border-t [&>article+article]:border-ink-300 md:[&>article:nth-child(even)]:border-l lg:[&>article+article]:border-l lg:[&>article+article]:border-t-0">
        <Brackets />
        {projectTiers.map((t) => (
          <PlanCard key={t.id} t={t} />
        ))}
      </div>

      <p className="mt-10 max-w-[64ch] text-sm leading-relaxed text-ink-600">
        50% on commissioning, 50% on launch. Where a tier includes AI Text
        Chatbot setup, the chatbot&rsquo;s monthly fee still applies — it is
        listed with the monthly plans on the pricing page.
      </p>
      <Link href="/pricing" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.04em] text-ink-1000 underline-offset-4 hover:underline">
        Monthly plans &amp; AI systems ↗
      </Link>
      </div>
    </section>
  );
}
