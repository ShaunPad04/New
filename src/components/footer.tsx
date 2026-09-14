import Link from "next/link";
import { founders, nav, services, site } from "@/lib/content";
import { SocialLinks } from "@/components/social-links";
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
      data-footer-shell=""
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
        {/* The 60px field grid that used to sit here was removed at the
            client's request (2026-09-11). It was a pair of 1px white
            gradients at 3% opacity, masked top and bottom; the intent was to
            give the closing band some construction-drawing texture behind the
            wordmark. On a pure-black ground it read as crosshatch rather than
            as structure, and it was competing with two things that do the job
            better — the radial lift above and the outlined BlackLineAgency
            wordmark below. The grain layer still keeps the black from going
            flat, so nothing was lost by taking it out. */}

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
        {/*
          THE ADDRESS IS THE FOOTER (client, 2026-09-15, from a reference he
          sent). Previously this column ran: stacked wordmark, display
          heading, paragraph, three glass pills, seven more glass pills, then
          socials — ten pills and two wordmarks competing for one focal point,
          which is the "generic" note from the mobile audit in its purest
          form. An agency footer has exactly one job and it is the address.

          So the email is set in the display face at the scale the heading
          used to occupy, and everything else is demoted to plain editorial
          columns. The `<h2>` stays a real heading for structure and for
          screen readers; it just no longer outranks the thing it introduces.

          The wordmark that opened this column is GONE, not moved: the header
          carries it, and `FooterWordmark` is already bled across the bottom
          edge behind this. Three in one viewport was the redundancy.

          `.display` uppercases, which is why the address reads
          CONTACT@BLACKLINEAGENCY.CO.UK on screen while the `mailto:` keeps
          `site.email` exactly as written. Do NOT "fix" that with
          `normal-case!` — the domain part of an address is case-insensitive
          by RFC 1035, the href is untouched, and the caps are the point.

          HEIGHT BUDGET: this column is shorter than what it replaced (two
          pill rows and a wordmark out, one address and a three-column grid
          in), which is deliberate — see the bottom-bar note below. Measure
          the back-to-top button against the footer's bottom edge after ANY
          change in here, on a 375px viewport, not just by eye.
        */}
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pt-16 sm:pt-24">
          <h2 className="field-label text-ink-600">Ready to begin?</h2>

          <a
            href={`mailto:${site.email}`}
            className="display mt-4 block text-[clamp(1.25rem,5.2vw,3.25rem)] leading-[1.05] tracking-[-0.02em] break-words [overflow-wrap:anywhere] text-ink-1000 transition-opacity duration-500 hover:opacity-60"
          >
            {site.email}
          </a>

          <p className="mt-5 max-w-[52ch] text-sm leading-relaxed text-ink-700">
            {founders.map((f) => f.name).join(" and ")} answer their own
            enquiries. Tell us what you are building and you will hear back
            from the people who would build it.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            <FooterLink href={site.phoneHref}>{site.phone}</FooterLink>
            <FooterLink href="/#contact">Book a call</FooterLink>
          </div>

          {/* Three plain columns, no enclosures. The reference's own footer
              does the same thing, and it is what the house rule asks for:
              a pill is for a control or a status, not for a link to About. */}
          <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-ink-300/60 pt-7 sm:mt-12 sm:gap-y-9 sm:pt-9 sm:grid-cols-3">
            <FooterColumn label="Explore" items={nav} />
            <FooterColumn
              label="Legal"
              items={[
                { label: "Privacy", href: "/legal/privacy" },
                { label: "Terms", href: "/legal/terms" },
              ]}
            />
            <div className="col-span-2 sm:col-span-1">
              <p className="field-label text-ink-600">Connect</p>
              <div className="mt-4 sm:mt-5">
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>

        {/* ---- Bottom bar ---- */}
        {/*
          THE BOTTOM BAR, rebuilt for a phone (client, 2026-09-14: "extremely
          compact and crammed together").

          Three things were wrong and all three are spacing, not structure.

          The two mono lines are 10px at 0.2em tracking, which is right on a
          desktop bar and cannot hold a 45-character string in a 316px column
          — both lines broke leaving a single orphaned word ("PADLEY",
          "RESERVED."), which is what reads as crammed. Below `sm` the
          tracking comes in to 0.1em, which is what it takes to fit BOTH
          strings on one line at 375px — the narrowest phone worth designing
          for — and `text-balance` keeps them even if they ever do wrap.
          0.13em fitted a 412px screen and still broke at 375px, so the
          number is set by the smaller one.

          `gap-5` between three stacked items put the credit, the copyright
          and a 44px button inside 40px of each other with nothing marking
          where one ended. The hairline and the larger gap give the legal
          block its own zone, which is what it is.

          `pb-7` left the back-to-top button sitting on the brightest part of
          the watermark behind it; `pb-9` plus the gap clears it.

          THERE IS A HEIGHT BUDGET HERE. The footer is `h-[100svh]` with
          `overflow-hidden`, so it does not grow — anything this bar gains,
          the centre column loses, and past the slack the back-to-top button
          is simply CLIPPED off the bottom of the page. A first pass at these
          numbers spent 120px and cut 26px off the button. Measure the button
          against the footer's own bottom edge after changing any spacing in
          here, not just the look of it. Desktop keeps every one of its
          original values — this is a one-column problem.
        */}
        <div className="relative z-20 flex w-full flex-col items-center justify-between gap-5 border-t border-ink-300/60 px-6 pb-8 pt-6 sm:flex-row sm:gap-5 sm:border-0 sm:px-10 sm:pb-7 sm:pt-0 lg:px-14">
          <p className="order-2 text-balance text-center font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.1em] text-ink-600 sm:order-1 sm:text-left sm:tracking-[0.2em]">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          {/* Set exactly like the copyright opposite it, at the client's
              request: the pill made a credit line look like a control, and
              two different treatments on one bar read as two different kinds
              of information when they are the same kind. */}
          <p className="order-1 text-balance text-center font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.1em] text-ink-600 sm:order-2 sm:tracking-[0.2em]">
            Built in-house by {founders.map((f) => f.name).join(" & ")}
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
 * A plain footer link.
 *
 * No pill, no glass, no enclosure — replaced 2026-09-15. The treatment is a
 * hairline that grows from the left on hover, which is the same gesture the
 * service rows use, so the footer is not inventing a fourth link idiom.
 */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const className =
    "group inline-flex flex-col gap-1 text-sm text-ink-800 transition-colors duration-300 hover:text-ink-1000";
  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="block h-px w-0 bg-ink-1000 transition-[width] duration-500 group-hover:w-full"
      />
    </>
  );

  // A route navigates client-side; a mailto or tel must stay a plain anchor.
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={className}>
      {inner}
    </a>
  );
}

/** One labelled column of links. */
function FooterColumn({
  label,
  items,
}: {
  label: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="field-label text-ink-600">{label}</p>
      <ul className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5">
        {items.map((item) => (
          <li key={item.href}>
            <FooterLink href={item.href}>{item.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
