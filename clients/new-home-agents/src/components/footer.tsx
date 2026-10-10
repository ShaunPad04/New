import Image from "next/image";
import Link from "next/link";
import { affiliations, nav, policies, secondaryNav, site } from "@/lib/content";
import { Logo } from "@/components/logo";
import { SNAPSHOT_DATE } from "@/lib/properties";

/**
 * Footer — reference structure: a dark band with the brand column on the
 * left (logo, one-line intro, social), link columns and a contact column
 * with 28px icon circles on the right, a 1px 10%-white divider and a
 * copyright row with the policy links.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const snapshot = SNAPSHOT_DATE ? new Date(SNAPSHOT_DATE) : null;
  return (
    <footer className="bg-ink text-cloud">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <Logo tone="white" height={40} />
            <p className="max-w-[320px] text-sm leading-relaxed text-cloud/80">{site.description}</p>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors duration-500 hover:bg-white/20"
              aria-label="New Home Agents on Facebook"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.2H7.3V14h2.8v8h3.4z" /></svg>
            </a>
            <ul className="flex flex-wrap items-center gap-5 pt-2" aria-label="Memberships and portals">
              {affiliations.map((a) => (
                <li key={a.name}>
                  <span className="inline-flex h-10 items-center rounded-[8px] bg-white px-3"><Image src={a.src} alt={a.name} width={90} height={36} className="h-6 w-auto" /></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-5 text-base font-medium text-white">Explore</p>
              <ul className="flex flex-col gap-3">
                {nav.map((item) => (
                  <li key={item.href}><Link href={item.href} className="text-sm text-cloud/85 transition-colors duration-300 hover:text-white">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 text-base font-medium text-white">Services</p>
              <ul className="flex flex-col gap-3">
                {secondaryNav.map((item) => (
                  <li key={item.href}><Link href={item.href} className="text-sm text-cloud/85 transition-colors duration-300 hover:text-white">{item.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 text-base font-medium text-white">Contact</p>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <Dot><MailIcon /></Dot>
                  <a href={`mailto:${site.email}`} className="text-sm text-cloud/85 hover:text-white break-all">{site.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Dot><PhoneIcon /></Dot>
                  <a href={site.phoneHref} className="text-sm text-cloud/85 hover:text-white">{site.phone}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Dot><PinIcon /></Dot>
                  <address className="text-sm not-italic leading-relaxed text-cloud/85">
                    {site.headOffice.label}<br />
                    {site.headOffice.lines.join(", ")}
                  </address>
                </li>
                <li className="flex items-start gap-3">
                  <Dot><ClockIcon /></Dot>
                  <p className="text-sm text-cloud/85">{site.openingHours}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />

        <div className="mt-8 flex flex-col gap-4 text-sm text-line md:flex-row md:items-start md:justify-between">
          <div className="max-w-[640px] leading-relaxed">
            <p>© {year} {site.legalName}, trading as {site.name}. All rights reserved.</p>
            <p className="mt-1">
              Registered address: {site.registeredAddress}. Company number {site.companyNumber}. VAT number {site.vatNumber}.
            </p>
            {snapshot ? (
              <p className="mt-1">
                Property listings are a snapshot of newhomeagents.co.uk taken on {snapshot.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
              </p>
            ) : null}
            <p className="mt-3">
              Website by{" "}
              <a href="https://blacklineagency.co.uk" target="_blank" rel="noopener noreferrer" className="text-cloud/85 underline-offset-4 hover:text-white hover:underline">
                BlackLineAgency.co.uk
              </a>
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {policies.map((p) =>
              p.external ? (
                <li key={p.href}><a href={p.href} target="_blank" rel="noopener noreferrer" className="text-cloud/85 hover:text-white">{p.label} <span className="text-line">(PDF)</span></a></li>
              ) : (
                <li key={p.href}><Link href={p.href} className="text-cloud/85 hover:text-white">{p.label}</Link></li>
              )
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function Dot({ children }: { children: React.ReactNode }) {
  return <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cloud text-ink">{children}</span>;
}
function MailIcon() { return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>; }
function PhoneIcon() { return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>; }
function PinIcon() { return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>; }
function ClockIcon() { return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>; }
