"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, secondaryNav, site } from "@/lib/content";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

/**
 * Fixed header — reference geometry: 84px band, 1320px inner row, logo
 * left, uppercase 14px links with a 25px gap and the black "Contact us"
 * button at the right. The band is transparent over the homepage hero and
 * white elsewhere; it turns white with a hairline once the page scrolls.
 *
 * Nav links underline with a 1px bar that fades in over 900ms (the
 * reference's "Fill" element).
 *
 * The mobile menu is a full-screen ink overlay in the register of the hero
 * name: uppercase, letter-spaced Switzer, indexed, each line resolving
 * from a blur on a stagger. The header sits over it with white type and an
 * outlined toggle while it is open.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // True while the homepage film is the only thing on screen. The header is
  // the one piece of chrome over a title sequence, so it stays out of the way
  // until the page rises — which is also the moment it can be solid, so it
  // never has to sit as white type on a bright frame.
  const [overFilm, setOverFilm] = useState(false);
  const [focused, setFocused] = useState(false);
  // Hiding the header would leave a visitor at the top of the page with no
  // way to navigate, so it comes back the moment they reach for it: the
  // pointer entering the top band of the screen, or keyboard focus. Touch has
  // no pointer to read, so there it hides for the opening screen only.
  const [reaching, setReaching] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // The hero section is a runway taller than the screen; its stage is
    // sticky inside it. The white page finishes rising over that stage one
    // viewport before the runway ends — that single threshold both turns the
    // header solid and brings it back.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>("section[aria-labelledby='hero-heading']");
      const limit = hero ? Math.max(16, hero.offsetHeight - window.innerHeight - 84) : 16;
      const past = window.scrollY > limit;
      setScrolled(past);
      // With a pointer the header is hidden for the whole film and recalled on
      // demand; on touch there is nothing to recall it with, so it hides for
      // the opening screen and then stays.
      const filmLimit = fine ? limit : window.innerHeight;
      setOverFilm(Boolean(hero) && window.scrollY <= filmLimit);
    };
    const onMove = (e: PointerEvent) => setReaching(e.clientY < 140);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);


  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    const trigger = toggleRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      trigger?.focus();
    };
  }, [open]);

  const solid = (scrolled || pathname !== "/") && !open;
  const light = !solid; // over the hero film, or over the open menu
  // Keyboard focus always brings it back, so tabbing never lands on
  // something invisible.
  const hidden = overFilm && pathname === "/" && !open && !focused && !reaching;

  return (
    <>
    <header
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false); }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,opacity,transform] duration-500 ease-out-soft",
        solid ? "bg-white/95 shadow-[0_1px_0_rgba(8,11,15,0.06)] backdrop-blur-md" : "bg-transparent",
        hidden && "pointer-events-none -translate-y-3 opacity-0"
      )}
    >
      {/* Over the film there is no scrim to sit on, so the type carries its own
          shadow — it keeps the header legible on a pale frame without tinting
          a single pixel of the footage. */}
      <div className={cn("container flex h-[84px] items-center justify-between", light && "[text-shadow:0_1px_14px_rgba(8,11,15,0.65)]")}>
        <Logo tone={light ? "white" : "dark"} />

        <nav aria-label="Primary" className="hidden items-center gap-[25px] lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("group relative py-1 text-sm uppercase tracking-[0.02em] transition-colors duration-500 ease-out-soft", light ? "text-white" : "text-ink")}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px bg-current transition-opacity duration-[900ms] ease-out-soft",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
          <Button href="/contact" variant={light ? "white" : "black"} className="ml-1">Contact us</Button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-[12px] border transition-colors duration-500 ease-out-soft lg:hidden",
            open ? "border-white/30 bg-transparent" : "border-line/60 bg-white"
          )}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="relative block h-[14px] w-5">
            <span className={cn("absolute left-0 block h-[1.5px] w-full transition-all duration-500 ease-out-soft", open ? "top-[6px] rotate-45 bg-white" : "top-0 bg-ink")} />
            <span className={cn("absolute left-0 top-[6px] block h-[1.5px] w-full bg-ink transition-opacity duration-300", open ? "opacity-0" : "opacity-100")} />
            <span className={cn("absolute left-0 block h-[1.5px] w-full transition-all duration-500 ease-out-soft", open ? "top-[6px] -rotate-45 bg-white" : "top-[12px] bg-ink")} />
          </span>
        </button>
      </div>

    </header>
      {open ? (
        <div
          ref={panelRef}
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-ink text-white lg:hidden"
        >
          <nav aria-label="Mobile" className="container flex min-h-full flex-col justify-between pb-10 pt-[112px]">
            <div>
              <ul className="flex flex-col border-t border-white/10">
                {nav.map((item, i) => (
                  <li key={item.href} className="border-b border-white/10">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      style={{ animationDelay: `${80 + i * 70}ms` }}
                      className="menu-in flex items-baseline gap-4 py-[18px]"
                    >
                      <span aria-hidden="true" className="w-6 shrink-0 text-[11px] tracking-[0.2em] text-white/55">0{i + 1}</span>
                      <span className="text-[clamp(26px,7.2vw,36px)] font-medium uppercase leading-none tracking-[0.16em]">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 flex flex-col gap-4 pl-10">
                {secondaryNav.map((item, i) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      style={{ animationDelay: `${380 + i * 60}ms` }}
                      className="menu-in inline-block text-[13px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="menu-in mt-14 flex flex-col gap-2 text-[12px] uppercase tracking-[0.16em] text-white/65" style={{ animationDelay: "640ms" }}>
              <a href={site.phoneHref} className="text-sm tracking-[0.12em] text-white">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="text-sm normal-case tracking-normal text-white">{site.email}</a>
              <p>{site.openingHours}</p>
              <Button href="/contact" variant="white" className="mt-5 self-start">Contact us</Button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
