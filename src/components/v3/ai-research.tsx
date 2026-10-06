import type { CSSProperties } from "react";
import { responseResearch as R } from "@/lib/ai-automation";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/ui/count-up";
import { TextReveal } from "@/components/ui/text-reveal";
import { ScrollText } from "@/components/kit/scroll-text";
import { FiveMinuteWindow } from "./five-minute-window";
import { H2, LABEL } from "./page-grid";

/* The audit's four answers, fastest to slowest: a grey ramp that darkens as
   the wait grows, then the accent for "never". Checked with the dataviz
   validator on black: adjacent steps separate for colour-blind readers
   (worst ΔE 11, deutan) and every fill clears 3:1 against the surface. */
const FILL: Record<string, string> = { hour: "#f0f0f0", day: "#b8b8b8", later: "#808080", never: "#f02b42" };

/**
 * WHY SPEED MATTERS — the /ai analytics band, above the stat cards (Brad,
 * 2026-10-06: "a statistic saying how many clients are lost due to
 * responses taking too long ... we need some analytics on the ai page", then
 * "some nice animated text reveal and count downs").
 *
 * Published research only, quoted as published with its source and year
 * beside it (`responseResearch` in lib/ai-automation.ts holds the figures,
 * the quotes they come from and the rules). One dashboard panel: three
 * figures that count up (the first beside a five-minute clock counting
 * down), then the HBR audit as one 100% bar whose segments fill in turn,
 * with the 42-hour average counting up beside it. The heading lights word by
 * word as it scrolls past; the lede resolves in. Under reduced motion every
 * figure, bar and word renders at rest.
 */
export function AiResearch() {
  const { audit } = R;
  return (
    <section aria-labelledby="research-heading" className="relative pt-20 lg:pt-28">
      <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
        <p className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-ink-800 ${LABEL}`}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 text-accent">
            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5V8l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {R.label}
        </p>
        <ScrollText as="h2" id="research-heading" text={R.heading} dim={0.45} className={`${H2} mt-6 text-balance`} />
        <TextReveal as="p" per="word" preset="fade-in-blur" className="mt-6 max-w-[54ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">
          {R.lede}
        </TextReveal>
      </div>

      <div className="relative mt-14 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))] lg:mt-20">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_70%_at_0%_0%,rgba(240,43,66,0.12),transparent_70%)]" />

        {/* Three figures, ruled apart like a dashboard's top row. */}
        <ul role="list" className="relative grid divide-y divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {R.stats.map((s, i) => (
            <Reveal as="li" key={s.value} variant="rise" y={14} delay={0.1 * i} className="flex flex-col p-6 sm:p-7 lg:p-9">
              <div className="flex items-start justify-between gap-4">
                <p className="display text-[clamp(3.25rem,6vw,5.5rem)] leading-[0.85] tabular-nums text-ink-1000" style={{ textTransform: "none" }}>
                  <CountUp value={s.value} />
                </p>
                {i === 0 ? <FiveMinuteWindow /> : null}
              </div>
              <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-800">{s.text}</p>
              <p className="mt-auto pt-5 text-[0.75rem] leading-snug text-ink-600 lg:pt-6">{s.source}</p>
            </Reveal>
          ))}
        </ul>

        {/* The audit: one 100% bar, fastest to slowest. */}
        <Reveal variant="rise" y={14} className="research-bar relative border-t border-white/10 p-6 sm:p-7 lg:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="max-w-[24ch] text-[1.375rem] font-semibold leading-tight tracking-[-0.035em] text-ink-1000 lg:text-[1.625rem]">{audit.title}</h3>
            <p className="flex items-baseline gap-3">
              <span className="display text-[clamp(2.75rem,4.5vw,4rem)] leading-none tabular-nums text-ink-1000">
                <CountUp value={audit.average.value} />
              </span>
              <span className="max-w-[22ch] text-[0.8125rem] leading-snug text-ink-700">
                <span className="font-semibold text-ink-1000">{audit.average.unit}.</span> {audit.average.label}
              </span>
            </p>
          </div>

          <div aria-hidden="true" className="mt-8 flex h-5 gap-[2px] overflow-hidden rounded-[4px]">
            {audit.segments.map((seg, i) => (
              <span
                key={seg.id}
                className="research-seg h-full"
                style={{ flexGrow: seg.value, flexBasis: 0, background: FILL[seg.id], "--i": i } as CSSProperties}
              />
            ))}
          </div>

          <ul role="list" className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {audit.segments.map((seg) => (
              <li key={seg.id} className="research-key flex flex-col gap-1.5 border-t border-white/10 pt-3">
                <span className="flex items-center gap-2 text-[0.8125rem] text-ink-700">
                  <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[2px]" style={{ background: FILL[seg.id] }} />
                  {seg.label}
                </span>
                <span className="font-[family-name:var(--font-display)] text-[1.75rem] leading-none tabular-nums tracking-[-0.03em] text-ink-1000">
                  <CountUp value={`${seg.value}%`} />
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-7 text-[0.75rem] leading-snug text-ink-600">
            <a href={audit.source.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/25 underline-offset-[3px] transition-colors hover:text-ink-1000 hover:decoration-white/60">
              {audit.source.text}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </Reveal>
      </div>

      <p className="mx-auto mt-10 max-w-[46ch] text-balance text-center text-[1.125rem] font-semibold leading-snug tracking-[-0.03em] text-ink-1000 lg:text-[1.375rem]">{R.bridge}</p>
      <p className="mt-3 text-center text-[0.8125rem] text-ink-600">{R.note}</p>
    </section>
  );
}
