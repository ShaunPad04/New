"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "./icons";

type Status = "idle" | "pending" | "done";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  autoComplete?: string;
  options?: string[];
  /** Pre-filled, read-only value (e.g. the property address on an enquiry). */
  value?: string;
};

type Props = {
  fields: Field[];
  submit: string;
  sent: string;
  /** Dark glass surface (as on the homepage) or the light card used on inner pages. */
  tone?: "dark" | "light";
  consent?: string;
  label: string;
};

const INPUT_DARK =
  "mono h-[55px] w-full border-0 border-b border-ink-400 bg-transparent text-[16px] text-ink-200 outline-none transition-colors duration-300 placeholder:text-ink-400 focus:border-white";
const INPUT_LIGHT =
  "mono h-[55px] w-full border-0 border-b border-ink-300 bg-transparent text-[16px] text-ink-900 outline-none transition-colors duration-300 placeholder:text-ink-400 focus:border-ink-900";

/**
 * Front-end-only enquiry form (idle → pending → sent). The live site posts
 * to WordPress/Gravity Forms; there is no endpoint here yet, so the form
 * settles into its sent state after a short delay without sending anything.
 */
export function EnquiryForm({ fields, submit, sent, tone = "light", consent, label }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const dark = tone === "dark";
  const input = dark ? INPUT_DARK : INPUT_LIGHT;
  const labelCls = dark ? "body-sm !text-ink-300" : "body-sm !text-ink-600";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("pending");
    window.setTimeout(() => setStatus("done"), 1200);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full flex-col gap-5 rounded-lg p-5 ${dark ? "glass" : "bg-ink-50"}`}
      aria-label={label}
    >
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col">
          <span className={labelCls}>
            {f.label}
            {f.required ? " *" : ""}
          </span>
          {f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} className={`${input} min-h-[80px] resize-y pt-4`} />
          ) : f.type === "select" ? (
            <select name={f.name} required={f.required} className={`${input} appearance-none`} defaultValue="">
              <option value="" disabled>
                Select…
              </option>
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              autoComplete={f.autoComplete}
              defaultValue={f.value}
              readOnly={f.value !== undefined}
              className={input}
            />
          )}
        </label>
      ))}
      {consent && <p className={`caption ${dark ? "!text-ink-300" : ""}`}>{consent}</p>}
      <motion.button
        type="submit"
        className={`flex h-10 w-full max-w-[260px] items-center justify-between rounded-[4px] px-2 ${dark ? "bg-ink-200 text-ink-900" : "bg-ink-900 text-ink-50"}`}
        initial="rest"
        whileHover="hover"
        animate="rest"
        aria-live="polite"
        disabled={status !== "idle"}
      >
        <span className="caption2 !text-current">{status === "done" ? sent : submit}</span>
        {status === "pending" ? (
          <span className={`spinner ${dark ? "" : "!border-ink-50/30 !border-t-ink-50"}`} aria-label="Sending" />
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
  );
}
