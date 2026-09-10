/**
 * All copy on the page. Every fact here is taken from paul-fox.com — the
 * homepage, About Us, Our Staff, the service pages, the office list and the
 * customer reviews published on the site. Nothing is invented.
 */
import { asset, type AssetKey } from "./assets";

export const site = {
  name: "Paul Fox Estate Agents",
  shortName: "paul fox",
  url: "https://www.paul-fox.com",
  title: "Paul Fox Estate Agents | Your Family Estate Agent in North Lincolnshire",
  description:
    "Welcome to Paul Fox Estate Agents. For over 25 years we have been the leading full service agent in North Lincolnshire offering sales, lettings & surveys.",
  strapline: "Your family estate agents in North Lincolnshire",
  email: "admin@paul-fox.com",
  phone: "01724 282868",
  established: 1990,
};

export const social = [
  { label: "Facebook", href: "https://www.facebook.com/paulfoxestateagent/" },
  { label: "Instagram", href: "https://www.instagram.com/paulfoxestateagents/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/paul-fox-estate-agents/" },
];

export const nav = {
  cta: { label: "Book a free valuation", href: "/valuation-request" },
  links: [
    { label: "HOME", href: "/" },
    { label: "ABOUT US", href: "/about-us" },
    { label: "OUR TEAM", href: "/our-staff" },
    { label: "PROPERTIES", href: "/search-results" },
    { label: "SELLING", href: "/sell" },
    { label: "LETTINGS", href: "/letting-agents" },
    { label: "SURVEYS", href: "/rics-chartered-property-surveyors" },
    { label: "CONTACT", href: "/contact" },
  ],
};

export const hero = {
  wordmark: "paul fox",
  title: "Your Family Estate Agents",
  copy: "Whether you’re selling your home, searching for your next property, or looking for expert lettings support, you deserve an Estate Agent that makes the process simple, stress-free and successful. For over 35 years we’ve helped thousands of people across Scunthorpe and North Lincolnshire — the only local estate agents recommended by The Guild.",
  video: asset("hero.mp4"),
  poster: asset("hero-poster.jpg"),
};

export const about = {
  eyebrow: "[ ABOUT US ]",
  heading: "family-run, since 1990",
  copy: "Paul Fox Estate Agents is a local independent estate agent established in 1990 by Mr Paul Fox, a Chartered Surveyor born and raised in Scunthorpe. With five family-run offices in Scunthorpe, Brigg, Barton, Epworth and Gainsborough, we strive to go above and beyond expectations for all our clients — which is why we are the most trusted estate agent in North Lincolnshire and the surrounding areas.",
  cta: { label: "Read our story", href: "/about-us" },
  image: { src: asset("about.jpg"), alt: "Paul, Liam and Ryan Fox" },
  stats: [
    { label: "Years helping people move", value: "35+", index: "[01]" },
    { label: "Family-run offices", value: "5", index: "[02]" },
    { label: "Finest team combined experience", value: "80 yrs", index: "[03]" },
  ],
};

export type Service = {
  image: AssetKey;
  counter: string;
  label: string;
  title: string;
  description: string;
  button: string;
  href: string;
};

