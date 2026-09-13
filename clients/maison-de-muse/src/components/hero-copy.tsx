import type { CSSProperties } from "react";
import { hero } from "@/lib/content";
import { Cta } from "@/components/cta";

/**
 * Hero copy — a masked, staggered entrance in pure CSS.
 *
 * This is above the fold and is the LCP element, so it does not wait for
 * JavaScript of any kind: the animation is a keyframe with
 * `animation-fill-mode: both`, which means the headline always ends
 * visible whether or not a script ever runs. Under
 * `prefers-reduced-motion` the global rule in globals.css collapses the
 * duration and it is simply there.
 */
const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export function HeroCopy() {
  return (
    <div className="relative z-10 flex max-w-[56rem] flex-col items-center text-center">
      <p className="eyebrow hero-fade mb-8" style={d(0.05)}>
        {hero.eyebrow}
      </p>

      <h1 id="hero-heading" className="display-xl text-display-xl text-espresso">
        {hero.headline.map((text, i) => (
          <span key={text} className="block overflow-hidden pb-[0.08em]">
            <span className="hero-line" style={d(0.1 + i * 0.12)}>
              {i === 1 ? <em className="display-italic text-plum">{text}</em> : text}
            </span>
          </span>
        ))}
      </h1>

      <p className="lede hero-fade mt-7 max-w-[46ch]" style={d(0.45)}>
        {hero.supporting}
      </p>

      <div
        className="hero-fade mt-9 flex flex-wrap items-center justify-center gap-4"
        style={d(0.6)}
      >
        <Cta href={hero.primary.href}>{hero.primary.label}</Cta>
        <Cta href={hero.secondary.href} variant="ghost">
          {hero.secondary.label}
        </Cta>
      </div>
    </div>
  );
}
