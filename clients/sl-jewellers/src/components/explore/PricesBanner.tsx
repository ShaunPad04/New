import Image from "next/image";
import Link from "next/link";
import { BUSINESS, COLLECTIONS } from "@/lib/content";

/**
 * Gold strip C, "Bullion banner" (round 3): a full-width band with one of S&L's own bullion
 * photos on the right and the offer on the left: the scrap gold and silver shares of spot,
 * weighed in front of you, with the way to today's prices and to a price.
 */
export default function PricesBanner() {
  const b = BUSINESS.buying;
  const bar = COLLECTIONS.find((c) => c.slug === "bullion")?.pieces?.[0];
  return (
    <section className="on-black gbanner" aria-labelledby="gbanner-title">
      {bar && (
        <div className="gbanner-media" aria-hidden="true">
          <Image src={bar.image} alt="" fill sizes="(min-width: 900px) 55vw, 100vw" className="gbanner-img" />
        </div>
      )}
      <div className="wrap gbanner-in">
        <p className="eyebrow">Selling gold?</p>
        <h2 id="gbanner-title" className="display-l mt-3">
          Bring it in.
          <br />
          <span className="text-gold">{b.goldScrapPercent}% of spot.</span>
        </h2>
        <p className="gbanner-copy">
          Scrap gold at {b.goldScrapPercent}% of the London spot price, silver at {b.silverPercent}%, weighed and priced in front of you. Wearable pieces are worth more.
        </p>
        <div className="gbanner-actions">
          <Link href="/enquiry?type=selling-gold" className="pill-metal">
            <span>Get a price</span>
            <span className="plan-disc" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="plan-arrow"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </Link>
          <Link href="/gold-prices" className="link-arrow">
            Today&rsquo;s prices <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
