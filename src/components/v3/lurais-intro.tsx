import { site, stackLogos } from "@/lib/content";
import { ScrollText, type ScrollToken } from "@/components/kit/scroll-text";
import { resolveServiceImage, resolveWorkImage } from "@/lib/work-image";
import { ScrollPin } from "@/components/kit/scroll-pin";
import { VelocityMarquee } from "@/components/kit/velocity-marquee";
import { BracketLink, GutterWord, SectionRule } from "./lurais-parts";
import { LocalTime } from "./local-time";

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
  const tokens = styledStatement(statement);
  const studioLine = `${site.heroLine} Founder-led: the two people who design and build your site are the two people you talk to.`;
  return (
    <section aria-labelledby={headingId} className="bg-ink-0 text-ink-1000">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="01" label="Introduction" />
      </div>
      {/* PINNED (Brad, 2026-09-26): the statement holds mid-screen and
          lights word by word as you scroll; the page only moves on once the
          whole sentence is lit.

          FILLED (Brad, same day: "this about us part seems quite empty").
          The pinned screen was one sentence and a lot of black. It now
          carries the studio ledger — where we are (with the live UK time),
          who you deal with, how fast we answer — which arrives as the
          sentence completes, so the payoff of the scroll is information
          rather than more empty space. On desktop the studio line and its
          link sit inside the pin too; on phones they follow it, so the
          pinned screen always fits one phone screen. Every line is a fact
          the site already states (location: legal.ts / footer; founders;
          the one-working-day reply: the enquiry section). */}
      <ScrollPin stageClassName="mx-auto w-full max-w-[1600px]">
        <div className="grid w-full gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[14rem_1fr] lg:py-8">
          <GutterWord>About us</GutterWord>
          <div className="lg:max-w-[62rem] lg:self-center lg:justify-self-end">
            <h2 id={headingId} className="sr-only">
              About Black Line Agency
            </h2>
            <ScrollText
              text={statement}
              tokens={tokens}
              dim={0.4}
              pinned
              className="intro-statement text-[clamp(1.625rem,min(3.6vw,4.3svh),3.5rem)] leading-[1.04] text-ink-1000"
            />

            <dl className="intro-ledger mt-10 grid border-y border-ink-300 sm:grid-cols-3 lg:mt-14">
              <div className="flex items-baseline justify-between gap-4 border-b border-ink-300 py-4 sm:block sm:border-b-0 sm:border-r sm:py-6 sm:pr-6">
                <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600">/Studio</dt>
                <dd className="text-right text-[0.9375rem] font-medium text-ink-1000 sm:mt-3 sm:text-left">
                  Humberston, Grimsby
                  <span className="mt-1 block text-[0.8125rem] font-normal text-ink-700">
                    UK time <LocalTime className="tabular-nums text-ink-1000" /> · working UK-wide
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b border-ink-300 py-4 sm:block sm:border-b-0 sm:border-r sm:px-6 sm:py-6">
                <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600">/Founders</dt>
                <dd className="text-right text-[0.9375rem] font-medium text-ink-1000 sm:mt-3 sm:text-left">
                  Two, and no account managers
                  <span className="mt-1 block text-[0.8125rem] font-normal text-ink-700">The people you talk to build it</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-4 sm:block sm:py-6 sm:pl-6">
                <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600">/Reply</dt>
                <dd className="text-right text-[0.9375rem] font-medium text-ink-1000 sm:mt-3 sm:text-left">
                  Within one working day
                  <span className="mt-1 block text-[0.8125rem] font-normal text-ink-700">Every enquiry, answered by a founder</span>
                </dd>
              </div>
            </dl>

            <div className="intro-ledger mt-10 hidden items-end justify-between gap-10 lg:flex">
              <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-800">{studioLine}</p>
              <BracketLink href="/studio" className="shrink-0">The studio</BracketLink>
            </div>
          </div>
        </div>
      </ScrollPin>
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 pb-24 sm:px-8 lg:grid-cols-[14rem_1fr] lg:pb-32">
        <div aria-hidden="true" className="hidden lg:block" />
        <div className="w-full lg:max-w-[62rem] lg:justify-self-end">
          {/* Phones: the studio line follows the pin rather than crowding it. */}
          <div className="lg:hidden">
            <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-800">{studioLine}</p>
            <BracketLink href="/studio" className="mt-8">
              The studio
            </BracketLink>
          </div>

          <div className="mt-16 grid items-center gap-6 border-t border-ink-300 pt-8 sm:grid-cols-[10rem_1fr] lg:mt-0">
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

/**
 * The statement set as Brad's "P3" (2026-09-26, after porto-template.framer
 * .website): white key phrases, grey linking words, three pictures in the
 * line (a live build, then the search and email stills) and "earning" in
 * hollow letters. The words are the site description's first sentence,
 * unchanged; if that copy is ever edited and no longer matches, this falls
 * back to the plain sentence rather than showing words the copy no longer
 * says.
 */
function styledStatement(statement: string): ScrollToken[] | undefined {
  const pics = [resolveWorkImage("b-boutique"), resolveServiceImage("seo"), resolveServiceImage("email")];
  const [work, seo, email] = pics;
  const mute = (text: string): ScrollToken[] => text.split(" ").map((t) => ({ text: t, tone: "mute" as const }));
  const plain = (text: string): ScrollToken[] => text.split(" ");
  const img = (src: string | null): ScrollToken[] => (src ? [{ img: src }] : []);
  const tokens: ScrollToken[] = [
    ...plain("Black Line Agency"),
    ...mute("designs"),
    ...img(work),
    ...mute("and builds"),
    ...plain("high-performance websites,"),
    ...mute("then runs the"),
    ...plain("search,"),
    ...img(seo),
    ...plain("email and SMS"),
    ...img(email),
    ...mute("marketing that keeps them"),
    { text: "earning.", tone: "outline" },
  ];
  const spelled = tokens
    .filter((t) => typeof t === "string" || "text" in t)
    .map((t) => (typeof t === "string" ? t : "text" in t ? t.text : ""))
    .join(" ");
  return spelled === statement ? tokens : undefined;
}
