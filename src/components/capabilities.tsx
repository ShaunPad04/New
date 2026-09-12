import { Cta } from "@/components/cta";
import { LiquidChrome } from "@/components/ui/liquid-chrome";
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
  /* Was "Accessible to WCAG 2.2 AA" (client, 2026-09-13): state the score,
     never conformance. Lighthouse accessibility is an automated check of a
     subset of the criteria; WCAG conformance is a human audit nobody has
     done on these builds. */
  "100 Lighthouse Accessibility",
  "Yours to edit",
  "Built to scale",
  "Measured, not guessed",
] as const;

/**
 * Asymmetric vertical padding, deliberately. Services opens with `py-40` of
 * its own, so a symmetric `py-28` here stacked into ~270px of empty black
 * between this band's CTA and the next heading — the client read that gap as a
 * section with something missing from it. The band keeps its full opening
 * breath and hands off early.
 */
/*
 * FULL BLEED, and that is the point of the restructure. The paths used to sit
 * inside a bordered box in the right-hand column; the client's correction was
 * that they should be BEHIND the text, not framed beside it. A background
 * cannot live inside the `max-w-[1600px]` column it is meant to sit behind —
 * on anything wider than 1600px it would stop dead at the column edge with
 * black either side. So the section is now the full-width shell and the
 * measure moved to the div inside it.
 *
 * `isolate` keeps the stacking context local, so the `z-10` below cannot
 * compete with the fixed header or the hero.
 */
export function Capabilities() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="relative isolate overflow-hidden"
    >
      {/*
        THE BAND'S BACKGROUND IS NOW A SHADER, at the client's request
        (2026-09-11), replacing the drifting line field.

        `baseColor` and the rest are his values. Desktop only, for the same
        reason the line field was: below `lg` the copy is a single full-width
        column and every line of it would sit on the brightest part of the
        effect, and a phone should not be running a fragment shader for
        decoration. See `liquid-chrome.tsx` for what bounds the cost.
      */}
      <LiquidChrome
        baseColor={[0.1, 0.1, 0.1]}
        speed={1}
        amplitude={0.6}
        interactive
        className="pointer-events-auto absolute inset-0 hidden lg:block"
      />

      {/*
        THE SCRIM, AND WHY IT IS A SEPARATE LAYER FROM THE PATHS.

        The client asked for the dense field of his reference, edge to edge,
        rather than the few lines a right-weighted mask was leaving. Masking
        the paths is the wrong tool for that: it thins the field exactly where
        it is asked to be full.

        So the field now covers the whole band at full strength, and this sits
        BETWEEN the field and the copy — black on the left, ramping out by 80%
        of the width. The lines still run behind the text, they are simply
        darkened there.

        A horizontal ramp rather than a radial, because a radial is anchored to
        the VIEWPORT while the copy column is capped at 1600px and centred, so
        the two drift apart as the screen widens — at 2560 a radial centred at
        20% had already slid left of the text it was meant to cover. Measured,
        the copy spans 4-56% of the band at 1440 and 21-54% at 2560, so a ramp
        that is solid to 44% and gone by 80% covers it at both without tracking
        anything.

        IT ALSO CARRIES THE TOP AND BOTTOM FADE, as paint rather than as a
        mask on the field. The band is full-bleed with `overflow-hidden`, so
        the section's own edges were slicing the field on a dead-flat
        horizontal line — bright curves stopping mid-sweep on a perfect
        straight edge, which is what the client saw as "glitched".

        A `mask-image` fixed that and cost far too much: it forces the masked
        layer onto its own offscreen render surface, and measured against the
        identical build without it, Lighthouse performance fell from 88 to 71
        and total blocking time went from 78ms to 264ms. On a black ground a
        painted black gradient is visually identical and is an ordinary paint.
        Masks are not free, and this one was buying nothing a gradient could
        not.

        Body copy here is `text-ink-700`, which has no contrast to spare, and
        this is the layer that protects it. Be precise about what that means:
        axe measures contrast against the computed background colour and would
        not flag strokes drawn over it either way, so this is not a test
        passing. It is the reason the test result still describes what a reader
        actually sees.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] hidden lg:block"
        style={{
          background:
            "linear-gradient(to bottom, rgb(10 10 10) 0%, rgb(10 10 10 / 0) 15%, rgb(10 10 10 / 0) 78%, rgb(10 10 10) 100%), linear-gradient(to right, rgb(10 10 10 / 0.95) 0%, rgb(10 10 10 / 0.93) 44%, rgb(10 10 10 / 0.62) 61%, rgb(10 10 10 / 0) 80%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-10 pt-20 sm:px-10 sm:pb-12 sm:pt-24 lg:px-16 lg:pb-14 lg:pt-28">
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
      {/*
        TWELVE COLUMNS, NOT TWO FLEX CHILDREN, because the band had a hole in
        it. The client's note was blunt — he expected something in the empty
        right-hand third under the CTA, and there was nothing there. The
        argument, the pills and the button all sat in a left-weighted stack
        while a quarter of the section stayed black.

        The path field is the fix, and it is BEHIND this copy rather than
        boxed beside it — the client's correction after seeing it framed. It
        runs the full width of the band, weighted to the right where the copy
        column ends, so the section is one composition rather than a column of
        text with a picture parked next to it. The scrim below is what keeps
        it off the reading.
      */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-8">
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

            <Reveal className="max-w-[52ch]" variant="unblur">
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
        </div>

        </div>
      </div>
    </section>
  );
}
