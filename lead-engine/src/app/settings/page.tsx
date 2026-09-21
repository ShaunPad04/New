import { getClient } from "@/lib/clients";
import { integrationStatus } from "@/lib/dashboard";
import { describeModel } from "@/lib/revenue/commercial";
import { SUPPORTED_PROVIDERS } from "@/lib/discovery/provider";
import { Eyebrow, Notice, Panel, SectionHeading } from "@/components/primitives";
import { CommercialForm } from "@/components/commercial-form";

export default function SettingsPage() {
  const client = getClient();
  const integrations = integrationStatus();

  return (
    <div className="space-y-10 pt-8">
      <header className="space-y-3">
        <Eyebrow>Configuration</Eyebrow>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Settings</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-700">
          What the engine can currently do, who it is working for, and on what terms.
        </p>
      </header>

      <section className="space-y-4">
        <SectionHeading title="Capabilities" description="Set through environment variables. See .env.example." />
        <Panel>
          <ul className="divide-y divide-ink-1000/5">
            {integrations.map((item) => (
              <li key={item.key} className="flex items-start gap-4 px-5 py-4">
                <span
                  aria-hidden="true"
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${item.ready ? "bg-signal-good" : "bg-signal-bad"}`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900">
                    {item.label}
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-600">
                      {item.ready ? "ready" : "not configured"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <p className="text-xs text-ink-600">
          Supported search providers: {SUPPORTED_PROVIDERS.join(", ")}.
        </p>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Commercial terms"
          description="BlackLine's fee. Until this is recorded, every revenue figure reads as unavailable rather than guessing."
        />
        {client.commercial.kind === "unconfigured" ? (
          <Notice tone="warn" title="No terms recorded">
            The agreement between BlackLine and {client.name} has not been entered. Record it here once it is agreed —
            never assume it.
          </Notice>
        ) : (
          <Notice tone="info" title={`Current terms: ${describeModel(client.commercial)}`} />
        )}
        <Panel>
          <CommercialForm current={client.commercial} />
        </Panel>
      </section>

      <section className="space-y-4">
        <SectionHeading title={client.name} description="The client this engine is currently generating leads for." />
        <Panel>
          <dl className="grid gap-x-8 gap-y-4 px-5 py-5 sm:grid-cols-2">
            {[
              { label: "Website", value: client.website },
              { label: "Service", value: client.service },
              { label: "Location", value: `${client.location.town}, ${client.location.region}` },
              { label: "Handoff method", value: client.routing.handoffMethod },
              {
                label: "Handoff recipients",
                value:
                  client.routing.handoffRecipients.length > 0
                    ? client.routing.handoffRecipients.join(", ")
                    : "None recorded — packs must be sent by hand",
              },
              { label: "Outreach sender", value: `${client.outreach.senderName} · ${client.outreach.senderEmail}` },
              { label: "Notify at score", value: String(client.qualification.notifyAtScore) },
              { label: "Outreach floor", value: String(client.qualification.minimumScoreForOutreach) },
            ].map((item) => (
              <div key={item.label}>
                <dt className="field-label">{item.label}</dt>
                <dd className="mt-1 text-sm text-ink-900">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Ideal customer profiles"
          description="Who the engine looks for, and why each type tends to need somewhere for people to stay."
        />
        <Panel>
          <ul className="divide-y divide-ink-1000/5">
            {client.idealCustomerProfiles.map((profile) => (
              <li key={profile.id} className="px-5 py-4">
                <p className="text-sm font-medium text-ink-900">{profile.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{profile.description}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-600">{profile.accommodationRationale}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <section className="space-y-4">
        <SectionHeading title="Target industries" />
        <div className="flex flex-wrap gap-2">
          {client.targetIndustries.map((industry) => (
            <span key={industry} className="rounded-full border border-ink-400 bg-ink-200 px-3 py-1 text-xs text-ink-800">
              {industry}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
