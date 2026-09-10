"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services } from "@/lib/content";
import type { Property } from "@/lib/properties";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/utils";

/**
 * Services — reference: a 553px row of cards, the active one wide and dark
 * (#080b0f, 24px radius, label + 28px title top-left, ".01" numeral at
 * 120px top-right, photograph filling the lower half), the others narrow
 * and #f6f6f6 with a light-grey numeral and their title bottom-left.
 * Hovering (or focusing) a card makes it the active one; the widths ease
 * with the same soft curve as everything else. On small screens the cards
 * stack and all show their content.
 */
export function Services({ images }: { images: (Property | undefined)[] }) {
  const [active, setActive] = useState(0);
  return (
    <section className="relative z-10 bg-white" aria-labelledby="services-heading">
      <div className="container section">
        <SectionHeading
          eyebrow="Our services"
          title="Everything you need to move home"
          description="New homes, part exchange, assisted move and selling your existing home — explained in plain English and handled end to end."
        />
        <ul className="mt-16 flex flex-col gap-3 lg:h-[553px] lg:flex-row" onMouseLeave={() => setActive(0)}>
          {services.map((s, i) => {
            const on = active === i;
            const img = images[i]?.images[0];
            return (
              <li
                key={s.slug}
                className={cn(
                  "relative overflow-hidden rounded-[24px] transition-[flex-grow,background-color,color] duration-[700ms] ease-out-soft",
                  on ? "bg-ink text-white lg:flex-[2.4]" : "bg-mist text-ink lg:flex-[1]"
                )}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <Link href={s.href} className="group flex h-full min-h-[300px] flex-col p-[25px] outline-none focus-visible:ring-2 focus-visible:ring-ink/60 lg:min-h-0">
                  <span aria-hidden="true" className={cn("numeral absolute right-[25px] top-[18px] transition-colors duration-700", on ? "text-white" : "text-ash")}>
                    .{s.index}
                  </span>
                  <div className={cn("relative z-10 flex flex-col gap-2 transition-all duration-700 ease-out-soft", on ? "mt-0 max-w-[360px] lg:max-w-[calc(100%-190px)]" : "mt-0 max-w-[360px] lg:mt-auto lg:max-w-[calc(100%-60px)]")}>
                    <p className={cn("text-sm", on ? "text-cloud" : "text-ink")}>{s.label}</p>
                    <h3 className="h-sub">{s.title}</h3>
                    <p className={cn("text-sm leading-relaxed transition-opacity duration-500", on ? "text-cloud/85 opacity-100" : "text-slate lg:hidden")}>{s.summary}</p>
                    <span className={cn("mt-1 text-sm underline-offset-4 group-hover:underline", on ? "text-white" : "text-ink")}>{s.cta} →</span>
                  </div>
                  {img ? (
                    <div className={cn("relative mt-6 flex-1 overflow-hidden rounded-[16px] transition-opacity duration-700", on ? "opacity-100" : "hidden")}>
                      <Image src={img.src} alt="" fill sizes="(max-width: 1023px) 100vw, 672px" className="object-cover" />
                    </div>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
