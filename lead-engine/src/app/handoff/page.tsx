import Link from "next/link";
import { getClient } from "@/lib/clients";
import { getLead, listLeads } from "@/lib/db/leads";
import { buildPack, checkReadiness, packToText } from "@/lib/handoff/pack";
import { formatDate } from "@/lib/ui";
import { Eyebrow, EmptyState, Notice, Panel, ScoreBadge, SectionHeading, StatusPill } from "@/components/primitives";
import { CopyBlock } from "@/components/copy-block";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HandoffPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selectedId = Array.isArray(params.lead) ? params.lead[0] : params.lead;
  const client = getClient();

  const { leads: ready } = listLeads({ clientId: client.id, approval: "approved", handedOff: false, limit: 50 });
  const { leads: sent } = listLeads({ clientId: client.id, handedOff: true, sort: "updated", limit: 50 });

  const selected = selectedId ? getLead(selectedId) : undefined;
  const pack = selected ? buildPack(selected, client) : undefined;

  return (
    <div className="space-y-10 pt-8">
      <header className="space-y-3">
        <Eyebrow>Handoff to {client.name}</Eyebrow>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          Everything they need to pick the conversation up.
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-700">
          The pack carries the prospect, the opportunity, the evidence behind it, what we inferred rather than
          confirmed, and what nobody has established. {client.name} handles availability, pricing, quoting and booking
          from there.
        </p>
      </header>

      {client.routing.handoffRecipients.length === 0 ? (
        <Notice tone="warn" title={`No recipient recorded for ${client.name}`}>
          Packs have to be sent by hand until someone records who they go to. Nothing here invents an address.
        </Notice>
      ) : null}

      {pack && selected ? (
        <section className="space-y-4">
          <SectionHeading
            title={`Pack — ${selected.company.name}`}
            description={
              selected.handoffSentAt
                ? `Sent on ${formatDate(selected.handoffSentAt)}.`
                : "Not yet sent. Send it from the lead page once you are happy with it."
            }
            action={
              <Link href={`/leads/${selected.id}`} className="text-sm text-ink-700 underline underline-offset-4 hover:text-ink-1000">
                Open lead
              </Link>
            }
          />
          <Panel>
            <CopyBlock text={packToText(pack)} />
          </Panel>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <div className="space-y-4">
          <SectionHeading title="Approved, not yet sent" description="Approved by BlackLine and waiting to go over." />
          <Panel>
            {ready.length === 0 ? (
              <EmptyState title="Nothing waiting" body="Approve a lead on its detail page and it appears here." />
            ) : (
              <ul className="divide-y divide-ink-1000/5">
                {ready.map((lead) => {
                  const readiness = checkReadiness(lead, client);
                  return (
                    <li key={lead.id} className="px-5 py-4">
                      <div className="flex items-start gap-4">
                        <ScoreBadge total={lead.score.total} max={lead.score.max} />
                        <div className="min-w-0 flex-1">
                          <Link href={`/leads/${lead.id}`} className="block truncate text-sm font-medium text-ink-900">
                            {lead.company.name}
                          </Link>
                          <p className="truncate text-xs text-ink-600">
                            {lead.opportunity.projectLocation ?? "Location not established"}
                          </p>
                        </div>
                        <Link
                          href={`/handoff?lead=${lead.id}`}
                          className="shrink-0 rounded-full border border-ink-400 px-3 py-1 text-xs text-ink-800 hover:border-ink-500 hover:text-ink-1000"
                        >
                          Preview pack
                        </Link>
                      </div>
                      {readiness.warnings.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-ink-600">
                          {readiness.warnings.map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <SectionHeading title="Already sent" description="What happened after handoff is tracked on each lead." />
          <Panel>
            {sent.length === 0 ? (
              <EmptyState title="Nothing handed over yet" body="Sent leads and their outcomes appear here." />
            ) : (
              <ul className="divide-y divide-ink-1000/5">
                {sent.map((lead) => (
                  <li key={lead.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <Link href={`/leads/${lead.id}`} className="block truncate text-sm font-medium text-ink-900">
                        {lead.company.name}
                      </Link>
                      <p className="text-xs text-ink-600">Sent {formatDate(lead.handoffSentAt)}</p>
                    </div>
                    <StatusPill status={lead.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>
    </div>
  );
}
