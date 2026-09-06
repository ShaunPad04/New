/**
 * WATCH CLUB — ALL SITE COPY
 *
 * This is a speculative pitch build for The Watch Club, 4 & 5 Royal Arcade,
 * 28 Old Bond Street, London. It is NOT their site and is NOT live.
 *
 * Rules that hold everywhere in this file:
 *
 *   1. Anything asserting a fact about the business is listed under
 *      `business` below and was verified from public sources. Nothing else
 *      may claim to be a fact about them.
 *   2. Inventory is invented. It sits behind INVENTORY_VERIFIED, which is
 *      false, and `scripts/verify.mjs` hard-fails any build that declares
 *      itself indexable while it stays false. Publishing invented stock and
 *      prices under a real dealer's name is a CPUTR 2008 / DMCCA 2024
 *      problem, not a styling choice.
 *   3. Testimonials are real, public Trustpilot reviews, attributed as such,
 *      first name and initial only. No rating or review count is asserted
 *      anywhere — including in structured data — because we have not
 *      verified the totals ourselves.
 */

/* ------------------------------------------------------------------ flags */

/** Inventory is illustrative. Real stock replaces it before any public build. */
export const INVENTORY_VERIFIED = false;

/** Quotes are real and public, but not gathered by us with permission. */
export const TESTIMONIALS_VERIFIED = false;

/** Opt-in, production-only. Preview builds return Disallow: / from robots.ts. */
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

/** The sample banner shows whenever the stock on screen is not real. */
export const SHOW_INVENTORY_NOTICE = !INVENTORY_VERIFIED;

/* --------------------------------------------------------------- business */

/**
 * Verified facts. Sources: watchclub.com search listings, The Royal Arcade
 * directory, Mayfair London directory, Trustpilot business profile.
 */
export const business = {
  name: "The Watch Club",
  shortName: "Watch Club",
  founded: 1981,
  arcadeBuilt: 1879,
  onBondStreetSince: 1996,
  rebrandedYear: 2008,
  warrantyYears: 2,
  address: {
    street: "4 & 5 Royal Arcade, 28 Old Bond Street",
    locality: "London",
    region: "Greater London",
    postcode: "W1S 4SD",
    country: "GB",
  },
  phone: "020 7495 4882",
  phoneHref: "tel:+442074954882",
  email: "info@watchclub.com",
  hours: "Monday – Saturday, 10:00 – 17:30",
  hoursSchema: "Mo-Sa 10:00-17:30",
  appointment: "No appointment necessary.",
  nearestStation: "Green Park",
} as const;

export const site = {
  title: "The Watch Club — Vintage & Pre-Owned Wristwatches, Mayfair",
  description:
    "Vintage and pre-owned wristwatches from 1940 to the present, in original " +
    "unrestored condition. Old Bond Street since 1996. Two-year warranty on " +
    "every watch, free insured worldwide shipping.",
  url: "https://watchclub.example",
} as const;

/* -------------------------------------------------------------------- nav */

export const nav = [
  { label: "Collection", href: "#collection" },
  { label: "Vintage", href: "#patek" },
  { label: "Heritage", href: "#heritage" },
  { label: "Services", href: "#services" },
  { label: "Visit Us", href: "#visit" },
] as const;

/* ------------------------------------------------------------------- hero */

export const hero = {
  eyebrow: "Old Bond Street · Est. 1981",
  headline: ["Unpolished.", "Unrestored.", "Unrepeatable."],
  body:
    "Vintage and pre-owned wristwatches from 1940 to the present, kept exactly " +
    "as they were made. Two-year warranty on every watch, free insured " +
    "shipping worldwide.",
  cta: { label: "Explore the Collection", href: "#collection" },
} as const;

/* ----------------------------------------------------------------- brands */

/**
 * Brands stocked, verified from the business's own listings.
 *
 * `mark` points at a real brand SVG once Brad supplies the files. Until then
 * `mark` is null and the slider sets the name as a letter-spaced wordmark, so
 * swapping in the real marks is a one-line change per row and nothing else
 * in the component moves.
 */
export type Brand = { name: string; mark: string | null };

/**
 * Brands stocked.
 *
 * This is the client's supplied set — the nine marks he sent through. Rolex,
 * Patek Philippe and Audemars Piguet are also independently verified from the
 * business's own public listings; the rest are on his direction and are not
 * verified here, which is one more reason this build stays behind
 * SITE_INDEXABLE. (Omega, Cartier and Hublot are verified stock too and can be
 * added whenever he wants them in the marquee.)
 *
 * `mark` is the path to the real brand SVG in /public/images/brands. While it
 * is null the marquee sets the name as a letter-spaced wordmark instead, so
 * filling these in is the ONLY change needed when the files land — no
 * component reads anything but this field.
 */
export const brands: Brand[] = [
  { name: "Rolex", mark: null },
  { name: "Patek Philippe", mark: null },
  { name: "Audemars Piguet", mark: null },
  { name: "Richard Mille", mark: null },
  { name: "Jaeger-LeCoultre", mark: null },
  { name: "Breguet", mark: null },
  { name: "IWC Schaffhausen", mark: null },
  { name: "Panerai", mark: null },
  { name: "Longines", mark: null },
];

