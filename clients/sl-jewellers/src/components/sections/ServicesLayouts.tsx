"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/content";

/**
 * The services page, three new ways (round 8 on the switch, ?v=svc:a|b|c), after Shaun: "for the
 * page which is still like sell it, swap it, get it sent, we need another layout". Every word
 * is S&L's own from content/services.json; the pictures are the service illustrations
 * (assets/SOURCES.md).
 *   A  Index: one numbered row per service, its picture beside it.
 *   B  Sticky picture: the list scrolls past a picture that changes to the service in view.
 *   C  Bento: the services as picture tiles, the first one large.
 */
export const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  "sell-your-gold": { src: "/images/services/exchange.2026-10-06-3.webp", alt: "A yellow-gold Rolex Submariner with a blue dial and bezel lying across a heavy gold Cuban link chain, on black stone" },
  "part-exchange": { src: "/images/services/part-exchange.2026-10-07.webp", alt: "A two-tone Datejust and a gold Submariner side by side on black stone, as if one is swapped for the other" },
  delivery: { src: "/images/services/delivery.2026-10-07.webp", alt: "A gold chain in an open black box beside a wrapped parcel" },
  repairs: { src: "/images/services/repairs.2026-10-06-2.webp", alt: "A fine laser welder joining a link of an engraved gold belcher bracelet, sparks at the joint" },
  "sourced-and-made-to-order": { src: "/images/services/sourcing.2026-10-06-3.webp", alt: "A steel Rolex GMT-Master II with a grey and black bezel on the cushion of an open green Rolex presentation box" },
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

/* A · Index */
export function ServicesIndex({ services }: { services: Service[] }) {
  return (
    <ol className="sva">
      {services.map((s, i) => (
        <li key={s.slug} className="sva-row">
          <span className="sva-n tnum">{num(i)}</span>
          <div className="sva-text">
            <h2 className="svx-title">{s.title}</h2>
            <p className="svx-lead">{s.lead}</p>
            <Points s={s} />
            <Cta s={s} />
          </div>
          <div className="sva-media">
            <Image src={img(s).src} alt={img(s).alt} fill sizes="(min-width: 1024px) 26vw, 92vw" className="object-cover" />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* B · Sticky picture */
export function ServicesSticky({ services }: { services: Service[] }) {
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
            <Image src={img(s).src} alt="" fill sizes="(min-width: 1024px) 40vw, 1px" className="object-cover" />
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
              <Image src={img(s).src} alt={img(s).alt} fill sizes="92vw" className="object-cover" />
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

/* C · Bento */
export function ServicesBento({ services }: { services: Service[] }) {
  return (
    <ul className="svc">
      {services.map((s, i) => (
        <li key={s.slug} className={`svc-tile${i === 0 ? " is-big" : ""}`}>
          <div className="svc-media">
            <Image src={img(s).src} alt={img(s).alt} fill sizes={i === 0 ? "(min-width: 1024px) 50vw, 92vw" : "(min-width: 1024px) 25vw, 92vw"} className="object-cover" />
          </div>
          <div className="svc-body">
            <span className="sva-n tnum">{num(i)}</span>
            <h2 className="svx-title">{s.title}</h2>
            <p className="svx-lead">{s.lead}</p>
            <Points s={s} />
            <Cta s={s} />
          </div>
        </li>
      ))}
    </ul>
  );
}
