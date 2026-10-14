"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/lib/content";
import { asset } from "@/lib/assets";
import { Appear } from "./appear";
import { MapPin } from "./icons";

const FADE = { duration: 0.3 };

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const items = testimonials.items;

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), testimonials.intervalMs);
    return () => window.clearInterval(id);
  }, [index, items.length]);

  const slide = items[index];

  return (
    <section className="section">
      <div className="container flex flex-col gap-10">
        <Appear>
          <p className="caption2">{testimonials.eyebrow}</p>
        </Appear>

        <Appear delay={0.1} className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 tablet:flex-row" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`img-${index}`}
                className="flex h-[345px] flex-1 gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={FADE}
              >
                <div className="flex flex-1 flex-col gap-2">
                  <img src={asset(slide.images[0])} alt="" loading="lazy" className="min-h-0 flex-1 rounded-lg object-cover" />
                  <img src={asset(slide.images[1])} alt="" loading="lazy" className="h-[180px] rounded-lg object-cover" />
                </div>
                <img src={asset(slide.images[2])} alt="" loading="lazy" className="h-full min-w-0 flex-1 rounded-lg object-cover" />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={`quote-${index}`}
                className="m-0 flex h-[346px] flex-1 flex-col justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={FADE}
              >
                <blockquote className="m-0">
                  <p className="h5">{slide.quote}</p>
                </blockquote>
                <figcaption className="flex min-h-[82px] flex-col gap-2">
                  <p className="body-lg !text-ink-900">{slide.name}</p>
                  <p className="caption flex items-center gap-1.5">
                    <MapPin />
                    {slide.location}
                  </p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div>
            <div className="flex gap-1" role="tablist" aria-label="Testimonials">
              {items.map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show testimonial ${i + 1}`}
                  className="flex flex-1 py-2"
                  onClick={() => setIndex(i)}
                >
                  <span
                    className="block h-px w-full transition-colors duration-300"
                    style={{ background: i === index ? "var(--color-ink-900)" : "var(--color-ink-200)" }}
                  />
                </button>
              ))}
            </div>
            <p className="mono text-right text-[14px] text-ink-500">
              {index + 1}/{items.length}
            </p>
          </div>
        </Appear>
      </div>
    </section>
  );
}
