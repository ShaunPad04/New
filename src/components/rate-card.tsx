import Link from "next/link";
import type { ReactNode } from "react";
import {
  aiSystems,
  creativeService,
  projectTiers,
  rateCard,
  retainerTiers,
  site,
  type Tier,
} from "@/lib/content";
import { Cta } from "@/components/cta";
import { Reveal } from "@/components/reveal";
import { SharedIncludes, TierDeck } from "@/components/pricing";

/**
 * /pricing AS ONE RATE CARD (restructure, 2026-09-25).
 *
 * Shaun's note: the page read "all over the place" rather than as a neat,
 * professional agency price list. Measured before changing anything, the
 * causes were structural, not cosmetic:
 *
 *  - prices were set four different ways (tall tick cards, label/value
 *    tables, flat dash cards, a row list), so every band had to be learnt;
 *  - the creative section was 3,794px of a 10,830px page at 1440 and 7,260px
 *    of 15,705px on a phone, most of it a capability grid, a process and an
 *    exclusions list that are not prices at all;
 *  - the monthly plans sat behind a toggle a scrolling reader never pressed;
 *  - payment, VAT, revisions, turnaround and ownership were in four places.
 *
 * So the page now reads top to bottom as one card: an index with a "from"
 * figure per band, then four numbered bands in ONE section anatomy, every
 * set of plans in the same tier card, every line-item price in the same
 * ruled rate row, and the terms together at the end. The creative detail
 * that is not a price lives on /services/creative, linked from its band.
 *
 * Nothing here types a figure. Every number is read from the tier data, and
 * the load-bearing wording travels with its figure exactly as it did before:
 * "once we have your content" on each build, the chatbot's monthly fee
 * beside its setup, "unlimited" beside its configuration, the aerial
 * disclosure at its price.
 */

const WRAP = "mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16";
const gbp = (n: number) => `${site.currencySymbol}${n.toLocaleString("en-GB")}`;

/** Creative plans in the tier card's shape, so they render in the same deck. */
const creativePlans: Tier[] = creativeService.pricing.plans.map((plan) => ({
  id: plan.id,
  name: plan.name,
  price: plan.price,
  cadence: "month",
  meta: plan.meta,
  summary: "",
  includes: [...plan.includes],
  featured: plan.featured,
}));

/** Cheapest single piece on the creative rate card ("£95"), not a "from" row. */
function cheapestPiece(): string | null {
  const figures = creativeService.pricing.groups
    .flatMap((g) => g.rows.map((r) => r.price as string))
    .filter((p) => /^£[\d,]+$/.test(p))
    .map((p) => Number(p.replace(/[£,]/g, "")));
  return figures.length ? gbp(Math.min(...figures)) : null;
}

/* ---------------------------------------------------------------------- */

/**
 * At a glance: the four bands, each with a figure that is true on its own,
 * and a link down to it. The AI row quotes no figure on purpose — see the
 * comment on `rateCard` in content.ts.
 */
