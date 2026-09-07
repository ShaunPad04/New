import {
  buildStandards,
  PLACEHOLDER_OUTCOMES,
  SHOW_RESULTS,
  type Outcome,
} from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * RESULTS — the numbers.
 *
 * A studio that sells performance has to show performance, so this section
 * carries two kinds of figure and keeps them visibly apart, because they are
 * not the same kind of thing:
 *
 *  1. **Client outcomes** — load time, Lighthouse score, enquiries, bounce.
 *     These are the ones a prospect wants. They are currently INVENTED
 *     SAMPLES and gated by `SHOW_RESULTS`: they render on the private preview
 *     and `pnpm verify` hard-fails any indexable build that still carries
 *     them. A fabricated conversion figure is the most dangerous claim on an
 *     agency site — more so than an invented quote, because a number reads as
 *     measured rather than as an opinion.
 *
 *  2. **Our own build standards** — accessibility, layout shift, WCAG. These
 *     are real, measured on this page, and reproducible by anyone who opens
 *     DevTools, so they are not gated and they survive to production. They
 *     are also the better argument: a web studio quoting its own audited
 *     build beats a studio quoting a number nobody can check, and inviting
 *     the reader to run Lighthouse themselves is a claim only a studio
 *     confident in its work can make.
 *
 * When the outcome figures are hidden, the standards strip still renders —
 * the section degrades to the half that is true rather than disappearing.
 */
export function Results() {
  const outcomes: Outcome[] = SHOW_RESULTS ? PLACEHOLDER_OUTCOMES : [];

  return (
    <section
      id="results"
      aria-labelledby="results-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-[50ch]">
            <p className="eyebrow mb-6">By the numbers</p>
            <h2
              id="results-heading"
              className="display text-display-md text-ink-1000"
            >
              <RevealWords text="A faster site sells more." />
            </h2>
          </div>
          <p className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-700">
            Speed is not a vanity metric. It is the first thing a visitor
            experiences and the last thing most agencies measure. We treat it
            as the product, and we report against enquiries rather than
            rankings.
          </p>
        </div>

        {outcomes.length > 0 ? (
          <ul className="mt-14 grid grid-cols-2 border-t border-ink-300 lg:mt-20 lg:grid-cols-4">
            {outcomes.map((o, i) => (
              <Reveal as="li" key={o.id} delay={i * 0.06}>
                <div className="flex h-full flex-col justify-start gap-5 border-b border-ink-300 py-8 pr-6 sm:justify-between sm:gap-10 lg:py-12 lg:pr-8">
                  {/* Tabular figures so the four columns align on the digit
                      rather than on the glyph, which is what stops a row of
                      numbers reading as four unrelated headlines. */}
                  <p className="display text-[clamp(2.25rem,5vw,4rem)] normal-case! leading-none tabular-nums text-ink-1000">
                    {o.value}
                  </p>
                  <div>
                    <p className="text-[0.9375rem] font-medium tracking-tight text-ink-1000">
                      {o.label}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      {o.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        ) : null}

        {/* The half that is verifiable, and the invitation to check it. */}
        <div className="bezel mt-14">
          <div className="bezel-core flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-[34ch]">
              <p className="field-label text-ink-600">Measured on this page</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-800">
                Every build is audited before it ships — accessibility, layout
                stability and Core Web Vitals. Run Lighthouse on this page
                yourself; these are the numbers it returns.
              </p>
            </div>

            <ul className="flex flex-wrap gap-x-12 gap-y-8">
              {buildStandards.map((s) => (
                <li key={s.id}>
                  <p className="display text-4xl normal-case! leading-none tabular-nums text-ink-1000">
                    {s.value}
                  </p>
                  <p className="mt-3 text-sm font-medium tracking-tight text-ink-1000">
                    {s.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">
                    {s.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
