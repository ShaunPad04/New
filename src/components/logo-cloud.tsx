import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LogoItem } from "@/lib/content";

/**
 * LOGO CLOUD — continuous strip below the hero.
 *
 * Adapted from an infinite-slider reference rather than copied. The reference
 * runs the loop through Framer Motion: a JS animation driving a motion value
 * every frame, plus `react-use-measure` observing the track. That is real
 * main-thread work, forever, for a decorative strip. This uses the site's
 * existing CSS transform marquee instead — the compositor owns it, no JS runs
 * per frame, and it needs no new dependency.
 *
 * `linear` timing is deliberate and is the one place the house ban on it does
 * not apply: a constant-velocity belt visibly pulses with any easing.
 *
 * The strip pauses on hover and on keyboard focus, and stops entirely under
 * `prefers-reduced-motion` (handled globally in globals.css) — it is
 * decorative, so it is never the only way to reach anything.
 *
 * Items may be an image or a typographic wordmark. That is what lets real
 * client logos drop in later with no code change: give the entry a `src` and
 * it renders as an image instead of type.
 */
export function LogoCloud({
  items,
  label,
  eyebrow,
  heading,
  unverified = false,
  className,
  duration = "42s",
}: {
  items: LogoItem[];
  /** Accessible name for the strip. */
  label: string;
  /** Small caption above it, naming what the row actually is. */
  eyebrow?: string;
  /** Two-line editorial heading: a quiet line then the emphasis. */
  heading?: { quiet: string; loud: string };
  /** Marks the heading as an unsubstantiated claim, on preview builds only. */
  unverified?: boolean;
  className?: string;
  duration?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn("border-y border-ink-300 py-14 lg:py-20", className)}
    >
      {heading ? (
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-xl tracking-tight text-ink-1000 md:text-3xl">
            <span className="text-ink-700">{heading.quiet}</span>
            <br />
            <span className="font-medium">{heading.loud}</span>
          </h2>

          {/* Hairline, fading at both ends so it reads as a rule rather than
              a border. */}
          <div
            aria-hidden="true"
            className="mx-auto my-9 h-px max-w-sm bg-ink-400 [mask-image:linear-gradient(to_right,transparent,black,transparent)]"
          />

          {unverified ? (
            <p
              role="note"
              className="mx-auto mb-9 inline-block border border-dashed border-ink-500 px-4 py-2.5 text-xs tracking-tight text-ink-800"
            >
              Sample content for design review — this claim is not yet
              substantiated and must not be published.
            </p>
          ) : null}
        </div>
      ) : null}

      {eyebrow ? (
        <p className="field-label mb-8 text-center text-ink-600">{eyebrow}</p>
      ) : null}

      {/* The mask fades both ends so items enter and leave rather than being
          chopped off at a hard edge. */}
      <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div
          className="marquee-track flex shrink-0 items-center group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          style={{ ["--marquee-duration" as string]: duration }}
        >
          {/* Rendered twice so the -50% translation loops seamlessly. The
              duplicate is hidden from assistive technology, which would
              otherwise read the whole row through twice. */}
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
            >
              {items.map((item) => (
                <li key={item.name} className="flex shrink-0 items-center">
                  <LogoMark item={item} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoMark({ item }: { item: LogoItem }) {
  if (item.src) {
    return (
      <Image
        src={item.src}
        alt={item.name}
        width={item.width ?? 120}
        height={item.height ?? 24}
        // Decorative-but-named: the alt carries the name, so it is announced
        // once from the visible copy and skipped in the aria-hidden duplicate.
        className="h-5 w-auto select-none opacity-70 transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-100 sm:h-6"
      />
    );
  }

  return (
    <span className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] text-ink-700 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-ink-1000 sm:text-[0.8125rem]">
      {item.name}
    </span>
  );
}
