import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import { getMetalPrices } from "@/lib/metal-prices";

const gbp = (n: number) => "£" + n.toFixed(2);

/**
 * The homepage's line on gold: what the shop pays, today's figure for the two carats
 * people bring in most when the live feed is on, and the way to the full table on
 * /gold-prices. Never a guessed number: without the feed it states the percentages only.
 */
export default async function PricesStrip() {
  const { metals } = await getMetalPrices();
  const pct = BUSINESS.buying.goldScrapPercent;
  const pay = (label: string) => {
    const g = metals?.gold?.grades.find((x) => x.label === label);
    return g ? gbp((g.perGram * pct) / 100) : null;
  };
  const nine = pay("9ct");
  const twentyTwo = pay("22ct");

  return (
    <section className="on-black prices-strip" aria-labelledby="prices-strip-title">
      <div className="wrap prices-strip-row">
        <h2 id="prices-strip-title" className="label">
          Gold &amp; silver
        </h2>
        <p className="prices-strip-copy">
          {nine && twentyTwo ? (
            <>
              Today we pay <span className="tnum text-gold">{nine}</span>/g for 9ct and <span className="tnum text-gold">{twentyTwo}</span>/g for 22ct.
            </>
          ) : (
            <>
              We pay <span className="text-gold">{pct}%</span> of the London spot price for scrap gold and <span className="text-gold">{BUSINESS.buying.silverPercent}%</span> for silver, weighed in front of you.
            </>
          )}
        </p>
        <Link href="/gold-prices" className="link-arrow">
          Today&rsquo;s prices <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
