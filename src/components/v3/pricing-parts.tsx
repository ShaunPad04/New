import Link from "next/link";
import type { ReactNode } from "react";
import { aiSystems, buildStandardsBand, creativeService, projectTiers, projectTiersShared, rateCard, retainerTiers, site, type Tier } from "@/lib/content";
import { H2, LABEL, SectionLabel } from "./page-grid";

/**
 * /pricing in the inner pages' system (2026-10-02). The rate card's order and
 * every load-bearing line are kept from the 2026-09-25 restructure (see the
 * comment at the top of components/rate-card.tsx); only the presentation
 * moves to the homepage's grid, light bands and type. Nothing here types a
 * figure: every number is read from `projectTiers`, `retainerTiers`,
 * `aiSystems`, `rateCard` and `creativeService.pricing`.
 */

const gbp = (n: number) => `${site.currencySymbol}${n.toLocaleString("en-GB")}`;

/** Creative plans in the tier shape, so they render in the same deck. */
export const creativePlans: Tier[] = creativeService.pricing.plans.map((plan) => ({
  id: plan.id,
  name: plan.name,
  price: plan.price,
  cadence: "month",
  meta: plan.meta,
  summary: "",
  includes: [...plan.includes],
  featured: plan.featured,
}));

/** Cheapest single piece on the creative rate card ("£60"), not a "from" row. */
function cheapestPiece(): string | null {
  const figures = creativeService.pricing.groups
    .flatMap((g) => g.rows.map((r) => r.price as string))
    .filter((p) => /^£[\d,]+$/.test(p))
    .map((p) => Number(p.replace(/[£,]/g, "")));
  return figures.length ? gbp(Math.min(...figures)) : null;
}

/**
 * At a glance, in the page top's third column: every band with a figure that
 * is true on its own, linking down to it. The AI row quotes no figure on
 * purpose (two-part pricing; see the comment on `rateCard`).
 */
