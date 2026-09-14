import { comparison } from "@/lib/content";
import { Cta } from "@/components/cta";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * WHY US — a three-way comparison matrix, built to sell.
 *
 * Adapted from a reference the client sent. The reference scores every cell
 * with a tick, a warning triangle or a cross; this version keeps the ticks
 * and drops the triangles and crosses, and the reasons are on `comparison`
 * in content.ts. Short version: a tick in OUR column is an affirmative claim
 * about our own service, a cross in theirs is a verdict on firms nobody here
 * has seen. The asymmetry sells just as hard and costs nothing legally.
 *
 * SO THE SELLING IS DONE WITH WEIGHT, not with marks against anyone. Our
 * column is the lit plate, ticked, set a size up with a lead line landing
 * the point before the detail; the alternatives sit a size down and two
 * steps down the ink scale. A reader scanning the block sees one column
 * answering and two columns qualifying, which is the argument.
 *
 * WHERE IT SITS: between the measured results and the price. The reader has
 * just seen what we hold ourselves to; this frames the figure that follows,
 * and hands off to the enquiry form at the foot of the plate.
 *
 * LAYOUT. One set of cells, two arrangements. Below `lg` each row stacks —
 * hung index and label, our answer on a full-bleed lit band, then the two
 * alternatives. From `lg` the row wrapper collapses with `lg:contents` so
 * its children become cells of the parent grid and the matrix assembles
 * itself. No duplicated markup, no table, nothing hidden at either width.
 */
function Tick() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="mt-[0.3rem] h-3 w-3 shrink-0 text-ink-1000"
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

export function Comparison() {
  const { columns, rows, close } = comparison;
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
          className="display text-display-md max-w-[19ch] text-ink-1000"
        >
          <RevealWords text={comparison.heading[0]} />
          <span className="block text-ink-600">
            <RevealWords text={comparison.heading[1]} />
          </span>
        </h2>

        <Reveal className="mt-8 max-w-[62ch]" variant="unblur">
          <p className="text-[0.9375rem] leading-relaxed text-ink-800">
            {comparison.lede}
          </p>
        </Reveal>

        <Reveal className="mt-12 lg:mt-16" variant="settle">
          <div className="bezel">
            <div className="bezel-core overflow-hidden px-6 py-2 sm:px-8 lg:p-0">
              <div className="lg:grid lg:grid-cols-[minmax(0,0.82fr)_repeat(3,minmax(0,1fr))]">
                {/* Header band, desktop only — on a phone each answer names
                    its own column, because a header six rows above it is not
                    a label. Our name is set in the DISPLAY face against the
                    others' mono, so the hierarchy is carried by the typeface
                    before any tint is involved. */}
                <div className="hidden lg:contents">
                  <span aria-hidden="true" className="border-b border-ink-300" />
                  <p className="display rounded-t-[1.4rem] border-x border-b border-ink-300 bg-ink-1000/[0.07] px-7 pt-7 pb-5 text-[1.0625rem] tracking-[0.12em] text-ink-1000">
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
                    <div
                      key={row.label}
                      className="border-b border-ink-300 py-6 last:border-0 lg:contents"
                    >
                      <div
                        className={`flex items-baseline gap-3 lg:py-8 lg:pr-6 lg:pl-8 ${rule}`}
                      >
                        {/* `ink-600`, not a fainter ghost: it is REAL TEXT,
                            and axe reads rendered text whatever the
                            accessibility tree says — `aria-hidden` is not an
                            exemption from the contrast rule (learned on the
                            process numerals). `ink-600` is the lowest value
                            on this scale clearing AA on `ink-0`. */}
                        <span
                          aria-hidden="true"
                          className="font-mono text-[0.625rem] text-ink-600 tabular-nums"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="field-label text-ink-700">{row.label}</h3>
                      </div>

                      <div
                        className={`-mx-6 mt-3.5 bg-ink-1000/[0.07] px-6 py-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:border-x lg:border-ink-300 lg:px-7 lg:py-8 ${
                          i === last ? "lg:rounded-b-[1.4rem]" : rule
                        }`}
                      >
                        <div className="flex gap-3">
                          <Tick />
                          <div className="min-w-0">
                            <p className="text-[1rem] leading-snug font-medium text-ink-1000">
                              {row.lead}
                            </p>
                            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-800">
                              {row.ours}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p
                        className={`mt-5 text-[0.875rem] leading-relaxed text-ink-600 lg:mt-0 lg:px-7 lg:py-8 ${rule}`}
                      >
                        <span className="lg:hidden">
                          <span className="field-label mb-2 text-ink-600">
                            {columns[1]}
                          </span>
                        </span>
                        {row.agency}
                      </p>

                      <p
                        className={`mt-4 text-[0.875rem] leading-relaxed text-ink-600 lg:mt-0 lg:border-l lg:border-ink-300 lg:px-7 lg:py-8 ${rule}`}
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

              {/* The close sits on the plate, full width, OUTSIDE the lit
                  column — the argument has been made by then and the reader
                  should be looking at one button, not back up at a grid. */}
              <div className="-mx-6 mt-2 flex flex-col gap-6 border-t border-ink-300 px-6 py-8 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 lg:py-9">
                <div>
                  <p className="text-[0.9375rem] leading-snug font-medium text-ink-1000">
                    {close.lead}
                  </p>
                  <p className="mt-2 max-w-[48ch] text-[0.875rem] leading-relaxed text-ink-600">
                    {close.body}
                  </p>
                </div>
                <Cta href={close.cta.href}>{close.cta.label}</Cta>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 max-w-[58ch] text-[0.8125rem] leading-relaxed text-ink-600">
          {comparison.note}
        </p>
      </div>
    </section>
  );
}
