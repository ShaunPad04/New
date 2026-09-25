import Image from "next/image";
import { creativeService } from "@/lib/content";
import { resolveCreativeShowcase } from "@/lib/work-image";
import { Cta } from "@/components/cta";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * CREATIVE & AERIAL — the standalone service section.
 *
 * Built from the client's own concept (2026-09-14). Every figure and every
 * line of copy lives in `creativeService` in content.ts; nothing is written
 * here. Read the long comment on that export before touching any of it — it
 * records the two things that are not a developer's to decide, and why this
 * section is gated off until they are settled.
 *
 * WHERE IT SITS, as the concept specifies: between the services list and the
 * studio story. The visitor has just read what we do; this lands before they
 * decide whether to trust us with it.
 *
 * HOW IT IS BUILT is the house vocabulary rather than the artifact's own
 * markup — the concept was drawn to match this system, so it is the system
 * that should render it. The mobile treatments are the ones settled today:
 * a plain tracked label instead of a capsule, hung mono indices with a rule
 * on the steps, and no nested rounded frames around anything.
 *
 * THE SHOWCASE RENDERS NOTHING WHEN THERE IS NOTHING. Four dashed empties
 * would say "unfinished" on a section whose entire job is proving we can
 * make things. `resolveCreativeShowcase` returns only files that exist.
 */
export function CreativeService() {
  const showcase = resolveCreativeShowcase();
  const { pricing } = creativeService;

  return (
    <section
      id="creative"
      aria-labelledby="creative-heading"
      className="scroll-mt-28 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <p className="eyebrow eyebrow-plain mb-6">{creativeService.eyebrow}</p>

        <h2
          id="creative-heading"
          className="display text-display-md max-w-[20ch] text-ink-1000"
        >
          <RevealWords text={creativeService.heading[0]} />
          {/* The second line takes the softer weight, the same two-tone
              headline the capabilities band uses — done with the ink scale
              rather than with a colour, because there is no colour. */}
          <span className="block text-ink-600">
            <RevealWords text={creativeService.heading[1]} />
          </span>
        </h2>

        <Reveal className="mt-8 max-w-[52ch]" variant="unblur">
          <p className="text-[0.9375rem] leading-relaxed text-ink-800">
            {creativeService.lede}
          </p>
        </Reveal>

        {/* ---- What is in, what is out ---- */}
        <div className="mt-14 grid gap-10 border-t border-ink-300 pt-10 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="settle">
            <p className="field-label text-ink-600">
              {creativeService.included.label}
            </p>
            <ul className="mt-6 space-y-3.5">
              {creativeService.included.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-800"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 block h-px w-3 shrink-0 bg-ink-500"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/*
            The exclusions are set at the same weight as the inclusions on
            purpose. The concept's own argument is that stating the limit is
            what sells the service — anyone who needs media buying self-selects
            out in one line. Demoting this list to small print would undo that.
          */}
          <Reveal variant="settle" delay={0.08}>
            <p className="field-label text-ink-600">
              {creativeService.excluded.label}
            </p>
            <ul className="mt-6 space-y-3.5">
              {creativeService.excluded.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-700"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 block h-px w-3 shrink-0 bg-ink-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-7 max-w-[46ch] text-[0.875rem] leading-relaxed text-ink-600">
              {creativeService.excluded.note}
            </p>
          </Reveal>
        </div>

        {/* ---- The showcase, when there is one ---- */}
        {showcase.length > 0 ? (
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-4">
            {showcase.map((src, i) => (
              <Reveal as="li" key={src} delay={i * 0.06} variant="settle">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-ink-100">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </ul>
        ) : null}

        {/* ---- How it runs ---- */}
        <ul className="mt-14 grid gap-0 border-t border-ink-300 pt-2 lg:mt-20 lg:grid-cols-4 lg:gap-10 lg:pt-10">
          {creativeService.steps.map((step) => (
            <li
              key={step.index}
              className="border-b border-ink-300 py-7 last:border-0 lg:border-0 lg:py-0"
            >
              {/* The same index device as the process steps and the service
                  rows: a hung mono label and a rule that runs to the edge.
                  `lg:contents` hands the label back to the four-column row. */}
              <div className="flex items-center gap-4 lg:contents">
                <p className="field-label shrink-0 text-ink-600">
                  Step {step.index}
                </p>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-ink-300 lg:hidden"
                />
              </div>
              <h3 className="display mt-3 text-xl text-ink-1000 lg:mt-5">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.875rem] leading-relaxed text-ink-700">
                {step.body}
              </p>
            </li>
          ))}
        </ul>

        {/* ---- Priced by the piece ----
            One line and a hand-off. The full rate card is /pricing#creative
            (client, 2026-09-14: inline it ran 3,757px on a phone), and the
            capability grid and exclusions in full are /services/creative. */}
          <div className="mt-14 border-t border-ink-300 pt-10 lg:mt-20 lg:pt-12">
            <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-800">
              {pricing.compactNote}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Cta href={creativeService.ctas.primary.href}>
                {creativeService.ctas.primary.label}
              </Cta>
              <Cta href={pricing.compactCta.href} variant="ghost">
                {pricing.compactCta.label}
              </Cta>
            </div>
          </div>
      </div>
    </section>
  );
}
