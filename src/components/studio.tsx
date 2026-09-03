import { processSteps } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

export function Studio() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="scroll-mt-24 border-t border-ink-300 bg-ink-50"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">The studio</p>
            <h2
              id="studio-heading"
              className="display text-display-md text-ink-1000"
            >
              <RevealWords text="Two founders. No account managers." />
            </h2>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="lede">
                Blackline is a two-person studio, and that is the entire point.
                The people who design and build your site are the people you
                speak to — there is no account layer relaying messages between
                you and whoever is actually doing the work.
              </p>
              <p className="mt-6 leading-relaxed text-ink-800">
                It means we take on fewer projects than a larger agency would,
                and we are direct about scope and timelines because we are the
                ones who have to deliver them. It also means you get senior
                attention on every detail rather than a junior working from a
                brief they were handed second-hand.
              </p>
              <p className="mt-6 leading-relaxed text-ink-800">
                We work monochrome by conviction. Stripping colour out forces
                everything else — hierarchy, spacing, typography, motion — to do
                its job properly. If a layout works in black and white, it works.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Process */}
        <div className="mt-28 border-t border-ink-300 pt-16">
          <h3 className="eyebrow mb-12">How a project runs</h3>
          <ol className="grid gap-px bg-ink-300 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal as="li" key={step.index} delay={i * 0.07}>
                <div className="h-full bg-ink-50 p-8 lg:p-10">
                  <span className="display text-5xl text-ink-500">
                    {step.index}
                  </span>
                  <h4 className="display mt-8 text-xl text-ink-1000">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
