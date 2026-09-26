import Image from "next/image";
import { buildStandardsBand, faqs, founders, projectTiers } from "@/lib/content";
import { Brackets } from "@/components/nocta-ui";
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
  const essential = projectTiers[0];
  // "Live in 5 working days…" → 5. Read, never typed, so it follows the tier.
  const days = Number((essential.delivery ?? "").match(/\d+/)?.[0] ?? 5);

  /* Brad (2026-09-26): the text-only boxes looked "extremely generic". Each
     one now SHOWS its claim instead of only stating it — the founders by
     name, the delivery window as a track of working days, the method as a
     reviewed diff — and every card is the site's square, bracketed frame
     rather than the rounded card the rest of the site no longer uses. */
  const card = "relative overflow-hidden border border-ink-300";
  const label = "text-[0.75rem] font-semibold uppercase tracking-[0.04em]";

  return (
    <section aria-labelledby="principles-heading" className="bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-10 sm:px-8">
        <SectionRule index="04" label="Principles" />
      </div>
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-6 pb-24 pt-16 sm:px-8 lg:grid-cols-[14rem_1fr] lg:pb-32 lg:pt-24">
        <GutterWord>Principles</GutterWord>
        <div className="min-w-0">
          <h2 id="principles-heading" className="display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] text-ink-1000">
            <Dots />
            How we work
          </h2>

          <div className="mt-14 grid gap-3 md:grid-cols-6">
            {/* Measured — the big image card */}
            <Reveal variant="settle" className={`${card} min-h-[22rem] md:col-span-4`}>
              <Brackets />
              <Image src="/images/process/build.webp" alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover opacity-70 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-7 lg:p-9">
                <p className={`${label} text-white/80`}>/01 · {measured.label}</p>
                <p className="display mt-3 text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] text-white">{measured.heading}</p>
                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-white/80">{measured.body}</p>
              </div>
            </Reveal>

            {/* Founder-led — the two names, as monogram tiles */}
            <Reveal variant="settle" delay={0.06} className={`${card} flex flex-col bg-ink-50 p-7 md:col-span-2 lg:p-9`}>
              <Brackets />
              <p className={`${label} text-ink-600`}>/02 · Founder-led</p>
              <p className="mt-5 text-xl font-medium leading-tight tracking-[-0.03em] text-ink-1000">
                The two people who build it are the two people you talk to.
              </p>
              <ul className="mt-auto grid gap-2 pt-8">
                {founders.map((f) => (
                  <li key={f.name} className="flex items-center gap-4 border-t border-ink-300 pt-3">
                    <span aria-hidden="true" className="relative flex h-11 w-11 shrink-0 items-center justify-center border border-ink-400 font-mono text-[0.8125rem] font-semibold text-ink-1000">
                      <Brackets />
                      {f.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem] font-medium text-ink-1000">{f.name}</span>
                      <span className="block text-xs uppercase tracking-[0.04em] text-ink-600">{f.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Speed — the working days as a track */}
            <Reveal variant="settle" delay={0.1} className={`${card} flex flex-col bg-ink-50 p-7 md:col-span-2 lg:p-9`}>
              <Brackets />
              <p className={`${label} text-ink-600`}>/03 · Speed</p>
              <p className="mt-5 flex items-baseline gap-3">
                <span className="display text-[clamp(3.5rem,6vw,5rem)] leading-[0.85] text-ink-1000">{days}</span>
                <span className="text-sm font-medium uppercase tracking-[0.04em] text-ink-800">working days</span>
              </p>
              <ol aria-hidden="true" className="principles-days mt-8 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` }}>
                {Array.from({ length: days }, (_, i) => (
                  <li key={i} className="flex flex-col gap-2">
                    <span className="principles-day h-1.5 bg-ink-1000" style={{ transitionDelay: `${0.25 + i * 0.12}s` }} />
                    <span className="font-mono text-[0.6875rem] text-ink-600">
                      {i === 0 ? "Kickoff" : i === days - 1 ? "Live" : `D${i + 1}`}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-auto pt-8 text-sm leading-relaxed text-ink-800">
                {essential.delivery ? `${essential.delivery}. ` : ""}{essential.name} tier; larger builds take longer.
              </p>
            </Reveal>

            {/* Yours outright — image card */}
            <Reveal variant="settle" delay={0.14} className={`${card} min-h-[17rem] md:col-span-2`}>
              <Brackets />
              <Image src="/images/process/design.webp" alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover opacity-60 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
              <div className="relative flex h-full flex-col justify-end p-7">
                <p className={`${label} text-white`}>/04 · Yours outright</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{ownership}.</p>
              </div>
            </Reveal>

            {/* How we work — a reviewed diff */}
            <Reveal variant="settle" delay={0.18} className={`${card} flex flex-col bg-ink-50 p-7 md:col-span-2 lg:p-9`}>
              <Brackets />
              <p className={`${label} text-ink-600`}>/05 · {method.label}</p>
              <p className="mt-5 text-xl font-medium leading-tight tracking-[-0.03em] text-ink-1000">{method.heading}.</p>
              {/* Illustration, not a record of a real review — hence
                  aria-hidden; the claim is the sentence above and below. */}
              <div aria-hidden="true" className="mt-6 border border-ink-300 bg-ink-0 font-mono text-[0.6875rem] leading-6">
                {[
                  ["01", "hero.tsx"],
                  ["02", "pricing.tsx"],
                  ["03", "contact.tsx"],
                  ["04", "sitemap.ts"],
                ].map(([n, f]) => (
                  <div key={n} className="flex items-center gap-3 border-b border-ink-200 px-3 last:border-b-0">
                    <span className="text-ink-600">{n}</span>
                    <span className="text-ink-800">{f}</span>
                    <span className="ml-auto text-ink-1000">✓ reviewed</span>
                  </div>
                ))}
              </div>
              <p className="mt-auto pt-6 text-sm leading-relaxed text-ink-800">{method.body}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
