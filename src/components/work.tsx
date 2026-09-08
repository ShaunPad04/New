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
              <RevealWords text="Two builds in progress." />
            </h2>
          </div>
          {/*
            THE HEADING HAS TO MATCH THE CARDS UNDER IT.

            This read "Proof, not promises." over a standfirst promising every
            project was measured on enquiries, bookings and revenue — directly
            above two cards badged IN BUILD and CONCEPT, neither carrying a
            single figure, because neither has launched.

            A buyer comparing three studios reads the promise, scans for the
            number, finds none, and concludes we have no results or are hiding
            them. That is a worse story than the true one, which is that we are
            new and the first build is in progress. The badges were already
            honest; the heading was arguing with them.

            So the heading now says where the work actually is, and the
            standfirst says what we will show when there is something to show.
            "Proof, not promises." is the right line for this section the day
            a launched project has figures behind it — bring it back then,
            along with the measurement claim, and not before.
          */}
          <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-700">
            Neither has launched yet, so there are no traffic or conversion
            figures to show — and we would rather say that than imply
            otherwise. What follows is what each was hired to do, and how we
            will be measuring it.
          </p>
        </div>

        {shown.length > 0 ? (
          <ul className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2">
            {shown.map((project, i) => (
              <Reveal as="li" key={project.id} delay={i * 0.06}>
                <WorkCard project={project} />
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