export const services = {
  eyebrow: "[ SERVICES ]",
  heading: "what we do",
  items: [
    {
      image: "service-buying.jpg",
      counter: "/1",
      label: "Buy [ 01 ]",
      title: "buying",
      description:
        "I’m interested in buying. Search homes for sale across Scunthorpe, Brigg, Barton-upon-Humber, Epworth, Gainsborough and the surrounding villages. All our offices are computer linked, so whichever branch you walk into can help you find your next home.",
      button: "for buyers",
      href: "/search-results?department=residential-sales",
    },
    {
      image: "service-selling.jpg",
      counter: "/2",
      label: "Sell [ 02 ]",
      title: "selling",
      description:
        "The leading local family estate agents, helping people move for over 35 years. From an accurate, no-obligation valuation to handing over the keys, marketing is individually tailored to suit both your home and your requirements — and our Finest team handles period farmhouses, prestige homes and village properties with land.",
      button: "for sellers",
      href: "/sell",
    },
    {
      image: "service-lettings.jpg",
      counter: "/3",
      label: "Lettings [ 03 ]",
      title: "lettings",
      description:
        "Letting agents with a combined experience of over 50 years in the property and letting industry. If you are looking to rent your property in North Lincolnshire without the hassle, our trusted team will guide you through the process — from valuation and finding excellent tenants to ongoing management.",
      button: "for landlords",
      href: "/letting-agents",
    },
    {
      image: "service-surveys.jpg",
      counter: "/4",
      label: "Surveys [ 04 ]",
      title: "surveys",
      description:
        "An experienced Chartered Survey Department carrying out RICS Homebuyers Reports, Condition Reports, Building Surveys, valuations and EPCs throughout Lincolnshire and South Yorkshire — for private individuals, companies, major banks and building societies. National coverage with local knowledge.",
      button: "for surveys",
      href: "/rics-chartered-property-surveyors",
    },
  ] satisfies Service[],
};

export type Listing = {
  name: string;
  number: string;
  category: string;
  image: AssetKey;
  slug: string;
  specs: { key: string; value: string }[];
};

export const listings = {
  eyebrow: "[ PROPERTIES ]",
  heading: "featured properties",
  cta: { label: "view more", href: "/search-results" },
  items: [
    {
      name: "sand pit lane, scunthorpe",
      number: "[ 01 ]",
      category: "for sale",
      image: "listing-sand-pit-lane.jpg",
      slug: "sand-pit-lane-scunthorpe-dn15",
      specs: [
        { key: "TYPE", value: "Detached house · circa 5000 sq ft" },
        { key: "LOCATION", value: "Scunthorpe, DN15" },
        { key: "BEDROOMS", value: "4" },
        { key: "PRICE", value: "Guide price £1,100,000" },
      ],
    },
    {
      name: "godnow bridge, crowle",
      number: "[ 02 ]",
      category: "for sale",
      image: "listing-godnow-bridge.jpg",
      slug: "godnow-bridge-crowle-dn17",
      specs: [
        { key: "TYPE", value: "Detached house · 3850 sq ft" },
        { key: "LOCATION", value: "Crowle, DN17" },
        { key: "BEDROOMS", value: "6" },
        { key: "PRICE", value: "£795,000" },
      ],
    },
    {
      name: "plot 3, hayfield grove",
      number: "[ 03 ]",
      category: "for sale",
      image: "listing-hayfield-grove.jpg",
      slug: "hayfield-grove-wrawby-dn20-2",
      specs: [
        { key: "TYPE", value: "New-build detached house" },
        { key: "LOCATION", value: "Wrawby, Brigg, DN20" },
        { key: "BEDROOMS", value: "6" },
        { key: "PRICE", value: "£699,950" },
      ],
    },
    {
      name: "allisons cottage, barnetby",
      number: "[ 04 ]",
      category: "for sale",
      image: "listing-allisons-cottage.jpg",
      slug: "barnetby-dn38-2",
      specs: [
        { key: "TYPE", value: "Detached house with annex" },
        { key: "LOCATION", value: "Barnetby, DN38" },
        { key: "BEDROOMS", value: "4" },
        { key: "PRICE", value: "£675,000" },
      ],
    },
  ] satisfies Listing[],
};

export type Testimonial = {
  images: [AssetKey, AssetKey, AssetKey];
  quote: string;
  name: string;
  location: string;
};

