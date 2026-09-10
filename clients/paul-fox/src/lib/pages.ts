/**
 * Copy for the inner pages. Every fact is taken from the matching page on
 * paul-fox.com (September 2026). Headings are lower-cased to match the
 * Marby type treatment; the wording is the agency's own.
 */

export type Office = {
  slug: string;
  name: string;
  title: string;
  intro: string;
  address: string[];
  email: string;
  phone: string;
  image: string;
  /** Staff slugs in the order the live page lists them. */
  team: string[];
  review?: { quote: string; about: string };
  extra?: string[];
};

const COMMON = [
  "Established in 1990 by Mr Paul Fox, Paul Fox Estate Agents now boasts five family run offices.",
  "Every office is underpinned by family values and a wealth of knowledge and expertise in buying, selling, renting and surveying properties.",
  "With expert valuers, surveyors and personal account handlers you can be sure that your property needs will be in safe hands.",
];

export const officePages: Office[] = [
  {
    slug: "scunthorpe",
    name: "Scunthorpe",
    title: "our office in scunthorpe",
    intro:
      "Paul Fox Estate Agents are the leading Estate Agents in Scunthorpe and the surrounding towns and villages like Bottesford, Messingham and Winterton.",
    address: ["29-31 Oswald Road", "Scunthorpe", "North Lincolnshire", "DN15 7PN"],
    email: "scunthorpe@paul-fox.com",
    phone: "01724 282868",
    image: "2017/07/Scunthorpe-branch-e1648740585142.jpg",
    team: ["paul", "liam", "ryan", "hannah", "ben", "michelle", "becka", "taylor", "sorelle", "karen-graham", "theresa", "scott", "malcolm", "katrina", "amelia"],
    review: {
      quote:
        "Where do I start? Paul Fox Estate Agents will definitely be my first choice if I am ever move house again. I recently completed the purchase of a property they were marketing, and from start to finish, I genuinely couldn’t fault the service. Taylor led the process and was outstanding throughout — friendly, professional, and incredibly responsive. She kept everything on track and played a key role in ensuring exchange and completion happened promptly. Based on this experience, I’ve already recommended Paul Fox to others and wouldn’t hesitate to use them again.",
      about: "Google review, Scunthorpe office",
    },
  },
  {
    slug: "brigg",
    name: "Brigg",
    title: "our office in brigg",
    intro: "Paul Fox Estate Agents are the leading Estate Agents in Brigg.",
    address: ["10 Market Place", "Brigg", "North Lincolnshire", "DN20 8ES"],
    email: "brigg@paul-fox.com",
    phone: "01652 651777",
    image: "2017/07/paul-fox-brigg-office.jpg",
    team: ["ryan", "richard", "becky", "jo", "neve"],
    review: {
      quote:
        "This summer, my partner and I purchased our first home, and we had a great experience with Paul Fox. Jo in particular handled our purchase flawlessly, as did the entire staff. As first-time buyers, we were somewhat nervous, so they made us feel at ease by arranging several viewings. From beginning to end, Paul Fox Estate Agents provided excellent communication, and we are delighted to heartily recommend them.",
      about: "Google review, Brigg office",
    },
  },
  {
    slug: "barton",
    name: "Barton",
    title: "our office in barton-upon-humber",
    intro: "Paul Fox Estate Agents are the leading Estate Agents in Barton.",
    address: ["11 King Street", "Barton-upon-Humber", "North Lincolnshire", "DN18 5ER"],
    email: "barton@paul-fox.com",
    phone: "01652 635000",
    image: "2017/07/Humber-Bridge-5-scaled.jpg",
    team: ["ryan", "richard", "zoe", "sarah"],
    review: {
      quote:
        "Sale negotiator Zoe based in Barton Upon Humber branch is absolutely fantastic. I’ve experienced an efficient and professional service so far. Zoe has consistently gone above and beyond to reassure myself of any sale movements, and overcome many barriers. Thank you!",
      about: "Google review, Barton office",
    },
  },
  {
    slug: "epworth",
    name: "Epworth",
    title: "our office in epworth",
    intro: "Paul Fox Estate Agents are the leading Estate Agents in Epworth.",
    address: ["15-17 High Street", "Epworth", "North Lincolnshire", "DN9 1EP"],
    email: "epworth@paul-fox.com",
    phone: "01427 339100",
    image: "2017/07/epwortth-paul-fox.jpg",
    team: ["ryan", "jackie", "sarah-rodgers", "lyndsay"],
    review: { quote: "Highly satisfied. Great service and very professional.", about: "Google review, Epworth office" },
  },
  {
    slug: "gainsborough",
    name: "Gainsborough",
    title: "our office in gainsborough",
    intro: "Paul Fox Estate Agents are the leading Estate Agents in Gainsborough.",
    address: ["Marshalls Yard", "Beaumont Street", "Gainsborough", "Lincolnshire", "DN21 2NA"],
    email: "gainsborough@paul-fox.com",
    phone: "01427 339200",
    image: "2021/09/DSC7276-sky1.jpg",
    team: ["megan", "millie", "sharna", "ben", "ryan"],
    review: {
      quote:
        "It’s been an absolute pleasure working with the team at Paul Fox. We’ve been collaborating closely to help find a property for our seller to purchase, and their patience, understanding, and professionalism throughout the process have been outstanding. A special thanks to Megan for going above and beyond — she’s been fantastic to work with!",
      about: "Google review, Gainsborough office",
    },
  },
  {
    slug: "lettings",
    name: "Lettings",
    title: "our lettings department",
    intro: "Paul Fox Estate Agents are the leading Letting Agents in Scunthorpe and North Lincolnshire.",
    address: ["29-31 Oswald Road", "Scunthorpe", "North Lincolnshire", "DN15 7PN"],
    email: "lettings@paul-fox.com",
    phone: "01724 282868",
    image: "2017/07/Scunthorpe-branch-e1648740585142.jpg",
    team: ["hannah", "amanda", "laura", "heather", "sorelle"],
    extra: [
      "With a combined experience of over 50 years in the Property and Letting industry we can offer our clients the best quality of service. From managing a portfolio for a Landlord to tenant finding you can be assured that we’ve got your property interests covered.",
      "If you are looking to rent your property in the North Lincolnshire area without the hassle, Paul Fox Estate Agents are your perfect partner in providing an unrivalled lettings service.",
    ],
  },
];

