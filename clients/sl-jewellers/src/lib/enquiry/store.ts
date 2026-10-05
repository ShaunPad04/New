export type LeadRecord = {
  id: string;
  receivedAt: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  item: string;
  message: string;
  contact: string;
  files: { name: string; size: number; type: string }[];
  ip: string;
  userAgent: string;
  emailed?: boolean;
};

/**
 * An optional second copy of every enquiry, written BEFORE any email is
 * attempted so an email outage cannot lose a lead. Choose with LEAD_STORE:
 *
 *   none    the default, and the right answer for this shop. The enquiry goes
 *           to the owner's inbox and nowhere else, so there is no database to
 *           own, pay for or keep. If the email cannot be sent the visitor is
 *           told to phone instead, rather than being told it worked.
 *   sheet   POST the lead to a URL you control (LEAD_WEBHOOK_URL) — a Google
 *           Apps Script that appends a row to a spreadsheet, or Zapier/Make.
 *           Use this if you want a searchable record of enquiries.
 *   log     write it to the server log. Development only.
 *
 * The Vercel KV / Upstash Redis option was removed at handover: it was a
 * fourth account to inherit for a copy of something that is already in an
 * inbox. `sheet` does the same job on the owner's own Google account.
 */
export async function storeLead(lead: LeadRecord): Promise<{ stored: boolean; where: string; error?: string }> {
  const mode = (process.env.LEAD_STORE || "none").toLowerCase();
  try {
    if (mode === "sheet") {
      const hook = process.env.LEAD_WEBHOOK_URL;
      if (!hook) throw new Error("LEAD_STORE=sheet but LEAD_WEBHOOK_URL is not set");
      const res = await fetch(hook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`webhook responded ${res.status}`);
      return { stored: true, where: "sheet" };
    }
    if (mode === "log") {
      console.log("[enquiry] LEAD_STORE=log:", JSON.stringify(lead));
      return { stored: true, where: "log" };
    }
    return { stored: false, where: "none" };
  } catch (err) {
    console.error("[enquiry] store failed:", err);
    return { stored: false, where: mode, error: err instanceof Error ? err.message : String(err) };
  }
}
