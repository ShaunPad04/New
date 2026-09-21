import Anthropic from "@anthropic-ai/sdk";
import { requireAnthropic } from "../env";
import { bandForLocation } from "../domain/geo";
import { newId } from "../domain/ids";
import type { ClientConfig } from "../clients/types";
import type {
  AccommodationStrength,
  Basis,
  Evidence,
  QualificationInputs,
  SourceType,
  Ternary,
  TimingHorizon,
} from "../domain/types";

export type AnalysisInput = {
  client: ClientConfig;
  sourceType: SourceType;
  url: string;
  title?: string;
  text: string;
  /** ISO date the source was published, when the search provider reported one. */
  publishedAt?: string;
};

export type Analysis = {
  relevant: boolean;
  /** Why it was kept or dropped — recorded on the run so decisions are auditable. */
  verdict: string;
  company: { name: string; website?: string; industry?: string; location?: string; basedOutsideRegion: boolean };
  contact: { name?: string; role?: string; email?: string; phone?: string; profileUrl?: string };
  opportunity: {
    projectName?: string;
    projectLocation?: string;
    projectType?: string;
    startsOn?: string;
    endsOn?: string;
    summary: string;
  };
  signalSummary: string;
  evidence: Evidence[];
  qualification: QualificationInputs;
};

export type AnalysisOutcome =
  | { ok: true; analysis: Analysis }
  | { ok: false; reason: string };

/**
 * The shape the model must fill in. `strict: true` guarantees the arguments
 * validate against it, so the code below parses rather than pattern-matches.
 *
 * Note what the model is NOT asked for: it never returns a score, a tier, a
 * distance band or a contactability rating. Those are computed here from the
 * facts it extracted, so the number on the screen is reproducible.
 */
const FINDINGS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    relevant: {
      type: "boolean",
      description: "True only if this source identifies a real organisation with work, hiring or a stated requirement that could plausibly bring people into the target area.",
    },
    verdict: { type: "string", description: "One sentence explaining the relevance decision." },
    company_name: { type: ["string", "null"], description: "The organisation named in the source. Null if no organisation is named." },
    company_website: { type: ["string", "null"], description: "Only if the source shows it. Never guessed from the company name." },
    company_industry: { type: ["string", "null"] },
    company_location: { type: ["string", "null"], description: "Where the organisation itself is based, if the source says." },
    company_based_outside_region: {
      type: ["boolean", "null"],
      description: "True if the source shows the organisation is based outside the Humber/Lincolnshire area but has work inside it.",
    },
    contact_name: { type: ["string", "null"], description: "Only a business contact published in this source. Never inferred, never constructed from a name." },
    contact_role: { type: ["string", "null"] },
    contact_email: { type: ["string", "null"], description: "Only an address that literally appears in the source text." },
    contact_phone: { type: ["string", "null"], description: "Only a number that literally appears in the source text." },
    contact_profile_url: { type: ["string", "null"] },
    project_name: { type: ["string", "null"] },
    project_location: { type: ["string", "null"], description: "Where the work takes place, as named in the source." },
    project_type: { type: ["string", "null"] },
    project_starts_on: { type: ["string", "null"], description: "ISO date (YYYY-MM-DD) only if the source states or dates it. Otherwise null." },
    project_ends_on: { type: ["string", "null"] },
    opportunity_summary: { type: "string", description: "Two sentences on what the organisation is doing and where." },
    signal_summary: { type: "string", description: "One sentence on what in this source suggests people may need somewhere to stay." },
    verified_evidence: {
      type: "array",
      description: "Facts the source states. Each must be checkable against the quote.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          statement: { type: "string", description: "The fact, in one sentence." },
          quote: { type: "string", description: "The exact wording from the source that supports it." },
        },
        required: ["statement", "quote"],
      },
    },
    inferences: {
      type: "array",
      description: "Conclusions drawn from the verified facts. Must be phrased as possibilities (may, could, suggests), never as facts.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          statement: { type: "string" },
          based_on: { type: "string", description: "Which verified facts this rests on." },
        },
        required: ["statement", "based_on"],
      },
    },
    unknowns: {
      type: "array",
      description: "Things that matter to an accommodation requirement but the source does not establish.",
      items: { type: "string" },
    },
    accommodation_strength: {
      type: "string",
      enum: ["explicit_request", "travelling_workforce", "temporary_roles", "project_presence", "none"],
      description: "explicit_request: someone is openly seeking accommodation. travelling_workforce: the source shows people coming in from elsewhere. temporary_roles: contract/temporary roles advertised at a site in the area. project_presence: work in the area with no workforce signal. none: no signal.",
    },
    accommodation_evidence_index: {
      type: "array",
      description: "The 0-based positions in verified_evidence that support the accommodation strength. Empty if nothing supports it.",
      items: { type: "integer" },
    },
    timing_horizon: {
      type: "string",
      enum: ["active_now", "starting_soon", "announced_future", "speculative", "unknown"],
    },
    timing_evidence_index: { type: "array", items: { type: "integer" } },
    group_size_min: { type: ["integer", "null"] },
    group_size_max: { type: ["integer", "null"] },
    group_size_basis: { type: "string", enum: ["stated", "derived", "unknown"], description: "stated: the source gives a number of people. derived: counted from roles advertised. unknown: no basis." },
    group_size_evidence_index: { type: "array", items: { type: "integer" } },
    duration_weeks: { type: ["integer", "null"] },
    duration_basis: { type: "string", enum: ["stated", "derived", "unknown"] },
    duration_evidence_index: { type: "array", items: { type: "integer" } },
    recurring: { type: "string", enum: ["yes", "no", "unknown"] },
    recurring_reason: { type: ["string", "null"] },
    work_location: { type: ["string", "null"], description: "The place name where the work happens, as written in the source." },
    location_evidence_index: { type: "array", items: { type: "integer" } },
  },
  required: [
    "relevant", "verdict", "company_name", "company_website", "company_industry", "company_location",
    "company_based_outside_region", "contact_name", "contact_role", "contact_email", "contact_phone",
    "contact_profile_url", "project_name", "project_location", "project_type", "project_starts_on",
    "project_ends_on", "opportunity_summary", "signal_summary", "verified_evidence", "inferences",
    "unknowns", "accommodation_strength", "accommodation_evidence_index", "timing_horizon",
    "timing_evidence_index", "group_size_min", "group_size_max", "group_size_basis",
    "group_size_evidence_index", "duration_weeks", "duration_basis", "duration_evidence_index",
    "recurring", "recurring_reason", "work_location", "location_evidence_index",
  ],
} as const;

