import { BRAND_MARK, heroDisciplines, heroScrubLine, site } from "@/lib/content";
import { Cta } from "@/components/cta";
import { HeroSequence } from "@/components/hero-sequence";

/**
 * The logotype's three words, split off its single source of truth rather
 * than typed out again, so a change in `content.ts` cannot leave the hero
 * spelling the mark differently from the rest of the site.
 *
 * Splitting on the capitals is safe for exactly this string ("BlackLineAgency")
 * and is asserted by the hero test. If the client ever sets a logotype that is
 * not CamelCase, give `site` an explicit array instead of making this regex
 * cleverer.
 */
const LOGOTYPE_PARTS = site.logotype.split(/(?=[A-Z])/).filter(Boolean);

/**
 * HERO
 *
 * The backdrop is a scroll-driven frame sequence (see `hero-sequence.tsx`):
 * the section pins and scroll position — not a video clock — owns which frame
 * is on screen.
 *
 * The composition follows the reference the client supplied: one line of copy
 * upper-left, the disciplines listed upper-right, and the logotype anchoring
 * the bottom-left at roughly two thirds of the container width rather than
 * filling it. The content block spreads to the full height of the section so
 * those two bands actually separate, instead of stacking at the foot.
 *
 * The <h1> is the LCP element, so this whole block is plain server-rendered
 * markup — deliberately NOT animated and NOT client-gated. It paints on the
 * first frame of HTML regardless of hydration, motion preference, or whether
 * a single image has decoded.
 */
/**
 * THE SCRUBBED LINE — the hero's signature moment (redesign, 2026-09-11).
 *
 * One sentence, revealed against the zoom and owned by scroll position: each
 * word rises from under an overflow mask while its blur and opacity resolve,
 * staggered left to right across the 30%→55% window of the pin, holds, and is
 * gone by ~85% so the sequence lands on clean footage. Scrolling back up
 * reverses it exactly, because nothing here is a tween — every value is a CSS
 * calc() off `--hero-progress`, the property the sequence's ScrollTrigger
 * already publishes. No second scroll subscription, no re-renders, compositor
 * properties only (transform/opacity/filter). The stagger windows live in
 * globals.css (`.hero-scrub-*`); below `sm` the words share one window so the
 * line reveals as a unit, with the blur dropped for 60fps.
 *
 * Under `prefers-reduced-motion` the hero never pins and the CSS shows the
 * line statically over the still frame (opacity forced to 1 in globals.css).
 * On PHONES (below 768px) the hero is a still too, and there the line is
 * `display: none` (Shaun, 2026-09-18): with no film to be spoken over it read
 * as a caption that had lost its picture, competing with the wordmark for one
 * screen. The phone hero is wordmark, lede and calls to action.
 * The sentence is read from the visible spans themselves — they keep the
 * spaces between words, so the text content is contiguous. The
 * visually-hidden duplicate this used to carry was removed: it announced
 * correctly but put the line into the DOM twice for anything reading text
 * rather than the accessibility tree.
 */
