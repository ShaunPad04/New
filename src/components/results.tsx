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
            <p className="eyebrow mb-6">By the numbers</p>
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
          <div className="bezel-core flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
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
              THE STANDARDS AS PLATES, adapted from a reference the client
              sent: figures on cards that rise and settle as they enter,
              rather than four bare numbers in a row.

              These are the figures that carry the argument — real, measured
              on this page, and the only ones here that survive to a public
              build — so they had the weakest presentation on the section and
              now have the strongest. The card is the same double-bezel
              language the rest of the site uses, so the treatment is borrowed
              from ourselves rather than from the reference.

              The entrance is `Reveal` with a per-card delay, which already
              resolves blur, opacity and translate together and already stops
              dead under `prefers-reduced-motion`. A second scroll subscription
              to scale them was tried and dropped: this page spends its scroll
              budget on the pinned hero, and one more per-frame reader is
              exactly what tonight's frame-timing work said not to add.
            */}
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {buildStandards.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 0.08} variant="settle">
                  <div className="bezel h-full">
                    <div className="bezel-core flex h-full flex-col justify-between gap-6 p-5 sm:p-6">
                      <p className="display text-[clamp(2rem,3.4vw,2.75rem)] normal-case! leading-none tabular-nums text-ink-1000">
                        {/* Counts up on first view; static under reduced
                            motion and without JS. */}
                        <CountUp value={s.value} />
                      </p>
                      <div>
                        <p className="text-sm font-medium tracking-tight text-ink-1000">
                          {s.label}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                          {s.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
