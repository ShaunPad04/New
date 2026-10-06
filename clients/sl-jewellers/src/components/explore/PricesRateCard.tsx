import Link from "next/link";
import { BUSINESS } from "@/lib/content";

/**
 * Gold strip B, "Rate card" (round 3): what the shop pays as two large figures, the share of
 * the London spot price for scrap gold and for silver (confirmed by the shop, 3 Oct 2026),
 * with the way to today's table and to a price. No guessed pounds: the live feed is off.
 */
export default function PricesRateCard() {
  const b = BUSINESS.buying;
  return (
    <section className="on-black rate" aria-labelledby="rate-title">
      <div className="wrap rate-in">
        <div>
          <p className="eyebrow">What we pay</p>
          <h2 id="rate-title" className="rate-title">
            Gold and silver, weighed <span className="text-gold">in front of you.</span>
          </h2>
          <p className="rate-note">Wearable or desirable pieces are worth more than scrap: ask for a price.</p>
        </div>
        <dl className="rate-figs">
          <div>
            <dd className="tnum">
              {b.goldScrapPercent}
              <span>%</span>
            </dd>
            <dt>of the London spot price for scrap gold</dt>
          </div>
          <div>
            <dd className="tnum">
              {b.silverPercent}
              <span>%</span>
            </dd>
            <dt>of spot for silver</dt>
          </div>
        </dl>
        <div className="rate-actions">
          <Link href="/gold-prices" className="pill-metal">
            <span>Today&rsquo;s prices</span>
            <span className="plan-disc" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="plan-arrow"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </Link>
          <Link href="/enquiry?type=selling-gold" className="link-arrow">
            Get a price <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
