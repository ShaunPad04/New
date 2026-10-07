"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BUSINESS } from "@/lib/content";
import { typeLabel } from "@/lib/enquiry/schema";
import { useEnquiry, type Field } from "./useEnquiry";
import { Choice, Consent, Float, Guards, PhotoDrop, Picked, REPLIES, SUBJECTS, SendButton, Sent, ServerError } from "./parts";

/**
 * Form A, "Step by step" (round 7, 7 Oct 2026; after 21st's multi-step forms): four short
 * steps under a numbered progress rail, one question at a time. Continue checks only that
 * step; the last step shows a summary to check before sending. If the server rejects a
 * field, the form goes back to the step that holds it.
 */
const STEPS: { title: string; short: string; fields: Field[] }[] = [
  { title: "What is it about?", short: "Subject", fields: ["type"] },
  { title: "Tell us about it.", short: "The piece", fields: ["message", "photos"] },
  { title: "Who are we talking to?", short: "You", fields: ["name", "phone", "email"] },
  { title: "How should we reply?", short: "Reply", fields: ["contact", "consent"] },
];

export default function FormSteps() {
  const e = useEnquiry();
  const [step, setStep] = useState(0);
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    head.current?.focus({ preventScroll: false });
  }, [step]);

  // a server-side field error sends the visitor back to the step that holds it
  useEffect(() => {
    if (e.status !== "error") return;
    const bad = STEPS.findIndex((s) => s.fields.some((f) => e.errors[f]));
    if (bad >= 0 && bad !== step) setStep(bad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e.status, e.errors]);

  if (e.status === "success") return <Sent e={e} />;

  const last = step === STEPS.length - 1;
  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!e.check(STEPS[step].fields)) return;
    if (!last) setStep(step + 1);
    else await e.submit();
  };
  const v = e.values;

  return (
    <form className="efa" onSubmit={onSubmit} noValidate>
      <ol className="efa-rail" aria-label="Steps">
        {STEPS.map((s, i) => (
          <li key={s.short} className={i === step ? "is-on" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined}>
            <button type="button" onClick={() => i < step && setStep(i)} disabled={i >= step} tabIndex={i < step ? 0 : -1}>
              <span className="efa-n tnum">{i < step ? "✓" : String(i + 1).padStart(2, "0")}</span>
              <span className="efa-s">{s.short}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="efa-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
      </div>

      <div className="efa-panel" key={step}>
        <h2 ref={head} tabIndex={-1} className="efa-title">
          <span className="tnum">{String(step + 1).padStart(2, "0")}</span> {STEPS[step].title}
        </h2>

        {step === 0 && <Choice name="type" legend="Choose one" options={SUBJECTS} value={v.type} onChange={(x) => e.set("type", x)} error={e.errors.type} />}

        {step === 1 && (
          <div className="efa-stack">
            <Picked e={e} />
            <Float label="Which piece?" optional value={v.item} onChange={(x) => e.set("item", x)} maxLength={600} hint="A name, a reference or a weight is enough." />
            <Float label="Your message" textarea value={v.message} onChange={(x) => e.set("message", x)} error={e.errors.message} maxLength={3000} hint="What are you after, or what have you got? Carat, weight and size help if you know them." />
            <PhotoDrop e={e} />
          </div>
        )}

        {step === 2 && (
          <div className="efa-stack">
            <Float label="Your name" value={v.name} onChange={(x) => e.set("name", x)} error={e.errors.name} autoComplete="name" />
            <div className="efa-two">
              <Float label="Phone" type="tel" inputMode="tel" value={v.phone} onChange={(x) => e.set("phone", x)} error={e.errors.phone} autoComplete="tel" />
              <Float label="Email" type="email" inputMode="email" value={v.email} onChange={(x) => e.set("email", x)} error={e.errors.email} autoComplete="email" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="efa-stack">
            <Choice name="contact" legend="We will reply by" options={REPLIES} value={v.contact} onChange={(x) => e.set("contact", x)} error={e.errors.contact} variant="seg" />
            <dl className="efa-sum">
              <div><dt>About</dt><dd>{v.type ? typeLabel(v.type) : "–"}</dd></div>
              {v.item && <div><dt>Piece</dt><dd>{v.item}</dd></div>}
              <div><dt>Message</dt><dd>{v.message}</dd></div>
              <div><dt>You</dt><dd>{v.name} · <span className="tnum">{v.phone}</span> · {v.email}</dd></div>
              {e.files.length > 0 && <div><dt>Photos</dt><dd>{e.files.length} attached</dd></div>}
            </dl>
            <Consent e={e} />
            <Guards e={e} />
          </div>
        )}
      </div>

      <ServerError e={e} />
      <div className="efa-nav">
        {step > 0 ? (
          <button type="button" className="efa-back" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        ) : (
          <a href={`tel:${BUSINESS.phone.e164}`} className="efa-back">
            Or call <span className="tnum">{BUSINESS.phone.display}</span>
          </a>
        )}
        {last ? (
          <SendButton e={e} />
        ) : (
          <button type="submit" className="ef-send">
            <span>Continue</span>
            <span className="ef-send-disc" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
        )}
      </div>
    </form>
  );
}
