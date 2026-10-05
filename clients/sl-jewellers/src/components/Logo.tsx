/**
 * The S&L logo, from the artwork S&L supplied on 5 Oct 2026 (assets/source/sl-logo-lockup-2026-10-05.webp),
 * keyed off its black so it sits on any ground. Three cuts of the same file:
 *   "mark"       crown and diamond (public/logo-mark.png): icons, small spots
 *   "horizontal" mark beside the logo's own "S&L jewellers" lettering (public/logo-horizontal.png): the header
 *   "full"       the whole stacked lock-up (public/logo-lockup.png): footer and share image
 * Size it with a width class (the global img rule sets height:auto).
 */
const SRC = {
  mark: ["/logo-mark.png", 916, 916],
  horizontal: ["/logo-horizontal.png", 1073, 420],
  full: ["/logo-lockup.png", 1097, 1527],
} as const;

export default function Logo({ className = "w-9", alt = "", variant = "mark" }: { className?: string; alt?: string; variant?: keyof typeof SRC }) {
  const [src, w, h] = SRC[variant];
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} width={w} height={h} className={className} decoding="async" aria-hidden={alt ? undefined : true} />;
}