export const officeCommon = COMMON;

export function getOffice(slug: string): Office | undefined {
  return officePages.find((o) => o.slug === slug);
}

/* ---------------- About ---------------- */

export const aboutPage = {
  eyebrow: "[ ABOUT US ]",
  title: "the family estate agents",
  lede:
    "Paul Fox Estate Agents have been successfully serving Scunthorpe and the surrounding villages for over 35 years. We strive to go above and beyond expectations for all our clients and with dedicated offices in Scunthorpe, Brigg, Barton, Epworth and Gainsborough it’s easy to see why we are the most trusted estate agent in North Lincolnshire & surrounding areas.",
  image: "2022/04/Paul-liam-Ryan-1.jpg",
  imageAlt: "Paul, Liam and Ryan Fox",
  paragraphs: [
    "Paul Fox Estate Agents is a Local Independent Estate Agent established in 1990 by Mr Paul Fox, being born and raised in the area of Scunthorpe and being fully qualified Chartered Surveyor by 1985. With a great understanding, wealth of knowledge, and experience of the North Lincolnshire area and the property industry Paul Fox Estate Agents now boasts five family run offices.",
    "At all five branches we have strong competitive experienced teams who all understand the challenges faced in the property industry. We all embrace change and are constantly challenging tradition because we have a strong desire to improve the way our Industry operates. We do business differently to give you the edge.",
    "All our staff are fully trained in all aspects of the property transaction in order to keep a high level of customer service at all times, from the initial point of instruction to handing over the keys to the new buyer. Our success in selling the high volume of homes can be attributed to the quality of staff and the highest level of marketing that can be individually tailored to suit both your home and requirements.",
    "All our offices are computer linked using state of the art, industry leading software which provides full marketing of all properties and buying services, this together with our forward thinking and proactive approach ensures all our clients received the highest level of service they deserve.",
    "Not only can we ensure that the right buyer or tenant is found for your property and finding your dream home, but at Paul Fox we can help with you entire transaction, from start to finish, with access to a range of surveying, conveyance and financial services in house.",
  ],
  statement: "Our intention is simple: to provide a service that is second to none, whether you are buying, selling or renting.",
  family: ["paul", "ryan", "liam", "hannah"],
  timeline: [
    { year: "1983", text: "Paul Fox passes his RICS examinations and becomes an Assistant Valuer and Surveyor in Scunthorpe." },
    { year: "1991", text: "Paul opens his own estate agency on Oswald Road, Scunthorpe." },
    { year: "1997", text: "The Brigg office opens on Market Place." },
    { year: "1999", text: "Barton-upon-Humber and the Commercial department follow." },
    { year: "2001", text: "Paul Fox Lettings launches, covering North Lincolnshire and Lincolnshire." },
    { year: "2017", text: "Epworth opens on the High Street." },
    { year: "2021", text: "Gainsborough opens at Marshalls Yard — the fifth family-run office." },
  ],
};

