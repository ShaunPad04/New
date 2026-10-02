import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Corner-bracket button: four hairline corners, no box. */
export function BracketLink({
  href,
  children,
  className,
  roll = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /**
   * Hero CTA (Brad, 2026-09-28: "when you hover over it it should change or
   * have some form of motion"): a white fill rises from the foot and the
   * label rolls up to a black copy, as BracketButton does. Transform only;
   * reduced motion keeps the corners, no travel.
   */
  roll?: boolean;
}) {
  const c = "absolute h-2.5 w-2.5 border-ink-1000 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const ease = "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";
  if (roll) {
    children = (
      <>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <span className={cn("absolute inset-0 translate-y-full bg-ink-1000 group-hover:translate-y-0 group-focus-visible:translate-y-0", ease)} />
        </span>
        <span className="relative block overflow-hidden py-1">
          <span className={cn("block group-hover:-translate-y-[130%] group-focus-visible:-translate-y-[130%]", ease)}>{children}</span>
          <span
            aria-hidden="true"
            className={cn("absolute inset-0 flex translate-y-[130%] items-center justify-center text-ink-0 group-hover:translate-y-0 group-focus-visible:translate-y-0", ease)}
          >
            {children}
          </span>
        </span>
      </>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        "btn-grain group relative inline-flex min-h-14 items-center justify-center px-12 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] text-ink-1000",
        className,
      )}
    >
      <span aria-hidden="true" className={cn(c, "left-0 top-0 border-l border-t group-hover:-left-1 group-hover:-top-1")} />
      <span aria-hidden="true" className={cn(c, "right-0 top-0 border-r border-t group-hover:-right-1 group-hover:-top-1")} />
      <span aria-hidden="true" className={cn(c, "bottom-0 left-0 border-b border-l group-hover:-bottom-1 group-hover:-left-1")} />
      <span aria-hidden="true" className={cn(c, "bottom-0 right-0 border-b border-r group-hover:-bottom-1 group-hover:-right-1")} />
      {children}
    </Link>
  );
}
