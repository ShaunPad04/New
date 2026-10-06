import { BUSINESS, HOURS_ON, LAUNCH, hasTimes, type DayHours } from "@/lib/content";
import { DAYS, DAY_LABEL } from "@/lib/hours";
import Reveal from "@/components/Reveal";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";

/** Opening hours, one line per day (Shaun, 6 Oct 2026: every day with its times, not "Mon – Sat"). */
const hoursText = (h: DayHours) => (hasTimes(h) ? `${h.open} – ${h.close}` : h ? "By appointment" : "Closed");

/**
 * Compact (Shaun, 6 Oct 2026: "unreasonably large"): the heading, then the address and the
 * week's hours as two short columns beside a black-and-white map. The phone, WhatsApp and
 * email came out of this section the same day (they live in the menu, the footer and the
 * enquiry page), as did the address line under the heading. The about copy is on /about.
 */
export default function Visit() {
  const b = BUSINESS;
  return (
    <section className="on-black section" aria-labelledby="visit-title">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Visit the shop</p>
          <SplitHeading id="visit-title" text={"Pull up and\n*have a look.*"} className="display-l mt-3" />
        </Reveal>

        <div className="visit-body mt-10 [&>*]:min-w-0">
          <Reveal className="visit-facts">
            <div>
              <p className="eyebrow">Address</p>
              <address className="mt-3 not-italic leading-relaxed">
                {b.address.street}
                <br />
                {b.address.town} {b.address.postcode}
              </address>
              <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="link-arrow mt-3">
                Get directions <span aria-hidden="true">→</span>
              </a>
            </div>
            <div>
              <p className="eyebrow">Opening hours</p>
              {HOURS_ON ? (
                <>
                  <dl className="visit-hours mt-3 tnum">
                    {DAYS.map((d) => (
                      <div key={d}>
                        <dt>{DAY_LABEL[d]}</dt>
                        <dd>{hoursText(b.hours.week[d])}</dd>
                      </div>
                    ))}
                  </dl>
                  <OpenNowChip className="mt-4" />
                  {b.hours.enquiriesNote && <p className="mt-3 text-sm text-wall">{b.hours.enquiriesNote}</p>}
                </>
              ) : (
                <p className="mt-3 text-wall">
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
            </div>
          </Reveal>

          <Reveal className="tray map-tray visit-map">
            <iframe
              title="Map showing S&L Jewellers at 49 Cambridge Street, Cleethorpes DN35 8HD"
              src={b.social.google.embedUrl}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>

      </div>
    </section>
  );
}