/* ---------------- Team ---------------- */

export const staffPage = {
  eyebrow: "[ OUR TEAM ]",
  title: "meet the team",
  copy:
    "Without our constantly evolving and expanding team, Paul Fox Estate Agents wouldn’t be who we are today. Through their hard work and dedication, they have made Paul Fox the most trusted estate agent in the area. Choose an office to see who you’ll be dealing with.",
  filters: [
    { label: "Everyone", tag: "" },
    { label: "Scunthorpe", tag: "scunthorpe" },
    { label: "Brigg", tag: "brigg" },
    { label: "Barton", tag: "barton" },
    { label: "Epworth", tag: "epworth" },
    { label: "Gainsborough", tag: "gainsborough" },
    { label: "Lettings", tag: "lettings" },
    { label: "Surveys", tag: "surveys" },
  ],
};

/* ---------------- Selling & valuation ---------------- */

export const sellPage = {
  eyebrow: "[ SELLING ]",
  title: "the leading local family estate agents, helping people move for over 35 years",
  image: "2026/03/PFA230788_16.jpg",
  copy: [
    "From an accurate, no-obligation valuation to handing over the keys, your sale is handled by people who live in and love the local area. Marketing is individually tailored to suit both your home and your requirements, and every office is computer linked so all five branches are selling your property from day one.",
    "As the only local estate agents recommended by The Guild of Property Professionals, your home is also promoted 24/7 on the touchscreens at Park Lane, London, and to a nationwide network of independent agents.",
  ],
  steps: [
    { number: "01", title: "free valuation", text: "One of our regional valuers visits, values your property individually and gives you an honest, professional opinion of price and target market — with no obligation." },
    { number: "02", title: "tailored marketing", text: "Professional photography, our distinctive For Sale board, Rightmove, paul-fox.com, all five offices and The Guild network. Finest homes add a UK magazine feature page and Park Lane." },
    { number: "03", title: "accompanied viewings", text: "Fully trained negotiators accompany viewings, feed back promptly and keep you updated on applicant enquiries and levels of interest." },
    { number: "04", title: "sale progression", text: "From offer to exchange and completion, one team liaises with solicitors and the other side to keep everything on track — right up to handing over the keys." },
  ],
  cta: { label: "Book a free valuation", href: "/valuation-request" },
  finest: { label: "Paul Fox Finest", href: "/finest" },
  conveyancing: { label: "Premium Conveyancing", href: "/blog/conveyancing" },
};

export const valuationPage = {
  eyebrow: "[ VALUATION REQUEST ]",
  title: "book a free valuation",
  copy:
    "Tell us a little about your property and one of our regional valuers will be in touch to arrange a visit. Valuations are free, individual and carry no obligation — whether you are selling or letting.",
  image: "2025/08/PFB250140_34.jpg",
};

/* ---------------- Lettings ---------------- */

export const lettingsPage = {
  eyebrow: "[ LETTINGS ]",
  title: "north lincolnshire’s leading letting agents",
  image: "2017/09/MBP_0020web.jpg",
  lede: "Your lettings partner.",
  copy: [
    "Paul Fox are Letting Agents with a combined experience of over 50 years in the property and letting industry. We offer our clients the best quality of service. If you are looking to rent your property in the North Lincolnshire area without the hassle, Paul Fox are your perfect partner in providing an unrivalled lettings service.",
    "If you’re letting a home in Scunthorpe, Brigg, Barton, Epworth, Gainsborough or the surrounding villages our trusted team will guide you through the process.",
    "We will use our expert local knowledge to ensure you have the insight to make an informed decision. Every office is underpinned by our family values — that’s what makes us the leading, family-owned estate agent in Scunthorpe and Northern Lincolnshire. Whether you’re buying, selling or renting we’re with you every step of the way.",
  ],
  cmp: "Paul Fox Lettings holds Client Money Protection through CM Protect.",
  team: ["hannah", "heather", "sorelle", "amanda", "laura"],
  ctas: [
    { label: "Let my property", href: "/valuation-request" },
    { label: "Search rental properties", href: "/search-results?department=residential-lettings" },
    { label: "View our lettings fees", href: "/letting-agents/lettings-fees" },
  ],
};

