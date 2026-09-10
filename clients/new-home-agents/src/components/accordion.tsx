"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * FAQ accordion — reference geometry: #f6f6f6 items with 16px radius and
 * 20px padding, a 24px circular plus icon on the right, 10px between
 * items; one open at a time, the answer fading in over 600ms while the
 * item's height eases. The first item starts open, as on the reference.
 */
export function Accordion({ items, className }: { items: readonly { q: string; a: string }[]; className?: string }) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={cn("flex flex-col gap-[10px]", className)}>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q} className="rounded-[16px] bg-mist p-5">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-3 text-left text-lg font-medium text-ink"
              >
                <span>{it.q}</span>
                <span aria-hidden="true" className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/15">
                  <span className="absolute h-[2px] w-[10px] bg-ink" />
                  <span className={cn("absolute h-[10px] w-[2px] bg-ink transition-transform duration-500 ease-out-soft", on && "rotate-90")} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-${i}`}
              className={cn("grid transition-[grid-template-rows] duration-500 ease-out-soft", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className={cn("pt-3 text-sm leading-relaxed text-slate transition-opacity duration-[600ms]", on ? "opacity-100" : "opacity-0")}>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
