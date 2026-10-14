import { faqs } from "@/lib/content";
import { Reveal } from "@/components/reveal";

/**
 * FAQ
 *
 * The reference composition: an oversized section word and a contact prompt
 * on the left rail, stacked rounded rows on the right, each with a "+" that
 * rotates into a "×" when open.
 *
 * Still native <details>/<summary>. No JS, no ARIA to get wrong, operable by
 * keyboard, and findable by browser find-in-page even while collapsed — a
 * custom accordion here would be more code for strictly less accessibility.
 *
 * This section is also the site's best answer-engine asset: it is the block
 * that gets lifted into an AI Overview, and it is mirrored into FAQPage
 * structured data in app/page.tsx so the answers are machine-readable.
 */
export function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 py-24 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-16 lg:py-32">
        <div className="lg:col-span-4">
          <h2 id="faq-heading" className="section-word text-ink-1000">
            FAQ
          </h2>
          <p className="mt-6 text-sm text-ink-700">
            Got a question that is not here?
          </p>
          <a
            href="#contact"
            className="mt-1 inline-block text-sm text-ink-1000 underline decoration-ink-500 underline-offset-4 transition-colors duration-500 hover:decoration-ink-1000"
          >
            Contact us
          </a>
        </div>

        {/* Not a <dl>: a definition list may only directly contain dt/dd (or
            div) children, and <details> between them is invalid — axe flags it
            as `definition-list` + `dlitem`. A heading inside <summary> carries
            the same semantics without breaking the content model. */}
        <div className="space-y-3 lg:col-span-8">
          {faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04}>
              <details className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] open:bg-white/[0.045] hover:border-white/20">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 px-6 py-6 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-normal tracking-tight text-ink-1000 sm:text-lg">
                    {item.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-lg leading-none text-ink-600 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45 group-open:text-ink-1000"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[64ch] px-6 pb-7 leading-relaxed text-ink-700">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