export type FeePackage = {
  title: string;
  price: string;
  note?: string;
  intro?: string;
  items: string[];
};

export const feesPage = {
  eyebrow: "[ LETTINGS FEES ]",
  title: "letting fees",
  copy: "Our landlord fees in full. All prices are shown exclusive and inclusive of VAT at 20%.",
  packages: [
    {
      title: "superior manage set-up package",
      price: "£300 + VAT (£360 inc. VAT)",
      note: "Not available on a tenant find.",
      intro: "Our superior services include:",
      items: [
        "Advising as to a rental value and market conditions.",
        "Marketing through our offices and the websites — www.paul-fox.com and www.rightmove.co.uk.",
        "Dedicated office-based Lettings Team.",
        "Provision of our distinctive “To Let” board.",
        "Accompanied viewings.",
        "Updating you on applicant enquiries and levels of interest.",
        "Finding a suitable tenant.",
        "Full enhanced referencing.",
        "Taking references and liaising with you throughout, including Right to Rent reference.",
        "Informing the council and utilities of new tenants and tenants vacating.",
        "Help from our Legal Team to remove your tenant if they fail to pay their rent in the first 12 months.",
        "Experienced Legal and Claims team to manage the complex eviction process.",
        "Issuing the relevant notices seeking possession.",
        "Full advice and guidance regarding the Renters’ Rights Act.",
      ],
    },
    {
      title: "fully managed service",
      price: "10% + VAT of rent collected each month",
      items: [
        "Comprehensive Schedule of Condition Report complete with dated photographs.",
        "Preparing the Assured Periodic Tenancy Agreement and obtaining signatures.",
        "Collecting the rents and accounting to clients on a monthly basis.",
        "Periodic inspections and reporting back to the client.",
        "Organising estimates and repairs on behalf of the landlord, with prior consent.",
        "Annual rent reviews.",
        "End of Tenancy Report complete with dated photographs.",
        "Full advice and guidance regarding the Renters’ Rights Act.",
        "Protect your investment with our Rent & Legal Protection insurance from £30 + VAT per property per month.",
      ],
    },
    {
      title: "tenant find only service",
      price: "One month’s rent + VAT",
      note: "A one-off fee. This fee is applicable should you let through another agent or find your own tenant whilst we are actively marketing your property.",
      intro: "Our tenant find only service includes:",
      items: [
        "Advising as to a rental value and market conditions.",
        "Website advertising on www.rightmove.co.uk and www.paul-fox.com.",
        "Provision of our distinctive “To Let” board.",
        "Marketing through our standalone Lettings Office.",
        "Dedicated Lettings Team.",
        "Updating you on applicant enquiries and levels of interest.",
        "Accompanied viewings.",
        "Finding a suitable tenant.",
        "Full enhanced referencing.",
        "Taking references and liaising with you throughout, including a Right to Rent reference.",
        "Collect first month’s rent and pay to you, the landlord, with full statement.",
        "Preparing the Assured Periodic Tenancy Agreement and obtaining signatures.",
        "Full advice and guidance regarding Let Only landlords’ undertakings under the Renters’ Rights Act.",
      ],
    },
  ] satisfies FeePackage[],
  additional: {
    title: "additional services (if required)",
    items: [
      { label: "Holding the bond under a Government-recognised deposit scheme (My Deposits)", price: "£58.33 + VAT (£70 inc. VAT)" },
      { label: "Energy Performance Certificate", price: "£100 + VAT (£120 inc. VAT)" },
      { label: "Schedule of condition report with dated photographs — 1 to 3 bedrooms", price: "£150 + VAT (£180 inc. VAT)" },
      { label: "Schedule of condition report with dated photographs — 4+ bedrooms", price: "£200 + VAT (£240 inc. VAT)" },
      { label: "Property inspection and report", price: "£100 + VAT (£120 inc. VAT)" },
      { label: "End of Tenancy Report with dated photographs", price: "£200 + VAT (£240 inc. VAT)" },
      { label: "Issuing relevant notices", price: "£100 + VAT (£120 inc. VAT)" },
    ],
  },
};

