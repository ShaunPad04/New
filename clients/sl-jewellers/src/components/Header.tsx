import Link from "next/link";
import Image from "next/image";
import { BUSINESS, COLLECTIONS, WHATSAPP_ON, whatsappUrl } from "@/lib/content";
import Logo from "./Logo";
import { FlipLink, FlipRows } from "./ui/reveal-links";
import MenuDetails from "./MenuDetails";
import SocialLinks, { ICONS } from "./SocialLinks";

/** The stacked logo centred, three flip links on the left, Enquire and a Menu (a full-width mega menu: collection and shop columns, phone, socials, photo cards) on the right; phones keep
 *  Enquire left and Menu right. Plain words, no frames. Clear over the hero film, glass once past it; the logo sits inside the bar. */
/* The bar's own links. Visit came off on 6 Oct 2026 (Shaun: unnecessary; the address,
   hours and map are on the homepage and in the footer). */
const NAV = [
  { href: "/pieces", label: "Pieces" },
  { href: "/#services", label: "Services" },
  { href: "/#reviews", label: "Reviews" },
];

/* The Menu panel, after a watch house's mega menu (Shaun's reference, 6 Oct 2026): link
   columns on the left, three photo cards on the right. No "Brands" column: S&L is not
   affiliated with the brands it sells, and there are no brand pages to link. */
const COLLECTION_LINKS = [{ href: "/pieces", label: "All pieces" }, ...COLLECTIONS.map((c) => ({ href: `/pieces/${c.slug}`, label: c.title }))];
const SHOP_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/gold-prices", label: "Gold prices" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/about", label: "About us" },
  { href: "/faq", label: "FAQ" },
  { href: "/enquiry", label: "Make an enquiry" },
];
/** A card per category, showing the first piece in it: S&L's own photo and its own title. */
const CARDS = (
  [
    ["watches", "Watches"],
    ["chains", "Chains"],
    ["bracelets", "Bracelets"],
  ] as const
)
  .map(([slug, short]) => ({ c: COLLECTIONS.find((x) => x.slug === slug), short }))
  .filter(({ c }) => c && c.pieces?.length)
  .map(({ c, short }) => ({ href: `/pieces/${c!.slug}`, title: short, piece: c!.pieces![0] }));

export default function Header() {
  return (
    <header id="site-header" className="sticky top-0 z-50 border-b border-transparent">
      <div className="wrap nav-flip grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center justify-self-start">
          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <FlipLink key={n.href} href={n.href}>
                {n.label}
              </FlipLink>
            ))}
          </nav>
          {/* wrapped: .flip's own display would beat a display utility on the link */}
          <span className="lg:hidden">
            <FlipLink href="/enquiry">Enquire</FlipLink>
          </span>
        </div>

        <Link href="/" className="brand no-underline" aria-label="S&L Jewellers, home">
          <Logo variant="stacked" className="brand-logo" />
        </Link>

        <div className="flex items-center gap-9 justify-self-end">
          <span className="hidden lg:block">
            <FlipLink href="/enquiry">Enquire</FlipLink>
          </span>
          <MenuDetails className="menu">
            <summary className="flip list-none cursor-pointer [&::-webkit-details-marker]:hidden" aria-label="Menu">
              <FlipRows text="Menu" />
            </summary>
            {/* Full width under the bar (the header is its containing block). data-lenis-prevent:
                Lenis takes wheel events page-wide, so without it the panel would not scroll. */}
            <div className="menu-panel" data-lenis-prevent>
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
                        <a href={`tel:${BUSINESS.phone.e164}`} className="menu-contact tnum" aria-label={`Call S&L Jewellers on ${BUSINESS.phone.display}`}>
                          <span className="menu-contact-icon">{ICONS.phone}</span>
                          {BUSINESS.phone.display}
                        </a>
                      </li>
                      {WHATSAPP_ON && (
                        <li>
                          <a href={whatsappUrl()} target="_blank" rel="noopener" className="menu-contact">
                            WhatsApp
                          </a>
                        </li>
                      )}
                      <li>
                        <a href={`mailto:${BUSINESS.email}`} className="menu-contact menu-email">
                          {BUSINESS.email}
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
          </MenuDetails>
        </div>
      </div>
    </header>
  );
}
