import { cn } from "@/lib/utils";

/**
 * Sky + cloud plate — the reference hero and closing CTA sit on a pale blue
 * gradient with soft white cloud layers drifting over the copy at 60–70%
 * opacity. Homy uses cloud PNGs; these are drawn with layered radial
 * gradients and an SVG turbulence filter so nothing is shipped from Framer
 * and the plate costs nothing over the wire. Reduced motion stops the drift.
 */
export function Sky({ className, innerClassName, children, drift = true }: { className?: string; innerClassName?: string; children?: React.ReactNode; drift?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#d7edf9_0%,#c3e5f7_35%,#a9cfe3_70%,#8fb6cc_100%)]" />
      <div aria-hidden="true" className={cn("cloud cloud-a", drift && "cloud-drift")} />
      <div aria-hidden="true" className={cn("cloud cloud-b", drift && "cloud-drift-slow")} />
      <div aria-hidden="true" className={cn("cloud cloud-c", drift && "cloud-drift")} />
      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}

/** Loose cloud wisps that sit over a white section edge (the reference's "Cloud Image"). */
export function CloudWisps({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 overflow-hidden", className)}>
      <div className="cloud cloud-wisp-a" />
      <div className="cloud cloud-wisp-b" />
    </div>
  );
}
