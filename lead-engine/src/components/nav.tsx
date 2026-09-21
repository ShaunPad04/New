"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/ui";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/discovery", label: "Discovery" },
  { href: "/handoff", label: "Handoff" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
] as const;

/**
 * A floating island detached from the top edge, per the house design standard —
 * never an edge-to-edge bar glued to the viewport.
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 px-4 pt-5 sm:px-6">
      <nav className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 rounded-full border border-ink-1000/10 bg-ink-100/70 py-2 pl-5 pr-2 backdrop-blur-xl">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.34em] text-ink-800">BlackLine</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink-600 sm:inline">
            Lead Engine
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={{ pathname: link.href }}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  isActive(link.href)
                    ? "bg-ink-1000/10 text-ink-1000"
                    : "text-ink-700 hover:text-ink-900",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="rounded-full border border-ink-1000/10 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-800 md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>

        <span className="hidden rounded-full border border-ink-1000/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-600 md:inline">
          Cambridge Mews
        </span>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-0 z-40 flex flex-col justify-center gap-2 bg-ink-0/90 px-8 backdrop-blur-3xl md:hidden"
        >
          {LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={{ pathname: link.href }}
              onClick={() => setOpen(false)}
              style={{ animationDelay: `${index * 45}ms` }}
              className="reveal border-b border-ink-1000/5 py-4 text-2xl font-medium tracking-tight text-ink-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
