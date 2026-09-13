import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

/**
 * WHY WORK WITH US
 *
 * The card grid from the client's reference: an icon plate top-left, a
 * corner arrow, a title with an optional chip, a sub-label, a hairline, then
 * the body.
 *
 * The reference colours each icon plate differently — orange, blue, green.
 * The palette here is monochrome by decision, so the plates are separated by
 * elevation and border weight instead of hue, and the double-bezel shell does
 * the work the colour was doing.
 *
 * Every claim below is about how we work, not about results we have got for
 * anyone. Nothing here needs a verification flag because nothing here asserts
 * a measured outcome.
 */

/** 20px stroke icons, drawn inline — six of them is far less weight than any
 *  icon package, and they inherit `currentColor` so the plate controls them. */
const icons = {
  code: (
    <>
      <path d="m8 6-5 5 5 5" />
      <path d="m14 6 5 5-5 5" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="5.5" />
      <path d="m14 14 4 4" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16a7.5 7.5 0 1 1 14 0" />
      <path d="m11 15 3.5-5" />
    </>
  ),
  access: (
    <>
      <circle cx="11" cy="4.5" r="1.8" />
      <path d="M4.5 8.5h13M11 8.5v5m0 0-3 5m3-5 3 5" />
    </>
  ),
  key: (
    <>
      <circle cx="7" cy="12" r="3.5" />
      <path d="M10.5 12H19m-3 0v3" />
    </>
  ),
  shield: (
    <>
      <path d="M11 3.5 4.5 6v5c0 4 2.8 6.6 6.5 7.5 3.7-.9 6.5-3.5 6.5-7.5V6L11 3.5Z" />
    </>
  ),
} satisfies Record<string, ReactNode>;

type Feature = {
  id: string;
  icon: keyof typeof icons;
  title: string;
  chip?: string;
  sub: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    id: "built",
    icon: "code",
    title: "Built, not assembled",
    chip: "Core",
    sub: "Hand-written Next.js",
    body: "No page builder, no rented theme, no plugin stack to break on update. That is why these sites load in under a second and still look like nobody else's.",
  },
  {
    id: "surfaces",
    icon: "search",
    title: "Found on every surface",
    chip: "Core",
    sub: "SEO · AEO · GEO",
    body: "Ranked by Google, quoted in AI Overviews, and named when someone asks ChatGPT for a recommendation. Three surfaces, worked as one job.",
  },
  {
    id: "speed",
    icon: "gauge",
    title: "Fast to a budget",
    sub: "Core Web Vitals",
    body: "Performance is a number agreed before the build starts and measured on every commit, not an optimisation pass bolted on at the end.",
  },
  {
    id: "access",
    icon: "access",
    title: "Accessible by default",
    sub: "WCAG 2.2 AA",
    body: "Keyboard paths, contrast and semantics are tested automatically on every build. It is a legal floor in the UK, and it is also just better work.",
  },
  {
    id: "ownership",
    icon: "key",
    title: "You own all of it",
    sub: "Code, domain, accounts",
    body: "Everything transfers to you on final payment. We do not hold clients on a proprietary platform they cannot leave.",
  },
  {
    id: "care",
    icon: "shield",
    title: "One number to call",
    sub: "Hosting & maintenance",
    body: "We host it, monitor it, patch it and keep the backups tested. When something breaks it is our problem, and you already know who to ring.",
  },
];

export function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <p className="field-label lg:col-span-2 lg:pt-3">(Why us)</p>
          <h2
            id="features-heading"
            className="section-word lg:col-span-6 lg:col-start-4"
          >
            What you
            <br />
            <span className="text-ink-1000">actually get</span>
          </h2>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal as="li" key={feature.id} delay={(i % 3) * 0.06}>
              {/* Double-bezel: outer tray, inner plate, concentric radii. */}
              <div className="bezel h-full">
                <div className="bezel-core group flex h-full flex-col p-7 transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink-200">
                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-ink-1000 shadow-[inset_0_1px_0_rgb(255_255_255/0.1)] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                    >
                      <svg
                        viewBox="0 0 22 22"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {icons[feature.icon]}
                      </svg>
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-ink-600 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-1000"
                    >
                      ↗
                    </span>
                  </div>

                  <h3 className="mt-7 flex flex-wrap items-center gap-2.5 text-base tracking-tight text-ink-1000">
                    {feature.title}
                    {feature.chip ? (
                      <span className="rounded-md border border-white/12 bg-white/[0.06] px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-ink-800">
                        {feature.chip}
                      </span>
                    ) : null}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-600">{feature.sub}</p>

                  <span
                    aria-hidden="true"
                    className="my-6 block h-px w-full bg-white/[0.07]"
                  />

                  <p className="text-sm leading-relaxed text-ink-700">
                    {feature.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
