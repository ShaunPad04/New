import { Resend } from "resend";
import { BUSINESS } from "@/lib/content";
import { typeLabel } from "./schema";
import type { LeadRecord } from "./store";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");

export type Attachment = { filename: string; content: Buffer };

export function mailConfigured() {
  return !!(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL);
}

/**
 * Resend's shared `onboarding@resend.dev` sender only delivers to the address
 * that owns the Resend account, which is fine for the owner's copy and useless
 * for the customer's. Until a real sending domain is verified we skip the
 * auto-reply rather than firing a send that is going to be rejected.
 */
export function canEmailCustomers() {
  const from = process.env.ENQUIRY_FROM_EMAIL || "";
  return mailConfigured() && !/resend\.dev>?\s*$/i.test(from.trim());
}

export async function sendOwnerEmail(lead: LeadRecord, attachments: Attachment[]) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = `New enquiry: ${typeLabel(lead.type)}${lead.item ? ` – ${lead.item}` : ""} from ${lead.name}`;
  const contact = { phone: "Phone call", whatsapp: "WhatsApp", email: "Email" }[lead.contact] ?? lead.contact;
  const html = `
  <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
    <h2 style="margin:0 0 12px">New website enquiry</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><b>Name</b></td><td>${esc(lead.name)}</td></tr>
      <tr><td><b>Phone</b></td><td><a href="tel:${esc(lead.phone)}">${esc(lead.phone)}</a></td></tr>
      <tr><td><b>Email</b></td><td><a href="mailto:${esc(lead.email)}">${esc(lead.email)}</a></td></tr>
      <tr><td><b>Enquiry</b></td><td>${esc(typeLabel(lead.type))}${lead.item ? ` – ${esc(lead.item)}` : ""}</td></tr>
      <tr><td><b>Reply by</b></td><td>${esc(contact)}</td></tr>
      <tr><td valign="top"><b>Message</b></td><td>${nl2br(lead.message)}</td></tr>
      <tr><td><b>Photos</b></td><td>${lead.files.length ? lead.files.map((f) => esc(f.name)).join(", ") + " (attached)" : "none"}</td></tr>
      <tr><td><b>Received</b></td><td>${esc(lead.receivedAt)} · ref ${esc(lead.id)}</td></tr>
    </table>
    <p style="color:#666;font-size:13px;margin-top:16px">Sent from the enquiry form at ${esc(process.env.NEXT_PUBLIC_SITE_URL || "the website")}. Reply to this email to answer the customer directly.</p>
  </div>`;

  return resend.emails.send({
    from: process.env.ENQUIRY_FROM_EMAIL!,
    to: process.env.ENQUIRY_TO_EMAIL!.split(",").map((s) => s.trim()),
    replyTo: lead.email,
    subject,
    html,
    text: `New enquiry from ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nType: ${typeLabel(lead.type)} ${lead.item}\nReply by: ${contact}\n\n${lead.message}\n\nRef ${lead.id}`,
    attachments: attachments.map((a) => ({ filename: a.filename, content: a.content })),
  });
}

export async function sendAutoReply(lead: LeadRecord) {
  if (!canEmailCustomers()) {
    console.warn("[enquiry] auto-reply skipped: ENQUIRY_FROM_EMAIL is not on a verified domain.");
    return null;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const b = BUSINESS;
  const html = `
  <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#111">
    <p>Hi ${esc(lead.name.split(" ")[0])},</p>
    <p>Thanks for getting in touch with S&amp;L Jewellers. We have your enquiry about <b>${esc(typeLabel(lead.type).toLowerCase())}${lead.item ? ` (${esc(lead.item)})` : ""}</b> and we will come back to you by ${esc({ phone: "phone", whatsapp: "WhatsApp", email: "email" }[lead.contact] ?? lead.contact)}, usually the same working day.</p>
    <p>If it is urgent, call us on <a href="tel:${b.phone.e164}">${b.phone.display}</a> or pop into the shop at ${esc(b.address.street)}, ${esc(b.address.town)} ${esc(b.address.postcode)}.</p>
    <p style="color:#555;font-size:13px">Your message:<br>${nl2br(lead.message)}</p>
    <p>S&amp;L Jewellers<br>${esc(b.address.street)}, ${esc(b.address.town)} ${esc(b.address.postcode)}<br><a href="${esc(b.social.instagram.url)}">Instagram</a> · <a href="${esc(b.social.facebook.url)}">Facebook</a></p>
    <p style="color:#888;font-size:12px">Ref ${esc(lead.id)}. This is an automatic confirmation; replies to it go to the shop.</p>
  </div>`;
  return resend.emails.send({
    from: process.env.ENQUIRY_FROM_EMAIL!,
    to: lead.email,
    replyTo: process.env.ENQUIRY_TO_EMAIL!.split(",")[0].trim(),
    subject: "Thanks, we have your enquiry – S&L Jewellers",
    html,
    text: `Hi ${lead.name.split(" ")[0]},\n\nThanks for getting in touch with S&L Jewellers. We have your enquiry and will come back to you soon.\n\nIf it is urgent, call ${b.phone.display}.\n\nRef ${lead.id}`,
  });
}
