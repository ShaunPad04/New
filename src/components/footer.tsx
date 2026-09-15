import Link from "next/link";
import { founders, nav, site, socials } from "@/lib/content";
import { NewsletterForm } from "@/components/newsletter-form";
import { BackToTop } from "@/components/back-to-top";

/**
 * CLOSING FOOTER
 *
 * Rebuilt 2026-09-15 to the structure of a reference the client sent
 * (Portiva), at his explicit direction to replace the footer rather than
 * adjust it. What was here before — a stacked wordmark, a display heading, a
 * lede, three glass pills, seven more glass pills and a row of social rings —
 * is gone.
 *
 * The composition, top to bottom:
 *
 *   1. One quiet line of invitation.
 *   2. THE ADDRESS, at display scale, set in `ink-600` so it reads as a
 *      surface rather than a shout, resolving to full white on hover. This is
 *      the footer's single focal point and everything else defers to it.
 *   3. Three columns: where to find us, where to go, and the list.
 *   4. The legal bar.
 *   5. A full-bleed inverted marquee carrying the wordmark.
 *
 * WHAT WAS ADAPTED RATHER THAN COPIED, and why in each case:
 *
 *  - The reference's marquee band is a solid brand red. This palette has no
 *    colour, so the band is the INVERSION instead — white plate, black
 *    wordmark — which is the emphasis device the featured pricing tier
 *    already uses. It is the only inverted surface in the footer, which is
 *    what makes it read as a signature rather than as another section.
 *  - `ink-600` for the address is not a guess. It is `#808080`, the lowest
 *    value on this scale that clears WCAG AA on `ink-0`, and the reference's
 *    grey sits at roughly the same value. Do not take it lower to match a
 *    screenshot more closely; there is no headroom beneath it.
 *  - Its social links are FACEBOOK / INSTAGRAM / LINKEDIN / TWITTER. Ours are
 *    whatever is in `socials`, and an entry with no `href` renders as PLAIN
 *    TEXT rather than as an anchor — see the note on that block. Every one of
 *    them is currently empty.
 *  - Its newsletter box posts somewhere unknown. Ours posts to
 *    `/api/subscribe`, which returns 501 and says so until an audience is
 *    configured. See that route for the consent obligations this creates.
 *
 * THE CURTAIN IS KEPT. The footer does not scroll with the page; the page
 * slides off it. The mechanism is one line — `clip-path` on the wrapper,
 * which makes a clipped element the containing block for its `fixed`
 * descendants. Below 960px of height AND 1024px of width `globals.css` turns
 * the whole thing back into a normal block, because a `100svh` box with
 * `overflow-hidden` CLIPS anything taller than the viewport and that means
 * losing the legal lines and the only control down here. Read that rule
 * before changing any height in this file.
 */
