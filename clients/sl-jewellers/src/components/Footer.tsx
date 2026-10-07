import Link from "next/link";
import { BUSINESS, HOURS_ON } from "@/lib/content";
import Logo from "./Logo";
import LocalTime from "./LocalTime";
import OpenNowChip from "./OpenNowChip";
import { ICONS } from "./SocialLinks";
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
// option B's index: the pages people come back for, set large
const INDEX = [
  { href: "/pieces", label: "Shop all" },
  { href: "/pieces/watches", label: "Watches" },
  { href: "/gold-prices", label: "Gold prices" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About us" },
  { href: "/enquiry", label: "Enquire" },
];

const Arrow = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** The company name, number and registered office stay in every option: a UK company's
 *  website has to show them. */
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

function Address() {
  return (
    <>
      {b.address.street}, {b.address.town} {b.address.postcode}
      <br />
      <a href={`tel:${b.phone.e164}`} className="tnum">
        {b.phone.display}
      </a>
    </>
  );
}

/**
 * The footer, three typographic ways (round 8 on the switch, ?v=foot:a|b|c), after the
 * typographic styles Shaun pointed to on footer.design:
 *   A  Wordmark: link columns, then "S&L Jewellers" set the full width of the page (Linear,
 *      Kosbiotic, Eleos).
 *   B  Index: a line about the shop beside the pages people come back for set large, numbered
 *      socials and the time in Cleethorpes (WRK Timepieces, Monolog).
 *   C  Centred name: the name huge and centred, one line on how to reach the shop, the links
 *      in a single row (Artist Corporations).
 */
export default function Footer() {
  return (
    <>
      <div data-x="foot" data-x-dir="a">
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
                    <Address />
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
            <Legal className="fta-legal" />
          </div>
        </footer>
      </div>

      <div data-x="foot" data-x-dir="b">
        <footer className="ftb">
          <div className="wrap ftb-in">
            <div className="ftb-left">
              <Link href="/" aria-label="S&L Jewellers, home" className="ftb-logo">
                <Logo variant="stacked" className="w-[64px]" />
              </Link>
              <p className="ftb-state">
                Weighed and priced <span className="text-gold">in front of you.</span>
              </p>
              <p className="ftb-addr">
                <Address />
              </p>
              <ul className="ftb-soc">
                {SOCIALS.map((s, i) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener" aria-label={s.aria}>
                      <span className="tnum">0{i + 1}</span>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <nav aria-label="Footer" className="ftb-index">
              <ul>
                {INDEX.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>
                      <span>{l.label}</span>
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="wrap">
          <div className="ftb-bar">
            <p>
              Cleethorpes <LocalTime />
            </p>
            {HOURS_ON && <OpenNowChip className="ftb-chip" />}
            <a href="#main" className="ftb-top">
              Back to top <span aria-hidden="true">↑</span>
            </a>
          </div>
          </div>
          <div className="wrap">
            <Legal className="ftb-legal" />
          </div>
        </footer>
      </div>

      <div data-x="foot" data-x-dir="c">
        <footer className="ftc">
          <div className="wrap ftc-in">
            <p className="ftc-name" aria-hidden="true">
              S<span className="text-gold">&amp;</span>L
              <br />
              Jewellers
            </p>
            <p className="ftc-line">
              For buying, selling, repairs and everything else, <Link href="/enquiry">get in touch</Link> or come and see us.
            </p>
            <nav aria-label="Footer">
              <ul className="ftc-links">
                {[...SHOP.slice(0, 1), ...SHOPS].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="ftc-addr">
              {b.address.street}, {b.address.town} {b.address.postcode} ·{" "}
              <a href={`tel:${b.phone.e164}`} className="tnum">
                {b.phone.display}
              </a>
            </p>
            <ul className="ficons ftc-icons" aria-label="S&L Jewellers on social media">
              {SOCIALS.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener" aria-label={s.aria}>
                    {ICONS[s.key]}
                  </a>
                </li>
              ))}
            </ul>
            <Legal className="ftc-legal" />
          </div>
        </footer>
      </div>
    </>
  );
}
