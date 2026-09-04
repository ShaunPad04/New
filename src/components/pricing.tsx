"use client";

import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { projectTiers, retainerTiers, site, type Tier } from "@/lib/content";
import { Cta } from "@/components/cta";
import { cn } from "@/lib/utils";

/**
 * PRICING
 *
 * The commercial section is the most scrutinised block on an agency site: it
 * is where a prospect decides whether we are the kind of studio they can hand
 * a brand to. So it is built to the same bar as the rest of the page rather
 * than as a utility table.
 *
 *  - Every card is a double-bezel object (outer tray, inner plate, concentric
 *    radii). Nothing sits flat on the background.
 *  - A pointer-tracked radial sheen follows the cursor across each card. It is
 *    written straight onto the element as custom properties, so a continuous
 *    pointer stream never re-renders React.
 *  - The two commercial models sit behind a segmented control with a sliding
 *    indicator — a transform, not a colour swap — kept as a real ARIA tablist
 *    so it is operable by keyboard and announced correctly.
 *  - Figures are set in tabular numerals so the three columns align optically.
 *  - A bespoke band sits under the grid for work that is above the published
 *    tiers. It quotes no number, because that work is scoped, not priced.
 *
 * Prices come from `content.ts` and are GBP excluding VAT. They remain flagged
 * `PRICING_CONFIRMED = false` there until the client signs them off.
 */

const formatter = new Intl.NumberFormat("en-GB");

const MODES = [
  { value: "project", label: "Website builds" },
  { value: "retainer", label: "Monthly plans" },
] as const;

type Mode = (typeof MODES)[number]["value"];

export function Pricing() {
  const [mode, setMode] = useState<Mode>("project");
  const panelId = useId();
  const tiers = mode === "project" ? projectTiers : retainerTiers;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[24ch]">
            <p className="eyebrow mb-6">Investment</p>
            <h2
              id="pricing-heading"
              className="display text-display-md text-ink-1000"
            >
              Priced openly.
            </h2>
          </div>

          <p className="lede max-w-[46ch] lg:pb-2">
            Fixed-price builds with no hourly billing, and monthly plans you can
            leave on 30 days&rsquo; notice. Every figure is a starting point —
            scope is confirmed in writing before anything begins.
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5">
          <ModeSwitch mode={mode} setMode={setMode} panelId={panelId} />
          <p className="field-label text-ink-600">
            {site.currencySymbol} GBP — excluding VAT
          </p>
        </div>

        <div
          id={`${panelId}-panel`}
          role="tabpanel"
          aria-labelledby={`${panelId}-tab-${mode}`}
          className="mt-12 grid gap-5 lg:grid-cols-3 lg:gap-6"
        >
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} />
          ))}
        </div>

        <BespokeBand />

        <p className="mt-10 max-w-[64ch] text-sm leading-relaxed text-ink-600">
          Website builds are payable 50% on commissioning and 50% on launch.
          Monthly plans are billed in advance with no minimum term beyond the
          first month. Nothing recurs without your written agreement.
        </p>
      </div>
    </section>
  );
}

/**
 * Segmented control. The indicator is one absolutely-positioned pane that
 * translates between the two halves, so switching reads as a single object
 * moving rather than two buttons changing colour.
 */
