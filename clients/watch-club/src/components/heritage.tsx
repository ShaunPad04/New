import { Reveal } from "@/components/reveal";
import { heritage } from "@/lib/content";

/**
 * Heritage timeline.
 *
 * An <ol> because the milestones are genuinely sequential — the order is the
 * content. The connecting rule is drawn with a border on the list rather than
 * absolutely positioned decoration, so it survives text zoom.
 */
export function Heritage() {
  return (
    <section id="heritage" className="scroll-mt-24 bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        <Reveal>
          <div className="rule-accent mb-8 w-24" />
          <p className="eyebrow mb-5">{heritage.eyebrow}</p>
          <h2 className="display-lg max-w-3xl text-bone">
            {heritage.headline}
          </h2>
        </Reveal>

        <ol className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {heritage.milestones.map((milestone, i) => (
            <li key={milestone.year}>
              <Reveal delay={i * 0.08}>
                <div className="border-t border-obsidian-line pt-6">
                  <p className="font-mono text-sm tracking-[0.16em] text-champagne">
                    {milestone.year}
                  </p>
                  <h3 className="display-sm mt-4 text-bone">
                    {milestone.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                    {milestone.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
