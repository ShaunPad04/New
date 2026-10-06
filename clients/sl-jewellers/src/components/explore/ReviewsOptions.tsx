import type { ReactNode } from "react";
import { LAUNCH, PUBLISHED_REVIEWS, REVIEWS, type Review } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import CountUp from "@/components/motion/CountUp";
import ReviewsSpotlight from "./ReviewsSpotlight";
import ReviewsMarqueeRows from "./ReviewsMarqueeRows";

/** Shared by the three review options: the heading, the figures and the links out. */
function Frame({ id, children, figures = true }: { id: string; children: ReactNode; figures?: boolean }) {
  const g = REVIEWS.google;
  const fb = REVIEWS.facebook;
  const writeUrl = g.writeReviewUrl || g.url;
  return (
    <section className="on-black section overflow-x-clip" aria-labelledby={id}>
      <div className="wrap">
        <Reveal className="reviews-head">
          <div>
            <p className="eyebrow">Word on the street</p>
            <SplitHeading id={id} text={"Fifty-nine recommen|dations.\n*Not one against.*"} className="display-l mt-3" />
          </div>
          {figures && (
            <dl className="recs-figures">
              <div>
                <dt>Recommend</dt>
                <dd>
                  <CountUp value={fb.recommendPercent} suffix="%" />
                </dd>
              </div>
              <div>
                <dt>On Facebook</dt>
                <dd>
                  <CountUp value={fb.reviewCount} />
                </dd>
              </div>
              <div>
                <dt>On Google</dt>
                <dd>
                  <CountUp value={g.rating} decimals={1} />
                </dd>
              </div>
            </dl>
          )}
        </Reveal>
      </div>
      {children}
      <div className="wrap">
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
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
        <p className="mt-4 text-xs text-wall">Every recommendation is quoted word for word from Google or Facebook.</p>
      </div>
    </section>
  );
}

/** A: one review at a time, Framer-style spotlight. */
export function ReviewsA() {
  return (
    <Frame id="reviews-title-a">
      <div className="wrap mt-12">
        <ReviewsSpotlight reviews={PUBLISHED_REVIEWS} />
      </div>
    </Frame>
  );
}

/** B: an editorial wall, a summary card first, then every review in metallic-black cards. */
export function ReviewsB() {
  const g = REVIEWS.google;
  const fb = REVIEWS.facebook;
  const Card = ({ r }: { r: Review }) => (
    <figure className="rw-card">
      <svg className="rw-mark" viewBox="0 0 48 36" aria-hidden="true">
        <path d="M0 36V22C0 9 7 2 20 0l2 5c-7 2-10 6-10 12h9v19H0Zm26 0V22C26 9 33 2 46 0l2 5c-7 2-10 6-10 12h9v19H26Z" fill="currentColor" />
      </svg>
      <blockquote>{r.text}</blockquote>
      <figcaption>
        <span>{r.name}</span>
        <span className="rq-src">
          {r.rating ? <span className="stars" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>{"★".repeat(r.rating)}</span> : <span>Recommends on</span>}{" "}
          {r.rating ? <span aria-hidden="true">{r.platform}</span> : r.platform}
        </span>
      </figcaption>
    </figure>
  );
  return (
    <Frame id="reviews-title-b" figures={false}>
      <div className="wrap mt-12">
        <Reveal group className="rw">
          <div className="rw-card rw-sum">
            <p className="rw-big tnum">{g.rating.toFixed(1)}</p>
            <p className="stars" aria-hidden="true">★★★★★</p>
            <p className="rw-line">
              {g.reviewCount} reviews on Google
              <br />
              {fb.recommendPercent}% of {fb.reviewCount} recommend on Facebook
            </p>
          </div>
          {PUBLISHED_REVIEWS.map((r) => (
            <Card key={r.id} r={r} />
          ))}
        </Reveal>
      </div>
    </Frame>
  );
}

/** C: two rows of review cards drifting in opposite directions. */
export function ReviewsC() {
  return (
    <Frame id="reviews-title-c">
      <div className="mt-12">
        <ReviewsMarqueeRows reviews={PUBLISHED_REVIEWS} />
      </div>
    </Frame>
  );
}
