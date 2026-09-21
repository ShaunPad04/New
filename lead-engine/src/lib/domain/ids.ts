import { createHash, randomUUID } from "node:crypto";

export function newId(prefix: string): string {
  return `${prefix}_${randomUUID().replaceAll("-", "").slice(0, 16)}`;
}

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\b(ltd|limited|plc|llp|group|holdings|uk|the|and|&|co)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Two discoveries describing the same company and the same piece of work are
 * the same lead, whichever source found them. Project text is folded in so a
 * company running two separate Humber projects stays two leads.
 */
export function dedupeKey(input: { company: string; project?: string; location?: string }): string {
  const parts = [normalise(input.company), normalise(input.project ?? ""), normalise(input.location ?? "")];
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 32);
}

export function hostnameOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}
