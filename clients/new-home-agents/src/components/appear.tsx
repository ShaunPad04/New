"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Appear — the reference's entrance effect, measured with the Web
 * Animations API: opacity 0→1 and translateY(60px→0) over 1.1s with a
 * strong ease-out (≈77% of the travel in the first quarter), staggered
 * 0 / 200 / 300ms across siblings. Runs once when 10% of the element is in
 * view. Under reduced motion the content renders in place immediately.
 */
export function Appear({
  children,
  className,
  delay = 0,
  y = 60,
  duration = 1.1,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: "div" | "section" | "li" | "span" | "article" | "figure";
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.1, margin: "0px 0px -8% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/**
 * Per-character fade — the reference splits headings and labels into
 * characters and fades each in over ~1.5s (1.15s for short labels), the
 * delay stepping 50ms per line/word. The heading stays a single text node
 * for assistive tech: the animated characters are aria-hidden and the full
 * string is provided visually-hidden.
 */
export function TextReveal({
  text,
  className,
  delay = 0.2,
  step = 0.012,
  duration = 1.5,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  duration?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const reduced = useReducedMotion();
  if (reduced) return <Tag className={className}>{text}</Tag>;
  const words = text.split(" ");
  let i = 0;
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
            {[...word].map((ch, c) => {
              const d = delay + i++ * step;
              return (
                <motion.span
                  key={c}
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration, delay: d, ease: "easeOut" }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {w < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}
