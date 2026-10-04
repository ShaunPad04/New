"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
/* The four details it shows arrive as props from the server wrapper
   (`contact.tsx`), so the form does not pull content.ts into the browser. */
export type ContactSite = { email: string; phone: string; phoneHref: string; currencySymbol: string };

export function ContactForm({ site }: { site: ContactSite }) {
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
    THE CONTACT SECTION IN THE HOMEPAGE'S SYSTEM (Brad, 2026-10-04: "do the
    why us and contact"). Was the Nocta layout of 2026-09-26: a striped
    label, bracket-cornered frames on every field and card. Now: the heading
    and the line as the other sections set them; "What happens next" in three
    numbered steps beside the form (the house standard puts it beside every
    contact form; every step is a promise the site already makes); email and
    phone as ruled rows with the round arrow the service and price rows use;
    the form on a plain dark panel, its fields underlined, and the white bar
    from the rest of the site to send it.

    What did NOT change, on purpose: the fields and their names (the route
    reads name/email/budget/brief), the honeypot, the blur-time validation
    with a reserved hint row, the Article 13 notice at the point of
    collection, and the honest error state — never a fake success. The budget
    choices are the same seven values as BUDGET_LABELS in
    app/api/enquiry/route.ts — change both together. Still optional.

    Colour is ours: no blue focus, no red error. Focus and an invalid field
    both turn the underline white, and the hint says what is wrong, so colour
    is never the only channel. Underlines are ink-600 (#808080, over 3:1 on
    the panel) so the field still reads as a field. 3.25rem fields.
  */
  const field =
    "w-full min-h-[3.25rem] border-b bg-transparent py-3 text-[1.0625rem] text-ink-1000 transition-colors duration-300 placeholder:text-ink-600 focus:border-ink-1000 focus:outline-none";
  const label = "block text-[0.75rem] font-bold uppercase tracking-[-0.02em] text-ink-700";
  const budgets: [string, string][] = [
    ["under-1400", `Under ${site.currencySymbol}1,400`],
    ["1400-2500", `${site.currencySymbol}1,400 – ${site.currencySymbol}2,500`],
    ["2500-4500", `${site.currencySymbol}2,500 – ${site.currencySymbol}4,500`],
    ["4500-7500", `${site.currencySymbol}4,500 – ${site.currencySymbol}7,500`],
    ["7500-12000", `${site.currencySymbol}7,500 – ${site.currencySymbol}12,000`],
    ["12000+", `${site.currencySymbol}12,000+`],
    ["unsure", "Not sure yet"],
  ];
  const steps = [
    "We reply within one working day.",
    "We book a call at a time that suits you.",
    "You get the scope and a fixed price in writing before anything starts.",
  ];
  const send = status === "sending" ? "Sending…" : "Send enquiry";

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative scroll-mt-24 overflow-hidden bg-ink-0">
      <Image src="/images/contact/backdrop.2026-09-26.webp" alt="" fill sizes="100vw" className="object-cover object-top opacity-60" />
      {/* Darker over the form, where the fields sit. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink-0/80 via-ink-0/45 to-ink-0/85" />

      <div className="relative mx-auto grid w-full max-w-[1600px] gap-14 px-6 pb-24 pt-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:pb-32 lg:pt-24">
        <div>
          <h2 id="contact-heading" className="display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.9] text-ink-1000">
            Get in touch.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">
            A short note is enough to start — and we will tell you honestly if we are not the right studio for it.
          </p>

          <p className={`mt-12 ${label}`}>What happens next</p>
          <ol className="mt-4 border-t border-ink-300">
            {steps.map((s, i) => (
              <li key={s} className="flex items-baseline gap-5 border-b border-ink-300 py-4">
                <span className="font-[family-name:var(--font-cal-ui)] text-[1.125rem] leading-none tabular-nums text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[1rem] leading-snug text-ink-1000">{s}</span>
              </li>
            ))}
          </ol>

          <ul className="mt-10 border-t border-ink-300">
            {[
              { k: "Email", v: site.email, href: `mailto:${site.email}` },
              { k: "Phone", v: site.phone, href: site.phoneHref },
            ].map((c) => (
              <li key={c.k} className="border-b border-ink-300">
                <a href={c.href} className="group flex min-h-16 items-center justify-between gap-6 py-4">
                  <span className="min-w-0">
                    <span className={label}>{c.k}</span>
                    <span className="mt-1 block text-[1rem] font-semibold tracking-[-0.02em] text-ink-1000 [overflow-wrap:anywhere] sm:text-[1.125rem]">{c.v}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full border border-ink-500 text-ink-1000 transition-[transform,background-color,color,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-rotate-45 group-hover:border-ink-1000 group-hover:bg-ink-1000 group-hover:text-ink-0"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-white/10 bg-ink-0/80 p-6 sm:p-10">
          <form onSubmit={onSubmit} className="space-y-6" noValidate={false}>
            {/* Honeypot — bots fill it, humans never see it. */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="company-website">Leave this empty</label>
              <input id="company-website" name="company-website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="name" className={label}>Your name</label>
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
                className={`${field} ${invalid.name ? "border-ink-1000" : "border-ink-600"}`}
                placeholder="Jane Smith"
              />
              <Hint id="name-hint" show={invalid.name}>We need a name to reply to.</Hint>
            </div>

            <div>
              <label htmlFor="email" className={label}>Email</label>
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
                className={`${field} ${invalid.email ? "border-ink-1000" : "border-ink-600"}`}
                placeholder="jane@company.co.uk"
              />
              <Hint id="email-hint" show={invalid.email}>
                That address needs an @ and a domain, so the reply reaches you.
              </Hint>
            </div>

            {/* Bands begin at the published tier prices (client, 2026-09-11;
                rebracketed 2026-09-24 for four tiers), so the reply can open
                on the right tier. Native radios, visually hidden, so arrow
                keys, forms and screen readers behave as they should. */}
            <fieldset>
              <legend className={`mb-3 ${label}`}>Approximate budget</legend>
              <div className="flex flex-wrap gap-2">
                {budgets.map(([value, text]) => (
                  <label
                    key={value}
                    className="relative flex min-h-11 cursor-pointer items-center justify-center border border-ink-500 px-3.5 text-center text-[0.8125rem] font-medium text-ink-800 transition-colors duration-300 hover:border-ink-1000 hover:text-ink-1000 has-[:checked]:border-ink-1000 has-[:checked]:bg-ink-1000 has-[:checked]:text-ink-0 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink-1000"
                  >
                    <input type="radio" name="budget" value={value} className="sr-only" />
                    {text}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="brief" className={label}>What are you building?</label>
              <textarea
                id="brief"
                name="brief"
                required
                rows={3}
                aria-invalid={invalid.brief || undefined}
                aria-describedby={invalid.brief ? "brief-hint" : undefined}
                onBlur={check}
                onInput={clear}
                className={`${field} resize-none ${invalid.brief ? "border-ink-1000" : "border-ink-600"}`}
                placeholder="A sentence or two is plenty."
              />
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

            {/* The white bar the rest of the site sends people with (`.hero-cta`). */}
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="hero-cta hero-cta-light disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="sr-only">{send}</span>
              <span aria-hidden="true" className="hero-cta-label">
                {[...send].map((ch, i) => (
                  <span key={i} className="hero-cta-ch" style={{ "--i": i } as React.CSSProperties}>
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
              <svg aria-hidden="true" viewBox="0 0 20 20" className="hero-cta-plus">
                <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
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
