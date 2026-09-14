import { comparison } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * WHAT YOU'RE ACTUALLY COMPARING — a three-way comparison matrix.
 *
 * Built from a reference the client sent: a "why us" grid with our column
 * lit and two alternatives beside it. WHAT WAS ADAPTED rather than copied is
 * the scoring. The reference marks every cell with a tick, a warning
 * triangle or a cross, which turns a comparison into a verdict on firms we
 * have never seen. This version carries no marks at all — our column is
 * simply brighter, and the difference between the columns is the sentences
 * themselves. See the long comment on `comparison` in content.ts for why
 * that is a legal requirement here and not a stylistic preference.
 *
 * WHERE IT SITS: between the measured results and the price. The reader has
 * just been shown what we hold ourselves to; this frames the figure that
 * follows before they see it.
 *
 * LAYOUT. One set of cells, two arrangements. Below `lg` each row stacks —
 * dimension, our answer, then the two alternatives a step down the ink scale
 * — which is the same hung-label editorial treatment the service rows and
 * process steps use on a phone. From `lg` the row wrapper collapses with
 * `lg:contents` so its four children become four cells of the parent grid
 * and the matrix assembles itself. No duplicated markup, no table, and
 * nothing hidden at either width.
 */
export function Comparison() {
  const { columns, rows } = comparison;

  return (
    <section
      aria-labelledby="comparison-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <p className="eyebrow eyebrow-plain mb-6">{comparison.eyebrow}</p>

        <h2
          id="comparison-heading"
          className="display text-display-md max-w-[16ch] text-ink-1000"
        >
          <RevealWords text={comparison.heading[0]} />
          <span className="block text-ink-600">
            <RevealWords text={comparison.heading[1]} />
          </span>
        </h2>

        <Reveal className="mt-8 max-w-[58ch]" variant="unblur">
          <p className="text-[0.9375rem] leading-relaxed text-ink-800">
            {comparison.lede}
          </p>
        </Reveal>

        <div className="mt-12 lg:mt-20 lg:grid lg:grid-cols-[minmax(0,0.8fr)_repeat(3,minmax(0,1fr))]">
          {/* Header row. Desktop only: on a phone each answer carries its own
              label, because a header six rows above it is not a label. */}
          <div className="hidden lg:contents">
            <span aria-hidden="true" className="border-b border-ink-300" />
            {columns.map((column, i) => (
              <p
                key={column}
                className={`field-label border-b border-ink-300 px-6 pb-5 ${
                  i === 0 ? "bg-ink-100 text-ink-1000" : "text-ink-600"
                }`}
              >
                {column}
              </p>
            ))}
          </div>

          {rows.map((row) => (
            /* NOT wrapped in a Reveal, deliberately: `display: contents`
               removes the box, so a transform or an opacity set on it has
               nothing to apply to and the row would simply not animate at
               `lg`. The section's motion moment is the headline and the
               lede; six more staggered rows underneath it would be the
               "ten small ones" this project's brief rules out anyway. */
            <div
              key={row.label}
              className="border-b border-ink-300 py-7 last:border-0 lg:contents"
            >
              <h3 className="field-label text-ink-600 lg:border-b lg:border-ink-300 lg:py-7 lg:pr-6 lg:text-ink-700">
                {row.label}
              </h3>

              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-1000 lg:mt-0 lg:border-b lg:border-ink-300 lg:bg-ink-100 lg:px-6 lg:py-7">
                {row.ours}
              </p>

              <p className="mt-5 text-[0.875rem] leading-relaxed text-ink-600 lg:mt-0 lg:border-b lg:border-ink-300 lg:px-6 lg:py-7">
                {/* Wrapped, not `lg:hidden` on the label itself:
                    `.field-label` is unlayered and its `display: block`
                    beats the utility, so the label would survive into the
                    desktop matrix and repeat under every column header. */}
                <span className="lg:hidden">
                  <span className="field-label mb-2 text-ink-600">{columns[1]}</span>
                </span>
                {row.agency}
              </p>

              <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-600 lg:mt-0 lg:border-b lg:border-ink-300 lg:px-6 lg:py-7">
                {/* Wrapped, not `lg:hidden` on the label itself:
                    `.field-label` is unlayered and its `display: block`
                    beats the utility, so the label would survive into the
                    desktop matrix and repeat under every column header. */}
                <span className="lg:hidden">
                  <span className="field-label mb-2 text-ink-600">{columns[2]}</span>
                </span>
                {row.freelancer}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-[56ch] text-[0.8125rem] leading-relaxed text-ink-600">
          {comparison.note}
        </p>
      </div>
    </section>
  );
}
