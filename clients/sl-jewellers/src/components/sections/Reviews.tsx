import { LAUNCH, PUBLISHED_REVIEWS, REVIEWS } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import CountUp from "@/components/motion/CountUp";
import ReviewsStack, { type Story } from "@/components/ReviewsStack";

/**
 * Reviews as stacked stories (Shaun's pick, round 6 of the walk-through, 7 Oct 2026, over an
 * editorial index and a pile of swing tags): the heading beside the figures and the links to
 * every review, then five reviews on cards that pin and stack as the page scrolls (on a phone,
 * a row of the same cards to swipe across). Google's 5.0 and Facebook's 100%
 * of 59 are stated side by side, never averaged, and every quote is word for word
 * (content/reviews.json). "Fifty-nine" is spelled out in the heading, so update it with
 * the count.
 */
const g = REVIEWS.google;
const fb = REVIEWS.facebook;
const HEADING = "Fifty-nine recommen|dations.\n*Not one against.*";

/**
 * Five reviews, each paired with a picture of what it is about. The pictures were made for
 * this section from S&L's own stock photos (assets/SOURCES.md), so none repeats a photo used
 * elsewhere on the site; none shows the reviewer's own piece, and the note below says so.
 */
const STORY_PICKS: { id: string; image: string; caption: string }[] = [
  { id: "g12", image: "/images/reviews/weighed.2026-10-07.webp", caption: "Gold, weighed on the counter" },
  { id: "f1", image: "/images/reviews/gift.2026-10-07.webp", caption: "A bracelet, boxed as a gift" },
  { id: "g2", image: "/images/reviews/case.2026-10-07.webp", caption: "Watches in the case" },
  { id: "g9", image: "/images/reviews/selling.2026-10-07.webp", caption: "Selling over the counter" },
  { id: "g1", image: "/images/reviews/counter.2026-10-07.webp", caption: "On the counter" },
];
const STORIES: Story[] = STORY_PICKS.flatMap((s) => {
  const review = PUBLISHED_REVIEWS.find((r) => r.id === s.id);
  return review ? [{ review, image: s.image, caption: s.caption }] : [];
});

export default function Reviews() {
  const writeUrl = g.writeReviewUrl || g.url;
  return (
    <section className="on-black section" aria-labelledby="reviews-title">
      <div className="wrap">
        <Reveal className="reviews-head">
          <div className="rv-title">
            <p className="eyebrow">Word on the street</p>
            <SplitHeading id="reviews-title" text={HEADING} className="display-l mt-3" />
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
          {/* the links to every review sit with the figures they back up (Shaun, 8 Oct 2026, of
              the three links that used to trail the cards: "maybe we move these") */}
          <p className="rv-links">
            <a href={fb.url} target="_blank" rel="noopener" aria-label="All fifty-nine reviews on Facebook">
              Facebook <span aria-hidden="true">↗</span>
            </a>
            <a href={g.url} target="_blank" rel="noopener" aria-label="All reviews on Google">
              Google <span aria-hidden="true">↗</span>
            </a>
            {(g.writeReviewUrl || !LAUNCH) && (
              <a href={writeUrl} target="_blank" rel="noopener">
                Leave a review <span aria-hidden="true">↗</span>
              </a>
            )}
          </p>
        </Reveal>

        <ReviewsStack stories={STORIES} />

        <p className="rv-note">
          Quoted word for word from Google and Facebook. The pictures are illustrations made from S&amp;L&apos;s own stock photos, not the
          reviewers&apos; pieces.
        </p>
      </div>
    </section>
  );
}
