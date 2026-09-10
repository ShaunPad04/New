/**
 * NEW HOME AGENTS — SITE CONTENT
 *
 * Every business fact here was read from www.newhomeagents.co.uk on the
 * snapshot date in src/data/scrape/meta.json. Source page is noted beside
 * each block. Service explanations are written by us in plain UK English
 * from the agency's own descriptions; nothing is invented.
 *
 * The public-facing brand is "New Home Agents". The email address uses the
 * legal entity's name (New Home Solutions Ltd) — it is correct as published
 * and must not be "corrected".
 */

export const site = {
  name: "New Home Agents",
  legalName: "New Home Solutions Ltd",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.newhomeagents.co.uk",
  tagline: "Nationwide New Homes, Part Exchange & Assisted Move",
  description:
    "New Home Agents specialise in the residential sales of New Homes, Part Exchange and Assisted Move properties on behalf of some of the UK's best house builders.",
  // Contact — verified against the site header, footer and Contact page.
  phone: "0333 006 8058",
  phoneHref: "tel:+443330068058",
  email: "sales@newhomesolutions.co.uk",
  openingHours: "Mon – Sun, 7:00am – 11:00pm",
  headOffice: {
    label: "New Home Agents – Head Office",
    lines: ["Unit 7, First Floor", "Hepton Court", "Leeds", "LS9 6PW"],
  },
  // Statutory information — Contact page, "Statutory Company Information".
  registeredAddress: "Club Chambers, Museum Street, York, England, YO1 7DN",
  companyNumber: "13123123",
  vatNumber: "132200872",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100091552015088",
  },
  locale: "en_GB",
} as const;

export const nav = [
  { label: "Properties", href: "/properties" },
  { label: "New Homes", href: "/new-homes" },
  { label: "Selling", href: "/selling" },
  { label: "About", href: "/about" },
] as const;

export const secondaryNav = [
  { label: "Part Exchange & Assisted Move", href: "/part-exchange-assisted-move" },
  { label: "Mortgages", href: "/mortgages" },
  { label: "Register", href: "/register" },
  { label: "Contact", href: "/contact" },
] as const;

export const hero = {
  eyebrow: "Nationwide new homes, part exchange & assisted move",
  headline: "Your next home starts here.",
  copy:
    "Explore new homes and resale properties across the UK, with expert support for buying, selling, part exchange and assisted move.",
  primary: { label: "Explore Properties", href: "/properties" },
  secondary: { label: "Request a Valuation", href: "/selling" },
} as const;

/**
 * Figures the agency states about itself on its homepage ("Welcome to New
 * Home Agents") and About Us page. They are the agency's own claims and are
 * labelled as such wherever they appear.
 */
export const agencyFigures = [
  { value: 140, suffix: "+", label: "Years' combined experience", source: "Homepage — \"over 140 years combined experience\"" },
  { value: 4000, suffix: "+", label: "Properties sold", source: "Homepage — \"selling in excess of 4000+ properties\"" },
  { value: 12, suffix: "+", label: "Years helping people move", source: "About Us — \"over the past 12 years\"" },
] as const;

export const intro = {
  eyebrow: "Welcome to New Home Agents",
  heading: "Nationwide sales of New Homes, Part Exchange and Assisted Move",
  paragraphs: [
    "New Home Agents specialise in the residential sales of New Homes, Part Exchange and Assisted Move properties on behalf of some of the UK's best house builders.",
    "Our experienced team can assist you from start to finish, whether that's selling your existing home or buying one of our Part Exchange, Assisted Sale or new build properties.",
    "Our friendly team can advise and guide you on all aspects of the purchase or resale, from initial valuation to mortgage advice and legal completion.",
  ],
  // The bullet list the agency publishes under the welcome copy.
  points: [
    "A personal service tailored to suit your exact requirements.",
    "Bespoke marketing — including professional photography and enhanced marketing via social media platforms.",
    "High levels of professionalism and experience — a proven track record of selling properties via house builder schemes.",
    "Best in class sales progression.",
    "Free mortgage advice.",
    "Multi-agency marketing.",
  ],
} as const;

export const aboutStatement =
  "Our mission is to help people move home by providing a service from a team of experienced, passionate and dedicated property professionals who aim to consistently exceed our clients' expectations.";

export const services = [
  {
    slug: "new-homes",
    index: "01",
    label: "New Homes",
    title: "Brand-new homes from the UK's leading house builders",
    summary:
      "We sell new build homes on behalf of some of the UK's best house builders, nationwide. Browse current developments and plots, and talk to us about incentives on offer.",
    href: "/new-homes",
    cta: "View new homes",
  },
  {
    slug: "part-exchange",
    index: "02",
    label: "Part Exchange",
    title: "Trade your current home in against a new one",
    summary:
      "With a house builder's Part Exchange scheme the builder buys your existing home, so you can move into a new build without a chain. We handle the resale of part exchange properties on the builder's behalf.",
    href: "/part-exchange-assisted-move",
    cta: "How part exchange works",
  },
  {
    slug: "assisted-move",
    index: "03",
    label: "Assisted Move",
    title: "The builder helps sell your home while you buy new",
    summary:
      "Under an Assisted Move (or Assisted Sale) scheme the house builder supports the sale of your current home — typically covering agent fees — so you can secure your new build while we market and sell your existing property.",
    href: "/part-exchange-assisted-move",
    cta: "How assisted move works",
  },
  {
    slug: "selling",
    index: "04",
    label: "Selling Your Home",
    title: "Multi-agency marketing and competitive selling fees",
    summary:
      "Interested in one of our properties but have a house to sell? Request a valuation and take advantage of multi-agency marketing, professional photography and best-in-class sales progression.",
    href: "/selling",
    cta: "Request a valuation",
  },
] as const;

