"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  faqs,
  founders,
  nav,
  projectTiers,
  projectTiersShared,
  retainerTiers,
  site,
  type Tier,
} from "@/lib/content";
import { cn } from "@/lib/utils";
import { VelocityMarquee } from "@/components/kit/velocity-marquee";

/*
 * NOCTA-DIRECTION CONCEPTS (Brad, 2026-09-26: "I love their flexible plans
 * system", their FAQ and their footer). Layout and interaction studied from
 * nocta.framer.website — hairline-framed panels, corner brackets, the
 * striped label, ⊕ ticks, a per-card add-on switch — set in this site's
 * black, silver, Archivo and Geist. No asset, code or copy taken; every
 * string below is Black Line's own, read from content.ts.
 */

const fmt = new Intl.NumberFormat("en-GB");

/** Four hairline corner marks around a box — Nocta's signature frame. */
export function Brackets({ className }: { className?: string }) {
  const c = "pointer-events-none absolute h-2 w-2 border-ink-600";
  // `contents`: the wrapper must not take a grid cell of its own (it did,
  // and pushed the fourth plan onto a second row).
  return (
    <span aria-hidden="true" className={cn("contents", className)}>
      <span className={cn(c, "-left-px -top-px border-l border-t")} />
      <span className={cn(c, "-right-px -top-px border-r border-t")} />
      <span className={cn(c, "-bottom-px -left-px border-b border-l")} />
      <span className={cn(c, "-bottom-px -right-px border-b border-r")} />
    </span>
  );
}

/** The striped label: "||||||| PRICING". */
export function StripeLabel({ children }: { children: ReactNode }) {
  return (
    <p className="relative inline-flex items-center gap-3 border border-ink-300 bg-ink-50 px-3.5 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-1000">
      <Brackets />
      <span aria-hidden="true" className="flex gap-[2px]">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={cn("h-3 w-[2px]", i < 6 ? "bg-ink-1000" : "bg-ink-500")} />
        ))}
      </span>
      {children}
    </p>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("h-[18px] w-[18px] shrink-0", className)} fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 6.5v7M6.5 10h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BracketButton({ href, children, strong }: { href: string; children: ReactNode; strong?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex min-h-12 items-center justify-center border border-ink-300 text-[0.9375rem] text-ink-1000 transition-colors duration-300 hover:bg-ink-200",
        strong ? "bg-ink-200" : "bg-transparent",
      )}
    >
      <Brackets />
      {children}
    </Link>
  );
}

/* ================================================================== */
/* PRICING E — "flexible plans"                                        */
/* ================================================================== */

/*
 * THE ADD-ON SWITCH, made honest. Nocta's "Add development" changes what
 * the plan is. Ours adds the Care plan — a real monthly plan with its own
 * price in `retainerTiers` — and shows it as a SEPARATE "+ £200/month"
 * line under the build price, never summed into it. A build is one-off; a
 * plan is monthly; adding them into one figure would misstate both.
 */
const care = retainerTiers.find((r) => r.id === "care") ?? retainerTiers[0];

function PlanCard({ t }: { t: Tier }) {
  const [on, setOn] = useState(false);
  const id = useId();
  const [first, ...rest] = t.includes;
  const inherits = first?.startsWith("Everything in ") ? first : null;
  const items = inherits ? rest : t.includes;
  const featured = Boolean(t.featured);

  return (
    <article
      aria-label={t.name}
      className={cn(
        "relative flex flex-col p-7 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:p-8",
        "lg:row-span-6",
        featured && "bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015))]",
      )}
    >
      {/* 1 — name, audience, (badge) */}
      <header>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.375rem] font-medium uppercase tracking-[-0.02em] text-ink-1000">{t.name}</h3>
          {featured ? (
            <span className="relative shrink-0 border border-ink-400 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink-1000">
              <Brackets />
              Recommended
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-ink-600">{t.meta}</p>
      </header>

      {/* 2 — price + delivery (+ the add-on line when switched on) */}
      <div className="mt-8">
        <p className="flex items-baseline gap-1.5 text-ink-1000">
          <span className="text-sm text-ink-600">from</span>
          <span className="text-[2.75rem] font-medium leading-none tracking-[-0.05em] tabular-nums">
            {site.currencySymbol}
            {fmt.format(t.price)}
          </span>
          <span className="text-sm text-ink-700">/per project</span>
        </p>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">{t.delivery}</p>
        <p
          aria-live="polite"
          className={cn(
            "overflow-hidden text-[0.8125rem] text-ink-900 transition-all duration-500",
            on ? "mt-3 max-h-16 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          {on ? (
            <>
              + {site.currencySymbol}
              {fmt.format(care.price)}/month · {care.name} plan — {care.summary.toLowerCase()}
            </>
          ) : null}
        </p>
      </div>

      {/* 3 — summary */}
      <p className="mt-6 text-sm leading-relaxed text-ink-700">{t.summary}</p>

      {/* 4 — the switch */}
      <div className="relative mt-7 flex min-h-12 items-center justify-between border border-ink-300 px-4">
        <Brackets />
        <label htmlFor={id} className="text-[0.9375rem] text-ink-900">
          Add a monthly {care.name} plan
        </label>
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn((v) => !v)}
          className="relative flex h-11 w-11 items-center justify-center"
        >
          <span className="relative flex h-6 w-6 items-center justify-center border border-ink-500">
            <span className={cn("h-3.5 w-3.5 transition-colors", on ? "bg-ink-1000" : "bg-ink-300")} />
          </span>
        </button>
      </div>

      {/* 5 — what's included */}
      <div className="mt-8">
        <p className="text-[0.9375rem] font-medium uppercase tracking-[-0.01em] text-ink-1000">
          {inherits ? `${inherits}, plus` : "What's included"}
        </p>
        <ul className="mt-4 grid gap-3">
          {items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-[0.9375rem] leading-snug text-ink-900">
              <Plus className="mt-px text-ink-700" />
              {it}
            </li>
          ))}
        </ul>
      </div>

      {/* 6 — action */}
      <div className="mt-8 self-end">
        <BracketButton href="/#contact" strong={featured}>
          Start a project<span className="sr-only"> — {t.name}</span>
        </BracketButton>
      </div>
    </article>
  );
}

