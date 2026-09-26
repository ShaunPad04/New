import Link from "next/link";
import { founders, nav, services, site } from "@/lib/content";
import { Monogram } from "./monogram";

/*
 * Two footer concepts. Everything the current footer carries is kept: the
 * "Ready to begin?" invitation and its founders line, Book a call, the email
 * and phone, every route, the Grimsby page, Privacy and Terms, the
 * copyright line with the town, and the "Built in-house by" credit.
 */
const routes = [
  ...nav,
  { label: "Web design in Grimsby", href: "/web-design-grimsby" },
] as const;
const legal = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
] as const;
const credit = `Built in-house by ${founders.map((f) => f.name).join(" & ")}`;
const copyright = `© ${new Date().getFullYear()} ${site.name}. Humberston, Grimsby, Lincolnshire. All rights reserved.`;

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-ink-600">{title}</p>
      <ul className="mt-5 grid gap-2.5">{children}</ul>
    </div>
  );
}
const link = "text-[0.9375rem] text-ink-900 transition-colors hover:text-ink-1000 hover:underline underline-offset-4";

/* A — THE SIGNATURE. Invitation and columns up top; the name runs the full
   width of the page at the foot, cropped by the edge — the Framer-studio
   closing move, in the brand's own Archivo caps. */
export function FooterA() {
  return (
    <footer className="overflow-hidden rounded-2xl bg-ink-50 pt-16">
      <div className="grid gap-14 px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-12">
        <div>
          <p className="display text-[clamp(2.25rem,4vw,3.5rem)] leading-[0.9] text-ink-1000">Ready to begin?</p>
          <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-ink-700">
            {founders.map((f) => f.name).join(" and ")} answer their own enquiries.
            Tell us what you are building and you will hear back from the people
            who would build it.
          </p>
          <Link href="/#contact" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-ink-1000 px-7 text-sm font-medium text-ink-0">
            Book a call
          </Link>
        </div>
        <Col title="Studio">
          {routes.map((r) => (
            <li key={r.href}><Link href={r.href} className={link}>{r.label}</Link></li>
          ))}
        </Col>
        <Col title="Services">
          {services.map((s) => (
            <li key={s.id}><Link href={`/services/${s.page}`} className={link}>{s.title}</Link></li>
          ))}
        </Col>
        <Col title="Contact">
          <li><a href={`mailto:${site.email}`} className={link}>{site.email}</a></li>
          <li><a href={site.phoneHref} className={link}>{site.phone}</a></li>
          {legal.map((l) => (
            <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
          ))}
        </Col>
      </div>
      <div className="mt-16 flex flex-col gap-3 border-t border-ink-300 px-8 py-5 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-600 sm:flex-row sm:justify-between lg:px-12">
        <p>{copyright}</p>
        <p>{credit}</p>
      </div>
      <p aria-hidden="true" className="display-xl -mb-[0.2em] select-none whitespace-nowrap px-4 text-[17.5vw] leading-[0.8] text-ink-200">
        Black Line
      </p>
    </footer>
  );
}

/* B — THE PLATE. Lurais's black footer bar, organised around the silver
   monogram: one huge email line as the call to action, then a single row
   of routes, then the legal line. Quieter, and very fast to scan. */
export function FooterB() {
  return (
    <footer className="rounded-2xl bg-ink-50 px-8 py-14 lg:px-12">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Monogram id="ftr-b" className="h-14 w-14" />
          <p className="mt-8 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-ink-600">Ready to begin?</p>
          <a href={`mailto:${site.email}`} className="display mt-3 block break-all text-[clamp(1.5rem,3vw,3rem)] leading-none text-ink-1000 underline-offset-8 hover:underline">
            {site.email}
          </a>
          <p className="mt-4 text-sm text-ink-700">
            or call <a href={site.phoneHref} className="text-ink-1000 underline underline-offset-4">{site.phone}</a> — {founders.map((f) => f.name.split(" ")[0]).join(" and ")} answer their own enquiries.
          </p>
        </div>
        <Link href="/#contact" className="inline-flex min-h-12 shrink-0 items-center self-start rounded-full bg-ink-1000 px-7 text-sm font-medium text-ink-0 lg:self-end">
          Book a call ↗
        </Link>
      </div>
      <nav className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-300 pt-6">
        {[...routes, ...legal].map((r) => (
          <Link key={r.href} href={r.href} className="text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-ink-800 hover:text-ink-1000">
            {r.label}
          </Link>
        ))}
      </nav>
      <div className="mt-10 flex flex-col gap-2 text-[0.6875rem] uppercase tracking-[0.14em] text-ink-600 sm:flex-row sm:justify-between">
        <p>{copyright}</p>
        <p>{credit}</p>
      </div>
    </footer>
  );
}
