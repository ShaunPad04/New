import { services } from "@/lib/content";
import { Reveal, RevealWords } from "@/components/reveal";
import { Expandable } from "@/components/expandable";

/**
 * Spelled out, because "5 disciplines" set in the display face reads as a
 * price. Derived from the data rather than typed into the heading — the copy
 * said "Five disciplines" for a while after a sixth was added, and a headline
 * that contradicts the list directly beneath it is the kind of small
 * inaccuracy a careful client notices.
 */
const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

export function Services() {
  const count = NUMBER_WORDS[services.length] ?? String(services.length);

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-6 py-28 sm:px-10 lg:px-16 lg:py-40"
    >
      <div className="max-w-[60ch]">
        <p className="eyebrow mb-6">What we do</p>
        <h2
          id="services-heading"
          className="display text-display-md text-ink-1000"
        >
          {/* "…for all of them" was four words carrying no information —
              "Six disciplines" has already named the set, so "all of them"
              only points back at something read half a second earlier, and
              it made a confident line sound like it was explaining itself.
              Stopping on "accountable" keeps the parallel (Six/One,
              disciplines/team) and leaves a promise rather than a
              description, which is the half a competitor cannot copy. */}
          <RevealWords text={`${count} disciplines. One team accountable.`} />
        </h2>
      </div>

      <ul className="mt-20 border-t border-ink-300">
        {services.map((service, i) => (
          <Reveal as="li" key={service.id} delay={i * 0.05}>
            <article className="group grid gap-8 border-b border-ink-300 py-12 transition-colors duration-500 lg:grid-cols-12 lg:gap-12 lg:py-16">
              <div className="lg:col-span-1">
                <span className="eyebrow">{service.index}</span>
              </div>

              <div className="lg:col-span-4">
                <h3 className="display text-display-sm text-ink-1000 transition-transform duration-500 ease-[var(--ease-out-expo)] lg:group-hover:translate-x-2">
                  {service.title}
                </h3>
                <p className="mt-4 max-w-[38ch] text-[0.9375rem] leading-relaxed text-ink-700">
                  {service.summary}
                </p>
              </div>

              {/* Collapsed on a phone, open from `lg`. See `expandable.tsx`
                  for why this is a clamp rather than a <details>: the text has
                  to stay in the DOM for the answer engines this section is
                  written to be cited by. */}
              <Expandable className="lg:col-span-4">
                {service.detail}
              </Expandable>

              <div className="lg:col-span-3">
                <ul className="space-y-2.5">
                  {service.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-start gap-3 text-sm text-ink-700"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 block h-px w-3 shrink-0 bg-ink-500"
                      />
                      {cap}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
