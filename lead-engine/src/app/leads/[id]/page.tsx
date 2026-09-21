import Link from "next/link";
import { notFound } from "next/navigation";
import { getClient } from "@/lib/clients";
import { getLead } from "@/lib/db/leads";
import { TIER_LABELS } from "@/lib/domain/scoring";
import { STATUS_LABELS } from "@/lib/domain/status";
import { SOURCE_TYPE_LABELS, CLOSED_STATUSES, PIPELINE_STATUSES } from "@/lib/domain/types";
import { assessRecurring } from "@/lib/domain/recurring";
import { checkReadiness } from "@/lib/handoff/pack";
import { feeForLead, formatMoney } from "@/lib/revenue/commercial";
import { formatDate, formatRelative } from "@/lib/ui";
import { Eyebrow, Notice, Panel, ScoreBadge, SectionHeading, StatusPill, TierBadge } from "@/components/primitives";
import { ActionForm, SubmitButton } from "@/components/action-form";
import { OutreachPanel } from "@/components/outreach-panel";
import {
  recordBookingAction,
  saveLeadNotesAction,
  sendToCambridgeMewsAction,
  setApprovalAction,
  setStatusAction,
} from "@/app/actions";

function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) notFound();

  const client = getClient(lead.clientId);
  const verified = lead.evidence.filter((e) => e.kind === "verified");
  const inferences = lead.evidence.filter((e) => e.kind === "inference");
  const unknowns = lead.evidence.filter((e) => e.kind === "unknown");
  const recurring = assessRecurring(lead);
  const readiness = checkReadiness(lead, client);
  const fee = feeForLead(lead, client.commercial);
  const size = lead.qualification.groupSize;
  const people = size.max ?? size.min;

  const nextStatuses = PIPELINE_STATUSES.filter(
    (s) => PIPELINE_STATUSES.indexOf(s) === PIPELINE_STATUSES.indexOf(lead.status as never) + 1,
  );

  return (
    <div className="space-y-8 pt-8">
      <nav className="text-xs text-ink-600">
        <Link href="/leads" className="underline underline-offset-4 hover:text-ink-900">
          Leads
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{lead.company.name}</span>
      </nav>

      <header className="reveal flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <TierBadge tier={lead.tier} />
            <StatusPill status={lead.status} />
            <Eyebrow>{SOURCE_TYPE_LABELS[lead.sourceType]}</Eyebrow>
          </div>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {lead.company.name}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-700">{lead.opportunity.summary}</p>
          {lead.company.website ? (
            <a
              href={lead.company.website}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block text-sm text-ink-700 underline underline-offset-4 hover:text-ink-1000"
            >
              {lead.company.website}
            </a>
          ) : null}
        </div>
        <Panel className="w-full sm:w-auto sm:shrink-0">
          <div className="px-6 py-5 sm:text-right">
            <p className="field-label">Lead score</p>
            <ScoreBadge total={lead.score.total} max={lead.score.max} size="lg" />
            <p className="mt-1 text-xs text-ink-600">{TIER_LABELS[lead.tier].blurb}</p>
          </div>
        </Panel>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Work location", value: lead.opportunity.projectLocation ?? "Not established" },
          { label: "People", value: people ? String(people) : "Not established" },
          {
            label: "Duration",
            value: lead.qualification.duration.weeks ? `${lead.qualification.duration.weeks} weeks` : "Not established",
          },
          {
            label: "Timing",
            value: sentenceCase(lead.qualification.timing.horizon.replaceAll("_", " ")),
          },
        ].map((item) => (
          <Panel key={item.label}>
            <div className="px-5 py-4">
              <p className="field-label">{item.label}</p>
              <p className="mt-1.5 text-sm text-ink-900">{item.value}</p>
            </div>
          </Panel>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
        <div className="space-y-6">
          <div className="space-y-4">
            <SectionHeading
              title="Evidence"
              description="What a source actually says, what we concluded from it, and what nobody has established. These are never mixed."
            />
            <Panel>
              <div className="space-y-6 px-5 py-5">
                <div>
                  <p className="field-label">Verified — stated by a source</p>
                  {verified.length === 0 ? (
                    <p className="mt-2 text-sm text-signal-bad">
                      No verified evidence. This lead cannot be handed over in this state.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-3">
                      {verified.map((e) => (
                        <li key={e.id} className="border-l-2 border-signal-good/40 pl-3">
                          <p className="text-sm leading-relaxed text-ink-900">{e.statement}</p>
                          {e.sourceUrl ? (
                            <a
                              href={e.sourceUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="mt-1 block truncate text-xs text-ink-600 underline underline-offset-4 hover:text-ink-800"
                            >
                              {e.sourceTitle ?? e.sourceUrl}
                              {e.observedAt ? ` · ${e.observedAt}` : ""}
                            </a>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <p className="field-label">Our inference — not confirmed</p>
                  {inferences.length === 0 ? (
                    <p className="mt-2 text-sm text-ink-600">None recorded.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {inferences.map((e) => (
                        <li key={e.id} className="border-l-2 border-signal-potential/40 pl-3 text-sm leading-relaxed text-ink-800">
                          {e.statement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <p className="field-label">Not established</p>
                  {unknowns.length === 0 ? (
                    <p className="mt-2 text-sm text-ink-600">Nothing flagged.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {unknowns.map((e) => (
                        <li key={e.id} className="border-l-2 border-ink-500 pl-3 text-sm leading-relaxed text-ink-700">
                          {e.statement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <SectionHeading
              title="Why it scores what it scores"
              description={`Rubric ${lead.score.rubricVersion}. A component with no evidence cited against it scores zero, whatever the model thought.`}
            />
            <Panel>
              <ul className="divide-y divide-ink-1000/5">
                {lead.score.components.map((component) => (
                  <li key={component.key} className="px-5 py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm text-ink-900">{component.label}</p>
                      <p className="metric shrink-0 text-sm text-ink-800">
                        {component.points}
                        <span className="text-ink-600">/{component.max}</span>
                      </p>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-300">
                      <div
                        className="h-full rounded-full bg-ink-700"
                        style={{ width: `${(component.points / component.max) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-ink-600">{component.reason}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <OutreachPanel lead={lead} />
        </div>

        <aside className="space-y-6">
          <Panel>
            <div className="space-y-4 px-5 py-5">
              <p className="field-label">Contact</p>
              {lead.contact.name || lead.contact.email || lead.contact.phone ? (
                <dl className="space-y-2 text-sm">
                  {lead.contact.name ? (
                    <div>
                      <dt className="text-ink-600">Name</dt>
                      <dd className="text-ink-900">
                        {lead.contact.name}
                        {lead.contact.role ? `, ${lead.contact.role}` : ""}
                      </dd>
                    </div>
                  ) : null}
                  {lead.contact.email ? (
                    <div>
                      <dt className="text-ink-600">Email</dt>
                      <dd>
                        <a href={`mailto:${lead.contact.email}`} className="text-ink-900 underline underline-offset-4">
                          {lead.contact.email}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                  {lead.contact.phone ? (
                    <div>
                      <dt className="text-ink-600">Phone</dt>
                      <dd className="text-ink-900">{lead.contact.phone}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : (
                <p className="text-sm text-ink-600">
                  No decision maker identified. Contact details are only recorded when a source publishes them — nothing
                  here is guessed.
                </p>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="space-y-2 px-5 py-5">
              <p className="field-label">Recurring potential</p>
              <p
                className={
                  recurring.value === "yes"
                    ? "text-sm font-medium text-signal-good"
                    : recurring.value === "no"
                      ? "text-sm text-ink-700"
                      : "text-sm text-ink-800"
                }
              >
                {recurring.value.toUpperCase()}
              </p>
              <p className="text-xs leading-relaxed text-ink-600">{recurring.reason}</p>
            </div>
          </Panel>

          <Panel>
            <div className="space-y-4 px-5 py-5">
              <p className="field-label">Review</p>
              <p className="text-sm text-ink-700">
                Approval is {lead.approval}. Nothing reaches {client.name} without it.
              </p>
              <div className="flex flex-wrap gap-2">
                <form action={setApprovalAction}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <input type="hidden" name="approval" value="approved" />
                  <SubmitButton variant={lead.approval === "approved" ? "ghost" : "primary"}>Approve</SubmitButton>
                </form>
                <form action={setApprovalAction}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <input type="hidden" name="approval" value="rejected" />
                  <SubmitButton variant="danger">Reject</SubmitButton>
                </form>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="space-y-4 px-5 py-5">
              <p className="field-label">Move the lead on</p>
              <ActionForm action={setStatusAction}>
                <input type="hidden" name="leadId" value={lead.id} />
                <select
                  name="status"
                  defaultValue={nextStatuses[0] ?? "contacted"}
                  className="w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
                >
                  <optgroup label="Pipeline">
                    {PIPELINE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Closed">
                    {CLOSED_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <input
                  name="detail"
                  placeholder="What happened? (optional)"
                  className="w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600"
                />
                <SubmitButton variant="ghost">Update status</SubmitButton>
              </ActionForm>
            </div>
          </Panel>

          <Panel>
            <div className="space-y-4 px-5 py-5">
              <p className="field-label">Send to {client.name}</p>
              {lead.handoffSentAt ? (
                <Notice tone="info" title={`Sent on ${formatDate(lead.handoffSentAt)}`}>
                  <Link href={`/handoff?lead=${lead.id}`} className="underline underline-offset-4">
                    View the handoff pack
                  </Link>
                </Notice>
              ) : (
                <>
                  {readiness.blockers.length > 0 ? (
                    <Notice tone="warn" title="Not ready yet">
                      <ul className="list-disc space-y-0.5 pl-4">
                        {readiness.blockers.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    </Notice>
                  ) : null}
                  {readiness.warnings.length > 0 ? (
                    <ul className="list-disc space-y-0.5 pl-4 text-xs text-ink-600">
                      {readiness.warnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  ) : null}
                  <ActionForm action={sendToCambridgeMewsAction}>
                    <input type="hidden" name="leadId" value={lead.id} />
                    <SubmitButton>Send to {client.name}</SubmitButton>
                  </ActionForm>
                </>
              )}
            </div>
          </Panel>

          <Panel>
            <div className="space-y-4 px-5 py-5">
              <p className="field-label">Booking</p>
              <ActionForm action={recordBookingAction}>
                <input type="hidden" name="leadId" value={lead.id} />
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-ink-600">
                    Value
                    <input
                      name="value"
                      type="number"
                      min={0}
                      step="0.01"
                      defaultValue={lead.booking?.value ?? ""}
                      className="mt-1 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
                    />
                  </label>
                  <label className="text-xs text-ink-600">
                    Currency
                    <input
                      name="currency"
                      defaultValue={lead.booking?.currency ?? "GBP"}
                      maxLength={3}
                      className="mt-1 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm uppercase text-ink-900"
                    />
                  </label>
                  <label className="text-xs text-ink-600">
                    Nights
                    <input
                      name="nights"
                      type="number"
                      min={0}
                      defaultValue={lead.booking?.nights ?? ""}
                      className="mt-1 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
                    />
                  </label>
                  <label className="text-xs text-ink-600">
                    Guests
                    <input
                      name="guests"
                      type="number"
                      min={0}
                      defaultValue={lead.booking?.guests ?? ""}
                      className="mt-1 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
                    />
                  </label>
                </div>
                <SubmitButton variant="ghost">Record booking</SubmitButton>
              </ActionForm>
              <p className="text-xs leading-relaxed text-ink-600">
                BlackLine fee:{" "}
                {fee.known ? (
                  <span className="text-ink-900">
                    {formatMoney(fee.amount, fee.currency)} — {fee.explanation}
                  </span>
                ) : (
                  <span>{fee.reason}</span>
                )}
              </p>
            </div>
          </Panel>

          <Panel>
            <form action={saveLeadNotesAction} className="space-y-3 px-5 py-5">
              <input type="hidden" name="leadId" value={lead.id} />
              <label className="block">
                <span className="field-label">BlackLine notes</span>
                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={lead.notes ?? ""}
                  placeholder="Anything the client should know."
                  className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600"
                />
              </label>
              <label className="block">
                <span className="field-label">Follow up on</span>
                <input
                  name="nextFollowUpOn"
                  type="date"
                  defaultValue={lead.nextFollowUpOn ?? ""}
                  className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
                />
              </label>
              <SubmitButton variant="ghost">Save</SubmitButton>
            </form>
          </Panel>
        </aside>
      </section>

      <section className="space-y-4">
        <SectionHeading title="History" />
        <Panel>
          <ul className="divide-y divide-ink-1000/5">
            {[...lead.history].reverse().map((entry, index) => (
              <li key={`${entry.at}-${index}`} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-5 py-3 text-sm">
                <span className="metric w-32 shrink-0 text-xs text-ink-600">{formatRelative(entry.at)}</span>
                <span className="text-ink-900">{entry.event}</span>
                {entry.detail ? <span className="text-xs text-ink-600">{entry.detail}</span> : null}
                <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.1em] text-ink-600">
                  {entry.actor}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  );
}
