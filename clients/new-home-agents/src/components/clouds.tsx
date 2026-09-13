import { cn } from "@/lib/utils";

/**
 * Sky plate — the reference hero and closing CTA sit on a pale blue
 * gradient. Earlier builds drew soft cloud layers over it; Brad found the
 * blur cheap, so the plate is now the clean gradient alone.
 */
export function Sky({ className, innerClassName, children }: { className?: string; innerClassName?: string; children?: React.ReactNode; drift?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#dcefFA_0%,#c9e6f6_40%,#b3d5e9_75%,#9dc3da_100%)]" />
      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}
