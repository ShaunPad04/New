import { projects, type Project } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";
import { WorkCard } from "@/components/work-card";
import { Cta } from "@/components/cta";
import { Carousel3D } from "@/components/kit/carousel-3d";
import { Tilt } from "@/components/kit/tilt";

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
  /**
   * "carousel" (design system v2, homepage): the cards ride the scroll-driven
   * 3D coverflow — pinned and scrubbed on desktop, self-advancing with a
   * pause control on phones. "grid" is the /portfolio layout.
   */
  layout = "grid",
}: {
  showPortfolioLink?: boolean;
  layout?: "grid" | "carousel";
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
            <p className="eyebrow eyebrow-plain mb-6">Selected work</p>
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

        {shown.length > 0 && layout === "carousel" ? null : shown.length > 0 ? (
          <ul className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-2">
            {shown.map((project, i) => (
              <Reveal as="li" key={project.id} delay={i * 0.06} variant="settle">
                {/* v2: the card turns toward a mouse pointer (flat on touch). */}
                <Tilt max={5} className="h-full">
                  <WorkCard project={project} />
                </Tilt>
              </Reveal>
            ))}
            {/*
              THE CONCEPT SLOT WAS REMOVED on the client's instruction
              (2026-09-14). It was a dashed tile reading "Reserved for the
              next build" — honest, and the honest version of an empty shelf
              is still an empty shelf. On a phone it was a full-width card of
              nothing at the end of the one section carrying the actual
              proof, and it undercut the three real projects above it.

              The rule it replaced still stands for whatever comes next:
              never fill a slot with an invented client, and keep the
              Concept / In build labels accurate. The honest EMPTY-state
              below (`shown.length === 0`) is untouched and is still what
              renders if the array is ever cleared.
            */}
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
        {showPortfolioLink && shown.length > 0 && layout === "grid" ? (
          <Reveal className="mt-14 flex justify-center lg:mt-20">
            <Cta href="/portfolio">View the portfolio</Cta>
          </Reveal>
        ) : null}
      </div>
      {/* Full bleed: the coverflow needs the whole width to turn in. */}
      {layout === "carousel" && shown.length > 0 ? (
        <>
          <Carousel3D
            label="Selected work"
            className="-mt-16 lg:-mt-40"
            slides={shown.map((project) => ({
              key: project.id,
              label: project.title,
              node: <WorkCard project={project} />,
            }))}
          />
          {showPortfolioLink ? (
            <Reveal className="flex justify-center px-6 pb-28 pt-6 lg:pb-40">
              <Cta href="/portfolio">View the portfolio</Cta>
            </Reveal>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
