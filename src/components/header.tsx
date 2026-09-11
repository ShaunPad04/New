"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/content";
import { Wordmark } from "@/components/wordmark";
import { SocialLinks } from "@/components/social-links";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/lib/scroll-to-top";

const MENU = [...nav, { label: "Contact", href: "/#contact" }] as const;

/** Height of the bar, in px, matching the `h-[4.5rem]` below. */
const BAR_HEIGHT_PX = 72;

/**
 * Id of the zero-height marker that pages place immediately after their hero.
 * Exported so the page owns the placement and the header owns the behaviour,
 * rather than the header reaching for a section it does not render.
 */
export const HEADER_SENTINEL_ID = "header-surface-sentinel";

/** Drop this straight after the hero. It marks a position and nothing else. */
export function HeaderSurfaceSentinel() {
  return <div id={HEADER_SENTINEL_ID} aria-hidden="true" />;
}

/**
 * FLUID ISLAND NAV
 *
 * A floating glass pill detached from the top edge, per the house
 * high-end-visual-design standard — an edge-to-edge bar glued to the viewport
 * is explicitly banned there. Opening the menu expands a screen-filling glass
 * overlay whose links reveal on a stagger from behind an invisible mask.
 *
 * `backdrop-blur` is applied only to the mobile overlay, which is fixed —
 * never to scrolling content, which would force continuous GPU repaints.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /**
   * The bar is transparent over the hero and takes a surface once the page has
   * scrolled past it.
   *
   * Position is read from a sentinel element rather than a scroll offset,
   * because the hero PINS: ScrollTrigger holds it on screen for several
   * viewport heights, so "past the hero" is nowhere near
   * `scrollY > innerHeight`, and any constant would silently drift the moment
   * the pin distance changes. The sentinel sits immediately after the hero in
   * the document, outside the pinned section, so it reaches the top of the
   * viewport exactly when the pin releases — whatever that distance is.
   *
   * This was an IntersectionObserver first. It is the obvious tool and it is
   * the wrong one here: a 1px target crosses the entire observation band
   * inside a single frame on a fast scroll, so `isIntersecting` goes false to
   * false and the browser reports no change at all. Measured on this page, a
   * one-jump scroll past the hero produced ZERO callbacks where an
   * incremental scroll produced two — meaning the bar would simply fail to
   * appear after a flick scroll, an anchor jump, or a restored scroll
   * position on reload.
   *
   * Reading the rect on scroll is deterministic at any speed. The listener is
   * passive and coalesced to one read per animation frame, and it only touches
   * React state when the boolean actually flips, so a full-page scroll costs a
   * handful of re-renders rather than hundreds.
   *
   * Pages without a hero have no sentinel and take the surface as soon as the
   * page moves. Their intro block sits on the page ground, so there is nothing
   * for the bar to stay out of the way of.
   */
  useEffect(() => {
    const sentinel = document.getElementById(HEADER_SENTINEL_ID);
    let frame = 0;

    const measure = () => {
      frame = 0;
      const next = sentinel
        ? sentinel.getBoundingClientRect().top <= BAR_HEIGHT_PX
        : window.scrollY > 24;
      setSolid((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /**
   * Dialog semantics: Escape closes, focus moves in on open and returns to the
   * trigger on close, the page behind is locked, and Tab is trapped inside.
   *
   * The trap matters more now the menu is a desktop control too. Without it,
   * tabbing past the last link walks the keyboard into the page underneath —
   * which is still there, still scrolled, and now completely hidden behind the
   * overlay, so focus simply disappears.
   */
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;

    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    focusable()[0]?.focus();

    const trigger = toggleRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      {/*
        Full-width spread bar, at the client's explicit request (2026-09-04),
        replacing the floating island pill. The house standard prefers a
        detached pill and bans a bar "glued to the top", so this is a
        deliberate client override rather than a default. It is transparent
        over the hero and takes a surface past it — see the notes below.
      */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        {/*
          Fully transparent over the hero, then a glass bar once the page has
          scrolled past it.

          The surface is its own layer whose OPACITY is animated, rather than
          classes being swapped on the bar. Swapping meant the background and
          hairline cross-faded but `backdrop-filter` did not — a filter cannot
          transition from `none`, so the blur snapped in at full strength while
          everything else eased, which read as a glitch rather than an arrival.
          Fading a single layer takes the blur, the tint and the hairline up
          together on one compositor-friendly property.

          The layer stays mounted at zero opacity over the hero. That is the
          trade for the smooth transition: a fully transparent element is not
          painted, so the cost is a layer the compositor skips rather than a
          blur it recomputes every frame.
        */}
        <div className="pointer-events-auto relative flex h-[4.5rem] items-center gap-6 px-5 sm:px-7">
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 border-b border-white/10 bg-ink-0/70 backdrop-blur-2xl",
              "transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              solid ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Soft top-down gradient for the transparent state only. It is not
              a surface and costs nothing, but it keeps the wordmark off a
              bright frame of the hero sequence. It fades out as the bar
              arrives — over the same duration, so the two cross rather than
              stack. */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 -z-20 h-[8rem] bg-gradient-to-b from-black/70 via-black/28 to-transparent",
              "transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              solid ? "opacity-0" : "opacity-100"
            )}
          />
          {/*
            No `aria-label` here, deliberately.

            It used to carry `aria-label={`${site.name} — home`}`, which reads
            "Black Line Agency — home". The VISIBLE text is the wordmark plus
            the ™ mark, so the accessible name did not contain the visible
            label and the link failed WCAG 2.5.3 Label in Name. That is not a
            technicality: someone driving the browser by voice says "click
            Black Line Agency", the browser matches spoken input against the
            accessible name, and the mismatch means nothing happens.

            Letting the visible text form the name fixes it, and the sr-only
            word supplies the destination that the label was there to give.
          */}
          {/*
            On any other route this is an ordinary link home. ON the homepage
            it returns you to the hero, which is what a reader expects a
            wordmark to do and what it was not doing: navigating to the route
            you are already on is a no-op in the App Router, so the click
            landed nowhere and the control read as decoration.

            `href` stays "/" — it is a real link, crawlable, middle-clickable
            and openable in a new tab. The handler only takes over the
            same-page case, and only for a plain left click: modified clicks
            fall through so ⌘-click still opens a tab.

            `window.scrollTo` rather than a `#top` anchor, because an anchor
            would push a fragment onto the URL the reader never asked for.
            Lenis honours it — verified against the footer's back-to-top
            control, which uses the same call and travels the full page.
          */}
          <Link
            href="/"
            onClick={(event) => {
              if (pathname !== "/") return;
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                return;
              }
              event.preventDefault();
              setOpen(false);
              scrollToTop();
            }}
            className="group flex shrink-0 items-center gap-3"
          >
            <span
              aria-hidden="true"
              className="block h-4 w-px bg-ink-700 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:h-5 group-hover:bg-ink-1000"
            />
            <Wordmark />
            <span className="sr-only">home</span>
          </Link>

          {/* Items are spread across the remaining width rather than clustered,
              which is what gives the bar its editorial rhythm. */}
          <nav aria-label="Primary" className="hidden flex-1 md:block">
            <ul className="flex items-center justify-evenly">
              {nav.map((item, i) => {
                // A route needs <Link> for client-side navigation; an in-page
                // anchor must stay a plain <a> so the browser handles the jump.
                const isRoute = item.href.startsWith("/");

                /*
                 * WHICH ITEM YOU ARE ON.
                 *
                 * The bar had no active state at all, which the design review
                 * flagged: on a site with five real routes, the nav never told
                 * you which one you were reading. `startsWith` rather than
                 * equality so a case study under /portfolio still lights the
                 * Portfolio item — the reader is in that section, whatever
                 * the leaf URL says.
                 *
                 * `aria-current="page"` carries the same fact to a screen
                 * reader, which the colour alone cannot.
                 */
                // No `item.href !== "/"` guard: `nav` is typed as the five
                // category routes and TypeScript knows none of them is "/",
                // so the comparison would be flagged as unreachable.
                const current =
                  isRoute &&
                  (pathname === item.href ||
                    pathname.startsWith(`${item.href}/`));

                /*
                 * Set in the display face, at the client's request and to
                 * match the reference he sent: heavier, tighter and a shade
                 * smaller than the body face it replaces. It also does a
                 * second job — the bar now shares a voice with the headlines
                 * rather than looking like UI bolted above them.
                 *
                 * `.nav-roll` carries the hover: the label rotates up on an X
                 * axis and an identical copy arrives behind it, so the word
                 * turns rather than fading. See globals.css — it is CSS only,
                 * transform and nothing else, and the reduced-motion block
                 * stops it dead.
                 */
                const cls = cn(
                  /*
                   * UPPERCASE, at the client's request (2026-09-11): he
                   * pointed at the mobile overlay and asked for the bar to use
                   * that. The face was already the same — Archivo display —
                   * so the only real difference between the two was case. The
                   * bar carried a forced `normal-case!` to beat `.display`'s
                   * own uppercase rule on source order; dropping it is what
                   * makes the two agree.
                   *
                   * Tracking flips sign with the case. Display type is set at
                   * -0.01em because tight negative tracking is what makes a
                   * heavy lowercase headline read as one shape; uppercase at
                   * 15px needs the opposite — caps have no ascenders or
                   * descenders to separate them, so at nav size they close up
                   * and the word turns into a block. +0.06em is the smallest
                   * value that keeps PORTFOLIO and SERVICES legible here.
                   */
                  "nav-roll relative display text-[0.8125rem] font-bold tracking-[0.06em] transition-colors duration-500 hover:text-ink-1000",
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-ink-1000 after:transition-all after:duration-700 after:ease-[cubic-bezier(0.32,0.72,0,1)] hover:after:w-full",
                  // The rule under the current item is drawn and stays drawn;
                  // every other item draws it on hover.
                  current
                    ? "text-ink-1000 after:w-full"
                    : "text-ink-700 after:w-0",
                );

                /*
                 * The index, set as a superscript, from a reference the client
                 * sent.
                 *
                 * Worth being honest about what it does: these five routes are
                 * not a sequence, so the number is not information the way a
                 * step number in the process section is. What it does buy is
                 * rhythm — it gives each item a second, quieter typographic
                 * line and makes the bar read as set rather than typed. It is
                 * `aria-hidden` for exactly that reason: a screen reader
                 * announcing "Portfolio zero one" would be reading out
                 * decoration as if it were content.
                 */
                const index = (
                  <span
                    aria-hidden="true"
                    className="ml-1 align-super font-mono text-[0.5625rem] tracking-[0.08em] text-ink-600"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                );

                return (
                  <li key={item.href}>
                    {isRoute ? (
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={cls}
                      >
                        <span className="nav-roll-face">
                          {item.label}
                          {index}
                        </span>
                        {/* The second copy is the one that arrives. It is
                            `aria-hidden` so the link's accessible name stays a
                            single label rather than the word twice. */}
                        <span aria-hidden="true" className="nav-roll-ghost">
                          {item.label}
                          {index}
                        </span>
                      </Link>
                    ) : (
                      <a href={item.href} className={cls}>
                        <span className="nav-roll-face">
                          {item.label}
                          {index}
                        </span>
                        <span aria-hidden="true" className="nav-roll-ghost">
                          {item.label}
                          {index}
                        </span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
            {/* The header CTA is the single highest-intent element on the
                page. "Book a call" names the actual next step, which converts
                better than an abstract "Enquire" — and it is honest: the form
                below routes straight to booking a call. */}
            <Link
              href="/#contact"
              className="hidden rounded-full bg-ink-1000 px-5 py-2.5 text-sm font-medium tracking-tight text-ink-0 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98] sm:inline-block"
            >
              Book a call
            </Link>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/30 hover:bg-white/[0.08] active:scale-95"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ink-1000 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    open ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-ink-1000 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    open ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Screen-filling glass overlay with a staggered mask reveal. */}
      {/*
        Dropdown panel anchored under the button, not a screen takeover.

        It was a full-screen overlay; the client found that disproportionate
        for six links on a desktop, and he is right — covering the entire page
        to show a short list makes the menu feel like a mode you have entered
        rather than a control you have opened. It is now a panel that sits
        where the button is, at its own size.

        A dimmer still covers the page behind it, because a panel with no
        dimmer leaves a click on the page ambiguous: the dimmer is what makes
        "click anywhere to dismiss" discoverable rather than a guess.
      */}
      {open ? (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-ink-0/70 backdrop-blur-sm"
          />

          {/*
            FULL-HEIGHT MENU, replacing the small dropdown panel, at the
            client's request and modelled on a reference he sent.

            The old panel was a 320px card in the top-right corner with 16px
            links. It worked, and it said nothing. A menu that takes the whole
            screen and sets the routes at display scale is the single cheapest
            way for a studio to look like it means it — the links stop being a
            utility and become the page you are on.

            What changed, and what deliberately did not:

             - The panel is the full viewport height and pinned to the right on
               a wide screen, full width on a phone. `100dvh`, not `100vh`, so
               it does not run under a mobile browser's chrome.
             - The routes are the display face, uppercase, hairline-separated,
               and the current one carries a mark — the same active state the
               top bar now has, said in the same language.
             - The direct email keeps the accent position the reference gives
               it. In that reference the accent is orange; here it is white on
               a grey list, because this palette has no hue and inverting the
               weight is how emphasis is made everywhere else on this site.
             - Dialog semantics are untouched: role, aria-modal, the focus
               trap, Escape, the scroll lock and focus returning to the trigger
               all still work exactly as they did, and the suite covers them.
          */}
          <div
            ref={panelRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-full flex-col overflow-y-auto border-l border-white/10 bg-ink-0/95 backdrop-blur-2xl animate-[rise_0.45s_cubic-bezier(0.32,0.72,0,1)_both] sm:w-[28rem]"
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 px-7 py-6">
              <span
                aria-hidden="true"
                className="block h-2 w-2 bg-ink-1000"
              />
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.28em] text-ink-700">
                Menu
              </p>

              {/*
                A close control INSIDE the panel, which the old dropdown did
                not need and this one does: the panel is full height and pinned
                to the right, so it now covers the toggle that opened it. Escape
                still works and so does the backdrop, but neither is visible,
                and a menu whose only exits are invisible is a menu people feel
                trapped in.
              */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="nav-icon-button ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-ink-700 transition-colors duration-500 hover:border-white/30 hover:text-ink-1000"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            <nav aria-label="Site" className="px-7">
              <ul>
                {MENU.map((item) => {
                  const isRoute = item.href.startsWith("/");
                  const current =
                    isRoute &&
                    (pathname === item.href ||
                      pathname.startsWith(`${item.href}/`));
                  const cls = cn(
                    "group flex items-center gap-3 border-b border-white/10 py-6 transition-colors duration-500",
                    "display text-[2rem] leading-none tracking-[-0.03em] sm:text-[2.5rem]",
                    current
                      ? "text-ink-1000"
                      : "text-ink-600 hover:text-ink-1000",
                  );
                  const mark = (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "block h-2 w-2 shrink-0 transition-opacity duration-500",
                        current
                          ? "bg-ink-1000 opacity-100"
                          : "bg-ink-1000 opacity-0 group-hover:opacity-100",
                      )}
                    />
                  );
                  return (
                    <li key={item.href}>
                      {isRoute ? (
                        <Link
                          href={item.href}
                          aria-current={current ? "page" : undefined}
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          {item.label}
                          {mark}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          {item.label}
                          {mark}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto px-7 pb-9 pt-10">
              <p className="field-label mb-3 text-ink-600">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="block text-[1.0625rem] tracking-tight text-ink-1000 underline-offset-4 transition-colors duration-300 hover:underline"
              >
                {site.email}
              </a>

              <p className="field-label mb-3 mt-8 text-ink-600">Phone</p>
              <a
                href={site.phoneHref}
                className="block text-[1.0625rem] tracking-tight text-ink-1000 underline-offset-4 transition-colors duration-300 hover:underline"
              >
                {site.phone}
              </a>

              <p className="field-label mb-4 mt-8 text-ink-600">Socials</p>
              <SocialLinks />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
