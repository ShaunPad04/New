import Link from "next/link";
import { BUSINESS, hasTimes } from "@/lib/content";
import { DAYS } from "@/lib/hours";
import { ICONS } from "@/components/SocialLinks";
import { FlipRows } from "@/components/ui/reveal-links";
import Logo from "@/components/Logo";
import MenuController from "./MenuController";
import MenuHoverImage from "./MenuHoverImage";
import { CATEGORIES } from "./menu-data";

const b = BUSINESS;

/** Six entries (Shaun, 6 Oct 2026: "Visit us" went, it was About again), after Shaun's reference (6 Oct 2026: "too much on the menu"), each with the photo
 *  it shows on hover: S&L's own pieces, shop and posts. The categories are one click on, on /pieces
 *  and in the header bar; gold prices are in the footer and the homepage strip. */
const piece = (slug: string) => CATEGORIES.find((c) => c.href === `/pieces/${slug}`)?.piece?.image ?? "/images/shop-interior.jpg";
const ITEMS = [
  { href: "/pieces", label: "Shop all", image: piece("bracelets") },
  { href: "/pieces/watches", label: "Watches", image: piece("watches") },
  { href: "/services", label: "Services", image: "/images/services/exchange.2026-10-06-3.webp" },
  { href: "/about", label: "About", image: "/reels/reel-00.webp" },
  { href: "/faq", label: "FAQ", image: "/images/services/sourcing.2026-10-06-3.webp" },
  { href: "/enquiry", label: "Contact", image: "/images/ig-2026-09-24-post-DdrAi_MiAV7.jpg" },
];

/** The week in one line, from content/business.json: "Monday to Saturday, 10:00 – 16:00. Sunday by appointment." */
function hoursLine() {
  const w = b.hours.week;
  const six = DAYS.slice(0, 6).map((d) => w[d]);
  const first = six[0];
  const sun = w.sunday;
  const sunday = hasTimes(sun) ? `Sunday ${sun.open} – ${sun.close}.` : sun ? "Sunday by appointment." : "Closed Sunday.";
  if (hasTimes(first) && six.every((h) => hasTimes(h) && h.open === first.open && h.close === first.close)) return `Monday to Saturday, ${first.open} – ${first.close}. ${sunday}`;
  return "Opening hours: see Visit us.";
}

const SOCIALS = [
  { key: "instagram", href: b.social.instagram.url, aria: `S&L Jewellers on Instagram, @${b.social.instagram.handle}` },
  { key: "facebook", href: b.social.facebook.url, aria: "S&L Jewellers on Facebook" },
  { key: "tiktok", href: b.social.tiktok.url, aria: `S&L Jewellers on TikTok, @${b.social.tiktok.handle}` },
] as const;

/**
 * Full screen and centred (Shaun, 6 Oct 2026, after a reference he sent): the panel drops from
 * the top of the screen and covers everything, header included, with its own bar (the logo in
 * the middle, the close button on the right). Seven large words stacked in the middle; on a
 * mouse the word under the pointer rolls its letters over into gold, the others dim, and the
 * word's own photo slides in beside it on the right, tilted. Under a hairline: the address,
 * the hours and the three social icons, bare.
 */
function MenuCentred() {
  return (
    <div className="menu-b mc" role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1} data-menu-panel data-menu-surface data-menu-trap data-lenis-prevent>
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
      <div className="wrap mc-in">
        <nav aria-label="Menu" className="mc-nav">
          <ul>
            {ITEMS.map((it, i) => (
              <li key={it.href} style={{ ["--i" as string]: i }}>
                <Link href={it.href} className="mc-link" aria-label={it.label} data-menu-img={i} data-menu-first={i === 0 || undefined}>
                  <FlipRows text={it.label} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mc-foot">
          <address className="not-italic">
            {b.address.street}
            <br />
            {b.address.town}
            <br />
            {b.address.postcode}
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
      </div>
      <MenuHoverImage images={ITEMS.map((it) => it.image)} />
    </div>
  );
}

/** The site menu, opened by the header's button (state on <html data-menu-open>, see menu-state.ts). */
export default function SiteMenu() {
  return (
    <div id="site-menu">
      <MenuCentred />
      <MenuController />
    </div>
  );
}
