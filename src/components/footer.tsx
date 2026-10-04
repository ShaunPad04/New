import Link from "next/link";
import { BRAND_MARK, founders, nav, site, socials } from "@/lib/content";
import { NewsletterForm } from "@/components/newsletter-form";
import { BackToTop } from "@/components/back-to-top";
import localFont from "next/font/local";
import { GlitchWordmark } from "@/components/glitch-wordmark";

/**
 * FOOTER, Neiden direction (Brad, 2026-10-02: "i dont like my footer"; the
 * Nocta one no longer matched the Neiden hero, header and sections). After
 * neiden.framer.media's foot, studied, nothing taken: the page ENDS the way
 * it starts. The hero's hairline three-column grid, its corner-ticked frame
 * and its lowercase Cal Sans "black line" with a red Mr Dafoe line written
 * across it, so the wordmark is a bookend rather than a new idea.
 *
 * Kept from the old footer, because they work: the newsletter (real, consent
 * required), the socials that have URLs, every route, contact, the legal
 * line and back to top. The footer-reach test reads the two `p`s of the
 * bottom bar and the back-to-top button; keep both.
 */
/* The hero's brush script, for the bookend line. Declared here with
   `preload: false` (the footer is the last thing on every page, so nothing
   should fetch it early); it is the same file as the hero's, so a visit that
   has the hero already has it. Cal Sans comes from the layout's
   `--font-cal-ui`, mapped onto `--font-cal` for the shared `.hero-wm`. */
const script = localFont({
  src: "../app/fonts/MrDafoe-lowercase.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
  preload: false,
});

const LABEL = "text-[0.75rem] font-bold uppercase tracking-[-0.02em]";
const RULE = "border-white/12";
const ROW =
  "inline-flex min-h-10 items-center font-[family-name:var(--font-cal)] lowercase leading-none tracking-[-0.02em] [word-spacing:0.12em] text-ink-1000 transition-colors duration-300 hover:text-accent";

export function Footer() {
  // Every account that has a URL (Brad, 2026-10-04: "social medias are
  // linked"; an allow-list of three had left Facebook off every page).
  const shownSocials = socials.filter((s) => s.href);

  return (
    <footer className={`${script.variable} [--font-cal:var(--font-cal-ui)] relative overflow-hidden border-t ${RULE} bg-ink-0 text-ink-1000`}>
      {/* The hero's grid, carried to the end of the page. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-6 right-6 grid grid-cols-3 border-x sm:left-10 sm:right-10 ${RULE}`}
      >
        <span className={`border-r ${RULE}`} />
        <span className={`border-r ${RULE}`} />
      </div>

      <div className="relative px-6 sm:px-10">
        {/* The one thing this footer asks for. */}
        <div className="grid gap-8 pb-14 pt-16 lg:grid-cols-3 lg:items-end lg:pb-20 lg:pt-24">
          <p className="font-[family-name:var(--font-cal)] text-[clamp(2.5rem,5.6vw,5.5rem)] lowercase leading-[0.95] tracking-[-0.025em] [word-spacing:0.12em] lg:col-span-2">
            got a project?
            <br />
            <span className="text-ink-600">let&rsquo;s talk.</span>
          </p>
          <Link
            href="/#contact"
            className={`group flex h-[60px] items-center justify-between bg-ink-1000 px-5 text-ink-0 transition-colors duration-300 hover:bg-accent hover:text-white lg:ml-3 ${LABEL}`}
          >
            Start a project
            <span aria-hidden="true" className="text-lg transition-transform duration-500 group-hover:rotate-180">
              +
            </span>
          </Link>
        </div>

        <div className={`grid gap-12 border-t py-14 lg:grid-cols-3 lg:gap-0 lg:py-16 ${RULE}`}>
          <div className="lg:pr-10">
            <NewsletterForm />
            {shownSocials.length > 0 ? (
              <ul className={`mt-8 flex gap-6 ${LABEL}`}>
                {shownSocials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.href!}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center gap-1 text-ink-700 transition-colors hover:text-ink-1000"
                    >
                      {s.name}
                      <span aria-hidden="true">↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <nav aria-label="Footer" className="lg:pl-3 lg:pr-10">
            <p className={`${LABEL} text-ink-600`}>[ Pages ]</p>
            <ul className="mt-5 grid gap-1">
              {nav.map((n, i) => (
                <li key={n.href}>
                  <Link href={n.href} className={`${ROW} gap-3 text-[1.625rem]`}>
                    <span className="font-sans text-[0.75rem] font-bold tracking-normal text-ink-600">
                      /{String(i + 1).padStart(2, "0")}
                    </span>
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/web-design-grimsby" className={`${ROW} gap-3 text-[1.625rem]`}>
                  <span className="font-sans text-[0.75rem] font-bold tracking-normal text-ink-600">
                    /{String(nav.length + 1).padStart(2, "0")}
                  </span>
                  web design in grimsby
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:pl-3">
            <p className={`${LABEL} text-ink-600`}>[ Contact ]</p>
            <ul className="mt-5 grid gap-1">
              <li>
                <a href={`mailto:${site.email}`} className={`${ROW} text-[clamp(1.125rem,5.4vw,1.625rem)] [overflow-wrap:anywhere]`}>
                  {site.email.toLowerCase()}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className={`${ROW} text-[1.625rem]`}>
                  {site.phone}
                </a>
              </li>
            </ul>
            <p className="mt-6 max-w-[30ch] text-[0.9375rem] leading-[1.45] tracking-[-0.02em] text-ink-700">
              Humberston, Grimsby. Every enquiry is answered within one working day.
            </p>
          </div>
        </div>

        {/* The bookend: the hero's frame, name and script. Ornament, so
            aria-hidden; the name is real text in the copyright line. */}
        <div className="pt-4">
          <p className={`flex justify-end gap-6 pb-3 text-ink-600 ${LABEL}`} aria-hidden="true">
            <span>
              Founder-led
            </span>
            <span>
              © <span className="text-ink-1000">{new Date().getFullYear()}</span>
            </span>
          </p>
          <div aria-hidden="true" className={`relative select-none border-y py-5 lg:py-6 ${RULE}`}>
            {["-left-[3px] -top-[3px]", "-right-[3px] -top-[3px]", "-bottom-[3px] -left-[3px]", "-bottom-[3px] -right-[3px]"].map((p) => (
              <span key={p} className={`absolute size-1.5 bg-ink-1000 ${p}`} />
            ))}
            <GlitchWordmark />
            <p className="absolute bottom-[8%] left-[4%] whitespace-nowrap font-[family-name:var(--font-script)] text-[7.3vw] leading-none text-accent sm:bottom-[6%] sm:left-[38%] sm:text-[clamp(2.5rem,6.1vw,6.875rem)]">
              see you soon.
            </p>
          </div>
        </div>

        <div className={`flex flex-col items-center gap-3 py-5 text-center text-ink-600 sm:flex-row sm:justify-between sm:text-left ${LABEL}`}>
          <p>
            &copy; {new Date().getFullYear()} {site.name}{BRAND_MARK}. Humberston, Grimsby, Lincolnshire. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li><Link href="/legal/privacy" className="inline-flex min-h-11 items-center hover:text-ink-1000">Privacy policy</Link></li>
            <li><Link href="/legal/terms" className="inline-flex min-h-11 items-center hover:text-ink-1000">Terms</Link></li>
          </ul>
          <p>Built in-house by {founders.map((f) => f.name).join(" & ")}</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
