import { LAUNCH, PUBLISHED_REVIEWS, REVIEWS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import CountUp from "@/components/motion/CountUp";
import CardMarquee from "@/components/motion/CardMarquee";
import { ICONS } from "@/components/SocialLinks";
import type { Review } from "@/lib/reviews";

/**
 * Reviews as a sliding carousel (Shaun, 13 Oct 2026: "add the sliding carousel to the reviews
 * section", in place of the stacked stories of 7 Oct, which are in git history): the heading
 * beside the figures and the links to every review, then every published review on a card,
 * drifting across the screen the way the watch rail does (CardMarquee: it pauses under the
 * pointer and on focus, has a pause button, and under reduced motion stands still and scrolls
 * by hand). Google's 5.0 and Facebook's 100% of 59 are stated side by side, never averaged, and
 * every quote is word for word (content/reviews.json). "Fifty-nine" is spelled out in the
 * heading, so update it with the count.
 */
const g = REVIEWS.google;
const fb = REVIEWS.facebook;
const HEADING = "Fifty-nine recommen|dations.\n*Not one against.*";

function Source({ r }: { r: Review }) {
  return r.rating ? (
    <>
      <span className="stars" role="img" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>
        {"★".repeat(r.rating)}
      </span>{" "}
      <span aria-hidden="true">{r.platform}</span>
    </>
  ) : (
    <>Recommends on {r.platform}</>
  );
}

export default function Reviews() {
  const writeUrl = g.writeReviewUrl || g.url;
  return (
    <section className="on-black section overflow-x-clip" aria-labelledby="reviews-title">
      <div className="wrap">
        <Reveal className="reviews-head">
          <div className="rv-title">
            <p className="eyebrow">Word on the street</p>
            <SplitHeading id="reviews-title" text={HEADING} className="display-l mt-3" />
          </div>
          {/* the figures and the links to every review in one block, standing on the heading's
              baseline (Shaun, 13 Oct 2026: "in full screen the wording doesn't line up"): three
              equal columns, then Facebook and Google as their marks, not words, and the button to
              leave a review */}
          <div className="rv-side">
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
            <p className="rv-links">
              <a href={fb.url} target="_blank" rel="noopener noreferrer" className="rv-ic" aria-label="All fifty-nine reviews on Facebook" title="Reviews on Facebook">
                {ICONS.facebook}
              </a>
              <a href={g.url} target="_blank" rel="noopener noreferrer" className="rv-ic" aria-label="All reviews on Google" title="Reviews on Google">
                {ICONS.google}
              </a>
              {(g.writeReviewUrl || !LAUNCH) && (
                <a href={writeUrl} target="_blank" rel="noopener noreferrer" className="rv-pill">
                  Leave a review <span aria-hidden="true">↗</span>
                </a>
              )}
            </p>
          </div>
        </Reveal>

      </div>
      <div className="mt-10">
        <CardMarquee count={PUBLISHED_REVIEWS.length} label="Reviews" secondsPerCard={6}>
          {PUBLISHED_REVIEWS.map((r) => (
            <figure key={r.id} className="rvx-card rv-slide">
              <p className="rvx-src">
                <Source r={r} />
              </p>
              <blockquote className="rvx-q">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="rvx-who">
                {r.name}
                {r.date && <span> · {r.date}</span>}
              </figcaption>
            </figure>
          ))}
        </CardMarquee>
      </div>
      <div className="wrap">
        <p className="rv-note">Quoted word for word from Google and Facebook.</p>
      </div>
    </section>
  );
}
