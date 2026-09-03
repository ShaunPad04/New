import {
  PLACEHOLDER_PROJECTS,
  PORTFOLIO_VERIFIED,
  type Project,
} from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * Selected work.
 *
 * When `PORTFOLIO_VERIFIED` is false the component renders an honest
 * "publishing soon" state rather than mapping the placeholder array. This is
 * deliberate: a grid of "[Project name]" tiles reads as a broken build, and
 * inventing plausible project names and results to fill it would be a
 * fabricated claim about the business. Neither is acceptable, so the section
 * says what is actually true instead.
 */
export function Work() {
  const projects: Project[] = PORTFOLIO_VERIFIED ? PLACEHOLDER_PROJECTS : [];

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-24 border-t border-ink-300 bg-ink-50"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-[50ch]">
            <p className="eyebrow mb-6">Selected work</p>
            <h2
              id="work-heading"
              className="display text-display-md text-ink-1000"
            >
              <RevealWords text="Proof, not promises." />
            </h2>
          </div>
          <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-700">
            Every project below is measured against what it was hired to do —
            enquiries, bookings, revenue — not how it looked on launch day.
          </p>
        </div>

        {projects.length > 0 ? (
          <ul className="mt-20 grid gap-px border border-ink-300 bg-ink-300 sm:grid-cols-2">
            {projects.map((project, i) => (
              <Reveal as="li" key={project.id} delay={i * 0.06}>
                <article className="group relative flex h-full flex-col justify-between gap-16 bg-ink-0 p-8 transition-colors duration-500 hover:bg-ink-100 lg:p-12">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="display text-display-sm text-ink-1000">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-ink-700">
                        {project.sector} — {project.year}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="text-ink-600 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-ink-1000"
                    >
                      ↗
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-6">
                    <ul className="flex flex-wrap gap-2">
                      {project.scope.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-ink-400 px-3 py-1 text-xs text-ink-700"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="text-right">
                      <p className="display text-3xl text-ink-1000">
                        {project.metric}
                      </p>
                      <p className="mt-1 text-xs text-ink-600">
                        {project.metricLabel}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal>
            <div className="mt-20 border border-dashed border-ink-400 px-8 py-20 text-center lg:py-28">
              <p className="display-serif text-display-sm text-ink-800">
                Case studies publishing soon.
              </p>
              <p className="lede mx-auto mt-5 max-w-[46ch]">
                We are finishing the first set of write-ups with our clients&rsquo;
                sign-off. If you would like to see relevant work before then, ask
                and we will walk you through it directly.
              </p>
              <a
                href="#contact"
                className="mt-9 inline-flex items-center gap-3 rounded-full border border-ink-500 px-7 py-4 text-sm tracking-tight text-ink-1000 transition-colors duration-300 hover:border-ink-800"
              >
                Request the portfolio
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
