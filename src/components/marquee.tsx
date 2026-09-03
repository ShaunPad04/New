const CAPABILITIES = [
  "Web Design",
  "Next.js Development",
  "Google SEO",
  "Email Marketing",
  "SMS Marketing",
  "Conversion Optimisation",
  "Motion Design",
  "Managed Hosting",
  "Maintenance & Care",
  "Core Web Vitals",
];

/**
 * Continuous capability marquee.
 *
 * Pure CSS transform animation on a duplicated track — no JS, no layout
 * thrash, and it stops entirely under `prefers-reduced-motion` (handled in
 * globals.css). The duplicate is `aria-hidden` so the list is announced once.
 */
export function Marquee() {
  return (
    <section
      aria-label="What we do"
      className="relative flex overflow-hidden border-y border-ink-300 py-6"
    >
      <div className="marquee-track flex shrink-0 items-center gap-10 pr-10 [--marquee-duration:48s]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center gap-10"
          >
            {CAPABILITIES.map((item) => (
              <li key={item} className="flex shrink-0 items-center gap-10">
                <span className="whitespace-nowrap text-sm tracking-tight text-ink-700">
                  {item}
                </span>
                <span aria-hidden="true" className="text-ink-500">
                  /
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