/**
 * Customer reviews, published unattributed on the agency's homepage under
 * "What Our Customers Say...". Reproduced verbatim; the agency does not name
 * the reviewers, so no names or portraits are attached here.
 */
export const reviews = [
  {
    quote:
      "I can't thank New Home Solutions enough! They kept in touch with weekly updates on the purchase of our said property, I never had to chase anything. 7 weeks in total it's taken from putting the offer in with New Home Solutions to receiving my keys. They also recommended a very good solicitor to use. A very good service provided, with polite and friendly staff at the other end of the phone",
    attribution: "Customer review",
  },
  {
    quote:
      "Fabulous service from a great team especially Helen, Charlotte and Gina. We had our ups and downs and they helped and supported us each step of the way. We would fully recommend them, they go far and above for their customers. Thank you x",
    attribution: "Customer review",
  },
  {
    quote:
      "Very efficient and friendly. Helen really went above and beyond to which we are very grateful.",
    attribution: "Customer review",
  },
  {
    quote:
      "I had a very positive experience with New Home Solutions. Vicky was amazing! Very responsive, lovely manner and extremely efficient. I would highly recommend.",
    attribution: "Customer review",
  },
  {
    quote:
      "Sold our home with these guys received top quality service never a problem or no communication issues firstly had dealings with Jordan then Sarah absolutely lovely both of them really professional and both went above and beyond. Kept me updated on everything that was going on. Would highly recommend",
    attribution: "Customer review",
  },
] as const;

export const reviewsSource = "Published by New Home Agents on newhomeagents.co.uk";

/** Answers are drawn from the agency's own service descriptions. */
export const faqs = [
  {
    q: "What does New Home Agents do?",
    a: "We specialise in the residential sale of New Homes, Part Exchange and Assisted Move properties on behalf of some of the UK's best house builders, and we sell existing homes through multi-agency marketing.",
  },
  {
    q: "What is Part Exchange?",
    a: "A house builder's Part Exchange scheme lets you trade in your current home as part payment for a new build, so there is no chain to wait on. We market and sell the part exchange properties on the builder's behalf — you will find them listed alongside our new homes.",
  },
  {
    q: "What is Assisted Move?",
    a: "With Assisted Move (sometimes called Assisted Sale) the house builder helps sell your existing home so you can reserve a new build. Our team markets your property and progresses the sale from valuation to legal completion.",
  },
  {
    q: "I have a house to sell — can you help?",
    a: "Yes. If you are interested in one of our properties but have a house to sell, request a valuation and take advantage of multi-agency marketing and competitive selling fees.",
  },
  {
    q: "Can you help with a mortgage?",
    a: "Yes. New Home Mortgages, a trading name of Fairstone Mortgage Solutions Ltd (authorised and regulated by the Financial Conduct Authority, FRN 655072), provides mortgage and protection advice 7 days a week.",
  },
  {
    q: "How do I arrange a viewing?",
    a: `Call our offices on ${site.phone} — we are open ${site.openingHours} — or send a viewing request from any property page and a member of the team will be in touch.`,
  },
  {
    q: "How can I hear about new properties first?",
    a: "Register with us and we will send regular property updates matching the areas, property types and number of bedrooms you are looking for.",
  },
] as const;

export const closingCta = {
  eyebrow: "Find your next home",
  heading: "Ready to move? We'll guide you from valuation to completion.",
  copy:
    "Whether you are buying a new build, selling through part exchange or assisted move, or simply have a house to sell, our team is here seven days a week.",
  primary: { label: "Get in touch", href: "/contact" },
  secondary: { label: "Request a valuation", href: "/selling" },
} as const;

