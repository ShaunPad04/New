import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "@/components/Logo";
import OpenNowChip from "@/components/OpenNowChip";
import { ICONS } from "@/components/SocialLinks";
import MenuToggle, { Burger } from "@/components/menu/MenuToggle";

/**
 * The centred crest (Shaun's pick of three header redesigns, 6 Oct 2026). A 32px strip (open
 * now from the real hours, the address, the phone) over an 84px bar: MENU and the menu mark
 * on the left, S&L's own stacked logo in the middle, a hairline Enquire pill on the right.
 * Sticky at minus the strip's height, so the strip scrolls away and the bar stays; clear over
 * the hero film, glass once past it (MotionRoot sets data-scrolled), and the logo settles a
 * little smaller then. The menu (components/menu) drops over everything, header included.
 */
export default function Header() {
  const b = BUSINESS;
  return (
    <header id="site-header" className="hx hx-a" data-site-header>
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
      <div className="wrap hx-a-bar">
        <MenuToggle className="mtoggle">
          <Burger label />
        </MenuToggle>
        <Link href="/" className="hx-home" aria-label="S&L Jewellers, home">
          <Logo variant="stacked" className="hx-a-logo" />
        </Link>
        <div className="hx-end">
          <Link href="/enquiry" className="enq-b">
            <span>Enquire</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
