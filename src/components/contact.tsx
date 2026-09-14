"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/content";
import { RevealWords } from "@/components/reveal";
import { AuroraField } from "@/components/aurora-field";

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
    THE FIELDS HAVE A SURFACE NOW.

    They were a bottom border and nothing else: on a black ground that gives a
    visitor no boundary to aim at, the textarea read as an unbounded void, and
    the only affordance was a 1px line. It was the cheapest-looking thing on
    the site and it sits at the conversion point.

    Structure adapted from 21st.dev's Floating Label (@ddoemonn) — a real
    surface, a focus treatment that moves the border rather than adding a
    glow, and a hint row of RESERVED HEIGHT so an error message cannot shift
    the form as it appears. Its floating label itself was deliberately NOT
    taken: this site's labels are Geist Mono caps standing above the field
    (`.field-label`), which is part of the brand and is also the more
    accessible arrangement, and a floating label would have deleted them.

    Colour is ours. The reference focuses blue and errors red; there is no
    blue and no red on this site, so focus takes the border to `ink-1000` and
    an invalid field takes it there too — separated by the message beneath,
    which is what actually says what is wrong. Never rely on the border alone
    to signal an error: that would be colour as the sole channel.

    3.25rem minimum, matching the submit button, so nothing here is under the
    44px touch floor.
  */
  const shell =
    "rounded-[0.9rem] border bg-ink-100 transition-colors duration-300 focus-within:border-ink-1000";
  const field =
    "w-full min-h-[3.25rem] bg-transparent px-4 py-3.5 text-ink-1000 placeholder:text-ink-600 focus:outline-none";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-24 overflow-hidden border-t border-ink-300"
    >
      {/* The form is the last thing anyone reads before deciding, so this is
          the other section that carries the drifting light. `relative` on the
          content wrapper keeps it above the field. */}
      <AuroraField />
      <div className="relative mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow eyebrow-plain mb-6">Start a project</p>
            <h2
              id="contact-heading"
              className="display text-display-lg text-ink-1000"
            >
              <RevealWords text="Tell us what you are building." />
            </h2>
            <p className="lede mt-8 max-w-[42ch]">
              A short note is enough to start. We reply to every enquiry
              within one working day and book a call at a time that suits you
              — and we will tell you honestly if we are not the right studio
              for it.
            </p>

            <div className="mt-12 border-t border-ink-300 pt-8">
              <p className="eyebrow mb-3">Direct</p>
              <a
                href={`mailto:${site.email}`}
                className="block text-lg tracking-tight text-ink-1000 underline decoration-ink-500 underline-offset-8 transition-colors duration-300 hover:decoration-ink-1000"
              >
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="mt-4 block text-lg tracking-tight text-ink-1000 underline decoration-ink-500 underline-offset-8 transition-colors duration-300 hover:decoration-ink-1000"
              >
                {site.phone}
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
                <label htmlFor="name" className="field-label mb-2">
                  Your name
                </label>
                <div className={`${shell} ${invalid.name ? "border-ink-1000" : "border-ink-400"}`}>
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
                <Hint id="name-hint" show={invalid.name}>
                  We need a name to reply to.
                </Hint>
              </div>

              <div>
                <label htmlFor="email" className="field-label mb-2">
                  Email
                </label>
                <div className={`${shell} ${invalid.email ? "border-ink-1000" : "border-ink-400"}`}>
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
                  That address needs an @ and a domain, so the reply reaches
                  you.
                </Hint>
              </div>

              <div>
                <label htmlFor="budget" className="field-label mb-2">
                  Approximate budget
                </label>
                {/* `appearance-none` and our own chevron: the native control
                    paints the platform's arrow, which on Windows is a blue
                    glyph and is the one piece of chrome on this page that is
                    not ours. `pr-12` keeps the longest band clear of it. */}
                <div className={`${shell} relative border-ink-400`}>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-600"
                  >
                    ↓
                  </span>
                  <select
                    id="budget"
                    name="budget"
                    className={`${field} appearance-none pr-12`}
                    defaultValue=""
                  >
                  <option value="" disabled>
                    Select a range
                  </option>
                  {/* The bands ARE the build tiers, at the client's request
                      (2026-09-11). They used to be round numbers that merely
                      bracketed the tiers — Under £2,000 / £2,000–£5,000 /
                      £5,000+ — which meant every band straddled a boundary:
                      "£2,000–£5,000" contains Signature at £2,500 and stops
                      well short of Flagship, so the answer told us nothing
                      about which build someone was picturing.
                      Each band now begins at a published price, so the reply
                      can open on the right tier.
                      BUDGET_LABELS in app/api/enquiry/route.ts mirrors these
                      keys — change both together or the notification email
                      prints a raw value. */}
                  <option value="under-1250">
                    Under {site.currencySymbol}1,250
                  </option>
                  <option value="1250-2500">
                    {site.currencySymbol}1,250 – {site.currencySymbol}2,500
                  </option>
                  <option value="2500-6000">
                    {site.currencySymbol}2,500 – {site.currencySymbol}6,000
                  </option>
                  <option value="6000+">
                    {site.currencySymbol}6,000+
                  </option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="brief" className="field-label mb-2">
                  What are you building?
                </label>
                <div className={`${shell} ${invalid.brief ? "border-ink-1000" : "border-ink-400"}`}>
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
                <Hint id="brief-hint" show={invalid.brief}>
                  One line about the project is plenty.
                </Hint>
              </div>

              {/*
                Required at the point of collection, not buried in the footer:
                UK GDPR Article 13 wants the visitor told what happens to their
                data when they hand it over.

                Deliberately NOT a consent tick-box. Our lawful basis for
                replying to an enquiry is Article 6(1)(b) — steps before a
                contract — so consent is not what makes the processing lawful,
                and a box you cannot decline and still get a reply would not be
                valid consent anyway. A marketing opt-in would be a separate,
                genuinely optional checkbox, and there is no marketing list.
              */}
              <p className="text-xs leading-relaxed text-ink-600">
                We use what you send here to reply to you, and nothing else.
                No mailing list, no third parties.{" "}
                <Link
                  href="/legal/privacy"
                  className="text-ink-800 underline underline-offset-4 transition-colors hover:text-ink-1000"
                >
                  How we handle your information
                </Link>
                .
              </p>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="group inline-flex min-h-[3.25rem] items-center gap-3 rounded-full bg-ink-1000 py-2 pl-7 pr-2 text-sm font-medium tracking-tight text-ink-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-0/10 text-base transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105"
                >
                  ↗
                </span>
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
