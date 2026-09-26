import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/content";
import { resolveWorkImage } from "@/lib/work-image";
import { StackCards } from "@/components/kit/stack-cards";
import { BracketLink, SectionRule } from "./lurais-parts";
import { Brackets, StripeLabel } from "@/components/nocta-ui";

/**
 * 02 /FEATURED — Case studies, Nocta layout (Brad, 2026-09-26: "change this
 * 'selected work' section to the same layout as the 'case studies' on
 * nocta.framer.website" — studied, not copied).
 *
 * Striped label, the heading big on the left with the lede on the right,
 * then each project as one framed, full-width card: the cover fills it, a
 * bracketed /001/ index top-left and the sector top-right, the name bottom-
 * left over a scrim with its status, a bracketed arrow bottom-right. Below,
 * "More projects…" with the All projects button.
 *
 * The cards still OVERLAP as you scroll (Brad, 2026-09-25) — kit
 * StackCards, native sticky. The Concept badge stays printed on every card
 * it applies to (CLAUDE.md: load-bearing). Links follow WorkCard's rule:
 * case study first, live site otherwise.
 */
export function LuraisWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="02" label="Featured" />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <StripeLabel>Projects</StripeLabel>
            <h2 id="work-heading" className="display mt-6 text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.88] text-ink-1000">
              Case studies
            </h2>
          </div>
          <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-700 lg:pb-3">
            Recent builds, each shown as it stands today — live sites marked
            Live, speculative builds marked Concept.
          </p>
        </div>

        <StackCards
          list
          className="mt-14 lg:mt-20"
          cards={projects.map((p, i) => {
            const cover = resolveWorkImage(p.id);
            const href = p.caseStudy ? `/portfolio/${p.caseStudy}` : p.href;
            const external = !p.caseStudy && Boolean(p.href);
            const category = p.sector.split(" — ")[0];
            const chip =
              "border border-ink-400 bg-ink-0/85 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-1000";
            const body = (
              /* Width follows the SCREEN HEIGHT (Brad, 2026-09-25: the
                 screenshot must never be cropped at the top), so the card is
                 capped at 70svh × 16/9 and centred; object-top keeps each
                 site's own nav in view. */
              <div className="relative mx-auto w-full max-w-[calc(62svh*16/9)] border border-ink-300 bg-ink-50 shadow-[0_-24px_60px_rgb(0_0_0/0.6)]">
                <Brackets />
                {/* THE MACBOOK (Brad, 2026-09-26: "put the website previews
                    on a macbook screen"). Drawn in CSS rather than a stock
                    render, so each site's own screenshot sits exactly in the
                    screen — nav at the top, never cropped there — with no
                    device photo to licence. Generic laptop: no maker's mark. */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[radial-gradient(70%_60%_at_50%_42%,rgb(255_255_255/0.09),transparent_70%)] sm:aspect-[16/9]">
                  <span className={`absolute left-4 top-4 z-10 font-mono sm:left-5 sm:top-5 ${chip}`}>
                    <Brackets />/{String(i + 1).padStart(3, "0")}/
                  </span>
                  <span className={`absolute right-4 top-4 z-10 hidden sm:right-5 sm:top-5 sm:block ${chip}`}>
                    <Brackets />
                    {category}
                  </span>

                  <div className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-[44%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-[46%] motion-reduce:transition-none sm:w-[66%]">
                    {/* Lid */}
                    <div className="relative rounded-t-[4%_6%] bg-[linear-gradient(180deg,#2a2a2a,#161616)] p-[1.7%] pb-[2.4%] shadow-[0_30px_80px_rgb(0_0_0/0.7),inset_0_0_0_1px_rgb(255_255_255/0.12)]">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.4%] bg-ink-0">
                        {cover ? (
                          <Image
                            src={cover}
                            alt={`${p.title} — homepage`}
                            fill
                            quality={90}
                            sizes="(min-width: 1024px) 60vw, 86vw"
                            className="object-cover object-top"
                          />
                        ) : null}
                        {/* Glass: a faint diagonal sheen across the screen. */}
                        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.07)_0%,transparent_38%)]" />
                      </div>
                      {/* Camera */}
                      <span aria-hidden="true" className="absolute left-1/2 top-[0.7%] h-[0.9%] min-h-[3px] w-[0.9%] min-w-[3px] -translate-x-1/2 rounded-full bg-[#050505] ring-1 ring-white/10" />
                    </div>
                    {/* Base: a thin aluminium lip, wider than the lid, with the
                        thumb notch in the middle. */}
                    <div aria-hidden="true" className="relative -mx-[7%] h-0 pb-[3.2%] rounded-b-[50%_100%] bg-[linear-gradient(180deg,#d9d9d9_0%,#9a9a9a_35%,#4a4a4a_100%)] shadow-[0_18px_30px_rgb(0_0_0/0.6)]">
                      <span className="absolute left-1/2 top-0 h-[45%] w-[14%] -translate-x-1/2 rounded-b-[40%] bg-[linear-gradient(180deg,#7a7a7a,#a8a8a8)]" />
                    </div>
                  </div>
                </div>

                {/* Caption bar, under the stage rather than over the image. */}
                <div className="flex items-end justify-between gap-4 border-t border-ink-300 p-4 sm:p-6">
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.25rem,2.4vw,2rem)] font-semibold uppercase leading-none tracking-[-0.03em] text-ink-1000">
                      {p.title}
                    </h3>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-ink-800">
                      <span>{p.sector} / {p.year}</span>
                      {p.status ? (
                        <span className="border border-ink-500 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-1000">
                          {p.status}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-ink-400 text-ink-1000 transition-colors duration-300 group-hover:bg-ink-1000 group-hover:text-ink-0"
                  >
                    <Brackets />
                    <span className="transition-transform duration-500 group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            );
            return {
              key: p.id,
              node: href ? (
                <Link
                  href={href}
                  className="group block"
                  {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                >
                  {body}
                  <span className="sr-only">
                    {external ? " — opens in a new tab" : " — read the case study"}
                  </span>
                </Link>
              ) : (
                body
              ),
            };
          })}
        />

        <div className="mt-14 flex flex-col gap-6 border-t border-ink-300 pt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-20">
          <p className="text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium uppercase tracking-[-0.03em] text-ink-1000">
            More projects, more detail.
          </p>
          <BracketLink href="/portfolio">View the portfolio</BracketLink>
        </div>
      </div>
    </section>
  );
}
