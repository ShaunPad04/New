import { CLOSED_STATUSES, PIPELINE_STATUSES } from "./types";
import type { ClosedStatus, LeadStatus, PipelineStatus } from "./types";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  researching: "Researching",
  qualified: "Qualified",
  outreach_ready: "Outreach ready",
  contacted: "Contacted",
  responded: "Responded",
  requirement_confirmed: "Requirement confirmed",
  sent_to_cambridge_mews: "Sent to Cambridge Mews",
  cambridge_mews_contacted: "Cambridge Mews contacted",
  quote: "Quote",
  booked: "Booked",
  lost: "Lost",
  not_qualified: "Not qualified",
  no_response: "No response",
  duplicate: "Duplicate",
  not_suitable: "Not suitable",
};

export function isClosed(status: LeadStatus): status is ClosedStatus {
  return (CLOSED_STATUSES as readonly string[]).includes(status);
}

export function isPipeline(status: LeadStatus): status is PipelineStatus {
  return (PIPELINE_STATUSES as readonly string[]).includes(status);
}

export function stageIndex(status: LeadStatus): number {
  return PIPELINE_STATUSES.indexOf(status as PipelineStatus);
}

/**
 * A lead moves forward one stage at a time, or jumps to a closed outcome at
 * any point. Skipping ahead is rejected so the pipeline numbers on the
 * dashboard mean something — you cannot mark a lead BOOKED that was never
 * handed over.
 */
export function canTransition(from: LeadStatus, to: LeadStatus): { ok: true } | { ok: false; reason: string } {
  if (from === to) return { ok: false, reason: `The lead is already ${STATUS_LABELS[to]}.` };
  if (isClosed(to)) return { ok: true };
  if (isClosed(from)) {
    return to === "new" || to === "researching"
      ? { ok: true }
      : { ok: false, reason: `A closed lead can only be reopened as New or Researching.` };
  }
  const fromIdx = stageIndex(from);
  const toIdx = stageIndex(to);
  if (toIdx < fromIdx) return { ok: true }; // stepping back is always allowed
  if (toIdx === fromIdx + 1) return { ok: true };
  return {
    ok: false,
    reason: `Cannot jump from ${STATUS_LABELS[from]} to ${STATUS_LABELS[to]} — the stages in between have not happened.`,
  };
}

/** The five funnel buckets shown on the dashboard. */
export const FUNNEL = [
  { key: "discovered", label: "Discovered", statuses: PIPELINE_STATUSES.slice(0) },
  { key: "qualified", label: "Qualified", statuses: PIPELINE_STATUSES.slice(2) },
  { key: "contacted", label: "Contacted", statuses: PIPELINE_STATUSES.slice(4) },
  { key: "handed_off", label: "Handed off", statuses: PIPELINE_STATUSES.slice(7) },
  { key: "booked", label: "Booked", statuses: PIPELINE_STATUSES.slice(10) },
] as const;
