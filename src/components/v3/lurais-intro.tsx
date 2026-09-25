import { site, stackLogos } from "@/lib/content";
import { ScrollText } from "@/components/kit/scroll-text";
import { VelocityMarquee } from "@/components/kit/velocity-marquee";
import { BracketLink, GutterWord, SectionRule } from "./lurais-parts";

/**
 * 01 /INTRODUCTION — Lurais layout.
 *
 * Sideways gutter word, a two-tone statement that lights as it is read
 * (the kit's ScrollText — the template's black-then-grey sentence, made to
 * move), the studio line, and the stack strip as the "worked with" row —
 * labelled as tools we build ON, never as clients (CLAUDE.md, logo strip).
 */
export function LuraisIntro({ headingId }: { headingId: string }) {
  const statement = site.description.split(". ")[0] + ".";
  return (
    <section aria-labelledby={headingId} className="bg-ink-0 text-ink-1000">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="01" label="Introduction" />
      </div>
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 pb-24 pt-16 sm:px-8 lg:grid-cols-[14rem_1fr] lg:pb-32 lg:pt-24">
        <GutterWord>About us</GutterWord>
        <div className="lg:max-w-[58rem] lg:justify-self-end">
          <h2 id={headingId} className="sr-only">
            About Black Line Agency
          </h2>
          <ScrollText
            text={statement}
            dim={0.4}
            className="text-[clamp(1.75rem,3vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.04em] text-ink-1000"
          />

          {/* Founder cards removed on Brad's word (2026-09-25) until there
              are photographs — an empty frame reads as a missing picture. */}
          <div className="mt-12">
            <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-800">
              {site.heroLine} Founder-led: the two people who design and
              build your site are the two people you talk to.
            </p>
            <BracketLink href="/studio" className="mt-8">
              The studio
            </BracketLink>
          </div>

          <div className="mt-16 grid items-center gap-6 border-t border-ink-300 pt-8 sm:grid-cols-[10rem_1fr]">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-1000">
              /Built with
            </p>
            <VelocityMarquee speed={0.5}>
              {/* Brad (2026-09-25): the real logos, not just the names. Same
                  single-colour glyphs as the old logo strip, from the sprite
                  at /logo-marks.svg (ids from logo-cloud's markId), all in
                  one ink tone so the row reads as a set, not as borrowed
                  brand colours. The name stays beside each mark as the
                  accessible text; the glyph itself is aria-hidden. */}
              {stackLogos.map((l) => (
                <span
                  key={l.name}
                  className="inline-flex items-center gap-3 px-7 text-lg font-semibold tracking-[-0.03em] text-ink-600"
                >
                  {l.mark ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 shrink-0 fill-current text-ink-800">
                      <use href={`/logo-marks.svg#logo-mark-${l.mark}`} />
                    </svg>
                  ) : null}
                  {l.name}
                </span>
              ))}
            </VelocityMarquee>
          </div>
        </div>
      </div>
    </section>
  );
}
