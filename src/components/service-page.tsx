import Link from "next/link";
import {
  aiSystems,
  creativeService,
  publishedServicePages,
  retainerTiers,
  type Service,
} from "@/lib/content";
import { Cta } from "@/components/cta";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * SERVICE PAGES — the sections /services/<slug> is built from (2026-09-25).
 *
 * Every figure on these pages is rendered from the tier data in content.ts,
 * never typed here, so a price change on /pricing reaches every service page
 * in the same deploy. The copy rules are the comment on `servicePages`.
 *
 * Visual language is the site's own: double-bezel plates for anything that
 * holds a list, mono field labels, hairline rules, the house reveal. Nothing
 * here introduces a new pattern; a reader arriving from /services should feel
 * they are deeper in the same place, not on a different site.
 */

const WRAP = "mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16";

function gbp(n: number): string {
  return `£${n.toLocaleString("en-GB")}`;
}

function Tick() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="mt-[0.35rem] h-3 w-3 shrink-0 text-ink-1000"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 6.5 4.5 9.5 10.5 2.5" />
    </svg>
  );
}

function SectionHead({
  eyebrow,
  id,
  heading,
  lede,
}: {
  eyebrow: string;
  id: string;
  heading: string;
  lede?: string;
}) {
  return (
    <div className="max-w-[60ch]">
      <p className="eyebrow eyebrow-plain mb-6">{eyebrow}</p>
      <h2 id={id} className="display text-display-md text-ink-1000">
        <RevealWords text={heading} />
      </h2>
      {lede ? (
        <Reveal className="mt-6" variant="unblur">
          <p className="text-[0.9375rem] leading-relaxed text-ink-700">{lede}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/**
 * One discipline in full: its summary, the paragraph that argues for it, and
 * every capability. A page covering two disciplines renders this twice.
 */
export function ServiceDetail({ service }: { service: Service }) {
  const id = `detail-${service.id}`;
  return (
    <section aria-labelledby={id} className="border-t border-ink-300">
      <div className={`${WRAP} grid gap-10 py-20 sm:py-24 lg:grid-cols-12 lg:gap-16 lg:py-32`}>
        <div className="lg:col-span-5">
          <p className="eyebrow eyebrow-plain mb-6">{service.index}</p>
          <h2 id={id} className="display text-display-md text-ink-1000">
            <RevealWords text={service.title} />
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1rem] leading-relaxed text-ink-700">
            {service.summary}
          </p>
        </div>

        <div className="lg:col-span-7">
          <Reveal variant="unblur">
            <p className="max-w-[64ch] text-[1.0625rem] leading-relaxed text-ink-800">
              {service.detail}
            </p>
          </Reveal>

          <Reveal className="mt-10" variant="settle">
            <div className="bezel">
              <div className="bezel-core p-7 sm:p-8">
                <h3 className="field-label text-ink-600">What it covers</h3>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {service.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex gap-3 text-[0.9375rem] leading-snug text-ink-1000"
                    >
                      <Tick />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * The monthly plans, each labelled Included or Not included for this
 * service. The ones that do not include it are shown too, because "which
 * plan do I need for SEO?" is answered by seeing where it starts.
 */
export function PlanPricing({
  planIds,
  note,
}: {
  planIds: string[];
  note?: string;
}) {
  return (
    <section aria-labelledby="plans-heading" className="border-t border-ink-300">
      <div className={`${WRAP} py-20 sm:py-24 lg:py-32`}>
        <SectionHead
          eyebrow="Pricing"
          id="plans-heading"
          heading="How it's priced."
          lede={note}
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 xl:grid-cols-4">
          {retainerTiers.map((tier) => {
            const included = planIds.includes(tier.id);
            return (
              <li key={tier.id} className="bezel">
                {/* No opacity on the plans that do not include it: a faded
                    card took its text under AA contrast (axe, 2026-09-25).
                    The label below carries the difference instead. */}
                <div className="bezel-core flex flex-col p-7">
                  <p className="field-label text-ink-600">{tier.meta}</p>
                  <h3 className="display mt-4 text-display-sm text-ink-1000">{tier.name}</h3>
                  <p className="mt-3 text-[1.0625rem] text-ink-1000">
                    {gbp(tier.price)}
                    <span className="text-ink-600"> / month</span>
                  </p>
                  <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-700">
                    {tier.summary}
                  </p>
                  <p
                    className={`field-label mt-auto pt-6 ${included ? "text-ink-1000" : "text-ink-600"}`}
                  >
                    {included ? "Included" : "Not included"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10">
          <Cta href="/pricing" variant="ghost">
            Every plan in full
          </Cta>
        </div>
      </div>
    </section>
  );
}

/**
 * Both AI systems with every priced line and its caveat. The caveat is
 * rendered beside its figure, never below the fold of a disclosure: the
 * voice receptionist's "unlimited" is only true on the configuration its
 * detail line states, so the two must be read together.
 */
export function AiPricing() {
  return (
    <section aria-labelledby="ai-heading" className="border-t border-ink-300">
      <div className={`${WRAP} py-20 sm:py-24 lg:py-32`}>
        <SectionHead
          eyebrow="Pricing"
          id="ai-heading"
          heading="What each one costs."
          lede="A one-off setup and a monthly fee, both published. The monthly fee is what keeps the system hosted, trained and answering."
        />

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-2">
          {aiSystems.map((system) => (
            <Reveal key={system.id} variant="settle">
              <div className="bezel h-full">
                <div className="bezel-core p-7 sm:p-9">
                  <h3 className="display text-display-sm text-ink-1000">{system.title}</h3>
                  <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-700">
                    {system.summary}
                  </p>
                  <dl className="mt-8 grid gap-5">
                    {system.lines.map((line) => (
                      <div key={line.label} className="border-t border-ink-300 pt-5">
                        <dt className="field-label text-ink-600">{line.label}</dt>
                        <dd className="mt-2 text-[1rem] text-ink-1000">{line.value}</dd>
                        {line.detail ? (
                          <dd className="mt-1 text-[0.875rem] leading-relaxed text-ink-700">
                            {line.detail}
                          </dd>
                        ) : null}
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10">
          <Cta href="/pricing" variant="ghost">
            See all pricing
          </Cta>
        </div>
      </div>
    </section>
  );
}

/**
 * The creative service in full: what is made, what is handed over, what is
 * not part of it, and the monthly plans. The "not part of it" list is the
 * creative service's own; the Partner plan (which does run ads) is named in
 * the page's pricing note so the two statements cannot be read as a
 * contradiction.
 */
export function CreativeDetail({ note }: { note?: string }) {
  const { pricing } = creativeService;
  return (
    <>
      <section aria-labelledby="creative-what" className="border-t border-ink-300">
        <div className={`${WRAP} py-20 sm:py-24 lg:py-32`}>
          <SectionHead eyebrow="What we make" id="creative-what" heading="Made to your brand." />
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {creativeService.capabilities.map((item) => (
              <li key={item.title} className="border-t border-ink-300 pt-6">
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.625rem] text-ink-600 tabular-nums"
                >
                  {item.index}
                </span>
                <h3 className="mt-3 text-[1.0625rem] leading-snug font-medium text-ink-1000">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-700">{item.body}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            <div className="bezel">
              <div className="bezel-core h-full p-7 sm:p-8">
                <h3 className="field-label text-ink-600">{creativeService.included.label}</h3>
                <ul className="mt-5 grid gap-3">
                  {creativeService.included.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9375rem] leading-snug text-ink-1000">
                      <Tick />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bezel">
              <div className="bezel-core h-full p-7 sm:p-8">
                <h3 className="field-label text-ink-600">Not part of the creative service</h3>
                <ul className="mt-5 grid gap-3">
                  {creativeService.excluded.items.map((item) => (
                    <li key={item} className="text-[0.9375rem] leading-snug text-ink-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="creative-pricing" className="border-t border-ink-300">
        <div className={`${WRAP} py-20 sm:py-24 lg:py-32`}>
          <SectionHead
            eyebrow="Pricing"
            id="creative-pricing"
            heading="How it's priced."
            lede={pricing.compactNote}
          />
          <ul className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
            {pricing.plans.map((plan) => (
              <li key={plan.id} className="bezel">
                <div className="bezel-core flex h-full flex-col p-7">
                  <p className="field-label text-ink-600">{plan.meta}</p>
                  <h3 className="display mt-4 text-display-sm text-ink-1000">{plan.name}</h3>
                  <p className="mt-3 text-[1.0625rem] text-ink-1000">
                    {gbp(plan.price)}
                    <span className="text-ink-600"> / month</span>
                  </p>
                  <ul className="mt-6 grid gap-2">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-[0.875rem] leading-snug text-ink-800">
                        <Tick />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8125rem] text-ink-600">{pricing.currencyNote}</p>
          {note ? (
            <p className="mt-8 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-800">
              {note}
            </p>
          ) : null}
          <div className="mt-10">
            <Cta href={pricing.compactCta.href} variant="ghost">
              Every creative rate
            </Cta>
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Links to every published service page. On a service page it lists the
 * others; on /services it lists them all. Internal links are how Google
 * finds and weighs these pages, so each one is linked from every other.
 */
export function ServicePageLinks({
  current,
  heading,
}: {
  current?: string;
  heading: string;
}) {
  const pages = publishedServicePages.filter((p) => p.slug !== current);
  return (
    <section aria-labelledby="service-links-heading" className="border-t border-ink-300">
      <div className={`${WRAP} py-20 sm:py-24`}>
        <p className="eyebrow eyebrow-plain mb-6">Services</p>
        <h2 id="service-links-heading" className="display text-display-sm text-ink-1000">
          {heading}
        </h2>
        <ul className="mt-10 border-t border-ink-300">
          {pages.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/services/${p.slug}`}
                className="group flex min-h-14 items-center justify-between gap-6 border-b border-ink-300 py-5 text-[1.0625rem] text-ink-1000"
              >
                <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                  {p.label}
                </span>
                <span aria-hidden="true" className="text-ink-600">
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
