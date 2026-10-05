import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "./Logo";
import MagneticButton from "./motion/MagneticButton";
import { FlipLink } from "./ui/reveal-links";
import MenuDetails from "./MenuDetails";
import SocialLinks from "./SocialLinks";

/** Mark and name, four flip links, the gold button and a Menu with every section, the socials and the phone, at every width. Transparent over the hero, glass once scrolled. */
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
      <div className="wrap flex h-16 items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex min-h-[44px] min-w-[44px] items-center gap-3 justify-self-start no-underline" aria-label="S&L Jewellers, home">
          <Logo variant="horizontal" className="w-[128px] sm:w-[148px]" alt="S&L Jewellers" />
        </Link>

        <nav aria-label="Main" className="nav-flip hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <FlipLink key={n.href} href={n.href}>
              {n.label}
            </FlipLink>
          ))}
        </nav>

        <div className="flex items-center gap-5 justify-self-end">
          <MagneticButton>
            <Link href="/enquiry" className="btn btn-metal btn-sm">
              Enquire
            </Link>
          </MagneticButton>
          <MenuDetails className="relative">
            <summary className="btn btn-metal btn-sm list-none cursor-pointer [&::-webkit-details-marker]:hidden" aria-label="Menu">
              Menu
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
