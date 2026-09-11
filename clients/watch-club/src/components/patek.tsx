import { Reveal } from "@/components/reveal";
import { CinematicProductScroll } from "@/components/ui/cinematic-product-scroll";
import { patekPieces } from "@/lib/content";

/**
 * Patek Philippe complications.
 *
 * This is where the business's second area of genuine expertise gets its own
 * long-form treatment, and where the cinematic scroll section earns its
 * length: one piece at a time, full height, nothing else competing.
 */
export function Patek() {
  return (
    <section
      id="patek"
      aria-labelledby="patek-heading"
      className="scroll-mt-24 border-t border-obsidian-line bg-obsidian"
    >
      <div className="mx-auto max-w-[1600px] px-5 pt-24 sm:px-8 sm:pt-32">
        <Reveal>
          <div className="rule-accent mb-8 w-24" />
          <p className="eyebrow mb-5">Complications</p>
          <h2 id="patek-heading" className="display-lg max-w-3xl text-bone">
            Patek Philippe, understood properly.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-bone-muted">
            Perpetual calendars, split-seconds and minute repeaters are where
            most dealers stop and we start. Three from the current selection.
          </p>
        </Reveal>
      </div>

      <div className="mt-16">
        <CinematicProductScroll pieces={patekPieces} />
      </div>
    </section>
  );
}
