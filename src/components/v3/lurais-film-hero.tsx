import Link from "next/link";
import { heroDisciplines, projects } from "@/lib/content";
import { HeroSequence } from "@/components/hero-sequence";
import { HeroScrubLine } from "@/components/hero";
import { LocalTime } from "./local-time";

/**
 * HERO — Lurais layout over the client's scroll film (Brad, 2026-09-25:
 * dark, keep the scroll film).
 *
 * `HeroSequence` is untouched: the same pinned, scrubbed 169-frame film on
 * desktop and tablet, the same still on phones, the same poster as LCP. Only
 * the foreground changes — disciplines top-left, Grimsby and live UK time
 * top-right, the project count and the name enormous across the foot — and
 * it leaves on the scroll exactly as the old foreground did (`--hero-progress`
 * × 5, gone by ~20% of the pin) so the scrubbed line takes the frame after.
 *
 * The site header stays the fixed bar on top; the template's own top bar is
 * not duplicated.
 */
export function LuraisFilmHero() {
  const count = String(projects.length).padStart(2, "0");
  return (
    <HeroSequence>
      <HeroScrubLine />
      <div
        style={{
          transform: "translate3d(0, calc(min(var(--hero-progress, 0) * 5, 1) * 12vh), 0)",
          opacity: "calc(1 - var(--hero-progress, 0) * 5)",
          willChange: "transform, opacity",
        }}
        className="relative flex w-full flex-1 flex-col px-6 pb-6 pt-28 text-ink-1000 sm:px-8 lg:pt-32"
      >
        <div className="flex items-start justify-between [text-shadow:0_1px_14px_rgb(0_0_0/0.5)]">
          <ul className="hidden text-[0.9375rem] leading-snug text-ink-1000/90 sm:block">
            {heroDisciplines.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="ml-auto text-right text-[0.8125rem] font-semibold uppercase tracking-[0.02em]">
            Grimsby, UK /
            <br />
            <LocalTime className="font-mono text-[0.9375rem] tracking-[0.06em]" />
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-14">
            <div className="shrink-0">
              <p aria-hidden="true" className="display text-[clamp(3rem,7vw,6.5rem)] leading-[0.8] tabular-nums">
                /{count}
              </p>
              <p className="mt-2 text-[0.8125rem] font-semibold uppercase tracking-[0.02em]">
                {count} selected projects
              </p>
            </div>
            {/* The giant name was removed from view (Brad, 2026-09-25: "it
                clogs the hero … keep it simple, keep it fresh"). The <h1>
                stays — the page's one top-level heading, for search and
                screen readers, and what the hero section is labelled by —
                it is just no longer drawn over the film. */}
            <h1 id="hero-heading" className="sr-only">
              Black Line Agency — web design studio
            </h1>
          </div>
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/25 pt-4 text-[0.8125rem] font-semibold uppercase tracking-[0.02em]">
            <span>Web design studio</span>
            <Link href="#contact" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              Start a project ↗
            </Link>
          </div>
        </div>
      </div>
    </HeroSequence>
  );
}
