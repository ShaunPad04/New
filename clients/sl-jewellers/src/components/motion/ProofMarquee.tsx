import { REVIEWS } from "@/lib/content";
import VelocityMarquee from "./VelocityMarquee";

/** Only facts the sources state, as the scroll-velocity band under the hero (6 Oct 2026: the small-caps strip read cheap). */
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
  return <VelocityMarquee items={items} label="What the shop offers" />;
}
