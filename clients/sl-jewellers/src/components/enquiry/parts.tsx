"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import Script from "next/script";
import { BUSINESS, ENQUIRY_TYPES, WHATSAPP_ON, whatsappUrl } from "@/lib/content";
import { ICONS } from "@/components/SocialLinks";
import { MAX_BYTES, MAX_FILES, type Enquiry } from "./useEnquiry";

const I = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {d}
  </svg>
);
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** The subjects, in the order a customer thinks of them, each with its own line glyph. */
export const SUBJECTS: { value: string; label: string; icon: ReactNode }[] = [
  { value: "buying", label: "Buying a piece", icon: I(<><path {...S} d="M6 8h12l-1 12H7L6 8Z" /><path {...S} d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>) },
  { value: "selling-gold", label: "Selling gold", icon: I(<><path {...S} d="M4 18h16M6 18l2-7h8l2 7" /><path {...S} d="M9 11l1-4h4l1 4" /></>) },
  { value: "part-exchange", label: "Part-exchange", icon: I(<><path {...S} d="M5 9h12l-3-3M19 15H7l3 3" /></>) },
  { value: "repair", label: "A repair", icon: I(<><path {...S} d="M14 5l5 5-9 9H5v-5l9-9Z" /><path {...S} d="M12 7l5 5" /></>) },
  { value: "resizing", label: "Resizing", icon: I(<><circle {...S} cx="12" cy="13" r="6" /><path {...S} d="M9.5 5h5l-1.5 2h-2L9.5 5Z" /></>) },
  { value: "bespoke", label: "Sourcing a piece", icon: I(<><circle {...S} cx="11" cy="11" r="6" /><path {...S} d="M20 20l-4.5-4.5" /></>) },
  { value: "visit", label: "Booking a visit", icon: I(<><path {...S} d="M5 7h14v12H5z" /><path {...S} d="M5 11h14M9 4v4M15 4v4" /></>) },
  { value: "other", label: "Something else", icon: I(<><path {...S} d="M5 6h14v10H9l-4 3V6Z" /></>) },
].filter((s) => ENQUIRY_TYPES.some((t) => t.value === s.value));

export const REPLIES: { value: string; label: string; icon: ReactNode }[] = [
  { value: "phone", label: "A call", icon: ICONS.phone },
  ...(WHATSAPP_ON ? [{ value: "whatsapp", label: "WhatsApp", icon: ICONS.whatsapp }] : []),
  { value: "email", label: "Email", icon: I(<><path {...S} d="M4 6h16v12H4z" /><path {...S} d="M4 7l8 6 8-6" /></>) },
];

/** Drag photos in, or tap to choose; thumbnails with a remove button each. */
export function PhotoDrop({ e, compact = false }: { e: Enquiry; compact?: boolean }) {
  const id = useId();
  const [over, setOver] = useState(false);
  const urls = useMemo(() => e.files.map((f) => URL.createObjectURL(f)), [e.files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  const add = (list: FileList | null) => {
    if (!list) return;
    const ok = Array.from(list).filter((f) => f.type.startsWith("image/"));
    e.setFiles([...e.files, ...ok].slice(0, MAX_FILES));
  };
  const big = e.files.find((f) => f.size > MAX_BYTES);
  return (
    <div className={`ef-drop${compact ? " is-compact" : ""}`}>
      <label
        htmlFor={id}
        className={`ef-drop-zone${over ? " is-over" : ""}`}
        onDragOver={(ev) => { ev.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(ev) => { ev.preventDefault(); setOver(false); add(ev.dataTransfer.files); }}
      >
        <span className="ef-drop-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M4 16v3h16v-3M12 4v11M7.5 8.5 12 4l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <span className="ef-drop-text">
          <strong>Add photos</strong> <span>(optional) drag them here or tap to choose. Up to {MAX_FILES}, 5 MB each.</span>
        </span>
      </label>
      <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple className="sr-only" onChange={(ev) => { add(ev.currentTarget.files); ev.currentTarget.value = ""; }} />
      {e.files.length > 0 && (
        <ul className="ef-thumbs">
          {e.files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urls[i]} alt="" />
              <button type="button" onClick={() => e.setFiles(e.files.filter((_, k) => k !== i))} aria-label={`Remove ${f.name}`}>×</button>
            </li>
          ))}
        </ul>
      )}
      <p className="ef-hint">A photo of the piece, a hallmark or the damage helps us give a straight answer.</p>
      {(e.errors.photos || big) && <p className="ef-err">{e.errors.photos || "Each photo must be 5 MB or smaller"}</p>}
    </div>
  );
}

