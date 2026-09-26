import { heroDisciplines, services } from "@/lib/content";
import { VelocityMarquee } from "@/components/kit/velocity-marquee";

/**
 * SERVICE MARQUEE (design system v2).
 *
 * Two ribbons in opposition: the six services, huge, alternating solid and
 * outline; beneath them the disciplines in mono, drifting the other way.
 * Both feel the scroll — they speed up, lean and reverse with it — which is
 * what separates this from a stock ticker running on a clock.
 *
 * Read from `services` and `heroDisciplines`, so the ribbon can never list
 * a service the site does not sell. The first copy of each ribbon is the
 * accessible one; the repeats are aria-hidden inside the component.
 */
export function ServiceMarquee() {
  return (
    <section aria-label="What we do" className="overflow-hidden border-t border-ink-300 py-16 lg:py-24">
      <div className="grid gap-3 lg:gap-5">
        <VelocityMarquee speed={0.7}>
          {services.map((s, i) => (
            <span
              key={s.id}
              className={`display px-5 text-[clamp(2.75rem,8.5vw,8.5rem)] lg:px-8 ${i % 2 ? "kit-outline" : "text-ink-1000"}`}
            >
              {s.title}
              <span className="pl-10 text-ink-500 lg:pl-16" aria-hidden="true">
                ✳
              </span>
            </span>
          ))}
        </VelocityMarquee>
        <VelocityMarquee reverse speed={0.45}>
          {[...heroDisciplines, "Email", "SMS", "Hosting"].map((d) => (
            <span key={d} className="kit-eyebrow px-6 text-sm text-ink-600 lg:px-10 lg:text-base">
              {d}
              <span className="pl-12 lg:pl-20" aria-hidden="true">
                /
              </span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
