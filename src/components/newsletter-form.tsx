"use client";

import { useState } from "react";
import { site } from "@/lib/content";

/**
 * NEWSLETTER SIGN-UP
 *
 * The underlined-field treatment from the reference: no box, no plate, just a
 * hairline that brightens on focus. It is the same reasoning as the contact
 * form's own fields — a surface here would read as a fifth card in a footer
 * that already has three columns and a marquee.
 *
 * STATES ARE HONEST. `/api/subscribe` returns 501 while `RESEND_AUDIENCE_ID`
 * is unset, and this renders that message rather than a tick. The whole point
 * of the endpoint's contract is that nothing claims success it did not have,
 * so this component must not soften a failure into "thanks!".
 *
 * `aria-live="polite"` on the message row and a reserved minimum height so
 * the column does not jump when a response arrives — the footer is a fixed
 * `100svh` box and anything that grows pushes the bottom bar off the page.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (response.ok) {
        setState("done");
        setMessage("You are on the list. We only send when there is something worth sending.");
        setEmail("");
        return;
      }

      setState("error");
      setMessage(data.error ?? "That did not go through. Try again, or email us.");
    } catch {
      setState("error");
      setMessage("That did not go through. Try again, or email us.");
    }
  }

  return (
    <div>
      <p className="max-w-[30ch] text-sm leading-relaxed text-ink-700">
        Occasional notes on what we are building and what we have learned.
        No schedule, and nothing we would not read ourselves.
      </p>

      <form onSubmit={onSubmit} className="mt-6">
        <label
          htmlFor="newsletter-email"
          className="field-label block text-ink-600"
        >
          Email
        </label>

        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.co.uk"
          className="mt-3 w-full border-b border-ink-300 bg-transparent pb-2.5 text-[0.9375rem] text-ink-1000 transition-colors duration-300 placeholder:text-ink-600 focus:border-ink-1000 focus:outline-none"
        />

        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-6 inline-flex min-h-[2.75rem] items-center gap-2.5 rounded-full bg-ink-1000 px-6 text-sm font-medium text-ink-0 transition-opacity duration-500 hover:opacity-85 disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="block h-1.5 w-1.5 rounded-full bg-ink-0"
          />
          {state === "sending" ? "Sending" : "Subscribe"}
        </button>

        {/* Reserved height: the footer cannot grow, so the message must not
            change the column's height when it appears. */}
        <p
          aria-live="polite"
          className={`mt-4 min-h-[2.5rem] max-w-[32ch] text-[0.8125rem] leading-relaxed ${
            state === "error" ? "text-ink-1000" : "text-ink-700"
          }`}
        >
          {message}
          {state === "error" ? (
            <>
              {" "}
              <a
                href={`mailto:${site.email}`}
                className="underline underline-offset-4 hover:text-ink-1000"
              >
                {site.email}
              </a>
            </>
          ) : null}
        </p>
      </form>
    </div>
  );
}
