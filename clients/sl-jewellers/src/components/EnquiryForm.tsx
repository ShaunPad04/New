"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { BUSINESS, ENQUIRY_TYPES, WHATSAPP_ON, whatsappUrl } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";
const MAX_FILES = 3;
const MAX_BYTES = 5 * 1024 * 1024;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void; "error-callback"?: () => void; theme?: string; appearance?: string }) => string;
      reset: (id?: string) => void;
    };
  }
}

export default function EnquiryForm() {
  const params = useSearchParams();
  const qType = params.get("type") || "";
  const initialType = ENQUIRY_TYPES.some((t) => t.value === qType) ? qType : "";
  const initialItem = (params.get("item") || "").slice(0, 120);
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);
  const tsWidget = useRef<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState("");
  const [ref, setRef] = useState("");
  const [token, setToken] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const renderTurnstile = () => {
    if (!siteKey || !tsRef.current || !window.turnstile || tsWidget.current) return;
    tsWidget.current = window.turnstile.render(tsRef.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (t) => setToken(t),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  };
  useEffect(() => {
    renderTurnstile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateClient = (fd: FormData) => {
    const e: Record<string, string> = {};
    if (String(fd.get("name") || "").trim().length < 2) e.name = "Enter your name";
    if (String(fd.get("phone") || "").replace(/\D/g, "").length < 10) e.phone = "Enter a UK phone number";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(fd.get("email") || ""))) e.email = "Enter a valid email address";
    if (!fd.get("type")) e.type = "Choose an enquiry type";
    if (String(fd.get("message") || "").trim().length < 10) e.message = "Tell us a little more (at least 10 characters)";
    if (!fd.get("contact")) e.contact = "Choose how you would like us to reply";
    if (fd.get("consent") !== "on") e.consent = "Please tick the consent box so we can reply to you";
    const files = fd.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length > MAX_FILES) e.photos = `Up to ${MAX_FILES} photos`;
    if (files.some((f) => f.size > MAX_BYTES)) e.photos = "Each photo must be 5 MB or smaller";
    if (siteKey && !token) e.turnstile = "Please wait for the security check to finish";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const clientErrors = validateClient(fd);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      setStatus("error");
      setServerMsg("Please check the highlighted fields.");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors({});
    setStatus("loading");
    setServerMsg("");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; id?: string; error?: string; fields?: Record<string, string> };
      if (!res.ok || !data.ok) {
        setErrors(data.fields || {});
        setServerMsg(data.error || "Something went wrong. Please try again or call us.");
        setStatus("error");
        window.turnstile?.reset(tsWidget.current || undefined);
        setToken("");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setRef(data.id || "");
      setStatus("success");
      form.reset();
      setFileNames([]);
    } catch {
      setServerMsg("We could not reach the server. Check your connection and try again, or call us.");
      setStatus("error");
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  };

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="card card-fog p-8">
        <p className="eyebrow">Sent</p>
        <h2 className="display-m mt-2">Thanks, we have your enquiry.</h2>
        <p className="mt-4 max-w-[48ch] text-steel">
          We will come back to you the way you asked, usually the same working day. A confirmation is on its way to your email.
          {ref && (
            <>
              {" "}
              Your reference is <strong className="tnum">{ref}</strong>.
            </>
          )}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${BUSINESS.phone.e164}`} className="btn btn-black btn-sm">
            Or call {BUSINESS.phone.display}
          </a>
          {WHATSAPP_ON && (
            <a href={whatsappUrl()} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
              WhatsApp us
            </a>
          )}
        </div>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${id}-${k}-err`} className="error-text">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${id}-${k}-err` : undefined });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate encType="multipart/form-data" className="grid gap-6">
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onLoad={renderTurnstile} />}

      {status === "error" && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-2xl border border-[#c0482f] bg-[#fde7e1] p-4 text-[#7a2212]">
          <p className="font-semibold">{serverMsg}</p>
          {Object.keys(errors).length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm">
              {Object.entries(errors).map(([k, v]) => (
                <li key={k}>
                  <a href={`#${id}-${k}`} className="underline">
                    {v}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input id={`${id}-name`} name="name" className="input" autoComplete="name" required {...aria("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`}>Phone</label>
          <input id={`${id}-phone`} name="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="07XXX XXXXXX" required {...aria("phone")} />
          {err("phone")}
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${id}-email`}>Email</label>
        <input id={`${id}-email`} name="email" className="input" type="email" inputMode="email" autoComplete="email" required {...aria("email")} />
        {err("email")}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={`${id}-type`}>What is it about?</label>
          <select id={`${id}-type`} name="type" className="input" defaultValue={initialType} required {...aria("type")}>
            <option value="" disabled>
              Choose one
            </option>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {err("type")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-item`}>
            Item or piece <span className="font-normal text-steel">(optional)</span>
          </label>
          <input id={`${id}-item`} name="item" className="input" defaultValue={initialItem} placeholder="e.g. 9ct curb chain, Rolex Datejust" maxLength={120} />
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${id}-message`}>Your message</label>
        <textarea id={`${id}-message`} name="message" className="input" rows={5} required maxLength={3000} placeholder="What are you after, or what have you got? Carat, weight and size help if you know them." {...aria("message")} />
        {err("message")}
      </div>

      <div className="field">
        <label htmlFor={`${id}-photos`}>
          Photos <span className="font-normal text-steel">(optional, up to 3, 5 MB each)</span>
        </label>
        <input
          id={`${id}-photos`}
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="input file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:font-semibold file:text-paper"
          onChange={(e) => setFileNames(Array.from(e.currentTarget.files || []).map((f) => f.name))}
          {...aria("photos")}
        />
        <p className="hint">A photo of a broken item, a hallmark or the piece you are after helps us give a straight answer.</p>
        {fileNames.length > 0 && <p className="text-sm text-steel">{fileNames.join(", ")}</p>}
        {err("photos")}
      </div>

      <fieldset className="field" {...aria("contact")}>
        <legend className="font-semibold">How should we reply?</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {[
            ["phone", "Phone call"],
            ["whatsapp", "WhatsApp"],
            ["email", "Email"],
          ].map(([v, l]) => (
            <label key={v} className="inline-flex min-h-[44px] items-center gap-2">
              <input type="radio" name="contact" value={v} className="h-5 w-5 accent-[#0a0a0b]" /> {l}
            </label>
          ))}
        </div>
        {err("contact")}
      </fieldset>

      <div className="field">
        <label className="inline-flex items-start gap-3">
          <input id={`${id}-consent`} type="checkbox" name="consent" className="mt-1 h-5 w-5 accent-[#0a0a0b]" {...aria("consent")} />
          <span className="text-[15px]">
            I agree to S&amp;L Jewellers using these details to reply to my enquiry, as described in the{" "}
            <a href="/privacy" className="underline">
              privacy policy
            </a>
            .
          </span>
        </label>
        {err("consent")}
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {siteKey && (
        <div className="field">
          <div ref={tsRef} />
          {err("turnstile")}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-black" disabled={status === "loading"} aria-busy={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send enquiry"}
        </button>
        <span className="text-sm text-steel">
          Or call <a href={`tel:${BUSINESS.phone.e164}`} className="font-semibold tnum">{BUSINESS.phone.display}</a>
        </span>
      </div>
      <p aria-live="polite" className="sr-only">
        {status === "loading" ? "Sending your enquiry" : ""}
      </p>
    </form>
  );
}
