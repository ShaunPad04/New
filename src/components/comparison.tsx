import { comparison, type ComparisonCell, type ComparisonMark } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * WHY US — a four-column comparison matrix, rebuilt 2026-09-18 to the shape
 * of a second reference the client sent: row label, us, other agencies,
 * hiring in-house; a MARK IN EVERY CELL with a short label beside it; a
 * centred eyebrow, heading and lede above. The earlier version ticked our
 * column only and wrote prose in the others — he wants the marks across the
 * board. What each mark may say is bounded in the long comment on
 * `comparison` in content.ts; read that before changing a label.
 *
 * WHAT IS OURS IN IT. The reference is a table of hairlines on a dark
 * ground; the house standard bans a bare 1px grid, so the matrix sits inside
 * the double bezel and its rules are the same hairline every other plate on
 * the page uses. Our column is the lit plate with our name set as the
 * wordmark; the other two headers are mono field labels, so the hierarchy is
 * carried by the typeface before any tint is involved. The marks are three
 * monochrome glyphs — tick, caution triangle, cross — each with a
 * visually-hidden word, because the glyph IS the cell's verdict and a screen
 * reader should hear it.
 *
 * LAYOUT. One set of cells, two arrangements. Below `lg` each row stacks:
 * hung index and label, our answer on a full-bleed lit band, then the two
 * alternatives, each naming its own column because a header six rows up is
 * not a label. From `lg` the row wrapper collapses with `lg:contents` so its
 * children become cells of the parent grid and the matrix assembles itself.
 * No duplicated markup, no <table>, nothing hidden at either width.
 */
function Mark({ mark }: { mark: ComparisonMark }) {
  const shared =
    "mt-[0.2rem] h-3.5 w-3.5 shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]";

  if (mark === "yes") {
    return (
      <>
        <svg aria-hidden="true" viewBox="0 0 14 14" strokeWidth="1.75" className={shared}>
          <path d="M2 7.5 5.5 11 12 3.5" />
        </svg>
        <span className="sr-only">Yes: </span>
      </>
    );
  }

  if (mark === "no") {
    return (
      <>
        <svg aria-hidden="true" viewBox="0 0 14 14" strokeWidth="1.5" className={shared}>
          <path d="M3 3l8 8M11 3l-8 8" />
        </svg>
        <span className="sr-only">No: </span>
      </>
    );
  }

  return (
    <>
      <svg aria-hidden="true" viewBox="0 0 14 14" strokeWidth="1.25" className={shared}>
        <path d="M7 1.75 12.75 12H1.25Z" />
        <path d="M7 5.5v3.25" strokeWidth="1.5" />
        <path d="M7 10.6v.2" strokeWidth="1.75" />
      </svg>
      <span className="sr-only">Depends: </span>
    </>
  );
}

function Cell({
  cell,
  ours = false,
  className = "",
}: {
  cell: ComparisonCell;
  ours?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <span className={ours ? "text-ink-1000" : "text-ink-700"}>
        <Mark mark={cell.mark} />
      </span>
      <p
        className={
          ours
            ? "text-[0.9375rem] leading-snug font-medium text-ink-1000"
            : "text-[0.9375rem] leading-snug text-ink-800"
        }
      >
        {cell.text}
      </p>
    </div>
  );
}

export function Comparison() {
  const { columns, rows } = comparison;
  const last = rows.length - 1;

  return (
    <section
      aria-labelledby="comparison-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        {/* Centred opening, as the reference has it. The pill eyebrow is the
            house device for a section label and reads centred without the
            phone-only `eyebrow-plain` treatment, which exists for rows. */}
        <div className="mx-auto flex flex-col items-center text-center">
          <p className="eyebrow mb-6">{comparison.eyebrow}</p>

          {/* No width cap on the heading: capped at the lede's measure it
              balanced into a four-line stack at 1440, a poster where the
              reference has two lines. Each half of the heading is its own
              block, so given the room it sits on two lines by itself and
              `text-wrap: balance` only has to work below that. */}
          <h2
            id="comparison-heading"
            className="display text-display-md max-w-[22ch] text-ink-1000"
          >
            <RevealWords text={comparison.heading[0]} />
            <span className="block text-ink-600">
              <RevealWords text={comparison.heading[1]} />
            </span>
          </h2>

          <Reveal className="mt-8 max-w-[58ch]" variant="unblur">
            <p className="text-[0.9375rem] leading-relaxed text-ink-700">
              {comparison.lede}
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-12 lg:mt-16" variant="settle">
          <div className="bezel">
            <div className="bezel-core overflow-hidden px-6 py-2 sm:px-8 lg:p-0">
              <div className="lg:grid lg:grid-cols-[minmax(0,0.7fr)_repeat(3,minmax(0,1fr))]">
                {/* Header band, desktop only. Our column carries the
                    wordmark; the alternatives are mono field labels. */}
                <div className="hidden lg:contents">
                  <span aria-hidden="true" className="border-b border-ink-300" />
                  <div className="flex items-center rounded-t-[1.4rem] border-x border-b border-ink-300 bg-ink-1000/[0.07] px-7 pt-7 pb-6">
                    <Wordmark />
                    <span className="sr-only">{columns[0]}</span>
                  </div>
                  {columns.slice(1).map((column) => (
                    <p
                      key={column}
                      className="field-label flex items-center border-b border-ink-300 px-7 pt-7 pb-6 text-ink-700"
                    >
                      {column}
                    </p>
                  ))}
                </div>

                {rows.map((row, i) => {
                  /* The last row carries no rule: the plate's own edge closes
                     the matrix, and a hairline just inside a rounded corner is
                     the detail that makes a table look unfinished. */
                  const rule = i === last ? "" : "lg:border-b lg:border-ink-300";

                  return (
                    <div
                      key={row.label}
                      className="border-b border-ink-300 py-6 last:border-0 lg:contents"
                    >
                      <div
                        className={`flex items-baseline gap-3 lg:py-7 lg:pr-6 lg:pl-8 ${rule}`}
                      >
                        {/* `ink-600`, not a fainter ghost: it is REAL TEXT,
                            and axe reads rendered text whatever the
                            accessibility tree says. `ink-600` is the lowest
                            value on this scale clearing AA on `ink-0`. */}
                        <span
                          aria-hidden="true"
                          className="font-mono text-[0.625rem] text-ink-600 tabular-nums"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="field-label text-ink-800">{row.label}</h3>
                      </div>

                      <div
                        className={`-mx-6 mt-3.5 bg-ink-1000/[0.07] px-6 py-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:border-x lg:border-ink-300 lg:px-7 lg:py-7 ${
                          i === last ? "lg:rounded-b-[1.4rem]" : rule
                        }`}
                      >
                        <span className="sr-only">{columns[0]}: </span>
                        <Cell cell={row.ours} ours />
                      </div>

                      <div className={`mt-5 lg:mt-0 lg:px-7 lg:py-7 ${rule}`}>
                        <p className="field-label mb-2 text-ink-600 lg:sr-only">
                          {columns[1]}
                        </p>
                        <Cell cell={row.agency} />
                      </div>

                      <div
                        className={`mt-4 lg:mt-0 lg:border-l lg:border-ink-300 lg:px-7 lg:py-7 ${rule}`}
                      >
                        <p className="field-label mb-2 text-ink-600 lg:sr-only">
                          {columns[2]}
                        </p>
                        <Cell cell={row.inhouse} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mx-auto mt-8 max-w-[62ch] text-center text-[0.8125rem] leading-relaxed text-ink-600">
          {comparison.note}
        </p>
      </div>
    </section>
  );
}
