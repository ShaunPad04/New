/**
 * Central business configuration for Zen Den Beauty & Wellbeing Centre.
 *
 * Every value here is a fact about the real business. The figures were
 * supplied in the build brief from the live Fresha listing and MUST be
 * re-verified against Fresha immediately before the site is indexed —
 * the review count and service count in particular change over time.
 * Nothing in this file is invented; where a value is a proposal or is
 * awaiting confirmation it is flagged in a comment.
 */

export const business = {
  name: "Zen Den Beauty & Wellbeing Centre",
  shortName: "Zen Den",
  // Legal/one-line description used for metadata and structured data.
  tagline: "Beauty and wellbeing treatments created around you, in the heart of Humberston.",
  telephone: "07873 220636",
  telephoneE164: "+447873220636",
  email: "", // Not published on the source listing — left blank until confirmed.
  address: {
    line1: "51 Fieldhouse Road",
    locality: "Humberston",
    region: "Grimsby",
    postcode: "DN36 4UJ",
    country: "GB",
  },
  // VERIFY on Fresha before indexing — these move.
  rating: { value: "5.0", count: 70 }, // Matches the "70 on Fresha" count rendered on the page; verify live on Fresha.
  experienceYears: 25, // "More than 25 years of experience" — verify still stated.
  // Opening hours in Europe/London. VERIFY on Fresha before indexing.
  hours: [
    { day: "Monday", open: "12:00", close: "17:00" },
    { day: "Tuesday", open: "09:00", close: "19:00" },
    { day: "Wednesday", open: null, close: null },
    { day: "Thursday", open: "09:00", close: "19:00" },
    { day: "Friday", open: "09:00", close: "17:00" },
    { day: "Saturday", open: "09:00", close: "13:00" },
    { day: "Sunday", open: null, close: null },
  ],
  links: {
    fresha:
      "https://www.fresha.com/en-GB/a/zen-den-beauty-and-wellbeing-centre-humberston-51-fieldhouse-road-x56rfgnd",
    freshaBooking:
      "https://www.fresha.com/en-GB/a/zen-den-beauty-and-wellbeing-centre-humberston-51-fieldhouse-road-x56rfgnd/booking?menu=true",
    freshaReviews:
      "https://www.fresha.com/en-GB/a/zen-den-beauty-and-wellbeing-centre-humberston-51-fieldhouse-road-x56rfgnd/reviews",
    instagram: "https://www.instagram.com/zen__den__/",
    facebook: "https://www.facebook.com/natalieszenden/",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Zen+Den+Beauty+and+Wellbeing+Centre%2C+51+Fieldhouse+Road%2C+Humberston%2C+Grimsby+DN36+4UJ",
  },
} as const;

/**
 * The site's canonical origin. Preview builds are not indexed (see robots.ts);
 * production overrides this via NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://zendenconcept.bradhoxha6.workers.dev";

export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

/** Per-route metadata. Titles mirror the built export; descriptions are ours. */
export const ROUTES: {
  route: string;
  slug: string;
  title: string;
  description: string;
}[] = [
  {
    route: "/",
    slug: "home",
    title: "Zen Den Beauty & Wellbeing Centre | Humberston",
    description:
      "Premium beauty and wellbeing treatments in Humberston — facials, lashes, brows, massage, holistic therapies and more. Book with Zen Den Beauty & Wellbeing Centre.",
  },
  {
    route: "/treatments",
    slug: "treatments",
    title: "Treatments & prices | Zen Den Beauty & Wellbeing Centre",
    description:
      "Browse the full treatment menu at Zen Den in Humberston — facials, lashes, brows, massage, holistic therapies, body, waxing and hands & feet, with prices and durations.",
  },
  {
    route: "/inside",
    slug: "inside",
    title: "Inside Zen Den | Zen Den Beauty & Wellbeing Centre",
    description:
      "A calm corner of Humberston. Look inside the Zen Den treatment rooms and salon — a quiet space created to leave you feeling restored.",
  },
  {
    route: "/team",
    slug: "team",
    title: "Meet the team | Zen Den Beauty & Wellbeing Centre",
    description:
      "Meet the people behind the care at Zen Den Beauty & Wellbeing Centre in Humberston.",
  },
  {
    route: "/reviews",
    slug: "reviews",
    title: "Client reviews | Zen Den Beauty & Wellbeing Centre",
    description:
      "Kind words from Zen Den clients. Read verified Fresha reviews for Zen Den Beauty & Wellbeing Centre in Humberston.",
  },
  {
    route: "/before-after",
    slug: "before-after",
    title: "Before & after | Zen Den Beauty & Wellbeing Centre",
    description:
      "Genuine, client-approved before-and-after results from treatments at Zen Den Beauty & Wellbeing Centre.",
  },
  {
    route: "/aftercare",
    slug: "aftercare",
    title: "Aftercare & preparation | Zen Den Beauty & Wellbeing Centre",
    description:
      "How to prepare for your appointment and care for your treatment afterwards — aftercare guidance from Zen Den Beauty & Wellbeing Centre.",
  },
  {
    route: "/contact",
    slug: "contact",
    title: "Contact & find us | Zen Den Beauty & Wellbeing Centre",
    description:
      "Find Zen Den Beauty & Wellbeing Centre at 51 Fieldhouse Road, Humberston, Grimsby DN36 4UJ. Call, get directions or send an enquiry.",
  },
  {
    route: "/book",
    slug: "book",
    title: "Book an appointment | Zen Den Beauty & Wellbeing Centre",
    description:
      "Book your appointment at Zen Den Beauty & Wellbeing Centre in Humberston through Fresha.",
  },
  {
    route: "/privacy",
    slug: "privacy",
    title: "Privacy policy | Zen Den Beauty & Wellbeing Centre",
    description:
      "How Zen Den Beauty & Wellbeing Centre collects, uses and protects your personal information.",
  },
  {
    route: "/cookies",
    slug: "cookies",
    title: "Cookie notice | Zen Den Beauty & Wellbeing Centre",
    description:
      "How Zen Den Beauty & Wellbeing Centre uses cookies and similar technologies.",
  },
];

export function routeMeta(route: string) {
  return ROUTES.find((r) => r.route === route);
}
