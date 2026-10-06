import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "@/components/Logo";
import OpenNowChip from "@/components/OpenNowChip";
import { FlipLink } from "@/components/ui/reveal-links";
import { ICONS } from "@/components/SocialLinks";
import MenuToggle, { Burger } from "@/components/menu/MenuToggle";
import { CATEGORIES } from "@/components/menu/menu-data";

/**
 * The "Shop bar" (Shaun's pick, round 1 of the walk-through, 6 Oct 2026): a thin utility
 * strip (open now, the address, the phone) over a bar with the logo on the left, every
 * stocked category named in the middle, and a metallic Enquire pill and the menu button on
 * the right. It sticks at minus the strip's height, so the strip scrolls away and the bar
 * stays. Clear over the hero film, glass once past it (MotionRoot sets data-scrolled).
 * The menu itself is SiteMenu (components/menu), opened by the button.
 */
export default function Header() {
  const b = BUSINESS;
  return (
    <header id="site-header" className="hdr-b" data-site-header>
      <div className="hdr-b-strip">
        <div className="wrap hdr-b-strip-in">
          <OpenNowChip compact className="hdr-b-chip" />
          <span className="hdr-b-addr">
            {b.address.street}, {b.address.town} · Weighed and priced in front of you
          </span>
          <a href={`tel:${b.phone.e164}`} className="hdr-b-phone tnum" aria-label={`Call S&L Jewellers on ${b.phone.display}`}>
            <span className="menu-contact-icon">{ICONS.phone}</span>
            {b.phone.display}
          </a>
        </div>
      </div>
      <div className="wrap hdr-b-bar nav-flip">
        <Link href="/" className="hdr-b-brand" aria-label="S&L Jewellers, home">
          <Logo variant="horizontal" className="hdr-b-logo" />
        </Link>
        <nav aria-label="Collections" className="hdr-b-cats">
          {CATEGORIES.filter((c) => c.count).map((c) => (
            <FlipLink key={c.href} href={c.href}>
              {c.title}
            </FlipLink>
          ))}
        </nav>
        <div className="hdr-b-actions">
          <Link href="/enquiry" className="pill-metal">
            <span>Enquire</span>
            <span className="plan-disc" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="plan-arrow">
                <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
          <MenuToggle className="icon-btn">
            <Burger />
          </MenuToggle>
        </div>
      </div>
    </header>
  );
}
