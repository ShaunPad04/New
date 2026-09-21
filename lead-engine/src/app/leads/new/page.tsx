import { getClient } from "@/lib/clients";
import { SOURCE_TYPE_LABELS } from "@/lib/domain/types";
import { Eyebrow, Notice, Panel } from "@/components/primitives";
import { ManualLeadForm } from "@/components/manual-lead-form";

export default function NewLeadPage() {
  const client = getClient();
  return (
    <div className="space-y-8 pt-8">
      <header className="space-y-3">
        <Eyebrow>Manual entry</Eyebrow>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Add a lead by hand</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-700">
          For referrals, conversations and anything the automation could not reach. It is scored on the same rubric —
          which means it needs a source, like every other lead.
        </p>
      </header>

      <Notice tone="info" title="A source is required">
        A lead with no evidence scores zero on every component and is disqualified. Put the URL of whatever you are
        working from — the job advert, the contract award, the press release — in the evidence field.
      </Notice>

      <Panel>
        <ManualLeadForm sourceTypes={SOURCE_TYPE_LABELS} clientTown={client.location.town} />
      </Panel>
    </div>
  );
}
