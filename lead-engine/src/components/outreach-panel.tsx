"use client";

import { useState } from "react";
import { Panel, SectionHeading } from "./primitives";
import { ActionForm, SubmitButton } from "./action-form";
import { generateOutreachAction, saveOutreachDraftAction } from "@/app/actions";
import type { Lead } from "@/lib/domain/types";

const CHANNEL_LABELS = {
  email: "Email",
  linkedin: "LinkedIn",
  phone: "Phone",
  follow_up: "Follow-up",
} as const;

export function OutreachPanel({ lead }: { lead: Lead }) {
  const [active, setActive] = useState(0);
  const draft = lead.outreach[active];

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Outreach"
        description="Drafted from this lead's evidence. It asks whether they need accommodation — it never tells them they do."
      />
      <Panel>
        <div className="space-y-4 px-5 py-5">
          <ActionForm action={generateOutreachAction}>
            <input type="hidden" name="leadId" value={lead.id} />
            <SubmitButton variant={lead.outreach.length > 0 ? "ghost" : "primary"}>
              {lead.outreach.length > 0 ? "Redraft" : "Prepare outreach"}
            </SubmitButton>
          </ActionForm>

          {lead.outreach.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Outreach channels">
                {lead.outreach.map((item, index) => (
                  <button
                    key={`${item.channel}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={index === active}
                    onClick={() => setActive(index)}
                    className={
                      index === active
                        ? "rounded-full bg-ink-1000/10 px-3.5 py-1.5 text-sm text-ink-1000"
                        : "rounded-full px-3.5 py-1.5 text-sm text-ink-700 transition-colors hover:text-ink-900"
                    }
                  >
                    {CHANNEL_LABELS[item.channel]}
                    {item.edited ? " ·" : ""}
                  </button>
                ))}
              </div>

              {draft ? (
                <form action={saveOutreachDraftAction} className="space-y-3" key={active}>
                  <input type="hidden" name="leadId" value={lead.id} />
                  <input type="hidden" name="index" value={active} />
                  {draft.channel === "email" || draft.channel === "follow_up" ? (
                    <label className="block">
                      <span className="field-label">Subject</span>
                      <input
                        name="subject"
                        defaultValue={draft.subject ?? ""}
                        className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
                      />
                    </label>
                  ) : null}
                  <label className="block">
                    <span className="field-label">Message</span>
                    <textarea
                      name="body"
                      rows={14}
                      defaultValue={draft.body}
                      className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-3 font-mono text-[13px] leading-relaxed text-ink-900"
                    />
                  </label>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-ink-600">
                      Written {draft.generator === "ai" ? "from the evidence" : "from the standard template"}
                      {draft.edited ? ", edited by you" : ""}.
                    </p>
                    <SubmitButton variant="ghost">Save draft</SubmitButton>
                  </div>
                </form>
              ) : null}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-ink-600">
              No drafts yet. Preparing outreach writes an email, a LinkedIn message, a phone opening and a follow-up,
              all grounded in the verified evidence above.
            </p>
          )}
        </div>
      </Panel>
    </div>
  );
}
