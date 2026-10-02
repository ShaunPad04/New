import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { projects, type Project } from "@/lib/content";
import { resolveCleanImage, resolveWorkImage } from "@/lib/work-image";
import { StudioDrift } from "./studio-drift";
import { CaseStudiesBackdrop } from "./case-studies-backdrop";

/**
 * CASE STUDIES — after the "Portfolio" section of neiden.framer.media (Brad,
 * 2026-09-30: "i like this design for my portfolio bit"); layout and motion
 * studied, no assets, code or copy taken.
 *
 * A dark intro with the bilingual label, a line, and a giant "Case studies."
 * sliding sideways with the scroll. Then, as Neiden's (measured): ONE pinned
 * full-screen background holding every project's picture, lightly blurred,
 * cross-fading to whichever project is centred (`CaseStudiesBackdrop`); over
 * it each project is a framed picture about three-quarters of the screen
 * tall on the grid, zooming in as it arrives and drifting as it leaves
 * (`.cs-frame-img`), with the info row (index / year / client) in the gap
 * above it and the project's line, Live / Concept badge (load-bearing, see
 * CLAUDE.md) and scope in the gap below, both over the blurred background.
 *
 * A project without a clean picture falls back to its normal cover. The
 * pictures are each site's own hero imagery with the interface stripped
 * out (`public/images/work/clean/<id>.<date>.webp`, captured from the live
 * sites 2026-09-30), so the section reads as photography, not screenshots.
 * The line under each name is the project's own `sector`: nothing claimed.
 */

const SMALL = "text-[0.75rem] font-semibold uppercase tracking-[0.02em]";
/** The project's clean hero picture, else its normal cover. */
export function projectPicture(id: string): string | undefined {
  return resolveCleanImage(id) ?? resolveWorkImage(id) ?? undefined;
}

export function linkOf(p: Project, caseBase = "/portfolio") {
  const href = p.caseStudy ? `${caseBase}/${p.caseStudy}` : (p.href ?? "/portfolio");
  const external = !p.caseStudy && Boolean(p.href);
  return { href, external };
}

/** The hero's hairline grid, carried on. */
function Grid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-6 right-6 z-[1] grid grid-cols-3 border-x border-white/10 sm:left-10 sm:right-10"
    >
      <span className="border-r border-white/10" />
      <span className="border-r border-white/10" />
    </div>
  );
}

/**
 * `heading` is "h1" where the list IS the page (/portfolio); `closing` drops
 * the "All projects" row there, since that is where it would lead.
 * `caseBase` is the route the case studies live under.
 */
