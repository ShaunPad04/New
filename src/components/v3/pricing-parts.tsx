import Link from "next/link";
import type { ReactNode } from "react";
import { aiSystems, buildStandardsBand, creativeService, projectTiers, projectTiersShared, rateCard, retainerTiers, site, type Tier } from "@/lib/content";
import { H2, LABEL, SectionLabel } from "./page-grid";
import { HeroCta } from "./hero-cta";

/**
 * /pricing in the inner pages' system, regrouped 2026-10-04 (Brad: the page
 * "feels unorganised and messy"): four bands instead of eight, one card
 * anatomy for every set of plans (`PackageDeck`) and one row anatomy for
 * every line item (`RateRows`). The rate card's load-bearing lines are kept
 * from the 2026-09-25 restructure (see the comment at the top of
 * components/rate-card.tsx). Nothing here types a figure: every number is
 * read from `projectTiers`, `retainerTiers`, `aiSystems`, `rateCard` and
 * `creativeService.pricing`.
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

/** The cheapest AI system's two parts together ("from £199 + £59/month"):
    never a lone monthly figure, which would read as the whole cost. */
function aiFrom() {
  const part = (a: (typeof aiSystems)[number], label: string) => a.lines.find((l) => l.label === label)?.value ?? "";
  const n = (v: string) => Number(v.replace(/[^\d.]/g, ""));
  const a = [...aiSystems].sort((x, y) => n(part(x, "Monthly")) - n(part(y, "Monthly")))[0];
  return `from ${part(a, "Setup").replace(" one-time", "")} + ${part(a, "Monthly")}`;
}

/** Each price list's opening figure, only where one figure is true on its own:
    the index's AI row quotes none (two-part pricing; see the comment on `rateCard`). */
function glance() {
  const s = rateCard.sections;
  const piece = cheapestPiece();
  return {
    builds: `from ${gbp(Math.min(...projectTiers.map((t) => t.price)))}`,
    plans: `from ${gbp(Math.min(...retainerTiers.map((t) => t.price)))}/month`,
    ai: s.ai.glance,
    bookings: `from ${s.bookings.rows[0].price}`,
    crm: `from ${s.crm.rows[0].price.replace(" setup", "")}`,
    creative: piece ? `from ${piece}` : "See rates",
  };
}

