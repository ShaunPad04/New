import { BRAND_MARK, site } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * WORDMARK
 *
 * Set to match the printed business card: light weight, wide tracking, all
 * caps, "AGENCY" beneath flanked by rules, finished in a brushed-silver foil
 * gradient.
 *
 * The trademark symbol comes from BRAND_MARK, which is "™" until the mark is
 * actually registered — see the note in lib/content.ts. Do not hard-code "®".
 */
export function Wordmark({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "stacked";
  className?: string;
}) {
  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-2", className)}>
        <span className="wordmark foil text-xl sm:text-2xl">
          {site.wordmarkPrimary}
          <span className="brand-mark">{BRAND_MARK}</span>
        </span>
        <span className="flex w-full items-center gap-3">
          <span aria-hidden="true" className="h-px flex-1 bg-ink-500" />
          <span className="wordmark-sub foil text-[0.6875rem]">
            {site.wordmarkSecondary}
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-ink-500" />
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-baseline gap-2.5", className)}>
      <span className="wordmark foil text-[0.9375rem]">
        {site.wordmarkPrimary}
        <span className="brand-mark">{BRAND_MARK}</span>
      </span>
      <span aria-hidden="true" className="h-3 w-px bg-ink-500" />
      <span className="wordmark-sub text-ink-700 text-[0.5625rem]">
        {site.wordmarkSecondary}
      </span>
    </span>
  );
}
