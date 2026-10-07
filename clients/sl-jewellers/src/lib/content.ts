import business from "@content/business.json";
import collections from "@content/collections.json";
import referenceSpecs from "@content/reference-specs.json";
import services from "@content/services.json";
import instagram from "@content/instagram.json";
import reviews from "@content/reviews.json";
import faq from "@content/faq.json";
import reels from "@content/reels.json";
import offers from "@content/offers.json";

export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
/** A day is open with times, by appointment only, or closed. */
export type DayHours = { open: string; close: string } | { appointment: true } | null;
export const hasTimes = (h: DayHours): h is { open: string; close: string } => !!h && "open" in h;

export type Business = typeof business & { hours: { week: Record<DayKey, DayHours>; enquiriesNote?: string } };
export const BUSINESS = business as unknown as Business;

/** true = launch mode: anything not confirmed by S&L is hidden rather than badged. */
export const LAUNCH = process.env.HIDE_UNCONFIRMED === "true";

/* Declared rather than inferred from the JSON. Inference makes `todo` a property of
   only some members of the union, so the moment a TODO is cleared from an entry the
   remaining `c.todo` reads narrow to `unknown` and the build fails on a content edit. */
/** A piece S&L have added to a category page. Photo and words are theirs. */
export type Piece = {
  id: string; title: string; image: string; alt: string;
  width?: number; height?: number; note?: string;
  /** A GLB under public/models, shown turnable on the product page (Watch3D), built in Blender
   *  (scripts/3d). For a watch, the reference as made, modelled by us; for a bar, chain or
   *  bracelet, our model of the piece, its front from S&L's photo and its back the studio image.
   *  The photo stays the record of this particular piece. */
  model?: string;
  /** The maker's reference, only when S&L's own caption names it exactly; it pulls the
   *  reference's specification from content/reference-specs.json onto the product page. */
  reference?: string;
  /** The piece alone on a transparent background, for the product page's stage. */
  cutout?: string;
  /** The image is a studio picture made 7 Oct 2026, not a photograph; the page says so.
   *  true: made from the maker's own images of the exact reference. "own": a re-shoot made from
   *  S&L's own photo of this watch (for the watches whose exact reference isn't confirmed). */
  studio?: boolean | "own";
  /** The back of the piece, a card in the same framing as `image`: the product card fades to it
   *  on hover, as a shop's second picture does (Shaun, 7 Oct 2026: "same with all of the
   *  products ... when you hover it, it shows another image"). A studio
   *  image, never a photo of this piece's back: for a watch, what the reference looks like from
   *  behind, from the maker's and dealers' photographs; for a chain, bracelet or cast bar, made
   *  from S&L's own photo of the front. The page says so. Pieces whose backs carry a serial, a
   *  certificate or a hallmark we can't see have none (assets/SOURCES.md lists them). */
  back?: string;
};
export type Collection = {
  slug: string; title: string; blurb: string; image: string; alt: string;
  width: number; height: number; show: boolean; todo?: string; sources?: string[];
  /** Stock on this category's own page. Empty is fine: the page then invites an enquiry. */
  pieces?: Piece[];
  /** An illustration for the category's tile while nothing is listed (never a listed piece),
   *  and where in the picture to centre it when a tile crops it ("50% 60%"). */
  cover?: string;
  coverFocus?: string;
};
export const COLLECTIONS: Collection[] = (collections.items as Collection[]).filter((c) => c.show && !(LAUNCH && c.todo));
export const collectionBySlug = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

/** The maker's specification for a reference, as Rolex words it (content/reference-specs.json). */
export type ReferenceSpec = { maker: string; model: string; rows: [string, string][]; source: { name: string; url: string; read: string } };
export const referenceSpec = (ref?: string): ReferenceSpec | undefined =>
  ref ? (referenceSpecs.items as unknown as Record<string, ReferenceSpec>)[ref] : undefined;

export type Service = {
  slug: string; title: string; body: string; lead: string; points: string[];
  enquiryType: string; cta: string; confirmed: boolean; todo?: string; sources?: string[];
};
export const SERVICES: Service[] = (services.items as Service[]).filter((s) => s.confirmed || !LAUNCH);

export const INSTAGRAM = instagram;

export const REELS = reels.items;

export type FaqItem = { q: string; a: string; todo?: string };
/** A "What we do" band on the home page (content/offers.json). */
export type Offer = {
  slug: string; eyebrow: string; title: string; image: string; alt: string; width: number; height: number;
  paragraphs: string[]; faqs: { q: string; a: string }[];
  quote?: { text: string; name: string; platform: string; reviewId: string };
  cta: { label: string; href: string }; cta2?: { label: string; href: string };
};
export const OFFERS = offers.items as Offer[];
export const FAQ: FaqItem[] = (faq.items as FaqItem[]).filter((f) => !(LAUNCH && f.todo));

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

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sl-jewellers.vercel.app").replace(/\/$/, "");

export const ENQUIRY_TYPES = [
  { value: "buying", label: "Buying" },
  { value: "repair", label: "Repair" },
  { value: "resizing", label: "Resizing" },
  { value: "bespoke", label: "Sourcing a piece" },
  { value: "selling-gold", label: "Selling gold" },
  { value: "part-exchange", label: "Part-exchange" },
  { value: "other", label: "Other" },
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number]["value"];

/** WhatsApp is offered only once confirmed, or in preview. */
export const WHATSAPP_ON = BUSINESS.whatsapp.confirmed || !LAUNCH;
export const HOURS_ON = BUSINESS.hours.confirmed || !LAUNCH;

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${BUSINESS.whatsapp.number}?text=${encodeURIComponent(message ?? BUSINESS.whatsapp.message)}`;
