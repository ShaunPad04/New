import Anthropic from "@anthropic-ai/sdk";
import { requireAnthropic } from "../env";
import type { ClientConfig } from "../clients/types";
import type { Lead, OutreachDraft } from "../domain/types";

/**
 * Outreach drafts are written from what the evidence actually supports.
 *
 * The one thing every draft must avoid is telling a prospect what they need.
 * BlackLine does not know that they need accommodation — that is the question
 * being asked. Claiming otherwise is both a lie and, in a commercial email, a
 * misleading practice under the CPUTRs.
 */

function reason(lead: Lead): string {
  const where = lead.opportunity.projectLocation ?? lead.company.location ?? "the Humber area";
  const what = lead.opportunity.projectName ?? lead.opportunity.projectType ?? "work";
  return `${what} around ${where}`;
}

function signOff(client: ClientConfig): string {
  const { senderName, senderOrganisation, senderEmail, senderPhone } = client.outreach;
  return [senderName, senderOrganisation, senderEmail, senderPhone].join("\n");
}

export function templateDrafts(lead: Lead, client: ClientConfig): OutreachDraft[] {
  const now = new Date().toISOString();
  const name = lead.contact.name?.split(" ")[0] ?? "there";
  const activity = reason(lead);

  const email = [
    `Hi ${name},`,
    "",
    `I noticed ${lead.company.name} is involved with ${activity}.`,
    "",
    `We work with ${client.name} in the ${client.location.town} and Grimsby area, and we help businesses connect with accommodation for contractors, project teams and employees working in the region.`,
    "",
    "I wondered whether your team currently needs to arrange accommodation for anyone working on this. If so, I can put you straight in touch with them to talk through the options.",
    "",
    "If it is not relevant, no problem at all — just let me know and I will leave it there.",
    "",
    "Best regards,",
    signOff(client),
  ].join("\n");

  const linkedin = [
    `Hi ${name}, I saw that ${lead.company.name} is involved with ${activity}.`,
    `We work with ${client.name} near the site and help businesses sort accommodation for project teams working in the area.`,
    "Is that something you are arranging at the moment? Happy to make an introduction if it is useful.",
  ].join(" ");

  const phone = [
    `Opening: "Hi, is that ${lead.contact.name ?? "the person who looks after site logistics"}? My name is ${client.outreach.senderName} from ${client.outreach.senderOrganisation}."`,
    "",
    `Reason for the call: "I saw ${lead.company.name} is involved with ${activity}, so I wanted to ask a quick question rather than sell you anything."`,
    "",
    `Question: "Do you arrange accommodation for people working on that, or does it sit with someone else there?"`,
    "",
    `If yes: "We work with ${client.name} in ${client.location.town}. Would it help if I introduced you? They handle the availability and pricing directly — I just make the introduction."`,
    "",
    `If no: "No problem. Is there anyone there who does handle it, so I am not bothering you again?"`,
  ].join("\n");

  const followUp = [
    `Hi ${name},`,
    "",
    `I got in touch last week about ${activity} — I appreciate it may not have been the right time.`,
    "",
    `If accommodation for anyone working in the area is something you deal with, I am happy to introduce you to ${client.name}. If not, I will close this off and stop taking up your inbox.`,
    "",
    "Best regards,",
    signOff(client),
  ].join("\n");

  return [
    { channel: "email", subject: `${lead.company.name} — accommodation near ${lead.opportunity.projectLocation ?? client.location.town}?`, body: email, generatedAt: now, generator: "template" },
    { channel: "linkedin", body: linkedin, generatedAt: now, generator: "template" },
    { channel: "phone", body: phone, generatedAt: now, generator: "template" },
    { channel: "follow_up", subject: "Following up", body: followUp, generatedAt: now, generator: "template" },
  ];
}

export type OutreachOutcome =
  | { ok: true; drafts: OutreachDraft[]; generator: "ai" | "template" }
  | { ok: false; reason: string };

