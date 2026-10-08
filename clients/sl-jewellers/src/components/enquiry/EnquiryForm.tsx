"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEnquiry, type Field } from "./useEnquiry";
import { Consent, Guards, PhotoDrop, REPLIES, SUBJECTS, SendButton, Sent, ServerError } from "./parts";
import PiecePicker, { MAX_PICK, type PickPiece } from "./PiecePicker";

/**
 * The enquiry form: one ordinary form, every question on the page at once (Shaun, 8 Oct 2026:
 * "lets use a regular contact form", in place of the chat, which asked one thing at a time
 * and could ask the wrong follow-up). What it is about, which of the shop's pieces (tap them
 * from a grid of photos, or carry on if it isn't on the site), the message, photos, the
 * visitor's details and how to reply. The basket and a product page's "Ask about this piece"
 * (?piece=) arrive with the piece already chosen; ?type= picks the subject. Same fields, checks,
 * Turnstile, honeypot and POST as before (useEnquiry.ts); a failed check moves focus to the
 * first answer that needs fixing.
 */
const PIECES_FOR = ["buying", "part-exchange", "visit", "other"];

/** What the message box asks, by subject. */
const ASK: Record<string, string> = {
  buying: "Which piece, and what would you like to know?",
  "selling-gold": "What are you selling, and roughly what does it weigh?",
  "part-exchange": "What do you have, and what would you like for it?",
  repair: "What needs doing?",
  resizing: "Which ring, and what size do you need?",
  bespoke: "What are you looking for?",
  visit: "When would suit you, and what is it about?",
  other: "Your message",
};

