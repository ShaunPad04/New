import { stack } from "@/lib/content";
import { Reveal } from "@/components/reveal";

/**
 * THE STACK
 *
 * The client's reference puts a client logo wall here. Black Line Agency has
 * no clients to name yet, and a wall of invented logos is the single most
 * common lie on an agency site — it is also actionable (CPUTR 2008 / DMCCA
 * 2024 in the UK, FTC Act §5 in the US), and it is the first thing a prospect
 * checks.
 *
 * So the composition is kept — centred section word, sub-line, a divided row,
 * a caption — and the content is swapped for something true: the stack the
 * studio actually builds on. It answers the same question the logo wall is
 * really being asked ("are these people serious?") without asserting anything
 * that isn't so.
 *
 * The reference also inverts this band to white. That is left for later: the
 * island nav renders white-on-transparent and has no light-section observer
 * wired up yet, so a white band here would swallow the navigation.
 */
export function Stack() {
  return (
    <section
      aria-labelledby="stack-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 text-center sm:px-10 lg:px-16 lg:py-32">
        <Reveal>
          <h2 id="stack-heading" className="display text-display-md text-ink-1000">
            Our stack
          </h2>
          <p className="mx-auto mt-5 max-w-[46ch] font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-700">
            Hand-written code. No page builders, no rented platform.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {stack.map((tool) => (
              <li
                key={tool}
                className="display-soft text-xl text-ink-600 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-ink-1000 sm:text-2xl lg:text-3xl"
              >
                {tool}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mx-auto mt-16 max-w-[52ch] text-sm leading-relaxed text-ink-700">
            Everything is built on infrastructure we host and monitor
            ourselves,
            <br className="hidden sm:block" /> so there is one number to call
            when something breaks.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
