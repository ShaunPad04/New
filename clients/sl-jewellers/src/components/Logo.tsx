/**
 * The S&L logo, from the artwork S&L supplied on 5 Oct 2026 (assets/source/sl-logo-lockup-2026-10-05.webp),
 * keyed off its black so it sits on any ground. Three cuts of the same file:
 *   "horizontal" mark beside the logo's own "S&L jewellers" lettering (public/logo-horizontal.png, served as a
 *                480px WebP, 34 KB)
 *   "stacked"    the lock-up as WebP at 120, 200, 300 and 400px tall (logo-lockup-{120,200,300,400}.webp,
 *                8, 16, 28 and 43 KB against the PNG's 836 KB): the header, centred, the menu and the
 *                footer; `sizes` is its shown width, so a header on a 1x or 2x screen takes the 8 KB
 *                one (120: near-lossless WebP, 52 dB against the PNG, 9 Oct 2026)
 * Size it with a width class (the global img rule sets height:auto).
 * The 836 KB PNG master of the lock-up and the 443 KB PNG of the mark alone went on 13 Oct 2026
 * (nothing on the site showed them); the structured data's logo is logo-lockup-600.png, a 600px
 * palette PNG cut from the master, which stays in assets/source.
 */
const SRC = {
  horizontal: ["/logo-horizontal-480.webp", 480, 188],
  stacked: ["/logo-lockup-400.webp", 287, 400],
} as const;

const STACKED_SET = "/logo-lockup-120.webp 86w, /logo-lockup-200.webp 144w, /logo-lockup-300.webp 216w, /logo-lockup-400.webp 287w";

/** `load`: "lazy" for a copy below the fold (the footer's), "low" for one that must be ready but is
 *  not on the first screen (the menu's). Either keeps React from preloading it beside the page's
 *  largest picture, which it does for every image in the first HTML otherwise. */
export default function Logo({ className = "w-9", alt = "", variant = "stacked", sizes, load }: { className?: string; alt?: string; variant?: keyof typeof SRC; sizes?: string; load?: "lazy" | "low" }) {
  const [src, w, h] = SRC[variant];
  const set = variant === "stacked" && sizes ? { srcSet: STACKED_SET, sizes } : {};
  const how = load === "lazy" ? { loading: "lazy" as const } : load === "low" ? { fetchPriority: "low" as const } : {};
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} {...set} {...how} alt={alt} width={w} height={h} className={className} decoding="async" aria-hidden={alt ? undefined : true} />;
}
