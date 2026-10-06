import Link from "next/link";
import {
  creativeService,
  projectTiers,
  publishedServicePages,
  rateCard,
  retainerPicks,
  retainerTiers,
  services,
  site,
  type Service,
  type ServicePage,
} from "@/lib/content";
import { automationPage } from "@/lib/ai-automation";
import { Reveal } from "@/components/reveal";
import { PageHero } from "./page-hero";
import { PackageDeck } from "./package-deck";
import { FaqList } from "./faq-list";
import { HeroCta } from "./hero-cta";
import { LABEL } from "./page-grid";
import { BuildNotes, creativePlans, CreativeRates, CreativeTerms, Divided, GridNote, Part, SharedLine } from "./pricing-parts";

const two = (n: number) => String(n).padStart(2, "0");

/**
 * Each service page's giant word, bar label (with its Japanese, as every
 * page top carries one) and the statement over its first part. `marks` is
 * the line under each monthly plan saying whether it includes the service,
 * read off the page's `planIds` and its `pricingNote` in content.ts: change
 * them together.
 */
const LOOK: Record<string, { word: string; label: string; ja: string; statement: string; mark?: string; marks?: Record<string, string> }> = {
  "web-design": { word: "web design", label: "Web design", ja: "ウェブ制作", statement: "Designed in-house. Built by hand." },
  seo: { word: "seo & geo", label: "SEO & GEO", ja: "検索最適化", statement: "Built to be found.", mark: "Includes SEO & GEO" },
  "email-sms": {
    word: "email & sms",
    label: "Email & SMS",
    ja: "メールとSMS",
    statement: "The follow-up, handled.",
    marks: { growth: "Two email campaigns a month", scale: "Full email & SMS", partner: "Full email & SMS" },
  },
  "hosting-care": { word: "hosting", label: "Hosting & care", ja: "保守運用", statement: "Looked after, every month." },
  creative: { word: "creative", label: "Creative", ja: "クリエイティブ", statement: "Made to your brand." },
};

