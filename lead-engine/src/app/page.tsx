import Link from "next/link";
import { getClient } from "@/lib/clients";
import { buildDashboard } from "@/lib/dashboard";
import { formatMoney, describeModel } from "@/lib/revenue/commercial";
import { SOURCE_TYPE_LABELS } from "@/lib/domain/types";
import { formatRelative, percent } from "@/lib/ui";
import { EmptyState, Eyebrow, Notice, Panel, ScoreBadge, SectionHeading, Stat, TierBadge } from "@/components/primitives";
import { markNotificationReadAction } from "./actions";

export default function DashboardPage() {
  const client = getClient();
  const data = buildDashboard(client);
  const notReady = data.integrations.filter((i) => !i.ready);

  return (
    <div className="space-y-10 pt-8">
      <header className="reveal space-y-3">
        <Eyebrow>Lead engine · {client.name}</Eyebrow>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Qualified accommodation opportunities, found and evidenced.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-700">
          BlackLine finds organisations with a genuine reason to need somewhere for their people to stay near{" "}
          {client.location.town}, qualifies them against the evidence, and hands the opportunity to {client.name}.
          Availability, pricing and booking stay with {client.name}.
        </p>
      </header>

      {notReady.length > 0 ? (
        <Notice tone="warn" title={`${notReady.length} ${notReady.length === 1 ? "capability" : "capabilities"} not configured`}>
          <ul className="mt-1 space-y-1">
            {notReady.map((i) => (
              <li key={i.key}>
                <span className="text-ink-800">{i.label}:</span> {i.detail}
              </li>
            ))}
          </ul>
          <Link href="/settings" className="mt-2 inline-block underline underline-offset-4">
            Open settings
          </Link>
        </Notice>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="New this week" value={data.newThisWeek} sub="Discovered in the last seven days" href="/leads" />
        <Stat
          label="High intent"
          value={data.tiers.high_intent}
          sub="Clear evidence of an active or imminent requirement"
          href="/leads?tier=high_intent"
        />
        <Stat label="Sent to client" value={data.handedOff} sub={`Handed to ${client.name}`} href="/handoff" />
        <Stat
          label="Bookings"
          value={data.revenue.bookings}
          sub={`${percent(data.revenue.bookings, data.funnel[0]?.count ?? 0)} of everything discovered`}
        />
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <Stat
          label="Booking revenue"
          value={formatMoney(data.revenue.bookingRevenue)}
          sub={`${data.revenue.nights} nights, ${data.revenue.guests} guests recorded`}
        />
        <Stat
          label="BlackLine revenue"
          value={data.fees.reason ? "Not available" : formatMoney(data.fees.total, data.fees.currency)}
          sub={data.fees.reason ?? `${describeModel(client.commercial)} · ${data.fees.counted} lead(s) counted`}
          href="/settings"
        />
        <Stat
          label="Conversion"
          value={percent(data.revenue.bookings, data.funnel[0]?.count ?? 0)}
          sub="Discovered opportunities that reached a booking"
        />
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Pipeline"
          description="Every stage a lead passes through, from the moment the engine found it to the booking Cambridge Mews closed."
        />
        <Panel>
          <ol className="grid divide-y divide-ink-1000/5 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
            {data.funnel.map((stage, index) => {
              const previous = data.funnel[index - 1]?.count;
              return (
                <li key={stage.key} className="px-5 py-5">
                  <p className="field-label">{stage.label}</p>
                  <p className="metric mt-2 text-2xl text-ink-900">{stage.count}</p>
                  {previous !== undefined ? (
                    <p className="mt-1 text-xs text-ink-600">{percent(stage.count, previous)} of previous stage</p>
                  ) : (
                    <p className="mt-1 text-xs text-ink-600">Everything found</p>
                  )}
                </li>
              );
            })}
          </ol>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr] [&>*]:min-w-0">
        <div className="space-y-4">
          <SectionHeading
            title="Waiting on your review"
            description="Automation prepares the lead. Nothing goes out, and nothing reaches the client, until you approve it."
            action={
              <Link
                href="/leads?approval=pending"
                className="rounded-full border border-ink-400 px-4 py-1.5 text-sm text-ink-800 transition-colors hover:border-ink-500 hover:text-ink-1000"
              >
                All leads
              </Link>
            }
          />
          <Panel innerClassName="overflow-hidden">
            {data.needsReview.length === 0 ? (
              <EmptyState
                title="Nothing waiting"
                body="When the engine finds an opportunity worth acting on, it appears here with the evidence behind it."
              />
            ) : (
              <ul className="divide-y divide-ink-1000/5">
                {data.needsReview.slice(0, 8).map((lead) => (
                  <li key={lead.id}>
                    <Link href={`/leads/${lead.id}`} className="row-link flex items-start gap-4 px-5 py-4">
                      <ScoreBadge total={lead.score.total} max={lead.score.max} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink-900">{lead.company.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-ink-600">{lead.signalSummary}</span>
                      </span>
                      <TierBadge tier={lead.tier} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <SectionHeading title="Alerts" />
          <Panel innerClassName="overflow-hidden">
            {data.notifications.length === 0 ? (
              <EmptyState title="No alerts yet" body="High-intent opportunities raise an alert here as soon as they are found." />
            ) : (
              <ul className="divide-y divide-ink-1000/5">
                {data.notifications.map((n) => (
                  <li key={n.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className={n.readAt ? "text-sm text-ink-600" : "text-sm font-medium text-ink-900"}>{n.title}</p>
                      {!n.readAt ? (
                        <form action={markNotificationReadAction}>
                          <input type="hidden" name="id" value={n.id} />
                          <button type="submit" className="field-label hover:text-ink-900">
                            Mark read
                          </button>
                        </form>
                      ) : null}
                    </div>
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-ink-600">{n.body}</p>
                    <p className="mt-2 flex items-center gap-2 text-[11px] text-ink-600">
                      <span>{formatRelative(n.createdAt)}</span>
                      {n.leadId ? (
                        <Link href={`/leads/${n.leadId}`} className="underline underline-offset-4 hover:text-ink-900">
                          Review lead
                        </Link>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Where the leads come from"
          description="The only question that matters here is which channel produces bookings, not which produces volume."
        />
        <Panel innerClassName="overflow-x-auto">
          {data.sources.length === 0 ? (
            <EmptyState title="No sources have produced leads yet" body="Run discovery to start populating this." />
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-ink-1000/5 text-left">
                  <th className="field-label px-5 py-3 font-normal">Source</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Leads</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Qualified</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Handed off</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Booked</th>
                  <th className="field-label px-5 py-3 text-right font-normal">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-1000/5">
                {data.sources.map((source) => (
                  <tr key={source.sourceType} className="row-link">
                    <td className="px-5 py-3 text-ink-900">{SOURCE_TYPE_LABELS[source.sourceType]}</td>
                    <td className="metric px-5 py-3 text-right text-ink-800">{source.leads}</td>
                    <td className="metric px-5 py-3 text-right text-ink-800">{source.qualified}</td>
                    <td className="metric px-5 py-3 text-right text-ink-800">{source.handedOff}</td>
                    <td className="metric px-5 py-3 text-right text-signal-good">{source.booked}</td>
                    <td className="metric px-5 py-3 text-right text-ink-800">{formatMoney(source.bookingRevenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </section>

      {data.runs.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading title="Recent discovery runs" action={<Link href="/discovery" className="text-sm text-ink-700 underline underline-offset-4 hover:text-ink-1000">Run discovery</Link>} />
          <Panel>
            <ul className="divide-y divide-ink-1000/5">
              {data.runs.map((run) => (
                <li key={run.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                  <span className="text-ink-800">
                    {formatRelative(run.startedAt)} · {run.trigger}
                  </span>
                  <span className="text-ink-600">
                    {run.leadsCreated} created · {run.duplicates} known · {run.rejected} rejected
                  </span>
                  <span className={run.status === "succeeded" ? "text-signal-good" : "text-signal-bad"}>{run.status}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      ) : null}
    </div>
  );
}
