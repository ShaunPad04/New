import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { BarLabel, Grid, LABEL } from "./page-grid";
import { HeroCta } from "./hero-cta";

/** The frame's four corner ticks (also on the AI page's demo frames). */
export const CORNERS = ["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-bottom-[3px] -left-[3px]", "-bottom-[3px] -right-[3px]"];

/**
 * THE TOP OF EVERY INNER PAGE (2026-10-02, Brad: the other pages cannot have
 * "a whole different design/font system" from the homepage). The homepage
 * hero's system without its signature: the hairline three-column grid, the
 * bilingual bar label and a count, the page's name enormous in Cal Sans
 * lowercase inside the corner-ticked frame (the wordmark's face, grain fill
 * and tracking), then the lede and the black "Start a project +" bar from
 * the middle column. The page's own monochrome still sits behind and the
 * name is set in `difference` over it, so the picture's light cuts through
 * the letters as the film's rings do on the homepage. No film, script or
 * glitch: those stay the homepage's one signature moment.
 *
 * The giant name is decoration (aria-hidden, as the homepage wordmark is);
 * the h1 carries the same word for readers and search.
 */
export function PageHero({
  id,
  title,
  word,
  label,
  ja,
  count,
  lede,
  image,
  aside,
  asidePhone = false,
}: {
  id: string;
  /** The page's name: the h1, and lowercased, the giant word. */
  title: string;
  /** The giant word, when the h1 is a sentence (the service pages). */
  word?: string;
  label: string;
  ja: string;
  count?: { value: string; label: string };
  lede: string;
  image?: string;
  /** The third column beside the lede (an index, a fact). Desktop only,
      unless `asidePhone`, when phones get it under the button. */
  aside?: ReactNode;
  asidePhone?: boolean;
}) {
  const big = (word ?? title).toLowerCase();
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-ink-0 text-ink-1000">
      {/* The still covers the top of the section only and fades out above
          the lede, so its light falls behind the name, never the sentence. */}
      {image ? (
        // Phones: a fixed height ending just under the frame, since an aside
        // can make the section much taller there. Desktop: the top 72%.
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[22rem] lg:h-[72%]">
          <Image src={image} alt="" fill preload sizes="100vw" className="object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-45% to-black" />
        </div>
      ) : null}
      {/* Unstacked, so the name's blend sees the picture through it. */}
      <Grid rule="border-white/12" z="" />

      <div className="relative px-6 pb-14 pt-20 sm:px-10 lg:pb-20 lg:pt-24">
        <h1 id={id} className="sr-only">
          {title}
        </h1>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <BarLabel label={label} ja={ja} />
          {count ? (
            <p className={LABEL}>
              /<span className="text-accent">{count.value}</span> {count.label}
            </p>
          ) : null}
        </div>

        <div className="relative mt-10 border-y border-white/12 py-4 lg:mt-16 lg:py-6">
          {CORNERS.map((p) => (
            <span key={p} aria-hidden="true" className={`absolute size-1.5 bg-ink-1000 ${p}`} />
          ))}
          {/* An "m" or "w" is about one and a half letters wide: counted as
              one, "ai systems" ran 6px past the frame (measured, 1440). */}
          <p aria-hidden="true" className="page-wm" style={{ "--chars": big.length + (big.match(/[mw]/g)?.length ?? 0) * 0.5 } as CSSProperties}>
            <span className="hero-wm-base">{big}</span>
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-3 lg:gap-0">
          <div className="lg:col-start-2">
            <p className="max-w-[40ch] text-[1.0625rem] font-medium leading-[1.4] tracking-[-0.03em] text-ink-1000 lg:pr-6">{lede}</p>
            <HeroCta light className="mt-6" />
          </div>
          {aside ? <div className={`${asidePhone ? "mt-4" : "hidden"} lg:col-start-3 lg:mt-0 lg:block lg:pl-10`}>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
