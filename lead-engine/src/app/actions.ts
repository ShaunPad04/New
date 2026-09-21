"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { DEFAULT_CLIENT_ID, getClient, setCommercialModel } from "@/lib/clients";
import { appendHistory, getLead, saveLead, setStatus, TransitionError } from "@/lib/db/leads";
import { markRead } from "@/lib/db/notifications";
import { runDiscovery } from "@/lib/discovery/run";
import { buildPack, checkReadiness } from "@/lib/handoff/pack";
import { generateDrafts } from "@/lib/outreach/generate";
import { bandForLocation } from "@/lib/domain/geo";
import { dedupeKey, newId } from "@/lib/domain/ids";
import { assessRecurring } from "@/lib/domain/recurring";
import { scoreLead, tierFor } from "@/lib/domain/scoring";
import { notify } from "@/lib/notify";
import { CLOSED_STATUSES, PIPELINE_STATUSES, SOURCE_TYPES } from "@/lib/domain/types";
import type { Lead, LeadStatus } from "@/lib/domain/types";

export type ActionState = { ok: boolean; message: string; detail?: string[] };

const ACTOR = "blackline";

function reloadLead(id: string): Lead {
  const lead = getLead(id);
  if (!lead) throw new Error(`Lead ${id} not found.`);
  return lead;
}

function refresh(leadId?: string): void {
  revalidatePath("/");
  revalidatePath("/leads");
  revalidatePath("/handoff");
  revalidatePath("/reports");
  if (leadId) revalidatePath(`/leads/${leadId}`);
}

// --- Discovery ------------------------------------------------------------

const discoverySchema = z.object({
  sources: z.array(z.enum(SOURCE_TYPES)).optional(),
  extraQuery: z.string().trim().max(400).optional(),
  extraSourceType: z.enum(SOURCE_TYPES).optional(),
  minScore: z.coerce.number().int().min(0).max(100).optional(),
  maxPages: z.coerce.number().int().min(1).max(120).optional(),
});

export async function runDiscoveryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = discoverySchema.safeParse({
    sources: formData.getAll("sources").map(String).filter(Boolean),
    extraQuery: formData.get("extraQuery")?.toString() || undefined,
    extraSourceType: formData.get("extraSourceType")?.toString() || undefined,
    minScore: formData.get("minScore")?.toString() || undefined,
    maxPages: formData.get("maxPages")?.toString() || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: "That search could not be read.", detail: parsed.error.issues.map((i) => i.message) };
  }

  const client = getClient(DEFAULT_CLIENT_ID);
  const { sources, extraQuery, extraSourceType, minScore, maxPages } = parsed.data;

  const run = await runDiscovery({
    client,
    trigger: "manual",
    sources: sources && sources.length > 0 ? sources : undefined,
    extraQueries: extraQuery
      ? [{ sourceType: extraSourceType ?? "manual", queries: [extraQuery] }]
      : undefined,
    minScore,
    maxPages,
  });

  refresh();
  revalidatePath("/discovery");

  if (run.status === "unconfigured") {
    return {
      ok: false,
      message: "Discovery is not configured.",
      detail: [run.error ?? "A search provider and an Anthropic API key are both required.", "See Settings for what is missing."],
    };
  }
  if (run.status === "failed") {
    return { ok: false, message: "The run failed.", detail: [run.error ?? "Unknown error."] };
  }
  return {
    ok: true,
    message: `${run.leadsCreated} new lead${run.leadsCreated === 1 ? "" : "s"} from ${run.candidates} candidate${run.candidates === 1 ? "" : "s"}.`,
    detail: [`${run.duplicates} already known, ${run.rejected} rejected or unreadable.`],
  };
}

// --- Lead lifecycle -------------------------------------------------------

export async function setApprovalAction(formData: FormData): Promise<void> {
  const id = String(formData.get("leadId"));
  const approval = String(formData.get("approval"));
  if (approval !== "approved" && approval !== "rejected" && approval !== "pending") return;

  const lead = reloadLead(id);
  const updated = appendHistory({ ...lead, approval }, ACTOR, `approval → ${approval}`);
  saveLead(updated);

  if (approval === "rejected" && !["not_qualified", "not_suitable"].includes(lead.status)) {
    try {
      setStatus(updated, "not_qualified", ACTOR, "Rejected on review.");
    } catch {
      // A lead already in a closed state needs no further transition.
    }
  }
  refresh(id);
}