export function CaseStudies({
  heading: H = "h2",
  closing = true,
  caseBase = "/portfolio",
}: {
  heading?: "h1" | "h2";
  closing?: boolean;
  caseBase?: string;
}) {
  // Project names sit one level under the section heading.
  const T = H === "h1" ? "h2" : "h3";
  return (
    <section id="work" aria-labelledby="work-heading" className="relative scroll-mt-24 bg-[#161616] text-white">
      <div className="relative isolate overflow-hidden">
        <Grid />
        <div className="relative z-[2] mx-auto w-full max-w-[1600px] px-6 pt-16 sm:px-10 lg:pt-24">
          <p className="flex items-center gap-3 text-[0.875rem] font-semibold uppercase tracking-[-0.04em]">
            <span aria-hidden="true" className="flex gap-[3px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-3 w-[5px] rounded-[1px] bg-accent" />
              ))}
            </span>
            <span>
              {/* "Work and its record": our words, Neiden's bilingual label. */}
              [BL™ — Portfolio /{" "}
              <span lang="ja" className="text-white/55">
                仕事と記録
              </span>
              ]
            </span>
          </p>
          <p className="mt-4 max-w-[30ch] text-[0.9375rem] leading-[1.45] tracking-[-0.02em] text-white/65">
            Recent builds, each shown as it stands today: live sites marked
            Live, speculative builds marked Concept.
          </p>
        </div>

        <StudioDrift className="relative z-[2] mt-6 overflow-hidden pb-4 lg:mt-2">
          <H id="work-heading" className="sr-only">
            Case studies
          </H>
          <p
            aria-hidden="true"
            className="whitespace-nowrap pl-[20vw] text-[clamp(4rem,12vw,12rem)] font-semibold leading-[1] tracking-[-0.06em] [transform:translate3d(calc(var(--d,0px)*-0.6),0,0)]"
          >
            Case studies. Case studies. Case studies.
          </p>
          <p className={`mx-auto w-full max-w-[1600px] px-6 text-white/55 sm:px-10 lg:pl-[calc(33.33%+0.5rem)] ${SMALL}`}>
            © 2026
          </p>
        </StudioDrift>
      </div>

      <CaseStudiesBackdrop images={projects.map((p) => projectPicture(p.id)).filter((x): x is string => Boolean(x))}>
        <Grid />
        <ul className="relative z-[2] mx-auto w-full max-w-[1600px] px-6 sm:px-10">
          {projects.map((p, i) => {
            const pic = projectPicture(p.id);
            const { href, external } = linkOf(p, caseBase);
            return (
              <li key={p.id} data-cs className="py-10 lg:py-14">
                <Link href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group block">
                  {/* In the gap above the picture, over the blurred background. */}
                  <div className={`grid grid-cols-3 items-center text-white/70 ${SMALL}`}>
                    <span>{String(i + 1).padStart(2, "0")}.</span>
                    <span>
                      Year <span className="text-white">{p.year}</span>
                    </span>
                    <div className="text-right lg:text-left">
                      Client <T className="inline text-white">{p.title}</T>
                    </div>
                  </div>

                  {/* A project with a case study shares its frame with that
                      page's full-screen hero, so the picture grows into it on
                      the way in (React `ViewTransition`; browsers without the
                      View Transitions API just change page). */}
                  <ViewTransition name={p.caseStudy ? `project-${p.id}` : undefined} share={p.caseStudy ? "morph" : undefined} default="none">
                    <div data-cs-frame className="relative mt-5 aspect-[4/3] overflow-hidden bg-black/30 lg:aspect-auto lg:h-[72svh] [@media(hover:hover)_and_(pointer:fine)]:cursor-none">
                      {pic ? (
                        <Image
                          src={pic}
                          alt={`${p.title}: the site's hero imagery`}
                          fill
                          sizes="(min-width: 1600px) 1520px, 94vw"
                          className="cs-frame-img object-cover"
                        />
                      ) : null}
                    </div>
                  </ViewTransition>

                  {/* And in the gap below it. */}
                  <div className="mt-5 grid gap-3 lg:grid-cols-3">
                    <p className="flex flex-wrap items-center gap-3 lg:col-start-2">
                      <span className="text-[1rem] font-semibold uppercase tracking-[-0.01em]">
                        {p.sector.replace(" — ", ", ")}
                      </span>
                      {p.status ? (
                        <span className="border border-white/50 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em]">
                          {p.status}
                        </span>
                      ) : null}
                    </p>
                    <ul className={`flex flex-wrap gap-x-4 gap-y-1 text-white/75 lg:flex-col lg:items-end ${SMALL}`}>
                      {p.scope.slice(0, 3).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </CaseStudiesBackdrop>

      {closing ? (
        <div className="relative isolate overflow-hidden">
          <Grid />
          <div className="relative z-[2] mx-auto flex w-full max-w-[1600px] items-center justify-between gap-6 px-6 py-14 sm:px-10">
            <p className={`text-white/55 ${SMALL}`}>More projects, more detail</p>
            <Link
              href="/portfolio"
              className={`flex h-12 w-full max-w-[16rem] items-center justify-between bg-white px-5 text-black transition-colors duration-300 hover:bg-accent hover:text-white ${SMALL}`}
            >
              All projects <span aria-hidden="true">+</span>
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
