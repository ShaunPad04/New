import { heroFonts } from "./hero-fonts";
import {
  buildStandards,
  founders,
  heroColumns,
  heroScrubLine,
  projects,
  site,
} from "@/lib/content";
import { StackMarquee } from "./lurais-parts";
import { HeroCta } from "./hero-cta";
import { SocialLinks } from "@/components/social-links";
import Image from "next/image";
import { resolveFounderAvatar } from "@/lib/work-image";
import { HeroFilm } from "./hero-film";
import { PlexusCursorLoader } from "./plexus-loader";

/**
 * HERO — Neiden direction (Brad, 2026-09-28, option A of /lab/hero). Layout
 * studied from neiden.framer.media; no assets, code or copy taken.
 *
 * Hairline three-column grid with corner ticks, numbered service columns, the
 * name enormous in Cal Sans lowercase with a grain fill and a periodic glitch,
 * "make premium look premium." in brush script across its foot, the lede and a
 * wide CTA from the centre column, and a proof cluster of things we can stand
 * behind (founders, the measured PageSpeed score) where Neiden has avatars and
 * reviews. Behind it all, our own particle-vortex film (`HeroFilm`).
 *
 * The fonts are declared here, not in the layout, so only the homepage
 * downloads them. Both are self-hosted by next/font at build.
 *
 * Replaces `LuraisFilmHero` (the 169-frame scroll film), which stays in the
 * repo until this is signed off.
 */

const WORDMARK_ID = "hero-wordmark";
// Neiden's labels, measured: DM Sans 700, 12px, caps, -0.02em.
const LABEL = "text-[0.75rem] font-bold uppercase tracking-[-0.02em]";
const RULE = "border-white/12";

function Name() {
  return (
    <>
      {/* One line at every width: the same lockup as desktop (Brad chose it
          over a two-line stack on phones, 2026-09-28). */}
      <span>black</span>
      <span className="ml-[0.22em]">line</span>
    </>
  );
}

export function NeidenHero() {
  const perf = buildStandards.find((s) => s.id === "perf");
  const count = String(projects.length).padStart(2, "0");
  const lede = site.description.split(". ")[0] + ".";

  return (
    <section
      aria-labelledby="hero-heading"
      className={`${heroFonts} relative isolate flex min-h-svh flex-col overflow-hidden bg-ink-0 text-ink-1000`}
    >
      <div
        aria-hidden="true"
        className="hero-backdrop absolute inset-0 -z-20"
      />
      <HeroFilm glitchId={WORDMARK_ID} />
      <PlexusCursorLoader />

      {/* The grid: outer rules plus two column rules, at every width (on a
          phone too, as Neiden's does). */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-6 right-6 grid grid-cols-3 border-x sm:left-10 sm:right-10 ${RULE}`}
      >
        <span className={`border-r ${RULE}`} />
        <span className={`border-r ${RULE}`} />
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-20 sm:px-10">
        <h1 id="hero-heading" className="sr-only">
          Black Line Agency — web design studio
        </h1>

        <p className={`text-center lg:text-right ${LABEL}`}>
          /<span className="text-accent">{count}</span> selected projects
        </p>

        {/* Three numbered columns above the name at every width; on a phone
            the number sits over the label, as on Neiden's. */}
        <ol
          className={`mt-9 grid grid-cols-3 max-lg:leading-tight lg:mt-14 ${LABEL}`}
        >
          {heroColumns.map((c, i) => (
            <li key={c} className="max-lg:pr-2 max-lg:not-first:pl-2">
              <span className="text-ink-600 max-lg:block">
                {String(i + 1).padStart(2, "0")}.
              </span>{" "}
              {c}
            </li>
          ))}
        </ol>

        <div className={`relative mt-6 border-y py-5 lg:mt-5 lg:py-6 ${RULE}`}>
          {[
            "-left-[3px] -top-[3px]",
            "-right-[3px] -top-[3px]",
            "-bottom-[3px] -left-[3px]",
            "-bottom-[3px] -right-[3px]",
          ].map((p) => (
            <span
              key={p}
              aria-hidden="true"
              className={`absolute size-1.5 bg-ink-1000 ${p}`}
            />
          ))}
          <p id={WORDMARK_ID} aria-hidden="true" className="hero-wm">
            <span className="hero-wm-base">
              <Name />
            </span>
            <span className="hero-wm-layer hero-wm-layer-a">
              <Name />
            </span>
            <span className="hero-wm-layer hero-wm-layer-b">
              <Name />
            </span>
          </p>
          <p aria-hidden="true" className="hero-script">
            {heroScrubLine.toLowerCase()}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-start-2">
            {/* Desktop: a short mono label, not a paragraph (Brad, 2026-09-28:
                the paragraph "looks out of place"; option B of four). Phones:
                the same words as a plain sentence, as Neiden's phone hero
                reads. The full description stays sr-only for search and
                screen readers. */}
            <p className="sr-only">{lede}</p>
            <p
              aria-hidden="true"
              className="max-w-[36ch] text-[1.0625rem] font-medium leading-[1.4] tracking-[-0.04em] text-ink-1000 lg:font-mono lg:font-normal lg:text-[0.75rem] lg:uppercase lg:leading-relaxed lg:tracking-[0.16em] lg:text-ink-800"
            >
              Websites, search, email &amp; SMS. Designed, built and run
              in-house.
            </p>
            <HeroCta className="mt-6" />
          </div>
          <div className="flex items-end lg:justify-end">
            <div className={`flex items-center gap-4 ${LABEL}`}>
              <span className="flex -space-x-2" aria-hidden="true">
                {founders.map((f) => {
                  const avatar = resolveFounderAvatar(f.name);
                  return (
                    <span
                      key={f.name}
                      className="relative grid size-11 place-items-center overflow-hidden rounded-full border border-white/30 bg-ink-100 text-[0.75rem] tracking-normal"
                    >
                      {avatar ? (
                        <Image src={avatar} alt="" width={44} height={44} loading="eager" className="size-full object-cover" />
                      ) : (
                        f.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                      )}
                    </span>
                  );
                })}
                {perf ? (
                  <span className="grid size-11 place-items-center rounded-full bg-ink-1000 tabular-nums tracking-normal text-ink-0">
                    {perf.value}
                  </span>
                ) : null}
              </span>
              <span className="leading-tight">
                Founder-led
                {perf ? (
                  <>
                    <br />
                    <span className="text-ink-700">
                      PageSpeed {perf.value} {perf.detail.split(", ")[1]}
                    </span>
                  </>
                ) : null}
              </span>
            </div>
          </div>
        </div>

        {/* The stack's logos along the hero's foot, as Neiden runs its logo
            row (Brad, 2026-09-28). Moved here from the intro below, so the
            page does not say it twice back to back. */}
        {/* The foot, as Neiden's: phones stack the logo row over the socials;
            desktop puts the socials in the first column and starts the logo
            row at the second column rule (Brad: "start from here like
            neiden does rather than the whole screen"). */}
        <div className="mt-auto pt-8 lg:grid lg:grid-cols-3 lg:items-center lg:pt-12">
          <StackMarquee className="lg:col-span-2 lg:col-start-2 lg:row-start-1" />

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 lg:col-start-1 lg:row-start-1 lg:mt-0">
            <SocialLinks className="gap-2" />
            <p className={`leading-tight text-ink-700 ${LABEL}`}>
              Stay
              <br />
              connected
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
