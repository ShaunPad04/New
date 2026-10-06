import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "./Logo";
import { FlipLink, FlipRows } from "./ui/reveal-links";
import MenuDetails from "./MenuDetails";
import SocialLinks from "./SocialLinks";

/** The stacked logo centred, four flip links on the left, Enquire and a Menu (every section, the socials and the phone) on the right; phones keep
 *  Enquire left and Menu right. Plain words, no frames. Clear over the hero film, glass once past it; the logo hangs large into the film
 *  and condenses into the bar (globals.css, "Header logo"). */
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
  { href: "/#prices", label: "Gold prices" },
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
          <MenuDetails className="relative">
            <summary className="flip list-none cursor-pointer [&::-webkit-details-marker]:hidden" aria-label="Menu">
              <FlipRows text="Menu" />
            </summary>
            <nav aria-label="All sections" className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl border border-line-dark bg-graphite p-2 shadow-2xl">
              {[...NAV, ...MORE].map((n) => (
                <FlipLink key={n.href} href={n.href} className="menu-flip">
                  {n.label}
                </FlipLink>
              ))}
              <FlipLink href={`tel:${BUSINESS.phone.e164}`} className="menu-flip tnum">
                {`Call ${BUSINESS.phone.display}`}
              </FlipLink>
              <div className="mt-1 border-t border-line-dark px-2 pt-3 pb-1">
                <p className="eyebrow mb-2 px-2">Follow</p>
                <SocialLinks variant="menu" />
              </div>
            </nav>
          </MenuDetails>
        </div>
      </div>
    </header>
  );
}
