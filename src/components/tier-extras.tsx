import type { Tier } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Flagship's priced-on-top lines and its closing note, under the list. */
export function TierExtras({ tier, muted }: { tier: Tier; muted: string }) {
  if (!tier.extras && !tier.note) return null;
  return (
    <div className="mt-7 grid gap-5 border-t border-ink-300 pt-6">
      {tier.extras ? (
        <div>
          <p className={cn("text-[0.75rem] font-semibold uppercase tracking-[0.06em]", muted)}>{tier.extras.label}</p>
          <ul className="mt-3 grid gap-1.5">
            {tier.extras.lines.map((l) => (
              <li key={l} className="text-sm leading-relaxed text-ink-800">{l}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {tier.note ? (
        <p className="text-sm leading-relaxed text-ink-700">
          <strong className="font-semibold text-ink-1000">{tier.note.lead}</strong> {tier.note.body}
        </p>
      ) : null}
    </div>
  );
}

