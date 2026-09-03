"use client";

import { useState } from "react";
import { site } from "@/lib/content";
import { RevealWords } from "@/components/reveal";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Enquiry form.
 *
 * IMPORTANT — the form does NOT fake a success state. It posts to
 * /api/enquiry, which returns 501 until a delivery provider is configured
 * (see that route). If delivery is not wired up, the user is told so and
 * given the direct email address, rather than being shown a green tick for a
 * message that went nowhere. A form that silently discards enquiries is the
 * single most damaging bug a marketing site can ship.
 */
export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setMessage("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.ok) {
        setStatus("sent");
        setMessage("Thank you — we will reply within one working day.");
        return;
      }

      setStatus("error");
      setMessage(
        body.error ??
          `Something went wrong. Please email us directly at ${site.email}.`
      );
    } catch {
      setStatus("error");
      setMessage(
        `We could not send that. Please email us directly at ${site.email}.`
      );
    }
  }

  const field =
    "w-full border-b border-ink-400 bg-transparent py-4 text-ink-1000 placeholder:text-ink-600 transition-colors duration-300 focus:border-ink-1000 focus:outline-none";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Start a project</p>
            <h2
              id="contact-heading"
              className="display text-display-lg text-ink-1000"
            >
              <RevealWords text="Tell us what you are building." />
            </h2>
            <p className="lede mt-8 max-w-[42ch]">
              A short note is enough to start. We reply to every enquiry within
              one working day, and we will tell you honestly if we are not the
              right studio for it.
            </p>

            <div className="mt-12 border-t border-ink-300 pt-8">
              <p className="eyebrow mb-3">Direct</p>
              <a
                href={`mailto:${site.email}`}
                className="text-lg tracking-tight text-ink-1000 underline decoration-ink-500 underline-offset-8 transition-colors duration-300 hover:decoration-ink-1000"
              >
                {site.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={onSubmit} className="space-y-8" noValidate={false}>
              {/* Honeypot — bots fill it, humans never see it. */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <label htmlFor="company-website">Leave this empty</label>
                <input
                  id="company-website"
                  name="company-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name" className="eyebrow mb-2 block">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={field}
                  placeholder="Jane Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="eyebrow mb-2 block">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={field}
                  placeholder="jane@company.co.uk"
                />
              </div>

              <div>
                <label htmlFor="budget" className="eyebrow mb-2 block">
                  Approximate budget
                </label>
                <select id="budget" name="budget" className={field} defaultValue="">
                  <option value="" disabled>
                    Select a range
                  </option>
                  <option value="1500-3500">
                    {site.currencySymbol}1,500 – {site.currencySymbol}3,500
                  </option>
                  <option value="3500-6000">
                    {site.currencySymbol}3,500 – {site.currencySymbol}6,000
                  </option>
                  <option value="6000+">
                    {site.currencySymbol}6,000+
                  </option>
                  <option value="unsure">Not sure yet</option>
                </select>
              </div>

              <div>
                <label htmlFor="brief" className="eyebrow mb-2 block">
                  What are you building?
                </label>
                <textarea
                  id="brief"
                  name="brief"
                  required
                  rows={4}
                  className={`${field} resize-none`}
                  placeholder="A sentence or two is plenty."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="inline-flex items-center gap-3 rounded-full bg-ink-1000 px-8 py-4 text-sm font-medium tracking-tight text-ink-0 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
                <span aria-hidden="true">→</span>
              </button>

              {/* Result is announced, and an error is never dressed as success. */}
              <p
                aria-live="polite"
                className={
                  status === "error"
                    ? "text-sm text-ink-1000"
                    : "text-sm text-ink-700"
                }
              >
                {message}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
