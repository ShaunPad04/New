import { pillars } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * PILLARS — the template's numbered "01 / 02 / 03" cards. The café's own
 * four pillars from its website, each in a double-bezel plate.
 */
export function Pillars() {
  return (
    <section
      id="pillars"
      aria-labelledby="pillars-heading"
      className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-6">Bites, drinks, vibes</p>
          </Reveal>
          <h2 id="pillars-heading" className="display text-display-md text-espresso">
            <RevealWords text="Four reasons to find your muse." />
          </h2>
          <Reveal delay={0.15}>
            <p className="lede mt-6 max-w-[40ch]">
              Coffee in the morning, small plates through the day and a glass
              of something good when the light goes — in one stylish room on
              Sea View Street.
            </p>
          </Reveal>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.index} delay={0.05 + i * 0.07} className="bezel">
              <article className="bezel-core group flex h-full flex-col p-7 lg:p-8">
                <span className="display text-4xl text-clay transition-colors duration-500 group-hover:text-plum">
                  {p.index}
                </span>
                <h3 className="display mt-10 text-[1.75rem] text-espresso">{p.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-mocha">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
