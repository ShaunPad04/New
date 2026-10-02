import Link from "next/link";
import { projectTiers, site } from "@/lib/content";

/**
 * The homepage's pricing, as ONE line (Brad, 2026-10-02: "a clean
 * portfolio, not too much writing"). The cards live on /pricing. The figure
 * is the lowest build tier, read from `projectTiers`, so it cannot drift;
 * "from" is true because every other tier costs more. The line under it is
 * the Why us card's own words. No other promise is made here.
 */
export function PricingLine({ index }: { index: string }) {
  const from = Math.min(...projectTiers.map((t) => t.price));
  return (
    <section aria-labelledby="pricing-line-heading" className="relative mx-auto w-full max-w-[1600px] px-6 py-16 sm:px-8 lg:py-24">
      <p className="text-[0.75rem] font-bold uppercase tracking-[-0.02em] text-ink-700">
        [ <span className="text-accent">{index}</span> — Pricing ]
      </p>
      <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:items-end">
        <h2
          id="pricing-line-heading"
          className="font-[family-name:var(--font-cal-ui)] text-[clamp(2.5rem,6vw,6rem)] lowercase leading-[0.95] tracking-[-0.025em] [word-spacing:0.12em] lg:col-span-2"
        >
          websites from {site.currencySymbol}
          {from.toLocaleString("en-GB")}.
          <span className="block text-ink-600">fixed price, agreed in writing.</span>
        </h2>
        <Link
          href="/pricing"
          className="group flex h-[60px] items-center justify-between bg-ink-1000 px-5 text-[0.75rem] font-bold uppercase tracking-[-0.02em] text-ink-0 transition-colors duration-300 hover:bg-accent hover:text-white"
        >
          See pricing
          <span aria-hidden="true" className="text-lg transition-transform duration-500 group-hover:rotate-180">
            +
          </span>
        </Link>
      </div>
    </section>
  );
}