export const testimonials = {
  eyebrow: "[ Testimonials ]",
  intervalMs: 7000,
  items: [
    {
      images: ["review-1a.jpg", "review-1b.jpg", "review-1c.jpg"],
      quote:
        "“We have been exceptionally happy with the services provided by Paul Fox, particularly from Michelle in Sales and Amanda in Lettings. From arranging an initial very quick viewing, helping us get the property over the line, and being instructed on the ongoing management, the service provided has been professional and efficient.”",
      name: "Claire Dickinson",
      location: "Scunthorpe office, November 2025",
    },
    {
      images: ["review-2a.jpg", "review-2b.jpg", "review-2c.jpg"],
      quote:
        "“The team at Brigg are amazing. Throughout our sale and purchase they have been professional, courteous and respectful. They kept us fully informed throughout the process and were the lynch pin for communication between the parties. Special thanks have to go to Becci who always went the extra mile. Professional with a personal touch.”",
      name: "Pauline Forrest",
      location: "Brigg office, August 2025",
    },
    {
      images: ["review-3a.jpg", "review-3b.jpg", "review-3c.jpg"],
      quote:
        "“Michelle at Paul Fox has been brilliant, from immediate viewing feedback to sale progression – keeping me updated all the way. Very happy and the sale went through in a little over 2 months!! Would highly recommend.”",
      name: "Simon Fish",
      location: "Scunthorpe office, September 2025",
    },
  ] satisfies Testimonial[],
};

export const features = {
  eyebrow: "[ WHY PAUL FOX ]",
  heading: "why choose paul fox?",
  copy: "True family values and an unrivalled success rate across North Lincolnshire. Six reasons people have trusted us with their move for over 35 years.",
  cta: { label: "contact us", href: "/contact" },
  background: asset("features-bg.jpg"),
  items: [
    {
      title: "family-run business",
      number: "[ 01 ]",
      description:
        "Established in 1990 by Paul Fox and run today with his sons Ryan and Liam. Selling and letting houses runs in the family, and every office is underpinned by family values.",
    },
    {
      title: "full service estate agency",
      number: "[ 02 ]",
      description:
        "Sales, lettings, RICS surveys, EPCs, mortgage advice and commercial property — everything your transaction needs, from the first valuation to handing over the keys, under one roof.",
    },
    {
      title: "unrivalled local knowledge",
      number: "[ 03 ]",
      description:
        "We live in and love the local area. Five offices in Scunthorpe, Brigg, Barton, Epworth and Gainsborough, staffed by people who have valued and sold homes here for decades.",
    },
    {
      title: "competitive fees",
      number: "[ 04 ]",
      description:
        "Competitive fees across sales and lettings, with individually tailored marketing included. Our lettings fees are published in full on the website.",
    },
    {
      title: "over 35 years’ experience",
      number: "[ 05 ]",
      description:
        "Paul qualified as a Chartered Surveyor in 1983 and opened the Scunthorpe office in 1991. Brigg followed in 1997, Barton in 1999, Epworth in 2017 and Gainsborough in 2021.",
    },
    {
      title: "recommended by the guild",
      number: "[ 06 ]",
      description:
        "The only local estate agents recommended by The Guild of Property Professionals — the UK’s premium network of independent agents — with your property promoted 24/7 on the touchscreens in Park Lane, London.",
    },
  ],
};

export type Member = {
  number: string;
  name: string;
  post: string;
  city: string;
  image: AssetKey;
};

