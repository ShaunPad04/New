"use client";

import { usePathname } from "next/navigation";
import { PUBLISHED_REVIEWS, REVIEWS, type Review } from "@/lib/reviews";

/**
 * S&L's reviews above the footer on every page but the home page, which keeps its stacked
 * stories (Shaun, 7 Oct 2026: "keep the home page testimonials as it is, but for the other
 * pages ... the carousel for the reviews"). "Rail", Shaun's pick A of three in round 8. It used
 * to drift past on a loop, drawn twice for the seam, which read as the reviews repeating (Shaun,
 * 13 Oct 2026: "it repeats the google/facebook reviews twice, remove one"); now each review is
 * in the row once and the row scrolls by hand, with the arrow keys when focused. Every quote is
 * word for word from Google or Facebook (content/reviews.json).
 */
const g = REVIEWS.google;
const fb = REVIEWS.facebook;
// not on the home page (its own stacked stories), privacy, or gold prices (Shaun, 13 Oct 2026:
// "remove the review section located under the london spot price")
const HIDE = ["/", "/privacy", "/gold-prices"];

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

export default function ReviewsBand() {
  const path = usePathname();
  if (HIDE.includes(path)) return null;
  const list = PUBLISHED_REVIEWS;
  return (
    <section className="rvx" aria-labelledby="rvx-title">
      <div className="wrap">
        <div className="rvx-head">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 id="rvx-title" className="rvx-title">
              Fifty-nine recommendations. <span className="text-gold">Not one against.</span>
            </h2>
            <p className="rvx-figs tnum">
              <a href={g.url} target="_blank" rel="noopener noreferrer">
                {g.rating.toFixed(1)} on Google
              </a>
              <span aria-hidden="true">·</span>
              <a href={fb.url} target="_blank" rel="noopener noreferrer">
                {fb.recommendPercent}% recommend on Facebook ({fb.reviewCount})
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="rva-track" tabIndex={0} aria-label="Reviews; scroll sideways for more">
        <div className="rva-belt">
          {list.map((r) => (
            <figure key={r.id} className="rvx-card rva-card">
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
        </div>
      </div>
    </section>
  );
}
