import Link from "next/link";
import { founders, nav, services, site } from "@/lib/content";
import { SocialLinks } from "@/components/social-links";
import { Wordmark } from "@/components/wordmark";
import { FooterWordmark } from "@/components/footer-wordmark";
import { BackToTop } from "@/components/back-to-top";

/**
 * CURTAIN FOOTER
 *
 * Adapted from a component the client supplied (2026-09-08). Adapted, not
 * pasted — the original could not have run here, and several of its choices
 * are things this project has explicitly ruled out:
 *
 *  - It opened with `@import url(fonts.googleapis.com/...)` for Plus Jakarta
 *    Sans. That single line would have broken a promise the site makes in
 *    writing: fonts here are self-hosted at build by `next/font`, the privacy
 *    policy states that no request reaches Google, and `tests/a11y.spec.ts`
 *    asserts zero third-party requests on the homepage. The footer is set in
 *    the project's own faces.
 *  - Its palette hangs off `--primary`, `--secondary` and `--destructive`,
 *    which do not exist here, and its aurora glow and heartbeat badge are in
 *    colour. This site is monochrome by a locked decision, so the glow is a
 *    white radial at 4% and the heart is white.
 *  - Its links were placeholder `href="#"` and its buttons were App Store
 *    downloads for an app that is not ours. Every link here is real and comes
 *    from `content.ts`.
 *  - It registered its own GSAP ScrollTriggers for the reveals. This page
 *    already drives a pinned frame sequence on scroll and the measurements say
 *    that is where its scroll budget goes, so the entrance is CSS and the
 *    marquee reuses `.marquee-track`, which is already disabled under
 *    `prefers-reduced-motion`.
 *
 * WHAT IS KEPT is the idea, which is a good one: the footer does not scroll up
 * with the page. It is fixed, and the page slides off it like a curtain
 * rising. The mechanism is one line — `clip-path` on the wrapper. A clipped
 * element becomes the containing block for `position: fixed` descendants, so
 * the footer is pinned to the viewport but can never paint outside the
 * wrapper's box. No scroll listener, no z-index war with the page content, and
 * nothing to undo if the reader scrolls back up.
 */
export function Footer() {
  return (
    <div
      // `z-30` is load-bearing. ScrollTrigger gives the pinned hero its own
      // stacking context, and without an explicit layer here the pinned
      // section painted over the footer — the links were visible but every
      // click landed on the hero heading instead. Caught by the privacy-policy
      // link test rather than by eye.
      className="relative z-30 h-[100svh] w-full"
      // The clip is what turns `fixed` into "fixed within this box". Written
      // as a full-box polygon rather than `inset(0)` because Safari treats the
      // two differently for containing-block purposes.
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <footer className="fixed bottom-0 left-0 flex h-[100svh] w-full flex-col justify-between overflow-hidden bg-ink-0">
        {/* Ambient white glow. Monochrome — the reference's aurora was two
            brand hues, and this palette has none. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.05)_0%,transparent_70%)] blur-[70px]"
        />
        {/* Field grid, masked top and bottom so it never meets an edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]"
        />

        {/*
          Disciplines on a rake. The reference's marquee carried slogans; ours
          carries the six things we actually sell, which is the same gesture
          doing a second job. `aria-hidden` — it is a decorative repetition of
          the services section, and a screen reader reading six services twice
          on the way out of every page is noise.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-14 z-10 -rotate-2 scale-110 overflow-hidden border-y border-ink-300 bg-ink-0/60 py-3.5 backdrop-blur-md"
        >
          <div className="marquee-track flex w-max [--marquee-duration:48s]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center gap-10 px-5 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-ink-600 sm:text-xs"
              >
                {services.map((s) => (
                  <span key={s.id} className="flex items-center gap-10">
                    {s.title}
                    <span className="text-ink-500">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Studio signature, sitting behind everything and bled off the
            bottom edge so it reads as a watermark rather than as a line of
            copy the reader is meant to finish. */}
        <FooterWordmark className="pointer-events-none absolute inset-x-0 -bottom-6 z-0 opacity-55" />

        {/* ---- Centre ---- */}
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pt-24">
          <Wordmark variant="stacked" className="mb-8 sm:mb-10" />

          <h2 className="display text-display-md max-w-[18ch] text-center text-ink-1000">
            Ready to begin?
          </h2>
          <p className="mt-5 max-w-[46ch] text-center text-sm leading-relaxed text-ink-700">
            {founders.map((f) => f.name).join(" and ")} answer their own
            enquiries. Tell us what you are building and you will hear back from
            the people who would build it.
          </p>

          {/* Primary actions. Real destinations, from `content.ts`. */}
          <div className="mt-9 flex w-full flex-wrap justify-center gap-3">
            <FooterPill href="/#contact" prominent>
              Book a call
            </FooterPill>
            <FooterPill href={`mailto:${site.email}`}>{site.email}</FooterPill>
            <FooterPill href={site.phoneHref}>{site.phone}</FooterPill>
          </div>

          {/* Secondary: the whole site, and the legal pages that have to be
              reachable from every page. */}
          <nav
            aria-label="Footer"
            className="mt-4 flex w-full flex-wrap justify-center gap-2.5"
          >
            {[
              ...nav,
              { label: "Privacy", href: "/legal/privacy" },
              { label: "Terms", href: "/legal/terms" },
            ].map((item) => (
              <FooterPill key={item.href} href={item.href} small>
                {item.label}
              </FooterPill>
            ))}
          </nav>

          <div className="mt-8">
            <SocialLinks />
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="relative z-20 flex w-full flex-col items-center justify-between gap-5 px-6 pb-7 sm:flex-row sm:px-10 lg:px-14">
          <p className="order-2 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-600 sm:order-1 sm:text-left">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          {/* Wraps centred rather than in two ragged left-aligned lines: at
              390px the names do not fit beside the label, and a flex row
              without `justify-center` left "BY" stranded under the label. */}
          <p className="footer-pill order-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full px-5 py-2.5 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-ink-600 sm:order-2">
            Built in-house by
            <span className="tracking-normal text-ink-1000">
              {founders.map((f) => f.name).join(" & ")}
            </span>
          </p>

          <div className="order-3">
            <BackToTop />
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * One glass pill.
 *
 * The reference built these from `color-mix` against shadcn tokens. Here the
 * treatment lives in `.footer-pill` in `globals.css` so the gradient, the
 * inner highlight and the hairline are declared once rather than repeated as
 * eight arbitrary-value utilities per element.
 */
function FooterPill({
  href,
  children,
  prominent = false,
  small = false,
}: {
  href: string;
  children: React.ReactNode;
  prominent?: boolean;
  small?: boolean;
}) {
  const className = [
    "footer-pill inline-flex items-center justify-center rounded-full",
    "min-h-[2.75rem] transition-colors duration-500",
    small
      ? "px-5 py-2.5 text-[0.8125rem] text-ink-700 hover:text-ink-1000"
      : "px-7 py-3.5 text-sm font-medium text-ink-900 hover:text-ink-1000",
    prominent ? "footer-pill-prominent text-ink-0! hover:text-ink-0!" : "",
  ].join(" ");

  // A route navigates client-side; a mailto or tel must stay a plain anchor.
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
