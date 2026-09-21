import Link from "next/link";
import { getClient } from "@/lib/clients";
import { buildWeeklyReport, reportToText } from "@/lib/report/weekly";
import { formatMoney } from "@/lib/revenue/commercial";
import { formatDate } from "@/lib/ui";
import { Eyebrow, Panel, SectionHeading, ScoreBadge } from "@/components/primitives";
import { CopyBlock } from "@/components/copy-block";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawDays = Array.isArray(params.days) ? params.days[0] : params.days;
  const days = Math.min(Math.max(Number(rawDays) || 7, 1), 90);

  const client = getClient();
  const report = buildWeeklyReport(client, days);

  return (
    <div className="space-y-10 pt-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <Eyebrow>BlackLine lead report</Eyebrow>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            {formatDate(report.from)} — {formatDate(report.to)}
          </h1>
        </div>
        <form className="flex items-end gap-2">
          <label>
            <span className="field-label">Period (days)</span>
            <input
              name="days"
              type="number"
              min={1}
              max={90}
              defaultValue={days}
              className="mt-1.5 w-28 rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
            />
          </label>
          <button type="submit" className="rounded-full border border-ink-400 px-4 py-2 text-sm text-ink-800 hover:border-ink-500 hover:text-ink-1000">
            Rebuild
          </button>
        </form>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "New opportunities", value: report.newLeads },
          { label: "High intent", value: report.highIntent.length },
          { label: "Leads contacted", value: report.contacted },
          { label: `Handed to ${client.name.split(" ")[0]}`, value: report.handedOff.length },
          { label: "Bookings", value: report.bookings.length },
          { label: "Booking revenue", value: formatMoney(report.bookingRevenue) },
          {
            label: "BlackLine revenue",
            value: report.blackLineFee.note ? "Not available" : formatMoney(report.blackLineFee.total, report.blackLineFee.currency),
          },
          { label: "Best source", value: report.bestSource?.label ?? "—" },
        ].map((item) => (
          <Panel key={item.label}>
            <div className="px-5 py-4">
              <p className="field-label">{item.label}</p>
              <p className="metric mt-2 text-2xl leading-none text-ink-900">{item.value}</p>
            </div>
          </Panel>
        ))}
      </section>

      {report.blackLineFee.note ? (
        <p className="text-xs text-ink-600">
          BlackLine revenue: {report.blackLineFee.note}{" "}
          <Link href="/settings" className="underline underline-offset-4 hover:text-ink-900">
            Record the commercial terms
          </Link>
          .
        </p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <div className="space-y-4">
          <SectionHeading title="High-intent leads this period" />
          <Panel>
            {report.highIntent.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-600">None in this period.</p>
            ) : (
              <ul className="divide-y divide-ink-1000/5">
                {report.highIntent.map((lead) => (
                  <li key={lead.id} className="flex items-center gap-4 px-5 py-3">
                    <ScoreBadge total={lead.score.total} max={lead.score.max} />
                    <Link href={`/leads/${lead.id}`} className="min-w-0 flex-1 truncate text-sm text-ink-900">
                      {lead.company.name}
                    </Link>
                    <span className="truncate text-xs text-ink-600">{lead.opportunity.projectLocation ?? "—"}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <SectionHeading title="Recurring opportunities" description="Relationships that could produce more than one booking." />
          <Panel>
            {report.recurringOpportunities.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-600">None identified yet.</p>
            ) : (
              <ul className="divide-y divide-ink-1000/5">
                {report.recurringOpportunities.map((entry) => (
                  <li key={entry.lead.id} className="px-5 py-3">
                    <Link href={`/leads/${entry.lead.id}`} className="text-sm text-ink-900">
                      {entry.lead.company.name}
                    </Link>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{entry.reason}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>

      {report.needingFollowUp.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading title="Needs follow-up" />
          <Panel>
            <ul className="divide-y divide-ink-1000/5">
              {report.needingFollowUp.map((lead) => (
                <li key={lead.id} className="flex items-center gap-4 px-5 py-3 text-sm">
                  <span className="metric w-28 shrink-0 text-xs text-ink-600">{lead.nextFollowUpOn}</span>
                  <Link href={`/leads/${lead.id}`} className="min-w-0 flex-1 truncate text-ink-900">
                    {lead.company.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      ) : null}

      <section className="space-y-4">
        <SectionHeading title="Plain text" description="For pasting into an email or a message." />
        <Panel>
          <CopyBlock text={reportToText(report, client.name)} />
        </Panel>
      </section>
    </div>
  );
}
