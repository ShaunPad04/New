"use client";

import { useId, useState } from "react";
import { projectTiers, retainerTiers, site, type Tier } from "@/lib/content";
import { cn } from "@/lib/utils";

const formatter = new Intl.NumberFormat("en-GB");

function TierCard({ tier }: { tier: Tier }) {
  return (
    /* Double-bezel: an outer tray holding an inner plate, with concentric
       radii. Nothing premium sits flat on the background. */
    <article
      className={cn(
        "bezel h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1",
        tier.featured && "bg-white/[0.07]"
      )}
    >
    <div
      className={cn(
        "flex h-full flex-col justify-between p-8 lg:p-10",
        tier.featured ? "bezel-core-invert" : "bezel-core"
      )}
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="display text-2xl">{tier.name}</h3>
          {tier.featured ? (
            <span className="rounded-full border border-ink-0/30 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.18em]">
              Most chosen
            </span>
          ) : null}
        </div>

        <p
          className={cn(
            "mt-3 text-sm leading-relaxed",
            tier.featured ? "text-ink-0/70" : "text-ink-700"
          )}
        >
          {tier.summary}
        </p>

        <p className="mt-8 flex items-baseline gap-1.5">
          <span
            className={cn(
              "text-sm",
              tier.featured ? "text-ink-0/60" : "text-ink-600"
            )}
          >
            from
          </span>
          <span className="display text-4xl lg:text-5xl">
            {site.currencySymbol}
            {formatter.format(tier.price)}
          </span>
          <span
            className={cn(
              "text-sm",
              tier.featured ? "text-ink-0/60" : "text-ink-600"
            )}
          >
            {tier.cadence === "month" ? "/month" : ""}
          </span>
        </p>

        <ul className="mt-9 space-y-3">
          {tier.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-2 block h-px w-3 shrink-0",
                  tier.featured ? "bg-ink-0/40" : "bg-ink-500"
                )}
              />
              <span className={tier.featured ? "text-ink-0/85" : "text-ink-800"}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#contact"
        className={cn(
          "group mt-10 inline-flex min-h-[3.25rem] items-center gap-3 self-start rounded-full py-2 pl-6 pr-2 text-sm font-medium tracking-tight",
          "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]",
          tier.featured
            ? "bg-ink-0 text-ink-1000"
            : "border border-white/15 bg-white/[0.03] text-ink-1000 hover:border-white/30"
        )}
      >
        Enquire about {tier.name}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base",
            "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105",
            tier.featured ? "bg-ink-1000/10" : "bg-white/10"
          )}
        >
          ↗
        </span>
      </a>
    </div>
    </article>
  );
}

export function Pricing() {
  const [mode, setMode] = useState<"project" | "retainer">("project");
  const panelId = useId();
  const tiers = mode === "project" ? projectTiers : retainerTiers;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="max-w-[52ch]">
          <p className="eyebrow mb-6">Investment</p>
          <h2
            id="pricing-heading"
            className="display text-display-md text-ink-1000"
          >
            Priced openly, so you can decide before you call.
          </h2>
          <p className="lede mt-6">
            Fixed-price builds with no hourly billing, and monthly plans you can
            leave with 30 days&rsquo; notice. Every figure below is a starting
            point — we confirm scope in writing before anything begins.
          </p>
        </div>

        {/* Tablist for the two commercial models. */}
        <div
          role="tablist"
          aria-label="Pricing type"
          className="mt-14 inline-flex rounded-full border border-ink-300 p-1"
        >
          {(
            [
              ["project", "Website builds"],
              ["retainer", "Monthly plans"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              type="button"
              id={`${panelId}-tab-${value}`}
              aria-selected={mode === value}
              aria-controls={`${panelId}-panel`}
              onClick={() => setMode(value)}
              className={cn(
                "rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-300",
                mode === value
                  ? "bg-ink-1000 text-ink-0"
                  : "text-ink-700 hover:text-ink-1000"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          id={`${panelId}-panel`}
          role="tabpanel"
          aria-labelledby={`${panelId}-tab-${mode}`}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>

        <p className="mt-10 max-w-[60ch] text-sm text-ink-600">
          All prices exclude VAT. Website builds are payable 50% on
          commissioning and 50% on launch. Monthly plans are billed in advance
          and require no minimum term beyond the first month.
        </p>
      </div>
    </section>
  );
}