type Findings = {
  relevant: boolean;
  verdict: string;
  company_name: string | null;
  company_website: string | null;
  company_industry: string | null;
  company_location: string | null;
  company_based_outside_region: boolean | null;
  contact_name: string | null;
  contact_role: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_profile_url: string | null;
  project_name: string | null;
  project_location: string | null;
  project_type: string | null;
  project_starts_on: string | null;
  project_ends_on: string | null;
  opportunity_summary: string;
  signal_summary: string;
  verified_evidence: { statement: string; quote: string }[];
  inferences: { statement: string; based_on: string }[];
  unknowns: string[];
  accommodation_strength: AccommodationStrength;
  accommodation_evidence_index: number[];
  timing_horizon: TimingHorizon;
  timing_evidence_index: number[];
  group_size_min: number | null;
  group_size_max: number | null;
  group_size_basis: Basis;
  group_size_evidence_index: number[];
  duration_weeks: number | null;
  duration_basis: Basis;
  duration_evidence_index: number[];
  recurring: Ternary;
  recurring_reason: string | null;
  work_location: string | null;
  location_evidence_index: number[];
};

const MAX_SOURCE_CHARS = 60_000;

function systemPrompt(client: ClientConfig): string {
  return [
    `You read public web pages and decide whether they show a genuine accommodation opportunity for ${client.name}, an accommodation provider in ${client.location.town}, ${client.location.region}.`,
    "",
    "BlackLine Agency finds these opportunities on the client's behalf. A lead is worth something only if it is real, so accuracy matters far more than volume.",
    "",
    "Hard rules:",
    "1. Every fact you report must appear in the source text you are given. Quote it.",
    "2. Never write a contact name, email address, phone number or website that is not literally in the text. Do not construct an email from a person's name and a domain. If it is not there, return null.",
    "3. Keep facts and conclusions apart. A fact the source states goes in verified_evidence. A conclusion you drew goes in inferences, phrased as a possibility.",
    "4. \"This company has a project nearby, so they must need rooms\" is an inference, not a fact. Say so.",
    "5. If the source does not establish something, list it under unknowns rather than filling it in.",
    "6. Mark relevant=false for directories, generic service pages, news with no named organisation, and anything with no connection to work in the target area.",
    "",
    `Work counts as being in the target area if it is in or near: ${client.targetAreas.join(", ")}.`,
    "Organisations based elsewhere in the UK with work in that area are exactly as valuable as local ones — often more so, because their people have to stay somewhere.",
  ].join("\n");
}