export async function setStatusAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("leadId"));
  const status = String(formData.get("status")) as LeadStatus;
  const detail = formData.get("detail")?.toString() || undefined;

  const valid = [...PIPELINE_STATUSES, ...CLOSED_STATUSES] as readonly string[];
  if (!valid.includes(status)) return { ok: false, message: "Unknown status." };

  try {
    setStatus(reloadLead(id), status, ACTOR, detail);
  } catch (error) {
    if (error instanceof TransitionError) return { ok: false, message: error.message };
    throw error;
  }
  refresh(id);
  return { ok: true, message: "Status updated." };
}

export async function saveLeadNotesAction(formData: FormData): Promise<void> {
  const id = String(formData.get("leadId"));
  const notes = formData.get("notes")?.toString() ?? "";
  const followUp = formData.get("nextFollowUpOn")?.toString() || undefined;

  const lead = reloadLead(id);
  saveLead(
    appendHistory(
      { ...lead, notes: notes.trim() || undefined, nextFollowUpOn: followUp },
      ACTOR,
      "notes updated",
    ),
  );
  refresh(id);
}

export async function generateOutreachAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("leadId"));
  const lead = reloadLead(id);
  const client = getClient(lead.clientId);

  const outcome = await generateDrafts(lead, client);
  if (!outcome.ok) return { ok: false, message: outcome.reason };

  let updated = appendHistory(
    { ...lead, outreach: outcome.drafts },
    ACTOR,
    `outreach drafted (${outcome.generator})`,
  );
  if (lead.status === "qualified") {
    updated = { ...updated, status: "outreach_ready" };
  }
  saveLead(updated);
  refresh(id);

  return {
    ok: true,
    message:
      outcome.generator === "ai"
        ? "Drafts written from this lead's evidence."
        : "Drafts written from the standard templates (no Anthropic API key configured).",
  };
}

export async function saveOutreachDraftAction(formData: FormData): Promise<void> {
  const id = String(formData.get("leadId"));
  const index = Number(formData.get("index"));
  const subject = formData.get("subject")?.toString() || undefined;
  const body = formData.get("body")?.toString() ?? "";

  const lead = reloadLead(id);
  const outreach = lead.outreach.map((draft, i) =>
    i === index ? { ...draft, subject, body, edited: true } : draft,
  );
  saveLead(appendHistory({ ...lead, outreach }, ACTOR, "outreach edited"));
  refresh(id);
}

// --- Handoff --------------------------------------------------------------

export async function sendToCambridgeMewsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("leadId"));
  const lead = reloadLead(id);
  const client = getClient(lead.clientId);

  const readiness = checkReadiness(lead, client);
  if (!readiness.ready) {
    return { ok: false, message: `This lead is not ready to hand over.`, detail: readiness.blockers };
  }

  const pack = buildPack(lead, client);
  const now = new Date().toISOString();
  let updated: Lead = appendHistory(
    { ...lead, handoffSentAt: now, handoffPack: pack },
    ACTOR,
    `sent to ${client.name}`,
  );

  // The pipeline requires the lead to have reached the handoff stage.
  if (updated.status !== "sent_to_cambridge_mews") {
    updated = { ...updated, status: "sent_to_cambridge_mews" };
  }
  saveLead(updated);

  notify({
    clientId: client.id,
    leadId: lead.id,
    kind: "handoff",
    title: `Handed to ${client.name} — ${lead.company.name}`,
    body: `Lead score ${lead.score.total}/${lead.score.max}. ${
      client.routing.handoffRecipients.length === 0
        ? "No recipient is recorded, so the pack must be sent by hand."
        : `Recipients: ${client.routing.handoffRecipients.join(", ")}`
    }`,
  });

  refresh(id);
  return {
    ok: true,
    message: `Marked as sent to ${client.name}.`,
    detail: readiness.warnings,
  };
}