/* -------------------------------------------------------------- inventory */

export type Watch = {
  id: string;
  brand: string;
  model: string;
  reference: string;
  year: number;
  caseSize: string;
  price: string;
  material: string;
  movement: string;
  accompaniments: string;
  note: string;
  /**
   * Path to a photograph of this exact reference, or null.
   *
   * Null is the honest state while no photography exists: the card renders a
   * designed plate instead. Never point this at a picture of a different
   * watch — the caption beneath names a specific reference, and a mismatched
   * image misrepresents it.
   */
  image: string | null;
};

/**
 * DEMO STOCK — INVENTED.
 *
 * References, periods and case sizes are those of real production models, so
 * the layout is exercised with realistic data. Prices are indicative of the
 * London market and are NOT this dealer's prices. Nothing here asserts
 * availability. Replace wholesale before INVENTORY_VERIFIED is set true.
 */
export const featuredWatches: Watch[] = [
  {
    id: "rolex-1680-red",
    brand: "Rolex",
    model: 'Submariner "Red Sub"',
    reference: "1680",
    year: 1971,
    caseSize: "40mm",
    price: "£42,500",
    material: "Stainless steel",
    movement: "Automatic, calibre 1575",
    accompaniments: "Watch only",
    note:
      "Unpolished case with full lug bevels. Matte dial, untouched, with the " +
      "red depth rating intact.",
    image: null,
  },
  {
    id: "patek-5711-1a",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5711/1A-010",
    year: 2018,
    caseSize: "40mm",
    price: "£118,000",
    material: "Stainless steel",
    movement: "Automatic, calibre 26-330 S C",
    accompaniments: "Box and papers",
    note:
      "Blue embossed dial, unworn bracelet stretch. Complete with certificate " +
      "of origin.",
    image: null,
  },
  {
    id: "rolex-6239",
    brand: "Rolex",
    model: 'Cosmograph Daytona "Paul Newman"',
    reference: "6239",
    year: 1967,
    caseSize: "37mm",
    price: "£186,000",
    material: "Stainless steel",
    movement: "Manual wind, calibre 722",
    accompaniments: "Watch only",
    note:
      "Exotic dial with stepped minute track. Never relumed, never refinished.",
    image: null,
  },
  {
    id: "omega-105-012",
    brand: "Omega",
    model: "Speedmaster Professional",
    reference: "105.012-66",
    year: 1966,
    caseSize: "42mm",
    price: "£24,500",
    material: "Stainless steel",
    movement: "Manual wind, calibre 321",
    accompaniments: "Watch only",
    note:
      "Asymmetric case, sharp chamfers. Tritium indices aged to a warm cream.",
    image: null,
  },
  {
    id: "cartier-tank-cintree",
    brand: "Cartier",
    model: "Tank Cintrée",
    reference: "—",
    year: 1974,
    caseSize: "23mm × 46mm",
    price: "£68,000",
    material: "18ct yellow gold",
    movement: "Manual wind",
    accompaniments: "Watch only",
    note:
      "London-cased, curved to the wrist. Original silvered dial with no " +
      "restoration.",
    image: null,
  },
  {
    id: "ap-5402-a-series",
    brand: "Audemars Piguet",
    model: 'Royal Oak "A-Series"',
    reference: "5402ST",
    year: 1973,
    caseSize: "39mm",
    price: "£152,000",
    material: "Stainless steel",
    movement: "Automatic, calibre 2121",
    accompaniments: "Watch only",
    note:
      "Early A-series with AP-signed tapisserie dial. Case retains its factory " +
      "brushing.",
    image: null,
  },
];

/**
 * DEMO STOCK — INVENTED. Same rules as `featuredWatches`.
 * Drives the cinematic scroll section.
 */
export const patekPieces: Watch[] = [
  {
    id: "patek-3940g",
    brand: "Patek Philippe",
    model: "Perpetual Calendar",
    reference: "3940G",
    year: 1993,
    caseSize: "36mm",
    price: "£94,000",
    material: "18ct white gold",
    movement: "Automatic, calibre 240 Q",
    accompaniments: "Box and papers",
    note:
      "The perpetual calendar Philippe Stern considered definitive. Four " +
      "subsidiary registers reading day, date, month, moon and leap year, " +
      "under a case just 8.5mm deep.",
    image: null,
  },
  {
    id: "patek-5170j",
    brand: "Patek Philippe",
    model: "Chronograph",
    reference: "5170J-001",
    year: 2016,
    caseSize: "39.4mm",
    price: "£72,500",
    material: "18ct yellow gold",
    movement: "Manual wind, calibre CH 29-535 PS",
    accompaniments: "Box and papers",
    note:
      "In-house column wheel chronograph with six patented improvements. " +
      "Breguet numerals on a lacquered cream dial.",
    image: null,
  },
  {
    id: "patek-5711-1a-blue",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5711/1A-010",
    year: 2018,
    caseSize: "40mm",
    price: "£118,000",
    material: "Stainless steel",
    movement: "Automatic, calibre 26-330 S C",
    accompaniments: "Box and papers",
    note:
      "Genta's porthole, drawn in 1976 and discontinued in 2021. Horizontally " +
      "embossed blue dial, integrated bracelet, 8.3mm on the wrist.",
    image: null,
  },
];

