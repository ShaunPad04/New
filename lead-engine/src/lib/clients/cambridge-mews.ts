import type { ClientConfig } from "./types";

/**
 * Cambridge Mews Accommodation — BlackLine's first lead-generation client.
 *
 * BlackLine is the lead-generation partner. It does not provide the
 * accommodation, quote for it, or book it. Everything after the handoff —
 * availability, pricing, quotes, customer communication, fulfilment — is
 * Cambridge Mews' side of the arrangement. Nothing in this file may state
 * a room, a rate or an availability, because BlackLine does not hold that
 * information and must never imply that it does.
 */
export const CAMBRIDGE_MEWS: ClientConfig = {
  id: "cambridge-mews",
  name: "Cambridge Mews Accommodation",
  website: "https://www.cambridge-mews-cleethorpes.com/",
  service: "Accommodation in Cleethorpes for contractors, project teams and business travellers",
  location: { town: "Cleethorpes", region: "North East Lincolnshire", country: "United Kingdom" },
  targetAreas: [
    "Cleethorpes",
    "Grimsby",
    "Immingham",
    "Stallingborough",
    "Killingholme",
    "Humber",
    "Hull",
    "North East Lincolnshire",
    "North Lincolnshire",
    "East Yorkshire",
  ],
  targetIndustries: [
    "Construction",
    "Civil engineering",
    "Offshore wind",
    "Renewable energy",
    "Energy and utilities",
    "Industrial maintenance",
    "Manufacturing",
    "Infrastructure",
    "Ports and logistics",
    "Marine and subsea",
    "Recruitment and staffing",
  ],
  idealCustomerProfiles: [
    {
      id: "project-contractor",
      label: "Contractor running a Humber project",
      description:
        "An engineering or construction business delivering a defined piece of work at a site in the Humber area.",
      accommodationRationale:
        "Project teams on a fixed-term site rarely live locally, so the contractor usually arranges somewhere for them to stay for the length of the job.",
    },
    {
      id: "out-of-region-employer",
      label: "Employer based outside the region with work inside it",
      description:
        "A company headquartered elsewhere in the UK that has won work, a contract or an assignment in the Humber area.",
      accommodationRationale:
        "Staff sent in from another part of the country cannot commute daily, which creates a stay for the duration of the assignment.",
    },
    {
      id: "recruitment-agency",
      label: "Recruitment agency placing workers into the area",
      description:
        "An agency that repeatedly places engineers, trades or industrial workers at Humber sites.",
      accommodationRationale:
        "Agencies place workers continuously rather than once, so a single relationship can produce repeat requirements.",
    },
    {
      id: "offshore-operator",
      label: "Offshore wind or marine operator",
      description:
        "An operator or tier-one supplier with crews mobilising through Grimsby or Immingham.",
      accommodationRationale:
        "Crew rotations and mobilisation periods put people ashore near the port between offshore stints.",
    },
    {
      id: "expanding-employer",
      label: "Business opening or expanding a local site",
      description:
        "A company announcing a new facility, office or major contract in the area.",
      accommodationRationale:
        "Setting up a site brings in commissioning teams, trainers and management before local hiring is complete.",
    },
  ],
  discovery: [
    {
      sourceType: "project",
      label: "Current and announced projects",
      maxAgeDays: 120,
      queries: [
        "new construction project Immingham contract awarded",
        "offshore wind project Grimsby contractor appointed",
        "Humber infrastructure project contract awarded engineering",
        "port of Immingham development contractor",
        "North East Lincolnshire major development construction contract",
        "Humber refinery shutdown maintenance contractor",
      ],
    },
    {
      sourceType: "job",
      label: "Contract and temporary job advertisements",
      maxAgeDays: 45,
      queries: [
        "contract engineer job Immingham 6 month",
        "temporary construction jobs Grimsby contract",
        "offshore technician jobs Grimsby contract",
        "fixed term maintenance jobs Immingham",
        "project based jobs Cleethorpes contract",
        "shutdown jobs Humber contract",
      ],
    },
    {
      sourceType: "recruitment",
      label: "Recruitment agencies placing into the Humber",
      maxAgeDays: 180,
      queries: [
        "recruitment agency engineering contractors Grimsby Immingham",
        "industrial recruitment agency Humber temporary workers",
        "offshore wind recruitment agency Grimsby placements",
        "construction labour supply agency North East Lincolnshire",
      ],
    },
    {
      sourceType: "expansion",
      label: "Expansion, investment and new facilities",
      maxAgeDays: 180,
      queries: [
        "new facility Grimsby investment opening",
        "company expands Immingham new site",
        "new office Cleethorpes business expansion",
        "major contract won Humber region company",
      ],
    },
    {
      sourceType: "public_demand",
      label: "Publicly stated accommodation requirements",
      maxAgeDays: 60,
      queries: [
        "contractor accommodation required Grimsby",
        "corporate accommodation needed Cleethorpes company",
        "temporary accommodation for workers Immingham required",
        "group accommodation enquiry Humber contractors",
      ],
    },
  ],
  qualification: {
    minimumScoreForOutreach: 55,
    notifyAtScore: 75,
    maxDistanceKm: 110,
  },
  routing: {
    // Left empty on purpose: BlackLine has not recorded a named recipient at
    // Cambridge Mews, and inventing one would send a real lead nowhere.
    handoffRecipients: [],
    handoffMethod: "manual",
  },
  outreach: {
    senderName: "Bradley Hoxha",
    senderOrganisation: "BlackLine Agency",
    senderEmail: "contact@blacklineagency.co.uk",
    senderPhone: "07935364845",
    forbiddenClaims: [
      "we are Cambridge Mews",
      "we have rooms available",
      "we can offer you a rate",
      "you need accommodation",
      "we have availability",
    ],
  },
  commercial: { kind: "unconfigured" },
  verified: {
    website: true,
    commercialTerms: false,
    handoffRecipients: false,
  },
};
