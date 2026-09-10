"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { directionsUrl, embedUrl, findUs, isOpenNow, officeLocations, type OfficeLocation } from "@/lib/offices-map";
import { Appear, APPEAR_EASE } from "./appear";
import { Button } from "./button";
import { MapPin } from "./icons";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, rating - (n - 1)));
        return (
          <span key={n} className="relative block h-3.5 w-3.5">
            <svg viewBox="0 0 16 16" className="absolute inset-0 h-full w-full text-ink-300" fill="currentColor">
              <path d="M8 1.5l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.8l-4 2.1.8-4.5L1.5 6.2 6 5.6z" />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-ink-900" fill="currentColor">
                <path d="M8 1.5l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.8l-4 2.1.8-4.5L1.5 6.2 6 5.6z" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}
const getMinute = () => Math.floor(Date.now() / 60_000) * 60_000;
const getServerMinute = () => null;

/**
 * Office finder that sits above the footer on every page: a rail of office
 * tabs, the chosen office's address, hours and Google rating, and a live
 * Google Maps embed centred on it. Data comes from the offices' own Google
 * Business Profiles — see `lib/offices-map.ts`.
 */
export function FindUs() {
  const [slug, setSlug] = useState(officeLocations[0].slug);
  const office = officeLocations.find((o) => o.slug === slug) ?? officeLocations[0];
  // Open/closed is a client-only fact: the server snapshot is null (badge
  // hidden) and the client re-evaluates once a minute.
  const minute = useSyncExternalStore(subscribeMinute, getMinute, getServerMinute);
  const open = minute === null ? null : isOpenNow(office, new Date(minute));

  return (
    <section className="section" aria-labelledby="find-us-heading">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-5 tablet:flex-row tablet:items-end tablet:justify-between">
          <div className="flex flex-col gap-3">
            <Appear>
              <p className="caption2">{findUs.eyebrow}</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 id="find-us-heading" className="h2">
                {findUs.heading}
              </h2>
            </Appear>
          </div>
          <Appear delay={0.2} className="tablet:max-w-[460px]">
            <p className="body-sm">{findUs.copy}</p>
          </Appear>
        </div>

        <Appear delay={0.3} className="grid grid-cols-1 gap-5 desktop:grid-cols-[380px_1fr]">
          <div className="flex flex-col gap-5">
            <div className="flex gap-2 overflow-x-auto pb-1 desktop:flex-wrap" role="tablist" aria-label="Offices" data-lenis-prevent>
              {officeLocations.map((o) => {
                const active = o.slug === slug;
                return (
                  <button
                    key={o.slug}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="find-us-panel"
                    onClick={() => setSlug(o.slug)}
                    className={`caption2 shrink-0 rounded-[4px] px-3 py-2 transition-colors duration-300 ease-[var(--ease-hover)] ${
                      active ? "bg-ink-900 !text-ink-50" : "bg-ink-50 !text-ink-700 hover:bg-ink-200"
                    }`}
                  >
                    {o.town}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={office.slug}
                id="find-us-panel"
                role="tabpanel"
                className="plate flex flex-col gap-5 p-5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: APPEAR_EASE }}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex flex-col gap-1">
                    <h3 className="h5">{office.name}</h3>
                    <address className="body-sm not-italic">
                      {office.address.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </div>
                  <span
                    className={`caption2 shrink-0 rounded-[4px] px-2 py-1 ${
                      open === null ? "invisible" : open ? "bg-ink-900 !text-ink-50" : "bg-ink-200 !text-ink-700"
                    }`}
                    aria-live="polite"
                  >
                    {open ? "Open now" : "Closed now"}
                  </span>
                </div>

                <a
                  href={office.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-opacity duration-300 hover:opacity-70"
                  aria-label={`${office.rating} out of 5 on Google from ${office.reviews} reviews — opens Google Maps`}
                >
                  <Stars rating={office.rating} />
                  <span className="body-sm !text-ink-900">{office.rating.toFixed(1)}</span>
                  <span className="caption">({office.reviews} Google reviews)</span>
                </a>

                <dl className="flex flex-col">
                  {office.hours.map((h, i) => (
                    <div
                      key={h.days}
                      className={`flex items-center justify-between py-2 ${i < office.hours.length - 1 ? "border-b border-ink-200" : ""}`}
                    >
                      <dt className="caption2">{h.days}</dt>
                      <dd className="body-sm !text-ink-900">{h.time}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Button label="Get directions" href={directionsUrl(office)} external />
                  <Button variant="secondary" label={office.phone} href={`tel:${office.phone.replace(/\s/g, "")}`} />
                  <a
                    href={office.href}
                    className="caption2 flex items-center gap-1 px-1 !text-ink-700 transition-colors duration-300 hover:!text-ink-900"
                    {...(office.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <MapPin size={14} /> Office page
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <MapFrame office={office} />
        </Appear>
      </div>
    </section>
  );
}

function MapFrame({ office }: { office: OfficeLocation }) {
  return (
    <div className="plate relative min-h-[320px] overflow-clip desktop:min-h-0">
      <iframe
        key={office.slug}
        title={`Map showing the Paul Fox ${office.name} office`}
        src={embedUrl(office)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0 grayscale-[35%] contrast-[1.05]"
      />
      <a
        href={office.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="caption2 absolute bottom-4 left-4 rounded-[4px] bg-ink-50 px-2 py-1 !text-ink-900 shadow-sm transition-colors duration-300 hover:bg-ink-200"
      >
        Open in Google Maps
      </a>
    </div>
  );
}
