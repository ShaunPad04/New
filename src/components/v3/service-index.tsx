import Link from "next/link";
import { publishedServicePages, servicePages, services } from "@/lib/content";
import { automationPage } from "@/lib/ai-automation";
import { Reveal } from "@/components/reveal";
import { H2, LABEL, SectionLabel } from "./page-grid";

const pageLabel = (slug: string) => servicePages.find((p) => p.slug === slug)?.label ?? slug;

/** The hero's third column on /services: the six disciplines as jump links. */
export function ServiceJump() {
  return (
    <ol className={LABEL}>
      {services.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="flex min-h-9 items-center justify-between gap-4 border-b border-white/12 text-ink-700 transition-colors hover:text-ink-1000">
            {s.title}
            <span className="tabular-nums text-ink-600">{s.index}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * The six disciplines on /services (2026-10-02), for a light band on the
 * hero's grid: the number and name in the first column, the one-line
 * summary and the way to the full page in the second, and everything the
 * discipline includes, counted, in the third (the counted sub-list from the
 * page blueprint, so one service reads as the six things it is). The long
 * paragraphs live on each service's own page. Then the two services with no
 * discipline of their own: creative and AI automation (/ai).
 */
export function ServiceIndex({ index }: { index: string }) {
  const extra = [
    ...publishedServicePages.filter((p) => p.serviceIds.length === 0).map((p) => ({ href: `/services/${p.slug}`, label: p.label, lede: p.lede })),
    automationPage,
  ];
  return (
    <section aria-labelledby="disciplines-heading" className="relative z-[2] py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-0">
        <SectionLabel index={index} label="What we do" className="lg:pr-10" />
        <h2 id="disciplines-heading" className={`${H2} lg:col-span-2 lg:pl-3`}>
          Six disciplines. One team accountable.
        </h2>
      </div>

      <ol className="mt-14 border-t border-ink-1000 lg:mt-20">
        {services.map((s) => (
          <li key={s.id} id={s.id} className="scroll-mt-24 border-b border-ink-300">
            {/* Desktop: name | summary over the link | the list. Phones read
                name, summary, list, then the link, so it ends each block. */}
            <Reveal variant="slide" className="grid gap-6 py-10 lg:grid-cols-3 lg:grid-rows-[auto_1fr] lg:gap-0 lg:py-12">
              <div className="flex items-baseline gap-5 lg:row-span-2 lg:pr-10">
                <span className="font-[family-name:var(--font-cal-ui)] text-[1.75rem] leading-none tabular-nums text-accent">{s.index}</span>
                <h3 className="text-[clamp(1.5rem,2.3vw,2.25rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] text-ink-1000">{s.title}</h3>
              </div>
              <p className="max-w-[34ch] text-[1.25rem] leading-[1.35] tracking-[-0.03em] text-ink-900 lg:pl-3 lg:pr-10">{s.summary}</p>
              <div className="lg:row-span-2 lg:pl-3">
                <p className={`${LABEL} text-ink-700`}>
                  Includes <span className="tabular-nums text-accent">({s.capabilities.length})</span>
                </p>
                {/* Phones: plain tight lines. Desktop: the ruled list. */}
                <ul className="mt-3 space-y-1.5 lg:mt-2 lg:space-y-0">
                  {s.capabilities.map((c) => (
                    <li key={c} className="text-[0.9375rem] leading-snug text-ink-800 lg:border-b lg:border-ink-300 lg:py-2.5 lg:last:border-b-0">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="-mt-1 lg:col-start-2 lg:mt-2 lg:pl-3">
                <Link href={`/services/${s.page}`} className={`group inline-flex min-h-11 items-center gap-2 text-ink-1000 transition-colors hover:text-accent ${LABEL}`}>
                  Full details
                  <span className="sr-only">: {pageLabel(s.page)}</span>
                  <span aria-hidden="true" className="text-base transition-transform duration-500 group-hover:rotate-180">
                    +
                  </span>
                </Link>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      {extra.length ? (
        <div className="grid gap-8 pt-14 lg:grid-cols-3 lg:gap-0 lg:pt-20">
          <p className={`${LABEL} text-ink-700 lg:pr-10`}>Also from the studio</p>
          {extra.map((p, i) => (
            <Link key={p.href} href={p.href} className={`group block border-t border-ink-1000 pt-5 lg:pr-10 ${i ? "lg:pl-10" : "lg:pl-3"}`}>
              <h3 className="text-[1.375rem] font-semibold leading-tight tracking-[-0.03em] text-ink-1000">{p.label}</h3>
              <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-700">{p.lede}</p>
              <span className={`mt-5 inline-flex min-h-11 items-center gap-2 text-ink-1000 transition-colors group-hover:text-accent ${LABEL}`}>
                Full details
                <span aria-hidden="true" className="text-base transition-transform duration-500 group-hover:rotate-180">
                  +
                </span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}