export const team = {
  eyebrow: "[ OUR TEAM ]",
  heading: "the family behind the name",
  copy: "Without our constantly evolving and expanding team, Paul Fox Estate Agents wouldn’t be who we are today. Through their hard work and dedication, they have made Paul Fox the most trusted estate agent in the area.",
  /** Ghost Fibers settings for the backdrop — ink-950 ground, a quiet silver-blue ribbon. */
  fibers: {
    backdropColor: "#141b34",
    lineColor: "#243055",
    glowColor: "#8a97c4",
    speed: 0.16,
    scale: 2.2,
    rotation: 20,
    rotationSpeed: 0.1,
    layers: 4,
    waveAmplitude: 0.02,
    waveFrequency: 2.5,
    waveSpeed: 0.15,
    layerSpeed: 0.08,
    twist: 0.12,
    twistFrequency: 4,
    twistSpeed: 0.9,
    lineFrequency: 4,
    lineSpacing: 2,
    lineSharpness: 14,
    glowFalloff: 9,
    glowIntensity: 0.9,
    brightness: 1.25,
    blueBoost: 1.05,
    vignette: 0.9,
    grain: 0.04,
    dpr: 1,
  },
  /** Ticker speed in px/s. Card width 278 + gap 20 per member. */
  velocity: 50,
  cardWidth: 278,
  gap: 20,
  members: [
    { number: "[01]", name: "Paul Fox", post: "managing director & chartered surveyor", city: "Scunthorpe", image: "team-paul.jpg" },
    { number: "[02]", name: "Ryan Fox", post: "senior regional valuer & associate director", city: "Brigg", image: "team-ryan.jpg" },
    { number: "[03]", name: "Liam Fox", post: "chartered valuation surveyor & associate director", city: "Scunthorpe", image: "team-liam.jpg" },
    { number: "[04]", name: "Hannah", post: "HR / business support manager", city: "Scunthorpe", image: "team-hannah.jpg" },
    { number: "[05]", name: "Richard", post: "area valuer", city: "Brigg", image: "team-richard.jpg" },
    { number: "[06]", name: "Ben", post: "area valuer", city: "Scunthorpe", image: "team-ben.jpg" },
    { number: "[07]", name: "Becci", post: "finest manager", city: "Brigg", image: "team-becci.jpg" },
    { number: "[08]", name: "Michelle", post: "senior sales negotiator", city: "Scunthorpe", image: "team-michelle.jpg" },
    { number: "[09]", name: "Jackie", post: "sales negotiator & branch manager", city: "Epworth", image: "team-jackie.jpg" },
    { number: "[10]", name: "Meg", post: "branch manager", city: "Gainsborough", image: "team-meg.jpg" },
  ] satisfies Member[],
};

export const faq = {
  eyebrow: "[ FAQ ]",
  heading: "questions & answers",
  copy: "The questions we are asked most often, answered honestly. If yours isn’t here, call your local branch or write to us — we read every note.",
  cta: { label: "Get in touch", href: "/contact" },
  image: { src: asset("faq.jpg"), alt: "A Paul Fox Finest home" },
  items: [
    {
      number: "01",
      question: "how do I book a free valuation?",
      answer:
        "Use the valuation request form online or call your local branch. One of our regional valuers will visit, value your property individually and give you an honest, professional opinion — with no obligation.",
    },
    {
      number: "02",
      question: "which areas do you cover?",
      answer:
        "Scunthorpe, Brigg, Barton-upon-Humber, Epworth, Gainsborough and the surrounding villages, from five family-run offices. Our Chartered Survey Department works throughout Lincolnshire and South Yorkshire.",
    },
    {
      number: "03",
      question: "do you handle lettings and property management?",
      answer:
        "Yes. Paul Fox Lettings launched in 2001 and the team has a combined experience of over 50 years. We value your property, find excellent tenants and maintain tenancies to a superior standard, with client money protection in place.",
    },
    {
      number: "04",
      question: "what surveys do you offer?",
      answer:
        "RICS Homebuyers Reports, Condition Reports and Building Surveys, plus insurance, matrimonial, probate, inheritance tax, capital gains, council tax and leasehold extension valuations, Energy Performance Certificates and site supervision on new homes.",
    },
    {
      number: "05",
      question: "what is paul fox finest?",
      answer:
        "A bespoke, one-to-one service for period farmhouses, new-build homes, prestige properties and village houses with land. The Finest team has over 80 years’ combined experience, with accompanied viewings, a UK magazine feature page and advertising at Park Lane in London.",
    },
  ],
};

