import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/content";
import { resolveWorkImage } from "@/lib/work-image";
import { Reveal } from "@/components/reveal";
import { BracketLink, Dots, SectionRule } from "./lurais-parts";

/**
 * 02 /FEATURED — ".. selected work", Lurais layout.
 *
 * Each project full width, large, one after another, caption beneath:
 * title in caps, then sector / year, then the status — the Concept badge
 * is load-bearing (CLAUDE.md: those builds use other businesses' names and
 * they have not engaged us), so it is always printed, never styled away.
 * Links follow WorkCard's rule: case study first, live site otherwise.
 */
export function LuraisWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-24 bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="02" label="Featured" />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24">
        <h2 id="work-heading" className="display text-[clamp(3rem,10vw,9rem)] leading-[0.85] text-ink-1000 lg:pl-[14rem]">
          <Dots />
          Selected work
        </h2>

        <ul className="mt-16 grid gap-16 lg:mt-24 lg:gap-24 lg:pl-[14rem]">
          {projects.map((p) => {
            const cover = resolveWorkImage(p.id);
            const href = p.caseStudy ? `/portfolio/${p.caseStudy}` : p.href;
            const external = !p.caseStudy && Boolean(p.href);
            const body = (
              <>
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink-200">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={`${p.title} — homepage`}
                      fill
                      quality={90}
                      sizes="(min-width: 1024px) 78vw, 92vw"
                      className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:scale-100!"
                    />
                  ) : null}
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-[0.9375rem] font-semibold uppercase tracking-[0.01em] text-ink-1000">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-700">
                      {p.sector} / {p.year}
                    </p>
                  </div>
                  {p.status ? (
                    <span className="shrink-0 rounded-full border border-ink-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.04em] text-ink-800">
                      {p.status}
                    </span>
                  ) : null}
                </div>
              </>
            );
            return (
              <Reveal as="li" key={p.id} variant="settle">
                {href ? (
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
                )}
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-16 lg:mt-24 lg:pl-[14rem]">
          <BracketLink href="/portfolio">View the portfolio</BracketLink>
        </div>
      </div>
    </section>
  );
}
