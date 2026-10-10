import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "@/components/Logo";
import OpenNowChip from "@/components/OpenNowChip";
import { ICONS } from "@/components/SocialLinks";
import MenuToggle, { Burger } from "@/components/menu/MenuToggle";
import BasketButton from "@/components/basket/BasketButton";

/**
 * The centred crest (Shaun's pick of three header redesigns, 6 Oct 2026). A 32px strip (open
 * now from the real hours, the address, the phone) over an 84px bar: MENU and the menu mark
 * on the left, S&L's own stacked logo in the middle, the basket and an Enquire pill on the right
 * (on a phone the basket moves over beside the menu and Enquire is a slimmer pill).
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
        {/* on a phone the basket sits beside the menu, so Enquire has the right-hand side to
            itself and the logo clear space both sides (Shaun, 8 Oct 2026: "the basket is so close
            to the logo") */}
        <div className="hx-start">
          <MenuToggle className="mtoggle">
            <Burger label />
          </MenuToggle>
          <BasketButton className="bkt-btn-start" />
        </div>
        <Link href="/" className="hx-home" aria-label="S&L Jewellers, home">
          <Logo variant="stacked" className="hx-a-logo" sizes="(max-width: 767px) 37px, 46px" />
        </Link>
        <div className="hx-end">
          <BasketButton className="bkt-btn-end" />
          <Link href="/enquiry" className="enq-b">
            <span>Enquire</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
