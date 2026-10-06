import Link from "next/link";
import { BUSINESS, hasTimes } from "@/lib/content";
import { DAYS } from "@/lib/hours";
import { ICONS } from "@/components/SocialLinks";
import MenuController from "./MenuController";
import MenuHoverImage from "./MenuHoverImage";
import { CATEGORIES } from "./menu-data";

const b = BUSINESS;

/** Every entry, with the photo it shows on hover: S&L's own pieces, shop and posts. */
const ITEMS = [
  ...CATEGORIES.filter((c) => c.count && c.piece).map((c) => ({ href: c.href, label: c.title, image: c.piece!.image })),
  { href: "/services", label: "Services", image: "/images/services/exchange.2026-10-06-2.webp" },
  { href: "/gold-prices", label: "Gold prices", image: "/images/pieces/bullion/40-c79c9287.jpg" },
  { href: "/about", label: "About", image: "/reels/reel-00.webp" },
  { href: "/#visit", label: "Visit us", image: "/images/shop-interior.jpg" },
  { href: "/faq", label: "FAQ", image: "/images/services/sourcing.2026-10-06-2.webp" },
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
 * Full screen and centred (Shaun, 6 Oct 2026, after a reference he sent): every page as one
 * large word, stacked in the middle; on a mouse, the word under the pointer brings up its
 * own photo beside the pointer and the others dim. Under a hairline: the address, the hours
 * and the three social icons, bare. The header stays above it with the close button.
 */
function MenuCentred() {
  return (
    <div className="menu-b mc" data-menu-panel data-menu-surface data-menu-trap data-lenis-prevent>
      <div className="wrap mc-in">
        <nav aria-label="Menu" className="mc-nav">
          <ul>
            {ITEMS.map((it, i) => (
              <li key={it.href} style={{ ["--i" as string]: i }}>
                <Link href={it.href} className="mc-link" data-menu-img={i} data-menu-first={i === 0 || undefined}>
                  {it.label}
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
          <a href={`tel:${b.phone.e164}`} className="mc-phone tnum">
            {b.phone.display}
          </a>
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
