import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The agency's own logo, as published on newhomeagents.co.uk
 * (public/images/brand/logo.png, 500×204) — a green block with white type,
 * which reads on both light and dark surfaces. A vector master should be
 * supplied by the client before launch.
 */
export function Logo({ tone = "dark", className, height = 36 }: { tone?: "dark" | "white"; className?: string; height?: number }) {
  const width = Math.round((500 / 204) * height);
  return (
    <Link href="/" aria-label={`${site.name} — home`} className={cn("inline-flex shrink-0 items-center", className)}>
      <Image
        src="/images/brand/logo.png"
        alt={site.name}
        width={width}
        height={height}
        priority
        className={cn("h-auto rounded-[3px]", tone === "white" && "ring-1 ring-white/20")}
        style={{ width, height: "auto" }}
      />
    </Link>
  );
}
