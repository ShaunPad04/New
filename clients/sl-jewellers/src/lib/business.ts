import business from "@content/business.json";

/* The shop's own facts (content/business.json) and the site's flags: everything a client
   component needs without the catalogue. Kept out of content.ts so the header's open-now chip
   and the enquiry form do not ship every product and specification to the browser (pre-launch
   QA, 8 Oct 2026: that was 67 KB of JSON parsed on every page). content.ts re-exports it all. */

export type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
/** A day is open with times, by appointment only, or closed. */
export type DayHours = { open: string; close: string } | { appointment: true } | null;
export const hasTimes = (h: DayHours): h is { open: string; close: string } => !!h && "open" in h;

export type Business = typeof business & { hours: { week: Record<DayKey, DayHours>; enquiriesNote?: string } };
export const BUSINESS = business as unknown as Business;

/** Vercel preview deployments only: the product page's alternative layouts and the ?v= switch
 *  that shows them. Production and local builds carry neither. */
export const PREVIEW_COMPARE = process.env.VERCEL_ENV === "preview";

/** true = launch mode: anything not confirmed by S&L is hidden rather than badged. On by default
 *  everywhere except Vercel preview deployments, where the red TODO badges are the to-do list;
 *  HIDE_UNCONFIRMED=true or false overrides that. A production build never shows a TODO. */
export const LAUNCH = process.env.HIDE_UNCONFIRMED ? process.env.HIDE_UNCONFIRMED === "true" : process.env.VERCEL_ENV !== "preview";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://sl-jewellers.vercel.app").replace(/\/$/, "");

export const ENQUIRY_TYPES = [
  { value: "buying", label: "Buying" },
  { value: "repair", label: "Repair" },
  { value: "resizing", label: "Resizing" },
  { value: "bespoke", label: "Sourcing a piece" },
  { value: "selling-gold", label: "Selling gold" },
  { value: "part-exchange", label: "Part-exchange" },
  { value: "visit", label: "Booking a visit" },
  { value: "other", label: "Other" },
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number]["value"];

/** WhatsApp is offered only once confirmed, or in preview. */
export const WHATSAPP_ON = BUSINESS.whatsapp.confirmed || !LAUNCH;
export const HOURS_ON = BUSINESS.hours.confirmed || !LAUNCH;

export const whatsappUrl = (message?: string) =>
  `https://wa.me/${BUSINESS.whatsapp.number}?text=${encodeURIComponent(message ?? BUSINESS.whatsapp.message)}`;
