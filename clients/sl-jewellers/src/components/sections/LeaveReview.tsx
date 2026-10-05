import { BUSINESS, REVIEWS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * The last thing on the page: one button straight into Google's write-a-review
 * box for S&L's listing. The link is the verified place id from
 * content/reviews.json, so it opens the review form rather than a search page.
 */
export default function LeaveReview() {
  const g = REVIEWS.google;
  const fb = REVIEWS.facebook;
  return (
    <section id="leave-a-review" className="on-graphite section" aria-labelledby="leave-review-title">
      <div className="wrap">
        <div className="mx-auto max-w-[54ch] text-center">
        <Reveal>
          <p className="eyebrow">Been in?</p>
          <SplitHeading id="leave-review-title" text={"Tell them\n*how it went.*"} className="display-l mt-3" />
          <p className="mt-6 text-paper/80">
            {g.rating.toFixed(1)} on Google from {g.reviewCount} reviews, and {fb.recommendPercent}% recommend on
            Facebook. If S&amp;L sorted you out, a minute of your time helps the next person find them.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={g.writeReviewUrl} target="_blank" rel="noopener" className="btn btn-metal">
              Leave a Google review
            </a>
            <a href={BUSINESS.social.facebook.reviewsUrl} target="_blank" rel="noopener" className="btn btn-metal">
              Recommend on Facebook
            </a>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
