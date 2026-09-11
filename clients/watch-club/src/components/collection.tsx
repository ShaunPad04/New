import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { WatchPlate } from "@/components/watch-plate";
import {
  featuredWatches,
  notices,
  SHOW_INVENTORY_NOTICE,
} from "@/lib/content";

/**
 * Featured stock.
 *
 * Card metadata follows the order a dealer actually lists a watch in:
 * brand, model, reference, year, case size, price. The specs are a <dl>
 * rather than styled divs because they are genuinely definition pairs, and
 * that is what a screen reader needs to pair them correctly.
 *
 * The notice above the grid is not decoration. Everything here is invented
 * demo data and the page has to say so — see INVENTORY_VERIFIED in
 * content.ts and the gate in scripts/verify.mjs.
 */
export function Collection() {
  return (
    <section id="collection" className="scroll-mt-24 bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="rule-accent mb-8 w-24" />
          <p className="eyebrow mb-5">The collection</p>
          <h2 className="display-lg max-w-3xl text-bone">
            Currently in the Royal Arcade.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-bone-muted">
            Every watch is offered in original, unrestored condition and carries
            a two-year warranty covering both function and originality.
          </p>
        </Reveal>

        {SHOW_INVENTORY_NOTICE ? (
          <p
            role="note"
            className="mt-10 rounded-lg border border-dashed border-champagne-dim px-5 py-4 text-sm text-bone-dim"
          >
            {notices.inventory}
          </p>
        ) : null}

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredWatches.map((watch, i) => (
            <li key={watch.id}>
              <Reveal delay={(i % 3) * 0.08}>
                <article className="bezel h-full">
                  <div className="bezel-core flex h-full flex-col">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-obsidian-raised">
                      {watch.image ? (
                        <Image
                          src={watch.image}
                          alt={`${watch.brand} ${watch.model}, reference ${watch.reference}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.04]"
                        />
                      ) : (
                        <WatchPlate
                          brand={watch.brand}
                          reference={watch.reference}
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="eyebrow">{watch.brand}</p>
                      <h3 className="display-sm mt-3 text-bone">
                        {watch.model}
                      </h3>

                      <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-obsidian-line pt-5">
                        <div>
                          <dt className="spec-label">Ref.</dt>
                          <dd className="spec-value mt-1.5">
                            {watch.reference}
                          </dd>
                        </div>
                        <div>
                          <dt className="spec-label">Year</dt>
                          <dd className="spec-value mt-1.5">{watch.year}</dd>
                        </div>
                        <div>
                          <dt className="spec-label">Case</dt>
                          <dd className="spec-value mt-1.5">
                            {watch.caseSize}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-5 flex-1 text-sm leading-relaxed text-bone-muted">
                        {watch.note}
                      </p>

                      <p className="mt-6 border-t border-obsidian-line pt-5 font-mono text-lg text-bone">
                        {watch.price}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
