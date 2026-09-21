"use client";

import { ActionForm, SubmitButton } from "./action-form";
import { runDiscoveryAction } from "@/app/actions";
import { SOURCE_TYPE_LABELS } from "@/lib/domain/types";
import type { ClientConfig } from "@/lib/clients/types";

export function DiscoveryForm({ client }: { client: ClientConfig }) {
  return (
    <ActionForm action={runDiscoveryAction} className="px-5 py-5">
      <fieldset>
        <legend className="field-label">Sources</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {client.discovery.map((source) => (
            <label key={source.sourceType} className="flex items-start gap-2.5 rounded-lg border border-ink-400 bg-ink-200 px-3 py-2.5">
              <input
                type="checkbox"
                name="sources"
                value={source.sourceType}
                defaultChecked
                className="mt-0.5 size-4 accent-ink-900"
              />
              <span className="min-w-0">
                <span className="block text-sm text-ink-900">{SOURCE_TYPE_LABELS[source.sourceType]}</span>
                <span className="block truncate text-xs text-ink-600">{source.label}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className="field-label">Minimum score</span>
          <input
            name="minScore"
            type="number"
            min={0}
            max={100}
            defaultValue={client.qualification.minimumScoreForOutreach}
            className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
          />
        </label>
        <label>
          <span className="field-label">Pages to analyse (cost ceiling)</span>
          <input
            name="maxPages"
            type="number"
            min={1}
            max={120}
            defaultValue={40}
            className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <label>
          <span className="field-label">Your own search (optional)</span>
          <input
            name="extraQuery"
            placeholder="e.g. cable laying contract Immingham 2026 workforce"
            className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-600"
          />
        </label>
        <label>
          <span className="field-label">File it under</span>
          <select
            name="extraSourceType"
            defaultValue="manual"
            className="mt-1.5 w-full rounded-lg border border-ink-400 bg-ink-200 px-3 py-2 text-sm text-ink-900"
          >
            {Object.entries(SOURCE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <SubmitButton>Find opportunities</SubmitButton>
      <p className="text-xs leading-relaxed text-ink-600">
        Each page found is fetched politely (robots.txt is respected), read for evidence, and either recorded with its
        sources or rejected with a reason. Nothing is written to the database without a citation.
      </p>
    </ActionForm>
  );
}
