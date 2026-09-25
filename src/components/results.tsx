import { buildStandards } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";
import { CountUp } from "@/components/ui/count-up";

/**
 * RESULTS — the figures we can prove.
 *
 * The invented client-outcome samples and the unmeasured GEO band were
 * removed in the 2026-09-11 redesign (see content.ts). What remains is the
 * half that was always true: our own build standards, measured on this page
 * and reproducible by anyone who opens DevTools — which is also the stronger
 * argument. A studio quoting its own audited build beats a studio quoting a
 * number nobody can check.
 */
export function Results() {
  return (
    <section
      id="results"
      aria-labelledby="results-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-[50ch]">
            <p className="eyebrow eyebrow-plain mb-6">By the numbers</p>
            <h2
              id="results-heading"
              className="display text-display-md text-ink-1000"
            >
              <RevealWords text="Proof you can run yourself." />
            </h2>
          </div>
          <p className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink-700">
            No borrowed numbers. Every figure below is measured on the page
            you are reading — put it through PageSpeed Insights and check us.
          </p>
        </div>

        {/* The half that is verifiable, and the invitation to check it. */}
        <div className="bezel mt-6">
          <div className="bezel-core flex flex-col gap-10 p-7 sm:p-8 lg:flex-row lg:items-center lg:gap-14 lg:p-12">
            <div className="max-w-[34ch]">
              <p className="field-label text-ink-600">Measured on this page</p>
              {/* The invitation to verify is the point of this panel, so the
                  copy has to be precise about what it is inviting. It names
                  the tool and the form factor, because a prospect who runs
                  PageSpeed on desktop should see these figures and one who
                  runs it on mobile should not feel misled. This said "WCAG
                  2.2 AA" until 2026-09-13; the client's instruction is to
                  state Lighthouse scores and never conformance, because the
                  score is an automated check we can reproduce on demand and
                  conformance is a human audit nobody has carried out. */}
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-800">
                Every build is audited before it ships: 100 for accessibility
                and 100 for best practices, held there by an automated suite
                that runs on every commit. Put this page through PageSpeed
                Insights yourself — these are its desktop figures.
              </p>
            </div>

            {/*
              THE STANDARDS AS A RULED ROW, not as plates.

              They were four bezel cards inside this bezel-core, which put
              CARDS THREE DEEP — the one place on the site that broke its own
              rule that nothing nests past the double bezel (DESIGN.md), and
              visually the SaaS metric grid the house standard bans outright.
              At 390 it also forced "Largest paint" and "Layout shift" to wrap
              inside 150px boxes.

              A measurement does not need a container. These are numbers with
              names, so they are set as numbers with names: the figure at
              display scale, the label under it, the qualifier under that,
              divided by the same hairline the rest of the page uses. Half the
              height, no wrapped labels, and the figures read as one row of
              evidence rather than four widgets.

              The entrance is unchanged — `Reveal` with a per-card delay,
              which already resolves blur, opacity and translate together and
              stops dead under `prefers-reduced-motion`.
            */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink-300 pt-8 sm:gap-x-10 lg:grid-cols-4 lg:border-t-0 lg:border-l lg:border-ink-300 lg:gap-y-0 lg:pt-0 lg:pl-0">
              {buildStandards.map((s, i) => (
                <Reveal
                  as="li"
                  key={s.id}
                  delay={i * 0.08}
                  variant="settle"
                  className="lg:border-l lg:border-ink-300 lg:first:border-l-0 lg:px-6 lg:first:pl-0 lg:last:pr-0"
                >
                  <p className="display text-[clamp(2.25rem,3.4vw,3rem)] leading-none tabular-nums text-ink-1000">
                    {/* Counts up on first view; static under reduced
                        motion and without JS. */}
                    <CountUp value={s.value} />
                  </p>
                  <p className="mt-4 text-sm font-medium tracking-tight text-ink-1000">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                    {s.detail}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
