import reviews from "@content/reviews.json";

/* The reviews (content/reviews.json), on their own for the same reason as lib/business.ts. */

export type Review = {
  id: string;
  name: string;
  rating: number | null;
  date: string | null;
  platform: "Google" | "Facebook";
  text: string;
  verified: boolean;
  /** false keeps a real, verified review off the wall without editing its words. */
  publish?: boolean;
};
export const REVIEWS = reviews as unknown as {
  google: { rating: number; reviewCount: number; url: string; writeReviewUrl: string; reviews: Review[] };
  facebook: { recommendPercent: number; reviewCount: number; url: string; reviews: Review[] };
};
/** Only reviews verified against their source are rendered, and a review may be held
 *  back with publish:false. Quotes are never edited: the rule is exact or not at all. */
export const PUBLISHED_REVIEWS: Review[] = [
  ...REVIEWS.google.reviews.filter((r) => r.verified && r.publish !== false),
  ...REVIEWS.facebook.reviews.filter((r) => r.verified && r.publish !== false),
];
