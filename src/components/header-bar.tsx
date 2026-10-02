"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BracketLink } from "@/components/v3/bracket-link";
import { cn } from "@/lib/utils";
import { scrollToTop } from "@/lib/scroll-to-top";

type NavItem = { label: string; href: string };

/* The copy arrives as props from the server wrapper (`header.tsx`), so the
   browser never downloads content.ts for the header (2026-10-02: it was
   shipping the whole copy file, ~125KB raw, to every page). */
export type HeaderBarProps = {
  nav: readonly NavItem[];
  site: { name: string; email: string; phone: string; phoneHref: string };
  projectCount: number;
  brandMark: string;
  /** The socials row, rendered on the server. */
  socials: ReactNode;
};

/** Height of the bar, in px, matching the `h-11` below. */
const BAR_HEIGHT_PX = 44;

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

const isCurrent = (pathname: string, href: string) =>
  href.startsWith("/") &&
  !href.includes("#") &&
  (pathname === href || pathname.startsWith(`${href}/`));

/**
 * NEIDEN HEADER (Brad, 2026-09-28: "copy Neiden's header as well on the
 * menu"; neiden.framer.media, studied, nothing taken). A slim white bar on
 * the hero's three-column grid — the mark, the name and a tag in the first
 * column, the routes from the second, the menu button at the far end, the
 * grid's column rules running up through it — and a menu that opens as a
 * centred black panel over the blurred page.
 */
