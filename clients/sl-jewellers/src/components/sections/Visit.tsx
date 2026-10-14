import { BUSINESS, HOURS_ON, LAUNCH } from "@/lib/content";
import Reveal from "@/components/Reveal";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";
import WeekStrip from "@/components/WeekStrip";
import PhoneLink from "@/components/PhoneLink";

/**
 * Visit the shop (Shaun's pick, round 4 of the walk-through, 6 Oct 2026): option C's right
 * column (open now set large, the week as seven cells with today marked, the address) with
 * the black-and-white map on the left instead of C's tall shop
 * photo, cut to the column's own height so the section takes no more room than it needs.
 * Phone, WhatsApp and email stay out of this section (they are in the header, menu and footer).
 * No directions button: the map's own "Open in Maps" does the same job (Shaun, 8 Oct 2026: "do
 * we even need this?").
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
          {/* the shop's pin in gold over the black-and-white map (Shaun, 14 Oct 2026: "keep it black
              and white but add colour to the pin point"). The embed centres on the shop, so the
              pin's tip sits at the map's centre; it is decoration over the iframe's own marker,
              which the filter leaves grey. */}
          {/* our own way out to Google Maps, over the map (Shaun, 14 Oct 2026: "open in maps button
              doesn't work"): the embed's own link is Google's and opens where it likes; this one
              is the shop's address as a directions search, in a new tab */}
          <a href={b.social.google.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost map-open">
            <span className="map-open-long">Open in Google Maps</span>
            <span className="map-open-short">Google Maps</span> <span aria-hidden="true">↗</span>
          </a>
          <span className="map-cover" aria-hidden="true" />
          <span className="map-pin" aria-hidden="true">
            <svg viewBox="0 0 36 48" width="36" height="48">
              <defs>
                <linearGradient id="map-pin-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#efd99f" />
                  <stop offset="0.55" stopColor="#c9ad74" />
                  <stop offset="1" stopColor="#a8894f" />
                </linearGradient>
              </defs>
              <path d="M18 1.5C9 1.5 1.8 8.6 1.8 17.4c0 11.6 13.4 25.9 15.4 28 .4.5 1.2.5 1.6 0 2-2.1 15.4-16.4 15.4-28C34.2 8.6 27 1.5 18 1.5Z" fill="url(#map-pin-gold)" stroke="#0b0b0c" strokeWidth="1.5" />
              <circle cx="18" cy="17.4" r="6" fill="#0b0b0c" />
              <circle cx="18" cy="17.4" r="2.6" fill="#efd99f" />
            </svg>
          </span>
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
              <PhoneLink className="tap tnum">{b.phone.display}</PhoneLink>{" "}
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
