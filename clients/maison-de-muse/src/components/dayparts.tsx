import Link from "next/link";
import { dayparts, rollingWords } from "@/lib/content";
import { Reveal } from "@/components/reveal";

/**
 * DAYPARTS — the template's dark "Chill Up / Light Up" band: a row of tag
 * pills, a headline whose second word rolls through the day, and the
 * supporting text. Here the three beats of the café's day sit beneath it.
 *
 * The rolling word is pure CSS (a translated column inside an
 * overflow-hidden box). Screen readers get a single static sentence via
 * `aria-hidden` on the animated column and an sr-only line.
 */
export function Dayparts() {
  return (
    <section
      id="day"
      aria-labelledby="day-heading"
      className="relative isolate overflow-hidden bg-plum-deep text-cream"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 60% at 85% 10%, rgba(240,181,144,0.22) 0%, transparent 60%), radial-gradient(45% 50% at 5% 95%, rgba(207,158,144,0.18) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
        <Reveal>
          <ul className="flex flex-wrap gap-2" aria-label="What we serve">
            {["Speciality coffee", "Matcha", "Brunch", "Wine"].map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-cream/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 id="day-heading" className="display-xl mt-12 text-display-xl">
            <span className="sr-only">Your morning, brunch, afternoon and evening, one door.</span>
            <span aria-hidden="true" className="block">
              Your{" "}
              <span className="inline-block h-[0.94em] overflow-hidden align-top">
                <span className="word-roll block">
                  {[...rollingWords, rollingWords[0]].map((word, i) => (
                    <em key={`${word}-${i}`} className="display-italic block text-peach">
                      {word}
                    </em>
                  ))}
                </span>
              </span>
            </span>
            <span aria-hidden="true" className="block">
              one door.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="lede lede-on-dark mt-8 max-w-[46ch]">
            Open from 7am every day, with the kitchen serving until 5pm and the
            bar open late on Fridays and Saturdays.
          </p>
        </Reveal>

        <ol className="mt-20 grid gap-4 md:grid-cols-3 lg:gap-5">
          {dayparts.map((part, i) => (
            <Reveal as="li" key={part.title} delay={0.1 + i * 0.08} className="bezel-dark">
              <article className="bezel-dark-core flex h-full flex-col p-7 lg:p-8">
                <span className="eyebrow eyebrow-on-dark">{part.time}</span>
                <h3 className="display mt-8 text-[2rem] text-cream">{part.title}</h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-cream/70">{part.body}</p>
                <Link
                  href={part.href}
                  className="link-line mt-auto inline-block pt-8 text-sm font-medium text-peach-soft"
                >
                  {part.cta} →
                </Link>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