/* ---------------- Surveys ---------------- */

export const surveysPage = {
  eyebrow: "[ SURVEYS ]",
  title: "chartered property surveyors",
  image: "2026/03/PFE250159_29.jpg",
  copy: [
    "Paul Fox are one of the leading Estate Agents and Surveyors in the Northern Lincolnshire area. We have an experienced Chartered Survey Department who carry out surveys throughout Lincolnshire and South Yorkshire.",
    "Paul Fox has over 35 years experience and carries out such work for private individuals, companies, major banks and building societies and numerous other lending institutions. From RICS Homebuyers Reports to EPC’s, we offer a comprehensive solution for whatever property survey you may require.",
    "We are also members of Allied Surveyors and Valuers Ltd — a general practice cooperative, owned by its 30 shareholding Chartered Surveyors, covering England and Wales.",
    "Our Chartered Surveyors are experts in the field of Survey and Valuation work with experience in assessing all property types from modern homes to historic buildings. Our team of Surveyors have worked for many years in their geographical areas to live up to the mantra of offering ‘national coverage with local knowledge’.",
  ],
  contact: { phone: "01724 282868", email: "admin@paul-fox.com" },
  team: ["liam", "paul", "scott", "katrina"],
  quote: {
    text: "We have become accustomed to carrying out surveys and valuation work for a variety of clients on a wide range of properties. At Paul Fox Estate Agents we always go the extra mile to help our clients.",
    name: "Liam Fox",
    role: "Chartered Valuation Surveyor",
  },
};

/* ---------------- Finest ---------------- */

export const finestPage = {
  eyebrow: "[ PAUL FOX FINEST ]",
  title: "the bespoke service tailored to your individual needs",
  image: "2017/10/finest-header-2.jpg",
  logo: "2017/10/Paul-Fox-Finest-Logo-Grey-White-October-17-04.png",
  copy: [
    "Our Paul Fox Finest team have over 80 years combined experience in the property industry.",
    "As specialist estate agents, we achieve successful sales for our clients who own a wide range of property types including period farmhouses, bespoke new build properties, prestige homes and village properties with land.",
    "Paul Fox Finest offers you an in-depth property valuation and an analysis of the local market and house prices, ascertaining your property’s value and target market.",
    "Your personalised marketing package will be tailored to suit your individual needs to provide you with a full Professional Estate Agency service — the “Finest” touch. Following our appraisal The Finest Team will work closely with you to maximise our first class marketing expertise and ensure that your property is seen by those actively looking to acquire a home like yours.",
  ],
  services: [
    { number: "[ 01 ]", title: "advertised at park lane, london", text: "Your home is accessible 24/7 on the touchscreens at The Guild’s associated office in Park Lane." },
    { number: "[ 02 ]", title: "local advertising at all branches", text: "Window displays and marketing across Scunthorpe, Brigg, Barton, Epworth and Gainsborough." },
    { number: "[ 03 ]", title: "accompanied viewings", text: "Every viewing is accompanied by a member of the Finest team." },
    { number: "[ 04 ]", title: "uk magazine feature page", text: "A dedicated feature page in a nationally distributed property magazine." },
    { number: "[ 05 ]", title: "one to one service", text: "A single point of contact from appraisal to completion." },
  ],
  team: ["paul", "ryan", "becky"],
  video: "https://www.youtube-nocookie.com/embed/-pP7wYUuWy4?rel=0",
};

/* ---------------- EPCs ---------------- */

