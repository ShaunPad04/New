import { projects, type Project } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";
import { WorkCard } from "@/components/work-card";
import { Cta } from "@/components/cta";

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
export function Work({
  /**
   * Renders the "View the portfolio" link under the grid. Off by default,
   * because the /portfolio route uses this same section and a link from a
   * page to itself is dead weight. The homepage passes it.
   */
  showPortfolioLink = false,
}: {
  showPortfolioLink?: boolean;
} = {}) {
  // Real, client-approved work only — never the invented placeholder set.
  const shown: Project[] = projects;

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

        {shown.length > 0 ? (
          <ul className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2">
            {shown.map((project, i) => (
              <Reveal as="li" key={project.id} delay={i * 0.06} variant="settle">
                <WorkCard project={project} />
              </Reveal>
            ))}
            {/*
              Labelled concept slots (redesign, 2026-09-11). NOT projects and
              NOT pretending to be: each says exactly what it is, which is the
              honest version of "more coming". The dashed shell is the same
              vocabulary as the empty state above, so it reads as designed
              space rather than as a broken tile. Remove a slot each time a
              real card lands.
            */}
            {[0, 1].map((slot) => (
              <Reveal
                as="li"
                key={`concept-slot-${slot}`}
                delay={(shown.length + slot) * 0.06}
                variant="settle"
              >
                <div className="flex h-full min-h-[18rem] flex-col justify-between gap-10 rounded-[1.75rem] border border-dashed border-ink-400 p-8 lg:p-10">
                  <p className="eyebrow">Concept slot</p>
                  <div>
                    <h3 className="display text-2xl text-ink-600">
                      Reserved for the next build.
                    </h3>
                    <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-ink-600">
                      A speculative concept project is in design now. It will
                      be labelled as a concept when it lands — this space is
                      never filled with an invented client.
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-20 border border-dashed border-ink-400 px-8 py-20 text-center lg:px-16 lg:py-28">
            <p className="eyebrow mb-8 inline-block">In preparation</p>
            <h3 className="display mx-auto max-w-[22ch] text-display-sm text-ink-1000">
              Case studies are being written up.
            </h3>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Cta href="/#contact">Ask to see the work</Cta>
            </div>
          </div>
        )}

        {/* The grid shows a selection; this is the way through to all of it.
            Sits under the cards rather than beside the heading so it reads as
            "and there is more", which is only true once you have seen the
            cards. Hidden when the grid is empty — the empty state already
            carries its own call to action. */}
        {showPortfolioLink && shown.length > 0 ? (
          <Reveal className="mt-14 flex justify-center lg:mt-20">
            <Cta href="/portfolio">View the portfolio</Cta>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
