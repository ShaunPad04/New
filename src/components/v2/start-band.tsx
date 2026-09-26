import Link from "next/link";
import { VelocityMarquee } from "@/components/kit/velocity-marquee";

/**
 * START BAND (design system v2).
 *
 * The closing invitation as one enormous moving line — the Framer-template
 * move, done with this site's scroll-velocity marquee rather than a clock.
 * The whole ribbon is ONE link to the enquiry form. Its accessible name is
 * the aria-label, and the marquee inside is aria-hidden, so a screen reader
 * hears "Start a project" once instead of the ribbon's repeats.
 */
export function StartBand() {
  return (
    <section aria-label="Start a project" className="border-t border-ink-300">
      <Link
        href="/#contact"
        aria-label="Start a project — go to the enquiry form"
        className="group block py-14 outline-offset-[-6px] lg:py-20"
      >
        <div aria-hidden="true">
          <VelocityMarquee speed={1.1}>
            {["Start a project", "Let's build yours"].map((t, i) => (
              <span
                key={t}
                className={`display inline-flex items-center px-6 text-[clamp(3.5rem,12vw,12rem)] transition-colors duration-700 lg:px-10 ${
                  i % 2 ? "kit-outline group-hover:text-ink-1000" : "text-ink-1000"
                }`}
              >
                {t}
                <span className="pl-12 text-ink-500 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:rotate-45 lg:pl-20">
                  ↗
                </span>
              </span>
            ))}
          </VelocityMarquee>
        </div>
      </Link>
    </section>
  );
}
