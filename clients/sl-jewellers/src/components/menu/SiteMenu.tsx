import Link from "next/link";
import { BUSINESS, hasTimes } from "@/lib/content";
import { DAYS } from "@/lib/hours";
import { ICONS } from "@/components/SocialLinks";
import Logo from "@/components/Logo";
import MenuController from "./MenuController";
import MenuDial, { type MenuItem } from "./MenuDial";
import { CATEGORIES } from "./menu-data";

const b = BUSINESS;
const piece = (slug: string) => CATEGORIES.find((c) => c.href === `/pieces/${slug}`)?.piece?.image ?? "/images/hero/rings-first-port-1080.webp";
const inCase = CATEGORIES.reduce((n, c) => n + c.count, 0);
const watches = CATEGORIES.find((c) => c.href === "/pieces/watches")?.count ?? 0;

/** Six entries (Shaun, 6 Oct 2026: "Visit us" went, it was About again), each with a line and
 *  the photo it shows: S&L's own pieces, the shop itself, and two staged stills for FAQ and Contact. */
const ITEMS: MenuItem[] = [
  { href: "/pieces", label: "Shop all", desc: `${inCase} pieces in the case`, image: piece("bracelets") },
  { href: "/pieces/watches", label: "Watches", desc: `${watches} pre-owned watches`, image: piece("watches") },
  { href: "/services", label: "Services", desc: "Sell, swap, source, repair", image: "/images/menu/services.2026-10-07.webp" },
  { href: "/about", label: "About", desc: "The shop on Cambridge Street", image: "/images/shop-interior.2026-10-06.webp" },
  { href: "/faq", label: "FAQ", desc: "Straight answers", image: "/images/menu/faq.webp" },
  { href: "/enquiry", label: "Contact", desc: "Ask about a piece", image: "/images/menu/contact.webp" },
];

/** The week in one line, from content/business.json: "Monday to Saturday, 10:00 – 16:00. Sunday by appointment." */
function hoursLine() {
  const w = b.hours.week;
  const six = DAYS.slice(0, 6).map((d) => w[d]);
  const first = six[0];
  const sun = w.sunday;
  const sunday = hasTimes(sun) ? `Sunday ${sun.open} – ${sun.close}.` : sun ? "Sunday by appointment." : "Closed Sunday.";
  if (hasTimes(first) && six.every((h) => hasTimes(h) && h.open === first.open && h.close === first.close)) return `Monday to Saturday, ${first.open} – ${first.close}. ${sunday}`;
  return "Opening hours: see the About page.";
}

const SOCIALS = [
  { key: "instagram", href: b.social.instagram.url, aria: `S&L Jewellers on Instagram, @${b.social.instagram.handle}` },
  { key: "facebook", href: b.social.facebook.url, aria: "S&L Jewellers on Facebook" },
  { key: "tiktok", href: b.social.tiktok.url, aria: `S&L Jewellers on TikTok, @${b.social.tiktok.handle}` },
] as const;

const Foot = () => (
  <div className="wrap mfoot">
    <address className="not-italic">
      {b.address.street}, {b.address.town} {b.address.postcode}
    </address>
    <p>{hoursLine()}</p>
    <ul className="ficons" aria-label="S&L Jewellers on social media">
      {SOCIALS.map((s) => (
        <li key={s.key}>
          <a href={s.href} target="_blank" rel="noopener" aria-label={s.aria}>
            {ICONS[s.key]}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * The site menu (6 Oct 2026). A black curtain that drops from the top and covers everything,
 * header included, with its own bar: the stacked logo in the middle and a close button on the
 * right. Inside, the dial (MenuDial.tsx: the items round a watch dial, a gold hand pointing), and a
 * foot with the address, the hours and the three social icons. Opened by the header's button
 * (state on <html data-menu-open>, see menu-state.ts); MenuController handles focus and keys.
 */
export default function SiteMenu() {
  return (
    <div id="site-menu">
      <div className="menu-b" role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} data-menu-panel data-menu-surface data-menu-trap data-lenis-prevent>
        <div className="wrap mc-top">
          <span aria-hidden="true" />
          <Link href="/" className="mc-logo" aria-label="S&L Jewellers, home">
            <Logo variant="stacked" className="mc-logo-img" />
          </Link>
          <button type="button" className="mc-close" data-menu-close aria-label="Close the menu">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <MenuDial items={ITEMS} foot={<Foot />} />
      </div>
      <MenuController />
    </div>
  );
}