function HeroScrubLine() {
  return (
    <div className="hero-scrub pointer-events-none absolute inset-0 z-10 flex items-end">
      {/* Legibility scrim, only while the line is visible — a soft radial
          pool rather than a full wash, so the footage keeps its grade. */}
      <div aria-hidden="true" className="hero-scrub-scrim absolute inset-0" />
      {/* Same container as the hero foreground below, so the line lands on
          exactly the grid edge the wordmark vacates. */}
      <div className="hero-scrub-inner relative mx-auto w-full max-w-[1600px] px-6 pb-14 sm:px-10 lg:px-16 lg:pb-16">
      {/* BOTTOM-LEFT, LEFT-ALIGNED — not centred.
          Centred caps over footage is the stock-poster composition, and it
          fought the hero, whose wordmark and CTAs both live in the lower-left
          band. Anchored here the line takes the exact stage position the
          wordmark vacates as it fades, so the two read as one handover. The
          measure is wide enough to break to two or three lines rather than a
          chunky centred square. `.hero-scrub-line` carries the 1.03→1
          settle. */}
      {/* Read directly rather than duplicated. The sr-only twin that used to
          sit above this put the line into the DOM a second time for anything
          reading text instead of the accessibility tree. Nothing here is
          hidden now: the word spans keep the spaces between them, so the
          text content is contiguous and a screen reader reads the sentence
          once, in order. No aria-label — on a <p> its support is not
          dependable, which is why the <h1> in page-shell can use one and
          this cannot. */}
      <p
        className="hero-scrub-line display relative max-w-[15ch] text-left text-[clamp(2.5rem,7.2vw,6.25rem)] leading-[0.94] tracking-[-0.04em] text-ink-1000"
      >
        {heroScrubLine.split(" ").map((word, i) => (
          <span key={i}>
            {i > 0 ? " " : null}
            <span className="hero-scrub-mask">
              <span className="hero-scrub-word">{word}</span>
            </span>
          </span>
        ))}
      </p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <HeroSequence>
      <HeroScrubLine />
      {/*
        `justify-end` below `sm`, `justify-between` above it.

        The disciplines list is the first of two children and is hidden on a
        phone, which left `justify-between` with a single child — and a lone
        child in a space-between column sits at the TOP. So the whole
        composition piled into the first third of the frame with 460px of dead
        space under it, inverted from the desktop layout, and the copy landed
        on the brightest part of the footage while the scrim, which is weighted
        to the foot, protected nothing. Introduced when the list was hidden;
        the container was never re-checked with one child instead of two.
      */}
      {/*
        THE FOREGROUND TRAVELS WITH THE PIN.

        Adapted from a reference the client sent: as the page scrolls, the
        headline sinks and fades while the imagery behind it keeps playing,
        so the type hands the frame over rather than cutting away from it.

        It earns its place here rather than being decoration. This hero holds
        the viewport for 320vh while the sequence scrubs, and until now the
        foreground did nothing for that entire distance — the name and the two
        buttons sat perfectly still through three screens of scrolling, which
        reads as a page that has stopped responding rather than one that is
        playing a film.

        Driven by `--hero-progress`, published on the section by the
        sequence's own ScrollTrigger, so there is exactly one scroll
        subscription on this page and no second source of truth about how far
        through the pin we are. The `translate3d` and `opacity` are both
        compositor properties, so this costs no layout and no paint.

        Retimed for the redesign (2026-09-11): the block is gone by ~20% of
        the pin so the scrubbed line (HeroScrubLine below) owns the frame from
        30% — one message on screen at a time. The fallback of 0 in each
        `var()` matters — under `prefers-reduced-motion` the hero never pins,
        the property is never written, and the block simply sits where it was
        designed to sit.
      */}
      <div
        style={{
          transform:
            "translate3d(0, calc(min(var(--hero-progress, 0) * 5, 1) * 12vh), 0)",
          opacity: "calc(1 - var(--hero-progress, 0) * 5)",
          willChange: "transform, opacity",
        }}
        className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end gap-16 px-6 pb-14 pt-28 sm:justify-between sm:px-10 lg:px-16 lg:pb-16 lg:pt-32"
      >
        {/* The katakana studio mark that sat here (ブラックラインデザイン,
            "Black Line Design" in the script Japanese uses for foreign names)
            was removed at the client's request, 2026-09-11. It came from a
            reference and was decorative — aria-hidden, hidden below `sm`, and
            carrying no information the page states elsewhere. The elaborate
            `calc(50% - 50vw + 1.75rem)` that aligned it with the header
            wordmark went with it; nothing else used that trick. */}
        {/*
          Upper band: the disciplines, right-aligned against the edge.

          Hidden below `sm` at the client's request (2026-09-07). On a phone
          the hero frame is portrait and the copy block is already three lines
          longer than on desktop, so this list was competing with the logotype
          and the two calls to action for the only legible part of the frame.
          Nothing is lost — the same six disciplines are the Services section,
          in full, a screen further down. It is `hidden`, not removed, so the
          desktop composition the client signed off is untouched.
        */}
        <div className="ml-auto hidden sm:block">
          {/*
            The year mark above the list, as in the reference the client sent.
            Mono, tiny, wide — it is a stamp, not a sentence, and it dates the
            work without anybody having to maintain a copyright line up here.
          */}
          <p className="mb-3 text-right font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-ink-1000 [text-shadow:0_1px_14px_rgb(0_0_0/0.6)]">
            {/* "Agency", not "Studio", on the client's instruction. The
                business is Black Line Agency and the word on the business
                card is Agency; the stamp was the one place on the page still
                calling it a studio. */}
            {new Date().getFullYear()} — Agency
          </p>
          {/*
            Set larger, tighter and hairline-separated, at the client's
            request, after a reference where the same four words carry real
            typographic weight rather than sitting as small grey captions.

            The change is the SIZE relationship: at 16px these read as a
            footnote to the frame; at this scale they read as a second voice
            in it, which is the whole point of naming the disciplines here at
            all. Still right-aligned against the edge, so the composition the
            client signed off is otherwise untouched, and still hidden below
            `sm` for the reason recorded above.
          */}
          <ul className="w-fit border-t border-white/15">
            {heroDisciplines.map((d) => (
              <li
                key={d}
                /* A shadow rather than a scrim: the disciplines and the
                   studio mark sit high in the frame, above where the
                   per-breakpoint scrim does its work, and the footage is at
                   its brightest exactly there. Cheaper than extending the
                   scrim, and it does not touch the grade of the image the
                   client asked to keep light. */
                className="border-b border-white/15 py-2 text-right text-[1.375rem] font-medium leading-tight tracking-[-0.02em] text-ink-1000/90 [text-shadow:0_1px_16px_rgb(0_0_0/0.55)] lg:text-[1.625rem]"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/*
          Lower band: the logotype anchors the left, the claim and the calls to
          action sit bottom-right.

          They were upper-left, over the brightest part of the frame, where
          they were genuinely hard to read. Down here they sit in the heaviest
          part of the scrim, and both buttons are solid — one white on black
          type, one black on white — so neither depends on the footage behind
          it to stay legible. A bordered transparent button cannot make that
          promise across 169 frames.
        */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h1
          id="hero-heading"
          /*
            THE MARK IS STACKED ON A PHONE AND SOLID FROM `lg`.

            It was one line at `8.2vw` with `whitespace-nowrap`, which is the
            mark SHRUNK TO FIT rather than composed: at 390px that is 32px of
            type reading "BLACKLINEAGENCY" as a single run-on word, under a
            header that sets the same name as "BLACK LINE | AGENCY". The
            wordmark of a studio selling design was the smallest, most
            compromised piece of typography on its own homepage.

            The three words are separate spans that go `inline` at `lg`, so
            the desktop line is the identical solid logotype it has always
            been — same string, same spacing, no space introduced between the
            words, so the accessible name is unchanged too. Below `lg` they
            stack and the type nearly doubles, which is the whole point: a
            stacked logotype is an arrangement, a nowrap one-liner is a
            surrender.

            `13.2vw` is set against the longest word, AGENCY, at 360px — the
            narrowest phone worth designing for — with the trademark and the
            container padding accounted for. It is CLAMPED at 5rem because
            the stack runs all the way to `lg`: unbounded, a 768px tablet
            took it to 101px a line and three lines of that own the whole
            screen. The floor is there for the same reason from the other
            end.
          */
          /*
            HIDDEN ON PHONES, NOT DELETED (Brad, 2026-09-25: "remove the one
            in the middle, it looks out of place").

            `max-md:sr-only` and nothing else — the mark is still in the DOM,
            still the page's one <h1>, still what `aria-labelledby` on the
            section resolves to, and still read aloud first. It is only the
            PICTURE of it that goes, on the one viewport where it was
            competing with the header's own wordmark two inches above it for
            the same screen.

            Deleting it, or `hidden md:block`, would have taken it out of the
            accessibility tree and out of what Google renders — and Google
            renders mobile first, so a phone-only `display: none` on the h1
            is the version it indexes. A visually-hidden h1 is not.

            `max-md:` rather than `md:not-sr-only` on purpose: the max-*
            variant applies BELOW the breakpoint and leaves no rule at all at
            768 and up, so `w-fit` and the two clamps keep working untouched.
            `md:not-sr-only` would have reset width to auto at exactly the
            widths that still want fit-content, and it would have done it
            silently.

            768 is the phone boundary this site already uses — the same one
            `HeroSequence` uses to serve a still instead of the film, and the
            one the scrub line is hidden below. A tablet still gets the
            stacked mark.
          */
          className="display w-fit text-[clamp(2.75rem,13.2vw,5rem)] leading-[0.84] tracking-[-0.045em] text-ink-1000 max-md:sr-only lg:whitespace-nowrap lg:text-[clamp(3.5rem,6vw,6.5rem)]"
        >
            {LOGOTYPE_PARTS.map((part, i) => (
              <span key={part} className="block lg:inline">
                {part}
                {/* The mark rides INSIDE the last word, not after the last
                    block. As a sibling of three block spans it became a
                    fourth line — a lone ™ hanging under AGENCY with the
                    lede pushed a line further down. */}
                {i === LOGOTYPE_PARTS.length - 1 ? (
                  <span className="align-super text-[0.2em] font-semibold tracking-normal text-ink-700">
                    {BRAND_MARK}
                  </span>
                ) : null}
              </span>
            ))}
          </h1>

          {/*
            23.868rem, NOT `max-w-[36ch]`, and the reason is measured.

            `ch` is the width of the font's own "0", so a max-width in `ch`
            is a different number of pixels before and after the webfont
            arrives. This paragraph is the LARGEST CONTENTFUL PAINT ELEMENT
            on mobile — bigger in the first viewport than the wordmark, and
            the hero poster never qualifies as a candidate at all — so that
            re-measure is not cosmetic: the box grew from 335.5px to 364px
            when Geist landed, Chrome logged a second, larger LCP candidate,
            and mobile LCP jumped from 2.9s (identical to FCP) to 4.7s.
            Nothing visibly changed. The metric moved 1.8s for 28 pixels.

            23.868rem is what 36ch computes to IN GEIST, so the desktop
            composition and every line break the client signed off are
            byte-identical — the width simply no longer depends on which
            font is loaded at the moment it is measured. Below `lg` it is
            the container that binds (364px at 412px wide) in both fonts,
            which is exactly the point: one box, one paint.

            Keep any future max-width on THIS element font-independent.
            `ch` is still the right idiom everywhere else on the site — it
            only bites on an element that can be the LCP candidate.
          */}
          <div className="max-w-[23.868rem] shrink-0 lg:pb-2 lg:text-right">
            <p className="text-[0.9375rem] leading-relaxed text-ink-900 sm:text-base">
              {site.heroLine}
            </p>

            {/*
              ON A PHONE THE PAIR SPANS THE CONTENT WIDTH (Brad, 2026-09-25:
              the buttons "look out of place and unprofessional").

              This reverses an earlier decision, and what makes it safe to
              reverse is that the thing it was protecting is gone. Full width
              was tried first and rejected because a 342px pill "swamped the
              logotype above it" — and the logotype above it is now
              `max-md:sr-only`. The buttons are the base of the composition
              rather than a third object competing inside it.

              What was actually wrong was RAGGEDNESS, not size: a 342px
              paragraph sitting directly on a ~190px button stack, a third of
              the column empty beside it, and no edge shared by anything.
              Measured at 390 before: lede x=24 w=342, primary x=24 w=189.
              Both buttons now start at 24 and end at 366, so the block has
              one left edge and one right edge.

              A single ROW was measured and ruled out rather than assumed:
              189px + 196px + a gap needs ~397px of the 342 available at 390,
              and shrinking the labels enough to fit overflows again at 360.
              Two full-width pills is the only arrangement that holds at every
              phone width without rewriting the copy.

              Height stays 52px — the tap-target floor is 44 and a test
              asserts it — and the primary takes `pl-6` because `pl-3` was set
              for a pill that hugged its label and looks pinched once the
              button is twice as wide as its text. The arrow is positioned off
              `100%`, so it stays flush right at any width and the hover
              travel is unaffected.

              From `sm` they return to a row and the desktop composition is
              untouched.
            */}
            {/*
              The primary CTA renders the Framer-derived button the client
              sent (2026-09-11) — `Cta`'s `solid` variant now delegates to
              `ActionCta`, so this call site is unchanged. `solid` is the WHITE
              pill in this component's vocabulary, so the pair keeps the
              light/dark split it already had: white primary, black secondary
              with the hairline it needs to survive 169 frames of footage.
            */}
            <div className="mt-7 grid grid-cols-1 gap-2.5 max-sm:w-full sm:flex sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:justify-end">
              <Cta href="#contact" className="max-sm:w-full max-sm:pl-6">
                Start a project
              </Cta>
              {/* `max-sm:h-[52px]` for exact parity: the invert variant carries a
                  hairline, which measured it 54px against the primary's 52.
                  Side by side that was the 2px nobody sees; stacked and full
                  width, two adjacent pills of different heights is visible. */}
              <Cta
                href="/portfolio"
                variant="invert"
                className="max-sm:h-[52px] max-sm:w-full"
              >
                See the portfolio
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </HeroSequence>
  );
}
