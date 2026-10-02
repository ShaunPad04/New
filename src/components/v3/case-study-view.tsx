import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { projects, type CaseStudy, type Project } from "@/lib/content";
import { resolveWorkImage } from "@/lib/work-image";
import { Bridge } from "./bridge";
import { linkOf, projectPicture } from "./case-studies";
import { BarLabel, Block, Grid, LABEL } from "./page-grid";

/**
 * A CASE STUDY, after neiden.framer.media's project page (Brad, 2026-10-02:
 * the old page was a caps title on plain black; studied, nothing taken).
 *
 *  1. The project's own picture full-screen. It is the SAME element as the
 *     homepage frame (`ViewTransition name="project-<id>"`), so the picture
 *     grows into this hero on the way in. Over it: the label, the name, the
 *     lede, the live-site and all-projects buttons, and the facts table.
 *  2. The write-up on a light reading band, on the hero's three-column grid:
 *     the brief, the live homepage as it stands, the approach, what we found
 *     and fixed, the standards and the plain note on results.
 *  3. More work: the other projects, each linking to its case study when one
 *     exists, else to its live site.
 *
 * The honesty rules of the old page stand: it describes what we were asked
 * for, designed and built, never a result the project has not produced.
 */
export function CaseStudyView({ study, project, caseBase = "/portfolio" }: { study: CaseStudy; project?: Project; caseBase?: string }) {
  const pic = projectPicture(study.projectId);
  // The live site as it stands: the dated cover, interface and all.
  const cover = resolveWorkImage(study.projectId);
  const others = projects.filter((p) => p.id !== study.projectId);

  return (
    <>
      {/* ---------- 1. The picture, full-screen ---------- */}
      {/* Phones: the picture full width under the bar at the homepage
          frame's 4:3, words beneath on black. Desktop: the picture fills the
          screen behind the words. Either way the same element as the frame. */}
      <section aria-labelledby="case-heading" className="relative isolate flex flex-col overflow-hidden bg-ink-0 pt-11 text-white lg:min-h-svh lg:justify-end lg:pt-0">
        <ViewTransition name={`project-${study.projectId}`} share="morph" default="none">
          <div className="relative aspect-[4/3] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
            {pic ? (
              <Image src={pic} alt={`${study.title}: the site's hero imagery`} fill preload sizes="100vw" className="object-cover" />
            ) : null}
          </div>
        </ViewTransition>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-11 aspect-[4/3] bg-gradient-to-t from-black to-transparent to-40% lg:hidden" />
        {/* Dark only where the words sit, so the picture still reads above. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 hidden bg-gradient-to-t from-black from-10% via-black/60 via-45% to-black/0 lg:block" />
        <Grid rule="border-white/12" />

        {/* Named for the browser, so the words rise in OVER the growing
            picture instead of waiting under it until it lands (a React
            `enter` boundary does not fire when the whole page mounts). */}
        <div className="relative z-[2] px-6 pb-10 pt-6 [view-transition-name:case-copy] sm:px-10 lg:pb-14 lg:pt-28">
          {/* "Case study": our words, in the site's bilingual label. */}
          <BarLabel label="Case study" ja="事例研究" />
          <h1 id="case-heading" className="mt-6 text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
            {study.title}
          </h1>
          {/* Desktop: the lede and buttons in the first column, the facts
              across the other two, so the words take the lower half and the
              picture keeps the upper one. Phones stack. */}
          <div className="mt-8 grid gap-10 lg:grid-cols-3 lg:items-end lg:gap-0">
            <div className="lg:pr-10">
              <p className="max-w-[44ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-white/85">
                {study.lede}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project?.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex h-[52px] min-w-[13rem] items-center justify-between gap-6 bg-white px-5 text-black transition-colors duration-300 hover:bg-accent hover:text-white ${LABEL}`}
                  >
                    Visit the site
                    <span aria-hidden="true" className="text-lg transition-transform duration-500 group-hover:rotate-180">
                      +
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : null}
                <Link
                  href="/portfolio"
                  className={`flex h-[52px] min-w-[11rem] items-center justify-between gap-6 border border-white/40 px-5 transition-colors duration-300 hover:border-white hover:bg-white/10 ${LABEL}`}
                >
                  All projects <span aria-hidden="true">→</span>
                </Link>
              </div>
              <p className="mt-5 max-w-[46ch] text-[0.8125rem] leading-relaxed text-white/60">{study.previewNote}</p>
            </div>
            <dl className="border-t border-white/15 lg:col-span-2">
              {study.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-3 border-b border-white/15 py-3 lg:grid-cols-2">
                  <dt className={`${LABEL} text-white/60 lg:pl-3`}>{f.label}</dt>
                  <dd className={`col-span-2 ${LABEL} text-white lg:col-span-1 lg:pl-3`}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---------- 2. The write-up ---------- */}
      <Bridge from="#000000" to="#f0f0f0" />
      <div className="band-light relative bg-ink-0">
        <Grid rule="border-ink-1000/8" reading />
        <div className="relative px-6 sm:px-10">
          <Block index="01" label="The brief" id="brief-heading" heading="What we were asked for.">
            <div className="max-w-[60ch] space-y-6">
              {study.brief.map((p) => (
                <p key={p.slice(0, 24)} className="text-[1.125rem] leading-[1.55] tracking-[-0.02em] text-ink-800 lg:text-[1.25rem]">
                  {p}
                </p>
              ))}
            </div>
          </Block>

          {cover ? (
            <figure className="relative z-[2] pb-8 lg:pb-12">
              <div className="relative aspect-[16/9] overflow-hidden border border-ink-1000/10 bg-ink-100">
                <Image src={cover} alt={`The ${study.title} homepage as it stands`} fill sizes="(min-width: 1600px) 1520px, 94vw" className="object-cover object-top" />
              </div>
              <figcaption className={`mt-3 ${LABEL} text-ink-700`}>The live homepage, as it stands</figcaption>
            </figure>
          ) : null}

          <Block index="02" label="The approach" id="approach-heading" heading="How we built it.">
            <ol className="border-t border-ink-300">
              {study.approach.map((a, i) => (
                <li key={a.title} className="grid gap-3 border-b border-ink-300 py-8 lg:grid-cols-2 lg:gap-10 lg:py-10">
                  <h3 className="text-[1.375rem] font-semibold leading-tight tracking-[-0.03em] text-ink-1000">
                    <span className="mr-3 text-[0.875rem] tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {a.title}
                  </h3>
                  <p className="text-[1rem] leading-relaxed text-ink-700">{a.body}</p>
                </li>
              ))}
            </ol>
          </Block>

          <Block index="03" label="What we found" id="changed-heading" heading="Four things we found, and fixed.">
            <p className="max-w-[56ch] text-[1rem] leading-relaxed text-ink-700">
              Every one of these was measured rather than assumed. They are the unglamorous half of the work, and they are the half that decides whether a site earns anything.
            </p>
            <ul className="mt-10 grid gap-px bg-ink-300 sm:grid-cols-2">
              {study.changed.map((c) => (
                <li key={c.title} className="bg-ink-0 p-7 lg:p-9">
                  <h3 className="text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-ink-1000">{c.title}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700">{c.body}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block index="04" label="Held to" id="standards-heading" heading="The standards.">
            <div className="grid gap-10 lg:grid-cols-2">
              <ul className="space-y-4">
                {study.standards.map((sd) => (
                  <li key={sd} className="flex items-start gap-4 text-[1rem] leading-relaxed text-ink-800">
                    <span aria-hidden="true" className="mt-3 block h-px w-4 shrink-0 bg-ink-1000" />
                    {sd}
                  </li>
                ))}
              </ul>
              <div className="border border-ink-300 p-7 lg:p-9">
                <p className={`${LABEL} text-ink-700`}>On results</p>
                <p className="mt-4 text-[1rem] leading-relaxed text-ink-800">{study.outcomeNote}</p>
              </div>
            </div>
          </Block>
        </div>
      </div>

      {/* ---------- 3. More work ---------- */}
      <Bridge from="#f0f0f0" to="#000000" />
      <section aria-labelledby="more-heading" className="relative bg-ink-0 text-white">
        <Grid rule="border-white/12" />
        <div className="relative z-[2] px-6 pb-20 pt-10 sm:px-10 lg:pb-28">
          <div className="flex items-end justify-between gap-6">
            <h2 id="more-heading" className="text-[clamp(2.5rem,6vw,6rem)] font-semibold leading-[0.95] tracking-[-0.055em]">
              More work.
            </h2>
            <Link href="/portfolio" className={`hidden min-h-11 items-center gap-2 text-white/70 hover:text-white sm:inline-flex ${LABEL}`}>
              All projects <span aria-hidden="true">+</span>
            </Link>
          </div>
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
            {others.map((p) => {
              const img = projectPicture(p.id);
              const { href, external } = linkOf(p, caseBase);
              const i = projects.indexOf(p);
              return (
                <li key={p.id}>
                  <Link href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group block">
                    <ViewTransition name={p.caseStudy ? `project-${p.id}` : undefined} share={p.caseStudy ? "morph" : undefined} default="none">
                      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                        {img ? (
                          <Image src={img} alt="" fill sizes="(min-width: 768px) 31vw, 94vw" className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none" />
                        ) : null}
                      </div>
                    </ViewTransition>
                    <div className={`mt-4 flex items-center justify-between gap-4 ${LABEL}`}>
                      <h3 className="text-white">
                        <span className="mr-2 text-white/55">{String(i + 1).padStart(2, "0")}.</span>
                        {p.title}
                      </h3>
                      {p.status ? <span className="border border-white/50 px-2 py-0.5 text-[0.625rem] tracking-[0.08em]">{p.status}</span> : null}
                    </div>
                    <p className="mt-2 text-[0.875rem] text-white/60">
                      {p.sector.replace(" — ", ", ")}
                      {external ? <span className="sr-only"> (opens the live site in a new tab)</span> : null}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
