import fs from "node:fs";
import path from "node:path";
import { BUSINESS, HOURS_ON, LAUNCH, WHATSAPP_ON, whatsappUrl } from "@/lib/content";
import Reveal from "@/components/Reveal";
import HoursTable from "@/components/HoursTable";
import OpenNowChip from "@/components/OpenNowChip";
import SplitHeading from "@/components/motion/SplitHeading";
import MagneticButton from "@/components/motion/MagneticButton";

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

export default function Visit() {
  const b = BUSINESS;
  const { paragraphs, todos } = readAbout();
  return (
    <section id="visit" className="on-black section border-t border-line-dark" aria-labelledby="visit-title">
      <div className="wrap">
        <Reveal className="max-w-[46ch]">
          <p className="eyebrow">Our gaff on Cambridge Street</p>
          <SplitHeading id="visit-title" text={"Pull up and\n*have a look.*"} className="display-l mt-3" />
          <p className="mt-5 text-wall">
            {b.address.street}, {b.address.town} {b.address.postcode}. See the whole case, bring your gold in for a
            price, or just come and ask.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow">Address</p>
                <address className="mt-2 not-italic leading-relaxed">
                  {b.address.street}
                  <br />
                  {b.address.town}
                  <br />
                  {b.address.postcode}
                </address>
                <MagneticButton className="mt-3">
                  <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="btn btn-metal btn-sm">
                    Get directions
                  </a>
                </MagneticButton>
              </div>
              <div>
                <p className="eyebrow">Contact</p>
                <ul className="mt-2 space-y-2">
                  <li>
                    <a href={`tel:${b.phone.e164}`} className="tap font-semibold tnum">
                      {b.phone.display}
                    </a>
                  </li>
                  {WHATSAPP_ON && (
                    <li>
                      <a href={whatsappUrl()} target="_blank" rel="noopener" className="tap font-semibold">
                        WhatsApp us
                      </a>
                      {!b.whatsapp.confirmed && (
                        <>
                          {" "}
                          <span className="todo">TODO: confirm WhatsApp</span>
                        </>
                      )}
                    </li>
                  )}
                  <li>
                    <a href={`mailto:${b.email}`} className="tap font-semibold">
                      {b.email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <p className="eyebrow">Opening hours</p>
                {HOURS_ON && <OpenNowChip />}
              </div>
              {HOURS_ON ? (
                <HoursTable week={b.hours.week} timeZone={b.hours.timezone} />
              ) : (
                <p className="mt-3 text-wall">
                  Call{" "}
                  <a href={`tel:${b.phone.e164}`} className="tap font-semibold tnum">
                    {b.phone.display}
                  </a>{" "}
                  to check today&rsquo;s hours.
                </p>
              )}
              {HOURS_ON && b.hours.enquiriesNote && <p className="mt-3 text-wall">{b.hours.enquiriesNote}</p>}
              {!b.hours.confirmed && !LAUNCH && (
                <p className="mt-3">
                  <span className="todo">TODO: confirm opening hours with the shop</span>
                </p>
              )}
            </div>

            <div className="about-copy mt-10 text-[16px] text-wall">
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
          </Reveal>

          <Reveal className="tray map-tray min-h-[260px] sm:min-h-[340px] lg:sticky lg:top-24 lg:min-h-[560px] lg:self-start">
            <div className="relative h-full min-h-[300px] lg:min-h-[548px]">
              <iframe
                title="Map showing S&L Jewellers at 49 Cambridge Street, Cleethorpes DN35 8HD"
                src={b.social.google.embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
