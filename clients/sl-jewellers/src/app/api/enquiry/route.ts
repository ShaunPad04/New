import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { enquirySchema, MAX_FILES, MAX_FILE_BYTES, ALLOWED_TYPES } from "@/lib/enquiry/schema";
import { clientIp, isRateLimited } from "@/lib/enquiry/ratelimit";
import { verifyTurnstile } from "@/lib/enquiry/turnstile";
import { storeLead, type LeadRecord } from "@/lib/enquiry/store";
import { mailConfigured, sendOwnerEmail, sendAutoReply, type Attachment } from "@/lib/enquiry/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bad = (status: number, error: string, fields?: Record<string, string>) =>
  NextResponse.json({ ok: false, error, fields }, { status });

export async function POST(req: Request) {
  const ip = clientIp(req);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad(400, "That did not look like a form submission.");
  }

  // 1. Honeypot: bots fill every field. Pretend it worked and drop it.
  if (String(form.get("website") || "").length > 0) {
    return NextResponse.json({ ok: true, id: "ok" });
  }

  // 2. Rate limit per IP.
  if (await isRateLimited(ip)) {
    return bad(429, "Too many enquiries from this connection. Please try again in a few minutes, or call us.");
  }

  // 3. Validate fields.
  const raw = Object.fromEntries(
    ["name", "phone", "email", "type", "item", "message", "contact", "consent"].map((k) => [k, form.get(k) == null ? "" : String(form.get(k))]),
  );
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fields[key]) fields[key] = issue.message;
    }
    return bad(422, "Please check the highlighted fields.", fields);
  }
  const data = parsed.data;

  // 4. Turnstile.
  const ts = await verifyTurnstile(form.get("cf-turnstile-response") as string | null, ip);
  if (!ts.ok) {
    return bad(400, "We could not confirm you are human. Please try again, or call us.", { turnstile: ts.reason ?? "failed" });
  }

  // 5. Photos (optional, up to 3 × 5 MB).
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) return bad(422, `You can attach up to ${MAX_FILES} photos.`, { photos: `Up to ${MAX_FILES} photos` });
  const attachments: Attachment[] = [];
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) return bad(422, `${f.name} is larger than 5 MB.`, { photos: "Each photo must be 5 MB or smaller" });
    if (!ALLOWED_TYPES.includes(f.type)) return bad(422, `${f.name} is not a supported image.`, { photos: "Use JPG, PNG, WebP or HEIC photos" });
    attachments.push({ filename: f.name.replace(/[^\w.\-]+/g, "_").slice(0, 80), content: Buffer.from(await f.arrayBuffer()) });
  }

  // 6. Store first, so nothing is lost if email fails.
  const lead: LeadRecord = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    receivedAt: new Date().toISOString(),
    name: data.name,
    phone: data.phone,
    email: data.email,
    type: data.type,
    item: data.item,
    message: data.message,
    contact: data.contact,
    files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    ip,
    userAgent: req.headers.get("user-agent") || "",
  };
  const stored = await storeLead(lead);

  // 7. Email the owner, then the customer.
  let emailed = false;
  let emailError: string | undefined;
  if (mailConfigured()) {
    try {
      const r = await sendOwnerEmail(lead, attachments);
      if (r.error) throw new Error(r.error.message);
      emailed = true;
      sendAutoReply(lead).catch((e) => console.error("[enquiry] auto-reply failed:", e));
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error("[enquiry] owner email failed:", emailError);
    }
  } else {
    emailError = "email not configured";
    console.warn("[enquiry] RESEND_API_KEY / ENQUIRY_TO_EMAIL / ENQUIRY_FROM_EMAIL not set; lead", lead.id, "not emailed");
  }

  if (!emailed && !stored.stored) {
    return bad(503, "We could not send your enquiry just now. Please call or WhatsApp us instead.", { server: emailError || stored.error || "unavailable" });
  }

  return NextResponse.json({ ok: true, id: lead.id, emailed, stored: stored.stored, store: stored.where });
}

export function GET() {
  return NextResponse.json({ ok: false, error: "POST only" }, { status: 405 });
}
