import Link from "next/link";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Wordmark set in type. Brad asked for the name alone, no logo block —
 * uppercase, letter-spaced, medium weight, so it sits quietly against the
 * heavy display headline the way a luxury agency's mark should.
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "white"; className?: string; height?: number }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ease-out-soft",
        tone === "white" ? "text-white" : "text-ink",
        className
      )}
    >
      {site.name}
    </Link>
  );
}
