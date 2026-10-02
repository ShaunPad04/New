import { buildStandards, site } from "@/lib/content";
import { CountUp } from "@/components/ui/count-up";
import { Block, LABEL } from "./page-grid";

/**
 * "Proof you can run yourself." in the inner pages' system (2026-10-02), for
 * a light band: the measured build standards as a ruled row of numbers with
 * names (no cards: a measurement does not need a container), and the open
 * invitation to check them. Only `buildStandards`, never a client figure.
 */
export function ProofBand({ index }: { index: string }) {
  return (
    <Block index={index} label="Measured" id="proof-heading" heading="Proof you can run yourself.">
      <ul className="grid grid-cols-2 border-t border-ink-300 lg:grid-cols-4">
        {buildStandards.map((s, i) => (
          <li key={s.id} className={`border-b border-ink-300 py-7 lg:border-b-0 lg:py-9 ${i % 2 ? "pl-5" : "pr-5"} lg:px-5 lg:first:pl-0 lg:[&:not(:first-child)]:border-l`}>
            <p className="display text-[clamp(2.75rem,4.6vw,4.5rem)] normal-case! leading-none text-ink-1000">
              <CountUp value={s.value} />
            </p>
            <p className="mt-4 text-[0.9375rem] font-semibold tracking-[-0.02em] text-ink-1000">{s.label}</p>
            <p className="mt-1 text-[0.8125rem] leading-snug text-ink-700">{s.detail}</p>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-[48ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">
          No borrowed numbers. Each one is measured on this site with Google&rsquo;s PageSpeed Insights: put any page through it and check us.
        </p>
        <a
          href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(site.url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex min-h-11 shrink-0 items-center gap-2 text-ink-1000 transition-colors hover:text-accent ${LABEL}`}
        >
          Run it yourself
          <span aria-hidden="true" className="text-base transition-transform duration-500 group-hover:rotate-180">
            +
          </span>
          <span className="sr-only">(PageSpeed Insights, opens in a new tab)</span>
        </a>
      </div>
    </Block>
  );
}
