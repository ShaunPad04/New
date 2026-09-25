import Image from "next/image";
import { creativeService, site } from "@/lib/content";
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
export function CreativeService({ compact = false }: { compact?: boolean }) {
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

        {/*
          ---- The eight disciplines ----

          FULL SECTION ONLY (`!compact`). The homepage gets the heading, the
          two lists and a single price line; the client moved the rate card
          off it on 2026-09-14 because the block ran 3,757px on a phone, and
          eight more cards would put it straight back. Shaun's instruction
          when this copy arrived was the same: not on the home page.

          The index device is the one the process steps and the service rows
          already use — a hung mono figure and a rule out to the edge — so
          this reads as the same publication rather than a new card style.
          Two columns from `sm`, four from `lg`; on a phone one column with
          the rule doing the separating, which is what stops eight stacked
          text blocks reading as a wall.
        */}
        {!compact ? (
          <ul className="mt-14 grid gap-x-10 gap-y-0 border-t border-ink-300 pt-2 sm:grid-cols-2 sm:gap-y-2 lg:mt-20 lg:grid-cols-4 lg:pt-10">
            {creativeService.capabilities.map((item, i) => (
              <Reveal
                as="li"
                key={item.index}
                delay={(i % 4) * 0.06}
                variant="settle"
                className="border-b border-ink-300 py-7 last:border-0 sm:py-8"
              >
                <div className="flex items-center gap-4">
                  <p className="field-label shrink-0 text-ink-600">
                    {item.index}
                  </p>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-ink-300"
                  />
                </div>
                <h3 className="mt-5 text-[1.0625rem] leading-snug text-ink-1000">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-700">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ul>
        ) : null}

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

            THE RATE CARD IS /pricing ONLY (client, 2026-09-14). Three groups
            of rows, the ownership panel and the footnote together ran 3,757px
            of unbroken text on a phone directly under four steps that are
            also text — the homepage lost the thread long before the reader
            reached a price. This is the same split the build tiers and the
            FAQ already use: the homepage makes the case and hands off, the
            route carries the detail. The copy is identical either way because
            both read the same `creativeService` export. */}
        {compact ? (
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
        ) : (
        <div className="mt-16 border-t border-ink-300 pt-12 lg:mt-24 lg:pt-16">
          <p className="eyebrow eyebrow-plain mb-6">{pricing.eyebrow}</p>
          <h3 className="display text-display-sm text-ink-1000">
            {pricing.heading}
          </h3>
          <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-700">
            {pricing.lede}
          </p>
          <p className="field-label mt-6 text-ink-600">
            {pricing.currencyNote}
          </p>

          {/*
            MONTHLY PLANS ABOVE THE PER-PIECE CARD (2026-09-24).

            Order is the argument. Someone who needs a feed kept running
            should meet a monthly figure before a per-item one — the rate
            card below is for the buyer who wants exactly one thing, and
            reading it first frames a retainer as an expensive way to buy
            singles rather than the cheaper way to buy volume.

            Three plates, the middle one carrying the recommendation, in the
            same double-bezel language as the build tiers so the two price
            bands on this site read as one system.
          */}
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricing.plans.map((plan, i) => (
              <Reveal as="li" key={plan.id} delay={i * 0.06} variant="settle">
                <div className={plan.featured ? "bezel h-full" : "h-full"}>
                  <div
                    className={
                      plan.featured
                        ? "bezel-core flex h-full flex-col p-7 lg:p-8"
                        : "flex h-full flex-col rounded-[1.4rem] bg-ink-1000/[0.05] p-7 lg:p-8"
                    }
                  >
                    <h3 className="display text-xl text-ink-1000">
                      {plan.name}
                    </h3>
                    <p className="field-label mt-2 text-ink-600">{plan.meta}</p>
                    <p className="mt-6 flex items-baseline gap-1.5">
                      <span className="display text-[2rem] leading-none text-ink-1000">
                        {site.currencySymbol}
                        {plan.price.toLocaleString("en-GB")}
                      </span>
                      <span className="text-[0.875rem] text-ink-600">
                        /month
                      </span>
                    </p>
                    <ul className="mt-6 space-y-3 border-t border-ink-300 pt-6">
                      {plan.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-ink-800"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 block h-px w-3 shrink-0 bg-ink-500"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          {/* The per-piece card, for the buyer who wants exactly one thing. */}
          <p className="field-label mt-14 text-ink-600">One-off creative</p>
          <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-3">
            {pricing.groups.map((group) => (
              <Reveal key={group.label} variant="settle">
                <p className="field-label text-ink-600">{group.label}</p>
                <ul className="mt-6">
                  {group.rows.map((row) => (
                    <li
                      key={row.name}
                      className="flex items-baseline justify-between gap-6 border-b border-ink-300 py-4 first:pt-0 last:border-0"
                    >
                      <span className="min-w-0">
                        <span className="block text-[0.9375rem] leading-snug text-ink-1000">
                          {row.name}
                        </span>
                        {"detail" in row && row.detail ? (
                          <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-600">
                            {row.detail}
                          </span>
                        ) : null}
                      </span>
                      {/* `normal-case!` for the same reason the results
                          figures carry it: `.display` is an UNLAYERED rule
                          declared after the Tailwind import, so its
                          `text-transform: uppercase` beats any utility
                          whatever the specificity, and "from £200" rendered
                          as "FROM £200". */}
                      <span className="display shrink-0 whitespace-nowrap text-lg normal-case! tabular-nums text-ink-1000">
                        {row.price}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 max-w-[38ch] text-[0.8125rem] leading-relaxed text-ink-600">
                  {group.note}
                </p>
              </Reveal>
            ))}
          </div>

          {/*
            THE OWNERSHIP PANEL IS A PROMISE, NOT A FEATURE, so it gets the
            card and the rest of the block does not. It is also the single
            most legally binding sentence on this site — a full copyright
            assignment — which is the third reason the section is gated while
            `LEGAL_REVIEWED` is false.
          */}
          {/* Turnaround sits ABOVE ownership, in the same plate treatment.
              Order is deliberate: "when do I get it" is the question a buyer
              asks before "do I own it", and the two together are the whole
              of what the rate card does not already say in figures. */}
          <div className="bezel mt-12">
            <div className="bezel-core p-7 lg:p-10">
              <p className="field-label text-ink-600">
                {pricing.turnaround.label}
              </p>
              <p className="mt-5 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-800">
                <strong className="font-medium text-ink-1000">
                  {pricing.turnaround.lead}
                </strong>{" "}
                {pricing.turnaround.body}
              </p>
            </div>
          </div>

          <div className="bezel mt-4">
            <div className="bezel-core p-7 lg:p-10">
              <p className="field-label text-ink-600">
                {pricing.ownership.label}
              </p>
              <p className="mt-5 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-800">
                <strong className="font-medium text-ink-1000">
                  {pricing.ownership.lead}
                </strong>{" "}
                {pricing.ownership.body}
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-[62ch] text-[0.8125rem] leading-relaxed text-ink-600">
            {pricing.footnote}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <Cta href={creativeService.ctas.primary.href}>
              {creativeService.ctas.primary.label}
            </Cta>
            <Cta href={creativeService.ctas.secondary.href} variant="ghost">
              {creativeService.ctas.secondary.label}
            </Cta>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
