import { getDb } from "./index";
import { newId } from "../domain/ids";
import type { SourceType } from "../domain/types";

export type DiscoveryRun = {
  id: string;
  clientId: string;
  trigger: "manual" | "schedule" | "api";
  sources: SourceType[];
  startedAt: string;
  finishedAt?: string;
  status: "running" | "succeeded" | "failed" | "unconfigured";
  candidates: number;
  leadsCreated: number;
  duplicates: number;
  rejected: number;
  error?: string;
  /** Per-source detail, including the queries run and why candidates were dropped. */
  detail: unknown;
};

export function startRun(input: Pick<DiscoveryRun, "clientId" | "trigger" | "sources">): DiscoveryRun {
  const run: DiscoveryRun = {
    id: newId("run"),
    ...input,
    startedAt: new Date().toISOString(),
    status: "running",
    candidates: 0,
    leadsCreated: 0,
    duplicates: 0,
    rejected: 0,
    detail: {},
  };
  saveRun(run);
  return run;
}

export function saveRun(run: DiscoveryRun): DiscoveryRun {
  getDb()
    .prepare(
      `INSERT INTO discovery_runs (id, client_id, trigger, sources, started_at, finished_at, status,
                                   candidates, leads_created, duplicates, rejected, error, doc)
       VALUES ($id, $client_id, $trigger, $sources, $started_at, $finished_at, $status,
               $candidates, $leads_created, $duplicates, $rejected, $error, $doc)
       ON CONFLICT (id) DO UPDATE SET
         finished_at = excluded.finished_at, status = excluded.status, candidates = excluded.candidates,
         leads_created = excluded.leads_created, duplicates = excluded.duplicates,
         rejected = excluded.rejected, error = excluded.error, doc = excluded.doc`,
    )
    .run({
      id: run.id,
      client_id: run.clientId,
      trigger: run.trigger,
      sources: run.sources.join(","),
      started_at: run.startedAt,
      finished_at: run.finishedAt ?? null,
      status: run.status,
      candidates: run.candidates,
      leads_created: run.leadsCreated,
      duplicates: run.duplicates,
      rejected: run.rejected,
      error: run.error ?? null,
      doc: JSON.stringify(run),
    });
  return run;
}

export function listRuns(clientId: string, limit = 20): DiscoveryRun[] {
  const rows = getDb()
    .prepare("SELECT doc FROM discovery_runs WHERE client_id = ? ORDER BY started_at DESC LIMIT ?")
    .all(clientId, limit) as { doc: string }[];
  return rows.map((r) => JSON.parse(r.doc) as DiscoveryRun);
}

export function getRun(id: string): DiscoveryRun | undefined {
  const row = getDb().prepare("SELECT doc FROM discovery_runs WHERE id = ?").get(id) as
    | { doc: string }
    | undefined;
  return row ? (JSON.parse(row.doc) as DiscoveryRun) : undefined;
}
