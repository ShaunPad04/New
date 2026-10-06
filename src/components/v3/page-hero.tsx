import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { BarLabel, Grid, LABEL } from "./page-grid";
import { HeroCta } from "./hero-cta";

/** The frame's four corner ticks (also on the AI page's demo frames). */
export const CORNERS = ["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-bottom-[3px] -left-[3px]", "-bottom-[3px] -right-[3px]"];

/* Cal Sans advance widths, in em at the name's -0.05em tracking (measured
   2026-10-05; the sum runs 0-2% wider than the set word, never narrower).
   The name is sized from its real width: a letter count put "seo & geo" and
   "web design" past the frame. Anything not listed counts as wide. */
const ADVANCE: Record<string, number> = {
  a: 0.566, b: 0.566, c: 0.474, d: 0.566, e: 0.522, f: 0.274, g: 0.554, h: 0.515, i: 0.165,
  j: 0.165, k: 0.508, l: 0.165, m: 0.86, n: 0.515, o: 0.544, p: 0.566, q: 0.566, r: 0.287,
  s: 0.383, t: 0.278, u: 0.507, v: 0.489, w: 0.746, x: 0.485, y: 0.489, z: 0.441, " ": 0.114, "&": 0.58,
};

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
  cta = true,
  ctaLabel,
  ctaHref,
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
  /** The "Start a project" bar under the lede (off on the legal pages). */
  cta?: boolean;
  /** The bar's label and target, when a page books something else (the /ai audit). */
  ctaLabel?: string;
  ctaHref?: string;
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
          <p aria-hidden="true" className="page-wm" style={{ "--em": [...big].reduce((w, c) => w + (ADVANCE[c] ?? 0.6), 0).toFixed(3) } as CSSProperties}>
            <span className="hero-wm-base">{big}</span>
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-3 lg:gap-0">
          <div className="lg:col-start-2">
            <p className="max-w-[40ch] text-[1.0625rem] font-medium leading-[1.4] tracking-[-0.03em] text-ink-1000 lg:pr-6">{lede}</p>
            {cta ? <HeroCta light label={ctaLabel} href={ctaHref} className="mt-6" /> : null}
          </div>
          {aside ? <div className={`${asidePhone ? "mt-4" : "hidden"} lg:col-start-3 lg:mt-0 lg:block lg:pl-10`}>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
