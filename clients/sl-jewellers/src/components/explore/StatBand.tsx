import { COLLECTIONS, REVIEWS } from "@/lib/content";
import CountUp from "@/components/motion/CountUp";

/**
 * Marquee B, "Stat band" (round 2): four figures in a hairline band under the hero, each
 * counting up as it arrives (after the Spector stat band; 21st "Number Ticker"). Every
 * figure is a real one: the pieces listed in the case, Google's rating, Facebook's
 * recommendation share, and the enquiries line from the shop's questionnaire.
 */
export default function StatBand() {
  const pieces = COLLECTIONS.reduce((n, c) => n + (c.pieces?.length ?? 0), 0);
  const g = REVIEWS.google;
  const fb = REVIEWS.facebook;
  return (
    <section className="stat-band on-black" aria-label="S&L in figures">
      <dl className="wrap stat-band-in">
        <div>
          <dt>Pieces in the case</dt>
          <dd>
            <CountUp value={pieces} />
          </dd>
        </div>
        <div>
          <dt>On Google, {g.reviewCount} reviews</dt>
          <dd>
            <CountUp value={g.rating} decimals={1} />
          </dd>
        </div>
        <div>
          <dt>Recommend on Facebook</dt>
          <dd>
            <CountUp value={fb.recommendPercent} suffix="%" />
          </dd>
        </div>
        <div>
          <dt>Enquiries answered</dt>
          <dd>24/7</dd>
        </div>
      </dl>
    </section>
  );
}