export function PricingE() {
  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StripeLabel>Pricing</StripeLabel>
          <h3 className="display mt-5 text-[clamp(2.75rem,6vw,5rem)] leading-[0.88] text-ink-1000">Priced openly.</h3>
        </div>
        <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-700">
          Fixed-price builds, agreed in writing before anything starts.
          Monthly plans and AI systems are on the pricing page.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-y border-ink-300 py-5 lg:flex-row lg:items-center lg:gap-10">
        <p className="shrink-0 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-600">Every build includes</p>
        <ul className="flex flex-col gap-2.5 lg:grid lg:flex-1 lg:grid-cols-3 lg:gap-x-8">
          {projectTiersShared.map((i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-ink-900">
              <Plus className="text-ink-700" />
              {i}
            </li>
          ))}
        </ul>
        <p className="shrink-0 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-ink-600 lg:ml-auto">
          {site.currencySymbol} GBP — no VAT charged
        </p>
      </div>

      <div className="relative mt-10 grid border border-ink-300 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(6,auto)] [&>article+article]:border-t [&>article+article]:border-ink-300 md:[&>article:nth-child(even)]:border-l lg:[&>article+article]:border-l lg:[&>article+article]:border-t-0">
        <Brackets />
        {projectTiers.map((t) => (
          <PlanCard key={t.id} t={t} />
        ))}
      </div>

      <p className="mt-10 max-w-[64ch] text-sm leading-relaxed text-ink-600">
        50% on commissioning, 50% on launch. Where a tier includes AI Text
        Chatbot setup, the chatbot&rsquo;s monthly fee still applies — it is
        listed with the monthly plans on the pricing page.
      </p>
      <Link href="/pricing" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.04em] text-ink-1000 underline-offset-4 hover:underline">
        Monthly plans &amp; AI systems ↗
      </Link>
    </div>
  );
}

/* ================================================================== */
/* FAQ C — tabs + framed accordion                                     */
/* ================================================================== */
const TABS: { label: string; metas: string[] }[] = [
  { label: "Projects", metas: ["Pricing", "Timeline", "Process", "Ownership", "Edits", "Guarantee", "Creative"] },
  { label: "Working together", metas: ["Retainers", "Payment", "Hosting", "AI systems", "AI voice", "AI search", "Local"] },
];

