"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/content";
import Image from "next/image";
import { Brackets, StripeLabel } from "@/components/nocta-ui";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * The hint line under a field.
 *
 * ALWAYS RENDERED, at a reserved height, so an error appearing cannot push
 * the rest of the form down the page under the reader's thumb. Taken from the
 * 21st.dev Floating Label pattern, which reserves the same row for exactly
 * this reason. `aria-live` is polite rather than assertive: the message
 * arrives on blur, when the visitor has already moved on, so interrupting
 * them would be worse than waiting.
 */
function Hint({
  id,
  show,
  children,
}: {
  id: string;
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      aria-live="polite"
      className={`mt-2 min-h-[1.125rem] text-xs leading-[1.125rem] transition-opacity duration-300 ${
        show ? "text-ink-900 opacity-100" : "opacity-0"
      }`}
    >
      {show ? children : " "}
    </p>
  );
}

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
  /*
    Validity is read off the BROWSER (`checkValidity`), not re-implemented
    here. `type="email"` and `required` already encode the rules, the browser
    already knows them, and a hand-rolled email regex is the classic way to
    reject a valid address. This only decides WHEN to show the answer: on
    blur, never while someone is still typing.
  */
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  function check(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    setInvalid((prev) => ({ ...prev, [el.name]: !el.checkValidity() }));
  }

  function clear(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    if (invalid[el.name] && el.checkValidity()) {
      setInvalid((prev) => ({ ...prev, [el.name]: false }));
    }
  }

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

  /*
    NOCTA CONTACT LAYOUT (Brad, 2026-09-26: "tailor it to the one on
    nocta.framer.website/contact" — studied, not copied).

    A full-bleed backdrop (Higgsfield gpt_image_2_5, 0.25 credits, Brad's
    instruction; grayscale at public/images/contact/, decorative), the
    striped label and the heading on the left with the direct lines in a
    framed two-cell card at the foot, and the form in a framed panel on the
    right. Fields are square hairline boxes with bracket corners.

    What did NOT change, on purpose: the fields and their names (the route
    reads name/email/budget/brief), the honeypot, the blur-time validation
    with a reserved hint row, the Article 13 notice at the point of
    collection, and the honest error state — never a fake success.

    The budget is now a row of choices (Nocta's "Select plan") instead of a
    dropdown: the same six values as BUDGET_LABELS in
    app/api/enquiry/route.ts — change both together. Still optional.

    Colour is ours: no blue focus, no red error. Focus and an invalid field
    both take the border to ink-1000, and the hint says what is wrong, so
    colour is never the only channel. 3.25rem fields, above the 44px floor.
  */
  const shell =
    "relative border bg-ink-0/60 transition-colors duration-300 focus-within:border-ink-1000";
  const field =
    "w-full min-h-[3.25rem] bg-transparent px-4 py-3.5 text-ink-1000 placeholder:text-ink-600 focus:outline-none";
  const label = "mb-2 block text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-800";
  const budgets: [string, string][] = [
    ["under-1400", `Under ${site.currencySymbol}1,400`],
    ["1400-2500", `${site.currencySymbol}1,400 – ${site.currencySymbol}2,500`],
    ["2500-4500", `${site.currencySymbol}2,500 – ${site.currencySymbol}4,500`],
    ["4500-7500", `${site.currencySymbol}4,500 – ${site.currencySymbol}7,500`],
    ["7500-12000", `${site.currencySymbol}7,500 – ${site.currencySymbol}12,000`],
    ["12000+", `${site.currencySymbol}12,000+`],
    ["unsure", "Not sure yet"],
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-ink-300 bg-ink-0"
    >
      <Image
        src="/images/contact/backdrop.2026-09-26.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-top opacity-80"
      />
      {/* Weighted to the left and the foot, where the type sits. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink-0/80 via-ink-0/30 to-ink-0/40" />

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-10 px-6 py-24 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-32">
        <div className="flex flex-col">
          <div className="self-start">
            <StripeLabel>Contact</StripeLabel>
          </div>
          <h2
            id="contact-heading"
            className="display mt-6 text-[clamp(3rem,7vw,6.5rem)] leading-[0.88] text-ink-1000"
          >
            Get in touch.
          </h2>
          <p className="mt-6 max-w-[42ch] text-[1rem] leading-relaxed text-ink-800">
            A short note is enough to start. We reply to every enquiry within
            one working day and book a call at a time that suits you — and we
            will tell you honestly if we are not the right studio for it.
          </p>

          {/* The direct lines — Nocta's two-cell card, pinned to the foot
              of the column on desktop. */}
          <div className="relative mt-10 grid border border-ink-300 bg-ink-0/70 sm:grid-cols-[1.7fr_1fr] lg:mt-auto">
            <Brackets />
            {[
              { k: "Email us", v: site.email, href: `mailto:${site.email}` },
              { k: "Call us", v: site.phone, href: site.phoneHref },
            ].map((c, i) => (
              <a
                key={c.k}
                href={c.href}
                className={`group flex min-w-0 flex-col gap-4 p-5 sm:p-6 ${i ? "border-t border-ink-300 sm:border-l sm:border-t-0" : ""}`}
              >
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-700">{c.k}</span>
                <span className="flex items-center justify-between gap-3 text-[0.8125rem] font-medium uppercase sm:text-[0.9375rem] tracking-[-0.01em] text-ink-1000">
                  <span className="min-w-0 [overflow-wrap:anywhere]">{c.v}</span>
                  <span aria-hidden="true" className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-ink-400 transition-colors duration-300 group-hover:bg-ink-1000 group-hover:text-ink-0">
                    <Brackets />↗
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="relative border border-ink-300 bg-ink-0/75 p-5 sm:p-8">
          <Brackets />
          <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
            {/* Honeypot — bots fill it, humans never see it. */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="company-website">Leave this empty</label>
              <input id="company-website" name="company-website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="name" className={label}>Your name</label>
              <div className={`${shell} ${invalid.name ? "border-ink-1000" : "border-ink-300"}`}>
                <Brackets />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={invalid.name || undefined}
                  aria-describedby={invalid.name ? "name-hint" : undefined}
                  onBlur={check}
                  onInput={clear}
                  className={field}
                  placeholder="Jane Smith"
                />
              </div>
              <Hint id="name-hint" show={invalid.name}>We need a name to reply to.</Hint>
            </div>

            <div>
              <label htmlFor="email" className={label}>Email</label>
              <div className={`${shell} ${invalid.email ? "border-ink-1000" : "border-ink-300"}`}>
                <Brackets />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  aria-invalid={invalid.email || undefined}
                  aria-describedby={invalid.email ? "email-hint" : undefined}
                  onBlur={check}
                  onInput={clear}
                  className={field}
                  placeholder="jane@company.co.uk"
                />
              </div>
              <Hint id="email-hint" show={invalid.email}>
                That address needs an @ and a domain, so the reply reaches you.
              </Hint>
            </div>

            {/* Bands begin at the published tier prices (client, 2026-09-11;
                rebracketed 2026-09-24 for four tiers), so the reply can open
                on the right tier. Native radios, visually hidden, so arrow
                keys, forms and screen readers behave as they should. */}
            <fieldset>
              <legend className={label}>Approximate budget</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {budgets.map(([value, text]) => (
                  <label
                    key={value}
                    className="relative flex min-h-11 cursor-pointer items-center justify-center border border-ink-300 bg-ink-0/60 px-2 text-center text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-800 transition-colors duration-300 hover:border-ink-600 has-[:checked]:border-ink-1000 has-[:checked]:bg-ink-1000 has-[:checked]:text-ink-0 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink-1000"
                  >
                    <input type="radio" name="budget" value={value} className="sr-only" />
                    {text}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="brief" className={label}>What are you building?</label>
              <div className={`${shell} ${invalid.brief ? "border-ink-1000" : "border-ink-300"}`}>
                <Brackets />
                <textarea
                  id="brief"
                  name="brief"
                  required
                  rows={4}
                  aria-invalid={invalid.brief || undefined}
                  aria-describedby={invalid.brief ? "brief-hint" : undefined}
                  onBlur={check}
                  onInput={clear}
                  className={`${field} resize-none`}
                  placeholder="A sentence or two is plenty."
                />
              </div>
              <Hint id="brief-hint" show={invalid.brief}>One line about the project is plenty.</Hint>
            </div>

            {/*
              Required at the point of collection (UK GDPR Art. 13). NOT a
              consent box: the basis for replying is Art. 6(1)(b), steps
              before a contract. This form joins no mailing list — the
              newsletter is its own form with its own opt-in.
            */}
            <p className="text-xs leading-relaxed text-ink-700">
              We use what you send here to reply to you, and nothing else.
              No mailing list, no third parties.{" "}
              <Link
                href="/legal/privacy"
                className="text-ink-900 underline underline-offset-4 transition-colors hover:text-ink-1000"
              >
                How we handle your information
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="group relative flex min-h-[3.25rem] w-full items-center justify-center gap-3 border border-ink-1000 bg-ink-1000 text-[0.9375rem] font-medium text-ink-0 transition-colors duration-300 hover:bg-ink-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Brackets />
              {status === "sending" ? "Sending…" : "Send enquiry"}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-45">↗</span>
            </button>

            {/* Result is announced, and an error is never dressed as success. */}
            <p aria-live="polite" className={status === "error" ? "text-sm text-ink-1000" : "text-sm text-ink-800"}>
              {message}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
