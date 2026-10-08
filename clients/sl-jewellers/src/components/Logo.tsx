/**
 * The S&L logo, from the artwork S&L supplied on 5 Oct 2026 (assets/source/sl-logo-lockup-2026-10-05.webp),
 * keyed off its black so it sits on any ground. Three cuts of the same file:
 *   "mark"       crown and diamond (public/logo-mark.png): icons, small spots
 *   "horizontal" mark beside the logo's own "S&L jewellers" lettering (public/logo-horizontal.png, served as a
 *                480px WebP, 34 KB)
 *   "full"       the whole stacked lock-up (public/logo-lockup.png): footer and share image
 *   "stacked"    the same lock-up as WebP at 200, 300 and 400px tall (logo-lockup-{200,300,400}.webp,
 *                16, 28 and 43 KB against the PNG's 836 KB): the header, centred, the menu and the
 *                footer; `sizes` is its shown width, so a phone's header takes the 16 KB one
 * Size it with a width class (the global img rule sets height:auto).
 */
const SRC = {
  mark: ["/logo-mark.png", 916, 916],
  horizontal: ["/logo-horizontal-480.webp", 480, 188],
  full: ["/logo-lockup.png", 1097, 1527],
  stacked: ["/logo-lockup-400.webp", 287, 400],
} as const;

const STACKED_SET = "/logo-lockup-200.webp 144w, /logo-lockup-300.webp 216w, /logo-lockup-400.webp 287w";

export default function Logo({ className = "w-9", alt = "", variant = "mark", sizes }: { className?: string; alt?: string; variant?: keyof typeof SRC; sizes?: string }) {
  const [src, w, h] = SRC[variant];
  const set = variant === "stacked" && sizes ? { srcSet: STACKED_SET, sizes } : {};
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} {...set} alt={alt} width={w} height={h} className={className} decoding="async" aria-hidden={alt ? undefined : true} />;
}