/** A page top's third column: the page's parts, then the price list it belongs to. */
export function JumpList({ rows }: { rows: { href: string; label: string; tag: string }[] }) {
  return (
    <ol className={LABEL}>
      {rows.map((r) => (
        <li key={r.href}>
          <Link href={r.href} className="flex min-h-9 items-center justify-between gap-4 border-b border-white/12 text-ink-700 transition-colors hover:text-ink-1000">
            {r.label}
            <span className="tabular-nums text-ink-600">{r.tag}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/** The white bar to the full price list, right-aligned as the homepage sets its section bars. */
export function PricingBar({ href }: { href: string }) {
  return (
    <div className="mt-12 flex lg:justify-end">
      <div className="w-full lg:w-[24rem]">
        <HeroCta light label="See full pricing" href={href} />
      </div>
    </div>
  );
}

/** The four builds as /pricing sets them: what every build includes, the cards, then their notes. */
export function BuildPrices() {
  return (
    <>
      <SharedLine />
      <div className="mt-10">
        <PackageDeck label="Website builds" tiers={projectTiers} onDark />
      </div>
      <BuildNotes />
      <PricingBar href="/pricing#builds" />
    </>
  );
}

/**
 * One discipline in full, on the page's three columns: number, name and its
 * one line | the paragraph that argues for it, then everything it covers,
 * counted. The /services index carries the short version of the same row.
 */
function Discipline({ service }: { service: Service }) {
  return (
    <article id={service.id} aria-labelledby={`${service.id}-title`} className="scroll-mt-24 border-b border-ink-300 last:border-b-0">
      <Reveal variant="slide" className="grid gap-8 py-10 lg:grid-cols-3 lg:gap-0 lg:py-14">
        <div className="lg:pr-10">
          <h3 id={`${service.id}-title`} className="flex items-baseline gap-5">
            <span className="font-[family-name:var(--font-cal-ui)] text-[1.75rem] leading-none tabular-nums text-accent">{service.index}</span>
            <span className="text-[clamp(1.5rem,2.3vw,2.25rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] text-ink-1000">{service.title}</span>
          </h3>
          <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-700">{service.summary}</p>
        </div>
        <div className="lg:col-span-2 lg:pl-3">
          <p className="max-w-[60ch] text-[1.0625rem] leading-[1.55] tracking-[-0.02em] text-ink-900 lg:text-[1.1875rem] lg:leading-[1.5]">{service.detail}</p>
          <p className={`mt-10 ${LABEL} text-ink-700`}>
            What it covers <span className="tabular-nums text-accent">({service.capabilities.length})</span>
          </p>
          <ul className="mt-3 grid border-t border-ink-300 sm:grid-cols-2 sm:gap-x-10">
            {service.capabilities.map((c) => (
              <li key={c} className="flex items-baseline gap-3 border-b border-ink-300 py-3.5 text-[1rem] leading-snug text-ink-1000">
                <span aria-hidden="true" className="text-accent">
                  +
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </article>
  );
}

/** The creative service's eight kinds of work, then what is handed over and what is not part of it. */
function CreativeMade() {
  const { capabilities, included, excluded } = creativeService;
  return (
    <>
      <ul className="mt-12 grid border-t border-ink-1000 sm:grid-cols-2 sm:gap-x-10 lg:mt-16 lg:grid-cols-4">
        {capabilities.map((c) => (
          <li key={c.index} className="border-b border-ink-300 py-8">
            <span className="font-[family-name:var(--font-cal-ui)] text-[1.125rem] leading-none tabular-nums text-accent">{c.index}</span>
            <h3 className="mt-4 text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-ink-1000">{c.title}</h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-700">{c.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-0">
        <div className="lg:col-start-2 lg:pl-3 lg:pr-10">
          <h3 className={`${LABEL} text-ink-1000`}>{included.label}</h3>
          <ul className="mt-4 border-t border-ink-300">
            {included.items.map((item) => (
              <li key={item} className="flex items-baseline gap-3 border-b border-ink-300 py-3 text-[0.9375rem] leading-snug text-ink-1000">
                <span aria-hidden="true" className="text-accent">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:pl-10">
          <h3 className={`${LABEL} text-ink-1000`}>Not part of the creative service</h3>
          <ul className="mt-4 border-t border-ink-300">
            {excluded.items.map((item) => (
              <li key={item} className="flex items-baseline gap-3 border-b border-ink-300 py-3 text-[0.9375rem] leading-snug text-ink-800">
                <span aria-hidden="true" className="text-ink-600">
                  —
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.875rem] leading-relaxed text-ink-700">{excluded.note}</p>
        </div>
      </div>
    </>
  );
}

/** How a creative job runs, four steps in a ruled row. */
function CreativeSteps() {
  return (
    <ol className="mt-12 grid border-t border-ink-1000 sm:grid-cols-2 sm:gap-x-10 lg:mt-16 lg:grid-cols-4">
      {creativeService.steps.map((s) => (
        <li key={s.index} className="border-b border-ink-300 py-8 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 lg:border-b-0">
          <p className={`${LABEL} text-ink-700`}>
            Step <span className="tabular-nums text-accent">{s.index}</span>
          </p>
          <h3 className="mt-4 text-[clamp(1.5rem,2vw,1.875rem)] font-semibold uppercase leading-none tracking-[-0.04em] text-ink-1000">{s.title}</h3>
          <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-700">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/**
 * Every service page links every other: it is how Google finds and weighs
 * them. A quiet list, not another giant heading.
 */
export function OtherServices({ current }: { current: string }) {
  const others = [
    ...publishedServicePages.filter((p) => p.slug !== current).map((p) => ({ href: `/services/${p.slug}`, label: p.label })),
    automationPage,
  ];
  return (
    <section aria-labelledby="other-services-heading" className="border-t border-white/12 py-12 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-0">
        <h2 id="other-services-heading" className={`text-ink-700 lg:pr-10 lg:pt-5 ${LABEL}`}>
          Other services
        </h2>
        <ul className="grid sm:grid-cols-2 sm:gap-x-10 lg:col-span-2 lg:pl-3">
          {others.map((p) => (
            <li key={p.href} className="border-b border-ink-300">
              <Link href={p.href} className="group flex min-h-14 items-center justify-between gap-6 text-ink-1000 transition-colors hover:text-accent">
                <span className="text-[1.0625rem] font-semibold uppercase tracking-[-0.03em]">{p.label}</span>
                <span aria-hidden="true" className="transition-transform duration-500 group-hover:-rotate-45">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * /services/<slug> IN THE HOMEPAGE'S SYSTEM (Brad, 2026-10-05: "do the
 * remaining old pages"), after the AI page of the day before. All on black,
 * as /pricing and /services/ai: the page top with the service enormous, then
 * the service itself (each discipline's paragraph and everything it covers;
 * the creative page shows its eight kinds of work and how a job runs), its
 * prices as /pricing sets them (the builds, or the monthly plans each marked
 * with whether it includes this service, or the creative plans), its
 * questions, and the other services. Every figure is read from the tier
 * data, never typed, as before. The footer's "let's talk" closes the page,
 * so the old contact band and back link are gone.
 */
export function ServiceView({ page }: { page: ServicePage }) {
  const look = LOOK[page.slug] ?? { word: page.label, label: page.label, ja: "サービス", statement: page.heading };
  const covered = page.serviceIds.map((id) => services.find((s) => s.id === id)).filter((s): s is Service => Boolean(s));
  const creative = page.pricing === "creative";
  const parts = [
    { id: "service", label: creative ? "What we make" : "The service" },
    ...(creative ? [{ id: "steps", label: "How it runs" }] : []),
    { id: "prices", label: "Prices" },
    ...(page.faqMetas.length ? [{ id: "faq", label: "Questions" }] : []),
  ];
  const n = (id: string) => two(parts.findIndex((p) => p.id === id) + 1);
  const pricing = page.pricing === "build" ? "/pricing#builds" : creative ? "/pricing#creative" : "/pricing#plans";
  const count =
    page.pricing === "build"
      ? { value: two(projectTiers.length), label: "builds" }
      : creative
        ? { value: two(creativePlans.length), label: "plans" }
        : { value: two(page.planIds?.length ?? 0), label: "plans" };
  // Only where some plan leaves the service out: on hosting & care every plan
  // includes it, and four identical labels would say nothing.
  const partial = retainerTiers.some((t) => !page.planIds?.includes(t.id));
  const marks = partial
    ? Object.fromEntries(
        retainerTiers.map((t) => {
          const on = page.planIds?.includes(t.id) ?? false;
          return [t.id, { on, text: on ? (look.marks?.[t.id] ?? look.mark ?? "Included") : "Not included" }];
        }),
      )
    : undefined;

  return (
    <>
      <PageHero
        id="service-page-heading"
        title={page.heading}
        word={look.word}
        label={look.label}
        ja={look.ja}
        count={count}
        lede={page.lede}
        image={page.image}
        aside={<JumpList rows={[...parts.map((p, i) => ({ href: `#${p.id}`, label: p.label, tag: two(i + 1) })), { href: pricing, label: "All pricing", tag: "→" }]} />}
      />

      <div className="bg-ink-0 px-6 sm:px-10">
        <Part id="service" index={n("service")} label={parts[0].label} heading={look.statement}>
          {creative ? (
            <CreativeMade />
          ) : (
            <div className="mt-12 border-t border-ink-1000 lg:mt-16">
              {covered.map((s) => (
                <Discipline key={s.id} service={s} />
              ))}
            </div>
          )}
        </Part>

        {creative ? (
          <Divided>
            <Part id="steps" index={n("steps")} label="How it runs" heading="Brief to delivery.">
              <CreativeSteps />
            </Part>
          </Divided>
        ) : null}

        <Divided>
          <Part
            id="prices"
            index={n("prices")}
            label="Prices"
            heading="How it's priced."
            lede={page.pricing === "build" ? rateCard.sections.builds.lede : creative ? creativeService.pricing.compactNote : page.pricingNote}
          >
            {page.pricing === "build" ? <BuildPrices /> : null}
            {page.pricing === "plans" ? (
              <>
                <GridNote>{site.currencySymbol} GBP per month — no VAT charged</GridNote>
                <div className="mt-6">
                  <PackageDeck label="Monthly plans" tiers={retainerTiers} onDark picks={retainerPicks} marks={marks} />
                </div>
                <ul className="mt-8 grid max-w-[72ch] gap-2 text-[0.9375rem] leading-relaxed text-ink-800 lg:ml-[calc(100%/3)] lg:pl-3">
                  {rateCard.smallPrint.planTerms.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <PricingBar href={pricing} />
              </>
            ) : null}
            {creative ? (
              <>
                <GridNote>{creativeService.pricing.currencyNote}</GridNote>
                <div className="mt-6">
                  <PackageDeck label="Creative plans" tiers={creativePlans} onDark />
                </div>
                <CreativeTerms />
                <CreativeRates />
                {page.pricingNote ? <p className="mt-10 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-800 lg:ml-[calc(100%/3)] lg:pl-3">{page.pricingNote}</p> : null}
                <PricingBar href={pricing} />
              </>
            ) : null}
          </Part>
        </Divided>

        {page.faqMetas.length ? (
          <Divided>
            <FaqList index={n("faq")} metas={page.faqMetas} heading="Questions we get asked." lede={`What people usually ask about ${page.label} before they get in touch.`} />
          </Divided>
        ) : null}

        <OtherServices current={page.slug} />
      </div>
    </>
  );
}
