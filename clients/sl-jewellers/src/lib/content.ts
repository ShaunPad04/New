import collections from "@content/collections.json";
import referenceSpecs from "@content/reference-specs.json";
import services from "@content/services.json";
import instagram from "@content/instagram.json";
import reels from "@content/reels.json";
import { LAUNCH } from "./business";

export * from "./business";
export * from "./reviews";
export * from "./faq";

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
  /** A watch's maker's reference, only when the exact model is confirmed (S&L's caption, or
   *  recorded as confirmed in assets/SOURCES.md); it pulls the reference's specification from
   *  content/reference-specs.json onto the product page and shows as a "Reference" row. */
  reference?: string;
  /** "photo": the reference is read off S&L's own photos of the watch (dial, bezel, bracelet, case
   *  size), not confirmed against its papers. Its specification still shows, so a buyer sees what
   *  the model is (Shaun, 8 Oct 2026: "for every watch piece, make sure it says the specific watch,
   *  the specific brand ... the case millimetres, the calibre, the power reserve"), with a note to
   *  ask the shop to confirm the reference. */
  referenceFrom?: "photo";
  /** For anything that is not a watch: the key of its product's specification in
   *  content/reference-specs.json (a bar, coin or collectible identified exactly). */
  spec?: string;
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
  /** Replaces `title` for the search title only, where the title cannot fit 60 characters
   *  with the shop's name after it (lib/seo.ts). */
  seoTitle?: string;
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
/** Whose wording a specification is (content/reference-specs.json, _about). */
export type SpecKind = "maker" | "retailer" | "dealer" | "press" | "law";
export type ReferenceSpec = { maker: string; model: string; kind?: SpecKind; rows: [string, string][]; source: { name: string; url: string; read: string } };
export const referenceSpec = (ref?: string): ReferenceSpec | undefined =>
  ref ? (referenceSpecs.items as unknown as Record<string, ReferenceSpec>)[ref] : undefined;
/** A watch's maker, from its reference's specification ("Rolex", "Cartier", "Swatch"). */
export const brandOf = (p: Piece): string | undefined => (p.reference ? referenceSpec(p.reference)?.maker : undefined);

export type Service = {
  slug: string; title: string; body: string; lead: string; points: string[];
  enquiryType: string; cta: string; confirmed: boolean; todo?: string; sources?: string[];
};
export const SERVICES: Service[] = (services.items as Service[]).filter((s) => s.confirmed || !LAUNCH);

export const INSTAGRAM = instagram;

export const REELS = reels.items;

