"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/content";

/**
 * The services, "Sticky picture" (Shaun's pick B of three in round 8, 7 Oct 2026, after "for
 * the page which is still like sell it, swap it, get it sent, we need another layout"): the
 * list scrolls past a picture that holds still and changes to the service in view. On a phone
 * each service carries its own picture instead. Every word is S&L's own from
 * content/services.json; the pictures are the service illustrations (assets/SOURCES.md).
 */
export const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  "sell-your-gold": { src: "/images/services/exchange.2026-10-06-3.webp", alt: "A yellow-gold Rolex Submariner with a blue dial and bezel lying across a heavy gold Cuban link chain, on black stone" },
  "part-exchange": { src: "/images/services/part-exchange.2026-10-07.webp", alt: "A two-tone Datejust and a gold Submariner side by side on black stone, as if one is swapped for the other" },
  delivery: { src: "/images/services/delivery.2026-10-07.webp", alt: "A gold chain in an open black box beside a wrapped parcel" },
  repairs: { src: "/images/services/repairs.2026-10-06-2.webp", alt: "A fine laser welder joining a link of an engraved gold belcher bracelet, sparks at the joint" },
  "sourced-and-made-to-order": { src: "/images/services/sourcing.2026-10-08.webp", alt: "A steel Rolex GMT-Master II with a grey and black bezel on the cushion of an open green presentation box" },
};
const img = (s: Service) => SERVICE_IMAGES[s.slug] ?? SERVICE_IMAGES["sell-your-gold"];
const href = (s: Service) => `/enquiry?type=${s.enquiryType}&item=${encodeURIComponent(s.title)}`;
const num = (i: number) => String(i + 1).padStart(2, "0");

function Cta({ s }: { s: Service }) {
  return (
    <Link href={href(s)} className="plan-cta">
      <span>{s.cta}</span>
      <span className="plan-disc" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="plan-arrow">
          <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="sr-only">: {s.title}</span>
    </Link>
  );
}

function Points({ s }: { s: Service }) {
  if (!s.points.length) return null;
  return (
    <ul className="svx-points">
      {s.points.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  );
}

export default function ServicesSticky({ services }: { services: Service[] }) {
  const [on, setOn] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <div className="svb">
      <div className="svb-frame" aria-hidden="true">
        {services.map((s, i) => (
          <div key={s.slug} className={`svb-img${i === on ? " is-on" : ""}`}>
            {/* the first picture is the page's largest paint (the frame on a computer, the inline
                one on a phone), so both load at once; each one's sizes make the copy for the
                layout that hides it a 96 px thumbnail */}
            <Image src={img(s).src} alt="" fill sizes="(min-width: 1024px) 40vw, 1px" className="object-cover" priority={i === 0} />
          </div>
        ))}
        <span className="svb-count tnum">
          {num(on)} / {num(services.length - 1)}
        </span>
      </div>
      <div className="svb-list">
        {services.map((s, i) => (
          <article
            key={s.slug}
            data-i={i}
            ref={(el) => {
              items.current[i] = el;
            }}
            className={`svb-item${i === on ? " is-on" : ""}`}
          >
            <div className="svb-inline">
              <Image src={img(s).src} alt={img(s).alt} fill sizes="(min-width: 1024px) 1px, 92vw" className="object-cover" priority={i === 0} />
            </div>
            <span className="sva-n tnum">{num(i)}</span>
            <h2 className="svx-title">{s.title}</h2>
            <p className="svx-lead">{s.lead}</p>
            <Points s={s} />
            <Cta s={s} />
          </article>
        ))}
      </div>
    </div>
  );
}