/** Mortgages page — verbatim from newhomeagents.co.uk/mortgages. */
export const mortgages = {
  title: "New Home Mortgages",
  paragraphs: [
    "New Home Mortgages specialise in providing all clients and House Builders with a tailored service specific for their needs 7 days a week. With our extensive knowledge of Home Movers, First Time Buyers, Buy to Let and Re-mortgages we are perfectly placed to satisfy your requirements.",
    "We are fully committed to offering all our clients a first class service. We understand that speed and communication is key, and we work towards strict timescales ensuring clients are ready to exchange on time in a smooth and efficient manner.",
    "We have access to both mainstream and exclusive mortgage rates and excellent relationships with the UK's top lenders, ensuring we can offer our clients the best deals available on the market. We can source excellent deals for First Time Buyers with incentives such as reduced deposits and arrangement fees.",
    "As a preferred choice for many of the UK's leading House Builders we have built up a reputation due to our understanding of the housing industry. We qualify all customers quickly and efficiently and work together with the sales advisors, ensuring deals can be structured to maximise all sales opportunities.",
  ],
  strapline: "“We have your best interest rates at heart”",
  expertise: [
    { label: "Mortgages", detail: "New Homes, First Time Buyer, Buy to Let & Re-mortgage" },
    { label: "Protection", detail: "Critical Illness, Income Protection & Life Insurance" },
    { label: "Building & Contents Insurance", detail: "Cover for your new home" },
  ],
  regulatory:
    "New Home Mortgages is a trading name of Fairstone Mortgage Solutions Ltd. Fairstone Mortgage Solutions Ltd is authorised and regulated by the Financial Conduct Authority — FRN 655072. Part of the Fairstone Group.",
} as const;

/** About page — verbatim paragraphs from newhomeagents.co.uk/about-us. */
export const about = {
  paragraphs: [
    "At New Home Agents, we are proud of the results we have achieved over the past 12 years. Our mission is to help people move home by providing a service from a team of experienced, passionate and dedicated property professionals who aim to consistently exceed our clients' expectations.",
    "Our dedicated team will guide you through the process, ensuring you maximise the value of your home, achieve a sale in a timely manner and ensure the conveyancing process runs smoothly.",
    "With access to a huge database of clients, built up over our 12 years in the industry, we have the ability, through our sophisticated systems, to promote individual properties to the widest possible range of potential buyers throughout the UK.",
    "Understanding the requirements of our clients and delivering value drives our service. We will tailor our strategies to your specific needs enabling you to maximise the value of your home within the required timescales.",
    "New Home Agents have successfully been helping people to move for over 12 years. Operating from our strategically located Head Office based in Leeds, and together with our specialist associated partners for independent mortgage advice and conveyancing, we are ready to help our clients move.",
  ],
} as const;

/** Memberships and portals shown on the agency's site footer. */
export const affiliations = [
  { name: "Rightmove", src: "/images/brand/affiliations/rightmove.png" },
  { name: "Zoopla", src: "/images/brand/affiliations/zoopla.png" },
  { name: "The Property Ombudsman", src: "/images/brand/affiliations/tpo.png" },
  { name: "Trading Standards Approved Code", src: "/images/brand/affiliations/TSI-AC.png" },
] as const;

export const policies = [
  { label: "Privacy Policy", href: "/documents/privacy-policy.pdf", external: true },
  { label: "Complaints Procedure", href: "/documents/complaints-procedure.pdf", external: true },
  { label: "Cookie Policy", href: "/cookie-policy", external: false },
] as const;

/** Cookie policy — verbatim from newhomeagents.co.uk/cookie-policy. */
export const cookiePolicy = {
  intro: [
    "We use cookies and other similar technologies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website (for example, to remember your details and improve our website). By using our website, you agree to our use of cookies.",
    "The cookies on our website are either set by us or by third party partners and fall into the following categories:",
  ],
  sections: [
    {
      title: "First party session management",
      body: "These are typically required by us to make sure you can move freely from one page to another and so that you can access and use certain services within the website. Normally, these cookies only last whilst your browser is open and are deleted when it is closed. Some may need to remain for the duration of your visit (a “session”) or longer.",
    },
    {
      title: "Functionality",
      body: "These cookies allow you to set and store preferences for our website, such as when you are offered the option to customise elements of the layout or content of the website.",
    },
    {
      title: "Third party",
      body: "Google uses the ‘CONSENT’ cookie, which lasts for 2 years, to store a user’s state regarding their cookies choices. Another cookie, ‘SOCS’, lasts for 13 months and is also used to store a user’s state regarding their cookies choices. More information can be found at https://policies.google.com/technologies/cookies?hl=en-US including how to manage cookies in your browser.",
    },
    {
      title: "Refusing or withdrawing your consent to cookies",
      body: "You may adjust your browser settings to refuse cookies, but some of the services on our website may not work if you do so. You can find out more information about cookies at www.allaboutcookies.org and www.youronlinechoices.eu.",
    },
    {
      title: "Links to other websites",
      body: "Our website may contain links to other websites that are not run by us. If you follow a link to another website, please note that other websites have their own privacy policies and we are not responsible for those policies or other websites’ content. You should check these privacy policies before submitting any personal information to these websites.",
    },
  ],
} as const;

/** Options mirrored from the agency's own valuation and registration forms. */
export const valuationOptions = {
  timeframe: ["Immediately", "1-2 Months", "2-3 Months", "3-6 Months", "Within the next 12 months", "Not sure"],
  propertyType: ["Barn Conversion", "Bungalow", "Cottage", "Detached", "End Terraced", "Farmhouse", "Link Detached", "Maisonette", "Mews", "Semi", "Terraced", "Town House"],
  condition: ["Newly Refurbished", "Excellent", "Average", "Needs Modernisation"],
  contactMethod: ["Either", "Email", "Telephone"],
} as const;
