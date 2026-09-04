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
export function Work() {
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
      </div>
    </section>
  );
}