export function FaqC() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(0);
  const base = useId();
  const items = faqs.filter((f) => TABS[tab].metas.includes(f.meta));

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <StripeLabel>FAQs</StripeLabel>
        <h3 className="display mt-5 text-[clamp(2.75rem,6vw,5rem)] leading-[0.88] text-ink-1000">FAQs</h3>
        <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-700">
          Answers to what people ask before they commit — how we work, what it
          costs and how long it takes.
        </p>
      </div>
      <div>
        <div role="tablist" aria-label="Question groups" className="grid grid-cols-2 gap-2">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              type="button"
              aria-selected={tab === i}
              onClick={() => {
                setTab(i);
                setOpen(0);
              }}
              className={cn(
                "relative min-h-11 border text-[0.8125rem] font-semibold uppercase tracking-[0.04em] transition-colors",
                tab === i ? "border-ink-1000 bg-ink-1000 text-ink-0" : "border-ink-300 text-ink-900 hover:border-ink-600",
              )}
            >
              {tab !== i ? <Brackets /> : null}
              {t.label}
            </button>
          ))}
        </div>
        <ul role="tabpanel" aria-label={TABS[tab].label} className="relative mt-2 border border-ink-300">
          <Brackets />
          {items.map((f, i) => {
            const isOpen = open === i;
            const panel = `${base}-${tab}-${i}`;
            return (
              <li key={f.q} className={cn(i > 0 && "border-t border-ink-300")}>
                <h4>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex min-h-11 w-full items-center justify-between gap-6 px-6 py-6 text-left"
                  >
                    <span className="text-[1rem] font-medium uppercase tracking-[-0.01em] text-ink-1000">{f.q}</span>
                    <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 bg-ink-1000" />
                      <span className={cn("absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 bg-ink-1000 transition-transform duration-300", isOpen && "scale-y-0")} />
                    </span>
                  </button>
                </h4>
                <div
                  id={panel}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-7 text-[0.9375rem] leading-relaxed text-ink-700">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ================================================================== */
/* FOOTER D — Nocta layout                                             */
/* ================================================================== */
export function FooterD() {
  const col = "text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600";
  const link = "text-[0.9375rem] font-medium uppercase tracking-[-0.01em] text-ink-1000 hover:underline underline-offset-4";
  return (
    <footer className="@container overflow-hidden border border-ink-300 bg-ink-0">
      {/* START A PROJECT — one link; the moving ribbon inside is decoration. */}
      <Link href="/#contact" aria-label="Start a project — go to the enquiry form" className="group block border-b border-ink-300 py-6">
        <div aria-hidden="true">
          <VelocityMarquee speed={0.9}>
            <span className="inline-flex items-center gap-10 px-10 text-[clamp(3rem,6.5vw,6rem)] font-medium uppercase leading-none tracking-[-0.05em] text-ink-1000">
              Start a project
              <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
            </span>
          </VelocityMarquee>
        </div>
      </Link>

      <div className="grid gap-14 px-8 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <p className={col}>Subscribe to our newsletter.</p>
          {/* Concept only — the real form posts to /api/newsletter with a
              consent line; nothing is sent from this preview. */}
          <form className="relative mt-4 flex max-w-[22rem] border border-ink-300" onSubmit={(e) => e.preventDefault()}>
            <Brackets />
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" type="email" placeholder="Your email" className="min-h-12 flex-1 bg-transparent px-4 text-[0.9375rem] text-ink-1000 placeholder:text-ink-600 focus:outline-none" />
            <button type="submit" aria-label="Subscribe" className="relative m-1.5 flex w-11 items-center justify-center border border-ink-300 text-ink-1000">
              <Brackets />↗
            </button>
          </form>
          <p className="mt-3 max-w-[22rem] text-xs leading-relaxed text-ink-600">
            Occasional notes from the studio. Unsubscribe any time.
          </p>
        </div>
        <div>
          <p className={col}>/Navigation/</p>
          <ul className="mt-4 grid gap-2">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className={link}>{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className={col}>/Resources/</p>
          <ul className="mt-4 grid gap-2">
            <li><Link href="/web-design-grimsby" className={link}>Web design in Grimsby</Link></li>
            <li><Link href="/legal/privacy" className={link}>Privacy policy</Link></li>
            <li><Link href="/legal/terms" className={link}>Terms</Link></li>
          </ul>
        </div>
        <div>
          <p className={col}>/Contact/</p>
          <ul className="mt-4 grid gap-2">
            <li><a href={`mailto:${site.email}`} className="text-[0.9375rem] text-ink-1000 underline-offset-4 hover:underline">{site.email}</a></li>
            <li><a href={site.phoneHref} className="text-[0.9375rem] text-ink-1000 underline-offset-4 hover:underline">{site.phone}</a></li>
          </ul>
        </div>
      </div>

      {/* The name, ONE line, spanning the footer's own width. */}
      <p aria-hidden="true" className="select-none whitespace-nowrap border-t border-ink-300 px-6 pt-6 text-center text-[10.4cqw] font-medium uppercase leading-[0.9] tracking-[-0.06em] text-ink-400">
        Black Line Agency
      </p>

      <div className="flex flex-col gap-2 border-t border-ink-300 px-8 py-5 text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-ink-600 sm:flex-row sm:justify-between lg:px-12">
        <p>&copy; {new Date().getFullYear()} {site.name}. Humberston, Grimsby, Lincolnshire. All rights reserved.</p>
        <p>Built in-house by {founders.map((f) => f.name).join(" & ")}</p>
      </div>
    </footer>
  );
}