export function RateGlance() {
  const s = rateCard.sections;
  const piece = cheapestPiece();
  const rows = [
    { ...s.builds, figure: `from ${gbp(Math.min(...projectTiers.map((t) => t.price)))}` },
    { ...s.plans, figure: `from ${gbp(Math.min(...retainerTiers.map((t) => t.price)))}/month` },
    { ...s.ai, figure: s.ai.glance },
    { ...s.bookings, figure: `from ${s.bookings.rows[0].price}` },
    { ...s.crm, figure: `from ${s.crm.rows[0].price.replace(" setup", "")}` },
    { ...s.creative, figure: piece ? `from ${piece}` : "See rates" },
  ];
  return (
    <div>
      <p className={`${LABEL} text-ink-600`}>{rateCard.indexLabel}</p>
      <ol className="mt-2">
        {rows.map((r) => (
          <li key={r.id}>
            <a href={`#${r.id}`} className="flex min-h-11 items-center justify-between gap-4 border-b border-white/12 text-ink-700 transition-colors hover:text-ink-1000">
              <span className={LABEL}>{r.label}</span>
              <span className="text-[0.9375rem] font-medium tabular-nums tracking-[-0.02em] text-ink-1000">{r.figure}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** One band: its section element, the label in column one, heading + lede across two. */
export function Band({
  section,
  children,
}: {
  section: { id: string; index: string; label: string; heading: string; lede: string };
  children: ReactNode;
}) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-heading`} className="relative z-[2] scroll-mt-24 py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-0">
        <SectionLabel index={section.index} label={section.label} className="lg:pr-10" />
        <div className="lg:col-span-2 lg:pl-3">
          <h2 id={`${section.id}-heading`} className={H2}>
            {section.heading}
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{section.lede}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

/** A small caps note on the grid, e.g. "£ GBP per month — no VAT charged". */
export function GridNote({ children }: { children: ReactNode }) {
  return <p className={`mt-12 ${LABEL} text-ink-700 lg:mt-16`}>{children}</p>;
}

/** What every build includes, said once above the tiers (2026-09-25). */
export function SharedLine() {
  return (
    <div className="mt-12 grid gap-4 border-y border-ink-300 py-5 lg:mt-16 lg:grid-cols-3 lg:gap-0">
      <p className={`${LABEL} text-ink-700 lg:pr-10`}>
        {rateCard.sections.builds.sharedLabel}
        <span className="mt-1 block text-ink-600">{site.currencySymbol} GBP — no VAT charged</span>
      </p>
      <ul className="grid gap-2.5 lg:col-span-2 lg:grid-cols-3 lg:gap-x-6 lg:pl-3">
        {projectTiersShared.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-ink-900">
            <span aria-hidden="true" className="text-accent">
              +
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Above the published tiers: scoped work quotes no fixed figure beyond its floor. */
export function BespokeRow() {
  const b = rateCard.sections.builds.bespoke;
  return (
    <div className="mt-12 grid gap-6 border-y border-ink-1000 py-8 lg:grid-cols-3 lg:gap-0 lg:py-10">
      <div className="lg:pr-10">
        <p className={`${LABEL} text-ink-700`}>{b.label}</p>
        <p className="display mt-3 text-[clamp(2rem,2.8vw,2.75rem)] normal-case! leading-none text-ink-1000">{b.price}</p>
      </div>
      <div className="grid content-start gap-3 text-[0.9375rem] leading-relaxed text-ink-800 lg:pl-3 lg:pr-10">
        <p>
          <strong className="font-semibold text-ink-1000">{b.lead}</strong> {b.body}
        </p>
        <p>{b.discovery}</p>
      </div>
      <div className="grid content-between gap-6 lg:pl-3">
        <p className="text-[0.9375rem] leading-relaxed text-ink-800">
          <strong className="font-semibold text-ink-1000">{b.rankingLead}</strong> {b.ranking}
        </p>
        <Link href="/#contact" className={`group inline-flex min-h-11 items-center gap-2 text-ink-1000 transition-colors hover:text-accent ${LABEL}`}>
          Discuss a brief
          <span aria-hidden="true" className="text-base transition-transform duration-500 group-hover:rotate-180">
            +
          </span>
        </Link>
      </div>
    </div>
  );
}

/**
 * The guarantee and how it is met, directly under the tiers (client,
 * 2026-09-13: the figure raises "is that justified", and this answers it).
 * Its conditions are stated in full here, at body size.
 */
export function Guarantee() {
  const g = buildStandardsBand;
  return (
    <div className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-3 lg:gap-0">
      <h3 className={`${LABEL} text-ink-700 lg:pr-10`}>{g.eyebrow}</h3>
      {g.blocks.map((b, i) => (
        <div key={b.id} className={`border-t border-ink-300 pt-6 ${i ? "lg:pl-10" : "lg:pl-3 lg:pr-10"}`}>
          <p className={`${LABEL} text-ink-600`}>{b.label}</p>
          <h4 className="display mt-4 text-[clamp(1.75rem,2.4vw,2.25rem)] normal-case! leading-[1.05] text-ink-1000">{b.heading}</h4>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-800">{b.body}</p>
          {"note" in b && b.note ? <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-700">{b.note}</p> : null}
        </div>
      ))}
    </div>
  );
}

/**
 * Every line-item price: the name and its condition, the figure at the right,
 * a hairline between. The condition sits beside its figure, never in a
 * footnote. `normal-case!`: `.display` is unlayered and would uppercase
 * "£59/month".
 */
export function RateRows({ rows }: { rows: { label: string; value: string; detail?: string }[] }) {
  return (
    <ul className="border-t border-ink-1000">
      {rows.map((r) => (
        <li key={r.label} className="grid items-baseline gap-x-6 gap-y-1.5 border-b border-ink-300 py-4 sm:grid-cols-[1fr_auto]">
          <span className="text-[0.9375rem] leading-snug text-ink-1000">{r.label}</span>
          <span className="display text-[1.125rem] normal-case! tracking-tight text-ink-1000 sm:text-right">{r.value}</span>
          {r.detail ? <span className="max-w-[60ch] text-[0.8125rem] leading-relaxed text-ink-700 sm:col-span-2">{r.detail}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/** The AI systems: what each is (column two), its priced lines (column three). */
export function AiRates() {
  return (
    <div className="mt-12 lg:mt-16">
      {aiSystems.map((system) => (
        <div key={system.id} className="grid gap-6 border-t border-ink-300 py-10 first:border-t-0 first:pt-0 lg:grid-cols-3 lg:gap-0">
          <div className="lg:col-start-2 lg:pl-3 lg:pr-10">
            <h3 className="text-[1.375rem] font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-ink-1000">{system.title}</h3>
            <p className="mt-4 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-800">{system.summary}</p>
          </div>
          <div className="lg:pl-3">
            <RateRows rows={system.lines.map((l) => ({ label: l.label, value: l.value, detail: l.detail }))} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Bookings or CRM: a ruled list across the band's content columns. */
export function LineItems({ rows }: { rows: readonly { name: string; price: string; detail?: string }[] }) {
  return (
    <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-3">
      <div className="lg:col-span-2 lg:col-start-2 lg:pl-3">
        <RateRows rows={rows.map((r) => ({ label: r.name, value: r.price, detail: r.detail }))} />
      </div>
    </div>
  );
}

/**
 * One-off creative: the three groups on the three columns. The aerial group's
 * label and note carry the AI-generated disclosure at the price and are
 * rendered verbatim (see `creativeService`).
 */
export function CreativeRates() {
  const { pricing } = creativeService;
  const s = rateCard.sections.creative;
  return (
    <div className="mt-16 lg:mt-20">
      <h3 className={`${LABEL} text-ink-700`}>{s.oneOffLabel}</h3>
      <div className="mt-6 grid gap-12 lg:grid-cols-3 lg:gap-0">
        {pricing.groups.map((group, i) => (
          <div key={group.label} className={i === 0 ? "lg:pr-10" : i === 1 ? "lg:pl-3 lg:pr-10" : "lg:pl-3"}>
            <h4 className={`${LABEL} mb-3 text-ink-600`}>{group.label}</h4>
            <RateRows rows={group.rows.map((r) => ({ label: r.name, value: r.price, detail: "detail" in r ? r.detail : undefined }))} />
            <p className="mt-4 max-w-[44ch] text-[0.8125rem] leading-relaxed text-ink-700">{group.note}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
        <Link href={creativeService.ctas.primary.href} className={`group inline-flex min-h-11 items-center gap-2 text-ink-1000 transition-colors hover:text-accent ${LABEL}`}>
          {creativeService.ctas.primary.label}
          <span aria-hidden="true" className="text-base transition-transform duration-500 group-hover:rotate-180">
            +
          </span>
        </Link>
        <Link href={s.moreHref} className={`group inline-flex min-h-11 items-center gap-2 text-ink-700 transition-colors hover:text-ink-1000 ${LABEL}`}>
          {s.moreLabel} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/**
 * The terms, together, at body size and never collapsed: the ownership line
 * is a copyright assignment and the revision line sets a charge, and neither
 * counts if it needs a click to read.
 */
export function SmallPrint({ index }: { index: string }) {
  const { pricing } = creativeService;
  const terms: { label: string; lead?: string; body: string }[] = [
    { label: "Payment", body: rateCard.smallPrint.payment },
    { label: "Revisions", body: rateCard.smallPrint.revisions },
    { label: "Monthly plans", body: rateCard.smallPrint.planTerms.join(" ") },
    { label: "Referrals", body: rateCard.smallPrint.referral },
    { label: "VAT", body: rateCard.smallPrint.vat },
    { label: `Creative ${pricing.turnaround.label.toLowerCase()}`, lead: pricing.turnaround.lead, body: pricing.turnaround.body },
    { label: `Creative ${pricing.ownership.label.toLowerCase()}`, lead: pricing.ownership.lead, body: pricing.ownership.body },
    { label: "Creative revisions", body: pricing.footnote },
  ];
  return (
    <section id={rateCard.smallPrint.id} aria-labelledby="terms-heading" className="relative z-[2] scroll-mt-24 py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-0">
        <SectionLabel index={index} label="Terms" className="lg:pr-10" />
        <h2 id="terms-heading" className={`${H2} lg:col-span-2 lg:pl-3`}>
          {rateCard.smallPrint.heading}
        </h2>
      </div>
      <dl className="mt-12 border-t border-ink-1000 lg:mt-16">
        {terms.map((term) => (
          <div key={term.label} className="grid gap-2 border-b border-ink-300 py-6 lg:grid-cols-3 lg:gap-0">
            <dt className={`${LABEL} text-ink-700 lg:pr-10 lg:pt-1`}>{term.label}</dt>
            <dd className="m-0 max-w-[72ch] text-[0.9375rem] leading-relaxed text-ink-800 lg:col-span-2 lg:pl-3">
              {term.lead ? <strong className="font-semibold text-ink-1000">{term.lead} </strong> : null}
              {term.body}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
