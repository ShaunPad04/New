import Image from "next/image";
import { creativeService } from "@/lib/content";
import { resolveCreativeShowcase } from "@/lib/work-image";
import { Cta } from "@/components/cta";
import { Reveal, RevealWords } from "@/components/reveal";
import { Brackets, Plus, StripeLabel } from "@/components/nocta-ui";

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

  /* STRUCTURE (Brad, 2026-09-26: "it needs to look more put together with
     structure and thought because it looks like it's just been thrown on").
     The same content, now in the site's framed grammar: label + heading on
     the left and the lede on the right; the in/out lists as ONE framed
     two-column panel (⊕ for what you get, × for what we do not do — the
     limit reads as a deliberate edge, not an afterthought); the four steps
     as a framed row of numbered cells; and the price line and actions as
     one closing bar. */
  const cellLabel = "text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600";
  return (
    <section
      id="creative"
      aria-labelledby="creative-heading"
      className="scroll-mt-28 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <StripeLabel>{creativeService.eyebrow}</StripeLabel>
            <h2
              id="creative-heading"
              className="display text-display-md mt-6 max-w-[20ch] text-ink-1000"
            >
              <RevealWords text={creativeService.heading[0]} />
              {/* The second line takes the softer weight — the ink scale,
                  because there is no colour. */}
              <span className="block text-ink-600">
                <RevealWords text={creativeService.heading[1]} />
              </span>
            </h2>
          </div>
          <Reveal className="max-w-[46ch] lg:pb-2" variant="unblur">
            <p className="text-[0.9375rem] leading-relaxed text-ink-800">
              {creativeService.lede}
            </p>
          </Reveal>
        </div>

        {/* ---- What is in, what is out: one framed panel ----
            The exclusions sit at the same weight as the inclusions on
            purpose: stating the limit is what sells the service. */}
        <Reveal variant="settle" className="relative mt-14 grid border border-ink-300 lg:mt-20 lg:grid-cols-2">
          <Brackets />
          <div className="p-6 sm:p-8 lg:p-10">
            <p className={cellLabel}>/{creativeService.included.label}</p>
            <ul className="mt-6 grid gap-3.5">
              {creativeService.included.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-900">
                  <Plus className="mt-[3px] text-ink-1000" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col border-t border-ink-300 bg-ink-50 lg:border-l lg:border-t-0">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className={cellLabel}>/{creativeService.excluded.label}</p>
              <ul className="mt-6 grid gap-3.5">
                {creativeService.excluded.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-800">
                    <span aria-hidden="true" className="mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center text-ink-600">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-auto border-t border-ink-300 p-6 text-[0.875rem] leading-relaxed text-ink-700 sm:px-8 lg:px-10">
              {creativeService.excluded.note}
            </p>
          </div>
        </Reveal>

        {/* ---- The showcase, when there is one ---- */}
        {showcase.length > 0 ? (
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-20 lg:grid-cols-4">
            {showcase.map((src, i) => (
              <Reveal as="li" key={src} delay={i * 0.06} variant="settle">
                <div className="relative aspect-[4/5] overflow-hidden border border-ink-300 bg-ink-100">
                  <Image src={src} alt="" fill sizes="(min-width: 1024px) 22vw, 45vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </ul>
        ) : null}

        {/* ---- How it runs: a framed row of numbered cells ---- */}
        <div className="mt-14 lg:mt-20">
          <p className={cellLabel}>/How it runs</p>
          <ol className="relative mt-5 grid border border-ink-300 sm:grid-cols-2 lg:grid-cols-4">
            <Brackets />
            {creativeService.steps.map((step, i) => (
              <li
                key={step.index}
                className={`flex flex-col p-6 sm:p-7 ${i ? "border-t border-ink-300" : ""} ${i === 1 ? "sm:border-l sm:border-t-0" : ""} ${i === 2 ? "sm:border-l-0 lg:border-l lg:border-t-0" : ""} ${i === 3 ? "sm:border-l lg:border-t-0" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.75rem] text-ink-600">/{step.index}/</span>
                  <span aria-hidden="true" className="h-px flex-1 bg-ink-300" />
                  <span aria-hidden="true" className="text-ink-600">{i < creativeService.steps.length - 1 ? "→" : "✓"}</span>
                </div>
                <h3 className="display mt-6 text-xl text-ink-1000">{step.title}</h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-ink-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- Priced by the piece: one closing bar ----
            The full rate card is /pricing#creative; the capability grid and
            exclusions in full are /services/creative. */}
        <div className="relative mt-14 flex flex-col gap-6 border border-ink-300 bg-ink-50 p-6 sm:p-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between">
          <Brackets />
          <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-900">
            {pricing.compactNote}
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Cta href={creativeService.ctas.primary.href}>{creativeService.ctas.primary.label}</Cta>
            <Cta href={pricing.compactCta.href} variant="ghost">{pricing.compactCta.label}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
