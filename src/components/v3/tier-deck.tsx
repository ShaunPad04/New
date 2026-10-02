import { retainerTiers, site, type Tier } from "@/lib/content";
import { Rich } from "@/components/rich";
import { TierExtras } from "@/components/tier-extras";
import { AddOnSwitch } from "./add-on-switch";
import { HeroCta } from "./hero-cta";
import { LABEL } from "./page-grid";

const fmt = new Intl.NumberFormat("en-GB");

/*
 * Each build's matching monthly plan (Brad, 2026-09-26): Essential → Care,
 * Signature → Growth, Commerce → Scale, Flagship → Partner, read from
 * `retainerTiers`. Partner's line says the ad spend is billed by the
 * platforms, or "+ £1,750/month … the campaigns themselves" would read as if
 * the ad budget were included.
 */
const PLAN_FOR: Record<string, string> = { essential: "care", signature: "growth", commerce: "scale", flagship: "partner" };
const CAVEAT: Record<string, string> = { partner: " Ad spend is billed by the platforms, not by us." };

/** Column rules: stacked on phones, two up from md, all in a row from lg. */
function edges(i: number, n: number) {
  return [
    "border-b border-ink-300 lg:border-b-0",
    i % 2 ? "md:border-l md:pl-6" : "md:pr-6",
    i ? "lg:border-l lg:pl-6" : "lg:border-l-0 lg:pl-0",
    i < n - 1 ? "lg:pr-6" : "lg:pr-0",
  ].join(" ");
}

/**
 * A set of plans in the inner pages' system (2026-10-02): hairline columns on
 * the hero's grid, not boxed cards. Every tier reads the same six rows (name,
 * price + delivery, add-on, summary, what's included, the bar) and from lg
 * they are subgrid rows, so prices, switches and buttons line up across the
 * set. The wording is the tier data's, unchanged: the delivery line keeps
 * "once we have your content", "from" marks a floor, Flagship keeps its
 * priced-on-top extras and note. Server-rendered; only the switch is a
 * client island.
 */
export function TierDeck({ tiers, onDark = false }: { tiers: Tier[]; onDark?: boolean }) {
  return (
    <div className={`grid border-t border-ink-1000 md:grid-cols-2 lg:grid-rows-[repeat(6,auto)] ${tiers.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
      {tiers.map((t, i) => {
        const [first, ...rest] = t.includes;
        const legacy = first?.startsWith("Everything in ") ? `${first}, plus` : null;
        const items = legacy ? rest : t.includes;
        const plan = t.id in PLAN_FOR ? retainerTiers.find((r) => r.id === PLAN_FOR[t.id]) : undefined;
        return (
          <article
            key={t.id}
            aria-label={t.name}
            className={`flex flex-col py-8 lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:py-10 ${edges(i, tiers.length)} ${t.featured ? "bg-ink-1000/[0.035]" : ""}`}
          >
            <header className={t.featured ? "lg:px-1" : ""}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[1.375rem] font-semibold uppercase leading-none tracking-[-0.03em] text-ink-1000">{t.name}</h3>
                {t.featured ? (
                  <span className="flex shrink-0 items-center gap-1.5 border border-ink-1000 px-2 py-1 text-[0.625rem] font-bold uppercase tracking-[0.06em] text-ink-1000">
                    <span aria-hidden="true" className="size-1.5 bg-accent" />
                    Recommended
                  </span>
                ) : null}
              </div>
              {t.meta ? <p className="mt-2 text-[0.875rem] text-ink-700">{t.meta}</p> : null}
            </header>

            <div className="mt-7">
              <p className="flex flex-wrap items-baseline gap-x-1.5 text-ink-1000">
                {t.from ? <span className="text-[0.875rem] text-ink-700">from</span> : null}
                <span className="display text-[clamp(2.5rem,3.1vw,3.25rem)] normal-case! leading-none">
                  {site.currencySymbol}
                  {fmt.format(t.price)}
                </span>
                <span className="text-[0.875rem] text-ink-700">{t.cadence === "month" ? "/month" : "/project"}</span>
              </p>
              {t.delivery ? <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-700">{t.delivery}</p> : null}
            </div>

            {plan ? (
              <AddOnSwitch
                plan={plan.name}
                line={`+ ${site.currencySymbol}${fmt.format(plan.price)}/month · ${plan.name} plan — ${plan.summary}${CAVEAT[plan.id] ?? ""}`}
              />
            ) : (
              <span aria-hidden="true" className="hidden lg:block" />
            )}

            {t.summary ? <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-800">{t.summary}</p> : <span aria-hidden="true" className="hidden lg:block" />}

            <div className="mt-7">
              <p className={`${LABEL} text-ink-700`}>{t.includesLead ?? legacy ?? "What's included"}</p>
              <ul className="mt-4 grid gap-2.5">
                {items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-900">
                    <span aria-hidden="true" className="text-ink-600">
                      +
                    </span>
                    <span>
                      <Rich text={it} />
                    </span>
                  </li>
                ))}
              </ul>
              <TierExtras tier={t} muted="text-ink-700" />
            </div>

            <div className="mt-8 lg:self-end">
              <HeroCta light={onDark} sr={t.name} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
