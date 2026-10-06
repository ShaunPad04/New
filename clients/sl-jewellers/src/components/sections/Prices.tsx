import Link from "next/link";
import { BUSINESS, LAUNCH } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import MagneticButton from "@/components/motion/MagneticButton";
import MetalPrices from "@/components/MetalPrices";
import { getMetalPrices } from "@/lib/metal-prices";

/**
 * Gold and silver prices, the body of /gold-prices (6 Oct 2026: off the homepage, which
 * keeps a one-line PricesStrip linking here). With METALS_API_KEY set the table fills
 * from the live London spot (see /api/metal-prices); without it the same table shows
 * the grades and "ask", never a made-up number.
 */
export default async function Prices() {
  const prices = await getMetalPrices();
  const feedOn = !!process.env.METALS_API_KEY;
  const b = BUSINESS;
  return (
    <section id="prices" className="on-black section" aria-labelledby="prices-title">
      <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">What your gold is worth</p>
          <SplitHeading as="h1" load id="prices-title" text={"Today's *gold*\nand ~silver.~"} className="display-l mt-3" />
          <p className="mt-5 max-w-[42ch] text-paper/80">
            Scrap gets priced on purity and weight, simple as. We pay {b.buying.goldScrapPercent}% of the live London spot price for scrap gold and {b.buying.silverPercent}% for silver, weighed on the scale at the counter. Wearable and desirable pieces are worth more than their metal, so enquire for a price on those.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <MagneticButton>
              <Link href="/enquiry?type=selling-gold" className="btn btn-metal">
                Get a price for your gold
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a href={`tel:${BUSINESS.phone.e164}`} className="btn btn-metal">
                Call {BUSINESS.phone.display}
              </a>
            </MagneticButton>
          </div>
          {!feedOn && !LAUNCH && (
            <p className="mt-6">
              <span className="todo">TODO: set METALS_API_KEY (goldapi.io) to switch the live feed on</span>
            </p>
          )}
        </Reveal>
        <Reveal>
          <MetalPrices data={prices} payout={{ gold: b.buying.goldScrapPercent, silver: b.buying.silverPercent }} />
        </Reveal>
      </div>
    </section>
  );
}
