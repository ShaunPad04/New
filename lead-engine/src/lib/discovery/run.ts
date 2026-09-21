import { search } from "./provider";
import { fetchPage } from "../research/fetch";
import { analyseSource } from "../research/analyse";
import { dedupeKey, newId } from "../domain/ids";
import { scoreLead, tierFor } from "../domain/scoring";
import { assessRecurring } from "../domain/recurring";
import { findByDedupeKey, saveLead } from "../db/leads";
import { saveRun, startRun } from "../db/runs";
import { notifyHighIntent } from "../notify";
import type { DiscoveryRun } from "../db/runs";
import type { ClientConfig } from "../clients/types";
import type { Lead, SourceType } from "../domain/types";

export type DiscoveryOptions = {
  client: ClientConfig;
  trigger: DiscoveryRun["trigger"];
  /** Restrict the run to these source types. Defaults to every configured source. */
  sources?: SourceType[];
  /** Extra queries typed by a person in the research screen. */
  extraQueries?: { sourceType: SourceType; queries: string[] }[];
  /** Results to pull per query. */
  resultsPerQuery?: number;
  /** Stop after this many pages are analysed, to bound cost on one run. */
  maxPages?: number;
  /** Drop candidates scoring below this. Defaults to the client's outreach floor. */
  minScore?: number;
};

export type CandidateOutcome = {
  url: string;
  title?: string;
  sourceType: SourceType;
  result: "created" | "updated" | "duplicate" | "rejected" | "error";
  detail: string;
  leadId?: string;
  score?: number;
};

const DEFAULT_RESULTS_PER_QUERY = 8;
const DEFAULT_MAX_PAGES = 40;

/**
 * One pass of the loop: search → fetch → extract evidence → qualify → score →
 * store. The manual research screen calls this with its own queries, so a
 * hand-typed search is qualified by exactly the same rules as the scheduled run.
 */
export async function runDiscovery(options: DiscoveryOptions): Promise<DiscoveryRun> {
  const { client } = options;
  const configured = options.sources
    ? client.discovery.filter((d) => options.sources?.includes(d.sourceType))
    : client.discovery;

  const plan: { sourceType: SourceType; query: string; maxAgeDays: number }[] = [];
  for (const source of configured) {
    for (const query of source.queries) {
      plan.push({ sourceType: source.sourceType, query, maxAgeDays: source.maxAgeDays });
    }
  }
  for (const extra of options.extraQueries ?? []) {
    for (const query of extra.queries) {
      plan.push({ sourceType: extra.sourceType, query, maxAgeDays: 365 });
    }
  }

  const run = startRun({
    clientId: client.id,
    trigger: options.trigger,
    sources: [...new Set(plan.map((p) => p.sourceType))],
  });

  if (plan.length === 0) {
    return saveRun({
      ...run,
      status: "failed",
      finishedAt: new Date().toISOString(),
      error: "No queries to run for the selected sources.",
    });
  }

  const minScore = options.minScore ?? client.qualification.minimumScoreForOutreach;
  const maxPages = options.maxPages ?? DEFAULT_MAX_PAGES;
  const outcomes: CandidateOutcome[] = [];
  const queriesRun: { query: string; sourceType: SourceType; results: number; error?: string }[] = [];
  const seenUrls = new Set<string>();

  let analysed = 0;
  let searchFailure: string | undefined;

  for (const step of plan) {
    if (analysed >= maxPages) break;

    const found = await search(step.query, options.resultsPerQuery ?? DEFAULT_RESULTS_PER_QUERY);
    if (!found.ok) {
      // A missing provider is a configuration problem, not a per-query failure:
      // stop the run rather than logging the same error forty times.
      searchFailure = found.reason;
      queriesRun.push({ query: step.query, sourceType: step.sourceType, results: 0, error: found.reason });
      if (/not set|Unknown SEARCH_PROVIDER/i.test(found.reason)) break;
      continue;
    }
    queriesRun.push({ query: step.query, sourceType: step.sourceType, results: found.results.length });

    for (const result of found.results) {
      if (analysed >= maxPages) break;
      if (seenUrls.has(result.url)) continue;
      seenUrls.add(result.url);

      if (isStale(result.publishedAt, step.maxAgeDays)) {
        outcomes.push({
          url: result.url,
          title: result.title,
          sourceType: step.sourceType,
          result: "rejected",
          detail: `Published ${result.publishedAt}, older than the ${step.maxAgeDays}-day window for this source.`,
        });
        continue;
      }

      analysed += 1;
      outcomes.push(await processCandidate({ client, sourceType: step.sourceType, url: result.url, publishedAt: result.publishedAt, minScore }));
    }
  }

  const created = outcomes.filter((o) => o.result === "created").length;
  const duplicates = outcomes.filter((o) => o.result === "duplicate" || o.result === "updated").length;
  const rejected = outcomes.filter((o) => o.result === "rejected" || o.result === "error").length;

  const unconfigured = Boolean(searchFailure && /not set|Unknown SEARCH_PROVIDER/i.test(searchFailure));

  return saveRun({
    ...run,
    finishedAt: new Date().toISOString(),
    status: unconfigured ? "unconfigured" : searchFailure && created === 0 && analysed === 0 ? "failed" : "succeeded",
    candidates: outcomes.length,
    leadsCreated: created,
    duplicates,
    rejected,
    error: searchFailure,
    detail: { queries: queriesRun, outcomes, minScore, maxPages },
  });
}