function ModeSwitch({
  mode,
  setMode,
  panelId,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  panelId: string;
}) {
  return (
    <div className="bezel !rounded-full !p-1.5">
      <div
        role="tablist"
        aria-label="Pricing type"
        className="relative grid grid-cols-2"
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-full bg-ink-1000",
            "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            mode === "retainer" && "translate-x-full"
          )}
        />
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            type="button"
            id={`${panelId}-tab-${value}`}
            aria-selected={mode === value}
            aria-controls={`${panelId}-panel`}
            onClick={() => setMode(value)}
            className={cn(
              "relative z-10 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium tracking-tight",
              "transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              mode === value ? "text-ink-0" : "text-ink-700 hover:text-ink-1000"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLDivElement>(null);
  const featured = Boolean(tier.featured);

  /**
   * Pointer position is written imperatively as custom properties. A cursor
   * move fires continuously; re-rendering React on each one would cost far
   * more than the effect is worth.
   */
  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
    el.style.setProperty("--po", "1");
  };
  const clear = () => ref.current?.style.setProperty("--po", "0");

  return (
    <div
      ref={ref}
      onPointerMove={track}
      onPointerLeave={clear}
      className={cn(
        "bezel group relative h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        featured && "bg-white/[0.07]"
      )}
    >
      <article
        className={cn(
          "relative flex h-full flex-col overflow-hidden p-8 lg:p-10",
          featured ? "bezel-core-invert" : "bezel-core"
        )}
      >
        {/* Decorative sheen, beneath the content and inert under reduced motion. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--po,0)] transition-opacity duration-500 motion-reduce:hidden"
          style={{
            background: featured
              ? "radial-gradient(320px circle at var(--px,50%) var(--py,50%), rgba(0,0,0,0.16), transparent 70%)"
              : "radial-gradient(320px circle at var(--px,50%) var(--py,50%), rgba(255,255,255,0.07), transparent 70%)",
          }}
        />

        <div className="relative flex flex-1 flex-col">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h3 className="display text-2xl leading-none">{tier.name}</h3>
              <p
                className={cn(
                  "field-label mt-3",
                  featured ? "!text-ink-0/75" : "text-ink-600"
                )}
              >
                {tier.meta}
              </p>
            </div>

            {featured ? (
              <span className="shrink-0 rounded-full border border-ink-0/25 bg-ink-0/10 px-3 py-1.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.2em]">
                Most chosen
              </span>
            ) : null}
          </header>

          <p
            className={cn(
              "mt-6 min-h-[3.25rem] max-w-[34ch] text-sm leading-relaxed",
              featured ? "text-ink-0/80" : "text-ink-700"
            )}
          >
            {tier.summary}
          </p>

          <p className="mt-8 flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-sm",
                featured ? "text-ink-0/75" : "text-ink-600"
              )}
            >
              from
            </span>
            <span className="display text-4xl tabular-nums lg:text-5xl">
              {site.currencySymbol}
              {formatter.format(tier.price)}
            </span>
            {tier.cadence === "month" ? (
              <span
                className={cn(
                  "text-sm",
                  featured ? "text-ink-0/75" : "text-ink-600"
                )}
              >
                /month
              </span>
            ) : null}
          </p>

          {/* Hairline separator, fading out rather than terminating hard. */}
          <span
            aria-hidden="true"
            className={cn(
              "mt-8 block h-px",
              featured
                ? "bg-gradient-to-r from-ink-0/25 to-transparent"
                : "bg-gradient-to-r from-white/15 to-transparent"
            )}
          />

          <ul className="mt-8 flex flex-1 flex-col gap-3.5">
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    featured
                      ? "bg-ink-0/10 text-ink-0"
                      : "bg-white/[0.08] text-ink-1000"
                  )}
                >
                  <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
                    <path
                      d="M3 8.4 6.2 11.6 13 4.8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span
                  className={cn(
                    "leading-relaxed",
                    featured ? "text-ink-0/85" : "text-ink-800"
                  )}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <Cta
            href="/#contact"
            variant={featured ? "invert" : "ghost"}
            className="mt-10 self-start"
          >
            <span>
              Enquire
              <span className="sr-only"> about the {tier.name} tier</span>
            </span>
          </Cta>
        </div>
      </article>
    </div>
  );
}

/**
 * Above the published tiers. Larger brands rarely buy from a card — they want
 * to know the studio will scope properly. Quoting no figure here is the
 * honest position and the more confident one.
 */
function BespokeBand() {
  return (
    <div className="bezel mt-6">
      <div className="bezel-core flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div>
          <p className="field-label text-ink-600">Above these tiers</p>
          <h3 className="display mt-4 max-w-[20ch] text-display-sm text-ink-1000">
            Bespoke engagements.
          </h3>
          <p className="mt-5 max-w-[58ch] text-sm leading-relaxed text-ink-700">
            Multi-market rollouts, product configurators, boutique and
            appointment-led retail, and brands where the site carries the whole
            reputation. Scoped and quoted on the work, never on a template.
          </p>
        </div>

        <Cta href="/#contact" className="shrink-0">
          Discuss a brief
        </Cta>
      </div>
    </div>
  );
}
