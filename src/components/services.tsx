import { services } from "@/lib/content";
import { RevealWords } from "@/components/reveal";
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
      // `on-light` inverts the ink scale for this subtree — see globals.css.
      // `relative` because the section paints its own grain layer, and the
      // ground bleeds the full width rather than stopping at the 1600px
      // measure: a white band with black gutters either side would read as a
      // card floating on the page rather than as a change of chapter.
      //
      // `bg-ink-100` rather than the inverted default of pure white, because
      // the cards themselves are `bg-ink-0`. On one ground they would be
      // invisible; on two the plates read as plates.
      className="on-light relative scroll-mt-24 bg-ink-100"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-40">
      {/*
        Vertical rhythm is tightened below `sm` and untouched from there up.
        On a 390px screen the section was 112px of padding at each end, an
        80px gap before the list, then 48px above and below every one of six
        items with 32px between their three blocks — a great deal of air for
        copy that is deliberately short. The desktop proportions, which the
        client approved, are unchanged.
      */}
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

      {/*
        STACKED SCROLL, at the client's request (2026-09-08): each discipline
        holds at the top of the screen while the next one rises over it, so the
        section is read one service at a time rather than as a long list.

        Pure `position: sticky`, no JavaScript and no scroll listener. The
        reference the client sent is the same thing — sticky sections with
        nothing driving them — and it is the right call here for a second
        reason: this page already does real work on scroll in the pinned hero,
        and the browser's own sticky positioning is handled on the compositor
        where a JS-driven version would not be.

        Each card is opaque (`bg-ink-0`) because that is what makes one cover
        the next; a transparent card would let the outgoing text show through
        the incoming one. The 0.6rem stagger leaves a sliver of every card that
        has already passed visible above the current one, so the stack reads as
        depth rather than as a single card whose contents keep changing.

        `Reveal` is gone from these items on purpose. It animates `transform`,
        and a transform on a sticky element's ancestor creates a containing
        block that breaks sticky positioning outright — but more simply, the
        stacking IS the entrance now, and playing a fade-up underneath it just
        made the card arrive twice.
      */}
      <ul className="services-stack mt-12 sm:mt-20">
        {services.map((service, i) => (
          <li
            key={service.id}
            className="sticky"
            style={{ top: `calc(5.5rem + ${i} * 0.6rem)` }}
          >
            {/*
              EQUAL HEIGHTS ARE LOAD-BEARING, not a tidiness preference.

              At the end of the stack every card releases at once and their
              BOTTOMS align on the list's bottom edge. With ragged heights the
              tallest card then extends further up than the last one — measured
              at 1440x900, card 3 is 504px against card 6's 314px, so 190px of
              GEO/SEO stood above the final card, mid-sentence, exactly as the
              client photographed it. An earlier sibling paints under a later
              one, but only where they overlap; the part sticking out above is
              covered by nothing.

              A floor tall enough for the longest card removes the release
              artefact entirely, since equal heights make the cards coincide.
              These numbers are content-dependent, so `tests/a11y.spec.ts`
              asserts the rendered cards are the same height at all three
              viewports — if a service ever outgrows its floor, the suite says
              so rather than the client spotting it again.
            */}
            <article className="group grid min-h-[41rem] gap-5 rounded-[1.75rem] border border-ink-300 bg-ink-0 px-6 py-9 transition-colors duration-500 sm:min-h-[42rem] sm:gap-8 sm:px-10 sm:py-12 lg:min-h-[32rem] lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-14">
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
          </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
