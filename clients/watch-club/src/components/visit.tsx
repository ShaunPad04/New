"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { business, enquiry } from "@/lib/content";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

/**
 * Visit and enquire.
 *
 * The form reports exactly what happened. On this preview /api/enquiry
 * returns 501 because no delivery endpoint is configured, and the visitor is
 * told that and handed the phone number and email address — rather than
 * being shown a "thank you" for a message that went nowhere.
 */
export function Visit() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "sending" });

    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setStatus({ state: "sent" });
        return;
      }

      const payload = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      setStatus({
        state: "error",
        message:
          payload?.error ??
          "We could not send that just now. Please call or email us.",
      });
    } catch {
      setStatus({
        state: "error",
        message:
          "We could not reach the server. Please call or email us directly.",
      });
    }
  }

  return (
    <section
      id="visit"
      className="scroll-mt-24 border-t border-obsidian-line bg-obsidian-raised py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {/* --------------------------------------------------- details */}
          <div>
            <Reveal>
              <div className="rule-accent mb-8 w-24" />
              <p className="eyebrow mb-5">{enquiry.eyebrow}</p>
              <h2 className="display-lg text-bone">{enquiry.headline}</h2>
              <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-bone-dim">
                {enquiry.body}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="mt-12 flex flex-col gap-8">
                <div>
                  <dt className="spec-label">Address</dt>
                  <dd className="mt-3">
                    <address className="not-italic text-base leading-relaxed text-bone">
                      {business.address.street}
                      <br />
                      {business.address.locality} {business.address.postcode}
                    </address>
                    <p className="mt-2 text-sm text-bone-muted">
                      Nearest station: {business.nearestStation}
                    </p>
                  </dd>
                </div>

                <div>
                  <dt className="spec-label">Opening hours</dt>
                  <dd className="mt-3 text-base text-bone">{business.hours}</dd>
                  <dd className="mt-1 text-sm text-bone-muted">
                    {business.appointment}
                  </dd>
                </div>

                <div>
                  <dt className="spec-label">Telephone</dt>
                  <dd className="mt-3">
                    <a
                      href={business.phoneHref}
                      className="text-base text-bone underline decoration-obsidian-line underline-offset-4 transition-colors duration-300 hover:text-champagne hover:decoration-champagne"
                    >
                      {business.phone}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="spec-label">Email</dt>
                  <dd className="mt-3">
                    <a
                      href={`mailto:${business.email}`}
                      className="text-base text-bone underline decoration-obsidian-line underline-offset-4 transition-colors duration-300 hover:text-champagne hover:decoration-champagne"
                    >
                      {business.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* ------------------------------------------------------ form */}
          <Reveal delay={0.12}>
            <div className="bezel">
              <div className="bezel-core p-7 sm:p-9">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex flex-col gap-6">
                    <Field
                      id="name"
                      label="Your name"
                      type="text"
                      autoComplete="name"
                    />
                    <Field
                      id="email"
                      label="Email address"
                      type="email"
                      autoComplete="email"
                    />

                    <div>
                      <label htmlFor="message" className="spec-label">
                        What are you looking for?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="mt-3 w-full resize-y rounded-lg border border-obsidian-line bg-obsidian px-4 py-3 text-[0.9375rem] text-bone placeholder:text-bone-muted/60 focus:border-champagne/60 focus:outline-none"
                        placeholder="A reference, a period, or something you would like us to look for."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status.state === "sending"}
                      className="group inline-flex items-center justify-between rounded-full bg-bone py-2 pl-6 pr-2 text-sm font-medium text-obsidian transition-colors duration-300 hover:bg-white disabled:opacity-60"
                    >
                      {status.state === "sending" ? "Sending…" : "Send enquiry"}
                      <span className="grid size-9 place-items-center rounded-full bg-obsidian text-bone transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 11L11 3M11 3H4.5M11 3v6.5"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>

                  {/* Announced, not merely displayed. */}
                  <p role="status" aria-live="polite" className="mt-5 text-sm">
                    {status.state === "sent" ? (
                      <span className="text-champagne">
                        Thank you — we will be in touch shortly.
                      </span>
                    ) : null}
                    {status.state === "error" ? (
                      <span className="text-bone-dim">
                        {status.message}{" "}
                        <a
                          href={business.phoneHref}
                          className="text-champagne underline underline-offset-4"
                        >
                          {business.phone}
                        </a>{" "}
                        <span className="text-bone-muted">or</span>{" "}
                        <a
                          href={`mailto:${business.email}`}
                          className="text-champagne underline underline-offset-4"
                        >
                          {business.email}
                        </a>
                      </span>
                    ) : null}
                  </p>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  type,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="spec-label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-3 w-full rounded-lg border border-obsidian-line bg-obsidian px-4 py-3 text-[0.9375rem] text-bone placeholder:text-bone-muted/60 focus:border-champagne/60 focus:outline-none"
      />
    </div>
  );
}