function userPrompt(input: AnalysisInput): string {
  return [
    `Source type being searched: ${input.sourceType}`,
    `URL: ${input.url}`,
    input.title ? `Page title: ${input.title}` : "",
    input.publishedAt ? `Reported publication date: ${input.publishedAt}` : "Publication date: not reported.",
    `Today's date: ${new Date().toISOString().slice(0, 10)}`,
    "",
    "Call record_findings with what this page actually establishes.",
    "",
    "--- SOURCE TEXT ---",
    input.text.slice(0, MAX_SOURCE_CHARS),
    "--- END SOURCE TEXT ---",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function analyseSource(input: AnalysisInput): Promise<AnalysisOutcome> {
  const configured = requireAnthropic();
  if (!configured.configured) return { ok: false, reason: configured.reason };

  if (input.text.trim().length < 200) {
    return { ok: false, reason: "The page had too little text to analyse." };
  }

  const anthropic = new Anthropic({ apiKey: configured.value.apiKey });

  let message: Anthropic.Message;
  try {
    message = await anthropic.messages.create({
      model: configured.value.model,
      max_tokens: 8000,
      output_config: { effort: "medium" },
      system: systemPrompt(input.client),
      tools: [
        {
          name: "record_findings",
          description: "Record what this source establishes about a possible accommodation opportunity.",
          input_schema: FINDINGS_SCHEMA as unknown as Anthropic.Tool.InputSchema,
          strict: true,
        },
      ],
      tool_choice: { type: "auto" },
      messages: [{ role: "user", content: userPrompt(input) }],
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      return { ok: false, reason: `Anthropic API error ${error.status}: ${error.message}` };
    }
    return { ok: false, reason: error instanceof Error ? error.message : "Analysis failed." };
  }

  if (message.stop_reason === "refusal") {
    return { ok: false, reason: "The model declined to analyse this source." };
  }

  const block = message.content.find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "record_findings",
  );
  if (!block) {
    return { ok: false, reason: "The model did not return findings for this source." };
  }

  return { ok: true, analysis: toAnalysis(block.input as Findings, input) };
}

/** Maps the model's findings onto the domain model, computing everything that can be computed. */
export function toAnalysis(findings: Findings, input: AnalysisInput): Analysis {
  const verified: Evidence[] = findings.verified_evidence.map((item) => ({
    id: newId("ev"),
    kind: "verified" as const,
    statement: item.statement,
    sourceUrl: input.url,
    sourceTitle: input.title,
    observedAt: input.publishedAt ?? new Date().toISOString().slice(0, 10),
  }));

  const inferences: Evidence[] = findings.inferences.map((item) => ({
    id: newId("ev"),
    kind: "inference" as const,
    statement: item.statement,
    sourceUrl: input.url,
    sourceTitle: input.title,
    derivedFrom: verified.map((e) => e.id),
    observedAt: new Date().toISOString().slice(0, 10),
  }));

  const unknowns: Evidence[] = findings.unknowns.map((statement) => ({
    id: newId("ev"),
    kind: "unknown" as const,
    statement,
  }));

  const pick = (indexes: number[]): string[] =>
    indexes
      .map((i) => verified[i]?.id)
      .filter((id): id is string => typeof id === "string");

  // The distance band is computed here, from a place name the source used.
  const workLocation = findings.work_location ?? findings.project_location ?? undefined;
  const geo = bandForLocation(workLocation);

  const contact = {
    name: findings.contact_name ?? undefined,
    role: findings.contact_role ?? undefined,
    email: findings.contact_email ?? undefined,
    phone: findings.contact_phone ?? undefined,
    profileUrl: findings.contact_profile_url ?? undefined,
  };
  const hasAnyContactDetail = Boolean(contact.name || contact.email || contact.phone || contact.profileUrl);

  const qualification: QualificationInputs = {
    accommodation: {
      strength: findings.accommodation_strength,
      evidenceIds: pick(findings.accommodation_evidence_index),
    },
    timing: {
      horizon: findings.timing_horizon,
      startsOn: findings.project_starts_on ?? undefined,
      evidenceIds: pick(findings.timing_evidence_index),
    },
    groupSize: {
      min: findings.group_size_min ?? undefined,
      max: findings.group_size_max ?? undefined,
      basis: findings.group_size_basis,
      evidenceIds: pick(findings.group_size_evidence_index),
    },
    duration: {
      weeks: findings.duration_weeks ?? undefined,
      basis: findings.duration_basis,
      recurring: findings.recurring,
      recurringReason: findings.recurring_reason ?? undefined,
      evidenceIds: pick(findings.duration_evidence_index),
    },
    geography: {
      band: geo.band,
      workLocation,
      evidenceIds: pick(findings.location_evidence_index),
    },
    contactability: {
      namedContact: Boolean(contact.name),
      role: Boolean(contact.role),
      email: Boolean(contact.email),
      phone: Boolean(contact.phone),
      genericChannel: Boolean(findings.company_website) && !hasAnyContactDetail,
      // Contact details were read off this page, so the page is the evidence.
      evidenceIds: hasAnyContactDetail || findings.company_website ? verified.slice(0, 1).map((e) => e.id) : [],
    },
  };

  return {
    relevant: findings.relevant,
    verdict: findings.verdict,
    company: {
      name: findings.company_name ?? "",
      website: findings.company_website ?? undefined,
      industry: findings.company_industry ?? undefined,
      location: findings.company_location ?? undefined,
      basedOutsideRegion: findings.company_based_outside_region ?? false,
    },
    contact,
    opportunity: {
      projectName: findings.project_name ?? undefined,
      projectLocation: findings.project_location ?? undefined,
      projectType: findings.project_type ?? undefined,
      startsOn: findings.project_starts_on ?? undefined,
      endsOn: findings.project_ends_on ?? undefined,
      summary: findings.opportunity_summary,
    },
    signalSummary: findings.signal_summary,
    evidence: [...verified, ...inferences, ...unknowns],
    qualification,
  };
}

export type { Findings };
