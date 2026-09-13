"use client";

import { useState } from "react";
import {
  PLACEHOLDER_PROJECTS,
  PORTFOLIO_VERIFIED,
  SHOW_PORTFOLIO,
  type Project,
} from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { Cta } from "@/components/cta";
import { Macbook } from "@/components/macbook";
import { ScrambleLink } from "@/components/scramble-link";

/**
 * LATEST WORK
 *
 * The client's reference composition: an oversized section word across the
 * top with a small index marker and an availability note, a numbered project
 * index down the left, and the selected project shown on a laptop to the
 * right.
 *
 * Selecting a project is a plain list of buttons with `aria-current`, not a
 * tablist. A tablist commits you to roving tabindex and arrow-key handling,
 * and getting that half-right is worse for a screen-reader user than not
 * claiming the pattern at all. The panel announces politely on change.
 *
 * The entries are sample content — see PLACEHOLDER_PROJECTS. They render on
 * the private preview so this layout can be signed off, and `pnpm verify`
 * blocks them from any indexable build.
 */
export function Work() {
  const projects: Project[] = SHOW_PORTFOLIO ? PLACEHOLDER_PROJECTS : [];
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-24 border-t border-ink-300 bg-ink-50"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        {/* ---------- Band head ---------- */}
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex items-start gap-4">
            <h2 id="work-heading" className="section-word">
              Latest work
            </h2>
            <span
              aria-hidden="true"
              className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-600"
            >
              (03)
            </span>
          </div>

          <p className="flex items-center gap-2.5 text-sm text-ink-900">
            <span aria-hidden="true" className="live-dot" />
            Taking enquiries for new projects
          </p>
        </div>

        {projects.length === 0 ? (
          <Reveal>
            <div className="mt-16 border border-dashed border-ink-400 px-8 py-20 text-center lg:py-28">
              <p className="display-soft text-display-sm text-ink-800">
                Case studies publishing soon.
              </p>
              <p className="lede mx-auto mt-5 max-w-[46ch]">
                We are finishing the first set of write-ups with our
                clients&rsquo; sign-off. If you would like to see relevant work
                before then, ask and we will walk you through it directly.
              </p>
              <Cta href="#contact" variant="ghost" className="mt-9">
                Request the portfolio
              </Cta>
            </div>
          </Reveal>
        ) : (
          <>
            {!PORTFOLIO_VERIFIED ? (
              <div className="mt-10 rounded-xl border border-dashed border-ink-500 px-5 py-4">
                <p className="text-sm leading-relaxed text-ink-800">
                  <strong className="font-medium text-ink-1000">
                    Sample entries — for design review only.
                  </strong>{" "}
                  No client work has been published yet. These exist so the
                  layout can be signed off and cannot reach a public build.
                  Note that they carry no performance figures: an invented
                  company is obvious, an invented result is not.
                </p>
              </div>
            ) : null}

            <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-12">
              {/* ---------- Index ---------- */}
              <div className="lg:col-span-4">
                {/* ink-600 rather than something darker: axe scores contrast
                    on anything visible, `aria-hidden` or not, and #2a2a2a on
                    this ground measures 1.5:1. #808080 is the lowest step in
                    the scale that clears AA and it still reads as a quiet
                    index number rather than a headline. */}
                <p
                  className="display text-[clamp(4rem,9vw,8rem)] leading-none text-ink-600"
                  aria-hidden="true"
                >
                  {String(active + 1).padStart(2, "0")}.
                </p>

                <ul className="mt-8 space-y-1">
                  {projects.map((project, i) => {
                    const selected = i === active;
                    return (
                      <li key={project.id}>
                        <button
                          type="button"
                          onClick={() => setActive(i)}
                          aria-current={selected ? "true" : undefined}
                          className={[
                            "group flex w-full items-center gap-4 py-2 text-left text-lg tracking-tight transition-colors duration-500",
                            selected
                              ? "text-ink-1000"
                              : "text-ink-600 hover:text-ink-900",
                          ].join(" ")}
                        >
                          <span
                            aria-hidden="true"
                            className={[
                              "block h-px shrink-0 bg-current transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                              selected ? "w-8" : "w-4 group-hover:w-6",
                            ].join(" ")}
                          />
                          {project.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ---------- Machine ---------- */}
              <Reveal className="lg:col-span-8" delay={0.06}>
                <Macbook />
              </Reveal>
            </div>

            {/* ---------- Selected project ---------- */}
            <div
              aria-live="polite"
              className="mt-16 grid gap-8 border-t border-ink-300 pt-10 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-5">
                <h3 className="display-soft text-display-sm text-ink-1000">
                  {current.title}
                </h3>
                <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-600">
                  {current.sector} — {current.year}
                </p>
              </div>

              <div className="lg:col-span-4">
                <p className="max-w-[46ch] leading-relaxed text-ink-800">
                  {current.summary}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {current.scope.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-ink-400 px-3 py-1 text-xs text-ink-700"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3 lg:pt-2">
                <ScrambleLink
                  href="#contact"
                  label="Read more"
                  className="w-full max-w-[16rem]"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
