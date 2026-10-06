import Link from "next/link";
import Image from "next/image";
import { BUSINESS } from "@/lib/content";
import Logo from "@/components/Logo";
import { FlipLink } from "@/components/ui/reveal-links";
import SocialLinks, { ICONS } from "@/components/SocialLinks";
import MenuController from "./MenuController";
import { CARDS, CATEGORIES, COLLECTION_LINKS, SHOP_LINKS } from "./menu-data";

const b = BUSINESS;
const Phone = ({ className = "menu-contact tnum" }: { className?: string }) => (
  <a href={`tel:${b.phone.e164}`} className={className} aria-label={`Call S&L Jewellers on ${b.phone.display}`}>
    <span className="menu-contact-icon">{ICONS.phone}</span>
    {b.phone.display}
  </a>
);

/** A: the mega panel under the bar (after a watch house's; Shaun's reference, 6 Oct 2026). */
function MenuMega() {
  return (
    <div className="menu-a" data-menu-panel data-menu-surface data-lenis-prevent>
      <div className="wrap menu-grid">
        <nav aria-label="All sections" className="menu-cols">
          <div>
            <p className="menu-head">The collection</p>
            <ul>
              {COLLECTION_LINKS.map((n) => (
                <li key={n.href}>
                  <FlipLink href={n.href} className="menu-flip">
                    {n.label}
                  </FlipLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="menu-head">The shop</p>
            <ul>
              {SHOP_LINKS.map((n) => (
                <li key={n.href}>
                  <FlipLink href={n.href} className="menu-flip">
                    {n.label}
                  </FlipLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="menu-head">Get in touch</p>
            <ul>
              <li>
                <Phone />
              </li>
              <li>
                <a href={`mailto:${b.email}`} className="menu-contact menu-email">
                  {b.email}
                </a>
              </li>
            </ul>
            <SocialLinks variant="icons" className="menu-socials" />
          </div>
        </nav>
        <div className="menu-cards">
          {CARDS.map((c) => (
            <Link key={c.href} href={c.href} className="menu-card">
              <span className="menu-card-media">
                <Image src={c.piece.image} alt="" fill sizes="(min-width: 1024px) 240px, 46vw" className="menu-card-img" />
              </span>
              <span className="menu-card-top">
                <span className="menu-card-title">{c.title}</span>
                <span className="menu-card-sub">Explore</span>
              </span>
              <span className="menu-card-foot">{c.piece.title.split(",")[0]}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/** B: full screen, the categories as huge stacked words; the photo follows the word under the pointer. */
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

/** C: a drawer from the right, laid out like a store app: category rows with photo and count. */
function MenuDrawer() {
  return (
    <div className="menu-c" data-menu-panel data-menu-trap>
      <div className="menu-c-backdrop" data-menu-close aria-hidden="true" />
      <aside className="menu-c-drawer" aria-label="Menu" data-menu-surface data-lenis-prevent>
        <div className="menu-c-head">
          <Logo variant="horizontal" className="menu-c-logo" />
          <button type="button" className="menu-c-close" data-menu-close aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="menu-c-label">Shop by collection</p>
        <ul className="menu-c-cats">
          {CATEGORIES.map((c, i) => (
            <li key={c.href}>
              <Link href={c.href} className="menu-c-row" data-menu-first={i === 0 || undefined}>
                <span className="menu-c-thumb">
                  {c.piece ? <Image src={c.piece.image} alt="" fill sizes="56px" className="object-cover" /> : <Logo variant="mark" className="menu-c-mark" />}
                </span>
                <span className="menu-c-name">{c.title}</span>
                <span className="menu-c-count tnum">{c.count ? `${c.count} in the case` : "Ask what is in"}</span>
                <svg className="menu-c-chev" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
        <p className="menu-c-label">The shop</p>
        <ul className="menu-c-links">
          {SHOP_LINKS.filter((n) => n.href !== "/enquiry").map((n) => (
            <li key={n.href}>
              <Link href={n.href}>{n.label}</Link>
            </li>
          ))}
        </ul>
        <div className="menu-c-foot">
          <Link href="/enquiry" className="plan-cta">
            <span>Make an enquiry</span>
            <span className="plan-disc" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="plan-arrow">
                <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
          <Phone />
          <SocialLinks variant="icons" className="menu-c-socials" />
        </div>
      </aside>
    </div>
  );
}

/**
 * The site menu, opened by the header's toggle (state on <html data-menu-open>, see
 * menu-state.ts). Round 1 of Shaun's walk-through (6 Oct 2026) shows three variants
 * behind the preview switch (?v=menu:a|b|c); the two not chosen are deleted after.
 */
export default function SiteMenu() {
  return (
    <div id="site-menu">
      <div data-x="menu" data-x-dir="a">
        <MenuMega />
      </div>
      <div data-x="menu" data-x-dir="b">
        <MenuEditorial />
      </div>
      <div data-x="menu" data-x-dir="c">
        <MenuDrawer />
      </div>
      <MenuController />
    </div>
  );
}
