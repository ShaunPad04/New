import {
  buildStandards,
  geoOutcome,
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
      className="on-light relative scroll-mt-24 border-t border-ink-300"
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

        {/*
          GEO gets its own band rather than a fifth cell in the row above.
          A number nobody has seen before needs a sentence explaining what it
          measures and why a bad one costs money — and that does not fit in a
          stat cell. It is also the differentiator, so it should not read as
          one more figure in a line of four.
        */}
        {outcomes.length > 0 ? (
          <div className="bezel mt-14">
            <div className="bezel-core flex flex-col gap-12 p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:p-14">
              <div className="max-w-[62ch]">
                <p className="field-label text-ink-600">AI search</p>
                <h3 className="display mt-4 max-w-[18ch] text-display-sm text-ink-1000">
                  Most sites are invisible to AI.
                </h3>
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-800">
                  Ask ChatGPT, Perplexity or Google&rsquo;s AI Overviews to
                  recommend someone in your sector and the answer is built from
                  the handful of sources the model can parse, verify and quote.
                  Most sites we audit score in the low forties: the facts sit
                  inside images and scripts, the pages carry no structured data,
                  and nothing states plainly who the business is or what it
                  sells. An engine cannot cite what it cannot read, so it names
                  a competitor instead — and that enquiry never reaches you.
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-800">
                  We rebuild the structure, the markup and the copy so a model
                  can lift a clean, attributable answer straight off the page,
                  and we track which engines start naming you.
                </p>
              </div>

              {/* Before and after, as one object. Two figures with an arrow
                  between them says "this moved" in a way two stat cells side
                  by side never do. */}
              <div className="shrink-0">
                <div className="flex items-center gap-6 sm:gap-8">
                <div>
                  <p className="display text-[clamp(2.5rem,6vw,3.5rem)] normal-case! leading-none tabular-nums text-ink-600">
                    {geoOutcome.before}
                  </p>
                  <p className="mt-3 max-w-[14ch] text-xs leading-relaxed text-ink-600">
                    {geoOutcome.beforeLabel}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="text-2xl text-ink-500 sm:text-3xl"
                >
                  →
                </span>

                <div>
                  <p className="display text-[clamp(2.5rem,6vw,3.5rem)] normal-case! leading-none tabular-nums text-ink-1000">
                    {geoOutcome.after}
                  </p>
                  <p className="mt-3 max-w-[14ch] text-xs leading-relaxed text-ink-800">
                    {geoOutcome.afterLabel}
                  </p>
                </div>
                </div>
                <p className="mt-8 text-xs text-ink-600">{geoOutcome.detail}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* The half that is verifiable, and the invitation to check it. */}
        <div className="bezel mt-6">
          <div className="bezel-core flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-[34ch]">
              <p className="field-label text-ink-600">Measured on this page</p>
              {/* The invitation to verify is the point of this panel, so the
                  copy has to be precise about what it is inviting. It names
                  the tool and the form factor, because a prospect who runs
                  PageSpeed on desktop should see these figures and one who
                  runs it on mobile should not feel misled. WCAG 2.2 AA lives
                  here rather than in the figures: it is a standard we hold to,
                  not a score, and the automated suite is what enforces it. */}
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-800">
                Every build is audited before it ships: WCAG 2.2 AA and 100
                for best practices, held there by an automated suite that runs
                on every commit. Put this page through PageSpeed Insights
                yourself — these are its desktop figures.
              </p>
            </div>

            {/*
              THE STANDARDS AS PLATES, adapted from a reference the client
              sent: figures on cards that rise and settle as they enter,
              rather than four bare numbers in a row.

              These are the figures that carry the argument — real, measured
              on this page, and the only ones here that survive to a public
              build — so they had the weakest presentation on the section and
              now have the strongest. The card is the same double-bezel
              language the rest of the site uses, so the treatment is borrowed
              from ourselves rather than from the reference.

              The entrance is `Reveal` with a per-card delay, which already
              resolves blur, opacity and translate together and already stops
              dead under `prefers-reduced-motion`. A second scroll subscription
              to scale them was tried and dropped: this page spends its scroll
              budget on the pinned hero, and one more per-frame reader is
              exactly what tonight's frame-timing work said not to add.
            */}
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {buildStandards.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 0.08}>
                  <div className="bezel h-full">
                    <div className="bezel-core flex h-full flex-col justify-between gap-6 p-5 sm:p-6">
                      <p className="display text-[clamp(2rem,3.4vw,2.75rem)] normal-case! leading-none tabular-nums text-ink-1000">
                        {s.value}
                      </p>
                      <div>
                        <p className="text-sm font-medium tracking-tight text-ink-1000">
                          {s.label}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                          {s.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