// --- Booking and revenue --------------------------------------------------

const bookingSchema = z.object({
  value: z.coerce.number().min(0).optional(),
  currency: z.string().trim().length(3).default("GBP"),
  nights: z.coerce.number().int().min(0).optional(),
  guests: z.coerce.number().int().min(0).optional(),
  bookedOn: z.string().trim().optional(),
});

export async function recordBookingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("leadId"));
  const parsed = bookingSchema.safeParse({
    value: formData.get("value")?.toString() || undefined,
    currency: formData.get("currency")?.toString() || "GBP",
    nights: formData.get("nights")?.toString() || undefined,
    guests: formData.get("guests")?.toString() || undefined,
    bookedOn: formData.get("bookedOn")?.toString() || undefined,
  });
  if (!parsed.success) {
    return { ok: false, message: "Those booking details could not be read.", detail: parsed.error.issues.map((i) => i.message) };
  }

  const lead = reloadLead(id);
  const booking = { ...parsed.data, bookedOn: parsed.data.bookedOn || new Date().toISOString().slice(0, 10) };
  let updated = appendHistory({ ...lead, booking }, ACTOR, "booking recorded");

  if (lead.status !== "booked") {
    // Booking is the end of the pipeline; record it directly and note the jump.
    updated = appendHistory({ ...updated, status: "booked" }, ACTOR, "status → booked", "Booking confirmed by the client.");
  }
  saveLead(updated);

  notify({
    clientId: lead.clientId,
    leadId: lead.id,
    kind: "booking",
    title: `Booking recorded — ${lead.company.name}`,
    body: `${booking.nights ?? "?"} nights, ${booking.guests ?? "?"} guests.`,
  });

  refresh(id);
  return { ok: true, message: "Booking recorded." };
}

const commercialSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("unconfigured") }),
  z.object({ kind: z.literal("per_qualified_lead"), currency: z.string().length(3), feePerLead: z.coerce.number().min(0) }),
  z.object({ kind: z.literal("per_booking"), currency: z.string().length(3), feePerBooking: z.coerce.number().min(0) }),
  z.object({ kind: z.literal("percentage_commission"), currency: z.string().length(3), percentage: z.coerce.number().min(0).max(100) }),
  z.object({
    kind: z.literal("hybrid"),
    currency: z.string().length(3),
    feePerLead: z.coerce.number().min(0).optional(),
    feePerBooking: z.coerce.number().min(0).optional(),
    percentage: z.coerce.number().min(0).max(100).optional(),
  }),
]);

export async function saveCommercialModelAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const kind = String(formData.get("kind"));
  const currency = (formData.get("currency")?.toString() || "GBP").toUpperCase();
  const num = (name: string) => {
    const raw = formData.get(name)?.toString();
    return raw && raw.trim().length > 0 ? raw : undefined;
  };

  const parsed = commercialSchema.safeParse({
    kind,
    currency,
    feePerLead: num("feePerLead"),
    feePerBooking: num("feePerBooking"),
    percentage: num("percentage"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Those terms could not be read.", detail: parsed.error.issues.map((i) => i.message) };
  }

  setCommercialModel(DEFAULT_CLIENT_ID, parsed.data);
  revalidatePath("/settings");
  refresh();
  return {
    ok: true,
    message:
      parsed.data.kind === "unconfigured"
        ? "Commercial terms cleared. Fee figures will read as unavailable until they are recorded again."
        : "Commercial terms recorded.",
  };
}

// --- Manual lead entry ----------------------------------------------------

const manualLeadSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  website: z.string().trim().url().optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional(),
  companyLocation: z.string().trim().max(160).optional(),
  contactName: z.string().trim().max(120).optional(),
  contactRole: z.string().trim().max(120).optional(),
  contactEmail: z.string().trim().email().optional().or(z.literal("")),
  contactPhone: z.string().trim().max(40).optional(),
  projectName: z.string().trim().max(200).optional(),
  projectLocation: z.string().trim().max(160).optional(),
  summary: z.string().trim().min(10).max(1200),
  signalSummary: z.string().trim().min(10).max(600),
  sourceType: z.enum(SOURCE_TYPES),
  evidenceStatement: z.string().trim().min(10).max(600),
  evidenceUrl: z.string().trim().url(),
  accommodationStrength: z.enum(["explicit_request", "travelling_workforce", "temporary_roles", "project_presence", "none"]),
  timingHorizon: z.enum(["active_now", "starting_soon", "announced_future", "speculative", "unknown"]),
  groupSize: z.coerce.number().int().min(0).max(5000).optional(),
  durationWeeks: z.coerce.number().int().min(0).max(520).optional(),
});

