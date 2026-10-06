import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "@/components/Logo";
import { ICONS } from "@/components/SocialLinks";
import { CATEGORIES } from "@/components/menu/menu-data";
import FooterBeam from "./FooterBeam";

/**
 * Round 4, footer: three layouts over the same facts. Every option has a small logo,
 * Archivo throughout (semi-expanded uppercase labels, like the header), and the three
 * social icons bare, with no box or ring round them (Shaun, 6 Oct 2026: the framed ones
 * "looked cheap"). The company name, number and registered office stay on every option:
 * a UK company's website has to show them.
 */
const b = BUSINESS;
const SHOP = [...CATEGORIES.map((c) => ({ href: c.href, label: c.title })), { href: "/pieces", label: "All pieces" }];
const PAGES = [
  { href: "/services", label: "Services" },
  { href: "/gold-prices", label: "Gold prices" },
  { href: "/about", label: "About us" },
  { href: "/faq", label: "FAQ" },
  { href: "/enquiry", label: "Make an enquiry" },
  { href: "/privacy", label: "Privacy policy" },
];
const SOCIALS = [
  { key: "instagram", href: b.social.instagram.url, aria: `Instagram, @${b.social.instagram.handle}` },
  { key: "facebook", href: b.social.facebook.url, aria: "Facebook" },
  { key: "tiktok", href: b.social.tiktok.url, aria: `TikTok, @${b.social.tiktok.handle}` },
] as const;

function Icons({ className = "" }: { className?: string }) {
  return (
    <ul className={`ficons ${className}`} aria-label="S&L Jewellers on social media">
      {SOCIALS.map((s) => (
        <li key={s.key}>
          <a href={s.href} target="_blank" rel="noopener" aria-label={s.aria}>
            {ICONS[s.key]}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Legal({ className = "" }: { className?: string }) {
  const year = new Date().getFullYear();
  return (
    <div className={`flegal ${className}`}>
      <p>
        © {year} {b.legalName}. Company no. {b.companyNumber}. Registered office: {b.registeredOffice}.
      </p>
      <p>
        {b.notAffiliated} Cookieless analytics only. Site by{" "}
        <a href="https://blacklineagency.co.uk" rel="noopener">
          Black Line Agency
        </a>
        .
      </p>
    </div>
  );
}

const Col = ({ title, links, className = "" }: { title: string; links: { href: string; label: string }[]; className?: string }) => (
  <nav className={`fcol ${className}`} aria-label={title}>
    <p className="flabel">{title}</p>
    <ul>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="flink">
            <span>{l.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const VisitCol = ({ className = "" }: { className?: string }) => (
  <div className={`fcol ${className}`}>
    <p className="flabel">Visit</p>
    <address className="faddr not-italic">
      {b.address.street}
      <br />
      {b.address.town} {b.address.postcode}
    </address>
    <ul>
      <li>
        <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="flink"><span>Get directions</span></a>
      </li>
      <li>
        <a href={`tel:${b.phone.e164}`} className="flink tnum"><span>{b.phone.display}</span></a>
      </li>
      <li>
        <a href={`mailto:${b.email}`} className="flink"><span>{b.email}</span></a>
      </li>
    </ul>
  </div>
);

/** A: the 21st beam footer (see FooterBeam). */
export function FooterA() {
  return (
    <FooterBeam
      word="S&L JEWELLERS"
      top={
        <>
          <Link href="/" aria-label="S&L Jewellers, home" className="inline-block">
            <Logo variant="horizontal" className="w-[132px]" />
          </Link>
          <p className="fline">{b.tagline}</p>
          <Icons className="mt-6" />
          <Legal className="mt-8" />
        </>
      }
      columns={
        <>
          <Col title="Shop" links={SHOP} className="bwf-fade" />
          <Col title="The shop" links={PAGES} className="bwf-fade" />
          <VisitCol className="bwf-fade" />
        </>
      }
    />
  );
}

/** B: an e-commerce close: an enquiry band, four columns, then the legal line. */
export function FooterB() {
  return (
    <footer className="fbig">
      <div className="wrap">
        <div className="fbig-band">
          <p className="fbig-title">
            Seen something?
            <br />
            <span className="text-gold">Ask about it.</span>
          </p>
          <div className="fbig-ctas">
            <Link href="/enquiry" className="plan-cta">
              <span>Make an enquiry</span>
              <span className="plan-disc" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </Link>
            <Link href="/services" className="flink fbig-alt"><span>Selling? Get a price →</span></Link>
          </div>
        </div>
        <div className="fbig-grid">
          <div className="fcol">
            <Link href="/" aria-label="S&L Jewellers, home" className="inline-block">
              <Logo variant="horizontal" className="w-[120px]" />
            </Link>
            <p className="fline">{b.tagline}</p>
            <Icons className="mt-5" />
          </div>
          <Col title="Shop" links={SHOP} />
          <Col title="The shop" links={PAGES} />
          <VisitCol />
        </div>
        <Legal className="fbig-legal" />
      </div>
    </footer>
  );
}

/** C: quiet and centred, the way watch houses close a page. */
export function FooterC() {
  return (
    <footer className="fmin">
      <div className="wrap fmin-in">
        <Link href="/" aria-label="S&L Jewellers, home">
          <Logo variant="mark" className="w-12" />
        </Link>
        <nav aria-label="Footer">
          <ul className="fmin-links">
            {[...SHOP.slice(0, 5), ...PAGES].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flink"><span>{l.label}</span></Link>
              </li>
            ))}
          </ul>
        </nav>
        <Icons />
        <p className="fmin-addr">
          {b.address.street}, {b.address.town} {b.address.postcode} ·{" "}
          <a href={`tel:${b.phone.e164}`} className="tnum">{b.phone.display}</a>
        </p>
        <Legal className="fmin-legal" />
      </div>
    </footer>
  );
}