/** At a glance, in the page top's third column: every price list, linking down to it. */
export function RateGlance() {
  const s = rateCard.sections;
  const g = glance();
  const rows = [s.builds, s.plans, s.ai, s.bookings, s.crm, s.creative].map((r) => ({ ...r, figure: g[r.id] }));
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

/** A numbered part of the page: the label in column one, heading and lede across two. */
export function Part({ id, index, label, heading, lede, children }: { id: string; index: string; label: string; heading: string; lede: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative z-[2] scroll-mt-24 py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-0">
        <SectionLabel index={index} label={label} className="lg:pr-10" />
        <div className="lg:col-span-2 lg:pl-3">
          <h2 id={`${id}-heading`} className={H2}>
            {heading}
          </h2>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{lede}</p>
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

/** "Every build includes", said once above the cards, on the page's columns: label | two | one. */
export function SharedLine() {
  return (
    <div className="mt-12 grid gap-4 border-y border-ink-300 py-5 lg:mt-16 lg:grid-cols-3 lg:gap-0">
      <p className={`${LABEL} text-ink-700 lg:pr-10`}>
        {rateCard.sections.builds.sharedLabel}
        <span className="mt-1 block text-ink-600">{site.currencySymbol} GBP — no VAT charged</span>
      </p>
      <ul className="grid gap-2.5 lg:col-span-2 lg:grid-cols-2">
        {projectTiersShared.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-ink-900 lg:pl-3 lg:pr-10">
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

/** The long tail of a price list, one click away: native, no script, and the
    rows stay in the HTML. Never used for terms, which are always open. It
    slides open and shut (`.disclosure` in globals.css). */
function More({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="disclosure group/more border-t border-ink-300">
      <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-ink-1000 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden ${LABEL}`}>
        {label}
        <span aria-hidden="true" className="text-base transition-transform duration-300 group-open/more:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-4 pt-6">{children}</div>
    </details>
  );
}

/**
 * Under the build cards, each thing as what it is (Brad, 2026-10-04: the
 * single ruled list "looks out of place"; four kinds of thing in one
 * terms-and-conditions table, right after the cards). The 20%-off line and
 * Flagship's priced-on-top lines are FOOTNOTES, small, under the cards they
 * qualify (Flagship's under Flagship); Bespoke is a TIER, so it is the fifth
 * row in the cards' own anatomy, index, name, price and bar; the guarantee is
 * PROOF, so its four scores are set large, with its terms in full beneath
 * them, right under the cards whose "Every build includes" line makes it.
 */
export function BuildNotes() {
  const s = rateCard.sections.builds;
  const b = s.bespoke;
  const [measured] = buildStandardsBand.blocks;
  const flagship = projectTiers.find((t) => t.extras || t.note);
  const scores = measured.heading.split(" / ");
  return (
    <>
      <div className="mt-6 grid gap-3 text-[0.8125rem] leading-relaxed text-ink-700 lg:grid-cols-4 lg:gap-0">
        <div className="grid max-w-[72ch] gap-2 lg:col-span-3 lg:pr-10">
          <p>{s.multiSiteNote}</p>
          <p>{rateCard.smallPrint.referral}</p>
        </div>
        {flagship ? (
          <p className="lg:pl-6">
            {flagship.extras ? (
              <>
                <span className="font-semibold text-ink-900">
                  {flagship.name} — {flagship.extras.label}:
                </span>{" "}
                {flagship.extras.lines.join(" · ")}.{" "}
              </>
            ) : null}
            {flagship.note ? (
              <>
                <span className="font-semibold text-ink-900">{flagship.note.lead}</span> {flagship.note.body}
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="mt-14 grid gap-6 border-y border-ink-1000 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_18rem] lg:items-center lg:gap-10 lg:py-10">
        <div>
          <h3 className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-cal-ui)] text-[1.125rem] leading-none tabular-nums text-accent">{String(projectTiers.length + 1).padStart(2, "0")}</span>
            <span className="text-[1.375rem] font-semibold uppercase leading-none tracking-[-0.03em] text-ink-1000">{b.name}</span>
          </h3>
          <p className="mt-2 text-[0.875rem] text-ink-700">{b.label}</p>
        </div>
        <div>
          <p className="text-[0.9375rem] leading-relaxed text-ink-800">
            <strong className="font-semibold text-ink-1000">{b.lead}</strong> {b.body}
          </p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-700">{b.discovery}</p>
        </div>
        <div className="grid gap-4">
          <p className="flex items-baseline gap-1.5 text-ink-1000">
            {b.price.startsWith("from ") ? <span className="text-[0.875rem] text-ink-700">from</span> : null}
            <span className="display text-[clamp(2.5rem,3.1vw,3.25rem)] leading-none">{b.price.replace(/^from /, "")}</span>
          </p>
          <HeroCta light label="Discuss a brief" sr={b.name} />
        </div>
      </div>

      <div className="mt-14">
        <p className={`${LABEL} text-ink-700`}>{projectTiersShared[0]}</p>
        <dl className="mt-5 grid grid-cols-2 border-t border-ink-300 lg:grid-cols-4">
          {scores.map((v, i) => (
            <div key={i} className={`border-b border-ink-300 py-6 lg:border-b-0 ${i % 2 ? "border-l pl-6" : "pr-6"} ${i ? "lg:border-l lg:pl-6" : "lg:pl-0"}`}>
              <dt className={`${LABEL} text-ink-700`}>{measured.scoreLabels[i]}</dt>
              <dd className="display m-0 mt-3 text-[clamp(2.75rem,4.4vw,4.5rem)] leading-none text-ink-1000">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[72ch] text-[0.9375rem] leading-relaxed text-ink-800">{measured.body}</p>
        <p className="mt-2 max-w-[72ch] text-[0.8125rem] leading-relaxed text-ink-700">{measured.note}</p>
      </div>
    </>
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

/** One add-on group on the page's columns: its name and a line in column one
    (and a way to its own page, where it has one); the caller places the rest. */
function Group({ id, label, heading, lede, more, children }: { id: string; label: string; heading: string; lede: string; more?: string; children: ReactNode }) {
  return (
    <div id={id} className="grid scroll-mt-24 gap-8 border-t border-ink-1000 py-10 lg:grid-cols-3 lg:gap-0 lg:py-12">
      <div className="lg:pr-10">
        <p className={`${LABEL} text-ink-700`}>{label}</p>
        <h3 className="mt-3 text-[1.375rem] font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-ink-1000">{heading}</h3>
        <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-800">{lede}</p>
        {more ? (
          <Link href={more} className={`group mt-3 inline-flex min-h-11 items-center gap-2 text-ink-1000 transition-colors hover:text-accent ${LABEL}`}>
            Full details <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}

/** An add-on's opening figure across columns two and three, its whole price list one click away. */
function Priced({ figure, count, children }: { figure: string; count: number; children: ReactNode }) {
  return (
    <div className="lg:col-span-2 lg:pl-3">
      <p className="display text-[clamp(1.75rem,2.4vw,2.25rem)] leading-none normal-case! text-ink-1000">{figure}</p>
      <div className="mt-6">
        <More label={`See prices (${count})`}>{children}</More>
      </div>
    </div>
  );
}

/**
 * The add-ons, each as one line: what it is, its opening figure, and "See
 * prices" for the rows (Brad, 2026-10-04: too much on the page). Every
 * condition still sits beside its figure inside; the AI line shows its two
 * parts together, never a lone monthly figure.
 */
export function AddOns() {
  const s = rateCard.sections;
  const g = glance();
  return (
    <div className="mt-12 lg:mt-16">
      <Group id={s.ai.id} label={s.ai.label} heading={s.ai.heading} lede={s.ai.lede} more="/services/ai">
        <Priced figure={aiFrom()} count={aiSystems.reduce((n, a) => n + a.lines.length, 0)}>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            {aiSystems.map((system) => (
              <div key={system.id}>
                <h4 className="text-[1.0625rem] font-semibold text-ink-1000">{system.title}</h4>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-700">{system.summary}</p>
                <div className="mt-5">
                  <RateRows rows={system.lines.map((l) => ({ label: l.label, value: l.value, detail: l.detail }))} />
                </div>
              </div>
            ))}
          </div>
        </Priced>
      </Group>
      {[s.bookings, s.crm].map((group) => (
        <Group key={group.id} id={group.id} label={group.label} heading={group.heading} lede={group.lede}>
          <Priced figure={g[group.id]} count={group.rows.length}>
            <RateRows rows={group.rows.map((r) => ({ label: r.name, value: r.price, detail: r.detail }))} />
          </Priced>
        </Group>
      ))}
    </div>
  );
}

/**
 * One-off creative under the plan cards, one click away: the three groups on
 * the three columns. The aerial group's label and note carry the
 * AI-generated disclosure at the price, verbatim (see `creativeService`), and
 * open with it.
 */
export function CreativeRates() {
  const { pricing } = creativeService;
  const s = rateCard.sections.creative;
  const count = pricing.groups.reduce((n, g) => n + g.rows.length, 0);
  return (
    <div className="mt-12 lg:mt-16">
      <More label={`${s.oneOffLabel} — ${glance().creative} (${count})`}>
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-0">
          {pricing.groups.map((group, i) => (
            <div key={group.label} className={i === 0 ? "lg:pr-10" : i === 1 ? "lg:pl-3 lg:pr-10" : "lg:pl-3"}>
              <h3 className={`${LABEL} mb-3 text-ink-600`}>{group.label}</h3>
              <RateRows rows={group.rows.map((r) => ({ label: r.name, value: r.price, detail: "detail" in r ? r.detail : undefined }))} />
              <p className="mt-4 max-w-[44ch] text-[0.8125rem] leading-relaxed text-ink-700">{group.note}</p>
            </div>
          ))}
        </div>
      </More>
      <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
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
 * The creative terms, under the creative cards they govern (Brad,
 * 2026-10-04: no separate small-print block; the Framer studios he pointed
 * to, Nocta and Neiden, go from the plans straight to the questions and keep
 * each condition where it applies). Turnaround, ownership and the revision
 * round with its £75 charge for more, which stays in view beside the prices
 * it adds to. Verbatim from `creativeService.pricing`.
 */
export function CreativeTerms() {
  const { pricing } = creativeService;
  const items: { label: string; lead?: string; body: string }[] = [
    { label: pricing.turnaround.label, lead: pricing.turnaround.lead, body: pricing.turnaround.body },
    { label: pricing.ownership.label, lead: pricing.ownership.lead, body: pricing.ownership.body },
    { label: "Revisions", body: pricing.footnote },
  ];
  return (
    <dl className="mt-10 grid gap-8 border-t border-ink-300 pt-8 md:grid-cols-3 md:gap-10">
      {items.map((item) => (
        <div key={item.label}>
          <dt className={`${LABEL} text-ink-700`}>{item.label}</dt>
          <dd className="m-0 mt-2 text-[0.875rem] leading-relaxed text-ink-800">
            {item.lead ? <strong className="font-semibold text-ink-1000">{item.lead} </strong> : null}
            {item.body}
          </dd>
        </div>
      ))}
    </dl>
  );
}
