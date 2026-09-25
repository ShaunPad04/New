import { heroDisciplines } from "@/lib/content";
import { TextRing } from "@/components/kit/text-ring";
import { CAPABILITIES } from "@/components/capabilities";
import { Cta } from "@/components/cta";

/**
 * DISCIPLINES RING (design system v2).
 *
 * The page's one "object" moment: the studio's disciplines on the wall of a
 * cylinder that turns with the scroll. CSS transforms only; under reduced
 * motion it lays out flat as a line (kit.css). Short labels on purpose — the
 * ring gives every word the same slot, so a long title would collide.
 */
export function DisciplinesRing() {
  return (
    <section
      aria-labelledby="ring-heading"
      className="relative overflow-hidden border-t border-ink-300 py-28 lg:py-40"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 text-center sm:px-10 lg:px-16">
        <p className="kit-eyebrow">(One studio)</p>
        <h2
          id="ring-heading"
          className="display mx-auto mt-6 max-w-[18ch] text-display-sm text-ink-1000"
        >
          Every discipline under one roof.
        </h2>
        <p className="mx-auto mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-700">
          Design, build, search and the marketing that keeps a site earning —
          handled by the same two founders, so nothing is lost between agencies.
        </p>
      </div>
      <div className="mt-4 lg:mt-8">
        <TextRing
          words={[...heroDisciplines, "Email", "SMS"]}
          /* Wider slots than the kit default: these labels are set in the
             uppercase display cut, which is broad, and 7.5em let
             "DEVELOPMENT" touch its neighbour at every width. */
          className="display text-[clamp(1.5rem,3.6vw,3.25rem)] text-ink-1000"
          slot="10em"
        />
      </div>
      {/* The capability claims from the old band, kept word for word — they
          carry the "scores, never conformance" rule (content.ts). */}
      <div className="mx-auto mt-10 w-full max-w-[1100px] px-6 sm:px-10 lg:mt-24">
        <ul aria-label="What every build is held to" className="flex flex-wrap justify-center gap-2.5">
          {CAPABILITIES.map((item) => (
            <li key={item}>
              <span className="eyebrow whitespace-nowrap">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <Cta href="/pricing" variant="ghost">See the pricing</Cta>
        </div>
      </div>
    </section>
  );
}
