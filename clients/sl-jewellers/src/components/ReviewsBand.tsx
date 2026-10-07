"use client";

import { usePathname } from "next/navigation";
import { PUBLISHED_REVIEWS, REVIEWS, type Review } from "@/lib/content";

/**
 * S&L's reviews above the footer on every page but the home page, which keeps its stacked
 * stories (Shaun, 7 Oct 2026: "keep the home page testimonials as it is, but for the other
 * pages ... the carousel for the reviews"). "Rail", Shaun's pick A of three in round 8: the
 * cards drift past on a loop and stop under the pointer or focus; with reduced motion the row
 * holds still and scrolls by hand. Every quote is word for word from Google or Facebook
 * (content/reviews.json).
 */
const g = REVIEWS.google;
const fb = REVIEWS.facebook;
const HIDE = ["/", "/privacy"];

function Source({ r }: { r: Review }) {
  return r.rating ? (
    <>
      <span className="stars" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>
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
              <a href={g.url} target="_blank" rel="noopener">
                {g.rating.toFixed(1)} on Google
              </a>
              <span aria-hidden="true">·</span>
              <a href={fb.url} target="_blank" rel="noopener">
                {fb.recommendPercent}% recommend on Facebook ({fb.reviewCount})
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="rva-track" tabIndex={0} aria-label="Reviews, moving; hover or focus to stop">
        <div className="rva-belt">
          {/* the list twice, so the loop has no seam; the copy is hidden from screen readers */}
          {[...list, ...list].map((r, i) => (
            <figure key={`${r.id}-${i}`} className="rvx-card rva-card" aria-hidden={i >= list.length || undefined}>
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