function Text({ e, k, label, type = "text", auto, hint }: { e: ReturnType<typeof useEnquiry>; k: "name" | "phone" | "email"; label: string; type?: string; auto: string; hint?: string }) {
  const id = useId();
  const err = e.errors[k];
  return (
    <div className="eqf-field">
      <label htmlFor={id} className="eqf-label">
        {label}
      </label>
      <input
        id={id}
        name={k}
        type={type}
        autoComplete={auto}
        inputMode={type === "tel" ? "tel" : undefined}
        value={e.values[k]}
        onChange={(ev) => e.set(k, ev.target.value)}
        onBlur={() => e.values[k] && e.check([k])}
        aria-invalid={err ? true : undefined}
        aria-describedby={err ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="eqf-input"
      />
      {hint && !err && (
        <p id={`${id}-hint`} className="ef-hint">
          {hint}
        </p>
      )}
      {err && (
        <p id={`${id}-err`} className="ef-err">
          {err}
        </p>
      )}
    </div>
  );
}

function Pills({ legend, name, options, value, onChange, error }: { legend: string; name: string; options: { value: string; label: string; icon: ReactNode }[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset className="eqf-set" aria-invalid={error ? true : undefined}>
      <legend className="eqf-label">{legend}</legend>
      <div className="eqf-pills" data-n={options.length}>
        {options.map((o) => (
          <label key={o.value} className="eqf-pill">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
            <span className="eqf-pill-icon" aria-hidden="true">
              {o.icon}
            </span>
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="ef-err">{error}</p>}
    </fieldset>
  );
}

export default function EnquiryForm({ pieces = [] }: { pieces?: PickPiece[] }) {
  const e = useEnquiry();
  const params = useSearchParams();
  const form = useRef<HTMLFormElement>(null);
  const msgId = useId();
  const [sel, setSel] = useState<PickPiece[]>([]);
  const [picking, setPicking] = useState(false);
  const arrived = useRef(false);
  const v = e.values;

  // arriving with pieces already chosen: the basket, a product page's ?piece=, an old ?item= title
  useEffect(() => {
    if (arrived.current) return;
    const id = params.get("piece");
    const title = params.get("item");
    const fromUrl = pieces.filter((p) => p.id === id || (!!title && p.title === title));
    const fromBasket = e.picked.map((b) => pieces.find((p) => p.id === b.id) ?? b);
    const all = [...fromBasket, ...fromUrl.filter((p) => !fromBasket.some((b) => b.id === p.id))].slice(0, MAX_PICK);
    if (!all.length) return;
    arrived.current = true;
    choose(all);
    if (!v.type) e.set("type", "buying");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e.picked, pieces]);

  // after a failed send, once the errors are on screen, focus the first answer that needs fixing
  const wantFocus = useRef(false);
  useEffect(() => {
    if (!wantFocus.current || e.status !== "error") return;
    wantFocus.current = false;
    form.current?.querySelector<HTMLElement>('fieldset[aria-invalid="true"] input, input[aria-invalid="true"], textarea[aria-invalid="true"]')?.focus();
  }, [e.status, e.errors]);

  if (e.status === "success") return <Sent e={e} />;

  function choose(list: PickPiece[]) {
    setSel(list);
    e.setPicked(list);
    e.set("item", list.map((x) => x.title).join("; ").slice(0, 600));
  }

  const showPieces = pieces.length > 0 && (sel.length > 0 || PIECES_FOR.includes(v.type));

  const send = async (ev: FormEvent) => {
    ev.preventDefault();
    wantFocus.current = true;
    if (await e.submit()) wantFocus.current = false;
  };
  const err = (k: Field) => e.errors[k];

  return (
    <form ref={form} className="eqf" onSubmit={send} noValidate>
      <div className="eqf-head">
        <p className="eqf-title">Send the shop a message</p>
        <p className="eqf-status">Usually replies the same day</p>
      </div>

      <Pills legend="What is it about?" name="type" options={SUBJECTS} value={v.type} onChange={(x) => e.set("type", x)} error={err("type")} />

      {showPieces && (
        <div className="eqf-field">
          <p className="eqf-label">
            Which piece? <span className="eqf-opt">optional</span>
          </p>
          {sel.length > 0 && (
            <ul className="eqf-chosen">
              {sel.map((p) => (
                <li key={p.id}>
                  <span className="eqf-chosen-img">
                    <Image src={p.image} alt="" fill sizes="40px" />
                  </span>
                  <span className="eqf-chosen-name">{p.title}</span>
                  <button type="button" className="eqf-remove" onClick={() => choose(sel.filter((x) => x.id !== p.id))} aria-label={`Remove ${p.title}`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
          {picking ? (
            <PiecePicker pieces={pieces} sel={sel} setSel={setSel} onDone={() => { choose(sel); setPicking(false); }} onNone={() => { choose([]); setPicking(false); }} />
          ) : (
            <button type="button" className="eqf-add" onClick={() => setPicking(true)}>
              <span aria-hidden="true">+</span> {sel.length ? "Add or change pieces" : "Choose it from the shop's pieces"}
            </button>
          )}
        </div>
      )}

      <div className="eqf-field">
        <label htmlFor={msgId} className="eqf-label">
          {v.type === "buying" && sel.length ? "What would you like to know?" : (ASK[v.type] ?? "Your message")}
        </label>
        <textarea
          id={msgId}
          name="message"
          rows={5}
          value={v.message}
          onChange={(ev) => e.set("message", ev.target.value)}
          aria-invalid={err("message") ? true : undefined}
          aria-describedby={err("message") ? `${msgId}-err` : undefined}
          className="eqf-input eqf-area"
        />
        {err("message") && (
          <p id={`${msgId}-err`} className="ef-err">
            {err("message")}
          </p>
        )}
      </div>

      <PhotoDrop e={e} compact />

      <div className="eqf-grid">
        <Text e={e} k="name" label="Your name" auto="name" />
        <Text e={e} k="phone" label="Phone" type="tel" auto="tel" />
        <Text e={e} k="email" label="Email" type="email" auto="email" hint="We send you a copy of your message." />
      </div>

      <Pills legend="How should we reply?" name="contact" options={REPLIES} value={v.contact} onChange={(x) => e.set("contact", x)} error={err("contact")} />

      <Consent e={e} />
      <Guards e={e} />
      <ServerError e={e} />
      <div className="eqf-foot">
        <SendButton e={e} />
      </div>
    </form>
  );
}
