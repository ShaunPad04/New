import Link from "next/link";
import { BUSINESS } from "@/lib/content";
import Logo from "@/components/Logo";
import OpenNowChip from "@/components/OpenNowChip";
import { FlipLink } from "@/components/ui/reveal-links";
import { ICONS } from "@/components/SocialLinks";
import MenuToggle, { Burger } from "@/components/menu/MenuToggle";
import { CATEGORIES } from "@/components/menu/menu-data";

/**
 * Header redesign, three options (Shaun, 6 Oct 2026: "redesign the header, give me 3 more
 * options"). Every option uses S&L's own stacked logo, the new menu mark (three hairlines,
 * the middle one short) and its own Enquire: A a hairline pill, B a text link, C a solid
 * white pill. Each carries data-site-header, so MotionRoot sets data-scrolled (the glass)
 * and the menu finds the toggle that opened it. Preview with ?v=header:b.
 */
const b = BUSINESS;
const STOCKED = CATEGORIES.filter((c) => c.count);
const Arrow = () => (
  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
    <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Home = ({ className }: { className: string }) => (
  <Link href="/" className="hx-home" aria-label="S&L Jewellers, home">
    <Logo variant="stacked" className={className} />
  </Link>
);
const Phone = ({ className = "hx-phone" }: { className?: string }) => (
  <a href={`tel:${b.phone.e164}`} className={`${className} tnum`} aria-label={`Call S&L Jewellers on ${b.phone.display}`}>
    <span className="menu-contact-icon">{ICONS.phone}</span>
    {b.phone.display}
  </a>
);
const Strip = () => (
  <div className="hdr-b-strip">
    <div className="wrap hdr-b-strip-in">
      <OpenNowChip compact className="hdr-b-chip" />
      <span className="hdr-b-addr">
        {b.address.street}, {b.address.town} · Weighed and priced in front of you
      </span>
      <Phone className="hdr-b-phone" />
    </div>
  </div>
);

/** A · Centred crest: the info strip, then MENU on the left, the logo in the middle, Enquire on the right. The logo settles smaller once the film has gone. */
export function HeaderA() {
  return (
    <header className="hx hx-a" data-site-header>
      <Strip />
      <div className="wrap hx-a-bar">
        <MenuToggle className="mtoggle">
          <Burger label />
        </MenuToggle>
        <Home className="hx-a-logo" />
        <div className="hx-end">
          <Link href="/enquiry" className="enq-b">
            <span>Enquire</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/** B · Two rows: open-now, the logo large and the phone on top (it scrolls away); every category on a second row that stays, with a small logo that slides in once stuck. */
export function HeaderB() {
  return (
    <header className="hx hx-b" data-site-header>
      <div className="wrap hx-b-top nav-flip">
        <div className="hx-b-left">
          <MenuToggle className="mtoggle hx-b-mtop">
            <Burger />
          </MenuToggle>
          <span className="hx-b-info">
            <OpenNowChip compact className="hdr-b-chip" />
            <span className="hx-b-addr">
              {b.address.street}, {b.address.town}
            </span>
          </span>
        </div>
        <Home className="hx-b-logo" />
        <div className="hx-end">
          <Phone className="hx-phone hx-b-phone" />
          <FlipLink href="/enquiry" className="enq-a">
            Enquire
          </FlipLink>
        </div>
      </div>
      <div className="hx-b-row">
        <div className="wrap hx-b-row-in nav-flip">
          <Home className="hx-b-mini" />
          <nav aria-label="Collections" className="hx-b-cats">
            {STOCKED.map((c) => (
              <FlipLink key={c.href} href={c.href}>
                {c.title}
              </FlipLink>
            ))}
            <FlipLink href="/pieces">All pieces</FlipLink>
          </nav>
          <MenuToggle className="mtoggle hx-b-mrow">
            <Burger label />
          </MenuToggle>
        </div>
      </div>
    </header>
  );
}

/** C · Floating island: a rounded glass bar held off the edges, the logo, the categories, a white Enquire pill and the menu mark. No strip. */
export function HeaderC() {
  return (
    <header className="hx hx-c" data-site-header>
      <div className="hx-c-pill nav-flip">
        <Home className="hx-c-logo" />
        <nav aria-label="Collections" className="hx-c-cats">
          {STOCKED.map((c) => (
            <FlipLink key={c.href} href={c.href}>
              {c.title}
            </FlipLink>
          ))}
        </nav>
        <div className="hx-end">
          <Link href="/enquiry" className="enq-c">
            <span>Enquire</span>
            <Arrow />
          </Link>
          <MenuToggle className="mtoggle is-icon">
            <Burger />
          </MenuToggle>
        </div>
      </div>
    </header>
  );
}
