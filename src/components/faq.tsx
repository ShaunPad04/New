import { faqs } from "@/lib/content";
import { Reveal } from "@/components/reveal";

/**
 * Native <details>/<summary> accordion.
 *
 * No JS, no ARIA to get wrong, keyboard-operable and expandable by browser
 * find-in-page. A custom accordion here would be more code for less
 * accessibility.
 */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6">Questions</p>
            <h2 id="faq-heading" className="display text-display-md text-ink-1000">
              Before you ask.
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {/* Not a <dl>: a definition list may only directly contain
                dt/dd (or div) children, and <details> between them is
                invalid — axe flags it as `definition-list` + `dlitem`.
                Headings inside <summary> carry the same semantics without
                breaking the content model. */}
            <div className="border-t border-ink-300">
              {faqs.map((item, i) => (
                <Reveal key={item.q} delay={i * 0.04}>
                  <details className="group border-b border-ink-300">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 transition-colors duration-300 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-lg font-normal tracking-tight text-ink-1000 transition-colors duration-300 group-hover:text-ink-800">
                        {item.q}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-ink-600 transition-transform duration-400 ease-[var(--ease-out-expo)] group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-[58ch] pb-8 leading-relaxed text-ink-700">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
