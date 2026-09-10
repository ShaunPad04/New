"use client";

import { useId, useState, type FormEvent } from "react";
import { site } from "@/lib/content";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  autoComplete?: string;
  half?: boolean;
};

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "unconfigured" } | { state: "error"; message: string };

/**
 * Enquiry form — reference geometry: a #f6f6f6 panel with 20px radius and
 * 30px padding, labels above white inputs, 20px between rows, a full-width
 * black submit button.
 *
 * Honest states only: "sent" appears solely when the API confirms delivery.
 * On this preview the API returns 501, so the form explains that and shows
 * the telephone and email routes instead.
 */
export function EnquiryForm({
  kind,
  fields,
  submitLabel = "Submit",
  context,
  className,
  intro,
}: {
  kind: "enquiry" | "viewing" | "valuation" | "register";
  fields: Field[];
  submitLabel?: string;
  context?: Record<string, string>;
  className?: string;
  intro?: string;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(data: FormData) {
    const next: Record<string, string> = {};
    for (const f of fields) {
      const v = String(data.get(f.name) ?? "").trim();
      if (f.required && !v) next[f.name] = `Please enter your ${f.label.toLowerCase()}.`;
      else if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) next[f.name] = "Please enter a valid email address.";
      else if (f.type === "tel" && v && v.replace(/\D/g, "").length < 9) next[f.name] = "Please enter a valid telephone number.";
    }
    return next;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length) {
      const first = fields.find((f) => next[f.name]);
      if (first) form.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }
    setStatus({ state: "sending" });
    const payload: Record<string, string> = { kind, ...context };
    data.forEach((v, k) => { payload[k] = String(v); });
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.status === 501) { setStatus({ state: "unconfigured" }); return; }
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; delivered?: boolean; error?: string };
      if (res.ok && json.delivered) { setStatus({ state: "sent" }); form.reset(); return; }
      setStatus({ state: "error", message: json.error ?? "Something went wrong. Please call or email us instead." });
    } catch {
      setStatus({ state: "error", message: "We could not reach the server. Please call or email us instead." });
    }
  }

  if (status.state === "sent") {
    return (
      <div className={cn("rounded-[20px] bg-hairline p-[30px]", className)} role="status">
        <p className="h-sub">Thank you — your message has been received.</p>
        <p className="mt-3 text-slate">A member of the team will be in touch. If it is urgent, call us on <a className="text-ink underline" href={site.phoneHref}>{site.phone}</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("rounded-[20px] bg-hairline p-6 md:p-[30px]", className)} aria-describedby={`${id}-status`}>
      {intro ? <p className="mb-5 text-sm text-slate">{intro}</p> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const fid = `${id}-${f.name}`;
          const err = errors[f.name];
          const common = {
            id: fid,
            name: f.name,
            required: f.required,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${fid}-err` : undefined,
            autoComplete: f.autoComplete,
            placeholder: f.placeholder,
            className: cn(
              "w-full rounded-[12px] border bg-white px-4 py-3 text-sm text-ink placeholder:text-slate/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60",
              err ? "border-red-600" : "border-line/70 focus:border-ink/60"
            ),
          } as const;
          return (
            <div key={f.name} className={cn("flex flex-col gap-2", f.half ? "" : "sm:col-span-2")}>
              <label htmlFor={fid} className="text-sm text-slate">
                {f.label}{f.required ? <span aria-hidden="true">*</span> : null}
              </label>
              {f.type === "textarea" ? (
                <textarea {...common} rows={5} />
              ) : f.type === "select" ? (
                <select {...common} defaultValue="">
                  <option value="" disabled>Select…</option>
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input {...common} type={f.type ?? "text"} />
              )}
              {err ? <p id={`${fid}-err`} className="text-sm text-red-700">{err}</p> : null}
            </div>
          );
        })}
        {/* Honeypot — hidden from people, filled by bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate">
        * Required. Please read our <a href="/documents/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" className="underline">privacy notice (PDF)</a> for information on how we use your details.
      </p>

      <div className="mt-5">
        <Button type="submit" arrow={false} className="w-full justify-center" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending…" : submitLabel}
        </Button>
      </div>

      <div id={`${id}-status`} aria-live="polite" className="mt-4 text-sm">
        {status.state === "unconfigured" ? (
          <div className="rounded-[12px] border border-line/70 bg-white p-4 text-slate">
            <p className="font-medium text-ink">Online forms are not connected on this preview.</p>
            <p className="mt-1">
              Your message was not sent. Please call <a className="text-ink underline" href={site.phoneHref}>{site.phone}</a> ({site.openingHours}) or email <a className="text-ink underline break-all" href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </div>
        ) : null}
        {status.state === "error" ? (
          <p className="text-red-700">{status.message} Call <a className="underline" href={site.phoneHref}>{site.phone}</a> or email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        ) : null}
      </div>
    </form>
  );
}
