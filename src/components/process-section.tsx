import { processSteps } from "@/lib/content";
import { resolveProcessImage } from "@/lib/work-image";
import { ProcessScroll } from "@/components/process-scroll";

/**
 * Server wrapper for the pinned process ride.
 *
 * Exists so the three pages that show the process do not each repeat the
 * disk resolution — and so `ProcessScroll`, which is a client component and
 * therefore cannot touch `fs`, is handed finished paths.
 *
 * Render it as a SIBLING of the surrounding sections, never nested inside
 * one: ScrollTrigger pins by wrapping the element in a spacer, which does
 * not work inside another section's max-width container.
 */
export function ProcessSection() {
  return (
    <ProcessScroll
      images={Object.fromEntries(
        processSteps.map((s) => [s.id, resolveProcessImage(s.id)]),
      )}
    />
  );
}