export function HeaderBar({ nav, site, projectCount, brandMark, socials }: HeaderBarProps) {
  const MENU = [{ label: "Home", href: "/" }, ...nav, { label: "Contact", href: "/#contact" }];
  // Home first, as an ordinary link; FAQ lives in the menu only to make room
  // (Brad, 2026-09-28).
  const BAR_NAV = [
    { label: "Home", href: "/" },
    ...nav.filter((n) => n.href !== "/faq"),
    { label: "Get in touch", href: "/#contact" },
  ];
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /**
   * The bar is always solid now; past the hero it only gains a hairline.
   * Read from the sentinel's rect per frame rather than an
   * IntersectionObserver: a 1px target crosses the whole band inside one
   * frame on a fast scroll and the observer reports nothing.
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
      // The bar's toggle is in the cycle: it is the menu's only close button.
      const toggle = toggleRef.current;
      const items = [...(toggle ? [toggle] : []), ...focusable()];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !items.includes(active as HTMLElement))) {
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

  const close = () => setOpen(false);

  /** Home, on the homepage: back to the hero (the same route is a no-op in the
   *  App Router). Modified clicks fall through so ⌘-click still opens a tab. */
  const onNav =
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      close();
      if (href !== "/" || pathname !== "/") return;
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      scrollToTop();
    };

  return (
    <>
      {/* Named for page transitions, so the bar stays put above a project
          picture growing into its case study instead of vanishing under it. */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 [view-transition-name:site-header]">
        <div
          className={cn(
            "pointer-events-auto relative grid h-11 grid-cols-[1fr_auto] items-center bg-ink-1000 px-6 text-ink-0 transition-shadow duration-500 sm:px-10 lg:grid-cols-3",
            solid && "shadow-[0_1px_0_rgb(0_0_0/0.14)]",
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-10 right-10 hidden grid-cols-3 lg:grid"
          >
            <span className="border-r border-black/10" />
            <span className="border-r border-black/10" />
          </span>

          <nav
            aria-label="Primary"
            className="relative col-span-3 hidden lg:block"
          >
            <ul className="flex items-center justify-between pr-20">
              {BAR_NAV.map((item) => {
                const current = isCurrent(pathname, item.href);
                // Neiden's count beside Projects; ours is real, the project count.
                const count =
                  item.href === "/portfolio" ? (
                    <sup
                      aria-hidden="true"
                      className="ml-1 text-[0.625rem] font-medium"
                    >
                      {projectCount}
                    </sup>
                  ) : null;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      onClick={onNav(item.href)}
                      className={cn(
                        "nav-roll-trigger relative flex min-h-11 items-center text-[0.75rem] font-bold uppercase tracking-[0.02em] transition-colors duration-300",
                        // One colour for every link, current page included
                        // (Brad, 2026-09-28: "make sure they are all the same
                        // colour"). aria-current still tells assistive tech.
                        // The exception: the enquiry link is always red, black on hover
                        // (Brad, 2026-09-29: it's the call to action). In
                        // --color-accent-ink, the AA-safe red for white.
                        item.label === "Get in touch"
                          ? "text-accent-ink hover:text-ink-0 focus-visible:text-ink-0"
                          : "text-ink-0",
                      )}
                    >
                      <span className="nav-roll">
                        <span className="nav-roll-face">
                          {item.label}
                          {count}
                        </span>
                        <span aria-hidden="true" className="nav-roll-ghost">
                          {item.label}
                          {count}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Neiden's two offset strokes; open, a ringed x. */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={cn(
              // No ring (Brad, 2026-09-29: "i dont like the x after clicking
              // menu" — it was a ringed x): the two strokes cross into a slim
              // x on their own.
              "group relative flex h-11 w-11 items-center justify-center justify-self-end lg:absolute lg:right-6",
            )}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-2.5 w-6">
              <span
                className={cn(
                  "absolute right-0 block h-[1.5px] bg-ink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open
                    ? "top-1 w-5 -translate-x-0.5 rotate-45"
                    : "top-0 w-6 group-hover:w-4",
                )}
              />
              <span
                className={cn(
                  "absolute right-0 block h-[1.5px] bg-ink-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open
                    ? "top-1 w-5 -translate-x-0.5 -rotate-45"
                    : "top-2 w-4 group-hover:w-6",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {open ? (
        <>
          {/* The page behind is dimmed and blurred; clicking it closes. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={close}
            className="menu-dim fixed inset-0 z-40 cursor-default bg-ink-0/55 backdrop-blur-md"
          />

          {/*
            THE MENU (Brad, 2026-09-28: "make it look a bit better, looks a bit
            generic"). Built from the site's own vocabulary rather than a
            template's: a grained black panel with bracket corners, the routes
            enormous in Cal Sans lowercase (the hero wordmark's face) with
            /01 indices, each row rolling on hover while the others dim, the
            contacts as one quiet strip, the bracket CTA. Rows cascade in on
            open. Phones: a full-screen sheet under the bar (no card, no
            corners, no second close button; the bar's x closes it). Dialog
            semantics as before (role, aria-modal, trap, Escape,
            scroll lock, focus back to the trigger).

            `data-lenis-prevent` must stay: Lenis intercepts wheel events
            document-wide and the page is locked while this is open, so without
            it the panel cannot be scrolled on a short screen (asserted by a
            test that wheels it).
          */}
          <div
            ref={panelRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-lenis-prevent
            className="menu-panel fixed inset-x-0 bottom-0 top-11 z-50 overflow-y-auto bg-ink-0 text-ink-1000 [scrollbar-width:none] sm:inset-auto sm:left-1/2 sm:top-[calc(50%+1.375rem)] sm:max-h-[calc(100dvh-4.75rem)] sm:w-[calc(100%-2rem)] sm:max-w-[46rem] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:ring-1 sm:ring-white/10 sm:[scrollbar-width:auto]"
          >
            {[
              "left-3 top-3 border-l border-t",
              "right-3 top-3 border-r border-t",
              "bottom-3 left-3 border-b border-l",
              "bottom-3 right-3 border-b border-r",
            ].map((c) => (
              <span
                key={c}
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute hidden h-3 w-3 border-ink-1000 sm:block",
                  c,
                )}
              />
            ))}

            {/* The grain lives on this inner block, not the scroller, so it
                covers the whole scrolled height (on the scroller it stopped
                at the first screen and left a seam). */}
            <div className="btn-grain relative min-h-full px-6 pb-10 pt-5 sm:px-12 sm:pb-11 sm:pt-9">
              {/* No close button in the panel: the bar's slim x closes it at
                  every width (Brad, 2026-09-29, removed the ringed x). */}
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-600">
                / Menu
              </p>

              <nav aria-label="Site" className="mt-4 sm:mt-6">
                <ul className="group/list border-t border-white/10">
                  {MENU.map((item, i) => {
                    const current = isCurrent(pathname, item.href);
                    const count =
                      item.href === "/portfolio" ? (
                        <sup
                          aria-hidden="true"
                          className="ml-1.5 font-mono text-[0.75rem] tracking-normal text-ink-600"
                        >
                          ({projectCount})
                        </sup>
                      ) : null;
                    return (
                      <li
                        key={item.href}
                        className="menu-item border-b border-white/10"
                        style={{ "--i": i } as CSSProperties}
                      >
                        <Link
                          href={item.href}
                          aria-current={current ? "page" : undefined}
                          onClick={onNav(item.href)}
                          className="nav-roll-trigger group/row grid min-h-[3.5rem] grid-cols-[2.75rem_1fr_auto] sm:min-h-[3.75rem] items-center transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/list:opacity-40 hover:!opacity-100 focus-visible:!opacity-100"
                        >
                          <span
                            aria-hidden="true"
                            className="font-mono text-[0.6875rem] tracking-[0.12em] text-ink-600"
                          >
                            /{String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="nav-roll text-[clamp(1.875rem,6vw,2.875rem)] lowercase leading-[1.1] tracking-[-0.045em] [font-family:var(--font-cal-ui)]">
                            <span className="nav-roll-face">
                              {item.label}
                              {count}
                            </span>
                            <span aria-hidden="true" className="nav-roll-ghost">
                              {item.label}
                              {count}
                            </span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "text-[1.25rem] transition-[opacity,translate,rotate] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                              current
                                ? "opacity-100"
                                : "-translate-x-2 opacity-0 group-hover/row:translate-x-0 group-hover/row:rotate-45 group-hover/row:opacity-100 group-focus-visible/row:opacity-100",
                            )}
                          >
                            {current ? "\u25cf" : "\u2197"}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div
                className="menu-item mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-[1fr_1.6fr_1fr] sm:gap-6"
                style={{ "--i": MENU.length } as CSSProperties}
              >
                <div>
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-600">
                    Phone
                  </p>
                  <a
                    href={site.phoneHref}
                    className="mt-2 block text-[1.0625rem] tracking-[-0.01em] underline-offset-4 hover:underline"
                  >
                    {site.phone}
                  </a>
                </div>
                <div className="max-sm:order-2 max-sm:col-span-2">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-600">
                    Email
                  </p>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-2 block text-[0.9375rem] tracking-[-0.01em] underline-offset-4 [overflow-wrap:anywhere] hover:underline"
                  >
                    {site.email}
                  </a>
                </div>
                <div className="max-sm:order-1">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-600">
                    Studio
                  </p>
                  <p className="mt-2 text-[0.9375rem] text-ink-800">
                    Humberston, Grimsby
                  </p>
                </div>
              </div>

              <div
                className="menu-item mt-8 flex flex-col gap-6 sm:flex-row sm:items-center"
                style={{ "--i": MENU.length + 1 } as CSSProperties}
              >
                <BracketLink
                  href="/#contact"
                  roll
                  className="flex w-full sm:flex-1"
                >
                  Start a project
                </BracketLink>
                {socials}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-600">
                <p>
                  &copy; {new Date().getFullYear()} {site.name}
                  {brandMark}
                </p>
                <div className="flex items-center gap-5">
                  <Link
                    href="/legal/terms"
                    onClick={close}
                    className="flex min-h-6 items-center transition-colors hover:text-ink-1000"
                  >
                    Terms
                  </Link>
                  <Link
                    href="/legal/privacy"
                    onClick={close}
                    className="flex min-h-6 items-center transition-colors hover:text-ink-1000"
                  >
                    Privacy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
