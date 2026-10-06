import { BUSINESS, HOURS_ON, LAUNCH } from "@/lib/content";
import Reveal from "@/components/Reveal";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";
import WeekStrip from "@/components/WeekStrip";

/**
 * Visit the shop (Shaun's pick, round 4 of the walk-through, 6 Oct 2026): option C's right
 * column (open now set large, the week as seven cells with today marked, the address and a
 * directions button) with the black-and-white map on the left instead of C's tall shop
 * photo, cut to the column's own height so the section takes no more room than it needs.
 * Phone, WhatsApp and email stay out of this section (they are in the header, menu and footer).
 */
export default function Visit() {
  const b = BUSINESS;
  return (
    <section id="visit" className="on-black section scroll-mt-16" aria-labelledby="visit-title">
      <div className="wrap visit">
        <Reveal className="visit-map map-tray">
          <iframe
            title="Map showing S&L Jewellers at 49 Cambridge Street, Cleethorpes DN35 8HD"
            src={b.social.google.embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </Reveal>
        <Reveal>
          <p className="eyebrow">Visit the shop</p>
          <SplitHeading id="visit-title" text={"Pull up and\n*have a look.*"} className="display-l mt-3" />
          {HOURS_ON ? (
            <>
              <OpenNowChip className="visit-chip mt-8" />
              <WeekStrip />
              {b.hours.enquiriesNote && <p className="mt-4 text-sm text-wall">{b.hours.enquiriesNote}</p>}
            </>
          ) : (
            <p className="mt-8 text-wall">
              Call{" "}
              <a href={`tel:${b.phone.e164}`} className="tap tnum">
                {b.phone.display}
              </a>{" "}
              to check today&rsquo;s hours.
            </p>
          )}
          {!b.hours.confirmed && !LAUNCH && (
            <p className="mt-3">
              <span className="todo">TODO: confirm opening hours with the shop</span>
            </p>
          )}
          <div className="visit-foot">
            <address className="not-italic leading-relaxed">
              {b.address.street}
              <br />
              {b.address.town} {b.address.postcode}
            </address>
            <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="plan-cta">
              <span>Get directions</span>
              <span className="plan-disc" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
