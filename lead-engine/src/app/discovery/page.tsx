import { getClient } from "@/lib/clients";
import { listRuns } from "@/lib/db/runs";
import { integrationStatus } from "@/lib/dashboard";
import { SOURCE_TYPE_LABELS } from "@/lib/domain/types";
import { formatRelative } from "@/lib/ui";
import { Eyebrow, Notice, Panel, SectionHeading } from "@/components/primitives";
import { DiscoveryForm } from "@/components/discovery-form";

export default function DiscoveryPage() {
  const client = getClient();
  const runs = listRuns(client.id, 12);
  const integrations = integrationStatus();
  const blocking = integrations.filter((i) => !i.ready && (i.key === "search" || i.key === "anthropic"));

  return (
    <div className="space-y-10 pt-8">
      <header className="space-y-3">
        <Eyebrow>Discovery engine</Eyebrow>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Look for the situations that create a need for a bed.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-700">
          Not &ldquo;businesses in Grimsby&rdquo;. Projects starting, contract roles being advertised, agencies placing
          workers into the Humber, companies from elsewhere in the country winning work here. A manual search runs
          through exactly the same qualification and scoring as the scheduled one.
        </p>
      </header>

      {blocking.length > 0 ? (
        <Notice tone="danger" title="Discovery cannot run yet">
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {blocking.map((i) => (
              <li key={i.key}>{i.detail}</li>
            ))}
          </ul>
          <p className="mt-2">
            The engine will not invent leads to fill the gap — it reports that it cannot search and stops.
          </p>
        </Notice>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <div className="space-y-4">
          <SectionHeading title="Find opportunities" />
          <Panel>
            <DiscoveryForm client={client} />
          </Panel>
        </div>

        <div className="space-y-4">
          <SectionHeading
            title="What it searches for"
            description="Configured per client. Every query is a hypothesis about where accommodation demand comes from."
          />
          <Panel>
            <ul className="divide-y divide-ink-1000/5">
              {client.discovery.map((source) => (
                <li key={source.sourceType} className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium text-ink-900">{source.label}</p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-600">
                      {source.maxAgeDays}d window
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {source.queries.slice(0, 3).map((query) => (
                      <li key={query} className="truncate font-mono text-xs text-ink-600">
                        {query}
                      </li>
                    ))}
                    {source.queries.length > 3 ? (
                      <li className="font-mono text-xs text-ink-600">+{source.queries.length - 3} more</li>
                    ) : null}
                  </ul>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Run history"
          description="Including what was rejected and why. A run that finds nothing is a result, not a failure."
        />
        <Panel innerClassName="overflow-x-auto">
          {runs.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-600">No runs yet.</p>
          ) : (
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-ink-1000/5 text-left">
                  <th className="field-label px-5 py-3 font-normal">Started</th>
                  <th className="field-label px-5 py-3 font-normal">Trigger</th>
                  <th className="field-label px-5 py-3 font-normal">Sources</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Candidates</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Created</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Known</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Rejected</th>
                  <th className="field-label px-5 py-3 font-normal">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-1000/5">
                {runs.map((run) => (
                  <tr key={run.id}>
                    <td className="px-5 py-3 text-ink-800">{formatRelative(run.startedAt)}</td>
                    <td className="px-5 py-3 text-ink-700">{run.trigger}</td>
                    <td className="max-w-[220px] truncate px-5 py-3 text-ink-700">
                      {run.sources.map((s) => SOURCE_TYPE_LABELS[s]).join(", ") || "—"}
                    </td>
                    <td className="metric px-5 py-3 text-right text-ink-800">{run.candidates}</td>
                    <td className="metric px-5 py-3 text-right text-signal-good">{run.leadsCreated}</td>
                    <td className="metric px-5 py-3 text-right text-ink-700">{run.duplicates}</td>
                    <td className="metric px-5 py-3 text-right text-ink-700">{run.rejected}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          run.status === "succeeded"
                            ? "text-signal-good"
                            : run.status === "unconfigured"
                              ? "text-signal-potential"
                              : "text-signal-bad"
                        }
                      >
                        {run.status}
                      </span>
                      {run.error ? <p className="mt-0.5 max-w-[240px] text-xs text-ink-600">{run.error}</p> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </section>
    </div>
  );
}
