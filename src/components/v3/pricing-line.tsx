import Link from "next/link";
import { projectTiers, rateCard, retainerTiers, site } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { HeroCta } from "./hero-cta";
import { H2, LABEL, SectionLabel } from "./page-grid";
import { Recommended } from "./package-deck";

const fmt = new Intl.NumberFormat("en-GB");

/**
 * The homepage's pricing as a rate card (Brad, 2026-10-03, option A of two
 * previewed at /lab/pricing-line; the one-line version before it spent a
 * whole screen on one sentence). One ruled row per build on the hero's three
 * columns: number and name | who it is for and how soon it is live | the
 * price. Then the monthly and bespoke floors and the bar to /pricing. Every
 * figure and line is read from the data /pricing renders, so the two cannot
 * disagree, and the delivery line is shown whole: "once we have your
 * content" is what makes the window keepable. The light band around it
 * supplies the column rules (page.tsx).
 */
export function PricingLine({ index }: { index: string }) {
  const s = rateCard.sections.builds;
  const monthly = Math.min(...retainerTiers.map((t) => t.price));
  return (
    <section aria-labelledby="pricing-line-heading" className="relative z-[2] py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-0">
        <SectionLabel index={index} label="Pricing" className="lg:pr-10" />
        <div className="lg:col-span-2 lg:pl-3">
          <h2 id="pricing-line-heading" className={H2}>
            {s.heading}
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{s.lede}</p>
        </div>
      </div>

      <ol className="mt-12 border-t border-ink-1000 lg:mt-16">
        {projectTiers.map((t, i) => (
          <li key={t.id} className="border-b border-ink-300">
            <Reveal variant="slide">
              {/* Phones: name and price on one line, the rest under them. */}
              <Link
                href="/pricing#builds"
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-3 py-6 transition-colors duration-200 hover:bg-ink-1000/[0.035] lg:grid-cols-3 lg:items-center lg:gap-0 lg:py-8"
              >
                <span className="flex items-baseline gap-4 lg:pl-1 lg:pr-10">
                  <span className="font-[family-name:var(--font-cal-ui)] text-[1.25rem] leading-none tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[clamp(1.375rem,2.1vw,2rem)] font-semibold uppercase leading-none tracking-[-0.045em] text-ink-1000">{t.name}</span>
                  {t.featured ? <Recommended className="hidden self-center lg:flex" /> : null}
                </span>
                <span className="col-span-2 row-start-2 lg:col-span-1 lg:row-start-auto lg:pl-3 lg:pr-6">
                  {t.featured ? <Recommended className="mb-3 inline-flex lg:hidden" /> : null}
                  <span className="block text-[0.9375rem] leading-snug text-ink-900">{t.meta}</span>
                  <span className="mt-1 block text-[0.8125rem] leading-snug text-ink-700">{t.delivery}</span>
                </span>
                <span className="col-start-2 row-start-1 flex items-baseline justify-end gap-4 lg:col-start-3 lg:row-start-auto lg:pr-1">
                  <span className="inline-flex items-baseline gap-1.5 text-ink-1000">
                    {t.from ? <span className="text-[0.875rem] text-ink-700">from</span> : null}
                    <span className="display text-[clamp(1.75rem,3.4vw,3.5rem)] leading-none">
                      {site.currencySymbol}
                      {fmt.format(t.price)}
                    </span>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="hidden size-4 self-center text-ink-1000 transition-transform duration-500 group-hover:rotate-180 sm:block">
                    <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-3 lg:items-center lg:gap-0">
        <p className={`${LABEL} leading-relaxed text-ink-700 lg:col-span-2 lg:pr-10`}>
          {site.currencySymbol} GBP — no VAT charged · Monthly plans from {site.currencySymbol}
          {fmt.format(monthly)}/month · Bespoke {s.bespoke.price}
        </p>
        <HeroCta label="See full pricing" href="/pricing" className="lg:col-start-3" />
      </div>
    </section>
  );
}