export const epcPage = {
  eyebrow: "[ EPCS ]",
  title: "your local energy assessor",
  image: "2023/08/headerepcassessor.jpg",
  lede:
    "Paul Fox are one of the leading Estate Agents in the North Lincolnshire area. Our experienced, independent Energy Assessor can carry out Energy Performance Certificates at a competitive fee across Lincolnshire and South Yorkshire. To request an EPC, contact your local branch today!",
  sections: [
    {
      title: "what is an EPC?",
      text: "An EPC is a legal requirement when selling or renting a property. The document provides an overview of the energy efficiency of a property and is created by assessing the construction of the building, the type of dwelling and all of its energy features. The assessor will look at your boiler, insulation and any renewable energy sources.",
    },
    {
      title: "how to prepare for an EPC",
      text: "Our assessor carrying out your EPC will require evidence and documentation for any works or improvements on your home, such as extensions or installations. Wherever possible please make sure these are available during their visit or let the assessor know before the appointment. Types of documents may include invoices and certificates for loft insulation, proof of cavity wall insulation, loft conversions or extensions and solar panels. If you are unable to provide documentation or access, this may have a negative effect on the overall rating.",
    },
    {
      title: "what happens during an EPC?",
      text: "The EPC assessor will need to be able to access all areas of the property, access must be clear. They’ll need to get to the fuel supply to read electric and gas meters; the loft space to view insulation, the boiler, heating controls and hot water cylinder. They will also access exterior doors and windows — so make sure keys are available as they will be opened and closed.",
    },
  ],
  fee: "Energy Performance Certificate — £100 + VAT (£120 inc. VAT).",
  team: ["liam", "paul", "scott", "katrina"],
};

/* ---------------- Mortgage advice ---------------- */

export const mortgagePage = {
  eyebrow: "[ MORTGAGE ADVICE ]",
  title: "mortgage advice from riach financial ltd",
  image: "2017/09/Screen-Shot-2017-09-15-at-13.38.04.png",
  lede: "Get the mortgage advice you need to secure your dream property.",
  copy: [
    "Paul Fox Estate Agents work with Riach Financial Ltd to provide the opportunity for their clients, and non clients, to receive expert mortgage and protection advice. The advice offered by Riach Financial Ltd, combined with the volume of mortgages that they arrange, places them in a very strong position to ensure that their customers have access to the latest deals available and receive first-class service.",
    "Riach Financial Ltd will take care of everything, from explaining all of your options and helping you select the right mortgage, to choosing the most suitable protection for you and your family and handling the whole application process.",
    "If you would like a representative of Riach Financial Ltd to contact you please complete the form below for more information.",
  ],
  smallPrint: [
    "Please note: You do not need to be a customer of Paul Fox Estate Agents to be referred to Riach Financial Ltd. You can receive financial advice from them irrespective of whether you are buying or selling a property from/with us. If you are buying, or selling, a property marketed by Paul Fox Estate Agents you have complete freedom to use the mortgage advisor/provider of your choice. Choosing another mortgage advisor/provider will have no bearing, or reflection, on any offers made for properties marketed by Paul Fox Estate Agents.",
    "Riach Financial Ltd and Paul Fox Estate Agents are two different entities. Paul Fox Estate Agents act as an ‘introducer’ for Riach Financial Ltd. Paul Fox Estate Agents may receive a commission if you decide to take out a mortgage or protection product with Riach Financial Ltd following an ‘introduction’. Your home may be repossessed if you do not keep up repayments on your mortgage. There may be a fee for mortgage advice. The actual amount you pay will depend upon your circumstances. A typical fee is £250.",
  ],
  consent:
    "By clicking “Contact mortgage team” you agree for Paul Fox Estate Agents and Riach Financial Ltd to use your personal data to contact you in order to discuss your mortgage and protection needs. Full details on how we process your personal data and your rights as a data subject can be found in our privacy policy.",
};

/* ---------------- Careers ---------------- */

export const careersPage = {
  eyebrow: "[ CAREERS ]",
  title: "looking for an exciting career in property?",
  image: "2024/03/DSC7300-2-Sky1-scaled.jpg",
  status: "Unfortunately we do not currently have any vacancies.",
  copy:
    "If you are interested in working for us we would be happy to accept your details. Please forward a covering letter and your CV to our Scunthorpe office, 29-31 Oswald Road, Scunthorpe, DN15 7PN or via email.",
  email: "admin@paul-fox.com",
};

/* ---------------- Contact ---------------- */

