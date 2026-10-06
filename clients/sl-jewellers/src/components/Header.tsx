import Link from "next/link";
import Logo from "./Logo";
import { FlipLink, FlipRows } from "./ui/reveal-links";
import MenuToggle from "./menu/MenuToggle";
import { NAV } from "./menu/menu-data";

/** The stacked logo centred, three flip links on the left, Enquire and Menu on the right; phones keep
 *  Enquire left and Menu right. Plain words, no frames. Clear over the hero film, glass once past it;
 *  the logo sits inside the bar. The menu itself is SiteMenu (components/menu), opened by the toggle. */
/* The bar's own links. Visit came off on 6 Oct 2026 (Shaun: unnecessary; the address,
   hours and map are on the homepage and in the footer). */
export default function Header() {
  return (
    <header id="site-header" className="site-header-a sticky top-0 z-50 border-b border-transparent" data-site-header>
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
          <MenuToggle className="flip menu-toggle-a">
            <FlipRows text="Menu" />
          </MenuToggle>
        </div>
      </div>
    </header>
  );
}