export const contact = {
  eyebrow: "[ CONTACT ]",
  heading: "we would love to talk to you",
  copy: "Whether a query over the sale of a property, or advice regarding the rental of your property, our team of friendly and professional staff are here to help you. Give us a call today to discuss your needs.",
  /**
   * Ghost Fibers settings for the backdrop — the client's fibre preset,
   * recoloured onto the site's ink palette: ink-950 base, a soft silver-blue
   * ribbon, no purple cast, so it sits with the navy footer beneath.
   */
  fibers: {
    backdropColor: "#141b34",
    lineColor: "#2a3563",
    glowColor: "#6f7fb8",
    speed: 0.21,
    scale: 2,
    rotation: 0,
    rotationSpeed: 0.25,
    layers: 4,
    waveAmplitude: 0.015,
    waveFrequency: 3,
    waveSpeed: 0.15,
    layerSpeed: 0.08,
    twist: 0.1,
    twistFrequency: 5,
    twistSpeed: 1.2,
    lineFrequency: 5,
    lineSpacing: 2,
    lineSharpness: 16,
    glowFalloff: 10,
    glowIntensity: 1.1,
    brightness: 1.4,
    blueBoost: 1.1,
    vignette: 0.85,
    grain: 0.04,
    dpr: 1,
  },
  fields: {
    name: "Name",
    email: "Email",
    phone: "Telephone",
    message: "Your message",
  },
  submit: "Send message",
  sent: "Message sent",
};

export const offices = [
  { name: "Scunthorpe", address: "29-31 Oswald Road, Scunthorpe, DN15 7PN", phone: "01724 282868", href: "/office/scunthorpe" },
  { name: "Brigg", address: "10 Market Place, Brigg, DN20 8ES", phone: "01652 651777", href: "/office/brigg" },
  { name: "Barton", address: "11 King Street, Barton-upon-Humber, DN18 5ER", phone: "01652 635000", href: "/office/barton" },
  { name: "Epworth", address: "15-17 High Street, Epworth, DN9 1EP", phone: "01427 339100", href: "/office/epworth" },
  { name: "Gainsborough", address: "Marshalls Yard, Beaumont Street, Gainsborough, DN21 2NA", phone: "01427 339200", href: "/office/gainsborough" },
  { name: "Lettings", address: "29-31 Oswald Road, Scunthorpe, DN15 7PN", phone: "01724 282868", href: "/office/lettings" },
  { name: "Commercial", address: "32 Oswald Road, Scunthorpe, DN15 7PQ", phone: "01724 870520", href: "http://www.paulfoxcommercial.co.uk/" },
];

export const footer = {
  wordmark: "paul fox",
  blurb:
    "Paul Fox Estate Agents. Specialising in property for sale in Scunthorpe, Brigg, Barton upon Humber, Bottesford, Broughton, Epworth, North Lincolnshire and surrounding areas.",
  cta: { label: "Contact us", href: "/contact" },
  columns: [
    {
      heading: "Keep in touch",
      links: social.map((s) => ({ ...s, external: true })),
    },
    {
      heading: "Quick links",
      links: [
        { label: "About us", href: "/about-us" },
        { label: "Our team", href: "/our-staff" },
        { label: "The Guild", href: "/guild-of-property-professionals" },
        { label: "Properties", href: "/search-results" },
        { label: "Selling", href: "/sell" },
        { label: "Lettings", href: "/letting-agents" },
      ],
    },
    {
      heading: "Services",
      links: [
        { label: "Surveys", href: "/rics-chartered-property-surveyors" },
        { label: "Finest", href: "/finest" },
        { label: "EPCs", href: "/epcs" },
        { label: "Mortgages", href: "/mortgage-advice" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
      ],
    },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Internal Complaints Procedure", href: "/internal-complaints-procedure" },
  ],
  copyright: `© ${new Date().getFullYear()} Paul Fox Estate Agents. All rights reserved.`,
};
