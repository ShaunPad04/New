import { buildStandardsBand, founders } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { H2 } from "@/components/v3/page-grid";

/**
 * WHY CHOOSE US, as four facts (Brad, 2026-10-04: "do the why us"; the
 * 2026-09-26 bento was the most generic thing left on the page: a striped
 * label, stock-style portraits, and four boxes repeating the price list
 * right after it, the fixed price and the five-day window). Heading left and
 * line right as the services and the price list set them, then one ruled row
 * of four, set large: the 90+ guarantee, the two founders, the one-day
 * reply, and ownership. Every line is a claim the site already makes, read
 * from the same data where there is data: the scores band, `founders`. No
 * rating, no client count, nothing that is not true today.
 */
export function WhyUs() {
  const [measured] = buildStandardsBand.blocks;
  const names = founders.map((f) => f.name.split(" ")[0]).join(" and ");
  const facts = [
    { figure: measured.heading.split(" / ")[0], label: "Lighthouse, every build", line: "Mobile and desktop. Every build ships above it, or we keep working at no extra cost." },
    { figure: String(founders.length), label: "Founders, no account layer", line: `You work directly with ${names}. Nobody hands you to a junior.` },
    { figure: "1", label: "Working day to reply", line: "Every enquiry gets an answer within one working day." },
    { figure: "Yours", label: "Outright", line: "The code, the domain and every account are yours." },
  ];

  return (
    <section aria-labelledby="why-heading" className="bg-ink-0">
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 pt-16 sm:px-8 lg:pb-32 lg:pt-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <h2 id="why-heading" className={H2}>
            Founder-led, start to finish.
          </h2>
          <p className="max-w-[44ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">
            Fixed prices agreed in writing, scores measured rather than promised, and a site that is yours.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 border-t border-ink-300 lg:mt-20 lg:grid-cols-4">
          {facts.map((f, i) => (
            <li
              key={f.label}
              className={`border-b border-ink-300 py-8 lg:border-b-0 lg:py-10 ${i % 2 ? "border-l pl-5 sm:pl-6" : "pr-5 sm:pr-6"} ${i ? "lg:border-l lg:pl-8" : "lg:pl-0"} lg:pr-8`}
            >
              <Reveal variant="settle" delay={i * 0.07}>
                <p className="display text-[clamp(3rem,6vw,6rem)] leading-[0.85] text-ink-1000">{f.figure}</p>
                <p className="mt-5 text-[0.75rem] font-bold uppercase tracking-[-0.02em] text-ink-1000">{f.label}</p>
                <p className="mt-2 max-w-[32ch] text-[0.9375rem] leading-relaxed text-ink-700">{f.line}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
