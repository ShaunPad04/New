import { Cta } from "@/components/cta";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * CAPABILITIES BAND
 *
 * Adapted from a reference the client sent: a two-line headline over a wrapped
 * row of capability pills, the last of which is the call to action.
 *
 * WHAT WAS ADAPTED, rather than copied. The reference is a blue-on-black
 * template and the pills are decorative chips with no state. Here they are set
 * in the project's own eyebrow treatment — Geist Mono, 0.2em tracking, the
 * hairline pill — so the row reads as part of this system rather than as
 * something pasted into it. The CTA is the site's own button-in-button, which
 * is why it sits slightly proud of the row rather than pretending to be a
 * twelfth pill.
 *
 * WHY IT SITS HERE, between the logo strip and Services. It answers the
 * question the hero deliberately leaves open. The hero is the name and two
 * buttons and nothing else, on the client's instruction, so the first thing a
 * visitor can actually read about the work is 3,000px away. Eleven words of
 * outcome, at the point where the page starts arguing, costs one screen and
 * buys the whole section beneath it a reason to be read.
 *
 * The pills are claims about what we build, not about who has hired us, so
 * nothing here needs a `*_VERIFIED` gate — unlike the strip directly above it.
 */

/**
 * GEO / AEO / SEO, spelled that way on the client's instruction and correct as
 * written: generative engine optimisation (being cited by models), answer
 * engine optimisation (being the answer, not a link) and search engine
 * optimisation (ranking). Three different jobs, and the studio does all three,
 * so collapsing them to "SEO" would undersell the one that is the headline
 * differentiator everywhere else on this site.
 */
const CAPABILITIES = [
  "Enhanced UX",
  "Boosted conversions",
  "Fast loading",
  "GEO / AEO / SEO optimised",
  "Accessible to WCAG 2.2 AA",
  "Yours to edit",
  "Built to scale",
  "Measured, not guessed",
] as const;

export function Capabilities() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28"
    >
      {/* Deliberately smaller than a section headline. This band is a bridge
          between the logo strip and Services, not a chapter opening — set at
          `display-md` it ran eight lines down the page and read as the most
          important thing on it, which it is not. */}
      {/*
        Two columns, because one was leaving the right two-thirds of the band
        empty — the client's words were "why is there nothing here". A headline
        alone at this size does not hold a 1600px measure, and the fix is not
        to make the headline bigger: it is to put something worth reading
        beside it.

        What goes there is the floor every build ships against, which is the
        one claim on this page that is both checkable and ours. It is also the
        argument the pills below are shorthand for, so the band now reads
        headline → reason → evidence rather than headline → decoration.
      */}
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h2
          id="capabilities-heading"
          className="display text-display-sm max-w-[30ch] text-ink-1000"
        >
          <RevealWords text="We do not just design it." />
          {/* The second line is the softer of the two, so it takes the
              softer weight — the same two-tone headline the reference uses,
              done with the palette rather than with a colour. */}
          <span className="block text-ink-600">
            <RevealWords text="We build it." />
          </span>
        </h2>

        <Reveal className="lg:max-w-[46ch] lg:pb-2">
          <p className="text-[0.9375rem] leading-relaxed text-ink-700">
            Every project ships against the same floor: hand-written Next.js
            rather than a page builder, an accessibility standard held by an
            automated suite that runs on every commit, and a performance
            budget the build is measured against before it launches — not
            audited once it is too late to change.
          </p>
        </Reveal>
      </div>

      <Reveal>
        <ul className="mt-9 flex flex-wrap items-center gap-2.5 sm:mt-11 sm:gap-3">
          {CAPABILITIES.map((item) => (
            <li key={item}>
              <span className="eyebrow whitespace-nowrap">{item}</span>
            </li>
          ))}
        </ul>
        {/* On its own line rather than as a twelfth chip. In the reference the
            CTA is the last pill and it works there because the pills are the
            same weight as the button; here the button is a real CTA with a
            filled plate and an arrow, so dropped into the row it landed
            mid-wrap and pulled the eye off the claims. */}
        <div className="mt-7">
          <Cta href="/#contact">Start a project</Cta>
        </div>
      </Reveal>
    </section>
  );
}
