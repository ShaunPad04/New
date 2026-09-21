/**
 * The domain model for the BlackLine Lead Engine.
 *
 * The central rule of this model: a claim about the outside world is either
 * VERIFIED (a source says it), an INFERENCE (we concluded it from sources and
 * labelled it as a conclusion), or UNKNOWN. There is no fourth category, and
 * an inference never silently becomes a fact.
 */

export const SOURCE_TYPES = [
  "project",
  "job",
  "recruitment",
  "expansion",
  "public_demand",
  "referral",
  "manual",
  "other",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  project: "Projects",
  job: "Job signals",
  recruitment: "Recruitment",
  expansion: "Expansion",
  public_demand: "Public demand",
  referral: "Referrals",
  manual: "Manual research",
  other: "Other",
};

/** Where a factual claim sits on the evidence ladder. */
export type EvidenceKind = "verified" | "inference" | "unknown";

export type Evidence = {
  id: string;
  kind: EvidenceKind;
  /** One factual sentence. For an inference, phrased as a conclusion ("may", "could"). */
  statement: string;
  /** Required for `verified`. An inference cites the evidence it was drawn from. */
  sourceUrl?: string;
  sourceTitle?: string;
  /** ISO date the source was published or observed. */
  observedAt?: string;
  /** For `inference`: the ids of the verified evidence it rests on. */
  derivedFrom?: string[];
};

export const PIPELINE_STATUSES = [
  "new",
  "researching",
  "qualified",
  "outreach_ready",
  "contacted",
  "responded",
  "requirement_confirmed",
  "sent_to_cambridge_mews",
  "cambridge_mews_contacted",
  "quote",
  "booked",
] as const;
export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export const CLOSED_STATUSES = [
  "lost",
  "not_qualified",
  "no_response",
  "duplicate",
  "not_suitable",
] as const;
export type ClosedStatus = (typeof CLOSED_STATUSES)[number];

export type LeadStatus = PipelineStatus | ClosedStatus;

export const TIERS = ["high_intent", "potential", "prospect", "disqualified"] as const;
export type Tier = (typeof TIERS)[number];

export type Ternary = "yes" | "no" | "unknown";

// --- Qualification inputs -------------------------------------------------
// Each input is a typed, reviewable judgement backed by evidence ids. The
// score is a pure function of these inputs; it is never an opinion handed
// back by a model.

export type AccommodationStrength =
  | "explicit_request" // someone is openly looking for accommodation
  | "travelling_workforce" // sources show workers coming in from elsewhere
  | "temporary_roles" // contract/temporary roles advertised for the area
  | "project_presence" // the organisation has work in the area
  | "none";

export type TimingHorizon =
  | "active_now"
  | "starting_soon" // within ~8 weeks
  | "announced_future"
  | "speculative"
  | "unknown";

export type DistanceBand =
  | "in_area" // Cleethorpes / Grimsby
  | "humber" // Immingham, Hull, wider Humber
  | "wider_region" // Lincolnshire, East Yorkshire
  | "outside"
  | "unknown";

export type Basis = "stated" | "derived" | "unknown";

export type QualificationInputs = {
  accommodation: { strength: AccommodationStrength; evidenceIds: string[] };
  timing: { horizon: TimingHorizon; startsOn?: string; evidenceIds: string[] };
  groupSize: { min?: number; max?: number; basis: Basis; evidenceIds: string[] };
  duration: { weeks?: number; basis: Basis; recurring: Ternary; recurringReason?: string; evidenceIds: string[] };
  geography: { band: DistanceBand; workLocation?: string; evidenceIds: string[] };
  contactability: {
    namedContact: boolean;
    role: boolean;
    email: boolean;
    phone: boolean;
    genericChannel: boolean;
    evidenceIds: string[];
  };
};

export type ScoreComponent = {
  key: keyof QualificationInputs;
  label: string;
  points: number;
  max: number;
  /** Plain-English reason a reviewer can check against the evidence. */
  reason: string;
};

export type LeadScore = {
  total: number;
  max: number;
  rubricVersion: string;
  components: ScoreComponent[];
};

export type Company = {
  name: string;
  website?: string;
  industry?: string;
  location?: string;
  /** Set when the company is based outside the region but works in it. */
  basedOutsideRegion?: boolean;
};

export type Contact = {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  profileUrl?: string;
  /** Where each detail came from — contact data is never invented. */
  sourceUrl?: string;
};

export type Opportunity = {
  projectName?: string;
  projectLocation?: string;
  projectType?: string;
  startsOn?: string;
  endsOn?: string;
  summary: string;
};

export type OutreachDraft = {
  channel: "email" | "linkedin" | "phone" | "follow_up";
  subject?: string;
  body: string;
  generatedAt: string;
  /** "template" when written from the deterministic template, "ai" when drafted by a model. */
  generator: "template" | "ai";
  edited?: boolean;
};

export type Booking = {
  value?: number;
  currency: string;
  nights?: number;
  guests?: number;
  bookedOn?: string;
};

export type Lead = {
  id: string;
  clientId: string;
  sourceType: SourceType;
  /** Stable hash of company + project, used to detect duplicates. */
  dedupeKey: string;
  company: Company;
  contact: Contact;
  opportunity: Opportunity;
  signalSummary: string;
  evidence: Evidence[];
  qualification: QualificationInputs;
  score: LeadScore;
  tier: Tier;
  status: LeadStatus;
  approval: "pending" | "approved" | "rejected";
  outreach: OutreachDraft[];
  notes?: string;
  handoffSentAt?: string;
  handoffPack?: unknown;
  booking?: Booking;
  discoveredAt: string;
  updatedAt: string;
  nextFollowUpOn?: string;
  /** Free-form audit trail. Every status change appends an entry. */
  history: { at: string; actor: string; event: string; detail?: string }[];
};

export type LeadSummary = Pick<
  Lead,
  "id" | "company" | "opportunity" | "score" | "tier" | "status" | "sourceType" | "discoveredAt" | "updatedAt" | "approval"
>;
