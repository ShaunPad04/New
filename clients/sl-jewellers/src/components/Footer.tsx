import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "./Logo";
import { ICONS } from "./SocialLinks";
import { CATEGORIES } from "./menu/menu-data";

const b = BUSINESS;
const LINKS = [
  ...CATEGORIES.filter((c) => c.count).map((c) => ({ href: c.href, label: c.title })),
  { href: "/services", label: "Services" },
  { href: "/gold-prices", label: "Gold prices" },
  { href: "/about", label: "About us" },
  { href: "/faq", label: "FAQ" },
  { href: "/enquiry", label: "Make an enquiry" },
  { href: "/privacy", label: "Privacy policy" },
];
const SOCIALS = [
  { key: "instagram", href: b.social.instagram.url, aria: `S&L Jewellers on Instagram, @${b.social.instagram.handle}` },
  { key: "facebook", href: b.social.facebook.url, aria: "S&L Jewellers on Facebook" },
  { key: "tiktok", href: b.social.tiktok.url, aria: `S&L Jewellers on TikTok, @${b.social.tiktok.handle}` },
] as const;

/**
 * Quiet and centred (Shaun's pick, round 4 of the walk-through, 6 Oct 2026): S&L's own
 * stacked logo, small, one line of links, the three social icons bare (no box or ring:
 * the framed ones "looked cheap"), the address and phone, then the legal lines. Archivo
 * throughout. The company name, number and registered office stay: a UK company's
 * website has to show them.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="fmin">
      <div className="wrap fmin-in">
        <Link href="/" aria-label="S&L Jewellers, home" className="fmin-logo">
          <Logo variant="stacked" className="w-[76px]" />
        </Link>
        <nav aria-label="Footer">
          <ul className="fmin-links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flink">
                  <span>{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="ficons" aria-label="S&L Jewellers on social media">
          {SOCIALS.map((s) => (
            <li key={s.key}>
              <a href={s.href} target="_blank" rel="noopener" aria-label={s.aria}>
                {ICONS[s.key]}
              </a>
            </li>
          ))}
        </ul>
        <p className="fmin-addr">
          {b.address.street}, {b.address.town} {b.address.postcode} ·{" "}
          <a href={`tel:${b.phone.e164}`} className="tnum">
            {b.phone.display}
          </a>
        </p>
        <div className="flegal fmin-legal">
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
      </div>
    </footer>
  );
}
