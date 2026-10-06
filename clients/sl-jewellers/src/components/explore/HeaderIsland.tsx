import Link from "next/link";
import Logo from "@/components/Logo";
import { FlipLink } from "@/components/ui/reveal-links";
import MenuToggle, { Burger } from "@/components/menu/MenuToggle";
import { NAV } from "@/components/menu/menu-data";

/**
 * Header C, "Floating island" (round 1 of the walk-through): a glass pill detached from the
 * top of the screen, the logo, four links, a gold Enquire pill and a menu button. Glass over
 * the film from the start; once past the film it darkens and draws in a touch.
 */
export default function HeaderIsland() {
  return (
    <header className="hdr-c" data-site-header>
      <div className="hdr-c-pill nav-flip">
        <Link href="/" className="hdr-c-brand" aria-label="S&L Jewellers, home">
          <Logo variant="horizontal" className="hdr-c-logo" />
        </Link>
        <nav aria-label="Main" className="hdr-c-nav">
          {[...NAV, { href: "/gold-prices", label: "Gold prices" }].map((n) => (
            <FlipLink key={n.href} href={n.href}>
              {n.label}
            </FlipLink>
          ))}
        </nav>
        <div className="hdr-c-actions">
          <Link href="/enquiry" className="pill-gold">
            Enquire
          </Link>
          <MenuToggle className="icon-btn">
            <Burger />
          </MenuToggle>
        </div>
      </div>
    </header>
  );
}
