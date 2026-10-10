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
      {/* Two-rail composition from the client's reference: the section word,
          its sub-line, the model toggle and the bespoke note all stack down a
          narrow left rail, and the cards take the width that is left. */}
      <div className="mx-auto grid w-full max-w-[1600px] gap-14 px-6 py-24 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-16 lg:py-32">
        <div className="lg:col-span-4 lg:flex lg:flex-col lg:justify-between">
          <div>
            <h2 id="pricing-heading" className="section-word text-ink-1000">
              Pricing
            </h2>
            <p className="mt-6 max-w-[34ch] leading-relaxed text-ink-800">
              Fixed-price builds with no hourly billing, and monthly plans you
              can leave with 30 days&rsquo; notice. Every figure is a starting
              point — we confirm scope in writing before anything begins.
            </p>
          </div>

          {/* Bespoke rail, as in the reference. */}
          <div className="mt-14 border-t border-ink-300 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="display-soft text-xl text-ink-1000">Bespoke</p>
                <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-ink-700">
                  For scopes that do not fit a tier — integrations, migrations,
                  multi-site estates.
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex min-h-[2.75rem] items-center rounded-full border border-white/15 bg-white/[0.03] px-6 text-xs font-medium uppercase tracking-[0.16em] text-ink-1000 transition-colors duration-500 hover:border-white/30"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
        {/* Tablist for the two commercial models. */}
        <div
          role="tablist"
          aria-label="Pricing type"
          className="inline-flex rounded-full border border-ink-300 p-1"
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
          className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
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
      </div>
    </section>
  );
}
