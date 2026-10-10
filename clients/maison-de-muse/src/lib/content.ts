/**
 * MAISON DE MUSE — SITE COPY
 *
 * Everything rendered as prose lives here. Facts about the business come
 * from `site.ts` (verified) and are never restated as literals in copy.
 *
 * Copy marked `official` is taken from the café's own website, which the
 * client owns and has authorised for reuse. Everything else is ours and
 * was written from verified facts only — no sourcing claims, no awards,
 * no invented history.
 */

export const hero = {
  eyebrow: "Sea View Street, Cleethorpes",
  headline: ["Coffee, food and", "effortless elegance."],
  supporting:
    "From early-morning coffee and matcha to brunch, pastries and relaxed evening wine on Sea View Street.",
  primary: { label: "Explore the Menu", href: "/menu" },
  secondary: { label: "Find Us", href: "/visit" },
} as const;

/** Official copy from maisondemuse.co.uk, verified 2026-09-09. */
export const intro = {
  eyebrow: "Welcome to Maison de Muse",
  statement:
    "Where sophistication meets comfort, and every sip is an experience. Nestled in the heart of Cleethorpes, Maison de Muse is a destination for those who appreciate good food, fine wine, and effortless elegance.",
  meaning:
    "Maison de Muse, meaning ‘House of Inspiration’, is more than just a coffee shop and wine bar — it’s a space designed to inspire.",
} as const;

/** The café's own four pillars, from the official website. */
export const pillars = [
  {
    index: "01",
    title: "Coffee",
    body: "Expertly brewed from the finest beans for a deep, indulgent flavour.",
  },
  {
    index: "02",
    title: "Fine wines",
    body: "A carefully curated selection of world-class wines.",
  },
  {
    index: "03",
    title: "Gourmet bites",
    body: "Thoughtfully prepared small plates and pastries.",
  },
  {
    index: "04",
    title: "Chic ambience",
    body: "A stylish yet welcoming space designed for relaxation and connection.",
  },
] as const;

/** Ticker words — our own, factual. */
export const ticker = [
  "Speciality coffee",
  "Matcha",
  "Croissants",
  "Brunch",
  "Light lunches",
  "Wine",
  "Evening drinks",
  "Sea View Street",
] as const;

/** The day, in three beats. Copy is ours; hours come from site.ts. */
export const dayparts = [
  {
    time: "From 7am",
    title: "Morning",
    body: "Espresso, flat whites and matcha lattes from opening, with croissants and bagels from the kitchen at 8am.",
    href: "/menu#coffee",
    cta: "Coffee & hot drinks",
  },
  {
    time: "Until 5pm",
    title: "Brunch & lunch",
    body: "Maison Eggs, sourdough, flatbreads and salads through the day, with sweet croissants and pancakes for the other kind of morning.",
    href: "/menu#food",
    cta: "Brunch & lunch",
  },
  {
    time: "Friday & Saturday, from 4pm",
    title: "Evening",
    body: "Cheese boards, olives and fresh bread with wine by the glass or bottle — the café becomes a wine bar until 11pm.",
    href: "/menu#evening",
    cta: "Evening menu",
  },
] as const;

/** Rotating words for the daypart headline. */
export const rollingWords = ["morning", "brunch", "afternoon", "evening"] as const;

export const story = {
  eyebrow: "Our story",
  headline: ["A house of", "inspiration."],
  paragraphs: [
    "Maison de Muse opened on Sea View Street, Cleethorpes, in February 2025 as a French-inspired coffee shop and wine bar.",
    "The name means ‘House of Inspiration’ — a space to start the day with a rich, aromatic coffee or unwind with a perfectly poured glass of wine, and to savour the moment in between.",
    "The room is bright and stylish, the counter runs from speciality coffee and matcha in the morning to wine and cheese boards on Friday and Saturday evenings, and dogs are welcome.",
  ],
  facts: [
    { label: "Opened", value: "February 2025" },
    { label: "Address", value: "49 Sea View Street" },
    { label: "Food hygiene rating", value: "5 — Very good" },
    { label: "Evening bar", value: "Friday & Saturday" },
  ],
} as const;

export const faqs = [
  {
    q: "When is food served?",
    a: "The kitchen serves from 8am until 5pm every day. Coffee and drinks are available from 7am.",
  },
  {
    q: "What happens on Friday and Saturday evenings?",
    a: "From 4pm the café becomes a wine bar, with an evening menu of boards and bites alongside the wine list, until 11pm.",
  },
  {
    q: "Can I book a table?",
    a: "There is no online booking. Call the café on 01472 472140 and the team will help with tables and group visits.",
  },
  {
    q: "Are dogs welcome?",
    a: "Yes — Maison de Muse is dog friendly, and there is a puppuccino on the menu.",
  },
  {
    q: "Do you cater for allergies and dietary requirements?",
    a: "Please tell a member of staff about any allergies before ordering. The kitchen handles nuts, gluten, dairy and other allergens, so cross-contamination cannot be completely ruled out. Vegetarian and vegan options are available, and alternative milks are £0.50.",
  },
  {
    q: "Can I hire the space for an event?",
    a: "Event hire is available. Email info@maisondemuse.co.uk or call 01472 472140 to discuss dates.",
  },
] as const;

export const visitCta = {
  eyebrow: "Find your muse",
  headline: ["Coffee from 7am.", "Wine until late."],
  body: "Sea View Street is a short walk from Cleethorpes seafront and the station. Call ahead for groups, or just come in.",
} as const;

export const footer = {
  descriptor:
    "A speciality coffee shop, brunch café and wine bar on Sea View Street, Cleethorpes.",
} as const;