export function Footer() {
  return (
    <>
      {/*
        NO CURTAIN. Removed 2026-09-15 at the client's instruction — "you
        shouldn't have to scroll for the footer to be revealed".

        The footer used to be `fixed bottom-0` inside a `clip-path` wrapper so
        the page slid off it like a curtain rising. It looked good and it cost
        exactly the thing he objected to: because the outgoing page covers the
        footer from the top down, the footer was revealed from its BOTTOM up,
        so the address — the whole point of the block — was the LAST thing to
        appear, a full 100svh of scrolling after the legal bar. Measured at
        1633x740: at the document end the address sits at y=152 and is not
        clipped, so this was never a clipping bug; it was reveal order.

        It is now an ordinary block. It is as tall as its content at every
        viewport, nothing is pinned, nothing is clipped, and there is no
        height budget to blow — which also retires the `@media (max-height:
        960px) and (max-width: 1023px)` escape hatch that existed only to stop
        the curtain eating the legal lines on a short phone.

        `z-30` is still load-bearing. ScrollTrigger gives the pinned hero its
        own stacking context, and without an explicit layer here the pinned
        section painted OVER the footer — links visible, but every click
        landing on the hero heading instead. Caught by the privacy-policy link
        test rather than by eye. Keep it.
      */}
      <footer className="relative z-30 flex w-full flex-col overflow-hidden bg-ink-0">
        {/* Ambient white glow. Monochrome — the reference's aurora was two
            brand hues, and this palette has none. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(circle_at_center,rgb(255_255_255/0.05)_0%,transparent_70%)] blur-[70px]"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col px-6 py-20 sm:px-10 sm:py-24 lg:px-14 lg:py-28">
          {/* ---- The invitation and the address ---- */}
          <p className="text-center text-sm leading-relaxed text-ink-700">
            Reach out if you are ready to build something worth looking at.
          </p>

          {/*
            THE ONLY BREAK POINT IS THE @.

            An earlier pass used `overflow-wrap: anywhere`, which fixed a clip
            and caused a worse defect: at tablet width the address broke as
            "...BLACKLINEAGENCY.CO." / "UK", splitting the TLD. An arbitrary
            break inside an address reads as a rendering fault. The string is
            split on its own "@" and a <wbr> is the single offered break, so
            it either sits on one line or folds where a reader expects.

            `.display` uppercases it on screen while the `mailto:` keeps
            `site.email` exactly as written — the domain part is
            case-insensitive per RFC 1035 and the href is untouched.
          */}
          <a
            href={`mailto:${site.email}`}
            className="display mt-4 block text-center text-[clamp(1.25rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-ink-600 transition-colors duration-500 hover:text-ink-1000"
          >
            {site.email.split("@")[0]}@<wbr />
            {site.email.split("@")[1]}
          </a>

          {/* ---- Three columns ---- */}
          <div className="mt-14 grid gap-x-10 gap-y-12 border-t border-ink-300/60 pt-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-x-16">
            {/*
              SOCIAL DESTINATIONS.

              Every `href` in `socials` is currently an empty string, so every
              one of these renders as plain text. That is deliberate and it is
              the rule the old icon component already followed: a link to
              nowhere is a dead end for a visitor, a focus stop that does
              nothing for a keyboard user, and a broken outbound signal for a
              crawler. Put a real URL in content.ts and the entry becomes an
              anchor with the arrow, with no change here.
            */}
            <div>
              <p className="field-label text-ink-600">Follow</p>
              <ul className="mt-6 space-y-4">
                {socials.map((s) => (
                  <li key={s.name}>
                    {s.href ? (
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="clash-links group inline-flex items-center gap-2 text-[1.0625rem] tracking-[0.01em] text-ink-800 transition-colors duration-300 hover:text-ink-1000"
                      >
                        {s.name}
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        >
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="clash-links text-[1.0625rem] tracking-[0.01em] text-ink-600">
                        {s.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* ---- Where to go ---- */}
            <nav aria-label="Footer">
              <p className="field-label text-ink-600">Explore</p>
              <ul className="mt-6 space-y-4">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="clash-links text-[1.0625rem] tracking-[0.01em] text-ink-800 transition-colors duration-300 hover:text-ink-1000"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ---- The list ---- */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="field-label text-ink-600">Newsletter</p>
              <div className="mt-6">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        {/* ---- Legal bar ----

            The privacy link lives here and is asserted by a test that loads
            the homepage and follows it. Keep a real anchor to
            /legal/privacy in this footer whatever else changes. */}
        <div className="relative z-20 mx-auto flex w-full max-w-[1600px] flex-col items-center gap-5 border-t border-ink-300/60 px-6 pb-8 pt-6 sm:flex-row sm:justify-between sm:px-10 sm:pb-7 lg:px-14">
          {/*
            TWO PARAGRAPHS, NOT ONE, and the test at tests/a11y.spec.ts:1091
            asserts exactly that — it counts the elements carrying "All rights
            reserved" and "Built in-house" and requires BOTH to be inside the
            viewport at 375x667 and 390x844. Merging them into a single line
            broke it, which is the test doing its job: these are the two legal
            lines and the regression it guards is them being clipped off the
            bottom of a short phone. Keep them separate and keep both strings.
          */}
          <p className="order-2 text-balance text-center font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.1em] text-ink-600 sm:order-1 sm:text-left sm:tracking-[0.2em]">
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <p className="order-3 text-balance text-center font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.1em] text-ink-600 sm:order-2 sm:tracking-[0.2em]">
            Built in-house by {founders.map((f) => f.name).join(" & ")}
          </p>

          <div className="order-1 flex items-center gap-6 sm:order-3">
            <Link
              href="/legal/privacy"
              className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-600 transition-colors duration-300 hover:text-ink-1000 sm:tracking-[0.2em]"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="font-mono text-[0.625rem] uppercase tracking-[0.1em] text-ink-600 transition-colors duration-300 hover:text-ink-1000 sm:tracking-[0.2em]"
            >
              Terms
            </Link>
            <BackToTop />
          </div>
        </div>

      </footer>

    {/*
      THE BAND SITS OUTSIDE THE CURTAIN, and that placement is the feature
      (client, 2026-09-15: "this part should only show once you scroll more").

      Inside the footer it arrived the instant the curtain did, because the
      curtain is `fixed bottom-0` at `100svh` — everything in it is on screen
      together. Out here it is a normal block in document flow AFTER the
      clip-path shell, so the reader scrolls through the whole closing
      statement first and the signature comes up underneath it. That is the
      order the reference uses and the reason it reads as a sign-off rather
      than as another row of the footer.

      It must stay a SIBLING of the shell, never a child. A child of the
      clipped wrapper is bound by that wrapper's box, which is exactly the
      constraint being escaped here.
    */}
    <FooterMarquee />
    </>
  );
}

/**
 * The signature band.
 *
 * Three things the client asked for off the reference (2026-09-15), and the
 * mechanism for each:
 *
 * 1. CLASH DISPLAY, not Archivo. Identified by reading the reference's own
 *    computed styles rather than guessing at a screenshot: "Clash Display"
 *    700 at -0.02em. Self-hosted — see the note in layout.tsx for why a
 *    Fontshare CDN link would break both the privacy policy and a test.
 *
 * 2. THE BOTTOM BLUR. The reference softens the lower edge of its letters.
 *    A filter cannot apply to part of one element, so the track is rendered
 *    TWICE in the same box: a sharp copy, and a blurred copy masked to the
 *    bottom third. Both carry `.marquee-track` with the same duration and
 *    mount together, so a linear infinite animation keeps them in step.
 *    `aria-hidden` on the wrapper covers both, so the duplicate never
 *    reaches the accessibility tree.
 *
 * 3. GRAIN. `.grain-plate` — a local multiply layer, because the global
 *    `.grain` is 0.035 and invisible on a white plate.
 *
 * `marquee-x` translates 0 to -50%, so the content must be exactly TWO
 * identical halves or the loop visibly jumps. The name is already in the
 * header, the address, the copyright and the page title, so this is
 * decorative and hidden: a screen reader meeting it a fifth time on the way
 * out is noise, not branding. `.marquee-track` is disabled outright under
 * `prefers-reduced-motion`, which leaves a static band — the correct
 * fallback for a mark that carries no information.
 */
function MarqueeTrack() {
  return (
    <div
      className="marquee-track flex w-max items-center"
      style={{ ["--marquee-duration" as string]: "34s" }}
    >
      {[0, 1].map((half) => (
        <div key={half} className="flex items-center">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="clash flex items-center whitespace-nowrap text-[clamp(1.75rem,5vw,4rem)] leading-none tracking-[-0.02em] text-ink-0"
            >
              {site.logotype}
              <span className="px-6 opacity-40 sm:px-10">/</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function FooterMarquee() {
  return (
    <div
      aria-hidden="true"
      className="grain-plate relative z-20 w-full overflow-hidden bg-ink-1000 py-2 sm:py-3"
    >
      <MarqueeTrack />

      {/* The blurred copy, masked to the lower edge. Sits over the sharp one
          at the same offset, so the letters simply soften towards the bottom
          rather than doubling. */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center py-2 sm:py-3"
        style={{
          filter: "blur(4px)",
          maskImage:
            "linear-gradient(to bottom, transparent 55%, #000 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 55%, #000 90%)",
        }}
      >
        <MarqueeTrack />
      </div>
    </div>
  );
}
