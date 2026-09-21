"use client";

import { useState } from "react";
import { ActionForm, SubmitButton } from "./action-form";
import { saveCommercialModelAction } from "@/app/actions";
import type { CommercialModel } from "@/lib/clients/types";

const INPUT = "mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900";

const KINDS = [
  { value: "unconfigured", label: "Not agreed yet" },
  { value: "per_qualified_lead", label: "Per qualified lead" },
  { value: "per_booking", label: "Per booking" },
  { value: "percentage_commission", label: "Percentage commission" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export function CommercialForm({ current }: { current: CommercialModel }) {
  const [kind, setKind] = useState<CommercialModel["kind"]>(current.kind);
  const currency = "currency" in current ? current.currency : "GBP";

  const showLead = kind === "per_qualified_lead" || kind === "hybrid";
  const showBooking = kind === "per_booking" || kind === "hybrid";
  const showPercentage = kind === "percentage_commission" || kind === "hybrid";

  return (
    <ActionForm action={saveCommercialModelAction} className="px-5 py-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className="field-label">Model</span>
          <select
            name="kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as CommercialModel["kind"])}
            className={INPUT}
          >
            {KINDS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {kind !== "unconfigured" ? (
          <label>
            <span className="field-label">Currency</span>
            <input name="currency" defaultValue={currency} maxLength={3} className={`${INPUT} uppercase`} />
          </label>
        ) : null}
      </div>

      {kind !== "unconfigured" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {showLead ? (
            <label>
              <span className="field-label">Fee per qualified lead</span>
              <input
                name="feePerLead"
                type="number"
                min={0}
                step="0.01"
                defaultValue={"feePerLead" in current ? current.feePerLead : ""}
                className={INPUT}
              />
            </label>
          ) : null}
          {showBooking ? (
            <label>
              <span className="field-label">Fee per booking</span>
              <input
                name="feePerBooking"
                type="number"
                min={0}
                step="0.01"
                defaultValue={"feePerBooking" in current ? current.feePerBooking : ""}
                className={INPUT}
              />
            </label>
          ) : null}
          {showPercentage ? (
            <label>
              <span className="field-label">Commission %</span>
              <input
                name="percentage"
                type="number"
                min={0}
                max={100}
                step="0.1"
                defaultValue={"percentage" in current ? current.percentage : ""}
                className={INPUT}
              />
            </label>
          ) : null}
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-ink-600">
          Leaving this unset is the safe default. Fee and commission figures will show as unavailable, with the reason,
          rather than reporting a number that was never agreed.
        </p>
      )}

      <SubmitButton>Save terms</SubmitButton>
    </ActionForm>
  );
}
