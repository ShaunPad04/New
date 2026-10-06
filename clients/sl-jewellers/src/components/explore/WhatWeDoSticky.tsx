"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TILES } from "@/components/sections/ServiceTiles";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * What we do B, "Sticky story" (round 3; 21st "Scroll 01"): the three services as a scroll
 * story. The photo stays put on the left and changes to the service being read on the right.
 * Phones get each photo inline above its text.
 */
export default function WhatWeDoSticky() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.step))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.current.forEach((s) => s && io.observe(s));
    return () => io.disconnect();
  }, []);
  return (
    <section className="on-black section" aria-labelledby="tiles-title-b">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <SplitHeading id="tiles-title-b" text={"Exchange, source,\n*repair.*"} className="display-l mt-3" />
        </Reveal>
        <div className="wwd mt-12">
          <div className="wwd-media" aria-hidden="true">
            {TILES.map((t, i) => (
              <Image key={t.href} src={t.image} alt="" fill sizes="(min-width: 1024px) 44vw, 1px" className={`wwd-img${i === active ? " is-on" : ""}`} />
            ))}
            <span className="wwd-count tnum">
              {String(active + 1).padStart(2, "0")} / {String(TILES.length).padStart(2, "0")}
            </span>
          </div>
          <ol className="wwd-steps">
            {TILES.map((t, i) => (
              <li key={t.href} data-step={i} ref={(n) => void (steps.current[i] = n)} className={`wwd-step${i === active ? " is-on" : ""}`}>
                <span className="wwd-inline">
                  <Image src={t.image} alt={t.alt} fill sizes="(max-width: 1023px) 92vw, 1px" className="object-cover" />
                </span>
                <p className="wwd-num tnum">{String(i + 1).padStart(2, "0")}</p>
                <p className="st-eyebrow">
                  <span className="st-dot" style={{ background: t.accent }} aria-hidden="true" />
                  {t.category}
                </p>
                <h3 className="wwd-title">{t.title}</h3>
                <p className="wwd-desc">{t.description}</p>
                <ul className="st-tags" aria-label="Covers">
                  {t.tags.map((g) => (
                    <li key={g} className="st-tag">
                      {g}
                    </li>
                  ))}
                </ul>
                <Link href={t.href} className="plan-cta mt-6">
                  <span>{t.cta}</span>
                  <span className="plan-disc" aria-hidden="true">
                    <svg viewBox="0 0 16 16" className="plan-arrow"><path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
