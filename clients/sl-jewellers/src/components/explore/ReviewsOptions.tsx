import { LAUNCH, PUBLISHED_REVIEWS, REVIEWS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import CountUp from "@/components/motion/CountUp";
import ReviewsIndex from "./ReviewsIndex";
import ReviewsTags from "./ReviewsTags";
import ReviewsStack, { type Story } from "./ReviewsStack";

/**
 * Reviews, round 6 of the walk-through (7 Oct 2026). Shaun: the last three were "so
 * generic", so these start again: A an editorial index, B a pile of swing tags, C photo
 * stories that stack on scroll. Each keeps the same facts: Google's 5.0 from 15 reviews and
 * Facebook's 100% of 59 are stated side by side, never averaged, and every quote is word for
 * word (content/reviews.json).
 */
const g = REVIEWS.google;
const fb = REVIEWS.facebook;
const HEADING = "Fifty-nine recommen|dations.\n*Not one against.*";

function Links({ className = "" }: { className?: string }) {
  const writeUrl = g.writeReviewUrl || g.url;
  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-1 ${className}`}>
      <a href={fb.url} target="_blank" rel="noopener" className="link-arrow">
        All fifty-nine on Facebook <span aria-hidden="true">→</span>
      </a>
      <a href={g.url} target="_blank" rel="noopener" className="link-arrow">
        All reviews on Google <span aria-hidden="true">→</span>
      </a>
      {(g.writeReviewUrl || !LAUNCH) && (
        <a href={writeUrl} target="_blank" rel="noopener" className="link-arrow">
          Leave us a review <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}

const NOTE = "Every recommendation is quoted word for word from Google or Facebook.";

/** A: the index. One review large, everyone who wrote listed beside it; the figures as a ruled ledger underneath. */
export function ReviewsA() {
  return (
    <section className="on-black section overflow-x-clip" aria-labelledby="reviews-title-a">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Word on the street</p>
          <SplitHeading id="reviews-title-a" text={HEADING} className="display-l mt-3" />
        </Reveal>
        <ReviewsIndex reviews={PUBLISHED_REVIEWS} />
        <dl className="ri-ledger">
          <div>
            <dt>Google</dt>
            <dd>
              <span className="ri-big tnum"><CountUp value={g.rating} decimals={1} /></span>
              <span className="ri-small"><span className="stars" aria-hidden="true">★★★★★</span> from {g.reviewCount} reviews</span>
            </dd>
          </div>
          <div>
            <dt>Facebook</dt>
            <dd>
              <span className="ri-big tnum"><CountUp value={fb.recommendPercent} suffix="%" /></span>
              <span className="ri-small">recommend, from {fb.reviewCount} reviews</span>
            </dd>
          </div>
        </dl>
        <Links className="mt-8" />
        <p className="mt-4 text-xs text-wall">{NOTE}</p>
      </div>
    </section>
  );
}

/** B: swing tags. The heading and the two figures on the left, the pile of tags on the right. */
export function ReviewsB() {
  return (
    <section className="on-black section overflow-x-clip" aria-labelledby="reviews-title-b">
      <div className="wrap rt-grid">
        <Reveal className="rt-copy">
          <p className="eyebrow">Word on the street</p>
          <SplitHeading id="reviews-title-b" text={HEADING} className="display-l mt-3" />
          <dl className="rt-figs">
            <div>
              <dt>On Google, from {g.reviewCount} reviews</dt>
              <dd className="tnum"><CountUp value={g.rating} decimals={1} /><span className="stars" aria-hidden="true">★★★★★</span></dd>
            </div>
            <div>
              <dt>Recommend on Facebook, from {fb.reviewCount}</dt>
              <dd className="tnum"><CountUp value={fb.recommendPercent} suffix="%" /></dd>
            </div>
          </dl>
          <Links className="rt-links" />
          <p className="mt-4 text-xs text-wall">{NOTE}</p>
        </Reveal>
        <ReviewsTags reviews={PUBLISHED_REVIEWS} />
      </div>
    </section>
  );
}

/** Five reviews, each paired with a photo of what it is about, from S&L's own case and counter. */
const STORY_PICKS: { id: string; image: string; caption: string }[] = [
  { id: "g12", image: "/images/services/repairs.2026-10-06-2.webp", caption: "Repairs, at the counter" },
  { id: "f1", image: "/images/pieces/bracelets/17-487fa377.jpg", caption: "Bracelets, from the case" },
  { id: "g2", image: "/images/pieces/watches/16-485dc162.jpg", caption: "Watches, from the case" },
  { id: "g9", image: "/images/services/exchange.2026-10-06-3.webp", caption: "Buying and selling" },
  { id: "g1", image: "/images/shop-interior.2026-10-06.webp", caption: "49 Cambridge Street" },
];
const STORIES: Story[] = STORY_PICKS.flatMap((s) => {
  const review = PUBLISHED_REVIEWS.find((r) => r.id === s.id);
  return review ? [{ review, image: s.image, caption: s.caption }] : [];
});

/** C: stacked stories. The figures by the heading, then the cards that pin and stack on scroll. */
export function ReviewsC() {
  return (
    <section className="on-black section" aria-labelledby="reviews-title-c">
      <div className="wrap">
        <Reveal className="reviews-head">
          <div>
            <p className="eyebrow">Word on the street</p>
            <SplitHeading id="reviews-title-c" text={HEADING} className="display-l mt-3" />
          </div>
          <dl className="recs-figures">
            <div>
              <dt>Recommend on Facebook</dt>
              <dd><CountUp value={fb.recommendPercent} suffix="%" /></dd>
            </div>
            <div>
              <dt>Reviews on Facebook</dt>
              <dd><CountUp value={fb.reviewCount} /></dd>
            </div>
            <div>
              <dt>On Google</dt>
              <dd><CountUp value={g.rating} decimals={1} /></dd>
            </div>
          </dl>
        </Reveal>
        <ReviewsStack stories={STORIES} />
        <Links className="mt-12" />
        <p className="mt-4 text-xs text-wall">{NOTE} The photographs show S&amp;L&apos;s own stock and counter, not the reviewers&apos; pieces.</p>
      </div>
    </section>
  );
}
