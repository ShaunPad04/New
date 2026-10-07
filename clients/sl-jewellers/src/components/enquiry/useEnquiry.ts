"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ENQUIRY_TYPES } from "@/lib/content";
import { basket, type BasketItem } from "@/lib/basket";

/**
 * Everything the enquiry forms share, whatever they look like: the prefill from the address
 * (?type=, ?item=, ?basket=1), the basket's pieces, the checks (the same rules the server
 * applies in lib/enquiry/schema.ts), Turnstile, the honeypot and the POST to /api/enquiry.
 * The three form designs on the walk-through's switch differ only in how they ask.
 */
export const MAX_FILES = 3;
export const MAX_BYTES = 5 * 1024 * 1024;

export type Values = { name: string; phone: string; email: string; type: string; item: string; message: string; contact: string; consent: boolean };
export type Status = "idle" | "loading" | "success" | "error";
export type Field = keyof Values | "photos" | "turnstile";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void; "error-callback"?: () => void; theme?: string; appearance?: string }) => string;
      reset: (id?: string) => void;
    };
  }
}

const RULES: Partial<Record<Field, (v: Values, files: File[]) => string | null>> = {
  type: (v) => (v.type ? null : "Choose what it is about"),
  message: (v) => (v.message.trim().length >= 10 ? null : "Tell us a little more (at least 10 characters)"),
  name: (v) => (v.name.trim().length >= 2 ? null : "Enter your name"),
  phone: (v) => (v.phone.replace(/\D/g, "").length >= 10 ? null : "Enter a UK phone number"),
  email: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email) ? null : "Enter a valid email address"),
  contact: (v) => (v.contact ? null : "Choose how you would like us to reply"),
  consent: (v) => (v.consent ? null : "Please tick the box so we can reply to you"),
  photos: (_, files) => (files.length > MAX_FILES ? `Up to ${MAX_FILES} photos` : files.some((f) => f.size > MAX_BYTES) ? "Each photo must be 5 MB or smaller" : null),
};

export function useEnquiry() {
  const params = useSearchParams();
  const qType = params.get("type") || "";
  const fromBasket = params.get("basket") === "1";
  const [values, setValues] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    type: ENQUIRY_TYPES.some((t) => t.value === qType) ? qType : "",
    item: (params.get("item") || "").slice(0, 600),
    message: "",
    contact: "",
    consent: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [picked, setPicked] = useState<BasketItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [serverMsg, setServerMsg] = useState("");
  const [ref, setRef] = useState("");
  const [token, setToken] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);
  const tsWidget = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Arriving from the basket: list its pieces, put their titles in the item, and say buying.
  useEffect(() => {
    if (!fromBasket) return;
    const items = basket.snapshot();
    setPicked(items);
    if (items.length)
      setValues((v) => ({ ...v, type: v.type || "buying", item: v.item || items.map((x) => x.title).join("; ").slice(0, 600) }));
  }, [fromBasket]);

  const renderTurnstile = () => {
    if (!siteKey || !tsRef.current || !window.turnstile || tsWidget.current) return;
    tsWidget.current = window.turnstile.render(tsRef.current, {
      sitekey: siteKey,
      theme: "dark",
      callback: (t) => setToken(t),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  };
  useEffect(() => {
    renderTurnstile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  /** Check some fields (a step, a question) or all of them; returns true when they pass. */
  const check = (fields?: Field[]) => {
    const keys = fields ?? (Object.keys(RULES) as Field[]);
    const next: Partial<Record<Field, string>> = {};
    for (const k of keys) {
      const msg = RULES[k]?.(values, files);
      if (msg) next[k] = msg;
    }
    if (!fields && siteKey && !token) next.turnstile = "Please wait for the security check to finish";
    setErrors((e) => {
      const merged = { ...e };
      for (const k of keys) merged[k] = next[k];
      if (next.turnstile) merged.turnstile = next.turnstile;
      return merged;
    });
    return Object.keys(next).length === 0;
  };

  const submit = async () => {
    if (!check()) {
      setStatus("error");
      setServerMsg("Please check the highlighted answers.");
      return false;
    }
    setStatus("loading");
    setServerMsg("");
    const fd = new FormData();
    (["name", "phone", "email", "type", "item", "message", "contact"] as const).forEach((k) => fd.append(k, values[k]));
    if (values.consent) fd.append("consent", "on");
    files.forEach((f) => fd.append("photos", f));
    fd.append("website", honeypot.current?.value ?? "");
    if (token) fd.append("cf-turnstile-response", token);
    try {
      const res = await fetch("/api/enquiry", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; id?: string; error?: string; fields?: Record<string, string> };
      if (!res.ok || !data.ok) {
        setErrors((data.fields as Partial<Record<Field, string>>) || {});
        setServerMsg(data.error || "Something went wrong. Please try again or call us.");
        setStatus("error");
        window.turnstile?.reset(tsWidget.current || undefined);
        setToken("");
        return false;
      }
      setRef(data.id || "");
      setStatus("success");
      if (picked.length) basket.clear();
      return true;
    } catch {
      setServerMsg("We could not reach the server. Check your connection and try again, or call us.");
      setStatus("error");
      return false;
    }
  };

  return { values, set, files, setFiles, picked, status, errors, serverMsg, ref, check, submit, honeypot, tsRef, siteKey, renderTurnstile };
}

export type Enquiry = ReturnType<typeof useEnquiry>;
