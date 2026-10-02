import type { ReactNode } from "react";
import { BRAND_MARK } from "@/lib/content";

/**
 * The inner pages' shared frame, taken from the homepage hero (2026-10-02,
 * Brad: the other pages cannot have "a whole different design/font system"):
 * its hairline three-column grid, its 12px bold caps labels, the bracketed
 * section label and the bilingual bar label. One source, so the case study,
 * the services page and the rest cannot drift apart.
 */
// Neiden's labels, measured: DM Sans 700, 12px, caps, -0.02em.
export const LABEL = "text-[0.75rem] font-bold uppercase tracking-[-0.02em]";
export const H2 = "display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.9] text-ink-1000";

/** The hero's rules: both outer edges and the two column rules, full height.
    `z=""` leaves it unstacked, under the content that follows it. `reading`
    (the light bands) drops the column rules below lg, where they would run
    through the text; the dark tops keep all four, as the homepage hero does. */
export function Grid({ rule, z = "z-[1]", reading = false }: { rule: string; z?: string; reading?: boolean }) {
  const col = `border-r ${rule} ${reading ? "max-lg:border-r-0" : ""}`;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 left-6 right-6 grid grid-cols-3 border-x sm:left-10 sm:right-10 ${z} ${rule}`}
    >
      <span className={col} />
      <span className={col} />
    </div>
  );
}

/** "[ 01 — The brief ]" */
export function SectionLabel({ index, label, className = "" }: { index: string; label: string; className?: string }) {
  return (
    <p className={`${LABEL} text-ink-700 ${className}`}>
      [ <span className="text-accent">{index}</span> — {label} ]
    </p>
  );
}

/** One block: the label in the first column, heading and content across two. */
export function Block({ index, label, id, heading, children }: { index: string; label: string; id: string; heading: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="relative z-[2] grid gap-8 py-16 lg:grid-cols-3 lg:gap-0 lg:py-24">
      <SectionLabel index={index} label={label} className="lg:pr-10" />
      <div className="lg:col-span-2 lg:pl-3">
        <h2 id={id} className={H2}>
          {heading}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

/** The red four bars and "[BL™ — Label / 日本語]", as the homepage's studio
    and portfolio sections are labelled (our words, Japanese kept by Brad). */
export function BarLabel({ label, ja }: { label: string; ja: string }) {
  return (
    <p className={`flex items-center gap-3 ${LABEL}`}>
      <span aria-hidden="true" className="flex gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-3 w-[5px] rounded-[1px] bg-accent" />
        ))}
      </span>
      <span>
        [BL{BRAND_MARK} — {label} /{" "}
        <span lang="ja" className="text-ink-600">
          {ja}
        </span>
        ]
      </span>
    </p>
  );
}
