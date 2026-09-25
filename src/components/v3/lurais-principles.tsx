import Image from "next/image";
import { buildStandardsBand, faqs, projectTiers } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { Dots, GutterWord, SectionRule } from "./lurais-parts";

/**
 * 04 /PRINCIPLES — Lurais's bento of principle cards.
 *
 * Every card states something the site already states elsewhere, read from
 * the same data so the two can never disagree:
 *   - the delivery window is `projectTiers[0].delivery`, conditional and all
 *     ("once we have your content" is what makes it keepable — CLAUDE.md);
 *   - the scores are `buildStandardsBand`, which carries the "scores, never
 *     conformance" rule;
 *   - ownership is the Ownership FAQ's own first sentence.
 * Nothing here is new copy making a new promise.
 */
export function LuraisPrinciples() {
  const measured = buildStandardsBand.blocks[0];
  const method = buildStandardsBand.blocks[1];
  // The answer opens "Entirely." — the claim is the SECOND sentence.
  const ownership = faqs.find((f) => f.meta === "Ownership")?.a.split(". ")[1] ?? "";
  const card = "relative overflow-hidden rounded-2xl";

  return (
    <section aria-labelledby="principles-heading" className="bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="04" label="Principles" />
      </div>
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 pb-24 pt-16 sm:px-8 lg:grid-cols-[14rem_1fr] lg:pb-32 lg:pt-24">
        <GutterWord>Principles</GutterWord>
        <div>
          <h2 id="principles-heading" className="display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] text-ink-1000">
            <Dots />
            How we work
          </h2>

          <div className="mt-14 grid gap-3 md:grid-cols-6 md:grid-rows-[repeat(2,minmax(15rem,auto))]">
            {/* Large image card */}
            <Reveal variant="settle" className={`${card} min-h-[22rem] md:col-span-4 md:row-span-1`}>
              <Image src="/images/process/build.webp" alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover opacity-70 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-7 lg:p-9">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-white/80">{measured.label}</p>
                <p className="display mt-3 text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] text-white">{measured.heading}</p>
                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-white/80">{measured.body}</p>
              </div>
            </Reveal>

            <Reveal variant="settle" delay={0.06} className={`${card} bg-ink-100 p-7 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] md:col-span-2 lg:p-9`}>
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">Founder-led</p>
              <p className="mt-6 text-2xl font-medium leading-tight tracking-[-0.03em] text-ink-1000">
                The two people who build it are the two people you talk to.
              </p>
            </Reveal>

            <Reveal variant="settle" delay={0.1} className={`${card} bg-ink-100 p-7 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] md:col-span-2 lg:p-9`}>
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">Speed</p>
              <p className="mt-6 text-2xl font-medium leading-tight tracking-[-0.03em] text-ink-1000">
                {projectTiers[0].delivery}.
              </p>
              <p className="mt-3 text-xs text-ink-600">{projectTiers[0].name} tier. Larger builds take longer.</p>
            </Reveal>

            <Reveal variant="settle" delay={0.14} className={`${card} min-h-[15rem] md:col-span-2`}>
              <Image src="/images/process/design.webp" alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover opacity-60 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
              <div className="relative flex h-full flex-col justify-end p-7">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-white">Yours outright</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{ownership}.</p>
              </div>
            </Reveal>

            <Reveal variant="settle" delay={0.18} className={`${card} bg-ink-100 p-7 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)] md:col-span-2 lg:p-9`}>
              <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-600">{method.label}</p>
              <p className="mt-6 text-2xl font-medium leading-tight tracking-[-0.03em] text-ink-1000">{method.heading}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
