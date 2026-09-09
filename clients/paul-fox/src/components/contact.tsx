"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { contact } from "@/lib/content";
import { Appear } from "./appear";
import { ArrowUpRight } from "./icons";

type Status = "idle" | "pending" | "done";

const INPUT =
  "mono h-[55px] w-full border-0 border-b border-ink-400 bg-transparent text-[16px] text-ink-200 outline-none transition-colors duration-300 placeholder:text-ink-400 focus:border-white";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("pending");
    window.setTimeout(() => setStatus("done"), 1200);
  };

  return (
    <section data-dark className="section-lg relative overflow-clip bg-ink-900 tablet:h-[752px]">
      <img src={contact.background} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="dark-strip absolute inset-0" />
      <div className="container relative flex flex-col gap-10">
        <div className="flex flex-col gap-5 tablet:flex-row tablet:items-end tablet:justify-between">
          <div className="flex flex-col gap-3 tablet:max-w-[460px]">
            <Appear>
              <p className="caption2 !text-ink-50">{contact.eyebrow}</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2 !text-ink-50">{contact.heading}</h2>
            </Appear>
          </div>
          <Appear delay={0.2} className="tablet:max-w-[460px]">
            <p className="body-sm !text-ink-50">{contact.copy}</p>
          </Appear>
        </div>

        <Appear delay={0.3} className="flex justify-end">
          <form
            onSubmit={onSubmit}
            className="glass flex w-full max-w-[460px] flex-col gap-5 rounded-lg p-5"
            aria-label="Contact form"
          >
            <label className="flex flex-col">
              <span className="body-sm !text-ink-300">{contact.fields.name}</span>
              <input name="name" type="text" autoComplete="name" className={INPUT} />
            </label>
            <label className="flex flex-col">
              <span className="body-sm !text-ink-300">{contact.fields.email}</span>
              <input name="email" type="email" required autoComplete="email" className={INPUT} />
            </label>
            <label className="flex flex-col">
              <span className="body-sm !text-ink-300">{contact.fields.phone}</span>
              <input name="phone" type="tel" autoComplete="tel" className={INPUT} />
            </label>
            <label className="flex flex-col">
              <span className="body-sm !text-ink-300">{contact.fields.message}</span>
              <textarea name="message" className={`${INPUT} min-h-[80px] resize-y pt-4`} />
            </label>
            <motion.button
              type="submit"
              className="flex h-10 w-[240px] items-center justify-between rounded-[4px] bg-ink-200 px-2 text-ink-900"
              initial="rest"
              whileHover="hover"
              animate="rest"
              aria-live="polite"
              disabled={status !== "idle"}
            >
              <span className="caption2 !text-ink-900">{status === "done" ? contact.sent : contact.submit}</span>
              {status === "pending" ? (
                <span className="spinner" aria-label="Sending" />
              ) : (
                <motion.span
                  className="flex"
                  variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.6 }}
                >
                  <ArrowUpRight />
                </motion.span>
              )}
            </motion.button>
          </form>
        </Appear>
      </div>
    </section>
  );
}
