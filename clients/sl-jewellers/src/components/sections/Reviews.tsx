import { LAUNCH, PUBLISHED_REVIEWS, REVIEWS, type Review } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import Marquee from "@/components/motion/Marquee";
import CountUp from "@/components/motion/CountUp";
import MagneticButton from "@/components/motion/MagneticButton";

const Rec = ({ r }: { r: Review }) => (
  <figure className="rec">
    <blockquote>{r.text}</blockquote>
    <figcaption>
      {r.name} · {r.platform}
    </figcaption>
  </figure>
);

/**
 * The wall from the previous site: two slow rows of real recommendations,
 * volume as the proof. Facebook's figure is recommend/not and Google's is
 * five stars, so they are stated side by side and never averaged.
 */
export default function Reviews() {
  const g = REVIEWS.google;
  const fb = REVIEWS.facebook;
  const rowA = PUBLISHED_REVIEWS.filter((_, i) => i % 2 === 0);
  const rowB = PUBLISHED_REVIEWS.filter((_, i) => i % 2 === 1);
  const writeUrl = g.writeReviewUrl || g.url;

  return (
    <section id="reviews" className="on-graphite section overflow-x-clip" aria-labelledby="reviews-title">
      <div className="wrap">
        <Reveal className="flex flex-col gap-8">
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
      </div>

      <Reveal className="mt-12 space-y-4">
        <Marquee duration={56} direction="left" gap={16} label="Customer recommendations, row one">
          {rowA.map((r) => (
            <Rec key={r.id} r={r} />
          ))}
        </Marquee>
        <Marquee duration={64} direction="right" gap={16} label="Customer recommendations, row two">
          {rowB.map((r) => (
            <Rec key={r.id} r={r} />
          ))}
        </Marquee>
      </Reveal>

      <div className="wrap mt-10 flex flex-wrap items-center gap-3">
        <MagneticButton>
          <a href={fb.url} target="_blank" rel="noopener" className="btn btn-ghost">
            Read all fifty-nine on Facebook
          </a>
        </MagneticButton>
        <MagneticButton>
          <a href={g.url} target="_blank" rel="noopener" className="btn btn-ghost">
            Read all reviews on Google
          </a>
        </MagneticButton>
        {(g.writeReviewUrl || !LAUNCH) && (
          <MagneticButton>
            <a href={writeUrl} target="_blank" rel="noopener" className="btn btn-metal">
              Leave us a review
            </a>
          </MagneticButton>
        )}
        {!g.writeReviewUrl && !LAUNCH && <span className="todo">TODO: add the Google “write a review” link</span>}
      </div>
      <p className="wrap mt-4 text-xs text-wall">Every recommendation is quoted word for word from Google or Facebook.</p>
    </section>
  );
}