/** The basket's pieces, when the visitor came from it. */
export function Picked({ e }: { e: Enquiry }) {
  if (!e.picked.length) return null;
  return (
    <div className="ef-picked">
      <p className="ef-picked-title">
        From your basket <span className="tnum">({e.picked.length})</span>
      </p>
      <ul>
        {e.picked.map((x) => (
          <li key={x.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.image} alt="" width={40} height={50} loading="lazy" />
            <span>{x.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The consent tick, as a switch. */
export function Consent({ e }: { e: Enquiry }) {
  const id = useId();
  return (
    <div className="ef-consent">
      <label htmlFor={id} className="ef-switch-row">
        <input id={id} type="checkbox" role="switch" checked={e.values.consent} onChange={(ev) => e.set("consent", ev.target.checked)} aria-invalid={e.errors.consent ? true : undefined} className="ef-switch" />
        <span>
          Use these details to reply to me, as in the <a href="/privacy">privacy policy</a>.
        </span>
      </label>
      {e.errors.consent && <p className="ef-err">{e.errors.consent}</p>}
    </div>
  );
}

/** Honeypot (bots fill it, people never see it) and Turnstile when it is configured. */
export function Guards({ e }: { e: Enquiry }) {
  return (
    <>
      {e.siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onLoad={e.renderTurnstile} />}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input ref={e.honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {e.siteKey && (
        <div className="ef-ts">
          <div ref={e.tsRef} />
          {e.errors.turnstile && <p className="ef-err">{e.errors.turnstile}</p>}
        </div>
      )}
    </>
  );
}

export function SendButton({ e, label = "Send to the shop" }: { e: Enquiry; label?: string }) {
  return (
    <button type="submit" className="ef-send" disabled={e.status === "loading"} aria-busy={e.status === "loading"}>
      <span>{e.status === "loading" ? "Sending…" : label}</span>
      <span className="ef-send-disc" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </button>
  );
}

export function ServerError({ e }: { e: Enquiry }) {
  if (e.status !== "error" || !e.serverMsg) return null;
  return (
    <p role="alert" className="ef-alert">
      {e.serverMsg}
    </p>
  );
}

/** What the visitor sees once it has gone. */
export function Sent({ e }: { e: Enquiry }) {
  const b = BUSINESS;
  // the form it replaces was much taller, so bring the confirmation into view and give it focus
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
    ref.current?.focus({ preventScroll: true });
  }, []);
  return (
    <div ref={ref} tabIndex={-1} role="status" aria-live="polite" className="ef-sent">
      <span className="ef-sent-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <h2 className="ef-sent-title">It is with the shop.</h2>
      <p className="ef-sent-text">
        We will come back to you the way you asked, usually the same working day. A copy is on its way to your email.
        {e.ref && (
          <>
            {" "}
            Your reference is <strong className="tnum">{e.ref}</strong>.
          </>
        )}
      </p>
      <div className="ef-sent-actions">
        <a href={`tel:${b.phone.e164}`} className="enq-pill">
          <span className="enq-pill-icon">{ICONS.phone}</span>
          <span>Or call {b.phone.display}</span>
        </a>
        {WHATSAPP_ON && (
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="enq-pill">
            <span className="enq-pill-icon">{ICONS.whatsapp}</span>
            <span>WhatsApp the shop</span>
          </a>
        )}
      </div>
    </div>
  );
}