/* ------------------------------------------------------- the house promise */

export const promise = {
  eyebrow: "The house rule",
  headline: "We leave them alone.",
  body: [
    "We do not restore dials. We do not heavily polish cases. A watch that " +
      "reaches us with fifty years of its own history intact leaves with that " +
      "history intact.",
    "Refinishing a dial and cutting a case back to a mirror is the fastest " +
      "way to make an old watch look new, and the surest way to destroy what " +
      "made it worth keeping. Lug bevels, factory brushing, tritium that has " +
      "aged the way tritium ages — none of it can be put back once it is gone.",
    "Every watch we sell carries a two-year warranty covering both correct " +
      "function and originality.",
  ],
  points: [
    { label: "Dials", value: "Never refinished" },
    { label: "Cases", value: "Never heavily polished" },
    { label: "Parts", value: "Unmodified and original" },
    { label: "Warranty", value: "Two years, function and originality" },
  ],
} as const;

/* -------------------------------------------------------------- heritage */

export const heritage = {
  eyebrow: "Heritage",
  headline: "Forty-odd years on one street.",
  milestones: [
    {
      year: "1879",
      title: "The Royal Arcade opens",
      body: "London's oldest shopping arcade is built off Old Bond Street.",
    },
    {
      year: "1981",
      title: "The first shop",
      body:
        "One of our partners, an antique clock specialist, sets up shop for " +
        "the first time.",
    },
    {
      year: "1996",
      title: "Old Bond Street",
      body:
        "We move into the Royal Arcade — the same address we occupy today, " +
        "and the oldest shop on Old Bond Street dealing exclusively in watches.",
    },
    {
      year: "2008",
      title: "Twice the size",
      body:
        "The boutique doubles, the interior is rebuilt, and we become The " +
        "Watch Club.",
    },
  ],
} as const;

/* -------------------------------------------------------------- services */

export const services = [
  {
    title: "Buying",
    body:
      "We buy good watches outright, modern and vintage. Bring it in, or send " +
      "photographs and we will tell you what it is worth.",
  },
  {
    title: "Selling",
    body:
      "The country's best examples of pre-owned and vintage wristwatches, " +
      "1940 to the present, kept in impeccable condition.",
  },
  {
    title: "Part exchange",
    body:
      "Trade what you have against what you want. We part-exchange both modern " +
      "and vintage pieces.",
  },
  {
    title: "Shipping",
    body:
      "Free next-day delivery within the UK and free worldwide shipping, fully " +
      "insured. We have never charged for shipping and we do not intend to start.",
  },
] as const;

/* ---------------------------------------------------------- testimonials */

export type Testimonial = {
  id: number;
  quote: string;
  author: string;
  source: string;
  detail: string;
};

/**
 * Real, public Trustpilot reviews of watchclub.com, shortened but not
 * reworded. Attributed to the platform, first name and initial only.
 *
 * TESTIMONIALS_VERIFIED stays false because these were gathered from public
 * listings rather than supplied by the client with permission to republish.
 * No aggregate rating or review count is claimed anywhere from this data.
 */
export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "I would highly recommend the Watch Club to anyone seeking not just a " +
      "beautiful timepiece but also a superb customer service.",
    author: "Trustpilot reviewer",
    source: "Trustpilot",
    detail: "Verified purchase",
  },
  {
    id: 2,
    quote:
      "Fantastic in-store experience. The staff were knowledgeable, friendly " +
      "and patient. Helped me find the perfect watch without any pressure.",
    author: "Trustpilot reviewer",
    source: "Trustpilot",
    detail: "Royal Arcade boutique",
  },
  {
    id: 3,
    quote:
      "My experience with The Watch Club was nothing short of spectacular. " +
      "Andrew helped me secure my grail watch within just a few days, and the " +
      "entire transaction process was seamless from start to finish.",
    author: "Trustpilot reviewer",
    source: "Trustpilot",
    detail: "Verified purchase",
  },
  {
    id: 4,
    quote:
      "He was extremely polite, professional, and the turnaround time from my " +
      "initial enquiry was within one hour on a Saturday.",
    author: "Trustpilot reviewer",
    source: "Trustpilot",
    detail: "Enquiry response",
  },
];

/* -------------------------------------------------------------- enquiry */

export const enquiry = {
  eyebrow: "Visit us",
  headline: "Royal Arcade, Old Bond Street.",
  body:
    "The shop is open six days a week and no appointment is necessary. If you " +
    "are looking for something specific, or you have something to sell, tell " +
    "us about it.",
} as const;

export const notices = {
  inventory:
    "Sample layout. The watches, references and prices shown here are " +
    "illustrative and are not live stock.",
} as const;
