/**
 * MAISON DE MUSE — CUSTOMER REVIEWS
 *
 * CONTENT INTEGRITY RULES
 *
 * Only real, publicly posted reviews appear here, and each entry links to
 * the page it was read from. Where the exact wording could not be
 * verified character-for-character, the entry is a PARAPHRASE — rendered
 * without quotation marks and labelled as a summary on the page — so that
 * nobody is ever attributed words they did not write.
 *
 * No reviewer names, star counts, or aggregate ratings are shown unless
 * they were verified. `GOOGLE_RATING_VERIFIED` stays false until the
 * client supplies the live Google rating and review count; while it is
 * false the site links to Google rather than printing a number.
 */

export type Review = {
  id: string;
  /** "quote" only when the wording was verified verbatim. */
  kind: "quote" | "paraphrase";
  text: string;
  /** Theme shown as a small label. */
  theme: string;
  /** Where it was read. */
  source: { label: string; url: string };
  /** Month it was published, if known. */
  when?: string;
};

export const GOOGLE_RATING_VERIFIED = false;
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Maison+de+Muse+49+Sea+View+Street+Cleethorpes+DN35+8EU";
export const TRIPADVISOR_URL =
  "https://www.tripadvisor.co.uk/Restaurant_Review-g503974-d33239291-Reviews-Maison_De_Muse-Cleethorpes_Lincolnshire_England.html";

/** Paraphrased from public Tripadvisor reviews, read 2026-09-09. */
export const reviews: Review[] = [
  {
    id: "r1",
    kind: "paraphrase",
    theme: "Welcoming service",
    text: "The service was described as absolutely wonderful — everyone friendly and welcoming — with food that was delicious, full of flavour and beautifully presented.",
    source: {
      label: "Tripadvisor review",
      url: "https://www.tripadvisor.co.uk/ShowUserReviews-g503974-d33239291-r1029120218-Maison_De_Muse-Cleethorpes_Lincolnshire_England.html",
    },
  },
  {
    id: "r2",
    kind: "paraphrase",
    theme: "Coffee & matcha",
    text: "One visitor called it the perfect coffee spot, praising a takeaway vanilla matcha and a member of staff who took care over a dairy sensitivity.",
    source: {
      label: "Tripadvisor review",
      url: "https://www.tripadvisor.co.uk/ShowUserReviews-g503974-d33239291-r1010896449-Maison_De_Muse-Cleethorpes_Lincolnshire_England.html",
    },
  },
  {
    id: "r3",
    kind: "paraphrase",
    theme: "Calm atmosphere",
    text: "Reviewers describe lovely staff, delicious food and drink, a calm atmosphere and very reasonable prices.",
    source: { label: "Tripadvisor reviews", url: TRIPADVISOR_URL },
  },
  {
    id: "r4",
    kind: "paraphrase",
    theme: "Interior",
    text: "The room is described as bright, stylish and comfortable, with friendly staff who make you feel welcome — and it is dog friendly.",
    source: { label: "Tripadvisor reviews", url: TRIPADVISOR_URL },
  },
  {
    id: "r5",
    kind: "paraphrase",
    theme: "Presentation",
    text: "Everything was of good quality and well presented, with a lovely ambience and extremely clean facilities.",
    source: { label: "Tripadvisor reviews", url: TRIPADVISOR_URL },
  },
];
