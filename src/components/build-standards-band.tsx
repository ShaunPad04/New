import { buildStandardsBand } from "@/lib/content";
import { Reveal } from "@/components/reveal";

/**
 * HOW EVERY BUILD SHIPS.
 *
 * A full-width band between the tier cards and the money FAQs on /pricing —
 * the point at which someone has seen a figure and is deciding whether it is
 * justified. Standards and method answer that in one place rather than being
 * scattered up the page.
 *
 * Deliberately NOT built like the results strip on the homepage. Those are
 * number plates: measurements of that page, taken on a date, which a prospect
 * can reproduce by running PageSpeed against it. This is a forward promise
 * about work not yet done. Dressing a promise in the visual language of a
 * measurement invites it to be read as one, so the scores here sit as a
 * heading inside a card rather than as a row of plates.
 *
 * The small print is the same size as the payment terms elsewhere on this
 * page, sits directly under the claim it qualifies, and is never collapsed
 * behind a disclosure — a guarantee whose exclusions need a click is a
 * guarantee whose exclusions do not count.
 *
 * The copy, and the four claim rules it has to obey, live with the data in
 * `buildStandardsBand` (content.ts). Read that comment before editing any of
 * this text.
 */
export function BuildStandardsBand() {
  const { eyebrow, blocks } = buildStandardsBand;

  return (
    <section
      aria-labelledby="build-standards-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <h2 id="build-standards-heading" className="eyebrow">
          {eyebrow}
        </h2>

        {/*
          Two blocks, not three. `grid-cols-2` at `lg` rather than a count
          derived from the array: the security block was withheld (see
          content.ts) and a three-column grid holding two cards leaves a
          column of dead space that reads as a failed render. If the third
          block returns, this becomes `lg:grid-cols-3`.
        */}
        <ul className="mt-10 grid gap-6 lg:mt-14 lg:grid-cols-2">
          {blocks.map((block, i) => (
            <Reveal as="li" key={block.id} delay={i * 0.08} variant="settle">
              <div className="bezel h-full">
                <div className="bezel-core flex h-full flex-col p-8 lg:p-10">
                  <p className="field-label text-ink-600">{block.label}</p>

                  <h3 className="display mt-6 text-[1.75rem] leading-[1.05] tracking-tight text-ink-1000 lg:text-[2rem]">
                    {block.heading}
                  </h3>

                  <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-800">
                    {block.body}
                  </p>

                  {/* `mt-auto` so the qualifier sits at the foot of its card
                      and the two cards' bodies stay aligned regardless of
                      which one has small print. */}
                  {"note" in block && block.note ? (
                    <p className="mt-auto pt-7 text-[0.8125rem] leading-relaxed text-ink-600">
                      {block.note}
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