export function RateIndex() {
  const s = rateCard.sections;
  const piece = cheapestPiece();
  const rows: { id: string; index: string; label: string; kind: string; figure: ReactNode }[] = [
    {
      ...s.builds,
      figure: <>from {gbp(Math.min(...projectTiers.map((t) => t.price)))}</>,
    },
    {
      ...s.plans,
      figure: (
        <>
          from {gbp(Math.min(...retainerTiers.map((t) => t.price)))}
          <span className="text-ink-600">/month</span>
        </>
      ),
    },
    { ...s.ai, figure: <span className="text-ink-700">{s.ai.glance}</span> },
    {
      ...s.creative,
      figure: piece ? <>from {piece}</> : <span className="text-ink-700">See rates</span>,
    },
  ];

  return (
    <section aria-labelledby="rate-index-heading" className="border-t border-ink-300">
      <div className={`${WRAP} py-16 lg:py-20`}>
        <h2 id="rate-index-heading" className="field-label text-ink-600">
          {rateCard.indexLabel}
        </h2>
        <div className="bezel mt-6">
          <ul className="bezel-core overflow-hidden">
            {rows.map((row, i) => (
              <Reveal as="li" key={row.id} variant="slide" delay={i * 0.06}>
                <Link
                  href={`#${row.id}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 border-t border-ink-300 px-6 py-5 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.03] sm:px-8 lg:grid-cols-12 lg:gap-x-6 lg:px-10 lg:py-6 [li:first-child_&]:border-0"
                >
                  <span className="font-mono text-[0.6875rem] text-ink-600 tabular-nums lg:col-span-1">
                    {row.index}
                  </span>
                  <span className="text-[1.0625rem] font-medium tracking-tight text-ink-1000 lg:col-span-4 lg:text-lg">
                    {row.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="row-span-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-ink-1000 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5 lg:order-last lg:col-span-1 lg:row-span-1 lg:justify-self-end"
                  >
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                      <path
                        d="M8 3v10M3.5 8.5 8 13l4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="field-label col-start-2 text-ink-600 lg:col-span-3 lg:col-start-auto">
                    {row.kind}
                  </span>
                  <span className="display col-start-2 text-lg normal-case! tabular-nums text-ink-1000 lg:col-span-3 lg:col-start-auto lg:text-right lg:text-xl">
                    {row.figure}
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */

/** One band of the rate card. Same head, same spacing, every time. */
function RateSection({
  section,
  children,
}: {
  section: { id: string; index: string; label: string; heading: string; lede: string };
  children: ReactNode;
}) {
  const headingId = `${section.id}-heading`;
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className={`${WRAP} py-24 lg:py-32`}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[0.6875rem] text-ink-600 tabular-nums">
                {section.index}
              </span>
              <span aria-hidden="true" className="h-px w-10 bg-ink-400" />
              <p className="field-label text-ink-700">{section.label}</p>
            </div>
            <h2
              id={headingId}
              className="display text-display-md mt-6 max-w-[18ch] text-ink-1000"
            >
              {section.heading}
            </h2>
          </div>
          <Reveal className="lg:col-span-5 lg:pb-2" variant="unblur">
            <p className="lede max-w-[46ch]">{section.lede}</p>
          </Reveal>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */

export function BuildsBand() {
  return (
    <RateSection section={rateCard.sections.builds}>
      <SharedIncludes label={rateCard.sections.builds.sharedLabel} className="mt-14" />
      <TierDeck tiers={projectTiers} />
      <BespokeRow />
    </RateSection>
  );
}

/**
 * Above the published tiers. Larger brands rarely buy from a card; quoting no
 * figure here is the honest position, because that work is scoped.
 */
function BespokeRow() {
  return (
    <div className="mt-4 flex flex-col gap-6 border-y border-ink-300 py-7 lg:mt-2 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-10">
        <p className="field-label shrink-0 text-ink-600">Above these tiers</p>
        <p className="max-w-[70ch] text-[0.9375rem] leading-relaxed text-ink-800">
          <strong className="font-medium text-ink-1000">Bespoke engagements.</strong>{" "}
          Multi-market rollouts, product configurators, boutique and
          appointment-led retail, and brands where the site carries the whole
          reputation. Scoped and quoted on the work, never on a template.
        </p>
      </div>
      <Cta href="/#contact" variant="ghost" className="shrink-0 self-start lg:self-auto">
        Discuss a brief
      </Cta>
    </div>
  );
}

export function PlansBand() {
  return (
    <RateSection section={rateCard.sections.plans}>
      <p className="field-label mt-14 text-ink-600">
        {site.currencySymbol} GBP per month — no VAT charged
      </p>
      <TierDeck tiers={retainerTiers} />
    </RateSection>
  );
}

/* ---------------------------------------------------------------------- */

/**
 * AI add-ons as a rate table: the system on the left, its priced lines on
 * the right, each condition beside its figure rather than in a footnote —
 * the condition is the part a buyer needs. Same ruled row as the creative
 * rates, so every line-item price on the page reads the same way.
 */
export function AiBand() {
  return (
    <RateSection section={rateCard.sections.ai}>
      <div className="bezel mt-14">
        <div className="bezel-core overflow-hidden">
          {aiSystems.map((system, i) => (
            <div
              key={system.id}
              className={`grid gap-8 p-7 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10 ${
                i > 0 ? "border-t border-ink-300" : ""
              }`}
            >
              <div className="lg:col-span-5">
                <h3 className="display text-display-sm text-ink-1000">{system.title}</h3>
                <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-ink-700">
                  {system.summary}
                </p>
              </div>
              <ul className="lg:col-span-7">
                {system.lines.map((line) => (
                  <RateRow
                    key={line.label}
                    label={line.label}
                    value={line.value}
                    detail={line.detail}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </RateSection>
  );
}

/**
 * The one ruled row every line-item price uses: name (and its condition) on
 * the left, the figure on the right, a hairline between rows.
 *
 * `normal-case!` on the figure: `.display` is an UNLAYERED rule declared after
 * the Tailwind import, so its uppercase beats any utility on source order and
 * "£79/month" would render "£79/MONTH".
 */
function RateRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    /* One column on a phone, figure under its name: side by side, a long
       figure ("Unlimited on the standard configuration") crushed the name
       into a sliver. From `sm` the figure moves to the right edge. */
    <li className="grid items-baseline gap-x-6 gap-y-1.5 border-t border-ink-300 py-4 first:border-0 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto]">
      <span className="text-[0.9375rem] leading-snug text-ink-1000">{label}</span>
      <span className="display text-[1.0625rem] normal-case! tabular-nums tracking-tight text-ink-1000 sm:text-right">
        {value}
      </span>
      {detail ? (
        <span className="max-w-[56ch] text-[0.8125rem] leading-relaxed text-ink-600 sm:col-span-2">
          {detail}
        </span>
      ) : null}
    </li>
  );
}

/* ---------------------------------------------------------------------- */

/**
 * Creative: the monthly plans in the same deck as every other plan, then the
 * per-piece rates in the same ruled rows as the AI table. The capability
 * grid, the process and the "not part of it" list are on /services/creative.
 * The aerial group's label and note carry the AI-generated disclosure at the
 * price and are rendered verbatim — see `creativeService` in content.ts.
 */
export function CreativeBand() {
  const { pricing } = creativeService;
  const s = rateCard.sections.creative;
  return (
    <RateSection section={s}>
      <p className="field-label mt-14 text-ink-600">{pricing.currencyNote}</p>
      <TierDeck tiers={creativePlans} />

      <div className="bezel mt-6">
        <div className="bezel-core p-7 sm:p-8 lg:p-10">
          <h3 className="field-label text-ink-700">{s.oneOffLabel}</h3>
          <div className="mt-8 grid gap-x-12 gap-y-12 lg:grid-cols-3">
            {pricing.groups.map((group) => (
              <div key={group.label}>
                <h4 className="field-label text-ink-600">{group.label}</h4>
                <ul className="mt-5">
                  {group.rows.map((row) => (
                    <RateRow
                      key={row.name}
                      label={row.name}
                      value={row.price}
                      detail={"detail" in row ? row.detail : undefined}
                    />
                  ))}
                </ul>
                <p className="mt-5 max-w-[40ch] text-[0.8125rem] leading-relaxed text-ink-600">
                  {group.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
        <Cta href={creativeService.ctas.primary.href}>
          {creativeService.ctas.primary.label}
        </Cta>
        <Cta href={s.moreHref} variant="ghost">
          {s.moreLabel}
        </Cta>
      </div>
    </RateSection>
  );
}

/* ---------------------------------------------------------------------- */

/**
 * The terms, together. Same size as body copy, never collapsed: the
 * ownership line is a copyright assignment and the revision line sets a
 * charge, and neither counts if it needs a click to read.
 */
export function SmallPrint() {
  const { pricing } = creativeService;
  const terms: { label: string; lead?: string; body: string }[] = [
    { label: "Payment", body: rateCard.smallPrint.payment },
    { label: "VAT", body: rateCard.smallPrint.vat },
    {
      label: `Creative ${pricing.turnaround.label.toLowerCase()}`,
      lead: pricing.turnaround.lead,
      body: pricing.turnaround.body,
    },
    {
      label: `Creative ${pricing.ownership.label.toLowerCase()}`,
      lead: pricing.ownership.lead,
      body: pricing.ownership.body,
    },
    { label: "Creative revisions", body: pricing.footnote },
  ];

  return (
    <section
      id={rateCard.smallPrint.id}
      aria-labelledby="terms-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className={`${WRAP} py-24 lg:py-32`}>
        <h2 id="terms-heading" className="display text-display-sm text-ink-1000">
          {rateCard.smallPrint.heading}
        </h2>
        <dl className="mt-10 border-t border-ink-300 lg:mt-14">
          {terms.map((term) => (
            <Reveal
              key={term.label}
              variant="slide"
              className="grid gap-3 border-b border-ink-300 py-6 lg:grid-cols-12 lg:gap-10 lg:py-7"
            >
              <dt className="field-label text-ink-600 lg:col-span-3 lg:pt-1">{term.label}</dt>
              <dd className="m-0 max-w-[72ch] text-[0.9375rem] leading-relaxed text-ink-800 lg:col-span-9">
                {term.lead ? (
                  <strong className="font-medium text-ink-1000">{term.lead}</strong>
                ) : null}
                {term.lead ? " " : null}
                {term.body}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
