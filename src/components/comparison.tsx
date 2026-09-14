import { comparison } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * WHAT YOU'RE ACTUALLY COMPARING — a three-way comparison matrix.
 *
 * Adapted from a reference the client sent: a "why us" grid with our column
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
 * FRAMING. The first build set the matrix flat on the page ground with
 * horizontal hairlines and a bare background tint behind our column, and it
 * read as an unfinished table: columns with no edges, a highlight that
 * bled away at top and bottom, and a right edge that simply stopped. This
 * site's rule is that nothing premium sits flat on the background, so the
 * whole matrix is now a double-bezel plate — the house card — and the
 * columns are divided by real hairlines inside it. Our column is an inset
 * band a step up the ink scale (`ink-200` on the core's `ink-100`), capped
 * with the plate's own radius at top and bottom so it reads as a deliberate
 * inlay rather than a fill that ran out.
 *
 * LAYOUT. One set of cells, two arrangements. Below `lg` each row stacks —
 * the hung index and label, our answer on a full-bleed band, then the two
 * alternatives a step down the ink scale. From `lg` the row wrapper
 * collapses with `lg:contents` so its children become cells of the parent
 * grid and the matrix assembles itself. No duplicated markup, no table, and
 * nothing hidden at either width.
 */
export function Comparison() {
  const { columns, rows } = comparison;
  const last = rows.length - 1;

  return (
    <section
      aria-labelledby="comparison-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <p className="eyebrow eyebrow-plain mb-6">{comparison.eyebrow}</p>

        <h2
          id="comparison-heading"
          className="display text-display-md max-w-[21ch] text-ink-1000"
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

        <Reveal className="mt-12 lg:mt-16" variant="settle">
          <div className="bezel">
            <div className="bezel-core overflow-hidden px-6 py-2 sm:px-8 lg:grid lg:grid-cols-[minmax(0,0.82fr)_repeat(3,minmax(0,1fr))] lg:p-0">
              {/* Header band. Desktop only — on a phone each answer names its
                  own column, because a header six rows above it is not a
                  label. Our name is set in the DISPLAY face against the
                  others' mono: the hierarchy is carried by the typeface, so
                  no colour and no badge is needed to say which column is
                  ours. */}
              <div className="hidden lg:contents">
                <span aria-hidden="true" className="border-b border-ink-300" />
                <p className="display rounded-t-[1.4rem] border-x border-b border-ink-300 bg-ink-1000/[0.055] px-7 pt-7 pb-5 text-[0.9375rem] tracking-[0.12em] text-ink-1000">
                  {columns[0]}
                </p>
                {columns.slice(1).map((column) => (
                  <p
                    key={column}
                    className="field-label border-b border-ink-300 px-7 pt-8 pb-6 text-ink-600"
                  >
                    {column}
                  </p>
                ))}
              </div>

              {rows.map((row, i) => {
                /* The last row carries no rule: the plate's own edge closes
                   the matrix, and a hairline sitting just inside a rounded
                   corner is the detail that makes a table look unfinished. */
                const rule = i === last ? "" : "lg:border-b lg:border-ink-300";

                return (
                /* NOT wrapped in a Reveal: `display: contents` removes the
                   box, so a transform or an opacity set on it has nothing to
                   apply to and the row would simply not animate at `lg`. The
                   plate arrives as one object, which is the section's single
                   motion moment. */
                <div
                  key={row.label}
                  className="border-b border-ink-300 py-6 last:border-0 lg:contents"
                >
                  <div
                    className={`flex items-baseline gap-3 lg:py-8 lg:pr-6 lg:pl-8 ${rule}`}
                  >
                    {/* `ink-600`, not a fainter ghost: it is REAL TEXT, and
                        axe reads rendered text whatever the accessibility
                        tree says — `aria-hidden` is not an exemption from
                        the contrast rule (learned on the process numerals).
                        `ink-600` is the lowest value on this scale clearing
                        AA on `ink-0`, and sitting a step under the label's
                        `ink-700` it still reads as an index rather than a
                        second label. */}
                    <span
                      aria-hidden="true"
                      className="font-mono text-[0.625rem] text-ink-600 tabular-nums"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="field-label text-ink-700">{row.label}</h3>
                  </div>

                  <p
                    className={`-mx-6 mt-3.5 bg-ink-1000/[0.055] px-6 py-4 text-[0.9375rem] leading-relaxed text-ink-1000 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:border-x lg:border-ink-300 lg:px-7 lg:py-8 ${
                      i === last ? "lg:rounded-b-[1.4rem]" : rule
                    }`}
                  >
                    {row.ours}
                  </p>

                  <p
                    className={`mt-5 text-[0.875rem] leading-relaxed text-ink-600 lg:mt-0 lg:px-7 lg:py-8 lg:text-[0.9375rem] lg:text-ink-700 ${rule}`}
                  >
                    <span className="lg:hidden">
                      <span className="field-label mb-2 text-ink-600">
                        {columns[1]}
                      </span>
                    </span>
                    {row.agency}
                  </p>

                  <p
                    className={`mt-4 text-[0.875rem] leading-relaxed text-ink-600 lg:mt-0 lg:border-l lg:border-ink-300 lg:px-7 lg:py-8 lg:text-[0.9375rem] lg:text-ink-700 ${rule}`}
                  >
                    <span className="lg:hidden">
                      <span className="field-label mb-2 text-ink-600">
                        {columns[2]}
                      </span>
                    </span>
                    {row.freelancer}
                  </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <p className="mt-8 max-w-[56ch] text-[0.8125rem] leading-relaxed text-ink-600">
          {comparison.note}
        </p>
      </div>
    </section>
  );
}
