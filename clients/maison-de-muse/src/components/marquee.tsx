import { ticker } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Continuous ticker — the template's "Brew Bold · Chill Smooth" strip.
 *
 * Pure CSS transform animation on a duplicated track: no JS, no layout
 * thrash, and it stops entirely under `prefers-reduced-motion` (handled in
 * globals.css). The duplicate is `aria-hidden` so the list is announced
 * once.
 */
export function Marquee({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <section
      aria-label="What we serve"
      className={cn(
        "relative flex overflow-hidden border-y py-5",
        dark ? "border-cream/10 bg-plum-deep text-cream" : "border-sand bg-plaster text-espresso"
      )}
    >
      <div className="marquee-track flex shrink-0 items-center gap-10 pr-10 [--marquee-duration:52s]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 items-center gap-10"
          >
            {ticker.map((item) => (
              <li key={item} className="flex shrink-0 items-center gap-10">
                <span className="display whitespace-nowrap text-2xl sm:text-3xl">{item}</span>
                <span
                  aria-hidden="true"
                  className={cn("block h-1.5 w-1.5 rounded-full", dark ? "bg-peach" : "bg-blush-deep")}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
