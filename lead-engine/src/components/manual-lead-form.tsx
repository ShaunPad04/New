"use client";

import { ActionForm, SubmitButton } from "./action-form";
import { createManualLeadAction } from "@/app/actions";
import type { SourceType } from "@/lib/domain/types";

const INPUT =
  "mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600";

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required,
  className,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="field-label">
        {label}
        {required ? " *" : ""}
      </span>
      <input name={name} type={type} placeholder={placeholder} required={required} className={INPUT} />
    </label>
  );
}

export function ManualLeadForm({
  sourceTypes,
  clientTown,
}: {
  sourceTypes: Record<SourceType, string>;
  clientTown: string;
}) {
  return (
    <ActionForm action={createManualLeadAction} className="px-5 py-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="companyName" label="Company" required placeholder="ABC Engineering Ltd" />
        <Field name="website" label="Website" type="url" placeholder="https://" />
        <Field name="industry" label="Industry" placeholder="Civil engineering" />
        <Field name="companyLocation" label="Company based in" placeholder="Manchester" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="contactName" label="Contact name" placeholder="Only if published somewhere" />
        <Field name="contactRole" label="Role" placeholder="Operations Manager" />
        <Field name="contactEmail" label="Business email" type="email" />
        <Field name="contactPhone" label="Phone" type="tel" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="projectName" label="Project" placeholder="Immingham jetty refurbishment" />
        <Field name="projectLocation" label="Work location" placeholder={`Immingham (near ${clientTown})`} />
      </div>

      <label className="block">
        <span className="field-label">What are they doing? *</span>
        <textarea name="summary" rows={3} required className={INPUT} placeholder="Two sentences on the work and where it is." />
      </label>

      <label className="block">
        <span className="field-label">Why might they need accommodation? *</span>
        <textarea
          name="signalSummary"
          rows={2}
          required
          className={INPUT}
          placeholder="One sentence. Phrase it as a possibility, not a certainty."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">Evidence statement *</span>
          <textarea
            name="evidenceStatement"
            rows={3}
            required
            className={INPUT}
            placeholder="A fact the source states, e.g. 'Eight fixed-term roles advertised at the Immingham site, six-month contracts.'"
          />
        </label>
        <Field name="evidenceUrl" label="Source URL" type="url" required placeholder="https://" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label>
          <span className="field-label">Lead type *</span>
          <select name="sourceType" defaultValue="referral" className={INPUT} required>
            {Object.entries(sourceTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="field-label">Accommodation signal *</span>
          <select name="accommodationStrength" defaultValue="temporary_roles" className={INPUT} required>
            <option value="explicit_request">They are openly looking for accommodation</option>
            <option value="travelling_workforce">Workers are travelling in from elsewhere</option>
            <option value="temporary_roles">Temporary or contract roles in the area</option>
            <option value="project_presence">They have work in the area</option>
            <option value="none">No signal</option>
          </select>
        </label>
        <label>
          <span className="field-label">Timing *</span>
          <select name="timingHorizon" defaultValue="unknown" className={INPUT} required>
            <option value="active_now">Under way now</option>
            <option value="starting_soon">Starting within two months</option>
            <option value="announced_future">Announced, further out</option>
            <option value="speculative">Speculative</option>
            <option value="unknown">Not established</option>
          </select>
        </label>
        <Field name="groupSize" label="People (if stated)" type="number" />
        <Field name="durationWeeks" label="Weeks (if stated)" type="number" />
      </div>

      <SubmitButton>Save lead</SubmitButton>
    </ActionForm>
  );
}
