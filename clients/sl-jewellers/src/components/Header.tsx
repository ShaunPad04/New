import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "./Logo";
import { FlipLink, FlipRows } from "./ui/reveal-links";
import MenuDetails from "./MenuDetails";

/** The stacked logo centred, four flip links on the left, Enquire and a Menu (a full-width black panel: every section, address, phone, socials) on the right; phones keep
 *  Enquire left and Menu right. Plain words, no frames. Clear over the hero film, glass once past it; the logo sits inside the bar. */
/* One entry per destination. "Pieces" and "In the case" both led to product, and
   "Visit" and "The shop" both led to the same corner of Cambridge Street, so the
   duplicates are gone and About now sits directly above Visit on the page. */
const NAV = [
  { href: "/pieces", label: "Pieces" },
  { href: "/#services", label: "Services" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#visit", label: "Visit" },
];
const MORE = [
  { href: "/#what-we-do", label: "What we do" },
  { href: "/gold-prices", label: "Gold prices" },
  { href: "/faq", label: "FAQ" },
  { href: "/enquiry", label: "Make an enquiry" },
];

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
                <nav aria-label="All sections" className="menu-links">
                  {[...NAV, ...MORE].map((n) => (
                    <FlipLink key={n.href} href={n.href} className="menu-flip">
                      {n.label}
                    </FlipLink>
                  ))}
                </nav>
                <div className="menu-side">
                  <div>
                    <p className="eyebrow">Visit</p>
                    <p className="mt-2">
                      {BUSINESS.address.street}, {BUSINESS.address.town} {BUSINESS.address.postcode}
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow">Call</p>
                    <a href={`tel:${BUSINESS.phone.e164}`} className="tap tnum">
                      {BUSINESS.phone.display}
                    </a>
                  </div>
                  <div>
                    <p className="eyebrow">Follow</p>
                    <ul className="menu-social">
                      <li>
                        <a href={BUSINESS.social.instagram.url} target="_blank" rel="noopener">
                          Instagram
                        </a>
                      </li>
                      <li>
                        <a href={BUSINESS.social.facebook.url} target="_blank" rel="noopener">
                          Facebook
                        </a>
                      </li>
                      <li>
                        <a href={BUSINESS.social.tiktok.url} target="_blank" rel="noopener">
                          TikTok
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </MenuDetails>
        </div>
      </div>
    </header>
  );
}
