import { business } from "@/lib/content";

/**
 * WATCH CLUB lockup.
 *
 * The real logo has not reached this repository yet, so the mark is set in
 * type: a thin square bezel enclosing a minute hand at twelve, beside a
 * two-line wordmark at wide tracking. This mirrors the reference lockup's
 * proportions (small mark, two stacked lines) so nothing around it has to
 * move when the real asset lands.
 *
 * TO SWAP IN THE REAL LOGO: replace the <svg> with the supplied file and keep
 * the outer element's sizing. Nothing else in the header depends on this
 * component's internals.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="0.6"
          y="0.6"
          width="24.8"
          height="24.8"
          rx="5"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        <circle
          cx="13"
          cy="13"
          r="7.4"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <path
          d="M13 13V7.6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M13 13h3.6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>

      <span className="flex flex-col leading-[1.05]">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-bone">
          Watch
        </span>
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.3em] text-bone">
          Club
        </span>
        <span className="sr-only">{business.name}</span>
      </span>
    </span>
  );
}
