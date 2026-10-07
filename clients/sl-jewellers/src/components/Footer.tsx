import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import { CATEGORIES } from "./menu/menu-data";

const b = BUSINESS;
const SHOP = [{ href: "/pieces", label: "Shop all" }, ...CATEGORIES.filter((c) => c.count).map((c) => ({ href: c.href, label: c.title }))];
const SHOPS = [
  { href: "/services", label: "Services" },
  { href: "/gold-prices", label: "Gold prices" },
  { href: "/about", label: "About us" },
  { href: "/faq", label: "FAQ" },
  { href: "/enquiry", label: "Make an enquiry" },
  { href: "/privacy", label: "Privacy policy" },
];
const SOCIALS = [
  { key: "instagram", label: "Instagram", href: b.social.instagram.url, aria: `S&L Jewellers on Instagram, @${b.social.instagram.handle}` },
  { key: "facebook", label: "Facebook", href: b.social.facebook.url, aria: "S&L Jewellers on Facebook" },
  { key: "tiktok", label: "TikTok", href: b.social.tiktok.url, aria: `S&L Jewellers on TikTok, @${b.social.tiktok.handle}` },
] as const;

/**
 * The footer, "Wordmark" (Shaun's pick A of three in round 8, 7 Oct 2026, after footer.design's
 * typographic styles: Linear, Kosbiotic, Eleos): a line about the shop and three link columns,
 * then "S&L Jewellers" set the full width of the page, then the legal lines. Black and white;
 * gold only in the display type. The company name, number and registered office stay: a UK
 * company's website has to show them.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="fta">
      <div className="wrap">
        <div className="fta-top">
          <p className="fta-line">
            Gold, watches and bullion, <span className="text-gold">bought and sold over the counter.</span>
          </p>
          <div className="fta-cols">
            <nav aria-label="Shop">
              <p className="fta-h">Shop</p>
              <ul>
                {SHOP.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="The shop">
              <p className="fta-h">The shop</p>
              <ul>
                {SHOPS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="fta-h">Visit</p>
              <p className="fta-addr">
                {b.address.street}, {b.address.town} {b.address.postcode}
                <br />
                <a href={`tel:${b.phone.e164}`} className="tnum">
                  {b.phone.display}
                </a>
              </p>
              <ul className="fta-soc">
                {SOCIALS.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener" aria-label={s.aria}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="fta-word" aria-hidden="true">
        S<span className="text-gold">&amp;</span>L Jewellers
      </p>
      <div className="wrap">
        <div className="flegal fta-legal">
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
