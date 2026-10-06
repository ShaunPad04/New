import fs from "node:fs";
import path from "node:path";
import { BUSINESS, HOURS_ON, LAUNCH, WHATSAPP_ON, hasTimes, whatsappUrl, type DayHours, type DayKey } from "@/lib/content";
import { DAYS, DAY_LABEL } from "@/lib/hours";
import Reveal from "@/components/Reveal";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * The shop: who is in it, where it is, when it is open and how to get there.
 * This was two sections, "The shop on Cambridge Street" and "Visit us", sitting
 * next to each other and saying much the same thing. One section, one heading,
 * roughly a screen shorter. Paragraphs come from content/about.md; a line
 * starting "## " becomes a sub-heading, and TODO comments become badges.
 */
function readAbout() {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "about.md"), "utf8");
  const todos = [...raw.matchAll(/<!--\s*(TODO:[\s\S]*?)-->/g)].map((m) => m[1].trim());
  const paragraphs = raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { paragraphs, todos };
}

/** Opening hours as a few lines, not seven rows: runs of days with the same hours share a line. */
function hourLines(week: Record<DayKey, DayHours>) {
  const text = (h: DayHours) => (hasTimes(h) ? `${h.open} – ${h.close}` : h ? "By appointment" : "Closed");
  const short = (d: DayKey) => DAY_LABEL[d].slice(0, 3);
  const lines: { days: string; hours: string }[] = [];
  let i = 0;
  while (i < DAYS.length) {
    let j = i;
    while (j + 1 < DAYS.length && text(week[DAYS[j + 1]]) === text(week[DAYS[i]])) j++;
    lines.push({ days: i === j ? DAY_LABEL[DAYS[i]] : `${short(DAYS[i])} – ${short(DAYS[j])}`, hours: text(week[DAYS[i]]) });
    i = j + 1;
  }
  return lines;
}

/**
 * Compact (Shaun, 6 Oct 2026: "unreasonably large"): heading and the address line side by
 * side, then address, contact and hours as three short columns beside a map of a sensible
 * height, the about copy underneath in two columns. Was a seven-row hours table, a 560px
 * sticky map and a single long column.
 */
export default function Visit() {
  const b = BUSINESS;
  const { paragraphs, todos } = readAbout();
  return (
    <section id="visit" className="on-black section" aria-labelledby="visit-title">
      <div className="wrap">
        <Reveal className="visit-head">
          <div>
            <p className="eyebrow">Our gaff on Cambridge Street</p>
            <SplitHeading id="visit-title" text={"Pull up and\n*have a look.*"} className="display-l mt-3" />
          </div>
          <p className="text-wall lg:max-w-[40ch]">
            {b.address.street}, {b.address.town} {b.address.postcode}. See the whole case, bring your gold in for a price, or just come and ask.
          </p>
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
              <p className="eyebrow">Contact</p>
              <ul className="mt-3 space-y-1">
                <li>
                  <a href={`tel:${b.phone.e164}`} className="tap tnum">
                    {b.phone.display}
                  </a>
                </li>
                {WHATSAPP_ON && (
                  <li>
                    <a href={whatsappUrl()} target="_blank" rel="noopener" className="tap">
                      WhatsApp us
                    </a>
                    {!b.whatsapp.confirmed && !LAUNCH && (
                      <>
                        {" "}
                        <span className="todo">TODO: confirm WhatsApp</span>
                      </>
                    )}
                  </li>
                )}
                <li>
                  <a href={`mailto:${b.email}`} className="tap break-all">
                    {b.email}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">Opening hours</p>
              {HOURS_ON ? (
                <>
                  <dl className="visit-hours mt-3 tnum">
                    {hourLines(b.hours.week).map((l) => (
                      <div key={l.days}>
                        <dt>{l.days}</dt>
                        <dd>{l.hours}</dd>
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

        <div className="about-copy visit-about mt-12 text-[15px] text-wall">
          {paragraphs.map((p, i) =>
            p.startsWith("## ") ? (
              <h3 key={i} className="display-s text-paper">
                {p.slice(3)}
              </h3>
            ) : (
              <p key={i} className="max-w-[56ch]">
                {p}
              </p>
            ),
          )}
        </div>
        {!LAUNCH &&
          todos.map((t) => (
            <p key={t} className="mt-4">
              <span className="todo">{t}</span>
            </p>
          ))}
      </div>
    </section>
  );
}
