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
 * stays. Since round 4 the logo is S&L's own stacked lock-up (the crown and diamond over
 * "S&L jewellers"), not the side-by-side cut (Shaun: "it's not the actual one"). Clear over the hero film, glass once past it (MotionRoot sets data-scrolled).
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
          <Logo variant="stacked" className="hdr-b-logo" />
        </Link>
        <nav aria-label="Collections" className="hdr-b-cats">
          {CATEGORIES.filter((c) => c.count).map((c) => (
            <FlipLink key={c.href} href={c.href}>
              {c.title}
            </FlipLink>
          ))}
        </nav>
        <div className="hdr-b-actions">
          {/* Enquire, three ways while Shaun picks (?v=enquire:b): the metallic pill "looks ridiculous" */}
          <span data-x="enquire" data-x-dir="a">
            <FlipLink href="/enquiry" className="enq-a">
              Enquire
            </FlipLink>
          </span>
          <span data-x="enquire" data-x-dir="b">
            <Link href="/enquiry" className="enq-b">
              <span>Enquire</span>
            </Link>
          </span>
          <span data-x="enquire" data-x-dir="c">
            <Link href="/enquiry" className="enq-c">
              <span>Enquire</span>
              <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
                <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </span>
          <MenuToggle className="icon-btn">
            <Burger />
          </MenuToggle>
        </div>
      </div>
    </header>
  );
}