function isStale(publishedAt: string | undefined, maxAgeDays: number): boolean {
  if (!publishedAt) return false; // No date reported is not evidence of being old.
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) return false;
  return Date.now() - published > maxAgeDays * 86_400_000;
}

async function processCandidate(args: {
  client: ClientConfig;
  sourceType: SourceType;
  url: string;
  publishedAt?: string;
  minScore: number;
}): Promise<CandidateOutcome> {
  const { client, sourceType, url, publishedAt, minScore } = args;

  const page = await fetchPage(url);
  if (!page.ok) {
    return { url, sourceType, result: "error", detail: `Could not read the page: ${page.reason}` };
  }

  const analysed = await analyseSource({
    client,
    sourceType,
    url: page.url,
    title: page.title,
    text: page.text,
    publishedAt,
  });
  if (!analysed.ok) {
    return { url, title: page.title, sourceType, result: "error", detail: analysed.reason };
  }

  const analysis = analysed.analysis;
  if (!analysis.relevant || analysis.company.name.trim().length === 0) {
    return { url, title: page.title, sourceType, result: "rejected", detail: analysis.verdict };
  }

  const score = scoreLead(analysis.qualification);
  const tier = tierFor(score, analysis.qualification);

  if (tier === "disqualified" || score.total < Math.min(minScore, 30)) {
    return {
      url,
      title: page.title,
      sourceType,
      result: "rejected",
      score: score.total,
      detail: `Scored ${score.total}/100 (${tier}). ${score.components.find((c) => c.points === 0)?.reason ?? ""}`.trim(),
    };
  }

  const key = dedupeKey({
    company: analysis.company.name,
    project: analysis.opportunity.projectName ?? analysis.opportunity.projectLocation,
    location: analysis.opportunity.projectLocation,
  });

  const existing = findByDedupeKey(client.id, key);
  if (existing) {
    const merged = mergeIntoExisting(existing, analysis, score.total, url);
    if (!merged) {
      return { url, title: page.title, sourceType, result: "duplicate", leadId: existing.id, detail: `Already recorded as ${existing.company.name}.` };
    }
    saveLead(merged);
    return {
      url,
      title: page.title,
      sourceType,
      result: "updated",
      leadId: existing.id,
      score: merged.score.total,
      detail: "Added new evidence to an existing lead.",
    };
  }

  const now = new Date().toISOString();
  const lead: Lead = {
    id: newId("lead"),
    clientId: client.id,
    sourceType,
    dedupeKey: key,
    company: {
      name: analysis.company.name,
      website: analysis.company.website,
      industry: analysis.company.industry,
      location: analysis.company.location,
      basedOutsideRegion: analysis.company.basedOutsideRegion,
    },
    contact: { ...analysis.contact, sourceUrl: url },
    opportunity: analysis.opportunity,
    signalSummary: analysis.signalSummary,
    evidence: analysis.evidence,
    qualification: analysis.qualification,
    score,
    tier,
    status: "qualified",
    approval: "pending",
    outreach: [],
    discoveredAt: now,
    updatedAt: now,
    history: [
      { at: now, actor: "discovery", event: "discovered", detail: `${sourceType} — ${url}` },
      { at: now, actor: "discovery", event: `scored ${score.total}/100`, detail: tier },
    ],
  };

  const recurring = assessRecurring(lead);
  lead.qualification.duration.recurring = recurring.value;
  lead.qualification.duration.recurringReason = recurring.reason;

  saveLead(lead);

  if (score.total >= client.qualification.notifyAtScore && tier === "high_intent") {
    notifyHighIntent(lead);
  }

  return { url, title: page.title, sourceType, result: "created", leadId: lead.id, score: score.total, detail: analysis.verdict };
}

/**
 * A second source describing the same opportunity strengthens the lead rather
 * than creating a new one. Returns undefined when the source adds nothing.
 */
function mergeIntoExisting(existing: Lead, analysis: { evidence: Lead["evidence"] }, _score: number, url: string): Lead | undefined {
  const known = new Set(existing.evidence.map((e) => e.statement.toLowerCase().trim()));
  const additions = analysis.evidence.filter(
    (e) => e.kind === "verified" && !known.has(e.statement.toLowerCase().trim()),
  );
  if (additions.length === 0) return undefined;

  const now = new Date().toISOString();
  return {
    ...existing,
    evidence: [...existing.evidence, ...additions],
    updatedAt: now,
    history: [
      ...existing.history,
      { at: now, actor: "discovery", event: "corroborating source added", detail: url },
    ],
  };
}
