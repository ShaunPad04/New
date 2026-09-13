/**
 * MAISON DE MUSE — VERIFIED BUSINESS FACTS
 *
 * Every value in this file was checked against a primary source on
 * 2026-09-09 before implementation. The source for each block is recorded
 * beside it so the next person can re-verify rather than trust.
 *
 * Nothing here is invented. If a fact could not be verified it is not in
 * this file — it is listed under "Client input required" in the handoff.
 */

/** Official website, verified live on 2026-09-09. */
export const site = {
  name: "Maison de Muse",
  legalName: "Maison de Muse",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://maisondemuse.co.uk",
  tagline: "Coffee, food and effortless elegance.",
  // Meta description — ours, written from verified facts only.
  description:
    "Maison de Muse is a speciality coffee shop, brunch café and wine bar on Sea View Street, Cleethorpes. Coffee and matcha from 7am, croissants, bagels and brunch until 5pm, and an evening menu with wine on Friday and Saturday.",
  locale: "en_GB",
  // Official site footer + contact block, and the FSA register.
  address: {
    street: "49 Sea View Street",
    town: "Cleethorpes",
    county: "North East Lincolnshire",
    postcode: "DN35 8EU",
    country: "GB",
  },
  phone: "01472 472140",
  phoneHref: "tel:+441472472140",
  email: "info@maisondemuse.co.uk",
  // Official social accounts, linked from the client brief.
  instagram: "https://www.instagram.com/maison.demuse/",
  instagramHandle: "@maison.demuse",
  facebook: "https://www.facebook.com/p/Maison-de-Muse-61573710291824/",
  // A search deep-link is the only Google Maps URL that can be verified
  // without a Place ID, which the client has not supplied.
  googleMaps:
    "https://www.google.com/maps/search/?api=1&query=Maison+de+Muse+49+Sea+View+Street+Cleethorpes+DN35+8EU",
  directions:
    "https://www.google.com/maps/dir/?api=1&destination=Maison+de+Muse+49+Sea+View+Street+Cleethorpes+DN35+8EU",
  /**
   * Coordinates from the Food Standards Agency register entry for this
   * business (FHRS ID 1785044), read from the FSA API on 2026-09-09.
   */
  geo: { latitude: 53.55709, longitude: -0.0264903 },
  /**
   * Food hygiene rating — FSA API, establishment 1785044, read 2026-09-09.
   * Rating 5, inspection dated 2026-06-04, North East Lincolnshire.
   */
  hygiene: {
    rating: 5,
    ratingDate: "2026-06-04",
    fhrsId: 1785044,
    url: "https://ratings.food.gov.uk/business/1785044/maison-de-muse",
  },
} as const;

/**
 * Opening hours — official website footer, verified 2026-09-09:
 *   Mon–Thur 7am to 6pm · Fri & Sat 7am to 11pm · Sunday 7am to 6pm
 * These match the baseline supplied in the brief.
 */
export type OpeningRow = {
  label: string;
  days: ReadonlyArray<
    "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
  >;
  opens: string; // 24h, for schema
  closes: string;
  display: string;
};

export const openingHours: readonly OpeningRow[] = [
  {
    label: "Monday – Thursday",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    opens: "07:00",
    closes: "18:00",
    display: "7:00am – 6:00pm",
  },
  {
    label: "Friday – Saturday",
    days: ["Friday", "Saturday"],
    opens: "07:00",
    closes: "23:00",
    display: "7:00am – 11:00pm",
  },
  {
    label: "Sunday",
    days: ["Sunday"],
    opens: "07:00",
    closes: "18:00",
    display: "7:00am – 6:00pm",
  },
] as const;

/**
 * Service windows — from the supplied menu pages (client brief). The
 * official website does not publish these, so they are marked for the
 * client to confirm in the handoff, but they are shown because the menu
 * itself states them.
 */
export const serviceHours = {
  food: { display: "8:00am – 5:00pm", note: "Food is served daily" },
  evening: {
    display: "From 4:00pm, Friday and Saturday",
    note: "Evening menu and wine list",
  },
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Our Story", href: "/our-story" },
  { label: "Menu", href: "/menu" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Visit", href: "/visit" },
] as const;

export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export function formatAddress(separator = ", ") {
  const a = site.address;
  return [a.street, a.town, a.postcode].join(separator);
}
