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
              <div className="relative mx-auto w-full max-w-[calc(70svh*16/9)] border border-ink-300 bg-ink-100 shadow-[0_-24px_60px_rgb(0_0_0/0.6)]">
                <Brackets />
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-200 sm:aspect-[16/9]">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={`${p.title} — homepage`}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 80vw, 92vw"
                      className="object-cover object-left-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:scale-100! sm:object-top"
                    />
                  ) : null}
                  {/* Scrims: a light one under the chips, a heavier one under
                      the name, so both read on any cover. */}
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-0/55 to-transparent" />
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-0/90 via-ink-0/50 to-transparent" />

                  <span className={`absolute left-4 top-4 font-mono sm:left-5 sm:top-5 ${chip}`}>
                    <Brackets />/{String(i + 1).padStart(3, "0")}/
                  </span>
                  <span className={`absolute right-4 top-4 hidden sm:right-5 sm:top-5 sm:block ${chip}`}>
                    <Brackets />
                    {category}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
                    <div className="min-w-0">
                      <h3 className="text-[clamp(1.25rem,2.4vw,2rem)] font-semibold uppercase leading-none tracking-[-0.03em] text-ink-1000">
                        {p.title}
                      </h3>
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-ink-800">
                        <span>{p.year}</span>
                        {p.status ? (
                          <span className="border border-ink-500 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-1000">
                            {p.status}
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center border border-ink-400 bg-ink-0/70 text-ink-1000 transition-colors duration-300 group-hover:bg-ink-1000 group-hover:text-ink-0"
                    >
                      <Brackets />
                      <span className="transition-transform duration-500 group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
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
