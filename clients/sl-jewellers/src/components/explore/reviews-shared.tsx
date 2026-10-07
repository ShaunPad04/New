import type { Review } from "@/lib/content";

/** Where a review was left: Google's five stars, or Facebook's recommendation (never mixed). */
export function Source({ r, className = "" }: { r: Review; className?: string }) {
  return (
    <span className={className}>
      {r.rating ? (
        <>
          <span className="stars" aria-label={`${r.rating} out of 5 stars on ${r.platform}`}>
            {"★".repeat(r.rating)}
          </span>{" "}
          <span aria-hidden="true">{r.platform}</span>
        </>
      ) : (
        <>Recommends on {r.platform}</>
      )}
    </span>
  );
}

/** A length class so long reviews set smaller and every quote fits its frame whole. */
export const size = (text: string) => (text.length < 95 ? "s" : text.length < 180 ? "m" : "l");

export const num = (i: number) => String(i + 1).padStart(2, "0");
