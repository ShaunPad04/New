import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LogoItem } from "@/lib/content";
import { LOGO_MARKS } from "@/lib/logo-marks";

/**
 * LOGO CLOUD — continuous strip below the hero.
 *
 * Adapted from an infinite-slider reference rather than copied. The reference
 * runs the loop through Framer Motion: a JS animation driving a motion value
 * every frame, plus `react-use-measure` observing the track. That is permanent
 * main-thread work for a decorative strip. This uses the site's existing CSS
 * transform marquee — the compositor owns it, nothing runs per frame, and it
 * needs no new dependency.
 *
 * `linear` timing is deliberate and is the one place the house ban on it does
 * not apply: a constant-velocity belt visibly pulses with any easing.
 *
 * The strip pauses on hover and on keyboard focus, and stops entirely under
 * `prefers-reduced-motion` (handled globally in globals.css).
 */

/**
 * How many times the set repeats inside each half of the track.
 *
 * The track translates exactly -50%, so a seamless loop needs each half to be
 * at least as wide as the viewport — otherwise empty space walks across the
 * screen before the loop lands. One pass of fourteen marks measured 1288px,
 * which left a 152px gap at 1440 and a 1272px gap at 2560. Two passes clear
 * any display this site will realistically meet.
 *
 * The marks are an SVG sprite, so repeating them costs a `<use>` reference
 * each rather than a second copy of the path data.
 */
const REPEATS_PER_HALF = 2;

const markId = (key: string) => `logo-mark-${key}`;

export function LogoCloud({
  items,
  label,
  heading,
  className,
  duration = "56s",
}: {
  items: LogoItem[];
  /** Accessible name for the strip. */
  label: string;
  /** Two-line editorial heading: a quiet line then the emphasis. */
  heading?: { quiet: string; loud: string };
  className?: string;
  duration?: string;
}) {
  const marks = Array.from(
    new Set(items.map((i) => i.mark).filter(Boolean) as string[]),
  );

  return (
    <section
      aria-label={label}
      className={cn("border-y border-ink-300 py-16 lg:py-24", className)}
    >
      {/* Sprite. Each glyph's path data appears exactly once no matter how many
          times the set repeats across the track. */}
      <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <defs>
          {marks.map((key) =>
            LOGO_MARKS[key] ? (
              <symbol key={key} id={markId(key)} viewBox="0 0 24 24">
                <path d={LOGO_MARKS[key].path} />
              </symbol>
            ) : null,
          )}
        </defs>
      </svg>

      {heading ? (
        <div className="mx-auto max-w-4xl px-6 text-center">
          {/*
            Set in the display face, uppercase, tight — the reference the
            client supplied is heavy uppercase with negative tracking and
            near-solid leading, which is the register the rest of this site
            already uses. The two-tone is the other half of that reference:
            one line recedes so the other lands.
          */}
          <h2 className="display text-balance text-[clamp(1.75rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.03em]">
            <span className="text-ink-600">{heading.quiet}</span>{" "}
            <span className="text-ink-1000">{heading.loud}</span>
          </h2>

          {/* Hairline, fading at both ends so it reads as a rule, not a border. */}
          <div
            aria-hidden="true"
            className="mx-auto mt-10 h-px max-w-sm bg-ink-400 [mask-image:linear-gradient(to_right,transparent,black,transparent)] lg:mt-14"
          />
        </div>
      ) : null}

      <div className="group relative mt-12 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:mt-16">
        <div
          className="marquee-track flex shrink-0 items-start group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
          style={{ ["--marquee-duration" as string]: duration }}
        >
          {/* Two halves so the -50% translation loops seamlessly. The second is
              hidden from assistive technology, which would otherwise read the
              whole row through twice. */}
          {[0, 1].map((half) => (
            <ul
              key={half}
              aria-hidden={half === 1 ? "true" : undefined}
              className="flex shrink-0 items-start gap-10 pr-10 sm:gap-14 sm:pr-14"
            >
              {Array.from({ length: REPEATS_PER_HALF }).flatMap((_, pass) =>
                items.map((item) => (
                  <li key={`${pass}-${item.name}`} className="shrink-0">
                    <LogoMark item={item} />
                  </li>
                )),
              )}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoMark({ item }: { item: LogoItem }) {
  // A real client logo, once one exists — a supplied image rather than a glyph.
  if (item.src) {
    return (
      <span className="flex w-[7.5rem] flex-col items-center gap-3">
        <Image
          src={item.src}
          alt=""
          width={item.width ?? 120}
          height={item.height ?? 28}
          className="h-7 w-auto select-none opacity-70"
        />
        <LogoName>{item.name}</LogoName>
      </span>
    );
  }

  const mark = item.mark ? LOGO_MARKS[item.mark] : undefined;

  if (mark) {
    return (
      // A fixed-width column so the names sit on a common baseline and the
      // glyphs stay optically centred above them, whatever the name's length.
      <span className="group/mark flex w-[7.5rem] flex-col items-center gap-3.5">
        <svg
          viewBox="0 0 24 24"
          role="img"
          aria-label={item.name}
          // `fill="currentColor"` is what makes the row read as one set rather
          // than a pile of borrowed brand colours: every mark takes its colour
          // from here, so they are identical and sit inside the palette.
          className="h-7 w-7 shrink-0 select-none fill-current text-ink-600 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/mark:text-ink-1000 sm:h-8 sm:w-8"
        >
          <use href={`#${markId(item.mark!)}`} />
        </svg>
        <LogoName>{item.name}</LogoName>
      </span>
    );
  }

  return (
    <span className="flex w-[7.5rem] flex-col items-center gap-3.5">
      <LogoName>{item.name}</LogoName>
    </span>
  );
}

/**
 * The name is decorative duplication for a screen reader — the glyph above it
 * already carries an accessible label — so it is hidden from the tree to stop
 * every entry being announced twice.
 */
function LogoName({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="text-center font-mono text-[0.625rem] uppercase leading-tight tracking-[0.16em] text-ink-600 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/mark:text-ink-800"
    >
      {children}
    </span>
  );
}