export const contactPage = {
  eyebrow: "[ CONTACT ]",
  title: "we would love to talk to you",
  copy:
    "We would love to talk to you and discuss your requirements. Whether a query over the sale of a property, or advice regarding the rental of your property, our team of friendly & professional staff are here to help you. Our knowledge and expertise stands us apart from other agents in the local area so give us a call today to discuss your needs.",
  image: "2017/09/MBP_0020web.jpg",
  offices: [
    { name: "Scunthorpe", lines: ["29-31 Oswald Road", "Scunthorpe", "Lincolnshire", "DN15 7PN"], phone: "01724 282868", href: "/office/scunthorpe" },
    { name: "Brigg", lines: ["10 Market Place", "Brigg", "Lincolnshire", "DN20 8ES"], phone: "01652 651777", href: "/office/brigg" },
    { name: "Barton", lines: ["11 King Street", "Barton-upon-Humber", "North Lincolnshire", "DN18 5ER"], phone: "01652 635000", href: "/office/barton" },
    { name: "Epworth", lines: ["15-17 High Street", "Epworth", "Lincolnshire", "DN9 1EP"], phone: "01427 339100", href: "/office/epworth" },
    { name: "Gainsborough", lines: ["Marshalls Yard", "Beaumont Street", "Gainsborough", "DN21 2NA"], phone: "01427 339200", href: "/office/gainsborough" },
    { name: "Lettings", lines: ["29-31 Oswald Road", "Scunthorpe", "Lincolnshire", "DN15 7PN"], phone: "01724 282868", href: "/office/lettings" },
    { name: "Commercial", lines: ["32 Oswald Road", "Scunthorpe", "Lincolnshire", "DN15 7PQ"], phone: "01724 870520", href: "http://www.paulfoxcommercial.co.uk/" },
    { name: "Surveys", lines: ["29-31 Oswald Road", "Scunthorpe", "Lincolnshire", "DN15 7PN"], phone: "01724 282868", href: "/rics-chartered-property-surveyors" },
  ],
};

/* ---------------- The Guild ---------------- */

export const guildPage = {
  eyebrow: "[ THE GUILD ]",
  title: "proud members of the guild of property professionals, the uk’s premium estate agency network",
  logo: "2025/06/TheGuild_Logo_RGB.png",
  lede: "How does our Guild membership benefit you?",
  intro:
    "The Guild is a UK-wide network of independent estate and letting agents working together to raise and maintain property industry standards and help buyers and sellers move with confidence.",
  link: { label: "guildproperty.co.uk", href: "https://www.guildproperty.co.uk/" },
  benefits: [
    {
      icon: "2025/06/Exclusive-Member-Icon.png",
      title: "we are the exclusive guild member in this area",
      text: "We have been exclusively chosen as The Guild representative in this area thanks to our dedication and expertise in the local property market. As such, we stand apart from other local agents.",
    },
    {
      icon: "2025/06/Local-Regional-National-Network-Icon.png",
      title: "local, regional and national connected network",
      text: "When you sell with us, we can promote your property far and wide thanks to our nationwide connections. What’s more, if you’re looking to move out of your area, we can refer you to the Guild Member in your dream destination.",
    },
    {
      icon: "2025/06/London-Connection-Icon.png",
      title: "our london connection",
      text: "Our connection to the capital allows us to promote your property to the lucrative London market, as well as within our local market. When you choose us as your agent, your property is accessible 24/7 on the touchscreens in Park Lane, London.",
    },
    {
      icon: "2025/06/Trained-Trusted-Professional-Service-Icon.png",
      title: "trained, trusted and professional service",
      text: "Being part of The Guild means our teams have access to the Associate training scheme, so the service that you receive is consistently professional and detailed.",
    },
    {
      icon: "2025/06/Moving-with-The-Guild-Icon.png",
      title: "the benefits of moving with the guild",
      text: "Discover the full benefits of our Guild Membership when it comes to your move. From increased exposure for your property to trustworthy training, your local Guild Member can really improve your move!",
    },
  ],
};

/* ---------------- Blog ---------------- */

export const blogPage = {
  eyebrow: "[ BLOG ]",
  title: "news & advice",
  copy: "Selling tips, lettings law and what the family has been up to — written by the team across our five offices.",
};

/* ---------------- Not found ---------------- */

export const notFoundPage = {
  eyebrow: "[ 404 ]",
  title: "this page has moved on",
  copy: "The address you followed doesn’t exist on this site. It may have been an old listing that has since sold or let. Try a search, or head back to the homepage.",
};
