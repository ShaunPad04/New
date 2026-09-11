import { faqs } from "@/lib/content";
import { Reveal } from "@/components/reveal";

/**
 * FAQ — native <details>/<summary>, as in the template's accordion. No JS,
 * keyboard-operable, and expandable by browser find-in-page.
 */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-[1400px] scroll-mt-28 px-6 py-24 sm:px-10 lg:px-16 lg:py-36"
    >
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow mb-6">Good to know</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="faq-heading" className="display text-display-md text-espresso">
              Frequently
              <br />
              <em className="display-italic text-plum">asked.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lede mt-6 max-w-[36ch]">
              Hours, dogs, allergies and evenings. Anything else, call the café.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-sand">
            {faqs.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.04}>
                <details className="group border-b border-sand">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="serif text-xl text-espresso transition-colors duration-300 group-hover:text-plum">
                      {item.q}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-espresso/15 text-mocha transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[58ch] pb-7 leading-relaxed text-espresso-soft">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
