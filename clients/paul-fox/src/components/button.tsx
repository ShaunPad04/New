"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "./icons";

type Variant = "primary" | "secondary" | "icon";

type ButtonProps = {
  label?: string;
  href?: string;
  variant?: Variant;
  /** Render as a <span> when nested inside another <a>. */
  as?: "a" | "span" | "button";
  type?: "button" | "submit";
  external?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler;
};

const surface: Record<Variant, string> = {
  primary: "bg-ink-900 text-ink-50",
  secondary: "bg-ink-200 text-ink-900",
  icon: "bg-ink-50 text-ink-900",
};

const ARROW_SPRING = { type: "spring", stiffness: 300, damping: 20, mass: 0.6 } as const;

/**
 * Shared button. 28px tall, radius 4, px 8, caption2 label, 16px arrow that
 * rotates 45° on hover. Icon variant is a 32×28 chip with the arrow only.
 */
export function Button({
  label,
  href,
  variant = "primary",
  as,
  type = "button",
  external,
  className = "",
  onClick,
}: ButtonProps) {
  const isIcon = variant === "icon";
  const base = isIcon
    ? "inline-flex h-7 w-8 items-center justify-center rounded-[4px]"
    : "inline-flex h-7 items-center justify-between gap-5 rounded-[4px] px-2";
  const classes = `${base} ${surface[variant]} ${className}`;
  const content = (
    <>
      {!isIcon && <span className="caption2 !text-current">{label}</span>}
      <motion.span
        className="flex h-4 w-4 items-center justify-center"
        variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
        transition={ARROW_SPRING}
      >
        <ArrowUpRight />
      </motion.span>
    </>
  );

  const tag = as ?? (href ? "a" : "button");
  if (tag === "span") {
    return (
      <motion.span className={classes} initial="rest" whileHover="hover" animate="rest">
        {content}
      </motion.span>
    );
  }
  if (tag === "button") {
    return (
      <motion.button
        type={type}
        className={classes}
        initial="rest"
        whileHover="hover"
        animate="rest"
        onClick={onClick}
      >
        {content}
      </motion.button>
    );
  }
  return (
    <motion.a
      href={href}
      className={classes}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={onClick}
      aria-label={isIcon ? label : undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {content}
    </motion.a>
  );
}
