import Link from "next/link";
import { projectTiers, rateCard, retainerTiers, site } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { HeroCta } from "./hero-cta";
import { SectionRule } from "./lurais-parts";
import { H2 } from "./page-grid";
import { Recommended } from "./package-deck";

const fmt = new Intl.NumberFormat("en-GB");

/**
 * The homepage's pricing as a price list on black (Brad, 2026-10-04: "why
 * does this look so terrible on the home page?" about the light-band rate
 * card of 2026-10-03: white, like the /pricing he had just turned down; the
 * band's column rules boxed the rows into a table and crossed the intro; most
 * of every row was empty; the closing line was squeezed into tiny caps). Each
 * build is a row built like the services list above it: index, the name in
 * caps with who it is for and how soon it is live beneath, the price, the
 * turning arrow. Every figure and line is read from the data /pricing
 * renders, so the two cannot disagree, and the delivery line is shown whole:
 * "once we have your content" is what makes the window keepable.
 */
export function PricingLine({ index }: { index: string }) {
  const s = rateCard.sections.builds;
  const monthly = Math.min(...retainerTiers.map((t) => t.price));
  return (
    <section aria-labelledby="pricing-line-heading" className="bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index={index} label="Pricing" />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <h2 id="pricing-line-heading" className={H2}>
            {s.heading}
          </h2>
          <p className="max-w-[44ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{s.lede}</p>
        </div>

        <ol className="mt-14 border-t border-ink-300 lg:mt-20">
          {projectTiers.map((t, i) => (
            <li key={t.id} className="border-b border-ink-300">
              <Reveal variant="slide">
                {/* Phones: number, name and price on one line, who and when
                    under them. From lg the name block is one cell and the
                    arrow joins the end of the row; the number sits on the
                    name's baseline, the price and arrow on the row's middle. */}
                <Link
                  href="/pricing#builds"
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-4 gap-y-2 py-6 transition-colors duration-300 hover:bg-ink-1000/[0.035] lg:grid-cols-[4rem_1fr_auto_auto] lg:gap-x-10 lg:py-8"
                >
                  <span className="row-start-1 font-[family-name:var(--font-cal-ui)] text-[1.25rem] leading-none tabular-nums text-accent lg:text-[1.75rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="contents lg:block">
                    <span className="col-start-2 row-start-1 flex items-center gap-4">
                      <span className="text-[clamp(1.375rem,3.4vw,3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] text-ink-1000">{t.name}</span>
                      {t.featured ? <Recommended className="hidden lg:flex" /> : null}
                    </span>
                    <span className="col-span-2 col-start-2 row-start-2 block lg:mt-3">
                      {t.featured ? <Recommended className="mb-3 inline-flex lg:hidden" /> : null}
                      <span className="block text-[0.9375rem] leading-snug text-ink-800">{t.meta}</span>
                      <span className="mt-1 block text-[0.8125rem] leading-snug text-ink-600">{t.delivery}</span>
                    </span>
                  </span>
                  <span className="col-start-3 row-start-1 inline-flex items-baseline justify-end gap-1.5 text-ink-1000 lg:self-center">
                    {t.from ? <span className="text-[0.875rem] text-ink-700">from</span> : null}
                    <span className="display text-[clamp(1.75rem,3.4vw,3.5rem)] leading-none">
                      {site.currencySymbol}
                      {fmt.format(t.price)}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="hidden size-14 place-items-center self-center rounded-full border border-ink-500 text-ink-1000 transition-[transform,background-color,color,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-rotate-45 group-hover:border-ink-1000 group-hover:bg-ink-1000 group-hover:text-ink-0 lg:grid"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <p className="text-[0.9375rem] leading-relaxed text-ink-700">
            {site.currencySymbol} GBP — no VAT charged · Monthly plans from {site.currencySymbol}
            {fmt.format(monthly)}/month · Bespoke {s.bespoke.price}
          </p>
          <div className="lg:w-[24rem] lg:shrink-0">
            <HeroCta light label="See full pricing" href="/pricing" />
          </div>
        </div>
      </div>
    </section>
  );
}