export async function createManualLeadAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = Object.fromEntries(
    [...formData.entries()].map(([k, v]) => [k, typeof v === "string" && v.trim() === "" ? undefined : v]),
  );
  const parsed = manualLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "The lead could not be saved.",
      detail: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }
  const input = parsed.data;
  const client = getClient(DEFAULT_CLIENT_ID);

  const evidenceId = newId("ev");
  const geo = bandForLocation(input.projectLocation ?? input.companyLocation);
  const now = new Date().toISOString();

  const qualification = {
    accommodation: { strength: input.accommodationStrength, evidenceIds: [evidenceId] },
    timing: { horizon: input.timingHorizon, evidenceIds: [evidenceId] },
    groupSize: {
      min: input.groupSize,
      max: input.groupSize,
      basis: input.groupSize === undefined ? ("unknown" as const) : ("stated" as const),
      evidenceIds: input.groupSize === undefined ? [] : [evidenceId],
    },
    duration: {
      weeks: input.durationWeeks,
      basis: input.durationWeeks === undefined ? ("unknown" as const) : ("stated" as const),
      recurring: "unknown" as const,
      evidenceIds: input.durationWeeks === undefined ? [] : [evidenceId],
    },
    geography: {
      band: geo.band,
      workLocation: input.projectLocation ?? input.companyLocation,
      evidenceIds: geo.band === "unknown" ? [] : [evidenceId],
    },
    contactability: {
      namedContact: Boolean(input.contactName),
      role: Boolean(input.contactRole),
      email: Boolean(input.contactEmail),
      phone: Boolean(input.contactPhone),
      genericChannel: Boolean(input.website) && !input.contactName && !input.contactEmail,
      evidenceIds: [evidenceId],
    },
  };

  const score = scoreLead(qualification);
  const lead: Lead = {
    id: newId("lead"),
    clientId: client.id,
    sourceType: input.sourceType,
    dedupeKey: dedupeKey({ company: input.companyName, project: input.projectName, location: input.projectLocation }),
    company: {
      name: input.companyName,
      website: input.website || undefined,
      industry: input.industry,
      location: input.companyLocation,
    },
    contact: {
      name: input.contactName,
      role: input.contactRole,
      email: input.contactEmail || undefined,
      phone: input.contactPhone,
      sourceUrl: input.evidenceUrl,
    },
    opportunity: {
      projectName: input.projectName,
      projectLocation: input.projectLocation,
      summary: input.summary,
    },
    signalSummary: input.signalSummary,
    evidence: [
      {
        id: evidenceId,
        kind: "verified",
        statement: input.evidenceStatement,
        sourceUrl: input.evidenceUrl,
        observedAt: now.slice(0, 10),
      },
    ],
    qualification,
    score,
    tier: tierFor(score, qualification),
    status: "qualified",
    approval: "pending",
    outreach: [],
    discoveredAt: now,
    updatedAt: now,
    history: [{ at: now, actor: ACTOR, event: "added by hand", detail: input.evidenceUrl }],
  };

  const recurring = assessRecurring(lead);
  lead.qualification.duration.recurring = recurring.value;
  lead.qualification.duration.recurringReason = recurring.reason;

  saveLead(lead);
  refresh(lead.id);
  redirect(`/leads/${lead.id}`);
}

export async function markNotificationReadAction(formData: FormData): Promise<void> {
  markRead(String(formData.get("id")));
  revalidatePath("/");
}
