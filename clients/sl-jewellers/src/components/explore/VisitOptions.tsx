import Image from "next/image";
import { BUSINESS, hasTimes, type DayHours } from "@/lib/content";
import { DAYS, DAY_LABEL } from "@/lib/hours";
import Reveal from "@/components/Reveal";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";
import WeekStrip from "./WeekStrip";

const hoursText = (h: DayHours) => (hasTimes(h) ? `${h.open} – ${h.close}` : h ? "By appointment" : "Closed");

const Directions = ({ className = "" }: { className?: string }) => (
  <a href={BUSINESS.social.google.directionsUrl} target="_blank" rel="noopener" className={`plan-cta ${className}`}>
    <span>Get directions</span>
    <span className="plan-disc" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  </a>
);

/**
 * Visit B (round 4): the black-and-white map as a full-width stage, with the address,
 * open-now and the week in a card floating on it (under it on a phone).
 */
export function VisitB() {
  const b = BUSINESS;
  return (
    <section className="on-black section" aria-labelledby="visit-title-b">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Visit the shop</p>
          <SplitHeading id="visit-title-b" text={"Pull up and\n*have a look.*"} className="display-l mt-3" />
        </Reveal>
        <Reveal className="vstage mt-10">
          <div className="vstage-map map-tray">
            <iframe title="Map showing S&L Jewellers at 49 Cambridge Street, Cleethorpes DN35 8HD" src={b.social.google.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
          <div className="vstage-card">
            <OpenNowChip />
            <address className="vstage-addr not-italic">
              {b.address.street}
              <br />
              {b.address.town} {b.address.postcode}
            </address>
            <dl className="visit-hours tnum">
              {DAYS.map((d) => (
                <div key={d}>
                  <dt>{DAY_LABEL[d]}</dt>
                  <dd>{hoursText(b.hours.week[d])}</dd>
                </div>
              ))}
            </dl>
            <Directions />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Visit C (round 4): no map embed. The shop's own interior photo, a live "open now"
 * line set large, the week as seven cells with today marked, the address and a
 * directions button that opens Google Maps.
 */
export function VisitC() {
  const b = BUSINESS;
  return (
    <section className="on-black section" aria-labelledby="visit-title-c">
      <div className="wrap vfront">
        <Reveal className="vfront-photo">
          <Image src="/images/shop-interior.jpg" alt="Inside S&L Jewellers on Cambridge Street: the glass counters and display cases" fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover" />
        </Reveal>
        <Reveal className="vfront-copy">
          <p className="eyebrow">Visit the shop</p>
          <SplitHeading id="visit-title-c" text={"Pull up and\n*have a look.*"} className="display-l mt-3" />
          <OpenNowChip className="vfront-chip mt-8" />
          <WeekStrip />
          {b.hours.enquiriesNote && <p className="mt-4 text-sm text-wall">{b.hours.enquiriesNote}</p>}
          <div className="vfront-foot">
            <address className="not-italic leading-relaxed">
              {b.address.street}
              <br />
              {b.address.town} {b.address.postcode}
            </address>
            <Directions />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
