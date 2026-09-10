"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { agencyFigures } from "@/lib/content";
import type { Property } from "@/lib/properties";
import { SectionHeading } from "@/components/section-heading";
import { Appear } from "@/components/appear";
import { CloudWisps } from "@/components/clouds";

/**
 * "Our impact" — reference layout: heading row, then a 314px image, three
 * stacked stat cards (#f6f6f6, 10px radius, 25px padding, 108px tall, big
 * numeral left / uppercase 22px label right) and a second 314px image. The
 * numerals count up when the row enters view (the reference rolls each
 * digit; a count-up reads the same and stays a single text node).
 *
 * Figures are the agency's own published claims, labelled as such.
 */
export function Stats({ left, right }: { left?: Property; right?: Property }) {
  return (
    <section className="relative z-10 bg-white" aria-labelledby="impact-heading">
      <CloudWisps className="-top-24 h-64" />
      <div className="container section relative">
        <SectionHeading
          eyebrow="Why New Home Agents"
          title="Experience behind every move"
          description="A team with a proven track record of selling through house builder schemes — new homes, part exchange and assisted move — nationwide."
          as="h2"
        />
        <div className="mt-16 grid items-stretch gap-[10px] md:grid-cols-[minmax(0,314fr)_minmax(0,608fr)_minmax(0,314fr)]">
          <Appear className="relative hidden min-h-[300px] overflow-hidden rounded-[15px] bg-mist md:block">
            {left?.images[0] ? <Image src={left.images[0].src} alt={left.images[0].alt} fill quality={85} sizes="(max-width: 809px) 100vw, 314px" className="object-cover" /> : null}
          </Appear>
          <div className="flex min-w-0 flex-col gap-[5px]">
            {agencyFigures.map((f, i) => (
              <Appear key={f.label} delay={i * 0.1} className="flex min-h-[108px] items-center justify-between gap-6 rounded-[10px] bg-mist px-6 py-5 md:px-[25px]">
                <CountUp value={f.value} suffix={f.suffix} />
                <p className="h-label text-right uppercase text-graphite">{f.label}</p>
              </Appear>
            ))}
          </div>
          <Appear delay={0.15} className="relative aspect-[314/338] overflow-hidden rounded-[15px] bg-mist md:aspect-auto md:min-h-[300px]">
            {right?.images[0] ? <Image src={right.images[0].src} alt={right.images[0].alt} fill quality={85} sizes="(max-width: 809px) 100vw, 314px" className="object-cover" /> : null}
          </Appear>
        </div>
        <p className="relative mt-3 text-xs text-slate">Figures as stated by New Home Agents on newhomeagents.co.uk.</p>

      </div>
    </section>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);
  return (
    <p ref={ref} className="text-[40px] font-semibold leading-none tracking-[-0.02em] text-ink md:text-[44px]">
      <span className="sr-only">{value.toLocaleString("en-GB")}{suffix}</span>
      <span aria-hidden="true">{(reduced ? value : n).toLocaleString("en-GB")}{suffix}</span>
    </p>
  );
}
