import { buildStandards } from "@/lib/content";
import { CountUp } from "@/components/ui/count-up";
import { Dots, SectionRule } from "./lurais-parts";

/**
 * 07 /STANDARDS — Lurais's "facts & figures": huge numbers with a dot and
 * a label. Here the figures are the ONLY real ones the studio has —
 * `buildStandards`, measured PageSpeed on this site (CLAUDE.md: "only real
 * figures"; re-measure before changing). No years-in-business, no client
 * counts: none exist that are true, and the template's are invented.
 */
export function LuraisStandards() {
  return (
    <section aria-labelledby="standards-heading" className="bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="07" label="Standards" />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pl-[calc(14rem+2rem)] lg:pt-24">
        <h2 id="standards-heading" className="display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.85] text-ink-1000">
          <Dots />
          This site, measured
        </h2>
        <dl className="mt-14 grid border-t border-ink-300 sm:grid-cols-2">
          {buildStandards.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-end gap-5 border-b border-ink-300 py-10 sm:px-6 ${i % 2 ? "sm:border-l" : ""}`}
            >
              <dd className="display text-[clamp(4rem,8vw,7.5rem)] leading-[0.8] text-ink-1000 tabular-nums">
                <CountUp value={s.value} />
              </dd>
              <dt className="pb-1">
                <span aria-hidden="true" className={`mb-3 block h-3 w-3 rounded-full ${i % 2 ? "bg-ink-1000" : "bg-ink-500"}`} />
                <span className="block text-[0.9375rem] font-medium text-ink-1000">{s.label}</span>
                <span className="block text-xs text-ink-600">{s.detail}</span>
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
