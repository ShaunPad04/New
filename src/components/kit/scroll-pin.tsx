"use client";

import { useRef, type ReactNode } from "react";
import { useScrollProgress } from "./use-kit";
import { cn } from "@/lib/utils";

/**
 * SCROLL PIN — holds its content in the middle of the screen while the
 * reader scrolls through a taller track, and writes that progress to `--p`
 * so a `ScrollText pinned` inside it lights word by word and is COMPLETE
 * before the page moves on (Brad, 2026-09-26: "it should only let you
 * continue going down the site once it's revealed all the text").
 *
 * Native `position: sticky`, never a ScrollTrigger pin — the same reason the
 * process ride uses sticky (CLAUDE.md): a pin stores a start measured at
 * creation, and the hero above inserts its own spacer later.
 *
 * The track's height only exists with scripting on and motion allowed
 * (`.kit-pin` in kit.css). Otherwise it is an ordinary block, `--p` is never
 * written, and the text is simply lit — content is never gated.
 */
export function ScrollPin({
  children,
  className,
  stageClassName,
}: {
  children: ReactNode;
  className?: string;
  stageClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, "pin");
  return (
    <div ref={ref} className={cn("kit-pin", className)}>
      <div className={cn("kit-pin-stage", stageClassName)}>{children}</div>
    </div>
  );
}
