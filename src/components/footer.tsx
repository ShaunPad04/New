import Link from "next/link";
import { founders, nav, site, socials } from "@/lib/content";
import { VelocityMarquee } from "@/components/kit/velocity-marquee";
import { NewsletterForm } from "@/components/newsletter-form";
import { BackToTop } from "@/components/back-to-top";

/**
 * FOOTER — the Nocta layout (Brad chose footer D, 2026-09-26: "I really
 * like this website's footer", nocta.framer.website; studied, not copied).
 *
 *  1. START A PROJECT ↗ — a scroll-velocity marquee that is ONE link to the
 *     enquiry form; the ribbon is aria-hidden, the link carries the name.
 *     It replaces the homepage's separate start band.
 *  2. Newsletter (real — /api/newsletter, consent required) and /Socials/.
 *  3. /Navigation/, /Resources/, /Contact/.
 *  4. BLACK LINE AGENCY on ONE line (Brad: two lines "looks cheap"),
 *     sized in container units so it spans the footer and never wraps.
 *  5. Bottom bar: copyright with the town, the in-house credit, back to top.
 *
 * In normal flow now. The old curtain (fixed footer under a clip-path
 * shell) is gone, and with it the short-viewport workaround it needed —
 * the footer-reach tests hold trivially for an in-flow footer.
 */

/* Instagram, TikTok, LinkedIn only (Brad). An account appears only when its
   URL is in `socials` — a dead icon would read as a broken site. LinkedIn
   has no entry yet: add { name: "LinkedIn", mark: "linkedin", href } there
   and it shows up with no change here. */
const SHOWN = ["Instagram", "TikTok", "LinkedIn"] as const;

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <rect x="3" y="9" width="3.6" height="12" />
      <circle cx="4.8" cy="4.8" r="2.1" />
      <path d="M9.5 9h3.4v1.7c.6-1.1 2-2 3.8-2 3.6 0 4.3 2.3 4.3 5.4V21h-3.6v-6.2c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9.5z" />
    </svg>
  );
}

function Glyph({ mark }: { mark: string }) {
  if (mark === "linkedin") return <LinkedInGlyph />;
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <use href={`/logo-marks.svg#logo-mark-${mark}`} />
    </svg>
  );
}

/**
 * Nocta's social tile: on hover a solid fill rises from the bottom while
 * the icon rolls up and out and a copy rolls in from below. Silver-white
 * fill, icon to black. Transform-only, so it runs on the compositor;
 * reduced motion keeps the colour change without the travel.
 */
function SocialTile({ name, href, mark }: { name: string; href: string; mark: string }) {
  const ease = "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${name} (opens in a new tab)`}
      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden border border-ink-300 text-ink-1000"
    >
      <span aria-hidden="true" className={`absolute inset-0 translate-y-full bg-ink-1000 group-hover:translate-y-0 group-focus-visible:translate-y-0 ${ease}`} />
      <span aria-hidden="true" className="relative h-4 w-4 overflow-hidden">
        <span className={`absolute inset-0 group-hover:-translate-y-full group-focus-visible:-translate-y-full ${ease}`}>
          <Glyph mark={mark} />
        </span>
        <span className={`absolute inset-0 translate-y-full text-ink-0 group-hover:translate-y-0 group-focus-visible:translate-y-0 ${ease}`}>
          <Glyph mark={mark} />
        </span>
      </span>
    </a>
  );
}

const col = "text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600";
const link =
  "inline-flex min-h-8 items-center text-[0.9375rem] font-medium uppercase tracking-[-0.01em] text-ink-1000 underline-offset-4 hover:underline";

export function Footer() {
  const shownSocials = SHOWN.map((n) => socials.find((s) => s.name === n)).filter(
    (s): s is (typeof socials)[number] => Boolean(s?.href),
  );

  return (
    <footer className="@container relative border-t border-ink-300 bg-ink-0">
      {/* One link to the enquiry form ("Get in touch"). No hover invert —
          Brad tried the white fill with outlined type and asked for it to
          go (2026-09-26); only the arrow turns. */}
      <Link
        href="/#contact"
        aria-label="Start a project — get in touch"
        className="group block border-b border-ink-300 py-6 outline-offset-[-6px]"
      >
        <div aria-hidden="true">
          <VelocityMarquee speed={0.9}>
            <span className="inline-flex items-center gap-10 px-10 text-[clamp(3rem,6.5vw,6.5rem)] font-medium uppercase leading-none tracking-[-0.05em] text-ink-1000">
              Start a project
              <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
            </span>
          </VelocityMarquee>
        </div>
      </Link>

      <div className="mx-auto grid w-full max-w-[1600px] gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <NewsletterForm />
          {shownSocials.length > 0 ? (
            <div className="mt-10">
              <p className={col}>/Socials/</p>
              <ul className="mt-4 flex gap-2.5">
                {shownSocials.map((s) => (
                  <li key={s.name}>
                    <SocialTile name={s.name} href={s.href!} mark={s.mark} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <nav aria-label="Footer">
          <p className={col}>/Navigation/</p>
          <ul className="mt-4 grid gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={link}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className={col}>/Resources/</p>
          <ul className="mt-4 grid gap-1">
            <li><Link href="/web-design-grimsby" className={link}>Web design in Grimsby</Link></li>
            <li><Link href="/legal/privacy" className={link}>Privacy policy</Link></li>
            <li><Link href="/legal/terms" className={link}>Terms</Link></li>
          </ul>
        </div>
        <div>
          <p className={col}>/Contact/</p>
          <ul className="mt-4 grid gap-1">
            <li>
              <a href={`mailto:${site.email}`} className={`${link} [overflow-wrap:anywhere]`}>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className={link}>
                {site.phone}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* One line, always: container units fit it to the footer's width.
          White OUTLINE only, no fill (Brad, 2026-09-26). Drawn by CSS
          `content` rather than as a text node: it is ornament, and the
          name is in the copyright line as real text. */}
      <p
        aria-hidden="true"
        data-word="Black Line Agency"
        className="select-none whitespace-nowrap border-t border-ink-300 px-4 pt-6 text-center text-[10.4cqw] font-medium uppercase leading-[0.9] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_var(--color-ink-1000)] before:content-[attr(data-word)]"
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-3 border-t border-ink-300 px-6 py-5 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-ink-600 sm:flex-row sm:justify-between sm:px-8 sm:text-left">
        <p>
          &copy; {new Date().getFullYear()} {site.name}. Humberston, Grimsby, Lincolnshire. All rights reserved.
        </p>
        <p>Built in-house by {founders.map((f) => f.name).join(" & ")}</p>
        <BackToTop />
      </div>
    </footer>
  );
}
