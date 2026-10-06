import Link from "next/link";
import Image from "next/image";
import { BUSINESS } from "@/lib/content";
import { FlipLink } from "@/components/ui/reveal-links";
import SocialLinks, { ICONS } from "@/components/SocialLinks";
import MenuController from "./MenuController";
import { CATEGORIES, SHOP_LINKS } from "./menu-data";

const b = BUSINESS;
const Phone = ({ className = "menu-contact tnum" }: { className?: string }) => (
  <a href={`tel:${b.phone.e164}`} className={className} aria-label={`Call S&L Jewellers on ${b.phone.display}`}>
    <span className="menu-contact-icon">{ICONS.phone}</span>
    {b.phone.display}
  </a>
);

/**
 * Full screen (Shaun's pick, round 1 of the walk-through): the categories as huge numbered
 * words with what is in the case, the photo following the word under the pointer or focus,
 * the shop's other pages beneath, and the phone, email, address and socials along the foot.
 */
function MenuEditorial() {
  const withPhoto = CATEGORIES.filter((c) => c.piece);
  return (
    <div className="menu-b" data-menu-panel data-menu-surface data-menu-trap data-lenis-prevent>
      <div className="wrap menu-b-grid">
        <nav aria-label="Shop by collection" className="menu-b-list">
          <p className="menu-b-eyebrow">Shop by collection</p>
          <ul>
            {CATEGORIES.map((c, i) => (
              <li key={c.href} style={{ ["--i" as string]: i }}>
                <Link href={c.href} className="menu-b-link" data-img-index={c.piece ? withPhoto.indexOf(c) : undefined} data-menu-first={i === 0 || undefined}>
                  <span className="menu-b-num tnum" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="menu-b-word">{c.title}</span>
                  <span className="menu-b-count tnum">{c.count ? `${c.count} in` : "Ask"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-b-figure" data-menu-figure aria-hidden="true">
          {withPhoto.map((c, i) => (
            <Image key={c.href} src={c.piece!.image} alt="" fill sizes="(min-width: 900px) 34vw, 1px" className={`menu-b-img${i === 0 ? " is-on" : ""}`} data-i={i} />
          ))}
        </div>
        <nav aria-label="The shop" className="menu-b-side">
          <p className="menu-b-eyebrow">The shop</p>
          <ul>
            {SHOP_LINKS.map((n, i) => (
              <li key={n.href} style={{ ["--i" as string]: i + CATEGORIES.length }}>
                <FlipLink href={n.href} className="menu-flip">
                  {n.label}
                </FlipLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-b-foot">
          <Phone />
          <a href={`mailto:${b.email}`} className="menu-contact menu-email">
            {b.email}
          </a>
          <span className="menu-b-addr">
            {b.address.street}, {b.address.town}
          </span>
          <SocialLinks variant="icons" className="menu-b-socials" />
        </div>
      </div>
    </div>
  );
}

/** The site menu, opened by the header's button (state on <html data-menu-open>, see menu-state.ts). */
export default function SiteMenu() {
  return (
    <div id="site-menu">
      <MenuEditorial />
      <MenuController />
    </div>
  );
}
