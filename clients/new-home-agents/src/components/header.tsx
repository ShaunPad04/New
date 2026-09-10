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
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const solid = scrolled || pathname !== "/" || open;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ease-out-soft",
        solid ? "bg-white/95 shadow-[0_1px_0_rgba(8,11,15,0.06)] backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="container flex h-[84px] items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-[25px] lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="group relative py-1 text-sm uppercase tracking-[0.02em] text-ink"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px bg-ink transition-opacity duration-[900ms] ease-out-soft",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            );
          })}
          <Button href="/contact" className="ml-1">Contact us</Button>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-line/60 bg-white lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="relative block h-[14px] w-5">
            <span className={cn("absolute left-0 block h-[1.5px] w-full bg-ink transition-all duration-500 ease-out-soft", open ? "top-[6px] rotate-45" : "top-0")} />
            <span className={cn("absolute left-0 top-[6px] block h-[1.5px] w-full bg-ink transition-opacity duration-300", open ? "opacity-0" : "opacity-100")} />
            <span className={cn("absolute left-0 block h-[1.5px] w-full bg-ink transition-all duration-500 ease-out-soft", open ? "top-[6px] -rotate-45" : "top-[12px]")} />
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
          className="fixed inset-x-0 bottom-0 top-[84px] z-40 overflow-y-auto bg-white lg:hidden"
        >
          <nav aria-label="Mobile" className="container flex min-h-full flex-col justify-between py-8">
            <ul className="flex flex-col">
              {[...nav, ...secondaryNav].map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-hairline">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ animationDelay: `${60 + i * 50}ms` }}
                    className="block animate-[rise_0.7s_cubic-bezier(0.22,1,0.36,1)_both] py-4 text-[28px] font-medium leading-tight text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 text-sm text-slate">
              <a href={site.phoneHref} className="text-ink">{site.phone}</a>
              <a href={`mailto:${site.email}`} className="text-ink">{site.email}</a>
              <p>{site.openingHours}</p>
              <Button href="/contact" className="mt-4 self-start">Contact us</Button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
