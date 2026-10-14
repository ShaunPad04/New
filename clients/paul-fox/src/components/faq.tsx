"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faq } from "@/lib/content";
import { Appear } from "./appear";
import { Button } from "./button";
import { Plus } from "./icons";

const ACCORDION = { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as const };

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section">
      <div className="container flex flex-col gap-10">
        <div className="flex flex-col gap-5 tablet:flex-row tablet:items-end tablet:justify-between">
          <div className="flex flex-col gap-3 tablet:max-w-[460px]">
            <Appear>
              <p className="caption2">{faq.eyebrow}</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">{faq.heading}</h2>
            </Appear>
          </div>
          <div className="flex flex-col gap-5 tablet:max-w-[460px]">
            <Appear delay={0.2}>
              <p className="body-sm">{faq.copy}</p>
            </Appear>
            <Appear delay={0.3}>
              <Button label={faq.cta.label} href={faq.cta.href} />
            </Appear>
          </div>
        </div>

        <div className="flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-10">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              return (
                <Appear key={item.number} delay={0.4 + i * 0.1}>
                  <div className="flex gap-5 border-b border-ink-200 pb-5">
                    <p className="h5">{item.number}</p>
                    <div className="flex flex-1 flex-col gap-2">
                      <h6 className="h6">
                        <button
                          type="button"
                          className="w-full text-left"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpen(isOpen ? null : i)}
                        >
                          {item.question}
                        </button>
                      </h6>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            key="panel"
                            className="overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={ACCORDION}
                          >
                            <p className="body-sm">{item.answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex h-7 w-9 shrink-0 items-center justify-center rounded-[4px] bg-ink-200 text-ink-900"
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <motion.span
                        className="flex"
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={ACCORDION}
                      >
                        <Plus />
                      </motion.span>
                    </button>
                  </div>
                </Appear>
              );
            })}
          </div>
          <Appear delay={0.4} className="flex-1">
            <img
              src={faq.image.src}
              alt={faq.image.alt}
              loading="lazy"
              className="h-[404px] w-full rounded-lg object-cover"
            />
          </Appear>
        </div>
      </div>
    </section>
  );
}
