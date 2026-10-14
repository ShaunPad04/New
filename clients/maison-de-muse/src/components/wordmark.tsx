import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * WORDMARK
 *
 * Set in the display serif, uppercase and widely tracked, echoing the
 * café's printed logo. A hairline "M" monogram stands beside it so the mark
 * still reads at the smallest sizes. Type, not an image: no logo file has
 * been supplied, and a vector one can replace this in a single component.
 */
export function Wordmark({
  variant = "compact",
  className,
  tone = "dark",
}: {
  variant?: "compact" | "stacked";
  className?: string;
  tone?: "dark" | "light";
}) {
  const color = tone === "dark" ? "text-espresso" : "text-cream";

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-start gap-2", className)}>
        <span className={cn("wordmark text-2xl sm:text-3xl", color)}>{site.name}</span>
        <span
          className={cn(
            "text-[0.625rem] font-medium uppercase tracking-[0.32em]",
            tone === "dark" ? "text-mocha" : "text-cream/70"
          )}
        >
          Cleethorpes
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "display flex h-8 w-8 items-center justify-center rounded-full border text-lg leading-none",
          tone === "dark" ? "border-espresso/20 text-espresso" : "border-cream/40 text-cream"
        )}
      >
        M
      </span>
      <span className={cn("wordmark text-[0.9375rem] sm:text-base", color)}>{site.name}</span>
    </span>
  );
}