/**
 * Drafts personalised against the lead's evidence. Falls back to the templates
 * above when the API is not configured — the templates are honest on their own,
 * so there is no reason to block outreach on an API key.
 */
export async function generateDrafts(lead: Lead, client: ClientConfig): Promise<OutreachOutcome> {
  const configured = requireAnthropic();
  if (!configured.configured) {
    return { ok: true, drafts: templateDrafts(lead, client), generator: "template" };
  }

  const verified = lead.evidence.filter((e) => e.kind === "verified");
  const anthropic = new Anthropic({ apiKey: configured.value.apiKey });

  const system = [
    `You write short, plain first-contact messages for ${client.outreach.senderOrganisation}, which introduces businesses to ${client.name}, an accommodation provider in ${client.location.town}.`,
    "",
    "Rules that are not negotiable:",
    `1. You are writing as ${client.outreach.senderOrganisation}. You are NOT ${client.name}. Never imply otherwise.`,
    "2. Never state that the recipient needs accommodation. Ask whether they do.",
    "3. Never mention a room, a rate, availability or a price. We do not hold that information.",
    "4. Use only the facts listed below. Do not add a detail the evidence does not contain.",
    "5. British English. No exclamation marks, no 'I hope this finds you well', no hard sell.",
    "6. Give them an easy way to say no.",
    "",
    "Forbidden phrasings: " + client.outreach.forbiddenClaims.join("; "),
  ].join("\n");

  const facts = [
    `Company: ${lead.company.name}`,
    lead.company.industry ? `Industry: ${lead.company.industry}` : "",
    lead.contact.name ? `Contact: ${lead.contact.name}${lead.contact.role ? `, ${lead.contact.role}` : ""}` : "Contact: not identified",
    `Why this lead exists: ${lead.signalSummary}`,
    "",
    "Verified facts, each from a published source:",
    ...verified.map((e) => `- ${e.statement}`),
    "",
    "Write four messages, separated by lines containing only ---, in this order:",
    "1. An email. First line must be 'Subject: ...'.",
    "2. A LinkedIn message, under 90 words.",
    "3. A phone opening with branches for yes and no.",
    "4. A follow-up email for no reply after a week.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const message = await anthropic.messages.create({
      model: configured.value.model,
      max_tokens: 4000,
      output_config: { effort: "low" },
      system,
      messages: [{ role: "user", content: facts }],
    });

    if (message.stop_reason === "refusal") {
      return { ok: true, drafts: templateDrafts(lead, client), generator: "template" };
    }

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    const parts = text.split(/^\s*---\s*$/m).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 4) return { ok: true, drafts: templateDrafts(lead, client), generator: "template" };

    const now = new Date().toISOString();
    const channels: OutreachDraft["channel"][] = ["email", "linkedin", "phone", "follow_up"];
    const drafts: OutreachDraft[] = parts.slice(0, 4).map((part, index) => {
      const subjectMatch = /^Subject:\s*(.+)$/im.exec(part);
      return {
        channel: channels[index] ?? "email",
        subject: subjectMatch?.[1]?.trim(),
        body: part.replace(/^Subject:\s*.+$/im, "").trim(),
        generatedAt: now,
        generator: "ai" as const,
      };
    });

    const offending = findForbidden(drafts, client);
    if (offending) {
      // A draft that breaks the rules is not published; the honest template is.
      return { ok: true, drafts: templateDrafts(lead, client), generator: "template" };
    }

    return { ok: true, drafts, generator: "ai" };
  } catch {
    return { ok: true, drafts: templateDrafts(lead, client), generator: "template" };
  }
}

export function findForbidden(drafts: OutreachDraft[], client: ClientConfig): string | undefined {
  for (const draft of drafts) {
    const haystack = `${draft.subject ?? ""} ${draft.body}`.toLowerCase();
    const hit = client.outreach.forbiddenClaims.find((claim) => haystack.includes(claim.toLowerCase()));
    if (hit) return hit;
  }
  return undefined;
}
