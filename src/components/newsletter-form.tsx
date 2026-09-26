"use client";

import { useId, useState } from "react";
import { Brackets } from "@/components/nocta-ui";

/**
 * Newsletter sign-up (footer). Posts to /api/newsletter — same origin, so
 * no third-party request and no cookie. The consent box is required and
 * unticked by default: consent to marketing email has to be an active
 * choice (PECR / UK GDPR), and the route rejects a submission without it.
 * Wording approved by Brad, 2026-09-26 (no frequency promise).
 */
export function NewsletterForm() {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          consent: data.get("consent") === "on",
          company: data.get("company"),
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setState("done");
        setMessage("You're subscribed. Unsubscribe from any email, at any time.");
        form.reset();
      } else {
        setState("error");
        setMessage(json.error || "Something went wrong. Please try again later.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again later.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="max-w-[24rem]">
      <p id={`${id}-label`} className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600">
        Subscribe to our newsletter.
      </p>
      <div className="relative mt-4 flex border border-ink-300">
        <Brackets />
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          aria-describedby={`${id}-note ${id}-status`}
          className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-[0.9375rem] text-ink-1000 placeholder:text-ink-600 focus:outline-none"
        />
        {/* Honeypot — hidden from people and assistive tech. */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Subscribe"
          className="group relative m-1.5 flex w-11 items-center justify-center overflow-hidden border border-ink-300 text-ink-1000 disabled:opacity-60"
        >
          <Brackets />
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:rotate-45">
            ↗
          </span>
        </button>
      </div>
      <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-ink-700">
        <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-white" />
        <span id={`${id}-note`}>
          Occasional notes from the studio. By subscribing you agree to receive
          them. Unsubscribe from any email, at any time. We use your address
          for nothing else.
        </span>
      </label>
      <p id={`${id}-status`} role="status" aria-live="polite" className={state === "error" ? "mt-3 text-xs text-ink-1000" : "mt-3 text-xs text-ink-800"}>
        {state === "sending" ? "Subscribing…" : message}
      </p>
    </form>
  );
}
