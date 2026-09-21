import Link from "next/link";
import { getClient } from "@/lib/clients";
import { listLeads } from "@/lib/db/leads";
import { TIER_LABELS } from "@/lib/domain/scoring";
import { STATUS_LABELS } from "@/lib/domain/status";
import { SOURCE_TYPE_LABELS, SOURCE_TYPES, TIERS } from "@/lib/domain/types";
import type { LeadStatus, SourceType, Tier } from "@/lib/domain/types";
import { formatRelative } from "@/lib/ui";
import { EmptyState, Eyebrow, Panel, ScoreBadge, StatusPill, TierBadge } from "@/components/primitives";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const client = getClient();

  const tier = one(params.tier) as Tier | undefined;
  const status = one(params.status) as LeadStatus | undefined;
  const sourceType = one(params.source) as SourceType | undefined;
  const search = one(params.q);
  const minScore = one(params.minScore) ? Number(one(params.minScore)) : undefined;
  const approval = one(params.approval) as "pending" | "approved" | "rejected" | undefined;
  const sort = (one(params.sort) as "score" | "discovered" | "updated" | undefined) ?? "score";

  const { leads, total } = listLeads({
    clientId: client.id,
    tier: tier ? [tier] : undefined,
    status: status ? [status] : undefined,
    sourceType: sourceType ? [sourceType] : undefined,
    approval,
    minScore: Number.isFinite(minScore) ? minScore : undefined,
    search,
    sort,
    limit: 200,
  });

  return (
    <div className="space-y-8 pt-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <Eyebrow>Lead database</Eyebrow>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            {total} lead{total === 1 ? "" : "s"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/leads/new"
            className="rounded-full border border-ink-400 px-4 py-2 text-sm text-ink-800 transition-colors hover:border-ink-500 hover:text-ink-1000"
          >
            Add a lead by hand
          </Link>
          <Link
            href="/discovery"
            className="rounded-full bg-ink-900 px-4 py-2 text-sm font-medium text-ink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
          >
            Find opportunities
          </Link>
        </div>
      </header>

      <Panel>
        <form className="grid gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-6">
          <label className="lg:col-span-2">
            <span className="field-label">Search</span>
            <input
              name="q"
              defaultValue={search ?? ""}
              placeholder="Company, project, contact"
              className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600"
            />
          </label>
          <label>
            <span className="field-label">Tier</span>
            <select name="tier" defaultValue={tier ?? ""} className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900">
              <option value="">Any</option>
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  {TIER_LABELS[t].label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="field-label">Source</span>
            <select name="source" defaultValue={sourceType ?? ""} className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900">
              <option value="">Any</option>
              {SOURCE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {SOURCE_TYPE_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="field-label">Minimum score</span>
            <input
              name="minScore"
              type="number"
              min={0}
              max={100}
              defaultValue={minScore ?? ""}
              className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
            />
          </label>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-ink-900 px-4 py-2 text-sm font-medium text-ink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
            >
              Filter
            </button>
          </div>
        </form>
      </Panel>

      <Panel innerClassName="overflow-x-auto">
        {leads.length === 0 ? (
          <EmptyState
            title="No leads match"
            body="Either nothing has been discovered yet, or the filters are too tight. Discovery only records opportunities that clear the evidence bar, so an empty table is a real answer."
          />
        ) : (
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-ink-1000/5 text-left">
                <th className="field-label px-5 py-3 font-normal">Score</th>
                <th className="field-label px-5 py-3 font-normal">Company</th>
                <th className="field-label px-5 py-3 font-normal">Opportunity</th>
                <th className="field-label px-5 py-3 font-normal">Tier</th>
                <th className="field-label px-5 py-3 font-normal">Status</th>
                <th className="field-label px-5 py-3 font-normal">Source</th>
                <th className="field-label px-5 py-3 text-right font-normal">Found</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-1000/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="row-link">
                  <td className="px-5 py-3">
                    <Link href={`/leads/${lead.id}`}>
                      <ScoreBadge total={lead.score.total} max={lead.score.max} />
                    </Link>
                  </td>
                  <td className="max-w-[220px] px-5 py-3">
                    <Link href={`/leads/${lead.id}`} className="block truncate font-medium text-ink-900">
                      {lead.company.name}
                    </Link>
                    <span className="block truncate text-xs text-ink-600">
                      {lead.contact.name ?? lead.company.industry ?? "No contact identified"}
                    </span>
                  </td>
                  <td className="max-w-[320px] px-5 py-3">
                    <span className="block truncate text-ink-800">
                      {lead.opportunity.projectName ?? lead.opportunity.summary}
                    </span>
                    <span className="block truncate text-xs text-ink-600">
                      {lead.opportunity.projectLocation ?? "Location not established"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <TierBadge tier={lead.tier} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusPill status={lead.status} />
                  </td>
                  <td className="px-5 py-3 text-ink-700">{SOURCE_TYPE_LABELS[lead.sourceType]}</td>
                  <td className="px-5 py-3 text-right text-ink-600">{formatRelative(lead.discoveredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>

      {status ? (
        <p className="text-xs text-ink-600">Filtered to status: {STATUS_LABELS[status]}.</p>
      ) : null}
    </div>
  );
}
