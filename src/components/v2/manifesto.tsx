import Link from "next/link";
import { site } from "@/lib/content";
import { ScrollText } from "@/components/kit/scroll-text";
import { Reveal } from "@/components/reveal";

/**
 * MANIFESTO (design system v2, 2026-09-25).
 *
 * The first thing after the film. The hero says the name and nothing else,
 * so this is where the page starts talking — one sentence, set huge, that
 * lights word by word as it travels up the screen (`ScrollText`). The
 * sentence is the first half of `site.description`, the same words the meta
 * description and the JSON-LD carry, so the page's opening claim is the one
 * a search engine already has. Not `heroLine`: that is the hero's own lede,
 * one screen above, and saying it twice would be padding.
 *
 * The two facts beside it are verified business facts from CLAUDE.md
 * ("Founder-led, no account layer"; the Humberston copy on Shaun's
 * instruction). Nothing new is claimed here.
 */
export function Manifesto() {
  const statement = site.description.split(". ")[0] + ".";

  return (
    <section
      aria-labelledby="manifesto-heading"
      className="relative border-t border-ink-300"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-14 px-6 py-28 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-44">
        <div className="lg:col-span-3">
          <p className="kit-eyebrow">(Studio)</p>
          <h2 id="manifesto-heading" className="sr-only">
            What Black Line Agency does
          </h2>
        </div>
        <div className="lg:col-span-9">
          {/* dim 0.4, not the kit's 0.14: an unlit word is still visible
              text and axe holds it to the large-text 3:1 minimum. 40% white
              on ink-0 clears it at this size (>= 26px, weight 800). */}
          <ScrollText
            text={statement}
            dim={0.4}
            className="display text-[clamp(1.625rem,5.4vw,5.75rem)] leading-[0.98] text-ink-1000"
          />
          <Reveal variant="unblur">
            <div className="mt-16 grid gap-10 border-t border-ink-300 pt-10 sm:grid-cols-3 lg:mt-24">
              <div>
                <p className="kit-eyebrow">Who you work with</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-800">
                  Founder-led. The two people who design and build your site are
                  the two people you talk to — no account layer.
                </p>
              </div>
              <div>
                <p className="kit-eyebrow">Where we are</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-800">
                  Humberston, Grimsby, Lincolnshire — working across the UK.
                </p>
              </div>
              <div className="flex items-end sm:justify-end">
                <Link
                  href="/studio"
                  className="group inline-flex min-h-11 items-center gap-3 text-sm text-ink-1000"
                >
                  <span className="underline decoration-ink-500 underline-offset-[6px] transition-colors group-hover:decoration-ink-1000">
                    Meet the studio
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
