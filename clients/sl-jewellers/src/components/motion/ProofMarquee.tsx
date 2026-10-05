import { REVIEWS } from "@/lib/content";
import Marquee from "./Marquee";

/** Only facts the sources state. */
export default function ProofMarquee() {
  const items = [
    "We buy gold, precious metals and watches",
    "Part-exchange welcome",
    "Next-day delivery available",
    `${REVIEWS.google.rating.toFixed(1)} on Google from ${REVIEWS.google.reviewCount} reviews`,
    `${REVIEWS.facebook.recommendPercent}% recommend on Facebook`,
    "Weighed and priced in front of you",
    "No middle men, no waffle",
  ];
  return (
    <div className="on-black proof-strip">
      <Marquee duration={70} gap={48} label="What the shop offers">
        {items.map((t) => (
          <span key={t} className="item">
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
