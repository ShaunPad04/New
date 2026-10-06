import type { CSSProperties } from "react";
import { LAUNCH, PUBLISHED_REVIEWS, REVIEWS, type Review } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import CountUp from "@/components/motion/CountUp";

/** Initials for the card's monogram (there are no customer photos): first letter of the first and last word. */
const initials = (name: string) => {
  const w = name.trim().split(/\s+/);
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};

const Card = ({ r }: { r: Review }) => (
  <figure className="tcard">
    {r.rating ? (
      <p className="stars" aria-label={`${r.rating} out of 5 stars`}>
        {"★".repeat(r.rating)}
      </p>
    ) : (
      <p className="tcard-tag">Recommends</p>
    )}
    <blockquote>{r.text}</blockquote>
    <figcaption>
      <span className="tcard-mono" aria-hidden="true">
        {initials(r.name)}
      </span>
      <span>
        {r.name}
        <span className="tcard-src">{r.platform}</span>
      </span>
    </figcaption>
  </figure>
);

/** One column drifting upward forever: the list twice, the track moved by half its height. */
const Column = ({ reviews, duration }: { reviews: Review[]; duration: number }) => (
  <div className="tcol">
    <div className="tcol-track" style={{ "--dur": `${duration}s` } as CSSProperties}>
      {[0, 1].map((copy) => (
        <div key={copy} className="tcol-set" aria-hidden={copy === 1 || undefined}>
          {reviews.map((r) => (
            <Card key={r.id} r={r} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/** The reviews dealt round-robin into n columns. */
const deal = (n: number) => Array.from({ length: n }, (_, c) => PUBLISHED_REVIEWS.filter((_, i) => i % n === c));
const DURATIONS = [46, 58, 52];

/**
 * Reviews as columns of cards drifting slowly upward, each at its own pace, faded top and
 * bottom (after "Testimonials Columns" by efferd on 21st.dev, rebuilt in CSS: no motion
 * runtime). One column on phones, two on tablets, three on desktop; each layout is its own
 * block so the CSS can swap them (.tcols-1/2/3). Paused on hover, in a hidden tab, and still
 * under reduced motion. Every quote is word for word from Google or Facebook.
 * Facebook's figure is recommend/not and Google's is five stars, so they are stated side by
 * side and never averaged.
 */
export default function Reviews() {
  const g = REVIEWS.google;
  const fb = REVIEWS.facebook;
  const writeUrl = g.writeReviewUrl || g.url;

  return (
    <section id="reviews" className="on-black section overflow-x-clip" aria-labelledby="reviews-title">
      <div className="wrap">
        <Reveal className="reviews-head">
          <div>
            <p className="eyebrow">Word on the street</p>
            <SplitHeading id="reviews-title" text={"Fifty-nine recommen|dations.\n*Not one against.*"} className="display-l mt-3" />
          </div>
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
        </Reveal>

        {[1, 2, 3].map((n) => (
          // only one layout is ever displayed; display:none takes the others out of the reading order too
          <div key={n} className={`tcols tcols-${n}`}>
            {deal(n).map((col, i) => (
              <Column key={i} reviews={col} duration={DURATIONS[i] * (n === 1 ? 2.2 : n === 2 ? 1.4 : 1)} />
            ))}
          </div>
        ))}

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
          {!g.writeReviewUrl && !LAUNCH && <span className="todo">TODO: add the Google “write a review” link</span>}
        </div>
        <p className="mt-4 text-xs text-wall">Every recommendation is quoted word for word from Google or Facebook.</p>
      </div>
    </section>
  );
}
