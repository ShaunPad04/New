import { site, type Tier } from "@/lib/content";
import { Rich } from "@/components/rich";
import { HeroCta } from "./hero-cta";
import { LABEL } from "./page-grid";

const fmt = new Intl.NumberFormat("en-GB");

/** Ink with a red square, not red text: red on a tinted column measured
    ~4.49:1. On the Pricing cards and the homepage's price list. */
export function Recommended({ className }: { className: string }) {
  return (
    <span className={`items-center gap-1.5 border border-ink-1000 px-2 py-1 text-[0.625rem] font-bold uppercase tracking-[0.06em] text-ink-1000 ${className}`}>
      <span aria-hidden="true" className="size-1.5 bg-accent" />
      Recommended
    </span>
  );
}

/** Column rules: side by side and swiped on phones, two up from md, all in a row from lg. */
function edges(i: number, n: number) {
  return [
    "w-[82%] shrink-0 snap-start border-l border-ink-300 pl-5 pr-5 first:border-l-0 first:pl-0 md:w-auto md:pr-6",
    i % 2 ? "md:border-l md:pl-6" : "md:border-l-0 md:pl-0",
    i < 2 && n > 2 ? "md:border-b lg:border-b-0" : "",
    i ? "lg:border-l lg:pl-6" : "lg:border-l-0 lg:pl-0",
    i < n - 1 ? "lg:pr-6" : "lg:pr-0",
  ].join(" ");
}

/**
 * ONE CARD FOR EVERY SET OF PLANS on /pricing (Brad, 2026-10-04: the old page
 * "feels unorganised and messy"; after Neiden's pricing column). Name and who
 * it is for, the price, five lines, the bar, the timeframe, and the full list
 * one click away in a native <details> (no script; the text stays in the page
 * for search). From lg the six parts are subgrid rows, so prices, lines and
 * bars align across the set. Phones swipe the set sideways.
 *
 * The five lines are `tier.highlights`, or `picks` (verbatim `includes` lines
 * chosen per plan: a pick that stops matching drops out rather than showing
 * an unsourced claim), or the whole list when it is short. The delivery line
 * is shown whole; "once we have your content" is what makes it keepable.
 * Opaque, so a band's three-column rules never run through a four-column set;
 * 1px in from each side so the frame's outer rules stay unbroken.
 */
export function PackageDeck({
  label,
  tiers,
  onDark = false,
  picks,
}: {
  label: string;
  tiers: Tier[];
  onDark?: boolean;
  picks?: Readonly<Record<string, readonly string[]>>;
}) {
  const n = tiers.length;
  return (
    <ul
      aria-label={label}
      className={`-mx-6 flex snap-x snap-mandatory scroll-px-6 overflow-x-auto border-t border-ink-1000 bg-ink-0 px-6 [scrollbar-width:none] sm:-mx-10 sm:scroll-px-10 sm:px-10 md:mx-px md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-rows-[repeat(6,auto)] [&::-webkit-scrollbar]:hidden ${n === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
    >
      {tiers.map((t, i) => {
        const shown = picks ? (picks[t.id] ?? []).filter((h) => t.includes.includes(h)) : (t.highlights ?? t.includes);
        const [first, ...rest] = t.includes;
        const legacy = first?.startsWith("Everything in ") ? `${first}, plus` : null;
        const all = legacy ? rest : t.includes;
        const lead = t.includesLead ?? legacy;
        return (
          <li key={t.id} className={`flex flex-col py-8 lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:py-10 ${edges(i, n)}`}>
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-cal-ui)] text-[1.125rem] leading-none tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.375rem] font-semibold uppercase leading-none tracking-[-0.03em] text-ink-1000">{t.name}</span>
                </h3>
                {t.featured ? <Recommended className="flex shrink-0" /> : null}
              </div>
              {t.meta ? <p className="mt-2 text-[0.875rem] text-ink-700">{t.meta}</p> : null}
            </div>

            <p className="mt-6 flex flex-wrap items-baseline gap-x-1.5 text-ink-1000">
              {t.from ? <span className="text-[0.875rem] text-ink-700">from</span> : null}
              <span className="display text-[clamp(2.5rem,3.1vw,3.25rem)] leading-none">
                {site.currencySymbol}
                {fmt.format(t.price)}
              </span>
              <span className="text-[0.875rem] text-ink-700">{t.cadence === "month" ? "/month" : "/project"}</span>
            </p>

            <ul className="mt-6 grid content-start gap-2.5 border-t border-ink-300 pt-5">
              {shown.map((h) => (
                <li key={h} className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-900">
                  <span aria-hidden="true" className="text-accent">
                    +
                  </span>
                  <span>
                    <Rich text={h} />
                  </span>
                </li>
              ))}
            </ul>

            {/* Light bands: the recommended plan's bar is black, the rest white. */}
            <div className="mt-8 lg:self-end">
              <HeroCta light={onDark || !t.featured} sr={t.name} />
            </div>

            {t.delivery ? (
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-700">
                <span className="font-semibold text-ink-900">Timeframe:</span> {t.delivery}
              </p>
            ) : (
              <span aria-hidden="true" className="hidden lg:block" />
            )}

            {shown !== t.includes ? (
              <details className="disclosure group mt-3 border-t border-ink-300">
                <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-ink-1000 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden ${LABEL}`}>
                  Full list ({all.length})
                  <span aria-hidden="true" className="text-base transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="pb-2">
                  {t.summary ? <p className="text-[0.875rem] leading-relaxed text-ink-800">{t.summary}</p> : null}
                  {lead ? <p className={`mt-4 ${LABEL} text-ink-700`}>{lead}</p> : null}
                  <ul className="mt-3 grid gap-2">
                    {all.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[0.875rem] leading-snug text-ink-900">
                        <span aria-hidden="true" className="text-ink-600">
                          +
                        </span>
                        <span>
                          <Rich text={it} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ) : (
              <span aria-hidden="true" className="hidden lg:block" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
