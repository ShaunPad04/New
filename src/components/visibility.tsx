import {
  visibilitySurfaces,
  scoreStats,
  auditCriteria,
  SHOW_SCORE_BENCHMARK,
  SCORE_BENCHMARK_VERIFIED,
} from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { ScoreBar } from "@/components/score-bar";

/**
 * VISIBILITY — SEO / AEO / GEO
 *
 * Two compositions from the client's references, stacked:
 *
 *   1. The stat band — a small parenthesised marker, an oversized two-line
 *      section word, a paragraph set against its right edge, then a row of
 *      figures divided by verticals under a measuring-rule tick rail.
 *   2. The surface rows — a giant figure on the left against a vertical
 *      accent rule, title and prose on the right, separated by hairlines.
 *
 * The reference sets its figures and units in red. The palette here is
 * monochrome by decision, so the unit takes the quiet ink instead and the
 * figure keeps full white — the same hierarchy, without introducing colour.
 *
 * ── On the numbers ──
 * Every figure is gated behind SHOW_SCORE_BENCHMARK. They are objective
 * comparative performance claims and the UK CAP Code requires documentary
 * evidence before they may be advertised. On a preview they render so the
 * design can be signed off; on an indexable build without evidence they are
 * withheld and the section falls back to the methodology, which is true
 * regardless. See src/lib/content.ts.
 */
export function Visibility() {
  return (
    <section
      id="visibility"
      aria-labelledby="visibility-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        {/* ---------- Band head ---------- */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <p className="field-label lg:col-span-2 lg:pt-3">(Why us)</p>

          <h2
            id="visibility-heading"
            className="section-word lg:col-span-6 lg:col-start-4"
          >
            The score
            <br />
            <span className="text-ink-1000">is the product</span>
          </h2>

          <Reveal
            className="self-end lg:col-span-3 lg:col-start-10"
            delay={0.1}
          >
            <p className="max-w-[38ch] leading-relaxed text-ink-800">
              Search is three surfaces now, not one. We engineer for all of
              them and hand over the audit that proves it — the same audit we
              ran on your old site before we started.
            </p>
          </Reveal>
        </div>

        {/* ---------- Stat row ---------- */}
        {SHOW_SCORE_BENCHMARK ? (
          <>
            {!SCORE_BENCHMARK_VERIFIED ? (
              <div className="mt-14 rounded-xl border border-dashed border-ink-500 px-5 py-4">
                <p className="text-sm leading-relaxed text-ink-800">
                  <strong className="font-medium text-ink-1000">
                    Sample figures — for design review only.
                  </strong>{" "}
                  These scores are shown so the layout can be signed off. They
                  are comparative performance claims, so before this page is
                  published they need the audit exports behind them and a
                  stated methodology and sample. Until then they cannot reach a
                  public build.
                </p>
              </div>
            ) : null}

            <Reveal className="mt-12" delay={0.05}>
              <div className="tick-rail h-2.5 w-full" aria-hidden="true" />
              <dl className="grid border-t border-ink-400 sm:grid-cols-2 lg:grid-cols-4">
                {scoreStats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={[
                      "px-0 py-10 sm:px-8 lg:px-10",
                      // Verticals between cells, as in the reference — never
                      // an outer border, which would box the band in.
                      i > 0 ? "sm:border-l sm:border-ink-300" : "",
                      i === 2 ? "lg:border-l" : "",
                      i >= 2 ? "border-t border-ink-300 sm:border-t-0" : "",
                      i === 1 ? "border-t border-ink-300 sm:border-t-0" : "",
                      i === 0 ? "sm:pl-0 lg:pl-0" : "",
                    ].join(" ")}
                  >
                    <dd className="stat-figure text-ink-1000">
                      {stat.value}
                      <span className="text-[0.5em] tracking-normal text-ink-600">
                        {stat.unit}
                      </span>
                    </dd>
                    <dt className="mt-5 max-w-[22ch] text-sm leading-relaxed text-ink-700">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </>
        ) : (
          <p className="mt-14 max-w-[62ch] leading-relaxed text-ink-700">
            Audit scores publish here once the underlying reports are ready to
            stand behind. We would rather show you the methodology below and
            run it live against your own site.
          </p>
        )}

        {/* ---------- Surface rows ---------- */}
        <ul className="mt-24 border-t border-ink-300 lg:mt-32">
          {visibilitySurfaces.map((surface, i) => (
            <Reveal as="li" key={surface.id} delay={i * 0.05}>
              <article className="group grid gap-8 border-b border-ink-300 py-12 lg:grid-cols-12 lg:gap-12 lg:py-16">
                {/* Figure, against the vertical accent rule. */}
                <div className="flex items-start gap-6 lg:col-span-4">
                  <span
                    aria-hidden="true"
                    className="mt-2 block h-16 w-px shrink-0 bg-ink-600 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] lg:group-hover:h-24 lg:group-hover:bg-ink-1000"
                  />
                  <div>
                    <p className="display text-display-sm text-ink-1000">
                      {surface.abbr}
                    </p>
                    <p className="mt-2 text-sm text-ink-700">{surface.name}</p>
                    <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-600">
                      {surface.engines}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="max-w-[52ch] leading-relaxed text-ink-800">
                    {surface.body}
                  </p>
                </div>

                {SHOW_SCORE_BENCHMARK ? (
                  <div className="lg:col-span-3">
                    <ScoreBar
                      before={surface.before}
                      after={surface.after}
                      label={`${surface.abbr} audit score`}
                    />
                  </div>
                ) : null}
              </article>
            </Reveal>
          ))}
        </ul>

        {/* ---------- Methodology ----------
            The scores mean nothing without this. A figure nobody can
            reproduce is a slogan, not a claim. */}
        <Reveal className="mt-20" delay={0.05}>
          <p className="field-label">What the audit measures</p>
          <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {auditCriteria.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-t border-ink-300 pt-4 text-sm leading-relaxed text-ink-700"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 block h-px w-3 shrink-0 bg-ink-500"
                />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
